// Captures one section of /psychometric-assessment at several viewports, after its animation has played.
// Usage: node scripts/capture-psychometric-section.mjs <outDir> <ariaLabel> [viewport] [baseUrl]
// Example: node scripts/capture-psychometric-section.mjs reference/sec2 "Why a career decision needs more than guesswork" m390
import { chromium } from 'playwright';
import fs from 'fs';

const out = process.argv[2];
const label = process.argv[3];
const only = process.argv[4];
const base = process.argv[5] || 'http://127.0.0.1:3005';
if (!out || !label) {
  console.error('Usage: node scripts/capture-psychometric-section.mjs <outDir> <ariaLabel> [viewport] [baseUrl]');
  process.exit(1);
}
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: 'm360', width: 360, height: 780, isMobile: true, hasTouch: true },
  { name: 'm390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 't768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'l1024', width: 1024, height: 768 },
  { name: 'd1440', width: 1440, height: 900 },
].filter((v) => !only || only === 'all' || v.name === only);

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
    if (m.type() === 'error') errors.push(m.text().slice(0, 160));
  });
  await page.goto(`${base}/psychometric-assessment`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForTimeout(1500);

  const section = page.locator(`section[aria-label="${label}"]`);
  // Hide the sticky nav and mobile CTA bar so they don't cover the element screenshot.
  await page.addStyleTag({ content: 'nav.sticky, nav[class*="sticky"], div[class*="fixed"][class*="bottom-0"] { visibility: hidden !important; }' });
  const top = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const height = (await section.boundingBox()).height;
  // Walk down from the top of the section so every in-view trigger inside it fires, header first.
  for (let y = -80; y <= height; y += 220) {
    await page.evaluate((v) => window.scrollTo(0, v), top + y);
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(3200); // let the longest animation finish
  await section.screenshot({ path: `${out}/${vp.name}.png` });

  const info = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  console.log(vp.name, { ...info, errors });
  await ctx.close();
}
await browser.close();
