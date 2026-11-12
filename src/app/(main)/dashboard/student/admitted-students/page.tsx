import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { listAdmitted, COLLEGE_TYPES, DECISIONS, LIBRARY_PAGE_SIZE, type AdmittedSummary } from '@/lib/wix-library';
import dash from '@/styles/student-dashboard.module.css';
import lib from '@/styles/student-library.module.css';
import s from '@/styles/admitted-students.module.css';
import { SearchForm, FilterChips, Pagination, parsePage, first } from '@/components/Dashboard/Library/LibraryControls';
import { AdmittedCard, AdmittedHero } from '@/components/Dashboard/Library/AdmittedViews';

export const metadata: Metadata = { title: 'Admitted Students' };

const BASE = '/dashboard/student/admitted-students';

export default async function AdmittedStudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

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
    <div className={dash.dashboardContent}>
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
          <div className={s.grid}>
            {items.map((st) => (
              <AdmittedCard key={st.id} student={st} href={`${BASE}/${st.id}`} />
            ))}
          </div>
          <Pagination base={BASE} current={current} page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
