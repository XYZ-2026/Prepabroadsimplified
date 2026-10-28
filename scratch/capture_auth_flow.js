const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to homepage to test Auth Modal...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // Find Sign In or Get Started button
  const btns = await page.$$('button, a');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.includes('Sign In') || txt.includes('Log In'))) {
      await b.click();
      console.log('Clicked Sign In button');
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));
  const authModalPath = path.join(ARTIFACT_DIR, 'auth_modal_initial.png');
  await page.screenshot({ path: authModalPath, fullPage: false });
  console.log('Saved Auth Modal screenshot:', authModalPath);

  await browser.close();
}

main().catch(console.error);
