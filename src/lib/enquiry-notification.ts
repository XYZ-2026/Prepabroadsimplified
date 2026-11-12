// Builds and sends the "new consultation request" alert to the support team.
import { sendMail, headerSafe, escapeHtml, type MailStatus } from '@/lib/mailer';
import type { EnquiryRecord } from '@/lib/enquiry-service';

const SUPPORT_FALLBACK = 'support@clarvo.in';

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://clarvo.in').replace(/\/+$/, '');
}

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

export async function notifySupportOfEnquiry(e: EnquiryRecord): Promise<MailStatus> {
  const to = process.env.ENQUIRY_NOTIFY_TO || SUPPORT_FALLBACK;
  const adminUrl = `${appBaseUrl()}/dashboard/admin/enquiries`;

  const rows: [string, string][] = [
    ['Reference ID', e.id],
    ['Parent / Guardian', e.parentName],
    ['Phone / WhatsApp', e.phone],
    ['Email', e.email || '—'],
    ['Student name', e.studentName || '—'],
    ['Academic stage', e.academicLevel],
    ['Grade', e.grade || '—'],
    ['School', e.schoolName || '—'],
    ['Board', e.board || '—'],
    ['Stream', e.stream || '—'],
    ['Development priorities', e.developmentAreas.join(', ') || '—'],
    ['Services of interest', e.clarvoExploration.join(', ') || '—'],
    ['Preferred time', e.preferredTimeFrame],
    ['Notes', e.notes || '—'],
    ['Source page', e.sourcePage || '—'],
    ['Submitted at', e.createdAt],
  ];

  const subject = `New consultation request — ${headerSafe(e.parentName, 60)}${e.grade ? ` (${headerSafe(e.grade, 30)})` : ''}`;

  const text =
    `A new consultation request was submitted on the CLARVO website.\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nOpen in the admin dashboard: ${adminUrl}\n` +
    (e.email ? `\nYou can reply to this email to reach ${e.parentName} directly.\n` : '');

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">` +
    `<h2 style="margin:0 0 6px;color:#2563eb">New consultation request</h2>` +
    `<p style="margin:0 0 16px;color:#475569">Submitted on the CLARVO website. Please contact the family during their preferred window.</p>` +
    `<table style="border-collapse:collapse;width:100%;font-size:14px">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 10px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:700;width:190px;vertical-align:top">${escapeHtml(k)}</td>` +
          `<td style="padding:8px 10px;border:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
      )
      .join('') +
    `</table>` +
    `<p style="margin:18px 0 0"><a href="${adminUrl}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">Open admin dashboard</a></p>` +
    `</div>`;

  const { status } = await sendMail({
    to,
    subject,
    text,
    html,
    replyTo: e.email && EMAIL_RE.test(e.email) ? e.email : undefined,
  });
  return status;
}
