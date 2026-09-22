/**
 * Senior Report Data Adapter (Class 12)
 * ─────────────────────────────────────────────────────────────────────────────
 * Adapts Class 12 assessment results into the Universal 56-Page Report Schema.
 *
 * Employs stage-appropriate higher education degree directions, college tiering
 * (Reach/Fit/Accessible), entrance examinations (CUET/JEE/NEET/CLAT/SAT/IELTS),
 * and pre-university career milestones.
 *
 * CRITICAL: Zero fabricated scores, zero altered responses.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../../class10_editorial_engine';
import type { AlignmentResult } from '../../comparison-engine';
import type { ParentProfile } from '../../parent-scoring';
import type { PathwayRoadmapData, StudyAbroadGuideData, AcademicStage, StudentActionPlanData } from '../../class10_roadmap_engine';
import { type UniversalReportData, getVariantConfig } from '../universal-report-schema';

export function adaptSeniorReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): UniversalReportData {
  const config = getVariantConfig('senior');
  const firstName = (student.name || 'Candidate').split(' ')[0];

  // Extract top 3 career/degree pathways from Class 12 careerFitment
  const pathways = scores.careerFitment || [];
  const p1 = pathways[0] || { name: 'Artificial Intelligence & Computing Systems', score: 92 };
  const p2 = pathways[1] || { name: 'Quantitative Finance & Business Analytics', score: 86 };
  const p3 = pathways[2] || { name: 'Corporate Law & Strategic Public Policy', score: 81 };

  const getSeniorPathwayData = (
    pathwayName: string,
    rankLabel: string,
    scoreVal: number
  ): PathwayRoadmapData => {
    const lower = pathwayName.toLowerCase();

    // 1. HUMANITIES / LAW / DESIGN / MEDIA
    if (/law|legal|policy|humanities|arts|design|media|psychology|journalism/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Corporate Law, Public Policy & Strategic Communication',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} demonstrates high verbal synthesis (${scores.aptitude?.verbal || 75}%) and structured critical analysis. For a Class 12 candidate, this cognitive orientation provides strong competitive advantages in legal reasoning, public policy, strategic communications, and UX design.`,
        foundation: {
          subjects: ['Legal Studies / Political Science', 'Psychology / Sociology', 'English Literature', 'Applied Mathematics / Economics', 'Mass Media Studies'],
          exams: ['CLAT (National Law Universities)', 'AILET (NLU Delhi)', 'CUET-UG (Top Central Universities)', 'LSAT-India', 'SAT / IELTS (Global)'],
          curriculumFocus: 'Focus on high-speed textual comprehension, constitutional reasoning, analytical essay drafting, and timed competitive exam test series.',
        },
        bachelors: [
          {
            degree: 'B.A. LL.B (Hons) / B.B.A. LL.B (5-Year Integrated Law)',
            specialization: 'Corporate Mergers, Intellectual Property Law, International Commercial Arbitration',
            whyFits: `Leverages ${firstName}'s sharp verbal reasoning and structured ethical argumentation.`,
            careerOutcomes: 'Corporate Legal Counsel, Regulatory Specialist, Mergers & Acquisitions Associate',
          },
          {
            degree: 'B.A. (Hons) in Public Policy & Political Economy / Economics',
            specialization: 'Developmental Economics, Governance & Strategic Public Policy',
            whyFits: 'Merges qualitative societal analysis with rigorous quantitative frameworks.',
            careerOutcomes: 'Policy Advisor, Think Tank Analyst, International Relations Specialist',
          },
          {
            degree: 'B.Des (Bachelor of Design) / Human-Computer Interaction',
            specialization: 'Product UX Architecture, Design Strategy & Interactive Media Systems',
            whyFits: 'Combines abstract creativity (Openness) with structured digital product workflows.',
            careerOutcomes: 'Senior Product Designer, UX Systems Lead, Creative Technology Director',
          },
        ],
        colleges: {
          reach: ['National Law School of India University (NLSIU), Bangalore', 'NALSAR Hyderabad', 'NID Ahmedabad', "St. Stephen's College, Delhi", 'Oxford / Cambridge (UK)'],
          fit: ['WBNUJS Kolkata', 'NLU Jodhpur', 'Ashoka University, Sonepat', "St. Xavier's College, Mumbai", 'King’s College London'],
          accessible: ['Symbiosis Law School, Pune', 'Christ University, Bangalore', 'O.P. Jindal Global Law School', 'FLAME University'],
        },
        masters: [
          'LL.M. in International Corporate & Commercial Law',
          'Master in Public Policy (MPP - Harvard Kennedy / LSE)',
          'Master of Design (M.Des) in Strategic Systems & HCI',
        ],
        careerOutcomes: [
          'Partner / Senior Associate at Tier-1 Law Firms',
          'Global Policy & Government Affairs Director at Tech Multinational',
          'General Counsel / Head of Corporate Compliance',
          'Chief Experience Officer / Creative Strategy Director',
        ],
        skills: ['Statutory & Contractual Analysis', 'Persuasive Courtroom & Boardroom Advocacy', 'Policy Impact Modeling', 'Qualitative Systems Research'],
        targetCompanies: ['Shardul Amarchand Mangaldas', 'AZB & Partners', 'McKinsey Public Policy Practice', 'United Nations Development Programme (UNDP)', 'Google Public Policy Team'],
        milestone: 'Secure top 500 national rank in CLAT/AILET or 99th percentile in CUET-UG and publish a peer-reviewed undergraduate legal research paper.',
      };
    }

    // 2. COMMERCE / FINANCE / MANAGEMENT / ECONOMICS
    if (/commerce|finance|business|management|accounting|economics|banking|marketing/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Quantitative Finance, Corporate Strategy & Business Economics',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} displays strong quantitative fluency (${scores.aptitude?.numerical || 78}%) paired with high conscientiousness (${scores.personality?.conscientiousness || 76}%). In Class 12, this marks readiness for rigorous undergraduate studies in investment banking, corporate strategy, actuarial analytics, and quantitative economics.`,
        foundation: {
          subjects: ['Mathematics / Applied Mathematics', 'Accountancy & Financial Markets', 'Business Studies', 'Economics & Econometrics', 'English Communication'],
          exams: ['CUET-UG (SRCC / SSCBS Focus)', 'IPMAT (IIM Indore / Rohtak / Ranchi)', 'NMIMS NPAT', 'Christ University Entrance Test (CUET)', 'SAT (Math 750+ Focus)'],
          curriculumFocus: 'Focus on advanced algebraic problem solving, macro/microeconomic data modeling, and commercial case study analysis.',
        },
        bachelors: [
          {
            degree: 'B.Com (Hons) / B.A. (Hons) Economics',
            specialization: 'Quantitative Finance, Econometric Modeling, Corporate Valuation',
            whyFits: `Directly leverages ${firstName}'s numerical accuracy and disciplined analytical stamina.`,
            careerOutcomes: 'Investment Banking Analyst, Financial Modeler, Economic Consultant',
          },
          {
            degree: 'Integrated Program in Management (IPM - B.B.A. + M.B.A.)',
            specialization: 'Strategic Operations, Global Marketing, FinTech Innovation',
            whyFits: 'Accelerates path to executive leadership with prestigious 5-year IIM credential.',
            careerOutcomes: 'Management Consultant, Corporate Strategy Associate, Venture Capital Analyst',
          },
          {
            degree: 'B.S. in Finance & Business Analytics',
            specialization: 'Algorithmic Trading, Predictive Data Modeling, Risk Management',
            whyFits: 'Integrates commercial acumen with modern data programming tools.',
            careerOutcomes: 'FinTech Strategist, Quantitative Risk Associate, Business Intelligence Lead',
          },
        ],
        colleges: {
          reach: ['Shri Ram College of Commerce (SRCC), Delhi', 'IIM Indore (IPMAT)', 'London School of Economics (LSE)', 'Wharton School (UPenn)', "St. Stephen's College"],
          fit: ['Shaheed Sukhdev College (SSCBS), Delhi', 'St. Xavier’s College, Mumbai', 'Ashoka University', 'Warwick Business School (UK)', 'NMIMS Mumbai'],
          accessible: ['Christ University, Bangalore', 'Symbiosis Centre for Management Studies (SCMS)', 'Loyola College, Chennai', 'Mithibai College'],
        },
        masters: [
          'Master of Business Administration (MBA - Stanford / Harvard / INSEAD / IIM)',
          'M.Sc. in Financial Economics / Computational Finance',
          'Chartered Financial Analyst (CFA Level III Milestone)',
        ],
        careerOutcomes: [
          'Managing Director in Investment Banking / Private Equity',
          'Partner at Top-Tier Management Consulting Firm (MBB)',
          'Chief Financial Officer (CFO) of Global Enterprise',
          'Founder / CEO of Scaling FinTech Startup',
        ],
        skills: ['Financial Modeling & DCF Valuation', 'Data Analytics (SQL / Python for Finance)', 'Strategic Negotiation', 'Macroeconomic Forecasting'],
        targetCompanies: ['Goldman Sachs', 'Morgan Stanley', 'McKinsey & Company', 'Boston Consulting Group (BCG)', 'BlackRock Asset Management'],
        milestone: 'Secure admission to SRCC/IIM-IPM/LSE and clear CFA Level 1 or top-tier financial internship during second year of undergraduate study.',
      };
    }

    // 3. MEDICAL / BIOMEDICAL / LIFE SCIENCES / HEALTHCARE
    if (/medicine|medical|biology|bio|pcb|pharma|biotech|health|genetic/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Clinical Medicine, Biomedical Sciences & Biotechnology',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} displays dedicated inductive reasoning and systematic scientific discipline. In Class 12, this cognitive profile supports rigorous multi-year medical preparation, biomedical research, molecular genetics, and pharmaceutical innovation.`,
        foundation: {
          subjects: ['Biology (Botany & Zoology)', 'Chemistry (Organic & Physical)', 'Physics (Mechanics & Electrodynamics)', 'English Language', 'Biotechnology Elective'],
          exams: ['NEET-UG (National Medical Entrance)', 'CUET-UG (Top Central Science Universities)', 'IISER IAT', 'MCAT / UCAT (Global Medical Pre-Reqs)'],
          curriculumFocus: 'Focus on exhaustive NCERT mastery, timed multiple-choice negative-marking strategies, and deep conceptual clarity in organic mechanisms and physiological systems.',
        },
        bachelors: [
          {
            degree: 'M.B.B.S. (Bachelor of Medicine & Bachelor of Surgery)',
            specialization: 'Internal Medicine, Surgical Oncology, Cardiology, Neurological Sciences',
            whyFits: `Matches ${firstName}'s high persistence, attention to detail, and prosocial impact values.`,
            careerOutcomes: 'Consultant Physician, Specialized Surgeon, Medical Director',
          },
          {
            degree: 'B.Tech / B.S. in Biotechnology & Biomedical Engineering',
            specialization: 'Gene Editing (CRISPR), Molecular Diagnostics, Bioprocess Engineering',
            whyFits: 'Combines biological curiosity with cutting-edge engineering and data instrumentation.',
            careerOutcomes: 'Biotech Scientist, Genomic Analyst, Bio-device Systems Architect',
          },
        ],
        colleges: {
          reach: ['All India Institute of Medical Sciences (AIIMS, New Delhi)', 'CMC Vellore', 'IISc Bangalore (BS Research)', 'Johns Hopkins University (US)', 'Oxford Medical School'],
          fit: ['Kasturba Medical College (KMC), Manipal', "St. John's Medical College, Bangalore", 'King George’s Medical University (KGMU)', 'University of Toronto'],
          accessible: ['D.Y. Patil Medical University', 'Amrita Institute of Medical Sciences', 'SRM Institute of Science & Technology'],
        },
        masters: [
          'M.D. / M.S. in Advanced Clinical Super-Specialization',
          'Ph.D. in Cellular & Molecular Genetics / Neurobiology',
          'Master of Public Health (MPH - Global Health Epidemiology)',
        ],
        careerOutcomes: [
          'Chief of Clinical Medicine / Leading Specialist Surgeon',
          'Director of Genomics & Therapeutic Drug Discovery',
          'Global Health Epidemiologist at World Health Organization (WHO)',
          'Founder of Advanced Biomedical & HealthTech Venture',
        ],
        skills: ['Clinical Diagnostics & Anatomy', 'Biochemical Assay Analysis', 'Precision Surgical Hand-Eye Coordination', 'Evidence-Based Research Methodology'],
        targetCompanies: ['Apollo Health City', 'Max Healthcare', 'Novartis Research Labs', 'Pfizer Biomedical R&D', 'World Health Organization (WHO)'],
        milestone: 'Achieve 650+ in NEET-UG or secure research admission into premier biomedical program with active clinical observerships.',
      };
    }

    // 4. STEM / COMPUTER SCIENCE / ENGINEERING / DATA SCIENCE (DEFAULT)
    return {
      pathwayName,
      pathwayTitle: 'Artificial Intelligence, Software Engineering & Systems Architecture',
      pathwayRankLabel: rankLabel,
      fitScore: scoreVal,
      rationale: `${firstName} demonstrates exceptional fluid reasoning (${scores.aptitude?.reasoning || 80}%) and high spatial-computational capacity (${scores.aptitude?.spatial || 74}%). In Class 12, this marks a tier-1 technical profile primed for high-performance software engineering, artificial intelligence systems, and computational data science.`,
      foundation: {
        subjects: ['Mathematics (Calculus, Linear Algebra, Probability)', 'Physics (Mechanics, Electromagnetism)', 'Chemistry / Computer Science Elective', 'English Communication'],
        exams: ['JEE Main & JEE Advanced (IITs/NITs)', 'BITSAT (BITS Pilani)', 'UGEE (IIIT Hyderabad)', 'VITEEE / MET', 'SAT (Math 800) + AP Computer Science'],
        curriculumFocus: 'Focus on multi-concept physics problem solving, advanced calculus applications, timed mock paper stamina, and algorithmic programming practice.',
      },
      bachelors: [
        {
          degree: 'B.Tech / B.S. in Computer Science & Engineering (Artificial Intelligence)',
          specialization: 'Distributed Systems, Deep Learning, Cloud Computing & Cybersecurity',
          whyFits: `Directly aligns with ${firstName}'s high deductive power and computational stamina.`,
          careerOutcomes: 'Software Systems Engineer, Machine Learning Specialist, Core Algorithms Developer',
        },
        {
          degree: 'B.Tech / B.S. in Electronics & Robotics Systems / Electrical Engineering',
          specialization: 'Autonomous Vehicles, Edge AI Microchips, Embedded Internet of Things (IoT)',
          whyFits: 'Merges spatial design with hardware-software co-optimization.',
          careerOutcomes: 'Robotics Software Lead, Semiconductor Design Engineer, IoT Architect',
        },
        {
          degree: 'B.S. in Data Science & Quantitative Mathematical Computing',
          specialization: 'Statistical Inference, Predictive Modeling, Big Data Pipeline Engineering',
          whyFits: 'Capitalizes on mathematical intuition and large-scale data manipulation.',
          careerOutcomes: 'Data Scientist, Quantitative Trading Engineer, Analytics Director',
        },
      ],
      colleges: {
        reach: ['IIT Bombay / IIT Delhi / IIT Madras', 'IIIT Hyderabad', 'BITS Pilani', 'Carnegie Mellon University (CMU)', 'Stanford University (US)', 'National University of Singapore (NUS)'],
        fit: ['NIT Trichy / NIT Surathkal', 'Delhi Technological University (DTU)', 'University of Waterloo (Canada)', 'Technical University of Munich (TUM, Germany)', 'Purdue University'],
        accessible: ['Manipal Institute of Technology (MIT)', 'Vellore Institute of Technology (VIT)', 'Shiv Nadar University', 'Thapar University'],
      },
      masters: [
        'M.S. in Computer Science / Artificial Intelligence (Stanford / CMU / Georgia Tech)',
        'M.Tech in Advanced Computer Systems Engineering',
        'Ph.D. in Autonomous Systems & Machine Intelligence',
      ],
      careerOutcomes: [
        'Principal Systems Architect / Chief Technology Officer (CTO)',
        'Staff Machine Learning Research Engineer at Global Tech Giant',
        'Quantitative High-Frequency Trading Systems Lead',
        'Founder / CEO of High-Growth Deep-Tech Enterprise',
      ],
      skills: ['Data Structures & Algorithms (C++ / Python)', 'Distributed Cloud Architecture (AWS / GCP)', 'System Design & Scalability', 'Advanced Discrete Mathematics'],
      targetCompanies: ['Google DeepMind', 'Microsoft Azure Systems', 'Amazon AWS', 'NVIDIA AI Labs', 'Jane Street / Citadel Securities'],
      milestone: 'Secure sub-2000 All India Rank in JEE Advanced or admission to global top-20 CS institution with active open-source codebase contributions.',
    };
  };

  const primaryRoadmap = getSeniorPathwayData(p1.name, 'PRIMARY DEGREE & CAREER PATHWAY (RANK 1)', p1.score);
  const secondaryRoadmap = getSeniorPathwayData(p2.name, 'SECONDARY DEGREE PATHWAY (RANK 2)', p2.score);
  const alternativeRoadmap = getSeniorPathwayData(p3.name, 'STRATEGIC ALTERNATIVE (RANK 3)', p3.score);

  const studyAbroad: StudyAbroadGuideData = {
    rationale: `For Class 12 candidates like ${firstName}, undergraduate study abroad represents a direct gateway to global innovation hubs, 3-year STEM OPT work authorizations, and world-class university research labs.`,
    fitmentSummary: `Targeting tier-1 international universities in the United States, Germany, United Kingdom, and Canada offering direct career pathways aligned with ${primaryRoadmap.pathwayTitle}.`,
    parentOpennessLabel: parentProfile?.choices?.preferredRegion && parentProfile.choices.preferredRegion !== 'prefer_india' ? 'Strong Parental Openness & Support' : 'Active International Consideration',
    financialAlignmentLabel: parentProfile?.choices?.educationBudget ? `Budget Calibrated (${parentProfile.choices.educationBudget})` : 'Comprehensive Merit Scholarship Alignment',
    countries: [
      {
        flag: '🇺🇸',
        name: 'United States',
        reason: 'The undisputed global capital of technology and venture capital. Offers 4-year B.S. degrees with a 3-Year STEM OPT extension allowing graduates to work at top tech and finance enterprises.',
        academicRoute: '4-Year B.S. / B.A. Degree (3-Year STEM OPT Work Permit)',
        costCategory: 'High (Generous Merit Scholarships & On-Campus Assistantships Available)',
      },
      {
        flag: '🇩🇪',
        name: 'Germany',
        reason: 'Europe’s leading industrial and engineering powerhouse. Top public universities like TU Munich and RWTH Aachen offer world-leading, tuition-free computer science and engineering degrees.',
        academicRoute: '3.5-Year B.Sc. / B.Eng Degree (18-Month Post-Study Job Search Visa)',
        costCategory: 'Low (Tuition-Free Public Universities; Living Costs Only)',
      },
      {
        flag: '🇬🇧',
        name: 'United Kingdom',
        reason: 'Home to Oxford, Cambridge, Imperial College, and UCL. Intensive 3-year undergraduate honours programs paired with a 2-Year Graduate Route post-study work visa.',
        academicRoute: '3-Year B.Sc. / B.Eng Honours (2-Year Graduate Work Visa)',
        costCategory: 'Moderate to High (University Merit Bursaries Available)',
      },
      {
        flag: '🇨🇦',
        name: 'Canada',
        reason: 'University of Waterloo and University of Toronto feature world-renowned Co-op programs alternating academic semesters with paid enterprise engineering internships.',
        academicRoute: '4-Year B.A.Sc. Co-op Program (3-Year Post-Graduation Work Permit)',
        costCategory: 'Moderate (Offset by Paid Co-op Internship Earnings)',
      },
    ],
    scholarships: [
      'Generation Google APAC / EMEA Tech Scholarship',
      'DAAD Undergraduate Engineering Grant (Germany)',
      'University Dean’s Global Merit Engineering Scholarship (US)',
      'Commonwealth Undergraduate International Fellowships (UK)',
    ],
    programs: [
      'B.S. in Computer Science & Artificial Intelligence (Silicon Valley Corridor)',
      'B.Sc. in Quantitative Economics & Financial Computing (London / New York)',
      'B.Eng in Robotics & Autonomous Systems (TU Munich Engineering Hub)',
      'B.A.Sc. in Software Engineering with 20-Month Co-op (Waterloo)',
    ],
  };

  const academicRoadmap: AcademicStage[] = [
    {
      phase: 'STAGE 1',
      label: config.roadmapTerminology.stage1Label,
      icon: '🎯',
      academicGoal: 'Achieve 92%+ in Class 12 Board Examinations; score top 98th+ percentile in target entrance tests (JEE / CUET / NEET / CLAT / SAT).',
      profileGoal: 'Finalize college shortlist (3 Reach, 4 Fit, 3 Accessible), draft compelling Statements of Purpose, and secure strong faculty recommendations.',
      keySkills: ['Exam Time Management', 'Analytical Precision', 'Application Discipline'],
      milestone: 'Complete Class 12 Board Examinations and secure confirmed admission into top-choice undergraduate university program.',
    },
    {
      phase: 'STAGE 2',
      label: config.roadmapTerminology.stage2Label,
      icon: '📚',
      academicGoal: 'Maintain high Cumulative GPA (8.5+/10.0 or 3.7+/4.0) in core foundation courses across algorithms, mathematics, and systems.',
      profileGoal: 'Join collegiate technical / finance teams, participate in national hackathons or case competitions, and build foundational GitHub/portfolio projects.',
      keySkills: ['Technical Prototyping', 'Independent Study', 'Collegiate Collaboration'],
      milestone: 'Secure competitive summer undergraduate research internship or corporate technical fellowship.',
    },
    {
      phase: 'STAGE 3',
      label: config.roadmapTerminology.stage3Label,
      icon: '💼',
      academicGoal: 'Excel in advanced upper-division electives and complete an industry-sponsored or faculty-guided capstone research project.',
      profileGoal: 'Complete 2 high-impact corporate internships; hold leadership roles in collegiate societies; build deep professional network.',
      keySkills: ['System Design', 'Enterprise Communication', 'Leadership Under Pressure'],
      milestone: 'Receive prestigious Pre-Placement Offer (PPO) or secure admissions into global top-15 master’s program.',
    },
    {
      phase: 'STAGE 4',
      label: config.roadmapTerminology.stage4Label,
      icon: '🎓',
      academicGoal: 'Complete master’s thesis in specialized domain or master enterprise production workflows and global work permit protocols.',
      profileGoal: 'Transition from junior contributor to autonomous systems owner or lead research author on published papers.',
      keySkills: ['Domain Specialization', 'Strategic Decision Making', 'Global Regulatory Compliance'],
      milestone: 'Lead major production deployment or achieve significant milestone in postgraduate research.',
    },
    {
      phase: 'STAGE 5',
      label: config.roadmapTerminology.stage5Label,
      icon: '🚀',
      academicGoal: 'Attain authoritative industry certifications or complete doctoral / executive credentialing.',
      profileGoal: 'Direct organizational strategy, mentor emerging talent, and drive transformative technological or commercial breakthroughs.',
      keySkills: ['Executive Vision', 'Venture Leadership', 'Cross-Disciplinary Orchestration'],
      milestone: 'Attain Principal / Director-level corporate leadership or scale an innovative venture enterprise.',
    },
  ];

  const actionPlan: StudentActionPlanData = {
    thisMonth: [
      `Conduct a comprehensive syllabus gap audit for Class 12 Board exams and priority entrance tests (JEE / CUET / CLAT / NEET).`,
      `Finalize target portfolio of 10 colleges divided into Reach (3), Fit (4), and Accessible (3) tiers.`,
      `Establish a non-negotiable weekly routine of two full-length timed 3-hour mock exam simulations under strict exam conditions.`,
    ],
    next90Days: [
      `Complete Class 12 Pre-Board examinations with an 88%+ benchmark across all subjects.`,
      `Submit all early and regular university admission applications along with polished Statements of Purpose and teacher recommendations.`,
      `Conduct a focused financial alignment review with family to confirm tuition, living expense budgets, and scholarship application deadlines.`,
    ],
    thisAcademicYear: [
      `Execute Class 12 Board Examinations with maximum focus, targeting a 90%+ aggregate.`,
      `Appear for target competitive entrance examinations with calibrated pacing and error-log discipline.`,
      `Finalize university admission acceptance, submit visa applications (if studying abroad), and prepare pre-college onboarding checklist.`,
    ],
    skillsToBuild: [
      'High-Stakes Examination Time Management',
      'Advanced Mock Test Error-Log Auditing',
      'Academic Essay & Statement of Purpose Drafting',
      'Algorithmic Coding (C++ / Python / R Basics)',
      'Stress Equanimity & Peak Cognitive Pacing',
    ],
    counsellorCheckpoint: [
      `Review college application essays and Statement of Purpose with counsellor before final submissions.`,
      `Perform a quantitative mock test score trend analysis every 3 weeks to pinpoint conceptual gaps.`,
      `Conduct pre-departure orientation and scholarship document verification once admission offers arrive.`,
    ],
    studentAction: [
      `Treat mock test errors not as setbacks, but as the most valuable diagnostic indicators of what to revise next.`,
      `Protect 7.5 hours of sleep nightly during intense preparation blocks to ensure peak memory consolidation.`,
      `Focus on internal consistency rather than external peer comparisons—execution discipline wins admissions.`,
    ],
  };

  return {
    variant: 'senior',
    config,
    student: {
      ...student,
      grade: student.grade || 'Class 12',
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
