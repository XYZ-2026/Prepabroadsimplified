import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { 
  getStudentPsychometricAccess, 
  normalizeGrade, 
  resolveAssessmentVariant, 
  formatGradeLabel 
} from '@/lib/psychometric-access-policy';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { student, scores, narrative, assessmentType, questions, answers } = data;

    // Check if the user is logged in
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized: You must be logged in to submit an assessment.' 
      }, { status: 401 });
    }

    let userName = student?.name || 'Candidate';
    let userGrade: string | null = null;
    let userRole = 'student';
    let userToolAccess: any = null;

    try {
      const userDoc = await adminDb.collection('users').doc(claims.uid).get();
      if (userDoc.exists) {
        const uData = userDoc.data();
        userName = uData?.name || claims.name || student?.name || 'Candidate';
        userGrade = uData?.grade || uData?.academicGrade || null;
        userRole = uData?.role || (claims.admin ? 'admin' : 'student');
        userToolAccess = uData?.toolAccess || null;
      } else {
        userName = claims.name || student?.name || 'Candidate';
      }
      userName = (student?.name || userName).trim();
    } catch (error) {
      console.warn('Error fetching user profile for assessment authorization:', error);
    }

    // Backend Grade-Based Access Authorization Check
    const access = getStudentPsychometricAccess(userGrade, userToolAccess, userRole);
    if (!access.canAccess(assessmentType)) {
      console.warn(`[SECURITY] Access denied for user=${claims.uid} grade=${userGrade} requested=${assessmentType}`);
      return NextResponse.json({
        success: false,
        error: `Access Denied: This assessment is not authorized for your academic grade (${access.gradeLabel}).`,
        eligibleVariant: access.eligibleVariant,
        eligibleTestName: access.eligibleTestName,
        eligibleHref: access.eligibleHref,
      }, { status: 403 });
    }

    // Canonical grade at time of attempt (IMMUTABLE)
    const canonicalGradeAtAttempt = access.grade || normalizeGrade(student?.grade) || '10';
    const canonicalVariant = resolveAssessmentVariant(assessmentType) || 'CLASS_10';

    let testName = 'Psychometric Assessment';
    if (canonicalVariant === 'JUNIOR_7_9') testName = 'Junior Psychometric Test';
    else if (canonicalVariant === 'CLASS_10') testName = 'Grade 10 Psychometric Test';
    else if (canonicalVariant === 'SENIOR_12') testName = 'Grade 11/12 Psychometric Test';

    // Prepare full immutable document
    const finalDocument = {
      testName,
      type: 'psychometric',
      assessmentType,
      assessmentVariant: canonicalVariant,
      academicGradeAtAttempt: canonicalGradeAtAttempt,
      assessmentVersion: '2.0.0',
      questionBankVersion: '2026.1',
      student: { 
        ...student, 
        name: userName,
        grade: formatGradeLabel(canonicalGradeAtAttempt),
      },
      scores,
      narrative,
      questions: questions || null,
      answers: answers || null,
      userId: claims.uid,
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    const docRef = await adminDb.collection('psychometric_results').add(finalDocument);

    // Create the workflow document for this assessment
    await adminDb.collection('assessment_workflow').doc(docRef.id).set({
      resultId: docRef.id,
      studentId: claims.uid,
      state: 'parent_pending',
      updatedAt: new Date().toISOString()
    });

    // Pre-generate reportSnapshot ONCE on submit using academicGradeAtAttempt
    try {
      const { getOrGenerateReportSnapshot } = await import('@/lib/report-snapshot-service');
      const overallApt = Math.round(
        ((scores?.aptitude?.numerical || 75) +
         (scores?.aptitude?.reasoning || 80) +
         (scores?.aptitude?.verbal || 75) +
         (scores?.aptitude?.spatial || 74)) / 4
      );
      await getOrGenerateReportSnapshot({
        resultId: docRef.id,
        student: {
          name: userName,
          grade: formatGradeLabel(canonicalGradeAtAttempt),
          age: student?.age || (canonicalGradeAtAttempt === '11' || canonicalGradeAtAttempt === '12' ? '17' : canonicalGradeAtAttempt === '7' || canonicalGradeAtAttempt === '8' || canonicalGradeAtAttempt === '9' ? '13' : '15'),
          school: student?.school || '',
          city: student?.city || 'India',
          stream: student?.stream || '',
          email: student?.email || '',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          reportId: `AS-${canonicalGradeAtAttempt}-${docRef.id.substring(0, 6).toUpperCase()}`,
        },
        scores: {
          aptitude: {
            verbal: scores?.aptitude?.verbal || 75,
            numerical: scores?.aptitude?.numerical || 78,
            reasoning: scores?.aptitude?.reasoning || 80,
            spatial: scores?.aptitude?.spatial || 74,
            overall: scores?.aptitude?.overall || overallApt,
          },
          personality: {
            openness: scores?.personality?.openness || 75,
            conscientiousness: scores?.personality?.conscientiousness || 76,
            extraversion: scores?.personality?.extraversion || 68,
            agreeableness: scores?.personality?.agreeableness || 74,
            emotionalStability: scores?.personality?.emotionalStability || 70,
          },
          topRiasec: scores?.topRiasec || ['Investigative', 'Realistic', 'Artistic'],
          riasec: scores?.riasec || {},
          topVark: scores?.topVark || 'V',
          vark: scores?.vark || {},
          topValues: scores?.topValues || ['Autonomy', 'Mastery', 'Purpose'],
          careerFitment: scores?.careerFitment || [
            { name: 'STEM & Engineering Pathway', score: 95 },
            { name: 'Data Science & Analytical Computing', score: 92 },
            { name: 'Architecture & Design Systems', score: 88 },
            { name: 'Business Analytics & Commerce', score: 84 },
          ],
        },
      });
    } catch (rsErr) {
      console.warn('[Submit Route] Initial reportSnapshot generation warning:', rsErr);
    }

    return NextResponse.json({ 
      success: true, 
      resultId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting psychometric test:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit test' }, { status: 500 });
  }
}
