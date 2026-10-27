# The Tideglass standard · 1.0

Tideglass is a UI material and touch standard. It defines what surfaces look like, how they respond to a finger, how they move, and how they stay readable and accessible, in any brand color, in light and dark, on the web and on native platforms.

**Read on sea glass. Touch jelly. See through the tide.**

## Chapters

| # | Chapter | What it settles |
|---|---|---|
| 1 | [Foundations](01-foundations.md) | The idea, the three questions, the signature, how it differs from Liquid Glass |
| 2 | [Color](02-color.md) | Six brand inputs, theme roles, dark mode, presets, status colors, contrast pairs |
| 3 | [Materials](03-materials.md) | Ground, sea glass, jelly and tide; layers, thickness, rim, light, grain, stacking |
| 4 | [Touch](04-touch.md) | Dent and peel, tiers, long-press, keyboard, hover, haptics |
| 5 | [Motion](05-motion.md) | Springs, sizes and speeds, enter, exit, arrive, drop, loops |
| 6 | [Navigation](06-navigation.md) | Top bars, tab bars, the blob, docks, sheets, menus, scroll edges |
| 7 | [Layout](07-layout.md) | Shape, corners, space, sizes, safe areas, layering order |
| 8 | [Type and icons](08-type-and-icons.md) | One family, five sizes, two weights; icon grid and stroke |
| 9 | [Components](09-components.md) | Every component as material + layer + thickness + tier, with markup |
| 10 | [Accessibility](10-accessibility.md) | Settings people turn on, contrast, focus, forced colors |
| 11 | [Platforms](11-platforms.md) | The web kit API, SwiftUI and Compose recipes, tokens, performance |
| 12 | [Review](12-review.md) | The ship checklist, the don'ts, how to audit a screen |
| | [Glossary](glossary.md) | Every Tideglass term in one place |
| | [Appendix: contrast report](appendix-contrast.md) | Generated measurements behind every contrast promise |

## How to read this

Each chapter ends in numbered rules such as **TO-4** or **MA-7**. The prefix names the chapter (FD foundations, CO color, MA materials, TO touch, MO motion, NA navigation, LA layout, TY type, IC icons, CP components, AX accessibility, PL platforms). Contrast pairs use **CT-1** to **CT-15**. Rule numbers are stable across minor versions, so a review comment can say "breaks NA-3" and stay meaningful.

The words **must**, **must not**, **should** and **may** carry their [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) meanings:

- **must** / **must not**: required for conformance.
- **should**: the default; depart from it only with a reason you can state.
- **may**: allowed, not required.

## Conformance

A screen is **Tideglass-conformant** when it meets every *must* in chapters 2 to 10. A product is conformant when every screen is. The [review checklist](12-review.md) lists every *must* in one place.

The web kit in [`kit/`](../kit/) implements the standard. Using it is not required; meeting the rules is. `npm run check` verifies the kit against this spec (contrast, springs, tokens, docs), and `npm run smoke` drives it in a real browser.

## Versioning

The standard follows [semantic versioning](https://semver.org):

- **Major**: a rule changes in a way that makes a conformant screen non-conformant, or a token or class is renamed or removed.
- **Minor**: new rules that only add, new components, new tokens.
- **Patch**: clarifications, fixes and wording that change no outcome.

The kit, the tokens and this spec always share one version number.
