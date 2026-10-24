/**
 * CLARVO Career Library Service
 * Canonical data layer managing Career Profiles, Category Clusters, Domain Streams,
 * Roadmap lookups, and Extensible Non-Engineering additions.
 */

import branchesData from '@/data/career-library/branches.json';
import roadmapsData from '@/data/career-library/roadmaps.json';
import clustersData from '@/data/career-library/clusters.json';
import streamsData from '@/data/career-library/streams.json';
import traitsData from '@/data/career-library/traits.json';
import manualExtensions from '@/data/career-library/manual_extensions.json';

import type {
  CareerProfile,
  CareerRoadmap,
  ClusterDefinition,
  StreamDefinition,
  CareerLibraryFilterState,
  CareerMatchScore
} from './types';

// Cast loaded JSON
const BUILTIN_BRANCHES = branchesData as CareerProfile[];
const BUILTIN_ROADMAPS = roadmapsData as Record<string, CareerRoadmap>;
const CLUSTERS = clustersData as Record<string, ClusterDefinition>;
const STREAMS = streamsData as Record<string, StreamDefinition>;
const TRAITS = traitsData as string[];

// Original 32 technical traits for engineering assessment isolation
export const TECHNICAL_TRAITS = [
  'Programming', 'Mathematics', 'Research', 'Creativity', 'Leadership', 'Communication',
  'Hardware', 'Electronics', 'MechanicalSystems', 'Construction', 'Automation', 'DataAnalysis',
  'DesignThinking', 'Entrepreneurship', 'ScientificCuriosity', 'RiskTaking', 'Precision',
  'ProblemSolving', 'Innovation', 'SystemsThinking', 'Debugging', 'LogicalReasoning', 'SpatialThinking', 'PatternRecognition',
  'ChemicalProcessing', 'BiologicalScience', 'MaterialScience', 'TextileDesign', 'EnvironmentalAwareness', 'FoodScience', 'AerospaceInterest', 'IndustrialProcess'
];

/**
 * Domain-aware fallback roadmap generator.
 * Avoids imposing engineering-specific subjects (Engineering Mathematics, Graphics, Lab work)
 * onto Commerce, Arts, Law, Humanities, or Management disciplines.
 */
export function generateDomainAwareRoadmap(profile: CareerProfile): CareerRoadmap {
  const stream = profile.stream || 'engineering';
  const clusterName = CLUSTERS[profile.cluster]?.name || profile.cluster || 'Industry';
  const nameFirstWord = profile.name.split(' ')[0] || profile.name;

  if (stream === 'commerce') {
    return {
      whyFits: `${profile.name} is suited for you based on your commercial aptitude, organizational precision, and analytical mindset.`,
      entryRoute: 'Undergraduate study in Commerce/Management (Class 12 in any stream; Commerce/Mathematics recommended), professional exams, or university admissions.',
      yearByYear: [
        { year: 'Stage 1: Foundations', items: ['Financial & Cost Principles', 'Business Mathematics & Statistics', `Core ${nameFirstWord} Frameworks`, 'Spreadsheet Modelling & Accounting Tools', 'Business Communication'] },
        { year: 'Stage 2: Core Analysis', items: [profile.coreSkills[0] || 'Intermediate Financial Analysis', profile.coreSkills[1] || 'Corporate Governance & Laws', 'Applied Statistics & Data Tools', 'Industry Case Simulations'] },
        { year: 'Stage 3: Advanced Practice', items: [profile.coreSkills[2] || 'Advanced Strategy', profile.coreSkills[3] || 'Taxation & Valuation', 'Practical Industry Internship', 'Specialization Elective'] },
        { year: 'Stage 4: Strategic Execution', items: [profile.coreSkills[4] || 'Strategic Management', 'Comprehensive Capstone Case Study', 'Professional Placement Preparation', 'Regulatory Compliance & Ethics'] }
      ],
      coreSubjects: profile.coreSkills.slice(0, 8),
      tools: profile.tools.concat(['Advanced Excel', 'Financial Modelling']).slice(0, 9),
      projects: [
        `Develop a comprehensive ${profile.name.toLowerCase()} analysis for a real-world enterprise`,
        `Build a practical financial model using ${profile.tools[0] || 'Excel'}`,
        `Draft a strategic risk and regulatory compliance review in ${clusterName}`
      ],
      internshipStrategy: `Target internships in accounting firms, financial services, corporate finance teams, or management consulting in the ${clusterName} sector.`,
      skillMilestones: [
        'Milestone 1: Master core spreadsheets and quantitative fundamentals',
        `Milestone 2: Build proficiency in ${profile.coreSkills[0] || 'domain analysis'}`,
        'Milestone 3: Complete practical internship and live commercial case study',
        'Milestone 4: Portfolio of real financial reports and placement readiness'
      ],
      careerPaths: profile.careers.slice(0, 6),
      topRecruiters: ['Big 4 Accounting & Advisory', 'Leading Commercial Banks', 'Financial Consultancies', 'Corporate Finance Divisions', 'MNCs'],
      salaryDirection: 'Starting: ₹4-9 LPA | Mid-career: ₹10-24 LPA | Senior: ₹25-45+ LPA depending on certifications (CA/CFA/MBA) and performance.',
      higherEd: ['MBA (Finance/Strategy)', 'CFA/FRM', 'M.Com/MS in Finance', 'Executive Leadership Programmes'],
      futureTrends: ['AI-driven financial analytics', 'ESG and sustainable finance', 'Digital compliance and automation', 'Regtech adoption'],
      risks: ['Market-driven economic cycles', 'Rapid digital tool transitions', 'High initial exam requirements for licensed pathways'],
      actionPlan: [
        `Master fundamental principles in ${profile.coreSkills[0] || 'commercial analysis'}`,
        'Build real-world financial models in Excel and BI tools',
        'Secure practical internships by Stage 2 or 3',
        'Pursue industry-recognized credentials to boost differentiation'
      ],
      isFallback: true
    };
  }

  if (stream === 'arts') {
    return {
      whyFits: `${profile.name} matches your profile based on creative thinking, critical inquiry, and communication skills.`,
      entryRoute: 'Undergraduate studies in Arts, Humanities, Law, Design, or Social Sciences (Class 12 in any stream; portfolio or entrance exams where applicable).',
      yearByYear: [
        { year: 'Year 1: Conceptual Foundations', items: ['Critical Thinking & Research Methods', `Introduction to ${nameFirstWord} Studies`, 'Visual & Written Communication', 'Cultural & Historical Contexts'] },
        { year: 'Year 2: Methods & Studio/Fieldwork', items: [profile.coreSkills[0] || 'Core Analytical Methods', profile.coreSkills[1] || 'Studio/Fieldwork Practice', 'Qualitative Analysis', 'Digital Portfolio Development'] },
        { year: 'Year 3: Applied Projects & Practicum', items: [profile.coreSkills[2] || 'Advanced Studio/Research', profile.coreSkills[3] || 'Applied Specialisation', 'External Practicum / Field Internship', 'Community / Client Engagement'] },
        { year: 'Year 4: Capstone & Showreel', items: ['Graduation Thesis / Major Exhibition / Production', 'Professional Practice & Ethics', 'Public Showcase & Portfolio Review', 'Career Networking'] }
      ],
      coreSubjects: profile.coreSkills.slice(0, 8),
      tools: profile.tools.concat(['Digital Publishing', 'Research Databases']).slice(0, 9),
      projects: [
        `Produce an independent research or creative portfolio piece in ${profile.name}`,
        `Execute a collaborative community or client-facing project using ${profile.tools[0] || 'creative tools'}`,
        `Publish a critical review or case analysis on contemporary issues in ${clusterName}`
      ],
      internshipStrategy: `Pursue internships with cultural institutions, media organizations, publishing houses, design studios, or policy think-tanks in the ${clusterName} sector.`,
      skillMilestones: [
        'Milestone 1: Establish strong writing, visual, or analytical foundations',
        `Milestone 2: Develop creative and practical techniques in ${profile.coreSkills[0] || 'specialized practice'}`,
        'Milestone 3: Complete verified internship and build public portfolio',
        'Milestone 4: Mount final capstone/exhibition and enter professional networks'
      ],
      careerPaths: profile.careers.slice(0, 6),
      topRecruiters: ['Creative Studios & Media Agencies', 'Cultural & Heritage Foundations', 'Publishing Houses', 'NGOs & Think Tanks', 'Corporate Communications Teams'],
      salaryDirection: 'Starting: ₹3-7 LPA | Mid-career: ₹8-18 LPA | Senior: ₹20-40+ LPA depending on portfolio quality, studio success, and reputation.',
      higherEd: ['Master of Arts (M.A.) / Master of Design (M.Des)', 'Ph.D. / Research Fellowships', 'Specialized Professional Diplomas', 'Curatorial / Directorial Programmes'],
      futureTrends: ['Digital media and creative technology', 'Interdisciplinary humanities and data ethics', 'Cultural preservation and global mobility', 'Content economy integration'],
      risks: ['Portfolio-dependent job market', 'Subjective evaluation in early career stages', 'Variable freelance incomes without institutional anchor'],
      actionPlan: [
        'Build a visible, documented portfolio from Year 1',
        `Master essential software and methods in ${profile.tools[0] || 'domain tools'}`,
        'Publish or present original work in exhibitions or journals',
        'Network with practitioners and alumni in target fields'
      ],
      isFallback: true
    };
  }

  // Default Engineering / Technology fallback (matches original branches_data.js generation)
  return {
    whyFits: `${profile.name} aligns with your profile because ${profile.desc.charAt(0).toLowerCase()}${profile.desc.slice(1)} ${profile.whoSuits.replace(/^Students who/i, 'You')}`,
    yearByYear: [
      { year: 'Year 1', items: ['Engineering Mathematics', 'Physics & Chemistry', 'Basic Sciences', `Introduction to ${nameFirstWord} Concepts`, 'Engineering Graphics', 'Communication Skills'] },
      { year: 'Year 2', items: [profile.coreSkills[0] || 'Core Subject 1', profile.coreSkills[1] || 'Core Subject 2', 'Applied Mathematics', 'Laboratory Practice', 'Workshop/Field Training', 'Technical Communication'] },
      { year: 'Year 3', items: [profile.coreSkills[2] || 'Advanced Subject 1', profile.coreSkills[3] || 'Advanced Subject 2', profile.coreSkills[4] || 'Specialization Elective', 'Industry Exposure', 'Project Work', 'Seminar'] },
      { year: 'Year 4', items: [profile.coreSkills[5] || 'Advanced Elective', 'Industry Internship', 'Capstone Project', 'Research Paper/Seminar', 'Professional Ethics', 'Technical Elective'] }
    ],
    coreSubjects: profile.coreSkills.slice(0, 8),
    tools: profile.tools.concat(['Excel']).slice(0, 9),
    projects: [
      `Design and implement a ${profile.coreSkills[0] || 'core engineering'} project`,
      `Build a practical application using ${profile.tools[0] || 'technical tools'}`,
      `Develop a ${profile.name.toLowerCase()} solution for industry`,
      `Create a simulation/analysis project using ${profile.tools[1] || 'CAD/Analysis software'}`,
      `Research and present on emerging trends in ${profile.name}`
    ],
    internshipStrategy: `Target companies in the ${clusterName} sector. Build a strong project portfolio demonstrating ${profile.coreSkills[0] || 'core technical'} skills. Seek industry mentorship during Year 3.`,
    skillMilestones: [
      'Sem 1-2: Build strong fundamentals in core sciences and mathematics',
      `Sem 3-4: Develop proficiency in ${profile.coreSkills[0] || 'core competencies'} and ${profile.coreSkills[1] || 'applied tools'}`,
      'Sem 5: First industry internship or research project',
      `Sem 6: Advanced specialization in ${profile.coreSkills[2] || 'core area'}`,
      'Sem 7-8: Industry-ready portfolio and placement preparation'
    ],
    careerPaths: profile.careers.slice(0, 6),
    topRecruiters: [`Industry leaders in ${clusterName} sector`, 'Research institutions', 'Government organizations', 'Private engineering companies', 'Startups', 'Manufacturing MNCs'],
    salaryDirection: 'Starting: ₹3-10 LPA | Mid-career: ₹10-25 LPA | Senior: ₹25-45+ LPA. Specialization and industry experience significantly impact compensation.',
    higherEd: [`M.Tech in ${profile.name}`, 'MS in related field (abroad)', 'MBA for management track', 'Research PhD for academic careers'],
    futureTrends: ['Industry 4.0 integration', `AI and automation in ${nameFirstWord.toLowerCase()} sector`, 'Sustainability and green practices', 'Digital transformation'],
    risks: ['Industry-specific market fluctuations', 'Requires continuous skill upgrades', 'Competition from adjacent fields'],
    actionPlan: [
      `Master core skills: ${profile.coreSkills[0] || 'fundamentals'} and ${profile.coreSkills[1] || 'tools'}`,
      'Build 3+ significant projects demonstrating practical skills',
      'Complete an industry internship by Year 3',
      `Get relevant certifications in ${profile.tools[0] || 'industry tools'}`,
      'Develop strong technical communication and teamwork skills'
    ],
    isFallback: true
  };
}

/**
 * Returns all active career profiles (built-in + validated manual extensions).
 */
export function getAllCareerProfiles(): CareerProfile[] {
  const manualList: CareerProfile[] = Array.isArray(manualExtensions)
    ? (manualExtensions as CareerProfile[]).filter(m => m && m.id && m.name)
    : [];

  const combined = [...BUILTIN_BRANCHES];
  const seenIds = new Set(combined.map(b => b.id));

  for (const m of manualList) {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id);
      combined.push(m);
    }
  }

  return combined;
}

/**
 * Returns only the original engineering assessment profiles (87 profiles).
 * Used exclusively by the engineering psychometric assessment system to ensure
 * zero regressions or unwanted non-engineering profiles leaking into engineering matching.
 */
export function getEngineeringAssessmentProfiles(): CareerProfile[] {
  return BUILTIN_BRANCHES.filter(b => b.isEngineeringAssessmentEligible);
}

/**
 * Returns a career profile by unique stable ID.
 */
export function getCareerProfileById(id: string): CareerProfile | null {
  const all = getAllCareerProfiles();
  return all.find(b => b.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Returns the career roadmap for a specific career profile.
 * Distinguishes explicitly authored roadmaps from domain-aware fallbacks.
 */
export function getCareerRoadmapById(id: string): CareerRoadmap | null {
  if (BUILTIN_ROADMAPS[id]) {
    return BUILTIN_ROADMAPS[id];
  }
  const profile = getCareerProfileById(id);
  if (profile) {
    return generateDomainAwareRoadmap(profile);
  }
  return null;
}

/**
 * Returns all clusters.
 */
export function getAllClusters(): Record<string, ClusterDefinition> {
  return CLUSTERS;
}

/**
 * Returns all streams.
 */
export function getAllStreams(): Record<string, StreamDefinition> {
  return STREAMS;
}

/**
 * Returns all traits.
 */
export function getAllTraits(): string[] {
  return TRAITS;
}

/**
 * Safe search and filter combining search query, cluster, stream, difficulty, and future scope.
 */
export function filterCareerProfiles(
  profiles: CareerProfile[],
  filter: CareerLibraryFilterState
): CareerProfile[] {
  const q = (filter.searchQuery || '').toLowerCase().trim();
  const diffVal = filter.difficulty;
  const scopeVal = filter.futureScope;
  const clusterVal = filter.cluster;
  const streamVal = filter.stream;

  return profiles.filter(b => {
    // 1. Stream filter
    if (streamVal && streamVal !== 'all') {
      if (b.stream !== streamVal) return false;
    }

    // 2. Cluster filter
    if (clusterVal && clusterVal !== 'all') {
      if (b.cluster !== clusterVal) return false;
    }

    // 3. Difficulty filter
    if (diffVal && diffVal !== 'all') {
      const targetDiff = parseInt(diffVal, 10);
      if (!isNaN(targetDiff) && b.difficulty !== targetDiff) return false;
    }

    // 4. Future scope filter
    if (scopeVal && scopeVal !== 'all') {
      const minScope = parseInt(scopeVal, 10);
      if (!isNaN(minScope) && b.futureScope < minScope) return false;
    }

    // 5. Query filter (matches name, desc, whoSuits, coreSkills, tools, careers)
    if (q) {
      const matchName = b.name.toLowerCase().includes(q);
      const matchDesc = (b.desc || '').toLowerCase().includes(q);
      const matchWho = (b.whoSuits || '').toLowerCase().includes(q);
      const matchSkills = b.coreSkills && b.coreSkills.some(s => s.toLowerCase().includes(q));
      const matchTools = b.tools && b.tools.some(t => t.toLowerCase().includes(q));
      const matchCareers = b.careers && b.careers.some(c => c.toLowerCase().includes(q));

      if (!matchName && !matchDesc && !matchWho && !matchSkills && !matchTools && !matchCareers) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Safely extracts personal match scores from a real user psychometric result.
 * Validates data types, ensures integer values 0-100, and never invents placeholder scores.
 */
export function extractMatchScoresFromReport(
  reportResult: any,
  allProfiles: CareerProfile[]
): Record<string, CareerMatchScore> {
  const matchMap: Record<string, CareerMatchScore> = {};

  if (!reportResult) return matchMap;

  // 1. Direct branch array (e.g. from engineering assessment report: allBranches or scores.allBranches)
  const allBranchesArray: any[] = 
    Array.isArray(reportResult.allBranches) ? reportResult.allBranches :
    Array.isArray(reportResult.scores?.allBranches) ? reportResult.scores.allBranches : [];

  if (allBranchesArray.length > 0) {
    allBranchesArray.forEach(item => {
      const rawScore = item.matchScore ?? item.match ?? item.score;
      if (typeof rawScore === 'number' && !isNaN(rawScore) && rawScore >= 0 && rawScore <= 100) {
        const targetId = (item.id || item.branch || '').toLowerCase().trim();
        const profile = allProfiles.find(p => p.id.toLowerCase() === targetId || p.name.toLowerCase() === (item.name || '').toLowerCase());
        if (profile) {
          matchMap[profile.id] = {
            branchId: profile.id,
            matchScore: Math.round(rawScore),
            source: 'direct'
          };
        }
      }
    });
  }

  // 2. Career fitment array from psychometric assessments (scores.careerFitment)
  const careerFitment: any[] =
    Array.isArray(reportResult.scores?.careerFitment) ? reportResult.scores.careerFitment :
    Array.isArray(reportResult.careerFitment) ? reportResult.careerFitment : [];

  if (careerFitment.length > 0) {
    careerFitment.forEach(cf => {
      const rawScore = cf.score;
      if (typeof rawScore === 'number' && !isNaN(rawScore) && rawScore >= 0 && rawScore <= 100) {
        const cfName = (cf.name || '').toLowerCase().trim();
        // Match against career profiles whose name or family or cluster matches
        allProfiles.forEach(p => {
          // If we already have a direct branch match score, preserve the direct one
          if (matchMap[p.id]?.source === 'direct') return;

          const pName = p.name.toLowerCase().trim();
          if (pName === cfName || cfName.includes(pName) || pName.includes(cfName)) {
            matchMap[p.id] = {
              branchId: p.id,
              matchScore: Math.round(rawScore),
              source: 'careerFitment'
            };
          }
        });
      }
    });
  }

  return matchMap;
}
