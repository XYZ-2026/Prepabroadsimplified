/**
 * Reproduction Script: Roadmap Pages Identical Content Diagnosis
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds reports for fixtures across all 3 report variants:
 * - Junior (Class 7–9)
 * - Grade 10 (Class 10)
 * - Senior (Class 11–12)
 *
 * Fixtures:
 * 1. PCM-leaning
 * 2. PCB-leaning
 * 3. Commerce-leaning
 * 4. Humanities-leaning
 * 5. Tied top scores
 * 6. Missing intake fields
 *
 * Prints a table of Rank -> Pathway Title, Domain, and Identical Content Check.
 */

import { adaptReportData, resolveReportVariant } from '../src/app/(main)/psychometric-test/report-engine/adapters';
import { getSpecializedDomain } from '../src/app/(main)/psychometric-test/class10_roadmap_engine';
import type { EditorialStudent, EditorialScores, PersonalizationData } from '../src/app/(main)/psychometric-test/class10_editorial_engine';

interface Fixture {
  id: string;
  name: string;
  description: string;
  student: Partial<EditorialStudent>;
  scoresJuniorGrade10: Partial<EditorialScores>;
  scoresSenior: Partial<EditorialScores>;
}

const mockPersonalization: PersonalizationData = {
  executiveSummary: '',
  strengths: [],
  growthAreas: [],
  parentGuide: { observations: [], homeStrategies: [], communicationTips: [] },
  teacherGuide: { classroomAdaptations: [], learningSupport: [], assessmentTips: [] },
  careerRoadmap: { shortTerm: [], mediumTerm: [], longTerm: [] },
};

const FIXTURES: Fixture[] = [
  {
    id: 'pcm_leaning',
    name: 'PCM-Leaning Candidate',
    description: 'High aptitude & interest in math, physics, software and engineering',
    student: {
      name: 'Aarav Sharma',
      school: 'Delhi Public School, R.K. Puram',
      city: 'New Delhi',
      stream: 'Science (PCM)',
      mathStatus: 'Standard Mathematics',
      board: 'CBSE',
    },
    scoresJuniorGrade10: {
      aptitude: { verbal: 78, numerical: 94, reasoning: 92, spatial: 88, overall: 88 },
      careerFitment: [
        { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 94 },
        { name: 'Commerce, Business & Management Stream', score: 85 },
        { name: 'Science Stream – Medical & Life Sciences Track (PCB)', score: 79 },
        { name: 'Humanities & Creative Arts Stream', score: 72 },
      ],
    },
    scoresSenior: {
      aptitude: { verbal: 78, numerical: 94, reasoning: 92, spatial: 88, overall: 88 },
      careerFitment: [
        { name: 'Software Engineering & IT', score: 95 },
        { name: 'Data Science & AI', score: 92 },
        { name: 'Mechanical Engineering', score: 86 },
        { name: 'Robotics & Automation', score: 84 },
      ],
    },
  },
  {
    id: 'pcb_leaning',
    name: 'PCB-Leaning Candidate',
    description: 'High interest in medicine, life sciences, biology and health',
    student: {
      name: 'Diya Patel',
      school: 'The Mother\'s International School',
      city: 'Ahmedabad',
      stream: 'Science (PCB)',
      mathStatus: 'Basic Mathematics',
      board: 'CBSE',
    },
    scoresJuniorGrade10: {
      aptitude: { verbal: 85, numerical: 72, reasoning: 86, spatial: 78, overall: 80 },
      careerFitment: [
        { name: 'Science Stream – Medical & Life Sciences Track (PCB)', score: 93 },
        { name: 'Humanities & Creative Arts Stream', score: 84 },
        { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 76 },
        { name: 'Commerce, Business & Management Stream', score: 71 },
      ],
    },
    scoresSenior: {
      aptitude: { verbal: 85, numerical: 72, reasoning: 86, spatial: 78, overall: 80 },
      careerFitment: [
        { name: 'Medicine & Surgery', score: 95 },
        { name: 'Biotechnology & Genetics', score: 90 },
        { name: 'Pharmacy & Drug Research', score: 85 },
        { name: 'Psychology & Counselling', score: 81 },
      ],
    },
  },
  {
    id: 'commerce_leaning',
    name: 'Commerce-Leaning Candidate',
    description: 'High interest in finance, economics, business and entrepreneurship',
    student: {
      name: 'Rohan Mehta',
      school: 'Cathedral and John Connon School',
      city: 'Mumbai',
      stream: 'Commerce with Maths',
      mathStatus: 'Applied Mathematics',
      board: 'ICSE',
    },
    scoresJuniorGrade10: {
      aptitude: { verbal: 82, numerical: 88, reasoning: 85, spatial: 68, overall: 81 },
      careerFitment: [
        { name: 'Commerce, Business & Management Stream', score: 92 },
        { name: 'Humanities & Creative Arts Stream', score: 83 },
        { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 78 },
        { name: 'Science Stream – Medical & Life Sciences Track (PCB)', score: 70 },
      ],
    },
    scoresSenior: {
      aptitude: { verbal: 82, numerical: 88, reasoning: 85, spatial: 68, overall: 81 },
      careerFitment: [
        { name: 'Chartered Accountancy & Audit', score: 94 },
        { name: 'Finance & Investment Banking', score: 91 },
        { name: 'Economics & Policy', score: 87 },
        { name: 'Business Management & MBA', score: 84 },
      ],
    },
  },
  {
    id: 'humanities_leaning',
    name: 'Humanities-Leaning Candidate',
    description: 'High verbal expression, law, design, psychology and social sciences',
    student: {
      name: 'Ananya Iyer',
      school: 'National Public School, Indiranagar',
      city: 'Bangalore',
      stream: 'Humanities & Arts',
      mathStatus: 'Not Opted',
      board: 'CBSE',
    },
    scoresJuniorGrade10: {
      aptitude: { verbal: 94, numerical: 65, reasoning: 86, spatial: 76, overall: 80 },
      careerFitment: [
        { name: 'Humanities & Creative Arts Stream', score: 94 },
        { name: 'Commerce, Business & Management Stream', score: 82 },
        { name: 'Science Stream – Medical & Life Sciences Track (PCB)', score: 74 },
        { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 68 },
      ],
    },
    scoresSenior: {
      aptitude: { verbal: 94, numerical: 65, reasoning: 86, spatial: 76, overall: 80 },
      careerFitment: [
        { name: 'Law & Legal Services', score: 93 },
        { name: 'Psychology & Counselling', score: 89 },
        { name: 'Journalism & Mass Media', score: 85 },
        { name: 'Civil Services & Governance', score: 82 },
      ],
    },
  },
  {
    id: 'tied_scores',
    name: 'Tied Top Scores Candidate',
    description: 'Candidate with equal scores across top streams',
    student: {
      name: 'Kavya Nair',
      school: 'Vasant Valley School',
      city: 'New Delhi',
      stream: 'Undecided',
      mathStatus: 'Standard Mathematics',
      board: 'CBSE',
    },
    scoresJuniorGrade10: {
      aptitude: { verbal: 82, numerical: 82, reasoning: 82, spatial: 82, overall: 82 },
      careerFitment: [
        { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 85 },
        { name: 'Science Stream – Medical & Life Sciences Track (PCB)', score: 85 },
        { name: 'Humanities & Creative Arts Stream', score: 85 },
        { name: 'Commerce, Business & Management Stream', score: 85 },
      ],
    },
    scoresSenior: {
      aptitude: { verbal: 82, numerical: 82, reasoning: 82, spatial: 82, overall: 82 },
      careerFitment: [
        { name: 'Software Engineering & IT', score: 88 },
        { name: 'Data Science & AI', score: 88 },
        { name: 'Civil Engineering & Architecture', score: 88 },
        { name: 'Mechanical Engineering', score: 88 },
      ],
    },
  },
  {
    id: 'missing_intake_fields',
    name: 'Missing Intake Fields Candidate',
    description: 'Candidate with omitted intake metadata (no name, grade, stream, empty careerFitment)',
    student: {
      // Empty student profile
    },
    scoresJuniorGrade10: {
      // Empty scores
    },
    scoresSenior: {
      // Empty scores
    },
  },
];

const VARIANTS: Array<{ variant: 'junior' | 'grade10' | 'senior'; gradeLabel: string }> = [
  { variant: 'junior', gradeLabel: 'Class 8' },
  { variant: 'grade10', gradeLabel: 'Class 10' },
  { variant: 'senior', gradeLabel: 'Class 12' },
];

function runReproduction() {
  console.log('='.repeat(120));
  console.log('DIAGNOSTIC REPRODUCTION: ROADMAP CONTENT INTEGRITY ACROSS FIXTURES & VARIANTS');
  console.log('='.repeat(120));

  const summaryRows: Array<{
    variant: string;
    fixture: string;
    rank1Title: string;
    rank2Title: string;
    rank3Title: string;
    identicalContent: string;
    identicalDetails: string;
  }> = [];

  for (const { variant, gradeLabel } of VARIANTS) {
    console.log(`\n\n>>> VARIANT: ${variant.toUpperCase()} (${gradeLabel})`);
    console.log('-'.repeat(120));

    for (const fixture of FIXTURES) {
      const studentInput: EditorialStudent = {
        name: fixture.student.name || '',
        grade: fixture.student.grade || gradeLabel,
        age: '15',
        school: fixture.student.school || '',
        city: fixture.student.city || '',
        stream: fixture.student.stream || '',
        mathStatus: fixture.student.mathStatus || '',
        subjects: '',
        board: fixture.student.board || '',
        academicYear: '2026-2027',
        graduationYear: '2027',
        email: '',
        date: 'November 1, 2026',
        reportId: `REP-${fixture.id.toUpperCase()}`,
        parentName: '',
      };

      const rawScores = variant === 'senior' ? fixture.scoresSenior : fixture.scoresJuniorGrade10;
      const scoresInput: EditorialScores = {
        aptitude: rawScores.aptitude || { verbal: 75, numerical: 75, reasoning: 75, spatial: 75, overall: 75 },
        personality: { openness: 75, conscientiousness: 75, extraversion: 70, agreeableness: 70, emotionalStability: 70 },
        topRiasec: ['Investigative', 'Realistic', 'Enterprising'],
        riasec: {},
        topVark: 'V',
        vark: {},
        topValues: ['Autonomy', 'Mastery'],
        careerFitment: rawScores.careerFitment as any || [],
      };

      // Run adaptation pipeline
      const adapted = adaptReportData(
        studentInput,
        scoresInput,
        mockPersonalization,
        null,
        null,
        variant
      );

      const r1 = adapted.roadmaps.primary;
      const r2 = adapted.roadmaps.secondary;
      const r3 = adapted.roadmaps.alternative;

      // Check whether content is identical
      const r1Content = JSON.stringify({ foundation: r1.foundation, bachelors: r1.bachelors, colleges: r1.colleges, masters: r1.masters, milestone: r1.milestone });
      const r2Content = JSON.stringify({ foundation: r2.foundation, bachelors: r2.bachelors, colleges: r2.colleges, masters: r2.masters, milestone: r2.milestone });
      const r3Content = JSON.stringify({ foundation: r3.foundation, bachelors: r3.bachelors, colleges: r3.colleges, masters: r3.masters, milestone: r3.milestone });

      const r1_eq_r2 = r1Content === r2Content;
      const r1_eq_r3 = r1Content === r3Content;
      const r2_eq_r3 = r2Content === r3Content;

      let identicalStatus = 'NO (All Distinct)';
      let details = 'Distinct roadmaps generated';

      if (r1_eq_r2 && r2_eq_r3) {
        identicalStatus = 'YES - ALL 3 IDENTICAL';
        details = 'Rank 1, 2, and 3 share 100% identical body content';
      } else if (r1_eq_r2) {
        identicalStatus = 'PARTIAL (Rank 1 == Rank 2)';
        details = 'Rank 1 and Rank 2 share 100% identical body content';
      } else if (r1_eq_r3) {
        identicalStatus = 'PARTIAL (Rank 1 == Rank 3)';
        details = 'Rank 1 and Rank 3 share 100% identical body content';
      } else if (r2_eq_r3) {
        identicalStatus = 'PARTIAL (Rank 2 == Rank 3)';
        details = 'Rank 2 and Rank 3 share 100% identical body content';
      }

      summaryRows.push({
        variant,
        fixture: fixture.name,
        rank1Title: `${r1.pathwayTitle} (${r1.fitScore}%)`,
        rank2Title: `${r2.pathwayTitle} (${r2.fitScore}%)`,
        rank3Title: `${r3.pathwayTitle} (${r3.fitScore}%)`,
        identicalContent: identicalStatus,
        identicalDetails: details,
      });

      console.log(`\nFixture: [${fixture.id}] ${fixture.name}`);
      console.log(`  Input Pathways: ${scoresInput.careerFitment.map(c => `${c.name} (${c.score}%)`).join(' | ') || '[EMPTY - FALLBACK]'}`);
      console.log(`  Rank 1 (Primary):    "${r1.pathwayTitle}" [Score: ${r1.fitScore}%] [RankLabel: ${r1.pathwayRankLabel}]`);
      console.log(`  Rank 2 (Secondary):  "${r2.pathwayTitle}" [Score: ${r2.fitScore}%] [RankLabel: ${r2.pathwayRankLabel}]`);
      console.log(`  Rank 3 (Strategic):  "${r3.pathwayTitle}" [Score: ${r3.fitScore}%] [RankLabel: ${r3.pathwayRankLabel}]`);
      console.log(`  Identical Content:   ${identicalStatus} (${details})`);
    }
  }

  // Print Summary Table
  console.log('\n\n' + '='.repeat(160));
  console.log('CONSOLIDATED REPRODUCTION TABLE: RANK -> PATHWAY TITLE FOR ALL FIXTURES');
  console.log('='.repeat(160));
  console.log(
    '| ' +
    'Variant'.padEnd(10) + ' | ' +
    'Fixture'.padEnd(30) + ' | ' +
    'Rank 1 (Primary)'.padEnd(40) + ' | ' +
    'Rank 2 (Secondary)'.padEnd(40) + ' | ' +
    'Rank 3 (Strategic Alternative)'.padEnd(40) + ' | ' +
    'Identical Content?'.padEnd(25) + ' |'
  );
  console.log('-'.repeat(160));

  for (const row of summaryRows) {
    console.log(
      '| ' +
      row.variant.padEnd(10) + ' | ' +
      row.fixture.padEnd(30) + ' | ' +
      row.rank1Title.slice(0, 40).padEnd(40) + ' | ' +
      row.rank2Title.slice(0, 40).padEnd(40) + ' | ' +
      row.rank3Title.slice(0, 40).padEnd(40) + ' | ' +
      row.identicalContent.padEnd(25) + ' |'
    );
  }
  console.log('='.repeat(160));
}

runReproduction();

