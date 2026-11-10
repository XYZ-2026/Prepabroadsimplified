import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function captureHeroScreenshots() {
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { name: '390x844', width: 390, height: 844 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ];

  const auditDir = path.resolve(process.cwd(), 'reference', 'psychometric-audit');
  const artifactScreenshotsDir = path.resolve(
    'C:/Users/Agam/.gemini/antigravity/brain/faf0eefa-7db8-42ed-be8c-1d405783f644/screenshots'
  );

  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }
  if (!fs.existsSync(artifactScreenshotsDir)) {
    fs.mkdirSync(artifactScreenshotsDir, { recursive: true });
  }

  for (const vp of viewports) {
    console.log(`Navigating to ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/psychometric-assessment', { waitUntil: 'networkidle' });
    
    // Wait for the ~1.8s GSAP hero animation to complete and stabilize
    await page.waitForTimeout(2500);

    const heroSection = page.locator('section[aria-label="CLARVO Psychometric Assessment Overview"]');
    if ((await heroSection.count()) > 0) {
      const heroPath1 = path.join(auditDir, `hero-${vp.name}.png`);
      const heroPath2 = path.join(artifactScreenshotsDir, `hero-${vp.name}.png`);
      
      await heroSection.first().screenshot({ path: heroPath1 });
      await heroSection.first().screenshot({ path: heroPath2 });
      console.log(`Saved screenshot for ${vp.name}`);
    } else {
      console.error(`Hero section not found for ${vp.name}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All hero screenshots captured successfully!');
}

captureHeroScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

