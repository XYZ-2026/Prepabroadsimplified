// ═══════════════════════════════════════════════════════════
// Automated Verification Script for Grade-Based Psychometric Access
// ═══════════════════════════════════════════════════════════

import { 
  normalizeGrade, 
  getStudentPsychometricAccess, 
  resolveAssessmentVariant, 
  formatGradeLabel,
  GRADE_TO_PSYCHOMETRIC_MAP,
  ASSESSMENT_DEFINITIONS 
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

console.log('\n--- 1. Testing Grade Normalization ---');
assert(normalizeGrade('7') === '7', 'Normalizes string "7" -> "7"');
assert(normalizeGrade(7) === '7', 'Normalizes number 7 -> "7"');
assert(normalizeGrade('7th') === '7', 'Normalizes "7th" -> "7"');
assert(normalizeGrade('Class 7') === '7', 'Normalizes "Class 7" -> "7"');
assert(normalizeGrade('Grade 8') === '8', 'Normalizes "Grade 8" -> "8"');
assert(normalizeGrade('8th Grade') === '8', 'Normalizes "8th Grade" -> "8"');
assert(normalizeGrade('9th') === '9', 'Normalizes "9th" -> "9"');
assert(normalizeGrade('10') === '10', 'Normalizes "10" -> "10"');
assert(normalizeGrade('Class 10th') === '10', 'Normalizes "Class 10th" -> "10"');
assert(normalizeGrade('11') === '11', 'Normalizes "11" -> "11"');
assert(normalizeGrade('Grade 11') === '11', 'Normalizes "Grade 11" -> "11"');
assert(normalizeGrade('12') === '12', 'Normalizes "12" -> "12"');
assert(normalizeGrade('12th') === '12', 'Normalizes "12th" -> "12"');
assert(normalizeGrade('Class 12') === '12', 'Normalizes "Class 12" -> "12"');
assert(normalizeGrade(null) === null, 'null input returns null');
assert(normalizeGrade(undefined) === null, 'undefined input returns null');
assert(normalizeGrade('') === null, 'empty string returns null');
assert(normalizeGrade('College') === null, 'Invalid grade "College" returns null');
assert(normalizeGrade('5') === null, 'Out-of-range grade "5" returns null');

console.log('\n--- 2. Testing 6-Grade Access Resolution & Target Mapping ---');

// Grade 7 -> JUNIOR_7_9
const g7 = getStudentPsychometricAccess('7');
assert(g7.status === 'ELIGIBLE', 'Grade 7 status is ELIGIBLE');
assert(g7.eligibleVariant === 'JUNIOR_7_9', 'Grade 7 eligibleVariant is JUNIOR_7_9');
assert(g7.eligibleHref === '/psychometric-test?type=junior', 'Grade 7 eligibleHref is /psychometric-test?type=junior');
assert(g7.canAccess('junior') === true, 'Grade 7 canAccess("junior") === true');
assert(g7.canAccess('7-9') === true, 'Grade 7 canAccess("7-9") === true');
assert(g7.canAccess('grade10') === false, 'Grade 7 canAccess("grade10") === false');
assert(g7.canAccess('senior') === false, 'Grade 7 canAccess("senior") === false');

// Grade 8 -> JUNIOR_7_9
const g8 = getStudentPsychometricAccess('8');
assert(g8.status === 'ELIGIBLE' && g8.eligibleVariant === 'JUNIOR_7_9', 'Grade 8 maps to JUNIOR_7_9');
assert(g8.canAccess('junior') === true, 'Grade 8 canAccess("junior") === true');
assert(g8.canAccess('grade10') === false, 'Grade 8 canAccess("grade10") === false');

// Grade 9 -> JUNIOR_7_9
const g9 = getStudentPsychometricAccess('9');
assert(g9.status === 'ELIGIBLE' && g9.eligibleVariant === 'JUNIOR_7_9', 'Grade 9 maps to JUNIOR_7_9');
assert(g9.canAccess('junior') === true, 'Grade 9 canAccess("junior") === true');
assert(g9.canAccess('senior') === false, 'Grade 9 canAccess("senior") === false');

// Grade 10 -> CLASS_10
const g10 = getStudentPsychometricAccess('10');
assert(g10.status === 'ELIGIBLE', 'Grade 10 status is ELIGIBLE');
assert(g10.eligibleVariant === 'CLASS_10', 'Grade 10 eligibleVariant is CLASS_10');
assert(g10.eligibleHref === '/psychometric-test?type=grade10', 'Grade 10 eligibleHref is /psychometric-test?type=grade10');
assert(g10.canAccess('grade10') === true, 'Grade 10 canAccess("grade10") === true');
assert(g10.canAccess('10') === true, 'Grade 10 canAccess("10") === true');
assert(g10.canAccess('junior') === false, 'Grade 10 canAccess("junior") === false');
assert(g10.canAccess('senior') === false, 'Grade 10 canAccess("senior") === false');

// Grade 11 -> SENIOR_12
const g11 = getStudentPsychometricAccess('11');
assert(g11.status === 'ELIGIBLE', 'Grade 11 status is ELIGIBLE');
assert(g11.eligibleVariant === 'SENIOR_12', 'Grade 11 eligibleVariant is SENIOR_12');
assert(g11.eligibleHref === '/psychometric-test?type=senior', 'Grade 11 eligibleHref is /psychometric-test?type=senior');
assert(g11.canAccess('senior') === true, 'Grade 11 canAccess("senior") === true');
assert(g11.canAccess('12') === true, 'Grade 11 canAccess("12") === true');
assert(g11.canAccess('junior') === false, 'Grade 11 canAccess("junior") === false');
assert(g11.canAccess('grade10') === false, 'Grade 11 canAccess("grade10") === false');

// Grade 12 -> SENIOR_12
const g12 = getStudentPsychometricAccess('12');
assert(g12.status === 'ELIGIBLE' && g12.eligibleVariant === 'SENIOR_12', 'Grade 12 maps to SENIOR_12');
assert(g12.canAccess('senior') === true, 'Grade 12 canAccess("senior") === true');
assert(g12.canAccess('grade10') === false, 'Grade 12 canAccess("grade10") === false');

console.log('\n--- 3. Testing Legacy / Incomplete Profile Handling ---');
const incomplete1 = getStudentPsychometricAccess(null);
assert(incomplete1.status === 'PROFILE_INCOMPLETE', 'null grade results in PROFILE_INCOMPLETE');
assert(incomplete1.eligibleVariant === null, 'Incomplete profile has no eligibleVariant');
assert(incomplete1.canAccess('junior') === false, 'Incomplete profile cannot access junior test');
assert(incomplete1.canAccess('grade10') === false, 'Incomplete profile cannot access grade10 test');
assert(incomplete1.canAccess('senior') === false, 'Incomplete profile cannot access senior test');
assert(incomplete1.eligibleHref === '/dashboard/student/update-profile', 'Incomplete profile routes to update-profile');

const incomplete2 = getStudentPsychometricAccess('');
assert(incomplete2.status === 'PROFILE_INCOMPLETE', 'Empty string grade results in PROFILE_INCOMPLETE');

console.log('\n--- 4. Testing resolveAssessmentVariant Resolver ---');
assert(resolveAssessmentVariant('junior') === 'JUNIOR_7_9', 'resolveAssessmentVariant("junior") -> JUNIOR_7_9');
assert(resolveAssessmentVariant('7-9') === 'JUNIOR_7_9', 'resolveAssessmentVariant("7-9") -> JUNIOR_7_9');
assert(resolveAssessmentVariant('grade10') === 'CLASS_10', 'resolveAssessmentVariant("grade10") -> CLASS_10');
assert(resolveAssessmentVariant('10') === 'CLASS_10', 'resolveAssessmentVariant("10") -> CLASS_10');
assert(resolveAssessmentVariant('senior') === 'SENIOR_12', 'resolveAssessmentVariant("senior") -> SENIOR_12');
assert(resolveAssessmentVariant('12') === 'SENIOR_12', 'resolveAssessmentVariant("12") -> SENIOR_12');

console.log('\n--- 5. Testing Format Grade Label ---');
assert(formatGradeLabel('7') === 'Grade 7', 'formatGradeLabel("7") -> "Grade 7"');
assert(formatGradeLabel('10') === 'Grade 10', 'formatGradeLabel("10") -> "Grade 10"');
assert(formatGradeLabel('12') === 'Grade 12', 'formatGradeLabel("12") -> "Grade 12"');
assert(formatGradeLabel(null) === 'Not Specified', 'formatGradeLabel(null) -> "Not Specified"');

console.log('\n=============================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('=============================================\n');

if (failed > 0) {
  process.exit(1);
}
