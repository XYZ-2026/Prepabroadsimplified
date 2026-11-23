import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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
    await text.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
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
    await tapCentre(page, '#assessments span', 'Take diagnostic');
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });

  test('tile link is reachable by keyboard', async ({ page }) => {
    const link = page.locator('#assessments h3 a');
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/psychometric-assessment$/);
  });
});

/** Taps the centre of an element by coordinates (stretched links sit on top of card text). */
async function tapCentre(page: Page, selector: string, hasText: string) {
  const el = page.locator(selector, { hasText }).first();
  await el.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const box = await el.boundingBox();
  if (!box) throw new Error(`${hasText} not rendered`);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test.describe('home page: research tile opens the research page', () => {
  test('tapping anywhere on the tile opens /research', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await tapCentre(page, '#research-tile p', 'author original research papers');
    await expect(page).toHaveURL(/\/research$/);
  });

  test('tile link says what it does', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByRole('link', { name: /Explore research programmes/ })).toHaveAttribute('href', '/research');
  });
});

test.describe('home page: services carousel', () => {
  const ORDER = ['assessments', 'research-tile', 'summer-school-tile', 'sat-tile', 'career-roadmaps-tile'];

  test('cards appear in the agreed order', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const ids = await page.locator('[data-testid="services-carousel"] > li').evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(ORDER);
  });

  test('all card titles share one style (the sign-up button title once rendered small and thin)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const styles = await page.locator('[data-testid="services-carousel"] h3 > *').evaluateAll((els) =>
      els.map((e) => {
        const c = getComputedStyle(e);
        return `${c.fontSize}|${c.fontWeight}|${c.fontFamily}`;
      }),
    );
    expect(styles).toHaveLength(5);
    expect(new Set(styles.slice(2)).size).toBe(1); // SAT and stream cards are the same size
    for (const s of styles) expect(s.split('|')[1]).toBe('700');
  });

  test('every card has a photo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    for (const id of ORDER) {
      await expect(page.locator(`#${id} [data-media-frame] img`)).toHaveCount(1);
    }
  });

  test('on phones the cards swipe sideways without widening the page', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const row = page.getByTestId('services-carousel');
    await row.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const m = await row.evaluate((el) => ({
      rowScrollable: el.scrollWidth > el.clientWidth,
      body: document.body.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(m.rowScrollable).toBe(true);
    expect(m.body).toBeLessThanOrEqual(m.viewport);
  });

  test('on desktop the cards form a grid: two large cards, then three in a row', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const tops = await page
      .locator('[data-testid="services-carousel"] > li')
      .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(tops[0]).toBe(tops[1]);
    expect(tops[2]).toBe(tops[3]);
    expect(tops[3]).toBe(tops[4]);
    expect(tops[2]).toBeGreaterThan(tops[0]);
    const rowScrollable = await page.getByTestId('services-carousel').evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(rowScrollable).toBe(false);
  });

  test('SAT card opens the booking form, tagged with where it came from', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await tapCentre(page, '#sat-tile p', 'Adaptive diagnostic mocks');
    await expect(page).toHaveURL(/\/book-a-demo\?from=home:services-sat$/);
  });

  test('summer school card opens its page', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await tapCentre(page, '#summer-school-tile p', 'Mentor-guided programmes');
    await expect(page).toHaveURL(/\/summer-school$/, { timeout: 20000 }); // first visit compiles the page in dev
  });
});

test.describe('home page: career roadmaps tile (signed out)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('tapping the tile opens the free sign-up popup and stays on the home page', async ({ page }) => {
    await tapCentre(page, '#career-roadmaps-tile p', 'Map Class 10 stream choices');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Explore 100+ career roadmaps, free');
    await expect(page).toHaveURL(/\/$/);
  });

  test('popup can be closed with Escape', async ({ page }) => {
    await page.getByRole('button', { name: /Sign up free to explore roadmaps/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('the Career Library page itself stays public', async ({ page }) => {
    const res = await page.goto('/career-library', { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/career-library$/);
  });
});

/**
 * Mints a real signed session cookie for a made-up user (no account in the database;
 * the app falls back to the cookie's claims). Uses SESSION_SECRET from .env.
 */
async function signInAsTestStudent(page: Page) {
  const envFile = path.join(process.cwd(), '.env');
  const line = fs.readFileSync(envFile, 'utf8').split(/\r?\n/).find((l) => l.startsWith('SESSION_SECRET='));
  if (!line) throw new Error('SESSION_SECRET missing from .env');
  process.env.SESSION_SECRET = line.slice('SESSION_SECRET='.length).replace(/^['"]|['"]$/g, '');
  const { signSessionToken } = await import('../src/lib/session-token');
  const token = signSessionToken({ uid: 'e2e-test-no-such-user', email: 'e2e@example.com', name: 'E2E Student', role: 'student' });
  await page.context().addCookies([{ name: '__session', value: token, url: 'http://127.0.0.1:3005' }]);
}

test.describe('home page: career roadmaps tile (signed in)', () => {
  test('tapping the tile goes straight to the Career Library, no popup', async ({ page }) => {
    await signInAsTestStudent(page);
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await tapCentre(page, '#career-roadmaps-tile p', 'Map Class 10 stream choices');
    await expect(page).toHaveURL(/\/career-library$/);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
