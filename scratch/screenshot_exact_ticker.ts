import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  
  const el = await page.$('section[aria-label="Counselled students from India\'s top schools"]');
  if (el) {
    await el.screenshot({ path: 'scratch/schools_ticker_mobile_exact.png' });
    console.log('Saved scratch/schools_ticker_mobile_exact.png');
  } else {
    console.log('Element not found');
  }

  // Also desktop exact
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  if (el) {
    await el.screenshot({ path: 'scratch/schools_ticker_desktop_exact.png' });
    console.log('Saved scratch/schools_ticker_desktop_exact.png');
  }

  await browser.close();
}

main().catch(console.error);
