import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const claims = await verifySessionCookie();
    let { resultId } = await req.json();

    // If no resultId supplied, find the user's latest psychometric result
    if (!resultId && claims?.uid) {
      const userResultsSnapshot = await adminDb
        .collection('psychometric_results')
        .where('userId', '==', claims.uid)
        .get();

      if (!userResultsSnapshot.empty) {
        const sortedDocs = userResultsSnapshot.docs.map(doc => ({
          id: doc.id,
          createdAt: doc.data().createdAt || '',
          ...doc.data()
        })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        resultId = sortedDocs[0].id;
      }
    }

    if (!resultId) {
      return NextResponse.json({ success: false, error: 'No psychometric assessment result found.' }, { status: 400 });
    }

    // Fetch the psychometric result document
    const resultDoc = await adminDb.collection('psychometric_results').doc(resultId).get();
    if (!resultDoc.exists) {
      return NextResponse.json({ success: false, error: 'Assessment result not found.' }, { status: 404 });
    }

    const resultData = resultDoc.data();
    const studentName = resultData?.studentInfo?.name || 'Student';

    // Fetch workflow document for saved progress
    const workflowDoc = await adminDb.collection('assessment_workflow').doc(resultId).get();
    const savedState = workflowDoc.exists ? workflowDoc.data()?.parentSavedState : null;
    const state = workflowDoc.exists ? workflowDoc.data()?.state : 'parent_pending';

    return NextResponse.json({
      success: true,
      resultId,
      studentName,
      state,
      savedState
    });
  } catch (error: any) {
    console.error('Error verifying result:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
