import React, { Suspense } from 'react';

export default function ParentAssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="parent-assessment-layout">
      {/* Minimal Header */}
      <header className="parent-header">
        <div className="parent-brand">
          <span className="brand-red" style={{ color: 'var(--color-red-deep, #690b1b)', fontWeight: 800 }}>Abroad</span>{' '}
          <span style={{ color: '#0f172a', fontWeight: 800 }}>Simplified</span>
          <span className="parent-badge">Family & Parent Portal</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="parent-main">
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .parent-assessment-layout {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
        }
        .parent-header {
          background-color: white;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .parent-brand {
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .parent-badge {
          font-size: 0.75rem;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 12px;
          color: #475569;
          font-weight: 600;
        }
        .parent-main {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 2rem 1rem;
        }
      `}} />
    </div>
  );
}
