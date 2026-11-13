import { NextRequest, NextResponse, after } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { SESSION_COOKIE_NAME, createSessionCookie, verifyFirebaseIdToken } from '@/lib/auth';
import { SESSION_TTL_SECONDS } from '@/lib/session-token';
import { hashPassword } from '@/lib/password-utils';
import { normalizeGrade } from '@/lib/psychometric-access-policy';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { sendWelcomeEmailOnce } from '@/lib/welcome-email';

const RESERVED_EMAILS = new Set(['admin@as.com', 'counsellor@as.com']);

export async function POST(request: NextRequest) {
  try {
    const ipLimit = rateLimit(`register:ip:${clientIp(request)}`, 10, 60 * 60 * 1000);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'Too many sign-up attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSec) } }
      );
    }

    const body = await request.json();
    const {
      uid: providedUid,
      idToken,
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
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (RESERVED_EMAILS.has(cleanEmail) || (adminEmail && cleanEmail === adminEmail)) {
      return NextResponse.json({ error: 'This email address cannot be used to register.' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const cleanName = typeof name === 'string' ? name.trim().slice(0, 100) : '';
    if (!cleanName) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    // Role safety: strictly student or counsellor (never public admin escalation)
    const effectiveRole: 'student' | 'counsellor' = role === 'counsellor' ? 'counsellor' : 'student';

    // A client-supplied uid is honoured ONLY when it matches a verified Firebase ID token for this email.
    let verifiedUid: string | null = null;
    if (idToken && providedUid) {
      try {
        const decoded = await verifyFirebaseIdToken(idToken);
        if (decoded.uid === providedUid && (decoded.email || '').toLowerCase() === cleanEmail) {
          verifiedUid = decoded.uid;
        }
      } catch {
        // fall through: treated as an unverified registration with a server-generated uid
      }
    }

    // Duplicate check — always enforced
    try {
      const existingUserSnap = await adminDb.collection('users').where('email', '==', cleanEmail).limit(1).get();
      if (!existingUserSnap.empty) {
        const existing = existingUserSnap.docs[0];
        const isOwnPartialRecord = verifiedUid && existing.id === verifiedUid && !existing.data().passwordHash;
        if (!isOwnPartialRecord) {
          return NextResponse.json(
            { error: 'This email address is already registered. Please sign in instead.' },
            { status: 400 }
          );
        }
      }
    } catch (checkErr: any) {
      console.warn('[Register] Firestore duplicate check note:', checkErr?.message);
    }

    const uid = verifiedUid || `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create the Firebase Auth user server-side when the client did not
    if (!verifiedUid) {
      try {
        await adminAuth.createUser({ uid, email: cleanEmail, password, displayName: cleanName });
      } catch (authErr: any) {
        console.warn('[Register] Admin Auth createUser note:', authErr?.message);
      }
    }

    // Normalize grade and stream for students
    const normalizedGrade = effectiveRole === 'student' && grade ? normalizeGrade(grade) : null;
    const isSenior = normalizedGrade === '11' || normalizedGrade === '12';

    const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const strList = (v: unknown) =>
      Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 30).map((x: string) => x.slice(0, 80)) : [];

    const userProfilePayload: Record<string, any> = {
      uid,
      name: cleanName,
      email: cleanEmail,
      mobile: str(mobile, 20),
      role: effectiveRole,
      state: str(state, 60),
      city: str(city, 60),
      currentSchool: str(school, 120),
      schoolName: str(school, 120),
      board: str(board, 60) || 'CBSE',
      stream: isSenior ? str(stream, 60) : '',
      goals: strList(goals),
      declaredInterests: strList(declaredInterests),
      onboarding: {
        goals: strList(goals),
        declaredInterests: strList(declaredInterests),
        registeredAt: new Date().toISOString(),
      },
      toolAccess: {
        iqTest: true,
        psychometricTest: false, // Psychometric test requires admin access activation
        universityPredictor: true,
      },
      accessRequests: ['psychometricTest'], // Automatically route access permission request to admin
      passwordHash: hashPassword(password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (normalizedGrade) {
      userProfilePayload.grade = normalizedGrade;
      userProfilePayload.academicGrade = normalizedGrade;
      userProfilePayload.studentType = isSenior ? 'Class 11/12' : `Grade ${normalizedGrade}`;
    }

    try {
      await adminDb.collection('users').doc(uid).set(userProfilePayload, { merge: true });
    } catch (dbErr: any) {
      console.warn('[Register] Firestore adminDb profile write notice:', dbErr?.message);
    }

    // One-time welcome email (runs after the response so sign-up stays fast; deduplicated per user)
    after(() => sendWelcomeEmailOnce({ uid, email: cleanEmail, name: cleanName, role: effectiveRole }));

    // Auto-allot unassigned students via SJF algorithm
    try {
      const { autoAllotAllUnassignedStudents } = await import('@/lib/sjf-allotment');
      autoAllotAllUnassignedStudents(adminDb).catch(() => {});
    } catch {}

    const redirectUrl = effectiveRole === 'counsellor' ? '/dashboard/counsellor' : '/dashboard/student/profile';
    const response = NextResponse.json(
      {
        success: true,
        uid,
        user: { uid, name: cleanName, email: cleanEmail, role: effectiveRole, grade: normalizedGrade },
        redirectUrl,
      },
      { status: 201 }
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      createSessionCookie({ uid, email: cleanEmail, name: cleanName, role: effectiveRole }),
      {
        maxAge: SESSION_TTL_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      }
    );

    return response;
  } catch (error: any) {
    console.error('[Register] Error completing registration:', error);
    return NextResponse.json({ error: 'Failed to complete registration.' }, { status: 500 });
  }
}
