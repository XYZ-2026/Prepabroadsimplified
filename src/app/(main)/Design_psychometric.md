# Clarvo Psychometric Page: Design Spec

Route: `/psychometric-assessment` (already exists; this is a full enhancement).

This file adds page-specific rules. It inherits tokens, type, shapes, MediaFrame, breakpoints and the test matrix from `DESIGN.md` (v2.1). Where the two differ, this file wins on this page.

Standing rules:
- The logo marquee on the home page is not part of this page. Do not touch it.
- Keep routes, forms, tracking and SEO tags.
- Do not invent facts. Anything in section 1 marked "owner" renders as nothing until the owner fills it in.

## 0. Goals

1. The 5-second test: a parent who sees only the hero can say what the test is: a 30-module online test for Grades 7 to 12 that measures personality, reasoning, study habits and interests, and turns the results into a stream and career report.
2. The four phases are explained with motion that always shows content (no blank states).
3. A visitor can open any of three sample reports: Grades 7-9, Grade 10, Grades 11-12.
4. Conversion: "Start assessment" and "Book a consultation" (use existing routes).

## 1. Content facts

| Fact | Status | Value |
|---|---|---|
| Modules | Known | 30 |
| Phases | Known (Class 10 report) | 4: Personality architecture (modules 1-10), Cognitive processing (11-20), Learning & execution (21-28), Stream & career alignment (29-30) |
| Class 10 full report | Known | 56 pages. Executive edition: 15 pages |
| Frameworks used | Known (Class 10 report) | Big Five, MBTI-style preferences, VARK, Holland RIASEC, aptitude battery |
| Counselling session | Known (home page) | Flexible 45-minute Zoom sessions |
| Students guided | Known (home page) | 15,000+ |
| Test duration | Owner | `{{duration}}` |
| Number of questions | Owner | `{{questions}}` |
| Free vs paid, price | Owner | `{{pricing}}` |
| Parent questionnaire | Owner | `{{parent_role}}` |
| Report delivery time | Owner | `{{delivery}}` |
| Phases and module counts for Grades 7-9 and 11-12 | Owner | `{{phases_7_9}}`, `{{phases_11_12}}` |
| Page counts of the 7-9 and 11-12 sample reports | Owner (until built) | `{{pages_7_9}}`, `{{pages_11_12}}` |

Phase names must match the report: "Personality architecture", "Cognitive processing", "Learning & execution", "Stream & career alignment". Do not use "Academic Execution" or "Leadership & Alignment".

### Claims policy
- Remove "Zero subjective bias" and any use of "objective", "empirical" or "verified" that you cannot back up. The report itself says results depend on honest self-report.
- Do not claim norms ("50,000+"), IRT calibration, or APA/ITC compliance unless the owner confirms them in writing.
- Use "guidance, not diagnosis". No clinical language.
- Sample-report copy must not say "real, unedited reports" while also saying the data is fictional. Say: "Sample reports use a fictional student."
- Facts marked Owner: if the value is missing, hide the element and list it in the agent's report.

## 2. Visual rules for this page

- Colours: clarvo-blue, midnight, paper, sky, ink, muted, line. Nothing else.
- Remove the green and red "is / is not" cards, and the green, yellow and purple icon tiles in the trust section.
- Sentence case. No all-caps eyebrows, no monospace.
- Sizes: body at least 17px, small labels at least 13px. No text smaller than 12px anywhere.
- One shape system from DESIGN.md. No grid of six identical icon cards anywhere on the page.

## 3. Section map

| # | Section | Treatment |
|---|---|---|
| 1 | Hero | Explains the test at a glance (section 4) |
| 2 | What it is / is not | Split statement with a strike-through reveal (section 5) |
| 3 | Four phases | Sticky stepper, always-visible content (section 6) |
| 4 | What a question looks like | Interactive samples (section 7) |
| 5 | What the family receives | Report explorer (section 8) |
| 6 | The journey | Five-step timeline with photos (section 9) |
| 7 | Sample reports | Grade switcher, real cover renders, viewer (section 10) |
| 8 | Family trust | Photo plus four plain principles (section 11) |
| 9 | FAQ | Accordion, every answer written, FAQ schema |
| 10 | CTA | Same panel as the home page, new photo |

## 4. Hero

```
+------------------------------------------------------------------+
| nav                                                              |
|                                                                  |
|  Know how your child        +--------------------------------+   |
|  thinks, learns and         |  profile card (top band)       |   |
|  decides.                   |                                |   |
|                             |   photo: parent + student      |   |
|  Sub copy (2-3 lines)       |   with a laptop, large         |   |
|                             |                                |   |
|  [Start assessment]         |  sample question card (bottom) |   |
|  [View a sample report]     +--------------------------------+   |
|  Book a consultation                                             |
|                                                                  |
|  1 Student answers  >  2 We build a profile  >  3 Family gets a plan |
|  30 modules | 4 phases | {{duration}} | {{pages}}-page report     |
+------------------------------------------------------------------+
```

Copy:
- Chip: "Psychometric assessment, Grades 7 to 12" (sentence case).
- H1: **Know how your child thinks, learns and decides.**
- Sub: A 30-module online assessment that measures personality, reasoning, study habits and interests, then turns the results into a clear stream and career roadmap your family can talk through together.
- CTAs: Start assessment (primary), View a sample report (secondary), Book a consultation (text link).
- Three-step line under the CTAs: "Your child answers" > "We build a profile" > "Your family gets a plan". Each step has a small animated icon.
- Facts strip: 30 modules, 4 phases, then only the Owner facts that exist.

Photo: `psy-01-hero-family-cutout.webp` (cutout), width `clamp(520px, 52vw, 960px)` at 1280 and up, flush on the bottom edge of the hero, edge-faded left and right as on the home page.

Overlay cards (two only):
- Profile card in the top band: three trait bars (for example, Conscientiousness, Reasoning, Openness) with a small label "Sample result".
- Sample question card in the bottom band: one question with a five-point scale, labelled "Sample question".
- Faces rule from DESIGN.md applies: no overlay may cover a face. Create `faceZones-psychometric.json` from the final photo, widen each box by 3%, and test against it.

Hero motion (once, about 1.8s, Lenis not yet active):
1. H1 lines slide up from masks, 80ms stagger.
2. Photo rises 6% and fades in.
3. Profile card slides in; its bars fill.
4. Question card slides in; the "answer" selects itself, then the profile bars nudge.
5. Three-step line highlights each step in turn, then rests.

The orbit diagram currently in the hero is removed.

## 5. What it is / is not

- Left: "A psychometric assessment is" with three plain statements. Right: "It is not" with three plain statements. Use ink and blue only.
- Motion: as the section enters, each "It is not" statement is struck through by a drawn line; then the "It is" statements fade in with a 60ms stagger. Static fallback shows both lists with the strike-through already drawn.
- Copy must be plain. Example "is" lines: a structured set of questions about how a student thinks, behaves and learns; compared with students of the same age; used to guide, not to label. Example "is not": a school exam, an IQ test, a medical or clinical diagnosis.

## 6. Four phases (signature scroll moment)

The existing pinned section is removed. Build a sticky stepper instead.

- Structure: a wrapper about `4 x 90svh` tall. Inside, a left rail (progress line, four phase titles with module ranges) and a right stage that uses `position: sticky; top: calc(var(--nav-height) + 16px)`. No ancestor of the sticky element may use `overflow: hidden` or `auto`; use `overflow: clip` if needed.
- Active phase comes from IntersectionObserver or ScrollTrigger `onToggle`. Do not scrub the whole section off scroll position; no state may depend on exact scroll offsets.
- Right stage per phase: photo (`psy-02` to `psy-05`), phase name, module range, "What it measures" (three short lines), "What the report shows" (one example output), and a profile card that gains one more filled area per phase (radar polygon draws across four phases).
- Transitions: cross-fade 350ms, photo scale 1.04 to 1, text lines slide 16px. Progress rail line fills as phases pass.
- Phase 1 content is visible on first paint, before any JS runs.
- Touch devices, reduced motion, or width under 1024: no sticky. Stack four phase cards; each fades up once on entering.
- Tabs: each phase title is a button that scrolls to its phase (keyboard accessible).

| Phase | Name | Modules | Photo |
|---|---|---|---|
| 1 | Personality architecture | 1 to 10 | psy-02-phase1-personality |
| 2 | Cognitive processing | 11 to 20 | psy-03-phase2-cognitive |
| 3 | Learning & execution | 21 to 28 | psy-04-phase3-learning |
| 4 | Stream & career alignment | 29 to 30 | psy-05-phase4-alignment |

For grades 7-9 and 11-12, show the module ranges only after the owner confirms them (`{{phases_7_9}}`, `{{phases_11_12}}`). Until then, add a small switcher only if the data exists; otherwise show the Class 10 structure labelled "Shown for Grade 10".

## 7. What a question looks like

- Three tabs: Personality (a five-point scale statement), Reasoning (a pattern-completion puzzle built in SVG), Study habits (a short scenario with three options).
- Visitors can answer. The answer moves a small live profile bar beside the question.
- All items are written fresh for the website and labelled "Sample question". Do not copy real test items.
- Fine pointers: options respond with a soft press scale. Touch: tap states only.

## 8. What the family receives

- Left: a large report page image. Right: a list of six items (Stream fitment, Cognitive ceiling & aptitude, Learning style (VARK), Career clusters, Parent guide, 90-day plan).
- Hovering or focusing an item swaps the page image with a 300ms cross-fade and a slight 3D tilt (fine pointers only).
- Images are real renders from the final sample PDFs (section 10). Until they exist, use a neutral placeholder labelled "Sample page preview".

## 9. The journey

Five steps as a horizontal timeline: Profile and grade intake, 30-module assessment, Analysis, Your report, Counsellor session. Photos: `psy-06`, `psy-07`, `psy-08` on steps 2, 4 and 5. Copy: plain words. Replace "Multi-dimensional algorithmic synthesis" with "We analyse the results". A line draws across the timeline as steps enter. Below 1024 it becomes a vertical list.

## 10. Sample reports

- A segmented control: Grades 7-9, Grade 10, Grades 11-12.
- A stage shows: the cover (real render of page 1), five page thumbnails you can click to preview, what is included (written from the real report), page count, and two buttons: View in browser, Download PDF.
- Switching grade: cover swaps with a 400ms flip; text cross-fades.
- Files: `/public/samples/clarvo-sample-grade-7-9.pdf`, `clarvo-sample-grade-10.pdf`, `clarvo-sample-grade-11-12.pdf`, plus WebP page renders in `/public/samples/pages/`.
- Samples are pre-rendered static files. Never show a "Generating" loader for a sample.
- A report not yet built shows a disabled button labelled "Coming soon", never a dead link. List which are missing in the agent's report.
- Samples use fictional students with realistic scores: varied (not all 70 to 90), no tied top streams, intake fields filled.
- Footer line: "Sample reports use a fictional student."

## 11. Family trust

- Photo `psy-09-family-dialogue.webp` in a MediaFrame (cover, 4 / 5 desktop, 16 / 10 tablet).
- Four principles as a plain list with one-line text: Standardized frameworks (name the real ones), Family dialogue, Guidance, not diagnosis, Data privacy (only claims you can back up).
- No coloured icon tiles.

## 12. FAQ and CTA

- FAQ: every question has a written answer. Add FAQPage JSON-LD. Accordion buttons use `aria-expanded` and `aria-controls`. Animate height 250ms.
- Unknown answers (duration, preparation, parent role): use the Owner facts; hide the question until answered.
- CTA: the same component as the home page, with `psy-10-cta-family-cutout.webp`, anchored flush to the panel bottom.

## 13. Motion system

Stack: Lenis, GSAP, ScrollTrigger (check what is already installed). Sync Lenis to ScrollTrigger.

Signature moments (the ones that must be perfect):
1. Hero sequence.
2. Strike-through reveal.
3. Phase stepper.
4. Question demo.
5. Sample report grade switch.

Supporting motion: line-mask headline reveals, one-time number count-ups, SVG draw for the radar and timeline, magnetic buttons (fine pointers), cursor-aware tilt on report images (fine pointers), progress rail, accordion height.

Rules:
- Transform and opacity only. `will-change` only during an animation.
- Durations 300 to 800ms. Enters use `power3.out`; the hero uses `expo.out`. Stagger 60 to 80ms. Travel 16 to 32px.
- Lenis, tilt, magnetic and parallax run only when `(hover: hover) and (pointer: fine)`.
- Reduced motion: final state, no animation.
- Kill every trigger on unmount. Refresh ScrollTrigger after fonts and images load.
- At most two scroll-linked triggers active at once. No WebGL, no video backgrounds.
- No long main-thread task above 50ms. Test on a throttled mid-range phone profile.

## 14. Image slots

| File | Use | MediaFrame |
|---|---|---|
| psy-01-hero-family-cutout | Hero | Cutout, flush bottom |
| psy-02 to psy-05 | Phase stage | Cover, 4 / 5 desktop, 16 / 10 tablet |
| psy-06, psy-07, psy-08 | Journey steps | Cover, 16 / 10 |
| psy-09-family-dialogue | Family trust | Cover, 4 / 5 desktop, 16 / 10 tablet |
| psy-10-cta-family-cutout | CTA | Cutout, flush bottom |

Sample report covers and page images are renders of the real PDFs, never AI images.

## 15. Tests (required)

Run the nine-viewport matrix from DESIGN.md plus:
1. No horizontal scroll at any width.
2. Hero overlays never intersect `faceZones-psychometric.json`.
3. Phase stepper: screenshots at 0, 33, 66 and 100% scroll through the section show content every time. No blank stage.
4. All three sample PDFs and viewers return 200, or the button is disabled and labelled.
5. No text under 12px. No colour outside the token list.
6. Lenis, tilt, magnetic and sticky behaviours are inactive when the pointer is coarse.
7. Lighthouse mobile: LCP under 2.5s, CLS under 0.1.
8. FAQ schema validates. All images have alt text.