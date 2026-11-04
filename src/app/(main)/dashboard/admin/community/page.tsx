import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { getCommunitySettings, getCommunityLeads } from '@/lib/community-service';
import CommunityManagementClient from '@/components/Admin/CommunityManagementClient';

export const metadata: Metadata = {
  title: 'Community Landing Pages & WhatsApp Settings | Admin Dashboard | CLARVO',
  description: 'Manage active WhatsApp group invitation URLs and view QR leads for CLARVO Student & Parent and Global Counselling Association communities.',
};

export default async function AdminCommunityPage() {
  const claims = await requireAdmin();
  const initialStudentSettings = await getCommunitySettings('student_parent');
  const initialCounsellorSettings = await getCommunitySettings('counsellor_mentor');
  const initialLeads = await getCommunityLeads();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CommunityManagementClient
        initialSettings={initialStudentSettings}
        initialStudentSettings={initialStudentSettings}
        initialCounsellorSettings={initialCounsellorSettings}
        initialLeads={initialLeads}
        adminEmail={claims.email || 'admin@clarvo.in'}
      />
    </div>
  );
}

