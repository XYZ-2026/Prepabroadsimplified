import { NextRequest, NextResponse } from 'next/server';
import { getReportJob } from '@/lib/report-job-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: jobId' },
        { status: 400 }
      );
    }

    const job = await getReportJob(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Report job not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        stage: job.stage,
        percent: job.percent,
        stageDetail: job.stageDetail,
        reportType: job.reportType,
        resultId: job.resultId,
        studentName: job.studentName,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        error: job.error || null,
        resultUrl: job.resultUrl || null,
        fileName: job.fileName,
      },
    });
  } catch (error: any) {
    console.error('[PDF Status API] Error retrieving job status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve job status' },
      { status: 500 }
    );
  }
}

