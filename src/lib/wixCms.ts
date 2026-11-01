import { cache } from "react";

export interface BlogPost {
  title: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  og_description?: string;
  category: string;
  keywords: string;
  author: string;
  reviewer_name?: string;
  journal?: string;
  doi?: string;
  ai_score?: number;
  reading_time: number;
  word_count: number;
  html_content: string;
  json_ld?: string;
  published_at: string;
  paper_id?: string | null;
  blog_url?: string;
}

export interface RelatedPost {
  slug: string;
  title: string;
  seo_title: string;
  meta_description: string;
  category: string;
  keywords: string;
  reading_time?: number;
  published_at?: string;
}

const WIX_BASE_URL = "https://www.wixapis.com/wix-data/v2";
const WIX_COLLECTION_ID = process.env.WIX_BLOG_COLLECTION_ID || "AIGeneratedBlogs";

function getWixHeaders(): Record<string, string> {
  const apiKey = process.env.WIX_API_KEY || "";
  const siteId = process.env.WIX_SITE_ID || "be07e82f-dd8d-4a26-828d-fce6bdb485bb";

  return {
    "Content-Type": "application/json",
    Authorization: apiKey,
    "wix-site-id": siteId,
  };
}

/**
 * Normalizes raw Wix CMS item data into a strongly-typed BlogPost object.
 */
function mapWixItemToBlogPost(data: Record<string, any>): BlogPost {
  const title =
    data.title ||
    data.seo_title ||
    "Academic Insight & Research Overview";

  const seoTitle =
    data.seo_title ||
    data.title ||
    title;

  const metaDescription =
    data.meta_description ||
    data.og_description ||
    "Explore AI-generated academic insights, research methodologies, and peer-reviewed educational trends.";

  let publishedAt = data.published_at || "";
  if (!publishedAt && data._createdDate?.$date) {
    publishedAt = data._createdDate.$date;
  } else if (!publishedAt && typeof data._createdDate === "string") {
    publishedAt = data._createdDate;
  }

  return {
    title,
    slug: data.slug || "",
    seo_title: seoTitle,
    meta_description: metaDescription,
    og_description: data.og_description || metaDescription,
    category: data.category || "Research",
    keywords: data.keywords || "",
    author: data.author || "Editorial Team",
    reviewer_name: data.reviewer_name || "",
    journal: data.journal || "Abroad Simplified Academic Review",
    doi: data.doi || "",
    ai_score: typeof data.ai_score === "number" ? data.ai_score : 95,
    reading_time: typeof data.reading_time === "number" ? data.reading_time : 7,
    word_count: typeof data.word_count === "number" ? data.word_count : 1400,
    html_content: data.html_content || "",
    json_ld: data.json_ld || "",
    published_at: publishedAt,
    paper_id: data.paper_id || null,
    blog_url: data.blog_url || "",
  };
}

/**
 * Fetch all published blogs from Wix CMS collection AIGeneratedBlogs.
 * Cached with Next.js ISR (revalidate: 300) and memoized per-request with React cache().
 */
export const fetchAllWixBlogs = cache(async (limit = 100): Promise<BlogPost[]> => {
  const apiKey = process.env.WIX_API_KEY;
  if (!apiKey) {
    console.warn("[WixCMS] WIX_API_KEY is not defined in environment variables.");
    return [];
  }

  try {
    const res = await fetch(`${WIX_BASE_URL}/items/query`, {
      method: "POST",
      headers: getWixHeaders(),
      body: JSON.stringify({
        dataCollectionId: WIX_COLLECTION_ID,
        query: {
          paging: { limit },
        },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[WixCMS] Query failed with HTTP ${res.status}: ${errText.slice(0, 300)}`);
      return [];
    }

    const json = await res.json();
    const items = json.dataItems || json.items || [];
    return items
      .map((item: any) => mapWixItemToBlogPost(item.data || item))
      .filter((post: BlogPost) => Boolean(post.slug));
  } catch (err) {
    console.error("[WixCMS] Failed to fetch blogs:", err);
    return [];
  }
});

/**
 * Fetch a single blog post by slug from Wix CMS collection AIGeneratedBlogs.
 * Cached with Next.js ISR (revalidate: 300) and memoized per-request with React cache().
 */
export const fetchWixBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!slug) return null;

  const apiKey = process.env.WIX_API_KEY;
  if (!apiKey) {
    console.warn("[WixCMS] WIX_API_KEY is not defined in environment variables.");
    return null;
  }

  try {
    const res = await fetch(`${WIX_BASE_URL}/items/query`, {
      method: "POST",
      headers: getWixHeaders(),
      body: JSON.stringify({
        dataCollectionId: WIX_COLLECTION_ID,
        query: {
          filter: {
            slug,
          },
        },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`[WixCMS] Fetch by slug failed with HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    const items = json.dataItems || json.items || [];
    if (items.length > 0) {
      return mapWixItemToBlogPost(items[0].data || items[0]);
    }

    // Fallback: If exact filter didn't match, query list and find by slug
    const allBlogs = await fetchAllWixBlogs(100);
    const matched = allBlogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
    return matched || null;
  } catch (err) {
    console.error(`[WixCMS] Error fetching blog '${slug}':`, err);
    return null;
  }
});

/**
 * Fetch related blog posts scored by category match and keyword overlap.
 */
export const fetchRelatedWixBlogs = cache(
  async (currentSlug: string, limit = 4): Promise<BlogPost[]> => {
    try {
      const allBlogs = await fetchAllWixBlogs(100);
      const current = allBlogs.find((b) => b.slug === currentSlug);
      const candidates = allBlogs.filter((b) => b.slug !== currentSlug);

      if (!current) {
        return candidates.slice(0, limit);
      }

      const currentCategory = (current.category || "").toLowerCase();
      const currentKeywords = new Set(
        (current.keywords || "")
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean)
      );

      const scored = candidates.map((post) => {
        let score = 0;
        if ((post.category || "").toLowerCase() === currentCategory) {
          score += 4;
        }

        const postKeywords = (post.keywords || "")
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean);

        for (const kw of postKeywords) {
          if (currentKeywords.has(kw)) {
            score += 2;
          }
        }

        return { post, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, limit).map((s) => s.post);
    } catch (err) {
      console.error("[WixCMS] Error fetching related blogs:", err);
      return [];
    }
  }
);
