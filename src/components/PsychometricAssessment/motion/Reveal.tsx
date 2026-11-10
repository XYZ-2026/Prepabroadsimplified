'use client';

import React from 'react';
import { m } from 'motion/react';
import { enterHidden, enterShown, enterTransition, STAGGER, VIEWPORT } from './tokens';

type RevealTag = 'div' | 'li' | 'p' | 'h2' | 'h3' | 'span' | 'ul';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Position in a staggered group; multiplies the stagger token. */
  index?: number;
  delay?: number;
  children: React.ReactNode;
}

/**
 * The default `enter` motion: fade in and rise 16px once, when in view.
 * `data-reveal` lets psychometric.css force the final state when JS is off
 * or the visitor prefers reduced motion.
 */
export default function Reveal({ as = 'div', index = 0, delay = 0, children, ...rest }: RevealProps) {
  const Tag = m[as] as React.ElementType;
  return (
    <Tag
      data-reveal=""
      initial={enterHidden}
      whileInView={enterShown}
      viewport={VIEWPORT}
      transition={{ ...enterTransition, delay: delay + index * STAGGER }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
