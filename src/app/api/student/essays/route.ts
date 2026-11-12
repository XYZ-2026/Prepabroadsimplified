import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth';
import { listEssays, createEssay, EssayError } from '@/lib/essay-service';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    return NextResponse.json({ success: true, essays: await listEssays(claims.uid) });
  } catch (err) {
    console.error('[Essays API] list failed:', err);
    return NextResponse.json({ error: 'Could not load your essays.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = rateLimit(`essay-create:${claims.uid}`, 20, 60 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: 'Too many new essays. Please try again later.' }, { status: 429 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  try {
    const essay = await createEssay(claims.uid, body);
    return NextResponse.json({ success: true, essay }, { status: 201 });
  } catch (err) {
    if (err instanceof EssayError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error('[Essays API] create failed:', err);
    return NextResponse.json({ error: 'Could not create the essay.' }, { status: 503 });
  }
}
