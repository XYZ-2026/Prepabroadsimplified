'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Info } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhatItIsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const strikeLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const isItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  const content = PSYCHOMETRIC_CONTENT.whatItIs;

  useEffect(() => {
    // If reduced motion is requested, show final static state immediately
    if (prefersReduced) {
      strikeLinesRef.current.forEach((line) => {
        if (line) line.style.transform = 'scaleX(1)';
      });
      isItemsRef.current.forEach((item) => {
        if (item) {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      const strikeLines = strikeLinesRef.current.filter(Boolean) as HTMLDivElement[];
      const isItems = isItemsRef.current.filter(Boolean) as HTMLLIElement[];

      // Initial state
      strikeLines.forEach((line) => {
        gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
      });
      isItems.forEach((item) => {
        gsap.set(item, { opacity: 0, y: 14 });
      });

      // Timeline triggered when section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // 1. Draw strike-through lines across "It is not" items (staggered 80ms)
      tl.to(strikeLines, {
        scaleX: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
      });

      // 2. Then fade in "It is" items with 60ms stagger
      tl.to(
        isItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
        },
        '+=0.08'
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="What is a Psychometric Assessment"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky border border-line text-[13px] font-bold text-clarvo-blue font-dmsans">
            <Info className="w-3.5 h-3.5" />
            <span>Educational foundations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-dmsans text-ink tracking-tight leading-[1.15]">
            {content.headline}
          </h2>

          <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed">
            {content.subcopy}
          </p>
        </div>

        {/* 2-Column Comparison Split: Ink and Clarvo-Blue only. Zero red or green. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* ── LEFT COLUMN: WHAT A PSYCHOMETRIC ASSESSMENT IS ── */}
          <div className="p-7 sm:p-9 rounded-2xl bg-sky/40 border border-line flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-clarvo-blue">
                  A psychometric assessment is
                </h3>
                <span className="text-[12px] font-bold text-clarvo-blue bg-white border border-line px-2.5 py-1 rounded-full">
                  Guidance
                </span>
              </div>

              <ul className="space-y-4 sm:space-y-5">
                {content.isList.map((item, idx) => (
                  <li
                    key={idx}
                    ref={(el) => {
                      isItemsRef.current[idx] = el;
                    }}
                    className="flex items-start gap-3.5 text-[17px] sm:text-[18px] text-ink font-dmsans leading-snug"
                    style={{
                      opacity: prefersReduced ? 1 : 0,
                      transform: prefersReduced ? 'none' : 'translateY(14px)',
                    }}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-clarvo-blue text-white shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-line/60 text-[13px] text-muted font-medium">
              Designed specifically to evaluate natural cognitive habits and learning preferences.
            </div>
          </div>

          {/* ── RIGHT COLUMN: IT IS NOT ── */}
          <div className="p-7 sm:p-9 rounded-2xl bg-paper border border-line flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold font-dmsans text-muted">
                  It is not
                </h3>
                <span className="text-[12px] font-bold text-muted bg-white border border-line px-2.5 py-1 rounded-full">
                  Not Evaluative
                </span>
              </div>

              <ul className="space-y-4 sm:space-y-5">
                {content.isNotList.map((item, idx) => (
                  <li
                    key={idx}
                    className="relative flex items-start gap-3.5 text-[17px] sm:text-[18px] text-muted font-dmsans leading-snug"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-line text-muted shrink-0 mt-0.5">
                      <span className="w-2 h-0.5 bg-muted rounded-full" />
                    </span>
                    
                    {/* Text Container with Animated Strike-through */}
                    <div className="relative inline-block">
                      <span className="select-none">{item}</span>
                      {/* Crisp Strike-through bar */}
                      <div
                        ref={(el) => {
                          strikeLinesRef.current[idx] = el;
                        }}
                        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2.5px] rounded-full pointer-events-none"
                        style={{
                          backgroundColor: '#5B6275',
                          transform: prefersReduced ? 'scaleX(1)' : 'scaleX(0)',
                          transformOrigin: 'left center',
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-line/60 text-[13px] text-muted font-medium">
              Does not define intellectual ceilings or assign clinical diagnostic labels.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
