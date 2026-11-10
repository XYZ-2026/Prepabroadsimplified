'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaFrame from '@/components/landing/redesign/MediaFrame';
import { PSYCHOMETRIC_CONTENT, PhaseContent } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Layers, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AssessmentPhaseStickyStepper() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isPointerFine = usePointerFine();
  const prefersReduced = useReducedMotion();

  const phases = PSYCHOMETRIC_CONTENT.phases.items;

  useEffect(() => {
    setIsClient(true);

    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScreen);
    };
  }, []);

  // Set up ScrollTrigger for sticky stage triggers (fine pointer, >=1024px, no reduced motion)
  useEffect(() => {
    if (!isClient || !isLargeScreen || !isPointerFine || prefersReduced) {
      return;
    }

    const triggers = triggerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (triggers.length === 0) return;

    const ctx = gsap.context(() => {
      triggers.forEach((triggerEl, idx) => {
        ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              setActivePhaseIndex(idx);
            }
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isClient, isLargeScreen, isPointerFine, prefersReduced, phases.length]);

  const scrollToPhase = (index: number) => {
    setActivePhaseIndex(index);
    const triggerEl = triggerRefs.current[index];
    if (triggerEl) {
      triggerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Stacked Layout (Mobile, Tablet portrait < 1024, Touch, or Reduced Motion)
  const isStacked = !isClient || !isLargeScreen || !isPointerFine || prefersReduced;

  if (isStacked) {
    return (
      <div className="w-full space-y-12 py-6 text-left">
        {phases.map((phase, idx) => (
          <div
            key={phase.id}
            id={`stacked-phase-${idx + 1}`}
            className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xs transition-all duration-300 hover:border-clarvo-blue/40"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Details */}
              <div className="md:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[12px] font-bold text-sky bg-clarvo-blue px-3 py-1 rounded-full">
                    {phase.stepNumber}
                  </span>
                  <span className="text-[12px] font-semibold text-white/70 bg-white/10 border border-white/10 px-3 py-1 rounded-full">
                    {phase.modules}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-dmsans text-white mb-1.5">
                    {phase.name}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-sky/80 font-medium">
                    {phase.subtitle}
                  </p>
                </div>

                {/* What it measures (3 lines) */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[13px] font-bold text-white/80 uppercase tracking-wider">
                    What it measures:
                  </div>
                  <ul className="space-y-2 text-[15px] text-white/90">
                    {phase.whatItMeasures.map((measure, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-clarvo-blue mt-2 shrink-0" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What the report shows */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[14px] text-sky leading-relaxed">
                  <span className="font-bold text-clarvo-blue block text-[12px] mb-1">
                    What the report shows:
                  </span>
                  {phase.whatTheReportShows}
                </div>

                {/* Radar Stage Mini Preview */}
                <div className="pt-2 flex items-center gap-3">
                  <RadarSvg activeIndex={idx} size={64} />
                  <div className="text-[12px] text-white/70">
                    <span className="font-bold text-white block">Phase {idx + 1} Profile Synthesis</span>
                    <span>Quadrant {idx + 1} of 4 mapped</span>
                  </div>
                </div>
              </div>

              {/* Right MediaFrame Photo */}
              <div className="md:col-span-5 w-full">
                <MediaFrame
                  src={`/images/psychometric/psy-0${idx + 2}.webp`}
                  alt={`${phase.name} visual`}
                  mode="cover"
                  ratioDesktop="4/5"
                  ratioTablet="16/10"
                  backdrop="midnight"
                  className="rounded-2xl border-white/10 shadow-lg"
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  }

  // Sticky Stepper Layout (Desktop >= 1024, Fine Pointer, Smooth Progress)
  const currentPhase = phases[activePhaseIndex] || phases[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        // 4 triggers x 90svh = 360svh total scroll height
        minHeight: '360svh',
      }}
    >
      {/* ── 4 INVISIBLE SCROLL TRIGGER SENTINELS (90svh each) ── */}
      <div className="absolute inset-0 w-full pointer-events-none">
        {phases.map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              triggerRefs.current[idx] = el;
            }}
            data-index={idx}
            id={`phase-step-${idx + 1}`}
            style={{
              height: '90svh',
            }}
            className="w-full pointer-events-none"
          />
        ))}
      </div>

      {/* ── STICKY CONTAINER PINNED AT VIEWPORT TOP ── */}
      <div
        className="sticky top-20 xl:top-24 w-full z-20 py-4"
        style={{
          // Container fits comfortably inside the viewport below the navbar
          maxHeight: 'calc(100svh - 96px)',
        }}
      >
        <div className="grid grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* ── LEFT RAIL: PROGRESS LINE & FOUR PHASE TITLE BUTTONS ── */}
          <div className="col-span-5 xl:col-span-4 space-y-6 text-left">
            
            {/* Header indicator */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
              <span className="text-[12px] font-bold text-sky flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-clarvo-blue" />
                Assessment architecture
              </span>
              <span className="text-[12px] font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded-md">
                Phase {activePhaseIndex + 1} of 4
              </span>
            </div>

            {/* Vertical Progress Rail with Phase Titles */}
            <div className="relative pl-6 space-y-5">
              {/* Vertical Track Line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-white/15 rounded-full" />
              
              {/* Dynamic Progress Fill */}
              <div
                className="absolute left-[7px] top-3 w-[2px] bg-clarvo-blue rounded-full transition-all duration-300 ease-out"
                style={{
                  height: `${((activePhaseIndex + 0.5) / 4) * 100}%`,
                }}
              />

              {/* 4 Interactive Phase Title Buttons */}
              {phases.map((phase, idx) => {
                const isActive = activePhaseIndex === idx;
                const isPassed = activePhaseIndex > idx;

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => scrollToPhase(idx)}
                    className="group relative flex items-start text-left w-full cursor-pointer focus:outline-none bg-transparent border-0 p-0 shadow-none appearance-none"
                    aria-selected={isActive}
                  >
                    {/* Node Dot */}
                    <span
                      className={`absolute -left-6 top-2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? 'bg-clarvo-blue border-white scale-125 shadow-[0_0_12px_rgba(18,88,222,0.8)]'
                          : isPassed
                          ? 'bg-clarvo-blue border-clarvo-blue'
                          : 'bg-[#171822] border-white/30 group-hover:border-white/60'
                      }`}
                    >
                      {isPassed && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>

                    {/* Title & Module text */}
                    <div
                      className={`w-full p-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-white/10 border border-white/15 shadow-xs'
                          : 'bg-transparent border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[12px] font-bold transition-colors ${
                            isActive ? 'text-clarvo-blue' : 'text-white/60'
                          }`}
                        >
                          {phase.stepNumber}
                        </span>
                        <span className="text-[12px] text-white/50">
                          {phase.modules}
                        </span>
                      </div>

                      <div
                        className={`text-[15px] xl:text-[16px] font-bold font-dmsans transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-white/70 group-hover:text-white/90'
                        }`}
                      >
                        {phase.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Radar Synthesis Status */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <RadarSvg activeIndex={activePhaseIndex} size={70} />
              <div className="space-y-0.5">
                <span className="text-[12px] font-bold text-clarvo-blue block">
                  Diagnostic radar
                </span>
                <span className="text-[13px] font-bold text-white block">
                  {currentPhase.name}
                </span>
                <span className="text-[12px] text-white/60 block">
                  Quadrant {activePhaseIndex + 1} of 4 mapped
                </span>
              </div>
            </div>

          </div>

          {/* ── RIGHT STAGE: PHOTO + DETAILS + REPORT OUTPUT ── */}
          <div className="col-span-7 xl:col-span-8 p-6 sm:p-8 xl:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl text-left">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
              
              {/* Left details inside the stage */}
              <div className="xl:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-sky bg-clarvo-blue px-3 py-0.5 rounded-full">
                    {currentPhase.stepNumber}
                  </span>
                  <span className="text-[12px] font-semibold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {currentPhase.modules}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl xl:text-3xl font-bold font-dmsans text-white tracking-tight">
                    {currentPhase.name}
                  </h3>
                  <p className="text-[14.5px] xl:text-[15px] text-sky/80 font-medium mt-1">
                    {currentPhase.subtitle}
                  </p>
                </div>

                {/* What it measures (3 short lines) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[12px] font-bold text-white/70 block">
                    What it measures:
                  </span>
                  <ul className="space-y-2 text-[14.5px] xl:text-[15px] text-white/90">
                    {currentPhase.whatItMeasures.map((measure, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-clarvo-blue shrink-0 mt-0.5" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What the report shows (1 example output line) */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[13.5px] xl:text-[14px] text-sky leading-relaxed">
                  <span className="font-bold text-clarvo-blue block text-[12px] mb-1">
                    What the report shows:
                  </span>
                  {currentPhase.whatTheReportShows}
                </div>
              </div>

              {/* Right: MediaFrame photo for current phase (4/5 ratio, psy-02 to psy-05) */}
              <div className="xl:col-span-5 w-full">
                <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
                  <MediaFrame
                    key={activePhaseIndex}
                    src={`/images/psychometric/psy-0${activePhaseIndex + 2}.webp`}
                    alt={`${currentPhase.name} preview`}
                    mode="cover"
                    ratioDesktop="4/5"
                    ratioTablet="16/10"
                    backdrop="midnight"
                    className="rounded-2xl border-white/15"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Dynamic SVG Radar Polygon
 * Displays a 4-axis diamond/compass radar that progressively fills one quadrant
 * per phase (Personality, Cognitive, Learning & Execution, Stream Alignment).
 */
function RadarSvg({ activeIndex, size = 64 }: { activeIndex: number; size?: number }) {
  const c = 50;

  const getPolygonPoints = () => {
    switch (activeIndex) {
      case 0:
        return `${c},${c} 44,24 50,14 56,24 ${c},${c}`;
      case 1:
        return `${c},${c} 50,14 86,50 ${c},${c}`;
      case 2:
        return `${c},${c} 50,14 86,50 50,86 ${c},${c}`;
      case 3:
      default:
        return '50,14 86,50 50,86 14,50';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0 select-none"
      aria-label={`Radar showing ${activeIndex + 1} of 4 phases`}
    >
      {/* Background Grid Rings */}
      <circle cx={c} cy={c} r={38} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx={c} cy={c} r={24} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx={c} cy={c} r={10} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Axis Lines */}
      <line x1={c} y1={12} x2={c} y2={88} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1={12} y1={c} x2={88} y2={c} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Active Phase Polygon (Gains 1 area per phase) */}
      <polygon
        points={getPolygonPoints()}
        fill="rgba(18, 88, 222, 0.45)"
        stroke="#1258DE"
        strokeWidth="2"
        strokeLinejoin="round"
        className="transition-all duration-350 ease-out"
      />

      {/* Axis Nodes */}
      <circle cx={50} cy={14} r={3} fill={activeIndex >= 0 ? '#1258DE' : 'rgba(255,255,255,0.3)'} />
      <circle cx={86} cy={50} r={3} fill={activeIndex >= 1 ? '#1258DE' : 'rgba(255,255,255,0.3)'} />
      <circle cx={50} cy={86} r={3} fill={activeIndex >= 2 ? '#1258DE' : 'rgba(255,255,255,0.3)'} />
      <circle cx={14} cy={50} r={3} fill={activeIndex >= 3 ? '#1258DE' : 'rgba(255,255,255,0.3)'} />

      {/* Center point */}
      <circle cx={c} cy={c} r={2} fill="#E6EDFF" />
    </svg>
  );
}
