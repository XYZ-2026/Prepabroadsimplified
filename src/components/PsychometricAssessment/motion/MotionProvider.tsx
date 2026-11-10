'use client';

import React from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';

const loadFeatures = () => import('./features').then((mod) => mod.default);

/**
 * Wraps the psychometric page. Components use `m.*` (not `motion.*`) so the
 * animation runtime loads lazily; `reducedMotion="user"` honours the OS setting.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
