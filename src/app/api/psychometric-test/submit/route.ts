import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { student, scores, narrative, assessmentType } = data;

    // Check if the user is logged in
    const claims = await verifySessionCookie();
    
    let userName = student?.name || 'Candidate';
    if (claims && (!student?.name || student.name === 'Candidate' || student.name === 'Guest Student')) {
      try {
        const userDoc = await adminDb.collection('users').doc(claims.uid).get();
        if (userDoc.exists) {
          userName = userDoc.data()?.name || claims.name || 'Candidate';
        } else {
          userName = claims.name || 'Candidate';
        }
        userName = userName.split(' ')[0];
      } catch (error) {
        console.warn('Error fetching user name for psychometric test:', error);
      }
    }

    let testName = 'Psychometric Assessment';
    if (assessmentType === 'junior') testName = 'Junior Psychometric Test';
    else if (assessmentType === 'grade10') testName = 'Grade 10 Psychometric Test';
    else if (assessmentType === 'highschool') testName = 'Grade 11/12 Psychometric Test';

    // Prepare full document
    const finalDocument = {
      testName,
      type: 'psychometric',
      assessmentType,
      student: { ...student, name: userName },
      scores,
      narrative,
      tier: 'Premium',
      userId: claims ? claims.uid : null, // Attach userId if available
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    const docRef = await adminDb.collection('psychometric_results').add(finalDocument);

    return NextResponse.json({ 
      success: true, 
      resultId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting psychometric test:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit test' }, { status: 500 });
  }
}
