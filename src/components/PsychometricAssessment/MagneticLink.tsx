'use client';

import React from 'react';
import Link from 'next/link';
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import { usePointerFine } from '@/hooks/usePointerFine';

interface MagneticLinkProps {
  href: string;
  label: string;
  /** Data attribute other components look for (e.g. the sticky bar watches `data-final-cta`). */
  marker?: string;
  className?: string;
}

/** White pill button that leans toward the pointer on fine-pointer devices. Used on blue CTA panels. */
export default function MagneticLink({ href, label, marker = 'data-final-cta', className = '' }: MagneticLinkProps) {
  const isFine = usePointerFine();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!isFine || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  return (
    <m.span style={{ x: sx, y: sy }} className="inline-flex">
      <Link
        href={href}
        onPointerMove={onMove}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        {...{ [marker]: '' }}
        className={`w-full inline-flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-full whitespace-nowrap text-[16px] font-bold text-clarvo-blue bg-white hover:bg-sky transition-colors no-underline ${className}`}
      >
        <CalendarDays className="w-[18px] h-[18px]" aria-hidden="true" />
        {label}
      </Link>
    </m.span>
  );
}
