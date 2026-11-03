'use client';

import React from 'react';
import Image from 'next/image';

export interface MediaFrameProps {
  src: string;
  alt: string;
  mode: 'cover' | 'cutout';
  backdrop?: 'sky' | 'midnight' | 'paper' | 'transparent';
  ratioDesktop?: '4/5' | '16/10' | '1/1' | string;
  ratioTablet?: '16/10' | '4/5' | '1/1' | string;
  focalPoint?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * MediaFrame Component (DESIGN.md Section 4: Image System)
 * ─────────────────────────────────────────────────────────────────────────────
 * Every photo goes through MediaFrame. Fixed ratios, no hand-sized images.
 * - `cover`: Fixed aspect-ratio. Image is absolute inset-0 size-full object-cover
 *   with an object-position focal point. Always covers the frame, zero empty bands.
 * - `cutout`: Backdrop of sky (#E6EDFF) or midnight (#171822). Image is anchored
 *   to the bottom, centred, height 100% of frame, width auto.
 */
export default function MediaFrame({
  src,
  alt,
  mode,
  backdrop = 'sky',
  ratioDesktop = '4/5',
  ratioTablet = '16/10',
  focalPoint,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 45vw',
  className = '',
  children,
}: MediaFrameProps) {
  // Backdrop color tokens
  const backdropClasses = {
    sky: 'bg-[#E6EDFF] border-[#C8D8FF]',
    midnight: 'bg-[#171822] border-[#2A2B3A]',
    paper: 'bg-[#F5F7FB] border-[#DDE3F0]',
    transparent: 'bg-transparent border-transparent',
  }[backdrop];

  // Map ratio strings to Tailwind aspect ratio classes
  const getAspectRatioClasses = () => {
    if (ratioDesktop === '16/10' && ratioTablet === '16/10') {
      return 'aspect-[16/10]';
    }
    if (ratioDesktop === '4/5' && ratioTablet === '16/10') {
      return 'aspect-[16/10] lg:aspect-[4/5]';
    }
    if (ratioDesktop === '4/5' && ratioTablet === '4/5') {
      return 'aspect-[4/5]';
    }
    return 'aspect-[16/10] lg:aspect-[4/5]';
  };

  return (
    <div
      data-media-frame={mode}
      className={`relative w-full overflow-hidden rounded-[20px] border shadow-2xs select-none ${getAspectRatioClasses()} ${backdropClasses} ${className}`}
    >
      {mode === 'cover' ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          style={{ objectPosition: focalPoint || 'center' }}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            sizes={sizes}
            className="object-contain object-bottom transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Optional Overlay / Badges / Visual Label Pills */}
      {children && <div className="absolute inset-0 z-10 pointer-events-none">{children}</div>}
    </div>
  );
}

