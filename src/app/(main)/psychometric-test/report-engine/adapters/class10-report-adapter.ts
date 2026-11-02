/**
 * Class 10 Report Data Adapter
 * ─────────────────────────────────────────────────────────────────────────────
 * Adapts Class 10 assessment results into the Universal 56-Page Report Schema.
 * Uses the authoritative Unified Roadmap Engine for single-source-of-truth
 * deterministic pathway roadmaps with duplicate guard.
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

export function adaptClass10ReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): UniversalReportData {
  const config = getVariantConfig('grade10');

  // Extract top 3 pathways from careerFitment
  const pathways = scores.careerFitment && scores.careerFitment.length > 0
    ? scores.careerFitment
    : [
        { id: 'pcm_stream', name: 'Science Stream – Engineering & Tech Track (PCM)', score: 94 },
        { id: 'commerce_stream', name: 'Commerce, Business & Management Stream', score: 85 },
        { id: 'humanities_stream', name: 'Humanities & Creative Arts Stream', score: 78 },
      ];

  const primaryRoadmap = getRoadmapByRank(1, pathways as any, 'grade10', student, scores, comparisonData);
  const secondaryRoadmap = getRoadmapByRank(2, pathways as any, 'grade10', student, scores, comparisonData);
  const alternativeRoadmap = getRoadmapByRank(3, pathways as any, 'grade10', student, scores, comparisonData);

  const validatedRoadmaps = validateAndDeduplicateRoadmaps(
    { primary: primaryRoadmap, secondary: secondaryRoadmap, alternative: alternativeRoadmap },
    student.reportId || 'REP-CLASS10',
    process.env.NODE_ENV === 'test'
  );

  const studyAbroad = getStudyAbroadGuideData(student, scores, comparisonData);
  const academicRoadmap = getAcademicProfileRoadmapData(student, scores);
  const actionPlan = getStudentActionPlanData(student, scores);

  return {
    variant: 'grade10',
    config,
    student: {
      ...student,
      grade: student.grade || 'Class 10',
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
