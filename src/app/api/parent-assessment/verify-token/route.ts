import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { hashToken } from '@/lib/assessment-workflow';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    const inviteSnap = await adminDb.collection('assessment_invitations')
      .where('tokenHash', '==', tokenHash)
      .limit(1)
      .get();

    if (inviteSnap.empty) {
      return NextResponse.json({ success: false, error: 'Invalid or expired invitation' }, { status: 404 });
    }

    const inviteDoc = inviteSnap.docs[0];
    const inviteData = inviteDoc.data();

    if (inviteData.status !== 'active') {
      return NextResponse.json({ success: false, error: `Invitation is ${inviteData.status}` }, { status: 403 });
    }

    if (new Date(inviteData.expiresAt).getTime() < Date.now()) {
      await inviteDoc.ref.update({ status: 'expired' });
      return NextResponse.json({ success: false, error: 'Invitation has expired' }, { status: 403 });
    }

    // Fetch student data to personalize the landing page
    const studentSnap = await adminDb.collection('users').doc(inviteData.studentId).get();
    const studentData = studentSnap.data();
    
    // Check if there's already an in-progress assessment for this resultId
    // to allow resuming
    const parentAssessmentSnap = await adminDb.collection('parent_assessments')
      .where('resultId', '==', inviteData.resultId)
      .limit(1)
      .get();

    let savedState = null;
    if (!parentAssessmentSnap.empty) {
      const parentData = parentAssessmentSnap.docs[0].data();
      if (parentData.status === 'in_progress') {
        savedState = {
          answers: parentData.answers || {},
          parentName: parentData.parentName || '',
          parentRelation: parentData.parentRelation || ''
        };
      } else if (parentData.status === 'completed') {
         return NextResponse.json({ success: false, error: 'Assessment already completed' }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      resultId: inviteData.resultId,
      studentId: inviteData.studentId,
      studentName: studentData?.firstName || 'Student',
      savedState
    });

  } catch (error: any) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ success: false, error: 'Failed to verify token' }, { status: 500 });
  }
}
