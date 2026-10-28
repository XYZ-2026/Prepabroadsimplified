import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { COMPANY_CONFIG } from '@/config/company';

export default function LandingFooter() {
  return (
    <footer className="bg-[#080F1C] px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 md:pt-20 pb-10 text-left border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 max-w-[320px]">
            <Link href="/" className="flex items-center gap-3.5 text-white hover:opacity-90 transition-opacity">
              <Image
                src="/logo-transparent.png"
                alt="CLARVO"
                width={56}
                height={56}
                className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] object-contain shrink-0"
              />
              <div>
                <span className="text-[24px] font-black tracking-[-0.03em] text-white">CLARVO</span>
                <span className="block text-[10px] text-[#94A3B8] tracking-wider uppercase font-semibold">
                  {COMPANY_CONFIG.legalName}
                </span>
              </div>
            </Link>
            <p className="mt-4 text-[#94A3B8] text-[13.5px] leading-relaxed">
              {COMPANY_CONFIG.tagline} A premier student development platform for Grades 7–12 offering psychometric assessments, stream selection, SAT prep, 1-to-1 tutoring, and research profile building.
            </p>
            <div className="mt-3 text-xs text-slate-400">
              <span>CIN: {COMPANY_CONFIG.cin}</span>
            </div>
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

          {/* ORGANIZATION & OFFICES */}
          <div>
            <div className="text-[#60A5FA] text-[11px] tracking-[0.24em] uppercase font-bold mb-6">
              Organization
            </div>
            <div className="space-y-3">
              {[
                { label: 'About CLARVO', href: '/about-us' },
                { label: 'The Student Journey', href: '/#journey' },
                { label: 'Academic Pathways', href: '/#programs' },
                { label: 'Frequently Asked Questions', href: '/#faq' },
                { label: 'Schedule Consultation', href: '/book-a-demo' },
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

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-[#94A3B8] space-y-1">
              <p className="font-semibold text-slate-300">Head Office (Mumbai):</p>
              <p className="text-[10.5px] leading-snug text-slate-400">ISKCON Temple Entrance Rd, Chand Society, Juhu, Mumbai 400049</p>
              <p className="font-semibold text-slate-300 mt-2">Kolkata Branch:</p>
              <p className="text-[10.5px] leading-snug text-slate-400">Shiivani Complex, Pottery Road, Kolkata 700015</p>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-slate-800/80 mt-14 md:mt-18 mb-6" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#64748B] text-[13px] text-center md:text-left">
            {COMPANY_CONFIG.copyright}
            <span className="block text-[11px] text-[#475569] mt-0.5">
              Contact: <a href={COMPANY_CONFIG.mailtoLink} className="hover:text-slate-300 underline">{COMPANY_CONFIG.email}</a>
              {' | '}
              <a href={COMPANY_CONFIG.telLink} className="hover:text-slate-300 underline">{COMPANY_CONFIG.phoneFormatted}</a>
            </span>
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
