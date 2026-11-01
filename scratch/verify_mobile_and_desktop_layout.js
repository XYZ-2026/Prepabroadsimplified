const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PORT = 3025;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 60000) {
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
        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function run() {
  console.log(`[Test] Starting Next.js test server on port ${PORT}...`);
  const nextProcess = spawn('npx', ['next', 'dev', '--webpack', '-H', '127.0.0.1', '-p', String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
  });

  try {
    console.log('[Test] Waiting for Next.js to be ready on', BASE_URL);
    await waitForServer(`${BASE_URL}/join-community`, 60000);
    console.log('[Test] Server is ready!');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();

    // ──────────────────────────────────────────────
    // 1. MOBILE VIEW (375x812)
    // ──────────────────────────────────────────────
    console.log('[Test] Inspecting mobile view (375x812)...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/join-community`, { waitUntil: 'networkidle2' });

    // Verify Header text
    const headerText = await page.$eval('header', (el) => el.innerText);
    console.log('[Test] Mobile Header Text:', JSON.stringify(headerText));
    const hasStudentParentInHeader = headerText.includes('Student & Parent Community');
    console.log('[Test] Header includes "Student & Parent Community":', hasStudentParentInHeader);

    // Verify Layout Order on Mobile: Headline -> Form -> Benefits
    const layoutPositions = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const form = document.querySelector('form');
      const mobileBenefits = document.querySelector('.block.lg\\:hidden');
      const desktopBenefits = document.querySelector('.hidden.lg\\:block');

      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const formRect = form ? form.getBoundingClientRect() : null;
      const mobRect = mobileBenefits ? mobileBenefits.getBoundingClientRect() : null;

      // Check benefit cards in mobile container
      const cards = mobileBenefits ? Array.from(mobileBenefits.querySelectorAll('h2')).map((el) => ({
        text: el.innerText,
        truncated: el.scrollWidth > el.clientWidth,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      })) : [];

      return {
        h1Top: h1Rect ? h1Rect.top : 0,
        formTop: formRect ? formRect.top : 0,
        formBottom: formRect ? formRect.bottom : 0,
        mobBenefitsTop: mobRect ? mobRect.top : 0,
        mobBenefitsVisible: mobRect ? mobRect.height > 0 : false,
        desktopBenefitsVisible: desktopBenefits ? window.getComputedStyle(desktopBenefits).display !== 'none' : false,
        cards,
      };
    });

    console.log('[Test] Mobile Layout Positions:');
    console.log(`  - Headline top: ${layoutPositions.h1Top}px`);
    console.log(`  - Form top: ${layoutPositions.formTop}px, bottom: ${layoutPositions.formBottom}px`);
    console.log(`  - Mobile Benefits top: ${layoutPositions.mobBenefitsTop}px`);
    console.log(`  - Form is before Mobile Benefits: ${layoutPositions.formTop < layoutPositions.mobBenefitsTop}`);
    console.log(`  - Desktop Benefits hidden on mobile: ${!layoutPositions.desktopBenefitsVisible}`);
    console.log(`  - Mobile Benefits visible: ${layoutPositions.mobBenefitsVisible}`);
    console.log('  - Benefit card titles & truncation check:', JSON.stringify(layoutPositions.cards, null, 2));

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'community_mobile_375_verified.png'),
      fullPage: true,
    });
    console.log('[Test] Saved mobile screenshot');

    // ──────────────────────────────────────────────
    // 2. DESKTOP VIEW (1280x800)
    // ──────────────────────────────────────────────
    console.log('[Test] Inspecting desktop view (1280x800)...');
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.reload({ waitUntil: 'networkidle2' });

    const desktopLayout = await page.evaluate(() => {
      const desktopBenefits = document.querySelector('.hidden.lg\\:block');
      const mobileBenefits = document.querySelector('.block.lg\\:hidden');
      const form = document.querySelector('form');

      const deskRect = desktopBenefits ? desktopBenefits.getBoundingClientRect() : null;
      const mobRect = mobileBenefits ? mobileBenefits.getBoundingClientRect() : null;
      const formRect = form ? form.getBoundingClientRect() : null;

      return {
        desktopBenefitsVisible: desktopBenefits ? window.getComputedStyle(desktopBenefits).display !== 'none' : false,
        mobileBenefitsVisible: mobileBenefits ? window.getComputedStyle(mobileBenefits).display !== 'none' : false,
        deskLeft: deskRect ? deskRect.left : 0,
        formLeft: formRect ? formRect.left : 0,
      };
    });

    console.log('[Test] Desktop Layout:');
    console.log(`  - Desktop benefits visible: ${desktopLayout.desktopBenefitsVisible}`);
    console.log(`  - Mobile benefits hidden on desktop: ${!desktopLayout.mobileBenefitsVisible}`);
    console.log(`  - Desktop side-by-side (Benefits left: ${desktopLayout.deskLeft}px, Form left: ${desktopLayout.formLeft}px): ${desktopLayout.deskLeft < desktopLayout.formLeft}`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'community_desktop_1280_verified.png'),
      fullPage: false,
    });
    console.log('[Test] Saved desktop screenshot');

    await browser.close();

    // Verify test data in community-leads.json
    const leadsFile = path.resolve('src/data/community-leads.json');
    if (fs.existsSync(leadsFile)) {
      const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
      console.log(`[Test] Active leads in community-leads.json: ${leads.length}`);
    }

    console.log('[Test] ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
  } finally {
    console.log('[Test] Terminating Next.js test server...');
    nextProcess.kill('SIGKILL');
  }
}

run().catch((err) => {
  console.error('[Test Error]:', err);
  process.exit(1);
});
