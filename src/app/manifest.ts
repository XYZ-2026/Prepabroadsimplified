import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CLARVO — Clarity for Their Future',
    short_name: 'CLARVO',
    description: 'A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080F1C',
    theme_color: '#080F1C',
    icons: [
      {
        src: '/icon-192.png?v=3',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png?v=3',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png?v=3',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
