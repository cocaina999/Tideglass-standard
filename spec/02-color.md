# 2 · Color

## Brand inputs

A brand sets six values. Everything else derives from them, so changing these six rebrands every surface, state and shadow.

| Token | Default | Job | Constraint |
|---|---|---|---|
| `--tg-tint` | `#4DB6BC` | Bright brand hue. Tints every glass layer, glow and caustic. | A light-to-mid hue. Lagoon (62% tint) must keep ink at 4.5:1. |
| `--tg-deep` | `#0E6670` | Dark brand hue: the main action, links, focus, switches. | 4.5:1 on the ground; white 4.5:1 on it. |
| `--tg-ink` | `#0F2A2E` | Text in light mode. | 7:1 on the ground is the target; 4.5:1 is the floor. |
| `--tg-rim-a` `--tg-rim-b` `--tg-rim-c` | `#BDE6FF` `#F4B8E4` `#FFE4A6` | Three pastels for the rim, the prism and the ground's pools. | Take them from the hero, logo or key art. Keep them light. |

Override them on `:root`, or on any element marked `data-tg-brand` or `.tg-theme` to rebrand just that section.

```css
:root{
  --tg-tint:#7FA6E3; --tg-deep:#24509E; --tg-ink:#13203A;
  --tg-rim-a:#C9DEFF; --tg-rim-b:#E9C6F5; --tg-rim-c:#FFE2B8;
}
```

**The hue swap test.** Switch the tint and deep values to a very different hue. If anything looks wrong, a color is hard-coded somewhere.

## Presets

Six starting points, each named after a real sea glass color and each verified in light and dark by `npm run check`. Load [`kit/tideglass-presets.css`](../kit/tideglass-presets.css) and set `data-tg-brand`.

| Preset | Tint | Deep | Ink | Story |
|---|---|---|---|---|
| `seafoam` | `#4DB6BC` | `#0E6670` | `#0F2A2E` | The default. Pale green-blue bottle glass. |
| `cornflower` | `#7FA6E3` | `#24509E` | `#13203A` | Soft blue of old medicine bottles. |
| `lavender` | `#A894D8` | `#5A3F9C` | `#221A38` | Clear glass turned violet by manganese and sun. |
| `amber` | `#E2A35E` | `#8A4A12` | `#2E1D0E` | Brown bottle glass, warm and common. |
| `kelly` | `#6EC28F` | `#1C6A3E` | `#10291B` | Bright bottle green. |
| `coral` | `#EE9A9A` | `#A23A48` | `#33161B` | The rare pink piece everyone keeps. |

## Theme roles

Components never use brand inputs directly. They use roles, which each theme computes from the inputs. Light and dark share role names, so components need no theme logic.

| Role | Light | Dark | Used for |
|---|---|---|---|
| `--tg-ground` | tint 10% into `#F5F7F7` | tint 10% into `#090E0F` | The page behind everything |
| `--tg-pool-1` to `-4` | tint 30%, rim-a 60%, rim-c 55%, rim-b 32% | tint 22%, rim-a 10%, rim-c 7%, rim-b 9% | Soft color pools on the ground |
| `--tg-base` | `#FFFFFF` | tint 6% into `#121A1C` | What the layers mix with |
| `--tg-foam-1/2` | tint 4% / 12% | tint 7% / 13% | Foam layer, top and bottom |
| `--tg-shallow-1/2` | 22% / 45% | 18% / 30% | Shallow layer |
| `--tg-lagoon-1/2` | 30% / 62% | 26% / 40% | Lagoon layer, the blob |
| `--tg-deep-1/2` | deep 82% + tint, then deep | same | Deep layer (always the same) |
| `--tg-text` | ink | tint 8% into `#F2F7F7` | Primary text and icons |
| `--tg-text-2` | text at 72% | text at 72% | Secondary text (see the limits below) |
| `--tg-accent` | deep | tint 80% into white | Links, focus rings, small accents |
| `--tg-on-deep` | `#FFFFFF` | `#FFFFFF` | Text and icons on Deep |
| `--tg-separator` | text at 10% | text at 10% | Hairlines between rows |
| `--tg-hairline` | white 90% | white 14% | The 1px light line inside the top edge |
| `--tg-edge` | deep 14% | black 35% | Jelly's darker bottom edge |
| `--tg-glow` | tint 40% | tint 28% | Light pooling inside the bottom edge |
| `--tg-sheen` | white 55% | white 10% | Jelly's still top sheen |
| `--tg-shade` | deep 16% | black 45% | Shadows: tinted in light mode, deep in dark |
| `--tg-caustic` | tint 42% | tint 24% | Colored light thrown below jelly |
| `--tg-veil` / `--tg-veil-soft` | ground 74% / 60% | same | The tide's dense band / bottom tide |
| `--tg-scrim` | ink 24% | black 50% | Behind sheets and dialogs |
| `--tg-danger` `--tg-success` `--tg-warning` | `#B42318` `#12703A` `#8A5300` | `#FF8A80` `#6FD394` `#F2C14E` | Status text and icons |

Resolved values for the default brand are in [`tokens/tideglass.tokens.json`](../tokens/tideglass.tokens.json).

## Dark mode

Dark Tideglass is sea glass at night: a near-black ground tinted by the brand, glass that is lighter than the ground, a rim at about 40% strength, shadows that are deep rather than tinted, and slightly thicker floating glass (64 / 76 / 88% instead of 56 / 68 / 84%) because light text over bright content needs more cover. Deep stays identical in both themes so the main action never changes identity.

The theme follows the operating system. Set `data-tg-theme="light"` or `"dark"` on `<html>` to force one, or on a section to make an island. A nested scope inside a forced island must state its own theme.

## Status colors

Danger, success and warning are fixed, not brand-derived, so a brand can never make an error look like success. Use them for text and icons on the ground, Foam and Solid glass. Destructive actions use a Foam button with danger text and the Firm tier, never a large red jelly.

## Contrast pairs

Every pair below is measured by `npm run check` on the colors the kit actually renders, for every preset in both themes. "Worst backdrop" is pure black behind light glass and pure white behind dark glass. Measurements are in the [contrast report](appendix-contrast.md).

| Pair | Needs | Covers |
|---|---|---|
| **CT-1** Text on the ground and its pools | 4.5:1 | Headings and text placed directly on the page |
| **CT-2** Secondary text on the ground and its pools | 4.5:1 | Captions on the page |
| **CT-3** Accent (links) on the ground, pools and Foam | 4.5:1 | Links, "See all", accent labels |
| **CT-4** Text on Foam, Shallow and Lagoon | 4.5:1 | All text on solid layers |
| **CT-5** Secondary text on Foam and Shallow | 4.5:1 | Row subtitles, timestamps, bubble meta |
| **CT-6** Text on Deep, in its label band | 4.5:1 | Labels on the main action and active tiles |
| **CT-7** Text on Regular and Thick glass over the worst backdrop | 4.5:1 | Text on floating bars, menus and sheets |
| **CT-8** Secondary text on Thick glass over the worst backdrop | 4.5:1 | Captions in menus and sheets |
| **CT-9** Icons on Thin glass over the worst backdrop | 3:1 | Icon-only floating controls |
| **CT-10** Text in the tide band over the worst backdrop | 4.5:1 | Titles in top bars |
| **CT-11** Text and secondary text on glass docked over the bottom tide | 4.5:1 | Tab labels, composer placeholder |
| **CT-12** Status colors on the ground and Foam | 4.5:1 | Errors, success, warnings |
| **CT-13** Focus ring (accent) against the ground | 3:1 | Keyboard focus |
| **CT-14** Switch thumb against its on track | 3:1 | Switch state |
| **CT-15** Badge text on Deep | 4.5:1 | Counts |

The measurements also explain these limits, which become rules:

- Secondary text on **Lagoon** fails in dark mode → use primary text on Lagoon (**CO-5**).
- Secondary text on **Regular** glass over the worst backdrop fails → it needs Thick glass, or a tide underneath (**CO-6**).
- Text on **Thin** glass fails → Thin carries icons only (**CO-7**).
- Secondary and accent text in the **tide band** fail → tide text is primary, and actions in a tide are jelly controls, not bare links (**CO-8**).

## Rules

- **CO-1** Components **must** use theme roles, never raw hex values or brand inputs.
- **CO-2** A brand **must** pass every contrast pair (CT-1 to CT-15) in both themes. Run `npm run check` with the brand added as a preset.
- **CO-3** White text and icons **must** appear only on Deep; on Deep, all text is `--tg-on-deep`.
- **CO-4** Text on Deep **must** sit in the label band (between the top sheen and the bottom pool, roughly 25% to 70% of the height).
- **CO-5** Secondary text **must not** sit on Lagoon or Deep.
- **CO-6** Secondary text on floating glass **must** use Thick, or sit over a tide.
- **CO-7** Thin glass **must** carry icons only.
- **CO-8** Text inside a tide **must** be primary text; actions inside a tide **must** be jelly controls.
- **CO-9** Status colors **must not** be replaced by brand colors, and **must not** be the only signal (pair them with an icon or words).
- **CO-10** Shadows **should** be tinted (`--tg-shade`, `--tg-caustic`), never neutral gray, in light mode.
