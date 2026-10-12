import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';
import { hashPassword } from '@/lib/password-utils';
import { normalizeGrade } from '@/lib/psychometric-access-policy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      mobile,
      role = 'student',
      grade,
      school,
      board = 'CBSE',
      stream,
      state,
      city,
      goals = [],
      declaredInterests = [],
    } = body;

    // Validation
    const cleanEmail = email?.trim()?.toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanName = name?.trim();
    if (!cleanName) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    // Role safety: strictly student or counsellor (never public admin escalation)
    const effectiveRole: 'student' | 'counsellor' = role === 'counsellor' ? 'counsellor' : 'student';

    // Check if user with this email already exists in Firestore
    try {
      const existingUserSnap = await adminDb
        .collection('users')
        .where('email', '==', cleanEmail)
        .limit(1)
        .get();

      if (!existingUserSnap.empty) {
        return NextResponse.json(
          { error: 'This email address is already registered. Please sign in instead.' },
          { status: 400 }
        );
      }
    } catch (checkErr: any) {
      console.warn('[Register] Firestore duplicate check note:', checkErr?.message);
    }

    // Generate unique UID
    const uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Attempt to register in Firebase Auth if identity toolkit is provisioned
    try {
      await adminAuth.createUser({
        uid,
        email: cleanEmail,
        password,
        displayName: cleanName,
      });
    } catch (authErr: any) {
      // Configuration-not-found is expected when Identity Platform is uninitialized
      console.warn('[Register] Admin Auth createUser fallback to Firestore-backed auth:', authErr?.message);
    }

    // Normalize grade and stream for students
    const normalizedGrade = effectiveRole === 'student' && grade ? normalizeGrade(grade) : null;
    const isSenior = normalizedGrade === '11' || normalizedGrade === '12';

    // Hash password securely for server-side authentication fallback
    const passwordHash = hashPassword(password);

    // Build comprehensive profile document
    const userProfilePayload: Record<string, any> = {
      uid,
      name: cleanName,
      email: cleanEmail,
      mobile: mobile?.trim() || '',
      role: effectiveRole,
      state: state || '',
      city: city?.trim() || '',
      currentSchool: school?.trim() || '',
      schoolName: school?.trim() || '',
      board: board || 'CBSE',
      stream: isSenior ? (stream || '') : '',
      goals: Array.isArray(goals) ? goals : [],
      declaredInterests: Array.isArray(declaredInterests) ? declaredInterests : [],
      onboarding: {
        goals: Array.isArray(goals) ? goals : [],
        declaredInterests: Array.isArray(declaredInterests) ? declaredInterests : [],
        registeredAt: new Date().toISOString(),
      },
      toolAccess: {
        iqTest: true,
        psychometricTest: true,
        universityPredictor: true,
      },
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (normalizedGrade) {
      userProfilePayload.grade = normalizedGrade;
      userProfilePayload.academicGrade = normalizedGrade;
      userProfilePayload.studentType = isSenior ? 'Class 11/12' : `Grade ${normalizedGrade}`;
    }

    // Save profile to Firestore
    await adminDb.collection('users').doc(uid).set(userProfilePayload);

    // Create authenticated session token
    let sessionCookie: string;
    try {
      sessionCookie = await adminAuth.createCustomToken(uid, {
        email: cleanEmail,
        role: effectiveRole,
        name: cleanName,
      });
    } catch (tokenErr: any) {
      console.warn('[Register] createCustomToken error, fallback token payload:', tokenErr?.message);
      // Fallback base64-encoded JWT session token
      const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(
        JSON.stringify({
          uid,
          sub: uid,
          email: cleanEmail,
          role: effectiveRole,
          name: cleanName,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5,
        })
      ).toString('base64');
      sessionCookie = `${header}.${payload}.unsigned`;
    }

    // Auto-allot unassigned students via SJF algorithm
    try {
      const { autoAllotAllUnassignedStudents } = await import('@/lib/sjf-allotment');
      autoAllotAllUnassignedStudents(adminDb).catch(() => {});
    } catch {}

    // Prepare response
    const redirectUrl = effectiveRole === 'counsellor' ? '/dashboard/counsellor' : '/dashboard/student/profile';
    const response = NextResponse.json(
      {
        success: true,
        uid,
        user: {
          uid,
          name: cleanName,
          email: cleanEmail,
          role: effectiveRole,
          grade: normalizedGrade,
        },
        redirectUrl,
      },
      { status: 201 }
    );

    // Set HTTP-only session cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('[Register] Error completing registration:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration.', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
