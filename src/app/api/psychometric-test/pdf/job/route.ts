import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { createReportJob, getReportJob } from '@/lib/report-job-service';
import { runReportGenerationJob } from '@/lib/report-generator-runner';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      resultId,
      student,
      scores,
      reportType = 'full',
      assessmentType,
      variant,
      isSample,
    } = body;

    const decodedClaims = await verifySessionCookie();
    const isSampleRequest =
      isSample ||
      resultId?.toString().toUpperCase().includes('SAMPLE') ||
      student?.reportId?.toString().toUpperCase().includes('SAMPLE') ||
      student?.name?.toString().toLowerCase().includes('sample');

    const isDirectPayload = !resultId && student && scores;

    if (!decodedClaims && !isSampleRequest && !isDirectPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const effectiveReportType: 'full' | 'executive' = reportType === 'executive' ? 'executive' : 'full';
    const studentName = student?.name || 'Candidate';

    // Create the job record in initial queued state
    const job = createReportJob({
      reportType: effectiveReportType,
      resultId,
      studentName,
    });

    // Launch background generation runner without blocking HTTP response
    runReportGenerationJob({
      jobId: job.id,
      resultId,
      student,
      scores,
      reportType: effectiveReportType,
      assessmentType,
      variant,
      isSample: isSampleRequest,
      userId: decodedClaims?.uid,
    }).catch(err => {
      console.error(`[PDF Job API] Background runner failed for job ${job.id}:`, err);
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      reportType: job.reportType,
      percent: job.percent,
      stage: job.stage,
      stageDetail: job.stageDetail,
    });
  } catch (error: any) {
    console.error('[PDF Job API] Error creating report job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize report job' },
      { status: 500 }
    );
  }
}

