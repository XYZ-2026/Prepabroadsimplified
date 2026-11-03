'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Brain, 
  Sparkles, 
  Target, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Activity
} from 'lucide-react';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import { Chip } from './primitives';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PhaseContent {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  modules: string;
  desc: string;
  tags: string[];
  sampleInsight: { label: string; value: string; note: string };
  quadrantName: string;
}

const PHASES: PhaseContent[] = [
  {
    id: 'personality',
    step: 'Phase 01',
    title: 'Personality architecture',
    subtitle: 'Behavioral drivers & cognitive persistence',
    modules: 'Modules 01–10',
    desc: 'Evaluates Big Five dimensions (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability), grit, and locus of control to understand how the student naturally tackles high-stakes challenges.',
    tags: ['Big Five dimensions', 'Grit & conscientiousness', 'MBTI cognitive stack', 'Ambiguity navigation'],
    sampleInsight: {
      label: 'Conscientiousness & grit index',
      value: '94th %ile',
      note: 'High self-directed persistence and structured execution under prolonged deadlines.',
    },
    quadrantName: 'Personality',
  },
  {
    id: 'cognitive',
    step: 'Phase 02',
    title: 'Cognitive processing',
    subtitle: 'Problem solving & mental agility',
    modules: 'Modules 11–20',
    desc: 'Measures Fluid Intelligence (Gf), Quantitative Reasoning, Spatial-Visual 3D Rotation, Verbal Semantic Density, and Working Memory under timed conditions without prior curricular bias.',
    tags: ['Fluid intelligence (Gf)', 'Quantitative stamina', 'Spatial 3D logic', 'Metacognition'],
    sampleInsight: {
      label: 'Spatial-visual 3D rotation',
      value: '96th %ile',
      note: 'Exceptional mental geometry manipulation suited to advanced engineering and computing.',
    },
    quadrantName: 'Cognitive',
  },
  {
    id: 'execution',
    step: 'Phase 03',
    title: 'Academic execution',
    subtitle: 'Learning modalities & study habits',
    modules: 'Modules 21–28',
    desc: 'Identifies VARK sensory study modalities (Visual, Auditory, Read/Write, Kinesthetic), exam arousal calibration, and deep work endurance to eliminate scholastic burnout.',
    tags: ['VARK sensory channels', 'Deep work stamina', 'Exam arousal curve', 'Study time-blocking'],
    sampleInsight: {
      label: 'VARK primary modality',
      value: 'Visual + Kinesthetic',
      note: 'Internalizes conceptual frameworks 3x faster through schematic flowcharts and applied builds.',
    },
    quadrantName: 'Execution',
  },
  {
    id: 'alignment',
    step: 'Phase 04',
    title: 'Stream & career alignment',
    subtitle: 'Evidence-backed stream selection',
    modules: 'Modules 29–30',
    desc: 'Synthesizes all 30 cognitive and behavioral traits against Holland RIASEC Vocational codes to validate stream selection across PCM, PCB, Commerce, and Humanities.',
    tags: ['Holland RIASEC codes', 'Stream validation', '4-year degree fit', 'Family consensus'],
    sampleInsight: {
      label: 'Class 11 master stream fit',
      value: 'PCM + Computing (94%)',
      note: 'Highest statistical probability of scholastic distinction and premier university placement.',
    },
    quadrantName: 'Alignment',
  },
];

export default function PinnedAssessmentStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionPreference();
  const { lenis } = useLenis();

  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(0);
  const [isMobileFallback, setIsMobileFallback] = useState<boolean>(false);

  // Check capabilities on mount / resize: Gate pinned scroll with (hover: hover) and (pointer: fine) per DESIGN.md section 2
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkCapabilities = () => {
      const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isBelowDesktop = window.innerWidth < 1024;
      setIsMobileFallback(!isFinePointer || isBelowDesktop || prefersReducedMotion);
    };
    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    return () => window.removeEventListener('resize', checkCapabilities);
  }, [prefersReducedMotion]);

  // GSAP ScrollTrigger Scrub & Snap inside gsap.context
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isMobileFallback || prefersReducedMotion) return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        snap: {
          snapTo: [0, 1 / 3, 2 / 3, 1],
          duration: { min: 0.2, max: 0.5 },
          delay: 0.05,
          ease: 'power1.inOut',
        },
        onUpdate: (self) => {
          const progress = self.progress;
          // Determine phase index 0, 1, 2, or 3 based on scroll progression
          const idx = Math.min(3, Math.floor(progress * 4));
          setActivePhaseIdx(idx);
        },
      });
    }, wrapperRef);

    // Refresh triggers after fonts and images load
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    } else {
      ScrollTrigger.refresh();
    }

    return () => {
      ctx.revert();
    };
  }, [isMobileFallback, prefersReducedMotion, lenis]);

  // Clickable phase pill: smoothly scrolls directly to the phase's scroll position
  const scrollToPhase = (targetIdx: number) => {
    if (isMobileFallback || !wrapperRef.current) {
      setActivePhaseIdx(targetIdx);
      return;
    }

    const rect = wrapperRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScrollRange = wrapperRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = scrollTop + (targetIdx / 3) * totalScrollRange;

    if (lenis) {
      lenis.scrollTo(targetScrollY, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }

    setActivePhaseIdx(targetIdx);
  };

  const activePhase = PHASES[activePhaseIdx] || PHASES[0];

  // ── FALLBACK VIEW: Below 768px or with reduced motion (4 phases stacked cleanly) ──
  if (isMobileFallback) {
    return (
      <section
        id="assessments"
        aria-label="Clarvo Assessment Matrix"
        className="w-full bg-[#171822] text-white py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
      >
        {/* Background photo inside container */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]" aria-hidden="true">
          <Image
            src="/images/home/01-hero-team-tablet.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center filter grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171822] via-[#1258DE]/15 to-[#171822]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-dmsans font-bold text-[#E6EDFF] bg-[#1258DE] px-3 py-1 rounded-full inline-block mb-3">
              Assessment matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-dmsans font-bold text-white tracking-tight leading-snug">
              Four developmental diagnostic phases
            </h2>
            <p className="text-sm text-[#A6B0C3] mt-2 font-dmsans">
              30 diagnostic evaluation modules calibrating aptitude, cognitive agility, and stream fit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {PHASES.map((phase, idx) => (
              <div
                key={phase.id}
                className="bg-[#1F2333]/90 rounded-[20px] border border-[#2E3349] p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#2E3349] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-dmsans font-bold text-[#1258DE] bg-[#E6EDFF] px-2.5 py-0.5 rounded-full">
                      {phase.step}
                    </span>
                    <span className="text-xs font-dmsans text-[#A6B0C3]">
                      {phase.modules}
                    </span>
                  </div>
                  <span className="text-xs font-dmsans font-bold text-white">
                    {phase.quadrantName}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-dmsans font-bold text-white leading-snug">
                    {phase.title}
                  </h3>
                  <p className="text-xs font-dmsans text-[#A6B0C3] mt-1">
                    {phase.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#CBD5E1] mt-2 leading-relaxed font-dmsans">
                    {phase.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {phase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-dmsans bg-[#252A3D] text-[#CBD5E1] px-2.5 py-0.5 rounded-full border border-[#353B55]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-[#171822] rounded-xl p-3 border border-[#2E3349] flex items-center justify-between">
                  <div>
                    <span className="text-[10.5px] font-dmsans text-[#8D96AA] block">
                      Sample result · {phase.sampleInsight.label}
                    </span>
                    <span className="text-sm font-dmsans font-bold text-white">
                      {phase.sampleInsight.value}
                    </span>
                  </div>
                  <span className="text-[11px] font-dmsans text-[#A6B0C3] max-w-[200px] text-right">
                    {phase.sampleInsight.note}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/psychometric-test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1258DE] text-white text-sm font-dmsans font-bold hover:bg-[#0D4ABF] transition-colors"
            >
              <span>Begin student assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── DESKTOP PINNED STORY: 400svh tall outer wrapper with 100svh sticky inner container ──
  return (
    <div
      ref={wrapperRef}
      id="assessments"
      aria-label="Clarvo Assessment Matrix"
      className="relative w-full bg-[#171822] text-white selection:bg-[#1258DE] selection:text-white"
      style={{ height: '400svh' }}
    >
      {/* ── Sticky 100svh Inner Stage: Pinned to viewport ── */}
      <div
        ref={pinnedStageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
      >
        {/* Background photo inside pinned container with midnight gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Image
            src="/images/home/01-hero-team-tablet.webp"
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover object-center filter grayscale mix-blend-luminosity opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171822] via-[#1258DE]/15 to-[#171822]" />
        </div>

        {/* ── Top Bar ── */}
        <div className="relative z-10 border-b border-[#262838] pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-dmsans font-bold text-[#E6EDFF] bg-[#1258DE] px-3 py-1 rounded-full">
              Assessment matrix
            </span>
            <span className="text-xs text-[#8D96AA] font-dmsans hidden sm:inline">
              30 diagnostic evaluation modules across four developmental phases
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-dmsans text-[#8D96AA]">Profile calibration:</span>
            <span className="text-xs font-dmsans font-bold text-[#E6EDFF] bg-[#222638] px-2.5 py-0.5 rounded-md border border-[#2E3349]">
              {(activePhaseIdx + 1) * 25}%
            </span>
          </div>
        </div>

        {/* ── Main Content Grid: Story on Left, Diagnostic Profile Graphic on Right ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          
          {/* Left Column (7 Cols): Active Phase Story */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-dmsans font-bold text-[#E6EDFF] bg-[#1258DE]/40 border border-[#1258DE]/60 px-3 py-0.5 rounded-full">
                {activePhase.step}
              </span>
              <span className="text-xs font-dmsans text-[#8D96AA]">
                {activePhase.modules}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-dmsans font-bold text-white leading-[1.08] tracking-tight">
              {activePhase.title}
            </h2>

            <p className="text-sm sm:text-[15px] font-dmsans font-medium text-[#A6B0C3]">
              {activePhase.subtitle}
            </p>

            <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-[#CBD5E1] font-dmsans max-w-xl">
              {activePhase.desc}
            </p>

            {/* Focus Area Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activePhase.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-dmsans font-medium bg-[#1F2333] border border-[#2E3349] text-[#CBD5E1] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Sample Result Card with required "Sample result" label */}
            <div className="pt-2">
              <div className="bg-[#1F2333]/90 rounded-2xl border border-[#2E3349] p-4 max-w-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-dmsans text-[#A6B0C3]">
                    {activePhase.sampleInsight.label}
                  </span>
                  <span className="text-[10.5px] font-dmsans font-semibold text-[#8D96AA] bg-[#171822] px-2 py-0.5 rounded-full border border-[#2E3349]">
                    Sample result
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-dmsans font-bold text-white tracking-tight">
                    {activePhase.sampleInsight.value}
                  </span>
                  <span className="text-xs font-dmsans text-[#CBD5E1] leading-snug">
                    {activePhase.sampleInsight.note}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 Cols): Diagnostic Radar / Quadrant Profile Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-[#1B1E2B] rounded-3xl border border-[#2E3349] p-6 shadow-2xl relative">
              
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E3349]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1258DE]" />
                  <span className="text-xs font-dmsans font-bold text-white">
                    Diagnostic profile radar
                  </span>
                </div>
                <span className="text-xs font-dmsans text-[#8D96AA]">
                  Phase {activePhaseIdx + 1} of 4
                </span>
              </div>

              {/* 4 Quadrants: High AA contrast for Pending and Active states */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PHASES.map((phase, idx) => {
                  const isCurrent = idx === activePhaseIdx;
                  const isFilled = idx <= activePhaseIdx;

                  return (
                    <div
                      key={phase.id}
                      className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[92px] ${
                        isCurrent
                          ? 'bg-[#1258DE] text-white border-[#1258DE] shadow-md scale-[1.02]'
                          : isFilled
                          ? 'bg-[#16387C] text-white border-[#2454B5]'
                          : 'bg-[#222638] text-[#E2E8F0] border-[#3E4562]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-dmsans font-bold mb-1">
                        <span>P0{idx + 1}</span>
                        {isFilled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>

                      <div>
                        <div className="text-xs font-dmsans font-bold leading-tight">
                          {phase.quadrantName}
                        </div>
                        {/* High contrast Pending / Calibrated label */}
                        <div className={`text-[10.5px] font-dmsans font-medium mt-0.5 ${
                          isFilled ? 'text-white/90' : 'text-[#A6B0C3]'
                        }`}>
                          {isFilled ? 'Calibrated' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Bar: Green dot replaced with clarvo-blue */}
              <div className="pt-2 border-t border-[#2E3349] flex items-center justify-between text-xs font-dmsans">
                <div className="flex items-center gap-2 text-[#CBD5E1] text-[11.5px]">
                  {/* Clarvo-blue active dot instead of green */}
                  <span className="w-2 h-2 rounded-full bg-[#1258DE] animate-pulse" />
                  <span>30-Module diagnostic engine</span>
                </div>
                <Link
                  href="/psychometric-test"
                  className="text-xs font-dmsans font-bold text-[#E6EDFF] hover:underline inline-flex items-center gap-1"
                >
                  <span>Start diagnosis</span>
                  <ArrowRight className="w-3 h-3 text-[#1258DE]" />
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* ── Bottom Stepper Bar with Clickable Phase Pills ── */}
        <div className="relative z-10 border-t border-[#262838] pt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => scrollToPhase(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-dmsans font-bold whitespace-nowrap transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE] ${
                  activePhaseIdx === idx
                    ? 'bg-[#1258DE] text-white shadow-sm'
                    : 'bg-[#1F2333] text-[#A6B0C3] hover:text-white hover:bg-[#252A3D]'
                }`}
              >
                {phase.step}: {phase.quadrantName}
              </button>
            ))}
          </div>

          <span className="text-[11.5px] text-[#8D96AA] hidden sm:inline font-dmsans">
            Scroll or click phase pills to scrub
          </span>
        </div>

      </div>
    </div>
  );
}
