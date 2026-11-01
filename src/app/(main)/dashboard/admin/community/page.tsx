import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { getCommunitySettings, getCommunityLeads } from '@/lib/community-service';
import CommunityManagementClient from '@/components/Admin/CommunityManagementClient';

export const metadata: Metadata = {
  title: 'Community Landing Page & WhatsApp Settings | Admin Dashboard | CLARVO',
  description: 'Manage the active WhatsApp group destination URL and view QR leads for the CLARVO Student & Parent Community.',
};

export default async function AdminCommunityPage() {
  const claims = await requireAdmin();
  const initialSettings = await getCommunitySettings();
  const initialLeads = await getCommunityLeads();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <CommunityManagementClient
        initialSettings={initialSettings}
        initialLeads={initialLeads}
        adminEmail={claims.email || 'admin@clarvo.in'}
      />
    </div>
  );
}

