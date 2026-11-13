import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import PortfolioExperience from '@/components/portfolio/PortfolioExperience';
import { buildDemoProfile, DEMO_USERNAME } from '@/components/portfolio/mockProfile';
import { recordToProfile, USERNAME_PATTERN, type PortfolioProfile } from '@/components/portfolio/portfolioTypes';
import { getSiteUrl } from '@/components/portfolio/resumeHtml';
import { getPublishedPortfolioByUsername } from '@/lib/portfolio-service';

// Public student portfolio at /<username>, generated from the Wix CMS "StudentPortfolios" row.
// Static routes (e.g. /blog, /auth) always take precedence over this dynamic segment.
// Only published portfolios render (hidden ones 404), so only those can be indexed by search
// engines. Students are told this next to the "Show my portfolio publicly" switch.
export const dynamic = 'force-dynamic';

const loadProfile = cache(async (rawUsername: string): Promise<PortfolioProfile | null> => {
  const username = decodeURIComponent(rawUsername).toLowerCase();
  if (username === DEMO_USERNAME) return buildDemoProfile();
  if (!USERNAME_PATTERN.test(username)) return null;
  const record = await getPublishedPortfolioByUsername(username);
  return record ? recordToProfile(record) : null;
});

/** "Grade 11 · Science (PCM) · Delhi Public School" style summary for titles and descriptions. */
function summaryOf(p: PortfolioProfile) {
  return [p.grade, p.stream, p.school, p.location].filter(Boolean).join(' · ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) return {};

  const isDemo = profile.username === DEMO_USERNAME;
  const summary = summaryOf(profile);
  const title = `${profile.fullName} — Student Portfolio | CLARVO`;
  const description = [
    `${profile.fullName}'s student portfolio${summary ? `: ${summary}` : ''}.`,
    profile.dream ? `Aspiring ${profile.dream}.` : '',
    'Activities, projects, awards and resume.',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 300);

  return {
    title: { absolute: title },
    description,
    // The sample portfolio is not a real person; keep it out of search results.
    robots: isDemo ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: `/${profile.username}` },
    openGraph: {
      title,
      description,
      url: `/${profile.username}`,
      type: 'profile',
      siteName: 'CLARVO',
      ...(profile.photoUrl ? { images: [{ url: profile.photoUrl, alt: profile.fullName }] } : {}),
    },
    twitter: { card: profile.photoUrl ? 'summary_large_image' : 'summary', title, description },
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

  const url = `${getSiteUrl()}/${profile.username}`;
  // Tells Google this page is about a person, which helps it surface for name searches.
  const jsonLd =
    profile.username === DEMO_USERNAME
      ? null
      : {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          url,
          name: `${profile.fullName} — Student Portfolio`,
          mainEntity: {
            '@type': 'Person',
            name: profile.fullName,
            url,
            ...(profile.photoUrl ? { image: profile.photoUrl } : {}),
            ...(profile.bio ? { description: profile.bio.slice(0, 300) } : {}),
            ...(profile.school ? { affiliation: { '@type': 'EducationalOrganization', name: profile.school } } : {}),
            ...(profile.location ? { homeLocation: { '@type': 'Place', name: profile.location } } : {}),
            ...(profile.dream ? { knowsAbout: profile.dream } : {}),
            sameAs: profile.links
              .map((l) => l.href)
              .filter((h) => /^https?:\/\//i.test(h)),
          },
        };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Escape "<" so user-written text can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <PortfolioExperience profile={profile} />
    </>
  );
}
