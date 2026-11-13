import React from 'react';
import type { Metadata } from 'next';
import { verifySessionCookie } from '@/lib/auth';
import { listAdmitted, COLLEGE_TYPES, DECISIONS, LIBRARY_PAGE_SIZE, type AdmittedSummary } from '@/lib/wix-library';
import lib from '@/styles/student-library.module.css';
import s from '@/styles/admitted-students.module.css';
import { SearchForm, FilterChips, Pagination, parsePage, first } from '@/components/Dashboard/Library/LibraryControls';
import { AdmittedCard, AdmittedHero } from '@/components/Dashboard/Library/AdmittedViews';
import AuthGate from '@/components/Auth/AuthGate';
import PortfolioCTA from '@/components/Auth/PortfolioCTA';

/** Grid slot (0-based) where the "build your own portfolio" card appears. */
const CTA_SLOT = 5;

export const metadata: Metadata = {
  title: 'Admitted Students — Real Profiles of Students Admitted to Top Universities | CLARVO',
  description:
    'Browse real profiles of students admitted to Ivy League, private and public universities: scores, majors, activities and the essays that got them in.',
  alternates: { canonical: '/admitted-students' },
};

const BASE = '/admitted-students';

/**
 * Public admitted-students library (website, not dashboard). Same Wix data as
 * /dashboard/student/admitted-students. Cards and portfolios are open to everyone;
 * full profiles ask signed-out visitors to sign in through a popup.
 */
export default async function PublicAdmittedStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const signedIn = Boolean(await verifySessionCookie());

  const sp = await searchParams;
  const q = (first(sp.q) || '').slice(0, 80);
  const type = first(sp.type) || '';
  const decision = first(sp.decision) || '';
  const page = parsePage(first(sp.page));
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdmittedHero total={total} />

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
                  <AdmittedCard student={st} href={`${BASE}/${encodeURIComponent(st.id)}`} gated />
                </React.Fragment>
              ))}
            </div>
          </AuthGate>
          <Pagination base={BASE} current={current} page={page} totalPages={totalPages} />
        </>
      )}

      <PortfolioCTA signedIn={signedIn} variant="band" />
    </div>
  );
}
