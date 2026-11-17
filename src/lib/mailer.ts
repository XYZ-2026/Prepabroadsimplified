// Outbound email via SMTP (Google Workspace by default), falling back to Resend's HTTP API when SMTP
// is not configured. Server-only. If neither is configured the send is skipped — callers must never
// fail a user action because of email.
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

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function isMailConfigured(): boolean {
  return isSmtpConfigured() || Boolean(process.env.RESEND_API_KEY);
}

async function sendViaResend(input: MailInput): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'CLARVO <hello@clarvo.in>',
      to: input.to.split(',').map((t) => t.trim()).filter(Boolean),
      subject: headerSafe(input.subject),
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      ...(input.replyTo ? { reply_to: headerSafe(input.replyTo, 120) } : {}),
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(`Resend ${res.status}: ${body.message || 'send failed'}`);
  }
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
    console.warn('[Mailer] Neither SMTP nor Resend is configured — email skipped.');
    return { status: 'skipped' };
  }

  try {
    if (!isSmtpConfigured()) {
      await sendViaResend(input);
      return { status: 'sent' };
    }
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
