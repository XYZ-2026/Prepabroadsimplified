// Navbar (Student Profiles, Find Schools, More), the Student Profiles tabs, and the business number.
import { test, expect, type Page } from '@playwright/test';
import { COMPANY_CONFIG } from '../src/config/company';
import { emptyPortfolioRecord, toPortfolioCards } from '../src/components/portfolio/portfolioTypes';

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'viewports are set per test');
});

const open = async (page: Page, path: string, width = 1440, height = 900) => {
  await page.setViewportSize({ width, height });
  await page.goto(path, { waitUntil: 'load' });
};
const bar = (page: Page) => page.locator('nav').first();

test.describe('desktop navbar', () => {
  test('shows the agreed items in order, and fits at the smallest desktop width', async ({ page }) => {
    for (const width of [1280, 1440, 1920]) {
      await open(page, '/', width);
      const labels = await bar(page).locator('div.xl\\:flex > div > :is(div, a)').evaluateAll((els) => els.map((e) => (e.textContent || '').trim()));
      expect(labels).toEqual(['Services', 'Programs', 'Assessments', 'Research', 'Student Profiles', 'Find Schools', 'More']);
      const right = (await bar(page).getByRole('link', { name: /Start Free/ }).boundingBox())!;
      expect(right.x + right.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    }
  });

  test('Find Schools goes to the schools site', async ({ page }) => {
    await open(page, '/');
    await expect(bar(page).getByRole('link', { name: 'Find Schools' })).toHaveAttribute('href', 'https://schools.clarvo.in');
  });

  test('More opens About Us and Blogs, by mouse and by keyboard, and closes with Escape', async ({ page }) => {
    await open(page, '/');
    await expect(bar(page).getByRole('link', { name: /About Us/ })).toHaveCount(0);
    const more = bar(page).getByRole('button', { name: 'More', exact: true });
    await more.hover();
    await expect(bar(page).getByRole('link', { name: /About Us/ })).toHaveAttribute('href', '/about-us');
    await expect(bar(page).getByRole('link', { name: /Blogs/ })).toHaveAttribute('href', '/blog');
    await page.keyboard.press('Escape');
    await page.mouse.move(10, 600);
    await expect(bar(page).getByRole('link', { name: /About Us/ })).toHaveCount(0);
    await more.focus();
    await page.keyboard.press('Enter');
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    await bar(page).getByRole('link', { name: /Blogs/ }).click();
    await expect(page).toHaveURL(/\/blog$/, { timeout: 30000 });
  });

  test('More is highlighted on the pages it holds', async ({ page }) => {
    await open(page, '/about-us');
    await expect(bar(page).getByRole('button', { name: 'More', exact: true })).toHaveClass(/bg-\[#2563EB\]/);
  });
});

test('phone menu has Student Profiles, Find Schools and a More section', async ({ page }) => {
  await open(page, '/', 390, 844);
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('nav');
  await expect(menu.getByRole('link', { name: /Student Profiles/ })).toHaveAttribute('href', '/admitted-students');
  await expect(menu.getByRole('link', { name: /Find Schools/ })).toHaveAttribute('href', 'https://schools.clarvo.in');
  await menu.getByRole('button', { name: 'More', exact: true }).click();
  await expect(menu.getByRole('link', { name: /About Us/ })).toBeVisible();
  await expect(menu.getByRole('link', { name: /Blogs/ })).toBeVisible();
  expect(await page.evaluate(() => document.body.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('Student Profiles page', () => {
  test('has two tabs, marks the current one, and each tab handles Wix being unavailable', async ({ page }) => {
    await open(page, '/admitted-students', 390, 844);
    await expect(page.locator('h1')).toHaveText('Student Profiles');
    const tabs = page.getByRole('navigation', { name: 'Profile type' });
    await expect(tabs.getByRole('link', { name: 'Admitted students' })).toHaveAttribute('aria-current', 'page');
    await tabs.getByRole('link', { name: 'Student portfolios' }).click();
    await expect(page).toHaveURL(/view=portfolios/);
    await expect(tabs.getByRole('link', { name: 'Student portfolios' })).toHaveAttribute('aria-current', 'page');
    // Wix only answers on the hosted site, so locally this tab shows its empty or error message.
    await expect(page.getByText(/No student has published a portfolio yet|temporarily unavailable/)).toBeVisible();
    await expect(page.getByText('Universities', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/^0$/)).toHaveCount(0); // never a misleading zero
    for (const t of await tabs.getByRole('link').all()) expect((await t.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });

  test('a made-up view falls back to admitted students', async ({ page }) => {
    await open(page, '/admitted-students?view=everything');
    await expect(page.getByRole('navigation', { name: 'Profile type' }).getByRole('link', { name: 'Admitted students' })).toHaveAttribute('aria-current', 'page');
  });

  test('only published portfolios with a valid username become cards, with readable details', () => {
    const base = emptyPortfolioRecord();
    const cards = toPortfolioCards([
      { ...base, username: 'asha-rao', fullName: 'Asha Rao', grade: 'Grade 11', stream: 'Science (PCM)', school: 'DPS', city: 'Pune', dream: 'Architect', published: true },
      { ...base, username: 'hidden-one', fullName: 'Hidden', published: false },
      { ...base, username: 'X!', fullName: 'Bad username', published: true },
      { ...base, username: 'no-details', fullName: '', published: true },
    ]);
    expect(cards).toEqual([
      { username: 'asha-rao', fullName: 'Asha Rao', initials: 'AR', photoUrl: '', stage: 'Grade 11 · Science (PCM)', place: 'DPS, Pune', dream: 'Architect' },
      { username: 'no-details', fullName: 'no-details', initials: 'NO', photoUrl: '', stage: '', place: '', dream: '' },
    ]);
  });
});

test.describe('business phone number', () => {
  test('is +91 88280 16354 in the settings', () => {
    expect(COMPANY_CONFIG.phone).toBe('+918828016354');
    expect(COMPANY_CONFIG.phoneFormatted).toBe('+91 88280 16354');
    expect(COMPANY_CONFIG.telLink).toBe('tel:+918828016354');
  });

  for (const path of ['/', '/about-us', '/privacy', '/terms', '/summer-school', '/research']) {
    test(`${path}: every phone link, WhatsApp link and Google entry uses it`, async ({ page }) => {
      await open(page, path);
      const html = await page.content();
      const numbers = new Set([...html.matchAll(/(?:tel:|wa\.me\/|"telephone":")\+?(\d{10,13})/g)].map((m) => m[1]));
      for (const n of numbers) expect(n, path).toBe('918828016354');
      if (path !== '/summer-school') expect(numbers.size, path).toBeGreaterThan(0);
    });
  }
});
