const http = require('http');

// Helper to create a fake JWT payload
function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.`;
}

const adminToken = createToken({
  uid: 'admin_test_uid',
  email: 'admin@as.com',
  role: 'admin',
  admin: true,
  exp: Math.floor(Date.now() / 1000) + 3600
});

const studentToken = createToken({
  uid: 'student_test_uid',
  email: 'student@example.com',
  role: 'student',
  exp: Math.floor(Date.now() / 1000) + 3600
});

async function test(name, cookie) {
  const headers = cookie ? { 'Cookie': `__session=${cookie}` } : {};
  const res = await fetch('http://localhost:3000/dashboard/admin/users', {
    headers,
    redirect: 'manual'
  });
  console.log(`[${name}] Status: ${res.status}`);
  if (res.headers.get('location')) {
    console.log(`[${name}] Redirect Location: ${res.headers.get('location')}`);
  } else {
    const text = await res.text();
    console.log(`[${name}] Response length: ${text.length}`);
    if (text.includes('404')) {
      console.log(`[${name}] CONTAINS 404!`);
    } else if (text.includes('Total Registered Users')) {
      console.log(`[${name}] SUCCESS: Rendered Users Table!`);
    } else {
      console.log(`[${name}] Preview:`, text.slice(0, 300));
    }
  }
}

async function run() {
  await test('No Cookie', null);
  await test('Student Cookie', studentToken);
  await test('Admin Cookie', adminToken);
}

run();
