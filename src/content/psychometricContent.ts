/**
 * Psychometric Assessment Content & Fact Store
 * ─────────────────────────────────────────────────────────────────────────────
 * Spec: src/app/(main)/Design_psychometric_v2.md (copy budgets in section 2).
 * Components never hard-code copy; everything visible on /psychometric-assessment lives here.
 *
 * Rules:
 * 1. Claims policy (carried over from Design_psychometric.md):
 *    - No "objective", "empirical", "verified", norm sizes or certification claims.
 *    - "Guidance, not diagnosis". No clinical language.
 *    - Sample reports use a fictional student.
 * 2. Owner facts are `null` until the owner confirms them in writing.
 *    Anything that depends on a `null` fact renders nothing.
 * 3. Phase names match the report exactly.
 * 4. Copy budgets: headline ≤ 8 words, sub ≤ 20 words, card body ≤ 12 words, list item ≤ 8 words.
 */

export interface PhaseContent {
  id: string;
  number: number;
  name: string;
  modules: string; // e.g. "Modules 1 to 10"
  axisLabel: string; // short radar label
  lookingAt: string; // ≤ 10 words
  chips: [string, string, string];
  inReport: string; // ≤ 12 words
  howMeasured: string[]; // collapsed by default
  photo: string;
  photoAlt: string;
}

export interface SampleReportItem {
  id: 'junior' | 'grade10' | 'senior';
  gradeBadge: string;
  gradeTitle: string;
  pages: string;
  highlights: [string, string, string];
  pdfUrl: string;
  browserUrl: string;
  coverImage: string;
  isAvailable: boolean;
}

export interface ReportPart {
  id: string;
  title: string;
  line: string; // ≤ 8 words
  page: number;
  image: string;
}

export interface JourneyStep {
  step: number;
  title: string;
  line: string; // ≤ 10 words
  photo: string | null;
  photoAlt: string;
}

export interface FaqItem {
  question: string;
  answer: string; // ≤ 40 words
}

/**
 * Business rule: the assessment is paid and unlocked by a counsellor, so the page has ONE primary
 * action: book a counselling call. Every call-to-action reads from `bookCall`; there is no
 * "Start assessment" button on this page. The `from` tag records which placement drove the booking
 * (stored as the enquiry's sourcePage and shown in the admin enquiries screen).
 */
export function bookCallHref(placement: string): string {
  return `/book-a-demo?from=psychometric-assessment:${placement}`;
}

export const PSYCHOMETRIC_CONTENT = {
  // ── The one primary action ───────────────────────────────────────────────
  bookCall: {
    label: 'Book a counselling call',
    note: 'Flexible 45-minute Zoom sessions',
    sampleTeaser: 'Want this for your child?',
  },

  // ── Facts ────────────────────────────────────────────────────────────────
  facts: {
    modulesCount: 30,
    phasesCount: 4,
    grade10FullReportPages: 56,
    grade10ExecutivePages: 15,
    counsellingSessionDuration: '45-minute',
    studentsGuided: '15,000+',

    // Owner facts: null until confirmed. Render nothing when null.
    testDuration: null as string | null,
    numberOfQuestions: null as number | null,
    pricing: null as string | null,
    parentQuestionnaireRole: null as string | null,
    reportDeliveryTime: null as string | null,
    phasesGrades79: null as string | null,
    phasesGrades1112: null as string | null,
    pagesGrades79: null as number | null,
    pagesGrades1112: null as number | null,
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    chip: 'Grades 7 to 12 assessment',
    headlineLines: ['Know how your child', 'thinks, learns and decides.'] as const,
    subcopy: 'A 30-module online assessment that turns answers into a clear stream and career plan.',
    ctas: {
      secondary: { label: 'View a sample report', href: '#sample-reports' },
    },
    photo: {
      src: '/images/psychometric/psy-01-hero-family-cutout.webp',
      alt: 'A parent and student looking at assessment results on a laptop',
    },
    profileCard: {
      label: 'Sample result',
      traits: [
        { name: 'Conscientiousness', score: 88 },
        { name: 'Reasoning', score: 84 },
        { name: 'Openness', score: 79 },
      ],
    },
  },

  // ── Why guesswork fails (section 2, boss reference) ───────────────────────
  // Problem → solution → proof: what families rely on today, what a roadmap gives instead.
  whyGuesswork: {
    headline: ['A career decision deserves', 'more than', 'guesswork.'] as const,
    subcopy: 'Understand strengths, interests and aptitude before choosing a stream or career.',
    beforeLabel: 'Without a clear plan',
    afterLabel: 'With a clear plan',
    // Order matters: the layout staggers them left to right above the family.
    bubbles: [
      { id: 'compare', label: 'Comparison with others', icon: 'Trophy' },
      { id: 'neighbours', label: 'Neighbours’ advice', icon: 'Users' },
      { id: 'friends', label: 'Friends’ choices', icon: 'MessagesSquare' },
      { id: 'marks', label: 'Marks & scores', icon: 'FileText' },
    ] as Array<{ id: string; label: string; icon: string }>,
    before: {
      src: '/images/psychometric/sec2-before-family.webp',
      alt: 'A father, son and mother looking worried and unsure about the student’s next step',
    },
    after: {
      src: '/images/psychometric/sec2-after-counsellor.webp',
      alt: 'A counsellor explaining a career roadmap to a father, mother and son who now look relaxed',
    },
    roadmap: {
      title: 'Personalised career roadmap',
      steps: ['Strengths', 'Stream', 'Degree', 'Career'] as const,
    },
    benefits: [
      { icon: 'Brain', title: 'Know your child’s strengths' },
      { icon: 'Target', title: 'Discover real interests' },
      { icon: 'Layers', title: 'Choose the right stream and options' },
      { icon: 'Route', title: 'Get a clear, actionable career plan' },
    ] as Array<{ icon: string; title: string }>,
  },

  // ── Four phases ──────────────────────────────────────────────────────────
  phases: {
    sectionHeadline: 'Four phases. One complete profile.',
    grade10Notice: 'Shown for Grade 10',
    lookingAtLabel: 'What it looks at',
    inReportLabel: 'In the report',
    disclosureLabel: 'How it’s measured',
    items: [
      {
        id: 'phase-1',
        number: 1,
        name: 'Personality architecture',
        modules: 'Modules 1 to 10',
        axisLabel: 'Personality',
        lookingAt: 'How your child handles pressure, effort and new challenges.',
        chips: ['Big Five', 'Persistence', 'Focus'],
        inReport: 'Natural study habits and how they hold up under pressure.',
        howMeasured: [
          'Big Five traits and stability under deadlines',
          'Self-drive, persistence and focus recovery',
          'Response to unfamiliar academic challenges',
        ],
        photo: '/images/psychometric/psy-02.webp',
        photoAlt: 'Student working through a personality questionnaire',
      },
      {
        id: 'phase-2',
        number: 2,
        name: 'Cognitive processing',
        modules: 'Modules 11 to 20',
        axisLabel: 'Reasoning',
        lookingAt: 'How your child reasons with numbers, shapes and words.',
        chips: ['Numerical', 'Spatial', 'Verbal'],
        inReport: 'Problem-solving strengths across maths, visual and verbal tasks.',
        howMeasured: [
          'Number patterns and calculation stamina',
          'Spatial and 3D visualisation',
          'Reading and reasoning about arguments',
        ],
        photo: '/images/psychometric/psy-03.webp',
        photoAlt: 'Student solving a geometric tangram puzzle',
      },
      {
        id: 'phase-3',
        number: 3,
        name: 'Learning & execution',
        modules: 'Modules 21 to 28',
        axisLabel: 'Learning',
        lookingAt: 'How your child learns best and stays focused.',
        chips: ['VARK', 'Focus', 'Study planning'],
        inReport: 'The study format and pace that help them remember most.',
        howMeasured: [
          'Visual, auditory, reading and hands-on preferences',
          'Distraction limits and deep-work recovery',
          'Scheduling and note-taking habits',
        ],
        photo: '/images/psychometric/psy-04.webp',
        photoAlt: 'Student studying with diagrams and notes',
      },
      {
        id: 'phase-4',
        number: 4,
        name: 'Stream & career alignment',
        modules: 'Modules 29 to 30',
        axisLabel: 'Careers',
        lookingAt: 'Which streams and careers fit their interests and strengths.',
        chips: ['Holland RIASEC', 'Streams', 'Subjects'],
        inReport: 'Stream fit across PCM, PCB, Commerce and Humanities.',
        howMeasured: [
          'Holland RIASEC interest codes',
          'Fit with PCM, PCB, Commerce and Humanities',
          'Subject combinations and degree directions',
        ],
        photo: '/images/psychometric/psy-05.webp',
        photoAlt: 'Student exploring career and stream options',
      },
    ] as PhaseContent[],
  },

  // ── Try a question ───────────────────────────────────────────────────────
  sampleQuestions: {
    sectionHeadline: 'Try a sample question',
    sectionSubcopy: 'Three short examples. Each answer shapes the profile.',
    notice: 'Sample question',
    addedLabel: 'Added to profile',
    personality: {
      title: 'Personality',
      prompt: 'Before a big exam, I make a study plan weeks ahead.',
      scaleEnds: ['Strongly disagree', 'Strongly agree'] as const,
      scaleLabels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
      trait: 'Planning and structure',
    },
    reasoning: {
      title: 'Reasoning',
      prompt: 'Which tile completes the pattern?',
      trait: 'Pattern reasoning',
      correctLabel: 'Pattern spotted',
      otherLabel: 'Still exploring',
    },
    studyHabits: {
      title: 'Study habits',
      prompt: 'A Physics topic makes no sense in class. What do you do first?',
      options: [
        { id: 'visual', label: 'Find a diagram or video', trait: 'Visual learner', pct: 88 },
        { id: 'readwrite', label: 'Re-read and write notes', trait: 'Read and write learner', pct: 84 },
        { id: 'kinesthetic', label: 'Try practice problems', trait: 'Hands-on learner', pct: 86 },
      ],
    },
  },

  // ── What you receive ─────────────────────────────────────────────────────
  whatFamilyReceives: {
    sectionHeadline: 'A report your family can use',
    coverImage: '/samples/pages/grade-10-p01.webp',
    coverAlt: 'Cover of the Grade 10 sample report',
    pageLabel: 'Page',
    sampleLabel: 'Sample report, fictional student',
    items: [
      { id: 'stream-fitment', title: 'Stream fitment', line: 'PCM, PCB, Commerce or Humanities, ranked.', page: 50, image: '/samples/pages/grade-10-p50.webp' },
      { id: 'aptitude', title: 'Reasoning and aptitude', line: 'Numerical, verbal and spatial strengths.', page: 10, image: '/samples/pages/grade-10-p10.webp' },
      { id: 'learning-style', title: 'Learning style', line: 'How they remember best.', page: 11, image: '/samples/pages/grade-10-p11.webp' },
      { id: 'career-clusters', title: 'Career clusters', line: 'Careers that match their interests.', page: 41, image: '/samples/pages/grade-10-p41.webp' },
      { id: 'parent-guide', title: 'Parent guide', line: 'Where student and parent views differ.', page: 44, image: '/samples/pages/grade-10-p44.webp' },
      { id: 'action-plan', title: '90-day plan', line: 'Clear next steps for the coming term.', page: 45, image: '/samples/pages/grade-10-p45.webp' },
    ] as ReportPart[],
  },

  // ── Journey ──────────────────────────────────────────────────────────────
  journey: {
    sectionHeadline: 'From first question to a clear plan',
    steps: [
      { step: 1, title: 'Intake', line: 'Pick grade, board and subjects.', photo: null, photoAlt: '' },
      { step: 2, title: 'Assessment', line: '30 untimed modules, done online.', photo: '/images/psychometric/psy-06.webp', photoAlt: 'Student taking the assessment on a laptop' },
      { step: 3, title: 'Analysis', line: 'We analyse the results.', photo: null, photoAlt: '' },
      { step: 4, title: 'Report', line: 'A 56-page report plus a 15-page summary.', photo: '/images/psychometric/psy-07.webp', photoAlt: 'Family report with charts and stream rankings' },
      { step: 5, title: 'Counsellor session', line: 'Optional 45-minute Zoom call to plan next steps.', photo: '/images/psychometric/psy-08.webp', photoAlt: 'Parent and student talking with a counsellor' },
    ] as JourneyStep[],
  },

  // ── Sample reports ───────────────────────────────────────────────────────
  sampleReports: {
    sectionHeadline: 'See a sample report first',
    footerNote: 'Sample reports use a fictional student.',
    viewLabel: 'View in browser',
    downloadLabel: 'Download PDF',
    comingSoonLabel: 'Coming soon',
    items: [
      {
        id: 'junior',
        gradeBadge: 'Grades 7–9',
        gradeTitle: 'Foundation report',
        pages: 'Executive edition',
        highlights: ['Learning style profile', 'Pattern and number reasoning', 'Early subject interests'],
        pdfUrl: '/sample-reports/sample-report-grades-7-9.pdf',
        browserUrl: '/sample-report?type=junior',
        coverImage: '/samples/pages/grade-7-9-p01.webp',
        isAvailable: true,
      },
      {
        id: 'grade10',
        gradeBadge: 'Grade 10',
        gradeTitle: 'Stream selection report',
        pages: '56 pages',
        highlights: ['Stream fit, ranked', 'Subject combinations', 'Three-year roadmap'],
        pdfUrl: '/sample-reports/sample-report-grade-10.pdf',
        browserUrl: '/sample-report?type=grade10',
        coverImage: '/samples/pages/grade-10-p01.webp',
        isAvailable: true,
      },
      {
        id: 'senior',
        gradeBadge: 'Grades 11–12',
        gradeTitle: 'Degree and career report',
        pages: 'Executive edition',
        highlights: ['Degree clusters', 'Holland RIASEC career fit', 'Admissions roadmap'],
        pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
        browserUrl: '/sample-report?type=grade12',
        coverImage: '/samples/pages/grade-11-12-p01.webp',
        isAvailable: true,
      },
    ] as SampleReportItem[],
  },

  // ── Family trust ─────────────────────────────────────────────────────────
  familyTrust: {
    sectionHeadline: 'Built for families',
    photo: {
      src: '/images/psychometric/psy-09-family-dialogue.webp',
      alt: 'A family reading a report together',
    },
    principles: [
      { title: 'Proven frameworks', line: 'Big Five, VARK and Holland RIASEC.' },
      { title: 'Family dialogue', line: 'Built for parents and students to read together.' },
      { title: 'Guidance, not diagnosis', line: 'Supports choices. Never a label.' },
      { title: 'Private by default', line: 'Answers stay confidential. Never sold.' },
    ],
  },

  // ── FAQ (also feeds the FAQPage JSON-LD) ─────────────────────────────────
  faq: {
    sectionHeadline: 'Questions parents ask',
    items: [
      {
        question: 'How is this different from an exam or an IQ test?',
        answer:
          'Exams test what a student has learned, and IQ tests score speeded logic. This assessment looks at personality, reasoning style, learning preferences and interests. There is no pass or fail, and it guides choices rather than labelling anyone.',
      },
      {
        question: 'How should my child prepare?',
        answer:
          'No preparation is needed. The questions capture natural habits and reasoning, so studying for it does not help. A quiet room and a rested mind are enough.',
      },
      {
        question: 'How does it help a Class 10 student choose a stream?',
        answer:
          'It compares reasoning strengths, learning style and interests against what PCM, PCB, Commerce and Humanities ask of a student, then ranks how well each stream fits.',
      },
      {
        question: 'Can parents go through the results with their child?',
        answer:
          'Yes. The report includes a parent guide and conversation prompts, and families can book an optional 45-minute session with a counsellor to plan next steps together.',
      },
      {
        question: 'Is my child’s data kept private?',
        answer:
          'Yes. Answers and reports stay confidential to the student and family. CLARVO never sells student data or shares reports without the family’s consent.',
      },
    ] as FaqItem[],
  },

  // ── Final CTA ────────────────────────────────────────────────────────────
  cta: {
    headline: 'Start with understanding.',
    subcopy: 'Join 15,000+ students who found their direction.',
    photo: {
      src: '/images/psychometric/psy-10-cta-family-cutout.webp',
      alt: 'A smiling family of four',
    },
  },

  // ── Sticky mobile bar ────────────────────────────────────────────────────
  stickyBar: {
    secondary: { label: 'Sample', href: '#sample-reports' },
  },
};
