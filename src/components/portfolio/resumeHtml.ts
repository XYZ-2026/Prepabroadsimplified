// Professional one-column A4 resume generated from a student's portfolio.
// The same HTML powers the small preview on the portfolio page and the downloadable PDF,
// so the preview always matches the download. Client- and server-safe (pure string building).
import type { PortfolioProfile } from './portfolioTypes';

const esc = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Public site origin used in the "Made with CLARVO" call to action. */
export function getSiteUrl(): string {
  const fallback = 'https://clarvo.in';
  const raw = (process.env.NEXT_PUBLIC_APP_URL || '').trim();
  if (!raw) return fallback;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return fallback;
    return u.origin;
  } catch {
    return fallback;
  }
}

function prettyUrl(href: string) {
  try {
    const u = new URL(href);
    return (u.host.replace(/^www\./, '') + u.pathname).replace(/\/$/, '');
  } catch {
    return href;
  }
}

const ACCENT = '#9f1239';

/** Footer call to action (used in the preview body and in the PDF footer template). */
export function resumeCtaHtml(siteUrl: string) {
  const host = prettyUrl(siteUrl);
  return `
  <div style="width:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px;
              padding:0 14mm;height:12mm;background:#111118;color:#f4f4f6;font-family:Inter,Arial,sans-serif;
              -webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <span style="font-size:8.5px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;">
      Made with <span style="color:#fb7185;">CLARVO</span>
    </span>
    <span style="font-size:9px;font-weight:600;">
      Build your own student portfolio &amp; resume — free at
      <a href="${esc(siteUrl)}/signup" style="color:#fb7185;text-decoration:none;font-weight:800;">${esc(host)}</a> →
    </span>
  </div>`;
}

function section(title: string, body: string) {
  if (!body.trim()) return '';
  return `<section class="sec"><h2>${esc(title)}</h2>${body}</section>`;
}

export function renderResumeHtml(profile: PortfolioProfile, mode: 'preview' | 'print', siteUrl = getSiteUrl()): string {
  const p = profile;

  const subline = [p.grade && p.stream ? `${p.grade} · ${p.stream}` : p.grade || p.stream, p.school, p.location]
    .filter(Boolean)
    .map((s) => esc(s))
    .join('<span class="sep">|</span>');

  const contact = p.links
    .map((l) => {
      const label = l.href.startsWith('mailto:') ? l.href.slice(7) : l.label === 'Download CV' ? '' : prettyUrl(l.href);
      return label ? `<a href="${esc(l.href)}">${esc(label)}</a>` : '';
    })
    .filter(Boolean)
    .join('<span class="sep">|</span>');

  const profileBody = [
    p.bio ? `<p>${esc(p.bio)}</p>` : '',
    p.dream ? `<p class="goal"><strong>Career goal:</strong> ${esc(p.dream)}</p>` : '',
  ].join('');

  const education = p.academics
    .map(
      (a) => `
      <div class="item">
        <div class="row"><strong>${esc(a.label)}</strong>${a.score ? `<span class="right">${esc(a.score)}</span>` : ''}</div>
        ${a.detail ? `<div class="muted">${esc(a.detail)}</div>` : ''}
      </div>`,
    )
    .join('');

  const awards = p.awards
    .map(
      (a) => `
      <li><strong>${esc(a.title)}</strong>${a.subtitle ? ` — ${esc(a.subtitle)}` : ''}${
        a.detail ? `<span class="muted">. ${esc(a.detail)}</span>` : ''
      }</li>`,
    )
    .join('');

  const projects = p.projects
    .map(
      (pr) => `
      <div class="item">
        <div class="row"><strong>${esc(pr.title)}</strong>${pr.year ? `<span class="right">${esc(pr.year)}</span>` : ''}</div>
        ${pr.tagline ? `<div>${esc(pr.tagline)}</div>` : ''}
        ${
          pr.tags.length || pr.link
            ? `<div class="muted small">${pr.tags.length ? `Skills: ${pr.tags.map(esc).join(', ')}` : ''}${
                pr.link ? `${pr.tags.length ? ' · ' : ''}<a href="${esc(pr.link)}">${esc(prettyUrl(pr.link))}</a>` : ''
              }</div>`
            : ''
        }
      </div>`,
    )
    .join('');

  const activities = p.activities
    .map(
      (a) => `
      <div class="item">
        <div class="row"><strong>${esc(a.title)}</strong>${a.years ? `<span class="right">${esc(a.years)}</span>` : ''}</div>
        ${a.org ? `<div class="muted">${esc(a.org)}</div>` : ''}
        ${a.detail ? `<div>${esc(a.detail)}</div>` : ''}
      </div>`,
    )
    .join('');

  const certs = p.certifications
    .map((c) => `<li><strong>${esc(c.title)}</strong>${c.issuer ? ` — ${esc(c.issuer)}` : ''}</li>`)
    .join('');

  const skills = p.skills
    .map((g) => `<div class="skill"><strong>${esc(g.name)}:</strong> ${g.skills.map(esc).join(', ')}</div>`)
    .join('');

  const isPreview = mode === 'preview';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(p.fullName)} — Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 14mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Inter, Arial, Helvetica, sans-serif;
    color: #1f2937;
    font-size: 10.5px;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: #ffffff;
  }
  .sheet { ${isPreview ? 'width:210mm;height:297mm;padding:14mm 14mm 22mm;position:relative;overflow:hidden;background:#fff;' : ''} }
  header { border-bottom: 2px solid ${ACCENT}; padding-bottom: 10px; margin-bottom: 4px; }
  h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.3px; margin: 0; color: #0f172a; }
  .sub { margin-top: 3px; font-size: 11px; color: #374151; font-weight: 500; }
  .contact { margin-top: 5px; font-size: 10px; color: #4b5563; }
  .sep { color: #cbd5e1; margin: 0 7px; }
  a { color: ${ACCENT}; text-decoration: none; }
  .sec { margin-top: 13px; break-inside: avoid-page; }
  .sec h2 {
    font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${ACCENT};
    font-weight: 800; margin: 0 0 6px; padding-bottom: 3px; border-bottom: 1px solid #e5e7eb;
  }
  .sec p { margin: 0 0 4px; }
  .goal { color: #111827; }
  .item { margin-bottom: 7px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; color: #111827; }
  .right { color: #4b5563; white-space: nowrap; font-weight: 600; }
  .muted { color: #6b7280; }
  .small { font-size: 9.5px; margin-top: 1px; }
  ul { margin: 0; padding-left: 15px; }
  li { margin-bottom: 3px; }
  .skill { margin-bottom: 3px; }
  .cta { position: absolute; left: 0; right: 0; bottom: 0; }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <h1>${esc(p.fullName)}</h1>
      ${subline ? `<div class="sub">${subline}</div>` : ''}
      ${contact ? `<div class="contact">${contact}</div>` : ''}
    </header>
    ${section('Profile', profileBody)}
    ${section('Education', education)}
    ${section('Achievements & Awards', awards ? `<ul>${awards}</ul>` : '')}
    ${section('Projects', projects)}
    ${section('Leadership & Activities', activities)}
    ${section('Certifications', certs ? `<ul>${certs}</ul>` : '')}
    ${section('Skills', skills)}
    ${isPreview ? `<div class="cta">${resumeCtaHtml(siteUrl)}</div>` : ''}
  </div>
</body>
</html>`;
}
