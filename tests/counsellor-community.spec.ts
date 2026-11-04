import { test, expect } from '@playwright/test';

test.describe('CLARVO — Global Counselling Association (/join-counsellor-community)', () => {
  
  test('A1: Exactly four business input fields appear on the page (no school, grade, or student fields)', async ({ page }) => {
    await page.goto('/join-counsellor-community');
    await page.waitForLoadState('networkidle');

    // Exactly 4 business inputs: name, phone, email, linkedInUrl
    const nameInput = page.locator('input#name');
    const phoneInput = page.locator('input#phone');
    const emailInput = page.locator('input#email');
    const linkedInInput = page.locator('input#linkedInUrl');

    await expect(nameInput).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(linkedInInput).toBeVisible();

    // Verify forbidden fields do NOT exist
    await expect(page.locator('input#schoolName')).toHaveCount(0);
    await expect(page.locator('select#grade')).toHaveCount(0);
    await expect(page.locator('input#studentName')).toHaveCount(0);
    await expect(page.locator('input#parentName')).toHaveCount(0);
    await expect(page.locator('input#priorityGoal')).toHaveCount(0);

    // Verify CTA button label
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Join the Counsellor Community →');
  });

  test('A2: Five association offerings are clearly displayed with correct branding', async ({ page }) => {
    await page.goto('/join-counsellor-community');

    // Verify Brand & Headlines
    await expect(page.locator('text=CLARVO — GLOBAL COUNSELLING ASSOCIATION').first()).toBeVisible();
    await expect(page.locator('text=Connect. Grow. Make an Impact.').first()).toBeVisible();
    await expect(page.locator('text=A Professional Community for the Future of Counselling.').first()).toBeVisible();

    // Verify 5 Offerings (visible on current viewport)
    await expect(page.locator('h3:has-text("Free Counsellor Certification")').filter({ visible: true })).toBeVisible();
    await expect(page.locator('h3:has-text("Professional Recognition & Visibility")').filter({ visible: true })).toBeVisible();
    await expect(page.locator('h3:has-text("Knowledge Building & Expert Workshops")').filter({ visible: true })).toBeVisible();
    await expect(page.locator('h3:has-text("Freelancing & Career Opportunities")').filter({ visible: true })).toBeVisible();
    await expect(page.locator('h3:has-text("B2B School Counselling Networks")').filter({ visible: true })).toBeVisible();
  });

  test('A3: Validation rejects missing required fields and invalid formats', async ({ page }) => {
    await page.goto('/join-counsellor-community');

    // Click submit immediately without filling required inputs
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Should display validation messages
    await expect(page.locator('text=Please enter your full name')).toBeVisible();
    await expect(page.locator('text=Please enter a valid contact number')).toBeVisible();
    await expect(page.locator('text=Please enter your professional email address')).toBeVisible();

    // Enter invalid email and invalid phone
    await page.fill('input#name', 'Dr. Radhika Sen');
    await page.fill('input#phone', '123');
    await page.fill('input#email', 'invalid-email');
    await page.fill('input#linkedInUrl', 'not-a-valid-url');
    await submitBtn.click();

    await expect(page.locator('text=Please enter a valid contact number')).toBeVisible();
    await expect(page.locator('text=Please enter your professional email address')).toBeVisible();
    await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  });

  test('A4: Successful submission persists lead and returns active Counsellor WhatsApp URL', async ({ page }) => {
    await page.goto('/join-counsellor-community');

    const testTimestamp = Date.now();
    const testName = `Mentor Test ${testTimestamp}`;
    const testPhone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
    const testEmail = `counsellor_${testTimestamp}@example.com`;
    const testLinkedIn = 'https://www.linkedin.com/in/counsellor-test';

    await page.fill('input#name', testName);
    await page.fill('input#phone', testPhone);
    await page.fill('input#email', testEmail);
    await page.fill('input#linkedInUrl', testLinkedIn);

    let capturedJson: any = null;
    await page.route('**/api/community/join', async (route) => {
      const response = await route.fetch();
      capturedJson = await response.json();
      await route.fulfill({ response });
    });

    // Prevent leaving the page so test runner doesn't tear down context mid-navigation
    await page.route('https://chat.whatsapp.com/**', (route) => route.abort());

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await page.waitForResponse((res) => res.url().includes('/api/community/join') && res.request().method() === 'POST');

    expect(capturedJson).not.toBeNull();
    expect(capturedJson.success).toBe(true);
    expect(capturedJson.leadId).toBeDefined();
    expect(capturedJson.redirectUrl).toBe('https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ');
  });

  test('A5: Mobile view opens form at the top without requiring vertical scrolling', async ({ page }) => {
    // Set viewport to mobile standard 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/join-counsellor-community');
    await page.waitForLoadState('networkidle');

    // Form inputs should be visible above the fold on mobile
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible();
    const box = await nameInput.boundingBox();
    expect(box).not.toBeNull();
    // Input should be located within first 400px of viewport
    expect(box!.y).toBeLessThan(400);

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
  });

  test('B1: Existing Student & Parent Community (/join-community) remains fully functional', async ({ page }) => {
    await page.goto('/join-community');
    await page.waitForLoadState('networkidle');

    // Verify existing student/parent form fields are intact
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#phone')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#schoolName')).toBeVisible();
    await expect(page.locator('select#grade')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Join the Community →');
  });

});
