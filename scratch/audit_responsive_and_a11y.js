const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const BREAKPOINTS = [
  { name: 'mobile_360', width: 360, height: 740 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'tablet_1024', width: 1024, height: 768 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'large_1920', width: 1920, height: 1080 },
];

async function runAudit() {
  console.log('Launching headless browser...');
  const userDataDir = path.resolve('scratch', 'puppeteer_profile_' + Date.now());
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const results = {
    breakpoints: [],
    headings: [],
    imagesWithoutAlt: [],
    reducedMotionChecked: false,
  };

  try {
    const url = 'http://127.0.0.1:3000';
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // 1. Audit headings hierarchy
    const headings = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return elements.map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: el.innerText.trim().substring(0, 60),
      }));
    });
    results.headings = headings;
    console.log(`Found ${headings.length} headings.`);

    // 2. Audit images without alt or with invalid alt
    const imageAudits = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map((img) => ({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt'),
        hasAlt: img.hasAttribute('alt'),
        width: img.clientWidth,
        height: img.clientHeight,
      }));
    });
    results.images = imageAudits;
    const missingAlt = imageAudits.filter((img) => !img.hasAlt);
    results.imagesWithoutAlt = missingAlt;
    console.log(`Images checked: ${imageAudits.length}, missing alt: ${missingAlt.length}`);

    // 3. Responsive tests across all 5 widths
    for (const bp of BREAKPOINTS) {
      console.log(`Testing viewport ${bp.name} (${bp.width}x${bp.height})...`);
      await page.setViewport({ width: bp.width, height: bp.height });
      await new Promise((r) => setTimeout(r, 600));

      const overflowData = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const hasHorizontalScroll = scrollWidth > docWidth + 1; // 1px threshold for subpixel

        // Find elements that overflow the viewport if any
        let overflowingElements = [];
        if (hasHorizontalScroll) {
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 2) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                className: el.className ? String(el.className).substring(0, 50) : '',
                right: rect.right,
                docWidth,
              });
              if (overflowingElements.length >= 5) break;
            }
          }
        }

        return {
          clientWidth: docWidth,
          scrollWidth: scrollWidth,
          hasHorizontalScroll,
          overflowingElements,
        };
      });

      console.log(`  -> clientWidth: ${overflowData.clientWidth}, scrollWidth: ${overflowData.scrollWidth}, overflow: ${overflowData.hasHorizontalScroll}`);
      
      const screenshotPath = path.join(SCREENSHOTS_DIR, `audit_${bp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      
      results.breakpoints.push({
        ...bp,
        ...overflowData,
        screenshot: screenshotPath,
      });
    }

    // 4. Test Reduced Motion emulation
    console.log('Testing prefers-reduced-motion...');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle2' });
    
    const reducedMotionState = await page.evaluate(() => {
      const heroWord = document.querySelector('.hero-stage-word');
      const heroCutout = document.querySelector('.hero-cutout');
      const stats = Array.from(document.querySelectorAll('#stats, section[aria-label*="Stats"]'));
      
      const wordOpacity = heroWord ? window.getComputedStyle(heroWord).opacity : null;
      const cutoutOpacity = heroCutout ? window.getComputedStyle(heroCutout).opacity : null;
      
      return {
        wordOpacity,
        cutoutOpacity,
      };
    });
    results.reducedMotion = reducedMotionState;
    console.log('Reduced motion check:', reducedMotionState);

    // Save full JSON report
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'audit_report.json'),
      JSON.stringify(results, null, 2)
    );
    console.log('Audit complete! Results saved.');
  } finally {
    await browser.close();
  }
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
