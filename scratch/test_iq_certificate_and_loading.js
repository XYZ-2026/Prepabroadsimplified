const fs = require('fs');
const puppeteer = require('puppeteer');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  const mockCalculatingHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin { animation: spin 1.8s linear infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .88; transform: scale(0.97); }
    }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
</head>
<body class="bg-[#F8FAFC]">
  <div class="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
    <div class="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-900/5 p-8 sm:p-10 max-w-md w-full flex flex-col items-center">
      
      <!-- Symmetrical Circular Spinner around pulsing Brain Card -->
      <div class="relative w-24 h-24 mb-6 flex items-center justify-center">
        <!-- Outer sleek rotating circular track -->
        <div 
          class="absolute inset-0 rounded-full border-2 border-blue-100 border-t-[#2563EB] animate-spin" 
        ></div>
        <!-- Inner centered squircle badge -->
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FF] to-blue-50 flex items-center justify-center text-[#2563EB] shadow-sm">
          <svg class="w-8 h-8 text-[#2563EB] animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
            <path d="M6.002 5.125A3 3 0 0 0 6.401 6.5"/>
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
            <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
            <path d="M6 18a4 4 0 0 1-1.967-.516"/>
            <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
          </svg>
        </div>
      </div>

      <span class="text-[10px] font-extrabold tracking-widest text-[#2563EB] uppercase mb-1.5">
        Standardized Psychometric Processing
      </span>
      <h2 class="text-2xl font-bold text-[#080F1C] mb-2 tracking-tight">
        Calculating Your Cognitive Profile
      </h2>
      <p class="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed min-h-[36px] flex items-center justify-center font-medium">
        Calibrating domain difficulty weights & standard deviations...
      </p>

      <div class="w-full flex flex-col items-center">
        <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5 p-0.5 border border-slate-200/50">
          <div 
            class="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full transition-all duration-300 ease-out" 
            style="width: 68%"
          ></div>
        </div>
        <div class="flex items-center justify-between w-full text-xs font-bold">
          <span class="text-slate-400">Processing 45 Questions</span>
          <span class="text-[#2563EB] font-extrabold">68% Complete</span>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(mockCalculatingHtml, { waitUntil: 'domcontentloaded' });
  const outPathLoading = 'C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71/iq_calculating_screen_resolved.png';
  await page.screenshot({ path: outPathLoading });
  console.log('✅ Screenshot saved to:', outPathLoading);

  // 2. Certificate Header screenshot
  const certHeaderMockHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #fdfbf7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 30px;
      display: flex;
      justify-content: center;
    }
    .certificate-frame {
      width: 780px;
      border: 4px solid #2563EB;
      outline: 2px solid #38BDF8;
      outline-offset: -10px;
      padding: 36px 44px;
      background: #ffffff;
      text-align: center;
      box-shadow: inset 0 0 40px rgba(37, 99, 235, 0.04), 0 10px 30px rgba(0,0,0,0.08);
      border-radius: 4px;
    }
    .org-title {
      font-family: Georgia, serif;
      font-size: 20px;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: 2px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 11px;
      font-weight: 600;
      color: #0284C7;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .cert-title {
      font-family: Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #080F1C;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 20px;
    }
    .awarded-to {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 8px;
    }
    .candidate-name {
      font-family: Georgia, serif;
      font-size: 30px;
      font-weight: 800;
      color: #080F1C;
      margin: 10px 0;
      border-bottom: 2px solid #E8F0FF;
      display: inline-block;
      padding-bottom: 4px;
    }
    .description {
      font-size: 12px;
      color: #475569;
      max-width: 600px;
      margin: 0 auto 14px auto;
      line-height: 1.5;
    }
    .scores-grid {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 14px 0;
    }
    .score-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 20px;
      min-width: 140px;
    }
    .score-card-val {
      font-family: Georgia, serif;
      font-size: 24px;
      font-weight: 800;
      color: #2563EB;
    }
    .score-card-lbl {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="certificate-frame">
    <div class="org-title">CLARVO CENTER FOR COGNITIVE SCIENCES</div>
    <div class="subtitle">COGNITIVE ASSESSMENT & RESEARCH DIVISION</div>
    <div class="cert-title">Cognitive Assessment Certificate</div>
    <div class="awarded-to">This is officially awarded to</div>
    <div class="candidate-name">Candidate Name</div>
    <div class="description">
      For successfully completing the <strong>45-Question Standardized Cognitive Assessment</strong> measuring multidimensional problem-solving, spatial manipulation, numerical logic, and visual reasoning.
    </div>
    <div class="scores-grid">
      <div class="score-card">
        <div class="score-card-val">128</div>
        <div class="score-card-lbl">Estimated IQ Score</div>
      </div>
      <div class="score-card">
        <div class="score-card-val">97th</div>
        <div class="score-card-lbl">Percentile Rank</div>
      </div>
      <div class="score-card">
        <div class="score-card-val" style="font-size: 15px; margin-top: 6px;">Superior Cognitive Ability</div>
        <div class="score-card-lbl" style="margin-top: 8px;">Cognitive Classification</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(certHeaderMockHtml, { waitUntil: 'domcontentloaded' });
  const outPathCert = 'C:/Users/Agam/.gemini/antigravity-ide/brain/3469f4c0-9ccd-463e-9e69-19ea41872b71/iq_certificate_header_resolved.png';
  await page.screenshot({ path: outPathCert });
  console.log('✅ Certificate screenshot saved to:', outPathCert);

  await browser.close();
  console.log('All tests completed successfully!');
}

testScreenshots().catch(err => {
  console.error(err);
  process.exit(1);
});
