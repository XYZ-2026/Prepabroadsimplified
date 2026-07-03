import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--next-font-primary', display: 'swap' });
const lexend = Lexend({ subsets: ['latin'], variable: '--next-font-heading', display: 'swap' });

export const metadata: Metadata = {
  title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
  description:
    'Abroad Simplified is your ultimate study abroad hub. Find universities, scholarships, SOP guidance, and visa support for USA, UK, Germany, Canada, and Australia.',
  keywords:
    'study abroad, university finder, scholarship finder, IELTS, TOEFL, SOP builder, visa guidance, abroad simplified',
  openGraph: {
    title: 'Abroad Simplified — Your Ultimate Study Abroad Hub',
    description:
      'University finder, scholarship matching, SOP builder, and visa guidance — all in one platform.',
    type: 'website',
    url: 'https://www.abroadsimplified.com/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.tailwind = window.tailwind || {};
              window.tailwind.config = {
                corePlugins: {
                  preflight: false,
                },
                theme: {
                  extend: {
                    colors: {
                      iqred: '#9C1010',
                      red: {
                        500: '#ef4444',
                        600: '#dc2626',
                      }
                    }
                  }
                }
              };
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Abroad Simplified',
              url: 'https://www.abroadsimplified.com/',
              description:
                'Your ultimate study abroad hub — university finder, scholarship matching, SOP builder, and visa guidance.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Mumbai',
                addressRegion: 'Maharashtra',
                addressCountry: 'IN',
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
