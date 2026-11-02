'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Compass, Sparkles, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import Button from './primitives/Button';

export default function HeroThePath() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const cutoutRef = useRef<HTMLDivElement>(null);
  const pathLineRef = useRef<SVGPathElement>(null);
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
            '.hero-path-line',
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
        if (pathLineRef.current) {
          const length = pathLineRef.current.getTotalLength();
          pathLineRef.current.style.strokeDasharray = `${length}`;
          pathLineRef.current.style.strokeDashoffset = '0';
        }
        return;
      }

      const isMobile = window.innerWidth < 768;

      // 2. Prepare SVG path line dash properties
      if (pathLineRef.current) {
        const length = pathLineRef.current.getTotalLength();
        gsap.set(pathLineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }

      // Initial state of animating elements
      gsap.set('.hero-headline-line', { yPercent: 100 });
      gsap.set('.hero-stage-word', { scale: 1.12, opacity: 0 });
      gsap.set('.hero-cutout', { yPercent: 8, opacity: 0 });
      gsap.set('.hero-chip', { scale: 0.8, opacity: 0, y: 15 });
      gsap.set(['.hero-sub', '.hero-cta', '.hero-trust'], { opacity: 0, y: 16 });

      // 3. Build Entrance Timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          // Enable desktop-only mouse parallax after load sequence completes
          if (!isMobile && !prefersReducedMotion) {
            setupMouseParallax();
          }
        },
      });

      if (isMobile) {
        // Shortened sequence for mobile (~1.4s)
        tl.to('.hero-headline-line', {
          yPercent: 0,
          duration: 0.45,
          stagger: 0.06,
        })
          .to(
            '.hero-sub',
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            '-=0.2'
          )
          .to(
            '.hero-cta',
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            '-=0.15'
          )
          .to(
            '.hero-trust',
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
            '-=0.15'
          )
          .to(
            '.hero-stage-word',
            { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.2'
          )
          .to(
            '.hero-cutout',
            { yPercent: 0, opacity: 1, duration: 0.55 },
            '-=0.35'
          )
          .to(
            '.hero-path-line',
            { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' },
            '-=0.3'
          )
          .to(
            '.hero-chip',
            { scale: 1, opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'back.out(1.4)' },
            '-=0.4'
          );
      } else {
        // Full Desktop Sequence as specified in DESIGN.md section 5, item 1 (approx 2.2s)
        // 0.0s: headline lines slide up out of masks, 80ms stagger
        tl.to('.hero-headline-line', {
          yPercent: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
        })
          // 0.3s: "PATH" scales from 1.12 to 1 and fades in
          .to(
            '.hero-stage-word',
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
            },
            0.3
          )
          // 0.5s: student cutout rises 8% and fades in
          .to(
            '.hero-cutout',
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
            },
            0.5
          )
          // 0.9s: path line draws while chips pop in
          .to(
            '.hero-path-line',
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: 'power2.inOut',
            },
            0.9
          )
          .to(
            '.hero-chip',
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.15,
              ease: 'back.out(1.5)',
            },
            0.9
          )
          // 1.4s: CTAs and trust row fade in
          .to(
            ['.hero-sub', '.hero-cta', '.hero-trust'],
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
            },
            1.4
          );
      }

      // 4. Desktop Mouse Parallax (±12px word, ±22px cutout, ±36px chips)
      function setupMouseParallax() {
        const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const normX = (e.clientX - centerX) / (rect.width / 2);
          const normY = (e.clientY - centerY) / (rect.height / 2);

          // Clamped normalized ratios (-1 to 1)
          const clampedX = Math.max(-1, Math.min(1, normX));
          const clampedY = Math.max(-1, Math.min(1, normY));

          // ±12px word
          if (wordRef.current) {
            gsap.to(wordRef.current, {
              x: clampedX * 12,
              y: clampedY * 8,
              duration: 0.8,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }

          // ±22px cutout
          if (cutoutRef.current) {
            gsap.to(cutoutRef.current, {
              x: clampedX * 22,
              y: clampedY * 12,
              duration: 0.9,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }

          // ±36px chips
          if (chipsRef.current) {
            gsap.to('.hero-chip', {
              x: clampedX * 36,
              y: clampedY * 20,
              duration: 1.1,
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
      className="relative w-full bg-[#F5F7FB] overflow-hidden pt-4 sm:pt-8 lg:pt-10 select-none border-b border-[#DDE3F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          
          {/* ── LEFT COLUMN: Text in 5 columns, left-aligned ── */}
          <div className="lg:col-span-5 flex flex-col justify-center pt-4 sm:pt-8 lg:pt-12 pb-6 sm:pb-12 lg:pb-16 text-left z-20">
            
            {/* Main Headline (DM Sans, 700, strictly sentence case per DESIGN.md) */}
            <h1 className="text-[clamp(2.35rem,4.8vw,3.85rem)] font-dmsans font-bold leading-[1.03] tracking-[-0.03em] text-[#12131C]">
              <span className="block overflow-hidden pb-1">
                <span className="hero-headline-line block">Find the path</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-headline-line block">that fits your child.</span>
              </span>
            </h1>

            {/* Subcopy (2 lines on desktop, max 54ch) */}
            <p className="hero-sub text-[15px] sm:text-[1.0625rem] leading-[1.6] text-[#5B6275] max-w-[54ch] mt-3.5 sm:mt-5 font-dmsans font-normal">
              Scientific assessments, expert counsellors and a clear roadmap, so students and parents choose a stream, career and university with evidence instead of guesswork.
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

            {/* Trust Metrics Row (Reuse verified site metrics) */}
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

          {/* ── RIGHT COLUMN: Stage in 7 columns ── */}
          <div
            ref={stageRef}
            className="lg:col-span-7 relative w-full h-[360px] sm:h-[480px] lg:h-[580px] flex items-end justify-center overflow-visible"
          >
            {/* Layer 1 (Back): Giant Anton word "PATH" in sky colour (#E6EDFF) */}
            <div
              ref={wordRef}
              aria-hidden="true"
              className="hero-stage-word font-anton text-[#E6EDFF] select-none pointer-events-none text-[clamp(7.5rem,21vw,16.5rem)] leading-[0.82] tracking-wider absolute top-2 sm:top-6 left-1/2 -translate-x-1/2 z-0"
              style={{ willChange: 'transform, opacity' }}
            >
              PATH
            </div>

            {/* Layer 2 (Middle-Back): Student cutout anchored to hero bottom */}
            <div
              ref={cutoutRef}
              className="hero-cutout relative z-10 w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[650px] flex items-end justify-center pointer-events-none"
              style={{ willChange: 'transform, opacity' }}
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

            {/* Layer 3 (Middle-Front): Curving SVG Path Line */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              viewBox="0 0 600 500"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="heroPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1258DE" stopOpacity="0.2" />
                  <stop offset="45%" stopColor="#1258DE" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#1258DE" stopOpacity="0.75" />
                </linearGradient>
                <filter id="heroPathGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                ref={pathLineRef}
                className="hero-path-line"
                d="M 60 410 C 130 380, 150 290, 240 270 C 330 250, 360 370, 470 300 C 520 265, 545 190, 565 140"
                stroke="url(#heroPathGrad)"
                strokeWidth="2.75"
                strokeLinecap="round"
                filter="url(#heroPathGlow)"
              />
            </svg>

            {/* Layer 4 (Front): Floating Chips */}
            <div ref={chipsRef} className="absolute inset-0 w-full h-full pointer-events-none z-30">
              
              {/* Chip 1: Stream fit (Top/Mid-Left) */}
              <div
                className="hero-chip absolute top-[38%] sm:top-[34%] left-[2%] sm:left-[5%] pointer-events-auto"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3 sm:px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E6EDFF] flex items-center justify-center shrink-0">
                    <Compass className="w-3 h-3 text-[#1258DE]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#5B6275] leading-none">
                      Sample report
                    </span>
                    <span className="text-[11.5px] sm:text-[12.5px] font-dmsans font-bold text-[#12131C] leading-tight">
                      Stream fit: Science + Computing
                    </span>
                  </div>
                </div>
              </div>

              {/* Chip 2: Strength (Top-Right) */}
              <div
                className="hero-chip absolute top-[18%] sm:top-[20%] right-[3%] sm:right-[6%] pointer-events-auto"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3 sm:px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E6EDFF] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-[#1258DE]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#5B6275] leading-none">
                      Sample report
                    </span>
                    <span className="text-[11.5px] sm:text-[12.5px] font-dmsans font-bold text-[#12131C] leading-tight">
                      Strength: Analytical reasoning
                    </span>
                  </div>
                </div>
              </div>

              {/* Chip 3: Next Step (Bottom-Right, Hidden on mobile below 768px as requested) */}
              <div
                className="hero-chip absolute bottom-[18%] sm:bottom-[15%] right-[2%] sm:right-[4%] pointer-events-auto hidden sm:block"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#DDE3F0] rounded-full px-3.5 py-1.5 shadow-[0_12px_28px_-8px_rgba(18,88,222,0.22)] flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1258DE] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#5B6275] leading-none">
                      Sample report
                    </span>
                    <span className="text-[12.5px] font-dmsans font-bold text-[#12131C] leading-tight">
                      Next step: Talk to a counsellor
                    </span>
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

