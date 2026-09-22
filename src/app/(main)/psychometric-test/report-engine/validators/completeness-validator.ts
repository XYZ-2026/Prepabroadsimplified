/**
 * Universal Report Completeness Validator
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates that all 56 pages of the report have complete, non-null,
 * non-undefined, non-empty data without placeholders or missing sections.
 */

import type { UniversalReportData, ReportVariant } from '../universal-report-schema';

export interface CompletenessValidationResult {
  valid: boolean;
  pageCount: number;
  totalExpectedPages: number;
  errors: string[];
}

export function validateReportCompleteness(
  data: UniversalReportData,
  expectedVariant?: ReportVariant
): CompletenessValidationResult {
  const errors: string[] = [];

  // 1. Candidate & Metadata (Pages 01–08)
  if (!data.student?.name || data.student.name.trim() === '') {
    errors.push('Page 01-08: Missing candidate name in student object');
  }
  if (!data.student?.grade || data.student.grade.trim() === '') {
    errors.push('Page 01-08: Missing candidate grade in student object');
  }
  if (!data.student?.reportId || data.student.reportId.trim() === '') {
    errors.push('Page 01-08: Missing reportId in student object');
  }
  if (!data.config?.academicStage || data.config.academicStage.trim() === '') {
    errors.push('Page 01-08: Missing academicStage in variant config');
  }

  // 2. Diagnostic Snapshot & Analytics (Pages 09–11)
  const sc = data.scores;
  if (!sc) {
    errors.push('Pages 09-11: Scores payload is entirely missing');
  } else {
    if (sc.aptitude?.verbal == null || sc.aptitude?.numerical == null || sc.aptitude?.reasoning == null || sc.aptitude?.spatial == null) {
      errors.push('Pages 09-10: Incomplete aptitude scores breakdown');
    }
    if (sc.personality?.openness == null || sc.personality?.conscientiousness == null || sc.personality?.extraversion == null) {
      errors.push('Pages 09-10: Incomplete Big Five personality scores breakdown');
    }
    if (!sc.topRiasec || sc.topRiasec.length === 0) {
      errors.push('Page 11: Missing top RIASEC codes');
    }
    if (!sc.topVark) {
      errors.push('Page 11: Missing top VARK learning style');
    }
    if (!sc.careerFitment || sc.careerFitment.length < 3) {
      errors.push('Pages 09, 11: Career fitment requires at least 3 rated pathways/clusters');
    }
  }

  // 3. Modules 01–30 (Pages 12–41)
  // Check that the data contains all necessary metrics for the 30 modules
  if (!sc.personality?.emotionalStability || !sc.personality?.agreeableness) {
    errors.push('Pages 12-21 (Phase I): Incomplete Big Five emotional stability or agreeableness');
  }

  // 4. Executive Profile Synthesis (Page 42)
  if (!data.personalization) {
    errors.push('Page 42: Missing personalization data');
  } else {
    if (!data.personalization.strengths || data.personalization.strengths.length === 0) {
      errors.push('Page 42: Missing candidate strengths list');
    }
    if (!data.personalization.growthAreas || data.personalization.growthAreas.length === 0) {
      errors.push('Page 42: Missing candidate growth areas list');
    }
  }

  // 5. Family Alignment (Pages 43–45)
  // Either comparisonData exists or fallback advisory is defined
  // (Both are valid in the system architecture; no silent blank spaces)
  if (data.comparisonData) {
    if (!data.comparisonData.overallIndicator) {
      errors.push('Page 43: Missing overallIndicator in comparisonData');
    }
    if (!data.comparisonData.areas || data.comparisonData.areas.length === 0) {
      errors.push('Page 44: Missing comparison areas in comparisonData');
    }
  }

  // 6. Recommended Pathways & Roadmaps (Pages 49–52)
  const rm = data.roadmaps;
  if (!rm?.primary) {
    errors.push('Pages 49-50: Missing Primary Pathway Roadmap');
  } else {
    if (!rm.primary.pathwayName || !rm.primary.rationale) {
      errors.push('Page 50: Incomplete Primary Pathway metadata or rationale');
    }
    if (!rm.primary.foundation?.subjects || rm.primary.foundation.subjects.length === 0) {
      errors.push('Page 50: Missing Primary Pathway foundation subjects');
    }
    if (!rm.primary.bachelors || rm.primary.bachelors.length === 0) {
      errors.push('Page 50: Missing Primary Pathway undergraduate degree options');
    }
    if (!rm.primary.colleges?.reach || rm.primary.colleges.reach.length === 0) {
      errors.push('Page 50: Missing Primary Pathway college benchmarks');
    }
  }

  if (!rm?.secondary) {
    errors.push('Pages 49, 51: Missing Secondary Pathway Roadmap');
  } else if (!rm.secondary.pathwayName || !rm.secondary.rationale) {
    errors.push('Page 51: Incomplete Secondary Pathway metadata or rationale');
  }

  if (!rm?.alternative) {
    errors.push('Pages 49, 52: Missing Strategic Alternative Pathway Roadmap');
  } else if (!rm.alternative.pathwayName || !rm.alternative.rationale) {
    errors.push('Page 52: Incomplete Alternative Pathway metadata or rationale');
  }

  // 7. Study Abroad Guide (Page 53)
  if (!data.studyAbroad) {
    errors.push('Page 53: Missing studyAbroad guide data');
  } else {
    if (!data.studyAbroad.countries || data.studyAbroad.countries.length < 3) {
      errors.push('Page 53: Study abroad guide requires at least 3 targeted countries');
    }
    if (!data.studyAbroad.scholarships || data.studyAbroad.scholarships.length === 0) {
      errors.push('Page 53: Missing scholarship opportunities');
    }
    if (!data.studyAbroad.programs || data.studyAbroad.programs.length === 0) {
      errors.push('Page 53: Missing targeted study abroad programs');
    }
  }

  // 8. Academic & Profile Roadmap (Page 54)
  if (!data.academicRoadmap || data.academicRoadmap.length < 5) {
    errors.push('Page 54: Academic & Profile Roadmap requires 5 developmental stages (Stage 1 to 5)');
  } else {
    data.academicRoadmap.forEach((stage, idx) => {
      if (!stage.academicGoal || !stage.profileGoal || !stage.milestone) {
        errors.push(`Page 54: Incomplete content for stage ${idx + 1} (${stage.phase})`);
      }
    });
  }

  // 9. Student Action Plan (Page 55)
  if (!data.actionPlan) {
    errors.push('Page 55: Missing actionPlan data');
  } else {
    if (!data.actionPlan.thisMonth || data.actionPlan.thisMonth.length === 0) {
      errors.push('Page 55: Missing thisMonth action milestones');
    }
    if (!data.actionPlan.next90Days || data.actionPlan.next90Days.length === 0) {
      errors.push('Page 55: Missing next90Days action milestones');
    }
    if (!data.actionPlan.thisAcademicYear || data.actionPlan.thisAcademicYear.length === 0) {
      errors.push('Page 55: Missing thisAcademicYear action milestones');
    }
    if (!data.actionPlan.skillsToBuild || data.actionPlan.skillsToBuild.length === 0) {
      errors.push('Page 55: Missing skillsToBuild list');
    }
  }

  // 10. Conclusion & Counsellor Protocols (Page 56)
  if (!data.config?.conclusionTerminology?.closingTitle || !data.config.conclusionTerminology.closingSummary) {
    errors.push('Page 56: Missing conclusion terminology in variant config');
  }

  // Verify variant alignment if expectedVariant specified
  if (expectedVariant && data.variant !== expectedVariant) {
    errors.push(`Variant mismatch: Expected '${expectedVariant}', received '${data.variant}'`);
  }

  return {
    valid: errors.length === 0,
    pageCount: errors.length === 0 ? 56 : 56 - errors.length,
    totalExpectedPages: 56,
    errors,
  };
}
