'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Compass, 
  Award, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function ParentStudentHeroVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full max-w-[500px] mx-auto select-none">
      {/* Outer Card Container */}
      <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-[#CBD5E1] shadow-[0_16px_40px_rgba(8,15,28,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]">
        
        {/* Card Header: Family Guidance & Consultation Badge */}
        <div className="h-12 border-b border-[#E4E7EC] px-4 sm:px-5 bg-gradient-to-r from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#E8F0FF] text-[#2563EB] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] sm:text-[12px] font-bold text-[#080F1C] tracking-tight">
              Parent &amp; Student Educational Roadmap
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#86EFAC]/40">
            <CheckCircle2 className="w-3 h-3" /> Aligned
          </span>
        </div>

        {/* Visual Scene: Thoughtful Educational Conversation Illustration & Roadmap */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-[#F8FAFC]/50 to-[#FFFFFF]">
          
          {/* Top Visual Banner: Stylized Educational Discussion Scene */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#080F1C] via-[#1E3A8A] to-[#2563EB] p-4 sm:p-5 text-white overflow-hidden shadow-inner mb-4">
            {/* Soft Ambient Light */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#38BDF8]/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/15">
                  <HeartHandshake className="w-3 h-3 text-[#38BDF8]" />
                  <span>Dual-Perspective Guidance</span>
                </span>
                <span className="text-[11px] font-bold text-white/90">Grades 7–12</span>
              </div>

              <h4 className="text-[15px] sm:text-[17px] font-black text-white tracking-tight leading-snug">
                Harmonizing Student Aptitude with Parental Vision
              </h4>
              <p className="text-[12px] sm:text-[12.5px] text-blue-100/90 mt-1.5 leading-relaxed font-normal">
                Eliminating family guesswork through verified cognitive diagnostics, objective stream selection, and strategic admissions milestones.
              </p>

              {/* Consensus Meter */}
              <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
                <span className="text-blue-200 font-medium">Family Consensus Index</span>
                <span className="font-extrabold text-[#38BDF8] text-[12px] font-mono">98% Clarity</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '98%' }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[#38BDF8] to-[#93C5FD] rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Three Connected Milestone Blocks */}
          <div className="space-y-2.5">
            {/* Step 1: Student Aptitude Diagnostic */}
            <div className="p-3 rounded-xl bg-white border border-[#E4E7EC] shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E8F0FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#080F1C] truncate">
                    1. Psychometric &amp; Stream Fit
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    Class 10 Stream Selection · 30 Modules
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#2563EB] bg-[#E8F0FF] px-2 py-0.5 rounded-md shrink-0">
                Diagnostic
              </span>
            </div>

            {/* Step 2: Academic Mastery & SAT */}
            <div className="p-3 rounded-xl bg-white border border-[#E4E7EC] shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#080F1C] truncate">
                    2. Academic Mastery &amp; SAT Prep
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    1-on-1 Mentorship · Digital SAT 1500+
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md shrink-0">
                Preparation
              </span>
            </div>

            {/* Step 3: University Profile & Research */}
            <div className="p-3 rounded-xl bg-white border border-[#E4E7EC] shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#080F1C] truncate">
                    3. Research &amp; University Admissions
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    Peer-Reviewed Papers · Global Shortlisting
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-md shrink-0">
                Admissions
              </span>
            </div>
          </div>

          {/* Bottom Card Footer with Direct Sample Link */}
          <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Evidence-Backed Protocol</span>
            </span>
            <Link
              href="/sample-reports"
              className="text-[12px] font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1 group transition-colors"
            >
              <span>Explore Sample Reports</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

