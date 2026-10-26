import puppeteer from 'puppeteer';
import path from 'path';

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });
  
  const auditPath = path.resolve('scratch/school_logos_audit.html');
  await page.goto('file:///' + auditPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.screenshot({ path: 'scratch/school_logos_audit.png', fullPage: true });
  await browser.close();
  console.log('Saved scratch/school_logos_audit.png');
}

main().catch(console.error);
