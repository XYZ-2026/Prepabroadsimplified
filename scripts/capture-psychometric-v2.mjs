// Captures /psychometric-assessment section by section (Design_psychometric_v2.md tests).
// Usage: node scripts/capture-psychometric-v2.mjs <outDir> [viewportName] [baseUrl]
// Viewport names: m390, t768, l1024, d1440. Defaults to all four, base http://127.0.0.1:3005.
import { chromium } from 'playwright';
import fs from 'fs';

const out = process.argv[2] || 'reference/psychometric-v2';
const only = process.argv[3];
const base = process.argv[4] || 'http://127.0.0.1:3005';
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: 'm390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 't768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'l1024', width: 1024, height: 768 },
  { name: 'd1440', width: 1440, height: 900 },
].filter((v) => !only || v.name === only);

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto(`${base}/psychometric-assessment`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${vp.name}-00-first-screen.png` });

  const sections = await page.$$('main > section');
  for (let i = 0; i < sections.length; i++) {
    await sections[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(1400);
    await sections[i].screenshot({ path: `${out}/${vp.name}-${String(i + 1).padStart(2, '0')}.png` });
  }

  // Spec test 4: the phase stage shows a full card at 0, 33, 66 and 100% through the section.
  const phases = await page.$('section[aria-label="The Four Assessment Phases"]');
  if (phases) {
    const { top, height } = await phases.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });
    for (const pct of [0, 33, 66, 100]) {
      const y = top + (height - vp.height) * (pct / 100);
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${out}/${vp.name}-phases-${pct}pct.png` });
    }
  }

  const widths = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  console.log(vp.name, { sections: sections.length, ...widths, errors: errors.slice(0, 8) });
  await ctx.close();
}
await browser.close();
