import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserRole } from '@/lib/auth';
import { getWorkflowState } from '@/lib/assessment-workflow';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const docRef = await adminDb.collection('psychometric_results').doc(resolvedParams.id).get();
    
    if (!docRef.exists) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    const role: any = await getUserRole();
    const isAdmin = role === 'admin' || role === 'counsellor';
    
    const resultData: any = { id: docRef.id, ...docRef.data() };
    
    // Workflow state check
    const workflowState = await getWorkflowState(resolvedParams.id);
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
      const compSnap = await adminDb.collection('assessment_comparisons').doc(resolvedParams.id).get();
      if (compSnap.exists) {
        comparisonData = compSnap.data();
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
