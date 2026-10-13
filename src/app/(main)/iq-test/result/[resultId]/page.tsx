import { notFound, redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import ResultDashboardClient from './ResultDashboardClient';
import { getUserProfile } from '@/lib/auth';

export const revalidate = 0; // Dynamic rendering

export default async function ResultPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ resultId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { resultId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const source = resolvedSearchParams.source ? `&source=${resolvedSearchParams.source}` : '';

  try {
    const docRef = adminDb.collection('iq_results').doc(resultId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // Automatic fallback: check if this assessment result is stored in psychometric_results
      try {
        const psychoSnap = await adminDb.collection('psychometric_results').doc(resultId).get();
        if (psychoSnap.exists) {
          redirect(`/psychometric-test?resultId=${resultId}${source}`);
        }
      } catch (err: any) {
        if (err?.digest?.startsWith?.('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') {
          throw err;
        }
      }

      return notFound();
    }

    const data = docSnap.data();
    const userProfile = await getUserProfile();
    const userName = userProfile?.name || '';
    
    // We pass the serialized data down to the client component
    return (
      <ResultDashboardClient 
        resultData={JSON.parse(JSON.stringify(data))} 
        resultId={resultId}
        userName={userName}
      />
    );
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_REDIRECT') || error?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error fetching result:', error);
    return notFound();
  }
}
