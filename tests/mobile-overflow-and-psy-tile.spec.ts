import { test, expect, type Page } from '@playwright/test';

/**
 * Regression tests for two mobile bugs (Nov 2026):
 * 1. /psychometric-assessment could be panned sideways on phones because the
 *    "Phase 1-4" swipe row leaked its scroll width into body.scrollWidth.
 *    The old check (documentElement.scrollWidth) stayed at the screen width,
 *    so it never caught this; body.scrollWidth is what Android Chrome zooms to.
 * 2. On the home page, only the heading of the "Psychometric diagnostics" tile
 *    was a link. The whole tile should open /psychometric-assessment.
 */

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(400);
}

const phoneWidths = [
  { width: 360, height: 780 },
  { width: 412, height: 915 },
  { width: 768, height: 1024 },
];

test.describe('psychometric page: no sideways overflow on phones', () => {
  for (const vp of phoneWidths) {
    test(`body is no wider than the screen at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/psychometric-assessment', { waitUntil: 'networkidle' });
      await scrollThrough(page);

      const widths = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        body: document.body.scrollWidth,
        html: document.documentElement.scrollWidth,
      }));
      expect(widths.body).toBeLessThanOrEqual(widths.viewport);
      expect(widths.html).toBeLessThanOrEqual(widths.viewport);
    });
  }

  test('phase cards can still be swiped inside their row', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/psychometric-assessment', { waitUntil: 'networkidle' });
    const row = page.locator('ul.psy-swipe[aria-label="Assessment phases"]');
    await row.scrollIntoViewIfNeeded();
    const scrollable = await row.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
  });
});

test.describe('home page: psychometric tile is fully clickable', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#assessments').scrollIntoViewIfNeeded();
  });

  test('tapping the description text opens the assessment page', async ({ page }) => {
    const text = page.locator('#assessments p', { hasText: 'Scientifically evaluate' });
    // Centre it so the sticky navbar doesn't sit on top of it.
    await text.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    // Tap by coordinates: the tile's link deliberately sits on top of the text,
    // so locator.click() would refuse ("another element intercepts").
    const box = await text.boundingBox();
    if (!box) throw new Error('description not rendered');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });

  test('tapping the photo opens the assessment page', async ({ page }) => {
    const frame = page.locator('#assessments [data-media-frame]');
    const box = await frame.boundingBox();
    if (!box) throw new Error('media frame not rendered');
    // Top-centre of the photo, away from the pills at the bottom.
    await page.mouse.click(box.x + box.width / 2, box.y + 20);
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });

  test('"Take diagnostic" pill opens the assessment page', async ({ page }) => {
    await page.locator('#assessments a', { hasText: 'Take diagnostic' }).click();
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });

  test('tile link is reachable by keyboard', async ({ page }) => {
    const link = page.getByTestId('psychometric-tile-link');
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });
});
