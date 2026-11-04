import React from 'react';
import type { Metadata } from 'next';
import CounsellorCommunityLandingClient from '@/components/community/CounsellorCommunityLandingClient';

export const metadata: Metadata = {
  title: 'CLARVO — Global Counselling Association | Professional Community',
  description:
    'Join CLARVO Global Counselling Association: a professional community for career counsellors, educational counsellors, and mentors for certification, workshops, recognition, and networking.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function JoinCounsellorCommunityPage() {
  return <CounsellorCommunityLandingClient />;
}

