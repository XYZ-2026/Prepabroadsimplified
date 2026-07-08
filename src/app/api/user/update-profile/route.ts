import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, mobile, studentType, state, city,
      currentSchool, graduationYear, targetCountries, degreeLevel, fieldOfInterest
    } = body;

    // We do NOT update the email here as it requires Firebase Auth verification
    // and would desync Auth from Firestore if not handled properly.

    await adminDb.collection('users').doc(claims.uid).set({
      name: name || '',
      mobile: mobile || '',
      studentType: studentType || '',
      state: state || '',
      city: city || '',
      currentSchool: currentSchool || '',
      graduationYear: graduationYear || '',
      targetCountries: targetCountries || '',
      degreeLevel: degreeLevel || '',
      fieldOfInterest: fieldOfInterest || '',
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ success: true, user: { name: claims.name || '' } });
    }

    return NextResponse.json({ success: true, user: { ...userDoc.data(), name: userDoc.data()?.name || claims.name || '' } });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

