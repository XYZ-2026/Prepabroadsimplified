'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatDef {
  targetValue: number;
  prefix?: string;
  suffix: string;
  label: string;
  sub: string;
  accent?: boolean;
}

const STATS_DATA: StatDef[] = [
  {
    targetValue: 15000,
    suffix: '+',
    label: 'Students guided',
    sub: 'Across CBSE, ICSE, IB & Cambridge',
    accent: true,
  },
  {
    targetValue: 30,
    suffix: '+',
    label: 'Evaluation modules',
    sub: 'Multi-dimensional cognitive battery',
  },
  {
    targetValue: 100,
    suffix: '+',
    label: 'Career specialisations',
    sub: 'Mapped to 500+ global universities',
    accent: true,
  },
  {
    targetValue: 98,
    suffix: '%',
    label: 'Parent clarity rating',
    sub: 'Evidence-backed family alignment',
  },
];

export default function StatsStripCountup() {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotionPreference();
  const [animatedValues, setAnimatedValues] = useState<number[]>([15000, 30, 100, 98]);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || hasTriggeredRef.current) {
      setAnimatedValues([15000, 30, 100, 98]);
      return;
    }

    // Set initial values to 0 for countup
    setAnimatedValues([0, 0, 0, 0]);

    const obj = { val0: 0, val1: 0, val2: 0, val3: 0 };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        hasTriggeredRef.current = true;
        gsap.to(obj, {
          val0: 15000,
          val1: 30,
          val2: 100,
          val3: 98,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            setAnimatedValues([
              Math.round(obj.val0),
              Math.round(obj.val1),
              Math.round(obj.val2),
              Math.round(obj.val3),
            ]);
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      aria-label="Clarvo Key Statistics"
      className="w-full bg-[#171822] border-y border-[#262838] relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#262838]">
          {STATS_DATA.map((item, idx) => {
            const currentNum = animatedValues[idx] ?? item.targetValue;
            const formatted =
              item.targetValue >= 1000
                ? currentNum.toLocaleString('en-US')
                : currentNum.toString();

            return (
              <div
                key={item.label}
                className={`py-8 sm:py-10 px-4 sm:px-6 text-center flex flex-col items-center justify-center ${
                  idx % 2 === 0 ? 'border-r sm:border-r-0 lg:border-r border-[#262838]' : ''
                } ${idx < 2 ? 'border-b sm:border-b-0 border-[#262838]' : ''}`}
              >
                {/* Number Display with Anton or DM Sans */}
                <div
                  className={`text-[clamp(2.25rem,4.5vw,3.75rem)] font-dmsans font-bold leading-none tracking-tight ${
                    item.accent ? 'text-[#E6EDFF]' : 'text-white'
                  }`}
                >
                  <span>{formatted}</span>
                  <span className="text-[#1258DE]">{item.suffix}</span>
                </div>

                {/* Metric Label (Sentence case, DM Sans) */}
                <div className="mt-2.5 text-[13px] sm:text-[14px] font-dmsans font-bold text-white tracking-normal">
                  {item.label}
                </div>

                {/* Subtext */}
                <div className="mt-1 text-[11px] sm:text-[12px] font-dmsans text-[#8D96AA] font-normal leading-snug max-w-[24ch]">
                  {item.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

