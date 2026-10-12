import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { updateReview, deleteReview } from '@/lib/review-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const allowedUpdates: any = {};
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.isFeatured !== undefined) allowedUpdates.isFeatured = Boolean(body.isFeatured);
    if (body.adminNotes !== undefined) allowedUpdates.adminNotes = String(body.adminNotes);
    if (body.headline !== undefined) allowedUpdates.headline = String(body.headline);
    if (body.comment !== undefined) allowedUpdates.comment = String(body.comment);
    if (body.impactTag !== undefined) allowedUpdates.impactTag = String(body.impactTag);

    const updated = await updateReview(id, allowedUpdates);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await deleteReview(id);
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
  }
}
