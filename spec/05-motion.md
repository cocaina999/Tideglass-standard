# 5 · Motion

Tideglass moves like something soft in water: quick to respond, slow to settle, never bouncing more than once. Everything travels on one of three springs, and size decides which.

## The springs

A spring is two numbers: **response** (how long one swing takes, in seconds) and **damping** (1 = no overshoot, lower = more bounce). The same pair drives every platform.

| Spring | Response, damping | Overshoot | Settles | Used for |
|---|---|---|---|---|
| **Glide** | 0.40s, 0.75 | 2.8% | 520ms | Anything small that travels: the blob, a switch thumb, a menu growing, a turning icon |
| **Firm** | 0.30s, 1.0 | none | 360ms | Big things and costly things: sheets, pages, Firm presses |
| **Peel** | 0.34s, 0.45 | 20% | (keyframed, 440ms) | Native release of a press (see below) |

`npm run springs` prints each one for every platform, generated from the same math:

| Spring | CSS | SwiftUI | Compose | Motion (web) |
|---|---|---|---|---|
| Glide | `var(--tg-glide)` over 520ms | `.spring(response: 0.4, dampingFraction: 0.75)` | `spring(dampingRatio = 0.75f, stiffness = 247f)` | `{ type: "spring", stiffness: 247, damping: 23.6 }` |
| Firm | `var(--tg-firm)` over 360ms | `.spring(response: 0.3, dampingFraction: 1)` | `spring(dampingRatio = 1f, stiffness = 439f)` | `{ type: "spring", stiffness: 439, damping: 41.9 }` |
| Peel | `@keyframes tg-peel`, 440ms | `.spring(response: 0.34, dampingFraction: 0.45)` | `spring(dampingRatio = 0.45f, stiffness = 342f)` | `{ type: "spring", stiffness: 342, damping: 16.6 }` |

In CSS, `--tg-glide` and `--tg-firm` are `linear()` easings that trace the spring curve point by point; browsers without `linear()` fall back to a close cubic-bezier. `npm run check` fails if a curve drifts from its spring.

**The peel is keyframed on every platform**, not a raw spring, because the press "sticks" before it springs: dent pose → peel pose (38%) → settle pose (70%) → rest. Native code should play the same poses (SwiftUI `withAnimation` steps, Compose `keyframes`); the Peel spring is the closest single-spring fallback.

## Size decides the spring

> **Small things glide. Big things are firm.**

Anything larger than half the screen (sheets, pages, full-width panels) moves on Firm: a 3% overshoot on a 700px sheet is a 20px bounce, which reads as a mistake. Small things (blobs, thumbs, menus, chips) move on Glide, where the same overshoot reads as softness.

## Moments

| Motion | Spec |
|---|---|
| **Dent** | 120ms, `cubic-bezier(.3,.7,.4,1)` |
| **Peel** | 440ms keyframes (see [Touch](04-touch.md)) |
| **Glide** | Glide spring, 520ms |
| **Enter** (menus, popovers, the reaction picker) | Grow from what opened them: scale 0.92 → 1 on Glide, fade in over 160ms. They arrive with one soft wobble. |
| **Enter** (sheets) | Rise from the bottom edge on Firm, 360ms |
| **Exit** | 180ms `cubic-bezier(.4,0,1,1)` to scale 0.96 and fade (sheets: slide down, 240ms). No overshoot. Leave quietly. |
| **Arrive** (a new message, a new chip) | Drip from its tail corner: 0.6 → 1.04 → 0.98 → 1 in 450ms |
| **Drop** (reactions, badges, a swapped icon) | 0.25 → 1.16 → 0.93 → 1 in 500ms |
| **Stretch** (the blob, a switch thumb) | 14% longer and 6% thinner along the travel, peaking at 35% of a 420ms pass |
| **Tide rise** | The tide fades in over the first 40px of scroll when `data-tide="auto"` |

Classes: `.tg-enter`, `.tg-exit`, `.tg-arrive`, `.tg-drop`. The JS helpers `Tideglass.open()` and `Tideglass.close()` add and clear them, and set the transform origin from the opener.

## Loops

Nothing loops at rest. Two exceptions:

1. **Live status** while work is happening: typing dots (`.tg-typing`), progress, "Looking for it…". Stop the loop the moment the work stops.
2. **The hero**, if the product has one (see [Foundations](01-foundations.md#the-hero-optional)).

## Reduce motion

When the person asks for less motion:

| Normally | With reduce motion |
|---|---|
| Dent squash | Dim to 85% opacity, plus the tint |
| Peel, lean, stretch, pop | None |
| Glide and Firm | 150ms ease |
| Enter, arrive, drop | Fade in, 150ms |
| Exit | Fade out, 150ms |
| Typing dots bounce | Typing dots pulse in opacity |
| Blob scrub stretch | The blob still follows the finger, without stretching |

## Rules

- **MO-1** Motion **must** use the Glide, Firm or Peel definitions; no other springs or bounces.
- **MO-2** Things larger than half the screen **must** move on Firm.
- **MO-3** Exits **must not** overshoot.
- **MO-4** Overlays **must** grow from the element that opened them.
- **MO-5** Only live status and the hero **may** loop, and status loops **must** stop when the work stops.
- **MO-6** Color and opacity **must not** bounce; only position, scale and shape may overshoot.
- **MO-7** With reduce motion, nothing **may** squash, stretch, lean or overshoot, and every transition **must** finish within 150ms.
- **MO-8** Motion **must** animate transform and opacity (and the tint property), never layout properties such as width on large surfaces. The blob's own size easing is the one exception.
