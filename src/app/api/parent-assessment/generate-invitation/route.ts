import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { generateSecureToken, AssessmentWorkflowDoc } from '@/lib/assessment-workflow';

export async function POST(req: NextRequest) {
  try {
    const decodedClaims = await verifySessionCookie();
    if (!decodedClaims) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { resultId } = await req.json();
    if (!resultId) {
      return NextResponse.json({ success: false, error: 'resultId is required' }, { status: 400 });
    }

    const userId = decodedClaims.uid;
    const role = await getUserRole();

    // Verify ownership or access
    const resultSnap = await adminDb.collection('psychometric_results').doc(resultId).get();
    if (!resultSnap.exists) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }

    const resultData = resultSnap.data();
    if (role === 'student' && resultData?.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const studentId = resultData?.userId || userId;

    // Check existing valid invitations
    const existingInvites = await adminDb.collection('assessment_invitations')
      .where('resultId', '==', resultId)
      .where('status', '==', 'active')
      .get();
      
    // Revoke old ones if generating a new one
    const batch = adminDb.batch();
    existingInvites.forEach(doc => {
      batch.update(doc.ref, { status: 'revoked' });
    });

    // Generate new token
    const { rawToken, tokenHash } = generateSecureToken();
    
    // Create new invitation
    const newInviteRef = adminDb.collection('assessment_invitations').doc();
    batch.set(newInviteRef, {
      tokenHash,
      resultId,
      studentId,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    // Update workflow state
    const workflowRef = adminDb.collection('assessment_workflow').doc(resultId);
    const workflowSnap = await workflowRef.get();
    
    if (!workflowSnap.exists) {
      batch.set(workflowRef, {
        resultId,
        studentId,
        state: 'parent_invited',
        updatedAt: new Date().toISOString()
      } as AssessmentWorkflowDoc);
    } else {
      const wData = workflowSnap.data() as AssessmentWorkflowDoc;
      if (wData.state === 'parent_pending' || wData.state === 'student_completed') {
        batch.update(workflowRef, {
          state: 'parent_invited',
          updatedAt: new Date().toISOString()
        });
      }
    }

    await batch.commit();

    // Construct full URL
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const link = `${origin}/parent-assessment?resultId=${resultId}`;

    return NextResponse.json({ success: true, link });

  } catch (error: any) {
    console.error('Error generating invitation:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate invitation' }, { status: 500 });
  }
}
