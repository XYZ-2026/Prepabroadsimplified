const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'mobile_320', width: 320, height: 640 },
  { name: 'mobile_360', width: 360, height: 740 },
  { name: 'mobile_375_iphone', width: 375, height: 812 },
  { name: 'mobile_390_iphone14', width: 390, height: 844 },
  { name: 'mobile_414_plus', width: 414, height: 896 },
  { name: 'mobile_430_promax', width: 430, height: 932 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'laptop_1024', width: 1024, height: 768 },
  { name: 'desktop_1280', width: 1280, height: 800 },
  { name: 'desktop_1440', width: 1440, height: 900 }
];

const ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/sample-reports', name: 'sample_reports' },
  { path: '/book-a-demo', name: 'book_a_demo' },
  { path: '/about-us', name: 'about_us' },
  { path: '/discover', name: 'discover' },
  { path: '/terms', name: 'terms' },
  { path: '/privacy', name: 'privacy' },
  { path: '/demo-confirmation', name: 'demo_confirmation' }
];

async function waitForServer(url, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          if (res.statusCode < 500) resolve(true);
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(35000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function main() {
  const PORT = 3012;
  const BASE_URL = `http://127.0.0.1:${PORT}`;

  console.log(`Starting Next.js dev server (webpack mode) on port ${PORT}...`);
  const server = spawn('npx', ['next', 'dev', '--webpack', '-p', String(PORT), '-H', '127.0.0.1'], {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) }
  });

  const cleanup = () => {
    try {
      console.log('Terminating test server...');
      server.kill();
    } catch {}
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  try {
    console.log(`Waiting for ${BASE_URL} to be ready...`);
    await waitForServer(BASE_URL);
    console.log('Server is ready! Launching Puppeteer...');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const testResults = [];

    // 1. Viewport audit for Homepage across all required viewports
    console.log('\n--- AUDITING HOMEPAGE ACROSS ALL 10 VIEWPORTS ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      const consoleErrors = [];
      const onConsole = (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      page.on('console', onConsole);

      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 600));

      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const maxW = Math.max(scrollW, bodyW);
        return {
          hasOverflow: maxW > docW,
          clientWidth: docW,
          scrollWidth: maxW,
          diff: maxW - docW
        };
      });

      const shotPath = path.join(SCREENSHOTS_DIR, `homepage_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      testResults.push({
        route: '/',
        viewport: vp.name,
        width: vp.width,
        overflow: overflow.hasOverflow ? `FAIL (+${overflow.diff}px)` : 'PASS (0px)',
        screenshot: path.basename(shotPath)
      });

      page.off('console', onConsole);
      console.log(`✓ ${vp.name} (${vp.width}px): Overflow = ${overflow.hasOverflow ? `FAIL (+${overflow.diff}px)` : 'PASS'}`);
    }

    // 2. Mobile Menu Functional Interaction Check
    console.log('\n--- TESTING MOBILE MENU INTERACTION (375px) ---');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));

    // Find and click hamburger button
    const menuBtn = await page.$('button[aria-label="Open menu"]');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      const menuShot = path.join(SCREENSHOTS_DIR, 'homepage_mobile_menu_open.png');
      await page.screenshot({ path: menuShot });
      console.log('✓ Captured mobile menu open state');
    }

    // 3. Audit all other public pages on Mobile (375px) and Desktop (1280px)
    console.log('\n--- AUDITING ALL OTHER PUBLIC PAGES ---');
    for (const route of ROUTES) {
      if (route.path === '/') continue;

      // Mobile check (375px)
      await page.setViewport({ width: 375, height: 812 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 500));

      const mobileOverflow = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const maxW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        return { hasOverflow: maxW > docW, diff: maxW - docW };
      });

      const mobileShot = path.join(SCREENSHOTS_DIR, `${route.name}_mobile_375.png`);
      await page.screenshot({ path: mobileShot, fullPage: false });

      // Desktop check (1280px)
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 500));

      const desktopShot = path.join(SCREENSHOTS_DIR, `${route.name}_desktop_1280.png`);
      await page.screenshot({ path: desktopShot, fullPage: false });

      testResults.push({
        route: route.path,
        viewport: 'mobile_375',
        width: 375,
        overflow: mobileOverflow.hasOverflow ? `FAIL (+${mobileOverflow.diff}px)` : 'PASS',
        screenshot: path.basename(mobileShot)
      });

      console.log(`✓ ${route.name}: Mobile Overflow = ${mobileOverflow.hasOverflow ? `FAIL (+${mobileOverflow.diff}px)` : 'PASS'}`);
    }

    await browser.close();
    console.log('\n=======================================');
    console.log('TEST SUITE COMPLETED SUCCESSFULLY');
    console.log('Results summary:');
    console.table(testResults);
    console.log('=======================================');

    // Save results summary JSON
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'test_results.json'),
      JSON.stringify(testResults, null, 2),
      'utf8'
    );

  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

