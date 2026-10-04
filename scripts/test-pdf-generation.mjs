/**
 * PDF Generation Smoke Test
 * ─────────────────────────
 * Tests Puppeteer generation directly with sample pathway data.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPdf() {
  console.log('📄 Testing Puppeteer Roadmap PDF generation...');

  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        .title { color: #690B1B; font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="title">Career Roadmap Studio — Smoke Test</div>
      <p>Testing deterministic pathway PDF generation engine.</p>
    </body>
  </html>`;

  const browser = await puppeteer.launch({
    headless: true,
    ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    }),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  const outPath = path.join(__dirname, '..', 'scratch', 'test_roadmap.pdf');
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outPath, pdfBuffer);
  console.log(`✅ PDF generated successfully: ${pdfBuffer.length} bytes written to ${outPath}`);
}

testPdf().catch(err => {
  console.error('❌ PDF generation failed:', err);
  process.exit(1);
});
