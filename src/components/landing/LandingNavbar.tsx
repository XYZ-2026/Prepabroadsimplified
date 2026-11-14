'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChevronDown,
  ExternalLink,
  Download,
  FileText,
  ArrowRight,
  Compass,
  BookOpen,
  FlaskConical,
  Route,
  Microscope,
  Briefcase,
  Sun,
  HeartHandshake,
  Brain,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import SampleReportModal from '@/components/Report/SampleReportModal';
import UserAvatarMenu from '@/components/Layout/UserAvatarMenu';
import { useSessionUser, dashboardHomeFor } from '@/components/providers/SessionProvider';
import { clientLogout } from '@/lib/client-logout';

type MenuKey = 'services' | 'programs' | 'assessments';

interface MenuItem {
  label: string;
  desc?: string;
  href: string;
  icon: LucideIcon;
  /** Section id on the home page to scroll to instead of navigating. */
  scrollTo?: string;
}

const SERVICES: MenuItem[] = [
  {
    label: 'Psychometric Assessments',
    desc: "Understand your child's strengths, interests, and learning preferences.",
    href: '/psychometric-assessment',
    icon: Compass,
  },
  {
    label: 'SAT Preparation & AP Subject Tutoring',
    desc: 'Build academic confidence with expert-led, one-to-one support.',
    href: '/#services',
    scrollTo: 'services',
    icon: BookOpen,
  },
  {
    label: 'Research Mentorship & Projects',
    desc: 'Explore interests through guided research, writing and real-world projects.',
    href: '/research',
    icon: FlaskConical,
  },
  {
    label: 'Development Roadmaps & Career Guidance',
    desc: 'Plan academic milestones, explore career options and get future-ready.',
    href: '/career-roadmap',
    icon: Route,
  },
];

const PROGRAMS: MenuItem[] = [
  {
    label: 'Research Programs',
    desc: 'Mentor-guided research that ends in a paper or project.',
    href: '/research',
    icon: Microscope,
  },
  {
    label: 'Internships',
    desc: 'Structured micro-internships and real-world work experience.',
    href: '/#programs',
    scrollTo: 'programs',
    icon: Briefcase,
  },
  {
    label: 'Summer Programs',
    desc: 'Find and apply to selective summer programs worldwide.',
    href: '/#programs',
    scrollTo: 'programs',
    icon: Sun,
  },
  {
    label: 'Social Impact',
    desc: 'Community projects and volunteering that build leadership.',
    href: '/#programs',
    scrollTo: 'programs',
    icon: HeartHandshake,
  },
];

const ASSESSMENTS: MenuItem[] = [
  {
    label: 'Psychometric Assessment',
    desc: '30-dimension diagnostic for Grades 7–12.',
    href: '/psychometric-assessment',
    icon: Brain,
  },
  {
    label: 'IQ Assessment',
    desc: 'Measure reasoning, memory and problem-solving ability.',
    href: '/iq-test',
    icon: Lightbulb,
  },
];

const SAMPLE_REPORTS = [
  {
    grade: 'Grades 7–9',
    title: 'Junior Diagnostic Report',
    desc: 'Foundation & learning stamina',
    browserUrl: '/sample-report?type=junior',
    pdfUrl: '/sample-reports/sample-report-grades-7-9.pdf',
  },
  {
    grade: 'Grade 10',
    title: 'Stream Selection Report',
    desc: 'PCM vs PCB vs Commerce vs Arts',
    browserUrl: '/sample-report?type=grade10',
    pdfUrl: '/sample-reports/sample-report-grade-10.pdf',
  },
  {
    grade: 'Grades 11–12',
    title: 'Senior University Fitment',
    desc: 'College admission & RIASEC fit',
    browserUrl: '/sample-report?type=grade12',
    pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
  },
];

const PILL_BASE =
  'px-2 xl:px-2.5 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center gap-1 text-[12px] xl:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap';
const PILL_ACTIVE = 'bg-[#2563EB] text-white font-bold shadow-xs';
const PILL_IDLE = 'font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white';

const PANEL =
  'absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left';

const MOBILE_LINK = 'flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] transition-colors';

export default function LandingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sessionUser = useSessionUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<MenuKey | null>(null);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const closeAll = () => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (targetId: string) => {
    closeAll();
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const onItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (item.scrollTo) {
      e.preventDefault();
      scrollToSection(item.scrollTo);
    } else {
      closeAll();
    }
  };

  // Hover opens a menu (with a small close delay); click toggles it for touch and keyboard users.
  // A click right after hover opened the menu should keep it open, not toggle it shut.
  const openedByClickRef = useRef(false);
  const enterMenu = (key: MenuKey) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (openMenu !== key) openedByClickRef.current = false;
    setOpenMenu(key);
  };
  const leaveMenu = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const toggleMenu = (key: MenuKey) => {
    if (openMenu === key && openedByClickRef.current) {
      openedByClickRef.current = false;
      setOpenMenu(null);
    } else {
      openedByClickRef.current = true;
      setOpenMenu(key);
    }
  };

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const assessmentsActive =
    isActive('/psychometric-assessment') || isActive('/sample-reports') || isActive('/sample-report');

  const menuTrigger = (key: MenuKey, label: string, active = false) => (
    <button
      type="button"
      onClick={() => toggleMenu(key)}
      aria-expanded={openMenu === key}
      aria-haspopup="true"
      // Preflight is off, so reset the native button look to match the link pills.
      style={{ fontFamily: 'inherit', lineHeight: 'inherit', borderStyle: 'none' }}
      className={`${PILL_BASE} appearance-none ${active || openMenu === key ? PILL_ACTIVE : `bg-transparent ${PILL_IDLE}`}`}
    >
      <span>{label}</span>
      <ChevronDown
        className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${openMenu === key ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const renderItems = (items: MenuItem[], compact = false) => (
    <div className={compact ? 'space-y-0.5' : 'space-y-1.5'}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => onItemClick(e, item)}
            className={`flex gap-3 rounded-xl border border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all ${
              compact ? 'px-2.5 py-2 items-center' : 'p-2.5 items-start'
            }`}
          >
            <span
              className={`shrink-0 rounded-full bg-[#1E40AF] text-white flex items-center justify-center ${
                compact ? 'w-7 h-7' : 'w-9 h-9'
              }`}
            >
              <Icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-[#080F1C] leading-snug">{item.label}</span>
              {item.desc && (
                <span className="block text-[11.5px] text-[#64748B] leading-snug mt-0.5">{item.desc}</span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );

  // Shared section header so every dropdown reads the same.
  const panelHeading = (text: string, badge?: string, divider = false) => (
    <div
      className={`px-2.5 py-1.5 flex items-center justify-between border-slate-100 ${
        divider ? 'border-y my-2' : 'border-b mb-2'
      }`}
    >
      <span className="text-[11px] font-bold text-[#1258DE] uppercase tracking-wider">{text}</span>
      {badge && (
        <span className="text-[10px] bg-[#E8F0FF] text-[#1258DE] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
  );

  const mobileAccordion = (key: MenuKey, label: string, body: React.ReactNode) => (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setMobileExpanded(mobileExpanded === key ? null : key)}
        aria-expanded={mobileExpanded === key}
        style={{ fontFamily: 'inherit', lineHeight: 'inherit', borderStyle: 'none' }}
        className="w-full flex items-center justify-between px-3.5 py-2 appearance-none text-[14.5px] font-semibold text-[#334155] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded === key ? 'rotate-180' : ''}`}
        />
      </button>
      {mobileExpanded === key && <div className="p-2 bg-white border-t border-slate-100">{body}</div>}
    </div>
  );

  const mobileLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={`${MOBILE_LINK} ${
        isActive(href) ? 'bg-[#2563EB] text-white font-bold' : 'font-semibold text-[#334155] hover:bg-[#F1F5F9]'
      }`}
    >
      <span>{label}</span>
      <span className={isActive(href) ? 'text-white' : 'text-[#94A3B8]'}>→</span>
    </Link>
  );

  const desktopLink = (href: string, label: string) => (
    <Link href={href} className={`${PILL_BASE} ${isActive(href) ? PILL_ACTIVE : PILL_IDLE}`}>
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-[#E2E8F0]">
      <div className="w-full max-w-7xl mx-auto h-[64px] sm:h-[70px] px-3.5 sm:px-6 md:px-8 xl:px-10 flex items-center justify-between gap-3 xl:gap-4">
        {/* LEFT - Refined CLARVO Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
        >
          <Image
            src="/logo-transparent.png"
            alt="CLARVO"
            width={36}
            height={36}
            className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] object-contain shrink-0"
            priority
          />
          <span className="text-[18px] sm:text-[20px] font-black tracking-[-0.03em] leading-none text-[#080F1C]">
            CLARVO
          </span>
        </Link>

        {/* CENTER - Navigation Pill */}
        <div className="hidden xl:flex flex-1 items-center justify-center min-w-0 px-2">
          <div
            ref={menuBarRef}
            className="flex items-center gap-0.5 xl:gap-1 bg-white/90 border border-[#E2E8F0] rounded-full px-2 py-1 shadow-xs backdrop-blur-md"
          >
            {/* SERVICES */}
            <div className="relative" onMouseEnter={() => enterMenu('services')} onMouseLeave={leaveMenu}>
              {menuTrigger('services', 'Services')}
              {openMenu === 'services' && (
                <div className={`${PANEL} w-[340px]`}>
                  {panelHeading('Our Services')}
                  {renderItems(SERVICES)}
                </div>
              )}
            </div>

            {/* PROGRAMS */}
            <div className="relative" onMouseEnter={() => enterMenu('programs')} onMouseLeave={leaveMenu}>
              {menuTrigger('programs', 'Programs')}
              {openMenu === 'programs' && (
                <div className={`${PANEL} w-[340px]`}>
                  {panelHeading('Programs')}
                  {renderItems(PROGRAMS)}
                </div>
              )}
            </div>

            {/* ASSESSMENTS (includes sample reports) */}
            <div className="relative" onMouseEnter={() => enterMenu('assessments')} onMouseLeave={leaveMenu}>
              {menuTrigger('assessments', 'Assessments', assessmentsActive)}
              {openMenu === 'assessments' && (
                <div className={`${PANEL} w-[340px]`}>
                  {panelHeading('Assessments')}
                  {renderItems(ASSESSMENTS)}
                  {panelHeading('Sample Reports', 'Free Access', true)}

                  <div className="space-y-1.5">
                    {SAMPLE_REPORTS.map((report) => (
                      <div
                        key={report.grade}
                        className="p-2 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10.5px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                            {report.grade}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={report.browserUrl}
                              onClick={() => setOpenMenu(null)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1258DE] hover:underline"
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                            <span className="text-slate-300">|</span>
                            <a
                              href={report.pdfUrl}
                              download
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
                            >
                              <span>PDF</span>
                              <Download className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                        <p className="text-[12.5px] font-semibold text-[#080F1C] mt-1 leading-snug">{report.title}</p>
                        <p className="text-[11px] text-[#64748B] leading-tight">{report.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 px-1">
                    <Link
                      href="/sample-reports"
                      onClick={() => setOpenMenu(null)}
                      className="w-full py-1.5 rounded-lg text-center text-[12px] font-bold text-[#1258DE] hover:bg-[#EFF6FF] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Explore All Sample Reports</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {desktopLink('/research', 'Research')}
            {desktopLink('/admitted-students', 'Admitted Students')}
            {desktopLink('/about-us', 'About Us')}
            {desktopLink('/blog', 'Blogs')}
          </div>
        </div>

        {/* RIGHT - Sign In & Start Free CTA (Clean & Uncluttered) */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 shrink-0">
          {sessionUser ? (
            <>
              <Link
                href={dashboardHomeFor(sessionUser.role)}
                className="hidden sm:inline-flex text-[13.5px] md:text-[14px] font-semibold text-[#475569] hover:text-[#2563EB] transition-colors whitespace-nowrap px-2.5 py-1.5"
              >
                Dashboard
              </Link>
              <UserAvatarMenu />
            </>
          ) : (
            <>
              {/* Sign In Link */}
              <Link
                href="/auth?tab=login"
                className="hidden sm:inline-flex text-[13.5px] md:text-[14px] font-semibold text-[#475569] hover:text-[#2563EB] transition-colors whitespace-nowrap px-2.5 py-1.5"
              >
                Sign in
              </Link>

              {/* Start Free CTA */}
              <Link
                href="/auth?tab=register"
                className="hidden sm:inline-flex group relative h-[38px] md:h-[40px] px-4 sm:px-5 rounded-full overflow-hidden bg-[#2563EB] text-white text-[13px] md:text-[13.5px] font-bold shadow-[0_4px_14px_rgba(37,99,235,0.22)] hover:bg-[#1D4ED8] hover:scale-[1.02] transition-all items-center justify-center whitespace-nowrap shrink-0"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                <span className="relative flex items-center gap-1.5 whitespace-nowrap">
                  Start Free
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl border border-solid border-[#E2E8F0] bg-white text-[#080F1C] flex items-center justify-center hover:bg-[#F8FAFC] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] shadow-xl px-4 py-4 space-y-3 max-h-[calc(100dvh-64px)] overflow-y-auto">
          <div className="space-y-1">
            {mobileAccordion('services', 'Services', renderItems(SERVICES, true))}
            {mobileAccordion('programs', 'Programs', renderItems(PROGRAMS, true))}
            {mobileAccordion(
              'assessments',
              'Assessments',
              <div className="space-y-1.5">
                {renderItems(ASSESSMENTS, true)}
                <div className="flex items-center gap-2 px-2.5 pt-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="text-[11px] font-bold text-[#1258DE] uppercase tracking-wider">Sample Reports</span>
                </div>
                {SAMPLE_REPORTS.map((report) => (
                  <div key={report.grade} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#2563EB] uppercase">{report.grade}</span>
                      <div className="text-[12.5px] font-medium text-slate-800">{report.title}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={report.browserUrl}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2 py-1 text-[11px] font-bold bg-[#2563EB] text-white rounded-md"
                      >
                        View
                      </Link>
                      <a
                        href={report.pdfUrl}
                        download
                        className="px-2 py-1 text-[11px] font-medium border border-slate-300 text-slate-700 rounded-md"
                      >
                        PDF
                      </a>
                    </div>
                  </div>
                ))}
                <Link
                  href="/sample-reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs font-bold text-[#1258DE] py-1.5 hover:underline"
                >
                  All Sample Reports →
                </Link>
              </div>,
            )}

            {mobileLink('/research', 'Research')}
            {mobileLink('/admitted-students', 'Admitted Students')}
            {mobileLink('/about-us', 'About Us')}
            {mobileLink('/blog', 'Blogs')}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {sessionUser ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={dashboardHomeFor(sessionUser.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center hover:bg-[#1D4ED8] transition-colors shadow-xs"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => clientLogout('/')}
                  className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth?tab=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-11 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center hover:bg-[#1D4ED8] transition-colors shadow-xs"
                >
                  Start Free →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Grade Selector Modal (Fallback) */}
      <SampleReportModal isOpen={showSampleModal} onClose={() => setShowSampleModal(false)} />
    </nav>
  );
}
