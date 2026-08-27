// ============================================================
// COMPARISON ENGINE — Parent–Student Psychometric Integration
//
// Performs deterministic comparison between student psychometric
// results and structured parent preferences.
// Only directly related constructs are compared.
// ============================================================

import type { ParentProfile } from './parent-scoring';
import { PREFERENCE_LABELS, RISK_LABELS } from './parent-scoring';

// ─── Input Types ────────────────────────────────────────────────────────────

export interface StudentComparisonData {
  topCareerFitment: Array<{ name: string; score: number; cluster: string; stream: string }>;
  topRiasecCodes: string[];
  topCareerValues: string[];
  careerValuesScores: Record<string, number>;
}

// ─── Output Types ───────────────────────────────────────────────────────────

export type AlignmentLevel = 'high_alignment' | 'moderate_alignment' | 'potential_gap' | 'significant_gap' | 'constraint' | 'aligned' | 'further_analysis';

export interface AlignmentArea {
  id: string;
  name: string;
  level: AlignmentLevel;
  studentSide: string;
  parentSide: string;
  explanation: string;
  discussionTopic: string;
}

export type OverallAlignment = 'Strong Alignment' | 'Moderate Alignment — Areas for Discussion' | 'Significant Areas for Discussion';

export interface AlignmentResult {
  overallIndicator: OverallAlignment;
  overallScore?: number;
  areas: AlignmentArea[];
  aiInterpretation?: string | null;
  timestamp: string;
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function getAlignmentLabel(level: AlignmentLevel): string {
  const map: Record<AlignmentLevel, string> = {
    high_alignment: 'High Alignment',
    moderate_alignment: 'Moderate Alignment',
    potential_gap: 'Potential Gap',
    significant_gap: 'Significant Gap',
    constraint: 'Constraint',
    aligned: 'Aligned',
    further_analysis: 'Further Analysis Recommended',
  };
  return map[level];
}

// ─── Core Comparison Engine ─────────────────────────────────────────────────

export function computeAlignment(
  student: StudentComparisonData,
  parent: ParentProfile
): AlignmentResult {
  const areas: AlignmentArea[] = [];
  
  // 1. Career Direction
  // Compare student top clusters vs parent perceived direction
  let directionLevel: AlignmentLevel = 'potential_gap';
  const parentDirection = parent.choices.perceivedCareerDirection;
  
  // Mapping parent categories to student clusters (heuristic for MVP, typically would be more robust)
  const isTechMatch = parentDirection === 'engineering_tech' && student.topCareerFitment.some(c => c.cluster.includes('Engineering') || c.cluster.includes('Technology'));
  const isMedMatch = parentDirection === 'medical_life_sciences' && student.topCareerFitment.some(c => c.cluster.includes('Medical') || c.cluster.includes('Science'));
  const isBizMatch = parentDirection === 'business_finance' && student.topCareerFitment.some(c => c.cluster.includes('Business') || c.cluster.includes('Finance'));
  const isLawMatch = parentDirection === 'law_public_service' && student.topCareerFitment.some(c => c.cluster.includes('Law') || c.cluster.includes('Public'));
  const isCreativeMatch = parentDirection === 'creative_media' && student.topCareerFitment.some(c => c.cluster.includes('Creative') || c.cluster.includes('Media') || c.cluster.includes('Arts'));
  
  if (parentDirection === 'open_exploring') {
    directionLevel = 'high_alignment';
  } else if (isTechMatch || isMedMatch || isBizMatch || isLawMatch || isCreativeMatch) {
    directionLevel = 'high_alignment';
  } else {
    // Check if there's any partial overlap (e.g. parent says tech, student has some tech inclination)
    // For now, if no direct match, call it a potential gap
    directionLevel = 'potential_gap';
  }

  const clusters = student.topCareerFitment.map(c => c.cluster || c.stream || c.name).filter(Boolean);
  const studentDirText = clusters.length > 0 ? clusters.slice(0, 2).join(', ') : 'Science, Technology & Applied Engineering';

  areas.push({
    id: 'career_direction',
    name: 'Career Direction',
    level: directionLevel,
    studentSide: `Top careers in: ${studentDirText}`,
    parentSide: parentDirection === 'open_exploring' ? 'Open to exploring paths' : `Prefers: ${parentDirection.replace('_', ' ')}`,
    explanation: directionLevel === 'high_alignment' 
      ? 'Parent and student expectations for general career fields are well-aligned or open.'
      : 'There is a difference between the student\'s strongest psychometric fit and the parent\'s expected career direction.',
    discussionTopic: 'Discuss how the student\'s natural strengths match up with the family\'s expectations for their future career field.'
  });

  // 2. Career Expectations (Values vs Stability/Prestige)
  const studentValues = student.topCareerValues;
  const parentStability = parent.numeric.stabilityPriority;
  const parentPrestige = parent.numeric.careerPrestigePriority;

  let expectationsLevel: AlignmentLevel = 'moderate_alignment';
  if ((studentValues.includes('creativity') || studentValues.includes('independence')) && (parentStability > 75 || parentPrestige > 75)) {
    expectationsLevel = 'significant_gap';
  } else if ((studentValues.includes('financial') || studentValues.includes('security')) && (parentStability > 50)) {
    expectationsLevel = 'high_alignment';
  }

  const valText = studentValues.length > 0 ? studentValues.join(', ') : 'Autonomy, Mastery & Creative Fulfillment';

  areas.push({
    id: 'career_expectations',
    name: 'Career Expectations',
    level: expectationsLevel,
    studentSide: `Prioritises: ${valText}`,
    parentSide: `Values stability (${parent.interpreted.stabilityPriority}) and prestige (${parent.interpreted.careerPrestigePriority})`,
    explanation: expectationsLevel === 'high_alignment' 
      ? 'Strong alignment between what the student values in a career and what the parent expects.'
      : expectationsLevel === 'significant_gap' 
        ? 'The student prioritises independence/creativity, while the parent strongly expects stability and prestige.'
        : 'Moderate alignment in underlying career drivers.',
    discussionTopic: 'Discuss what success looks like—is it job security, high income, or doing meaningful, creative work?'
  });

  // 3. Financial Feasibility
  let financialLevel: AlignmentLevel = 'aligned';
  const parentBudget = parent.choices.educationBudget;
  const parentReadiness = parent.choices.financialReadiness;
  
  if (parentBudget === 'budget_low' && !parent.choices.scholarshipDependency.includes('essential')) {
    financialLevel = 'potential_gap'; // We use careful language here per PRD
  }
  if (parentReadiness === 'not_started' || parentReadiness === 'early_stages') {
    financialLevel = 'further_analysis';
  }

  const finLevelMap: Record<string, string> = {
    'aligned': 'Aligned',
    'potential_gap': 'Potential Financial Constraint',
    'further_analysis': 'Further Cost Analysis Recommended',
  };

  areas.push({
    id: 'financial_feasibility',
    name: 'Financial Feasibility',
    level: financialLevel, // Need to map this specially in UI or keep as standard levels
    studentSide: `Career paths identified may require specialised higher education.`,
    parentSide: `Budget expectation: ${parentBudget.replace('budget_', '')}. Readiness: ${parentReadiness.replace('_', ' ')}.`,
    explanation: financialLevel === 'aligned'
      ? 'The family\'s financial expectations appear well-aligned with general education paths.'
      : 'Careful financial planning, including scholarship or loan exploration, is recommended.',
    discussionTopic: 'Review the typical costs of the student\'s preferred educational pathways and compare them with the family\'s budget.'
  });

  // 4. Study Abroad
  let abroadLevel: AlignmentLevel = 'moderate_alignment';
  const isGlobalProfile = student.topCareerValues.includes('adventure') || student.topRiasecCodes.includes('E');
  const parentAbroadOpenness = parent.numeric.internationalOpenness;

  if (isGlobalProfile && parentAbroadOpenness < 40) {
    abroadLevel = 'potential_gap';
  } else if (parentAbroadOpenness > 60) {
    abroadLevel = 'high_alignment';
  }

  areas.push({
    id: 'study_abroad',
    name: 'Study Abroad Expectations',
    level: abroadLevel,
    studentSide: isGlobalProfile ? 'Profile suggests openness to global experiences.' : 'Profile is neutral on global exposure.',
    parentSide: `International Openness: ${parent.interpreted.internationalOpenness}`,
    explanation: abroadLevel === 'high_alignment'
      ? 'The family is open to exploring international educational opportunities.'
      : 'There may be differences in readiness or desire to pursue education outside the home country.',
    discussionTopic: 'Discuss boundaries and preferences regarding studying in different cities or countries.'
  });

  // 5. Autonomy
  let autonomyLevel: AlignmentLevel = 'moderate_alignment';
  const studentLovesIndependence = student.topCareerValues.includes('independence');
  const parentAutonomyScore = parent.numeric.autonomyPreference;

  if (studentLovesIndependence && parentAutonomyScore < 40) {
    autonomyLevel = 'significant_gap';
  } else if (!studentLovesIndependence && parentAutonomyScore > 60) {
    autonomyLevel = 'high_alignment'; // Parent supports student led, student is flexible
  } else if (studentLovesIndependence && parentAutonomyScore > 60) {
    autonomyLevel = 'high_alignment';
  }

  areas.push({
    id: 'autonomy',
    name: 'Decision Making Autonomy',
    level: autonomyLevel,
    studentSide: studentLovesIndependence ? 'Strong preference for independence and self-direction.' : 'Adaptable to guidance.',
    parentSide: `Autonomy Preference: ${parent.interpreted.autonomyPreference}`,
    explanation: autonomyLevel === 'high_alignment'
      ? 'The parent\'s willingness to give autonomy matches the student\'s need for independence.'
      : 'There is a mismatch between how much independence the student wants and how much the parent is ready to provide.',
    discussionTopic: 'Discuss how career decisions will be made—who has the final say, and how much guidance the student wants.'
  });

  // 6. Risk Tolerance
  let riskLevel: AlignmentLevel = 'moderate_alignment';
  const studentIsAdventurous = student.topCareerValues.includes('adventure') || student.topRiasecCodes.includes('A');
  
  if (studentIsAdventurous && parent.numeric.riskTolerance < 40) {
    riskLevel = 'potential_gap';
  } else if (!studentIsAdventurous && parent.numeric.riskTolerance < 50) {
    riskLevel = 'high_alignment';
  } else if (studentIsAdventurous && parent.numeric.riskTolerance > 60) {
    riskLevel = 'high_alignment';
  }

  areas.push({
    id: 'risk',
    name: 'Risk Tolerance',
    level: riskLevel,
    studentSide: studentIsAdventurous ? 'Drawn to non-traditional, creative, or adventurous paths.' : 'Drawn to structured, predictable paths.',
    parentSide: `Risk Tolerance: ${parent.interpreted.riskTolerance}`,
    explanation: riskLevel === 'high_alignment'
      ? 'Both student and parent share similar comfort levels with taking career risks.'
      : 'The student may be drawn to less predictable paths while the parent prefers secure, traditional routes (or vice versa).',
    discussionTopic: 'Discuss the family\'s comfort level with emerging careers, startups, or non-traditional educational paths.'
  });

  // 7. Support
  const valSupportText = student.topCareerValues.length > 0 ? student.topCareerValues.join(', ') : 'Academic Mentorship & Intellectual Autonomy';

  areas.push({
    id: 'support',
    name: 'Support & Concerns',
    level: 'aligned', // More informational than evaluative
    studentSide: `Top values: ${valSupportText}`,
    parentSide: `Support Style: ${parent.choices.supportStyle.replace('_', ' ')}. Concern: ${parent.choices.primaryConcern.replace('_', ' ')}`,
    explanation: 'Understanding the parent\'s support style helps tailor how career exploration should proceed.',
    discussionTopic: 'Discuss the parent\'s primary concerns and how the student can help address them proactively.'
  });

  // Calculate Weighted Overall Indicator & Score
  // Product Weights: Career Direction (25%), Career Expectations (20%), Financial (15%),
  // Study Abroad (15%), Autonomy (10%), Risk (7.5%), Support (7.5%)
  const DOMAIN_WEIGHTS: Record<string, number> = {
    career_direction: 0.25,
    career_expectations: 0.20,
    financial_feasibility: 0.15,
    study_abroad: 0.15,
    autonomy: 0.10,
    risk: 0.075,
    support: 0.075,
  };

  const LEVEL_SCORES: Record<AlignmentLevel, number> = {
    high_alignment: 100,
    aligned: 100,
    moderate_alignment: 75,
    further_analysis: 70,
    potential_gap: 45,
    constraint: 40,
    significant_gap: 15,
  };

  let totalWeightedScore = 0;
  areas.forEach(a => {
    const weight = DOMAIN_WEIGHTS[a.id] ?? 0.1;
    const score = LEVEL_SCORES[a.level] ?? 60;
    totalWeightedScore += score * weight;
  });

  const overallScore = Math.round(totalWeightedScore);

  let overallIndicator: OverallAlignment = 'Moderate Alignment — Areas for Discussion';
  if (overallScore >= 80) {
    overallIndicator = 'Strong Alignment';
  } else if (overallScore < 60) {
    overallIndicator = 'Significant Areas for Discussion';
  }

  return {
    overallIndicator,
    overallScore,
    areas,
    timestamp: new Date().toISOString()
  };
}
