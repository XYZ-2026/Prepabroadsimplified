'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    num: '01',
    title: 'Discovery',
    desc: '30-factor psychometric and cognitive diagnostic',
    fullDesc: 'Evaluates cognitive processing speed, Big Five behavioral drivers, VARK study modes, and Holland vocational interests.',
    link: '/psychometric-test',
    actionText: 'Take Diagnostic',
  },
  {
    num: '02',
    title: 'Stream & Subjects',
    desc: 'Evidence-backed Class 11-12 stream mapping',
    fullDesc: 'Eliminates costly stream switching in Class 11 by aligning subject choices (PCM, PCB, Commerce, Humanities) with verifiable cognitive aptitudes.',
    link: '/discover',
    actionText: 'Explore Stream Models',
  },
  {
    num: '03',
    title: 'Academic Mastery',
    desc: '1-to-1 tutoring & Digital SAT 1500+ prep',
    fullDesc: 'Adaptive drills and private tutoring engineered for IB, Cambridge, and CBSE curricula paired with elite SAT score accelerators.',
    link: '/iq-test',
    actionText: 'SAT & Tutoring Prep',
  },
  {
    num: '04',
    title: 'Profile & Research',
    desc: 'High school research publications & spike building',
    fullDesc: 'Pairing students with published university mentors to draft and publish original academic papers in peer-reviewed high school journals.',
    link: '/discover',
    actionText: 'View Research Tracks',
  },
  {
    num: '05',
    title: 'Global Admissions',
    desc: 'Shortlisting top global universities & applications',
    fullDesc: 'Predictive admissions odds, financial scholarship strategies, and strategic application dossiers for Ivy League, Russell Group, and top STEM institutes.',
    link: '/university-finder',
    actionText: 'University Matcher',
  },
];

export default function StudentJourneySection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = JOURNEY_STEPS[activeStepIdx];

  return (
    <section id="journey" className="scroll-mt-20 sm:scroll-mt-24 bg-[#F8FAFC] px-4 sm:px-6 md:px-10 py-16 sm:py-24 border-b border-[#E4E7EC]">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
            THE STUDENT DEVELOPMENT JOURNEY
          </div>

          <h2 className="text-[28px] sm:text-[38px] md:text-[48px] font-black tracking-[-0.04em] text-[#080F1C] max-w-4xl mx-auto leading-tight">
            From self-discovery to Ivy League &amp; top university acceptance
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-[#667085] max-w-2xl mx-auto">
            A coherent multi-year framework designed to guide secondary school students through critical academic turning points without guesswork.
          </p>
        </motion.div>

        {/* ── 5 Step Horizontal Pipeline ── */}
        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-6 left-[8%] w-[84%] h-[2px] bg-[#E2E8F0] z-0 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] as const }}
              className="origin-left h-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#2563EB]"
            />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 relative z-10"
          >
            {JOURNEY_STEPS.map((step, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <motion.div
                  key={step.num}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: shouldReduceMotion ? 0.05 : 0.4 },
                    },
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
                  onClick={() => setActiveStepIdx(idx)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] font-black transition-all duration-300 shadow-sm ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] scale-110 ring-4 ring-blue-100'
                        : 'bg-white text-[#475569] border border-[#CBD5E1] group-hover:border-[#2563EB] group-hover:text-[#2563EB]'
                    }`}
                  >
                    {step.num}
                  </div>

                  <h3
                    className={`mt-4 text-[16px] sm:text-[17px] font-bold transition-colors ${
                      isActive ? 'text-[#2563EB]' : 'text-[#080F1C]'
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-[12px] sm:text-[13px] text-[#667085] leading-relaxed max-w-[190px] text-center">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Active Step Spotlight Card with AnimatePresence ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.num}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.25, ease: 'easeOut' }}
            className="mt-12 max-w-3xl mx-auto bg-white rounded-[20px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                <span>Stage {activeStep.num} Deep Dive</span>
                <span>·</span>
                <span>{activeStep.title}</span>
              </div>
              <h4 className="text-[18px] sm:text-[20px] font-extrabold text-[#080F1C]">
                {activeStep.title} Milestone Execution
              </h4>
              <p className="text-[13px] sm:text-[14px] text-[#475569] leading-relaxed max-w-xl">
                {activeStep.fullDesc}
              </p>
            </div>

            <Link
              href={activeStep.link}
              className="h-11 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-bold inline-flex items-center justify-center gap-2 shrink-0 transition-all shadow-xs cursor-pointer hover:shadow-md"
            >
              <span>{activeStep.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
