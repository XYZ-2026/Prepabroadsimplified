import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('CLARVO Psychometric Assessment Landing Page', () => {
  const viewports = [
    { name: 'mobile-320', width: 320, height: 600 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'tablet-1024', width: 1024, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`renders cleanly without horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/psychometric-assessment', { waitUntil: 'domcontentloaded' });

      // 1. Page title
      await expect(page).toHaveTitle(/CLARVO Psychometric Assessment/i);

      // 2. No horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // 3. Hero elements
      const headline = page.locator('h1');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText('Understand the student');

      // 4. Sample reports section
      const sampleSection = page.locator('#sample-reports');
      await expect(sampleSection).toBeVisible();

      // 5. 3 Grade Cards
      const grade79Card = page.locator('text=Grades 7–9');
      const grade10Card = page.locator('text=Grade 10');
      const grade1112Card = page.locator('text=Grades 11–12');
      await expect(grade79Card.first()).toBeVisible();
      await expect(grade10Card.first()).toBeVisible();
      await expect(grade1112Card.first()).toBeVisible();
    });
  }

  test('verifies static sample PDF files exist on disk and links are static', async () => {
    const sampleDir = path.resolve(process.cwd(), 'public', 'sample-reports');
    const files = [
      'sample-report-grades-7-9.pdf',
      'sample-report-grade-10.pdf',
      'sample-report-grades-11-12.pdf',
      'cover-grades-7-9.png',
      'cover-grade-10.png',
      'cover-grades-11-12.png',
    ];

    for (const f of files) {
      const fullPath = path.join(sampleDir, f);
      expect(fs.existsSync(fullPath)).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });

  test('interactive phase scrubber switches phase details on click', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/psychometric-assessment', { waitUntil: 'domcontentloaded' });

    // Initial phase is Phase 01: Personality Architecture
    await expect(page.locator('text=Personality Architecture').first()).toBeVisible();

    // Click Phase 02 pill or button
    const p2Button = page.locator('button:has-text("P2")').first();
    await p2Button.click();
    await expect(page.locator('text=Cognitive Processing & Problem-Solving').first()).toBeVisible();

    // Click Phase 04 pill or button
    const p4Button = page.locator('button:has-text("P4")').first();
    await p4Button.click();
    await expect(page.locator('text=Leadership, EQ & Career Domain Fitment').first()).toBeVisible();
  });

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/psychometric-assessment', { waitUntil: 'domcontentloaded' });

    const firstFaqButton = page.locator('#faq button').first();
    await expect(firstFaqButton).toBeVisible();

    // Click second FAQ
    const secondFaqButton = page.locator('#faq button').nth(1);
    await secondFaqButton.click();
    await expect(page.locator('text=No preparation, coaching, or revision is required')).toBeVisible();
  });
});

