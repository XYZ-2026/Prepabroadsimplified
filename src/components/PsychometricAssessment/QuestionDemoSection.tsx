'use client';

import React, { useState, useRef } from 'react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import { HelpCircle, Check, ArrowRight, Sparkles, Brain, BookOpen } from 'lucide-react';

export default function QuestionDemoSection() {
  const [activeTab, setActiveTab] = useState<'personality' | 'reasoning' | 'study_habits'>('personality');
  const [personalityScore, setPersonalityScore] = useState<number>(4);
  const [reasoningAnswer, setReasoningAnswer] = useState<string>('A');
  const [studyHabitAnswer, setStudyHabitAnswer] = useState<string>('diagrams');

  const tabListRef = useRef<HTMLDivElement>(null);
  const isPointerFine = usePointerFine();

  const content = PSYCHOMETRIC_CONTENT.sampleQuestions;

  // Accessible keyboard tab navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabs: Array<'personality' | 'reasoning' | 'study_habits'> = ['personality', 'reasoning', 'study_habits'];
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
      const nextTabEl = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex];
      nextTabEl?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex]);
      const prevTabEl = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[prevIndex];
      prevTabEl?.focus();
    }
  };

  // Trait calculation for live profile bar
  const getLiveBarInfo = () => {
    if (activeTab === 'personality') {
      const pct = (personalityScore / 5) * 100;
      return {
        trait: 'Conscientiousness & Structure',
        value: `${personalityScore}/5`,
        pct,
        description: 'Measures preference for planned schedules, method, and structured execution.',
      };
    }
    if (activeTab === 'reasoning') {
      const isCorrect = reasoningAnswer === 'A';
      return {
        trait: 'Abstract Spatial Agility',
        value: isCorrect ? 'Optimal logic' : 'Developing pattern',
        pct: isCorrect ? 92 : 65,
        description: isCorrect
          ? 'Identified 90° clockwise rotational deduction accurately.'
          : 'Selected alternative rotational projection.',
      };
    }
    // Study habits
    const studyMap: Record<string, { trait: string; pct: number; label: string }> = {
      diagrams: { trait: 'Visual-Schematic Modality', pct: 90, label: 'High visual retention' },
      notes: { trait: 'Read/Write Synthesizing', pct: 85, label: 'High verbal retention' },
      practice: { trait: 'Kinesthetic/Active Trial', pct: 88, label: 'High experiential retention' },
    };
    const s = studyMap[studyHabitAnswer] || studyMap.diagrams;
    return {
      trait: s.trait,
      value: s.label,
      pct: s.pct,
      description: 'Captures the sensory channel through which the student retains complex concepts.',
    };
  };

  const liveBar = getLiveBarInfo();

  return (
    <section
      aria-label="What a Psychometric Question Looks Like"
      className="w-full py-16 sm:py-20 lg:py-24 bg-paper border-b border-line text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky border border-line text-[13px] font-bold text-clarvo-blue font-dmsans">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{content.sectionChip}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-dmsans text-ink tracking-tight leading-[1.15]">
            {content.sectionHeadline}
          </h2>

          <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed">
            {content.sectionSubcopy}
          </p>
        </div>

        {/* ── ACCESSIBLE TABLIST (role=tablist) ── */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Sample Question Categories"
          className="flex items-center gap-2 sm:gap-3 p-1.5 bg-white border border-line rounded-2xl w-fit mb-8 max-w-full overflow-x-auto shadow-2xs"
        >
          {content.tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const tabIcons = {
              personality: <Sparkles className="w-4 h-4 shrink-0" />,
              reasoning: <Brain className="w-4 h-4 shrink-0" />,
              study_habits: <BookOpen className="w-4 h-4 shrink-0" />,
            };

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                type="button"
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-[14px] font-bold font-dmsans transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-clarvo-blue text-white shadow-xs'
                    : 'text-muted hover:text-ink hover:bg-sky/50'
                }`}
              >
                {tabIcons[tab.id as keyof typeof tabIcons]}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* ── TABPANEL & LIVE PROFILE BAR CONTAINER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: INTERACTIVE QUESTION CARD */}
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="lg:col-span-8 p-6 sm:p-8 xl:p-10 rounded-3xl bg-white border border-line shadow-sm flex flex-col justify-between space-y-6"
          >
            <div>
              {/* Card Meta & Notice */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line/60">
                <span className="text-[12px] font-bold text-clarvo-blue bg-sky px-3 py-1 rounded-full">
                  Sample question
                </span>
                <span className="text-[12px] font-semibold text-muted">
                  {activeTab === 'personality' && 'Phase 1 • Personality Architecture'}
                  {activeTab === 'reasoning' && 'Phase 2 • Cognitive Processing'}
                  {activeTab === 'study_habits' && 'Phase 3 • Learning Modalities'}
                </span>
              </div>

              {/* ── TAB 1: PERSONALITY LIKERT SCALE ── */}
              {activeTab === 'personality' && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-ink leading-snug">
                    &ldquo;When preparing for a major exam, I prefer to build a detailed multi-week study schedule rather than revising spontaneously.&rdquo;
                  </h3>

                  <p className="text-[14px] text-muted">
                    Choose the rating that most accurately reflects your natural habit:
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    {[
                      { num: 1, label: 'Strongly disagree' },
                      { num: 2, label: 'Disagree' },
                      { num: 3, label: 'Neutral' },
                      { num: 4, label: 'Agree' },
                      { num: 5, label: 'Strongly agree' },
                    ].map((opt) => {
                      const isSelected = personalityScore === opt.num;
                      return (
                        <button
                          key={opt.num}
                          type="button"
                          onClick={() => setPersonalityScore(opt.num)}
                          className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-clarvo-blue text-white border-clarvo-blue shadow-md scale-102'
                              : 'bg-paper text-ink border-line hover:border-clarvo-blue/50 hover:bg-sky/40'
                          } ${isPointerFine ? 'hover:scale-[1.02] active:scale-[0.98]' : 'active:scale-95'}`}
                          aria-label={opt.label}
                        >
                          <span className="text-lg sm:text-xl font-bold mb-1">
                            {isSelected ? <Check className="w-5 h-5 stroke-[3] inline" /> : opt.num}
                          </span>
                          <span
                            className={`text-[12px] font-medium text-center hidden sm:block ${
                              isSelected ? 'text-white/90' : 'text-muted'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-muted font-medium sm:hidden px-1">
                    <span>Strongly disagree</span>
                    <span>Strongly agree</span>
                  </div>
                </div>
              )}

              {/* ── TAB 2: REASONING SVG PATTERN PUZZLE ── */}
              {activeTab === 'reasoning' && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-ink leading-snug">
                    Which geometric tile logically completes the rotational sequence?
                  </h3>

                  {/* SVG 2x2 Matrix Puzzle */}
                  <div className="p-4 sm:p-6 bg-paper rounded-2xl border border-line flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                    <div className="grid grid-cols-2 gap-3 w-44 h-44">
                      {/* Tile 1: Triangle pointing UP (0°) */}
                      <div className="bg-white rounded-xl border border-line flex items-center justify-center p-3 shadow-2xs">
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <polygon points="24,6 42,38 6,38" fill="#1258DE" />
                        </svg>
                      </div>
                      {/* Tile 2: Triangle pointing RIGHT (90°) */}
                      <div className="bg-white rounded-xl border border-line flex items-center justify-center p-3 shadow-2xs">
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <polygon points="42,24 10,42 10,6" fill="#1258DE" />
                        </svg>
                      </div>
                      {/* Tile 3: Triangle pointing DOWN (180°) */}
                      <div className="bg-white rounded-xl border border-line flex items-center justify-center p-3 shadow-2xs">
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <polygon points="24,42 6,10 42,10" fill="#1258DE" />
                        </svg>
                      </div>
                      {/* Tile 4: Question Mark */}
                      <div className="bg-sky/60 rounded-xl border-2 border-dashed border-clarvo-blue flex items-center justify-center">
                        <span className="text-2xl font-bold text-clarvo-blue">?</span>
                      </div>
                    </div>

                    <div className="text-left text-[13px] text-muted max-w-xs space-y-1">
                      <span className="font-bold text-ink block">Inductive Pattern Rule</span>
                      <span>The geometric polygon is rotating clockwise by 90° with every step in the grid.</span>
                    </div>
                  </div>

                  {/* 4 Answer Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'A', label: 'Option A (Left 270°)', isCorrect: true, points: '6,24 38,6 38,42' },
                      { id: 'B', label: 'Option B (Up 0°)', isCorrect: false, points: '24,6 42,38 6,38' },
                      { id: 'C', label: 'Option C (Right 90°)', isCorrect: false, points: '42,24 10,42 10,6' },
                      { id: 'D', label: 'Option D (Down 180°)', isCorrect: false, points: '24,42 6,10 42,10' },
                    ].map((opt) => {
                      const isSelected = reasoningAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setReasoningAnswer(opt.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-clarvo-blue text-white border-clarvo-blue shadow-md'
                              : 'bg-paper text-ink border-line hover:border-clarvo-blue/50 hover:bg-sky/40'
                          } ${isPointerFine ? 'hover:scale-[1.02] active:scale-[0.98]' : 'active:scale-95'}`}
                        >
                          <svg width="36" height="36" viewBox="0 0 48 48" className="mb-2">
                            <polygon points={opt.points} fill={isSelected ? '#ffffff' : '#1258DE'} />
                          </svg>
                          <span className="text-xs font-bold">{opt.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAB 3: STUDY HABITS SCENARIO ── */}
              {activeTab === 'study_habits' && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-ink leading-snug">
                    &ldquo;You encounter a challenging topic in Physics that you do not understand during class. What is your initial reaction?&rdquo;
                  </h3>

                  <div className="space-y-3 pt-2">
                    {[
                      {
                        id: 'diagrams',
                        label: 'Option A — Visual Systems',
                        desc: 'Search for an animated video or visual diagram explaining the underlying system mechanics.',
                        tag: 'Visual Modality',
                      },
                      {
                        id: 'notes',
                        label: 'Option B — Textual Summary',
                        desc: 'Re-read the textbook chapters and write structured summary notes in your own words.',
                        tag: 'Read/Write Modality',
                      },
                      {
                        id: 'practice',
                        label: 'Option C — Hands-on Practice',
                        desc: 'Attempt numerical practice problems immediately to learn by working through mistakes.',
                        tag: 'Kinesthetic Modality',
                      },
                    ].map((opt) => {
                      const isSelected = studyHabitAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setStudyHabitAnswer(opt.id)}
                          className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky/60 border-clarvo-blue shadow-sm'
                              : 'bg-paper text-ink border-line hover:border-clarvo-blue/40'
                          } ${isPointerFine ? 'hover:translate-x-1' : ''}`}
                        >
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-clarvo-blue border-clarvo-blue text-white'
                                : 'bg-white border-line text-muted'
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : opt.id.charAt(0).toUpperCase()}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[14px] text-ink">{opt.label}</span>
                              <span className="text-[12px] font-semibold text-clarvo-blue bg-white border border-line px-2 py-0.5 rounded-md">
                                {opt.tag}
                              </span>
                            </div>
                            <p className="text-[13.5px] text-muted leading-relaxed">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Reminder */}
            <div className="pt-4 border-t border-line text-[13px] text-muted flex items-center justify-between">
              <span>{content.notice}</span>
              <span className="text-clarvo-blue font-bold flex items-center gap-1">
                30 modules in full assessment <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* RIGHT: LIVE PROFILE CALIBRATION BAR */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-line shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-line">
                <span className="w-2.5 h-2.5 rounded-full bg-clarvo-blue animate-pulse" />
                <span className="text-[12px] font-bold text-clarvo-blue uppercase tracking-wider">
                  Live Profile Calibration
                </span>
              </div>

              <div className="space-y-6 pt-5">
                <div>
                  <span className="text-[13px] text-muted font-medium block mb-1">
                    Mapped Dimension
                  </span>
                  <h4 className="text-xl font-bold font-dmsans text-ink">
                    {liveBar.trait}
                  </h4>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-semibold text-muted">Evaluation Vector</span>
                    <span className="font-bold text-clarvo-blue font-mono">{liveBar.value}</span>
                  </div>
                  <div className="w-full h-3 bg-sky rounded-full overflow-hidden p-0.5 border border-line/60">
                    <div
                      className="h-full bg-clarvo-blue rounded-full transition-all duration-400 ease-out"
                      style={{ width: `${liveBar.pct}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-paper border border-line text-[13px] text-muted leading-relaxed">
                  {liveBar.description}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky/50 border border-line text-[13px] text-clarvo-blue font-semibold">
              In the real evaluation, responses across 30 modules are synthesized to generate your full stream and career matrix.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
