'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Container } from './primitives';

export default function ConsultationBanner() {
  return (
    <section 
      aria-label="Consultation and Registration"
      className="pt-16 sm:pt-20 pb-16 sm:pb-24 bg-[#F5F7FB] overflow-hidden"
    >
      <Container>
        {/* ── Solid Clarvo-Blue Panel ── */}
        <div className="relative bg-[#1258DE] rounded-[28px] text-white shadow-clarvo-elevated overflow-visible xl:min-h-[480px] flex flex-col justify-between p-6 sm:p-10 md:p-12 xl:p-14 xl:py-12">
          
          {/* Background Soft Radial Glow behind the group (no hard shadows) */}
          <div className="absolute right-4 bottom-0 w-[360px] sm:w-[480px] xl:w-[600px] h-[300px] sm:h-[400px] bg-white/15 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Desktop Absolute Photo (1280px+): Anchored bottom at right 3%, up to 60% width, 106% height with 6% head breakout */}
          <div className="hidden xl:block absolute right-[3%] bottom-0 w-[58%] max-w-[720px] h-[106%] pointer-events-none z-10 overflow-visible">
            <Image
              src="/images/home/03-celebrate-cutout.webp"
              alt="Clarvo students celebrating successful university admission and stream clarity"
              fill
              sizes="(max-width: 1280px) 0vw, 58vw"
              className="object-contain object-bottom pointer-events-none"
              priority={false}
              loading="lazy"
            />
          </div>

          {/* Text Content Column: ~40% on Desktop (1280+), Full Width on Stacked (Below 1280) */}
          <div className="relative z-20 w-full xl:w-[42%] max-w-xl mx-auto xl:mx-0 flex flex-col justify-center">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-dmsans font-bold mb-4 backdrop-blur-sm self-start">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Evidence-based guidance for Grades 7–12</span>
            </div>

            {/* Large White Headline: clamp(2.25rem, 3.4vw, 3.25rem), max 3 lines */}
            <h2 className="text-[clamp(2.25rem,3.4vw,3.25rem)] font-dmsans font-bold tracking-tight text-white leading-[1.08] mb-4">
              Your child’s right path can start here.
            </h2>

            {/* Sub copy */}
            <p className="text-[15px] sm:text-[16px] text-white/90 leading-relaxed font-dmsans mb-7 max-w-lg">
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

            {/* Trust Row: 3 items with icons and spacing, NO middle dots */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-dmsans text-white/90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>15,000+ students guided</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white shrink-0" />
                <span>Flexible 45-min Zoom sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>CBSE, ICSE, IB &amp; Cambridge</span>
              </div>
            </div>

          </div>

          {/* Stacked Layout Photo (Below 1280px): Text on top, Photo below, full width, bottom flush */}
          <div className="xl:hidden w-full flex items-end justify-center pt-8 sm:pt-10 overflow-visible relative z-10 -mb-6 sm:-mb-10 md:-mb-12">
            <div className="relative w-full max-w-[500px] sm:max-w-[560px] aspect-[1536/1024]">
              <Image
                src="/images/home/03-celebrate-cutout.webp"
                alt="Clarvo students celebrating successful university admission and stream clarity"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-contain object-bottom pointer-events-none"
                priority={false}
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
