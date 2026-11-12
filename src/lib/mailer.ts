// Outbound email via SMTP (Google Workspace by default). Server-only.
// If SMTP is not configured the send is skipped — callers must never fail a user action because of email.
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type MailStatus = 'sent' | 'failed' | 'skipped';

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

const g = globalThis as unknown as { __clarvoMailer?: Transporter };

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport(): Transporter {
  if (!g.__clarvoMailer) {
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    g.__clarvoMailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return g.__clarvoMailer;
}

/** Strip anything that could inject extra headers. */
export const headerSafe = (v: string, max = 200) => v.replace(/[\r\n\u0000-\u001f]+/g, ' ').trim().slice(0, max);

export const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function sendMail(input: MailInput): Promise<{ status: MailStatus; error?: string }> {
  if (!isMailConfigured()) {
    console.warn('[Mailer] SMTP is not configured — email skipped.');
    return { status: 'skipped' };
  }

  try {
    const from = process.env.SMTP_FROM || `CLARVO <${process.env.SMTP_USER}>`;
    await getTransport().sendMail({
      from,
      to: input.to,
      subject: headerSafe(input.subject),
      text: input.text,
      html: input.html,
      ...(input.replyTo ? { replyTo: headerSafe(input.replyTo, 120) } : {}),
    });
    return { status: 'sent' };
  } catch (err: any) {
    console.error('[Mailer] Send failed:', err?.message || err);
    return { status: 'failed', error: String(err?.message || err).slice(0, 200) };
  }
}
