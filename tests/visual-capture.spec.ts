import { test } from '@playwright/test';
import path from 'path';

test.describe('Visual Screenshot Captures', () => {
  test('Capture Hero and Testimonials', async ({ page }, testInfo) => {
    const vpName = testInfo.project.name;

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.text().includes('Hydration')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const debug = await page.evaluate(() => {
      const sub = document.querySelector('.hero-sub');
      const cta = document.querySelector('.hero-cta');
      const photo = document.querySelector('.hero-cutout');
      const chips = Array.from(document.querySelectorAll('.hero-chip')).map((c) => ({
        text: c.textContent?.trim(),
        opacity: window.getComputedStyle(c).opacity,
        display: window.getComputedStyle(c).display,
        rect: c.getBoundingClientRect(),
      }));
      return {
        subOpacity: sub ? window.getComputedStyle(sub).opacity : 'none',
        subRect: sub ? sub.getBoundingClientRect() : null,
        ctaOpacity: cta ? window.getComputedStyle(cta).opacity : 'none',
        photoOpacity: photo ? window.getComputedStyle(photo).opacity : 'none',
        photoRect: photo ? photo.getBoundingClientRect() : null,
        chips,
      };
    });
    console.log(`[${vpName}] Element Debug:`, JSON.stringify(debug, null, 2));

    // Full page screenshot to see where elements are
    await page.screenshot({
      path: path.join(process.cwd(), 'reference', 'screenshots', `full_${vpName}.png`),
      fullPage: true,
    });

    // Hero screenshot
    const heroEl = page.locator('section[aria-label*="Clarvo Hero"]');
    if (await heroEl.count() > 0) {
      await heroEl.first().screenshot({
        path: path.join(process.cwd(), 'reference', 'screenshots', `hero_${vpName}.png`),
      });
    }

    // Testimonials screenshot
    const storiesEl = page.locator('#stories');
    if (await storiesEl.count() > 0) {
      await storiesEl.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await storiesEl.first().screenshot({
        path: path.join(process.cwd(), 'reference', 'screenshots', `testimonials_${vpName}.png`),
      });
    }

    console.log(`[${vpName}] Console Errors:`, consoleErrors.length === 0 ? 'ZERO (Clean Hydration)' : consoleErrors);
  });
});
