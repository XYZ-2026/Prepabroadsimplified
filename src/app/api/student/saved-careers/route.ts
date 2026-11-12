import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { getAllCareerProfiles } from '@/lib/career-library/career-service';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_SAVED = 50;

export interface SavedCareer {
  id: string;
  savedAt: string;
}

function readSaved(data: FirebaseFirestore.DocumentData | undefined): SavedCareer[] {
  const raw = data?.savedCareers;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x.id === 'string')
    .map((x) => ({ id: x.id as string, savedAt: typeof x.savedAt === 'string' ? x.savedAt : '' }));
}

/** GET — the signed-in user's bookmarked careers. */
export async function GET() {
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ authenticated: false, savedCareers: [] }, { status: 401 });

  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    return NextResponse.json({ authenticated: true, savedCareers: readSaved(snap.data()) });
  } catch (err) {
    console.error('[Saved Careers API] GET failed:', err);
    return NextResponse.json({ error: 'Could not load saved careers.' }, { status: 503 });
  }
}

/** PUT { careerId, saved } — idempotent bookmark / un-bookmark. */
export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Please sign in to save careers.' }, { status: 401 });

  const limit = rateLimit(`saved-careers:${claims.uid}`, 120, 10 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });

  const body = await request.json().catch(() => null);
  const careerId = typeof body?.careerId === 'string' ? body.careerId : '';
  const saved = body?.saved === true;

  if (!careerId || careerId.length > 80 || !getAllCareerProfiles().some((p) => p.id === careerId)) {
    return NextResponse.json({ error: 'Unknown career.' }, { status: 400 });
  }

  try {
    const ref = adminDb.collection('users').doc(claims.uid);
    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      let list = readSaved(snap.data());
      const exists = list.some((c) => c.id === careerId);

      if (saved && !exists) {
        if (list.length >= MAX_SAVED) return { error: `You can save up to ${MAX_SAVED} careers. Remove one to add another.` };
        list = [...list, { id: careerId, savedAt: new Date().toISOString() }];
      } else if (!saved && exists) {
        list = list.filter((c) => c.id !== careerId);
      }

      tx.set(ref, { savedCareers: list }, { merge: true });
      return { list };
    });

    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 409 });
    return NextResponse.json({ success: true, savedCareers: result.list });
  } catch (err) {
    console.error('[Saved Careers API] PUT failed:', err);
    return NextResponse.json({ error: 'Could not update your saved careers. Please try again.' }, { status: 503 });
  }
}
