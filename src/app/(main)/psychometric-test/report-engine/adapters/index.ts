/**
 * Universal Report Adapter Index & Factory
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides an authoritative entry point to adapt candidate assessment data
 * into the Universal Report Schema based on variant ('junior' | 'grade10' | 'senior').
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../../class10_editorial_engine';
import type { AlignmentResult } from '../../comparison-engine';
import type { ParentProfile } from '../../parent-scoring';
import { type UniversalReportData, type ReportVariant } from '../universal-report-schema';
import { adaptJuniorReportData } from './junior-report-adapter';
import { adaptClass10ReportData } from './class10-report-adapter';
import { adaptSeniorReportData } from './senior-report-adapter';

export function resolveReportVariant(
  rawVariant?: string | null,
  grade?: string | null
): ReportVariant {
  const v = String(rawVariant || '').toLowerCase().trim();
  const g = String(grade || '').toLowerCase().trim();

  // 1. Authoritative Grade Evaluation (The candidate's registered academic class takes absolute priority)
  // Class 7, 8, 9 (Junior / Middle School Foundation Stage)
  const isJuniorGrade = (
    g === '7' || g === '8' || g === '9' ||
    g === '7th' || g === '8th' || g === '9th' ||
    g.includes('class 7') || g.includes('class 8') || g.includes('class 9') ||
    g.includes('grade 7') || g.includes('grade 8') || g.includes('grade 9') ||
    g.includes('7-9') || g.includes('7_9') || g.includes('7–9') ||
    g.includes('junior') || g.includes('middle')
  );
  if (isJuniorGrade) {
    return 'junior';
  }

  // Class 10 (Secondary Stage - Stream Selector)
  const isGrade10 = (
    g === '10' || g === '10th' ||
    g.includes('class 10') || g.includes('grade 10') ||
    g.includes('tenth') || g === 'class_10' || g === 'grade10'
  );
  if (isGrade10) {
    return 'grade10';
  }

  // Class 11, 12 (Senior Secondary / Pre-University Stage)
  const isSeniorGrade = (
    g === '11' || g === '12' || g === '11th' || g === '12th' ||
    g.includes('class 11') || g.includes('class 12') ||
    g.includes('grade 11') || g.includes('grade 12') ||
    g.includes('senior') || g.includes('highschool') || g.includes('pre-university')
  );
  if (isSeniorGrade) {
    return 'senior';
  }

  // 2. Secondary Variant Evaluation (If grade was not provided or non-specific)
  if (
    v === 'junior' || v === 'junior_7_9' || v === 'juniors' ||
    v === '7-9' || v === '7_9' || v === '7–9' || v === 'grade7_9' ||
    v.includes('junior') || v.includes('7_9') || v.includes('7-9')
  ) {
    return 'junior';
  }

  if (
    v === 'grade10' || v === 'class_10' || v === 'class10' ||
    v === '10' || v === 'tenth' || v.includes('grade10') || v.includes('class10') || v.includes('class_10')
  ) {
    return 'grade10';
  }

  if (
    v === 'senior' || v === 'senior_12' || v === 'grade12' ||
    v === 'class12' || v === 'class_12' || v === '12' || v === '11' ||
    v === 'highschool' || v.includes('senior') || v.includes('12') || v.includes('11')
  ) {
    return 'senior';
  }

  // Baseline default for secondary assessment is Grade 10
  return 'grade10';
}

export function adaptReportData(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null,
  variant?: ReportVariant | string | null
): UniversalReportData {
  const resolvedVariant = resolveReportVariant(variant, student.grade);

  switch (resolvedVariant) {
    case 'junior':
      return adaptJuniorReportData(student, scores, personalization, comparisonData, parentProfile);
    case 'senior':
      return adaptSeniorReportData(student, scores, personalization, comparisonData, parentProfile);
    case 'grade10':
    default:
      return adaptClass10ReportData(student, scores, personalization, comparisonData, parentProfile);
  }
}

export { adaptJuniorReportData, adaptClass10ReportData, adaptSeniorReportData };
