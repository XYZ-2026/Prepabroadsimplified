import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth';
import { getEssay, updateEssay, deleteEssay, EssayError } from '@/lib/essay-service';
import { isSameOrigin } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  try {
    const essay = await getEssay(claims.uid, id);
    if (!essay) return NextResponse.json({ error: 'Essay not found.' }, { status: 404 });
    return NextResponse.json({ success: true, essay });
  } catch (err) {
    console.error('[Essays API] get failed:', err);
    return NextResponse.json({ error: 'Could not load the essay.' }, { status: 503 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  try {
    const essay = await updateEssay(claims.uid, id, body);
    return NextResponse.json({ success: true, essay });
  } catch (err) {
    if (err instanceof EssayError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error('[Essays API] update failed:', err);
    return NextResponse.json({ error: 'Could not save the essay.' }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  try {
    await deleteEssay(claims.uid, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof EssayError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error('[Essays API] delete failed:', err);
    return NextResponse.json({ error: 'Could not delete the essay.' }, { status: 503 });
  }
}
