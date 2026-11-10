'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface PhaseDetail {
  id: string;
  badge: 'P1' | 'P2' | 'P3' | 'P4';
  step: string;
  modules: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  sampleMetric: {
    label: string;
    value: string;
    note: string;
  };
}

const PHASES: PhaseDetail[] = [
  {
    id: 'phase-1',
    badge: 'P1',
    step: 'Phase 01',
    modules: 'Modules 01–10',
    title: 'Personality architecture',
    subtitle: 'Behavioral drivers & cognitive persistence',
    desc: 'Evaluates Big Five dimensions (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability), grit, and locus of control to understand how the student naturally tackles high-stakes challenges.',
    tags: [
      'Big Five dimensions',
      'Grit & conscientiousness',
      'MBTI cognitive stack',
      'Ambiguity navigation',
    ],
    sampleMetric: {
      label: 'Conscientiousness & grit index',
      value: 'High persistence',
      note: 'High self-directed persistence and structured execution under prolonged deadlines.',
    },
  },
  {
    id: 'phase-2',
    badge: 'P2',
    step: 'Phase 02',
    modules: 'Modules 11–20',
    title: 'Cognitive processing',
    subtitle: 'Abstract pattern recognition & fluid reasoning',
    desc: 'Calibrates raw problem-solving speed, numerical logic, spatial orientation, and verbal fluency under timed evaluative pressure to map academic ceiling.',
    tags: [
      'Numerical pattern logic',
      'Spatial visualization',
      'Verbal synthesis',
      'Abstract deduction',
    ],
    sampleMetric: {
      label: 'Abstract deduction speed',
      value: 'Visual logic preference',
      note: 'Rapid visual-spatial pattern synthesis and complex inductive problem isolation.',
    },
  },
  {
    id: 'phase-3',
    badge: 'P3',
    step: 'Phase 03',
    modules: 'Modules 21–28',
    title: 'Learning & execution',
    subtitle: 'VARK modalities & study habit architecture',
    desc: 'Diagnoses how information is processed, retained, and retrieved, measuring visual, auditory, reading, and kinesthetic modalities alongside distraction resistance.',
    tags: [
      'VARK sensory profile',
      'Distraction threshold',
      'Deep focus stamina',
      'Time-boxing efficacy',
    ],
    sampleMetric: {
      label: 'Visual-spatial dominance',
      value: 'Visual-schematic preference',
      note: 'Strongest learning retention achieved via system architecture diagrams, schematics, and spatial mapping.',
    },
  },
  {
    id: 'phase-4',
    badge: 'P4',
    step: 'Phase 04',
    modules: 'Modules 29–30',
    title: 'Stream & career alignment',
    subtitle: 'Holland RIASEC vocational mapping & stream validation',
    desc: 'Synthesizes cognitive and behavioral traits against Holland RIASEC Vocational codes to validate stream selection across PCM, PCB, Commerce, and Humanities.',
    tags: [
      'Holland RIASEC codes',
      'Stream validation',
      '4-year degree fit',
      'Industry alignment',
    ],
    sampleMetric: {
      label: 'Secondary stream alignment',
      value: 'Science + Computing focus',
      note: 'Highest statistical alignment for engineering, computer science, and high-impact analytics.',
    },
  },
];

export default function AssessmentPhaseScrubber() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const currentPhase = PHASES[activeIdx];

  return (
    <div className="w-full bg-[#080F1C] text-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#1E293B] shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#1258DE]/15 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-[#2563EB]/10 rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-8 lg:gap-10">
        
        {/* Main interactive split stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Active Phase Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Badges: pure text, NO icons inside badge per spec */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold font-dmsans text-white bg-[#1258DE] px-3 py-1 rounded-full">
                  {currentPhase.step}
                </span>
                <span className="text-xs font-medium font-dmsans text-[#94A3B8]">
                  {currentPhase.modules}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-dmsans text-white tracking-tight leading-tight">
                {currentPhase.title}
              </h3>

              <p className="text-sm sm:text-base font-medium text-[#93C5FD]">
                {currentPhase.subtitle}
              </p>

              <p className="text-sm sm:text-base font-normal text-[#94A3B8] leading-relaxed max-w-xl">
                {currentPhase.desc}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentPhase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-[#CBD5E1] bg-[#1E293B]/80 border border-[#334155] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Result Highlight Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0F172A]/90 border border-[#1E293B] shadow-inner mt-4">
              <div className="flex items-center justify-between gap-3 text-xs mb-2">
                <span className="text-[#94A3B8] font-medium">
                  {currentPhase.sampleMetric.label}
                </span>
                <span className="text-xs font-semibold text-[#60A5FA] bg-[#1E3A8A]/50 px-2.5 py-0.5 rounded-full border border-[#2563EB]/40">
                  Sample Result
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-dmsans tracking-tight">
                {currentPhase.sampleMetric.value}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                {currentPhase.sampleMetric.note}
              </p>
            </div>
          </div>

          {/* Right Column: Diagnostic Profile Radar & Phase Status */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0B132B]/80 border border-[#1E293B]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="text-sm font-bold text-white font-dmsans">
                  Diagnostic profile radar
                </div>
                <div className="text-xs font-medium text-[#94A3B8]">
                  Phase {activeIdx + 1} of 4
                </div>
              </div>

              {/* 2x2 Interactive Phase Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {PHASES.map((phase, idx) => {
                  const isActive = idx === activeIdx;
                  const isCompleted = idx < activeIdx;
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#1258DE] border-[#2563EB] text-white shadow-md'
                          : 'bg-[#0F172A]/60 border-[#1E293B] text-[#94A3B8] hover:border-[#334155] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold font-dmsans px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#1E293B] text-[#94A3B8]'
                          }`}
                        >
                          {phase.badge}
                        </span>
                        {isCompleted && (
                          <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        )}
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {phase.badge === 'P1' && 'Personality'}
                        {phase.badge === 'P2' && 'Cognitive'}
                        {phase.badge === 'P3' && 'Execution'}
                        {phase.badge === 'P4' && 'Alignment'}
                      </div>
                      <div
                        className={`text-xs mt-0.5 font-medium ${
                          isActive
                            ? 'text-white/80'
                            : isCompleted
                            ? 'text-[#34D399]'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {isActive ? 'Calibrating' : isCompleted ? 'Calibrated' : 'Pending'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Meta & Start Action */}
            <div className="pt-6 mt-6 border-t border-[#1E293B] flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#94A3B8]">
                30-Module diagnostic engine
              </span>
              <Link
                href="/psychometric-test"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60A5FA] hover:text-white transition-colors"
              >
                <span>Start assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Scrubber Strip */}
        <div className="pt-6 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {PHASES.map((phase, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={`pill-${phase.id}`}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold font-dmsans transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1258DE] text-white shadow-sm ring-2 ring-[#2563EB]/40'
                      : 'bg-[#0F172A] text-[#94A3B8] border border-[#1E293B] hover:border-[#334155] hover:text-white'
                  }`}
                >
                  {phase.step}: {phase.badge === 'P1' ? 'Personality' : phase.badge === 'P2' ? 'Cognitive' : phase.badge === 'P3' ? 'Execution' : 'Alignment'}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-[#64748B] font-medium select-none">
            Click phase pills to explore diagnostic breakdown
          </span>
        </div>

      </div>
    </div>
  );
}

