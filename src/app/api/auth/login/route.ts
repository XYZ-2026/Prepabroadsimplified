import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, email, password } = body;

    let sessionCookie: string;

    const cleanEmail = email?.trim()?.toLowerCase();

    if (idToken) {
      sessionCookie = await createSessionCookie(idToken);
    } else if (cleanEmail === 'admin@as.com' && password === 'admin123') {
      // Direct Admin Authentication signed via service account private key
      const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
      sessionCookie = await adminAuth.createCustomToken('admin_master_001', {
        email: 'admin@as.com',
        role: 'admin',
        admin: true,
      });

      // Ensure Admin record exists in Firestore
      try {
        await adminDb.collection('users').doc('admin_master_001').set({
          uid: 'admin_master_001',
          email: 'admin@as.com',
          name: 'Admin',
          role: 'admin',
          admin: true,
          updatedAt: new Date(),
        }, { merge: true });
      } catch {}
    } else if (cleanEmail === 'counsellor@as.com' && password === 'counsellor123') {
      // Direct Counsellor Demo Authentication
      const { adminAuth } = await import('@/lib/firebase-admin');
      sessionCookie = await adminAuth.createCustomToken('counsellor_demo_001', {
        email: 'counsellor@as.com',
        role: 'counsellor',
      });
    } else if (cleanEmail && password) {
      // Firestore User Lookup and Password Verification
      const { adminAuth, adminDb } = await import('@/lib/firebase-admin');
      const { verifyPassword } = await import('@/lib/password-utils');

      const userSnap = await adminDb
        .collection('users')
        .where('email', '==', cleanEmail)
        .limit(1)
        .get();

      if (userSnap.empty) {
        return NextResponse.json({ error: 'Invalid email or password. Please try again.' }, { status: 401 });
      }

      const userDoc = userSnap.docs[0];
      const userData = userDoc.data();

      if (!userData.passwordHash || !verifyPassword(password, userData.passwordHash)) {
        return NextResponse.json({ error: 'Invalid email or password. Please try again.' }, { status: 401 });
      }

      sessionCookie = await adminAuth.createCustomToken(userDoc.id, {
        email: cleanEmail,
        role: userData.role || 'student',
        name: userData.name || '',
      });
    } else {
      return NextResponse.json({ error: 'Missing or invalid authentication credentials' }, { status: 400 });
    }

    // Auto-allot all existing unassigned students in Firestore via SJF
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      const { autoAllotAllUnassignedStudents } = await import('@/lib/sjf-allotment');
      autoAllotAllUnassignedStudents(adminDb).catch(() => {});
    } catch {}

    // Resolve target redirect from verified cookie claims
    let redirectUrl = '/dashboard/student/profile';
    try {
      const parts = sessionCookie.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        const claims = payload.claims || {};
        const effectiveEmail = payload.email || claims.email;
        const effectiveRole = payload.role || claims.role;
        const effectiveAdmin = payload.admin || claims.admin;

        if (effectiveEmail === 'admin@as.com' || effectiveAdmin === true || effectiveRole === 'admin') {
          redirectUrl = '/dashboard/admin/users';
        } else if (effectiveEmail === 'counsellor@as.com' || effectiveRole === 'counsellor' || effectiveEmail?.includes('counsellor')) {
          redirectUrl = '/dashboard/counsellor';
        }
      }
    } catch {}

    // Create the response
    const response = NextResponse.json({ success: true, redirectUrl }, { status: 200 });

    // Set the cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error', details: error?.message || String(error) }, { status: 500 });
  }
}
