export interface DestinationItem {
  name: string;
  code: string;
  flag: string;
  universityCount: string;
  description: string;
  keyFeature: string;
  link: string;
}

export interface CareerPathwayItem {
  id: string;
  title: string;
  category: string;
  description: string;
  popularMajors: string[];
  growthIndex: string;
  iconName: string;
}

export interface ToolEcosystemItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  whyItMatters: string;
  ctaText: string;
  href: string;
  iconName: string;
}

export interface JourneyStageItem {
  step: string;
  stage: string;
  title: string;
  description: string;
  output: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const HOME_PAGE_CONFIG = {
  brandName: 'Abroad Simplified',
  tagline: 'Student Intelligence, Career & Study Abroad Platform',
  heroEyebrow: 'STUDENT INTELLIGENCE × STUDY ABROAD',
  heroHeadlineLine1: 'KNOW YOURSELF.',
  heroHeadlineLine2: 'FIND YOUR PATH.',
  heroHeadlineLine3: 'GO FURTHER.',
  heroSubtitle: 'Discover your strengths, explore career pathways, find universities that fit, and build your study-abroad journey around you.',
  
  primaryCtaText: 'START YOUR JOURNEY →',
  primaryCtaHref: '/psychometric-test',
  secondaryCtaText: 'EXPLORE UNIVERSITIES',
  secondaryCtaHref: '/university-finder',
  heroTrustLine: [
    'Cognitive Assessment',
    'Career Discovery',
    'University Matching',
    'Counsellor Guidance'
  ],

  trustMetrics: [
    { value: '10,000+', label: 'Students Guided', subtitle: 'Holistic Career & Study Abroad Roadmap' },
    { value: '500+', label: 'Universities Listed', subtitle: 'Global Degree & Program Database' },
    { value: '40+', label: 'Countries Covered', subtitle: 'USA, UK, Germany, Canada, Australia & More' },
    { value: 'MULTI-DOMAIN', label: 'Assessment System', subtitle: 'Cognitive, Psychometric & Parent Inputs' }
  ],

  destinations: [
    {
      name: 'United States',
      code: 'USA',
      flag: '🇺🇸',
      universityCount: '180+ Universities',
      description: 'Ivy League & top STEM research institutions with OPT work authorization opportunities.',
      keyFeature: 'Flexible Majors & OPT Work Extension',
      link: '/university-finder?country=USA'
    },
    {
      name: 'United Kingdom',
      code: 'UK',
      flag: '🇬🇧',
      universityCount: '120+ Universities',
      description: 'Russell Group universities offering intensive 1-year Master programs and 2-year Graduate Route.',
      keyFeature: '1-Year Master & Graduate Route Visa',
      link: '/university-finder?country=UK'
    },
    {
      name: 'Canada',
      code: 'CA',
      flag: '🇨🇦',
      universityCount: '85+ Universities',
      description: 'Top research universities with generous Post-Graduation Work Permits (PGWP) & PR pathways.',
      keyFeature: '3-Year PGWP & Direct PR Pathways',
      link: '/university-finder?country=Canada'
    },
    {
      name: 'Australia',
      code: 'AU',
      flag: '🇦🇺',
      universityCount: '60+ Universities',
      description: 'Group of Eight universities, strong engineering/healthcare sectors, and high quality of life.',
      keyFeature: 'Group of 8 & Extended Post-Study Work',
      link: '/university-finder?country=Australia'
    },
    {
      name: 'Germany',
      code: 'DE',
      flag: '🇩🇪',
      universityCount: '55+ Universities',
      description: 'Tuition-free public universities, world-renowned engineering hubs, and 18-month job seeker visa.',
      keyFeature: 'Tuition-Free Public Universities',
      link: '/university-finder?country=Germany'
    }
  ] as DestinationItem[],

  careerPathways: [
    {
      id: 'tech',
      title: 'Technology & Computing',
      category: 'STEM & Innovation',
      description: 'Artificial intelligence, software engineering, data science, and cybersecurity pathways.',
      popularMajors: ['Computer Science', 'AI & Robotics', 'Data Analytics', 'Cybersecurity'],
      growthIndex: 'High Global Demand',
      iconName: 'Code'
    },
    {
      id: 'business',
      title: 'Business & Management',
      category: 'Finance & Strategy',
      description: 'Financial analysis, international business, marketing technology, and entrepreneurship.',
      popularMajors: ['Business Analytics', 'Finance', 'International Management', 'Marketing'],
      growthIndex: 'Global Corporate Fit',
      iconName: 'Briefcase'
    },
    {
      id: 'humanities',
      title: 'Humanities & Social Sciences',
      category: 'Policy & Behavior',
      description: 'Psychology, international relations, journalism, behavioral science, and public policy.',
      popularMajors: ['Psychology', 'International Relations', 'Media & Comm', 'Public Policy'],
      growthIndex: 'High Human Capital Impact',
      iconName: 'BookOpen'
    },
    {
      id: 'design',
      title: 'Design & Creative Arts',
      category: 'Media & Architecture',
      description: 'User experience design, industrial design, digital architecture, and visual communications.',
      popularMajors: ['UI/UX Design', 'Architecture', 'Digital Media', 'Industrial Design'],
      growthIndex: 'High Creative Demand',
      iconName: 'Palette'
    },
    {
      id: 'health',
      title: 'Healthcare & Life Sciences',
      category: 'Medicine & Biotech',
      description: 'Biomedical engineering, biotechnology, public health, and pharmaceutical sciences.',
      popularMajors: ['Biomedical Sciences', 'Public Health', 'Biotechnology', 'Pharmacology'],
      growthIndex: 'Critical Global Need',
      iconName: 'Activity'
    },
    {
      id: 'eng',
      title: 'Engineering & Physical Sciences',
      category: 'Applied Physics & Math',
      description: 'Mechanical, aerospace, civil, electrical engineering, and renewable energy technologies.',
      popularMajors: ['Robotics Engineering', 'Aerospace', 'Renewable Energy', 'Civil Engineering'],
      growthIndex: 'High Industrial Growth',
      iconName: 'Cpu'
    }
  ] as CareerPathwayItem[],

  tools: [
    {
      id: 'iq',
      number: '01',
      title: 'Cognitive Assessment',
      tagline: 'Measure Core Reasoning Capacity',
      description: 'A 45-question visual assessment evaluating pattern recognition, spatial logic, and quantitative problem solving.',
      whyItMatters: 'Identifies core cognitive processing speed and analytical learning style.',
      ctaText: 'Take IQ Assessment →',
      href: '/iq-test',
      iconName: 'Brain'
    },
    {
      id: 'psychometric',
      number: '02',
      title: 'Psychometric Profiling',
      tagline: 'Discover Strengths & Personality',
      description: 'Multi-dimensional evaluation measuring learning habits, personality traits, and career interests.',
      whyItMatters: 'Connects internal motivations and personality traits to suitable field choices.',
      ctaText: 'Start Psychometric Test →',
      href: '/psychometric-test',
      iconName: 'Compass'
    },
    {
      id: 'parent',
      number: '03',
      title: 'Parent Assessment',
      tagline: 'Align Family Expectations',
      description: 'Structured parent questionnaire enabling side-by-side alignment of student and parent expectations.',
      whyItMatters: 'Creates shared clarity on budgets, locations, and career preferences early on.',
      ctaText: 'Explore Parent Test →',
      href: '/parent-assessment',
      iconName: 'Users'
    },
    {
      id: 'finder',
      number: '04',
      title: 'University Finder',
      tagline: 'Discover Global Degree Programs',
      description: 'Search 500+ universities across 40 countries filtered by courses, fees, tuition, and scholarships.',
      whyItMatters: 'Finds institutions matched to academic standing and financial target.',
      ctaText: 'Search Universities →',
      href: '/university-finder',
      iconName: 'Search'
    },
    {
      id: 'plan',
      number: '05',
      title: 'Study Abroad Planning',
      tagline: 'Structure Your Application Timeline',
      description: 'Track application deadlines, visa procedures, SOP preparation, and document checklists.',
      whyItMatters: 'Turns research into a structured, step-by-step application strategy.',
      ctaText: 'View Dashboard →',
      href: '/dashboard/student',
      iconName: 'Calendar'
    },
    {
      id: 'counsellor',
      number: '06',
      title: 'Counsellor Support',
      tagline: 'Expert Human Guidance',
      description: 'Direct consultation with experienced educational counsellors to review assessment reports and choices.',
      whyItMatters: 'Converts assessment intelligence into confident decisions.',
      ctaText: 'Connect with Counsellor →',
      href: '/dashboard/counsellor',
      iconName: 'UserCheck'
    }
  ] as ToolEcosystemItem[],

  journeyStages: [
    {
      step: '01',
      stage: 'ASSESS',
      title: 'Understand Yourself First',
      description: 'Complete standardized cognitive and psychometric evaluations to identify natural strengths and learning style.',
      output: 'Cognitive & Psychometric Report'
    },
    {
      step: '02',
      stage: 'DISCOVER',
      title: 'Discover Career Pathways',
      description: 'Map cognitive strengths and interests against growing global career fields and degree domains.',
      output: 'Matched Career Domains'
    },
    {
      step: '03',
      stage: 'EXPLORE',
      title: 'Explore Universities & Countries',
      description: 'Filter over 500+ global universities across USA, UK, Canada, Australia, and Germany by budget and requirements.',
      output: 'Shortlisted Institutions'
    },
    {
      step: '04',
      stage: 'PLAN',
      title: 'Build Study Abroad Roadmap',
      description: 'Structure test prep, SOP writing, scholarship applications, and visa documentation timelines.',
      output: 'Application Action Plan'
    },
    {
      step: '05',
      stage: 'GUIDE',
      title: 'Receive Counsellor Guidance',
      description: 'Collaborate with expert academic counsellors to review parent inputs and finalize university applications.',
      output: 'Finalized University Admission'
    }
  ] as JourneyStageItem[],

  faqs: [
    {
      question: 'What is Abroad Simplified?',
      answer: 'Abroad Simplified is a complete Student Intelligence, Career, and Study Abroad platform. We combine cognitive assessments, psychometric profiling, parent alignment, university discovery, and expert counsellor guidance in one connected platform.'
    },
    {
      question: 'What can I use the platform for?',
      answer: 'You can use Abroad Simplified to discover your cognitive strengths, evaluate career directions, compare 500+ global universities across 40 countries, track application deadlines, and consult with academic counsellors.'
    },
    {
      question: 'What does the Psychometric Assessment measure?',
      answer: 'The Psychometric Assessment measures learning style, analytical mindset, career interests, personality traits, and cross-cultural adaptability to recommend optimal field and stream choices.'
    },
    {
      question: 'What does the IQ Assessment measure?',
      answer: 'The IQ Assessment is a standardized 45-item visual assessment evaluating visual pattern matrix reasoning, spatial figure rotation, numerical logic, verbal deduction, and abstract working memory.'
    },
    {
      question: 'Can parents participate in the process?',
      answer: 'Yes! Abroad Simplified features a dedicated Parent Assessment tool that allows parents to share their perspectives on budgets, country preferences, and career expectations. The system generates a side-by-side comparison report for family discussion.'
    },
    {
      question: 'Can I speak to a counsellor for human guidance?',
      answer: 'Yes. Our certified educational counsellors review your assessment reports, university shortlists, and parent preferences to help you make confident decisions.'
    },
    {
      question: 'How does the University Finder work?',
      answer: 'The University Finder catalogs 500+ accredited universities across the USA, UK, Canada, Australia, Germany, and Europe. You can filter by major, tuition fee budget, post-study work visa options, and scholarship availability.'
    },
    {
      question: 'Can I use the platform for complete study abroad planning?',
      answer: 'Yes. Beyond assessment and discovery, the platform provides application tracking dashboards, SOP writing guidance, document checklists, financial proof guides, and visa interview preparation.'
    }
  ] as FAQItem[]
};
