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

  // 1. Catalogue Desktop View (1280x800)
  console.log('Capturing 1. Catalogue Desktop View...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/career-library', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const catPath = path.join(ARTIFACT_DIR, 'career_library_catalogue.png');
  await page.screenshot({ path: catPath, fullPage: false });
  console.log('Saved:', catPath);

  // 2. Filtered View (e.g., Click on Commerce & Finance)
  console.log('Capturing 2. Filtered Catalogue View...');
  // Type in search or click on Commerce pill
  await page.type('#careerLibraryRoot input[type="text"]', 'Finance');
  await new Promise(r => setTimeout(r, 500));
  const filterPath = path.join(ARTIFACT_DIR, 'career_library_filtered.png');
  await page.screenshot({ path: filterPath, fullPage: false });
  console.log('Saved:', filterPath);

  // 3. Career Detail View
  console.log('Capturing 3. Career Detail View (Computer Science Engineering)...');
  await page.goto('http://localhost:3000/career-library?career=cse', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const detailPath = path.join(ARTIFACT_DIR, 'career_library_detail.png');
  await page.screenshot({ path: detailPath, fullPage: false });
  console.log('Saved:', detailPath);

  // 4. Non-Engineering Career Detail View (Chartered Accountancy)
  console.log('Capturing 4. Non-Engineering Career Detail View (Chartered Accountancy)...');
  await page.goto('http://localhost:3000/career-library?career=ca', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const caDetailPath = path.join(ARTIFACT_DIR, 'career_library_detail_ca.png');
  await page.screenshot({ path: caDetailPath, fullPage: false });
  console.log('Saved:', caDetailPath);

  // 5. Mobile Layout View (375x812)
  console.log('Capturing 5. Mobile Layout View...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/career-library', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const mobilePath = path.join(ARTIFACT_DIR, 'career_library_mobile.png');
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log('Saved:', mobilePath);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
