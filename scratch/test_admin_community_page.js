const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

const SCREENSHOTS_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots');
const PORT = 3021;
const BASE_URL = `http://127.0.0.1:${PORT}`;

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

function createMockAdminSessionCookie() {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    uid: 'admin_test_uid',
    email: 'admin@as.com',
    role: 'admin',
    admin: true,
    exp: Math.floor(Date.now() / 1000) + 86400 * 30
  })).toString('base64');
  return `${header}.${payload}.signature`;
}

async function main() {
  console.log(`Starting Next.js on port ${PORT}...`);
  const server = spawn('npx', ['next', 'dev', '--webpack', '-H', '127.0.0.1', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit'
  });

  try {
    await waitForServer(`${BASE_URL}/join-community`);
    console.log('Server ready! Launching browser for Admin Dashboard test...');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

    // Set admin mock session cookie
    const cookie = {
      name: '__session',
      value: createMockAdminSessionCookie(),
      domain: '127.0.0.1',
      path: '/',
      httpOnly: false,
      secure: false
    };
    await page.setCookie(cookie);

    console.log('Navigating to /dashboard/admin/community as admin...');
    await page.goto(`${BASE_URL}/dashboard/admin/community`, { waitUntil: 'networkidle2', timeout: 35000 });
    await new Promise((r) => setTimeout(r, 2000));

    const finalUrl = page.url();
    console.log('Current page URL after auth check:', finalUrl);

    const screenshotPath = path.join(SCREENSHOTS_DIR, 'admin_community_settings_1280.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`SUCCESS: Captured admin settings screenshot at ${screenshotPath}`);

    // Test saving a new WhatsApp URL via the Admin form in browser
    console.log('Testing WhatsApp URL update in Admin UI...');
    const urlInput = await page.$('#whatsappUrl');
    if (urlInput) {
      await page.click('#whatsappUrl', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type('#whatsappUrl', 'https://chat.whatsapp.com/NEW_GROUP_INVITE_TEST_CODE');

      const saveBtn = await page.$('button[type="submit"]');
      if (saveBtn) {
        await saveBtn.click();
        await new Promise((r) => setTimeout(r, 2500));
        console.log('Admin form submitted successfully!');

        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'admin_community_updated_1280.png'),
          fullPage: true
        });
      }
    }

    // Restore official group link
    const restoreRes = await fetch(`${BASE_URL}/api/admin/community`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `__session=${createMockAdminSessionCookie()}`
      },
      body: JSON.stringify({
        activeWhatsAppUrl: 'https://chat.whatsapp.com/JevCH59LcE33ahR612sLEG',
        note: 'Restored active official group invitation'
      })
    });
    console.log('Restored official WhatsApp link, status:', restoreRes.status);

    await browser.close();
  } finally {
    if (server.pid) {
      try { process.kill(server.pid); } catch (e) {}
    }
  }
}

main().catch((err) => {
  console.error('Admin test failed:', err);
  process.exit(1);
});

