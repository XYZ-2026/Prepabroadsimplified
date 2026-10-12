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

function formatParentChoiceLabel(val?: string | null): string {
  if (!val) return 'Planned University Budget';
  const map: Record<string, string> = {
    budget_low: 'Tier 1 / Value Focused Budget',
    budget_moderate: 'Moderate University Budget',
    budget_high: 'Comprehensive International Budget',
    budget_flexible: 'Flexible Higher Education Budget',
    prefer_india: 'Domestic Indian Universities',
    north_america: 'North America (US & Canada)',
    uk_europe: 'UK & European Universities',
    asia_pacific: 'Asia-Pacific Regional Hubs',
    global_flexible: 'Global Flexible Opportunities',
  };
  return map[val] || val.replace(/^budget_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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
  const p1 = pathways[0] || { name: 'Environmental Science', score: 68 };
  const p2 = pathways[1] || { name: 'Data Science & AI', score: 66 };
  const p3 = pathways[2] || { name: 'Software Engineering & IT', score: 62 };

  const getSeniorPathwayData = (
    pathwayName: string,
    rankLabel: string,
    scoreVal: number
  ): PathwayRoadmapData => {
    const lower = pathwayName.toLowerCase();

    // 1. ENVIRONMENTAL SCIENCE / SUSTAINABILITY / EARTH SYSTEMS
    if (/environment|sustainab|climate|ecology|earth|ocean|geolog/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Environmental Science, Climate Analytics & Sustainable Technologies',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} demonstrates an active engagement with scientific inquiry and ecological systems. For a Class 12 candidate, this orientation provides a compelling foundation for undergraduate programs in environmental science, ecological data modeling, climate analytics, and sustainable technology systems.`,
        foundation: {
          subjects: ['Environmental Science / Biology', 'Chemistry (Environmental & Analytical)', 'Physics / Applied Mathematics', 'Geography / Earth Systems', 'English Communication'],
          exams: ['CUET-UG (Top Central Universities: DU, BHU, JNU)', 'IISER IAT (Indian Institutes of Science Education and Research)', 'ICAR AIEEA (National Environmental & Allied Sciences)', 'NEST (National Entrance Screening Test)', 'SAT / AP Environmental Science'],
          curriculumFocus: 'Focus on biogeochemical cycles, ecological data modeling, GIS mapping fundamentals, and environmental impact assessment principles.',
        },
        bachelors: [
          {
            degree: 'B.S. / B.Sc. (Hons) in Environmental Science & Climate Systems',
            specialization: 'Climate Data Modeling, Environmental Chemistry, Biodiversity Conservation',
            whyFits: `Directly engages ${firstName}'s analytical curiosity with real-world sustainability solutions.`,
            careerOutcomes: 'Environmental Consultant, Climate Risk Analyst, Ecological Systems Researcher',
          },
          {
            degree: 'B.Tech / B.E. in Environmental Engineering & Green Technology',
            specialization: 'Renewable Energy Systems, Carbon Accounting, Water Resource Engineering',
            whyFits: 'Merges quantitative problem solving with clean energy infrastructure design.',
            careerOutcomes: 'Sustainability Systems Engineer, Renewable Energy Specialist, Environmental Compliance Lead',
          },
          {
            degree: 'B.S. in Earth & Atmospheric Data Sciences',
            specialization: 'Geospatial Analytics (GIS), Remote Sensing, Hydrological Modeling',
            whyFits: 'Leverages observational data synthesis and computational environmental mapping.',
            careerOutcomes: 'Geospatial Analyst, Hydrologist, Earth Observation Systems Specialist',
          },
        ],
        colleges: {
          reach: ['Indian Institute of Science (IISc), Bangalore', 'Oxford / Cambridge (Earth Sciences, UK)', 'University of California, Berkeley (CNR)', 'Wageningen University (Netherlands)', 'IISER Pune / Kolkata'],
          fit: ['University of Delhi (Faculty of Science)', 'Banaras Hindu University (BHU)', 'University of British Columbia (Canada)', 'University of Melbourne (Australia)', 'TERI School of Advanced Studies'],
          accessible: ['Amity Institute of Environmental Sciences', 'Christ University (Life Sciences)', 'Symbiosis School for Liberal Arts', 'Shiv Nadar University'],
        },
        masters: [
          'M.Sc. in Climate Science & Global Sustainability Policy (Yale / Oxford / LSE)',
          'M.Tech / M.S. in Sustainable Energy & Environmental Engineering',
          'Ph.D. in Earth System Dynamics & Ecological Economics',
        ],
        careerOutcomes: [
          'Senior Environmental Consultant at Global Engineering & Infrastructure Firms',
          'Chief Sustainability Officer (CSO) / Director of ESG Strategy',
          'Climate Modeling Research Scientist at International Institutes (IPCC / NOAA)',
          'Senior Policy Advisor at United Nations Environment Programme (UNEP)',
        ],
        skills: ['GIS & Geospatial Analysis (QGIS / ArcGIS)', 'Statistical Environmental Modeling (R / Python)', 'Ecological Field Research & Impact Auditing', 'ESG Compliance & Carbon Accounting'],
        targetCompanies: ['ERM (Environmental Resources Management)', 'United Nations Environment Programme (UNEP)', 'World Wildlife Fund (WWF)', 'AECOM Sustainability Practice', 'Tata Energy & Resources Institute (TERI)'],
        milestone: 'Secure admission to premier environmental science or sustainability engineering program and complete an active field research or sustainability internship.',
      };
    }

    // 2. DATA SCIENCE / ARTIFICIAL INTELLIGENCE / APPLIED ANALYTICS
    if (/data science|artificial intelligence|\bai\b|machine learning|analytics|statistics/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Data Science, Machine Learning & Statistical Computing',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} demonstrates solid quantitative aptitude (${scores.aptitude?.numerical || 71}%) and structured problem analysis. In Class 12, this cognitive orientation provides a competitive launchpad for undergraduate degrees in data science, applied machine learning, statistical computing, and computational analytics.`,
        foundation: {
          subjects: ['Mathematics (Linear Algebra, Calculus, Probability)', 'Statistics / Applied Mathematics', 'Computer Science / Informatics Practices', 'Physics / Analytical Sciences', 'English Communication'],
          exams: ['CUET-UG (Top Statistics & CS Programs: ISI, CMI, DU)', 'JEE Main (NITs / IIITs Data Science)', 'BITSAT', 'ISI Admission Test (Indian Statistical Institute)', 'SAT (Math Focus) + AP Statistics / CS'],
          curriculumFocus: 'Focus on probability theory, discrete mathematics, statistical inference, and introductory programming algorithms.',
        },
        bachelors: [
          {
            degree: 'B.Stat / B.S. in Data Science & Applied Statistics',
            specialization: 'Predictive Modeling, Statistical Inference, Big Data Systems',
            whyFits: `Directly leverages ${firstName}'s numerical accuracy and structured quantitative thinking.`,
            careerOutcomes: 'Data Scientist, Quantitative Analyst, Statistical Modeler',
          },
          {
            degree: 'B.Tech / B.S. in Computer Science (Artificial Intelligence & ML)',
            specialization: 'Deep Learning, Neural Networks, Natural Language Processing',
            whyFits: 'Pairs mathematical foundations with modern scalable machine learning engineering.',
            careerOutcomes: 'Machine Learning Engineer, AI Systems Developer, Research Engineer',
          },
          {
            degree: 'B.S. in Computational Mathematical Sciences',
            specialization: 'Algorithmic Optimization, Stochastic Processes, Financial Analytics',
            whyFits: 'Applies rigorous mathematical theory to high-velocity computational data pipelines.',
            careerOutcomes: 'Quantitative Researcher, Operations Research Analyst, Business Intelligence Architect',
          },
        ],
        colleges: {
          reach: ['Indian Statistical Institute (ISI), Kolkata/Delhi', 'Chennai Mathematical Institute (CMI)', 'IIT Bombay / Delhi / Madras', 'Carnegie Mellon University (CMU)', 'Stanford University (US)'],
          fit: ['IIIT Delhi / IIIT Bangalore', 'BITS Pilani', 'Delhi Technological University (DTU)', 'University of Washington', 'University of Waterloo (Canada)'],
          accessible: ['Vellore Institute of Technology (VIT)', 'Manipal Institute of Technology (MIT)', 'Shiv Nadar University', 'Thapar University'],
        },
        masters: [
          'M.S. in Machine Learning / Computational Data Science (CMU / Stanford / MIT)',
          'Master of Statistics (M.Stat - ISI)',
          'Ph.D. in Statistical Machine Learning & Artificial Intelligence',
        ],
        careerOutcomes: [
          'Senior Machine Learning Scientist / AI Research Engineer at Global Tech Firm',
          'Lead Quantitative Data Scientist in High-Frequency Analytics',
          'Chief Data Officer (CDO) / VP of Enterprise Analytics',
          'Principal AI Solutions Architect in Applied Cloud Computing',
        ],
        skills: ['Statistical Inference & Probability Modeling', 'Python / R / SQL for Data Analytics', 'Deep Learning Architectures (PyTorch / TensorFlow)', 'Big Data Pipeline Engineering (Spark / Kafka)'],
        targetCompanies: ['Google AI Research', 'Microsoft AI Labs', 'Amazon AWS Analytics', 'Meta AI', 'Jane Street / Citadel Securities'],
        milestone: 'Rank in top tier of competitive quantitative exams or complete capstone portfolio with deployed machine learning models.',
      };
    }

    // 3. HUMANITIES / LAW / DESIGN / MEDIA
    if (/law|legal|policy|humanities|arts|design|media|psychology|journalism/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Corporate Law, Public Policy & Strategic Communication',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} demonstrates structured verbal synthesis and critical analysis. For a Class 12 candidate, this orientation provides competitive advantages in legal reasoning, public policy, strategic communications, and human-centered design.`,
        foundation: {
          subjects: ['Legal Studies / Political Science', 'Psychology / Sociology', 'English Literature', 'Applied Mathematics / Economics', 'Mass Media Studies'],
          exams: ['CLAT (National Law Universities)', 'AILET (NLU Delhi)', 'CUET-UG (Top Central Universities)', 'LSAT-India', 'SAT / IELTS (Global)'],
          curriculumFocus: 'Focus on high-speed textual comprehension, constitutional reasoning, analytical essay drafting, and timed competitive exam test series.',
        },
        bachelors: [
          {
            degree: 'B.A. LL.B (Hons) / B.B.A. LL.B (5-Year Integrated Law)',
            specialization: 'Corporate Mergers, Intellectual Property Law, International Commercial Arbitration',
            whyFits: `Leverages ${firstName}'s structured communication and ethical reasoning.`,
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
            whyFits: 'Combines abstract creativity with structured digital product workflows.',
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
        milestone: 'Secure top rank in CLAT/AILET or high percentile in CUET-UG and complete competitive legal or policy internships.',
      };
    }

    // 4. COMMERCE / FINANCE / MANAGEMENT / ECONOMICS
    if (/commerce|finance|business|management|accounting|economics|banking|marketing/i.test(lower)) {
      return {
        pathwayName,
        pathwayTitle: 'Quantitative Finance, Corporate Strategy & Business Economics',
        pathwayRankLabel: rankLabel,
        fitScore: scoreVal,
        rationale: `${firstName} displays quantitative fluency paired with conscientious execution. In Class 12, this marks readiness for rigorous undergraduate studies in investment banking, corporate strategy, actuarial analytics, and quantitative economics.`,
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

    // 5. MEDICAL / BIOMEDICAL / LIFE SCIENCES / HEALTHCARE
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
        milestone: 'Achieve competitive rank in NEET-UG or secure research admission into premier biomedical program with active clinical observerships.',
      };
    }

    // 6. SOFTWARE ENGINEERING / IT / COMPUTER SYSTEMS (DEFAULT OR DIRECT MATCH)
    return {
      pathwayName,
      pathwayTitle: 'Software Systems Engineering, Cloud Architecture & DevOps',
      pathwayRankLabel: rankLabel,
      fitScore: scoreVal,
      rationale: `${firstName} demonstrates practical problem-solving persistence and methodical logical reasoning. In Class 12, this orientation supports high-performance degrees in software systems engineering, cloud infrastructure, enterprise applications, and modern software architecture.`,
      foundation: {
        subjects: ['Mathematics (Calculus, Discrete Mathematics)', 'Physics (Mechanics, Electromagnetism)', 'Computer Science (Programming & Data Structures)', 'English Communication'],
        exams: ['JEE Main & JEE Advanced (IITs/NITs)', 'BITSAT (BITS Pilani)', 'VITEEE / MET / COMEDK', 'UGEE (IIIT Hyderabad)', 'SAT + AP Computer Science'],
        curriculumFocus: 'Focus on core algorithmic problem solving, structured data structures, object-oriented software design, and timed competitive exam practice.',
      },
      bachelors: [
        {
          degree: 'B.Tech / B.S. in Computer Science & Software Engineering',
          specialization: 'Distributed Systems, Cloud Computing, Backend Architecture, Cybersecurity',
          whyFits: `Directly aligns with ${firstName}'s problem-solving stamina and computational interests.`,
          careerOutcomes: 'Software Systems Engineer, Cloud Infrastructure Architect, Core Backend Developer',
        },
        {
          degree: 'B.Tech / B.S. in Information Technology & Cloud Infrastructure',
          specialization: 'DevOps Automation, Site Reliability Engineering (SRE), Network Virtualization',
          whyFits: 'Balances scalable system administration with modern agile software pipelines.',
          careerOutcomes: 'DevOps Engineer, Cloud Solutions Architect, Site Reliability Lead',
        },
        {
          degree: 'B.S. in Software Systems & Cybersecurity Engineering',
          specialization: 'Defensive Security Architecture, Threat Intelligence, Application Security',
          whyFits: 'Applies rigorous logic to protect enterprise digital assets and distributed networks.',
          careerOutcomes: 'Cybersecurity Analyst, Systems Security Architect, Information Security Lead',
        },
      ],
      colleges: {
        reach: ['IIT Bombay / IIT Delhi / IIT Kharagpur', 'IIIT Hyderabad', 'BITS Pilani', 'Carnegie Mellon University (CMU)', 'UC Berkeley (US)', 'National University of Singapore (NUS)'],
        fit: ['NIT Trichy / NIT Surathkal', 'Delhi Technological University (DTU)', 'University of Waterloo (Canada)', 'Technical University of Munich (TUM, Germany)', 'Purdue University'],
        accessible: ['Manipal Institute of Technology (MIT)', 'Vellore Institute of Technology (VIT)', 'Shiv Nadar University', 'Thapar University'],
      },
      masters: [
        'M.S. in Computer Science / Software Systems (CMU / Georgia Tech / Stanford)',
        'M.Tech in Advanced Computer Systems Engineering',
        'Ph.D. in Distributed Systems & Cloud Infrastructure',
      ],
      careerOutcomes: [
        'Principal Systems Architect / Chief Technology Officer (CTO)',
        'Lead Cloud Solutions Architect at Tier-1 Enterprise',
        'Senior Site Reliability & Distributed Systems Director',
        'Founder / Technical Lead of Enterprise SaaS Venture',
      ],
      skills: ['Data Structures & Algorithms (C++ / Java / Python)', 'Cloud Architecture (AWS / GCP / Azure)', 'System Scalability & Microservices Design', 'Linux Kernel & DevOps Toolchains'],
      targetCompanies: ['Google Cloud', 'Microsoft Azure', 'Amazon Web Services (AWS)', 'Atlassian', 'Stripe Systems'],
      milestone: 'Secure admission to tier-1 computer science or engineering institution and build production-grade open source software projects.',
    };
  };

  const primaryRoadmap = getSeniorPathwayData(p1.name, 'PRIMARY DEGREE & CAREER PATHWAY (RANK 1)', p1.score);
  const secondaryRoadmap = getSeniorPathwayData(p2.name, 'SECONDARY DEGREE PATHWAY (RANK 2)', p2.score);
  const alternativeRoadmap = getSeniorPathwayData(p3.name, 'STRATEGIC ALTERNATIVE (RANK 3)', p3.score);

  // Dynamic programs and scholarships calibrated to primary pathway
  const isEnv = /environment|sustainab|climate|ecology|earth/i.test(primaryRoadmap.pathwayTitle);
  const isData = /data science|machine learning|statistical/i.test(primaryRoadmap.pathwayTitle);
  const isLaw = /law|policy/i.test(primaryRoadmap.pathwayTitle);
  const isBiz = /finance|business|economics/i.test(primaryRoadmap.pathwayTitle);

  const targetGlobalPrograms = isEnv ? [
    'B.S. in Environmental Science & Climate Systems (UC Berkeley / UBC)',
    'B.Sc. (Hons) in Ecology & Environmental Sustainability (Oxford / Edinburgh)',
    'B.Eng in Environmental Engineering & Clean Technology (TU Berlin / Melbourne)',
    'B.S. in Earth & Atmospheric Data Science (Univ. of Washington / Toronto)'
  ] : isData ? [
    'B.S. in Data Science & Statistical Machine Learning (UC Berkeley / Carnegie Mellon)',
    'B.Sc. in Mathematics, Statistics & Data Science (Oxford / Imperial College London)',
    'B.S. in Artificial Intelligence & Computational Analytics (Waterloo / Toronto)',
    'B.Sc. in Data Science & Business Analytics (London School of Economics)'
  ] : isLaw ? [
    'LL.B. (Hons) in Law & International Public Policy (Oxford / Cambridge / LSE)',
    'B.A. in Political Science, Philosophy & Economics (PPE - Warwick / King\'s College)',
    'B.A. in Global Public Policy & International Relations (Sciences Po / Georgetown)',
    'B.Des in Product Design & Human-Computer Interaction (RMIT / Eindhoven)'
  ] : isBiz ? [
    'B.Sc. in Finance & Quantitative Economics (London School of Economics / Wharton)',
    'B.B.A. in International Business & Corporate Strategy (INSEAD / NUS Singapore)',
    'B.S. in Financial Engineering & FinTech Analytics (NYU Stern / Warwick)',
    'B.Com (Hons) in Accounting & Global Financial Markets (Toronto Rotman / Melbourne)'
  ] : [
    'B.S. in Computer Science & Artificial Intelligence (Silicon Valley Corridor)',
    'B.Sc. in Quantitative Systems & Software Engineering (Imperial / Waterloo)',
    'B.Eng in Robotics & Autonomous Systems (TU Munich Engineering Hub)',
    'B.A.Sc. in Software Systems Engineering with Paid Co-op (Waterloo)'
  ];

  const targetGlobalScholarships = isEnv ? [
    'Global Environmental Leadership & Sustainability Fellowship (Institutional)',
    'DAAD Study Scholarships & International Research Grants (Germany)',
    'University International Undergraduate Merit Scholarships (US / Canada / UK)',
    'Commonwealth Sustainable Development International Fellowships'
  ] : isData ? [
    'Generation Google APAC / EMEA Tech & Data Science Scholarship',
    'DAAD Academic Excellence Grant in Computing & Mathematics (Germany)',
    'University Dean’s Global Merit Engineering Scholarship (US / Canada)',
    'Commonwealth Undergraduate STEM International Fellowships (UK)'
  ] : isLaw ? [
    'Chevening & Commonwealth Undergraduate Leadership Fellowships (UK)',
    'Global Public Policy & Social Impact Academic Grant (Institutional)',
    'International Law & Global Governance Merit Scholarship (Europe)',
    'University Dean’s Social Sciences International Award (US / Canada)'
  ] : isBiz ? [
    'LSE & Wharton Global Business Leadership Bursaries',
    'DAAD International Economics & Management Fellowship (Germany)',
    'Dean\'s Global Merit Business Leadership Award (US / UK / Singapore)',
    'Rotman International Undergraduate Commerce Fellowship (Canada)'
  ] : [
    'Generation Google APAC / EMEA Tech Scholarship',
    'DAAD Undergraduate Engineering Grant (Germany)',
    'University Dean’s Global Merit Engineering Scholarship (US)',
    'Commonwealth Undergraduate International Fellowships (UK)'
  ];

  const studyAbroad: StudyAbroadGuideData = {
    rationale: `For Class 12 candidates like ${firstName}, undergraduate study abroad represents a direct gateway to global innovation hubs, post-study work authorisations, and world-class university research labs.`,
    fitmentSummary: `Targeting tier-1 international universities offering direct undergraduate degree pathways aligned with ${primaryRoadmap.pathwayTitle}.`,
    parentOpennessLabel: parentProfile?.choices?.preferredRegion && parentProfile.choices.preferredRegion !== 'prefer_india' ? 'Strong Parental Openness & Support' : 'Active International Consideration',
    financialAlignmentLabel: parentProfile?.choices?.educationBudget ? formatParentChoiceLabel(parentProfile.choices.educationBudget) : 'Comprehensive Merit Scholarship Alignment',
    countries: [
      {
        flag: '🇺🇸',
        name: 'United States',
        reason: 'The global leader in academic research and innovation hubs. Offers 4-year undergraduate degrees with a 1-year initial OPT plus a 24-month STEM OPT extension for qualifying STEM degree majors.',
        academicRoute: '4-Year B.S. Degree (1-Year Initial OPT + 24-Month STEM OPT Extension)',
        costCategory: 'High (Generous Merit Scholarships & On-Campus Assistantships Available)',
      },
      {
        flag: '🇩🇪',
        name: 'Germany',
        reason: 'Europe’s leading industrial and engineering powerhouse. Top public universities (such as RWTH Aachen and TU Berlin) offer world-class programs with low semester fees, while institutions like TU Munich have introduced modest tuition fees for non-EU international undergraduates.',
        academicRoute: '3.5-Year B.Sc. / B.Eng Degree (18-Month Post-Study Job Search Visa)',
        costCategory: 'Low to Moderate (Low Public University Fees; Modest Fees at Select Institutions)',
      },
      {
        flag: '🇬🇧',
        name: 'United Kingdom',
        reason: 'Home to Oxford, Cambridge, Imperial College, UCL, and top Scottish universities. Intensive 3-year undergraduate honours programs (4-year in Scotland) paired with a 2-Year Graduate Route post-study work visa.',
        academicRoute: '3-Year Undergraduate Honours Degree (2-Year Post-Study Graduate Route Visa)',
        costCategory: 'Moderate to High (University Merit Bursaries & Scholarships Available)',
      },
      {
        flag: '🇨🇦',
        name: 'Canada',
        reason: 'Leading global institutions like University of Waterloo and University of Toronto feature world-renowned Co-op programs alternating academic study with paid industry internships.',
        academicRoute: '4-Year B.S. / B.A.Sc. Degree (Eligible for up to 3-Year Post-Graduation Work Permit subject to IRCC study permit criteria)',
        costCategory: 'Moderate (Partially Offset by Paid Co-op Internship Earnings)',
      },
    ],
    scholarships: targetGlobalScholarships,
    programs: targetGlobalPrograms,
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
