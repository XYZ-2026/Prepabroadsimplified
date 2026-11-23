// The sign-up popup (SignInModal + QuickSignUp): layout on every screen size, the short form,
// validation, submit, and that the full /auth wizard is untouched.
// Account creation is mocked in the browser tests so no real accounts are made.
import { test, expect, type Locator, type Page, type Route } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.beforeEach(({}, info) => {
  // Each test sets its own viewport; running once keeps the dev server's sign-up rate limit untouched.
  test.skip(info.project.name !== 'mobile-390x844', 'viewports are set per test');
});

const signInTab = (d: Locator) => d.getByRole('group', { name: 'Choose an option' }).getByRole('button', { name: 'Sign in' });

const ROADMAP_BUTTON = /Sign up free to explore roadmaps/;

async function openPopup(page: Page, size = { width: 390, height: 844 }) {
  await page.setViewportSize(size);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: ROADMAP_BUTTON }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  // Let the entry animation finish before measuring.
  await page.waitForTimeout(400);
  return dialog;
}

async function fillValid(page: Page) {
  const d = page.getByRole('dialog');
  await d.getByLabel("Student's full name").fill('Rahul Sharma');
  await d.getByLabel('Parent / guardian name').fill('Priya Sharma');
  await d.getByLabel('Mobile number').fill('98765 43210');
  await d.getByLabel('Email address').fill('rahul.e2e@example.com');
  await d.getByText('10th', { exact: true }).click();
  await d.getByLabel('School name').fill('Delhi Public School');
  await d.getByLabel('City').fill('Mumbai');
  await d.getByLabel('Create password', { exact: true }).fill('secret123');
  await d.getByLabel('Confirm password', { exact: true }).fill('secret123');
  await d.getByLabel(/parent or guardian, or I have their permission/).check();
}

const SIZES = [
  { name: 'small phone', width: 360, height: 640 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'short laptop', width: 1366, height: 650 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('sign-up popup: fits the screen', () => {
  for (const size of SIZES) {
    test(`${size.name} ${size.width}x${size.height}: popup stays inside the screen and the button is reachable`, async ({ page }) => {
      const dialog = await openPopup(page, size);
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(size.height + 1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(size.width + 1);

      // Title and close button always visible at the top.
      await expect(dialog.getByRole('heading', { name: 'Explore 100+ career roadmaps, free' })).toBeInViewport();
      await expect(dialog.getByRole('button', { name: 'Close' })).toBeInViewport();

      // No sideways scrolling inside the popup.
      const sideways = await page.locator('[data-signin-body]').evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(sideways).toBeLessThanOrEqual(0);

      // The submit button can be scrolled into view inside the popup.
      const submit = dialog.getByRole('button', { name: 'Create free account' });
      await submit.scrollIntoViewIfNeeded();
      await expect(submit).toBeInViewport();
    });
  }
});

test.describe('sign-up popup: the short form', () => {
  test('opens on Create account with exactly the agreed fields, and none of the old wizard', async ({ page }) => {
    const d = await openPopup(page);
    await expect(d.getByRole('group', { name: 'Choose an option' }).getByRole('button', { name: 'Create account' })).toHaveAttribute('aria-pressed', 'true');
    for (const label of ["Student's full name", 'Parent / guardian name', 'Mobile number', 'Email address', 'School name', 'City']) {
      await expect(d.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(d.getByLabel('Create password', { exact: true })).toBeVisible();
    await expect(d.getByLabel('Confirm password', { exact: true })).toBeVisible();
    await expect(d.getByRole('group', { name: 'Current grade' }).getByRole('radio')).toHaveCount(7);
    await expect(d.getByRole('checkbox')).not.toBeChecked(); // consent is never pre-ticked
    await expect(d.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

    // The old 4-step wizard's extras are gone from the popup.
    await expect(d.getByText('Counsellor')).toHaveCount(0);
    await expect(d.getByText('Education Board')).toHaveCount(0);
    await expect(d.getByText('Continue to Academic Profile')).toHaveCount(0);
  });

  test('choosing Undergrad renames the school field', async ({ page }) => {
    const d = await openPopup(page);
    await d.getByText('Undergrad', { exact: true }).click();
    await expect(d.getByLabel('College / university name')).toBeVisible();
    await expect(d.getByRole('radio', { name: 'Undergrad' })).toBeChecked();
  });

  test('submitting empty shows a message on every field, focuses the first, and sends nothing', async ({ page }) => {
    let calls = 0;
    await page.route('**/api/auth/register', (r) => {
      calls++;
      return r.abort();
    });
    const d = await openPopup(page);
    await d.getByRole('button', { name: 'Create free account' }).click();

    await expect(d.getByLabel("Student's full name")).toBeFocused();
    await expect(d.getByLabel("Student's full name")).toHaveAttribute('aria-invalid', 'true');
    for (const msg of [
      "Enter the student's full name.",
      "Enter the parent or guardian's name.",
      'Enter a mobile number so a counsellor can reach you.',
      'Enter an email address.',
      'Choose the current grade.',
      'Enter the school name.',
      'Enter the city.',
      'Create a password.',
      'Type the password again.',
      'Tick this box to confirm a parent or guardian agrees.',
    ]) {
      await expect(d.getByText(msg)).toBeVisible();
    }
    expect(calls).toBe(0);
  });

  test('a field error clears as soon as the person types', async ({ page }) => {
    const d = await openPopup(page);
    await d.getByRole('button', { name: 'Create free account' }).click();
    await expect(d.getByText('Enter the city.')).toBeVisible();
    await d.getByLabel('City').fill('Pune');
    await expect(d.getByText('Enter the city.')).toHaveCount(0);
  });

  test('mismatched passwords and a bad mobile are caught before sending', async ({ page }) => {
    const d = await openPopup(page);
    await fillValid(page);
    await d.getByLabel('Mobile number').fill('12345');
    await d.getByLabel('Confirm password', { exact: true }).fill('different1');
    await d.getByRole('button', { name: 'Create free account' }).click();
    await expect(d.getByText(/Enter a 10-digit mobile number/)).toBeVisible();
    await expect(d.getByText("The passwords don't match.")).toBeVisible();
  });

  test('show/hide password toggle works with a clear name', async ({ page }) => {
    const d = await openPopup(page);
    const pw = d.getByLabel('Create password', { exact: true });
    await pw.fill('secret123');
    await expect(pw).toHaveAttribute('type', 'password');
    await d.getByRole('button', { name: 'Show create password' }).click();
    await expect(pw).toHaveAttribute('type', 'text');
  });
});

test.describe('sign-up popup: submitting', () => {
  test('sends the short-form data once (even on double-click) and opens the Career Library', async ({ page }) => {
    const bodies: Record<string, unknown>[] = [];
    await page.route('**/api/auth/register', async (r: Route) => {
      bodies.push(r.request().postDataJSON());
      await new Promise((res) => setTimeout(res, 300)); // slow network
      await r.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    const d = await openPopup(page);
    await fillValid(page);
    const submit = d.getByRole('button', { name: 'Create free account' });
    await submit.dblclick();
    await expect(d.getByRole('button', { name: 'Creating your account…' })).toBeDisabled();
    await page.waitForURL(/\/career-library$/);

    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({
      signupForm: 'quick',
      role: 'student',
      name: 'Rahul Sharma',
      parentName: 'Priya Sharma',
      mobile: '98765 43210',
      email: 'rahul.e2e@example.com',
      grade: '10',
      school: 'Delhi Public School',
      city: 'Mumbai',
      parentConsent: true,
    });
  });

  test('email already registered: offers Sign in with the email filled in', async ({ page }) => {
    await page.route('**/api/auth/register', (r) =>
      r.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'This email address is already registered. Please sign in instead.' }),
      }),
    );
    const d = await openPopup(page);
    await fillValid(page);
    await d.getByRole('button', { name: 'Create free account' }).click();
    await expect(d.getByRole('alert')).toContainText('This email already has a CLARVO account.');
    await d.getByRole('button', { name: 'Sign in instead' }).click();
    await expect(signInTab(d)).toHaveAttribute('aria-pressed', 'true');
    await expect(d.getByLabel('Email address')).toHaveValue('rahul.e2e@example.com');
  });

  test('server field errors are shown next to the field', async ({ page }) => {
    await page.route('**/api/auth/register', (r) =>
      r.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Enter the city.', fields: { city: 'Enter the city.' } }),
      }),
    );
    const d = await openPopup(page);
    await fillValid(page);
    await d.getByRole('button', { name: 'Create free account' }).click();
    await expect(d.getByLabel('City')).toHaveAttribute('aria-invalid', 'true');
    await expect(d.getByLabel('City')).toBeFocused();
  });

  test('network failure shows a helpful message and lets them retry', async ({ page }) => {
    await page.route('**/api/auth/register', (r) => r.abort('internetdisconnected'));
    const d = await openPopup(page);
    await fillValid(page);
    await d.getByRole('button', { name: 'Create free account' }).click();
    await expect(d.getByRole('alert')).toBeVisible();
    await expect(d.getByRole('button', { name: 'Create free account' })).toBeEnabled();
  });
});

test.describe('sign-up popup: keyboard and closing', () => {
  test('Escape closes, and Tab stays inside the popup', async ({ page }) => {
    const d = await openPopup(page, { width: 1440, height: 900 });
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
      expect(inside).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(d).toHaveCount(0);
  });

  test('grade can be chosen with the keyboard', async ({ page }) => {
    const d = await openPopup(page, { width: 1440, height: 900 });
    await d.getByRole('radio', { name: '7th' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(d.getByRole('radio', { name: '8th' })).toBeChecked();
  });

  test('Sign in tab: forgot-password view and back', async ({ page }) => {
    const d = await openPopup(page);
    await signInTab(d).click();
    await expect(d.getByLabel('Password', { exact: true })).toBeVisible();
    await d.getByRole('button', { name: 'Forgot password?' }).click();
    await expect(d.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
    await d.getByRole('button', { name: 'Send reset link' }).click();
    await expect(d.getByText('Enter your email address.')).toBeVisible();
    await d.getByRole('button', { name: 'Back to sign in' }).click();
    await expect(d.locator('form[aria-label="Sign in"]')).toBeVisible();
  });

  test('sign in with an empty form asks for email first', async ({ page }) => {
    const d = await openPopup(page);
    await signInTab(d).click();
    await d.locator('form[aria-label="Sign in"]').getByRole('button', { name: 'Sign in' }).click();
    await expect(d.getByText('Enter your email address.')).toBeVisible();
    await expect(d.getByLabel('Email address')).toBeFocused();
  });
});

test.describe('regression: the /auth page keeps its full 4-step wizard', () => {
  test('/auth?tab=register still shows the original Register form', async ({ page }) => {
    await page.goto('/auth?tab=register', { waitUntil: 'networkidle' });
    await expect(page.getByText('Basic Identity')).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue to Academic Profile/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Counsellor/ })).toBeVisible();
  });
});

test.describe('the other popups use the short form too', () => {
  for (const size of [{ width: 360, height: 640 }, { width: 1366, height: 650 }]) {
    const expectShortForm = async (page: Page) => {
      const d = page.getByRole('dialog');
      await expect(d).toBeVisible();
      await page.waitForTimeout(400);
      const box = (await d.boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(size.height + 1);
      await d.getByRole('group', { name: 'Choose an option' }).getByRole('button', { name: 'Create account' }).click();
      await expect(d.getByLabel('Parent / guardian name')).toBeVisible();
      await expect(d.getByText('Continue to Academic Profile')).toHaveCount(0);
    };

    test(`portfolio button at ${size.width}px`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/admitted-students', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /Create my free portfolio/ }).click();
      await expectShortForm(page);
    });

    test(`admitted-student link and locked profile at ${size.width}px`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize(size);
      await page.goto('/admitted-students', { waitUntil: 'networkidle' });
      // Student profiles come from Wix and only load on the hosted site.
      const link = page.locator('a[data-auth-gate]').first();
      test.skip((await link.count()) === 0, 'no student profiles available in this environment');
      const href = await link.getAttribute('href');
      await link.click();
      await expectShortForm(page);

      await page.goto(href!, { waitUntil: 'networkidle' }); // a locked profile opens the popup by itself
      await expectShortForm(page);
    });
  }
});

test.describe('server checks for the popup form', () => {
  test('register rejects an incomplete popup sign-up with field messages (nothing is saved)', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: { signupForm: 'quick', name: 'Rahul Sharma', email: 'rahul.e2e@example.com', password: 'secret123', confirmPassword: 'secret123' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(Object.keys(body.fields).sort()).toEqual(['city', 'grade', 'mobile', 'parentConsent', 'parentName', 'school'].sort());
  });

  test('register rejects a popup sign-up without consent even if everything else is filled', async ({ request }) => {
    const res = await request.post('/api/auth/register', {
      data: {
        signupForm: 'quick',
        name: 'Rahul Sharma',
        email: 'rahul.e2e@example.com',
        mobile: '9876543210',
        parentName: 'Priya Sharma',
        grade: '10',
        school: 'DPS',
        city: 'Mumbai',
        password: 'secret123',
        confirmPassword: 'secret123',
        parentConsent: 'yes',
      },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).fields).toEqual({ parentConsent: 'Tick this box to confirm a parent or guardian agrees.' });
  });

  test('Google finish step: needs a session, and validates like the email form', async ({ request }) => {
    const anon = await request.post('/api/user/update-profile', { data: { signupForm: 'quick' } });
    expect(anon.status()).toBe(401);

    const envFile = path.join(process.cwd(), '.env');
    const line = fs.readFileSync(envFile, 'utf8').split(/\r?\n/).find((l) => l.startsWith('SESSION_SECRET='));
    test.skip(!line, 'SESSION_SECRET missing from .env');
    process.env.SESSION_SECRET = line!.slice('SESSION_SECRET='.length).replace(/^['"]|['"]$/g, '');
    const { signSessionToken } = await import('../src/lib/session-token');
    const token = signSessionToken({ uid: 'e2e-test-no-such-user', email: 'e2e@example.com', name: 'E2E Student', role: 'student' });

    const res = await request.post('/api/user/update-profile', {
      headers: { Cookie: `__session=${token}` },
      data: { signupForm: 'quick', name: 'Test Student', mobile: '9876543210', grade: '10', schoolName: 'DPS', city: 'Pune' },
    });
    expect(res.status()).toBe(400);
    expect(Object.keys((await res.json()).fields).sort()).toEqual(['parentConsent', 'parentName']);
  });
});
