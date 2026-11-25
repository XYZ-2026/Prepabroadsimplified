import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/landing/redesign/primitives';
import FAQList from '@/components/PsychometricAssessment/FAQList';
import StickyMobileCTA from '@/components/PsychometricAssessment/StickyMobileCTA';
import { EnquirySection, ProgrammeShell } from '@/components/Programmes/ProgrammeShell';
import { Acts, Mission, NextProgramme, Outcome, PosterWall, ProgrammeHero } from '@/components/Programmes/sections';
import { Heading, SECTION } from '@/components/SummerSchool/ui';
import { BATCHES_URL, JR_MBA_URL, PROGRAMMES, TRACKS, programmeUrl } from '@/content/programmeList';
import { factsFor, faqFor, getProgramme } from '@/content/programmesContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CTA = 'Enquire now';

const ACTS_TITLE = {
  single: 'Three weeks, start to finish',
  track: 'Three programmes, one role',
  all: 'Ten programmes, three skills',
  incubator: 'Choose one of four paths',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = getProgramme((await params).slug);
  if (!p) return {};
  const title = `${p.name} for Students Aged 13–18 | CLARVO`;
  const description = `${p.line} ${factsFor(p)[0].value}. Students finish with: ${p.outcome.toLowerCase()}.`;
  const url = programmeUrl(p.slug);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url: `https://clarvo.in${url}`, siteName: 'CLARVO', type: 'website', images: [{ url: p.photo.src }] },
  };
}

export default async function ProgrammePage({ params }: PageProps) {
  const p = getProgramme((await params).slug);
  if (!p) notFound();

  const faq = faqFor(p);
  const next = getProgramme(PROGRAMMES[(PROGRAMMES.findIndex((x) => x.slug === p.slug) + 1) % PROGRAMMES.length].slug)!;
  const tracksWithThis = TRACKS.filter((t) => t.includes?.includes(p.slug)).map((t) => t.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: p.name,
        description: p.line,
        provider: { '@type': 'Organization', name: 'CLARVO', url: 'https://clarvo.in' },
      },
      { '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) },
    ],
  };

  return (
    <ProgrammeShell jsonLd={jsonLd}>
      <ProgrammeHero
        kicker={{ label: 'All Jr MBA programmes', href: JR_MBA_URL }}
        title={p.name}
        line={p.line}
        facts={factsFor(p)}
        photo={p.photo}
        cta={CTA}
        secondary={{ label: 'See what you will do', href: '#inside' }}
      />
      <Mission text={p.mission} />
      <Acts title={ACTS_TITLE[p.kind]} acts={p.acts} />
      <Outcome programme={p} />
      {p.kind === 'track' && <PosterWall title="What is inside this track" slugs={p.includes!} />}
      {p.kind === 'all' && <PosterWall title="All ten programmes" slugs={p.includes!} />}
      {tracksWithThis.length > 0 && <PosterWall title="Tracks that include this programme" slugs={tracksWithThis} />}
      <section aria-label="Frequently asked questions" className="bg-white">
        <Container size="narrow" className={`${SECTION} [&_h3]:font-dmsans`}>
          <Heading center>Questions parents ask</Heading>
          <FAQList items={faq} />
        </Container>
      </section>
      <EnquirySection title={`Start with ${p.name}`} sub="A counsellor will answer your questions and tell you if it suits your child." selected={p.slug} />
      <NextProgramme programme={next} />
      <StickyMobileCTA href="#start" label={CTA} secondary={{ label: 'Batches', href: BATCHES_URL }} />
    </ProgrammeShell>
  );
}
