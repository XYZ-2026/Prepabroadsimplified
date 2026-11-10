'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY_CONFIG } from '@/config/company';
import { Container } from './primitives';

export default function RedesignFooter() {
  return (
    <footer 
      aria-label="Footer"
      className="bg-[#171822] text-[#A6AFBF] pt-14 sm:pt-20 pb-12 border-t border-[#2A2B3A] font-dmsans"
    >
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#2A2B3A]">
          
          {/* BRAND COLUMN (4 cols on desktop) */}
          <div className="sm:col-span-2 lg:col-span-4 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
              <Image
                src="/logo-transparent.png"
                alt="CLARVO"
                width={44}
                height={44}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
              />
              <div>
                <span className="text-xl sm:text-2xl font-dmsans font-bold tracking-tight text-white block">
                  CLARVO
                </span>
                <span className="block text-[10px] text-[#767E94] tracking-wider uppercase font-semibold">
                  {COMPANY_CONFIG.legalName}
                </span>
              </div>
            </Link>

            <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-[#A6AFBF]">
              {COMPANY_CONFIG.tagline} Empirical student development platform for Grades 7–12 offering cognitive diagnostics, stream selection, Digital SAT 1500+ mastery, private tutoring, and faculty-led research profile building.
            </p>

            <div className="mt-3 text-[11px] text-[#767E94]">
              <span>CIN: {COMPANY_CONFIG.cin}</span>
            </div>
          </div>

          {/* DIAGNOSTICS & TOOLS (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-dmsans font-bold text-white uppercase tracking-wider">
              Diagnostics &amp; Tools
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'Psychometric Assessment', href: '/psychometric-assessment' },
                { label: 'Take Assessment', href: '/psychometric-test' },
                { label: 'AI Career Roadmap', href: '/career-roadmap' },
                { label: 'SAT 1500+ Prep Diagnostic', href: '/iq-test' },
                { label: 'Global University Matcher', href: '/university-finder' },
                { label: 'Verified Sample Reports', href: '/sample-reports' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#A6AFBF] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ACADEMIC PROGRAMMES (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-dmsans font-bold text-white uppercase tracking-wider">
              Programmes
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'Grades 7–8 Foundation', href: '/discover' },
                { label: 'Grades 9–10 Stream Choice', href: '/discover' },
                { label: 'Grades 11–12 Admissions', href: '/discover' },
                { label: '1-to-1 Private Tutoring', href: '/book-a-demo' },
                { label: 'High School Research', href: '/discover' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#A6AFBF] hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ORGANIZATION & OFFICES (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-dmsans font-bold text-white uppercase tracking-wider">
              Offices &amp; Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-[12px] text-[#A6AFBF]">
              <div>
                <p className="font-semibold text-white">Head Office (Mumbai):</p>
                <p className="leading-snug text-[#767E94] mt-0.5">
                  ISKCON Temple Entrance Rd, Chand Society, Juhu, Mumbai 400049
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">Kolkata Branch:</p>
                <p className="leading-snug text-[#767E94] mt-0.5">
                  Shiivani Complex, Pottery Road, Kolkata 700015
                </p>
              </div>

              <div className="pt-2 text-[11px] text-[#767E94]">
                <span>Contact: </span>
                <a href={COMPANY_CONFIG.mailtoLink} className="text-[#A6AFBF] hover:text-white underline">
                  {COMPANY_CONFIG.email}
                </a>
                {' · '}
                <a href={COMPANY_CONFIG.telLink} className="text-[#A6AFBF] hover:text-white underline">
                  {COMPANY_CONFIG.phoneFormatted}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#767E94]">
          <p>
            {COMPANY_CONFIG.copyright}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

