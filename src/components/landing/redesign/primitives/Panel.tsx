'use client';

import React from 'react';

export type PanelRadius = 'large' | 'small' | 'photo';
export type PanelSurface = 'paper' | 'white' | 'sky' | 'midnight' | 'blue';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: PanelRadius;
  surface?: PanelSurface;
  elevated?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export default function Panel({
  radius = 'large',
  surface = 'white',
  elevated = false,
  children,
  className = '',
  as: Component = 'div',
  ...props
}: PanelProps) {
  // Radius specs from DESIGN.md Section 1: Large 28px, Small 14px, Photos 20px
  const radiusClasses: Record<PanelRadius, string> = {
    large: 'rounded-[24px] sm:rounded-[28px]',
    small: 'rounded-[12px] sm:rounded-[14px]',
    photo: 'rounded-[16px] sm:rounded-[20px]',
  };

  // Surface colors & borders from DESIGN.md Section 1
  const surfaceClasses: Record<PanelSurface, string> = {
    paper: 'bg-[#F5F7FB] text-[#12131C] border border-[#DDE3F0]',
    white: 'bg-white text-[#12131C] border border-[#DDE3F0]',
    sky: 'bg-[#E6EDFF] text-[#12131C] border border-[#DDE3F0]',
    midnight: 'bg-[#171822] text-white border border-[#262838]',
    blue: 'bg-[#1258DE] text-white border border-[#1258DE]',
  };

  const classes = [
    'transition-all duration-200 relative overflow-hidden',
    radiusClasses[radius],
    surfaceClasses[surface],
    elevated ? 'shadow-clarvo-elevated' : 'shadow-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

