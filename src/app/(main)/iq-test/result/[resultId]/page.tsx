import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import ResultDashboardClient from './ResultDashboardClient';
import { getUserProfile } from '@/lib/auth';

export const revalidate = 0; // Dynamic rendering

export default async function ResultPage({ params }: { params: Promise<{ resultId: string }> }) {
  try {
    const { resultId } = await params;
    const docRef = adminDb.collection('iq_results').doc(resultId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
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
  } catch (error) {
    console.error('Error fetching result:', error);
    return notFound();
  }
}
