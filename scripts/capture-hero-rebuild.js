const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../node_modules/puppeteer'));

const OUTPUT_DIR = path.resolve(__dirname, '../reference/audit/hero_rebuild');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function ping() {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
        } else {
          retry();
        }
      }).on('error', retry);
    }
    function retry() {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Timeout waiting for server at ${url}`));
      } else {
        setTimeout(ping, 500);
      }
    }
    ping();
  });
}

async function capture() {
  ensureDir(OUTPUT_DIR);

  let serverProcess = null;
  const isRunning = await new Promise((resolve) => {
    http.get('http://127.0.0.1:3000', () => resolve(true)).on('error', () => resolve(false));
  });

  if (!isRunning) {
    console.log('Starting dev server on http://127.0.0.1:3000...');
    serverProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
      shell: true,
    });
    await waitForServer('http://127.0.0.1:3000');
    console.log('Dev server ready!');
  } else {
    console.log('Dev server already running.');
  }

  const browser = await puppeteer.launch({
    headless: true,
    pipe: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const viewports = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '768x1024', width: 768, height: 1024 },
  ];

  const metricsReport = [];

  for (const vp of viewports) {
    console.log(`Auditing and capturing Hero for ${vp.name}...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait for GSAP sequence to complete (~2s)
    await new Promise((r) => setTimeout(r, 2200));

    // Capture screenshot
    const shotPath = path.join(OUTPUT_DIR, `hero_${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved: ${path.basename(shotPath)}`);

    // Measure metrics
    const data = await page.evaluate(() => {
      const heroSec = document.querySelector('section[aria-label*="Clarvo Hero"]');
      const photoEl = document.querySelector('img[src*="02-group-cutout"]');
      const photoBox = photoEl ? photoEl.getBoundingClientRect() : null;
      const wordEl = document.querySelector('.hero-stage-word');
      const wordBox = wordEl ? wordEl.getBoundingClientRect() : null;
      const chips = Array.from(document.querySelectorAll('.hero-chip')).map((c) => {
        const r = c.getBoundingClientRect();
        const text = c.textContent.trim().replace(/\s+/g, ' ');
        const isVisible = r.width > 0 && r.height > 0 && window.getComputedStyle(c).display !== 'none';
        let relX = 0, relY = 0;
        if (photoBox) {
          relX = ((r.left - photoBox.left) / photoBox.width) * 100;
          relY = ((r.top - photoBox.top) / photoBox.height) * 100;
        }
        return { text, isVisible, r, relX, relY };
      });

      const pathLine = document.querySelector('.hero-path-line');
      const svgElements = Array.from(heroSec ? heroSec.querySelectorAll('svg') : []);
      const hasSvgPathLine = !!pathLine;

      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      return {
        hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        photoBox,
        wordBox,
        chips,
        hasSvgPathLine,
      };
    });

    metricsReport.push({ viewport: vp, data });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'hero_metrics.json'),
    JSON.stringify(metricsReport, null, 2),
    'utf8'
  );

  await browser.close();
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  console.log('Hero rebuild capture complete! Metrics saved to reference/audit/hero_rebuild/hero_metrics.json');
}

capture().catch(console.error);

