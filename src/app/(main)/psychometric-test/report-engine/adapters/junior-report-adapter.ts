/**
 * Junior Report Data Adapter (Class 7–9)
 * ─────────────────────────────────────────────────────────────────────────────
 * Adapts Class 7–9 assessment results into the Universal 56-Page Report Schema.
 * Uses the authoritative Unified Roadmap Engine for single-source-of-truth
 * deterministic exploratory vectors with duplicate guard.
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

export function adaptJuniorReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): UniversalReportData {
  const config = getVariantConfig('junior');

  // Extract exploratory vectors from student's careerFitment
  const pathways = scores.careerFitment && scores.careerFitment.length > 0
    ? scores.careerFitment
    : [
        { id: 'pcm_stream', name: 'STEM, Engineering & Computational Logic Vector', score: 88 },
        { id: 'commerce_stream', name: 'Commerce, Economics & Entrepreneurial Discovery Vector', score: 82 },
        { id: 'humanities_stream', name: 'Humanities, Social Sciences & Creative Expression Vector', score: 78 },
      ];

  const primaryRoadmap = getRoadmapByRank(1, pathways as any, 'junior', student, scores, comparisonData);
  const secondaryRoadmap = getRoadmapByRank(2, pathways as any, 'junior', student, scores, comparisonData);
  const alternativeRoadmap = getRoadmapByRank(3, pathways as any, 'junior', student, scores, comparisonData);

  const validatedRoadmaps = validateAndDeduplicateRoadmaps(
    { primary: primaryRoadmap, secondary: secondaryRoadmap, alternative: alternativeRoadmap },
    student.reportId || 'REP-JUNIOR',
    process.env.NODE_ENV === 'test'
  );

  const studyAbroad = getStudyAbroadGuideData(student, scores, comparisonData);
  const academicRoadmap = getAcademicProfileRoadmapData(student, scores);
  const actionPlan = getStudentActionPlanData(student, scores);

  return {
    variant: 'junior',
    config,
    student: {
      ...student,
      grade: student.grade || 'Class 8',
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
