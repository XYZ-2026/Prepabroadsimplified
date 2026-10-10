"use client";

import { Brain, Star, Target, BookOpen, Briefcase, Zap, Dumbbell, TrendingUp, ClipboardList, BarChart2, Calculator, Microscope, Calendar, PenTool, X, GraduationCap, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import PremiumToolsCards from "@/components/PremiumToolsCards";
import TermsPopup from "@/components/TermsPopup";
import FamilyInsights from "./FamilyInsights";
import PsychometricLandingPage, { LandingEligibility } from "@/components/Psychometric/PsychometricLandingPage";
import { VariantId } from "@/config/psychometric-landing.config";
import "./assessment.css";
import {
  FBQ,
  FBQ_JUNIOR,
  FBQ_GRADE10,
  FBQ_GRADE12_SCIENCE,
  FBQ_GRADE12_COMMERCE,
  FBQ_GRADE12_ARTS,
  FBQ_SENIOR,
  CAREER_CLUSTERS,
  SEC_META,
  VARK_TIPS,
  API_KEY,
  API_URL,
  MODELS,
  JUNIOR_PLAN_7_8,
  JUNIOR_MATRIX_9,
} from "./data";
import { LOGO_BASE64 } from '@/lib/logo-base64';
import { EditorialStudent } from './class10_editorial_engine';
import { generatePersonalization } from './class10_personalization';
import { buildClass10ExecutiveHTMLReport, buildUniversalExecutiveHTMLReport } from './class10_html_report_builder';
import { buildClass10ExecutiveSummaryHTMLReport, buildUniversalExecutiveSummaryHTMLReport } from './class10_executive_summary_builder';
import { adaptReportData, resolveReportVariant } from './report-engine/adapters';
import { getVariantConfig } from './report-engine/universal-report-schema';
import ReportViewerShell from '@/components/Report/ReportViewerShell';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "landing" | "details" | "loading-q" | "questions" | "loading-r" | "report" | "fetching" | "locked";

interface StudentInfo {
  name: string;
  grade: string;
  age: string;
  school: string;
  city: string;
  email: string;
  phone: string;
  password: string;
  stream: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  date: string;
  reportId: string;
}

const EMOJI_TO_ICON: Record<string, React.ElementType> = {
  '🧠': Brain,
  '🌟': Star,
  '🎯': Target,
  '📚': BookOpen,
  '💼': Briefcase,
};

function renderIcon(iconString: string, size = 28, className = "as-icon-emoji") {
  const IconComponent = EMOJI_TO_ICON[iconString] || EMOJI_TO_ICON[iconString.trim()];
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  return iconString;
}

interface Scores {
  aptitude: { overall: number; verbal: number; numerical: number; reasoning: number; spatial: number };
  personality: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; emotionalStability: number };
  riasec: { R: number; I: number; A: number; S: number; E: number; C: number };
  vark: { V: number; A: number; R: number; K: number };
  values: Record<string, number>;
  topRiasec: string[];
  topVark: string;
  topValues: string[];
  careerFitment: Array<{ name: string; score: number; color: string }>;
  completionRate: { answered: number; total: number };
}

interface CareerRoadmapData {
  career: any;
  roadmap: any;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function esc(s: string) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

function safeList(arr: any): string[] {
  return Array.isArray(arr) ? arr : [];
}

function safeStrVal(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object') {
    if (val.label && val.description) return `${val.label}: ${val.description}`;
    if (val.title && val.description) return `${val.title}: ${val.description}`;
    if (val.name && val.description) return `${val.name}: ${val.description}`;
    if (val.label) return String(val.label);
    if (val.title) return String(val.title);
    if (val.name) return String(val.name);
    if (val.description) return String(val.description);
    if (val.text) return String(val.text);
    if (val.value) return String(val.value);
    try {
      return JSON.stringify(val);
    } catch {
      return '';
    }
  }
  return String(val);
}

function safeStrList(arr: any): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(safeStrVal);
}

function sanitizeNarrativeData(data: any): any {
  if (!data || typeof data !== 'object') return data;

  if (data.summary) data.summary = safeStrVal(data.summary);
  if (data.strengths) data.strengths = safeStrList(data.strengths);
  if (data.growthAreas) data.growthAreas = safeStrList(data.growthAreas);

  if (Array.isArray(data.topCareers)) {
    data.topCareers = data.topCareers.map((c: any) => {
      if (!c || typeof c !== 'object') return { name: safeStrVal(c), description: '' };
      return {
        ...c,
        name: safeStrVal(c.name),
        description: safeStrVal(c.description),
        education: safeStrVal(c.education),
        indianExam: safeStrVal(c.indianExam),
        salaryRange: safeStrVal(c.salaryRange),
      };
    });
  }

  if (data.indianCounselling && typeof data.indianCounselling === 'object') {
    data.indianCounselling.streamAdvice = safeStrVal(data.indianCounselling.streamAdvice);
    data.indianCounselling.subjects = safeStrList(data.indianCounselling.subjects);
    data.indianCounselling.entranceExams = safeStrList(data.indianCounselling.entranceExams);
    data.indianCounselling.topColleges = safeStrList(data.indianCounselling.topColleges);
  }

  if (data.studyAbroad && typeof data.studyAbroad === 'object') {
    data.studyAbroad.rationale = safeStrVal(data.studyAbroad.rationale);
    data.studyAbroad.scholarships = safeStrList(data.studyAbroad.scholarships);
    data.studyAbroad.programs = safeStrList(data.studyAbroad.programs);
    if (Array.isArray(data.studyAbroad.countries)) {
      data.studyAbroad.countries = data.studyAbroad.countries.map((ct: any) => {
        if (!ct || typeof ct !== 'object') return { flag: '🌐', name: safeStrVal(ct), reason: '' };
        return {
          flag: safeStrVal(ct.flag || '🌐'),
          name: safeStrVal(ct.name),
          reason: safeStrVal(ct.reason),
        };
      });
    }
  }

  if (data.actionPlan && typeof data.actionPlan === 'object') {
    data.actionPlan.thisMonth = safeStrList(data.actionPlan.thisMonth);
    data.actionPlan.thisYear = safeStrList(data.actionPlan.thisYear);
    data.actionPlan.skills = safeStrList(data.actionPlan.skills);
    data.actionPlan.resources = safeStrList(data.actionPlan.resources);
  }

  if (data.psychologicalSummary && typeof data.psychologicalSummary === 'object') {
    data.psychologicalSummary.cognitiveProfile = safeStrVal(data.psychologicalSummary.cognitiveProfile);
    data.psychologicalSummary.personalityProfile = safeStrVal(data.psychologicalSummary.personalityProfile);
    data.psychologicalSummary.interestProfile = safeStrVal(data.psychologicalSummary.interestProfile);
    data.psychologicalSummary.learningProfile = safeStrVal(data.psychologicalSummary.learningProfile);
    data.psychologicalSummary.valuesProfile = safeStrVal(data.psychologicalSummary.valuesProfile);
    data.psychologicalSummary.overallPsychProfile = safeStrVal(data.psychologicalSummary.overallPsychProfile);
    data.psychologicalSummary.psychologistAdvisorPoints = safeStrList(data.psychologicalSummary.psychologistAdvisorPoints);
  }

  return data;
}

async function callAPI(messages: any[], modelIdx = 0): Promise<string> {
  // 1. Try local server route /api/chat (uses GEMINI_API_KEY)
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, temperature: 0.7 }),
    });
    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      if (content) return content;
    }
  } catch (err) {
    console.warn("Backend /api/chat route call failed, trying fallbacks...", err);
  }

  // 2. Client-side Groq call if API_KEY is available and not proxy key
  if (API_KEY && !API_KEY.startsWith("AQ.")) {
    const model = MODELS[modelIdx] || MODELS[0];
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4000 }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
      }
      if (modelIdx < MODELS.length - 1) {
        return callAPI(messages, modelIdx + 1);
      }
    } catch (err) {
      console.warn(`Groq API call failed for model ${model}:`, err);
      if (modelIdx < MODELS.length - 1) {
        return callAPI(messages, modelIdx + 1);
      }
    }
  }

  console.warn("LLM API calls failed. Using fallback narrative and roadmaps.");
  return "";
}

function extractJSON(raw: string): any {
  try {
    const m = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/\{[\s\S]*\}/);
    const str = m ? (m[1] || m[0]) : raw;
    return JSON.parse(str);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      try { return JSON.parse(raw.slice(start, end + 1)); } catch { return null; }
    }
    return null;
  }
}

function computeScores(answers: Record<number, number>, questions: typeof FBQ, stream?: string, assessmentType?: string): Scores {
  const secs = questions.sections;

  // ── Aptitude (MCQ) ──────────────────────────────────────────────────────────
  const aptSec = secs[0];
  const traits = ["verbal", "numerical", "reasoning", "spatial"];
  const aptByTrait: Record<string, { correct: number; total: number }> = {};
  traits.forEach((t) => (aptByTrait[t] = { correct: 0, total: 0 }));
  aptSec.questions.forEach((q) => {
    aptByTrait[q.trait] = aptByTrait[q.trait] || { correct: 0, total: 0 };
    aptByTrait[q.trait].total++;
    if (answers[q.id] === q.correct) aptByTrait[q.trait].correct++;
  });
  const aptitude = {
    verbal:    Math.round((aptByTrait.verbal?.correct    / (aptByTrait.verbal?.total    || 1)) * 100),
    numerical: Math.round((aptByTrait.numerical?.correct / (aptByTrait.numerical?.total || 1)) * 100),
    reasoning: Math.round((aptByTrait.reasoning?.correct / (aptByTrait.reasoning?.total || 1)) * 100),
    spatial:   Math.round((aptByTrait.spatial?.correct   / (aptByTrait.spatial?.total   || 1)) * 100),
    overall: 0,
  };
  aptitude.overall = Math.round(
    (aptitude.verbal + aptitude.numerical + aptitude.reasoning + aptitude.spatial) / 4
  );

  // ── Personality (Likert — Big Five) ─────────────────────────────────────────
  const perSec = secs[1];
  const perTraits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
  const perByTrait: Record<string, number[]> = {};
  perTraits.forEach((t) => (perByTrait[t] = []));
  perSec.questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans === undefined) return;
    // Scale: 0=Strongly Disagree … 4=Strongly Agree
    const score = q.reverse ? 4 - ans : ans;
    perByTrait[q.trait] = perByTrait[q.trait] || [];
    perByTrait[q.trait].push(score);
  });
  // Strict scoring: 0–4 scale → 0–100%.
  // Each answer: SD=0, D=1, N=2, A=3, SA=4.
  // Max possible per item = 4. Average × 25 gives raw %.
  // We then apply a strictness correction: subtract 10 pts
  // so that a purely Neutral respondent scores ~40% (not 50%),
  // and clamp to 0–100. This prevents inflated mid-range scores.
  const pctAvg = (arr: number[]): number => {
    if (!arr.length) return 0;
    const raw = (arr.reduce((a, b) => a + b, 0) / arr.length) * 25;
    return Math.max(0, Math.min(100, Math.round(raw - 10)));
  };
  const personality = {
    openness:           pctAvg(perByTrait.openness          || []),
    conscientiousness:  pctAvg(perByTrait.conscientiousness || []),
    extraversion:       pctAvg(perByTrait.extraversion      || []),
    agreeableness:      pctAvg(perByTrait.agreeableness     || []),
    emotionalStability: pctAvg((perByTrait.neuroticism || []).map((v) => 4 - v)),
  };

  // ── RIASEC (choice) — honest raw proportions, NOT relative-to-max ───────────
  // Old code divided by Math.max(all codes) so the top code was always 100%.
  // Now we divide by the total number of RIASEC questions so each code reflects
  // its true share of the student's choices (e.g. 5/20 Qs answered R → 25%).
  const intSec = secs[2];
  const totalRiasecQ = intSec.questions.length;
  const riasecRaw: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  intSec.questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans === undefined || !q.option_types) return;
    const code = q.option_types[ans];
    if (code && riasecRaw[code] !== undefined) riasecRaw[code]++;
  });
  const personalityAlign = {
    R: personality.conscientiousness * 0.12 + 10,
    I: personality.openness * 0.12 + 10,
    A: personality.openness * 0.16 + 8,
    S: (personality.agreeableness * 0.08 + personality.extraversion * 0.06) + 8,
    E: personality.extraversion * 0.14 + 10,
    C: personality.conscientiousness * 0.14 + 10
  };
  const riasecPct: Record<string, number> = {};
  Object.keys(riasecRaw).forEach((k) => {
    const rawPct = (riasecRaw[k] / totalRiasecQ) * 100;
    const align = (personalityAlign as any)[k] || 0;
    const blended = rawPct * 0.82 + align * 0.18;
    riasecPct[k] = Math.max(1, Math.min(99, Math.round(blended)));
  });
  const topRiasec = Object.entries(riasecPct).sort((a, b) => b[1] - a[1]).map(([k]) => k);

  // ── VARK (choice) — raw proportions ─────────────────────────────────────────
  const varkSec = secs[3];
  const totalVarkQ = varkSec.questions.length;
  const varkRaw: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 };
  varkSec.questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans === undefined || !q.option_types) return;
    const code = q.option_types[ans];
    if (code && varkRaw[code] !== undefined) varkRaw[code]++;
  });
  const personalityVarkAlign = {
    V: personality.openness * 0.10 + 10,
    A: (personality.extraversion * 0.05 + personality.agreeableness * 0.05) + 10,
    R: personality.conscientiousness * 0.10 + 10,
    K: personality.extraversion * 0.10 + 10
  };
  const varkPct: Record<string, number> = {};
  Object.keys(varkRaw).forEach((k) => {
    const rawPct = (varkRaw[k] / totalVarkQ) * 100;
    const align = (personalityVarkAlign as any)[k] || 0;
    const blended = rawPct * 0.85 + align * 0.15;
    varkPct[k] = Math.max(1, Math.min(99, Math.round(blended)));
  });
  const topVark = Object.entries(varkPct).sort((a, b) => b[1] - a[1])[0]?.[0] || "V";

  // ── Values (choice) — raw proportions normalized by offered occurrences ────
  const valSec = secs[4];
  const valuesRaw: Record<string, number> = {};
  const offeredCounts: Record<string, number> = {};
  const allValueTypes = [
    "creativity",
    "helping",
    "financial",
    "leadership",
    "independence",
    "teamwork",
    "stability",
    "status",
    "adventure",
    "impact",
  ];

  // Initialize all values
  allValueTypes.forEach((t) => {
    valuesRaw[t] = 0;
    offeredCounts[t] = 0;
  });

  valSec.questions.forEach((q) => {
    if (!q.option_types) return;
    q.option_types.forEach((type) => {
      if (allValueTypes.includes(type)) {
        offeredCounts[type]++;
      }
    });

    const ans = answers[q.id];
    if (ans === undefined) return;
    const val = q.option_types[ans];
    if (val && valuesRaw[val] !== undefined) {
      valuesRaw[val]++;
    }
  });

  // Blended scoring: 60% raw count share + 40% selection rate
  // This prevents values offered in few questions (e.g. teamwork 3/20) from
  // dominating when picked every time (3/3=100%), over values picked more often
  // in absolute terms (e.g. creativity 9/17=53%).
  const valuesPct: Record<string, number> = {};
  const totalValAnswered = Object.values(valuesRaw).reduce((a, b) => a + b, 0) || 1;
  allValueTypes.forEach((k) => {
    const offered = offeredCounts[k] || 1;
    const raw = valuesRaw[k] || 0;
    const selectionRate = raw / offered;        // How often picked when available
    const rawShare = raw / totalValAnswered;     // Share of total picks
    const blended = rawShare * 0.60 + selectionRate * 0.40;
    valuesPct[k] = Math.max(0, Math.min(100, Math.round(blended * 100)));
  });

  const topValues = Object.entries(valuesPct)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  // ── Career Fitment — strict weighted scoring ─────────────────────────────────
  //
  // Each cluster has 3 RIASEC codes [primary, secondary, tertiary].
  //
  // Step 1 — RIASEC base (honest proportions, weights 0.55 / 0.30 / 0.15):
  //   With 20 RIASEC Qs and even spread across 6 codes → each ≈16.7%.
  //   A strongly aligned student may hit 35–40% on their top code.
  //   Base = riasecPct[primary]*0.55 + riasecPct[secondary]*0.30 + riasecPct[tertiary]*0.15
  //   Realistic range: ≈9 (poor fit) to ≈38 (excellent fit)
  //
  // Step 2 — Personality modifier (±8 pts): cluster-specific boosts/penalties.
  //
  // Step 3 — Values bonus (0–6 pts): only for genuine values→cluster alignment.
  //
  // Step 4 — Aptitude modifier (±5 pts): only for analytical/STEM clusters.
  //
  // Step 5 — Scale × 2.2 and cap at 97:
  //   Strong match: raw ≈ 38+8+6+5 = 57 → ×2.2 = 125 → capped at 97
  //   Average match: raw ≈ 18+0+0+0 = 18 → ×2.2 = 40
  //   Poor match: raw ≈ 7−5+0−3 = −1 → ×2.2 = −2 → clamped to 1

  // Personality delta helper: distance from neutral (50%), range −0.5…+0.5
  const pDelta = (trait: number) => (trait - 50) / 100;

  function personalityModifier(cluster: typeof CAREER_CLUSTERS[0]): number {
    const n = cluster.name;
    let mod = 0;
    if (/engineering|software|it|data|robotics|cyber|petroleum|aerospace|mechanical|electrical|civil/i.test(n)) {
      mod += pDelta(personality.conscientiousness) * 8;
      mod += pDelta(personality.openness) * 4;
      mod -= pDelta(personality.extraversion) * 2;
    }
    if (/science|medicine|surgery|pharmacy|bio|dental|agri|environ|pure/i.test(n)) {
      mod += pDelta(personality.openness) * 8;
      mod += pDelta(personality.conscientiousness) * 6;
    }
    if (/finance|accounting|audit|business|management|economics|supply|actuarial|international/i.test(n)) {
      mod += pDelta(personality.conscientiousness) * 8;
      mod += pDelta(personality.extraversion) * 4;
    }
    if (/law|civil services|governance/i.test(n)) {
      mod += pDelta(personality.conscientiousness) * 6;
      mod += pDelta(personality.openness) * 5;
      mod += pDelta(personality.extraversion) * 3;
    }
    if (/social|ngo|education|teaching|nursing|psychology|counsell/i.test(n)) {
      mod += pDelta(personality.agreeableness) * 8;
      mod += pDelta(personality.extraversion) * 5;
      mod -= pDelta(personality.emotionalStability) * 3;
    }
    if (/design|art|film|fashion|animation|journal|media|graphic|interior/i.test(n)) {
      mod += pDelta(personality.openness) * 10;
      mod -= pDelta(personality.conscientiousness) * 3;
    }
    if (/marketing|advertising|entrepreneur|human resources|hospitality|sports/i.test(n)) {
      mod += pDelta(personality.extraversion) * 8;
      mod += pDelta(personality.openness) * 5;
    }
    return mod;
  }

  const VALUES_CLUSTER_MAP: Record<string, string[]> = {
    creativity:   ["Graphic & UI/UX Design", "Animation & Game Design", "Film Making & Visual Arts", "Fashion & Textile Design", "Marketing & Advertising", "Entrepreneurship & Startups", "Interior & Product Design"],
    helping:      ["Medicine & Surgery", "Nursing & Allied Health", "Psychology & Counselling", "Social Work & NGO", "Education & Teaching"],
    financial:    ["Finance & Investment Banking", "Chartered Accountancy & Audit", "Actuarial Science & Risk", "Business Management & MBA"],
    leadership:   ["Civil Services & Governance", "Business Management & MBA", "Law & Legal Services", "Entrepreneurship & Startups", "Human Resources & OB"],
    impact:       ["Civil Services & Governance", "Pure Science & Research", "Environmental Science", "Medicine & Surgery", "Biotechnology & Genetics"],
    independence: ["Entrepreneurship & Startups", "Journalism & Mass Media", "Film Making & Visual Arts"],
    stability:    ["Chartered Accountancy & Audit", "Actuarial Science & Risk", "Supply Chain & Operations"],
    status:       ["Law & Legal Services", "Medicine & Surgery", "Civil Services & Governance", "Finance & Investment Banking"],
    adventure:    ["Aerospace & Defence", "Environmental Science", "Agriculture & Veterinary", "Sports Management & Fitness"],
    teamwork:     ["Human Resources & OB", "Education & Teaching", "Social Work & NGO"],
  };

  function valuesBonus(cluster: typeof CAREER_CLUSTERS[0]): number {
    let bonus = 0;
    topValues.slice(0, 3).forEach((val, rank) => {
      const aligned = VALUES_CLUSTER_MAP[val] || [];
      if (aligned.includes(cluster.name)) {
        bonus += (3 - rank) * 1.5; // top value +4.5, 2nd +3, 3rd +1.5
      }
    });
    return Math.min(bonus, 6);
  }

  function getClusterAptitudeScore(clusterName: string, apt: typeof aptitude): number {
    const n = clusterName.toLowerCase();
    let criticalTraits: Array<keyof typeof aptitude> = [];

    if (/software|data|computer|it|cybersecurity|networking|robotics|actuarial|finance|accountancy|audit/i.test(n)) {
      criticalTraits = ["numerical", "reasoning"];
    } else if (/mechanical|electrical|electronics|aerospace|defence|petroleum|mining/i.test(n)) {
      criticalTraits = ["numerical", "spatial", "reasoning"];
    } else if (/civil|architecture|interior|design|fashion|graphic|animation|game/i.test(n)) {
      criticalTraits = ["spatial", "reasoning"];
    } else if (/medicine|surgery|pharmacy|biotech|genetics|dental|pure science|research|environmental/i.test(n)) {
      criticalTraits = ["reasoning", "numerical"];
    } else if (/law|legal|civil services|governance|journalism|media|psychology|counselling|social work|ngo|education|teaching|management|mba|human resources|marketing|advertising|hospitality|international business/i.test(n)) {
      criticalTraits = ["verbal", "reasoning"];
    } else {
      criticalTraits = ["reasoning", "verbal"]; // general default
    }

    const sum = criticalTraits.reduce((acc, t) => acc + (apt[t] || 0), 0);
    return Math.round(sum / criticalTraits.length);
  }

  // Stream compatibility checker
  const isClusterCompatible = (clusterStreams: string[]) => {
    if (!stream || stream === "not-selected") return true;
    const sStream = stream.toLowerCase();
    return clusterStreams.some((s) => {
      const streamName = s.toLowerCase();
      if (streamName === sStream) return true;
      if (sStream === "science-pcm" && streamName === "science-pcm") return true;
      if (sStream === "science-pcb" && streamName === "science-pcb") return true;
      if (sStream === "science-pcmb" && (streamName.startsWith("science-") || streamName === "science-pcm" || streamName === "science-pcb" || streamName === "science-pcmb")) return true;
      if (sStream === "commerce" && streamName.startsWith("commerce")) return true;
      if (sStream === "humanities" && streamName === "humanities") return true;
      return false;
    });
  };

  const compatibleClusters = CAREER_CLUSTERS.filter((cluster) => isClusterCompatible(cluster.streams));

  // Calculate raw interest bases for compatible clusters first to find min and max
  const interestRawList = compatibleClusters.map((cluster) => {
    // RIASEC fit
    const riasecWeights = [0.60, 0.30, 0.10];
    let riasecScore = 0;
    cluster.codes.forEach((code, i) => {
      riasecScore += (riasecPct[code] || 0) * riasecWeights[i];
    });

    // Personality fit
    const persAdj = personalityModifier(cluster) * 2; // range approx [-8, +8]

    // Values fit
    const valBonus = valuesBonus(cluster) * 1.5; // range [0, 9]

    return riasecScore + persAdj + valBonus;
  });

  const maxInterestRaw = Math.max(...interestRawList, 1);
  const minInterestRaw = Math.min(...interestRawList, 0);
  const interestRange = maxInterestRaw - minInterestRaw || 1;

  let careerFitment = compatibleClusters.map((cluster, idx) => {
    // Normalize raw interest to [20, 90] range
    const interestNormalized = 20 + ((interestRawList[idx] - minInterestRaw) / interestRange) * 70;

    // Get specific aptitude score for this cluster
    const clusterAptitude = getClusterAptitudeScore(cluster.name, aptitude);

    // Blend Interest and Aptitude: 50% Interest + 50% Aptitude
    const blended = interestNormalized * 0.5 + clusterAptitude * 0.5;

    // Clamp between 10% and 95%
    const final = Math.max(10, Math.min(95, Math.round(blended)));

    return { name: cluster.name, score: final, color: cluster.color };
  });

  if (assessmentType === "junior" || assessmentType === "grade10") {
    // Group career clusters by 4 broad stream groups:
    const pcmNames = ["software", "data science", "mechanical", "civil", "electrical", "aerospace", "robotics", "cybersecurity", "petroleum", "pure science", "environmental"];
    const pcbNames = ["medicine", "pharmacy", "biotech", "nursing", "dental", "agriculture", "pure science", "environmental"];
    const commNames = ["accountancy", "finance", "economics", "business", "marketing", "human resources", "actuarial", "supply chain", "international business"];
    const humNames = ["law", "civil services", "journalism", "psychology", "education", "social work", "fashion", "graphic", "film making", "hospitality", "sports", "interior", "animation"];

    const getScoresForGroup = (keywords: string[]) => {
      const matched = careerFitment.filter(c => keywords.some(k => c.name.toLowerCase().includes(k)));
      if (!matched.length) return 10;
      const sortedScores = matched.map(m => m.score).sort((a, b) => b - a);
      const top3 = sortedScores.slice(0, 3);
      return Math.round(top3.reduce((a, b) => a + b, 0) / top3.length);
    };

    const pcmScore = getScoresForGroup(pcmNames);
    const pcbScore = getScoresForGroup(pcbNames);
    const commScore = getScoresForGroup(commNames);
    const humScore = getScoresForGroup(humNames);

    careerFitment = [
      { name: "Humanities & Creative Arts Stream", score: humScore, color: "#7E3AF2" },
      { name: "Science Stream – Engineering & Tech Track (PCM)", score: pcmScore, color: "#690B1B" },
      { name: "Science Stream – Medical & Life Sciences Track (PCB)", score: pcbScore, color: "#057A55" },
      { name: "Commerce, Business & Management Stream", score: commScore, color: "#C9A55D" }
    ].sort((a, b) => b.score - a.score);
  } else {
    careerFitment = careerFitment.sort((a, b) => b.score - a.score);
  }

  return {
    aptitude,
    personality,
    riasec: riasecPct as any,
    vark: varkPct as any,
    values: valuesPct,
    topRiasec,
    topVark,
    topValues,
    careerFitment,
    completionRate: {
      answered: Object.keys(answers).length,
      total: secs.reduce((a, s) => a + s.questions.length, 0),
    },
  };
}

/** Look up a career's fit score from the computed careerFitment array.
 *  Matches by checking if either name is a substring of the other (first-word prefix). */
function getCareerFitScore(
  careerName: string | undefined,
  fitment: Scores['careerFitment'],
  fallbackIdx: number
): number {
  if (!careerName || !fitment || !fitment.length) return fitment?.[fallbackIdx]?.score ?? 50;
  const lower = careerName.toLowerCase().trim();
  
  // 1. Exact match
  const exact = fitment.find((cf) => cf.name.toLowerCase().trim() === lower);
  if (exact) return exact.score;
  
  // 2. Substring match (full string)
  const sub = fitment.find((cf) => {
    const cfLower = cf.name.toLowerCase().trim();
    return cfLower.includes(lower) || lower.includes(cfLower);
  });
  if (sub) return sub.score;
  
  // 3. Significant domain keyword match (e.g. engineering, medical, commerce, humanities, design)
  const keyWords = lower.replace(/stream|track|–|-|&|\(|\)/g, ' ').split(/\s+/).filter((w) => w.length > 3);
  const wordMatch = fitment.find((cf) => {
    const cfLower = cf.name.toLowerCase();
    return keyWords.some((kw) => cfLower.includes(kw));
  });
  if (wordMatch) return wordMatch.score;

  return fitment[fallbackIdx]?.score ?? 50;
}

function getStreamLabel(stream: string, type: string) {
  if (type === "junior") return "Junior Assessment (7th-9th Grade)";
  if (type === "grade10") return "Class 10 Assessment";
  if (stream === 'science-pcm') return 'Science (PCM)';
  if (stream === 'science-pcb') return 'Science (PCB)';
  if (stream === 'science-pcmb') return 'Science (PCMB)';
  if (stream === 'commerce') return 'Commerce';
  if (stream === 'humanities') return 'Humanities / Arts';
  return '12th Grade / Senior';
}

function getStreamTestDetails(stream: string, type: string) {
  const isJunior = type === "junior";
  const isGrade10 = type === "grade10";
  const isPCM = stream === 'science-pcm';
  const isPCB = stream === 'science-pcb';
  const isPCMB = stream === 'science-pcmb';
  const isComm = stream === 'commerce';
  const isHum = stream === 'humanities';

  return [
    {
      title: 'Aptitude Assessment',
      icon: '🧠',
      color: '#690B1B',
      badge: isJunior ? 'Junior Focus' : isGrade10 ? 'Class 10 Focus' : isPCM ? 'PCM Focus' : isPCB ? 'PCB Focus' : isPCMB ? 'PCMB Focus' : isComm ? 'Commerce Focus' : isHum ? 'Humanities Focus' : 'Core Aptitude',
      desc: isJunior
        ? 'Basic verbal, numerical, and reasoning aptitude designed for middle school development.'
        : isGrade10
        ? 'Streams-matching aptitude testing verbal, numerical, spatial reasoning, and critical thinking.'
        : isPCM 
        ? 'Verbal, numerical, spatial reasoning + specific engineering-related physics & math aptitude.' 
        : isPCB 
        ? 'Verbal, numerical reasoning + life sciences & medical logic and reasoning.'
        : isPCMB 
        ? 'Comprehensive scientific reasoning, math aptitude, and biology logical reasoning.'
        : isComm 
        ? 'Financial interpretation, logical deduction, and commercial aptitude.'
        : isHum 
        ? 'Critical thinking, abstract reasoning, and language/social comprehension.'
        : 'Verbal, numerical, reasoning, and spatial reasoning.'
    },
    {
      title: 'Personality Profile',
      icon: '🌟',
      color: '#7E3AF2',
      badge: 'Big Five Model',
      desc: isJunior
        ? 'Helps identify social, behavioral, and studying preferences for early development.'
        : isGrade10
        ? 'Analyzes personality traits to recommend appropriate learning tracks & streams.'
        : isPCM || isPCB || isPCMB
        ? 'Big Five traits mapped to laboratory, research, clinical, or tech working environments.'
        : isComm 
        ? 'Big Five traits matched to leadership, corporate, financial, and client-facing careers.'
        : isHum 
        ? 'Big Five traits matched to creative, legal, media, and human-centric professions.'
        : 'Globally standard Big Five personality profiling for career compatibility.'
    },
    {
      title: 'Interest Inventory',
      icon: '🎯',
      color: '#057A55',
      badge: 'RIASEC Code',
      desc: isJunior
        ? 'Explores early interest clusters to build academic motivation.'
        : isGrade10
        ? 'RIASEC framework mapped to future class streams (Science, Commerce, Arts).'
        : isPCM 
        ? 'Identifies Realistic (engineering) & Investigative (technology) interest matches.'
        : isPCB 
        ? 'Identifies Investigative (medical/research) & Social (healthcare) interest matches.'
        : isComm 
        ? 'Identifies Enterprising (business) & Conventional (finance) interest matches.'
        : isHum 
        ? 'Identifies Artistic (creative) & Social (human-centric) interest matches.'
        : 'Finds your John Holland RIASEC occupational interest code.'
    },
    {
      title: 'Learning Style',
      icon: '📚',
      color: '#C9A55D',
      badge: 'VARK Model',
      desc: isPCM || isPCB || isPCMB
        ? 'Study strategies tailored for highly technical scientific and numerical courses.'
        : isComm 
        ? 'Study strategies optimized for financial analysis and case studies.'
        : isHum 
        ? 'Study strategies optimized for reading, writing, and descriptive courses.'
        : 'Identifies Visual, Auditory, Reading, or Kinesthetic preference for school/study exams.'
    },
    {
      title: 'Career Values',
      icon: '💼',
      color: '#0694A2',
      badge: 'Value Mapping',
      desc: isPCM || isPCB || isPCMB
        ? 'Prioritizes innovation, scientific impact, and problem-solving rewards.'
        : isComm 
        ? 'Prioritizes financial reward, organizational leadership, and stability.'
        : isHum 
        ? 'Prioritizes artistic expression, social impact, and independence.'
        : 'Clarifies work motivations, salary goals, and lifestyle alignment.'
    }
  ];
}

function getDynamicStudyAbroad(careerName: string, studentName: string) {
  const name = careerName ? careerName.toLowerCase() : "";
  const stdName = studentName || "Student";
  
  if (/software|computer|developer|coder|tech|data|ai|machine learning|robotics|engineer|system|cyber|cloud|network/i.test(name)) {
    return {
      rationale: `${stdName} can benefit immensely from studying tech and software engineering abroad. International tech hubs offer unmatched access to cutting-edge research in AI, internships at FAANG companies, and high-paying global employment.`,
      countries: [
        { flag: "🇺🇸", name: "United States", reason: "Silicon Valley remains the global center of tech innovation. Top universities like Stanford, MIT, and Carnegie Mellon offer elite programs with direct recruiting from Google, Apple, and Microsoft." },
        { flag: "🇩🇪", name: "Germany", reason: "The engineering powerhouse of Europe. Public universities like TU Munich offer world-class, tuition-free computer science degrees with strong practical industry partnerships." },
        { flag: "🇮🇪", name: "Ireland", reason: "Dublin serves as the European headquarters for major tech companies like Google, Meta, and Stripe, providing excellent post-study work visa opportunities for software developers." }
      ],
      scholarships: [
        "Generation Google Scholarship (APAC / Europe)",
        "DAAD Scholarship for Masters in Germany",
        "Government of Ireland International Education Scholarship"
      ],
      programs: [
        "B.S. / M.S. in Computer Science (Specialisation in AI/ML)",
        "B.Sc. in Software Engineering & Data Analytics",
        "M.Sc. in Robotics & Intelligent Systems"
      ]
    };
  }
  
  if (/marketing|business|finance|management|account|audit|economics|supply chain|logistics|commerce|mba|consult|analyst/i.test(name)) {
    if (/supply chain|logistics/i.test(name)) {
      return {
        rationale: `${stdName} will find premium opportunities studying global supply chain management abroad. Studying in major international maritime and aviation hubs provides direct exposure to world-class logistics operations.`,
        countries: [
          { flag: "🇸🇬", name: "Singapore", reason: "The logistics gateway of Asia. Singapore houses the world's busiest transshipment port and top universities (NUS, NTU) offering leading programs in global operations and supply chain management." },
          { flag: "🇩🇪", name: "Germany", reason: "As Europe's largest exporter, Germany has the most sophisticated logistics network in the world. Excellent logistics programs are offered with direct access to firms like DHL and DB Schenker." },
          { flag: "🇺🇸", name: "United States", reason: "Hosts global e-commerce and retail giants (Amazon, Walmart). US business schools offer STEM-designated Supply Chain Management degrees with 3-year OPT work permits." }
        ],
        scholarships: [
          "NUS Global Merit Scholarship",
          "Chevening Scholarship (UK) for Logistics & Supply Chain",
          "Singapore Government Scholarship (SINGA)"
        ],
        programs: [
          "B.Sc. in Supply Chain Management & Operations",
          "M.Sc. in Global Logistics & Supply Chain Systems",
          "BBA in Logistics & International Transportation"
        ]
      };
    }
    if (/marketing|brand|advert/i.test(name)) {
      return {
        rationale: `${stdName}'s career in marketing will benefit from studying abroad, gaining exposure to international consumer behavior, digital media innovation, and global marketing methodologies.`,
        countries: [
          { flag: "🇺🇸", name: "United States", reason: "The home of modern marketing and digital media advertising. Top business schools like Wharton and NYU Stern offer premium courses with internships at global ad agencies and tech firms." },
          { flag: "🇬🇧", name: "United Kingdom", reason: "London is a premier creative and media hub. Shorter 1-year Master's programs at LSE, Imperial, and King's College provide fast-track entry to international brand management roles." },
          { flag: "🇫🇷", name: "France", reason: "The undisputed capital of luxury and fashion. French business schools (like HEC Paris and ESSEC) offer world-leading Luxury Brand Management and Luxury Marketing programs." }
        ],
        scholarships: [
          "Fulbright Graduate Scholarship (US)",
          "Eiffel Excellence Scholarship (France)",
          "King's College London International Scholarships"
        ],
        programs: [
          "BBA / M.Sc. in Marketing & Consumer Psychology",
          "M.Sc. in Luxury Brand Management",
          "B.Sc. in Digital Marketing & Media Strategy"
        ]
      };
    }
    return {
      rationale: `${stdName} will benefit from studying business and finance abroad, gaining direct insights into global markets, international corporate laws, and prestigious networking circles.`,
      countries: [
        { flag: "🇺🇸", name: "United States", reason: "Hosts the world's largest financial hubs (New York/Wall Street). Universities like Wharton, NYU Stern, and Chicago Booth offer premier business and finance recruiting." },
        { flag: "🇬🇧", name: "United Kingdom", reason: "London is a premier global financial center. Top institutions like London Business School and LSE offer prestigious programs in finance, economics, and corporate management." },
        { flag: "🇨🇦", name: "Canada", reason: "Renowned business schools with cooperative education programs (Co-op) offering direct industry placement and post-graduation work opportunities in major banking hubs." }
      ],
      scholarships: [
        "Chevening Scholarship (UK)",
        "Erasmus Mundus Joint Master Degree (EU)",
        "Ontario Graduate Scholarship (Canada)"
      ],
      programs: [
        "B.Sc. in Economics & Finance",
        "Bachelor of Business Administration (BBA)",
        "M.Sc. in Financial Economics & Investment Banking"
      ]
    };
  }
  
  if (/medicine|doctor|surgeon|physician|biotech|biology|pharma|clinical|dent|nurse|psychology|therapist|counsel/i.test(name)) {
    return {
      rationale: `${stdName} can access advanced clinical environments, research laboratories, and globally recognized healthcare certifications by pursuing life sciences or medical studies abroad.`,
      countries: [
        { flag: "🇺🇸", name: "United States", reason: "Leading the world in biotechnology and biomedical research. Top institutions (Harvard, Johns Hopkins) offer elite pre-med pathways and biochemistry programs." },
        { flag: "🇬🇧", name: "United Kingdom", reason: "Home to historic medical universities. Oxford, Cambridge, and UCL provide world-class clinical research, genetics, and pharmaceutical science degrees." },
        { flag: "🇨🇦", name: "Canada", reason: "Offers exceptional public health and biomedical sciences research programs with state-of-the-art labs and a direct path to healthcare practice licenses." }
      ],
      scholarships: [
        "Commonwealth Scholarship (UK/Canada)",
        "Rhodes Scholarship (UK)",
        "Johns Hopkins Medical Research Grant / Scholarship"
      ],
      programs: [
        "B.Sc. in Biomedical Science / Biochemistry",
        "Pre-Medicine Studies / Doctor of Medicine (MD)",
        "M.Sc. in Biotechnology & Genetic Engineering"
      ]
    };
  }

  if (/law|legal|court|barrister|art|design|fashion|music|humanities|history|politic|social|writ|journal|architect/i.test(name)) {
    if (/law|legal/i.test(name)) {
      return {
        rationale: `${stdName} can gain international legal perspective and credentials by studying law abroad. An international law degree provides pathways to global arbitration, corporate law, and diplomacy.`,
        countries: [
          { flag: "🇬🇧", name: "United Kingdom", reason: "The cradle of Common Law. Oxford, Cambridge, and LSE offer highly prestigious LLB programs that are directly applicable to corporate law and international arbitration." },
          { flag: "🇺🇸", name: "United States", reason: "Offers top-tier Juris Doctor (JD) and LLM programs at Ivy League law schools, providing access to international corporate law firms and human rights organizations." },
          { flag: "🇸🇬", name: "Singapore", reason: "A primary international arbitration hub in Asia. NUS and SMU Law schools offer world-class programs in international business law and dispute resolution." }
        ],
        scholarships: [
          "Chevening Law Scholarships (UK)",
          "Fulbright Graduate Law Grants (US)",
          "Dean's Award for Law (Singapore)"
        ],
        programs: [
          "Bachelor of Laws (LLB)",
          "Master of Laws (LLM) in International Corporate Law",
          "Pre-Law Pathways / Juris Doctor (JD)"
        ]
      };
    }
    return {
      rationale: `${stdName}'s creative talents will be nurtured by studying art, design, or liberal arts abroad, providing access to global media hubs, creative agencies, and historical art capitals.`,
      countries: [
        { flag: "🇬🇧", name: "United Kingdom", reason: "London is a global creative hub. Famous colleges like the Royal College of Art and Central Saint Martins offer world-leading design, fashion, and art programs." },
        { flag: "🇺🇸", name: "United States", reason: "Hosts major media, film, and design industries. Prestigious design academies like Parsons and Rhode Island School of Design (RISD) offer direct pipelines to creative firms." },
        { flag: "🇫🇷", name: "France", reason: "The global home of fashion, fine arts, and luxury product design. Elite Parisian schools provide direct internships with luxury houses like LVMH and Chanel." }
      ],
      scholarships: [
        "UAL International Postgraduate Scholarships (UK)",
        "Parsons School of Design Merit Scholarships (US)",
        "Eiffel Excellence Scholarship for Creative Arts (France)"
      ],
      programs: [
        "Bachelor of Fine Arts (BFA) in Graphic Design / Fashion",
        "B.Arch / M.Arch in Sustainable Architecture",
        "B.A. / M.A. in Media, Communication & Creative Industries"
      ]
    };
  }

  return {
    rationale: `${stdName} can benefit from international education in ${careerName || "their chosen field"}. Studying abroad offers access to world-class faculty, global student communities, and premium career opportunities.`,
    countries: [
      { flag: "🇺🇸", name: "United States", reason: "World-class universities, flexible credit transfer programs, and extensive internship networks in major economic hubs." },
      { flag: "🇬🇧", name: "United Kingdom", reason: "Prestigious institutions, shorter course duration (3-year Bachelor's / 1-year Master's), and strong global corporate connections." },
      { flag: "🇨🇦", name: "Canada", reason: "High-quality public education system, welcoming cultural diversity, and favorable post-study work visa options." }
    ],
    scholarships: [
      "Fulbright Graduate Scholarship (US)",
      "Chevening Scholarship (UK)",
      "Commonwealth Scholarship"
    ],
    programs: [
      "Bachelor of Science (B.Sc.) in relevant stream",
      "Bachelor of Business Administration (BBA)",
      "Master of Science / Arts in target specialization"
    ]
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AssessmentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentType = searchParams.get("type") || "senior";

  const [screen, setScreen] = useState<Screen>(searchParams.get("resultId") ? "fetching" : "landing");
  const [existingResult, setExistingResult] = useState<any>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [reportMode, setReportMode] = useState<'detailed' | 'basic'>('detailed');
  const [viewReportMode, setViewReportMode] = useState<'full' | 'executive'>(searchParams.get("mode") === "executive" ? "executive" : "full");
  const [student, setStudent] = useState<StudentInfo>({
    name: "", grade: "", age: "", school: "", city: "", email: "", phone: "",
    password: "", stream: "not-selected", parentName: "", parentPhone: "",
    parentEmail: "", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
    reportId: "AS-" + new Date().getFullYear() + "-" + String(Math.floor(10000 + Math.random() * 90000)),
  });
  const [questions, setQuestions] = useState<typeof FBQ | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [scores, setScores] = useState<Scores | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const isClass10Report = 
    assessmentType === "grade10" || 
    student.grade === "10" || 
    student.grade === "10th" || 
    String(student.grade || '').toLowerCase().includes("10");
  const [loadSteps, setLoadSteps] = useState([0, 0, 0, 0, 0]); // 0=pending,1=active,2=done
  const [loadRSteps, setLoadRSteps] = useState([0, 0, 0, 0, 0]);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmData, setCrmData] = useState<CareerRoadmapData | null>(null);
  const [selectedCareerIdx, setSelectedCareerIdx] = useState<number | null>(null);
  const [allCrmData, setAllCrmData] = useState<(CareerRoadmapData | null)[]>([]);
  const [allCrmLoading, setAllCrmLoading] = useState(false);
  const allCrmGeneratedRef = useRef(false);
  const allCrmPromiseRef = useRef<Promise<any> | null>(null);
  const [careerAbroadData, setCareerAbroadData] = useState<Record<string, any>>({});
  const [loadingAbroad, setLoadingAbroad] = useState<boolean>(false);
  const chartInstRef = useRef<Record<string, any>>({});
  const [pdfUnlocked, setPdfUnlocked] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [streamStep, setStreamStep] = useState<'main' | 'science'>('main');
  const [juniorGradeSelectorOpen, setJuniorGradeSelectorOpen] = useState(false);
  const [activeJuniorMonth, setActiveJuniorMonth] = useState(1);
  const [active9YearTab, setActive9YearTab] = useState<'matrix' | 1 | 2 | 3 | 4>('matrix');
  const advancingRef = useRef(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userAccess, setUserAccess] = useState<any>(null);

  useEffect(() => {
    if (screen === "questions" || screen === "loading-r") {
      document.body.classList.add("test-active");
    } else {
      document.body.classList.remove("test-active");
    }
    return () => document.body.classList.remove("test-active");
  }, [screen]);

  const targetResultId = searchParams.get("resultId");

  useEffect(() => {
    if (targetResultId) {
      fetch(`/api/psychometric-test/${targetResultId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.result) {
            if (data.reportLocked) {
              setScreen("locked");
              return;
            }
            setScores(data.result.scores);
            setReportData(data.result.narrative);

            // Historical Report Immutability:
            // Use academicGradeAtAttempt if present, falling back to student grade saved at time of test
            const rawStudent = data.result.student || data.result;
            const attemptGrade = data.result.academicGradeAtAttempt || rawStudent.grade || rawStudent.academicGrade;
            setStudent({
              ...rawStudent,
              grade: attemptGrade ? String(attemptGrade) : rawStudent.grade,
            });

            if (data.result.questions) setQuestions(data.result.questions);
            if (data.result.answers) setAnswers(data.result.answers);
            if (data.result.careerAbroadData) setCareerAbroadData(data.result.careerAbroadData);
            if (data.result.allCrmData) {
              setAllCrmData(data.result.allCrmData);
              if (data.result.allCrmData.length > 0) setCrmData(data.result.allCrmData[0]);
              allCrmGeneratedRef.current = true;
            }
            // Set Comparison data if available
            if (data.comparisonData) {
              setComparisonData(data.comparisonData);
            }
            
            setScreen("report");
            
            setReportMode("detailed");
            setPdfUnlocked(true);
          }
        })
        .catch(err => console.error("Error fetching result:", err));
    } else {
      const isRetake = searchParams.get('retake') === 'true';
      const requestedType = searchParams.get('type') || '';

      // Check if user has already completed a psychometric assessment
      fetch(`/api/psychometric-test/user-status?type=${encodeURIComponent(requestedType)}`)
        .then(res => res.json())
        .then(statusData => {
          if (statusData.authenticated && statusData.hasCompletedTest && !isRetake) {
            // Find matching result for the requested type/variant, or fall back to their latest completed result
            const targetResult = statusData.matchingResult || (statusData.latestResultId ? { reportUrl: statusData.latestReportUrl, resultId: statusData.latestResultId } : null);
            if (targetResult && targetResult.reportUrl) {
              console.log('[PSYCHOMETRIC TEST] Found existing completed assessment, redirecting directly to report:', targetResult.reportUrl);
              router.replace(targetResult.reportUrl);
              return;
            }
          }
          if (statusData.matchingResult || statusData.latestResultId) {
            setExistingResult(statusData.matchingResult || statusData.results?.[0] || null);
          }
        })
        .catch(err => console.error('Error checking user psychometric status:', err));

      // Fetch user profile and access policy if taking a new test
      fetch('/api/user/update-profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUserProfile(data.user);
            const access = data.psychometricAccess || data.user.psychometricAccess;
            if (access) {
              setUserAccess(access);
            }
            setStudent(prev => ({
              ...prev,
              name: data.user.name || prev.name,
              grade: data.user.grade || data.user.academicGrade || prev.grade,
              school: data.user.schoolName || data.user.currentSchool || prev.school,
              stream: data.user.stream || prev.stream,
              email: data.user.email || prev.email,
            }));
          }
        })
        .catch(() => {});
    }
  }, [targetResultId]);

  useEffect(() => {
    async function fetchAbroadData() {
      if (!reportData || !scores || selectedCareerIdx === null) return;
      const activeCareer = (reportData.topCareers || [])[selectedCareerIdx ?? 0];
      const activeCareerName = activeCareer?.name || "";
      if (!activeCareerName) return;

      if (careerAbroadData[activeCareerName]) return;

      setLoadingAbroad(true);
      try {
        const prompt = `You are a senior study abroad career counsellor. Recommend the top 3 most suitable countries globally for a student named "${student.name}" to pursue higher education in the career "${activeCareerName}".
Aptitude overall score: ${scores?.aptitude?.overall || 'N/A'}%, dominant Holland RIASEC code: ${scores?.topRiasec?.join("-") || 'N/A'}.

Select the 3 most suitable countries globally for this field (e.g., Germany, Singapore, Japan, Australia, France, Switzerland, United States, United Kingdom, Canada, etc. depending on what is the actual global hub/expert destination for "${activeCareerName}").

Return ONLY valid JSON with this exact structure (do NOT include any markdown code blocks, do NOT include any introductory or concluding text, just the raw JSON):
{
  "rationale": "2-sentence rationale for study abroad tailored specifically to this career",
  "countries": [
    {"flag": "flag_emoji", "name": "Country Name", "reason": "Detailed reason why this country is a perfect fit for this career, outlining industry presence or program strengths"},
    {"flag": "flag_emoji", "name": "Country Name", "reason": "Detailed reason why this country is a perfect fit for this career, outlining industry presence or program strengths"},
    {"flag": "flag_emoji", "name": "Country Name", "reason": "Detailed reason why this country is a perfect fit for this career, outlining industry presence or program strengths"}
  ],
  "scholarships": ["3 prestigious scholarships suitable for this career and countries"],
  "programs": ["3 specific, realistic, and prestigious degree programs/courses for this career in these countries"]
}`;

        const raw = await callAPI([{ role: "user", content: prompt }]);
        const parsed = extractJSON(raw);
        if (parsed && parsed.countries?.length) {
          setCareerAbroadData(prev => {
            const next = { ...prev, [activeCareerName]: parsed };
            const resultId = searchParams.get("resultId");
            if (resultId) {
              fetch(`/api/psychometric-test/${resultId}/update-generated`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ careerAbroadData: next }),
              }).catch(e => console.error("Failed to save abroad data", e));
            }
            return next;
          });
        } else throw new Error("invalid");
      } catch (err) {
        console.warn("API failed in fetchAbroadData, using fallback data:", err);
        setCareerAbroadData(prev => {
          const next = {
            ...prev,
            [activeCareerName]: {
              rationale: "This career has a strong global demand, offering excellent opportunities for international exposure, cutting-edge research, and cross-cultural networking.",
              countries: [
                { flag: "🇺🇸", name: "United States", reason: "Home to top-tier universities and a massive industry presence with high earning potential." },
                { flag: "🇬🇧", name: "United Kingdom", reason: "Offers globally recognized accelerated programs and strong industry links." },
                { flag: "🇨🇦", name: "Canada", reason: "Known for excellent education quality, high quality of life, and welcoming post-study work opportunities." }
              ],
              scholarships: ["Global Excellence Scholarship", "Chevening Scholarship", "Fulbright Foreign Student Program"],
              programs: ["BSc/MSc in relevant field from top global institutions"]
            }
          };
          const resultId = searchParams.get("resultId");
          if (resultId) {
            fetch(`/api/psychometric-test/${resultId}/update-generated`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ careerAbroadData: next }),
            }).catch(e => console.error("Failed to save fallback abroad data", e));
          }
          return next;
        });
      } finally {
        setLoadingAbroad(false);
      }
    }
    fetchAbroadData();
  }, [selectedCareerIdx, reportData, scores, student.name]);

  useEffect(() => {
    if (reportData && reportData.topCareers && scores && scores.careerFitment) {
      const sortedCareers = (reportData.topCareers || [])
        .map((c: any, origIdx: number) => {
          const fitScore = getCareerFitScore(c.name, scores.careerFitment, origIdx);
          return { ...c, fitScore, origIdx };
        })
        .sort((a: any, b: any) => b.fitScore - a.fitScore);
      
      if (sortedCareers.length > 0) {
        setSelectedCareerIdx(sortedCareers[0].origIdx);
      }
    }
  }, [reportData, scores]);

  // Auto-generate roadmaps for ALL top careers when results are ready
  useEffect(() => {
    if (!reportData?.topCareers?.length || !scores || allCrmGeneratedRef.current) return;
    allCrmGeneratedRef.current = true;
    const careers = reportData.topCareers.slice(0, 5);
    setAllCrmLoading(true);
    setAllCrmData(careers.map(() => null));

    async function generateAllRoadmaps() {
      const roadmapResults: (CareerRoadmapData | null)[] = [];
      
      for (let idx = 0; idx < careers.length; idx++) {
        const career = careers[idx];
        const roadmapGradeContext = assessmentType === "junior"
          ? "Note: The student is in middle school (Grade 7-9). Tailor Stage 1 of the stages array to cover High School Preparation & Stream Selection (Grade 10/11/12), recommending actions to prepare for the appropriate stream choice."
          : assessmentType === "grade10"
          ? "Note: The student is in Grade 10. Tailor Stage 1 of the stages array to cover stream selection, early profile building, and high school foundation skills."
          : `Note: The student is in Grade 11 or 12. Tailor Stage 1 of the stages array to cover Board Exams and Entrance Exams prep tailored to the student's stream: ${student.stream}.`;

        const prompt = `You are a senior Indian career counsellor. Generate a detailed career roadmap for ${student.name}, Grade ${student.grade}, who wants to pursue "${career.name}". Their profile: Aptitude ${scores?.aptitude?.overall || 'N/A'}%, RIASEC ${scores?.topRiasec?.join("-") || 'N/A'}, Top values: ${scores?.topValues?.slice(0, 3).join(", ") || 'N/A'}, Learning style: ${scores?.topVark || 'N/A'}, City: ${student.city || "India"}.
${roadmapGradeContext}
Return ONLY valid JSON: {"overview":"2-3 sentence personalised description","duration":"e.g. 4+2 years","avgSalary":"e.g. ₹8–25 LPA","fitScore":"e.g. 92%","stages":[{"stage":"label","icon":"emoji","title":"title","actions":["action 1","action 2","action 3"],"milestone":"milestone","targetColleges":["college 1","college 2"]},{"stage":"Graduation","icon":"🎓","title":"degree","actions":["action 1","action 2"],"milestone":"milestone"},{"stage":"Post-Graduation","icon":"📜","title":"PG path","actions":["action 1","action 2"],"targetPrograms":["programme 1"]},{"stage":"Early Career","icon":"💼","title":"role","actions":["action 1","action 2","action 3"],"milestone":"milestone","salaryTrajectory":["Year 1-2: ₹X LPA","Year 3-5: ₹Y LPA"],"targetCompanies":["company 1","company 2"]}],"keyExams":["exam 1","exam 2","exam 3"],"keySkills":["skill 1","skill 2","skill 3"],"topColleges":["college 1","college 2","college 3"],"scholarships":["scholarship 1","scholarship 2"],"dayInLife":"2-3 sentences about typical day"}`;

        let finalData: CareerRoadmapData | null = null;
        try {
          const raw = await callAPI([{ role: "user", content: prompt }]);
          const rm = extractJSON(raw);
          if (rm && rm.stages) {
            rm.fitScore = getCareerFitScore(career?.name, scores?.careerFitment || [], idx) + "%";
            finalData = { career, roadmap: rm } as CareerRoadmapData;
          }
        } catch (e) {
          console.error(`Failed to generate roadmap for career ${idx + 1}:`, e);
        }

        if (!finalData) {
          // Fallback
          const exactFitScore = getCareerFitScore(career?.name, scores?.careerFitment || [], idx);
          finalData = {
            career,
            roadmap: {
              overview: `${career?.description || ''} With your aptitude of ${scores?.aptitude?.overall || '80'}% and ${career?.name || 'this'} aligned profile, this is one of your strongest career fits (Fitment Score: ${exactFitScore}%).`,
              duration: "4–6 years", avgSalary: career?.salaryRange || "Competitive", fitScore: exactFitScore + "%",
              stages: [
                { stage: `Grade ${student?.grade || '11'}–12`, icon: "📚", title: "Build Foundations", actions: [`Focus on subjects relevant to ${career?.name || 'this field'}`, "Explore related extracurriculars", `Research entrance exam: ${career?.indianExam || 'Relevant Exams'}`], milestone: "Score 85%+ in boards" },
                { stage: "Graduation", icon: "🎓", title: career?.education || "Undergrad Degree", actions: [`Enrol in ${career?.education || 'a relevant degree'}`, "Intern from Year 2", "Build portfolio"], milestone: "Graduate with internship", targetColleges: [`Top colleges for ${career?.name || 'this field'} in India`] },
                { stage: "Post-Graduation", icon: "📜", title: "Specialisation", actions: ["Pursue relevant Masters", "Clear advanced exams", "Build expertise"], milestone: "Land mid-level role" },
                { stage: "Early Career", icon: "💼", title: "Launch Career", actions: [`Start in ${career?.name || 'this field'}`, "Build domain experience", "Target senior role"], milestone: "₹15-20 LPA by Year 5", salaryTrajectory: ["Year 1-2: Entry level", "Year 3-5: Mid-level"], targetCompanies: [`Top firms in ${career?.name || 'this field'}`] },
              ],
              keyExams: [career?.indianExam || 'Relevant Exams', "CUET", "IELTS/TOEFL for abroad"],
              keySkills: ["Communication", "Critical Thinking", "Domain Knowledge", "Networking"],
              topColleges: [`Top colleges for ${career?.education || 'this field'}`],
              scholarships: ["National Merit Scholarship", "Chevening (UK)", "Fulbright (US)"],
              dayInLife: `Professionals in ${career?.name || 'this field'} work on a mix of strategic and hands-on tasks involving ${career?.description?.split(".")?.[0]?.toLowerCase() || 'their domain'}.`,
            }
          } as CareerRoadmapData;
        }

        roadmapResults.push(finalData);

        // Progressively update state so user can view already generated roadmaps
        setAllCrmData((prev) => {
          const next = [...prev];
          next[idx] = finalData;
          return next;
        });

        if (idx === 0) {
          setCrmData(finalData); // For backward compatibility
        }

        // Slight delay to respect rate limits between generating next roadmap
        if (idx < careers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setAllCrmLoading(false);

      const resultId = searchParams.get("resultId");
      if (resultId) {
        fetch(`/api/psychometric-test/${resultId}/update-generated`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ allCrmData: roadmapResults }),
        }).catch(e => console.error("Failed to save all CRM data", e));
      }

      return roadmapResults;
    }

    allCrmPromiseRef.current = generateAllRoadmaps();
  }, [reportData, scores]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__triggerReportPrint = (type: 'full' | 'executive' = 'full') => downloadPDF(type);
      (window as any).__triggerReportDownload = (type: 'full' | 'executive' = 'full') => downloadPDF(type);
      (window as any).__triggerSummaryDownload = () => downloadPDF('executive');

      const listener = (e: any) => { 
        const rType: 'full' | 'executive' = e?.detail?.reportType === 'executive' ? 'executive' : 'full';
        downloadPDF(rType);
      };
      const summaryListener = () => { downloadPDF('executive'); };

      const modeListener = (e: any) => {
        if (e?.detail?.mode === 'executive' || e?.detail?.mode === 'full') {
          setViewReportMode(e.detail.mode);
        }
      };

      window.addEventListener('trigger-pdf-download', listener);
      window.addEventListener('trigger-summary-download', summaryListener);
      window.addEventListener('switch-report-mode', modeListener);

      return () => {
        window.removeEventListener('trigger-pdf-download', listener);
        window.removeEventListener('trigger-summary-download', summaryListener);
        window.removeEventListener('switch-report-mode', modeListener);
        delete (window as any).__triggerReportPrint;
        delete (window as any).__triggerReportDownload;
        delete (window as any).__triggerSummaryDownload;
      };
    }
  }, [student, scores, reportData, questions, answers, allCrmData, allCrmLoading, pdfUnlocked]);

  // Track previous assessmentType to detect sidebar grade-level switches
  const prevAssessmentTypeRef = useRef(assessmentType);

  useEffect(() => {
    // On assessment type change (not initial mount), reset to landing if currently viewing a result
    if (prevAssessmentTypeRef.current !== assessmentType) {
      prevAssessmentTypeRef.current = assessmentType;
      // Reset all result state so the old report doesn't linger with mismatched context
      setScores(null);
      setReportData(null);
      setSelectedCareerIdx(null);
      setCareerAbroadData({});
      setCrmData(null);
      setAllCrmData([]);
      setAllCrmLoading(false);
      allCrmGeneratedRef.current = false;
      setScreen("landing");
    }

    if (assessmentType === "junior") {
      setStudent((prev) => ({ ...prev, grade: userProfile?.grade || prev.grade || "", stream: "not-selected" }));
    } else if (assessmentType === "grade10") {
      setStudent((prev) => ({ ...prev, grade: "10", stream: "not-selected" }));
    } else if (assessmentType === "senior" || assessmentType === "grade12") {
      setStudent((prev) => ({ ...prev, grade: userProfile?.grade || prev.grade || "12", stream: userProfile?.stream || prev.stream || "not-selected" }));
    }
  }, [assessmentType, userProfile]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  // ── Start Junior assessment with specific grade ────────────────────────────
  function startJuniorAssessment(grade: string) {
    setStudent((p) => ({
      ...p,
      name: p.name || userProfile?.name || "Student",
      grade: grade,
      stream: "not-selected",
    }));
    setJuniorGradeSelectorOpen(false);
    setScreen("loading-q");
    loadQuestions("not-selected");
  }

  // ── Landing → Details ──────────────────────────────────────────────────────
  function goToDetails() {
    if (userAccess && userAccess.status === "PROFILE_INCOMPLETE") {
      showToast("Please complete your grade in your profile first to unlock your psychometric assessment.");
      setTimeout(() => {
        window.location.href = "/dashboard/student/update-profile";
      }, 1500);
      return;
    }

    const activeVariant: VariantId = 
      assessmentType === "junior" ? "7-9" : 
      assessmentType === "grade10" ? "10" : "12";

    const isEligible = userAccess ? (
      (activeVariant === '7-9' && userAccess.eligibleVariant === 'JUNIOR_7_9') ||
      (activeVariant === '10' && userAccess.eligibleVariant === 'CLASS_10') ||
      (activeVariant === '12' && userAccess.eligibleVariant === 'SENIOR_12')
    ) : true;

    if (userAccess && !isEligible) {
      showToast(`Your registered grade is ${userAccess.gradeLabel || userAccess.grade}. Please take the ${userAccess.eligibleTestName || 'assigned assessment'}.`);
      if (userAccess.eligibleHref) {
        setTimeout(() => {
          window.location.href = userAccess.eligibleHref;
        }, 1500);
      }
      return;
    }

    if (assessmentType === "junior") {
      const canonicalGrade = student.grade || userProfile?.grade || userProfile?.academicGrade;
      if (canonicalGrade && ["7", "8", "9"].includes(String(canonicalGrade))) {
        startJuniorAssessment(String(canonicalGrade));
      } else {
        setJuniorGradeSelectorOpen(true);
      }
    } else if (assessmentType === "grade10") {
      setStudent((p) => ({
        ...p,
        name: p.name || userProfile?.name || "Student",
        grade: "10",
        stream: "not-selected",
      }));
      setScreen("loading-q");
      loadQuestions("not-selected");
    } else {
      setStudent((p) => ({
        ...p,
        name: p.name || userProfile?.name || "Student",
        grade: p.grade || userProfile?.grade || "12",
      }));
      setScreen("details");
      setStreamStep("main");
    }
  }

  // ── Validate & start assessment ────────────────────────────────────────────
  function startAssessmentWithStream(stream: string) {
    setStudent((p) => ({
      ...p,
      name: p.name || userProfile?.name || "Student",
      grade: p.grade || userProfile?.grade || "12",
      stream: stream,
    }));
    setScreen("loading-q");
    loadQuestions(stream);
  }

  async function loadQuestions(overrideStream?: string) {
    const activeStream = overrideStream || student.stream;
    // Simulate loading steps with FBQ (fallback questions)
    const stepDelay = [600, 500, 500, 500, 400];
    const steps = [...loadSteps];
    steps[0] = 1; setLoadSteps([...steps]);

    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, stepDelay[i]));
      steps[i] = 2;
      if (i + 1 < 5) steps[i + 1] = 1;
      setLoadSteps([...steps]);
    }

    let targetQuestions = FBQ_SENIOR;
    if (assessmentType === "junior") {
      targetQuestions = FBQ_JUNIOR;
    } else if (assessmentType === "grade10") {
      targetQuestions = FBQ_GRADE10;
    } else {
      if (activeStream && activeStream.startsWith("science")) {
        targetQuestions = FBQ_GRADE12_SCIENCE;
      } else if (activeStream === "commerce") {
        targetQuestions = FBQ_GRADE12_COMMERCE;
      } else if (activeStream === "humanities") {
        targetQuestions = FBQ_GRADE12_ARTS;
      }
    }

    setQuestions(targetQuestions);
    setCurrentSection(0);
    setCurrentQIdx(0);
    setScreen("questions");
  }

  // ── Answer handling ────────────────────────────────────────────────────────
  function handleAnswer(qId: number, ansIdx: number) {
    setAnswers((prev) => ({ ...prev, [qId]: ansIdx }));
    
    // Guard: if an advance is already scheduled, just update the answer, don't queue another advance
    if (advancingRef.current) return;
    advancingRef.current = true;
    
    setTimeout(() => {
      advancingRef.current = false;
      if (!questions) return;
      const sec = questions.sections[currentSection];
      if (currentQIdx < sec.questions.length - 1) {
        setCurrentQIdx((i) => i + 1);
      } else if (currentSection < questions.sections.length - 1) {
        setCurrentSection((s) => s + 1);
        setCurrentQIdx(0);
      } else {
        finishAssessment();
      }
    }, 300);
  }

  function getCurrentQuestion() {
    if (!questions) return null;
    const sec = questions.sections[currentSection];
    return sec?.questions[currentQIdx] || null;
  }

  function getTotalAnswered() {
    if (!questions) return 0;
    let total = 0;
    for (let s = 0; s < currentSection; s++) {
      total += questions.sections[s].questions.length;
    }
    total += currentQIdx;
    return total;
  }

  function getTotalQuestions() {
    if (!questions) return 50;
    return questions.sections.reduce((a, s) => a + s.questions.length, 0);
  }

  function goNextQ() {
    if (!questions) return;
    const q = getCurrentQuestion();
    if (!q) return;
    if (answers[q.id] === undefined) return showToast("Please select an answer");

    const sec = questions.sections[currentSection];
    if (currentQIdx < sec.questions.length - 1) {
      setCurrentQIdx((i) => i + 1);
    } else if (currentSection < questions.sections.length - 1) {
      setCurrentSection((s) => s + 1);
      setCurrentQIdx(0);
    } else {
      // All done
      finishAssessment();
    }
  }

  function goPrevQ() {
    if (currentQIdx > 0) {
      setCurrentQIdx((i) => i - 1);
    } else if (currentSection > 0) {
      const prevSec = questions!.sections[currentSection - 1];
      setCurrentSection((s) => s - 1);
      setCurrentQIdx(prevSec.questions.length - 1);
    }
  }

  async function finishAssessment() {
    if (!questions) return;
    setScreen("loading-r");

    const computedScores = computeScores(answers, questions, student.stream, assessmentType);
    setScores(computedScores);

    // Animate loading steps
    const steps = [0, 0, 0, 0, 0];
    steps[0] = 1; setLoadRSteps([...steps]);
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 600));
      steps[i] = 2;
      if (i + 1 < 5) steps[i + 1] = 1;
      setLoadRSteps([...steps]);
    }

    // Generate narrative via AI (with fallback)
    const narrative = await generateNarrative(computedScores);
    setReportData(narrative);

    try {
      const res = await fetch('/api/psychometric-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          scores: computedScores,
          narrative,
          assessmentType,
          questions,
          answers
        })
      });
      const data = await res.json();
      if (res.status === 403 || !res.ok) {
        showToast(data.message || data.error || "Submission rejected: your grade is not eligible for this assessment.");
        if (data.redirectUrl) {
          setTimeout(() => {
            window.location.href = data.redirectUrl;
          }, 2000);
        }
        return;
      }
      if (data.success && data.resultId) {
        // Keep the loading screen visible during navigation (don't switch to "landing")
        window.location.href = `/psychometric-test/result/${data.resultId}`;
        return;
      }
    } catch (e) {
      console.error('Failed to save psychometric assessment', e);
    }
    
    setScreen("report");
    setReportMode("detailed");
    setPdfUnlocked(true);
  }

  async function generateNarrative(sc: Scores): Promise<any> {
    const gradeContext = assessmentType === "junior"
      ? "Note: The student is in middle school (Grade 7-9). Focus your advice on stream selection recommendations for high school (Science PCM/PCB, Commerce, Humanities), early skill-building, and developing interest areas. Do not recommend immediate entry to university yet but outline the future path."
      : assessmentType === "grade10"
      ? "Note: The student is in Grade 10. Focus your advice on stream selection (Science, Commerce, Arts) after 10th grade, early profile building, foundation skills, and target career clusters."
      : `Note: The student is in high school (Grade 11/12) and is in the ${student.stream} stream. Focus your advice on entrance exam preparation (e.g., JEE, NEET, CUET, CLAT depending on stream), choosing specific college degrees, target colleges in India and abroad, and early career entry pathways.`;

    const prompt = `You are a senior Indian career counsellor and psychologist. Analyse the following psychometric assessment results for ${student.name}, Grade ${student.grade}, Age ${student.age}, Stream: ${student.stream || "Not Selected"}, City: ${student.city || "India"}.
${gradeContext}

CRITICAL INSTRUCTION FOR STREAM & GRADE ALIGNMENT:
1. If the student is in Grade 10 or Junior (assessmentType is 'junior' or 'grade10'), they are in a pre-specialization phase. Therefore, you MUST NOT recommend specific, specialized job titles (like "Fashion Designer", "Software Engineer", or "Corporate Lawyer") as their topCareers "name". Instead, name the "topCareers" as broad academic & stream-based pathways (e.g., "Humanities Stream – Creative & Design Studies Track", "Science Stream – Engineering & Physical Sciences (PCM) Track", "Science Stream – Medicine & Life Sciences (PCB) Track", "Commerce Stream – Finance & Business Administration Track"). The descriptions, education paths, exams, and action items must focus on choosing the right stream in Class 11, selecting subjects, and developing early learning foundations.
2. If the student is in Grade 11/12, they have already chosen their stream. You MUST strictly recommend careers aligned ONLY with their selected Stream (${student.stream}). Under NO circumstances should you suggest careers belonging to other streams (e.g. do NOT recommend Chartered Accountancy to a Science student).
3. The topCareers names MUST match the exact order and ranking of top career clusters computed for this student: ${sc.careerFitment.slice(0, 5).map((c) => `${c.name} (${c.score}%)`).join(", ")}. Do NOT reorder them or invent unrelated titles.
4. TENSION & RISK DETECTION: If any Big Five trait scores below 35% AND the recommended career path typically requires high levels of that trait (e.g. low Conscientiousness <35% and Medical/NEET/Law, or low Extraversion <25% and Sales/Public Relations), you MUST explicitly address this tension in the career description and growthAreas with actionable mitigation strategies (e.g. establishing study accountability groups, time-blocking routines).

Assessment scores:
- Aptitude: Overall ${sc.aptitude.overall}%, Verbal ${sc.aptitude.verbal}%, Numerical ${sc.aptitude.numerical}%, Reasoning ${sc.aptitude.reasoning}%, Spatial ${sc.aptitude.spatial}%
- Personality (Big Five): Openness ${sc.personality.openness}%, Conscientiousness ${sc.personality.conscientiousness}%, Extraversion ${sc.personality.extraversion}%, Agreeableness ${sc.personality.agreeableness}%, Emotional Stability ${sc.personality.emotionalStability}%
- RIASEC Top Codes: ${sc.topRiasec.slice(0, 3).join("-")}
- Learning Style: ${sc.topVark} dominant
- Top Career Values: ${sc.topValues.slice(0, 4).join(", ")}
- Top Career Clusters: ${sc.careerFitment.slice(0, 3).map((c) => `${c.name} (${c.score}%)`).join(", ")}

Return ONLY valid JSON with this exact structure (no markdown):
{
  "summary": "A comprehensive and highly personalized 5-6 sentence career advisory narrative for ${student.name} summarizing key findings and strategic direction",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "growthAreas": ["area 1", "area 2", "area 3"],
  "topCareers": [
    {"name": "Career 1", "description": "A detailed 3-sentence why this fits", "education": "Degree/course", "indianExam": "JEE/NEET/CLAT etc", "salaryRange": "₹X–Y LPA"},
    {"name": "Career 2", "description": "...", "education": "...", "indianExam": "...", "salaryRange": "..."},
    {"name": "Career 3", "description": "...", "education": "...", "indianExam": "...", "salaryRange": "..."},
    {"name": "Career 4", "description": "...", "education": "...", "indianExam": "...", "salaryRange": "..."},
    {"name": "Career 5", "description": "...", "education": "...", "indianExam": "...", "salaryRange": "..."}
  ],
  "indianCounselling": {
    "streamAdvice": "A detailed 4-5 sentence specific stream recommendation and academic track guidance",
    "subjects": ["subject 1", "subject 2", "subject 3"],
    "entranceExams": ["exam 1", "exam 2", "exam 3"],
    "topColleges": ["college 1", "college 2", "college 3", "college 4"]
  },
  "studyAbroad": {
    "rationale": "A comprehensive 4-5 sentence rationale for study abroad tailored specifically to the student's top career clusters",
    "countries": [
      {"flag": "🇺🇸", "name": "United States", "reason": "Detailed 3-sentence reason why the United States is a perfect fit for their top career clusters, outlining research, industry hubs, and academic benefits"},
      {"flag": "🇬🇧", "name": "United Kingdom", "reason": "Detailed 3-sentence reason why the United Kingdom is a perfect fit, including course duration benefits, specific research strengths, and industry networks"},
      {"flag": "🇨🇦", "name": "Canada", "reason": "Detailed 3-sentence reason why Canada is a perfect fit, highlighting its environment, post-study work permits, and university programs"}
    ],
    "scholarships": ["3 prestigious scholarships suitable for their field and country options (e.g., Fulbright Scholarship, Chevening Scholarship, Commonwealth Scholarship, Vanier Scholarship)"],
    "programs": ["3 specific, realistic, and prestigious programmes/degree courses in their target field that they can pursue in these countries (ensure no inaccurate combinations like LLB in the US; suggest BS/BA, Pre-Law, or JD/LLM pathway recommendations instead)"]
  },
  "roadmap": {
    "grade12": {"title": "specific title", "actions": ["action 1", "action 2", "action 3"], "milestone": "milestone"},
    "graduation": {"title": "degree at type of college", "actions": ["action 1", "action 2", "action 3"], "targetDegree": "specific degree", "targetColleges": ["college 1", "college 2"], "milestone": "milestone"},
    "postGrad": {"title": "PG path", "actions": ["action 1", "action 2"], "targetPrograms": ["program 1", "program 2"]},
    "career": {"title": "entry role", "actions": ["action 1", "action 2", "action 3"], "salaryTrajectory": ["Year 1-2: ₹X-Y LPA", "Year 3-5: ₹X-Y LPA", "Year 7+: ₹X LPA+"], "targetCompanies": ["company 1", "company 2"]},
    "studyAbroad": {"title": "abroad path", "actions": ["action 1", "action 2"], "targetUniversities": ["uni 1", "uni 2"], "milestone": "milestone"}
  },
  "actionPlan": {
    "thisMonth": ["Immediate 30-day action step 1 (e.g. subject combination research, baseline diagnostic test)", "Immediate action step 2", "Immediate action step 3", "Immediate action step 4"],
    "thisYear": ["Academic milestone 1 for next 3-12 months", "Academic milestone 2", "Academic milestone 3", "Academic milestone 4"],
    "skills": ["Target core skill 1", "Target core skill 2", "Target core skill 3", "Target core skill 4"],
    "resources": ["Recommended learning resource / platform 1", "Recommended learning resource 2", "Recommended learning resource 3", "Recommended learning resource 4"]
  },
  "psychologicalSummary": {
    "cognitiveProfile": "A detailed 4-5 sentence analysis of their cognitive strengths and processing dynamics based on their score profile",
    "personalityProfile": "A detailed 4-5 sentence analysis of their Big Five personality dimensions and behavioral tendencies",
    "interestProfile": "A detailed 4-5 sentence analysis of their Holland Codes interest themes, environment preferences, and alignment",
    "learningProfile": "A detailed 4-5 sentence analysis of their VARK learning style modalities and personalized study optimization tips",
    "valuesProfile": "A detailed 4-5 sentence analysis of their core career values and motivators",
    "overallPsychProfile": "A detailed 4-5 sentence integrated psychological profile overview and academic advice",
    "psychologistAdvisorPoints": [
      "🧠 Cognitive Processing & Aptitude Alignment: Detailed multi-sentence bullet analyzing reasoning, numerical, spatial, and verbal aptitudes and how they map to learning capacity.",
      "🎭 Behavioral Disposition & Personality Analysis: Detailed multi-sentence bullet on Big Five scores (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability) and behavioral dynamics.",
      "🎯 Vocational Vectors & Holland Code Fit: Detailed multi-sentence bullet on RIASEC interest code mapping to target academic and career environments.",
      "📖 VARK Learning Optimization & Retention: Detailed multi-sentence bullet detailing practical study habits to maximize retention based on VARK modality.",
      "⚠️ Growth Areas & Psychological Risk Mitigation: Detailed multi-sentence bullet addressing low trait scores, procrastination, exam anxiety, or skill gaps with counselor interventions.",
      "💡 Executive Counselor Recommendation: Detailed multi-sentence bullet providing strategic long-term guidance for student and parents."
    ]
  }
}`;

    try {
      const raw = await callAPI([{ role: "user", content: prompt }]);
      const parsed = extractJSON(raw);
      if (parsed && parsed.summary) return sanitizeNarrativeData(parsed);
    } catch (e) {
      console.error("Failed to generate AI narrative, using fallback", e);
    }

    const topCareer = sc.careerFitment[0]?.name || "Software Engineering";
    const n = topCareer.toLowerCase();
    let dynamicPrograms = ["Bachelor of Science (Computer Science)", "Bachelor of Business Administration", "Bachelor of Arts (Economics)"];
    let dynamicScholarships = ["Fulbright Scholarship", "Chevening Scholarship", "Commonwealth Scholarship"];
    let dynamicRationale = `With your strong aptitude profile and ${sc.topRiasec[0] === "I" ? "investigative" : "diverse"} interests, international education can significantly expand your career horizons. Study abroad pathways offer access to cutting-edge research, global networks, and premium career opportunities in ${topCareer}.`;
    let dynamicUSReason = "World-class universities, research opportunities, and diverse career pathways in your field.";
    let dynamicUKReason = "Prestigious institutions, shorter course duration, and strong industry links in your field.";
    let dynamicCAReason = "Quality education, affordable costs, and excellent post-study work opportunities.";

    if (/engineering|software|\bit\b|data|robotics|cyber|petroleum|aerospace|mechanical|electrical|civil/i.test(n)) {
      dynamicPrograms = ["B.S. in Computer Science / Engineering", "M.Sc. in Software Engineering (UK)", "Bachelor of Technology"];
      dynamicScholarships = ["Fulbright Scholarship (US)", "Chevening Scholarship (UK)", "Commonwealth Scholarship (UK/Canada)"];
      dynamicRationale = `Studying abroad can provide ${student.name} with international exposure and access to advanced research facilities and technology hubs, which will elevate their career in ${topCareer}.`;
      dynamicUSReason = "World-class technology universities, Silicon Valley networking, and research programs in computer engineering and science.";
      dynamicUKReason = "Home to historic engineering universities, leading tech hubs, and fast-track Master's degree options.";
      dynamicCAReason = "High-quality engineering programs, vibrant tech startup ecosystems, and generous post-study work permits.";
    } else if (/science|medicine|surgery|pharmacy|bio|dental|agri|environ|pure/i.test(n)) {
      dynamicPrograms = ["Bachelor of Science in Biomedical Sciences", "Pre-Medicine Studies (US)", "M.Sc. in Biotechnology (UK/Canada)"];
      dynamicScholarships = ["Commonwealth Scholarship", "Rhodes Scholarship (UK)", "Erasmus Mundus Scholarship"];
      dynamicRationale = `Studying abroad can provide ${student.name} with hands-on clinical research and state-of-the-art laboratory access, essential for a career in ${topCareer}.`;
      dynamicUSReason = "Leader in global healthcare innovation, clinical research opportunities, and top-tier Pre-Med pathways.";
      dynamicUKReason = "Home to world-class life sciences research facilities and prestigious medical/biomedical degrees.";
      dynamicCAReason = "Highly ranked public health and biomedical sciences research universities with global recognition.";
    } else if (/finance|accounting|audit|business|management|economics|supply|actuarial|international/i.test(n)) {
      dynamicPrograms = ["B.Sc. in Economics & Finance", "Bachelor of Business Administration (BBA)", "M.Sc. in Financial Economics"];
      dynamicScholarships = ["Chevening Scholarship (UK)", "Fulbright Scholarship (US)", "Commonwealth Scholarship (UK/Canada)"];
      dynamicRationale = `Studying abroad can provide ${student.name} with deep insights into global financial markets, international business policies, and prestigious global networking hubs.`;
      dynamicUSReason = "Access to Wall Street hubs, global corporate headquarters, and top-ranked business schools (BBA).";
      dynamicUKReason = "London represents a major global financial center with access to elite economics and management degree programs.";
      dynamicCAReason = "Renowned business schools with cooperative education programs (Co-op) offering direct industry placement.";
    } else if (/law|civil services|governance|social|ngo|education|teaching|nursing|psychology|counsell/i.test(n)) {
      dynamicPrograms = ["LLM in the US or UK", "Master's in Public Health in Canada", "MSc in Economics in the UK or US"];
      dynamicScholarships = ["Fulbright Scholarship", "Chevening Scholarship", "Commonwealth Scholarship"];
      dynamicRationale = `Studying abroad can provide ${student.name} with a broader perspective on their chosen field, especially in law, economics, and public health, where international practices and policies play a significant role. It can also enhance their career prospects by offering a global network and a degree from a prestigious international university.`;
      dynamicUSReason = "World-class universities and a diverse range of programs in law, economics, and public health.";
      dynamicUKReason = "Renowned for its legal and economic systems, and home to some of the world's oldest and most prestigious universities.";
      dynamicCAReason = "Offers a welcoming environment, high standard of living, and excellent universities with programs in public health, law, and economics.";
    }

    const getStreamFallbackData = (str: string) => {
      const s = str.toLowerCase();
      if (s.startsWith("science-pcm")) {
        return {
          subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
          exams: ["JEE Main", "JEE Advanced", "CUET-UG", "BITSAT"],
          colleges: ["IIT Bombay / IIT Delhi", "BITS Pilani", "NIT Trichy", "Delhi Technological University (DTU)"]
        };
      } else if (s.startsWith("science-pcb")) {
        return {
          subjects: ["Physics", "Chemistry", "Biology", "Biotechnology"],
          exams: ["NEET-UG", "CUET-UG", "IISER Aptitude Test (IAT)"],
          colleges: ["AIIMS New Delhi", "Armed Forces Medical College (AFMC)", "Maulana Azad Medical College", "IISc Bangalore"]
        };
      } else if (s.startsWith("science-pcmb")) {
        return {
          subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
          exams: ["JEE Main", "NEET-UG", "CUET-UG", "BITSAT"],
          colleges: ["IITs / NITs", "AIIMS New Delhi", "IISc Bangalore", "BITS Pilani"]
        };
      } else if (s === "commerce") {
        return {
          subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics"],
          exams: ["CUET-UG", "CA Foundation", "IPMAT (IIM Indore)", "SET"],
          colleges: ["SRCC Delhi", "LSR College for Women", "St. Xavier's College Mumbai", "Christ University Bangalore"]
        };
      } else if (s === "humanities") {
        return {
          subjects: ["History", "Political Science", "Sociology", "Psychology"],
          exams: ["CUET-UG", "CLAT (Law)", "NIFT Entrance Exam", "UCEED"],
          colleges: ["Lady Shri Ram College", "St. Stephen's College", "Miranda House Delhi", "National Law School (NLSIU) Bangalore"]
        };
      }
      return {
        subjects: ["Mathematics", "Science / Commerce Core", "Computer Science / Economics"],
        exams: ["JEE Main (Engineering)", "NEET-UG (Medicine)", "CUET (Central Universities)", "CLAT (Law)"],
        colleges: ["IITs / NITs", "Delhi University Colleges", "Christ University", "Symbiosis University"]
      };
    };

    const fallbackData = getStreamFallbackData(student.stream);

    const fallbackGrowth: string[] = [
      "Develop numerical and quantitative skills further",
      "Build leadership and interpersonal confidence",
      "Explore diverse career pathways through structured projects and Olympiads",
    ];
    if (sc.personality.conscientiousness < 35) {
      fallbackGrowth.unshift(`Build study discipline & weekly accountability schedules (Conscientiousness: ${sc.personality.conscientiousness}%)`);
    }

    const fallbackPsychPoints: string[] = [
      `🧠 Cognitive Processing & Aptitude Alignment: ${student.name} demonstrates an overall cognitive aptitude of ${sc.aptitude.overall}%, with relative strength in ${sc.aptitude.verbal >= sc.aptitude.numerical ? "verbal comprehension and linguistic reasoning" : "numerical problem-solving and quantitative logic"}. This profile reflects ${sc.aptitude.overall >= 70 ? "strong intellectual capability for advanced technical studies" : "solid foundational capacity with clear potential for quantitative growth"}.`,
      `🎭 Behavioral Disposition & Personality Breakdown: Big Five psychometric evaluation indicates ${sc.personality.conscientiousness >= 65 ? "high conscientiousness, demonstrating disciplined study habits and goal focus" : `developing conscientiousness (${sc.personality.conscientiousness}%), suggesting structured weekly accountability routines are recommended`}. Openness (${sc.personality.openness}%) indicates ${sc.personality.openness >= 65 ? "strong intellectual curiosity and creative exploration" : "a preference for structured, practical learning frameworks"}.`,
      `🎯 Vocational Vector & RIASEC Holland Code: Dominant Holland code (${sc.topRiasec.slice(0, 3).join("-")}) shows primary alignment with ${sc.topRiasec[0] === "I" ? "investigative and analytical" : sc.topRiasec[0] === "A" ? "artistic and creative" : sc.topRiasec[0] === "R" ? "realistic and practical" : sc.topRiasec[0] === "E" ? "enterprising and leadership" : "social and collaborative"} environments, indicating best long-term fit in ${sc.careerFitment[0]?.name || "target career stream"}.`,
      `📖 VARK Learning Optimization Strategy: As a dominant ${sc.topVark === "V" ? "Visual" : sc.topVark === "A" ? "Auditory" : sc.topVark === "R" ? "Read/Write" : "Kinesthetic"} learner, ${student.name} optimizes memory retention through ${sc.topVark === "V" ? "mind maps, diagrams, and color coding" : sc.topVark === "A" ? "group discussions and audio explanations" : sc.topVark === "R" ? "written summaries and textbook outlining" : "practical drills, hands-on activities, and frequent active revision"}.`,
      `⚠️ Psychological Risk Factors & Mitigation: ${sc.personality.conscientiousness < 40 ? `Conscientiousness score of ${sc.personality.conscientiousness}% indicates risk of task procrastination. Implementing timed Pomodoro study blocks and weekly parent reviews is strongly recommended.` : sc.personality.emotionalStability < 40 ? `Emotional stability score (${sc.personality.emotionalStability}%) indicates vulnerability to exam stress. Incorporating mock exam simulations will build resilience.` : `Focusing on balanced subject preparation and time management during exam cycles will ensure peak performance.`}`,
      `💡 Executive Counselor Guidance: We advise mentors to foster ${student.name}'s core strengths in ${sc.topRiasec[0] === "I" ? "problem-solving" : "creative thinking"} while establishing structured daily routines. Quarterly review of entrance exam preparation will ensure steady progression towards high-priority target milestones.`
    ];

    return sanitizeNarrativeData({
      summary: `${student.name} demonstrates a unique combination of ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic" : sc.topRiasec[0] === "R" ? "realistic" : "social"} interests with strong aptitude scores of ${sc.aptitude.overall}%. Their ${sc.topVark === "V" ? "visual" : sc.topVark === "A" ? "auditory" : sc.topVark === "R" ? "reading/writing" : "kinesthetic"} learning style and emphasis on ${sc.topValues[0] || "creativity"} and ${sc.topValues[1] || "impact"} point strongly towards careers in ${topCareer}. This assessment provides a personalised roadmap to help ${student.name} achieve their full career potential.`,
      strengths: ["Strong analytical and problem-solving abilities", "Natural curiosity and openness to new ideas", "Well-developed verbal and communication skills", "Goal-oriented with structured thinking"],
      growthAreas: fallbackGrowth,
      topCareers: sc.careerFitment.slice(0, 5).map((c, idx) => {
        const isSchoolPhase = assessmentType === "junior" || assessmentType === "grade10";
        const topVal = sc.topValues[0] ? (sc.topValues[0].charAt(0).toUpperCase() + sc.topValues[0].slice(1)) : "Growth";
        return {
          name: c.name,
          description: `${c.name} is your #${idx + 1} fit (fitment score: ${c.score}%), driven by your ${sc.topRiasec.slice(0, 2).join("-")} interest pattern and ${sc.aptitude.overall}% overall cognitive capacity. Your emphasis on ${topVal} work values strongly supports long-term success in this track.`,
          education: isSchoolPhase ? "Class 11 & 12 Stream Selection" : "Relevant Bachelor's Degree (4 years)",
          indianExam: isSchoolPhase ? "Class 10 Board / Foundation Exams" : "JEE Main / CUET / NEET",
          salaryRange: isSchoolPhase ? "N/A (Academic Phase)" : "₹6–25 LPA",
        };
      }),
      indianCounselling: {
        streamAdvice: assessmentType === "grade10"
          ? `Based on your RIASEC profile (${sc.topRiasec.slice(0, 3).join("-")}) and cognitive aptitude (${sc.aptitude.overall}%), we recommend selecting ${sc.careerFitment[0]?.name || "the stream that best matches your cluster fit"} for Class 11 and 12, focusing on subjects aligned with your top career aspirations.`
          : `Based on your RIASEC profile (${sc.topRiasec.slice(0, 3).join("-")}) and aptitude scores, we recommend continuing your academic track in the ${getStreamLabel(student.stream, assessmentType)} stream with focus on subjects aligning with ${sc.careerFitment[0]?.name || "your top career clusters"}.`,
        subjects: fallbackData.subjects,
        entranceExams: fallbackData.exams,
        topColleges: fallbackData.colleges,
      },
      studyAbroad: {
        rationale: dynamicRationale,
        countries: [
          { flag: "🇺🇸", name: "United States", reason: dynamicUSReason },
          { flag: "🇬🇧", name: "United Kingdom", reason: dynamicUKReason },
          { flag: "🇨🇦", name: "Canada", reason: dynamicCAReason },
        ],
        scholarships: dynamicScholarships,
        programs: dynamicPrograms,
      },
      roadmap: {
        grade12: {
          title: (assessmentType === "junior")
            ? "High School Preparation & Stream Selection"
            : (assessmentType === "grade10")
            ? "Class 10 Board Exams & Stream Planning"
            : "High School Graduation & Entrance Exams",
          actions: (assessmentType === "junior")
            ? ["Focus on building strong conceptual foundations in Math, Science, and Social Studies", "Explore various interest areas to align with future stream choice (PCM/PCB/Commerce/Arts)", "Participate in school activities and build communication skills"]
            : (assessmentType === "grade10")
            ? ["Master Grade 10 board exam concepts thoroughly", "Evaluate stream options (Science, Commerce, Arts) based on interest inventory", "Engage in early profile building and co-curricular projects"]
            : ["Focus on core subjects for target entrance exams (JEE, NEET, CUET, CLAT)", "Begin intensive competitive exam preparation", "Join relevant clubs, research groups, and national Olympiads"],
          milestone: (assessmentType === "junior")
            ? "Choose best-fit stream for Class 11"
            : (assessmentType === "grade10")
            ? "Score 90%+ in Class 10 Boards and select best stream"
            : "Score 85%+ in Grade 12 boards and clear entrance exams"
        },
        graduation: { title: "Pursue Targeted Degree", actions: ["Enrol in best-fit programme", "Build internship experience from Year 2", "Develop professional portfolio"], targetDegree: "B.Tech / B.Sc / BBA (relevant stream)", targetColleges: ["IIT / NIT / DU Colleges", "Private universities with good placement"], milestone: "Graduate with internship experience" },
        postGrad: { title: "Specialise & Grow", actions: ["Pursue Masters or professional certification", "Build leadership experience", "Expand professional network"], targetPrograms: ["M.Tech / MBA / MA (specialised)", "PG Diploma in relevant field"] },
        career: { title: "Launch Your Career", actions: ["Start in entry-level role", "Build 2–3 years of strong domain experience", "Target senior role by Year 5"], salaryTrajectory: ["Year 1-2: ₹6–10 LPA", "Year 3-5: ₹12–18 LPA", "Year 7+: ₹20–35 LPA"], targetCompanies: ["Top firms in your target sector", "MNCs with strong India presence"] },
        studyAbroad: { title: "Global Education Pathway", actions: ["Prepare GRE/GMAT/IELTS", "Apply to target universities", "Secure scholarships"], targetUniversities: ["Top 100 QS Ranked Universities", "Specialised research universities"], milestone: "Gain admission with scholarship" },
      },
      actionPlan: {
        thisMonth: [
          `Research top stream options & subject combinations for ${sc.careerFitment[0]?.name || "your target field"}`,
          `Create a weekly study schedule incorporating ${VARK_TIPS[sc.topVark]?.[0] || "spaced revision"} techniques`,
          `Take a diagnostic baseline practice test for target entrance exams`,
          `Schedule a family academic review session to map out Class 11/12 strategy`
        ],
        thisYear: [
          `Maintain high academic consistency (target 85%+ in school term examinations)`,
          `Complete 1 hands-on project or Olympiad competition in your primary interest area`,
          `Build an academic portfolio documenting projects, certifications, and extra-curriculars`,
          `Attend 2 university webinar sessions or career workshops in target domains`
        ],
        skills: [
          "Analytical Problem Solving & Logic",
          "Speed Reading & Critical Comprehension",
          "Time Management & Study Discipline",
          "Verbal Articulation & Presentation"
        ],
        resources: [
          "Khan Academy (Free conceptual foundation courses)",
          "Coursera / edX (Introductory university-level modules)",
          "Anki / Quizlet (Spaced repetition study decks)",
          "CLARVO Advisory Portal (Career roadmap guidance)"
        ],
      },
      psychologicalSummary: {
        cognitiveProfile: `${student.name} shows an aptitude score of ${sc.aptitude.overall}%, with particular strength in ${sc.aptitude.verbal >= sc.aptitude.numerical ? "verbal" : "numerical"} domains. This cognitive profile indicates strong ${sc.aptitude.overall >= 70 ? "above-average" : "developing"} analytical abilities well-suited for ${sc.careerFitment[0]?.name || "technical"} careers.`,
        personalityProfile: `The Big Five profile reveals ${sc.personality.openness >= 65 ? "high openness to experience, suggesting creative and intellectual curiosity" : "moderate openness with a preference for structured, practical approaches"}. ${sc.personality.conscientiousness >= 65 ? "Strong conscientiousness indicates excellent discipline and goal orientation" : "Developing conscientiousness skills will strengthen career performance"}.`,
        interestProfile: `With a dominant RIASEC profile of ${sc.topRiasec.slice(0, 3).join("-")}, ${student.name} shows strongest alignment with ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic and creative" : sc.topRiasec[0] === "R" ? "realistic and hands-on" : "social and people-oriented"} career fields.`,
        learningProfile: `${student.name} is a predominantly ${sc.topVark === "V" ? "Visual" : sc.topVark === "A" ? "Auditory" : sc.topVark === "R" ? "Reading/Writing" : "Kinesthetic"} learner. ${VARK_TIPS[sc.topVark]?.[0] || "Adapting study strategies to this style"} will maximise academic performance.`,
        valuesProfile: `Career values analysis reveals strong emphasis on ${sc.topValues.slice(0, 3).join(", ")}. These values suggest ${sc.topValues[0] === "creativity" ? "creative and innovative environments will be most fulfilling" : sc.topValues[0] === "financial" ? "financially rewarding careers in high-growth sectors" : sc.topValues[0] === "helping" ? "service-oriented and social impact careers will bring greatest satisfaction" : "leadership and achievement-oriented career paths"}.`,
        overallPsychProfile: `${student.name}'s integrated psychometric profile presents a ${sc.aptitude.overall >= 70 ? "cognitively strong" : "developing"} individual with ${sc.personality.openness >= 65 ? "creative" : "structured"} personality traits and ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic" : "practical"} career interests. The combination of ${sc.topValues[0] || "achievement"}-driven values and ${sc.topVark === "V" ? "visual" : sc.topVark === "K" ? "kinesthetic" : "reading-based"} learning preferences creates a distinctive career profile most aligned with ${sc.careerFitment[0]?.name || "technology and innovation"} fields. With focused guidance, structured skill development, and strategic career planning, ${student.name} is well-positioned to achieve exceptional outcomes.`,
        psychologistAdvisorPoints: fallbackPsychPoints,
      },
    });
  }

  // ── Career roadmap modal ───────────────────────────────────────────────────
  async function openCareerRoadmap(idx: number) {
    if (!reportData) return;
    setSelectedCareerIdx(idx);
    setCrmOpen(true);
    setCrmLoading(true);
    setCrmData(null);

    const career = reportData.topCareers?.[idx];
    if (!career) { setCrmOpen(false); return; }

    if (allCrmData[idx]) {
      setCrmData(allCrmData[idx]);
      setCrmLoading(false);
      return;
    }

    try {
      const roadmapGradeContext = assessmentType === "junior"
        ? "Note: The student is in middle school (Grade 7-9). Tailor Stage 1 of the stages array to cover High School Preparation & Stream Selection (Grade 10/11/12), recommending actions to prepare for the appropriate stream choice."
        : assessmentType === "grade10"
        ? "Note: The student is in Grade 10. Tailor Stage 1 of the stages array to cover stream selection, early profile building, and high school foundation skills."
        : `Note: The student is in Grade 11 or 12. Tailor Stage 1 of the stages array to cover Board Exams and Entrance Exams prep tailored to the student's stream: ${student.stream}.`;

      const prompt = `You are a senior Indian career counsellor. Generate a detailed career roadmap for ${student.name}, Grade ${student.grade}, who wants to pursue "${career.name}". Their profile: Aptitude ${scores?.aptitude?.overall || 'N/A'}%, RIASEC ${scores?.topRiasec?.join("-") || 'N/A'}, Top values: ${scores?.topValues?.slice(0, 3).join(", ") || 'N/A'}, Learning style: ${scores?.topVark || 'N/A'}, City: ${student.city || "India"}.
${roadmapGradeContext}
Return ONLY valid JSON: {"overview":"2-3 sentence personalised description","duration":"e.g. 4+2 years","avgSalary":"e.g. ₹8–25 LPA","fitScore":"e.g. 92%","stages":[{"stage":"label","icon":"emoji","title":"title","actions":["action 1","action 2","action 3"],"milestone":"milestone","targetColleges":["college 1","college 2"]},{"stage":"Graduation","icon":"🎓","title":"degree","actions":["action 1","action 2"],"milestone":"milestone"},{"stage":"Post-Graduation","icon":"📜","title":"PG path","actions":["action 1","action 2"],"targetPrograms":["programme 1"]},{"stage":"Early Career","icon":"💼","title":"role","actions":["action 1","action 2","action 3"],"milestone":"milestone","salaryTrajectory":["Year 1-2: ₹X LPA","Year 3-5: ₹Y LPA"],"targetCompanies":["company 1","company 2"]}],"keyExams":["exam 1","exam 2","exam 3"],"keySkills":["skill 1","skill 2","skill 3"],"topColleges":["college 1","college 2","college 3"],"scholarships":["scholarship 1","scholarship 2"],"dayInLife":"2-3 sentences about typical day"}`;

      const raw = await callAPI([{ role: "user", content: prompt }]);
      const rm = extractJSON(raw);
      if (rm && rm.stages) {
        setCrmData({ career, roadmap: rm });
      } else throw new Error("invalid");
    } catch {
      // Fallback
      const rm = {
        overview: `${career?.description || ''} With your aptitude of ${scores?.aptitude?.overall || '80'}% and ${career?.name || 'this'} aligned profile, this is one of your strongest career fits.`,
        duration: "4–6 years", avgSalary: career?.salaryRange || "Competitive", fitScore: Math.min(99, (scores?.careerFitment?.[0]?.score || 85)) + "%",
        stages: [
          { stage: `Grade ${student?.grade || '11'}–12`, icon: "📚", title: "Build Foundations", actions: [`Focus on subjects relevant to ${career?.name || 'this field'}`, "Explore related extracurriculars", `Research entrance exam: ${career?.indianExam || 'Relevant Exams'}`], milestone: "Score 85%+ in boards" },
          { stage: "Graduation", icon: "🎓", title: career?.education || "Undergrad Degree", actions: [`Enrol in ${career?.education || 'a relevant degree'}`, "Intern from Year 2", "Build portfolio"], milestone: "Graduate with internship", targetColleges: [`Top colleges for ${career?.name || 'this field'} in India`] },
          { stage: "Post-Graduation", icon: "📜", title: "Specialisation", actions: ["Pursue relevant Masters", "Clear advanced exams", "Build expertise"], milestone: "Land mid-level role" },
          { stage: "Early Career", icon: "💼", title: "Launch Career", actions: [`Start in ${career?.name || 'this field'}`, "Build domain experience", "Target senior role"], milestone: "₹15-20 LPA by Year 5", salaryTrajectory: ["Year 1-2: Entry level", "Year 3-5: Mid-level"], targetCompanies: [`Top firms in ${career?.name || 'this field'}`] },
        ],
        keyExams: [career?.indianExam || 'Relevant Exams', "CUET", "IELTS/TOEFL for abroad"],
        keySkills: ["Communication", "Critical Thinking", "Domain Knowledge", "Networking"],
        topColleges: [`Top colleges for ${career?.education || 'this field'}`],
        scholarships: ["National Merit Scholarship", "Chevening (UK)", "Fulbright (US)"],
        dayInLife: `Professionals in ${career?.name || 'this field'} work on a mix of strategic and hands-on tasks involving ${career?.description?.split(".")?.[0]?.toLowerCase() || 'their domain'}.`,
      };
      setCrmData({ career, roadmap: rm });
    }
    setCrmLoading(false);
  }

  // ── Charts ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    let timerId: NodeJS.Timeout;

    if (screen === "report" && scores) {
      const checkAndRender = () => {
        if (!active) return;
        const win = window as any;
        if (win.Chart && document.getElementById("ch-apt")) {
          renderCharts(scores);
        } else {
          timerId = setTimeout(checkAndRender, 100);
        }
      };
      
      checkAndRender();
    }

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [screen, scores]);

  function renderCharts(sc: Scores, forceLight = false) {
    const win = window as any;
    if (!win.Chart) return;
    const Chart = win.Chart;

    const isDark = false;
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
    const textColor = isDark ? "#cbd5e1" : "#475569";
    const labelFont = { family: "Poppins, sans-serif", size: 12, weight: "600" };
    const tickFont = { family: "Poppins, sans-serif", size: 11 };

    function mkChart(id: string, type: string, data: any, opts: any) {
      const el = (document.getElementById(id) as HTMLCanvasElement)?.getContext("2d");
      if (!el) return;
      if (chartInstRef.current[id]) chartInstRef.current[id].destroy();
      chartInstRef.current[id] = new Chart(el, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...opts
        }
      });
    }

    mkChart("ch-apt", "radar", {
      labels: ["Verbal", "Numerical", "Reasoning", "Spatial"],
      datasets: [{ label: "Aptitude", data: [sc.aptitude.verbal, sc.aptitude.numerical, sc.aptitude.reasoning, sc.aptitude.spatial], backgroundColor: "rgba(105,11,27,.15)", borderColor: "#690B1B", pointBackgroundColor: "#690B1B", borderWidth: 2, pointRadius: 5 }],
    }, {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: labelFont }
        }
      },
      plugins: { legend: { display: false } }
    });

    mkChart("ch-per", "bar", {
      labels: ["Openness", "Conscientious", "Extraversion", "Agreeableness", "Stability"],
      datasets: [{ data: [sc.personality.openness, sc.personality.conscientiousness, sc.personality.extraversion, sc.personality.agreeableness, sc.personality.emotionalStability], backgroundColor: ["#7E3AF2CC", "#057A55CC", "#690B1BCC", "#C9A55DCC", "#0694A2CC"], borderRadius: 8, borderWidth: 0 }],
    }, {
      indexAxis: "y",
      scales: {
        x: { min: 0, max: 100, ticks: { color: textColor, font: tickFont }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: labelFont }, grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    });

    mkChart("ch-ria", "radar", {
      labels: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
      datasets: [{ label: "RIASEC", data: [sc.riasec.R, sc.riasec.I, sc.riasec.A, sc.riasec.S, sc.riasec.E, sc.riasec.C], backgroundColor: "rgba(5,122,85,.15)", borderColor: "#057A55", pointBackgroundColor: "#057A55", borderWidth: 2, pointRadius: 5 }],
    }, {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: labelFont }
        }
      },
      plugins: { legend: { display: false } }
    });

    mkChart("ch-vk", "doughnut", {
      labels: ["Visual", "Auditory", "Read/Write", "Kinesthetic"],
      datasets: [{ data: [sc.vark.V, sc.vark.A, sc.vark.R, sc.vark.K], backgroundColor: ["#690B1B", "#7E3AF2", "#057A55", "#C9A55D"], borderWidth: 0, spacing: 4 }],
    }, {
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 16, color: textColor, font: labelFont }
        }
      }
    });

    const sv = Object.entries(sc.values).sort((a, b) => b[1] - a[1]).slice(0, 6);
    mkChart("ch-val", "bar", {
      labels: sv.map((v) => v[0].charAt(0).toUpperCase() + v[0].slice(1)),
      datasets: [{ data: sv.map((v) => v[1]), backgroundColor: ["#690B1BCC", "#7E3AF2CC", "#057A55CC", "#C9A55DCC", "#0694A2CC", "#690B1BAA"], borderRadius: 8, borderWidth: 0 }],
    }, {
      scales: {
        y: { min: 0, max: 100, ticks: { color: textColor, font: tickFont }, grid: { color: gridColor } },
        x: { ticks: { color: textColor, font: labelFont }, grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    });
  }

  // ── PDF Download ───────────────────────────────────────────────────────────
  async function downloadPDF(reportType: 'full' | 'executive' = 'full') {
    if (!student.name || !scores || !reportData) {
      showToast("Please complete the assessment first");
      return;
    }

    const resolvedVariant = resolveReportVariant(assessmentType, student.grade);
    const variantConfig = getVariantConfig(resolvedVariant);
    const isExec = reportType === 'executive';

    showToast(isExec 
      ? `Downloading ${variantConfig.editionName} 15-Page Career Summary PDF...` 
      : `Downloading ${variantConfig.editionName} 56-Page Full Diagnostic PDF...`
    );

    const defaultAge = resolvedVariant === 'junior' ? '13' : resolvedVariant === 'senior' ? '17' : '15';
    const rawGrade = student.grade || variantConfig.defaultGradeLabel;
    const formattedGrade = rawGrade.toLowerCase().includes('class') || rawGrade.toLowerCase().includes('grade') ? rawGrade : `Class ${rawGrade}`;

    const editorialStudent: EditorialStudent = {
      name: student.name || 'Candidate',
      grade: formattedGrade,
      age: student.age || defaultAge,
      school: student.school || '',
      city: student.city || 'India',
      stream: student.stream || '',
      email: student.email || '',
      date: student.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      reportId: (reportData?.id || reportData?.resultId || `${variantConfig.reportIdPrefix}-${Math.floor(100000 + Math.random() * 900000)}`).toString().toUpperCase(),
      parentName: student.parentName || '',
    };

    try {
      const targetResultId = 
        reportData?.id || 
        reportData?.resultId || 
        searchParams.get('resultId') || 
        searchParams.get('id') || 
        (student as any).id || 
        (student as any).reportId || 
        '';

      console.log(`[PDF DOWNLOAD] mode=${isExec ? 'EXECUTIVE_SUMMARY' : 'FULL'} variant=${resolvedVariant} reportId=${targetResultId} source=SAVED_SNAPSHOT groq=false navigation=false`);

      const res = await fetch('/api/psychometric-test/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resultId: targetResultId,
          reportType: reportType,
          assessmentType: resolvedVariant,
          variant: resolvedVariant,
          student: editorialStudent,
          scores: scores
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server failed to generate PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filePrefix = (student.name || 'Candidate').replace(/\s+/g, '_');
      const variantTag = resolvedVariant === 'junior' ? 'Junior' : resolvedVariant === 'senior' ? 'Class12' : 'Class10';
      a.download = isExec
        ? `${filePrefix}_${variantTag}_Executive_Career_Summary.pdf`
        : `${filePrefix}_${variantTag}_Full_Psychometric_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(isExec ? "Executive Career Summary PDF downloaded successfully!" : "Full Psychometric Report PDF downloaded successfully!");
    } catch (e: any) {
      console.error("Direct Chromium PDF generation error:", e);
      showToast(`PDF Export Notice: ${e.message || 'Generation failed'}`);
    }
  }

  // ── Restart ────────────────────────────────────────────────────────────────
  function restartApp() {
    window.location.href = '/psychometric-test';
  }

  // ─── Render helpers ────────────────────────────────────────────────────────
  const rn: Record<string, string> = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
  const vn: Record<string, string> = { V: "Visual", A: "Auditory", R: "Reading/Writing", K: "Kinesthetic" };

  const currentQ = questions ? questions.sections[currentSection]?.questions[currentQIdx] : null;
  const totalQ = getTotalQuestions();
  const answeredQ = getTotalAnswered();
  const progress = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;

  const likertEmojis = ["😞", "😕", "😐", "🙂", "😄"];
  const likertLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

  function buildSecExplain(secIdx: number) {
    const meta = SEC_META[secIdx];
    return (
      <div className="as-sec-explain">
        <div className="as-sec-explain-head">
          <div className="as-sec-explain-icon">{renderIcon(meta.icon, 48, "")}</div>
          <div className="as-sec-explain-title">
            <h3>{meta.name}</h3>
            <p>{meta.desc}</p>
          </div>
        </div>
        <div className="as-sec-explain-body">{meta.why}</div>
        <div className="as-sec-explain-why">
          <h4>🎯 Why This Section Matters For Your Career</h4>
          <ul>{meta.whyPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      </div>
    );
  }

  function buildQReview(secIdx: number) {
    if (!questions || !scores) return null;
    const sec = questions.sections[secIdx];
    const meta = SEC_META[secIdx];
    const isMCQ = sec.type === "mcq";
    const isLikert = sec.type === "likert";
    const qOffset = questions.sections.slice(0, secIdx).reduce((a, s) => a + s.questions.length, 0);

    return (
      <div className="as-q-review-box">
        <h3>📋 {student.name}'s Responses — {meta.name}</h3>
        <div className="as-q-list">
          {sec.questions.map((q, i) => {
            const ans = answers[q.id];
            const ansText = ans !== undefined ? (isLikert ? likertLabels[ans] : q.options[ans]) : "Not answered";
            let badgeClass = "neutral";
            if (isMCQ && ans !== undefined) badgeClass = ans === q.correct ? "correct" : "wrong";
            else if (isLikert && ans !== undefined) badgeClass = ans + 1 >= 4 ? "correct" : ans + 1 === 3 ? "neutral" : "wrong";
            const traitLabel = q.trait ? q.trait.charAt(0).toUpperCase() + q.trait.slice(1) : "";
            return (
              <div className="as-q-item" key={q.id}>
                <div className="as-q-item-num">Q{qOffset + i + 1} · {traitLabel}</div>
                <div className="as-q-item-text">{q.text}</div>
                <div className="as-q-item-ans"><span className={`badge ${badgeClass}`}>{ansText}{isMCQ && ans !== undefined && ans !== q.correct ? ` ✗ (Correct: ${q.options[q.correct]})` : ""}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className={`assessment-root`} style={{ minHeight: "100vh", flexDirection: "column" }}>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js" strategy="afterInteractive" onLoad={() => setChartReady(true)} />

      {/* ── LANDING SCREEN (REBUILT LONG-FORM EDITORIAL LANDING PAGE) ── */}
      {screen === "landing" && (() => {
        const activeVariant: VariantId = 
          assessmentType === "junior" ? "7-9" : 
          assessmentType === "grade10" ? "10" : "12";

        const isEligible = userAccess ? (
          (activeVariant === '7-9' && userAccess.eligibleVariant === 'JUNIOR_7_9') ||
          (activeVariant === '10' && userAccess.eligibleVariant === 'CLASS_10') ||
          (activeVariant === '12' && userAccess.eligibleVariant === 'SENIOR_12')
        ) : true;

        const landingEligibility: LandingEligibility | undefined = userAccess ? {
          isEligible,
          studentGradeLabel: userAccess.gradeLabel || (userAccess.grade ? `Grade ${userAccess.grade}` : undefined),
          targetDescription: userAccess.eligibleAssessment?.targetDescription,
          eligibleHref: userAccess.eligibleHref,
          eligibleTestName: userAccess.eligibleTestName,
          status: userAccess.status,
        } : undefined;
        
        return (
          <PsychometricLandingPage 
            variant={activeVariant} 
            existingResultId={existingResult?.resultId}
            existingResultDate={existingResult?.createdAt}
            onStart={() => {
              if (userAccess && userAccess.status === "PROFILE_INCOMPLETE") {
                showToast("Please complete your grade in your profile first to unlock your psychometric assessment.");
                setTimeout(() => {
                  window.location.href = "/dashboard/student/update-profile";
                }, 1500);
                return;
              }
              if (landingEligibility && !landingEligibility.isEligible) {
                showToast(`Your registered grade is ${userAccess.gradeLabel || userAccess.grade}. Please take the ${userAccess.eligibleTestName || 'assigned assessment'}.`);
                if (userAccess.eligibleHref) {
                  setTimeout(() => {
                    window.location.href = userAccess.eligibleHref;
                  }, 1500);
                }
                return;
              }
              setShowTerms(true);
            }} 
            eligibility={landingEligibility}
          />
        );
      })()}

      {/* ── DETAILS SCREEN ─────────────────────────────────────────── */}
      {screen === "details" && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          <div className="as-stream-section" style={{ padding: "40px 24px 80px" }}>
            {streamStep === 'main' && (
              <>
                <div className="as-stream-hd" style={{ marginBottom: "36px" }}>
                  <button className="as-stream-back-btn" onClick={() => setScreen('landing')}>
                    ← Back to landing
                  </button>
                  <div className="as-stream-hd-badge">🎓 Step 1 of 2</div>
                  <h2>Which stream are you in?</h2>
                  <p>Choose your academic pathway. We'll customize the psychometric assessment questions to fit your stream.</p>
                </div>

                <div className="as-stream-grid">
                  {/* Science */}
                  <div className="as-stream-card" data-stream="science" onClick={() => setStreamStep('science')}>
                    <div className="as-stream-card-glow" />
                    <div className="as-stream-card-top">
                      <div className="as-stream-card-icon" style={{ background: 'linear-gradient(135deg,#690B1B,#A01428)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v4.615l-5.615 9.4A2 2 0 0 0 5 21h14a2 2 0 0 0 1.615-3.985L15 7.615V3"></path><path d="M9 3h6"></path><path d="M5.5 16h13"></path></svg>
                      </div>
                      <div className="as-stream-card-arrow">›</div>
                    </div>
                    <div className="as-stream-card-name">Science</div>
                    <div className="as-stream-card-sub">Physics · Chemistry · Maths / Biology</div>
                    <div className="as-stream-card-desc">Engineering, Medical, Research, and Technology tracks tailored to your subjects.</div>
                    <div className="as-stream-card-tags">
                      <span className="as-stream-tag" style={{ background:'rgba(105,11,27,.1)', color:'#690B1B' }}>PCM</span>
                      <span className="as-stream-tag" style={{ background:'rgba(105,11,27,.1)', color:'#690B1B' }}>PCB</span>
                      <span className="as-stream-tag" style={{ background:'rgba(105,11,27,.1)', color:'#690B1B' }}>PCMB</span>
                    </div>
                    <div className="as-stream-card-cta">Select Stream →</div>
                  </div>

                  {/* Commerce */}
                  <div className="as-stream-card" data-stream="commerce" onClick={() => startAssessmentWithStream('commerce')}>
                    <div className="as-stream-card-glow" />
                    <div className="as-stream-card-top">
                      <div className="as-stream-card-icon" style={{ background: 'linear-gradient(135deg,#057A55,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
                      </div>
                      <div className="as-stream-card-arrow">›</div>
                    </div>
                    <div className="as-stream-card-name">Commerce</div>
                    <div className="as-stream-card-sub">Accountancy · Economics · Business Studies</div>
                    <div className="as-stream-card-desc">Finance, Business Administration, CA, MBA, and Entrepreneurship pathways.</div>
                    <div className="as-stream-card-tags">
                      <span className="as-stream-tag" style={{ background:'rgba(5,122,85,.1)', color:'#057A55' }}>Finance</span>
                      <span className="as-stream-tag" style={{ background:'rgba(5,122,85,.1)', color:'#057A55' }}>CA / MBA</span>
                      <span className="as-stream-tag" style={{ background:'rgba(5,122,85,.1)', color:'#057A55' }}>CUET</span>
                    </div>
                    <div className="as-stream-card-cta">Select Stream →</div>
                  </div>

                  {/* Arts / Humanities */}
                  <div className="as-stream-card" data-stream="humanities" onClick={() => startAssessmentWithStream('humanities')}>
                    <div className="as-stream-card-glow" />
                    <div className="as-stream-card-top">
                      <div className="as-stream-card-icon" style={{ background: 'linear-gradient(135deg,#7E3AF2,#9B5FFC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 1 10-10c0 1.1-.9 2-2 2h-1c-.55 0-1 .45-1 1v1c0 1.1-.9 2-2 2H12z"></path><circle cx="7.5" cy="10.5" r=".5" fill="white"></circle><circle cx="10.5" cy="6.5" r=".5" fill="white"></circle><circle cx="14.5" cy="6.5" r=".5" fill="white"></circle><circle cx="17.5" cy="10.5" r=".5" fill="white"></circle></svg>
                      </div>
                      <div className="as-stream-card-arrow">›</div>
                    </div>
                    <div className="as-stream-card-name">Arts &amp; Humanities</div>
                    <div className="as-stream-card-sub">History · Sociology · Law · Literature</div>
                    <div className="as-stream-card-desc">Law, Journalism, Design, Liberal Arts, and Civil Services pathways.</div>
                    <div className="as-stream-card-tags">
                      <span className="as-stream-tag" style={{ background:'rgba(126,58,242,.1)', color:'#7E3AF2' }}>Law</span>
                      <span className="as-stream-tag" style={{ background:'rgba(126,58,242,.1)', color:'#7E3AF2' }}>Design</span>
                      <span className="as-stream-tag" style={{ background:'rgba(126,58,242,.1)', color:'#7E3AF2' }}>Civil Services</span>
                    </div>
                    <div className="as-stream-card-cta">Select Stream →</div>
                  </div>
                </div>

                <div className="as-stream-footer-note">
                  <span>💡</span> Choosing a stream helps the AI recommend specialized subjects and entrance roadmaps.
                </div>
              </>
            )}

            {streamStep === 'science' && (
              <>
                <div className="as-stream-hd" style={{ marginBottom: "36px" }}>
                  <button className="as-stream-back-btn" onClick={() => setStreamStep('main')}>
                    ← Back to streams
                  </button>
                  <div className="as-stream-hd-badge" style={{ background:'rgba(105,11,27,.08)', color:'#690B1B' }}>🔬 Step 2 of 2</div>
                  <h2>Choose your <span style={{ color:'#690B1B' }}>Science</span> combination</h2>
                  <p>Your subject combination determines your entrance exam eligibility and engineering/medical roadmap.</p>
                </div>

                <div className="as-stream-sub-grid">
                  {/* PCM */}
                  <div className="as-stream-sub-card" onClick={() => startAssessmentWithStream('science-pcm')}>
                    <div className="as-stream-sub-card-glow" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(105,11,27,.12), transparent 60%)' }} />
                    <div className="as-stream-sub-header">
                      <div className="as-stream-sub-icon" style={{ background:'linear-gradient(135deg,#690B1B,#A01428)', boxShadow:'0 8px 24px rgba(105,11,27,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                      </div>
                      <div className="as-stream-sub-badge" style={{ background:'rgba(105,11,27,.1)', color:'#690B1B' }}>PCM</div>
                    </div>
                    <div className="as-stream-sub-name">Physics, Chemistry &amp; Mathematics</div>
                    <div className="as-stream-sub-subjects">
                      <span>📐 Physics</span><span>⚗️ Chemistry</span><span>📏 Mathematics</span>
                    </div>
                    <div className="as-stream-sub-desc">IIT/NIT, Engineering, B.Tech, Data Science, and Architecture tracks.</div>
                    <div className="as-stream-sub-exams">
                      <div className="as-stream-sub-exams-lbl">Entrance Exams Focus</div>
                      <div className="as-stream-sub-exam-tags">
                        <span>JEE Main</span><span>JEE Adv</span><span>CUET</span><span>CETs</span>
                      </div>
                    </div>
                    <div className="as-stream-sub-cta" style={{ color:'#690B1B' }}>Start PCM Assessment →</div>
                  </div>

                  {/* PCB */}
                  <div className="as-stream-sub-card" onClick={() => startAssessmentWithStream('science-pcb')}>
                    <div className="as-stream-sub-card-glow" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(5,122,85,.12), transparent 60%)' }} />
                    <div className="as-stream-sub-header">
                      <div className="as-stream-sub-icon" style={{ background:'linear-gradient(135deg,#057A55,#059669)', boxShadow:'0 8px 24px rgba(5,122,85,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      </div>
                      <div className="as-stream-sub-badge" style={{ background:'rgba(5,122,85,.1)', color:'#057A55' }}>PCB</div>
                    </div>
                    <div className="as-stream-sub-name">Physics, Chemistry &amp; Biology</div>
                    <div className="as-stream-sub-subjects">
                      <span>📐 Physics</span><span>⚗️ Chemistry</span><span>🧬 Biology</span>
                    </div>
                    <div className="as-stream-sub-desc">MBBS, BDS, Bio-technology, Pharmacy, and Healthcare career pathways.</div>
                    <div className="as-stream-sub-exams">
                      <div className="as-stream-sub-exams-lbl">Entrance Exams Focus</div>
                      <div className="as-stream-sub-exam-tags">
                        <span>NEET-UG</span><span>AIIMS</span><span>CUET</span><span>IISER</span>
                      </div>
                    </div>
                    <div className="as-stream-sub-cta" style={{ color:'#057A55' }}>Start PCB Assessment →</div>
                  </div>

                  {/* PCMB */}
                  <div className="as-stream-sub-card" onClick={() => startAssessmentWithStream('science-pcmb')}>
                    <div className="as-stream-sub-card-glow" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(201,165,93,.14), transparent 60%)' }} />
                    <div className="as-stream-sub-header">
                      <div className="as-stream-sub-icon" style={{ background:'linear-gradient(135deg,#C9A55D,#D4AF37)', boxShadow:'0 8px 24px rgba(201,165,93,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                      </div>
                      <div className="as-stream-sub-badge" style={{ background:'rgba(201,165,93,.15)', color:'#8B6914' }}>PCMB</div>
                    </div>
                    <div className="as-stream-sub-name">Physics, Chemistry, Math &amp; Biology</div>
                    <div className="as-stream-sub-subjects">
                      <span>📐 Physics</span><span>⚗️ Chemistry</span><span>📏 Math</span><span>🧬 Bio</span>
                    </div>
                    <div className="as-stream-sub-desc">Dual options open for both medical research and engineering pathways.</div>
                    <div className="as-stream-sub-exams">
                      <div className="as-stream-sub-exams-lbl">Entrance Exams Focus</div>
                      <div className="as-stream-sub-exam-tags">
                        <span>JEE Main</span><span>NEET-UG</span><span>CUET</span><span>IISER</span>
                      </div>
                    </div>
                    <div className="as-stream-sub-cta" style={{ color:'#8B6914' }}>Start PCMB Assessment →</div>
                  </div>
                </div>

                <div className="as-stream-footer-note">
                  <span>💡</span> All streams map your cognitive aptitude, RIASEC interest clusters, learning style, and core career values.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LOADING QUESTIONS SCREEN ────────────────────────────────── */}
      {screen === "loading-q" && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className="as-load-screen">
            <div className="as-ring" />
            <div className="as-load-title">Building Your Assessment</div>
            <div className="as-load-sub">Connecting to AI engine…</div>
            <div className="as-load-steps">
              {["🧠 Generating Aptitude Questions", "🌟 Crafting Personality Questions", "🎯 Building Interest Inventory", "📚 Creating Learning Style Questions", "💼 Finalizing Career Values Questions"].map((label, i) => (
                <div key={i} className={`as-lstep${loadSteps[i] === 1 ? " active" : loadSteps[i] === 2 ? " done" : ""}`}>{label}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── QUESTIONS SCREEN ───────────────────────────────────────── */}
      {screen === "questions" && questions && currentQ && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className="as-q-header">
            <div className="as-q-hd-inner">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button onClick={() => setScreen("landing")} className="as-btn-nav" style={{ padding: '8px 16px', fontSize: '13px' }}>← Home</button>
                <div className="as-q-sec-info">
                  <div className="as-q-sec-icon">{questions.sections[currentSection].icon}</div>
                  <div>
                    <div className="as-q-sec-lbl">SECTION {currentSection + 1} OF 5</div>
                    <div className="as-q-sec-name">{questions.sections[currentSection].name}</div>
                  </div>
                </div>
              </div>
              <div className="as-q-prog-info">Q {answeredQ + 1} / {totalQ}</div>
            </div>
            <div className="as-prog-wrap"><div className="as-prog-fill" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="as-q-body">
            <div className="as-q-tip">💡 Take your time — there are no right or wrong answers in most sections.</div>
            <div className="as-q-card">
              <div className="as-q-num">QUESTION {answeredQ + 1} · {currentQ.trait?.toUpperCase()}</div>
              <div className="as-q-text">{currentQ.text}</div>

              {/* ── SYMBOL PATTERN ─────────────────────────────── */}
              {currentQ.questionType === 'symbol-pattern' && currentQ.symbolDefs && (
                <div className="as-sym-panel">
                  {currentQ.symbolDefs.map((d, i) => (
                    <div key={i} className="as-sym-chip">
                      <span className="as-sym-emoji">{d.sym}</span>
                      <span className="as-sym-eq">=</span>
                      <span className="as-sym-val">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── SEQUENCE FILL — show the sequence visually ────── */}
              {currentQ.questionType === 'sequence-fill' && (
                <div className="as-seq-visual">
                  {currentQ.text.split('\n').map((line, li) => {
                    // Highlight lines that look like sequences (contain commas or =)
                    const isSeq = /,|=/.test(line) && !/Hint/i.test(line);
                    return isSeq ? (
                      <div key={li} className="as-seq-row">
                        {line.split(/([,_]+)/).map((tok, ti) => (
                          <span key={ti} className={tok.trim() === '___' ? 'as-seq-blank' : 'as-seq-tok'}>{tok}</span>
                        ))}
                      </div>
                    ) : (
                      <div key={li} className="as-seq-hint">{line}</div>
                    );
                  })}
                </div>
              )}

              {/* ── STANDARD LIKERT ──────────────────────────────── */}
              {questions.sections[currentSection].type === "likert" ? (
                <div className="as-likert-row">
                  {currentQ.options.map((opt, i) => (
                    <button key={i} className={`as-lik-btn${answers[currentQ.id] === i ? " sel" : ""}`} onClick={() => handleAnswer(currentQ.id, i)}>
                      <span className="as-lik-emo">{likertEmojis[i]}</span>
                      <span className="as-lik-lbl">{opt}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* ── MCQ / choice / symbol-pattern / sequence-fill options ── */
                <div className="as-opts">
                  {currentQ.options.map((opt, i) => (
                    <button key={i} className={`as-opt-btn${answers[currentQ.id] === i ? " sel" : ""}`} onClick={() => handleAnswer(currentQ.id, i)}>
                      <div className="as-opt-ltr">{String.fromCharCode(65 + i)}</div>
                      <div className="as-opt-txt">{opt}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="as-q-nav" style={{ justifyContent: "flex-start" }}>
              <button className="as-btn-nav" onClick={goPrevQ} disabled={currentSection === 0 && currentQIdx === 0}>← Back</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING REPORT SCREEN ───────────────────────────────────── */}
      {screen === "loading-r" && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className="as-load-screen">
            <div className="as-ring" />
            <div className="as-load-title">Analysing Your Results</div>
            <div className="as-load-sub">Our AI is processing your {totalQ} responses…</div>
            <div className="as-load-steps">
              {["📊 Computing Aptitude Scores", "🎨 Mapping Personality Profile", "🔭 Identifying Interest Clusters", "🌍 Generating Career Roadmap", "✨ Finalizing Your Report"].map((label, i) => (
                <div key={i} className={`as-lstep${loadRSteps[i] === 1 ? " active" : loadRSteps[i] === 2 ? " done" : ""}`}>{label}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT SCREEN ──────────────────────────────────────────── */}
      {screen === "locked" && (
        <div className="as-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '520px', background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Lock size={64} style={{ margin: '0 auto', color: '#f59e0b' }} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1e293b', lineHeight: 1.3 }}>
              Results are locked. Complete Parent Psychometric to view results.
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Your student assessment responses have been successfully analyzed and saved! To unlock your full career recommendations, aptitude breakdown, and family insights, please complete the Parent Psychometric Assessment.
            </p>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <button 
                onClick={() => {
                  const targetResultId = searchParams.get('resultId') || (reportData && reportData.id) || '';
                  if (targetResultId) {
                    window.location.href = `/parent-assessment?resultId=${targetResultId}`;
                  } else {
                    window.location.href = `/parent-assessment`;
                  }
                }}
                className="as-btn as-btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#690B1B' }}
              >
                Start Parent Psychometric Test →
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <div className="as-spinner" style={{ width: '16px', height: '16px', border: '2px solid #e2e8f0', borderTop: '2px solid #94a3b8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Awaiting parent assessment completion
            </div>
          </div>
        </div>
      )}

      {screen === "report" && scores && reportData && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {false ? (
            <div className="as-report-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '40px', minHeight: '80vh' }}>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Your Results Are Ready</h2>
                <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Choose how you'd like to view your psychometric assessment report. You can always upgrade to the detailed dossier later.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', width: '100%', maxWidth: '900px' }}>
                
                {/* Basic Card */}
                <div 
                  onClick={() => setReportMode('basic')}
                  style={{ flex: '1 1 300px', background: '#fff', borderRadius: '24px', padding: '32px', border: '2px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#9CA3AF'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <BarChart2 size={24} color="#4B5563" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Basic Summary</h3>
                  <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, flexGrow: 1 }}>Get a high-level overview of your top career match, aptitude scores, and basic learning style.</p>
                  <ul style={{ margin: '24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#057A55" /> Top Career Match</li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#057A55" /> Aptitude Score Overview</li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#057A55" /> Basic Learning Style</li>
                  </ul>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#4B5563', textAlign: 'center', padding: '14px', background: '#F9FAFB', borderRadius: '12px', marginTop: 'auto' }}>Free</div>
                </div>

                {/* Premium Card */}
                <div 
                  onClick={() => setPayModalOpen(true)}
                  style={{ flex: '1 1 300px', background: '#fff', borderRadius: '24px', padding: '32px', border: '2px solid #690B1B', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(105, 11, 27, 0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#690B1B', color: '#fff', padding: '6px 16px', borderBottomLeftRadius: '16px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>RECOMMENDED</div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Star size={24} color="#690B1B" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>Detailed Dossier</h3>
                  <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, flexGrow: 1 }}>Unlock your complete 360° psychological profile, step-by-step career roadmaps, and university finder.</p>
                  <ul style={{ margin: '24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#690B1B" /> Full Big-Five & RIASEC Analysis</li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#690B1B" /> Interactive Career Roadmaps</li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#690B1B" /> Global Study Abroad Finder</li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><CheckCircle2 size={18} color="#690B1B" /> Detailed Action Plans & Milestones</li>
                  </ul>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', fontWeight: 700, color: '#fff', textAlign: 'center', padding: '14px', background: 'linear-gradient(to right, #690B1B, #8A1226)', borderRadius: '12px', marginTop: 'auto' }}>
                    <Lock size={18} /> Unlock for ₹49
                  </div>
                </div>

              </div>
            </div>
          ) : scores ? (
            (() => {
              const resolvedVariant = resolveReportVariant(assessmentType, student.grade);
              const variantConfig = getVariantConfig(resolvedVariant);
              const defaultAge = resolvedVariant === 'junior' ? '13' : resolvedVariant === 'senior' ? '17' : '15';
              const rawGrade = student.grade || variantConfig.defaultGradeLabel;
              const formattedGrade = rawGrade.toLowerCase().includes('class') || rawGrade.toLowerCase().includes('grade') ? rawGrade : `Class ${rawGrade}`;

              const editorialStudent: EditorialStudent = {
                name: student.name || 'Candidate',
                grade: formattedGrade,
                age: student.age || defaultAge,
                school: student.school || '',
                city: student.city || 'India',
                stream: student.stream || '',
                email: student.email || '',
                date: student.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                reportId: (reportData?.id || reportData?.resultId || `${variantConfig.reportIdPrefix}-${Math.floor(100000 + Math.random() * 90000)}`).toString().toUpperCase(),
                parentName: student.parentName || '',
              };
              const personalization = reportData?.personalization || {
                executiveSummary: reportData?.summary || '',
                strengths: reportData?.strengths || [],
                growthAreas: reportData?.growthAreas || []
              };
              const parentProfile = reportData?.parentProfile || (comparisonData as any)?.parentProfile || null;

              const adaptedData = adaptReportData(
                editorialStudent,
                scores as any,
                personalization,
                comparisonData,
                parentProfile,
                resolvedVariant
              );

              const currentReportHtml = viewReportMode === 'executive'
                ? buildUniversalExecutiveSummaryHTMLReport(adaptedData)
                : buildUniversalExecutiveHTMLReport(adaptedData);

              const source = searchParams.get('source');
              let backHref = '/dashboard/student/assessments';
              let backLabel = 'Back to Assessments';
              if (source === 'admin') { backHref = '/dashboard/admin/assessments'; backLabel = 'Admin Assessments'; }
              else if (source === 'counsellor') { backHref = '/dashboard/counsellor'; backLabel = 'Counsellor Dashboard'; }

              return (
                <ReportViewerShell
                  reportHtml={currentReportHtml}
                  mode={viewReportMode}
                  studentName={student.name || 'Candidate'}
                  studentGrade={editorialStudent.grade}
                  reportId={editorialStudent.reportId}
                  onSwitchMode={(newMode) => setViewReportMode(newMode)}
                  onDownloadFull={() => downloadPDF('full')}
                  onDownloadSummary={() => downloadPDF('executive')}
                  backHref={backHref}
                  backLabel={backLabel}
                />
              );
            })()
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>Unable to load assessment report.</div>
              <button className="as-btn as-btn-primary" onClick={restartApp} style={{ background: '#690B1B', color: '#fff', padding: '10px 24px', borderRadius: '8px' }}>
                Retake Assessment
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── JUNIOR GRADE SELECTOR MODAL ───────────────────────────── */}
      {juniorGradeSelectorOpen && (
        <div className="as-crm-overlay" style={{ zIndex: 1001 }}>
          <div className="as-crm-modal" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ background: 'linear-gradient(135deg, #690B1B, #690b1b)', color: '#fff', padding: '28px 24px', position: 'relative', textAlign: 'center' }}>
              <button 
                onClick={() => setJuniorGradeSelectorOpen(false)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', marginBottom: '16px' }}>
                <GraduationCap size={24} color="#fff" />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Assessment Preparation</div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Select Your Class</h3>
            </div>
            
            <div style={{ padding: '28px 24px', background: '#fff' }}>
              <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px', textAlign: 'center' }}>
                We'll tailor your cognitive roadmap and profile building steps according to your current school year.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { val: "7", label: "Class 7", sub: "12-Month Academic & Profile Plan" },
                  { val: "8", label: "Class 8", sub: "12-Month Academic & Profile Plan" },
                  { val: "9", label: "Class 9", sub: "4-Year Admissions Readiness Journey" }
                ].map((g) => (
                  <button 
                    key={g.val}
                    onClick={() => startJuniorAssessment(g.val)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '12px',
                      background: '#F9FAFB',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      width: '100%',
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#690b1b';
                      e.currentTarget.style.background = '#FFF5F5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(105, 11, 27, 0.1)';
                      const arrow = e.currentTarget.querySelector('.arrow-icon');
                      if (arrow) (arrow as HTMLElement).style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                      const arrow = e.currentTarget.querySelector('.arrow-icon');
                      if (arrow) (arrow as HTMLElement).style.transform = 'none';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{g.label}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{g.sub}</div>
                    </div>
                    <div className="arrow-icon" style={{ color: '#690b1b', transition: 'transform 0.2s', display: 'flex', alignItems: 'center' }}>
                      <ChevronRight size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPI PAYMENT MODAL ─────────────────────────────────────── */}

      {payModalOpen && (
        <div className="as-crm-overlay" style={{ zIndex: 1000 }}>
          <div className="as-crm-modal" style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
            <div style={{ background: '#690B1B', color: '#fff', padding: '20px 24px', position: 'relative' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Secure Payment Gateway</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>CLARVO</h3>
              <button 
                onClick={() => setPayModalOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: 'var(--t2)', fontWeight: 500 }}>Unlock Complete Dossier</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#690B1B' }}>₹49.00</span>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Select Payment Method</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['UPI (Google Pay, PhonePe, Paytm)', 'Credit / Debit Card', 'Net Banking'].map((method, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px',
                        border: idx === 0 ? '1.5px solid #690B1B' : '1.5px solid var(--border)',
                        borderRadius: '10px',
                        background: 'var(--bg)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--t1)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #690B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx === 0 && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#690B1B' }} />}
                      </div>
                      {method}
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={async () => {
                  setPayModalOpen(false);
                  showToast("Processing payment...");
                  await new Promise((r) => setTimeout(r, 1200));
                  setPdfUnlocked(true);
                  setReportMode('detailed');
                  showToast("🎉 Payment successful! Full dossier unlocked.");
                }}
                style={{
                  background: '#690B1B',
                  color: '#fff',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(105, 11, 27, 0.3)',
                  cursor: 'pointer'
                }}
              >
                Simulate UPI Payment (₹49)
              </button>
              
              <div style={{ fontSize: '11px', color: 'var(--t4)', textAlign: 'center', marginTop: '12px' }}>
                🔒 SSL Encrypted connection · Simulation sandbox
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CAREER ROADMAP MODAL ───────────────────────────────────── */}
      {/* Replaced with inline roadmap */}

      {/* Print doc (hidden on screen, shown during print) */}
      <div id="as-print-doc" />

      {/* Toast */}
      <div className={`as-toast${toastVisible ? " show" : ""}`}>{toastMsg}</div>
      
      <TermsPopup
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onProceed={() => {
          setShowTerms(false);
          goToDetails();
        }}
      />
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="as-load-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="as-ring" />
        <div className="as-load-title">Loading Assessment...</div>
      </div>
    }>
      <AssessmentPageContent />
    </Suspense>
  );
}
