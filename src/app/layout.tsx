import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--next-font-primary', display: 'swap' });
const lexend = Lexend({ subsets: ['latin'], variable: '--next-font-heading', display: 'swap' });

function getValidSiteUrl(urlInput?: string): string {
  const fallback = 'https://prep.abroadsimplified.com';
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
    default: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    template: '%s | Abroad Simplified',
  },
  description:
    'Abroad Simplified is your ultimate study abroad hub. Find universities, scholarships, SOP guidance, and visa support for USA, UK, Germany, Canada, and Australia.',
  keywords: [
    'study abroad',
    'university finder',
    'scholarship finder',
    'IELTS',
    'TOEFL',
    'SOP builder',
    'visa guidance',
    'abroad simplified',
    'study in USA',
    'study in UK',
    'study in Germany',
    'psychometric test',
    'IQ test for students',
  ],
  authors: [{ name: 'Abroad Simplified Team', url: siteUrl }],
  creator: 'Abroad Simplified',
  publisher: 'Abroad Simplified',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    description:
      'University finder, scholarship matching, SOP builder, and visa guidance — all in one platform.',
    url: siteUrl,
    siteName: 'Abroad Simplified',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/study_abroad_hero.png',
        width: 1200,
        height: 630,
        alt: 'Abroad Simplified — Study Abroad Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    description:
      'University finder, scholarship matching, SOP builder, and visa guidance — all in one platform.',
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
        name: 'Abroad Simplified',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo-square-cropped.avif`,
        description:
          'Your ultimate study abroad hub — university finder, scholarship matching, SOP builder, and visa guidance.',
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
        name: 'Abroad Simplified',
        description: 'Comprehensive study abroad guidance, university matchmaker & psychometric assessment portal.',
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
