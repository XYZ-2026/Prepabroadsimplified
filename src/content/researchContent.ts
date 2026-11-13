/**
 * Every word on /research lives here, so copy changes never touch components.
 * Programs, comparison rows and FAQ answers must stay consistent with each other:
 * if you change a duration or a session count, update all three.
 */

/** Booking link tagged with where on the page the click came from. Read by /book-a-demo as `sourcePage`. */
export function bookCallHref(placement: string): string {
  return `/book-a-demo?from=research:${placement}`;
}

export type ProgramId = 'mentorship' | 'full-hybrid' | 'short-hybrid';

export interface Program {
  id: ProgramId;
  name: string;
  shortName: string;
  weeks: number;
  format: string;
  summary: string;
  goal: string;
  includes: string[];
  featured?: boolean;
}

export const RESEARCH_CONTENT = {
  bookCall: {
    label: 'Book a research call',
    note: 'Free 30-minute call with a research counsellor',
  },

  hero: {
    chip: 'Research mentorship for Classes 9–12',
    headlineLines: ['Write a real research paper.', 'Submit it in 16 weeks.'],
    subcopy:
      'One mentor, one question you care about, and a weekly plan that takes you from a blank page to a paper ready for journals, competitions and your college applications.',
    secondaryCta: { label: 'See the programs', href: '#programs' },
    photo: {
      src: '/images/research/hero-mentor.webp',
      alt: 'A Clarvo student explaining her research findings to her mentor over a printed draft',
    },
    progressCard: {
      label: 'Your paper, week by week',
      stages: [
        { week: 'Wk 1–3', name: 'Question' },
        { week: 'Wk 4–8', name: 'Literature & method' },
        { week: 'Wk 9–13', name: 'Analysis & draft' },
        { week: 'Wk 14–16', name: 'Revise & submit' },
      ],
    },
  },

  facts: ['Mentor-led, 1-on-1', '8 or 16 week tracks', 'Feedback on every draft', 'Journal & competition submission support'],

  stories: {
    eyebrow: 'Student stories',
    headline: 'Students who started with a question, and finished with a paper.',
    subcopy: 'What students and parents say after going through Clarvo research mentorship.',
    initialCount: 3,
    expandedCount: 9,
    showMoreLabel: 'Show more stories',
    showLessLabel: 'Show fewer stories',
  },

  universities: {
    eyebrow: 'Where research matters',
    headline: 'Universities our students are building towards',
    subcopy:
      'From the Ivy League and Oxbridge to Ashoka and Plaksha, selective universities look for evidence of independent thinking. A finished research paper is one of the clearest ways to show it.',
  },

  programs: {
    eyebrow: 'Choose your track',
    headline: 'Three ways to write your first paper',
    subcopy:
      'Every track ends with help choosing where to submit and preparing your paper for it. Pick the one that fits how much time and guidance you want.',
    goalLabel: 'You finish with',
    includesLabel: "What's included",
    featuredLabel: 'Most chosen',
    cta: 'Apply: book a call',
    items: [
      {
        id: 'mentorship',
        name: '1-on-1 Mentorship',
        shortName: '1-on-1',
        weeks: 16,
        format: 'Individual',
        summary: 'The most guided path: a weekly live session with your mentor from the first idea to the final submission.',
        goal: 'An original research paper ready for journal submission',
        includes: [
          'Weekly 1-on-1 session with your mentor',
          'Topic chosen around your interests and target course',
          'Section-by-section guidance on structure and method',
          'Written feedback on every draft',
          'Submission planning for journals and competitions',
          'Scheduling that works around school and exams',
        ],
        featured: true,
      },
      {
        id: 'full-hybrid',
        name: 'Full Hybrid',
        shortName: 'Full hybrid',
        weeks: 16,
        format: 'Self-paced + 1-on-1',
        summary: 'A structured weekly curriculum you work through on your own time, with a monthly live check-in with your mentor.',
        goal: 'An original research paper ready for journal submission',
        includes: [
          'Weekly lessons and templates for each stage',
          'Monthly 1-on-1 check-in with your mentor',
          'Written feedback on your work every week',
          'A clear checklist for every stage of the paper',
          'Submission planning for journals and competitions',
        ],
      },
      {
        id: 'short-hybrid',
        name: 'Short Hybrid',
        shortName: 'Short hybrid',
        weeks: 8,
        format: 'Self-paced + 1-on-1',
        summary: 'The fastest route to a finished paper: ideal for a first taste of research or a tight application timeline.',
        goal: 'A review paper ready for journal submission',
        includes: [
          'Eight weeks of lessons and templates',
          'One dedicated 1-on-1 session with your mentor',
          'Focused training on writing a strong review paper',
          'Written feedback on your work every week',
          'Submission planning for journals and competitions',
        ],
      },
    ] satisfies Program[],
  },

  compare: {
    eyebrow: 'Side by side',
    headline: 'Compare the tracks',
    rows: [
      { label: 'Duration', values: { mentorship: '16 weeks', 'full-hybrid': '16 weeks', 'short-hybrid': '8 weeks' } },
      { label: 'Format', values: { mentorship: 'Individual', 'full-hybrid': 'Self-paced + 1-on-1', 'short-hybrid': 'Self-paced + 1-on-1' } },
      { label: 'Live mentor sessions', values: { mentorship: 'Weekly', 'full-hybrid': 'Monthly', 'short-hybrid': 'One session' } },
      { label: 'Type of paper', values: { mentorship: 'Original research', 'full-hybrid': 'Original research', 'short-hybrid': 'Review paper' } },
      { label: 'Weekly written feedback', values: { mentorship: true, 'full-hybrid': true, 'short-hybrid': true } },
      { label: 'Submission support', values: { mentorship: true, 'full-hybrid': true, 'short-hybrid': true } },
      { label: 'Prior research needed', values: { mentorship: 'None', 'full-hybrid': 'None', 'short-hybrid': 'None' } },
      {
        label: 'Best for',
        values: {
          mentorship: 'Students who want the most guidance',
          'full-hybrid': 'Independent workers who like structure',
          'short-hybrid': 'A first paper on a short timeline',
        },
      },
    ] as { label: string; values: Record<ProgramId, string | boolean> }[],
  },

  steps: {
    eyebrow: 'How it works',
    headline: 'From first call to final submission',
    items: [
      { title: 'Book a call', body: 'A short call with a research counsellor to understand your interests, timeline and goals, and to see which track fits.' },
      { title: 'Shape your question', body: 'With your mentor, narrow a broad interest into one focused question you can genuinely answer in the time you have.' },
      { title: 'Research and write', body: 'Read the literature, choose a method, gather or analyse data and write each section, with feedback at every step.' },
      { title: 'Submit', body: 'Revise to a final draft, then choose and prepare for the journals, competitions or science fairs that suit your paper.' },
    ],
  },

  faq: {
    eyebrow: 'Questions & answers',
    headline: 'Questions students and parents ask',
    items: [
      {
        question: 'Does my child need any research experience?',
        answer:
          'No. Every track starts from the basics: how to find a question, read papers and structure an argument. Curiosity and a few hours a week matter far more than prior experience.',
      },
      {
        question: 'What subjects can students research?',
        answer:
          'Almost anything with existing literature to build on: computer science, economics, psychology, biology, environmental science, public policy, history and more. Mentors are matched to the subject.',
      },
      {
        question: 'What is the difference between an original paper and a review paper?',
        answer:
          'An original paper answers a new question with your own analysis or data. A review paper reads and compares existing studies on a topic to draw a clear conclusion. Both are real research; a review paper is quicker to complete, which is why the 8-week track uses it.',
      },
      {
        question: 'How much time does it take each week?',
        answer:
          'Plan for roughly 3–5 hours a week, including any live session. The workload is spread so it can sit alongside school, board exams and test preparation.',
      },
      {
        question: 'Is publication guaranteed?',
        answer:
          'No honest program can guarantee it, because journals decide independently. What we do guarantee is a finished paper, a shortlist of suitable journals and competitions, and help preparing every submission.',
      },
      {
        question: 'What happens after the program ends?',
        answer:
          'We help you pick where to submit, format the paper for each venue and respond to reviewer comments if they come back. Your counsellor also helps you present the paper in college applications.',
      },
      {
        question: 'Which track is right for my child?',
        answer:
          'If they want weekly accountability, choose 1-on-1 Mentorship. If they are self-driven and like structure, the Full Hybrid works well. If time is short or this is a first try at research, start with the Short Hybrid. The booking call is the easiest way to decide.',
      },
      {
        question: 'Which classes is this for?',
        answer:
          'Students in Classes 9 to 12. Class 10 and 11 is often the best time to start, so the paper is finished well before applications open.',
      },
      {
        question: 'How do the hybrid tracks work day to day?',
        answer:
          'Each week a short lesson and template arrive on the dashboard. The student works through them, submits their progress and gets written feedback within the week. Live sessions with the mentor are scheduled at a time that suits the family.',
      },
      {
        question: 'Will a research paper really help college applications?',
        answer:
          'It shows what admissions teams look for: sustained curiosity, independent work and the ability to finish something hard. It also gives the student a genuine story for essays and interviews, which matters most at universities that interview applicants.',
      },
    ],
  },

  cta: {
    headline: 'Not sure which track fits?',
    subcopy: 'Book a free call. We will look at your interests, schedule and goals, and recommend the right place to start.',
    note: 'No commitment needed.',
    photo: {
      src: '/images/research/cta-students.webp',
      alt: 'Three Clarvo students smiling, one holding a bound research paper',
    },
  },

  stickyBar: {
    secondary: { label: 'Programs', href: '#programs' },
  },
};
