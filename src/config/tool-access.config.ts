// ═══════════════════════════════════════════════════════════
// Authoritative Tool Access Policy & Evaluation System
// ═══════════════════════════════════════════════════════════

export type AccessPolicyMode = 'ALL_ENABLED' | 'MANUAL' | 'RESTRICTED';

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
  [key: string]: boolean | undefined;
}

/**
 * Authoritative global policy configuration for Psychometric & Platform tools.
 * Currently set to ALL_ENABLED mode (All 3 psychometric tests open to all students).
 * Switch `defaultMode` to 'MANUAL' when restricted per-user access allocation is required.
 */
export const PSYCHOMETRIC_ACCESS_POLICY: PsychometricAccessPolicy = {
  defaultMode: 'ALL_ENABLED',
  psychometricTools: [
    'grade7_9',
    'grade10',
    'grade12',
  ],
  allowAllPsychometricTools: true,
};

/**
 * Evaluate if a given tool or psychometric test variant is allowed for a user.
 */
export function isToolAccessGranted(
  toolId: string,
  userAccess?: UserToolAccess | null
): boolean {
  const isPsychometric = 
    toolId === 'psychometricTest' ||
    toolId === 'grade7_9' ||
    toolId === 'grade10' ||
    toolId === 'grade12' ||
    toolId === 'junior' ||
    toolId === 'senior';

  // Under ALL_ENABLED policy, all 3 psychometric tests are granted automatically
  if (PSYCHOMETRIC_ACCESS_POLICY.defaultMode === 'ALL_ENABLED' && isPsychometric) {
    console.log(`[TOOL ACCESS CHECK] tool=${toolId} policy=ALL_ENABLED allowed=true`);
    return true;
  }

  // If userAccess record is missing, default to true in free/open phase
  if (!userAccess) {
    return true;
  }

  // Manual per-user evaluation logic
  if (toolId === 'psychometricTest') {
    return userAccess.psychometricTest !== false;
  }
  if (toolId === 'grade7_9' || toolId === 'junior') {
    return userAccess.grade7_9 !== false && userAccess.psychometricTest !== false;
  }
  if (toolId === 'grade10') {
    return userAccess.grade10 !== false && userAccess.psychometricTest !== false;
  }
  if (toolId === 'grade12' || toolId === 'senior') {
    return userAccess.grade12 !== false && userAccess.psychometricTest !== false;
  }
  if (toolId === 'iqTest') {
    return userAccess.iqTest !== false;
  }
  if (toolId === 'universityPredictor') {
    return userAccess.universityPredictor !== false;
  }

  return true;
}
