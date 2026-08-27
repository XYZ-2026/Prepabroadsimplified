'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from '@/styles/components.module.css';

interface SidebarProps {
  userRole: 'admin' | 'counsellor' | 'student' | null;
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [parentStatus, setParentStatus] = useState<{ isUnlocked: boolean; latestResultId?: string; hasPendingParentTest?: boolean }>({ isUnlocked: false });
  
  const psychType = searchParams.get('type') || 'senior';

  useEffect(() => {
    fetch('/api/parent-assessment/status')
      .then(res => res.json())
      .then(data => {
        if (data.isUnlocked) {
          setParentStatus(data);
        } else {
          setParentStatus({ isUnlocked: false });
        }
      })
      .catch(() => setParentStatus({ isUnlocked: false }));
  }, [pathname]);

  const isActive = (href: string) => {
    // If viewing a result report, My Assessments should be active, Psychometric Tests should not
    if (searchParams.has('resultId')) {
      if (href === '/dashboard/student/assessments') return true;
      if (href === '/psychometric-test' || href === '/iq-test') return false;
    }
    return pathname === href;
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (pathname === '/iq-test/test') {
      setIsOpen(false);
      document.body.classList.remove('sidebar-open');
    } else if (window.innerWidth <= 1024) {
      setIsOpen(false);
      document.body.classList.remove('sidebar-open');
    } else {
      setIsOpen(true);
      document.body.classList.add('sidebar-open');
    }
  }, [pathname, psychType]);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => {
        const next = !prev;
        if (next) document.body.classList.add('sidebar-open');
        else document.body.classList.remove('sidebar-open');
        return next;
      });
    };
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/auth';
    } catch {
      window.location.href = '/auth';
    }
  };

  if (pathname === '/iq-test/test') {
    return null;
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen && isMobile ? 'visible' : ''}`} onClick={closeSidebar} />
      <aside id="sidebar" className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
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
            <div className={styles.userNameText}>{userName || userRole}</div>
            <div className={styles.userMetaRow}>
              <span className={styles.userBadge}>{userRole.toUpperCase()}</span>
              <span className={styles.userEmail}>{userEmail || `${userRole}@abroadsimplified.com`}</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Dropdown */}
      {userRole === 'admin' && (
        <div className={openAccordion === 'admin_dash' ? styles.navItemOpen : ''}>
          <button 
            onClick={() => toggleAccordion('admin_dash')}
            className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnAdmin}`}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              Admin Panel
            </div>
            <svg className={styles.navArrow} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="/dashboard/admin/users" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/users') ? styles.navSubLinkActive : ''}`}>
              Users
            </Link>
            <Link href="/dashboard/admin/user-analytics" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/user-analytics') ? styles.navSubLinkActive : ''}`}>
              User Analytics
            </Link>
            <Link href="/dashboard/admin/counsellors" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/counsellors') ? styles.navSubLinkActive : ''}`}>
              Counsellors
            </Link>
            <Link href="/dashboard/admin/assessments" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/assessments') ? styles.navSubLinkActive : ''}`}>
              Assessments
            </Link>
            <Link href="/dashboard/admin/analytics" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/analytics') ? styles.navSubLinkActive : ''}`}>
              Assessment Analytics
            </Link>
            <Link href="/dashboard/admin/tool-access" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/tool-access') ? styles.navSubLinkActive : ''}`}>
              Tool Access
            </Link>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
         COUNSELLOR ROLE SIDEBAR (Case-Management & Advisory Workspace)
         ──────────────────────────────────────────────────────────── */}
      {userRole === 'counsellor' ? (
        <div className={styles.sidebarScrollable} style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 130px)' }}>
          {/* Section: MAIN */}
          <nav className={styles.sidebarNavSection}>
            <p className={styles.navLabel}>MAIN</p>
            <div className={styles.navItem}>
              <Link
                href="/dashboard/counsellor"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname === '/dashboard/counsellor' ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                </span>
                <span className={styles.navLinkText}>Counsellor Dashboard</span>
              </Link>
            </div>
          </nav>

          {/* Section: STUDENT MANAGEMENT */}
          <nav className={styles.sidebarNavSection}>
            <p className={styles.navLabel}>STUDENT MANAGEMENT</p>
            <div className={styles.navItem}>
              <Link
                href="/dashboard/counsellor/students"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname.startsWith('/dashboard/counsellor/students') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <span className={styles.navLinkText}>Allotted Students</span>
              </Link>
            </div>
          </nav>

          {/* Section: ASSESSMENT & ANALYSIS */}
          <nav className={styles.sidebarNavSection}>
            <p className={styles.navLabel}>ASSESSMENT & ANALYSIS</p>
            <div className={styles.navItem}>
              <Link
                href="/dashboard/counsellor/analytics"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname.startsWith('/dashboard/counsellor/analytics') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </span>
                <span className={styles.navLinkText}>Assessment Analytics</span>
              </Link>
            </div>
          </nav>

          {/* Section: CAREER & STUDY ABROAD */}
          <nav className={styles.sidebarNavSection}>
            <p className={styles.navLabel}>CAREER & STUDY ABROAD</p>
            <div className={styles.navItem}>
              <Link
                href="/university-finder"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname === '/university-finder' ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <span className={styles.navLinkText}>University Predictor</span>
              </Link>
            </div>
            <div style={{ marginTop: '6px' }}>
              <Link href="#enquiry" onClick={handleLinkClick} className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnGold}`}>
                <svg className={styles.sidebarActionBtnGoldIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className={styles.sidebarActionBtnGoldText}>
                  <span>Study Abroad Enquiry</span>
                </span>
              </Link>
            </div>
          </nav>

          {/* Section: ACCOUNT */}
          <nav className={styles.sidebarNavSection} style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <p className={styles.navLabel}>ACCOUNT</p>
            <div className={styles.navItem}>
              <Link
                href="/dashboard/counsellor/profile"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname === '/dashboard/counsellor/profile' ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                </span>
                <span className={styles.navLinkText}>My Profile</span>
              </Link>
            </div>
            <div className={styles.navItem}>
              <Link
                href="/dashboard/counsellor/update-profile"
                onClick={handleLinkClick}
                className={`${styles.navLink} ${pathname === '/dashboard/counsellor/update-profile' ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navLinkIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </span>
                <span className={styles.navLinkText}>Update Profile</span>
              </Link>
            </div>
            <div style={{ marginTop: '12px', marginBottom: '16px' }}>
              <button onClick={handleLogout} className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnLogout}`} style={{ width: '100%' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </nav>
        </div>
      ) : (
        <>
          {/* Admin Panel Dropdown */}
          {userRole === 'admin' && (
            <div className={openAccordion === 'admin_dash' ? styles.navItemOpen : ''}>
              <button 
                onClick={() => toggleAccordion('admin_dash')}
                className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnAdmin}`}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Admin Panel
                </div>
                <svg className={styles.navArrow} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className={styles.navSubLinks}>
                <Link href="/dashboard/admin/users" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/users') ? styles.navSubLinkActive : ''}`}>
                  Users
                </Link>
                <Link href="/dashboard/admin/user-analytics" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/user-analytics') ? styles.navSubLinkActive : ''}`}>
                  User Analytics
                </Link>
                <Link href="/dashboard/admin/counsellors" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/counsellors') ? styles.navSubLinkActive : ''}`}>
                  Counsellors
                </Link>
                <Link href="/dashboard/admin/assessments" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/assessments') ? styles.navSubLinkActive : ''}`}>
                  Assessments
                </Link>
                <Link href="/dashboard/admin/analytics" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/analytics') ? styles.navSubLinkActive : ''}`}>
                  Assessment Analytics
                </Link>
                <Link href="/dashboard/admin/tool-access" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/admin/tool-access') ? styles.navSubLinkActive : ''}`}>
                  Tool Access
                </Link>
              </div>
            </div>
          )}

          {/* Student Dashboard Dropdown */}
          {userRole === 'student' && (
            <div className={openAccordion === 'student_dash' ? styles.navItemOpen : ''}>
              <button 
                onClick={() => toggleAccordion('student_dash')}
                className={`${styles.sidebarActionBtn} ${styles.sidebarActionBtnAdmin}`}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Student Dashboard
                </div>
                <svg className={styles.navArrow} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className={styles.navSubLinks}>
                <Link href="/dashboard/student/profile" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/student/profile') ? styles.navSubLinkActive : ''}`}>
                  My Profile
                </Link>
                <Link href="/dashboard/student/update-profile" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/student/update-profile') ? styles.navSubLinkActive : ''}`}>
                  Update Profile
                </Link>
                <Link href="/dashboard/student/assessments" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/dashboard/student/assessments') ? styles.navSubLinkActive : ''}`}>
                  My Assessments
                </Link>
              </div>
            </div>
          )}

          {/* Logout Button for Admin & Student */}
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

          <div className={styles.sidebarScrollable}>
            {/* Navigation */}
            <nav className={styles.sidebarNavSection}>
              <p className={styles.navLabel}>Navigation</p>
              <div className={styles.navItem}>
                <Link href={userRole ? '/dashboard' : '/'} onClick={handleLinkClick} className={`${styles.navLink} ${isActive(userRole ? '/dashboard' : '/') ? styles.navLinkActive : ''}`}>
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
                <Link href="/university-finder" onClick={handleLinkClick} className={`${styles.navLink} ${isActive('/university-finder') ? styles.navLinkActive : ''}`}>
                  <span className={styles.navLinkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </span>
                  <span className={styles.navLinkText}>University Predictor</span>
                </Link>
              </div>

              <div className={styles.navItem}>
                <Link href="/iq-test" onClick={handleLinkClick} className={`${styles.navLink} ${isActive('/iq-test') ? styles.navLinkActive : ''}`}>
                  <span className={styles.navLinkIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                  </span>
                  <span className={styles.navLinkText}>IQ Test</span>
                </Link>
              </div>

              <div className={`${styles.navItem} ${openAccordion === 'psychometric' ? styles.navItemOpen : ''}`}>
                <button 
                  onClick={() => toggleAccordion('psychometric')}
                  className={`${styles.navLink} ${pathname === '/psychometric-test' ? styles.navLinkActive : ''}`}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={styles.navLinkIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    </span>
                    <span className={styles.navLinkText}>Psychometric Tests</span>
                  </div>
                  <svg className={styles.navArrow} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className={styles.navSubLinks}>
                  <Link href="/psychometric-test?type=junior" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/psychometric-test') && psychType === 'junior' ? styles.navSubLinkActive : ''}`}>
                    7th - 9th Grade Test
                  </Link>
                  <Link href="/psychometric-test?type=grade10" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/psychometric-test') && psychType === 'grade10' ? styles.navSubLinkActive : ''}`}>
                    10th Grade Test
                  </Link>
                  <Link href="/psychometric-test?type=senior" onClick={handleLinkClick} className={`${styles.navSubLink} ${isActive('/psychometric-test') && psychType === 'senior' ? styles.navSubLinkActive : ''}`}>
                    11th - 12th Grade Test
                  </Link>
                  {parentStatus.isUnlocked ? (
                    <Link 
                      href={`/parent-assessment?resultId=${parentStatus.latestResultId}`} 
                      onClick={handleLinkClick} 
                      className={`${styles.navSubLink} ${pathname === '/parent-assessment' ? styles.navSubLinkActive : ''}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: parentStatus.hasPendingParentTest ? '#d97706' : '#10b981', fontWeight: 600 }}
                    >
                      <span>Parent Psychometric Test</span>
                      <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', background: parentStatus.hasPendingParentTest ? '#fef3c7' : '#dcfce7' }}>
                        {parentStatus.hasPendingParentTest ? '🔓 Ready' : '✅ Done'}
                      </span>
                    </Link>
                  ) : (
                    <button 
                      onClick={() => alert("Parent Psychometric Test is locked. Please complete a student psychometric test first!")} 
                      className={styles.navSubLink}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', opacity: 0.6, cursor: 'not-allowed', background: 'transparent', border: 'none', textAlign: 'left' }}
                    >
                      <span>Parent Psychometric Test</span>
                      <span style={{ fontSize: '12px' }}>🔒 Locked</span>
                    </button>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </aside>
    </>
  );
}
