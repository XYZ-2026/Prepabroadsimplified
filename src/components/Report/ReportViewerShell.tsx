'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReportNavigationSidebar from './ReportNavigationSidebar';

/* ────────────────────────────────────────────────────────────
   ReportViewerShell
   ─────────────────────────────────────────────────────────
   Architecture:
     ┌──────────────────────────────────────────────────────┐
     │                  VIEWER TOOLBAR                      │
     ├──────────────┬───────────────────────────────────────┤
     │   SIDEBAR    │   REPORT VIEWPORT (iframe srcdoc)     │
     │  (fixed col) │   ┌──────────────────────────┐        │
     │              │   │ A4 Page (210×297mm)       │        │
     │              │   └──────────────────────────┘        │
     │              │   ┌──────────────────────────┐        │
     │              │   │ A4 Page                   │        │
     │              │   └──────────────────────────┘        │
     │  Quick Jump  │   ... 56 or 15 pages ...              │
     └──────────────┴───────────────────────────────────────┘

   The iframe uses srcdoc to render the EXACT same HTML that
   the PDF generator sees — same CSS, same fonts, same layout.
   The sidebar lives in a separate CSS Grid column with its
   own scroll context, so it never scrolls away.
   ────────────────────────────────────────────────────────── */

interface ReportViewerShellProps {
  reportHtml: string;
  mode: 'full' | 'executive';
  viewerRole?: 'student' | 'counsellor' | 'admin';
  studentName: string;
  studentGrade: string;
  reportId: string;
  onSwitchMode: (mode: 'full' | 'executive') => void;
  onDownloadFull: () => void;
  onDownloadSummary: () => void;
  backHref: string;
  backLabel: string;
}

/* ── Inject observer + scroll listener script into report HTML ── */
function prepareReportHtml(html: string): string {
  // 1. Hide the report's internal sticky nav bar (the maroon bar at top)
  //    by injecting CSS that hides it. The viewer shell has its own toolbar.
  const hideNavCSS = `
    <style id="viewer-shell-overrides">
      /* Hide report's own sticky nav — viewer shell provides toolbar */
      nav.sticky { display: none !important; }
      /* Remove top margin/padding that the nav would have caused */
      body { padding-top: 0 !important; margin-top: 0 !important; }
      /* Ensure pages have slight gap for scrolling clarity */
      .as-report-page { margin-bottom: 16px !important; }
      /* Smooth scrolling inside iframe */
      html { scroll-behavior: smooth; }
    </style>
  `;

  // 2. Inject the page-tracking script before </body>
  const trackingScript = `
    <script id="viewer-shell-tracking">
    (function() {
      // 1. Stamp 1-indexed data-page and id on every .as-report-page element as absolute guarantee
      var pages = document.querySelectorAll('.as-report-page');
      pages.forEach(function(el, idx) {
        var p = idx + 1;
        if (!el.getAttribute('data-page')) {
          el.setAttribute('data-page', String(p));
        }
        if (!el.id) {
          el.id = 'page-' + p;
        }
      });

      // 2. IntersectionObserver to report active page to parent window
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting && e.intersectionRatio >= 0.25) {
            var p = parseInt(e.target.getAttribute('data-page') || '0', 10);
            if (p > 0) {
              window.parent.postMessage({ type: 'report-page-visible', page: p }, '*');
            }
          }
        });
      }, { threshold: [0.25, 0.5] });

      pages.forEach(function(el) { observer.observe(el); });

      // 3. Page jump helper with detailed diagnostics and index fallback
      function jumpToPage(targetPage, title) {
        var pagesList = document.querySelectorAll('.as-report-page');
        var el = pagesList[targetPage - 1] || 
                 document.querySelector('[data-page="' + targetPage + '"]') || 
                 document.getElementById('page-' + targetPage);
        
        var targetFound = !!el;
        var targetOffset = el ? el.offsetTop : -1;
        
        console.log('[NAVIGATION CLICK]', {
          title: title || ('Page ' + targetPage),
          page: targetPage,
          targetId: el ? (el.id || ('page-' + targetPage)) : 'NOT_FOUND',
          targetFound: targetFound,
          scrollContainerFound: true,
          targetOffset: targetOffset,
          headerOffset: 0
        });

        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth'
          });
          console.log('[NAVIGATION RESULT]', {
            page: targetPage,
            activePage: targetPage
          });
        } else {
          console.warn('[NAVIGATION FAILED] Could not find DOM target for page ' + targetPage);
        }
      }

      // 4. Listen for scroll-to commands from parent window
      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'scroll-to-page') {
          var targetPage = parseInt(e.data.page, 10);
          if (!isNaN(targetPage) && targetPage > 0) {
            jumpToPage(targetPage, e.data.title);
          }
        }
      });

      // 5. Signal ready to parent window
      window.parent.postMessage({ type: 'report-iframe-ready' }, '*');
    })();
    <\/script>
  `;

  // Insert the CSS after <head> or at start
  let result = html;
  if (result.includes('</head>')) {
    result = result.replace('</head>', hideNavCSS + '</head>');
  } else {
    result = hideNavCSS + result;
  }

  // Insert the script before </body>
  if (result.includes('</body>')) {
    result = result.replace('</body>', trackingScript + '</body>');
  } else {
    result = result + trackingScript;
  }

  return result;
}

export default function ReportViewerShell({
  reportHtml,
  mode,
  viewerRole = 'counsellor',
  studentName,
  studentGrade,
  reportId,
  onSwitchMode,
  onDownloadFull,
  onDownloadSummary,
  backHref,
  backLabel,
}: ReportViewerShellProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pendingScrollPageRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [iframeReady, setIframeReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const totalPages = mode === 'full' ? 56 : 15;

  // ── Send scroll command to iframe ──
  const scrollToPage = useCallback((pageNum: number) => {
    console.log('[NAV CLICK START]', {
      page: pageNum,
      currentURL: typeof window !== 'undefined' ? window.location.href : '',
      iframeContentWindowReady: !!iframeRef.current?.contentWindow
    });

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'scroll-to-page', page: pageNum },
        '*'
      );
    } else {
      pendingScrollPageRef.current = pageNum;
    }

    console.log('[NAV CLICK END]', {
      page: pageNum,
      routerNavTriggered: false,
      viewerRemountTriggered: false
    });
  }, []);

  // ── Listen for postMessage from iframe ──
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'report-page-visible') {
        const p = e.data.page;
        if (typeof p === 'number' && p >= 1 && p <= totalPages) {
          setActivePage(p);
        }
      } else if (e.data.type === 'report-iframe-ready') {
        setIframeReady(true);
        if (pendingScrollPageRef.current !== null) {
          scrollToPage(pendingScrollPageRef.current);
          pendingScrollPageRef.current = null;
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [totalPages, scrollToPage]);

  // ── Handle mode switch ──
  const handleSwitchMode = useCallback((newMode: 'full' | 'executive') => {
    setActivePage(1);
    setIframeReady(false);
    onSwitchMode(newMode);
    // Update URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      url.searchParams.set('page', '1');
      window.history.replaceState(null, '', url.toString());
    }
  }, [onSwitchMode]);

  // Prepare the HTML for the iframe
  const preparedHtml = prepareReportHtml(reportHtml);

  // Brand colors for inline styles
  const MAROON = '#690B1B';
  const MAROON_DARK = '#4A0E17';
  const GOLD = '#C9A55D';
  const CREAM = '#FAF8F5';

  return (
    <div
      className="report-viewer-shell no-print"
      style={{
        display: 'grid',
        gridTemplateRows: '56px 1fr',
        gridTemplateColumns: sidebarCollapsed ? '64px 1fr' : '280px 1fr',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        background: '#f1f5f9',
        transition: 'grid-template-columns 0.3s ease',
      }}
    >
      {/* ════════════════════════════════════════════════════════
          ROW 1: VIEWER TOOLBAR (spans both columns)
          ════════════════════════════════════════════════════════ */}
      <div
        className="report-viewer-toolbar"
        style={{
          gridColumn: '1 / -1',
          gridRow: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          zIndex: 20,
          gap: '12px',
          minHeight: '56px',
        }}
      >
        {/* Left: Back + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <a
            href={backHref}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#334155', fontWeight: 600, fontSize: '12px',
              textDecoration: 'none', padding: '6px 14px', borderRadius: '10px',
              background: '#f8fafc', border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{backLabel}</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: MAROON, fontWeight: 800, fontSize: '14px' }}>Abroad</span>
            <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '14px' }}>Simplified</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px',
              background: '#e0f2fe', color: '#0369a1', textTransform: 'uppercase' as const,
              letterSpacing: '0.5px', whiteSpace: 'nowrap' as const,
            }}>
              Official Report Viewer
            </span>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
          gap: '4px',
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={() => handleSwitchMode('full')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9px',
              fontSize: '11.5px',
              fontWeight: mode === 'full' ? 800 : 600,
              letterSpacing: '0.3px',
              border: mode === 'full' ? '1px solid rgba(201, 165, 93, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: mode === 'full' ? 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)' : 'transparent',
              color: mode === 'full' ? '#ffffff' : '#475569',
              boxShadow: mode === 'full' ? '0 2px 8px rgba(105,11,27,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mode === 'full' ? '#C9A55D' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <span>FULL REPORT (56P)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('executive')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9px',
              fontSize: '11.5px',
              fontWeight: mode === 'executive' ? 800 : 600,
              letterSpacing: '0.3px',
              border: mode === 'executive' ? '1px solid rgba(201, 165, 93, 0.5)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: mode === 'executive' ? 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)' : 'transparent',
              color: mode === 'executive' ? '#ffffff' : '#475569',
              boxShadow: mode === 'executive' ? '0 2px 8px rgba(105,11,27,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mode === 'executive' ? '#C9A55D' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>EXECUTIVE EDITION (15P)</span>
          </button>
        </div>

        {/* Right: Download buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onDownloadFull}
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A55D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download Full PDF</span>
          </button>
          <button
            type="button"
            onClick={onDownloadSummary}
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A55D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Download Summary PDF</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          ROW 2, COL 1: SIDEBAR (own scroll context)
          ════════════════════════════════════════════════════════ */}
      <div
        style={{
          gridColumn: '1',
          gridRow: '2',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
          borderRight: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <ReportNavigationSidebar
          mode={mode}
          viewerRole={viewerRole}
          studentName={studentName}
          studentGrade={studentGrade}
          reportId={reportId}
          activePage={activePage}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          onSelectPage={(pageNum) => {
            scrollToPage(pageNum);
            setActivePage(pageNum);
          }}
          onSwitchMode={handleSwitchMode}
        />
      </div>

      {/* ════════════════════════════════════════════════════════
          ROW 2, COL 2: REPORT VIEWPORT (iframe)
          ════════════════════════════════════════════════════════ */}
      <div
        style={{
          gridColumn: '2',
          gridRow: '2',
          height: 'calc(100vh - 56px)',
          overflow: 'hidden',
          background: '#e2e8f0',
          position: 'relative',
        }}
      >
        {/* Loading indicator */}
        {!iframeReady && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#f1f5f9', zIndex: 5,
            flexDirection: 'column', gap: '12px',
          }}>
            <div style={{
              width: '36px', height: '36px', border: `3px solid #e2e8f0`,
              borderTopColor: MAROON, borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Loading {mode === 'full' ? '56' : '15'}-page report...
            </span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={preparedHtml}
          title={`${mode === 'full' ? 'Full Diagnostic Report' : 'Executive Career Edition'} — ${studentName}`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            opacity: iframeReady ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
