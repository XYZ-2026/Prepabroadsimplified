import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchWixBlogBySlug, fetchRelatedWixBlogs } from "@/lib/wixCms";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Tag,
  BookOpen,
  ArrowRight,
  BookmarkCheck,
} from "lucide-react";

export const revalidate = 300;
export const dynamicParams = true;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clarvo.in";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchWixBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | CLARVO",
      robots: { index: false, follow: false },
    };
  }

  const title = post.title || post.seo_title || "Academic Article";
  const description =
    post.meta_description ||
    post.og_description ||
    "Read this research overview on CLARVO.";
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const keywords = post.keywords
    ? post.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  return {
    title: `${title} | CLARVO`,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "CLARVO — Student Development Platform",
      publishedTime: post.published_at,
      authors: post.author ? [post.author] : undefined,
      tags: keywords,
      images: [
        {
          url: `${BASE_URL}/logo-transparent.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchWixBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await fetchRelatedWixBlogs(slug, 3);
  const sanitizedContent = sanitizeHtml(post.html_content || "");

  const keywords = post.keywords
    ? post.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  let jsonLd: Record<string, any> | null = null;
  if (post.json_ld) {
    try {
      jsonLd = typeof post.json_ld === "string" ? JSON.parse(post.json_ld) : post.json_ld;
    } catch {
      jsonLd = null;
    }
  }

  if (!jsonLd || !jsonLd["@type"]) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title || post.seo_title,
      description: post.meta_description,
      author: {
        "@type": "Person",
        name: post.author || "CLARVO Editorial Team",
      },
      publisher: {
        "@type": "Organization",
        name: "CLARVO",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo-transparent.png`,
        },
      },
      datePublished: post.published_at || new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/blog/${slug}`,
      },
      articleSection: post.category || "Research",
      keywords: post.keywords,
      wordCount: post.word_count,
    };
  }

  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-hidden font-sans min-h-screen flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HEADER NAVBAR ───────────────────────────────────────── */}
      <LandingNavbar />

      <main className="flex-1 w-full pb-14 sm:pb-20">
        {/* ── Breadcrumb & Back Navigation ───────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-3 sm:pb-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors py-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All articles</span>
            </Link>

            <nav className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-none">
              <Link href="/" className="hover:text-slate-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-slate-600 transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-slate-600 font-medium truncate">
                {post.category || "Research"}
              </span>
            </nav>
          </div>
        </div>

        {/* ── Article Header ─────────────────────────────────── */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-9">
          {/* Category & Read Time Pills */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10.5px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-200">
              {post.category || "Research"}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium bg-white px-2.5 py-0.5 sm:py-1 rounded-md border border-slate-200">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span>{post.reading_time || 6} min read</span>
            </span>

            {post.word_count ? (
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium hidden xs:inline">
                · {post.word_count.toLocaleString()} words
              </span>
            ) : null}

            {post.paper_id ? (
              <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 sm:py-1 rounded-md border border-emerald-200">
                <BookmarkCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Peer-Reviewed
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-black text-[#080F1C] leading-[1.24] sm:leading-[1.18] tracking-tight">
            {post.title || post.seo_title}
          </h1>

          {/* Excerpt / Lead */}
          {post.meta_description && (
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              {post.meta_description}
            </p>
          )}

          {/* Author & Publish Metadata Card */}
          <div className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-indigo-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-2xs shrink-0">
                {(post.author || "C").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {post.author || "CLARVO Editorial Team"}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mt-0.5 flex-wrap">
                  {post.published_at && (
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at)}
                    </time>
                  )}
                  {post.reviewer_name && (
                    <>
                      <span>·</span>
                      <span className="truncate">Reviewed by {post.reviewer_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {post.doi && (
              <a
                href={`https://doi.org/${post.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] sm:text-xs text-[#2563EB] hover:underline font-mono bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 self-start sm:self-auto truncate max-w-full"
              >
                DOI: {post.doi}
              </a>
            )}
          </div>
        </header>

        {/* ── Main Article HTML Body (Mobile Optimized) ──────── */}
        <article className="max-w-4xl mx-auto px-3.5 sm:px-6 mb-10 sm:mb-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 md:p-12 shadow-2xs">
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </article>

        {/* ── Keywords Pills ──────────────────────────────────── */}
        {keywords.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Related Research Tags</span>
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Related Articles Section ─────────────────────────── */}
        {related.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12 sm:mb-14" aria-label="Related articles">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#2563EB]" />
              <h2 className="text-base sm:text-xl font-bold text-slate-900">
                You Might Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-[#2563EB]/40 hover:shadow-md transition-all flex flex-col"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] mb-2">
                    {item.category || "Research"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-2">
                    {item.title || item.seo_title}
                  </h3>
                  <p className="text-[11.5px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {item.meta_description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:gap-1.5 transition-all mt-auto">
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom Responsive CTA Banner ─────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#080F1C] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 border border-slate-800 text-center sm:text-left">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                Ready to elevate your academic profile?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Discover your strengths, build high school research credentials, and map your path to top global universities.
              </p>
            </div>
            <div className="w-full sm:w-auto shrink-0">
              <Link
                href="/psychometric-test"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs sm:text-sm font-bold hover:bg-[#1D4ED8] transition-colors shadow-xs"
              >
                Take Free Assessment →
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Prose Responsive Typography Styling */}
        <style>{`
          .blog-prose {
            color: #334155;
            font-size: 0.95rem;
            line-height: 1.8;
            word-break: break-word;
          }
          @media (min-width: 640px) {
            .blog-prose {
              font-size: 1rem;
              line-height: 1.85;
            }
          }
          .blog-prose h1, .blog-prose h2, .blog-prose h3, .blog-prose h4 {
            color: #0F172A;
            font-weight: 800;
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;
            line-height: 1.3;
          }
          .blog-prose h1 { font-size: 1.4rem; }
          .blog-prose h2 { font-size: 1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.4rem; }
          .blog-prose h3 { font-size: 1.1rem; }
          @media (min-width: 640px) {
            .blog-prose h1 { font-size: 1.65rem; }
            .blog-prose h2 { font-size: 1.35rem; }
            .blog-prose h3 { font-size: 1.15rem; }
          }
          .blog-prose p {
            margin-bottom: 1.15rem;
            text-align: left;
          }
          @media (min-width: 640px) {
            .blog-prose p {
              text-align: justify;
              text-justify: inter-word;
              margin-bottom: 1.25rem;
            }
          }
          .blog-prose ul, .blog-prose ol {
            margin: 0.75rem 0 1.15rem 1.25rem;
          }
          .blog-prose li {
            margin-bottom: 0.35rem;
          }
          .blog-prose ul { list-style-type: disc; }
          .blog-prose ol { list-style-type: decimal; }
          .blog-prose a {
            color: #2563EB;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .blog-prose a:hover {
            color: #1D4ED8;
          }
          .blog-prose blockquote {
            border-left: 3px solid #2563EB;
            background: #F1F5F9;
            padding: 0.85rem 1rem;
            border-radius: 0 10px 10px 0;
            font-style: italic;
            color: #475569;
            margin: 1.25rem 0;
            font-size: 0.92rem;
          }
          @media (min-width: 640px) {
            .blog-prose blockquote {
              border-left-width: 4px;
              padding: 1rem 1.25rem;
              border-radius: 0 12px 12px 0;
              font-size: 0.96rem;
              margin: 1.5rem 0;
            }
          }
          .blog-prose table {
            width: 100% !important;
            max-width: 100% !important;
            border-collapse: collapse;
            margin: 1.25rem 0;
            overflow-x: auto !important;
            display: block !important;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
          }
          .blog-prose th, .blog-prose td {
            padding: 8px 12px;
            border: 1px solid #E2E8F0;
            text-align: left;
            font-size: 0.82rem;
          }
          @media (min-width: 640px) {
            .blog-prose th, .blog-prose td {
              padding: 10px 14px;
              font-size: 0.875rem;
            }
          }
          .blog-prose th {
            background: #F8FAFC;
            font-weight: 700;
            color: #1E293B;
            white-space: nowrap;
          }
          .blog-prose tr:nth-child(even) {
            background: #F8FAFC;
          }
          .blog-prose pre, .blog-prose code {
            max-width: 100%;
            overflow-x: auto;
            word-break: break-word;
          }
          .blog-prose img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
          }
          .blog-prose hr {
            border: none;
            border-top: 1px solid #E2E8F0;
            margin: 1.75rem 0;
          }
        `}</style>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
