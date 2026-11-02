/**
 * Senior Report Data Adapter (Class 11–12)
 * ─────────────────────────────────────────────────────────────────────────────
 * Adapts Class 11–12 assessment results into the Universal 56-Page Report Schema.
 * Uses the authoritative Unified Roadmap Engine for single-source-of-truth
 * deterministic degree & career pathways with duplicate guard.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../../class10_editorial_engine';
import type { AlignmentResult } from '../../comparison-engine';
import type { ParentProfile } from '../../parent-scoring';
import {
  getRoadmapByRank,
  validateAndDeduplicateRoadmaps,
  getStudyAbroadGuideData,
  getAcademicProfileRoadmapData,
  getStudentActionPlanData,
} from '../unified-roadmap-engine';
import {
  type UniversalReportData,
  getVariantConfig,
} from '../universal-report-schema';

export function adaptSeniorReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): UniversalReportData {
  const config = getVariantConfig('senior');

  // Extract top 3 career/degree pathways from Class 12 careerFitment
  const pathways = scores.careerFitment && scores.careerFitment.length > 0
    ? scores.careerFitment
    : [
        { id: 'software_engineering', name: 'Software Engineering & IT', score: 94 },
        { id: 'data_science_ai', name: 'Data Science & AI', score: 88 },
        { id: 'mechanical_engineering', name: 'Mechanical Engineering', score: 82 },
      ];

  const primaryRoadmap = getRoadmapByRank(1, pathways as any, 'senior', student, scores, comparisonData);
  const secondaryRoadmap = getRoadmapByRank(2, pathways as any, 'senior', student, scores, comparisonData);
  const alternativeRoadmap = getRoadmapByRank(3, pathways as any, 'senior', student, scores, comparisonData);

  const validatedRoadmaps = validateAndDeduplicateRoadmaps(
    { primary: primaryRoadmap, secondary: secondaryRoadmap, alternative: alternativeRoadmap },
    student.reportId || 'REP-SENIOR',
    process.env.NODE_ENV === 'test'
  );

  const studyAbroad = getStudyAbroadGuideData(student, scores, comparisonData);
  const academicRoadmap = getAcademicProfileRoadmapData(student, scores);
  const actionPlan = getStudentActionPlanData(student, scores);

  return {
    variant: 'senior',
    config,
    student: {
      ...student,
      grade: student.grade || 'Class 12',
    },
    scores: {
      ...scores,
      careerFitment: pathways as any,
    },
    personalization,
    comparisonData: comparisonData || null,
    parentProfile: parentProfile || null,
    roadmaps: validatedRoadmaps,
    studyAbroad,
    academicRoadmap,
    actionPlan,
  };
}
