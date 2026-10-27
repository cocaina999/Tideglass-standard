# 1 · Foundations

## The name

Tideglass names a material, the way Liquid Glass does. Real sea glass is ordinary glass that the tide has tumbled for years until it turns frosted, soft-edged and quietly colored. The standard borrows three things from that shore:

- **Sea glass**: frosted, tinted, matte surfaces you read on.
- **Jelly**: gummy, translucent controls that squish under a finger, the way a jellyfish gives when you touch it.
- **Tide**: the clear, liquid water at the edges, where things show through before they wash away.

The color comes from your brand. Seafoam teal is only the default.

## The one rule

> **Read on sea glass. Touch jelly. See through the tide.**

Every element answers three questions, in this order. The answers decide its look; taste does not.

| Question | Answer picks | Options |
|---|---|---|
| 1. What does the person do with it? | **Material** | Read it → sea glass. Touch it → jelly. See through it → tide. |
| 2. Does content pass underneath it? | **Thickness** | No → Solid. Yes → Thin, Regular or Thick (see [Materials](03-materials.md#thickness)). |
| 3. How important is it? | **Layer** | Foam (most things), Shallow (yours, secondary actions), Lagoon (selected), Deep (the one main action). |

Touch adds a fourth answer: **size picks the tier**, and a role may only make it calmer (see [Touch](04-touch.md)).

## The signature

A Tideglass screen is recognizable from these seven traits. A screen that drops any of them is drifting toward something else.

1. **Frosted, tinted, matte glass** with fine grain on large surfaces. What sits behind looks muted.
2. **A still pastel rim**: one pixel, three pastels at 135°, brightest top-left and bottom-right. It never moves.
3. **Tinted light, never gray shadows**: shadows and caustics carry the brand tint, the way colored glass throws colored light.
4. **Light pooling inside the bottom edge**: thick glass gathers light at its base.
5. **Jelly controls** with a still sheen on top and a darker bottom edge that reads as thickness. They dent on touch and peel on release.
6. **A liquid tide at the scroll edges**: content keeps showing faintly under the bars, then fades into a dense band where the bar's text sits.
7. **One shared selection blob** that glides between choices, stretches on the way, and follows your finger when you drag.

## Not Liquid Glass

Tideglass is an alternative to Apple's Liquid Glass. This is where the two differ.

| | Liquid Glass | Tideglass |
|---|---|---|
| Surface | Clear, bends and magnifies what is behind (lensing) | Frosted, softens what is behind |
| Color | Borrows color from the content | Carries its own soft brand tint; content looks muted |
| Edge | Bright specular highlight that moves with the device | 1px pastel rim that stays still |
| Light | Specular glints | Still sheen on top, glow pooling at the bottom, tinted caustics below |
| Press | Glows and grows | Dents in, sticks for a beat, peels out with one soft rebound |
| Navigation | Controls morph into each other | One jelly blob glides and stretches; you can drag it |
| Scroll edge | Edge effect under bars | The tide: a liquid veil with a dense band for text |
| Text | On clear glass, with adaptive vibrancy | Only on surfaces proven to pass contrast against the worst backdrop |

## Principles

1. **Job before taste.** Material, thickness and layer come from what an element does. Two people building the same screen should land on the same choices.
2. **Still at rest.** Nothing moves unless someone touches it, except live status and an optional hero. Motion is saved for feedback, so it means something when it happens.
3. **Soft, then precise.** Surfaces are soft and squishy; the rules behind them are exact. Every number in this standard is measured, generated or tested.
4. **Small is squishy, costly is firm, readable is still.** The smaller a control, the more it gives. The more an action costs, the firmer it is. The more you read on a surface, the stiller it stays.
5. **Legible over pretty.** When glass and text disagree, the glass gets thicker. A text shadow is never the fix.
6. **Any brand.** Six inputs rebrand everything. If a screen looks wrong after a hue swap, a color is hard-coded.
7. **Everyone.** Reduce motion, reduce transparency, increase contrast and larger text are first-class outcomes, not afterthoughts.

## Rules

- **FD-1** Every element **must** have a material chosen by its job: sea glass to read, jelly to touch, tide to see through.
- **FD-2** Nothing **must** move at rest except live status (typing, progress, "working") and one optional hero.
- **FD-3** A screen **must not** copy Liquid Glass traits: lensing, moving specular highlights, content-borrowed color.
- **FD-4** Brand color **must** enter only through the six brand inputs ([Color](02-color.md)).
- **FD-5** Departing from a *should* **must** come with a reason that can be written down in review.

## The hero (optional)

A product may have one hero: a mascot or mark with its own physics (idle, look, poke, squish, wink). It is the only thing allowed to move when nobody touches anything, the only thing that may make sound, and it never plays sound when the device is on silent. A hero follows the reduce-motion setting by stopping its idle loop while still answering touch.
