'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
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
import { Container, SectionHeading, Button } from './primitives';

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
    title: 'Cognitive agility & aptitude index',
    shortLabel: 'Cognitive aptitude',
    tagline: 'Standardized psychological measurement of reasoning speed, working memory, and fluid logic.',
  },
  {
    id: 'stream',
    pageNum: '02',
    title: 'Class 10 stream recommendation matrix',
    shortLabel: 'Stream recommendation',
    tagline: 'Empirical compatibility analysis across PCM, PCB, Commerce, and Humanities.',
  },
  {
    id: 'riasec',
    pageNum: '03',
    title: 'RIASEC vocational & career clustering',
    shortLabel: 'Vocational interests',
    tagline: 'Empirical mapping of student psychological drivers to 100+ global profession clusters.',
  },
  {
    id: 'roadmap',
    pageNum: '04',
    title: '4-year academic & extracurricular action plan',
    shortLabel: '4-year action plan',
    tagline: 'Structured milestone roadmap from Class 10 board exams to premier university admissions.',
  },
];

export default function DeskReportDossier() {
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

  const handlePrevPage = () => {
    setActivePageIdx((prev) => (prev > 0 ? prev - 1 : DOSSIER_PAGES.length - 1));
  };

  const handleNextPage = () => {
    setActivePageIdx((prev) => (prev < DOSSIER_PAGES.length - 1 ? prev + 1 : 0));
  };

  return (
    <section 
      id="sample-dossier" 
      aria-label="Clarvo Interactive Report Dossier"
      className="scroll-mt-20 py-16 sm:py-24 bg-[#F5F7FB] border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <SectionHeading
            title="Interactive sample report dossier"
            subtitle="See exactly what families receive. Browse interactive excerpts from our confidential 56-page diagnostic dossier before booking a consultation."
          />
        </div>

        {/* ── Desk Staging: Report on a Desk Aesthetic ── */}
        <div className="max-w-5xl mx-auto relative">
          
          {/* Subtle multi-page stack layers underneath to look like physical paper on desk */}
          <div className="absolute -inset-2 bg-white/70 rounded-[30px] border border-[#DDE3F0] transform rotate-[0.5deg] pointer-events-none -z-10 shadow-sm" />
          <div className="absolute -inset-1 bg-white/90 rounded-[29px] border border-[#DDE3F0] transform -rotate-[0.3deg] pointer-events-none -z-10 shadow-sm" />

          {/* Main Dossier Binder Paper Container */}
          <div className="bg-white rounded-[26px] sm:rounded-[28px] border border-[#DDE3F0] shadow-[0_24px_60px_-15px_rgba(18,88,222,0.14)] overflow-hidden">
            
            {/* Dossier Header Strip (Midnight Top Binder Bar) */}
            <div className="bg-[#171822] text-white px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#262838]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[#E6EDFF] font-mono font-bold">
                  <FileText className="w-3.5 h-3.5 text-[#1258DE]" />
                  CLARVO-DOSSIER-v5.0
                </span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="text-slate-300 hidden sm:inline">
                  Candidate: <strong className="text-white">Aarav Sharma</strong> (Class 10 · The Shri Ram School)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Verified Diagnostic Dossier
                </span>
              </div>
            </div>

            {/* Dossier Tab Controls (4 Pages) */}
            <div className="border-b border-[#DDE3F0] bg-[#F5F7FB] px-4 sm:px-8 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2.5">
              <div className="flex items-center gap-2 sm:gap-3">
                {DOSSIER_PAGES.map((page, idx) => {
                  const isActive = activePageIdx === idx;
                  return (
                    <button
                      key={page.id}
                      onClick={() => setActivePageIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-dmsans font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                        isActive
                          ? 'bg-[#1258DE] text-white shadow-[0_4px_12px_rgba(18,88,222,0.25)]'
                          : 'bg-white text-[#5B6275] hover:bg-[#E6EDFF] hover:text-[#1258DE] border border-[#DDE3F0]'
                      }`}
                    >
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#5B6275]'
                      }`}>
                        P{page.pageNum}
                      </span>
                      <span>{page.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Page Prev/Next Controls */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrevPage}
                  className="w-8 h-8 rounded-lg bg-white border border-[#DDE3F0] flex items-center justify-center text-[#5B6275] hover:text-[#1258DE] hover:border-[#1258DE] transition-colors cursor-pointer"
                  title="Previous Page"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPage}
                  className="w-8 h-8 rounded-lg bg-white border border-[#DDE3F0] flex items-center justify-center text-[#5B6275] hover:text-[#1258DE] hover:border-[#1258DE] transition-colors cursor-pointer"
                  title="Next Page"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Page Viewport */}
            <div className="p-6 sm:p-8 lg:p-10 min-h-[420px] flex flex-col justify-between bg-white">
              
              {/* PAGE 01: Cognitive Agility */}
              {activePageIdx === 0 && (
                <div className="space-y-6">
                  <div className="border-b border-[#DDE3F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1258DE]">
                        Page 01 · Comprehensive Psychometrics
                      </span>
                      <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight mt-0.5">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#5B6275] mt-0.5 font-dmsans">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#E6EDFF] px-3.5 py-2 rounded-xl border border-[#1258DE]/20 shrink-0 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-[#1258DE] font-dmsans">Overall Aptitude Index</div>
                        <div className="text-[18px] font-black text-[#12131C] font-mono leading-none mt-0.5">128 / 140</div>
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        96th %ile
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C]">Spatial-Visual Manipulation (3D)</span>
                        <span className="text-[#1258DE] font-mono font-black">96th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1258DE] rounded-full" style={{ width: '96%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed">
                        Top 4% nationally. Demonstrates exceptional facility for complex 3D rotations required in mechanical/aerospace engineering, robotics, and architectural systems.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C]">Fluid Logic &amp; Pattern Induction (Gf)</span>
                        <span className="text-[#1258DE] font-mono font-black">94th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1258DE] rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed">
                        High novel puzzle solving efficiency independent of prior schooling. Strongly correlates with rapid computer science syntax mastery and competitive logic.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C]">Quantitative Numerical Stamina</span>
                        <span className="text-[#1258DE] font-mono font-black">92nd %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1258DE] rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed">
                        Strong algorithmic stamina under prolonged timed tests. Retains high numerical accuracy during multi-step algebraic problems.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C]">Linguistic Synthesis &amp; Verbal Reading</span>
                        <span className="text-[#1258DE] font-mono font-black">86th %ile</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1258DE] rounded-full" style={{ width: '86%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed">
                        Solid reading comprehension and vocabulary inference. Ample verbal foundation for SAT Reading &amp; Writing with targeted pacing drills.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 02: Stream Recommendation */}
              {activePageIdx === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-[#DDE3F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1258DE]">
                        Page 02 · Academic Direction
                      </span>
                      <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight mt-0.5">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#5B6275] mt-0.5 font-dmsans">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#E6EDFF] px-3.5 py-2 rounded-xl border border-[#1258DE]/20 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-[#1258DE] font-dmsans">Recommended Stream:</span>
                      <span className="text-xs font-black text-white bg-[#1258DE] px-2.5 py-1 rounded-md font-mono">
                        PCM + Computing
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-[#1258DE]/30">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C] font-dmsans">Science (PCM + CS / AI)</span>
                        <span className="text-[#1258DE] font-mono font-black text-sm">94% Compatibility</span>
                      </div>
                      <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1258DE] rounded-full" style={{ width: '94%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed font-dmsans">
                        Prime fit. High mathematical pattern recognition (94th percentile) and 3D spatial rotation (96th percentile) provide exceptional foundation for engineering and computer science.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C] font-dmsans">Commerce with Mathematics</span>
                        <span className="text-[#5B6275] font-mono font-bold">88% Compatibility</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-500 rounded-full" style={{ width: '88%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed font-dmsans">
                        Viable alternative pathway. Strong quantitative aptitude enables high success in finance, economics, and data-driven management degrees.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C] font-dmsans">Science (PCB Medical)</span>
                        <span className="text-[#5B6275] font-mono font-bold">72% Compatibility</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: '72%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed font-dmsans">
                        Moderate alignment. Memory retention is solid, but lower rote memorization interest suggests clinical medicine would produce higher scholastic friction.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-[#12131C] font-dmsans">Humanities &amp; Liberal Arts</span>
                        <span className="text-[#5B6275] font-mono font-bold">68% Compatibility</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: '68%' }} />
                      </div>
                      <p className="text-[11.5px] text-[#5B6275] mt-2 leading-relaxed font-dmsans">
                        Lower quantitative utilization. While verbal synthesis is adequate, taking pure arts would under-leverage verified analytical logic strengths.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 03: RIASEC Vocational */}
              {activePageIdx === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-[#DDE3F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1258DE]">
                        Page 03 · Vocational Archetypes
                      </span>
                      <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight mt-0.5">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#5B6275] mt-0.5 font-dmsans">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#E6EDFF] px-3.5 py-2 rounded-xl border border-[#1258DE]/20 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-[#1258DE] font-dmsans">Holland Code:</span>
                      <span className="text-xs font-black text-white bg-[#1258DE] px-2.5 py-1 rounded-md font-mono">
                        IRE (Investigative - Realistic - Enterprising)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="text-xs font-bold uppercase text-[#1258DE] mb-1 font-dmsans">Primary Driver</div>
                      <div className="text-lg font-bold font-dmsans text-[#12131C]">Investigative (92/100)</div>
                      <p className="text-[11.5px] text-[#5B6275] mt-1.5 leading-relaxed font-dmsans">
                        Thrives on intellectual inquiry, data synthesis, problem dissection, and empirical research models.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="text-xs font-bold uppercase text-[#1258DE] mb-1 font-dmsans">Secondary Driver</div>
                      <div className="text-lg font-bold font-dmsans text-[#12131C]">Realistic (86/100)</div>
                      <p className="text-[11.5px] text-[#5B6275] mt-1.5 leading-relaxed font-dmsans">
                        Prefers tangible engineering solutions, concrete tools, software builds, and hands-on laboratory experimentation.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0]">
                      <div className="text-xs font-bold uppercase text-[#1258DE] mb-1 font-dmsans">Tertiary Driver</div>
                      <div className="text-lg font-bold font-dmsans text-[#12131C]">Enterprising (78/100)</div>
                      <p className="text-[11.5px] text-[#5B6275] mt-1.5 leading-relaxed font-dmsans">
                        Drawn to project leadership, venture initiative, startup building, and high-impact collaborative execution.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 04: 4-Year Action Plan */}
              {activePageIdx === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-[#DDE3F0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1258DE]">
                        Page 04 · Strategic Trajectory
                      </span>
                      <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight mt-0.5">
                        {activePage.title}
                      </h3>
                      <p className="text-[13px] text-[#5B6275] mt-0.5 font-dmsans">{activePage.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#E6EDFF] px-3.5 py-2 rounded-xl border border-[#1258DE]/20 shrink-0 self-start sm:self-auto">
                      <span className="text-xs font-bold text-[#1258DE] font-dmsans">Timeline:</span>
                      <span className="text-xs font-black text-white bg-[#1258DE] px-2.5 py-1 rounded-md font-mono">
                        Class 10 to Class 12
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0] flex items-start gap-3">
                      <span className="text-xs font-mono font-bold bg-[#1258DE] text-white px-2.5 py-1 rounded shrink-0">
                        Class 10
                      </span>
                      <div>
                        <div className="text-sm font-bold font-dmsans text-[#12131C]">
                          Stream lock-in &amp; foundational academic spikes
                        </div>
                        <p className="text-xs text-[#5B6275] mt-0.5 font-dmsans">
                          Lock in PCM + Computer Science. Complete introductory robotics &amp; Python portfolio project. 1-on-1 family consensus debrief.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0] flex items-start gap-3">
                      <span className="text-xs font-mono font-bold bg-[#1258DE] text-white px-2.5 py-1 rounded shrink-0">
                        Class 11
                      </span>
                      <div>
                        <div className="text-sm font-bold font-dmsans text-[#12131C]">
                          Standardized test acceleration (Digital SAT 1500+) &amp; research paper publication
                        </div>
                        <p className="text-xs text-[#5B6275] mt-0.5 font-dmsans">
                          Diagnostic SAT testing in Autumn, test target in Spring. Faculty-mentored research paper submission to high-school indexed journal.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-[#DDE3F0] flex items-start gap-3">
                      <span className="text-xs font-mono font-bold bg-[#1258DE] text-white px-2.5 py-1 rounded shrink-0">
                        Class 12
                      </span>
                      <div>
                        <div className="text-sm font-bold font-dmsans text-[#12131C]">
                          Global university application shortlisting &amp; scholarship submission
                        </div>
                        <p className="text-xs text-[#5B6275] mt-0.5 font-dmsans">
                          Strategic balanced shortlisting (Reach, Match, Safety). Personal essay refinement, Common App/UCAS completion, merit scholarship filing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dossier Bottom Action Bar */}
              <div className="mt-8 pt-5 border-t border-[#DDE3F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-[#5B6275] font-dmsans">
                  Page {activePageIdx + 1} of {DOSSIER_PAGES.length} · Full report spans 56 diagnostic pages
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadSamplePDF}
                    disabled={downloading}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    {downloading ? 'Preparing sample PDF...' : 'Download sample PDF'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    href="/sample-reports"
                  >
                    View report gallery
                  </Button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}

