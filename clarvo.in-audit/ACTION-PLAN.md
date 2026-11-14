# Action Plan — clarvo.in

Each item lists what it unblocks, a **fail check** (how you'd know the fix didn't work) and a **leading indicator** to watch.

## Phase 1 — Critical fixes (Week 1)

1. **Fix the blog site URL.** Extract `getValidSiteUrl()` into `src/lib/site-url.ts`, use it in `src/app/(main)/blog/page.tsx` and `blog/[slug]/page.tsx` (and `resumeHtml.ts` / `layout.tsx` / `sitemap.ts` / `robots.ts` for consistency), and set `NEXT_PUBLIC_APP_URL=https://clarvo.in` on the server.
   - Unblocks: blog indexing, BlogPosting schema, social previews.
   - Fail check: `curl -s https://clarvo.in/blog/how-to-read-scientific-papers-efficiently | grep -c localhost` should be `0`.
   - Indicator: GSC → Pages → "Alternate page with proper canonical" / "Duplicate, Google chose different canonical" count drops for `/blog/*`.
2. **Stop the double render.** In `src/app/(main)/layout.tsx`, replace `fallback={<div className="main-content">{children}</div>}` with a skeleton or `null`, or push the Suspense down to the `useSearchParams` consumer inside `AppShell`.
   - Unblocks: correct H1s, single JSON-LD, roughly halved HTML weight, better LCP.
   - Fail check: `curl -s https://clarvo.in | grep -o '<h1' | wc -l` should be `1`.
   - Indicator: homepage gzipped HTML size < 30 KB.
3. **Add `public/og-image.png`** (1200×630). Fail check: `curl -I https://clarvo.in/og-image.png` returns 200.
4. **www → apex 301** in nginx. Fail check: `curl -I https://www.clarvo.in` returns 301 with `Location: https://clarvo.in/`.

## Phase 2 — High impact (Weeks 2–3)

5. **Complete the sitemap.** Add all blog slugs (with real `lastModified`), `/about-us`, `/psychometric-assessment`, `/discover`, `/career-library`, `/book-a-demo`, `/sample-reports`, `/privacy`, `/terms`. Remove `/auth`. Depends on #1. Indicator: GSC sitemap "Discovered" count ≈ 25+.
6. **Noindex utility pages:** `/auth`, `/career-roadmap`, `/submit-review`. Consolidate `/sample-report` ↔ `/psychometric-test/sample-report` with a 301 and a canonical.
7. **Unique metadata.** Write per-route descriptions (53 pages currently share one). Remove the duplicated brand from titles (`title.absolute` on the homepage; drop "| CLARVO" from page titles). Trim blog titles to ≤ 60 characters.
8. **SSR content on the tool pages** (`/iq-test`, `/psychometric-test`, `/university-finder`): add an H1, 300–600 words, an FAQ and a CTA above the client tool. Indicator: impressions for "psychometric test for class 10", "IQ test for students" and "university predictor" in GSC.
9. **Make marketing pages cacheable.** Move `getUserProfile()` out of the `(main)` server layout (client session fetch), so marketing and blog pages can be static or ISR. Fail check: the `Cache-Control` header on `/` is no longer `no-store`; TTFB < 600 ms.
10. **School-logo carousel:** drop `priority` and the preload, convert to WebP/SVG ≤ 15 KB, and lazy-load.

## Phase 3 — Content & authority (Month 2)

11. **Unify Organization schema** (a single EducationalOrganization node with `@id`, a PNG logo, `sameAs`, `contactPoint`, address). Add `Service` schema for each offering and `BreadcrumbList`.
12. **Commercial content cluster** to match the services: Class 10 stream selection (Science vs Commerce vs Humanities), "psychometric test for Class 9/10", the Digital SAT guide for Indian students, a high-school research publication guide (links into `/research`), and a study-abroad timeline by grade. Interlink each article with its service page.
13. **E-E-A-T:** counsellor bios with credentials, methodology citations on `/psychometric-assessment`, reviews/testimonials (with consent), and a Google Business Profile for the Mumbai office.
14. **Student portfolios:** link them from `/admitted-students`, and either enrich them or `noindex` any with fewer than ~150 words.
15. Compress the sample-report PDFs (8 MB → < 1.5 MB). Add `/llms.txt`.

## Phase 4 — Monitoring (Ongoing)

- Verify the domain in Google Search Console (the `google33ebe1c0d56c6178.html` file is already in `/public`). Submit the sitemap and watch Page Indexing weekly.
- Re-run `/seo audit clarvo.in` after Phase 1–2 deploys. Run `/seo drift baseline https://clarvo.in` once Phase 1 ships, to catch regressions (e.g., the localhost URL coming back).
- Once `/seo setup` completes, run `/seo technical` and `/seo visual` for Lighthouse, CWV and mobile screenshots.

---

## Applied in code (2026-11-14), pending deploy

- [x] #1 Blog localhost URLs: shared `src/lib/site-url.ts`, used in blog, layout, sitemap and robots. **Still set `NEXT_PUBLIC_APP_URL=https://clarvo.in` on the server.**
- [x] #2 Double render: Suspense fallback removed from `src/app/(main)/layout.tsx`. Locally the homepage now has 1 H1 and the HTML went from 361 KB to 200 KB.
- [x] #3 `public/og-image.png` added. Blog, homepage and guides now use it.
- [ ] #4 www → apex 301 (nginx, outside the repo)
- [x] #5 Sitemap: all blog posts (90) plus the indexable static pages. `/auth` and the gated tools are removed.
- [x] #6 Noindex: `/auth`, `/career-roadmap`, `/submit-review`, and the gated `/psychometric-test`, `/iq-test`, `/university-finder`. Canonical for `/sample-report`.
- [x] #7 Titles: brand duplication removed and pages retargeted. Canonicals and descriptions added for book-a-demo, sample-reports and career-library.
- [x] #11 (partial) Org schema unified: PNG logo, contactPoint, knowsAbout. **`sameAs` still empty: add your social profile URLs.**
- [x] #12 Keyword targeting on existing pages only (no new pages). See `KEYWORD-MAP.md`. Covers homepage title, description, hero subcopy, Services H2 and 4 new FAQs (+ FAQPage JSON-LD), plus `/psychometric-assessment`, `/research`, `/discover`, `/admitted-students`, `/about-us`, `/blog` and the root layout.
