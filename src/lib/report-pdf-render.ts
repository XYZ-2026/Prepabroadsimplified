/**
 * Shared Puppeteer rendering for the psychometric report HTML.
 *
 * The report styles itself at runtime (Tailwind CDN script) and draws its charts
 * with Chart.js on DOMContentLoaded, with a 1s animation. Printing right after
 * `domcontentloaded` therefore produced PDFs with no styles and blank charts.
 * This helper waits for each of those to settle before printing.
 */
import type { Page, PDFOptions } from 'puppeteer';

const STYLE_READY_TIMEOUT_MS = 15000;

export async function loadReportHtml(page: Page, html: string): Promise<void> {
  // `load` waits for the Tailwind/Chart.js scripts and stylesheets; then wait for the network to
  // go quiet (fonts, icons). If a CDN is slow, continue with what has loaded rather than failing.
  await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
  await page.waitForNetworkIdle({ idleTime: 800, timeout: 20000 }).catch(() => {});

  // 1. Fonts (Poppins + Font Awesome icons).
  await page.evaluate(async () => {
    if (document.fonts) {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 8000))]);
    }
  });

  // 2. Tailwind CDN: it injects a generated <style> once it has scanned the markup.
  //    A styled report page has a non-transparent, rounded white card; check a real class.
  await page
    .waitForFunction(
      () => {
        const w = window as unknown as { tailwind?: unknown };
        const generated = Array.from(document.querySelectorAll('style')).some((s) => (s.textContent || '').includes('--tw-'));
        return typeof w.tailwind !== 'undefined' && generated;
      },
      { timeout: STYLE_READY_TIMEOUT_MS },
    )
    .catch(() => {
      /* Tailwind CDN unreachable: continue; the sanity check in the caller will flag it. */
    });

  // 3. Chart.js: finish every chart's animation immediately so the print captures final bars.
  await page.evaluate(() => {
    const C = (window as unknown as { Chart?: { instances?: Record<string, any> } }).Chart;
    if (!C || !C.instances) return;
    Object.values(C.instances).forEach((chart: any) => {
      chart.options.animation = false;
      chart.update('none');
    });
  });

  // 4. Two frames so layout settles before printing.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))));
}

export interface ReportRenderCheck {
  pages: number;
  tailwindApplied: boolean;
  charts: number;
}

/** Cheap sanity check on the loaded page, so a broken render fails loudly instead of shipping. */
export async function checkReportRender(page: Page): Promise<ReportRenderCheck> {
  return page.evaluate(() => {
    const w = window as unknown as { tailwind?: unknown; Chart?: { instances?: Record<string, unknown> } };
    return {
      pages: document.querySelectorAll('.as-report-page').length,
      tailwindApplied: typeof w.tailwind !== 'undefined',
      charts: w.Chart?.instances ? Object.keys(w.Chart.instances).length : 0,
    };
  });
}

export const REPORT_PDF_OPTIONS: PDFOptions = {
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  displayHeaderFooter: false,
  timeout: 120000,
};

export async function renderReportPdf(page: Page, html: string) {
  await loadReportHtml(page, html);
  await page.emulateMediaType('print');
  return page.pdf(REPORT_PDF_OPTIONS);
}
