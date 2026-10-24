/**
 * CLARVO Career Library — Type Definitions & Architecture Contracts
 * Supports Engineering, Commerce, Arts & Humanities, Science/Health, Law, Design, and Future Domains.
 */

export type StreamId = 'engineering' | 'science-health' | 'commerce' | 'arts' | 'humanities' | 'law' | 'design' | string;

export interface StreamDefinition {
  name: string;
  icon: string;
  eligibility: string;
}

export interface ClusterDefinition {
  name: string;
  icon: string;
  max: number;
  stream: StreamId;
}

export interface RoadmapYear {
  year: string;
  items: string[];
}

export interface CareerRoadmap {
  whyFits: string;
  entryRoute?: string;
  yearByYear: RoadmapYear[];
  coreSubjects: string[];
  tools: string[];
  projects: string[];
  internshipStrategy: string;
  skillMilestones: string[];
  careerPaths: string[];
  topRecruiters: string[];
  salaryDirection: string;
  higherEd?: string[];
  futureTrends: string[];
  risks: string[];
  actionPlan: string[];
  isFallback?: boolean;
  lastReviewed?: string;
  sourceNotes?: string;
}

export interface CareerProfile {
  id: string;
  name: string;
  cluster: string;
  family?: string;
  stream: StreamId;
  desc: string;
  difficulty: number; // 1 to 5
  futureScope: number; // 1 to 5
  whoSuits: string;
  traitVector: Record<string, number>;
  coreSkills: string[];
  tools: string[];
  careers: string[];
  isEngineeringAssessmentEligible: boolean;
  hasExplicitRoadmap: boolean;
  sourceNotes?: string;
  lastReviewed?: string;
}

export interface CareerMatchScore {
  branchId: string;
  matchScore: number; // integer 0 - 100
  source: 'direct' | 'cluster' | 'careerFitment';
}

export interface CareerLibraryFilterState {
  searchQuery: string;
  stream: string; // 'all' or specific stream
  cluster: string; // 'all' or specific clusterId
  difficulty: string; // 'all' | '3' | '4' | '5'
  futureScope: string; // 'all' | '3' | '4' | '5'
}
