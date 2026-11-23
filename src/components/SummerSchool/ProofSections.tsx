import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/landing/redesign/primitives';
import { FACTS } from '@/content/summerSchoolContent';
import { GLOBAL_UNIVERSITIES } from '@/data/universities';
import { listAdmitted, type AdmittedSummary } from '@/lib/wix-library';
import { CountUp, Underlined } from './motion';
import { CARD_TITLE, Heading, SECTION } from './ui';

/** Desktop places: one large tile with two below it, and two stacked on the right. */
const PLACES = [
  'col-span-2 lg:col-start-1 lg:col-span-8 lg:row-start-1 lg:row-span-4',
  'lg:col-start-1 lg:col-span-4 lg:row-start-5 lg:row-span-2',
  'lg:col-start-5 lg:col-span-4 lg:row-start-5 lg:row-span-2',
  'lg:col-start-9 lg:col-span-6 lg:row-start-1 lg:row-span-3',
  'lg:col-start-9 lg:col-span-6 lg:row-start-4 lg:row-span-3',
];

export function FactsBento() {
  return (
    <section aria-label="CLARVO in numbers" className="bg-[var(--ss-navy)] text-white border-t border-white/10">
      <Container className="py-10 sm:py-14">
        <ul className="list-none p-0 m-0 grid grid-cols-2 lg:grid-cols-[repeat(14,1fr)] lg:auto-rows-[144px] gap-3 sm:gap-4">
          {FACTS.map((fact, i) => {
            const large = i === 0;
            return (
              <li key={fact.value} className={`${PLACES[i]} flex flex-col rounded-photo overflow-hidden bg-white/[0.07] border border-white/10`}>
                <div className="p-4 sm:p-6">
                  <p className={`m-0 font-bold leading-none tracking-tight text-[var(--ss-light)] ${large ? 'text-[clamp(2.75rem,5vw,4rem)]' : 'text-[clamp(1.5rem,3vw,2.5rem)]'}`}>
                    {/^\d/.test(fact.value) ? <CountUp value={fact.value} /> : fact.value}
                  </p>
                  <p className={`m-0 mt-2 font-bold leading-snug ${large ? 'text-[18px] sm:text-[22px]' : 'text-[16px] sm:text-[18px]'}`}>{fact.label}</p>
                  <p className={`m-0 mt-1 text-[16px] leading-snug text-white/75 ${large ? '' : 'hidden sm:block lg:hidden xl:block'}`}>{fact.note}</p>
                </div>
                <div className={`relative mt-auto grow ${large ? 'min-h-56 sm:min-h-80 lg:min-h-0' : 'min-h-28 sm:min-h-44 lg:min-h-0'}`}>
                  <Image
                    src={fact.photo.src}
                    alt={fact.photo.alt}
                    fill
                    sizes={large ? '(min-width: 1024px) 720px, 100vw' : '(min-width: 1024px) 540px, 50vw'}
                    className={large ? 'object-contain object-bottom' : 'object-cover object-[center_25%]'}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export function UniversityWall() {
  return (
    <section aria-label="Universities" className="bg-white">
      <Container className={SECTION}>
        <Heading center>
          Universities our students are <Underlined>building towards</Underlined>
        </Heading>
        <ul className="list-none p-0 m-0 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {GLOBAL_UNIVERSITIES.slice(0, 36).map((u, i) => (
            <li key={u.id} className={`h-16 sm:h-24 px-3 items-center justify-center rounded-card border border-line bg-white ${i < 18 ? 'flex' : 'hidden sm:flex'}`}>
              {u.logo ? (
                // Plain <img>: local, pre-sized webp logos; next/image adds nothing here.
                <img src={u.logo} alt={u.name} loading="lazy" decoding="async" className="max-w-full max-h-10 sm:max-h-14 object-contain" />
              ) : (
                <span className="text-[16px] font-bold text-center text-ink">{u.short}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Profiles from the public admitted-students library. Left out when the library can't be reached. */
export async function AdmittedStudents() {
  let students: AdmittedSummary[];
  try {
    students = (await listAdmitted({})).items.slice(0, 3);
  } catch {
    return null;
  }
  if (students.length === 0) return null;

  return (
    <section aria-label="Admitted student profiles" className="bg-paper">
      <Container className={SECTION}>
        <Heading>See how admitted students built their profiles</Heading>
        <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          {students.map((s) => (
            <li key={s.id} className="rounded-photo bg-white border border-line p-6">
              <h3 className={`${CARD_TITLE} text-ink`}>{s.name}</h3>
              {s.major && <p className="m-0 mt-1 text-[16px] text-muted">{s.major}</p>}
              <p className="m-0 mt-5 text-[16px] text-muted">Admitted to</p>
              <p className="m-0 text-[18px] font-bold text-clarvo-blue">{s.college}</p>
            </li>
          ))}
        </ul>
        <Link href="/admitted-students" className="mt-6 inline-flex items-center min-h-11 text-[16px] font-bold text-clarvo-blue">
          See all admitted students
        </Link>
      </Container>
    </section>
  );
}
