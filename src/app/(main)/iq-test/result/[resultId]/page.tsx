import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import ResultDashboardClient from './ResultDashboardClient';
import { getUserProfile } from '@/lib/auth';

export const revalidate = 0; // Dynamic rendering

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ resultId: string }> 
}): Promise<Metadata> {
  const { resultId } = await params;
  try {
    const docSnap = await adminDb.collection('iq_results').doc(resultId).get();
    if (!docSnap.exists) {
      return {
        title: 'Cognitive Assessment Score | CLARVO Center for Cognitive Sciences',
        description: 'View certified cognitive performance profile and domain analysis on Clarvo.',
      };
    }

    const data = docSnap.data() || {};
    const candidateName = data.userName || 'Candidate';
    const estimatedIQ = data.estimatedIQ ?? 100;
    const percentile = data.percentile ?? 50;
    const cognitiveBand = data.cognitiveBand || 'Average Cognitive Ability';
    const cognitivePersona = data.cognitivePersona || 'The Strategic Thinker';
    const ordinal = getOrdinal(percentile);

    const title = `${candidateName}'s Cognitive Assessment: IQ ${estimatedIQ} (${percentile}${ordinal} Percentile) | CLARVO`;
    const description = `Certified Result: ${candidateName} completed the 45-Question Cognitive Assessment measuring matrix reasoning and spatial logic. Persona: "${cognitivePersona}". Classification: ${cognitiveBand}.`;
    const imageUrl = `/api/iq-test/share-image?resultId=${resultId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${candidateName}'s Cognitive Score: IQ ${estimatedIQ}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    return {
      title: 'Cognitive Assessment Score | CLARVO',
      description: 'View certified cognitive performance profile and domain analysis on Clarvo.',
    };
  }
}

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
