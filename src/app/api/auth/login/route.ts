import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, verifyFirebaseIdToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { SESSION_TTL_SECONDS, safeEqual, type SessionRole } from '@/lib/session-token';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const DEMO_COUNSELLOR_EMAIL = 'counsellor@as.com';

function redirectFor(role: SessionRole): string {
  if (role === 'admin') return '/dashboard/admin/users';
  if (role === 'counsellor') return '/dashboard/counsellor';
  return '/dashboard/student/profile';
}

function normaliseRole(value: unknown): SessionRole {
  return value === 'admin' || value === 'counsellor' ? value : 'student';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken, email, password } = body as { idToken?: string; email?: string; password?: string };
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Brute-force protection: per IP and per account
    const ip = clientIp(request);
    const ipLimit = rateLimit(`login:ip:${ip}`, 30, 10 * 60 * 1000);
    const acctLimit = cleanEmail ? rateLimit(`login:acct:${cleanEmail}`, 8, 10 * 60 * 1000) : { ok: true, retryAfterSec: 0 };
    if (!ipLimit.ok || !acctLimit.ok) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(Math.max(ipLimit.retryAfterSec, acctLimit.retryAfterSec)) } }
      );
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const counsellorDemoPassword = process.env.COUNSELLOR_DEMO_PASSWORD || '';

    let session: { uid: string; email: string; name: string; role: SessionRole };
    const invalid = () => NextResponse.json({ error: 'Invalid email or password. Please try again.' }, { status: 401 });

    if (adminEmail && cleanEmail === adminEmail) {
      // Administrator — credentials come from the environment, never from source code
      if (!adminPassword || typeof password !== 'string' || !safeEqual(password, adminPassword)) return invalid();

      session = { uid: 'admin_master_001', email: adminEmail, name: 'Admin', role: 'admin' };
      try {
        const { adminDb } = await import('@/lib/firebase-admin');
        await adminDb.collection('users').doc(session.uid).set(
          { uid: session.uid, email: adminEmail, name: 'Admin', role: 'admin', admin: true, updatedAt: new Date() },
          { merge: true }
        );
      } catch {}
    } else if (cleanEmail === DEMO_COUNSELLOR_EMAIL) {
      // Demo counsellor — disabled unless a password is configured
      if (!counsellorDemoPassword || typeof password !== 'string' || !safeEqual(password, counsellorDemoPassword)) return invalid();
      session = { uid: 'counsellor_demo_001', email: DEMO_COUNSELLOR_EMAIL, name: 'Counsellor', role: 'counsellor' };
    } else if (idToken) {
      // Firebase-authenticated user (email/password via Firebase, or Google). Token is verified, never trusted.
      let decoded;
      try {
        decoded = await verifyFirebaseIdToken(idToken);
      } catch {
        return NextResponse.json({ error: 'Your sign-in could not be verified. Please try again.' }, { status: 401 });
      }

      const { adminDb } = await import('@/lib/firebase-admin');
      let role: SessionRole = 'student';
      let name = (decoded.name as string) || '';
      try {
        const ref = adminDb.collection('users').doc(decoded.uid);
        const snap = await ref.get();
        if (snap.exists) {
          const data = snap.data() || {};
          role = normaliseRole(data.role);
          name = data.name || name;
        } else {
          // First Google sign-in: create the profile server-side (clients can no longer write user documents)
          await ref.set({
            uid: decoded.uid,
            name,
            email: (decoded.email || '').toLowerCase(),
            mobile: decoded.phone_number || '',
            role: 'student',
            grade: '',
            academicGrade: '',
            currentSchool: '',
            schoolName: '',
            board: '',
            stream: '',
            state: '',
            city: '',
            toolAccess: { iqTest: true, psychometricTest: false, universityPredictor: true },
            createdAt: new Date(),
            updatedAt: new Date(),
          }, { merge: true });
        }
      } catch (dbErr) {
        console.warn('[Login] Firestore profile lookup failed, defaulting to student:', dbErr);
      }

      session = { uid: decoded.uid, email: (decoded.email || '').toLowerCase(), name, role };
    } else if (cleanEmail && typeof password === 'string' && password) {
      // Server-side password verification against the stored hash
      const { adminDb } = await import('@/lib/firebase-admin');
      const { verifyPassword, hashPassword, needsRehash } = await import('@/lib/password-utils');

      const userSnap = await adminDb.collection('users').where('email', '==', cleanEmail).limit(1).get();
      if (userSnap.empty) return invalid();

      const userDoc = userSnap.docs[0];
      const userData = userDoc.data();
      if (!userData.passwordHash || !verifyPassword(password, userData.passwordHash)) return invalid();

      if (needsRehash(userData.passwordHash)) {
        userDoc.ref.set({ passwordHash: hashPassword(password) }, { merge: true }).catch(() => {});
      }

      session = {
        uid: userDoc.id,
        email: cleanEmail,
        name: userData.name || '',
        role: normaliseRole(userData.role),
      };
    } else {
      return NextResponse.json({ error: 'Missing or invalid authentication credentials' }, { status: 400 });
    }

    // Auto-allot existing unassigned students via SJF
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      const { autoAllotAllUnassignedStudents } = await import('@/lib/sjf-allotment');
      autoAllotAllUnassignedStudents(adminDb).catch(() => {});
    } catch {}

    const response = NextResponse.json({ success: true, redirectUrl: redirectFor(session.role), role: session.role }, { status: 200 });
    response.cookies.set(SESSION_COOKIE_NAME, createSessionCookie(session), {
      maxAge: SESSION_TTL_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    return response;
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
