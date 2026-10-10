import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Compass, 
  BookOpen, 
  Target, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  GraduationCap 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CLARVO — Clarity for Their Future | Student Development Platform',
  description:
    'Personalized assessments, academic support, and guided profile building to help students discover their strengths and prepare for what comes next.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CLARVO — Clarity for Their Future | Student Development Platform',
    description:
      'Personalized assessments, academic support, and guided profile building to help students discover their strengths and prepare for what comes next.',
    url: 'https://clarvo.com/',
  },
};

export default function HomePage() {
  const valuePillars = [
    {
      id: 'discover',
      badge: 'Assessment & Aptitude',
      title: 'Discover',
      tagline: 'Understand student strengths, interests, and potential.',
      description:
        '30-module psychometric diagnostic evaluating cognitive agility, Big Five behavioral archetype, RIASEC career fitments, and VARK learning preferences for Grades 7–12.',
      icon: <Compass className="w-6 h-6 text-[#2563EB]" />,
      actionText: 'Explore Diagnostics',
      actionHref: '/discover',
    },
    {
      id: 'excel',
      badge: 'Academic Progression',
      title: 'Excel',
      tagline: 'Support academic progress through tutoring and test preparation.',
      description:
        'Targeted SAT preparation, curriculum-aligned academic tutoring, and strategic study frameworks engineered to build foundational subject mastery and exam confidence.',
      icon: <GraduationCap className="w-6 h-6 text-[#2563EB]" />,
      actionText: 'Academic Programs',
      actionHref: '/book-a-demo',
    },
    {
      id: 'build',
      badge: 'Profile & Pathways',
      title: 'Build',
      tagline: 'Develop meaningful research experiences and student profiles.',
      description:
        'Evidence-backed extracurricular and academic profile architecture connecting candidate strengths to leading university admissions criteria worldwide.',
      icon: <Target className="w-6 h-6 text-[#2563EB]" />,
      actionText: 'University Matching',
      actionHref: '/university-finder',
    },
    {
      id: 'guide',
      badge: 'Advisory & Mentorship',
      title: 'Guide',
      tagline: 'Provide structured guidance and planning for students and parents.',
      description:
        'Certified 1-on-1 counselor guidance aligning family aspirations with realistic Class 11 stream decisions and multi-stage academic roadmaps.',
      icon: <Users className="w-6 h-6 text-[#2563EB]" />,
      actionText: 'Review Sample Reports',
      actionHref: '/sample-reports',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-28 px-4 md:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E4E7EC]">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold tracking-wide uppercase mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Premium Student Development • Grades 7–12</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#080F1C] leading-[1.12] mb-6">
            Clarity for Their Future.
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg md:text-xl text-[#344054] leading-relaxed font-normal max-w-2xl mx-auto mb-10">
            Personalized assessments, academic support, and guided profile building to help students discover their strengths and prepare for what comes next.
          </p>

          {/* Hero Two Prominent Buttons: Sign In and Sign Up */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <Link
              href="/auth?tab=login"
              id="btn-hero-sign-in"
              className="w-full sm:w-auto min-w-[160px] px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#E4E7EC] hover:border-[#2563EB] text-[#080F1C] hover:text-[#2563EB] font-bold text-base text-center shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Sign In
            </Link>

            <Link
              href="/auth?tab=register"
              id="btn-hero-sign-up"
              className="w-full sm:w-auto min-w-[180px] px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base text-center shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-semibold text-[#667085] pt-6 border-t border-[#E4E7EC]/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              <span>30 Diagnostic Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>CBSE • ICSE • IB • Cambridge</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>1-on-1 Guidance Counselors</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. VALUE PROPOSITION SECTION: DISCOVER • EXCEL • BUILD • GUIDE ── */}
      <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
            Integrated Framework
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
            How CLARVO Unlocks Every Student's Potential
          </h2>
          <p className="text-[#667085] mt-3 text-base">
            Four coordinated pillars designed to guide students from early self-discovery through verified career roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white p-7 rounded-2xl border border-[#E4E7EC] shadow-sm hover:shadow-xl hover:border-[#BFDBFE] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] border border-[#BFDBFE] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E4E7EC]">
                    {pillar.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-xl text-[#080F1C] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {pillar.title}
                </h3>

                {/* Tagline */}
                <p className="text-[#344054] text-sm font-semibold leading-snug mb-3">
                  {pillar.tagline}
                </p>

                {/* Description */}
                <p className="text-[#667085] text-xs leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-[#E4E7EC]">
                <Link
                  href={pillar.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group-hover:translate-x-0.5"
                >
                  <span>{pillar.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PLATFORM ENTRY & CONSULTATION BANNER ── */}
      <section className="pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-[#080F1C] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl z-10 text-left">
            <span className="text-[#93C5FD] font-bold text-xs uppercase tracking-wider mb-2 block">
              Begin With Confidence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Ready to Discover Your Path?
            </h2>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Create an account to access personalized assessments, or schedule a 1-on-1 consultation with an academic advisor.
            </p>
          </div>

          <div className="z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/auth?tab=register"
              className="px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm text-center shadow-md transition-all"
            >
              Get Started (Sign Up)
            </Link>
            <Link
              href="/book-a-demo"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition-all"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FOOTER ── */}
      <footer className="bg-white border-t border-[#E4E7EC] py-12 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2">
            <span className="font-extrabold text-xl tracking-tight text-[#080F1C] block mb-2">
              CLARVO
            </span>
            <p className="text-sm text-[#2563EB] font-bold mb-3">
              Clarity for Their Future.
            </p>
            <p className="text-xs text-[#667085] leading-relaxed max-w-sm">
              A premium student development platform for Grades 7–12, offering psychometric assessments, personalized career guidance, SAT preparation, and research profile building.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#080F1C] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li>
                <Link href="/discover" className="hover:text-[#2563EB] transition-colors">
                  Diagnostic Overview
                </Link>
              </li>
              <li>
                <Link href="/psychometric-test" className="hover:text-[#2563EB] transition-colors">
                  Psychometric Assessment
                </Link>
              </li>
              <li>
                <Link href="/iq-test" className="hover:text-[#2563EB] transition-colors">
                  Advanced IQ Test
                </Link>
              </li>
              <li>
                <Link href="/sample-reports" className="hover:text-[#2563EB] transition-colors">
                  Explore Sample Reports
                </Link>
              </li>
              <li>
                <Link href="/university-finder" className="hover:text-[#2563EB] transition-colors">
                  University Finder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#080F1C] uppercase tracking-wider mb-3">
              Account & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li>
                <Link href="/auth?tab=login" className="hover:text-[#2563EB] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth?tab=register" className="hover:text-[#2563EB] transition-colors">
                  Sign Up (New Account)
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#2563EB] transition-colors">
                  About Us (Simplified Eduventures)
                </Link>
              </li>
              <li>
                <Link href="/book-a-demo" className="hover:text-[#2563EB] transition-colors">
                  Book a Demo
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#2563EB] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#2563EB] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-4">
          <p>© 2026 CLARVO. A platform under Simplified Eduventures. All rights reserved.</p>
          <p>Confidential Academic Guidance Platform • support@clarvo.com</p>
        </div>
      </footer>

    </div>
  );
}
