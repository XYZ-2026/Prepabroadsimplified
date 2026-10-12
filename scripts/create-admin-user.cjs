const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'admin@as.com';
const ADMIN_PASSWORD = 'admin123';

async function main() {
  console.log(`\n========================================`);
  console.log(`Setting up Admin Login in Firebase`);
  console.log(`Project: ${env.FIREBASE_ADMIN_PROJECT_ID}`);
  console.log(`Email:   ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`========================================\n`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`[Auth] User already exists with UID: ${userRecord.uid}`);
    
    // Update password & verify status
    userRecord = await auth.updateUser(userRecord.uid, {
      password: ADMIN_PASSWORD,
      emailVerified: true,
      displayName: 'Admin',
    });
    console.log(`[Auth] ✅ Password updated to "${ADMIN_PASSWORD}" and emailVerified set to true.`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log(`[Auth] User does not exist. Creating new user...`);
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: 'Admin',
      });
      console.log(`[Auth] ✅ User created successfully with UID: ${userRecord.uid}`);
    } else {
      console.error(`[Auth] ❌ Error checking user:`, err);
      process.exit(1);
    }
  }

  // Set custom user claims for Admin
  console.log(`[Auth] Setting custom user claims { admin: true, role: 'admin' }...`);
  await auth.setCustomUserClaims(userRecord.uid, {
    admin: true,
    role: 'admin',
  });
  console.log(`[Auth] ✅ Custom claims successfully assigned.`);

  // Verify custom claims
  const updatedUser = await auth.getUser(userRecord.uid);
  console.log(`[Auth] Verified custom claims on record:`, updatedUser.customClaims);

  // Ensure document exists in Firestore 'users' collection
  console.log(`[Firestore] Syncing document in 'users/${userRecord.uid}'...`);
  const userDocRef = db.collection('users').doc(userRecord.uid);
  await userDocRef.set({
    uid: userRecord.uid,
    email: ADMIN_EMAIL,
    name: 'Admin',
    role: 'admin',
    admin: true,
    studentType: 'Admin',
    state: 'Admin HQ',
    city: 'System',
    toolAccess: {
      iqTest: true,
      psychometricTest: true,
      universityPredictor: true,
    },
    updatedAt: new Date(),
  }, { merge: true });
  console.log(`[Firestore] ✅ Document successfully updated in 'users/${userRecord.uid}'.`);

  console.log(`\n🎉 Admin setup complete!`);
  console.log(`Credentials:`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  UID:      ${userRecord.uid}\n`);
}

main().catch(err => {
  console.error('Fatal error setting up admin:', err);
  process.exit(1);
});
