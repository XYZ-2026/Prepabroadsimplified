// Demo profile shown at /demo so the design can be previewed without a real student row.
import { recordToProfile, type PortfolioProfile, type PortfolioRecord } from './portfolioTypes';

export const DEMO_USERNAME = 'demo';

const DEMO_RECORD: PortfolioRecord = {
  username: DEMO_USERNAME,
  published: true,
  fullName: 'Aarav Sharma',
  photo: '',
  photoCutout: false,
  grade: 'Grade 11',
  stream: 'Science (PCM)',
  school: 'Greenwood International School',
  city: 'Hyderabad',
  dream: 'Aerospace Engineering',
  bio: 'Grade 11 student who is curious about how things work — happiest building science projects, leading the robotics club and debating big ideas. Aiming for Aerospace Engineering, one episode at a time.',
  academics: [
    { label: 'Grade 11 · Science (PCM)', detail: 'Greenwood International School, Hyderabad', score: 'Ongoing' },
    { label: 'Grade 10 Board Exams', detail: 'CBSE', score: '96.2%' },
    { label: 'Grade 9', detail: 'Class rank #2 of 120', score: '94%' },
  ],
  activities: [
    { title: 'Captain, Robotics Club', org: 'Greenwood International School', years: '2024 — Present', detail: 'Leads a 20-member team to inter-school competitions.' },
    { title: 'Student Council — Cultural Secretary', org: 'Greenwood International School', years: '2024 — 2025', detail: 'Organised the annual fest for 1,500+ students.' },
    { title: 'Volunteer Tutor', org: 'Teach for Tomorrow (NGO)', years: '2023 — Present', detail: 'Teaches maths to Grade 6 students every weekend.' },
  ],
  projects: [
    { title: 'Smart Irrigation Kit', tagline: 'Soil-moisture sensor + Arduino that waters the school garden only when needed — saved ~30% water.', tags: ['Arduino', 'Sensors', 'Science Fair'], year: '2025', link: '' },
    { title: 'Lost & Found App', tagline: 'A simple web app where students post and claim lost items around campus.', tags: ['HTML/CSS', 'JavaScript', 'Teamwork'], year: '2025', link: '' },
    { title: 'Plastic-Free Campus', tagline: 'Awareness drive that replaced single-use cups in the cafeteria with steel tumblers.', tags: ['Leadership', 'Sustainability'], year: '2024', link: '' },
    { title: 'Teen Sleep Study', tagline: 'Survey-based research on sleep and exam stress across 300 students, presented at a youth summit.', tags: ['Research', 'Statistics', 'Writing'], year: '2024', link: '' },
  ],
  awards: [
    { tag: 'Olympiad', title: 'Gold Medal', subtitle: 'National Science Olympiad', detail: 'Zonal rank 14, International rank 212.' },
    { tag: 'Debate', title: 'Best Speaker', subtitle: 'Inter-School Debate', detail: 'Won against 32 schools on climate policy.' },
    { tag: 'Maths', title: 'Top 1%', subtitle: 'Math Olympiad', detail: 'Qualified for the regional round twice.' },
    { tag: 'Robotics', title: 'Runner-Up', subtitle: 'State Robotics Challenge', detail: 'Line-follower bot built by our club.' },
    { tag: 'Sports', title: 'Captain', subtitle: 'School Football Team', detail: 'Led the team to the district semi-finals.' },
  ],
  certifications: [
    { issuer: 'Online Course', title: 'Python for Beginners' },
    { issuer: 'Summer School', title: 'Young Scientists Programme' },
    { issuer: 'Workshop', title: 'Design Thinking for Teens' },
    { issuer: 'Trinity', title: 'Grade 5 Keyboard' },
    { issuer: 'Model UN', title: 'Delegate — 3 Conferences' },
  ],
  skills: [
    { name: 'Academics', skills: ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'Economics'] },
    { name: 'Tech', skills: ['Python', 'Scratch', 'Arduino', 'HTML & CSS', 'Canva'] },
    { name: 'Creative', skills: ['Public Speaking', 'Creative Writing', 'Photography', 'Keyboard'] },
    { name: 'Life Skills', skills: ['Leadership', 'Teamwork', 'Time Management', 'Problem Solving'] },
    { name: 'Sports', skills: ['Football', 'Chess', 'Swimming'] },
    { name: 'Languages', skills: ['English', 'Hindi', 'Telugu', 'French (A2)'] },
  ],
  journey: [
    { title: 'Grade 8 · The Spark', years: '2022', highlights: [
      { title: 'First Science Fair', detail: 'Built a volcano model and got hooked on experiments.' },
      { title: 'Joined Robotics Club', detail: 'Learnt to code with Scratch and LEGO kits.' },
    ] },
    { title: 'Grade 9 · Finding My Voice', years: '2023', highlights: [
      { title: 'Debate Debut', detail: 'First inter-school debate — lost, learnt a lot.' },
      { title: 'Volunteer Tutoring', detail: 'Started teaching maths at a local NGO.' },
    ] },
    { title: 'Grade 10 · Board Year', years: '2024', highlights: [
      { title: 'Board Exams', detail: 'Scored 96.2% while captaining the football team.' },
      { title: 'Plastic-Free Campus', detail: 'Led a campaign the whole school adopted.' },
    ] },
    { title: 'Grade 11 · Building Real Things', years: '2025 — Now', highlights: [
      { title: 'Robotics Captain', detail: 'Leading the club to the state finals.' },
      { title: 'Next Up', detail: 'Preparing for a future in Aerospace Engineering.' },
    ] },
  ],
  links: { email: 'hello@example.com', linkedin: '', github: '', website: '', cv: '' },
};

export function buildDemoProfile(): PortfolioProfile {
  return recordToProfile(DEMO_RECORD);
}
