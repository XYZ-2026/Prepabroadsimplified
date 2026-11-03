# Clarvo Home Page: Design Spec v2.1

This replaces the earlier DESIGN.md and the first copy of v2. Where they differ, this file wins.

Changes from v1:
- The blue path line across the hero is removed (boss decision).
- Hero chips may no longer cover faces. Face-safe zones are defined below.
- The hero photo is larger and bleeds toward the viewport edge.
- Every photo goes through one MediaFrame component with fixed ratios and focal points.
- The consultation CTA photo is anchored to the panel bottom and sized by rule.
- A real tablet spec and test matrix are added.
- v2.1: nav, hero photo and CTA rules corrected for 1024 to 1279 wide, where the v2 numbers did not fit.

Standing rules:
- The logo marquee is LOCKED. Never edit its code, speed or content.
- Keep all routes, forms, tracking and SEO tags.
- No new statistics or claims. Reuse numbers already on the site.

## 1. Tokens

| Token | Hex | Use |
|---|---|---|
| clarvo-blue | #1258DE | Buttons, links, highlights |
| midnight | #171822 | Dark panels, pinned story, footer |
| paper | #F5F7FB | Page background |
| sky | #E6EDFF | Light blue surfaces, photo backdrops |
| ink | #12131C | Text on light |
| muted | #5B6275 | Secondary text on light |
| line | #DDE3F0 | Borders on light |

Type: DM Sans (700 headlines, 400/500 body and UI). Anton only for the giant "PATH" word. Sentence case. No all-caps labels, no monospace, no tracked eyebrows, no abbreviations in labels ("Internships", not "INT").

Shape: pills for chips, 28px for large panels, 20px for photos, 14px for small cards. One elevation shadow: `0 24px 60px -24px rgba(18,88,222,.25)`.

## 2. Breakpoints and layout modes

| Mode | Width | Hero layout |
|---|---|---|
| Mobile | under 768 | Single column |
| Tablet portrait | 768 to 1023 | Single column, photo centred below text |
| Tablet landscape / small laptop | 1024 to 1279 | Two columns, 6 / 6 |
| Desktop | 1280 and up | Two columns, 5 / 7, photo bleeds right |

Rules for every mode:
- Gate hover-only effects, mouse parallax, Lenis and pinned scroll with `(hover: hover) and (pointer: fine)`, not by width. An iPad in landscape is 1024 to 1366 wide but is a touch device.
- Use `svh` or `dvh`, never plain `vh`, for full-height sections.
- No horizontal scroll at any width. No fixed pixel widths larger than the container.
- Type uses clamp(). Section padding uses clamp().
- The nav shows the menu button below 1280. Build the header as a three-column grid (logo, links, actions) so items cannot overlap. No absolute centring of the links.

## 3. Hero

```
Desktop (1280+)
+------------------------------------------------------------------+
| nav                                                              |
|                                                                  |
|  Find the path              P  A  T  H   (Anton, sky, behind     |
|  that fits your             +--------------------------------+   |
|  child.                     | chip                  chip     |   |
|  Sub copy                   |        group photo, large      |   |
|  [Start free assessment]    |   (faces: no overlays here)    |   |
|  [See a sample report]      |                       chip     |   |
|  guided | careers | clearer +--------------------------------+   |
+------------------------------------------------------------------+
  logo marquee (unchanged), overlapping the photo's flat bottom
```

- Left-aligned text. Vertically centred in a hero that is at least `100svh` minus the nav.
- Photo: `02-group-cutout.webp`. Desktop (1280 and up): width `clamp(520px, 54vw, 1000px)`. Tablet landscape (1024 to 1279): width equals its column, about 420 to 560px. Do not exceed 1000 CSS px anywhere; the source is 1448px wide and would turn soft.
- The photo sits flush on the hero's bottom edge and the marquee strip overlaps its flat bottom. Fade the left and right edges with `mask-image: linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)`.
- "PATH": Anton, sky colour, sized so the word is the width of the photo, behind the photo, centred. The top half of the letters shows above the heads, the lower half hides behind them. It must not be clipped by the viewport or by a container. If it cannot be shown without clipping, remove it.
- NO path line. No SVG line of any kind over or near the photo.

### Face-safe zones for 02-group-cutout

Values are percentages of the photo box (x from left, y from top). Estimated from the render. Widen each by 3% when testing.

| Face | x | y |
|---|---|---|
| Top-left girl | 6 to 16 | 19 to 32 |
| Front-left boy (headphones) | 20 to 30 | 38 to 50 |
| Boy with glasses | 32 to 41 | 34 to 45 |
| Middle girl | 47 to 57 | 25 to 40 |
| Front girl (curly hair) | 56 to 67 | 45 to 59 |
| Back boy | 68 to 77 | 18 to 30 |
| Front-right boy | 78 to 87 | 40 to 51 |
| Top-right girl (glasses) | 86 to 94 | 25 to 36 |

Rule: nothing overlays the photo between y = 15% and y = 62%. Chips may sit only in the top band (y from -6% to 10%) or the bottom band (y from 72% to 94%), or outside the photo box.

### Chips (labelled "Sample report")

| Chip | Position |
|---|---|
| Stream fit: Science + Computing | Top band, left 2% |
| Strength: Analytical reasoning | Top band, right 4% |
| Next step: Talk to a counsellor | Bottom band, right 2% |

Max width 220px, text 13px. Tablet portrait: show two chips. Mobile: show one (bottom band).

### Hero motion (once, about 1.8s)

1. Headline lines slide up out of masks, 80ms stagger.
2. "PATH" scales from 1.1 to 1 and fades in.
3. Photo rises 6% and fades in.
4. Chips pop in one at a time.
5. CTAs and trust row fade in.

After load, on fine-pointer devices only: slow mouse parallax, 10px on the word, 18px on the photo. No parallax on touch.

## 4. Image system

Every photo is rendered through one MediaFrame component. No section sizes an image by hand.

| Mode | Behaviour |
|---|---|
| cover | Frame has a fixed `aspect-ratio`. Image is `absolute inset-0 size-full object-cover` with an `object-position` focal point. The image always covers the frame. No empty band. |
| cutout | Frame has a sky or midnight backdrop. Image is anchored to the bottom, centred, height 100% of the frame, width auto. |

| Placement | Photo | Mode | Ratio (desktop) | Ratio (tablet portrait) | Focal point |
|---|---|---|---|---|---|
| Bento: assessments | 06-mentoring-laptop | cover | 16 / 10 | 16 / 10 | 50% 45% |
| Bento: entrepreneurship | 08-building-product | cover | 16 / 10 | 16 / 10 | 55% 50% |
| Grades 7-9 | 07-brand-moodboard | cover | 4 / 5 | 16 / 10 | 62% 55% |
| Grades 9-10 | 04-girl-win-cutout | cutout on sky | 4 / 5 | 16 / 10 | n/a |
| Grades 11-12 | 05-presenter-cutout | cutout on sky | 4 / 5 | 16 / 10 | n/a |
| Consultation CTA | 03-celebrate-cutout | cutout (see section 5) | n/a | n/a | n/a |

Rules:
- A media frame is never taller than the content column next to it, and has no visible empty area.
- The laptop screen must stay visible in the Grades 7-9 photo.
- The girl in 04 vanishes on clarvo-blue. Use sky or midnight only.
- Use `width` and `height` attributes, `sizes`, and lazy loading everywhere except the hero photo.

## 5. Consultation CTA

- Two-column layout only at 1280 and up. Below 1280 (tablet landscape, tablet portrait, mobile) the panel stacks: text on top, photo below.
- Panel: clarvo-blue, 28px radius, `min-height: 480px` at 1280 and up.
- Text column about 40%, photo column about 60%. Headline `clamp(2.25rem, 3.4vw, 3.25rem)`, at most 3 lines on desktop.
- Photo: `03-celebrate-cutout.webp`, absolutely positioned at `bottom: 0`, right 3%, width up to 60% of the panel. The flat bottom of the photo sits exactly on the panel's bottom edge. The photo is at least 96% of the panel height; heads may break out of the top edge by up to 8%.
- Soft radial glow behind the group. No hard shadow.
- Trust row: three items with icons and spacing, no middle dots between them.
- Stacked layout (below 1280): photo full width of the panel, bottom flush, heads may break out of the top edge of the photo area but the photo never overlaps the text.

## 6. Section map

Unchanged from v1 except as noted above. Sections 1 to 14 as before. Use full words in all chips and labels.

## 7. Test matrix (required)

Check every change at: 390x844, 768x1024, 820x1180, 834x1194, 1024x768, 1180x820, 1366x1024, 1440x900, 1920x1080.

Pass criteria:
1. No horizontal scroll.
2. No chip or label overlaps a face-safe zone.
3. Every MediaFrame has no empty band (cover) or sits flush at the bottom (cutout).
4. "PATH" is fully visible or removed.
5. The CTA photo meets the size and flush rules in section 5.
6. Nothing is clipped at the right edge.
7. Pins and parallax are off on touch devices.