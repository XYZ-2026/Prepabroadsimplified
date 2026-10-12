import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserRole } from '@/lib/auth';
import { getWorkflowState } from '@/lib/assessment-workflow';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    let resultData: any = null;

    try {
      const docRef = await adminDb.collection('psychometric_results').doc(resolvedParams.id).get();
      if (docRef.exists) {
        resultData = { id: docRef.id, ...docRef.data() };
      }
    } catch (dbErr) {
      console.warn('[Get Result Route] Firestore fetch warning:', dbErr);
    }

    if (!resultData) {
      const gCache = (globalThis as any).__psychometricResultsCache;
      if (gCache && gCache.has(resolvedParams.id)) {
        resultData = gCache.get(resolvedParams.id);
      }
    }

    if (!resultData) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    const role: any = await getUserRole();
    const isAdmin = role === 'admin' || role === 'counsellor';

    // Workflow state check
    let workflowState = 'parent_pending';
    try {
      workflowState = await getWorkflowState(resolvedParams.id);
    } catch (wfErr) {
      console.warn('[Get Result Route] Workflow state fetch warning:', wfErr);
    }

    const reportLocked = !isAdmin && workflowState !== 'report_unlocked';

    if (reportLocked) {
      // Return minimal data for the status screen
      const minimalResult = {
        id: resultData.id,
        name: resultData.student?.name?.split(' ')[0] || resultData.studentInfo?.name?.split(' ')[0] || resultData.name?.split(' ')[0] || 'Student',
        date: resultData.createdAt || resultData.date,
        assessmentType: resultData.testType || resultData.assessmentType || 'senior',
      };
      
      return NextResponse.json({
        success: true,
        reportLocked: true,
        workflowState,
        result: minimalResult,
        isAdmin,
        isCounsellor: role === 'counsellor',
      });
    }

    // Fetch comparison data if it exists and report is unlocked
    let comparisonData = null;
    if (workflowState === 'report_unlocked' || isAdmin) {
      try {
        const compSnap = await adminDb.collection('assessment_comparisons').doc(resolvedParams.id).get();
        if (compSnap.exists) {
          comparisonData = compSnap.data();
        }
      } catch (compErr) {
        console.warn('[Get Result Route] Comparison fetch warning:', compErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      reportLocked: false,
      workflowState,
      result: resultData,
      comparisonData,
      isAdmin,
      isCounsellor: role === 'counsellor',
    });
  } catch (error) {
    console.error('Error fetching psychometric result:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch result' }, { status: 500 });
  }
}
