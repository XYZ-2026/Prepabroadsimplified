// Builds a cinematic portfolio (the same shape the public /[username] page renders) from an
// admitted-student row. It is a curated story, not a copy of the admission profile: sensitive
// background fields and the full essays are intentionally left out.
import type {
  PortfolioAcademic,
  PortfolioActivity,
  PortfolioAward,
  PortfolioCertification,
  PortfolioProfile,
  PortfolioProject,
  PortfolioSeason,
  PortfolioSkillGroup,
} from '@/components/portfolio/portfolioTypes';
import type { AdmittedDetail } from './wix-library';

export const ADMITTED_USERNAME_PREFIX = 'admitted-';
export const admittedPortfolioPath = (username: string) => `/admitted/${encodeURIComponent(username)}`;

/** Splits "1. A\n2. B" / "A; B; C" style text into list items. */
export function toItems(text: string): string[] {
  if (!text) return [];
  let parts = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  // "A; B; C" lists — but only break where a new item starts, so "did X; published Y" stays together.
  if (parts.length === 1 && parts[0].includes(';')) parts = parts[0].split(/;\s*(?=[A-Z0-9"“(])/).map((p) => p.trim()).filter(Boolean);
  return parts.map((p) => p.replace(/^(\d+[.)]|[-•*])\s*/, '')).filter(Boolean);
}

/** "Title: detail" / "Title - detail" / "Title (detail)" → { title, detail }. */
function splitItem(text: string): { title: string; detail: string } {
  const colon = text.match(/^([^:]{2,90}):\s+(.+)$/);
  if (colon) return { title: colon[1].trim(), detail: colon[2].trim() };
  const dash = text.match(/^(.{2,90}?)\s+[—–-]\s+(.+)$/);
  if (dash) return { title: dash[1].trim(), detail: dash[2].trim() };
  const paren = text.match(/^(.{2,90}?)\s*\((.+)\)\s*$/);
  if (paren) return { title: paren[1].trim(), detail: paren[2].trim() };
  return { title: text.length > 90 ? `${text.slice(0, 87).trim()}…` : text, detail: text.length > 90 ? text : '' };
}

const clip = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1).trim()}…` : v);
const fmtGpa = (v: number) => (Number.isInteger(v) ? v.toFixed(1) : v.toFixed(2));
const yes = (v: string) => /^(yes|y|true)/i.test(v.trim());

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

function academicsFor(st: AdmittedDetail): PortfolioAcademic[] {
  const rows: PortfolioAcademic[] = [];
  if (st.gpa || st.gpaWeighted) {
    rows.push({
      label: 'High school GPA',
      detail: [st.gpaWeighted ? `Weighted ${fmtGpa(st.gpaWeighted)}` : '', st.classRank ? `Class rank ${st.classRank}` : '']
        .filter(Boolean)
        .join(' · ') || 'Unweighted, 4.0 scale',
      score: st.gpa ? `${fmtGpa(st.gpa)} / 4.0` : `${fmtGpa(st.gpaWeighted as number)} W`,
    });
  }
  if (st.sat) {
    rows.push({
      label: 'SAT',
      detail: [st.satMath ? `Math ${st.satMath}` : '', st.satEbrw ? `Reading & Writing ${st.satEbrw}` : ''].filter(Boolean).join(' · ') || 'Composite score',
      score: `${st.sat}`,
    });
  }
  if (st.act) rows.push({ label: 'ACT', detail: 'Composite score', score: `${st.act} / 36` });
  if (st.apCount) {
    const courses = toItems(st.apCourses).slice(0, 4).join(', ');
    rows.push({ label: 'Advanced Placement', detail: courses || 'AP coursework', score: `${st.apCount} course${st.apCount > 1 ? 's' : ''}` });
  }
  if (st.ibCount || st.ibCourses) {
    rows.push({ label: 'International Baccalaureate', detail: clip(st.ibCourses || 'IB coursework', 120), score: st.ibCount ? `${st.ibCount} course${st.ibCount > 1 ? 's' : ''}` : 'IB' });
  }
  return rows;
}

/** "Club Name (Role)" → { role, org }. */
function roleAndOrg(title: string): { role: string; org: string } | null {
  const m = title.match(/^(.+?)\s*\(([^()]{2,60})\)\s*$/);
  return m ? { role: m[2].trim(), org: m[1].trim() } : null;
}

function activitiesFor(st: AdmittedDetail): PortfolioActivity[] {
  const groups: [string, string][] = [
    ['Activity', st.extracurriculars],
    ['Leadership', st.leadership],
    ['Community service', st.service],
    ['Athletics', st.sports],
    ['Work experience', st.work],
  ];
  const seen = new Set<string>();
  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const out: PortfolioActivity[] = [];
  for (const [category, text] of groups) {
    for (const raw of toItems(text).slice(0, 5)) {
      const { title, detail } = splitItem(raw);
      const ro = roleAndOrg(title);
      const item: PortfolioActivity = ro
        ? { title: ro.role, org: ro.org, years: '', detail: clip(detail, 180) }
        : // "Role: Organisation" (typical leadership line) or a plain activity
          category === 'Leadership' && detail && detail.length <= 90
          ? { title, org: detail, years: '', detail: '' }
          : { title, org: category, years: '', detail: clip(detail, 180) };
      // The same role often appears under both activities and leadership.
      // (The category label itself is never a key, or a second item in a category would vanish.)
      const keys = [norm(`${item.title} ${item.org}`), norm(item.title), norm(raw)];
      if (item.org !== category) keys.push(norm(item.org));
      if (keys.some((k) => k && seen.has(k))) continue;
      keys.forEach((k) => k && seen.add(k));
      out.push(item);
    }
  }
  return out.slice(0, 9);
}

function projectsFor(st: AdmittedDetail): PortfolioProject[] {
  return toItems(st.research)
    .slice(0, 4)
    .map((raw) => {
      const { title, detail } = splitItem(raw);
      return { title, tagline: clip(detail || 'Independent research experience.', 200), tags: ['Research', st.major].filter(Boolean), year: '', link: '' };
    });
}

function awardsFor(st: AdmittedDetail): PortfolioAward[] {
  // Only what the dataset states — no invented level (state/national) tags.
  return toItems(st.awards)
    .slice(0, 8)
    .map((raw) => {
      const { title, detail } = splitItem(raw);
      return { tag: '', title: clip(title, 70), subtitle: '', detail: clip(detail, 160) };
    });
}

function certificationsFor(st: AdmittedDetail): PortfolioCertification[] {
  // AP exam results read naturally as earned credentials.
  return toItems(st.apScores)
    .slice(0, 8)
    .map((raw) => {
      const m = raw.match(/^(.*?)[\s:–—-]+\(?(\d)\)?\s*$/);
      return m
        ? { issuer: `AP Exam · Score ${m[2]}`, title: m[1].replace(/^AP\s+/i, '').trim() }
        : { issuer: 'AP Exam', title: raw.replace(/^AP\s+/i, '') };
    })
    .filter((c) => c.title);
}

function skillsFor(st: AdmittedDetail): PortfolioSkillGroup[] {
  const groups: PortfolioSkillGroup[] = [];
  const subjects = toItems(st.apCourses)
    .map((c) => c.replace(/^AP\s+/i, '').replace(/\s*\(.*\)$/, '').trim())
    .filter(Boolean)
    .slice(0, 8);
  if (subjects.length) groups.push({ name: 'Coursework', skills: subjects });

  const strengths: string[] = [];
  if (st.leadership) strengths.push('Leadership');
  if (st.research) strengths.push('Research');
  if (st.service) strengths.push('Community impact');
  if (st.sports) strengths.push('Athletics');
  if (st.work) strengths.push('Work ethic');
  if (st.awards) strengths.push('Competition');
  if (st.personalStatement || st.supplementalEssays) strengths.push('Storytelling');
  if (strengths.length) groups.push({ name: 'Profile strengths', skills: strengths });

  if (st.major) groups.push({ name: 'Focus', skills: [st.major] });
  return groups;
}

function journeyFor(st: AdmittedDetail): PortfolioSeason[] {
  const seasons: PortfolioSeason[] = [];

  const foundation = [
    st.gpa ? { title: `${fmtGpa(st.gpa)} GPA`, detail: st.classRank ? `Class rank ${st.classRank}.` : 'Consistent grades across high school.' } : null,
    st.sat ? { title: `SAT ${st.sat}`, detail: 'A standardised score that strengthened the application.' } : st.act ? { title: `ACT ${st.act}`, detail: 'A standardised score that strengthened the application.' } : null,
    st.apCount ? { title: `${st.apCount} AP courses`, detail: 'Took on a rigorous curriculum.' } : null,
  ].filter(Boolean) as PortfolioSeason['highlights'];
  if (foundation.length) seasons.push({ title: 'Season 1 · The Foundation', years: 'High school', highlights: foundation });

  const beyond = [
    toItems(st.leadership)[0] ? { title: 'Leading', detail: clip(splitItem(toItems(st.leadership)[0]).title, 120) } : null,
    toItems(st.extracurriculars)[0] ? { title: 'Building', detail: clip(splitItem(toItems(st.extracurriculars)[0]).title, 120) } : null,
    toItems(st.awards)[0] ? { title: 'Winning', detail: clip(splitItem(toItems(st.awards)[0]).title, 120) } : null,
    toItems(st.service)[0] ? { title: 'Giving back', detail: clip(splitItem(toItems(st.service)[0]).title, 120) } : null,
  ].filter(Boolean) as PortfolioSeason['highlights'];
  if (beyond.length) seasons.push({ title: 'Season 2 · Beyond the Classroom', years: 'High school', highlights: beyond.slice(0, 3) });

  const application = [
    st.applicationType ? { title: st.applicationType, detail: `Applied to ${st.college}.` } : null,
    st.essaysCount ? { title: `${st.essaysCount} essay${st.essaysCount > 1 ? 's' : ''}`, detail: 'Told a clear, personal story in writing.' } : st.personalStatement ? { title: 'Personal statement', detail: 'Told a clear, personal story in writing.' } : null,
    st.interview && yes(st.interview) ? { title: 'Interview', detail: 'Met with the admissions team.' } : null,
  ].filter(Boolean) as PortfolioSeason['highlights'];
  if (application.length) seasons.push({ title: 'Season 3 · The Application', years: st.classYear ? `${st.classYear - 1}` : 'Senior year', highlights: application });

  seasons.push({
    title: 'Finale · The Decision',
    years: st.classYear ? `Class of ${st.classYear}` : 'Admitted',
    highlights: [
      { title: st.decision || 'Accepted', detail: `${st.college}${st.location ? `, ${st.location}` : ''}.` },
      ...(st.major ? [{ title: 'Next chapter', detail: `Studying ${st.major}.` }] : []),
    ],
  });
  return seasons;
}

const joinList = (items: string[]) =>
  items.length <= 1 ? items[0] || '' : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

function bioFor(st: AdmittedDetail, firstName: string): string {
  const scholarship = /scholarship/i.test(st.decision) ? ' with a scholarship' : '';
  const major = st.major ? ` to study ${st.major}` : '';
  const strengths = [st.leadership && 'leadership', st.research && 'research', st.service && 'service', st.awards && 'award-winning work']
    .filter(Boolean)
    .slice(0, 3) as string[];
  const pillars = [
    st.gpa ? `a ${fmtGpa(st.gpa)} GPA` : '',
    st.sat ? `a ${st.sat} SAT` : st.act ? `a ${st.act} ACT` : '',
    strengths.length ? `a record of ${joinList(strengths)}` : '',
  ].filter(Boolean);
  const built = pillars.length ? ` ${firstName}'s application stood on ${pillars.length > 2 ? `${pillars.slice(0, -1).join(', ')} and ${pillars[pillars.length - 1]}` : pillars.join(' and ')}.` : '';
  return `${st.name} was admitted to ${st.college}${scholarship}${major}.${built}`;
}

export function admittedToPortfolio(st: AdmittedDetail): PortfolioProfile {
  const fullName = st.name.trim();
  const firstName = fullName.split(/\s+/)[0] || fullName;
  const links: PortfolioProfile['links'] = [];
  if (st.sourceUrl) links.push({ label: 'Original profile', href: st.sourceUrl });

  return {
    username: `${ADMITTED_USERNAME_PREFIX}${st.username}`,
    firstName,
    fullName,
    initials: initials(fullName),
    photoUrl: '',
    photoCutout: false,
    grade: st.classYear ? `Class of ${st.classYear}` : 'Admitted',
    stream: st.major,
    school: st.college,
    location: '', // country of citizenship is not shown on the portfolio or resume
    dream: st.major ? `${st.major} at ${st.college}` : st.college,
    bio: bioFor(st, firstName),
    academics: academicsFor(st),
    activities: activitiesFor(st),
    projects: projectsFor(st),
    awards: awardsFor(st),
    certifications: certificationsFor(st),
    skills: skillsFor(st),
    seasons: journeyFor(st),
    links,
  };
}
