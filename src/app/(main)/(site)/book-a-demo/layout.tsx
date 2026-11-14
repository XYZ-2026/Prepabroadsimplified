import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Counselling Consultation — Study Abroad & Admissions',
  description:
    'Book a consultation with CLARVO counsellors for study abroad, Indian university admissions, profile building, research programs and psychometric assessment (Grades 7–12).',
  alternates: { canonical: '/book-a-demo' },
};

export default function BookADemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
