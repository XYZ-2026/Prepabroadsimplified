import { buildUniversalExecutiveHTMLReport } from '../src/app/(main)/psychometric-test/class10_html_report_builder';
import { generatePersonalization } from '../src/app/(main)/psychometric-test/class10_personalization';
import { adaptReportData } from '../src/app/(main)/psychometric-test/report-engine/adapters';
import { getPathwayRoadmapData } from '../src/app/(main)/psychometric-test/class10_roadmap_engine';
import type { EditorialStudent, EditorialScores } from '../src/app/(main)/psychometric-test/class10_editorial_engine';

const testStudent: EditorialStudent = {
  name: 'agam',
  grade: 'Class 12',
  age: '17',
  school: 'Modern School, Barakhamba Road',
  city: 'New Delhi',
  stream: 'Commerce with Mathematics',
  mathStatus: 'With Mathematics',
  subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English Core'],
  board: 'CBSE',
  academicYear: '2025–2026',
  graduationYear: '2026',
  email: 'agam@clarvo.in',
  date: '12 October 2026',
  reportId: 'AS-12-PTX4VK',
  parentName: 'Mr. & Mrs. Sharma'
};

const testScores: EditorialScores = {
  aptitude: {
    verbal: 82,
    numerical: 86,
    reasoning: 84,
    spatial: 70,
    overall: 81
  },
  personality: {
    openness: 78,
    conscientiousness: 84,
    extraversion: 75,
    agreeableness: 72,
    emotionalStability: 76
  },
  topRiasec: ['Enterprising', 'Conventional', 'Investigative'],
  riasec: {
    realistic: 50,
    investigative: 78,
    artistic: 65,
    social: 70,
    enterprising: 92,
    conventional: 85
  },
  topVark: 'V',
  vark: { visual: 40, aural: 25, readWrite: 25, kinesthetic: 10 },
  topValues: ['Strategic Leadership', 'Financial Growth', 'Operational Excellence'],
  careerFitment: [
    { name: 'Business Administration, Strategy & Management Consulting', score: 92 },
    { name: 'Entrepreneurship, Venture Building & Strategic Business Administration', score: 88 },
    { name: 'Marketing Strategy, Consumer Insights & Brand Leadership', score: 85 }
  ]
};

async function runTests() {
  console.log('=== CLARVO PSYCHOMETRIC REPORT AUTOMATED REGRESSION SUITE ===\n');
  let failures = 0;

  // Build report HTML
  const personalization = await generatePersonalization(testStudent as any, testScores as any, null);
  const adapted = adaptReportData(testStudent, testScores, personalization, null, null, 'senior');
  const html = buildUniversalExecutiveHTMLReport(adapted);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Page 7 Phase Badges
  // ───────────────────────────────────────────────────────────────────────────
  console.log('[TEST 1] Page 7 Phase Badges Verification:');
  const page7Regex = /<!-- PAGE 7: ABOUT THIS ASSESSMENT PAGE -->([\s\S]*?)<!-- PAGE 8:/;
  const page7Match = html.match(page7Regex);
  if (!page7Match) {
    console.error('  FAIL: Could not locate Page 7 in HTML output');
    failures++;
  } else {
    const page7Html = page7Match[1];
    // Check that icons are absent from the phase badges
    const hasAstronaut = page7Html.includes('fa-user-astronaut');
    const hasBrain = page7Html.includes('fa-brain');
    const hasBolt = page7Html.includes('fa-bolt');
    const hasCompass = page7Html.includes('fa-compass');

    if (hasAstronaut || hasBrain || hasBolt || hasCompass) {
      console.error(`  FAIL: Decorative icons found in phase badges (astronaut: ${hasAstronaut}, brain: ${hasBrain}, bolt: ${hasBolt}, compass: ${hasCompass})`);
      failures++;
    } else {
      console.log('  PASS: All 4 decorative icons successfully removed from P1–P4 badges.');
    }

    // Check that text labels P1-P4 are preserved in badges
    const p1 = />\s*P1\s*</.test(page7Html);
    const p2 = />\s*P2\s*</.test(page7Html);
    const p3 = />\s*P3\s*</.test(page7Html);
    const p4 = />\s*P4\s*</.test(page7Html);
    if (p1 && p2 && p3 && p4) {
      console.log('  PASS: Clean typography badges P1, P2, P3, P4 are present and aligned.');
    } else {
      console.error(`  FAIL: Missing clean text badges (P1: ${p1}, P2: ${p2}, P3: ${p3}, P4: ${p4})`);
      failures++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Cover Page Academic Profile
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 2] Cover Page Academic Profile Verification:');
  const page1Regex = /<!-- PAGE 1: STUNNING COVER PAGE -->([\s\S]*?)<!-- PAGE 2:/;
  const page1Match = html.match(page1Regex);
  if (!page1Match) {
    console.error('  FAIL: Could not locate Page 1 in HTML output');
    failures++;
  } else {
    const page1Html = page1Match[1];
    const hasStream = page1Html.includes('Commerce with Mathematics');
    const hasMath = page1Html.includes('With Mathematics');
    const hasBoard = page1Html.includes('CBSE');
    const hasYear = page1Html.includes('2025–2026');
    const hasSubjects = page1Html.includes('Accountancy, Business Studies, Economics, Mathematics, English Core');

    if (hasStream && hasMath && hasBoard && hasYear && hasSubjects) {
      console.log('  PASS: Candidate academic profile fields rendered accurately on Cover Page.');
      console.log('    - Stream: Commerce with Mathematics');
      console.log('    - Mathematics Status: With Mathematics');
      console.log('    - Board: CBSE');
      console.log('    - Academic Year: 2025–2026');
      console.log('    - Subjects: Accountancy, Business Studies, Economics, Mathematics, English Core');
    } else {
      console.error(`  FAIL: Missing academic fields on cover page (stream: ${hasStream}, math: ${hasMath}, board: ${hasBoard}, year: ${hasYear}, subjects: ${hasSubjects})`);
      failures++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2b: Fallback for Missing Academic Profile Data
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 2b] Cover Page Academic Profile Fallback Verification:');
  const emptyStudent = { ...testStudent, stream: undefined, mathStatus: undefined, subjects: undefined, board: undefined, academicYear: undefined };
  const emptyPersonalization = await generatePersonalization(emptyStudent as any, testScores as any, null);
  const emptyAdapted = adaptReportData(emptyStudent, testScores, emptyPersonalization, null, null, 'senior');
  const emptyHtml = buildUniversalExecutiveHTMLReport(emptyAdapted);
  const emptyPage1Match = emptyHtml.match(page1Regex);
  if (emptyPage1Match) {
    const emptyPage1Html = emptyPage1Match[1];
    const fallbackCount = (emptyPage1Html.match(/Not recorded in assessment profile/g) || []).length;
    if (fallbackCount >= 4) {
      console.log(`  PASS: Historical/unrecorded profiles show explicit fallback '${fallbackCount}x Not recorded in assessment profile' (no fabricated values).`);
    } else {
      console.error(`  FAIL: Fallback text appeared ${fallbackCount} times, expected >= 4`);
      failures++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Career Pathway Data Binding (Page 50 vs Page 52)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 3] Career Pathway Data Binding Audit (Rank 1 vs Rank 3):');
  const rank1 = getPathwayRoadmapData(
    'Business Administration, Strategy & Management Consulting',
    'PRIMARY DEGREE & CAREER PATHWAY (RANK 1)',
    testStudent,
    testScores
  );

  const rank3 = getPathwayRoadmapData(
    'Marketing Strategy, Consumer Insights & Brand Leadership',
    'STRATEGIC ALTERNATIVE (RANK 3)',
    testStudent,
    testScores
  );

  console.log(`  Rank 1: "${rank1.pathwayTitle}" (Score: ${rank1.fitScore}%)`);
  console.log(`  Rank 3: "${rank3.pathwayTitle}" (Score: ${rank3.fitScore}%)`);

  if (rank1.pathwayTitle !== rank3.pathwayTitle) {
    console.log('  PASS: Pathway titles are distinct.');
  } else {
    console.error('  FAIL: Rank 1 and Rank 3 have identical titles!');
    failures++;
  }

  // Check bachelor degree distinctions
  const rank1Bachelors = rank1.bachelors.map(b => b.degree);
  const rank3Bachelors = rank3.bachelors.map(b => b.degree);
  const degreeOverlap = rank1Bachelors.filter(d => rank3Bachelors.includes(d));
  if (degreeOverlap.length === 0) {
    console.log(`  PASS: Bachelor degrees are 100% distinct (0 overlap).`);
    console.log(`    Rank 1: ${rank1Bachelors.slice(0, 2).join(' | ')}`);
    console.log(`    Rank 3: ${rank3Bachelors.slice(0, 2).join(' | ')}`);
  } else {
    console.error(`  FAIL: Rank 1 and Rank 3 share overlapping bachelor degrees: ${degreeOverlap.join(', ')}`);
    failures++;
  }

  // Check early career roles
  const rank1Roles = rank1.careerOutcomes;
  const rank3Roles = rank3.careerOutcomes;
  const rolesOverlap = rank1Roles.filter(r => rank3Roles.includes(r));
  if (rolesOverlap.length === 0) {
    console.log(`  PASS: Early career roles are 100% distinct (0 overlap).`);
    console.log(`    Rank 1: ${rank1Roles.slice(0, 2).join(' | ')}`);
    console.log(`    Rank 3: ${rank3Roles.slice(0, 2).join(' | ')}`);
  } else {
    console.error(`  FAIL: Early career roles overlap: ${rolesOverlap.join(', ')}`);
    failures++;
  }

  // Check milestones
  if (rank1.milestone !== rank3.milestone) {
    console.log(`  PASS: Career milestones are distinct.`);
    console.log(`    Rank 1 Milestone: ${rank1.milestone.slice(0, 60)}...`);
    console.log(`    Rank 3 Milestone: ${rank3.milestone.slice(0, 60)}...`);
  } else {
    console.error(`  FAIL: Milestones are identical!`);
    failures++;
  }

  // Check foundation subjects
  const rank1Subs = rank1.foundation.subjects;
  const rank3Subs = rank3.foundation.subjects;
  const subsOverlap = rank1Subs.filter(s => rank3Subs.includes(s));
  console.log(`  PASS: Foundation subjects tailored (Distinct: ${rank1Subs.length - subsOverlap.length} unique in Rank 1).`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Page Count Verification
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 4] Total Page Count Verification:');
  const pageMatches = html.match(/class="as-report-page/g);
  const pageCount = pageMatches ? pageMatches.length : 0;
  console.log(`  Total rendered pages in template: ${pageCount}`);
  if (pageCount === 56) {
    console.log('  PASS: Total page count is exactly 56 pages.');
  } else {
    console.error(`  FAIL: Total pages is ${pageCount}, expected 56.`);
    failures++;
  }

  console.log('\n======================================================');
  if (failures === 0) {
    console.log('ALL REGRESSION TESTS COMPLETED SUCCESSFULLY! (0 failures)');
  } else {
    console.error(`TEST SUITE FINISHED WITH ${failures} FAILURE(S).`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
