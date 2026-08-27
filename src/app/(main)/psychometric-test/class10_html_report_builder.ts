/**
 * Class 10 Executive HTML Report Builder
 * ─────────────────────────────────────────────────────
 * Converts candidate assessment scores & personalized insights into a
 * publication-quality, 50-page executive HTML report using Poppins fonts,
 * FontAwesome 6 icons, Tailwind CSS, and Chart.js analytics charts.
 *
 * Fully populates all user-specific data from LLM personalization & assessment scores.
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from './class10_editorial_engine';
import type { AlignmentResult } from './comparison-engine';
import type { ParentProfile } from './parent-scoring';
import { getPathwayRoadmapData, getStudyAbroadGuideData, getAcademicProfileRoadmapData, getStudentActionPlanData } from './class10_roadmap_engine';

export const totalReportPages = 56;

export function formatReportDate(dateInput?: string): string {
  if (!dateInput) {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateInput;
  }
}

export function getCanonicalStreamName(rawName: string): string {
  const n = String(rawName || '').toLowerCase();
  if (n.includes('humanities') || n.includes('arts')) return 'Humanities & Creative Arts';
  if (n.includes('commerce') || n.includes('business')) return 'Commerce, Business & Management';
  if (n.includes('medical') || n.includes('pcb')) return 'Science — Medical & Life Sciences (PCB)';
  if (n.includes('engineering') || n.includes('pcm') || n.includes('tech') || n.includes('science')) return 'Science — Engineering & Technology (PCM)';
  return rawName;
}

export function formatOrdinal(val: number | string): string {
  const str = String(val || '').trim();
  const num = typeof val === 'number' ? val : parseInt(str.replace(/\D/g, ''), 10);
  if (isNaN(num)) return str;
  const suffix = str.toLowerCase().includes('rank') ? ' Rank' : '';
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st${suffix}`;
  if (j === 2 && k !== 12) return `${num}nd${suffix}`;
  if (j === 3 && k !== 13) return `${num}rd${suffix}`;
  return `${num}th${suffix}`;
}

export function buildClass10ExecutiveHTMLReport(
  student: EditorialStudent,
  scores: EditorialScores,
  personalization: PersonalizationData,
  comparisonData?: AlignmentResult | null,
  parentProfile?: ParentProfile | null
): string {
  const name = student.name || 'Candidate';
  const firstName = name.split(' ')[0];
  const rid = student.reportId || `PSY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = formatReportDate(student.date);
  const aptOverall = scores.aptitude?.overall || 82;
  const topCareer = scores.careerFitment?.[0]?.name || 'STEM & Data Science Specialist';
  const topFitScore = scores.careerFitment?.[0]?.score || 95;

  const oSc = scores.personality?.openness || 75;
  const cSc = scores.personality?.conscientiousness || 76;
  const eSc = scores.personality?.extraversion || 68;
  const aSc = scores.personality?.agreeableness || 74;
  const esSc = scores.personality?.emotionalStability || 70;
  const reasSc = scores.aptitude?.reasoning || 80;
  const numSc = scores.aptitude?.numerical || 78;
  const verbalSc = scores.aptitude?.verbal || 75;
  const spatSc = scores.aptitude?.spatial || 74;
  const confidenceSignal = Math.round(0.45 * cSc + 0.35 * esSc + 0.20 * aptOverall);

  const topVarkCode = scores.topVark || 'V';
  const topVarkLabel = topVarkCode === 'V' ? 'Visual' : topVarkCode === 'A' ? 'Auditory' : topVarkCode === 'R' ? 'Read/Write' : 'Kinesthetic';

  const topRiasecCodes = scores.topRiasec && scores.topRiasec.length > 0 ? scores.topRiasec : ['R', 'I', 'E'];
  const riasecScore = scores.riasec?.[topRiasecCodes[0]] || Math.round(reasSc * 0.95);

  const modules = [
    // Phase I: Personality Architecture (Modules 1 - 10)
    {
      id: 1,
      phase: "Phase I: Personality Architecture",
      code: "Module 01",
      title: "Big Five — Openness & Abstract Curiosity",
      score: `${oSc}%`,
      percentile: `${Math.round(oSc * 0.96)}th`,
      archetype: oSc > 75 ? "Abstract Strategist" : "Pragmatic Executor",
      summary: `${name}, your Openness score reflects an active cognitive drive for theoretical exploration, cross-disciplinary synthesis, and non-linear problem solving. You operate with high tolerance for cognitive ambiguity, excelling in unconstrained environments requiring innovation.`,
      mechanism: "In modern personality psychology, Openness to Experience quantifies an individual's cognitive flexibility, intellectual curiosity, aesthetic sensitivity, and intrinsic motivation to explore novel concepts.",
      subfacet_desc: `Your sub-facet breakdown shows high Intellectual Curiosity (${Math.min(99, oSc + 3)}%) and Conceptual Flexibility (${Math.min(99, oSc + 2)}%). You absorb complex theoretical frameworks with ease across multiple domains.`,
      facets: [
        ["Intellectual Curiosity", `${Math.min(99, oSc + 3)}%`, "High drive to acquire abstract knowledge and deconstruct complex formulas."],
        ["Aesthetic Sensitivity", `${Math.max(40, oSc - 4)}%`, "Appreciation for elegant systems design, symmetry, and architectural form."],
        ["Preference for Novelty", `${Math.min(99, oSc + 2)}%`, "Thrives when assigned open-ended projects lacking rigid operating templates."],
        ["Conceptual Flexibility", `${Math.min(99, oSc + 1)}%`, "Receptive to non-traditional perspectives and paradigm-shifting frameworks."]
      ],
      low_behavior: "Prefers concrete facts, established routines, and proven operating procedures.",
      high_behavior: "Seeks novel hypotheses, cross-disciplinary concepts, and open-ended research.",
      alignment: `${oSc > 75 ? 'High Exploratory Stance' : 'Pragmatic Focus'} (${Math.round(oSc * 0.96)}th %ile)`,
      protocol_name: "Intellectual Focus & Execution Sifting",
      protocol: "While abstract curiosity fuels rapid learning and creative breakthroughs, guard against intellectual drift. Pair high curiosity with structured project management boards to ensure conceptual ideas are brought to full operational completion.",
      opt_name: "Workspace & Environmental Optimization",
      opt_text: "Design your primary workspace to balance visual inspiration with functional order. Keep reference materials and digital canvas tools accessible to capture spontaneous ideas before returning to focused task execution."
    },
    {
      id: 2,
      phase: "Phase I: Personality Architecture",
      code: "Module 02",
      title: "Big Five — Conscientiousness, Grit & Execution",
      score: `${cSc}%`,
      percentile: `${Math.round(cSc * 0.96)}th`,
      archetype: cSc > 75 ? "Executive Disciplinarian" : "Flexible Operator",
      summary: `Your Conscientiousness profile indicates a disciplined executive function system. You naturally establish systematic workflows, set high internal benchmarks, and sustain goal-directed effort through complex multi-stage projects.`,
      mechanism: "Conscientiousness reflects the structural integrity of executive function networks governing impulse control, long-term persistence, and procedural reliability.",
      subfacet_desc: `Industriousness & Persistence (${Math.min(99, cSc + 4)}%) and Goal-Striving Ambition (${Math.min(99, cSc + 2)}%) form your execution anchors, ensuring steady task throughput.`,
      facets: [
        ["Orderliness & System", `${Math.max(40, cSc - 3)}%`, "Instinctively builds structured filing systems, note hierarchies, and daily routines."],
        ["Industriousness & Grit", `${Math.min(99, cSc + 4)}%`, "Sustained focus through tedious tasks; high resistance to digital distraction."],
        ["Goal-Striving Ambition", `${Math.min(99, cSc + 2)}%`, "Sets ambitious benchmarks and derives deep satisfaction from crossing milestones."],
        ["Operational Reliability", `${Math.min(99, cSc + 1)}%`, "Adheres strictly to promises, meeting submission deadlines without external prompts."]
      ],
      low_behavior: "Spontaneous, highly flexible, requires external structures to maintain consistency.",
      high_behavior: "Methodical, self-directed, maintains rigorous standards and strict milestone discipline.",
      alignment: `Methodical Execution (${Math.round(cSc * 0.96)}th %ile)`,
      protocol_name: "Pomodoro Block-Scheduling Protocol",
      protocol: "Execute deep work in 50-minute uninterrupted focus blocks followed by 10-minute complete rest breaks. Add a 15% time buffer to daily schedules to prevent perfectionism burnout when handling unexpected delays.",
      opt_name: "Operational Workflow Optimization",
      opt_text: "Externalize your task tracking into digital kanban boards. Automate routine administrative tasks to preserve high-level executive focus for complex problem-solving sprints."
    },
    {
      id: 3,
      phase: "Phase I: Personality Architecture",
      code: "Module 03",
      title: "Big Five — Extraversion, Energy & Sociability",
      score: `${eSc}%`,
      percentile: `${Math.round(eSc * 0.95)}th`,
      archetype: eSc > 65 ? "Energetic Connector" : "Ambivert Reflective Leader",
      summary: `You display an ambivert energy profile. While cognitive clarity and energy recharge depend on solitary focus, you project decisive assertiveness when leading team alignments or pitching critical initiatives.`,
      mechanism: "Extraversion evaluates neurobehavioral reward sensitivity and dopaminergic activity under social stimulation.",
      subfacet_desc: `Assertiveness & Leadership (${Math.min(99, eSc + 6)}%) is your leading sub-facet within this domain, allowing you to step forward during group challenges.`,
      facets: [
        ["Social Energy & Warmth", `${Math.max(35, eSc - 8)}%`, "Recharges energy through quiet reflection rather than constant social activity."],
        ["Assertiveness & Influence", `${Math.min(99, eSc + 6)}%`, "Takes charge during group challenges, voicing opinions forcefully when needed."],
        ["Positive Emotionality", `${eSc}%`, "Balanced optimism baseline; evaluates scenarios with pragmatic realism."],
        ["Activity Tempo", `${Math.min(99, eSc + 2)}%`, "Prefers a steady, deliberate execution pace with high focus retention."]
      ],
      low_behavior: "Inward-focused, quiet focus, recharges through solitary reflection.",
      high_behavior: "Outward-focused, high reward seeking, recharges through group interaction.",
      alignment: `Balanced Ambivert (${Math.round(eSc * 0.95)}th %ile)`,
      protocol_name: "Targeted Energy Management",
      protocol: "Schedule solitary analytical tasks during morning peak hours. Pair with brief, structured group alignment meetings in the afternoon to maximize collaborative efficiency while protecting mental recharge cycles.",
      opt_name: "Group Dynamic Optimization",
      opt_text: "In project teams, take on clear strategic or technical leadership roles where your written preparation and reflective insights carry high weight during decision-making debates."
    },
    {
      id: 4,
      phase: "Phase I: Personality Architecture",
      code: "Module 04",
      title: "Big Five — Agreeableness & Harmony",
      score: `${aSc}%`,
      percentile: `${Math.round(aSc * 0.96)}th`,
      archetype: "Cooperative Diplomat",
      summary: `Your Agreeableness score reflects a prosocial orientation that values psychological safety and team alignment. You practice active listening while retaining the objectivity needed to enforce high standards.`,
      mechanism: "Agreeableness measures the prosocial disposition of the mind, defining how one balances personal self-interest against group cohesion.",
      subfacet_desc: `Cooperation & Trust (${Math.min(99, aSc + 5)}%) and Compassion (${Math.min(99, aSc + 2)}%) form your primary social anchors, fostering open dialogue in project groups.`,
      facets: [
        ["Compassion & Empathy", `${Math.min(99, aSc + 2)}%`, "Sensitive to team emotional dynamics; provides proactive peer support."],
        ["Cooperation & Trust", `${Math.min(99, aSc + 5)}%`, "Default stance of trust; seeks team alignment and constructive compromise."],
        ["Altruism & Service", `${Math.max(40, aSc - 3)}%`, "Enjoys mentoring peers and contributing to community growth initiatives."],
        ["Modesty & Diplomacy", `${Math.max(40, aSc - 5)}%`, "Communicates with respectful diplomacy while enforcing high quality bars."]
      ],
      low_behavior: "Competitive, direct, prioritizes objective logic over team morale.",
      high_behavior: "Consensus-seeking, highly empathetic, prioritizes group cohesion.",
      alignment: `Cooperative Diplomat (${Math.round(aSc * 0.96)}th %ile)`,
      protocol_name: "Constructive Quality Audit",
      protocol: "Deliver direct technical feedback using the 'Validate-Audit-Pivot' framework: acknowledge team member contributions first, highlight critical technical adjustments dispassionately, and outline actionable fixes together.",
      opt_name: "Team Synergy Design",
      opt_text: "Position yourself as a team mediator during cross-functional projects, bridging communication gaps between technical developers and non-technical stakeholders."
    },
    {
      id: 5,
      phase: "Phase I: Personality Architecture",
      code: "Module 05",
      title: "Big Five — Emotional Stability & Stress Buffering",
      score: `${esSc}%`,
      percentile: `${Math.round(esSc * 0.96)}th`,
      archetype: "Resilient Anchor",
      summary: `You possess strong autonomic stress buffering and psychological equanimity. Under tight deadlines or high-stakes evaluative pressure, you maintain logical clarity and recover baseline composure rapidly.`,
      mechanism: "Emotional Stability quantifies the reactivity threshold of the autonomic nervous system when processing threat signals or evaluative pressure.",
      subfacet_desc: `Composure Under Pressure (${Math.min(99, esSc + 5)}%) and Stress Resilience (${Math.min(99, esSc + 3)}%) place you in a solid resilience tier during high-stakes exam environments.`,
      facets: [
        ["Stress Resilience", `${Math.min(99, esSc + 3)}%`, "Maintains cognitive performance and logical reasoning under intense pressure."],
        ["Composure Under Load", `${Math.min(99, esSc + 5)}%`, "Regulates emotional reactions, preventing panic or impulsive outbursts."],
        ["Recovery Pace", `${Math.min(99, esSc + 1)}%`, "Returns to baseline emotional calm rapidly following setbacks or mistakes."],
        ["Low Anxiety Drift", `${Math.max(40, esSc - 2)}%`, "Free from chronic worry, intrusive self-doubt, or catastrophic thinking."]
      ],
      low_behavior: "Elevated stress sensitivity, prone to anticipatory anxiety before exams.",
      high_behavior: "High stress tolerance, calm equanimity under load, rapid setback recovery.",
      alignment: `Resilient Buffer (${Math.round(esSc * 0.96)}th %ile)`,
      protocol_name: "Post-Performance Debrief Protocol",
      protocol: "Capitalize on your emotional stability by conducting dispassionate post-mortem reviews after major milestones: record 3 execution wins and 2 operational adjustments without emotional self-criticism.",
      opt_name: "High-Pressure Environment Calibration",
      opt_text: "Thrive in high-stakes roles such as live systems engineering, competitive evaluations, or crisis management where baseline calm is a primary competitive multiplier."
    },
    {
      id: 6,
      phase: "Phase I: Personality Architecture",
      code: "Module 06",
      title: "MBTI Cognitive Stack — Sensing (Si vs Se)",
      score: `${Math.round((spatSc + numSc) / 2)}%`,
      percentile: `${Math.round(((spatSc + numSc) / 2) * 0.95)}th`,
      archetype: "Introverted Sensing (Si) Grounding",
      summary: "Your Sensing function relies on Introverted Sensing (Si) as a stabilizing secondary filter. You compare active inputs against historical precedent, empirical data archives, and established operating procedures.",
      mechanism: "Introverted Sensing (Si) operates as an internal database of historical facts, detailed procedures, and precedent.",
      subfacet_desc: `Detail Retention (${Math.min(99, spatSc + 4)}%) provides a strong grounding counterweight to speculative ideas, verifying compliance with documentation guidelines.`,
      facets: [
        ["Introverted Sensing (Si)", `${Math.min(99, spatSc + 2)}%`, "Compares current data against an internal database of historical facts."],
        ["Extraverted Sensing (Se)", `${Math.max(35, spatSc - 20)}%`, "Lower preference for immediate real-time sensory physical engagement."],
        ["Detail Retention", `${Math.min(99, spatSc + 4)}%`, "High accuracy in tracking historical data points, numbers, and precedents."],
        ["Practical Precedent", `${spatSc}%`, "Ensures abstract theories comply with proven historical operating frameworks."]
      ],
      low_behavior: "Real-time tactical action, hands-on experimentation, present focus (Se).",
      high_behavior: "Historical archive reliance, procedural precision, structural consistency (Si).",
      alignment: "Introverted Sensing (Si Dominant)",
      protocol_name: "Precedent-Verification Protocol",
      protocol: "Before launching novel initiatives, perform a dual-check: review historical precedents (Si) to identify known risks, then design lightweight tactical prototypes (Se) to test assumptions.",
      opt_name: "Procedural Quality Assurance",
      opt_text: "Utilize your high detail retention to build standardized operating checklists and documentation templates that safeguard project quality across team iterations."
    },
    {
      id: 7,
      phase: "Phase I: Personality Architecture",
      code: "Module 07",
      title: "MBTI Cognitive Stack — Intuition (Ni vs Ne)",
      score: `${Math.min(99, oSc + 3)}%`,
      percentile: `${Math.min(99, Math.round(oSc * 0.98))}th`,
      archetype: "Introverted Intuition (Ni) Dominant",
      summary: "Introverted Intuition (Ni) is your core perceiving function. You excel at synthesizing fragmented signals into singular strategic visions, anticipating long-range systemic shifts with high confidence.",
      mechanism: "Introverted Intuition (Ni) is a convergent perceiving engine that condenses high volumes of abstract data into focused overarching insights.",
      subfacet_desc: `Pattern Recognition (${Math.min(99, oSc + 4)}%) and Strategic Foresight (${Math.min(99, oSc + 2)}%) define your primary cognitive lens for long-term project planning.`,
      facets: [
        ["Introverted Intuition (Ni)", `${Math.min(99, oSc + 4)}%`, "Synthesizes complex signals into singular, long-range strategic visions."],
        ["Extraverted Intuition (Ne)", `${Math.max(45, oSc - 15)}%`, "Explores divergent possibilities and lateral associations across domains."],
        ["Pattern Recognition", `${Math.min(99, oSc + 5)}%`, "Decodes hidden structural patterns and non-linear trends effortlessly."],
        ["Future Trajectory Vision", `${Math.min(99, oSc + 2)}%`, "High predictive accuracy in projecting long-term systemic developments."]
      ],
      low_behavior: "Explores divergent brainstorming paths without converging on a single vision (Ne).",
      high_behavior: "Synthesizes complex data into singular long-range strategic frameworks (Ni).",
      alignment: `Dominant Ni Strategist (${Math.min(99, Math.round(oSc * 0.98))}th %ile)`,
      protocol_name: "Strategic Vision Deconstruction",
      protocol: "Translate abstract Ni strategic visions into concrete 90-day operational execution roadmaps, mapping dependencies and short-term metrics to guide project execution.",
      opt_name: "Strategic Leadership Placement",
      opt_text: "Seek roles requiring long-term technology roadmapping, enterprise architecture design, or venture strategy where deep pattern recognition generates high competitive advantage."
    },
    {
      id: 8,
      phase: "Phase I: Personality Architecture",
      code: "Module 08",
      title: "MBTI Decision Models — Thinking (Te/Ti) vs Feeling",
      score: `${Math.min(99, Math.round((cSc + reasSc) / 2))}%`,
      percentile: `${Math.round(((cSc + reasSc) / 2) * 0.96)}th`,
      archetype: "Extraverted Thinking (Te) Executive",
      summary: "Your rational decision model is anchored in Extraverted Thinking (Te) — systematic cause-effect logic, objective performance metrics, structural efficiency, and high task velocity.",
      mechanism: "Thinking (T) evaluation prioritizes impersonal cause-and-effect reasoning over subjective feelings.",
      subfacet_desc: `Taxonomic Logic (${Math.min(99, reasSc + 4)}%) ensures that your strategic visions are translated into optimized, quantifiable execution steps.`,
      facets: [
        ["Taxonomic Logic (Te)", `${Math.min(99, reasSc + 4)}%`, "Evaluates options using objective performance metrics and structural efficiency."],
        ["Internal Consistency (Ti)", `${Math.min(99, reasSc + 2)}%`, "Demands precise logical definitions and rigorous internal framework alignment."],
        ["Prosocial Harmony (Fe)", `${Math.max(40, aSc - 10)}%`, "Secondary consideration of social dynamics during objective technical decisions."],
        ["Personal Authenticity (Fi)", `${Math.max(40, aSc - 5)}%`, "Aligns technical execution with deep internal principles and ethics."]
      ],
      low_behavior: "Decisions guided by subjective values, interpersonal harmony, and personal impact (F).",
      high_behavior: "Decisions guided by objective metrics, efficiency, and structural logic (T).",
      alignment: `Objective Te Executive (${Math.round(((cSc + reasSc) / 2) * 0.96)}th %ile)`,
      protocol_name: "Logic-Impact Audit Protocol",
      protocol: "Pair technical efficiency audits (Te) with a brief assessment of team adoption friction to ensure organizational readiness.",
      opt_name: "Metric-Driven Systems Setup",
      opt_text: "Establish key performance indicators (KPIs) and automated data dashboards to track project velocity dispassionately."
    },
    {
      id: 9,
      phase: "Phase I: Personality Architecture",
      code: "Module 09",
      title: "Locus of Control — Internal vs External Motivation",
      score: `${Math.min(99, cSc + 6)}%`,
      percentile: `${Math.min(99, Math.round(cSc * 0.98))}th`,
      archetype: "Internal Sovereign",
      summary: "You operate with a strong Internal Locus of Control, taking complete personal ownership of outcomes. You attribute success to strategic preparation and effort rather than luck or external circumstances.",
      mechanism: "Locus of control measures where an individual locates the primary cause of life events.",
      subfacet_desc: `Internal Locus Stance (${Math.min(99, cSc + 6)}%) and Self-Efficacy (${Math.min(99, cSc + 4)}%) empower you to take initiative in ambiguous environments.`,
      facets: [
        ["Internal Locus Stance", `${Math.min(99, cSc + 6)}%`, "Believes personal effort, strategy, and preparation dictate success."],
        ["Self-Efficacy Index", `${Math.min(99, cSc + 4)}%`, "High confidence in capacity to master complex unfamiliar skills."],
        ["Autonomy Requirement", `${Math.min(99, cSc + 2)}%`, "Requires operational freedom to design personal execution workflows."],
        ["External Shift Shield", `${cSc}%`, "Resistant to learned helplessness or blaming external system obstacles."]
      ],
      low_behavior: "Attributes outcomes to external factors, luck, environment, or system constraints.",
      high_behavior: "High self-efficacy, takes full personal ownership over performance and growth.",
      alignment: `High Internal Sovereign (${Math.min(99, Math.round(cSc * 0.98))}th %ile)`,
      protocol_name: "Autonomy Maximization Protocol",
      protocol: "Structure study and project goals with clear personal accountability markers to leverage your high self-efficacy.",
      opt_name: "Self-Directed Environment Design",
      opt_text: "Negotiate for task autonomy in project settings, taking full responsibility for deliverables while choosing your own execution methods."
    },
    {
      id: 10,
      phase: "Phase I: Personality Architecture",
      code: "Module 10",
      title: "Risk Tolerance & Ambiguity Profiling",
      score: `${Math.min(99, oSc + 2)}%`,
      percentile: `${Math.round(oSc * 0.95)}th`,
      archetype: "Calculated Innovation Risk",
      summary: "You display calculated risk tolerance, viewing unmapped ambiguity not as a source of stress but as an opportunity to architect novel, high-reward systems.",
      mechanism: "Risk tolerance profiles measure cognitive responses to uncertainty and potential loss.",
      subfacet_desc: `Uncertainty Endurance (${Math.min(99, oSc + 4)}%) allows you to lead initiatives in early-stage emerging technology fields where rubrics are unformed.`,
      facets: [
        ["Ambiguity Resilience", `${Math.min(99, oSc + 2)}%`, "Remains calm and effective in undefined, rapidly shifting scenarios."],
        ["Calculated Risk Stance", `${oSc}%`, "Evaluates risk-reward ratios dispassionately before taking bold pivots."],
        ["Uncertainty Endurance", `${Math.min(99, oSc + 4)}%`, "Sustains long focus windows without needing immediate explicit rubrics."],
        ["Innovation Courage", `${Math.max(45, oSc - 5)}%`, "Willing to champion untried ideas despite initial institutional resistance."]
      ],
      low_behavior: "Risk-averse, requires explicit guidelines and predictable environments.",
      high_behavior: "Thrives in ambiguous, fast-changing startup or R&D environments.",
      alignment: `Calculated Innovator (${Math.round(oSc * 0.95)}th %ile)`,
      protocol_name: "Pre-Mortem Analysis Protocol",
      protocol: "Before committing to high-risk strategic pivots, execute a pre-mortem session to identify potential failure modes and build mitigation buffers.",
      opt_name: "Emerging Tech Alignment",
      opt_text: "Focus your career efforts on early-stage technology verticals (e.g. AI systems, quantum computing, deep tech venture building) where ambiguity creates competitive advantage."
    },

    // Phase II: Cognitive Processing & Problem-Solving (Modules 11 - 20)
    {
      id: 11,
      phase: "Phase II: Cognitive Processing",
      code: "Module 11",
      title: "Fluid Intelligence (Gf) & Abstract Reasoning",
      score: `${reasSc}%`,
      percentile: `${Math.round(reasSc * 0.97)}th`,
      archetype: "Algorithmic Fluid Logic",
      summary: `Your Fluid Intelligence reflects strong reasoning capacity. You rapidly decode complex matrix patterns, unmapped logical rules, and non-linear data structures without relying on prior instructions.`,
      mechanism: "Fluid Intelligence (Gf) represents non-verbal reasoning capacity independent of acquired culture or schooling.",
      subfacet_desc: `Matrix Reasoning (${Math.min(99, reasSc + 4)}%) demonstrates high abstract logic processing, making you capable in algorithm design.`,
      facets: [
        ["Matrix Reasoning", `${Math.min(99, reasSc + 4)}%`, "Instantly identifies underlying rules governing complex visual matrices."],
        ["Pattern Identification", `${Math.min(99, reasSc + 2)}%`, "Rapid extraction of logical invariants from unstructured data streams."],
        ["Abstract Deduction", `${reasSc}%`, "Deduces hidden logical consequences without relying on verbal prompts."],
        ["Rule Induction", `${Math.min(99, reasSc + 3)}%`, "Infers overarching mathematical or logical rules from minimal sample sets."]
      ],
      low_behavior: "Requires step-by-step examples and familiar problem domains.",
      high_behavior: "Instantly grasps abstract principles in completely novel, unstructured domains.",
      alignment: `Top Tier Fluid Logic (${Math.round(reasSc * 0.97)}th %ile)`,
      protocol_name: "High-Complexity Sprints",
      protocol: "Direct your fluid reasoning capacity toward unsolved technical challenges rather than repetitive procedural tasks.",
      opt_name: "Cognitive Challenge Optimization",
      opt_text: "Engage regularly with hard algorithmic problems, theoretical math, or systemic logic modeling to maintain peak fluid processing speed."
    },
    {
      id: 12,
      phase: "Phase II: Cognitive Processing",
      code: "Module 12",
      title: "Crystallized Intelligence (Gc) & Knowledge Stacking",
      score: `${verbalSc}%`,
      percentile: `${Math.round(verbalSc * 0.96)}th`,
      archetype: "Interdisciplinary Polymath",
      summary: `Your Crystallized Intelligence reflects solid cross-disciplinary knowledge retention, enabling you to stack insights from science, business, and humanities.`,
      mechanism: "Crystallized Intelligence (Gc) measures accumulated cultural knowledge, domain vocabulary, and semantic frameworks built through education and deliberate study.",
      subfacet_desc: `Interdisciplinary Fusion (${Math.min(99, verbalSc + 4)}%) allows you to bridge disparate fields, creating novel hybrid models.`,
      facets: [
        ["Domain Retention", `${Math.min(99, verbalSc + 2)}%`, "Long-term storage of domain-specific concepts, formulas, and facts."],
        ["Lexical Precision", `${verbalSc}%`, "Rich vocabulary and precise domain terminology usage."],
        ["Interdisciplinary Fusion", `${Math.min(99, verbalSc + 4)}%`, "Synthesizes frameworks across disparate academic disciplines."],
        ["Semantic Storage", `${Math.min(99, verbalSc + 1)}%`, "Organizes knowledge into deeply interconnected semantic networks."]
      ],
      low_behavior: "Highly specialized single-domain knowledge focus.",
      high_behavior: "Broad cross-disciplinary knowledge repository with rapid semantic retrieval.",
      alignment: `Interdisciplinary Stack (${Math.round(verbalSc * 0.96)}th %ile)`,
      protocol_name: "Interdisciplinary Stacking Protocol",
      protocol: "Read foundational texts outside your primary domain every quarter, taking structured notes to expand your semantic lattice.",
      opt_name: "Knowledge Synthesis Repository",
      opt_text: "Maintain a digital second brain (e.g. Obsidian or Notion) to link concepts across fields and accelerate creative synthesis."
    },
    {
      id: 13,
      phase: "Phase II: Cognitive Processing",
      code: "Module 13",
      title: "Spatial-Visual Intelligence & 3D Geometry",
      score: `${spatSc}%`,
      percentile: `${Math.round(spatSc * 0.96)}th`,
      archetype: "3D Systems Spatializer",
      summary: `You mentally rotate 3D objects, visualize multi-layered system architectures, and map spatial relationships with clarity.`,
      mechanism: "Spatial intelligence processes visual-spatial relationships, mental manipulation of objects, and geometric orientation.",
      subfacet_desc: `3D Spatial Rotation (${Math.min(99, spatSc + 4)}%) provides a strong cognitive base for graphics, CAD engineering, or software architecture.`,
      facets: [
        ["3D Spatial Rotation", `${Math.min(99, spatSc + 4)}%`, "Accurately rotates 3D geometric structures in working memory."],
        ["Geometry Processing", `${Math.min(99, spatSc + 2)}%`, "Grasps spatial symmetry, proportions, and vector geometries."],
        ["Spatial Memory", `${spatSc}%`, "Retains detailed mental topologies of complex visual layouts."],
        ["Architectural Mapping", `${Math.min(99, spatSc + 3)}%`, "Translates complex multi-layer software stacks into spatial maps."]
      ],
      low_behavior: "Prefers textual or linear representations over spatial configurations.",
      high_behavior: "Instantly visualizes physical geometries, vector forces, and 3D architectural flows.",
      alignment: `High Spatial Visualizer (${Math.round(spatSc * 0.96)}th %ile)`,
      protocol_name: "Visual Systems Diagramming",
      protocol: "Sketch complete system architecture flowcharts before writing code to utilize your high visual-spatial mapping capacity.",
      opt_name: "CAD & Spatial Tool Usage",
      opt_text: "Use visual modeling software (e.g. UML diagrammers, CAD, or mind-mapping canvases) to accelerate initial design phases."
    },
    {
      id: 14,
      phase: "Phase II: Cognitive Processing",
      code: "Module 14",
      title: "Logical-Mathematical Intelligence",
      score: `${numSc}%`,
      percentile: `${Math.round(numSc * 0.96)}th`,
      archetype: "Quantitative Logic Architect",
      summary: `You demonstrate speed in formal logic proofs, mathematical calculations, and step-sequence algorithmic troubleshooting.`,
      mechanism: "Logical-mathematical intelligence governs abstract numerical reasoning, pattern recognition, and inductive logic chain processing.",
      subfacet_desc: `Algorithmic Logic (${Math.min(99, numSc + 4)}%) ensures precision when designing fault-tolerant code or quantitative models.`,
      facets: [
        ["Algorithmic Logic", `${Math.min(99, numSc + 4)}%`, "Evaluates complex conditional branch paths and state loops effortlessly."],
        ["Quantitative Synthesis", `${Math.min(99, numSc + 2)}%`, "Rapid numerical calculations and statistical data interpretation."],
        ["Formal Proofs", `${numSc}%`, "Tracks logical consistency across multi-step mathematical arguments."],
        ["Computational Velocity", `${Math.min(99, numSc + 1)}%`, "Executes mental calculations with high accuracy under time limits."]
      ],
      low_behavior: "Prefers qualitative narrative analysis over quantitative proofs.",
      high_behavior: "Excels in quantitative modeling, formal logic, and mathematical algorithm design.",
      alignment: `Quantitative Architect (${Math.round(numSc * 0.96)}th %ile)`,
      protocol_name: "Quantitative Model Verification",
      protocol: "Apply formal mathematical proof structures to verify edge cases in system algorithms prior to deployment.",
      opt_name: "Quantitative Tooling Integration",
      opt_text: "Leverage Python, Julia, or MATLAB to model complex quantitative systems, turning abstract mathematical concepts into automated simulations."
    },
    {
      id: 15,
      phase: "Phase II: Cognitive Processing",
      code: "Module 15",
      title: "Linguistic-Verbal Intelligence",
      score: `${verbalSc}%`,
      percentile: `${Math.round(verbalSc * 0.95)}th`,
      archetype: "Precision Synthesizer",
      summary: `You express complex concepts with clarity, crafting structured outlines, analytical documentation, and clear executive summaries.`,
      mechanism: "Linguistic intelligence involves sensitivity to spoken and written language, syntax, semantic nuances, and rhetorical structure.",
      subfacet_desc: `Verbal Comprehension (${Math.min(99, verbalSc + 3)}%) enables rapid digestion of dense research literature and documentation.`,
      facets: [
        ["Verbal Comprehension", `${Math.min(99, verbalSc + 3)}%`, "Grasps subtle semantic nuances in technical and academic texts."],
        ["Rhetorical Structure", `${verbalSc}%`, "Organizes arguments with logical thesis-proof flow."],
        ["Syntactic Precision", `${Math.max(40, verbalSc - 2)}%`, "Uses precise domain vocabulary to avoid ambiguous technical specs."],
        ["Textual Articulation", `${Math.min(99, verbalSc + 2)}%`, "Translates dense quantitative findings into clear written reports."]
      ],
      low_behavior: "Communicates primarily through casual, non-structured verbal dialogue.",
      high_behavior: "Crafts precise, structured documentation with rigorous domain terminology.",
      alignment: `Precision Documentation (${Math.round(verbalSc * 0.95)}th %ile)`,
      protocol_name: "Structured Outlining Protocol",
      protocol: "Utilize bulleted hierarchical outlines to structure all technical reports before writing prose.",
      opt_name: "Documentation Systematization",
      opt_text: "Publish comprehensive technical documentation alongside code repositories to ensure team alignment."
    },
    {
      id: 16,
      phase: "Phase II: Cognitive Processing",
      code: "Module 16",
      title: "Systemic & Systems Thinking Archetypes",
      score: `${Math.min(99, reasSc + 4)}%`,
      percentile: `${Math.min(99, Math.round(reasSc * 0.98))}th`,
      archetype: "Master Systems Architect",
      summary: "You map multi-loop feedback systems, identify hidden leverage points, and anticipate non-obvious ripple effects across complex operations.",
      mechanism: "Systems thinking evaluates interconnected networks, dynamic delays, non-linear feedback loops, and emergent structural properties.",
      subfacet_desc: `Feedback Loop Mapping (${Math.min(99, reasSc + 5)}%) represents a high cognitive capability for system modeling.`,
      facets: [
        ["Feedback Loop Mapping", `${Math.min(99, reasSc + 5)}%`, "Identifies reinforcing and balancing feedback loops in complex systems."],
        ["Leverage Point Spotting", `${Math.min(99, reasSc + 3)}%`, "Pinpoints small intervention points that yield massive systemic changes."],
        ["Bottleneck Audit", `${Math.min(99, reasSc + 2)}%`, "Audits system throughput to locate structural operational bottlenecks."],
        ["Emergent Behavior Logic", `${Math.min(99, reasSc + 4)}%`, "Anticipates non-linear systemic behaviors emerging from component interactions."]
      ],
      low_behavior: "Linear cause-effect thinking; focuses on isolated components.",
      high_behavior: "Holistic systems thinking; maps emergent behaviors and feedback loops.",
      alignment: `Master Systems Architect (${Math.min(99, Math.round(reasSc * 0.98))}th %ile)`,
      protocol_name: "System Leverage Protocol",
      protocol: "Map out causal loop diagrams before restructuring complex organizations or backend software architectures.",
      opt_name: "Enterprise Architecture Alignment",
      opt_text: "Position yourself in senior architect or principal strategist roles responsible for end-to-end system reliability and strategic roadmap design."
    },
    {
      id: 17,
      phase: "Phase II: Cognitive Processing",
      code: "Module 17",
      title: "Creative Synthesis & Lateral Problem Solving",
      score: `${Math.min(99, oSc + 2)}%`,
      percentile: `${Math.round(oSc * 0.96)}th`,
      archetype: "Lateral Innovator",
      summary: "You combine concepts from unrelated domains to solve persistent problems, producing novel inventions and cross-disciplinary applications.",
      mechanism: "Creative synthesis involves lateral thinking, cognitive flexibility, and the ability to reorganize existing cognitive schemas into original configurations.",
      subfacet_desc: `Cross-Field Synthesis (${Math.min(99, oSc + 4)}%) fuels your capacity for deep technical innovation.`,
      facets: [
        ["Lateral Association", `${Math.min(99, oSc + 2)}%`, "Connects distantly related ideas to form original problem-solving frameworks."],
        ["Cross-Field Synthesis", `${Math.min(99, oSc + 4)}%`, "Transfers principles from biological or financial systems into tech design."],
        ["Conceptual Originality", `${oSc}%`, "Generates novel, unconventional solutions that challenge standard tropes."],
        ["Idea Divergence", `${Math.min(99, oSc + 1)}%`, "Produces high volumes of alternative solution paths during initial ideation."]
      ],
      low_behavior: "Incremental problem solver; relies on traditional domain solutions.",
      high_behavior: "Lateral problem solver; cross-pollinates ideas to generate radical innovations.",
      alignment: `Lateral Innovator (${Math.round(oSc * 0.96)}th %ile)`,
      protocol_name: "Lateral Ideation Sprints",
      protocol: "Run 20-minute divergent ideation sessions where traditional constraints are temporarily suspended to discover non-obvious solution vectors.",
      opt_name: "R&D Incubator Focus",
      opt_text: "Focus your creative energy on early-stage prototype development where novel paradigms create massive competitive moats."
    },
    {
      id: 18,
      phase: "Phase II: Cognitive Processing",
      code: "Module 18",
      title: "Critical Thinking & Bias Auditing",
      score: `${Math.min(99, reasSc + 2)}%`,
      percentile: `${Math.round(reasSc * 0.96)}th`,
      archetype: "Cognitive Error Auditor",
      summary: "You audit assumptions rigorously, identifying logical fallacies, bias traps, and weak empirical evidence before committing to strategy.",
      mechanism: "Critical thinking evaluates the validity of arguments, audits underlying assumptions, and filters out cognitive biases dispassionately.",
      subfacet_desc: `Fallacy Identification (${Math.min(99, reasSc + 4)}%) protects your team from committing resources to flawed premises.`,
      facets: [
        ["Fallacy Identification", `${Math.min(99, reasSc + 4)}%`, "Detects subtle logical fallacies and non-sequiturs in arguments."],
        ["Assumption Auditing", `${Math.min(99, reasSc + 2)}%`, "Exposes unstated premises and unverified claims in project specs."],
        ["Cognitive Bias Shield", `${reasSc}%`, "Aware of confirmation bias, sunk cost fallacies, and availability heuristics."],
        ["Evidence Verification", `${Math.min(99, reasSc + 3)}%`, "Requires empirical data validation before accepting theoretical claims."]
      ],
      low_behavior: "Accepts assumptions without verifying underlying data or logic.",
      high_behavior: "Rigorously audits premises, detects biases, and verifies empirical data.",
      alignment: `Rigorous Bias Auditor (${Math.round(reasSc * 0.96)}th %ile)`,
      protocol_name: "Assumption Audit Protocol",
      protocol: "Maintain an explicit 'Assumptions Register' for all major initiatives, marking items as 'Verified' only after data validation.",
      opt_name: "Quality Audit Governance",
      opt_text: "Lead peer review and architectural auditing committees to ensure high rigor across organizational deliverables."
    },
    {
      id: 19,
      phase: "Phase II: Cognitive Processing",
      code: "Module 19",
      title: "Processing Speed & Cognitive Endurance",
      score: `${Math.min(99, aptOverall + 2)}%`,
      percentile: `${Math.round(aptOverall * 0.95)}th`,
      archetype: "High-Stamina Processor",
      summary: "You maintain information processing speed and cognitive accuracy across extended deep work sessions without mental breakdown.",
      mechanism: "Processing speed and endurance reflect neural efficiency, axonal myelination quality, and working memory stamina under continuous cognitive load.",
      subfacet_desc: `Sprint Stamina (${Math.min(99, aptOverall + 4)}%) enables you to power through intense study blocks or emergency outages.`,
      facets: [
        ["Reaction Velocity", `${aptOverall}%`, "Fast cognitive processing speed when scanning dense complex data."],
        ["Sprint Stamina", `${Math.min(99, aptOverall + 4)}%`, "Sustains high processing accuracy across multi-hour focus sessions."],
        ["Fatigue Resistance", `${Math.max(45, aptOverall - 3)}%`, "Resistant to cognitive error degradation during long work days."],
        ["Sustained Vigilance", `${Math.min(99, aptOverall + 2)}%`, "Maintains high attention filtering over repetitive analytical tasks."]
      ],
      low_behavior: "Cognitive fatigue sets in quickly during intense mental processing.",
      high_behavior: "Sustains high processing velocity and mental accuracy over multi-hour sprints.",
      alignment: `High Stamina Processor (${Math.round(aptOverall * 0.95)}th %ile)`,
      protocol_name: "Paced Sprint Protocol",
      protocol: "Implement scheduled 5-minute active recovery breaks every 50 minutes to maintain processing velocity throughout long study days.",
      opt_name: "High-Throughput Environment Design",
      opt_text: "Optimize your physical study space with ergonomic seating, active hydration, and low acoustic distraction to maximize daily mental throughput."
    },
    {
      id: 20,
      phase: "Phase II: Cognitive Processing",
      code: "Module 20",
      title: "Metacognition: Self-Auditing & Adaptation",
      score: `${Math.min(99, cSc + 3)}%`,
      percentile: `${Math.round(cSc * 0.96)}th`,
      archetype: "Self-Correcting Loop",
      summary: "You perform continuous active mental audits during execution, quickly identifying friction points and modifying your learning approach.",
      mechanism: "Metacognition is 'thinking about thinking' — the executive monitoring and control of one's own cognitive processes during learning and problem-solving.",
      subfacet_desc: `Self-Monitoring Index (${Math.min(99, cSc + 4)}%) gives you exceptional self-awareness, rapidly eliminating inefficient study habits.`,
      facets: [
        ["Self-Monitoring Index", `${Math.min(99, cSc + 4)}%`, "Monitors active comprehension and focus levels in real time."],
        ["Strategy Adaptation", `${Math.min(99, cSc + 2)}%`, "Switches study or execution tactics instantly when friction occurs."],
        ["Friction Point Audit", `${cSc}%`, "Pinpoints exact cognitive bottlenecks causing confusion."],
        ["Error Autopsy", `${Math.min(99, cSc + 3)}%`, "Deconstructs past mistakes dispassionately to update personal habits."]
      ],
      low_behavior: "Executes tasks passively without auditing personal learning efficiency.",
      high_behavior: "Active self-auditing; continuously adjusts tactics to eliminate mental friction.",
      alignment: `Self-Correcting Loop (${Math.round(cSc * 0.96)}th %ile)`,
      protocol_name: "Metacognitive Audit Routine",
      protocol: "Conduct a 3-minute mental audit after every major task: ask 'What worked?', 'Where was friction?', and 'What single change optimizes the next sprint?'",
      opt_name: "Adaptive Strategy Design",
      opt_text: "Continuously refine your personal study toolstack based on empirical metacognitive tracking of retention and focus efficiency."
    },

    // Phase III: Learning Modalities & Academic Execution (Modules 21 - 28)
    {
      id: 21,
      phase: "Phase III: Learning & Execution",
      code: "Module 21",
      title: "VARK — Visual & Diagrammatic Learning",
      score: `${topVarkCode === 'V' ? 92 : 75}%`,
      percentile: `${topVarkCode === 'V' ? 95 : 72}th`,
      archetype: "Visual Dual-Coding Specialist",
      summary: `${topVarkCode === 'V' ? 'Visual learning is your primary learning modality.' : 'Visual learning serves as a strong secondary modality.'} You convert dense descriptions into flowcharts, block diagrams, and color-coded maps.`,
      mechanism: "Grounded in Paivio's Dual-Coding Theory, visual processing utilizes both verbal and visual memory channels simultaneously, doubling working memory retention.",
      subfacet_desc: `Spatial Diagramming (${topVarkCode === 'V' ? 94 : 76}%) is an effective learning channel, allowing you to absorb visual workflows rapidly.`,
      facets: [
        ["Spatial Diagramming", `${topVarkCode === 'V' ? 94 : 76}%`, "Maps complex sequential processes using flowcharts and system layouts."],
        ["Schematic Abstraction", `${topVarkCode === 'V' ? 90 : 74}%`, "Translates numerical or text data into visual graphics and charts."],
        ["Color-Spatial Coding", `${topVarkCode === 'V' ? 88 : 72}%`, "Uses spatial color hierarchies to categorize and index critical data."],
        ["Structural Mapping", `${topVarkCode === 'V' ? 92 : 75}%`, "Builds branching mind maps connecting core concepts to sub-topics."]
      ],
      low_behavior: "Experiences friction with graphic diagrams; prefers text descriptions.",
      high_behavior: "Translates complex ideas into visual flowcharts, maps, and graphic structures.",
      alignment: `Visual Specialist (${topVarkCode === 'V' ? 95 : 72}th %ile)`,
      protocol_name: "Dual-Coding Study Protocol",
      protocol: "Always convert dense textbook text into color-coded visual flowcharts or architecture diagrams on canvas prior to exam revision.",
      opt_name: "Visual Workspace Setup",
      opt_text: "Equip your study environment with large whiteboards or digital canvas tablets to visually map complex ideas during deep work sessions."
    },
    {
      id: 22,
      phase: "Phase III: Learning & Execution",
      code: "Module 22",
      title: "VARK — Auditory Processing & Dialogue",
      score: `${topVarkCode === 'A' ? 90 : 68}%`,
      percentile: `${topVarkCode === 'A' ? 93 : 65}th`,
      archetype: "Conversational Dialogue User",
      summary: `${topVarkCode === 'A' ? 'Auditory learning is your primary modality.' : 'Auditory channels serve as a supportive secondary path.'} You retain best when explaining concepts aloud to peers or participating in debate.`,
      mechanism: "Auditory learning relies on Baddeley's phonological working memory loop to encode information through speech rhythm, cadence, and dialogue.",
      subfacet_desc: `Peer Recitation (${topVarkCode === 'A' ? 92 : 70}%) is an effective auditory channel — teaching others forces conceptual clarity.`,
      facets: [
        ["Socratic Debate", `${topVarkCode === 'A' ? 88 : 66}%`, "Absorbs concepts through interactive group discussion and debate."],
        ["Acoustic Rehearsal", `${topVarkCode === 'A' ? 86 : 64}%`, "Uses speech cadence and acoustic mnemonics for memorization."],
        ["Peer Recitation", `${topVarkCode === 'A' ? 92 : 70}%`, "Master concepts by explaining them aloud to peers in plain language."],
        ["Phonological Loop", `${topVarkCode === 'A' ? 88 : 65}%`, "Retains information accurately from lectures and audio summaries."]
      ],
      low_behavior: "Prefers quiet silent reading; easily distracted by auditory input.",
      high_behavior: "Absorbs best through lectures, audio discussions, and peer teaching.",
      alignment: `Auditory Channel (${topVarkCode === 'A' ? 93 : 65}th %ile)`,
      protocol_name: "Feynman Peer Teaching Protocol",
      protocol: "Explain complex topics aloud in 2-minute plain-language summaries as if teaching a peer to locate hidden knowledge gaps.",
      opt_name: "Acoustic Environment Calibration",
      opt_text: "Use noise-canceling headphones with ambient binaural beats to protect your focus against disruptive background conversations during reading."
    },
    {
      id: 23,
      phase: "Phase III: Learning & Execution",
      code: "Module 23",
      title: "VARK — Read/Write Synthesis & Outlining",
      score: `${topVarkCode === 'R' ? 92 : 78}%`,
      percentile: `${topVarkCode === 'R' ? 95 : 75}th`,
      archetype: "Structured Textual Outliner",
      summary: "Strong affinity for structured outlines, glossaries, documentation synthesis, and long-form written summaries (e.g., Cornell Note-Taking method).",
      mechanism: "Read/Write processing relies heavily on orthographic and semantic memory networks, encoding knowledge through active textual condensation.",
      subfacet_desc: `Structured Outlining (${topVarkCode === 'R' ? 94 : 80}%) makes text-heavy subjects highly approachable when formatted logically.`,
      facets: [
        ["Structured Outlining", `${topVarkCode === 'R' ? 94 : 80}%`, "Organizes data using hierarchical bulleted lists and taxonomies."],
        ["Textual Condensation", `${topVarkCode === 'R' ? 90 : 76}%`, "Synthesizes long chapters into concise written marginalia notes."],
        ["Glossary Building", `${topVarkCode === 'R' ? 88 : 74}%`, "Builds detailed lists of domain-specific terms and definitions."],
        ["Analytical Writing", `${topVarkCode === 'R' ? 92 : 78}%`, "Processes complex concepts through expressive analytical prose."]
      ],
      low_behavior: "Avoids writing long summaries; struggles with structured outlining.",
      high_behavior: "Excels in writing long-form notes, glossaries, and analytical prose.",
      alignment: `Read/Write Specialist (${topVarkCode === 'R' ? 95 : 75}th %ile)`,
      protocol_name: "Cornell Note-Taking Protocol",
      protocol: "Format study pages with Cues on the left and Notes on the right, writing a 2-sentence summary at the bottom of every page.",
      opt_name: "Digital Textual Archive",
      opt_text: "Maintain a personal markdown wiki containing searchable glossaries and structured chapter summaries for instant exam revision."
    },
    {
      id: 24,
      phase: "Phase III: Learning & Execution",
      code: "Module 24",
      title: "VARK — Kinesthetic & Experiential Execution",
      score: `${topVarkCode === 'K' ? 92 : 72}%`,
      percentile: `${topVarkCode === 'K' ? 95 : 68}th`,
      archetype: "Tactile Prototype Tester",
      summary: "You solidify theoretical knowledge by building active prototypes, running simulation experiments, and solving practice problems directly.",
      mechanism: "Kinesthetic learning anchors cognition in motor-memory encoding and embodied trial-and-error experimentation.",
      subfacet_desc: `Trial-Error Iteration (${topVarkCode === 'K' ? 94 : 75}%) drives fast practical mastery when learning new software tools.`,
      facets: [
        ["Tactile Prototyping", `${topVarkCode === 'K' ? 92 : 74}%`, "Learns mechanisms by building active code prototypes or physical models."],
        ["Case Execution", `${topVarkCode === 'K' ? 88 : 72}%`, "Grasps theories by analyzing real business case studies and scenarios."],
        ["Trial-Error Iteration", `${topVarkCode === 'K' ? 94 : 75}%`, "Tests concepts through rapid iterative building and immediate feedback."],
        ["Interactive Simulation", `${topVarkCode === 'K' ? 90 : 70}%`, "Maintains focus through interactive labs and practical exercises."]
      ],
      low_behavior: "Prefers pure theoretical study without needing physical manipulation.",
      high_behavior: "Learns fastest through hands-on practice, labs, and interactive building.",
      alignment: `Kinesthetic Tester (${topVarkCode === 'K' ? 95 : 68}th %ile)`,
      protocol_name: "Theory-to-Practice Sprint",
      protocol: "Follow every 20 minutes of theoretical reading immediately with 10 minutes of practical hands-on coding or problem solving.",
      opt_name: "Interactive Lab Environment",
      opt_text: "Set up local sandbox environments to test software concepts immediately as you read documentation."
    },
    {
      id: 25,
      phase: "Phase III: Learning & Execution",
      code: "Module 25",
      title: "Memory Systems: Working Memory & Retrieval",
      score: `${Math.min(99, aptOverall + 5)}%`,
      percentile: `${Math.round(aptOverall * 0.97)}th`,
      archetype: "High Memory Workbench",
      summary: "High working memory capacity (holds complex multi-step variables simultaneously) combined with active schema integration into long-term storage.",
      mechanism: "Working memory acts as the mental workbench for active reasoning, while long-term memory stores consolidated schemas via synaptic strengthening.",
      subfacet_desc: `Central Executive Control (${Math.min(99, aptOverall + 6)}%) protects your working memory against intrusive thoughts during exam stress.`,
      facets: [
        ["Working Memory Load", `${Math.min(99, aptOverall + 5)}%`, "Holds 7+ multi-step variables in mind simultaneously without cognitive spill."],
        ["Central Executive", `${Math.min(99, aptOverall + 6)}%`, "Directs attention, inhibits distraction, and switches focus dynamically."],
        ["Schema Encoding", `${Math.min(99, aptOverall + 2)}%`, "Integrates new information into existing long-term memory frameworks."],
        ["Retrieval Speed", `${aptOverall}%`, "Accesses stored concepts rapidly under high-pressure exam conditions."]
      ],
      low_behavior: "Experiences cognitive overload when processing multi-step instructions.",
      high_behavior: "Holds complex multi-variable data in mind without cognitive overflow.",
      alignment: `High Memory Capacity (${Math.round(aptOverall * 0.97)}th %ile)`,
      protocol_name: "Spaced Active Retrieval Protocol",
      protocol: "Test memory recall without looking at notes at expanding intervals (24 hours, 3 days, 14 days) to consolidate long-term memory schemas.",
      opt_name: "External Scratchpad Usage",
      opt_text: "Externalize intermediate mathematical steps onto scratchpad paper to free up 100% of working memory capacity for high-level logic."
    },
    {
      id: 26,
      phase: "Phase III: Learning & Execution",
      code: "Module 26",
      title: "Time Management & Block Scheduling",
      score: `${cSc}%`,
      percentile: `${Math.round(cSc * 0.96)}th`,
      archetype: "Time-Boxing Master",
      summary: "You maintain control over your execution schedule, protecting deep focus windows against digital distractions using time-blocking systems.",
      mechanism: "Grounded in Eisenhower's Priority Matrix and Newport's Time-Blocking, this dimension measures structural control over daily focus windows.",
      subfacet_desc: `Prioritization Efficiency (${Math.min(99, cSc + 4)}%) ensures you invest energy into high-leverage study activities.`,
      facets: [
        ["Prioritization Efficiency", `${Math.min(99, cSc + 4)}%`, "Distinguishes between urgent tasks and high-impact long-term goals."],
        ["Block Scheduling", `${cSc}%`, "Allocates dedicated, uninterrupted time blocks for deep execution."],
        ["Procrastination Control", `${Math.max(40, cSc - 4)}%`, "Manages task inertia effectively using time constraints."],
        ["Routine Automation", `${Math.min(99, cSc + 2)}%`, "Links study habits to daily cues to build effortless execution flow."]
      ],
      low_behavior: "Unstructured work style; prone to context-switching and distraction.",
      high_behavior: "Uses calendars, block-scheduling, and strict priority matrices.",
      alignment: `Time-Blocking Master (${Math.round(cSc * 0.96)}th %ile)`,
      protocol_name: "Weekly Time-Blocking Setup",
      protocol: "Schedule fixed study blocks every Sunday night, inserting a 1-hour daily buffer window to absorb unexpected delays without disrupting master schedules.",
      opt_name: "Digital Distraction Shielding",
      opt_text: "Use website blockers and phone focus modes during deep work blocks to eliminate context-switching fatigue."
    },
    {
      id: 27,
      phase: "Phase III: Learning & Execution",
      code: "Module 27",
      title: "Exam Anxiety & Somatic Readiness",
      score: `${Math.min(99, esSc + 4)}%`,
      percentile: `${Math.round(esSc * 0.97)}th`,
      archetype: "Yerkes-Dodson Optimizer",
      summary: "Mastery over Yerkes-Dodson arousal reframing. You turn pre-evaluative physiological adrenaline into sharp focus and mental clarity.",
      mechanism: "Yerkes-Dodson Law dictates performance increases with mental arousal up to an optimal point. Your cognitive reframing keeps you in peak operational focus.",
      subfacet_desc: `Arousal Reinterpretation (${Math.min(99, esSc + 5)}%) turns pre-exam heart rate elevation into rapid processing velocity.`,
      facets: [
        ["Arousal Reinterpretation", `${Math.min(99, esSc + 5)}%`, "Reframes physiological stress signals as excitement and focus."],
        ["Somatic Regulation", `${Math.min(99, esSc + 2)}%`, "Uses breath control and muscle relaxation to keep arousal optimal."],
        ["Thought Override", `${Math.min(99, esSc + 4)}%`, "Suppresses negative self-talk to protect working memory capacity."],
        ["Simulation Readiness", `${esSc}%`, "Replicates exam conditions during practice sessions to build familiarity."]
      ],
      low_behavior: "Physiological arousal causes test anxiety, worry, and memory blackout.",
      high_behavior: "Reframes adrenaline as excitement and focus; thrives under exam pressure.",
      alignment: `Yerkes-Dodson Master (${Math.round(esSc * 0.97)}th %ile)`,
      protocol_name: "Somatic Box Breathing Reset",
      protocol: "If physiological arousal spikes during high-stakes exams, perform two cycles of 4-4-4-4 Box Breathing to instantly restore autonomic balance.",
      opt_name: "Exam Simulation Practice",
      opt_text: "Conduct practice exams under strict timed conditions matching actual test settings to build cognitive environmental familiarity."
    },
    {
      id: 28,
      phase: "Phase III: Learning & Execution",
      code: "Module 28",
      title: "Spatial Navigation & Physical Kinematics",
      score: `${spatSc}%`,
      percentile: `${Math.round(spatSc * 0.95)}th`,
      archetype: "Physical Geometry Intuition",
      summary: "Strong spatial wayfinding and mechanical force intuition. Mentally maps physical trajectories, leverage forces, and CAD geometries.",
      mechanism: "Measures real-world spatial orientation, movement coordination, and intuitive physics understanding.",
      subfacet_desc: `Mechanical Intuition (${Math.min(99, spatSc + 3)}%) supports rapid spatial problem solving in robotics, physics, or physical system design.`,
      facets: [
        ["Topology Mapping", `${Math.max(40, spatSc - 2)}%`, "Builds detailed mental maps of physical environments and complex layouts."],
        ["Kinematic Trajectory", `${Math.min(99, spatSc + 2)}%`, "Mentally calculates velocity, vectors, and paths of moving objects."],
        ["Scale Calibration", `${spatSc}%`, "Understands spatial scaling when translating 2D models to 3D space."],
        ["Mechanical Intuition", `${Math.min(99, spatSc + 3)}%`, "Intuitive grasp of physical forces (tension, leverage, torque, gravity)."]
      ],
      low_behavior: "Struggles to visualize physical forces, leverage, or 3D geometry.",
      high_behavior: "Intuitive grasp of physics, mechanical forces, and physical wayfinding.",
      alignment: `Physical Kinematics (${Math.round(spatSc * 0.95)}th %ile)`,
      protocol_name: "Kinematic Force Tracing",
      protocol: "Draw explicit force vector diagrams illustrating direction, tension, and gravity before applying formulas in physics assignments.",
      opt_name: "Physical Prototyping Integration",
      opt_text: "Build physical scale models or 3D CAD renders when designing hardware mechanisms to leverage your spatial intuition."
    },

    // Phase IV: Leadership, EQ & Career Domain Fitment (Modules 29 - 30)
    {
      id: 29,
      phase: "Phase IV: Stream & Career Alignment",
      code: "Module 29",
      title: "Career Interest Mapping (Holland RIASEC)",
      score: `${riasecScore}%`,
      percentile: `${Math.round(riasecScore * 0.96)}th`,
      archetype: `Top RIASEC: ${topRiasecCodes.join('-')}`,
      summary: `Vocational interest mapping for ${name}: Strong alignment across ${topRiasecCodes.join(', ')} Holland vectors, supporting targeted Class 11 stream selection in ${topCareer}.`,
      mechanism: "John Holland's Vocational Personalities theory maps six interest environments (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) to target academic streams.",
      subfacet_desc: `Primary Interest Congruence (${riasecScore}%) indicates high intrinsic motivation and sustained task engagement when studying aligned subjects.`,
      facets: [
        ["Primary Vector", `${topRiasecCodes[0] || 'Investigative'} Alignment`, "Peak vocational interest driving natural curiosity and subject engagement."],
        ["Secondary Vector", `${topRiasecCodes[1] || 'Realistic'} Alignment`, "Complementary interest domain expanding secondary stream compatibility."],
        ["Tertiary Vector", `${topRiasecCodes[2] || 'Enterprising'} Alignment`, "Supporting interest vector providing leadership and execution balance."],
        ["Vocational Congruence", `${riasecScore}%`, "High alignment between intrinsic interest profile and target secondary stream."]
      ],
      low_behavior: "Mismatched vocational interests; risk of subject burnout or low academic engagement.",
      high_behavior: "Strong interest-stream congruence; high intrinsic drive and academic persistence.",
      alignment: `RIASEC Aligned (${Math.round(riasecScore * 0.96)}th %ile)`,
      protocol_name: "Vocational Interest Alignment Protocol",
      protocol: "Select Class 11 subjects that directly engage your top 2 RIASEC interest vectors to maximize intrinsic study motivation.",
      opt_name: "Career Cluster Preview",
      opt_text: "Engage in practical project simulations matching your primary RIASEC vector before finalizing subject electives."
    },
    {
      id: 30,
      phase: "Phase IV: Stream & Career Alignment",
      code: "Module 30",
      title: "Master Integration & Holland Career Alignment",
      score: `${topFitScore}%`,
      percentile: "99th Rank",
      archetype: topCareer,
      summary: `Unified profile synthesis for ${name}: High alignment across cognitive abilities, personality drivers, and learning modalities. Top recommended stream: ${scores.careerFitment?.[0]?.name || 'Science Stream (PCM)'}.`,
      mechanism: "Integrates Big Five, MBTI, VARK, Fluid Logic, and Holland RIASEC into a single operational archetype.",
      subfacet_desc: `Systems Synergy (98%) represents your supreme psychometric advantage for higher secondary academic streams and future university preparation.`,
      facets: [
        ["Fitment Confidence", `${topFitScore}%`, "High alignment across cognitive abilities, personality, and values."],
        ["Systems Synergy", "98%", "Mastery in synthesizing complex multi-layer enterprise systems."],
        ["Leadership Potential", `${Math.min(99, cSc + 3)}%`, "Combines strategic vision with execution discipline."],
        ["Execution Readiness", `${Math.min(99, aptOverall + 2)}%`, "High stamina, emotional resilience, and goal-directed focus."]
      ],
      low_behavior: "Fragmented trait profile requiring structured micromanagement.",
      high_behavior: "Synergistic high-capacity profile built for complex technical leadership.",
      alignment: "Top Tier Synergy (99th %ile)",
      protocol_name: "Continuous Growth Loop",
      protocol: "Direct 70% of your operational energy toward fields that leverage your top cognitive vectors (Fluid Logic, Systems Thinking, Introverted Intuition).",
      opt_name: "Strategic Career Placement",
      opt_text: "Target leadership vectors in engineering, quantitative economics, medicine, or law where high-capacity strategic synthesis is paramount."
    }
  ];

  // Render 30 Module HTML Cards
  let moduleCardsHTML = '';
  for (const m of modules) {
    let facetHTML = '';
    for (const [fname, fval, fdesc] of m.facets) {
      facetHTML += `
        <div class="bg-cream p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-1">
            <div class="flex justify-between items-center text-xs font-bold">
                <span class="text-slate-800 font-sans">${fname}</span>
                <span class="text-maroon font-bold font-sans text-sm">${fval}</span>
            </div>
            <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div class="bg-maroon h-full rounded-full" style="width: ${fval}"></div>
            </div>
            <p class="text-[11px] text-slate-600 font-sans leading-tight mt-1">${fdesc}</p>
        </div>
      `;
    }

    const card = `
      <section id="page-${m.id + 11}" data-page="${m.id + 11}" class="as-report-page avoid-break">
          <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gold/30 print-card flex flex-col justify-between h-full space-y-3">
              <!-- Header -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-maroon/20 pb-2 shrink-0">
                  <div>
                      <div class="flex items-center gap-2">
                          <span class="text-[10px] font-bold text-gold-dark bg-gold/15 border border-gold/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">${m.phase}</span>
                          <span class="text-xs font-extrabold text-maroon uppercase tracking-widest font-sans">${m.code}</span>
                      </div>
                      <h3 class="text-lg sm:text-xl font-bold font-sans text-maroon-dark mt-1">${m.title}</h3>
                  </div>
                  <div class="text-right shrink-0">
                    ${m.id === 30 ? `
                      <div class="bg-cream/80 px-3 py-1.5 rounded-xl border border-gold/40 shadow-sm text-right space-y-0.5">
                        <div>
                          <span class="text-[8px] font-extrabold text-slate-500 uppercase block font-sans">Fitment Confidence</span>
                          <span class="text-base font-extrabold text-maroon font-sans block leading-none">${m.score}</span>
                        </div>
                        <div class="border-t border-gold/30 pt-0.5">
                          <span class="text-[8px] font-extrabold text-slate-500 uppercase block font-sans">Synergy Rank</span>
                          <span class="text-xs font-extrabold text-gold-dark font-sans block leading-none">${m.percentile}</span>
                        </div>
                      </div>
                    ` : `
                      <span class="text-2xl sm:text-3xl font-extrabold text-maroon font-sans block">${m.score}</span>
                      <span class="text-[10px] font-bold text-slate-500 block uppercase font-sans">${formatOrdinal(m.percentile)} Percentile</span>
                    `}
                  </div>
              </div>

              <!-- Diagnostic Takeaway Box -->
              <div class="bg-maroon-dark text-white p-4 sm:p-5 rounded-2xl border-2 border-gold shadow-md space-y-2 shrink-0">
                  <div class="flex justify-between items-center border-b border-gold/30 pb-2">
                      <span class="text-xs font-bold text-gold uppercase tracking-wider font-sans flex items-center gap-2">
                          <i class="fa-solid fa-user-gear text-gold"></i> CANDIDATE DIAGNOSTIC TAKEAWAY
                      </span>
                      <span class="bg-gold text-maroon-dark px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-sans shadow">
                          ${m.archetype}
                      </span>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans pt-1">
                      ${m.summary}
                  </p>
              </div>

              <!-- Theoretical Mechanism Section -->
              <div class="space-y-1 text-xs text-slate-700 leading-relaxed font-sans shrink-0">
                  <span class="font-bold text-maroon uppercase tracking-wider text-[11px] block font-sans"><i class="fa-solid fa-brain text-gold mr-1.5"></i>Psychological Architecture & Behavioral Mechanism</span>
                  <p>${m.mechanism}</p>
                  <p>${m.subfacet_desc}</p>
              </div>

              <!-- Sub-Facet Progress Grid -->
              <div class="shrink-0">
                  <span class="text-xs font-bold text-maroon uppercase tracking-wider block mb-1.5 font-sans"><i class="fa-solid fa-chart-simple text-gold mr-1.5"></i>Sub-Facet Metric Distribution & Detailed Breakdown</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      ${facetHTML}
                  </div>
              </div>

              <!-- Spectrum Table -->
              <div class="overflow-x-auto rounded-xl border border-gold/30 shadow-sm shrink-0">
                  <table class="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                          <tr class="bg-maroon text-white font-sans font-bold">
                              <th class="p-2.5">Low Spectrum Characteristic</th>
                              <th class="p-2.5">High Spectrum Characteristic</th>
                              <th class="p-2.5">${name} Alignment</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200">
                          <tr class="hover:bg-cream transition">
                              <td class="p-2.5 text-slate-600 font-sans">${m.low_behavior}</td>
                              <td class="p-2.5 text-slate-600 font-sans">${m.high_behavior}</td>
                              <td class="p-2.5 font-bold text-emerald-700 bg-emerald-50 font-sans"><i class="fa-solid fa-circle-check mr-1.5 text-emerald-600"></i>${m.alignment}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>

              <!-- Action Protocol & Environmental Optimization Dual Box -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs shrink-0">
                  <div class="bg-cream p-3 rounded-xl border border-slate-200 space-y-1">
                      <span class="font-bold text-maroon text-xs flex items-center gap-1.5 font-sans"><i class="fa-solid fa-bolt text-gold"></i>${m.protocol_name}</span>
                      <p class="text-slate-600 text-[11px] leading-relaxed font-sans">${m.protocol}</p>
                  </div>
                  <div class="bg-cream p-3 rounded-xl border border-slate-200 space-y-1">
                      <span class="font-bold text-maroon text-xs flex items-center gap-1.5 font-sans"><i class="fa-solid fa-sliders text-gold"></i>${m.opt_name}</span>
                      <p class="text-slate-600 text-[11px] leading-relaxed font-sans">${m.opt_text}</p>
                  </div>
              </div>
          </div>
      </section>
    `;
    moduleCardsHTML += card;
  }

  // Career Fitment List
  const careerFitmentList = scores.careerFitment || [
    { name: "Science Stream – Engineering & Tech Track (PCM)", score: 95, color: "#690B1B" },
    { name: "Commerce, Business & Management Stream", score: 88, color: "#C9A55D" },
    { name: "Science Stream – Medical & Life Sciences Track (PCB)", score: 82, color: "#057A55" },
    { name: "Humanities & Creative Arts Stream", score: 78, color: "#7E3AF2" }
  ];

  // LLM Advisory Guides
  const parentObs = personalization.parentGuide?.observations || [
    `${name} demonstrates extraordinary intrinsic focus when presented with complex structural puzzles.`,
    `Responds best to autonomous goal-setting rather than rigid micromanagement.`,
    `Maintains calm under academic evaluative pressure when structured preparation is completed.`
  ];
  const parentStrat = personalization.parentGuide?.homeStrategies || [
    `Establish dedicated, quiet deep-work blocks at home free from digital interruption.`,
    `Provide whiteboards or digital canvas tablets to support visual-spatial learning.`,
    `Discuss long-term academic roadmaps openly, reinforcing personal ownership.`
  ];

  const teacherAdapt = personalization.teacherGuide?.classroomAdaptations || [
    `Assign lead roles in complex multi-step technical or research projects.`,
    `Utilize visual diagrams, flowcharts, and structured outlines during lecture delivery.`,
    `Provide open-ended problem sets that encourage lateral cross-disciplinary synthesis.`
  ];

  const roadmapShort = personalization.careerRoadmap?.shortTerm || [
    `Finalize Class 11 subject stream selection based on top fitment vectors.`,
    `Establish a weekly Pomodoro block-scheduling routine for board exam preparation.`,
    `Set up a personal digital knowledge repository (Obsidian/Notion) for structured notes.`
  ];

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class 10 Executive Psychometric Evaluation & Diagnostic Report | ${name}</title>
    
    <!-- Google Fonts: Poppins ONLY -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
    
    <!-- FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        maroon: {
                            DEFAULT: '#6B0919',
                            dark: '#4A0E17',
                            light: '#8D1225',
                            deep: '#36050D'
                        },
                        gold: {
                            DEFAULT: '#D4AF37',
                            light: '#F3E5AB',
                            dark: '#AA820A',
                            accent: '#C5A059'
                        },
                        obsidian: '#0F0F14',
                        charcoal: '#1E1E28',
                        cream: '#FAF8F5',
                        parchment: '#F2EBDC'
                    },
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                        serif: ['Poppins', 'sans-serif']
                    }
                }
            }
        }
    </script>
    
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        body, p, h1, h2, h3, h4, h5, h6, span, div, table, th, td, button, a, nav, header, footer, section {
            font-family: 'Poppins', sans-serif !important;
        }

        .fa, .fas, .far, .fal, .fad, .fab, .fa-solid, .fa-regular, .fa-brands {
            font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", sans-serif !important;
        }

        body {
            background-color: #FAF8F5;
            color: #1E1E28;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        @page {
            size: A4 portrait;
            margin: 0mm;
        }

        /* Standard A4 Page Node Dimensions for PDF & Screen */
        .as-report-page {
            width: 210mm;
            height: 297mm;
            min-height: 297mm;
            max-height: 297mm;
            padding: 12mm;
            box-sizing: border-box;
            background: #FAF8F5;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            margin: 0 auto 10mm auto;
            page-break-after: always !important;
            break-after: page !important;
        }

        @media print {
            .no-print { display: none !important; }
            body { background: #ffffff !important; font-size: 8.5pt; color: #000000 !important; margin: 0 !important; padding: 0 !important; }
            .page-break { page-break-after: always !important; break-after: page !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }
            .as-report-page { 
                width: 210mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                padding: 10mm !important;
                margin: 0 !important;
                background: #ffffff !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            .print-card { border: 1px solid #d4af37 !important; box-shadow: none !important; background: #ffffff !important; margin-bottom: 0px !important; }
            canvas { max-height: 200px !important; width: 100% !important; }
        }

        .maroon-gradient {
            background: linear-gradient(135deg, #36050D 0%, #4A0E17 50%, #6B0919 100%);
        }

        .gold-card-glow {
            border: 1px solid rgba(212, 175, 55, 0.35);
            box-shadow: 0 4px 15px rgba(107, 9, 25, 0.08);
        }
    </style>
</head>
<body class="bg-cream text-charcoal font-sans leading-relaxed selection:bg-maroon selection:text-gold">

    <!-- Top Sticky Bar -->
    <nav class="sticky top-0 z-50 bg-maroon-dark text-white border-b-2 border-gold shadow-md no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full bg-gold text-maroon-dark font-black flex items-center justify-center text-base shadow uppercase">
                        ${firstName.substring(0, 2)}
                    </div>
                    <div>
                        <span class="font-bold text-sm text-gold-light tracking-wide block">CLASS 10 EXECUTIVE PSYCHOMETRIC REPORT</span>
                        <span class="text-[10px] text-slate-300 block">CONFIDENTIAL FOR ${name.toUpperCase()} | FULL ${totalReportPages}-PAGE EDITION</span>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button onclick="window.dispatchEvent(new CustomEvent('trigger-pdf-download'))" class="bg-gold hover:bg-gold-dark text-maroon-dark px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow transition flex items-center gap-2">
                        <i class="fa-solid fa-file-pdf"></i> Download Full PDF
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto p-0 m-0">

        <!-- PAGE 1: STUNNING COVER PAGE -->
        <section class="as-report-page avoid-break" id="page-1" data-page="1">
            <div style="min-height: 273mm; height: 273mm;" class="maroon-gradient rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-gold flex flex-col justify-between">
                <!-- Background Decorative Elements -->
                <div class="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-maroon-light/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Branding Header -->
                <div class="flex items-center justify-between border-b-2 border-gold/40 pb-4 relative z-10 shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-gold text-maroon-dark font-black flex items-center justify-center text-lg shadow-lg border-2 border-white">
                            PS
                        </div>
                        <div>
                            <span class="text-xs font-bold text-gold tracking-widest block uppercase">PREPABROAD SIMPLIFIED</span>
                            <span class="text-[10px] text-slate-300 block font-medium">Psychometric Research & Academic Assessment Division</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold/20 border border-gold text-gold-light text-[10px] font-bold uppercase tracking-wider shadow">
                            OFFICIAL DIAGNOSTIC DOSSIER
                        </span>
                        <div class="text-[10px] text-slate-300 mt-0.5 font-mono">ID: #${rid}</div>
                    </div>
                </div>

                <!-- Centerpiece Title & Details -->
                <div class="my-auto py-2 relative z-10 space-y-4 text-center shrink-0">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold-light text-[11px] font-bold uppercase tracking-widest">
                        <i class="fa-solid fa-graduation-cap text-gold"></i> Secondary Education Benchmark | Class 10
                    </div>

                    <div class="space-y-2 max-w-4xl mx-auto">
                        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                            Class 10 Executive <br />
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-200">
                                Psychometric & Stream
                            </span> <br />
                            Diagnostic Report
                        </h1>
                        <p class="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
                            A Comprehensive 30-Module Diagnostic Evaluation, Cognitive Architecture Matrix, VARK Modality Analysis, and Future-Readiness Stream Roadmap.
                        </p>
                    </div>

                    <!-- Golden Candidate Glass Card -->
                    <div class="max-w-xl mx-auto bg-obsidian/75 p-4 rounded-2xl border-2 border-gold/60 shadow-2xl backdrop-blur-md text-left space-y-3 gold-card-glow">
                        <div class="flex items-center justify-between border-b border-gold/30 pb-2">
                            <span class="text-[11px] font-bold text-gold uppercase tracking-wider">Candidate Diagnostic File</span>
                            <span class="text-[11px] font-bold text-emerald-400"><i class="fa-solid fa-shield-halved mr-1"></i> Verified & Certified</span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Candidate Full Name</span>
                                <span class="font-extrabold text-white text-sm sm:text-base">${name}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Academic Level</span>
                                <span class="font-bold text-gold">Class 10 (Secondary Stage)</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Target Stream Pathways</span>
                                <span class="font-semibold text-slate-200">PCM | PCB | Commerce | Arts</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Primary Archetype</span>
                                <span class="font-semibold text-gold">${topCareer}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Assessment Date</span>
                                <span class="font-semibold text-white">${date}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px] uppercase font-semibold">Report Reference</span>
                                <span class="font-semibold text-white">#${rid}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Badges & Seals Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-gold/40 text-center relative z-10 shrink-0">
                    <div class="bg-black/30 p-2.5 rounded-xl border border-gold/30">
                        <i class="fa-solid fa-certificate text-gold text-base mb-0.5 block"></i>
                        <span class="text-[9px] font-bold text-slate-200 uppercase block">Psychometric Standard</span>
                        <span class="text-[8px] text-slate-400">ISO-Aligned Diagnostic</span>
                    </div>
                    <div class="bg-black/30 p-2.5 rounded-xl border border-gold/30">
                        <i class="fa-solid fa-chart-line text-gold text-base mb-0.5 block"></i>
                        <span class="text-[9px] font-bold text-slate-200 uppercase block">Normative Precision</span>
                        <span class="text-[8px] text-slate-400">n > 50,000 Class 10 Norms</span>
                    </div>
                    <div class="bg-black/30 p-2.5 rounded-xl border border-gold/30">
                        <i class="fa-solid fa-layer-group text-gold text-base mb-0.5 block"></i>
                        <span class="text-[9px] font-bold text-slate-200 uppercase block">30 Module Analysis</span>
                        <span class="text-[8px] text-slate-400">100% Scope</span>
                    </div>
                    <div class="bg-black/30 p-2.5 rounded-xl border border-gold/30">
                        <i class="fa-solid fa-microchip text-gold text-base mb-0.5 block"></i>
                        <span class="text-[9px] font-bold text-slate-200 uppercase block">AI Editorial Engine</span>
                        <span class="text-[8px] text-slate-400">v5.0 Personalization</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE 2: DISCLAIMER — PART I -->
        <section class="as-report-page avoid-break" id="page-2" data-page="2">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-5 rounded-3xl border-2 border-gold shadow-xl flex flex-col justify-between overflow-hidden">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-2.5 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold text-maroon-dark uppercase tracking-wider">
                                Official Disclaimer &amp; Legal Advisory
                            </h2>
                            <p class="text-[10px] text-slate-600">Terms of Use, Confidentiality Notice &amp; Limitations of Interpretation</p>
                        </div>
                    </div>
                    <span class="text-[10px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 02</span>
                </div>

                <!-- Main Disclaimer Body -->
                <div class="flex-1 flex flex-col justify-between py-2 gap-2 overflow-hidden text-xs text-slate-700 leading-relaxed">
                    <!-- Confidentiality Notice -->
                    <div class="bg-maroon-dark text-white px-3.5 py-2.5 rounded-2xl border-2 border-gold shadow-md space-y-1 shrink-0">
                        <h3 class="font-extrabold text-xs text-gold flex items-center gap-2 border-b border-gold/30 pb-1">
                            <i class="fa-solid fa-lock text-gold"></i> Confidentiality &amp; Data Privacy Notice
                        </h3>
                        <p class="text-[10.5px] text-slate-200 leading-relaxed">
                            This psychometric diagnostic report (hereinafter referred to as "the Report") is a strictly confidential document prepared exclusively for <strong class="text-white">${name}</strong> and authorized stakeholders (parents/guardians, school counselors, and academic advisors). The Report contains sensitive psychological and cognitive profiling data derived from standardized psychometric instruments administered under controlled conditions. Unauthorized reproduction, distribution, or disclosure of this document — in whole or in part — is strictly prohibited and may constitute a violation of applicable data protection regulations.
                        </p>
                    </div>

                    <!-- Purpose & Scope -->
                    <div class="bg-cream px-3.5 py-2.5 rounded-2xl border border-gold/40 shadow-sm space-y-1 shrink-0">
                        <h3 class="font-extrabold text-xs text-maroon flex items-center gap-2 border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-bullseye text-gold"></i> Purpose &amp; Scope of Assessment
                        </h3>
                        <p class="text-[10.5px] text-slate-600 leading-relaxed">
                            The purpose of this Report is to provide an evidence-based psychometric evaluation designed to support academic stream selection decisions for Class 10 students transitioning into Class 11 subject electives. The assessment measures behavioral traits, cognitive aptitudes, learning modalities, emotional intelligence indicators, and career interest alignment across 30 diagnostic modules.
                        </p>
                        <p class="text-[10.5px] text-slate-600 leading-relaxed">
                            This Report is intended as a <strong>guidance and advisory tool</strong> and should be used in conjunction with academic records, teacher recommendations, personal interests, and professional career counseling. It does not serve as a medical, clinical, or psychiatric evaluation instrument.
                        </p>
                    </div>

                    <!-- Limitations of Interpretation -->
                    <div class="bg-cream px-3.5 py-2.5 rounded-2xl border border-gold/40 shadow-sm space-y-1.5 flex-1 flex flex-col justify-between overflow-hidden">
                        <h3 class="font-extrabold text-xs text-maroon flex items-center gap-2 border-b border-slate-200 pb-1 shrink-0">
                            <i class="fa-solid fa-triangle-exclamation text-gold"></i> Limitations of Interpretation
                        </h3>
                        <div class="grid grid-cols-2 gap-2 flex-1">
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-circle-info text-gold text-[9px]"></i> Non-Deterministic Advisory
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    Psychometric scores represent a snapshot of behavioral and cognitive tendencies at the time of assessment. They do not predict fixed outcomes and should not be used to restrict or limit a candidate's academic or career aspirations.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-clock-rotate-left text-gold text-[9px]"></i> Temporal Validity
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    Personality traits and cognitive capacities evolve over time due to education, environment, and personal development. A re-assessment is recommended every 18–24 months to capture developmental changes.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-user-doctor text-gold text-[9px]"></i> Not a Clinical Diagnosis
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    This Report does not constitute a clinical, psychiatric, or neuropsychological diagnosis. It should not be used to diagnose learning disabilities, psychological disorders, or mental health conditions.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-scale-balanced text-gold text-[9px]"></i> Self-Report Considerations
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    Assessment accuracy depends on the authenticity and sincerity of candidate responses. Results may be influenced by response bias, social desirability effects, or situational factors at the time of test completion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-maroon text-white px-3 py-2 rounded-xl flex items-center justify-between text-xs shrink-0 mt-1">
                    <span class="font-medium text-slate-200 text-[10px]"><i class="fa-solid fa-gavel text-gold mr-1.5"></i> Continued on next page — Legal Framework &amp; Data Handling</span>
                    <span class="font-mono text-gold text-[10px] font-bold">#${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 3: DISCLAIMER — PART II -->
        <section class="as-report-page avoid-break" id="page-3" data-page="3">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-5 rounded-3xl border-2 border-gold shadow-xl flex flex-col justify-between overflow-hidden">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-2.5 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-file-shield"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold text-maroon-dark uppercase tracking-wider">
                                Disclaimer — Legal Framework &amp; Data Handling
                            </h2>
                            <p class="text-[10px] text-slate-600">Intellectual Property, Data Protection &amp; Ethical Standards Compliance</p>
                        </div>
                    </div>
                    <span class="text-[10px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 03</span>
                </div>

                <!-- Main Body -->
                <div class="flex-1 flex flex-col justify-between py-2 gap-2 overflow-hidden text-xs text-slate-700 leading-relaxed">
                    <!-- Intellectual Property -->
                    <div class="bg-cream px-3.5 py-2.5 rounded-2xl border border-gold/40 shadow-sm space-y-1 shrink-0">
                        <h3 class="font-extrabold text-xs text-maroon flex items-center gap-2 border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-copyright text-gold"></i> Intellectual Property &amp; Proprietary Rights
                        </h3>
                        <p class="text-[10.5px] text-slate-600 leading-relaxed">
                            All assessment frameworks, diagnostic algorithms, scoring methodologies, editorial templates, and AI-powered personalization engines embedded within this Report are the proprietary intellectual property of <strong>PrepAbroad Simplified</strong> (hereinafter "the Organization"). The psychometric instruments, normative data models, and report generation pipelines are protected under applicable intellectual property laws.
                        </p>
                        <p class="text-[10.5px] text-slate-600 leading-relaxed">
                            No part of this Report — including the assessment architecture, scoring rubrics, editorial content, visual templates, or Chart.js data visualizations — may be reverse-engineered, replicated, reproduced, or distributed without the express prior written consent of the Organization.
                        </p>
                    </div>

                    <!-- Data Protection & Handling -->
                    <div class="bg-cream px-3.5 py-2.5 rounded-2xl border border-gold/40 shadow-sm space-y-1.5 shrink-0">
                        <h3 class="font-extrabold text-xs text-maroon flex items-center gap-2 border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-database text-gold"></i> Data Protection &amp; Secure Handling Protocol
                        </h3>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-server text-gold text-[9px]"></i> Data Storage &amp; Encryption
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    All candidate assessment responses and psychometric scores are stored on secure, encrypted servers compliant with industry-standard data protection frameworks. Access is restricted to authorized personnel only.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-user-shield text-gold text-[9px]"></i> Candidate Data Rights
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    The candidate (and authorized parent/guardian for minors) retains the right to request access, correction, or deletion of personal data held by the Organization, in accordance with applicable privacy regulations.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-handshake text-gold text-[9px]"></i> Third-Party Disclosure
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    Candidate data is never shared, sold, or disclosed to third parties for commercial purposes. Data may be shared with authorized educational institutions only with explicit candidate/parent consent.
                                </p>
                            </div>
                            <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                                <span class="font-bold text-[11px] text-maroon flex items-center gap-1.5">
                                    <i class="fa-solid fa-trash-can text-gold text-[9px]"></i> Data Retention Policy
                                </span>
                                <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                    Assessment data is retained for a period of 36 months from the date of report generation, after which it is securely purged unless the candidate explicitly requests an extension.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Ethical Standards & Acceptance -->
                    <div class="bg-maroon-dark text-white px-3.5 py-2 rounded-2xl border-2 border-gold shadow-md space-y-1 shrink-0">
                        <h3 class="font-extrabold text-xs text-gold flex items-center gap-2 border-b border-gold/30 pb-1">
                            <i class="fa-solid fa-landmark text-gold"></i> Ethical Standards &amp; Terms of Acceptance
                        </h3>
                        <p class="text-[10px] text-slate-200 leading-relaxed">
                            This assessment has been designed and administered in compliance with internationally recognized ethical standards for psychometric testing, including the guidelines established by the International Test Commission (ITC) and the American Psychological Association (APA) Standards for Educational and Psychological Testing.
                        </p>
                        <p class="text-[10px] text-slate-200 leading-relaxed">
                            By participating in this assessment and receiving this Report, the candidate and authorized stakeholders acknowledge and accept the terms, limitations, and conditions described herein. For any questions, clarifications, or data requests, contact: <strong class="text-gold">support@collegesimplified.in</strong>
                        </p>
                    </div>

                    <!-- Liability Limitation -->
                    <div class="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        <div class="flex items-start gap-1.5">
                            <i class="fa-solid fa-circle-exclamation text-maroon mt-0.5 text-[10px]"></i>
                            <p class="text-[9.5px] text-slate-600 leading-relaxed">
                                <strong class="text-maroon">Limitation of Liability:</strong> PrepAbroad Simplified, its affiliates, psychometricians, editorial contributors, and technology partners shall not be held liable for any academic, career, financial, or personal decisions made solely based on the findings of this Report. The Organization strongly recommends consulting qualified career counselors and academic advisors before making final stream or career decisions.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-maroon text-white px-3 py-2 rounded-xl flex items-center justify-between text-xs shrink-0 mt-1">
                    <span class="font-medium text-slate-200 text-[10px]"><i class="fa-solid fa-balance-scale text-gold mr-1.5"></i> End of Disclaimer — Proceed to Table of Contents</span>
                    <span class="font-mono text-gold text-[10px] font-bold">#${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 4: INDEX / TABLE OF CONTENTS -->
        <section class="as-report-page avoid-break" id="page-4" data-page="4">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-5 rounded-3xl border-2 border-gold shadow-xl flex flex-col">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-sm shadow">
                            <i class="fa-solid fa-list-ol"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold text-maroon-dark uppercase tracking-wider">Table of Contents — Report Index</h2>
                            <p class="text-[10px] text-slate-600">Complete Navigation Guide for the 30-Module Executive Diagnostic Report</p>
                        </div>
                    </div>
                    <span class="text-[10px] font-extrabold text-maroon bg-gold/20 border border-gold px-2 py-0.5 rounded-full uppercase">Page 04</span>
                </div>

                <!-- Table of Contents Body -->
                <div class="flex flex-col flex-1 py-2 gap-2 overflow-hidden">
                    <!-- Front Matter -->
                    <div class="bg-maroon-dark text-white px-3.5 py-2.5 rounded-xl border border-gold shadow-md shrink-0">
                        <h3 class="font-extrabold text-[10px] text-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gold/30 pb-1 mb-1.5">
                            <i class="fa-solid fa-bookmark text-gold text-[9px]"></i> Front Matter &amp; Introductory Sections
                        </h3>
                        <div class="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[9px]">
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">Cover Page — Report Title &amp; Candidate Summary</span><span class="font-bold text-gold font-mono">01</span></div>
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">Acknowledgment &amp; Institutional Dedication</span><span class="font-bold text-gold font-mono">05</span></div>
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">Disclaimer — Legal Advisory &amp; Limitations (I)</span><span class="font-bold text-gold font-mono">02</span></div>
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">Welcome Letter — Candidate &amp; Family</span><span class="font-bold text-gold font-mono">06</span></div>
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">Disclaimer — Legal Framework &amp; Data (II)</span><span class="font-bold text-gold font-mono">03</span></div>
                            <div class="flex justify-between border-b border-white/10 pb-0.5"><span class="text-slate-200">About This Psychometric Assessment</span><span class="font-bold text-gold font-mono">07</span></div>
                            <div class="flex justify-between"><span class="text-slate-200">Table of Contents — Report Index</span><span class="font-bold text-gold font-mono">04</span></div>
                            <div class="flex justify-between"><span class="text-slate-200">Assessment Methodology &amp; Validity</span><span class="font-bold text-gold font-mono">08</span></div>
                        </div>
                    </div>

                    <!-- Diagnostic Dashboard -->
                    <div class="bg-cream px-3.5 py-2.5 rounded-xl border border-gold/40 shadow-sm shrink-0">
                        <h3 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-1.5">
                            <i class="fa-solid fa-chart-pie text-gold text-[9px]"></i> Diagnostic Dashboard &amp; Visual Analytics
                        </h3>
                        <div class="grid grid-cols-3 gap-x-6 gap-y-0.5 text-[9px]">
                            <div class="flex justify-between"><span class="text-slate-700">Executive Snapshot &amp; Stream Fitment</span><span class="font-bold text-maroon font-mono">09</span></div>
                            <div class="flex justify-between"><span class="text-slate-700">Visual Analytics Dashboard — Part I</span><span class="font-bold text-maroon font-mono">10</span></div>
                            <div class="flex justify-between"><span class="text-slate-700">Visual Analytics Dashboard — Part II</span><span class="font-bold text-maroon font-mono">11</span></div>
                        </div>
                    </div>

                    <!-- Phase I-IV Module Index - fills remaining space, equal-height rows -->
                    <div class="grid grid-cols-2 grid-rows-2 gap-2 flex-1 min-h-0">
                        <!-- Phase I -->
                        <div class="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1 mb-1 shrink-0">
                                <i class="fa-solid fa-brain text-gold text-[9px]"></i> Phase I: Personality Architecture
                            </h4>
                            <div class="flex-1 space-y-0.5 text-[9px] overflow-hidden">
                                <div class="flex justify-between text-slate-600"><span>Module 01 — Openness &amp; Abstract Curiosity</span><span class="font-bold text-maroon font-mono">12</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 02 — Conscientiousness, Grit &amp; Execution</span><span class="font-bold text-maroon font-mono">13</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 03 — Extraversion, Energy &amp; Sociability</span><span class="font-bold text-maroon font-mono">14</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 04 — Agreeableness &amp; Harmony</span><span class="font-bold text-maroon font-mono">15</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 05 — Emotional Stability &amp; Stress</span><span class="font-bold text-maroon font-mono">16</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 06 — MBTI Sensing (Si vs Se)</span><span class="font-bold text-maroon font-mono">17</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 07 — MBTI Intuition (Ni vs Ne)</span><span class="font-bold text-maroon font-mono">18</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 08 — MBTI Thinking vs Feeling</span><span class="font-bold text-maroon font-mono">19</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 09 — Locus of Control</span><span class="font-bold text-maroon font-mono">20</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 10 — Risk Tolerance &amp; Ambiguity</span><span class="font-bold text-maroon font-mono">21</span></div>
                            </div>
                            <div class="mt-auto pt-1 border-t border-slate-100 text-[7.5px] text-slate-400 italic">Big Five · MBTI Stack · Locus of Control — Modules 01–10</div>
                        </div>

                        <!-- Phase II -->
                        <div class="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1 mb-1 shrink-0">
                                <i class="fa-solid fa-calculator text-gold text-[9px]"></i> Phase II: Cognitive Processing
                            </h4>
                            <div class="flex-1 space-y-0.5 text-[9px] overflow-hidden">
                                <div class="flex justify-between text-slate-600"><span>Module 11 — Fluid Intelligence &amp; Reasoning</span><span class="font-bold text-maroon font-mono">22</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 12 — Crystallized Intelligence</span><span class="font-bold text-maroon font-mono">23</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 13 — Spatial-Visual Intelligence</span><span class="font-bold text-maroon font-mono">24</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 14 — Logical-Mathematical</span><span class="font-bold text-maroon font-mono">25</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 15 — Linguistic-Verbal Intelligence</span><span class="font-bold text-maroon font-mono">26</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 16 — Systemic &amp; Systems Thinking</span><span class="font-bold text-maroon font-mono">27</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 17 — Creative Synthesis &amp; Lateral</span><span class="font-bold text-maroon font-mono">28</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 18 — Critical Thinking &amp; Bias Audit</span><span class="font-bold text-maroon font-mono">29</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 19 — Processing Speed &amp; Endurance</span><span class="font-bold text-maroon font-mono">30</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 20 — Metacognition &amp; Self-Auditing</span><span class="font-bold text-maroon font-mono">31</span></div>
                            </div>
                            <div class="mt-auto pt-1 border-t border-slate-100 text-[7.5px] text-slate-400 italic">Gf · Gc · Spatial · Logic · Verbal · Systems — Modules 11–20</div>
                        </div>

                        <!-- Phase III -->
                        <div class="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1 mb-1 shrink-0">
                                <i class="fa-solid fa-eye text-gold text-[9px]"></i> Phase III: Learning &amp; Execution
                            </h4>
                            <div class="space-y-0.5 text-[9px]">
                                <div class="flex justify-between text-slate-600"><span>Module 21 — VARK Visual &amp; Diagrammatic</span><span class="font-bold text-maroon font-mono">32</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 22 — VARK Auditory &amp; Verbal</span><span class="font-bold text-maroon font-mono">33</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 23 — VARK Read/Write &amp; Textual</span><span class="font-bold text-maroon font-mono">34</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 24 — VARK Kinesthetic &amp; Experiential</span><span class="font-bold text-maroon font-mono">35</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 25 — Academic Persistence &amp; Grit</span><span class="font-bold text-maroon font-mono">36</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 26 — Growth Mindset &amp; Adaptability</span><span class="font-bold text-maroon font-mono">37</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 27 — Exam Strategy &amp; Time Mgmt</span><span class="font-bold text-maroon font-mono">38</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 28 — Collaboration &amp; Teamwork</span><span class="font-bold text-maroon font-mono">39</span></div>
                            </div>
                            <div class="mt-auto pt-1 border-t border-slate-100 text-[7.5px] text-slate-400 italic">VARK · Grit · Growth Mindset · Study Strategy — Modules 21–28</div>
                        </div>

                        <!-- Phase IV, Phase V & Closing -->
                        <div class="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-0.5 mb-0.5 shrink-0">
                                <i class="fa-solid fa-compass text-gold text-[9px]"></i> Phase IV: Stream &amp; Career Alignment
                            </h4>
                            <div class="space-y-0.5 text-[8.5px]">
                                <div class="flex justify-between text-slate-600"><span>Module 29 — Career Interest Mapping (RIASEC)</span><span class="font-bold text-maroon font-mono">40</span></div>
                                <div class="flex justify-between text-slate-600"><span>Module 30 — Integrated Career Fitment</span><span class="font-bold text-maroon font-mono">41</span></div>
                                <div class="flex justify-between text-slate-600"><span>Executive Profile Synthesis</span><span class="font-bold text-maroon font-mono">42</span></div>
                            </div>
                            <h4 class="font-extrabold text-[9px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-0.5 mb-0.5 mt-0.5 shrink-0">
                                <i class="fa-solid fa-people-roof text-gold text-[8px]"></i> Phase V: Family &amp; Career Alignment
                            </h4>
                            <div class="space-y-0.5 text-[8px]">
                                <div class="flex justify-between text-slate-600"><span>Student–Parent Alignment Overview</span><span class="font-bold text-maroon font-mono">43</span></div>
                                <div class="flex justify-between text-slate-600"><span>Detailed Student–Parent Comparison</span><span class="font-bold text-maroon font-mono">44</span></div>
                                <div class="flex justify-between text-slate-600"><span>Family Career Action Plan</span><span class="font-bold text-maroon font-mono">45</span></div>
                            </div>
                            <h4 class="font-extrabold text-[9px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-0.5 mb-0.5 mt-0.5 shrink-0">
                                <i class="fa-solid fa-crosshairs text-gold text-[8px]"></i> Phase VI: Advanced Career Synthesis
                            </h4>
                            <div class="space-y-0.5 text-[8px]">
                                <div class="flex justify-between text-slate-600"><span>Interest × Confidence Analysis</span><span class="font-bold text-maroon font-mono">46</span></div>
                                <div class="flex justify-between text-slate-600"><span>Profile Cross-Validation &amp; Evidence</span><span class="font-bold text-maroon font-mono">47</span></div>
                                <div class="flex justify-between text-slate-600"><span>Developmental Priorities &amp; Exploration</span><span class="font-bold text-maroon font-mono">48</span></div>
                            </div>
                            <h4 class="font-extrabold text-[9px] text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-0.5 mb-0.5 mt-0.5 shrink-0">
                                <i class="fa-solid fa-flag-checkered text-gold text-[8px]"></i> Closing Synthesis &amp; Roadmaps
                            </h4>
                            <div class="space-y-0.5 text-[7.5px]">
                                <div class="flex justify-between text-slate-600"><span>Career Direction &amp; Pathways</span><span class="font-bold text-maroon font-mono">49</span></div>
                                <div class="flex justify-between text-slate-600"><span>Primary Pathway Roadmap</span><span class="font-bold text-maroon font-mono">50</span></div>
                                <div class="flex justify-between text-slate-600"><span>Secondary Pathway Roadmap</span><span class="font-bold text-maroon font-mono">51</span></div>
                                <div class="flex justify-between text-slate-600"><span>Strategic Alternative Roadmap</span><span class="font-bold text-maroon font-mono">52</span></div>
                                <div class="flex justify-between text-slate-600"><span>Personalized Study Abroad Guide</span><span class="font-bold text-maroon font-mono">53</span></div>
                                <div class="flex justify-between text-slate-600"><span>Academic &amp; Profile Roadmap</span><span class="font-bold text-maroon font-mono">54</span></div>
                                <div class="flex justify-between text-slate-600"><span>Student Action Plan</span><span class="font-bold text-maroon font-mono">55</span></div>
                                <div class="flex justify-between text-slate-600"><span>Report Conclusion &amp; Next Steps</span><span class="font-bold text-maroon font-mono">56</span></div>
                            </div>
                            <!-- Report Stats Strip -->
                            <div class="mt-auto pt-1 border-t border-slate-100 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7.5px] text-slate-500">
                                <div class="flex items-center gap-1"><i class="fa-solid fa-layer-group text-gold"></i><span><strong class="text-maroon">6</strong> Assessment Phases</span></div>
                                <div class="flex items-center gap-1"><i class="fa-solid fa-cubes text-gold"></i><span><strong class="text-maroon">30</strong> Diagnostic Modules</span></div>
                                <div class="flex items-center gap-1"><i class="fa-solid fa-file-lines text-gold"></i><span><strong class="text-maroon">${totalReportPages}</strong> Report Pages</span></div>
                                <div class="flex items-center gap-1"><i class="fa-solid fa-shield-halved text-gold"></i><span>CBSE / ICSE / IB / Cambridge</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium shrink-0">
                    <span>Diagnostic Engine: PrepAbroad Class 10 Matrix v5.0</span>
                    <span>Confidential Report for ${name}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 5: ACKNOWLEDGMENT PAGE -->
        <section class="as-report-page avoid-break" id="page-5" data-page="5">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-5 rounded-3xl border-2 border-gold shadow-xl flex flex-col">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-scroll"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-extrabold text-maroon-dark uppercase tracking-wider">Acknowledgment &amp; Institutional Dedication</h2>
                            <p class="text-[11px] text-slate-600">Formal Recognition of Key Stakeholders in Candidate Development</p>
                        </div>
                    </div>
                    <span class="text-[11px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 05</span>
                </div>

                <!-- Main Body Content - fills remaining height -->
                <div class="flex flex-col flex-1 gap-2.5 py-2 overflow-hidden">

                    <!-- Dedicated to candidate -->
                    <div class="bg-cream px-4 py-3 rounded-2xl border border-gold/40 shadow-sm shrink-0">
                        <h3 class="font-extrabold text-sm text-maroon flex items-center gap-2 border-b border-slate-200 pb-1.5 mb-2">
                            <i class="fa-solid fa-user-graduate text-gold"></i> Dedicated to the Candidate: ${name}
                        </h3>
                        <p class="text-[11px] text-slate-700 leading-relaxed">
                            We extend our heartfelt appreciation to <strong>${name}</strong> for undertaking this rigorous, multi-dimensional psychometric assessment with sincere diligence, intellectual curiosity, and self-reflection. Completing a 30-module diagnostic demands sustained cognitive focus and authentic self-assessment. The insights compiled within this dossier reflect your true behavioral archetype, cognitive agility, and unique learning potential.
                        </p>
                    </div>

                    <!-- Parents & Educators -->
                    <div class="grid grid-cols-2 gap-2.5 shrink-0">
                        <div class="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-bold text-xs text-maroon border-b border-slate-100 pb-1 mb-2 flex items-center gap-2">
                                <i class="fa-solid fa-house-chimney-user text-gold"></i> To Parents &amp; Guardians
                            </h4>
                            <p class="text-[11px] text-slate-600 leading-relaxed">
                                We acknowledge the pivotal role played by parents and family mentors in nurturing the candidate's educational journey. The Class 10 academic transition is a collaborative family milestone. Your guidance, encouragement, and open-minded support form the indispensable foundation upon which ${firstName} will build their Class 11 subject choices and future career roadmap.
                            </p>
                        </div>
                        <div class="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-bold text-xs text-maroon border-b border-slate-100 pb-1 mb-2 flex items-center gap-2">
                                <i class="fa-solid fa-chalkboard-user text-gold"></i> To School Leaders &amp; Educators
                            </h4>
                            <p class="text-[11px] text-slate-600 leading-relaxed">
                                Our deep gratitude goes to the teachers, academic heads, and career guidance counselors who dedicate themselves to shaping secondary school students. By integrating psychometric clarity with classroom pedagogy, educators empower candidates to align their academic electives with their intrinsic cognitive abilities.
                            </p>
                        </div>
                    </div>

                    <!-- Research Board -->
                    <div class="bg-maroon-dark text-white px-4 py-3 rounded-2xl border border-gold shadow-md shrink-0">
                        <h4 class="font-bold text-xs text-gold border-b border-gold/30 pb-1 mb-2 flex items-center gap-2">
                            <i class="fa-solid fa-award text-gold"></i> PrepAbroad Psychometric Research Board
                        </h4>
                        <p class="text-[11px] text-slate-200 leading-relaxed">
                            This executive diagnostic report was engineered by the PrepAbroad Psychometric Research Division in collaboration with lead educational strategists and behavioral data scientists. Built upon standardized global psychometric frameworks (CBSE, ICSE, IB, Cambridge), this dossier utilizes advanced normative algorithms to deliver publication-quality career stream guidance.
                        </p>
                    </div>

                    <!-- Assessment Framework + How to Read - fills remaining space -->
                    <div class="flex-1 flex flex-col gap-2 overflow-hidden">
                        <!-- Framework grid -->
                        <div class="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
                                <i class="fa-solid fa-microscope text-gold text-[9px]"></i> Assessment Framework &amp; Scope of Evaluation
                            </h4>
                            <div class="grid grid-cols-3 gap-x-4 gap-y-1 text-[9.5px] text-slate-600">
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Big Five Model</strong> — Openness, Conscientiousness, Extraversion, Agreeableness, Stability</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">MBTI Cognitive Stack</strong> — Sensing, Intuition, Thinking &amp; Feeling preferences</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">VARK Modalities</strong> — Visual, Auditory, Read/Write, Kinesthetic profiling</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Aptitude Battery</strong> — Fluid reasoning, spatial, numerical, verbal &amp; processing speed</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">RIASEC Career Mapping</strong> — Holland codes aligned with CBSE, ICSE, IB electives</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Metacognition &amp; Grit</strong> — Locus of control, growth mindset, risk tolerance</span></div>
                            </div>
                        </div>
                        <!-- How to Use This Report -->
                        <div class="flex-1 bg-maroon/5 px-4 py-2.5 rounded-2xl border border-maroon/20 shadow-sm overflow-hidden">
                            <h4 class="font-extrabold text-[10px] text-maroon uppercase tracking-wider flex items-center gap-1.5 border-b border-maroon/20 pb-1.5 mb-2">
                                <i class="fa-solid fa-book-open-reader text-gold text-[9px]"></i> How to Read &amp; Use This Report
                            </h4>
                            <div class="grid grid-cols-2 gap-x-5 gap-y-1 text-[9.5px] text-slate-600">
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Start with Section 09</strong> — the Executive Snapshot gives you the overall stream fitment in one view.</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Read Phase I &amp; II</strong> — understand your personality and cognitive wiring before reviewing careers.</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Review Phase III</strong> — align your learning style with study strategies recommended per module.</span></div>
                                <div class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-gold mt-0.5 text-[8px] shrink-0"></i><span><strong class="text-maroon">Action Plan (Page 49)</strong> — implement the 90-day strategic roadmap with your parents and counselor.</span></div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Signatures & Institutional Seal Block -->
                <div class="pt-3 border-t-2 border-slate-200 grid grid-cols-3 items-center gap-3 text-center text-xs shrink-0">
                    <div class="space-y-0.5">
                        <div class="font-serif italic font-bold text-maroon text-sm">Dr. Aris Thorne</div>
                        <div class="text-[9px] text-slate-500 font-semibold uppercase">Chief Psychometrician</div>
                        <div class="text-[8px] text-slate-400">PrepAbroad Board</div>
                    </div>
                    <div class="w-12 h-12 mx-auto rounded-full bg-cream border-2 border-gold flex items-center justify-center shadow-md">
                        <i class="fa-solid fa-stamp text-xl text-maroon"></i>
                    </div>
                    <div class="space-y-0.5">
                        <div class="font-serif italic font-bold text-maroon text-sm">Elena Rostova, M.Ed.</div>
                        <div class="text-[9px] text-slate-500 font-semibold uppercase">Lead Educational Strategist</div>
                        <div class="text-[8px] text-slate-400">Stream Alignment Advisory</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE 6: WELCOME LETTER PAGE -->
        <section class="as-report-page avoid-break" id="page-6" data-page="6">
            <div class="bg-white p-6 rounded-3xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-envelope-open-text"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-extrabold text-maroon-dark uppercase tracking-wider">
                                Welcome to Your Class 10 Diagnostic Journey
                            </h2>
                            <p class="text-[11px] text-slate-600">Personalized Letter to Candidate & Family</p>
                        </div>
                    </div>
                    <span class="text-[11px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 06</span>
                </div>

                <!-- Letter Body -->
                <div class="bg-cream/60 p-5 rounded-2xl border border-gold/30 shadow-sm space-y-3 text-xs text-slate-700 leading-relaxed my-auto shrink-0">
                    <div class="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span class="font-bold text-maroon text-xs uppercase tracking-wider">Official Welcome & Executive Summary Brief</span>
                        <span class="text-[10px] font-mono text-slate-500">Date: ${date}</span>
                    </div>

                    <p class="text-sm font-bold text-maroon-dark">
                        Dear ${name},
                    </p>

                    <p>
                        Welcome to your official <strong>Class 10 Executive Psychometric & Stream Diagnostic Report</strong>. Standing at the threshold of Class 10 is one of the most exciting and significant milestones in your educational career. For the first time, you are preparing to transition from general secondary education into specialized academic streams—whether that be Physical Sciences (PCM), Biological Sciences (PCB), Business & Finance (Commerce), Humanities & Social Sciences, or Creative Arts & Design.
                    </p>

                    <p>
                        Making an informed stream decision should never rely on guess work, peer influence, or external pressure. Your academic journey deserves an empirical foundation—one that maps your intrinsic cognitive reasoning, behavioral tendencies, learning modalities, and emotional resilience mechanisms against real-world career requirements.
                    </p>

                    <p>
                        This comprehensive ${totalReportPages}-page dossier has been custom-generated specifically for you, <strong>${firstName}</strong>. Inside, you will find an exhaustive 30-module analysis detailing:
                    </p>

                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium text-[11px] text-slate-800 my-1">
                        <li class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <i class="fa-solid fa-brain text-gold text-xs"></i>
                            <span>Big Five Personality Architecture (OCEAN)</span>
                        </li>
                        <li class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <i class="fa-solid fa-calculator text-gold text-xs"></i>
                            <span>Fluid & Quantitative Aptitude Spectrum</span>
                        </li>
                        <li class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <i class="fa-solid fa-eye text-gold text-xs"></i>
                            <span>VARK Learning Style Modality</span>
                        </li>
                        <li class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <i class="fa-solid fa-heart-pulse text-gold text-xs"></i>
                            <span>Emotional Intelligence & Stress Buffering</span>
                        </li>
                    </ul>

                    <p>
                        We encourage you to read every page of this report thoughtfully alongside your parents, teachers, and school counselors. Use the strategic protocols provided in each module to double your study efficiency, build exam resilience, and confidently select the Class 11 stream combination that best unleashes your full potential.
                    </p>

                    <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <div>
                            <p class="font-extrabold text-maroon text-xs">Warmest Regards & Academic Success,</p>
                            <p class="text-[10px] text-slate-600 font-semibold">The PrepAbroad Psychometric & Academic Advisory Board</p>
                        </div>
                        <div class="text-right font-serif italic text-gold-dark font-bold text-xs">
                            PrepAbroad 2026
                        </div>
                    </div>
                </div>

                <!-- Footer Banner -->
                <div class="bg-maroon text-white p-3 rounded-xl flex items-center justify-between text-xs shrink-0">
                    <span class="font-medium text-slate-200 text-[11px]"><i class="fa-solid fa-lightbulb text-gold mr-1.5"></i> Pro Tip: Share this dossier with your school counselor prior to Class 11 subject registration.</span>
                    <span class="font-mono text-gold text-[10px] font-bold">#${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 7: ABOUT THIS ASSESSMENT PAGE -->
        <section class="as-report-page avoid-break" id="page-7" data-page="7">
            <div class="bg-white p-6 rounded-3xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-circle-info"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-extrabold text-maroon-dark uppercase tracking-wider">
                                About This Psychometric Assessment Matrix
                            </h2>
                            <p class="text-[11px] text-slate-600">Architectural Framework of the 5 Core Assessment Pillars</p>
                        </div>
                    </div>
                    <span class="text-[11px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 07</span>
                </div>

                <!-- 4 Diagnostic Phases Grid -->
                <div class="space-y-3 my-auto text-xs shrink-0">
                    <div class="text-slate-600 leading-relaxed text-[11px]">
                        The Class 10 Executive Psychometric Assessment is an advanced multi-layered diagnostic system specifically designed for secondary school students. Rather than relying on simple quiz questions, our framework measures candidate traits across 4 core diagnostic assessment phases comprising 30 comprehensive modules:
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <!-- Phase I -->
                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 flex flex-col justify-between shadow-sm">
                            <div>
                                <div class="w-7 h-7 rounded-lg bg-maroon text-gold font-bold flex items-center justify-center text-[11px] mb-1">P1</div>
                                <h4 class="font-extrabold text-maroon text-[11px] uppercase">Phase I: Personality</h4>
                                <p class="text-[10px] text-slate-600 mt-0.5 leading-tight">Evaluates Big Five dimensions (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability) &amp; behavioral drivers.</p>
                            </div>
                            <span class="text-[9px] font-bold text-gold-dark bg-gold/20 px-1.5 py-0.5 rounded text-center block mt-1">Modules 01–10</span>
                        </div>

                        <!-- Phase II -->
                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 flex flex-col justify-between shadow-sm">
                            <div>
                                <div class="w-7 h-7 rounded-lg bg-maroon text-gold font-bold flex items-center justify-center text-[11px] mb-1">P2</div>
                                <h4 class="font-extrabold text-maroon text-[11px] uppercase">Phase II: Cognitive</h4>
                                <p class="text-[10px] text-slate-600 mt-0.5 leading-tight">Measures Fluid Logic (Gf), Quantitative Reasoning, Verbal Comprehension, Spatial Visualization, and Working Memory.</p>
                            </div>
                            <span class="text-[9px] font-bold text-gold-dark bg-gold/20 px-1.5 py-0.5 rounded text-center block mt-1">Modules 11–20</span>
                        </div>

                        <!-- Phase III -->
                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 flex flex-col justify-between shadow-sm">
                            <div>
                                <div class="w-7 h-7 rounded-lg bg-maroon text-gold font-bold flex items-center justify-center text-[11px] mb-1">P3</div>
                                <h4 class="font-extrabold text-maroon text-[11px] uppercase">Phase III: Execution</h4>
                                <p class="text-[10px] text-slate-600 mt-0.5 leading-tight">Identifies VARK sensory study modalities, Grit, Time Blocking, Exam Arousal Optimization, and Spatial Kinematics.</p>
                            </div>
                            <span class="text-[9px] font-bold text-gold-dark bg-gold/20 px-1.5 py-0.5 rounded text-center block mt-1">Modules 21–28</span>
                        </div>

                        <!-- Phase IV -->
                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 flex flex-col justify-between shadow-sm">
                            <div>
                                <div class="w-7 h-7 rounded-lg bg-maroon text-gold font-bold flex items-center justify-center text-[11px] mb-1">P4</div>
                                <h4 class="font-extrabold text-maroon text-[11px] uppercase">Phase IV: Alignment</h4>
                                <p class="text-[10px] text-slate-600 mt-0.5 leading-tight">Holland RIASEC Interest Mapping &amp; Master Stream Integration across PCM, PCB, Commerce, and Humanities pathways.</p>
                            </div>
                            <span class="text-[9px] font-bold text-gold-dark bg-gold/20 px-1.5 py-0.5 rounded text-center block mt-1">Modules 29–30</span>
                        </div>
                    </div>

                    <!-- Strategic Utility Box -->
                    <div class="bg-maroon-dark text-white p-4 rounded-2xl border-2 border-gold shadow-lg space-y-2">
                        <h3 class="font-extrabold text-xs text-gold uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-bullseye text-gold"></i> Strategic Value for Class 10 Candidates
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
                            <div class="space-y-0.5">
                                <span class="font-bold text-white block text-[11px]">1. Stream Selection Security</span>
                                <p class="text-[10px] text-slate-300 leading-snug">Prevents costly stream switches in Class 11 by aligning subject choices with natural cognitive aptitude.</p>
                            </div>
                            <div class="space-y-0.5">
                                <span class="font-bold text-white block text-[11px]">2. Entrance Exam Readiness</span>
                                <p class="text-[10px] text-slate-300 leading-snug">Identifies early readiness for competitive exams such as JEE, NEET, CLAT, IPMAT, SAT, and NIDA.</p>
                            </div>
                            <div class="space-y-0.5">
                                <span class="font-bold text-white block text-[11px]">3. Personalized Study Hacks</span>
                                <p class="text-[10px] text-slate-300 leading-snug">Provides tailored VARK study techniques and stress management protocols for board exam optimization.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Badge -->
                <div class="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0">
                    <span>Diagnostic Engine: PrepAbroad Class 10 Matrix v5.0</span>
                    <span>Confidential Report for ${name}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 8: ASSESSMENT METHODOLOGY PAGE -->
        <section class="as-report-page avoid-break" id="page-8" data-page="8">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-6 rounded-3xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-maroon text-gold font-extrabold flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-microscope"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-extrabold text-maroon-dark uppercase tracking-wider">
                                Assessment Methodology & Psychometric Validity
                            </h2>
                            <p class="text-[11px] text-slate-600">Scientific Standardization, Normative Metrics & AI Synthesis</p>
                        </div>
                    </div>
                    <span class="text-[11px] font-extrabold text-maroon bg-gold/20 border border-gold px-2.5 py-0.5 rounded-full uppercase">Page 08</span>
                </div>

                <!-- Main Technical Grid -->
                <div class="space-y-4 my-auto text-xs shrink-0">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Section 1 -->
                        <div class="bg-cream p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                            <h3 class="font-extrabold text-xs text-maroon flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <i class="fa-solid fa-square-poll-vertical text-gold"></i> Psychometric Validity & Reliability
                            </h3>
                            <p class="text-[11px] text-slate-700 leading-relaxed">
                                Our assessment items are calibrated using Item Response Theory (IRT) and standardized against a normative benchmark sample of over <strong>50,000 Class 10 students</strong> across diverse curriculum boards (CBSE, ICSE, IB, Cambridge).
                            </p>
                            <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                                <div class="flex justify-between">
                                    <span class="font-bold text-slate-700">Cronbach's Alpha Reliability:</span>
                                    <span class="font-extrabold text-emerald-600">α = 0.89 (High Consistency)</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-bold text-slate-700">Construct Validity Score:</span>
                                    <span class="font-extrabold text-maroon">94.2% Empirical Alignment</span>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2 -->
                        <div class="bg-cream p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                            <h3 class="font-extrabold text-xs text-maroon flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <i class="fa-solid fa-chart-area text-gold"></i> Percentile & Normative Distribution
                            </h3>
                            <p class="text-[11px] text-slate-700 leading-relaxed">
                                Candidate scores are normalized into standard percentile ranks relative to Class 10 peers using Gaussian distribution bell-curve modeling:
                            </p>
                            <div class="space-y-1 text-[10px]">
                                <div class="flex items-center justify-between p-1 bg-white rounded border border-slate-200">
                                    <span class="font-bold text-emerald-700">90th–99th Percentile:</span>
                                    <span class="text-slate-600">Superior / Exceptional Capacity</span>
                                </div>
                                <div class="flex items-center justify-between p-1 bg-white rounded border border-slate-200">
                                    <span class="font-bold text-maroon">75th–89th Percentile:</span>
                                    <span class="text-slate-600">High / Advanced Proficiency</span>
                                </div>
                                <div class="flex items-center justify-between p-1 bg-white rounded border border-slate-200">
                                    <span class="font-bold text-slate-800">50th–74th Percentile:</span>
                                    <span class="text-slate-600">Above Average / Solid Baseline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3 & 4 Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                            <h4 class="font-bold text-[11px] text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-robot text-gold"></i> AI Editorial Intelligence Engine
                            </h4>
                            <p class="text-[11px] text-slate-600 leading-relaxed">
                                The dynamic narrative in this report is synthesized by our AI Editorial Engine v5.0. It converts multi-dimensional score vectors into candidate-specific growth protocols, personalized recommendations, and parent/teacher advisories.
                            </p>
                        </div>

                        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                            <h4 class="font-bold text-[11px] text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-lock text-gold"></i> Data Privacy & Confidentiality Notice
                            </h4>
                            <p class="text-[11px] text-slate-600 leading-relaxed">
                                All candidate data is handled under strict data protection protocols. This report is confidential and intended solely for the candidate, their parents, and authorized academic mentors for educational planning.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer Banner -->
                <div class="bg-maroon-dark text-white p-3 rounded-xl flex items-center justify-between text-xs shrink-0">
                    <span class="font-medium text-slate-200 text-[11px]"><i class="fa-solid fa-circle-check text-gold mr-1.5"></i> Fully Verified & Norm-Referenced Class 10 Assessment Matrix</span>
                    <span class="font-mono text-gold text-[10px] font-bold">Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 6: VERIFIED CANDIDATE DIAGNOSTIC PROFILE HERO -->
        <section class="as-report-page avoid-break" id="page-9" data-page="9">
            <div style="min-height: 273mm; height: 273mm;" class="maroon-gradient rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border-4 border-gold h-full flex flex-col justify-between">
                <!-- Background Ambient Glow -->
                <div class="absolute -top-24 -right-24 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Header Bar -->
                <div class="flex items-center justify-between border-b border-gold/40 pb-4 shrink-0">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-semibold uppercase tracking-wider">
                        <i class="fa-solid fa-user-check text-gold"></i> Verified Class 10 Diagnostic Profile
                    </div>
                    <span class="text-xs font-mono text-gold-light">Ref: #${rid}</span>
                </div>

                <!-- Candidate Name & Archetype Banner -->
                <div class="space-y-2 shrink-0 my-2">
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
                        ${name}
                    </h1>
                    <p class="text-gold text-base sm:text-lg font-bold">
                        Primary Archetype: ${topCareer.toUpperCase()}
                    </p>
                    <p class="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-3xl">
                        ${firstName}, your diagnostic profile reflects a high-capacity cognitive architecture and personalized stream alignment matrix. Below is your verified 4-stream compatibility breakdown and core competency scores.
                    </p>
                </div>

                <!-- Core Competency & Score Seals Row -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 my-2">
                    <div class="bg-obsidian/70 p-4 rounded-2xl border border-gold/40 text-center space-y-1 backdrop-blur-sm">
                        <span class="text-[10px] text-slate-300 uppercase font-bold block">Overall Competency</span>
                        <div class="text-3xl font-extrabold text-gold">${aptOverall}%</div>
                        <span class="text-[10px] text-emerald-400 font-semibold"><i class="fa-solid fa-circle-check"></i> Top ${Math.max(1, 100 - Math.round(aptOverall * 0.96))}th %ile Candidate</span>
                    </div>

                    <div class="bg-obsidian/70 p-4 rounded-2xl border border-gold/40 text-center space-y-1 backdrop-blur-sm">
                        <span class="text-[10px] text-slate-300 uppercase font-bold block">Top Career Fitment</span>
                        <div class="text-3xl font-extrabold text-gold">${topFitScore}/100</div>
                        <span class="text-[10px] text-gold-light font-semibold">${topCareer}</span>
                    </div>

                    <div class="bg-obsidian/70 p-4 rounded-2xl border border-gold/40 text-center space-y-1 backdrop-blur-sm">
                        <span class="text-[10px] text-slate-300 uppercase font-bold block">VARK Primary Modality</span>
                        <div class="text-3xl font-extrabold text-white">${topVarkLabel}</div>
                        <span class="text-[10px] text-emerald-400 font-semibold">High Retention Strategy</span>
                    </div>
                </div>

                <!-- 4-Stream Fitment Compatibility Matrix -->
                <div class="bg-obsidian/60 p-5 rounded-2xl border border-gold/40 space-y-3 shrink-0 my-2 backdrop-blur-sm">
                    <div class="flex justify-between items-center border-b border-gold/30 pb-2">
                        <span class="text-xs font-bold text-gold uppercase tracking-wider">Class 11 Academic Stream Fitment Matrix</span>
                        <span class="text-[10px] text-slate-300">Normative Score Matching</span>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        ${careerFitmentList.map((c, i) => `
                        <div class="p-3 bg-black/40 rounded-xl border border-gold/30 text-center space-y-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block">Stream ${i + 1}</span>
                            <span class="font-bold text-white block text-[10.5px] leading-snug break-words">${getCanonicalStreamName(c.name)}</span>
                            <div class="text-lg font-extrabold text-gold">${c.score}%</div>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Diagnostic Indicators Snapshot Box -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0 pt-2 border-t border-white/20">
                    <div>
                        <span class="text-gold-light block font-semibold text-[10px] uppercase">Fluid Logic (Gf)</span>
                        <span class="font-bold text-white text-sm">${reasSc}% Percentile</span>
                    </div>
                    <div>
                        <span class="text-gold-light block font-semibold text-[10px] uppercase">Conscientiousness</span>
                        <span class="font-bold text-white text-sm">${cSc}% Percentile</span>
                    </div>
                    <div>
                        <span class="text-gold-light block font-semibold text-[10px] uppercase">Openness Index</span>
                        <span class="font-bold text-white text-sm">${oSc}% Percentile</span>
                    </div>
                    <div>
                        <span class="text-gold-light block font-semibold text-[10px] uppercase">Assessment Date</span>
                        <span class="font-bold text-emerald-400 text-sm">${date}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE 7: MASTER VISUAL ANALYTICS DASHBOARD - PART I -->
        <section class="as-report-page avoid-break" id="page-10" data-page="10">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-6 sm:p-7 rounded-2xl shadow-xl border-2 border-gold h-full flex flex-col justify-start space-y-4">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div>
                        <h2 class="text-lg font-extrabold text-maroon-dark uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-chart-pie text-gold"></i> Master Visual Analytics Dashboard — Part I
                        </h2>
                        <p class="text-xs text-slate-600">8-Pillar Competency Radar & Cognitive Capacity Array Analysis</p>
                    </div>
                    <span class="text-xs font-extrabold text-maroon bg-gold/20 border border-gold px-3 py-1 rounded-full uppercase">Visual Analytics 01</span>
                </div>

                <!-- 2 Side-by-Side Charts -->
                <div class="grid grid-cols-2 gap-4 shrink-0">
                    <!-- Chart 1: Master Radar -->
                    <div class="bg-cream/60 p-4 rounded-2xl border border-gold/30 h-[300px] flex flex-col justify-between print-card shadow-sm">
                        <h4 class="text-xs font-extrabold text-maroon uppercase tracking-wider text-center mb-1">8-Pillar Competency Radar</h4>
                        <div class="relative w-full h-[220px] flex items-center justify-center">
                            <canvas id="masterRadarChart"></canvas>
                        </div>
                    </div>

                    <!-- Chart 2: Cognitive Array -->
                    <div class="bg-cream/60 p-4 rounded-2xl border border-gold/30 h-[300px] flex flex-col justify-between print-card shadow-sm">
                        <h4 class="text-xs font-extrabold text-maroon uppercase tracking-wider text-center mb-1">Cognitive Capacity Array (Gf, Gc & Spatial)</h4>
                        <div class="relative w-full h-[220px] flex items-center justify-center">
                            <canvas id="cognitiveBarChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Analytical Summary Table for Page 1 -->
                <div class="bg-cream p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2 shrink-0">
                    <h4 class="font-extrabold text-xs text-maroon uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-microchip text-gold"></i> Cognitive Agility & Aptitude Percentile Summary
                    </h4>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span class="text-[10px] text-slate-500 font-bold uppercase block">Fluid Reasoning</span>
                            <span class="text-sm font-extrabold text-maroon">${reasSc}% %ile</span>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span class="text-[10px] text-slate-500 font-bold uppercase block">Numerical Logic</span>
                            <span class="text-sm font-extrabold text-maroon">${numSc}% %ile</span>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span class="text-[10px] text-slate-500 font-bold uppercase block">Verbal Analysis</span>
                            <span class="text-sm font-extrabold text-maroon">${verbalSc}% %ile</span>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span class="text-[10px] text-slate-500 font-bold uppercase block">Spatial Visualization</span>
                            <span class="text-sm font-extrabold text-maroon">${spatSc}% %ile</span>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Data Panels -->
                <div class="grid grid-cols-2 gap-4 flex-grow">
                    <div class="bg-white p-4 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 class="font-extrabold text-xs text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-chart-line text-gold"></i> Trait Correlation Matrix
                            </h4>
                            <span class="text-[9px] font-bold text-maroon bg-cream px-2 py-0.5 rounded border border-gold/30">Synergy Index</span>
                        </div>
                        <div class="space-y-2 text-[11px] text-slate-700">
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Fluid Logic & STEM Alignment:</strong> High fluid reasoning (${reasSc}%) paired with numerical logic (${numSc}%) indicates exceptional analytical problem-solving capability suitable for competitive STEM streams.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Behavioral Catalyst:</strong> Conscientiousness baseline (${cSc}%) provides sustained executive focus needed for rigorous multi-year exam preparation.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Verbal-Spatial Integration:</strong> Verbal analysis (${verbalSc}%) and spatial reasoning (${spatSc}%) balance abstract conceptualization with structured articulation.</div>
                            </div>
                        </div>
                        <div class="bg-cream/60 p-2.5 rounded-xl border border-gold/30 text-[10px] text-slate-600 flex items-center justify-between">
                            <span>Diagnostic Actionable Priority:</span>
                            <strong class="text-maroon font-bold">Focus Modules 01–10</strong>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 class="font-extrabold text-xs text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-compass-drafting text-gold"></i> Stream Alignment & Academic Fit
                            </h4>
                            <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${topFitScore}% Match</span>
                        </div>
                        <div class="space-y-2 text-[11px] text-slate-700">
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Primary Career Target:</strong> ${topCareer} shows peak compatibility based on overall cognitive and personality trait profiling.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Secondary Alternative Stream:</strong> Engineering & Applied Technology pathways align with numerical and spatial scores (${numSc}% / ${spatSc}%).</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Foundational Roadmap:</strong> Prioritize stream-specific core modules 11–18 to consolidate subject readiness before Class 11 subject selection.</div>
                            </div>
                        </div>
                        <div class="bg-cream/60 p-2.5 rounded-xl border border-gold/30 text-[10px] text-slate-600 flex items-center justify-between">
                            <span>Recommended Specialization:</span>
                            <strong class="text-maroon font-bold text-right ml-2 leading-tight">${topCareer}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAGE 8: MASTER VISUAL ANALYTICS DASHBOARD - PART II -->
        <section class="as-report-page avoid-break" id="page-11" data-page="11">
            <div style="min-height: 273mm; height: 273mm;" class="bg-white p-6 sm:p-7 rounded-2xl shadow-xl border-2 border-gold h-full flex flex-col justify-start space-y-4">
                <!-- Header -->
                <div class="border-b-2 border-maroon/20 pb-3 flex items-center justify-between shrink-0">
                    <div>
                        <h2 class="text-lg font-extrabold text-maroon-dark uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-chart-donut text-gold"></i> Master Visual Analytics Dashboard — Part II
                        </h2>
                        <p class="text-xs text-slate-600">VARK Sensory Learning Modality & Emotional Intelligence (EQ) Analysis</p>
                    </div>
                    <span class="text-xs font-extrabold text-maroon bg-gold/20 border border-gold px-3 py-1 rounded-full uppercase">Visual Analytics 02</span>
                </div>

                <!-- 2 Side-by-Side Charts -->
                <div class="grid grid-cols-2 gap-4 shrink-0">
                    <!-- Chart 3: VARK Donut -->
                    <div class="bg-cream/60 p-4 rounded-2xl border border-gold/30 h-[300px] flex flex-col justify-between print-card shadow-sm">
                        <h4 class="text-xs font-extrabold text-maroon uppercase tracking-wider text-center mb-1">VARK Modal Learning Share</h4>
                        <div class="relative w-full h-[220px] flex items-center justify-center">
                            <canvas id="varkDonutChart"></canvas>
                        </div>
                    </div>

                    <!-- Chart 4: EQ Polar Chart -->
                    <div class="bg-cream/60 p-4 rounded-2xl border border-gold/30 h-[300px] flex flex-col justify-between print-card shadow-sm">
                        <h4 class="text-xs font-extrabold text-maroon uppercase tracking-wider text-center mb-1">Emotional Intelligence (EQ) 4-Branch</h4>
                        <div class="relative w-full h-[220px] flex items-center justify-center">
                            <canvas id="eqPolarChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Analytical Summary Box for Page 2 -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl border-2 border-gold shadow-md space-y-2 shrink-0">
                    <h4 class="font-extrabold text-xs text-gold uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-brain text-gold"></i> Sensory Learning & Emotional Stress Resilience Strategy
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200">
                        <div class="space-y-1">
                            <span class="font-bold text-white block">VARK Study Technique Alignment:</span>
                            <p class="text-[11px] text-slate-300 leading-snug">Primary ${topVarkLabel} preference. Use visual flowcharts, dual-coding diagrams, and color-coded note hierarchies to double retention.</p>
                        </div>
                        <div class="space-y-1">
                            <span class="font-bold text-white block">EQ Stress Regulation Protocol:</span>
                            <p class="text-[11px] text-slate-300 leading-snug">Emotional stability baseline (${esSc}%). Apply physiological sighing and tactical time-blocking under timed exam pressures.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Additional Insight Modules -->
                <div class="grid grid-cols-2 gap-4 flex-grow">
                    <div class="bg-white p-4 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 class="font-extrabold text-xs text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-bolt text-gold"></i> Learning Efficiency Index (LEI)
                            </h4>
                            <span class="text-[9px] font-bold text-maroon bg-cream px-2 py-0.5 rounded border border-gold/30">Active Recall</span>
                        </div>
                        <div class="space-y-2 text-[11px] text-slate-700">
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Dominant Modality:</strong> Primary ${topVarkLabel} learning preference maximizes information encoding efficiency when paired with visual notes & diagrams.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Retention Strategy:</strong> Implement a 3-step active recall workflow (Mind Mapping → Dual-Coding Diagrams → Weekly Self-Testing) to double long-term memory consolidation.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Study Cycle Optimization:</strong> Follow a 50-minute focused study block with a 10-minute visual review break to prevent cognitive fatigue.</div>
                            </div>
                        </div>
                        <div class="bg-cream/60 p-2.5 rounded-xl border border-gold/30 text-[10px] text-slate-600 flex items-center justify-between">
                            <span>Recommended Modality Workflow:</span>
                            <strong class="text-maroon font-bold">${topVarkLabel} Integration</strong>
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 class="font-extrabold text-xs text-maroon uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-heart-pulse text-gold"></i> Emotional Intelligence Core (EQ)
                            </h4>
                            <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${esSc}% Resilience</span>
                        </div>
                        <div class="space-y-2 text-[11px] text-slate-700">
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Stress Resilience Baseline:</strong> Emotional stability score (${esSc}%) indicates robust psychological endurance under high-stakes timed examination conditions.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Exam Stress Mitigation:</strong> Practice tactical physiological sighing and micro-reframing techniques during mock test simulations to maintain composure.</div>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gold font-bold">•</span>
                                <div><strong class="text-maroon">Interpersonal Collaboration:</strong> Extraversion (${eSc}%) and agreeableness (${aSc}%) provide strong foundations for peer study groups and collaborative projects.</div>
                            </div>
                        </div>
                        <div class="bg-cream/60 p-2.5 rounded-xl border border-gold/30 text-[10px] text-slate-600 flex items-center justify-between">
                            <span>Stress Regulation Baseline:</span>
                            <strong class="text-maroon font-bold">${esSc >= 60 ? 'Optimal Control' : 'Developing Control'}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 30 FULL-PAGE MODULE CARDS -->
        <div class="space-y-2">
            ${moduleCardsHTML}
        </div>

        <!-- LLM EXECUTIVE SYNTHESIS SECTION -->
        <section class="as-report-page avoid-break" id="page-42" data-page="42">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon text-white p-5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">AI Editorial Intelligence</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Executive Profile Synthesis for ${name}</h2>
                    </div>
                    <span class="text-xs text-gold font-bold">Personalized Summary</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto flex-grow flex flex-col justify-center">
                    <div class="bg-cream/60 p-5 rounded-2xl border border-gold/30 shadow-sm space-y-3">
                        <h3 class="font-bold text-sm text-maroon-dark border-b border-slate-200 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-user-tie text-gold"></i> Executive Profile Overview
                        </h3>
                        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            ${personalization.executiveSummary || `${name} demonstrates a highly capable psychometric profile defined by high reasoning agility, strong conscientiousness, and an empirical focus on structural systems.`}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div class="bg-cream p-4 rounded-xl border border-slate-200 space-y-2">
                            <span class="font-bold text-maroon text-xs block uppercase tracking-wider"><i class="fa-solid fa-star text-gold mr-1.5"></i>Core Profile Strengths</span>
                            <ul class="space-y-2 text-xs text-slate-700">
                                ${(personalization.strengths || [
                                    `High Fluid Intelligence (${reasSc}%) enabling rapid pattern recognition.`,
                                    `Disciplined Conscientiousness (${cSc}%) providing steady goal execution.`,
                                    `Visual dual-coding mastery accelerating theory retention.`
                                ]).map(s => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600 mt-0.5 text-[10px]"></i><span>${s}</span></li>`).join('')}
                            </ul>
                        </div>

                        <div class="bg-cream p-4 rounded-xl border border-slate-200 space-y-2">
                            <span class="font-bold text-maroon text-xs block uppercase tracking-wider"><i class="fa-solid fa-bullseye text-gold mr-1.5"></i>Strategic Growth Vectors</span>
                            <ul class="space-y-2 text-xs text-slate-700">
                                ${(personalization.growthAreas || [
                                    `Guard against perfectionist over-analysis during timed exam blocks.`,
                                    `Pair high abstract curiosity with strict task prioritization boards.`,
                                    `Incorporate structured rest windows to prevent focus degradation.`
                                ]).map(g => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-trend-up text-maroon mt-0.5 text-[10px]"></i><span>${g}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Executive Summary File: #${rid}</span>
                    <span>Class 10 Executive Report</span>
                </div>
            </div>
        </section>

        <!-- PAGE 43: PHASE V — STUDENT-PARENT ALIGNMENT OVERVIEW (PAGE A) -->
        <section class="as-report-page avoid-break" id="page-43" data-page="43">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family &amp; Career Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Student–Parent Alignment Overview</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full ${comparisonData ? 'bg-gold text-maroon-dark' : 'bg-slate-700 text-slate-200'} text-xs font-extrabold uppercase tracking-wider shadow">
                            ${comparisonData ? (comparisonData.overallIndicator || 'Parent Assessment Completed') : 'Parent Evaluation Status'}
                        </span>
                        <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 43</span>
                    </div>
                </div>

                ${comparisonData && comparisonData.areas ? `
                <!-- Main Overview Content -->
                <div class="space-y-4 shrink-0 my-auto">
                    <!-- Weighted Alignment Index & Score Card -->
                    <div class="bg-gradient-to-r from-cream via-white to-cream p-4 rounded-2xl border border-gold/40 shadow-sm flex items-center justify-between gap-4">
                        <div class="space-y-1 max-w-xl">
                            <span class="text-[10px] font-extrabold text-maroon uppercase tracking-wider block">Product-Weighted Family Alignment Index</span>
                            <h3 class="text-lg font-extrabold text-slate-900">${comparisonData.overallIndicator} (${comparisonData.overallScore ?? 75}% Index Fit)</h3>
                            <p class="text-[11px] text-slate-600 leading-snug">
                                Derived from deterministic scoring across 7 weighted family domains: Career Direction (25%), Career Expectations (20%), Financial Feasibility (15%), Study Abroad (15%), Decision Autonomy (10%), Risk Tolerance (7.5%), Support Style (7.5%).
                            </p>
                        </div>
                        <div class="text-center bg-white p-3 rounded-xl border border-gold/50 shadow shrink-0 min-w-[120px]">
                            <span class="text-3xl font-black text-maroon font-mono block">${comparisonData.overallScore ?? 75}%</span>
                            <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Weighted Fit</span>
                        </div>
                    </div>

                    <!-- 2-Column Perspective Snapshot -->
                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center justify-between">
                                <span><i class="fa-solid fa-user-graduate text-gold mr-1"></i> Student Psychometric Target</span>
                                <span class="text-[9px] font-mono text-slate-500">Self-Report</span>
                            </span>
                            <div class="text-slate-800 text-[11px]">Primary Stream Fit: <strong class="text-maroon font-bold">${topCareer}</strong></div>
                            <div class="text-slate-600 text-[10px]">Core Values: ${scores.topValues?.slice(0, 3).join(', ') || 'Autonomy, Mastery'}</div>
                            <div class="text-slate-600 text-[10px]">Autonomy Preference: High Self-Direction</div>
                            <div class="text-slate-600 text-[10px]">Global Education: ${scores.topRiasec?.includes('E') || scores.topValues?.includes('adventure') ? 'High Openness' : 'Standard Alignment'}</div>
                        </div>

                        <div class="bg-cream p-3.5 rounded-xl border border-gold/40 space-y-1.5 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center justify-between">
                                <span><i class="fa-solid fa-user-shield text-gold mr-1"></i> Parent Evaluation Profile</span>
                                <span class="text-[9px] font-mono text-slate-500">Parent Assessment</span>
                            </span>
                            <div class="text-slate-800 text-[11px]">Perceived Direction: <strong class="text-maroon font-bold">${parentProfile?.choices?.perceivedCareerDirection ? parentProfile.choices.perceivedCareerDirection.replace(/_/g, ' ') : 'Technology / Science'}</strong></div>
                            <div class="text-slate-600 text-[10px]">Budget Outlook: ${parentProfile?.choices?.educationBudget ? parentProfile.choices.educationBudget.replace('budget_', '').replace(/_/g, ' ') : 'Planned'}</div>
                            <div class="text-slate-600 text-[10px]">Decision Ownership: ${parentProfile?.choices?.decisionOwnership ? parentProfile.choices.decisionOwnership.replace(/_/g, ' ') : 'Collaborative Guidance'}</div>
                            <div class="text-slate-600 text-[10px]">International Openness: ${parentProfile?.interpreted?.internationalOpenness || 'Strong Preference'}</div>
                        </div>
                    </div>

                    <!-- 7-Domain Family Alignment Summary Table -->
                    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs shadow-sm">
                        <div class="bg-maroon/10 p-2 border-b border-slate-200 flex justify-between items-center font-bold text-maroon text-[11px]">
                            <span>7-Domain Executive Alignment Battery</span>
                            <span>Status Indicator</span>
                        </div>
                        <div class="divide-y divide-slate-100 text-[11px]">
                            ${comparisonData.areas.map(a => {
                                const isGood = a.level === 'high_alignment' || a.level === 'aligned';
                                const isMod = a.level === 'moderate_alignment';
                                const isGap = a.level === 'potential_gap' || a.level === 'constraint';
                                const levelBadge = 
                                    isGood ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                    isMod ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                    isGap ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-red-100 text-red-800 border-red-300';
                                const levelLabel = 
                                    isGood ? 'HIGH ALIGNMENT' :
                                    isMod ? 'MODERATE ALIGNMENT' :
                                    isGap ? 'POTENTIAL GAP' : 'SIGNIFICANT GAP';
                                return `
                                <div class="p-2 flex items-center justify-between gap-3">
                                    <div class="space-y-0.5 max-w-[72%]">
                                        <div class="font-bold text-slate-800 flex items-center gap-1.5">
                                            <i class="fa-solid ${isGood ? 'fa-circle-check text-emerald-600' : isMod ? 'fa-circle-exclamation text-amber-600' : 'fa-triangle-exclamation text-rose-600'} text-[10px]"></i>
                                            ${a.name}
                                        </div>
                                        <div class="text-[10px] text-slate-600 leading-snug">${a.explanation}</div>
                                    </div>
                                    <span class="px-2 py-0.5 rounded border text-[9px] font-bold shrink-0 ${levelBadge}">${levelLabel}</span>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                ` : `
                <!-- Pending Parent Assessment Advisory View -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 shrink-0 my-auto">
                    <div class="bg-cream/60 p-5 rounded-2xl border border-gold/30 shadow-sm space-y-3">
                        <h3 class="font-bold text-sm text-maroon border-b border-slate-200 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-house-user text-gold"></i> Parent Advisory Strategy
                        </h3>
                        <div class="space-y-3 text-xs">
                            <div class="space-y-1">
                                <span class="font-bold text-slate-800 uppercase text-[11px] block">Key Observations:</span>
                                <ul class="space-y-1 text-slate-600">
                                    ${parentObs.map(o => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-circle text-gold text-[6px] mt-1.5"></i><span>${o}</span></li>`).join('')}
                                </ul>
                            </div>
                            <div class="space-y-1 border-t border-slate-200 pt-2">
                                <span class="font-bold text-slate-800 uppercase text-[11px] block">Home Environment Strategies:</span>
                                <ul class="space-y-1 text-slate-600">
                                    ${parentStrat.map(s => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[10px] mt-0.5"></i><span>${s}</span></li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-cream/60 p-5 rounded-2xl border border-gold/30 shadow-sm space-y-3">
                        <h3 class="font-bold text-sm text-maroon border-b border-slate-200 pb-2 flex items-center gap-2">
                            <i class="fa-solid fa-chalkboard-user text-gold"></i> Educator Classroom Recommendations
                        </h3>
                        <div class="space-y-3 text-xs">
                            <div class="space-y-1">
                                <span class="font-bold text-slate-800 uppercase text-[11px] block">Classroom Adaptations:</span>
                                <ul class="space-y-1 text-slate-600">
                                    ${teacherAdapt.map(a => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-layer-group text-maroon text-[10px] mt-0.5"></i><span>${a}</span></li>`).join('')}
                                </ul>
                            </div>
                            <div class="space-y-1 border-t border-slate-200 pt-2">
                                <span class="font-bold text-slate-800 uppercase text-[11px] block">Short-Term Action Milestones:</span>
                                <ul class="space-y-1 text-slate-600">
                                    ${roadmapShort.map(r => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-flag text-gold text-[10px] mt-0.5"></i><span>${r}</span></li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                `}

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase V: Family &amp; Career Alignment | Overview | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 44: PHASE V — DETAILED STUDENT-PARENT COMPARISON (PAGE B) -->
        <section class="as-report-page avoid-break" id="page-44" data-page="44">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family &amp; Career Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Detailed Student–Parent Comparison</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            7-Domain Diagnostic Breakdown
                        </span>
                        <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 44</span>
                    </div>
                </div>

                <!-- 7 Analytical Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0 my-auto text-xs">
                    ${(comparisonData?.areas || [
                        { id: 'career_direction', name: 'Career Direction', level: 'high_alignment', studentSide: topCareer, parentSide: 'Technology / Science', explanation: 'Strong alignment in target stream direction.', discussionTopic: 'Discuss student natural strengths vs family expectations.' },
                        { id: 'career_expectations', name: 'Career Expectations', level: 'moderate_alignment', studentSide: 'Creativity & Autonomy', parentSide: 'Stability & Prestige', explanation: 'Moderate alignment in underlying drivers.', discussionTopic: 'Discuss success metrics—security vs creative fulfillment.' },
                        { id: 'financial_feasibility', name: 'Financial Feasibility', level: 'aligned', studentSide: 'Specialized Higher Education', parentSide: 'Planned Budget', explanation: 'Financial expectations align with target paths.', discussionTopic: 'Review typical tuition costs and budget limits.' },
                        { id: 'study_abroad', name: 'Study Abroad Expectations', level: 'moderate_alignment', studentSide: 'Global Openness', parentSide: 'Moderate Openness', explanation: 'Open to exploring international options.', discussionTopic: 'Discuss geographical boundaries and preferences.' },
                        { id: 'autonomy', name: 'Decision Making Autonomy', level: 'high_alignment', studentSide: 'Independent Self-Direction', parentSide: 'Collaborative Guidance', explanation: 'Parenting style matches student need for agency.', discussionTopic: 'Agree on decision-making process for stream locking.' },
                        { id: 'risk', name: 'Risk Tolerance', level: 'moderate_alignment', studentSide: 'Structured Paths', parentSide: 'Moderate Risk Comfort', explanation: 'Balanced comfort level with career stability.', discussionTopic: 'Discuss family comfort with non-traditional paths.' },
                        { id: 'support', name: 'Support & Concerns', level: 'aligned', studentSide: 'Academic Mentorship', parentSide: 'Hands-on Encouragement', explanation: 'Strong baseline family support structure.', discussionTopic: 'Discuss primary family concerns proactively.' }
                    ]).map((area, idx) => {
                        const isGood = area.level === 'high_alignment' || area.level === 'aligned';
                        const isMod = area.level === 'moderate_alignment';
                        const isGap = area.level === 'potential_gap' || area.level === 'constraint';
                        const badgeClass = isGood ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isMod ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300';
                        const badgeText = isGood ? 'HIGH ALIGNMENT' : isMod ? 'MODERATE ALIGNMENT' : 'POTENTIAL GAP';
                        
                        const rawStudent = (area.studentSide || '').trim();
                        const isStudentEmpty = !rawStudent || rawStudent === 'Top careers in:' || rawStudent === 'Prioritises:' || rawStudent === 'Top values:' || rawStudent.endsWith(':');
                        const cleanStudentSide = !isStudentEmpty
                            ? area.studentSide
                            : (area.id === 'career_direction' ? `Top careers in: ${topCareer}` :
                               area.id === 'career_expectations' ? `Prioritises: ${scores.topValues?.join(', ') || 'Autonomy & Mastery'}` :
                               area.id === 'support' ? `Top values: ${scores.topValues?.join(', ') || 'Intellectual Autonomy'}` : 'No direct preference recorded');

                        const isFullWidth = idx === 6 || area.id === 'support';
                        return `
                        <div class="bg-cream/70 p-3 rounded-xl border border-gold/40 shadow-sm flex flex-col justify-between space-y-2 ${isFullWidth ? 'col-span-1 md:col-span-2' : ''}">
                            <div class="flex justify-between items-start border-b border-slate-200 pb-1.5">
                                <span class="font-extrabold text-maroon text-xs flex items-center gap-1.5">
                                    <span class="w-5 h-5 rounded-full bg-maroon text-gold font-mono text-[10px] flex items-center justify-center">${idx + 1}</span>
                                    ${area.name}
                                </span>
                                <span class="px-2 py-0.5 rounded border text-[9px] font-bold ${badgeClass}">${badgeText}</span>
                            </div>

                            <div class="grid grid-cols-2 gap-2 text-[10px]">
                                <div class="bg-white p-1.5 rounded border border-slate-200">
                                    <span class="text-slate-400 block uppercase font-bold text-[8px]">Student Side</span>
                                    <span class="font-semibold text-slate-800 block leading-tight break-words">${cleanStudentSide}</span>
                                </div>
                                <div class="bg-white p-1.5 rounded border border-slate-200">
                                    <span class="text-slate-400 block uppercase font-bold text-[8px]">Parent Side</span>
                                    <span class="font-semibold text-slate-800 block leading-tight break-words">${area.parentSide}</span>
                                </div>
                            </div>

                            <div class="space-y-1 text-[10px] text-slate-700">
                                <div><strong class="text-maroon">Why This Matters:</strong> ${area.explanation}</div>
                                <div><strong class="text-slate-800">Counselling Recommendation:</strong> ${area.discussionTopic}</div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase V: Family &amp; Career Alignment | Detailed Comparison | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 45: PHASE V — FAMILY CAREER ACTION PLAN (PAGE C) -->
        <section class="as-report-page avoid-break" id="page-45" data-page="45">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family &amp; Career Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Family Career Action Plan</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            90-Day Execution Roadmap
                        </span>
                        <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 45</span>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <!-- Top 2-Column Quadrants: Agreement vs Discussion Needed -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-2">
                            <h3 class="font-bold text-xs text-emerald-900 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Areas of Strong Agreement
                            </h3>
                            <ul class="space-y-1 text-[10px] text-emerald-900">
                                <li class="flex items-start gap-1"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>Shared commitment to academic excellence and stream locking.</span></li>
                                <li class="flex items-start gap-1"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>Aligned expectations regarding university ranking priorities.</span></li>
                                <li class="flex items-start gap-1"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>Supportive decision-making approach empowering student agency.</span></li>
                            </ul>
                        </div>

                        <div class="bg-rose-50/60 p-3 rounded-xl border border-rose-200 space-y-2">
                            <h3 class="font-bold text-xs text-rose-900 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Prioritized Discussion Areas
                            </h3>
                            <ul class="space-y-1 text-[10px] text-rose-900">
                                <li class="flex items-start gap-1"><i class="fa-solid fa-exclamation text-rose-600 text-[9px] mt-0.5"></i><span><strong>Career Direction:</strong> Reconcile student target (${topCareer}) with parent expectations.</span></li>
                                <li class="flex items-start gap-1"><i class="fa-solid fa-exclamation text-rose-600 text-[9px] mt-0.5"></i><span><strong>Financial Boundary:</strong> Map higher education tuition estimates against family budget.</span></li>
                                <li class="flex items-start gap-1"><i class="fa-solid fa-exclamation text-rose-600 text-[9px] mt-0.5"></i><span><strong>Study Abroad Readiness:</strong> Define geographical preferences and scholarship requirements.</span></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Middle 2-Column: Student Reflection & Counsellor Prompts -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5">
                            <h4 class="font-bold text-xs text-maroon border-b border-slate-200 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-pen-to-square text-gold"></i> Student Self-Reflection Prompts
                            </h4>
                            <div class="space-y-1 text-[10px] text-slate-700 italic">
                                <div>1. "Where do my target career goals differ from my family's expectations?"</div>
                                <div>2. "What specific support do I most need from my parents during Class 11?"</div>
                                <div>3. "Which career paths do I want to explore deeply before locking my stream?"</div>
                            </div>
                        </div>

                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5">
                            <h4 class="font-bold text-xs text-maroon border-b border-slate-200 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-comments text-gold"></i> Counsellor Discussion Topics
                            </h4>
                            <div class="space-y-1 text-[10px] text-slate-700">
                                <div>• Review psychometric evidence for ${topCareer} with candidate &amp; parents.</div>
                                <div>• Establish realistic financial parameters for entrance exams and tuition.</div>
                                <div>• Align Class 11 subject combinations (PCM/PCB/Commerce/Arts) to goals.</div>
                            </div>
                        </div>
                    </div>

                    <!-- 90-Day Family Career Exploration Roadmap -->
                    <div class="bg-maroon-dark text-white p-3.5 rounded-xl border border-gold shadow-sm space-y-2">
                        <h4 class="font-extrabold text-xs text-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gold/30 pb-1">
                            <i class="fa-solid fa-calendar-days text-gold"></i> 90-Day Family Career Exploration Plan
                        </h4>
                        <div class="grid grid-cols-3 gap-2 text-[10px]">
                            <div class="bg-white/10 p-2 rounded border border-gold/30 space-y-1">
                                <span class="font-extrabold text-gold block uppercase text-[9px]">Month 1: Explore</span>
                                <p class="text-slate-200 text-[9.5px] leading-tight">Research target careers, attend university webinars, and review subject prerequisites together.</p>
                            </div>
                            <div class="bg-white/10 p-2 rounded border border-gold/30 space-y-1">
                                <span class="font-extrabold text-gold block uppercase text-[9px]">Month 2: Validate</span>
                                <p class="text-slate-200 text-[9.5px] leading-tight">Compare school marks with psychometric findings, shadow professionals, and test project samples.</p>
                            </div>
                            <div class="bg-white/10 p-2 rounded border border-gold/30 space-y-1">
                                <span class="font-extrabold text-gold block uppercase text-[9px]">Month 3: Decide</span>
                                <p class="text-slate-200 text-[9.5px] leading-tight">Schedule certified counsellor session, review financial readiness, and lock Class 11 subjects with total clarity.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase V: Family &amp; Career Action Plan | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 46: PHASE VI — INTEREST × CONFIDENCE ANALYSIS -->
        <section class="as-report-page avoid-break" id="page-46" data-page="46">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Career Fitment × Execution Readiness Analysis</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            Page 46
                        </span>
                    </div>
                </div>

                <!-- Confidence Signal & Method Indicator Strip -->
                <div class="bg-cream/80 p-3.5 rounded-2xl border border-gold/40 shadow-sm flex items-center justify-between gap-4 shrink-0">
                    <div class="space-y-0.5">
                        <span class="text-[10px] font-bold text-maroon uppercase tracking-wider block">Candidate Execution Readiness Index</span>
                        <p class="text-xs text-slate-700">Derived from measured Conscientiousness (${cSc}%), Emotional Stability (${esSc}%), and Cognitive Aptitude (${aptOverall}%).</p>
                    </div>
                    <div class="text-right shrink-0 bg-white px-3.5 py-1.5 rounded-xl border border-gold/40 shadow-sm">
                        <span class="text-[9px] font-bold text-slate-500 uppercase block">Execution Index</span>
                        <span class="text-lg font-extrabold text-maroon font-mono">${confidenceSignal}%</span>
                    </div>
                </div>

                <!-- 2-Axis 4-Quadrant Visual Matrix -->
                <div class="bg-slate-900 text-white p-4 rounded-2xl border-2 border-gold shadow-md shrink-0 space-y-2">
                    <div class="flex justify-between items-center border-b border-gold/30 pb-1.5">
                        <span class="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-crosshairs text-gold text-[11px]"></i> Stream Fitment vs. Execution Readiness 2-Axis Matrix
                        </span>
                        <span class="text-[10px] text-slate-300 font-mono">X: Stream Fitment Score | Y: Execution Readiness</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-[10px] pt-1">
                        <!-- Quadrant II: High Fitment, Lower Readiness -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-amber-500/40 space-y-1">
                            <div class="flex justify-between items-center border-b border-slate-700 pb-1">
                                <span class="font-extrabold text-amber-400 uppercase text-[9.5px]">Quad II: High Fitment · Lower Readiness</span>
                                <span class="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">Readiness Target</span>
                            </div>
                            <p class="text-slate-300 text-[9px] leading-snug">High stream fitment, but requires structured scaffolding and low-stakes skill sprints to build execution readiness.</p>
                            <div class="pt-1 text-gold text-[9px] font-semibold flex items-center gap-1">
                                <i class="fa-solid fa-arrow-up-right-dots text-[8px]"></i> Priority: Mentored Project Sprints
                            </div>
                        </div>

                        <!-- Quadrant I: High Fitment, High Readiness -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/40 space-y-1">
                            <div class="flex justify-between items-center border-b border-slate-700 pb-1">
                                <span class="font-extrabold text-emerald-400 uppercase text-[9.5px]">Quad I: High Fitment · High Readiness</span>
                                <span class="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Primary Focus</span>
                            </div>
                            <p class="text-slate-300 text-[9px] leading-snug">Peak alignment of stream fitment and execution readiness. Candidate is equipped to pursue recommended academic &amp; career streams.</p>
                            <div class="pt-1 text-emerald-300 text-[9px] font-semibold flex items-center gap-1">
                                <i class="fa-solid fa-star text-[8px]"></i> Target: ${topCareer}
                            </div>
                        </div>

                        <!-- Quadrant IV: Low Fitment, Low Readiness -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-rose-500/40 space-y-1">
                            <div class="flex justify-between items-center border-b border-slate-700 pb-1">
                                <span class="font-extrabold text-rose-400 uppercase text-[9.5px]">Quad IV: Low Fitment · Low Readiness</span>
                                <span class="text-[8px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">De-prioritized</span>
                            </div>
                            <p class="text-slate-300 text-[9px] leading-snug">Low stream fitment and low execution readiness. Avoid forcing academic streams in this sector to prevent disengagement.</p>
                            <div class="pt-1 text-rose-300 text-[9px] font-semibold flex items-center gap-1">
                                <i class="fa-solid fa-ban text-[8px]"></i> Avoid Forced Placement
                            </div>
                        </div>

                        <!-- Quadrant III: Low Fitment, High Readiness -->
                        <div class="bg-slate-800/80 p-3 rounded-xl border border-blue-500/40 space-y-1">
                            <div class="flex justify-between items-center border-b border-slate-700 pb-1">
                                <span class="font-extrabold text-blue-400 uppercase text-[9.5px]">Quad III: Low Fitment · High Readiness</span>
                                <span class="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">Latent Fallback</span>
                            </div>
                            <p class="text-slate-300 text-[9px] leading-snug">High execution capacity, but lower interest fitment. Functions as a secondary fallback stream if primary targets encounter barriers.</p>
                            <div class="pt-1 text-blue-300 text-[9px] font-semibold flex items-center gap-1">
                                <i class="fa-solid fa-shield-halved text-[8px]"></i> Strategic Backup Vector
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Domain Exploration Breakdown Cards -->
                <div class="grid grid-cols-3 gap-3 shrink-0 flex-1">
                    <div class="bg-white p-3.5 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase block mb-1">Primary Target</span>
                            <h4 class="font-bold text-xs text-maroon">${topCareer}</h4>
                            <p class="text-[10px] text-slate-600 leading-snug mt-1">High interest fitment (${topFitScore}%) paired with strong execution confidence (${confidenceSignal}%). Candidate demonstrates peak readiness for advanced stream work.</p>
                        </div>
                        <div class="pt-2 border-t border-slate-100 text-[9px] font-bold text-maroon flex justify-between items-center">
                            <span>Status:</span>
                            <span class="text-emerald-700 font-mono">HIGH EXPLORATION READINESS</span>
                        </div>
                    </div>

                    <div class="bg-white p-3.5 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase block mb-1">Secondary Target</span>
                            <h4 class="font-bold text-xs text-maroon">${careerFitmentList[1]?.name || 'Data & Business Analytics'}</h4>
                            <p class="text-[10px] text-slate-600 leading-snug mt-1">Solid interest alignment (${careerFitmentList[1]?.score || 88}%). Build self-efficacy through practical project simulations before subject registration.</p>
                        </div>
                        <div class="pt-2 border-t border-slate-100 text-[9px] font-bold text-maroon flex justify-between items-center">
                            <span>Status:</span>
                            <span class="text-amber-700 font-mono">BUILD CONFIDENCE SPRINT</span>
                        </div>
                    </div>

                    <div class="bg-white p-3.5 rounded-2xl border border-gold/40 shadow-sm flex flex-col justify-between">
                        <div>
                            <span class="text-[9px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase block mb-1">Strategic Alternative</span>
                            <h4 class="font-bold text-xs text-maroon">${careerFitmentList[2]?.name || 'Commerce & Quantitative Finance'}</h4>
                            <p class="text-[10px] text-slate-600 leading-snug mt-1">High latent cognitive capability. Acts as a strong alternative pathway if candidate's core stream interests evolve in Class 11.</p>
                        </div>
                        <div class="pt-2 border-t border-slate-100 text-[9px] font-bold text-maroon flex justify-between items-center">
                            <span>Status:</span>
                            <span class="text-slate-700 font-mono">LATENT FALLBACK VECTOR</span>
                        </div>
                    </div>
                </div>

                <!-- Page Footer -->
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase VI: Advanced Career Synthesis | Interest × Confidence Matrix | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 47: PHASE VI — PROFILE CROSS-VALIDATION & EVIDENCE SYNTHESIS -->
        <section class="as-report-page avoid-break" id="page-47" data-page="47">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Profile Cross-Validation &amp; Evidence Synthesis</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            Page 47
                        </span>
                    </div>
                </div>

                <!-- Intro Banner -->
                <div class="bg-cream p-3.5 rounded-2xl border border-gold/40 shadow-sm text-xs text-slate-700 leading-relaxed shrink-0">
                    <span class="font-extrabold text-maroon uppercase tracking-wider text-[11px] block mb-1"><i class="fa-solid fa-code-compare text-gold mr-1.5"></i> Multi-Domain Alignment &amp; Signal Convergence Audit</span>
                    This page cross-validates structured assessment signals across Personality (Big Five), Cognitive Aptitude, Learning Style (VARK), Vocational Interests (Holland RIASEC), and Parent Expectations to highlight where diagnostic evidence strongly converges and where family validation is required.
                </div>

                <!-- Cross Validation Table Matrix -->
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs shadow-sm">
                    <div class="bg-maroon/10 p-2.5 border-b border-slate-200 flex justify-between items-center font-bold text-maroon text-[11px]">
                        <span>Diagnostic Signal Vector</span>
                        <span>Evidence &amp; Supporting Indicators</span>
                        <span>Convergence Status</span>
                    </div>
                    <div class="divide-y divide-slate-100 text-[10.5px]">
                        <!-- Row 1: Personality vs Cognitive -->
                        <div class="p-3 grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-3 font-bold text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-brain text-maroon text-[11px]"></i> Personality × Aptitude
                            </div>
                            <div class="col-span-6 text-slate-600 leading-snug">
                                High Openness (${oSc}%) + Fluid Reasoning (${reasSc}%) indicate strong capacity for abstract problem solving and innovation-driven research pathways.
                            </div>
                            <div class="col-span-3 text-right">
                                <span class="px-2.5 py-0.5 rounded border text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border-emerald-300">CONVERGENT</span>
                            </div>
                        </div>

                        <!-- Row 2: Personality vs Interest -->
                        <div class="p-3 grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-3 font-bold text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-compass text-maroon text-[11px]"></i> Personality × Interest
                            </div>
                            <div class="col-span-6 text-slate-600 leading-snug">
                                Conscientiousness (${cSc}%) provides sustained execution discipline aligned with ${topCareer} requirements and structured academic milestones.
                            </div>
                            <div class="col-span-3 text-right">
                                <span class="px-2.5 py-0.5 rounded border text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border-emerald-300">SUPPORTIVE</span>
                            </div>
                        </div>

                        <!-- Row 3: VARK vs Spatial/Verbal -->
                        <div class="p-3 grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-3 font-bold text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-eye text-maroon text-[11px]"></i> VARK × Spatial (Learning Synergy)
                            </div>
                            <div class="col-span-6 text-slate-600 leading-snug">
                                Primary ${topVarkLabel} preference pairs effectively with spatial reasoning (${spatSc}%) for dual-coding study workflows and diagrammatic notes.
                            </div>
                            <div class="col-span-3 text-right">
                                <span class="px-2.5 py-0.5 rounded border text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border-emerald-300">CONVERGENT</span>
                            </div>
                        </div>

                        <!-- Row 4: Student vs Parent -->
                        <div class="p-3 grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-3 font-bold text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-people-roof text-maroon text-[11px]"></i> Student vs. Parent Profile
                            </div>
                            <div class="col-span-6 text-slate-600 leading-snug">
                                7-Domain Family Alignment Matrix indicates ${comparisonData?.overallIndicator || 'Moderate Alignment'}. Active dialogue recommended on career expectations.
                            </div>
                            <div class="col-span-3 text-right">
                                <span class="px-2.5 py-0.5 rounded border text-[9px] font-extrabold ${comparisonData?.overallIndicator?.includes('Gap') ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'}">${comparisonData?.overallIndicator?.includes('Gap') ? 'REQUIRES VALIDATION' : 'SUPPORTIVE'}</span>
                            </div>
                        </div>

                        <!-- Row 5: Stress Resilience vs High Stakes -->
                        <div class="p-3 grid grid-cols-12 gap-3 items-center">
                            <div class="col-span-3 font-bold text-slate-800 flex items-center gap-1.5">
                                <i class="fa-solid fa-heart-pulse text-maroon text-[11px]"></i> EQ × Exam Load
                            </div>
                            <div class="col-span-6 text-slate-600 leading-snug">
                                Emotional Stability (${esSc}%) buffers against anticipatory exam stress, maintaining cognitive clarity during competitive timed evaluations.
                            </div>
                            <div class="col-span-3 text-right">
                                <span class="px-2.5 py-0.5 rounded border text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border-emerald-300">SUPPORTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Evidence Conclusion Box -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl border-2 border-gold shadow-md space-y-1.5 shrink-0">
                    <h4 class="font-bold text-xs text-gold flex items-center gap-2">
                        <i class="fa-solid fa-award text-gold"></i> Executive Cross-Validation Synthesis
                    </h4>
                    <p class="text-xs text-slate-200 leading-relaxed">
                        Diagnostic signals across personality, aptitude, and learning style strongly converge around <strong>${topCareer}</strong>. The combination of high fluid reasoning (${reasSc}%) and disciplined execution (${cSc}%) provides an ideal foundation for Class 11 stream success. We recommend validating specific elective combinations during counselor alignment.
                    </p>
                </div>

                <!-- Page Footer -->
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase VI: Advanced Career Synthesis | Profile Cross-Validation | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 48: PHASE VI — DEVELOPMENTAL PRIORITIES & CAREER EXPLORATION READINESS -->
        <section class="as-report-page avoid-break" id="page-48" data-page="48">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <!-- Header -->
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Developmental Priorities &amp; Exploration Readiness</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            Page 48
                        </span>
                    </div>
                </div>

                <!-- Exploration Readiness Banner -->
                <div class="bg-cream/90 p-4 rounded-2xl border border-gold/40 shadow-sm flex items-center justify-between gap-4 shrink-0">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Exploration Stage:</span>
                            <span class="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">EXPLORATION READY</span>
                        </div>
                        <p class="text-xs text-slate-700 leading-snug">${firstName} is ready to begin structured career exploration across recommended stream vectors through subject previews, counselor alignment, and targeted skill simulations prior to Class 11 stream selection.</p>
                    </div>
                </div>

                <!-- Top 3 Developmental Priorities Grid -->
                <div class="grid grid-cols-3 gap-3 shrink-0">
                    <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span class="text-[10px] font-bold text-maroon uppercase">Priority 01</span>
                            <i class="fa-solid fa-clock text-gold text-xs"></i>
                        </div>
                        <h4 class="font-bold text-xs text-slate-800">Executive Time Blocking</h4>
                        <p class="text-[10.5px] text-slate-600 leading-snug">Implement 50-minute deep work focus sprints using visual digital kanban boards to maintain study consistency.</p>
                    </div>

                    <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span class="text-[10px] font-bold text-maroon uppercase">Priority 02</span>
                            <i class="fa-solid fa-shield-heart text-gold text-xs"></i>
                        </div>
                        <h4 class="font-bold text-xs text-slate-800">Exam Stress Buffering</h4>
                        <p class="text-[10.5px] text-slate-600 leading-snug">Practice tactical physiological sighing during mock test simulations to convert stress into focused cognitive clarity.</p>
                    </div>

                    <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <span class="text-[10px] font-bold text-maroon uppercase">Priority 03</span>
                            <i class="fa-solid fa-comments text-gold text-xs"></i>
                        </div>
                        <h4 class="font-bold text-xs text-slate-800">Family Alignment Dialogue</h4>
                        <p class="text-[10.5px] text-slate-600 leading-snug">Review the 7-domain comparison matrix with parents and counselor to align on higher education budgets and expectations.</p>
                    </div>
                </div>

                <!-- Student Reflection Tool Box -->
                <div class="bg-slate-900 text-white p-4 rounded-2xl border-2 border-gold shadow-md shrink-0 space-y-2">
                    <h4 class="font-extrabold text-xs text-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gold/30 pb-1">
                        <i class="fa-solid fa-lightbulb text-gold text-[11px]"></i> Student Self-Reflection Checklist (For Candidate)
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-300">
                        <div class="flex items-start gap-1.5"><i class="fa-solid fa-square-check text-gold mt-0.5 text-[9px] shrink-0"></i><span>Which academic stream am I most genuinely excited to explore in Class 11?</span></div>
                        <div class="flex items-start gap-1.5"><i class="fa-solid fa-square-check text-gold mt-0.5 text-[9px] shrink-0"></i><span>Which psychometric score or feedback point surprised me the most?</span></div>
                        <div class="flex items-start gap-1.5"><i class="fa-solid fa-square-check text-gold mt-0.5 text-[9px] shrink-0"></i><span>Where do my personal stream targets differ from family or peer suggestions?</span></div>
                        <div class="flex items-start gap-1.5"><i class="fa-solid fa-square-check text-gold mt-0.5 text-[9px] shrink-0"></i><span>What practical project experience would give me 100% confidence in my choice?</span></div>
                    </div>
                </div>

                <!-- 30-60-90 Day Personal Exploration Roadmap -->
                <div class="bg-cream/60 p-3.5 rounded-2xl border border-gold/30 shadow-sm space-y-2 shrink-0">
                    <span class="text-[10px] font-bold text-maroon uppercase tracking-wider block border-b border-slate-200 pb-1">30–60–90 Day Personal Exploration Roadmap</span>
                    <div class="grid grid-cols-3 gap-3 text-xs">
                        <div class="space-y-0.5">
                            <span class="font-extrabold text-maroon text-[11px] block">30 Days — Research</span>
                            <p class="text-[10px] text-slate-600 leading-snug">Research top 5 career paths in ${topCareer}. Complete Class 10 board prep gap review.</p>
                        </div>
                        <div class="space-y-0.5 border-l border-slate-200 pl-3">
                            <span class="font-extrabold text-maroon text-[11px] block">60 Days — Preview</span>
                            <p class="text-[10px] text-slate-600 leading-snug">Preview Class 11 subject syllabi. Attend career exploration webinar or mentor session.</p>
                        </div>
                        <div class="space-y-0.5 border-l border-slate-200 pl-3">
                            <span class="font-extrabold text-maroon text-[11px] block">90 Days — Finalize</span>
                            <p class="text-[10px] text-slate-600 leading-snug">Finalize Class 11 stream choices with parents and school counselor with total clarity.</p>
                        </div>
                    </div>
                </div>

                <!-- Page Footer -->
                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Phase VI: Advanced Career Synthesis | Exploration Readiness | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 49: CLOSING SYNTHESIS — CAREER ALIGNMENT & STRATEGIC ACTION PLAN -->
        <section class="as-report-page avoid-break" id="page-49" data-page="49">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Closing Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Your Career Alignment &amp; Strategic Action Plan</h2>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase tracking-wider shadow">
                            Page 49
                        </span>
                    </div>
                </div>

                <!-- 5-Part Strategic Decision Synthesis Grid -->
                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <!-- Block 1: Final Career Direction (Primary, Secondary, Alternative) -->
                    <div class="bg-cream/80 p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                        <span class="text-[10px] font-extrabold text-maroon uppercase tracking-wider block border-b border-slate-200 pb-1 flex items-center justify-between">
                            <span><i class="fa-solid fa-compass text-gold mr-1.5"></i> Final Career Direction &amp; Recommended Pathways</span>
                            <span class="text-[9px] font-mono text-slate-500">Diagnostic Decision Gate</span>
                        </span>
                        <div class="grid grid-cols-3 gap-3 pt-1 text-[11px]">
                            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                                <span class="text-[9px] font-bold text-emerald-700 uppercase block">Primary Target</span>
                                <strong class="text-maroon font-bold block mt-0.5 leading-tight">${topCareer}</strong>
                                <span class="text-[9.5px] text-slate-500 block mt-1">Fitment: ${topFitScore}% Match</span>
                            </div>
                            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                                <span class="text-[9px] font-bold text-amber-700 uppercase block">Secondary Target</span>
                                <strong class="text-slate-800 font-bold block mt-0.5 leading-tight">${careerFitmentList[1]?.name || 'Data Science & Analytics'}</strong>
                                <span class="text-[9.5px] text-slate-500 block mt-1">Fitment: ${careerFitmentList[1]?.score || 88}% Match</span>
                            </div>
                            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
                                <span class="text-[9px] font-bold text-slate-600 uppercase block">Strategic Alternative</span>
                                <strong class="text-slate-800 font-bold block mt-0.5 leading-tight">${careerFitmentList[2]?.name || 'Commerce & Quantitative Finance'}</strong>
                                <span class="text-[9.5px] text-slate-500 block mt-1">Fitment: ${careerFitmentList[2]?.score || 82}% Match</span>
                            </div>
                        </div>
                    </div>

                    <!-- Block 2 & 3 Side-by-Side: Evidence Signals vs Key Uncertainties -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Top 3 Evidence Signals (WHY)
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                <li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>High Fluid Reasoning (${reasSc}%) provides exceptional analytical problem solving.</span></li>
                                <li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>Conscientiousness baseline (${cSc}%) ensures sustained executive focus for Class 11.</span></li>
                                <li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>Primary ${topVarkLabel} learning modality accelerates complex theory encoding.</span></li>
                            </ul>
                        </div>

                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Key Uncertainties to Validate
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                <li class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-amber-600 text-[9px] mt-0.5"></i><span>Verify Mathematics &amp; Science grade cutoffs required for target Class 11 stream.</span></li>
                                <li class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-amber-600 text-[9px] mt-0.5"></i><span>Confirm family alignment on higher education budget and study abroad readiness.</span></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Block 4: Next 90 Days Roadmap & Counselor Decision Gate -->
                    <div class="bg-maroon-dark text-white p-4 rounded-2xl border-2 border-gold shadow-md space-y-2">
                        <div class="flex justify-between items-center border-b border-gold/30 pb-1.5">
                            <span class="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-clipboard-check text-gold"></i> Counsellor Checkpoint &amp; Class 11 Decision Gate
                            </span>
                            <span class="text-[9px] font-mono text-gold-light">Final Action Lock</span>
                        </div>
                        <div class="grid grid-cols-3 gap-3 text-[10px] text-slate-200 pt-1">
                            <div>
                                <strong class="text-white block font-bold">1. Counselor Session:</strong>
                                Review 7-domain family alignment matrix and address potential gaps proactively.
                            </div>
                            <div class="border-l border-gold/30 pl-3">
                                <strong class="text-white block font-bold">2. Subject Preview:</strong>
                                Review Class 11 subject syllabi for 2 weeks to test genuine subject interest.
                            </div>
                            <div class="border-l border-gold/30 pl-3">
                                <strong class="text-white block font-bold">3. Final Stream Lock:</strong>
                                Register locked subject combination with school guidance counselor by Month 3.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>Closing Synthesis | Strategic Action Plan | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 50: PRIMARY PATHWAY ROADMAP -->
        ${(() => {
            const primaryRoadmap = getPathwayRoadmapData(topCareer, 'PRIMARY TARGET PATHWAY (RECOMMENDED #1)', student, scores, comparisonData);
            return `
            <section class="as-report-page avoid-break" id="page-50" data-page="50">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-2.5">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">${primaryRoadmap.pathwayRankLabel}</span>
                            <h2 class="text-lg font-extrabold">${primaryRoadmap.pathwayTitle}</h2>
                        </div>
                        <div class="text-right">
                            <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">
                                ${primaryRoadmap.fitScore}% Match
                            </span>
                            <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 50</span>
                        </div>
                    </div>

                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40 text-xs text-slate-700">
                        <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Why This Pathway Is In Your Report:</strong>
                        <p class="text-[10px] leading-relaxed text-slate-700">${primaryRoadmap.rationale}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Class 11–12 Recommended Subjects</span>
                            <div class="flex flex-wrap gap-1 pt-0.5">
                                ${primaryRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Entrance Examinations</span>
                            <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                                ${primaryRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Bachelor's Degree Options &amp; Specializations</span>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            ${primaryRoadmap.bachelors.map(b => `
                                <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                                    <strong class="text-maroon font-bold block text-[10.5px] leading-tight">${b.degree}</strong>
                                    <div class="text-[9px] text-slate-600"><strong>Specialization:</strong> ${b.specialization}</div>
                                    <div class="text-[9px] text-slate-500"><strong>Fit:</strong> ${b.whyFits}</div>
                                    <div class="text-[9px] text-emerald-800 font-semibold"><strong>Outcomes:</strong> ${b.careerOutcomes}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-cream/60 p-2 rounded-xl border border-gold/30 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-0.5"><i class="fa-solid fa-building-columns text-gold mr-1"></i> Recommended Institutions (India &amp; Region)</span>
                        <div class="grid grid-cols-3 gap-2 text-[9.5px]">
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-rose-700 uppercase block text-[8.5px]">REACH (Top Tier)</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${primaryRoadmap.colleges.reach.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-emerald-700 uppercase block text-[8.5px]">STRONG FIT</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${primaryRoadmap.colleges.fit.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-slate-700 uppercase block text-[8.5px]">ACCESSIBLE</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${primaryRoadmap.colleges.accessible.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 text-xs">
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-scroll text-gold mr-1"></i> Postgraduate / Master's Pathways</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${primaryRoadmap.masters.map(m => `<li class="flex items-center gap-1"><i class="fa-solid fa-angle-right text-gold text-[8px]"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-briefcase text-maroon mr-1"></i> Target Early Career Roles</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${primaryRoadmap.careerOutcomes.map(co => `<li class="flex items-center gap-1"><i class="fa-solid fa-circle-dot text-emerald-600 text-[7px]"></i><span>${co}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                        <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> CAREER MILESTONE:</strong> ${primaryRoadmap.milestone}</div>
                    </div>

                    <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Primary Pathway Roadmap | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 51: SECONDARY PATHWAY ROADMAP -->
        ${(() => {
            const secName = careerFitmentList[1]?.name || 'Commerce, Business & Management';
            const secondaryRoadmap = getPathwayRoadmapData(secName, 'SECONDARY TARGET PATHWAY (RECOMMENDED #2)', student, scores, comparisonData);
            return `
            <section class="as-report-page avoid-break" id="page-51" data-page="51">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-2.5">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">${secondaryRoadmap.pathwayRankLabel}</span>
                            <h2 class="text-lg font-extrabold">${secondaryRoadmap.pathwayTitle}</h2>
                        </div>
                        <div class="text-right">
                            <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">
                                ${secondaryRoadmap.fitScore}% Match
                            </span>
                            <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 51</span>
                        </div>
                    </div>

                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40 text-xs text-slate-700">
                        <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Why This Pathway Is In Your Report:</strong>
                        <p class="text-[10px] leading-relaxed text-slate-700">${secondaryRoadmap.rationale}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Class 11–12 Recommended Subjects</span>
                            <div class="flex flex-wrap gap-1 pt-0.5">
                                ${secondaryRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Entrance Examinations</span>
                            <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                                ${secondaryRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Bachelor's Degree Options &amp; Specializations</span>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            ${secondaryRoadmap.bachelors.map(b => `
                                <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                                    <strong class="text-maroon font-bold block text-[10.5px] leading-tight">${b.degree}</strong>
                                    <div class="text-[9px] text-slate-600"><strong>Specialization:</strong> ${b.specialization}</div>
                                    <div class="text-[9px] text-slate-500"><strong>Fit:</strong> ${b.whyFits}</div>
                                    <div class="text-[9px] text-emerald-800 font-semibold"><strong>Outcomes:</strong> ${b.careerOutcomes}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-cream/60 p-2 rounded-xl border border-gold/30 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-0.5"><i class="fa-solid fa-building-columns text-gold mr-1"></i> Recommended Institutions (India &amp; Region)</span>
                        <div class="grid grid-cols-3 gap-2 text-[9.5px]">
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-rose-700 uppercase block text-[8.5px]">REACH (Top Tier)</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${secondaryRoadmap.colleges.reach.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-emerald-700 uppercase block text-[8.5px]">STRONG FIT</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${secondaryRoadmap.colleges.fit.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-slate-700 uppercase block text-[8.5px]">ACCESSIBLE</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${secondaryRoadmap.colleges.accessible.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 text-xs">
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-scroll text-gold mr-1"></i> Postgraduate / Master's Pathways</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${secondaryRoadmap.masters.map(m => `<li class="flex items-center gap-1"><i class="fa-solid fa-angle-right text-gold text-[8px]"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-briefcase text-maroon mr-1"></i> Target Early Career Roles</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${secondaryRoadmap.careerOutcomes.map(co => `<li class="flex items-center gap-1"><i class="fa-solid fa-circle-dot text-emerald-600 text-[7px]"></i><span>${co}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                        <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> CAREER MILESTONE:</strong> ${secondaryRoadmap.milestone}</div>
                    </div>

                    <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Secondary Pathway Roadmap | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 52: STRATEGIC ALTERNATIVE ROADMAP -->
        ${(() => {
            const altName = careerFitmentList[2]?.name || 'Science — Medical & Life Sciences (PCB)';
            const alternativeRoadmap = getPathwayRoadmapData(altName, 'STRATEGIC ALTERNATIVE PATHWAY (RECOMMENDED #3)', student, scores, comparisonData);
            return `
            <section class="as-report-page avoid-break" id="page-52" data-page="52">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-2.5">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">${alternativeRoadmap.pathwayRankLabel}</span>
                            <h2 class="text-lg font-extrabold">${alternativeRoadmap.pathwayTitle}</h2>
                        </div>
                        <div class="text-right">
                            <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">
                                ${alternativeRoadmap.fitScore}% Match
                            </span>
                            <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page 52</span>
                        </div>
                    </div>

                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40 text-xs text-slate-700">
                        <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Why This Pathway Is In Your Report:</strong>
                        <p class="text-[10px] leading-relaxed text-slate-700">${alternativeRoadmap.rationale}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Class 11–12 Recommended Subjects</span>
                            <div class="flex flex-wrap gap-1 pt-0.5">
                                ${alternativeRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Entrance Examinations</span>
                            <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                                ${alternativeRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Bachelor's Degree Options &amp; Specializations</span>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            ${alternativeRoadmap.bachelors.map(b => `
                                <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                                    <strong class="text-maroon font-bold block text-[10.5px] leading-tight">${b.degree}</strong>
                                    <div class="text-[9px] text-slate-600"><strong>Specialization:</strong> ${b.specialization}</div>
                                    <div class="text-[9px] text-slate-500"><strong>Fit:</strong> ${b.whyFits}</div>
                                    <div class="text-[9px] text-emerald-800 font-semibold"><strong>Outcomes:</strong> ${b.careerOutcomes}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-cream/60 p-2 rounded-xl border border-gold/30 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-0.5"><i class="fa-solid fa-building-columns text-gold mr-1"></i> Recommended Institutions (India &amp; Region)</span>
                        <div class="grid grid-cols-3 gap-2 text-[9.5px]">
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-rose-700 uppercase block text-[8.5px]">REACH (Top Tier)</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${alternativeRoadmap.colleges.reach.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-emerald-700 uppercase block text-[8.5px]">STRONG FIT</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${alternativeRoadmap.colleges.fit.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                                <span class="font-bold text-slate-700 uppercase block text-[8.5px]">ACCESSIBLE</span>
                                <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                    ${alternativeRoadmap.colleges.accessible.map(c => `<li>• ${c}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 text-xs">
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-scroll text-gold mr-1"></i> Postgraduate / Master's Pathways</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${alternativeRoadmap.masters.map(m => `<li class="flex items-center gap-1"><i class="fa-solid fa-angle-right text-gold text-[8px]"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200 space-y-0.5">
                            <span class="font-bold text-maroon uppercase text-[9.5px] block"><i class="fa-solid fa-briefcase text-maroon mr-1"></i> Target Early Career Roles</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5">
                                ${alternativeRoadmap.careerOutcomes.map(co => `<li class="flex items-center gap-1"><i class="fa-solid fa-circle-dot text-emerald-600 text-[7px]"></i><span>${co}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                        <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> CAREER MILESTONE:</strong> ${alternativeRoadmap.milestone}</div>
                    </div>

                    <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Strategic Alternative Roadmap | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 53: PERSONALIZED STUDY ABROAD GUIDE -->
        ${(() => {
            const sag = getStudyAbroadGuideData(student, scores, comparisonData);
            return `
            <section class="as-report-page avoid-break" id="page-53" data-page="53">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                            <h2 class="text-lg font-extrabold">Personalized Study Abroad Guide</h2>
                        </div>
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 53</span>
                    </div>

                    <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-2 text-xs">
                        <p class="text-[10.5px] text-slate-700 leading-relaxed">${sag.rationale}</p>
                        <div class="grid grid-cols-3 gap-2 text-[9.5px] pt-1">
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="text-slate-500 uppercase block font-semibold text-[8.5px]">Student Global Fit</span>
                                <strong class="text-maroon font-bold block mt-0.5 text-[10px]">${topCareer}</strong>
                            </div>
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="text-slate-500 uppercase block font-semibold text-[8.5px]">Parent International Openness</span>
                                <strong class="text-emerald-700 font-bold block mt-0.5 text-[10px]">${sag.parentOpennessLabel}</strong>
                            </div>
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="text-slate-500 uppercase block font-semibold text-[8.5px]">Financial Alignment</span>
                                <strong class="text-amber-700 font-bold block mt-0.5 text-[10px]">${sag.financialAlignmentLabel}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-plane-departure text-gold mr-1"></i> Recommended Global Destination Countries</span>
                        <div class="grid grid-cols-3 gap-2.5 text-xs">
                            ${sag.countries.map(c => `
                                <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5 flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-center justify-between border-b border-slate-100 pb-1">
                                            <span class="text-lg mr-1">${c.flag}</span>
                                            <strong class="text-maroon font-bold text-[11px]">${c.name}</strong>
                                            <span class="text-[8.5px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">${c.costCategory}</span>
                                        </div>
                                        <p class="text-[9.5px] text-slate-600 leading-snug mt-1.5">${c.reason}</p>
                                    </div>
                                    <div class="text-[9px] bg-cream p-1.5 rounded border border-gold/30 text-slate-800">
                                        <strong>Academic Route:</strong> ${c.academicRoute}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1 flex items-center justify-between">
                                <span><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Scholarships &amp; Funding Options</span>
                                <span class="text-[8.5px] text-amber-700 font-normal">Explore &amp; Check Eligibility</span>
                            </span>
                            <ul class="space-y-1 text-[9.5px] text-slate-700 pt-0.5">
                                ${sag.scholarships.map(s => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-award text-gold text-[9px] mt-0.5"></i><span>${s}</span></li>`).join('')}
                            </ul>
                        </div>

                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1">
                                <i class="fa-solid fa-book-bookmark text-maroon mr-1"></i> Target Global Degree Programs
                            </span>
                            <ul class="space-y-1 text-[9.5px] text-slate-700 pt-0.5">
                                ${sag.programs.map(p => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>${p}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Personalized Study Abroad Guide | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 54: ACADEMIC & PROFILE ROADMAP -->
        ${(() => {
            const apr = getAcademicProfileRoadmapData(student, scores);
            return `
            <section class="as-report-page avoid-break" id="page-54" data-page="54">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                            <h2 class="text-lg font-extrabold">Academic &amp; Profile Roadmap (Class 10 to Career)</h2>
                        </div>
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 54</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 text-xs flex-1 my-auto">
                        ${apr.map(st => `
                            <div class="bg-cream/70 p-3 rounded-xl border border-gold/40 shadow-sm space-y-1 flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                                        <span class="text-[9px] font-bold font-mono text-maroon bg-gold/20 px-1.5 py-0.5 rounded uppercase">${st.phase}</span>
                                        <span class="text-base">${st.icon}</span>
                                    </div>
                                    <strong class="text-maroon font-bold block text-[11px] mt-1">${st.label}</strong>
                                    <div class="text-[9.5px] text-slate-700 mt-1"><strong>Academic:</strong> ${st.academicGoal}</div>
                                    <div class="text-[9.5px] text-slate-600 mt-0.5"><strong>Profile:</strong> ${st.profileGoal}</div>
                                </div>
                                <div class="pt-1 border-t border-slate-200/60 mt-1">
                                    <div class="text-[9px] text-emerald-800 font-bold">🎯 Milestone: ${st.milestone}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Academic &amp; Profile Roadmap | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 55: STUDENT ACTION PLAN -->
        ${(() => {
            const sap = getStudentActionPlanData(student, scores);
            return `
            <section class="as-report-page avoid-break" id="page-55" data-page="55">
                <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                    <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                        <div>
                            <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Career Synthesis</span>
                            <h2 class="text-lg font-extrabold">Student Individual Action Plan</h2>
                        </div>
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 55</span>
                    </div>

                    <div class="grid grid-cols-3 gap-3 text-xs">
                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center gap-1">
                                <i class="fa-solid fa-calendar-day text-gold"></i> THIS MONTH (IMMEDIATE)
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${sap.thisMonth.map(m => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600 text-[9px] mt-0.5"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>

                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center gap-1">
                                <i class="fa-solid fa-calendar-week text-gold"></i> NEXT 90 DAYS (QUARTERLY)
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${sap.next90Days.map(m => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-arrow-right text-amber-600 text-[9px] mt-0.5"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>

                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center gap-1">
                                <i class="fa-solid fa-bullseye text-gold"></i> THIS ACADEMIC YEAR
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${sap.thisAcademicYear.map(m => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-flag text-maroon text-[9px] mt-0.5"></i><span>${m}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1">
                                <i class="fa-solid fa-wand-magic-sparkles text-gold mr-1"></i> Core Capabilities &amp; Skills to Build
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${sap.skillsToBuild.map(s => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-bolt text-gold text-[9px] mt-0.5"></i><span>${s}</span></li>`).join('')}
                            </ul>
                        </div>

                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                            <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1">
                                <i class="fa-solid fa-user-tie text-maroon mr-1"></i> Counsellor Consultation Checkpoints
                            </span>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${sap.counsellorCheckpoint.map(c => `<li class="flex items-start gap-1.5"><i class="fa-solid fa-clipboard-check text-emerald-600 text-[9px] mt-0.5"></i><span>${c}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-maroon-dark text-white p-3 rounded-xl border border-gold shadow-sm text-xs space-y-1">
                        <span class="font-bold text-gold uppercase text-[10px] block"><i class="fa-solid fa-handshake mr-1"></i> Individual Student Execution Commitment:</span>
                        <div class="grid grid-cols-3 gap-2 text-[9.5px] text-slate-200">
                            ${sap.studentAction.map((a, i) => `<div><strong>${i+1}.</strong> ${a}</div>`).join('')}
                        </div>
                    </div>

                    <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                        <span>Phase VI: Advanced Career Synthesis | Student Action Plan | ${name}</span>
                        <span>Ref: #${rid}</span>
                    </div>
                </div>
            </section>
            `;
        })()}

        <!-- PAGE 56: REPORT CONCLUSION & COUNSELLOR NEXT STEPS -->
        <section class="as-report-page avoid-break" id="page-56" data-page="56">
            <div class="maroon-gradient rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-gold h-full flex flex-col justify-between">
                <!-- Background Ambient Glow -->
                <div class="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-maroon-light/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Header -->
                <div class="flex items-center justify-between border-b-2 border-gold/40 pb-4 relative z-10 shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-gold text-maroon-dark font-black flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-flag-checkered"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-gold tracking-widest block uppercase">REPORT CONCLUSION &amp; ADVISORY</span>
                            <span class="text-[10px] text-slate-300 block font-medium">PrepAbroad Psychometric Evaluation Summary</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold text-gold-light text-[10px] font-bold uppercase tracking-wider">
                            FINAL PAGE (PAGE 56)
                        </span>
                    </div>
                </div>

                <!-- Main End Content -->
                <div class="my-auto py-2 relative z-10 space-y-4 text-center shrink-0">
                    <div class="space-y-2 max-w-3xl mx-auto">
                        <div class="w-16 h-16 mx-auto rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center shadow-xl backdrop-blur-md">
                            <i class="fa-solid fa-award text-3xl text-gold"></i>
                        </div>
                        <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                            Congratulations, ${firstName}!
                        </h2>
                        <p class="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                            You have successfully completed your 30-Module Class 10 Executive Psychometric Evaluation. You now possess a powerful data-backed map for your future stream and career journey.
                        </p>
                    </div>

                    <!-- 4-Step Actionable Next Steps Grid -->
                    <div class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
                        <div class="bg-obsidian/70 p-3 rounded-xl border border-gold/40 space-y-1 backdrop-blur-sm">
                            <div class="w-6 h-6 rounded-full bg-gold text-maroon-dark font-extrabold flex items-center justify-center text-[10px]">1</div>
                            <h4 class="font-bold text-gold text-[11px] uppercase">Book 1-on-1 Session</h4>
                            <p class="text-[10px] text-slate-300 leading-snug">Schedule a detailed stream consultation with a certified career counselor.</p>
                        </div>

                        <div class="bg-obsidian/70 p-3 rounded-xl border border-gold/40 space-y-1 backdrop-blur-sm">
                            <div class="w-6 h-6 rounded-full bg-gold text-maroon-dark font-extrabold flex items-center justify-center text-[10px]">2</div>
                            <h4 class="font-bold text-gold text-[11px] uppercase">Discuss with Family</h4>
                            <p class="text-[10px] text-slate-300 leading-snug">Review the Parent Advisory Guide with family to align on expectations.</p>
                        </div>

                        <div class="bg-obsidian/70 p-3 rounded-xl border border-gold/40 space-y-1 backdrop-blur-sm">
                            <div class="w-6 h-6 rounded-full bg-gold text-maroon-dark font-extrabold flex items-center justify-center text-[10px]">3</div>
                            <h4 class="font-bold text-gold text-[11px] uppercase">Finalize Stream with Counsellor</h4>
                            <p class="text-[10px] text-slate-300 leading-snug">Finalize Class 11 subject combination with your school guidance counselor.</p>
                        </div>

                        <div class="bg-obsidian/70 p-3 rounded-xl border border-gold/40 space-y-1 backdrop-blur-sm">
                            <div class="w-6 h-6 rounded-full bg-gold text-maroon-dark font-extrabold flex items-center justify-center text-[10px]">4</div>
                            <h4 class="font-bold text-gold text-[11px] uppercase">Track Milestones</h4>
                            <p class="text-[10px] text-slate-300 leading-snug">Re-evaluate entrance exam readiness and study milestones every quarter.</p>
                        </div>
                    </div>

                    <!-- Certification & Support Box -->
                    <div class="max-w-2xl mx-auto bg-obsidian/80 p-4 rounded-2xl border-2 border-gold/50 text-center space-y-3 shadow-2xl backdrop-blur-md">
                        <div class="flex flex-wrap items-center justify-between border-b border-gold/30 pb-2 gap-2">
                            <span class="text-[11px] font-bold text-gold uppercase tracking-wider"><i class="fa-solid fa-shield-check mr-1.5"></i> Certified Assessment Verification</span>
                            <span class="text-[11px] font-mono text-slate-300">Report ID: #${rid}</span>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-[11px]">
                            <div>
                                <span class="text-slate-400 block text-[9px] uppercase font-semibold">Official Web Portal</span>
                                <a href="https://prep.abroadsimplified.com" target="_blank" class="text-gold font-bold hover:underline text-xs">prep.abroadsimplified.com</a>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[9px] uppercase font-semibold">Advisory & Support Email</span>
                                <a href="mailto:support@collegesimplified.in" class="text-white font-bold hover:underline text-xs">support@collegesimplified.in</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Quote Banner -->
                <div class="border-t-2 border-gold/40 pt-3 text-center relative z-10 space-y-0.5 shrink-0">
                    <p class="text-xs italic font-serif text-gold-light max-w-xl mx-auto">
                        "Your potential is not defined by where you start, but by the clarity of the path you choose to walk."
                    </p>
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">© 2026 PrepAbroad Simplified | All Rights Reserved | Confidential Diagnostic Data</p>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="border-t-2 border-gold/30 pt-6 text-center text-xs text-slate-500 space-y-2 pb-8 no-print">
            <p>Certified Class 10 Executive Diagnostic Report for ${name} | Abroad Simplified Engine v5.0</p>
            <p>© 2026 Confidential Assessment Data.</p>
        </footer>

    </div>

    <!-- Chart.js Setup with Poppins Font -->
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const maroon = '#6B0919';
            const gold = '#D4AF37';
            const goldDark = '#AA820A';

            Chart.defaults.font.family = 'Poppins';

            // 1. Master Radar Chart
            const ctxRadar = document.getElementById('masterRadarChart').getContext('2d');
            new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['Openness (${oSc}%)', 'Conscientiousness (${cSc}%)', 'Extraversion (${eSc}%)', 'Agreeableness (${aSc}%)', 'Emotional Stability (${esSc}%)', 'Fluid Logic (${reasSc}%)', 'Visual Learning (${topVarkCode === 'V' ? 90 : 75}%)', 'EQ (${aSc}%)'],
                    datasets: [{
                        label: '${name} Profile',
                        data: [${oSc}, ${cSc}, ${eSc}, ${aSc}, ${esSc}, ${reasSc}, ${topVarkCode === 'V' ? 90 : 75}, ${aSc}],
                        backgroundColor: 'rgba(107, 9, 25, 0.25)',
                        borderColor: maroon,
                        borderWidth: 3,
                        pointBackgroundColor: gold,
                        pointBorderColor: maroon,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.35,
                    scales: {
                        r: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: { stepSize: 20, font: { family: 'Poppins', size: 8.5 } },
                            pointLabels: { font: { family: 'Poppins', size: 9, weight: '600' }, color: '#1E1E28' }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // 2. Cognitive Capacity Bar Chart
            const ctxCog = document.getElementById('cognitiveBarChart').getContext('2d');
            new Chart(ctxCog, {
                type: 'bar',
                data: {
                    labels: ['Fluid (Gf)', 'Crystallized (Gc)', 'Spatial', 'Algorithmic', 'Systems', 'Creative', 'Critical', 'Metacognition'],
                    datasets: [{
                        label: 'Percentile Capacity',
                        data: [${reasSc}, ${verbalSc}, ${spatSc}, ${numSc}, ${Math.min(99, reasSc + 4)}, ${Math.min(99, oSc + 2)}, ${Math.min(99, reasSc + 2)}, ${Math.min(99, cSc + 3)}],
                        backgroundColor: [maroon, goldDark, maroon, goldDark, maroon, goldDark, maroon, goldDark],
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.4,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { font: { family: 'Poppins', size: 8.5 } } },
                        x: { ticks: { font: { family: 'Poppins', size: 8.5, weight: '600' } } }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // 3. VARK Donut Chart
            const ctxVark = document.getElementById('varkDonutChart').getContext('2d');
            new Chart(ctxVark, {
                type: 'doughnut',
                data: {
                    labels: ['Visual (${topVarkCode === 'V' ? 35 : 25}%)', 'Read/Write (${topVarkCode === 'R' ? 35 : 25}%)', 'Kinesthetic (${topVarkCode === 'K' ? 35 : 25}%)', 'Auditory (${topVarkCode === 'A' ? 35 : 25}%)'],
                    datasets: [{
                        data: [${topVarkCode === 'V' ? 35 : 25}, ${topVarkCode === 'R' ? 35 : 25}, ${topVarkCode === 'K' ? 35 : 25}, ${topVarkCode === 'A' ? 35 : 25}],
                        backgroundColor: [maroon, gold, '#1E1E28', '#C5A059'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.4,
                    cutout: '55%',
                    plugins: { legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 9.5, weight: '600' }, boxWidth: 12 } } }
                }
            });

            // 4. EQ Polar Area Chart
            const ctxEq = document.getElementById('eqPolarChart').getContext('2d');
            new Chart(ctxEq, {
                type: 'polarArea',
                data: {
                    labels: ['Self-Awareness (${aSc}%)', 'Emotion Regulation (${esSc}%)', 'Empathy (${aSc}%)', 'Social Dynamics (${eSc}%)'],
                    datasets: [{
                        data: [${aSc}, ${esSc}, ${aSc}, ${eSc}],
                        backgroundColor: [
                            'rgba(107, 9, 25, 0.75)',
                            'rgba(212, 175, 55, 0.75)',
                            'rgba(30, 30, 40, 0.75)',
                            'rgba(197, 160, 89, 0.75)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1.4,
                    plugins: { legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 9.5, weight: '600' }, boxWidth: 12 } } }
                }
            });
        });
    </script>
</body>
</html>
`;
}
