import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { listSops, SOP_LEVELS, LIBRARY_PAGE_SIZE, type SopSummary } from '@/lib/wix-library';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-library.module.css';
import { SearchForm, FilterChips, Pagination, parsePage, first } from '@/components/Dashboard/Library/LibraryControls';

export const metadata: Metadata = { title: 'SOP Library' };

const BASE = '/dashboard/student/sops';

export default async function SopLibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const sp = await searchParams;
  const q = (first(sp.q) || '').slice(0, 80);
  const level = first(sp.level) || '';
  const page = parsePage(first(sp.page));
  const current = { q: q || undefined, level: level || undefined, page: page > 1 ? String(page) : undefined };

  let items: SopSummary[] = [];
  let total = 0;
  let failed = false;
  try {
    ({ items, total } = await listSops({ q, level, page }));
  } catch {
    failed = true;
  }
  const totalPages = Math.max(1, Math.ceil(total / LIBRARY_PAGE_SIZE));

  return (
    <div className={dash.dashboardContent}>
      <div className={dash.pageHeader}>
        <h1 className={dash.pageTitle}>SOP Library</h1>
        <p className={dash.pageSubtitle}>
          Read real statements of purpose and admission essays from students admitted to top universities.
        </p>
      </div>

      <div className={styles.controls}>
        <SearchForm action={BASE} q={q} placeholder="Search by university, programme or author" hidden={{ level: level || undefined }} />
      </div>
      <FilterChips
        base={BASE}
        current={current}
        param="level"
        options={SOP_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
      />

      {failed ? (
        <div className={styles.empty}>The SOP library is temporarily unavailable. Please try again in a moment.</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>No essays match your search. Try a different university or programme.</div>
      ) : (
        <>
          <div className={styles.resultCount}>
            {total.toLocaleString('en-IN')} essay{total === 1 ? '' : 's'}
            {q ? ` matching “${q}”` : ''}
          </div>
          <div className={styles.grid}>
            {items.map((sop) => (
              <Link key={sop.id} href={`${BASE}/${sop.id}`} className={styles.card}>
                <div className={styles.cardTop}>
                  {sop.level && <span className={`${styles.badge} ${styles.badgeAccent}`}>{sop.level}</span>}
                  {sop.type && <span className={styles.badge}>{sop.type}</span>}
                </div>
                <h2 className={styles.cardTitle}>{sop.title}</h2>
                <div className={styles.cardMeta}>
                  {[sop.author && `By ${sop.author}`, sop.words ? `${sop.words.toLocaleString('en-IN')} words` : '']
                    .filter(Boolean)
                    .join(' · ')}
                </div>
                {sop.excerpt && <p className={styles.excerpt}>{sop.excerpt}</p>}
                <span className={styles.cardCta}>Read full essay →</span>
              </Link>
            ))}
          </div>
          <Pagination base={BASE} current={current} page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
