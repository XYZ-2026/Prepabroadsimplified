import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.careerAbroadData !== undefined) {
      updateData.careerAbroadData = body.careerAbroadData;
    }
    if (body.allCrmData !== undefined) {
      updateData.allCrmData = body.allCrmData;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: 'Nothing to update' });
    }

    await adminDb.collection('psychometric_results').doc(resolvedParams.id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating generated data for psychometric result:', error);
    return NextResponse.json({ success: false, message: 'Failed to update result' }, { status: 500 });
  }
}
