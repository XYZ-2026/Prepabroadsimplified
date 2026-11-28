import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { verifySessionCookie } from '@/lib/auth';
import { listAdmitted, COLLEGE_TYPES, DECISIONS, LIBRARY_PAGE_SIZE, type AdmittedSummary } from '@/lib/wix-library';
import { listPublicPortfolios, PORTFOLIO_PAGE_SIZE } from '@/lib/portfolio-service';
import type { PortfolioCard } from '@/components/portfolio/portfolioTypes';
import lib from '@/styles/student-library.module.css';
import s from '@/styles/admitted-students.module.css';
import { SearchForm, FilterChips, Pagination, parsePage, first } from '@/components/Dashboard/Library/LibraryControls';
import { AdmittedCard, AdmittedHero } from '@/components/Dashboard/Library/AdmittedViews';
import PortfolioGrid from '@/components/Dashboard/Library/PortfolioGrid';
import AuthGate from '@/components/Auth/AuthGate';
import PortfolioCTA from '@/components/Auth/PortfolioCTA';
import WhatsAppFloatingButton from "@/components/landing/WhatsAppFloatingButton";

/** Grid slot (0-based) where the "build your own portfolio" card appears. */
const CTA_SLOT = 5;

export const metadata: Metadata = {
  title: 'Student Profiles — Admitted Students & Student Portfolios',
  description:
    'Real profiles of students admitted to Ivy League and top universities, and portfolios built by CLARVO students: scores, activities, projects and awards.',
  keywords: [
    'admitted student profiles',
    'student portfolio examples',
    'ivy league admits from india',
    'college admissions profile examples',
    'profile building examples',
  ],
  alternates: { canonical: '/admitted-students' },
};

const BASE = '/admitted-students';
const PORTFOLIOS = 'portfolios';

const TABS = [
  { view: '', label: 'Admitted students', href: BASE },
  { view: PORTFOLIOS, label: 'Student portfolios', href: `${BASE}?view=${PORTFOLIOS}` },
];

/**
 * Public Student Profiles (website, not dashboard): two tabs. Admitted students come from the
 * Wix library (full profiles ask signed-out visitors to sign in); student portfolios are the
 * ones students chose to publish, and open to everyone.
 */
export default async function PublicAdmittedStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const signedIn = Boolean(await verifySessionCookie());

  const sp = await searchParams;
  const view = first(sp.view) === PORTFOLIOS ? PORTFOLIOS : '';
  const page = parsePage(first(sp.page));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {view === PORTFOLIOS ? (
        <PortfoliosView page={page} signedIn={signedIn} />
      ) : (
        <AdmittedView sp={sp} page={page} signedIn={signedIn} />
      )}

      <PortfolioCTA signedIn={signedIn} variant="band" />

      <WhatsAppFloatingButton />
    </div>
  );
}

function Tabs({ active }: { active: string }) {
  return (
    <nav aria-label="Profile type" className="flex gap-2 mb-6 overflow-x-auto">
      {TABS.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          aria-current={t.view === active ? 'page' : undefined}
          className={`shrink-0 inline-flex items-center min-h-11 px-5 rounded-full text-[15px] font-bold no-underline border border-solid transition-colors ${
            t.view === active ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-white border-line text-ink hover:border-clarvo-blue'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

const HERO_TEXT =
  'Real profiles of students admitted to top universities, and portfolios built by CLARVO students. Use them to benchmark and plan your own application.';

async function PortfoliosView({ page, signedIn }: { page: number; signedIn: boolean }) {
  let cards: PortfolioCard[] = [];
  let total = 0;
  let failed = false;
  try {
    ({ items: cards, total } = await listPublicPortfolios(page));
  } catch {
    failed = true;
  }
  const totalPages = Math.max(1, Math.ceil(total / PORTFOLIO_PAGE_SIZE));

  return (
    <>
      <AdmittedHero total={total} title="Student Profiles" text={HERO_TEXT} kicker="Built by CLARVO students" unit="Portfolios" showUniversities={false} />
      <Tabs active={PORTFOLIOS} />
      {failed ? (
        <div className={lib.empty}>Student portfolios are temporarily unavailable. Please try again in a moment.</div>
      ) : cards.length === 0 ? (
        <div className={lib.empty}>No student has published a portfolio yet. Yours could be the first.</div>
      ) : (
        <>
          <p className={s.count}>
            Showing <strong>{total.toLocaleString('en-IN')}</strong> student portfolio{total === 1 ? '' : 's'}
          </p>
          <PortfolioGrid cards={cards} />
          <Pagination base={BASE} current={{ view: PORTFOLIOS, page: page > 1 ? String(page) : undefined }} page={page} totalPages={totalPages} />
        </>
      )}
      {!failed && cards.length === 0 && <PortfolioCTA signedIn={signedIn} variant="card" />}
    </>
  );
}

async function AdmittedView({ sp, page, signedIn }: { sp: Record<string, string | string[] | undefined>; page: number; signedIn: boolean }) {
  const q = (first(sp.q) || '').slice(0, 80);
  const type = first(sp.type) || '';
  const decision = first(sp.decision) || '';
  const current = {
    q: q || undefined,
    type: type || undefined,
    decision: decision || undefined,
    page: page > 1 ? String(page) : undefined,
  };

  let items: AdmittedSummary[] = [];
  let total = 0;
  let failed = false;
  try {
    ({ items, total } = await listAdmitted({ q, type, decision, page }));
  } catch {
    failed = true;
  }
  const totalPages = Math.max(1, Math.ceil(total / LIBRARY_PAGE_SIZE));

  return (
    <>
      <AdmittedHero total={total} title="Student Profiles" text={HERO_TEXT} />
      <Tabs active="" />

      <div className={s.toolbar}>
        <SearchForm
          action={BASE}
          q={q}
          placeholder="Search by student, university or major"
          hidden={{ type: type || undefined, decision: decision || undefined }}
        />
        <div className={s.filterRow}>
          <span className={s.filterLabel}>College type</span>
          <FilterChips base={BASE} current={current} param="type" options={COLLEGE_TYPES.map((t) => ({ value: t, label: t }))} />
        </div>
        <div className={s.filterRow}>
          <span className={s.filterLabel}>Decision</span>
          <FilterChips base={BASE} current={current} param="decision" options={DECISIONS.map((d) => ({ value: d, label: d }))} />
        </div>
      </div>

      {failed ? (
        <div className={lib.empty}>Admitted student profiles are temporarily unavailable. Please try again in a moment.</div>
      ) : items.length === 0 ? (
        <div className={lib.empty}>No students match your search. Try a different university or major.</div>
      ) : (
        <>
          <p className={s.count}>
            Showing <strong>{total.toLocaleString('en-IN')}</strong> admitted student profile{total === 1 ? '' : 's'}
            {q ? ` matching “${q}”` : ''}
          </p>
          <AuthGate
            signedIn={signedIn}
            mode="marked"
            title="Sign in to view the full profile"
            subtitle="Scores, activities, awards and the essays this student wrote are available with a free CLARVO account."
          >
            <div className={s.grid}>
              {items.map((st, i) => (
                <React.Fragment key={st.id}>
                  {i === Math.min(CTA_SLOT, items.length - 1) && <PortfolioCTA signedIn={signedIn} variant="card" />}
                  <AdmittedCard student={st} href={`${BASE}/${encodeURIComponent(st.username)}`} gated />
                </React.Fragment>
              ))}
            </div>
          </AuthGate>
          <Pagination base={BASE} current={current} page={page} totalPages={totalPages} />
        </>
      )}
    </>
  );
}
