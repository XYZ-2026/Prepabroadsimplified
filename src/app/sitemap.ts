import type { MetadataRoute } from 'next';
import { listPublishedPortfolios } from '@/lib/portfolio-service';
import { getValidSiteUrl } from '@/lib/site-url';
import { fetchAllWixBlogs } from '@/lib/wixCms';

// Rebuilt hourly so newly published student portfolios get picked up.
export const revalidate = 3600;


type Freq = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

// Indexable public pages. Login, gated tools, result pages and dashboards are deliberately excluded.
const STATIC_PAGES: { path: string; changeFrequency: Freq; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/psychometric-assessment', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/research', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/admitted-students', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/discover', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/career-library', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sample-reports', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/psychometric-test/sample-report', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about-us', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/book-a-demo', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
];

function safeDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getValidSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

  const [blogPosts, publishedPortfolios] = await Promise.all([
    fetchAllWixBlogs(500).catch(() => []),
    listPublishedPortfolios().catch(() => []),
  ]);

  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${baseUrl}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const blog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: safeDate(post.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Published student portfolios only (hidden ones are never listed).
  const portfolios: MetadataRoute.Sitemap = publishedPortfolios.map((p) => ({
    url: `${baseUrl}/${p.username}`,
    lastModified: safeDate(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [...pages, ...blog, ...portfolios];
}
