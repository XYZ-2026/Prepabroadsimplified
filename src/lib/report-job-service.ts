/**
 * Report Generation Job Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages asynchronous report generation jobs with real-time checkpoint updates,
 * in-memory high-speed caching, and Firestore persistence.
 */

import { adminDb, hasAdminCredentials } from './firebase-admin';

export type JobStatus = 'queued' | 'running' | 'done' | 'failed';

export type JobStage =
  | 'load_profile'
  | 'scoring_ranking'
  | 'ai_editorial'
  | 'page_rendering'
  | 'assemble_upload';

export interface ReportJobRecord {
  id: string;
  status: JobStatus;
  stage: JobStage;
  percent: number;
  stageDetail: string;
  reportType: 'full' | 'executive';
  resultId?: string;
  studentName?: string;
  createdAt: number;
  updatedAt: number;
  error?: string | null;
  resultUrl?: string | null;
  fileName?: string;
}

interface StoredJobEntry {
  job: ReportJobRecord;
  pdfBuffer?: Buffer;
}

// In-memory job registry for instant, sub-millisecond status polling
const inMemoryJobs = new Map<string, StoredJobEntry>();

const TTL_MS = 60 * 60 * 1000; // 1 hour buffer retention

function canPersistToFirestore(): boolean {
  return Boolean(adminDb && hasAdminCredentials);
}

/**
 * Creates and registers a new report job.
 */
export function createReportJob(options: {
  reportType: 'full' | 'executive';
  resultId?: string;
  studentName?: string;
}): ReportJobRecord {
  const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();

  const job: ReportJobRecord = {
    id,
    status: 'queued',
    stage: 'load_profile',
    percent: 0,
    stageDetail: 'Queued for generation...',
    reportType: options.reportType,
    resultId: options.resultId,
    studentName: options.studentName,
    createdAt: now,
    updatedAt: now,
    error: null,
    resultUrl: null,
  };

  inMemoryJobs.set(id, { job });

  // Asynchronously persist to Firestore without blocking response
  if (canPersistToFirestore()) {
    try {
      adminDb.collection('report_jobs').doc(id).set({
        ...job,
        // Store timestamps as ISO strings for Firestore
        createdAtIso: new Date(now).toISOString(),
        updatedAtIso: new Date(now).toISOString(),
      }).catch(err => {
        console.warn(`[ReportJob] Firestore persistence skipped for ${id}:`, err?.message || err);
      });
    } catch (err: any) {
      console.warn(`[ReportJob] Firestore synchronous error for ${id}:`, err?.message || err);
    }
  }

  return job;
}

/**
 * Updates a job with real checkpoint progress, stage detail, and optional PDF buffer.
 * Strictly guarantees that percent never moves backwards.
 */
export function updateReportJob(
  jobId: string,
  updates: Partial<ReportJobRecord>,
  pdfBuffer?: Buffer
): ReportJobRecord | null {
  const entry = inMemoryJobs.get(jobId);
  const now = Date.now();

  let currentJob: ReportJobRecord;

  if (entry) {
    currentJob = entry.job;
  } else {
    currentJob = {
      id: jobId,
      status: updates.status || 'running',
      stage: updates.stage || 'load_profile',
      percent: 0,
      stageDetail: updates.stageDetail || 'Initializing...',
      reportType: updates.reportType || 'full',
      createdAt: now,
      updatedAt: now,
    };
  }

  // Enforce monotonicity: percent must NEVER move backwards
  const targetPercent = typeof updates.percent === 'number'
    ? Math.max(currentJob.percent, Math.min(100, Math.round(updates.percent)))
    : currentJob.percent;

  const updatedJob: ReportJobRecord = {
    ...currentJob,
    ...updates,
    percent: targetPercent,
    updatedAt: now,
  };

  inMemoryJobs.set(jobId, {
    job: updatedJob,
    pdfBuffer: pdfBuffer || entry?.pdfBuffer,
  });

  // Sync to Firestore
  if (canPersistToFirestore()) {
    try {
      adminDb.collection('report_jobs').doc(jobId).set({
        ...updatedJob,
        updatedAtIso: new Date(now).toISOString(),
      }, { merge: true }).catch(err => {
        console.warn(`[ReportJob] Firestore update error for ${jobId}:`, err?.message || err);
      });
    } catch (err: any) {
      console.warn(`[ReportJob] Firestore update synchronous error for ${jobId}:`, err?.message || err);
    }
  }

  return updatedJob;
}

/**
 * Retrieves a job record by ID (from memory first, with Firestore fallback).
 */
export async function getReportJob(jobId: string): Promise<ReportJobRecord | null> {
  const entry = inMemoryJobs.get(jobId);
  if (entry) {
    return entry.job;
  }

  // Fallback to Firestore
  if (canPersistToFirestore()) {
    try {
      const snap = await adminDb.collection('report_jobs').doc(jobId).get();
      if (snap.exists) {
        const data = snap.data() as any;
        const job: ReportJobRecord = {
          id: data.id || jobId,
          status: data.status || 'failed',
          stage: data.stage || 'load_profile',
          percent: data.percent || 0,
          stageDetail: data.stageDetail || '',
          reportType: data.reportType || 'full',
          resultId: data.resultId,
          studentName: data.studentName,
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
          error: data.error || null,
          resultUrl: data.resultUrl || null,
          fileName: data.fileName,
        };
        inMemoryJobs.set(jobId, { job });
        return job;
      }
    } catch (e: any) {
      console.warn(`[ReportJob] Firestore read error for ${jobId}:`, e?.message || e);
    }
  }

  return null;
}

/**
 * Retrieves the compiled binary PDF buffer for a completed job.
 */
export function getReportJobBuffer(jobId: string): { buffer?: Buffer; job?: ReportJobRecord } {
  const entry = inMemoryJobs.get(jobId);
  return {
    buffer: entry?.pdfBuffer,
    job: entry?.job,
  };
}

/**
 * Cleans up expired jobs older than TTL.
 */
export function cleanupReportJobs() {
  const now = Date.now();
  for (const [id, entry] of inMemoryJobs.entries()) {
    if (now - entry.job.createdAt > TTL_MS) {
      inMemoryJobs.delete(id);
    }
  }
}

