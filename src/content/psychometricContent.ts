/**
 * Psychometric Assessment Content & Fact Store
 * ─────────────────────────────────────────────────────────────────────────────
 * Specifications: DESIGN_PSYCHOMETRIC.md (Sections 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12)
 *
 * Rules:
 * 1. Claims Policy:
 *    - No "Zero subjective bias".
 *    - No unverified "objective", "empirical", or "verified" claims.
 *    - No unsupported norming claims (e.g. "national norms", "50,000+").
 *    - Educational guidance terminology only ("guidance, not diagnosis"). No clinical language.
 *    - Sample reports use fictional student note: "Sample reports use a fictional student."
 * 2. Owner Facts:
 *    - Facts not yet confirmed by the project owner are strictly `null`.
 *    - Elements that depend on a `null` value must render nothing.
 * 3. Phase Names:
 *    - Must strictly match the report:
 *      1. "Personality architecture"
 *      2. "Cognitive processing"
 *      3. "Learning & execution"
 *      4. "Stream & career alignment"
 *    - Never use "Academic Execution" or "Leadership & Alignment".
 * 4. Typography:
 *    - Sentence case throughout. No all-caps eyebrows.
 */

export interface PhaseContent {
  id: string;
  stepNumber: string; // e.g. "Phase 1"
  name: string;
  modules: string; // e.g. "Modules 1 to 10"
  subtitle: string;
  whatItMeasures: string[];
  whatTheReportShows: string;
  photo: string;
  sampleMetric: {
    label: string;
    value: string;
    note: string;
  };
}

export interface SampleReportItem {
  id: 'junior' | 'grade10' | 'senior';
  gradeBadge: string;
  gradeTitle: string;
  subtitle: string;
  pages: string;
  description: string;
  highlights: string[];
  pdfUrl: string;
  browserUrl: string;
  coverImage: string;
  thumbnails: string[];
  isAvailable: boolean;
}

export interface QuestionSampleTab {
  id: 'personality' | 'reasoning' | 'study_habits';
  title: string;
  subtitle: string;
  type: string;
  prompt: string;
  options: Array<{
    label: string;
    value: number | string;
    description?: string;
  }>;
  feedbackPreview: string;
}

export interface JourneyStep {
  step: number;
  title: string;
  description: string;
  photo: string | null;
  photoAlt?: string;
  highlight?: string;
}

export const PSYCHOMETRIC_CONTENT = {
  // ── 1. KNOWN VS OWNER FACTS (Section 1) ───────────────────────────────────
  facts: {
    // Known verified facts
    modulesCount: 30,
    phasesCount: 4,
    grade10FullReportPages: 56,
    grade10ExecutivePages: 15,
    frameworksUsed: [
      'Big Five dimensions',
      'MBTI-style cognitive preferences',
      'VARK sensory modalities',
      'Holland RIASEC vocational codes',
      'Differential cognitive aptitude battery',
    ] as const,
    counsellingSessionDuration: 'Flexible 45-minute Zoom sessions',
    studentsGuided: '15,000+',

    // Owner facts (Null until project owner confirms in writing)
    testDuration: null as string | null, // e.g. "{{duration}}" -> null: render nothing
    numberOfQuestions: null as number | null, // e.g. "{{questions}}" -> null: render nothing
    pricing: null as string | null, // e.g. "{{pricing}}" -> null: render nothing
    parentQuestionnaireRole: null as string | null, // e.g. "{{parent_role}}" -> null: render nothing
    reportDeliveryTime: null as string | null, // e.g. "{{delivery}}" -> null: render nothing
    phasesGrades79: null as string | null, // e.g. "{{phases_7_9}}" -> null
    phasesGrades1112: null as string | null, // e.g. "{{phases_11_12}}" -> null
    pagesGrades79: null as number | null, // e.g. "{{pages_7_9}}" -> null (until built)
    pagesGrades1112: null as number | null, // e.g. "{{pages_11_12}}" -> null (until built)
  },

  // ── 2. HERO SECTION (Section 4) ───────────────────────────────────────────
  hero: {
    chip: 'Psychometric assessment, Grades 7 to 12',
    headline: 'Know how your child thinks, learns and decides.',
    subcopy:
      'A 30-module online assessment that measures personality, reasoning, study habits and interests, then turns the results into a clear stream and career roadmap your family can talk through together.',
    ctas: {
      primary: {
        label: 'Start assessment',
        href: '/psychometric-test',
      },
      secondary: {
        label: 'View a sample report',
        href: '#sample-reports',
      },
      tertiary: {
        label: 'Book a consultation',
        href: '/book-a-demo',
      },
    },
    threeStepLine: [
      { step: 1, label: 'Your child answers' },
      { step: 2, label: 'We build a profile' },
      { step: 3, label: 'Your family gets a plan' },
    ],
    photo: {
      src: '/images/psychometric/psy-01-hero-family-cutout.png',
      alt: 'Parent and student discussing academic assessment on a laptop',
      mode: 'cutout' as const,
    },
    overlayCards: {
      profileCard: {
        label: 'Sample result',
        traits: [
          { name: 'Conscientiousness', score: 88 },
          { name: 'Reasoning', score: 84 },
          { name: 'Openness', score: 79 },
        ],
      },
      sampleQuestionCard: {
        label: 'Sample question',
        question: 'When solving a complex math problem, I prefer to sketch a diagram first.',
        scale: [1, 2, 3, 4, 5],
        selectedAnswer: 4,
      },
    },
  },

  // ── 3. WHAT IT IS / IS NOT (Section 5) ────────────────────────────────────
  whatItIs: {
    headline: 'What a psychometric assessment is — and what it is not.',
    subcopy: 'Used to guide, not to label.',
    isList: [
      'A structured set of questions about how a student thinks, behaves and learns',
      'Compared with students of the same age group',
      'Used to guide stream choices, subject combinations and study habits',
    ],
    isNotList: [
      'A school exam with pass or fail marks',
      'An IQ test that defines an intelligence ceiling',
      'A medical or clinical diagnosis',
    ],
  },

  // ── 4. THE FOUR PHASES (Section 6) ────────────────────────────────────────
  phases: {
    sectionHeadline: 'Four phases. Thirty dedicated modules.',
    sectionSubcopy:
      'Rather than relying on one-dimensional surveys, the assessment sequences evaluation across four distinct pillars to understand both how a student thinks and how they learn.',
    grade10Notice: 'Shown for Grade 10',
    items: [
      {
        id: 'phase-1',
        stepNumber: 'Phase 1',
        name: 'Personality architecture',
        modules: 'Modules 1 to 10',
        subtitle: 'Behavioral drivers and cognitive persistence',
        whatItMeasures: [
          'Big Five dimensions and emotional stability under academic deadlines',
          'Self-directed drive, persistence and focus recovery',
          'How the student naturally handles unfamiliar academic challenges',
        ],
        whatTheReportShows:
          'A trait baseline detailing natural study habits and persistence patterns under pressure.',
        photo: '/images/psychometric/psy-02.png',
        sampleMetric: {
          label: 'Conscientiousness and persistence indicator',
          value: 'Structured execution',
          note: 'Shows high self-directed persistence and methodical study follow-through.',
        },
      },
      {
        id: 'phase-2',
        stepNumber: 'Phase 2',
        name: 'Cognitive processing',
        modules: 'Modules 11 to 20',
        subtitle: 'Abstract pattern recognition and fluid logic',
        whatItMeasures: [
          'Numerical pattern deduction and computational stamina',
          'Spatial visualization and 3D geometric intuition',
          'Verbal synthesis and textual argument comprehension',
        ],
        whatTheReportShows:
          'Problem-solving agility and logic preferences across quantitative and verbal domains.',
        photo: '/images/psychometric/psy-03.png',
        sampleMetric: {
          label: 'Spatial and abstract pattern agility',
          value: 'Visual logic preference',
          note: 'Rapid inductive reasoning and strong visual pattern isolation.',
        },
      },
      {
        id: 'phase-3',
        stepNumber: 'Phase 3',
        name: 'Learning & execution',
        modules: 'Modules 21 to 28',
        subtitle: 'VARK sensory modalities and revision stamina',
        whatItMeasures: [
          'VARK sensory modalities (visual, auditory, read/write, kinesthetic)',
          'Distraction thresholds and deep-work recovery',
          'Study schedule time-boxing and note-structuring habits',
        ],
        whatTheReportShows:
          'The exact sensory format and pacing in which the student absorbs and retains material most reliably.',
        photo: '/images/psychometric/psy-04.png',
        sampleMetric: {
          label: 'Primary learning modality (VARK)',
          value: 'Visual-schematic preference',
          note: 'Strongest retention achieved through system diagrams, schematics, and structured tables.',
        },
      },
      {
        id: 'phase-4',
        stepNumber: 'Phase 4',
        name: 'Stream & career alignment',
        modules: 'Modules 29 to 30',
        subtitle: 'Holland RIASEC vocational mapping and stream options',
        whatItMeasures: [
          'Holland RIASEC interest codes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)',
          'High school stream fitment (PCM, PCB, Commerce, Humanities)',
          'Subject combination options and future undergraduate degree directions',
        ],
        whatTheReportShows:
          'Compatibility alignment across Class 11 academic streams and target university clusters.',
        photo: '/images/psychometric/psy-05.png',
        sampleMetric: {
          label: 'Secondary stream alignment',
          value: 'Science + Computing focus',
          note: 'Demonstrates strong synergy between computational reasoning and analytical sciences.',
        },
      },
    ] as PhaseContent[],
  },

  // ── 5. WHAT A QUESTION LOOKS LIKE (Section 7) ─────────────────────────────
  sampleQuestions: {
    sectionChip: 'Interactive samples',
    sectionHeadline: 'What a question looks like',
    sectionSubcopy:
      'Try three sample items. There are no trick questions or pass-fail marks. Answer honestly to see how traits map into your profile.',
    notice: 'Sample question — for demonstration only',
    tabs: [
      {
        id: 'personality',
        title: 'Personality',
        subtitle: 'Behavioral self-reflection',
        type: '5-point Likert scale',
        prompt:
          'When preparing for a major exam, I prefer to build a detailed multi-week study schedule rather than revising spontaneously.',
        options: [
          { label: 'Strongly disagree', value: 1 },
          { label: 'Disagree', value: 2 },
          { label: 'Neutral', value: 3 },
          { label: 'Agree', value: 4 },
          { label: 'Strongly agree', value: 5 },
        ],
        feedbackPreview: 'Reflects your approach to structure, deadlines, and conscientiousness.',
      },
      {
        id: 'reasoning',
        title: 'Reasoning',
        subtitle: 'Pattern-completion logic',
        type: 'Pattern puzzle',
        prompt:
          'Look at the sequence below: which shape logically completes the pattern rotation?',
        options: [
          { label: 'Option A (90° clockwise)', value: 'A' },
          { label: 'Option B (180° inversion)', value: 'B' },
          { label: 'Option C (Horizontal mirror)', value: 'C' },
          { label: 'Option D (Diagonal rotation)', value: 'D' },
        ],
        feedbackPreview: 'Maps visual-spatial inductive reasoning agility.',
      },
      {
        id: 'study_habits',
        title: 'Study habits',
        subtitle: 'Realistic student scenario',
        type: 'Decision scenario',
        prompt:
          'You encounter a challenging topic in Physics that you do not understand during class. What is your initial reaction?',
        options: [
          {
            label: 'Option 1',
            value: 'diagrams',
            description: 'Search for an animated video or visual diagram explaining the underlying system.',
          },
          {
            label: 'Option 2',
            value: 'notes',
            description: 'Re-read the textbook chapters and write structured summary notes.',
          },
          {
            label: 'Option 3',
            value: 'practice',
            description: 'Attempt numerical practice problems immediately to learn by working through mistakes.',
          },
        ],
        feedbackPreview: 'Reveals your primary VARK sensory learning preference.',
      },
    ] as QuestionSampleTab[],
  },

  // ── 6. WHAT THE FAMILY RECEIVES (Section 8) ───────────────────────────────
  whatFamilyReceives: {
    sectionChip: 'Report explorer',
    sectionHeadline: 'What the family receives',
    sectionSubcopy:
      'A structured, publication-quality report designed for constructive family conversation.',
    placeholderNotice: 'Sample page preview',
    items: [
      {
        id: 'stream-fitment',
        title: 'Stream fitment',
        description:
          'Class 11 stream compatibility rankings across PCM, PCB, Commerce, and Humanities, with subject combination advice.',
        imagePreview: '/sample-reports/cover-grade-10.png',
      },
      {
        id: 'cognitive-aptitude',
        title: 'Cognitive ceiling & aptitude',
        description:
          'Breakdown across numerical logic, verbal reasoning, spatial agility, and abstract deduction.',
        imagePreview: '/sample-reports/cover-grade-10.png',
      },
      {
        id: 'learning-style',
        title: 'Learning style (VARK)',
        description:
          'Actionable insight into whether the student retains information best via visual diagrams, text, or hands-on practice.',
        imagePreview: '/sample-reports/cover-grade-10.png',
      },
      {
        id: 'career-clusters',
        title: 'Career clusters',
        description:
          'Synthesizes Holland RIASEC codes with undergraduate degree options and high-growth professional fields.',
        imagePreview: '/sample-reports/cover-grades-11-12.png',
      },
      {
        id: 'parent-guide',
        title: 'Parent guide',
        description:
          'Practical communication guidance to help parents support study habits and de-escalate academic anxiety at home.',
        imagePreview: '/sample-reports/cover-grades-7-9.png',
      },
      {
        id: 'action-plan',
        title: '90-day plan',
        description:
          'Immediate, actionable milestones covering study schedules, extracurricular focus, and milestone tracking.',
        imagePreview: '/sample-reports/cover-grade-10.png',
      },
    ],
  },

  // ── 7. THE JOURNEY (Section 9) ────────────────────────────────────────────
  journey: {
    sectionChip: 'The process',
    sectionHeadline: 'The assessment journey',
    sectionSubcopy:
      'Five steps from initial intake to a clear long-term direction for your student.',
    steps: [
      {
        step: 1,
        title: 'Profile and grade intake',
        description:
          'The student selects their current academic grade (Grades 7 to 12), curriculum board, and subject interests.',
        photo: null,
        photoAlt: '',
        highlight: 'Tailors the baseline so questions reflect the student’s academic level.',
      },
      {
        step: 2,
        title: '30-module assessment',
        description:
          'The student completes structured modules in an untimed format designed to capture natural study habits and reasoning patterns.',
        photo: '/images/psychometric/psy-06.webp',
        photoAlt: 'Student taking the 30-module online psychometric assessment on laptop',
        highlight: 'Untimed, low-stress format capturing intuitive reasoning patterns.',
      },
      {
        step: 3,
        title: 'Analysis',
        description:
          'We analyse the results across cognitive and vocational frameworks to determine learning profiles and stream compatibility.',
        photo: null,
        photoAlt: '',
        highlight: 'Integrates Big Five, VARK, and Holland RIASEC dimensions into a baseline.',
      },
      {
        step: 4,
        title: 'Your report',
        description:
          'A comprehensive family dossier is prepared with visual trait maps, stream recommendations, and study guidance.',
        photo: '/images/psychometric/psy-07.webp',
        photoAlt: 'Comprehensive family report dossier with visual charts and stream rankings',
        highlight: '56-page full dossier plus a 15-page executive summary for the family.',
      },
      {
        step: 5,
        title: 'Counsellor session',
        description:
          'Families can optionally join a flexible 45-minute consultation to review the findings and plan high-school steps together.',
        photo: '/images/psychometric/psy-08.webp',
        photoAlt: 'Parent and student discussing academic recommendations with a counsellor',
        highlight: 'Flexible 45-minute Zoom session to translate findings into next steps.',
      },
    ] as JourneyStep[],
  },

  // ── 8. SAMPLE REPORTS (Section 10) ────────────────────────────────────────
  sampleReports: {
    sectionChip: 'Sample reports',
    sectionHeadline: 'Sample reports',
    sectionSubcopy:
      'Inspect the complete report before you begin. Choose a grade band below to review the executive dossier.',
    footerNote: 'Sample reports use a fictional student.',
    items: [
      {
        id: 'junior',
        gradeBadge: 'Grades 7–9',
        gradeTitle: 'Junior Diagnostic Report',
        subtitle: 'Foundation & learning stamina',
        pages: 'Executive edition',
        description:
          'Explores sensory learning preferences, abstract logic agility, and foundational study stamina before high-school specialization.',
        highlights: [
          'VARK sensory learning profile',
          'Abstract logic and numerical pattern agility',
          'Self-directed study stamina indicator',
          'Curiosity vector mapping across emerging subjects',
        ],
        pdfUrl: '/sample-reports/sample-report-grades-7-9.pdf',
        browserUrl: '/sample-report?type=junior',
        coverImage: '/sample-reports/cover-grades-7-9.png',
        thumbnails: [],
        isAvailable: true,
      },
      {
        id: 'grade10',
        gradeBadge: 'Grade 10',
        gradeTitle: 'Secondary Stream Selection Report',
        subtitle: 'PCM vs PCB vs Commerce vs Arts',
        pages: '56 pages',
        description:
          'Our flagship 30-module evaluation validating Class 11 stream fitment, quantitative ceilings, and subject combination choices.',
        highlights: [
          'Stream fitment ranking (PCM, PCB, Commerce, Humanities)',
          '30-module item-level percentile breakdown',
          'Educational advisory notes and risk mitigation',
          'Target university pathways and subject roadmaps',
        ],
        pdfUrl: '/sample-reports/sample-report-grade-10.pdf',
        browserUrl: '/sample-report?type=grade10',
        coverImage: '/sample-reports/cover-grade-10.png',
        thumbnails: [],
        isAvailable: true,
      },
      {
        id: 'senior',
        gradeBadge: 'Grades 11–12',
        gradeTitle: 'Senior University & Career Fitment Report',
        subtitle: 'Degree alignment & career clusters',
        pages: 'Executive edition',
        description:
          'Synthesizes specialized aptitude, Holland RIASEC vocational codes, and premier university admissions roadmaps.',
        highlights: [
          'Undergraduate degree cluster alignment',
          'Holland RIASEC occupational compatibility',
          'Domestic vs study abroad admissions readiness',
          'High-school milestone roadmap and activity timing',
        ],
        pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
        browserUrl: '/sample-report?type=grade12',
        coverImage: '/sample-reports/cover-grades-11-12.png',
        thumbnails: [],
        isAvailable: true,
      },
    ] as SampleReportItem[],
  },

  // ── 9. FAMILY TRUST & PRINCIPLES (Section 11) ─────────────────────────────
  familyTrust: {
    sectionChip: 'Family trust',
    sectionHeadline: 'Principles families can rely on',
    sectionSubcopy:
      'We treat every assessment with care, confidentiality, and respect for the student’s unique growth path.',
    photo: {
      src: '/images/psychometric/psy-09-family-dialogue.png',
      alt: 'Family reviewing academic report together',
      mode: 'cover' as const,
    },
    principles: [
      {
        title: 'Standardized frameworks',
        description:
          'Evaluations are built on established psychometric models including Big Five Personality, VARK, and Holland RIASEC.',
      },
      {
        title: 'Family dialogue',
        description:
          'Designed as a shared conversation tool to align student aspirations with parental support.',
      },
      {
        title: 'Guidance, not diagnosis',
        description:
          'An educational compass to support academic choices, never a clinical label or intelligence ceiling.',
      },
      {
        title: 'Data privacy',
        description:
          'Student answers and report findings remain confidential. Data is never sold or shared with outside parties.',
      },
    ],
  },

  // ── 10. FAQ (Section 12) ──────────────────────────────────────────────────
  faq: {
    sectionChip: 'Common questions',
    sectionHeadline: 'Frequently asked questions',
    sectionSubcopy:
      'Clear answers to questions students and parents ask before starting the assessment.',
    items: [
      {
        question:
          'What is the difference between a psychometric assessment and an academic or IQ test?',
        answer:
          'An academic test measures recall in school subjects, and an IQ test attempts to measure speeded logic. A psychometric assessment is different: it looks at behavioral traits, reasoning preferences, learning modalities (VARK), and vocational affinities (RIASEC) without pass or fail marks. It is designed to guide choices, not to assign labels.',
      },
      {
        question: 'How should my child prepare for the assessment?',
        answer:
          'No preparation, revision, or coaching is required. The questions measure spontaneous, authentic reasoning and study habits. Taking the test in a quiet, rested setting is all that is needed.',
      },
      {
        question:
          'How does the assessment help Class 10 students choose an academic stream?',
        answer:
          'The assessment maps quantitative and verbal reasoning against requirements for Science (PCM/PCB), Commerce, and Humanities to help families understand where a student naturally thrives.',
      },
      {
        question: 'Can parents review the findings together with the student?',
        answer:
          'Yes. Every report includes clear parent discussion frameworks and study guidance so families can plan next steps together constructively.',
      },
      {
        question: 'Is student data kept confidential?',
        answer:
          'All responses and reports are strictly confidential. CLARVO never sells student data or shares reports with third parties without family consent.',
      },
    ],
  },

  // ── 11. FINAL CTA (Section 12) ────────────────────────────────────────────
  cta: {
    headline: 'Know how your child thinks, learns and decides.',
    subcopy:
      'Join thousands of families who replaced guesswork with clarity. Start the assessment today or book a consultation with our team.',
    photo: {
      src: '/images/psychometric/psy-10-cta-family-cutout.png',
      alt: 'Happy student and parents smiling together',
      mode: 'cutout' as const,
    },
    primaryButton: {
      label: 'Start assessment',
      href: '/psychometric-test',
    },
    secondaryButton: {
      label: 'Book a consultation',
      href: '/book-a-demo',
    },
  },
} as const;
