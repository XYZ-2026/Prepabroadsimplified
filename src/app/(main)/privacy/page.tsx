import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY_CONFIG } from '@/config/company';

export const metadata: Metadata = {
  title: `Privacy Policy | ${COMPANY_CONFIG.brandName}`,
  description:
    `Learn how ${COMPANY_CONFIG.brandName} and ${COMPANY_CONFIG.legalName} protect your privacy and personal assessment data.`,
  alternates: {
    canonical: 'https://clarvo.in/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white">
      {/* Header provided consistently by AppShell Topbar */}

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#080F1C] via-[#1E3A8A] to-[#2563EB] text-white py-14 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90">Data Protection</span>
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.03em] leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-[15px] max-w-xl">
            We value your trust and are committed to safeguarding student and parent personal data.
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
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">1. Information We Collect</h2>
            <p className="text-[15px]">
              We collect information you provide directly to us when creating an account, completing psychometric diagnostics, answering survey questions, or requesting a consultation. This includes student names, grade levels, school backgrounds, and assessment responses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">2. How We Use Information</h2>
            <p className="text-[15px]">
              Your assessment data is strictly used to formulate personalized psychometric reports, career recommendations, and customized learning plans. We do not sell or monetize personal student data to third-party advertisers or marketing networks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">3. Data Security &amp; Minor Protection</h2>
            <p className="text-[15px]">
              Because {COMPANY_CONFIG.brandName} provides services to secondary and high school minors, we treat names, school affiliations, and academic responses with strict confidentiality. Industry-standard encryption, SSL transmission, and secure database access protocols are enforced at all times.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">4. Corporate &amp; Privacy Contact</h2>
            <div className="text-[15px] space-y-2 bg-[#F8FAFC] p-5 rounded-xl border border-slate-200">
              <p>For privacy-related questions or data deletion requests, contact our legal and data protection team:</p>
              <p><strong>Entity:</strong> {COMPANY_CONFIG.legalName} (CIN: {COMPANY_CONFIG.cin})</p>
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
