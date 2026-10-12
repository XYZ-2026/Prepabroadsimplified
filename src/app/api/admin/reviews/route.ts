import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllReviews } from '@/lib/review-service';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const reviews = await getAllReviews();
    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    console.error('Error in admin GET /api/admin/reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
