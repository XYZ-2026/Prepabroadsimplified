const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testPerformance() {
  const userDataDir = path.resolve('scratch', 'puppeteer_perf_' + Date.now());
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  
  // Emulate mobile device (Moto G4 / standard mid-tier mobile: 360x640)
  await page.setViewport({ width: 360, height: 640, isMobile: true, hasTouch: true });

  // Collect PerformanceObserver metrics (LCP, CLS, FCP)
  await page.evaluateOnNewDocument(() => {
    window.__perfMetrics = {
      lcp: null,
      fcp: null,
      cls: 0,
      lcpElement: null,
    };

    // Observe FCP
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.__perfMetrics.fcp = entry.startTime;
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });

    // Observe LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        window.__perfMetrics.lcp = lastEntry.startTime;
        window.__perfMetrics.lcpElement = lastEntry.element ? lastEntry.element.tagName : 'unknown';
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Observe CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perfMetrics.cls += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  });

  console.log('Navigating to http://127.0.0.1:3000 to measure Web Vitals...');
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a moment for LCP to finalize
  await new Promise((r) => setTimeout(r, 1500));

  const metrics = await page.evaluate(() => window.__perfMetrics);
  console.log('Performance Metrics:', JSON.stringify(metrics, null, 2));

  await browser.close();
}

testPerformance().catch((err) => {
  console.error('Perf test failed:', err);
  process.exit(1);
});

