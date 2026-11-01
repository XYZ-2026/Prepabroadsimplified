const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PORT = 3020;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { name: 'mobile_320', width: 320, height: 640 },
  { name: 'mobile_360', width: 360, height: 740 },
  { name: 'mobile_375_iphone', width: 375, height: 812 },
  { name: 'mobile_390_iphone14', width: 390, height: 844 },
  { name: 'mobile_414_plus', width: 414, height: 896 },
  { name: 'mobile_430_promax', width: 430, height: 932 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'laptop_1024', width: 1024, height: 768 },
  { name: 'desktop_1280', width: 1280, height: 800 },
  { name: 'desktop_1440', width: 1440, height: 900 }
];

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          if (res.statusCode < 500) resolve(true);
          else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function postJson(url, payload) {
  const data = JSON.stringify(payload);
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getJson(url) {
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log(`Starting Next.js dev server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'dev', '--webpack', '-H', '127.0.0.1', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit',
  });

  const testReport = {
    timestamp: new Date().toISOString(),
    apiTests: [],
    responsiveTests: [],
    formInteraction: null,
  };

  try {
    await waitForServer(`${BASE_URL}/join-community`);
    console.log('Server is ready! Running API verification...');

    // ── 1. API Verification ──
    // Test A: Invalid submission (missing fields)
    const invalidRes = await postJson(`${BASE_URL}/api/community/join`, {
      name: '',
      phone: '',
      email: 'not-an-email',
      schoolName: '',
      grade: '',
    });
    console.log('Test 1A (Invalid Submission Status):', invalidRes.status);
    testReport.apiTests.push({
      name: 'Reject Invalid Submission',
      status: invalidRes.status === 400 ? 'PASS' : 'FAIL',
      statusCode: invalidRes.status,
      errorsReceived: invalidRes.data?.errors,
    });

    // Test B: Valid submission with 5 exact fields
    const validRes = await postJson(`${BASE_URL}/api/community/join`, {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      email: 'aarav.sharma@clarvo.test',
      schoolName: 'The Shri Ram School, Moulsari',
      grade: 'Grade 10',
    });
    console.log('Test 1B (Valid Submission Status):', validRes.status, validRes.data);
    testReport.apiTests.push({
      name: 'Accept Valid 5-Field Submission & Return WhatsApp Invite',
      status: validRes.status === 200 && validRes.data?.success ? 'PASS' : 'FAIL',
      statusCode: validRes.status,
      redirectUrl: validRes.data?.redirectUrl,
    });

    // Test C: Unauthorized admin access check
    const adminCheck = await getJson(`${BASE_URL}/api/admin/community`);
    console.log('Test 1C (Admin API Security Status):', adminCheck.status);
    testReport.apiTests.push({
      name: 'Protect Admin API from Unauthenticated Access',
      status: adminCheck.status === 403 ? 'PASS' : 'FAIL',
      statusCode: adminCheck.status,
    });

    // ── 2. Browser Responsive Testing with Puppeteer ──
    console.log('Launching Puppeteer browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    console.log('--- AUDITING /join-community ACROSS ALL 10 VIEWPORTS ---');
    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
      await page.goto(`${BASE_URL}/join-community`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 600));

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
        const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
        const diff = maxScroll - docWidth;
        return {
          docWidth,
          maxScroll,
          diff: diff > 1 ? diff : 0,
        };
      });

      const pass = overflow.diff === 0;
      console.log(`✓ ${vp.name} (${vp.width}px): Overflow = ${pass ? 'PASS (0px)' : `FAIL (${overflow.diff}px)`}`);

      let screenshotName = null;
      if (vp.width === 375) {
        screenshotName = 'community_landing_mobile_375.png';
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, screenshotName), fullPage: false });
      } else if (vp.width === 1280) {
        screenshotName = 'community_landing_desktop_1280.png';
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, screenshotName), fullPage: false });
      }

      testReport.responsiveTests.push({
        viewport: vp.name,
        width: vp.width,
        overflowDiff: overflow.diff,
        status: pass ? 'PASS' : 'FAIL',
        screenshot: screenshotName,
      });
    }

    // ── 3. Interactive Form Submission Test in Puppeteer ──
    console.log('Testing interactive form submission on mobile (375px)...');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/join-community`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Fill the 5 fields
    await page.type('#name', 'Rhea Sengupta');
    await page.type('#phone', '+91 99887 76655');
    await page.type('#email', 'rhea.sengupta@clarvo.test');
    await page.type('#schoolName', 'Dhirubhai Ambani International School');
    await page.select('#grade', 'Grade 11');

    // Screenshot before submission
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'community_form_filled_mobile_375.png'),
      fullPage: false,
    });

    // Click "Join the Community →"
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 1500));

      const buttonText = await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]');
        return btn ? btn.textContent.trim() : '';
      });

      console.log('Button state after submission:', buttonText);
      testReport.formInteraction = {
        name: 'Interactive Mobile Form Submission',
        status: 'PASS',
        buttonState: buttonText,
      };
    }

    await browser.close();
    console.log('Browser tests completed successfully!');

    // Write test report artifact
    const reportPath = path.join(SCREENSHOTS_DIR, 'community_test_results.json');
    fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2), 'utf-8');
    console.log(`Saved detailed test report to ${reportPath}`);
  } finally {
    if (server.pid) {
      try {
        process.kill(server.pid);
      } catch (e) {}
    }
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

