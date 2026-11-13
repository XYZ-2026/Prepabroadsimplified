// Welcome email sent once, right after an account is created. Server-only.
// Delivery goes through Resend's HTTP API (no SDK needed). Exactly-once is enforced by a
// Firestore transaction on the user document plus Resend's Idempotency-Key, so repeat
// sign-ins, retries or double submits never send a second welcome.
import { adminDb } from './firebase-admin';
import { getSiteUrl } from '@/components/portfolio/resumeHtml';

export type WelcomeRole = 'student' | 'counsellor';

interface WelcomeInput {
  uid: string;
  email: string;
  name: string;
  role?: WelcomeRole;
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Kept local (not imported from ./mailer) so this module never pulls in nodemailer.
const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const headerSafe = (v: string, max = 200) => v.replace(/[\r\n\u0000-\u001f]+/g, ' ').trim().slice(0, max);

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/* ───────────────────────── Template ───────────────────────── */

const BLUE = '#2563EB';
const NAVY = '#0B1B3F';
const INK = '#344054';
const MUTED = '#667085';
const FONT = 'Inter,Segoe UI,Helvetica,Arial,sans-serif';

function firstNameOf(name: string) {
  const first = (name || '').trim().split(/\s+/)[0] || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

interface Step {
  n: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

function stepsFor(role: WelcomeRole, site: string): Step[] {
  if (role === 'counsellor') {
    return [
      { n: '01', title: 'Complete your counsellor profile', body: 'Add your expertise, experience and the students you love working with so we can match you well.', href: `${site}/dashboard/counsellor/update-profile`, cta: 'Update profile' },
      { n: '02', title: 'Meet your students', body: 'See allotted students, their assessment results and notes in one workspace.', href: `${site}/dashboard/counsellor/students`, cta: 'Open workspace' },
      { n: '03', title: 'Explore the career library', body: 'Hundreds of career paths with roadmaps you can share during sessions.', href: `${site}/career-library`, cta: 'Browse careers' },
    ];
  }
  return [
    { n: '01', title: 'Complete your profile', body: 'A few details about your school, interests and goals help us personalise every recommendation.', href: `${site}/dashboard/student/profile`, cta: 'Finish profile' },
    { n: '02', title: 'Discover how you think', body: 'Take the free IQ test, then unlock the psychometric assessment for a detailed report on your strengths.', href: `${site}/iq-test`, cta: 'Start the IQ test' },
    { n: '03', title: 'Explore careers & universities', body: 'Browse career roadmaps and find universities that fit your profile, budget and ambitions.', href: `${site}/career-library`, cta: 'Explore careers' },
    { n: '04', title: 'Learn from real admits', body: 'See the scores, activities and essays of students admitted to top universities.', href: `${site}/dashboard/student/admitted-students`, cta: 'See admitted students' },
  ];
}

export function renderWelcomeEmail(input: { name: string; role?: WelcomeRole }) {
  const site = getSiteUrl();
  const role: WelcomeRole = input.role === 'counsellor' ? 'counsellor' : 'student';
  const first = escapeHtml(firstNameOf(input.name));
  const dashboard = role === 'counsellor' ? `${site}/dashboard/counsellor` : `${site}/dashboard/student/profile`;
  const steps = stepsFor(role, site);
  const year = new Date().getFullYear();
  const preheader =
    role === 'counsellor'
      ? 'Your CLARVO counsellor account is ready — here is how to get started.'
      : 'Your CLARVO account is ready — four simple steps to plan your future with confidence.';

  const lead =
    role === 'counsellor'
      ? 'Thank you for joining CLARVO as a counsellor. You now have the tools to understand each student deeply and guide them towards the right course, career and university.'
      : 'We are so glad you are here. CLARVO helps you understand your strengths, explore careers that genuinely fit you, and plan your path to the right university — in India or abroad.';

  const stepRows = steps
    .map(
      (s) => `
      <tr>
        <td style="padding:0 0 14px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background:#F8FAFC;border:1px solid #E4E7EC;border-radius:14px;">
            <tr>
              <td class="step-num" width="56" valign="top" style="padding:20px 0 20px 20px;">
                <div style="width:40px;height:40px;border-radius:12px;background:#E8F0FF;color:${BLUE};font:700 14px/40px ${FONT};text-align:center;">${s.n}</div>
              </td>
              <td valign="top" class="step-body" style="padding:20px 20px 20px 14px;">
                <div class="h3" style="font:700 16px/22px ${FONT};color:${NAVY};margin:0 0 4px 0;">${escapeHtml(s.title)}</div>
                <div class="p" style="font:400 14px/21px ${FONT};color:${MUTED};margin:0 0 10px 0;">${escapeHtml(s.body)}</div>
                <a href="${s.href}" class="link" style="font:700 14px/20px ${FONT};color:${BLUE};text-decoration:none;">${escapeHtml(s.cta)} &rarr;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('');

  const pillar = (title: string, body: string, pad: string) => `
                        <td class="stat" width="33%" valign="top" style="padding:${pad};">
                          <div class="h3" style="font:800 17px/24px ${FONT};color:${NAVY};">${title}</div>
                          <div class="p" style="font:400 13px/19px ${FONT};color:${MUTED};">${body}</div>
                        </td>`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Welcome to CLARVO</title>
<!--[if mso]><style>table,td,div,a,h1,h2,p{font-family:Segoe UI,Arial,sans-serif !important;}</style><![endif]-->
<style>
  body{margin:0;padding:0;width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{color:${BLUE};}
  @media only screen and (max-width:620px){
    .container{width:100% !important;max-width:100% !important;}
    .outer{padding:16px 10px !important;}
    .px{padding-left:20px !important;padding-right:20px !important;}
    .hero-pad{padding:34px 22px 30px !important;}
    .h1{font-size:26px !important;line-height:33px !important;}
    .lead{font-size:15px !important;line-height:24px !important;}
    .btn-a{display:block !important;text-align:center !important;}
    .step-num{display:none !important;width:0 !important;max-width:0 !important;overflow:hidden !important;}
    .step-body{padding:18px !important;}
    .stat{display:block !important;width:100% !important;padding:0 0 14px 0 !important;}
  }
  @media (prefers-color-scheme:dark){
    .bg{background:#0B1220 !important;}
    .sheet{background:#111A2E !important;border-color:#1F2A44 !important;}
    .card{background:#0F172A !important;border-color:#1F2A44 !important;}
    .h1,.h2,.h3{color:#F1F5F9 !important;}
    .p,.lead,.foot{color:#A9B4C7 !important;}
    .link{color:#7AA7FF !important;}
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#F2F5FA;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:#F2F5FA;">
    <tr>
      <td align="center" class="outer" style="padding:28px 12px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="container" style="width:100%;max-width:600px;">

          <!-- Brand -->
          <tr>
            <td align="left" class="px" style="padding:0 8px 18px;">
              <a href="${site}" style="text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding:0 10px 0 0;"><img src="${site}/logo.png" width="34" height="34" alt="" style="display:block;width:34px;height:34px;"></td>
                    <td valign="middle" class="h1" style="font:800 21px/34px ${FONT};letter-spacing:0.5px;color:${NAVY};">CLARVO</td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- Sheet -->
          <tr>
            <td class="sheet" style="background:#FFFFFF;border:1px solid #E4E7EC;border-radius:20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Hero -->
                <tr>
                  <td class="hero-pad" bgcolor="${NAVY}" style="padding:46px 44px 38px;background:${NAVY};background-image:linear-gradient(135deg,#0B1B3F 0%,#1E3A8A 55%,#2563EB 100%);border-radius:20px 20px 0 0;">
                    <div style="font:700 12px/16px ${FONT};letter-spacing:2px;text-transform:uppercase;color:#BFD3FF;margin:0 0 14px;">Your account is ready</div>
                    <h1 class="h1" style="margin:0 0 14px;font:800 32px/40px ${FONT};color:#FFFFFF;">Welcome to CLARVO, ${first}.</h1>
                    <p style="margin:0;font:400 16px/25px ${FONT};color:#DCE6FF;">The clearest way to choose your course, career and university starts today.</p>
                  </td>
                </tr>

                <!-- Lead -->
                <tr>
                  <td class="px" style="padding:34px 44px 8px;">
                    <p class="lead" style="margin:0 0 18px;font:400 16px/26px ${FONT};color:${INK};">Hi ${first},</p>
                    <p class="lead" style="margin:0 0 26px;font:400 16px/26px ${FONT};color:${INK};">${escapeHtml(lead)}</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="left">
                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${dashboard}" style="height:50px;v-text-anchor:middle;width:260px;" arcsize="24%" stroke="f" fillcolor="${BLUE}"><center style="color:#ffffff;font-family:Segoe UI,Arial,sans-serif;font-size:16px;font-weight:bold;">Go to my dashboard</center></v:roundrect><![endif]-->
                          <!--[if !mso]><!-- -->
                          <a href="${dashboard}" class="btn-a" style="display:inline-block;background:${BLUE};color:#FFFFFF;text-decoration:none;font:700 16px/20px ${FONT};padding:15px 30px;border-radius:12px;text-align:center;">Go to my dashboard &rarr;</a>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Steps -->
                <tr>
                  <td class="px" style="padding:34px 44px 6px;">
                    <h2 class="h2" style="margin:0 0 6px;font:800 20px/28px ${FONT};color:${NAVY};">Where to begin</h2>
                    <p class="p" style="margin:0 0 18px;font:400 14px/21px ${FONT};color:${MUTED};">${role === 'counsellor' ? 'Three quick steps to set up your workspace.' : 'Four simple steps — most students finish the first two in under 30 minutes.'}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stepRows}
                    </table>
                  </td>
                </tr>

                <!-- Pillars -->
                <tr>
                  <td class="px" style="padding:20px 44px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>${pillar('Science-backed', 'Assessments built on proven psychometric research.', '0 8px 0 0')}${pillar('Personal', 'Guidance shaped around your strengths and goals.', '0 8px')}${pillar('Human', 'Real counsellors whenever you need a hand.', '0 0 0 8px')}
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Help -->
                <tr>
                  <td class="px" style="padding:26px 44px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="background:#F8FAFC;border:1px solid #E4E7EC;border-radius:14px;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <div class="h3" style="font:700 15px/22px ${FONT};color:${NAVY};margin:0 0 4px;">Questions? We are one reply away.</div>
                          <div class="p" style="font:400 14px/21px ${FONT};color:${MUTED};">Just reply to this email or write to <a href="mailto:support@clarvo.in" class="link" style="color:${BLUE};text-decoration:none;font-weight:600;">support@clarvo.in</a> — a real person from our team will get back to you.</div>
                        </td>
                      </tr>
                    </table>
                    <p class="lead" style="margin:26px 0 0;font:400 15px/24px ${FONT};color:${INK};">Here's to the start of something great,<br><strong class="h3" style="color:${NAVY};">Team CLARVO</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px foot" align="center" style="padding:24px 20px 8px;font:400 12px/19px ${FONT};color:#98A2B3;">
              You are receiving this one-time email because you created a CLARVO account with this address.<br>
              <a href="${site}" class="link" style="color:#667085;text-decoration:underline;">clarvo.in</a> &nbsp;·&nbsp;
              <a href="${site}/privacy" class="link" style="color:#667085;text-decoration:underline;">Privacy</a> &nbsp;·&nbsp;
              <a href="${site}/terms" class="link" style="color:#667085;text-decoration:underline;">Terms</a><br>
              &copy; ${year} CLARVO. All rights reserved.
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Hi ${firstNameOf(input.name)},`,
    '',
    `Welcome to CLARVO! ${lead}`,
    '',
    `Go to your dashboard: ${dashboard}`,
    '',
    'Where to begin:',
    ...steps.map((s) => `${s.n}. ${s.title} — ${s.body}\n    ${s.href}`),
    '',
    'Questions? Just reply to this email or write to support@clarvo.in.',
    '',
    "Here's to the start of something great,",
    'Team CLARVO',
  ].join('\n');

  const subject =
    role === 'counsellor'
      ? 'Welcome to CLARVO — your counsellor workspace is ready'
      : `Welcome to CLARVO, ${firstNameOf(input.name)} 🎓`;

  return { subject, html, text };
}

/* ───────────────────────── Delivery ───────────────────────── */

async function sendViaResend(to: string, payload: { subject: string; html: string; text: string }, idempotencyKey: string) {
  const from = process.env.RESEND_FROM || 'CLARVO <hello@clarvo.in>';
  const replyTo = process.env.RESEND_REPLY_TO || 'support@clarvo.in';
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject: headerSafe(payload.subject),
      html: payload.html,
      text: payload.text,
      tags: [{ name: 'category', value: 'welcome' }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body.message || 'send failed'}`);
  return body.id || '';
}

/**
 * Sends the welcome email at most once per user. Safe to call from every account-creation path.
 * Never throws — a failed email must never fail sign-up.
 */
export async function sendWelcomeEmailOnce(input: WelcomeInput): Promise<'sent' | 'skipped' | 'failed'> {
  const email = (input.email || '').trim().toLowerCase();
  if (!input.uid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'skipped';
  if (!isResendConfigured()) {
    console.warn('[Welcome] RESEND_API_KEY is not configured — welcome email skipped.');
    return 'skipped';
  }

  const ref = adminDb.collection('users').doc(input.uid);

  // Claim the send atomically so concurrent requests can't both send.
  let claimed = false;
  try {
    claimed = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const welcome = snap.exists ? snap.get('welcomeEmail') : null;
      if (welcome && (welcome.status === 'sent' || welcome.status === 'sending')) return false;
      tx.set(ref, { welcomeEmail: { status: 'sending', claimedAt: new Date() } }, { merge: true });
      return true;
    });
  } catch (err) {
    console.warn('[Welcome] Could not claim welcome email send:', (err as Error)?.message);
    return 'failed';
  }
  if (!claimed) return 'skipped';

  try {
    const id = await sendViaResend(email, renderWelcomeEmail({ name: input.name, role: input.role }), `welcome-${input.uid}`);
    await ref.set({ welcomeEmail: { status: 'sent', sentAt: new Date(), messageId: id } }, { merge: true });
    console.info(`[Welcome] Sent welcome email to user ${input.uid}.`);
    return 'sent';
  } catch (err) {
    console.error('[Welcome] Send failed:', (err as Error)?.message);
    // Release the claim so a retry during the sign-up window can try again.
    await ref.set({ welcomeEmail: { status: 'failed', failedAt: new Date() } }, { merge: true }).catch(() => {});
    return 'failed';
  }
}
