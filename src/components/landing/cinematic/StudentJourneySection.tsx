'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Award, 
  GraduationCap, 
  Users, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface JourneyStage {
  num: string;
  gradeBadge: string;
  title: string;
  subtitle: string;
  headline: string;
  fullDesc: string;
  studentFocus: string;
  parentReassurance: string;
  keyDeliverables: string[];
  metricLabel: string;
  metricValue: string;
  link: string;
  actionText: string;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    num: '01',
    gradeBadge: 'Grades 7–8',
    title: 'Aptitude & Self-Discovery',
    subtitle: 'Foundational Aptitude & Cognitive Mapping',
    headline: 'Uncovering Natural Cognitive Talents Before Academic Pressure Sets In',
    fullDesc: 'Middle school is the ideal window to assess cognitive processing speed, working memory, spatial reasoning, and early vocational curiosities without high-stakes pressure.',
    studentFocus: 'Discover what you naturally excel at through game-like cognitive modules without test anxiety.',
    parentReassurance: 'Gain early, objective baseline data to guide extracurriculars and skill-building years before board exams.',
    keyDeliverables: [
      '30-Factor Cognitive & Diagnostic Evaluation',
      'VARK Learning Modalities Assessment',
      'Curiosity & RIASEC Vocational Archetype Mapping',
      'Cognitive Strength vs Development Areas Analysis'
    ],
    metricLabel: 'Early Aptitude Clarity',
    metricValue: '96.2%',
    link: '/psychometric-test',
    actionText: 'Take Diagnostic Assessment',
  },
  {
    num: '02',
    gradeBadge: 'Class 9–10',
    title: 'Stream & Subject Fit',
    subtitle: 'Evidence-Backed Class 11 Stream Choice',
    headline: 'Eliminating Costly Class 11 Stream Switches Before Registration Deadlines',
    fullDesc: 'Stream choice in Class 10 sets the trajectory for university eligibility. We analyze your aptitude, numerical stamina, and behavioral grit across PCM, PCB, Commerce, and Humanities.',
    studentFocus: 'Choose your subject combination with complete conviction instead of copying peer groups or coaching trends.',
    parentReassurance: 'Eliminates family friction with empirical data showing the highest probability of student academic success.',
    keyDeliverables: [
      'Stream Fitment Index across PCM, PCB, Commerce & Arts',
      'Parent-Student Aspirations & Consensus Report',
      'Board-Specific Subject Combinations (CBSE, ICSE, IB, Cambridge)',
      '1-on-1 Certified Counselor Strategy Debrief'
    ],
    metricLabel: 'Zero Stream Regret',
    metricValue: '99.1%',
    link: '/discover',
    actionText: 'Explore Stream Selection',
  },
  {
    num: '03',
    gradeBadge: 'Class 11',
    title: 'Academic Mastery & SAT',
    subtitle: 'Digital SAT 1500+ & 1-on-1 Tutoring',
    headline: 'Synchronizing Board Excellence with Elite Standardized Test Mastery',
    fullDesc: 'Class 11 demands balancing heavy board syllabi with entrance exam readiness. We provide adaptive Digital SAT coaching and bespoke 1-to-1 tutoring for IB, Cambridge, and CBSE.',
    studentFocus: 'Master high-yield concepts, Desmos shortcuts, and adaptive pacing to break through score plateaus.',
    parentReassurance: 'Targeted private tutoring ensures board grades stay top-tier while opening up merit scholarship opportunities.',
    keyDeliverables: [
      'Digital SAT Adaptive Question Bank & Diagnostic Drills',
      '1-to-1 Mentorship for IB (HL/SL), Cambridge A-Levels & CBSE',
      'Pacing & Question-Type Time Loss Audits',
      'Merit Scholarship Score Target Roadmap'
    ],
    metricLabel: 'Target Score Potential',
    metricValue: '1500+',
    link: '/iq-test',
    actionText: 'Explore SAT & Tutoring',
  },
  {
    num: '04',
    gradeBadge: 'Class 11–12',
    title: 'Research & Profile Spikes',
    subtitle: 'Original Research Papers & Leadership',
    headline: 'Building an Unmistakable Intellectual Spike Beyond Standard Grades',
    fullDesc: 'Top tier universities admit individuals with demonstrated intellectual initiative. We pair students with university faculty mentors to produce and publish original peer-reviewed research.',
    studentFocus: 'Author and publish an original paper in your field of passion, turning curiosity into recognized scholarship.',
    parentReassurance: 'Transforms your child’s application from a standard report card into an elite, differentiated portfolio.',
    keyDeliverables: [
      '1-on-1 Mentorship with University Faculty & Scholars',
      'Peer-Reviewed High School Journal Submission',
      'Community Impact & Social Innovation Micro-Internships',
      'Intellectual Spike & Evidence Dossier'
    ],
    metricLabel: 'Admissions Differentiation',
    metricValue: 'Top 2%',
    link: '/discover',
    actionText: 'View Research Tracks',
  },
  {
    num: '05',
    gradeBadge: 'Class 12',
    title: 'University & Career Launch',
    subtitle: 'Strategic Admissions & Career Pathways',
    headline: 'Strategic University Shortlisting, Scholarships & Career Trajectory',
    fullDesc: 'Translate high school accomplishments into successful university applications. We optimize college shortlists, admissions essays, scholarship submissions, and multi-year career roadmaps.',
    studentFocus: 'Target dream global colleges and top domestic universities with confidence in your fit and odds.',
    parentReassurance: 'Transparent ROI planning, scholarship maximization, and direct strategic guidance through every deadline.',
    keyDeliverables: [
      'Data-Driven College Shortlisting (Reach, Match, Safety)',
      'Common App, UCAS & Domestic Application Review',
      'Merit Scholarship & Financial Strategy Optimization',
      'Post-Graduation Career & Industry Alignment'
    ],
    metricLabel: 'Admissions Success Rate',
    metricValue: '97.4%',
    link: '/university-finder',
    actionText: 'Explore University Matcher',
  },
];

export default function StudentJourneySection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage = JOURNEY_STAGES[activeStageIdx];

  return (
    <section id="journey" className="scroll-mt-20 sm:scroll-mt-24 bg-[#FAFBFD] px-4 sm:px-6 md:px-10 py-16 sm:py-24 border-b border-[#E4E7EC] relative overflow-hidden">
      {/* Subtle Ambient Decorative Circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
            THE 5-STAGE DEVELOPMENT CONTINUUM
          </div>

          <h2 className="text-[28px] sm:text-[38px] md:text-[46px] font-black tracking-[-0.04em] text-[#080F1C] leading-tight">
            From Self-Discovery to Premier Global Admissions
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            A coherent multi-year framework designed to guide secondary school students and their parents through every critical academic turning point without guesswork.
          </p>
        </motion.div>

        {/* ── 5 Stage Interactive Pipeline Controls ── */}
        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto relative">
          {/* Background Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-7 left-[10%] w-[80%] h-[2px] bg-[#E2E8F0] z-0 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left h-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#2563EB]"
            />
          </div>

          {/* Interactive Steps Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {JOURNEY_STAGES.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              return (
                <button
                  key={stage.num}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  className={`flex flex-col items-center p-3.5 sm:p-4 rounded-2xl transition-all duration-200 text-center cursor-pointer group focus:outline-none ${
                    isActive
                      ? 'bg-white shadow-[0_8px_25px_rgba(8,15,28,0.08)] border-2 border-[#2563EB] -translate-y-1'
                      : 'bg-white/70 hover:bg-white border border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  {/* Number Badge */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-[15px] font-black transition-all duration-300 ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-[0_6px_16px_rgba(37,99,235,0.35)] scale-105'
                        : 'bg-[#F1F5F9] text-[#475569] group-hover:bg-[#E8F0FF] group-hover:text-[#2563EB]'
                    }`}
                  >
                    {stage.num}
                  </div>

                  {/* Grade Badge */}
                  <span className={`mt-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-[#E8F0FF] text-[#2563EB]' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {stage.gradeBadge}
                  </span>

                  {/* Stage Title */}
                  <h3
                    className={`mt-2 text-[13px] sm:text-[14px] font-bold leading-snug transition-colors line-clamp-2 ${
                      isActive ? 'text-[#080F1C]' : 'text-[#64748B] group-hover:text-[#080F1C]'
                    }`}
                  >
                    {stage.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Stage Deep-Dive Spotlight Card ── */}
        <div className="mt-8 sm:mt-12 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.num}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
              transition={{ duration: shouldReduceMotion ? 0.05 : 0.3, ease: 'easeOut' }}
              className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_12px_36px_rgba(8,15,28,0.06)] overflow-hidden"
            >
              {/* Card Banner Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-black text-[#2563EB] bg-[#E8F0FF] px-2.5 py-1 rounded-md">
                    STAGE {activeStage.num}
                  </span>
                  <span className="text-[12px] font-bold text-slate-500">·</span>
                  <span className="text-[13px] font-extrabold text-[#080F1C] tracking-wide">
                    {activeStage.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">{activeStage.metricLabel}:</span>
                  <span className="text-[13px] font-mono font-black text-[#2563EB] bg-[#E8F0FF] px-2.5 py-0.5 rounded-md">
                    {activeStage.metricValue}
                  </span>
                </div>
              </div>

              {/* Card Body: 2 Columns */}
              <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column (7 Cols): Headline, Description & Deliverables */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                      Strategic Objective ({activeStage.gradeBadge})
                    </span>
                    <h3 className="text-[20px] sm:text-[24px] font-black text-[#080F1C] tracking-tight leading-snug mt-1">
                      {activeStage.headline}
                    </h3>
                    <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                      {activeStage.fullDesc}
                    </p>
                  </div>

                  {/* Key Deliverables */}
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#080F1C] mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      Core Milestones &amp; Verified Outcomes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeStage.keyDeliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-[12.5px] text-[#334155] font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (5 Cols): Dual-Perspective Card & CTA */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  {/* Dual-Perspective Clarity Box */}
                  <div className="space-y-3 bg-[#FAFBFD] p-5 rounded-2xl border border-[#E2E8F0]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                      Dual-Perspective Alignment
                    </div>

                    {/* Student Perspective */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB]">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>For the Student</span>
                      </div>
                      <p className="text-[12.5px] text-[#475569] leading-relaxed">
                        {activeStage.studentFocus}
                      </p>
                    </div>

                    {/* Parent Perspective */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D97706]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>For the Parent</span>
                      </div>
                      <p className="text-[12.5px] text-[#475569] leading-relaxed">
                        {activeStage.parentReassurance}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Link */}
                  <div className="pt-2">
                    <Link
                      href={activeStage.link}
                      className="w-full h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] cursor-pointer group"
                    >
                      <span>{activeStage.actionText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <p className="text-center text-[11px] text-slate-500 mt-2">
                      Backed by CLARVO Diagnostic Engine v5.0 · No prior prep required
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
