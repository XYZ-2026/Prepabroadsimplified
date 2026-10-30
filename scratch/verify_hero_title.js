const puppeteer = require('puppeteer');
const path = require('path');

const SCREENSHOT_PATH = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots/hero_visual_verified.png');

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
  console.log('SUCCESS: Captured screenshot from localhost:3000 at ' + SCREENSHOT_PATH);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
