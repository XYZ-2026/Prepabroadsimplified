'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Scenario {
  tag: string;
  studentMsg: string;
  stream: string;
  spike: string;
  target: string;
  tip: string;
}

const SCENARIOS: Scenario[] = [
  {
    tag: 'Stream Selection (Class 10)',
    studentMsg: "I'm in Grade 10 with 96% in Math and keen interest in AI. What stream and extracurricular spikes should I prioritize for top engineering colleges?",
    stream: 'PCM + Advanced Computer Science',
    spike: 'Mentored Machine Learning research paper published in high school journal',
    target: 'Digital SAT 1520+ by Grade 11 Spring',
    tip: '💡 Tip: Highlighting published research boosts top-tier STEM admit odds by 34%.',
  },
  {
    tag: 'Digital SAT 1500+ Strategy',
    studentMsg: "My current baseline on diagnostic tests is 1380. How do I bridge the gap to 1530+ for top universities and premier competitive programs?",
    stream: 'Adaptive Module Mastery (Desmos + Vocabulary Inference)',
    spike: 'Focused 1-on-1 pacing diagnostics identifying second-stage hard module triggers',
    target: 'Aim for 780 Math / 750+ Reading & Writing',
    tip: '💡 Tip: 82% of students who cross 1500 utilize targeted question-bank error logs.',
  },
  {
    tag: 'Extracurricular Spike Building',
    studentMsg: "I have good grades in Economics and Commerce. How do I build an authentic leadership spike for competitive finance programs?",
    stream: 'Commerce with Mathematics + Applied Microeconomics',
    spike: 'Financial literacy initiative or micro-credit empirical field research paper',
    target: 'National economics Olympiad + Wharton HS Investment Challenge',
    tip: '💡 Tip: Admissions committees favor deep singular spikes over scattered superficial clubs.',
  },
  {
    tag: 'Psychometric Analysis',
    studentMsg: "How does CLARVO know which career fits my personality and learning style better than school marks?",
    stream: 'Cross-Domain Aptitude & Behavioral Triangulation',
    spike: 'Holland RIASEC fitment + Big Five grit index + VARK study modalities',
    target: 'Zero stream regret: locks in natural intrinsic cognitive strengths',
    tip: '💡 Tip: 30 diagnostic modules evaluate executive function, not memorized quiz facts.',
  },
];

export default function AIAdvisorSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeScenario = SCENARIOS[activeIdx];

  return (
    <section
      id="ai-advisor"
      className="scroll-mt-20 sm:scroll-mt-24 w-full bg-[#080F1C] px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24 lg:py-28 overflow-hidden text-left border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="max-w-[540px]"
        >
          <div className="inline-flex items-center gap-2 text-[#38BDF8] text-[11px] tracking-[0.22em] uppercase font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI STUDENT &amp; CAREER ADVISOR
          </div>

          <h2 className="text-white text-[32px] sm:text-[44px] md:text-[54px] leading-[1.05] tracking-[-0.05em] font-black">
            Personalized guidance <br />
            grounded in real <br />
            student outcomes
          </h2>

          <p className="mt-6 text-[#94A3B8] text-[15px] md:text-[17px] leading-relaxed max-w-[500px]">
            Ask anything from stream selection after Grade 10 to SAT target timelines and premier college & career profile building. Our AI provides honest, data-backed guidance without guesswork.
          </p>

          {/* Interactive Scenario Chips */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-8">
            {SCENARIOS.map((sc, i) => (
              <motion.button
                key={sc.tag}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                onClick={() => setActiveIdx(i)}
                className={`h-[38px] sm:h-[40px] px-3.5 rounded-[10px] text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
                  activeIdx === i
                    ? 'bg-[#2563EB] text-white border border-[#2563EB] shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/90 border border-slate-700 text-[#CBD5E1] hover:text-white hover:border-slate-500'
                }`}
              >
                {sc.tag}
              </motion.button>
            ))}
          </div>

          <Link
            href="/auth?tab=register"
            className="mt-8 sm:mt-10 h-[52px] sm:h-[56px] px-8 rounded-[14px] bg-[#2563EB] text-white text-[15px] font-bold hover:bg-[#1D4ED8] transition-all inline-flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(37,99,235,0.35)] w-full sm:w-auto cursor-pointer"
          >
            <span>Try CLARVO AI Advisor Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Right Column: Dark Chat Simulation Widget */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="flex justify-center lg:justify-end w-full"
        >
          <div className="w-full max-w-[480px] rounded-[20px] border border-slate-800 bg-[#0F172A] overflow-hidden shadow-2xl">
            {/* Widget Bar */}
            <div className="h-[60px] border-b border-slate-800 px-5 flex items-center justify-between bg-slate-900/70">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <div className="text-[#38BDF8] tracking-[0.1em] text-[12px] font-extrabold uppercase">
                  CLARVO AI Student Advisor
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Live Simulation
              </span>
            </div>

            {/* Conversation Area with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: shouldReduceMotion ? 0.05 : 0.25, ease: 'easeOut' }}
                className="p-5 sm:p-6 space-y-4"
              >
                {/* Student Query */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-[#38BDF8] text-[11px] flex items-center justify-center shrink-0 font-bold border border-slate-700">
                    ST
                  </div>
                  <div className="bg-slate-800/90 rounded-[14px] px-4 py-3 max-w-[340px] text-[#F1F5F9] text-[13px] leading-relaxed">
                    {activeScenario.studentMsg}
                  </div>
                </div>

                {/* AI Guidance */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-white font-black text-[11px] shadow-md">
                    CL
                  </div>
                  <div className="bg-[#1E293B] rounded-[14px] p-4 sm:p-5 max-w-[360px] border border-slate-700/80">
                    <div className="text-[#94A3B8] text-[12px] mb-2.5 font-medium">
                      Based on psychometric profiling &amp; top admissions data:
                    </div>
                    <div className="border-l-2 border-[#38BDF8] pl-3 space-y-2 text-[#E2E8F0] text-[12px] leading-relaxed">
                      <div>
                        <strong className="text-white block font-bold">Recommended Pathway:</strong>{' '}
                        {activeScenario.stream}
                      </div>
                      <div>
                        <strong className="text-white block font-bold">Strategic Spike:</strong>{' '}
                        {activeScenario.spike}
                      </div>
                      <div>
                        <strong className="text-white block font-bold">Standardized Target:</strong>{' '}
                        {activeScenario.target}
                      </div>
                      <div className="text-[11px] text-[#38BDF8] font-semibold pt-1">
                        {activeScenario.tip}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Input simulator */}
            <div className="border-t border-slate-800 p-3 sm:p-4 flex gap-2 sm:gap-3 bg-[#0F172A]">
              <input
                type="text"
                placeholder="Ask about stream choice, SAT, research..."
                className="flex-1 h-[44px] rounded-[10px] bg-slate-900 border border-slate-700 px-3 text-[13px] text-white outline-none placeholder:text-slate-500 min-w-0"
                readOnly
                aria-label="CLARVO AI Advisor prompt input"
              />
              <Link
                href="/auth?tab=register"
                className="h-[44px] px-4 rounded-[10px] bg-[#2563EB] text-white text-[13px] font-bold hover:bg-[#1D4ED8] transition-all shrink-0 flex items-center justify-center"
              >
                Ask
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
