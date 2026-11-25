import React from 'react';
import type { Metadata } from 'next';
import StickyMobileCTA from '@/components/PsychometricAssessment/StickyMobileCTA';
import { EnquirySection, ProgrammeShell } from '@/components/Programmes/ProgrammeShell';
import { Mission, PosterWall, ProgrammeHero, SINGLE_SLUGS, TrackList } from '@/components/Programmes/sections';
import { BATCHES_URL, INCUBATOR, JR_MBA_URL, TRACKS, YOUNG_CEO } from '@/content/programmeList';
import { getProgramme, programmePhoto } from '@/content/programmesContent';

const TITLE = 'Jr MBA Programmes for Students Aged 13–18 | CLARVO';
const DESCRIPTION =
  'Ten live online Jr MBA programmes for school students, from advertising to AI. Fifteen one-hour sessions over three weeks, ending with a project to show.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: JR_MBA_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://clarvo.in${JR_MBA_URL}`, siteName: 'CLARVO', type: 'website', images: [{ url: '/images/programmes/jr-mba.webp' }] },
};

export default function JrMbaPage() {
  return (
    <ProgrammeShell>
      <ProgrammeHero
        kicker={{ label: 'Summer School & Certifications', href: '/summer-school' }}
        title="Jr MBA"
        line="Try a real career before choosing one. Ten live online programmes, each ending with a project."
        facts={[
          { label: 'Each programme', value: '15 one-hour sessions over 3 weeks' },
          { label: 'Format', value: 'Live online, Monday to Friday' },
          { label: 'Ages', value: '13 to 18' },
        ]}
        photo={programmePhoto('jr-mba', 'Student walking into a studio where others film, build and plan', '100% 20%')}
        cta="Enquire now"
        secondary={{ label: 'Request a batch', href: BATCHES_URL }}
      />
      <Mission text="School asks what you know. Jr MBA asks what you can do with it: make the ad, build the app, read the data, pitch the idea." />
      <PosterWall title="Ten programmes" sub="Pick one to start. Every programme is taught live and ends with something to show." slugs={SINGLE_SLUGS} />
      <TrackList programmes={TRACKS.map((t) => getProgramme(t.slug)!)} />
      <PosterWall
        title="Go further"
        sub={`${YOUNG_CEO.name} covers all ten programmes. ${INCUBATOR.name} is for students with one project to launch.`}
        slugs={[YOUNG_CEO.slug, INCUBATOR.slug]}
      />
      <EnquirySection title="Not sure which one?" sub="Tell us about the student. A counsellor will suggest where to start." />
      <StickyMobileCTA href="#start" label="Enquire now" secondary={{ label: 'Batches', href: BATCHES_URL }} />
    </ProgrammeShell>
  );
}
