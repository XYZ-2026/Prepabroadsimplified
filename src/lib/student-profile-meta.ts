// Pure helpers for the student dashboard home: profile completion + "Your next step".
// No server or client dependencies, so it can be used from either side.
import { normalizeGrade } from '@/lib/psychometric-access-policy';

export interface ProfileMetaInput {
  name?: string;
  mobile?: string;
  grade?: string;
  schoolName?: string;
  currentSchool?: string;
  board?: string;
  stream?: string;
  city?: string;
  state?: string;
  goals?: string[];
  declaredInterests?: string[];
  targetCountries?: string;
  degreeLevel?: string;
  fieldOfInterest?: string;
  parentName?: string;
  parentPhone?: string;
}

export type SectionKey = 'personal' | 'academics' | 'goals' | 'abroad' | 'guardian';

export interface SectionStatus {
  key: SectionKey;
  label: string;
  complete: boolean;
}

export interface CompletionResult {
  percent: number;
  sections: SectionStatus[];
  missing: string[];
}

const has = (v: unknown) => typeof v === 'string' && v.trim() !== '' && v.trim() !== 'Not Provided';

export function computeProfileCompletion(p: ProfileMetaInput): CompletionResult {
  const grade = normalizeGrade(p.grade);
  const needsStream = grade === '11' || grade === '12';

  const checks: { section: SectionKey; label: string; ok: boolean }[] = [
    { section: 'personal', label: 'Full name', ok: has(p.name) },
    { section: 'personal', label: 'Mobile number', ok: has(p.mobile) },
    { section: 'personal', label: 'City', ok: has(p.city) },
    { section: 'personal', label: 'State', ok: has(p.state) },
    { section: 'academics', label: 'Academic grade', ok: !!grade },
    { section: 'academics', label: 'School / college', ok: has(p.schoolName) || has(p.currentSchool) },
    { section: 'academics', label: 'Education board', ok: has(p.board) },
    ...(needsStream ? [{ section: 'academics' as SectionKey, label: 'Academic stream', ok: has(p.stream) }] : []),
    { section: 'goals', label: 'Goals or interests', ok: (p.goals?.length || 0) > 0 || (p.declaredInterests?.length || 0) > 0 },
    { section: 'abroad', label: 'Target countries', ok: has(p.targetCountries) },
    { section: 'abroad', label: 'Degree level', ok: has(p.degreeLevel) },
    { section: 'abroad', label: 'Field of interest', ok: has(p.fieldOfInterest) },
    { section: 'guardian', label: 'Parent / guardian name', ok: has(p.parentName) },
    { section: 'guardian', label: 'Parent / guardian phone', ok: has(p.parentPhone) },
  ];

  const done = checks.filter((c) => c.ok).length;
  const labels: Record<SectionKey, string> = {
    personal: 'Personal & Contact',
    academics: 'Academics',
    goals: 'Goals & Interests',
    abroad: 'Study Abroad',
    guardian: 'Parent / Guardian',
  };

  const sections: SectionStatus[] = (Object.keys(labels) as SectionKey[]).map((key) => ({
    key,
    label: labels[key],
    complete: checks.filter((c) => c.section === key).every((c) => c.ok),
  }));

  return {
    percent: Math.round((done / checks.length) * 100),
    sections,
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}

export interface NextStep {
  id: 'complete-profile' | 'request-access' | 'start-test' | 'view-report' | 'book-consultation';
  title: string;
  body: string;
  cta: string;
  href: string;
  /** When true the card renders the existing "Request Access" control instead of a link button */
  requestAccess?: boolean;
  secondary?: { label: string; href: string };
}

export interface NextStepInput {
  hasGrade: boolean;
  psychStatus: 'ELIGIBLE' | 'PROFILE_INCOMPLETE' | 'DISABLED';
  eligibleTestName: string;
  eligibleHref: string;
  latestReportUrl?: string;
  savedCareersCount: number;
}

/** One action, chosen from existing state — mirrors the business table in the plan. */
export function computeNextStep(i: NextStepInput): NextStep {
  if (!i.hasGrade) {
    return {
      id: 'complete-profile',
      title: 'Complete your profile',
      body: 'Add your current grade so we can unlock the right psychometric assessment for you.',
      cta: 'Update profile',
      href: '/dashboard/student/profile/edit',
    };
  }

  if (i.psychStatus === 'DISABLED') {
    return {
      id: 'request-access',
      title: 'Unlock your psychometric assessment',
      body: 'Your assessment is waiting for access approval. Send a request and our team will activate it.',
      cta: 'Request access',
      href: '/dashboard/student/assessments',
      requestAccess: true,
    };
  }

  if (!i.latestReportUrl) {
    return {
      id: 'start-test',
      title: 'Take your psychometric assessment',
      body: `${i.eligibleTestName} is unlocked for you. It maps your strengths, interests and learning style to careers.`,
      cta: 'Start assessment',
      href: i.eligibleHref,
    };
  }

  if (i.savedCareersCount === 0) {
    return {
      id: 'view-report',
      title: 'Your report is ready',
      body: 'Read your report, then explore the careers that match your profile and bookmark the ones you like.',
      cta: 'View my report',
      href: i.latestReportUrl,
      secondary: { label: 'Explore careers', href: '/career-library' },
    };
  }

  return {
    id: 'book-consultation',
    title: 'Talk to a counsellor',
    body: `You have saved ${i.savedCareersCount} career${i.savedCareersCount === 1 ? '' : 's'}. A one-to-one session turns your report into a clear plan.`,
    cta: 'Book a consultation',
    href: '/book-a-demo?from=dashboard:next-step',
    secondary: { label: 'View my report', href: i.latestReportUrl },
  };
}
