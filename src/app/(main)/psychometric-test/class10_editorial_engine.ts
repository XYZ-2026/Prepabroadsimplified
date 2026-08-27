/**
 * Class 10 Data Contracts
 * ─────────────────────────────────────────────────────
 * Input definitions and AI personalization slots for Class 10th reports.
 */

// ─── Student & Scores Input Contract ────────────────────────────────────────

export interface EditorialStudent {
  name: string;
  grade: string;
  age: string | number;
  school?: string;
  city?: string;
  stream?: string;
  email?: string;
  date: string;
  reportId: string;
  parentName?: string;
}

export interface EditorialScores {
  aptitude: {
    verbal: number;
    numerical: number;
    reasoning: number;
    spatial: number;
    overall: number;
  };
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    emotionalStability: number;
  };
  topRiasec: string[];
  riasec?: Record<string, number>;
  topVark: string;
  vark?: Record<string, number>;
  topValues: string[];
  careerFitment: Array<{ name: string; score: number }>;
}

// ─── AI Personalization Slots ───────────────────────────────────────────────

export interface PersonalizationData {
  executiveSummary: string;
  moduleInsights?: Record<number, string>;
  parentGuide?: {
    observations: string[];
    homeStrategies: string[];
    communicationTips: string[];
  };
  teacherGuide?: {
    classroomAdaptations: string[];
    learningSupport: string[];
    assessmentTips: string[];
  };
  careerRoadmap?: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    collegeAndBeyond?: string[];
  };
  strengths: string[];
  growthAreas: string[];
  crossDomainInsights?: string[];
  familyAlignmentSummary?: string;
  alignmentHighlights?: string[];
}
