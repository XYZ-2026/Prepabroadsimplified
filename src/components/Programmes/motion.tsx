'use client';

import React, { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';

/** The hero picture: the camera keeps moving in as the visitor scrolls away. */
export function ScrollCamera({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.18]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <m.div style={{ scale }} className="absolute inset-0">
        {children}
      </m.div>
    </div>
  );
}

const DIM = 0.4; // still 3:1 against navy, so unread words stay readable

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [DIM, 1]);
  return <m.span data-reveal="" style={{ opacity }}>{children} </m.span>;
}

/** A statement that lights up word by word as it is scrolled through. */
export function LitStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="m-0 max-w-[24ch] font-bold text-[clamp(2rem,5.6vw,4.5rem)] leading-[1.12] tracking-[-0.025em] text-white">
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}
