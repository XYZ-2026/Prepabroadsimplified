import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/auth';
import { getWorkflowState } from '@/lib/assessment-workflow';

export default async function ResultPage({ params, searchParams }: { params: Promise<{ resultId: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const source = resolvedSearchParams.source ? `&source=${resolvedSearchParams.source}` : '';

  try {
    const role: any = await getUserRole();
    const isAdmin = role === 'admin' || role === 'counsellor';

    if (!isAdmin) {
      let state = 'parent_pending';
      try {
        state = await getWorkflowState(resolvedParams.resultId);
      } catch (wfErr) {
        console.warn('[ResultPage] Workflow lookup warning:', wfErr);
      }

      if (state !== 'report_unlocked') {
        redirect(`/parent-assessment?resultId=${resolvedParams.resultId}`);
      }
    }
  } catch (err: any) {
    if (err?.digest?.startsWith?.('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.warn('[ResultPage] Non-redirect error in workflow verification:', err);
  }

  redirect(`/psychometric-test?resultId=${resolvedParams.resultId}${source}`);
}
