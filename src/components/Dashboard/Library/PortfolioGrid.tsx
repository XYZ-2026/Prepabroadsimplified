import React from 'react';
import Link from 'next/link';
import type { PortfolioCard } from '@/components/portfolio/portfolioTypes';

/** Published student portfolios. Each card opens the student's public page at /<username>. */
export default function PortfolioGrid({ cards }: { cards: PortfolioCard[] }) {
  return (
    <ul aria-label="Student portfolios" className="list-none p-0 m-0 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <li key={c.username}>
          <Link
            href={`/${c.username}`}
            className="group h-full flex flex-col rounded-[18px] bg-white border border-solid border-line overflow-hidden no-underline text-ink transition-[border-color,box-shadow] duration-200 hover:border-clarvo-blue hover:shadow-clarvo-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clarvo-blue,#1258DE)]"
          >
            <span className="relative block aspect-[4/3] bg-sky">
              {c.photoUrl ? (
                // Plain <img>: student photos are hosted by Wix, outside the image optimiser.
                <img src={c.photoUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-[center_25%]" />
              ) : (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[40px] font-bold text-clarvo-blue">
                  {c.initials}
                </span>
              )}
            </span>
            <span className="flex flex-col gap-1 p-4">
              <span className="text-[18px] font-bold leading-snug group-hover:text-clarvo-blue">{c.fullName}</span>
              {c.stage && <span className="text-[15px] leading-snug text-muted">{c.stage}</span>}
              {c.place && <span className="text-[15px] leading-snug text-muted">{c.place}</span>}
              {c.dream && (
                <span className="mt-1 text-[15px] leading-snug text-ink">
                  Wants to be: <strong>{c.dream}</strong>
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
