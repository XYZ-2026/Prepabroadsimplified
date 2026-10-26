'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingNavbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const navLinks = [
    { label: 'Services', targetId: 'services', href: '#services' },
    { label: 'Programs', targetId: 'programs', href: '#programs' },
    { label: 'Assessments', targetId: 'assessments', href: '#assessments' },
    { label: 'The Journey', targetId: 'journey', href: '#journey' },
    { label: 'Student Stories', targetId: 'testimonials', href: '#testimonials' },
    { label: 'About Us', targetId: 'about-us', href: '/about-us', isPage: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-[#E2E8F0]">
      <div className="w-full h-[62px] sm:h-[76px] md:h-[84px] px-3.5 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* LEFT - Logo & Website Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition-opacity min-w-0">
          <Image
            src="/logo-transparent.png"
            alt="CLARVO"
            width={48}
            height={48}
            className="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] md:w-[50px] md:h-[50px] object-contain shrink-0"
            priority
          />
          <div className="min-w-0">
            <div className="text-[19px] sm:text-[23px] md:text-[25px] font-black tracking-[-0.03em] leading-none text-[#080F1C]">
              CLARVO
            </div>
            <div className="hidden xs:flex mt-[3px] sm:mt-[5px] items-center gap-1.5 truncate">
              <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-[#2563EB] shrink-0" />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-bold text-[#64748B] truncate">
                Student Development Platform
              </span>
            </div>
          </div>
        </Link>

        {/* CENTER - Navigation Pills (Desktop Only) */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 bg-white/80 border border-[#E2E8F0] rounded-full px-2 py-1 shadow-xs backdrop-blur-md">
            {navLinks.map((item) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3.5 h-[36px] rounded-full flex items-center justify-center text-[13.5px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.targetId)}
                  className="px-3.5 h-[36px] rounded-full flex items-center justify-center text-[13.5px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>

        {/* RIGHT - Auth & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Sign In - Tablet & Desktop */}
          <Link
            href="/auth?tab=login"
            className="hidden sm:flex text-[14px] md:text-[15px] font-semibold text-[#475569] hover:text-[#2563EB] transition-colors whitespace-nowrap px-2.5 py-1.5"
          >
            Sign in
          </Link>

          {/* Start Free CTA - Tablet & Desktop Only (Removed from mobile header to eliminate clipping) */}
          <Link
            href="/auth?tab=register"
            className="hidden sm:inline-flex group relative h-[40px] md:h-[44px] px-4 sm:px-5 rounded-full overflow-hidden bg-[#2563EB] text-white text-[13px] md:text-[14px] font-bold shadow-[0_6px_16px_rgba(37,99,235,0.22)] hover:bg-[#1D4ED8] hover:scale-[1.02] transition-all items-center justify-center whitespace-nowrap shrink-0"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
            <span className="relative flex items-center gap-1.5 whitespace-nowrap">
              Start Free
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* Accessible Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl border border-[#E2E8F0] bg-white text-[#080F1C] flex items-center justify-center hover:bg-[#F8FAFC] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 shrink-0"
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
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] shadow-xl px-4 py-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[#94A3B8] text-sm">→</span>
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.targetId)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[#94A3B8] text-sm">→</span>
                </a>
              )
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {/* Book a Demo CTA preserved in mobile drawer */}
            <Link
              href="/book-a-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-xl border border-[#2563EB]/30 bg-[#E8F0FF]/60 text-[#2563EB] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#E8F0FF] transition-colors"
            >
              <span>📅</span>
              <span>Book a 1-on-1 Demo Session</span>
            </Link>

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
          </div>
        </div>
      )}
    </nav>
  );
}
