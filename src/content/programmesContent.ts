/**
 * Copy for the programme pages (server only). No partner companies, certificates or results are
 * claimed here: add them only with a signed agreement or proof.
 */
import type { Photo } from './summerSchoolContent';
import { PROGRAMMES, findProgramme, type ProgrammeInfo } from './programmeList';

interface Act {
  label: string;
  title: string;
  points: string[];
}

interface ProgrammeCopy {
  line: string;
  /** Large statement that lights up word by word. */
  mission: string;
  outcome: string;
  suits: string[];
  acts: Act[];
  photo: Photo;
}

export interface Programme extends ProgrammeInfo, ProgrammeCopy {}

/** Alt text, and where the student is in the picture so every crop keeps the face. */
const PHOTOS: Record<string, [alt: string, focus: string]> = {
  launchpad: ['Student launching a small weather balloon from a rooftop with two friends', '36% 45%'],
  'young-ceo': ['Student leading a team holding a camera, laptop, sketchbook and robot', '44% 20%'],
  'young-cso': ['Student moving a game piece while three teammates watch', '54% 30%'],
  'young-cto': ['Student soldering a circuit board under a lamp', '70% 25%'],
  'young-cfo': ['Student speaking at the head of a meeting table with charts behind', '74% 30%'],
  'young-cmo': ['Student studying blank posters on a studio wall', '100% 30%'],
  'young-founder': ['Student holding a handmade prototype in a workshop', '66% 20%'],
  'jr-mba-consulting': ['Student taking notes in a hotel lobby', '100% 20%'],
  'jr-mba-artificial-intelligence': ['Student waving at a camera on a robot arm', '80% 25%'],
  'jr-mba-finance': ['Student reading a market chart on a laptop at night', '86% 25%'],
  'jr-mba-digital-marketing': ['Student filming a plain sports shoe with a phone', '74% 25%'],
  'jr-mba-entrepreneurship': ['Student pitching on stage to a panel', '90% 25%'],
  'jr-mba-data-analytics': ['Student studying charts projected on a wall', '86% 25%'],
  'jr-mba-ux-design': ['Student arranging paper wireframes on a glass wall', '86% 25%'],
  'jr-mba-technology': ['Student testing an app on a phone', '86% 25%'],
  'jr-mba-design-branding': ['Student holding up a blank packaging box', '70% 20%'],
  'jr-mba-advertising': ['Student directing a small ad shoot of a food bowl', '100% 25%'],
};

export const programmePhoto = (slug: string, alt: string, focus: string): Photo => ({ src: `/images/programmes/${slug}.webp`, alt, focus });

/** Three weeks of five one-hour sessions. */
const weeks = (...acts: [title: string, ...points: string[]][]): Act[] => acts.map(([title, ...points], i) => ({ label: `Week ${i + 1}`, title, points }));

const COPY: Record<string, Omit<ProgrammeCopy, 'acts' | 'photo'> & { acts?: Act[] }> = {
  'jr-mba-advertising': {
    line: 'Learn why people notice one ad and scroll past the next, then make your own.',
    mission: 'A food brand has thirty seconds of a stranger’s attention. Find the one thing worth saying, and make them remember it.',
    outcome: 'An original video ad, pitched to the class',
    suits: ['Students who like stories, film and people', 'Anyone curious about media or marketing'],
    acts: weeks(
      ['Know the audience', 'Who buys, and why', 'Value and brand image', 'Finding a clear position'],
      ['Build the idea', 'How a strong ad is put together', 'Storyboarding scene by scene', 'Making an animated video'],
      ['Make it land', 'Testing with real viewers', 'What makes an idea spread', 'Presenting the final ad'],
    ),
  },
  'jr-mba-design-branding': {
    line: 'Use layout, colour and type to make a product people pick up.',
    mission: 'A shopper gives a shelf three seconds. Design a pack that tells them what is inside, who it is for and why it is better.',
    outcome: 'A finished packaging design',
    suits: ['Students who draw, edit or make posters', 'Future designers, architects and brand managers'],
    acts: weeks(
      ['See like a designer', 'What a brand really is', 'Layout and hierarchy', 'Choosing type'],
      ['Design with purpose', 'What colours make people feel', 'Image editing tools', 'Moodboards and sketches'],
      ['Make the pack', 'Building the full design', 'Feedback and changes', 'Presenting the choices you made'],
    ),
  },
  'jr-mba-technology': {
    line: 'Go from a problem you notice to an app someone else can use.',
    mission: 'Most apps fail because nobody needed them. Start with a problem people your age really have, then build the simplest app that solves it.',
    outcome: 'A working app prototype, shown on demo day',
    suits: ['Students who want to build, with or without coding', 'Future engineers and product managers'],
    acts: weeks(
      ['Find the problem', 'Choosing a problem worth solving', 'The smallest useful version', 'Planning how people move through it'],
      ['Build the app', 'Visual app building', 'Inputs, outputs and logic', 'A log-in screen that works'],
      ['Test and show', 'Testing with classmates', 'Fixing what confuses people', 'Demo day'],
    ),
  },
  'jr-mba-ux-design': {
    line: 'Redesign a confusing screen so anyone can use it.',
    mission: 'Every wrong tap is the designer’s fault. Watch how people use a booking page, find where they get stuck and redesign it.',
    outcome: 'A clickable prototype of a better booking page',
    suits: ['Students who notice when things are badly designed', 'Future designers, psychologists and engineers'],
    acts: weeks(
      ['Understand people', 'How UX design works', 'Asking good research questions', 'Mapping what users need'],
      ['Shape the screens', 'Wireframes', 'Guiding choices fairly', 'Organising information'],
      ['Prototype and test', 'Clickable prototypes', 'Watching real people use it', 'Presenting before and after'],
    ),
  },
  'jr-mba-data-analytics': {
    line: 'Turn a messy sales sheet into a decision a business can act on.',
    mission: 'Thousands of rows of sales, one question: what should this company do next? Find the pattern, and prove it.',
    outcome: 'A dashboard with a growth recommendation',
    suits: ['Students who like numbers and puzzles', 'Future analysts, economists and scientists'],
    acts: weeks(
      ['Ask the data', 'What business analytics is for', 'Reading and cleaning a dataset', 'Choosing the right chart'],
      ['Find the story', 'Building a dashboard', 'Grouping and comparing', 'Measures that matter'],
      ['Recommend', 'Marketing and sales decisions', 'Product decisions', 'Presenting your recommendation'],
    ),
  },
  'jr-mba-entrepreneurship': {
    line: 'Take an idea through customers, costs and questions, to a pitch.',
    mission: 'An idea is only a guess until a customer says yes. Talk to real people, work out the numbers and defend your business in front of a panel.',
    outcome: 'A business plan and a live pitch',
    suits: ['Students with ideas they keep coming back to', 'Future founders and business students'],
    acts: weeks(
      ['Find the customer', 'Setting a vision', 'Talking to customers', 'What you offer, and to whom'],
      ['Make it work', 'Business models', 'Revenue and costs', 'Ways to reach customers'],
      ['Pitch it', 'Growing a business', 'Ethics in business', 'The final pitch'],
    ),
  },
  'jr-mba-digital-marketing': {
    line: 'Plan a social campaign with a goal, a budget and results you can read.',
    mission: 'Anyone can post. Plan a campaign for a sportswear brand that reaches the right people, and know whether it worked.',
    outcome: 'A complete social media campaign',
    suits: ['Students who already make content', 'Future marketers and creators'],
    acts: weeks(
      ['Set the goal', 'Brand and customer profiles', 'Goals you can measure', 'Choosing the right platform'],
      ['Create', 'Planning content', 'Designing posts and mock-ups', 'How paid ads work'],
      ['Measure', 'Tracking performance', 'Learning from competitors', 'Presenting the campaign'],
    ),
  },
  'jr-mba-finance': {
    line: 'Understand saving, investing and risk before your first salary.',
    mission: 'Money grows or shrinks with every choice. Learn how companies and markets work, then build a portfolio and explain every decision.',
    outcome: 'A sample investment portfolio with reasons',
    suits: ['Students curious about money and markets', 'Future finance, commerce and economics students'],
    acts: weeks(
      ['How money grows', 'Saving and compounding', 'Debt and equity', 'What a share is'],
      ['Read a company', 'Financial statements', 'Company value and price', 'How companies go public'],
      ['Build a portfolio', 'Understanding risk', 'Spreading risk', 'Explaining your choices'],
    ),
  },
  'jr-mba-artificial-intelligence': {
    line: 'Train a model yourself and see what AI can and cannot do.',
    mission: 'AI learns from what we show it. Train a model to recognise images, sounds or movement, then find out where it goes wrong.',
    outcome: 'A machine learning model you trained',
    suits: ['Students who want to understand AI, not just use it', 'Future engineers, doctors and researchers'],
    acts: weeks(
      ['How machines learn', 'Learning with and without labels', 'Neural networks, explained simply', 'Training your first model'],
      ['AI around you', 'How recommendations work', 'Making images', 'How AI reads language'],
      ['Build and question', 'Learning by trial and error', 'People and AI working together', 'Showing your model'],
    ),
  },
  'jr-mba-consulting': {
    line: 'Solve the kind of problem companies pay experts to solve.',
    mission: 'A luxury hotel wants to waste less without losing a single guest. Study how it runs, and recommend what to change.',
    outcome: 'A sustainability strategy for a hotel',
    suits: ['Students who like case studies and debate', 'Future consultants, managers and policymakers'],
    acts: weeks(
      ['See the system', 'How a business operates', 'Trade-offs', 'Finding the bottleneck'],
      ['Follow the goods', 'Supply chains', 'Stock and delivery', 'Doing things the same way'],
      ['Recommend', 'Reusing instead of wasting', 'A sustainability case study', 'Presenting your strategy'],
    ),
  },
  'young-founder': {
    line: 'Find an idea, build it and get people to want it.',
    mission: 'A founder does three jobs at once: choose the right problem, make something that solves it and tell the world.',
    outcome: 'A pitch, an app prototype and an ad',
    suits: ['Students who want to start something of their own', 'Business and entrepreneurship applicants'],
  },
  'young-cmo': {
    line: 'Learn how brands are seen, designed and shared.',
    mission: 'Great products stay unknown every day. Learn to find the audience, design what they see and reach them where they are.',
    outcome: 'An ad, a packaging design and a campaign',
    suits: ['Creative students who also like strategy', 'Marketing, media and design applicants'],
  },
  'young-cfo': {
    line: 'Read the numbers behind a business and decide with them.',
    mission: 'Behind every big decision is someone who understood the numbers. Learn how a business earns, what its data says and where its money should go.',
    outcome: 'A business plan, a portfolio and a dashboard',
    suits: ['Students who enjoy maths and commerce', 'Finance and economics applicants'],
  },
  'young-cto': {
    line: 'Design a product, build it and make it easy to use.',
    mission: 'Technology matters only when people can use it. Find the problem, design the experience and build the first version.',
    outcome: 'A pitch, a UX prototype and an app',
    suits: ['Students who love building things', 'Computer science and design applicants'],
  },
  'young-cso': {
    line: 'Study a business, read its data and choose its next move.',
    mission: 'Strategy is deciding what not to do. Learn how businesses work, what the data shows and how to defend a recommendation.',
    outcome: 'A pitch, a strategy and a dashboard',
    suits: ['Students who like debate and problem solving', 'Business, economics and policy applicants'],
  },
  'young-ceo': {
    line: 'All ten Jr MBA programmes, for students who want the full picture.',
    mission: 'A chief executive has to understand everyone in the room: the designer, the engineer, the analyst and the customer.',
    outcome: 'Ten projects, one from every programme',
    suits: ['Students who are still exploring careers', 'Students planning over more than one summer'],
    acts: [
      { label: 'Create', title: 'Make people care', points: ['Advertising', 'Design & Branding', 'Digital Marketing'] },
      { label: 'Build', title: 'Make things work', points: ['Technology', 'UX Design', 'Artificial Intelligence', 'Data Analytics'] },
      { label: 'Lead', title: 'Make decisions', points: ['Entrepreneurship', 'Finance', 'Consulting'] },
    ],
  },
  launchpad: {
    line: 'Eight weeks to launch one serious project of your own.',
    mission: 'Not a class. Eight weeks to take one project from an idea to something launched, then defend every choice in front of a panel.',
    outcome: 'One launched project, shown to a panel',
    suits: ['Students with an idea they want to finish', 'Students building an application profile'],
    acts: [
      { label: 'Path 1', title: 'Business', points: ['Testing the idea with customers', 'Building the first version', 'Launch plan and demo day'] },
      { label: 'Path 2', title: 'Research', points: ['Question and reading', 'Method and data', 'Writing the paper'] },
      { label: 'Path 3', title: 'Technology', points: ['Design and prototype', 'Building front and back end', 'Testing and launch'] },
      { label: 'Path 4', title: 'Leadership', points: ['Planning a programme or event', 'Leading a team', 'Running it and reviewing it'] },
    ],
  },
};

/** Tracks are told through the programmes they contain. */
function actsFor({ includes = [] }: ProgrammeInfo): Act[] {
  return includes.map((slug, i) => ({
    label: `Part ${i + 1}`,
    title: findProgramme(slug)!.name.replace('Jr MBA in ', ''),
    points: [COPY[slug].line, `You make: ${COPY[slug].outcome.toLowerCase()}`],
  }));
}

export function getProgramme(slug: string): Programme | undefined {
  const info = findProgramme(slug);
  return info && { ...info, ...COPY[slug], photo: programmePhoto(slug, ...PHOTOS[slug]), acts: COPY[slug].acts ?? actsFor(info) };
}

export const ALL_PROGRAMMES = PROGRAMMES.map((p) => getProgramme(p.slug)!);

/** What a family asks first: how long, how and who. Fees are shared after an enquiry. */
export function factsFor({ kind, includes }: ProgrammeInfo): { label: string; value: string }[] {
  const length = {
    single: '15 one-hour sessions over 3 weeks',
    track: '3 programmes, 45 one-hour sessions',
    all: `${includes?.length} programmes, 150 one-hour sessions`,
    incubator: '8 weeks',
  }[kind];
  return [
    { label: 'Length', value: length },
    { label: 'Format', value: kind === 'incubator' ? 'Online, flexible hours' : 'Live online, Monday to Friday' },
    { label: 'Ages', value: '13 to 18' },
  ];
}

export function faqFor(p: Programme): { question: string; answer: string }[] {
  const [length, format] = factsFor(p);
  return [
    { question: `Who can join ${p.name}?`, answer: 'Students aged 13 to 18. No experience in the subject is needed. A parent or guardian should make the enquiry.' },
    { question: 'How long is it, and how are classes held?', answer: `${length.value}. ${format.value}.` },
    { question: 'What does it cost?', answer: 'Send the enquiry form and a counsellor will share the current fee and the written refund terms.' },
    { question: 'Will my child receive a certificate?', answer: 'Your counsellor will tell you which certificate applies and who issues it before you enrol.' },
    { question: 'When does the next batch start?', answer: 'Batch dates are confirmed with your counsellor. You can tell us the month and time that suit your child.' },
  ];
}
