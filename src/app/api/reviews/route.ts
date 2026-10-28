import { NextRequest, NextResponse } from 'next/server';
import { 
  createReview, 
  getReviewsByCategory, 
  getCategoryCounts, 
  sanitizeReviewForPublic 
} from '@/lib/review-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 25;

    // Fetch approved & featured reviews supporting up to 25 authentic reviews per category
    const rawReviews = await getReviewsByCategory(category, limit);
    const categoryCounts = await getCategoryCounts();

    // Sanitize for public consumption (strip private contact details and evidence dockets)
    const sanitized = rawReviews.map(sanitizeReviewForPublic);

    return NextResponse.json({
      success: true,
      reviews: sanitized,
      categoryCounts,
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
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
      category,
      reportType,
      rating = 5,
      headline,
      comment,
      impactTag,
      reportId,
      consentRecorded = true,
      allowSchoolDisplay = true,
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

    // New review begins strictly in pending state and unverified until administrative verification
    const review = await createReview({
      name: name.trim(),
      role: role === 'parent' ? 'parent' : 'student',
      email: email ? email.trim() : undefined,
      school: school.trim(),
      grade: grade.trim(),
      category: ['stream', 'sat', 'international', 'research'].includes(category) ? category : 'stream',
      reportType: reportType ? reportType.trim() : 'Diagnostic & Advisory Report',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      headline: headline && headline.trim() ? headline.trim() : 'Actionable clarity for academic planning',
      comment: comment.trim(),
      impactTag: impactTag ? impactTag.trim() : 'Academic Clarity',
      reportId: reportId ? String(reportId).trim() : undefined,
      consentRecorded: Boolean(consentRecorded),
      consentDate: new Date().toISOString(),
      allowSchoolDisplay: Boolean(allowSchoolDisplay),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been securely submitted for independent verification.',
      id: review.id,
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while saving your review.' },
      { status: 500 }
    );
  }
}
