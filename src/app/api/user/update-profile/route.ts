import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, createSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';
import { SESSION_TTL_SECONDS } from '@/lib/session-token';
import { normalizeGrade, getStudentPsychometricAccess } from '@/lib/psychometric-access-policy';
import { isSameOrigin } from '@/lib/rate-limit';

// Allow-listed free-text fields and their maximum lengths.
// Only keys PRESENT in the request body are written, so partial updates
// (e.g. from a single section) never blank out other fields.
const STRING_FIELDS: Record<string, number> = {
  name: 100,
  mobile: 20,
  state: 60,
  city: 60,
  board: 60,
  stream: 60,
  graduationYear: 10,
  targetCountries: 200,
  degreeLevel: 30,
  fieldOfInterest: 120,
  designation: 100,
  specialization: 200,
  experienceYears: 10,
  bio: 1000,
  parentName: 100,
  parentPhone: 20,
  parentEmail: 120,
  parentRelation: 30,
};

const toCleanString = (v: unknown, max: number): string => {
  if (typeof v === 'number') v = String(v);
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max);
};

const toStringList = (v: unknown): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string').slice(0, 30).map((x) => x.trim().slice(0, 80)).filter(Boolean)
    : [];

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const rawGradeInput = body.grade !== undefined ? body.grade : body.academicGrade;
    const normalizedGrade = rawGradeInput ? normalizeGrade(rawGradeInput) : undefined;

    // Validate grade if provided
    if (rawGradeInput !== undefined && rawGradeInput !== null && rawGradeInput !== '' && !normalizedGrade) {
      return NextResponse.json(
        { error: 'Invalid academic grade. Supported grades are Grade 7 through Grade 12.' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };

    for (const [key, max] of Object.entries(STRING_FIELDS)) {
      if (body[key] !== undefined) updatePayload[key] = toCleanString(body[key], max);
    }

    if (updatePayload.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatePayload.parentEmail)) {
      return NextResponse.json({ error: 'Please enter a valid parent / guardian email address.' }, { status: 400 });
    }

    if (body.schoolName !== undefined || body.currentSchool !== undefined) {
      const school = toCleanString(body.schoolName ?? body.currentSchool, 120);
      updatePayload.currentSchool = school;
      updatePayload.schoolName = school;
    }

    if (normalizedGrade) {
      updatePayload.grade = normalizedGrade;
      updatePayload.academicGrade = normalizedGrade;
      const isSenior = normalizedGrade === '11' || normalizedGrade === '12';
      const isJunior = ['7', '8', '9'].includes(normalizedGrade);
      updatePayload.studentType = isSenior ? 'high_school' : isJunior ? 'middle_school' : 'secondary_school';
    } else if (typeof body.studentType === 'string') {
      updatePayload.studentType = toCleanString(body.studentType, 30);
    }

    if (body.goals !== undefined) updatePayload.goals = toStringList(body.goals);
    if (body.declaredInterests !== undefined) updatePayload.declaredInterests = toStringList(body.declaredInterests);
    if (body.onboarding && typeof body.onboarding === 'object') {
      updatePayload.onboarding = {
        ...(typeof body.onboarding.completed === 'boolean' ? { completed: body.onboarding.completed } : {}),
        ...(typeof body.onboarding.completedAt === 'string' ? { completedAt: body.onboarding.completedAt.slice(0, 40) } : {}),
      };
    }

    // Existing document (needed for first-time Google onboarding and role handling)
    let existing: Record<string, any> | null = null;
    try {
      const snap = await adminDb.collection('users').doc(claims.uid).get();
      existing = snap.exists ? snap.data() || {} : null;
    } catch (dbErr) {
      console.warn('[Update Profile Route] Firestore read fallback:', dbErr);
    }

    // First-time Google onboarding may choose the counsellor track (same as public registration).
    // It cannot be used to change roles later, and never to become admin.
    let roleChangedTo: 'counsellor' | null = null;
    if (
      body.role === 'counsellor' &&
      claims.role === 'student' &&
      (!existing || ((!existing.role || existing.role === 'student') && existing.onboarding?.completed !== true))
    ) {
      updatePayload.role = 'counsellor';
      roleChangedTo = 'counsellor';
    }

    if (existing === null) {
      // No profile yet — create with safe server-side defaults
      updatePayload.uid = claims.uid;
      updatePayload.email = claims.email;
      updatePayload.role = updatePayload.role || claims.role;
      updatePayload.toolAccess = { iqTest: true, psychometricTest: false, universityPredictor: true };
      updatePayload.createdAt = new Date();
    }

    try {
      await adminDb.collection('users').doc(claims.uid).set(updatePayload, { merge: true });
    } catch (dbErr) {
      console.warn('[Update Profile Route] Firestore write fallback:', dbErr);
    }

    // Mirror to dev profile cache
    const pCache = ((globalThis as any).__userProfileCache = (globalThis as any).__userProfileCache || new Map());
    const cached = pCache.get(claims.uid) || {};
    const updatedData = { ...(existing || {}), ...cached, ...updatePayload };
    pCache.set(claims.uid, updatedData);

    const userRole = roleChangedTo || claims.role;
    const access = getStudentPsychometricAccess(
      updatedData.grade || updatedData.academicGrade,
      updatedData.toolAccess,
      userRole
    );

    const { passwordHash: _omit, ...safeUser } = updatedData as Record<string, any>;
    const response = NextResponse.json({
      success: true,
      user: { ...safeUser, id: claims.uid },
      psychometricAccess: access,
    });

    if (roleChangedTo) {
      response.cookies.set(
        SESSION_COOKIE_NAME,
        createSessionCookie({
          uid: claims.uid,
          email: claims.email,
          name: updatedData.name || claims.name,
          role: roleChangedTo,
        }),
        {
          maxAge: SESSION_TTL_SECONDS,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        }
      );
    }

    return response;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
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

    const userRole = claims.role;
    const access = getStudentPsychometricAccess(
      data.grade || data.academicGrade,
      data.toolAccess,
      userRole
    );

    const { passwordHash: _omit, ...safeData } = data;

    return NextResponse.json({
      success: true,
      user: {
        ...safeData,
        id: claims.uid,
        name: data.name || claims.name || '',
        email: data.email || claims.email || '',
        role: userRole,
        grade: data.grade || data.academicGrade || '',
        academicGrade: data.academicGrade || data.grade || '',
        currentSchool: data.currentSchool || data.schoolName || '',
        schoolName: data.schoolName || data.currentSchool || '',
      },
      psychometricAccess: access,
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
