const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Stories',
    shortLabel: 'All',
    iconName: 'Sparkles',
    description: 'Verified student and parent outcomes across all Clarvo diagnostic and development tracks.'
  },
  {
    id: 'psychometric',
    label: 'Psychometric Assessments',
    shortLabel: 'Assessments',
    iconName: 'Brain',
    description: 'Cognitive stamina, vocational fit (RIASEC), learning modalities (VARK), and Big Five behavioral profiling.'
  },
  {
    id: 'stream-selection',
    label: 'Stream Selection (Class 10)',
    shortLabel: 'Stream Choice',
    iconName: 'Compass',
    description: 'Objective academic alignment across CBSE, ICSE, IB & Cambridge to prevent costly stream regret.'
  },
  {
    id: 'digital-sat',
    label: 'Digital SAT & Test Prep',
    shortLabel: 'Digital SAT',
    iconName: 'Award',
    description: 'Adaptive second-module mastery, Desmos speed routines, and score acceleration to 1500+.'
  },
  {
    id: 'entrepreneurship',
    label: 'Entrepreneurship Programme',
    shortLabel: 'Incubator',
    iconName: 'Rocket',
    description: 'High-school venture incubation, active founder mentorship, real product launches, and demo days.'
  },
  {
    id: 'research-admissions',
    label: 'Research & Global Admissions',
    shortLabel: 'Research & College',
    iconName: 'Globe',
    description: 'Faculty-mentored original papers, peer-reviewed journals, and Ivy League / Russell Group admissions.'
  }
];

// Let's define the comprehensive dataset for all 5 categories (26 items each = 130 total)
const data = {
  categories: CATEGORIES,
};

console.log('Categories defined:', CATEGORIES.map(c => c.id));

