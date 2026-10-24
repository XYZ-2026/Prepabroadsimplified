const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71');

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return header + '.' + body + '.';
}

const adminToken = createToken({
  uid: 'admin_test_uid',
  email: 'admin@as.com',
  role: 'admin',
  admin: true,
  exp: Math.floor(Date.now() / 1000) + 3600
});

async function captureAdmin() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.setCookie({
    name: '__session',
    value: adminToken,
    domain: 'localhost',
    path: '/'
  });

  await page.goto('http://localhost:3000/dashboard/admin/users', { waitUntil: 'networkidle2' });
  const adminScreenPath = path.join(ARTIFACT_DIR, 'admin_users_resolved.png');
  await page.screenshot({ path: adminScreenPath, fullPage: false });
  console.log('Admin users resolved screenshot saved to:', adminScreenPath);

  await browser.close();
}

captureAdmin().catch(console.error);
