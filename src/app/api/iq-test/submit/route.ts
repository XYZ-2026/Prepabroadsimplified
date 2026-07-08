import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/iq-questions';
import { processIQTest } from '@/lib/iq-scoring';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { answers } = await request.json(); // Array of { question: string, answer: string }
    const allQuestions = getAllQuestions();
    
    const qMap = new Map(allQuestions.map(q => [q.question, { correct: q.correctAnswer, category: q.category, difficulty: q.difficulty }]));

    const evaluated = answers.map((ans: any) => {
      const mapped = qMap.get(ans.question) || { correct: null, category: 'Unknown', difficulty: 'medium' };
      const isCorrect = mapped.correct === ans.answer;
      return {
        question: ans.question,
        userAnswer: ans.answer,
        correctAnswer: mapped.correct,
        category: mapped.category,
        difficulty: mapped.difficulty,
        isCorrect
      };
    });

    // Check if the user is logged in
    const claims = await verifySessionCookie();
    
    let userName = 'Candidate';
    if (claims) {
      try {
        const userDoc = await adminDb.collection('users').doc(claims.uid).get();
        if (userDoc.exists) {
          userName = userDoc.data()?.name || claims.name || 'Candidate';
        } else {
          userName = claims.name || 'Candidate';
        }
        // Extract first name
        userName = userName.split(' ')[0];
      } catch (error) {
        console.warn('Error fetching user name for IQ test:', error);
      }
    }

    // Run the Python-equivalent scoring engine
    const result = processIQTest(evaluated, userName);

    // Prepare full document
    const finalDocument = {
      ...result,
      testName: 'Advanced IQ Assessment',
      userId: claims ? claims.uid : null, // Attach userId if available
      createdAt: new Date().toISOString(),
      evaluatedAnswers: evaluated // store the raw answers if needed
    };

    // Save to Firebase Firestore
    const docRef = await adminDb.collection('iq_results').add(finalDocument);

    return NextResponse.json({ 
      success: true, 
      resultId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit test' }, { status: 500 });
  }
}
