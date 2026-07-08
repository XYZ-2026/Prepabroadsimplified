import { redirect } from 'next/navigation';

export default async function ResultPage({ params, searchParams }: { params: Promise<{ resultId: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const source = resolvedSearchParams.source ? `&source=${resolvedSearchParams.source}` : '';
  redirect(`/psychometric-test?resultId=${resolvedParams.resultId}${source}`);
}
