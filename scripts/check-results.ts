import * as fs from 'fs';
import * as path from 'path';

// Parse .env manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

async function main() {
  const { adminDb } = await import('../src/lib/firebase-admin');
  const usersSnap = await adminDb.collection('users').where('email', '==', 'agampuri61@gmail.com').get();
  if (usersSnap.empty) {
    console.log('User agampuri61@gmail.com not found');
    return;
  }
  const userDoc = usersSnap.docs[0];
  const uid = userDoc.id;
  console.log('User UID:', uid, userDoc.data().name, 'Grade:', userDoc.data().grade);

  const psychSnap = await adminDb.collection('psychometric_results').where('userId', '==', uid).get();
  console.log(`Found ${psychSnap.size} psychometric results for ${uid}:`);
  psychSnap.docs.forEach(doc => {
    const d = doc.data();
    console.log(`- ID: ${doc.id}`);
    console.log(`  testName: ${d.testName}`);
    console.log(`  assessmentType: ${d.assessmentType}`);
    console.log(`  assessmentVariant: ${d.assessmentVariant}`);
    console.log(`  createdAt: ${d.createdAt}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
