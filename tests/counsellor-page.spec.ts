// Counsellor community page. The join API is always mocked here: a real submission saves a live lead.
import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'viewports are set per test');
  await page.route('**/api/community/join', (r) => r.abort());
});

const open = async (page: Page, width = 1440, height = 900) => {
  await page.setViewportSize({ width, height });
  await page.goto('/join-counsellor-community', { waitUntil: 'networkidle' });
};
const submit = (page: Page) => page.getByRole('button', { name: /Join the Counsellor Community/ });

async function fill(page: Page) {
  await page.getByLabel('Name', { exact: true }).fill('Radhika Sen');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page.getByLabel('Email address').fill('radhika@example.com');
  await page.getByRole('checkbox').check();
}

for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]]) {
  test(`fits at ${w}px, photo loads and text is readable`, async ({ page }) => {
    await open(page, w, h);
    const { body, view } = await page.evaluate(() => ({ body: document.body.scrollWidth, view: document.documentElement.clientWidth }));
    expect(body).toBeLessThanOrEqual(view);
    const photo = page.locator('figure img');
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    const small = await page.locator('main :is(p, h1, h2, h3, li, label, span, figcaption)').evaluateAll((els) =>
      els.filter((e) => e.textContent?.trim() && parseFloat(getComputedStyle(e).fontSize) < 14).map((e) => e.textContent),
    );
    expect(small).toEqual([]);
    const lines = await submit(page).evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
    });
    expect(lines).toBe(1); // button text stays on one line
  });
}

test('photo caption names the four roles; five pointers replace the old cards', async ({ page }) => {
  await open(page);
  await expect(page.locator('figcaption')).toHaveText('SAT mentors, admission counsellors, PhD professors and industry experts. Growing together.');
  await expect(page.locator('figure img')).toHaveAttribute('src', /counsellors-together/);
  const { width, height } = (await page.locator('figure img').boundingBox())!;
  expect(width / height).toBeCloseTo(1.5, 1); // the photo's own shape: nobody at the ends is cropped
  await expect(page.locator('main ul h3')).toHaveCount(5);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('phone: the form comes before the photo', async ({ page }) => {
  await open(page, 390, 844);
  const form = (await page.locator('form').boundingBox())!;
  const photo = (await page.locator('figure').boundingBox())!;
  expect(form.y + form.height).toBeLessThan(photo.y);
});

test('consent starts unticked; empty submit explains each field, focuses the first and sends nothing', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/community/join', (r) => {
    calls++;
    return r.abort();
  });
  await open(page, 390, 844);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await submit(page).click();
  for (const id of ['name', 'phone', 'email', 'consent']) await expect(page.locator(`#${id}-error`)).toBeVisible();
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused();
  expect(calls).toBe(0);
});

test('sends once on double click, then opens WhatsApp', async ({ page }) => {
  const bodies: unknown[] = [];
  await page.route('**/api/community/join', async (r) => {
    bodies.push(r.request().postDataJSON());
    await new Promise((res) => setTimeout(res, 300));
    await r.fulfill({ json: { success: true, redirectUrl: 'https://chat.whatsapp.com/test' } });
  });
  await page.route('https://chat.whatsapp.com/**', (r) => r.fulfill({ body: 'whatsapp' }));
  await open(page);
  await fill(page);
  await submit(page).dblclick();
  await page.waitForURL('https://chat.whatsapp.com/test');
  expect(bodies).toEqual([
    { name: 'Radhika Sen', phone: '+91 98765 43210', email: 'radhika@example.com', campaign: 'mentor_counsellor_community' },
  ]);
});

test('no invite link yet: confirms the registration was saved', async ({ page }) => {
  await page.route('**/api/community/join', (r) => r.fulfill({ json: { success: true, redirectUrl: null, message: 'Saved. Link coming soon.' } }));
  await open(page);
  await fill(page);
  await submit(page).click();
  await expect(page.getByRole('status')).toContainText('Saved. Link coming soon.');
});

test('server field errors, server failure and no network are all explained, and retry works', async ({ page }) => {
  await open(page);
  await fill(page);
  await submit(page).click(); // aborted by beforeEach
  await expect(page.locator('form [role="alert"]')).toContainText('check your connection');
  await page.route('**/api/community/join', (r) => r.fulfill({ status: 400, json: { success: false, errors: { phone: 'Server says no.' } } }));
  await submit(page).click();
  await expect(page.locator('#phone-error')).toContainText('Server says no.');
  await page.route('**/api/community/join', (r) => r.fulfill({ status: 500, json: { success: false, error: 'Unable to process.' } }));
  await submit(page).click();
  await expect(page.locator('form [role="alert"]')).toContainText('Unable to process.');
  await expect(submit(page)).toBeEnabled();
});
