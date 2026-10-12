'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';

interface MetricPreview {
  id: string;
  label: string;
  pathway: string;
  fitScore: string;
  studentCohort: string;
  metrics: Array<{ title: string; score: string; width: string }>;
}

const PREVIEW_PROFILES: MetricPreview[] = [
  {
    id: 'grade10',
    label: 'Class 10 · Stream Fit',
    pathway: 'Artificial Intelligence & Computational Physics',
    fitScore: '94%',
    studentCohort: 'Class of 2027 · Verified Assessment Data',
    metrics: [
      { title: 'Cognitive & Analytical Aptitude', score: '94%', width: '94%' },
      { title: 'STEM & Technology Affinity', score: '91%', width: '91%' },
      { title: 'SAT & Quantitative Readiness', score: '88%', width: '88%' },
      { title: 'Research & Leadership Potential', score: '92%', width: '92%' },
    ],
  },
  {
    id: 'grade12',
    label: 'Class 12 · College & Career Admissions',
    pathway: 'Robotics Engineering & Applied Mathematics',
    fitScore: '97%',
    studentCohort: 'Class of 2025 · Premier College & STEM Shortlist',
    metrics: [
      { title: 'Digital SAT Projected Score', score: '1540', width: '96%' },
      { title: 'Academic Research Publication Index', score: 'Top 3%', width: '97%' },
      { title: 'University & College Match', score: 'Tier 1 Fit', width: '93%' },
      { title: 'Extracurricular Spike Cohesion', score: '95%', width: '95%' },
    ],
  },
  {
    id: 'junior',
    label: 'Class 7–9 · Aptitude Foundation',
    pathway: 'Interdisciplinary STEM & Creative Technology',
    fitScore: '91%',
    studentCohort: 'Middle School Discovery Vector',
    metrics: [
      { title: 'Fluid Logic & Spatial Visualization', score: '89%', width: '89%' },
      { title: 'VARK Visual-Kinesthetic Modality', score: 'Primary', width: '92%' },
      { title: 'Curiosity & Investigative Mindset', score: '94%', width: '94%' },
      { title: 'Parent-Student Alignment Score', score: '88%', width: '88%' },
    ],
  },
];

export default function CinematicHero() {
  const shouldReduceMotion = useReducedMotion();
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const activeProfile = PREVIEW_PROFILES[activeProfileIdx];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] pt-8 sm:pt-14 pb-16 lg:pb-24 px-4 sm:px-6 md:px-10 border-b border-[#E4E7EC]">
      {/* ── Background Atmospheric Lighting & Floating Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Floating Ambient Glowing Orbs */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-10, 10, -10], x: [-6, 6, -6] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-br from-[#2563EB]/12 via-[#38BDF8]/10 to-transparent rounded-full blur-[120px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [10, -10, 10], x: [8, -8, 8] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-[#2563EB]/8 rounded-full blur-[100px]"
        />
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-[#080F1C]/5 rounded-full blur-[90px]" />

        {/* Fine geometric circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cinematic-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.25" />
              <circle cx="64" cy="0" r="1.5" fill="#2563EB" fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cinematic-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          {/* ── Left Column: Editorial Headline & Actions ── */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Pill Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.16em] uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                AI-POWERED STUDENT INTELLIGENCE · GRADES 7–12
              </span>
            </motion.div>

            {/* Editorial Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-[34px] xs:text-[42px] sm:text-[54px] md:text-[62px] lg:text-[68px] leading-[1.03] tracking-[-0.05em] font-black text-[#080F1C]"
            >
              Clarity for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#080F1C]">
                Their Future.
              </span>{' '}
              <br />
              <span className="text-[#080F1C]">Built for Ambition.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-[15px] sm:text-[17px] leading-[1.8] text-[#344054] max-w-[580px] font-normal"
            >
              Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth?tab=register"
                  className="h-[54px] px-8 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[15px] font-bold inline-flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(37,99,235,0.28)] transition-all cursor-pointer ring-1 ring-[#2563EB]/40 w-full sm:w-auto"
                >
                  <span>Start Assessment Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#assessments"
                  className="h-[54px] px-7 rounded-[12px] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#080F1C] text-[15px] font-semibold inline-flex items-center justify-center gap-2 shadow-xs hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all cursor-pointer w-full sm:w-auto"
                >
                  <Cpu className="w-4 h-4 text-[#2563EB]" />
                  <span>Explore Diagnostic Matrix</span>
                </a>
              </motion.div>

              <Link
                href="/sample-report?type=grade10"
                className="h-[54px] px-6 rounded-[12px] border border-transparent text-[#667085] hover:text-[#2563EB] text-[14px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all"
              >
                <span>View Sample Report</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trust Metrics Strip */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 border-t border-[#E4E7EC] pt-7 mt-9 text-left"
            >
              <div>
                <div className="text-[20px] sm:text-[24px] font-black text-[#080F1C] tracking-tight">15,000+</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5">Students Guided</div>
              </div>
              <div>
                <div className="text-[20px] sm:text-[24px] font-black text-[#080F1C] tracking-tight">98%</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5">Parent Clarity Rate</div>
              </div>
              <div>
                <div className="text-[20px] sm:text-[24px] font-black text-[#080F1C] tracking-tight">100+</div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5">Global Universities</div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column: Interactive Diagnostic Simulator Card ── */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center w-full">
            <motion.div 
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="w-full max-w-[500px] bg-white rounded-[22px] border border-[#CBD5E1] shadow-[0_20px_50px_rgba(8,15,28,0.08)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(37,99,235,0.14)]"
            >
              {/* Window Header */}
              <div className="h-12 border-b border-[#E4E7EC] px-5 bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[11px] font-mono font-medium text-[#667085] ml-2 truncate">
                    CLARVO Diagnostic Engine v5.0
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3" /> Live
                </span>
              </div>

              {/* Profile Selector Chips */}
              <div className="p-4 bg-[#F8FAFC]/80 border-b border-[#E4E7EC] flex gap-2 overflow-x-auto no-scrollbar">
                {PREVIEW_PROFILES.map((prof, i) => (
                  <button
                    key={prof.id}
                    onClick={() => setActiveProfileIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                      activeProfileIdx === i
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-white text-[#667085] border border-[#E4E7EC] hover:text-[#080F1C]'
                    }`}
                  >
                    {prof.label}
                  </button>
                ))}
              </div>

              {/* Profile Details with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.25, ease: 'easeOut' }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] bg-[#E8F0FF] px-2.5 py-1 rounded-md">
                      Top Diagnostic Fit
                    </span>
                    <div className="text-[13px] font-bold text-[#080F1C]">
                      Match Index: <span className="text-[#2563EB] font-black">{activeProfile.fitScore}</span>
                    </div>
                  </div>

                  <h3 className="text-[18px] font-bold text-[#080F1C] leading-snug mt-2 min-h-[46px] flex items-center">
                    {activeProfile.pathway}
                  </h3>
                  <p className="text-[12px] text-[#667085] mt-1">{activeProfile.studentCohort}</p>

                  <div className="w-full h-px bg-[#E4E7EC] my-5" />

                  {/* Quantitative Metric Bars */}
                  <div className="space-y-4">
                    {activeProfile.metrics.map((metric, mIdx) => (
                      <div key={metric.title} className="space-y-1.5">
                        <div className="flex justify-between text-[12px]">
                          <span className="font-semibold text-[#344054] truncate max-w-[280px]">
                            {metric.title}
                          </span>
                          <span className="font-bold text-[#080F1C] font-mono">{metric.score}</span>
                        </div>
                        <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: metric.width }}
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.7,
                              delay: shouldReduceMotion ? 0 : mIdx * 0.08,
                              ease: [0.16, 1, 0.3, 1] as const,
                            }}
                            className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA within Card */}
                  <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[11px] text-[#667085]">30 Modules Evaluated</span>
                    <Link
                      href="/sample-report?type=grade10"
                      className="text-[12px] font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1 group"
                    >
                      <span>Inspect Full Dossier</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
