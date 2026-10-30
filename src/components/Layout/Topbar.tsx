'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
        <Link href={isRoadmap ? "/career-roadmap" : "/"} className={styles.topbarLogo} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo-transparent.png" alt="CLARVO" width={44} height={44} className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] object-contain shrink-0" priority />
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
          <a href="#programs" className="hover:text-blue-600 transition-colors" style={{ textDecoration: 'none' }}>
            Academic Excellence
          </a>
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
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
              style={{ textDecoration: 'none' }}
            >
              Book a Demo
            </Link>
          </>
        )}
        {/* Clean mobile header: notifications bell hidden on public pages */}
      </div>
    </header>
  );
}
