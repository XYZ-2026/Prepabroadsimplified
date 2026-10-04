import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { 
  getStudentPsychometricAccess, 
  resolveAssessmentVariant, 
  formatGradeLabel 
} from '@/lib/psychometric-access-policy';

export async function GET(request: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ 
        allowed: false, 
        authenticated: false, 
        error: 'Please sign in to access psychometric assessments.' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedType = searchParams.get('type') || searchParams.get('variant') || 'grade10';
    const resolvedRequested = resolveAssessmentVariant(requestedType);

    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const role = userData?.role || (claims.admin ? 'admin' : 'student');
    const grade = userData?.grade || userData?.academicGrade || null;

    const access = getStudentPsychometricAccess(grade, userData?.toolAccess, role);

    const isAllowed = resolvedRequested ? access.canAccess(resolvedRequested) : false;

    return NextResponse.json({
      allowed: isAllowed,
      authenticated: true,
      status: access.status,
      grade: access.grade,
      gradeLabel: access.gradeLabel,
      requestedVariant: resolvedRequested,
      eligibleVariant: access.eligibleVariant,
      eligibleToolKey: access.eligibleToolKey,
      eligibleTestName: access.eligibleTestName,
      eligibleHref: access.eligibleHref,
      allAssessments: access.allAssessments,
      message: isAllowed 
        ? 'Access granted for your academic stage.' 
        : access.status === 'PROFILE_INCOMPLETE'
          ? 'Academic profile incomplete. Please select your academic grade.'
          : `This assessment is not available for your current academic stage (${access.gradeLabel}).`,
    });
  } catch (error: any) {
    console.error('Error validating assessment access:', error);
    return NextResponse.json({ allowed: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ allowed: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const requestedVariant = body.variant || body.assessmentType || body.type;
    const resolvedRequested = resolveAssessmentVariant(requestedVariant);

    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const role = userData?.role || (claims.admin ? 'admin' : 'student');
    const grade = userData?.grade || userData?.academicGrade || null;

    const access = getStudentPsychometricAccess(grade, userData?.toolAccess, role);
    const isAllowed = resolvedRequested ? access.canAccess(resolvedRequested) : false;

    return NextResponse.json({
      allowed: isAllowed,
      status: access.status,
      grade: access.grade,
      gradeLabel: access.gradeLabel,
      requestedVariant: resolvedRequested,
      eligibleVariant: access.eligibleVariant,
      eligibleTestName: access.eligibleTestName,
      eligibleHref: access.eligibleHref,
    });
  } catch (error: any) {
    console.error('Error validating assessment access:', error);
    return NextResponse.json({ allowed: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
