// ═══════════════════════════════════════════════════════════
// Authoritative Tool Access Policy & Evaluation System
// Upgraded to GRADE_BASED_ACCESS (Single Source of Truth)
// ═══════════════════════════════════════════════════════════

import { 
  getStudentPsychometricAccess, 
  resolveAssessmentVariant 
} from '@/lib/psychometric-access-policy';

export type AccessPolicyMode = 'GRADE_BASED_ACCESS' | 'MANUAL' | 'RESTRICTED' | 'ALL_ENABLED';

export interface PsychometricAccessPolicy {
  defaultMode: AccessPolicyMode;
  psychometricTools: string[];
  allowAllPsychometricTools: boolean;
}

export interface UserToolAccess {
  iqTest?: boolean;
  psychometricTest?: boolean;
  universityPredictor?: boolean;
  grade7_9?: boolean;
  grade10?: boolean;
  grade12?: boolean;
  adminOverride?: boolean;
  allowedVariants?: string[];
  [key: string]: unknown;
}

/**
 * Authoritative global policy configuration for Psychometric & Platform tools.
 * Primary policy: GRADE_BASED_ACCESS (Student access resolved deterministically from academic grade).
 * Legacy ALL_ENABLED policy is officially retired.
 */
export const PSYCHOMETRIC_ACCESS_POLICY: PsychometricAccessPolicy = {
  defaultMode: 'GRADE_BASED_ACCESS',
  psychometricTools: [
    'grade7_9',
    'grade10',
    'grade12',
    'junior',
    'senior',
  ],
  allowAllPsychometricTools: false,
};

/**
 * Evaluate if a given tool or psychometric test variant is allowed for a user.
 */
export function isToolAccessGranted(
  toolId: string,
  userAccess?: UserToolAccess | null,
  academicGrade?: unknown,
  userRole?: string
): boolean {
  // Global tools
  if (toolId === 'iqTest') {
    return userAccess?.iqTest !== false;
  }
  if (toolId === 'universityPredictor') {
    return userAccess?.universityPredictor !== false;
  }

  // Base psychometric test access
  if (toolId === 'psychometricTest') {
    if (userAccess?.psychometricTest === false) return false;
    return true;
  }

  // Specific psychometric test variants
  const isPsychometricVariant = 
    toolId === 'grade7_9' ||
    toolId === 'grade10' ||
    toolId === 'grade12' ||
    toolId === 'junior' ||
    toolId === 'senior' ||
    toolId === 'JUNIOR_7_9' ||
    toolId === 'CLASS_10' ||
    toolId === 'SENIOR_12';

  if (isPsychometricVariant) {
    // If grade is provided, resolve strictly via Grade-Based Access Policy
    if (academicGrade !== undefined) {
      const evaluation = getStudentPsychometricAccess(academicGrade, userAccess, userRole);
      return evaluation.canAccess(toolId);
    }

    // If grade is not directly passed to this function, check manual override / legacy toolAccess
    if (userAccess?.psychometricTest === false) {
      return false;
    }

    const resolved = resolveAssessmentVariant(toolId);
    if (resolved === 'JUNIOR_7_9') {
      return userAccess?.grade7_9 !== false;
    }
    if (resolved === 'CLASS_10') {
      return userAccess?.grade10 !== false;
    }
    if (resolved === 'SENIOR_12') {
      return userAccess?.grade12 !== false;
    }
  }

  return true;
}
