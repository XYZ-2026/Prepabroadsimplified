import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { getAllEnquiries } from '@/lib/enquiry-service';
import EnquiriesManagementClient from '@/components/Admin/EnquiriesManagementClient';

export const metadata: Metadata = {
  title: 'Enquiries | Admin Dashboard | CLARVO',
  description: 'Manage website demo and consultation enquiries directly inside CLARVO.',
};

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const initialEnquiries = await getAllEnquiries();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <EnquiriesManagementClient initialEnquiries={initialEnquiries} />
    </div>
  );
}
