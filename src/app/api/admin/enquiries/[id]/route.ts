import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { updateEnquiry, deleteEnquiry } from '@/lib/enquiry-service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { status, adminNotes } = body;

    const updated = await updateEnquiry(id, {
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    });

    return NextResponse.json({
      success: true,
      enquiry: updated,
    });
  } catch (error: any) {
    console.error('[Admin Enquiries PATCH] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await deleteEnquiry(id);

    return NextResponse.json({
      success: true,
      message: 'Enquiry removed successfully',
    });
  } catch (error: any) {
    console.error('[Admin Enquiries DELETE] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
