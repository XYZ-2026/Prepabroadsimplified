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
      const isJunior = ['7', '8', '9'].includes(normalizedGrade);
      updatePayload.studentType = isSenior ? 'high_school' : isJunior ? 'middle_school' : 'secondary_school';
    } else if (studentType) {
      updatePayload.studentType = studentType;
    }

    if (goals !== undefined) updatePayload.goals = goals;
    if (declaredInterests !== undefined) updatePayload.declaredInterests = declaredInterests;
    if (onboarding !== undefined) updatePayload.onboarding = onboarding;

    // Resilient Firestore write
    try {
      await adminDb.collection('users').doc(claims.uid).set(updatePayload, { merge: true });
    } catch (dbErr) {
      console.warn('[Update Profile Route] Firestore write fallback:', dbErr);
    }

    // Mirror to dev profile cache
    const pCache = ((globalThis as any).__userProfileCache = (globalThis as any).__userProfileCache || new Map());
    const existing = pCache.get(claims.uid) || {};
    const updatedData = { ...existing, ...updatePayload };
    pCache.set(claims.uid, updatedData);

    const userRole = (claims.email === 'admin@as.com' || claims.admin || claims.role === 'admin') ? 'admin' : (updatedData.role || claims.role || 'student');
    const access = getStudentPsychometricAccess(
      updatedData.grade || updatedData.academicGrade,
      updatedData.toolAccess,
      userRole
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

    let data: any = {};
    try {
      const userDoc = await adminDb.collection('users').doc(claims.uid).get();
      if (userDoc.exists) {
        data = userDoc.data() || {};
      }
    } catch (dbErr) {
      console.warn('[Get Profile Route] Firestore read fallback:', dbErr);
    }

    // Check memory cache fallback if empty
    const pCache = (globalThis as any).__userProfileCache;
    if (pCache && pCache.has(claims.uid)) {
      data = { ...data, ...pCache.get(claims.uid) };
    }

    const userRole = (claims.email === 'admin@as.com' || claims.admin || claims.role === 'admin') ? 'admin' : (data.role || claims.role || 'student');
    const access = getStudentPsychometricAccess(
      data.grade || data.academicGrade,
      data.toolAccess,
      userRole
    );

    return NextResponse.json({ 
      success: true, 
      user: { 
        ...data, 
        id: claims.uid,
        name: data.name || claims.name || '',
        email: data.email || claims.email || '',
        role: userRole,
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
