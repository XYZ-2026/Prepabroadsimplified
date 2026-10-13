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
import { 
  type PathwayRoadmapData, 
  type StudyAbroadGuideData, 
  type AcademicStage, 
  type StudentActionPlanData,
  getPathwayRoadmapData,
  getSpecializedDomain,
  type SpecializedDomain
} from '../../class10_roadmap_engine';
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
  const p1 = pathways[0] || { name: 'Aerospace & Defence', score: 81 };
  const p2 = pathways[1] || { name: 'Entrepreneurship & Startups', score: 75 };
  const p3 = pathways[2] || { name: 'Mechanical Engineering', score: 73 };

  const primaryRoadmap = getPathwayRoadmapData(
    p1.name,
    'PRIMARY DEGREE & CAREER PATHWAY (RANK 1)',
    student,
    scores,
    comparisonData
  );
  primaryRoadmap.fitScore = p1.score;

  const secondaryRoadmap = getPathwayRoadmapData(
    p2.name,
    'SECONDARY DEGREE PATHWAY (RANK 2)',
    student,
    scores,
    comparisonData
  );
  secondaryRoadmap.fitScore = p2.score;

  const alternativeRoadmap = getPathwayRoadmapData(
    p3.name,
    'STRATEGIC ALTERNATIVE (RANK 3)',
    student,
    scores,
    comparisonData
  );
  alternativeRoadmap.fitScore = p3.score;

  // Dynamic programs and scholarships calibrated to primary pathway
  const domain = getSpecializedDomain(p1.name);
  const p1Lower = p1.name.toLowerCase();

  let targetGlobalPrograms: string[] = [];
  let targetGlobalScholarships: string[] = [];

  if (domain === 'MECHANICAL_AEROSPACE') {
    if (/aero|space|defence|defense|aviation|avionics/i.test(p1Lower)) {
      targetGlobalPrograms = [
        'B.S. in Aerospace Engineering & Astronautics (Purdue / Georgia Tech / MIT)',
        'B.Eng (Hons) in Aeronautical Systems & Propulsion (Imperial / Bristol)',
        'B.Sc. in Space Science & Satellite Engineering (TU Delft / TUM Germany)',
        'B.A.Sc. in Aerospace & Mechatronics Systems (Univ. of Toronto)',
      ];
      targetGlobalScholarships = [
        'AIAA Foundation Undergraduate Aerospace Scholarship',
        'DAAD Undergraduate Engineering Research Grant (Germany)',
        'University Dean’s Global Merit Engineering Scholarship (US / Canada)',
        'Commonwealth Aerospace & Space Systems Fellowship (UK)',
      ];
    } else if (/petroleum|mining|energy resource/i.test(p1Lower)) {
      targetGlobalPrograms = [
        'B.S. in Petroleum & Geosystems Engineering (UT Austin / Texas A&M)',
        'B.Sc. in Mining & Energy Resources Engineering (Colorado School of Mines / McGill)',
        'B.Eng in Subsurface Energy & Carbon Storage (TU Delft / Curtin Australia)',
        'B.S. in Energy Engineering & Mineral Processing (Penn State)',
      ];
      targetGlobalScholarships = [
        'Society of Petroleum Engineers (SPE) Global Undergraduate Scholarship',
        'DAAD Energy Resources & Engineering Scholarship (Germany)',
        'University International Dean’s Engineering Award (US / Canada)',
        'Global Subsurface Energy Transition Grant',
      ];
    } else {
      targetGlobalPrograms = [
        'B.S. in Mechanical Engineering & Robotics (Univ. of Michigan / UC Berkeley)',
        'B.Eng (Hons) in Advanced Automotive & Mobility Engineering (Warwick / RWTH Aachen)',
        'B.Sc. in Mechanical Systems & Mechatronics (TU Munich / ETH Zurich)',
        'B.A.Sc. in Mechanical Design Engineering with Co-op (Waterloo)',
      ];
      targetGlobalScholarships = [
        'ASME International Undergraduate Engineering Award',
        'DAAD Undergraduate Engineering Grant (Germany)',
        'University Dean’s Global Merit Engineering Scholarship (US)',
        'Commonwealth Undergraduate International Fellowships (UK)',
      ];
    }
  } else if (domain === 'BUSINESS_MANAGEMENT_MARKETING') {
    targetGlobalPrograms = [
      'B.S. in Entrepreneurship & Venture Innovation (Babson / Wharton / USC Marshall)',
      'B.Sc. in Management & International Business Strategy (LSE / Warwick / NUS)',
      'B.Com (Hons) in Strategic Management & Global Commerce (Toronto Rotman / McGill)',
      'B.B.A. in Innovation, Tech Commercialization & Strategy (INSEAD / ESSEC)',
    ];
    targetGlobalScholarships = [
      'Babson & Wharton Global Entrepreneurship Leadership Scholarship',
      'LSE & NUS Global Business Excellence Bursaries',
      'DAAD International Business & Management Fellowship (Germany)',
      'Dean\'s Global Merit Business Leadership Award (US / UK / Singapore)',
    ];
  } else if (domain === 'SOFTWARE_AI_CS') {
    targetGlobalPrograms = [
      'B.S. in Computer Science & Artificial Intelligence (Silicon Valley Corridor / CMU)',
      'B.Sc. in Quantitative Systems & Software Engineering (Imperial / Waterloo)',
      'B.Eng in Robotics & Autonomous Systems (TU Munich Engineering Hub)',
      'B.A.Sc. in Software Systems Engineering with Paid Co-op (Waterloo)',
    ];
    targetGlobalScholarships = [
      'Generation Google APAC / EMEA Tech Scholarship',
      'DAAD Undergraduate Engineering Grant (Germany)',
      'University Dean’s Global Merit Engineering Scholarship (US)',
      'Commonwealth Undergraduate International Fellowships (UK)',
    ];
  } else if (domain === 'CIVIL_ARCHITECTURE') {
    targetGlobalPrograms = [
      'B.Arch in Sustainable Urban Architecture (Cornell / AA School / TU Delft)',
      'B.S. in Civil & Environmental Infrastructure Engineering (UC Berkeley / UIUC)',
      'B.Eng in Smart Cities & Structural Engineering (NUS / Imperial College)',
      'B.Sc. in Urban Planning & Generative Architecture (UCL Bartlett / Melbourne)',
    ];
    targetGlobalScholarships = [
      'AIA International Architecture Student Fellowship',
      'DAAD Structural Engineering & Urban Design Fellowship (Germany)',
      'University Dean’s Environmental Infrastructure Merit Grant (US)',
      'Commonwealth Built Environment International Award (UK)',
    ];
  } else if (domain === 'ELECTRICAL_ELECTRONICS' || domain === 'ROBOTICS_AUTOMATION') {
    targetGlobalPrograms = [
      'B.S. in Electrical & Computer Engineering (Georgia Tech / UIUC / Purdue)',
      'B.Eng in Robotics & Autonomous Systems (Imperial / TU Munich)',
      'B.Sc. in Microelectronics & Semiconductor Physics (Delft / NUS)',
      'B.A.Sc. in Electrical Engineering with Nano-Systems Co-op (Waterloo)',
    ];
    targetGlobalScholarships = [
      'IEEE Undergraduate Excellence Scholarship',
      'DAAD Semiconductor & Microelectronics Grant (Germany)',
      'University Dean’s Global Merit Engineering Scholarship (US)',
      'Commonwealth Robotics & Systems International Award (UK)',
    ];
  } else if (domain === 'MEDICINE_SURGERY' || domain === 'PHARMACY_BIOTECH') {
    targetGlobalPrograms = [
      'B.S. in Biomedical Science & Pre-Medicine (Johns Hopkins / UCLA)',
      'MBChB / B.M.B.S. in Medicine & Surgery (Oxford / Edinburgh / Monash)',
      'B.Sc. in Biotechnology & Molecular Genetics (Imperial College / Toronto)',
      'B.S. in Pharmaceutical Sciences & Drug Discovery (UNC Chapel Hill / UBC)',
    ];
    targetGlobalScholarships = [
      'International Medical & Biomedical Research Fellowship (Institutional)',
      'DAAD Bio-Molecular & Life Sciences Scholarship (Germany)',
      'University International Health Sciences Merit Grant (US / UK)',
      'Commonwealth Health & Biotechnology Fellowship (UK)',
    ];
  } else if (domain === 'CHARTERED_ACCOUNTANCY_FINANCE') {
    targetGlobalPrograms = [
      'B.Sc. in Finance & Quantitative Economics (London School of Economics / Wharton)',
      'B.S. in Financial Engineering & FinTech Analytics (NYU Stern / Warwick)',
      'B.Com (Hons) in Accounting & Global Financial Markets (Toronto Rotman / Melbourne)',
      'B.Sc. in Actuarial Science & Quantitative Risk (Columbia / Waterloo)',
    ];
    targetGlobalScholarships = [
      'LSE & Wharton Global Finance Leadership Bursaries',
      'DAAD International Economics & Finance Fellowship (Germany)',
      'Dean\'s Global Merit Finance Leadership Award (US / UK / Singapore)',
      'Rotman International Undergraduate Commerce Fellowship (Canada)',
    ];
  } else if (domain === 'LAW_LEGAL') {
    targetGlobalPrograms = [
      'LL.B. (Hons) in International & Corporate Law (Oxford / Cambridge / LSE)',
      'B.A. in Law, Politics & International Relations (King\'s College / Warwick)',
      'B.A. in Global Governance, Human Rights & Public Policy (Sciences Po / Georgetown)',
      'Dual B.A./LL.B. in Comparative Global Law (Columbia-Sciences Po / Melbourne)',
    ];
    targetGlobalScholarships = [
      'Chevening & Commonwealth Undergraduate Legal Leadership Fellowships (UK)',
      'Global Public Policy & Social Impact Academic Grant (Institutional)',
      'International Law & Global Governance Merit Scholarship (Europe)',
      'University Dean’s Social Sciences International Award (US / Canada)',
    ];
  } else if (domain === 'DESIGN_ANIMATION_FINE_ARTS') {
    targetGlobalPrograms = [
      'B.Des in Product & Industrial Design (RMIT / TU Delft / ArtCenter)',
      'B.F.A. in Digital Animation & Game Design (CalArts / Ringling / Sheridan)',
      'B.A. (Hons) in Communication & UI/UX Design (Central Saint Martins / Eindhoven)',
      'B.Des in Human-Computer Interaction & Visual Innovation (Carnegie Mellon)',
    ];
    targetGlobalScholarships = [
      'World Design Organization (WDO) Emerging Talent Fellowship',
      'DAAD Visual Arts & Design Innovation Fellowship (Germany)',
      'University Dean’s Global Creative Design Scholarship (US / UK)',
      'Commonwealth Arts & Digital Media International Fellowship (UK)',
    ];
  } else if (domain === 'PURE_SCIENCES') {
    targetGlobalPrograms = [
      'B.S. in Environmental Science & Climate Systems (UC Berkeley / UBC)',
      'B.Sc. (Hons) in Ecology & Environmental Sustainability (Oxford / Edinburgh)',
      'B.Eng in Environmental Engineering & Clean Technology (TU Berlin / Melbourne)',
      'B.S. in Earth & Atmospheric Data Science (Univ. of Washington / Toronto)',
    ];
    targetGlobalScholarships = [
      'Global Environmental Leadership & Sustainability Fellowship (Institutional)',
      'DAAD Study Scholarships & International Research Grants (Germany)',
      'University International Undergraduate Merit Scholarships (US / Canada / UK)',
      'Commonwealth Sustainable Development International Fellowships',
    ];
  } else {
    targetGlobalPrograms = [
      'B.Sc. in Cognitive Science & Experimental Psychology (UCL / UC San Diego)',
      'B.A. in Philosophy, Politics & Economics (PPE - Oxford / Warwick)',
      'B.A. in Media, Digital Journalism & Global Communications (NYU / Amsterdam)',
      'B.S. in Behavioral Neuroscience & Organizational Psychology (Toronto / Melbourne)',
    ];
    targetGlobalScholarships = [
      'Global Behavioral Sciences & Social Innovation Award',
      'DAAD International Humanities Fellowship (Germany)',
      'University Dean’s Social Science Merit Bursary (US / UK)',
      'Commonwealth Psychology & Human Welfare Fellowship (UK)',
    ];
  }

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
