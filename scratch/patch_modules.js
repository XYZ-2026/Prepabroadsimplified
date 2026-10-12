const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/app/(main)/psychometric-test/class10_html_report_builder.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add helper variables before const modules = [
const helperInjection = `  const tDominant = tAvg > fAvg;

  const mbtiSensingArchetype = isSensingBalanced
    ? "Balanced Sensing Integrator (Si/Se)"
    : siDominant
    ? "Introverted Sensing (Si) Grounding"
    : "Extraverted Sensing (Se) Explorer";

  const mbtiSensingSummary = isSensingBalanced
    ? "Your Sensing cognitive preference maintains an equilibrium between internal procedural precedent (Si) and real-time empirical engagement (Se), enabling flexible situational adaptation."
    : siDominant
    ? "Your Sensing function relies on Introverted Sensing (Si) as a stabilizing secondary filter. You compare active inputs against historical precedent, empirical data archives, and established operating procedures."
    : "Your Sensing function emphasizes Extraverted Sensing (Se), prioritizing real-time tactile engagement, pragmatic experimentation, and responsiveness to active situational dynamics.";

  const mbtiSensingAlignment = isSensingBalanced
    ? \`Balanced Sensing Integrator (\${Math.round(((spatSc + numSc) / 2) * 0.95)}th %ile)\`
    : \`\${siDominant ? 'Introverted Sensing (Si Dominant)' : 'Extraverted Sensing (Se Dominant)'} (\${Math.round(((spatSc + numSc) / 2) * 0.95)}th %ile)\`;

  const mbtiIntuitionArchetype = isIntuitionBalanced
    ? "Integrated Dual Intuitive (Ni/Ne)"
    : niDominant
    ? "Introverted Intuition (Ni) Dominant"
    : "Extraverted Intuition (Ne) Divergent";

  const mbtiIntuitionSummary = isIntuitionBalanced
    ? "You demonstrate an integrated intuitive profile, balancing convergent strategic foresight (Ni) with lateral cross-domain associative exploration (Ne)."
    : niDominant
    ? "Introverted Intuition (Ni) is your core perceiving function. You excel at synthesizing fragmented signals into singular strategic visions, anticipating long-range systemic shifts with high confidence."
    : "Extraverted Intuition (Ne) drives your perceiving function, generating prolific lateral ideas, creative brainstorming paths, and interdisciplinary associations.";

  const mbtiIntuitionAlignment = isIntuitionBalanced
    ? \`Integrated Dual Intuitive (\${Math.min(99, Math.round(oSc * 0.98))}th %ile)\`
    : \`\${niDominant ? 'Dominant Ni Strategist' : 'Exploratory Ne Innovator'} (\${Math.min(99, Math.round(oSc * 0.98))}th %ile)\`;

  const mbtiDecisionArchetype = isTfBalanced
    ? "Contextual Decision Integrator (T/F)"
    : tDominant
    ? "Extraverted Thinking (Te) Executive"
    : "Values-Driven & Empathetic Decision Modeler (Fe/Fi)";

  const mbtiDecisionSummary = isTfBalanced
    ? "Your decision-making model balances objective cause-and-effect logic with empathetic values assessment, adapting criteria based on human impact and project context."
    : tDominant
    ? "Your rational decision model is anchored in Extraverted Thinking (Te) — systematic cause-effect logic, objective performance metrics, structural efficiency, and high task velocity."
    : "Your decision evaluation is guided by core personal values, interpersonal harmony (Fe), and human impact considerations, prioritizing stakeholder alignment alongside practical outcomes.";

  const mbtiDecisionAlignment = isTfBalanced
    ? \`Contextual Decision Integrator (\${Math.round(((cSc + reasSc) / 2) * 0.96)}th %ile)\`
    : \`\${tDominant ? 'Objective Te Executive' : 'Values-Driven Decision Maker'} (\${Math.round(((cSc + reasSc) / 2) * 0.96)}th %ile)\`;

  const fluidArchetype = reasSc >= 70
    ? "Algorithmic Fluid Logic"
    : reasSc >= 45
    ? "Analytical Problem Solver"
    : "Structured Step-by-Step Reasoner";

  const fluidSummary = reasSc >= 70
    ? "Your Fluid Intelligence reflects strong reasoning capacity. You rapidly decode complex matrix patterns, unmapped logical rules, and non-linear data structures without relying on prior instructions."
    : reasSc >= 45
    ? "Your Fluid Intelligence demonstrates balanced logical deduction. You process abstract patterns effectively when supported by clear contextual frameworks."
    : "Your Fluid Intelligence indicates a grounded, methodical learning style. You solve problems most effectively through structured step-by-step algorithms, explicit examples, and proven templates rather than high-ambiguity abstract puzzles.";

  const fluidAlignment = reasSc >= 70
    ? \`Top Tier Fluid Logic (\${Math.round(reasSc * 0.97)}th %ile)\`
    : reasSc >= 45
    ? \`Balanced Analytical Logic (\${Math.round(reasSc * 0.97)}th %ile)\`
    : \`Structured Step-by-Step Reasoner (\${Math.round(reasSc * 0.97)}th %ile)\`;

  const spatialArchetype = spatSc >= 70
    ? "3D Systems Spatializer"
    : spatSc >= 45
    ? "Applied Spatial Visualizer"
    : "Linear & Text-Oriented Spatializer";

  const spatialSummary = spatSc >= 70
    ? "You mentally rotate 3D objects, visualize multi-layered system architectures, and map spatial relationships with clarity."
    : spatSc >= 45
    ? "You process spatial layouts and diagrams reliably when accompanied by clear labels and structural references."
    : "You demonstrate a strong preference for verbal, textual, and procedural explanations over complex mental 3D rotations or topological abstractions.";

  const spatialAlignment = spatSc >= 70
    ? \`High Spatial Visualizer (\${Math.round(spatSc * 0.96)}th %ile)\`
    : spatSc >= 45
    ? \`Applied Spatial Processor (\${Math.round(spatSc * 0.96)}th %ile)\`
    : \`Linear & Text-Oriented Processor (\${Math.round(spatSc * 0.96)}th %ile)\`;

  const systemsArchetype = reasSc >= 70
    ? "Master Systems Architect"
    : reasSc >= 45
    ? "Applied Process Modeler"
    : "Structured Workflow Implementer";

  const systemsSummary = reasSc >= 70
    ? "You map multi-loop feedback systems, identify hidden leverage points, and anticipate non-obvious ripple effects across complex operations."
    : reasSc >= 45
    ? "You analyze operational processes methodically, tracing input-output flows and component dependencies across workflows."
    : "You approach systems through structured operational workflows, excelling at implementing clearly defined procedures and reliable execution routines.";

  const systemsAlignment = reasSc >= 70
    ? \`Master Systems Architect (\${Math.min(99, Math.round(reasSc * 0.98))}th %ile)\`
    : reasSc >= 45
    ? \`Applied Process Modeler (\${Math.min(99, Math.round(reasSc * 0.98))}th %ile)\`
    : \`Structured Workflow Implementer (\${Math.min(99, Math.round(reasSc * 0.98))}th %ile)\`;

  const criticalArchetype = reasSc >= 70
    ? "Cognitive Error Auditor"
    : reasSc >= 45
    ? "Pragmatic Evidence Reviewer"
    : "Procedural Checklist Reviewer";

  const criticalAlignment = reasSc >= 70
    ? \`Rigorous Bias Auditor (\${Math.round(reasSc * 0.96)}th %ile)\`
    : reasSc >= 45
    ? \`Pragmatic Evidence Reviewer (\${Math.round(reasSc * 0.96)}th %ile)\`
    : \`Procedural Checklist Reviewer (\${Math.round(reasSc * 0.96)}th %ile)\`;`;

content = content.replace('  const tDominant = tAvg > fAvg;', helperInjection);

// 2. Update Module 06
const oldM06 = `      archetype: "Introverted Sensing (Si) Grounding",
      summary: "Your Sensing function relies on Introverted Sensing (Si) as a stabilizing secondary filter. You compare active inputs against historical precedent, empirical data archives, and established operating procedures.",
      mechanism: "Introverted Sensing (Si) operates as an internal database of historical facts, detailed procedures, and precedent.",
      subfacet_desc: \`Detail Retention (\${Math.min(99, spatSc + 4)}%) provides a strong grounding counterweight to speculative ideas, verifying compliance with documentation guidelines.\`,
      facets: [
        ["Introverted Sensing (Si)", \`\${Math.min(99, spatSc + 2)}%\`, "Compares current data against an internal database of historical facts."],
        ["Extraverted Sensing (Se)", \`\${Math.max(35, spatSc - 20)}%\`, "Lower preference for immediate real-time sensory physical engagement."],
        ["Detail Retention", \`\${Math.min(99, spatSc + 4)}%\`, "High accuracy in tracking historical data points, numbers, and precedents."],
        ["Practical Precedent", \`\${spatSc}%\`, "Ensures abstract theories comply with proven historical operating frameworks."]
      ],
      low_behavior: "Real-time tactical action, hands-on experimentation, present focus (Se).",
      high_behavior: "Historical archive reliance, procedural precision, structural consistency (Si).",
      alignment: "Introverted Sensing (Si Dominant)",`;

const newM06 = `      archetype: mbtiSensingArchetype,
      summary: mbtiSensingSummary,
      mechanism: "Introverted Sensing (Si) operates as an internal database of historical facts, detailed procedures, and precedent.",
      subfacet_desc: \`Detail Retention (\${Math.min(99, spatSc + 4)}%) provides a strong grounding counterweight to speculative ideas, verifying compliance with documentation guidelines.\`,
      facets: [
        ["Introverted Sensing (Si)", \`\${Math.min(99, spatSc + 2)}%\`, "Compares current data against an internal database of historical facts."],
        ["Extraverted Sensing (Se)", \`\${Math.max(35, spatSc - 20)}%\`, "Lower preference for immediate real-time sensory physical engagement."],
        ["Detail Retention", \`\${Math.min(99, spatSc + 4)}%\`, "High accuracy in tracking historical data points, numbers, and precedents."],
        ["Practical Precedent", \`\${spatSc}%\`, "Ensures abstract theories comply with proven historical operating frameworks."]
      ],
      low_behavior: "Real-time tactical action, hands-on experimentation, present focus (Se).",
      high_behavior: "Historical archive reliance, procedural precision, structural consistency (Si).",
      alignment: mbtiSensingAlignment,`;

content = content.replace(oldM06, newM06);

// 3. Update Module 07
const oldM07 = `      archetype: "Introverted Intuition (Ni) Dominant",
      summary: "Introverted Intuition (Ni) is your core perceiving function. You excel at synthesizing fragmented signals into singular strategic visions, anticipating long-range systemic shifts with high confidence.",
      mechanism: "Introverted Intuition (Ni) is a convergent perceiving engine that condenses high volumes of abstract data into focused overarching insights.",
      subfacet_desc: \`Pattern Recognition (\${Math.min(99, oSc + 4)}%) and Strategic Foresight (\${Math.min(99, oSc + 2)}%) define your primary cognitive lens for long-term project planning.\`,
      facets: [
        ["Introverted Intuition (Ni)", \`\${Math.min(99, oSc + 4)}%\`, "Synthesizes complex signals into singular, long-range strategic visions."],
        ["Extraverted Intuition (Ne)", \`\${Math.max(45, oSc - 15)}%\`, "Explores divergent possibilities and lateral associations across domains."],
        ["Pattern Recognition", \`\${Math.min(99, oSc + 5)}%\`, "Decodes hidden structural patterns and non-linear trends effortlessly."],
        ["Future Trajectory Vision", \`\${Math.min(99, oSc + 2)}%\`, "High predictive accuracy in projecting long-term systemic developments."]
      ],
      low_behavior: "Explores divergent brainstorming paths without converging on a single vision (Ne).",
      high_behavior: "Synthesizes complex data into singular long-range strategic frameworks (Ni).",
      alignment: \`Dominant Ni Strategist (\${Math.min(99, Math.round(oSc * 0.98))}th %ile)\`,`;

const newM07 = `      archetype: mbtiIntuitionArchetype,
      summary: mbtiIntuitionSummary,
      mechanism: "Introverted Intuition (Ni) is a convergent perceiving engine that condenses high volumes of abstract data into focused overarching insights.",
      subfacet_desc: \`Pattern Recognition (\${Math.min(99, oSc + 4)}%) and Strategic Foresight (\${Math.min(99, oSc + 2)}%) define your primary cognitive lens for long-term project planning.\`,
      facets: [
        ["Introverted Intuition (Ni)", \`\${Math.min(99, oSc + 4)}%\`, "Synthesizes complex signals into singular, long-range strategic visions."],
        ["Extraverted Intuition (Ne)", \`\${Math.max(45, oSc - 15)}%\`, "Explores divergent possibilities and lateral associations across domains."],
        ["Pattern Recognition", \`\${Math.min(99, oSc + 5)}%\`, "Decodes hidden structural patterns and non-linear trends effortlessly."],
        ["Future Trajectory Vision", \`\${Math.min(99, oSc + 2)}%\`, "High predictive accuracy in projecting long-term systemic developments."]
      ],
      low_behavior: "Explores divergent brainstorming paths without converging on a single vision (Ne).",
      high_behavior: "Synthesizes complex data into singular long-range strategic frameworks (Ni).",
      alignment: mbtiIntuitionAlignment,`;

content = content.replace(oldM07, newM07);

// 4. Update Module 08
const oldM08 = `      archetype: "Extraverted Thinking (Te) Executive",
      summary: "Your rational decision model is anchored in Extraverted Thinking (Te) — systematic cause-effect logic, objective performance metrics, structural efficiency, and high task velocity.",
      mechanism: "Thinking (T) evaluation prioritizes impersonal cause-and-effect reasoning over subjective feelings.",
      subfacet_desc: \`Taxonomic Logic (\${Math.min(99, reasSc + 4)}%) ensures that your strategic visions are translated into optimized, quantifiable execution steps.\`,
      facets: [
        ["Taxonomic Logic (Te)", \`\${Math.min(99, reasSc + 4)}%\`, "Evaluates options using objective performance metrics and structural efficiency."],
        ["Internal Consistency (Ti)", \`\${Math.min(99, reasSc + 2)}%\`, "Demands precise logical definitions and rigorous internal framework alignment."],
        ["Prosocial Harmony (Fe)", \`\${Math.max(40, aSc - 10)}%\`, "Secondary consideration of social dynamics during objective technical decisions."],
        ["Personal Authenticity (Fi)", \`\${Math.max(40, aSc - 5)}%\`, "Aligns technical execution with deep internal principles and ethics."]
      ],
      low_behavior: "Decisions guided by subjective values, interpersonal harmony, and personal impact (F).",
      high_behavior: "Decisions guided by objective metrics, efficiency, and structural logic (T).",
      alignment: \`Objective Te Executive (\${Math.round(((cSc + reasSc) / 2) * 0.96)}th %ile)\`,`;

const newM08 = `      archetype: mbtiDecisionArchetype,
      summary: mbtiDecisionSummary,
      mechanism: "Thinking (T) evaluation prioritizes impersonal cause-and-effect reasoning over subjective feelings.",
      subfacet_desc: \`Taxonomic Logic (\${Math.min(99, reasSc + 4)}%) ensures that your strategic visions are translated into optimized, quantifiable execution steps.\`,
      facets: [
        ["Taxonomic Logic (Te)", \`\${Math.min(99, reasSc + 4)}%\`, "Evaluates options using objective performance metrics and structural efficiency."],
        ["Internal Consistency (Ti)", \`\${Math.min(99, reasSc + 2)}%\`, "Demands precise logical definitions and rigorous internal framework alignment."],
        ["Prosocial Harmony (Fe)", \`\${Math.max(40, aSc - 10)}%\`, "Secondary consideration of social dynamics during objective technical decisions."],
        ["Personal Authenticity (Fi)", \`\${Math.max(40, aSc - 5)}%\`, "Aligns technical execution with deep internal principles and ethics."]
      ],
      low_behavior: "Decisions guided by subjective values, interpersonal harmony, and personal impact (F).",
      high_behavior: "Decisions guided by objective metrics, efficiency, and structural logic (T).",
      alignment: mbtiDecisionAlignment,`;

content = content.replace(oldM08, newM08);

// 5. Update Module 11
const oldM11 = `      archetype: "Algorithmic Fluid Logic",
      summary: \`Your Fluid Intelligence reflects strong reasoning capacity. You rapidly decode complex matrix patterns, unmapped logical rules, and non-linear data structures without relying on prior instructions.\`,
      mechanism: "Fluid Intelligence (Gf) represents non-verbal reasoning capacity independent of acquired culture or schooling.",
      subfacet_desc: \`Matrix Reasoning (\${Math.min(99, reasSc + 4)}%) demonstrates high abstract logic processing, making you capable in algorithm design.\`,
      facets: [
        ["Matrix Reasoning", \`\${Math.min(99, reasSc + 4)}%\`, "Instantly identifies underlying rules governing complex visual matrices."],
        ["Pattern Identification", \`\${Math.min(99, reasSc + 2)}%\`, "Rapid extraction of logical invariants from unstructured data streams."],
        ["Abstract Deduction", \`\${reasSc}%\`, "Deduces hidden logical consequences without relying on verbal prompts."],
        ["Rule Induction", \`\${Math.min(99, reasSc + 3)}%\`, "Infers overarching mathematical or logical rules from minimal sample sets."]
      ],
      low_behavior: "Requires step-by-step examples and familiar problem domains.",
      high_behavior: "Instantly grasps abstract principles in completely novel, unstructured domains.",
      alignment: \`Top Tier Fluid Logic (\${Math.round(reasSc * 0.97)}th %ile)\`,
      protocol_name: "High-Complexity Sprints",
      protocol: "Direct your fluid reasoning capacity toward unsolved technical challenges rather than repetitive procedural tasks.",`;

const newM11 = `      archetype: fluidArchetype,
      summary: fluidSummary,
      mechanism: "Fluid Intelligence (Gf) represents non-verbal reasoning capacity independent of acquired culture or schooling.",
      subfacet_desc: reasSc >= 50
        ? \`Matrix Reasoning (\${Math.min(99, reasSc + 4)}%) demonstrates high abstract logic processing, making you capable in algorithm design.\`
        : \`Matrix Reasoning (\${Math.min(99, reasSc + 4)}%) reflects a methodical approach; mastering structured problem templates will strengthen non-linear abstract reasoning.\`,
      facets: [
        ["Matrix Reasoning", \`\${Math.min(99, reasSc + 4)}%\`, reasSc >= 50 ? "Instantly identifies underlying rules governing complex visual matrices." : "Identifies matrix rules through deliberate sequential inspection."],
        ["Pattern Identification", \`\${Math.min(99, reasSc + 2)}%\`, reasSc >= 50 ? "Rapid extraction of logical invariants from unstructured data streams." : "Extracts patterns methodically using reference examples."],
        ["Abstract Deduction", \`\${reasSc}%\`, reasSc >= 50 ? "Deduces hidden logical consequences without relying on verbal prompts." : "Applies deductive rules methodically when given structured premises."],
        ["Rule Induction", \`\${Math.min(99, reasSc + 3)}%\`, reasSc >= 50 ? "Infers overarching mathematical or logical rules from minimal sample sets." : "Infers rules steadily with guided practice and reinforcement."]
      ],
      low_behavior: "Requires step-by-step examples and familiar problem domains.",
      high_behavior: "Instantly grasps abstract principles in completely novel, unstructured domains.",
      alignment: fluidAlignment,
      protocol_name: reasSc >= 50 ? "High-Complexity Sprints" : "Methodical Problem-Decomposition",
      protocol: reasSc >= 50
        ? "Direct your fluid reasoning capacity toward unsolved technical challenges rather than repetitive procedural tasks."
        : "Break down complex unfamiliar problems into explicit step-by-step subroutines and reference worked examples before attempting independent synthesis.",`;

content = content.replace(oldM11, newM11);

// 6. Update Module 13
const oldM13 = `      archetype: "3D Systems Spatializer",
      summary: \`You mentally rotate 3D objects, visualize multi-layered system architectures, and map spatial relationships with clarity.\`,
      mechanism: "Spatial intelligence processes visual-spatial relationships, mental manipulation of objects, and geometric orientation.",
      subfacet_desc: \`3D Spatial Rotation (\${Math.min(99, spatSc + 4)}%) provides a strong cognitive base for graphics, CAD engineering, or software architecture.\`,
      facets: [
        ["3D Spatial Rotation", \`\${Math.min(99, spatSc + 4)}%\`, "Accurately rotates 3D geometric structures in working memory."],
        ["Geometry Processing", \`\${Math.min(99, spatSc + 2)}%\`, "Grasps spatial symmetry, proportions, and vector geometries."],
        ["Spatial Memory", \`\${spatSc}%\`, "Retains detailed mental topologies of complex visual layouts."],
        ["Architectural Mapping", \`\${Math.min(99, spatSc + 3)}%\`, "Translates complex multi-layer software stacks into spatial maps."]
      ],
      low_behavior: "Prefers textual or linear representations over spatial configurations.",
      high_behavior: "Instantly visualizes physical geometries, vector forces, and 3D architectural flows.",
      alignment: \`High Spatial Visualizer (\${Math.round(spatSc * 0.96)}th %ile)\`,`;

const newM13 = `      archetype: spatialArchetype,
      summary: spatialSummary,
      mechanism: "Spatial intelligence processes visual-spatial relationships, mental manipulation of objects, and geometric orientation.",
      subfacet_desc: spatSc >= 50
        ? \`3D Spatial Rotation (\${Math.min(99, spatSc + 4)}%) provides a strong cognitive base for graphics, CAD engineering, or software architecture.\`
        : \`Spatial Memory (\${spatSc}%) supports procedural spatial orientation; linear and schematic representations reinforce spatial comprehension.\`,
      facets: [
        ["3D Spatial Rotation", \`\${Math.min(99, spatSc + 4)}%\`, spatSc >= 50 ? "Accurately rotates 3D geometric structures in working memory." : "Performs spatial rotations with the aid of physical or schematic models."],
        ["Geometry Processing", \`\${Math.min(99, spatSc + 2)}%\`, spatSc >= 50 ? "Grasps spatial symmetry, proportions, and vector geometries." : "Understands geometric concepts through step-by-step formulas and proofs."],
        ["Spatial Memory", \`\${spatSc}%\`, "Retains mental topologies of familiar visual layouts."],
        ["Architectural Mapping", \`\${Math.min(99, spatSc + 3)}%\`, "Translates multi-layer structures into step-by-step schematic flows."]
      ],
      low_behavior: "Prefers textual or linear representations over spatial configurations.",
      high_behavior: "Instantly visualizes physical geometries, vector forces, and 3D architectural flows.",
      alignment: spatialAlignment,`;

content = content.replace(oldM13, newM13);

// 7. Update Module 16
const oldM16 = `      archetype: "Master Systems Architect",
      summary: "You map multi-loop feedback systems, identify hidden leverage points, and anticipate non-obvious ripple effects across complex operations.",
      mechanism: "Systems thinking evaluates interconnected networks, dynamic delays, non-linear feedback loops, and emergent structural properties.",
      subfacet_desc: \`Feedback Loop Mapping (\${Math.min(99, reasSc + 5)}%) represents a high cognitive capability for system modeling.\`,
      facets: [
        ["Feedback Loop Mapping", \`\${Math.min(99, reasSc + 5)}%\`, "Identifies reinforcing and balancing feedback loops in complex systems."],
        ["Leverage Point Spotting", \`\${Math.min(99, reasSc + 3)}%\`, "Pinpoints small intervention points that yield massive systemic changes."],
        ["Bottleneck Audit", \`\${Math.min(99, reasSc + 2)}%\`, "Audits system throughput to locate structural operational bottlenecks."],
        ["Emergent Behavior Logic", \`\${Math.min(99, reasSc + 4)}%\`, "Anticipates non-linear systemic behaviors emerging from component interactions."]
      ],
      low_behavior: "Linear cause-effect thinking; focuses on isolated components.",
      high_behavior: "Holistic systems thinking; maps emergent behaviors and feedback loops.",
      alignment: \`Master Systems Architect (\${Math.min(99, Math.round(reasSc * 0.98))}th %ile)\`,`;

const newM16 = `      archetype: systemsArchetype,
      summary: systemsSummary,
      mechanism: "Systems thinking evaluates interconnected networks, dynamic delays, non-linear feedback loops, and emergent structural properties.",
      subfacet_desc: reasSc >= 50
        ? \`Feedback Loop Mapping (\${Math.min(99, reasSc + 5)}%) represents a high cognitive capability for system modeling.\`
        : \`Feedback Loop Mapping (\${Math.min(99, reasSc + 5)}%) reflects developing systems comprehension; structured process mapping enhances operational throughput.\`,
      facets: [
        ["Feedback Loop Mapping", \`\${Math.min(99, reasSc + 5)}%\`, "Identifies reinforcing and balancing feedback loops in operational processes."],
        ["Leverage Point Spotting", \`\${Math.min(99, reasSc + 3)}%\`, "Pinpoints actionable intervention points within defined workflows."],
        ["Bottleneck Audit", \`\${Math.min(99, reasSc + 2)}%\`, "Audits operational throughput to locate execution bottlenecks."],
        ["Emergent Behavior Logic", \`\${Math.min(99, reasSc + 4)}%\`, "Traces systemic behaviors emerging from component interactions."]
      ],
      low_behavior: "Linear cause-effect thinking; focuses on isolated components.",
      high_behavior: "Holistic systems thinking; maps emergent behaviors and feedback loops.",
      alignment: systemsAlignment,`;

content = content.replace(oldM16, newM16);

// 8. Update Module 18
const oldM18 = `      archetype: "Cognitive Error Auditor",
      summary: "You audit assumptions rigorously, identifying logical fallacies, bias traps, and weak empirical evidence before committing to strategy.",
      mechanism: "Critical thinking evaluates the validity of arguments, audits underlying assumptions, and filters out cognitive biases dispassionately.",
      subfacet_desc: \`Fallacy Identification (\${Math.min(99, reasSc + 4)}%) protects your team from committing resources to flawed premises.\`,
      facets: [
        ["Fallacy Identification", \`\${Math.min(99, reasSc + 4)}%\`, "Detects subtle logical fallacies and non-sequiturs in arguments."],
        ["Assumption Auditing", \`\${Math.min(99, reasSc + 2)}%\`, "Exposes unstated premises and unverified claims in project specs."],
        ["Cognitive Bias Shield", \`\${reasSc}%\`, "Aware of confirmation bias, sunk cost fallacies, and availability heuristics."],
        ["Evidence Verification", \`\${Math.min(99, reasSc + 3)}%\`, "Requires empirical data validation before accepting theoretical claims."]
      ],
      low_behavior: "Accepts assumptions without verifying underlying data or logic.",
      high_behavior: "Rigorously audits premises, detects biases, and verifies empirical data.",
      alignment: \`Rigorous Bias Auditor (\${Math.round(reasSc * 0.96)}th %ile)\`,`;

const newM18 = `      archetype: criticalArchetype,
      summary: reasSc >= 50
        ? "You audit assumptions rigorously, identifying logical fallacies, bias traps, and weak empirical evidence before committing to strategy."
        : "You evaluate practical decisions methodically, relying on explicit evidence verification checklists and verified benchmarks to guard against cognitive errors.",
      mechanism: "Critical thinking evaluates the validity of arguments, audits underlying assumptions, and filters out cognitive biases dispassionately.",
      subfacet_desc: \`Fallacy Identification (\${Math.min(99, reasSc + 4)}%) provides structured safeguards against committing resources to unverified assumptions.\`,
      facets: [
        ["Fallacy Identification", \`\${Math.min(99, reasSc + 4)}%\`, "Detects logical inconsistencies when evaluated against explicit criteria."],
        ["Assumption Auditing", \`\${Math.min(99, reasSc + 2)}%\`, "Exposes unstated premises and unverified claims in project specs."],
        ["Cognitive Bias Shield", \`\${reasSc}%\`, "Aware of confirmation bias, sunk cost fallacies, and availability heuristics."],
        ["Evidence Verification", \`\${Math.min(99, reasSc + 3)}%\`, "Requires empirical data validation before accepting theoretical claims."]
      ],
      low_behavior: "Accepts assumptions without verifying underlying data or logic.",
      high_behavior: "Rigorously audits premises, detects biases, and verifies empirical data.",
      alignment: criticalAlignment,`;

content = content.replace(oldM18, newM18);

// 9. Update Page 8 (Methodology) Cronbach & Percentiles
const oldP8 = `                            <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                                <div class="flex justify-between">
                                    <span class="font-bold text-slate-700">Cronbach's Alpha Reliability:</span>
                                    <span class="font-extrabold text-emerald-600">&alpha; = 0.89 (High Consistency)</span>
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
                                Candidate scores are normalized into standard percentile ranks relative to \${variantConfig.shortStageLabel} peers using Gaussian distribution bell-curve modeling:
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
                            </div>`;

const newP8 = `                            <div class="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                                <div class="flex justify-between">
                                    <span class="font-bold text-slate-700">Assessment Standardization:</span>
                                    <span class="font-extrabold text-emerald-600">Educational Guidance Norm-Referenced</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="font-bold text-slate-700">Construct Mapping:</span>
                                    <span class="font-extrabold text-maroon">Multi-Dimensional Factor Analysis</span>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2 -->
                        <div class="bg-cream p-4 rounded-2xl border border-gold/40 shadow-sm space-y-2">
                            <h3 class="font-extrabold text-xs text-maroon flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                <i class="fa-solid fa-chart-area text-gold"></i> Percentile & Normative Distribution
                            </h3>
                            <p class="text-[11px] text-slate-700 leading-relaxed">
                                Candidate scores are normalized into standard percentile ranks relative to \${variantConfig.shortStageLabel} peers using Gaussian distribution bell-curve modeling:
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
                                <div class="flex items-center justify-between p-1 bg-white rounded border border-slate-200">
                                    <span class="font-bold text-amber-700">25th–49th Percentile:</span>
                                    <span class="text-slate-600">Moderate / Developing Capacity</span>
                                </div>
                                <div class="flex items-center justify-between p-1 bg-white rounded border border-slate-200">
                                    <span class="font-bold text-blue-800">1st–24th Percentile:</span>
                                    <span class="text-slate-600">Foundational / Structured Support</span>
                                </div>
                            </div>`;

content = content.replace(oldP8, newP8);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully patched class10_html_report_builder.ts!');
