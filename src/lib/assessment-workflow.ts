// ============================================================
// ASSESSMENT WORKFLOW & TOKEN MANAGEMENT
//
// Single source of truth for workflow states and secure token handling.
// Tokens are strictly hashed (SHA-256) before storage. Raw tokens are
// NEVER stored in the database.
// ============================================================

import { adminDb } from './firebase-admin';
import crypto from 'crypto';

// ─── Workflow States ────────────────────────────────────────────────────────

export type WorkflowState = 
  | 'student_completed'      // Test submitted, result saved
  | 'parent_pending'         // Waiting for parent invitation to be generated
  | 'parent_invited'         // Invitation created, link shared
  | 'parent_in_progress'     // Parent has started (first save-progress call)
  | 'parent_completed'       // Parent submitted final answers
  | 'comparison_generated'   // Deterministic comparison computed and saved
  | 'report_unlocked';       // Student can view complete report

export interface AssessmentWorkflowDoc {
  resultId: string;
  studentId: string;
  state: WorkflowState;
  
  parentAssessmentId?: string; // Links to parent_assessments/{id}
  comparisonId?: string;       // Links to assessment_comparisons/{id}
  
  counsellorOverride?: boolean;
  counsellorOverrideBy?: string;
  counsellorOverrideReason?: string;
  counsellorOverrideAt?: string;
  
  updatedAt: string;
}

export interface AssessmentInvitationDoc {
  tokenHash: string; // SHA-256 hex string
  resultId: string;
  studentId: string;
  status: 'active' | 'used' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// ─── Token Management ───────────────────────────────────────────────────────

/**
 * Generates a secure random token and its SHA-256 hash.
 * 
 * @returns { rawToken, tokenHash } - rawToken must be shared with user, tokenHash is stored in DB
 */
export function generateSecureToken(): { rawToken: string; tokenHash: string } {
  // 32 bytes = 256 bits of entropy
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

/**
 * Computes the SHA-256 hash of a provided raw token for lookup/verification.
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

// ─── Workflow Derivation ────────────────────────────────────────────────────

/**
 * Gets the definitive workflow state for a given result.
 * This function consults the authoritative source documents if necessary.
 */
export async function getWorkflowState(resultId: string): Promise<WorkflowState> {
  const workflowSnap = await adminDb.collection('assessment_workflow').doc(resultId).get();
  
  if (!workflowSnap.exists) {
    // Check if psychometric_results exists
    const resultSnap = await adminDb.collection('psychometric_results').doc(resultId).get();
    if (!resultSnap.exists) {
      throw new Error(`Assessment ${resultId} not found`);
    }
    // Result exists but no workflow doc -> we need to initialize it
    // For now, return parent_pending
    return 'parent_pending';
  }

  const data = workflowSnap.data() as AssessmentWorkflowDoc;
  
  // Counsellor override forces unlock regardless of actual parent state
  if (data.counsellorOverride) {
    return 'report_unlocked';
  }

  // Fast path: use cached state from workflow doc, but ideally we verify against
  // authoritative documents (parent_assessments, assessment_comparisons) in critical paths.
  return data.state;
}
