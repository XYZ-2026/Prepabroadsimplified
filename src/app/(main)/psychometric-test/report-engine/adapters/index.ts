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

  if (v === 'junior' || v === '7-9' || v === '7_9' || g.includes('7') || g.includes('8') || g.includes('9')) {
    return 'junior';
  }

  if (v === 'senior' || v === 'grade12' || v === '12' || v === 'highschool' || g.includes('12') || g.includes('11')) {
    return 'senior';
  }

  // Baseline default is Grade 10
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
