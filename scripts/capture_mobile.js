const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/sample-report', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Full mobile screen
  await page.screenshot({ path: 'C:/Users/Agam/.gemini/antigravity-ide/brain/485fd640-cd0e-4724-9338-2ea69ac0c3b0/mobile_report_viewer_full.png' });
  console.log('Saved mobile_report_viewer_full.png');

  // 2. Toolbar
  const tb = await page.$('.report-viewer-shell > div:first-child');
  if (tb) {
    await tb.screenshot({ path: 'C:/Users/Agam/.gemini/antigravity-ide/brain/485fd640-cd0e-4724-9338-2ea69ac0c3b0/mobile_report_toolbar.png' });
    console.log('Saved mobile_report_toolbar.png');
  }

  // 3. Iframe first page
  const iframes = page.frames();
  const f = iframes.find(frame => frame.url() === 'about:srcdoc');
  if (f) {
    const p1 = await f.$('.as-report-page');
    if (p1) {
      await p1.screenshot({ path: 'C:/Users/Agam/.gemini/antigravity-ide/brain/485fd640-cd0e-4724-9338-2ea69ac0c3b0/mobile_report_page1.png' });
      console.log('Saved mobile_report_page1.png');
    }
  }

  // 4. Test clicking Exec (15P) mode
  const execBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.innerText.includes('Exec (15P)'));
  });
  if (execBtn) {
    await execBtn.click();
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: 'C:/Users/Agam/.gemini/antigravity-ide/brain/485fd640-cd0e-4724-9338-2ea69ac0c3b0/mobile_report_exec_mode.png' });
    console.log('Saved mobile_report_exec_mode.png');
  }

  // 5. Test clicking Sections drawer
  const sectionsBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.innerText.includes('Sections'));
  });
  if (sectionsBtn) {
    await sectionsBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'C:/Users/Agam/.gemini/antigravity-ide/brain/485fd640-cd0e-4724-9338-2ea69ac0c3b0/mobile_report_sections_drawer.png' });
    console.log('Saved mobile_report_sections_drawer.png');
  }

  await browser.close();
  console.log('All mobile QA screenshots captured successfully!');
})().catch(e => console.error(e));
