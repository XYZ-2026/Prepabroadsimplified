import { NextResponse } from 'next/server';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { getPortfolioByUid, savePortfolio, PortfolioValidationError } from '@/lib/portfolio-service';

export const dynamic = 'force-dynamic';

/** GET — the signed-in student's own portfolio row (or null). */
export async function GET() {
  const claims = await verifySessionCookie();
  if (!claims?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const portfolio = await getPortfolioByUid(claims.uid);
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    console.error('[Portfolio API] GET failed:', err);
    return NextResponse.json({ error: 'Could not load your portfolio.' }, { status: 502 });
  }
}

/** POST — create or update the signed-in student's portfolio row. */
export async function POST(request: Request) {
  const claims = await verifySessionCookie();
  if (!claims?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = await getUserRole();
  if (role !== 'student') {
    return NextResponse.json({ error: 'Only students can create a portfolio.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const portfolio = await savePortfolio(claims.uid, String(claims.email || ''), body);
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    if (err instanceof PortfolioValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('[Portfolio API] POST failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not save your portfolio.' },
      { status: 502 },
    );
  }
}
