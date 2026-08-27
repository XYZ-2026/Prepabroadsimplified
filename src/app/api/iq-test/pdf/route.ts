import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('resultId');

    if (!resultId) {
      return NextResponse.json({ success: false, error: 'Missing resultId' }, { status: 400 });
    }

    const doc = await adminDb.collection('iq_results').doc(resultId).get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }

    const data = doc.data() || {};
    const candidateName = data.userName || 'Candidate';
    const estimatedIQ = data.estimatedIQ || 100;
    const percentile = data.percentile || 50;
    const cognitiveBand = data.cognitiveBand || 'Average Cognitive Ability';
    const certificateId = data.certificateId || `SIMP-IQ-${resultId.toUpperCase().slice(0, 8)}`;
    const completionDate = data.completedAt ? new Date(data.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: A4 landscape;
      margin: 0;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      width: 297mm;
      height: 210mm;
      background: #fdfbf7;
      font-family: 'Inter', sans-serif;
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12mm;
      -webkit-print-color-adjust: exact;
    }
    
    .certificate-frame {
      width: 100%;
      height: 100%;
      border: 4px solid #690b1b;
      outline: 2px solid #d97706;
      outline-offset: -10px;
      padding: 12mm 16mm;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      box-shadow: inset 0 0 40px rgba(105, 11, 27, 0.04);
    }
    
    .corner-decor {
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid #d97706;
    }
    .top-left { top: 12px; left: 12px; border-right: none; border-bottom: none; }
    .top-right { top: 12px; right: 12px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: 12px; left: 12px; border-right: none; border-top: none; }
    .bottom-right { bottom: 12px; right: 12px; border-left: none; border-top: none; }
    
    .header {
      margin-top: 4px;
    }
    
    .org-title {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      font-weight: 800;
      color: #690b1b;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    
    .subtitle {
      font-size: 11px;
      font-weight: 600;
      color: #b45309;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    
    .cert-title-box {
      margin: 12px 0 8px 0;
    }
    
    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .awarded-to {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
    }
    
    .candidate-name {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      font-weight: 800;
      color: #690b1b;
      margin: 10px 0;
      border-bottom: 2px solid #f1f5f9;
      display: inline-block;
      padding-bottom: 4px;
    }
    
    .description {
      font-size: 13px;
      color: #475569;
      max-width: 680px;
      margin: 0 auto 12px auto;
      line-height: 1.5;
    }
    
    .scores-grid {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin: 10px 0 16px 0;
    }
    
    .score-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 24px;
      min-width: 160px;
    }
    
    .score-card-val {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      font-weight: 800;
      color: #690b1b;
    }
    
    .score-card-lbl {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 0 20px;
      margin-bottom: 4px;
    }
    
    .meta-block {
      text-align: left;
    }
    
    .meta-lbl {
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .meta-val {
      font-size: 11px;
      color: #1e293b;
      font-weight: 700;
      margin-top: 2px;
    }
    
    .seal-badge {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d97706, #b45309);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
      border: 3px double #ffffff;
    }
  </style>
</head>
<body>
  <div class="certificate-frame">
    <div class="corner-decor top-left"></div>
    <div class="corner-decor top-right"></div>
    <div class="corner-decor bottom-left"></div>
    <div class="corner-decor bottom-right"></div>
    
    <div class="header">
      <div class="org-title">SIMPLIFIED SCHOOL OF EDUCATION</div>
      <div class="subtitle">Standardized Cognitive Assessment Division</div>
    </div>
    
    <div class="cert-title-box">
      <div class="cert-title">Cognitive Assessment Certificate</div>
      <div class="awarded-to">This is officially awarded to</div>
      <div class="candidate-name">${candidateName}</div>
    </div>
    
    <div class="description">
      For successfully completing the <strong>45-Question Standardized Cognitive Assessment</strong> measuring multidimensional problem-solving, spatial manipulation, numerical logic, and visual reasoning.
    </div>
    
    <div class="scores-grid">
      <div class="score-card">
        <div class="score-card-val">${estimatedIQ}</div>
        <div class="score-card-lbl">Estimated IQ Score</div>
      </div>
      <div class="score-card">
        <div class="score-card-val">${percentile}th</div>
        <div class="score-card-lbl">Percentile Rank</div>
      </div>
      <div class="score-card">
        <div class="score-card-val" style="font-size: 16px; margin-top: 6px;">${cognitiveBand}</div>
        <div class="score-card-lbl" style="margin-top: 8px;">Cognitive Classification</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="meta-block">
        <div class="meta-lbl">Date of Issue</div>
        <div class="meta-val">${completionDate}</div>
      </div>
      
      <div class="seal-badge">
        <span>Verified</span>
        <span>Cognitive</span>
      </div>
      
      <div class="meta-block" style="text-align: right;">
        <div class="meta-lbl">Certificate Verification ID</div>
        <div class="meta-val">${certificateId}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      }),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();

    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedName}_IQ_Assessment_Certificate.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    console.error('[IQ Certificate PDF Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate certificate PDF' }, { status: 500 });
  }
}
