import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--next-font-primary', display: 'swap' });
const lexend = Lexend({ subsets: ['latin'], variable: '--next-font-heading', display: 'swap' });

function getValidSiteUrl(urlInput?: string): string {
  const fallback = 'https://careersimplified.com';
  if (!urlInput) return fallback;
  let raw = urlInput.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

const siteUrl = getValidSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Career Simplified — Modern Career Planning & Student Intelligence Platform',
    template: '%s | Career Simplified',
  },
  description:
    'Career Simplified is a comprehensive career planning and student intelligence platform. Discover career roadmaps, cognitive strengths, psychometric profiling, and global university admissions guidance.',
  keywords: [
    'career simplified',
    'career roadmap studio',
    'career planning',
    'psychometric assessment',
    'IQ test for students',
    'stream selection',
    'study abroad',
    'university finder',
    'college search',
    'career counselling',
  ],
  authors: [{ name: 'Career Simplified Team', url: siteUrl }],
  creator: 'Career Simplified',
  publisher: 'Career Simplified',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Career Simplified — Modern Career Planning & Student Intelligence Platform',
    description:
      'Career Roadmap Studio, cognitive profiling, psychometric assessments, and university admissions matching — all in one connected platform.',
    url: siteUrl,
    siteName: 'Career Simplified',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/study_abroad_hero.png',
        width: 1200,
        height: 630,
        alt: 'Career Simplified — Career Planning & Student Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Simplified — Modern Career Planning & Student Intelligence Platform',
    description:
      'Career Roadmap Studio, cognitive profiling, psychometric assessments, and university admissions matching — all in one connected platform.',
    images: ['/study_abroad_hero.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
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
        name: 'Career Simplified',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo-square-cropped.avif`,
        description:
          'Comprehensive career planning and student intelligence platform — career roadmaps, cognitive assessments, psychometric profiling, and university admissions guidance.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'Career Simplified',
        description: 'Modern career planning, cognitive profiling & psychometric evaluation platform.',
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
    <html lang="en" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head>
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
