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
  Calendar, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Globe2, 
  Award, 
  GraduationCap, 
  Code, 
  Briefcase, 
  Palette, 
  Activity, 
  Cpu, 
  ChevronRight, 
  Target, 
  FileText, 
  ShieldCheck, 
  Zap, 
  HelpCircle 
} from 'lucide-react';

import HeroVisualMockup from '@/components/Home/HeroVisualMockup';

export const metadata: Metadata = {
  title: 'Abroad Simplified — Student Intelligence, Career & Study Abroad Platform',
  description:
    'Understand your strengths, discover career pathways, explore 500+ global universities across USA, UK, Germany, Canada, & Australia, and get expert counsellor guidance.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abroad Simplified — Student Intelligence, Career & Study Abroad Platform',
    description:
      'Understand your strengths, discover career pathways, explore top global universities, and build your study-abroad plan.',
    url: 'https://www.abroadsimplified.com/',
  },
};

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans flex flex-col selection:bg-[#690b1b] selection:text-white">
      
      {/* ── 1. REBUILT BRIGHT LUXURY HERO SECTION ── */}
      <section className="bg-gradient-to-b from-[#fdfbf7] via-[#faf8f3] to-[#f7f3eb] text-slate-900 pt-10 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-amber-900/10">
        {/* Soft Background Atmospheric Radial Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#690b1b]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* HERO LEFT COLUMN (~45% WIDTH) */}
          <div className="lg:col-span-6 flex flex-col text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-[#690b1b] text-[11px] font-extrabold tracking-widest uppercase mb-6 w-fit shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {HOME_PAGE_CONFIG.heroEyebrow}
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] text-slate-900 mb-6">
              {HOME_PAGE_CONFIG.heroHeadlineLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#690b1b] via-[#830e22] to-[#b45309]">
                {HOME_PAGE_CONFIG.heroHeadlineLine2}
              </span> <br />
              {HOME_PAGE_CONFIG.heroHeadlineLine3}
            </h1>

            {/* Concise Supporting Copy */}
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-8 max-w-xl">
              {HOME_PAGE_CONFIG.heroSubtitle}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <Link
                href={HOME_PAGE_CONFIG.primaryCtaHref}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-[#690b1b]/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-amber-400/30"
              >
                {HOME_PAGE_CONFIG.primaryCtaText}
              </Link>
              <Link
                href={HOME_PAGE_CONFIG.secondaryCtaHref}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 text-[#690b1b] font-bold text-sm text-center shadow-sm transition-all"
              >
                {HOME_PAGE_CONFIG.secondaryCtaText}
              </Link>
            </div>

            {/* Subtle Dot-Separated Trust Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-200/80">
              {HOME_PAGE_CONFIG.heroTrustLine.map((item, i) => (
                <React.Fragment key={i}>
                  <span>{item}</span>
                  {i < HOME_PAGE_CONFIG.heroTrustLine.length - 1 && (
                    <span className="text-amber-600 font-bold">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* HERO RIGHT COLUMN (~55% WIDTH): PRODUCT EXPERIENCE VISUAL */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroVisualMockup />
          </div>

        </div>
      </section>

      {/* ── 2. TRUST / METRICS STRIP ── */}
      <section className="bg-[#560916] border-y border-amber-900/40 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {HOME_PAGE_CONFIG.trustMetrics.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center p-2">
              <div className="font-display font-extrabold text-3xl md:text-4xl text-amber-300 tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-amber-200/70 font-medium mt-0.5">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. SECTION — WHY ABROAD SIMPLIFIED? ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-3 block">
            OUR PRODUCT POSITIONING
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            MORE THAN A STUDY ABROAD PLATFORM.
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium mb-12">
            Students often begin with a university or a country. <br className="hidden sm:inline" />
            <strong className="text-slate-900 font-bold">Abroad Simplified begins with the student.</strong>
          </p>

          {/* 4-Step Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#690b1b] block mb-2">STEP 01</span>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">Understand Yourself</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Discover your cognitive strengths, learning style, and personality traits.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#690b1b] block mb-2">STEP 02</span>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">Discover What Fits</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Map your profile against high-growth career pathways and academic fields.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#690b1b] block mb-2">STEP 03</span>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">Explore Opportunities</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Filter 500+ global universities across USA, UK, Canada, Australia & Germany.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#690b1b] block mb-2">STEP 04</span>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">Build Your Plan</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Combine application timelines with expert human counsellor guidance.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. SECTION — KNOW YOURSELF FIRST (HIGH PRIORITY) ── */}
      <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              STUDENT INTELLIGENCE SYSTEM
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
              BEFORE CHOOSING A UNIVERSITY, <br className="hidden md:block" />
              UNDERSTAND WHAT FITS YOU.
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
              Multiple data points work together to create a single, unified Student Intelligence Profile.
            </p>
          </div>

          {/* Connected System Flow Graphic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            {/* 5 Data Input Cards (Left Column) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Cognitive Assessment</div>
                  <div className="text-[11px] text-slate-500 font-medium">Visual pattern, spatial & numerical logic</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Psychometric Profile</div>
                  <div className="text-[11px] text-slate-500 font-medium">Personality traits, learning style & motivation</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Interests & Values</div>
                  <div className="text-[11px] text-slate-500 font-medium">Academic passions & post-study ambitions</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Parent Perspective</div>
                  <div className="text-[11px] text-slate-500 font-medium">Budget limits, safety & location preferences</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Academic Evidence</div>
                  <div className="text-[11px] text-slate-500 font-medium">GPA, test scores & subject proficiency</div>
                </div>
              </div>
            </div>

            {/* Central Node Card (Center) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#690b1b] to-purple-900 text-white p-4 flex flex-col items-center justify-center shadow-xl shadow-purple-900/20 border-4 border-white">
                <Sparkles className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-center leading-tight">INTELLIGENCE HUB</span>
              </div>
            </div>

            {/* 4 Outcome Directions (Right Column) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#690b1b] text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">1. Career Pathways</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#690b1b] text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">2. University Direction</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#690b1b] text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">3. Study Abroad Direction</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#690b1b] text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold">4. Counsellor Guidance</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. SECTION — YOUR JOURNEY, SIMPLIFIED (DARK BURGUNDY SECTION) ── */}
      <section id="how-it-works" className="bg-[#690b1b] text-white py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-2 block">
              END-TO-END TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
              YOUR JOURNEY, SIMPLIFIED.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {HOME_PAGE_CONFIG.journeyStages.map((stg, idx) => (
              <div key={idx} className="bg-slate-900/60 rounded-3xl border border-amber-500/20 p-6 flex flex-col justify-between relative backdrop-blur-md">
                <div>
                  <div className="text-3xl font-display font-extrabold text-amber-400 mb-2">{stg.step}</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block mb-2">{stg.stage}</span>
                  <h3 className="text-sm font-display font-bold text-white mb-2">{stg.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mb-4">{stg.description}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[10px] font-bold text-amber-300/90">
                  Deliverable: {stg.output}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. SECTION — CAREER PATHWAYS ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              STRENGTH-BASED CAREER EXPLORATION
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Where could your strengths take you?
            </h2>
          </div>
          <Link
            href="/psychometric-test"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#690b1b] hover:text-[#830e22] transition-colors w-fit"
          >
            EXPLORE CAREER PATHWAYS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOME_PAGE_CONFIG.careerPathways.map((path) => (
            <div key={path.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center">
                    {path.iconName === 'Code' && <Code className="w-5 h-5" />}
                    {path.iconName === 'Briefcase' && <Briefcase className="w-5 h-5" />}
                    {path.iconName === 'BookOpen' && <BookOpen className="w-5 h-5" />}
                    {path.iconName === 'Palette' && <Palette className="w-5 h-5" />}
                    {path.iconName === 'Activity' && <Activity className="w-5 h-5" />}
                    {path.iconName === 'Cpu' && <Cpu className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {path.growthIndex}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{path.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{path.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Degree Fields</span>
                <div className="flex flex-wrap gap-1.5">
                  {path.popularMajors.map((m, i) => (
                    <span key={i} className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. SECTION — TOP STUDY DESTINATIONS ── */}
      <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              GLOBAL STUDY DESTINATIONS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Explore where you could go.
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
              Compare countries, universities, and study routes based on what matters to you.
            </p>
          </div>

          {/* Country Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {HOME_PAGE_CONFIG.destinations.map((dest, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{dest.flag}</span>
                    <span className="text-xs font-mono font-bold text-slate-400">{dest.code}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-1">{dest.name}</h3>
                  <span className="text-xs font-bold text-[#690b1b] block mb-3">{dest.universityCount}</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{dest.description}</p>
                </div>

                <Link
                  href={dest.link}
                  className="pt-3 border-t border-slate-100 text-xs font-bold text-[#690b1b] flex items-center justify-between hover:text-[#830e22]"
                >
                  <span>Explore {dest.code}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. SECTION — UNIVERSITY DISCOVERY ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col text-left">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              AI UNIVERSITY FINDER
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Find universities that fit.
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-6">
              Search over 500+ accredited universities across 40 countries. Filter by budget, major, standardized test requirements, scholarship availability, and post-study work visa policies.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-700 font-semibold">Categorize institutions into Target, Reach, and Safety options.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-700 font-semibold">Includes tuition-free public universities in Germany & affordable EU programs.</span>
              </div>
            </div>

            <Link
              href="/university-finder"
              className="px-8 py-4 rounded-2xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-xs shadow-xl shadow-[#690b1b]/20 flex items-center gap-2 w-fit transition-all"
            >
              EXPLORE UNIVERSITIES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sample Search UI Preview */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">UNIVERSITY SEARCH ENGINE</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  500+ Listed
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">University of Manchester</div>
                    <div className="text-[11px] text-slate-400 font-medium">UK • MSc Computer Science</div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded">Target Fit</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Technical University of Munich (TUM)</div>
                    <div className="text-[11px] text-slate-400 font-medium">Germany • MSc Robotics & AI</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded">Tuition-Free</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">University of Toronto</div>
                    <div className="text-[11px] text-slate-400 font-medium">Canada • Master of Applied Computing</div>
                  </div>
                  <span className="text-xs font-bold text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded">3-Yr PGWP</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 9. SECTION — TOOLS ECOSYSTEM ── */}
      <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              INTEGRATED TOOLS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              EVERYTHING YOU NEED. CONNECTED.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_PAGE_CONFIG.tools.map((t) => (
              <Link 
                key={t.id} 
                href={t.href}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#690b1b] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                      {t.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-[#690b1b] group-hover:text-white transition-colors">
                      {t.iconName === 'Brain' && <Brain className="w-4 h-4" />}
                      {t.iconName === 'Compass' && <Compass className="w-4 h-4" />}
                      {t.iconName === 'Users' && <Users className="w-4 h-4" />}
                      {t.iconName === 'Search' && <Search className="w-4 h-4" />}
                      {t.iconName === 'Calendar' && <Calendar className="w-4 h-4" />}
                      {t.iconName === 'UserCheck' && <UserCheck className="w-4 h-4" />}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mb-1">{t.title}</h3>
                  <span className="text-xs font-bold text-purple-700 block mb-3">{t.tagline}</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#690b1b]">
                  <span>{t.ctaText}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 10. SECTION — LATEST OPPORTUNITIES & DEADLINES ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-1 block">
              LIVE ANNOUNCEMENTS & DEADLINES
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Latest Opportunities & Deadlines
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> LIVE FEED
          </span>
        </div>

        {/* Existing Notification Panel */}
        <NotificationPanel />
      </section>

      {/* ── 11. SECTION — TECHNOLOGY + COUNSELLOR GUIDANCE (DARK SECTION) ── */}
      <section className="bg-slate-900 text-white py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-2 block">
              SIGNATURE DUAL GUIDANCE ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              TECHNOLOGY THAT INFORMS. <br className="hidden md:block" />
              COUNSELLORS WHO GUIDE.
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium mt-4">
              "Technology helps you understand the options. Counselling helps you make the decision."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left: Student Intelligence */}
            <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-4">
                  <Zap className="w-4 h-4" /> STUDENT INTELLIGENCE ENGINE
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">Data-Driven Insights</h3>
                <ul className="space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cognitive score & percentile calculation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Psychometric personality & interest mapping</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>500+ University entry requirements matching</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Parent-student expectation alignment reports</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Human Counselling */}
            <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-4">
                  <UserCheck className="w-4 h-4" /> HUMAN COUNSELLING ADVISORY
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">Certified Guidance Experts</h3>
                <ul className="space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Report interpretation & strategy consultation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Family & parent consensus discussion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Financial budgeting & scholarship application strategy</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SOP editing & mock visa interview preparation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 12. SECTION — REAL STUDENT & GUIDANCE STORIES ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
            GUIDANCE IMPACT
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Real Guidance Perspectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6 italic">
              "Starting with the psychometric assessment cleared up my uncertainty between Computer Science and Data Science. Combining that with the UK university finder helped me apply with confidence."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-[#690b1b] font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Student Applicant</div>
                <div className="text-[11px] text-slate-500 font-medium">Enrolled in UK Data Science Program</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6 italic">
              "The parent assessment feature was invaluable. It gave my family a structured way to align on budget limits and post-study work preferences before shortlisting US universities."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                P
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Parent Candidate</div>
                <div className="text-[11px] text-slate-500 font-medium">Class 12 STEM Applicant Parent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. SECTION — WHY STUDENTS CHOOSE US ── */}
      <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              PLATFORM PILLARS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Why Students Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-wider block mb-2">PERSONALIZED</span>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Built Around You</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Assessment and university recommendations tailored to your unique cognitive and psychometric profile.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-wider block mb-2">CONNECTED</span>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">All Tools Integrated</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Self-discovery, career pathways, parent inputs, and university discovery work seamlessly together.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-wider block mb-2">EXPERT-GUIDED</span>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Human Counselling</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Professional guidance counsellors available to help interpret reports and finalize application strategies.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-wider block mb-2">ACTIONABLE</span>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Clear Next Steps</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Every report and university shortlist translates directly into a step-by-step application roadmap.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 14. SECTION — FAQ WITH GOOGLE SCHEMA.ORG JSON-LD ── */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
        {/* Google Schema.org JSON-LD Structured Snippet */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: HOME_PAGE_CONFIG.faqs.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer
                }
              }))
            })
          }}
        />

        <div className="text-center mb-14">
          <HelpCircle className="w-10 h-10 text-[#690b1b] mx-auto mb-3 opacity-90" />
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-2">
            Got questions about student intelligence, assessments, or university selection?
          </p>
        </div>

        <div className="space-y-4">
          {HOME_PAGE_CONFIG.faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-display font-bold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 15. FINAL HIGH-IMPACT CTA SECTION (DARK BURGUNDY) ── */}
      <section className="bg-[#690b1b] text-white py-20 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Target className="w-14 h-14 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight mb-4">
            YOUR FUTURE SHOULDN'T BE A GUESS.
          </h2>
          <p className="text-sm md:text-base text-slate-200 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            Understand yourself. Explore your options. Build a clear, confident study-abroad roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={HOME_PAGE_CONFIG.primaryCtaHref}
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base shadow-2xl shadow-amber-950/60 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              {HOME_PAGE_CONFIG.primaryCtaText}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={HOME_PAGE_CONFIG.secondaryCtaHref}
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base text-center transition-all"
            >
              {HOME_PAGE_CONFIG.secondaryCtaText}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-amber-200/80 font-bold uppercase tracking-wider mt-10">
            <span>Cognitive Assessment</span>
            <span>•</span>
            <span>Career Exploration</span>
            <span>•</span>
            <span>University Discovery</span>
            <span>•</span>
            <span>Study Abroad Planning</span>
          </div>
        </div>
      </section>

      {/* Premium Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-200">
        <PremiumToolsCards />
      </section>

    </div>
  );
}
