// Shared (client-safe) types + helpers for student portfolios.
// The stored shape lives in the Wix CMS collection "StudentPortfolios" (one row per student).

export interface PortfolioAcademic { label: string; detail: string; score: string }
export interface PortfolioActivity { title: string; org: string; years: string; detail: string }
export interface PortfolioProject { title: string; tagline: string; tags: string[]; year: string; link: string }
export interface PortfolioAward { tag: string; title: string; subtitle: string; detail: string }
export interface PortfolioCertification { issuer: string; title: string }
export interface PortfolioSkillGroup { name: string; skills: string[] }
export interface PortfolioJourneyHighlight { title: string; detail: string }
export interface PortfolioSeason { title: string; years: string; highlights: PortfolioJourneyHighlight[] }
export interface PortfolioLinks { email: string; linkedin: string; github: string; website: string; cv: string }

/** What a student edits and what is stored per row in Wix. */
export interface PortfolioRecord {
  username: string;
  published: boolean;
  fullName: string;
  photo: string;
  /** true when `photo` is a background-removed cutout (rendered with the spotlight). */
  photoCutout: boolean;
  grade: string;
  stream: string;
  school: string;
  city: string;
  dream: string;
  bio: string;
  academics: PortfolioAcademic[];
  activities: PortfolioActivity[];
  projects: PortfolioProject[];
  awards: PortfolioAward[];
  certifications: PortfolioCertification[];
  skills: PortfolioSkillGroup[];
  journey: PortfolioSeason[];
  links: PortfolioLinks;
}

/** What the public /[username] page renders. */
export interface PortfolioProfile {
  username: string;
  firstName: string;
  fullName: string;
  initials: string;
  photoUrl: string;
  photoCutout: boolean;
  grade: string;
  stream: string;
  school: string;
  location: string;
  dream: string;
  bio: string;
  academics: PortfolioAcademic[];
  activities: PortfolioActivity[];
  projects: PortfolioProject[];
  awards: PortfolioAward[];
  certifications: PortfolioCertification[];
  skills: PortfolioSkillGroup[];
  seasons: PortfolioSeason[];
  links: { label: string; href: string }[];
}

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,29}$/;

/** Top-level routes (and common words) that can never be used as a portfolio username. */
export const RESERVED_USERNAMES = new Set([
  'about-us', 'blog', 'book-a-demo', 'career-library', 'career-roadmap', 'dashboard',
  'demo-confirmation', 'discover', 'iq-test', 'privacy', 'psychometric-assessment',
  'psychometric-test', 'sample-report', 'sample-reports', 'submit-review', 'terms',
  'university-finder', 'api', 'auth', 'join-community', 'join-counsellor-community',
  'parent-assessment', 'signup', 'admin', 'demo', 'login', 'logout', 'register', 'settings',
  'robots', 'sitemap', 'manifest', 'favicon', 'static', 'public', 'www', 'help', 'support',
  'portfolio', 'portfolios', 'courses', 'course', 'resume', 'student', 'students', 'counsellor', 'contact', 'home', 'clarvo',
  'null', 'undefined', '_next',
]);

export function usernameError(username: string): string | null {
  if (!username) return 'Choose a username for your portfolio URL.';
  if (!USERNAME_PATTERN.test(username)) {
    return 'Use 3–30 characters: lowercase letters, numbers, - or _ (must start with a letter or number).';
  }
  if (RESERVED_USERNAMES.has(username)) return 'This username is reserved. Please pick another.';
  return null;
}

export function suggestUsername(name: string): string {
  const slug = (name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);
  return slug.length >= 3 ? slug : '';
}

export function emptyPortfolioRecord(): PortfolioRecord {
  return {
    username: '',
    published: true,
    fullName: '',
    photo: '',
    photoCutout: false,
    grade: '',
    stream: '',
    school: '',
    city: '',
    dream: '',
    bio: '',
    academics: [],
    activities: [],
    projects: [],
    awards: [],
    certifications: [],
    skills: [],
    journey: [],
    links: { email: '', linkedin: '', github: '', website: '', cv: '' },
  };
}

function safeHref(url: string): string {
  const u = (url || '').trim();
  return /^https?:\/\//i.test(u) ? u : '';
}

export function recordToProfile(record: PortfolioRecord): PortfolioProfile {
  const fullName = record.fullName.trim() || record.username;
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = parts[0] || fullName;
  const initials = (parts.length > 1 ? parts[0][0] + parts[1][0] : firstName.slice(0, 2)).toUpperCase();

  const links: { label: string; href: string }[] = [];
  if (record.links.email) links.push({ label: 'Email', href: `mailto:${record.links.email}` });
  const pushLink = (label: string, url: string) => {
    const href = safeHref(url);
    if (href) links.push({ label, href });
  };
  pushLink('LinkedIn', record.links.linkedin);
  pushLink('GitHub', record.links.github);
  pushLink('Website', record.links.website);
  pushLink('Download CV', record.links.cv);

  return {
    username: record.username,
    firstName,
    fullName,
    initials,
    photoUrl: safeHref(record.photo),
    photoCutout: Boolean(record.photo) && record.photoCutout,
    grade: record.grade,
    stream: record.stream,
    school: record.school,
    location: record.city,
    dream: record.dream,
    bio: record.bio,
    academics: record.academics,
    activities: record.activities,
    projects: record.projects.map((p) => ({ ...p, link: safeHref(p.link) })),
    awards: record.awards,
    certifications: record.certifications,
    skills: record.skills.filter((g) => g.skills.length > 0),
    seasons: record.journey,
    links,
  };
}
