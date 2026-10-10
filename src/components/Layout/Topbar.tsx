'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CAREER_ROADMAP_ENABLED } from '@/config/feature-flags';
import styles from '@/styles/components.module.css';

export default function Topbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTestPage = pathname === '/iq-test/test';
  const isRoadmap = CAREER_ROADMAP_ENABLED && pathname?.startsWith('/career-roadmap');

  const toggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <header className={`topbar ${styles.topbar} ${scrolled ? styles.topbarScrolled : ''}`}>
      <div className={styles.topbarLeft}>
        {!isTestPage && (
          <button
            className={styles.hamburgerBtn}
            onClick={toggleSidebar}
            aria-label="Open sidebar menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <Link href={isRoadmap ? "/career-roadmap" : "/"} className={styles.topbarLogo} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontFamily: 'var(--font-primary)',
            fontWeight: 900, 
            fontSize: '22px', 
            letterSpacing: '-0.03em', 
            color: 'var(--clarvo-deep-black, #080F1C)' 
          }}>
            CLARVO
          </span>
        </Link>
      </div>

      {/* Center navigation on Home Page; Tagline on secondary pages */}
      {pathname === '/' ? (
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-600">
          <Link href="/discover" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            Discover
          </Link>
          <Link href="/about-us" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            About Us
          </Link>
          <Link href="/book-a-demo" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            Academic Excellence
          </Link>
          <Link href="/career-roadmap" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            Research & Profile Building
          </Link>
          <Link href="/sample-reports" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            Our Approach
          </Link>
        </nav>
      ) : (
        <div className={styles.topbarCenter} style={{ color: 'var(--clarvo-text-secondary, #667085)', fontWeight: 500, fontSize: '13px' }}>
          {!isRoadmap && 'Clarity for Their Future.'}
        </div>
      )}

      {/* Right Actions: On Home Page show Sign In & Sign Up; On other pages show Sample Reports & Book a Demo without redundant auth buttons */}
      <div className={styles.topbarRight} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {pathname === '/' ? (
          <>
            <Link 
              href="/auth?tab=login" 
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300"
              style={{ textDecoration: 'none' }}
            >
              Sign In
            </Link>
            <Link 
              href="/auth?tab=register" 
              style={{ 
                background: '#2563EB', 
                color: '#FFFFFF', 
                fontWeight: 700, 
                fontSize: '12px', 
                padding: '7px 16px', 
                borderRadius: '8px', 
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/sample-reports" 
              className="hidden md:inline-flex text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sample Reports
            </Link>
            <Link 
              href="/book-a-demo" 
              className={styles.btnTopbarCta}
              style={{ textDecoration: 'none' }}
            >
              Book a Demo
            </Link>
          </>
        )}
        <button className={styles.bellBtn} aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.bellBadge}></span>
        </button>
      </div>
    </header>
  );
}
