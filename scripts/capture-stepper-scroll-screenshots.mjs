import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function captureStepperScreenshots() {
  const browser = await chromium.launch({ headless: true });

  const auditDir = path.resolve(process.cwd(), 'reference', 'psychometric-audit');
  const artifactScreenshotsDir = path.resolve(
    'C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots'
  );

  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
  if (!fs.existsSync(artifactScreenshotsDir)) fs.mkdirSync(artifactScreenshotsDir, { recursive: true });

  const testConfigs = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '768x1024', width: 768, height: 1024 },
  ];

  for (const config of testConfigs) {
    console.log(`Testing viewport ${config.name}...`);
    const page = await browser.newPage({ viewport: { width: config.width, height: config.height } });
    await page.goto('http://localhost:3000/psychometric-assessment', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 1. Capture Section 2 (What it is / is not)
    const whatItIsSection = page.locator('section[aria-label="What is a Psychometric Assessment"]');
    if ((await whatItIsSection.count()) > 0) {
      await whatItIsSection.first().scrollIntoViewIfNeeded();
      // Wait for GSAP strike-through line draw to animate
      await page.waitForTimeout(1200);
      const whatItIsPath1 = path.join(auditDir, `what-it-is-${config.name}.png`);
      const whatItIsPath2 = path.join(artifactScreenshotsDir, `what-it-is-${config.name}.png`);
      await whatItIsSection.first().screenshot({ path: whatItIsPath1 });
      await whatItIsSection.first().screenshot({ path: whatItIsPath2 });
      console.log(`Saved: what-it-is-${config.name}.png`);
    }

    // 2. Section 3: 0%, 33%, 66%, 100%
    const isDesktop = config.width >= 1024;
    
    if (isDesktop) {
      // On Desktop (Sticky Stepper): Test each of the 4 phase triggers
      const phaseSteps = [
        { label: '0pct', id: 'phase-step-1', phaseName: 'Phase 1' },
        { label: '33pct', id: 'phase-step-2', phaseName: 'Phase 2' },
        { label: '66pct', id: 'phase-step-3', phaseName: 'Phase 3' },
        { label: '100pct', id: 'phase-step-4', phaseName: 'Phase 4' },
      ];

      for (const step of phaseSteps) {
        const trigger = page.locator(`#${step.id}`);
        if ((await trigger.count()) > 0) {
          await trigger.scrollIntoViewIfNeeded();
          await page.waitForTimeout(700);
          const shotPath1 = path.join(auditDir, `phases-${config.name}-${step.label}.png`);
          const shotPath2 = path.join(artifactScreenshotsDir, `phases-${config.name}-${step.label}.png`);
          await page.screenshot({ path: shotPath1 });
          await page.screenshot({ path: shotPath2 });
          console.log(`Saved: phases-${config.name}-${step.label}.png (${step.phaseName})`);
        }
      }
    } else {
      // On Tablet / Mobile (< 1024): Test stacked cards
      const stackedSteps = [
        { label: '0pct', id: 'stacked-phase-1', phaseName: 'Phase 1' },
        { label: '33pct', id: 'stacked-phase-2', phaseName: 'Phase 2' },
        { label: '66pct', id: 'stacked-phase-3', phaseName: 'Phase 3' },
        { label: '100pct', id: 'stacked-phase-4', phaseName: 'Phase 4' },
      ];

      for (const step of stackedSteps) {
        const card = page.locator(`#${step.id}`);
        if ((await card.count()) > 0) {
          await card.scrollIntoViewIfNeeded();
          await page.waitForTimeout(600);
          const shotPath1 = path.join(auditDir, `phases-${config.name}-${step.label}.png`);
          const shotPath2 = path.join(artifactScreenshotsDir, `phases-${config.name}-${step.label}.png`);
          await page.screenshot({ path: shotPath1 });
          await page.screenshot({ path: shotPath2 });
          console.log(`Saved: phases-${config.name}-${step.label}.png (${step.phaseName})`);
        }
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('All stepper scroll screenshots captured successfully!');
}

captureStepperScreenshots().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
