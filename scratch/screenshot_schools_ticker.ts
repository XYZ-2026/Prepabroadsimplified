import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  
  // 1. Desktop view
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  
  // Wait a moment for marquee animation to tick
  await new Promise(r => setTimeout(r, 1500));
  
  await page.screenshot({ path: 'scratch/homepage_desktop_schools.png', clip: { x: 0, y: 500, width: 1440, height: 400 } });
  console.log('Saved scratch/homepage_desktop_schools.png');

  // Full top viewport
  await page.screenshot({ path: 'scratch/homepage_hero_and_schools.png', clip: { x: 0, y: 0, width: 1440, height: 950 } });
  console.log('Saved scratch/homepage_hero_and_schools.png');

  // 2. Mobile view
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await mobilePage.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 1500));

  await mobilePage.screenshot({ path: 'scratch/homepage_mobile_schools.png', clip: { x: 0, y: 550, width: 390, height: 350 } });
  console.log('Saved scratch/homepage_mobile_schools.png');

  await browser.close();
  console.log('Done screenshots.');
}

main().catch(console.error);
