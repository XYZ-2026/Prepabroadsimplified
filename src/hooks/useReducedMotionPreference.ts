'use client';

import { useState, useEffect } from 'react';

/**
 * Global hook to detect and subscribe to user's OS-level prefers-reduced-motion setting.
 * When true, all animations and parallax effects must immediately fall back to their final static state.
 */
export function useReducedMotionPreference(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Imperative helper for non-React contexts or one-off GSAP initialization checks.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
