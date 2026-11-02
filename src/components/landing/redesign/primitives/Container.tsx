'use client';

import React from 'react';

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main';
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
}

export default function Container({
  as: Component = 'div',
  size = 'default',
  children,
  className = '',
  ...props
}: ContainerProps) {
  const sizeClasses: Record<ContainerSize, string> = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  const classes = [
    'w-full mx-auto px-4 sm:px-6 lg:px-8',
    sizeClasses[size],
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

