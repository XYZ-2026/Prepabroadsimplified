import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'reference/audit/playwright-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:3005',
    trace: 'off',
    video: 'off',
  },
  webServer: {
    command: 'npx next dev -p 3005',
    url: 'http://127.0.0.1:3005',
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    {
      name: 'mobile-390x844',
      use: {
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-portrait-768x1024',
      use: {
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-portrait-820x1180',
      use: {
        viewport: { width: 820, height: 1180 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-portrait-834x1194',
      use: {
        viewport: { width: 834, height: 1194 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-landscape-1024x768',
      use: {
        viewport: { width: 1024, height: 768 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-landscape-1180x820',
      use: {
        viewport: { width: 1180, height: 820 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'tablet-landscape-1366x1024',
      use: {
        viewport: { width: 1366, height: 1024 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: 'desktop-1440x900',
      use: {
        viewport: { width: 1440, height: 900 },
        hasTouch: false,
        isMobile: false,
      },
    },
    {
      name: 'desktop-1920x1080',
      use: {
        viewport: { width: 1920, height: 1080 },
        hasTouch: false,
        isMobile: false,
      },
    },
  ],
});
