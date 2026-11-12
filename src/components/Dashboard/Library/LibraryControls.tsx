import Link from 'next/link';
import styles from '@/styles/student-library.module.css';

type Params = Record<string, string | undefined>;

/** Builds a URL for the same page with some search params replaced (empty values removed). */
export function buildHref(base: string, current: Params, changes: Params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...current, ...changes })) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export function SearchForm({
  action,
  q,
  placeholder,
  hidden,
}: {
  action: string;
  q: string;
  placeholder: string;
  hidden: Params;
}) {
  return (
    <form className={styles.search} action={action} method="get" role="search">
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <input type="search" name="q" defaultValue={q} placeholder={placeholder} aria-label={placeholder} maxLength={80} />
      <button type="submit" className={styles.searchBtn}>
        Search
      </button>
    </form>
  );
}

export function FilterChips({
  base,
  current,
  param,
  options,
}: {
  base: string;
  current: Params;
  param: string;
  options: { value: string; label: string }[];
}) {
  const active = current[param] || '';
  return (
    <div className={styles.chips}>
      <Link
        href={buildHref(base, current, { [param]: undefined, page: undefined })}
        className={`${styles.chip} ${!active ? styles.chipActive : ''}`}
      >
        All
      </Link>
      {options.map((o) => (
        <Link
          key={o.value}
          href={buildHref(base, current, { [param]: o.value, page: undefined })}
          className={`${styles.chip} ${active === o.value ? styles.chipActive : ''}`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export function Pagination({
  base,
  current,
  page,
  totalPages,
}: {
  base: string;
  current: Params;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? buildHref(base, current, { page: page === 2 ? undefined : String(page - 1) }) : '#';
  const next = page < totalPages ? buildHref(base, current, { page: String(page + 1) }) : '#';
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Link href={prev} className={`${styles.pageLink} ${page <= 1 ? styles.pageLinkDisabled : ''}`} aria-disabled={page <= 1}>
        ← Previous
      </Link>
      <span>
        Page {page} of {totalPages}
      </span>
      <Link
        href={next}
        className={`${styles.pageLink} ${page >= totalPages ? styles.pageLinkDisabled : ''}`}
        aria-disabled={page >= totalPages}
      >
        Next →
      </Link>
    </nav>
  );
}

export function parsePage(raw: string | undefined) {
  const n = Number.parseInt(raw || '1', 10);
  return Number.isFinite(n) && n > 0 && n < 10000 ? n : 1;
}

export function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
