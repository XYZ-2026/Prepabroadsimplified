'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  Sparkles, 
  Award, 
  Compass, 
  BarChart3, 
  Target, 
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import { BOOK_A_DEMO_URL } from '@/config/demo';

interface DossierPage {
  id: string;
  pageNum: string;
  title: string;
  shortLabel: string;
  tagline: string;
}

const DOSSIER_PAGES: DossierPage[] = [
  {
    id: 'cognitive',
    pageNum: '01',
    title: 'Cognitive Agility & Aptitude Index',
    shortLabel: 'Cognitive Aptitude',
    tagline: 'Standardized psychological measurement of reasoning speed, working memory, and fluid logic.',
  },
  {
    id: 'stream',
    pageNum: '02',
    title: 'Class 10 Stream Recommendation Matrix',
    shortLabel: 'Stream Recommendation',
    tagline: 'Mathematical compatibility analysis for PCM, PCB, Commerce, and Humanities.',
  },
  {
    id: 'riasec',
    pageNum: '03',
    title: 'RIASEC Vocational & Career Clustering',
    shortLabel: 'Vocational Interests',
    tagline: 'Empirical mapping of student psychological drivers to 100+ global profession clusters.',
  },
  {
    id: 'roadmap',
    pageNum: '04',
    title: '4-Year Academic & Extracurricular Action Plan',
    shortLabel: '4-Year Action Plan',
    tagline: 'Structured milestone roadmap from Class 10 board exams to premier university admissions.',
  },
];

export default function InteractiveReportDossier() {
  const shouldReduceMotion = useReducedMotion();
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const activePage = DOSSIER_PAGES[activePageIdx];

  const handleDownloadSamplePDF = async () => {
    try {
      setDownloading(true);
      const res = await fetch('/api/reports/sample-pdf', {
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
            school: 'The Shri Ram School, Moulsari',
            city: 'Gurugram',
            date: 'Academic Year 2026',
            reportId: 'CLARVO-X10-SAMPLE',
          },
        }),
      });

      if (!res.ok) throw new Error('PDF generation error');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CLARVO_Sample_Class10_Executive_Report.pdf';
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
    <section id="sample-dossier" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 px-4 sm:px-6 md:px-10 bg-[#FAFBFD] border-b border-[#E4E7EC] relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D97706]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            THE EVIDENCE ENGINE
          </div>

          <h2 className="text-[28px] sm:text-[38px] md:text-[46px] font-black tracking-[-0.04em] text-[#080F1C] leading-tight">
            Interactive Report Dossier Flipbook
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-[#475569] leading-relaxed">
            See exactly what families receive. Browse interactive excerpts from our confidential 56-page diagnostic dossier before booking a consultation.
          </p>
        </motion.div>

        {/* ── Main Dossier Presentation Container ── */}
        <div className="max-w-5xl mx-auto bg-white rounded-[26px] border border-[#CBD5E1] shadow-[0_20px_50px_rgba(8,15,28,0.08)] overflow-hidden">
          
          {/* Dossier Meta Bar */}
          <div className="bg-[#080F1C] text-white px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-[12px] border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[#38BDF8] font-mono font-bold">
                <FileText className="w-3.5 h-3.5" />
                CLARVO-DOSSIER-v5.0
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="text-slate-300 hidden sm:inline">
                Candidate: <strong className="text-white">Aarav Sharma</strong> (Class 10 · The Shri Ram School)
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Verified Diagnostic Dossier
              </span>
            </div>
          </div>

          {/* Dossier Tab Controls (4 Pages) */}
          <div className="border-b border-[#E4E7EC] bg-[#F8FAFC] px-4 sm:px-8 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2.5">
            {DOSSIER_PAGES.map((page, idx) => {
              const isActive = activePageIdx === idx;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePageIdx(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                      : 'bg-white text-[#475569] hover:bg-[#E8F0FF] hover:text-[#2563EB] border border-[#E2E8F0]'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    P{page.pageNum}
                  </span>
                  <span>{page.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active Page Viewport with AnimatePresence */}
          <div className="p-6 sm:p-8 lg:p-10 min-h-[440px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activePageIdx === 0 && (
                <motion.div
                  key="page-0"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -15 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#E4E7EC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                        Page 01 · Comprehensive Psychometrics
                      </span>
                      <h3 className="text-[20px] sm:text-[24px] font-black text-[#080F1C]">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#E8F0FF] px-3.5 py-2 rounded-xl border border-[#2563EB]/20 shrink-0 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-[#2563EB]">Overall Aptitude Index</div>
                        <div className="text-[18px] font-black text-[#080F1C] font-mono leading-none mt-0.5">128 / 140</div>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#16A34A] bg-emerald-100 px-2 py-0.5 rounded-md">
                        96th %ile
                      </span>
                    </div>
                  </div>

                  {/* 4 Cognitive Sub-Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Metric 1 */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                      <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                        <span className="text-[#080F1C]">Spatial-Visual Manipulation (3D)</span>
                        <span className="text-[#2563EB] font-mono font-black">96th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '96%' }} />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
                        Top 4% nationally. Demonstrates exceptional facility for complex 3D rotations required in mechanical/aerospace engineering, robotics, and architectural systems.
                      </p>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                      <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                        <span className="text-[#080F1C]">Fluid Logic &amp; Pattern Induction (Gf)</span>
                        <span className="text-[#2563EB] font-mono font-black">94th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
                        High novel puzzle solving efficiency independent of prior schooling. Strongly correlates with rapid computer science syntax mastery and competitive logic.
                      </p>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                      <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                        <span className="text-[#080F1C]">Quantitative Numerical Stamina</span>
                        <span className="text-[#2563EB] font-mono font-black">92nd %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
                        Strong algorithmic stamina under prolonged timed tests. Retains high numerical accuracy during multi-step algebraic problems.
                      </p>
                    </div>

                    {/* Metric 4 */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                      <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                        <span className="text-[#080F1C]">Linguistic Synthesis &amp; Verbal Reading</span>
                        <span className="text-[#2563EB] font-mono font-black">86th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '86%' }} />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
                        Solid reading comprehension and vocabulary inference. Ample verbal foundation for SAT Reading &amp; Writing with targeted pacing drills.
                      </p>
                    </div>
                  </div>

                  {/* Counselor Assessment Summary */}
                  <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#CBD5E1] text-[12.5px] text-[#334155] leading-relaxed flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#080F1C]">Senior Psychometrician Evaluation:</strong> Aarav demonstrates an analytical profile with dominant Spatial (96%) and Fluid Logic (94%) vectors. This cognitive combination strongly favors advanced computational disciplines, software engineering, and applied physics over pure memorization fields.
                    </div>
                  </div>
                </motion.div>
              )}

              {activePageIdx === 1 && (
                <motion.div
                  key="page-1"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -15 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#E4E7EC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                        Page 02 · Stream Selection Security
                      </span>
                      <h3 className="text-[20px] sm:text-[24px] font-black text-[#080F1C]">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">{activePage.tagline}</p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-3 py-1.5 rounded-xl border border-[#86EFAC]/40 shrink-0 self-start sm:self-auto">
                      <CheckCircle2 className="w-4 h-4" /> Recommended: Science PCM + CS
                    </span>
                  </div>

                  {/* 4 Streams Comparison Table */}
                  <div className="space-y-3">
                    {/* Stream 1 */}
                    <div className="p-4 rounded-xl bg-[#E8F0FF]/60 border-2 border-[#2563EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase text-[#2563EB] bg-white px-2 py-0.5 rounded shadow-2xs">
                            Rank 1 · Primary Match
                          </span>
                          <span className="text-sm font-extrabold text-[#080F1C]">
                            Science PCM with Computer Science / AI
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                          Ideal fit. Perfectly leverages Aarav’s 96th percentile spatial logic and high quantitative stamina. Very low risk of academic burnout.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[22px] font-black text-[#2563EB] font-mono">98.4%</div>
                        <div className="text-[10px] font-bold uppercase text-slate-500">Fitment Index</div>
                      </div>
                    </div>

                    {/* Stream 2 */}
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Rank 2 · Viable Alternative
                          </span>
                          <span className="text-sm font-bold text-[#080F1C]">
                            Commerce with Applied Mathematics &amp; Economics
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">
                          Solid secondary pathway for Quantitative Economics or FinTech, but under-utilizes spatial engineering strengths.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[18px] font-black text-slate-700 font-mono">84.2%</div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Fitment Index</div>
                      </div>
                    </div>

                    {/* Stream 3 */}
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-75">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Rank 3 · High Friction
                          </span>
                          <span className="text-sm font-bold text-[#080F1C]">
                            Science PCB (Medical / Biology)
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">
                          High cognitive friction. Biology demands dense rote memorization, conflicting with candidate’s preference for first-principles deduction.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[18px] font-black text-slate-500 font-mono">61.8%</div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Fitment Index</div>
                      </div>
                    </div>
                  </div>

                  {/* Dinner-Table Consensus Callout */}
                  <div className="p-4 rounded-xl bg-[#FEF3C7]/40 border border-[#FCD34D] text-[12.5px] text-[#92400E] flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#D97706] shrink-0" />
                    <span><strong>Family Consensus Takeaway:</strong> Eliminates parental worry of stream regret. Clear objective consensus achieved for ICSE/CBSE Class 11 subject registration.</span>
                  </div>
                </motion.div>
              )}

              {activePageIdx === 2 && (
                <motion.div
                  key="page-2"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -15 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#E4E7EC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                        Page 03 · RIASEC Career Fitment
                      </span>
                      <h3 className="text-[20px] sm:text-[24px] font-black text-[#080F1C]">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#080F1C] bg-[#F1F5F9] px-3 py-1.5 rounded-xl border border-slate-200">
                      Code: <strong className="text-[#2563EB]">IRE (Investigative · Realistic · Enterprising)</strong>
                    </div>
                  </div>

                  {/* 3 Career Matches */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2563EB]">
                        <span>Match 01</span>
                        <span className="font-mono bg-[#E8F0FF] px-2 py-0.5 rounded">98% Fit</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#080F1C]">Artificial Intelligence &amp; Robotics</h4>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Design autonomous systems, neural networks, and algorithmic hardware. High demand in Tier-1 global institutions.
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-500">
                        Top Programs: CMU, MIT, Imperial, NUS, IIT
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2563EB]">
                        <span>Match 02</span>
                        <span className="font-mono bg-[#E8F0FF] px-2 py-0.5 rounded">91% Fit</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#080F1C]">Computational Economics &amp; Quant</h4>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Synthesize mathematical models with financial markets and market architecture algorithms.
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-500">
                        Top Programs: LSE, Chicago, Oxford, Columbia
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2563EB]">
                        <span>Match 03</span>
                        <span className="font-mono bg-[#E8F0FF] px-2 py-0.5 rounded">86% Fit</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#080F1C]">Aerospace &amp; Autonomous Propulsion</h4>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        Apply high 3D spatial rotation skills to aerospace structures, propulsion fluids, and satellite dynamics.
                      </p>
                      <div className="pt-2 border-t border-slate-200 text-[11px] font-medium text-slate-500">
                        Top Programs: Georgia Tech, Purdue, TU Delft
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex items-center justify-between gap-4 text-xs">
                    <span className="text-[#475569]">
                      Cross-referenced against <strong>100+ global industry career specializations</strong> updated for the 2026–2032 global hiring market.
                    </span>
                    <Link
                      href="/career-roadmap"
                      className="text-[#2563EB] font-bold inline-flex items-center gap-1 hover:underline shrink-0"
                    >
                      <span>Explore Career Models</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {activePageIdx === 3 && (
                <motion.div
                  key="page-3"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -15 }}
                  transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#E4E7EC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                        Page 04 · Multi-Year Execution Roadmap
                      </span>
                      <h3 className="text-[20px] sm:text-[24px] font-black text-[#080F1C]">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#2563EB] bg-[#E8F0FF] px-3 py-1.5 rounded-xl border border-[#2563EB]/20 shrink-0 self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5" /> 2026 – 2029 Strategic Window
                    </div>
                  </div>

                  {/* 3 Step Timeline */}
                  <div className="space-y-3.5">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        G10
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-extrabold text-[#080F1C]">
                          Class 10: Stream Lockdown &amp; Board Focus
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Secure subject registration for PCM + CS. Complete diagnostic aptitude review. Maintain board score targets (90%+) without coaching burnout.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#D97706] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        G11
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-extrabold text-[#080F1C]">
                          Class 11: Digital SAT 1500+ &amp; Research Paper Draft
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Begin adaptive SAT prep aiming for 1500+ by August. Pair with university research mentor to formulate an original empirical paper on algorithmic neural networks.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        G12
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-extrabold text-[#080F1C]">
                          Class 12: Research Publication &amp; Premier Global Admissions
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          Publish paper in peer-reviewed high school journal. Finalize 10-university shortlist (Tier-1 CS programs). Submit Common App and UCAS applications early.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dossier Bottom Interactive Toolbar */}
            <div className="mt-8 pt-5 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePageIdx((prev) => Math.max(0, prev - 1))}
                  disabled={activePageIdx === 0}
                  className="p-2 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-[#080F1C]">
                  Page {activePage.pageNum} of 04
                </span>
                <button
                  onClick={() => setActivePageIdx((prev) => Math.min(DOSSIER_PAGES.length - 1, prev + 1))}
                  disabled={activePageIdx === DOSSIER_PAGES.length - 1}
                  className="p-2 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/sample-reports"
                  className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#080F1C] border border-[#CBD5E1] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer hover:border-slate-400"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Browse All Sample Reports</span>
                </Link>

                <button
                  onClick={handleDownloadSamplePDF}
                  disabled={downloading}
                  className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50 hover:shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>{downloading ? 'Generating PDF...' : 'Download Sample Dossier (PDF)'}</span>
                </button>

                <Link
                  href={BOOK_A_DEMO_URL}
                  className="h-10 px-4 rounded-xl bg-[#080F1C] hover:bg-[#1E293B] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Book Family Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

