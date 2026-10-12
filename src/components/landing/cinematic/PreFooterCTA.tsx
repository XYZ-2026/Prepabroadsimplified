'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function PreFooterCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full overflow-hidden mt-auto">
      <div className="bg-gradient-to-br from-[#080F1C] via-[#1E3A8A] to-[#2563EB] px-4 sm:px-6 md:px-10 py-16 sm:py-24 md:py-28 relative">
        {/* Ambient Bloom */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/25 via-transparent to-transparent pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: shouldReduceMotion ? 1 : 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-[11px] font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            UNLOCK ACADEMIC EXCELLENCE
          </div>

          <h2 className="text-white font-black tracking-[-0.05em] leading-[1.02]">
            <span className="block text-[34px] sm:text-[48px] md:text-[66px]">
              Start building their
            </span>
            <span className="block mt-2 text-[#93C5FD] italic text-[34px] sm:text-[48px] md:text-[66px] leading-tight">
              future legacy
            </span>
            <span className="block mt-1 text-white text-[34px] sm:text-[48px] md:text-[66px] leading-tight">
              today.
            </span>
          </h2>

          <p className="mt-6 sm:mt-8 text-blue-100 text-[15px] sm:text-[17px] md:text-[19px] leading-relaxed max-w-[720px] mx-auto px-2 font-normal">
            Join 15,000+ ambitious students and parents navigating stream selection, SAT excellence, and global admissions with absolute clarity.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/auth?tab=register"
                className="w-full sm:w-auto h-[54px] sm:h-[58px] px-10 rounded-[14px] bg-white text-[#1E3A8A] text-[16px] font-bold transition-all inline-flex items-center justify-center gap-2.5 shadow-2xl cursor-pointer"
              >
                <span>Begin Student Assessment</span>
                <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/sample-report?type=grade10"
                className="w-full sm:w-auto h-[54px] sm:h-[58px] px-8 rounded-[14px] bg-blue-700/40 hover:bg-blue-700/60 border border-white/20 text-white text-[15px] font-semibold transition-all inline-flex items-center justify-center cursor-pointer"
              >
                <span>Explore Sample Dossier</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
