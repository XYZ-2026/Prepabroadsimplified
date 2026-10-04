/**
 * Career Roadmap API — PDF Export
 * ────────────────────────────────
 * POST /api/career-roadmap/pdf
 * 
 * Generates a clean, professional, publication-grade Career Roadmap PDF (4–6 pages)
 * based strictly on the deterministic dataset, selected path, and student profile.
 */

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import { getNode, getNodeDetail, NODE_TYPE_CONFIG } from '@/lib/career-roadmap-service';

export async function POST(request: NextRequest) {
  try {
    const claims = await verifySessionCookie();
    const userProfile = await getUserProfile();

    const body = await request.json();
    const {
      title = 'My Career Roadmap',
      studentName = userProfile?.name || 'Student',
      grade = userProfile?.grade || userProfile?.academicGrade || 'High School',
      selectedPathNodeIds = [],
      notes = '',
      decisionState = {},
    } = body;

    // Resolve nodes along the path
    const resolvedNodes = selectedPathNodeIds
      .map((id: string) => getNode(id))
      .filter(Boolean);

    // Resolve detailed info for each node
    const detailedSteps = resolvedNodes.map((n: any) => {
      const detail = getNodeDetail(n.id);
      const typeConfig = NODE_TYPE_CONFIG[n.type] || {
        label: n.type,
        color: '#4f46e5',
        bgColor: '#eef2ff',
        borderColor: '#c7d2fe',
        icon: '📌',
      };
      return {
        node: n,
        typeConfig,
        detail,
      };
    });

    // Gather colleges and exams from path
    const colleges: any[] = [];
    const exams: any[] = [];
    for (const step of detailedSteps) {
      if (step.detail?.relatedColleges) {
        for (const c of step.detail.relatedColleges) {
          if (!colleges.some(existing => existing.id === c.id)) {
            colleges.push({ ...c, parentNodeName: step.node.displayName || step.node.canonicalName });
          }
        }
      }
      if (step.detail?.relatedExams) {
        for (const e of step.detail.relatedExams) {
          if (!exams.some(existing => existing.id === e.id)) {
            exams.push({ ...e, parentNodeName: step.node.displayName || step.node.canonicalName });
          }
        }
      }
    }

    const generationDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // HTML Template with CSS Print styling
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | Career Simplified</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
    }

    .page {
      width: 210mm;
      height: 297mm;
      page-break-after: always;
      position: relative;
      padding: 20mm 18mm 18mm 18mm;
      overflow: hidden;
      background: #ffffff;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* ── Header & Footer in content pages ── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8mm;
      margin-bottom: 8mm;
    }

    .brand-logo {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-red {
      color: #690b1b;
    }

    .page-tag {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .page-footer {
      position: absolute;
      bottom: 12mm;
      left: 18mm;
      right: 18mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 4mm;
      font-size: 10px;
      color: #94a3b8;
    }

    /* ── PAGE 1: COVER ── */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: radial-gradient(circle at 10% 20%, rgba(105, 11, 27, 0.05) 0%, rgba(248, 250, 252, 0.5) 90%), #ffffff;
    }

    .cover-top {
      padding-top: 15mm;
    }

    .cover-badge {
      display: inline-block;
      padding: 6px 14px;
      background: #690b1b;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      border-radius: 100px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 15mm;
    }

    .cover-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 42px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 6mm 0;
    }

    .cover-subtitle {
      font-size: 16px;
      color: #475569;
      max-width: 140mm;
      line-height: 1.6;
      margin: 0;
    }

    .cover-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 10mm;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      margin-top: 15mm;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
    }

    .meta-item label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .meta-item span {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
    }

    .cover-footer-note {
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      padding-top: 6mm;
      margin-top: 10mm;
      display: flex;
      justify-content: space-between;
    }

    /* ── PAGE 2: TIMELINE ── */
    .section-heading {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 2mm 0;
      letter-spacing: -0.02em;
    }

    .section-desc {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 8mm 0;
    }

    .timeline-container {
      position: relative;
      padding-left: 12mm;
      margin-top: 4mm;
    }

    .timeline-container::before {
      content: '';
      position: absolute;
      left: 4.5mm;
      top: 3mm;
      bottom: 3mm;
      width: 3px;
      background: #e2e8f0;
      border-radius: 2px;
    }

    .timeline-step {
      position: relative;
      margin-bottom: 7mm;
    }

    .timeline-step:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -12mm;
      top: 2mm;
      width: 9mm;
      height: 9mm;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid #690b1b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #690b1b;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .step-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 4mm 6mm;
    }

    .step-type {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 2mm;
    }

    .step-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 2mm 0;
    }

    .step-desc {
      font-size: 12px;
      color: #475569;
      line-height: 1.4;
      margin: 0;
    }

    /* ── PAGE 3: DETAILED DECISIONS ── */
    .decision-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6mm;
    }

    .decision-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #690b1b;
      border-radius: 8px;
      padding: 5mm 6mm;
    }

    .decision-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2mm;
    }

    .decision-name {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }

    .decision-type-label {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }

    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
      margin-top: 3mm;
      padding-top: 3mm;
      border-top: 1px solid #f1f5f9;
      font-size: 11px;
    }

    .field-label {
      font-weight: 700;
      color: #64748b;
    }

    .field-value {
      color: #1e293b;
    }

    /* ── PAGE 4: ADMISSIONS & INSTITUTIONS ── */
    .table-container {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4mm;
      font-size: 11px;
    }

    .table-container th {
      background: #f1f5f9;
      padding: 8px 12px;
      text-align: left;
      font-weight: 700;
      color: #475569;
      border-bottom: 2px solid #cbd5e1;
    }

    .table-container td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
    }

    .status-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e2e8f0;
      color: #475569;
    }

    .disclaimer-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 4mm 6mm;
      margin-top: 8mm;
      font-size: 11px;
      color: #92400e;
      line-height: 1.5;
    }

    .disclaimer-box strong {
      color: #78350f;
    }
  </style>
</head>
<body>

  <!-- ── PAGE 1: COVER ── -->
  <div class="page cover-page">
    <div class="cover-top">
      <div class="cover-badge">Official Strategic Career Plan</div>
      <h1 class="cover-title">${title}</h1>
      <p class="cover-subtitle">
        A deterministic, step-by-step academic pathway map curated from verified institutional and educational frameworks.
      </p>

      <div class="cover-card">
        <div class="cover-meta-grid">
          <div class="meta-item">
            <label>Student Name</label>
            <span>${studentName}</span>
          </div>
          <div class="meta-item">
            <label>Academic Stage</label>
            <span>${grade}</span>
          </div>
          <div class="meta-item">
            <label>Date of Plan</label>
            <span>${generationDate}</span>
          </div>
          <div class="meta-item">
            <label>Total Pathway Decisions</label>
            <span>${resolvedNodes.length} Stages Mapped</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cover-footer-note">
      <span>Powered by Career Simplified Advisory Graph Engine</span>
      <span>Strict Deterministic Data Ingestion</span>
    </div>
  </div>

  <!-- ── PAGE 2: TIMELINE PATHWAY ── -->
  <div class="page">
    <div class="page-header">
      <div class="brand-logo"><span class="brand-red">Career</span> Simplified</div>
      <div class="page-tag">Pathway Route Map</div>
    </div>

    <h2 class="section-heading">Your Visual Career Route</h2>
    <p class="section-desc">Sequential decisions guiding your transition from secondary education to professional achievement.</p>

    <div class="timeline-container">
      ${detailedSteps.length === 0 ? '<p style="color: #64748b; font-size: 13px;">No specific path steps recorded yet.</p>' : ''}
      ${detailedSteps.map((step: any, index: number) => `
        <div class="timeline-step">
          <div class="timeline-dot">${index + 1}</div>
          <div class="step-card">
            <span class="step-type" style="background: ${step.typeConfig.bgColor}; color: ${step.typeConfig.color}; border: 1px solid ${step.typeConfig.borderColor};">
              ${step.typeConfig.icon} ${step.typeConfig.label}
            </span>
            <h3 class="step-title">${step.node.displayName || step.node.canonicalName}</h3>
            <p class="step-desc">${step.node.whatIsIt || step.node.description || 'Pathway option for standard progression in this domain.'}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="page-footer">
      <span>${title} • ${studentName}</span>
      <span>Page 2 of 4</span>
    </div>
  </div>

  <!-- ── PAGE 3: WHY THESE CHOICES & DETAILS ── -->
  <div class="page">
    <div class="page-header">
      <div class="brand-logo"><span class="brand-red">Career</span> Simplified</div>
      <div class="page-tag">Decision Analysis</div>
    </div>

    <h2 class="section-heading">Curriculum & Eligibility Breakdown</h2>
    <p class="section-desc">Key requirements, core competencies, and academic structure for each mapped milestone.</p>

    <div class="decision-grid">
      ${detailedSteps.slice(0, 5).map((step: any) => `
        <div class="decision-box">
          <div class="decision-header">
            <span class="decision-name">${step.node.displayName || step.node.canonicalName}</span>
            <span class="decision-type-label">${step.typeConfig.label}</span>
          </div>
          <div style="font-size: 12px; color: #475569;">
            ${step.node.whatYouStudy ? `<strong>Core Areas:</strong> ${step.node.whatYouStudy}` : (step.node.description || 'Coursework defined per accredited university syllabi.')}
          </div>
          <div class="field-row">
            <div>
              <span class="field-label">Duration:</span>
              <span class="field-value">${step.node.duration || 'Standard academic cycle'}</span>
            </div>
            <div>
              <span class="field-label">Eligibility:</span>
              <span class="field-value">${step.node.eligibility || 'Direct progression requirement'}</span>
            </div>
          </div>
          ${step.node.typicalEntryRoute ? `
            <div style="margin-top: 2mm; font-size: 10px; color: #64748b;">
              <strong>Typical Entry:</strong> ${step.node.typicalEntryRoute}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <div class="page-footer">
      <span>${title} • ${studentName}</span>
      <span>Page 3 of 4</span>
    </div>
  </div>

  <!-- ── PAGE 4: ADMISSIONS & INSTITUTIONS ── -->
  <div class="page">
    <div class="page-header">
      <div class="brand-logo"><span class="brand-red">Career</span> Simplified</div>
      <div class="page-tag">Admissions & Prospects</div>
    </div>

    <h2 class="section-heading">Entrance Exams & Institutions</h2>
    <p class="section-desc">Identified competitive exams and sample affiliated institutions offering relevant programmes.</p>

    ${exams.length > 0 ? `
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 4mm;">Relevant Entrance Examinations</h3>
      <table class="table-container">
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Target Programme</th>
            <th>Eligibility Notes</th>
          </tr>
        </thead>
        <tbody>
          ${exams.slice(0, 5).map((e: any) => `
            <tr>
              <td><strong>${e.examName}</strong></td>
              <td>${e.programmeName || 'Undergraduate'}</td>
              <td>${e.eligibilityContext || 'Refer to national conducting agency portal'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p style="font-size: 12px; color: #64748b; margin-top: 4mm;">No specific entrance examinations required for direct merit routes in this selection.</p>'}

    ${colleges.length > 0 ? `
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 6mm;">Sample Recognized Institutions</h3>
      <table class="table-container">
        <thead>
          <tr>
            <th>Institution</th>
            <th>Programme / Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${colleges.slice(0, 7).map((c: any) => `
            <tr>
              <td><strong>${c.collegeName}</strong></td>
              <td>${c.programmeName || c.parentNodeName}</td>
              <td><span class="status-badge">${c.status || 'VERIFIED'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <div class="disclaimer-box">
      <strong>Research & Verification Notice:</strong>
      All pathways, degree durations, and entrance exams are compiled from authoritative educational sources (UGC, AICTE, CBSE, and respective university handbooks). College listings represent field-level recognition and may require individual entrance qualification or counseling quota cutoffs. Please consult with your Career Simplified counsellor before finalizing application submissions.
    </div>

    <div class="page-footer">
      <span>${title} • ${studentName}</span>
      <span>Page 4 of 4</span>
    </div>
  </div>

</body>
</html>
    `;

    // Launch Headless Chromium via Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      }),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    const sanitizedTitle = (title || 'Career_Roadmap').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedTitle}_Career_Simplified.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('[Career Roadmap PDF Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate roadmap PDF' }, { status: 500 });
  }
}
