import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const toPlain = (value: any): any => {
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(toPlain);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toPlain(v)]));
  return value;
};

/** GET — download the signed-in user's own data as JSON. */
export async function GET() {
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = rateLimit(`export:${claims.uid}`, 5, 60 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: 'Too many exports. Please try again later.' }, { status: 429 });

  try {
    const userRef = adminDb.collection('users').doc(claims.uid);
    const [userSnap, essaysSnap] = await Promise.all([userRef.get(), userRef.collection('essays').get()]);

    // Never include credentials or internal flags
    const { passwordHash, accessRequests, assignedCounsellor, ...profile } = (userSnap.data() || {}) as Record<string, any>;

    const payload = {
      exportedAt: new Date().toISOString(),
      account: { uid: claims.uid, email: claims.email },
      profile: toPlain(profile),
      essays: essaysSnap.docs.map((d) => ({ id: d.id, ...toPlain(d.data()) })),
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="clarvo-my-data.json"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[Export] failed:', err);
    return NextResponse.json({ error: 'Could not prepare your data right now.' }, { status: 503 });
  }
}
