import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import NotificationPanel from '@/components/Notifications/NotificationPanel';
import PremiumToolsCards from '@/components/PremiumToolsCards';
import { HOME_PAGE_CONFIG } from '@/config/home-page.config';
import { 
  Brain, 
  Compass, 
  Search, 
  BookOpen, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Briefcase, 
  ArrowRight
} from 'lucide-react';

import HeroVisualMockup from '@/components/Home/HeroVisualMockup';

export const metadata: Metadata = {
  title: 'Discover CLARVO — 30-Module Student Development & Psychometric Framework',
  description:
    'Explore CLARVO’s diagnostic assessments, cognitive profiling, stream selection engines, and university matching for students in Grades 7–12.',
  alternates: {
    canonical: '/discover',
  },
  openGraph: {
    title: 'Discover CLARVO — 30-Module Student Development Platform',
    description:
      'Explore CLARVO’s diagnostic assessments, cognitive profiling, stream selection engines, and university matching for students in Grades 7–12.',
    url: 'https://clarvo.com/discover',
  },
};

export default function DiscoverPage() {
  const diagnosticPillars = [
    {
      title: 'Cognitive Aptitude & Processing',
      description: 'Standardized assessment of numerical processing, verbal deduction, spatial visualization, and fluid analytical logic.',
      metric: 'Percentile Benchmarks',
      details: ['Numerical Problem Solving', 'Verbal Reasoning & Articulation', 'Abstract Matrix Patterning'],
      icon: <Brain className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'RIASEC Career Fitments',
      description: 'Mapping internal motivations against Holland code occupational fields: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.',
      metric: 'Top Career Matches',
      details: ['Empirical Domain Alignment', 'Stream Compatibility Scoring', 'Risk & Friction Analysis'],
      icon: <Compass className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Big Five Personality Archetype',
      description: 'Evaluating Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability within secondary school contexts.',
      metric: 'Behavioral Traits',
      details: ['Execution Discipline', 'Intellectual Curiosity Index', 'Collaborative Orientation'],
      icon: <Award className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'VARK Learning Styles',
      description: 'Identifying primary sensory modalities (Visual, Auditory, Reading/Writing, Kinesthetic) to double academic retention.',
      metric: 'Study Optimization',
      details: ['Custom Study Habits', 'Exam Resilience Tactics', 'Cognitive Load Balancing'],
      icon: <BookOpen className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Class 11 Stream Matrix',
      description: 'Determining exact subject combinations (PCM, PCB, Commerce with/without Math, Humanities) backed by psychometric evidence.',
      metric: 'Stream Recommendation',
      details: ['Board Specific (CBSE, ICSE, IB)', 'Target Entrance Exams', 'Backup Elective Strategies'],
      icon: <GraduationCap className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Parent-Student Alignment',
      description: 'Side-by-side comparative diagnostics harmonizing student aspirations with parental expectations and family goals.',
      metric: 'Agreement Index',
      details: ['Budget Calibration', 'Study Abroad Readiness', 'Constructive Advisory Protocols'],
      icon: <Users className="w-6 h-6 text-[#2563EB]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] text-slate-900 pt-10 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-slate-200">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* HERO LEFT COLUMN */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-[11px] font-extrabold tracking-widest uppercase mb-6 w-fit shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {HOME_PAGE_CONFIG.heroEyebrow}
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-slate-900 mb-6">
              {HOME_PAGE_CONFIG.heroHeadlineLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]">
                {HOME_PAGE_CONFIG.heroHeadlineLine2}
              </span> <br />
              {HOME_PAGE_CONFIG.heroHeadlineLine3}
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-8 max-w-xl">
              {HOME_PAGE_CONFIG.heroSubtitle}
            </p>

            {/* Operational CTAs without redundant Sign In/Sign Up */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <Link
                href="/book-a-demo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-blue-400/30"
              >
                Book a Demo
              </Link>
              <Link
                href="/sample-reports"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 text-[#2563EB] font-bold text-sm text-center shadow-sm transition-all"
              >
                Explore Sample Reports
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-200/80">
              {HOME_PAGE_CONFIG.heroTrustLine.map((item, i) => (
                <React.Fragment key={i}>
                  <span>{item}</span>
                  {i < HOME_PAGE_CONFIG.heroTrustLine.length - 1 && (
                    <span className="text-blue-600 font-bold">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* HERO RIGHT COLUMN */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroVisualMockup />
          </div>

        </div>
      </section>

      {/* ── 2. TRUST / METRICS STRIP ── */}
      <section className="bg-[#080F1C] border-y border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {HOME_PAGE_CONFIG.trustMetrics.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-2">
              <div className="font-display font-extrabold text-3xl md:text-4xl text-blue-400 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. NOTIFICATION TICKER PANEL ── */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 -mt-4 relative z-20">
        <NotificationPanel />
      </div>

      {/* ── 4. INTERACTIVE SUITE: TOOLS & PREDICTORS ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="text-[#2563EB] font-extrabold text-xs tracking-widest uppercase mb-2 block">
              Decision Engines
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Academic & Diagnostic Tool Suites
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-md mt-2 md:mt-0">
            Built on verified educational frameworks for Indian boards (CBSE, ICSE) and international curriculums (IB, Cambridge).
          </p>
        </div>

        <PremiumToolsCards />
      </section>

      {/* ── 5. 30-MODULE PSYCHOMETRIC MATRIX BREAKDOWN ── */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2563EB] font-extrabold text-xs tracking-widest uppercase mb-3 block">
              Multi-Dimensional Diagnostic
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              The 30-Module Diagnostic Matrix
            </h2>
            <p className="text-slate-600 mt-4 text-base font-medium">
              Every candidate evaluation generates a 56-page clinical dossier benchmarking 30 critical developmental dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diagnosticPillars.map((mod, idx) => (
              <div 
                key={idx} 
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                      {mod.icon}
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60">
                      {mod.metric}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {mod.description}
                  </p>
                </div>
                <ul className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                  {mod.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-[#2563EB] font-extrabold text-xs tracking-widest uppercase mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {HOME_PAGE_CONFIG.faqs.map((faq, idx) => (
            <details 
              key={idx} 
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all open:border-blue-300"
            >
              <summary className="flex items-center justify-between cursor-pointer font-display font-bold text-base text-slate-900 list-none">
                <span>{faq.question}</span>
                <span className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm group-open:rotate-180 transition-transform">
                  ↓
                </span>
              </summary>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 7. BOTTOM CTA CONVERSION BANNER ── */}
      <section className="pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-[#080F1C] rounded-3xl p-8 md:p-14 text-white relative overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl z-10 text-left">
            <span className="text-blue-400 font-extrabold text-xs tracking-widest uppercase mb-2 block">
              Begin Today
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-3">
              Unlock Your Student's True Academic Potential
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Book a consultation with our certified counseling team to review diagnostic samples and chart the optimal roadmap for Grades 7–12.
            </p>
          </div>

          <div className="z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/book-a-demo"
              className="px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              Book a Demo
            </Link>
            <Link
              href="/sample-reports"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/20 flex items-center justify-center transition-all"
            >
              Explore Sample Reports
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
