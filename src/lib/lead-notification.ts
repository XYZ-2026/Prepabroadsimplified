// Emails every new lead (sign-ups and website form submissions) to the leads inbox. Server-only.
// Never throws — a failed notification must never fail the user's action.
import { sendMail, headerSafe, escapeHtml, type MailStatus } from '@/lib/mailer';
import { adminDb } from '@/lib/firebase-admin';

const DEFAULT_LEADS_INBOX = 'support@clarvo.in';
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

/** Where lead alerts go. Override with LEADS_NOTIFY_TO (comma-separated for several inboxes). */
export function leadsInbox(): string {
  return (process.env.LEADS_NOTIFY_TO || DEFAULT_LEADS_INBOX).trim();
}

export type LeadRow = [label: string, value: unknown];

export interface LeadNotice {
  /** Short label shown in the subject and heading, e.g. "New sign-up". */
  kind: string;
  /** Who the lead is — used in the subject line. */
  who: string;
  rows: LeadRow[];
  /** The lead's email, so the team can reply directly. */
  replyTo?: string;
}

const fmt = (v: unknown): string => {
  if (v === undefined || v === null || v === '') return '—';
  if (Array.isArray(v)) return v.length ? v.map(String).join(', ') : '—';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return String(v);
};

export async function notifyLead(notice: LeadNotice): Promise<MailStatus> {
  try {
    const rows = [...notice.rows, ['Received at', new Date().toISOString()] as LeadRow].map(
      ([k, v]) => [k, fmt(v)] as const
    );
    const subject = `${notice.kind} — ${headerSafe(notice.who || 'Unknown', 80)}`;
    const text = `${notice.kind} on the CLARVO website.\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n');
    const html =
      `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">` +
      `<h2 style="margin:0 0 6px;color:#2563eb">${escapeHtml(notice.kind)}</h2>` +
      `<p style="margin:0 0 16px;color:#475569">Submitted on the CLARVO website.</p>` +
      `<table style="border-collapse:collapse;width:100%;font-size:14px">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;width:190px;vertical-align:top">${escapeHtml(k)}</td>` +
            `<td style="padding:8px 10px;border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
        )
        .join('') +
      `</table></div>`;

    const { status } = await sendMail({
      to: leadsInbox(),
      subject,
      text,
      html,
      replyTo: notice.replyTo && EMAIL_RE.test(notice.replyTo) ? notice.replyTo : undefined,
    });
    if (status !== 'sent') console.warn(`[Leads] "${notice.kind}" notification ${status}.`);
    return status;
  } catch (err) {
    console.error('[Leads] Notification error:', (err as Error)?.message);
    return 'failed';
  }
}

/**
 * Sign-up lead alert, sent at most once per user (claimed on the user document), so repeat
 * sign-ins or retries never send a duplicate.
 */
export async function notifySignupLeadOnce(uid: string, notice: LeadNotice): Promise<MailStatus> {
  const ref = adminDb.collection('users').doc(uid);
  try {
    const claimed = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const prev = snap.exists ? snap.get('leadEmail') : null;
      if (prev && (prev.status === 'sent' || prev.status === 'sending')) return false;
      tx.set(ref, { leadEmail: { status: 'sending', claimedAt: new Date() } }, { merge: true });
      return true;
    });
    if (!claimed) return 'skipped';
  } catch (err) {
    console.warn('[Leads] Could not claim sign-up notification:', (err as Error)?.message);
    return 'failed';
  }
  const status = await notifyLead(notice);
  await ref.set({ leadEmail: { status, at: new Date() } }, { merge: true }).catch(() => {});
  return status;
}

/** Everything a user enters across the sign-up steps (Identity, Academic, Goals), for the lead alert. */
export function signupLeadNotice(
  uid: string,
  p: Record<string, any>,
  method: 'Email & password' | 'Google'
): LeadNotice {
  const role = p.role === 'counsellor' ? 'counsellor' : 'student';
  return {
    kind: role === 'counsellor' ? 'New counsellor sign-up' : 'New student sign-up',
    who: p.name || p.email || uid,
    replyTo: p.email,
    rows: [
      // Step 1 — Identity
      ['Name', p.name],
      ['Email', p.email],
      ['Mobile', p.mobile],
      ['Role', role],
      ['Sign-up method', method],
      // Step 2 — Academic
      ['Grade', p.grade || p.academicGrade],
      ['School', p.currentSchool || p.schoolName || p.school],
      ['Board', p.board],
      ['Stream', p.stream],
      ['State', p.state],
      ['City', p.city],
      // Step 3 — Goals
      ['Goals', p.goals],
      ['Interests', p.declaredInterests],
      ['User ID', uid],
    ],
  };
}
