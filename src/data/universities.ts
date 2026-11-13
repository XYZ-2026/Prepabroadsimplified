/**
 * Universities shown on /research. Logos live in /public/images/universities/<id>.webp
 * (sourced from Wikipedia / Wikimedia Commons). A university with no `logo` renders as a
 * text tile using `short`, so a missing file never breaks the layout.
 */
export interface University {
  id: string;
  name: string;
  short: string;
  country: string;
  logo?: string;
}

const logo = (id: string) => `/images/universities/${id}.webp`;

const u = (id: string, name: string, short: string, country: string, hasLogo = true): University => ({
  id,
  name,
  short,
  country,
  ...(hasLogo ? { logo: logo(id) } : {}),
});

/** 40 widely recognised study-abroad destinations, mixed by country so each marquee lane is varied. */
export const GLOBAL_UNIVERSITIES: University[] = [
  u('mit', 'Massachusetts Institute of Technology', 'MIT', 'USA'),
  u('oxford', 'University of Oxford', 'Oxford', 'UK'),
  u('stanford', 'Stanford University', 'Stanford', 'USA'),
  u('nus', 'National University of Singapore', 'NUS', 'Singapore'),
  u('harvard', 'Harvard University', 'Harvard', 'USA'),
  u('cambridge', 'University of Cambridge', 'Cambridge', 'UK'),
  u('toronto', 'University of Toronto', 'Toronto', 'Canada'),
  u('caltech', 'California Institute of Technology', 'Caltech', 'USA'),
  u('imperial', 'Imperial College London', 'Imperial', 'UK'),
  u('eth-zurich', 'ETH Zurich', 'ETH Zurich', 'Switzerland'),
  u('princeton', 'Princeton University', 'Princeton', 'USA'),
  u('melbourne', 'University of Melbourne', 'Melbourne', 'Australia'),
  u('yale', 'Yale University', 'Yale', 'USA'),
  u('ucl', 'University College London', 'UCL', 'UK'),
  u('ubc', 'University of British Columbia', 'UBC', 'Canada'),
  u('columbia', 'Columbia University', 'Columbia', 'USA'),
  u('ntu', 'Nanyang Technological University', 'NTU Singapore', 'Singapore'),
  u('upenn', 'University of Pennsylvania', 'UPenn', 'USA'),
  u('lse', 'London School of Economics and Political Science', 'LSE', 'UK'),
  u('epfl', 'EPFL', 'EPFL', 'Switzerland'),
  u('cornell', 'Cornell University', 'Cornell', 'USA'),
  u('sydney', 'University of Sydney', 'Sydney', 'Australia'),
  u('uchicago', 'University of Chicago', 'UChicago', 'USA'),
  u('edinburgh', 'University of Edinburgh', 'Edinburgh', 'UK'),
  u('mcgill', 'McGill University', 'McGill', 'Canada'),
  u('johns-hopkins', 'Johns Hopkins University', 'Johns Hopkins', 'USA'),
  u('hku', 'University of Hong Kong', 'HKU', 'Hong Kong'),
  u('uc-berkeley', 'University of California, Berkeley', 'UC Berkeley', 'USA'),
  u('kcl', "King's College London", "King's College", 'UK'),
  u('tum', 'Technical University of Munich', 'TU Munich', 'Germany'),
  u('ucla', 'University of California, Los Angeles', 'UCLA', 'USA'),
  u('anu', 'Australian National University', 'ANU', 'Australia'),
  u('umich', 'University of Michigan', 'Michigan', 'USA'),
  u('manchester', 'University of Manchester', 'Manchester', 'UK'),
  u('nyu', 'New York University', 'NYU', 'USA'),
  u('carnegie-mellon', 'Carnegie Mellon University', 'Carnegie Mellon', 'USA'),
  u('duke', 'Duke University', 'Duke', 'USA'),
  u('northwestern', 'Northwestern University', 'Northwestern', 'USA'),
  u('brown', 'Brown University', 'Brown', 'USA'),
  u('georgia-tech', 'Georgia Institute of Technology', 'Georgia Tech', 'USA'),
];

/** Indian universities whose admission process includes an interview. */
export const INDIAN_INTERVIEW_UNIVERSITIES: University[] = [
  u('ashoka', 'Ashoka University', 'Ashoka', 'India'),
  u('plaksha', 'Plaksha University', 'Plaksha', 'India'),
  u('krea', 'Krea University', 'Krea', 'India'),
  u('flame', 'FLAME University', 'FLAME', 'India'),
  u('jindal', 'O.P. Jindal Global University', 'O.P. Jindal', 'India'),
  u('azim-premji', 'Azim Premji University', 'Azim Premji', 'India'),
  u('shiv-nadar', 'Shiv Nadar University', 'Shiv Nadar', 'India'),
  u('ahmedabad', 'Ahmedabad University', 'Ahmedabad Univ.', 'India'),
  u('christ', 'Christ University', 'Christ', 'India'),
  u('symbiosis', 'Symbiosis International University', 'Symbiosis', 'India'),
];
