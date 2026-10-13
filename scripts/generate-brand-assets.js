const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createIco(items) {
  const count = items.length;
  const headerSize = 6;
  const entrySize = 16;
  let currentOffset = headerSize + count * entrySize;
  const entries = [];
  for (const item of items) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    entries.push(entry);
    currentOffset += item.buffer.length;
  }
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  return Buffer.concat([header, ...entries, ...items.map(i => i.buffer)]);
}

async function extractTransparentMark(sourcePath) {
  const { data, info } = await sharp(sourcePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width, height = info.height;
  const outBuf = Buffer.alloc(width * height * 4);

  // Gated flood-fill to find outer background
  const isOuterBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;

  function isBlockedGate(x, y) {
    // Slit at bottom (y >= 610)
    if (x >= 488 && x <= 504 && y >= 610 && y <= 725) return true;
    // Slit at top V (y between 380 and 415)
    if (x >= 488 && x <= 504 && y >= 380 && y <= 415) return true;
    return false;
  }

  function isPureWhite(x, y) {
    if (isBlockedGate(x, y)) return false;
    const idx = (y * width + x) * 4;
    return data[idx] >= 248 && data[idx+1] >= 248 && data[idx+2] >= 248;
  }

  // Seed all 4 image borders
  for (let x = 0; x < width; x++) {
    if (isPureWhite(x, 0)) { isOuterBg[x] = 1; queue[tail++] = x; }
    if (isPureWhite(x, height - 1)) { isOuterBg[(height - 1) * width + x] = 1; queue[tail++] = (height - 1) * width + x; }
  }
  for (let y = 0; y < height; y++) {
    if (isPureWhite(0, y)) { isOuterBg[y * width] = 1; queue[tail++] = y * width; }
    if (isPureWhite(width - 1, y)) { isOuterBg[y * width + width - 1] = 1; queue[tail++] = y * width + width - 1; }
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!isOuterBg[nidx] && isPureWhite(nx, ny)) {
          isOuterBg[nidx] = 1;
          queue[tail++] = nidx;
        }
      }
    }
  }

  // Also mark the spine slits outside the checkmark as transparent
  // (above y < 535 and below y > 595 between x=485 and 505)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const didx = idx * 4;

      const isSpineGap = (x >= 486 && x <= 504) && (y < 535 || y > 595);
      if (isOuterBg[idx] || (isSpineGap && data[didx] > 200 && data[didx+1] > 200 && data[didx+2] > 200)) {
        outBuf[didx] = 0;
        outBuf[didx+1] = 0;
        outBuf[didx+2] = 0;
        outBuf[didx+3] = 0;
      } else {
        const r = data[didx], g = data[didx+1], b = data[didx+2];
        
        // Edge anti-aliasing against background
        let hasOuterBgNeighbor = false;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isOuterBg[ny * width + nx]) {
                hasOuterBgNeighbor = true;
                break;
              }
            }
          }
          if (hasOuterBgNeighbor) break;
        }

        if (hasOuterBgNeighbor) {
          const whiteness = Math.min(r, g, b) / 255;
          let alpha = Math.max(0, Math.min(255, Math.round((1 - whiteness) * 255)));
          
          if (alpha < 15) {
            outBuf[didx] = 0;
            outBuf[didx+1] = 0;
            outBuf[didx+2] = 0;
            outBuf[didx+3] = 0;
          } else {
            const invA = 255 / alpha;
            outBuf[didx] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - alpha/255)) * invA)));
            outBuf[didx+1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - alpha/255)) * invA)));
            outBuf[didx+2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - alpha/255)) * invA)));
            outBuf[didx+3] = alpha;
          }
        } else {
          outBuf[didx] = r;
          outBuf[didx+1] = g;
          outBuf[didx+2] = b;
          outBuf[didx+3] = 255;
        }
      }
    }
  }

  return await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
}

async function run() {
  const root = process.cwd();
  const backupLogo = path.join(root, 'public', 'logo-original.png');

  if (!fs.existsSync(backupLogo)) {
    throw new Error('Missing public/logo-original.png backup source!');
  }

  console.log('Extracting transparent logo mark with anti-aliasing...');
  const transparentMasterBuffer = await extractTransparentMark(backupLogo);

  // Extract the tightly trimmed graphic mark with zero background
  const trimmedBuffer = await sharp(transparentMasterBuffer).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log(`Extracted trimmed transparent mark: ${trimmedMeta.width}x${trimmedMeta.height}`);

  async function generateSquareIcon(size, paddingPx, format = 'png') {
    const innerSize = Math.max(1, size - (paddingPx * 2));
    const resizedMark = await sharp(trimmedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        kernel: sharp.kernel.lanczos3
      })
      .toBuffer();

    let pipeline = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).composite([{ input: resizedMark, gravity: 'center' }]);

    if (format === 'avif') {
      return await pipeline.avif({ quality: 90 }).toBuffer();
    }
    return await pipeline.png({ compressionLevel: 9 }).toBuffer();
  }

  // 1. Favicon sizes
  const ico16 = { width: 16, height: 16, buffer: await generateSquareIcon(16, 1) };
  const ico32 = { width: 32, height: 32, buffer: await generateSquareIcon(32, 1) };
  const ico48 = { width: 48, height: 48, buffer: await generateSquareIcon(48, 2) };
  const icoBuffer = createIco([ico16, ico32, ico48]);

  const pngFavicon32 = await generateSquareIcon(32, 0);
  const pngFavicon16 = await generateSquareIcon(16, 0);
  const appleIcon = await generateSquareIcon(180, 4);
  const icon192 = await generateSquareIcon(192, 4);
  const icon512 = await generateSquareIcon(512, 0);
  const logoSquareCroppedAvif = await generateSquareIcon(512, 0, 'avif');

  // Destinations: public/ and src/app/
  const destinations = [
    // Favicon ICO
    { path: path.join(root, 'public', 'favicon.ico'), buffer: icoBuffer },
    { path: path.join(root, 'src', 'app', 'favicon.ico'), buffer: icoBuffer },
    // Favicon PNG
    { path: path.join(root, 'public', 'favicon.png'), buffer: pngFavicon32 },
    { path: path.join(root, 'src', 'app', 'favicon.png'), buffer: pngFavicon32 },
    { path: path.join(root, 'public', 'favicon-32x32.png'), buffer: pngFavicon32 },
    { path: path.join(root, 'public', 'favicon-16x16.png'), buffer: pngFavicon16 },
    // Apple Touch Icon
    { path: path.join(root, 'public', 'apple-icon.png'), buffer: appleIcon },
    { path: path.join(root, 'src', 'app', 'apple-icon.png'), buffer: appleIcon },
    // Icon PNG (512x512)
    { path: path.join(root, 'public', 'icon.png'), buffer: icon512 },
    { path: path.join(root, 'src', 'app', 'icon.png'), buffer: icon512 },
    // Icon 192
    { path: path.join(root, 'public', 'icon-192.png'), buffer: icon192 },
    { path: path.join(root, 'src', 'app', 'icon-192.png'), buffer: icon192 },
    // Master logo
    { path: path.join(root, 'public', 'logo.png'), buffer: icon512 },
    { path: path.join(root, 'public', 'logo-transparent.png'), buffer: icon512 },
    { path: path.join(root, 'public', 'logo-square-cropped.png'), buffer: icon512 },
    { path: path.join(root, 'public', 'logo-square-cropped.avif'), buffer: logoSquareCroppedAvif },
  ];

  for (const item of destinations) {
    fs.writeFileSync(item.path, item.buffer);
    console.log(`Saved: ${path.relative(root, item.path)} (${item.buffer.length} bytes)`);
  }

  console.log('\n--- VERIFICATION OF TRANSPARENCY & BOUNDS ---');
  for (const item of destinations) {
    if (item.path.endsWith('.ico') || item.path.endsWith('.avif')) continue;
    const meta = await sharp(item.buffer).metadata();
    const raw = await sharp(item.buffer).raw().toBuffer();
    let transparent = 0;
    for (let i = 3; i < raw.length; i += 4) {
      if (raw[i] === 0) transparent++;
    }
    const transPercent = ((transparent / (meta.width * meta.height)) * 100).toFixed(1);
    console.log(`${path.relative(root, item.path)}: Canvas ${meta.width}x${meta.height} | ${transPercent}% transparent background`);
  }
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
