const puppeteer = require('puppeteer');

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

async function check() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Test 1: Visit without cookie
  console.log('--- Test 1: Visit without cookie ---');
  await page.goto('http://localhost:3000/dashboard/admin/users', { waitUntil: 'networkidle2' });
  console.log('Final URL:', page.url());
  let content = await page.content();
  console.log('Has 404?', content.includes('404'));
  console.log('Title:', await page.title());

  // Test 2: Visit with admin cookie
  console.log('--- Test 2: Visit with admin cookie ---');
  await page.setCookie({
    name: '__session',
    value: adminToken,
    domain: 'localhost',
    path: '/'
  });
  await page.goto('http://localhost:3000/dashboard/admin/users', { waitUntil: 'networkidle2' });
  console.log('Final URL:', page.url());
  content = await page.content();
  console.log('Has 404?', content.includes('404'));
  console.log('Title:', await page.title());
  console.log('Has "Total Registered Users"?', content.includes('Total Registered Users'));

  await browser.close();
}

check().catch(console.error);
