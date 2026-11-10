# Clarvo Psychometric Page: Motion Design Spec v2

Route: `/psychometric-assessment`.

This file replaces `Design_psychometric.md` for layout, copy length and motion. Three things still come from the old file: the content facts and owner placeholders (its section 1), the claims policy, and the sample-report file rules. Tokens, type, shapes, MediaFrame, breakpoints and the nine-viewport test matrix still come from `Design.md` (v2.1). Where this file and either of those differ, this file wins.

## 0. Goals

1. **Mobile first.** Design at 390x844 first, then scale up. A first-time visitor on a phone sees the headline, the photo, a sample result and the primary CTA without scrolling past the first screen.
2. **Show, don't tell.** Cut on-page copy by about half. Every section answers one question with one visual and at most two short lines of text.
3. **Animation that explains.** Each animation shows how the test works (answers → profile → report → plan). There is no decoration for its own sake. The page should feel calm and premium, not busy.
4. **Conversion.** "Start assessment" is always reachable on mobile. "View a sample report" and "Book a consultation" stay on their existing routes.

## 1. The story the scroll tells

The page is one narrative. Each section moves it one step forward, and a single visual idea runs through all of it: **a profile that builds up as you scroll.**

| Scroll step | Visitor understands | The visual that carries it |
|---|---|---|
| Hero | "This is a test that maps my child." | Sample profile card: three trait bars fill |
| Is / is not | "It's not an exam and not a diagnosis." | Three wrong ideas get struck through |
| Four phases | "It looks at four sides of my child." | A four-sided radar gains one side per phase |
| Try a question | "The questions are simple and honest." | The visitor's answer moves a live trait bar |
| What you receive | "We get a real, detailed report." | A report opens like a book |
| Journey | "Here is what happens, step by step." | A line draws down the timeline |
| Sample reports | "I can see one before paying." | The cover flips per grade |
| Trust, FAQ, CTA | "It's safe. Let's start." | Quiet. Fade-ins only |

## 2. Copy rules (fixing the text-heavy page)

| Element | Max length |
|---|---|
| Section headline | 8 words |
| Section sub copy | 1 sentence, 20 words. Optional, and omit it where the visual is enough |
| Card title | 4 words |
| Card body | 12 words |
| List item | 8 words |
| FAQ answer | 40 words |

Rules:
- One idea per section. If a section needs a paragraph, the visual is wrong.
- Replace bullet lists with chips (pills) where the items are nouns, for example "Big Five", "VARK", "Holland RIASEC".
- Longer detail sits behind a tap ("How it's measured" disclosure) or moves to the FAQ. It never shows by default.
- Remove duplicate content. The hero three-step line is removed because the journey section already covers it.
- Sentence case. No all-caps labels (replace "WHAT IT MEASURES:", "DIAGNOSTIC RADAR" and similar). No text under 13px on mobile; body text is at least 16px on mobile and 17px from 768.
- No section-level eyebrow chip unless it adds information. Remove "Interactive samples", "Report explorer", "The process", "Common questions" and "Family trust".

Target word counts (visible by default, excluding nav and footer):

| Section | Now (approx.) | Target |
|---|---|---|
| Hero | 75 | 40 |
| Is / is not | 60 | 30 |
| Four phases | 330 | 110 |
| Question demo | 140 | 70 |
| What you receive | 120 | 50 |
| Journey | 300 | 80 |
| Sample reports | 230 | 70 |
| Trust | 110 | 50 |
| FAQ (questions only, answers collapsed) | 60 | 60 |
| CTA | 35 | 25 |

## 3. Motion library and system

### Stack
- Use **Motion** (`motion` package, imports from `motion/react`) for this page. It is the successor to the `framer-motion` package already used by the home page. Install it with `npm install motion`. Leave the other pages on `framer-motion` for now, and plan a separate migration.
- **Before writing code**, read the Motion docs for the installed major version. The repo has `framer-motion` 12; `motion` is at 14 at the time of writing. Do not assume v12 APIs are unchanged.
- **Remove GSAP and ScrollTrigger from this page's components.** Use one animation engine per page.
- **Keep Lenis** on fine pointers only, through `SmoothScrollProvider`. Motion's `useScroll` reads native scroll, so it works with or without Lenis.
- Use only the free Motion APIs. Do not use Motion+ components (for example AnimateNumber, Ticker or Carousel).
- Wrap the page in `<MotionConfig reducedMotion="user">`. Use `LazyMotion` with `domAnimation` and the `m` component to keep the bundle small. Load `domMax` only where `layout` or drag is used, which is the sample-report switcher.

### Motion tokens

| Token | Value | Use |
|---|---|---|
| `enter` | opacity 0 → 1, y 16 → 0, 0.5s, ease `[0.22, 1, 0.36, 1]` | Default section and card entry |
| `stagger` | 0.06s | Lists, chips, bars |
| `spring-ui` | `{ type: "spring", stiffness: 400, damping: 30 }` | Buttons, toggles, selected pills |
| `spring-data` | `{ type: "spring", stiffness: 120, damping: 20 }` | Bars, radar and progress values |
| `flip` | 0.6s, ease `[0.65, 0, 0.35, 1]` | 3D card and cover rotations |
| `viewport` | `{ once: true, amount: 0.35 }` | All `whileInView` entries |

### Budget rules
- **At most one signature animation per section.** Everything else uses `enter` or nothing.
- **Everything plays once.** No infinite loops, pulsing, floating or auto-rotating anywhere on the page.
- At most one scroll-linked (`useScroll`) effect on screen at a time.
- Animate `transform` and `opacity` only. Height is the one exception, for the FAQ accordion only.
- Durations stay between 0.2s and 0.8s. Travel distance is 12 to 24px.
- Hover-only effects (tilt, magnetic buttons) run only under `(hover: hover) and (pointer: fine)`. Touch devices get tap states (`whileTap: { scale: 0.97 }`) instead.
- With reduced motion, show the final state immediately. Scroll-linked effects are replaced by their end state.
- Content is visible before JavaScript runs. Server-rendered HTML has everything in its final state, so the page reads correctly if Motion never loads. No blank stage at any scroll position.

## 4. 3D without models

There are no Blender or GLB assets, and none are needed. Depth comes from CSS 3D transforms animated by Motion, applied to real photos, report covers and SVG:

| Technique | Where | How |
|---|---|---|
| Card deck in depth | Four phases | The cards sit in a parent with `perspective: 1200px`. The outgoing card animates `rotateX` 0 → -12deg, `y` → -40px and `opacity` → 0; the next card comes up from `scale: 0.94`. |
| Opening book | What you receive | Two DOM faces built from report page images. The cover hinges on `rotateY` 0 → -160deg from its left edge, with `transformStyle: preserve-3d` and `backfaceVisibility: hidden`. |
| Cover flip | Sample reports | `AnimatePresence mode="wait"` with `rotateY` -90 → 0 for the incoming cover and 0 → 90 for the outgoing one. |
| Layered parallax | Hero (desktop only) | The photo and the profile card move at different speeds on scroll (`useScroll` + `useTransform`, 0 to 24px). There is no mouse parallax on touch. |
| Pointer tilt | Report book and cover (fine pointers only) | `useMotionValue` + `useSpring`, max 6deg. |
| SVG draw | Radar, timeline line, strike-throughs | `pathLength` 0 → 1 |

No WebGL, three.js or canvas on this page. If it is ever added later, it must be desktop-only and lazy-loaded behind the tier rules in a new revision of this spec.

## 5. Section specs

The mobile layout (under 768) is specified first, then the changes for wider screens.

### 5.1 Hero

**Mobile (390x844).** Order: chip, H1, sub, photo with card, CTAs, facts.

```
+------------------------------+
| nav                          |
| (Grades 7 to 12 assessment)  |
| Know how your child          |
| thinks, learns and decides.  |
| 30 modules. One clear stream |
| and career plan.             |
| +--------------------------+ |
| |    photo psy-01 (cutout) | |
| |  [profile card, bottom]  | |
| +--------------------------+ |
| [ Start assessment       ]   |
| [ View a sample report   ]   |
| (30 modules)(4 phases)(56-pg)|
+------------------------------+
```

- Chip: "Grades 7 to 12 assessment".
- H1: "Know how your child thinks, learns and decides." Keep it unchanged; it passes the 5-second test.
- Sub (14 words): "A 30-module online assessment that turns answers into a clear stream and career plan."
- Photo: psy-01 cutout, about 280px tall on mobile, flush with the hero's bottom edge on wider screens. It must be at least partly visible in the first 844px.
- **Profile card** (the only overlay):
  - Title "Sample result" and three trait bars: Conscientiousness 88, Reasoning 84, Openness 79 (existing content).
  - It sits in the photo's **bottom band** (y 70 to 95%) per `faceZones-psychometric.json`. It never enters the forbidden zone (x 21 to 76, y 9 to 53).
  - Width 220px on mobile and 260px on desktop.
- The **sample question card is removed** from the hero. The question demo section does that job.
- Remove the three-step line.
- "Book a consultation" moves to the final CTA and the sticky bar (section 5.11).
- Facts: three pills, "30 modules", "4 phases", "56-page report". Add owner facts as extra pills only when they are filled in.

**From 1024.** Use the two-column layout from `Design.md`: text 5 columns, photo 7 columns bleeding right, profile card in the bottom band. From 1280, the profile card may sit in the top band instead (y -8 to 8%).

**Signature motion (about 1.4s, once on load):**
1. The two H1 lines rise from masks: `y: "100%" → 0`, stagger 0.08s.
2. The photo rises 24px and fades in (0.7s).
3. The profile card enters with `spring-ui`. Its three bars fill from 0 with `spring-data`, stagger 0.1s, and the numbers count up in step. Count up with `animate()` driving a text node, not with AnimateNumber.
4. CTAs and pills use `enter`.

On desktop with a fine pointer, layered parallax applies on scroll: the photo moves up 24px and the card moves up 12px across the hero's height.

### 5.2 Is / is not

**Goal:** remove the wrong mental models in five seconds.

- Headline: "Not an exam. A map." (4 words). No sub.
- Three rows. Each pairs a struck-through wrong idea with the right one:

| Struck through | Becomes |
|---|---|
| A school exam | No pass or fail |
| An IQ score | How they reason |
| A diagnosis | Guidance, not labels |

- Layout: one row per line on mobile. From 768, the rows sit in a 3-column strip.

**Signature motion:** when a row enters, an SVG line draws across the wrong idea (`pathLength` 0 → 1, 0.4s). The wrong idea then fades to `muted` at 50%, and the right idea slides in from `x: 12`. Stagger the rows 0.12s. With reduced motion, show the lines already drawn.

### 5.3 Four phases (main moment)

**Goal:** four sides of the child, built visibly into one profile.

- Headline: "Four phases. One complete profile." The sub copy is removed; "Shown for Grade 10" stays as a 13px note.
- **Card content** (per phase, about 25 words):
  - Phase number and module range as pills.
  - Name.
  - One-line "What it looks at" of 10 words or fewer. For example, phase 1: "How your child handles pressure, effort and new challenges."
  - Three framework or topic chips. For example, phase 1: "Big Five", "Persistence", "Focus".
  - One "In the report" line of 12 words or fewer.
  - Photo psy-02 to psy-05 at 16/10 on mobile and 4/5 on desktop.
- The three-bullet "What it measures" lists move into a "How it's measured" disclosure, collapsed by default.
- **Radar:** a four-sided SVG radar, one axis per phase, is always visible beside or above the cards. The active phase's side fills (`pathLength` and polygon `points` animate with `spring-data`). Earlier phases stay filled, so by phase 4 the full shape is complete.

**Mobile and tablet (touch, or under 1024):** a horizontal swipe row.
- CSS `scroll-snap-type: x mandatory` with 4 cards at 86vw, so the next card peeks at the edge.
- The radar sits above the row as a 120px badge.
- `useScroll({ container })` on the row's horizontal progress sets the active phase, which fills the radar.
- Dots below the row act as tab buttons and scroll the matching card into view.
- No sticky or pinned behaviour. Native swipe only.

**Desktop (1024 and up, fine pointer):** a sticky card deck.
- Wrapper about `4 x 80svh` tall. Inside it, a sticky stage at `top: calc(var(--nav-height) + 24px)` holds the left rail (four phase titles plus the radar) and the right card deck.
- Size the stage to `min(640px, 100svh - nav - 48px)` so no empty band shows below it. This fixes the current blank area.
- Set the active phase with `useInView` on four invisible markers. Never derive state from exact scroll offsets.
- When the active phase changes, the outgoing card tips back (`rotateX` 0 → -12deg, `y` → -40, `opacity` → 0), the incoming card rises from `scale: 0.94, y: 24`, and the photo inside it eases `scale` 1.04 → 1. Use the `flip` token, with one `AnimatePresence`.
- Rail titles are buttons that scroll to their markers.
- Phase 1 is fully rendered on first paint.
- No ancestor of the sticky stage may use `overflow: hidden` or `auto`; use `overflow: clip`.

With reduced motion, the stacked cards show statically and the radar is drawn complete.

### 5.4 Try a question

**Goal:** the questions are simple, and each answer shapes the profile.

- Headline: "Try a sample question". Sub: "No right or wrong answers." (5 words).
- A segmented control with three items: Personality, Reasoning, Study habits. The selected pill moves with `layoutId` and `spring-ui`.
- One question at a time. Shorten the prompts to 20 words or fewer. Keep the reasoning SVG puzzle, and shorten the option labels to "A", "B", "C" and "D" with the visual carrying the meaning.
- **Live trait bar** under the options (on mobile) or beside them (from 1024). It shows one bar plus a 6-word label.
- The current long description text is removed.
- Label everything "Sample question".

**Signature motion:** selecting an option springs its button (`spring-ui`, tap scale 0.97). The live bar then animates to its new value with `spring-data`, and a small "+ added to profile" tag fades in beside it and fades out after 1.2s. That is the only timed fade on the page.

### 5.5 What you receive

**Goal:** it is a real, substantial report.

- Headline: "A report your family can use". No sub.
- Six report parts, each a title plus 8 words or fewer. For example, "Stream fitment: PCM, PCB, Commerce or Humanities, ranked."

**Mobile:**
- A closed report (the Grade 10 cover image) opens when it scrolls into view.
- Below it, a horizontal snap row of six cards, each showing a page image and its title.
- Tapping a card turns the book to that page.

**Desktop:** the book is on the left and the list of six on the right. Hovering or focusing a list item turns to that page. Pointer tilt is at most 6deg.

**Signature motion:** the book opens once (`rotateY` 0 → -160deg on the cover, `flip` token). Page changes cross-fade at 0.3s on the right-hand page.

**Asset task:**
- Render real pages from `public/sample-reports/sample-report-grade-10.pdf` to WebP, one per report part, into `public/samples/pages/`. Use the existing puppeteer or pdf tooling.
- Until the renders exist, use the cover with a "Sample page preview" label. Do not reuse the same cover for all six items.

### 5.6 Journey

**Goal:** five clear steps, scannable in seconds.

- Headline: "From first question to a clear plan". No sub.
- Five steps, each with an icon, a title and one line of 10 words or fewer:
  1. Intake: "Pick grade, board and subjects."
  2. Assessment: "30 untimed modules, done online."
  3. Analysis: "We analyse the results."
  4. Report: "A 56-page report plus a 15-page summary."
  5. Counsellor session: "Optional 45-minute Zoom call to plan next steps."
- Photos psy-06, psy-07 and psy-08 become round 56px thumbnails on steps 2, 4 and 5 on mobile, and 16/10 cards on desktop.
- Remove the "highlight" paragraphs.

**Layout:** vertical on mobile, horizontal from 1024.

**Signature motion:** a progress line draws along the timeline as it scrolls through view (`useScroll` with `target` and `offset: ["start 70%", "end 60%"]`, mapped to `scaleY` on mobile and `scaleX` on desktop). Each step's dot fills when the line reaches it. This is the page's one scroll-linked effect in that viewport. With reduced motion, show the full line.

### 5.7 Sample reports

- Headline: "See a sample report first". Footer note: "Sample reports use a fictional student."
- A segmented control (Grades 7-9, Grade 10, Grades 11-12) with a `layoutId` pill.
- The stage shows:
  - The cover.
  - The title.
  - The page count, or "Executive edition".
  - Three highlights as chips; cut the list from four to three.
  - Two buttons: "View in browser" and "Download PDF". A report that is not built shows a disabled "Coming soon" button.
- Remove the description paragraph.
- Mobile: cover on top, then details. Desktop: cover on the left, details on the right.

**Signature motion:** the cover flips on grade change (`rotateY`, `flip` token, `AnimatePresence mode="wait"`). The text cross-fades at 0.2s. Pointer tilt applies on desktop only.

### 5.8 Family trust

- Headline: "Built for families". No sub.
- Photo `psy-09-family-dialogue` in a MediaFrame (cover; 16/10 on mobile, 4/5 on desktop). Convert it to WebP first; it is a 2.3 MB PNG today.
- Four principles in a 2x2 grid, each a title plus 10 words or fewer:
  - Proven frameworks: "Big Five, VARK and Holland RIASEC."
  - Family dialogue: "Built for parents and students to read together."
  - Guidance, not diagnosis: "Supports choices. Never a label."
  - Private by default: "Answers stay confidential. Never sold."
- Motion: `enter` only.

### 5.9 FAQ

- Headline: "Questions parents ask". No sub.
- Keep the five questions and trim each answer to 40 words or fewer.
- The accordion animates `height: "auto"` at 0.25s with `aria-expanded` and `aria-controls`.
- Keep the FAQPage JSON-LD in sync with the visible answers.

### 5.10 Final CTA

- Use the home page CTA panel with `psy-10-cta-family-cutout`, converted to WebP and flush to the panel bottom.
- Headline: "Start with understanding." Sub: "Join 15,000+ students who found their direction." Buttons: Start assessment, Book a consultation.
- Motion:
  - The photo rises 24px when the panel enters.
  - Magnetic primary button on fine pointers only, max 6px, `spring-ui`.

### 5.11 Sticky mobile CTA bar (new)

- On touch or under 768, a bottom bar appears once the hero's CTAs leave the viewport. It holds "Start assessment" (primary, full width) and a "Sample" text link.
- It hides again when the final CTA section is in view.
- Motion: `y: 100% → 0` with `spring-ui`. Detect visibility with `useInView`, not scroll offsets.
- Height 64px plus `env(safe-area-inset-bottom)`. Add matching bottom padding to the page so it never covers the footer.

## 6. Signature moments summary

| # | Moment | Motion API |
|---|---|---|
| 1 | Hero: profile bars fill | `m.div` variants, `animate()` count-up |
| 2 | Strike-through reveal | `whileInView` + SVG `pathLength` |
| 3 | Phase deck + radar | `AnimatePresence`, `useInView`, `useScroll({ container })` on mobile |
| 4 | Answer moves trait bar | `layoutId`, spring transitions |
| 5 | Book opens | `whileInView` + `rotateY` with `preserve-3d` |
| 6 | Journey line | `useScroll` + `useTransform` |
| 7 | Cover flip | `AnimatePresence mode="wait"` |

Everything not listed here uses `enter` or no motion.

## 7. Component plan

| Work | Files |
|---|---|
| New: motion primitives (`Reveal`, `MaskedLines`, `CountUp`, `SpringBar`, `useFinePointer` re-export) | `src/components/PsychometricAssessment/motion/` |
| New: `PhaseRadar`, `PhaseDeck`, `PhaseSwipeRow` | replace `AssessmentPhaseStickyStepper.tsx` |
| New: `ReportBook` | replaces the image panel in `ReportExplorerSection.tsx` |
| New: `StickyMobileCTA` | added in `page.tsx` |
| Rewrite with Motion, GSAP removed | `HeroSection`, `WhatItIsSection`, `AssessmentJourneySection`, `SampleReportGallery` |
| Copy cuts | `src/content/psychometricContent.ts` only. Components never hard-code copy. |
| Delete (unused) | `HeroPhaseScene3D.tsx`, `AssessmentPhaseScrubber.tsx`, `AssessmentJourney.tsx` |
| Assets | WebP for `psy-09` and `psy-10`; report page renders in `public/samples/pages/` |

`page.tsx` stays a server component; only sections that animate are client components. Keep the metadata, JSON-LD, routes and nav untouched.

### Implementation notes (built 2026-11-11)

- **Hero intro runs in CSS, not Motion.** The H1 mask reveal, sub, CTAs and photo use keyframes in `psychometric.css` so they start before hydration, which protects LCP. The profile card, its bars and the count-up use Motion.
- **Report page images come from the browser viewer, not the PDFs.** The sample PDFs in `public/sample-reports/` were exported without their stylesheet: charts are blank and the cover text is unreadable. The images in `public/samples/pages/` were captured from `/sample-report?type=…` (the `.as-report-page` elements) and cropped to the page card. Fix the PDF export, then re-capture.
- **The radar fills up to the active phase** (not the furthest phase reached), so scrolling back up un-fills later axes.
- **Fallbacks:** `[data-reveal]` (opacity and transform) and `[data-reveal-path]` (SVG draws) are forced to their final state by a `<noscript>` style in `page.tsx` and by `prefers-reduced-motion` in `psychometric.css`.
- **Preflight is off site-wide**, so `psychometric.css` resets borders and button fonts inside `main.psy-main` using zero-specificity `:where()` rules.
- **Scroll-linked values that differ under reduced motion** (the journey line) go through CSS variables and are set after mount. Otherwise Motion's `reducedMotion="user"` causes a hydration mismatch.
- **Screenshots:** `node scripts/capture-psychometric-v2.mjs <outDir> [m390|t768|l1024|d1440]` captures every section plus the phase stage at 0, 33, 66 and 100%.

## 8. Tests

Run the `Design.md` nine-viewport matrix, plus:
1. At 390x844, the H1, part of the photo with the profile card, and "Start assessment" are visible without scrolling.
2. No horizontal page scroll at any width. The swipe rows scroll inside themselves only.
3. The profile card never intersects the forbidden face zone.
4. Phase section screenshots at 0, 33, 66 and 100% show a full card with no empty band below the stage.
5. With JavaScript disabled, every section shows its content.
6. With reduced motion, there are no transitions and all final states are shown.
7. On a coarse pointer, there is no Lenis, tilt, magnetic effect, parallax or sticky deck.
8. Visible word count per section is within the targets in section 2.
9. Lighthouse mobile: LCP under 2.5s, CLS under 0.1, total blocking time under 200ms. No layout shift from the sticky CTA bar.
10. No text under 13px on mobile. No colour outside the `Design.md` token list.
