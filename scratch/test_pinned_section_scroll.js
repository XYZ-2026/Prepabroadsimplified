const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function testPinnedSection() {
  const userDataDir = path.resolve('scratch', 'puppeteer_pinned_' + Date.now());
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://127.0.0.1:3000...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Find Section 6 (#assessments)
  const sectionMetrics = await page.evaluate(() => {
    const el = document.querySelector('#assessments');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: rect.height,
      scrollHeight: document.documentElement.scrollHeight,
    };
  });

  console.log('Section #assessments metrics:', sectionMetrics);

  if (!sectionMetrics) {
    console.error('Section #assessments not found!');
    await browser.close();
    return;
  }

  const scrollStart = sectionMetrics.top;
  // If the section is pinned with scroll distance, the total scroll distance is sectionMetrics.height - window.innerHeight
  const scrollRange = Math.max(sectionMetrics.height - 900, 1000);
  console.log(`Scroll start: ${scrollStart}px, scroll range: ${scrollRange}px`);

  const percentages = [0, 0.33, 0.66, 1.0];
  const results = [];

  for (const pct of percentages) {
    const targetScrollY = Math.round(scrollStart + pct * scrollRange);
    console.log(`Scrolling to ${Math.round(pct * 100)}% (Y = ${targetScrollY})...`);

    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: 'instant' });
    }, targetScrollY);

    // Allow GSAP / Lenis / ScrollTrigger to update
    await new Promise((r) => setTimeout(r, 800));

    // Capture state
    const state = await page.evaluate(() => {
      const el = document.querySelector('#assessments');
      const headline = el ? el.querySelector('h2') : null;
      const stepBadge = el ? el.querySelector('span[class*="bg-[#1258DE]"]') : null;
      const completion = el ? el.querySelector('span[class*="bg-[#222638]"]') : null;
      const pinnedStage = el ? el.querySelector('div.sticky, div[class*="sticky"]') : null;
      const pinnedRect = pinnedStage ? pinnedStage.getBoundingClientRect() : null;

      return {
        scrollY: window.scrollY,
        headlineText: headline ? headline.innerText.trim() : null,
        stepBadgeText: stepBadge ? stepBadge.innerText.trim() : null,
        completionText: completion ? completion.innerText.trim() : null,
        pinnedStageTop: pinnedRect ? pinnedRect.top : null,
        pinnedStageHeight: pinnedRect ? pinnedRect.height : null,
      };
    });

    const screenshotPath = path.join(SCREENSHOTS_DIR, `pinned_scroll_${Math.round(pct * 100)}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`State at ${Math.round(pct * 100)}%:`, state);
    results.push({ pct, targetScrollY, state, screenshot: screenshotPath });
  }

  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, 'pinned_test_initial.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
  console.log('Pinned section test finished.');
}

testPinnedSection().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
