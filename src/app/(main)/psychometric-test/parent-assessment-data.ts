// ============================================================
// PARENT ASSESSMENT DATA — Parent–Student Psychometric Integration
// Reuses existing Question, Section, SectionMeta interfaces from data.ts
// 33 questions across 6 sections
// ============================================================

import type { Question, Section, SectionMeta } from './data';

// ─── Parent Dimension Keys ──────────────────────────────────────────────────
// These are the trait strings used in parent questions.
// They map to internal ParentProfile dimensions in parent-scoring.ts.
export const PARENT_DIMENSIONS = [
  'perceived_strength_area',
  'perceived_career_direction',
  'perceived_self_awareness',
  'perceived_social_style',
  'confidence_in_child_direction',
  'academic_expectation',
  'stability_priority',
  'salary_expectation',
  'prestige_priority',
  'career_flexibility',      // reverse-mapped to stability
  'international_career_openness',
  'job_security_priority',
  'education_budget',
  'loan_openness',
  'scholarship_dependency',
  'investment_willingness',
  'financial_readiness',
  'study_abroad_openness',
  'preferred_region',
  'ranking_importance',
  'safety_priority',
  'post_study_employment',
  'decision_ownership',
  'child_independence_readiness',
  'experimentation_openness',
  'non_traditional_openness',
  'career_change_comfort',
  'risk_tolerance',
  'performance_expectation',
  'support_style',
  'primary_concern',
  'desired_outcome',
  'overall_confidence',
] as const;

export type ParentDimension = typeof PARENT_DIMENSIONS[number];

// ─── Section Metadata for Intro Cards ───────────────────────────────────────
export const PARENT_SEC_META: SectionMeta[] = [
  {
    id: 1,
    name: 'Parent Perception of Student',
    icon: '👁️',
    color: '#690B1B',
    type: 'choice',
    desc: 'Share your observations about your child\'s academic strengths, interests, and self-awareness.',
    why: 'Your perception of your child provides a valuable external perspective. Comparing your observations with your child\'s self-assessment helps identify areas of alignment and potential blind spots.',
    whyPoints: [
      'Helps cross-validate your child\'s self-reported strengths and interests',
      'Identifies any gaps between your child\'s self-perception and external observations',
      'Provides context for career recommendations — parents often notice strengths children overlook',
      'Supports more accurate and well-rounded career guidance'
    ]
  },
  {
    id: 2,
    name: 'Career Expectations',
    icon: '🎯',
    color: '#7E3AF2',
    type: 'likert',
    desc: 'Share your expectations regarding career stability, income, prestige, and flexibility for your child.',
    why: 'Career expectations from parents significantly shape a student\'s decisions. Understanding these expectations allows counsellors to identify areas where family priorities align or diverge.',
    whyPoints: [
      'Highlights whether you and your child prioritise the same career attributes',
      'Surfaces potential tension between stability-focused and passion-focused career paths',
      'Enables counsellors to facilitate productive career discussions between parent and student',
      'Ensures career recommendations account for family priorities, not just individual preferences'
    ]
  },
  {
    id: 3,
    name: 'Financial & Practical Considerations',
    icon: '💰',
    color: '#057A55',
    type: 'choice',
    desc: 'Share your financial comfort level and practical considerations for your child\'s higher education.',
    why: 'Financial planning is one of the most important practical factors in education and career decisions. Understanding your comfort level helps us create realistic, achievable recommendations.',
    whyPoints: [
      'Ensures career pathway recommendations are financially realistic for your family',
      'Identifies whether scholarship planning or education financing is needed',
      'Helps counsellors recommend institutions and programmes within your comfort range',
      'Prevents mismatches between career aspirations and financial feasibility'
    ]
  },
  {
    id: 4,
    name: 'Study Abroad Expectations',
    icon: '🌍',
    color: '#C9A55D',
    type: 'likert',
    desc: 'Share your views on international education, preferred destinations, and priorities for studying abroad.',
    why: 'Study abroad decisions involve the entire family. Your openness, regional preferences, and priority factors are essential inputs for accurate international education recommendations.',
    whyPoints: [
      'Ensures study abroad recommendations reflect family-level openness, not just student interest',
      'Identifies preferred geographies and non-negotiable factors (safety, cost, employment)',
      'Reveals alignment or divergence with your child\'s own international education preferences',
      'Supports realistic planning — abroad pathways need family buy-in to succeed'
    ]
  },
  {
    id: 5,
    name: 'Autonomy & Decision Making',
    icon: '🤝',
    color: '#0694A2',
    type: 'likert',
    desc: 'Share your views on who should drive career decisions, your child\'s independence, and openness to experimentation.',
    why: 'The balance between parental guidance and student autonomy directly affects career outcomes. Understanding your position helps counsellors facilitate healthy, productive career planning conversations.',
    whyPoints: [
      'Identifies whether career decisions are student-led, parent-led, or collaborative',
      'Surfaces potential gaps between your child\'s desire for independence and your comfort level',
      'Helps counsellors mediate career direction discussions with appropriate context',
      'Ensures career exploration is neither overly restricted nor completely unguided'
    ]
  },
  {
    id: 6,
    name: 'Risk, Support & Concerns',
    icon: '🛡️',
    color: '#690B1B',
    type: 'choice',
    desc: 'Share your risk tolerance, support style, and primary concerns about your child\'s career future.',
    why: 'Your support style and risk comfort directly influence which career pathways feel viable for your family. Understanding your concerns ensures that recommendations address real worries, not just academic fit.',
    whyPoints: [
      'Reveals whether your risk comfort matches the career paths your child is drawn to',
      'Identifies your preferred support role — hands-on, mentoring, or independent',
      'Surfaces your primary concerns (financial security, fulfilment, status, balance)',
      'Ensures career guidance addresses family-level worries and builds confidence'
    ]
  }
];

// ─── Parent Assessment Questions ────────────────────────────────────────────

export const PARENT_ASSESSMENT: { sections: Section[] } = {
  sections: [
    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1 — PARENT PERCEPTION OF STUDENT (6 questions, choice + likert)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 1,
      name: 'Parent Perception of Student',
      icon: '👁️',
      color: '#690B1B',
      type: 'choice',
      description: 'Share your observations about your child\'s strengths and self-awareness.',
      questions: [
        {
          id: 1,
          text: 'Which broad area do you believe best describes your child\'s strongest academic abilities?',
          options: [
            'Science, Technology, Engineering & Mathematics (STEM)',
            'Business, Commerce & Economics',
            'Humanities, Social Sciences & Languages',
            'Creative Arts, Design & Media'
          ],
          option_types: ['stem', 'business', 'humanities', 'creative'],
          correct: -1,
          trait: 'perceived_strength_area'
        },
        {
          id: 2,
          text: 'Which career direction do you feel would be the most suitable for your child?',
          options: [
            'Engineering & Technology',
            'Medical & Life Sciences',
            'Business, Finance & Management',
            'Law, Public Service & Governance',
            'Creative Industries & Media',
            'Open to exploring — I want my child to discover their own path'
          ],
          option_types: ['engineering_tech', 'medical_life_sciences', 'business_finance', 'law_public_service', 'creative_media', 'open_exploring'],
          correct: -1,
          trait: 'perceived_career_direction'
        },
        {
          id: 3,
          text: 'I believe my child has a clear understanding of their own strengths, interests, and career aspirations.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'perceived_self_awareness'
        },
        {
          id: 4,
          text: 'How would you describe your child\'s strongest social and interpersonal style?',
          options: [
            'Natural leader who takes charge in group settings',
            'Strong team collaborator who works well with others',
            'Independent self-starter who prefers working alone',
            'Flexible and adaptable — adjusts approach based on the situation'
          ],
          option_types: ['leadership', 'teamwork', 'independent', 'adaptable'],
          correct: -1,
          trait: 'perceived_social_style'
        },
        {
          id: 5,
          text: 'I am confident that my child\'s expressed career interests are well-informed and thought through.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'confidence_in_child_direction'
        },
        {
          id: 6,
          text: 'What level of academic performance do you expect from your child in the near term?',
          options: [
            'Consistently in the top 5% of their class',
            'Above average — within the top 25%',
            'Steady and progressing at their own pace',
            'Flexible — depends on the subject and their interest'
          ],
          option_types: ['top_5', 'top_25', 'steady', 'flexible'],
          correct: -1,
          trait: 'academic_expectation'
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2 — CAREER EXPECTATIONS (6 questions, likert + choice)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 2,
      name: 'Career Expectations',
      icon: '🎯',
      color: '#7E3AF2',
      type: 'likert',
      description: 'Share your expectations about career stability, income, and prestige.',
      questions: [
        {
          id: 7,
          text: 'A career that provides long-term job security and stability is more important than one that aligns perfectly with personal passion.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'stability_priority'
        },
        {
          id: 8,
          text: 'What salary range do you consider acceptable for your child\'s first professional role after completing education?',
          options: [
            '₹3–8 LPA — a reasonable start',
            '₹8–15 LPA — a competitive start',
            '₹15–30 LPA — a premium start',
            'Salary is less important than career growth and learning'
          ],
          option_types: ['low_salary', 'moderate_salary', 'high_salary', 'growth_focus'],
          correct: -1,
          trait: 'salary_expectation'
        },
        {
          id: 9,
          text: 'It is important to me that my child\'s career is widely respected and holds social prestige.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'prestige_priority'
        },
        {
          id: 10,
          text: 'I would be comfortable if my child pursued a career that is unconventional or relatively new, as long as they are passionate about it.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'career_flexibility',
          reverse: true
        },
        {
          id: 11,
          text: 'I would be supportive of my child building a career that involves working internationally or relocating abroad.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'international_career_openness'
        },
        {
          id: 12,
          text: 'Job security and predictability in income are among the most important factors when choosing a career.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'job_security_priority'
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3 — FINANCIAL & PRACTICAL CONSIDERATIONS (5 questions)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 3,
      name: 'Financial & Practical Considerations',
      icon: '💰',
      color: '#057A55',
      type: 'choice',
      description: 'Share your financial comfort level for your child\'s higher education.',
      questions: [
        {
          id: 13,
          text: 'What is your comfortable budget range for your child\'s higher education (total, including tuition and living costs)?',
          options: [
            'Up to ₹10 Lakhs',
            '₹10–25 Lakhs',
            '₹25–50 Lakhs',
            '₹50 Lakhs or more',
            'Flexible — depends on programme quality and outcomes'
          ],
          option_types: ['budget_low', 'budget_moderate', 'budget_high', 'budget_very_high', 'budget_flexible'],
          correct: -1,
          trait: 'education_budget'
        },
        {
          id: 14,
          text: 'I would be open to my child taking an education loan if it significantly improves their career prospects.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'loan_openness'
        },
        {
          id: 15,
          text: 'How important are scholarships in your decision about where your child studies?',
          options: [
            'Essential — cannot proceed without significant scholarship support',
            'Strongly preferred — would significantly influence the choice',
            'Helpful but not a deciding factor',
            'Not a significant factor in our decision'
          ],
          option_types: ['scholarship_essential', 'scholarship_preferred', 'scholarship_helpful', 'scholarship_not_factor'],
          correct: -1,
          trait: 'scholarship_dependency'
        },
        {
          id: 16,
          text: 'I would be willing to invest significantly more if a higher-cost educational programme provides clearly better career outcomes.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'investment_willingness'
        },
        {
          id: 17,
          text: 'How would you describe your family\'s financial preparation for your child\'s higher education?',
          options: [
            'Fully planned and funded',
            'Actively planning and saving',
            'Early stages of planning',
            'Have not started formal planning yet'
          ],
          option_types: ['fully_planned', 'actively_planning', 'early_stages', 'not_started'],
          correct: -1,
          trait: 'financial_readiness'
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4 — STUDY ABROAD EXPECTATIONS (5 questions)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 4,
      name: 'Study Abroad Expectations',
      icon: '🌍',
      color: '#C9A55D',
      type: 'likert',
      description: 'Share your views on international education for your child.',
      questions: [
        {
          id: 18,
          text: 'I am open to my child pursuing their higher education entirely outside India.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'study_abroad_openness'
        },
        {
          id: 19,
          text: 'If your child were to study abroad, which region would you most prefer?',
          options: [
            'North America — USA, Canada',
            'United Kingdom & Europe',
            'Asia-Pacific — Singapore, Australia, New Zealand',
            'Anywhere — the programme matters more than the location',
            'I would prefer my child to study in India'
          ],
          option_types: ['north_america', 'uk_europe', 'asia_pacific', 'anywhere', 'prefer_india'],
          correct: -1,
          trait: 'preferred_region'
        },
        {
          id: 20,
          text: 'The global ranking of the university is one of the most important factors when selecting an institution.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'ranking_importance'
        },
        {
          id: 21,
          text: 'The physical safety and security of the study destination is a top priority for me.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'safety_priority'
        },
        {
          id: 22,
          text: 'How important is it that the study destination provides strong post-study employment opportunities?',
          options: [
            'Most important factor — the destination must have strong job prospects',
            'Very important — a key consideration',
            'Somewhat important — one of several factors',
            'Not a primary concern — education quality matters more'
          ],
          option_types: ['most_important', 'very_important', 'somewhat_important', 'not_primary'],
          correct: -1,
          trait: 'post_study_employment'
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5 — AUTONOMY & DECISION MAKING (5 questions)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 5,
      name: 'Autonomy & Decision Making',
      icon: '🤝',
      color: '#0694A2',
      type: 'likert',
      description: 'Share your views on career decision-making and your child\'s independence.',
      questions: [
        {
          id: 23,
          text: 'Who do you believe should have the primary voice in deciding your child\'s career direction?',
          options: [
            'Primarily the student — they should lead their own path',
            'Primarily the parents — we have more experience and perspective',
            'A collaborative family decision — student input with parental guidance',
            'Guided by a professional counsellor or mentor'
          ],
          option_types: ['student_led', 'parent_led', 'collaborative', 'professional_guided'],
          correct: -1,
          trait: 'decision_ownership'
        },
        {
          id: 24,
          text: 'I believe my child is mature enough to make well-informed career decisions independently.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'child_independence_readiness'
        },
        {
          id: 25,
          text: 'I am comfortable allowing my child to experiment with different career paths before committing to one.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'experimentation_openness'
        },
        {
          id: 26,
          text: 'I would support my child choosing a non-traditional or emerging career field even if the outcomes are less predictable.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'non_traditional_openness'
        },
        {
          id: 27,
          text: 'I would be supportive if my child wanted to change their career direction significantly after starting.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'career_change_comfort'
        }
      ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 6 — RISK, SUPPORT & CONCERNS (6 questions)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 6,
      name: 'Risk, Support & Concerns',
      icon: '🛡️',
      color: '#690B1B',
      type: 'choice',
      description: 'Share your risk tolerance, support style, and primary concerns.',
      questions: [
        {
          id: 28,
          text: 'I am comfortable with my child taking calculated risks in their career, such as joining a startup or freelancing, if the potential reward is high.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'risk_tolerance'
        },
        {
          id: 29,
          text: 'What best describes your expectations for your child\'s academic performance?',
          options: [
            'Must be a top performer in every subject',
            'Should perform above average consistently',
            'Should develop steadily at their own pace',
            'Performance varies — I focus on effort and growth'
          ],
          option_types: ['top_performer', 'above_average', 'steady_pace', 'effort_focused'],
          correct: -1,
          trait: 'performance_expectation'
        },
        {
          id: 30,
          text: 'What kind of support role do you see yourself playing in your child\'s career journey?',
          options: [
            'Hands-on — actively guiding every decision',
            'Mentoring — providing advice when asked',
            'Encouraging independence — stepping back and supporting from a distance',
            'Deferring to professional guidance — relying on counsellors and experts'
          ],
          option_types: ['hands_on', 'mentoring', 'encouraging_independence', 'professional_guidance'],
          correct: -1,
          trait: 'support_style'
        },
        {
          id: 31,
          text: 'What is your single greatest concern about your child\'s career future?',
          options: [
            'Financial security and stable income',
            'Career satisfaction and personal fulfilment',
            'Social recognition and professional status',
            'Work-life balance and personal wellbeing'
          ],
          option_types: ['financial_security', 'career_satisfaction', 'social_recognition', 'work_life_balance'],
          correct: -1,
          trait: 'primary_concern'
        },
        {
          id: 32,
          text: 'What outcome would make you feel most satisfied about your child\'s career in the long term?',
          options: [
            'High income and financial independence',
            'Doing meaningful, fulfilling work',
            'Building a respected, prestigious career',
            'Living a balanced, healthy life'
          ],
          option_types: ['high_income', 'meaningful_work', 'prestigious_career', 'balanced_life'],
          correct: -1,
          trait: 'desired_outcome'
        },
        {
          id: 33,
          text: 'Overall, I feel confident that my child is on the right path and will find a career that suits them.',
          options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          correct: -1,
          trait: 'overall_confidence'
        }
      ]
    }
  ]
};
