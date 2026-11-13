import React from 'react';
import { RESEARCH_CONTENT } from '@/content/researchContent';
import { GLOBAL_UNIVERSITIES, INDIAN_INTERVIEW_UNIVERSITIES, type University } from '@/data/universities';
import SectionHeading from './SectionHeading';
import './research.css';

const content = RESEARCH_CONTENT.universities;

/** One list: an Indian university after every fourth global one, so both lanes stay mixed. */
const ALL: University[] = (() => {
  const out: University[] = [];
  const india = [...INDIAN_INTERVIEW_UNIVERSITIES];
  GLOBAL_UNIVERSITIES.forEach((u, i) => {
    out.push(u);
    if (i % 4 === 3 && india.length) out.push(india.shift()!);
  });
  return [...out, ...india];
})();

// Alternate items between lanes so neighbours in the list never sit side by side twice.
const LANES = [ALL.filter((_, i) => i % 2 === 0), ALL.filter((_, i) => i % 2 === 1)];

/**
 * University logos in two marquee lanes moving in opposite directions, paused on hover and
 * turned into a static wrapped grid for reduced motion (research.css). Logos sit in greyscale
 * and take their colour on hover so 50 crests don't shout at once.
 */
export default function UniversitiesSection() {
  return (
    <section id="universities" aria-label={content.headline} className="w-full bg-white border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} subcopy={content.subcopy} align="center" />
      </div>

      <div className="rsr-marquee space-y-4 pb-16 sm:pb-20 lg:pb-24" aria-label="University logos">
        {LANES.map((lane, i) => (
          <div key={i} className="rsr-lane">
            <ul className={`rsr-track ${i % 2 ? 'rsr-track--reverse' : ''}`}>
              {[...lane, ...lane].map((u, j) => (
                <li key={`${u.id}-${j}`} aria-hidden={j >= lane.length ? true : undefined}>
                  <LogoTile u={u} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogoTile({ u }: { u: University }) {
  return (
    <figure
      title={`${u.name}, ${u.country}`}
      className="rsr-tile m-0 h-[108px] w-[180px] sm:w-[200px] px-4 flex flex-col items-center justify-center gap-2 rounded-[16px] bg-white border border-line"
    >
      {u.logo ? (
        // Plain <img>: local, pre-sized webp logos; next/image adds nothing here.
        <img src={u.logo} alt={u.name} loading="lazy" decoding="async" className="rsr-logo max-h-[52px] max-w-[150px] w-auto h-auto object-contain" />
      ) : (
        <span className="rsr-logo font-dmsans text-[17px] font-bold text-ink text-center leading-tight">{u.short}</span>
      )}
      {u.logo && <figcaption className="text-[11.5px] font-semibold text-muted text-center leading-tight line-clamp-1">{u.short}</figcaption>}
    </figure>
  );
}
