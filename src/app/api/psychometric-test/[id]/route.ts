import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const docRef = await adminDb.collection('psychometric_results').doc(resolvedParams.id).get();
    
    if (!docRef.exists) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      result: { id: docRef.id, ...docRef.data() }
    });
  } catch (error) {
    console.error('Error fetching psychometric result:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch result' }, { status: 500 });
  }
}
