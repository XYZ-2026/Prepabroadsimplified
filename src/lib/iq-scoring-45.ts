export interface SectionScore {
  sectionId: number;
  sectionName: string;
  earned: number;
  max: number;
  percentage: number;
}

export interface IQResult45 {
  estimatedIQ: number;
  percentile: number;
  cognitiveBand: string;
  rawScore: number; // Correct out of 45
  totalQuestions: number; // 45
  weightedScore: number;
  totalWeightedMax: number;
  sectionScores: SectionScore[];
  strongestDomain: string;
  developmentalDomain: string;
  cognitivePersona: string;
  insightsNarrative: string;
  distractionReported?: 'Yes' | 'No' | null;
  completedAt: string;
  certificateId: string;
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
  return sign * y;
}

function calculatePercentile(zScore: number): number {
  const cdf = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
  return Math.max(1, Math.min(99, Math.round(cdf * 100)));
}

function getCognitiveBand(iq: number): string {
  if (iq < 85) return 'Below Average';
  if (iq < 105) return 'Average Cognitive Ability';
  if (iq < 120) return 'Above Average';
  if (iq < 135) return 'Superior Cognitive Ability';
  return 'Exceptional Cognitive Potential';
}

const PERSONA_MAP: Record<string, string> = {
  'Visual Pattern & Matrix Reasoning': 'The Pattern Architect',
  'Spatial / Figure Reasoning': 'The Spatial Visionary',
  'Numerical & Quantitative Reasoning': 'The Quantitative Analyst',
  'Logical & Verbal Reasoning': 'The Deductive Strategist',
  'Sequence, Working Memory & Abstract Reasoning': 'The Abstract Systems Thinker'
};

export function evaluate45IQTest(
  evaluatedAnswers: {
    questionId: number;
    section: number;
    sectionName: string;
    difficultyWeight: number;
    userOption: string | null;
    correctOption: string;
    isCorrect: boolean;
  }[],
  userName: string = 'Candidate',
  distractionReported?: 'Yes' | 'No' | null,
  certificateIdSeed?: string
): IQResult45 {
  const sectionMap: Record<number, { name: string; earned: number; max: number }> = {
    1: { name: 'Visual Pattern & Matrix Reasoning', earned: 0, max: 0 },
    2: { name: 'Spatial / Figure Reasoning', earned: 0, max: 0 },
    3: { name: 'Numerical & Quantitative Reasoning', earned: 0, max: 0 },
    4: { name: 'Logical & Verbal Reasoning', earned: 0, max: 0 },
    5: { name: 'Sequence, Working Memory & Abstract Reasoning', earned: 0, max: 0 }
  };

  let rawScore = 0;
  let weightedScore = 0;
  let totalWeightedMax = 0;

  evaluatedAnswers.forEach(ans => {
    const sec = ans.section || 1;
    const w = ans.difficultyWeight || 1.0;

    if (!sectionMap[sec]) {
      sectionMap[sec] = { name: ans.sectionName || `Section ${sec}`, earned: 0, max: 0 };
    }

    sectionMap[sec].max += w;
    totalWeightedMax += w;

    if (ans.isCorrect) {
      rawScore += 1;
      weightedScore += w;
      sectionMap[sec].earned += w;
    }
  });

  const sectionScores: SectionScore[] = Object.keys(sectionMap).map(keyStr => {
    const secId = Number(keyStr);
    const sec = sectionMap[secId];
    return {
      sectionId: secId,
      sectionName: sec.name,
      earned: Math.round(sec.earned * 10) / 10,
      max: Math.round(sec.max * 10) / 10,
      percentage: sec.max > 0 ? Math.round((sec.earned / sec.max) * 100) : 0
    };
  });

  // Identify strongest and developmental domains
  const sortedSections = [...sectionScores].sort((a, b) => b.percentage - a.percentage);
  const strongestDomain = sortedSections[0]?.sectionName || 'Visual Pattern & Matrix Reasoning';
  const developmentalDomain = sortedSections[sortedSections.length - 1]?.sectionName || 'Abstract Reasoning';

  // Statistical Normalization for 45 questions:
  // Expected mean = 55% of totalWeightedMax, SD = 16% of totalWeightedMax
  const mean = totalWeightedMax * 0.55;
  const stdDev = totalWeightedMax * 0.16;

  const zScore = stdDev > 0 ? (weightedScore - mean) / stdDev : 0;

  // Standardized Estimated IQ Score (Mean = 100, SD = 15)
  let estimatedIQ = Math.round(100 + zScore * 15);
  estimatedIQ = Math.max(70, Math.min(155, estimatedIQ)); // Cap ethically between 70 and 155

  const percentile = calculatePercentile(zScore);
  const cognitiveBand = getCognitiveBand(estimatedIQ);
  const cognitivePersona = PERSONA_MAP[strongestDomain] || 'The Strategic Thinker';

  const dateStr = new Date().toISOString();
  const certId = certificateIdSeed || `SIMP-IQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const insightsNarrative = `Cognitive Assessment Summary for ${userName}:
You completed the standardized 45-item Cognitive Assessment with an Estimated IQ Score of ${estimatedIQ}, placing your performance in the ${percentile}th percentile (${cognitiveBand}).

Your primary cognitive strength is in ${strongestDomain}. You demonstrate heightened speed and accuracy when processing complex structural assets in this area.

Your relative developmental area is ${developmentalDomain}. Engaging in targeted spatial-logic drills and systematic problem-solving exercises will foster well-rounded cognitive growth.`;

  return {
    estimatedIQ,
    percentile,
    cognitiveBand,
    rawScore,
    totalQuestions: 45,
    weightedScore: Math.round(weightedScore * 10) / 10,
    totalWeightedMax: Math.round(totalWeightedMax * 10) / 10,
    sectionScores,
    strongestDomain,
    developmentalDomain,
    cognitivePersona,
    insightsNarrative,
    distractionReported: distractionReported || null,
    completedAt: dateStr,
    certificateId: certId
  };
}
