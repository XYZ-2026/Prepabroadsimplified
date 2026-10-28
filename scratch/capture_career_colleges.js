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
  page.setDefaultNavigationTimeout(60000);
  await page.setViewport({ width: 1440, height: 1000 });

  // 1. Test CSE (Engineering) - Top portion with Brief info, Entrance Route & Top Indian Colleges
  console.log('Capturing 1: CSE Career - Indian Colleges & Entrance Exam...');
  await page.goto('http://localhost:3000/career-library?career=cse', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  // Scroll to Indian Colleges section
  await page.evaluate(() => {
    const el = document.querySelector('[class*="collegesSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  const cseTopPath = path.join(ARTIFACT_DIR, 'career_cse_indian_colleges.png');
  await page.screenshot({ path: cseTopPath, fullPage: false });
  console.log('Saved:', cseTopPath);

  // Scroll to Study Abroad section at the bottom
  console.log('Capturing 2: CSE Career - Study Abroad Destinations Card Layout...');
  await page.evaluate(() => {
    const el = document.querySelector('[class*="abroadSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  const cseAbroadPath = path.join(ARTIFACT_DIR, 'career_cse_study_abroad.png');
  await page.screenshot({ path: cseAbroadPath, fullPage: false });
  console.log('Saved:', cseAbroadPath);

  // 2. Test CA (Commerce)
  console.log('Capturing 3: Chartered Accountancy - Entrance Route & Indian Colleges...');
  await page.goto('http://localhost:3000/career-library?career=ca', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const el = document.querySelector('[class*="entranceExamSection"]') || document.querySelector('[class*="collegesSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  const caTopPath = path.join(ARTIFACT_DIR, 'career_ca_indian_colleges.png');
  await page.screenshot({ path: caTopPath, fullPage: false });
  console.log('Saved:', caTopPath);

  const caAbroadPath = path.join(ARTIFACT_DIR, 'career_ca_study_abroad.png');
  await page.evaluate(() => {
    const el = document.querySelector('[class*="abroadSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: caAbroadPath, fullPage: false });
  console.log('Saved:', caAbroadPath);

  // 3. Test Commercial Pilot (New Cluster: Aviation & Maritime)
  console.log('Capturing 4: Commercial Pilot - Aviation & Maritime Profile...');
  await page.goto('http://localhost:3000/career-library?career=commercial-pilot', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = document.querySelector('[class*="entranceExamSection"]') || document.querySelector('[class*="collegesSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  const pilotTopPath = path.join(ARTIFACT_DIR, 'career_pilot_indian_colleges.png');
  await page.screenshot({ path: pilotTopPath, fullPage: false });
  console.log('Saved:', pilotTopPath);

  const pilotAbroadPath = path.join(ARTIFACT_DIR, 'career_pilot_study_abroad.png');
  await page.evaluate(() => {
    const el = document.querySelector('[class*="abroadSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: pilotAbroadPath, fullPage: false });
  console.log('Saved:', pilotAbroadPath);

  // 4. Mobile View (375x812)
  console.log('Capturing 5: Mobile View of Study Abroad & Colleges...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/career-library?career=ca', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = document.querySelector('[class*="abroadSectionCard"]');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  const mobileAbroadPath = path.join(ARTIFACT_DIR, 'career_mobile_study_abroad.png');
  await page.screenshot({ path: mobileAbroadPath, fullPage: false });
  console.log('Saved:', mobileAbroadPath);

  await browser.close();
  console.log('All verification captures completed successfully!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
