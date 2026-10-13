/**
 * Class 10 AI Personalization Module
 * ─────────────────────────────────────────────────────
 * Generates the 20% AI-personalized content for the report.
 *
 * Single API call → structured JSON with all personalization slots.
 * Fallback to template-based personalization if API fails.
 *
 * Incorporates Parent Psychometric Comparison Data when available.
 */

import type { PersonalizationData, EditorialStudent, EditorialScores } from './class10_editorial_engine';
import type { AlignmentResult } from './comparison-engine';

// ─── API Infrastructure ─────────────────────────────────────────────────────

async function callPersonalizationAPI(prompt: string): Promise<string | null> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a psychometric report personalization engine. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation. Just the raw JSON object.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ||
                 data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                 data?.text || data?.content || null;
    return text;
  } catch {
    return null;
  }
}

function cleanJSON(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

// ─── Prompt Builder ─────────────────────────────────────────────────────────

function buildPersonalizationPrompt(
  student: EditorialStudent,
  sc: EditorialScores,
  comparisonData?: AlignmentResult | null
): string {
  const topVarkLabel =
    sc.topVark === 'V' ? 'Visual' :
    sc.topVark === 'A' ? 'Auditory' :
    sc.topVark === 'R' ? 'Reading/Writing' : 'Kinesthetic';
  const gradeLabel = student.grade || 'Class 10';
  const isSenior = /12|senior/i.test(gradeLabel);

  let familyPromptSection = '';
  if (comparisonData && comparisonData.areas?.length > 0) {
    familyPromptSection = `
PARENT & FAMILY ALIGNMENT DATA (COMPLETED PARENT ASSESSMENT):
- Overall Indicator: ${comparisonData.overallIndicator}
- Deterministic Alignment Areas:
${comparisonData.areas.map(a => `  * ${a.name}: Status=${a.level} | Student=${a.studentSide} | Parent=${a.parentSide} | Summary=${a.explanation}`).join('\n')}
`;
  }

  return `
You are generating personalized insights for a ${gradeLabel} student's psychometric report.

STUDENT PROFILE:
- Name: ${student.name}
- Age: ${student.age}
- Grade: ${gradeLabel}
- City: ${student.city || 'India'}

ASSESSMENT SCORES:
Aptitude: Overall ${sc.aptitude.overall}%, Verbal ${sc.aptitude.verbal}%, Numerical ${sc.aptitude.numerical}%, Reasoning ${sc.aptitude.reasoning}%, Spatial ${sc.aptitude.spatial}%
Personality: Openness ${sc.personality.openness}%, Conscientiousness ${sc.personality.conscientiousness}%, Extraversion ${sc.personality.extraversion}%, Agreeableness ${sc.personality.agreeableness}%, Emotional Stability ${sc.personality.emotionalStability}%
RIASEC Code: ${sc.topRiasec.slice(0, 3).join('-')}
Learning Style: ${topVarkLabel}
Top Career Fits: ${sc.careerFitment.slice(0, 3).map(c => c.name).join(', ')}
${familyPromptSection}

Generate a JSON object with these EXACT keys:

{
  "executiveSummary": "A 120-150 word professional summary of the student's overall psychometric profile, key strengths, and strategic recommendations. Mention specific scores and career alignment.",
  "strengths": ["5 specific strengths backed by score evidence, each 15-25 words. ONLY list dimensions where candidate scored high (>= 60%). NEVER list low-scoring traits."],
  "growthAreas": ["3 specific growth areas with actionable suggestions, each 15-25 words. Highlight any lower-scoring traits (< 40%) as developmental priorities."],
  "crossDomainInsights": ["3 insights about how different profile dimensions interact, each 20-30 words"],
  "familyAlignmentSummary": "${comparisonData ? 'Synthesize the student vs. parent alignment analysis in 40-60 words based on the parent assessment data.' : 'Synthesize family mentorship recommendation based on student profile.'}",
  "alignmentHighlights": ["3 key actionable takeaways comparing student goals with family preferences, each 15-25 words"],
  "parentGuide": {
    "observations": ["3 key observations about the student for parents based on psychometric data, each 20-30 words"],
    "homeStrategies": ["5 specific home environment strategies, each 15-25 words"],
    "communicationTips": ["3 communication tips for engaging with the student, each 20-30 words"]
  },
  "teacherGuide": {
    "classroomAdaptations": ["3 classroom adaptations for this student's profile, each 20-30 words"],
    "learningSupport": ["4 learning support recommendations, each 15-25 words"],
    "assessmentTips": ["3 assessment optimization tips, each 20-30 words"]
  },
  "careerRoadmap": {
    "shortTerm": ["4 immediate actions for this month, each 10-20 words"],
    "mediumTerm": ["4 goals for this academic year, each 10-20 words"],
    "longTerm": ["4 milestones for a 4-year plan formatted as 'Year N: description', each 15-25 words"]
  }
}

IMPORTANT RULES:
- Reference EXACT score percentages in strengths and observations. NEVER invent or hallucinate alternative score ranges or numbers (e.g. if Emotional Stability is 15%, do NOT call it 40%-60% or list it as a strength).
- Any trait scored below 40% (e.g. low Conscientiousness or low Emotional Stability) must NEVER be listed under 'strengths'. Address it constructively under 'growthAreas'.
- ${isSenior ? 'Since this is a Class 12 / Senior candidate, focus all recommendations on university admissions, degree selection, entrance examinations (JEE/CUET/NEET/CLAT/SAT), and higher education transitions. DO NOT mention Class 10 board prep or Class 11 stream selection.' : 'Since this is a Class 10 candidate, focus recommendations on Class 10 board examinations, Class 11 stream selection, and foundational career exploration.'}
- Mention the student's first name naturally
- Keep language professional and evidence-based
- If family comparison data is provided above, actively reflect parent-student alignment/gaps in familyAlignmentSummary and parentGuide
- Return ONLY the JSON object, no other text
`;
}

// ─── Fallback Template Personalization ──────────────────────────────────────

function buildFallbackPersonalization(
  student: EditorialStudent,
  sc: EditorialScores,
  comparisonData?: AlignmentResult | null
): PersonalizationData {
  const firstName = student.name.split(' ')[0];
  const topVarkLabel =
    sc.topVark === 'V' ? 'Visual' :
    sc.topVark === 'A' ? 'Auditory' :
    sc.topVark === 'R' ? 'Reading/Writing' : 'Kinesthetic';
  const gradeLabel = student.grade || 'Class 10';
  const isSenior = /12|senior/i.test(gradeLabel);

  const familySummary = comparisonData
    ? `Family Evaluation indicates ${comparisonData.overallIndicator}. Key alignment observed in ${comparisonData.areas?.filter(a => a.level.includes('alignment') || a.level === 'aligned').map(a => a.name).join(', ') || 'career expectations'}.`
    : `Family alignment is recommended to ensure student career targets align with home support structures.`;

  const highlights = comparisonData?.areas ? comparisonData.areas.slice(0, 3).map(a => `${a.name}: ${a.explanation}`) : [
    'Open dialogue on career expectations and degree preferences',
    'Shared planning around competitive entrance exam timelines and higher education budgets',
    'Collaborative decision-making empowering student autonomy'
  ];

  // Dynamically select strengths from candidate's genuine high scores (>= 60%)
  const candidateStrengths: string[] = [];
  if (sc.aptitude.numerical >= 80) candidateStrengths.push(`Exceptional numerical aptitude (${sc.aptitude.numerical}%) providing advanced quantitative problem solving`);
  if (sc.aptitude.spatial >= 80) candidateStrengths.push(`Superior spatial visualization (${sc.aptitude.spatial}%) enabling rapid 3D mental rotation and systems mapping`);
  if (sc.aptitude.reasoning >= 60) candidateStrengths.push(`High logical reasoning (${sc.aptitude.reasoning}%) supporting structured analytical deduction`);
  if (sc.aptitude.verbal >= 60) candidateStrengths.push(`Solid verbal analysis (${sc.aptitude.verbal}%) facilitating structured technical communication`);
  if (sc.personality.openness >= 50) candidateStrengths.push(`Active intellectual curiosity (Openness: ${sc.personality.openness}%) driving cross-disciplinary exploration`);
  if (sc.personality.conscientiousness >= 60) candidateStrengths.push(`Disciplined conscientiousness (${sc.personality.conscientiousness}%) providing methodical task completion`);
  if (sc.personality.emotionalStability >= 60) candidateStrengths.push(`Robust emotional stability (${sc.personality.emotionalStability}%) supporting calm exam performance`);
  candidateStrengths.push(`Dominant ${topVarkLabel.toLowerCase()} learning modality accelerating theory encoding and retention`);
  candidateStrengths.push(`Peak career fitment with ${sc.careerFitment?.[0]?.name || 'target domain'} (${sc.careerFitment?.[0]?.score || 85}% alignment)`);

  const candidateGrowthAreas: string[] = [];
  if (sc.personality.conscientiousness < 40) {
    candidateGrowthAreas.push(`Develop structured execution routines and kanban time-blocking to support spontaneous work rhythms (Conscientiousness: ${sc.personality.conscientiousness}%)`);
  }
  if (sc.personality.emotionalStability < 40) {
    candidateGrowthAreas.push(`Implement deliberate stress-buffering protocols and box breathing for timed exams (Emotional Stability: ${sc.personality.emotionalStability}%)`);
  }
  if (sc.aptitude.verbal < 65) {
    candidateGrowthAreas.push(`Strengthen formal academic essay drafting and verbal articulation for admissions applications (${sc.aptitude.verbal}%)`);
  }
  if (candidateGrowthAreas.length < 3) {
    candidateGrowthAreas.push(`Incorporate scheduled mock exam retrospectives to convert practice test errors into revision targets`);
  }

  const executiveSummary = isSenior
    ? `${student.name} demonstrates a high-capacity cognitive profile highlighted by elite quantitative reasoning (${sc.aptitude.numerical}%) and spatial visualization (${sc.aptitude.spatial}%). This orientation forms an exceptional foundation for advanced undergraduate programs in ${sc.careerFitment?.[0]?.name || 'Engineering & Applied Sciences'}. While analytical aptitude is robust (${sc.aptitude.overall}%), developing structured study habits (${sc.personality.conscientiousness}%) and stress-buffering routines (${sc.personality.emotionalStability}%) will ensure peak performance in competitive entrance examinations and pre-university coursework.`
    : `${student.name} demonstrates a well-rounded psychometric profile with notable strengths in analytical reasoning (${sc.aptitude.reasoning}%) and cognitive aptitude (${sc.aptitude.overall}%). The combination of logical problem-solving with ${topVarkLabel.toLowerCase()} learning preferences positions ${firstName} favorably for rigorous secondary and pre-university academic pathways aligned with ${sc.careerFitment?.[0]?.name || 'Science & Technology'}.`;

  const shortTerm = isSenior ? [
    'Conduct comprehensive syllabus gap audit for Class 12 Board exams and priority entrance tests',
    `Research top degree programs aligned with ${sc.careerFitment?.[0]?.name || 'target domain'}`,
    'Establish weekly routine of two full-length timed mock exams under test conditions',
    'Finalize target portfolio of reach, fit, and accessible university tiers'
  ] : [
    'Complete self-assessment of Class 10 board exam preparation gaps',
    `Research top 5 career paths aligned with ${sc.topRiasec.slice(0, 3).join('-')} profile`,
    'Set up structured weekly study timetable using block-scheduling',
    'Begin exploring competitive exam syllabi relevant to chosen career path'
  ];

  const mediumTerm = isSenior ? [
    'Complete Class 12 Pre-Board examinations with strong benchmark aggregate',
    'Submit university admission applications along with Statements of Purpose',
    'Conduct family financial alignment review to confirm tuition and living budgets',
    'Review entrance test error logs every 3 weeks to eliminate recurring mistakes'
  ] : [
    'Finalize Class 11 stream selection based on psychometric alignment',
    `Join relevant extracurricular clubs to develop technical and creative skills`,
    'Start foundational preparation for target entrance examinations',
    'Build a portfolio of projects or academic achievements'
  ];

  const longTerm = isSenior ? [
    'Year 1: Foundation building in core undergraduate coursework and campus technical teams',
    'Year 2: Specialized technical electives, hackathons, and initial summer internship',
    'Year 3: Industry capstone project, advanced internships, and graduate placement prep',
    'Year 4: Degree completion, pre-placement offer acceptance, or Master\'s transition'
  ] : [
    'Year 1: Foundation building in chosen stream + entrance exam fundamentals',
    'Year 2: Advanced preparation + mock tests + academic competitions',
    'Year 3: Strategic revision + admission applications + skill specialization',
    'Year 4: Final exam execution + university admissions + career pathway launch'
  ];

  return {
    executiveSummary,
    moduleInsights: {},
    familyAlignmentSummary: familySummary,
    alignmentHighlights: highlights,
    strengths: candidateStrengths.slice(0, 5),
    growthAreas: candidateGrowthAreas.slice(0, 3),
    crossDomainInsights: [
      `${firstName}'s high spatial visualization (${sc.aptitude.spatial}%) and numerical precision (${sc.aptitude.numerical}%) create an elite combination for engineering and complex systems design.`,
      `The balance between reflective analytical focus (Extraversion: ${sc.personality.extraversion}%) and cooperative diplomacy (Agreeableness: ${sc.personality.agreeableness}%) supports strong contribution in technical project teams.`,
      `Primary ${topVarkLabel} learning modality accelerates complex theory encoding when paired with visual schematics and practical simulation labs.`
    ],
    parentGuide: {
      observations: [
        `${firstName} demonstrates superior analytical and spatial abilities, excelling when given complex technical concepts to deconstruct.`,
        `The profile reflects a flexible execution rhythm, which benefits from external calendaring tools and milestone-based study check-ins.`,
        `Emotional stability at ${sc.personality.emotionalStability}% highlights the value of pre-exam relaxation routines and supportive home environments.`
      ],
      homeStrategies: [
        'Create a dedicated, low-distraction study space with structured focus blocks',
        `Support ${topVarkLabel.toLowerCase()}-aligned study resources such as peer recitation and discussion`,
        'Encourage 7.5+ hours of consistent sleep during intensive exam preparation weeks',
        'Maintain open discussions on university options aligned with intrinsic strengths',
        'Conduct monthly alignment check-ins to review academic goals and stress levels'
      ],
      communicationTips: [
        `${firstName} responds best to clear, evidence-based feedback on academic strategies`,
        'Celebrate consistency in study routines rather than focusing purely on test outcomes',
        'Encourage autonomous problem solving while offering guidance when roadblocks arise'
      ]
    },
    teacherGuide: {
      classroomAdaptations: [
        `Leverage ${firstName}'s high spatial visualization with diagrammatic problem-solving tasks`,
        'Provide structured time rubrics for assignments to support milestone execution',
        `Incorporate ${topVarkLabel.toLowerCase()} instructional formats such as verbal problem walk-throughs`
      ],
      learningSupport: [
        'Implement timed mock quizzes to build pacing endurance under exam conditions',
        'Pair with focused study peers for collaborative problem decomposition',
        'Provide advanced supplementary problems in quantitative and physical domains',
        'Offer clear feedback on written technical documentation and step-by-step proofs'
      ],
      assessmentTips: [
        `${firstName} excels in quantitative and diagrammatic assessment sections`,
        'Incorporate formative checkpoint milestones to maintain steady progress on long projects',
        'Provide low-stakes timed simulations to reduce evaluative anxiety before major exams'
      ]
    },
    careerRoadmap: {
      shortTerm,
      mediumTerm,
      longTerm
    }
  };
}

import { generateReportNarrative } from '@/lib/ai/llm-service';

// ─── Main Entry Point ───────────────────────────────────────────────────────

/**
 * Generate personalization data via Centralized LLM Service (Groq Primary -> Gemini Backup -> Template Fallback).
 */
export async function generatePersonalization(
  student: EditorialStudent,
  scores: EditorialScores,
  comparisonData?: AlignmentResult | null
): Promise<PersonalizationData> {
  return generateReportNarrative(
    student,
    scores,
    comparisonData,
    buildPersonalizationPrompt,
    buildFallbackPersonalization
  );
}
