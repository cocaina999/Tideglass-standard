# 7 · Layout: shape, space and size

## Shape

Sea glass has no sharp corners. The tide has worn every edge into a pebble.

| Token | Value | Use |
|---|---|---|
| `--tg-r-xs` | 8px | Tiny inner shapes: progress tracks, color dots in tight spaces |
| `--tg-r-s` | 12px | Thumbs (row leading squares), small inner cards |
| `--tg-r-m` | 16px | Rows inside lists (list radius − padding), inline images |
| `--tg-r-l` | 22px | Cards, lists, menus, stacked tiles |
| `--tg-r-xl` | 28px | Sheets, large panels |
| `--tg-r-full` | 999px | Capsules: buttons, chips, pills, tiles, fields, tab bars, the blob, avatars |

- **Capsules are the default** for anything you touch. Rectangles with radius are for things you read.
- **Corners nest:** an inner radius equals the outer radius minus the padding between them. A row inside a 22px list with 6px padding uses 16px.
- **Pebble corners:** on platforms that support continuous (superellipse) corners, use them. SwiftUI: `RoundedRectangle(cornerRadius:style: .continuous)`. Compose: a squircle shape. CSS may add `corner-shape: squircle` where supported, with radii increased about 1.4× to keep the same visual size.
- Message bubbles flatten the corner at their tail to 6px.

## Space

A 4px grid. Spacing tokens are `--tg-space-1` (4px) to `--tg-space-16` (64px): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

| Context | Spacing |
|---|---|
| Screen side margin (phone) | 16px |
| Between cards and sections | 16–24px |
| Inside a card | 16px |
| Inside a list (to its rows) | 6px |
| Between icon and label in a control | 6–8px |
| Between chips and tiles in a group | 8–12px |
| Floating bar to screen edge | 12px |

## Size

| Token | Value | Use |
|---|---|---|
| `--tg-size-target` | 2.75rem (44px) | The smallest touch target; icon buttons, buttons, fields |
| `--tg-size-chip` | 2.25rem (36px) | Chip height; its hit area extends to 44px |
| `--tg-size-orb` | 3.5rem (56px) | The main action orb, the composer |
| `--tg-size-bar` | 3.5rem (56px) | App bar content height |

Control sizes are in `rem`, so they grow when the person enlarges text.

## Safe areas and edges

- Bars add `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to their padding; the tide extends under the status bar and home indicator.
- Content scrolls under both bars. Its last item must be reachable above the dock: add bottom padding equal to the dock's height, or let the bottom tide overlap by its feather only.
- Set `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` on the web.

## Layering order

| Layer | Token | Holds |
|---|---|---|
| Content | auto | Ground, cards, lists |
| Bars | `--tg-z-bar` (30) | Tides, docks |
| Menus | `--tg-z-menu` (40) | Menus, popovers, reaction pickers |
| Sheets | `--tg-z-sheet` (50) | Scrim and sheets |
| Toasts | `--tg-z-toast` (60) | Toasts |

## Rules

- **LA-1** Touch targets **must** be at least 44 × 44px, or extend their hit area to it.
- **LA-2** Controls you touch **should** be capsules; corners **must** nest (inner = outer − padding).
- **LA-3** Spacing **must** sit on the 4px grid.
- **LA-4** Layouts **must** grow with the person's text size; nothing important truncates at 200% text.
- **LA-5** Content **must** stay reachable above floating bars and the home indicator.
