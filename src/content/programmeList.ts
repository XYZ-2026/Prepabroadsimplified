/** Names and links only: small enough for the navbar. Full page copy is in programmesContent.ts. */
export type ProgrammeKind = 'single' | 'track' | 'all' | 'incubator';

export interface ProgrammeInfo {
  slug: string;
  name: string;
  kind: ProgrammeKind;
  /** Single programmes a track is made of. */
  includes?: string[];
}

const single = (slug: string, subject: string): ProgrammeInfo => ({ slug: `jr-mba-${slug}`, name: `Jr MBA in ${subject}`, kind: 'single' });
const track = (slug: string, name: string, includes: string[]): ProgrammeInfo => ({
  slug,
  name,
  kind: 'track',
  includes: includes.map((s) => `jr-mba-${s}`),
});

export const SINGLES = [
  single('advertising', 'Advertising'),
  single('design-branding', 'Design & Branding'),
  single('technology', 'Technology'),
  single('ux-design', 'UX Design'),
  single('data-analytics', 'Data Analytics'),
  single('entrepreneurship', 'Entrepreneurship'),
  single('digital-marketing', 'Digital Marketing'),
  single('finance', 'Finance'),
  single('artificial-intelligence', 'Artificial Intelligence'),
  single('consulting', 'Consulting'),
];

export const TRACKS = [
  track('young-founder', 'Young Founder', ['entrepreneurship', 'technology', 'advertising']),
  track('young-cmo', 'Young Marketing Chief', ['advertising', 'design-branding', 'digital-marketing']),
  track('young-cfo', 'Young Finance Chief', ['entrepreneurship', 'finance', 'data-analytics']),
  track('young-cto', 'Young Technology Chief', ['entrepreneurship', 'ux-design', 'technology']),
  track('young-cso', 'Young Strategy Chief', ['entrepreneurship', 'consulting', 'data-analytics']),
];

export const YOUNG_CEO: ProgrammeInfo = { slug: 'young-ceo', name: 'Young CEO', kind: 'all', includes: SINGLES.map((s) => s.slug) };
export const INCUBATOR: ProgrammeInfo = { slug: 'launchpad', name: 'Launchpad Incubator', kind: 'incubator' };

export const PROGRAMMES: ProgrammeInfo[] = [INCUBATOR, ...TRACKS, YOUNG_CEO, ...SINGLES];

export const JR_MBA_URL = '/summer-school/jr-mba';
export const BATCHES_URL = '/summer-school/batches';

export const programmeUrl = (slug: string) => `/summer-school/${slug}`;
export const findProgramme = (slug: string) => PROGRAMMES.find((p) => p.slug === slug);
