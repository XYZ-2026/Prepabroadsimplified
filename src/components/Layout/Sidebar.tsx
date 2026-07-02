'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/components.module.css';

interface SidebarProps {
  userRole: 'admin' | 'student' | null;
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href;

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar?.classList.remove(styles.sidebarOpen);
    document.body.classList.remove('sidebar-open');
    overlay?.classList.remove('visible');
  };

  useEffect(() => {
    // Only auto-close the sidebar on mobile devices when navigating
    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth';
    } catch {
      window.location.href = '/auth';
    }
  };

  return (
    <aside id="sidebar" className={styles.sidebar}>
      {/* Logo Block */}
      <div className={styles.sidebarLogoBlock}>
        <div className={styles.sidebarLogo}>
          <span className="brand-red">Abroad</span> <span>Simplified</span>
        </div>
        <button className={styles.sidebarClose} onClick={closeSidebar} aria-label="Close sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* User Block (Logged In) */}
      {userRole && (
        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>
              {userName || userRole} <span className={styles.userBadge}>{userRole.toUpperCase()}</span>
            </p>
            <p className={styles.userEmail}>{userEmail || `${userRole}@abroadsimplified.com`}</p>
          </div>
        </div>
      )}

      {/* Admin Panel Button */}
      {userRole === 'admin' && (
        <Link href="/dashboard/admin/users" className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnAdmin}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          Admin Panel
        </Link>
      )}

      {/* Logout Button */}
      {userRole && (
        <button onClick={handleLogout} className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnLogout}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      )}

      {/* Guest Login Block */}
      {!userRole && (
        <div className={styles.sidebarLoginSection}>
          <Link href="/auth" className={styles.btnSidebarLogin}>Login / Register</Link>
        </div>
      )}

      {/* Quick Action - Management Seats Enquiry */}
      <Link href="#enquiry" className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnGold}`}>
        <svg className={styles.sidebarActionBtnGoldIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span className={styles.sidebarActionBtnGoldText}>
          <span>Study Abroad</span>
          <span>Enquiry</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className={styles.sidebarNavSection}>
        <p className={styles.navLabel}>Navigation</p>
        <div className={styles.navItem}>
          <Link href={userRole ? '/dashboard' : '/'} className={`${styles.navLink} ${isActive(userRole ? '/dashboard' : '/') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </span>
            <span className={styles.navLinkText}>Home</span>
          </Link>
        </div>
      </nav>

      {/* Study Abroad Tools */}
      <nav className={styles.sidebarNavSection}>
        <p className={styles.navLabel}>Study Abroad Tools</p>

        <div className={styles.navItem}>
          <Link href="/university-finder" className={`${styles.navLink} ${isActive('/university-finder') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <span className={styles.navLinkText}>University Predictor</span>
          </Link>
        </div>

        <div className={styles.navItem}>
          <Link href="/iq-test" className={`${styles.navLink} ${isActive('/iq-test') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            </span>
            <span className={styles.navLinkText}>IQ Test</span>
          </Link>
        </div>

        <div className={styles.navItem}>
          <Link href="#" className={`${styles.navLink} ${isActive('/sop-builder') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </span>
            <span className={styles.navLinkText}>SOP & App Builder</span>
          </Link>
        </div>

        <div className={styles.navItem}>
          <Link href="#" className={`${styles.navLink} ${isActive('/scholarships') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
            </span>
            <span className={styles.navLinkText}>Scholarship Finder</span>
          </Link>
        </div>

        <div className={styles.navItem}>
          <Link href="#" className={`${styles.navLink} ${isActive('/country-guides') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </span>
            <span className={styles.navLinkText}>Country Guides</span>
          </Link>
        </div>

        <div className={styles.navItem}>
          <Link href="#" className={`${styles.navLink} ${isActive('/test-prep') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </span>
            <span className={styles.navLinkText}>Test Prep Hub</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
