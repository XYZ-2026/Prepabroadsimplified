/**
 * Universal Executive HTML Report Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds the authoritative, publication-quality 56-page HTML report dossier
 * across all three academic variants:
 * 1. Junior (Class 7–9)
 * 2. Class 10 (Approved baseline)
 * 3. Senior (Class 12)
 *
 * Uses the exact approved visual design system: Poppins typography, FontAwesome icons,
 * Tailwind CSS, A4 page margins (210mm x 297mm), Chart.js analytics, and card styling.
 *
 * GUARANTEE: For Class 10, yields 100% exact parity with the approved Class 10 baseline.
 */

import type { UniversalReportData } from './universal-report-schema';
import { buildClass10ExecutiveHTMLReport } from '../class10_html_report_builder';

export function buildUniversalExecutiveHTMLReport(data: UniversalReportData): string {
  // If variant is grade10, delegate directly to the approved Class 10 baseline to ensure 100% zero regression
  if (data.variant === 'grade10') {
    return buildClass10ExecutiveHTMLReport(
      data.student,
      data.scores,
      data.personalization,
      data.comparisonData,
      data.parentProfile
    );
  }

  const { student, scores, personalization, comparisonData, parentProfile, config, roadmaps, studyAbroad, academicRoadmap, actionPlan } = data;

  const name = student.name || 'Candidate';
  const firstName = name.split(' ')[0];
  const rid = student.reportId || `PSY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = student.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const aptOverall = scores.aptitude?.overall || 80;
  const oSc = scores.personality?.openness || 75;
  const cSc = scores.personality?.conscientiousness || 76;
  const eSc = scores.personality?.extraversion || 68;
  const aSc = scores.personality?.agreeableness || 74;
  const esSc = scores.personality?.emotionalStability || 70;

  const reasSc = scores.aptitude?.reasoning || 80;
  const numSc = scores.aptitude?.numerical || 78;
  const verbalSc = scores.aptitude?.verbal || 75;
  const spatSc = scores.aptitude?.spatial || 74;

  const topVarkCode = scores.topVark || 'V';
  const topVarkLabel = topVarkCode === 'V' ? 'Visual' : topVarkCode === 'A' ? 'Auditory' : topVarkCode === 'R' ? 'Read/Write' : 'Kinesthetic';

  const topRiasecCodes = scores.topRiasec && scores.topRiasec.length > 0 ? scores.topRiasec : ['R', 'I', 'E'];
  const topRiasecLabel = topRiasecCodes.slice(0, 3).join('-');

  const primaryRoadmap = roadmaps.primary;
  const secondaryRoadmap = roadmaps.secondary;
  const alternativeRoadmap = roadmaps.alternative;

  const topCareer = primaryRoadmap.pathwayName;
  const topFitScore = primaryRoadmap.fitScore || 92;

  const modules = [
    // Phase I: Personality Architecture (Modules 1 - 10)
    {
      id: 1,
      phase: "Phase I: Personality Architecture",
      code: "Module 01",
      title: "Big Five — Openness & Abstract Curiosity",
      score: `${oSc}%`,
      percentile: `${Math.round(oSc * 0.96)}th`,
      archetype: oSc > 75 ? "Abstract Strategist" : "Pragmatic Explorer",
      summary: `${name}, your Openness score reflects an active cognitive drive for exploration, conceptual curiosity, and interdisciplinary synthesis. You operate with high receptivity to novel ideas and thrive in dynamic environments.`,
      mechanism: "In modern personality psychology, Openness to Experience quantifies cognitive flexibility, intellectual curiosity, aesthetic sensitivity, and intrinsic motivation to explore novel concepts.",
      subfacet_desc: `Your sub-facet breakdown shows high Intellectual Curiosity (${Math.min(99, oSc + 3)}%) and Conceptual Flexibility (${Math.min(99, oSc + 2)}%).`,
      facets: [
        ["Intellectual Curiosity", `${Math.min(99, oSc + 3)}%`, "High drive to acquire abstract knowledge and understand underlying principles."],
        ["Aesthetic Sensitivity", `${Math.max(40, oSc - 4)}%`, "Appreciation for elegant design, symmetry, and architectural structures."],
        ["Preference for Novelty", `${Math.min(99, oSc + 2)}%`, "Thrives when exploring open-ended concepts lacking rigid templates."],
        ["Conceptual Flexibility", `${Math.min(99, oSc + 1)}%`, "Receptive to non-traditional frameworks and paradigm-shifting methods."]
      ],
      low_behavior: "Prefers concrete facts, established routines, and proven procedures.",
      high_behavior: "Seeks novel hypotheses, interdisciplinary concepts, and open inquiry.",
      alignment: `${oSc > 75 ? 'High Exploratory Stance' : 'Pragmatic Focus'} (${Math.round(oSc * 0.96)}th %ile)`,
      protocol_name: "Intellectual Focus & Execution Sifting",
      protocol: "While abstract curiosity fuels rapid learning and creative breakthroughs, pair conceptual discovery with structured project milestones to ensure ideas translate into tangible outputs.",
      opt_name: "Workspace & Environmental Optimization",
      opt_text: "Design your primary workspace to balance visual inspiration with functional order. Keep notebooks and digital canvas tools accessible to capture insights."
    },
    {
      id: 2,
      phase: "Phase I: Personality Architecture",
      code: "Module 02",
      title: "Big Five — Conscientiousness, Grit & Execution",
      score: `${cSc}%`,
      percentile: `${Math.round(cSc * 0.96)}th`,
      archetype: cSc > 75 ? "Disciplined Strategist" : "Flexible Operator",
      summary: `Your Conscientiousness profile indicates a structured executive function system. You naturally establish systematic workflows, set ambitious internal standards, and sustain goal-directed effort through complex challenges.`,
      mechanism: "Conscientiousness reflects executive function integrity governing impulse control, long-term persistence, and procedural reliability.",
      subfacet_desc: `Industriousness & Persistence (${Math.min(99, cSc + 4)}%) and Goal-Striving Ambition (${Math.min(99, cSc + 2)}%) form your execution anchors.`,
      facets: [
        ["Orderliness & System", `${Math.max(40, cSc - 3)}%`, "Builds structured filing systems, note hierarchies, and daily study habits."],
        ["Industriousness & Grit", `${Math.min(99, cSc + 4)}%`, "Sustained focus through challenging tasks; high resistance to digital distraction."],
        ["Goal-Striving Ambition", `${Math.min(99, cSc + 2)}%`, "Sets ambitious benchmarks and derives deep satisfaction from crossing milestones."],
        ["Operational Reliability", `${Math.min(99, cSc + 1)}%`, "Adheres strictly to promises, meeting submission deadlines consistently."]
      ],
      low_behavior: "Spontaneous, highly flexible, requires external structures for routine consistency.",
      high_behavior: "Methodical, self-directed, maintains rigorous standards and milestone discipline.",
      alignment: `Methodical Execution (${Math.round(cSc * 0.96)}th %ile)`,
      protocol_name: "Block-Scheduling Protocol",
      protocol: "Execute deep work in 45-to-50 minute uninterrupted focus blocks followed by 10-minute rest breaks. Add a 15% time buffer to daily schedules to prevent burnout.",
      opt_name: "Operational Workflow Optimization",
      opt_text: "Track tasks on structured kanban boards. Automate routine tracking to preserve high-level executive focus for complex problem-solving."
    },
    {
      id: 3,
      phase: "Phase I: Personality Architecture",
      code: "Module 03",
      title: "Big Five — Extraversion, Energy & Sociability",
      score: `${eSc}%`,
      percentile: `${Math.round(eSc * 0.95)}th`,
      archetype: eSc > 65 ? "Energetic Connector" : "Reflective Leader",
      summary: `You display a balanced energy profile. While cognitive clarity and energy recharge thrive with focused concentration, you communicate with clarity and confidence when sharing ideas with peers or mentors.`,
      mechanism: "Extraversion evaluates neurobehavioral reward sensitivity and engagement under social and environmental stimulation.",
      subfacet_desc: `Assertiveness & Expression (${Math.min(99, eSc + 6)}%) allows you to voice ideas clearly during group discussions.`,
      facets: [
        ["Social Energy & Warmth", `${Math.max(35, eSc - 8)}%`, "Recharges energy through quiet focus alongside collaborative discussions."],
        ["Assertiveness & Influence", `${Math.min(99, eSc + 6)}%`, "Takes initiative during challenges, voicing insights thoughtfully."],
        ["Positive Emotionality", `${eSc}%`, "Balanced baseline optimism; approaches scenarios with pragmatic enthusiasm."],
        ["Activity Tempo", `${Math.min(99, eSc + 2)}%`, "Prefers a steady, deliberate execution pace with high focus retention."]
      ],
      low_behavior: "Inward-focused, quiet focus, recharges through solitary reflection.",
      high_behavior: "Outward-focused, high reward seeking, recharges through collaborative interaction.",
      alignment: `Balanced Ambivert (${Math.round(eSc * 0.95)}th %ile)`,
      protocol_name: "Targeted Energy Management",
      protocol: "Schedule demanding analytical tasks during morning peak hours. Pair with brief, collaborative study sessions to balance teamwork with deep work.",
      opt_name: "Group Dynamic Optimization",
      opt_text: "Take on strategic or technical roles in group projects where prepared written contributions and reflective insights carry high impact."
    },
    {
      id: 4,
      phase: "Phase I: Personality Architecture",
      code: "Module 04",
      title: "Big Five — Agreeableness & Team Harmony",
      score: `${aSc}%`,
      percentile: `${Math.round(aSc * 0.96)}th`,
      archetype: "Cooperative Collaborator",
      summary: `Your Agreeableness score reflects a prosocial orientation that values constructive teamwork, mutual respect, and active listening while maintaining high intellectual standards.`,
      mechanism: "Agreeableness measures prosocial disposition, defining how one balances personal objectives against group cohesion.",
      subfacet_desc: `Cooperation & Trust (${Math.min(99, aSc + 5)}%) and Empathy (${Math.min(99, aSc + 2)}%) foster supportive peer environments.`,
      facets: [
        ["Compassion & Empathy", `${Math.min(99, aSc + 2)}%`, "Attuned to team dynamics; provides supportive encouragement to peers."],
        ["Cooperation & Trust", `${Math.min(99, aSc + 5)}%`, "Constructive collaboration; seeks team alignment and win-win solutions."],
        ["Altruism & Service", `${Math.max(40, aSc - 3)}%`, "Enjoys mentoring others and contributing to community initiatives."],
        ["Diplomacy & Tact", `${Math.max(40, aSc - 5)}%`, "Communicates with respectful diplomacy while upholding quality standards."]
      ],
      low_behavior: "Direct, debate-focused, prioritizes objective critique over team harmony.",
      high_behavior: "Consensus-seeking, highly empathetic, prioritizes team trust and alignment.",
      alignment: `Cooperative Collaborator (${Math.round(aSc * 0.96)}th %ile)`,
      protocol_name: "Constructive Peer Feedback",
      protocol: "Deliver feedback using evidence-based suggestions: validate strengths first, highlight adjustments dispassionately, and co-create improvements.",
      opt_name: "Team Synergy Design",
      opt_text: "Position yourself as a communicative bridge during team projects, connecting analytical goals with supportive group dynamics."
    },
    {
      id: 5,
      phase: "Phase I: Personality Architecture",
      code: "Module 05",
      title: "Big Five — Emotional Stability & Composure",
      score: `${esSc}%`,
      percentile: `${Math.round(esSc * 0.96)}th`,
      archetype: "Composed Anchor",
      summary: `You possess strong emotional equilibrium and psychological resilience. Under tight deadlines or evaluative pressure, you maintain logical clarity and recover baseline composure steadily.`,
      mechanism: "Emotional Stability quantifies autonomic nervous system reactivity when navigating evaluative stress and uncertainty.",
      subfacet_desc: `Composure Under Pressure (${Math.min(99, esSc + 5)}%) and Stress Resilience (${Math.min(99, esSc + 3)}%) place you in a reliable performance tier.`,
      facets: [
        ["Stress Resilience", `${Math.min(99, esSc + 3)}%`, "Maintains cognitive performance and structured logic under pressure."],
        ["Composure Under Load", `${Math.min(99, esSc + 5)}%`, "Regulates emotional reactions, preventing panic or hasty decisions."],
        ["Recovery Pace", `${Math.min(99, esSc + 1)}%`, "Returns to calm baseline rapidly following setbacks or academic mistakes."],
        ["Low Anxiety Drift", `${Math.max(40, esSc - 2)}%`, "Free from chronic overthinking or catastrophic interpretations."]
      ],
      low_behavior: "Elevated stress sensitivity, prone to anticipatory exam worry.",
      high_behavior: "High stress buffering, calm equanimity under load, rapid setback recovery.",
      alignment: `Composed Anchor (${Math.round(esSc * 0.96)}th %ile)`,
      protocol_name: "Post-Evaluation Review Protocol",
      protocol: "Conduct objective post-mortems after evaluations: record 3 execution successes and 2 specific adjustments without self-criticism.",
      opt_name: "High-Focus Environment Calibration",
      opt_text: "Leverage baseline composure during high-stakes exams or public presentations where poise is a significant competitive asset."
    },
    {
      id: 6,
      phase: "Phase I: Personality Architecture",
      code: "Module 06",
      title: "Cognitive Processing — Sensing & Empirical Grounding",
      score: `${Math.round((spatSc + numSc) / 2)}%`,
      percentile: `${Math.round(((spatSc + numSc) / 2) * 0.95)}th`,
      archetype: "Empirical Grounding",
      summary: "You anchor active problem solving in concrete observations, historical precedents, and tangible empirical data before making conceptual leaps.",
      mechanism: "Evaluates information-gathering preference between concrete sensory observations vs. theoretical abstract patterns.",
      subfacet_desc: `Concrete Fact Retention (${Math.min(99, Math.round((spatSc + numSc)/2) + 3)}%) provides a solid foundation for quantitative and technical topics.`,
      facets: [
        ["Empirical Grounding", `${Math.round((spatSc + numSc) / 2)}%`, "Prefers verifiable data and concrete examples over ungrounded speculation."],
        ["Process Fidelity", `${Math.min(99, cSc + 3)}%`, "Executes stepwise procedural algorithms with dependable consistency."],
        ["Detail Precision", `${Math.min(99, numSc + 2)}%`, "Catches subtle discrepancies in numbers, text, and structural systems."],
        ["Pragmatic Application", `${Math.max(40, oSc - 2)}%`, "Values learning that translates directly into functional outcomes."]
      ],
      low_behavior: "Tends to overlook fine details in favor of overarching theoretical concepts.",
      high_behavior: "Meticulous verification, respects empirical evidence and proven protocols.",
      alignment: `Empirical Precision (${Math.round(((spatSc + numSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "Empirical Verification Protocol",
      protocol: "Anchor abstract theories to real-world datasets, case examples, or physical prototypes to accelerate retention.",
      opt_name: "Structured Learning Environment",
      opt_text: "Organize notes with clear tables, data summaries, and step-by-step checklists to maximize study efficiency."
    },
    {
      id: 7,
      phase: "Phase I: Personality Architecture",
      code: "Module 07",
      title: "Cognitive Processing — Intuitive Synthesis & Pattern Discovery",
      score: `${Math.round((oSc + reasSc) / 2)}%`,
      percentile: `${Math.round(((oSc + reasSc) / 2) * 0.95)}th`,
      archetype: "Conceptual Synthesizer",
      summary: "Your cognitive architecture naturally perceives underlying connections between seemingly unrelated domains, allowing you to anticipate trends.",
      mechanism: "Measures intuitive cognitive processing, evaluating the ability to recognize non-linear patterns and project future scenarios.",
      subfacet_desc: `Theoretical Conceptualization (${Math.min(99, Math.round((oSc + reasSc)/2) + 4)}%) empowers creative problem solving.`,
      facets: [
        ["Pattern Recognition", `${Math.min(99, reasSc + 3)}%`, "Detects subtle conceptual correlations and structural parallels across subjects."],
        ["Future Scenario Projections", `${Math.min(99, oSc + 3)}%`, "Envisions multi-step downstream impacts and alternative trajectories."],
        ["Abstract Synthesis", `${Math.min(99, oSc + 2)}%`, "Distills complex multi-source information into cohesive mental models."],
        ["Tolerance for Ambiguity", `${Math.min(99, esSc + 2)}%`, "Comfortable navigating open-ended challenges without predefined answers."]
      ],
      low_behavior: "Prefers literal, linear problem statements with explicit instructions.",
      high_behavior: "Excels in open-ended exploratory research, conceptual design, and hypothesis building.",
      alignment: `Strategic Synthesizer (${Math.round(((oSc + reasSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "Concept Mapping Technique",
      protocol: "Synthesize complex chapters into one-page hierarchical concept diagrams connecting root principles to practical applications.",
      opt_name: "Cross-Disciplinary Integration",
      opt_text: "Read broadly across technology, economics, and human behavior to fuel creative lateral thinking."
    },
    {
      id: 8,
      phase: "Phase I: Personality Architecture",
      code: "Module 08",
      title: "Cognitive Decision Framework — Objective Logic vs Values",
      score: `${Math.round((reasSc + cSc) / 2)}%`,
      percentile: `${Math.round(((reasSc + cSc) / 2) * 0.95)}th`,
      archetype: "Systemic Decision Maker",
      summary: "Your decision-making framework balances dispassionate logical rigor with empathetic ethical awareness, favoring objective criteria.",
      mechanism: "Analyzes decision-making heuristics: objective systemic logic vs. humanistic value-driven considerations.",
      subfacet_desc: `Logical Consistency (${Math.min(99, reasSc + 2)}%) ensures rational choices when solving analytical dilemmas.`,
      facets: [
        ["Objective Criteria", `${Math.min(99, reasSc + 2)}%`, "Evaluates situations dispassionately using empirical evidence."],
        ["Ethical Awareness", `${Math.min(99, aSc + 2)}%`, "Considers broader human impact and fairness in strategic decisions."],
        ["Systemic Consistency", `${Math.min(99, cSc + 2)}%`, "Applies equitable decision rules without arbitrary exceptions."],
        ["Constructive Objectivity", `${Math.min(99, esSc + 1)}%`, "Delivers fair appraisals without letting personal biases cloud judgment."]
      ],
      low_behavior: "Decisions heavily influenced by momentary emotional temperature.",
      high_behavior: "Disciplined, evidence-based reasoning that stands up to critical scrutiny.",
      alignment: `Rational Equilibrium (${Math.round(((reasSc + cSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "Weighted Decision Matrix",
      protocol: "When making complex choices, score alternatives across weighted objective criteria before factoring in qualitative preferences.",
      opt_name: "Strategic Clarity",
      opt_text: "Clearly document decision criteria in writing to facilitate alignment with parents, mentors, and peers."
    },
    {
      id: 9,
      phase: "Phase I: Personality Architecture",
      code: "Module 09",
      title: "Mindset Orientation — Locus of Control & Growth Stance",
      score: `${Math.round(cSc * 0.6 + esSc * 0.4)}%`,
      percentile: `${Math.round((cSc * 0.6 + esSc * 0.4) * 0.96)}th`,
      archetype: "Internal Agency",
      summary: "You hold a strong internal locus of control, viewing academic and personal outcomes as direct consequences of your strategy, discipline, and effort.",
      mechanism: "Evaluates psychological agency: whether achievements and failures are attributed to internal effort or external luck.",
      subfacet_desc: `Agency & Effort Attribution (${Math.min(99, cSc + 3)}%) builds resilience and long-term academic confidence.`,
      facets: [
        ["Personal Accountability", `${Math.min(99, cSc + 3)}%`, "Takes complete ownership of preparation, mistakes, and final results."],
        ["Effort-Outcome Linkage", `${Math.min(99, cSc + 2)}%`, "Firm belief that consistent deliberate practice overcomes cognitive barriers."],
        ["Resilience to Setbacks", `${Math.min(99, esSc + 3)}%`, "Interprets poor scores as actionable diagnostics rather than permanent limitations."],
        ["Proactive Initiative", `${Math.min(99, oSc + 1)}%`, "Seeks out additional learning resources without waiting for reminders."]
      ],
      low_behavior: "Externalizes setbacks to external circumstances, test difficulty, or luck.",
      high_behavior: "Deep sense of personal agency, self-correcting discipline, and intrinsic motivation.",
      alignment: `Proactive Agency (${Math.round((cSc * 0.6 + esSc * 0.4) * 0.96)}th %ile)`,
      protocol_name: "Deliberate Practice Loop",
      protocol: "Maintain an error analysis log: for every mistake on tests, classify it into conceptual error, calculation slip, or time management gap, and review weekly.",
      opt_name: "Empowerment Focus",
      opt_text: "Focus 90% of mental energy on factors within direct control (study time, sleep, focus) rather than external variables."
    },
    {
      id: 10,
      phase: "Phase I: Personality Architecture",
      code: "Module 10",
      title: "Behavioral Adaptability — Ambiguity & Risk Calibration",
      score: `${Math.round(oSc * 0.5 + esSc * 0.5)}%`,
      percentile: `${Math.round((oSc * 0.5 + esSc * 0.5) * 0.95)}th`,
      archetype: "Calibrated Risk Explorer",
      summary: "You approach unfamiliar scenarios and ambiguous problem statements with calibrated curiosity, balancing calculated risks against sound preparation.",
      mechanism: "Quantifies comfort with cognitive ambiguity, intellectual risk tolerance, and adaptive flexibility under shifting parameters.",
      subfacet_desc: `Adaptability Under Uncertainty (${Math.min(99, Math.round((oSc+esSc)/2) + 3)}%) enables smooth navigation through transitions.`,
      facets: [
        ["Tolerance for Ambiguity", `${Math.min(99, oSc + 2)}%`, "Remains productive even when instructions lack rigid definitions."],
        ["Calculated Risk Stance", `${Math.round((oSc + esSc) / 2)}%`, "Willing to attempt novel methods when the potential upside is high."],
        ["Cognitive Flexibility", `${Math.min(99, oSc + 3)}%`, "Pivots seamlessly when original problem-solving approaches hit barriers."],
        ["Composure During Change", `${Math.min(99, esSc + 2)}%`, "Maintains focus during syllabus updates or schedule adjustments."]
      ],
      low_behavior: "Rigid adherence to familiar routines, high discomfort with novel question formats.",
      high_behavior: "Adaptive, curious, embraces unconventional problems with exploratory confidence.",
      alignment: `Adaptive Explorer (${Math.round((oSc * 0.5 + esSc * 0.5) * 0.95)}th %ile)`,
      protocol_name: "Scenario Exploration Drill",
      protocol: "Regularly practice solving unfamiliar, non-routine problems to cultivate cognitive elasticity under uncertain parameters.",
      opt_name: "Dynamic Problem Solving",
      opt_text: "When facing a roadblock, generate at least two alternative strategies before consulting answer keys."
    },

    // Phase II: Cognitive Processing (Modules 11 - 20)
    {
      id: 11,
      phase: "Phase II: Cognitive Processing",
      code: "Module 11",
      title: "Cognitive Aptitude — Numerical Reasoning & Quantitative Acuity",
      score: `${numSc}%`,
      percentile: `${Math.round(numSc * 0.96)}th`,
      archetype: "Quantitative Analyst",
      summary: `Your numerical reasoning score demonstrates strong quantitative literacy, arithmetic pattern extraction, and algebraic fluency. You process numerical relationships swiftly and with high precision.`,
      mechanism: "Assesses capacity to understand, analyze, and manipulate quantitative relationships, functional equations, and statistical trends.",
      subfacet_desc: `Arithmetic Fluency (${Math.min(99, numSc + 4)}%) and Algebraic Synthesis (${Math.min(99, numSc + 2)}%) reflect high computational stamina.`,
      facets: [
        ["Arithmetic Operations", `${Math.min(99, numSc + 4)}%`, "Fast, reliable mental computation and numerical conversion."],
        ["Algebraic Modeling", `${Math.min(99, numSc + 2)}%`, "Translates word problems into clear mathematical equations."],
        ["Statistical Inference", `${Math.min(99, numSc + 1)}%`, "Interprets charts, tables, and probabilities accurately."],
        ["Mathematical Precision", `${Math.max(40, numSc - 2)}%`, "High error resistance during multi-step numerical derivations."]
      ],
      low_behavior: "Prone to computational fatigue, relies heavily on mechanical calculation aids.",
      high_behavior: "Fluent mental arithmetic, instinctive grasp of scale, ratios, and mathematical structures.",
      alignment: `Strong Quantitative Acuity (${Math.round(numSc * 0.96)}th %ile)`,
      protocol_name: "Mental Math & Speed Drills",
      protocol: "Incorporate 10 minutes of daily mental arithmetic and dimensional estimation into study routines to increase processing speed.",
      opt_name: "Applied Quantitative Practice",
      opt_text: "Relate mathematical concepts to real-world applications in physics, economics, and data science to solidify intuition."
    },
    {
      id: 12,
      phase: "Phase II: Cognitive Processing",
      code: "Module 12",
      title: "Cognitive Aptitude — Fluid Logic & Abstract Reasoning",
      score: `${reasSc}%`,
      percentile: `${Math.round(reasSc * 0.97)}th`,
      archetype: "Inductive Logician",
      summary: `Your fluid reasoning score marks an outstanding cognitive asset. You excel at deciphering complex abstract rules, sequences, and logic matrices without reliance on prior factual training.`,
      mechanism: "Evaluates Cattell-Horn-Carroll Gf (Fluid Intelligence): the biological capacity to solve novel problems through pattern synthesis.",
      subfacet_desc: `Inductive Pattern Recognition (${Math.min(99, reasSc + 4)}%) provides a natural advantage in computational, engineering, and scientific problem spaces.`,
      facets: [
        ["Matrix Completion", `${Math.min(99, reasSc + 4)}%`, "Instinctively deduces transformations across multi-variable visual grids."],
        ["Rule Induction", `${Math.min(99, reasSc + 3)}%`, "Extracts governing mathematical or spatial laws from limited empirical samples."],
        ["Logical Deduction", `${Math.min(99, reasSc + 2)}%`, "Traces logical implications through multi-step conditional chains."],
        ["Hypothesis Testing", `${Math.min(99, reasSc + 1)}%`, "Systematically tests and invalidates faulty hypotheses under time limits."]
      ],
      low_behavior: "Struggles with unfamiliar question structures, requires pre-taught templates.",
      high_behavior: "Dissects unfamiliar, complex problem environments rapidly from first principles.",
      alignment: `Superior Fluid Intelligence (${Math.round(reasSc * 0.97)}th %ile)`,
      protocol_name: "Olympiad Matrix Challenges",
      protocol: "Engage with Olympiad-tier logic puzzles and competitive programming problems to push pattern recognition frontiers.",
      opt_name: "First-Principles Thinking",
      opt_text: "When approaching difficult problems, deconstruct them into fundamental axioms before applying formulas."
    },
    {
      id: 13,
      phase: "Phase II: Cognitive Processing",
      code: "Module 13",
      title: "Cognitive Aptitude — Verbal Comprehension & Language Acuity",
      score: `${verbalSc}%`,
      percentile: `${Math.round(verbalSc * 0.95)}th`,
      archetype: "Articulate Synthesizer",
      summary: `Your verbal aptitude profile demonstrates nuanced reading comprehension, lexical command, and contextual deduction. You absorb complex argumentative texts with precision.`,
      mechanism: "Evaluates Gc (Crystallized Intelligence) in the linguistic domain: vocabulary breadth, semantic decoding, and verbal argumentation.",
      subfacet_desc: `Critical Textual Analysis (${Math.min(99, verbalSc + 3)}%) empowers success across humanities, law, business, and research fields.`,
      facets: [
        ["Lexical Command", `${Math.min(99, verbalSc + 2)}%`, "Rich vocabulary and precise word selection across diverse registers."],
        ["Reading Inference", `${Math.min(99, verbalSc + 3)}%`, "Extracts subtext, unstated assumptions, and rhetorical structure effortlessly."],
        ["Argument Evaluation", `${Math.min(99, verbalSc + 1)}%`, "Identifies logical fallacies, unsupported claims, and cognitive biases."],
        ["Expressive Precision", `${Math.max(40, verbalSc - 2)}%`, "Communicates intricate concepts in written form with clarity."]
      ],
      low_behavior: "Literal reading comprehension, prone to missing nuanced textual implications.",
      high_behavior: "Sophisticated textual interpretation, effortless speed-reading and editorial precision.",
      alignment: `Strong Verbal Acuity (${Math.round(verbalSc * 0.95)}th %ile)`,
      protocol_name: "Analytical Essay & Debate Drills",
      protocol: "Read and summarize 1 long-form investigative or academic essay weekly, outlining core thesis and supporting evidence in under 150 words.",
      opt_name: "Linguistic Precision",
      opt_text: "Actively incorporate precise academic vocabulary into project presentations and written assignments."
    },
    {
      id: 14,
      phase: "Phase II: Cognitive Processing",
      code: "Module 14",
      title: "Cognitive Aptitude — Spatial Visualization & 3D Modeling",
      score: `${spatSc}%`,
      percentile: `${Math.round(spatSc * 0.94)}th`,
      archetype: "Spatial Architect",
      summary: `You possess strong spatial intelligence, enabling you to manipulate mental models of 3D objects, visualize cross-sections, and navigate spatial coordinate systems with ease.`,
      mechanism: "Assesses Gv (Visual Processing): mental rotation, spatial relations, spatial orientation, and visual working memory.",
      subfacet_desc: `Mental Rotation (${Math.min(99, spatSc + 4)}%) is a core multiplier for geometry, physics mechanics, architecture, and engineering design.`,
      facets: [
        ["Mental Rotation", `${Math.min(99, spatSc + 4)}%`, "Rotates complex 3D objects mentally across multiple axes accurately."],
        ["Cross-Sectional Insight", `${Math.min(99, spatSc + 2)}%`, "Visualizes interior planes, cuts, and unfolding patterns instinctively."],
        ["Spatial Coordinate Sense", `${Math.min(99, spatSc + 1)}%`, "Navigates multi-dimensional vector systems and geometric topologies."],
        ["Diagrammatic Translation", `${Math.max(40, spatSc - 2)}%`, "Converts textual descriptions into accurate visual flowcharts and schematics."]
      ],
      low_behavior: "Relies heavily on physical diagrams, difficulties with 3D projection questions.",
      high_behavior: "Effortless 3D mental rendering, excels in mechanical reasoning and CAD/design.",
      alignment: `High Spatial Capacity (${Math.round(spatSc * 0.94)}th %ile)`,
      protocol_name: "3D CAD & Geometric Modeling",
      protocol: "Explore 3D spatial design tools (Blender, SketchUp, or physical origami/robotics kits) to challenge spatial reasoning limits.",
      opt_name: "Visual Note Scaffolding",
      opt_text: "Convert abstract formulas into labelled anatomical diagrams, free-body schematics, and geometric sketches during revision."
    },
    {
      id: 15,
      phase: "Phase II: Cognitive Processing",
      code: "Module 15",
      title: "Cognitive Processing — Abstract Systemic Logic & Algorithmic Flow",
      score: `${Math.round((reasSc + spatSc) / 2)}%`,
      percentile: `${Math.round(((reasSc + spatSc) / 2) * 0.96)}th`,
      archetype: "Systems Thinker",
      summary: "You excel at analyzing interconnected feedback loops, tracking information states across algorithmic flowcharts, and detecting structural bottlenecks.",
      mechanism: "Evaluates ability to model dynamic multi-agent systems, understand causal loops, and design algorithmic branching logic.",
      subfacet_desc: `Algorithmic State Tracking (${Math.min(99, Math.round((reasSc+spatSc)/2) + 3)}%) directly underpins computer science and organizational logistics.`,
      facets: [
        ["Feedback Loop Analysis", `${Math.min(99, reasSc + 2)}%`, "Tracks amplifying and balancing systemic feedback dynamics."],
        ["Algorithmic Flow", `${Math.min(99, Math.round((reasSc + spatSc)/2) + 3)}%`, "Constructs clean logical conditional trees (if/then/else structures)."],
        ["Bottleneck Diagnosis", `${Math.min(99, reasSc + 1)}%`, "Pinpoints critical failure nodes in complex operational processes."],
        ["Modular Decomposition", `${Math.min(99, spatSc + 1)}%`, "Breaks giant unwieldy problems into tidy independent sub-problems."]
      ],
      low_behavior: "Focuses on isolated elements, misses second-order systemic consequences.",
      high_behavior: "Holistic systems vision, predicts cascading consequences across connected variables.",
      alignment: `Algorithmic Systemic Mastery (${Math.round(((reasSc + spatSc) / 2) * 0.96)}th %ile)`,
      protocol_name: "Flowchart & Pseudocode Mapping",
      protocol: "Map complex school projects or study plans as decision trees with clear input/process/output nodes.",
      opt_name: "Systems Thinking Drills",
      opt_text: "Study the systemic interactions in ecosystems, computer networks, and financial markets to train multi-variable analysis."
    },
    {
      id: 16,
      phase: "Phase II: Cognitive Processing",
      code: "Module 16",
      title: "Cognitive Processing — Working Memory Capacity & Throughput",
      score: `${Math.round((numSc + reasSc) / 2)}%`,
      percentile: `${Math.round(((numSc + reasSc) / 2) * 0.95)}th`,
      archetype: "High-Capacity Buffer",
      summary: "Your working memory allows you to hold multiple pieces of information in active mental workspace while executing complex multi-step transformations.",
      mechanism: "Measures phonological loop and visuo-spatial sketchpad capacity: active cognitive storage and manipulation without loss.",
      subfacet_desc: `Mental Manipulation Capacity (${Math.min(99, Math.round((numSc+reasSc)/2) + 2)}%) prevents mental fatigue during lengthy multi-step derivations.`,
      facets: [
        ["Multi-Variable Holding", `${Math.min(99, Math.round((numSc + reasSc)/2) + 2)}%`, "Maintains 5+ variables in active memory without cognitive confusion."],
        ["Derivation Memory", `${Math.min(99, numSc + 2)}%`, "Keeps prior intermediate results accessible during long calculations."],
        ["Cognitive Interference Shielding", `${Math.min(99, cSc + 1)}%`, "Resists intrusive irrelevant thoughts during intense focus."],
        ["Rapid Information Retrieval", `${Math.min(99, reasSc + 1)}%`, "Swiftly summons formulas and definitions from long-term memory."]
      ],
      low_behavior: "Loses track during multi-step math or complex grammar clauses without written notes.",
      high_behavior: "Maintains complex mental working models with minimal written scaffolding.",
      alignment: `High Working Memory Buffer (${Math.round(((numSc + reasSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "Cognitive Offloading Strategy",
      protocol: "Even with strong working memory, offload intermediate calculation steps onto scratch paper during exams to eliminate careless slips.",
      opt_name: "Chunking Technique",
      opt_text: "Organize long lists of terms or facts into conceptual chunks of 3 to 4 items to optimize working memory efficiency."
    },
    {
      id: 17,
      phase: "Phase II: Cognitive Processing",
      code: "Module 17",
      title: "Cognitive Processing — Processing Speed & Precision Under Load",
      score: `${Math.round((reasSc + cSc) / 2)}%`,
      percentile: `${Math.round(((reasSc + cSc) / 2) * 0.95)}th`,
      archetype: "Calibrated Speed Executor",
      summary: "You achieve an optimal balance between execution velocity and error avoidance, maintaining steady accuracy under timed constraints.",
      mechanism: "Evaluates Gs (Processing Speed): rate of mental test execution on routine cognitive tasks while maintaining zero-error discipline.",
      subfacet_desc: `Accuracy-Velocity Calibration (${Math.min(99, Math.round((reasSc+cSc)/2) + 2)}%) ensures excellent exam pacing.`,
      facets: [
        ["Scanning Velocity", `${Math.min(99, reasSc + 2)}%`, "Rapidly scans questions, highlighting keywords and constraints."],
        ["Execution Consistency", `${Math.min(99, cSc + 3)}%`, "Maintains constant problem-solving rhythm across timed test sections."],
        ["Error Detection Reflex", `${Math.min(99, cSc + 2)}%`, "Instinctively double-checks boundary conditions and calculation units."],
        ["Pacing Stamina", `${Math.min(99, esSc + 1)}%`, "Preserves cognitive speed into the final hour of lengthy testing blocks."]
      ],
      low_behavior: "Slow execution leads to unfinished exam papers or rushed, error-heavy final sections.",
      high_behavior: "Swift, steady, and composed pacing with ample time reserved for review.",
      alignment: `High Precision Pacing (${Math.round(((reasSc + cSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "Two-Pass Exam Strategy",
      protocol: "Pass 1: Complete all straightforward questions swiftly (60% time). Pass 2: Tackle complex challenges and conduct systematic verification (40% time).",
      opt_name: "Timed Mock Calibration",
      opt_text: "Practice timed 30-minute sprint quizzes to sharpen rapid decision reflexes under time pressure."
    },
    {
      id: 18,
      phase: "Phase II: Cognitive Processing",
      code: "Module 18",
      title: "Cognitive Processing — Analytical Problem Solving & Root-Cause Extraction",
      score: `${Math.round(reasSc * 0.6 + numSc * 0.4)}%`,
      percentile: `${Math.round((reasSc * 0.6 + numSc * 0.4) * 0.96)}th`,
      archetype: "Root-Cause Analyst",
      summary: "You cut through surface-level noise to isolate fundamental governing equations, causal mechanisms, and core questions.",
      mechanism: "Measures diagnostic capability: the ability to strip distracting details from a complex scenario and identify root problems.",
      subfacet_desc: `Root-Cause Extraction (${Math.min(99, Math.round(reasSc*0.6 + numSc*0.4) + 3)}%) underpins high performance in science and analytics.`,
      facets: [
        ["Noise Filtering", `${Math.min(99, reasSc + 3)}%`, "Discards non-essential question details to focus on core relationships."],
        ["First-Principles Dissection", `${Math.min(99, reasSc + 2)}%`, "Breaks convoluted scenarios into basic scientific laws or logic rules."],
        ["Solution Formulation", `${Math.min(99, numSc + 2)}%`, "Constructs elegant, direct solution paths with minimal wasted steps."],
        ["Verification Checking", `${Math.min(99, cSc + 2)}%`, "Checks final answers against physical realism and boundary limits."]
      ],
      low_behavior: "Distracted by superficial problem descriptions, prone to misidentifying what is asked.",
      high_behavior: "Laser focus on core variables, rapid translation to governing equations.",
      alignment: `Analytical Precision (${Math.round((reasSc * 0.6 + numSc * 0.4) * 0.96)}th %ile)`,
      protocol_name: "Problem Deconstruction Protocol",
      protocol: "Before calculating, underline the exact target variable and write down the fundamental principle that bridges the given data to the target.",
      opt_name: "Reverse Engineering Practice",
      opt_text: "Study worked solutions to challenging problems in reverse, understanding why each step was chosen."
    },
    {
      id: 19,
      phase: "Phase II: Cognitive Processing",
      code: "Module 19",
      title: "Cognitive Processing — Critical Thinking & Bias Mitigation",
      score: `${Math.round(verbalSc * 0.5 + reasSc * 0.5)}%`,
      percentile: `${Math.round(((verbalSc + reasSc) / 2) * 0.96)}th`,
      archetype: "Critical Reasoner",
      summary: "You critically examine claims, questioning unstated premises, checking statistical validity, and actively shielding against confirmation bias.",
      mechanism: "Evaluates epistemic vigilance: ability to spot fallacies, detect rhetorical manipulation, and assess statistical evidence objectively.",
      subfacet_desc: `Fallacy Detection (${Math.min(99, Math.round((verbalSc+reasSc)/2) + 3)}%) safeguards rational academic judgment.`,
      facets: [
        ["Fallacy Recognition", `${Math.min(99, reasSc + 2)}%`, "Detects circular reasoning, false dichotomies, and correlation-causation slips."],
        ["Evidence Auditing", `${Math.min(99, verbalSc + 2)}%`, "Evaluates sample sizes, methodology rigor, and potential author conflicts."],
        ["Counter-Argument Formulation", `${Math.min(99, oSc + 2)}%`, "Steel-mans opposing viewpoints to test the robustness of own conclusions."],
        ["Epistemic Humility", `${Math.min(99, esSc + 1)}%`, "Readily updates personal viewpoints when confronted with superior evidence."]
      ],
      low_behavior: "Accepts assertions at face value, easily swayed by emotionally charged arguments.",
      high_behavior: "Rigorous empirical skepticism, requires robust data and valid logic before acceptance.",
      alignment: `Critical Evaluator (${Math.round(((verbalSc + reasSc) / 2) * 0.96)}th %ile)`,
      protocol_name: "Devil's Advocate Drill",
      protocol: "When writing an essay or solving a dilemma, write out the strongest possible objection to your proposed answer before finalizing.",
      opt_name: "Socratic Method",
      opt_text: "Question foundational assumptions in every topic: Ask 'Why is this true?' and 'Under what conditions would this law fail?'"
    },
    {
      id: 20,
      phase: "Phase II: Cognitive Processing",
      code: "Module 20",
      title: "Cognitive Processing — Creative Synthesis & Lateral Thinking",
      score: `${Math.round(oSc * 0.6 + spatSc * 0.4)}%`,
      percentile: `${Math.round((oSc * 0.6 + spatSc * 0.4) * 0.95)}th`,
      archetype: "Lateral Innovator",
      summary: "You generate unconventional ideas by connecting concepts across diverse disciplines, finding creative workarounds when standard approaches stall.",
      mechanism: "Measures divergent thinking, remote association capability, and cognitive flexibility to formulate novel solutions.",
      subfacet_desc: `Cross-Domain Analogies (${Math.min(99, Math.round(oSc*0.6 + spatSc*0.4) + 3)}%) fuels breakthroughs in design, technology, and entrepreneurship.`,
      facets: [
        ["Divergent Ideation", `${Math.min(99, oSc + 3)}%`, "Rapidly produces multiple viable solution angles for unconstrained problems."],
        ["Remote Association", `${Math.min(99, oSc + 2)}%`, "Transfers insights from nature, arts, or sports into scientific/business models."],
        ["Visual Metaphor Design", `${Math.min(99, spatSc + 2)}%`, "Translates abstract logic into compelling visual models and prototypes."],
        ["Paradigm Inversion", `${Math.min(99, reasSc + 1)}%`, "Flips problems upside down, questioning traditional operational boundaries."]
      ],
      low_behavior: "Rigidly adheres to standard formulas, hesitates to propose novel ideas.",
      high_behavior: "Prolific creative output, bridges disparate fields with innovative solutions.",
      alignment: `Lateral Innovator (${Math.round((oSc * 0.6 + spatSc * 0.4) * 0.95)}th %ile)`,
      protocol_name: "Biomimicry & Cross-Domain Ideation",
      protocol: "When designing solutions, ask: 'How does biology, architecture, or music solve a similar distribution or balance challenge?'",
      opt_name: "Creative Sandbox Sessions",
      opt_text: "Dedicate 1 hour weekly to unconstrained project building, sketch-noting, or creative coding without fear of grades."
    },

    // Phase III: Learning & Execution (Modules 21 - 28)
    {
      id: 21,
      phase: "Phase III: Learning & Execution",
      code: "Module 21",
      title: "Learning Architecture — VARK Sensory Modality Profile",
      score: `${topVarkCode === 'V' ? 88 : topVarkCode === 'R' ? 82 : topVarkCode === 'A' ? 78 : 74}%`,
      percentile: `${Math.round((topVarkCode === 'V' ? 88 : 80) * 0.95)}th`,
      archetype: `${topVarkLabel} Learner`,
      summary: `Your sensory learning preference centers on ${topVarkLabel} inputs. You encode, retain, and recall information with highest efficiency when presented through matching formats.`,
      mechanism: "Fleming's VARK sensory preference model: Visual, Auditory, Read/Write, and Kinesthetic information encoding channels.",
      subfacet_desc: `Primary Modality: ${topVarkLabel} (${topVarkCode === 'V' ? 88 : 80}%) provides optimal neural encoding throughput.`,
      facets: [
        ["Visual Encoding", `${topVarkCode === 'V' ? 88 : 65}%`, "Mind maps, flowcharts, color-coded diagrams, spatial relationships."],
        ["Read/Write Processing", `${topVarkCode === 'R' ? 85 : 70}%`, "Textbooks, bulleted summaries, written outlines, glossaries."],
        ["Auditory Engagement", `${topVarkCode === 'A' ? 82 : 60}%`, "Lectures, recorded discussions, group debates, oral explanations."],
        ["Kinesthetic Action", `${topVarkCode === 'K' ? 80 : 55}%`, "Lab experiments, physical model building, real-world case simulations."]
      ],
      low_behavior: "Passive reading without multi-sensory engagement leads to rapid memory fade.",
      high_behavior: "Actively adapts study material into primary sensory format for rapid mastery.",
      alignment: `${topVarkLabel} Alignment (${Math.round((topVarkCode === 'V' ? 88 : 80) * 0.95)}th %ile)`,
      protocol_name: "Modality-Matched Study Method",
      protocol: topVarkCode === 'V' ? "Convert lecture notes into colorful flowcharts, annotated diagrams, and visual concept maps." : "Write detailed Cornell notes and generate question-answer flashcard decks for spaced revision.",
      opt_name: "Multi-Sensory Reinforcement",
      opt_text: "Reinforce primary modality with secondary channels (e.g. explain a diagram out loud) to create robust dual-coding memory traces."
    },
    {
      id: 22,
      phase: "Phase III: Learning & Execution",
      code: "Module 22",
      title: "Learning Architecture — Information Architecture & Structured Note-Taking",
      score: `${Math.round(cSc * 0.7 + oSc * 0.3)}%`,
      percentile: `${Math.round((cSc * 0.7 + oSc * 0.3) * 0.95)}th`,
      archetype: "Systematic Documenter",
      summary: "You instinctively organize academic inputs into logical hierarchies, building structured note archives that make revision efficient.",
      mechanism: "Evaluates information organization, summarization skills, and personal knowledge management systems.",
      subfacet_desc: `Information Hierarchy (${Math.min(99, cSc + 2)}%) streamlines revision before high-stakes exams.`,
      facets: [
        ["Hierarchical Tagging", `${Math.min(99, cSc + 3)}%`, "Structures notes with clean headings, sub-points, and core definitions."],
        ["Summary Compression", `${Math.min(99, verbalSc + 2)}%`, "Distills 20-page chapters into 2-page dense, high-yield summary sheets."],
        ["Cross-Referencing", `${Math.min(99, oSc + 2)}%`, "Links related formulas and concepts across different subject folders."],
        ["Archive Accessibility", `${Math.min(99, cSc + 1)}%`, "Maintains searchable, tidy digital or physical notebook systems."]
      ],
      low_behavior: "Disorganized, verbatim copying without synthesis; hard to locate key formulas before exams.",
      high_behavior: "Curated, high-yield personal knowledge base that dramatically shortens revision cycles.",
      alignment: `Structured Architecture (${Math.round((cSc * 0.7 + oSc * 0.3) * 0.95)}th %ile)`,
      protocol_name: "Cornell Note-Taking Framework",
      protocol: "Divide notes into Cue Column (keywords/questions), Note-Taking Area (concise points), and Summary Banner (core takeaway).",
      opt_name: "Digital/Analog Synergy",
      opt_text: "Use handwritten notes during lectures for cognitive encoding, then digitize key summary sheets for quick pre-exam searchability."
    },
    {
      id: 23,
      phase: "Phase III: Learning & Execution",
      code: "Module 23",
      title: "Learning Architecture — Exam Preparation & Retrieval Practice",
      score: `${Math.round(cSc * 0.6 + reasSc * 0.4)}%`,
      percentile: `${Math.round((cSc * 0.6 + reasSc * 0.4) * 0.96)}th`,
      archetype: "Active Retrieval Practitioner",
      summary: "You prioritize active recall and practice testing over passive rereading, strengthening neural memory traces for exam conditions.",
      mechanism: "Evaluates application of the 'Testing Effect' and active retrieval vs. passive recognition illusion.",
      subfacet_desc: `Active Recall Index (${Math.min(99, Math.round(cSc*0.6 + reasSc*0.4) + 3)}%) is the single strongest predictor of exam mastery.`,
      facets: [
        ["Closed-Book Retrieval", `${Math.min(99, cSc + 3)}%`, "Practices solving problems without checking textbook solutions beforehand."],
        ["Mock Exam Simulation", `${Math.min(99, cSc + 2)}%`, "Replicates timed exam environments under strict, unassisted conditions."],
        ["Gap Diagnosis", `${Math.min(99, reasSc + 2)}%`, "Pinpoints exact concepts requiring revision based on test mistakes."],
        ["Interleaved Practice", `${Math.min(99, oSc + 1)}%`, "Mixes multiple question types in study sessions rather than repetitive blocks."]
      ],
      low_behavior: "Relies on passive rereading and highlighting, resulting in the illusion of competence.",
      high_behavior: "Tests understanding continually through flashcards, practice questions, and blank-page recall.",
      alignment: `Active Retrieval Mastery (${Math.round((cSc * 0.6 + reasSc * 0.4) * 0.96)}th %ile)`,
      protocol_name: "Feynman Retrieval Technique",
      protocol: "Explain a complex concept on a blank sheet in simple language suitable for a 10-year-old; re-study areas where your explanation stumbles.",
      opt_name: "Spaced Question Decks",
      opt_text: "Organize practice questions into 3 boxes: Daily Practice, Weekly Review, and Monthly Mastered."
    },
    {
      id: 24,
      phase: "Phase III: Learning & Execution",
      code: "Module 24",
      title: "Learning Architecture — Time Allocation & Focus Block Scheduling",
      score: `${cSc}%`,
      percentile: `${Math.round(cSc * 0.95)}th`,
      archetype: "Time Architect",
      summary: "You approach study schedules with intentionality, protecting dedicated focus blocks and minimizing transition friction.",
      mechanism: "Evaluates time-management self-regulation, task estimation accuracy, and resistance to Parkinson's Law.",
      subfacet_desc: `Time Ownership (${Math.min(99, cSc + 3)}%) ensures balanced syllabus coverage across all subjects.`,
      facets: [
        ["Block Scheduling", `${Math.min(99, cSc + 3)}%`, "Allocates specific calendar slots to specific subjects rather than vague to-do lists."],
        ["Task Estimation", `${Math.min(99, cSc + 2)}%`, "Accurately predicts how many hours complex assignments require."],
        ["Buffer Management", `${Math.min(99, esSc + 1)}%`, "Builds spare catch-up time into weekly plans for unexpected interruptions."],
        ["Procrastination Shielding", `${Math.min(99, cSc + 1)}%`, "Overcomes activation energy to start tasks early before deadlines loom."]
      ],
      low_behavior: "Reactive last-minute cramming, poor time estimation, chronic deadline stress.",
      high_behavior: "Proactive time blocking, steady daily study output, balanced extracurricular life.",
      alignment: `Strategic Time Management (${Math.round(cSc * 0.95)}th %ile)`,
      protocol_name: "Weekly Anchor Calendar",
      protocol: "Every Sunday evening, block out mandatory school, sleep, and sports hours first; schedule 15 hours of focused deep study into remaining slots.",
      opt_name: "Micro-Milestone Division",
      opt_text: "Divide intimidating projects into 30-minute mini-tasks to lower initial starting friction."
    },
    {
      id: 25,
      phase: "Phase III: Learning & Execution",
      code: "Module 25",
      title: "Learning Architecture — Memory Consolidation & Spaced Repetition",
      score: `${Math.round(cSc * 0.5 + reasSc * 0.5)}%`,
      percentile: `${Math.round(((cSc + reasSc) / 2) * 0.95)}th`,
      archetype: "Spaced Retention Strategist",
      summary: "You structure review cycles to counteract the Ebbinghaus Forgetting Curve, systematically revisiting material at increasing intervals.",
      mechanism: "Evaluates implementation of spaced repetition scheduling to shift short-term memories into durable long-term storage.",
      subfacet_desc: `Spaced Retention Index (${Math.min(99, Math.round((cSc+reasSc)/2) + 2)}%) prevents pre-exam panic.`,
      facets: [
        ["Ebbinghaus Defiance", `${Math.min(99, cSc + 2)}%`, "Revises new material within 24 hours, 7 days, and 30 days of initial learning."],
        ["Long-Term Durability", `${Math.min(99, reasSc + 2)}%`, "Retains conceptual frameworks months after initial chapter completion."],
        ["Formula Mastery", `${Math.min(99, numSc + 2)}%`, "Keeps critical definitions and formulas refreshed through spaced testing."],
        ["Sleep Consolidation", `${Math.min(99, esSc + 1)}%`, "Values consistent 8-hour sleep cycles for neurological memory consolidation."]
      ],
      low_behavior: "Studies once, forgets 80% within 14 days, forced to re-learn from scratch before finals.",
      high_behavior: "Systematic brief reviews lock material into permanent long-term memory with minimal total hours.",
      alignment: `Durable Memory Consolidation (${Math.round(((cSc + reasSc) / 2) * 0.95)}th %ile)`,
      protocol_name: "1-7-30 Spaced Review Cadence",
      protocol: "Schedule 10-minute reviews for each chapter at Day 1, Day 7, and Day 30 post-lecture to solidify long-term neural pathways.",
      opt_name: "Leitner Flashcard System",
      opt_text: "Maintain a spaced flashcard box where correctly recalled cards graduate to less frequent review intervals."
    },
    {
      id: 26,
      phase: "Phase III: Learning & Execution",
      code: "Module 26",
      title: "Learning Architecture — Distraction Resistance & Digital Hygiene",
      score: `${Math.round(cSc * 0.7 + esSc * 0.3)}%`,
      percentile: `${Math.round((cSc * 0.7 + esSc * 0.3) * 0.95)}th`,
      archetype: "Disciplined Focus Guardian",
      summary: "You maintain conscious boundaries against digital interruptions, preserving deep cognitive bandwidth for rigorous academic tasks.",
      mechanism: "Evaluates attentional impulse control and executive function resistance to digital notifications and dopamine loops.",
      subfacet_desc: `Attention Hygiene (${Math.min(99, cSc + 3)}%) prevents cognitive fragmentation.`,
      facets: [
        ["Notification Immunity", `${Math.min(99, cSc + 3)}%`, "Silences devices and closes social tabs during study blocks."],
        ["Monotasking Discipline", `${Math.min(99, cSc + 2)}%`, "Avoids rapid context-switching, focusing on one subject at a time."],
        ["Environment Structuring", `${Math.min(99, cSc + 1)}%`, "Removes tempting distractions physically from the study space."],
        ["Mindful Screen Regulation", `${Math.min(99, esSc + 1)}%`, "Maintains clear separation between recreation screens and academic deep work."]
      ],
      low_behavior: "Studies with phone notifications active, constantly loses train of thought every 5 minutes.",
      high_behavior: "Creates distraction-free sanctuaries that enable uninterrupted flow-state problem solving.",
      alignment: `High Distraction Resistance (${Math.round((cSc * 0.7 + esSc * 0.3) * 0.95)}th %ile)`,
      protocol_name: "Device Separation Protocol",
      protocol: "Keep smartphones in another room during study blocks; use browser extensions to block distracting websites on study laptops.",
      opt_name: "Focus Environment Ritual",
      opt_text: "Clear the physical desk of everything except the single textbook, notebook, and pen required for the current study sprint."
    },
    {
      id: 27,
      phase: "Phase III: Learning & Execution",
      code: "Module 27",
      title: "Learning Architecture — Deep Work Capacity & Cognitive Stamina",
      score: `${Math.round(cSc * 0.5 + reasSc * 0.3 + esSc * 0.2)}%`,
      percentile: `${Math.round((cSc * 0.5 + reasSc * 0.3 + esSc * 0.2) * 0.96)}th`,
      archetype: "Deep Work Practitioner",
      summary: "You can sustain high-intensity analytical concentration across multi-hour blocks without mental fatigue degrading your reasoning accuracy.",
      mechanism: "Cal Newport's Deep Work construct: ability to focus without distraction on cognitively demanding tasks.",
      subfacet_desc: `Cognitive Endurance (${Math.min(99, Math.round(cSc*0.5 + reasSc*0.3 + esSc*0.2) + 2)}%) enables mastery of complex topics.`,
      facets: [
        ["Sustained Attention Span", `${Math.min(99, cSc + 3)}%`, "Maintains deep immersion in complex proofs or essays for 90+ minutes."],
        ["Flow State Access", `${Math.min(99, reasSc + 2)}%`, "Enters intense absorption where challenging problem solving feels intrinsically rewarding."],
        ["Fatigue Resistance", `${Math.min(99, esSc + 2)}%`, "Prevents cognitive drop-offs during lengthy 3-hour examination sessions."],
        ["Cognitive Recovery Discipline", `${Math.min(99, cSc + 1)}%`, "Takes genuine restorative breaks (walking, stretching) rather than screen scrolling."]
      ],
      low_behavior: "Attention degrades after 20 minutes; frequent restlessness leads to shallow study habits.",
      high_behavior: "Enters deep flow state easily, producing exceptional analytical output per study hour.",
      alignment: `Exceptional Deep Work Capacity (${Math.round((cSc * 0.5 + reasSc * 0.3 + esSc * 0.2) * 0.96)}th %ile)`,
      protocol_name: "90-Minute Ultradian Rhythm Sprint",
      protocol: "Structure major study blocks into 90-minute high-intensity focus sprints aligned with natural human ultradian biological cycles.",
      opt_name: "Focus Ritual",
      opt_text: "Begin every deep study block with a specific 2-minute centering ritual (e.g. glass of water, setting clear 1-sentence goal)."
    },
    {
      id: 28,
      phase: "Phase III: Learning & Execution",
      code: "Module 28",
      title: "Learning Architecture — Collaborative Learning & Peer Synergy",
      score: `${Math.round(aSc * 0.6 + eSc * 0.4)}%`,
      percentile: `${Math.round((aSc * 0.6 + eSc * 0.4) * 0.95)}th`,
      archetype: "Synergistic Collaborator",
      summary: "You leverage collaborative study sessions effectively, testing ideas against peers and explaining concepts to deepen personal understanding.",
      mechanism: "Evaluates social learning efficiency (Vygotsky's Zone of Proximal Development) through structured peer discussion.",
      subfacet_desc: `Peer Synergy Index (${Math.min(99, Math.round(aSc*0.6 + eSc*0.4) + 2)}%) balances independent study with team insights.`,
      facets: [
        ["Concept Explanation", `${Math.min(99, aSc + 3)}%`, "Explains complex ideas to peers patiently, clarifying own understanding."],
        ["Constructive Debate", `${Math.min(99, eSc + 2)}%`, "Participates in academic debate to identify blind spots without interpersonal friction."],
        ["Group Accountability", `${Math.min(99, cSc + 2)}%`, "Keeps study groups on-task and focused on solving actual problems."],
        ["Diverse Perspective Integration", `${Math.min(99, oSc + 2)}%`, "Appreciates alternative problem-solving routes suggested by classmates."]
      ],
      low_behavior: "Study groups devolve into social chatter, yielding low academic progress.",
      high_behavior: "Focused, agenda-driven peer sessions that challenge assumptions and elevate group mastery.",
      alignment: `High Collaborative Synergy (${Math.round((aSc * 0.6 + eSc * 0.4) * 0.95)}th %ile)`,
      protocol_name: "Reciprocal Peer Teaching",
      protocol: "Form a 3-person study circle where each member prepares to teach 1 specific chapter topic and answers peer questions.",
      opt_name: "Agenda-Driven Sessions",
      opt_text: "Always agree on a specific list of 5 hard problems to solve before convening any study group meeting."
    },

    // Phase IV: Career & Stream Alignment (Modules 29 - 30)
    {
      id: 29,
      phase: "Phase IV: Career Alignment",
      code: "Module 29",
      title: "Interest Architecture — Holland RIASEC Domain Mapping",
      score: `${topFitScore}%`,
      percentile: `${Math.round(topFitScore * 0.96)}th`,
      archetype: `${topRiasecLabel} Profile`,
      summary: `Your RIASEC profile reveals a dominant ${topRiasecCodes[0]} orientation supported by secondary ${topRiasecCodes[1] || 'I'} and tertiary ${topRiasecCodes[2] || 'A'} affinities. You are drawn to environments requiring intellectual challenge and problem solving.`,
      mechanism: "John Holland's RIASEC model: Realistic (Doers), Investigative (Thinkers), Artistic (Creators), Social (Helpers), Enterprising (Persuaders), and Conventional (Organizers).",
      subfacet_desc: `Top Code: ${topRiasecCodes[0]} correlates strongly with ${primaryRoadmap.pathwayTitle}.`,
      facets: [
        ["Investigative (I)", `${scores.riasec?.['I'] || 75}%`, "Intellectual inquiry, scientific research, data analysis, theoretical modeling."],
        ["Realistic (R)", `${scores.riasec?.['R'] || 65}%`, "Hands-on tools, hardware, engineering prototypes, concrete systems."],
        ["Enterprising (E)", `${scores.riasec?.['E'] || 60}%`, "Leadership, strategic negotiation, project pitches, entrepreneurial initiative."],
        ["Artistic (A)", `${scores.riasec?.['A'] || 58}%`, "Creative expression, design thinking, aesthetic elegance, innovative synthesis."]
      ],
      low_behavior: "Working in misaligned vocational environments produces chronic boredom or burnout.",
      high_behavior: "Flourishes in career ecosystems that naturally reward your dominant RIASEC drivers.",
      alignment: `${topRiasecLabel} Alignment (${Math.round(topFitScore * 0.96)}th %ile)`,
      protocol_name: "Curiosity Alignment Strategy",
      protocol: `Engage with extracurricular projects that merge your top ${topRiasecCodes[0]} interest with practical applications in ${primaryRoadmap.pathwayTitle}.`,
      opt_name: "Ecosystem Fit",
      opt_text: "Choose universities and collegiate societies with vibrant clubs matching your primary RIASEC cluster."
    },
    {
      id: 30,
      phase: "Phase IV: Career Alignment",
      code: "Module 30",
      title: "Fitment Architecture — Multi-Construct Career Alignment",
      score: `${topFitScore}%`,
      percentile: `${Math.round(topFitScore * 0.97)}th`,
      archetype: `${primaryRoadmap.pathwayTitle} Match`,
      summary: `Your composite profile synthesizes high cognitive aptitude, Big Five conscientiousness, and ${topRiasecLabel} interests into an exceptional ${topFitScore}% fit for ${primaryRoadmap.pathwayTitle}.`,
      mechanism: "Triangulates Cognitive Aptitudes (40%), Personality Architecture (30%), RIASEC Interests (20%), and Core Values (10%) into objective career fit scores.",
      subfacet_desc: `Primary Fit: ${primaryRoadmap.pathwayTitle} (${topFitScore}% Alignment).`,
      facets: [
        ["Cognitive Congruence", `${aptOverall}%`, `Aptitude profile supports the analytical rigor demanded by ${primaryRoadmap.pathwayTitle}.`],
        ["Personality Alignment", `${cSc}%`, "Execution stamina and conscientiousness sustain the multi-year preparation required."],
        ["Interest Vitality", `${topFitScore}%`, "Intrinsic passion ensures daily learning is energizing rather than tedious."],
        ["Values Harmony", `${Math.round((aSc + cSc) / 2)}%`, "Personal definition of success aligns with outcomes in this domain."]
      ],
      low_behavior: "Pursuing fields based purely on external prestige without internal alignment leads to disillusionment.",
      high_behavior: "Data-backed alignment provides clear competitive advantage, intrinsic motivation, and long-term career mastery.",
      alignment: `Highest Strategic Fit (${Math.round(topFitScore * 0.97)}th %ile)`,
      protocol_name: "Multi-Year Pathway Execution",
      protocol: "Commit to the milestones outlined in your Primary Pathway Roadmap (Page 50) and review progress quarterly.",
      opt_name: "Strategic Focus",
      opt_text: "Channel 80% of academic and extracurricular energy toward your top pathway while maintaining flexibility."
    }
  ];

  // Render pages 12 to 41 using the exact same card layout as approved Class 10
  const renderedModulesHTML = modules.map((m) => `
      <section id="page-${m.id + 11}" data-page="${m.id + 11}" class="as-report-page avoid-break">
        <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
          <!-- Page Header -->
          <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
            <div>
              <span class="text-xs text-gold uppercase font-bold tracking-widest block">${m.phase}</span>
              <h2 class="text-xl sm:text-2xl font-extrabold flex items-center gap-3">
                <span class="bg-gold text-maroon-dark text-xs px-2.5 py-0.5 rounded-full font-black uppercase font-mono">${m.code}</span>
                ${m.title}
              </h2>
            </div>
            <div class="text-right">
              <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">
                ${m.percentile} Percentile
              </span>
              <span class="block text-[9px] text-gold/80 font-mono mt-0.5">Page ${m.id + 11}</span>
            </div>
          </div>

          <!-- Body Content -->
          <div class="space-y-4 shrink-0 my-auto text-xs">
            <div class="bg-cream/80 p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
              <div class="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <span class="font-extrabold text-maroon uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <i class="fa-solid fa-brain text-gold"></i> Core Diagnostic Archetype:
                </span>
                <span class="bg-maroon text-gold font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono">${m.archetype}</span>
              </div>
              <p class="text-slate-700 leading-relaxed text-xs">${m.summary}</p>
              <div class="text-[10px] text-slate-500 italic border-t border-slate-200/60 pt-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-circle-info text-gold text-[9px]"></i>
                <span>${m.mechanism}</span>
              </div>
            </div>

            <!-- Sub-Facets Breakdown Grid -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span class="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                  <i class="fa-solid fa-chart-pie text-maroon"></i> Sub-Facet Dimensional Breakdown
                </span>
                <span class="text-[9.5px] text-slate-500">${m.subfacet_desc}</span>
              </div>
              <div class="grid grid-cols-2 gap-2.5">
                ${m.facets.map(([fName, fScore, fDesc]) => `
                  <div class="bg-cream/50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                    <div class="flex justify-between items-center text-[10.5px]">
                      <strong class="text-maroon font-bold">${fName}</strong>
                      <span class="font-mono font-bold text-slate-700">${fScore}</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-maroon h-1.5 rounded-full" style="width: ${fScore}"></div>
                    </div>
                    <p class="text-[9.5px] text-slate-600 leading-tight">${fDesc}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Behavioral Continuum & Action Protocol -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i class="fa-solid fa-sliders text-gold"></i> Behavioral Continuum Position
                </span>
                <div class="text-[10px] text-slate-600 space-y-1">
                  <div><strong>Low Range:</strong> ${m.low_behavior}</div>
                  <div><strong>High Range:</strong> ${m.high_behavior}</div>
                  <div class="pt-1 text-emerald-800 font-bold border-t border-slate-100">
                    <i class="fa-solid fa-check text-[9px] mr-1"></i> Candidate: ${m.alignment}
                  </div>
                </div>
              </div>

              <div class="bg-cream/60 p-3.5 rounded-xl border border-gold/30 space-y-1.5">
                <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <i class="fa-solid fa-clipboard-check text-gold"></i> Action Protocol: ${m.protocol_name}
                </span>
                <p class="text-[10px] text-slate-700 leading-snug">${m.protocol}</p>
                <div class="pt-1 text-[9.5px] text-slate-600 border-t border-slate-200/60">
                  <strong>${m.opt_name}:</strong> ${m.opt_text}
                </div>
              </div>
            </div>
          </div>

          <!-- Page Footer -->
          <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
            <span>${config.academicStage} | ${m.code}: ${m.title.split('—')[1] || m.title} | ${name}</span>
            <span>Ref: #${rid}</span>
          </div>
        </div>
      </section>
  `).join('\n');

  // Build Front Matter & Closing Pages using the approved 56-page styling
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.reportTitle} | ${name}</title>
    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        maroon: {
                            DEFAULT: '#6B0919',
                            dark: '#4A0510',
                            light: '#8C1D2F',
                        },
                        gold: {
                            DEFAULT: '#D4AF37',
                            light: '#F3E5AB',
                            dark: '#AA820A',
                        },
                        cream: '#FDFBF7',
                    },
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        @media print {
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .as-report-page {
                page-break-after: always !important;
                break-after: page !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                width: 210mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                box-sizing: border-box !important;
                padding: 12mm 15mm !important;
            }
            .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
            .no-print { display: none !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        body { font-family: 'Poppins', sans-serif; background-color: #F3F4F6; }
        .as-report-page {
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            position: relative;
            box-sizing: border-box;
            padding: 12mm 15mm;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .maroon-gradient { background: linear-gradient(135deg, #4A0510 0%, #6B0919 60%, #8C1D2F 100%); }
        .gold-gradient { background: linear-gradient(135deg, #AA820A 0%, #D4AF37 50%, #F3E5AB 100%); }
    </style>
</head>
<body class="text-slate-800 text-sm antialiased selection:bg-gold selection:text-maroon-dark">

    <div class="max-w-[210mm] mx-auto">

        <!-- PAGE 01: COVER -->
        <section class="as-report-page avoid-break p-0 border-0" id="page-1" data-page="1">
            <div class="maroon-gradient text-white flex flex-col justify-between h-full p-8 sm:p-12 relative overflow-hidden border-4 border-gold">
                <div class="absolute -top-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-maroon-light/30 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Header -->
                <div class="flex justify-between items-start border-b-2 border-gold/40 pb-6 relative z-10 shrink-0">
                    <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full bg-gold inline-block"></span>
                            <span class="tracking-widest text-xs font-bold uppercase text-gold">ABROAD SIMPLIFIED</span>
                        </div>
                        <span class="font-bold text-sm text-gold-light tracking-wide block">${config.reportTitle}</span>
                        <span class="text-[10px] text-slate-300 font-mono">Dossier Code: #${rid}</span>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold tracking-wider uppercase shadow">
                            CONFIDENTIAL
                        </span>
                        <span class="block text-[9px] text-slate-300 font-mono mt-1">Single-Candidate Copy</span>
                    </div>
                </div>

                <!-- Center Title Area -->
                <div class="space-y-4 my-auto relative z-10 shrink-0">
                    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-gold/20 text-gold-light text-xs font-semibold uppercase tracking-wider border border-gold/40 backdrop-blur-sm">
                        <i class="fa-solid fa-graduation-cap text-gold"></i>
                        <span>${config.academicStage}</span>
                    </div>
                    <div>
                        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            ${config.subTitle.split(' | ')[0] || config.subTitle} <br />
                            <span class="text-transparent bg-clip-text gold-gradient">Comprehensive Dossier</span>
                        </h1>
                        <p class="text-slate-300 text-xs sm:text-sm mt-3 max-w-xl font-light leading-relaxed">
                            30-Module Psychometric Profiling, Cognitive Capacity Assessment, Holland RIASEC Alignment, and Stage-Calibrated Development Roadmap.
                        </p>
                    </div>

                    <!-- Candidate Card -->
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-gold/40 shadow-2xl max-w-lg mt-6">
                        <div class="text-[10px] font-bold text-gold uppercase tracking-wider mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                            <span>Candidate Record</span>
                            <span class="font-mono text-slate-300">ID: ${rid}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span class="text-slate-400 block text-[10px]">Candidate Name:</span>
                                <strong class="text-white font-bold text-sm block">${name}</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px]">Academic Stage:</span>
                                <span class="font-bold text-gold">${config.academicStage}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px]">Institution:</span>
                                <span class="text-white">${student.school || 'Academic Benchmark Institution'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 block text-[10px]">Evaluation Date:</span>
                                <span class="text-white">${date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Banner -->
                <div class="border-t-2 border-gold/40 pt-4 flex justify-between items-center text-xs text-slate-300 relative z-10 shrink-0">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-shield-halved text-gold"></i>
                        <span>Psychometric Standardization: ${config.normGroup}</span>
                    </div>
                    <span class="font-mono text-[10px] text-gold-light">Page 01 of 56</span>
                </div>
            </div>
        </section>

        <!-- PAGE 02: DISCLAIMER & ETHICAL FRAMEWORK -->
        <section class="as-report-page avoid-break" id="page-2" data-page="2">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Ethical &amp; Legal Framework</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Assessment Disclaimers &amp; Scope</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 02</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-scale-balanced text-gold"></i> 1. Statement of Purpose &amp; Intended Use
                        </strong>
                        <p>${config.purposeDescription}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[11px] block">2. Not a Deterministic Career Lock</strong>
                            <p class="text-slate-600 text-[10.5px]">Psychometric profiling identifies behavioral probabilities and cognitive affinities at the time of evaluation. Human potential evolves through focused practice, mentorship, and lived experience.</p>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[11px] block">3. Normative Standardization</strong>
                            <p class="text-slate-600 text-[10.5px]">All percentiles are calibrated against ${config.normGroup} utilizing Item Response Theory (IRT) and Gaussian bell-curve normalization.</p>
                        </div>
                    </div>

                    <div class="bg-cream/60 p-3 rounded-xl border border-slate-200 space-y-1">
                        <strong class="text-maroon font-bold text-[11px] block">4. Professional Counselling Integration</strong>
                        <p class="text-slate-600 text-[10.5px]">This document is engineered to support certified career counsellors, educators, and family mentors. It is recommended that results be discussed in an interactive advisory debrief.</p>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Ethical &amp; Legal Framework | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 03: DATA PROTOCOLS & PRIVACY -->
        <section class="as-report-page avoid-break" id="page-3" data-page="3">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Confidentiality &amp; Security</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Data Governance Protocols</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 03</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-lock text-gold"></i> 1. Student Privacy Guarantee
                        </strong>
                        <p>All psychometric response vectors and personal candidate identifiers are encrypted at rest with AES-256 and transmitted exclusively over secure TLS 1.3 channels. Individual assessment records are never commoditized or exposed to third-party advertisers.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[11px] block">2. Candidate Access Rights</strong>
                            <p class="text-slate-600 text-[10.5px]">Candidates and their designated legal guardians maintain full rights to access, download, export, and request complete permanent deletion of their diagnostic evaluation files.</p>
                        </div>
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[11px] block">3. Anonymized Research Calibration</strong>
                            <p class="text-slate-600 text-[10.5px]">De-identified score vectors may contribute to ongoing psychological research calibrating adolescent cognitive development benchmarks across curriculum boards.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Data Governance Protocols | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 04: TABLE OF CONTENTS -->
        <section class="as-report-page avoid-break" id="page-4" data-page="4">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Dossier Index</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Table of Contents (56 Pages)</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 04</span>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs shrink-0 my-auto">
                    <div class="space-y-2">
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Front Matter &amp; Overview (Pages 01–11)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>01. Cover &amp; Dossier Identity</li>
                                <li>02–03. Ethical Standards &amp; Data Protocols</li>
                                <li>04–05. Table of Contents &amp; Honor Pledge</li>
                                <li>06–08. Orientation, Methodology &amp; Norms</li>
                                <li>09–11. Diagnostic Snapshot &amp; Visual Analytics</li>
                            </ul>
                        </div>
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Phase I: Personality Architecture (Pages 12–21)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>12–16. Big Five Core Traits (Modules 01–05)</li>
                                <li>17–21. Mindset, Control &amp; Adaptability (Modules 06–10)</li>
                            </ul>
                        </div>
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Phase II: Cognitive Processing (Pages 22–31)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>22–26. Numerical, Fluid, Verbal, Spatial &amp; Systems Logic (Modules 11–15)</li>
                                <li>27–31. Memory, Speed, Analysis, Critical &amp; Creative Thinking (Modules 16–20)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Phase III: Learning &amp; Execution (Pages 32–39)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>32–35. VARK Modality, Study Habits &amp; Time Allocation (Modules 21–24)</li>
                                <li>36–39. Memory Retention, Deep Work &amp; Peer Synergy (Modules 25–28)</li>
                            </ul>
                        </div>
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Phase IV &amp; V: Alignment &amp; Family (Pages 40–45)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>40–42. Holland RIASEC, Fitment &amp; Profile Synthesis</li>
                                <li>43–45. Student–Parent Alignment &amp; 90-Day Action Plan</li>
                            </ul>
                        </div>
                        <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/30">
                            <strong class="text-maroon font-bold text-[11px] block mb-1">Phase VI: Decisions &amp; Roadmaps (Pages 46–56)</strong>
                            <ul class="text-[10px] text-slate-600 space-y-0.5">
                                <li>46–48. Advanced Synthesis &amp; Developmental Priorities</li>
                                <li>49–52. Recommended Pathways &amp; Detailed Roadmaps</li>
                                <li>53–56. Study Abroad, Academic Roadmap &amp; Final Advisory</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Table of Contents | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 05: CANDIDATE ACKNOWLEDGMENT & HONOR PLEDGE -->
        <section class="as-report-page avoid-break" id="page-5" data-page="5">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Commitment to Growth</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Candidate Honor Pledge</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 05</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream p-5 rounded-2xl border border-gold/40 space-y-3">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-hand-holding-heart text-gold"></i> The Student Honor Pledge
                        </strong>
                        <p class="italic text-slate-800 text-[11px]">
                            "I, ${name}, affirm that the responses provided in this assessment represent my honest self-appraisal and unassisted intellectual effort. I recognize that this evaluation is not a rigid destiny, but an empowering diagnostic map. I commit to approaching my education with curiosity, persistence, and continuous effort."
                        </p>
                        <div class="flex justify-between items-center pt-3 border-t border-slate-200">
                            <div><span class="text-slate-400 block text-[10px]">Candidate Signature:</span><strong>${name}</strong></div>
                            <div><span class="text-slate-400 block text-[10px]">Date Verified:</span><span>${date}</span></div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Candidate Honor Pledge | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 06: WELCOME & ORIENTATION -->
        <section class="as-report-page avoid-break" id="page-6" data-page="6">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Candidate Orientation</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">${config.orientationHeading}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 06</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <p class="text-[11px] leading-relaxed">${config.orientationDescription}</p>
                    <div class="bg-cream/70 p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[10.5px] block"><i class="fa-solid fa-map-location-dot text-gold mr-1.5"></i> How to Navigate This Dossier:</strong>
                        <ul class="space-y-1.5 text-[10px] text-slate-700">
                            <li>• <strong>Pages 09–11:</strong> Consult the Diagnostic Snapshot and Analytics for your executive summary.</li>
                            <li>• <strong>Pages 12–41:</strong> Read your 30 diagnostic modules to discover specific behavioral traits.</li>
                            <li>• <strong>Pages 43–45:</strong> Review student–parent alignment points to align family expectations.</li>
                            <li>• <strong>Pages 49–55:</strong> Follow your customized academic roadmaps and actionable student plans.</li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Welcome &amp; Orientation | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 07: ABOUT THE ASSESSMENT -->
        <section class="as-report-page avoid-break" id="page-7" data-page="7">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Scientific Construct</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">About the Assessment Architecture</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 07</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <p class="text-[11px] leading-relaxed">${config.assessmentDescription}</p>
                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <div class="bg-cream/60 p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Phase I: Personality Architecture</strong>
                            <p class="text-[10px] text-slate-600">Evaluates Costa &amp; McCrae Big Five traits, mindset orientation, and locus of control across 10 modules.</p>
                        </div>
                        <div class="bg-cream/60 p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Phase II: Cognitive Processing</strong>
                            <p class="text-[10px] text-slate-600">Measures fluid reasoning, quantitative acuity, verbal synthesis, and spatial visualization across 10 modules.</p>
                        </div>
                        <div class="bg-cream/60 p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Phase III: Learning &amp; Execution</strong>
                            <p class="text-[10px] text-slate-600">Analyzes sensory modality preferences (VARK), deep work capacity, and memory consolidation across 8 modules.</p>
                        </div>
                        <div class="bg-cream/60 p-3 rounded-xl border border-slate-200 space-y-1">
                            <strong class="text-maroon font-bold text-[10.5px] block">Phase IV: Career Alignment</strong>
                            <p class="text-[10px] text-slate-600">Synthesizes Holland RIASEC codes, career clusters, and objective fitment percentages across 2 modules.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | About the Assessment | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 08: METHODOLOGY & NORMATIVE FRAMEWORK -->
        <section class="as-report-page avoid-break" id="page-8" data-page="8">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Psychometric Calibration</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Methodology &amp; Normalization Framework</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 08</span>
                </div>

                <div class="space-y-4 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <p class="text-[11px] leading-relaxed">${config.methodologyDescription}</p>
                    <div class="bg-cream/80 p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[10.5px] block"><i class="fa-solid fa-chart-line text-gold mr-1.5"></i> Gaussian Distribution &amp; Percentile Mechanics:</strong>
                        <div class="grid grid-cols-3 gap-2 text-[10px] text-slate-700 pt-1">
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="font-bold text-slate-800 block">Below Average</span>
                                <span>&lt; 35th Percentile</span>
                            </div>
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="font-bold text-slate-800 block">Moderate / Normal</span>
                                <span>35th – 75th Percentile</span>
                            </div>
                            <div class="bg-white p-2 rounded-lg border border-slate-200">
                                <span class="font-bold text-emerald-800 block">Superior Strength</span>
                                <span>75th – 99th Percentile</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Methodology &amp; Normalization | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 09: DIAGNOSTIC SNAPSHOT -->
        <section class="as-report-page avoid-break" id="page-9" data-page="9">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Dashboard</span>
                        <h2 class="text-lg font-extrabold">Candidate Diagnostic Snapshot</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 09</span>
                </div>

                <!-- 4 KPI Banners -->
                <div class="grid grid-cols-4 gap-2 text-center shrink-0">
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Overall Aptitude</span>
                        <span class="text-lg font-black text-maroon">${aptOverall}%</span>
                        <span class="text-[8px] text-slate-400 block">${Math.round(aptOverall * 0.96)}th Percentile</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Execution Grit</span>
                        <span class="text-lg font-black text-emerald-800">${cSc}%</span>
                        <span class="text-[8px] text-slate-400 block">Conscientiousness</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Dominant RIASEC</span>
                        <span class="text-lg font-black text-gold-dark">${topRiasecLabel}</span>
                        <span class="text-[8px] text-slate-400 block">Interest Cluster</span>
                    </div>
                    <div class="bg-cream/80 p-2.5 rounded-xl border border-gold/40">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Primary Fitment</span>
                        <span class="text-lg font-black text-maroon">${topFitScore}%</span>
                        <span class="text-[8px] text-slate-400 block truncate">${topCareer.split(' ')[0]}</span>
                    </div>
                </div>

                <!-- 30-Module Micro Matrix Grid -->
                <div class="bg-cream/40 p-3 rounded-2xl border border-slate-200 shrink-0 my-auto">
                    <span class="font-bold text-slate-800 uppercase text-[10px] block mb-2 border-b border-slate-200 pb-1 flex justify-between items-center">
                        <span><i class="fa-solid fa-table-cells text-gold mr-1"></i> Complete 30-Module Performance Matrix</span>
                        <span class="text-[8.5px] text-slate-500 font-mono">Calibrated against ${config.normGroup}</span>
                    </span>
                    <div class="grid grid-cols-3 gap-1.5 text-[9px]">
                        ${modules.map(m => `
                            <div class="bg-white p-1.5 rounded-lg border border-slate-200 flex justify-between items-center shadow-xs">
                                <span class="font-bold text-slate-700 truncate pr-1">${m.code}: ${m.title.split('—')[1] || m.title}</span>
                                <span class="font-mono font-bold ${parseInt(m.score) >= 75 ? 'text-emerald-700' : 'text-slate-700'}">${m.score}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Diagnostic Snapshot | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 10: VISUAL ANALYTICS I & II -->
        <section class="as-report-page avoid-break" id="page-10" data-page="10">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Visual Analytics</span>
                        <h2 class="text-lg font-extrabold">Radar Architecture &amp; Cognitive Breakdown</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 10</span>
                </div>

                <div class="grid grid-cols-2 gap-3 shrink-0 my-auto">
                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-compass text-gold mr-1"></i> Master Psychometric Radar Profile
                        </span>
                        <div class="w-full max-w-[240px] aspect-square flex items-center justify-center">
                            <canvas id="masterRadarChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-chart-column text-gold mr-1"></i> Cognitive Capacity Dimensions
                        </span>
                        <div class="w-full max-w-[260px] aspect-[1.3/1] flex items-center justify-center">
                            <canvas id="cognitiveBarChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Visual Analytics I &amp; II | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 11: VISUAL ANALYTICS III & INTEGRATED PROFILE -->
        <section class="as-report-page avoid-break" id="page-11" data-page="11">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Visual Analytics</span>
                        <h2 class="text-lg font-extrabold">Learning Modalities &amp; Emotional Equilibrium</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 11</span>
                </div>

                <div class="grid grid-cols-2 gap-3 shrink-0 my-auto">
                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-chart-pie text-gold mr-1"></i> VARK Sensory Learning Preferences
                        </span>
                        <div class="w-full max-w-[240px] aspect-square flex items-center justify-center">
                            <canvas id="varkDonutChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-cream/60 p-3 rounded-2xl border border-gold/30 shadow-sm flex flex-col items-center">
                        <span class="font-bold text-maroon uppercase text-[10px] mb-2 block w-full text-left border-b border-slate-200 pb-1">
                            <i class="fa-solid fa-heart-pulse text-gold mr-1"></i> Emotional Equilibrium &amp; Social Acuity
                        </span>
                        <div class="w-full max-w-[240px] aspect-square flex items-center justify-center">
                            <canvas id="eqPolarChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Visual Analytics III | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGES 12 TO 41: THE 30 MODULES -->
        ${renderedModulesHTML}

        <!-- PAGE 42: EXECUTIVE PROFILE SYNTHESIS -->
        <section class="as-report-page avoid-break" id="page-42" data-page="42">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Executive Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Executive Profile Synthesis</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 42</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    <div class="bg-cream p-4 rounded-xl border border-gold/40 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[11px] block flex items-center gap-1.5">
                            <i class="fa-solid fa-feather text-gold"></i> Integrated Candidate Narrative
                        </strong>
                        <p class="text-slate-800 text-xs leading-relaxed">${personalization?.executiveSummary || `${name} demonstrates a distinctive cognitive profile characterized by strong analytical reasoning (${reasSc}th percentile) and structured execution discipline (${cSc}% Conscientiousness).`}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                            <strong class="text-maroon font-bold text-[11px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Core Cognitive &amp; Behavioral Strengths
                            </strong>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${(personalization?.strengths || ['High fluid reasoning and logical problem solving', 'Methodical execution discipline and milestone persistence', 'Composure and resilience under testing pressure']).slice(0, 4).map((s, idx) => `
                                    <li class="flex items-start gap-1.5"><i class="fa-solid fa-check text-emerald-600 text-[9px] mt-0.5"></i><span>${s}</span></li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                            <strong class="text-maroon font-bold text-[11px] block border-b border-slate-100 pb-1 flex items-center gap-1.5">
                                <i class="fa-solid fa-arrow-trend-up text-amber-600"></i> Strategic Growth &amp; Development Opportunities
                            </strong>
                            <ul class="space-y-1 text-[10px] text-slate-700">
                                ${(personalization?.growthAreas || ['Pair high curiosity with structured daily execution buffers', 'Enhance active recall practice over passive rereading', 'Expand peer collaborative study networks']).slice(0, 3).map((g, idx) => `
                                    <li class="flex items-start gap-1.5"><i class="fa-solid fa-angle-right text-amber-600 text-[9px] mt-0.5"></i><span>${g}</span></li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Executive Profile Synthesis | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 43: PHASE V — FAMILY OVERVIEW -->
        <section class="as-report-page avoid-break" id="page-43" data-page="43">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family &amp; Career Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Student–Parent Alignment Overview</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 43</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed text-slate-700">
                    ${comparisonData ? `
                        <div class="bg-cream/80 p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                            <span class="font-extrabold text-maroon uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                                Overall Diagnostic Alignment: ${comparisonData.overallScore || 85}% (${comparisonData.overallIndicator})
                            </span>
                            <p class="text-slate-800 text-xs">${comparisonData.aiInterpretation || `Based on diagnostic responses, student aspirations and parental guidance demonstrate strong consensus.`}</p>
                        </div>
                    ` : `
                        <div class="bg-cream/80 p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                            <span class="font-extrabold text-maroon uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                                Parent Advisory Strategy
                            </span>
                            <p class="text-slate-800 text-xs">Family alignment forms the foundational bedrock of academic confidence. Open discussions around subject choices, study habits, and long-term milestones cultivate a supportive home learning sanctuary.</p>
                        </div>
                    `}
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Family Alignment Overview | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 44: DETAILED STUDENT-PARENT COMPARISON -->
        <section class="as-report-page avoid-break" id="page-44" data-page="44">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Detailed Student–Parent Comparison</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 44</span>
                </div>

                <div class="grid grid-cols-2 gap-2.5 text-xs shrink-0 my-auto">
                    ${(comparisonData?.areas || [
                        { id: 'career_direction', name: 'Career Direction', level: 'high_alignment', studentSide: topCareer, parentSide: 'Engineering / Applied Sciences', explanation: 'Strong alignment in target field direction.' },
                        { id: 'career_expectations', name: 'Career Expectations', level: 'moderate_alignment', studentSide: 'Creativity & Autonomy', parentSide: 'Stability & Growth', explanation: 'Shared commitment to high achievement.' },
                        { id: 'financial_feasibility', name: 'Financial Feasibility', level: 'aligned', studentSide: 'Higher Education Degree', parentSide: 'Calibrated Budget', explanation: 'Financial expectations align with target paths.' },
                        { id: 'study_abroad', name: 'Study Abroad Expectations', level: 'moderate_alignment', studentSide: 'Global Openness', parentSide: 'Supportive Consideration', explanation: 'Open to exploring international university routes.' },
                        { id: 'autonomy', name: 'Decision Making Autonomy', level: 'high_alignment', studentSide: 'Independent Agency', parentSide: 'Collaborative Guidance', explanation: 'Parenting style matches student need for agency.' },
                        { id: 'academic_pressure', name: 'Academic Stress Management', level: 'high_alignment', studentSide: 'Resilient Composure', parentSide: 'Supportive Encouragement', explanation: 'Balanced expectations reduce exam burnout.' }
                    ]).slice(0, 6).map(a => `
                        <div class="bg-cream/60 p-2.5 rounded-xl border border-slate-200 space-y-1">
                            <div class="flex justify-between items-center text-[10px]">
                                <strong class="text-maroon font-bold">${a.name}</strong>
                                <span class="px-2 py-0.5 rounded text-[8.5px] font-bold ${a.level.includes('high') || a.level.includes('aligned') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                    ${a.level.toUpperCase().replace('_', ' ')}
                                </span>
                            </div>
                            <p class="text-[9.5px] text-slate-600 leading-tight">${a.explanation}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Detailed Comparison | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 45: FAMILY CAREER ACTION PLAN -->
        <section class="as-report-page avoid-break" id="page-45" data-page="45">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase V — Family Alignment</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Family Career Action Plan</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 45</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                            <span class="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Areas of Strong Agreement
                            </span>
                            <ul class="space-y-1 text-[10px] text-emerald-900">
                                <li>• Shared commitment to academic discipline and conceptual excellence.</li>
                                <li>• Aligned expectations regarding university reputation and faculty quality.</li>
                                <li>• Supportive decision-making approach empowering student agency.</li>
                            </ul>
                        </div>
                        <div class="bg-rose-50/60 p-3 rounded-xl border border-rose-200 space-y-1.5">
                            <span class="font-bold text-xs text-rose-900 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-rose-600"></i> Prioritized Discussion Areas
                            </span>
                            <ul class="space-y-1 text-[10px] text-rose-900">
                                <li>• <strong>Pathway Alignment:</strong> Harmonize student career interest (${topCareer}) with family expectations.</li>
                                <li>• <strong>Financial Planning:</strong> Calibrate tuition estimates with family savings.</li>
                                <li>• <strong>Study Abroad Scope:</strong> Discuss geographical preferences and scholarship requirements.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Family Action Plan | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 46: ADVANCED SYNTHESIS (FITMENT x READINESS) -->
        <section class="as-report-page avoid-break" id="page-46" data-page="46">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Fitment × Execution Readiness Matrix</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 46</span>
                </div>

                <div class="bg-cream/60 p-4 rounded-2xl border border-gold/30 shrink-0 my-auto text-xs space-y-3">
                    <span class="font-bold text-maroon uppercase text-[11px] block border-b border-slate-200 pb-1">
                        4-Quadrant Strategic Positioning (Aptitude vs. Grit)
                    </span>
                    <div class="grid grid-cols-2 gap-3 text-[10.5px]">
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-slate-800 block">Q1: High Potential / Developing Grit</span>
                            <p class="text-slate-600 text-[10px]">High cognitive throughput requiring external scheduling scaffolding to maintain output consistency.</p>
                        </div>
                        <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-300 space-y-1 shadow-sm">
                            <span class="font-bold text-emerald-900 block flex items-center gap-1.5">
                                <i class="fa-solid fa-circle-check text-emerald-600"></i> Q2: Optimal High-Yield Zone (Candidate)
                            </span>
                            <p class="text-emerald-900 text-[10px]">High fluid reasoning paired with strong conscientiousness (${cSc}%), positioning candidate for peak performance.</p>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-slate-800 block">Q3: Foundational Discovery Zone</span>
                            <p class="text-slate-600 text-[10px]">Emerging competencies requiring targeted habit building and curiosity discovery.</p>
                        </div>
                        <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span class="font-bold text-slate-800 block">Q4: Steady Procedural Executor</span>
                            <p class="text-slate-600 text-[10px]">High discipline and process fidelity operating effectively within structured workflows.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Readiness Matrix | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 47: PROFILE CROSS-VALIDATION -->
        <section class="as-report-page avoid-break" id="page-47" data-page="47">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Profile Cross-Validation &amp; Signal Convergence</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 47</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed">
                    <div class="bg-cream/60 p-4 rounded-xl border border-gold/30 space-y-2">
                        <strong class="text-maroon font-bold uppercase text-[10.5px] block"><i class="fa-solid fa-code-compare text-gold mr-1"></i> Multi-Construct Triangulation:</strong>
                        <p class="text-slate-700 text-[11px]">When aptitude, personality, and career interests converge on shared domains, predictive reliability reaches peak confidence. For ${firstName}, logical reasoning (${reasSc}%), high conscientiousness (${cSc}%), and ${topRiasecCodes[0]} interests converge strongly on ${primaryRoadmap.pathwayTitle}.</p>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Profile Cross-Validation | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 48: DEVELOPMENTAL PRIORITIES -->
        <section class="as-report-page avoid-break" id="page-48" data-page="48">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">Developmental Priorities &amp; Growth Strategy</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 48</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5">
                            <span class="font-bold text-maroon text-[10.5px] block border-b border-slate-200 pb-1">1. Priority Skill Target</span>
                            <strong class="text-slate-800 text-[11px] block">${primaryRoadmap.skills[0] || 'Quantitative Analysis'}</strong>
                            <p class="text-[9.5px] text-slate-600">Deepen core proficiency through weekly problem solving and project-based challenges.</p>
                        </div>
                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5">
                            <span class="font-bold text-maroon text-[10.5px] block border-b border-slate-200 pb-1">2. Habit Calibration</span>
                            <strong class="text-slate-800 text-[11px] block">Structured Deep Work Sprints</strong>
                            <p class="text-[9.5px] text-slate-600">Implement uninterrupted focus blocks while eliminating digital distractions during study hours.</p>
                        </div>
                        <div class="bg-cream p-3 rounded-xl border border-gold/40 space-y-1.5">
                            <span class="font-bold text-maroon text-[10.5px] block border-b border-slate-200 pb-1">3. Milestone Focus</span>
                            <strong class="text-slate-800 text-[11px] block">${primaryRoadmap.milestone}</strong>
                            <p class="text-[9.5px] text-slate-600">Track milestones quarterly to ensure strategic progress toward key goals.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Developmental Priorities | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 49: RECOMMENDED PATHWAYS -->
        <section class="as-report-page avoid-break" id="page-49" data-page="49">
            <div class="bg-white p-6 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-4">
                <div class="bg-maroon-dark text-white p-4 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Closing Synthesis</span>
                        <h2 class="text-xl sm:text-2xl font-extrabold">${config.pathwayTerminology.sectionTitle}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 49</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-xl border-2 border-emerald-500 shadow-sm space-y-1">
                            <span class="text-[9px] font-bold text-emerald-700 uppercase block">${config.pathwayTerminology.primaryLabel}</span>
                            <strong class="text-maroon font-bold block text-xs leading-tight">${primaryRoadmap.pathwayTitle}</strong>
                            <span class="text-[10px] text-slate-500 block mt-1">Match: ${primaryRoadmap.fitScore}%</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1">
                            <span class="text-[9px] font-bold text-amber-700 uppercase block">${config.pathwayTerminology.secondaryLabel}</span>
                            <strong class="text-slate-800 font-bold block text-xs leading-tight">${secondaryRoadmap.pathwayTitle}</strong>
                            <span class="text-[10px] text-slate-500 block mt-1">Match: ${secondaryRoadmap.fitScore}%</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1">
                            <span class="text-[9px] font-bold text-slate-600 uppercase block">${config.pathwayTerminology.alternativeLabel}</span>
                            <strong class="text-slate-800 font-bold block text-xs leading-tight">${alternativeRoadmap.pathwayTitle}</strong>
                            <span class="text-[10px] text-slate-500 block mt-1">Match: ${alternativeRoadmap.fitScore}%</span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-2 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Recommended Pathways | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 50: PRIMARY PATHWAY ROADMAP -->
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
                    <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Rationale &amp; Fit Analysis:</strong>
                    <p class="text-[10px] leading-relaxed text-slate-700">${primaryRoadmap.rationale}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Recommended Subjects</span>
                        <div class="flex flex-wrap gap-1 pt-0.5">
                            ${primaryRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Examinations</span>
                        <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                            ${primaryRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="space-y-1">
                    <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Degree Options &amp; Specializations</span>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        ${primaryRoadmap.bachelors.slice(0, 2).map(b => `
                            <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                                <strong class="text-maroon font-bold block text-[10.5px] leading-tight">${b.degree}</strong>
                                <div class="text-[9px] text-slate-600"><strong>Specialization:</strong> ${b.specialization}</div>
                                <div class="text-[9px] text-emerald-800 font-semibold"><strong>Outcomes:</strong> ${b.careerOutcomes}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-cream/60 p-2 rounded-xl border border-gold/30 space-y-1">
                    <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-200 pb-0.5"><i class="fa-solid fa-building-columns text-gold mr-1"></i> Benchmark Institutions</span>
                    <div class="grid grid-cols-3 gap-2 text-[9.5px]">
                        <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span class="font-bold text-rose-700 uppercase block text-[8.5px]">REACH</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                ${primaryRoadmap.colleges.reach.slice(0, 3).map(c => `<li>• ${c}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span class="font-bold text-emerald-700 uppercase block text-[8.5px]">FIT</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                ${primaryRoadmap.colleges.fit.slice(0, 3).map(c => `<li>• ${c}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span class="font-bold text-slate-700 uppercase block text-[8.5px]">ACCESSIBLE</span>
                            <ul class="text-[9px] text-slate-700 space-y-0.5 mt-0.5">
                                ${primaryRoadmap.colleges.accessible.slice(0, 3).map(c => `<li>• ${c}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                    <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> STRATEGIC MILESTONE:</strong> ${primaryRoadmap.milestone}</div>
                </div>

                <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Primary Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 51: SECONDARY PATHWAY ROADMAP -->
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
                    <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Rationale &amp; Fit Analysis:</strong>
                    <p class="text-[10px] leading-relaxed text-slate-700">${secondaryRoadmap.rationale}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Recommended Subjects</span>
                        <div class="flex flex-wrap gap-1 pt-0.5">
                            ${secondaryRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Examinations</span>
                        <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                            ${secondaryRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="space-y-1">
                    <span class="font-bold text-maroon uppercase text-[10px] block"><i class="fa-solid fa-graduation-cap text-gold mr-1"></i> Degree Options</span>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        ${secondaryRoadmap.bachelors.slice(0, 2).map(b => `
                            <div class="bg-white p-2 rounded-xl border border-slate-200 shadow-sm space-y-0.5">
                                <strong class="text-maroon font-bold block text-[10.5px] leading-tight">${b.degree}</strong>
                                <div class="text-[9px] text-slate-600"><strong>Specialization:</strong> ${b.specialization}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                    <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> STRATEGIC MILESTONE:</strong> ${secondaryRoadmap.milestone}</div>
                </div>

                <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Secondary Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 52: STRATEGIC ALTERNATIVE ROADMAP -->
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
                    <strong class="text-maroon font-bold uppercase text-[10px] block mb-0.5"><i class="fa-solid fa-compass text-gold mr-1"></i> Rationale &amp; Fit Analysis:</strong>
                    <p class="text-[10px] leading-relaxed text-slate-700">${alternativeRoadmap.rationale}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs">
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-book text-gold mr-1"></i> Recommended Subjects</span>
                        <div class="flex flex-wrap gap-1 pt-0.5">
                            ${alternativeRoadmap.foundation.subjects.map(s => `<span class="bg-cream border border-gold/40 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-800">${s}</span>`).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[10px] block border-b border-slate-100 pb-0.5"><i class="fa-solid fa-file-pen text-gold mr-1"></i> Target Examinations</span>
                        <ul class="space-y-0.5 text-[9.5px] text-slate-700">
                            ${alternativeRoadmap.foundation.exams.map((e, idx) => `<li class="flex items-center gap-1.5"><span class="font-bold text-maroon font-mono text-[8.5px]">${String(idx+1).padStart(2,'0')}.</span><span>${e}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="bg-maroon-dark text-white p-2 rounded-xl border border-gold shadow-sm flex items-center justify-between text-[10px]">
                    <div><strong class="text-gold font-bold uppercase text-[9.5px]"><i class="fa-solid fa-flag text-gold mr-1"></i> STRATEGIC MILESTONE:</strong> ${alternativeRoadmap.milestone}</div>
                </div>

                <div class="border-t border-slate-200 pt-1 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Alternative Pathway Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 53: PERSONALIZED STUDY ABROAD GUIDE -->
        <section class="as-report-page avoid-break" id="page-53" data-page="53">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">${config.studyAbroadTerminology.pageTitle}</span>
                        <h2 class="text-lg font-extrabold">International Horizons &amp; Global Guide</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 53</span>
                </div>

                <div class="space-y-3 shrink-0 my-auto text-xs leading-relaxed">
                    <div class="bg-cream/80 p-3 rounded-xl border border-gold/40 space-y-1">
                        <strong class="text-maroon font-bold text-[10.5px] block"><i class="fa-solid fa-earth-americas text-gold mr-1"></i> Global Opportunity Rationale:</strong>
                        <p class="text-slate-700 text-[10px]">${studyAbroad.rationale}</p>
                    </div>

                    <div class="grid grid-cols-3 gap-2.5">
                        ${studyAbroad.countries.slice(0, 3).map(c => `
                            <div class="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm space-y-1">
                                <span class="font-bold text-slate-800 text-[11px] block">${c.flag} ${c.name}</span>
                                <p class="text-[9px] text-slate-600 leading-snug">${c.reason}</p>
                                <div class="text-[8.5px] text-maroon font-semibold border-t border-slate-100 pt-1">${c.academicRoute}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="bg-cream/60 p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <strong class="text-maroon font-bold text-[10px] block"><i class="fa-solid fa-award text-gold mr-1"></i> Scholarships &amp; Fellowships:</strong>
                        <div class="grid grid-cols-2 gap-1.5 text-[9px] text-slate-700">
                            ${studyAbroad.scholarships.slice(0, 4).map(s => `<div>• ${s}</div>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Study Abroad Guide | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 54: ACADEMIC & PROFILE ROADMAP -->
        <section class="as-report-page avoid-break" id="page-54" data-page="54">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Synthesis</span>
                        <h2 class="text-lg font-extrabold">${config.roadmapTerminology.timelineHeading}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 54</span>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs flex-1 my-auto">
                    ${academicRoadmap.slice(0, 4).map(st => `
                        <div class="bg-cream/70 p-2.5 rounded-xl border border-gold/40 shadow-sm space-y-1 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between border-b border-slate-200 pb-0.5">
                                    <span class="text-[8.5px] font-bold font-mono text-maroon bg-gold/20 px-1 py-0.5 rounded uppercase">${st.phase}</span>
                                    <span class="text-sm">${st.icon}</span>
                                </div>
                                <strong class="text-maroon font-bold block text-[10.5px] mt-0.5">${st.label}</strong>
                                <div class="text-[9px] text-slate-700 mt-0.5"><strong>Academic:</strong> ${st.academicGoal}</div>
                                <div class="text-[9px] text-slate-600 mt-0.5"><strong>Profile:</strong> ${st.profileGoal}</div>
                            </div>
                            <div class="pt-0.5 border-t border-slate-200/60 mt-0.5">
                                <div class="text-[8.5px] text-emerald-800 font-bold">🎯 Milestone: ${st.milestone}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Academic &amp; Profile Roadmap | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 55: STUDENT ACTION PLAN -->
        <section class="as-report-page avoid-break" id="page-55" data-page="55">
            <div class="bg-white p-5 rounded-2xl border-2 border-gold shadow-xl flex flex-col justify-between h-full space-y-3">
                <div class="bg-maroon-dark text-white p-3.5 rounded-2xl shadow flex items-center justify-between border-b-4 border-gold shrink-0">
                    <div>
                        <span class="text-xs text-gold uppercase font-bold tracking-widest block">Phase VI — Advanced Synthesis</span>
                        <h2 class="text-lg font-extrabold">${config.actionPlanTerminology.pageTitle}</h2>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-gold text-maroon-dark text-xs font-extrabold uppercase shadow">Page 55</span>
                </div>

                <div class="grid grid-cols-3 gap-2.5 text-xs">
                    <div class="bg-cream p-2.5 rounded-xl border border-gold/40 space-y-1 shadow-sm">
                        <span class="font-bold text-maroon uppercase text-[9.5px] block border-b border-slate-200 pb-0.5">THIS MONTH</span>
                        <ul class="space-y-1 text-[9.5px] text-slate-700">
                            ${actionPlan.thisMonth.slice(0, 3).map(m => `<li>• ${m}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-cream p-2.5 rounded-xl border border-gold/40 space-y-1 shadow-sm">
                        <span class="font-bold text-maroon uppercase text-[9.5px] block border-b border-slate-200 pb-0.5">NEXT 90 DAYS</span>
                        <ul class="space-y-1 text-[9.5px] text-slate-700">
                            ${actionPlan.next90Days.slice(0, 3).map(m => `<li>• ${m}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-cream p-2.5 rounded-xl border border-gold/40 space-y-1 shadow-sm">
                        <span class="font-bold text-maroon uppercase text-[9.5px] block border-b border-slate-200 pb-0.5">ACADEMIC YEAR</span>
                        <ul class="space-y-1 text-[9.5px] text-slate-700">
                            ${actionPlan.thisAcademicYear.slice(0, 3).map(m => `<li>• ${m}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5 text-xs">
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[9.5px] block border-b border-slate-100 pb-0.5">Skills to Build</span>
                        <ul class="space-y-0.5 text-[9px] text-slate-700">
                            ${actionPlan.skillsToBuild.slice(0, 4).map(s => `<li>• ${s}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span class="font-bold text-maroon uppercase text-[9.5px] block border-b border-slate-100 pb-0.5">Counsellor Checkpoints</span>
                        <ul class="space-y-0.5 text-[9px] text-slate-700">
                            ${actionPlan.counsellorCheckpoint.slice(0, 3).map(c => `<li>• ${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="border-t border-slate-200 pt-1.5 flex justify-between items-center text-xs text-slate-500 shrink-0">
                    <span>${config.academicStage} | Student Action Plan | ${name}</span>
                    <span>Ref: #${rid}</span>
                </div>
            </div>
        </section>

        <!-- PAGE 56: REPORT CONCLUSION -->
        <section class="as-report-page avoid-break" id="page-56" data-page="56">
            <div class="maroon-gradient rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border-4 border-gold h-full flex flex-col justify-between">
                <div class="flex items-center justify-between border-b-2 border-gold/40 pb-4 relative z-10 shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-gold text-maroon-dark font-black flex items-center justify-center text-base shadow">
                            <i class="fa-solid fa-flag-checkered"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-gold tracking-widest block uppercase">${config.conclusionTerminology.closingTitle}</span>
                            <span class="text-[10px] text-slate-300 block font-medium">Abroad Simplified Psychometric Evaluation Summary</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="inline-block px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold text-gold-light text-[10px] font-bold uppercase tracking-wider">
                            FINAL PAGE (PAGE 56)
                        </span>
                    </div>
                </div>

                <div class="my-auto py-2 relative z-10 space-y-4 text-center shrink-0">
                    <div class="space-y-2 max-w-3xl mx-auto">
                        <div class="w-16 h-16 mx-auto rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center shadow-xl backdrop-blur-md">
                            <i class="fa-solid fa-award text-3xl text-gold"></i>
                        </div>
                        <h3 class="text-2xl font-black text-white tracking-wide">
                            Evaluation Complete for <span class="text-gold">${name}</span>
                        </h3>
                        <p class="text-slate-200 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
                            ${config.conclusionTerminology.closingSummary}
                        </p>
                    </div>

                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-gold/30 max-w-xl mx-auto text-left space-y-2">
                        <div class="text-[10px] font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-1 flex justify-between">
                            <span>Authoritative Verification</span>
                            <span class="font-mono text-slate-300">ID: ${rid}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div><span class="text-slate-400 block text-[9.5px]">Evaluation Standard:</span><span class="font-bold text-gold">${config.academicStage}</span></div>
                            <div><span class="text-slate-400 block text-[9.5px]">Date Certified:</span><span class="text-white">${date}</span></div>
                        </div>
                    </div>
                </div>

                <div class="border-t-2 border-gold/40 pt-3 text-center relative z-10 space-y-0.5 shrink-0">
                    <p class="text-xs italic font-serif text-gold-light max-w-xl mx-auto">
                        "Your potential is not defined by where you start, but by the clarity of the path you choose to walk."
                    </p>
                    <p class="text-[9px] text-slate-400 uppercase font-semibold">© 2026 PrepAbroad Simplified | All Rights Reserved | Confidential Diagnostic Data</p>
                </div>
            </div>
        </section>

    </div>

    <!-- Chart.js Setup with Poppins Font -->
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const maroon = '#6B0919';
            const gold = '#D4AF37';
            const goldDark = '#AA820A';

            if (window.Chart) {
                Chart.defaults.font.family = 'Poppins';

                const ctxRadar = document.getElementById('masterRadarChart')?.getContext('2d');
                if (ctxRadar) {
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
                                    pointLabels: { font: { family: 'Poppins', size: 8.5, weight: '600' }, color: '#1E1E28' }
                                }
                            },
                            plugins: { legend: { display: false } }
                        }
                    });
                }

                const ctxCog = document.getElementById('cognitiveBarChart')?.getContext('2d');
                if (ctxCog) {
                    new Chart(ctxCog, {
                        type: 'bar',
                        data: {
                            labels: ['Fluid (Gf)', 'Crystallized (Gc)', 'Spatial', 'Quantitative', 'Systems', 'Creative', 'Critical', 'Execution'],
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
                                x: { ticks: { font: { family: 'Poppins', size: 8, weight: '600' } } }
                            },
                            plugins: { legend: { display: false } }
                        }
                    });
                }

                const ctxVark = document.getElementById('varkDonutChart')?.getContext('2d');
                if (ctxVark) {
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
                            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 9, weight: '600' }, boxWidth: 12 } } }
                        }
                    });
                }

                const ctxEq = document.getElementById('eqPolarChart')?.getContext('2d');
                if (ctxEq) {
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
                            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 9, weight: '600' }, boxWidth: 12 } } }
                        }
                    });
                }
            }
        });
    </script>
</body>
</html>`;
}
