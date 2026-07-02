import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/iq-questions';
import { processIQTest } from '@/lib/iq-scoring';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { answers } = await request.json(); // Array of { question: string, answer: string }
    const allQuestions = getAllQuestions();
    
    // Create a map of question text to correct answer and category for fast lookup
    const qMap = new Map(allQuestions.map(q => [q.question, { correct: q.correctAnswer, category: q.category }]));

    const evaluated = answers.map((ans: any) => {
      const mapped = qMap.get(ans.question) || { correct: null, category: 'Unknown' };
      const isCorrect = mapped.correct === ans.answer;
      return {
        question: ans.question,
        userAnswer: ans.answer,
        correctAnswer: mapped.correct,
        category: mapped.category,
        isCorrect
      };
    });

    // Run the Python-equivalent scoring engine
    const result = processIQTest(evaluated);

    // Prepare full document
    const finalDocument = {
      ...result,
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
