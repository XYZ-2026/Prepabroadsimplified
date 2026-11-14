import type { Metadata } from 'next';

// Duplicate of /psychometric-test/sample-report — consolidate ranking signals there.
export const metadata: Metadata = {
  title: 'Sample Psychometric Report',
  alternates: { canonical: '/psychometric-test/sample-report' },
};

export default function SampleReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
