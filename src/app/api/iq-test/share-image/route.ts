import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import puppeteer from 'puppeteer';

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export async function GET(request: Request) {
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('resultId');

    let candidateName = 'Candidate';
    let estimatedIQ = 100;
    let percentile = 50;
    let cognitiveBand = 'Average Cognitive Ability';
    let cognitivePersona = 'The Strategic Thinker';
    let strongestDomain = 'Spatial & Matrix Reasoning';
    let certificateId = 'CLARVO-IQ-VERIFIED';

    if (resultId) {
      try {
        const docSnap = await adminDb.collection('iq_results').doc(resultId).get();
        if (docSnap.exists) {
          const data = docSnap.data() || {};
          candidateName = data.userName || candidateName;
          estimatedIQ = data.estimatedIQ ?? estimatedIQ;
          percentile = data.percentile ?? percentile;
          cognitiveBand = data.cognitiveBand || cognitiveBand;
          cognitivePersona = data.cognitivePersona || cognitivePersona;
          strongestDomain = data.strongestDomain || strongestDomain;
          certificateId = data.certificateId || `CLARVO-IQ-${resultId.toUpperCase().slice(0, 8)}`;
        }
      } catch (err) {
        console.warn('[OG Image] Error fetching result doc:', err);
      }
    }

    const ordinal = getOrdinal(percentile);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      width: 1200px;
      height: 630px;
      background: #080F1C;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 36px;
      overflow: hidden;
      position: relative;
    }

    .ambient-1 {
      position: absolute;
      top: -80px;
      right: -80px;
      width: 450px;
      height: 450px;
      background: rgba(37, 99, 235, 0.22);
      border-radius: 50%;
      filter: blur(80px);
    }

    .ambient-2 {
      position: absolute;
      bottom: -80px;
      left: -80px;
      width: 400px;
      height: 400px;
      background: rgba(56, 189, 248, 0.16);
      border-radius: 50%;
      filter: blur(70px);
    }

    .card-frame {
      width: 100%;
      height: 100%;
      background: rgba(11, 23, 46, 0.85);
      border: 3px solid rgba(56, 189, 248, 0.35);
      border-radius: 28px;
      padding: 38px 46px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 10;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(37, 99, 235, 0.08);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 20px;
    }

    .org-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 20px;
      font-weight: 800;
      color: #38BDF8;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .org-sub {
      font-size: 11px;
      font-weight: 600;
      color: #94A3B8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .badge-certified {
      background: rgba(37, 99, 235, 0.25);
      border: 1.5px solid rgba(56, 189, 248, 0.5);
      color: #38BDF8;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 8px 18px;
      border-radius: 999px;
    }

    .body-grid {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 36px;
      margin: 16px 0;
    }

    .score-badge-card {
      background: rgba(255, 255, 255, 0.04);
      border: 2px solid rgba(255, 255, 255, 0.12);
      border-radius: 22px;
      padding: 24px 34px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 230px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
    }

    .score-lbl {
      font-size: 12px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .score-num {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 80px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1;
      margin: 8px 0;
      text-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
    }

    .rank-pill {
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.5);
      color: #FCD34D;
      font-size: 13px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 10px;
    }

    .details-col {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .test-title {
      font-size: 13px;
      font-weight: 700;
      color: #60A5FA;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .candidate-name {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 38px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 6px 0 14px 0;
      letter-spacing: 0.5px;
    }

    .persona-row {
      display: flex;
      gap: 16px;
    }

    .persona-card {
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 16px;
      padding: 12px 18px;
      flex: 1;
    }

    .strength-card {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 16px;
      padding: 12px 18px;
      flex: 1;
    }

    .card-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .card-val {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 4px;
    }

    .classification-bar {
      font-size: 13px;
      color: #CBD5E1;
      margin-top: 14px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 16px;
    }

    .verif-id {
      font-size: 12px;
      color: #94A3B8;
      font-weight: 600;
    }

    .verif-id span {
      color: #E2E8F0;
      font-family: monospace;
      font-weight: 700;
    }

    .portal-link {
      font-size: 13px;
      color: #38BDF8;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="ambient-1"></div>
  <div class="ambient-2"></div>
  
  <div class="card-frame">
    <div class="header">
      <div>
        <div class="org-title">CLARVO CENTER FOR COGNITIVE SCIENCES</div>
        <div class="org-sub">Cognitive Assessment &amp; Research Division</div>
      </div>
      <div class="badge-certified">Certified Result</div>
    </div>

    <div class="body-grid">
      <div class="score-badge-card">
        <div class="score-lbl">Estimated IQ</div>
        <div class="score-num">${estimatedIQ}</div>
        <div class="rank-pill">${percentile}${ordinal} Percentile</div>
      </div>

      <div class="details-col">
        <div class="test-title">Standardized 45-Item Cognitive Assessment</div>
        <div class="candidate-name">${candidateName}</div>

        <div class="persona-row">
          <div class="persona-card">
            <div class="card-label" style="color: #93C5FD;">Cognitive Persona</div>
            <div class="card-val">${cognitivePersona}</div>
          </div>
          <div class="strength-card">
            <div class="card-label" style="color: #6EE7B7;">Primary Strength</div>
            <div class="card-val">${strongestDomain}</div>
          </div>
        </div>

        <div class="classification-bar">
          Cognitive Classification: <strong style="color: #FFFFFF;">${cognitiveBand}</strong> • Standardized Normal Distribution (Mean=100, SD=15)
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="verif-id">Official Verification ID: <span>${certificateId}</span></div>
      <div class="portal-link">clarvo.in/iq-test</div>
    </div>
  </div>
</body>
</html>
    `;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const imageBuffer = await page.screenshot({ type: 'png' });
    await browser.close();

    return new NextResponse(imageBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: any) {
    if (browser) await browser.close();
    console.error('[OG Image Error]:', err);
    return new NextResponse('Failed to generate image', { status: 500 });
  }
}
