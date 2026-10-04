import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { normalizeGrade, getStudentPsychometricAccess } from '@/lib/psychometric-access-policy';

export async function POST(request: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, mobile, studentType, state, city,
      currentSchool, schoolName, board, stream, grade, academicGrade,
      goals, declaredInterests, onboarding,
      graduationYear, targetCountries, degreeLevel, fieldOfInterest,
      designation, specialization, experienceYears, bio
    } = body;

    // We do NOT update the email here as it requires Firebase Auth verification
    // and would desync Auth from Firestore if not handled properly.

    const rawGradeInput = grade !== undefined ? grade : academicGrade;
    const normalizedGrade = rawGradeInput ? normalizeGrade(rawGradeInput) : undefined;

    // Validate grade if provided
    if (rawGradeInput !== undefined && rawGradeInput !== '' && !normalizedGrade) {
      return NextResponse.json({ 
        error: 'Invalid academic grade. Supported grades are Grade 7 through Grade 12.' 
      }, { status: 400 });
    }

    const canonicalSchool = (schoolName || currentSchool || '').trim();

    const updatePayload: Record<string, any> = {
      name: name !== undefined ? name : '',
      mobile: mobile !== undefined ? mobile : '',
      state: state !== undefined ? state : '',
      city: city !== undefined ? city : '',
      currentSchool: canonicalSchool,
      schoolName: canonicalSchool,
      board: board !== undefined ? board : '',
      stream: stream !== undefined ? stream : '',
      graduationYear: graduationYear || '',
      targetCountries: targetCountries || '',
      degreeLevel: degreeLevel || '',
      fieldOfInterest: fieldOfInterest || '',
      designation: designation || '',
      specialization: specialization || '',
      experienceYears: experienceYears || '',
      bio: bio || '',
      updatedAt: new Date().toISOString(),
    };

    if (normalizedGrade) {
      updatePayload.grade = normalizedGrade;
      updatePayload.academicGrade = normalizedGrade;
      const isSenior = normalizedGrade === '11' || normalizedGrade === '12';
      updatePayload.studentType = isSenior ? 'Class 11/12' : `Grade ${normalizedGrade}`;
    } else if (studentType) {
      updatePayload.studentType = studentType;
    }

    if (goals !== undefined) {
      updatePayload.goals = Array.isArray(goals) ? goals : [];
    }

    if (declaredInterests !== undefined) {
      updatePayload.declaredInterests = Array.isArray(declaredInterests) ? declaredInterests : [];
    }

    if (onboarding !== undefined) {
      updatePayload.onboarding = onboarding;
    }

    await adminDb.collection('users').doc(claims.uid).set(updatePayload, { merge: true });

    // Fetch updated document to return full profile and freshly resolved psychometric access
    const updatedSnap = await adminDb.collection('users').doc(claims.uid).get();
    const updatedData = updatedSnap.data() || {};
    const access = getStudentPsychometricAccess(
      updatedData.grade || updatedData.academicGrade,
      updatedData.toolAccess,
      updatedData.role
    );

    return NextResponse.json({ 
      success: true, 
      user: { ...updatedData, id: claims.uid },
      psychometricAccess: access
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (!userDoc.exists) {
      const basicAccess = getStudentPsychometricAccess(null, null);
      return NextResponse.json({ 
        success: true, 
        user: { name: claims.name || '', email: claims.email || '', role: 'student' },
        psychometricAccess: basicAccess
      });
    }

    const data = userDoc.data() || {};
    const access = getStudentPsychometricAccess(
      data.grade || data.academicGrade,
      data.toolAccess,
      data.role
    );

    return NextResponse.json({ 
      success: true, 
      user: { 
        ...data, 
        id: claims.uid,
        name: data.name || claims.name || '',
        email: data.email || claims.email || '',
        grade: data.grade || data.academicGrade || '',
        academicGrade: data.academicGrade || data.grade || '',
        currentSchool: data.currentSchool || data.schoolName || '',
        schoolName: data.schoolName || data.currentSchool || '',
      },
      psychometricAccess: access
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}
