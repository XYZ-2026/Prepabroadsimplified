export interface QuestionDomainScore {
  category: string;
  earned: number;
  max: number;
  percentage: number;
}

export interface IQResult {
  iqScore: number;
  percentile: number;
  tier: string;
  totalEarned: number;
  totalMax: number;
  domains: QuestionDomainScore[];
  strength: string;
  weakness: string;
  careers: string[];
  insights: string;
}

// Error function math for percentile calculation
function erf(x: number): number {
  // Save the sign of x
  const sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // A&S formula 7.1.26
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

function calculatePercentile(zScore: number): number {
  // CDF of standard normal distribution: 0.5 * (1 + erf(z / sqrt(2)))
  const cdf = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
  return Math.max(0.1, Math.min(99.9, cdf * 100)); // Cap between 0.1 and 99.9
}

function getTier(iq: number): string {
  if (iq < 80) return "Borderline";
  if (iq < 90) return "Low Average";
  if (iq < 110) return "Average";
  if (iq < 120) return "High Average";
  if (iq < 135) return "Highly Intelligent";
  return "Exceptional";
}

const CAREER_MAP: Record<string, string[]> = {
  "Logical Reasoning": ["Software Engineering", "Law", "Philosophy"],
  "Pattern Recognition": ["Data Science", "Artificial Intelligence", "Cryptography"],
  "Numerical Intelligence": ["Finance", "Quantitative Analysis", "Business Analytics"],
  "Verbal Reasoning": ["Journalism", "Public Relations", "Creative Writing"],
  "Analytical Thinking": ["Management Consulting", "Operations Research", "Systems Engineering"],
  "Problem Solving": ["Product Management", "Cybersecurity", "Mechanical Engineering"]
};

function generateInsights(strength: string, weakness: string, tier: string, iq: number): string {
  return `Dear Guest Candidate, based on your performance on the College Simplified Advanced IQ Assessment, you have achieved an overall IQ score of ${iq}, placing you in the '${tier}' cognitive category. This score indicates a strong command of cognitive processing and problem-solving relative to the general student population. Your cognitive blueprint reveals a highly structured approach to parsing complex scenarios, translating raw inputs into logical frameworks, and identifying critical dependencies under temporal constraints.

Your primary cognitive strength is ${strength}, where you demonstrated an outstanding ability to excel. This means that in environments requiring rapid processing of ${strength.toLowerCase()} assets, you possess a distinct competitive advantage. You should rely on this capability when leading teams through complex brainstorming sessions or resolving analytical bottlenecks.

While your profile is well-rounded, your lowest relative score was in ${weakness}. To maximize your cognitive efficiency, we recommend studying algorithmic designs and logic puzzles to train systemic optimization thinking. Slight adjustments in how you approach problem-solving tasks—such as breaking down instructions into modular micro-steps—will bridge this gap and help you unlock your full intellectual capacity.

In terms of operational and decision-making style, your results indicate that you are flexible and heuristically agile. You process visual patterns and relational indicators quickly, enabling swift intuitive choices. This cognitive style is highly effective in team environments, acting as a reliable anchor during volatile situations. Moving forward, we recommend aligning your career objectives with fields that heavily leverage ${strength.toLowerCase()}, while actively training your ${weakness.toLowerCase()} to ensure balanced cognitive performance.`;
}

export function processIQTest(evaluatedAnswers: any[]): IQResult {
  const domainsMap: Record<string, { earned: number, max: number }> = {};
  
  let totalEarned = 0;
  let totalMax = 0;

  evaluatedAnswers.forEach(ans => {
    const category = ans.category || 'General';
    // Difficulty weighting (mock mapping if difficulty doesn't exist, normally we'd pull from question DB)
    // We will assume 1.0 for all if difficulty is missing, but wait, in the new DB we don't have difficulty easily exposed?
    // Let's check ans.difficulty if it was passed, if not default to 1.5
    let weight = 1.5;
    if (ans.difficulty === 'easy') weight = 1.0;
    else if (ans.difficulty === 'medium') weight = 1.5;
    else if (ans.difficulty === 'hard' || ans.difficulty === 'advanced') weight = 2.0;

    if (!domainsMap[category]) {
      domainsMap[category] = { earned: 0, max: 0 };
    }

    domainsMap[category].max += weight;
    totalMax += weight;

    if (ans.isCorrect) {
      domainsMap[category].earned += weight;
      totalEarned += weight;
    }
  });

  const domains: QuestionDomainScore[] = Object.keys(domainsMap).map(cat => ({
    category: cat,
    earned: domainsMap[cat].earned,
    max: domainsMap[cat].max,
    percentage: Math.round((domainsMap[cat].earned / domainsMap[cat].max) * 100) || 0
  }));

  // Identify strength and weakness
  domains.sort((a, b) => b.percentage - a.percentage);
  const strength = domains[0]?.category || 'General Aptitude';
  const weakness = domains[domains.length - 1]?.category || 'General Aptitude';

  // Math: 
  // Let's assume an average total score is 60% of totalMax, standard dev is 15% of totalMax
  // z = (earned - mean) / stdDev
  const mean = totalMax * 0.55; // Expected mean 55%
  const stdDev = totalMax * 0.15; // 15% standard deviation
  
  const zScore = (totalEarned - mean) / stdDev;
  
  // Standard IQ: Mean 100, SD 15
  let iqScore = Math.round(100 + (zScore * 15));
  iqScore = Math.max(70, Math.min(160, iqScore)); // Cap between 70 and 160

  const percentile = Number(calculatePercentile(zScore).toFixed(1));
  const tier = getTier(iqScore);
  
  const careers = CAREER_MAP[strength] || ["Research", "Academia", "Strategic Planning"];
  const insights = generateInsights(strength, weakness, tier, iqScore);

  return {
    iqScore,
    percentile,
    tier,
    totalEarned,
    totalMax,
    domains,
    strength,
    weakness,
    careers,
    insights
  };
}
