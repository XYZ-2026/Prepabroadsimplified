'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type Lenis from 'lenis';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

interface SmoothScrollContextValue {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

export function useLenis() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useEffect(() => {
    // 1. Guard against SSR
    if (typeof window === 'undefined') return;

    // 2. Gate Lenis strictly to fine pointer devices per DESIGN.md section 2
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      // Allow native browser scrolling without Lenis momentum interception on touch devices
      return;
    }

    // 3. Load Lenis and GSAP only now: phones stop above, so they never download them.
    let cancelled = false;
    let cleanUp = () => {};

    const start = async () => {
      const [{ default: LenisClass }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new LenisClass({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 0, // Explicitly disable touch hijacking
      });
      setLenisInstance(lenis);

      // 4. Synchronize Lenis scroll position with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // 5. Connect Lenis render frame to GSAP ticker for single unified animation loop
      const updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      cleanUp = () => {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        setLenisInstance(null);
      };
    };
    // If the download fails, the page simply keeps normal browser scrolling.
    start().catch(() => {});

    // 6. Cleanup on unmount
    return () => {
      cancelled = true;
      cleanUp();
    };
  }, [prefersReducedMotion]);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

