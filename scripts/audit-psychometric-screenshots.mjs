import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function captureAuditScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: '390x844', width: 390, height: 844 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '820x1180', width: 820, height: 1180 },
    { name: '834x1194', width: 834, height: 1194 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '1180x820', width: 1180, height: 820 },
    { name: '1366x1024', width: 1366, height: 1024 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ];

  const auditDir = path.resolve(process.cwd(), 'reference', 'psychometric-audit');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  for (const vp of viewports) {
    console.log(`Processing viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/psychometric-assessment', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // 1. Hero section
    const heroSection = page.locator('section[aria-label="CLARVO Psychometric Assessment Overview"]');
    if (await heroSection.count() > 0) {
      const heroPath = path.join(auditDir, `hero-${vp.name}.png`);
      await heroSection.first().screenshot({ path: heroPath });
      console.log(`Saved: hero-${vp.name}.png`);
    }

    // 2. Phases section
    const phasesSection = page.locator('section[aria-label="The Four Assessment Phases"]');
    if (await phasesSection.count() > 0) {
      const phasesPath = path.join(auditDir, `phases-${vp.name}.png`);
      await phasesSection.first().screenshot({ path: phasesPath });
      console.log(`Saved: phases-${vp.name}.png`);
    }

    // 3. Sample reports section
    const sampleReportsSection = page.locator('#sample-reports');
    if (await sampleReportsSection.count() > 0) {
      const samplePath = path.join(auditDir, `sample-reports-${vp.name}.png`);
      await sampleReportsSection.first().screenshot({ path: samplePath });
      console.log(`Saved: sample-reports-${vp.name}.png`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All 27 screenshots captured successfully into /reference/psychometric-audit/!');
}

captureAuditScreenshots().catch((err) => {
  console.error('Screenshot audit failed:', err);
  process.exit(1);
});

