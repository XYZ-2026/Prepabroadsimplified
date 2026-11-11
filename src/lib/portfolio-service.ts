// ═══════════════════════════════════════════════════════════
// Student Portfolio Service — Wix CMS collection "StudentPortfolios"
// One row per student. Row _id === Firebase uid.
// Server-only: uses WIX_API_KEY. Never import from client components.
// ═══════════════════════════════════════════════════════════
import {
  emptyPortfolioRecord,
  usernameError,
  type PortfolioRecord,
} from '@/components/portfolio/portfolioTypes';

const WIX_DATA = 'https://www.wixapis.com/wix-data/v2';
const WIX_MEDIA = 'https://www.wixapis.com/site-media/v1';
export const PORTFOLIO_COLLECTION_ID = 'StudentPortfolios';

function wixHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: process.env.WIX_API_KEY || '',
    'wix-site-id': process.env.WIX_SITE_ID || '',
  };
}

function assertConfigured() {
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) {
    throw new Error('Portfolio storage is not configured (WIX_API_KEY / WIX_SITE_ID missing).');
  }
}

/* ───────────── Sanitising ───────────── */

const str = (v: unknown, max = 200): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

const longStr = (v: unknown, max = 1200): string =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

function list<T>(v: unknown, max: number, map: (item: Record<string, unknown>) => T, keep: (t: T) => boolean): T[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .slice(0, max)
    .map(map)
    .filter(keep);
}

function stringList(v: unknown, maxItems: number, maxLen = 40): string[] {
  const raw = Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : [];
  return raw.map((s) => str(s, maxLen)).filter(Boolean).slice(0, maxItems);
}

function url(v: unknown): string {
  let u = str(v, 400);
  if (!u) return '';
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function email(v: unknown): string {
  const e = str(v, 120);
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(e) ? e : '';
}

function photo(v: unknown): string {
  const u = str(v, 400);
  // Only accept images hosted in this site's Wix media library.
  return /^https:\/\/static\.wixstatic\.com\/media\/[A-Za-z0-9_~.\-]+$/.test(u) ? u : '';
}

function highlights(v: unknown) {
  if (typeof v === 'string') {
    return v
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((line) => {
        const idx = line.search(/[:—–]/);
        return idx > 0
          ? { title: str(line.slice(0, idx), 80), detail: str(line.slice(idx + 1), 300) }
          : { title: str(line, 80), detail: '' };
      });
  }
  return list(v, 8, (h) => ({ title: str(h.title, 80), detail: str(h.detail, 300) }), (h) => !!h.title);
}

export function sanitizePortfolio(input: unknown): PortfolioRecord {
  const b = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const links = (b.links && typeof b.links === 'object' ? b.links : {}) as Record<string, unknown>;

  return {
    username: str(b.username, 30).toLowerCase(),
    published: b.published !== false,
    fullName: str(b.fullName, 80),
    photo: photo(b.photo),
    photoCutout: b.photoCutout === true && Boolean(photo(b.photo)),
    grade: str(b.grade, 40),
    stream: str(b.stream, 60),
    school: str(b.school, 120),
    city: str(b.city, 60),
    dream: str(b.dream, 80),
    bio: longStr(b.bio, 800),
    academics: list(b.academics, 10, (a) => ({ label: str(a.label, 100), detail: str(a.detail, 160), score: str(a.score, 30) }), (a) => !!a.label),
    activities: list(b.activities, 12, (a) => ({ title: str(a.title, 100), org: str(a.org, 100), years: str(a.years, 40), detail: str(a.detail, 300) }), (a) => !!a.title),
    projects: list(b.projects, 12, (p) => ({ title: str(p.title, 80), tagline: str(p.tagline, 300), tags: stringList(p.tags, 6), year: str(p.year, 12), link: url(p.link) }), (p) => !!p.title),
    awards: list(b.awards, 12, (a) => ({ tag: str(a.tag, 30), title: str(a.title, 60), subtitle: str(a.subtitle, 80), detail: str(a.detail, 200) }), (a) => !!a.title),
    certifications: list(b.certifications, 20, (c) => ({ issuer: str(c.issuer, 60), title: str(c.title, 100) }), (c) => !!c.title),
    skills: list(b.skills, 8, (g) => ({ name: str(g.name, 30), skills: stringList(g.skills, 15) }), (g) => !!g.name && g.skills.length > 0),
    journey: list(b.journey, 8, (s) => ({ title: str(s.title, 80), years: str(s.years, 30), highlights: highlights(s.highlights) }), (s) => !!s.title),
    links: {
      email: email(links.email),
      linkedin: url(links.linkedin),
      github: url(links.github),
      website: url(links.website),
      cv: url(links.cv),
    },
  };
}

/* ───────────── Mapping Wix rows ───────────── */

function rowToRecord(data: Record<string, unknown>): PortfolioRecord {
  const base = sanitizePortfolio({ ...data, fullName: data.title });
  return { ...emptyPortfolioRecord(), ...base };
}

function recordToRow(uid: string, userEmail: string, record: PortfolioRecord) {
  const { fullName, ...rest } = record;
  return {
    ...rest,
    title: fullName,
    uid,
    email: userEmail,
    updatedAt: new Date().toISOString(),
  };
}

/* ───────────── Data access ───────────── */

export async function getPortfolioByUid(uid: string): Promise<PortfolioRecord | null> {
  assertConfigured();
  const res = await fetch(
    `${WIX_DATA}/items/${encodeURIComponent(uid)}?dataCollectionId=${PORTFOLIO_COLLECTION_ID}`,
    { headers: wixHeaders(), cache: 'no-store' },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Wix read failed (HTTP ${res.status})`);
  const json = await res.json();
  const data = json?.dataItem?.data;
  return data ? rowToRecord(data) : null;
}

async function queryByUsername(username: string): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const res = await fetch(`${WIX_DATA}/items/query`, {
    method: 'POST',
    headers: wixHeaders(),
    cache: 'no-store',
    body: JSON.stringify({
      dataCollectionId: PORTFOLIO_COLLECTION_ID,
      query: { filter: { username }, paging: { limit: 1 } },
    }),
  });
  if (!res.ok) throw new Error(`Wix query failed (HTTP ${res.status})`);
  const json = await res.json();
  const item = (json?.dataItems || [])[0];
  return item ? { id: item.id || item.data?._id, data: item.data || {} } : null;
}

/** Public lookup used by the /[username] page. Returns null when missing or unpublished. */
export async function getPublishedPortfolioByUsername(username: string): Promise<PortfolioRecord | null> {
  if (!process.env.WIX_API_KEY || !process.env.WIX_SITE_ID) return null;
  try {
    const hit = await queryByUsername(username.toLowerCase());
    if (!hit) return null;
    const record = rowToRecord(hit.data);
    return record.published ? record : null;
  } catch (err) {
    console.error('[Portfolio] Public lookup failed:', err);
    return null;
  }
}

export class PortfolioValidationError extends Error {}

export async function savePortfolio(uid: string, userEmail: string, input: unknown): Promise<PortfolioRecord> {
  assertConfigured();
  const record = sanitizePortfolio(input);

  const uError = usernameError(record.username);
  if (uError) throw new PortfolioValidationError(uError);
  if (!record.fullName) throw new PortfolioValidationError('Please enter the name to show on your portfolio.');

  const taken = await queryByUsername(record.username);
  if (taken && taken.id !== uid) {
    throw new PortfolioValidationError('That username is already taken. Please choose another.');
  }

  const res = await fetch(`${WIX_DATA}/items/save`, {
    method: 'POST',
    headers: wixHeaders(),
    body: JSON.stringify({
      dataCollectionId: PORTFOLIO_COLLECTION_ID,
      dataItem: { id: uid, data: recordToRow(uid, userEmail, record) },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[Portfolio] Wix save failed:', res.status, text.slice(0, 300));
    throw new Error('Could not save your portfolio right now. Please try again.');
  }
  return record;
}

/* ───────────── Photo upload (Wix Media Manager) ───────────── */

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function looksLikeImage(bytes: Uint8Array, mime: string): boolean {
  if (mime === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (mime === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (mime === 'image/webp') {
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }
  return false;
}

export async function uploadPortfolioPhoto(uid: string, file: File): Promise<string> {
  assertConfigured();
  const ext = PHOTO_TYPES[file.type];
  if (!ext) throw new PortfolioValidationError('Please upload a JPG, PNG or WebP image.');
  if (file.size > PHOTO_MAX_BYTES) throw new PortfolioValidationError('Photo must be 5 MB or smaller.');

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeImage(bytes, file.type)) throw new PortfolioValidationError('That file does not look like a valid image.');

  const safeUid = uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 40) || 'student';
  const fileName = `portfolio-${safeUid}-${Date.now()}.${ext}`;

  const gen = await fetch(`${WIX_MEDIA}/files/generate-upload-url`, {
    method: 'POST',
    headers: wixHeaders(),
    body: JSON.stringify({ mimeType: file.type, fileName, parentFolderId: 'media-root' }),
  });
  if (!gen.ok) {
    console.error('[Portfolio] generate-upload-url failed:', gen.status);
    throw new Error('Could not upload photo right now. Please try again.');
  }
  const { uploadUrl } = await gen.json();
  if (!uploadUrl) throw new Error('Could not upload photo right now. Please try again.');

  const put = await fetch(`${uploadUrl}?filename=${encodeURIComponent(fileName)}`, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: bytes,
  });
  if (!put.ok) {
    console.error('[Portfolio] Media PUT failed:', put.status);
    throw new Error('Could not upload photo right now. Please try again.');
  }
  const json = await put.json();
  const fileUrl: string | undefined = json?.file?.url;
  if (!fileUrl || !photo(fileUrl)) throw new Error('Photo uploaded but no usable URL was returned.');
  return fileUrl;
}
