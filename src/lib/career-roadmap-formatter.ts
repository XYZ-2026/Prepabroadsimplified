/**
 * Career Roadmap Studio — Humanized Label Formatter & Semantic Tokens
 * ─────────────────────────────────────────────────────────────────
 * Centralizes all user-facing label conversions so raw internal enum
 * names (e.g. SENIOR_SECONDARY_11_12, SUBJECT_COMBINATION, etc.)
 * are never leaked into the student or counsellor interface.
 */

export interface HumanizedTypeConfig {
  label: string;
  badgeLabel: string;
  category: 'academic' | 'vocational' | 'exam' | 'destination' | 'institution';
  description: string;
}

export const NODE_TYPE_LABELS: Record<string, HumanizedTypeConfig> = {
  LEVEL: {
    label: 'Academic Stage',
    badgeLabel: 'Stage',
    category: 'academic',
    description: 'Current educational foundation level',
  },
  STREAM: {
    label: 'Academic Stream',
    badgeLabel: 'Stream',
    category: 'academic',
    description: 'Specialized secondary education track',
  },
  SUBJECT_COMBINATION: {
    label: 'Subject Combination',
    badgeLabel: 'Subjects',
    category: 'academic',
    description: 'Specific curriculum subject cluster',
  },
  FIELD: {
    label: 'Field of Study',
    badgeLabel: 'Field',
    category: 'academic',
    description: 'Broad academic and disciplinary domain',
  },
  DEGREE: {
    label: 'Degree Programme',
    badgeLabel: 'Degree',
    category: 'academic',
    description: 'Undergraduate or professional graduation degree',
  },
  ROUTE: {
    label: 'Career Route',
    badgeLabel: 'Route',
    category: 'vocational',
    description: 'Step-by-step career path trajectory',
  },
  CERTIFICATION: {
    label: 'Professional Certification',
    badgeLabel: 'Certification',
    category: 'vocational',
    description: 'Industry-recognized credential or diploma',
  },
  CAREER: {
    label: 'Career Outcome',
    badgeLabel: 'Career',
    category: 'destination',
    description: 'Long-term career destination or role',
  },
  RECRUITMENT_EXAM: {
    label: 'Recruitment Examination',
    badgeLabel: 'Recruitment',
    category: 'exam',
    description: 'Public service or competitive recruitment exam',
  },
  POSTGRADUATE_PROGRAM: {
    label: 'Postgraduate Programme',
    badgeLabel: 'Postgraduate',
    category: 'academic',
    description: 'Advanced master’s or doctoral degree',
  },
  SPECIALISATION: {
    label: 'Domain Specialisation',
    badgeLabel: 'Specialisation',
    category: 'academic',
    description: 'In-depth focus area within a degree',
  },
  PROFESSION: {
    label: 'Professional Designation',
    badgeLabel: 'Profession',
    category: 'destination',
    description: 'Qualified occupation or professional title',
  },
  ENTRANCE_EXAM: {
    label: 'Entrance Examination',
    badgeLabel: 'Entrance Exam',
    category: 'exam',
    description: 'National or state-level admission exam',
  },
  COLLEGE: {
    label: 'Higher Education Institution',
    badgeLabel: 'College',
    category: 'institution',
    description: 'Recognized university or affiliated college',
  },
  COLLEGE_GROUP: {
    label: 'Institution Consortium',
    badgeLabel: 'Group',
    category: 'institution',
    description: 'Network of participating institutions',
  },
  STUDY_ABROAD: {
    label: 'Study Abroad Pathway',
    badgeLabel: 'Study Abroad',
    category: 'academic',
    description: 'International study programs and global universities',
  },
  CAREER_DOMAIN: {
    label: 'Career Domain / Track',
    badgeLabel: 'Career Domain',
    category: 'destination',
    description: 'Industry specialization domain or modern career track',
  },
};

export function formatNodeType(type: string): string {
  if (!type) return 'Pathway Option';
  const conf = NODE_TYPE_LABELS[type.toUpperCase().trim()];
  return conf ? conf.label : type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function formatNodeTypeBadge(type: string): string {
  if (!type) return 'Option';
  const conf = NODE_TYPE_LABELS[type.toUpperCase().trim()];
  return conf ? conf.badgeLabel : type.replace(/_/g, ' ');
}

export function formatAcademicStage(stage: string): string {
  if (!stage) return '';
  const s = stage.toUpperCase().trim();
  switch (s) {
    case 'SECONDARY_10':
    case 'CLASS_10':
    case '10TH':
      return 'Secondary (Class 10)';
    case 'SENIOR_SECONDARY_11_12':
    case 'CLASS_11_12':
    case '11TH_12TH':
    case '12TH':
      return 'Senior Secondary (Classes 11–12)';
    case 'UNDERGRADUATE':
    case 'UG':
      return 'Undergraduate Studies';
    case 'POSTGRADUATE':
    case 'PG':
      return 'Postgraduate Studies';
    case 'DOCTORAL':
    case 'PHD':
      return 'Doctoral Research';
    case 'DIPLOMA':
      return 'Diploma / Polytechnic';
    case 'VOCATIONAL':
      return 'Vocational Training';
    default:
      return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}

export function formatEdgeType(edgeType: string): string {
  if (!edgeType) return 'Leads to';
  const e = edgeType.toUpperCase().trim();
  switch (e) {
    case 'LEADS_TO':
      return 'Leads to';
    case 'ELIGIBLE_FOR':
      return 'Eligible for';
    case 'CAN_PURSUE':
      return 'Can pursue';
    case 'OFFERS':
      return 'Offers programme';
    case 'ENTRANCE_FOR':
      return 'Entrance exam for';
    case 'SPECIALISES_IN':
      return 'Specialises in';
    case 'RECRUITS_FOR':
      return 'Recruits for';
    default:
      return edgeType.replace(/_/g, ' ').toLowerCase();
  }
}

export function formatVerificationStatus(status: string): { label: string; tone: 'verified' | 'provisional' | 'review' } {
  if (!status) return { label: 'Source-listed', tone: 'provisional' };
  const s = status.toUpperCase().trim();
  switch (s) {
    case 'VERIFIED':
    case 'VERIFIED_PROGRAMME':
    case 'VERIFIED_EXTERNAL':
      return { label: 'Verified programme mapping', tone: 'verified' };
    case 'FIELD_LEVEL_ONLY':
    case 'FIELD_LEVEL':
      return { label: 'Field-level listing', tone: 'provisional' };
    case 'SOURCE_LISTED':
    case 'SOURCE_VERIFIED':
      return { label: 'Source-listed in handbook', tone: 'provisional' };
    case 'UNVERIFIED_EXTERNALLY':
    case 'PENDING_RESEARCH':
    case 'PENDING':
      return { label: 'Current verification required', tone: 'review' };
    default:
      return { label: 'Source-listed', tone: 'provisional' };
  }
}
