const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'desktop_1440x900', width: 1440, height: 900 },
    { name: 'tablet_768x1024', width: 768, height: 1024 },
    { name: 'mobile_390x844', width: 390, height: 844 },
  ];

  const consoleLogs = [];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.text().includes('Hydration')) {
        consoleLogs.push(`[${vp.name}] ${msg.type()}: ${msg.text()}`);
      }
    });

    await page.goto('http://127.0.0.1:3005', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Hero screenshot
    const heroEl = await page.locator('section[aria-label*="Clarvo Hero"]');
    if (await heroEl.count() > 0) {
      await heroEl.first().screenshot({
        path: path.join(process.cwd(), 'reference', 'screenshots', `hero_${vp.name}.png`),
      });
      console.log(`Saved hero_${vp.name}.png`);
    }

    // Testimonials screenshot
    const storiesEl = await page.locator('#stories');
    if (await storiesEl.count() > 0) {
      await storiesEl.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await storiesEl.first().screenshot({
        path: path.join(process.cwd(), 'reference', 'screenshots', `testimonials_${vp.name}.png`),
      });
      console.log(`Saved testimonials_${vp.name}.png`);
    }

    await page.close();
  }

  await browser.close();

  console.log('Console errors / Hydration issues:', consoleLogs.length === 0 ? 'ZERO (Clean Hydration)' : consoleLogs);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
