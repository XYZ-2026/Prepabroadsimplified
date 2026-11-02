const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function verifyLogo() {
  const userDataDir = path.resolve('scratch', 'puppeteer_logo_' + Date.now());
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to http://127.0.0.1:3000/psychometric-test...');
  await page.goto('http://127.0.0.1:3000/psychometric-test', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  const logoMetrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const logoLink = header ? header.querySelector('a[href="/"]') : null;
    const logoImg = logoLink ? logoLink.querySelector('img') : null;
    const logoText = logoLink ? logoLink.querySelector('span') : null;

    return {
      headerHeight: header ? header.clientHeight : null,
      logoLinkRect: logoLink ? logoLink.getBoundingClientRect() : null,
      logoImgSize: logoImg ? { width: logoImg.clientWidth, height: logoImg.clientHeight } : null,
      logoTextSize: logoText ? {
        fontSize: window.getComputedStyle(logoText).fontSize,
        lineHeight: window.getComputedStyle(logoText).lineHeight,
        text: logoText.innerText.trim(),
      } : null,
    };
  });

  console.log('Logo metrics in header:', JSON.stringify(logoMetrics, null, 2));

  const screenshotPath = path.join(SCREENSHOTS_DIR, 'psychometric_header_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  await browser.close();
}

verifyLogo().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

