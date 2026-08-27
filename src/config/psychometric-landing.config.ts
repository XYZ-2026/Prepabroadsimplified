export type VariantId = '7-9' | '10' | '12';

export interface MicroStatItem {
  value: string;
  label: string;
  subtitle: string;
}

export interface DimensionCardItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
}

export interface DeliverableItem {
  title: string;
  pages: string;
  description: string;
  badge: string;
}

export interface PathwayItem {
  title: string;
  type: 'PRIMARY' | 'SECONDARY' | 'ALTERNATIVE';
  description: string;
  degreePaths: string[];
  growthIndex: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface VariantConfig {
  variantId: VariantId;
  typeQueryParam: string;
  title: string;
  badge: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroHeadlineLine3: string;
  heroSubtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  microStats: MicroStatItem[];
  problemHeadline: string;
  problemSub: string;
  traditionalFlow: string[];
  simplifiedFlow: string[];
  assessmentDimensions: DimensionCardItem[];
  deliverables: DeliverableItem[];
  reportPagesPreview: { title: string; subtitle: string; pageNum: string }[];
  pathways: PathwayItem[];
  parentTitle: string;
  parentSub: string;
  counsellorTitle: string;
  counsellorSub: string;
  finalCtaHeadline: string;
  faqs: FAQItem[];
}

export const PSYCHOMETRIC_LANDING_CONFIG: Record<VariantId, VariantConfig> = {
  '7-9': {
    variantId: '7-9',
    typeQueryParam: 'junior',
    title: 'Class 7–9 Psychometric Assessment',
    badge: 'GRADE 7–9 EARLY EXPLORATION & FOUNDATION',
    heroHeadlineLine1: 'Before Choosing What Comes Next,',
    heroHeadlineLine2: 'Understand How Your Child',
    heroHeadlineLine3: 'Thinks, Learns & Grows.',
    heroSubtitle: 'A multidimensional assessment designed to uncover cognitive strengths, interests, learning preferences, and early career directions — with a parent perspective included.',
    primaryCtaText: 'START THE ASSESSMENT →',
    secondaryCtaText: 'SEE WHAT\'S INSIDE →',
    microStats: [
      { value: '30 MODULES', label: 'Multi-Dimensional Evaluation', subtitle: 'Cognitive & Psychometric Scope' },
      { value: 'STUDENT + PARENT', label: 'Family Perspective Included', subtitle: 'Side-by-Side Expectation Alignment' },
      { value: 'FULL DIAGNOSTIC', label: 'Comprehensive Report', subtitle: 'Executive + Detailed Analysis' },
      { value: 'COUNSELLOR-READY', label: 'Supported Decision Making', subtitle: 'Actionable Guidance Roadmap' }
    ],
    problemHeadline: 'EARLY ACADEMIC DECISIONS SHOULDN\'T BE A GUESS.',
    problemSub: 'Students in Grades 7–9 are building foundational habits. Choosing subjects or extracurriculars based only on current marks misses natural learning preferences and emerging passions.',
    traditionalFlow: ['Current Marks Only', 'Peer Influence', 'Early Stream Pressure', 'Unmatched Subject Choices', 'Anxiety & Regret'],
    simplifiedFlow: ['Understand Learning Style', 'Identify Cognitive Strengths', 'Explore Broad Interest Areas', 'Include Parent Expectations', 'Confident Foundation'],
    assessmentDimensions: [
      { id: 'cog', title: 'Cognitive Processing Speed', category: 'Core Reasoning', description: 'Evaluates visual pattern logic, spatial reasoning, and numerical problem solving.', iconName: 'Brain' },
      { id: 'learn', title: 'VARK Learning Preferences', category: 'Study Habits', description: 'Identifies whether the student learns best visually, auditorily, through reading, or kinesthetically.', iconName: 'BookOpen' },
      { id: 'riasec', title: 'Holland RIASEC Interest Profile', category: 'Passions', description: 'Maps natural inclinations across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional domains.', iconName: 'Compass' },
      { id: 'parent', title: 'Parent Expectation Alignment', category: 'Family View', description: 'Captures parent perspectives on study habits, budgets, and future aspirations.', iconName: 'Users' },
      { id: 'exec', title: 'Execution Readiness & Focus', category: 'Habits', description: 'Measures time management, distraction tolerance, and study discipline.', iconName: 'Zap' },
      { id: 'pers', title: 'Personality & Curiosity Index', category: 'Self-Awareness', description: 'Measures openness to new ideas, emotional stability, and collaborative mindset.', iconName: 'Sparkles' }
    ],
    deliverables: [
      { title: 'Full Diagnostic Report', pages: '36 Pages', description: 'Complete breakdown of cognitive abilities, VARK learning preferences, and interest areas.', badge: 'Comprehensive' },
      { title: 'Executive Summary Edition', pages: '12 Pages', description: 'High-level insights for quick parent and student review.', badge: 'Executive' },
      { title: 'Student–Parent Alignment Matrix', pages: 'Included', description: 'Side-by-side comparison of student interests vs. parent expectations.', badge: 'Family Alignment' },
      { title: 'Subject & Skill Roadmap', pages: 'Action Plan', description: 'Actionable steps for Middle School & Early High School academic growth.', badge: 'Next Steps' }
    ],
    reportPagesPreview: [
      { title: 'Executive Cognitive Summary', subtitle: 'Core Reasoning & VARK Profile', pageNum: 'Page 03' },
      { title: 'Parent Alignment Comparison', subtitle: 'Student vs. Parent Perception Matrix', pageNum: 'Page 12' },
      { title: 'Early Pathway Recommendations', subtitle: 'Broad Interest Field Exploration', pageNum: 'Page 18' },
      { title: 'Academic Action Plan', subtitle: 'Skill Building & Subject Choices', pageNum: 'Page 28' }
    ],
    pathways: [
      { title: 'STEM & Applied Science Exploration', type: 'PRIMARY', description: 'Focused on developing analytical problem solving, logic, and scientific inquiry.', degreePaths: ['Mathematics', 'Robotics', 'General Science'], growthIndex: 'Foundational Skill' },
      { title: 'Creative & Digital Arts Direction', type: 'SECONDARY', description: 'Exploring spatial design, visual communication, and creative expression.', degreePaths: ['Media Arts', 'Design Fundamentals', 'Literature'], growthIndex: 'High Creativity' },
      { title: 'Social & Cultural Studies', type: 'ALTERNATIVE', description: 'Building communication, empathy, and global social understanding.', degreePaths: ['Languages', 'History', 'Environmental Studies'], growthIndex: 'Human Capital' }
    ],
    parentTitle: 'The Student Sees One Side. The Parent May See Another.',
    parentSub: 'Our Class 7–9 Parent Assessment gives parents a structured way to share perspectives on study habits, screen time, and future goals — enabling collaborative early planning.',
    counsellorTitle: 'Not Just A Test. A Family Guidance Conversation.',
    counsellorSub: 'The report serves as a neutral, evidence-backed foundation for parents and educational counsellors to discuss growth opportunities without stress.',
    finalCtaHeadline: 'EXPLORE BEFORE YOU DECIDE.',
    faqs: [
      { question: 'What is the Class 7–9 Assessment?', answer: 'It is a multidimensional diagnostic assessment designed for middle school students to discover cognitive processing speed, learning style, and early interest areas.' },
      { question: 'Does this test force a career choice at a young age?', answer: 'No. For Grades 7–9, the focus is on broad interest exploration and learning style discovery, not locking the student into a permanent career choice.' },
      { question: 'Is the Parent Assessment mandatory?', answer: 'Parent participation is highly recommended as it creates a side-by-side alignment report comparing student self-perception with parent observations.' },
      { question: 'How long does the assessment take?', answer: 'The assessment takes approximately 35–45 minutes and can be completed in one sitting or saved and resumed.' },
      { question: 'Will we get a downloadable PDF report?', answer: 'Yes! You receive a complete downloadable PDF report along with an Executive Summary Edition.' }
    ]
  },

  '10': {
    variantId: '10',
    typeQueryParam: 'grade10',
    title: 'Class 10 Psychometric Assessment',
    badge: 'CLASS 10 STREAM & CAREER DECISION PLATFORM',
    heroHeadlineLine1: 'Don\'t Choose a Stream Before',
    heroHeadlineLine2: 'You Understand',
    heroHeadlineLine3: 'The Student.',
    heroSubtitle: 'Go beyond marks. Understand cognitive strengths, personality traits, career interests, family expectations, and stream fitment before making the Class 11 decision.',
    primaryCtaText: 'FIND YOUR DIRECTION →',
    secondaryCtaText: 'SEE WHAT\'S INSIDE →',
    microStats: [
      { value: '30 MODULES', label: 'Stream Fitment Evaluation', subtitle: 'PCM, PCB, Commerce, Arts & Design' },
      { value: 'STUDENT + PARENT', label: 'Alignment Matrix', subtitle: 'Side-by-Side Expectation Analysis' },
      { value: '56-PAGE REPORT', label: 'Full Diagnostic + Executive', subtitle: 'Deep Insights & Entrance Prep' },
      { value: 'COUNSELLOR-SUPPORTED', label: 'Actionable Consultation', subtitle: 'Class 11 & Entrance Strategy' }
    ],
    problemHeadline: 'MOST CLASS 10 STREAM DECISIONS ARE MADE ON MARKS ALONE.',
    problemSub: 'Choosing PCM, PCB, Commerce, or Arts based purely on Class 10 Board exam marks often leads to stream mismatch, stress, and career correction in Class 12.',
    traditionalFlow: ['Board Marks Only', 'Friend Choices', 'Parent Pressure', 'Wrong Stream Choice', 'Class 11 Struggle'],
    simplifiedFlow: ['Cognitive Assessment', 'Psychometric Profiling', 'Parent Expectation Alignment', 'Matched Stream Options', 'Confident Class 11 Fit'],
    assessmentDimensions: [
      { id: 'cog', title: 'Cognitive Architecture & Speed', category: 'Core Logic', description: 'Measures numerical, verbal, spatial, and diagrammatic reasoning required for specialized streams.', iconName: 'Brain' },
      { id: 'stream', title: 'Stream Fitment Index (PCM/PCB/Commerce/Arts)', category: 'Academic Fit', description: 'Calculates specific compatibility scores for Science, Commerce, and Humanities tracks.', iconName: 'Compass' },
      { id: 'riasec', title: 'RIASEC Interest & Career Clusters', category: 'Career Fit', description: 'Maps internal interests to growing global career industries.', iconName: 'Briefcase' },
      { id: 'parent', title: 'Parent Alignment Matrix', category: 'Family View', description: 'Compares student stream preferences against parent expectations, budget, and location openness.', iconName: 'Users' },
      { id: 'exam', title: 'Entrance Exam Readiness Index', category: 'Competitive Fit', description: 'Evaluates readiness for JEE, NEET, CUET, CLAT, and international study routes.', iconName: 'Zap' },
      { id: 'pers', title: 'Stress Tolerance & Work Ethic', category: 'Habits', description: 'Assesses academic stamina, distraction management, and problem-solving resilience.', iconName: 'Sparkles' }
    ],
    deliverables: [
      { title: 'Full Diagnostic Report', pages: '56 Pages', description: 'Comprehensive stream fitment, cognitive breakdown, and career cluster analysis.', badge: 'Full Report' },
      { title: 'Executive Summary Edition', pages: '15 Pages', description: 'Concise summary for rapid decision making with parents and counsellors.', badge: 'Executive' },
      { title: 'Student–Parent Alignment Report', pages: 'Included', description: 'Side-by-side analysis of stream preferences and family expectations.', badge: 'Family Alignment' },
      { title: 'Class 11 & Entrance Exam Roadmap', pages: 'Action Plan', description: 'Step-by-step guidance on subject combinations, entrance exams, and profile building.', badge: 'Roadmap' }
    ],
    reportPagesPreview: [
      { title: 'Executive Stream Fitment Summary', subtitle: 'PCM vs PCB vs Commerce vs Arts Compatibility', pageNum: 'Page 04' },
      { title: 'Student–Parent Expectation Matrix', subtitle: 'Stream Preference & Budget Alignment', pageNum: 'Page 16' },
      { title: 'Primary Career Pathway Roadmap', subtitle: 'Degree & Entrance Exam Strategy', pageNum: 'Page 28' },
      { title: 'Study Abroad vs. India Strategy', subtitle: 'Global Degree & University Mapping', pageNum: 'Page 42' }
    ],
    pathways: [
      { title: 'Science & Engineering (PCM)', type: 'PRIMARY', description: 'Engineering, Computer Science, AI, Robotics, and Physical Sciences.', degreePaths: ['B.Tech / B.E.', 'B.Sc Data Science', 'Architecture'], growthIndex: 'High Global Demand' },
      { title: 'Commerce & Financial Analytics', type: 'SECONDARY', description: 'Finance, Business Administration, Economics, CA, and Management.', degreePaths: ['BBA / BMS', 'B.Com (Hons)', 'Economics Hons'], growthIndex: 'Corporate Standard' },
      { title: 'Design, Law & Humanities', type: 'ALTERNATIVE', description: 'Corporate Law, UI/UX Design, Journalism, Psychology, and Public Policy.', degreePaths: ['BA LLB', 'B.Des', 'Psychology Hons'], growthIndex: 'Creative Impact' }
    ],
    parentTitle: 'Align Family Expectations Before Stream Allocation.',
    parentSub: 'The Class 10 Parent Assessment allows parents to input thoughts on budget, competitive exam preferences, and study abroad openness — creating a structured family alignment report.',
    counsellorTitle: 'Turn Assessment Data Into A Confident Stream Decision.',
    counsellorSub: 'Our reports provide educational counsellors with exact evidence to recommend subject combinations and entrance exam prep during 1-on-1 consultations.',
    finalCtaHeadline: 'CHOOSE YOUR CLASS 11 STREAM WITH EVIDENCE.',
    faqs: [
      { question: 'Why is the Class 10 Assessment critical?', answer: 'Class 10 is the single most important decision checkpoint. The assessment prevents stream mismatch by evaluating cognitive ability, interest, and parent alignment before selecting Class 11 subjects.' },
      { question: 'How does it evaluate PCM vs. PCB vs. Commerce vs. Arts?', answer: 'The assessment computes a multi-factorial fitment index based on numerical logic, spatial reasoning, verbal deduction, interest alignment, and work ethic.' },
      { question: 'What is included in the Parent Assessment?', answer: 'Parents complete a short questionnaire covering budget expectations, entrance exam preferences (JEE/NEET/CUET), and study abroad openness.' },
      { question: 'Can I use this report for study abroad planning?', answer: 'Yes! The report evaluates eligibility for international high school credit systems and undergraduate study abroad options in the USA, UK, Canada, and Europe.' },
      { question: 'How do I download the report after taking the test?', answer: 'Upon completion, your report is generated instantly and available for PDF download from your student dashboard.' }
    ]
  },

  '12': {
    variantId: '12',
    typeQueryParam: 'grade12',
    title: 'Class 12 Psychometric Assessment',
    badge: 'CLASS 12 DEGREE & UNIVERSITY DECISION PLATFORM',
    heroHeadlineLine1: 'Your Next Step Should Fit You —',
    heroHeadlineLine2: 'Not Just Your',
    heroHeadlineLine3: 'Marks.',
    heroSubtitle: 'Understand your cognitive strengths, career fit, degree options, university direction, and study-abroad possibilities before choosing your undergraduate path.',
    primaryCtaText: 'DISCOVER YOUR PATH →',
    secondaryCtaText: 'SEE WHAT\'S INSIDE →',
    microStats: [
      { value: '30 MODULES', label: 'Undergraduate Degree Matching', subtitle: '500+ Global University Database' },
      { value: 'STUDENT + PARENT', label: 'Expectation Matrix', subtitle: 'Budget, Location & Career Alignment' },
      { value: '56-PAGE REPORT', label: 'Full Diagnostic + Executive', subtitle: 'India + Study Abroad Pathways' },
      { value: 'COUNSELLOR-SUPPORTED', label: 'Application Roadmap', subtitle: 'SOP, Visa & Admission Strategy' }
    ],
    problemHeadline: 'THE MOST EXPENSIVE CAREER DECISION IS THE ONE MADE WITHOUT ENOUGH INFORMATION.',
    problemSub: 'Choosing an undergraduate degree or university based on rankings alone can lead to course dissatisfaction, career changes, or wasted tuition fees.',
    traditionalFlow: ['University Rankings Only', 'Unclear Degree Choice', 'High Tuition Risk', 'Course Dissatisfaction', 'Career Shift Needed'],
    simplifiedFlow: ['Cognitive & Career Fitment', 'Degree & Specialization Matching', 'India vs. Abroad Evaluation', 'Parent Budget Alignment', 'Confident University Admit'],
    assessmentDimensions: [
      { id: 'cog', title: 'Advanced Cognitive Capacity', category: 'Reasoning', description: 'Evaluates complex analytical, quantitative, and logical problem-solving abilities.', iconName: 'Brain' },
      { id: 'degree', title: 'Undergraduate Major Fitment', category: 'Degree Fit', description: 'Maps profile against 15+ major career clusters (Tech, Business, Healthcare, Design, Law, Arts).', iconName: 'Compass' },
      { id: 'abroad', title: 'Global Study & Adaptability Index', category: 'Study Abroad', description: 'Measures cross-cultural adaptability, independence, and readiness for global study.', iconName: 'Globe2' },
      { id: 'parent', title: 'Parent Financial & Location Alignment', category: 'Family View', description: 'Incorporates parent perspective on tuition budgets, country preferences, and post-study work goals.', iconName: 'Users' },
      { id: 'app', title: 'Application Readiness & Profile', category: 'Admissions', description: 'Evaluates SOP strength, academic record, standardized tests, and extracurricular profile.', iconName: 'Zap' },
      { id: 'pers', title: 'Work Ethic & Career Ambition', category: 'Leadership', description: 'Measures resilience, team collaboration, and long-term career ambition.', iconName: 'Sparkles' }
    ],
    deliverables: [
      { title: 'Full Diagnostic Report', pages: '56 Pages', description: 'Comprehensive analysis of degree options, university matches, and career trajectories.', badge: 'Full Report' },
      { title: 'Executive Career Edition', pages: '15 Pages', description: 'High-impact executive summary for quick review during university applications.', badge: 'Executive' },
      { title: 'Student–Parent Alignment Report', pages: 'Included', description: 'Direct comparison of degree goals, financial limits, and country choices.', badge: 'Family Alignment' },
      { title: 'University & Application Roadmap', pages: 'Action Plan', description: 'Timeline for entrance exams, university shortlists, SOP preparation, and visa filing.', badge: 'Roadmap' }
    ],
    reportPagesPreview: [
      { title: 'Executive Career Fitment Summary', subtitle: 'Primary & Secondary Degree Match', pageNum: 'Page 04' },
      { title: 'Global University Match Matrix', subtitle: 'USA, UK, Canada, Germany & India Options', pageNum: 'Page 22' },
      { title: 'Primary Career Pathway Roadmap', subtitle: 'Bachelor Degree to Master Trajectory', pageNum: 'Page 34' },
      { title: 'Student Action & Application Plan', subtitle: 'Timeline, Exams & SOP Strategy', pageNum: 'Page 48' }
    ],
    pathways: [
      { title: 'Technology, AI & Applied Computing', type: 'PRIMARY', description: 'Software Engineering, AI, Data Science, and Computer Science.', degreePaths: ['B.S. Computer Science', 'B.Tech AI', 'B.S. Data Analytics'], growthIndex: 'High Global Growth' },
      { title: 'International Business & Finance', type: 'SECONDARY', description: 'Global Business, Financial Technology, Marketing, and Consulting.', degreePaths: ['BBA Finance', 'B.S. International Business', 'B.A. Economics'], growthIndex: 'Global Corporate Fit' },
      { title: 'Biomedical & Life Sciences', type: 'ALTERNATIVE', description: 'Biotechnology, Healthcare Management, and Pharmaceutical Sciences.', degreePaths: ['B.S. Biotechnology', 'Pre-Med / Bio', 'B.Sc Public Health'], growthIndex: 'Critical Global Need' }
    ],
    parentTitle: 'Unify Student Ambitions with Parent Financial Planning.',
    parentSub: 'The Class 12 Parent Assessment captures parent perspectives on tuition budget, target countries, and post-study work expectations — facilitating productive family discussions.',
    counsellorTitle: 'Turn Assessment Insights Into Successful Admissions.',
    counsellorSub: 'Educational counsellors use the report to refine university shortlists, guide SOP writing, and build personalized application strategies.',
    finalCtaHeadline: 'CHOOSE YOUR UNDERGRADUATE DEGREE WITH CLARITY.',
    faqs: [
      { question: 'What does the Class 12 Psychometric Assessment cover?', answer: 'It evaluates cognitive reasoning, career interests, personality traits, degree fitment, parent financial alignment, and study abroad readiness.' },
      { question: 'Can this assessment help me decide between India and Study Abroad?', answer: 'Yes! The report evaluates global adaptability and matches your profile against both Indian entrance options and study abroad destinations (USA, UK, Canada, Australia, Germany).' },
      { question: 'How is the Parent Assessment used for Class 12 students?', answer: 'Parents share input on budget limits, preferred countries, and career expectations. The system generates a side-by-side alignment matrix.' },
      { question: 'Does the assessment help with SOP and university selection?', answer: 'Yes. The resulting report provides clear narrative points for your Statement of Purpose (SOP) and recommends target, reach, and safety universities.' },
      { question: 'How do I access the PDF report after completing the test?', answer: 'Your full 56-page PDF diagnostic report and 15-page Executive Edition are generated instantly upon completion and available for download.' }
    ]
  }
};
