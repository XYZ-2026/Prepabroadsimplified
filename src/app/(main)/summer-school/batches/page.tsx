import React from 'react';
import type { Metadata } from 'next';
import { EnquirySection, ProgrammeShell } from '@/components/Programmes/ProgrammeShell';
import { BATCHES_URL } from '@/content/programmeList';

const TITLE = 'Request a Jr MBA Batch | CLARVO';
const DESCRIPTION = 'Tell us which programme, month and time suit your child. A CLARVO counsellor will confirm the batch dates with you.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: BATCHES_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `https://clarvo.in${BATCHES_URL}`, siteName: 'CLARVO', type: 'website', images: [{ url: '/images/summer-school/schedule.webp' }] },
};

const MONTHS_AHEAD = 6;

function upcomingMonths(): string[] {
  const now = new Date();
  return Array.from({ length: MONTHS_AHEAD }, (_, i) =>
    new Date(now.getFullYear(), now.getMonth() + i, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
  );
}

export default function BatchesPage() {
  return (
    <ProgrammeShell>
      <EnquirySection as="h1" title="Choose a month that suits you" sub="Classes are live and online, Monday to Friday, one hour a day. A counsellor will confirm the dates with you." months={upcomingMonths()} />
    </ProgrammeShell>
  );
}
