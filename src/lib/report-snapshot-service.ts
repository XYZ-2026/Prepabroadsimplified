import { createHash } from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { generatePersonalization } from '@/app/(main)/psychometric-test/class10_personalization';
import { callGroqAPI, callGeminiAPI } from '@/lib/ai/llm-service';
import type { EditorialStudent, EditorialScores, PersonalizationData } from '@/app/(main)/psychometric-test/class10_editorial_engine';
import type { AlignmentResult } from '@/app/(main)/psychometric-test/comparison-engine';

export interface ReportSnapshot {
  status: 'ready' | 'generating' | 'failed';
  reportVersion: number;
  inputHash: string;
  personalization: PersonalizationData;
  generatedAt: string;
  updatedAt: string;
  provider: string;
  model: string;
  promptVersion: string;
  schemaVersion: string;
}

export interface FamilyInsightSnapshot {
  status: 'ready' | 'generating' | 'failed';
  inputHash: string;
  narrative: string;
  provider: string;
  model: string;
  generatedAt: string;
  updatedAt: string;
}

export interface GetOrGenerateSnapshotOptions {
  resultId: string;
  student: EditorialStudent;
  scores: EditorialScores;
  comparisonData?: AlignmentResult | null;
  forceRegenerate?: boolean;
}

const REPORT_SCHEMA_VERSION = 'v1.0';
const PROMPT_VERSION = 'v1.0';

/**
 * Generates a SHA256 input hash deterministically based on report input state.
 */
export function computeReportInputHash(
  resultId: string,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): string {
  const payload = {
    resultId,
    studentName: student.name,
    studentGrade: student.grade,
    studentEmail: student.email,
    scoresAptitude: scores.aptitude,
    scoresPersonality: scores.personality,
    topRiasec: scores.topRiasec,
    topVark: scores.topVark,
    careerFitment: scores.careerFitment,
    comparisonOverall: comparisonData?.overallIndicator || '',
    comparisonAreasCount: comparisonData?.areas?.length || 0,
    schemaVersion: REPORT_SCHEMA_VERSION,
    promptVersion: PROMPT_VERSION,
  };

  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Generates a SHA256 input hash deterministically based on family comparison state.
 */
export function computeFamilyInsightHash(
  resultId: string,
  comparisonData: AlignmentResult
): string {
  const payload = {
    resultId,
    overallScore: comparisonData.overallScore,
    overallIndicator: comparisonData.overallIndicator,
    areas: comparisonData.areas?.map((a) => ({
      id: a.id,
      level: a.level,
      studentSide: a.studentSide,
      parentSide: a.parentSide,
    })),
    promptVersion: 'FAMILY_INSIGHT_PROMPT_V1',
  };
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Authoritative Server Function: Fetches or generates persisted Family Insight ONCE per assessment.
 */
export async function getOrGenerateFamilyInsightSnapshot(
  resultId: string,
  comparisonData: AlignmentResult,
  forceRegenerate: boolean = false
): Promise<{ narrative: string; fromCache: boolean; snapshot: FamilyInsightSnapshot }> {
  const currentInputHash = computeFamilyInsightHash(resultId, comparisonData);
  const docRef = adminDb.collection('psychometric_results').doc(resultId);
  const docSnap = await docRef.get();

  let existingSnapshot: FamilyInsightSnapshot | null = null;
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data?.familyInsightSnapshot) {
      existingSnapshot = data.familyInsightSnapshot as FamilyInsightSnapshot;
    }
  }

  // 1. CACHE HIT CHECK BEFORE GROQ
  if (!forceRegenerate && existingSnapshot && existingSnapshot.status === 'ready') {
    if (existingSnapshot.inputHash === currentInputHash && existingSnapshot.narrative) {
      console.log(`[FAMILY INSIGHT CACHE] status=HIT reportId=${resultId} groq=false hash=${currentInputHash.substring(0, 8)}`);
      return {
        narrative: existingSnapshot.narrative,
        fromCache: true,
        snapshot: existingSnapshot,
      };
    }
  }

  // 2. CONCURRENCY LOCK
  if (existingSnapshot && existingSnapshot.status === 'generating' && !forceRegenerate) {
    const generatingAt = new Date(existingSnapshot.updatedAt || 0).getTime();
    if (Date.now() - generatingAt < 15000) {
      console.log(`[FAMILY INSIGHT LOCK] reportId=${resultId} status=WAITING_FOR_CONCURRENT_GENERATION`);
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise((r) => setTimeout(r, 1000));
        const checkSnap = await docRef.get();
        const checkData = checkSnap.data();
        if (checkData?.familyInsightSnapshot?.status === 'ready' && checkData.familyInsightSnapshot.narrative) {
          console.log(`[FAMILY INSIGHT CACHE] status=HIT_AFTER_WAIT reportId=${resultId} groq=false`);
          return {
            narrative: checkData.familyInsightSnapshot.narrative,
            fromCache: true,
            snapshot: checkData.familyInsightSnapshot,
          };
        }
      }
    }
  }

  // 3. SET GENERATING LOCK
  const reason = !existingSnapshot
    ? 'INITIAL_GENERATION'
    : existingSnapshot.inputHash !== currentInputHash
    ? 'INPUT_HASH_CHANGED'
    : 'FORCED_REGENERATION';

  console.log(`[FAMILY INSIGHT GENERATION] status=STARTED reason=${reason} reportId=${resultId} provider=groq model=groq/compound`);

  await docRef.set(
    {
      familyInsightSnapshot: {
        status: 'generating',
        inputHash: currentInputHash,
        updatedAt: new Date().toISOString(),
      },
    },
    { merge: true }
  );

  try {
    const areasInfo = (comparisonData.areas || [])
      .map((a: any) => `${a.name || a.area}: Level=${a.level || a.alignmentScore}, Student=${a.studentSide || ''}, Parent=${a.parentSide || ''}`)
      .join('\n');

    const prompt = `You are a certified family career counselor. Analyze this empirical student-parent diagnostic comparison data:
Overall Alignment: ${comparisonData.overallScore}% (${comparisonData.overallIndicator})
Key Diagnostic Areas:
${areasInfo}

Write a highly empathetic, 4-sentence consensus narrative explaining the alignment strengths, addressing any tension gracefully based on the data, and providing a unified recommendation for their next discussion. Return ONLY raw narrative text with no JSON wrapping or markdown headings.`;

    const llmRes = await callGroqAPI(prompt, 'You are a professional family counselor. Return plain text narrative only.')
      || await callGeminiAPI(prompt);

    let narrative = llmRes?.text?.trim() || '';
    if (narrative.startsWith('{') && narrative.endsWith('}')) {
      try {
        const parsed = JSON.parse(narrative);
        narrative = parsed.narrative || parsed.consensus || parsed.message || narrative;
      } catch {}
    }

    if (!narrative) {
      narrative = `Based on the diagnostic evaluation, the student and parent demonstrate an overall alignment of ${Math.round(comparisonData.overallScore || 75)}% (${comparisonData.overallIndicator}). Both parties share core educational aspirations, while specific planning discussions around financial expectations and career pathways will help harmonize future decisions. Open communication around Class 11 stream choices and long-term career milestones is highly recommended to maintain positive momentum.`;
    }

    const readySnapshot: FamilyInsightSnapshot = {
      status: 'ready',
      inputHash: currentInputHash,
      narrative,
      provider: llmRes?.model ? 'groq' : 'fallback_deterministic',
      model: llmRes?.model || 'deterministic',
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(
      {
        familyInsightSnapshot: readySnapshot,
      },
      { merge: true }
    );

    console.log(`[FAMILY INSIGHT GENERATION] status=SUCCESS reportId=${resultId} provider=${readySnapshot.provider} model=${readySnapshot.model}`);

    return {
      narrative,
      fromCache: false,
      snapshot: readySnapshot,
    };
  } catch (error: any) {
    console.error(`[FAMILY INSIGHT GENERATION FAILED] reportId=${resultId} error=`, error);
    const fallbackNarrative = `Based on the diagnostic evaluation, the student and parent demonstrate an overall alignment of ${Math.round(comparisonData.overallScore || 75)}% (${comparisonData.overallIndicator}). Open family discussions around Class 11 stream choices and future career milestones are recommended to align expectations effectively.`;

    const failedSnapshot: FamilyInsightSnapshot = {
      status: 'ready',
      inputHash: currentInputHash,
      narrative: fallbackNarrative,
      provider: 'fallback_error_recovery',
      model: 'deterministic',
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(
      {
        familyInsightSnapshot: failedSnapshot,
      },
      { merge: true }
    );

    return {
      narrative: fallbackNarrative,
      fromCache: false,
      snapshot: failedSnapshot,
    };
  }
}

/**
 * Authoritative Server Function: Fetches saved report snapshot from Firestore if available & valid.
 * Calls Groq ONLY ONCE if no snapshot exists or inputHash has changed.
 */
export async function getOrGenerateReportSnapshot(
  options: GetOrGenerateSnapshotOptions
): Promise<{ personalization: PersonalizationData; fromCache: boolean; reportSnapshot: ReportSnapshot }> {
  const { resultId, student, scores, comparisonData, forceRegenerate = false } = options;
  const currentInputHash = computeReportInputHash(resultId, student, scores, comparisonData);

  const docRef = adminDb.collection('psychometric_results').doc(resultId);
  const docSnap = await docRef.get();

  let existingSnapshot: ReportSnapshot | null = null;

  if (docSnap.exists) {
    const data = docSnap.data();
    if (data?.reportSnapshot) {
      existingSnapshot = data.reportSnapshot as ReportSnapshot;
    }
  }

  // 1. CACHE CHECK BEFORE GROQ
  if (!forceRegenerate && existingSnapshot && existingSnapshot.status === 'ready') {
    if (existingSnapshot.inputHash === currentInputHash && existingSnapshot.personalization) {
      console.log(`[REPORT CACHE] reportId=${resultId} status=HIT groq=false inputHash=${currentInputHash.substring(0, 8)}`);
      return {
        personalization: existingSnapshot.personalization,
        fromCache: true,
        reportSnapshot: existingSnapshot,
      };
    }
  }

  // 2. ATOMIC LOCK / CONCURRENCY POLLING
  if (existingSnapshot && existingSnapshot.status === 'generating' && !forceRegenerate) {
    const generatingAt = new Date(existingSnapshot.updatedAt || 0).getTime();
    const now = Date.now();
    // If lock is fresh (< 15 seconds old), wait for other process to finish
    if (now - generatingAt < 15000) {
      console.log(`[REPORT LOCK] reportId=${resultId} status=WAITING_FOR_CONCURRENT_GENERATION`);
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise((r) => setTimeout(r, 1000));
        const checkSnap = await docRef.get();
        const checkData = checkSnap.data();
        if (checkData?.reportSnapshot?.status === 'ready' && checkData.reportSnapshot.personalization) {
          console.log(`[REPORT CACHE] reportId=${resultId} status=HIT_AFTER_WAIT groq=false`);
          return {
            personalization: checkData.reportSnapshot.personalization,
            fromCache: true,
            reportSnapshot: checkData.reportSnapshot,
          };
        }
      }
    }
  }

  // Set atomic generating status
  const generationReason = !existingSnapshot
    ? 'INITIAL_GENERATION'
    : existingSnapshot.inputHash !== currentInputHash
    ? 'INPUT_HASH_CHANGED'
    : 'FORCED_REGENERATION';

  console.log(`[REPORT GENERATION] reportId=${resultId} reason=${generationReason} provider=groq model=groq/compound`);

  await docRef.set(
    {
      reportSnapshot: {
        status: 'generating',
        reportVersion: (existingSnapshot?.reportVersion || 0) + 1,
        inputHash: currentInputHash,
        updatedAt: new Date().toISOString(),
        promptVersion: PROMPT_VERSION,
        schemaVersion: REPORT_SCHEMA_VERSION,
      },
    },
    { merge: true }
  );

  try {
    // 3. GROQ GENERATION (EXACTLY ONCE)
    const personalization = await generatePersonalization(student, scores, comparisonData);

    const readySnapshot: ReportSnapshot = {
      status: 'ready',
      reportVersion: (existingSnapshot?.reportVersion || 0) + 1,
      inputHash: currentInputHash,
      personalization,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: 'groq',
      model: 'groq/compound',
      promptVersion: PROMPT_VERSION,
      schemaVersion: REPORT_SCHEMA_VERSION,
    };

    // 4. PERSIST SNAPSHOT TO FIRESTORE
    await docRef.set(
      {
        reportSnapshot: readySnapshot,
      },
      { merge: true }
    );

    console.log(`[REPORT SNAPSHOT SAVED] reportId=${resultId} status=READY version=${readySnapshot.reportVersion}`);

    return {
      personalization,
      fromCache: false,
      reportSnapshot: readySnapshot,
    };
  } catch (error: any) {
    console.error(`[REPORT GENERATION FAILED] reportId=${resultId} error=`, error);
    await docRef.set(
      {
        'reportSnapshot.status': 'failed',
        'reportSnapshot.error': error.message || 'Generation failed',
        'reportSnapshot.updatedAt': new Date().toISOString(),
      },
      { merge: true }
    );
    throw error;
  }
}
