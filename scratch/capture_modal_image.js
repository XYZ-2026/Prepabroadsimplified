const puppeteer = require('puppeteer');

async function captureShareModal() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 950 });

  const mockModalHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-900/75 p-6 flex items-center justify-center min-h-screen">
  <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative">
    
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white flex items-center justify-center shadow-md shrink-0">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
      </div>
      <div>
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#E1306C] block">
          Social Achievement Card
        </span>
        <h3 class="text-lg font-bold text-slate-900">
          Share Your Verified Score Card
        </h3>
      </div>
    </div>

    <p class="text-xs text-slate-600 leading-relaxed font-medium mb-4">
      When sharing on <strong>LinkedIn &amp; WhatsApp</strong>, this visual score card automatically appears in the post preview! For <strong>Instagram</strong>, download or copy the card image below to attach directly to your Story or Feed:
    </p>

    <!-- Card Image Preview using local file -->
    <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-4 bg-[#080F1C]">
      <img 
        src="http://localhost:3000/api/iq-test/share-image?resultId=bS34FsNqbzOkTfOXhacT" 
        alt="Clarvo Cognitive Score Achievement Card" 
        class="w-full h-auto object-cover"
      />
    </div>

    <!-- Action Bar for Card Image -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
      <button class="py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        <span>Download Image (.png)</span>
      </button>

      <button class="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
        <svg class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span>Copy Image to Clipboard</span>
      </button>
    </div>

    <!-- Copied Caption Box -->
    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
      <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-1.5">
        <span>Formatted Post Caption</span>
        <span class="text-emerald-600 flex items-center gap-1 font-extrabold">✓ Caption Ready</span>
      </div>
      <p class="text-[11px] text-slate-700 font-mono line-clamp-3 leading-relaxed">
        🧠 Standardized Cognitive Assessment by Clarvo Center for Cognitive Sciences • Estimated IQ: 71 • Percentile: 3rd • Persona: The Spatial Visionary...
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-2.5">
      <button class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5">
        <span>Launch Instagram</span>
      </button>
      <button class="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors">
        Re-copy Caption
      </button>
    </div>

  </div>
</body>
</html>
  `;

  await page.setContent(mockModalHtml, { waitUntil: 'networkidle0' });
  const outPath = 'C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71/share_modal_with_image.png';
  await page.screenshot({ path: outPath });
  console.log('✅ Screenshot saved to:', outPath);
  await browser.close();
}

captureShareModal().catch(console.error);
