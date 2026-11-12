import { NextResponse, after } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { sendMail, escapeHtml, headerSafe } from '@/lib/mailer';

/**
 * POST — request account deletion. This is a REQUEST, not an instant delete:
 * assessment records and reports are kept until the team has verified the request.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claims = await verifySessionCookie();
  if (!claims) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = rateLimit(`delete-request:${claims.uid}`, 3, 24 * 60 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: 'You have already sent a request. Our team will be in touch.' }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 500) : '';

  try {
    const userRef = adminDb.collection('users').doc(claims.uid);
    const snap = await userRef.get();
    const name: string = snap.data()?.name || claims.name || '';
    const email: string = snap.data()?.email || claims.email || '';
    const requestedAt = new Date().toISOString();

    await adminDb.collection('account_deletion_requests').doc(claims.uid).set(
      { uid: claims.uid, name, email, reason, status: 'pending', requestedAt },
      { merge: true }
    );
    await userRef.set({ deletionRequestedAt: requestedAt }, { merge: true });

    after(async () => {
      await sendMail({
        to: process.env.ENQUIRY_NOTIFY_TO || 'support@clarvo.in',
        subject: `Account deletion request — ${headerSafe(name || email, 80)}`,
        text:
          `A student has requested deletion of their CLARVO account.\n\n` +
          `Name: ${name}\nEmail: ${email}\nUser ID: ${claims.uid}\nRequested at: ${requestedAt}\n` +
          `Reason: ${reason || '—'}\n\nPlease verify the request with the student before deleting any data.`,
        html:
          `<p>A student has requested deletion of their CLARVO account.</p><ul>` +
          `<li><b>Name:</b> ${escapeHtml(name)}</li><li><b>Email:</b> ${escapeHtml(email)}</li>` +
          `<li><b>User ID:</b> ${escapeHtml(claims.uid)}</li><li><b>Requested at:</b> ${escapeHtml(requestedAt)}</li>` +
          `<li><b>Reason:</b> ${escapeHtml(reason || '—')}</li></ul>` +
          `<p>Please verify the request with the student before deleting any data.</p>`,
        replyTo: /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email) ? email : undefined,
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Delete Request] failed:', err);
    return NextResponse.json({ error: 'Could not send your request right now. Please try again.' }, { status: 503 });
  }
}
