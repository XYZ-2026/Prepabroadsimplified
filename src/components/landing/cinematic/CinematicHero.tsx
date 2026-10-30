'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, ChevronRight } from 'lucide-react';
import ParentStudentHeroVisual from './ParentStudentHeroVisual';

export default function CinematicHero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] pt-6 sm:pt-10 lg:pt-14 pb-10 sm:pb-16 lg:pb-20 px-3.5 sm:px-6 md:px-10 border-b border-[#E4E7EC]">
      {/* ── Background Ambient Lighting ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-br from-[#2563EB]/10 via-[#38BDF8]/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] bg-[#2563EB]/6 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#080F1C]/4 rounded-full blur-[90px]" />

        {/* Fine geometric circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.2]" xmlns="http://www.w3.org/2000/svg">
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* ── Left Column: Editorial Headline & Actions (with Mobile Visual Interleaved) ── */}
          <div className="lg:col-span-7 flex flex-col text-left">
            
            {/* 1. Small Brand / Age-Group Eyebrow */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-3.5 sm:mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-bold tracking-[0.1em] sm:tracking-[0.14em] uppercase shadow-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
                <span>STUDENT &amp; PARENT GUIDANCE · GRADES 7–12</span>
              </span>
            </motion.div>

            {/* 2. Main Headline & Supporting Tagline */}
            <motion.h1
              variants={itemVariants}
              className="text-[30px] xs:text-[36px] sm:text-[48px] md:text-[56px] lg:text-[62px] leading-[1.08] sm:leading-[1.04] tracking-[-0.04em] font-black text-[#080F1C]"
            >
              <span>Clarity for</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#080F1C]">
                Their Future.
              </span>{' '}
              <br />
              <span className="text-[#080F1C]">Built for Ambition.</span>
            </motion.h1>

            {/* 3. Short Supporting Paragraph Clearly Highlighting the 5 Services */}
            <motion.p
              variants={itemVariants}
              className="mt-3.5 sm:mt-5 text-[14px] xs:text-[15px] sm:text-[16.5px] leading-[1.65] sm:leading-[1.75] text-[#344054] max-w-[580px] font-normal"
            >
              Empowering students and parents with scientific psychometric assessments, personalised career roadmaps, Digital SAT preparation, one-to-one tutoring, and university profile building.
            </motion.p>

            {/* 4. Mobile Hero Composition: Parent & Student Visual placed right here on Mobile */}
            <motion.div variants={itemVariants} className="block lg:hidden my-6 w-full">
              <ParentStudentHeroVisual />
            </motion.div>

            {/* 5. Primary and Secondary Action CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mt-2 sm:mt-6 w-full sm:w-auto"
            >
              {/* Primary Assessment CTA */}
              <Link
                href="/auth?tab=register"
                className="h-[50px] sm:h-[54px] px-6 sm:px-8 rounded-[12px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] sm:text-[15px] font-bold inline-flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all cursor-pointer ring-1 ring-[#2563EB]/40 w-full sm:w-auto shrink-0 active:scale-[0.99]"
              >
                <span>Start Assessment Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary Service Exploration Action */}
              <a
                href="#services"
                className="h-[50px] sm:h-[54px] px-5 sm:px-7 rounded-[12px] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#080F1C] text-[14px] sm:text-[15px] font-semibold inline-flex items-center justify-center gap-2 shadow-xs hover:border-[#2563EB]/60 hover:text-[#2563EB] transition-all cursor-pointer w-full sm:w-auto shrink-0 active:scale-[0.99]"
              >
                <Compass className="w-4 h-4 text-[#2563EB]" />
                <span>Explore Our Services</span>
              </a>

              {/* Tertiary View Sample Report - Tablet & Desktop */}
              <Link
                href="/sample-reports"
                className="hidden sm:inline-flex h-[54px] px-4 rounded-[12px] text-[#667085] hover:text-[#2563EB] text-[13.5px] font-semibold items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <span>Sample Reports</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* 6. Trust Metrics Strip */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#E4E7EC] pt-4 sm:pt-6 mt-6 sm:mt-8 text-left"
            >
              <div>
                <div className="text-[17px] xs:text-[19px] sm:text-[23px] font-black text-[#080F1C] tracking-tight">15,000+</div>
                <div className="text-[10px] xs:text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5 leading-tight">Students Guided</div>
              </div>
              <div>
                <div className="text-[17px] xs:text-[19px] sm:text-[23px] font-black text-[#080F1C] tracking-tight">98%</div>
                <div className="text-[10px] xs:text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5 leading-tight">Parent Clarity Rate</div>
              </div>
              <div>
                <div className="text-[17px] xs:text-[19px] sm:text-[23px] font-black text-[#080F1C] tracking-tight">100+</div>
                <div className="text-[10px] xs:text-[11px] sm:text-[12px] font-medium text-[#667085] mt-0.5 leading-tight">Global Universities</div>
              </div>
            </motion.div>

          </div>

          {/* ── Right Column: Desktop Parent & Student Visual Composition ── */}
          <motion.div variants={itemVariants} className="hidden lg:flex lg:col-span-5 justify-center w-full">
            <ParentStudentHeroVisual />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
