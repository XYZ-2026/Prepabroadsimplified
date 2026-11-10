'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import {
  Compass,
  ArrowRight,
  FileText,
  UserCheck,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReduced = useReducedMotion();

  const heroData = PSYCHOMETRIC_CONTENT.hero;
  const factsData = PSYCHOMETRIC_CONTENT.facts;

  useEffect(() => {
    // If reduced motion is requested, instantly set final state
    if (prefersReduced) {
      return;
    }

    const ctx = gsap.context(() => {
      const h1Lines = headlineRef.current?.querySelectorAll('.h1-line-inner');
      const photoEl = photoRef.current;
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];

      // Initial states
      if (h1Lines && h1Lines.length > 0) {
        gsap.set(h1Lines, { y: '105%', opacity: 0 });
      }
      if (photoEl) {
        gsap.set(photoEl, { y: '5%', opacity: 0 });
      }

      // GSAP Sequence
      const tl = gsap.timeline({
        delay: 0.05,
        defaults: { ease: 'power3.out' },
      });

      // 1. H1 lines slide up from masks (80ms stagger, expo.out)
      if (h1Lines && h1Lines.length > 0) {
        tl.to(
          h1Lines,
          {
            y: '0%',
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'expo.out',
          },
          0
        );
      }

      // 2. Photo rises smoothly and fades in
      if (photoEl) {
        tl.to(
          photoEl,
          {
            y: '0%',
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          0.15
        );
      }

      // 3. Three-step line highlights each step in turn, then rests
      if (steps.length > 0) {
        steps.forEach((step, i) => {
          const startTime = 0.6 + i * 0.12;
          tl.to(
            step,
            {
              backgroundColor: '#E6EDFF', // sky
              borderColor: '#1258DE', // clarvo-blue
              scale: 1.03,
              duration: 0.12,
              ease: 'power1.out',
            },
            startTime
          );
          tl.to(
            step,
            {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              scale: 1,
              duration: 0.15,
              ease: 'power1.in',
            },
            startTime + 0.12
          );
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReduced]);

  return (
    <section
      ref={containerRef}
      aria-label="CLARVO Psychometric Assessment Overview"
      className="relative w-full bg-paper border-b border-line pt-6 sm:pt-8 lg:pt-10 pb-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 items-end">
          
          {/* ── LEFT COLUMN: COPY, CTAS, 3-STEP LINE, FACTS ── */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-5 pb-8 sm:pb-10 lg:pb-12 text-left z-10">
            {/* Chip: Sentence case */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky border border-line text-[13px] font-bold text-clarvo-blue font-dmsans">
              <Compass className="w-3.5 h-3.5" />
              <span>{heroData.chip}</span>
            </div>

            {/* H1 Headline with Line-Mask Wrappers */}
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold font-dmsans text-ink tracking-tight leading-[1.12]"
            >
              <span className="block overflow-hidden py-0.5">
                <span className="h1-line-inner block">
                  Know how your child
                </span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span className="h1-line-inner block text-clarvo-blue">
                  thinks, learns and decides.
                </span>
              </span>
            </h1>

            {/* Subcopy: >= 17px body */}
            <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed max-w-xl">
              {heroData.subcopy}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary CTA */}
              <Link
                href={heroData.ctas.primary.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] sm:text-[15px] font-bold text-white bg-clarvo-blue hover:bg-[#0F47B8] shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>{heroData.ctas.primary.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA */}
              <a
                href={heroData.ctas.secondary.href}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] sm:text-[15px] font-bold text-ink bg-white hover:bg-sky border border-line transition-all active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-clarvo-blue" />
                <span>{heroData.ctas.secondary.label}</span>
              </a>

              {/* Tertiary Text Link */}
              <Link
                href={heroData.ctas.tertiary.href}
                className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-muted hover:text-ink transition-colors px-2 py-2"
              >
                <span>{heroData.ctas.tertiary.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-clarvo-blue" />
              </Link>
            </div>

            {/* ── THREE-STEP LINE UNDER CTAS ── */}
            <div className="pt-1">
              <div className="inline-flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 xl:gap-2 p-1.5 rounded-2xl bg-white/70 border border-line/80 backdrop-blur-xs text-ink w-full sm:w-auto max-w-full">
                {heroData.threeStepLine.map((stepItem, idx) => {
                  const icons = [
                    <UserCheck key="1" className="w-4 h-4 text-clarvo-blue shrink-0" />,
                    <Sparkles key="2" className="w-4 h-4 text-clarvo-blue shrink-0" />,
                    <MapPin key="3" className="w-4 h-4 text-clarvo-blue shrink-0" />,
                  ];

                  return (
                    <React.Fragment key={stepItem.step}>
                      <div
                        ref={(el) => {
                          stepRefs.current[idx] = el;
                        }}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-transparent transition-all"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky text-[12px] font-bold text-clarvo-blue shrink-0">
                          {stepItem.step}
                        </span>
                        {icons[idx]}
                        <span className="text-[12px] sm:text-[12.5px] xl:text-[13px] font-medium text-ink whitespace-nowrap">
                          {stepItem.label}
                        </span>
                      </div>
                      {idx < heroData.threeStepLine.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-muted/60 shrink-0 hidden sm:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ── FACTS STRIP (Section 4 Spec) ── */}
            <div className="pt-5 border-t border-line flex flex-wrap items-center gap-4 sm:gap-6 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-ink font-dmsans">
                  {factsData.modulesCount}
                </div>
                <div className="text-[13px] text-muted font-medium">
                  Modules
                </div>
              </div>

              <div className="h-8 w-px bg-line hidden sm:block" />

              <div>
                <div className="text-xl sm:text-2xl font-bold text-ink font-dmsans">
                  {factsData.phasesCount}
                </div>
                <div className="text-[13px] text-muted font-medium">
                  Phases
                </div>
              </div>

              {/* Class 10 Full Report Pages (Verified) */}
              {factsData.grade10FullReportPages && (
                <>
                  <div className="h-8 w-px bg-line hidden sm:block" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-ink font-dmsans">
                      {factsData.grade10FullReportPages}-page
                    </div>
                    <div className="text-[13px] text-muted font-medium">
                      Class 10 report
                    </div>
                  </div>
                </>
              )}

              {/* Optional Owner Facts rendered ONLY when provided */}
              {factsData.testDuration && (
                <>
                  <div className="h-8 w-px bg-line hidden sm:block" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-ink font-dmsans">
                      {factsData.testDuration}
                    </div>
                    <div className="text-[13px] text-muted font-medium">
                      Duration
                    </div>
                  </div>
                </>
              )}

              {factsData.numberOfQuestions && (
                <>
                  <div className="h-8 w-px bg-line hidden sm:block" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-ink font-dmsans">
                      {factsData.numberOfQuestions}
                    </div>
                    <div className="text-[13px] text-muted font-medium">
                      Questions
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN: LARGE, PROMINENT PHOTO CUTOUT (NO OVERLAYS COVERING IT) ── */}
          <div className="lg:col-span-5 xl:col-span-6 relative w-full flex items-end justify-center lg:justify-end self-end">
            <div
              ref={photoRef}
              className="relative w-full max-w-[620px] lg:max-w-none flex items-end justify-center lg:justify-end self-end"
            >
              {/* Photo Container: Flush bottom, prominent size matching left column */}
              <div
                className="relative w-full flex items-end justify-center lg:justify-end overflow-visible"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)',
                }}
              >
                <Image
                  src="/images/psychometric/psy-01-hero-family-cutout.webp"
                  alt="Parent and student reviewing psychometric insights on a laptop"
                  width={1536}
                  height={1024}
                  priority
                  className="w-full h-auto object-contain object-bottom select-none block max-h-[500px] sm:max-h-[560px] lg:max-h-[580px] xl:max-h-[640px]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
