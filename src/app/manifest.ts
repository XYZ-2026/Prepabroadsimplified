import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CLARVO — Clarity for Their Future',
    short_name: 'CLARVO',
    description: 'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
