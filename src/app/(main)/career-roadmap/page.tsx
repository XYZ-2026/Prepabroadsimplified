import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CAREER_ROADMAP_ENABLED } from '@/config/feature-flags';
import CareerRoadmapExplorer from '@/components/CareerRoadmap/CareerRoadmapExplorer';

export const metadata: Metadata = {
  title: {
    absolute: 'Career Roadmap Studio | Career Simplified',
  },
  description: 'Explore career pathways, academic programmes, entrance exams, colleges, and career outcomes. Map your journey from 10th standard to your dream career with Career Simplified.',
  keywords: ['career roadmap', 'career planning', 'academic pathways', 'entrance exams', 'degree programmes', 'career guidance'],
};

export default function CareerRoadmapPage() {
  if (!CAREER_ROADMAP_ENABLED) {
    redirect('/dashboard');
  }

  return <CareerRoadmapExplorer />;
}

