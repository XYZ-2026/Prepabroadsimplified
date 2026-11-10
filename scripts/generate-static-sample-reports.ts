import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import {
  SAMPLE_STUDENT_79,
  SAMPLE_STUDENT_10,
  SAMPLE_STUDENT_12,
  SAMPLE_SCORES,
  SAMPLE_PERSONALIZATION,
  SAMPLE_COMPARISON,
  SAMPLE_PARENT_PROFILE,
} from '../src/config/sample-report-data.config';
import { adaptReportData } from '../src/app/(main)/psychometric-test/report-engine/adapters';
import { buildUniversalExecutiveHTMLReport } from '../src/app/(main)/psychometric-test/class10_html_report_builder';

async function generateSampleReports() {
  const outputDir = path.resolve(process.cwd(), 'public', 'sample-reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reports = [
    {
      id: 'grades-7-9',
      student: SAMPLE_STUDENT_79,
      variant: 'junior' as const,
      pdfName: 'sample-report-grades-7-9.pdf',
      coverName: 'cover-grades-7-9.png',
      label: 'Grades 7–9 (Junior Diagnostic Report)',
    },
    {
      id: 'grade-10',
      student: SAMPLE_STUDENT_10,
      variant: 'grade10' as const,
      pdfName: 'sample-report-grade-10.pdf',
      coverName: 'cover-grade-10.png',
      label: 'Grade 10 (Secondary Stream Selection Report)',
    },
    {
      id: 'grades-11-12',
      student: SAMPLE_STUDENT_12,
      variant: 'senior' as const,
      pdfName: 'sample-report-grades-11-12.pdf',
      coverName: 'cover-grades-11-12.png',
      label: 'Grades 11–12 (Senior University & Career Fitment Report)',
    },
  ];

  const tempUserDataDir = path.resolve(process.cwd(), 'scratch', `puppeteer_sample_profile_${Date.now()}`);
  if (!fs.existsSync(tempUserDataDir)) {
    fs.mkdirSync(tempUserDataDir, { recursive: true });
  }

  console.log('🚀 Launching Puppeteer browser instance...');
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: tempUserDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--disable-web-security',
      '--allow-file-access-from-files',
    ],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(180000);
  page.setDefaultNavigationTimeout(180000);
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  for (const report of reports) {
    console.log(`\n📄 Generating ${report.label}...`);
    const adaptedData = adaptReportData(
      report.student,
      SAMPLE_SCORES,
      SAMPLE_PERSONALIZATION,
      SAMPLE_COMPARISON,
      SAMPLE_PARENT_PROFILE,
      report.variant
    );

    const html = buildUniversalExecutiveHTMLReport(adaptedData);
    console.log(`  HTML built: ${html.length.toLocaleString()} characters.`);

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluateHandle('document.fonts.ready');

    // 1. Generate full PDF
    const pdfPath = path.join(outputDir, report.pdfName);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`  ✅ PDF saved: ${pdfPath} (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

    // 2. Generate cover image (first page)
    const coverPath = path.join(outputDir, report.coverName);
    // Clip viewport to exactly page 1 dimensions (794 x 1123)
    await page.screenshot({
      path: coverPath,
      clip: { x: 0, y: 0, width: 794, height: 1123 },
    });
    console.log(`  ✅ Cover preview saved: ${coverPath}`);
  }

  await browser.close();
  console.log('\n✨ All static sample reports and cover assets pre-generated successfully!');
}

generateSampleReports().catch((err) => {
  console.error('Fatal error generating sample reports:', err);
  process.exit(1);
});
