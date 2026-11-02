'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, ShieldCheck } from 'lucide-react';
import { Container, Button } from './primitives';

export default function ConsultationBanner() {
  return (
    <section 
      aria-label="Consultation and Registration"
      className="pt-20 sm:pt-28 pb-16 sm:pb-24 bg-[#F5F7FB] overflow-hidden"
    >
      <Container>
        {/* ── Solid Clarvo-Blue Panel ── */}
        <div className="relative bg-[#1258DE] rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-16 text-white shadow-clarvo-elevated overflow-visible">
          
          {/* Breakout Cutout Image: 03-celebrate-cutout breaking out of the top edge */}
          <div className="absolute -top-16 sm:-top-24 md:-top-28 right-4 sm:right-8 lg:right-12 w-[160px] sm:w-[240px] md:w-[300px] lg:w-[340px] h-[200px] sm:h-[280px] md:h-[340px] lg:h-[380px] pointer-events-none z-10">
            <Image
              src="/images/home/03-celebrate-cutout.webp"
              alt="Clarvo students celebrating successful university admission and stream clarity"
              fill
              sizes="(max-width: 768px) 180px, 340px"
              className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
            />
          </div>

          {/* Background Ambient Circles */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Content (Z-20 to sit comfortably above graphics) */}
          <div className="relative z-20 max-w-2xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-dmsans font-bold mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Evidence-based guidance for Grades 7–12</span>
            </div>

            {/* Large White Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-dmsans font-bold tracking-tight text-white leading-[1.08] mb-4">
              Your child’s right path can start here.
            </h2>

            {/* Sub copy */}
            <p className="text-[15px] sm:text-[17px] text-white/90 leading-relaxed font-dmsans mb-8 max-w-xl">
              Schedule a personalized 1-on-1 strategy debrief with certified educational psychologists, or take the 30-factor diagnostic evaluation online today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Link
                href="/book-a-demo"
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-white text-[#1258DE] font-dmsans font-bold text-[15px] sm:text-[16px] inline-flex items-center justify-center gap-2 hover:bg-[#F5F7FB] active:bg-[#EAEFF8] transition-all shadow-md focus-visible:ring-2 focus-visible:ring-white outline-none"
              >
                <span>Schedule consultation</span>
                <ArrowRight className="w-4 h-4 text-[#1258DE]" />
              </Link>

              <Link
                href="/auth?tab=register"
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-transparent border-2 border-white/40 text-white font-dmsans font-bold text-[15px] sm:text-[16px] inline-flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white transition-all focus-visible:ring-2 focus-visible:ring-white outline-none"
              >
                <span>Start free assessment</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-dmsans text-white/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>15,000+ students guided</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-white" />
                <span>Flexible 45-min Zoom sessions</span>
              </div>
              <span>·</span>
              <div>
                <span>CBSE · ICSE · IB · Cambridge</span>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}

