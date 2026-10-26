'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const STATS = [
  { num: '15,000+', text: 'STUDENTS GUIDED', accent: true, sub: 'Across CBSE, ICSE, IB & Cambridge' },
  { num: '30+', text: 'EVALUATION MODULES', accent: false, sub: 'Multi-dimensional cognitive battery' },
  { num: '100+', text: 'CAREER SPECIALISATIONS', accent: true, sub: 'Mapped to 500+ global universities' },
  { num: '98%', text: 'PARENT CLARITY RATING', accent: false, sub: 'Evidence-backed family alignment' },
];

export default function StatsStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#080F1C] border-y border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent pointer-events-none" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduceMotion ? 0 : 0.1,
            },
          },
        }}
        className="grid grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto relative z-10"
      >
        {STATS.map((item, idx) => (
          <motion.div
            key={item.text}
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: shouldReduceMotion ? 0.05 : 0.5, ease: [0.16, 1, 0.3, 1] as const },
              },
            }}
            whileHover={shouldReduceMotion ? {} : { backgroundColor: 'rgba(15, 23, 42, 0.75)', y: -2 }}
            className={`h-[135px] sm:h-[160px] flex flex-col items-center justify-center p-4 text-center transition-colors duration-200 ${
              idx < 3 ? 'lg:border-r border-slate-800' : ''
            } ${idx % 2 === 0 ? 'border-r sm:border-r-0 lg:border-r border-slate-800' : ''} ${
              idx < 2 ? 'border-b lg:border-b-0 border-slate-800' : ''
            }`}
          >
            <motion.span
              initial={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`text-[25px] xs:text-[32px] sm:text-[44px] md:text-[50px] font-black leading-none tracking-tight ${
                item.accent ? 'text-[#38BDF8]' : 'text-white'
              }`}
            >
              {item.num}
            </motion.span>
            <p className="mt-2.5 text-[#94A3B8] text-[10px] sm:text-[12px] tracking-[0.14em] font-extrabold uppercase">
              {item.text}
            </p>
            <span className="hidden sm:block text-[11px] text-slate-500 mt-1 font-medium">
              {item.sub}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
