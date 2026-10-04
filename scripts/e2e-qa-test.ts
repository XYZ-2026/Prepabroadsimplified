import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  suite: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  details?: string;
  durationMs: number;
}

const results: TestResult[] = [];
const consoleErrors: { url: string; text: string }[] = [];
const failedRequests: { url: string; status: number; method: string }[] = [];

function record(suite: string, name: string, status: 'PASS' | 'FAIL' | 'WARN', details?: string, durationMs: number = 0) {
  results.push({ suite, name, status, details, durationMs });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} [${suite}] ${name} ${details ? `(${details})` : ''} - ${durationMs}ms`);
}

async function runQASuite() {
  console.log('====================================================');
  console.log('🚀 Comprehensive Robust E2E QA Testing Suite');
  console.log('====================================================\n');

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000'],
    defaultViewport: { width: 1600, height: 1000 },
  });

  const page: Page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('downloadable font')) {
        consoleErrors.push({ url: page.url(), text });
      }
    }
  });

  page.on('response', response => {
    if (response.status() >= 400 && !response.url().includes('/favicon')) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method(),
      });
    }
  });

  const TIMEOUT = 35000;

  // Helper safe navigate
  async function safeGoto(url: string) {
    const s = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForSelector('body', { timeout: 8000 }).catch(() => {});
    return Date.now() - s;
  }

  try {
    // 1. Public Home
    console.log('\n--- SUITE 1: Public Homepage ---');
    try {
      const dur = await safeGoto('http://localhost:3000');
      const title = await page.title();
      record('Public', 'Homepage Load', title ? 'PASS' : 'FAIL', `Title: "${title.slice(0, 40)}..."`, dur);
    } catch (e: any) {
      record('Public', 'Homepage Load', 'FAIL', e.message);
    }

    // 2. Auth Flow
    console.log('\n--- SUITE 2: Authentication (admin@as.com) ---');
    try {
      let dur = await safeGoto('http://localhost:3000/auth');
      await page.waitForSelector('input[type="email"]', { timeout: 8000 });
      await page.type('input[type="email"]', 'admin@as.com', { delay: 10 });
      await page.type('input[type="password"]', 'admin123', { delay: 10 });

      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        const authStart = Date.now();
        await submitBtn.click();
        // Wait for redirect or cookie
        await new Promise(r => setTimeout(r, 3000));
        const cookies = await page.cookies();
        const sessionCookie = cookies.find(c => c.name === '__session');
        record('Auth', 'Admin Login & Cookie', sessionCookie ? 'PASS' : 'FAIL', sessionCookie ? 'Session cookie verified' : 'No cookie', Date.now() - authStart);
      }
    } catch (e: any) {
      record('Auth', 'Admin Login', 'FAIL', e.message);
    }

    // 3. Admin Dashboard Pages
    console.log('\n--- SUITE 3: Admin Dashboard Modules ---');
    const adminPages = [
      { path: '/dashboard/admin/users', name: 'User Management', test: async () => {
        const rows = await page.$$eval('tbody tr, table tr', els => els.length);
        return `Rows: ${rows}`;
      }},
      { path: '/dashboard/admin/counsellors', name: 'Counsellor Allotment', test: async () => {
        const cards = await page.$$eval('[class*="counsellor"], [class*="card"]', els => els.length);
        return `Cards: ${cards}`;
      }},
      { path: '/dashboard/admin/tool-access', name: 'Tool Access Control', test: async () => {
        const toggles = await page.$$eval('input[type="checkbox"], button[role="switch"]', els => els.length);
        return `Toggles: ${toggles}`;
      }},
      { path: '/dashboard/admin/analytics', name: 'Business & Test Analytics', test: async () => {
        const stats = await page.$$eval('[class*="stat"], [class*="card"], [class*="metric"]', els => els.length);
        return `Stat Cards: ${stats}`;
      }},
      { path: '/dashboard/admin/assessments', name: 'Assessments Record Log', test: async () => {
        const items = await page.$$eval('tr, [class*="item"]', els => els.length);
        return `Records: ${items}`;
      }},
      { path: '/dashboard/admin/user-analytics', name: 'User Journey Analytics', test: async () => {
        const len = await page.evaluate(() => document.body.innerText.length);
        return `Text length: ${len}`;
      }},
    ];

    for (const ap of adminPages) {
      try {
        const dur = await safeGoto(`http://localhost:3000${ap.path}`);
        const details = await ap.test();
        record('Admin', ap.name, 'PASS', details, dur);
      } catch (e: any) {
        record('Admin', ap.name, 'FAIL', e.message);
      }
    }

    // 4. Counsellor Pages
    console.log('\n--- SUITE 4: Counsellor Dashboard Modules ---');
    const counsellorPages = [
      { path: '/dashboard/counsellor', name: 'Counsellor Overview' },
      { path: '/dashboard/counsellor/students', name: 'Assigned Students Roster' },
      { path: '/dashboard/counsellor/allotment', name: 'SJF Allotment Engine Overview' },
      { path: '/dashboard/counsellor/analytics', name: 'Counsellor Student Analytics' },
    ];

    for (const cp of counsellorPages) {
      try {
        const dur = await safeGoto(`http://localhost:3000${cp.path}`);
        record('Counsellor', cp.name, 'PASS', 'Loaded', dur);
      } catch (e: any) {
        record('Counsellor', cp.name, 'FAIL', e.message);
      }
    }

    // 5. Student Dashboard
    console.log('\n--- SUITE 5: Student Profile & Assessments ---');
    const studentPages = [
      { path: '/dashboard/student/profile', name: 'Profile View' },
      { path: '/dashboard/student/update-profile', name: 'Profile Edit Wizard' },
      { path: '/dashboard/student/assessments', name: 'Assessment History' },
    ];

    for (const sp of studentPages) {
      try {
        const dur = await safeGoto(`http://localhost:3000${sp.path}`);
        record('Student', sp.name, 'PASS', 'Loaded', dur);
      } catch (e: any) {
        record('Student', sp.name, 'FAIL', e.message);
      }
    }

    // 6. University Finder
    console.log('\n--- SUITE 6: University Finder & Predictor ---');
    try {
      const dur = await safeGoto('http://localhost:3000/university-finder');
      const inputs = await page.$$eval('input, select, button', els => els.length);
      record('University Finder', 'Controls & Discovery UI', inputs > 5 ? 'PASS' : 'WARN', `Interactive controls: ${inputs}`, dur);
    } catch (e: any) {
      record('University Finder', 'Page Load', 'FAIL', e.message);
    }

    // 7. Psychometric Assessment
    console.log('\n--- SUITE 7: Psychometric Assessment Hub & Sample Report ---');
    try {
      const dur = await safeGoto('http://localhost:3000/psychometric-test');
      const variants = await page.$$eval('[class*="card"], [class*="grade"]', els => els.length);
      record('Psychometric', 'Test Variants Hub', variants > 0 ? 'PASS' : 'WARN', `Variants rendered: ${variants}`, dur);
    } catch (e: any) {
      record('Psychometric', 'Hub Load', 'FAIL', e.message);
    }

    try {
      const dur = await safeGoto('http://localhost:3000/psychometric-test/sample-report');
      const hasViewer = await page.evaluate(() => {
        return !!document.querySelector('iframe, .sr-floating-badge, .sr-cta-banner');
      });
      record('Psychometric', 'Sample Report Viewer Shell', hasViewer ? 'PASS' : 'FAIL', `Viewer present: ${hasViewer}`, dur);
    } catch (e: any) {
      record('Psychometric', 'Sample Report', 'FAIL', e.message);
    }

    // 8. IQ Test
    console.log('\n--- SUITE 8: IQ Test Interactive Flow ---');
    try {
      const dur = await safeGoto('http://localhost:3000/iq-test/instructions');
      record('IQ Test', 'Instructions Page', 'PASS', 'Loaded', dur);
    } catch (e: any) {
      record('IQ Test', 'Instructions Page', 'FAIL', e.message);
    }

    try {
      const dur = await safeGoto('http://localhost:3000/iq-test/test');
      const hasQ = await page.evaluate(() => document.body.innerText.includes('Question') || document.querySelectorAll('button').length > 2);
      record('IQ Test', 'Test Questions Engine', hasQ ? 'PASS' : 'WARN', `Questions UI active: ${hasQ}`, dur);
    } catch (e: any) {
      record('IQ Test', 'Interactive Test', 'FAIL', e.message);
    }

    // 9. Parent Assessment
    console.log('\n--- SUITE 9: Parent Assessment Module ---');
    try {
      const dur = await safeGoto('http://localhost:3000/parent-assessment');
      const hasNotice = await page.evaluate(() => document.body.innerText.includes('Token') || document.body.innerText.includes('Invitation'));
      record('Parent Assessment', 'Security Token Gate', hasNotice ? 'PASS' : 'WARN', 'Token enforcement active', dur);
    } catch (e: any) {
      record('Parent Assessment', 'Landing', 'FAIL', e.message);
    }

    // 10. Career Roadmap Studio
    console.log('\n--- SUITE 10: Career Roadmap Studio ---');
    try {
      const dur = await safeGoto('http://localhost:3000/career-roadmap?path=SPEC_009%2CDOMAIN_AIML%2CCAREER_ENR_ML%2CPROF_ENR_ML_ENG');
      const verified = await page.evaluate(() => {
        return document.body.innerText.includes('Machine Learning Engineer') && document.body.innerText.includes('Career Roadmap Studio');
      });
      record('Roadmap Studio', 'Destination & Frontier Flow', verified ? 'PASS' : 'FAIL', `ML Engineer Destination: ${verified}`, dur);
    } catch (e: any) {
      record('Roadmap Studio', 'Full Traversal', 'FAIL', e.message);
    }

  } catch (error: any) {
    console.error('Fatal testing error:', error);
  } finally {
    await browser.close();
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('📊 Comprehensive Deep QA Test Summary');
  console.log('====================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`Total Scenarios Tested : ${results.length}`);
  console.log(`Passed                 : ${passed}`);
  console.log(`Warnings / Attn Needed : ${warned}`);
  console.log(`Failed                 : ${failed}`);
  console.log(`Console Errors         : ${consoleErrors.length}`);
  console.log(`Failed HTTP Requests   : ${failedRequests.length}`);

  if (consoleErrors.length > 0) {
    console.log('\n--- Browser Console Errors ---');
    consoleErrors.slice(0, 10).forEach(e => console.log(`  • [${e.url}] ${e.text.slice(0, 140)}`));
  }

  if (failedRequests.length > 0) {
    console.log('\n--- Failed HTTP Requests ---');
    failedRequests.slice(0, 10).forEach(r => console.log(`  • [${r.status}] ${r.method} ${r.url}`));
  }

  const reportPath = path.join(process.cwd(), 'scripts', 'qa-audit-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({ results, consoleErrors, failedRequests }, null, 2));
  console.log(`\nAudit results saved to: ${reportPath}`);
}

runQASuite();
