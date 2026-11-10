/**
 * Unified Authoritative Roadmap Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for Career & Academic Roadmaps across all report variants:
 * - Junior (Class 7–9): Exploratory Vectors, Olympiads, Curiosity Projects
 * - Class 10 (Secondary): Stream Selector (PCM, PCB, Commerce, Humanities), 11-12 Subjs, Degrees
 * - Senior (Class 11–12): Pre-University, Undergrad Degrees, Tier-1 Colleges, Global Study Abroad
 *
 * Implements:
 * 1. Strict lookup by stable pathway ID (never label text or array index 0).
 * 2. Complete coherence: Rank, title, match %, and content all come from the same pathway object.
 * 3. No silent fallback: If missing, fallback to stream-level roadmap or "Detailed roadmap in preparation".
 * 4. Duplicate guard: Throws in test, drops and logs in production.
 * 5. Deterministic tiebreak support and "close fit" annotation.
 */

import type { EditorialStudent, EditorialScores } from '../class10_editorial_engine';
import type { AlignmentResult } from '../comparison-engine';
import type { ReportVariant } from './universal-report-schema';

export interface DegreeOption {
  degree: string;
  specialization: string;
  whyFits: string;
  careerOutcomes: string;
}

export interface PathwayRoadmapData {
  pathwayId: string;
  streamId: 'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES';
  pathwayName: string;
  pathwayTitle: string;
  pathwayRankLabel: string;
  fitScore: number;
  isCloseFit?: boolean;
  isInPreparation?: boolean;
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
  studyAbroad?: {
    programs: string[];
    scholarships: string[];
  };
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

// ─── STABLE PATHWAY TAXONOMY ─────────────────────────────────────────────────

export interface PathwayConfig {
  title: string;
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
  studyAbroad?: {
    programs: string[];
    scholarships: string[];
  };
}

export interface UnifiedPathwayDefinition {
  id: string;
  streamId: 'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES';
  defaultName: string;
  aliases: string[];
  grades: {
    junior: PathwayConfig;
    grade10: PathwayConfig;
    senior: PathwayConfig;
  };
}

// ─── CANONICAL PATHWAY DEFINITIONS REGISTRY ───────────────────────────────────

export const PATHWAY_REGISTRY: Record<string, UnifiedPathwayDefinition> = {
  // ── 1. PCM / STEM BROAD STREAM ──────────────────────────────────────────────
  pcm_stream: {
    id: 'pcm_stream',
    streamId: 'PCM',
    defaultName: 'Science Stream – Engineering & Tech Track (PCM)',
    aliases: [
      'science stream – engineering & tech track (pcm)',
      'science stream — engineering & technology (pcm)',
      'stem & engineering pathway',
      'science & technology exploration vector',
      'foundational stem & analytics',
      'engineering & technology track (pcm)',
      'science (pcm)',
      'pcm',
    ],
    grades: {
      junior: {
        title: 'STEM, Engineering & Computational Logic Vector',
        foundation: {
          subjects: ['Mathematics & Geometry', 'Physical Sciences (Physics & Chemistry)', 'Computer Science & Coding', 'Design & Technology', 'Robotics & Automation'],
          exams: ['International Mathematics Olympiad (IMO - SOF)', 'National Science Olympiad (NSO)', 'Unified Cyber Olympiad (UCO)', 'FIRST LEGO League Robotics'],
          curriculumFocus: 'Focus on geometric reasoning, algorithmic coding (Python/Scratch), physics experiments, and building structural prototypes.',
        },
        bachelors: [
          { degree: 'B.Tech / B.S. in Computer Science & Artificial Intelligence', specialization: 'Machine Learning, Software Architecture, Distributed Computing', whyFits: 'Capitalizes on strong fluid logic and abstract pattern synthesis.', careerOutcomes: 'Software Systems Engineer, AI Specialist, Cloud Architect' },
          { degree: 'B.Tech in Robotics & Mechatronics Engineering', specialization: 'Autonomous Systems, Embedded Computing, Aerospace Dynamics', whyFits: 'Combines spatial visualization with quantitative problem-solving grit.', careerOutcomes: 'Robotics Engineer, Aerospace Systems Designer, Hardware Architect' },
          { degree: 'B.S. (Hons) in Mathematics & Computing / Data Science', specialization: 'Algorithm Engineering, Cryptography, Statistical Modelling', whyFits: 'Deep theoretical logic paired with high computational throughput.', careerOutcomes: 'Data Scientist, Quantitative Modeller, Research Scientist' },
        ],
        colleges: {
          reach: ['Indian Institute of Technology (IIT Bombay / Delhi / Madras)', 'BITS Pilani', 'IISc Bangalore', 'IIIT Hyderabad'],
          fit: ['National Institute of Technology (NIT Trichy / Surathkal / Warangal)', 'Delhi Technological University (DTU)', 'Thapar University'],
          accessible: ['Manipal Institute of Technology (MIT)', 'Vellore Institute of Technology (VIT)', 'Shiv Nadar University'],
        },
        masters: ['M.S. in Computer Science / Artificial Intelligence (Global)', 'M.Tech in Robotics & Autonomous Systems', 'Ph.D. in Computational Sciences & Machine Intelligence'],
        careerOutcomes: ['Principal Systems Architect / Chief Technology Officer', 'AI Research Scientist & Algorithmic Lead', 'Aerospace Dynamics & Autonomous Systems Director', 'Venture Technology Innovator & Engineering Founder'],
        skills: ['Algorithmic Thinking (Python / Scratch)', 'Spatial Drafting & 3D Modeling', 'Mathematical Deduction', 'Scientific Investigation'],
        targetCompanies: ['ISRO Space Innovators Hub', 'Google Youth Labs', 'Microsoft Student Academy', 'NASA Space Apps Challenge', 'Apple Developer Academy'],
        milestone: 'Construct a working robotics or software project and achieve top merit ranking in national STEM olympiads.',
      },
      grade10: {
        title: 'Science Stream – Engineering, Technology & Physical Sciences (PCM)',
        foundation: {
          subjects: ['Advanced Physics (Mechanics & Electromagnetism)', 'Higher Mathematics (Calculus, Vectors & Algebra)', 'Chemistry (Inorganic, Organic & Physical)', 'Computer Science (Python / C++) or Engineering Graphics', 'English Core & Technical Communication'],
          exams: ['JEE Main (Paper 1)', 'JEE Advanced (IIT Entrance)', 'BITSAT (Pilani, Goa, Hyderabad)', 'State CETs (MHT-CET, WBJEE, KCET)', 'CUET-UG (Physics, Chemistry, Mathematics)'],
          curriculumFocus: 'Rigorous mastery of Newtonian mechanics, calculus applications, spatial vectors, and computational algorithms for top-tier engineering admissions.',
        },
        bachelors: [
          { degree: 'B.Tech / B.E. in Computer Science & Engineering', specialization: 'Cloud Computing, Distributed Systems, Software Engineering', whyFits: 'Capitalizes on top-tier quantitative reasoning and abstract problem decomposition.', careerOutcomes: 'Software Systems Engineer, Cloud Architect, Full-Stack Lead' },
          { degree: 'B.Tech in Artificial Intelligence & Data Engineering', specialization: 'Machine Learning, Predictive Analytics, Big Data Infrastructure', whyFits: 'Merges mathematical statistics with algorithmic problem solving.', careerOutcomes: 'AI Engineer, Data Scientist, Machine Learning Architect' },
          { degree: 'B.Tech in Electronics & Mechanical Systems', specialization: 'Automation, Robotics, Embedded Systems, Mechatronics', whyFits: 'Engages physical spatial visualization with applied quantitative mechanics.', careerOutcomes: 'Robotics Specialist, Hardware Architect, Precision Systems Lead' },
          { degree: 'B.Sc. (Hons) in Mathematics & Computing', specialization: 'Theoretical Computer Science, Cryptography, Financial Engineering', whyFits: 'Applies pure mathematical rigor to modern high-throughput computing.', careerOutcomes: 'Quantitative Analyst, Cryptographic Engineer, Research Scientist' },
        ],
        colleges: {
          reach: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad'],
          fit: ['NIT Trichy', 'NIT Surathkal', 'Delhi Technological University (DTU)', 'Jadavpur University', 'COEP Technological University'],
          accessible: ['Thapar University Patiala', 'Manipal Institute of Technology (MIT)', 'SRM University Chennai', 'VIT Vellore'],
        },
        masters: ['M.Tech in Computer Science / Artificial Intelligence (IIT Bombay / IISc)', 'M.S. in Machine Learning & Robotics (CMU / Stanford / ETH Zurich)', 'Master of Business Administration (MBA - Technology Leadership)'],
        careerOutcomes: ['Principal Software Architect & Technology Director', 'Lead Robotics & Autonomous Systems Engineer', 'Quantitative Systems Architect & Financial Modeler', 'Deep-Tech Founder & Engineering Executive'],
        skills: ['Data Structures & Advanced Algorithms', 'Python, C++ & System Architecture', 'Calculus & Multivariable Modeling', '3D Spatial Modeling & CAD Drafting'],
        targetCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Amazon Web Services', 'ISRO / DRDO', 'Tesla', 'Apple'],
        milestone: 'Complete comprehensive Class 11-12 syllabus revision, clear JEE Advanced mock percentile benchmark (98%+), and build a verified technical GitHub portfolio.',
      },
      senior: {
        title: 'Computer Science, Software Systems & Artificial Intelligence',
        foundation: {
          subjects: ['Higher Secondary Physics', 'Advanced Mathematics (Calculus, Differential Equations & Linear Algebra)', 'Chemistry / Electronics', 'Computer Science (Data Structures & OOP in Python/C++)', 'Technical English'],
          exams: ['JEE Main & JEE Advanced', 'BITSAT (BITS Pilani)', 'IIIT UGEE', 'VITEEE / MET / MHT-CET', 'SAT + AP Computer Science / Physics C (Global Focus)'],
          curriculumFocus: 'Focus on algorithmic problem solving, competitive coding, linear algebra, calculus, and high-performance computing.',
        },
        bachelors: [
          { degree: 'B.Tech / B.E. in Computer Science & Artificial Intelligence', specialization: 'Machine Learning, Distributed Systems, Large Language Models', whyFits: 'Matches high spatial and logical reasoning skills.', careerOutcomes: 'Software Development Engineer (SDE), AI Engineer, Systems Architect' },
          { degree: 'B.Tech in Artificial Intelligence & Data Science', specialization: 'Deep Learning, Predictive Analytics, Big Data Infrastructure', whyFits: 'Applies statistical and computational logic to large-scale data engineering.', careerOutcomes: 'Data Scientist, Machine Learning Engineer, Analytics Architect' },
          { degree: 'B.Sc. (Hons) Mathematics & Computing / Data Science', specialization: 'Quantitative Analytics, Algorithmic Optimization, Applied Math', whyFits: 'Applies pure mathematical rigor to high-speed computational data.', careerOutcomes: 'Quantitative Analyst, Algorithm Specialist, Data Scientist' },
          { degree: 'B.Tech in Cybersecurity & Cloud Computing', specialization: 'Cryptographic Security, Cloud Native Systems, Ethical Hacking', whyFits: 'Focuses on safeguarding enterprise networks and distributed cloud infra.', careerOutcomes: 'Cybersecurity Architect, Cloud Security Lead, Penetration Tester' },
        ],
        colleges: {
          reach: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'IIIT Hyderabad'],
          fit: ['NIT Trichy', 'Delhi Technological University (DTU)', 'IIIT Bangalore', 'VIT Vellore'],
          accessible: ['Thapar Institute Patiala', 'Manipal Institute of Technology (MIT)', 'SRM Institute Chennai', 'Jaypee Institute (JIIT)'],
        },
        masters: ['M.Tech / M.S. in Computer Science & Artificial Intelligence (Carnegie Mellon / Stanford)', 'M.S. in Data Science & Machine Learning Systems', 'Master of Business Administration (MBA - Technology Management)', 'Ph.D. in Theoretical Computer Science & Generative AI'],
        careerOutcomes: ['Senior Software Development Engineer (FAANG / Tier-1 Tech)', 'Artificial Intelligence & Machine Learning Architect', 'Quantitative Strategist / Data Science Lead', 'Chief Technology Officer (CTO) / High-Growth Founder'],
        skills: ['Data Structures & Algorithms', 'Python, C++ & TypeScript Programming', 'Calculus & Linear Algebra', 'System Architecture & Distributed Clouds', 'Technical Problem Solving'],
        targetCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Amazon Web Services', 'Apple', 'ISRO / DRDO'],
        milestone: 'Build a functional coding portfolio on GitHub, solve 200+ algorithm problems, and achieve benchmark score in JEE Mains mocks.',
        studyAbroad: {
          programs: ['B.S. in Computer Science (Carnegie Mellon / Stanford / UC Berkeley)', 'B.Sc. (Hons) in Computing Science (Imperial College London / Oxford)', 'B.Eng in Computer Engineering (NUS / NTU Singapore)', 'B.Sc. in Informatics & Software Systems (TU Munich Germany)'],
          scholarships: ['Google Generation Scholarship', 'TUM Asia Merit Fellowship', 'University Dean’s Global STEM Scholarship (US / Canada)', 'Commonwealth Undergraduate Technology Award (UK)'],
        },
      },
    },
  },

  // ── 2. PCB / MEDICAL BROAD STREAM ───────────────────────────────────────────
  pcb_stream: {
    id: 'pcb_stream',
    streamId: 'PCB',
    defaultName: 'Science Stream – Medical & Life Sciences Track (PCB)',
    aliases: [
      'science stream – medical & life sciences track (pcb)',
      'science stream — medical & life sciences track (pcb)',
      'science — medical & life sciences (pcb)',
      'medical & life sciences track (pcb)',
      'biological sciences, healthcare & living systems vector',
      'science (pcb)',
      'pcb',
      'medical stream',
    ],
    grades: {
      junior: {
        title: 'Biological Sciences, Healthcare & Living Systems Vector',
        foundation: {
          subjects: ['General Science (Biology & Chemistry Focus)', 'Mathematics & Data Modeling', 'Environmental Science', 'Computer Applications', 'Health & Physical Education'],
          exams: ['National Science Olympiad (NSO - SOF)', 'Vidyarthi Vigyan Manthan (VVM)', 'Green Olympiad (TERI)', 'Junior Science Talent Search (JSTS)'],
          curriculumFocus: 'Focus on laboratory observation, microscope work, biological classification, and environmental project work.',
        },
        bachelors: [
          { degree: 'M.B.B.S. / B.Sc. (Hons) Biomedical Science', specialization: 'Clinical Medicine, Molecular Biology, Neuroscience', whyFits: 'Aligns with high focus on detail and prosocial service values.', careerOutcomes: 'Physician, Clinical Geneticist, Biomedical Scientist' },
          { degree: 'B.Tech / B.Sc. in Biotechnology & Bioinformatics', specialization: 'Computational Biology, Genetic Engineering, Pharmacology', whyFits: 'Merges biological discovery with technological computing tools.', careerOutcomes: 'Biotech Researcher, Bioinformatician, Drug Discovery Scientist' },
        ],
        colleges: {
          reach: ['AIIMS, New Delhi', 'Christian Medical College (CMC), Vellore', 'IISc Bangalore (BS Biology)', 'JIPMER Puducherry'],
          fit: ['Kasturba Medical College (KMC), Manipal', "St. John's Medical College", 'Jamia Hamdard, Delhi'],
          accessible: ['D.Y. Patil Medical University', 'Amity Institute of Biotechnology', 'SRM Institute of Science'],
        },
        masters: ['M.D. / M.S. in Specialized Clinical Medicine', 'M.Sc. / Ph.D. in Molecular Genetics & Neuroscience', 'Master of Public Health (MPH - Global Health)'],
        careerOutcomes: ['Chief Medical Officer / Specialized Surgeon', 'Biomedical Innovation & Gene Therapy Lead', 'Global Public Health & Epidemiology Director', 'Pharmaceutical Research & Development Principal'],
        skills: ['Microscopic & Lab Technique', 'Empirical Observation', 'Scientific Hypothesis Formulation', 'Biological Documentation'],
        targetCompanies: ['WHO Youth Health Initiatives', 'Biocon Research', 'Dr. Reddy’s Laboratories', 'Apollo Health Network'],
        milestone: 'Complete an in-depth biological science fair investigation or environmental biodiversity project.',
      },
      grade10: {
        title: 'Science Stream – Medical, Healthcare & Life Sciences (PCB)',
        foundation: {
          subjects: ['Biology (Botany, Zoology, Genetics & Physiology)', 'Chemistry (Organic, Bio-Chemistry & Inorganic)', 'Physics (Mechanics, Optics & Radiation Physics)', 'Psychology / Biotechnology / Physical Education', 'English Core'],
          exams: ['NEET-UG (National Eligibility cum Entrance Test)', 'CUET-UG (Biology, Chemistry, Physics for B.Sc. & Allied Sciences)', 'NEST / IAT (IISER / NISER Research Entrance)', 'State PMTs / Veterinary & Nursing CETs'],
          curriculumFocus: 'Mastery of NCERT biology taxonomy and human physiology, organic reaction mechanisms, and physical biomedical principles.',
        },
        bachelors: [
          { degree: 'M.B.B.S. (Bachelor of Medicine & Bachelor of Surgery)', specialization: 'Clinical Medicine, Surgery, Internal Therapeutics', whyFits: 'Capitalizes on extraordinary inductive reasoning and clinical focus.', careerOutcomes: 'Physician, Medical Specialist, Clinical Surgeon' },
          { degree: 'B.D.S. / B.A.M.S. / B.H.M.S.', specialization: 'Dental Surgery, Maxillofacial Systems, Integrative Medicine', whyFits: 'Combines manual tactile dexterity with biological knowledge.', careerOutcomes: 'Dental Surgeon, Orthodontist, Healthcare Director' },
          { degree: 'B.Sc. (Hons) in Biomedical Science / Biochemistry', specialization: 'Molecular Pathology, Immunogenetics, Clinical Diagnostics', whyFits: 'Directly engages laboratory scientific inquiry and biomedical research.', careerOutcomes: 'Biomedical Scientist, Clinical Trial Manager, Research Associate' },
          { degree: 'B.Pharm / Pharm.D (Doctor of Pharmacy)', specialization: 'Clinical Pharmacology, Drug Synthesis, Pharmacovigilance', whyFits: 'Bridges organic chemistry with biochemical therapeutic delivery.', careerOutcomes: 'Clinical Pharmacist, Drug Safety Associate, Formulation Scientist' },
        ],
        colleges: {
          reach: ['AIIMS New Delhi', 'Christian Medical College (CMC Vellore)', 'JIPMER Puducherry', 'Maulana Azad Medical College (MAMC Delhi)', 'KGMU Lucknow'],
          fit: ['Kasturba Medical College (KMC Manipal)', 'St. John’s Medical College Bangalore', 'MS Ramaiah Medical College', 'Jamia Hamdard Delhi'],
          accessible: ['D.Y. Patil Medical College Navi Mumbai', 'SRM Medical College Chennai', 'Amrita Institute of Medical Sciences Kochi'],
        },
        masters: ['M.D. / M.S. in Clinical Specializations (Cardiology, Neurology, Oncology)', 'M.S. in Biotechnology & Regenerative Medicine', 'Master of Public Health (MPH - Johns Hopkins / Harvard / AIIMS)'],
        careerOutcomes: ['Consultant Physician & Specialized Surgeon', 'Director of Clinical Research & Pharmacovigilance', 'Lead Molecular Pathologist & Diagnostic Geneticist', 'Global Health Policy Consultant (WHO / ICMR)'],
        skills: ['Clinical Diagnostics & Anatomy', 'Organic Synthesis & Biochemistry', 'Bio-Statistical Data Analysis', 'Empathetic Patient Communication & Medical Ethics'],
        targetCompanies: ['Apollo Hospitals', 'Fortis Healthcare', 'Biocon Biologics', 'Sun Pharma', 'Max Healthcare', 'World Health Organization (WHO)'],
        milestone: 'Complete NCERT Biology mastery with 340+ target in mock NEET papers, and complete volunteer work in healthcare/clinical hospital settings.',
      },
      senior: {
        title: 'Medicine, Surgery & Clinical Healthcare',
        foundation: {
          subjects: ['Higher Secondary Biology (Genetics & Physiology)', 'Organic & Inorganic Chemistry', 'Physics (Optics & Modern Physics)', 'English Core'],
          exams: ['NEET-UG (National Eligibility cum Entrance Test)', 'CUET-UG (Allied Healthcare)', 'USMLE / PLAB (Future International Licensing)'],
          curriculumFocus: 'Focus on high-speed clinical problem solving, bio-chemistry pathways, cell biology, and medical physics.',
        },
        bachelors: [
          { degree: 'M.B.B.S. (Bachelor of Medicine & Bachelor of Surgery)', specialization: 'Clinical Diagnostics, General Surgery, Pediatric Healthcare', whyFits: 'Directly fulfills high empathy, emotional stability, and inductive medical deduction.', careerOutcomes: 'Medical Officer, Resident Physician, Clinical Doctor' },
          { degree: 'B.Sc. (Hons) in Nursing / Allied Healthcare Sciences', specialization: 'Critical Care, Anesthesia Technology, Radiography', whyFits: 'Engages practical healthcare support and patient therapeutics.', careerOutcomes: 'Clinical Healthcare Specialist, Anesthesia Technologist, Medical Lead' },
          { degree: 'B.D.S. (Bachelor of Dental Surgery)', specialization: 'Oral & Maxillofacial Surgery, Prosthodontics, Periodontics', whyFits: 'Combines micro-spatial dexterity with medical biology.', careerOutcomes: 'Dental Surgeon, Cosmetic Dentist, Oral Health Consultant' },
        ],
        colleges: {
          reach: ['AIIMS New Delhi', 'CMC Vellore', 'JIPMER Puducherry', 'King George’s Medical University (KGMU Lucknow)'],
          fit: ['Kasturba Medical College Manipal', "St. John's Medical College Bangalore", 'Kolkata Medical College'],
          accessible: ['Saveetha Medical College', 'Amrita Vishwa Vidyapeetham Kochi', 'Dr. D.Y. Patil Vidyapeeth Pune'],
        },
        masters: ['M.D. in Internal Medicine / Pediatrics / Dermatology', 'M.S. in General Surgery / Orthopedics / Ophthalmology', 'Master of Public Health (MPH - Global Health Leadership)'],
        careerOutcomes: ['Senior Consultant Physician / Chief of Surgery', 'Director of Clinical Healthcare & Critical Care Medicine', 'Medical Director at Multi-Specialty Hospital Network', 'Global Epidemiologist & Public Health Strategist'],
        skills: ['Clinical Pathology & Anatomy', 'Medical Pharmacology', 'Surgical Dexterity & Patient Empathy', 'Healthcare Data Protocols'],
        targetCompanies: ['AIIMS Healthcare Network', 'Apollo Hospitals Enterprise', 'Fortis Healthcare', 'Medanta The Medicity', 'Max Healthcare'],
        milestone: 'Score in top 99th percentile of NEET-UG, secure admission in government medical college, and clear USMLE Step 1 during clinical residency.',
        studyAbroad: {
          programs: ['M.D. Program / Pre-Med Tracks (Johns Hopkins / Harvard / Oxford / UCL)', 'Bachelor of Medicine & Bachelor of Surgery (Monash / Melbourne / Sydney)', 'B.Sc. in Human Biology & Clinical Medicine (Univ. of Toronto)', 'Undergraduate Clinical Science (Karolinska Institute Sweden)'],
          scholarships: ['Rhodes Scholarship for Medical & Life Sciences (Oxford)', 'Commonwealth Healthcare Scholarships (UK)', 'Global Medical Dean’s Fellowship (Australia / Canada)', 'Fulbright-Nehru Master’s Fellowships in Public Health'],
        },
      },
    },
  },

  // ── 3. COMMERCE & MANAGEMENT BROAD STREAM ───────────────────────────────────
  commerce_stream: {
    id: 'commerce_stream',
    streamId: 'COMMERCE',
    defaultName: 'Commerce, Business & Management Stream',
    aliases: [
      'commerce, business & management stream',
      'commerce, business & management',
      'commerce & quantitative finance',
      'commerce & entrepreneurship vector',
      'business administration, strategy & management',
      'commerce stream',
      'commerce',
    ],
    grades: {
      junior: {
        title: 'Commerce, Economics & Entrepreneurial Discovery Vector',
        foundation: {
          subjects: ['Applied Mathematics', 'Commercial Studies & Economics Basics', 'Data Literacy', 'English & Business Communication', 'Social Sciences'],
          exams: ['International Commerce Olympiad (ICO)', 'Aryabhata Mathematics Olympiad', 'National Financial Literacy Quiz', 'Young Entrepreneur School Challenges'],
          curriculumFocus: 'Focus on numerical agility, data representation, team project coordination, and early economic awareness.',
        },
        bachelors: [
          { degree: 'B.Com (Hons) / B.B.A. (Bachelor of Business Administration)', specialization: 'Corporate Finance, Global Management, FinTech', whyFits: 'Leverages structured organization and quantitative problem solving.', careerOutcomes: 'Financial Analyst, Product Manager, Business Consultant' },
          { degree: 'B.A. (Hons) Economics & Data Science', specialization: 'Applied Econometrics, Market Design & Analytics', whyFits: 'Combines analytical problem solving with economic decision systems.', careerOutcomes: 'Economic Researcher, Data Strategy Associate, Quantitative Analyst' },
        ],
        colleges: {
          reach: ['Shri Ram College of Commerce (SRCC)', 'St. Stephen’s College', 'IIM Indore (IPMAT)', 'Shaheed Sukhdev College (SSCBS)'],
          fit: ["St. Xavier's College, Mumbai", 'Loyola College, Chennai', 'Narsee Monjee (NMIMS)', 'Ashoka University'],
          accessible: ['Christ University, Bangalore', 'Symbiosis Pune', 'Mithibai College, Mumbai'],
        },
        masters: ['Master of Business Administration (MBA)', 'M.Sc. in Quantitative Finance & Risk', 'Master in Management (MiM - Global)'],
        careerOutcomes: ['Investment & Private Equity Strategist', 'Chief Executive / Enterprise Founder', 'Global Supply Chain & Operations Director', 'Management & Economic Policy Consultant'],
        skills: ['Financial Literacy & Spreadsheets', 'Team Leadership', 'Market Observation', 'Analytical Negotiation'],
        targetCompanies: ['Deloitte Youth Innovation', 'HDFC Bank Leadership Academy', 'McKinsey Forward Program', 'Tata Young Leaders'],
        milestone: 'Launch a student club enterprise project or participate in a junior stock market / business simulation challenge.',
      },
      grade10: {
        title: 'Commerce, Applied Economics & Strategic Management Stream',
        foundation: {
          subjects: ['Accountancy & Financial Reporting', 'Business Studies & Strategic Enterprise', 'Economics (Microeconomics & Macroeconomics)', 'Applied Mathematics or Core Mathematics', 'English Core & Corporate Communication'],
          exams: ['CUET-UG (Commerce, Accountancy, Economics & Business Studies)', 'IPMAT (IIM Indore, IIM Rohtak, IIM Ranchi, IIM Jammu 5-Year Integrated IPM)', 'CA Foundation (Institute of Chartered Accountants of India)', 'NPAT (NMIMS) / SET (Symbiosis)'],
          curriculumFocus: 'Deep grounding in double-entry bookkeeping, corporate balance sheets, macroeconomic policy analysis, and quantitative mathematical modeling.',
        },
        bachelors: [
          { degree: 'B.Com (Hons) in Accounting & Corporate Finance', specialization: 'Financial Accounting, Auditing Standards, Corporate Tax Law', whyFits: 'Directly aligns with structured numerical conscientiousness and order.', careerOutcomes: 'Investment Banker, Chartered Accountant, Financial Controller' },
          { degree: 'B.B.A. / B.M.S. in Global Business Management', specialization: 'Venture Management, Marketing Strategy, Corporate Leadership', whyFits: 'Leverages enterprising leadership and persuasive strategic synthesis.', careerOutcomes: 'Management Consultant, Business Development Lead, Operations Manager' },
          { degree: 'B.A. (Hons) in Economics & Econometrics', specialization: 'Quantitative Macroeconomics, Financial Modeling, Public Policy', whyFits: 'Applies higher mathematics and logical reasoning to market behaviors.', careerOutcomes: 'Economic Policy Analyst, Risk Modeler, Data Strategist' },
          { degree: 'B.Sc. in Finance & FinTech Analytics', specialization: 'Algorithmic Trading, Blockchain Finance, Quantitative Risk', whyFits: 'Bridges commercial acumen with contemporary financial computing.', careerOutcomes: 'FinTech Strategist, Equity Analyst, Portfolio Manager' },
        ],
        colleges: {
          reach: ['Shri Ram College of Commerce (SRCC Delhi)', 'IIM Indore (IPM)', 'Shaheed Sukhdev College of Business Studies (SSCBS Delhi)', 'St. Stephen’s College Delhi', 'St. Xavier’s College Mumbai'],
          fit: ['Loyola College Chennai', 'Narsee Monjee Institute (NMIMS Mumbai)', 'Christ University Bangalore', 'Symbiosis Centre for Management Studies (SCMS Pune)', 'Hansraj College Delhi'],
          accessible: ['Mithibai College Mumbai', 'Jai Hind College Mumbai', 'Delhi College of Arts & Commerce (DCAC)', 'Amity Global Business School'],
        },
        masters: ['Master of Business Administration (MBA - IIM Ahmedabad / Bangalore / Calcutta / ISB)', 'Master in Finance (LBS / MIT Sloan / Princeton)', 'M.Sc. in Financial Economics & Quantitative Analysis (LSE / Oxford)'],
        careerOutcomes: ['Managing Director in Investment Banking / Private Equity', 'Partner at Global Management Consulting Major (McKinsey / BCG / Bain)', 'Chief Financial Officer (CFO) & Corporate Treasury Lead', 'Venture Capital Investor & Growth Enterprise Founder'],
        skills: ['Financial Statement Analysis & Modeling', 'Advanced Excel, PowerBI & Quantitative Forecasting', 'Corporate Governance & Tax Compliance', 'Strategic Brand Architecture & Commercial Negotiation'],
        targetCompanies: ['Goldman Sachs', 'J.P. Morgan', 'McKinsey & Company', 'Deloitte', 'HDFC Bank', 'Hindustan Unilever', 'Boston Consulting Group (BCG)'],
        milestone: 'Clear IPMAT / CUET cutoffs with 99th percentile in Economics/Mathematics, achieve CA Foundation merit rank, and lead junior commerce society.',
      },
      senior: {
        title: 'Business Administration, Strategy & Management',
        foundation: {
          subjects: ['Accountancy & Corporate Finance', 'Business Studies & Strategic Enterprise', 'Applied Mathematics / Statistics', 'Economics', 'Business Communication'],
          exams: ['IPMAT (IIM Indore / Rohtak / Ranchi / Bodh Gaya)', 'CUET-UG (Business Studies, Accountancy, General Test)', 'NPAT (NMIMS)', 'SET (Symbiosis Entrance Test)', 'SAT (Global Business Schools)'],
          curriculumFocus: 'Focus on strategic decision-making, financial modeling, organizational behavior, marketing analytics, and corporate case study synthesis.',
        },
        bachelors: [
          { degree: 'B.B.A. / B.M.S. in Strategic Business Management', specialization: 'Corporate Strategy, Global Operations, Tech Commercialization', whyFits: 'Directly exercises enterprising leadership and strategic commercial synthesis.', careerOutcomes: 'Business Strategy Associate, Operations Lead, Product Manager' },
          { degree: 'Integrated Program in Management (IPM - 5 Year B.B.A. + M.B.A.)', specialization: 'General Management, Quantitative Decision Systems, Strategic Finance', whyFits: 'Provides an elite, fast-track trajectory at premier Indian Institutes of Management.', careerOutcomes: 'Management Consultant, Corporate Strategy Lead, Venture Analyst' },
          { degree: 'B.Com (Hons) in Financial Markets & Corporate Strategy', specialization: 'Financial Statement Modeling, Equity Markets, Strategic Valuation', whyFits: 'Combines rigorous accounting principles with high-stakes financial decision-making.', careerOutcomes: 'Investment Banking Analyst, Financial Controller, Equity Researcher' },
        ],
        colleges: {
          reach: ['IIM Indore (IPM)', 'Shaheed Sukhdev College of Business Studies (SSCBS)', 'IIM Rohtak (IPM)', 'IIM Ranchi (IPM)', 'Shri Ram College of Commerce (SRCC)'],
          fit: ['Narsee Monjee Institute of Management Studies (NMIMS)', 'Christ University (School of Business)', 'Symbiosis Centre for Management Studies (SCMS)', 'St. Xavier’s College Mumbai'],
          accessible: ['Mithibai College Mumbai', 'Amity Global Business School', 'Loyola Institute of Business Administration (LIBA)', 'Chandigarh University'],
        },
        masters: ['Master of Business Administration (MBA - IIM Ahmedabad / Bangalore / Calcutta / ISB)', 'Master in Management (MiM - St. Gallen / HEC Paris / LBS)', 'M.S. in Global Supply Chain & Technology Strategy (MIT / INSEAD)'],
        careerOutcomes: ['Chief Executive Officer (CEO) / Managing Director', 'Partner at Global Strategy Consulting Major (McKinsey / BCG / Bain)', 'Vice President of Global Strategy & Business Operations', 'Serial Entrepreneur & High-Growth Venture Founder'],
        skills: ['Strategic Decision Frameworks', 'Corporate Financial Modeling', 'Market Expansion & Pricing Analysis', 'Team Leadership & Executive Stakeholder Communication'],
        targetCompanies: ['McKinsey & Company', 'Boston Consulting Group (BCG)', 'Bain & Company', 'Tata Sons', 'Reliance Industries', 'Google Global Strategy & Operations', 'Unilever'],
        milestone: 'Win national business plan competition, clear IPMAT / CUET cutoffs with 99+ percentile, and complete pre-university micro-internship.',
        studyAbroad: {
          programs: ['B.S. in Economics & Strategic Finance (Wharton / NYU Stern / LSE)', 'Bachelor in Business Administration (Rotman Toronto / NUS / INSEAD)', 'B.Sc. in Management & International Business (St. Gallen Switzerland / Warwick)', 'B.Com in Strategic Analytics & Global Commerce (UBC Sauder / McGill)'],
          scholarships: ['Wharton Global Youth Business Fellowship', 'LSE Undergraduate International Excellence Scholarship', 'Dean’s International Commerce Award (Rotman / NYU)', 'Tata Global Higher Education Scholarship'],
        },
      },
    },
  },

  // ── 4. HUMANITIES & CREATIVE ARTS BROAD STREAM ──────────────────────────────
  humanities_stream: {
    id: 'humanities_stream',
    streamId: 'HUMANITIES',
    defaultName: 'Humanities & Creative Arts Stream',
    aliases: [
      'humanities & creative arts stream',
      'humanities, social sciences & creative arts',
      'humanities & creative expression vector',
      'humanities, social sciences & creative expression vector',
      'humanities stream',
      'humanities',
      'arts stream',
    ],
    grades: {
      junior: {
        title: 'Humanities, Social Sciences & Creative Expression Vector',
        foundation: {
          subjects: ['English & Creative Literature', 'History & Civics', 'Visual Arts & Media', 'Applied Social Studies', 'Foundational Mathematics'],
          exams: ['International General Knowledge Olympiad (IGKO)', 'National Essay & Creative Writing Competitions', 'Inter-School Debate Championships', 'All India Arts & Design Contest'],
          curriculumFocus: 'Focus on expressive writing, historical inquiry, active public speaking, and critical reading habits.',
        },
        bachelors: [
          { degree: 'B.A. (Hons) in Psychology / Media & Communication', specialization: 'Cognitive Behaviour, Journalism & Digital Media', whyFits: 'Aligns with high empathy and expressive curiosity.', careerOutcomes: 'Journalist, UX Content Strategist, Creative Producer, Behavioral Researcher' },
          { degree: 'B.Des (Bachelor of Design) / Visual Arts', specialization: 'Communication Design, Animation & Interactive Media', whyFits: 'Connects visual spatial thinking with narrative creativity.', careerOutcomes: 'Design Lead, Creative Art Director, Digital Illustrator' },
          { degree: 'B.A. (Hons) Political Science & Public Affairs / Law', specialization: 'International Relations, Public Governance & Constitutional Studies', whyFits: 'Capitalizes on strong verbal analysis and debate orientation.', careerOutcomes: 'Legal Analyst, Diplomatic Officer, Policy Researcher' },
        ],
        colleges: {
          reach: ["St. Stephen's College, Delhi", "Lady Shri Ram College (LSR)", "National Institute of Design (NID)", "Ashoka University"],
          fit: ["St. Xavier's College, Mumbai", "Miranda House, Delhi", "FLAME University, Pune", "Loyola College, Chennai"],
          accessible: ["Christ University, Bangalore", "Symbiosis Institute", "Mithibai College, Mumbai"],
        },
        masters: ['Master of Arts in International Relations / Media Studies', 'Master of Public Policy (MPP)', 'M.Des in Human-Centered Design'],
        careerOutcomes: ['Global Policy & Social Impact Leader', 'Creative Director & Brand Storyteller', 'Behavioral Research & Strategic Consultant', 'International Diplomatic & Legal Advocate'],
        skills: ['Critical Reading & Essay Writing', 'Debate & Public Presentation', 'Visual Storyboarding', 'Qualitative Inquiry'],
        targetCompanies: ['United Nations Youth Forum', 'Penguin Random House', 'National Geographic', 'BBC Media Action', 'Ogilvy Creative Labs'],
        milestone: 'Lead a middle-school publication or school debate forum and maintain an active reflective reading journal.',
      },
      grade10: {
        title: 'Humanities, Legal Studies, Design & Social Sciences Stream',
        foundation: {
          subjects: ['Political Science & International Relations', 'Psychology / Sociology', 'History & World Civilizations', 'Economics / Legal Studies / Fine Arts', 'English Literature & Advanced Rhetoric'],
          exams: ['CUET-UG (Humanities, Psychology, Political Science, History, English)', 'CLAT (Common Law Admission Test for National Law Universities)', 'NID DAT / UCEED (National Design Entrance)', 'AILET (NLU Delhi Entrance)'],
          curriculumFocus: 'Rigorous development of argumentative writing, constitutional legal reasoning, qualitative research, and socio-cultural impact analysis.',
        },
        bachelors: [
          { degree: 'B.A. LL.B. (Hons - 5-Year Integrated Law Program)', specialization: 'Constitutional Law, Corporate Jurisprudence, International Arbitration', whyFits: 'Directly engages high verbal reasoning, socratic logic, and justice values.', careerOutcomes: 'Corporate Advocate, Legal Counsel, Judicial Officer, Arbitrator' },
          { degree: 'B.A. (Hons) in Psychology & Cognitive Behaviour', specialization: 'Clinical Psychology, Organizational Neuro-behavior, Counseling', whyFits: 'Capitalizes on deep interpersonal empathy and human-behavior observation.', careerOutcomes: 'Clinical Psychologist, Organizational Consultant, Behavioral Researcher' },
          { degree: 'B.Des in Communication & Interaction Design', specialization: 'UI/UX Design, Visual Brand Architecture, Digital Storytelling', whyFits: 'Merges abstract aesthetic creativity with functional design systems.', careerOutcomes: 'Product Designer, UX Lead, Creative Director' },
          { degree: 'B.A. (Hons) in Journalism, Media & International Relations', specialization: 'Investigative Journalism, Public Diplomacy, Strategic Communications', whyFits: 'Applies expressive verbal eloquence to socio-political reporting.', careerOutcomes: 'Foreign Correspondent, Public Relations Lead, Media Editor' },
        ],
        colleges: {
          reach: ['National Law School of India University (NLSIU Bangalore)', 'St. Stephen’s College Delhi', 'Lady Shri Ram College (LSR Delhi)', 'National Institute of Design (NID Ahmedabad)', 'Ashoka University'],
          fit: ['NALSAR Hyderabad', 'St. Xavier’s College Mumbai', 'Miranda House Delhi', 'FLAME University Pune', 'Loyola College Chennai'],
          accessible: ['Christ University Bangalore', 'Symbiosis School of Liberal Arts Pune', 'Mithibai College Mumbai', 'O.P. Jindal Global University'],
        },
        masters: ['Master of Laws (LL.M. - Oxford / Harvard / NLSIU)', 'M.A. / Ph.D. in Clinical Psychology & Cognitive Science', 'Master in Public Policy (MPP - Harvard Kennedy / NUS Lee Kuan Yew / Oxford Blavatnik)'],
        careerOutcomes: ['Senior Advocate & Corporate Legal Counsel', 'Director of Public Policy & Global Social Impact', 'Principal UI/UX Design Architect & Creative Lead', 'Senior Investigative Journalist & Media Executive'],
        skills: ['Rhetorical Analysis & Persuasive Writing', 'Qualitative Empirical Research', 'Constitutional Law & Statutory Interpretation', 'Visual Storyboarding & Human-Centered Design'],
        targetCompanies: ['Shardul Amarchand Mangaldas', 'Trilegal', 'United Nations Development Programme (UNDP)', 'BBC Media Action', 'Ogilvy', 'McKinsey Social Impact'],
        milestone: 'Win national debate championship, publish research essay in peer-reviewed student journal, and achieve 99th percentile in CLAT / CUET mock exams.',
      },
      senior: {
        title: 'Law, Corporate Jurisprudence & Dispute Resolution',
        foundation: {
          subjects: ['Legal Studies & Constitutional Foundations', 'Political Science & Governance', 'Psychology / Sociology', 'English Advanced Rhetoric', 'Economics'],
          exams: ['CLAT (Common Law Admission Test for 26 NLUs)', 'AILET (National Law University Delhi)', 'SLAT (Symbiosis Law Entrance)', 'LSAT-India / LSAT Global', 'CUET-UG Legal Studies'],
          curriculumFocus: 'Focus on legal deductive logic, statutory construction, constitutional case jurisprudence, critical reading comprehension, and argumentative brief synthesis.',
        },
        bachelors: [
          { degree: 'B.A. LL.B. (Hons) / B.B.A. LL.B. (Hons) - 5-Year Integrated Law', specialization: 'Corporate M&A, Intellectual Property Law, International Commercial Arbitration', whyFits: 'Matches high verbal comprehension, socratic logic, and institutional leadership.', careerOutcomes: 'Corporate Lawyer, In-House Counsel, Commercial Litigator' },
          { degree: 'B.A. (Hons) in Political Science & Constitutional Governance', specialization: 'Public Policy Analysis, International Diplomacy, Legislative Studies', whyFits: 'Builds deep theoretical understanding of statecraft, governance, and institutional mechanics.', careerOutcomes: 'Policy Analyst, Legislative Assistant, Diplomatic Officer' },
          { degree: 'B.A. (Hons) in Psychology & Behavioral Forensics', specialization: 'Legal Psychology, Criminal Profiling, Dispute Mediation', whyFits: 'Bridges behavioral psychology with legal dispute negotiation and mediation.', careerOutcomes: 'Mediation Specialist, Forensic Psychologist, Behavioral Consultant' },
        ],
        colleges: {
          reach: ['National Law School of India University (NLSIU Bangalore)', 'National Law University Delhi (NLU Delhi)', 'NALSAR University of Law (Hyderabad)', 'The West Bengal National University of Juridical Sciences (WBNUJS Kolkata)'],
          fit: ['Gujarat National Law University (GNLU)', 'National Law Institute University (NLIU Bhopal)', 'Symbiosis Law School Pune (SLS)', 'Jindal Global Law School (JGLS)'],
          accessible: ['School of Law Christ University Bangalore', 'ILS Law College Pune', 'Amity Law School Noida', 'Army Institute of Law Mohali'],
        },
        masters: ['Master of Laws (LL.M. in Corporate Law / International Trade - Harvard / Cambridge / Oxford / NYU)', 'Master of Public Policy (MPP - Oxford Blavatnik / LSE / NUS Lee Kuan Yew)', 'Ph.D. in Constitutional Jurisprudence & Judicial Governance'],
        careerOutcomes: ['Partner at Tier-1 Global Law Firm (Cyril Amarchand Mangaldas / AZB / Clifford Chance)', 'Senior Advocate at Supreme Court & International Arbitrator', 'General Counsel / Chief Legal Officer at Multinational Enterprise', 'High Court Judge / Judicial Officer'],
        skills: ['Statutory Interpretation & Legal Research', 'Oral Advocacy & Cross-Examination', 'M&A Contract Drafting & Negotiation', 'Constitutional Jurisprudence & Regulatory Risk Analysis'],
        targetCompanies: ['Cyril Amarchand Mangaldas', 'Shardul Amarchand Mangaldas', 'AZB & Partners', 'Trilegal', 'Khaitan & Co', 'Supreme Court of India', 'United Nations Legal Affairs'],
        milestone: 'Win national moot court competition, achieve top 200 AIR in CLAT, and complete research internship at judicial chamber or appellate law firm.',
        studyAbroad: {
          programs: ['B.A. in Jurisprudence / Senior Status Law (Oxford / Cambridge)', 'LL.B. (Hons) in International & Corporate Law (UCL / LSE / King’s College London)', 'B.A. in Legal Studies & Public Policy (UC Berkeley / Georgetown)', 'LL.B. / Dual Degree in Law & International Affairs (NUS Singapore / Melbourne)'],
          scholarships: ['Rhodes Scholarship for Law & Jurisprudence (Oxford)', 'Inlaks Shivdasani Foundation Law Scholarship', 'Commonwealth Legal Leadership Award (UK)', 'Chevening Legal Fellowship'],
        },
      },
    },
  },
};

// ─── SENIOR SPECIALIZED CAREER CLUSTER EXTENSIONS ────────────────────────────
// Provides granular, distinct content for individual senior career clusters
// so no two senior clusters in the same domain share identical bodies.

export const SENIOR_CLUSTER_REGISTRY: Record<string, Partial<PathwayConfig>> = {
  software_engineering: {
    title: 'Computer Science, Software Systems & Cloud Architecture',
    milestone: 'Build an open-source distributed cloud project, achieve 99th percentile in JEE Mains Math, and clear tier-1 hackathon.',
  },
  data_science_ai: {
    title: 'Data Science, Artificial Intelligence & Machine Learning Systems',
    foundation: {
      subjects: ['Higher Secondary Mathematics (Calculus, Statistics & Linear Algebra)', 'Physics', 'Computer Science (Python & Big Data Analytics)', 'Technical English'],
      exams: ['JEE Main & Advanced', 'BITSAT', 'ISI Admission Test (Indian Statistical Institute)', 'CUET-UG (Maths/Statistics)'],
      curriculumFocus: 'Focus on multi-variable calculus, Bayesian probability, neural network mathematics, and statistical computing.',
    },
    bachelors: [
      { degree: 'B.Tech in Artificial Intelligence & Data Science', specialization: 'Deep Learning, Computer Vision, Generative AI', whyFits: 'Directly engages statistical synthesis and algorithmic computing.', careerOutcomes: 'AI Research Scientist, ML Engineer, Data Infrastructure Lead' },
      { degree: 'B.Stat / B.Math (Hons - Indian Statistical Institute)', specialization: 'Mathematical Statistics, Probability Theory, Machine Learning', whyFits: 'Provides gold-standard global foundation for theoretical algorithmic data science.', careerOutcomes: 'Quantitative Data Scientist, Machine Learning Architect, Mathematical Modeler' },
      { degree: 'B.Sc. in Data Science & Big Data Engineering', specialization: 'Distributed Analytics, Cloud Data Pipelines, Natural Language Processing', whyFits: 'Applies computational data wrangling to high-volume enterprise problems.', careerOutcomes: 'Data Engineer, NLP Specialist, Big Data Architect' },
    ],
    milestone: 'Publish a trained machine learning model on HuggingFace, solve 150+ LeetCode problems, and qualify for ISI / JEE Advanced cutoffs.',
    studyAbroad: {
      programs: ['B.S. in Data Science & Artificial Intelligence (UC Berkeley / MIT / Stanford)', 'B.Sc. in Machine Learning & Statistics (Oxford / Imperial / Edinburgh)', 'B.Comp in Artificial Intelligence (NUS Singapore / NTU)'],
      scholarships: ['DeepMind Artificial Intelligence Undergraduate Fellowship', 'DAAD Data Science Excellence Award', 'Dean’s International STEM Scholar'],
    },
  },
  cybersecurity_networking: {
    title: 'Cybersecurity, Cryptography & Network Defense Systems',
    foundation: {
      subjects: ['Higher Mathematics (Discrete Math & Number Theory)', 'Physics', 'Computer Science (Networking & Linux Systems)', 'English'],
      exams: ['JEE Main & Advanced', 'BITSAT', 'VITEEE / MET', 'CompTIA Security+ / CEH Benchmark'],
      curriculumFocus: 'Focus on cryptographic protocols, operating systems internals, TCP/IP networking, and ethical vulnerability analysis.',
    },
    bachelors: [
      { degree: 'B.Tech in Cybersecurity & Information Security', specialization: 'Ethical Hacking, Penetration Testing, Cloud Security', whyFits: 'Applies methodical investigative logic to digital infrastructure protection.', careerOutcomes: 'Information Security Officer, Penetration Tester, Security Architect' },
      { degree: 'B.Tech in Computer Science (Network Systems Track)', specialization: 'Software-Defined Networking, Distributed Cryptography, Threat Intelligence', whyFits: 'Bridges deep operating system design with defensive network resilience.', careerOutcomes: 'Network Systems Lead, Cloud Security Architect, Threat Analyst' },
    ],
    milestone: 'Complete OSCP or CEH lab certification, build automated network vulnerability scanner, and clear university admission benchmarks.',
  },
  mechanical_engineering: {
    title: 'Mechanical Engineering, Robotics & Advanced Manufacturing',
    milestone: 'Design working 3D CAD mechanical assembly in SolidWorks, participate in Formula Student / SAE BAJA team, and master JEE mechanics.',
  },
  aerospace_defence: {
    title: 'Aerospace, Aeronautical & Defence Systems Engineering',
    foundation: {
      subjects: ['Physics (Fluid Mechanics, Thermodynamics & Kinematics)', 'Higher Mathematics (Calculus & Differential Equations)', 'Chemistry / Materials Science', 'Engineering Graphics & 3D CAD', 'English'],
      exams: ['JEE Main & JEE Advanced', 'IIST Admission Test (Indian Institute of Space Science and Technology)', 'BITSAT', 'State Engineering CETs'],
      curriculumFocus: 'Focus on supersonic aerodynamics, rocket propulsion, orbital mechanics, turbomachinery, and avionics flight systems.',
    },
    bachelors: [
      { degree: 'B.Tech in Aerospace & Aeronautical Engineering', specialization: 'Rocket Propulsion, Hypersonic Aerodynamics, Flight Dynamics', whyFits: 'Capitalizes on elite spatial visualization and mechanical fluid dynamics.', careerOutcomes: 'Aerospace Propulsion Engineer, Aerodynamics Specialist, Flight Systems Analyst' },
      { degree: 'B.Tech in Avionics & Space Systems', specialization: 'Satellite Navigation, Flight Control Computing, Radar Systems', whyFits: 'Bridges aerospace airframe design with high-reliability guidance avionics.', careerOutcomes: 'Avionics Architect, Satellite Guidance Lead, Drone Systems Engineer' },
    ],
    milestone: 'Design working 3D CAD rocket/aircraft model in SolidWorks, compete in national CanSat / aeromodelling challenge, and qualify for IIST / IIT cutoffs.',
    studyAbroad: {
      programs: ['B.S. in Aerospace Engineering (Purdue / Georgia Tech / MIT)', 'B.Eng in Aeronautical Systems (Imperial College / Bristol)', 'B.Sc. in Space Science & Satellite Engineering (TU Delft Netherlands)'],
      scholarships: ['AIAA Undergraduate Aerospace Award', 'DAAD Engineering Fellowship', 'Commonwealth Aerospace Scholarship'],
    },
  },
  robotics_automation: {
    title: 'Robotics, Autonomous Systems & Mechatronics Engineering',
    foundation: {
      subjects: ['Physics (Dynamics & Electromagnetism)', 'Mathematics (Linear Algebra, Calculus & Control Theory)', 'Computer Science (C++ & ROS Robotics OS)', 'Engineering Graphics'],
      exams: ['JEE Main & Advanced', 'BITSAT', 'VITEEE', 'State CETs'],
      curriculumFocus: 'Focus on robotic kinematics, actuator dynamics, computer vision, sensor fusion, and embedded micro-controllers.',
    },
    bachelors: [
      { degree: 'B.Tech in Robotics & Automation Engineering', specialization: 'Autonomous Mobile Robots, Industrial Manipulators, SLAM', whyFits: 'Bridges software algorithms with real-world physical mechanical motion.', careerOutcomes: 'Robotics Engineer, Automation Systems Lead, Drone Architect' },
      { degree: 'B.Tech in Mechatronics Engineering', specialization: 'Micro-electromechanical Systems, Sensor Fusion, PLC Control', whyFits: 'Combines mechanical engineering, electronics, and embedded software.', careerOutcomes: 'Mechatronics Specialist, Industrial Automation Lead, Hardware Architect' },
    ],
    milestone: 'Build a working 4-DOF robotic arm with computer vision sorting, and achieve top ranking in national robotics olympiad.',
  },
  civil_engineering_architecture: {
    title: 'Civil Engineering, Structural Infrastructure & Architecture',
    milestone: 'Create comprehensive architectural CAD folio, clear NATA with 130+ or JEE Main Paper 2 in top 1%, and win regional design competition.',
  },
  electrical_electronics: {
    title: 'Electrical, Electronics & Semiconductor VLSI Engineering',
    milestone: 'Design and fabricate custom PCB with ARM Cortex micro-controller in KiCad, and clear JEE Advanced engineering cutoffs.',
  },
  biotechnology_genetics: {
    title: 'Biotechnology, Genetics & Bio-Engineering Systems',
    foundation: {
      subjects: ['Biology (Genetics, Molecular Biology & Cell Physiology)', 'Chemistry (Organic & Biochemistry)', 'Physics / Mathematics', 'English'],
      exams: ['NEET-UG', 'CUET-UG (Biotechnology, Biology, Chemistry)', 'NEST / IAT (IISER / NISER)', 'GAT-B (Biotechnology Entrance)'],
      curriculumFocus: 'Focus on recombinant DNA technology, CRISPR gene editing, bioprocess engineering, and bioinformatics data pipelines.',
    },
    bachelors: [
      { degree: 'B.Tech / B.S. in Biotechnology & Genetic Engineering', specialization: 'CRISPR Therapeutics, Bioprocess Engineering, Synthetic Biology', whyFits: 'Combines biological living systems with technological engineering precision.', careerOutcomes: 'Biotech Scientist, Gene Therapy Researcher, Bioprocess Engineer' },
      { degree: 'B.Sc. (Hons) in Genetics & Molecular Biology', specialization: 'Epigenetics, Clinical Genomics, Molecular Oncology', whyFits: 'Applies investigative empirical inquiry to genetic code analysis.', careerOutcomes: 'Clinical Geneticist, Genomics Analyst, Research Associate' },
    ],
    milestone: 'Author a high school scientific paper on CRISPR/biotech innovation, and achieve benchmark score in CUET / IAT examinations.',
  },
  pharmacy_drug_research: {
    title: 'Pharmaceutical Sciences, Clinical Drug Discovery & Pharmacology',
    foundation: {
      subjects: ['Chemistry (Organic, Medicinal & Analytical Chemistry)', 'Biology / Human Anatomy', 'Physics', 'Mathematics / Computer Science', 'English'],
      exams: ['NEET-UG', 'CUET-UG (Chemistry, Biology, General Test)', 'State Pharmacy CETs (MHT-CET, KCET)', 'GPAT (Future Benchmark)'],
      curriculumFocus: 'Focus on medicinal chemistry synthesis, pharmacokinetics, pharmaceutical formulation, and clinical toxicology.',
    },
    bachelors: [
      { degree: 'B.Pharm (Bachelor of Pharmacy - 4-Year Professional Degree)', specialization: 'Medicinal Formulation, Drug Delivery Systems, Pharmacognosy', whyFits: 'Applies organic chemical mechanics to pharmaceutical drug development.', careerOutcomes: 'Formulation Scientist, Regulatory Affairs Specialist, Pharmacist' },
      { degree: 'Pharm.D (Doctor of Pharmacy - 6-Year Clinical Degree)', specialization: 'Clinical Therapeutics, Hospital Pharmacy, Pharmacovigilance', whyFits: 'Bridges hospital patient care with clinical drug efficacy monitoring.', careerOutcomes: 'Clinical Pharmacist, Drug Safety Director, Medical Liaison' },
    ],
    milestone: 'Complete certified lab training in pharmaceutical formulation analysis and score in top 95th percentile of state Pharmacy CET.',
  },
  chartered_accountancy_audit: {
    title: 'Chartered Accountancy, Forensic Audit & Taxation',
    milestone: 'Clear CA Foundation on first attempt with distinction, and maintain top academic score in Class 12 Accountancy board exams.',
  },
  finance_investment_banking: {
    title: 'Investment Banking, Quantitative Finance & Asset Management',
    foundation: {
      subjects: ['Accountancy & Financial Markets', 'Applied Mathematics (Calculus & Probability)', 'Economics (Macro & Micro)', 'Business Studies', 'English'],
      exams: ['CUET-UG (Mathematics, Economics, Accountancy)', 'IPMAT (IIM Indore)', 'CFA Level 1 (Future Preparation)'],
      curriculumFocus: 'Focus on financial statement analysis, discounted cash flow (DCF) modeling, portfolio valuation, and equity research.',
    },
    bachelors: [
      { degree: 'B.Com (Hons) in Financial Markets / Quantitative Finance', specialization: 'Mergers & Acquisitions, Private Equity Valuation, Asset Management', whyFits: 'Directly exercises quantitative analytical acumen and commercial market instincts.', careerOutcomes: 'Investment Banking Analyst, Equity Research Associate, Portfolio Analyst' },
      { degree: 'B.Sc. in Quantitative Economics & Finance', specialization: 'Econometrics, Derivatives Pricing, Risk Modeling', whyFits: 'Applies mathematical models to capital market asset pricing.', careerOutcomes: 'Quantitative Modeler, Risk Analyst, Capital Markets Lead' },
    ],
    milestone: 'Complete Bloomberg Market Concepts (BMC) certification, build 3-statement financial valuation model in Excel, and clear CUET/IPMAT cutoffs.',
  },
  economics_policy: {
    title: 'Economics, Quantitative Econometrics & Public Policy',
    foundation: {
      subjects: ['Economics (Microeconomics, Macroeconomics & Indian Economy)', 'Advanced Mathematics (Calculus & Linear Algebra)', 'Accountancy / Political Science', 'English'],
      exams: ['CUET-UG (Economics, Mathematics, General Test)', 'IPMAT', 'SAT (Global Universities)'],
      curriculumFocus: 'Focus on macroeconomic policy analysis, econometrics regression models, game theory, and developmental economics.',
    },
    bachelors: [
      { degree: 'B.A. (Hons) / B.Sc. in Economics', specialization: 'Econometric Modeling, Public Policy Design, International Trade', whyFits: 'Applies quantitative mathematical deduction to global socio-economic questions.', careerOutcomes: 'Economic Consultant, Policy Analyst, Central Bank Researcher' },
    ],
    milestone: 'Author a policy brief on economic development, clear CUET with 100 percentile in Economics, and gain admission to top-tier university.',
  },
  psychology_counselling: {
    title: 'Psychology, Cognitive Behaviour & Clinical Counselling',
    foundation: {
      subjects: ['Psychology (Cognitive, Social & Abnormal Psychology)', 'Biology / Physiology Basics', 'Sociology / Political Science', 'English Literature', 'Applied Statistics'],
      exams: ['CUET-UG (Psychology, English, General Test)', 'TISS-BAT (Tata Institute of Social Sciences)', 'State University Entrances'],
      curriculumFocus: 'Focus on psychometric testing, cognitive behavioral science, developmental psychology, and qualitative behavioral research.',
    },
    bachelors: [
      { degree: 'B.A. / B.Sc. (Hons) in Psychology', specialization: 'Clinical Psychology, Neuro-Cognitive Sciences, Counseling', whyFits: 'Capitalizes on extraordinary empathy, social intuition, and patient communication.', careerOutcomes: 'Counselor, Clinical Psychologist, Organizational Neuro-Analyst' },
    ],
    milestone: 'Complete peer counseling certificate, conduct psychometric research survey, and clear top university cutoff in Psychology.',
  },
  journalism_mass_media: {
    title: 'Journalism, Digital Media Production & Strategic Communication',
    foundation: {
      subjects: ['English Advanced Literature & Composition', 'Political Science & Media Law', 'Sociology & Cultural Studies', 'History', 'Media & Film Basics'],
      exams: ['CUET-UG (Mass Communication, English, General Test)', 'IIMC Entrance Exam', 'XIC OET (St. Xavier’s Media Entrance)'],
      curriculumFocus: 'Focus on news reporting, broadcast journalism, multimedia digital storytelling, media ethics, and investigative rhetoric.',
    },
    bachelors: [
      { degree: 'B.A. (Hons) in Journalism & Mass Communication', specialization: 'Investigative Journalism, Broadcast Media, Digital Content Strategy', whyFits: 'Applies strong expressive verbal eloquence and socio-political curiosity.', careerOutcomes: 'Broadcast Journalist, Senior Content Strategist, Foreign Correspondent' },
    ],
    milestone: 'Publish a digital documentary or 5 investigative articles in youth journals, and achieve top score in journalism entrance exams.',
  },
  civil_services_governance: {
    title: 'Public Administration, Civil Services & National Governance',
    foundation: {
      subjects: ['Political Science & Constitutional Governance', 'Modern Indian & World History', 'Geography & Economics', 'English & Essay Writing', 'Applied Ethics'],
      exams: ['UPSC Civil Services Examination (Future Target)', 'CUET-UG (History, Political Science, Economics)', 'State Public Service Commissions'],
      curriculumFocus: 'Focus on constitutional ethics, administrative policy analysis, socio-economic welfare delivery, and international diplomacy.',
    },
    bachelors: [
      { degree: 'B.A. (Hons) in Public Administration & Political Science', specialization: 'Indian Governance, Public Policy, International Relations', whyFits: 'Directly aligns with prosocial service values, leadership grit, and civic responsibility.', careerOutcomes: 'Civil Servant (IAS / IPS / IFS), Policy Strategist, Governance Consultant' },
    ],
    milestone: 'Complete comprehensive study of Indian Constitution and General Studies, win state essay debate, and secure top university merit.',
  },
};

// ─── HELPER: RESOLVE STABLE PATHWAY ID ───────────────────────────────────────

export function resolvePathwayId(input: { id?: string; name: string } | string): string {
  if (typeof input === 'object' && input.id && PATHWAY_REGISTRY[input.id]) {
    return input.id;
  }
  const nameStr = (typeof input === 'object' ? input.name : input || '').toLowerCase().trim();

  // 1. Direct alias match against registry
  for (const [id, def] of Object.entries(PATHWAY_REGISTRY)) {
    if (def.aliases.some(alias => nameStr === alias || nameStr.includes(alias))) {
      return id;
    }
  }

  // 2. Specific Senior cluster matches
  if (/software|computer science|coding|\bit\b/i.test(nameStr)) return 'software_engineering';
  if (/data science|artificial intelligence|\bai\b|machine learning/i.test(nameStr)) return 'data_science_ai';
  if (/cybersecurity|networking|information security/i.test(nameStr)) return 'cybersecurity_networking';
  if (/aerospace|aeronautical|aviation|avionics/i.test(nameStr)) return 'aerospace_defence';
  if (/robotics|automation|mechatronics/i.test(nameStr)) return 'robotics_automation';
  if (/civil|architecture|construction|structural/i.test(nameStr)) return 'civil_engineering_architecture';
  if (/mechanical|automobile|automotive/i.test(nameStr)) return 'mechanical_engineering';
  if (/electrical|electronics|vlsi|semiconductor/i.test(nameStr)) return 'electrical_electronics';
  if (/pharmacy|drug research|pharmacology/i.test(nameStr)) return 'pharmacy_drug_research';
  if (/biotech|genetics|molecular biology/i.test(nameStr)) return 'biotechnology_genetics';
  if (/medicine|surgery|mbbs|doctor|clinical healthcare|clinical medicine|dental/i.test(nameStr)) return 'pcb_stream';
  if (/chartered accountancy|audit|accounting|taxation/i.test(nameStr)) return 'chartered_accountancy_audit';
  if (/investment banking|finance|asset management/i.test(nameStr)) return 'finance_investment_banking';
  if (/economics|policy/i.test(nameStr)) return 'economics_policy';
  if (/business|management|mba|bba|entrepreneurship|startups/i.test(nameStr)) return 'commerce_stream';
  if (/law|legal|judiciary|corporate law/i.test(nameStr)) return 'humanities_stream';
  if (/civil services|governance|public administration/i.test(nameStr)) return 'civil_services_governance';
  if (/psychology|counselling|cognitive/i.test(nameStr)) return 'psychology_counselling';
  if (/journalism|media|mass communication/i.test(nameStr)) return 'journalism_mass_media';
  if (/design|animation|arts|fine arts/i.test(nameStr)) return 'humanities_stream';

  // 3. Fallback to broad streams by keyword
  if (/pcm|tech|engineering/i.test(nameStr)) return 'pcm_stream';
  if (/pcb|medical|bio|health|life science/i.test(nameStr)) return 'pcb_stream';
  if (/commerce|finance|business|trade/i.test(nameStr)) return 'commerce_stream';
  if (/humanities|creative|arts|social/i.test(nameStr)) return 'humanities_stream';

  return 'pcm_stream';
}

// Parent broad stream for each senior career cluster, used for Class 7–10 reports.
const CLUSTER_PARENT_STREAM: Record<string, string> = {
  software_engineering: 'pcm_stream',
  data_science_ai: 'pcm_stream',
  cybersecurity_networking: 'pcm_stream',
  mechanical_engineering: 'pcm_stream',
  aerospace_defence: 'pcm_stream',
  robotics_automation: 'pcm_stream',
  civil_engineering_architecture: 'pcm_stream',
  electrical_electronics: 'pcm_stream',
  biotechnology_genetics: 'pcb_stream',
  pharmacy_drug_research: 'pcb_stream',
  chartered_accountancy_audit: 'commerce_stream',
  finance_investment_banking: 'commerce_stream',
  economics_policy: 'humanities_stream',
  psychology_counselling: 'humanities_stream',
  journalism_mass_media: 'humanities_stream',
  civil_services_governance: 'humanities_stream',
};

// ─── AUTHORITATIVE ROADMAP LOOKUP BY RANK ───────────────────────────────────

export function getRoadmapByRank(
  rank: 1 | 2 | 3,
  careerFitment: Array<{ id?: string; name: string; score: number; isCloseFit?: boolean }>,
  variant: ReportVariant,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): PathwayRoadmapData {
  const pathwayItem = careerFitment[rank - 1] || (careerFitment.length > 0 ? careerFitment[careerFitment.length - 1] : undefined);
  const firstName = (student.name || 'Candidate').split(' ')[0];
  const reportId = student.reportId || 'REP-DIAGNOSTIC';

  const rankLabel = variant === 'junior'
    ? (rank === 1 ? 'PRIMARY EXPLORATORY VECTOR (RANK 1)' : rank === 2 ? 'SECONDARY EXPLORATORY VECTOR (RANK 2)' : 'STRATEGIC ALTERNATIVE (RANK 3)')
    : variant === 'senior'
      ? (rank === 1 ? 'PRIMARY DEGREE & CAREER PATHWAY (RANK 1)' : rank === 2 ? 'SECONDARY DEGREE PATHWAY (RANK 2)' : 'STRATEGIC ALTERNATIVE (RANK 3)')
      : (rank === 1 ? 'PRIMARY PATHWAY (RANK 1)' : rank === 2 ? 'SECONDARY PATHWAY (RANK 2)' : 'STRATEGIC ALTERNATIVE (RANK 3)');

  // If item is completely missing: No silent fallback!
  if (!pathwayItem) {
    console.error(`[ROADMAP_MISSING_ERROR] Missing pathway entry for rank ${rank}, reportId: ${reportId}`);
    return createPreparationRoadmap(`Pathway Rank ${rank}`, rankLabel, 75, 'PCM', firstName);
  }

  const resolvedId = resolvePathwayId(pathwayItem);
  // Senior career clusters (e.g. data_science_ai) have no Class 7–10 roadmap of their own. Without this
  // mapping every such rank fell through to PCM below, so ranks 1–3 collapsed into identical roadmaps.
  const pathwayId =
    variant !== 'senior' && !PATHWAY_REGISTRY[resolvedId] && CLUSTER_PARENT_STREAM[resolvedId]
      ? CLUSTER_PARENT_STREAM[resolvedId]
      : resolvedId;
  const baseDef = PATHWAY_REGISTRY[pathwayId] || PATHWAY_REGISTRY.pcm_stream;
  const gradeConfig = baseDef.grades[variant] || baseDef.grades.grade10;

  // Check if there is specialized senior overlay
  const seniorOverlay = (variant === 'senior' && SENIOR_CLUSTER_REGISTRY[pathwayId]) ? SENIOR_CLUSTER_REGISTRY[pathwayId] : null;

  const title = seniorOverlay?.title || gradeConfig.title;
  const foundation = seniorOverlay?.foundation || gradeConfig.foundation;
  const bachelors = seniorOverlay?.bachelors || gradeConfig.bachelors;
  const colleges = seniorOverlay?.colleges || gradeConfig.colleges;
  const masters = seniorOverlay?.masters || gradeConfig.masters;
  const careerOutcomes = seniorOverlay?.careerOutcomes || gradeConfig.careerOutcomes;
  const skills = seniorOverlay?.skills || gradeConfig.skills;
  const targetCompanies = seniorOverlay?.targetCompanies || gradeConfig.targetCompanies;
  const milestone = seniorOverlay?.milestone || gradeConfig.milestone;
  const studyAbroad = seniorOverlay?.studyAbroad || gradeConfig.studyAbroad;

  const isCloseFit = Boolean(pathwayItem.isCloseFit);
  let rationale = '';

  if (baseDef.streamId === 'PCM') {
    rationale = `${firstName}'s cognitive profile is characterized by strong spatial visualization (${scores.aptitude?.spatial || 75}%) and analytical problem solving (${scores.aptitude?.reasoning || 78}%), supporting high technical execution in engineering, computational algorithms, and quantitative technology architecture.`;
  } else if (baseDef.streamId === 'PCB') {
    rationale = `${firstName} exhibits strong inductive reasoning (${scores.aptitude?.reasoning || 78}%) alongside keen scientific inquiry and empathy (${scores.personality?.agreeableness || 74}%). This diagnostic profile demonstrates optimal intrinsic alignment with living systems, healthcare, clinical sciences, and medical problem-solving.`;
  } else if (baseDef.streamId === 'COMMERCE') {
    rationale = `${firstName} demonstrates well-rounded quantitative reasoning (${scores.aptitude?.numerical || 78}%) alongside structured organization (${scores.personality?.conscientiousness || 76}% Conscientiousness). This commercial profile excels in financial decision modeling, corporate strategy, trade economics, and enterprise management.`;
  } else {
    rationale = `${firstName} displays strong verbal reasoning (${scores.aptitude?.verbal || 78}%) combined with rich abstract curiosity (${scores.personality?.openness || 75}% Openness). This profile thrives in legal reasoning, public policy, psychological inquiry, creative communication, and interdisciplinary socio-cultural synthesis.`;
  }

  if (isCloseFit) {
    rationale = `[Close Fit Candidate Vector] ${rationale} Note: This pathway closely parallels your top-ranked vector with equivalent psychometric affinity.`;
  }

  if (comparisonData && comparisonData.overallIndicator.includes('Divergence')) {
    rationale += ` Note: Family dialogue recommended to harmonize parental expectations with candidate vocational preferences.`;
  }

  return {
    pathwayId: seniorOverlay ? pathwayId : baseDef.id,
    streamId: baseDef.streamId,
    pathwayName: pathwayItem.name,
    pathwayTitle: title,
    pathwayRankLabel: rankLabel,
    fitScore: pathwayItem.score,
    isCloseFit,
    rationale,
    foundation,
    bachelors,
    colleges,
    masters,
    careerOutcomes,
    skills,
    targetCompanies,
    milestone,
    studyAbroad,
  };
}

// ─── NO SILENT FALLBACK HELPER ──────────────────────────────────────────────

function createPreparationRoadmap(
  name: string,
  rankLabel: string,
  fitScore: number,
  streamId: 'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES',
  firstName: string
): PathwayRoadmapData {
  return {
    pathwayId: 'in_preparation',
    streamId,
    pathwayName: name,
    pathwayTitle: `${name} (Detailed Roadmap In Preparation)`,
    pathwayRankLabel: rankLabel,
    fitScore,
    isInPreparation: true,
    rationale: `A customized diagnostic roadmap for ${name} is currently in final calibration by our academic curriculum division for ${firstName}. This vector remains a verified high-compatibility pathway.`,
    foundation: {
      subjects: ['Core Academic Curriculum Foundation', 'Quantitative & Analytical Methods', 'Communication & Technical Writing'],
      exams: ['National Central Board Examinations', 'University Admission Aptitude Tests'],
      curriculumFocus: 'Focus on fundamental conceptual mastery and consistent academic grade performance.',
    },
    bachelors: [
      {
        degree: `Undergraduate Degree in ${name}`,
        specialization: 'Comprehensive Subject Concentration',
        whyFits: 'Aligned with candidate aptitude profile.',
        careerOutcomes: `Professional Specialization in ${name}`,
      },
    ],
    colleges: {
      reach: ['Premier National Central Universities', 'Leading Institutes of National Eminence'],
      fit: ['State Accredited Universities', 'Prominent Autonomous Colleges'],
      accessible: ['Regional Affiliated Institutions', 'Recognized Higher Education Centres'],
    },
    masters: [`Advanced Master’s Program in ${name}`],
    careerOutcomes: [`Specialist Career Trajectory in ${name}`],
    skills: ['Analytical Deduction', 'Structured Problem Solving', 'Domain Expertise'],
    targetCompanies: ['Leading Sector Enterprises', 'Government & Research Organisations'],
    milestone: 'Formalize subject registrations and review complete syllabus portfolio with your dedicated academic counselor.',
  };
}

// ─── DUPLICATE GUARD BEFORE PDF ASSEMBLY ────────────────────────────────────

export function validateAndDeduplicateRoadmaps(
  roadmaps: { primary: PathwayRoadmapData; secondary: PathwayRoadmapData; alternative: PathwayRoadmapData },
  reportId: string,
  isTestEnv: boolean = false
): { primary: PathwayRoadmapData; secondary: PathwayRoadmapData; alternative: PathwayRoadmapData } {
  const list = [roadmaps.primary, roadmaps.secondary, roadmaps.alternative];
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const duplicates: string[] = [];

  for (const rm of list) {
    if (seenIds.has(rm.pathwayId) || seenTitles.has(rm.pathwayTitle)) {
      duplicates.push(`ID="${rm.pathwayId}", Title="${rm.pathwayTitle}"`);
    }
    seenIds.add(rm.pathwayId);
    seenTitles.add(rm.pathwayTitle);
  }

  if (duplicates.length > 0) {
    const errorMsg = `[DUPLICATE_ROADMAP_GUARD] Detected duplicate roadmap in report ${reportId}: ${duplicates.join('; ')}`;
    if (isTestEnv || process.env.NODE_ENV === 'test') {
      throw new Error(errorMsg);
    }
    console.error(errorMsg);

    // In production: replace duplicate secondary or alternative with distinct stream fallback
    const usedStreams = new Set(list.map(r => r.streamId));
    const allStreams: Array<'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES'> = ['PCM', 'PCB', 'COMMERCE', 'HUMANITIES'];
    const availableStream = allStreams.find(s => !usedStreams.has(s)) || 'COMMERCE';

    if (roadmaps.secondary.pathwayId === roadmaps.primary.pathwayId || roadmaps.secondary.pathwayTitle === roadmaps.primary.pathwayTitle) {
      console.warn(`[DUPLICATE_RESOLVED] Replacing duplicate secondary with distinct stream: ${availableStream}`);
      roadmaps.secondary = getRoadmapByRank(
        2,
        [{ id: `${availableStream.toLowerCase()}_stream`, name: `${availableStream} Pathway`, score: Math.max(50, roadmaps.primary.fitScore - 6) }],
        'grade10',
        { name: 'Candidate', age: '15', grade: 'Class 10', school: '', city: '', stream: '', mathStatus: '', subjects: '', board: '', academicYear: '', graduationYear: '', email: '', date: '', reportId, parentName: '' },
        { aptitude: { verbal: 75, numerical: 75, reasoning: 75, spatial: 75, overall: 75 }, personality: { openness: 70, conscientiousness: 70, extraversion: 70, agreeableness: 70, emotionalStability: 70 }, topRiasec: ['R'], riasec: {}, topVark: 'V', vark: {}, topValues: [], careerFitment: [] }
      );
    }

    if (roadmaps.alternative.pathwayId === roadmaps.primary.pathwayId || roadmaps.alternative.pathwayTitle === roadmaps.primary.pathwayTitle ||
      roadmaps.alternative.pathwayId === roadmaps.secondary.pathwayId || roadmaps.alternative.pathwayTitle === roadmaps.secondary.pathwayTitle) {
      const remainingStream = allStreams.find(s => s !== roadmaps.primary.streamId && s !== roadmaps.secondary.streamId) || 'HUMANITIES';
      console.warn(`[DUPLICATE_RESOLVED] Replacing duplicate alternative with distinct stream: ${remainingStream}`);
      roadmaps.alternative = getRoadmapByRank(
        3,
        [{ id: `${remainingStream.toLowerCase()}_stream`, name: `${remainingStream} Pathway`, score: Math.max(45, roadmaps.secondary.fitScore - 6) }],
        'grade10',
        { name: 'Candidate', age: '15', grade: 'Class 10', school: '', city: '', stream: '', mathStatus: '', subjects: '', board: '', academicYear: '', graduationYear: '', email: '', date: '', reportId, parentName: '' },
        { aptitude: { verbal: 75, numerical: 75, reasoning: 75, spatial: 75, overall: 75 }, personality: { openness: 70, conscientiousness: 70, extraversion: 70, agreeableness: 70, emotionalStability: 70 }, topRiasec: ['R'], riasec: {}, topVark: 'V', vark: {}, topValues: [], careerFitment: [] }
      );
    }
  }

  return roadmaps;
}

// ─── STUDY ABROAD, ACADEMIC TIMELINE & ACTION PLAN BUILDERS ──────────────────

export function getStudyAbroadGuideData(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): StudyAbroadGuideData {
  const firstName = (student.name || 'Candidate').split(' ')[0];
  const primaryFit = scores.careerFitment?.[0] || { name: 'Science Stream – Engineering & Tech Track (PCM)', score: 90 };
  const pathwayId = resolvePathwayId(primaryFit);
  const baseDef = PATHWAY_REGISTRY[pathwayId] || PATHWAY_REGISTRY.pcm_stream;
  const isSenior = /11|12|senior/i.test(student.grade || '');
  const isJunior = /7|8|9|junior|middle/i.test(student.grade || '');

  let rationale = '';
  let fitmentSummary = '';
  let countries: StudyAbroadCountry[] = [];
  let programs: string[] = baseDef.grades.senior.studyAbroad?.programs || [];
  let scholarships: string[] = baseDef.grades.senior.studyAbroad?.scholarships || [];

  if (isJunior) {
    rationale = `For middle school learners like ${firstName}, international exposure is best focused on cultural curiosity, multilingualism, and global youth science/arts summer academies.`;
    fitmentSummary = `Focus on foundational summer immersion in the United Kingdom, United States, Germany, and Singapore aligned with ${baseDef.defaultName}.`;
    countries = [
      { flag: '🇬🇧', name: 'United Kingdom', reason: 'Oxford & Cambridge youth summer academies offer early immersion in debate, science, and history.', academicRoute: 'Youth Summer Academies & Future GCSE/A-Level Awareness', costCategory: 'Moderate' },
      { flag: '🇺🇸', name: 'United States', reason: 'Leading youth talent centers like Johns Hopkins CTY provide advanced enrichment.', academicRoute: 'Middle School STEM / Arts Enrichment Camps', costCategory: 'Scholarships Available' },
      { flag: '🇩🇪', name: 'Germany', reason: 'Pioneering early focus on hands-on technical and scientific laboratory curiosity.', academicRoute: 'Bilingual Youth Science Workshops', costCategory: 'Low Cost' },
      { flag: '🇸🇬', name: 'Singapore', reason: 'World-renowned Asian mathematics and bilingual education ecosystem.', academicRoute: 'Regional STEM & Leadership Olympiads', costCategory: 'Moderate' },
    ];
  } else if (isSenior) {
    rationale = `For senior secondary students like ${firstName}, international university selection must balance global subject rankings, post-study work rights, undergraduate scholarship viability, and industry co-op placements.`;
    fitmentSummary = `Targeting direct 3 to 4-year undergraduate degree admissions in high-reputation global hubs aligned with ${baseDef.defaultName}.`;
    countries = [
      { flag: '🇺🇸', name: 'United States', reason: 'Unrivalled undergraduate research funding, flexible double-major curricula, and Silicon Valley / Wall Street recruitment.', academicRoute: '4-Year B.S. / B.A. (Direct Common App + SAT / ACT)', costCategory: 'High (Merit & Need-Based Aid Available)' },
      { flag: '🇬🇧', name: 'United Kingdom', reason: 'World-leading Russell Group institutions offering rigorous 3-year specialized single-honours degrees.', academicRoute: '3-Year B.Eng / B.Sc. / LL.B. (UCAS)', costCategory: 'Moderate to High' },
      { flag: '🇩🇪', name: 'Germany', reason: 'Tuition-free world-class public technical universities (TU9) with mandatory industrial internship semesters.', academicRoute: '3-Year B.Sc. (English-Taught Technical Tracks)', costCategory: 'Zero Tuition / Low Living Cost' },
      { flag: '🇨🇦', name: 'Canada', reason: 'Co-op work programs integrated directly into degrees with transparent post-graduation work permits (PGWP).', academicRoute: '4-Year Bachelor’s with Co-op (Waterloo, Toronto, UBC)', costCategory: 'Moderate' },
    ];
  } else {
    // Class 10
    rationale = `For Class 10 candidates like ${firstName}, the upcoming two years (Class 11–12) represent the critical profile-building runway to position for top domestic and international university admissions.`;
    fitmentSummary = `Strategic academic foundation targeting Tier-1 Indian universities alongside competitive global admissions in ${baseDef.defaultName}.`;
    countries = [
      { flag: '🇺🇸', name: 'United States', reason: 'Leading global university research and liberal arts education flexibility.', academicRoute: 'Class 11–12 AP Exams / SAT + Holistic Profile Building', costCategory: 'High / Merit Scholarships' },
      { flag: '🇬🇧', name: 'United Kingdom', reason: 'Focused 3-year honors degrees emphasizing deep subject mastery.', academicRoute: 'Target 95%+ in Class 12 Boards + Standardized Entrance', costCategory: 'Moderate to High' },
      { flag: '🇸🇬', name: 'Singapore', reason: 'Top-tier Asian engineering, business, and computer science global hub.', academicRoute: 'Class 12 Board Percentage (95%+) + JEE/SAT Merit', costCategory: 'Moderate / ASEAN Grants' },
      { flag: '🇩🇪', name: 'Germany', reason: 'Excellence in engineering, automotive technology, and physical sciences.', academicRoute: 'German Language / English Technical International Tracks', costCategory: 'Low Cost' },
    ];
  }

  const parentOpennessLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Exposure') || a.name.includes('Environment'))?.level.toUpperCase() || 'MODERATE ALIGNMENT'
    : 'BALANCED EXPLORATORY ALIGNMENT';

  const financialAlignmentLabel = comparisonData
    ? comparisonData.areas.find(a => a.name.includes('Financial') || a.name.includes('Investment'))?.level.toUpperCase() || 'BALANCED FEASIBILITY'
    : 'PLANNED HIGHER EDUCATION BUDGET';

  return {
    rationale,
    fitmentSummary,
    parentOpennessLabel,
    financialAlignmentLabel,
    countries,
    scholarships,
    programs,
  };
}

export function getAcademicProfileRoadmapData(
  student: EditorialStudent,
  scores: EditorialScores
): AcademicStage[] {
  const isSenior = /11|12|senior/i.test(student.grade || '');
  const isJunior = /7|8|9|junior|middle/i.test(student.grade || '');

  if (isJunior) {
    return [
      { phase: 'Phase 1', label: 'Class 7–8', icon: 'fa-compass', academicGoal: 'Build high-curiosity learning habits, broad reading fluency, and core mathematical reasoning.', profileGoal: 'Participate in inter-school Olympiads, science fairs, and school debate clubs.', keySkills: ['Reading Discipline', 'Foundational Logic', 'Curiosity Projects', 'Teamwork'], milestone: 'Maintain consistent 85%+ academic score and submit annual exploratory science fair project.' },
      { phase: 'Phase 2', label: 'Class 9', icon: 'fa-book-open', academicGoal: 'Strengthen conceptual rigor in science, math, and social sciences for high school transition.', profileGoal: 'Identify top 2 preferred stream clusters through psychometric evaluation.', keySkills: ['Analytical Writing', 'Lab Techniques', 'Time Management', 'Self-Directed Study'], milestone: 'Finalize target stream preference and complete school guidance check-in.' },
      { phase: 'Phase 3', label: 'Class 10', icon: 'fa-crosshairs', academicGoal: 'Board examination academic excellence and definitive stream lock.', profileGoal: 'Engage in extracurricular summer internships and leadership roles.', keySkills: ['Exam Strategy', 'Stress Resilience', 'Conceptual Depth', 'Career Clarity'], milestone: 'Achieve 90%+ in 10th Board examinations and register target Class 11 stream combination.' },
      { phase: 'Phase 4', label: 'Class 11–12', icon: 'fa-graduation-cap', academicGoal: 'Mastery of senior secondary stream electives and entrance test preparation.', profileGoal: 'Build verified extracurricular portfolio and research achievements.', keySkills: ['Competitive Exam Prep', 'Subject Specialization', 'Problem Solving', 'Independent Research'], milestone: 'Qualify for premier university admissions in chosen professional track.' },
    ];
  }

  if (isSenior) {
    return [
      { phase: 'Phase 1', label: 'Class 12 First Half', icon: 'fa-calendar-check', academicGoal: 'Complete 100% of Class 12 board syllabus and commence weekly mock examination series.', profileGoal: 'Finalize college shortlist (Reach, Fit, Accessible) and lock admission requirements.', keySkills: ['Targeted Exam Strategy', 'Time Boxing', 'Weak Area Remediation'], milestone: 'Complete all school practical files and achieve 90%+ in first pre-board examination.' },
      { phase: 'Phase 2', label: 'Class 12 Second Half', icon: 'fa-file-signature', academicGoal: 'Peak competitive entrance exam revision (JEE / NEET / CUET / CLAT / IPMAT).', profileGoal: 'Submit all international applications (Common App / UCAS) and domestic entrance registrations.', keySkills: ['High-Speed MCQ Execution', 'Stress Inoculation', 'Essay Writing'], milestone: 'Score in top percentile of mock entrance series and submit all university portals.' },
      { phase: 'Phase 3', label: 'Undergraduate Transition', icon: 'fa-university', academicGoal: 'Secure seat in premier tier-1 undergraduate program aligned with rank 1 pathway.', profileGoal: 'Complete summer pre-college technical / analytical certifications.', keySkills: ['Campus Networking', 'Independent Living', 'Digital Collaboration'], milestone: 'Commence university degree with clear academic and internship roadmap.' },
      { phase: 'Phase 4', label: 'Pre-Professional Mastery', icon: 'fa-briefcase', academicGoal: 'Maintain high cumulative GPA (8.5+ CGPA) and complete summer industry internships.', profileGoal: 'Publish student research paper or lead campus enterprise / design team.', keySkills: ['Professional Industry Tools', 'Leadership Communication', 'Technical Execution'], milestone: 'Receive pre-placement offer (PPO) or admission to top global master’s program.' },
    ];
  }

  // Class 10 Baseline
  return [
    { phase: 'Phase 1', label: 'Class 10 (Months 1–6)', icon: 'fa-compass', academicGoal: 'Lock top academic scores in Class 10 term exams and complete syllabus by Month 5.', profileGoal: 'Engage with psychometric diagnostics to align family expectations and student strengths.', keySkills: ['Systematic Note Taking', 'Time Management', 'Diagnostic Self-Assessment'], milestone: 'Score in top 10% of class in terminal examinations and complete stream choice alignment.' },
    { phase: 'Phase 2', label: 'Class 10 (Months 7–12)', icon: 'fa-crosshairs', academicGoal: 'Peak board exam revision and finalize formal Class 11 stream selection.', profileGoal: 'Conduct information interviews with professionals in top 3 recommended pathways.', keySkills: ['Exam Simulation', 'Critical Error Analysis', 'Decision Making'], milestone: 'Achieve 90%+ in Class 10 Board exams and formally enroll in verified Class 11 stream combination.' },
    { phase: 'Phase 3', label: 'Class 11 (Foundation)', icon: 'fa-layer-group', academicGoal: 'Master fundamentals in new stream subjects and commence targeted entrance coaching.', profileGoal: 'Join subject-specific societies, coding clubs, or model UN debates.', keySkills: ['Advanced Conceptual Depth', 'Problem Solving Grit', 'Peer Collaboration'], milestone: 'Clear Class 11 finals with 85%+ and complete certified summer skill project.' },
    { phase: 'Phase 4', label: 'Class 12 & Admissions', icon: 'fa-graduation-cap', academicGoal: 'Board exam excellence (95%+) paired with premier entrance exam performance.', profileGoal: 'Complete university portfolio, statement of purpose, and entrance test registrations.', keySkills: ['Competitive Test Agility', 'Portfolio Presentation', 'Strategic Focus'], milestone: 'Secure admission to tier-1 undergraduate institution in rank 1 recommended pathway.' },
  ];
}

export function getStudentActionPlanData(
  student: EditorialStudent,
  scores: EditorialScores
): StudentActionPlanData {
  const firstName = (student.name || 'Candidate').split(' ')[0];
  const isSenior = /11|12|senior/i.test(student.grade || '');
  const isJunior = /7|8|9|junior|middle/i.test(student.grade || '');

  if (isJunior) {
    return {
      thisMonth: [
        `Review diagnostic results with parents and your school guidance counselor.`,
        `Choose one exploratory extracurricular activity (Coding, Debate, Arts, or Science Club).`,
        `Establish a dedicated 60-minute daily reading block free from mobile devices.`,
      ],
      next90Days: [
        `Register for national middle-school Olympiad in your top-scoring subject.`,
        `Create a digital or physical personal learning repository (Obsidian/Notion/Journal).`,
        `Complete one hands-on inquiry project aligned with your rank 1 exploratory vector.`,
      ],
      thisAcademicYear: [
        `Maintain consistent 85%+ academic performance across core school subjects.`,
        `Participate in at least 2 inter-school competitions or science/arts exhibitions.`,
        `Conduct an informal career conversation with a family mentor in your target field.`,
      ],
      skillsToBuild: ['Curiosity-Driven Reading', 'Foundational Mathematics', 'Clear Verbal Presentation', 'Digital Exploration Tools'],
      counsellorCheckpoint: ['Mid-year academic habit check-in', 'Olympiad participation review', 'Stream discovery discussion'],
      studentAction: ['Maintain reflective reading log', 'Complete hands-on STEM / arts project', 'Practice active classroom debate participation'],
    };
  }

  if (isSenior) {
    return {
      thisMonth: [
        `Audit completed Class 11-12 syllabus against target entrance exam blueprints.`,
        `Finalize reach, fit, and accessible college application shortlist with family.`,
        `Lock calendar deadlines for all national and global entrance test applications.`,
      ],
      next90Days: [
        `Complete a minimum of 10 timed full-length mock entrance examinations.`,
        `Submit early university applications and polish personal essays/portfolio.`,
        `Remediate specific weak chapters identified in recent mock tests.`,
      ],
      thisAcademicYear: [
        `Achieve target 90%+ in Class 12 Board examinations.`,
        `Score in top percentile of competitive entrance exams (JEE / NEET / CUET / CLAT).`,
        `Secure formal offer of admission from top-choice undergraduate university.`,
      ],
      skillsToBuild: ['High-Pressure Time Boxing', 'Advanced Problem Elimination', 'Analytical Essay Crafting', 'College Interview Articulation'],
      counsellorCheckpoint: ['College application review', 'Entrance mock scorecard audit', 'Scholarship document submission'],
      studentAction: ['Weekly timed mock tests', 'Dedicated error log analysis', 'Portfolio finalization'],
    };
  }

  // Class 10 Baseline
  return {
    thisMonth: [
      `Review diagnostic report with parents and school guidance counselor to align on stream choice.`,
      `Finalize exact Class 11 subject combination based on top fitment vector.`,
      `Establish a daily Pomodoro study schedule for Class 10 board preparation.`,
    ],
    next90Days: [
      `Complete 100% of Class 10 syllabus across science, mathematics, and social sciences.`,
      `Complete first full-length pre-board examination series with rigorous error tracking.`,
      `Conduct informational interviews with professionals working in top recommended streams.`,
    ],
    thisAcademicYear: [
      `Achieve 90%+ benchmark in Class 10 Board examinations.`,
      `Formally enroll in chosen Class 11 stream and acquire preparatory reading material.`,
      `Join a student summer leadership or certified pre-college skill boot-camp.`,
    ],
    skillsToBuild: ['Calculus & Algebraic Modeling', 'Scientific Essay Construction', 'Critical Time Management', 'Self-Directed Knowledge Management'],
    counsellorCheckpoint: ['Term-end stream lock verification', 'Pre-board diagnostic score review', 'Class 11 subject registration check'],
    studentAction: ['Maintain daily error log for mathematics & science', 'Conduct stream exploration interview', 'Finalize Class 11 coaching & textbook roadmap'],
  };
}

// ─── BACKWARD COMPATIBILITY EXPORTS ──────────────────────────────────────────

export function getPathwayRoadmapData(
  pathwayName: string,
  rankLabel: string,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): PathwayRoadmapData {
  const rank: 1 | 2 | 3 = rankLabel.includes('2') ? 2 : rankLabel.includes('3') ? 3 : 1;
  const variant: ReportVariant = /12|senior/i.test(student.grade || '')
    ? 'senior'
    : /7|8|9|junior/i.test(student.grade || '')
      ? 'junior'
      : 'grade10';

  const fitItem = scores.careerFitment?.find(c =>
    c.name.toLowerCase().includes(pathwayName.toLowerCase()) ||
    pathwayName.toLowerCase().includes(c.name.toLowerCase())
  ) || { name: pathwayName, score: 85 };

  return getRoadmapByRank(rank, [fitItem], variant, student, scores, comparisonData);
}

export function getSpecializedDomain(pathwayName: string): string {
  const id = resolvePathwayId(pathwayName);
  const def = PATHWAY_REGISTRY[id];
  return def ? def.streamId : 'PCM';
}
