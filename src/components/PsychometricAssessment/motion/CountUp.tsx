'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';

interface CountUpProps {
  value: number;
  delay?: number;
  duration?: number;
  /** Start only when true (e.g. tied to an in-view flag). */
  play?: boolean;
}

/**
 * Renders the final number on the server (readable without JS), then counts
 * up from 0 once `play` turns true. Uses the free `animate()` API, not AnimateNumber.
 */
export default function CountUp({ value, delay = 0, duration = 1, play = true }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !play || reduced) return;
    el.textContent = '0';
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, delay, duration, play, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
