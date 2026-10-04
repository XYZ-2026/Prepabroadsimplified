// ═══════════════════════════════════════════════════════════
// Authoritative Grade-Based Psychometric Access Policy
// Central Single Source of Truth
// ═══════════════════════════════════════════════════════════

export type AcademicGrade = '7' | '8' | '9' | '10' | '11' | '12';

export type AssessmentVariant = 'JUNIOR_7_9' | 'CLASS_10' | 'SENIOR_12';

export type ToolKey = 'junior' | 'grade10' | 'senior';

export interface AssessmentDefinition {
  variant: AssessmentVariant;
  toolKey: ToolKey;
  routeType: string;
  name: string;
  shortName: string;
  targetGrades: AcademicGrade[];
  targetDescription: string;
  href: string;
  lockedReason: string;
}

export const ASSESSMENT_DEFINITIONS: Record<AssessmentVariant, AssessmentDefinition> = {
  JUNIOR_7_9: {
    variant: 'JUNIOR_7_9',
    toolKey: 'junior',
    routeType: 'junior',
    name: 'Class 7–9 Junior Psychometric Assessment',
    shortName: 'Class 7–9 Assessment',
    targetGrades: ['7', '8', '9'],
    targetDescription: 'Designed for Class 7–9 students',
    href: '/psychometric-test?type=junior',
    lockedReason: 'Available for Class 7, 8 & 9 students',
  },
  CLASS_10: {
    variant: 'CLASS_10',
    toolKey: 'grade10',
    routeType: 'grade10',
    name: 'Class 10 Stream Selection Psychometric Assessment',
    shortName: 'Class 10 Assessment',
    targetGrades: ['10'],
    targetDescription: 'Designed for Class 10 students',
    href: '/psychometric-test?type=grade10',
    lockedReason: 'Available for Class 10 students',
  },
  SENIOR_12: {
    variant: 'SENIOR_12',
    toolKey: 'senior',
    routeType: 'senior',
    name: 'Senior / Class 12 Career Alignment Psychometric Assessment',
    shortName: 'Senior / Class 12 Assessment',
    targetGrades: ['11', '12'],
    targetDescription: 'Designed for Class 11 & 12 students',
    href: '/psychometric-test?type=senior',
    lockedReason: 'Available for Class 11 & 12 students',
  },
};

/**
 * Authoritative Grade -> Assessment Mapping
 */
export const GRADE_TO_PSYCHOMETRIC_MAP: Record<AcademicGrade, AssessmentVariant> = {
  '7': 'JUNIOR_7_9',
  '8': 'JUNIOR_7_9',
  '9': 'JUNIOR_7_9',
  '10': 'CLASS_10',
  '11': 'SENIOR_12',
  '12': 'SENIOR_12',
};

/**
 * Normalizes any grade string/number representation into canonical "7" | "8" | "9" | "10" | "11" | "12".
 * Returns null if not a valid school grade 7..12.
 */
export function normalizeGrade(input: unknown): AcademicGrade | null {
  if (input === null || input === undefined) return null;
  const str = String(input).trim().toLowerCase();

  // Direct digits
  if (['7', '8', '9', '10', '11', '12'].includes(str)) {
    return str as AcademicGrade;
  }

  // Common variants: "grade 10", "class 10", "10th", "grade 10th", "10th grade", "tenth"
  const match = str.match(/\b(7|8|9|10|11|12)(?:th|st|nd|rd)?\b/);
  if (match && ['7', '8', '9', '10', '11', '12'].includes(match[1])) {
    return match[1] as AcademicGrade;
  }

  // Word-based
  if (str.includes('seven')) return '7';
  if (str.includes('eight')) return '8';
  if (str.includes('nine')) return '9';
  if (str.includes('ten')) return '10';
  if (str.includes('eleven')) return '11';
  if (str.includes('twelve')) return '12';

  // Junior / Senior aliases
  if (str.includes('junior')) return '8'; // default middle of 7-9
  if (str.includes('senior')) return '12';

  return null;
}

/**
 * Format normalized grade for display (e.g., "10" -> "Grade 10")
 */
export function formatGradeLabel(grade: unknown): string {
  const norm = normalizeGrade(grade);
  if (!norm) return 'Not Specified';
  return `Grade ${norm}`;
}

export interface AssessmentItemStatus extends AssessmentDefinition {
  isEligible: boolean;
  statusBadge: 'AVAILABLE' | 'LOCKED';
  accessReason: string;
}

export interface PsychometricAccessResult {
  status: 'ELIGIBLE' | 'PROFILE_INCOMPLETE' | 'DISABLED';
  grade: AcademicGrade | null;
  gradeLabel: string;
  badgeLabel: string;
  eligibleVariant: AssessmentVariant | null;
  eligibleToolKey: ToolKey | null;
  eligibleAssessment: AssessmentDefinition | null;
  eligibleTestName: string;
  eligibleHref: string;
  allAssessments: AssessmentItemStatus[];
  canAccess: (target: string) => boolean;
}

/**
 * Resolves a requested tool identifier (variant, toolKey, routeType, or alias) into AssessmentVariant.
 */
export function resolveAssessmentVariant(target: string | null | undefined): AssessmentVariant | null {
  if (!target) return null;
  const clean = target.trim().toLowerCase();

  if (clean === 'junior_7_9' || clean === 'junior' || clean === '7-9' || clean === '7_9' || clean === 'grade7_9') {
    return 'JUNIOR_7_9';
  }
  if (clean === 'class_10' || clean === 'grade10' || clean === '10' || clean === 'class10') {
    return 'CLASS_10';
  }
  if (clean === 'senior_12' || clean === 'senior' || clean === '12' || clean === 'grade12' || clean === 'highschool' || clean === 'class12') {
    return 'SENIOR_12';
  }
  return null;
}

/**
 * Central evaluation function for a student's psychometric access.
 * Enforces:
 * 1. Admin/Counsellor roles have universal preview access.
 * 2. Explicit admin disables (psychometricTest === false) are respected.
 * 3. Students without a grade get PROFILE_INCOMPLETE.
 * 4. Students with a grade are mapped to exactly one eligible assessment.
 * 5. Future admin overrides can be supported via toolAccess without breaking the base rule.
 */
export function getStudentPsychometricAccess(
  gradeInput: unknown,
  toolAccess?: {
    psychometricTest?: boolean;
    grade7_9?: boolean;
    grade10?: boolean;
    grade12?: boolean;
    adminOverride?: boolean;
    allowedVariants?: string[];
    [key: string]: unknown;
  } | null,
  userRole?: string
): PsychometricAccessResult {
  // Admin & Counsellors have unrestricted preview capabilities
  const isPrivileged = userRole === 'admin' || userRole === 'counsellor';
  
  // Explicit disable check
  if (toolAccess?.psychometricTest === false && !isPrivileged) {
    return {
      status: 'DISABLED',
      grade: normalizeGrade(gradeInput),
      gradeLabel: formatGradeLabel(gradeInput),
      badgeLabel: 'Disabled',
      eligibleVariant: null,
      eligibleToolKey: null,
      eligibleAssessment: null,
      eligibleTestName: 'Psychometric Assessment Disabled',
      eligibleHref: '/dashboard/student/profile',
      allAssessments: Object.values(ASSESSMENT_DEFINITIONS).map(def => ({
        ...def,
        isEligible: false,
        statusBadge: 'LOCKED',
        accessReason: 'Access is currently disabled by administrator.',
      })),
      canAccess: () => false,
    };
  }

  const normalizedGrade = normalizeGrade(gradeInput);

  // Missing or invalid grade -> Incomplete Profile
  if (!normalizedGrade && !isPrivileged) {
    return {
      status: 'PROFILE_INCOMPLETE',
      grade: null,
      gradeLabel: 'Academic profile incomplete',
      badgeLabel: 'Incomplete Profile',
      eligibleVariant: null,
      eligibleToolKey: null,
      eligibleAssessment: null,
      eligibleTestName: 'Profile Incomplete',
      eligibleHref: '/dashboard/student/update-profile',
      allAssessments: Object.values(ASSESSMENT_DEFINITIONS).map(def => ({
        ...def,
        isEligible: false,
        statusBadge: 'LOCKED',
        accessReason: 'Please set your academic grade in your profile to unlock your assessment.',
      })),
      canAccess: () => false,
    };
  }

  // Determine eligible variant
  const eligibleVariant: AssessmentVariant = isPrivileged
    ? (normalizedGrade ? GRADE_TO_PSYCHOMETRIC_MAP[normalizedGrade] : 'CLASS_10')
    : GRADE_TO_PSYCHOMETRIC_MAP[normalizedGrade!];

  const eligibleAssessment = ASSESSMENT_DEFINITIONS[eligibleVariant];

  const allAssessments: AssessmentItemStatus[] = Object.values(ASSESSMENT_DEFINITIONS).map(def => {
    const isEligible = isPrivileged || def.variant === eligibleVariant;
    return {
      ...def,
      isEligible,
      statusBadge: isEligible ? 'AVAILABLE' : 'LOCKED',
      accessReason: isEligible
        ? `Unlocked for your academic stage (${formatGradeLabel(normalizedGrade)})`
        : def.lockedReason,
    };
  });

  const canAccess = (target: string): boolean => {
    if (isPrivileged) return true;
    const resolved = resolveAssessmentVariant(target);
    if (!resolved) return false;

    // Check future explicit admin override if configured
    if (toolAccess?.adminOverride && Array.isArray(toolAccess.allowedVariants)) {
      if (toolAccess.allowedVariants.includes(resolved)) return true;
    }

    return resolved === eligibleVariant;
  };

  return {
    status: 'ELIGIBLE',
    grade: normalizedGrade,
    gradeLabel: formatGradeLabel(normalizedGrade),
    badgeLabel: eligibleAssessment.shortName,
    eligibleVariant,
    eligibleToolKey: eligibleAssessment.toolKey,
    eligibleAssessment,
    eligibleTestName: eligibleAssessment.name,
    eligibleHref: eligibleAssessment.href,
    allAssessments,
    canAccess,
  };
}
