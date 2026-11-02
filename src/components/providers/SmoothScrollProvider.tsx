'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

// Ensure ScrollTrigger is registered with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

    // 2. Disable smooth scroll on touch devices or if prefers-reduced-motion is active
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      // Allow native browser scrolling without Lenis momentum interception
      return;
    }

    // 3. Initialize Lenis instance
    const lenis = new Lenis({
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

    // 6. Cleanup on unmount
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

