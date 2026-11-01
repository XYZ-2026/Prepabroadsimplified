import React from 'react';
import type { Metadata } from 'next';
import CommunityLandingClient from '@/components/community/CommunityLandingClient';

export const metadata: Metadata = {
  title: 'Join the CLARVO Student & Parent Community | Official WhatsApp Group',
  description:
    'Join the official CLARVO Student & Parent WhatsApp community for verified career guidance, Indian and study-abroad updates, scholarships, high-school research, and student-development resources.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function JoinCommunityPage() {
  return <CommunityLandingClient />;
}

