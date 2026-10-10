import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--next-font-primary', display: 'swap' });
const lexend = Lexend({ subsets: ['latin'], variable: '--next-font-heading', display: 'swap' });

function getValidSiteUrl(urlInput?: string): string {
  const fallback = 'https://clarvo.in';
  if (!urlInput) return fallback;
  let raw = urlInput.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

const siteUrl = getValidSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CLARVO — Clarity for Their Future | Student Development Platform',
    template: '%s | CLARVO',
  },
  description:
    'CLARVO is a premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
  keywords: [
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
    title: 'CLARVO — Clarity for Their Future',
    description:
      'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
    url: siteUrl,
    siteName: 'CLARVO',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/study_abroad_hero.png',
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
      'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
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
        name: 'CLARVO',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo-square-cropped.avif`,
        description:
          'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
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
