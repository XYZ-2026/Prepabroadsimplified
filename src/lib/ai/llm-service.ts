/**
 * Centralized LLM Service
 * ─────────────────────────────────────────────────────
 * Primary: Groq API (llama-3.3-70b-versatile -> llama-3.1-8b-instant)
 * Tertiary Backup: Google Gemini (gemini-1.5-flash)
 * Fallback: Deterministic Template Builder
 *
 * Features:
 * - SHA-256 Input Hashing & In-Memory Caching
 * - Rate limit (429/503) failover and bounded retries
 * - Structured JSON parsing & validation
 * - Zero OpenRouter dependency
 */

import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PersonalizationData, EditorialStudent, EditorialScores } from '@/app/(main)/psychometric-test/class10_editorial_engine';
import type { AlignmentResult } from '@/app/(main)/psychometric-test/comparison-engine';

export const PROMPT_VERSION = process.env.PROMPT_VERSION || 'REPORT_NARRATIVE_PROMPT_V1';

// ─── IN-MEMORY CACHE MAP ──────────────────────────────────────────────────

interface CacheEntry {
  hash: string;
  data: PersonalizationData;
  provider: string;
  model: string;
  timestamp: number;
}

const personalizationCache = new Map<string, CacheEntry>();

/**
 * Generate a deterministic SHA-256 hash for student + parent + comparison data
 */
export function computeInputHash(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): string {
  const payload = {
    promptVersion: PROMPT_VERSION,
    student: {
      name: student.name,
      grade: student.grade,
      age: student.age,
      city: student.city,
    },
    scores: {
      aptitude: scores.aptitude,
      personality: scores.personality,
      topRiasec: scores.topRiasec,
      topVark: scores.topVark,
      topValues: scores.topValues,
      careerFitment: scores.careerFitment?.slice(0, 3),
    },
    comparison: comparisonData ? {
      overallIndicator: comparisonData.overallIndicator,
      overallScore: comparisonData.overallScore,
      areas: comparisonData.areas?.map(a => ({ id: a.id, level: a.level, studentSide: a.studentSide, parentSide: a.parentSide })),
    } : null,
  };

  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

// ─── HELPER: CLEAN & PARSE JSON ──────────────────────────────────────────

function cleanAndParseJSON(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

// ─── HELPER: RETRY DELAY ──────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── DYNAMIC MODEL VALIDATION CACHE ──────────────────────────────────────

interface ValidatedModelsCache {
  groqModels: string[];
  timestamp: number;
}

let validatedGroqCache: ValidatedModelsCache | null = null;

export async function getValidatedGroqModels(groqKey: string): Promise<string[]> {
  const now = Date.now();
  if (validatedGroqCache && (now - validatedGroqCache.timestamp) < 3600000) {
    return validatedGroqCache.groqModels;
  }

  const primaryConfig = process.env.GROQ_PRIMARY_MODEL || 'groq/compound';
  const fallbackConfig = process.env.GROQ_FALLBACK_MODEL || 'groq/compound-mini';
  let availableList: string[] = [primaryConfig, fallbackConfig];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${groqKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      const serverModels: string[] = (data.data || [])
        .filter((m: any) => m.active !== false && !m.id.includes('whisper') && !m.id.includes('guard') && !m.id.includes('orpheus'))
        .map((m: any) => m.id);

      if (serverModels.length > 0) {
        // Order: Configured Primary if active -> Configured Fallback if active -> server models
        const ordered: string[] = [];
        if (serverModels.includes(primaryConfig)) ordered.push(primaryConfig);
        if (serverModels.includes(fallbackConfig) && !ordered.includes(fallbackConfig)) ordered.push(fallbackConfig);
        serverModels.forEach(m => { if (!ordered.includes(m)) ordered.push(m); });
        availableList = ordered;
      }
    }
  } catch (err: any) {
    console.warn('[LLM MODEL CHECK] Model validation lookup failed:', err?.message || err);
  }

  console.log(`[LLM MODEL CHECK] availableModels=${availableList.join(', ')}`);
  validatedGroqCache = { groqModels: availableList, timestamp: now };
  return availableList;
}

// ─── GROQ API PIPELINE ───────────────────────────────────────────────────

export async function callGroqAPI(prompt: string, systemMsg?: string): Promise<{ text: string; model: string } | null> {
  const groqKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
  if (!groqKey) return null;

  const groqModels = await getValidatedGroqModels(groqKey);
  const messages = [
    { role: 'system', content: systemMsg || 'You are a professional psychometric report analyst. Return ONLY valid raw JSON with no markdown syntax.' },
    { role: 'user', content: prompt }
  ];

  for (const model of groqModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 4000,
          response_format: { type: 'json_object' }
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        const text = resData.choices?.[0]?.message?.content || '';
        if (text) {
          console.log(`[LLM Service] Groq call succeeded with model: ${model}`);
          return { text, model };
        }
      }

      // Handle 429 Rate Limit
      if (res.status === 429) {
        const retryAfter = res.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000;
        console.warn(`[LLM Service] Groq model ${model} hit 429 rate limit. Waiting ${waitTime}ms before failover...`);
        await sleep(Math.min(waitTime, 2000));
        continue;
      }

      // Handle 404 / 400 / 503 / Server Error
      const errBody = await res.text().catch(() => '');
      console.warn(`[LLM Service] Groq model ${model} returned HTTP ${res.status}: ${errBody.substring(0, 100)}`);
      await sleep(300);
    } catch (err: any) {
      console.warn(`[LLM Service] Groq model ${model} request failed:`, err?.message || err);
      continue;
    }
  }

  return null;
}

// ─── GEMINI TERTIARY BACKUP PIPELINE ──────────────────────────────────────

export async function callGeminiAPI(prompt: string): Promise<{ text: string; model: string } | null> {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  if (!geminiKey) return null;

  const geminiModels = ['gemini-2.5-flash'];
  const genai = new GoogleGenerativeAI(geminiKey);

  for (const modelName of geminiModels) {
    try {
      const model = genai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 8192,
        },
      });

      if (result) {
        const response = await result.response;
        const text = response.text();
        if (text) {
          console.log(`[LLM Service] Gemini tertiary backup succeeded with model: ${modelName}`);
          return { text, model: modelName };
        }
      }
    } catch (err: any) {
      console.warn(`[LLM Service] Gemini backup model ${modelName} failed:`, err?.message || err);
      continue;
    }
  }

  return null;
}

// ─── MAIN REPORT NARRATIVE GENERATION FUNCTION ────────────────────────────

export async function generateReportNarrative(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null,
  promptBuilder?: (student: EditorialStudent, sc: EditorialScores, comp?: AlignmentResult | null) => string,
  fallbackBuilder?: (student: EditorialStudent, sc: EditorialScores, comp?: AlignmentResult | null) => PersonalizationData
): Promise<PersonalizationData> {
  // 1. Compute Hash & Check Cache
  const inputHash = computeInputHash(student, scores, comparisonData);
  if (personalizationCache.has(inputHash)) {
    console.log(`[LLM Service] Cache HIT for input hash: ${inputHash.substring(0, 10)}...`);
    return personalizationCache.get(inputHash)!.data;
  }

  // 2. Build Prompt
  if (!promptBuilder || !fallbackBuilder) {
    throw new Error('promptBuilder and fallbackBuilder functions are required');
  }

  const prompt = promptBuilder(student, scores, comparisonData);

  // 3. Try Groq Primary Pipeline
  let llmResult = await callGroqAPI(prompt);
  let provider = 'groq';

  // 4. Try Gemini Tertiary Backup Pipeline if Groq failed
  if (!llmResult) {
    console.warn('[LLM Service] Groq models failed. Attempting tertiary Gemini backup...');
    llmResult = await callGeminiAPI(prompt);
    provider = 'gemini';
  }

  // 5. Parse & Validate Structured JSON Output
  if (llmResult && llmResult.text) {
    try {
      const parsed = cleanAndParseJSON(llmResult.text);

      if (parsed && parsed.executiveSummary && parsed.strengths && parsed.parentGuide) {
        const personalizationData: PersonalizationData = {
          executiveSummary: parsed.executiveSummary,
          moduleInsights: parsed.moduleInsights || {},
          strengths: parsed.strengths || [],
          growthAreas: parsed.growthAreas || [],
          crossDomainInsights: parsed.crossDomainInsights || [],
          familyAlignmentSummary: parsed.familyAlignmentSummary || '',
          alignmentHighlights: parsed.alignmentHighlights || [],
          parentGuide: {
            observations: parsed.parentGuide?.observations || [],
            homeStrategies: parsed.parentGuide?.homeStrategies || [],
            communicationTips: parsed.parentGuide?.communicationTips || [],
          },
          teacherGuide: {
            classroomAdaptations: parsed.teacherGuide?.classroomAdaptations || [],
            learningSupport: parsed.teacherGuide?.learningSupport || [],
            assessmentTips: parsed.teacherGuide?.assessmentTips || [],
          },
          careerRoadmap: {
            shortTerm: parsed.careerRoadmap?.shortTerm || [],
            mediumTerm: parsed.careerRoadmap?.mediumTerm || [],
            longTerm: parsed.careerRoadmap?.longTerm || [],
          },
        };

        // Cache the successful result
        personalizationCache.set(inputHash, {
          hash: inputHash,
          data: personalizationData,
          provider,
          model: llmResult.model,
          timestamp: Date.now(),
        });

        return personalizationData;
      }
    } catch (parseErr) {
      console.warn('[LLM Service] Structured JSON parsing failed:', parseErr);
    }
  }

  // 6. Fallback to Deterministic Template Builder if all LLMs fail
  console.warn('[LLM Service] All LLM providers failed or returned invalid JSON. Using deterministic template fallback.');
  const fallbackData = fallbackBuilder(student, scores, comparisonData);
  
  // Store fallback data in cache as well to prevent continuous hammering when APIs are down
  personalizationCache.set(inputHash, {
    hash: inputHash,
    data: fallbackData,
    provider: 'fallback_template',
    model: 'deterministic',
    timestamp: Date.now(),
  });

  return fallbackData;
}
