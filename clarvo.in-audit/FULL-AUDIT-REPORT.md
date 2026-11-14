# SEO Audit — clarvo.in

**Date:** 2026-11-14  |  **Pages crawled:** 85 (internal-link crawl + sitemap, robots.txt respected)  |  **Business type:** Education services / EdTech (hybrid SaaS + counselling, Mumbai-based)

## Executive Summary

### SEO Health Score: **51 / 100**

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 45 |
| Content Quality | 23% | 55 |
| On-Page SEO | 20% | 50 |
| Schema / Structured Data | 10% | 55 |
| Performance (CWV) | 10% | 40* |
| AI Search Readiness | 10% | 55 |
| Images | 5% | 60 |

\*No lab or field data: PageSpeed Insights returned 429 (the shared daily quota was used up) and the local Lighthouse/Chromium runtime is still installing. The score comes from TTFB, payload size and code review, so treat it as an estimate.

### Top 5 critical issues
1. **Blog canonicals, og:url, og:image and BlogPosting schema all point to `http://localhost:3008`.** This affects `/blog` and all 10 posts. Google will treat the canonical as invalid or unreachable, so the blog (your strongest content) is at risk of not being indexed properly.
2. **Every page under the `(main)` layout is rendered twice in the HTML.** Duplicate H1s, duplicate JSON-LD blocks and double the HTML weight (homepage 361 KB, `/blog` 1.8 MB, `/career-library` 2.9 MB).
3. **`/og-image.png` returns 404.** That is the site-wide default `og:image` / `twitter:image`, so social and AI link previews are broken on most pages.
4. **The sitemap leaves out most indexable content.** None of the 10 blog posts are in it. Neither are `/about-us`, `/psychometric-assessment`, `/discover`, `/career-library`, `/book-a-demo` or `/sample-reports`. Meanwhile `/auth` (a login page) *is* in it.
5. **`www.clarvo.in` serves a 200 duplicate of the site** instead of 301-redirecting to `https://clarvo.in`.

### Top 5 quick wins
1. Fix `BASE_URL` in the two blog route files (a 2-line change), and set `NEXT_PUBLIC_APP_URL=https://clarvo.in` in production.
2. Add `public/og-image.png` (1200×630).
3. Change the Suspense fallback in `src/app/(main)/layout.tsx` so it no longer renders `{children}`.
4. Add the missing URLs to `src/app/sitemap.ts` and remove `/auth`.
5. Add a www→apex 301 in nginx.

---

## Technical SEO (45)

**What works:** HTTPS enforced (http→https 301). robots.txt is clean (only `/dashboard/` and `/api/` are blocked) and references the sitemap. Valid sitemap XML. `lang="en"` is set. Student-detail pages (`/admitted-students/{id}`, `/admitted/{id}`) are deliberately `noindex`.

| Severity | Finding | Evidence | Fix |
|---|---|---|---|
| Critical | Localhost canonicals on the blog | `<link rel="canonical" href="http://localhost:3008/blog/...">` on 11 URLs. `src/app/(main)/blog/page.tsx:11` and `blog/[slug]/page.tsx:22` use `process.env.NEXT_PUBLIC_APP_URL` directly, and the production env has the `.env.example` value `http://localhost:3008`. Root layout, sitemap and robots use `getValidSiteUrl()`, which strips localhost, so they are unaffected. | Use the same `getValidSiteUrl()` helper (move it into `src/lib/site-url.ts` and import it everywhere), and fix the production env var. |
| Critical | Whole page duplicated in the HTML | `src/app/(main)/layout.tsx:19`: `<Suspense fallback={<div className="main-content">{children}</div>}>`. The fallback renders the full page *and then* the resolved `AppShell` renders it again. Verified outside `<script>` tags: 2× H1 on the homepage, 4× on blog posts. | Use a lightweight fallback (`null` or a shell skeleton). Better still, wrap only the component inside `AppShell` that needs `useSearchParams` in Suspense. |
| High | No www canonicalisation | `https://www.clarvo.in` → 200 (no redirect). The canonical tag helps, but link equity and crawl budget get split. | Add an nginx `server_name www.clarvo.in; return 301 https://clarvo.in$request_uri;` |
| High | Sitemap coverage | 12 URLs listed vs. ~25 indexable. Missing: all `/blog/*`, `/about-us`, `/psychometric-assessment`, `/discover`, `/career-library`, `/book-a-demo`, `/sample-reports`, `/privacy`, `/terms`. All `lastmod` values = build time (not meaningful). | Generate blog URLs from the Wix/blog source with real `updatedAt`. Add the static pages. Remove `/auth`. |
| High | Every page is fully dynamic and uncacheable | `Cache-Control: private, no-cache, no-store` on the homepage and the marketing pages. `getUserProfile()` (cookies) in `(main)/layout.tsx` makes every route dynamic. TTFB: home 1.1–1.3 s, `/career-library` 2.6 s, first `/blog` hit 10.7 s. | Move the session read to the client (or a small client island), so marketing pages can be static or ISR. |
| Medium | Login and utility pages are indexable | `/auth`, `/career-roadmap` (renders auth, canonical → `/auth`), `/submit-review`, `/sample-report` are `index, follow`. | `robots: { index: false }` on auth, submit-review and gated pages. |
| Medium | Duplicate URLs | `/sample-report` and `/psychometric-test/sample-report` serve identical 789 KB pages. Neither has a canonical. | Pick one, 301 the other, and add a canonical. |
| Medium | Missing canonicals | `/book-a-demo`, `/career-library`, `/sample-reports`, `/submit-review`, `/psychometric-test/sample-report`. | Add `alternates.canonical` per page. |
| Medium | No security headers | No HSTS, CSP, X-Content-Type-Options, X-Frame-Options or Referrer-Policy. `X-Powered-By: Next.js` and nginx version are exposed. | Add the headers in nginx or `next.config` `headers()`, and set `poweredByHeader: false`. |
| Low | Orphan pages | Student portfolios `/rohan-dani`, `/samkit-shah`, `/alex-burgman` are in the sitemap but have 0 internal links. | Link them from `/admitted-students` or a portfolio index. |
| Low | Sample-report PDFs are ~8 MB each | `/sample-reports/*.pdf` took 15–20 s to download. | Compress them (target < 1.5 MB). |

## Content Quality (55)

**What works:** The blog posts are substantive (~2,000–2,600 unique words each after de-duplicating the doubled render). They carry a Person author and `datePublished`, and are tightly themed on student research, which builds a good topical cluster. The homepage FAQ is specific and answer-first. "Counselled 10,000+ students" is a strong trust claim.

| Severity | Finding | Fix |
|---|---|---|
| High | **Tool landing pages are thin in the server HTML.** `/iq-test`, `/psychometric-test` and `/university-finder` have ~35 unique words and no H1; the content is client-rendered. These are your highest-intent commercial pages. | Server-render an H1, a 300–600 word intro (what it measures, who it is for, sample output, FAQ) and a CTA above the tool. |
| High | **E-E-A-T gaps.** No named counsellors or credentials on the service pages, `sameAs` is empty, and there are no reviews or testimonials in markup. | Add counsellor bios with qualifications, link team profiles (LinkedIn), and cite the methodology sources (RIASEC, Big Five) on `/psychometric-assessment`. |
| Medium | Student portfolio pages have ~20 words of HTML text but are indexable and in the sitemap. | Either enrich them (achievements, research, schools) or `noindex` them until they reach a content minimum. |
| Medium | The blog is 100% research-skills content. Nothing targets the core commercial intents (stream selection after Class 10, SAT vs ACT, psychometric test for Class 9, study abroad timelines). | See the Action Plan, Phase 3 content cluster. |
| Low | The homepage H1 renders as "Find the paththat fits yourchild." (spans without spaces between them). | Add `{' '}` between the spans. |

## On-Page SEO (50)

| Severity | Finding | Fix |
|---|---|---|
| High | **53 of 85 pages share the default root description.** | Write a unique `description` per route; for dynamic routes, use `generateMetadata`. |
| High | **Brand repeated in titles.** The template `'%s \| CLARVO'` is applied to titles that already contain the brand: `CLARVO — Clarity… \| Student Development Platform \| CLARVO`, `About CLARVO \| CLARVO EDUCATION PRIVATE LIMITED \| CLARVO`, `Student & Counsellor Login / Sign Up \| CLARVO \| CLARVO`. | Remove the brand from page-level titles, or use `title: { absolute: … }` on the homepage. |
| High | Missing H1 on `/iq-test`, `/psychometric-test`, `/university-finder`, `/auth`, `/psychometric-test/sample-report`. | Add an SSR H1 with the primary keyword. |
| Medium | Duplicate H1s everywhere (caused by the Suspense duplication). Blog posts also get a second H1 from the markdown `# Title`. | Fix the layout, and demote the markdown H1 to `h2` or strip it. |
| Medium | Title length: blog titles are 91–103 characters (truncated in the SERP). | Keep them ≤ 60 characters. |
| Low | `/career-library` title is only 32 characters and the description is 206 characters. | Rebalance. |

## Schema / Structured Data (55)

**Present:** EducationalOrganization, WebSite + SearchAction, FAQPage, Blog/BlogPosting, ProfilePage/Person, EducationalApplication, OfferCatalog.

| Severity | Finding | Fix |
|---|---|---|
| High | **Conflicting entity definitions.** The `@id` `https://clarvo.in/#organization` is declared as `EducationalOrganization` (layout) *and* `Organization` (homepage), with different `url` values (`/` vs no slash). Homepage JSON-LD appears 5× because of duplication. | Define the org once in the root layout (EducationalOrganization) and reference it by `@id` elsewhere. |
| High | BlogPosting `url`, `@id`, `publisher.logo` use localhost. | Fixed by the BASE_URL fix. |
| Medium | `sameAs: []` is empty. There are no `telephone`/`email` fields despite the tel/mailto links on the page. | Add social profiles, LinkedIn and Google Business Profile, plus `contactPoint`. |
| Medium | The `logo` is AVIF. Google recommends PNG/JPG/WebP for the logo. | Use `logo-square-cropped.png`. |
| Info | FAQPage on `/`, `/research` and `/psychometric-assessment`. Google retired FAQ rich results (May 2026), so they no longer produce a SERP feature. No need to remove them. | — |
| Low | Add `Service`/`Course` schema for SAT prep, tutoring and research mentorship, and `BreadcrumbList` on the blog and services. | — |

## Performance (40, estimated)

| Severity | Finding | Fix |
|---|---|---|
| High | Fully dynamic SSR on every request (see Technical). TTFB 1.1–2.6 s; cold `/blog` 10.7 s. | Static or ISR for marketing and blog pages. |
| High | HTML doubled. The homepage ships 361 KB raw / 53 KB gzipped, `/blog` 570 KB gzipped, `/career-library` 312 KB gzipped. | Suspense fix, plus paginating `/career-library` and `/blog`. |
| High | **8 school-logo PNGs (~1.1 MB total) are preloaded via a `Link` header.** `priority` on a logo carousel competes with the hero image for LCP. Some are 290–335 KB PNGs. | Remove `priority`, convert to WebP/SVG at ~200 px wide (< 15 KB each), and lazy-load them. |
| Medium | Only 1 of 80 images on the homepage is `loading="lazy"`. Hero images are requested at `w=3840`. | Set correct `sizes` on `next/image`. |

## Images (60)

All 80+ images on the audited pages have alt attributes (100%). The deductions are for heavy PNGs (school logos), missing lazy-loading, oversized `srcset` widths, the broken default og:image (`/og-image.png` 404), and the blog's og:image being a localhost URL.

## AI Search Readiness (55)

**What works:** robots.txt allows all crawlers, including GPTBot and ClaudeBot. The FAQ and blog content is answer-first. The blog has a Person author.

| Severity | Finding | Fix |
|---|---|---|
| High | Thin SSR on the tool pages means AI crawlers (most don't execute JS) see almost nothing on your commercial pages. | Same fix as Content. |
| Medium | Entity signals are weak: `sameAs` is empty, the founder/team aren't marked up, and the Org schema conflicts. | Unify the entity and add `sameAs`. |
| Low | No `/llms.txt` (404). It's optional and ignored by Google, but cheap to add. | List the key pages and services. |

---

### Methodology notes
- The crawl used a custom HTTP crawler (5 concurrent, 1 s delay, robots-respecting). It ran because the plugin's isolated Python/Chromium runtime was still installing (`/seo setup` didn't finish), so there are **no JS-rendered screenshots, no Lighthouse run and no visual/mobile tests** in this audit.
- No Google Search Console, GA4, Moz or Bing credentials were available, so there is no field CWV, indexation or backlink data.
- Word counts in `audit-data.json` were halved to correct for the duplicated render.
