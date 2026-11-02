'use client';

import React from 'react';

export type ChipVariant = 'paper' | 'sky' | 'midnight' | 'blue' | 'floating';
export type ChipSize = 'sm' | 'md';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  interactive?: boolean;
}

export default function Chip({
  variant = 'paper',
  size = 'md',
  label,
  sublabel,
  icon,
  children,
  interactive = false,
  className = '',
  onClick,
  ...props
}: ChipProps) {
  const sizeClasses: Record<ChipSize, string> = {
    sm: 'py-1 px-3 text-[11px] sm:text-[11.5px] gap-1.5',
    md: 'py-1.5 px-3.5 sm:px-4 text-[12px] sm:text-[13px] gap-2',
  };

  const variantClasses: Record<ChipVariant, string> = {
    paper: 'bg-[#F5F7FB] text-[#12131C] border border-[#DDE3F0]',
    sky: 'bg-[#E6EDFF] text-[#1258DE] border border-[#DDE3F0]',
    midnight: 'bg-[#171822] text-white border border-[#2E3242]',
    blue: 'bg-[#1258DE] text-white border border-[#1258DE]',
    floating:
      'bg-white/95 backdrop-blur-md text-[#12131C] border border-[#DDE3F0] shadow-[0_12px_30px_-10px_rgba(18,88,222,0.18)]',
  };

  const isClickable = interactive || Boolean(onClick);

  const classes = [
    'inline-flex items-center rounded-full font-dmsans font-medium select-none tracking-normal transition-all duration-200',
    sizeClasses[size],
    variantClasses[variant],
    isClickable
      ? 'cursor-pointer hover:border-[#1258DE] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE] focus-visible:ring-offset-1'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {sublabel && (
        <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider text-[#5B6275] font-bold">
          {sublabel}
        </span>
      )}
      {label && <span className="font-bold leading-none">{label}</span>}
      {children}
    </div>
  );
}

