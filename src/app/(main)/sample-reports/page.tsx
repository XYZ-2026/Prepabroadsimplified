'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SampleReportsHubPage() {
  const [missingAssetNotice, setMissingAssetNotice] = useState<{
    isOpen: boolean;
    reportName: string;
    previewUrl: string;
  }>({
    isOpen: false,
    reportName: '',
    previewUrl: '',
  });

  const handleDownload = (reportName: string, previewUrl: string) => {
    // In accordance with asset integrity requirements, check if a static pre-compiled PDF exists.
    // As verified in repository inspection, static PDF assets are not bundled in repository storage.
    // Rather than generating a 404 or broken file download, provide an explicit, helpful asset notification
    // with direct access to the high-fidelity interactive report engine and browser print/export.
    setMissingAssetNotice({
      isOpen: true,
      reportName,
      previewUrl,
    });
  };

  const closeNotice = () => {
    setMissingAssetNotice({ isOpen: false, reportName: '', previewUrl: '' });
  };

  return (
    <div style={{ minHeight: '85vh', background: '#F8FAFC', padding: '56px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#2563EB', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            ← Back to CLARVO Home
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
          <div style={{ display: 'inline-block', background: '#E8F0FF', color: '#2563EB', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Diagnostic Dossier Showcase
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#080F1C', letterSpacing: '-0.02em', lineHeight: '1.2', margin: '0 0 16px 0' }}>
            Explore CLARVO Sample Reports
          </h1>

          <p style={{ fontSize: '16px', color: '#344054', lineHeight: '1.6', margin: '0 0 8px 0' }}>
            Experience the precision of our psychometric evaluation frameworks. Review how 30 diagnostic modules uncover cognitive aptitudes, personality traits, and career alignment for students in Grades 7–12.
          </p>

          <p style={{ fontSize: '13px', color: '#667085' }}>
            Available without login. Click below to inspect our executive summary or full clinical dossier.
          </p>
        </div>

        {/* Two Report Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          
          {/* Card 1: Summary Sample Report */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'between', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ background: '#E8F0FF', color: '#2563EB', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                  15-Page Edition
                </span>
                <span style={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>
                  Aarav Sharma (Class 10)
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#080F1C', margin: '0 0 12px 0' }}>
                Summary Sample Report
              </h2>

              <p style={{ fontSize: '14px', color: '#344054', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                The Executive Career Summary provides a streamlined breakdown of core cognitive aptitude, top RIASEC occupational matches, personality index scores, and key recommendations.
              </p>

              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '16px', marginBottom: '28px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#080F1C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  What's Included:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#667085', lineHeight: '1.7' }}>
                  <li>Cognitive percentile ranking & aptitude breakdown</li>
                  <li>Top career fitments with fitment scores (%)</li>
                  <li>Big Five personality archetypes & VARK learning style</li>
                  <li>Family academic alignment index</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/sample-report?mode=executive"
                style={{
                  padding: '13px 20px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                }}
              >
                <span>View Summary Report Preview</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                id="btn-download-summary-report"
                onClick={() => handleDownload('Summary Sample Report', '/sample-report?mode=executive')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  color: '#344054',
                  border: '1.5px solid #E4E7EC',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
              >
                <span>📥</span>
                <span>Download Summary Report</span>
              </button>
            </div>
          </div>

          {/* Card 2: Detailed Sample Report */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #BFDBFE', padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'between', boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.08)', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ background: '#080F1C', color: '#FFFFFF', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                  56-Page Full Dossier
                </span>
                <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 700 }}>
                  Clinical Comprehensive
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#080F1C', margin: '0 0 12px 0' }}>
                Detailed Sample Report
              </h2>

              <p style={{ fontSize: '14px', color: '#344054', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                The complete diagnostic dossier. Deep-dive into all 30 psychometric modules, multi-dimensional score distributions, psychologist advisory points, and academic stream recommendations.
              </p>

              <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '16px', marginBottom: '28px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#080F1C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  What's Included:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#667085', lineHeight: '1.7' }}>
                  <li>All 30 psychometric modules with item-level analysis</li>
                  <li>Multi-tiered career progression & subject combination maps</li>
                  <li>Psychologist Advisory observations & strengths breakdown</li>
                  <li>Class 11 stream selection protocols & risk mitigation notes</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/sample-report?mode=full"
                style={{
                  padding: '13px 20px',
                  borderRadius: '10px',
                  background: '#080F1C',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(8, 15, 28, 0.2)',
                }}
              >
                <span>View Detailed Report Preview</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                id="btn-download-detailed-report"
                onClick={() => handleDownload('Detailed Sample Report', '/sample-report?mode=full')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  color: '#344054',
                  border: '1.5px solid #E4E7EC',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
              >
                <span>📥</span>
                <span>Download Detailed Report</span>
              </button>
            </div>
          </div>

        </div>

        {/* Demo Marketing CTA Banner */}
        <div style={{ background: '#080F1C', borderRadius: '24px', padding: '48px 36px', color: '#FFFFFF', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ maxWidth: '620px' }}>
            <span style={{ color: '#93C5FD', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Personalised Guidance for Grades 7–12
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
              Want to see how CLARVO works for your student?
            </h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: '1.6' }}>
              Connect with our academic advisory team for an individualized consultation, platform walkthrough, and roadmap planning session.
            </p>
          </div>
          <div>
            <Link
              href="/book-a-demo"
              style={{
                display: 'inline-block',
                background: '#2563EB',
                color: '#FFFFFF',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              }}
            >
              Book a Demo →
            </Link>
          </div>
        </div>

      </div>

      {/* Missing Asset Notification Modal */}
      {missingAssetNotice.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeNotice}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 15, 28, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '32px 28px',
              border: '1px solid #E4E7EC',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                <span>ℹ️</span>
                <span>Asset Notice</span>
              </div>
              <button
                onClick={closeNotice}
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#667085' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#080F1C', margin: '0 0 10px 0' }}>
              {missingAssetNotice.reportName}
            </h3>

            <p style={{ fontSize: '14px', color: '#344054', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              A pre-compiled static PDF file is currently unavailable in repository storage. Rather than presenting a broken file link, you can inspect the complete high-fidelity dossier in our <strong>Live Interactive Report Viewer</strong>.
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '14px', marginBottom: '24px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#667085', lineHeight: '1.5' }}>
                💡 <strong>Tip:</strong> In the Interactive Report Viewer, you can review all visual modules and use your browser's Print dialog (<code>Ctrl+P</code> or <code>Cmd+P</code>) to export or save a high-resolution PDF dossier anytime.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeNotice}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#667085',
                  border: '1px solid #E4E7EC',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <Link
                href={missingAssetNotice.previewUrl}
                onClick={closeNotice}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Open Interactive Report Viewer →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
