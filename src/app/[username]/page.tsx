import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import PortfolioExperience from '@/components/portfolio/PortfolioExperience';
import { buildDemoProfile, DEMO_USERNAME } from '@/components/portfolio/mockProfile';
import { recordToProfile, USERNAME_PATTERN, type PortfolioProfile } from '@/components/portfolio/portfolioTypes';
import { getPublishedPortfolioByUsername } from '@/lib/portfolio-service';

// Public student portfolio at /<username>, generated from the Wix CMS "StudentPortfolios" row.
// Static routes (e.g. /blog, /auth) always take precedence over this dynamic segment.
export const dynamic = 'force-dynamic';

const loadProfile = cache(async (rawUsername: string): Promise<PortfolioProfile | null> => {
  const username = decodeURIComponent(rawUsername).toLowerCase();
  if (username === DEMO_USERNAME) return buildDemoProfile();
  if (!USERNAME_PATTERN.test(username)) return null;
  const record = await getPublishedPortfolioByUsername(username);
  return record ? recordToProfile(record) : null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) return {};
  const summary = [profile.grade, profile.school].filter(Boolean).join(', ');
  return {
    title: `${profile.fullName} — The Series`,
    description: `${profile.fullName}${summary ? ` · ${summary}` : ''}. A cinematic student portfolio.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/${profile.username}` },
  };
}

export default async function UsernamePortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();
  return <PortfolioExperience profile={profile} />;
}
