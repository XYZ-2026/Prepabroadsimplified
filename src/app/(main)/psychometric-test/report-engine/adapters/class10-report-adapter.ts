/**
 * Class 10 Report Data Adapter
 * ─────────────────────────────────────────────────────────────────────────────
 * Authoritative baseline adapter that maintains 100% exact structural and
 * data parity with the approved Class 10 executive report.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../../class10_editorial_engine';
import type { AlignmentResult } from '../../comparison-engine';
import type { ParentProfile } from '../../parent-scoring';
import {
  getPathwayRoadmapData,
  getStudyAbroadGuideData,
  getAcademicProfileRoadmapData,
  getStudentActionPlanData,
} from '../../class10_roadmap_engine';
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
  const pathways = scores.careerFitment || [];
  const primaryName = pathways[0]?.name || 'Science Stream — Engineering & Technology (PCM)';
  const secondaryName = pathways[1]?.name || 'Commerce, Business & Management Stream';
  const alternativeName = pathways[2]?.name || 'Humanities, Social Sciences & Creative Arts';

  const primaryRoadmap = getPathwayRoadmapData(
    primaryName,
    'PRIMARY PATHWAY (RANK 1)',
    student,
    scores,
    comparisonData
  );

  const secondaryRoadmap = getPathwayRoadmapData(
    secondaryName,
    'SECONDARY PATHWAY (RANK 2)',
    student,
    scores,
    comparisonData
  );

  const alternativeRoadmap = getPathwayRoadmapData(
    alternativeName,
    'STRATEGIC ALTERNATIVE (RANK 3)',
    student,
    scores,
    comparisonData
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
