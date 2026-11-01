"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/wixCms";
import {
  Search,
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
  X,
  Sparkles,
  BookmarkCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Research",
  "Technology",
  "Science",
  "Medicine",
  "Engineering",
  "Education",
  "Environment",
  "Economics",
];

const POSTS_PER_PAGE = 9;

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

interface CategoryStyle {
  pillBg: string;
  pillText: string;
  pillBorder: string;
  dotColor: string;
  gradientBar: string;
}

function getCategoryStyle(cat: string): CategoryStyle {
  const c = (cat || "").toLowerCase();
  switch (c) {
    case "technology":
      return {
        pillBg: "bg-sky-50",
        pillText: "text-sky-700",
        pillBorder: "border-sky-200",
        dotColor: "bg-sky-500",
        gradientBar: "from-sky-500 to-blue-600",
      };
    case "science":
      return {
        pillBg: "bg-purple-50",
        pillText: "text-purple-700",
        pillBorder: "border-purple-200",
        dotColor: "bg-purple-500",
        gradientBar: "from-purple-500 to-indigo-600",
      };
    case "medicine":
      return {
        pillBg: "bg-rose-50",
        pillText: "text-rose-700",
        pillBorder: "border-rose-200",
        dotColor: "bg-rose-500",
        gradientBar: "from-rose-500 to-pink-600",
      };
    case "engineering":
      return {
        pillBg: "bg-amber-50",
        pillText: "text-amber-800",
        pillBorder: "border-amber-200",
        dotColor: "bg-amber-500",
        gradientBar: "from-amber-500 to-orange-600",
      };
    case "education":
      return {
        pillBg: "bg-emerald-50",
        pillText: "text-emerald-700",
        pillBorder: "border-emerald-200",
        dotColor: "bg-emerald-500",
        gradientBar: "from-emerald-500 to-teal-600",
      };
    case "economics":
      return {
        pillBg: "bg-indigo-50",
        pillText: "text-indigo-700",
        pillBorder: "border-indigo-200",
        dotColor: "bg-indigo-500",
        gradientBar: "from-indigo-500 to-purple-600",
      };
    case "environment":
      return {
        pillBg: "bg-teal-50",
        pillText: "text-teal-700",
        pillBorder: "border-teal-200",
        dotColor: "bg-teal-500",
        gradientBar: "from-teal-500 to-emerald-600",
      };
    default:
      return {
        pillBg: "bg-blue-50",
        pillText: "text-[#2563EB]",
        pillBorder: "border-blue-200",
        dotColor: "bg-[#2563EB]",
        gradientBar: "from-[#2563EB] to-indigo-600",
      };
  }
}

/**
 * Returns a windowed array of page numbers with ellipsis for desktop pagination.
 */
function getPaginationItems(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCategory =
        activeCategory === "All" ||
        (p.category || "Research").toLowerCase() === activeCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.seo_title.toLowerCase().includes(q) ||
        p.meta_description.toLowerCase().includes(q) ||
        p.keywords.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const isDefaultView = activeCategory === "All" && !searchQuery && currentPage === 1;
  const featuredPost = isDefaultView && filtered.length > 0 ? filtered[0] : null;
  const remainingPosts = isDefaultView && filtered.length > 0 ? filtered.slice(1) : filtered;

  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE);
  const currentGridPosts = isDefaultView
    ? remainingPosts.slice(0, POSTS_PER_PAGE)
    : filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      const el = document.getElementById("blog-listing-top");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full" id="blog-listing-top">
      {/* ── Search Bar Section ────────────────────────────────── */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by title, topic..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-11 sm:h-12 pl-11 pr-10 text-xs sm:text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Pills Bar (Edge-to-edge mobile swipe, no scrollbar) ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto sm:flex-wrap no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`h-9 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 ${
                  active
                    ? "bg-[#2563EB] text-white border border-[#2563EB]"
                    : "bg-white text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/50 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Filter Indicator */}
        <div className="mt-3.5 flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "article" : "articles"}
            {activeCategory !== "All" && ` in ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>

          {(activeCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="text-[#2563EB] hover:underline font-semibold cursor-pointer text-xs"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Main Articles Container ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20 px-4 bg-white border border-dashed border-slate-200 rounded-3xl max-w-lg mx-auto shadow-2xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">No matching articles found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any articles matching your search. Try choosing another category or clearing your query.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs sm:text-sm font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            {/* ── 1. Featured Spotlight Article (Responsive on All) ── */}
            {featuredPost && (
              <article
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#2563EB]/40 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                {/* Main Content Column */}
                <div className="md:col-span-7 lg:col-span-8 p-5 sm:p-7 md:p-9 flex flex-col justify-between">
                  <div>
                    {/* Badge row */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-extrabold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-200">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Featured
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-semibold text-slate-600 bg-slate-100">
                        {featuredPost.category || "Research"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                        {featuredPost.reading_time || 8} min read
                      </span>
                    </div>

                    {/* Main Title */}
                    <h2
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#080F1C] hover:text-[#2563EB] transition-colors leading-[1.28] sm:leading-[1.25] mb-2.5 sm:mb-3.5"
                      itemProp="headline"
                    >
                      <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                        {featuredPost.title || featuredPost.seo_title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p
                      className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed mb-5 sm:mb-6 line-clamp-3"
                      itemProp="description"
                    >
                      {featuredPost.meta_description}
                    </p>
                  </div>

                  {/* Author & CTA Button */}
                  <div className="pt-4 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#2563EB] to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                        {(featuredPost.author || "C").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate" itemProp="author">
                          {featuredPost.author || "Editorial Team"}
                        </p>
                        {featuredPost.published_at && (
                          <time className="text-[10.5px] sm:text-[11px] text-slate-400" dateTime={featuredPost.published_at}>
                            {formatDate(featuredPost.published_at)}
                          </time>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs sm:text-sm font-bold hover:bg-[#1D4ED8] transition-all shadow-xs shrink-0"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Editorial Highlight (Hidden on very small phones, shown on md+) */}
                <div className="hidden md:flex md:col-span-5 lg:col-span-4 bg-gradient-to-br from-blue-50/50 via-slate-50/70 to-indigo-50/40 border-t md:border-t-0 md:border-l border-slate-200/70 p-6 sm:p-7 md:p-8 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-3">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Key Takeaway</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 italic">
                      &ldquo;{featuredPost.meta_description}&rdquo;
                    </p>

                    {featuredPost.keywords && (
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Themes
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {featuredPost.keywords
                            .split(",")
                            .slice(0, 3)
                            .map((kw) => (
                              <span
                                key={kw}
                                className="text-[10.5px] font-medium text-slate-600 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md"
                              >
                                #{kw.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Research Methodology</span>
                    <span className="font-semibold text-emerald-600">✓ Peer-Reviewed</span>
                  </div>
                </div>
              </article>
            )}

            {/* ── 2. Standard Responsive Articles Grid ──────────── */}
            <div>
              {featuredPost && (
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Latest Publications
                  </h3>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentGridPosts.map((post) => {
                  const style = getCategoryStyle(post.category);
                  const kwList = post.keywords
                    ? post.keywords
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                    : [];

                  return (
                    <article
                      key={post.slug}
                      className="group bg-white rounded-2xl border border-slate-200 hover:border-[#2563EB]/40 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                    >
                      {/* Gradient Accent Bar */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${style.gradientBar}`} />

                      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                        {/* Top Meta: Category + Read Time */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider border ${style.pillBg} ${style.pillText} ${style.pillBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                            {post.category || "Research"}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{post.reading_time || 6} min read</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h2
                          className="text-base sm:text-[17px] font-black text-[#080F1C] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-2"
                          itemProp="headline"
                        >
                          <Link href={`/blog/${post.slug}`} className="hover:underline">
                            {post.title || post.seo_title}
                          </Link>
                        </h2>

                        {/* Description */}
                        <p
                          className="text-xs sm:text-[13px] text-slate-600 line-clamp-3 leading-relaxed mb-4 flex-1"
                          itemProp="description"
                        >
                          {post.meta_description}
                        </p>

                        {/* Keywords Pills */}
                        {kwList.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {kwList.map((kw) => (
                              <span
                                key={kw}
                                className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-500 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-md"
                              >
                                <Tag className="w-2.5 h-2.5 opacity-50" />
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Footer: Author + Read Link */}
                        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0">
                              {(post.author || "C").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-700 truncate text-[11.5px]" itemProp="author">
                              {post.author || "Editorial Team"}
                            </span>
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:gap-1.5 transition-all shrink-0 ml-2"
                            aria-label={`Read article: ${post.title || post.seo_title}`}
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 3. 100% RESPONSIVE PAGINATION BAR ────────────────── */}
        {totalPages > 1 && (
          <nav className="mt-10 sm:mt-14 pt-6 border-t border-slate-200/70" aria-label="Blog pagination">
            {/* Mobile View (< 640px): Prev / Page X of Y / Next */}
            <div className="flex sm:hidden items-center justify-between gap-3 w-full">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-slate-600 px-2 shrink-0">
                Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
                <strong className="text-slate-900">{totalPages}</strong>
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tablet & Desktop View (>= 640px): Full Windowed Number Buttons */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getPaginationItems(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="w-8 text-center text-slate-400 font-bold text-xs select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(Number(p))}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-colors ${
                        currentPage === p
                          ? "bg-[#2563EB] text-white font-black"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
