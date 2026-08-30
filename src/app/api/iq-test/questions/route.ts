import { NextResponse } from 'next/server';
import { QUESTION_BANK_45 } from '@/lib/iq-questions-45';
import { validateIQQuestionBank } from '@/lib/iq-validation-45';

export async function GET() {
  try {
    const validation = validateIQQuestionBank();
    if (validation.invalidQuestions > 0) {
      console.error('[IQ Questions API] Validation failed:', validation.errors);
      return NextResponse.json(
        { success: false, message: `Question bank validation error: ${validation.errors[0]}` },
        { status: 500 }
      );
    }

    // Strip correctOption and explanation before sending to client
    const clientQuestions = QUESTION_BANK_45.map(q => ({
      id: q.id,
      section: q.section,
      sectionName: q.sectionName,
      category: q.category,
      difficulty: q.difficulty,
      prompt: q.prompt,
      questionType: q.questionType,
      svgData: q.svgData,
      options: q.options.map(opt => ({
        label: opt.label,
        text: opt.text,
        svgContent: opt.svgContent
      }))
    }));

    return NextResponse.json({
      success: true,
      totalQuestions: 45,
      questions: clientQuestions,
      bankVersion: 1
    });
  } catch (error: any) {
    console.error('[IQ Questions API Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch IQ test questions' },
      { status: 500 }
    );
  }
}
