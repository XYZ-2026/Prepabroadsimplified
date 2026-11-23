// /summer-school: layout, orbit hero, steps and the enquiry form. The enquiry API is always
// mocked here: a real submission would create a lead in the live database.
import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'viewports are set per test');
  await page.route('**/api/book-a-demo', (r) => r.abort());
});

const open = async (page: Page, width = 1440, height = 900) => {
  await page.setViewportSize({ width, height });
  await page.goto('/summer-school', { waitUntil: 'networkidle' });
};

async function fill(page: Page) {
  await page.getByLabel('Parent / guardian name').fill('Priya Sharma');
  await page.getByLabel('Student name').fill('Rahul Sharma');
  await page.getByLabel('Parent mobile number').fill('98765 43210');
  await page.getByLabel('Grade', { exact: true }).selectOption('Grade 8');
  await page.getByLabel('School name').fill('Delhi Public School');
  await page.getByRole('checkbox').check();
}

const submit = (page: Page) => page.getByRole('button', { name: 'Request my free consultation' });

test.describe('summer school: layout', () => {
  test('headings and buttons match the home page', async ({ page }) => {
    const look = (sel: string) =>
      page.locator(sel).first().evaluate((el) => {
        const c = getComputedStyle(el);
        return [c.fontFamily, c.fontWeight, c.fontSize, c.letterSpacing];
      });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'load' });
    const home = await look('#services h2');
    await open(page);
    expect(await look('#programmes h2')).toEqual(home);
  });

  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
    test(`no sideways scroll and orbit cards stay on screen at ${w}px`, async ({ page }) => {
      await open(page, w, h);
      const widths = await page.evaluate(() => ({ body: document.body.scrollWidth, view: document.documentElement.clientWidth }));
      expect(widths.body).toBeLessThanOrEqual(widths.view);
      // The page clips sideways overflow, so also check that nothing is hidden past the screen edge.
      const offscreen = await page.locator('main :is(h1, h2, h3, p, button, input, select, figure, a)').evaluateAll((els) =>
        els
          .filter((e) => !e.closest('ul[tabindex], [aria-hidden]') && e.getClientRects().length)
          .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
          .map((e) => e.outerHTML.slice(0, 80)),
      );
      expect(offscreen).toEqual([]);
      const cards = page.locator('.ss-orbit-card');
      await expect(cards).toHaveCount(6);
      // Each card stays on the orbit: inside the stage, below the student's face.
      const stage = (await page.locator('.ss-orbit').boundingBox())!;
      for (const c of await cards.all()) {
        const b = (await c.boundingBox())!;
        expect(b.y).toBeGreaterThan(stage.y + stage.height * 0.22);
        expect(b.y + b.height).toBeLessThan(stage.y + stage.height);
      }
      const clipped = await cards.evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth).map((e) => e.textContent));
      expect(clipped).toEqual([]);
      for (const box of await Promise.all((await cards.all()).map((c) => c.boundingBox()))) {
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(w);
      }
    });
  }

  test('one h1, headings in order, unique title, every image loads and has alt text', async ({ page }) => {
    await open(page);
    await expect(page).toHaveTitle('Summer School & Certifications for Grades 8–12 | CLARVO');
    await expect(page.locator('h1')).toHaveCount(1);
    const levels = await page.locator('main :is(h1,h2,h3)').evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    levels.forEach((l, i) => i && expect(l - levels[i - 1]).toBeLessThanOrEqual(1));
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded();
      expect(await img.getAttribute('alt')).not.toBeNull(); // empty alt is right for the carousel's repeat photos
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test('no other brand name appears on the page', async ({ page }) => {
    await open(page);
    expect(await page.locator('main').innerText()).not.toMatch(/clever harvey|catapult|callido/i);
  });
});

test('shows nine reviews, says which programme they are from, and swipes on phones', async ({ page }) => {
  await open(page, 390, 844);
  const list = page.getByRole('list', { name: 'Review list' });
  await expect(list.getByRole('listitem')).toHaveCount(9);
  await expect(page.getByText(/Reviews from the CLARVO Entrepreneurship programme/)).toBeVisible();
  expect(await list.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  const lefts = await list.getByRole('listitem').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
  expect(new Set(lefts).size).toBe(3); // three columns on desktop
});

test.describe('summer school: motion and keyboard', () => {
  const state = (page: Page) => page.locator('.ss-orbit-card').first().evaluate((el) => getComputedStyle(el).animationPlayState);

  test('cards circle the student, passing in front and behind, with no stop button', async ({ page }) => {
    await open(page);
    expect(await state(page)).toBe('running');
    // What is really painted on top at each card's centre: the card (in front) or the student (behind).
    const onTop = await page.locator('.ss-orbit-card').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.ss-orbit-card') === e;
      }),
    );
    expect(onTop).toContain(true);
    expect(onTop).toContain(false);
    await expect(page.getByRole('button', { name: /moving cards/ })).toHaveCount(0);
  });

  test('pointing at a card holds the orbit so it can be read', async ({ page }) => {
    await open(page);
    const front = page.locator('.ss-orbit-card').nth(1);
    await front.hover({ force: true });
    await expect.poll(() => state(page)).toBe('paused');
    await page.mouse.move(1200, 300);
    await expect.poll(() => state(page)).toBe('running');
  });

  test('numbers count up and finish on the published figure', async ({ page }) => {
    await open(page);
    await page.getByRole('region', { name: 'CLARVO in numbers' }).scrollIntoViewIfNeeded();
    await expect(page.getByText('15,000+', { exact: true })).toBeVisible();
    await expect(page.getByText('500+', { exact: true })).toBeVisible();
  });

  test('outcome carousel moves with its arrows and stops at both ends', async ({ page }) => {
    await open(page, 390, 844);
    const next = page.getByRole('button', { name: 'Next', exact: true });
    await next.scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
    for (let i = 2; i <= 5; i++) {
      await next.click();
      await expect(page.getByText(`${i} of 5`)).toBeVisible();
    }
    await expect(next).toBeDisabled();
  });

  test('on phones the programmes swipe sideways inside their own row', async ({ page }) => {
    await open(page, 390, 844);
    const row = page.getByRole('list', { name: 'Programme list' });
    expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  });
  test('reduced motion: cards are still but spread out', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    expect(await state(page)).toBe('paused');
    const places = await page.locator('.ss-orbit-card').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().y * 1000 + e.getBoundingClientRect().x)));
    expect(new Set(places).size).toBe(6);
  });

  test('steps work with arrow keys', async ({ page }) => {
    await open(page);
    await page.getByRole('tab', { name: '1. Set a goal' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: '2. Learn the skill' })).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText('Join a summer programme');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: '4. Show it' })).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('summer school: enquiry form', () => {
  test('empty submit explains every required field, focuses the first and sends nothing', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/book-a-demo', (r) => {
      calls++;
      return r.abort();
    });
    await open(page, 360, 740);
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await submit(page).click();
    await expect(page.getByLabel('Parent / guardian name')).toBeFocused();
    for (const id of ['parentName', 'studentName', 'phone', 'grade', 'schoolName', 'consent']) {
      await expect(page.locator(`#ss-${id}-error`)).toBeVisible();
    }
    await expect(page.locator('#ss-email-error')).toHaveCount(0);
    expect(calls).toBe(0);
  });

  test('sends one request on double click, then confirms', async ({ page }) => {
    const bodies: Record<string, unknown>[] = [];
    await page.route('**/api/book-a-demo', async (r) => {
      bodies.push(r.request().postDataJSON());
      await new Promise((res) => setTimeout(res, 300));
      await r.fulfill({ json: { success: true, enquiryId: 'ENQ-1' } });
    });
    await open(page);
    await fill(page);
    await submit(page).dblclick();
    await expect(page.getByText('Request received.')).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({
      parentName: 'Priya Sharma',
      studentName: 'Rahul Sharma',
      phone: '98765 43210',
      grade: 'Grade 8',
      academicLevel: 'Middle School (Grades 6-8)',
      schoolName: 'Delhi Public School',
      consent: true,
      clarvoExploration: ['Summer School & Certifications'],
      sourcePage: 'summer-school:form',
      companyWebsite: '',
    });
  });

  test('bad phone and email are caught', async ({ page }) => {
    await open(page);
    await fill(page);
    await page.getByLabel('Parent mobile number').fill('12345');
    await page.getByLabel('Email (optional)').fill('nope');
    await submit(page).click();
    await expect(page.locator('#ss-phone-error')).toBeVisible();
    await expect(page.locator('#ss-email-error')).toBeVisible();
  });

  test('server field errors and messages are shown', async ({ page }) => {
    await page.route('**/api/book-a-demo', (r) => r.fulfill({ status: 400, json: { success: false, errors: { phone: 'Server says no.' } } }));
    await open(page);
    await fill(page);
    await submit(page).click();
    await expect(page.locator('#ss-phone-error')).toContainText('Server says no.');
    await expect(page.locator('#ss-phone')).toBeFocused();
  });

  test('too many requests and no network both explain what to do and allow a retry', async ({ page }) => {
    await open(page);
    await fill(page);
    await submit(page).click(); // aborted by beforeEach: no network
    await expect(page.locator('form [role="alert"]')).toContainText('internet connection');
    await page.route('**/api/book-a-demo', (r) => r.fulfill({ status: 429, json: { success: false, message: 'Too many requests. Please try again in a few minutes.' } }));
    await submit(page).click();
    await expect(page.locator('form [role="alert"]')).toContainText('Too many requests');
    await expect(submit(page)).toBeEnabled();
  });

  test('hero button goes to the form', async ({ page }) => {
    await open(page);
    await page.locator('[data-hero-cta]').click();
    await expect(page.getByRole('heading', { name: 'Schedule a consultation call' })).toBeInViewport();
  });
});

test('sitemap lists the page', async ({ request }) => {
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/summer-school</loc>');
});
