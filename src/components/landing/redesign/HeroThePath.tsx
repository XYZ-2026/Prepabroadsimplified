'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Compass, Sparkles, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import Button from './primitives/Button';

export default function HeroThePath() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const cutoutRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Reduced Motion Fallback: Snap immediately to static final state
      if (prefersReducedMotion) {
        gsap.set(
          [
            '.hero-headline-line',
            '.hero-stage-word',
            '.hero-cutout',
            '.hero-chip',
            '.hero-sub',
            '.hero-cta',
            '.hero-trust',
          ],
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
            clearProps: 'transform',
          }
        );
        return;
      }

      // Initial state of animating elements
      gsap.set('.hero-headline-line', { yPercent: 100 });
      gsap.set('.hero-stage-word', { scale: 1.1, opacity: 0 });
      gsap.set('.hero-cutout', { yPercent: 6, opacity: 0 });
      gsap.set('.hero-chip', { scale: 0.85, opacity: 0, y: 12 });
      gsap.set(['.hero-sub', '.hero-cta', '.hero-trust'], { opacity: 0, y: 16 });

      // 2. Build 5-step Entrance Timeline (~1.8s) per DESIGN.md section 3
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          // Enable mouse parallax strictly on fine-pointer devices after entrance finishes
          const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
          if (isFinePointer && !prefersReducedMotion) {
            setupMouseParallax();
          }
        },
      });

      // Step 1 (0.0s): Headline lines slide up out of masks, 80ms stagger
      tl.to('.hero-headline-line', {
        yPercent: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
      })
        // Step 2 (0.25s): "PATH" scales from 1.1 to 1 and fades in
        .to(
          '.hero-stage-word',
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.25
        )
        // Step 3 (0.45s): Photo rises 6% and fades in
        .to(
          '.hero-cutout',
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          0.45
        )
        // Step 4 (0.8s): Chips pop in one at a time
        .to(
          '.hero-chip',
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.12,
            ease: 'back.out(1.5)',
          },
          0.8
        )
        // Step 5 (1.15s): CTAs and trust row fade in
        .to(
          ['.hero-sub', '.hero-cta', '.hero-trust'],
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
          },
          1.15
        );

      // 3. Mouse Parallax on Fine Pointers Only (10px word, 18px photo)
      function setupMouseParallax() {
        const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const normX = (e.clientX - centerX) / (rect.width / 2);
          const normY = (e.clientY - centerY) / (rect.height / 2);

          const clampedX = Math.max(-1, Math.min(1, normX));
          const clampedY = Math.max(-1, Math.min(1, normY));

          // 10px on the word
          if (wordRef.current) {
            gsap.to(wordRef.current, {
              x: clampedX * 10,
              y: clampedY * 6,
              duration: 0.8,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }

          // 10px on the photo for subtle depth without text encroachment
          if (cutoutRef.current) {
            gsap.to(cutoutRef.current, {
              x: clampedX * 10,
              y: clampedY * 6,
              duration: 0.9,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }

          // Subtle chip parallax
          if (chipsRef.current) {
            gsap.to('.hero-chip', {
              x: clampedX * 14,
              y: clampedY * 8,
              duration: 1.0,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      aria-label="Clarvo Hero - Find the path that fits your child"
      className="relative w-full bg-[#F5F7FB] overflow-x-clip pt-3 sm:pt-6 lg:pt-8 pb-0 select-none flex flex-col justify-between min-h-[calc(100svh-62px)] sm:min-h-[calc(100svh-76px)] md:min-h-[calc(100svh-84px)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Layout Modes: Single column below 1024; 5/7 at 1024+ with right-aligned stage to prevent headline collisions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-end w-full">
          
          {/* ── LEFT COLUMN: Text Content ── */}
          <div className="w-full lg:col-span-5 xl:col-span-5 flex flex-col justify-center pt-2 sm:pt-6 lg:pt-8 pb-4 sm:pb-8 lg:pb-12 text-left z-20 pr-0 lg:pr-4">
            
            {/* Main Headline (DM Sans, 700, strictly sentence case per DESIGN.md Section 3) */}
            <h1 className="text-[clamp(2.35rem,4.2vw,3.75rem)] font-dmsans font-bold leading-[1.04] tracking-[-0.03em] text-[#12131C] max-w-[20ch]">
              <span className="block overflow-hidden pb-1">
                <span className="hero-headline-line block">Find the path</span>
              </span>{' '}
              <span className="block overflow-hidden pb-1">
                <span className="hero-headline-line block">that fits your</span>
              </span>{' '}
              <span className="block overflow-hidden pb-1">
                <span className="hero-headline-line block">child.</span>
              </span>
            </h1>

            {/* Subcopy (max 46ch, wrapped cleanly with clear margin from stage) */}
            <p className="hero-sub text-[15px] sm:text-[1.0625rem] leading-[1.6] text-[#5B6275] max-w-[46ch] mt-3.5 sm:mt-5 font-dmsans font-normal">
              Study abroad and Indian university admissions counselling, psychometric assessments, profile building and research programs, so students and parents choose a stream, career and university with evidence instead of guesswork.
            </p>

            {/* Action Buttons: Primary & Secondary */}
            <div className="hero-cta flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mt-5 sm:mt-7">
              <Button
                variant="primary"
                size="md"
                href="/auth?tab=register"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                elevated
              >
                Start free assessment
              </Button>

              <Button
                variant="secondary"
                size="md"
                href="/sample-reports"
                icon={<FileText className="w-4 h-4 text-[#1258DE]" />}
                iconPosition="left"
              >
                See a sample report
              </Button>
            </div>

            {/* Trust Metrics Row */}
            <div className="hero-trust grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#DDE3F0] pt-4 sm:pt-5 mt-6 sm:mt-8">
              <div>
                <div className="text-[17px] sm:text-[21px] font-dmsans font-bold text-[#12131C] tracking-tight">
                  15,000+
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#5B6275] mt-0.5 leading-tight">
                  guided
                </div>
              </div>
              <div>
                <div className="text-[17px] sm:text-[21px] font-dmsans font-bold text-[#12131C] tracking-tight">
                  100+
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#5B6275] mt-0.5 leading-tight">
                  careers
                </div>
              </div>
              <div>
                <div className="text-[17px] sm:text-[21px] font-dmsans font-bold text-[#12131C] tracking-tight">
                  98%
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-[#5B6275] mt-0.5 leading-tight">
                  parents clearer
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Stage (Photo + Centred PATH + Face-safe Chips) ── */}
          <div className="w-full lg:col-span-7 xl:col-span-7 flex flex-col items-center lg:items-end justify-end relative z-10 self-end overflow-visible">
            
            {/* Stage Wrapper: Sized responsively to column width without overflowing into the text column */}
            <div
              ref={stageRef}
              className="relative w-full max-w-[480px] sm:max-w-[620px] lg:max-w-[560px] xl:max-w-[760px] 2xl:max-w-[840px] flex flex-col items-center justify-end overflow-visible"
            >
              
              {/* Layer 1 (Back): Giant Anton word "PATH" centred behind photo, width equal to photo */}
              <div
                ref={wordRef}
                aria-hidden="true"
                className="hero-stage-word font-anton text-[#E6EDFF] select-none pointer-events-none absolute -top-4 sm:-top-8 md:-top-12 lg:-top-16 left-1/2 -translate-x-1/2 max-w-[calc(100vw-32px)] text-center text-[clamp(2.75rem,11.5vw,12rem)] leading-[0.8] tracking-tight sm:tracking-normal lg:tracking-wider z-0 overflow-visible"
                style={{ willChange: 'transform, opacity' }}
              >
                PATH
              </div>

              {/* Layer 2 (Middle): Group Photo Cutout flush on bottom with edge fade gradient mask */}
              <div
                ref={cutoutRef}
                className="hero-cutout relative z-10 w-full flex items-end justify-center pointer-events-none overflow-visible"
                style={{
                  willChange: 'transform, opacity',
                  maskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
                }}
              >
                <Image
                  src="/images/home/02-group-cutout.webp"
                  alt="CLARVO students exploring tailored career and academic streams"
                  width={1448}
                  height={1086}
                  priority
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto object-contain object-bottom drop-shadow-[0_16px_36px_rgba(18,88,222,0.12)]"
                />
              </div>

              {/* Layer 3 (Front): Floating Chips strictly within Face-Safe Zones across ALL views */}
              <div ref={chipsRef} className="absolute inset-0 w-full h-full pointer-events-none z-20">
                
                {/* Chip 1: Top band, left side (y = 0.5% <= 10%, strictly above faces) */}
                {/* Visible on Tablet portrait, Tablet landscape, Desktop; hidden on Mobile */}
                <div
                  className="hero-chip absolute top-[0.5%] left-[2%] sm:left-[3%] pointer-events-auto hidden md:block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E6EDFF] flex items-center justify-center shrink-0">
                      <Compass className="w-3 h-3 text-[#1258DE]" />
                    </div>
                    <div className="flex flex-col text-left whitespace-nowrap">
                      <span className="text-[10px] font-medium text-[#5B6275] leading-none">
                        Sample report
                      </span>
                      <span className="text-[12.5px] sm:text-[13px] font-dmsans font-bold text-[#12131C] leading-tight mt-0.5">
                        Stream fit: Science + Computing
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chip 2: Top band, right side (y = 0.5% <= 10%, strictly above faces) */}
                {/* Visible on Tablet portrait, Tablet landscape, Desktop; hidden on Mobile */}
                <div
                  className="hero-chip absolute top-[0.5%] right-[2%] sm:right-[3%] pointer-events-auto hidden md:block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#E6EDFF] flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-[#1258DE]" />
                    </div>
                    <div className="flex flex-col text-left whitespace-nowrap">
                      <span className="text-[10px] font-medium text-[#5B6275] leading-none">
                        Sample report
                      </span>
                      <span className="text-[12.5px] sm:text-[13px] font-dmsans font-bold text-[#12131C] leading-tight mt-0.5">
                        Strength: Analytical reasoning
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chip 3: Bottom band, right side (y = bottom 10%-13% >= 72%, strictly below faces across legs) */}
                {/* Visible on Mobile & Desktop/Landscape; Hidden on Tablet portrait per DESIGN.md Section 3 */}
                <div
                  className="hero-chip absolute bottom-[10%] sm:bottom-[13%] right-[2%] sm:right-[3%] pointer-events-auto block md:hidden lg:block max-w-[calc(100%-16px)]"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#1258DE] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex flex-col text-left whitespace-nowrap">
                      <span className="text-[10px] font-medium text-[#5B6275] leading-none">
                        Sample report
                      </span>
                      <span className="text-[12.5px] sm:text-[13px] font-dmsans font-bold text-[#12131C] leading-tight mt-0.5">
                        Next step: Talk to a counsellor
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
