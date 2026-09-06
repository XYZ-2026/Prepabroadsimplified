'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PSYCHOMETRIC_LANDING_CONFIG, 
  VariantId, 
  VariantConfig 
} from '@/config/psychometric-landing.config';
import { 
  Brain, 
  Compass, 
  BookOpen, 
  Users, 
  Zap, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  HelpCircle, 
  Award, 
  Globe2, 
  Target, 
  ShieldCheck, 
  Lock, 
  Briefcase 
} from 'lucide-react';

interface Props {
  variant: VariantId;
  onStart: () => void;
}

export default function PsychometricLandingPage({ variant, onStart }: Props) {
  const config: VariantConfig = PSYCHOMETRIC_LANDING_CONFIG[variant] || PSYCHOMETRIC_LANDING_CONFIG['10'];
  const [activeTab, setActiveTab] = useState<VariantId>(variant);
  const [reportPageIdx, setReportPageIdx] = useState(0);

  // Sync activeTab with variant prop if changed
  useEffect(() => {
    setActiveTab(variant);
  }, [variant]);

  // Report Mockup Carousel Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setReportPageIdx((prev) => (prev + 1) % config.reportPagesPreview.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [config.reportPagesPreview.length]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans flex flex-col selection:bg-[#690b1b] selection:text-white">
      
      {/* ── 1. STICKY HEADER NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#690b1b] text-white font-black text-xs flex items-center justify-center shadow-md">
              AS
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-slate-900">
              Abroad <span className="text-[#690b1b]">Simplified</span>
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#why" className="hover:text-[#690b1b] transition-colors">Why This Assessment</a>
            <a href="#discover" className="hover:text-[#690b1b] transition-colors">What You'll Discover</a>
            <a href="#how-it-works" className="hover:text-[#690b1b] transition-colors">How It Works</a>
            <a href="#deliverables" className="hover:text-[#690b1b] transition-colors">Deliverables</a>
            <a href="#faq" className="hover:text-[#690b1b] transition-colors">FAQ</a>
          </nav>

          {/* Age Variant Switcher Tabs & CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
              <Link
                href="/psychometric-test?type=junior"
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === '7-9' ? 'bg-[#690b1b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Class 7–9
              </Link>
              <Link
                href="/psychometric-test?type=grade10"
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === '10' ? 'bg-[#690b1b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Class 10
              </Link>
              <Link
                href="/psychometric-test?type=grade12"
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === '12' ? 'bg-[#690b1b] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Class 12
              </Link>
            </div>

            <button
              onClick={onStart}
              className="px-5 py-2.5 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-xs shadow-md shadow-[#690b1b]/20 transition-all cursor-pointer"
            >
              START ASSESSMENT
            </button>
          </div>

        </div>
      </header>

      {/* ── 2. MICRO TRUST STRIP ── */}
      <section className="bg-[#560916] border-b border-amber-900/40 py-3.5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          {config.microStats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="font-display font-extrabold text-sm md:text-base text-amber-300 tracking-tight">
                {item.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-200 mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HERO SECTION (EDITORIAL & LIGHT LUXURY) ── */}
      <section className="bg-gradient-to-b from-[#fdfbf7] via-[#faf8f3] to-[#f7f3eb] pt-12 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-slate-200/80">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#690b1b]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* HERO LEFT COLUMN */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-[#690b1b] text-[11px] font-extrabold tracking-widest uppercase mb-6 w-fit shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {config.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-slate-900 mb-6">
              {config.heroHeadlineLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#690b1b] via-[#830e22] to-[#b45309]">
                {config.heroHeadlineLine2}
              </span> <br />
              {config.heroHeadlineLine3}
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-8 max-w-xl">
              {config.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-[#690b1b]/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-amber-400/30"
              >
                {config.primaryCtaText}
              </button>
              <Link
                href={config.sampleReportHref}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300/80 text-[#690b1b] font-bold text-sm text-center shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {config.secondaryCtaText}
              </Link>
            </div>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#690b1b]" />
                <span>30 Diagnostic Modules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#690b1b]" />
                <span>Parent Expectation Matrix</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#690b1b]" />
                <span>Downloadable PDF</span>
              </div>
            </div>
          </div>

          {/* HERO RIGHT COLUMN: INTERACTIVE ANIMATED REPORT STACK */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg relative py-4">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-2xl shadow-[#690b1b]/10 relative z-10">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#690b1b]" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      FULL DIAGNOSTIC REPORT PREVIEW
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    56 Pages
                  </span>
                </div>

                {/* Animated Report Page Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reportPageIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 border border-purple-100 flex flex-col justify-between h-52 mb-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold text-[#690b1b] uppercase">
                          {config.reportPagesPreview[reportPageIdx].pageNum}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Sample Diagnostic Page</span>
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-900 mb-1">
                        {config.reportPagesPreview[reportPageIdx].title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {config.reportPagesPreview[reportPageIdx].subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-[#690b1b]">
                      <span>Live Evidence & Analysis</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="flex items-center justify-center gap-2">
                  {config.reportPagesPreview.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReportPageIdx(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${i === reportPageIdx ? 'w-6 bg-[#690b1b]' : 'w-2 bg-slate-200'}`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. SECTION — THE PROBLEM (DARK CONTRAST) ── */}
      <section id="why" className="bg-slate-900 text-white py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-2 block">
              DECISION RISK ANALYSIS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
              {config.problemHeadline}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {config.problemSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Left: Traditional Flow */}
            <div className="bg-slate-800/80 rounded-3xl border border-red-500/30 p-8">
              <div className="text-xs font-extrabold text-red-400 uppercase tracking-wider mb-4">
                TRADITIONAL APPROACH (HIGH RISK)
              </div>
              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                {config.traditionalFlow.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      ✗
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Abroad Simplified Flow */}
            <div className="bg-slate-800/80 rounded-3xl border border-emerald-500/30 p-8">
              <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-4">
                ABROAD SIMPLIFIED APPROACH (STUDENT FIRST)
              </div>
              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                {config.simplifiedFlow.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. SECTION — WHAT THIS ASSESSMENT ACTUALLY IS ── */}
      <section id="discover" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
            MULTIDIMENSIONAL EVIDENCE
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            MORE THAN A CAREER QUIZ.
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
            We evaluate multiple dimensions of student evidence to build a unified profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.assessmentDimensions.map((dim) => (
            <div key={dim.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-[#690b1b] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    {dim.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#690b1b] flex items-center justify-center">
                    {dim.iconName === 'Brain' && <Brain className="w-4 h-4" />}
                    {dim.iconName === 'Compass' && <Compass className="w-4 h-4" />}
                    {dim.iconName === 'BookOpen' && <BookOpen className="w-4 h-4" />}
                    {dim.iconName === 'Users' && <Users className="w-4 h-4" />}
                    {dim.iconName === 'Zap' && <Zap className="w-4 h-4" />}
                    {dim.iconName === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                    {dim.iconName === 'Globe2' && <Globe2 className="w-4 h-4" />}
                    {dim.iconName === 'Briefcase' && <Briefcase className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-2">{dim.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{dim.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-[#690b1b]">
                Standardized Evaluation
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. SECTION — HOW IT WORKS (5-STEP FLOW) ── */}
      <section id="how-it-works" className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              WORKFLOW PIPELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-2xl font-display font-extrabold text-[#690b1b] mb-2">01</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Student Completes Assessment</h3>
              <p className="text-xs text-slate-500 font-medium">30 interactive modules covering cognitive reasoning and personality traits.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-2xl font-display font-extrabold text-[#690b1b] mb-2">02</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Parent Completes Perspective</h3>
              <p className="text-xs text-slate-500 font-medium">Structured questionnaire capturing financial, location, and career expectations.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-2xl font-display font-extrabold text-[#690b1b] mb-2">03</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Profile Is Analyzed</h3>
              <p className="text-xs text-slate-500 font-medium">Cross-matching scores against 15+ career fields and 500+ global universities.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-2xl font-display font-extrabold text-[#690b1b] mb-2">04</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Perspectives Are Compared</h3>
              <p className="text-xs text-slate-500 font-medium">Generating student-parent expectation alignment matrix.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-2xl font-display font-extrabold text-[#690b1b] mb-2">05</span>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Report & Roadmap Delivered</h3>
              <p className="text-xs text-slate-500 font-medium">Downloadable PDF reports and counsellor consultation strategy.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. SECTION — DELIVERABLES SHOWCASE ── */}
      <section id="deliverables" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
            WHAT YOU RECEIVE
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            HERE'S WHAT YOU'LL RECEIVE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.deliverables.map((del, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 block mb-3 w-fit">
                  {del.badge}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-1">{del.title}</h3>
                <span className="text-xs font-extrabold text-[#690b1b] block mb-3">{del.pages}</span>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{del.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant PDF Generation
              </div>
            </div>
          ))}
        </div>

        {/* View Sample Report Bar */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-amber-50/50 to-purple-50 border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#690b1b] text-white flex items-center justify-center font-bold text-sm shrink-0">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-sm text-slate-900">Want to see what a complete report looks like?</h4>
              <p className="text-xs text-slate-500 font-medium">Explore the full 56-page interactive report shell with sample candidate data.</p>
            </div>
          </div>
          <Link
            href={config.sampleReportHref}
            className="px-6 py-3 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all shrink-0"
          >
            VIEW SAMPLE REPORT →
          </Link>
        </div>
      </section>

      {/* ── 8. SECTION — CAREER PATHWAYS ── */}
      <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              STRENGTH-BASED PATHWAYS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              DON'T JUST GET A SCORE. GET A DIRECTION.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.pathways.map((path, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${path.type === 'PRIMARY' ? 'bg-[#690b1b] text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {path.type} PATHWAY
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">{path.growthIndex}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{path.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{path.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recommended Degrees / Streams</span>
                  <div className="flex flex-wrap gap-1">
                    {path.degreePaths.map((d, idx) => (
                      <span key={idx} className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 9. SECTION — PARENT VALUE ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              FAMILY ALIGNMENT
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {config.parentTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-6">
              {config.parentSub}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-700 font-semibold">Captures budget, safety, location, and country preferences.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-slate-700 font-semibold">Generates a side-by-side alignment matrix to trigger healthy family discussions.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono font-bold text-amber-400">STUDENT VS. PARENT ALIGNMENT MATRIX</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded">Analyzed</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Target Stream Preference</span>
                  <span className="font-bold text-white">88% Aligned</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Study Abroad Openness</span>
                  <span className="font-bold text-emerald-400">High Alignment</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Financial Budget Range</span>
                  <span className="font-bold text-amber-400">Requires Counsellor Discussion</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 10. SECTION — COUNSELLOR ADVISORY ── */}
      <section className="bg-slate-900 text-white py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-2 block">
            HUMAN GUIDANCE INTEGRATION
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
            {config.counsellorTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed mb-8">
            {config.counsellorSub}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Certified Educational Counsellors Available for Consultation
          </div>
        </div>
      </section>

      {/* ── 11. SECTION — WHO THIS IS FOR VS NOT ── */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> IDEAL FOR STUDENTS WHO
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li>• Want evidence-based career & stream guidance beyond marks alone</li>
              <li>• Want to compare domestic vs. study abroad university options</li>
              <li>• Want to align student ambitions with family financial planning</li>
              <li>• Value professional educational counsellor support</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" /> NOT A REPLACEMENT FOR
            </h3>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li>• Clinical psychological or psychiatric medical diagnoses</li>
              <li>• Guaranteed university admissions without academic prerequisites</li>
              <li>• Instant automated career decisions without student reflection</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 12. SECTION — FAQ ACCORDION ── */}
      <section id="faq" className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-14">
            <HelpCircle className="w-10 h-10 text-[#690b1b] mx-auto mb-3" />
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-base font-display font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 13. FINAL HIGH-IMPACT DARK CTA ── */}
      <section className="bg-[#690b1b] text-white py-20 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            {config.finalCtaHeadline}
          </h2>
          <p className="text-sm md:text-base text-slate-200 font-medium mb-8 max-w-xl mx-auto">
            Understand yourself. Align with your family. Build a clear, evidence-backed education roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base shadow-2xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {config.primaryCtaText}
            </button>
          </div>
        </div>
      </section>

      {/* Product Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 md:px-8 text-xs border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#690b1b] text-white font-bold flex items-center justify-center text-[10px]">
              AS
            </div>
            <span className="font-bold text-white">Abroad Simplified</span> — Psychometric & Study Abroad Platform
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/psychometric-test?type=junior" className="hover:text-white transition-colors">Class 7–9 Assessment</Link>
            <Link href="/psychometric-test?type=grade10" className="hover:text-white transition-colors">Class 10 Assessment</Link>
            <Link href="/psychometric-test?type=grade12" className="hover:text-white transition-colors">Class 12 Assessment</Link>
            <Link href="/university-finder" className="hover:text-white transition-colors">University Finder</Link>
          </div>
          <div>© 2026 Abroad Simplified. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
