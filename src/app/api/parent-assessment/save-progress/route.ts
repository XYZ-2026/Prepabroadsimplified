import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { resultId, answers, parentName, parentRelation } = await req.json();
    
    if (!resultId) {
      return NextResponse.json({ success: false, error: 'resultId is required' }, { status: 400 });
    }

    const parentAssessmentRef = adminDb.collection('parent_assessments').doc(resultId);
    const parentAssessmentSnap = await parentAssessmentRef.get();

    if (parentAssessmentSnap.exists) {
      const parentData = parentAssessmentSnap.data();
      if (parentData?.status === 'completed') {
        return NextResponse.json({ success: false, error: 'Assessment already completed' }, { status: 403 });
      }
    }

    const batch = adminDb.batch();

    // Upsert parent_assessments
    batch.set(parentAssessmentRef, {
      resultId,
      answers,
      parentName: parentName || '',
      parentRelation: parentRelation || '',
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Update workflow state to parent_in_progress
    const workflowRef = adminDb.collection('assessment_workflow').doc(resultId);
    batch.set(workflowRef, {
      state: 'parent_in_progress',
      parentSavedState: { answers, parentName, parentRelation },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    await batch.commit();

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error saving parent progress:', error);
    return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
  }
}
