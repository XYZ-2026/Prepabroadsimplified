'use client';

import React from 'react';

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  level?: 'display' | 'h2' | 'h3';
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  stageWord?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  level = 'h2',
  align = 'left',
  theme = 'light',
  stageWord,
  className = '',
}: SectionHeadingProps) {
  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  const headingTag = level === 'display' ? 'h1' : level === 'h2' ? 'h2' : 'h3';

  // Typography scale from DESIGN.md Section 1
  const titleClass =
    level === 'display'
      ? 'text-[clamp(2.75rem,6vw,5.5rem)] font-dmsans font-bold leading-[1.02] tracking-[-0.03em]'
      : level === 'h2'
      ? 'text-[clamp(2rem,4vw,3.25rem)] font-dmsans font-bold leading-[1.08] tracking-[-0.02em]'
      : 'text-[clamp(1.5rem,2.8vw,2rem)] font-dmsans font-bold leading-[1.15] tracking-[-0.015em]';

  const textColor = isDark ? 'text-white' : 'text-[#12131C]';
  const subtitleColor = isDark ? 'text-[#A6B0C3]' : 'text-[#5B6275]';

  const HeadingComponent = headingTag as keyof React.JSX.IntrinsicElements;

  return (
    <div
      className={`relative ${isCenter ? 'text-center mx-auto' : 'text-left'} ${className}`}
    >
      {/* Optional Anton stage word behind the heading */}
      {stageWord && (
        <div
          aria-hidden="true"
          className={`font-anton select-none pointer-events-none uppercase text-[clamp(5rem,16vw,14rem)] leading-[0.85] tracking-tight ${
            isDark ? 'text-[#212433]/70' : 'text-[#E6EDFF]'
          } mb-[-0.4em] opacity-80`}
        >
          {stageWord}
        </div>
      )}

      {/* Main Heading (Strictly sentence case per DESIGN.md) */}
      <HeadingComponent className={`${titleClass} ${textColor} relative z-10`}>
        {title}
      </HeadingComponent>

      {/* Subtitle (1.0625rem / 1.6, max 62ch) */}
      {subtitle && (
        <p
          className={`mt-4 sm:mt-5 text-[1.0625rem] leading-[1.6] max-w-[62ch] ${
            isCenter ? 'mx-auto' : ''
          } ${subtitleColor} font-dmsans font-normal`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

