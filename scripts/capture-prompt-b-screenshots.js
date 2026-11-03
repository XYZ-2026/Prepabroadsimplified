const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../node_modules/puppeteer'));

const OUTPUT_DIR = path.resolve(__dirname, '../reference/audit/prompt_b');

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

  const testViewports = [
    { name: 'desktop_1440x900', width: 1440, height: 900 },
    { name: 'tablet_portrait_768x1024', width: 768, height: 1024 },
    { name: 'tablet_landscape_1024x768', width: 1024, height: 768 },
    { name: 'mobile_390x844', width: 390, height: 844 },
  ];

  for (const vp of testViewports) {
    console.log(`Capturing Prompt B components for ${vp.name}...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));

    // 1. Capture Bento Section
    await page.evaluate(() => {
      const bento = document.getElementById('services');
      if (bento) bento.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 400));
    const bentoPath = path.join(OUTPUT_DIR, `bento_${vp.name}.png`);
    await page.screenshot({ path: bentoPath });
    console.log(`Saved: ${path.basename(bentoPath)}`);

    // 2. Capture Grades Section - Tab 1 (Grades 7-8 / 7-9)
    await page.evaluate(() => {
      const el = document.getElementById('programs');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 400));

    const tab1 = await page.$('#grade-tab-g7-8');
    if (tab1) {
      await tab1.click();
      await new Promise((r) => setTimeout(r, 400));
      const tab1Path = path.join(OUTPUT_DIR, `grades_tab1_${vp.name}.png`);
      await page.screenshot({ path: tab1Path });
      console.log(`Saved: ${path.basename(tab1Path)}`);
    }

    // 3. Capture Grades Section - Tab 2 (Grades 9-10)
    const tab2 = await page.$('#grade-tab-g9-10');
    if (tab2) {
      await tab2.click();
      await new Promise((r) => setTimeout(r, 400));
      const tab2Path = path.join(OUTPUT_DIR, `grades_tab2_${vp.name}.png`);
      await page.screenshot({ path: tab2Path });
      console.log(`Saved: ${path.basename(tab2Path)}`);
    }

    // 4. Capture Grades Section - Tab 3 (Grades 11-12)
    const tab3 = await page.$('#grade-tab-g11-12');
    if (tab3) {
      await tab3.click();
      await new Promise((r) => setTimeout(r, 400));
      const tab3Path = path.join(OUTPUT_DIR, `grades_tab3_${vp.name}.png`);
      await page.screenshot({ path: tab3Path });
      console.log(`Saved: ${path.basename(tab3Path)}`);
    }
  }

  await browser.close();
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  console.log('Prompt B verification screenshots captured successfully!');
}

capture().catch(console.error);

