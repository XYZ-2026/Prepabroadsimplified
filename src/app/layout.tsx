import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { getValidSiteUrl } from '@/lib/site-url';


const siteUrl = getValidSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CLARVO — Clarity for Their Future | Student Development Platform',
    template: '%s | CLARVO',
  },
  description:
    'Study abroad and Indian university admissions counselling for Grades 7–12: psychometric assessments, profile building, research and summer programs, and SAT prep.',
  keywords: [
    'study abroad counselling',
    'indian university admissions',
    'admissions 2027',
    'profile building',
    'summer programs for high school students',
    'research programs for high school students',
    'CLARVO',
    'clarvo',
    'student development platform',
    'clarity for their future',
    'psychometric assessment',
    'career guidance',
    'SAT preparation',
    'tutoring',
    'stream selection',
    'cognitive assessment',
    'university finder',
  ],
  authors: [{ name: 'CLARVO Team', url: siteUrl }],
  creator: 'CLARVO',
  publisher: 'CLARVO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'CLARVO',
    title: 'CLARVO — Clarity for Their Future | Student Development Platform',
    description:
      'CLARVO helps parents and students make high-clarity decisions for Grades 7–12 with psychometric profiling, tailored stream roadmaps, SAT tutoring, and mentoring.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CLARVO — Clarity for Their Future',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLARVO — Clarity for Their Future',
    description:
      'Psychometric assessments, personalized career roadmaps, and academic mentorship for Grades 7–12.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${siteUrl}/#organization`,
        name: 'CLARVO',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo-square-cropped.png`,
        description:
          'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        email: 'support@clarvo.in',
        telephone: '+91-8828016354',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'admissions counselling',
          telephone: '+91-8828016354',
          email: 'support@clarvo.in',
          areaServed: 'IN',
          availableLanguage: ['en'],
        },
        parentOrganization: {
          '@type': 'Organization',
          name: 'CLARVO EDUCATION PRIVATE LIMITED',
        },
        knowsAbout: [
          'Study abroad counselling',
          'Indian university admissions',
          'College admissions 2027',
          'Psychometric assessment',
          'Stream selection after Class 10',
          'Profile building',
          'High school research programs',
          'Summer programs for high school students',
          'SAT preparation',
        ],
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'CLARVO',
        description: 'Clarity for Their Future. Premium student development platform for Grades 7–12.',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/university-finder?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph),
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
