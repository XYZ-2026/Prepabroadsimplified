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
    closeSidebar();
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
        <p className={styles.sidebarTagline}>Think Beyond Your Boundaries</p>
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
          <div className={styles.userAvatar} style={userRole === 'admin' ? { backgroundColor: 'var(--color-red-deep)' } : {}}>
            {userRole === 'admin' ? 'A' : (userName?.charAt(0).toUpperCase() || 'S')}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <span>{userName || (userRole === 'admin' ? 'Admin' : 'Student')}</span>
              <span
                className={styles.userBadge}
                style={userRole === 'admin' ? { backgroundColor: 'var(--color-red-deep)', color: 'white' } : {}}
              >
                {userRole === 'admin' ? 'ADMIN' : 'STUDENT'}
              </span>
            </div>
            <p className={styles.userEmail}>{userEmail || `${userRole}@abroadsimplified.com`}</p>
          </div>
        </div>
      )}

      {/* Guest Login Block */}
      {!userRole && (
        <div className={styles.sidebarLoginSection}>
          <Link href="/auth" className={styles.btnSidebarLogin}>Login / Register</Link>
        </div>
      )}

      {/* Quick Action */}
      {(!userRole || userRole === 'student') && (
        <div className={styles.sidebarQuickAction}>
          <Link href="#counselling" className={styles.btnSidebarCta}>Book a Free Consultation</Link>
        </div>
      )}

      {/* Admin Dashboard Dropdown */}
      {userRole === 'admin' && (
        <nav className={styles.sidebarNavSection}>
          <div className={`${styles.navItem} ${openAccordion === 'admin' ? styles.navItemOpen : ''}`}>
            <button className={styles.navLink} onClick={() => toggleAccordion('admin')}>
              <span className={styles.navLinkIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              </span>
              <span className={styles.navLinkText}>Admin Dashboard</span>
              <span className={styles.navArrow}>▸</span>
            </button>
            <div className={styles.navSubLinks}>
              <Link href="/dashboard/admin" className={`${styles.navSubLink} ${isActive('/dashboard/admin') ? styles.navSubLinkActive : ''}`}>Overview</Link>
              <Link href="/dashboard/admin/users" className={`${styles.navSubLink} ${isActive('/dashboard/admin/users') ? styles.navSubLinkActive : ''}`}>Users</Link>
              <Link href="#" className={styles.navSubLink}>Universities</Link>
              <Link href="#" className={styles.navSubLink}>Applications</Link>
              <Link href="#" className={styles.navSubLink}>Settings</Link>
            </div>
          </div>
        </nav>
      )}

      {/* Student Dashboard Dropdown */}
      {userRole === 'student' && (
        <nav className={styles.sidebarNavSection}>
          <div className={`${styles.navItem} ${openAccordion === 'student' ? styles.navItemOpen : ''}`}>
            <button className={styles.navLink} onClick={() => toggleAccordion('student')}>
              <span className={styles.navLinkIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </span>
              <span className={styles.navLinkText}>Student Dashboard</span>
              <span className={styles.navArrow}>▸</span>
            </button>
            <div className={styles.navSubLinks}>
              <Link href="/dashboard/student" className={`${styles.navSubLink} ${isActive('/dashboard/student') ? styles.navSubLinkActive : ''}`}>My Profile</Link>
              <Link href="#" className={styles.navSubLink}>Saved Universities</Link>
              <Link href="#" className={styles.navSubLink}>My Applications</Link>
              <Link href="#" className={styles.navSubLink}>Scholarships</Link>
              <Link href="#" className={styles.navSubLink}>Documents</Link>
              <Link href="#" className={styles.navSubLink}>Settings</Link>
            </div>
          </div>
        </nav>
      )}

      {/* Logout */}
      {userRole && (
        <nav className={styles.sidebarNavSection}>
          <div className={styles.navItem}>
            <button className={styles.navLink} onClick={handleLogout} style={{ color: 'var(--color-red-deep)' }}>
              <span className={styles.navLinkIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </span>
              <span className={styles.navLinkText}>Logout</span>
            </button>
          </div>
        </nav>
      )}

      {/* Navigation */}
      <nav className={styles.sidebarNavSection}>
        <p className={styles.navLabel}>Navigation</p>
        <div className={styles.navItem}>
          <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </span>
            <span className={styles.navLinkText}>Home</span>
          </Link>
        </div>
      </nav>

      <hr className={styles.sidebarDivider} />

      {/* Study Abroad Tools */}
      <nav className={styles.sidebarNavSection}>
        <p className={styles.navLabel}>Study Abroad Tools</p>

        {/* University Finder */}
        <div className={`${styles.navItem} ${openAccordion === 'uniFinder' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('uniFinder')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </span>
            <span className={styles.navLinkText}>University Finder</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="/university-finder" className={`${styles.navSubLink} ${isActive('/university-finder') ? styles.navSubLinkActive : ''}`}>Search Universities</Link>
          </div>
        </div>

        {/* Country Guides */}
        <div className={`${styles.navItem} ${openAccordion === 'countryGuides' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('countryGuides')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </span>
            <span className={styles.navLinkText}>Country Guides</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="#" className={styles.navSubLink}>USA Guide</Link>
            <Link href="#" className={styles.navSubLink}>UK Guide</Link>
            <Link href="#" className={styles.navSubLink}>Germany Guide</Link>
            <Link href="#" className={styles.navSubLink}>Canada Guide</Link>
            <Link href="#" className={styles.navSubLink}>Australia Guide</Link>
          </div>
        </div>

        {/* Application Tools */}
        <div className={`${styles.navItem} ${openAccordion === 'appTools' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('appTools')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </span>
            <span className={styles.navLinkText}>Application Tools</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="#" className={styles.navSubLink}>SOP Builder</Link>
            <Link href="#" className={styles.navSubLink}>LOR Tracker</Link>
            <Link href="#" className={styles.navSubLink}>Document Checklist</Link>
            <Link href="#" className={styles.navSubLink}>Application Timeline</Link>
          </div>
        </div>

        {/* Scholarships */}
        <div className={`${styles.navItem} ${openAccordion === 'scholarships' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('scholarships')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="15" y2="14" /></svg>
            </span>
            <span className={styles.navLinkText}>Scholarships</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="#" className={styles.navSubLink}>Scholarship Finder</Link>
            <Link href="#" className={styles.navSubLink}>Scholarship Calendar</Link>
            <Link href="#" className={styles.navSubLink}>Funding Calculator</Link>
          </div>
        </div>

        {/* Test Prep */}
        <div className={`${styles.navItem} ${openAccordion === 'testPrep' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('testPrep')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
            </span>
            <span className={styles.navLinkText}>Test Prep</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="#" className={styles.navSubLink}>IELTS Resources</Link>
            <Link href="#" className={styles.navSubLink}>TOEFL Resources</Link>
            <Link href="#" className={styles.navSubLink}>GRE / GMAT Resources</Link>
            <Link href="#" className={styles.navSubLink}>SAT Resources</Link>
          </div>
        </div>

        {/* Events & Deadlines */}
        <div className={`${styles.navItem} ${openAccordion === 'events' ? styles.navItemOpen : ''}`}>
          <button className={styles.navLink} onClick={() => toggleAccordion('events')}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </span>
            <span className={styles.navLinkText}>Events & Deadlines</span>
            <span className={styles.navArrow}>▸</span>
          </button>
          <div className={styles.navSubLinks}>
            <Link href="#" className={styles.navSubLink}>University Fair Calendar</Link>
            <Link href="#" className={styles.navSubLink}>Application Deadlines</Link>
          </div>
        </div>
      </nav>

      <hr className={styles.sidebarDivider} />

      {/* Resources */}
      <nav className={styles.sidebarNavSection}>
        <p className={styles.navLabel}>Resources</p>
        <div className={styles.navItem}>
          <Link href="#" className={styles.navLink}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            </span>
            <span className={styles.navLinkText}>Blog & Articles</span>
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link href="#" className={styles.navLink}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </span>
            <span className={styles.navLinkText}>Chat With Alumni</span>
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link href="#" className={styles.navLink}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
            </span>
            <span className={styles.navLinkText}>Visa Support</span>
          </Link>
        </div>
        <div className={styles.navItem}>
          <Link href="#" className={styles.navLink}>
            <span className={styles.navLinkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
            </span>
            <span className={styles.navLinkText}>Counselling Checklist</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
