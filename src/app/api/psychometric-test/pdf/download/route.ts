import { NextRequest, NextResponse } from 'next/server';
import { getReportJobBuffer } from '@/lib/report-job-service';

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

    const { buffer, job } = getReportJobBuffer(jobId);

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: job?.status === 'running'
            ? 'PDF generation is currently in progress. Please poll status until complete.'
            : 'PDF payload not found or expired from cache.',
        },
        { status: 404 }
      );
    }

    const fileName = job?.fileName || `Clarvo_Psychometric_Report_${jobId.slice(-6)}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('[PDF Download API] Error serving PDF download:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to serve PDF download' },
      { status: 500 }
    );
  }
}
