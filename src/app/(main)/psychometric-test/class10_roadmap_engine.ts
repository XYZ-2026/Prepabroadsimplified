/**
 * Unified Class 10 Deterministic Roadmap Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Delegates to the authoritative Unified Roadmap Engine to ensure single source
 * of truth and prevent any roadmap duplication across reports.
 */

import type { EditorialStudent, EditorialScores } from './class10_editorial_engine';
import type { AlignmentResult } from './comparison-engine';
import {
  getRoadmapByRank,
  getStudyAbroadGuideData as getUnifiedStudyAbroad,
  getAcademicProfileRoadmapData as getUnifiedAcademicRoadmap,
  getStudentActionPlanData as getUnifiedActionPlan,
  resolvePathwayId,
  PATHWAY_REGISTRY,
} from './report-engine/unified-roadmap-engine';

export interface DegreeOption {
  degree: string;
  specialization: string;
  whyFits: string;
  careerOutcomes: string;
}

export interface PathwayRoadmapData {
  pathwayId?: string;
  streamId?: 'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES';
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

export type SpecializedDomain =
  | 'CIVIL_ARCHITECTURE'
  | 'MECHANICAL_AEROSPACE'
  | 'ELECTRICAL_ELECTRONICS'
  | 'ROBOTICS_AUTOMATION'
  | 'SOFTWARE_AI_CS'
  | 'MEDICINE_SURGERY'
  | 'PHARMACY_BIOTECH'
  | 'CHARTERED_ACCOUNTANCY_FINANCE'
  | 'LAW_LEGAL'
  | 'BUSINESS_MANAGEMENT_MARKETING'
  | 'PSYCHOLOGY_HUMANITIES'
  | 'DESIGN_ANIMATION_FINE_ARTS'
  | 'PURE_SCIENCES';

export function getSpecializedDomain(pathwayName: string): SpecializedDomain {
  const id = resolvePathwayId(pathwayName);
  const def = PATHWAY_REGISTRY[id];
  const stream = def ? def.streamId : 'PCM';
  if (stream === 'PCB') return 'MEDICINE_SURGERY';
  if (stream === 'COMMERCE') return 'BUSINESS_MANAGEMENT_MARKETING';
  if (stream === 'HUMANITIES') return 'PSYCHOLOGY_HUMANITIES';
  return 'SOFTWARE_AI_CS';
}

/**
 * Deterministic Pathway Roadmap Generator
 * Resolves roadmap data strictly according to pathway ranking and registry configuration.
 */
export function getPathwayRoadmapData(
  pathwayName: string,
  rankLabel: string,
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): PathwayRoadmapData {
  const rank: 1 | 2 | 3 = rankLabel.includes('2') ? 2 : rankLabel.includes('3') ? 3 : 1;
  const variant = /12|senior/i.test(student.grade || '') ? 'senior' : /7|8|9|junior/i.test(student.grade || '') ? 'junior' : 'grade10';

  // Build a careerFitment list ensuring rank index matches
  let fitmentList = scores?.careerFitment ? [...scores.careerFitment] : [];
  if (fitmentList.length === 0) {
    fitmentList = [{ name: pathwayName, score: 85 }];
  }
  while (fitmentList.length < rank) {
    fitmentList.push({ name: pathwayName, score: Math.max(60, 85 - fitmentList.length * 5) });
  }
  if (pathwayName && fitmentList[rank - 1]) {
    fitmentList[rank - 1] = {
      ...fitmentList[rank - 1],
      name: pathwayName,
    };
  }

  return getRoadmapByRank(
    rank,
    fitmentList,
    variant as any,
    student,
    scores,
    comparisonData
  );
}

/**
 * Personalized Study Abroad Guide Generator
 */
export function getStudyAbroadGuideData(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): StudyAbroadGuideData {
  return getUnifiedStudyAbroad(student, scores, comparisonData);
}

/**
 * Academic & Profile Roadmap Timeline Generator
 */
export function getAcademicProfileRoadmapData(
  student: EditorialStudent,
  scores: EditorialScores
): AcademicStage[] {
  return getUnifiedAcademicRoadmap(student, scores);
}

/**
 * Student Action Plan Generator
 */
export function getStudentActionPlanData(
  student: EditorialStudent,
  scores: EditorialScores
): StudentActionPlanData {
  return getUnifiedActionPlan(student, scores);
}
