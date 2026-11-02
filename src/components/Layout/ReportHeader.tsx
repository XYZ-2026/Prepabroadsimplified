'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useReportJobProgress } from '@/hooks/useReportJobProgress';
import { useSearchParams } from 'next/navigation';

interface ReportHeaderProps {
  userRole?: 'admin' | 'counsellor' | 'student' | null;
  activeMode?: 'full' | 'executive';
  onSwitchMode?: (mode: 'full' | 'executive') => void;
}

export default function ReportHeader({ userRole, activeMode = 'full', onSwitchMode }: ReportHeaderProps) {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  let backDestination = '/dashboard/student';
  let backLabel = 'Back to Student Dashboard';

  if (userRole === 'admin') {
    backDestination = '/dashboard/admin';
    backLabel = 'Back to Admin Dashboard';
  } else if (userRole === 'counsellor') {
    backDestination = '/dashboard/counsellor';
    backLabel = 'Back to Counsellor Dashboard';
  }

  const handleSwitch = (mode: 'full' | 'executive') => {
    if (onSwitchMode) {
      onSwitchMode(mode);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('switch-report-mode', { detail: { mode } }));
    }
  };

  const {
    jobState,
    retryLastJob,
    isGenerating,
    isFullGenerating,
    isExecGenerating,
  } = useReportJobProgress();

  const handleDownloadFull = () => {
    if (isGenerating) return;
    if (typeof (window as any).__triggerReportDownload === 'function') {
      (window as any).__triggerReportDownload('full');
    } else {
      window.dispatchEvent(new CustomEvent('trigger-pdf-download', { detail: { reportType: 'full' } }));
    }
  };

  const handleDownloadExecutive = () => {
    if (isGenerating) return;
    if (typeof (window as any).__triggerSummaryDownload === 'function') {
      (window as any).__triggerSummaryDownload();
    } else if (typeof (window as any).__triggerReportDownload === 'function') {
      (window as any).__triggerReportDownload('executive');
    } else {
      window.dispatchEvent(new CustomEvent('trigger-summary-download'));
      window.dispatchEvent(new CustomEvent('trigger-pdf-download', { detail: { reportType: 'executive' } }));
    }
  };
  const handleClose = () => {
    if (window.history.length > 1) {
      window.close();
    } else {
      window.location.href = backDestination;
    }
  };

  return (
    <header className="report-header no-print">
      <style>{`
        @keyframes progressPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .download-btn-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
        }
        .download-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #93C5FD 0%, #FFFFFF 100%);
          transition: width 0.15s ease-out;
          border-radius: 0 2px 2px 0;
          z-index: 2;
        }
        .download-progress-bar-outline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563EB 0%, #60A5FA 100%);
          transition: width 0.15s ease-out;
          border-radius: 0 2px 2px 0;
          z-index: 2;
        }
        .download-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .download-spinner-outline {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(37,99,235,0.2);
          border-top-color: #2563EB;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="report-header-left">
        <Link href={backDestination} className="report-btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{backLabel}</span>
        </Link>

        <div className="report-brand">
          <span style={{ color: '#080F1C', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.02em' }}>CLARVO</span>
          <span className="report-badge">Official Report View</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
        gap: '4px',
      }}>
        <button
          type="button"
          onClick={() => handleSwitch('full')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9px',
            fontSize: '11.5px',
            fontWeight: activeMode === 'full' ? 800 : 600,
            letterSpacing: '0.3px',
            border: activeMode === 'full' ? '1px solid #2563EB' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: activeMode === 'full' ? '#2563EB' : 'transparent',
            color: activeMode === 'full' ? '#ffffff' : '#475569',
            boxShadow: activeMode === 'full' ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
          }}
          title="Switch to 56-Page Full Diagnostic Report Preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeMode === 'full' ? '#ffffff' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>FULL REPORT (56P)</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch('executive')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9px',
            fontSize: '11.5px',
            fontWeight: activeMode === 'executive' ? 800 : 600,
            letterSpacing: '0.3px',
            border: activeMode === 'executive' ? '1px solid #2563EB' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: activeMode === 'executive' ? '#2563EB' : 'transparent',
            color: activeMode === 'executive' ? '#ffffff' : '#475569',
            boxShadow: activeMode === 'executive' ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
          }}
          title="Switch to 15-Page Executive Career Edition Preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeMode === 'executive' ? '#ffffff' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>EXECUTIVE EDITION (15P)</span>
        </button>
      </div>

      <div className="report-header-right">
        {/* Download Full PDF Button */}
        <div className="download-btn-wrapper">
          <button 
            type="button"
            onClick={jobState.status === 'failed' && jobState.reportType === 'full' ? retryLastJob : handleDownloadFull}
            disabled={isGenerating && !isFullGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              cursor: isFullGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isFullGenerating ? '#1D4ED8' : '#2563EB',
              color: '#ffffff',
              border: '1px solid #1D4ED8',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3), 0 1px 2px rgba(0,0,0,0.1)',
              opacity: (isGenerating && !isFullGenerating) ? 0.6 : 1,
              position: 'relative',
              overflow: 'hidden',
            }}
            title="Download Complete 56-Page Full Diagnostic PDF"
          >
            {isFullGenerating ? (
              <span className="download-spinner" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            )}
            <span>{jobState.status === 'failed' && jobState.reportType === 'full' ? 'Failed (Retry)' : isFullGenerating ? (jobState.isStalled ? 'Still working...' : `${jobState.stageDetail ? `${jobState.stageDetail} (${jobState.percent}%)` : `Generating… ${jobState.percent}%`}`) : 'Download Full PDF'}</span>
          </button>
          {isFullGenerating && (
            <div className="download-progress-bar" style={{ width: `${jobState.percent}%`, transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          )}
        </div>

        {/* Download Executive Summary Button */}
        <div className="download-btn-wrapper">
          <button 
            type="button"
            onClick={jobState.status === 'failed' && jobState.reportType === 'executive' ? retryLastJob : handleDownloadExecutive}
            disabled={isGenerating && !isExecGenerating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '7px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              cursor: isExecGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isExecGenerating ? '#F1F5F9' : '#FFFFFF',
              color: isExecGenerating ? '#1D4ED8' : '#2563EB',
              border: '1.5px solid #2563EB',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
              opacity: (isGenerating && !isExecGenerating) ? 0.6 : 1,
              position: 'relative',
              overflow: 'hidden',
            }}
            title="Download Compact 15-Page Executive Career Summary PDF"
          >
            {isExecGenerating ? (
              <span className="download-spinner-outline" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            )}
            <span>{jobState.status === 'failed' && jobState.reportType === 'executive' ? 'Failed (Retry)' : isExecGenerating ? (jobState.isStalled ? 'Still working...' : `${jobState.stageDetail ? `${jobState.stageDetail} (${jobState.percent}%)` : `Generating… ${jobState.percent}%`}`) : 'Download Summary PDF'}</span>
          </button>
          {isExecGenerating && (
            <div className="download-progress-bar-outline" style={{ width: `${jobState.percent}%`, transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          )}
        </div>

        {/* Rate & Review Button */}
        <Link
          href={`/submit-review?report=${activeMode === 'executive' ? 'executive' : 'psychometric'}&source=${source || 'report-header'}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 15px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            color: '#92400E',
            border: '1.5px solid #FCD34D',
            boxShadow: '0 1px 3px rgba(245, 158, 11, 0.15)',
            textDecoration: 'none',
          }}
          title="Share your review and rating of this report"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Rate &amp; Review</span>
        </Link>

        <button 
          type="button"
          onClick={handleClose} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: '#f8fafc',
            color: '#334155',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          title="Close this report tab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>Close Tab</span>
        </button>
      </div>
    </header>
  );
}
