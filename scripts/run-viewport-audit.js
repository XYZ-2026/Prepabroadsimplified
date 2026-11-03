const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '../node_modules/puppeteer'));

const VIEWPORTS = [
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'tablet_portrait_768x1024', width: 768, height: 1024 },
  { name: 'tablet_portrait_820x1180', width: 820, height: 1180 },
  { name: 'tablet_portrait_834x1194', width: 834, height: 1194 },
  { name: 'tablet_landscape_1024x768', width: 1024, height: 768 },
  { name: 'tablet_landscape_1180x820', width: 1180, height: 820 },
  { name: 'tablet_landscape_1366x1024', width: 1366, height: 1024 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'desktop_1920x1080', width: 1920, height: 1080 },
];

const OUTPUT_DIR = path.resolve(__dirname, '../reference/audit');

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

async function runAudit() {
  ensureDir(OUTPUT_DIR);
  console.log('Output directory prepared:', OUTPUT_DIR);

  // 1. Check if server already running on port 3000
  let serverProcess = null;
  const isRunning = await new Promise((resolve) => {
    http.get('http://127.0.0.1:3000', (res) => resolve(true)).on('error', () => resolve(false));
  });

  if (!isRunning) {
    console.log('Starting Next.js dev server on http://127.0.0.1:3000...');
    serverProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
      shell: true,
    });

    serverProcess.stdout.on('data', (d) => {
      const msg = d.toString();
      if (msg.includes('Ready') || msg.includes('compiled') || msg.includes('localhost')) {
        console.log('[Next.js]', msg.trim());
      }
    });

    serverProcess.stderr.on('data', (d) => {
      // console.error('[Next.js err]', d.toString());
    });

    console.log('Waiting for Next.js dev server to be ready...');
    await waitForServer('http://127.0.0.1:3000');
    console.log('Next.js dev server is live!');
  } else {
    console.log('Next.js dev server is already live on http://127.0.0.1:3000');
  }

  // 2. Launch Puppeteer
  console.log('Launching Puppeteer (pipe: true)...');
  const browser = await puppeteer.launch({
    headless: true,
    pipe: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  const findings = [];

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n======================================================`);
      console.log(`Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`======================================================`);

      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 30000 });

      // Give GSAP / CSS a moment to render
      await new Promise((r) => setTimeout(r, 1000));

      // Capture Hero Viewport Screenshot
      const heroPath = path.join(OUTPUT_DIR, `hero_${vp.width}x${vp.height}.png`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 200));
      await page.screenshot({ path: heroPath });
      console.log(`  Saved: ${path.basename(heroPath)}`);

      // Inspect Hero & Face-safe overlap
      const heroMetrics = await page.evaluate(() => {
        const photoEl = document.querySelector('img[src*="02-group-cutout"]');
        const photoBox = photoEl ? photoEl.getBoundingClientRect() : null;
        const chips = Array.from(document.querySelectorAll('.hero-chip')).map((c) => {
          const r = c.getBoundingClientRect();
          const text = c.textContent.trim().replace(/\s+/g, ' ');
          let relX = 0, relY = 0;
          if (photoBox) {
            relX = ((r.left - photoBox.left) / photoBox.width) * 100;
            relY = ((r.top - photoBox.top) / photoBox.height) * 100;
          }
          return { text, r, relX, relY };
        });

        const pathLine = document.querySelector('.hero-path-line');
        const pathSvg = pathLine ? pathLine.closest('svg') : null;
        const wordEl = document.querySelector('.hero-stage-word');
        const wordBox = wordEl ? wordEl.getBoundingClientRect() : null;

        const navPills = document.querySelector('nav .hidden.lg\\:flex') || document.querySelector('nav .lg\\:flex');
        const navPillsBox = navPills ? navPills.getBoundingClientRect() : null;
        const logo = document.querySelector('nav a[href="/"]');
        const logoBox = logo ? logo.getBoundingClientRect() : null;

        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        return {
          hasHorizontalScroll,
          scrollWidth,
          innerWidth: window.innerWidth,
          photoBox,
          chips,
          hasPathLine: !!pathLine,
          wordBox,
          navPillsBox,
          logoBox,
        };
      });

      // Capture Grades Section Tabs
      const gradesSection = await page.$('#programs');
      if (gradesSection) {
        await page.evaluate(() => {
          const el = document.getElementById('programs');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
        await new Promise((r) => setTimeout(r, 500));

        // Tab 1 (Grades 7-8 / 7-9)
        const tab1 = await page.$('#grade-tab-g7-8');
        if (tab1) {
          await tab1.click();
          await new Promise((r) => setTimeout(r, 400));
          const tab1Path = path.join(OUTPUT_DIR, `grades_tab1_${vp.width}x${vp.height}.png`);
          await page.screenshot({ path: tab1Path });
          console.log(`  Saved: ${path.basename(tab1Path)}`);
        }

        // Tab 2 (Grades 9-10)
        const tab2 = await page.$('#grade-tab-g9-10');
        if (tab2) {
          await tab2.click();
          await new Promise((r) => setTimeout(r, 400));
          const tab2Path = path.join(OUTPUT_DIR, `grades_tab2_${vp.width}x${vp.height}.png`);
          await page.screenshot({ path: tab2Path });
          console.log(`  Saved: ${path.basename(tab2Path)}`);
        }

        // Tab 3 (Grades 11-12)
        const tab3 = await page.$('#grade-tab-g11-12');
        if (tab3) {
          await tab3.click();
          await new Promise((r) => setTimeout(r, 400));
          const tab3Path = path.join(OUTPUT_DIR, `grades_tab3_${vp.width}x${vp.height}.png`);
          await page.screenshot({ path: tab3Path });
          console.log(`  Saved: ${path.basename(tab3Path)}`);
        }
      }

      // Capture Consultation CTA
      await page.evaluate(() => {
        const cta = document.querySelector('section[aria-label*="Consultation"]');
        if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise((r) => setTimeout(r, 500));
      const ctaPath = path.join(OUTPUT_DIR, `cta_${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: ctaPath });
      console.log(`  Saved: ${path.basename(ctaPath)}`);

      // Inspect Consultation CTA and Pinned Section metrics
      const sectionMetrics = await page.evaluate(() => {
        const ctaSec = document.querySelector('section[aria-label*="Consultation"]');
        const ctaPanel = ctaSec ? ctaSec.querySelector('.rounded-\\[28px\\], .bg-\\[\\#1258DE\\]') : null;
        const ctaImg = ctaSec ? ctaSec.querySelector('img[src*="03-celebrate-cutout"]') : null;
        const ctaImgBox = ctaImg ? ctaImg.getBoundingClientRect() : null;
        const ctaPanelBox = ctaPanel ? ctaPanel.getBoundingClientRect() : null;

        const pinnedSec = document.getElementById('assessments');
        const pinnedStyleHeight = pinnedSec ? pinnedSec.style.height : null;
        const stickyEl = pinnedSec ? pinnedSec.querySelector('.sticky') : null;

        return {
          ctaPanelBox,
          ctaImgBox,
          pinnedStyleHeight,
          hasSticky: !!stickyEl,
        };
      });

      findings.push({
        viewport: vp,
        heroMetrics,
        sectionMetrics,
      });
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'audit_data.json'),
      JSON.stringify(findings, null, 2),
      'utf8'
    );
    console.log('\nAudit complete! Saved data to reference/audit/audit_data.json');
  } catch (err) {
    console.error('Audit execution error:', err);
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      console.log('Stopped dev server process.');
    }
  }
}

runAudit().catch(console.error);

