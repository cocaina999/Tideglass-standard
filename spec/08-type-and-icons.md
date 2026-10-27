# 8 · Type and icons

## Type

**One family, five sizes, two weights.** Restraint is what makes soft materials look premium instead of playful.

| Style | Token and class | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| Title | `--tg-type-title`, `.tg-type-title` | 28 / 34 | 600 | −0.02em | Screen titles, large numbers |
| Heading | `--tg-type-heading`, `.tg-type-heading` | 20 / 26 | 600 | −0.01em | Section headers, card titles |
| Body | `--tg-type-body`, `.tg-type-body` | 16 / 22 | 400 | 0 | Reading text, bubbles, fields |
| Body Strong | `--tg-type-body-strong`, `.tg-type-body-strong` | 16 / 22 | 600 | 0 | Row titles, buttons, tile labels |
| Label | `--tg-type-label`, `.tg-type-label` | 13 / 18 | 400 | 0 | Subtitles, metadata, captions |
| Label Strong | `--tg-type-label-strong`, `.tg-type-label-strong` | 13 / 18 | 600 | 0 | Chips, segments, small buttons |
| Micro | `--tg-type-micro`, `.tg-type-micro` | 11 / 14 | 600 | +0.01em | Tab labels, badges, pills, timestamps |

Sizes are in `rem` (1rem = 16px by default) so they follow the person's text size.

### Family

- **Default:** the system UI family (`--tg-font`: SF Pro on Apple platforms, Roboto on Android, Segoe UI on Windows). It renders instantly and matches the platform.
- **Brand family:** set `--tg-font` to one humanist or geometric sans with open forms (for example Figtree, Plus Jakarta Sans or Inter). One family only.
- **Rounded numerals:** badges use `--tg-font-round` (`ui-rounded`, SF Pro Rounded) where available. Rounded digits suit jelly.
- Numbers that change or line up (times, prices, counts) use tabular figures: `.tg-num` or `font-variant-numeric: tabular-nums`.

### Text on materials

| Surface | Primary text | Secondary text |
|---|---|---|
| Ground, Foam, Shallow (solid) | yes | yes |
| Lagoon | yes | no (CO-5) |
| Deep | white only, in the label band | no |
| Regular glass | yes | only over a tide (CO-6) |
| Thick glass | yes | yes |
| Thin glass | no (icons only) | no |
| Tide band | yes | no (CO-8) |

### Writing

- Sentence case everywhere, including buttons and titles.
- Labels name the action ("Send", "Save to collection"), not the mechanism ("Submit").
- Status says what is happening now: "Looking for it…", then the result. No spinners without words for waits over two seconds.

## Icons

| Property | Value |
|---|---|
| Grid | 24 × 24, with 2px of padding |
| Stroke | 1.75px at 24px (scale with size), round caps and joins |
| Sizes | 16 (inside chips), 20 (inside buttons, rows, menus), 22 (icon buttons), 24 (tab bar, orb) |
| Color | `currentColor`: the text color of where it sits |
| Fill | None by default. **Filled only when selected**: a soft fill at 22% of the icon color, or a filled variant |
| Style | Friendly geometry, open counters, rounded ends. [Lucide](https://lucide.dev) at 1.75 stroke is a close match. |

`.tg-icon` applies the stroke rules to inline SVG:

```html
<svg class="tg-icon" aria-hidden="true"><use href="#i-home"/></svg>
```

## Rules

- **TY-1** A product **must** use one type family and only the five sizes and two weights above.
- **TY-2** Text **must** be sized in `rem` (or the platform's dynamic type) so it follows the person's setting.
- **TY-3** Changing or aligned numbers **must** use tabular figures.
- **TY-4** Hierarchy in a tide band **must** come from size and weight, not a lighter color.
- **IC-1** Icons **must** use one stroke weight per size, round caps and `currentColor`.
- **IC-2** Icons **must** be filled only to show selection.
- **IC-3** Icon-only controls **must** have an accessible name (`aria-label` or visible-on-focus text).
