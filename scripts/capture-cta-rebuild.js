const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../node_modules/puppeteer'));

const OUTPUT_DIR = path.resolve(__dirname, '../reference/audit/cta_rebuild');

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
    { name: '390x844', width: 390, height: 844 },
  ];

  const metricsReport = [];

  for (const vp of viewports) {
    console.log(`Auditing and capturing CTA for ${vp.name}...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 30000 });

    // Scroll cleanly so entire CTA is in view
    await page.evaluate(async () => {
      const cta = document.querySelector('section[aria-label*="Consultation"]');
      if (cta) {
        const y = cta.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: y, behavior: 'instant' });
      }

      // Ensure celebrate cutout images are fully loaded
      const imgs = Array.from(document.querySelectorAll('img[src*="03-celebrate-cutout"]'));
      await Promise.all(imgs.map((img) => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 3000);
        });
      }));
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture screenshot
    const shotPath = path.join(OUTPUT_DIR, `cta_${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved: ${path.basename(shotPath)}`);

    // Measure metrics
    const data = await page.evaluate(() => {
      const ctaSec = document.querySelector('section[aria-label*="Consultation"]');
      const panel = ctaSec ? ctaSec.querySelector('.bg-\\[\\#1258DE\\]') : null;
      const panelBox = panel ? panel.getBoundingClientRect() : null;

      // Find visible celebrate cutout image
      const imgs = Array.from(document.querySelectorAll('img[src*="03-celebrate-cutout"]'));
      const visibleImg = imgs.find((img) => {
        const r = img.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(img).display !== 'none';
      });
      const imgBox = visibleImg ? visibleImg.getBoundingClientRect() : null;

      const headline = ctaSec ? ctaSec.querySelector('h2') : null;
      const headlineText = headline ? headline.textContent.trim() : '';

      let photoRatioOfPanel = 0;
      let photoHeightRatio = 0;
      let bottomDiff = 0;
      let breakoutPx = 0;

      if (panelBox && imgBox) {
        photoRatioOfPanel = (imgBox.width / panelBox.width) * 100;
        photoHeightRatio = (imgBox.height / panelBox.height) * 100;
        bottomDiff = Math.abs(imgBox.bottom - panelBox.bottom);
        breakoutPx = Math.max(0, panelBox.top - imgBox.top);
      }

      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      return {
        hasHorizontalScroll,
        panelBox: panelBox ? {
          width: panelBox.width,
          height: panelBox.height,
          top: panelBox.top,
          bottom: panelBox.bottom,
        } : null,
        imgBox: imgBox ? {
          width: imgBox.width,
          height: imgBox.height,
          top: imgBox.top,
          bottom: imgBox.bottom,
        } : null,
        headlineText,
        photoRatioOfPanel,
        photoHeightRatio,
        bottomDiff,
        breakoutPx,
      };
    });

    metricsReport.push({ viewport: vp, data });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'cta_metrics.json'),
    JSON.stringify(metricsReport, null, 2),
    'utf8'
  );

  await browser.close();
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  console.log('CTA capture complete! Metrics saved to reference/audit/cta_rebuild/cta_metrics.json');
}

capture().catch(console.error);
