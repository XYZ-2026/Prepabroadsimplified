/**
 * Universal Report Data Consistency Validator
 * ─────────────────────────────────────────────────────────────────────────────
 * Cross-validates data consistency across all pages and modules:
 * candidate identity, academic stage, mathematical score coherence,
 * pathway-to-roadmap fidelity, and action plan alignment.
 */

import type { UniversalReportData, ReportVariant } from '../universal-report-schema';

export interface ConsistencyValidationResult {
  consistent: boolean;
  discrepancies: string[];
}

export function validateReportDataConsistency(
  data: UniversalReportData,
  variant: ReportVariant
): ConsistencyValidationResult {
  const discrepancies: string[] = [];

  // 1. Candidate Identity & Academic Stage Consistency
  const gradeStr = String(data.student?.grade || '').toLowerCase();
  if (variant === 'junior') {
    if (gradeStr.includes('10') && !gradeStr.includes('7') && !gradeStr.includes('8') && !gradeStr.includes('9')) {
      discrepancies.push(`Identity mismatch: Junior variant contains Class 10 grade label: '${data.student.grade}'`);
    }
    if (gradeStr.includes('12')) {
      discrepancies.push(`Identity mismatch: Junior variant contains Class 12 grade label: '${data.student.grade}'`);
    }
  } else if (variant === 'grade10') {
    if (!gradeStr.includes('10')) {
      discrepancies.push(`Identity mismatch: Grade 10 variant contains non-Class-10 grade label: '${data.student.grade}'`);
    }
  } else if (variant === 'senior') {
    if (!gradeStr.includes('12') && !gradeStr.includes('11') && !gradeStr.includes('senior')) {
      discrepancies.push(`Identity mismatch: Senior variant contains non-senior grade label: '${data.student.grade}'`);
    }
  }

  // 2. Mathematical Score Coherence
  const sc = data.scores;
  if (sc?.aptitude) {
    const apt = sc.aptitude;
    const computedOverall = Math.round((apt.verbal + apt.numerical + apt.reasoning + apt.spatial) / 4);
    if (Math.abs(computedOverall - apt.overall) > 2) {
      discrepancies.push(
        `Aptitude math discrepancy: Overall aptitude score (${apt.overall}) deviates from calculated mean (${computedOverall}) of dimensions [V:${apt.verbal}, N:${apt.numerical}, R:${apt.reasoning}, S:${apt.spatial}]`
      );
    }
  }

  // 3. Pathway-to-Roadmap Coherence
  // Page 49 recommended pathways must match Pages 50, 51, 52 roadmaps
  const rm = data.roadmaps;
  if (rm) {
    if (sc?.careerFitment && sc.careerFitment.length >= 3) {
      const topFit = sc.careerFitment[0].name.toLowerCase();
      const primaryRm = rm.primary.pathwayName.toLowerCase();
      // Verify primary roadmap correlates with top fitment
      if (!primaryRm.includes(topFit) && !topFit.includes(primaryRm) && !primaryRm.includes('primary') && !primaryRm.includes('vector')) {
        discrepancies.push(`Pathway mismatch: Page 50 primary roadmap ('${rm.primary.pathwayName}') does not correlate with top fitment ('${sc.careerFitment[0].name}')`);
      }
    }

    if (rm.primary.fitScore !== undefined && sc?.careerFitment?.[0]?.score !== undefined) {
      if (Math.abs(rm.primary.fitScore - sc.careerFitment[0].score) > 10) {
        discrepancies.push(`Score mismatch: Primary roadmap fit score (${rm.primary.fitScore}) differs significantly from career fitment score (${sc.careerFitment[0].score})`);
      }
    }
  }

  // 4. Academic Roadmap Stage-1 Alignment
  if (data.academicRoadmap && data.academicRoadmap.length > 0) {
    const stage1 = data.academicRoadmap[0];
    if (stage1.phase !== 'STAGE 1') {
      discrepancies.push(`Roadmap phase error: First academic roadmap stage phase is '${stage1.phase}', expected 'STAGE 1'`);
    }
  }

  // 5. Study Abroad Alignment
  if (data.studyAbroad) {
    if (!data.studyAbroad.countries || data.studyAbroad.countries.length === 0) {
      discrepancies.push('Study Abroad discrepancy: No destination countries specified');
    }
  }

  return {
    consistent: discrepancies.length === 0,
    discrepancies,
  };
}
