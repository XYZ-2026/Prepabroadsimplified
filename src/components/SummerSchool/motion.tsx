'use client';

import React, { useEffect, useRef } from 'react';
import { animate, m, useInView, useReducedMotion } from 'motion/react';
import { EASE_OUT, VIEWPORT } from '@/components/PsychometricAssessment/motion/tokens';

/** "15,000+" counts up once when it scrolls into view. The full value is in the HTML for search and no-JS. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduced || !el) return;
    const controls = animate(0, Number(value.replace(/\D/g, '')), {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (n) => {
        el.textContent = `${Math.round(n).toLocaleString('en-US')}+`;
      },
    });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, reduced, value]);

  return <span ref={ref}>{value}</span>;
}

function DrawnPath({ d, delay = 0, ...rest }: { d: string; delay?: number; strokeWidth: number }) {
  return (
    <m.path
      data-reveal-path=""
      d={d}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay, ease: EASE_OUT }}
      {...rest}
    />
  );
}

/** Words with a hand-drawn line under them that draws itself once. */
export function Underlined({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-clarvo-blue">
      {children}
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className="absolute left-0 -bottom-[0.2em] w-full h-[0.22em] overflow-visible">
        <DrawnPath d="M2 8 C 40 2, 60 11, 100 6 S 160 3, 198 7" strokeWidth={4} delay={0.15} />
      </svg>
    </span>
  );
}

/** Curved arrow pointing left, from the heading to the card beside it. */
export function CurvedArrow() {
  return (
    <svg viewBox="0 0 160 90" aria-hidden="true" className="w-40 h-auto text-[var(--ss-light)]">
      <DrawnPath d="M150 82 C 140 30, 80 10, 14 34" strokeWidth={5} />
      <DrawnPath d="M34 14 L 12 35 L 40 48" strokeWidth={5} delay={0.3} />
    </svg>
  );
}

/** Two halves coming together: shows that one adds to the other. */
export function JoinFrom({ side, children, className }: { side: 'left' | 'right'; children: React.ReactNode; className: string }) {
  return (
    <m.div
      data-reveal=""
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </m.div>
  );
}
