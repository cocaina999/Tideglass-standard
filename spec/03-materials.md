# 3 · Materials

A Tideglass screen is a ground with three materials on it. This chapter defines each one exactly, then the two dials every glass surface has: **layer** (how much tint) and **thickness** (how much you see through).

## Ground

The ground is the page behind everything: a pale base (`--tg-ground`, about 10% tint) with four very soft pools of color and an optional fine grain. Glass needs gentle color behind it to read as glass; on a flat ground it looks like plastic.

- Pools are large radial washes (about 40% of the viewport each) of the tint and the three rim pastels, placed near the corners.
- Pools and grain sit on fixed layers, so scrolling never repaints them.
- Apply with `.tg-ground` on `<body>`; add `.tg-grain` for the frost grain.

## Sea glass

**For reading and holding.** Cards, lists, rows, bubbles, sheets, menus, toasts, fields, the segmented track.

| Part | Recipe |
|---|---|
| Body | Vertical gradient of the layer's two stops (`--_c1` → `--_c2`), at the thickness opacity |
| Rim | 1px, `--tg-rim` gradient at 135°: white → rim-a → rim-b → rim-c → white, at `--tg-rim-o` (0.8 light, 0.42 dark) |
| Inner light | A 1px `--tg-hairline` inside the top edge, and `--tg-glow` pooling inside the bottom edge (inset, 14px up, 24px soft) |
| Shadow | Two tinted layers: a 1–2px contact shadow and a soft 28px drop, both `--tg-shade` |
| Grain | Fine fractal noise at 5% on large surfaces only (`.tg-grain`) |
| Finish | Matte. No sheen, no moving highlight |

Sea glass is still. It never squashes, wobbles or blurs content inside it.

Class: `.tg-glass` (or any reading component: `.tg-card`, `.tg-list`, `.tg-bubble`, `.tg-sheet`, `.tg-menu`, `.tg-toast`, `.tg-field`, `.tg-seg`).

## Jelly

**For touching.** Buttons, icon buttons, the orb, chips, tiles, tab bars, the composer, pills, avatars, thumbs, the blob.

Jelly is sea glass that is thicker, gummier and lit from inside. It adds four things:

| Part | Recipe |
|---|---|
| Sheen | A still, broad white ellipse over the top ~40% (`--tg-sheen`, 55% light / 10% dark). It never follows the pointer. |
| Thickness edge | A 1px `--tg-edge` line inside the bottom edge |
| Glow | Stronger light pooling inside the bottom edge (inset 10px, 18px soft) |
| Caustic | The drop shadow is tinted light, not shade: `0 8px 20px -10px var(--tg-caustic)`, the colored light that a gummy throws on the table |

Optional: **prism** (`.tg-prism`, on by default for `.tg-tile`). Light passing through thick glass splits into the three rim pastels and pools softly in the bottom corners, at `--tg-prism-o` (50% light, 22% dark). Use it on large jelly only (tiles, hero cards); never on small controls.

Jelly is the only material that moves under a finger (see [Touch](04-touch.md)).

Class: `.tg-jelly` (or any touch component: `.tg-btn`, `.tg-icon-btn`, `.tg-orb`, `.tg-chip`, `.tg-tile`, `.tg-tabbar`, `.tg-composer`, `.tg-pill`, `.tg-avatar`, `.tg-thumb`, `.tg-blob`).

## Tide

**For seeing through.** The liquid layer at scroll edges: under the top bar, around the floating tab bar and composer, under a caption on a photo. Content keeps showing faintly through it, the way a Telegram chat shows its messages under the header.

A tide is not a surface. It has no rim, no shadow, no grain and no press.

| Part | Recipe |
|---|---|
| Veil | A gradient of the ground color: dense (`--tg-veil`, 74%) across the band that holds text, fading to transparent over the **feather** (24px) |
| Blur | A light backdrop blur (`--tg-blur-tide`, 12px) that fades out over 1.5× the feather, so the edge is soft, not a line |
| Band | The dense part holds the bar's content. Text there passes CT-10 against the worst backdrop. |
| Feather | A transparent border, overlapping the content below by a negative margin, so it never shifts layout |
| Auto | `data-tide="auto"` makes the tide rise only once content scrolls under it (scroll-driven, with a static fallback) |

Variants:

- `.tg-tide.tg-tide-top`: sticky at the top, feather below. For app bars.
- `.tg-tide.tg-tide-bottom`: sticky at the bottom, feather above, softer veil (`--tg-veil-soft`, 60%) and blur (10–12px). For docks holding the tab bar or composer.
- `.tg-tide` alone, positioned by you: captions on media, sticky section headers.

## Layers

Four depths of the same tint, mixed into `--tg-base`.

| Layer | Class | Mix (light) | Mix (dark) | Use |
|---|---|---|---|---|
| **Foam** | `.tg-foam` (default) | 4% → 12% | 7% → 13% | Most glass: bars, menus, sheets, cards, the agent's bubbles, header buttons, toasts |
| **Shallow** | `.tg-shallow` | 22% → 45% | 18% → 30% | Your own bubbles, secondary actions, avatars, the + button |
| **Lagoon** | `.tg-lagoon` | 30% → 62% | 26% → 40% | Selected states, the blob, your reactions |
| **Deep** | `.tg-deep` | deep, lit from below | same | The one main action on a screen: send, new, record, an active toggle |

**Deep** is always solid and always jelly. It is lit like a gummy held up to light: a sheen on top (white 24%, ends at about 23% of the height), a pool of bright tint at the bottom (starts at about 71%), and the dark body between, where its white label sits.

## Thickness

Thickness is opacity and blur together. Choose it from the element's job.

| Thickness | Class | Opacity light / dark | Blur | Use |
|---|---|---|---|---|
| **Solid** | none (default) | 100% | none | Anything you read: cards, rows, bubbles, fields |
| **Thin** | `.tg-thin` | 56% / 64% | 12px | Small floating icon controls, badges over media. **Icons only.** |
| **Regular** | `.tg-regular` | 68% / 76% | 20px | Tab bar, composer, floating pills, the playground bar |
| **Thick** | `.tg-thick` | 84% / 88% | 28px | Menus, sheets, popovers, toasts, glass over glass |

Blur saturates by 110% to keep blurred color from going gray. Sea glass is muted; it is never vivid.

Floating glass also lifts its shadow: `0 2px 6px shade, 0 20px 44px -18px` in shade (glass) or caustic (jelly).

## The rim

One pixel, drawn as a masked gradient on `::after`, so it follows any border radius and never affects layout.

- It **never moves**: not on tilt, scroll, hover or press. Stillness is what separates it from a specular highlight.
- Increase contrast replaces it with a plain line of text color at 40%.
- Text fields and the composer brighten it to full strength and add a 1.5px accent ring plus a soft glow on focus.

## Stacking and budgets

- At most **two** glass layers stack. The upper one is Thick. (A jelly button on a card is two layers; a menu over a sheet over a card is three, which is not allowed.)
- About **six live blurs** per screen at most: top tide, bottom tide, tab bar or composer, one overlay, plus two small floating controls.
- **Never blur** list items, bubbles or anything inside a scroller.
- Grain only on large surfaces: the ground, cards, lists, sheets, menus.

## Rules

- **MA-1** Text **must** sit on Solid glass, Regular or Thick glass that passes CT-7, or a tide band that passes CT-10.
- **MA-2** Thin glass **must** carry icons only.
- **MA-3** Sea glass **must not** move under a finger beyond the L tier, and **must not** loop.
- **MA-4** The rim **must** be still and **must** be 1px.
- **MA-5** A tide **must not** have a rim, shadow, grain or press state.
- **MA-6** Text inside a tide **must** sit in its dense band, never in the feather.
- **MA-7** No more than two glass layers **must** stack; the upper one **must** be Thick.
- **MA-8** A screen **should** run no more than six live blurs, and **must not** blur list items or bubbles.
- **MA-9** Deep **must** be solid, and a screen **should** have one Deep element (an active toggle group counts as one).
- **MA-10** Prism **should** appear only on jelly at least 96px wide.
- **MA-11** Grain **must not** appear on controls smaller than 96px.
