'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clapperboard, Sparkles } from 'lucide-react';
import SignInModal from './SignInModal';
import { PORTFOLIO_BUILDER_URL, SAMPLE_PORTFOLIO_URL } from '@/components/portfolio/portfolioTypes';

interface PortfolioCTAProps {
  /** Server-resolved session. Signed in: link straight to the builder. Signed out: register popup. */
  signedIn: boolean;
  /** `card` sits inside the admitted-students grid; `band` is a full-width closing section. */
  variant: 'card' | 'band';
}

const MODAL_TITLE = 'Create your free portfolio';
const MODAL_SUB =
  'Sign up free and we will take you straight to the portfolio builder: your story, activities and resume on one shareable link.';

/**
 * Lead-generation CTA on the admitted-students pages: "build a portfolio like theirs".
 * Signed-out visitors get the register popup and land in the portfolio builder after sign-up;
 * signed-in students go straight to the builder.
 */
export default function PortfolioCTA({ signedIn, variant }: PortfolioCTAProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const primary = signedIn ? (
    <Link href={PORTFOLIO_BUILDER_URL} className={variant === 'band' ? btnLight : btnBlue}>
      {variant === 'band' ? 'Build my portfolio' : 'Build mine'} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  ) : (
    <button type="button" onClick={() => setOpen(true)} className={variant === 'band' ? btnLight : btnBlue}>
      {variant === 'band' ? 'Create my free portfolio' : 'Create mine free'} <ArrowRight size={16} aria-hidden="true" />
    </button>
  );

  const modal = (
    <SignInModal open={open} onClose={close} redirectTo={PORTFOLIO_BUILDER_URL} defaultTab="register" title={MODAL_TITLE} subtitle={MODAL_SUB} />
  );

  if (variant === 'card') {
    return (
      <article className="h-full flex flex-col justify-between gap-5 rounded-[18px] p-6 bg-[#0B1D45] text-white border border-solid border-[#0B1D45] shadow-[0_24px_50px_-28px_rgba(18,88,222,0.6)]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-[0.1em] text-[#BFD4FF]">
            <Sparkles size={12} aria-hidden="true" /> Your turn
          </span>
          <h2 className="mt-4 mb-0 text-[22px] leading-tight font-bold text-white">Your portfolio could be next.</h2>
          <p className="mt-2.5 mb-0 text-[14.5px] leading-relaxed text-white/75">
            Every student here told their story well. Put your activities, projects, awards and resume on one link
            admissions teams can open.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-[10px] bg-white/[0.06] border border-solid border-white/15 text-[13px] font-semibold text-white/85">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80]" aria-hidden="true" />
            <span>
              clarvo.in/<span className="text-[#8FB1FF]">your-name</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {primary}
          <Link href={SAMPLE_PORTFOLIO_URL} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#BFD4FF] no-underline hover:text-white">
            <Clapperboard size={14} aria-hidden="true" /> See a sample
          </Link>
        </div>
        {modal}
      </article>
    );
  }

  return (
    <section aria-label="Create your own portfolio" className="mt-12 sm:mt-16 relative overflow-hidden rounded-[28px] bg-clarvo-blue text-white">
      <div aria-hidden="true" className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-7 sm:p-10 lg:p-12 items-center">
        <div className="lg:col-span-7">
          <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">Free for every CLARVO student</p>
          <h2 className="mt-3 mb-0 text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.1] font-bold tracking-tight text-white">
            They had a story. Start building yours.
          </h2>
          <p className="mt-4 mb-0 max-w-[52ch] text-[16px] sm:text-[17px] leading-relaxed text-white/85">
            Create a portfolio like the ones you just browsed: your journey, activities, projects, awards and a
            downloadable resume, all on one link you can share with universities.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
            {primary}
            <Link
              href={SAMPLE_PORTFOLIO_URL}
              className="inline-flex items-center justify-center gap-2 h-[50px] px-6 rounded-full text-[15px] font-bold text-white border border-solid border-white/40 hover:bg-white/10 no-underline transition-colors"
            >
              <Clapperboard size={16} aria-hidden="true" /> See a sample portfolio
            </Link>
          </div>
        </div>

        {/* What you get, at a glance */}
        <ul className="lg:col-span-5 m-0 p-0 list-none grid gap-3">
          {[
            ['Your own link', 'clarvo.in/your-name, ready to share'],
            ['Built from your profile', 'Activities, projects and awards in one place'],
            ['Resume included', 'A clean PDF generated from your portfolio'],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3 items-start rounded-[16px] bg-white/10 border border-solid border-white/15 px-4 py-3.5">
              <span className="mt-1 w-2 h-2 rounded-full bg-[#4ADE80] shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-[15px] font-bold text-white">{t}</span>
                <span className="block text-[13.5px] text-white/75 mt-0.5">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {modal}
    </section>
  );
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold no-underline cursor-pointer border-0 transition-colors whitespace-nowrap';
const btnBlue = `${base} h-11 px-5 text-[14px] bg-clarvo-blue text-white hover:bg-[#2B6BF0]`;
const btnLight = `${base} h-[50px] px-6 text-[15px] bg-white text-clarvo-blue hover:bg-sky`;
