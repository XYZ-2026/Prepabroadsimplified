import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'CLARVO — Clarity for Their Future | Student Development Platform',
  description:
    'Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.',
  keywords: [
    'CLARVO',
    'student development',
    'psychometric assessment',
    'stream selection class 10',
    'career guidance',
    'SAT preparation',
    'one-to-one tutoring',
    'research paper publication high school',
    'university admissions predictor',
    'Simplified Eduventures',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CLARVO — Clarity for Their Future | Student Development Platform',
    description:
      'Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.',
    url: 'https://clarvo.in',
    siteName: 'CLARVO',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://clarvo.in/#organization',
      name: 'CLARVO',
      url: 'https://clarvo.in',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Simplified Eduventures',
        url: 'https://simplifiededuventures.com',
      },
      description:
        'A premium student development platform for Grades 7–12 offering psychometric assessments, stream selection, SAT prep, 1-to-1 tutoring, and research profile building.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://clarvo.in/#website',
      url: 'https://clarvo.in',
      name: 'CLARVO',
      publisher: { '@id': 'https://clarvo.in/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://clarvo.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What age group and grades does CLARVO cater to?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CLARVO is specifically architected for students in Grades 7 through 12, with grade-tailored diagnostic assessments, stream selection guidance for Class 10, SAT coaching, and university profile building for Class 11 and 12.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 30-module Psychometric Assessment determine career and stream fit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our assessment evaluates cognitive agility, RIASEC vocational interests, Big Five personality traits, and VARK learning preferences to generate scientifically validated stream and career recommendations.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does High School Research & Profile Building work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Students are paired with seasoned research mentors to produce original academic research papers, aiming for publication in indexed, peer-reviewed international high school and undergraduate journals.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can parents participate in counseling and review assessment reports?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! CLARVO generates clear, comprehensive reports for families and offers dedicated 1-on-1 counselor strategy sessions to align parental aspirations with the student\'s verified aptitude.',
          },
        },
      ],
    },
  ],
};

import CinematicLandingExperience from '@/components/landing/cinematic/CinematicLandingExperience';

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-hidden font-sans min-h-screen flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAVBAR */}
      <LandingNavbar />

      {/* CINEMATIC MAIN CONTENT */}
      <main className="flex-1 w-full">
        <CinematicLandingExperience />
      </main>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
