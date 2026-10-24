const puppeteer = require('puppeteer');

async function testCongratulationsBanner() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const mockBannerHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; }
  </style>
</head>
<body class="p-6 md:p-10">
  <div class="max-w-6xl mx-auto">
    
    <!-- ── CONGRATULATIONS & ACHIEVEMENT HERO BANNER ── -->
    <section class="bg-gradient-to-br from-[#080F1C] via-[#0D1B36] to-[#1E3A8A] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl shadow-blue-900/15 mb-8 relative overflow-hidden border border-blue-900/40">
      
      <!-- Subtle Ambient Light Glows -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div class="relative z-10 flex flex-col gap-6 md:gap-8">
        
        <!-- Top Section: Congratulations Announcement -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div class="flex-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-extrabold text-[#38BDF8] tracking-widest uppercase mb-3">
              <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Cognitive Evaluation Certified
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2.5">
              🎉 Congratulations, Admin!
            </h1>

            <p class="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed font-medium">
              You have officially completed all 45 standardized items of the <strong class="text-white">Clarvo Cognitive Assessment</strong>. Before reviewing your comprehensive 5-domain psychometric breakdown below, take a moment to celebrate and share your certified result with your network!
            </p>
          </div>

          <!-- Live Highlight Stat Badges -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 self-start lg:self-center shadow-lg">
            <div class="px-3 text-center sm:text-left">
              <span class="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Estimated IQ</span>
              <span class="text-4xl font-extrabold text-white leading-tight">71</span>
            </div>
            <div class="h-10 w-px bg-white/20 hidden sm:block"></div>
            <div class="px-3 text-center sm:text-left">
              <span class="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Percentile</span>
              <span class="text-base font-extrabold text-amber-300 block leading-tight">3rd</span>
              <span class="text-[10px] text-blue-200 font-medium">Top 97% Nationally</span>
            </div>
            <div class="h-10 w-px bg-white/20 hidden sm:block"></div>
            <div class="px-3 text-center sm:text-left">
              <span class="text-[10px] uppercase font-bold text-blue-200 tracking-wider block">Classification</span>
              <span class="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md inline-block mt-0.5">
                Below Average
              </span>
            </div>
          </div>

        </div>

        <!-- Social Media Sharing Action Row -->
        <div class="pt-6 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-[#38BDF8] flex items-center justify-center shrink-0 shadow-inner">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
            </div>
            <div>
              <span class="text-xs sm:text-sm font-bold text-white block">
                Share Your Achievement
              </span>
              <span class="text-[11px] text-blue-200/80 font-medium">
                Click any platform to post with pre-filled description &amp; badge:
              </span>
            </div>
          </div>

          <!-- Quick Share Buttons -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            <!-- 1. LinkedIn -->
            <button
              class="px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.39 9.74v-8.37H5.07v8.37h2.78Z"/></svg>
              <span>LinkedIn</span>
            </button>

            <!-- 2. WhatsApp -->
            <button
              class="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3Z"/></svg>
              <span>WhatsApp</span>
            </button>

            <!-- 3. X / Twitter -->
            <button
              class="px-3.5 py-2.5 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>Post</span>
            </button>

            <!-- 4. Instagram -->
            <button
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              <span>Instagram</span>
            </button>

            <!-- 5. Copy Link & Caption -->
            <button
              class="px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy Summary</span>
            </button>

          </div>

        </div>

      </div>
    </section>

  </div>
</body>
</html>
  `;

  await page.setContent(mockBannerHtml, { waitUntil: 'domcontentloaded' });
  const outPath = 'C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71/congratulations_share_banner_rendered.png';
  await page.screenshot({ path: outPath });
  console.log('✅ Screenshot saved to:', outPath);
  await browser.close();
}

testCongratulationsBanner().catch(console.error);
