import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample Psychometric Test Report for Students',
  description:
    'See a real-format CLARVO psychometric report: aptitude, RIASEC interests, Big Five personality, learning style, stream and career recommendations for Grades 7–12.',
  alternates: { canonical: '/psychometric-test/sample-report' },
  // Parent /psychometric-test layout is noindex (login-gated); this public sample stays indexable.
  robots: { index: true, follow: true },
};

export default function PsychometricSampleReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
