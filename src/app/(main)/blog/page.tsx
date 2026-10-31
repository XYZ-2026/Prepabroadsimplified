import React from "react";
import type { Metadata } from "next";
import { fetchAllWixBlogs } from "@/lib/wixCms";
import BlogListClient from "./BlogListClient";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Sparkles, BookOpen, BookmarkCheck, ArrowRight } from "lucide-react";

export const revalidate = 300;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://clarvo.in";

export const metadata: Metadata = {
  title: "The CLARVO Journal — Research & Academic Insights",
  description:
    "Explore peer-reviewed scientific methodologies, high school research roadmaps, stream selection guides, and university admission strategies.",
  keywords: [
    "student research blog",
    "academic guidance",
    "university admissions insights",
    "high school research",
    "career roadmap",
    "student development",
    "CLARVO journal",
  ],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "The CLARVO Journal — Research & Academic Insights",
    description:
      "Actionable insights, research trends, and academic guidance for ambitious students from Grades 7 to 12.",
    url: `${BASE_URL}/blog`,
    siteName: "CLARVO — Student Development Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The CLARVO Journal — Research & Academic Insights",
    description:
      "Actionable insights, research trends, and academic guidance for ambitious students.",
  },
};

export default async function BlogIndexPage() {
  const posts = await fetchAllWixBlogs(100);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "CLARVO — Research & Academic Insights Blog",
    description:
      "Actionable insights, research trends, and academic guidance for students preparing for top universities.",
    url: `${BASE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "CLARVO",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-transparent.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title || p.seo_title,
      description: p.meta_description,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.published_at,
      author: {
        "@type": "Person",
        name: p.author || "CLARVO Editorial Team",
      },
    })),
  };

  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-hidden font-sans min-h-screen flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HEADER NAVBAR ───────────────────────────────────────── */}
      <LandingNavbar />

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="flex-1 w-full">
        {/* ── Cinematic Ambient Hero ─────────────────────────────── */}
        <section className="relative overflow-hidden pt-8 sm:pt-14 md:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
          {/* Ambient Lighting Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-br from-[#2563EB]/10 via-[#38BDF8]/10 to-transparent rounded-full blur-[100px]" />
            <div className="absolute top-1/2 -right-20 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px]" />
            <div className="absolute -bottom-10 -left-20 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[80px]" />

            {/* Subtle background circuit pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="blog-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.2" />
                  <circle cx="48" cy="0" r="1.2" fill="#2563EB" fillOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blog-grid)" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-blue-200/80 bg-white/90 shadow-2xs mb-4 sm:mb-5 backdrop-blur-sm max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#2563EB] truncate">
                CLARVO Academic &amp; Research Journal
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#080F1C] tracking-[-0.03em] leading-[1.18] sm:leading-[1.12]">
              Knowledge for the{" "}
              <span className="bg-gradient-to-r from-[#2563EB] via-indigo-600 to-sky-500 bg-clip-text text-transparent block sm:inline">
                Ambitious Scholar
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-3.5 sm:mt-5 text-xs sm:text-base md:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto px-1 sm:px-0">
              Peer-reviewed methodologies, high school research roadmaps, stream selection frameworks, and university admissions insights curated by the CLARVO team.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-8 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/80 text-[11px] sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-white/60 sm:bg-transparent py-2 sm:py-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-800">{posts.length > 0 ? `${posts.length}+` : "80+"}</strong> Articles
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-white/60 sm:bg-transparent py-2 sm:py-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-800">Grades 7–12</strong>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-white/60 sm:bg-transparent py-2 sm:py-0 rounded-xl sm:rounded-none border sm:border-0 border-slate-200/50">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="truncate">
                  <strong className="text-slate-800">100% Free</strong> Open Access
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE BLOG CLIENT ────────────────────────────── */}
        <section className="pt-8 sm:pt-10">
          <BlogListClient posts={posts} />
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  );
}
