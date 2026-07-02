import { NextResponse } from 'next/server';
import { getAllQuestions, RawQuestion } from '@/lib/iq-questions';

// Randomize an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: Request) {
  try {
    const allQuestions = getAllQuestions();
    
    // Select 60 random questions (e.g. 10 easy, 10 medium, 10 advanced)
    // Or just a random slice of 60 for now
    const randomized = shuffleArray(allQuestions).slice(0, 60);
    
    // Strip out the correct answers before sending to the client!
    const clientQuestions = randomized.map(q => ({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      category: q.category,
      imageUrl: q.imageUrl
    }));

    return NextResponse.json({ success: true, questions: clientQuestions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch questions' }, { status: 500 });
  }
}
