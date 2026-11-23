import React from 'react';

/** Shared look of the /summer-school sections, matched to the home page. */
export const SECTION = 'py-16 sm:py-20 lg:py-24';
/** Swipe row on phones (like the home page services), grid from tablet up. */
export const SWIPE = 'psy-swipe list-none m-0 flex gap-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:[contain:none]';
export const CARD_TITLE = 'm-0 font-dmsans font-bold tracking-tight text-xl sm:text-2xl';

interface HeadingProps {
  children: React.ReactNode;
  sub?: string;
  center?: boolean;
  dark?: boolean;
}

/** Section heading at the home page's scale. Not the home primitive: that one leaves browser default margins here. */
export function Heading({ children, sub, center, dark }: HeadingProps) {
  return (
    <div className={`mb-10 sm:mb-14 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <h2 className={`m-0 font-dmsans font-bold text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-[-0.02em] [text-wrap:balance] ${dark ? 'text-white' : 'text-ink'}`}>
        {children}
      </h2>
      {sub && <p className={`m-0 mt-4 text-[17px] leading-[1.6] max-w-[62ch] ${center ? 'mx-auto' : ''} ${dark ? 'text-white/75' : 'text-muted'}`}>{sub}</p>}
    </div>
  );
}

/** Link styled like the home page's large button. `light` is for blue and navy backgrounds. */
export function CtaLink({ href, light, outline, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { light?: boolean; outline?: boolean }) {
  const tone = outline
    ? 'text-white border border-white/40 hover:bg-white/10 focus-visible:outline-white'
    : light
      ? 'bg-white text-clarvo-blue hover:bg-sky focus-visible:outline-white'
      : 'bg-clarvo-blue text-white hover:bg-[#0D4ABF] focus-visible:outline-[var(--clarvo-blue,#1258DE)]';
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center h-14 px-7 rounded-2xl text-[16px] font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${tone}`}
      {...rest}
    >
      {children}
    </a>
  );
}
