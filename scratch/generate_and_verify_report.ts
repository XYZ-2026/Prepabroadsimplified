import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { generatePersonalization } from '../src/app/(main)/psychometric-test/class10_personalization';
import { adaptReportData } from '../src/app/(main)/psychometric-test/report-engine/adapters';
import { buildUniversalExecutiveHTMLReport } from '../src/app/(main)/psychometric-test/class10_html_report_builder';
import type { EditorialStudent, EditorialScores } from '../src/app/(main)/psychometric-test/class10_editorial_engine';

async function main() {
  console.log('--- Step 1: Preparing Candidate and Assessment Scores ---');

  const student: EditorialStudent = {
    name: 'agam',
    grade: 'Class 12',
    age: '17',
    school: 'Modern School, Barakhamba Road',
    city: 'New Delhi',
    stream: 'Commerce with Mathematics',
    mathStatus: 'With Mathematics',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English Core'],
    board: 'CBSE',
    academicYear: '2025–2026',
    graduationYear: '2026',
    email: 'agam@clarvo.in',
    date: '12 October 2026',
    reportId: 'AS-12-PTX4VK',
    parentName: 'Mr. & Mrs. Sharma'
  };

  const scores: EditorialScores = {
    aptitude: {
      verbal: 82,
      numerical: 86,
      reasoning: 84,
      spatial: 70,
      overall: 81
    },
    personality: {
      openness: 78,
      conscientiousness: 84,
      extraversion: 75,
      agreeableness: 72,
      emotionalStability: 76
    },
    topRiasec: ['Enterprising', 'Conventional', 'Investigative'],
    riasec: {
      realistic: 50,
      investigative: 78,
      artistic: 65,
      social: 70,
      enterprising: 92,
      conventional: 85
    },
    topVark: 'V',
    vark: { visual: 40, aural: 25, readWrite: 25, kinesthetic: 10 },
    topValues: ['Strategic Leadership', 'Financial Growth', 'Operational Excellence'],
    careerFitment: [
      { name: 'Business Administration, Strategy & Management Consulting', score: 92 },
      { name: 'Entrepreneurship, Venture Building & Strategic Business Administration', score: 88 },
      { name: 'Marketing Strategy, Consumer Insights & Brand Leadership', score: 85 },
      { name: 'Economics, Financial Markets & Corporate Finance', score: 82 }
    ]
  };

  console.log('--- Step 2: Generating Personalization and Adapting Data ---');
  const personalization = await generatePersonalization(student, scores, null);
  const adaptedData = adaptReportData(
    student,
    scores,
    personalization,
    null,
    null,
    'senior'
  );

  console.log('--- Step 3: Building Universal HTML Report ---');
  const html = buildUniversalExecutiveHTMLReport(adaptedData);
  const htmlPath = path.resolve('scratch/test_report.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`Saved HTML report to ${htmlPath} (${html.length} chars)`);

  console.log('--- Step 4: Launching Puppeteer and Rendering PDF ---');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--disable-web-security',
      '--allow-file-access-from-files'
    ]
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  page.setDefaultNavigationTimeout(120000);
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  await page.setContent(html, { waitUntil: 'networkidle0' as any });

  // Evaluate fonts
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('scratch/regenerated_Class12_Full_Psychometric_Report.pdf');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`Successfully generated PDF: ${pdfPath} (${pdfBuffer.length} bytes)`);

  await browser.close();
  console.log('PDF generation finished.');
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
