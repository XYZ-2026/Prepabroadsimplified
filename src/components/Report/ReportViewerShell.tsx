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
      body { 
        padding-top: 0 !important; 
        margin-top: 0 !important; 
        overflow-x: hidden !important;
      }
      /* Ensure pages have slight gap for scrolling clarity */
      .as-report-page { 
        margin-bottom: 16px !important; 
        box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
      }
      /* Smooth scrolling inside iframe */
      html { scroll-behavior: smooth; }

      @media screen and (max-width: 820px) {
        body {
          padding: 8px 4px !important;
          background: #e2e8f0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }
        .as-report-page {
          max-width: calc(100vw - 12px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          box-sizing: border-box !important;
        }
      }
    </style>
  `;

  // 2. Inject the page-tracking script before </body>
  const trackingScript = `
    <script id="viewer-shell-tracking">
    (function() {
      // 0. Responsive fit-to-width scaling on mobile
      function adjustMobileScale() {
        var screenW = window.innerWidth;
        if (screenW < 800) {
          var targetW = screenW - 12;
          var baseW = 794; // 210mm standard CSS width
          var factor = Math.max(0.40, Math.min(1.0, targetW / baseW));
          var pagesList = document.querySelectorAll('.as-report-page');
          pagesList.forEach(function(p) {
            p.style.transformOrigin = 'top center';
            if ('zoom' in p.style) {
              p.style.zoom = String(Number(factor.toFixed(3)));
            } else {
              p.style.transform = 'scale(' + Number(factor.toFixed(3)) + ')';
              p.style.marginBottom = 'calc(297mm * ' + factor + ' - 297mm + 16px)';
            }
          });
        } else {
          var pagesList = document.querySelectorAll('.as-report-page');
          pagesList.forEach(function(p) {
            if ('zoom' in p.style) {
              p.style.zoom = '1';
            } else {
              p.style.transform = 'none';
              p.style.marginBottom = '16px';
            }
          });
        }
      }
      window.addEventListener('resize', adjustMobileScale);
      window.addEventListener('load', adjustMobileScale);
      setTimeout(adjustMobileScale, 150);
      setTimeout(adjustMobileScale, 600);

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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);
  const totalPages = mode === 'full' ? 56 : 15;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // ── Listen for postMessage from iframe + readiness fallback ──
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

    // Readiness polling & timeout fallback in case postMessage fired before listener attached
    const checkReady = () => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc && (doc.readyState === 'complete' || doc.readyState === 'interactive') && doc.querySelector('.as-report-page')) {
          setIframeReady(true);
        }
      } catch {
        // Cross-origin fallback
      }
    };
    checkReady();
    const interval = setInterval(checkReady, 250);
    const timeout = setTimeout(() => {
      setIframeReady(true);
      clearInterval(interval);
    }, 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
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

  if (isMobile) {
    return (
      <div
        className="report-viewer-shell no-print"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          background: '#f1f5f9',
        }}
      >
        {/* ── Mobile Top Toolbar ── */}
        <div
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            zIndex: 30,
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <a
            href={backHref}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#334155', fontWeight: 600, fontSize: '12px',
              textDecoration: 'none', padding: '6px 10px', borderRadius: '8px',
              background: '#f8fafc', border: '1px solid #cbd5e1',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </a>

          {/* Mode Switcher Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '2px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            gap: '2px',
          }}>
            <button
              type="button"
              onClick={() => handleSwitchMode('full')}
              style={{
                padding: '4px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: mode === 'full' ? 800 : 600,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'full' ? MAROON : 'transparent',
                color: mode === 'full' ? '#ffffff' : '#475569',
              }}
            >
              Full (56P)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('executive')}
              style={{
                padding: '4px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: mode === 'executive' ? 800 : 600,
                border: 'none',
                cursor: 'pointer',
                background: mode === 'executive' ? MAROON : 'transparent',
                color: mode === 'executive' ? '#ffffff' : '#475569',
              }}
            >
              Exec (15P)
            </button>
          </div>

          {/* Sections drawer toggle & download */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setMobileSectionsOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                background: '#f8fafc',
                color: MAROON,
                border: `1.5px solid ${MAROON}`,
                cursor: 'pointer',
              }}
            >
              📑 Sections
            </button>
            <button
              type="button"
              onClick={mode === 'full' ? onDownloadFull : onDownloadSummary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                background: MAROON,
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              📥 PDF
            </button>
          </div>
        </div>

        {/* ── Mobile Viewport ── */}
        <div
          style={{
            flex: 1,
            height: 'calc(100vh - 104px)',
            overflow: 'hidden',
            background: '#e2e8f0',
            position: 'relative',
          }}
        >
          {!iframeReady && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: '#f1f5f9', zIndex: 5,
              flexDirection: 'column', gap: '12px',
            }}>
              <div style={{
                width: '32px', height: '32px', border: `3px solid #e2e8f0`,
                borderTopColor: MAROON, borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Loading {mode === 'full' ? '56' : '15'}-page report...
              </span>
            </div>
          )}

          <iframe
            ref={iframeRef}
            srcDoc={preparedHtml}
            onLoad={() => setIframeReady(true)}
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

        {/* ── Mobile Bottom Navigation Bar (Prev / Next & Page Stepper) ── */}
        <div
          style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => {
              const prev = Math.max(1, activePage - 1);
              scrollToPage(prev);
              setActivePage(prev);
            }}
            disabled={activePage <= 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: activePage <= 1 ? '#94a3b8' : '#334155',
              cursor: activePage <= 1 ? 'not-allowed' : 'pointer',
              minHeight: '36px',
            }}
          >
            ‹ Prev
          </button>

          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
            Page {activePage} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/ {totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => {
              const next = Math.min(totalPages, activePage + 1);
              scrollToPage(next);
              setActivePage(next);
            }}
            disabled={activePage >= totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: activePage >= totalPages ? '#f8fafc' : MAROON,
              border: activePage >= totalPages ? '1px solid #cbd5e1' : `1px solid ${MAROON}`,
              color: activePage >= totalPages ? '#94a3b8' : '#ffffff',
              cursor: activePage >= totalPages ? 'not-allowed' : 'pointer',
              minHeight: '36px',
            }}
          >
            Next ›
          </button>
        </div>

        {/* ── Mobile Sections Drawer ── */}
        {mobileSectionsOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.55)',
              backdropFilter: 'blur(3px)',
              zIndex: 1000,
              display: 'flex',
            }}
            onClick={() => setMobileSectionsOpen(false)}
          >
            <div
              style={{
                width: 'min(310px, 85vw)',
                height: '100%',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                  Report Sections
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSectionsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <ReportNavigationSidebar
                  mode={mode}
                  viewerRole={viewerRole}
                  studentName={studentName}
                  studentGrade={studentGrade}
                  reportId={reportId}
                  activePage={activePage}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                  onSelectPage={(pageNum) => {
                    scrollToPage(pageNum);
                    setActivePage(pageNum);
                    setMobileSectionsOpen(false);
                  }}
                  onSwitchMode={(newMode) => {
                    handleSwitchMode(newMode);
                    setMobileSectionsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
          onLoad={() => setIframeReady(true)}
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
