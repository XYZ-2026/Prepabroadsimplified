import React from 'react';
import { Quote } from 'lucide-react';
import { Container } from '@/components/landing/redesign/primitives';
import { REVIEWS } from '@/content/summerSchoolContent';
import { ALL_TESTIMONIALS } from '@/data/testimonials-data';
import { Underlined } from './motion';
import { Heading, SECTION, SWIPE } from './ui';

// Rendered on the server: only these nine reviews reach the browser, not the whole 130.
const reviews = REVIEWS.ids.flatMap((id) => ALL_TESTIMONIALS.filter((t) => t.id === id));

/** Swipe row on phones; staggered columns (cards keep their own height) from tablet up. */
export default function Reviews() {
  return (
    <section aria-label="Reviews" className="bg-white">
      <Container className={SECTION}>
        <Heading sub={REVIEWS.sub}>
          Hear from <Underlined>students and parents</Underlined>
        </Heading>
        <ul aria-label="Review list" tabIndex={0} className={`${SWIPE} sm:block sm:columns-2 lg:columns-3 sm:gap-5`}>
          {reviews.map((r) => (
            <li key={r.id} className="w-[84%] sm:w-auto sm:mb-5 break-inside-avoid rounded-photo bg-paper border border-line p-6">
              <Quote className="w-7 h-7 text-clarvo-blue" aria-hidden="true" />
              <p className="m-0 mt-3 text-[18px] font-bold leading-snug text-ink">{r.outcomeMetric}</p>
              <blockquote className="m-0 mt-2 text-[16px] leading-relaxed text-ink">{r.quote}</blockquote>
              <p className="m-0 mt-4 text-[16px] font-bold text-ink">{r.name}</p>
              <p className="m-0 text-[16px] leading-snug text-muted">
                {r.grade}, {r.school}, {r.city}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
