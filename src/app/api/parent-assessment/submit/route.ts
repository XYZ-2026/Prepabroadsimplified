import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { computeParentProfile } from '@/app/(main)/psychometric-test/parent-scoring';
import { PARENT_ASSESSMENT } from '@/app/(main)/psychometric-test/parent-assessment-data';
import { computeAlignment, StudentComparisonData } from '@/app/(main)/psychometric-test/comparison-engine';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { resultId, answers, parentName, parentRelation } = body;
    
    // If resultId is not provided, try to find current user's latest pending result
    if (!resultId) {
      const claims = await verifySessionCookie();
      if (claims?.uid) {
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
    }

    if (!resultId) {
      return NextResponse.json({ success: false, error: 'resultId is required' }, { status: 400 });
    }

    // Check existing assessment
    const parentAssessmentRef = adminDb.collection('parent_assessments').doc(resultId);

    // Get student psychometric result for comparison
    const studentResultSnap = await adminDb.collection('psychometric_results').doc(resultId).get();
    if (!studentResultSnap.exists) {
      return NextResponse.json({ success: false, error: 'Student result not found' }, { status: 404 });
    }
    const studentResultData = studentResultSnap.data();
    const studentId = studentResultData?.userId || '';

    // 1. Compute Parent Profile
    const parentProfile = computeParentProfile(answers, PARENT_ASSESSMENT.sections);

    // 2. Prepare Student Data for Comparison
    const studentComparisonData: StudentComparisonData = {
      topCareerFitment: studentResultData?.topCareers || studentResultData?.careerFitment?.slice(0, 5) || [],
      topRiasecCodes: studentResultData?.hollandCode?.split('') || [],
      topCareerValues: studentResultData?.careerValues?.topValues || [],
      careerValuesScores: studentResultData?.careerValues?.scores || {},
    };

    // 3. Compute Alignment
    const comparisonResult = computeAlignment(studentComparisonData, parentProfile);

    // 4. Batch Updates
    const batch = adminDb.batch();

    // Update parent_assessments
    batch.set(parentAssessmentRef, {
      resultId,
      studentId,
      answers,
      parentName: parentName || '',
      parentRelation: parentRelation || '',
      parentProfile, // Includes numeric, interpreted, choices
      status: 'completed',
      completedAt: new Date().toISOString(),
    }, { merge: true });

    // Save comparison result
    const comparisonRef = adminDb.collection('assessment_comparisons').doc(resultId);
    batch.set(comparisonRef, {
      resultId,
      studentId,
      ...comparisonResult,
      aiInterpretation: null, 
    });

    // Update workflow state directly to report_unlocked
    const workflowRef = adminDb.collection('assessment_workflow').doc(resultId);
    batch.set(workflowRef, {
      state: 'report_unlocked',
      studentId,
      resultId,
      parentAssessmentId: resultId,
      comparisonId: resultId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    await batch.commit();

    // 5. Pre-generate Family Insight ONCE upon completion (0 Groq calls on subsequent views)
    try {
      const { getOrGenerateFamilyInsightSnapshot } = await import('@/lib/report-snapshot-service');
      const { narrative } = await getOrGenerateFamilyInsightSnapshot(resultId, comparisonResult);
      if (narrative) {
        comparisonResult.aiInterpretation = narrative;
      }
    } catch (fiErr) {
      console.warn('Background family insight generation warning:', fiErr);
    }

    return NextResponse.json({ success: true, resultId, comparisonResult });

  } catch (error: any) {
    console.error('Error submitting parent assessment:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit assessment' }, { status: 500 });
  }
}
