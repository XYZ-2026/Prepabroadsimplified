// Jr MBA overview, every programme page, and batch requests. The enquiry API is always mocked:
// a real submission would create a lead in the live database.
import { test, expect, type Page } from '@playwright/test';
import { PROGRAMMES, SINGLES, TRACKS, YOUNG_CEO, programmeUrl } from '../src/content/programmeList';
import { ALL_PROGRAMMES, factsFor, faqFor, getProgramme } from '../src/content/programmesContent';

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'viewports are set per test');
  await page.route('**/api/book-a-demo', (r) => r.abort());
});

const open = async (page: Page, path: string, width = 1440, height = 900) => {
  await page.setViewportSize({ width, height });
  await page.goto(path, { waitUntil: 'networkidle' });
};

const PARTNERS = /clever harvey|callido|college catapult|junior ?mba|domino|kellogg|cult\.?fit|infinity cars|samsonite|multiply ventures|puma|groww|ihcl|taj lake/i;

test.describe('content', () => {
  test('17 programmes with unique slugs, complete copy and links that resolve', () => {
    expect(PROGRAMMES).toHaveLength(17);
    expect(SINGLES).toHaveLength(10);
    expect(new Set(PROGRAMMES.map((p) => p.slug)).size).toBe(17);
    for (const p of ALL_PROGRAMMES) {
      for (const text of [p.line, p.mission, p.outcome]) expect(text.length, p.slug).toBeGreaterThan(10);
      expect(p.acts.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.suits.length, p.slug).toBeGreaterThanOrEqual(2);
      for (const slug of p.includes ?? []) expect(SINGLES.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(getProgramme('nope')).toBeUndefined();
  });

  test('sessions add up, and no fee is stated anywhere', () => {
    expect(TRACKS.every((t) => t.includes?.length === 3)).toBe(true);
    expect(YOUNG_CEO.includes).toHaveLength(10);
    expect(factsFor(TRACKS[0])[0].value).toContain('45');
    expect(factsFor(YOUNG_CEO)[0].value).toBe('10 programmes, 150 one-hour sessions');
    for (const p of ALL_PROGRAMMES) expect(JSON.stringify([p, factsFor(p), faqFor(p)])).not.toMatch(/₹|\bRs\b|INR|\d{2},\d{3}/);
  });

  test('no other company is named anywhere in the copy', () => {
    expect(JSON.stringify(ALL_PROGRAMMES)).not.toMatch(PARTNERS);
  });
});

test.describe('every programme page', () => {
  for (const p of ALL_PROGRAMMES) {
    test(`${p.slug}: opens, has its own title and one h1, and preselects itself in the form`, async ({ page }) => {
      const res = await page.goto(programmeUrl(p.slug), { waitUntil: 'load' });
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(`${p.name} for Students Aged 13–18 | CLARVO`);
      await expect(page.locator('h1')).toHaveText(p.name);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${programmeUrl(p.slug)}$`));
      const levels = await page.locator('main :is(h1,h2,h3)').evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
      levels.forEach((l, i) => i && expect(l - levels[i - 1]).toBeLessThanOrEqual(1));
      await expect(page.getByLabel('Programme', { exact: true })).toHaveValue(p.slug);
      const text = await page.locator('main').innerText();
      expect(text).not.toMatch(PARTNERS);
      expect(await page.content()).not.toMatch(/₹|priceCurrency/);
      await expect(page.locator('[data-hero-cta]')).toHaveAttribute('href', '#start');
    });
  }

  test('an unknown programme is a 404', async ({ page }) => {
    expect((await page.goto('/summer-school/does-not-exist'))?.status()).toBe(404);
  });

  test('every page is in the sitemap', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const path of [...PROGRAMMES.map((p) => programmeUrl(p.slug)), '/summer-school/jr-mba', '/summer-school/batches']) expect(xml).toContain(`${path}</loc>`);
  });
});

test.describe('layout', () => {
  for (const path of ['/summer-school/jr-mba-advertising', '/summer-school/young-cmo', '/summer-school/young-ceo', '/summer-school/launchpad', '/summer-school/jr-mba', '/summer-school/batches']) {
    for (const [w, h] of [[360, 740], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
      test(`${path} fits at ${w}px`, async ({ page }) => {
        await open(page, path, w, h);
        expect(await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
        const off = await page.locator('main :is(h1, h2, h3, p, dd, button, input, select, a)').evaluateAll((els) =>
          els.filter((e) => !e.closest('ul[tabindex], [aria-hidden]') && e.getClientRects().length && e.getBoundingClientRect().right > window.innerWidth + 1).map((e) => e.outerHTML.slice(0, 90)),
        );
        expect(off).toEqual([]);
      });
    }
  }

  test('each act fits on screen before the next one slides over it', async ({ page }) => {
    for (const slug of ['jr-mba-advertising', 'young-cmo', 'young-ceo', 'launchpad']) {
      for (const [w, h] of [[768, 1024], [1366, 650], [1440, 900]]) {
        await open(page, programmeUrl(slug), w, h);
        const tall = await page.locator('.pg-act').evaluateAll((els) => els.filter((e) => getComputedStyle(e).position === 'sticky' && e.lastElementChild!.getBoundingClientRect().height > window.innerHeight - 69).length);
        expect(tall, `${slug} ${w}x${h}`).toBe(0);
      }
    }
  });
});

test('phone hero: the words start below the face and the button is on the first screen', async ({ page }) => {
  for (const [w, h] of [[360, 740], [390, 844]]) {
    await open(page, '/summer-school/jr-mba-technology', w, h);
    expect((await page.locator('h1').boundingBox())!.y).toBeGreaterThan(h * 0.38);
    const cta = (await page.locator('[data-hero-cta]').boundingBox())!;
    expect(cta.y + cta.height).toBeLessThanOrEqual(h);
  }
});

test('the hero button goes straight to the enquiry form', async ({ page }) => {
  await open(page, '/summer-school/young-cto');
  await page.locator('[data-hero-cta]').click();
  await expect(page.getByRole('heading', { name: 'Send an enquiry' })).toBeInViewport();
});

test.describe('motion', () => {
  const words = (page: Page) => page.locator('section[aria-label="The challenge"] span').evaluateAll((els) => els.map((e) => Number(getComputedStyle(e).opacity)));

  test('the statement lights up as it is read', async ({ page }) => {
    await open(page, '/summer-school/jr-mba-finance');
    expect(Math.max(...(await words(page)))).toBeLessThan(0.5);
    await page.getByRole('heading', { name: 'Three weeks, start to finish' }).evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect.poll(async () => Math.min(...(await words(page)))).toBeGreaterThan(0.95);
  });

  test('reduced motion: statement fully lit, no bars, acts do not stick', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, '/summer-school/jr-mba-finance');
    expect(Math.min(...(await words(page)))).toBe(1);
    expect(await page.locator('.pg-bar').first().evaluate((e) => getComputedStyle(e).display)).toBe('none');
    expect(await page.locator('.pg-act').first().evaluate((e) => getComputedStyle(e).position)).toBe('relative');
    // The big numeral once escaped its act and showed over the hero.
    for (const act of await page.locator('.pg-act').all()) {
      const [outer, numeral] = [(await act.boundingBox())!, (await act.locator('> span').boundingBox())!];
      expect(numeral.y + numeral.height / 2).toBeGreaterThan(outer.y);
      expect(numeral.y).toBeLessThan(outer.y + outer.height);
    }
  });
});

test.describe('navigation', () => {
  test('desktop menu lists every programme and works by keyboard', async ({ page }) => {
    await open(page, '/');
    const trigger = page.getByRole('button', { name: 'Programs', exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const nav = page.locator('nav').first();
    for (const p of PROGRAMMES) await expect(nav.getByRole('link', { name: p.name, exact: true })).toHaveAttribute('href', programmeUrl(p.slug));
    const panel = (await nav.getByRole('link', { name: 'Request a batch' }).locator('xpath=ancestor::div[contains(@class,"grid")][1]').boundingBox())!;
    expect(panel.x).toBeGreaterThanOrEqual(0);
    await nav.getByRole('link', { name: 'Jr MBA in Finance' }).click();
    await expect(page).toHaveURL(/jr-mba-finance$/, { timeout: 20000 });
  });

  test('the menu fits at the smallest desktop width', async ({ page }) => {
    await open(page, '/', 1280, 720);
    await page.getByRole('button', { name: 'Programs', exact: true }).click();
    const box = (await page.locator('nav .grid').first().boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1280);
    expect(box.y + box.height).toBeLessThanOrEqual(720);
  });

  test('phone menu lists them too, with finger-sized links', async ({ page }) => {
    await open(page, '/', 390, 844);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Programs', exact: true }).click();
    const link = page.getByRole('link', { name: 'Young Technology Chief', exact: true });
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await link.click();
    await expect(page).toHaveURL(/young-cto$/, { timeout: 20000 });
  });

  test('overview links to every programme; each page leads to the next one', async ({ page }) => {
    await open(page, '/summer-school/jr-mba');
    for (const p of PROGRAMMES) await expect(page.locator(`main a[href="${programmeUrl(p.slug)}"]`)).toHaveCount(1);
    expect(await page.content()).not.toContain('₹');
    await open(page, programmeUrl('jr-mba-consulting'));
    await expect(page.getByRole('region', { name: 'Next programme' }).getByRole('link')).toHaveAttribute('href', programmeUrl('launchpad'));
  });
});

test.describe('enquiries', () => {
  async function fill(page: Page) {
    await page.getByLabel('Parent / guardian name').fill('Priya Sharma');
    await page.getByLabel('Student name').fill('Rahul Sharma');
    await page.getByLabel('Parent mobile number').fill('98765 43210');
    await page.getByLabel('Grade', { exact: true }).selectOption('Grade 10');
    await page.getByLabel('School name').fill('Delhi Public School');
    await page.locator('#ss-consent').check();
  }

  test('a programme enquiry carries the programme name', async ({ page }) => {
    const bodies: Record<string, unknown>[] = [];
    await page.route('**/api/book-a-demo', (r) => {
      bodies.push(r.request().postDataJSON());
      return r.fulfill({ json: { success: true } });
    });
    await open(page, '/summer-school/jr-mba-ux-design', 390, 844);
    await fill(page);
    await page.getByRole('button', { name: 'Request my free consultation' }).dblclick();
    await expect(page.getByText('Request received.')).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ clarvoExploration: ['Jr MBA in UX Design'], sourcePage: 'summer-school:jr-mba-ux-design', grade: 'Grade 10', consent: true });
    expect(bodies[0]).not.toHaveProperty('preferredTimeFrame');
  });

  test('a batch request needs programme, month and time, then sends them', async ({ page }) => {
    const bodies: Record<string, unknown>[] = [];
    await page.route('**/api/book-a-demo', (r) => {
      bodies.push(r.request().postDataJSON());
      return r.fulfill({ json: { success: true } });
    });
    await open(page, '/summer-school/batches', 390, 844);
    await page.getByRole('button', { name: 'Request this batch' }).click();
    await expect(page.locator('#ss-programme')).toBeFocused();
    for (const id of ['programme', 'month', 'time', 'consent']) await expect(page.locator(`#ss-${id}-error`)).toBeVisible();
    expect(bodies).toHaveLength(0);
    await page.getByLabel('Programme', { exact: true }).selectOption('young-ceo');
    const month = (await page.locator('#ss-month option').nth(2).textContent())!;
    await page.getByLabel('Preferred month').selectOption(month);
    await page.getByLabel('Preferred time').selectOption('Weekday evenings');
    await fill(page);
    await page.getByRole('button', { name: 'Request this batch' }).click();
    await expect(page.getByText('Request received.')).toBeVisible();
    expect(bodies[0]).toMatchObject({ clarvoExploration: ['Young CEO'], preferredTimeFrame: `${month}, Weekday evenings`, sourcePage: 'summer-school:batches' });
  });

  test('no network: says so and allows a retry', async ({ page }) => {
    await open(page, '/summer-school/young-cfo');
    await fill(page);
    const submit = page.getByRole('button', { name: 'Request my free consultation' });
    await submit.click();
    await expect(page.locator('form [role="alert"]')).toContainText('internet connection');
    await expect(submit).toBeEnabled();
  });
});
