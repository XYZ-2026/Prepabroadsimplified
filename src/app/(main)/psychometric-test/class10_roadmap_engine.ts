/**
 * Class 10 Deterministic Roadmap Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Calculates complete education & career roadmaps, degree choices, colleges,
 * postgraduate directions, global study abroad guides, multi-year timelines,
 * and individual action plans without calling external LLM APIs.
 */

import type { EditorialStudent, EditorialScores } from './class10_editorial_engine';
import type { AlignmentResult } from './comparison-engine';

export interface DegreeOption {
  degree: string;
  specialization: string;
  whyFits: string;
  careerOutcomes: string;
}

export interface PathwayRoadmapData {
  pathwayName: string;
  pathwayTitle: string;
  pathwayRankLabel: string;
  fitScore: number;
  rationale: string;
  foundation: {
    subjects: string[];
    exams: string[];
    curriculumFocus: string;
  };
  bachelors: DegreeOption[];
  colleges: {
    reach: string[];
    fit: string[];
    accessible: string[];
  };
  masters: string[];
  careerOutcomes: string[];
  skills: string[];
  targetCompanies: string[];
  milestone: string;
}

export interface StudyAbroadCountry {
  flag: string;
  name: string;
  reason: string;
  academicRoute: string;
  costCategory: string;
}

export interface StudyAbroadGuideData {
  rationale: string;
  fitmentSummary: string;
  parentOpennessLabel: string;
  financialAlignmentLabel: string;
  countries: StudyAbroadCountry[];
  scholarships: string[];
  programs: string[];
}

export interface AcademicStage {
  phase: string;
  label: string;
  icon: string;
  academicGoal: string;
  profileGoal: string;
  keySkills: string[];
  milestone: string;
}

export interface StudentActionPlanData {
  thisMonth: string[];
  next90Days: string[];
  thisAcademicYear: string[];
  skillsToBuild: string[];
  counsellorCheckpoint: string[];
  studentAction: string[];
}

// ─── HELPER: CLASSIFY PATHWAY CATEGORY ──────────────────────────────────────

type PathwayCategory = 'HUMANITIES' | 'COMMERCE' | 'PCM' | 'PCB';

function getPathwayCategory(pathwayName: string): PathwayCategory {
  const name = pathwayName.toLowerCase();
  if (/humanities|arts|creative|media|law|psychology|design|social/i.test(name)) {
    return 'HUMANITIES';
  }
  if (/commerce|business|finance|management|accounting|economics/i.test(name)) {
    return 'COMMERCE';
  }
  if (/medical|life science|biology|biotech|pcb|health/i.test(name)) {
    return 'PCB';
  }
  return 'PCM'; // Default to PCM / Engineering
}

// ─── 1. DETERMINISTIC PATHWAY ROADMAP GENERATOR ────────────────────────────

export function getPathwayRoadmapData(
  pathwayName: string,
  rankLabel: string,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): PathwayRoadmapData {
  const category = getPathwayCategory(pathwayName);
  const firstName = student.name.split(' ')[0];

  // Find exact score from careerFitment
  const fitObj = scores.careerFitment.find(c => 
    c.name.toLowerCase().includes(pathwayName.toLowerCase()) || 
    pathwayName.toLowerCase().includes(c.name.toLowerCase())
  );
  const fitScore = fitObj ? fitObj.score : 85;

  let data: PathwayRoadmapData;

  switch (category) {
    case 'HUMANITIES':
      data = {
        pathwayName,
        pathwayTitle: 'Humanities, Social Sciences & Creative Arts',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} demonstrates high verbal analysis (${scores.aptitude.verbal}%) and strong creative/abstract reasoning (${scores.personality.openness}% Openness). This profile aligns strongly with research-driven, legal, psychological, and creative communication pathways.`,
        foundation: {
          subjects: ['Psychology / Political Science', 'Legal Studies / History', 'English Literature', 'Applied Mathematics / Economics', 'Media Studies / Fine Arts'],
          exams: ['CUET-UG (Humanities/Arts)', 'CLAT (National Law Universities)', 'NID DAT / NIFT Entrance', 'Ashoka Aptitude Test (AAT)', 'SLAT / IPMAT'],
          curriculumFocus: 'Focus on developing critical writing, qualitative research, and persuasive analytical argumentation.'
        },
        bachelors: [
          {
            degree: 'B.A. (Hons) Psychology / Applied Psychology',
            specialization: 'Cognitive & Behavioral Psychology, Clinical Research',
            whyFits: `Leverages ${firstName}'s high agreeableness (${scores.personality.agreeableness}%) and empathetic analytical capacity.`,
            careerOutcomes: 'Organizational Psychologist, Behavioral Researcher, Clinical Specialist'
          },
          {
            degree: 'B.A. (Hons) Political Science & Public Policy / B.A. LL.B',
            specialization: 'International Relations, Public Governance, Corporate Law',
            whyFits: 'Capitalizes on strong verbal reasoning and structured logical deduction.',
            careerOutcomes: 'Policy Analyst, Legal Associate, Diplomatic Consultant, Public Affairs Specialist'
          },
          {
            degree: 'B.Des (Bachelor of Design) / B.A. Mass Communication',
            specialization: 'User Experience (UX) Design, Strategic Media & Brand Journalism',
            whyFits: 'Combines high Openness to Experience with visual-spatial creative capabilities.',
            careerOutcomes: 'UX/UI Researcher, Content Strategist, Brand Manager, Creative Director'
          },
          {
            degree: 'B.A. (Hons) Economics & Public Policy',
            specialization: 'Development Economics, Econometrics & Behavioral Policy',
            whyFits: 'Integrates analytical problem solving with social science impact.',
            careerOutcomes: 'Economic Analyst, Policy Researcher, Social Impact Consultant'
          }
        ],
        colleges: {
          reach: ["St. Stephen's College, Delhi", "Lady Shri Ram College (LSR)", "National Law School (NLSIU), Bangalore", "National Institute of Design (NID)"],
          fit: ["Ashoka University, Sonepat", "St. Xavier's College, Mumbai", "Miranda House, Delhi", "FLAME University, Pune"],
          accessible: ["Christ University, Bangalore", "Symbiosis Institute of Media", "Mithibai College, Mumbai", "K.J. Somaiya, Mumbai"]
        },
        masters: [
          'M.A. in Clinical / Organizational Psychology',
          'Master of Public Policy (MPP) / M.A. International Relations',
          'LL.M. in International Corporate Law / IP Law',
          'M.Des in Human-Computer Interaction (HCI)'
        ],
        careerOutcomes: [
          'UX Research & Product Strategy Leader',
          'Behavioral Data Scientist / Public Policy Analyst',
          'Corporate Legal Advisor / International Arbitrator',
          'Media Director & Brand Communications Specialist'
        ],
        skills: ['Qualitative & Textual Analysis', 'User Experience Prototyping', 'Legal Reasoning', 'Persuasive Speech & Writing', 'Behavioral Observation'],
        targetCompanies: ['McKinsey Policy Practice', 'Google UX Research', 'Ogilvy & Mather', 'United Nations (UN)', 'Shardul Amarchand Mangaldas'],
        milestone: 'Publish undergraduate research paper / design portfolio and complete 2 specialized internships before Class 12 completion.'
      };
      break;

    case 'COMMERCE':
      data = {
        pathwayName,
        pathwayTitle: 'Commerce, Finance & Business Management',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s profile exhibits strong numerical logic (${scores.aptitude.numerical}%) and structured execution discipline (${scores.personality.conscientiousness}% Conscientiousness), making business, finance, and corporate strategy ideal growth tracks.`,
        foundation: {
          subjects: ['Accountancy & Corporate Governance', 'Financial Economics', 'Business Studies & Management', 'Applied Mathematics / Informatics', 'English Composition'],
          exams: ['CUET-UG (Commerce/Economics)', 'IPMAT (IIM Indore & Rohtak)', 'NPAT (NMIMS Mumbai)', 'SET (Symbiosis International)', 'CA Foundation / CFA Access'],
          curriculumFocus: 'Focus on financial literacy, quantitative modeling, spreadsheet analysis, and business case resolution.'
        },
        bachelors: [
          {
            degree: 'B.Com (Hons) Accounting & Finance / CA Track',
            specialization: 'Corporate Finance, Forensic Accounting & Audit',
            whyFits: `Matches ${firstName}'s structured precision and high analytical discipline.`,
            careerOutcomes: 'Chartered Accountant, Financial Controller, Forensic Auditor'
          },
          {
            degree: 'BBA / IPM (Integrated Program in Management)',
            specialization: 'Strategic Management, International Business & Analytics',
            whyFits: 'Provides fast-track management training combining leadership with quantitative analysis.',
            careerOutcomes: 'Management Consultant, Business Operations Manager, Growth Lead'
          },
          {
            degree: 'B.A. (Hons) Economics / B.Sc. Financial Economics',
            specialization: 'Econometrics, Market Analytics & Quantitative Finance',
            whyFits: 'Applies numerical reasoning to macroeconomic modeling and investment strategies.',
            careerOutcomes: 'Economic Analyst, Investment Associate, Risk Specialist'
          },
          {
            degree: 'B.Sc. Finance & Quantitative Investment',
            specialization: 'Equity Research, Portfolio Management, Fintech',
            whyFits: 'Leverages numerical logic for high-frequency financial markets.',
            careerOutcomes: 'Equity Analyst, Portfolio Associate, Investment Banker'
          }
        ],
        colleges: {
          reach: ["Shri Ram College of Commerce (SRCC)", "IIM Indore (IPM Program)", "Shaheed Sukhdev College (SSCBS)", "St. Xavier's College, Kolkata"],
          fit: ["St. Xavier's College, Mumbai", "Christ University, Bangalore", "NMIMS (ASMSOC), Mumbai", "Loyola College, Chennai"],
          accessible: ["Symbiosis Centre for Management (SCMS)", "Hindu College, Delhi", "Mithibai College, Mumbai", "K.J. Somaiya, Mumbai"]
        },
        masters: [
          'Master of Business Administration (MBA - Finance / Strategy)',
          'M.Sc. in Finance & Investment Banking / Financial Engineering',
          'Chartered Accountant (CA) Final / CFA Charter',
          'M.Sc. in International Business & Global Supply Chain'
        ],
        careerOutcomes: [
          'Investment Banking Associate / Equity Analyst',
          'Management Consultant (McKinsey / BCG / Bain)',
          'Chief Financial Officer (CFO) Track / Corporate Controller',
          'Fintech Product Manager / Risk Strategist'
        ],
        skills: ['Financial Modeling & Valuation', 'Excel/SQL Data Analytics', 'Commercial Acumen', 'Corporate Governance', 'Strategic Pitching'],
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan', 'Deloitte / EY / PwC', 'McKinsey & Company', 'HDFC Bank Corporate'],
        milestone: 'Complete CA Foundation / IPMAT mock preparation and lead school entrepreneurship/commerce club activities.'
      };
      break;

    case 'PCB':
      data = {
        pathwayName,
        pathwayTitle: 'Science — Medical & Life Sciences Track (PCB)',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName} shows high scientific reasoning (${scores.aptitude.reasoning}%) paired with empathetic agreeableness (${scores.personality.agreeableness}%), creating a strong foundation for clinical medicine, biotechnology, and health sciences.`,
        foundation: {
          subjects: ['Physics & Biophysics', 'Chemistry & Organic Synthesis', 'Biology & Genetics', 'Psychology / Biotechnology', 'English Communication'],
          exams: ['NEET-UG (Medical Entrance)', 'CUET-UG (Biological Sciences)', 'IISER Aptitude Test (IAT)', 'ICAR AIEEA (Biotech/Agri)', 'NEST (National Entrance Screening Test)'],
          curriculumFocus: 'Focus on biological comprehension, organic chemical structures, diagnostic logic, and experimental lab protocols.'
        },
        bachelors: [
          {
            degree: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
            specialization: 'General Medicine, Diagnostic Pathology, Surgical Foundations',
            whyFits: `Directly leverages ${firstName}'s scientific logic and patient care dedication.`,
            careerOutcomes: 'Physician, Clinical Specialist, Diagnostic Pathologist'
          },
          {
            degree: 'B.Sc. (Hons) Biomedical Science / Biochemistry',
            specialization: 'Molecular Biology, Human Genetics, Immunology',
            whyFits: 'Ideal for research-driven medical innovation and biopharmaceutical discovery.',
            careerOutcomes: 'Biomedical Researcher, Genetic Counselor, Clinical Lab Director'
          },
          {
            degree: 'B.Pharm / Pharm.D (Pharmacy & Clinical Pharmacology)',
            specialization: 'Drug Formulation, Clinical Trials, Pharmacovigilance',
            whyFits: 'Combines chemistry expertise with healthcare applications.',
            careerOutcomes: 'Pharmacologist, Clinical Trials Lead, Drug Regulatory Analyst'
          },
          {
            degree: 'B.Sc. Biotechnology & Clinical Research',
            specialization: 'Genomic Engineering, Bioinformatics, Bioprocess Engineering',
            whyFits: 'Applies technology and data analysis to biological discovery.',
            careerOutcomes: 'Biotech Scientist, Bioinformatics Analyst, R&D Manager'
          }
        ],
        colleges: {
          reach: ["AIIMS, New Delhi", "Christian Medical College (CMC), Vellore", "JIPMER, Puducherry", "IISc Bangalore (BS Biology)"],
          fit: ["Maulana Azad Medical College (MAMC)", "KMC Manipal", "St. John's Medical College, Bangalore", "IISER Pune / Kolkata"],
          accessible: ["Jamia Hamdard, New Delhi", "Amity Institute of Biotechnology", "MS Ramaiah Medical College", "SRM Life Sciences"]
        },
        masters: [
          'MD / MS (Medical Specialization in Cardiology / Oncology / Neurology)',
          'M.Sc. / Ph.D. in Human Genetics & Genomic Medicine',
          'Master of Public Health (MPH) / Healthcare Administration (MHA)',
          'M.Pharm / M.Tech in Bioprocess Engineering'
        ],
        careerOutcomes: [
          'Consultant Physician / Specialist Surgeon',
          'Biopharmaceutical R&D Scientist',
          'Genomic Diagnostics Lead',
          'Global Healthcare Director (WHO / Health Ministry)'
        ],
        skills: ['Clinical Diagnostics', 'Biomedical Lab Protocols', 'Genomic Sequence Analysis', 'Patient Empathy', 'Scientific Research Documentation'],
        targetCompanies: ['AIIMS Healthcare System', 'Biocon Biopharmaceuticals', 'Pfizer Global R&D', 'Apollo Hospitals Group', 'Dr. Reddy\'s Labs'],
        milestone: 'Complete NCERT Biology mastery, lab experiment logbook, and initial NEET/CUET mock diagnostic benchmarks.'
      };
      break;

    case 'PCM':
    default:
      data = {
        pathwayName,
        pathwayTitle: 'Science — Engineering & Technology Track (PCM)',
        pathwayRankLabel: rankLabel,
        fitScore,
        rationale: `${firstName}'s cognitive profile is characterized by strong spatial visualization (${scores.aptitude.spatial}%) and analytical reasoning (${scores.aptitude.reasoning}%), supporting high technical execution in engineering and computing fields.`,
        foundation: {
          subjects: ['Advanced Physics & Mechanics', 'Chemistry & Materials Science', 'Higher Mathematics & Calculus', 'Computer Science / IP', 'English Technical Writing'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT (BITS Pilani)', 'VITEEE / MET / MHT-CET', 'CUET-UG (Maths/Physics)', 'UCEED / NATA (For Design/Arch)'],
          curriculumFocus: 'Focus on mathematical problem solving, algorithmic thinking, physics principles, and software fundamentals.'
        },
        bachelors: [
          {
            degree: 'B.Tech / B.E. Computer Science & Artificial Intelligence',
            specialization: 'Machine Learning, Distributed Systems, Software Engineering',
            whyFits: `Aligns with ${firstName}'s high spatial and logical reasoning skills.`,
            careerOutcomes: 'Software Development Engineer (SDE), AI Engineer, Systems Architect'
          },
          {
            degree: 'B.Tech Electronics & Communication / Robotics',
            specialization: 'Embedded Systems, VLSI Design, Automation & IoT',
            whyFits: 'Combines hardware architecture with algorithmic software control.',
            careerOutcomes: 'Robotics Engineer, Hardware Architect, Embedded Systems Lead'
          },
          {
            degree: 'B.Sc. (Hons) Mathematics & Computing / Data Science',
            specialization: 'Quantitative Analytics, Algorithmic Optimization, Applied Math',
            whyFits: 'Applies pure mathematical rigor to high-speed computational data.',
            careerOutcomes: 'Data Scientist, Quantitative Analyst, Algorithm Specialist'
          },
          {
            degree: 'B.Arch / B.Tech Civil & Structural Engineering',
            specialization: 'Sustainable Urban Architecture, Computational Design',
            whyFits: 'Leverages high spatial visualization for physical and digital structures.',
            careerOutcomes: 'Structural Engineer, Computational Architect, Project Director'
          }
        ],
        colleges: {
          reach: ["IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani (Pilani Campus)"],
          fit: ["NIT Trichy", "Delhi Technological University (DTU)", "IIIT Hyderabad", "VIT Vellore"],
          accessible: ["Thapar Institute, Patiala", "Manipal Institute of Technology (MIT)", "SRM Institute, Chennai", "Jaypee Institute (JIIT)"]
        },
        masters: [
          'M.Tech / M.S. in Computer Science & Artificial Intelligence',
          'M.S. in Data Science & Machine Learning (Top Global Universities)',
          'Master of Business Administration (MBA - Technology Management)',
          'Ph.D. in Computational Physics / Robotics Systems'
        ],
        careerOutcomes: [
          'Senior Software Development Engineer (FAANG Tech)',
          'Artificial Intelligence & Machine Learning Architect',
          'Quantitative Strategist / Data Science Lead',
          'Chief Technology Officer (CTO) / Tech Entrepreneur'
        ],
        skills: ['Data Structures & Algorithms', 'Python / C++ Programming', 'Calculus & Linear Algebra', 'System Architecture', 'Technical Problem Solving'],
        targetCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Amazon Web Services', 'ISRO / DRDO'],
        milestone: 'Build a functional coding portfolio on GitHub, master Class 11 Physics/Math fundamentals, and achieve benchmark score in JEE Mains mocks.'
      };
      break;
  }

  // Adjust wording based on parent alignment if available
  if (comparisonData && comparisonData.overallIndicator.includes('Divergence')) {
    data.rationale += ` Note: Family discussion recommended to align career expectations with student capabilities.`;
  }

  return data;
}

// ─── 2. PERSONALIZED STUDY ABROAD GUIDE GENERATOR ────────────────────────────

export function getStudyAbroadGuideData(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): StudyAbroadGuideData {
  const firstName = student.name.split(' ')[0];
  const primaryFit = scores.careerFitment[0]?.name || 'STEM';
  const category = getPathwayCategory(primaryFit);

  let rationale = '';
  let countries: StudyAbroadCountry[] = [];
  let scholarships: string[] = [];
  let programs: string[] = [];

  // Determine parent openness & financial alignment labels
  const parentOpennessLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Exposure') || a.name.includes('Environment'))?.level.toUpperCase() || 'MODERATE ALIGNMENT'
    : 'EXPLORATORY ALIGNMENT';

  const financialAlignmentLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Financial') || a.name.includes('Investment'))?.level.toUpperCase() || 'BALANCED FEASIBILITY'
    : 'SCHOLARSHIP-PREFERABLE';

  switch (category) {
    case 'HUMANITIES':
      rationale = `${firstName}'s strong verbal analytical capacity (${scores.aptitude.verbal}%) and creative openness position them exceptionally well for international universities offering holistic, interdisciplinary liberal arts, psychology, and design curricula.`;
      countries = [
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'Home to historic humanities institutions (Oxford, Cambridge, UCL, LSE) offering world-leading law, psychology, and public policy degrees with 2-year post-study work visas.',
          academicRoute: '3-Year B.A. (Hons) / 1-Year Master\'s',
          costCategory: 'Moderate to High (Scholarships Available)'
        },
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Pioneer of the Liberal Arts system. Top colleges (Ashoka partners, Ivy League, Seven Sisters) offer flexible double majors combining psychology, economics, and design.',
          academicRoute: '4-Year B.A. / B.S. (Holistic Admission)',
          costCategory: 'High (Need-Based Financial Aid Available)'
        },
        {
          flag: '🇸🇬',
          name: 'Singapore',
          reason: 'Asia\'s premier education hub. NUS and Yale-NUS offer global liberal arts and international relations degrees close to India with strong Asian market access.',
          academicRoute: '3 to 4-Year Undergraduate Degree',
          costCategory: 'Moderate (Tuition Grant Scheme Available)'
        }
      ];
      scholarships = [
        'Chevening Undergraduate / Master\'s Scholarships (UK)',
        'Commonwealth Scholarship Scheme (UK & Canada)',
        'Fulbright-Nehru & US College Merit Aid Grants',
        'SINGA / NUS International Student Financial Grant'
      ];
      programs = [
        'B.A. in Psychology & Cognitive Science (UK / US)',
        'B.Des in Human-Computer Interaction & User Experience',
        'B.A. in Politics, Philosophy & Economics (PPE)',
        'LL.B. / LL.M. in International Corporate & Commercial Law'
      ];
      break;

    case 'COMMERCE':
      rationale = `${firstName}'s numerical logic and structured goal-execution profile make studying business, finance, or economics abroad a high-ROI pathway, providing direct exposure to global financial hubs.`;
      countries = [
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Home to Wall Street and global tech ecosystems. US business programs (Wharton, NYU Stern) offer STEM-designated finance degrees with 3-year OPT work permits.',
          academicRoute: '4-Year BBA / B.Sc. Finance (STEM OPT)',
          costCategory: 'High (Merit Scholarships Available)'
        },
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'London is a global financial center. LSE, Imperial, and King\'s College offer premier business, economics, and quantitative finance degrees with direct corporate recruiting.',
          academicRoute: '3-Year B.Sc. Finance / 1-Year M.Sc.',
          costCategory: 'Moderate to High'
        },
        {
          flag: '🇨🇦',
          name: 'Canada',
          reason: 'Renowned business schools (U of Toronto Rotman, UBC Sauder) with co-op work terms offering direct industry placement and post-graduation work permits (PGWP).',
          academicRoute: '4-Year BBA / B.Com with Co-op Terms',
          costCategory: 'Moderate (Affordable Public Tuition)'
        }
      ];
      scholarships = [
        'Ontario Graduate & Undergraduate Merit Grants (Canada)',
        'LSE International Student Financial Aid (UK)',
        'US University Trustee & Dean\'s Merit Scholarships',
        'Erasmus Mundus Joint Master Scholarships (Europe)'
      ];
      programs = [
        'B.Sc. in Financial Economics & Investment Banking',
        'BBA / Bachelor of Commerce in Global Supply Chain',
        'M.Sc. in Quantitative Finance & Fintech',
        'MBA (Global Executive / International Track)'
      ];
      break;

    case 'PCB':
      rationale = `${firstName} can access state-of-the-art clinical laboratories, advanced biopharmaceutical research, and globally recognized medical accreditations by exploring international life sciences programs.`;
      countries = [
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'World leader in biotechnology and medical innovation. Johns Hopkins, Harvard, and UC Berkeley offer elite pre-med, biochemistry, and biomedical research degrees.',
          academicRoute: '4-Year Pre-Med B.Sc. -> 4-Year MD / Ph.D.',
          costCategory: 'High (Research Grants Available)'
        },
        {
          flag: '🇬🇧',
          name: 'United Kingdom',
          reason: 'Oxford, Cambridge, and UCL provide top-tier clinical medicine, genetics, and pharmaceutical science degrees with direct access to NHS clinical trials.',
          academicRoute: '5-Year MBBS / 3-Year B.Sc. Biomedical',
          costCategory: 'Moderate to High'
        },
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Public universities offer world-class, tuition-free degrees in medicine, biotechnology, and molecular biology with strong research lab partnerships.',
          academicRoute: '6-Year Medical Degree / 3-Year B.Sc. (Free Tuition)',
          costCategory: 'Low (Tuition-Free Public Universities)'
        }
      ];
      scholarships = [
        'DAAD Scholarship for Masters & Medicine in Germany',
        'Johns Hopkins Biomedical Research Fellowship',
        'Commonwealth Medical & Healthcare Scholarship',
        'Gates Cambridge International Scholarship'
      ];
      programs = [
        'B.Sc. in Biomedical Science & Molecular Genetics',
        'Pre-Medicine Track / Doctor of Medicine (MD)',
        'M.Sc. in Biotechnology & Bioprocess Engineering',
        'Master of Public Health (MPH - Global Health Track)'
      ];
      break;

    case 'PCM':
    default:
      rationale = `${firstName}'s spatial visualization and computational logic make international STEM programs (US Silicon Valley, German engineering hubs, UK tech corridors) exceptional springboards for global technology careers.`;
      countries = [
        {
          flag: '🇺🇸',
          name: 'United States',
          reason: 'Silicon Valley remains the global capital of tech innovation. MIT, Stanford, and Carnegie Mellon offer STEM degrees with 3-year OPT work permits at FAANG tech firms.',
          academicRoute: '4-Year B.S. CS / Engineering (3-Yr OPT)',
          costCategory: 'High (Merit & Research Assistantships)'
        },
        {
          flag: '🇩🇪',
          name: 'Germany',
          reason: 'Europe\'s engineering powerhouse. Public universities like TU Munich and RWTH Aachen offer world-leading, tuition-free computer science and engineering degrees.',
          academicRoute: '3.5-Year B.Sc. Engineering (Tuition-Free)',
          costCategory: 'Low (Tuition-Free Public Universities)'
        },
        {
          flag: '🇮🇪',
          name: 'Ireland',
          reason: 'Dublin is Europe\'s tech hub housing Google, Meta, and Stripe EMEA headquarters, providing 2-year post-study work visas for software developers.',
          academicRoute: '3 to 4-Year B.Sc. Computer Science',
          costCategory: 'Moderate'
        }
      ];
      scholarships = [
        'Generation Google APAC / EMEA Tech Scholarship',
        'DAAD Engineering Scholarship (Germany)',
        'Government of Ireland International Education Scholarship',
        'US College Dean\'s Merit Engineering Grant'
      ];
      programs = [
        'B.S. / M.S. in Computer Science (Artificial Intelligence)',
        'B.Sc. in Robotics & Intelligent Autonomous Systems',
        'B.Eng in Electronics & Microcommunication',
        'M.Sc. in Data Science & Machine Learning Systems'
      ];
      break;
  }

  return {
    rationale,
    fitmentSummary: `Targeting global education pathways in ${countries.map(c => c.name).join(', ')} aligned with ${primaryFit}.`,
    parentOpennessLabel,
    financialAlignmentLabel,
    countries,
    scholarships,
    programs
  };
}

// ─── 3. ACADEMIC & PROFILE ROADMAP TIMELINE GENERATOR ───────────────────────

export function getAcademicProfileRoadmapData(
  student: EditorialStudent,
  scores: EditorialScores
): AcademicStage[] {
  const primaryFit = scores.careerFitment[0]?.name || 'Target Pathway';

  return [
    {
      phase: 'STAGE 1',
      label: 'Class 10 (Current Foundation)',
      icon: '🎯',
      academicGoal: 'Achieve 85%+ in Board Examinations; solidify Math, Science & English fundamentals.',
      profileGoal: 'Finalize Class 11 stream selection based on psychometric evidence & family alignment.',
      keySkills: ['Time Management', 'Self-Assessment', 'Foundational Logic'],
      milestone: 'Complete Class 10 Board Exams & Lock Class 11 Subject Stream Choice.'
    },
    {
      phase: 'STAGE 2',
      label: 'Class 11–12 (Specialization & Exams)',
      icon: '📚',
      academicGoal: 'Master Class 11–12 core syllabus and prepare targeted entrance exams (CUET / JEE / NEET / IPMAT).',
      profileGoal: 'Build extracurricular profile: leadership roles, Olympiads, and summer projects.',
      keySkills: ['Exam Strategy', 'Advanced Problem Solving', 'Consistency'],
      milestone: 'Achieve Top Percentile in Target Entrance Exams & Secure University Admission.'
    },
    {
      phase: 'STAGE 3',
      label: 'Bachelor\'s Degree (Years 1–2)',
      icon: '🎓',
      academicGoal: 'Maintain high Cumulative GPA (8.0+/10) in core undergraduate coursework.',
      profileGoal: 'Join campus technical/literary clubs, participate in hackathons/case competitions, and secure Year-2 summer internship.',
      keySkills: ['Domain Fundamentals', 'Networking', 'Project Execution'],
      milestone: 'Complete First Industry/Research Internship & Build Project Portfolio.'
    },
    {
      phase: 'STAGE 4',
      label: 'Bachelor\'s Specialization (Years 3–4)',
      icon: '🚀',
      academicGoal: 'Execute final-year capstone research thesis / major industry design project.',
      profileGoal: 'Secure Tier-1 campus placement or apply for top global Master\'s programs.',
      keySkills: ['Advanced Domain Tools', 'Portfolio Defense', 'Interview Readiness'],
      milestone: 'Graduate with Honors & Secure Placement Offer / Master\'s Admission.'
    },
    {
      phase: 'STAGE 5',
      label: 'Early Career Entry (Years 1–3 Post-Grad)',
      icon: '💼',
      academicGoal: 'Gain hands-on industry experience; pursue professional certifications (CFA / PMP / AWS / Clinical Board).',
      profileGoal: 'Demonstrate measurable impact in target organization; build professional network.',
      keySkills: ['Industry Expertise', 'Cross-Functional Collaboration', 'Leadership'],
      milestone: 'Promoted to Senior Role / Transition to Specialized Global Practice.'
    },
    {
      phase: 'STAGE 6',
      label: 'Advanced Master\'s / Global Leadership',
      icon: '🌍',
      academicGoal: 'Pursue Executive MBA / Specialist M.S. at top international university if desired.',
      profileGoal: 'Establish subject-matter authority and lead high-impact industry or societal initiatives.',
      keySkills: ['Strategic Vision', 'Global Management', 'Innovation'],
      milestone: 'Achieve Industry Leadership / Executive Role in Chosen Career Field.'
    }
  ];
}

// ─── 4. STUDENT ACTION PLAN GENERATOR ───────────────────────────────────────

export function getStudentActionPlanData(
  student: EditorialStudent,
  scores: EditorialScores
): StudentActionPlanData {
  const firstName = student.name.split(' ')[0];
  const topVarkLabel = 
    scores.topVark === 'V' ? 'Visual (Mind Maps & Diagrams)' :
    scores.topVark === 'A' ? 'Auditory (Discussion & Audio Recaps)' :
    scores.topVark === 'R' ? 'Reading/Writing (Structured Notes & Summaries)' : 'Kinesthetic (Hands-on Practice & Simulations)';

  return {
    thisMonth: [
      `Review Class 10 Board exam preparation gaps in weak chapters using ${topVarkLabel} techniques.`,
      `Finalize stream preference (Primary: ${scores.careerFitment[0]?.name || 'Selected Track'}) with family and counsellor.`,
      'Establish a distraction-free daily study routine with 3-hour focused deep work blocks.',
      'Research syllabus and eligibility criteria for top target entrance examinations.'
    ],
    next90Days: [
      'Complete Board examination revision cycles with minimum 5 full-length mock papers.',
      'Attend school stream counselling session with official psychometric report copy.',
      'Begin introductory foundation reading/coursework for selected Class 11 stream subjects.',
      'Organize all academic certificates, extracurricular achievements, and awards into a digital portfolio.'
    ],
    thisAcademicYear: [
      'Secure 85%+ in Class 10 Board examinations.',
      'Transition smoothly into Class 11 stream with structured weekly revision timetables.',
      'Join at least 2 relevant school clubs (e.g. Science/Coding, Debate, Commerce/Business Club).',
      'Set baseline benchmark scores in entrance exam diagnostic tests.'
    ],
    skillsToBuild: [
      `Analytical Problem Solving (${scores.aptitude.overall}% current cognitive baseline)`,
      `Conscientious Time Management (${scores.personality.conscientiousness}% current execution score)`,
      `Emotional Resilience Under Exam Conditions (${scores.personality.emotionalStability}% stability score)`,
      `${topVarkLabel} Learning Optimization`,
      'Effective Written & Verbal Communication'
    ],
    counsellorCheckpoint: [
      `Validate alignment between ${firstName}'s primary preference and parent expectations.`,
      'Review Class 11 school choices and subject combination availability (e.g. Math vs. Applied Math).',
      'Formulate coaching/preparation strategy for competitive entrance exams.'
    ],
    studentAction: [
      'Take complete ownership of daily study schedule and track weekly goal completion.',
      'Engage in proactive weekly discussions with parents regarding academic progress.',
      'Maintain balance between academic rigor, physical health, and adequate sleep.'
    ]
  };
}
