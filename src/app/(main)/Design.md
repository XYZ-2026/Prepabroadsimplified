# Clarvo Home Page Redesign: Design System and Antigravity Prompt Pack

Drop this file in your project root as `DESIGN.md` so the agent can re-read it on every task.

## 0. How to run this in Antigravity

Do not paste one giant prompt. Long single prompts make agents drift and quietly drop requirements. Run them in order and approve each stage before the next.

1. Put the 8 images from `clarvo-assets.zip` in `/public/images/home/`.
2. Put your screenshot in `/reference/current-home.png`.
3. Put this file in the root as `DESIGN.md`.
4. Run Prompt 0 (plan only, no code), then 1, 2, 3, 4, 5.

Standing rules for every prompt (they are repeated inside each one):
- The horizontal logo marquee ("Counselled 10,000+ students of today's top schools") is LOCKED. Do not edit its code, speed, or content. Only the spacing around it may change.
- Keep all existing routes, links, forms, tracking and SEO tags.
- No new statistics or claims. Reuse the numbers already on the site.

## 1. Design system

Source: sampled from the Clarvo Entrepreneurship brochure. Confirm hex values against your brand file if you have one.

### Colour

| Token | Hex | Use |
|---|---|---|
| clarvo-blue | #1258DE | Primary buttons, links, the "path" line, highlights |
| midnight | #171822 | Dark panels, the pinned story section, footer |
| paper | #F5F7FB | Default page background |
| sky | #E6EDFF | Light blue surfaces, big background words |
| ink | #12131C | Text on light |
| muted | #5B6275 | Secondary text on light (meets AA on paper) |
| line | #DDE3F0 | Borders on light |

No other accent colours. The neon lime in the brochure photos stays in the photos only.

### Type

- **DM Sans** (700 headlines, 400/500 body and UI). This is the brochure's headline face.
- **Anton** (Google Fonts, free stand-in for the brochure's condensed Placard). Used only for giant "stage words" behind photos, never for body, labels or buttons.

Scale (fluid):
- Display: clamp(2.75rem, 6vw, 5.5rem), 700, line-height 1.02, tracking -0.03em
- H2: clamp(2rem, 4vw, 3.25rem), 700, line-height 1.08, tracking -0.02em
- Body: 1.0625rem / 1.6, max 62ch
- Stage word: clamp(7rem, 22vw, 20rem), Anton, line-height 0.85

Sentence case everywhere. No tracked all-caps eyebrow labels above headings.

### Shape and depth
- Pills (999px) for chips, matching the brochure's "1 Year / Online / Grades 8-12".
- Large panels 28px radius. Small cards 14px. Photos 20px.
- One shadow style only: `0 24px 60px -24px rgba(18,88,222,.25)` on elevated cards. Most surfaces use a 1px `line` border instead.

## 2. Hero concept: "The Path"

The brochure's own signature move is students overlapping giant condensed words (`ENTREPRENEURSHIP PROGRAM`, `LEARN BY BUILDING`). The hero reuses it so the site and brochure feel like one brand.

```
+------------------------------------------------------------------+
| logo   Services Programs Assessments Journey Stories About   [Start free] |
|                                                                  |
|  Find the path                 P A T H  (giant Anton, sky tint)  |
|  that fits your                 ____________________             |
|  child.                       /  students cutout, heads        \ |
|                               | overlap the letters            | |
|  Sub copy (2 lines)           |                                | |
|  [Start free assessment]      +--chip--+        +--chip--+      |
|  [See a sample report]           \  path line draws  /          |
|  15,000+ guided | 100+ careers | 90% parents clearer             |
+------------------------------------------------------------------+
  [ logo marquee: unchanged ]
```

- Left-aligned text, 5 of 12 columns. Stage on the right, 7 of 12.
- Light hero (paper). The page turns dark later, in the pinned story section.
- The cutout's bottom edge is flat, so it sits on the hero's bottom boundary and the marquee strip overlaps it.

Copy (reuse your existing route targets):
- H1: **Find the path that fits your child.** (Fallback: your current "Clarity for their future. Built for ambition.")
- Sub: Scientific assessments, expert counsellors and a clear roadmap, so students and parents choose a stream, career and university with evidence instead of guesswork.
- Primary CTA: Start free assessment. Secondary: See a sample report.
- Chips (labelled "Sample report" in small text, because they are illustrative): "Stream fit: Science + Computing", "Strength: Analytical reasoning", "Next step: Talk to a counsellor".

## 3. Section map (current page to new page)

| # | Section | New treatment |
|---|---|---|
| 1 | Nav | Sticky, compact, blur on scroll. Same links. |
| 2 | Hero | The Path (above). |
| 3 | Logo marquee | LOCKED. |
| 4 | Support for every stage | Bento grid with different tile sizes, not five equal cards. Includes an Entrepreneurship Programme tile (1 year, online, Grades 8-12). |
| 5 | Stats | Quiet dark strip. Numbers count up once. Same four figures as today. |
| 6 | Assessment matrix (4 phases) | **Signature scroll moment.** Pinned on midnight. Personality, Cognitive, Execution, Alignment. A profile graphic fills in as each phase passes. |
| 7 | Class 10 strategic value | Three pillars, light background, "Request full sample report" CTA. |
| 8 | Report dossier flipbook | Keep the interaction. Restyle as a report on a desk. Page turn is user-triggered. |
| 9 | Self-discovery to global admissions | Five-step horizontal stepper (a real sequence, so numbers are fine). The path line continues through it. |
| 10 | Grade-specific pillars | Segmented control (Grades 7-8, 9-10, 11-12), each with its own photo. |
| 11 | Testimonials | Static grid with verified chips. No second marquee. |
| 12 | Consultation CTA | Solid blue panel like the brochure's last page. Celebration cutout breaks out of the top edge. |
| 13 | FAQ | Accordion. Expand/collapse animation answers the click. |
| 14 | Final CTA + footer | Midnight. |

## 4. Where the brochure images go

| File | Placement |
|---|---|
| 02-group-cutout | Hero stage (in front of the PATH word) |
| 08-building-product | Support bento, Entrepreneurship tile |
| 06-mentoring-laptop | Support bento, Assessments tile |
| 05-presenter-cutout | Grade pillars, Grades 11-12 |
| 04-girl-win-cutout | Grade pillars, Grades 9-10 |
| 03-celebrate-cutout | Consultation CTA (breaks the panel edge) |
| 01-hero-team-tablet | Pinned story section background (blue duotone, heavy darken) |
| 07-brand-moodboard | Spare |

Cutout warning: the girl in the blue hoodie (04) disappears on clarvo-blue. Place her on paper, sky or midnight only.

## 5. Motion plan

Three signature moments. Everything else stays still or responds to a click.

1. **Hero load sequence (once, about 2.2s).**
   - 0.0s: headline lines slide up out of masks, 80ms stagger.
   - 0.3s: "PATH" scales from 1.12 to 1 and fades in.
   - 0.5s: student cutout rises 8% and fades in.
   - 0.9s: the path line draws (SVG stroke-dashoffset) while the three chips pop in one by one.
   - 1.4s: CTAs and trust row fade in.
   - After load (desktop only): slow mouse parallax, ±12px word, ±22px cutout, ±36px chips.
2. **Pinned assessment story (section 6).** Scroll-scrubbed. Each phase takes about 80vh of scroll.
3. **Stats count-up**, once, when visible.

Everything else: hover and press feedback on buttons and cards only, the flipbook page turn, the FAQ accordion, and the grade segmented control.

Stack assumed: React or Next.js + Tailwind + GSAP ScrollTrigger + Lenis. Adjust Prompt 0 if yours differs.

## 6. Prompts for Antigravity

### Prompt 0: Audit and plan (no code)

```
Read /reference/current-home.png and DESIGN.md in full. Do not write any code yet.

1. List every section of the current home page and the component/file that renders it.
2. Identify the horizontal logo marquee component. It is LOCKED: never edit its code, speed, direction or content. Tell me its file path.
3. Propose the file structure for the redesign and the dependencies you need (expected: gsap with ScrollTrigger, lenis).
4. List anything in DESIGN.md that conflicts with the existing stack or routes.
5. Confirm you will not invent any statistics, testimonials or claims.

Reply with the plan and wait for my approval.
```

### Prompt 1: Tokens and primitives

```
Follow DESIGN.md sections 1 and 5.
- Add the colour, type, radius and shadow tokens as CSS variables and extend the Tailwind config.
- Load DM Sans and Anton with next/font or an equivalent, with font-display: swap.
- Build primitives: Button (primary, secondary, ghost), Chip, Container, SectionHeading, Panel (large/small radius variants).
- Add a global reduced-motion hook. Every animation I ask for later must check it and fall back to the final static state.
- Add Lenis smooth scroll with ScrollTrigger sync. Disable it on touch devices.
- Do not touch the logo marquee. Keep keyboard focus rings visible on every interactive element.
```

### Prompt 2: Hero

```
Rebuild the hero exactly as described in DESIGN.md section 2.

Layout: 12-column grid. Text in 5 columns, left-aligned. Stage in 7 columns.
Stage layers, back to front: Anton word "PATH" in the sky colour, the student cutout /public/images/home/02-group-cutout.webp anchored to the hero bottom with the word's letters behind the students' heads, an SVG path line, then three floating chips.
Copy: use the copy in DESIGN.md section 2. Keep the existing CTA routes.

Motion: implement the load sequence in DESIGN.md section 5, item 1, as one GSAP timeline. After it finishes, add desktop-only mouse parallax with the stated offsets. Use transform and opacity only. No layout-shifting animation.

Mobile (below 768px): stack headline, sub, CTAs, then the stage. Show 2 chips. No mouse parallax. Keep the load sequence but shorten it to about 1.4s.

Performance: the image needs explicit width/height, fetchpriority="high", and no lazy loading, because it is the LCP element.
Do not touch the logo marquee that sits directly below the hero. Only adjust the spacing so it overlaps the cutout's flat bottom edge cleanly.
```

### Prompt 3: Sections 4 to 9

```
Build sections 4 to 9 from DESIGN.md section 3. Reuse all existing copy and numbers unless the table says otherwise.

- Section 4: bento grid with differently sized tiles. Use 06-mentoring-laptop and 08-building-product. Add the Entrepreneurship Programme tile: "1 year, online, Grades 8-12". Do not add a price.
- Section 5: midnight strip, count-up once on first view.
- Section 6: pinned, scroll-scrubbed story on midnight. 01-hero-team-tablet behind it as a blue duotone at low opacity. One phase per scroll step. A profile graphic fills in progressively. On mobile, replace the pin with a simple stacked layout.
- Sections 7, 8, 9: as the table describes. Keep the existing flipbook logic and restyle it. Section 9 is a five-step stepper with numbers.

No fade-up-on-scroll for ordinary sections. The only scroll-driven motion allowed is the one in section 6.
```

### Prompt 4: Sections 10 to 14 and footer

```
Build sections 10 to 14 and the footer from DESIGN.md section 3.

- Section 10: segmented control for Grades 7-8, 9-10, 11-12. Use 04-girl-win-cutout on paper or sky, and 05-presenter-cutout on midnight. Content swaps with a short cross-fade.
- Section 11: static testimonial grid. Keep the existing testimonials and verified chips. No marquee.
- Section 12: solid clarvo-blue panel, large white headline "Your child's right path can start here." with 03-celebrate-cutout breaking out of the top edge. Keep the existing booking CTA routes.
- Section 13: accessible accordion (button, aria-expanded, aria-controls), height animation 250ms.
- Footer: midnight, keep all existing links.
```

### Prompt 5: Polish and checks

```
Audit the whole page against DESIGN.md and fix issues.
1. Reduced motion: confirm every animation has a static fallback.
2. Responsive: check 360, 768, 1024, 1440 and 1920 widths. No horizontal scroll.
3. Accessibility: contrast AA on all text, visible focus rings, alt text on every image, heading order.
4. Performance: Lighthouse mobile. Target LCP under 2.5s. Images lazy-loaded except the hero. No layout shift.
5. Confirm the logo marquee is byte-for-byte unchanged.
6. Report what you could not verify.
```

## 7. Before you ship

- Verify the stats (15,000+ students, 90% parent clarity, 100+ specialisations, 30+ modules) are current. They are copied from the existing page.
- The brochure photos look AI-generated and are at most 1536px wide, so use them in framed or cutout roles, never full-bleed on large screens.
- I left out the Zepto founders image from the brochure. It shows real people and a third-party brand, which is a risk on a public page.
- The brochure's price, mentor names and certificate belong to the Entrepreneurship Programme. They should go on a dedicated programme page, not the home page.

## 8. Notes for Gemini 3.8 Flash (High)

- Keep the staged order. This model is built for long multi-step work and will happily keep going, so add this line at the top of every prompt: "Do only what this prompt asks. Do not start the next stage."
- Use High thinking for Prompt 0, Prompt 2 (hero), the pinned section 6 in Prompt 3, and Prompt 5. Use Medium for Prompts 1 and 4 and the simple sections of Prompt 3. High spends more tokens and time on verification, which simple layout work does not need.
- Add to Prompts 2, 3 and 4: "When done, run the dev server and, if a browser tool is available, check the result at 1440px and 390px wide. Fix what looks broken, then summarise what you changed."
- If it adds extras (new sections, new copy, new effects), reply: "Remove everything not listed in DESIGN.md."
