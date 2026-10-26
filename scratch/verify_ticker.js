const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait 2 seconds for animations to settle
  await new Promise(r => setTimeout(r, 2000));

  // Find the ticker section
  const tickerEl = await page.$('section[aria-label="Counselled students from India\'s top schools"]');
  if (tickerEl) {
    await tickerEl.screenshot({ path: 'scratch/new_ticker_desktop.png' });
    console.log('Saved scratch/new_ticker_desktop.png');
  }

  // Also capture the hero + ticker together
  await page.screenshot({ path: 'scratch/new_hero_and_ticker.png', clip: { x: 0, y: 0, width: 1440, height: 950 } });
  console.log('Saved scratch/new_hero_and_ticker.png');

  // Mobile viewport test
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const mobileTicker = await page.$('section[aria-label="Counselled students from India\'s top schools"]');
  if (mobileTicker) {
    await mobileTicker.screenshot({ path: 'scratch/new_ticker_mobile.png' });
    console.log('Saved scratch/new_ticker_mobile.png');
  }

  console.log('Console Errors detected:', consoleErrors);

  await browser.close();
})();
