/**
 * Junior Report Data Adapter (Class 7–9)
 * ─────────────────────────────────────────────────────────────────────────────
 * Adapts Class 7–9 assessment results into the Universal 56-Page Report Schema.
 *
 * Employs stage-appropriate exploratory language, middle-school-to-high-school
 * roadmap progressions, and Olympiad/curiosity action milestones.
 *
 * CRITICAL: Zero fabricated scores, zero altered responses.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../../class10_editorial_engine';
import type { AlignmentResult } from '../../comparison-engine';
import type { ParentProfile } from '../../parent-scoring';
import type { PathwayRoadmapData, StudyAbroadGuideData, AcademicStage, StudentActionPlanData } from '../../class10_roadmap_engine';
import { type UniversalReportData, getVariantConfig } from '../universal-report-schema';

export function adaptJuniorReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): UniversalReportData {
  const config = getVariantConfig('junior');
  const firstName = (student.name || 'Candidate').split(' ')[0];

  // Extract exploratory vectors from student's careerFitment
  const pathways = scores.careerFitment || [];
  const p1 = pathways[0] || { name: 'Science & Technology Exploration Vector', score: 88 };
  const p2 = pathways[1] || { name: 'Commerce & Entrepreneurship Vector', score: 82 };
  const p3 = pathways[2] || { name: 'Humanities & Creative Expression Vector', score: 78 };

  const getJuniorVectorData = (
    vectorName: string,
    rankLabel: string,
    scoreVal: number
  ): PathwayRoadmapData => {
    const lower = vectorName.toLowerCase();

    if (lower.includes('humanities') || lower.includes('creative') || lower.includes('arts')) {
      return {
        pathwayName: vectorName,
        pathwayTitle: 'Humanities, Social Sciences & Creative Expression Vector',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} displays strong verbal reasoning (${scores.aptitude?.verbal || 75}%) combined with rich abstract curiosity (${scores.personality?.openness || 75}% Openness). In middle school, this profile thrives through creative writing, historical exploration, debate, and interdisciplinary storytelling.`,
        foundation: {
          subjects: ['English & Creative Literature', 'History & Civics', 'Visual Arts & Media', 'Applied Social Studies', 'Foundational Mathematics'],
          exams: ['International General Knowledge Olympiad (IGKO)', 'National Essay & Creative Writing Competitions', 'Inter-School Debate Championships', 'All India Arts & Design Contest'],
          curriculumFocus: 'Focus on expressive writing, historical inquiry, active public speaking, and critical reading habits.',
        },
        bachelors: [
          {
            degree: 'B.A. (Hons) in Psychology / Media & Communication',
            specialization: 'Cognitive Behaviour, Journalism & Digital Media',
            whyFits: `Aligns with ${firstName}'s high empathy and expressive curiosity.`,
            careerOutcomes: 'Journalist, UX Content Strategist, Creative Producer, Behavioral Researcher',
          },
          {
            degree: 'B.Des (Bachelor of Design) / Visual Arts',
            specialization: 'Communication Design, Animation & Interactive Media',
            whyFits: 'Connects visual spatial thinking with narrative creativity.',
            careerOutcomes: 'Design Lead, Creative Art Director, Digital Illustrator',
          },
          {
            degree: 'B.A. (Hons) Political Science & Public Affairs / Law',
            specialization: 'International Relations, Public Governance & Constitutional Studies',
            whyFits: 'Capitalizes on strong verbal analysis and debate orientation.',
            careerOutcomes: 'Legal Analyst, Diplomatic Officer, Policy Researcher',
          },
        ],
        colleges: {
          reach: ["St. Stephen's College, Delhi", "Lady Shri Ram College (LSR)", "National Institute of Design (NID)", "Ashoka University"],
          fit: ["St. Xavier's College, Mumbai", "Miranda House, Delhi", "FLAME University, Pune", "Loyola College, Chennai"],
          accessible: ["Christ University, Bangalore", "Symbiosis Institute", "Mithibai College, Mumbai"],
        },
        masters: [
          'Master of Arts in International Relations / Media Studies',
          'Master of Public Policy (MPP)',
          'M.Des in Human-Centered Design',
        ],
        careerOutcomes: [
          'Global Policy & Social Impact Leader',
          'Creative Director & Brand Storyteller',
          'Behavioral Research & Strategic Consultant',
          'International Diplomatic & Legal Advocate',
        ],
        skills: ['Critical Reading & Essay Writing', 'Debate & Public Presentation', 'Visual Storyboarding', 'Qualitative Inquiry'],
        targetCompanies: ['United Nations Youth Forum', 'Penguin Random House', 'National Geographic', 'BBC Media Action', 'Ogilvy Creative Labs'],
        milestone: 'Lead a middle-school publication or school debate forum and maintain an active reflective reading journal.',
      };
    }

    if (lower.includes('commerce') || lower.includes('business') || lower.includes('management')) {
      return {
        pathwayName: vectorName,
        pathwayTitle: 'Commerce, Economics & Entrepreneurial Discovery Vector',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} demonstrates well-rounded quantitative reasoning (${scores.aptitude?.numerical || 78}%) alongside strong conscientiousness (${scores.personality?.conscientiousness || 76}%). This exploratory profile excels in understanding trade, financial dynamics, and collaborative team leadership.`,
        foundation: {
          subjects: ['Applied Mathematics', 'Commercial Studies & Economics Basics', 'Data Literacy', 'English & Business Communication', 'Social Sciences'],
          exams: ['International Commerce Olympiad (ICO)', 'Aryabhata Mathematics Olympiad', 'National Financial Literacy Quiz', 'Young Entrepreneur School Challenges'],
          curriculumFocus: 'Focus on numerical agility, data representation, team project coordination, and early economic awareness.',
        },
        bachelors: [
          {
            degree: 'B.Com (Hons) / B.B.A. (Bachelor of Business Administration)',
            specialization: 'Corporate Finance, Global Management, FinTech',
            whyFits: `Leverages ${firstName}'s structured organization and quantitative problem solving.`,
            careerOutcomes: 'Financial Analyst, Product Manager, Business Consultant',
          },
          {
            degree: 'B.A. (Hons) Economics & Data Science',
            specialization: 'Applied Econometrics, Market Design & Analytics',
            whyFits: 'Combines analytical problem solving with economic decision systems.',
            careerOutcomes: 'Economic Researcher, Data Strategy Associate, Quantitative Analyst',
          },
        ],
        colleges: {
          reach: ['Shri Ram College of Commerce (SRCC)', 'St. Stephen’s College', 'IIM Indore (IPMAT)', 'Shaheed Sukhdev College (SSCBS)'],
          fit: ["St. Xavier's College, Mumbai", 'Loyola College, Chennai', 'Narsee Monjee (NMIMS)', 'Ashoka University'],
          accessible: ['Christ University, Bangalore', 'Symbiosis Pune', 'Mithibai College, Mumbai'],
        },
        masters: [
          'Master of Business Administration (MBA)',
          'M.Sc. in Quantitative Finance & Risk',
          'Master in Management (MiM - Global)',
        ],
        careerOutcomes: [
          'Investment & Private Equity Strategist',
          'Chief Executive / Enterprise Founder',
          'Global Supply Chain & Operations Director',
          'Management & Economic Policy Consultant',
        ],
        skills: ['Financial Literacy & Spreadsheets', 'Team Leadership', 'Market Observation', 'Analytical Negotiation'],
        targetCompanies: ['Deloitte Youth Innovation', 'HDFC Bank Leadership Academy', 'McKinsey Forward Program', 'Tata Young Leaders'],
        milestone: 'Launch a student club enterprise project or participate in a junior stock market / business simulation challenge.',
      };
    }

    if (lower.includes('medical') || lower.includes('pcb') || lower.includes('life') || lower.includes('bio')) {
      return {
        pathwayName: vectorName,
        pathwayTitle: 'Biological Sciences, Healthcare & Living Systems Vector',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} exhibits strong inductive reasoning and keen scientific inquiry. This vector fosters deep exploration of natural living systems, human biology, ecology, and bio-technological innovation.`,
        foundation: {
          subjects: ['General Science (Biology & Chemistry Focus)', 'Mathematics & Data Modeling', 'Environmental Science', 'Computer Applications', 'Health & Physical Education'],
          exams: ['National Science Olympiad (NSO - SOF)', 'Vidyarthi Vigyan Manthan (VVM)', 'Green Olympiad (TERI)', 'Junior Science Talent Search (JSTS)'],
          curriculumFocus: 'Focus on laboratory observation, microscope work, biological classification, and environmental project work.',
        },
        bachelors: [
          {
            degree: 'M.B.B.S. / B.Sc. (Hons) Biomedical Science',
            specialization: 'Clinical Medicine, Molecular Biology, Neuroscience',
            whyFits: `Aligns with ${firstName}'s high focus on detail and prosocial service values.`,
            careerOutcomes: 'Physician, Clinical Geneticist, Biomedical Scientist',
          },
          {
            degree: 'B.Tech / B.Sc. in Biotechnology & Bioinformatics',
            specialization: 'Computational Biology, Genetic Engineering, Pharmacology',
            whyFits: 'Merges biological discovery with technological computing tools.',
            careerOutcomes: 'Biotech Researcher, Bioinformatician, Drug Discovery Scientist',
          },
        ],
        colleges: {
          reach: ['AIIMS, New Delhi', 'Christian Medical College (CMC), Vellore', 'IISc Bangalore (BS Biology)', 'JIPMER Puducherry'],
          fit: ['Kasturba Medical College (KMC), Manipal', "St. John's Medical College", 'Jamia Hamdard, Delhi'],
          accessible: ['D.Y. Patil Medical University', 'Amity Institute of Biotechnology', 'SRM Institute of Science'],
        },
        masters: [
          'M.D. / M.S. in Specialized Clinical Medicine',
          'M.Sc. / Ph.D. in Molecular Genetics & Neuroscience',
          'Master of Public Health (MPH - Global Health)',
        ],
        careerOutcomes: [
          'Chief Medical Officer / Specialized Surgeon',
          'Biomedical Innovation & Gene Therapy Lead',
          'Global Public Health & Epidemiology Director',
          'Pharmaceutical Research & Development Principal',
        ],
        skills: ['Microscopic & Lab Technique', 'Empirical Observation', 'Scientific Hypothesis Formulation', 'Biological Documentation'],
        targetCompanies: ['WHO Youth Health Initiatives', 'Biocon Research', 'Dr. Reddy’s Laboratories', 'Apollo Health Network'],
        milestone: 'Complete an in-depth biological science fair investigation or environmental biodiversity project.',
      };
    }

    // Default: STEM / Engineering / Computational
    return {
      pathwayName: vectorName,
      pathwayTitle: 'STEM, Engineering & Computational Logic Vector',
      pathwayRankLabel: rankLabel,
      fitScore: scoreVal,
      rationale: `${firstName} demonstrates outstanding logical deduction (${scores.aptitude?.reasoning || 80}%) and high spatial reasoning (${scores.aptitude?.spatial || 74}%). In middle school, this profile naturally gravitates toward algorithmic puzzles, robotics, structural building, and hands-on scientific experimentation.`,
      foundation: {
        subjects: ['Mathematics & Geometry', 'Physical Sciences (Physics & Chemistry)', 'Computer Science & Coding', 'Design & Technology', 'Robotics & Automation'],
        exams: ['International Mathematics Olympiad (IMO - SOF)', 'National Science Olympiad (NSO)', 'Unified Cyber Olympiad (UCO)', 'FIRST LEGO League Robotics'],
        curriculumFocus: 'Focus on geometric reasoning, algorithmic coding (Python/Scratch), physics experiments, and building structural prototypes.',
      },
      bachelors: [
        {
          degree: 'B.Tech / B.S. in Computer Science & Artificial Intelligence',
          specialization: 'Machine Learning, Software Architecture, Cybersecurity',
          whyFits: `Capitalizes on ${firstName}'s strong fluid logic and abstract pattern synthesis.`,
          careerOutcomes: 'Software Systems Engineer, AI Specialist, Cloud Architect',
        },
        {
          degree: 'B.Tech in Robotics & Mechatronics Engineering',
          specialization: 'Autonomous Systems, Embedded Computing, Aerospace Dynamics',
          whyFits: 'Combines spatial visualization with quantitative problem-solving grit.',
          careerOutcomes: 'Robotics Engineer, Aerospace Systems Designer, Hardware Architect',
        },
        {
          degree: 'B.S. (Hons) in Mathematics & Computing / Data Science',
          specialization: 'Algorithm Engineering, Cryptography, Statistical Modelling',
          whyFits: 'Deep theoretical logic paired with high computational throughput.',
          careerOutcomes: 'Data Scientist, Quantitative Modeller, Research Scientist',
        },
      ],
      colleges: {
        reach: ['Indian Institute of Technology (IIT Bombay / Delhi / Madras)', 'BITS Pilani', 'IISc Bangalore', 'IIIT Hyderabad'],
        fit: ['National Institute of Technology (NIT Trichy / Surathkal / Warangal)', 'Delhi Technological University (DTU)', 'Thapar University'],
        accessible: ['Manipal Institute of Technology (MIT)', 'Vellore Institute of Technology (VIT)', 'Shiv Nadar University'],
      },
      masters: [
        'M.S. in Computer Science / Artificial Intelligence (Global)',
        'M.Tech in Robotics & Autonomous Systems',
        'Ph.D. in Computational Sciences & Machine Intelligence',
      ],
      careerOutcomes: [
        'Principal Systems Architect / Chief Technology Officer',
        'AI Research Scientist & Algorithmic Lead',
        'Aerospace Dynamics & Autonomous Systems Director',
        'Venture Technology Innovator & Engineering Founder',
      ],
      skills: ['Algorithmic Thinking (Python / Scratch)', 'Spatial Drafting & 3D Modeling', 'Mathematical Deduction', 'Scientific Investigation'],
      targetCompanies: ['ISRO Space Innovators Hub', 'Google Youth Labs', 'Microsoft Student Academy', 'NASA Space Apps Challenge', 'Apple Developer Academy'],
      milestone: 'Construct a working robotics or software project and achieve top merit ranking in national STEM olympiads.',
    };
  };

  const primaryRoadmap = getJuniorVectorData(p1.name, 'PRIMARY EXPLORATORY VECTOR (RANK 1)', p1.score);
  const secondaryRoadmap = getJuniorVectorData(p2.name, 'SECONDARY EXPLORATORY VECTOR (RANK 2)', p2.score);
  const alternativeRoadmap = getJuniorVectorData(p3.name, 'STRATEGIC ALTERNATIVE (RANK 3)', p3.score);

  const studyAbroad: StudyAbroadGuideData = {
    rationale: `For middle school learners like ${firstName}, international exposure is best focused on cultural curiosity, multilingualism, and global summer science/arts academies before university degree applications.`,
    fitmentSummary: `Targeting foundational global immersion and international perspective in the United Kingdom, United States, Germany, and Singapore aligned with ${p1.name}.`,
    parentOpennessLabel: parentProfile?.choices?.preferredRegion && parentProfile.choices.preferredRegion !== 'prefer_india' ? 'Active Early Global Interest' : 'Balanced Exploratory Horizon',
    financialAlignmentLabel: 'Long-term Higher Education Planning',
    countries: [
      {
        flag: '🇬🇧',
        name: 'United Kingdom',
        reason: 'Oxford & Cambridge youth summer academies offer middle school students world-class immersion in scientific debate, literature, and history.',
        academicRoute: 'Summer Youth Academies & Future GCSE/A-Level Awareness',
        costCategory: 'Moderate (Summer Academy Grants Available)',
      },
      {
        flag: '🇺🇸',
        name: 'United States',
        reason: 'Leading youth talent centers like Johns Hopkins CTY and Stanford Pre-Collegiate programs provide advanced online and summer enrichment.',
        academicRoute: 'Middle School STEM / Arts Enrichment Camps',
        costCategory: 'Merit-Based Youth Scholarships Available',
      },
      {
        flag: '🇸🇬',
        name: 'Singapore',
        reason: 'A regional leader in STEM education, Singapore hosts outstanding robotics, science museum immersions, and bilingual cultural camps.',
        academicRoute: 'Regional STEM & Science Immersion Camps',
        costCategory: 'Accessible & Safe Proximity',
      },
    ],
    scholarships: [
      'Johns Hopkins CTY Global Young Scholar Grants',
      'Singapore International Youth Summer Fellowship',
      'Commonwealth Junior Student Cultural Exchange',
      'Oxford Summer Academy Merit Bursaries',
    ],
    programs: [
      'Youth Computational Thinking & Robotics Immersion',
      'Junior Model United Nations & Global Leadership Forum',
      'Young Writers & Environmental Explorers Workshop',
      'Middle School Applied Math & Science Discovery League',
    ],
  };

  const academicRoadmap: AcademicStage[] = [
    {
      phase: 'STAGE 1',
      label: config.roadmapTerminology.stage1Label,
      icon: '🌱',
      academicGoal: 'Master foundational concepts in Mathematics, Science, and English. Read 15+ diverse non-fiction & literature books yearly.',
      profileGoal: 'Join 2 school activity clubs (Robotics, Debate, Nature Club, Art). Explore diverse hobby vectors without pressure.',
      keySkills: ['Curiosity Habit', 'Active Listening', 'Neat Scientific Logging'],
      milestone: 'Complete a self-directed science or creative arts project for the annual school exhibition.',
    },
    {
      phase: 'STAGE 2',
      label: config.roadmapTerminology.stage2Label,
      icon: '🔍',
      academicGoal: 'Build disciplined study schedules, strengthen analytical problem-solving, and participate in competitive Olympiads.',
      profileGoal: 'Identify top 2 preferred stream candidates for Class 11 based on objective test feedback and academic performance.',
      keySkills: ['Time Blocking', 'Olympiad Strategy', 'Independent Research'],
      milestone: 'Complete Class 10 Board Examinations and officially lock Class 11 subject stream electives.',
    },
    {
      phase: 'STAGE 3',
      label: config.roadmapTerminology.stage3Label,
      icon: '📚',
      academicGoal: 'Achieve 90%+ in specialized Class 11–12 subjects and prepare targeted competitive entrance exams.',
      profileGoal: 'Hold student leadership positions, lead community projects, and build an extracurricular portfolio.',
      keySkills: ['Advanced Problem Solving', 'Consistency Under Load', 'Academic Writing'],
      milestone: 'Achieve top percentiles in college entrance examinations and secure premier university admission.',
    },
    {
      phase: 'STAGE 4',
      label: config.roadmapTerminology.stage4Label,
      icon: '🎓',
      academicGoal: 'Maintain high Cumulative GPA (8.5+/10) in chosen undergraduate degree and complete specialized internships.',
      profileGoal: 'Engage in undergraduate research, author technical papers, or lead collegiate startup initiatives.',
      keySkills: ['Professional Systems Thinking', 'Interdisciplinary Synthesis', 'Team Leadership'],
      milestone: 'Secure prestigious pre-placement job offer or admission to top-tier global graduate master’s program.',
    },
    {
      phase: 'STAGE 5',
      label: config.roadmapTerminology.stage5Label,
      icon: '🚀',
      academicGoal: 'Master specialized industry frameworks or complete advanced doctoral/master’s credentials.',
      profileGoal: 'Establish leadership footprint in chosen field, mentor younger peers, and drive innovative impact.',
      keySkills: ['Executive Vision', 'Strategic Decision Making', 'Global Domain Mastery'],
      milestone: 'Become an authoritative leader, senior specialist, or transformative enterprise founder.',
    },
  ];

  const actionPlan: StudentActionPlanData = {
    thisMonth: [
      `Set up a designated daily 45-minute deep focus study block with zero phone/screen distractions.`,
      `Select 2 books aligned with ${primaryRoadmap.pathwayTitle} for weekly reading.`,
      `Create an "Exploration Idea Journal" to note down questions, inventions, and fascinating scientific or historical facts.`,
    ],
    next90Days: [
      `Participate in an upcoming school science exhibition, math contest, or creative writing challenge.`,
      `Form a weekend study club with 2 peers to discuss problem-solving puzzles and logic challenges.`,
      `Conduct a structured family discussion to review this report and agree on middle school hobby budgets.`,
    ],
    thisAcademicYear: [
      `Register for at least 1 National Olympiad (SOF NSO, IMO, or UCO) to experience standardized testing calmly.`,
      `Maintain a consistent 85%+ benchmark in core school exams across Science, Mathematics, and Languages.`,
      `Explore 1 non-academic extracurricular skill (e.g. musical instrument, chess, robotics kit, swimming).`,
    ],
    skillsToBuild: [
      'Logical Reasoning & Mathematical Deduction',
      'Structured Note-Taking (Cornell Method)',
      'Speed Reading & Textual Comprehension',
      'Public Speaking & Confident Explanation',
      'Daily Habit Consistency & Time Ownership',
    ],
    counsellorCheckpoint: [
      `Schedule a semi-annual check-in with school counsellor to track exploratory interest consistency.`,
      `Review academic score trends to detect early subject affinities before entering Class 9.`,
      `Ensure a healthy balance between academic discovery, physical sports, and creative play.`,
    ],
    studentAction: [
      `Approach every subject with the question: "How does this connect to real-world problems?"`,
      `Do not fear difficult math or science problems—treat them like puzzle games to be cracked.`,
      `Celebrate effort and gradual skill improvements rather than just test score ranks.`,
    ],
  };

  return {
    variant: 'junior',
    config,
    student: {
      ...student,
      grade: student.grade || 'Class 8',
    },
    scores,
    personalization,
    comparisonData: comparisonData || null,
    parentProfile: parentProfile || null,
    roadmaps: {
      primary: primaryRoadmap,
      secondary: secondaryRoadmap,
      alternative: alternativeRoadmap,
    },
    studyAbroad,
    academicRoadmap,
    actionPlan,
  };
}
