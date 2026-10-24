import { Suspense } from 'react';
import type { Metadata } from 'next';
import CareerLibraryExplorer from '@/components/CareerLibrary/CareerLibraryExplorer';
import {
  getAllCareerProfiles,
  getAllClusters,
  getAllStreams,
  getCareerRoadmapById
} from '@/lib/career-library/career-service';
import type { CareerRoadmap } from '@/lib/career-library/types';

export const metadata: Metadata = {
  title: 'Career Library | CLARVO',
  description:
    'Explore comprehensive career specializations, 4-year academic roadmaps, required tools, project ideas, salary projections, and industry future trends across Engineering, Commerce, Arts, Law, and Healthcare.',
  keywords: [
    'career library',
    'career explorer',
    'academic roadmap',
    'engineering branches',
    'commerce careers',
    'arts and humanities',
    'salary outlook',
    'CLARVO career guidance'
  ],
  openGraph: {
    title: 'Career Library | CLARVO',
    description:
      'Detailed career profiles, 4-year academic roadmaps, project ideas, salary directions, and future industry trends.',
    url: 'https://clarvo.in/career-library',
    siteName: 'CLARVO',
    type: 'website'
  }
};

export default function CareerLibraryPage() {
  const allProfiles = getAllCareerProfiles();
  const clusters = getAllClusters();
  const streams = getAllStreams();

  // Pre-load all roadmaps on server
  const roadmapsMap: Record<string, CareerRoadmap> = {};
  allProfiles.forEach(profile => {
    const r = getCareerRoadmapById(profile.id);
    if (r) {
      roadmapsMap[profile.id] = r;
    }
  });

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#667085' }}>
        <div>Loading Career Library...</div>
      </div>
    }>
      <CareerLibraryExplorer
        initialProfiles={allProfiles}
        initialRoadmaps={roadmapsMap}
        clusters={clusters}
        streams={streams}
      />
    </Suspense>
  );
}
