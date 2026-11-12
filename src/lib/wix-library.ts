// ═══════════════════════════════════════════════════════════
// Read-only access to the Wix CMS libraries shown in the student dashboard:
//   • Import4 — SOP / essay dataset
//   • Import6 — Admitted students dataset
// Server-only (uses WIX_API_KEY). Both collections are publicly readable.
// ═══════════════════════════════════════════════════════════
import { cache } from 'react';

const WIX_DATA = 'https://www.wixapis.com/wix-data/v2';
const SOP_COLLECTION = 'Import4';
const ADMITTED_COLLECTION = 'Import6';
export const LIBRARY_PAGE_SIZE = 24;

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: process.env.WIX_API_KEY || '',
    'wix-site-id': process.env.WIX_SITE_ID || '',
  };
}

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);
const safeUrl = (v: unknown): string => {
  const u = text(v);
  return /^https?:\/\//i.test(u) ? u : '';
};
/** Escape characters with special meaning in Wix `$contains` is unnecessary; just trim & cap. */
const cleanQuery = (q: string) => q.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 80);

interface QueryResult {
  items: Record<string, unknown>[];
  total: number;
}

async function query(
  collection: string,
  filter: Record<string, unknown>,
  page: number,
  sort: { fieldName: string; order: 'ASC' | 'DESC' }[],
): Promise<QueryResult> {
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) return { items: [], total: 0 };
  const res = await fetch(`${WIX_DATA}/items/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      dataCollectionId: collection,
      query: {
        filter,
        sort,
        paging: { limit: LIBRARY_PAGE_SIZE, offset: (Math.max(1, page) - 1) * LIBRARY_PAGE_SIZE },
      },
      returnTotalCount: true,
    }),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    console.error(`[WixLibrary] ${collection} query failed: HTTP ${res.status}`);
    throw new Error('Library is temporarily unavailable.');
  }
  const json = await res.json();
  return {
    items: (json.dataItems || []).map((i: { data?: Record<string, unknown> }) => i.data || {}),
    total: json.pagingMetadata?.total ?? 0,
  };
}

async function getById(collection: string, id: string): Promise<Record<string, unknown> | null> {
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) return null;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) return null;
  const res = await fetch(`${WIX_DATA}/items/${encodeURIComponent(id)}?dataCollectionId=${collection}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.error(`[WixLibrary] ${collection} get failed: HTTP ${res.status}`);
    throw new Error('Library is temporarily unavailable.');
  }
  const json = await res.json();
  return json?.dataItem?.data || null;
}

/* ───────────────────────── SOPs (Import4) ───────────────────────── */

export const SOP_LEVELS = [
  { value: 'UG - Undergrad', label: 'Undergraduate' },
  { value: 'PG - Postgrad', label: 'Postgraduate' },
  { value: 'PhD', label: 'PhD' },
] as const;

export interface SopSummary {
  id: string;
  title: string;
  program: string;
  author: string;
  level: string;
  type: string;
  excerpt: string;
  words: number;
}

export interface SopDetail extends SopSummary {
  essay: string;
  license: string;
  link: string;
  originalLink: string;
}

function levelLabel(raw: string) {
  return SOP_LEVELS.find((l) => l.value === raw)?.label || raw;
}

function mapSop(d: Record<string, unknown>): SopDetail {
  const essay = text(d.essay);
  const flat = essay.replace(/\s+/g, ' ');
  return {
    id: text(d._id),
    title: text(d.title) || 'Untitled essay',
    program: text(d.program),
    author: text(d.author),
    level: levelLabel(text(d.categoryLevel)),
    type: text(d.type),
    excerpt: flat.length > 260 ? `${flat.slice(0, 260).replace(/\s+\S*$/, '')}…` : flat,
    words: flat ? flat.split(' ').length : 0,
    essay,
    license: text(d.license),
    link: safeUrl(d.link),
    originalLink: safeUrl(d.originalLink),
  };
}

export async function listSops(opts: { q?: string; level?: string; page?: number }) {
  const q = cleanQuery(opts.q || '');
  // A few rows are section headers ("PHD", "UNDER GRAD"…) with no title — skip them.
  const filters: Record<string, unknown>[] = [{ title: { $exists: true } }, { essay: { $exists: true } }];
  if (q) {
    filters.push({
      $or: [{ title: { $contains: q } }, { program: { $contains: q } }, { author: { $contains: q } }],
    });
  }
  if (opts.level && SOP_LEVELS.some((l) => l.value === opts.level)) {
    filters.push({ categoryLevel: opts.level });
  }
  const filter = { $and: filters };
  const { items, total } = await query(SOP_COLLECTION, filter, opts.page || 1, [{ fieldName: 'title', order: 'ASC' }]);
  return {
    items: items.map((d) => {
      const { essay: _essay, license: _l, link: _k, originalLink: _o, ...summary } = mapSop(d);
      return summary as SopSummary;
    }),
    total,
  };
}

export const getSop = cache(async (id: string): Promise<SopDetail | null> => {
  const d = await getById(SOP_COLLECTION, id);
  return d && text(d.title) && text(d.essay) ? mapSop(d) : null;
});

/* ───────────────────────── Admitted students (Import6) ───────────────────────── */

export const DECISIONS = ['Accepted', 'Accepted (Scholarship)', 'Accepted (Waitlist → Admitted)'] as const;
export const COLLEGE_TYPES = ['Ivy League', 'Private', 'Public'] as const;

export interface AdmittedSummary {
  id: string;
  name: string;
  college: string;
  location: string;
  collegeType: string;
  decision: string;
  applicationType: string;
  classYear: number | null;
  major: string;
  gpa: number | null;
  sat: number | null;
  act: number | null;
  home: string;
}

export interface AdmittedDetail extends AdmittedSummary {
  gpaWeighted: number | null;
  satMath: number | null;
  satEbrw: number | null;
  classRank: string;
  apCount: number | null;
  apCourses: string;
  apScores: string;
  ibCount: number | null;
  ibCourses: string;
  extracurriculars: string;
  extracurricularCount: number | null;
  awards: string;
  awardsCount: number | null;
  leadership: string;
  service: string;
  sports: string;
  research: string;
  work: string;
  gender: string;
  ethnicity: string;
  firstGeneration: string;
  international: string;
  schoolType: string;
  essaysCount: number | null;
  personalStatement: string;
  supplementalEssays: string;
  recommendations: string;
  interview: string;
  sourceUrl: string;
}

/** Treat "N/A", "None", "-" etc. as empty so we don't render meaningless sections. */
const meaningful = (v: unknown) => {
  const t = text(v);
  return /^(n\/?a|none|nil|-+|null|0)$/i.test(t) ? '' : t;
};

function mapAdmitted(d: Record<string, unknown>): AdmittedDetail {
  return {
    id: text(d._id),
    name: text(d.studentName) || 'Anonymous student',
    college: text(d.admittedCollege),
    location: text(d.collegeLocation),
    collegeType: text(d.collegeType),
    decision: text(d.admissionDecision),
    applicationType: text(d.applicationType),
    classYear: num(d.classYear),
    major: text(d.intendedMajor),
    gpa: num(d.gpaUnweighted40),
    sat: num(d.satScoreTotal),
    act: num(d.actScore),
    home: text(d.stateCountry),
    gpaWeighted: num(d.gpaWeighted),
    satMath: num(d.satMath),
    satEbrw: num(d.satEbrw),
    classRank: meaningful(d.classRank),
    apCount: num(d.numberOfApCourses),
    apCourses: meaningful(d.apCoursesTaken),
    apScores: meaningful(d.apScores),
    ibCount: num(d.numberOfIbCourses),
    ibCourses: meaningful(d.ibCoursesDiploma),
    extracurriculars: meaningful(d.extracurricularActivities),
    extracurricularCount: num(d.numberOfExtracurriculars),
    awards: meaningful(d.awardsHonors),
    awardsCount: num(d.numberOfAwards),
    leadership: meaningful(d.leadershipPositions),
    service: meaningful(d.communityServiceVolunteering),
    sports: meaningful(d.sportsAthletics),
    research: meaningful(d.researchExperience),
    work: meaningful(d.workExperience),
    gender: meaningful(d.gender),
    ethnicity: meaningful(d.ethnicity),
    firstGeneration: meaningful(d.firstGeneration),
    international: meaningful(d.internationalStudent),
    schoolType: meaningful(d.schoolType),
    essaysCount: num(d.numberOfEssays),
    personalStatement: meaningful(d.personalStatementEssay),
    supplementalEssays: meaningful(d.supplementalEssays),
    recommendations: meaningful(d.lettersOfRecommendation),
    interview: meaningful(d.interview),
    sourceUrl: safeUrl(d.profileUrl) || safeUrl(d.source),
  };
}

/** Rows entered as tests (e.g. college "a") carry no useful information. */
const isUsable = (s: AdmittedSummary) => s.college.length >= 3 && s.name.length >= 2;

export async function listAdmitted(opts: { q?: string; decision?: string; type?: string; page?: number }) {
  const q = cleanQuery(opts.q || '');
  const filters: Record<string, unknown>[] = [];
  if (q) {
    filters.push({
      $or: [
        { studentName: { $contains: q } },
        { admittedCollege: { $contains: q } },
        { intendedMajor: { $contains: q } },
      ],
    });
  }
  if (opts.decision && (DECISIONS as readonly string[]).includes(opts.decision)) filters.push({ admissionDecision: opts.decision });
  if (opts.type && (COLLEGE_TYPES as readonly string[]).includes(opts.type)) filters.push({ collegeType: opts.type });
  const filter = filters.length === 0 ? {} : filters.length === 1 ? filters[0] : { $and: filters };
  const { items, total } = await query(ADMITTED_COLLECTION, filter, opts.page || 1, [
    { fieldName: 'admittedCollege', order: 'ASC' },
  ]);
  return { items: items.map(mapAdmitted).filter(isUsable), total };
}

export const getAdmitted = cache(async (id: string): Promise<AdmittedDetail | null> => {
  const d = await getById(ADMITTED_COLLECTION, id);
  if (!d) return null;
  const s = mapAdmitted(d);
  return isUsable(s) ? s : null;
});
