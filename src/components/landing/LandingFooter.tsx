import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-[#080F1C] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-10 text-left border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[320px]">
            <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
              <div className="w-[44px] h-[44px] rounded-[14px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] flex items-center justify-center font-extrabold text-white text-lg shadow-[0_6px_20px_rgba(37,99,235,0.3)] shrink-0">
                CL
              </div>
              <div>
                <span className="text-[22px] font-black tracking-[-0.03em] text-white">CLARVO</span>
                <span className="block text-[10px] text-[#94A3B8] tracking-widest uppercase font-semibold">
                  A platform under Simplified Eduventures
                </span>
              </div>
            </Link>
            <p className="mt-5 text-[#94A3B8] text-[14px] leading-relaxed">
              Clarity for Their Future. A premier student development platform for Grades 7–12 offering psychometric assessments, stream selection, SAT prep, 1-to-1 tutoring, and research profile building.
            </p>
          </div>

          {/* DIAGNOSTICS & TOOLS */}
          <div>
            <div className="text-[#60A5FA] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
              Diagnostics & Tools
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'Psychometric Assessment', href: '/psychometric-test' },
                { label: 'AI Career Roadmap', href: '/career-roadmap' },
                { label: 'SAT 1500+ Prep Diagnostic', href: '/iq-test' },
                { label: 'Global University Matcher', href: '/university-finder' },
                { label: 'Verified Sample Reports', href: '/sample-reports' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[#94A3B8] text-[14px] hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ACADEMIC PROGRAMS */}
          <div>
            <div className="text-[#60A5FA] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
              Academic Programs
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'Grades 7–8 Foundation', href: '/discover' },
                { label: 'Grades 9–10 Stream Choice', href: '/discover' },
                { label: 'Grades 11–12 Admissions', href: '/discover' },
                { label: '1-to-1 Private Tutoring', href: '/book-a-demo' },
                { label: 'High School Research & Papers', href: '/discover' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[#94A3B8] text-[14px] hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ORGANIZATION */}
          <div>
            <div className="text-[#60A5FA] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
              Organization
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'About Simplified Eduventures', href: '/about-us' },
                { label: 'The Student Journey', href: '/#journey' },
                { label: 'Platform Features', href: '/#features' },
                { label: 'Frequently Asked Questions', href: '/#faq' },
                { label: 'Book Advisory Session', href: '/book-a-demo' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[#94A3B8] text-[14px] hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-slate-800/80 mt-14 md:mt-18 mb-6" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#64748B] text-[13px] text-center md:text-left">
            © 2026 CLARVO. A platform under Simplified Eduventures. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[#64748B] text-[13px]">
            <Link href="/privacy" className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition cursor-pointer">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
