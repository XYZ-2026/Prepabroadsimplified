'use client';

import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  elevated?: boolean;
}

export type ButtonProps = BaseButtonProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  elevated = false,
  ...props
}: ButtonProps) {
  // Base sizing and typography (DM Sans, font-bold, sentence case)
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-[13px] rounded-xl gap-1.5',
    md: 'h-11 sm:h-12 px-5 sm:px-6 text-[14px] sm:text-[15px] rounded-xl sm:rounded-2xl gap-2',
    lg: 'h-12 sm:h-14 px-6 sm:px-8 text-[15px] sm:text-[16px] rounded-2xl gap-2.5',
  };

  // Variants mapped to DESIGN.md tokens
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#1258DE] text-white hover:bg-[#0D4ABF] active:bg-[#0A3C9E] border border-transparent shadow-xs',
    secondary:
      'bg-white text-[#12131C] border border-[#DDE3F0] hover:bg-[#F5F7FB] hover:border-[#CBD5E1] active:bg-[#EAEFF8]',
    ghost:
      'bg-transparent text-[#1258DE] hover:bg-[#E6EDFF]/70 active:bg-[#E6EDFF] border border-transparent',
  };

  // Keyboard accessibility and focus rings
  const focusRingClasses =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE] focus-visible:ring-offset-2 focus-visible:ring-offset-white';

  const baseClasses = [
    'font-dmsans font-bold inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer',
    'active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    elevated ? 'shadow-clarvo-elevated hover:shadow-[0_28px_65px_-24px_rgba(18,88,222,0.35)]' : '',
    fullWidth ? 'w-full' : 'w-auto',
    focusRingClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if ('href' in props && typeof props.href === 'string') {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={baseClasses} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type || 'button'} className={baseClasses} {...buttonProps}>
      {content}
    </button>
  );
}

