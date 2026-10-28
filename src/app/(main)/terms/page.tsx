import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY_CONFIG } from '@/config/company';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${COMPANY_CONFIG.brandName}`,
  description:
    `Read the Terms and Conditions for using the ${COMPANY_CONFIG.brandName} student development platform operated by ${COMPANY_CONFIG.legalName}.`,
  alternates: {
    canonical: 'https://clarvo.in/terms',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 hover:opacity-90 transition-opacity">
            <Image
              src="/logo-transparent.png"
              alt={COMPANY_CONFIG.brandName}
              width={48}
              height={48}
              className="w-[44px] h-[44px] object-contain shrink-0"
              priority
            />
            <div>
              <div className="text-[20px] font-black text-[#080F1C] tracking-tight leading-none">
                {COMPANY_CONFIG.brandName}
              </div>
              <div className="mt-1 text-[9.5px] uppercase tracking-[0.15em] font-semibold text-[#64748B]">
                {COMPANY_CONFIG.legalName}
              </div>
            </div>
          </Link>
          <Link
            href="/"
            className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors border border-[#2563EB]/20 px-4 py-2 rounded-full"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#080F1C] via-[#1E3A8A] to-[#2563EB] text-white py-14 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90">Legal Agreement</span>
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.03em] leading-tight mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/80 text-[15px] max-w-xl">
            Please read these terms carefully before accessing or using the {COMPANY_CONFIG.brandName} platform.
          </p>
          <p className="text-white/60 text-[13px] mt-2">
            Last updated: October 2026 · {COMPANY_CONFIG.legalName} (CIN: {COMPANY_CONFIG.cin})
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-10 space-y-8 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">1. Acceptance of Terms</h2>
            <p className="text-[15px]">
              By accessing, browsing, or using {COMPANY_CONFIG.brandName} (&quot;Platform&quot;), operated by {COMPANY_CONFIG.legalName} (CIN: {COMPANY_CONFIG.cin}), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">2. Description of Services</h2>
            <p className="text-[15px] mb-3">
              {COMPANY_CONFIG.brandName} provides structured student guidance, 30-dimension psychometric diagnostics, Class 10 stream fitment evaluation, Digital SAT preparation frameworks, 1-to-1 tutoring, research mentoring, and university discovery engines for students in Grades 7–12.
            </p>
            <p className="text-[15px]">
              Our psychometric assessments and predictive models provide structured guidance and analytical insights for informed decision-making. Final admissions, curricular selections, and academic pathways remain the sole prerogative of the student and their family.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">3. User Accounts &amp; Privacy</h2>
            <p className="text-[15px]">
              You agree to provide true, accurate, and current information during registration and consultation requests. You are responsible for safeguarding your login credentials. We do not sell or disclose your personal student responses or diagnostic reports without explicit parental and student consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">4. Intellectual Property</h2>
            <p className="text-[15px]">
              All diagnostic algorithms, question banks, assessment frameworks, visual graphics, and editorial reports are the proprietary intellectual property of {COMPANY_CONFIG.legalName}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">5. Corporate &amp; Contact Information</h2>
            <div className="text-[15px] space-y-2 bg-[#F8FAFC] p-5 rounded-xl border border-slate-200">
              <p><strong>Legal Entity:</strong> {COMPANY_CONFIG.legalName}</p>
              <p><strong>Corporate Identification Number (CIN):</strong> {COMPANY_CONFIG.cin}</p>
              <p><strong>Email:</strong> <a href={COMPANY_CONFIG.mailtoLink} className="text-[#2563EB] font-bold underline">{COMPANY_CONFIG.email}</a></p>
              <p><strong>Phone:</strong> <a href={COMPANY_CONFIG.telLink} className="text-[#2563EB] font-bold underline">{COMPANY_CONFIG.phoneFormatted}</a></p>
              <p><strong>Head Office:</strong> {COMPANY_CONFIG.headOffice.fullAddress}</p>
              <p><strong>{COMPANY_CONFIG.kolkataBranch.label}:</strong> {COMPANY_CONFIG.kolkataBranch.fullAddress}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
