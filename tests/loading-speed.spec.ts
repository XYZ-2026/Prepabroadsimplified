// Loading-speed regressions: what a first-time phone visitor downloads before touching anything.
import { test, expect, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'mobile-390x844', 'phone budget: run once');
});

async function visit(page: Page, path: string) {
  const seen: { url: string; size: number }[] = [];
  let scripts = '';
  page.on('response', async (r) => {
    const body = await r.body().catch(() => Buffer.alloc(0));
    seen.push({ url: r.url(), size: body.length });
    if (r.request().resourceType() === 'script') scripts += body.toString();
  });
  await page.goto(path, { waitUntil: 'networkidle' });
  return { seen, scripts: () => scripts };
}

for (const path of ['/', '/research', '/summer-school', '/admitted-students']) {
  test(`${path}: no Firebase or Google Fonts, text font announced early`, async ({ page }) => {
    const { seen } = await visit(page, path);
    // The scripts the page itself needs. (After loading, Next.js also fetches /auth ahead of a possible click.)
    const own = [...(await (await page.request.get(path)).text()).matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]);
    expect(own.length).toBeGreaterThan(3);
    for (const src of own) {
      const code = await (await page.request.get(src)).text();
      expect(code.includes('identitytoolkit.googleapis.com') || code.includes('firestore.googleapis.com'), src).toBe(false);
    }
    expect(seen.filter((r) => /fonts\.(googleapis|gstatic)\.com/.test(r.url))).toEqual([]);
    // React announces the font either in the response header (earliest) or as a tag.
    const html = await page.request.get(path);
    const announced = (html.headers()['link'] ?? '') + (await html.text());
    expect(announced).toContain('/fonts/dm-sans-latin.woff2');
    expect(seen.filter((r) => r.url.includes('/fonts/')).length).toBeLessThanOrEqual(3);
    expect(await page.evaluate(() => document.fonts.check('16px "DM Sans"'))).toBe(true);
  });
}

test('/summer-school: phones do not download the smooth-scroll library', async ({ page }) => {
  const { scripts } = await visit(page, '/summer-school');
  expect(scripts().includes('scrollerProxy')).toBe(false); // inside the library itself, not its loader
});

test('home: the main photo is phone-size and the school logos stay small', async ({ page }) => {
  const { seen } = await visit(page, '/');
  const hero = seen.filter((r) => r.url.includes('02-group-cutout'));
  expect(hero.length).toBeGreaterThan(0);
  for (const r of hero) expect(Number(new URL(r.url).searchParams.get('w'))).toBeLessThanOrEqual(1200);
  const logos = seen.filter((r) => r.url.includes('/images/schools/'));
  expect(logos.reduce((sum, r) => sum + r.size, 0)).toBeLessThan(250 * 1024);
});

test('pages never start hidden behind a fade', async ({ page }) => {
  await page.goto('/summer-school', { waitUntil: 'commit' });
  await page.locator('h1').waitFor({ state: 'attached' });
  expect(await page.locator('.page-transition').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('popup forms download on demand, and say so if the download fails', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.route('**/_next/static/chunks/**', (r) => r.abort());
  await page.getByRole('button', { name: /Sign up free to explore roadmaps/ }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('could not load');
  await expect(page.getByRole('button', { name: 'Reload the page' })).toBeVisible();
});
