'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IQ_ASSESSMENT_CONFIG } from '@/config/iq-assessment.config';
import PremiumToolsCards from '@/components/PremiumToolsCards';
import { 
  Brain, 
  Clock, 
  Layers, 
  Compass, 
  Hash, 
  Lightbulb, 
  Grid, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  Award, 
  ChevronDown, 
  GraduationCap, 
  Target, 
  HelpCircle,
  Eye,
  Zap,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function IQAssessmentLandingPage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Domain Radar Sample Data for Visual Profile Card
  const radarSampleData = [
    { subject: 'Pattern', A: 92, fullMark: 100 },
    { subject: 'Spatial', A: 85, fullMark: 100 },
    { subject: 'Numerical', A: 78, fullMark: 100 },
    { subject: 'Logical', A: 88, fullMark: 100 },
    { subject: 'Abstract', A: 90, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans flex flex-col selection:bg-[#690b1b] selection:text-white">
      
      {/* ── 1. STICKY NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-[#690b1b]/95 backdrop-blur-md border-b border-amber-900/30 text-white px-4 md:px-8 py-4 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm md:text-base tracking-tight text-white uppercase block leading-none">
              ABROAD SIMPLIFIED
            </span>
            <span className="text-[10px] text-amber-300/80 font-mono font-semibold tracking-widest uppercase block mt-0.5">
              Cognitive Division
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-slate-200">
          <a href="#how-it-works" className="hover:text-amber-300 transition-colors">How It Works</a>
          <a href="#what-we-measure" className="hover:text-amber-300 transition-colors">What You Measure</a>
          <a href="#results" className="hover:text-amber-300 transition-colors">Results</a>
          <a href="#faq" className="hover:text-amber-300 transition-colors">FAQ</a>
        </nav>

        {/* Right CTA */}
        <Link
          href="/iq-test/instructions"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
        >
          START IQ ASSESSMENT
        </Link>
      </header>

      <main className="flex-1">

        {/* ── 2. HERO SECTION (DARK BURGUNDY) ── */}
        <section className="bg-gradient-to-b from-[#690b1b] via-[#560916] to-[#3d060f] text-white pt-16 pb-24 px-4 md:px-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* HERO LEFT */}
            <div className="lg:col-span-6 flex flex-col text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold tracking-widest uppercase mb-6 w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {IQ_ASSESSMENT_CONFIG.questionCount}-QUESTION COGNITIVE ASSESSMENT
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] mb-6"
              >
                DISCOVER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                  HOW YOUR MIND
                </span> <br />
                THINKS.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-base text-slate-200/90 leading-relaxed font-medium mb-8 max-w-xl"
              >
                A visual-first cognitive assessment measuring pattern recognition, logical reasoning, numerical thinking, spatial reasoning, and abstract problem solving.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-10"
              >
                <Link
                  href="/iq-test/instructions"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  START IQ ASSESSMENT
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm text-center transition-all"
                >
                  SEE HOW IT WORKS
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-xs text-slate-300 font-medium pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>45 Questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>5 Domains</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Instant Result</span>
                </div>
              </div>
            </div>

            {/* HERO RIGHT: LIVE PRODUCT UI MOCKUP */}
            <div className="lg:col-span-6 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full max-w-lg bg-slate-900/90 rounded-3xl border border-white/15 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden text-slate-100"
              >
                {/* Mockup Top Shell Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-slate-300">LIVE TEST INTERFACE</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">16 / 45</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 12:45
                    </span>
                  </div>
                </div>

                {/* Section Badge */}
                <div className="mb-3">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md bg-purple-900/40 border border-purple-500/30 text-purple-300">
                    SECTION 2: SPATIAL / FIGURE REASONING
                  </span>
                </div>

                {/* Prompt */}
                <h4 className="text-sm font-bold text-white leading-snug mb-4">
                  Q16. Which figure represents an exact 90° clockwise rotation of the reference block?
                </h4>

                {/* Visual Matrix Vector Box */}
                <div className="mb-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center">
                  <div className="w-24 h-24 bg-slate-900 rounded-xl border border-purple-500/30 p-2 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M30 20 L30 80 L80 80 L80 60 L50 60 L50 20 Z" fill="#8b5cf6" />
                    </svg>
                  </div>
                </div>

                {/* Answer Options Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">A</span>
                    <span className="text-slate-300 font-medium">Upright L</span>
                  </div>
                  <div className="p-3 rounded-xl border border-purple-500/80 bg-purple-950/40 ring-1 ring-purple-500/50 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">B</span>
                    <span className="text-purple-200 font-bold">90° Rotated</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 ml-auto" />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">C</span>
                    <span className="text-slate-300 font-medium">Inverted Mirror</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-[10px] flex items-center justify-center">D</span>
                    <span className="text-slate-300 font-medium">Circle Block</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* ── 3. TRUST METRIC STRIP ── */}
        <section className="bg-[#560916] border-y border-amber-900/40 py-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {IQ_ASSESSMENT_CONFIG.trustMetrics.map((item, idx) => (
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

        {/* ── 4. SECTION — WHY TAKE THE ASSESSMENT? ── */}
        <section id="what-we-measure" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-6 flex flex-col text-left">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
                WHY TAKE THIS ASSESSMENT?
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Understand more than just a number.
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-6">
                A single overall score is only the starting point. This standardized assessment measures multidimensional cognitive performance across 5 specific domains—giving students, parents, and counsellors meaningful insights into problem-solving style, visual processing speed, and logical reasoning capacity.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-slate-700 font-semibold">Identifies natural cognitive strengths in spatial, numerical, or abstract reasoning.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-slate-700 font-semibold">Provides objective baseline data for academic strategy & career path conversations.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#690b1b] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-slate-700 font-semibold">Integrates seamlessly with Abroad Simplified psychometric profile tools.</span>
                </div>
              </div>
            </div>

            {/* Right Cognitive Profile Visualization */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-wider">Sample Cognitive Balance Profile</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">5 Domains</span>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarSampleData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                      <Radar name="Cognitive Profile" dataKey="A" stroke="#690b1b" fill="#690b1b" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium">Evaluates visual, spatial, quantitative, logical, and working memory performance.</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 5. SECTION — WHAT DOES YOUR SCORE MEAN? ── */}
        <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
                SCORE INTERPRETATION FRAMEWORK
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                What does your score mean?
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
                Your score is interpreted relative to the standardized scoring framework used by this assessment (Mean = 100, Standard Deviation = 15).
              </p>
            </div>

            {/* Score Band Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {IQ_ASSESSMENT_CONFIG.scoreBands.map((band, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold text-[#690b1b] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                        {band.level}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">{band.range}</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 mb-2">{band.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{band.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 6. SECTION — WHAT YOUR RESULT REVEALS ── */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              5 COGNITIVE DOMAINS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              What your result reveals
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
              Each section tests distinct cognitive faculties to build a comprehensive picture of how you process information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IQ_ASSESSMENT_CONFIG.domains.map((domain) => (
              <div 
                key={domain.id} 
                className="bg-white rounded-3xl border border-purple-100 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#690b1b] group-hover:scale-110 transition-transform">
                      {domain.id === 1 && <Grid className="w-5 h-5" />}
                      {domain.id === 2 && <Compass className="w-5 h-5" />}
                      {domain.id === 3 && <Hash className="w-5 h-5" />}
                      {domain.id === 4 && <Lightbulb className="w-5 h-5" />}
                      {domain.id === 5 && <Brain className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {domain.itemCount} Items
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{domain.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{domain.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-[#690b1b] block">Impact for Students:</span>
                  <span className="text-xs text-slate-600 font-medium">{domain.reveals}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. SECTION — HOW THE 45-QUESTION ASSESSMENT WORKS (DARK BURGUNDY) ── */}
        <section id="how-it-works" className="bg-[#690b1b] text-white py-20 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-2 block">
                THREE-STEP PROCESS
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                How your assessment works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/60 rounded-3xl border border-amber-500/20 p-8 flex flex-col justify-between relative backdrop-blur-md">
                <div>
                  <div className="text-4xl font-display font-extrabold text-amber-400 mb-4">01</div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">SOLVE</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    Complete 45 original visual and analytical questions across 5 sections within the 15-minute standardized test session.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-bold text-amber-300">
                  Visual Matrix • Spatial • Quantitative
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-3xl border border-amber-500/20 p-8 flex flex-col justify-between relative backdrop-blur-md">
                <div>
                  <div className="text-4xl font-display font-extrabold text-amber-400 mb-4">02</div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">MEASURE</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    Your responses are scored using an authoritative deterministic algorithm that calculates domain-weighted scores and Z-scores.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-bold text-amber-300">
                  Deterministic • Standardized Model
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-3xl border border-amber-500/20 p-8 flex flex-col justify-between relative backdrop-blur-md">
                <div>
                  <div className="text-4xl font-display font-extrabold text-amber-400 mb-4">03</div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">UNDERSTAND</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                    Receive your Estimated IQ Score, percentile rank, domain radar profile, and an official downloadable PDF certificate.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-bold text-amber-300">
                  Instant Dashboard & PDF Download
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 8. SECTION — WHAT YOU RECEIVE (WARM CREAM) ── */}
        <section id="results" className="bg-[#fdfbf7] py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              COMPLETE OUTPUT PACKAGE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              What's included in your result?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">Estimated IQ Score</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Standardized score ($Mean = 100, SD = 15$) indicating overall cognitive ability estimate.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">Percentile Rank</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Statistical rank showing how your performance compares relative to the scoring model.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">5-Domain Breakdown</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Detailed percentage breakdowns across pattern, spatial, numerical, logical, and abstract items.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">Strongest & Developmental Areas</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Clear identification of primary cognitive strengths and relative developmental growth areas.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">Official PDF Certificate</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Direct downloadable PDF certificate issued by the Simplified School of Education with verification ID.</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-1">Student Profile Integration</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Integrates directly into your Abroad Simplified dashboard for holistic counsellor academic guidance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. SECTION — BUILT FOR STUDENTS ── */}
        <section className="bg-slate-900 text-white py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-2 block">
              STUDENT ROADMAP INTEGRATION
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
              MORE THAN A SCORE.
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl mx-auto mb-14">
              A cognitive score is one part of a broader student journey. Abroad Simplified connects cognitive insights into holistic academic and career planning.
            </p>

            {/* Visual Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <Brain className="w-8 h-8 text-amber-400 mb-3" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">1. COGNITIVE ABILITY</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">45-Item Assessment</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <FileText className="w-8 h-8 text-purple-400 mb-3" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">2. PSYCHOMETRIC PROFILE</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Interests & Personality</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <Compass className="w-8 h-8 text-emerald-400 mb-3" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">3. CAREER EXPLORATION</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Field & Stream Alignment</span>
              </div>
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
                <UserCheck className="w-8 h-8 text-amber-400 mb-3" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">4. COUNSELLOR GUIDANCE</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Actionable Roadmap</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── 10. SECTION — WHY THIS ASSESSMENT ── */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              PRODUCT ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Why this assessment?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">STRUCTURED</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Fixed 45-question standardized item bank with consistent difficulty weighting.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">VISUAL-FIRST</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Features vector SVG matrix puzzles, spatial figure rotations, and abstract sequence logic.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">MULTI-DOMAIN</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Evaluates 5 balanced cognitive areas to prevent single-domain bias.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#690b1b] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">STUDENT-CENTRIC</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Designed to support clearer academic planning and counsellor discussion.
              </p>
            </div>
          </div>
        </section>

        {/* ── 11. SECTION — REAL TEST EXPERIENCE ── */}
        <section className="bg-slate-100/70 py-20 px-4 md:px-8 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
                AUTHENTIC PRODUCT INTERFACE
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                Real test experience
              </h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-3">
                Preview actual test interface screens, visual matrix items, and downloadable certificates.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Visual Matrix Item */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-3">
                  Visual Matrix Question
                </span>
                <div className="aspect-video bg-slate-950 rounded-2xl p-4 flex items-center justify-center mb-3">
                  <div className="grid grid-cols-2 gap-2 w-28">
                    <div className="w-full aspect-square bg-slate-900 border border-slate-800 rounded flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#8b5cf6]" />
                    </div>
                    <div className="w-full aspect-square bg-slate-900 border border-slate-800 rounded flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border border-[#8b5cf6]" />
                    </div>
                    <div className="w-full aspect-square bg-slate-900 border border-slate-800 rounded flex items-center justify-center">
                      <div className="w-4 h-4 bg-[#8b5cf6]" />
                    </div>
                    <div className="w-full aspect-square bg-slate-900 border border-purple-500/50 rounded flex items-center justify-center text-amber-400 font-bold">
                      ?
                    </div>
                  </div>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900">Pattern Matrix Item</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Non-verbal matrix reasoning with interactive SVG answer cards.</p>
              </div>

              {/* Card 2: Result Radar Chart */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-3">
                  Result Dashboard
                </span>
                <div className="aspect-video bg-purple-950/20 rounded-2xl p-2 flex items-center justify-center mb-3">
                  <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarSampleData}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9 }} />
                        <Radar name="Profile" dataKey="A" stroke="#690b1b" fill="#690b1b" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900">Domain Balance Radar</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Instant score visualization across all 5 cognitive domains.</p>
              </div>

              {/* Card 3: Certificate Preview */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-3">
                  Official PDF Certificate
                </span>
                <div className="aspect-video bg-amber-50/60 rounded-2xl border border-amber-200 p-4 flex flex-col justify-between mb-3 text-center">
                  <div className="text-[9px] font-extrabold text-[#690b1b] uppercase tracking-widest">SIMPLIFIED SCHOOL OF EDUCATION</div>
                  <div className="text-xs font-display font-extrabold text-slate-900">Cognitive Assessment Certificate</div>
                  <div className="text-[10px] font-mono text-amber-800 font-bold">Estimated IQ: 124 • 95th Percentile</div>
                </div>
                <h4 className="font-display font-bold text-sm text-slate-900">PDF Certificate Download</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Direct downloadable PDF with unique verification ID.</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── 12. SECTION — TESTIMONIALS / GUIDANCE FEEDBACK ── */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#690b1b] uppercase tracking-widest mb-2 block">
              GUIDANCE EXPERIENCE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
              Student & Counsellor Perspectives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm relative">
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6 italic">
                "The 45-question format was fast and structured. Understanding my strongest area in spatial reasoning gave my counsellor and me clear direction when selecting STEM streams."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-[#690b1b] font-bold text-xs flex items-center justify-center">
                  S
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Student Candidate</div>
                  <div className="text-[11px] text-slate-500 font-medium">Class 11 Science Stream</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm relative">
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6 italic">
                "Having objective 5-domain cognitive profile data alongside psychometric results helps us conduct far more grounded academic planning sessions with parents."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  C
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Academic Guidance Counsellor</div>
                  <div className="text-[11px] text-slate-500 font-medium">Abroad Simplified Network</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 13. ACCORDION FAQ ── */}
        <section id="faq" className="bg-slate-100/70 py-20 px-4 md:px-8 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-14">
              <HelpCircle className="w-10 h-10 text-[#690b1b] mx-auto mb-3 opacity-90" />
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {IQ_ASSESSMENT_CONFIG.faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm md:text-base text-slate-900 hover:text-[#690b1b] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-[#690b1b]' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 pt-0 text-xs md:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100/80"
                      >
                        <div className="pt-3">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── 14. FINAL CTA ── */}
        <section className="bg-[#690b1b] text-white py-20 px-4 md:px-8 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <Target className="w-14 h-14 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight mb-4">
              READY TO DISCOVER YOUR COGNITIVE PROFILE?
            </h2>
            <p className="text-sm md:text-base text-slate-200 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
              45 questions. One clearer picture of how you reason, recognize patterns, and solve problems.
            </p>

            <Link
              href="/iq-test/instructions"
              className="inline-flex px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base shadow-2xl shadow-amber-950/60 items-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              START THE IQ ASSESSMENT
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex items-center justify-center gap-6 text-xs text-amber-200/80 font-bold uppercase tracking-wider mt-8">
              <span>~15 Minutes</span>
              <span>•</span>
              <span>45 Questions</span>
              <span>•</span>
              <span>Instant Result</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-200">
          <PremiumToolsCards />
        </section>

      </main>

      {/* ── 15. DARK FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div>
            <div className="font-display font-extrabold text-sm text-white uppercase tracking-tight mb-3">
              ABROAD SIMPLIFIED
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              Standardized Cognitive Assessment Division. Supporting holistic student profiling and academic guidance.
            </p>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Product</div>
            <ul className="space-y-2 font-medium">
              <li><Link href="/iq-test" className="hover:text-amber-400 transition-colors">IQ Assessment Home</Link></li>
              <li><Link href="/iq-test/instructions" className="hover:text-amber-400 transition-colors">Assessment Instructions</Link></li>
              <li><a href="#results" className="hover:text-amber-400 transition-colors">Result Features</a></li>
              <li><a href="#what-we-measure" className="hover:text-amber-400 transition-colors">5 Cognitive Domains</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Platform</div>
            <ul className="space-y-2 font-medium">
              <li><Link href="/psychometric-test" className="hover:text-amber-400 transition-colors">Psychometric Assessment</Link></li>
              <li><Link href="/parent-assessment" className="hover:text-amber-400 transition-colors">Parent Assessment</Link></li>
              <li><Link href="/university-finder" className="hover:text-amber-400 transition-colors">University Finder</Link></li>
              <li><Link href="/dashboard/student" className="hover:text-amber-400 transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Support & Legal</div>
            <ul className="space-y-2 font-medium">
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Simplified School of Education</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-slate-500 font-medium">
          © {new Date().getFullYear()} Abroad Simplified. All rights reserved. Standardized Cognitive Ability Assessment.
        </div>
      </footer>

    </div>
  );
}
