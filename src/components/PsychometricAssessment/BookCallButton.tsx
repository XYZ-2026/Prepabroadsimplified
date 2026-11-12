'use client';

import React from 'react';
import Link from 'next/link';
import { m } from 'motion/react';
import { CalendarDays, Video } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT, bookCallHref } from '@/content/psychometricContent';
import { springUi } from './motion/tokens';

const { label, note } = PSYCHOMETRIC_CONTENT.bookCall;

interface BookCallButtonProps {
  /** Where on the page this button sits. Recorded with the booking as `psychometric-assessment:<placement>`. */
  placement: string;
  /** `solid` on light backgrounds, `white` on the blue panel. */
  variant?: 'solid' | 'white';
  /** The sticky mobile bar watches the hero button; the hero marks its visible copy. */
  heroMarker?: boolean;
  className?: string;
}

/**
 * The page's one primary action. The assessment is paid and unlocked by a counsellor, so the
 * only way in is a counselling call: no other primary button should exist on this page.
 */
export default function BookCallButton({ placement, variant = 'solid', heroMarker = false, className = '' }: BookCallButtonProps) {
  const tone =
    variant === 'solid'
      ? 'text-white bg-clarvo-blue hover:bg-[#0F47B8] shadow-clarvo-elevated'
      : 'text-clarvo-blue bg-white hover:bg-sky';

  return (
    <m.span whileTap={{ scale: 0.97 }} transition={springUi} className={`inline-flex ${className}`}>
      <Link
        href={bookCallHref(placement)}
        {...(heroMarker ? { 'data-hero-cta': '' } : {})}
        className={`w-full inline-flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-full whitespace-nowrap text-[16px] font-bold transition-colors no-underline ${tone}`}
      >
        <CalendarDays className="w-[18px] h-[18px]" aria-hidden={true} />
        {label}
      </Link>
    </m.span>
  );
}

/** Reassurance line under the button, using only a fact already on the site. */
export function BookCallNote({ tone = 'muted', className = '' }: { tone?: 'muted' | 'light'; className?: string }) {
  return (
    <p className={`flex items-center gap-1.5 text-[14px] m-0 ${tone === 'light' ? 'text-white/85' : 'text-muted'} ${className}`}>
      <Video className={`w-4 h-4 shrink-0 ${tone === 'light' ? 'text-white' : 'text-clarvo-blue'}`} aria-hidden={true} />
      {note}
    </p>
  );
}
