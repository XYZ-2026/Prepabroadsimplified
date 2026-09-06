'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportViewerShell from '@/components/Report/ReportViewerShell';
import { buildClass10ExecutiveHTMLReport } from '@/app/(main)/psychometric-test/class10_html_report_builder';
import { buildClass10ExecutiveSummaryHTMLReport } from '@/app/(main)/psychometric-test/class10_executive_summary_builder';
import {
  getSampleStudent,
  getSampleGradeLabel,
  SAMPLE_SCORES,
  SAMPLE_PERSONALIZATION,
  SAMPLE_COMPARISON,
  SAMPLE_PARENT_PROFILE,
} from '@/config/sample-report-data.config';
import type { SampleReportType } from '@/config/sample-report-data.config';
import './sample-report.css';

// ─── Watermark Injection ─────────────────────────────────────────────────────
// Injects a diagonal "SAMPLE REPORT" watermark into the report HTML so it
// appears on every page of the iframe-rendered document.
function injectSampleWatermark(html: string): string {
  const watermarkCSS = `
    <style id="sample-watermark-styles">
      body { position: relative; }
      .as-report-page { position: relative; overflow: hidden; }
      .as-report-page::after {
        content: 'SAMPLE REPORT';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 72px;
        font-weight: 900;
        font-family: 'Poppins', sans-serif;
        color: rgba(105, 11, 27, 0.06);
        letter-spacing: 12px;
        pointer-events: none;
        z-index: 999;
        white-space: nowrap;
        text-transform: uppercase;
        user-select: none;
      }
    </style>
  `;

  if (html.includes('</head>')) {
    return html.replace('</head>', watermarkCSS + '</head>');
  }
  return watermarkCSS + html;
}

// ─── Sample Report Content ──────────────────────────────────────────────────

function SampleReportViewerContent() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get('type') || 'grade10';
  const type: SampleReportType = (['junior', 'grade10', 'grade12'].includes(rawType)
    ? rawType
    : 'grade10') as SampleReportType;

  const [viewMode, setViewMode] = useState<'full' | 'executive'>('full');
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const student = getSampleStudent(type);
  const gradeLabel = getSampleGradeLabel(type);

  // Build the report HTML using the real production engine
  const reportHtml = viewMode === 'executive'
    ? buildClass10ExecutiveSummaryHTMLReport(
        student,
        SAMPLE_SCORES,
        SAMPLE_PERSONALIZATION,
        SAMPLE_COMPARISON,
        SAMPLE_PARENT_PROFILE
      )
    : buildClass10ExecutiveHTMLReport(
        student,
        SAMPLE_SCORES,
        SAMPLE_PERSONALIZATION,
        SAMPLE_COMPARISON,
        SAMPLE_PARENT_PROFILE
      );

  // Inject watermark
  const watermarkedHtml = injectSampleWatermark(reportHtml);

  // Upsell handler for download buttons
  const handleDownloadUpsell = useCallback(() => {
    setShowUpsellModal(true);
  }, []);

  const backHref = `/psychometric-test?type=${type === 'junior' ? 'junior' : type === 'grade12' ? 'grade12' : 'grade10'}`;

  return (
    <>
      {/* Real Report Viewer Shell with sample data */}
      <ReportViewerShell
        reportHtml={watermarkedHtml}
        mode={viewMode}
        studentName={`${student.name} (Sample)`}
        studentGrade={gradeLabel}
        reportId={student.reportId}
        onSwitchMode={(newMode) => setViewMode(newMode)}
        onDownloadFull={handleDownloadUpsell}
        onDownloadSummary={handleDownloadUpsell}
        backHref={backHref}
        backLabel={`Back to ${gradeLabel} Assessment`}
      />

      {/* ── Floating Sample Badge ── */}
      <div className="sr-floating-badge">
        <div className="sr-floating-badge-dot" />
        SAMPLE REPORT — {gradeLabel}
      </div>

      {/* ── Bottom CTA Banner ── */}
      <div className="sr-cta-banner">
        <div className="sr-cta-banner-inner">
          <div className="sr-cta-banner-text">
            <span className="sr-cta-banner-label">SAMPLE REPORT</span>
            <span className="sr-cta-banner-desc">
              This is a demonstration report with fictional data. Take the assessment to get YOUR personalised report.
            </span>
          </div>
          <a href={backHref} className="sr-cta-banner-btn">
            START YOUR ASSESSMENT →
          </a>
        </div>
      </div>

      {/* ── Upsell Modal (shown when user tries to download) ── */}
      {showUpsellModal && (
        <div className="sr-upsell-overlay" onClick={() => setShowUpsellModal(false)}>
          <div className="sr-upsell-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="sr-upsell-close"
              onClick={() => setShowUpsellModal(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="sr-upsell-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#690B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h3 className="sr-upsell-title">Download Your Own Report</h3>

            <p className="sr-upsell-desc">
              Sample reports cannot be downloaded. Take the {gradeLabel} Psychometric Assessment
              to receive your own personalised, downloadable PDF report.
            </p>

            <div className="sr-upsell-features">
              <div className="sr-upsell-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>56-Page Full Diagnostic Report</span>
              </div>
              <div className="sr-upsell-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>15-Page Executive Career Edition</span>
              </div>
              <div className="sr-upsell-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Personalised Career Roadmap</span>
              </div>
              <div className="sr-upsell-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Parent-Student Alignment Matrix</span>
              </div>
            </div>

            <a href={backHref} className="sr-upsell-cta-btn">
              START YOUR ASSESSMENT →
            </a>

            <button
              className="sr-upsell-dismiss"
              onClick={() => setShowUpsellModal(false)}
            >
              Continue Viewing Sample
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function SampleReportPage() {
  return (
    <Suspense
      fallback={
        <div className="sr-loading">
          <div className="sr-loading-spinner" />
          <span className="sr-loading-text">Loading Sample Report...</span>
        </div>
      }
    >
      <SampleReportViewerContent />
    </Suspense>
  );
}
