import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const HOME_TITLE = 'Study Abroad & Admissions Counselling for Grades 7–12 | CLARVO';
const HOME_DESC =
  'Study abroad & Indian university admissions counselling for 2027: psychometric tests, profile building, research & summer programs and SAT prep for Grades 7–12.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESC,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESC,
    url: '/',
    siteName: 'CLARVO',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CLARVO — Study abroad & admissions counselling' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      '@id': 'https://clarvo.in/#faq',
      about: { '@id': 'https://clarvo.in/#organization' },
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
        {
          '@type': 'Question',
          name: "How does Clarvo help with study abroad admissions?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "We guide students from Class 8 to 12 through study abroad planning for the USA, UK, Canada, Australia, Europe and Asia: course and country fit, university shortlisting, SAT preparation, essays and SOPs, application tracking, document checklists and visa interview preparation.",
          },
        },
        {
          '@type': 'Question',
          name: "Do you help with Indian university admissions as well?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. Many families apply in India and abroad together. We help with stream selection after Class 10, planning for entrance routes such as CUET, JEE, NEET and CLAT, and applications to leading private universities that review essays, activities and interviews.",
          },
        },
        {
          '@type': 'Question',
          name: "My child is applying for 2027 admissions. Is it too late to start?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "No. Many 2027 deadlines, including US Regular Decision, the main UCAS deadline, most Indian entrance exams and private university rounds, fall between January and June 2027. We help Class 12 students prioritise deadlines, finalise university lists and complete strong applications.",
          },
        },
        {
          '@type': 'Question',
          name: "Can you help my child find summer programs and research programs?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. As part of profile building, our counsellors shortlist summer programs and research programs that fit the student’s interests and target universities, and our mentor-led research program helps students in Classes 9–12 write and submit an original research paper.",
          },
        },
      ],
    },
  ],
};

import CinematicLandingExperience from '@/components/landing/cinematic/CinematicLandingExperience';

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-clip font-sans min-h-screen flex flex-col selection:bg-[#2563EB] selection:text-white">
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
