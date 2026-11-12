// Captures animation frames of one in-view card at fixed delays after it enters the viewport.
// Usage: node scripts/capture-psychometric-frames.mjs <outDir> [baseUrl]
import { chromium } from 'playwright';
import fs from 'fs';

const out = process.argv[2];
const base = process.argv[3] || 'http://127.0.0.1:3005';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const section = 'section[aria-label="Why a career decision needs more than guesswork"]';
for (const [name, cardIndex] of [['before', 0], ['after', 1]]) {
  const page = await ctx.newPage();
  await page.goto(`${base}/psychometric-assessment`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: 'nav.sticky, div[class*="fixed"][class*="bottom-0"] { visibility: hidden !important; }' });
  // Park just above the card, then scroll it into view and sample frames.
  // The card is the image's nearest rounded container; find it via the scene image alt text.
  const alt = cardIndex === 0 ? 'looking worried' : 'counsellor explaining';
  const card = page.locator(`${section} img[alt*="${alt}"]`).locator('xpath=ancestor::div[contains(@class,"rounded-[28px]")][1]');
  const y = await card.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  // One jump straight to the card: the animation starts as it enters view.
  await page.evaluate((v) => window.scrollTo(0, v - 120), y);
  const t0 = Date.now();
  for (const ms of [250, 700, 1300, 2300]) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await card.screenshot({ path: `${out}/${name}-${String(ms).padStart(4, '0')}ms.png` });
  }
}
await browser.close();
console.log('frames saved to', out);
