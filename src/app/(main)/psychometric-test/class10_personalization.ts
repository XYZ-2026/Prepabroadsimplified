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
You are generating personalized insights for a Class 10 student's psychometric report.

STUDENT PROFILE:
- Name: ${student.name}
- Age: ${student.age}
- Grade: Class 10
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
  "strengths": ["5 specific strengths backed by score evidence, each 15-25 words"],
  "growthAreas": ["3 specific growth areas with actionable suggestions, each 15-25 words"],
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
- Reference specific score percentages in strengths and observations
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

  const familySummary = comparisonData
    ? `Family Evaluation indicates ${comparisonData.overallIndicator}. Key alignment observed in ${comparisonData.areas?.filter(a => a.level.includes('alignment') || a.level === 'aligned').map(a => a.name).join(', ') || 'career expectations'}.`
    : `Family alignment is recommended to ensure student career targets align with home support structures.`;

  const highlights = comparisonData?.areas ? comparisonData.areas.slice(0, 3).map(a => `${a.name}: ${a.explanation}`) : [
    'Open dialogue on career expectations and stream preferences',
    'Shared planning around competitive exam timelines and higher education budgets',
    'Collaborative decision-making empowering student autonomy'
  ];

  return {
    executiveSummary: `${student.name} demonstrates a well-rounded psychometric profile with notable strengths in analytical reasoning (${sc.aptitude.reasoning}%) and disciplined goal execution (Conscientiousness: ${sc.personality.conscientiousness}%). The combination of ${sc.aptitude.overall > 75 ? 'above-average' : 'solid'} cognitive aptitude with ${sc.personality.conscientiousness > 70 ? 'strong organizational discipline' : 'developing executive function skills'} positions ${firstName} ${sc.aptitude.overall > 75 ? 'exceptionally well' : 'favorably'} for rigorous academic pathways. The RIASEC code ${sc.topRiasec.slice(0, 3).join('-')} indicates alignment with ${sc.careerFitment?.[0]?.name || 'analytical and research-oriented'} career domains. We recommend prioritizing ${sc.careerFitment?.[0]?.name || 'Science & Technology'} streams in Class 11, supported by ${topVarkLabel.toLowerCase()}-focused study protocols.`,

    moduleInsights: {},
    familyAlignmentSummary: familySummary,
    alignmentHighlights: highlights,

    strengths: [
      `Strong analytical aptitude (${sc.aptitude.overall}%) with ${sc.aptitude.reasoning > 80 ? 'exceptional' : 'above-average'} logical reasoning capacity`,
      `${sc.personality.conscientiousness > 70 ? 'High' : 'Developing'} conscientiousness (${sc.personality.conscientiousness}%) enabling ${sc.personality.conscientiousness > 70 ? 'disciplined, goal-driven execution' : 'growing organizational skills'}`,
      `Emotional stability score of ${sc.personality.emotionalStability}% supporting ${sc.personality.emotionalStability > 70 ? 'calm, focused exam performance' : 'building resilience under pressure'}`,
      `Natural ${topVarkLabel.toLowerCase()} learning preference optimizing information absorption and retention`,
      `Strong career alignment with ${sc.careerFitment?.[0]?.name || 'STEM fields'} (${sc.careerFitment?.[0]?.score || 85}% fitment)`,
    ],

    growthAreas: [
      `${sc.personality.openness < 70 ? 'Expand cross-disciplinary exploration to strengthen creative problem solving' : 'Channel creative energy into structured project completion frameworks'}`,
      `${sc.aptitude.verbal < 75 ? 'Strengthen verbal comprehension through daily reading and vocabulary building' : 'Develop advanced written argumentation for competitive exam essays'}`,
      `Build ${sc.personality.emotionalStability < 70 ? 'structured stress management routines for high-stakes evaluations' : 'proactive exam simulation habits for competitive preparation'}`,
    ],

    crossDomainInsights: [
      `${firstName}'s ${sc.personality.openness > 70 ? 'high openness' : 'practical orientation'} combined with ${sc.aptitude.reasoning > 75 ? 'strong reasoning' : 'developing analytical skills'} creates ${sc.personality.openness > 70 ? 'an ideal profile for research-driven academic pathways' : 'a solid foundation for structured technical learning'}`,
      `The balance between ${sc.personality.extraversion > 60 ? 'social energy' : 'reflective focus'} and ${sc.personality.agreeableness > 70 ? 'empathetic awareness' : 'analytical directness'} suggests effectiveness in ${sc.personality.extraversion > 60 ? 'collaborative leadership' : 'independent technical'} environments`,
      `${topVarkLabel} learning preference paired with ${sc.personality.conscientiousness > 70 ? 'disciplined study habits' : 'flexible scheduling'} indicates optimal performance when study materials are ${sc.topVark === 'V' ? 'visually structured' : sc.topVark === 'A' ? 'discussion-based' : sc.topVark === 'R' ? 'text-rich' : 'hands-on'}`,
    ],

    parentGuide: {
      observations: [
        `${firstName} demonstrates ${sc.aptitude.overall > 75 ? 'strong' : 'developing'} analytical capabilities and benefits from environments that ${sc.personality.openness > 70 ? 'challenge intellectual curiosity' : 'provide clear structure and goals'}`,
        `The profile indicates a ${sc.personality.conscientiousness > 70 ? 'disciplined' : 'flexible'} approach to study routines, ${sc.personality.conscientiousness > 70 ? 'which is a significant academic advantage' : 'which can be strengthened through external scheduling tools'}`,
        `Emotional stability at ${sc.personality.emotionalStability}% suggests ${sc.personality.emotionalStability > 70 ? 'strong resilience under exam pressure' : 'an opportunity to develop stress management techniques'}`,
      ],
      homeStrategies: [
        'Create a dedicated, distraction-free study zone with consistent daily schedule',
        `Encourage ${sc.topVark === 'V' ? 'visual study aids like mind maps and flowcharts' : sc.topVark === 'A' ? 'discussion-based learning and verbal explanations' : sc.topVark === 'R' ? 'detailed note-taking and written summaries' : 'hands-on projects and practical experimentation'}`,
        'Support balanced screen time with physical activity and adequate sleep (8+ hours)',
        'Discuss career interests openly without imposing predetermined expectations',
        'Schedule quarterly progress reviews to adjust academic strategies dynamically',
      ],
      communicationTips: [
        `${firstName} responds best to ${sc.personality.agreeableness > 70 ? 'supportive, encouraging feedback' : 'direct, evidence-based feedback'} regarding academic performance`,
        `Frame setbacks as diagnostic data points rather than failures — this aligns with their ${sc.personality.emotionalStability > 70 ? 'naturally resilient' : 'growth-oriented'} temperament`,
        'Celebrate effort and strategy improvements, not just outcome metrics',
      ],
    },

    teacherGuide: {
      classroomAdaptations: [
        `Leverage ${firstName}'s ${sc.personality.openness > 70 ? 'high intellectual curiosity with open-ended research assignments' : 'preference for structured learning with clear rubrics and step-by-step instruction'}`,
        `${sc.personality.extraversion > 60 ? 'Assign group leadership roles and public presentation opportunities' : 'Provide written submission alternatives and safe one-on-one discussion opportunities'}`,
        `Utilize ${sc.topVark === 'V' ? 'visual diagrams, flowcharts, and infographics' : sc.topVark === 'A' ? 'class discussions and Socratic questioning' : sc.topVark === 'R' ? 'detailed handouts and reading assignments' : 'lab experiments and interactive simulations'} as primary instructional modalities`,
      ],
      learningSupport: [
        'Implement spaced retrieval practice with regular low-stakes quizzes',
        `Pair with ${sc.personality.extraversion > 60 ? 'reflective, detail-oriented study partners' : 'encouraging, communicative peers to build confidence'}`,
        'Provide advance organizers before complex topics to activate prior knowledge',
        'Offer tiered difficulty levels in assignments for optimal cognitive challenge',
      ],
      assessmentTips: [
        `${firstName} performs best in ${sc.personality.emotionalStability > 70 ? 'both timed and untimed assessment formats' : 'low-pressure environments with adequate preparation time'}`,
        'Use formative assessment checkpoints to identify comprehension gaps early',
        `Provide ${sc.personality.agreeableness > 70 ? 'collaborative project assessments' : 'individual analytical assignments'} to leverage cognitive strengths`,
      ],
    },

    careerRoadmap: {
      shortTerm: [
        'Complete self-assessment of Class 10 board exam preparation gaps',
        `Research top 5 career paths aligned with ${sc.topRiasec.slice(0, 3).join('-')} profile`,
        'Set up structured weekly study timetable using block-scheduling',
        'Begin exploring competitive exam syllabi relevant to chosen career path',
      ],
      mediumTerm: [
        'Finalize Class 11 stream selection based on psychometric alignment',
        `Join relevant extracurricular clubs to develop ${sc.personality.openness > 70 ? 'creative' : 'technical'} skills`,
        'Start foundational preparation for target entrance examinations',
        'Build a portfolio of projects or academic achievements',
      ],
      longTerm: [
        'Year 1: Foundation building in chosen stream + entrance exam fundamentals',
        'Year 2: Advanced preparation + mock tests + academic competitions',
        'Year 3: Strategic revision + admission applications + skill specialization',
        'Year 4: Final exam execution + university admissions + career pathway launch',
      ],
    },
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
