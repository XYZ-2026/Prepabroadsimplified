/**
 * Universal Report Schema & Variant Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Authoritative schema and configuration contracts for the Universal 56-Page
 * Psychometric Report System across Class 7–9 (Junior), Class 10, and Class 12 (Senior).
 */

import type { EditorialStudent, EditorialScores, PersonalizationData } from '../class10_editorial_engine';
import type { AlignmentResult } from '../comparison-engine';
import type { ParentProfile } from '../parent-scoring';
import type { PathwayRoadmapData, StudyAbroadGuideData, AcademicStage, StudentActionPlanData } from '../class10_roadmap_engine';

export type ReportVariant = 'junior' | 'grade10' | 'senior';

export const REPORT_ORGANIZATION_IDENTITY = {
  organizationName: 'CLARVO',
  divisionName: 'Psychometric Research & Academic Assessment Division',
  secondaryDivisionName: 'Academic & Career Assessment Division',
  institutionalGovernance: 'Institutional Psychometric Governance',
  curriculumAlignment: 'Curriculum & Career Alignment Division',
} as const;

export interface ReportVariantConfig {
  variant: ReportVariant;
  editionName: string;                // e.g. "Junior (Class 7–9)", "Class 10", "Class 12 (Senior)"
  defaultGradeLabel: string;          // e.g. "Class 8", "Class 10", "Class 12"
  reportIdPrefix: string;             // e.g. "AS-JR", "AS-10", "AS-12"
  stageCode: string;                  // e.g. "CLASS_7_9", "CLASS_10", "CLASS_12"
  academicStage: string;              // e.g. "Class 7–9 (Middle School Foundation Stage)"
  shortStageLabel: string;            // e.g. "Class 7–9", "Class 10", "Class 12"
  reportTitle: string;                // e.g. "Junior Executive Psychometric & Exploratory Dossier"
  subTitle: string;                   // e.g. "Middle School Cognitive & Exploratory Diagnostic Report"
  normGroup: string;                  // e.g. "n > 50,000 Middle School Norms"
  purposeDescription: string;         // Descriptive statement of purpose on page 02
  orientationHeading: string;         // Welcome title on page 06
  orientationDescription: string;     // Welcome text on page 06
  assessmentDescription: string;      // About assessment text on page 07
  methodologyDescription: string;     // Methodology calibration text on page 08
  pathwayTerminology: {
    sectionTitle: string;             // e.g. "Recommended Pathways" or "Recommended Exploratory Vectors"
    primaryLabel: string;             // e.g. "Primary Exploratory Vector" or "Primary Recommended Stream"
    secondaryLabel: string;
    alternativeLabel: string;
    badgeText: string;
  };
  roadmapTerminology: {
    timelineHeading: string;          // e.g. "Academic & Profile Roadmap"
    stage1Label: string;              // e.g. "Class 7–8 (Foundational Discovery)"
    stage2Label: string;              // e.g. "Class 9–10 (Secondary Transition)"
    stage3Label: string;              // e.g. "Class 11–12 (Stream Specialization)"
    stage4Label: string;              // e.g. "Undergraduate Degree (Years 1–4)"
    stage5Label: string;              // e.g. "Career Mastery & Long-Term Trajectory"
  };
  studyAbroadTerminology: {
    pageTitle: string;
    fitmentFocus: string;
  };
  actionPlanTerminology: {
    pageTitle: string;
    immediateFocus: string;
  };
  conclusionTerminology: {
    closingTitle: string;
    closingSummary: string;
  };
}

export interface UniversalReportData {
  variant: ReportVariant;
  config: ReportVariantConfig;
  student: EditorialStudent;
  scores: EditorialScores;
  personalization: PersonalizationData;
  comparisonData: AlignmentResult | null;
  parentProfile: ParentProfile | null;
  
  // Roadmap & Planning Data
  roadmaps: {
    primary: PathwayRoadmapData;
    secondary: PathwayRoadmapData;
    alternative: PathwayRoadmapData;
  };
  studyAbroad: StudyAbroadGuideData;
  academicRoadmap: AcademicStage[];
  actionPlan: StudentActionPlanData;
}

export function getVariantConfig(variant: ReportVariant): ReportVariantConfig {
  switch (variant) {
    case 'junior':
      return {
        variant: 'junior',
        editionName: 'Junior (Class 7–9)',
        defaultGradeLabel: 'Class 8',
        reportIdPrefix: 'AS-JR',
        stageCode: 'CLASS_7_9',
        academicStage: 'Class 7–9 (Middle School Foundation Stage)',
        shortStageLabel: 'Class 7–9',
        reportTitle: 'JUNIOR EXECUTIVE PSYCHOMETRIC & EXPLORATORY DOSSIER',
        subTitle: 'Middle School Cognitive & Exploratory Diagnostic Report',
        normGroup: 'n > 50,000 Middle School Norms',
        purposeDescription: 'The purpose of this Report is to provide an evidence-based psychometric evaluation designed to discover natural cognitive strengths, exploratory learning vectors, and foundational interest clusters for students in Classes 7–9. The assessment measures behavioral traits, cognitive aptitudes, learning modalities, emotional intelligence indicators, and exploratory interests across 30 diagnostic modules.',
        orientationHeading: 'Welcome to Your Junior Diagnostic & Exploratory Journey',
        orientationDescription: 'Welcome to your official Junior Executive Psychometric & Exploratory Report. Middle school (Classes 7 to 9) is the most critical developmental phase for discovering genuine intellectual curiosity and learning strengths. Rather than prematurely locking into a rigid career path, this report identifies your natural aptitudes and learning patterns, empowering you and your family to explore subjects, hobbies, and foundational skills with clarity and confidence.',
        assessmentDescription: 'The Junior Executive Psychometric Assessment is an advanced multi-layered diagnostic system calibrated specifically for middle school learners. Rather than relying on simple quiz questions, our framework measures candidate traits across 4 core diagnostic assessment phases comprising 30 comprehensive modules.',
        methodologyDescription: 'Our assessment items are calibrated using Item Response Theory (IRT) and standardized against a normative benchmark sample of over 50,000 middle school students across diverse curriculum boards (CBSE, ICSE, IB, Cambridge). Candidate scores are normalized into standard percentile ranks relative to Class 7–9 peers using Gaussian distribution bell-curve modeling.',
        pathwayTerminology: {
          sectionTitle: 'Recommended Exploratory Directions & Academic Vectors',
          primaryLabel: 'Primary Exploratory Vector',
          secondaryLabel: 'Secondary Exploratory Vector',
          alternativeLabel: 'Strategic Alternative Vector',
          badgeText: 'Foundational Exploration Priority',
        },
        roadmapTerminology: {
          timelineHeading: 'Academic & Exploratory Roadmap (Class 7–9 to High School & Beyond)',
          stage1Label: 'Class 7–8 (Foundational Discovery)',
          stage2Label: 'Class 9–10 (Secondary Transition & Skill Testing)',
          stage3Label: 'Class 11–12 (Stream Specialization & Profile Building)',
          stage4Label: 'Undergraduate Degree (Years 1–4)',
          stage5Label: 'Career Mastery & Long-Term Direction',
        },
        studyAbroadTerminology: {
          pageTitle: 'Global Learning & International Perspective Guide',
          fitmentFocus: 'Foundational global awareness, language development, and summer enrichment opportunities.',
        },
        actionPlanTerminology: {
          pageTitle: 'Middle School Student Action Plan & Habit Milestones',
          immediateFocus: 'Curiosity experiments, daily reading routines, and foundational logic development.',
        },
        conclusionTerminology: {
          closingTitle: 'Advisory Sign-Off & Middle School Action Protocol',
          closingSummary: 'You have successfully completed your 30-Module Junior Executive Psychometric Evaluation. You now possess a data-backed blueprint to guide your subject exploration, skill development, and learning habits.',
        },
      };

    case 'senior':
      return {
        variant: 'senior',
        editionName: 'Class 12 (Senior)',
        defaultGradeLabel: 'Class 12',
        reportIdPrefix: 'AS-12',
        stageCode: 'CLASS_12',
        academicStage: 'Class 12 (Senior Secondary / Pre-University Stage)',
        shortStageLabel: 'Class 12',
        reportTitle: 'CLASS 12 EXECUTIVE PSYCHOMETRIC & CAREER DOSSIER',
        subTitle: 'Senior Secondary & Higher Education Diagnostic Report',
        normGroup: 'n > 50,000 Senior Secondary Norms',
        purposeDescription: 'The purpose of this Report is to provide an evidence-based psychometric evaluation designed to support undergraduate degree selection, university specialization, and higher education transitions for Class 12 students. The assessment measures behavioral traits, cognitive aptitudes, learning modalities, professional readiness indicators, and career cluster alignment across 30 diagnostic modules.',
        orientationHeading: 'Welcome to Your Class 12 Pre-University Diagnostic Journey',
        orientationDescription: 'Welcome to your official Class 12 Executive Psychometric & Career Diagnostic Report. Standing at the culmination of secondary schooling is one of the most critical inflection points in your academic journey. You are preparing to transition into undergraduate university education, specialized degree coursework, and targeted professional domains. This dossier synthesizes your cognitive abilities, behavioral drivers, and career fitment into actionable university and degree roadmaps.',
        assessmentDescription: 'The Class 12 Executive Psychometric Assessment is an advanced multi-layered diagnostic system specifically engineered for pre-university candidates. Rather than relying on simple quiz questions, our framework measures candidate traits across 4 core diagnostic assessment phases comprising 30 comprehensive modules.',
        methodologyDescription: 'Our assessment items are calibrated using Item Response Theory (IRT) and standardized against a normative benchmark sample of over 50,000 Class 12 students across diverse curriculum boards (CBSE, ISC, IB Diploma, Cambridge A-Levels). Candidate scores are normalized into standard percentile ranks relative to Class 12 peers using Gaussian distribution bell-curve modeling.',
        pathwayTerminology: {
          sectionTitle: 'Recommended Degree Pathways & Career Specializations',
          primaryLabel: 'Primary Degree & Career Pathway',
          secondaryLabel: 'Secondary Degree Pathway',
          alternativeLabel: 'Strategic Alternative Pathway',
          badgeText: 'Pre-University Fitment Priority',
        },
        roadmapTerminology: {
          timelineHeading: 'Academic & Career Roadmap (Class 12 to University & Industry)',
          stage1Label: 'Class 12 (Board & Entrance Examinations)',
          stage2Label: "Bachelor's Degree (Years 1–2 Core Foundations)",
          stage3Label: "Bachelor's Degree (Years 3–4 Internships & Capstone)",
          stage4Label: 'Postgraduate / Work Authorization Placement',
          stage5Label: 'Professional Leadership & Industry Mastery',
        },
        studyAbroadTerminology: {
          pageTitle: 'Personalized Global University & Study Abroad Guide',
          fitmentFocus: 'International undergraduate degree admissions, scholarships, tuition tiers, and work permits.',
        },
        actionPlanTerminology: {
          pageTitle: 'Senior Student Action Plan & Admission Milestones',
          immediateFocus: 'Entrance examination mock testing, college application shortlists, and SOP/portfolio development.',
        },
        conclusionTerminology: {
          closingTitle: 'Advisory Sign-Off & Pre-University Next Steps',
          closingSummary: 'You have successfully completed your 30-Module Class 12 Executive Psychometric Evaluation. You now possess a rigorous data-backed blueprint to guide your college admissions, competitive examinations, and career launch.',
        },
      };

    case 'grade10':
    default:
      return {
        variant: 'grade10',
        editionName: 'Class 10',
        defaultGradeLabel: 'Class 10',
        reportIdPrefix: 'AS-10',
        stageCode: 'CLASS_10',
        academicStage: 'Class 10 (Secondary Stage)',
        shortStageLabel: 'Class 10',
        reportTitle: 'CLASS 10 EXECUTIVE PSYCHOMETRIC REPORT',
        subTitle: 'Secondary Education Benchmark | Class 10',
        normGroup: 'n > 50,000 Class 10 Norms',
        purposeDescription: 'The purpose of this Report is to provide an evidence-based psychometric evaluation designed to support academic stream selection decisions for Class 10 students transitioning into Class 11 subject electives. The assessment measures behavioral traits, cognitive aptitudes, learning modalities, emotional intelligence indicators, and career interest alignment across 30 diagnostic modules.',
        orientationHeading: 'Welcome to Your Class 10 Diagnostic Journey',
        orientationDescription: 'Welcome to your official Class 10 Executive Psychometric & Stream Diagnostic Report. Standing at the threshold of Class 10 is one of the most exciting and significant milestones in your educational career. For the first time, you are preparing to transition from general secondary education into specialized academic streams—whether that be Physical Sciences (PCM), Biological Sciences (PCB), Business & Finance (Commerce), Humanities & Social Sciences, or Creative Arts & Design.',
        assessmentDescription: 'The Class 10 Executive Psychometric Assessment is an advanced multi-layered diagnostic system specifically designed for secondary school students. Rather than relying on simple quiz questions, our framework measures candidate traits across 4 core diagnostic assessment phases comprising 30 comprehensive modules:',
        methodologyDescription: 'Our assessment items are calibrated using Item Response Theory (IRT) and standardized against a normative benchmark sample of over 50,000 Class 10 students across diverse curriculum boards (CBSE, ICSE, IB, Cambridge). Candidate scores are normalized into standard percentile ranks relative to Class 10 peers using Gaussian distribution bell-curve modeling:',
        pathwayTerminology: {
          sectionTitle: 'Recommended Career & Academic Pathways',
          primaryLabel: 'Primary Recommended Stream',
          secondaryLabel: 'Secondary Alternative Stream',
          alternativeLabel: 'Strategic Interdisciplinary Option',
          badgeText: 'Highest Strategic Alignment',
        },
        roadmapTerminology: {
          timelineHeading: 'Academic & Profile Roadmap (Class 10 to Career)',
          stage1Label: 'Class 10 (Current Foundation)',
          stage2Label: 'Class 11–12 (Specialization & Exams)',
          stage3Label: "Bachelor's Degree (Years 1–2)",
          stage4Label: "Bachelor's Degree (Years 3–4)",
          stage5Label: 'Postgraduate / Career Launch',
        },
        studyAbroadTerminology: {
          pageTitle: 'Personalized Global Study Abroad Guide',
          fitmentFocus: 'Targeting global education pathways and scholarship readiness.',
        },
        actionPlanTerminology: {
          pageTitle: 'Student Action Plan & Strategic Milestones',
          immediateFocus: 'Stream selection locking, board exam prep gap analysis, and study schedules.',
        },
        conclusionTerminology: {
          closingTitle: 'Advisory Sign-Off & Counsellor Next Steps',
          closingSummary: 'You have successfully completed your 30-Module Class 10 Executive Psychometric Evaluation. You now possess a powerful data-backed map for your future stream and career journey.',
        },
      };
  }
}
