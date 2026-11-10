'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import MediaFrame from '@/components/landing/redesign/MediaFrame';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePointerFine } from '@/hooks/usePointerFine';
import {
  Route,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Users,
  CheckCircle,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AssessmentJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLineRef = useRef<SVGPathElement>(null);
  const mobileLineRef = useRef<SVGPathElement>(null);
  const stepNodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReducedMotion = useReducedMotion();
  const isPointerFine = usePointerFine();

  const journeyData = PSYCHOMETRIC_CONTENT.journey;
  const steps = journeyData.steps;

  // Step icons for visual anchor
  const stepIcons = [
    <ClipboardList key="1" className="w-4 h-4 text-clarvo-blue" />,
    <Sparkles key="2" className="w-4 h-4 text-clarvo-blue" />,
    <CheckCircle key="3" className="w-4 h-4 text-clarvo-blue" />,
    <Route key="4" className="w-4 h-4 text-clarvo-blue" />,
    <Users key="5" className="w-4 h-4 text-clarvo-blue" />,
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    if (prefersReducedMotion) {
      if (desktopLineRef.current) {
        desktopLineRef.current.style.strokeDashoffset = '0';
      }
      if (mobileLineRef.current) {
        mobileLineRef.current.style.strokeDashoffset = '0';
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Desktop horizontal SVG line draw on section enter
      if (desktopLineRef.current) {
        const line = desktopLineRef.current;
        const length = line.getTotalLength ? line.getTotalLength() : 1000;
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 2. Mobile vertical SVG line draw
      if (mobileLineRef.current) {
        const line = mobileLineRef.current;
        const length = line.getTotalLength ? line.getTotalLength() : 1000;
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 3. Staggered reveal of step nodes
      const validNodes = stepNodesRef.current.filter(Boolean);
      if (validNodes.length > 0) {
        gsap.fromTo(
          validNodes,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      id="journey"
      aria-label="The Assessment Journey"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-line text-left overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky border border-line text-[13px] font-bold text-clarvo-blue font-dmsans">
            <Route className="w-3.5 h-3.5" />
            <span>{journeyData.sectionChip}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-dmsans text-ink tracking-tight leading-[1.15]">
            {journeyData.sectionHeadline}
          </h2>

          <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed">
            {journeyData.sectionSubcopy}
          </p>
        </div>

        {/* ── DESKTOP HORIZONTAL TIMELINE (>= 1024px) ── */}
        <div className="hidden lg:block relative mb-16">
          
          {/* Animated Connecting SVG Line */}
          <div className="absolute top-[22px] left-[5%] right-[5%] h-[3px] pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 3"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Background Guide Line */}
              <line
                x1="0"
                y1="1.5"
                x2="1000"
                y2="1.5"
                stroke="#DDE3F0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Animated Progress Line */}
              <path
                ref={desktopLineRef}
                d="M 0 1.5 L 1000 1.5"
                stroke="#1258DE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 5-Step Columns */}
          <div className="grid grid-cols-5 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const hasPhoto = Boolean(item.photo);

              return (
                <div
                  key={item.step}
                  ref={(el) => {
                    stepNodesRef.current[idx] = el;
                  }}
                  className="flex flex-col items-start space-y-3.5 group"
                >
                  {/* Step Badge Node */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white border-2 border-clarvo-blue text-clarvo-blue font-bold text-[14px] flex items-center justify-center shadow-sm group-hover:bg-clarvo-blue group-hover:text-white transition-all duration-300">
                      <span>{item.step}</span>
                    </div>
                  </div>

                  {/* Step Eyebrow & Title */}
                  <div className="space-y-1">
                    <span className="text-[12px] font-bold text-clarvo-blue block">
                      Step {item.step}
                    </span>
                    <h3 className="text-[17px] font-bold font-dmsans text-ink leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Step Plain Description */}
                  <p className="text-[13.5px] text-muted font-dmsans leading-relaxed">
                    {item.description}
                  </p>

                  {/* Photos on Steps 2, 4, 5 (MediaFrame cover 16/10) */}
                  {item.photo && (
                    <div className="w-full pt-1">
                      <MediaFrame
                        src={item.photo}
                        alt={item.photoAlt || item.title}
                        mode="cover"
                        ratioDesktop="16/10"
                        ratioTablet="16/10"
                        backdrop="paper"
                        className="w-full shadow-xs hover:shadow-md transition-shadow duration-300"
                      />
                    </div>
                  )}

                  {/* Contextual baseline card for steps without photo (Steps 1 & 3) */}
                  {!item.photo && (
                    <div className="w-full p-3.5 rounded-2xl bg-paper border border-line text-[12.5px] text-muted leading-relaxed space-y-2 mt-auto">
                      <div className="flex items-center gap-1.5 text-clarvo-blue font-semibold text-[12px]">
                        {stepIcons[idx]}
                        <span>
                          {idx === 0 ? 'Intake framework' : 'Synthesis matrix'}
                        </span>
                      </div>
                      <p>{item.highlight}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE & TABLET VERTICAL TIMELINE (< 1024px) ── */}
        <div className="lg:hidden relative space-y-10 pl-6 sm:pl-8 mb-12">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-[2px] pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 2 1000"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="1000"
                stroke="#DDE3F0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                ref={mobileLineRef}
                d="M 1 0 L 1 1000"
                stroke="#1258DE"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Vertical Step Items */}
          {steps.map((item, idx) => {
            const hasPhoto = Boolean(item.photo);

            return (
              <div
                key={item.step}
                className="relative flex items-start gap-4 sm:gap-6 z-10"
              >
                {/* Step Circle Indicator on the Left Rail */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-clarvo-blue text-clarvo-blue font-bold text-[14px] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span>{item.step}</span>
                </div>

                {/* Right Content Block */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-clarvo-blue bg-sky px-2.5 py-0.5 rounded-full">
                      Step {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-ink leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-[15px] sm:text-[16px] text-muted font-dmsans leading-relaxed">
                    {item.description}
                  </p>

                  {/* Photo for Steps 2, 4, 5 */}
                  {item.photo && (
                    <div className="w-full max-w-md pt-2">
                      <MediaFrame
                        src={item.photo}
                        alt={item.photoAlt || item.title}
                        mode="cover"
                        ratioDesktop="16/10"
                        ratioTablet="16/10"
                        backdrop="paper"
                        className="w-full shadow-xs"
                      />
                    </div>
                  )}

                  {/* Highlights for steps 1 & 3 */}
                  {!item.photo && item.highlight && (
                    <div className="p-3.5 rounded-2xl bg-paper border border-line text-[13px] text-muted leading-relaxed max-w-md mt-2">
                      <span className="font-semibold text-ink block mb-0.5">
                        {idx === 0 ? 'Intake baseline:' : 'Analytical frameworks:'}
                      </span>
                      {item.highlight}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-paper border border-line flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold font-dmsans text-ink">
              Ready to take step 1?
            </h4>
            <p className="text-[14px] sm:text-[15px] text-muted font-dmsans">
              Thirty structured modules, untimed format, designed for students in Grades 7 to 12.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/psychometric-test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-bold text-white bg-clarvo-blue hover:bg-clarvo-blue/90 shadow-sm transition-all"
            >
              <span>Start assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
