import { test, expect } from '@playwright/test';

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'viewports are set per test');
});

const band = 'section[aria-labelledby="free-for-students"]';

for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
  test(`sits right under the hero, centred, and fits at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/', { waitUntil: 'networkidle' });
    const order = await page.locator(band).evaluate((el) => [el.previousElementSibling?.getAttribute('aria-label'), el.nextElementSibling?.querySelector('section')?.getAttribute('aria-label')]);
    expect(order).toEqual(['Clarvo Hero - Find the path that fits your child', "Counselled students from India's top schools"]);

    const title = page.locator('#free-for-students');
    await expect(title).toHaveText('Helping students make better decisions, for free');
    for (const el of [title, page.locator(`${band} p`)]) {
      const box = (await el.boundingBox())!;
      expect(Math.abs(box.x + box.width / 2 - w / 2)).toBeLessThan(2);
      expect(await el.evaluate((e) => getComputedStyle(e).textAlign)).toBe('center');
    }
    expect(parseFloat(await title.evaluate((e) => getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(36);
    expect(await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    if (w >= 768) {
      const oneLine = await page.locator(`${band} p`).evaluate((e) => e.getBoundingClientRect().height < parseFloat(getComputedStyle(e).lineHeight) * 1.5);
      expect(oneLine).toBe(true);
    }
  });
}

test('makes no "open source" claim, and its four links open', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(await page.locator(band).innerText()).not.toMatch(/open.?source/i);
  const hrefs = await page.locator(`${band} a`).evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual(['/career-library', '/university-finder', '/admitted-students', '/dashboard/student/portfolio']);
  for (const href of hrefs) expect((await page.request.get(href!)).status(), href!).toBe(200);
});

test('the decision lines end above the icons they point to', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const svg = (await page.locator(`${band} > div > svg`).boundingBox())!;
  const icons = await page.locator(`${band} li a > span:first-child`).evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return r.x + r.width / 2; }));
  [125, 375, 625, 875].forEach((x, i) => expect(Math.abs(svg.x + (svg.width * x) / 1000 - icons[i])).toBeLessThan(2));
});

test('the branch lines are fully drawn at the end, not cut short', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator(`${band} p`).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 500);
  const tree = page.locator('.free-tree');
  await expect.poll(() => tree.evaluate((e) => e.getBoundingClientRect().height)).toBeCloseTo(96, 0);
  const dashes = await tree.locator('path').evaluateAll((els) => els.map((e) => getComputedStyle(e).strokeDasharray));
  expect(dashes).toEqual(['none', 'none', 'none', 'none']);
});

test('draws once on scroll, and is complete straight away with reduced motion or without JavaScript', async ({ page, browser }) => {
  const line = `${band} .free-line >> nth=0`;
  const offset = (p: typeof page) => p.locator(line).evaluate((e) => getComputedStyle(e).strokeDashoffset);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(await offset(page)).toBe('1px');
  await page.locator(`${band} p`).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect.poll(() => offset(page)).toBe('0px');
  await expect.poll(() => page.locator('.free-tool').last().evaluate((e) => getComputedStyle(e).opacity)).toBe('1');

  for (const options of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
    const context = await browser.newContext({ ...options, viewport: { width: 390, height: 844 } });
    const still = await context.newPage();
    await still.goto('http://127.0.0.1:3005/', { waitUntil: 'load' });
    if (!('javaScriptEnabled' in options)) {
      await still.waitForTimeout(1500);
      expect(await offset(still)).toBe('0px');
    } else {
      await expect(still.locator(band)).toHaveAttribute('data-draw', 'done');
    }
    await context.close();
  }
});
