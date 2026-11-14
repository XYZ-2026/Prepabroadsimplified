import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Review',
  robots: { index: false, follow: true },
};

export default function SubmitReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
