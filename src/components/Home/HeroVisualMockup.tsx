'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Compass, 
  GraduationCap, 
  Globe2, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  UserCheck 
} from 'lucide-react';

const STATUS_STEPS = [
  { label: 'Analyzing Cognitive Data', color: 'text-purple-600' },
  { label: 'Understood Student Profile', color: 'text-amber-600' },
  { label: 'Matched Career & Universities', color: 'text-blue-600' },
  { label: 'Planned Study Abroad Roadmap', color: 'text-emerald-600' }
];

export default function HeroVisualMockup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STATUS_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto relative py-6 select-none">
      
      {/* Background Soft Aura & Grid */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#690b1b]/5 via-amber-500/5 to-purple-500/5 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Composition Container */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* ── CENTRAL FLOATING STUDENT INTELLIGENCE CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-12 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-6 shadow-2xl shadow-[#690b1b]/10 relative z-20 overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#690b1b] to-purple-900 text-white font-bold text-sm flex items-center justify-center shadow-md">
                AP
              </div>
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[#690b1b] uppercase block">
                  STUDENT INTELLIGENCE PROFILE
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Candidate Profile — Illustrative Demo</h4>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Profile
            </span>
          </div>

          {/* Core Insights Grid inside Central Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Cognitive Profile</span>
              <span className="text-xs font-bold text-slate-900">Pattern & Abstract</span>
              <span className="text-[10px] font-semibold text-purple-700 mt-0.5">Strong Performance</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Career Direction</span>
              <span className="text-xs font-bold text-slate-900">Humanities & Creative</span>
              <span className="text-[10px] font-semibold text-amber-800 mt-0.5">Top Field Match</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">University Matches</span>
              <span className="text-xs font-bold text-slate-900">12 Strong Fits</span>
              <span className="text-[10px] font-semibold text-blue-700 mt-0.5">UK & USA Destinations</span>
            </div>
          </div>

          {/* Micro Status Cycle Indicator */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span className="text-[11px] font-medium text-slate-500">System State:</span>
              <span className={`text-[11px] font-bold ${STATUS_STEPS[activeStep].color}`}>
                {STATUS_STEPS[activeStep].label}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Sync</span>
          </div>
        </motion.div>

        {/* ── FLOATING FEATURE CARDS (SURROUNDING) ── */}

        {/* CARD 1: Cognitive Profile (Top Left) */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-lg shadow-slate-900/5 flex items-center gap-3 relative z-10"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#690b1b] flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">COGNITIVE PROFILE</span>
            <span className="text-xs font-bold text-slate-900 block">Pattern Reasoning: Strong</span>
            <span className="text-[10px] text-slate-400 font-medium">Standardized 45-Item Model</span>
          </div>
        </motion.div>

        {/* CARD 2: Career Pathway (Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="md:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-lg shadow-slate-900/5 flex items-center gap-3 relative z-10"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">CAREER PATHWAY</span>
            <span className="text-xs font-bold text-slate-900 block">Humanities & Creative Arts</span>
            <span className="text-[10px] text-slate-400 font-medium">Top Psychometric Match</span>
          </div>
        </motion.div>

        {/* CARD 3: University Match (Bottom Left) */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="md:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-lg shadow-slate-900/5 flex items-center gap-3 relative z-10"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">UNIVERSITY MATCH</span>
            <span className="text-xs font-bold text-slate-900 block">UK · 92% Compatibility</span>
            <span className="text-[10px] text-slate-400 font-medium">12 Strong-Fit Institutions</span>
          </div>
        </motion.div>

        {/* CARD 4: Study Abroad Roadmap (Bottom Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="md:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-lg shadow-slate-900/5 flex items-center gap-3 relative z-10"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">STUDY ABROAD ROADMAP</span>
            <span className="text-xs font-bold text-slate-900 block">UK · Germany · Singapore</span>
            <span className="text-[10px] text-slate-400 font-medium">Action Plan & Visa Guide</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
