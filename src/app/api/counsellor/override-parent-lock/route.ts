import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims || (claims.role !== 'counsellor' && claims.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { resultId, reason } = await req.json();

    if (!resultId || !reason) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // Update the assessment workflow state to 'report_unlocked'
    const workflowRef = adminDb.collection('assessment_workflow').doc(resultId);
    
    // Add audit log
    await workflowRef.update({
      state: 'report_unlocked',
      updatedAt: new Date().toISOString(),
      overrideReason: reason,
      overrideBy: claims.uid,
      overrideAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in override-parent-lock:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
