/**
 * Every word and image path on /summer-school, so copy and photo changes never touch components.
 * Numbers, results and names must be CLARVO's own and provable: nothing here is estimated.
 */
import { Award, Compass, FlaskConical, FolderOpen, Hammer, HeartHandshake, Presentation, Send, Smartphone, Sun, type LucideIcon } from 'lucide-react';

export const SUMMER_SCHOOL_NAME = 'Summer School & Certifications';
export const SUMMER_SCHOOL_GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export interface Photo {
  src: string;
  alt: string;
  /** object-position that keeps the subject in view when cropped. */
  focus?: string;
}

const photo = (name: string, alt: string): Photo => ({ src: `/images/summer-school/${name}.webp`, alt });

export const HERO = {
  kicker: 'For students in Grades 8–12',
  title: ['Summer School', '& Certifications'],
  copy: 'Short, mentor-guided programmes in business, technology, research and leadership. Students finish with work they can show universities.',
  cta: 'Get a free consultation',
  secondary: 'See programmes',
  photo: photo('hero-cutout', 'Smiling student in a blue hoodie holding a laptop'),
  orbit: [
    { label: 'Business pitch', Icon: Presentation },
    { label: 'App prototype', Icon: Smartphone },
    { label: 'Research paper', Icon: FlaskConical },
    { label: 'Certificate', Icon: Award },
    { label: 'Social project', Icon: HeartHandshake },
    { label: 'Portfolio', Icon: FolderOpen },
  ] satisfies { label: string; Icon: LucideIcon }[],
};

/** The figures in the first three are already published on the CLARVO home page. */
export const FACTS = [
  { value: '15,000+', label: 'students guided by CLARVO', note: 'Across CBSE, ICSE, IB and Cambridge', photo: photo('students-cutout', 'Seven students with laptops and notebooks') },
  { value: '500+', label: 'global universities mapped', note: 'So projects match the goal', photo: photo('universities', 'Student and parent planning together at a table') },
  { value: '100+', label: 'career specialisations', note: 'To help choose a subject', photo: photo('careers', 'Student choosing between a robot, a camera and a microscope') },
  { value: 'Grades 8–12', label: 'one programme at a time', note: 'Planned around school and exams', photo: photo('schedule', 'Student writing in a planner after school') },
  { value: 'Real work', label: 'not just attendance', note: 'A pitch, prototype, paper or project to show', photo: photo('real-work', 'Hands building a small cardboard robot') },
];

export const PROGRAMS = [
  { title: 'Business & startups', body: 'Find a problem, test an idea with real people and pitch it.', outcome: 'A tested idea and a pitch', photo: photo('business', 'Student pitching a prototype to three classmates') },
  { title: 'Technology & AI', body: 'Design and build a working prototype, then improve it from feedback.', outcome: 'A working prototype', photo: photo('technology', 'Student wiring a small wheeled robot') },
  { title: 'Research & writing', body: 'Turn a question into a structured paper with a mentor’s feedback.', outcome: 'A written paper', photo: photo('research', 'Student taking notes beside a microscope') },
  { title: 'Leadership & social impact', body: 'Plan and run a project that helps a community the student knows.', outcome: 'A completed project', photo: photo('leadership', 'Students sorting books for a donation drive') },
  { title: 'Profile & portfolio', body: 'Bring activities, projects and certificates together on one page.', outcome: 'A shareable portfolio', photo: photo('portfolio', 'Student showing a portfolio on a tablet to a parent') },
];

export const STAND_OUT = {
  lead: 'Most students find it hard to show their',
  highlight: 'stand-out factor',
  close: 'We help them build it, then explain it.',
  caption: 'From an interest to something a student can present.',
  photo: photo('stand-out', 'Student explaining a solar house model at an exhibition'),
};

export const STEPS: { tab: string; Icon: LucideIcon; title: string; body: string; points: string[]; end: string }[] = [
  { tab: 'Set a goal', Icon: Compass, title: 'Find the right subject', body: 'A counsellor talks to the student and parent about:', points: ['interests and earlier activities', 'universities and careers in mind', 'time available around school', 'the kind of work the student enjoys'], end: 'You leave with a suggested programme and a plan.' },
  { tab: 'Learn the skill', Icon: Sun, title: 'Join a summer programme', body: 'The student works through the subject with a mentor:', points: ['guided lessons and practice', 'a project topic they choose', 'feedback while the work is in progress'], end: 'The plan is set around school and exam dates.' },
  { tab: 'Build the work', Icon: Hammer, title: 'Finish something real', body: 'Every programme ends with something to show:', points: ['a pitch, prototype, paper or project', 'a short explanation of what they did', 'details of the certificate, where one applies'], end: 'Your counsellor confirms the certificate and who issues it before you enrol.' },
  { tab: 'Show it', Icon: Send, title: 'Use it in applications', body: 'The student learns to present the work in:', points: ['a CLARVO portfolio', 'activity lists and essays', 'interviews and competitions'], end: 'One project can support several parts of an application.' },
];

export const MENTORS = [
  { title: 'Startup mentors', body: 'Guide students from a problem to a tested idea and a pitch.', photo: photo('mentor-startup', 'Mentor and student arranging ideas on a glass wall') },
  { title: 'Research mentors', body: 'Help students frame a question, choose a method and improve each draft.', photo: photo('mentor-research', 'Mentor marking a draft while a student listens') },
  { title: 'Admissions counsellors', body: 'Connect the finished work to the student’s university plans.', photo: photo('mentor-counsellor', 'Counsellor talking with a student and parent') },
];

export const ADVANTAGES = [
  { title: 'Saves time', body: 'Start with a plan instead of trying random courses and certificates.' },
  { title: 'All in one place', body: 'Subject choice, project, portfolio and application advice from one team.' },
  { title: 'Work that stands out', body: 'A finished project says more than a list of classes attended.' },
];

export const CTA = {
  title: 'Find the right programme this summer.',
  body: 'Tell us the student’s grade and interests. A counsellor will suggest where to start.',
  photo: photo('celebrate-cutout', 'Five students celebrating with a robot, a folder and a tablet'),
};

/** Review ids from testimonials-data.ts, confirmed genuine by the owner (Nov 2026). Chosen for variety of project. */
export const REVIEWS = {
  sub: 'Reviews from the CLARVO Entrepreneurship programme, now Summer School & Certifications.',
  ids: ['ent-07', 'ent-03', 'ent-13', 'ent-11', 'ent-10', 'ent-08', 'ent-22', 'ent-21', 'ent-16'],
};

export const FAQ = [
  { question: 'What is CLARVO Summer School & Certifications?', answer: 'A set of mentor-guided programmes in business, technology, research and leadership. Each one ends with a piece of work the student can show.' },
  { question: 'Who is it for?', answer: 'Students in Grades 8 to 12 from any board. Students do not need experience in the subject they choose.' },
  { question: 'Will my child receive a certificate?', answer: 'Certificates depend on the programme. Your counsellor will tell you which certificate applies and who issues it before you enrol.' },
  { question: 'How does it help with university applications?', answer: 'Students finish with specific work to describe in essays, activity lists, portfolios and interviews. No programme can guarantee admission.' },
  { question: 'When do programmes run and what do they cost?', answer: 'Dates, format and fees depend on the programme. Ask for a free consultation and a counsellor will share the current details.' },
];
