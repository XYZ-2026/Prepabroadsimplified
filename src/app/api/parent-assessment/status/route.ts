import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function GET() {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ isUnlocked: false });
    }

    // Fetch user's psychometric results
    const psychometricSnapshot = await adminDb
      .collection('psychometric_results')
      .where('userId', '==', claims.uid)
      .get();

    if (psychometricSnapshot.empty) {
      return NextResponse.json({ isUnlocked: false });
    }

    // Get the most recent assessment result
    const results = psychometricSnapshot.docs.map(doc => ({
      id: doc.id,
      createdAt: doc.data().createdAt || '',
      ...doc.data()
    }));

    results.sort((a: any, b: any) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    const latest = results[0];

    // Fetch workflow state for latest result
    const workflowDoc = await adminDb
      .collection('assessment_workflow')
      .doc(latest.id)
      .get();

    const workflowState = workflowDoc.exists ? workflowDoc.data()?.state : 'parent_pending';

    return NextResponse.json({
      isUnlocked: true,
      latestResultId: latest.id,
      workflowState: workflowState,
      hasPendingParentTest: workflowState !== 'report_unlocked'
    });
  } catch (error) {
    console.error('Error fetching parent assessment status:', error);
    return NextResponse.json({ isUnlocked: false });
  }
}
