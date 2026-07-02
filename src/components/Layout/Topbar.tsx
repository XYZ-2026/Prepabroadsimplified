'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/components.module.css';

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector(`.sidebar-overlay`);
    const body = document.body;

    if (sidebar?.classList.contains(styles.sidebarOpen)) {
      sidebar.classList.remove(styles.sidebarOpen);
      body.classList.remove('sidebar-open');
      overlay?.classList.remove('visible');
    } else {
      sidebar?.classList.add(styles.sidebarOpen);
      body.classList.add('sidebar-open');
      if (window.innerWidth <= 1024) {
        overlay?.classList.add('visible');
      }
    }
  };

  return (
    <header className={`topbar ${styles.topbar} ${scrolled ? styles.topbarScrolled : ''}`}>
      <div className={styles.topbarLeft}>
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
        <Link href="/" className={styles.topbarLogo}>
          <span className="brand-red">Abroad</span>{' '}
          <span>Simplified</span>
        </Link>
      </div>

      <div className={styles.topbarCenter}>Think Beyond Your Boundaries</div>

      <div className={styles.topbarRight}>
        <Link href="#tools" className={styles.btnTopbarCta}>
          Study Abroad Tools
        </Link>
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
