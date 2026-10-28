const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71');

async function main() {
  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('\n--- 2. Testing Discover Page (/discover) ---');
  await page.goto('http://localhost:3000/discover', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Desktop Discover screenshot
  const discDeskPath = path.join(ARTIFACT_DIR, 'discover_desktop.png');
  await page.screenshot({ path: discDeskPath, fullPage: false });
  console.log('Saved Discover Desktop screenshot:', discDeskPath);

  // Mobile Discover screenshot
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 1500));
  const discMobPath = path.join(ARTIFACT_DIR, 'discover_mobile.png');
  await page.screenshot({ path: discMobPath, fullPage: false });
  console.log('Saved Discover Mobile screenshot:', discMobPath);

  // Restore Desktop
  await page.setViewport({ width: 1280, height: 900, isMobile: false });

  console.log('\n--- 3. Testing Footer Company Details ---');
  await page.goto('http://localhost:3000/terms', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  const footerPath = path.join(ARTIFACT_DIR, 'footer_company_details.png');
  await page.screenshot({ path: footerPath, fullPage: false });
  console.log('Saved Footer screenshot:', footerPath);

  console.log('\n--- 4. Testing Student Testimonials Section on Homepage ---');
  await page.goto('http://localhost:3000/#reviews', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  const reviewsPath = path.join(ARTIFACT_DIR, 'homepage_testimonials_verified.png');
  await page.screenshot({ path: reviewsPath, fullPage: false });
  console.log('Saved Homepage Testimonials screenshot:', reviewsPath);

  // Check the footer on homepage as well
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  const hpFooterPath = path.join(ARTIFACT_DIR, 'landing_footer_company_details.png');
  await page.screenshot({ path: hpFooterPath, fullPage: false });
  console.log('Saved Landing Footer screenshot:', hpFooterPath);

  await browser.close();
  console.log('\nAll phase screenshot evidence collected successfully!');
}

main().catch(err => {
  console.error('Error running capture script:', err);
  process.exit(1);
});
