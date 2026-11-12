import { createHash } from 'crypto';
import { existsSync } from 'fs';
import puppeteer from 'puppeteer';
import { getPublishedPortfolioByUsername } from '@/lib/portfolio-service';
import { buildDemoProfile, DEMO_USERNAME } from '@/components/portfolio/mockProfile';
import { recordToProfile, USERNAME_PATTERN, type PortfolioProfile } from '@/components/portfolio/portfolioTypes';
import { renderResumeHtml, resumeCtaHtml, getSiteUrl } from '@/components/portfolio/resumeHtml';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Small in-memory cache so repeated downloads of an unchanged resume don't relaunch Chromium.
const CACHE_MAX = 40;
const pdfCache = new Map<string, Uint8Array>();
// Render one resume at a time per server instance to keep memory bounded.
let queue: Promise<unknown> = Promise.resolve();

async function loadProfile(username: string): Promise<PortfolioProfile | null> {
  if (username === DEMO_USERNAME) return buildDemoProfile();
  if (!USERNAME_PATTERN.test(username)) return null;
  const record = await getPublishedPortfolioByUsername(username);
  return record ? recordToProfile(record) : null;
}

const LAUNCH_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

/** Use the configured Chromium when it exists; otherwise Puppeteer's bundled browser, then installed Chrome. */
async function launchBrowser() {
  const configured = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (configured && existsSync(configured)) {
    return puppeteer.launch({ headless: true, executablePath: configured, args: LAUNCH_ARGS });
  }
  try {
    return await puppeteer.launch({ headless: true, executablePath: await puppeteer.executablePath(), args: LAUNCH_ARGS });
  } catch {
    return puppeteer.launch({ headless: true, channel: 'chrome', args: LAUNCH_ARGS });
  }
}

async function renderPdf(html: string, siteUrl: string): Promise<Uint8Array> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 8000 }).catch(() => {});
    await page.evaluate(async () => {
      if (document.fonts) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 4000))]);
    });
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<style>#footer{padding:0 !important;margin:0 !important;}html{-webkit-print-color-adjust:exact;}</style><div style="width:100%;margin:0;padding:0;">${resumeCtaHtml(siteUrl)}</div>`,
      margin: { top: '14mm', right: '14mm', bottom: '18mm', left: '14mm' },
      timeout: 45000,
    });
  } finally {
    await browser.close().catch(() => {});
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw).toLowerCase();

  const profile = await loadProfile(username);
  if (!profile) {
    return new Response(JSON.stringify({ error: 'Portfolio not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const siteUrl = getSiteUrl();
  const html = renderResumeHtml(profile, 'print', siteUrl);
  const key = createHash('sha1').update(html).digest('hex');

  try {
    let pdf = pdfCache.get(key);
    if (!pdf) {
      const job = queue.then(() => renderPdf(html, siteUrl));
      queue = job.catch(() => {});
      pdf = await job;
      if (pdfCache.size >= CACHE_MAX) pdfCache.delete(pdfCache.keys().next().value as string);
      pdfCache.set(key, pdf);
    }

    const fileName = `${profile.fullName.replace(/[^A-Za-z0-9 _-]/g, '').trim().replace(/\s+/g, '-') || 'Student'}-Resume.pdf`;
    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[Resume PDF] Render failed:', err);
    return new Response(JSON.stringify({ error: 'Could not generate the resume right now. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
