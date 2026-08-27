// ============================================================
// PARENT SCORING ENGINE — Parent–Student Psychometric Integration
//
// Computes structured parent preference dimensions from raw answers.
// Internal numeric values (0-100) are used only for comparison.
// Product-facing output uses interpreted labels:
//   Low Preference | Moderate Preference | Strong Preference | Very Strong Preference
//
// This is NOT a psychometric instrument. These are contextual
// preference dimensions, not scientific personality traits.
// ============================================================

import type { Section } from './data';

// ─── Interpreted Level Types ────────────────────────────────────────────────

export type PreferenceLevel = 'low' | 'moderate' | 'high' | 'very_high';

export const PREFERENCE_LABELS: Record<PreferenceLevel, string> = {
  low: 'Low Preference',
  moderate: 'Moderate Preference',
  high: 'Strong Preference',
  very_high: 'Very Strong Preference',
};

export type RiskLevel = 'conservative' | 'moderate' | 'open' | 'very_open';

export const RISK_LABELS: Record<RiskLevel, string> = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  open: 'Open',
  very_open: 'Very Open',
};

// ─── Parent Profile (Internal) ──────────────────────────────────────────────
// Internal numeric values for comparison engine use only.

export interface ParentProfileNumeric {
  stabilityPriority: number;              // 0-100
  careerPrestigePriority: number;         // 0-100
  financialFlexibility: number;           // 0-100 (higher = more flexible)
  internationalOpenness: number;          // 0-100
  rankingPriority: number;                // 0-100
  autonomyPreference: number;             // 0-100 (higher = more student autonomy)
  riskTolerance: number;                  // 0-100
  academicExpectation: number;            // 0-100 (higher = stricter)
}

// ─── Parent Profile (Product-Facing) ────────────────────────────────────────
// Interpreted labels for display in reports and alignment sections.

export interface ParentProfileInterpreted {
  stabilityPriority: PreferenceLevel;
  careerPrestigePriority: PreferenceLevel;
  financialFlexibility: PreferenceLevel;
  internationalOpenness: PreferenceLevel;
  rankingPriority: PreferenceLevel;
  autonomyPreference: PreferenceLevel;
  riskTolerance: RiskLevel;
  academicExpectation: PreferenceLevel;
}

// ─── Parent Choice Data (Structured) ────────────────────────────────────────
// Direct categorical selections stored as-is for comparison.

export interface ParentChoiceData {
  perceivedStrengthArea: string;          // 'stem' | 'business' | 'humanities' | 'creative'
  perceivedCareerDirection: string;       // 'engineering_tech' | 'medical_life_sciences' | ...
  perceivedSocialStyle: string;           // 'leadership' | 'teamwork' | 'independent' | 'adaptable'
  academicExpectationChoice: string;      // 'top_5' | 'top_25' | 'steady' | 'flexible'
  salaryExpectation: string;              // 'low_salary' | 'moderate_salary' | 'high_salary' | 'growth_focus'
  educationBudget: string;                // 'budget_low' | ... | 'budget_flexible'
  scholarshipDependency: string;          // 'scholarship_essential' | ... | 'scholarship_not_factor'
  financialReadiness: string;             // 'fully_planned' | ... | 'not_started'
  preferredRegion: string;                // 'north_america' | ... | 'prefer_india'
  postStudyEmployment: string;            // 'most_important' | ... | 'not_primary'
  decisionOwnership: string;              // 'student_led' | 'parent_led' | 'collaborative' | 'professional_guided'
  supportStyle: string;                   // 'hands_on' | 'mentoring' | 'encouraging_independence' | 'professional_guidance'
  primaryConcern: string;                 // 'financial_security' | 'career_satisfaction' | 'social_recognition' | 'work_life_balance'
  desiredOutcome: string;                 // 'high_income' | 'meaningful_work' | 'prestigious_career' | 'balanced_life'
  performanceExpectation: string;         // 'top_performer' | 'above_average' | 'steady_pace' | 'effort_focused'
}

// ─── Complete Parent Profile ────────────────────────────────────────────────

export interface ParentProfile {
  numeric: ParentProfileNumeric;
  interpreted: ParentProfileInterpreted;
  choices: ParentChoiceData;
}

// ─── Scoring Functions ──────────────────────────────────────────────────────

/**
 * Convert a Likert answer index (0-4) to a 0-100 value.
 * 0=Strongly Disagree → 0, 1=Disagree → 25, 2=Neutral → 50,
 * 3=Agree → 75, 4=Strongly Agree → 100
 */
function likertToScore(answerIdx: number, reverse: boolean = false): number {
  const map = [0, 25, 50, 75, 100];
  const score = map[answerIdx] ?? 50;
  return reverse ? (100 - score) : score;
}

/**
 * Average an array of numbers. Returns 50 if empty.
 */
function avg(values: number[]): number {
  if (values.length === 0) return 50;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * Convert a numeric 0-100 value to a PreferenceLevel.
 */
function toPreferenceLevel(value: number): PreferenceLevel {
  if (value <= 25) return 'low';
  if (value <= 50) return 'moderate';
  if (value <= 75) return 'high';
  return 'very_high';
}

/**
 * Convert a numeric 0-100 value to a RiskLevel.
 */
function toRiskLevel(value: number): RiskLevel {
  if (value <= 25) return 'conservative';
  if (value <= 50) return 'moderate';
  if (value <= 75) return 'open';
  return 'very_open';
}

/**
 * Get the option_type string for a choice question answer.
 * Looks at question.option_types[answerIdx] to find the categorical value.
 */
function getChoiceValue(
  questions: Section['questions'],
  questionId: number,
  answers: Record<number, number>
): string {
  const q = questions.find(qu => qu.id === questionId);
  if (!q || answers[questionId] === undefined) return '';
  const idx = answers[questionId];
  return q.option_types?.[idx] ?? '';
}

/**
 * Compute the full parent profile from raw answers and questions.
 *
 * @param answers - Map of question ID → selected option index
 * @param sections - The parent assessment sections (from PARENT_ASSESSMENT)
 * @returns Complete ParentProfile with numeric, interpreted, and choice data
 */
export function computeParentProfile(
  answers: Record<number, number>,
  sections: Section[]
): ParentProfile {
  // Flatten all questions for lookup
  const allQuestions = sections.flatMap(s => s.questions);

  // Helper: get likert score for a question ID
  const likert = (id: number, reverse = false): number => {
    const ans = answers[id];
    if (ans === undefined) return 50; // default neutral
    return likertToScore(ans, reverse);
  };

  // ── Numeric Dimensions ──────────────────────────────────────────────────

  // Stability Priority: Q7 (stability > passion) + Q12 (job security) + Q10 reverse (career flexibility)
  const stabilityPriority = avg([
    likert(7),
    likert(12),
    likert(10, true), // Q10 is reverse-scored: high career flexibility = low stability priority
  ]);

  // Career Prestige Priority: Q9 (prestige importance)
  const careerPrestigePriority = likert(9);

  // Financial Flexibility: Q14 (loan openness) + Q16 (investment willingness)
  // Plus choice-based modifiers from budget and scholarship questions
  const budgetChoice = getChoiceValue(allQuestions, 13, answers);
  const budgetScore =
    budgetChoice === 'budget_very_high' ? 100
    : budgetChoice === 'budget_flexible' ? 85
    : budgetChoice === 'budget_high' ? 75
    : budgetChoice === 'budget_moderate' ? 50
    : budgetChoice === 'budget_low' ? 25
    : 50;

  const scholarshipChoice = getChoiceValue(allQuestions, 15, answers);
  const scholarshipScore =
    scholarshipChoice === 'scholarship_not_factor' ? 100
    : scholarshipChoice === 'scholarship_helpful' ? 75
    : scholarshipChoice === 'scholarship_preferred' ? 40
    : scholarshipChoice === 'scholarship_essential' ? 15
    : 50;

  const financialFlexibility = avg([
    likert(14),     // loan openness
    likert(16),     // investment willingness
    budgetScore,
    scholarshipScore,
  ]);

  // International Openness: Q11 (international career) + Q18 (study abroad openness)
  // Plus region preference modifier
  const regionChoice = getChoiceValue(allQuestions, 19, answers);
  const regionScore =
    regionChoice === 'prefer_india' ? 10
    : regionChoice === 'anywhere' ? 90
    : regionChoice === 'north_america' ? 80
    : regionChoice === 'uk_europe' ? 80
    : regionChoice === 'asia_pacific' ? 70
    : 50;

  const internationalOpenness = avg([
    likert(11),
    likert(18),
    regionScore,
  ]);

  // Ranking Priority: Q20 (university ranking importance)
  const rankingPriority = likert(20);

  // Autonomy Preference: Q24 (child independence) + Q25 (experimentation) + Q26 (non-traditional)
  //                      + Q27 (career change comfort)
  // Plus decision ownership modifier
  const decisionChoice = getChoiceValue(allQuestions, 23, answers);
  const decisionScore =
    decisionChoice === 'student_led' ? 100
    : decisionChoice === 'collaborative' ? 65
    : decisionChoice === 'professional_guided' ? 50
    : decisionChoice === 'parent_led' ? 15
    : 50;

  const autonomyPreference = avg([
    likert(24),
    likert(25),
    likert(26),
    likert(27),
    decisionScore,
  ]);

  // Risk Tolerance: Q28 (calculated risk comfort) + Q26 (non-traditional openness)
  const riskTolerance = avg([
    likert(28),
    likert(26),
  ]);

  // Academic Expectation: Q6 choice + Q29 choice (higher = stricter)
  const acadExpChoice = getChoiceValue(allQuestions, 6, answers);
  const acadExpScore =
    acadExpChoice === 'top_5' ? 100
    : acadExpChoice === 'top_25' ? 70
    : acadExpChoice === 'steady' ? 40
    : acadExpChoice === 'flexible' ? 20
    : 50;

  const perfExpChoice = getChoiceValue(allQuestions, 29, answers);
  const perfExpScore =
    perfExpChoice === 'top_performer' ? 100
    : perfExpChoice === 'above_average' ? 70
    : perfExpChoice === 'steady_pace' ? 40
    : perfExpChoice === 'effort_focused' ? 20
    : 50;

  const academicExpectation = avg([acadExpScore, perfExpScore]);

  // ── Numeric Profile ─────────────────────────────────────────────────────

  const numeric: ParentProfileNumeric = {
    stabilityPriority,
    careerPrestigePriority,
    financialFlexibility,
    internationalOpenness,
    rankingPriority,
    autonomyPreference,
    riskTolerance,
    academicExpectation,
  };

  // ── Interpreted Profile ─────────────────────────────────────────────────

  const interpreted: ParentProfileInterpreted = {
    stabilityPriority: toPreferenceLevel(numeric.stabilityPriority),
    careerPrestigePriority: toPreferenceLevel(numeric.careerPrestigePriority),
    financialFlexibility: toPreferenceLevel(numeric.financialFlexibility),
    internationalOpenness: toPreferenceLevel(numeric.internationalOpenness),
    rankingPriority: toPreferenceLevel(numeric.rankingPriority),
    autonomyPreference: toPreferenceLevel(numeric.autonomyPreference),
    riskTolerance: toRiskLevel(numeric.riskTolerance),
    academicExpectation: toPreferenceLevel(numeric.academicExpectation),
  };

  // ── Choice Data (Categorical) ───────────────────────────────────────────

  const choices: ParentChoiceData = {
    perceivedStrengthArea: getChoiceValue(allQuestions, 1, answers),
    perceivedCareerDirection: getChoiceValue(allQuestions, 2, answers),
    perceivedSocialStyle: getChoiceValue(allQuestions, 4, answers),
    academicExpectationChoice: getChoiceValue(allQuestions, 6, answers),
    salaryExpectation: getChoiceValue(allQuestions, 8, answers),
    educationBudget: getChoiceValue(allQuestions, 13, answers),
    scholarshipDependency: getChoiceValue(allQuestions, 15, answers),
    financialReadiness: getChoiceValue(allQuestions, 17, answers),
    preferredRegion: getChoiceValue(allQuestions, 19, answers),
    postStudyEmployment: getChoiceValue(allQuestions, 22, answers),
    decisionOwnership: getChoiceValue(allQuestions, 23, answers),
    supportStyle: getChoiceValue(allQuestions, 30, answers),
    primaryConcern: getChoiceValue(allQuestions, 31, answers),
    desiredOutcome: getChoiceValue(allQuestions, 32, answers),
    performanceExpectation: getChoiceValue(allQuestions, 29, answers),
  };

  return { numeric, interpreted, choices };
}

/**
 * Get a human-readable label for a preference level.
 */
export function getPreferenceLabel(level: PreferenceLevel): string {
  return PREFERENCE_LABELS[level];
}

/**
 * Get a human-readable label for a risk level.
 */
export function getRiskLabel(level: RiskLevel): string {
  return RISK_LABELS[level];
}
