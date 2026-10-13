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

async function run() {
  const root = process.cwd();
  const originalLogo = path.join(root, 'public', 'logo.png');
  const backupLogo = path.join(root, 'public', 'logo-original.png');

  if (!fs.existsSync(backupLogo)) {
    fs.copyFileSync(originalLogo, backupLogo);
    console.log('Backed up original logo to:', backupLogo);
  }

  // Extract the tightly trimmed graphic mark
  const trimmedBuffer = await sharp(backupLogo).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();
  console.log(`Extracted trimmed mark: ${trimmedMeta.width}x${trimmedMeta.height}`);

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

  const pngFavicon32 = await generateSquareIcon(32, 1);
  const pngFavicon16 = await generateSquareIcon(16, 1);
  const appleIcon = await generateSquareIcon(180, 8);
  const icon192 = await generateSquareIcon(192, 8);
  const icon512 = await generateSquareIcon(512, 18);
  const logoSquareCroppedAvif = await generateSquareIcon(512, 18, 'avif');

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
    { path: path.join(root, 'public', 'logo-square-cropped.png'), buffer: icon512 },
    { path: path.join(root, 'public', 'logo-square-cropped.avif'), buffer: logoSquareCroppedAvif },
  ];

  for (const item of destinations) {
    fs.writeFileSync(item.path, item.buffer);
    console.log(`Saved: ${path.relative(root, item.path)} (${item.buffer.length} bytes)`);
  }

  console.log('\n--- VERIFICATION OF SIZES & FILL ---');
  for (const item of destinations) {
    if (item.path.endsWith('.ico') || item.path.endsWith('.avif')) continue;
    const meta = await sharp(item.buffer).metadata();
    const { info } = await sharp(item.buffer).trim().toBuffer({ resolveWithObject: true });
    const fillPercent = ((info.width * info.height) / (meta.width * meta.height) * 100).toFixed(1);
    console.log(`${path.relative(root, item.path)}: Canvas ${meta.width}x${meta.height} | Mark ${info.width}x${info.height} (${fillPercent}% area fill)`);
  }
}

run().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
