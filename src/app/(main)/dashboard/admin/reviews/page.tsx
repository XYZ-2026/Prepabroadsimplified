import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { getAllReviews } from '@/lib/review-service';
import ReviewsManagementClient from '@/components/Admin/ReviewsManagementClient';

export const metadata: Metadata = {
  title: 'Reviews & Testimonials | Admin Dashboard | CLARVO',
  description: 'Manage student and parent reviews, moderate feedback, and select testimonials presented on the website.',
};

export default async function AdminReviewsPage() {
  await requireAdmin();
  const initialReviews = await getAllReviews();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ReviewsManagementClient initialReviews={initialReviews} />
    </div>
  );
}
