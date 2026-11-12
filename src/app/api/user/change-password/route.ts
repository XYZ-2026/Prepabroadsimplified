import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password-utils';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = rateLimit(`change-password:${claims.uid}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
  }
  if (newPassword.length > 128) {
    return NextResponse.json({ error: 'New password is too long.' }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: 'Your new password must be different from the current one.' }, { status: 400 });
  }

  try {
    const ref = adminDb.collection('users').doc(claims.uid);
    const snap = await ref.get();
    const hash: string | undefined = snap.data()?.passwordHash;

    if (!hash) {
      return NextResponse.json(
        { error: 'Your account signs in with Google, so its password is managed by Google.' },
        { status: 400 }
      );
    }
    if (!verifyPassword(currentPassword, hash)) {
      return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 });
    }

    // Update Firebase Auth FIRST. If it fails (other than "no such user"), abort — otherwise the old
    // password would keep working through Firebase sign-in.
    try {
      await adminAuth.updateUser(claims.uid, { password: newPassword });
    } catch (authErr: any) {
      if (authErr?.code !== 'auth/user-not-found') {
        console.error('[Change Password] Firebase Auth update failed:', authErr?.message || authErr);
        return NextResponse.json({ error: 'Could not update your password right now. Please try again.' }, { status: 503 });
      }
    }

    await ref.set({ passwordHash: hashPassword(newPassword), passwordChangedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Change Password] failed:', err);
    return NextResponse.json({ error: 'Could not update your password right now. Please try again.' }, { status: 503 });
  }
}
