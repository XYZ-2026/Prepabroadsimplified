'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ReportHeaderProps {
  userRole?: 'admin' | 'counsellor' | 'student' | null;
  activeMode?: 'full' | 'executive';
  onSwitchMode?: (mode: 'full' | 'executive') => void;
}

export default function ReportHeader({ userRole, activeMode = 'full', onSwitchMode }: ReportHeaderProps) {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  // Determine smart back destination based on source parameter or user role
  let backDestination = '/dashboard/student/assessments';
  let backLabel = 'Back to Assessments';

  if (source === 'admin' || userRole === 'admin') {
    backDestination = '/dashboard/admin/assessments';
    backLabel = 'Back to Admin Assessments';
  } else if (source === 'counsellor' || userRole === 'counsellor') {
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

  const handleDownloadFull = () => {
    if (typeof window !== 'undefined' && typeof (window as any).__triggerReportDownload === 'function') {
      (window as any).__triggerReportDownload('full');
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-pdf-download', { detail: { reportType: 'full' } }));
    }
  };

  const handleDownloadExecutive = () => {
    if (typeof window !== 'undefined' && typeof (window as any).__triggerSummaryDownload === 'function') {
      (window as any).__triggerSummaryDownload();
    } else if (typeof window !== 'undefined' && typeof (window as any).__triggerReportDownload === 'function') {
      (window as any).__triggerReportDownload('executive');
    } else if (typeof window !== 'undefined') {
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
      <div className="report-header-left">
        <Link href={backDestination} className="report-btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{backLabel}</span>
        </Link>

        <div className="report-brand">
          <span className="brand-red" style={{ color: 'var(--color-red-deep, #690b1b)', fontWeight: 800 }}>Abroad</span>{' '}
          <span style={{ color: '#0f172a', fontWeight: 800 }}>Simplified</span>
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
            border: activeMode === 'full' ? '1px solid rgba(201, 165, 93, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: activeMode === 'full' ? 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)' : 'transparent',
            color: activeMode === 'full' ? '#ffffff' : '#475569',
            boxShadow: activeMode === 'full' ? '0 2px 8px rgba(105,11,27,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
          }}
          title="Switch to 56-Page Full Diagnostic Report Preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeMode === 'full' ? '#C9A55D' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            border: activeMode === 'executive' ? '1px solid rgba(201, 165, 93, 0.5)' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: activeMode === 'executive' ? 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)' : 'transparent',
            color: activeMode === 'executive' ? '#ffffff' : '#475569',
            boxShadow: activeMode === 'executive' ? '0 2px 8px rgba(105,11,27,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
          }}
          title="Switch to 15-Page Executive Career Edition Preview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeMode === 'executive' ? '#C9A55D' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>EXECUTIVE EDITION (15P)</span>
        </button>
      </div>

      <div className="report-header-right">
        <button 
          type="button"
          onClick={handleDownloadFull} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)',
            color: '#ffffff',
            border: '1px solid #851224',
            boxShadow: '0 2px 8px rgba(105, 11, 27, 0.3), 0 1px 2px rgba(0,0,0,0.1)',
          }}
          title="Download Complete 56-Page Full Diagnostic PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A55D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Full PDF</span>
        </button>

        <button 
          type="button"
          onClick={handleDownloadExecutive} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
            color: '#690B1B',
            border: '1.5px solid #C9A55D',
            boxShadow: '0 2px 8px rgba(201, 165, 93, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
          title="Download Compact 15-Page Executive Career Summary PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A55D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Download Summary PDF</span>
        </button>

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
