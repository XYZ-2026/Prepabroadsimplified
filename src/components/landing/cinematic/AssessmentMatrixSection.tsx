'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Brain, 
  Compass, 
  Zap, 
  UserCheck, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileText, 
  Download, 
  Check, 
  ChevronRight, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface ModuleItem {
  num: string;
  name: string;
  tag: string;
  desc: string;
}

interface PhaseDetail {
  id: string;
  phaseNum: string;
  title: string;
  subtitle: string;
  moduleRange: string;
  badgeColor: string;
  iconBg: string;
  iconBorder: string;
  description: string;
  focusAreas: string[];
  modules: ModuleItem[];
}

const PHASES: PhaseDetail[] = [
  {
    id: 'phase1',
    phaseNum: 'P1',
    title: 'Phase I: Personality',
    subtitle: 'Personality Architecture & Behavioral Drivers',
    moduleRange: 'Modules 01–10',
    badgeColor: '#2563EB',
    iconBg: 'bg-blue-600',
    iconBorder: 'border-blue-500',
    description:
      'Evaluates Big Five dimensions (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability) & behavioral drivers.',
    focusAreas: ['Big Five Dimensions', 'Cognitive Openness', 'Grit & Conscientiousness', 'MBTI Cognitive Stack'],
    modules: [
      { num: '01', name: 'Openness & Abstract Curiosity', tag: 'Big Five', desc: 'Receptivity to novel paradigms, abstract reasoning, and creative exploration.' },
      { num: '02', name: 'Conscientiousness, Grit & Execution', tag: 'Persistence', desc: 'Systematic discipline, goal tenacity, and high-stakes follow-through.' },
      { num: '03', name: 'Extraversion, Energy & Sociability', tag: 'Social', desc: 'Interpersonal battery, collaborative stimulation, and group leadership energy.' },
      { num: '04', name: 'Agreeableness & Empathy', tag: 'EQ', desc: 'Trust dynamics, collaborative synergy, and conflict navigation.' },
      { num: '05', name: 'Emotional Stability & Stress Tolerance', tag: 'Resilience', desc: 'Stress endurance, academic composure, and emotional equilibrium under testing.' },
      { num: '06', name: 'Cognitive Sensing (Si vs Se)', tag: 'MBTI', desc: 'Concrete observation vs experiential real-world processing.' },
      { num: '07', name: 'Cognitive Intuition (Ni vs Ne)', tag: 'MBTI', desc: 'Strategic synthesis vs lateral possibility generation.' },
      { num: '08', name: 'Cognitive Decision (Thinking vs Feeling)', tag: 'Logic', desc: 'Objective criteria evaluation vs values-driven human impact.' },
      { num: '09', name: 'Internal vs External Locus of Control', tag: 'Agency', desc: 'Belief in personal mastery versus fatalistic environmental attribution.' },
      { num: '10', name: 'Risk Tolerance & Ambiguity Navigation', tag: 'Mindset', desc: 'Confidence when confronting uncertain problem landscapes.' },
    ],
  },
  {
    id: 'phase2',
    phaseNum: 'P2',
    title: 'Phase II: Cognitive',
    subtitle: 'Cognitive Processing & Problem Solving',
    moduleRange: 'Modules 11–20',
    badgeColor: '#4F46E5',
    iconBg: 'bg-indigo-600',
    iconBorder: 'border-indigo-500',
    description:
      'Measures Fluid Logic (Gf), Quantitative Reasoning, Verbal Comprehension, Spatial Visualization, and Working Memory.',
    focusAreas: ['Fluid Intelligence (Gf)', 'Quantitative Aptitude', 'Spatial Logic', 'Metacognition'],
    modules: [
      { num: '11', name: 'Fluid Intelligence & Pattern Induction', tag: 'Fluid Logic', desc: 'Solving novel matrix puzzles independent of prior schooling.' },
      { num: '12', name: 'Crystallized Academic Reasoning', tag: 'Knowledge', desc: 'Synthesizing acquired scholastic frameworks to resolve complex tasks.' },
      { num: '13', name: 'Spatial-Visual Rotation & Geometry', tag: 'Spatial', desc: 'Mental three-dimensional manipulation required for engineering and design.' },
      { num: '14', name: 'Logical-Mathematical Computation', tag: 'Quantitative', desc: 'Algorithmic reasoning, numerical patterns, and data interpretation.' },
      { num: '15', name: 'Linguistic-Verbal Comprehension', tag: 'Verbal', desc: 'Semantic density analysis, rhetoric evaluation, and high-level reading.' },
      { num: '16', name: 'Systemic & Systems-Level Thinking', tag: 'Systems', desc: 'Understanding feedback loops, interconnections, and multi-variable impact.' },
      { num: '17', name: 'Creative Synthesis & Lateral Ideation', tag: 'Lateral', desc: 'Novel cross-domain connections and non-linear solution design.' },
      { num: '18', name: 'Critical Thinking & Cognitive Bias Audit', tag: 'Critical', desc: 'Evaluating evidential validity and filtering out deceptive heuristics.' },
      { num: '19', name: 'Working Memory & Processing Speed', tag: 'Speed', desc: 'Rapid information retention under strict timed constraints.' },
      { num: '20', name: 'Metacognition & Self-Auditing', tag: 'Executive', desc: 'The ability to monitor, calibrate, and adjust one’s own thought process.' },
    ],
  },
  {
    id: 'phase3',
    phaseNum: 'P3',
    title: 'Phase III: Execution',
    subtitle: 'Learning Modalities & Academic Execution',
    moduleRange: 'Modules 21–28',
    badgeColor: '#0E7490',
    iconBg: 'bg-cyan-700',
    iconBorder: 'border-cyan-600',
    description:
      'Identifies VARK sensory study modalities, Grit, Time Blocking, Exam Arousal Optimization, and Spatial Kinematics.',
    focusAreas: ['VARK Sensory Channels', 'Deep Work Endurance', 'Exam Arousal Curve', 'Study Time-Blocking'],
    modules: [
      { num: '21', name: 'VARK Visual & Diagrammatic Absorption', tag: 'VARK', desc: 'Retention through schematic graphs, color coding, and visual mind maps.' },
      { num: '22', name: 'VARK Auditory & Discussion Encoding', tag: 'VARK', desc: 'Comprehension via active discourse, lectures, and verbal elaboration.' },
      { num: '23', name: 'VARK Read/Write Textual Processing', tag: 'VARK', desc: 'Deep internalization through structured outlines and comprehensive reading.' },
      { num: '24', name: 'VARK Kinesthetic Experiential Modeling', tag: 'VARK', desc: 'Mastery through physical experiments, lab simulations, and tactile tasks.' },
      { num: '25', name: 'Academic Persistence & Friction Tolerance', tag: 'Habits', desc: 'Overcoming scholastic setbacks without cognitive burnout.' },
      { num: '26', name: 'Growth Mindset vs Fixed Performance', tag: 'Mindset', desc: 'Perception of effort as the primary vector for cognitive expansion.' },
      { num: '27', name: 'High-Stakes Exam Arousal Management', tag: 'Exam Strategy', desc: 'Calibrating test anxiety into optimal Yerkes-Dodson focus.' },
      { num: '28', name: 'Peer Collaboration & Synergistic Learning', tag: 'Teamwork', desc: 'Cooperative knowledge construction in high-performing academic cohorts.' },
    ],
  },
  {
    id: 'phase4',
    phaseNum: 'P4',
    title: 'Phase IV: Alignment',
    subtitle: 'Stream Selection & Master Career Alignment',
    moduleRange: 'Modules 29–30',
    badgeColor: '#0F172A',
    iconBg: 'bg-slate-800',
    iconBorder: 'border-slate-700',
    description:
      'Holland RIASEC Interest Mapping & Master Stream Integration across PCM, PCB, Commerce, and Humanities pathways.',
    focusAreas: ['Holland RIASEC Codes', 'Stream Validation', 'Degree Pathway Fit', 'Family Expectation Cohesion'],
    modules: [
      { num: '29', name: 'Holland RIASEC Vocational Mapping', tag: 'RIASEC', desc: 'Comprehensive scoring across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional vectors.' },
      { num: '30', name: 'Master Stream Integration (PCM/PCB/Comm/Hum)', tag: 'Stream Fit', desc: 'Synthesizing all 30 cognitive and behavioral traits to lock in the optimal Class 11-12 stream choice.' },
    ],
  },
];

export default function AssessmentMatrixSection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('phase1');
  const [downloading, setDownloading] = useState(false);

  const activePhase = PHASES.find((p) => p.id === selectedPhaseId) || PHASES[0];

  const handleDownloadSamplePDF = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/psychometric-test/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isSample: true,
          reportType: 'executive',
          assessmentType: 'grade10',
          variant: 'grade10',
          student: {
            name: 'Aarav Sharma (Sample)',
            grade: 'Class 10',
            school: 'Delhi Public School, R.K. Puram',
            city: 'New Delhi',
            date: 'October 11, 2026',
            reportId: 'SAMPLE-10-DEMO',
          },
        }),
      });

      if (!res.ok) throw new Error('PDF generation error');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sample_Class10_Executive_Career_Summary.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch {
      window.location.href = '/sample-report?type=grade10';
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      id="assessments"
      className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-[#F1F5F9] via-[#FFFFFF] to-[#F8FAFC] border-b border-[#E4E7EC]"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.18em] uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            SCIENTIFIC DIAGNOSTIC FRAMEWORK
          </div>

          <h2 className="text-[28px] xs:text-[34px] sm:text-[44px] md:text-[52px] font-black tracking-[-0.04em] text-[#080F1C] uppercase leading-[1.08]">
            About This Psychometric <br className="hidden sm:block" />
            <span className="text-[#2563EB]">Assessment Matrix</span>
          </h2>

          <p className="mt-3 text-[13px] sm:text-[15px] font-bold text-[#667085] tracking-wide uppercase">
            Architectural Diagnostic Matrix &amp; Multi-Phase Evaluation Framework
          </p>

          <p className="mt-5 text-[14px] sm:text-[16px] text-[#344054] leading-relaxed max-w-2xl mx-auto font-normal">
            The Class 10 Executive Psychometric Assessment is an advanced multi-layered diagnostic system specifically designed for secondary school students. Rather than relying on simple quiz questions, our framework measures candidate traits across 4 core diagnostic assessment phases comprising 30 comprehensive modules:
          </p>
        </motion.div>

        {/* ── 4 Diagnostic Phase Cards Grid (Always Visible & Accessible) ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10"
        >
          {PHASES.map((phase) => {
            const isSelected = selectedPhaseId === phase.id;
            return (
              <motion.div
                key={phase.id}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: shouldReduceMotion ? 0.05 : 0.5, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`relative bg-white rounded-[20px] p-5 sm:p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-[#F8FAFF]'
                    : 'border-[#E4E7EC] hover:border-[#CBD5E1]'
                }`}
              >
                <div>
                  {/* Top Badge & Identifier */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${phase.iconBg} text-white font-black text-sm flex items-center justify-center shadow-md`}
                    >
                      {phase.id === 'phase1' && <span className="text-[#FBBF24]">👨‍🚀</span>}
                      {phase.id === 'phase2' && <span className="text-[#FBBF24]">🧠</span>}
                      {phase.id === 'phase3' && <span className="text-[#FBBF24]">⚡</span>}
                      {phase.id === 'phase4' && <span className="text-[#FBBF24]">🧭</span>}
                      <span className="ml-1 text-xs">{phase.phaseNum}</span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-[#F1F5F9] text-[#667085] border-[#E4E7EC]'
                      }`}
                    >
                      {phase.moduleRange}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-[17px] sm:text-[18px] font-extrabold text-[#080F1C] tracking-tight">
                    {phase.title}
                  </h3>
                  <div className="text-[11px] font-bold text-[#2563EB] mt-0.5 mb-2.5">
                    {phase.subtitle}
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#475569] leading-relaxed line-clamp-3">
                    {phase.description}
                  </p>
                </div>

                {/* Inspect Action */}
                <div className="mt-5 pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] font-bold">
                  <span className={isSelected ? 'text-[#2563EB]' : 'text-[#667085]'}>
                    {isSelected ? 'Currently Viewing' : 'Click to Inspect'}
                  </span>
                  <span
                    className={`transition-transform duration-200 ${
                      isSelected ? 'text-[#2563EB] translate-x-1' : 'text-[#94A3B8]'
                    }`}
                  >
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Interactive Deep Dive Panel (Connected Module Breakdown) ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="bg-white rounded-[24px] border border-[#CBD5E1] p-6 sm:p-8 lg:p-10 shadow-lg mb-10 overflow-hidden relative"
        >
          {/* Subtle decorative background watermarks */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/4 rounded-full blur-[90px] pointer-events-none" />

          {/* Deep-Dive Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E7EC] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                <span>STAGE ARCHITECTURE DEEP DIVE</span>
                <span>·</span>
                <span>{activePhase.moduleRange}</span>
              </div>
              <h3 className="text-[22px] sm:text-[28px] font-black text-[#080F1C] tracking-tight flex items-center gap-3">
                <span>{activePhase.title}</span>
                <span className="text-[12px] font-bold bg-[#E8F0FF] text-[#2563EB] px-3 py-1 rounded-full font-mono">
                  {activePhase.modules.length} Modules
                </span>
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#667085] mt-1 max-w-2xl">
                {activePhase.description}
              </p>
            </div>

            {/* Quick Phase Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl self-start md:self-auto border border-[#E4E7EC]">
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhaseId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedPhaseId === p.id
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-[#667085] hover:text-[#080F1C]'
                  }`}
                >
                  {p.phaseNum}
                </button>
              ))}
            </div>
          </div>

          {/* Module Cards Grid with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase.id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: shouldReduceMotion ? 0 : 0.04 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
            >
              {activePhase.modules.map((mod) => (
                <motion.div
                  key={mod.num}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: shouldReduceMotion ? 0.05 : 0.35, ease: 'easeOut' },
                    },
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.15 } }}
                  className="p-4 rounded-[14px] bg-[#F8FAFC] border border-[#E4E7EC] hover:border-[#2563EB]/40 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-extrabold text-[#2563EB] bg-[#E8F0FF] px-2 py-0.5 rounded">
                        Module {mod.num}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] bg-white border border-[#E4E7EC] px-2 py-0.5 rounded">
                        {mod.tag}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-bold text-[#080F1C] leading-snug mt-2">
                      {mod.name}
                    </h4>
                    <p className="text-[12px] text-[#475569] mt-1.5 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#E4E7EC]/60 flex items-center gap-1 text-[10px] font-semibold text-[#16A34A]">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Scientifically Standardized Diagnostic
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Strategic Value for Class 10 Candidates (Obsidian Navy #0B1528) ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="bg-[#0B1528] text-white rounded-[24px] p-6 sm:p-8 lg:p-10 border border-blue-400/25 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Corner Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Strategic Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-[#FBBF24] flex items-center justify-center font-bold text-lg shadow-sm">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[18px] sm:text-[22px] font-black uppercase tracking-wider text-[#FBBF24]">
                  Strategic Value for Class 10 Candidates
                </h3>
                <p className="text-[12px] text-slate-300">
                  Critical inflection milestones engineered to prevent academic misalignment
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-[#38BDF8]">
              <span>Matrix Engine:</span>
              <strong className="text-white">CLARVO v5.0</strong>
            </div>
          </div>

          {/* 3 Strategic Pillars Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* 1. Stream Selection Security */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              className="space-y-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800"
            >
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#38BDF8] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" /> Pillar 01
              </div>
              <h4 className="text-[16px] font-bold text-white tracking-tight">
                1. Stream Selection Security
              </h4>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Prevents costly stream switches in Class 11 by aligning subject choices with natural cognitive aptitude and proven academic perseverance.
              </p>
            </motion.div>

            {/* 2. Entrance Exam Readiness */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              className="space-y-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800"
            >
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#FBBF24] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FBBF24]" /> Pillar 02
              </div>
              <h4 className="text-[16px] font-bold text-white tracking-tight">
                2. Entrance Exam Readiness
              </h4>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Identifies early readiness for competitive exams such as JEE, NEET, CLAT, IPMAT, SAT, and NIDA based on fluid logic and computational endurance.
              </p>
            </motion.div>

            {/* 3. Personalized Study Hacks */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              className="space-y-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800"
            >
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#10B981] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#10B981]" /> Pillar 03
              </div>
              <h4 className="text-[16px] font-bold text-white tracking-tight">
                3. Personalized Study Hacks
              </h4>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Provides tailored VARK study techniques and stress management protocols for board exam optimization and prolonged test focus.
              </p>
            </motion.div>
          </motion.div>

          {/* Dossier Footer Action Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[12px] text-slate-400">
              <span className="font-semibold text-white">Diagnostic Engine:</span> CLARVO Class 10 Matrix v5.0 · <span className="text-slate-300">Confidential Report for Aarav Sharma (Sample)</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href="/sample-report?type=grade10"
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Inspect Full 56-Page Report</span>
              </Link>

              <button
                onClick={handleDownloadSamplePDF}
                disabled={downloading}
                className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>{downloading ? 'Preparing PDF...' : 'Download Sample PDF'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
