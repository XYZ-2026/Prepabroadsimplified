'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ReportJobProgressState {
  jobId: string | null;
  status: 'idle' | 'queued' | 'running' | 'done' | 'failed';
  stage: string;
  stageDetail: string;
  percent: number;
  reportType: 'full' | 'executive' | null;
  isStalled: boolean;
  error: string | null;
  resultUrl: string | null;
  fileName: string | null;
}

const STORAGE_KEY = 'clarvo_active_report_job_id';

export function useReportJobProgress(onDownloadComplete?: (reportType: 'full' | 'executive') => void) {
  const [jobState, setJobState] = useState<ReportJobProgressState>({
    jobId: null,
    status: 'idle',
    stage: 'load_profile',
    stageDetail: '',
    percent: 0,
    reportType: null,
    isStalled: false,
    error: null,
    resultUrl: null,
    fileName: null,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const lastPayloadRef = useRef<{ reportType: 'full' | 'executive'; payload: any } | null>(null);

  // Sync Job ID to URL without page reload
  const syncJobIdToUrl = useCallback((id: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set('jobId', id);
        sessionStorage.setItem(STORAGE_KEY, id);
      } else {
        url.searchParams.delete('jobId');
        sessionStorage.removeItem(STORAGE_KEY);
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      console.warn('[Job Progress Hook] URL sync skipped:', e);
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Poll status endpoint
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`/api/psychometric-test/pdf/status?jobId=${encodeURIComponent(jobId)}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        if (res.status === 404) {
          // Job expired or invalid
          stopPolling();
          syncJobIdToUrl(null);
          setJobState(prev => ({
            ...prev,
            status: 'failed',
            error: 'Report session expired. Please start download again.',
            isStalled: false,
          }));
          return;
        }
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.job) {
        throw new Error(data.error || 'Invalid server job payload');
      }

      const job = data.job;
      const now = Date.now();

      // Check stall condition: no update from server for >= 60 seconds while running
      const timeSinceUpdate = now - (job.updatedAt || now);
      const isStalled = job.status === 'running' && timeSinceUpdate >= 60000;

      setJobState(prev => {
        // Enforce monotonicity: percent never moves backwards, never exceeds confirmed server percent
        const nextPercent = Math.max(prev.percent, Math.min(100, job.percent || 0));

        return {
          jobId: job.id,
          status: job.status,
          stage: job.stage || prev.stage,
          stageDetail: isStalled ? 'Still working...' : (job.stageDetail || prev.stageDetail),
          percent: nextPercent,
          reportType: job.reportType || prev.reportType,
          isStalled,
          error: job.error || null,
          resultUrl: job.resultUrl || null,
          fileName: job.fileName || prev.fileName,
        };
      });

      // Handle Terminal Done
      if (job.status === 'done') {
        stopPolling();
        syncJobIdToUrl(null);

        // Trigger native browser file download
        const downloadUrl = job.resultUrl || `/api/psychometric-test/pdf/download?jobId=${job.id}`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = job.fileName || `${job.reportType === 'executive' ? 'Executive_Career_Summary' : 'Full_Psychometric_Report'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Notify parent / legacy listeners
        if (onDownloadComplete && job.reportType) {
          onDownloadComplete(job.reportType);
        }
        window.dispatchEvent(new CustomEvent('pdf-download-complete'));
        window.dispatchEvent(new CustomEvent('summary-download-complete'));

        // Reset to idle after brief completion display
        setTimeout(() => {
          setJobState(prev => ({
            ...prev,
            status: 'idle',
            percent: 0,
            stageDetail: '',
            isStalled: false,
          }));
        }, 1500);
      }

      // Handle Terminal Failed
      if (job.status === 'failed') {
        stopPolling();
        syncJobIdToUrl(null);
      }

    } catch (err: any) {
      console.warn('[Job Progress Hook] Status poll error:', err?.message || err);
      // If we've had no successful update for > 60s, mark stalled
      if (Date.now() - lastUpdateRef.current > 60000) {
        setJobState(prev => ({ ...prev, isStalled: true, stageDetail: 'Still working...' }));
      }
    }
  }, [stopPolling, syncJobIdToUrl, onDownloadComplete]);

  // Start polling loop
  const startPolling = useCallback((jobId: string) => {
    stopPolling();
    lastUpdateRef.current = Date.now();
    // Immediate initial poll
    pollJobStatus(jobId);
    pollIntervalRef.current = setInterval(() => {
      pollJobStatus(jobId);
    }, 1000);
  }, [stopPolling, pollJobStatus]);

  // Trigger a new report job
  const startReportJob = useCallback(async (
    reportType: 'full' | 'executive',
    payload: any
  ) => {
    stopPolling();
    lastPayloadRef.current = { reportType, payload };

    setJobState({
      jobId: null,
      status: 'queued',
      stage: 'load_profile',
      stageDetail: 'Initializing report generation...',
      percent: 0,
      reportType,
      isStalled: false,
      error: null,
      resultUrl: null,
      fileName: null,
    });

    try {
      const res = await fetch('/api/psychometric-test/pdf/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          reportType,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize report generation');
      }

      const data = await res.json();
      if (!data.success || !data.jobId) {
        throw new Error(data.error || 'Server did not return a valid Job ID');
      }

      syncJobIdToUrl(data.jobId);

      setJobState(prev => ({
        ...prev,
        jobId: data.jobId,
        status: data.status || 'queued',
        percent: data.percent || 0,
        stageDetail: data.stageDetail || 'Queued for generation...',
      }));

      startPolling(data.jobId);
    } catch (e: any) {
      console.error('[Job Progress Hook] Failed to start job:', e);
      setJobState(prev => ({
        ...prev,
        status: 'failed',
        error: e.message || 'Generation failed to start',
        stageDetail: 'Generation failed',
      }));
    }
  }, [stopPolling, syncJobIdToUrl, startPolling]);

  // Retry last failed job
  const retryLastJob = useCallback(() => {
    if (lastPayloadRef.current) {
      startReportJob(lastPayloadRef.current.reportType, lastPayloadRef.current.payload);
    } else {
      setJobState(prev => ({ ...prev, status: 'idle', error: null, percent: 0 }));
    }
  }, [startReportJob]);

  // Cancel / Reset
  const cancelJob = useCallback(() => {
    stopPolling();
    syncJobIdToUrl(null);
    setJobState({
      jobId: null,
      status: 'idle',
      stage: 'load_profile',
      stageDetail: '',
      percent: 0,
      reportType: null,
      isStalled: false,
      error: null,
      resultUrl: null,
      fileName: null,
    });
  }, [stopPolling, syncJobIdToUrl]);

  // On mount: Check URL and Storage to survive page refresh
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const existingJobId = urlParams.get('jobId') || sessionStorage.getItem(STORAGE_KEY);

    if (existingJobId) {
      console.log(`[Job Progress Hook] Resuming report job ${existingJobId} across page refresh...`);
      setJobState(prev => ({
        ...prev,
        jobId: existingJobId,
        status: 'running',
        stageDetail: 'Resuming report generation...',
      }));
      startPolling(existingJobId);
    }

    const handleJobStarted = (e: any) => {
      const { jobId, reportType } = e.detail || {};
      if (jobId) {
        setJobState(prev => ({
          ...prev,
          jobId,
          status: 'running',
          reportType: reportType || prev.reportType,
          stageDetail: 'Initializing report generation...',
          percent: 0,
          error: null,
          isStalled: false,
        }));
        startPolling(jobId);
      }
    };

    window.addEventListener('report-job-started', handleJobStarted);

    return () => {
      stopPolling();
      window.removeEventListener('report-job-started', handleJobStarted);
    };
  }, [startPolling, stopPolling]);

  return {
    jobState,
    startReportJob,
    retryLastJob,
    cancelJob,
    isGenerating: jobState.status === 'queued' || jobState.status === 'running',
    isFullGenerating: (jobState.status === 'queued' || jobState.status === 'running') && jobState.reportType === 'full',
    isExecGenerating: (jobState.status === 'queued' || jobState.status === 'running') && jobState.reportType === 'executive',
  };
}
