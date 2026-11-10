'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect whether the user is on a fine-pointer device (mouse/trackpad with hover).
 * Gated per DESIGN.md Section 2:
 * "Gate hover-only effects, mouse parallax, Lenis and pinned scroll with
 *  (hover: hover) and (pointer: fine), not by width."
 */
export function usePointerFine(): boolean {
  const [isPointerFine, setIsPointerFine] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsPointerFine(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return isPointerFine;
}

/**
 * Imperative check for fine pointer devices (non-React contexts, GSAP lifecycle guards).
 */
export function getIsPointerFine(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}
