import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { PREFERENCE_KEYS, resolvePreferences } from '@/lib/user-preferences';
import { isSameOrigin } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    return NextResponse.json({ success: true, preferences: resolvePreferences(snap.data()?.preferences) });
  } catch (err) {
    console.error('[Settings API] GET failed:', err);
    return NextResponse.json({ error: 'Could not load your settings.' }, { status: 503 });
  }
}

/** PATCH { <preferenceKey>: boolean, ... } — only allow-listed boolean keys are stored. */
export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const patch: Record<string, boolean> = {};
  for (const key of PREFERENCE_KEYS) {
    if (typeof body[key] === 'boolean') patch[key] = body[key];
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });

  try {
    const ref = adminDb.collection('users').doc(claims.uid);
    await ref.set({ preferences: { ...patch, updatedAt: new Date().toISOString() } }, { merge: true });
    const snap = await ref.get();
    return NextResponse.json({ success: true, preferences: resolvePreferences(snap.data()?.preferences) });
  } catch (err) {
    console.error('[Settings API] PATCH failed:', err);
    return NextResponse.json({ error: 'Could not save your settings.' }, { status: 503 });
  }
}
