import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllEnquiries } from '@/lib/enquiry-service';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate and authorize admin
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const academicLevel = searchParams.get('academicLevel') || undefined;

    const enquiries = await getAllEnquiries({
      status,
      search,
      academicLevel,
    });

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error: any) {
    console.error('[Admin Enquiries API] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to retrieve enquiries.' }, { status: 500 });
  }
}
