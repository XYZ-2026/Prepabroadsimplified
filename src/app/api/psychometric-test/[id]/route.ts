import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getUserRole } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const docRef = await adminDb.collection('psychometric_results').doc(resolvedParams.id).get();
    
    if (!docRef.exists) {
      return NextResponse.json({ success: false, message: 'Result not found' }, { status: 404 });
    }

    const role = await getUserRole();
    const isAdmin = role === 'admin';

    return NextResponse.json({ 
      success: true, 
      result: { id: docRef.id, ...docRef.data() },
      isAdmin
    });
  } catch (error) {
    console.error('Error fetching psychometric result:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch result' }, { status: 500 });
  }
}
