'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, ExternalLink, Download, FileText, ArrowRight } from 'lucide-react';
import SampleReportModal from '@/components/Report/SampleReportModal';

export default function LandingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileReportsExpanded, setMobileReportsExpanded] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  // Dropdown hover helpers with small delay to avoid abrupt closing
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setReportsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setReportsDropdownOpen(false);
    }, 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setReportsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sampleReports = [
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
      isPopular: true,
    },
    {
      grade: 'Grades 11–12',
      title: 'Senior University Fitment',
      desc: 'College admission & RIASEC fit',
      browserUrl: '/sample-report?type=grade12',
      pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-[#E2E8F0]">
      <div className="w-full max-w-7xl mx-auto h-[64px] sm:h-[70px] px-3.5 sm:px-6 md:px-8 xl:px-10 flex items-center justify-between gap-3 lg:gap-4">
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

        {/* CENTER - Navigation Pill with Integrated Sample Reports */}
        <div className="hidden lg:flex items-center justify-center shrink min-w-0">
          <div className="flex items-center gap-0.5 xl:gap-1 bg-white/90 border border-[#E2E8F0] rounded-full px-2 py-1 shadow-xs backdrop-blur-md">
            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, 'services')}
              className="px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Services
            </a>

            <a
              href="#programs"
              onClick={(e) => handleScrollTo(e, 'programs')}
              className="px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Programs
            </a>

            <Link
              href="/psychometric-assessment"
              className={`px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive('/psychometric-assessment')
                  ? "bg-[#2563EB] text-white font-bold shadow-xs"
                  : "font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white"
              }`}
            >
              Assessments
            </Link>

            {/* INTEGRATED SAMPLE REPORTS DROPDOWN */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/sample-reports"
                className={`px-2.5 xl:px-3.5 h-[32px] xl:h-[34px] rounded-full flex items-center gap-1.5 text-[12px] xl:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive('/sample-reports') || isActive('/sample-report')
                    ? "bg-[#2563EB] text-white font-bold shadow-xs"
                    : "font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white"
                }`}
              >
                <span>Sample Reports</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${reportsDropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Seamless Popover Dropdown */}
              {reportsDropdownOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-100 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1258DE] uppercase tracking-wider">
                      Interactive Sample Dossiers
                    </span>
                    <span className="text-[10px] bg-[#E8F0FF] text-[#1258DE] font-bold px-1.5 py-0.5 rounded-full">
                      Free Access
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {sampleReports.map((report) => (
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
                              onClick={() => setReportsDropdownOpen(false)}
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
                        <p className="text-[12.5px] font-semibold text-[#080F1C] mt-1 leading-snug">
                          {report.title}
                        </p>
                        <p className="text-[11px] text-[#64748B] leading-tight">
                          {report.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer Link */}
                  <div className="pt-2 mt-2 border-t border-slate-100 px-1">
                    <Link
                      href="/sample-reports"
                      onClick={() => setReportsDropdownOpen(false)}
                      className="w-full py-1.5 rounded-lg text-center text-[12px] font-bold text-[#1258DE] hover:bg-[#EFF6FF] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Explore All Sample Reports Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#journey"
              onClick={(e) => handleScrollTo(e, 'journey')}
              className="px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              The Journey
            </a>

            <a
              href="#testimonials"
              onClick={(e) => handleScrollTo(e, 'testimonials')}
              className="px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Student Stories
            </a>

            <Link
              href="/about-us"
              className={`px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive('/about-us')
                  ? "bg-[#2563EB] text-white font-bold shadow-xs"
                  : "font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white"
              }`}
            >
              About Us
            </Link>

            <Link
              href="/blog"
              className={`px-2 xl:px-3 h-[32px] xl:h-[34px] rounded-full flex items-center justify-center text-[12px] xl:text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive('/blog')
                  ? "bg-[#2563EB] text-white font-bold shadow-xs"
                  : "font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white"
              }`}
            >
              Blogs
            </Link>
          </div>
        </div>

        {/* RIGHT - Sign In & Start Free CTA (Clean & Uncluttered) */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 shrink-0">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white text-[#080F1C] flex items-center justify-center hover:bg-[#F8FAFC] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 shrink-0"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] shadow-xl px-4 py-4 space-y-3">
          <div className="space-y-1">
            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, 'services')}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>Services</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </a>

            <a
              href="#programs"
              onClick={(e) => handleScrollTo(e, 'programs')}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>Programs</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </a>

            <Link
              href="/psychometric-assessment"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] transition-colors ${
                isActive('/psychometric-assessment')
                  ? "bg-[#2563EB] text-white font-bold"
                  : "font-semibold text-[#334155] hover:bg-[#F1F5F9]"
              }`}
            >
              <span>Assessments</span>
              <span className={isActive('/psychometric-assessment') ? "text-white" : "text-[#94A3B8]"}>→</span>
            </Link>

            {/* Mobile Sample Reports Accordion */}
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileReportsExpanded(!mobileReportsExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-[14.5px] font-semibold text-[#334155] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>Sample Reports</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileReportsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {mobileReportsExpanded && (
                <div className="p-2 space-y-1.5 bg-white border-t border-slate-100">
                  {sampleReports.map((report) => (
                    <div key={report.grade} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#2563EB] uppercase">
                          {report.grade}
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-800">
                          {report.title}
                        </div>
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
                    All Sample Reports Page →
                  </Link>
                </div>
              )}
            </div>

            <a
              href="#journey"
              onClick={(e) => handleScrollTo(e, 'journey')}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>The Journey</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </a>

            <a
              href="#testimonials"
              onClick={(e) => handleScrollTo(e, 'testimonials')}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>Student Stories</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </a>

            <Link
              href="/about-us"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>About Us</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
            >
              <span>Blogs</span>
              <span className="text-[#94A3B8] text-sm">→</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/auth?tab=login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth?tab=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center hover:bg-[#1D4ED8] transition-colors shadow-xs"
              >
                Start Free →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Grade Selector Modal (Fallback) */}
      <SampleReportModal isOpen={showSampleModal} onClose={() => setShowSampleModal(false)} />
    </nav>
  );
}
