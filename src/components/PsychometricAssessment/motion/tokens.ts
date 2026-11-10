/**
 * Motion tokens for /psychometric-assessment (Design_psychometric_v2.md, section 3).
 * Keep every duration, ease and spring on the page coming from here.
 */
import type { Transition } from 'motion/react';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_FLIP: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const enterTransition: Transition = { duration: 0.5, ease: EASE_OUT };
export const flipTransition: Transition = { duration: 0.6, ease: EASE_FLIP };
export const springUi: Transition = { type: 'spring', stiffness: 400, damping: 30 };
export const springData: Transition = { type: 'spring', stiffness: 120, damping: 20 };

export const STAGGER = 0.06;

/** Shared `viewport` for every whileInView entry: play once, when 35% is visible. */
export const VIEWPORT = { once: true, amount: 0.35 } as const;

export const enterHidden = { opacity: 0, y: 16 };
export const enterShown = { opacity: 1, y: 0 };
