"use client";

import { Brain, Star, Target, BookOpen, Briefcase, Zap, Dumbbell, TrendingUp, ClipboardList, BarChart2, Calculator, Microscope, Calendar, PenTool, X, GraduationCap, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import PremiumToolsCards from "@/components/PremiumToolsCards";
import TermsPopup from "@/components/TermsPopup";
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

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "landing" | "details" | "loading-q" | "questions" | "loading-r" | "report" | "fetching";

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

async function callAPI(messages: any[], modelIdx = 0): Promise<string> {
  const model = MODELS[modelIdx] || MODELS[0];
  
  if (API_KEY.startsWith("AQ.")) {
    // Securely query Gemini via local Next.js API route to avoid CORS and API key exposure
    const res = await fetch(`/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, temperature: 0.7 }),
    });
    if (!res.ok) {
      throw new Error("Backend Gemini API call failed");
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  } else {
    // Client-side Groq call (legacy/fallback fallback)
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4000 }),
    });
    if (!res.ok) {
      if (modelIdx < MODELS.length - 1) return callAPI(messages, modelIdx + 1);
      throw new Error("API failed");
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }
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

  const valuesPct: Record<string, number> = {};
  allValueTypes.forEach((k) => {
    const offered = offeredCounts[k] || 1;
    valuesPct[k] = Math.round(((valuesRaw[k] || 0) / offered) * 100);
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
  };
}

function getStreamLabel(stream: string, type: string) {
  if (type === "junior") return "Junior Assessment (7th-9th Grade)";
  if (type === "grade10") return "Sophomore Assessment (10th Grade)";
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
      badge: isJunior ? 'Junior Focus' : isGrade10 ? 'Sophomore Focus' : isPCM ? 'PCM Focus' : isPCB ? 'PCB Focus' : isPCMB ? 'PCMB Focus' : isComm ? 'Commerce Focus' : isHum ? 'Humanities Focus' : 'Core Aptitude',
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
  const assessmentType = searchParams.get("type") || "senior";

  const [screen, setScreen] = useState<Screen>(searchParams.get("resultId") ? "fetching" : "landing");
  const [showTerms, setShowTerms] = useState(false);
  const [reportMode, setReportMode] = useState<'detailed' | 'basic'>('detailed');
  
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
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [streamStep, setStreamStep] = useState<'main' | 'science'>('main');
  const [juniorGradeSelectorOpen, setJuniorGradeSelectorOpen] = useState(false);
  const [activeJuniorMonth, setActiveJuniorMonth] = useState(1);
  const [active9YearTab, setActive9YearTab] = useState<'matrix' | 1 | 2 | 3 | 4>('matrix');
  const advancingRef = useRef(false);

  useEffect(() => {
    if (screen === "questions" || screen === "loading-r") {
      document.body.classList.add("test-active");
    } else {
      document.body.classList.remove("test-active");
    }
    return () => document.body.classList.remove("test-active");
  }, [screen]);

  useEffect(() => {
    const resultId = searchParams.get("resultId");
    if (resultId) {
      fetch(`/api/psychometric-test/${resultId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.result) {
            setScores(data.result.scores);
            setReportData(data.result.narrative);
            setStudent(data.result.student);
            if (data.result.questions) setQuestions(data.result.questions);
            if (data.result.answers) setAnswers(data.result.answers);
            if (data.result.careerAbroadData) setCareerAbroadData(data.result.careerAbroadData);
            if (data.result.allCrmData) {
              setAllCrmData(data.result.allCrmData);
              if (data.result.allCrmData.length > 0) setCrmData(data.result.allCrmData[0]);
              allCrmGeneratedRef.current = true;
            }
            setScreen("report");
            
            setReportMode("detailed");
            setPdfUnlocked(true);
          }
        })
        .catch(err => console.error("Error fetching result:", err));
    } else {
      // Fetch user profile if taking a new test
      fetch('/api/user/update-profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user && data.user.name) {
            setStudent(prev => ({ ...prev, name: data.user.name }));
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

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
          const clusterFit = scores.careerFitment.find((cf: any) =>
            cf.name.toLowerCase().includes(c.name?.toLowerCase().split(' ')[0]) ||
            c.name?.toLowerCase().includes(cf.name.toLowerCase().split(' ')[0])
          );
          const fitScore = clusterFit?.score ?? Math.max(10, 72 - origIdx * 9);
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
            finalData = { career, roadmap: rm } as CareerRoadmapData;
          }
        } catch (e) {
          console.error(`Failed to generate roadmap for career ${idx + 1}:`, e);
        }

        if (!finalData) {
          // Fallback
          finalData = {
            career,
            roadmap: {
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
      setStudent((prev) => ({ ...prev, grade: "", stream: "not-selected" }));
    } else if (assessmentType === "grade10") {
      setStudent((prev) => ({ ...prev, grade: "10", stream: "not-selected" }));
    } else if (assessmentType === "grade12") {
      setStudent((prev) => ({ ...prev, grade: "", stream: "not-selected" }));
    }
  }, [assessmentType]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  // ── Start Junior assessment with specific grade ────────────────────────────
  function startJuniorAssessment(grade: string) {
    setStudent((p) => ({
      ...p,
      name: p.name || "Guest Student",
      grade: grade,
      stream: "not-selected",
    }));
    setJuniorGradeSelectorOpen(false);
    setScreen("loading-q");
    loadQuestions("not-selected");
  }

  // ── Landing → Details ──────────────────────────────────────────────────────
  function goToDetails() {
    if (assessmentType === "junior") {
      setJuniorGradeSelectorOpen(true);
    } else if (assessmentType === "grade10") {
      setStudent((p) => ({
        ...p,
        name: p.name || "Guest Student",
        grade: "10",
        stream: "not-selected",
      }));
      setScreen("loading-q");
      loadQuestions("not-selected");
    } else {
      setScreen("details");
      setStreamStep("main");
    }
  }

  // ── Validate & start assessment ────────────────────────────────────────────
  function startAssessmentWithStream(stream: string) {
    setStudent((p) => ({
      ...p,
      name: p.name || "Guest Student",
      grade: "12",
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

Assessment scores:
- Aptitude: Overall ${sc.aptitude.overall}%, Verbal ${sc.aptitude.verbal}%, Numerical ${sc.aptitude.numerical}%, Reasoning ${sc.aptitude.reasoning}%, Spatial ${sc.aptitude.spatial}%
- Personality (Big Five): Openness ${sc.personality.openness}%, Conscientiousness ${sc.personality.conscientiousness}%, Extraversion ${sc.personality.extraversion}%, Agreeableness ${sc.personality.agreeableness}%, Emotional Stability ${sc.personality.emotionalStability}%
- RIASEC Top Codes: ${sc.topRiasec.slice(0, 3).join("-")}
- Learning Style: ${sc.topVark} dominant
- Top Career Values: ${sc.topValues.slice(0, 4).join(", ")}
- Top Career Clusters: ${sc.careerFitment.slice(0, 3).map((c) => c.name).join(", ")}

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
    "thisMonth": ["action 1", "action 2", "action 3"],
    "thisYear": ["action 1", "action 2", "action 3"],
    "skills": ["skill 1", "skill 2", "skill 3"],
    "resources": ["resource 1", "resource 2", "resource 3"]
  },
  "psychologicalSummary": {
    "cognitiveProfile": "A detailed 5-6 sentence analysis of their cognitive strengths and processing dynamics based on their score profile",
    "personalityProfile": "A detailed 5-6 sentence analysis of their Big Five personality dimensions and behavioral tendencies",
    "interestProfile": "A detailed 5-6 sentence analysis of their Holland Codes interest themes, environment preferences, and alignment",
    "learningProfile": "A detailed 5-6 sentence analysis of their VARK learning style modalities and personalized study optimization tips",
    "valuesProfile": "A detailed 5-6 sentence analysis of their core career values and motivators",
    "overallPsychProfile": "A detailed 5-6 sentence integrated psychological profile overview and academic advice"
  }
}`;

    try {
      const raw = await callAPI([{ role: "user", content: prompt }]);
      const parsed = extractJSON(raw);
      if (parsed && parsed.summary) return parsed;
    } catch (e) {
      // fallback below
    }

    // Fallback narrative
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

    return {
      summary: `${student.name} demonstrates a unique combination of ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic" : sc.topRiasec[0] === "R" ? "realistic" : "social"} interests with strong aptitude scores of ${sc.aptitude.overall}%. Their ${sc.topVark === "V" ? "visual" : sc.topVark === "A" ? "auditory" : sc.topVark === "R" ? "reading/writing" : "kinesthetic"} learning style and emphasis on ${sc.topValues[0] || "creativity"} and ${sc.topValues[1] || "impact"} point strongly towards careers in ${topCareer}. This assessment provides a personalised roadmap to help ${student.name} achieve their full career potential.`,
      strengths: ["Strong analytical and problem-solving abilities", "Natural curiosity and openness to new ideas", "Well-developed verbal and communication skills", "Goal-oriented with structured thinking"],
      growthAreas: ["Develop numerical and quantitative skills further", "Build leadership and interpersonal confidence", "Explore diverse career pathways through internships"],
      topCareers: sc.careerFitment.slice(0, 5).map((c) => {
        const isSchoolPhase = assessmentType === "junior" || assessmentType === "grade10";
        return {
          name: c.name,
          description: `${c.name} aligns strongly with your ${sc.topRiasec[0]} dominant RIASEC profile and aptitude score of ${sc.aptitude.overall}%. This pathway offers excellent options for your skill set.`,
          education: isSchoolPhase ? "Class 11 & 12 Stream Selection" : "Relevant Bachelor's Degree (4 years)",
          indianExam: isSchoolPhase ? "Class 10 Board / Foundation Exams" : "JEE Main / CUET / NEET",
          salaryRange: isSchoolPhase ? "N/A (Academic Phase)" : "₹6–25 LPA",
        };
      }),
      indianCounselling: {
        streamAdvice: `Based on your RIASEC profile (${sc.topRiasec.slice(0, 3).join("-")}) and aptitude scores, we recommend continuing your academic track in the ${getStreamLabel(student.stream, assessmentType)} stream with focus on subjects aligning with ${sc.careerFitment[0]?.name || "your top career clusters"}.`,
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
        thisMonth: ["Research top colleges for your chosen stream", "Create a study timetable for entrance exams", `Start practising ${VARK_TIPS[sc.topVark]?.[0] || "daily revision"}`],
        thisYear: ["Prepare for one major entrance exam", "Complete 1 summer internship or project", "Build a portfolio of academic work"],
        skills: ["Critical Thinking & Problem Solving", "Digital Literacy & Technology", "Communication & Presentation"],
        resources: ["Khan Academy (free academic resources)", "Coursera / edX (skill courses)", "LinkedIn Learning (professional development)"],
      },
      psychologicalSummary: {
        cognitiveProfile: `${student.name} shows an aptitude score of ${sc.aptitude.overall}%, with particular strength in ${sc.aptitude.verbal >= sc.aptitude.numerical ? "verbal" : "numerical"} domains. This cognitive profile indicates strong ${sc.aptitude.overall >= 70 ? "above-average" : "developing"} analytical abilities well-suited for ${sc.careerFitment[0]?.name || "technical"} careers.`,
        personalityProfile: `The Big Five profile reveals ${sc.personality.openness >= 65 ? "high openness to experience, suggesting creative and intellectual curiosity" : "moderate openness with a preference for structured, practical approaches"}. ${sc.personality.conscientiousness >= 65 ? "Strong conscientiousness indicates excellent discipline and goal orientation" : "Developing conscientiousness skills will strengthen career performance"}.`,
        interestProfile: `With a dominant RIASEC profile of ${sc.topRiasec.slice(0, 3).join("-")}, ${student.name} shows strongest alignment with ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic and creative" : sc.topRiasec[0] === "R" ? "realistic and hands-on" : "social and people-oriented"} career fields.`,
        learningProfile: `${student.name} is a predominantly ${sc.topVark === "V" ? "Visual" : sc.topVark === "A" ? "Auditory" : sc.topVark === "R" ? "Reading/Writing" : "Kinesthetic"} learner. ${VARK_TIPS[sc.topVark]?.[0] || "Adapting study strategies to this style"} will maximise academic performance.`,
        valuesProfile: `Career values analysis reveals strong emphasis on ${sc.topValues.slice(0, 3).join(", ")}. These values suggest ${sc.topValues[0] === "creativity" ? "creative and innovative environments will be most fulfilling" : sc.topValues[0] === "financial" ? "financially rewarding careers in high-growth sectors" : sc.topValues[0] === "helping" ? "service-oriented and social impact careers will bring greatest satisfaction" : "leadership and achievement-oriented career paths"}.`,
        overallPsychProfile: `${student.name}'s integrated psychometric profile presents a ${sc.aptitude.overall >= 70 ? "cognitively strong" : "developing"} individual with ${sc.personality.openness >= 65 ? "creative" : "structured"} personality traits and ${sc.topRiasec[0] === "I" ? "investigative" : sc.topRiasec[0] === "A" ? "artistic" : "practical"} career interests. The combination of ${sc.topValues[0] || "achievement"}-driven values and ${sc.topVark === "V" ? "visual" : sc.topVark === "K" ? "kinesthetic" : "reading-based"} learning preferences creates a distinctive career profile most aligned with ${sc.careerFitment[0]?.name || "technology and innovation"} fields. With focused guidance, structured skill development, and strategic career planning, ${student.name} is well-positioned to achieve exceptional outcomes.`,
      },
    };
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
  async function downloadPDF() {
    if (!student.name || !scores || !reportData) {
      showToast("Please complete the assessment first");
      return;
    }

    // Open a dedicated print window IMMEDIATELY to avoid popup blockers
    const printWin = window.open("", "_blank", "width=900,height=700");
    if (!printWin) { 
      showToast("Pop-up blocked — please allow pop-ups for this site"); 
      return; 
    }
    printWin.document.write("<html><head><title>Generating Report...</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;background:#f9fafb;'><h2>Assembling Your Report...</h2><p style='color:#6b7280'>Preparing your personalised career assessment report. Please wait a moment.</p></body></html>");

    // Use pre-generated roadmaps from allCrmData (generated on result load)
    let pdfCrmDataList: CareerRoadmapData[] = allCrmData.filter((d): d is CareerRoadmapData => d !== null);
    
    // If roadmaps are still generating, wait for them to finish before building the PDF
    if (allCrmLoading && allCrmPromiseRef.current) {
      try {
        const awaitedData = await allCrmPromiseRef.current;
        if (awaitedData && awaitedData.length) {
          pdfCrmDataList = awaitedData.filter((d: any): d is CareerRoadmapData => d !== null);
        }
      } catch (e) {
        console.error("Error waiting for roadmaps in downloadPDF:", e);
      }
    }

    // Fallback: use single crmData if allCrmData is empty
    if (pdfCrmDataList.length === 0 && crmData) {
      pdfCrmDataList.push(crmData);
    }

    // Sort roadmaps by fitScore descending
    pdfCrmDataList.sort((a, b) => {
      const getScore = (s: any) => {
        const match = String(s || "").match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getScore(b.roadmap?.fitScore) - getScore(a.roadmap?.fitScore);
    });

    const rid = student.reportId;
    const vn: Record<string, string> = { V: "Visual", A: "Auditory", R: "Reading/Writing", K: "Kinesthetic" };
    const rn: Record<string, string> = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
    const sc = scores;
    const narrative = reportData;
    const topR = sc.topRiasec[0] || "S";

    // Temporarily render light charts if in dark mode
    

    const aptChartImg = (document.getElementById("ch-apt") as HTMLCanvasElement)?.toDataURL("image/png") || "";
    const perChartImg = (document.getElementById("ch-per") as HTMLCanvasElement)?.toDataURL("image/png") || "";
    const riaChartImg = (document.getElementById("ch-ria") as HTMLCanvasElement)?.toDataURL("image/png") || "";
    const vkChartImg = (document.getElementById("ch-vk") as HTMLCanvasElement)?.toDataURL("image/png") || "";
    const valChartImg = (document.getElementById("ch-val") as HTMLCanvasElement)?.toDataURL("image/png") || "";

    // Restore dark charts if in dark mode
    

    const hasDomestic = !!(narrative.indianCounselling && (
      narrative.indianCounselling.streamAdvice ||
      narrative.indianCounselling.subjects?.length ||
      narrative.indianCounselling.entranceExams?.length ||
      narrative.indianCounselling.topColleges?.length
    ));

    const hasRoadmap = !!(narrative.roadmap && [
      "grade12", "graduation", "postGrad", "career", "studyAbroad"
    ].some(key => narrative.roadmap[key]));

    const hasActionPlan = !!(narrative.actionPlan && (
      narrative.actionPlan.thisMonth?.length ||
      narrative.actionPlan.thisYear?.length
    ));

    const hasPsychologicalProfile = !!(narrative.psychologicalSummary?.overallPsychProfile);

    // Count if QA pages will be added
    const hasQaPages = !!(questions && Object.keys(answers).length > 0);
    const numQaPagesActual = hasQaPages ? 10 : 0;
    
    // Dynamic page numbering: pgOffset = pages before the exec summary (cover + QA pages)
    const pgOffset = 1 + numQaPagesActual; // cover is page 1, then QA pages 2..9 (if present)
    // Exec summary = pgOffset + 1, then each content page increments by 1
    // Junior has 10 pages total (cover + 8 content + back cover), Senior has 9 (cover + 7 content + back cover)
    // When locked, only cover + QA + exec summary + locked page = pgOffset + 2
    const roadmapPagesCount = pdfUnlocked ? pdfCrmDataList.length * 2 : 0;
    let totalPages = pdfUnlocked ? (assessmentType === "junior" ? 10 : 9) + numQaPagesActual + roadmapPagesCount : (pgOffset + 2);

    // Helper functions for header and footer layout
    const mkHeader = (title: string) => `
      <div class="as-nv-hdr" style="padding-bottom:8px;border-bottom:2px solid #690B1B;display:flex;justify-content:space-between;align-items:center;">
        <div class="as-nv-hdr-left" style="display:flex;align-items:center;gap:10px">
          <img src="${LOGO_BASE64}" alt="AS Logo" style="width:30px;height:30px;border-radius:6px;flex-shrink:0;box-shadow:0 2px 4px rgba(105,11,27,0.2);object-fit:contain" />
          <div>
            <div class="as-nv-hdr-brand" style="font-size:13px;font-weight:800;color:#111;letter-spacing:-.3px">Abroad Simplified</div>
            <div class="as-nv-hdr-eng" style="font-size:7.5px;color:#9CA3AF;font-weight:600;letter-spacing:.4px;text-transform:uppercase;margin-top:1px">Psychometric Intelligence Engine</div>
          </div>
        </div>
        <div class="as-nv-hdr-right" style="text-align:right">
          <div class="as-nv-hdr-pill" style="display:inline-block;background:#690B1B;color:#fff;font-size:8px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:.3px;margin-bottom:1px;text-transform:uppercase;box-shadow:0 1.5px 3px rgba(105,11,27,0.15)">${esc(title)}</div>
          <div class="as-nv-hdr-rid" style="font-size:9px;color:#6B7280;font-weight:700;letter-spacing:.2px">${esc(rid)}</div>
        </div>
      </div>
    `;

    const mkFooter = (pageNum: number) => `
      <div class="as-nv-ftr" style="padding-top:10px;border-top:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#9CA3AF;">
        <div>Advisory Report ID: ${esc(rid)} · Confidential Report for ${esc(student.name)}</div>
        <div style="font-weight:800;color:#690B1B">Page ${pageNum} of ${totalPages}</div>
      </div>
    `;

    // Active roadmap matrices - removes extra blank spaces in tables
    const render12MonthPlan = () => {
      const months = [
        { m: "Month 1", ac: "Goal Setting; Standardized Tests Intro (PSAT, TOEFL)", pr: "Exploring extracurricular interests; Building strong academic foundations", fu: "Goal worksheets, app selections, list activities" },
        { m: "Month 2", ac: "Subject-Specific tutoring; PSAT 8/9 prep", pr: "Deep dive extracurriculars; Early exposure to research/science fairs", fu: "PSAT prep plan, competition registration" },
        { m: "Month 3", ac: "Olympiad prep; TOEFL Junior preparation", pr: "Community volunteering projects; Building basic portfolio", fu: "Olympiad mock tests, portfolio builder tools" },
        { m: "Month 4", ac: "Summer programs exploration; Test strategies", pr: "Communication & soft skills; Online safety & personal branding", fu: "Summer application deadlines, soft skill classes" },
        { m: "Month 5", ac: "Review academic goals; Mock tests & analysis", pr: "Finalize summer planning; Mentor & alumni networking", fu: "Performance score report, schedule checklists" },
        { m: "Month 6", ac: "Summer reading list; Continued test prep", pr: "Active summer projects participation; Goal reflections", fu: "Reflective journal, activity logs" },
        { m: "Month 7", ac: "Advanced course planning; Exam date schedules", pr: "Exploring new interests & hobbies; Updating portfolio", fu: "Course catalogs, schedule PSAT/TOEFL" },
        { m: "Month 8", ac: "Organizing school materials; Final test preps", pr: "Planning extracurriculars; Strong online presence", fu: "Study schedules, online profile refinement" },
        { m: "Month 9", ac: "Performance monitoring; Post-test analysis", pr: "Extracurricular leadership; Essay writing skills", fu: "Score report actions, essay resources" },
        { m: "Month 10", ac: "Advanced courses exploration (AP, IB); Test planning", pr: "Building diverse profile; Public speaking & prep", fu: "Course catalogs, presentation workshops" },
        { m: "Month 11", ac: "Academic competitions; Early SAT/ACT intro", pr: "Leadership roles development; Resume building", fu: "SAT/ACT booklets, resume templates" },
        { m: "Month 12", ac: "End-of-year review; SAT/ACT prep schedule", pr: "Community service; Personal statement drafts", fu: "Goal setting review, statement prompts" }
      ];
      
      let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`;
      months.forEach((row, idx) => {
        html += `
          <div style="border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px;background:${idx % 2 === 0 ? '#fff' : '#FFFDFD'};font-size:8.5px;box-shadow:0 1px 2px rgba(0,0,0,0.01)">
            <div style="font-weight:800;color:#690B1B;margin-bottom:2px;font-size:9px;border-bottom:1px solid #690B1B15;padding-bottom:1px">${row.m}</div>
            <div style="margin-bottom:2px;color:#374151"><strong>Study:</strong> ${esc(row.ac)}</div>
            <div style="margin-bottom:2px;color:#374151"><strong>Activities:</strong> ${esc(row.pr)}</div>
            <div style="color:#111"><strong>Action:</strong> <span style="color:#690B1B;font-weight:700">${esc(row.fu)}</span></div>
          </div>
        `;
      });
      html += `</div>`;
      return html;
    };

    const renderRoadmapTimeline = () => {
      let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">`;
      const years = [
        { key: 'y1', name: 'Year 1 (Grade 9)' },
        { key: 'y2', name: 'Year 2 (Grade 10)' },
        { key: 'y3', name: 'Year 3 (Grade 11)' },
        { key: 'y4', name: 'Year 4 (Grade 12)' }
      ];
      
      years.forEach((yr) => {
        html += `
          <div style="border:1px solid #690B1B20;border-radius:10px;padding:12px;background:#FFFDFD;page-break-inside:avoid;break-inside:avoid;box-shadow:0 1.5px 3px rgba(105,11,27,0.02)">
            <div style="font-size:11.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #690B1B;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">${yr.name}</div>
        `;
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        quarters.forEach((q, qIdx) => {
          const activeItems = JUNIOR_MATRIX_9.map(row => {
            const val = row[yr.key as keyof typeof row] as number[];
            return { activity: row.activity, count: val[qIdx] };
          }).filter(item => item.count > 0);
          
          if (activeItems.length > 0) {
            html += `
              <div style="margin-bottom:8px">
                <div style="font-size:8px;font-weight:800;color:#9CA3AF;text-transform:uppercase;margin-bottom:2px;letter-spacing:.3px">${q} Quota</div>
                <div style="font-size:8.5px;color:#374151;line-height:1.45">
                  ${activeItems.map(item => `• ${esc(item.activity)} <span style="color:#690B1B;font-weight:700">(${item.count})</span>`).join('<br>')}
                </div>
              </div>
            `;
          }
        });
        html += `</div>`;
      });
      html += `</div>`;
      return html;
    };

    // Extract flat list of all 100 questions only if questions are available
    let qaPagesHTML = "";
    let numQaPages = 0;

    const traitLabels: Record<string, string> = {
      openness: "Openness",
      conscientiousness: "Conscientiousness",
      extraversion: "Extraversion",
      agreeableness: "Agreeableness",
      neuroticism: "Emotional Stability / Neuroticism",
    };

    const riasecLabels: Record<string, string> = {
      R: "Realistic (Hands-on / Practical)",
      I: "Investigative (Analytical / Scientific)",
      A: "Artistic (Creative / Expressive)",
      S: "Social (Helping / Educational)",
      E: "Enterprising (Leadership / Business)",
      C: "Conventional (Structured / Financial)",
    };

    const varkLabels: Record<string, string> = {
      V: "Visual Learner",
      A: "Auditory Learner",
      R: "Reading / Writing Learner",
      K: "Kinesthetic / Hands-on Learner",
    };

    if (questions && Object.keys(answers).length > 0) {
      const flatQuestions: any[] = [];
      questions.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          flatQuestions.push({
            ...q,
            sectionName: sec.name,
            sectionType: sec.type,
          });
        });
      });

      numQaPages = 10;
      const chunkSizes = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
      let currentIdx = 0;

      for (let p = 0; p < numQaPages; p++) {
      const size = chunkSizes[p];
      const chunk = flatQuestions.slice(currentIdx, currentIdx + size);
      currentIdx += size;

      const mid = Math.ceil(chunk.length / 2);
      const leftCol = chunk.slice(0, mid);
      const rightCol = chunk.slice(mid);

      const renderCol = (items: any[]) => {
        return items.map((q) => {
          const userAnsIdx = answers[q.id];
          const userAnsText = userAnsIdx !== undefined ? q.options[userAnsIdx] : "Not answered";
          let detailsHTML = "";

          if (q.sectionType === "mcq") {
            const isCorrect = userAnsIdx === q.correct;
            const correctAnsText = q.options[q.correct] || "";
            if (isCorrect) {
              detailsHTML = `
                <div style="color:#057A55;font-weight:700;margin-top:4px;display:flex;align-items:center;gap:3px;font-size:8.5px">
                  <span style="background:#D1FAE5;color:#057A55;font-size:7px;font-weight:900;padding:1px 4px;border-radius:3px;text-transform:uppercase">Correct</span>
                  ${esc(userAnsText)}
                </div>
              `;
            } else {
              detailsHTML = `
                <div style="color:#D97706;font-weight:700;margin-top:4px;display:flex;align-items:center;gap:3px;font-size:8.5px">
                  <span style="background:#FEF3C7;color:#D97706;font-size:7px;font-weight:900;padding:1px 4px;border-radius:3px;text-transform:uppercase">Incorrect</span>
                  Yours: ${esc(userAnsText)}
                </div>
                <div style="color:#057A55;font-weight:700;margin-top:2px;font-size:8.5px;margin-left:43px">
                  Correct: ${esc(correctAnsText)}
                </div>
              `;
            }
          } else if (q.sectionType === "likert") {
            const traitName = traitLabels[q.trait] || q.trait;
            detailsHTML = `
              <div style="color:#690B1B;font-weight:700;margin-top:4px;font-size:8.5px">
                Response: ${esc(userAnsText)}
              </div>
              <div style="color:#6B7280;font-size:7.5px;margin-top:1.5px;font-weight:600">
                Trait Mapped: ${esc(traitName)}
              </div>
            `;
          } else if (q.trait === "riasec") {
            const riasecCode = q.option_types?.[userAnsIdx] || "";
            const interestType = riasecLabels[riasecCode] || riasecCode;
            detailsHTML = `
              <div style="color:#690B1B;font-weight:700;margin-top:4px;font-size:8.5px">
                Selected: ${esc(userAnsText)}
              </div>
              <div style="color:#057A55;font-size:7.5px;margin-top:1.5px;font-weight:600">
                Vocational Theme: ${esc(interestType)}
              </div>
            `;
          } else if (q.trait === "vark") {
            const varkCode = q.option_types?.[userAnsIdx] || "";
            const learningStyle = varkLabels[varkCode] || varkCode;
            detailsHTML = `
              <div style="color:#690B1B;font-weight:700;margin-top:4px;font-size:8.5px">
                Selected: ${esc(userAnsText)}
              </div>
              <div style="color:#C9A55D;font-size:7.5px;margin-top:1.5px;font-weight:600">
                Learning Modality: ${esc(learningStyle)}
              </div>
            `;
          } else if (q.trait === "values") {
            const valType = q.option_types?.[userAnsIdx] || "";
            const formattedVal = valType.charAt(0).toUpperCase() + valType.slice(1);
            detailsHTML = `
              <div style="color:#690B1B;font-weight:700;margin-top:4px;font-size:8.5px">
                Prioritised: ${esc(userAnsText)}
              </div>
              <div style="color:#0694A2;font-size:7.5px;margin-top:1.5px;font-weight:600">
                Work Value: ${esc(formattedVal)}
              </div>
            `;
          }

          return `
            <div style="border:1px solid #E5E7EB;border-radius:8px;padding:9px 12px;background:#fff;font-size:9.5px;line-height:1.5;box-shadow:0 1px 2.5px rgba(0,0,0,0.015);margin-bottom:8px">
              <div style="font-weight:800;color:#111;margin-bottom:4px">Q${q.id}. ${esc(q.text)}</div>
              ${detailsHTML}
            </div>
          `;
        }).join("");
      };

      qaPagesHTML += `
        <!-- Q&A PAGE ${p + 1} -->
        <div class="as-pg">
          ${mkHeader("Assessment Analysis")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">📝 Questions &amp; Answers Analysis</div>
          <div class="as-nv-pg-sub" style="margin-bottom:12px">Detailed review of your psychometric assessment responses (Part ${p + 1} of ${numQaPages})</div>
          
          <div class="as-pg-content" style="margin-top:0">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:stretch">
              <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:8px">
                ${renderCol(leftCol)}
              </div>
              <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:8px">
                ${renderCol(rightCol)}
              </div>
            </div>
          </div>
          ${mkFooter(p + 2)}
        </div>
      `;
      }
    }


    const rmL = pdfCrmDataList.length;

    const renderRoadmaps = (startPage: number) => {
      if (rmL === 0) return "";
      return pdfCrmDataList.map((pdfCrmItem: CareerRoadmapData, crmIdx: number) => {
        const degreeText = pdfCrmItem.career?.education || pdfCrmItem.roadmap?.targetDegree || pdfCrmItem.roadmap?.degree || pdfCrmItem.roadmap?.stages?.find((s: any) => s.stage === "Graduation")?.title || "";
        const bestFitBadge = crmIdx === 0 ? '<div style="display:inline-block;background:#057A55;color:#fff;font-size:8px;font-weight:800;padding:3px 8px;border-radius:4px;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">⭐ Best Fit Pathway</div>' : "";
        const degreeDisplay = (crmIdx === 0 && degreeText) ? ' <span style="font-size:12px;color:#6B7280;font-weight:600">(' + esc(degreeText) + ')</span>' : "";

        return `
      <!-- DETAILED CAREER ROADMAP ${crmIdx + 1} - PAGE 1 -->
      <div class="as-pg">
        ${mkHeader(`Career Roadmap ${crmIdx + 1} of ${rmL} (Part 1)`)}
        ${bestFitBadge}
        <div class="as-nv-pg-heading" style="margin-bottom:1px;font-size:18px">🎓 ${esc(pdfCrmItem.career.name)}${degreeDisplay}</div>
        <div class="as-nv-pg-sub" style="margin-bottom:6px;font-size:9px;line-height:1.35">${esc((pdfCrmItem.roadmap.overview || pdfCrmItem.career.description || '').substring(0, 200))}</div>
        
        <div class="as-pg-content" style="gap:5px;padding-bottom:30px">
          <!-- KPIs -->
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-bottom:4px;align-items:stretch">
            <div style="border:1px solid #E5E7EB;border-radius:6px;padding:5px;text-align:center;background:#fff;display:flex;flex-direction:column;align-items:center;height:100%;box-sizing:border-box">
              <div style="font-size:10px;font-weight:800;color:#690B1B;margin-bottom:4px;width:100%;display:flex;align-items:center;justify-content:center;flex:1">${esc(pdfCrmItem.roadmap.fitScore || "-")}</div>
              <div style="font-size:6px;color:#6B7280;text-transform:uppercase;letter-spacing:0.4px;margin-top:auto">Fit Score</div>
            </div>
            <div style="border:1px solid #E5E7EB;border-radius:6px;padding:5px;text-align:center;background:#fff;display:flex;flex-direction:column;align-items:center;height:100%;box-sizing:border-box">
              <div style="font-size:10px;font-weight:800;color:#690B1B;margin-bottom:4px;width:100%;display:flex;align-items:center;justify-content:center;flex:1;line-height:1.2">${esc(pdfCrmItem.roadmap.duration || "-")}</div>
              <div style="font-size:6px;color:#6B7280;text-transform:uppercase;letter-spacing:0.4px;margin-top:auto">Duration</div>
            </div>
            <div style="border:1px solid #E5E7EB;border-radius:6px;padding:5px;text-align:center;background:#fff;display:flex;flex-direction:column;align-items:center;height:100%;box-sizing:border-box">
              <div style="font-size:10px;font-weight:800;color:#690B1B;margin-bottom:4px;width:100%;display:flex;align-items:center;justify-content:center;flex:1;line-height:1.2">${esc(pdfCrmItem.roadmap.avgSalary || pdfCrmItem.career.salaryRange || "-")}</div>
              <div style="font-size:6px;color:#6B7280;text-transform:uppercase;letter-spacing:0.4px;margin-top:auto">Avg Salary</div>
            </div>
            <div style="border:1px solid #E5E7EB;border-radius:6px;padding:5px;text-align:center;background:#fff;display:flex;flex-direction:column;align-items:center;height:100%;box-sizing:border-box">
              <div style="font-size:10px;font-weight:800;color:#690B1B;margin-bottom:4px;width:100%;display:flex;align-items:center;justify-content:center;flex:1">${(pdfCrmItem.roadmap.stages || []).length}</div>
              <div style="font-size:6px;color:#6B7280;text-transform:uppercase;letter-spacing:0.4px;margin-top:auto">Stages</div>
            </div>
          </div>

          <!-- Stages -->
          <div style="flex:1;display:flex;flex-direction:column;gap:4px;overflow:hidden">
            ${(pdfCrmItem.roadmap.stages || []).slice(0, 4).map((s: any, i: number, arr: any[]) => `
              <div style="display:flex;gap:8px;position:relative">
                ${i !== arr.length - 1 ? `<div style="position:absolute;left:9px;top:20px;bottom:-4px;width:1.5px;background:#E5E7EB;z-index:0"></div>` : ""}
                <div style="width:20px;height:20px;border-radius:10px;background:#FFF8F8;border:1.5px solid #690B1B;display:flex;align-items:center;justify-content:center;font-size:9px;position:relative;z-index:1;flex-shrink:0">
                  ${s.icon || "📍"}
                </div>
                <div style="flex:1;border:1px solid #E5E7EB;border-radius:6px;padding:5px 8px;background:#fff;margin-bottom:2px">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
                    <div style="font-size:8.5px;font-weight:800;color:#690B1B">${esc(s.stage)}: ${esc(s.title)}</div>
                  </div>
                  ${s.milestone ? `<div style="font-size:7px;font-weight:700;color:#057A55;background:#ECFDF5;display:inline-block;padding:1px 5px;border-radius:3px;margin-bottom:3px">🏁 ${esc(s.milestone)}</div>` : ""}
                  <ul style="margin:0;padding-left:12px;font-size:7.5px;color:#4B5563;line-height:1.35">
                    ${(s.actions || []).slice(0, 3).map((a: string) => `<li style="margin-bottom:1px">${esc(a)}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Bottom Data -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1.5px solid #E5E7EB;padding-top:6px;margin-top:auto">
            <div>
              <div style="font-size:8px;font-weight:800;color:#690B1B;margin-bottom:3px;text-transform:uppercase">🎓 Top Colleges</div>
              <div style="font-size:7.5px;color:#4B5563;line-height:1.35">
                ${(pdfCrmItem.roadmap.topColleges || []).slice(0, 3).map((c: string) => `• ${esc(c)}`).join("<br>")}
              </div>
            </div>
            <div>
              <div style="font-size:8px;font-weight:800;color:#690B1B;margin-bottom:3px;text-transform:uppercase">📝 Key Exams</div>
              <div style="font-size:7.5px;color:#4B5563;line-height:1.35">
                ${(pdfCrmItem.roadmap.keyExams || []).slice(0, 3).map((e: string) => `• ${esc(e)}`).join("<br>")}
              </div>
            </div>
          </div>
        </div>
        ${mkFooter(startPage + crmIdx * 2 + 1)}
      </div>
      `;
      }).join("");
    };

    const bodyHTML = `
      <!-- PAGE 1: COVER -->
      <div class="as-pg cover-pg" style="background: linear-gradient(135deg,#4F0813 0%,#1F0104 100%); padding: 0 !important;">
        <div style="position:absolute;top:20px;bottom:20px;left:20px;right:20px;border:1px solid rgba(201,165,93,0.25);border-radius:10px;pointer-events:none"></div>
        <div class="as-pg-content" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #fff; margin-top: 0; position:relative; z-index: 1">
          <img src="${LOGO_BASE64}" alt="Abroad Simplified" style="width:48px;height:48px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);margin-bottom:16px;object-fit:contain" />
          <div style="font-size:11px;font-weight:800;letter-spacing:5px;color:rgba(255,255,255,.6);text-transform:uppercase;margin-bottom:44px">ABROAD SIMPLIFIED</div>
          
          <div style="text-align:center">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:42px;font-weight:900;line-height:1.2;margin-bottom:24px;letter-spacing:-1px;color:#fff">AI Psychometric &amp;<br><span style="color:#C9A55D">Academic Advisory</span><br>Dossier</div>
            <div style="width:70px;height:2.5px;background:#C9A55D;margin:0 auto 36px"></div>
          </div>

          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:24px 40px;width:100%;max-width:440px;text-align:center;backdrop-filter:blur(5px);box-shadow:0 10px 30px rgba(0,0,0,0.15)">
            <div style="font-size:19px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;color:#fff">${esc(student.name)}</div>
            <div style="font-size:13.5px;color:rgba(255,255,255,.8);margin-bottom:24px;font-weight:500">Class ${esc(student.grade)} · ${esc(student.stream !== "not-selected" ? student.stream : "General Stream")}</div>
            
            <div style="display:flex;justify-content:center;gap:30px;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;font-size:10.5px;color:rgba(255,255,255,.5)">
              <div>
                <div style="text-transform:uppercase;font-size:8px;font-weight:800;color:#C9A55D;margin-bottom:3px">Dossier ID</div>
                <div style="font-weight:700;color:#fff">${esc(rid)}</div>
              </div>
              <div style="width:1px;background:rgba(255,255,255,0.08)"></div>
              <div>
                <div style="text-transform:uppercase;font-size:8px;font-weight:800;color:#C9A55D;margin-bottom:3px">Issue Date</div>
                <div style="font-weight:700;color:#fff">${esc(student.date)}</div>
              </div>
            </div>
          </div>

          <div style="position:absolute;bottom:40px;font-size:8.5px;letter-spacing:3px;color:rgba(255,255,255,.35);text-transform:uppercase;font-weight:700">OFFICIAL STRATEGIC PORTFOLIO dossier</div>
        </div>
      </div>

      <!-- PAGES 2-9: Q&A ANALYSIS -->
      ${qaPagesHTML}

      <!-- PAGE 10: EXEC SUMMARY -->
      <div class="as-pg">
        ${mkHeader("Executive Summary")}
        <div class="as-nv-pg-heading" style="margin-bottom:2px">📊 Executive Summary &amp; Overview</div>
        <div class="as-nv-pg-sub" style="margin-bottom:10px">${esc(student.name)} · Class ${esc(student.grade)} Profile Diagnosis</div>
        
        <div class="as-pg-content">
          <!-- Top score summary boxes -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;align-items:stretch">
            ${[
              ["🧠", sc.aptitude.overall + "%", "Overall Aptitude", "Cognitive Capacity"],
              ["🎯", rn[topR] || topR, "Top Interest", "RIASEC Vocational"],
              ["📚", vn[sc.topVark] || "Visual", "Learning Style", "VARK Modality"],
              ["💼", sc.careerFitment[0]?.name.split(" &")[0].split(" Stream")[0] || "—", "Best Fit Cluster", "Career Dimension"]
            ].map(([icon, val, label, subDesc]) => `
              <div style="border:1.5px solid #690B1B15;border-radius:10px;padding:12px 6px;text-align:center;background:#FFFDFD;box-shadow:0 2px 4px rgba(105,11,27,0.015);display:flex;flex-direction:column;align-items:center;height:100%;box-sizing:border-box">
                <div style="display:flex;align-items:center;justify-content:center;gap:4px;font-size:15px;font-weight:900;color:#690B1B;margin-bottom:6px;width:100%">
                  <span style="flex-shrink:0">${icon}</span> <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${val}</span>
                </div>
                <div style="font-size:9px;font-weight:800;color:#111;text-transform:uppercase;letter-spacing:.2px;line-height:1.3;margin-bottom:6px">${label}</div>
                <div style="font-size:7.5px;color:#9CA3AF;font-weight:600;margin-top:auto">${subDesc}</div>
              </div>
            `).join("")}
          </div>

          <!-- Mid section -->
          <div style="border-left:4.5px solid #690B1B;background:#FFFDFD;padding:18px 22px;font-size:10.5px;color:#374151;line-height:1.75;border-radius:0 10px 10px 0;margin-top:14px;box-shadow:inset 0 1px 3px rgba(0,0,0,0.01)">
            <strong style="color:#690B1B;font-size:12.5px;display:block;margin-bottom:8px">📋 Strategic Advisory Overview</strong>
            ${esc(narrative.summary || "")}
          </div>

          <!-- Bottom section -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px">
            <div style="background:#F4FDF9;border:1.5px solid #D1FAE5;border-radius:10px;padding:16px;display:flex;flex-direction:column;justify-content:flex-start">
              <div>
                <div style="font-size:11.5px;font-weight:800;color:#065F46;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;display:flex;align-items:center;gap:4px">
                  <span style="font-size:12.5px">💪</span> Core Strengths &amp; Talents
                </div>
                <ul style="padding-left:14px;font-size:9.5px;color:#374151;line-height:1.7">
                  ${(narrative.strengths || []).map((s: string) => `<li style="margin-bottom:4px">${esc(s)}</li>`).join("")}
                </ul>
              </div>
            </div>
            <div style="background:#FFFDF6;border:1.5px solid #FEF3C7;border-radius:10px;padding:16px;display:flex;flex-direction:column;justify-content:flex-start">
              <div>
                <div style="font-size:11.5px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;display:flex;align-items:center;gap:4px">
                  <span style="font-size:12.5px">📈</span> Key Action &amp; Growth Areas
                </div>
                <ul style="padding-left:14px;font-size:9.5px;color:#374151;line-height:1.7">
                  ${(narrative.growthAreas || []).map((g: string) => `<li style="margin-bottom:4px">${esc(g)}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
        ${mkFooter(pgOffset + 1)}
      </div>

      ${pdfUnlocked ? `
      <!-- PAGE 11 (JUNIOR: Subject Diagnosis / SENIOR: Career Cluster Fitment & Top 3 Careers) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Academic Diagnosis")}
          <div class="as-nv-pg-heading" style="margin-bottom:4px">📚 Subject Strengths &amp; Diagnosis</div>
          <div class="as-nv-pg-sub" style="margin-bottom:12px">School subject alignments mapped directly from cognitive aptitude dimensions</div>

          <div class="as-pg-content" style="gap:14px;justify-content:flex-start">
            ${(() => {
              const sortedJuniorSubjects = [
                { name: "Languages & Literature (English, Hindi, etc.)", score: sc.aptitude.verbal, icon: "🗣️", tip: "Your high verbal aptitude allows you to write essays, read dense stories, and speak confidently." },
                { name: "Mathematics & Quantitative reasoning", score: sc.aptitude.numerical, icon: "📐", tip: "Numerical patterns are easy for you. You solve calculations quickly." },
                { name: "Logical Sciences & Coding (Chemistry, Biology, CS)", score: sc.aptitude.reasoning, icon: "🧬", tip: "You possess strong puzzle-solving and code-cracking skills. Science theories are your strength." },
                { name: "Visual Geometry, Geography & Arts/Design", score: sc.aptitude.spatial, icon: "🗺️", tip: "You easily visualize coordinates, mirror clocks, and read charts. Geometry is natural." }
              ].sort((a, b) => b.score - a.score);

              const superpowers = sortedJuniorSubjects.slice(0, 2);
              const improvements = sortedJuniorSubjects.slice(2, 4);

              return `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                  <!-- Superpowers -->
                  <div style="border:1.5px solid #057A55;border-radius:12px;padding:16px;background:#F3FBF7">
                    <h3 style="font-size:12px;font-weight:800;color:#057A55;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:.3px">🔥 Your Academic Superpowers</h3>
                    <div style="display:flex;flex-direction:column;gap:12px">
                      ${superpowers.map((subj) => `
                        <div style="padding:12px;background:#fff;border-radius:8px;border-left:4px solid #057A55;box-shadow:0 1.5px 3px rgba(0,0,0,0.02)">
                          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                            <span style="font-weight:800;font-size:10.5px;color:#111">${subj.icon} ${esc(subj.name.split(" (")[0])}</span>
                            <span style="font-size:9.5px;font-weight:800;background:#057A55;color:#fff;padding:1px 6px;border-radius:10px">${subj.score}%</span>
                          </div>
                          <p style="font-size:9px;color:#4B5563;margin:0;line-height:1.45">${esc(subj.tip)}</p>
                        </div>
                      `).join("")}
                    </div>
                  </div>

                  <!-- Improvements -->
                  <div style="border:1.5px solid #690B1B;border-radius:12px;padding:16px;background:#FFF8F8">
                    <h3 style="font-size:12px;font-weight:800;color:#690B1B;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:.3px">🛠️ Subjects to Improve &amp; Support</h3>
                    <div style="display:flex;flex-direction:column;gap:12px">
                      ${improvements.map((subj) => {
                        const impTips: Record<string, string> = {
                          "Languages & Literature (English, Hindi, etc.)": "Practice active reading by summarizing paragraphs in 1 sentence. Write short articles daily.",
                          "Mathematics & Quantitative reasoning": "Solve quick math drills on Khan Academy. Draw visual squares or block models for word problems.",
                          "Logical Sciences & Coding (Chemistry, Biology, Computer)": "Create visual cause-and-effect flowcharts for science processes. Practice coding games.",
                          "Visual Geometry, Geography & Arts/Design": "Draw diagrams to represent concepts. Build origami or use graph paper to solve geometric equations."
                        };
                        return `
                          <div style="padding:12px;background:#fff;border-radius:8px;border-left:4px solid #690B1B;box-shadow:0 1.5px 3px rgba(0,0,0,0.02)">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                              <span style="font-weight:800;font-size:10.5px;color:#111">${subj.icon} ${esc(subj.name.split(" (")[0])}</span>
                              <span style="font-size:9.5px;font-weight:800;background:#690B1B;color:#fff;padding:1px 6px;border-radius:10px">${subj.score}%</span>
                            </div>
                            <p style="font-size:9px;color:#4B5563;margin:0;line-height:1.45">${esc(impTips[subj.name] || subj.tip)}</p>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                </div>
              `;
            })()}

            <div style="margin-top:12px;background:#FFFDFD;border:1.5px solid #690B1B20;border-radius:10px;padding:12px;font-size:9.5px;line-height:1.5;color:#374151">
              <strong style="color:#690B1B;font-size:10.5px;display:block;margin-bottom:4px">🚀 Grade 7-8 Academic Foundation Building</strong>
              To ensure smooth transition into higher classes, prioritize establishing deep conceptual clarity rather than rote memorization. Solve doubt logs weekly, read books outside the syllabus to expand vocabulary, and practice spatial puzzles to enhance logical deduction skills.
            </div>
          </div>
          ${mkFooter(pgOffset + 2)}
        </div>
      ` : `
        <!-- SENIOR PAGE 11: CAREER CLUSTER FITMENT & TOP CAREERS 1-3 -->
        <div class="as-pg">
          ${mkHeader("Career Mappings")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">📊 Career Fitment &amp; Recommendations</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Your fitment scores and top career recommendations (Careers 1–3)</div>
          
          <div class="as-pg-content">
            <div style="display:grid;grid-template-columns:1.1fr 1.6fr;gap:14px;align-items:stretch;height:auto;margin-top:4px">
              <!-- Left: Fitment scores -->
              <div style="border:1.5px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;display:flex;flex-direction:column;justify-content:flex-start;gap:8px">
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:10px;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;text-transform:uppercase">Career Cluster Fitment</div>
                  <div style="display:flex;flex-direction:column;gap:8px">
                    ${sc.careerFitment.slice(0, 8).map((c: any) => `
                      <div>
                        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#374151;margin-bottom:3px">
                          <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:145px">${esc(c.name)}</span>
                          <span>${c.score}%</span>
                        </div>
                        <div style="height:6px;background:#F3F4F6;border-radius:3.5px;overflow:hidden">
                          <div style="height:100%;background:${c.color || '#690B1B'};width:${c.score}%"></div>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
              
              <!-- Right: Careers 1-3 -->
              <div style="display:flex;flex-direction:column;gap:10px">
                ${(narrative.topCareers || []).slice(0, 3).map((c: any, i: number) => {
                  const cardColors = ['#690B1B', '#7E3AF2', '#057A55'];
                  const color = cardColors[i];
                  const fitScore = Math.max(10, 72 - i * 9);
                  const fitLabel = fitScore >= 65 ? 'Strong Fit' : 'Good Fit';
                  const fitBg = fitScore >= 65 ? '#057A55' : '#C9A55D';
                  
                  return `
                    <div style="border:1px solid ${color}30;border-radius:8px;padding:10px;background:#FFFDFD;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                        <span style="font-size:12px;font-weight:800;color:#111">${i + 1}. ${esc(c.name)}</span>
                        <span style="background:${fitBg};color:#fff;font-size:7px;font-weight:800;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.2px">${fitLabel}</span>
                      </div>
                      <p style="font-size:9px;color:#4B5563;line-height:1.45;margin-bottom:6px">${esc(c.description)}</p>
                      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;font-size:8px">
                        <div style="background:#fff;border:1px solid #E5E7EB;padding:4px;text-align:center;border-radius:4px">
                          <div style="color:#9CA3AF;font-size:6.5px;font-weight:600;text-transform:uppercase">Exam Pathway</div>
                          <div style="font-weight:800;color:#111;margin-top:2px">${esc(c.indianExam || "CUET")}</div>
                        </div>
                        <div style="background:#fff;border:1px solid #E5E7EB;padding:4px;text-align:center;border-radius:4px">
                          <div style="color:#9CA3AF;font-size:6.5px;font-weight:600;text-transform:uppercase">Avg Salary</div>
                          <div style="font-weight:800;color:${color};margin-top:2px">${esc(c.salaryRange)}</div>
                        </div>
                        <div style="background:#fff;border:1px solid #E5E7EB;padding:4px;text-align:center;border-radius:4px">
                          <div style="color:#9CA3AF;font-size:6.5px;font-weight:600;text-transform:uppercase">Fit Index</div>
                          <div style="font-weight:800;color:#111;margin-top:2px">${fitScore}%</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 2)}
        </div>
      `}

      <!-- PAGE 12 (JUNIOR: Aptitude & Personality / SENIOR: Careers 4-5 & Pathways) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Psychological Profile")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🧠 Aptitude &amp; Personality Profile</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Cognitive dimension scores and Big Five personality traits</div>
          
          <div class="as-pg-content" style="gap:10px">
            <!-- Aptitude Row -->
            <div style="border-bottom:1.5px solid #E5E7EB;padding-bottom:12px;display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🧠 COGNITIVE APTITUDE (Overall: ${sc.aptitude.overall}%)</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.cognitiveProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🧠 Cognitive Development Plan:</strong> 
                  • <em>Verbal:</em> Engage in daily structured reading and analytical debates.
                  • <em>Numerical:</em> Practice data-driven logic puzzles and quantitative drills.
                  • <em>Reasoning:</em> Solve systemic problems, algorithmic puzzles, and code blocks.
                  • <em>Spatial:</em> Visualize 3D coordinates, design models, and study geometric layouts.
                </div>
              </div>
              <div style="text-align:center">
                ${aptChartImg ? `<img src="${aptChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:5px">
                ${["verbal", "numerical", "reasoning", "spatial"].map((k, idx) => {
                  const val = sc.aptitude[k as keyof typeof sc.aptitude] as number;
                  const label = ["Verbal", "Numerical", "Reasoning", "Spatial"][idx];
                  const color = ["#690B1B", "#7E3AF2", "#057A55", "#C9A55D"][idx];
                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                        <span>${label}</span>
                        <span style="color:${color}">${val}%</span>
                      </div>
                      <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                        <div style="height:100%;background:${color};width:${val}%"></div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Personality Row -->
            <div style="display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center;padding-top:8px">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🌟 BIG FIVE PERSONALITY PROFILE</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.personalityProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🌟 Personality Success Strategy:</strong> 
                  • <em>Openness:</em> Seek interdisciplinary courses and artistic electives.
                  • <em>Conscientiousness:</em> Build detailed weekly checklists and exam review plans.
                  • <em>Extraversion:</em> Lead study groups and volunteer for public presentations.
                  • <em>Agreeableness:</em> Collaborate in peer-learning teams and mentor classmates.
                  • <em>Emotional Stability:</em> Practice structured mindfulness and time-allocation blocks.
                </div>
              </div>
              <div style="text-align:center">
                ${perChartImg ? `<img src="${perChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                ${[
                  ["Openness", sc.personality.openness, "#7E3AF2"],
                  ["Conscientiousness", sc.personality.conscientiousness, "#057A55"],
                  ["Extraversion", sc.personality.extraversion, "#690B1B"],
                  ["Agreeableness", sc.personality.agreeableness, "#C9A55D"],
                  ["Emotional Stability", sc.personality.emotionalStability, "#0694A2"]
                ].map(([label, val, color]: any) => `
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                      <span>${label}</span>
                      <span style="color:${color}">${val}%</span>
                    </div>
                    <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                      <div style="height:100%;background:${color};width:${val}%"></div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 3)}
        </div>
      ` : `
        <!-- SENIOR PAGE 12: CAREERS 4-5 & PATHWAYS -->
        <div class="as-pg">
          ${mkHeader("Academic Pathways")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🎯 Careers 4–5 &amp; Pathways</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Extended career recommendations and academic counseling channels</div>
          
          <div class="as-pg-content" style="gap:10px">
            <div style="display:grid;grid-template-columns:1.1fr 1.6fr;gap:14px;align-items:stretch;height:auto;margin-top:4px">
              <!-- Left: Careers 4-5 -->
              <div style="display:flex;flex-direction:column;gap:10px">
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;text-transform:uppercase">Extended Careers</div>
                ${(narrative.topCareers || []).slice(3, 5).map((c: any, i: number) => {
                  const idx = i + 3;
                  const cardColors = ['#C9A55D', '#0694A2'];
                  const color = cardColors[i];
                  const fitScore = Math.max(10, 72 - idx * 9);
                  return `
                    <div style="border:1px solid ${color}30;border-radius:8px;padding:10px;background:#FFFDFD;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                        <span style="font-size:11.5px;font-weight:800;color:#111">${idx + 1}. ${esc(c.name)}</span>
                        <span style="font-size:8.5px;color:#6B7280;font-weight:700">Fit Index: ${fitScore}%</span>
                      </div>
                      <p style="font-size:9px;color:#4B5563;line-height:1.45;margin-bottom:6px">${esc(c.description)}</p>
                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:8px">
                        <div style="background:#fff;border:1px solid #E5E7EB;padding:4px;text-align:center;border-radius:4px">
                          <div style="color:#9CA3AF;font-size:6.5px;font-weight:600;text-transform:uppercase">Exam Pathway</div>
                          <div style="font-weight:800;color:#111;margin-top:2px">${esc(c.indianExam || "CUET")}</div>
                        </div>
                        <div style="background:#fff;border:1px solid #E5E7EB;padding:4px;text-align:center;border-radius:4px">
                          <div style="color:#9CA3AF;font-size:6.5px;font-weight:600;text-transform:uppercase">Avg Salary</div>
                          <div style="font-weight:800;color:${color};margin-top:2px">${esc(c.salaryRange)}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
              
              <!-- Right: Pathways -->
              <div style="border-left:2px solid #E5E7EB;padding-left:16px;display:flex;flex-direction:column;justify-content:flex-start;gap:12px">
                <!-- Indian path -->
                ${hasDomestic ? `
                  <div style="margin-bottom:12px">
                    <div style="font-size:10.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:6px;border-bottom:1px solid #E5E7EB;padding-bottom:3px">🇮🇳 Indian Academic Pathway</div>
                    <div style="font-size:9px;color:#374151;line-height:1.5;margin-bottom:5px">
                      <strong>Recommended Stream &amp; Electives:</strong> ${esc(narrative.indianCounselling?.streamAdvice || "")}
                    </div>
                    ${narrative.indianCounselling?.entranceExams?.length ? `
                      <div style="font-size:9px;color:#4B5563;margin-bottom:5px">
                        <strong>Required Entrance Exams:</strong> ${narrative.indianCounselling.entranceExams.slice(0, 3).join(", ")}
                      </div>
                    ` : ""}
                    ${narrative.indianCounselling?.topColleges?.length ? `
                      <div style="font-size:9px;color:#4B5563">
                        <strong>Target Institutions:</strong> ${narrative.indianCounselling.topColleges.slice(0, 4).join(", ")}
                      </div>
                    ` : ""}
                  </div>
                ` : ""}
                
                <!-- Global path -->
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:6px;border-bottom:1px solid #E5E7EB;padding-bottom:3px">✈️ Global Study Advice</div>
                  ${(() => {
                    const topCareerName = (narrative.topCareers?.[0]?.name) || sc.careerFitment[0]?.name || "";
                    const dynamicAbroad = careerAbroadData[topCareerName] || (narrative.studyAbroad && narrative.studyAbroad.countries?.length ? narrative.studyAbroad : getDynamicStudyAbroad(topCareerName, student.name));
                    return `
                      <div style="font-size:9px;color:#374151;line-height:1.5;margin-bottom:5px">
                        <strong>Strategic Rationale:</strong> ${esc(dynamicAbroad.rationale)}
                      </div>
                      <div style="font-size:9px;color:#4B5563">
                        <strong>Primary Destinations:</strong> ${dynamicAbroad.countries.slice(0, 3).map((c: any) => c.name).join(", ")}
                      </div>
                    `;
                  })()}
                </div>
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 3)}
        </div>
        ${renderRoadmaps(pgOffset + 4)}
      `}

      <!-- PAGE 13 (JUNIOR: RIASEC & VARK / SENIOR: Aptitude & Personality) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Psychological Profile")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🎯 Interests &amp; Learning Preferences</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Vocational interest mapping (RIASEC) and VARK learning modalities</div>
          
          <div class="as-pg-content" style="gap:10px">
            <!-- RIASEC Row -->
            <div style="border-bottom:1.5px solid #E5E7EB;padding-bottom:12px;display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🎯 OCCUPATIONAL INTERESTS (Holland Code)</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.interestProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🎯 Vocational Theme Application:</strong> Apply Holland Code strengths by selecting relevant electives. Focus on scientific fairs (Investigative), creative writing (Artistic), and leadership models (Enterprising).
                </div>
              </div>
              <div style="text-align:center">
                ${riaChartImg ? `<img src="${riaChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px">
                ${Object.entries(sc.riasec).sort((a: any, b: any) => b[1] - a[1]).map(([code, val]: any) => {
                  const full = riasecLabels[code as keyof typeof riasecLabels] || rn[code as keyof typeof rn] || code;
                  const colors: Record<string, string> = { R: "#C9A55D", I: "#690B1B", A: "#690B1B", S: "#057A55", E: "#7E3AF2", C: "#0694A2" };
                  const col = colors[code] || "#690B1B";
                  return `
                    <div style="border:1px solid ${col}20;border-radius:6px;padding:5px 2px;text-align:center;background:#FFFDFD;box-shadow:0 1px 2px rgba(0,0,0,0.01)">
                      <div style="font-size:11px;font-weight:900;color:${col}">${code}</div>
                      <div style="font-size:7px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(full.split(" ")[0])}</div>
                      <div style="font-size:8.5px;font-weight:800;color:${col}">${val}%</div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- VARK Row -->
            <div style="display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center;padding-top:8px">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">📚 VARK LEARNING MODALITIES</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.learningProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>📚 VARK Study Techniques:</strong>
                  • <em>Visual:</em> Concept maps &amp; color notes.
                  • <em>Auditory:</em> Group discussion &amp; explain concepts aloud.
                  • <em>Read/Write:</em> Detail lists &amp; slides.
                  • <em>Kinesthetic:</em> Practice mock tests &amp; practical experiments.
                </div>
              </div>
              <div style="text-align:center">
                ${vkChartImg ? `<img src="${vkChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:5px">
                ${Object.entries(sc.vark).map(([code, val]: any) => {
                  const full = varkLabels[code as keyof typeof varkLabels] || vn[code as keyof typeof vn] || code;
                  const colors: Record<string, string> = { V: "#690B1B", A: "#7E3AF2", R: "#057A55", K: "#C9A55D" };
                  const color = colors[code] || "#C9A55D";
                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                        <span>${full}</span>
                        <span style="color:${color}">${val}%</span>
                      </div>
                      <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                        <div style="height:100%;background:${color};width:${val}%"></div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 4)}
        </div>
      ` : `
        <!-- SENIOR PAGE 13: APTITUDE & PERSONALITY PROFILE -->
        <div class="as-pg">
          ${mkHeader("Psychological Profile")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🧠 Aptitude &amp; Personality Profile</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Cognitive dimension scores and Big Five personality traits</div>
          
          <div class="as-pg-content" style="gap:10px">
            <!-- Aptitude Row -->
            <div style="border-bottom:1.5px solid #E5E7EB;padding-bottom:12px;display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🧠 COGNITIVE APTITUDE (Overall: ${sc.aptitude.overall}%)</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.cognitiveProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🧠 Cognitive Development Plan:</strong> 
                  • <em>Verbal:</em> Engage in daily structured reading and analytical debates.
                  • <em>Numerical:</em> Practice data-driven logic puzzles and quantitative drills.
                  • <em>Reasoning:</em> Solve systemic problems, algorithmic puzzles, and code blocks.
                  • <em>Spatial:</em> Visualize 3D coordinates, design models, and study geometric layouts.
                </div>
              </div>
              <div style="text-align:center">
                ${aptChartImg ? `<img src="${aptChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:5px">
                ${["verbal", "numerical", "reasoning", "spatial"].map((k, idx) => {
                  const val = sc.aptitude[k as keyof typeof sc.aptitude] as number;
                  const label = ["Verbal", "Numerical", "Reasoning", "Spatial"][idx];
                  const color = ["#690B1B", "#7E3AF2", "#057A55", "#C9A55D"][idx];
                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                        <span>${label}</span>
                        <span style="color:${color}">${val}%</span>
                      </div>
                      <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                        <div style="height:100%;background:${color};width:${val}%"></div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Personality Row -->
            <div style="display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center;padding-top:8px">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🌟 BIG FIVE PERSONALITY PROFILE</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.personalityProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🌟 Personality Success Strategy:</strong> 
                  • <em>Openness:</em> Seek interdisciplinary courses and artistic electives.
                  • <em>Conscientiousness:</em> Build detailed weekly checklists and exam review plans.
                  • <em>Extraversion:</em> Lead study groups and volunteer for public presentations.
                  • <em>Agreeableness:</em> Collaborate in peer-learning teams and mentor classmates.
                  • <em>Emotional Stability:</em> Practice structured mindfulness and time-allocation blocks.
                </div>
              </div>
              <div style="text-align:center">
                ${perChartImg ? `<img src="${perChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                ${[
                  ["Openness", sc.personality.openness, "#7E3AF2"],
                  ["Conscientiousness", sc.personality.conscientiousness, "#057A55"],
                  ["Extraversion", sc.personality.extraversion, "#690B1B"],
                  ["Agreeableness", sc.personality.agreeableness, "#C9A55D"],
                  ["Emotional Stability", sc.personality.emotionalStability, "#0694A2"]
                ].map(([label, val, color]: any) => `
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                      <span>${label}</span>
                      <span style="color:${color}">${val}%</span>
                    </div>
                    <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                      <div style="height:100%;background:${color};width:${val}%"></div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 4 + roadmapPagesCount)}
        </div>
      `}

      <!-- PAGE 14 (JUNIOR: Values & Powers / SENIOR: RIASEC & VARK) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Career Mappings")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">💼 Values, Talents &amp; Activities</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Work motivators, cognitive superpowers and extracurricular suggestions</div>
          
          <div class="as-pg-content" style="gap:10px">
            <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:16px;align-items:stretch;height:auto;margin-top:4px">
              <!-- Left: Career Values Chart -->
              <div style="border:1.5px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;display:flex;flex-direction:column;justify-content:flex-start;gap:8px">
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;margin-bottom:8px;text-transform:uppercase">💼 Career Values</div>
                  <div style="text-align:center;margin:10px 0">
                    ${valChartImg ? `<img src="${valChartImg}" style="height:110px;object-fit:contain" />` : ""}
                  </div>
                  <p style="font-size:9px;color:#4B5563;line-height:1.5;text-align:justify;margin-bottom:8px">${esc(narrative.psychologicalSummary?.valuesProfile)}</p>
                  <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                    <strong>💼 Core Work Values:</strong> Align your focus with career paths matching your motivators (e.g. leadership autonomy, high financial security, or social impact assistance).
                  </div>
                </div>
              </div>
              
              <!-- Right: Powers & Activities -->
              <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:12px">
                <!-- Powers -->
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:8px;border-bottom:1.5px solid #690B1B15;padding-bottom:3px">⚡ Cognitive Superpowers</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                    <div style="border:1px solid #690B1B15;border-radius:8px;padding:8px;background:#FFFDFD;text-align:center;box-shadow:0 1px 2px rgba(105,11,27,0.01)">
                      <div style="font-size:9.5px;font-weight:800;color:#690B1B;margin-bottom:4px">
                        ${sc.aptitude.numerical >= Math.max(sc.aptitude.verbal, sc.aptitude.reasoning, sc.aptitude.spatial) ? "Number Ninja" :
                          sc.aptitude.verbal >= Math.max(sc.aptitude.numerical, sc.aptitude.reasoning, sc.aptitude.spatial) ? "Communication Wizard" :
                          sc.aptitude.reasoning >= Math.max(sc.aptitude.verbal, sc.aptitude.numerical, sc.aptitude.spatial) ? "Logic Mastermind" : "Visual Architect"}
                      </div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.35">Primary cognitive talent. Processes info naturally.</div>
                    </div>
                    <div style="border:1px solid #C9A55D15;border-radius:8px;padding:8px;background:#FFFDFB;text-align:center;box-shadow:0 1px 2px rgba(201,165,93,0.01)">
                      <div style="font-size:9.5px;font-weight:800;color:#C9A55D;margin-bottom:4px">Style: ${vn[sc.topVark] || "Visual"}</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.35">Dominant learning style. Absorbs material fastest.</div>
                    </div>
                  </div>
                </div>

                <!-- Activities -->
                <div style="margin-top:10px">
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:8px;border-bottom:1.5px solid #690B1B15;padding-bottom:3px">🌟 Extracurricular Activities</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:8px;background:#fff">
                      <div style="font-size:8.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:3px">Clubs</div>
                      <div style="font-size:9px;font-weight:700;color:#111;margin-bottom:2px">
                        ${sc.topRiasec[0] === 'I' || sc.topRiasec[0] === 'R' ? "Science &amp; Robotics" : "Debate &amp; MUNs"}
                      </div>
                      <div style="font-size:8px;color:#6B7280;line-height:1.3">Olympiads or engineering models, or debate public speaking.</div>
                    </div>
                    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:8px;background:#fff">
                      <div style="font-size:8.5px;font-weight:800;color:#057A55;text-transform:uppercase;margin-bottom:3px">Creative / Sports</div>
                      <div style="font-size:9px;font-weight:700;color:#111;margin-bottom:2px">
                        ${sc.aptitude.spatial >= 60 ? "Arts &amp; Design" : "Team Athletics"}
                      </div>
                      <div style="font-size:8px;color:#6B7280;line-height:1.3">Painting or UI design, or athletic physical fitness.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 5)}
        </div>
      ` : `
        <!-- SENIOR PAGE 14: INTERESTS & LEARNING PREFERENCES (RIASEC & VARK) -->
        <div class="as-pg">
          ${mkHeader("Psychological Profile")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🎯 Interests &amp; Learning Preferences</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Vocational interest mapping (RIASEC) and VARK learning modalities</div>
          
          <div class="as-pg-content" style="gap:10px">
            <!-- RIASEC Row -->
            <div style="border-bottom:1.5px solid #E5E7EB;padding-bottom:12px;display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">🎯 OCCUPATIONAL INTERESTS (Holland Code)</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.interestProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>🎯 Vocational Theme Application:</strong> Apply Holland Code strengths by selecting relevant electives. Focus on scientific fairs (Investigative), creative writing (Artistic), and leadership models (Enterprising).
                </div>
              </div>
              <div style="text-align:center">
                ${riaChartImg ? `<img src="${riaChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:5px">
                ${Object.entries(sc.riasec).sort((a: any, b: any) => b[1] - a[1]).map(([code, val]: any) => {
                  const full = riasecLabels[code as keyof typeof riasecLabels] || rn[code as keyof typeof rn] || code;
                  const colors: Record<string, string> = { R: "#C9A55D", I: "#690B1B", A: "#690B1B", S: "#057A55", E: "#7E3AF2", C: "#0694A2" };
                  const col = colors[code] || "#690B1B";
                  return `
                    <div style="border:1px solid ${col}20;border-radius:6px;padding:5px 2px;text-align:center;background:#FFFDFD;box-shadow:0 1px 2px rgba(0,0,0,0.01)">
                      <div style="font-size:11px;font-weight:900;color:${col}">${code}</div>
                      <div style="font-size:7px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(full.split(" ")[0])}</div>
                      <div style="font-size:8.5px;font-weight:800;color:${col}">${val}%</div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- VARK Row -->
            <div style="display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:16px;align-items:center;padding-top:8px">
              <div>
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;margin-bottom:6px">📚 VARK LEARNING MODALITIES</div>
                <p style="font-size:9px;color:#4B5563;line-height:1.55;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.learningProfile)}</p>
                <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                  <strong>📚 VARK Study Techniques:</strong>
                  • <em>Visual:</em> Concept maps &amp; color notes.
                  • <em>Auditory:</em> Group discussion &amp; explain concepts aloud.
                  • <em>Read/Write:</em> Detail lists &amp; slides.
                  • <em>Kinesthetic:</em> Practice mock tests &amp; practical experiments.
                </div>
              </div>
              <div style="text-align:center">
                ${vkChartImg ? `<img src="${vkChartImg}" style="height:105px;object-fit:contain" />` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:5px">
                ${Object.entries(sc.vark).map(([code, val]: any) => {
                  const full = varkLabels[code as keyof typeof varkLabels] || vn[code as keyof typeof vn] || code;
                  const colors: Record<string, string> = { V: "#690B1B", A: "#7E3AF2", R: "#057A55", K: "#C9A55D" };
                  const color = colors[code] || "#C9A55D";
                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;font-size:8.5px;font-weight:700;color:#374151;margin-bottom:2px">
                        <span>${full}</span>
                        <span style="color:${color}">${val}%</span>
                      </div>
                      <div style="height:5px;background:#F3F4F6;border-radius:2.5px;overflow:hidden">
                        <div style="height:100%;background:${color};width:${val}%"></div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 5 + roadmapPagesCount)}
        </div>
      `}

      <!-- PAGE 15 (JUNIOR: Pathways / SENIOR: Values & Roadmap Timeline) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Academic Pathways")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🎓 Streams &amp; Global Study</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">High school stream recommendation and global university pathways</div>
          
          <div class="as-pg-content" style="gap:10px">
            <div style="display:grid;grid-template-columns:1.1fr 1.6fr;gap:14px;align-items:stretch;height:auto;margin-top:4px">
              <!-- Left: Stream advice -->
              <div style="border-right:2px solid #E5E7EB;padding-right:16px;display:flex;flex-direction:column;justify-content:flex-start;gap:12px">
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;margin-bottom:8px;text-transform:uppercase">Stream Suitability</div>
                  <p style="font-size:9px;color:#374151;line-height:1.55;text-align:justify">
                    ${sc.careerFitment[0]?.name.toLowerCase().includes("science") ? 
                      "PCM/PCB recommended for class 11. Focus on advanced mathematics and logic systems." :
                      sc.careerFitment[0]?.name.toLowerCase().includes("commerce") || sc.careerFitment[0]?.name.toLowerCase().includes("business") ?
                      "Commerce &amp; Humanities recommended. Developing commercial math, logic, and economics foundations." :
                      "Humanities/Arts recommended. Focus on creative design and qualitative writing skills."}
                  </p>
                </div>
                <div style="margin-top:10px">
                  <div style="font-size:9.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:4px">🚀 Grade Progression Tips</div>
                  <div style="font-size:8.5px;color:#4B5563;line-height:1.45">
                    • Resolve learning gaps early.<br>
                    • Maintain a 2-hour daily study routine.
                  </div>
                </div>
              </div>
              
              <!-- Right: Study Abroad advice -->
              <div style="display:flex;flex-direction:column;justify-content:flex-start;gap:12px">
                ${(() => {
                  const juniorTopCareer = sc.careerFitment[0]?.name || "";
                  const dynamicAbroad = careerAbroadData[juniorTopCareer] || (narrative.studyAbroad && narrative.studyAbroad.countries?.length ? narrative.studyAbroad : getDynamicStudyAbroad(juniorTopCareer, student.name));
                  return `
                    <div>
                      <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;margin-bottom:8px;text-transform:uppercase">✈️ Global Study Plan</div>
                      <p style="font-size:9px;color:#374151;line-height:1.55;text-align:justify">
                        <strong>Rationale:</strong> ${esc(dynamicAbroad.rationale)}
                      </p>
                    </div>
                    <div style="margin-top:10px">
                      <div style="font-size:9px;font-weight:800;color:#9CA3AF;text-transform:uppercase;margin-bottom:4px;letter-spacing:.3px">🌍 Countries &amp; Scholarships</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.4">
                        <strong>Countries:</strong> ${dynamicAbroad.countries.slice(0, 3).map((c: any) => c.name).join(", ")}<br>
                        <strong>Scholarships:</strong> ${dynamicAbroad.scholarships.slice(0, 2).join(", ")}
                      </div>
                    </div>
                  `;
                })()}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 6)}
        </div>
        ${renderRoadmaps(pgOffset + 7)}
      ` : `
        <!-- SENIOR PAGE 15: CAREER VALUES & TIMELINE -->
        <div class="as-pg">
          ${mkHeader("Career Roadmap")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🗺️ Academic &amp; Profile Roadmap</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Career drivers and educational progression milestones</div>
          
          <div class="as-pg-content" style="gap:10px">
            <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:14px;align-items:stretch;height:auto;margin-top:4px">
              <!-- Left: Career Values Chart -->
              <div style="border:1.5px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;display:flex;flex-direction:column;justify-content:flex-start;gap:8px">
                <div>
                  <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;margin-bottom:8px;text-transform:uppercase">💼 Career Values</div>
                  <div style="text-align:center;margin:10px 0">
                    ${valChartImg ? `<img src="${valChartImg}" style="height:110px;object-fit:contain" />` : ""}
                  </div>
                  <p style="font-size:9px;color:#4B5563;line-height:1.5;text-align:justify;margin-bottom:6px;max-height:81px;overflow:hidden;display:block">${esc(narrative.psychologicalSummary?.valuesProfile)}</p>
                  <div style="font-size:7.5px;color:#4B5563;line-height:1.35;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:6px 10px">
                    <strong>💼 Core Work Values:</strong> Align your focus with career paths matching your motivators (e.g. autonomy, financial security, or social impact).
                  </div>
                </div>
              </div>
              
              <!-- Right: Roadmap Timeline -->
              <div style="display:flex;flex-direction:column;gap:3px;justify-content:flex-start;position:relative">
                <div style="font-size:10.5px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:5px;margin-bottom:4px;text-transform:uppercase">🗺️ Academic &amp; Profile Roadmap</div>
                <div style="position:absolute;left:11px;top:40px;bottom:15px;width:1.5px;border-left:1.5px dashed #690B1B30;z-index:1"></div>
                ${[
                  { key: "grade12", lbl: `Grade ${student.grade}–12`, icon: "📚" },
                  { key: "graduation", lbl: "Graduation", icon: "🎓" },
                  { key: "postGrad", lbl: "Post-Grad", icon: "📜" },
                  { key: "career", lbl: "Early Career", icon: "💼" },
                  { key: "studyAbroad", lbl: "Global Path", icon: "✈️" }
                ].map((s: any) => {
                  const rm = reportData.roadmap?.[s.key];
                  if (!rm) return "";
                  return `
                    <div style="border:1px solid #E5E7EB;border-radius:6px;padding:4px 6px;background:#fff;display:flex;align-items:flex-start;gap:6px;position:relative;z-index:2;box-shadow:0 1px 2px rgba(0,0,0,0.01)">
                      <span style="font-size:11px;background:#FFF8F8;border:1.5px solid #690B1B15;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">${s.icon}</span>
                      <div style="flex-grow:1">
                        <div style="font-size:9.5px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:2px">${s.lbl} · ${esc(rm.title)}</div>
                        <div style="font-size:8px;color:#4B5563;line-height:1.35">
                          ${(rm.actions || []).slice(0, 1).map((act: string) => `• ${esc(act)}`).join("<br>")}
                        </div>
                        ${rm.targetDegree ? `<div style="margin-top:3px"><span style="display:inline-block;background:#FFF8F8;border:1px solid rgba(105,11,27,.15);border-radius:4px;padding:2px 4px;font-size:7.5px;font-weight:700;color:#690B1B">🎓 ${esc(rm.targetDegree)}</span></div>` : ""}
                        ${rm.targetColleges?.length ? `<div style="margin-top:3px"><span style="font-size:7px;font-weight:700;color:#9CA3AF;text-transform:uppercase;margin-right:3px">Target Colleges:</span><span style="line-height:1.4">${rm.targetColleges.slice(0, 2).map((c: string) => `<span style="display:inline-block;background:#F9FAFB;border:1px solid #E5E7EB;padding:1px 3px;border-radius:3px;font-size:7px;font-weight:600;color:#374151;margin-right:2px;margin-bottom:2px">${esc(c)}</span>`).join("")}</span></div>` : ""}
                        ${rm.salaryTrajectory?.length ? `<div style="margin-top:3px"><span style="font-size:7px;font-weight:700;color:#9CA3AF;text-transform:uppercase;margin-right:3px">Expected Pay:</span><span style="line-height:1.4">${rm.salaryTrajectory.slice(0, 2).map((s: string) => `<span style="display:inline-block;background:#F0FDF4;border:1px solid rgba(5,122,85,.2);color:#057A55;padding:1px 4px;border-radius:10px;font-size:7px;font-weight:700;margin-right:2px;margin-bottom:2px">💰 ${esc(s)}</span>`).join("")}</span></div>` : ""}
                        ${rm.targetCompanies?.length ? `<div style="margin-top:3px"><span style="font-size:7px;font-weight:700;color:#9CA3AF;text-transform:uppercase;margin-right:3px">Top Companies:</span><span style="line-height:1.4">${rm.targetCompanies.slice(0, 2).map((c: string) => `<span style="display:inline-block;background:#F9FAFB;border:1px solid #E5E7EB;padding:1px 3px;border-radius:3px;font-size:7px;font-weight:600;color:#374151;margin-right:2px;margin-bottom:2px">🏢 ${esc(c)}</span>`).join("")}</span></div>` : ""}
                        ${rm.targetUniversities?.length ? `<div style="margin-top:3px"><span style="font-size:7px;font-weight:700;color:#9CA3AF;text-transform:uppercase;margin-right:3px">Top Universities:</span><span style="line-height:1.4">${rm.targetUniversities.slice(0, 2).map((u: string) => `<span style="display:inline-block;background:#F9FAFB;border:1px solid #E5E7EB;padding:1px 3px;border-radius:3px;font-size:7px;font-weight:600;color:#374151;margin-right:2px;margin-bottom:2px">🌍 ${esc(u)}</span>`).join("")}</span></div>` : ""}
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 6 + roadmapPagesCount)}
        </div>
      `}

      <!-- PAGE 16 (JUNIOR: 12-Month Plan or 4-Year Matrix / SENIOR: Action Plan & Psychologist Advisory) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Execution Plan")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">🗺️ Career Progression Roadmap</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Milestones, active execution quotas, and profile-building steps</div>
          
          <div class="as-pg-content" style="gap:10px;justify-content:flex-start">
            ${(student.grade === "7" || student.grade === "8") ? `
              <div style="font-size:11px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #690B1B;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">📅 12-Month Academic &amp; Profile Plan Summary</div>
              ${render12MonthPlan()}
            ` : `
              <div style="font-size:11px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #690B1B;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">✈️ 4-Year Academic &amp; Profile Building Matrix (Active Tasks Only)</div>
              ${renderRoadmapTimeline()}
            `}
          </div>
          ${mkFooter(pgOffset + 7 + roadmapPagesCount)}
        </div>
      ` : `
        <!-- SENIOR PAGE 16: ACTION PLAN & PSYCHOLOGIST ADVISORY -->
        <div class="as-pg">
          ${mkHeader("Execution Plan")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">⚡ Action Plan &amp; Psychologist Advisory</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Immediate next steps, cognitive reflections, and counselor sign-off</div>
          
          <div class="as-pg-content" style="gap:14px;justify-content:flex-start">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;height:auto">
              <!-- Left: Action plan -->
              <div style="border:1px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;display:flex;flex-direction:column;justify-content:flex-start;gap:8px;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                <div>
                  <div style="font-size:10px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">⚡ IMMEDIATE ACTION PLAN</div>
                  ${narrative.actionPlan?.thisMonth?.length ? `
                    <div style="border:1px solid #690B1B15;padding:8px;background:#FFFDFD;border-radius:6px;margin-bottom:8px">
                      <div style="font-size:8px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:3px;letter-spacing:.3px">📅 This Month</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.4">
                        ${narrative.actionPlan.thisMonth.slice(0, 3).map((a: string) => `• ${esc(a)}`).join("<br>")}
                      </div>
                    </div>
                  ` : ""}
                  ${narrative.actionPlan?.thisYear?.length ? `
                    <div style="border:1px solid #E5E7EB;padding:8px;background:#fff;border-radius:6px">
                      <div style="font-size:8px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:3px;letter-spacing:.3px">📆 This Year</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.4">
                        ${narrative.actionPlan.thisYear.slice(0, 3).map((a: string) => `• ${esc(a)}`).join("<br>")}
                      </div>
                    </div>
                  ` : ""}
                </div>
              </div>
              
              <!-- Right: Psychological profile advisory -->
              <div style="border:1px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                <div style="font-size:10px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">🧠 PSYCHOLOGIST ADVISORY PROFILE</div>
                <p style="font-size:7.5px;color:#374151;line-height:1.45;text-align:justify;max-height:165px;overflow:hidden;display:block">
                  ${esc(narrative.psychologicalSummary?.overallPsychProfile || "")}
                </p>
              </div>
            </div>

            <!-- Bottom: Sign-off -->
            <div style="border-top:2px solid #E5E7EB;padding-top:12px;margin-top:auto">
              <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:16px;align-items:center">
                <div style="font-size:8.5px;color:#6B7280;line-height:1.5;text-align:justify">
                  <strong>📜 Disclaimer:</strong> This advisory dossier is computed utilizing cognitive frameworks, a Big Five profile scale, RIASEC interest constructs, and vocational core values scales. Standardized algorithms compile these mappings, but career planning should integrate local counseling and mentor-guided reflection.
                </div>
                <div style="border:1px solid #690B1B30;border-radius:8px;padding:10px;text-align:center;background:#FFF8F8;box-shadow:0 1px 2px rgba(105,11,27,0.02)">
                  <div style="font-family:'Playfair Display', Georgia, serif;font-size:13px;font-weight:900;color:#690B1B">Abroad Simplified</div>
                  <div style="font-size:7px;color:#9CA3AF;text-transform:uppercase;margin-top:2px;letter-spacing:.5px;font-weight:700">Counselor Sign-off</div>
                  <div style="font-size:8.5px;font-weight:700;color:#374151;margin-top:4px">ID: ${esc(rid)}</div>
                </div>
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 7 + roadmapPagesCount)}
        </div>
      `}

      <!-- PAGE 17 (JUNIOR: Action Plan & Psychologist Advisory / SENIOR: skipped) -->
      ${(assessmentType === "junior") ? `
        <div class="as-pg">
          ${mkHeader("Execution Plan")}
          <div class="as-nv-pg-heading" style="margin-bottom:2px">⚡ Action Plan &amp; Psychologist Advisory</div>
          <div class="as-nv-pg-sub" style="margin-bottom:10px">Immediate next steps, cognitive reflections, and counselor sign-off</div>
          
          <div class="as-pg-content" style="gap:14px;justify-content:flex-start">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;height:auto">
              <!-- Left: Action plan -->
              <div style="border:1px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;display:flex;flex-direction:column;justify-content:flex-start;gap:8px;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                <div>
                  <div style="font-size:10px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">⚡ IMMEDIATE ACTION PLAN</div>
                  ${narrative.actionPlan?.thisMonth?.length ? `
                    <div style="border:1px solid #690B1B15;padding:8px;background:#FFFDFD;border-radius:6px;margin-bottom:8px">
                      <div style="font-size:8px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:3px;letter-spacing:.3px">📅 This Month</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.4">
                        ${narrative.actionPlan.thisMonth.slice(0, 3).map((a: string) => `• ${esc(a)}`).join("<br>")}
                      </div>
                    </div>
                  ` : ""}
                  ${narrative.actionPlan?.thisYear?.length ? `
                    <div style="border:1px solid #E5E7EB;padding:8px;background:#fff;border-radius:6px">
                      <div style="font-size:8px;font-weight:800;color:#690B1B;text-transform:uppercase;margin-bottom:3px;letter-spacing:.3px">📆 This Year</div>
                      <div style="font-size:8.5px;color:#4B5563;line-height:1.4">
                        ${narrative.actionPlan.thisYear.slice(0, 3).map((a: string) => `• ${esc(a)}`).join("<br>")}
                      </div>
                    </div>
                  ` : ""}
                </div>
              </div>
              
              <!-- Right: Psychological profile advisory -->
              <div style="border:1px solid #E5E7EB;border-radius:10px;padding:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.01)">
                <div style="font-size:10px;font-weight:800;color:#690B1B;border-bottom:1.5px solid #E5E7EB;padding-bottom:4px;margin-bottom:8px;text-transform:uppercase">🧠 PSYCHOLOGIST ADVISORY PROFILE</div>
                <p style="font-size:7.5px;color:#374151;line-height:1.45;text-align:justify;max-height:165px;overflow:hidden;display:block">
                  ${esc(narrative.psychologicalSummary?.overallPsychProfile || "")}
                </p>
              </div>
            </div>

            <!-- Bottom: Sign-off -->
            <div style="border-top:2px solid #E5E7EB;padding-top:12px;margin-top:auto">
              <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:16px;align-items:center">
                <div style="font-size:8.5px;color:#6B7280;line-height:1.5;text-align:justify">
                  <strong>📜 Disclaimer:</strong> This advisory dossier is computed utilizing cognitive frameworks, a Big Five profile scale, RIASEC interest constructs, and vocational core values scales. Standardized algorithms compile these mappings, but career planning should integrate local counseling and mentor-guided reflection.
                </div>
                <div style="border:1px solid #690B1B30;border-radius:8px;padding:10px;text-align:center;background:#FFF8F8;box-shadow:0 1px 2px rgba(105,11,27,0.02)">
                  <div style="font-family:'Playfair Display', Georgia, serif;font-size:13px;font-weight:900;color:#690B1B">Abroad Simplified</div>
                  <div style="font-size:7px;color:#9CA3AF;text-transform:uppercase;margin-top:2px;letter-spacing:.5px;font-weight:700">Counselor Sign-off</div>
                  <div style="font-size:8.5px;font-weight:700;color:#374151;margin-top:4px">ID: ${esc(rid)}</div>
                </div>
              </div>
            </div>
          </div>
          ${mkFooter(pgOffset + 8 + roadmapPagesCount)}
        </div>
      ` : ""}

      <!-- CAREER ROADMAP PAGES (for both junior and senior) -->
      

      <!-- BACK COVER -->
      <div class="as-pg" style="background: linear-gradient(135deg,#4F0813 0%,#1F0104 100%); padding: 0 !important;">
        <div style="position:absolute;top:20px;bottom:20px;left:20px;right:20px;border:1px solid rgba(201,165,93,0.25);border-radius:10px;pointer-events:none"></div>
        <div class="as-pg-content" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 60px 60px 40px; color: #fff; margin-top: 0; position:relative; z-index: 1">
          <div style="margin-top: auto; margin-bottom: auto; text-align: center;">
            <div style="font-size:13px;font-weight:800;letter-spacing:6px;color:#C9A55D;text-transform:uppercase;margin-bottom:28px">ABROAD SIMPLIFIED</div>
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:38px;font-weight:900;line-height:1.25;margin-bottom:20px;letter-spacing:-1px">Begin Your Future Today</div>
            <div style="width:60px;height:2.5px;background:#C9A55D;margin:0 auto 28px"></div>
            <div style="font-size:13.5px;color:rgba(255,255,255,.8);max-width:440px;line-height:1.85;margin:0 auto;text-align:center">
              "The best way to predict the future is to create it." This report is your strategic roadmap. Reflect on these insights, consult with mentors, and take bold steps towards your academic and global career goals.
            </div>
          </div>
          
          <div style="width: 100%; border-top: 1px solid rgba(255,255,255,.12); padding-top: 24px; text-align: center;">
            <div style="font-size:11px;color:rgba(255,255,255,.6);margin-bottom:8px">Have questions about your pathway? Connect with our expert advisors.</div>
            <div style="font-size:11.5px;font-weight:800;color:#C9A55D">www.abroadsimplified.com · support@abroadsimplified.com</div>
            <div style="font-size:8.5px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:2px;margin-top:24px">© 2026 ABROAD SIMPLIFIED · ALL RIGHTS RESERVED</div>
          </div>
        </div>
      </div>
    `
    : `
      <!-- PAGE 11: LOCKED VIEW -->
      <div class="as-pg" style="background:#FFF8F8;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:40px;box-sizing:border-box">
        <div style="font-size:64px;margin-bottom:20px">🔒</div>
        <div style="font-family:'Playfair Display', Georgia, serif;font-size:26px;font-weight:900;color:#690B1B;margin-bottom:12px;line-height:1.2">
          Report Section Locked
        </div>
        <div style="font-size:12.5px;color:#374151;max-width:480px;line-height:1.7;margin-bottom:28px">
          You are viewing the free tier of the <strong>Career Advisory Dossier</strong> for ${esc(student.name)}.<br><br>
          Unlock the next 5 pages to access:
          <div style="text-align:left;margin:16px auto;max-width:340px;font-size:11.5px;color:#4B5563;line-height:1.6">
            • 🎯 <strong>Top Career Recommendations:</strong> 5 detailed match fields.<br>
            • 🧠 <strong>Detailed Cognitive Aptitude:</strong> Verbal, Numerical, Spatial &amp; Reasoning.<br>
            • 🌟 <strong>Big Five Personality Assessment:</strong> Openness, Conscientiousness &amp; drivers.<br>
            • 🎯 <strong>Holland Code (RIASEC):</strong> Environment &amp; vocational interest breakdown.<br>
            • 🗺️ <strong>Action Plan &amp; Roadmap:</strong> Target colleges, entrance exams &amp; milestones.
          </div>
        </div>
        <div style="border:1px dashed #690B1B40;background:#fff;border-radius:8px;padding:12px 20px;font-size:12.5px;font-weight:700;color:#690B1B">
          Unlock the complete report on the portal for just ₹49.
        </div>
        ${mkFooter(pgOffset + 2)}
      </div>
    `} `;

    printWin.document.open();
    printWin.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Career Advisory Dossier — ${esc(student.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11.5px; color: #111; background: #fff; line-height: 1.6; font-weight: normal; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 0; size: A4; }
    .as-pg { 
      page-break-after: always; 
      break-after: page; 
      width: 155.555mm; 
      height: 219.407mm; 
      padding: 17.777mm 11.851mm 13.333mm 11.851mm; 
      box-sizing: border-box; 
      position: relative; 
      background: #fff;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform: scale(1.35);
transform-origin: top left;
margin-bottom: 76.792mm;
margin-right: 54.444mm;
      
      
      
    }
    .as-pg:last-child { page-break-after: auto; break-after: auto; }
    .as-nv-hdr {
      position: absolute;
      top: 7.407mm;
      left: 11.851mm;
      right: 11.851mm;
      height: 8.888mm;
      box-sizing: border-box;
    }
    .as-nv-ftr {
      position: absolute;
      bottom: 5.925mm;
      left: 11.851mm;
      right: 11.851mm;
      height: 7.407mm;
      box-sizing: border-box;
    }
    .as-nv-cover { 
      background: linear-gradient(135deg,#4F0813 0%,#1F0104 100%); 
      color: #fff; 
      height: 219.407mm; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      text-align: center; 
      padding: 50px 60px !important; 
      position: relative; 
    }
    .as-nv-hdr-logo { 
      width: 30px; 
      height: 30px; 
      background: #690B1B; 
      border-radius: 4px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 11px; 
      font-weight: 900; 
      color: #fff; 
      flex-shrink: 0; 
    }
    .as-nv-hdr-brand { font-size: 13px; font-weight: 800; color: #111; letter-spacing: -.3px; }
    .as-nv-hdr-eng { font-size: 8px; color: #9CA3AF; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; margin-top: 1px; }
    .as-nv-career-item, .as-nv-score-desc-box, .as-nv-resp-table tr, .as-timeline-card { page-break-inside: avoid; break-inside: avoid; }
    .as-nv-pg-heading { font-family: Arial, Helvetica, sans-serif; font-size: 22px; font-weight: 900; color: #111; letter-spacing: -.5px; margin-bottom: 2px; }
    .as-nv-pg-sub { font-size: 11px; color: #9CA3AF; font-weight: 500; margin-bottom: 16px; }

    .as-pg-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 14px;
      width: 100%;
      height: 179.25mm;
      box-sizing: border-box;
      margin-top: 10px;
    }
  </style>
</head>
<body>
${bodyHTML}
<script>
  window.onload = function() {
    setTimeout(function() { window.focus(); window.print(); }, 400);
  };
</script>
</body>
</html>`);
    printWin.document.close();
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

      {/* ── LANDING SCREEN ─────────────────────────────────────────── */}
      {screen === "landing" && (
        <div className="as-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div className="as-hero">
            <div className="as-hero-bg" />
            <div className="as-hero-badge">🇮🇳 India's Most Comprehensive Career Assessment</div>
            <h1 className="as-hero-title">
              {assessmentType === "junior" ? (
                <>Discover Your <span className="r">Perfect</span> Career Path (7th–9th Grade)</>
              ) : assessmentType === "grade10" ? (
                <>Discover Your <span className="r">Perfect</span> Career Path (10th Grade)</>
              ) : (
                <>Discover Your <span className="r">Perfect</span> Career Path (12th Grade)</>
              )}
            </h1>
            <p className="as-hero-sub">
              {assessmentType === "junior" ? (
                "AI-powered psychometric assessment across 5 dimensions — built for Grade 7–9 students with India and Study Abroad pathways."
              ) : assessmentType === "grade10" ? (
                "AI-powered psychometric assessment across 5 dimensions — built for Grade 10 students with India and Study Abroad pathways."
              ) : (
                "AI-powered stream-specific psychometric assessment across 5 dimensions — built for Grade 11–12 students with India and Study Abroad pathways."
              )}
            </p>
            <div className="as-hero-cta">
              <button className="as-btn-primary" onClick={() => setShowTerms(true)}>Start Your Assessment →</button>
              <a href={`/psychometric-test/sample-report?type=${assessmentType}`} className="as-btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>See Sample Report</a>
            </div>
            <div className="as-hero-feats">
              {["100 Psychometric Questions", "5 Assessment Dimensions", "AI-Powered Analysis", "Detailed PDF Report", "India + Study Abroad"].map((f) => (
                <div className="as-hero-feat" key={f}><span className="dot" />{f}</div>
              ))}
            </div>
            <div className="as-hero-stats">
              <div className="as-hero-stat"><div className="n">100</div><div className="l">Questions</div></div>
              <div className="as-hero-stat"><div className="n">5</div><div className="l">Dimensions</div></div>
              <div className="as-hero-stat"><div className="n">15+</div><div className="l">Career Clusters</div></div>
            </div>
          </div>


        </div>
      )}

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
          ) : (
            <>
            <div className="as-report-wrap">
            {/* Hero */}
            <div className="as-rep-hero">
              <div className="as-rep-hero-top">
                <div>
                  <div className="as-rep-name">{student.name}</div>
                  <div className="as-rep-tags">
                    <span className="as-rep-tag">Grade {student.grade}</span>
                    {student.school && <span className="as-rep-tag">{student.school}</span>}
                    {student.city && <span className="as-rep-tag">📍 {student.city}</span>}
                    <span className="as-rep-tag">📅 {student.date}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "13px", opacity: .75 }}>Career Assessment Report</div>
                  <div style={{ fontSize: "11px", opacity: .5, marginTop: "2px" }}>Powered by Abroad Simplified</div>
                </div>
              </div>
              <div className="as-rep-summary">{reportData.summary || ""}</div>
              <div className="as-rep-kpis">
                <div className="as-rep-kpi"><div className="as-rep-kpi-v">{scores.aptitude.overall}%</div><div className="as-rep-kpi-k">Overall Aptitude</div></div>
                <div className="as-rep-kpi"><div className="as-rep-kpi-v">{rn[scores.topRiasec[0]] || scores.topRiasec[0]}</div><div className="as-rep-kpi-k">Top Interest</div></div>
                <div className="as-rep-kpi"><div className="as-rep-kpi-v">{vn[scores.topVark] || "Visual"}</div><div className="as-rep-kpi-k">Learning Style</div></div>
                <div className="as-rep-kpi"><div className="as-rep-kpi-v">{scores.careerFitment[0]?.name.split(" ")[0] || "—"}</div><div className="as-rep-kpi-k">Best Fit Cluster</div></div>
              </div>
            </div>


            
            {reportMode === 'detailed' && (
              <>
            {/* S1: Aptitude */}
            <div className="as-sec-hd"><div className="bar" /><h2><Brain className="as-icon-emoji" size={28} /> Section 1: Aptitude Assessment</h2><span className="pill">Cognitive Ability</span></div>
            {buildSecExplain(0)}
            <div className="as-two-col">
              <div className="as-chart-card"><h3>Aptitude Radar</h3><p className="sub">Your cognitive strengths across four dimensions</p><div className="as-cw"><canvas id="ch-apt" /></div></div>
              <div className="as-chart-card"><h3>Score Breakdown</h3><p className="sub">Detailed aptitude dimension scores</p>
                <div className="as-t-bars">
                  {(["Verbal", "numerical", "reasoning", "spatial"] as const).map((k, i) => {
                    const label = ["Verbal", "Numerical", "Reasoning", "Spatial"][i];
                    const color = ["#690B1B", "#7E3AF2", "#057A55", "#C9A55D"][i];
                    const val = scores.aptitude[k === "Verbal" ? "verbal" : k] as number;
                    return (<div className="as-tbar" key={k}><div className="as-tbar-hd"><span>{label}</span><span>{val}%</span></div><div className="as-tbar-track"><div className="as-tbar-fill" style={{ width: `${val}%`, background: color }} /></div></div>);
                  })}
                </div>
                <div className="as-ibox" style={{ marginTop: "16px" }}><ul>{(reportData.strengths || []).slice(0, 2).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
              </div>
            </div>
            {buildQReview(0)}

            {/* S2: Personality */}
            <div className="as-sec-hd"><div className="bar" /><h2><Star className="as-icon-emoji" size={28} /> Section 2: Personality Profile</h2><span className="pill">Big Five Model</span></div>
            {buildSecExplain(1)}
            <div className="as-two-col">
              <div className="as-chart-card"><h3>Big Five Traits</h3><p className="sub">Your personality dimensions scored and mapped</p><div className="as-cw"><canvas id="ch-per" /></div></div>
              <div className="as-chart-card"><h3>Trait Analysis</h3><p className="sub">What your personality scores mean for your career</p>
                <div className="as-t-bars">
                  {(["openness", "conscientiousness", "extraversion", "agreeableness", "emotionalStability"] as const).map((k, i) => {
                    const labels = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Emotional Stability"];
                    const colors = ["#7E3AF2", "#057A55", "#690B1B", "#C9A55D", "#0694A2"];
                    const val = scores.personality[k] || 0;
                    return (<div className="as-tbar" key={k}><div className="as-tbar-hd"><span>{labels[i]}</span><span>{val}%</span></div><div className="as-tbar-track"><div className="as-tbar-fill" style={{ width: `${val}%`, background: colors[i] }} /></div></div>);
                  })}
                </div>
              </div>
            </div>
            {buildQReview(1)}

            {/* S3: RIASEC */}
            <div className="as-sec-hd"><div className="bar" /><h2><Target className="as-icon-emoji" size={28} /> Section 3: Interest Profile (RIASEC)</h2><span className="pill">Holland Code</span></div>
            {buildSecExplain(2)}
            <div className="as-two-col">
              <div className="as-chart-card"><h3>RIASEC Hexagon</h3><p className="sub">Your interest profile across all six domains</p><div className="as-cw"><canvas id="ch-ria" /></div></div>
              <div className="as-chart-card"><h3>Interest Scores</h3><p className="sub">Your top interest types that best match careers</p>
                <div className="as-riasec-grid">
                  {Object.entries(scores.riasec).sort((a, b) => b[1] - a[1]).map(([code, val]) => {
                    const cn: Record<string, string> = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };
                    const cl: Record<string, string> = { R: "#C9A55D", I: "#690B1B", A: "#690B1B", S: "#057A55", E: "#7E3AF2", C: "#0694A2" };
                    return (<div className="as-riasec-item" key={code}><div className="as-riasec-code" style={{ color: cl[code] }}>{code}</div><div className="as-riasec-name">{cn[code]}</div><div className="as-riasec-score" style={{ color: cl[code] }}>{val}%</div></div>);
                  })}
                </div>
              </div>
            </div>
            {buildQReview(2)}

            {/* S4: VARK */}
            <div className="as-sec-hd"><div className="bar" /><h2><BookOpen className="as-icon-emoji" size={28} /> Section 4: Learning Style (VARK)</h2><span className="pill">How You Learn</span></div>
            {buildSecExplain(3)}
            <div className="as-two-col">
              <div className="as-chart-card"><h3>VARK Distribution</h3><p className="sub">How you learn and retain information best</p><div className="as-cw"><canvas id="ch-vk" /></div></div>
              <div className="as-chart-card"><h3>Your Primary Style: {vn[scores.topVark] || "Visual"}</h3><p className="sub">Study strategies tailored to your learning preference</p>
                <div className="as-ibox"><ul>{(VARK_TIPS[scores.topVark] || VARK_TIPS["V"]).map((t, i) => <li key={i}>{t}</li>)}</ul></div>
                <div className="as-t-bars" style={{ marginTop: "12px" }}>
                  {(["V", "A", "R", "K"] as const).map((k, i) => {
                    const labels = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"];
                    const colors = ["#690B1B", "#7E3AF2", "#057A55", "#C9A55D"];
                    const val = scores.vark[k] || 0;
                    return (<div className="as-tbar" key={k}><div className="as-tbar-hd"><span>{labels[i]}</span><span>{val}%</span></div><div className="as-tbar-track"><div className="as-tbar-fill" style={{ width: `${val}%`, background: colors[i] }} /></div></div>);
                  })}
                </div>
              </div>
            </div>
            {buildQReview(3)}

            {/* S5: Values */}
            <div className="as-sec-hd"><div className="bar" /><h2><Briefcase className="as-icon-emoji" size={28} /> Section 5: Career Values</h2><span className="pill">What Drives You</span></div>
            {buildSecExplain(4)}
            <div className="as-chart-card"><h3>Your Career Value Priorities</h3><p className="sub">What matters most to you in a future career path</p><div className="as-cwsm" style={{ maxWidth: "640px", margin: "0 auto" }}><canvas id="ch-val" /></div></div>
            {buildQReview(4)}

            {assessmentType === "junior" ? (
              /* ── JUNIOR ACADEMIC DIAGNOSIS & POWER ANALYSIS ── */
              <>
                {!pdfUnlocked ? (
                  <div style={{
                    marginTop: '40px',
                    background: 'linear-gradient(135deg, var(--card) 0%, rgba(105, 11, 27, 0.05) 100%)',
                    border: '2px solid rgba(105, 11, 27, 0.15)',
                    borderRadius: '20px',
                    padding: '48px 32px',
                    textAlign: 'center',
                    boxShadow: 'var(--sh-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(8px)',
                    marginBottom: '24px'
                  }}>
                    <div style={{ fontSize: '54px', marginBottom: '16px' }}>🔒</div>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t1)', marginBottom: '12px', fontFamily: 'var(--font)' }}>
                      Unlock Your Complete Grade Progression Dossier
                    </h3>
                    <p style={{ fontSize: '15px', color: 'var(--t3)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 28px' }}>
                      Get instant access to your full 17-page Junior Assessment report. Discover your detailed school subject diagnosis, cognitive superpowers, recommended extracurriculars, and customized grade-by-grade academic progression roadmap.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setPayModalOpen(true)}
                        style={{
                          background: 'var(--red)',
                          color: '#fff',
                          padding: '14px 36px',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 700,
                          border: 'none',
                          boxShadow: '0 4px 14px rgba(105, 11, 27, 0.4)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🚀 Unlock Full Report (₹49)
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Academic Status Panel */}
                    <div className="as-sec-hd"><div className="bar" /><h2><BookOpen className="as-icon-emoji" size={28} /> Subject Strengths &amp; Academic Diagnosis</h2><span className="pill">Academic Status</span></div>
                    
                    <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '22px', flexShrink: 0 }}>📊</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Your School Subject Diagnosis</div>
                        <div style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.7 }}>
                          Based on your cognitive aptitude assessment, we have mapped your logical, verbal, numerical, and visual performance directly to core school subjects to find where you shine and where you can grow.
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const sortedJuniorSubjects = [
                        { name: "Languages & Literature (English, Hindi, etc.)", score: scores.aptitude.verbal, icon: "🗣️", tip: "Your high verbal aptitude allows you to write essays, read dense stories, and speak confidently. Keep writing creative blogs or debates!" },
                        { name: "Mathematics & Quantitative reasoning", score: scores.aptitude.numerical, icon: "📐", tip: "Numerical patterns are easy for you. You solve calculations quickly and have great quantitative instincts." },
                        { name: "Logical Sciences & Coding (Chemistry, Biology, Computer)", score: scores.aptitude.reasoning, icon: "🧬", tip: "You possess strong puzzle-solving and code-cracking skills. Science theories and systematic logic are your strength." },
                        { name: "Visual Geometry, Geography & Arts/Design", score: scores.aptitude.spatial, icon: "🗺️", tip: "You easily visualize coordinates, mirror clocks, and read charts. Geometry proofs and mapping are highly natural." }
                      ].sort((a, b) => b.score - a.score);

                      const superpowers = sortedJuniorSubjects.slice(0, 2);
                      const improvements = sortedJuniorSubjects.slice(2, 4);

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                          {/* Subject Strengths Card */}
                          <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--sh)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--green)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🔥 Your Academic Superpowers (Strong Areas)
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {superpowers.map((subj, idx) => (
                                <div key={idx} style={{ padding: '12px', background: 'rgba(5, 122, 85, 0.04)', borderRadius: '10px', borderLeft: '4px solid var(--green)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--t1)' }}>{subj.icon} {subj.name}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--green)', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{subj.score}%</span>
                                  </div>
                                  <p style={{ fontSize: '11.5px', color: 'var(--t2)', margin: 0, lineHeight: 1.45 }}>{subj.tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Areas for Improvement Card */}
                          <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--sh)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--red)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              🛠️ Subjects to Improve &amp; Support Guide
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {improvements.map((subj, idx) => {
                                const impTips: Record<string, string> = {
                                  "Languages & Literature (English, Hindi, etc.)": "Study resource: Practice active reading by summarizing paragraphs in 1 sentence. Write short articles daily.",
                                  "Mathematics & Quantitative reasoning": "Study resource: Solve quick math drills on Khan Academy. Draw visual squares or block models for word problems.",
                                  "Logical Sciences & Coding (Chemistry, Biology, Computer)": "Study resource: Create visual cause-and-effect flowcharts for science processes. Practice coding games.",
                                  "Visual Geometry, Geography & Arts/Design": "Study resource: Draw diagrams to represent concepts. Build origami or use graph paper to solve geometric equations."
                                };
                                return (
                                  <div key={idx} style={{ padding: '12px', background: 'rgba(105, 11, 27, 0.04)', borderRadius: '10px', borderLeft: '4px solid var(--red)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--t1)' }}>{subj.icon} {subj.name}</span>
                                      <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--red)', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{subj.score}%</span>
                                    </div>
                                    <p style={{ fontSize: '11.5px', color: 'var(--t2)', margin: 0, lineHeight: 1.45 }}>{impTips[subj.name] || subj.tip}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                {/* Your Powers Section */}
                <div className="as-sec-hd"><div className="bar" /><h2><Zap className="as-icon-emoji" size={28} /> Discover Your Powers &amp; Strengths</h2><span className="pill">Cognitive Talents</span></div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {/* Power 1: Top Talent */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(105, 11, 27, 0.03), rgba(201, 165, 93, 0.03))', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                      {scores.aptitude.numerical >= Math.max(scores.aptitude.verbal, scores.aptitude.reasoning, scores.aptitude.spatial) ? "Number Ninja 🔢" :
                       scores.aptitude.verbal >= Math.max(scores.aptitude.numerical, scores.aptitude.reasoning, scores.aptitude.spatial) ? "Communication Wizard 🗣️" :
                       scores.aptitude.reasoning >= Math.max(scores.aptitude.verbal, scores.aptitude.numerical, scores.aptitude.spatial) ? "Logic Mastermind 🧠" : "Visual Architect 🗺️"}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                      This is your primary cognitive power! You process this type of information naturally and can use it to assist your learning in all other subjects.
                    </p>
                  </div>

                  {/* Power 2: Study Style Power */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(105, 11, 27, 0.03), rgba(201, 165, 93, 0.03))', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                      Dominant Learning: {vn[scores.topVark] || "Visual"}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                      Your unique study style! You absorb information fastest using this format, giving you an edge to study smarter and finish schoolwork in less time.
                    </p>
                  </div>

                  {/* Power 3: Personality Power */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(105, 11, 27, 0.03), rgba(201, 165, 93, 0.03))', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌟</div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                      {scores.personality.conscientiousness >= 65 ? "Super Focused & Organized 📅" :
                       scores.personality.openness >= 65 ? "Deep Creative Thinker 🎨" :
                       scores.personality.extraversion >= 65 ? "Dynamic Connector & Leader 🎤" : "Reliable & Kind Team Player 🤝"}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                      Your major behavioral strength. It guides how you handle project deadlines, group assignments, and solve team challenges.
                    </p>
                  </div>
                </div>

                {/* Extra Curricular Section */}
                <div className="as-sec-hd"><div className="bar" /><h2><Star className="as-icon-emoji" size={28} /> Recommended Extracurricular Activities</h2><span className="pill">Profile Building</span></div>
                
                <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>✨</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Build Your Profile Beyond School</div>
                    <div style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.7 }}>
                      Applying for extracurriculars early develops leadership skills, increases confidence, and builds a robust profile for future admissions. Find activities tailored for you below:
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {/* Activity 1 */}
                  <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', boxShadow: 'var(--sh)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Academic Clubs</span>
                        <span style={{ fontSize: '10px', background: 'rgba(105, 11, 27, 0.08)', color: 'var(--red)', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>Highly Recommended</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                        {scores.topRiasec[0] === 'I' || scores.topRiasec[0] === 'R' ? "Science Olympiad & Robotics 🤖" : "Debate Society & MUNs 🗣️"}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                        {scores.topRiasec[0] === 'I' || scores.topRiasec[0] === 'R' ?
                          "Put your analytical thinking and logic to the test by participating in regional math/science olympiads or designing small automation models." :
                          "Improve public speaking, research, and negotiation skills by participating in school debate leagues or simulated United Nations (MUNs)."}
                      </p>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                      💡 <strong>How to start:</strong> Ask your class teacher about registrations or start a small circle after school.
                    </div>
                  </div>

                  {/* Activity 2 */}
                  <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', boxShadow: 'var(--sh)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Creative &amp; Sports</span>
                        <span style={{ fontSize: '10px', background: 'rgba(5, 122, 85, 0.08)', color: 'var(--green)', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>Explore Skills</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                        {scores.aptitude.spatial >= 60 ? "Creative Arts & Graphic Design 🎨" : "Team Sports & Athletics ⚽"}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                        {scores.aptitude.spatial >= 60 ?
                          "Your visualization skills can be applied in learning painting, basic coding animation, model building, or taking photos for school events." :
                          "Build teamwork, fitness, and quick reflexes. Regular sports like basketball, tennis, or running teach resilience and structure."}
                      </p>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                      💡 <strong>How to start:</strong> Participate in school sports selections or submit artwork to the school magazine.
                    </div>
                  </div>

                  {/* Activity 3 */}
                  <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', boxShadow: 'var(--sh)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Social &amp; Leadership</span>
                        <span style={{ fontSize: '10px', background: 'rgba(201, 165, 93, 0.15)', color: 'var(--amber)', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>Impact Track</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>
                        {scores.personality.agreeableness >= 65 ? "Community Service & Volunteering 🤝" : "Event Organizing & Student Council 👑"}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                        {scores.personality.agreeableness >= 65 ?
                          "Help organize charity drives, teach younger kids, participate in green plantation events, or coordinate local neighborhood cleanups." :
                          "Nominate yourself as student class representative, help manage the science fair logistics, or coordinate inter-school tournaments."}
                      </p>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t3)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                      💡 <strong>How to start:</strong> Join volunteer groups or volunteer for organizational duties in upcoming school functions.
                    </div>
                  </div>
                </div>

                {/* Stream & Grade Progression Advice */}
                <div className="as-sec-hd"><div className="bar" /><h2>🎓 Academic Stream &amp; Grade Progression Advice</h2><span className="pill">High School Prep</span></div>
                <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--sh)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '3px', height: '16px', background: '#690B1B', borderRadius: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--t1)' }}>Recommended High School Stream Fit</div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.8, marginBottom: '16px' }}>
                    {scores.careerFitment[0]?.name.toLowerCase().includes("science") ? 
                      "Based on your high numerical and logical reasoning aptitude, you show a strong match for the Science Stream (PCM or PCB) in Class 11. Focus on core math and scientific processes to prepare for advanced studies." :
                      scores.careerFitment[0]?.name.toLowerCase().includes("commerce") || scores.careerFitment[0]?.name.toLowerCase().includes("business") ?
                      "Your logical profile matches well with the Commerce & Humanities Stream in high school. Developing strong commercial math, logic, and economics foundations will support this route." :
                      "Your strong verbal communication skills align perfectly with the Liberal Arts, Humanities, and Design Streams. Focus on developing extensive reading, writing, and creative analytical skills."
                    }
                  </p>
                  
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#057A55', borderRadius: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--t1)' }}>🚀 Grade Progression Action Plan (Fixing Your Academics)</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: 'var(--red)', fontWeight: 800 }}>📉 Addressing Weaknesses</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: 'var(--t2)', lineHeight: 1.6 }}>
                          {scores.aptitude.numerical < 70 && <li>Spend 20 mins daily on Algebra and arithmetic drills to bridge math gaps before entering high school.</li>}
                          {scores.aptitude.verbal < 70 && <li>Read editorial articles daily and summarize them in writing to boost syntax and reading comprehension.</li>}
                          {scores.aptitude.reasoning < 70 && <li>Practice logical riddles, coding games, or sudoku to develop deductive deduction abilities.</li>}
                          {scores.aptitude.spatial < 70 && <li>Use coordinate charts and graph paper to practice geometry proofs and visual reasoning worksheets.</li>}
                          <li>Regularly review mid-term exam errors and correct them immediately to ensure no core concepts are left unmastered.</li>
                        </ul>
                      </div>
                      <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: 'var(--green)', fontWeight: 800 }}>📈 Transitioning to Next Grade</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: 'var(--t2)', lineHeight: 1.6 }}>
                          <li>Set up a dedicated daily study routine of 1.5 to 2 hours.</li>
                          <li>Read high school introductory chapters for target streams during vacations.</li>
                          <li>Master active recall techniques (self-testing instead of just re-reading chapters).</li>
                          <li>Consult with school teachers or academic mentors to choose high school electives early.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Study Abroad */}
                {(() => {
                  const juniorTopCareer = scores.careerFitment[0]?.name || "";
                  
                  if (loadingAbroad) {
                    return (
                      <>
                        <div className="as-sec-hd"><div className="bar" /><h2>✈️ Study Abroad Pathways</h2><span className="pill">Generating with AI...</span></div>
                        <div style={{ background: 'transparent', border: 'none', borderRadius: 0, overflow: 'visible', marginBottom: '24px' }}>
                          <div className="as-abroad-loading" style={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            padding: '48px 24px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.015)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px'
                          }}>
                            <div className="as-spinner" style={{
                              width: '40px',
                              height: '40px',
                              border: '3px solid rgba(105, 11, 27, 0.1)',
                              borderTop: '3px solid #690B1B',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>Curating Study Abroad Opportunities...</div>
                            <div style={{ fontSize: '13px', color: 'var(--t3)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                              Gemini is analyzing your psychometric profile to recommend target countries, scholarships, and specific degree programs for <strong>{juniorTopCareer}</strong>.
                            </div>
                          </div>
                        </div>
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </>
                    );
                  }

                  const dynamicAbroad = careerAbroadData[juniorTopCareer] || 
                    (reportData.studyAbroad && reportData.studyAbroad.countries?.length ? reportData.studyAbroad : getDynamicStudyAbroad(juniorTopCareer, student.name));
                  return (
                    <>
                      <div className="as-sec-hd"><div className="bar" /><h2>✈️ Study Abroad Pathways</h2><span className="pill">Global Opportunities</span></div>

                      <div style={{ background: 'transparent', border: 'none', borderRadius: 0, overflow: 'visible' }}>
                        {/* Rationale */}
                        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                          <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                            {dynamicAbroad.rationale}
                          </p>
                        </div>

                        {/* Per-country cards */}
                        <div className="as-abroad-grid" style={{ padding: '0 0 24px 0' }}>
                          {dynamicAbroad.countries.map((c: any, i: number) => {
                            const codeMap: Record<string, string> = {
                              'United States': 'US', 'United Kingdom': 'GB', 'Canada': 'CA', 'Australia': 'AU', 
                              'Germany': 'DE', 'Singapore': 'SG', 'Switzerland': 'CH', 'France': 'FR', 
                              'Italy': 'IT', 'Japan': 'JP', 'Netherlands': 'NL', 'Ireland': 'IE', 'New Zealand': 'NZ'
                            };
                            const code = codeMap[c.name] || c.name?.substring(0, 2).toUpperCase() || '';
                            return (
                              <div key={i} className="as-abroad-card">
                                <div className="as-abroad-flag-badge">
                                  {c.flag || (code === 'US' ? '🇺🇸' : code === 'GB' ? '🇬🇧' : code === 'CA' ? '🇨🇦' : '✈️')}
                                </div>
                                <div className="as-abroad-meta">
                                  <span className="as-abroad-code">{code}</span>
                                  <h4 className="as-abroad-name">{c.name}</h4>
                                </div>
                                <p className="as-abroad-desc">{c.reason}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Programs and Scholarships footer as two premium cards */}
                        <div className="as-two-col" style={{ padding: 0 }}>
                          {/* Scholarships */}
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', fontWeight: 800, fontSize: '15px', color: 'var(--t1)' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(105, 11, 27, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎓</div>
                              Scholarships &amp; Funding
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dynamicAbroad.scholarships.map((s: string, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#690B1B', flexShrink: 0 }} />
                                  <span style={{ fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>{s}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Programmes to Explore */}
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', fontWeight: 800, fontSize: '15px', color: 'var(--t1)' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201, 165, 93, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📋</div>
                              Programmes to Explore
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dynamicAbroad.programs.map((p: string, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A55D', flexShrink: 0 }} />
                                  <span style={{ fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </>
            ) : (
              /* ── SENIOR GRADE CAREER SECTIONS ── */
              <>
                {/* Career Fitment */}
                <div className="as-sec-hd"><div className="bar" /><h2>📊 Career Cluster Fitment</h2><span className="pill">Combined Score</span></div>
                <div className="as-chart-card"><h3>Overall Fitment by Career Cluster</h3><p className="sub">Based on your combined Aptitude, Personality, and Interest scores</p>
                  <div className="as-fit-list">
                    {scores.careerFitment.slice(0, 10).map((c) => (
                      <div className="as-fit-row" key={c.name}><div className="as-fit-name">{c.name}</div><div className="as-fit-track"><div className="as-fit-fill" style={{ width: `${c.score}%`, background: c.color }} /></div><div className="as-fit-pct">{c.score}%</div></div>
                    ))}
                  </div>
                </div>

                {/* Top Careers — Rich Cards */}
                {!pdfUnlocked ? (
                  <div style={{
                    marginTop: '40px',
                    background: 'linear-gradient(135deg, var(--card) 0%, rgba(105, 11, 27, 0.05) 100%)',
                    border: '2px solid rgba(105, 11, 27, 0.15)',
                    borderRadius: '20px',
                    padding: '48px 32px',
                    textAlign: 'center',
                    boxShadow: 'var(--sh-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(8px)'
                  }}>
                    <div style={{ fontSize: '54px', marginBottom: '16px' }}>🔒</div>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t1)', marginBottom: '12px', fontFamily: 'var(--font)' }}>
                      Unlock the Complete Career Advisory Dossier
                    </h3>
                    <p style={{ fontSize: '15px', color: 'var(--t3)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 28px' }}>
                      Get instant access to your full 7-page report. Discover your detailed Cognitive Aptitude scores, Holland Code interest mapping, learning styles, target colleges, entrance exams, and customized action roadmap.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setPayModalOpen(true)}
                        style={{
                          background: 'var(--red)',
                          color: '#fff',
                          padding: '14px 36px',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 700,
                          border: 'none',
                          boxShadow: '0 4px 14px rgba(105, 11, 27, 0.4)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🚀 Unlock Full Report (₹49)
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="as-sec-hd"><div className="bar" /><h2>🏆 Top Career Recommendations</h2><span className="pill">Personalised</span></div>
                <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>🎯</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>How these are selected for you</div>
                    <div style={{ fontSize: '13px', color: 'var(--t3)', lineHeight: 1.7 }}>
                      These careers are ranked using your combined <strong>Aptitude ({scores.aptitude.overall}%)</strong>, <strong>RIASEC code ({scores.topRiasec.slice(0,3).join('-')})</strong>, Personality profile, and top values ({scores.topValues.slice(0,2).join(', ')}). Only careers that align across all five dimensions appear here.
                    </div>
                  </div>
                </div>
                <div className="as-career-grid">
                  {(reportData.topCareers || []).slice(0, 5).map((c: any, i: number) => {
                    const cardColors = ['#690B1B', '#7E3AF2', '#057A55', '#C9A55D', '#0694A2'];
                    const color = cardColors[i];
                    // Find matching cluster fit score
                    const clusterFit = scores.careerFitment.find((cf: any) =>
                      cf.name.toLowerCase().includes(c.name?.toLowerCase().split(' ')[0]) ||
                      c.name?.toLowerCase().includes(cf.name.toLowerCase().split(' ')[0])
                    );
                    const fitScore = clusterFit?.score ?? Math.max(10, 72 - i * 9);
                    // RIASEC match display
                    const riasecTop = scores.topRiasec.slice(0, 3);
                    const fitLabel = fitScore >= 65 ? 'Strong Fit' : fitScore >= 45 ? 'Good Fit' : 'Moderate Fit';
                    const fitBg = fitScore >= 65 ? '#057A55' : fitScore >= 45 ? '#C9A55D' : '#690B1B';
                    // Derive a personalised "why you" line from real scores
                    const whyYou = (() => {
                      const parts: string[] = [];
                      if (scores.aptitude.overall >= 60) parts.push(`your aptitude of ${scores.aptitude.overall}%`);
                      if (scores.topRiasec[0]) parts.push(`${rn[scores.topRiasec[0]]} interest orientation`);
                      if (scores.topValues[0]) parts.push(`${scores.topValues[0]}-driven values`);
                      return parts.length ? `Matched because of your ${parts.join(', ')}.` : '';
                    })();
                    // Estimate year to reach role
                    const gradeNum = parseInt(student.grade) || 10;
                    const yearsToGrad = Math.max(0, 12 - gradeNum) + 4;
                    const targetYear = new Date().getFullYear() + yearsToGrad;
                    return (
                      <div
                        key={i}
                        className={`as-career-card${selectedCareerIdx === i ? ' selected' : ''}`}
                        onClick={() => openCareerRoadmap(i)}
                        style={{ position: 'relative', overflow: 'hidden' }}
                      >
                        {/* Rank + Fit Badge Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div className="as-cc-rank" style={{ background: color }}>{i + 1}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <div style={{ background: fitBg, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.4px' }}>
                              {fitLabel}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 600 }}>Fit Score: {fitScore}%</div>
                          </div>
                        </div>

                        {/* Career Name */}
                        <h3 style={{ marginBottom: '6px', fontSize: '17px' }}>{c.name || ''}</h3>

                        {/* Personalised Why You */}
                        {whyYou && (
                          <div style={{ fontSize: '11px', fontWeight: 700, color: color, marginBottom: '8px', letterSpacing: '0.2px' }}>
                            ✦ {whyYou}
                          </div>
                        )}

                        {/* Description */}
                        <p className="desc" style={{ marginBottom: '12px' }}>{c.description || ''}</p>

                        {/* Fit Meter Bar */}
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>
                            <span>Overall Career Fit</span><span style={{ fontWeight: 700, color }}>{fitScore}%</span>
                          </div>
                          <div style={{ height: '5px', background: 'var(--brd)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${fitScore}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: '99px', transition: 'width 1s ease' }} />
                          </div>
                        </div>

                        {/* Data Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '8px 10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>🎓 Education Path</div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{c.education || 'Relevant Degree'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>≈{yearsToGrad} yrs from Grade {student.grade}</div>
                          </div>
                          <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '8px 10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>📝 Key Exam</div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{c.indianExam || 'CUET / JEE'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>Target: Class 11–12</div>
                          </div>
                          <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '8px 10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>💰 Salary Range</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color }}>{c.salaryRange || '₹8–20 LPA'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>Entry → Senior level</div>
                          </div>
                          <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '8px 10px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>📅 Target Entry</div>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{targetYear}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>Estimated career start</div>
                          </div>
                        </div>

                        {/* RIASEC Alignment Chips */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>🔭 Your RIASEC Match</div>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {riasecTop.map((code: string, ci: number) => (
                              <span key={code} style={{
                                fontSize: '11px', fontWeight: 800,
                                padding: '3px 9px', borderRadius: '20px',
                                background: ci === 0 ? color : 'var(--bg)',
                                color: ci === 0 ? '#fff' : 'var(--t2)',
                                border: `1.5px solid ${ci === 0 ? color : 'var(--brd)'}`
                              }}>
                                {code} · {({R:'Realistic',I:'Investigative',A:'Artistic',S:'Social',E:'Enterprising',C:'Conventional'} as any)[code]}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* INLINE ROADMAP - auto-generated for all careers */}
                        {allCrmLoading && !allCrmData[i] ? (
                          <div style={{ marginTop: '20px', padding: '30px', background: 'var(--bg)', borderRadius: '12px', textAlign: 'center' }}>
                            <div className="as-crm-spinner" style={{ margin: '0 auto 12px auto' }} />
                            <p style={{ fontSize: '13px', color: 'var(--t3)', fontWeight: 600 }}>Generating your personalised roadmap...</p>
                          </div>
                        ) : (allCrmData[i] || (selectedCareerIdx === i && crmData)) ? (() => {
                          const thisRoadmap = allCrmData[i] || crmData!;
                          return (
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `2px solid ${color}20`, cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            <div className="as-crm-sec">
                              <div className="as-crm-sec-hd">Your Step-by-Step Roadmap</div>
                              <div className="as-crm-timeline">
                                {(thisRoadmap.roadmap.stages || []).map((s: any, j: number, arr: any[]) => {
                                  const isLast = j === arr.length - 1;
                                  return (
                                    <div className="as-crm-stage" key={j}>
                                      <div className="as-crm-stage-left"><div className="as-crm-stage-dot" style={{ background: color, boxShadow: `0 4px 12px ${color}40`, border: 'none', color: '#fff' }}>{s.icon || j + 1}</div>{!isLast && <div className="as-crm-stage-line" />}</div>
                                      <div className="as-crm-stage-content">
                                        <div className="as-crm-stage-label" style={{ color }}>{s.stage || ""}</div>
                                        <div className="as-crm-stage-title">{s.title || ""}</div>
                                        <div className="as-crm-stage-acts">{(s.actions || []).map((a: string, k: number) => <div className="as-crm-stage-act" key={k} style={{ color: 'var(--t2)' }}><span style={{ color }}>✦</span> {a}</div>)}</div>
                                        {s.targetColleges?.length && <div style={{ marginTop: "10px" }}><div style={{ fontSize: "10px", fontWeight: 800, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "6px" }}>Target Colleges</div><div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>{s.targetColleges.map((c: string, k: number) => <span key={k} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600 }}>🏛 {c}</span>)}</div></div>}
                                        {s.salaryTrajectory?.length && <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>{s.salaryTrajectory.map((x: string, k: number) => <span key={k} style={{ background: "var(--green-l)", border: "1px solid rgba(5,122,85,.2)", color: "var(--green)", padding: "4px 12px", borderRadius: "100px", fontSize: "11.5px", fontWeight: 700 }}>💰 {x}</span>)}</div>}
                                        {s.targetCompanies?.length && <div style={{ marginTop: "10px" }}><div style={{ fontSize: "10px", fontWeight: 800, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "6px" }}>Target Companies</div><div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>{s.targetCompanies.map((c: string, k: number) => <span key={k} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600 }}>🏢 {c}</span>)}</div></div>}
                                        {s.milestone && <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "10px", fontWeight: 800, color: "var(--amber)", textTransform: "uppercase", letterSpacing: ".4px" }}>🎯 Milestone:</span><span style={{ fontSize: "12px", fontWeight: 700, color: "var(--t1)" }}>{s.milestone}</span></div>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div className="as-crm-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                              <div className="as-crm-card"><h4>🎓 Top Colleges</h4><ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>{(thisRoadmap.roadmap.topColleges || []).slice(0, 4).map((c: string, j: number) => <li key={j} style={{ fontSize: '12px', color: 'var(--t2)', display: 'flex', gap: '6px' }}><span style={{ color }}>▹</span>{c}</li>)}</ul></div>
                              <div className="as-crm-card"><h4>📝 Key Exams</h4><ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>{(thisRoadmap.roadmap.keyExams || []).slice(0, 4).map((e: string, j: number) => <li key={j} style={{ fontSize: '12px', color: 'var(--t2)', display: 'flex', gap: '6px' }}><span style={{ color }}>▹</span>{e}</li>)}</ul></div>
                              <div className="as-crm-card" style={{ gridColumn: '1 / -1' }}><h4>🛠 Key Skills</h4><ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>{(thisRoadmap.roadmap.keySkills || []).slice(0, 5).map((s: string, j: number) => <li key={j} style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>{s}</li>)}</ul></div>
                            </div>
                          </div>
                          );
                        })() : (
                          <div className="as-cc-cta" style={{ borderTop: `2px solid ${color}20`, paddingTop: '10px', marginTop: '4px' }} onClick={() => openCareerRoadmap(i)}>
                            🗺️ Generate full personalised roadmap →
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Indian Roadmap */}
                <div className="as-sec-hd"><div className="bar" /><h2>Indian Academic Roadmap</h2><span className="pill">Stream &amp; Colleges</span></div>
                <div className="as-indian-rm-grid" style={{ marginBottom: '8px' }}>
                  <div className="as-indian-rm-card-full" style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#690B1B', borderRadius: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Stream Recommendation</div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.8, marginBottom: reportData.indianCounselling?.subjects?.length ? '14px' : 0 }}>
                      {reportData.indianCounselling?.streamAdvice || ''}
                    </p>
                    {reportData.indianCounselling?.subjects?.length && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {safeList(reportData.indianCounselling.subjects).map((s: string, i: number) => (
                          <span key={i} style={{ fontSize: '12px', fontWeight: 600, padding: '4px 13px', borderRadius: '6px', background: 'var(--bg)', border: '1px solid var(--brd)', color: 'var(--t1)' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="as-indian-rm-card" style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#690B1B', borderRadius: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Entrance Exams</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {safeList(reportData.indianCounselling?.entranceExams).map((e: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#690B1B', minWidth: '20px', paddingTop: '1px' }}>{String(i + 1).padStart(2, '0')}</span>
                          <span style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.5 }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="as-indian-rm-card-2" style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#690B1B', borderRadius: '2px', flexShrink: 0 }} />
                      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Colleges to Target</div>
                    </div>
                    <div className="as-colleges-inner-grid" style={{ gap: '7px' }}>
                      {safeList(reportData.indianCounselling?.topColleges).map((c: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 11px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--brd)' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#690B1B', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t2)' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Study Abroad */}
                {(() => {
                  const activeCareer = (reportData.topCareers || [])[selectedCareerIdx ?? 0];
                  const activeCareerName = activeCareer?.name || scores.careerFitment[0]?.name || "";
                  
                  if (loadingAbroad) {
                    return (
                      <>
                        <div className="as-sec-hd"><div className="bar" /><h2>✈️ Study Abroad Pathways</h2><span className="pill">Generating with AI...</span></div>
                        <div style={{ background: 'transparent', border: 'none', borderRadius: 0, overflow: 'visible', marginBottom: '24px' }}>
                          <div className="as-abroad-loading" style={{
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            padding: '48px 24px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.015)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px'
                          }}>
                            <div className="as-spinner" style={{
                              width: '40px',
                              height: '40px',
                              border: '3px solid rgba(105, 11, 27, 0.1)',
                              borderTop: '3px solid #690B1B',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)' }}>Curating Study Abroad Opportunities...</div>
                            <div style={{ fontSize: '13px', color: 'var(--t3)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                              Gemini is analyzing your psychometric profile to recommend target countries, scholarships, and specific degree programs for <strong>{activeCareerName}</strong>.
                            </div>
                          </div>
                        </div>
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </>
                    );
                  }

                  const dynamicAbroad = careerAbroadData[activeCareerName] || 
                    (reportData.studyAbroad && reportData.studyAbroad.countries?.length ? reportData.studyAbroad : getDynamicStudyAbroad(activeCareerName, student.name));

                  return (
                    <>
                      <div className="as-sec-hd"><div className="bar" /><h2>✈️ Study Abroad Pathways</h2><span className="pill">Global Opportunities</span></div>
                      <div style={{ background: 'transparent', border: 'none', borderRadius: 0, overflow: 'visible' }}>
                        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                          <p style={{ fontSize: '14px', color: 'var(--t2)', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                            {dynamicAbroad.rationale}
                          </p>
                        </div>

                        <div className="as-abroad-grid" style={{ padding: '0 0 24px 0' }}>
                          {dynamicAbroad.countries.map((c: any, i: number) => {
                            const codeMap: Record<string, string> = {
                              'United States': 'US', 'United Kingdom': 'GB', 'Canada': 'CA', 'Australia': 'AU', 
                              'Germany': 'DE', 'Singapore': 'SG', 'Switzerland': 'CH', 'France': 'FR', 
                              'Italy': 'IT', 'Japan': 'JP', 'Netherlands': 'NL', 'Ireland': 'IE', 'New Zealand': 'NZ'
                            };
                            const code = codeMap[c.name] || c.name?.substring(0, 2).toUpperCase() || '';
                            return (
                              <div key={i} className="as-abroad-card">
                                <div className="as-abroad-flag-badge">
                                  {c.flag || (code === 'US' ? '🇺🇸' : code === 'GB' ? '🇬🇧' : code === 'CA' ? '🇨🇦' : '✈️')}
                                </div>
                                <div className="as-abroad-meta">
                                  <span className="as-abroad-code">{code}</span>
                                  <h4 className="as-abroad-name">{c.name}</h4>
                                </div>
                                <p className="as-abroad-desc">{c.reason}</p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="as-two-col" style={{ padding: 0 }}>
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', fontWeight: 800, fontSize: '15px', color: 'var(--t1)' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(105, 11, 27, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎓</div>
                              Scholarships &amp; Funding
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dynamicAbroad.scholarships.map((s: string, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#690B1B', flexShrink: 0 }} />
                                  <span style={{ fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>{s}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', fontWeight: 800, fontSize: '15px', color: 'var(--t1)' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201, 165, 93, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📋</div>
                              Programmes to Explore
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {dynamicAbroad.programs.map((p: string, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A55D', flexShrink: 0 }} />
                                  <span style={{ fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>{p}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}
            {pdfUnlocked && (
              <>
                {/* Roadmap */}
            <div className="as-sec-hd">
              <div className="bar" />
              <h2>🗺️ Academic &amp; Profile Roadmap</h2>
              <span className="pill">
                {assessmentType === "junior" ? "Academics" : "Career"}
              </span>
            </div>

            {assessmentType === "junior" && (student.grade === "7" || student.grade === "8") ? (
              <div className="as-chart-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>12-Month Academic &amp; Profile Building Plan</h3>
                    <p className="sub" style={{ margin: 0 }}>Monthly actionable roadmap for students and parents</p>
                  </div>
                </div>

                {/* Monthly Tabs */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  paddingBottom: '8px', 
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  {JUNIOR_PLAN_7_8.map((m) => (
                    <button
                      key={m.month}
                      onClick={() => setActiveJuniorMonth(m.month)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        background: activeJuniorMonth === m.month ? 'var(--red)' : 'var(--bg)',
                        color: activeJuniorMonth === m.month ? '#fff' : 'var(--t2)',
                        border: `1.5px solid ${activeJuniorMonth === m.month ? 'var(--red)' : 'var(--border2)'}`,
                        transition: 'all 0.2s'
                      }}
                    >
                      Month {m.month}
                    </button>
                  ))}
                </div>

                {/* Weeks Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {JUNIOR_PLAN_7_8.find((m) => m.month === activeJuniorMonth)?.weeks.map((w) => (
                    <div 
                      key={w.week} 
                      style={{ 
                        background: 'var(--bg2)', 
                        border: '1.5px solid var(--border)', 
                        borderRadius: '12px', 
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: 'var(--sh)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Week {w.week} · {w.topic}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {w.student && <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(5, 122, 85, 0.1)', color: 'var(--green)' }}>👤 Student</span>}
                            {w.parent && <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(201, 165, 93, 0.15)', color: 'var(--amber)' }}>👥 Parent</span>}
                          </div>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--t1)' }}>{w.focus}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>{w.activity}</p>
                      </div>
                      <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '10px', borderLeft: '3px solid var(--amber)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Follow-Up Action</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t2)', lineHeight: 1.4 }}>{w.followUp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : assessmentType === "junior" && student.grade === "9" ? (
              <div className="as-chart-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>✈️</span>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>The Journey to Academic Excellence Abroad</h3>
                    <p className="sub" style={{ margin: 0 }}>4-Year Profile Building &amp; Admissions Counseling Roadmap</p>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  paddingBottom: '8px', 
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  {[
                    { val: 'matrix', label: '📊 Interactive Matrix' },
                    { val: 1, label: 'Year 1 (Grade 9)' },
                    { val: 2, label: 'Year 2 (Grade 10)' },
                    { val: 3, label: 'Year 3 (Grade 11)' },
                    { val: 4, label: 'Year 4 (Grade 12)' }
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setActive9YearTab(t.val as any)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        background: active9YearTab === t.val ? 'var(--red)' : 'var(--bg)',
                        color: active9YearTab === t.val ? '#fff' : 'var(--t2)',
                        border: `1.5px solid ${active9YearTab === t.val ? 'var(--red)' : 'var(--border2)'}`,
                        transition: 'all 0.2s'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {active9YearTab === 'matrix' ? (
                  /* ── Horizontal Scroll Matrix ── */
                  <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '12px', minWidth: '220px', position: 'sticky', left: 0, background: 'var(--bg)', zIndex: 10, fontWeight: 800 }}>Admissions Milestone Activity</th>
                          <th colSpan={4} style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid var(--border)', background: 'rgba(5, 122, 85, 0.05)', color: 'var(--green)', fontWeight: 800 }}>Year 1 (Grade 9)</th>
                          <th colSpan={4} style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid var(--border)', background: 'rgba(6, 148, 162, 0.05)', color: 'var(--teal)', fontWeight: 800 }}>Year 2 (Grade 10)</th>
                          <th colSpan={4} style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid var(--border)', background: 'rgba(126, 58, 242, 0.05)', color: 'var(--purple)', fontWeight: 800 }}>Year 3 (Grade 11)</th>
                          <th colSpan={4} style={{ padding: '6px', textAlign: 'center', borderRight: '1px solid var(--border)', background: 'rgba(201, 165, 93, 0.1)', color: 'var(--amber)', fontWeight: 800 }}>Year 4 (Grade 12)</th>
                          <th style={{ padding: '12px', fontWeight: 800 }}>Total</th>
                        </tr>
                        <tr style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          <th style={{ padding: '8px 12px', position: 'sticky', left: 0, background: 'var(--bg)', zIndex: 10 }}>Session Type</th>
                          {['AMJ', 'JAS', 'OND', 'JFM', 'AMJ', 'JAS', 'OND', 'JFM', 'AMJ', 'JAS', 'OND', 'JFM', 'AMJ', 'JAS', 'OND', 'JFM'].map((q, idx) => (
                            <th key={idx} style={{ padding: '8px 6px', textAlign: 'center', borderRight: (idx % 4 === 3) ? '1px solid var(--border)' : 'none' }}>{q}</th>
                          ))}
                          <th style={{ padding: '8px 12px' }}>Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JUNIOR_MATRIX_9.map((row, rIdx) => (
                          <tr key={rIdx} style={{ 
                            borderBottom: '1px solid var(--border)', 
                            background: rIdx % 2 === 0 ? 'var(--bg2)' : 'var(--bg)' 
                          }}>
                            <td style={{ 
                              padding: '10px 12px', 
                              fontWeight: 700, 
                              position: 'sticky', 
                              left: 0, 
                              background: rIdx % 2 === 0 ? 'var(--bg2)' : 'var(--bg)', 
                              zIndex: 9,
                              borderRight: '1.5px solid var(--border)'
                            }}>
                              {row.activity}
                            </td>
                            {row.y1.map((v, i) => (
                              <td key={`y1-${i}`} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: v > 0 ? 800 : 400, color: v > 0 ? 'var(--green)' : 'var(--t4)' }}>{v || '—'}</td>
                            ))}
                            {row.y2.map((v, i) => (
                              <td key={`y2-${i}`} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: v > 0 ? 800 : 400, color: v > 0 ? 'var(--teal)' : 'var(--t4)', borderLeft: i === 0 ? '1px solid var(--border)' : 'none' }}>{v || '—'}</td>
                            ))}
                            {row.y3.map((v, i) => (
                              <td key={`y3-${i}`} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: v > 0 ? 800 : 400, color: v > 0 ? 'var(--purple)' : 'var(--t4)', borderLeft: i === 0 ? '1px solid var(--border)' : 'none' }}>{v || '—'}</td>
                            ))}
                            {row.y4.map((v, i) => (
                              <td key={`y4-${i}`} style={{ padding: '10px 6px', textAlign: 'center', fontWeight: v > 0 ? 800 : 400, color: v > 0 ? 'var(--amber)' : 'var(--t4)', borderLeft: i === 0 ? '1px solid var(--border)' : 'none', borderRight: i === 3 ? '1px solid var(--border)' : 'none' }}>{v || '—'}</td>
                            ))}
                            <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--red)', background: 'rgba(105, 11, 27, 0.03)' }}>{row.total}</td>
                          </tr>
                        ))}
                        <tr style={{ background: 'var(--bg)', fontWeight: 800, borderTop: '2px solid var(--border)' }}>
                          <td style={{ padding: '12px', position: 'sticky', left: 0, background: 'var(--bg)', zIndex: 10, borderRight: '1.5px solid var(--border)' }}>TOTAL QUARTERLY SESSIONS</td>
                          {[6, 7, 7, 3, 6, 7, 7, 2, 7, 8, 8, 3, 7, 7, 4, 7].map((sum, idx) => (
                            <td key={idx} style={{ padding: '12px 6px', textAlign: 'center', borderRight: (idx % 4 === 3) ? '1px solid var(--border)' : 'none', color: 'var(--red)' }}>{sum}</td>
                          ))}
                          <td style={{ padding: '12px', color: 'var(--red)' }}>96</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* ── Yearly Structured List ── */
                  <div>
                    {(() => {
                      const yr = active9YearTab as number;
                      const quarterNames = ['April to June (Q1)', 'July to September (Q2)', 'October to December (Q3)', 'January to March (Q4)'];
                      const yrColors = ['var(--green)', 'var(--teal)', 'var(--purple)', 'var(--amber)'];
                      const yrColor = yrColors[yr - 1];

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {[0, 1, 2, 3].map((qIdx) => {
                            const activeItems = JUNIOR_MATRIX_9.map(row => {
                              const val = yr === 1 ? row.y1[qIdx] : yr === 2 ? row.y2[qIdx] : yr === 3 ? row.y3[qIdx] : row.y4[qIdx];
                              return { activity: row.activity, count: val };
                            }).filter(item => item.count > 0);

                            if (!activeItems.length) return null;

                            return (
                              <div key={qIdx} style={{ 
                                background: 'var(--bg)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '12px', 
                                padding: '16px' 
                              }}>
                                <h4 style={{ 
                                  fontSize: '14px', 
                                  fontWeight: 800, 
                                  color: yrColor, 
                                  margin: '0 0 12px 0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: yrColor }} />
                                  {quarterNames[qIdx]}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {activeItems.map((item, idx) => (
                                    <div key={idx} style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      padding: '10px 14px',
                                      background: 'var(--bg2)',
                                      borderRadius: '8px',
                                      border: '1px solid var(--border)'
                                    }}>
                                      <span style={{ fontSize: '12.5px', color: 'var(--t2)', fontWeight: 600 }}>{item.activity}</span>
                                      <span style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 800, 
                                        color: '#fff', 
                                        background: yrColor,
                                        borderRadius: '20px',
                                        padding: '2px 10px'
                                      }}>
                                        {item.count} {item.count === 1 ? 'session' : 'sessions'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              /* ── Default Roadmap (Older Grades) ── */
              <div className="as-chart-card">
                <div className="as-rm-wrap">
                  {[
                    { key: "grade12", lbl: (assessmentType === "junior") ? `Grade ${student.grade}–12` : (assessmentType === "grade10") ? "Grade 10–12" : "Grade 12", icon: <BookOpen size={18} /> },
                    { key: "graduation", lbl: "Graduation", icon: "🎓" },
                    { key: "postGrad", lbl: "Post-Grad", icon: "📜" },
                    { key: "career", lbl: "Early Career", icon: "💼" },
                    { key: "studyAbroad", lbl: "Study Abroad", icon: "✈️" },
                  ].map((s, i, arr) => {
                    const rm = reportData.roadmap?.[s.key];
                    if (!rm) return null;
                    const isLast = i === arr.length - 1;
                    const isAbroad = s.key === "studyAbroad";
                    return (
                      <div className={`as-rm-row ${isAbroad ? "ab" : "hl"}`} key={s.key}>
                        <div className="as-rm-left"><div className="as-rm-circle">{s.icon}</div>{!isLast && <div className="as-rm-line" />}</div>
                        <div className="as-rm-content">
                          <div className="as-rm-lbl">{s.lbl.toUpperCase()}</div>
                          <div className="as-rm-title">{rm.title || s.lbl}</div>
                          <div className="as-rm-acts">{(rm.actions || []).map((a: string, j: number) => <div className="as-rm-act" key={j}>{a}</div>)}</div>
                          {rm.targetDegree && <div style={{ marginTop: "8px", background: "var(--red-l)", border: "1px solid rgba(105,11,27,.15)", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", fontWeight: 700, color: "var(--red)", wordBreak: "break-word" }}>🎓 {rm.targetDegree}</div>}
                          {rm.targetColleges?.length && <div style={{ marginTop: "8px" }}><span style={{ fontSize: "11px", fontWeight: 700, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".4px" }}>Target Colleges</span><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>{rm.targetColleges.map((c: string, j: number) => <span key={j} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, maxWidth: "100%", wordBreak: "break-word" }}>{c}</span>)}</div></div>}
                          {rm.salaryTrajectory?.length && <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>{rm.salaryTrajectory.map((s: string, j: number) => <span key={j} style={{ background: "var(--green-l)", border: "1px solid rgba(5,122,85,.2)", color: "var(--green)", padding: "4px 12px", borderRadius: "100px", fontSize: "11.5px", fontWeight: 700 }}>💰 {s}</span>)}</div>}
                          {rm.targetCompanies?.length && <div style={{ marginTop: "8px" }}><span style={{ fontSize: "11px", fontWeight: 700, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".4px" }}>Target Companies</span><div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>{rm.targetCompanies.map((c: string, j: number) => <span key={j} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, maxWidth: "100%", wordBreak: "break-word" }}>🏢 {c}</span>)}</div></div>}
                          {rm.targetUniversities?.length && <div style={{ marginTop: "8px" }}><span style={{ fontSize: "11px", fontWeight: 700, color: "var(--t4)", textTransform: "uppercase", letterSpacing: ".4px" }}>Target Universities</span><div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "5px" }}>{rm.targetUniversities.map((u: string, j: number) => <span key={j} style={{ fontSize: "12px", color: "var(--t2)", wordBreak: "break-word" }}>🌍 {u}</span>)}</div></div>}
                          {rm.milestone && <div style={{ marginTop: "8px", display: "flex", alignItems: "flex-start", gap: "6px" }}><span style={{ fontSize: "10px", fontWeight: 800, color: "var(--amber)", textTransform: "uppercase", letterSpacing: ".4px", flexShrink: 0, marginTop: "2px" }}>🎯 Milestone:</span><span style={{ fontSize: "12px", fontWeight: 700, color: "var(--t1)" }}>{rm.milestone}</span></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Plan */}
            <div className="as-sec-hd"><div className="bar" /><h2><Zap className="as-icon-emoji" size={28} /> Action Plan</h2><span className="pill">Start Now</span></div>
            <div className="as-ap-grid">
              {[{ icon: <Calendar size={18} />, title: "This Month", items: reportData.actionPlan?.thisMonth || [] }, { icon: <Calendar size={18} />, title: "This Year", items: reportData.actionPlan?.thisYear || [] }, { icon: <PenTool size={18} />, title: "Skills to Build", items: reportData.actionPlan?.skills || [] }, { icon: <BookOpen size={18} />, title: "Resources", items: reportData.actionPlan?.resources || [] }].map((a) => (
                <div className="as-ap-card" key={a.title}><div className="as-ap-icon">{a.icon}</div><div className="as-ap-title">{a.title}</div><div className="as-ap-items">{a.items.map((x: string, i: number) => <div className="as-ap-item" key={i}>{x}</div>)}</div></div>
              ))}
            </div>

            {/* Strengths */}
            <div className="as-sec-hd"><div className="bar" /><h2><Dumbbell className="as-icon-emoji" size={28} /> Strengths & Growth Areas</h2><span className="pill">Self-Awareness</span></div>
            <div className="as-irow">
              <div className="as-ibox"><h4 style={{ color: "var(--green)", display: "flex", alignItems: "center", gap: "8px" }}><Dumbbell size={20} /> Your Key Strengths</h4><ul>{(reportData.strengths || []).map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
              <div className="as-ibox"><h4 style={{ color: "var(--amber)", display: "flex", alignItems: "center", gap: "8px" }}><TrendingUp size={20} /> Areas to Develop</h4><ul>{(reportData.growthAreas || []).map((g: string, i: number) => <li key={i}>{g}</li>)}</ul></div>
            </div>

            {/* Psych Summary */}
            <div className="as-sec-hd"><div className="bar" /><h2><Brain className="as-icon-emoji" size={28} /> Psychological Summary</h2><span className="pill">Psychometric Profile</span></div>
            <div className="as-psych-card">
              <div className="as-psych-badge">✦ Psychometric Intelligence Report</div>
              <div className="as-psych-title">Your <span className="r">Psychological</span> Profile</div>
              <div className="as-psych-sub">An integrative analysis of all five psychometric dimensions for {student.name}</div>
              <div className="as-psych-traits">
                <div className="as-psych-trait"><div className="emoji"><Brain size={24} /></div><div className="label">Aptitude</div><div className="val">{scores.aptitude.overall}%</div><div className="desc">Overall cognitive score</div></div>
                <div className="as-psych-trait"><div className="emoji"><Star size={24} /></div><div className="label">Personality</div><div className="val">{rn[scores.topRiasec[0]] || scores.topRiasec[0]}</div><div className="desc">Dominant interest type</div></div>
                <div className="as-psych-trait"><div className="emoji"><BookOpen size={24} /></div><div className="label">Learning</div><div className="val">{vn[scores.topVark] || "Visual"}</div><div className="desc">Primary VARK style</div></div>
                <div className="as-psych-trait"><div className="emoji"><Briefcase size={24} /></div><div className="label">Top Value</div><div className="val" style={{ fontSize: "14px", textTransform: "capitalize" }}>{scores.topValues[0] || "Creativity"}</div><div className="desc">Primary career value</div></div>
                <div className="as-psych-trait"><div className="emoji"><Target size={24} /></div><div className="label">Best Fit</div><div className="val" style={{ fontSize: "13px" }}>{scores.careerFitment[0]?.name.split(" ")[0] || "—"}</div><div className="desc">Top career cluster</div></div>
                <div className="as-psych-trait"><div className="emoji"><BarChart2 size={24} /></div><div className="label">Conscientious</div><div className="val">{scores.personality.conscientiousness || 0}%</div><div className="desc">Discipline score</div></div>
              </div>
              <div className="as-psych-grid" style={{ marginTop: "16px" }}>
                <div className="as-psych-block"><h4><Calculator className="as-icon-emoji" size={20} /> Cognitive Profile</h4><p>{reportData.psychologicalSummary?.cognitiveProfile || ""}</p></div>
                <div className="as-psych-block"><h4><Star className="as-icon-emoji" size={20} /> Personality Profile</h4><p>{reportData.psychologicalSummary?.personalityProfile || ""}</p></div>
                <div className="as-psych-block"><h4><Target className="as-icon-emoji" size={20} /> Interest Profile</h4><p>{reportData.psychologicalSummary?.interestProfile || ""}</p></div>
                <div className="as-psych-block"><h4><BookOpen className="as-icon-emoji" size={20} /> Learning Profile</h4><p>{reportData.psychologicalSummary?.learningProfile || ""}</p></div>
              </div>
              <div className="as-psych-full"><h4><Briefcase className="as-icon-emoji" size={20} /> Career Values Analysis</h4><p>{reportData.psychologicalSummary?.valuesProfile || ""}</p></div>
              <div className="as-psych-full"><h4><Microscope className="as-icon-emoji" size={20} /> Integrated Psychological Overview</h4><p>{reportData.psychologicalSummary?.overallPsychProfile || ""}</p></div>
            </div>

            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--t4)", fontSize: "13px", borderTop: "1px solid var(--border)", marginTop: "32px" }}>
              <p><strong>Abroad Simplified</strong> Career Intelligence Platform · {student.date}</p>
              <p style={{ marginTop: "4px" }}>This report is based on psychometric data. Please consult a certified career counsellor for comprehensive guidance.</p>
              <p style={{ marginTop: "4px" }}>© {new Date().getFullYear()} Abroad Simplified. All rights reserved. Confidential.</p>
            </div>
          </>
        )}
          </>
        )}
          </div>

          {/* PDF Bar */}
          <div className="as-pdf-bar">
            <button 
              className="as-btn-pdf" 
              onClick={() => {
                if (!pdfUnlocked) {
                  setPayModalOpen(true);
                } else {
                  downloadPDF();
                }
              }}
              style={!pdfUnlocked ? { background: '#690B1B', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' } : {}}
            >
              {!pdfUnlocked ? "🔒 Unlock PDF Report (₹49)" : "⬇ Download PDF Report"}
            </button>
            <button className="as-btn-restart" onClick={restartApp}>↺ Take Again</button>
            {searchParams.get("source") === "my-assessments" && (
              <button 
                className="as-btn-restart" 
                style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', marginLeft: '12px' }}
                onClick={() => window.location.href = '/dashboard/student/assessments'}
              >
                ← Back to My Assessments
              </button>
            )}
          </div>
          </>
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Abroad Simplified</h3>
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
