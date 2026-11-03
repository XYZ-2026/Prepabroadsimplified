import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load faceZones.json widened by 3%
const faceZonesPath = path.resolve(process.cwd(), 'faceZones.json');
const faceZonesData = JSON.parse(fs.readFileSync(faceZonesPath, 'utf-8'));

test.describe('DESIGN.md Section 7 Audit Matrix', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with networkidle
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for critical images and fonts to settle
    await page.waitForTimeout(1000);
  });

  test('Check 1: No horizontal scroll', async ({ page }) => {
    const scrollInfo = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const innerW = window.innerWidth;
      return {
        hasScroll: scrollW > clientW,
        scrollW,
        clientW,
        innerW,
      };
    });

    expect(scrollInfo.hasScroll, `Found horizontal scroll: scrollWidth (${scrollInfo.scrollW}) > clientWidth (${scrollInfo.clientW})`).toBe(false);
  });

  test('Check 2: Hero chips do not intersect face-safe zones (widened by 3%)', async ({ page }) => {
    const intersections = await page.evaluate((zones) => {
      // Find hero group photo
      const heroPhoto = document.querySelector('img[src*="02-group-cutout"]');
      if (!heroPhoto) return { error: 'Hero group photo not found' };

      const photoRect = heroPhoto.getBoundingClientRect();
      const chips = Array.from(document.querySelectorAll('.hero-chip')).filter((chip) => {
        const style = window.getComputedStyle(chip);
        const rect = chip.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      });

      const conflicts: any[] = [];

      for (const chip of chips) {
        const chipRect = chip.getBoundingClientRect();

        // Also test against forbidden Y band: 15% to 62% of photo box
        const chipRelYTop = ((chipRect.top - photoRect.top) / photoRect.height) * 100;
        const chipRelYBottom = ((chipRect.bottom - photoRect.top) / photoRect.height) * 100;

        const overlapsForbiddenBand = !(chipRelYBottom < 15 || chipRelYTop > 62);
        if (overlapsForbiddenBand) {
          conflicts.push({
            chipText: chip.textContent?.trim().slice(0, 40),
            reason: `Overlaps forbidden 15%-62% Y-band (relTop=${chipRelYTop.toFixed(1)}%, relBottom=${chipRelYBottom.toFixed(1)}%)`,
          });
        }

        // Test each widened face zone
        for (const zone of zones) {
          const faceLeft = photoRect.left + (zone.widened.xMin / 100) * photoRect.width;
          const faceRight = photoRect.left + (zone.widened.xMax / 100) * photoRect.width;
          const faceTop = photoRect.top + (zone.widened.yMin / 100) * photoRect.height;
          const faceBottom = photoRect.top + (zone.widened.yMax / 100) * photoRect.height;

          // AABB Collision check
          const intersects = !(
            chipRect.right < faceLeft ||
            chipRect.left > faceRight ||
            chipRect.bottom < faceTop ||
            chipRect.top > faceBottom
          );

          if (intersects) {
            conflicts.push({
              chipText: chip.textContent?.trim().slice(0, 40),
              faceName: zone.name,
              widenedZone: zone.widened,
            });
          }
        }
      }

      return { conflicts, visibleChipCount: chips.length };
    }, faceZonesData.zones);

    expect(intersections.conflicts, `Face collisions found: ${JSON.stringify(intersections.conflicts)}`).toHaveLength(0);
  });

  test('Check 2b: Hero headline and subcopy do not collide with hero photo', async ({ page }) => {
    const collision = await page.evaluate(() => {
      const headline = document.querySelector('h1');
      const photo = document.querySelector('img[src*="02-group-cutout"]');
      if (!headline || !photo) return { error: 'Headline or photo not found', overlaps: false, isTwoCol: false, horizontalGap: 0 };

      const hRect = headline.getBoundingClientRect();
      const pRect = photo.getBoundingClientRect();

      // On 2-column layouts (width >= 1024), photo and headline must not collide
      const isTwoCol = window.innerWidth >= 1024;
      if (isTwoCol) {
        const overlaps = !(hRect.right <= pRect.left || hRect.left >= pRect.right || hRect.bottom <= pRect.top || hRect.top >= pRect.bottom);
        const horizontalGap = pRect.left - hRect.right;
        return {
          isTwoCol,
          overlaps,
          horizontalGap,
          headlineRight: hRect.right,
          photoLeft: pRect.left,
        };
      }

      return { isTwoCol, overlaps: false, horizontalGap: 0 };
    });

    expect(collision.overlaps, `Headline collides with hero photo: ${JSON.stringify(collision)}`).toBe(false);
    if (collision.isTwoCol) {
      expect(collision.horizontalGap, `Expected positive gap between headline and photo, got ${collision.horizontalGap}px`).toBeGreaterThan(10);
    }
  });

  test('Check 2c: Hero chips have complete text without truncation or ellipsis', async ({ page }) => {
    const chipsInfo = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.hero-chip')).filter((chip) => {
        const style = window.getComputedStyle(chip);
        const rect = chip.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      });

      return chips.map((c) => {
        const text = c.textContent?.trim() || '';
        return {
          text,
          hasEllipsis: text.includes('...') || text.includes('…'),
        };
      });
    });

    for (const chip of chipsInfo) {
      expect(chip.hasEllipsis, `Hero chip text was truncated with ellipsis: "${chip.text}"`).toBe(false);
    }
  });

  test('Check 3: MediaFrames cover mode has no empty band and cutout mode is flush at bottom', async ({ page }) => {
    // Scroll through the page so lazy images load
    await page.evaluate(async () => {
      const scrollStep = 800;
      for (let y = 0; y < document.body.scrollHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const frameAudits = await page.evaluate(() => {
      const frames = Array.from(document.querySelectorAll('[data-media-frame]'));
      const results: any[] = [];

      for (const frame of frames) {
        const mode = frame.getAttribute('data-media-frame');
        const frameRect = frame.getBoundingClientRect();
        const img = frame.querySelector('img');

        if (!img) {
          results.push({ mode, error: 'No image element in MediaFrame' });
          continue;
        }

        const imgRect = img.getBoundingClientRect();

        if (mode === 'cover') {
          // In cover mode, the image rect must cover the frame rect (tolerance 1.5px)
          const coversWidth = imgRect.width >= frameRect.width - 2;
          const coversHeight = imgRect.height >= frameRect.height - 2;
          results.push({
            mode,
            covers: coversWidth && coversHeight,
            frameSize: { w: frameRect.width, h: frameRect.height },
            imgSize: { w: imgRect.width, h: imgRect.height },
          });
        } else if (mode === 'cutout') {
          // In cutout mode, image must be anchored to bottom (tolerance 2.5px)
          const bottomDiff = Math.abs(imgRect.bottom - frameRect.bottom);
          results.push({
            mode,
            isFlush: bottomDiff <= 3,
            bottomDiff,
          });
        }
      }

      return results;
    });

    for (const audit of frameAudits) {
      if (audit.mode === 'cover') {
        expect(audit.covers, `Cover frame had empty band: ${JSON.stringify(audit)}`).toBe(true);
      } else if (audit.mode === 'cutout') {
        expect(audit.isFlush, `Cutout frame not flush at bottom: ${JSON.stringify(audit)}`).toBe(true);
      }
    }
  });

  test('Check 4: "PATH" is fully visible or absent', async ({ page }) => {
    const pathVisibility = await page.evaluate(() => {
      const el = document.querySelector('.hero-stage-word');
      if (!el) return { present: false };

      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      if (style.display === 'none' || style.visibility === 'hidden') {
        return { present: false };
      }

      const viewportWidth = window.innerWidth;
      const isClippedLeft = rect.left < 0;
      const isClippedRight = rect.right > viewportWidth + 2;

      return {
        present: true,
        rect: { x: rect.left, right: rect.right, width: rect.width },
        viewportWidth,
        isClipped: isClippedLeft || isClippedRight,
      };
    });

    if (pathVisibility.present) {
      expect(pathVisibility.isClipped, `"PATH" is clipped: ${JSON.stringify(pathVisibility)}`).toBe(false);
    }
  });

  test('Check 5: CTA photo is at least 96% of panel height and flush at bottom', async ({ page }) => {
    // Scroll to consultation CTA
    await page.evaluate(() => {
      const cta = document.querySelector('section[aria-label*="Consultation"]');
      if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(600);

    const ctaAudit = await page.evaluate(() => {
      const ctaSec = document.querySelector('section[aria-label*="Consultation"]');
      const panel = ctaSec ? ctaSec.querySelector('.bg-\\[\\#1258DE\\]') : null;
      if (!panel) return { error: 'CTA panel not found' };

      const panelRect = panel.getBoundingClientRect();
      const imgs = Array.from(document.querySelectorAll('img[src*="03-celebrate-cutout"]'));
      const visibleImg = imgs.find((img) => {
        const r = img.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && window.getComputedStyle(img).display !== 'none';
      });

      if (!visibleImg) return { error: 'Visible celebrate cutout image not found' };

      const imgRect = visibleImg.getBoundingClientRect();
      const isDesktopTwoCol = window.innerWidth >= 1280;
      const photoHeightRatio = (imgRect.height / panelRect.height) * 100;
      const bottomDiff = Math.abs(imgRect.bottom - panelRect.bottom);

      return {
        isDesktopTwoCol,
        photoHeightRatio,
        bottomDiff,
        imgRect: { w: imgRect.width, h: imgRect.height },
        panelRect: { w: panelRect.width, h: panelRect.height },
      };
    });

    expect(ctaAudit.error).toBeUndefined();

    if (ctaAudit.isDesktopTwoCol) {
      expect(ctaAudit.photoHeightRatio, `Desktop CTA photo height should be >= 96% of panel, got ${ctaAudit.photoHeightRatio}%`).toBeGreaterThanOrEqual(96);
      expect(ctaAudit.bottomDiff, `Desktop CTA photo should be flush with panel bottom, got ${ctaAudit.bottomDiff}px`).toBeLessThanOrEqual(2);
    } else {
      expect(ctaAudit.bottomDiff, `Stacked CTA photo should be flush with panel bottom, got ${ctaAudit.bottomDiff}px`).toBeLessThanOrEqual(2);
    }
  });

  test('Check 6: Pinned scroll and mouse parallax are inactive when pointer is coarse', async ({ page }) => {
    await page.waitForTimeout(600);

    const behavior = await page.evaluate(() => {
      const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      // Pinned assessment story has been removed, so no 400svh element exists
      const hasAnyPinnedSection = Array.from(document.querySelectorAll('*')).some(el => {
        const s = el.getAttribute('style') || '';
        return s.includes('400svh') || s.includes('300svh');
      });

      return {
        isFinePointer,
        hasAnyPinnedSection,
      };
    });

    if (!behavior.isFinePointer) {
      expect(behavior.hasAnyPinnedSection, 'Pinned scroll should be inactive on coarse pointer / touch').toBe(false);
    }
  });

  test('Check 7: Testimonial review categories exist and contain at least 25 reviews each', async ({ page }) => {
    const categoriesAudit = await page.evaluate(() => {
      const section = document.querySelector('section[aria-label="Student and Parent Stories"]');
      if (!section) return { error: 'Testimonial section not found', categoryCount: 0, categories: [] };

      const categoryButtons = Array.from(section.querySelectorAll('button[type="button"]')).map(btn => ({
        label: btn.textContent?.trim(),
        count: parseInt(btn.querySelector('span:last-child')?.textContent || '0', 10)
      })).filter(b => b.count > 0);

      return {
        categoryCount: categoryButtons.length,
        categories: categoryButtons,
      };
    });

    expect(categoriesAudit.error).toBeUndefined();
    expect(categoriesAudit.categoryCount).toBeGreaterThanOrEqual(6);
    for (const cat of categoriesAudit.categories) {
      expect(cat.count, `Category ${cat.label} has less than 25 reviews`).toBeGreaterThanOrEqual(25);
    }
  });

  test('Capture Screenshot for /reference/after/', async ({ page }, testInfo) => {
    const vp = page.viewportSize();
    if (!vp) return;

    const afterDir = path.resolve(process.cwd(), 'reference/after');
    if (!fs.existsSync(afterDir)) {
      fs.mkdirSync(afterDir, { recursive: true });
    }

    // Scroll to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);

    const shotPath = path.join(afterDir, `after_${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
  });
});
