export interface IQConfigDomain {
  id: number;
  title: string;
  shortTitle: string;
  itemCount: number;
  description: string;
  reveals: string;
  iconName: string;
}

export interface IQConfigScoreBand {
  range: string;
  title: string;
  description: string;
  level: string;
}

export interface IQConfigFAQ {
  question: string;
  answer: string;
}

export const IQ_ASSESSMENT_CONFIG = {
  brandName: 'Abroad Simplified',
  assessmentTitle: 'Standardized 45-Item Cognitive Assessment',
  questionCount: 45,
  estimatedDuration: '15 Minutes',
  sectionCount: 5,
  resultLabel: 'Estimated IQ Score',
  certificateTitle: 'Cognitive Assessment Certificate',
  issuingOrganization: 'Simplified School of Education',
  scoringFramework: 'Mean = 100, SD = 15 Standardized Normal Distribution',

  trustMetrics: [
    { value: '45', label: 'Questions', subtitle: 'Visual & Analytical' },
    { value: '5', label: 'Cognitive Domains', subtitle: 'Balanced Evaluation' },
    { value: '~15', label: 'Minutes', subtitle: 'Standardized Timer' },
    { value: '1', label: 'Personalized Result', subtitle: 'Score, Profile & Certificate' }
  ],

  domains: [
    {
      id: 1,
      title: 'Visual Pattern & Matrix Reasoning',
      shortTitle: 'Pattern Matrix',
      itemCount: 12,
      description: 'Evaluates non-verbal matrix puzzles, pattern continuation, grid relationships, and missing-tile deductive rules.',
      reveals: 'Identifies how quickly a student recognizes underlying structural rules in complex visual environments.',
      iconName: 'Grid'
    },
    {
      id: 2,
      title: 'Spatial / Figure Reasoning',
      shortTitle: 'Spatial Reasoning',
      itemCount: 9,
      description: 'Measures 2D/3D shape rotations, horizontal reflections, figure analogies, net folding, and geometric counting.',
      reveals: 'Highlights spatial visualization capacity essential for STEM, architecture, design, and technical problem-solving.',
      iconName: 'Compass'
    },
    {
      id: 3,
      title: 'Numerical & Quantitative Reasoning',
      shortTitle: 'Numerical Logic',
      itemCount: 8,
      description: 'Tests quantitative sequences, ratio-rate proportions, exponential relationships, and numerical grid logic.',
      reveals: 'Assesses facility with numerical structures, algebraic relations, and quantitative pattern deduction.',
      iconName: 'Hash'
    },
    {
      id: 4,
      title: 'Logical & Verbal Reasoning',
      shortTitle: 'Logical Deduction',
      itemCount: 8,
      description: 'Challenges deductive syllogisms, ordering logic, cipher shift decoding, and structural verbal analogies.',
      reveals: 'Measures systematic deductive rigor and the ability to draw valid conclusions from structured premises.',
      iconName: 'Lightbulb'
    },
    {
      id: 5,
      title: 'Sequence, Working Memory & Abstract Reasoning',
      shortTitle: 'Abstract Memory',
      itemCount: 8,
      description: 'Measures multi-step symbol operations, working memory sequence reversal, and high-discrimination abstract logic.',
      reveals: 'Indicates cognitive flexibility and working memory capacity when processing novel abstract constraints.',
      iconName: 'Brain'
    }
  ] as IQConfigDomain[],

  scoreBands: [
    {
      range: '< 85',
      title: 'Below Average',
      description: 'Performance indicates foundational reasoning with opportunities for targeted problem-solving development.',
      level: 'Emerging'
    },
    {
      range: '85 – 104',
      title: 'Average Cognitive Ability',
      description: 'Performance falls within the expected average range across visual matrix, spatial, and logical reasoning items.',
      level: 'Typical'
    },
    {
      range: '105 – 119',
      title: 'Above Average',
      description: 'Demonstrates heightened speed and precision in recognizing patterns and solving complex abstract items.',
      level: 'Strong'
    },
    {
      range: '120 – 134',
      title: 'Superior Cognitive Ability',
      description: 'Displays exceptional structural insight and logical accuracy across advanced multi-domain problems.',
      level: 'Superior'
    },
    {
      range: '135+',
      title: 'Exceptional Cognitive Potential',
      description: 'Top-tier performance characterized by rapid spatial manipulation, numerical fluency, and high-discrimination logic.',
      level: 'Exceptional'
    }
  ] as IQConfigScoreBand[],

  faqs: [
    {
      question: 'What does the assessment measure?',
      answer: 'The assessment evaluates 5 core cognitive domains: Visual Pattern & Matrix Reasoning, Spatial/Figure Reasoning, Numerical & Quantitative Reasoning, Logical & Verbal Reasoning, and Abstract Working Memory.'
    },
    {
      question: 'How long does the assessment take?',
      answer: 'The test features a standardized 15-minute countdown timer for all 45 questions. Progress is saved locally if your browser refreshes.'
    },
    {
      question: 'How many questions are included?',
      answer: 'The assessment contains exactly 45 original questions (~70% visual diagrammatic reasoning and ~30% quantitative/logical reasoning).'
    },
    {
      question: 'What do I receive after completion?',
      answer: 'Upon completion, you receive an instant Estimated IQ Score, percentile rank, 5-domain performance breakdown, cognitive persona analysis, and a downloadable PDF certificate issued by the Simplified School of Education.'
    },
    {
      question: 'How is the estimated score calculated?',
      answer: 'Raw scores across the 45 weighted items are normalized using a standard statistical model (Mean = 100, Standard Deviation = 15) relative to the scoring framework used by this assessment.'
    },
    {
      question: 'Can I retake the assessment?',
      answer: 'Yes. You can retake the assessment from your candidate dashboard to measure performance over time or under different test conditions.'
    },
    {
      question: 'Is this a clinical psychological diagnosis?',
      answer: 'No. This assessment provides a standardized Cognitive Ability Estimate for educational, self-assessment, and academic planning purposes. It is not a clinical psychological or medical diagnosis.'
    },
    {
      question: 'How is my data handled?',
      answer: 'Your assessment data is linked securely to your authenticated Abroad Simplified account and stored in encrypted cloud infrastructure. It is never shared with third parties.'
    },
    {
      question: 'Will this determine my career path?',
      answer: 'No single test determines a student\'s career. Your cognitive profile serves as one helpful input alongside psychometric guidance, academic interests, and counsellor advisement on the Abroad Simplified platform.'
    }
  ] as IQConfigFAQ[]
};
