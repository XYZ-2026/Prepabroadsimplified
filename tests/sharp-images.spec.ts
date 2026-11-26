// Photos must reach the browser at the size they are actually drawn, not the size of their frame.
// (A cropped photo is drawn wider than its frame; sending the frame's width made faces look blurred.)
import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/summer-school', '/summer-school/jr-mba', '/summer-school/jr-mba-advertising', '/summer-school/young-ceo', '/join-counsellor-community', '/research', '/psychometric-assessment'];
const SCREENS = [
  { name: 'phone', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 },
  { name: 'laptop', viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1.25 },
  { name: 'desktop', viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
];

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'screens are set per test');
});

async function softImages(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(60);
  }
  // Load the cards still waiting off-screen in swipe rows, so they are checked too.
  await page.evaluate(() => document.querySelectorAll('img').forEach((img) => (img.loading = 'eager')));
  await expect
    .poll(() => page.evaluate(() => Array.from(document.images).filter((i) => i.getBoundingClientRect().width && !i.complete).length), { timeout: 30000 })
    .toBe(0);
  return page.evaluate(async () => {
    const soft: string[] = [];
    for (const img of Array.from(document.images)) {
      const box = img.getBoundingClientRect();
      if (box.width < 80 || !img.currentSrc.includes('/_next/image') || !img.naturalWidth) continue;
      const load = async (src: string) => createImageBitmap(await (await fetch(src)).blob());
      const url = new URL(img.currentSrc);
      const [sent, full] = [await load(img.currentSrc), await load(url.searchParams.get('url')!)];
      const ratio = full.width / full.height;
      const fit = getComputedStyle(img).objectFit;
      const drawn = fit === 'cover' ? Math.max(box.width, box.height * ratio) : fit === 'contain' ? Math.min(box.width, box.height * ratio) : box.width;
      const needed = Math.min(drawn * devicePixelRatio, full.width); // never more than the file has
      if (sent.width < needed * 0.9 || url.searchParams.get('q') !== '84') soft.push(`${url.searchParams.get('url')} sent ${sent.width}px, needs ${Math.round(needed)}px, q${url.searchParams.get('q')}`);
    }
    return [...new Set(soft)];
  });
}

for (const { name, ...screen } of SCREENS) {
  for (const path of PAGES) {
    test(`${path} is sharp on a ${name}`, async ({ browser }) => {
      test.setTimeout(90000);
      const context = await browser.newContext({ ...screen, baseURL: 'http://127.0.0.1:3005' });
      const page = await context.newPage();
      await page.goto(path, { waitUntil: 'load' });
      expect(await softImages(page)).toEqual([]);
      await context.close();
    });
  }
}

test('supplied photos are not recompressed below their original size', async ({ request }) => {
  for (const src of ['/images/programmes/jr-mba.webp', '/images/community/counsellors-together.webp', '/images/summer-school/mentor-startup.webp']) {
    const res = await request.get(src);
    expect(res.status()).toBe(200);
    expect((await res.body()).length, src).toBeGreaterThan(100 * 1024);
  }
});
