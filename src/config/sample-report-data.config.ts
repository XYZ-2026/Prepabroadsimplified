/**
 * Sample Report Data Registry
 * ─────────────────────────────────────────────────────
 * Fully static, synthetic demonstration data for the
 * "View Sample Report" experience across all three
 * psychometric assessment landing pages.
 *
 * CRITICAL: Zero AI calls, zero Groq calls, zero Gemini calls.
 * All data is hardcoded constants.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '@/app/(main)/psychometric-test/class10_editorial_engine';
import type { AlignmentResult } from '@/app/(main)/psychometric-test/comparison-engine';
import type { ParentProfile } from '@/app/(main)/psychometric-test/parent-scoring';

// ─── Sample Students ────────────────────────────────────────────────────────

export const SAMPLE_STUDENT_79: EditorialStudent = {
  name: 'Aarav Sharma',
  grade: 'Class 8',
  age: '13',
  school: 'Delhi Public School, R.K. Puram',
  city: 'New Delhi',
  stream: '',
  email: 'sample@abroadsimplified.com',
  date: '15 August 2026',
  reportId: 'SAMPLE-79-2026',
  parentName: 'Mr. Rajesh Sharma',
};

export const SAMPLE_STUDENT_10: EditorialStudent = {
  name: 'Aarav Sharma',
  grade: 'Class 10',
  age: '15',
  school: 'Delhi Public School, R.K. Puram',
  city: 'New Delhi',
  stream: 'Science — Engineering & Technology (PCM)',
  email: 'sample@abroadsimplified.com',
  date: '15 August 2026',
  reportId: 'SAMPLE-10-2026',
  parentName: 'Mr. Rajesh Sharma',
};

export const SAMPLE_STUDENT_12: EditorialStudent = {
  name: 'Aarav Sharma',
  grade: 'Class 12',
  age: '17',
  school: 'Delhi Public School, R.K. Puram',
  city: 'New Delhi',
  stream: 'Science — Engineering & Technology (PCM)',
  email: 'sample@abroadsimplified.com',
  date: '15 August 2026',
  reportId: 'SAMPLE-12-2026',
  parentName: 'Mr. Rajesh Sharma',
};

// ─── Sample Scores ──────────────────────────────────────────────────────────

export const SAMPLE_SCORES: EditorialScores = {
  aptitude: {
    verbal: 78,
    numerical: 82,
    reasoning: 85,
    spatial: 74,
    overall: 80,
  },
  personality: {
    openness: 76,
    conscientiousness: 79,
    extraversion: 65,
    agreeableness: 72,
    emotionalStability: 74,
  },
  topRiasec: ['I', 'E', 'S'],
  riasec: { R: 58, I: 88, A: 52, S: 72, E: 80, C: 60 },
  topVark: 'V',
  vark: { V: 85, A: 62, R: 70, K: 55 },
  topValues: ['creativity', 'impact', 'independence'],
  careerFitment: [
    { name: 'Data Science & AI Specialist', score: 92 },
    { name: 'Software Engineering & Systems Architect', score: 88 },
    { name: 'Product Management & Strategy', score: 85 },
    { name: 'UX Design & Human-Computer Interaction', score: 80 },
    { name: 'Management Consulting & Business Analytics', score: 76 },
  ],
};

// ─── Sample Personalization (Pre-written — zero AI calls) ───────────────────

export const SAMPLE_PERSONALIZATION: PersonalizationData = {
  executiveSummary: `Aarav demonstrates a distinctive cognitive profile characterised by strong analytical reasoning (85th percentile), solid numerical processing (82nd percentile), and above-average verbal comprehension (78th percentile). His personality architecture reveals a balanced blend of intellectual curiosity (Openness: 76%) and methodical execution discipline (Conscientiousness: 79%), positioning him as a strategic thinker who can both envision innovative solutions and execute them systematically. His RIASEC profile (Investigative-Enterprising-Social) suggests a natural affinity for roles that combine analytical problem-solving with leadership and interpersonal collaboration. The Visual learning preference (VARK: V) indicates that Aarav processes information most effectively through diagrams, flowcharts, and spatial representations — a significant advantage in STEM-oriented fields. His top career values — creativity, impact, and independence — align strongly with emerging technology sectors where autonomous problem-solving and innovative thinking are primary competitive multipliers.`,

  strengths: [
    'Abstract reasoning and pattern recognition in novel problem spaces',
    'Disciplined execution and systematic project management',
    'Strong numerical and quantitative processing speed',
    'Visual-spatial intelligence supporting systems architecture thinking',
    'Balanced ambivert energy enabling both independent deep work and team leadership',
    'High stress resilience and emotional stability under evaluative pressure',
  ],

  growthAreas: [
    'Expanding verbal articulation for public speaking and presentation contexts',
    'Building kinesthetic and hands-on experimentation habits alongside theoretical study',
    'Developing structured networking strategies to complement natural introversion',
    'Strengthening auditory processing for lecture-heavy academic environments',
  ],

  careerRoadmap: {
    shortTerm: [
      'Strengthen competitive exam preparation (JEE/SAT) with structured 90-day study blocks',
      'Begin introductory Python/data science coursework through structured online platforms',
      'Participate in 2-3 STEM olympiads or hackathons to build competitive profile',
      'Develop a personal portfolio documenting projects and analytical work',
    ],
    mediumTerm: [
      'Select Class 11 subject combination: Physics, Chemistry, Mathematics, Computer Science',
      'Pursue summer research internships or mentorship programmes in target career fields',
      'Build standardised test readiness (SAT/ACT) for international university applications',
      'Develop leadership credentials through school clubs or community projects',
    ],
    longTerm: [
      'Target undergraduate programmes in Computer Science, Data Science, or Engineering',
      'Build a competitive application portfolio for top-tier Indian and international universities',
      'Explore study abroad options in USA, UK, Canada, and Germany',
      'Develop professional network through industry conferences and alumni connections',
    ],
    collegeAndBeyond: [
      'Pursue specialisation in AI/ML, Product Management, or Systems Architecture',
      'Target graduate programmes or direct industry placement based on undergraduate performance',
      'Build thought leadership through technical writing, open-source contributions, or research papers',
    ],
  },

  parentGuide: {
    observations: [
      'Aarav demonstrates strong self-directed learning habits, requiring minimal external motivation for academic tasks.',
      'His visual learning preference means he benefits most from diagrammatic explanations rather than text-heavy instruction.',
      'The balance between openness and conscientiousness suggests he can handle increased academic autonomy responsibly.',
    ],
    homeStrategies: [
      'Provide access to visual learning tools: whiteboards, mind-mapping software, and structured note-taking systems.',
      'Support exploratory learning by encouraging side projects in coding, robotics, or data analysis.',
      'Create dedicated quiet study spaces that minimise auditory distractions during deep work sessions.',
    ],
    communicationTips: [
      'Frame career discussions around his values (creativity, impact) rather than external metrics (salary, prestige).',
      'Present educational options visually — comparison charts and decision matrices work better than verbal discussions.',
      'Respect his need for independent processing time before making academic decisions.',
    ],
  },

  teacherGuide: {
    classroomAdaptations: [
      'Provide visual summaries and flowcharts alongside text-based lesson materials.',
      'Assign open-ended analytical projects that leverage his pattern recognition strengths.',
      'Allow collaborative leadership roles in group projects to develop his Social RIASEC dimension.',
    ],
    learningSupport: [
      'Introduce advanced problem-solving challenges to maintain cognitive engagement.',
      'Provide structured feedback using data-driven rubrics that align with his analytical processing style.',
      'Encourage participation in competitive academic events to channel his Enterprising orientation.',
    ],
    assessmentTips: [
      'Include diagram-based and spatial reasoning components in assessments to capture his full cognitive capability.',
      'Offer extended response formats alongside multiple-choice to leverage his verbal articulation capacity.',
      'Use portfolio-based assessment for projects where process documentation matters.',
    ],
  },

  crossDomainInsights: [
    'The combination of high Investigative and Enterprising RIASEC codes positions Aarav uniquely for roles at the intersection of technology and business strategy.',
    'His visual learning preference and spatial intelligence create a natural advantage in fields requiring systems architecture, data visualisation, or UX design.',
    'The moderate Extraversion profile suggests he will excel in roles requiring focused analytical work with periodic strategic leadership engagement.',
  ],

  familyAlignmentSummary: 'The Sharma family demonstrates strong overall alignment (78%) on core educational goals. Both Aarav and his parents share enthusiasm for STEM-oriented career paths, with healthy agreement on the value of international educational exposure. Minor discussion points include balancing creative autonomy with structured career planning, and calibrating financial expectations for premium undergraduate programmes.',

  alignmentHighlights: [
    'Strong alignment on STEM career direction and engineering focus',
    'Shared openness to international study opportunities',
    'Healthy dialogue needed on balancing creative independence with structured planning',
    'Financial planning discussion recommended for premium university options',
  ],
};

// ─── Sample Comparison Data ─────────────────────────────────────────────────

export const SAMPLE_COMPARISON: AlignmentResult = {
  overallIndicator: 'Strong Alignment',
  overallScore: 78,
  areas: [
    {
      id: 'career_direction',
      name: 'Career Direction',
      level: 'high_alignment',
      studentSide: 'Top careers in: Data Science & AI, Software Engineering',
      parentSide: 'Prefers: engineering tech',
      explanation: 'Parent and student expectations for general career fields are well-aligned.',
      discussionTopic: 'Discuss how the student\'s natural strengths match up with the family\'s expectations for their future career field.',
    },
    {
      id: 'career_expectations',
      name: 'Career Expectations',
      level: 'moderate_alignment',
      studentSide: 'Prioritises: creativity, impact, independence',
      parentSide: 'Values stability (Strong Preference) and prestige (Moderate Preference)',
      explanation: 'Moderate alignment in underlying career drivers.',
      discussionTopic: 'Discuss what success looks like—is it job security, high income, or doing meaningful, creative work?',
    },
    {
      id: 'financial_feasibility',
      name: 'Financial Feasibility',
      level: 'aligned',
      studentSide: 'Career paths identified may require specialised higher education.',
      parentSide: 'Budget expectation: high. Readiness: planned.',
      explanation: 'The family\'s financial expectations appear well-aligned with general education paths.',
      discussionTopic: 'Review the typical costs of the student\'s preferred educational pathways and compare them with the family\'s budget.',
    },
    {
      id: 'study_abroad',
      name: 'Study Abroad Expectations',
      level: 'high_alignment',
      studentSide: 'Profile suggests openness to global experiences.',
      parentSide: 'International Openness: Strong Preference',
      explanation: 'The family is open to exploring international educational opportunities.',
      discussionTopic: 'Discuss boundaries and preferences regarding studying in different cities or countries.',
    },
    {
      id: 'autonomy',
      name: 'Decision Making Autonomy',
      level: 'high_alignment',
      studentSide: 'Strong preference for independence and self-direction.',
      parentSide: 'Autonomy Preference: Strong Preference',
      explanation: 'The parent\'s willingness to give autonomy matches the student\'s need for independence.',
      discussionTopic: 'Discuss how career decisions will be made—who has the final say, and how much guidance the student wants.',
    },
    {
      id: 'risk',
      name: 'Risk Tolerance',
      level: 'moderate_alignment',
      studentSide: 'Drawn to non-traditional, creative, or adventurous paths.',
      parentSide: 'Risk Tolerance: Moderate',
      explanation: 'Both student and parent share similar comfort levels with taking career risks.',
      discussionTopic: 'Discuss the family\'s comfort level with emerging careers, startups, or non-traditional educational paths.',
    },
    {
      id: 'support',
      name: 'Support & Concerns',
      level: 'aligned',
      studentSide: 'Top values: creativity, impact, independence',
      parentSide: 'Support Style: mentoring. Concern: career satisfaction',
      explanation: 'Understanding the parent\'s support style helps tailor how career exploration should proceed.',
      discussionTopic: 'Discuss the parent\'s primary concerns and how the student can help address them proactively.',
    },
  ],
  timestamp: '2026-08-15T10:00:00.000Z',
};

// ─── Sample Parent Profile ──────────────────────────────────────────────────

export const SAMPLE_PARENT_PROFILE: ParentProfile = {
  numeric: {
    stabilityPriority: 68,
    careerPrestigePriority: 55,
    financialFlexibility: 72,
    internationalOpenness: 78,
    rankingPriority: 65,
    autonomyPreference: 70,
    riskTolerance: 58,
    academicExpectation: 72,
  },
  interpreted: {
    stabilityPriority: 'high',
    careerPrestigePriority: 'high',
    financialFlexibility: 'high',
    internationalOpenness: 'very_high',
    rankingPriority: 'high',
    autonomyPreference: 'high',
    riskTolerance: 'moderate',
    academicExpectation: 'high',
  },
  choices: {
    perceivedStrengthArea: 'stem',
    perceivedCareerDirection: 'engineering_tech',
    perceivedSocialStyle: 'leadership',
    academicExpectationChoice: 'top_25',
    salaryExpectation: 'high_salary',
    educationBudget: 'budget_high',
    scholarshipDependency: 'scholarship_helpful',
    financialReadiness: 'fully_planned',
    preferredRegion: 'north_america',
    postStudyEmployment: 'most_important',
    decisionOwnership: 'collaborative',
    supportStyle: 'mentoring',
    primaryConcern: 'career_satisfaction',
    desiredOutcome: 'meaningful_work',
    performanceExpectation: 'above_average',
  },
};

// ─── Lookup Helper ──────────────────────────────────────────────────────────

export type SampleReportType = 'junior' | 'grade10' | 'grade12';

export function getSampleStudent(type: SampleReportType): EditorialStudent {
  switch (type) {
    case 'junior': return SAMPLE_STUDENT_79;
    case 'grade10': return SAMPLE_STUDENT_10;
    case 'grade12': return SAMPLE_STUDENT_12;
    default: return SAMPLE_STUDENT_10;
  }
}

export function getSampleGradeLabel(type: SampleReportType): string {
  switch (type) {
    case 'junior': return 'Class 7–9';
    case 'grade10': return 'Class 10';
    case 'grade12': return 'Class 11–12';
    default: return 'Class 10';
  }
}
