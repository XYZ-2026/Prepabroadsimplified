import { adminAuth, adminDb } from '../src/lib/firebase-admin';

async function main() {
  const targetEmail = 'agampuri61@gmail.com';
  console.log(`Checking account status for: ${targetEmail}`);

  let uid: string;
  try {
    const user = await adminAuth.getUserByEmail(targetEmail);
    uid = user.uid;
    console.log(`[AUTH] User exists with UID: ${uid}`);
    // Ensure password is admin123
    await adminAuth.updateUser(uid, {
      password: 'admin123',
    });
    console.log(`[AUTH] Password updated/verified for: ${targetEmail}`);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      console.log(`[AUTH] User not found. Creating user ${targetEmail}...`);
      const created = await adminAuth.createUser({
        email: targetEmail,
        password: 'admin123',
        displayName: 'Agam Puri',
      });
      uid = created.uid;
      console.log(`[AUTH] User successfully created with UID: ${uid}`);
    } else {
      throw err;
    }
  }

  // Ensure Firestore document
  const userDocRef = adminDb.collection('users').doc(uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    console.log(`[FIRESTORE] Document missing. Creating student document for ${targetEmail}...`);
    await userDocRef.set({
      name: 'Agam Puri',
      email: targetEmail,
      role: 'student',
      studentType: 'class_11_12',
      currentSchool: 'Delhi Public School',
      graduationYear: '2026',
      targetCountries: 'USA, UK, Canada, Germany',
      degreeLevel: 'undergraduate',
      fieldOfInterest: 'Computer Science & AI',
      state: 'Delhi',
      city: 'New Delhi',
      mobile: '+91 98765 43210',
      createdAt: new Date(),
      toolAccess: {
        iqTest: true,
        psychometricTest: true,
        universityPredictor: true,
      }
    });
    console.log(`[FIRESTORE] Student profile created.`);
  } else {
    console.log(`[FIRESTORE] Document exists:`, userDoc.data()?.name, `(role: ${userDoc.data()?.role})`);
    // Ensure toolAccess is active
    await userDocRef.update({
      toolAccess: {
        iqTest: true,
        psychometricTest: true,
        universityPredictor: true,
      }
    });
    console.log(`[FIRESTORE] Tool access verified/enabled.`);
  }

  console.log(`\nREADY: Account ${targetEmail} / admin123 is fully configured for student E2E testing.`);
}

main().catch(console.error);
