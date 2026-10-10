import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | CLARVO',
  description:
    'Learn how CLARVO and Simplified Eduventures protect your privacy and personal assessment data.',
  alternates: {
    canonical: 'https://clarvo.in/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] flex items-center justify-center font-black text-white text-lg shadow-md">
              CL
            </div>
            <div>
              <div className="text-[18px] font-black text-[#080F1C] tracking-tight leading-none">
                CLARVO
              </div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.2em] font-semibold text-[#64748B]">
                A platform under Simplified Eduventures
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
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/90">Data Protection</span>
          </div>
          <h1 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.03em] leading-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-[15px] max-w-xl">
            We value your trust and are committed to safeguarding student and parent personal data.
          </p>
          <p className="text-white/60 text-[13px] mt-2">
            Last updated: October 2026 · Simplified Eduventures
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-5 py-12">
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm p-6 sm:p-10 space-y-8 text-[#334155] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">1. Information We Collect</h2>
            <p className="text-[15px]">
              We collect information you provide directly to us when creating an account, completing psychometric diagnostics, answering survey questions, or communicating with advisors. This includes student names, grade levels, school backgrounds, and assessment responses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">2. How We Use Information</h2>
            <p className="text-[15px]">
              Your assessment data is strictly used to formulate personalized psychometric reports, career recommendations, and customized learning plans. We do not sell or monetize personal student data to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">3. Data Security</h2>
            <p className="text-[15px]">
              We implement industry-standard encryption, SSL transmission, and secure database access protocols to protect your personal and academic records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#080F1C] mb-3">4. Contact Privacy Team</h2>
            <p className="text-[15px]">
              For privacy-related questions or data deletion requests, contact us at <a href="mailto:support@clarvo.in" className="text-[#2563EB] font-bold underline">support@clarvo.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
