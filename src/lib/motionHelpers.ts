import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPrefersReducedMotion } from '@/hooks/useReducedMotion';
import { getIsPointerFine } from '@/hooks/usePointerFine';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface LineMaskOptions {
  trigger?: HTMLElement | string;
  stagger?: number; // default 0.08 (80ms per spec)
  duration?: number; // default 0.8s
  ease?: string; // 'expo.out' for hero, 'power3.out' for others
  delay?: number;
}

/**
 * 1. Line-Mask Headline Reveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Animates text lines sliding up out of masked containers (overflow hidden).
 * Spec: 80ms stagger, 16-32px travel, expo.out or power3.out.
 * Cleans up and kills timeline on unmount.
 */
export function createLineMaskReveal(
  lines: HTMLElement[] | NodeListOf<HTMLElement> | string,
  options: LineMaskOptions = {}
): { timeline: gsap.core.Timeline | null; cleanup: () => void } {
  if (typeof window === 'undefined') {
    return { timeline: null, cleanup: () => {} };
  }

  const isReduced = getPrefersReducedMotion();
  const elements = typeof lines === 'string' 
    ? Array.from(document.querySelectorAll<HTMLElement>(lines)) 
    : Array.from(lines);

  if (elements.length === 0) {
    return { timeline: null, cleanup: () => {} };
  }

  if (isReduced) {
    elements.forEach((el) => {
      gsap.set(el, { y: 0, opacity: 1, clearProps: 'transform' });
    });
    return { timeline: null, cleanup: () => {} };
  }

  const {
    trigger,
    stagger = 0.08,
    duration = 0.8,
    ease = 'expo.out',
    delay = 0,
  } = options;

  const tl = gsap.timeline({
    delay,
    scrollTrigger: trigger
      ? {
          trigger,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        }
      : undefined,
  });

  gsap.set(elements, { y: '100%', opacity: 0 });

  tl.to(elements, {
    y: '0%',
    opacity: 1,
    duration,
    stagger,
    ease,
  });

  const cleanup = () => {
    if (tl.scrollTrigger) {
      tl.scrollTrigger.kill();
    }
    tl.kill();
  };

  return { timeline: tl, cleanup };
}

export interface CountUpOptions {
  start?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  trigger?: HTMLElement | string;
}

/**
 * 2. Numeric Count-Up Helper
 * ─────────────────────────────────────────────────────────────────────────────
 * Smoothly interpolates an integer from start to endValue.
 * Immediately displays final value when reduced motion is preferred.
 * Cleans up tween and ScrollTrigger on unmount.
 */
export function createCountUp(
  target: HTMLElement | null,
  endValue: number,
  options: CountUpOptions = {}
): { tween: gsap.core.Tween | null; cleanup: () => void } {
  if (typeof window === 'undefined' || !target) {
    return { tween: null, cleanup: () => {} };
  }

  const {
    start = 0,
    duration = 1.2,
    delay = 0,
    suffix = '',
    prefix = '',
    trigger,
  } = options;

  const isReduced = getPrefersReducedMotion();

  if (isReduced) {
    target.textContent = `${prefix}${endValue}${suffix}`;
    return { tween: null, cleanup: () => {} };
  }

  const state = { value: start };
  target.textContent = `${prefix}${Math.round(start)}${suffix}`;

  const tween = gsap.to(state, {
    value: endValue,
    duration,
    delay,
    ease: 'power3.out',
    scrollTrigger: trigger
      ? {
          trigger,
          start: 'top 90%',
          once: true,
        }
      : undefined,
    onUpdate: () => {
      if (target) {
        target.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
      }
    },
  });

  const cleanup = () => {
    if (tween.scrollTrigger) {
      tween.scrollTrigger.kill();
    }
    tween.kill();
  };

  return { tween, cleanup };
}

export interface SvgDrawOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  trigger?: HTMLElement | SVGElement | string;
}

/**
 * 3. SVG Path Draw Helper
 * ─────────────────────────────────────────────────────────────────────────────
 * Measures total path length, sets strokeDasharray/strokeDashoffset,
 * and animates from 100% hidden to fully drawn.
 * Respects reduced motion (instant draw) and cleans up on unmount.
 */
export function createSvgPathDraw(
  path: SVGPathElement | null,
  options: SvgDrawOptions = {}
): { tween: gsap.core.Tween | null; cleanup: () => void } {
  if (typeof window === 'undefined' || !path) {
    return { tween: null, cleanup: () => {} };
  }

  const {
    duration = 1.0,
    delay = 0,
    ease = 'power3.out',
    trigger,
  } = options;

  const length = path.getTotalLength ? path.getTotalLength() : 100;
  const isReduced = getPrefersReducedMotion();

  if (isReduced) {
    gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 });
    return { tween: null, cleanup: () => {} };
  }

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  const tween = gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease,
    scrollTrigger: trigger
      ? {
          trigger,
          start: 'top 85%',
          once: true,
        }
      : undefined,
  });

  const cleanup = () => {
    if (tween.scrollTrigger) {
      tween.scrollTrigger.kill();
    }
    tween.kill();
  };

  return { tween, cleanup };
}

export interface MagneticOptions {
  strength?: number; // Max pixel deflection (default 8px)
  ease?: string; // default 'power2.out'
}

/**
 * 4. Magnetic Button Helper
 * ─────────────────────────────────────────────────────────────────────────────
 * Attaches a magnetic pull effect towards the cursor.
 * Strictly gated: Runs ONLY on fine-pointer devices ((hover: hover) and (pointer: fine)).
 * Coarse pointers and touch devices: No-op.
 * Cleans up listeners, resets transforms on unmount.
 */
export function createMagneticButton(
  element: HTMLElement | null,
  options: MagneticOptions = {}
): () => void {
  if (typeof window === 'undefined' || !element) {
    return () => {};
  }

  const isFine = getIsPointerFine();
  const isReduced = getPrefersReducedMotion();

  if (!isFine || isReduced) {
    return () => {};
  }

  const { strength = 8, ease = 'power2.out' } = options;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    gsap.to(element, {
      x: deltaX * strength,
      y: deltaY * strength,
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    gsap.set(element, { x: 0, y: 0, clearProps: 'transform' });
  };
}
