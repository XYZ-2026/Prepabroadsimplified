import { NextRequest, NextResponse } from 'next/server';
import { createReview, getFeaturedReviews } from '@/lib/review-service';

export async function GET(request: NextRequest) {
  try {
    const featured = await getFeaturedReviews();
    return NextResponse.json({
      success: true,
      reviews: featured,
    });
  } catch (error: any) {
    console.error('Error fetching featured reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      role = 'student',
      email,
      school,
      grade,
      reportType,
      rating = 5,
      headline,
      comment,
      impactTag,
      reportId,
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    if (!school || typeof school !== 'string' || !school.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your school or college name.' },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== 'string' || !grade.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please specify your grade or academic level.' },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please share at least a few sentences describing your experience.' },
        { status: 400 }
      );
    }

    const review = await createReview({
      name: name.trim(),
      role: role === 'parent' ? 'parent' : 'student',
      email: email ? email.trim() : undefined,
      school: school.trim(),
      grade: grade.trim(),
      reportType: reportType ? reportType.trim() : 'Psychometric & Diagnostic Report',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      headline: headline && headline.trim() ? headline.trim() : 'Valuable guidance and actionable clarity',
      comment: comment.trim(),
      impactTag: impactTag ? impactTag.trim() : 'Academic Clarity',
      reportId: reportId ? String(reportId).trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted for verification.',
      review,
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while saving your review.' },
      { status: 500 }
    );
  }
}
