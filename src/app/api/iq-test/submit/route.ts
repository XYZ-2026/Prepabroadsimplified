import { NextResponse } from 'next/server';
import { QUESTION_BANK_45 } from '@/lib/iq-questions-45';
import { evaluate45IQTest } from '@/lib/iq-scoring-45';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, distractionReported, elapsedTime } = body; // Array of { questionId: number, userOption: 'A'|'B'|'C'|'D'|null }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ success: false, message: 'Invalid answers payload' }, { status: 400 });
    }

    // Map user answers against authoritative question bank
    const qMap = new Map(QUESTION_BANK_45.map(q => [q.id, q]));

    const evaluatedAnswers = answers.map((ans: { questionId: number; userOption: string | null }) => {
      const q = qMap.get(ans.questionId);
      const correctOption = q ? q.correctOption : 'A';
      const isCorrect = ans.userOption === correctOption;

      return {
        questionId: ans.questionId,
        section: q ? q.section : 1,
        sectionName: q ? q.sectionName : 'General',
        difficultyWeight: q ? q.difficultyWeight : 1.0,
        userOption: ans.userOption || null,
        correctOption,
        isCorrect
      };
    });

    // Check user authentication
    const claims = await verifySessionCookie();

    let userName = 'Candidate';
    let userEmail = '';
    let userId = null;

    if (claims) {
      userId = claims.uid;
      userEmail = claims.email || '';
      try {
        const userDoc = await adminDb.collection('users').doc(claims.uid).get();
        if (userDoc.exists) {
          userName = userDoc.data()?.name || claims.name || 'Candidate';
        } else {
          userName = claims.name || 'Candidate';
        }
      } catch (err) {
        console.warn('[IQ Submit] Error fetching user profile:', err);
      }
    }

    // Run scoring engine
    const evaluation = evaluate45IQTest(
      evaluatedAnswers,
      userName,
      distractionReported,
      `SIMP-IQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    );

    const finalDocument = {
      ...evaluation,
      testName: '45-Item Cognitive Assessment',
      userId,
      userEmail,
      userName,
      elapsedTime: elapsedTime || 0,
      evaluatedAnswers,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    const docRef = await adminDb.collection('iq_results').add(finalDocument);

    return NextResponse.json({
      success: true,
      resultId: docRef.id,
      estimatedIQ: evaluation.estimatedIQ,
      percentile: evaluation.percentile,
      cognitiveBand: evaluation.cognitiveBand
    });
  } catch (error: any) {
    console.error('[IQ Submit API Error]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit test' },
      { status: 500 }
    );
  }
}
