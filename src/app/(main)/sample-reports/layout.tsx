import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample Psychometric & Career Assessment Reports (Grades 7–12)',
  description:
    'Download sample CLARVO assessment reports for Grades 7–9, Class 10 stream selection and Grades 11–12 university planning — see exactly what students and parents receive.',
  alternates: { canonical: '/sample-reports' },
};

export default function SampleReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
