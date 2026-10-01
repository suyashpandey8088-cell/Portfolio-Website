# Suyash Pandey — Scroll-Driven Portfolio

A premium, scroll-controlled personal site for an AI & Data Science student / developer.
Every major transition is **driven by scroll position**, not by time: you scroll, the
animation advances; you stop, it stops; you scroll back, it rewinds.

## Stack

| Concern    | Choice                                   | Why |
| ---------- | ---------------------------------------- | --- |
| Framework  | Next.js 14 (App Router) + TypeScript     | Static prerender, image optimisation, code splitting |
| Animation  | GSAP + ScrollTrigger                     | Scrubbed timelines are the only reliable way to bind motion to scroll |
| Smoothing  | Lenis                                    | One rAF loop shared with GSAP's ticker — no competing scroll loops |
| Styling    | CSS Modules + design tokens              | Zero runtime cost, scoped, no utility-class noise |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## The scroll architecture

A single Lenis instance is driven by `gsap.ticker`, and `ScrollTrigger.update` is called
from Lenis's scroll event (`components/SmoothScroll.tsx`). That means smoothing, every
scrubbed timeline and every pin share one frame loop.

| Section | Scroll mechanic |
| ------- | --------------- |
| **Hero** | 300vh sticky stage, 3 stages on one scrubbed timeline: name scales down / tracks out / dims → an orb emerges from behind (0.5 → 1 → 1.5, de-blurring, rotating) → the orb stays on screen and the natural sticky release hands over to About (no hard cut) |
| **Rail** | Fixed 01–06 indicator; the fill line is tweened with `quickTo` (never snapped), active item set by per-section triggers. Becomes a bottom bar + label on mobile |
| **About** | Sticky heading, four content states (LEARN / BUILD / EXPERIMENT / CREATE) cross-faded by scroll progress with blur + vertical offset; progress ticks mirror the active state |
| **Skills** | Pinned stage; each category enters, its cards arrive one by one (scale 0.72 → 1, slight counter-rotation, de-blur), drift at differing speeds, then the next category pushes the previous one toward the viewer and away |
| **Projects** | Pinned section where vertical scroll is translated 1:1 into horizontal track travel. Per-card scale / lift / opacity / blur are derived from each card's distance to viewport centre, so the centre card always dominates |
| **Project detail** | When the last card reaches centre, it *unfolds*: a `clip-path` inset seeded from that card's measured on-screen box opens to full screen, the image de-zooms, copy staggers in |
| **Experience** | Timeline spine illuminates 0 → 100% in lockstep with scroll; entries scale 0.95 → 1 and earlier ones recede but stay readable |
| **How I think** | BUILD → TEST → LEARN → IMPROVE, one word per scroll slot, with a full-frame wash when the last word lands |
| **Contact** | Background lifts, heading scales 0.8 → 1, words stagger from masks, button rises, social links follow |

### Why it doesn't jitter

- Only `transform`, `opacity`, `filter` and `clip-path` are animated — no width/top/left.
- The project gallery caches card geometry on `ScrollTrigger` refresh and writes through a
  batched `quickSetter`: **zero layout reads during scroll**.
- Blur radii are quantised (a new blur value forces a re-rasterise).
- Grain + vignette are one composited layer with no `mix-blend-mode`; `backdrop-filter` is
  reserved for small chrome, not large cards.
- Pinned triggers carry `refreshPriority` above the scroll-spy triggers so positions are
  always measured after pin spacing exists.

Measured in a headless, **software-rendered** Chromium (no GPU) over the heaviest
transitions: a median frame time of **16.7 ms (60 fps)**, down from 50 ms before the
pass above.

## Responsive strategy

Mobile is re-choreographed, not shrunk — via `gsap.matchMedia`:

- pins and the horizontal gallery are replaced by an honest vertical stack
- reveals become short, once-only scrubs; parallax is reduced
- no custom cursor on touch; the rail becomes a bottom progress bar
- `prefers-reduced-motion: reduce` disables pinning and scrubbing entirely — the page
  collapses to ~8,300 px of normal document flow with every element at its final state.

## Accessibility

Semantic landmarks, skip link as the first tab stop, logical tab order, visible 2px focus
rings, alt text on every image, reduced-motion support, and no content that exists only
inside an animation.

## Structure

```
app/            layout, page composition, design tokens (globals.css)
components/     one component + one CSS module per section
lib/            gsap singleton, section metadata, project data, SSR-safe layout effect
public/projects/ project imagery
```

## Making it yours

- Copy and links: `components/Contact.tsx`, `components/Footer.tsx` (placeholder email /
  social URLs), `lib/projects.ts`, `components/Experience.tsx`.
- Accent colour and rhythm: the `:root` tokens in `app/globals.css`.
- Pacing: each section's `height` (e.g. `.skills { height: 480vh }`) is the scroll budget
  for its timeline — raise it to slow a sequence down, lower it to speed it up.
