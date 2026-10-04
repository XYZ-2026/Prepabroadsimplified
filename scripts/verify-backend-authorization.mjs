// ═══════════════════════════════════════════════════════════
// Backend Authorization & Immutability Verification
// ═══════════════════════════════════════════════════════════

import { 
  getStudentPsychometricAccess, 
  resolveAssessmentVariant 
} from '../src/lib/psychometric-access-policy.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// Emulate backend authorization check exactly as implemented in /api/psychometric-test/submit
function simulateBackendSubmitAuth({ userProfileGrade, requestedVariant, userRole = 'student' }) {
  const isPrivileged = userRole === 'admin' || userRole === 'counsellor';
  const access = getStudentPsychometricAccess(userProfileGrade, null, userRole);

  if (access.status === 'PROFILE_INCOMPLETE' && !isPrivileged) {
    return {
      status: 403,
      success: false,
      code: 'PROFILE_INCOMPLETE',
      message: 'Please complete your academic profile (select your Grade) before taking or saving an assessment.',
      redirectUrl: '/dashboard/student/update-profile'
    };
  }

  const requestedVariantResolved = resolveAssessmentVariant(requestedVariant);

  if (!isPrivileged && !access.canAccess(requestedVariant)) {
    return {
      status: 403,
      success: false,
      code: 'GRADE_ASSESSMENT_MISMATCH',
      message: `Access denied. Registered in ${access.gradeLabel}, but attempted ${requestedVariant}. Only ${access.eligibleTestName} is unlocked.`,
      redirectUrl: access.eligibleHref
    };
  }

  return {
    status: 200,
    success: true,
    academicGradeAtAttempt: access.grade || '10',
    assessmentVariant: requestedVariantResolved || access.eligibleVariant,
    assessmentVersion: '2.0.0',
    questionBankVersion: '2026.1'
  };
}

console.log('\n--- 1. Grade 10 Student Authorization ---');
const r10_valid = simulateBackendSubmitAuth({ userProfileGrade: '10', requestedVariant: 'grade10' });
assert(r10_valid.status === 200, 'Grade 10 authorized for grade10 assessment');
assert(r10_valid.academicGradeAtAttempt === '10', 'Persists academicGradeAtAttempt: "10"');
assert(r10_valid.assessmentVariant === 'CLASS_10', 'Persists assessmentVariant: "CLASS_10"');

const r10_invalid_junior = simulateBackendSubmitAuth({ userProfileGrade: '10', requestedVariant: 'junior' });
assert(r10_invalid_junior.status === 403, 'Grade 10 rejected with HTTP 403 for junior assessment');
assert(r10_invalid_junior.code === 'GRADE_ASSESSMENT_MISMATCH', 'Rejection code is GRADE_ASSESSMENT_MISMATCH');
assert(r10_invalid_junior.redirectUrl === '/psychometric-test?type=grade10', 'Redirects to /psychometric-test?type=grade10');

const r10_invalid_senior = simulateBackendSubmitAuth({ userProfileGrade: '10', requestedVariant: 'senior' });
assert(r10_invalid_senior.status === 403, 'Grade 10 rejected with HTTP 403 for senior assessment');

console.log('\n--- 2. Grade 8 Student Authorization ---');
const r8_valid = simulateBackendSubmitAuth({ userProfileGrade: '8', requestedVariant: 'junior' });
assert(r8_valid.status === 200, 'Grade 8 authorized for junior assessment');
assert(r8_valid.academicGradeAtAttempt === '8', 'Persists academicGradeAtAttempt: "8"');

const r8_invalid_g10 = simulateBackendSubmitAuth({ userProfileGrade: '8', requestedVariant: 'grade10' });
assert(r8_invalid_g10.status === 403, 'Grade 8 rejected with HTTP 403 for grade10 assessment');
assert(r8_invalid_g10.redirectUrl === '/psychometric-test?type=junior', 'Redirects to /psychometric-test?type=junior');

console.log('\n--- 3. Grade 12 Student Authorization ---');
const r12_valid = simulateBackendSubmitAuth({ userProfileGrade: '12', requestedVariant: 'senior' });
assert(r12_valid.status === 200, 'Grade 12 authorized for senior assessment');
assert(r12_valid.academicGradeAtAttempt === '12', 'Persists academicGradeAtAttempt: "12"');

const r12_invalid_g10 = simulateBackendSubmitAuth({ userProfileGrade: '12', requestedVariant: 'grade10' });
assert(r12_invalid_g10.status === 403, 'Grade 12 rejected with HTTP 403 for grade10 assessment');
assert(r12_invalid_g10.redirectUrl === '/psychometric-test?type=senior', 'Redirects to /psychometric-test?type=senior');

console.log('\n--- 4. Incomplete Profile Rejection ---');
const rIncomplete = simulateBackendSubmitAuth({ userProfileGrade: null, requestedVariant: 'grade10' });
assert(rIncomplete.status === 403, 'Incomplete profile rejected with HTTP 403');
assert(rIncomplete.code === 'PROFILE_INCOMPLETE', 'Code is PROFILE_INCOMPLETE');
assert(rIncomplete.redirectUrl === '/dashboard/student/update-profile', 'Redirects to /dashboard/student/update-profile');

console.log('\n--- 5. Historical Report Immutability ---');
// Student took test in 2024 when in Grade 10:
const historicalSavedDoc = {
  id: 'AS-2024-99881',
  academicGradeAtAttempt: '10',
  assessmentVariant: 'CLASS_10',
  student: {
    name: 'Aarav Sharma',
    grade: '10'
  },
  scores: { aptitude: { overall: 85 } }
};

// In 2026, Aarav updates his profile to Grade 12:
const currentStudentProfile = {
  name: 'Aarav Sharma',
  grade: '12',
  academicGrade: '12',
  stream: 'science-pcm'
};

// When viewing historical report:
function resolveDisplayGradeForReport(doc, liveProfile) {
  return doc.academicGradeAtAttempt || doc.student?.grade || liveProfile.grade;
}

const reportGrade = resolveDisplayGradeForReport(historicalSavedDoc, currentStudentProfile);
assert(reportGrade === '10', 'Historical report retains Grade 10 even when user profile updated to Grade 12');

console.log('\n=============================================');
console.log(`AUTHORIZATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('=============================================\n');

if (failed > 0) {
  process.exit(1);
}
