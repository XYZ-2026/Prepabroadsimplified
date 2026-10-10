'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    { label: 'Programs', targetId: 'programs', href: '#programs' },
    { label: 'Assessments', targetId: 'assessments', href: '#assessments' },
    { label: 'The Journey', targetId: 'journey', href: '#journey' },
    { label: 'Features', targetId: 'features', href: '#features' },
    { label: 'AI Advisor', targetId: 'ai-advisor', href: '#ai-advisor' },
    { label: 'About Us', targetId: 'about-us', href: '/about-us', isPage: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F8FAFC]/92 backdrop-blur-xl border-b border-[#E2E8F0]">
      <div className="w-full h-[68px] sm:h-[84px] md:h-[88px] px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* LEFT - Logo & Website Name */}
        <Link href="/" className="flex items-center gap-3 sm:gap-3.5 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-[14px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] shadow-[0_6px_20px_rgba(37,99,235,0.25)] flex items-center justify-center text-white font-extrabold text-lg sm:text-xl tracking-tight shrink-0">
            CL
          </div>
          <div>
            <div className="text-[18px] sm:text-[21px] md:text-[22px] font-black tracking-[-0.03em] leading-none text-[#080F1C]">
              CLARVO
            </div>
            <div className="hidden sm:flex mt-[5px] items-center gap-1.5">
              <span className="w-[4px] h-[4px] rounded-full bg-[#2563EB]" />
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#64748B]">
                Student Development Platform
              </span>
            </div>
          </div>
        </Link>

        {/* CENTER - Navigation Pills */}
        <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 bg-white/80 border border-[#E2E8F0] rounded-full px-2.5 py-1.5 shadow-xs backdrop-blur-md">
            {navLinks.map((item) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 h-[38px] rounded-full flex items-center justify-center text-[14px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.targetId)}
                  className="px-4 h-[38px] rounded-full flex items-center justify-center text-[14px] font-medium text-[#475569] hover:bg-[#2563EB] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>

        {/* RIGHT - Auth and CTA */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#080F1C] focus:outline-none shrink-0"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href="/auth?tab=login"
            className="hidden sm:flex text-[14px] md:text-[15px] font-semibold text-[#475569] hover:text-[#2563EB] transition-colors whitespace-nowrap px-3 py-1.5"
          >
            Sign in
          </Link>

          <Link
            href="/auth?tab=register"
            className="group relative h-[38px] sm:h-[44px] md:h-[48px] px-4 sm:px-6 rounded-full overflow-hidden bg-[#2563EB] text-white text-[12px] sm:text-[14px] md:text-[15px] font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-[#1D4ED8] hover:scale-[1.02] transition-all flex items-center justify-center whitespace-nowrap shrink-0"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
            <span className="relative flex items-center gap-1 sm:gap-2 whitespace-nowrap">
              Start Free
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] shadow-lg px-4 py-5 space-y-3">
          {navLinks.map((item) => (
            item.isPage ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-[15px] font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.targetId)}
                className="block px-4 py-2.5 rounded-xl text-[15px] font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
              >
                {item.label}
              </a>
            )
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/auth?tab=login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              href="/auth?tab=register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center justify-center"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
