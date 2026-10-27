# 10 · Accessibility

A material that some people can't read or use has failed, however good it looks. Every setting below is honored automatically from the operating system, and each can also be offered as an in-app setting through a data attribute on `<html>`.

## Settings people turn on

| Setting | OS signal | In-app attribute | What changes |
|---|---|---|---|
| **Reduce motion** | `prefers-reduced-motion: reduce` | `data-tg-motion="reduce"` | Dents become an 85% dim plus tint; no peel, lean, stretch, pop or overshoot; Glide and Firm become 150ms eases; enter, arrive and drop become fades; typing dots pulse instead of bouncing. The hero stops idling but still answers touch. |
| **Reduce transparency** | `prefers-reduced-transparency: reduce` | `data-tg-transparency="reduce"` | Every floating surface turns Solid with no blur; tides become plain bars in the ground color with a hairline, and lose their feather. |
| **Increase contrast** | `prefers-contrast: more` | `data-tg-contrast="more"` | The rim becomes a plain 1px line of text color at 40%; secondary text becomes primary text; separators go to 30%. |
| **Forced colors** | `forced-colors: active` | n/a | Surfaces use system `Canvas`/`CanvasText` with real 1px borders; selection uses `Highlight`; blur, rim, grain and pools are removed. |
| **Larger text** | browser or OS text size | n/a | Type and control sizes are in `rem`, so layouts grow; nothing important truncates at 200%. |
| **Dark mode** | `prefers-color-scheme: dark` | `data-tg-theme="dark"` | See [Color](02-color.md#dark-mode). |

`data-tg-motion="full"` opts back in to full motion where an app offers that choice explicitly.

## Contrast

All text and icons meet WCAG 2.2 AA: 4.5:1 for text, 3:1 for icons, focus indicators and control boundaries that carry meaning. Tideglass measures floating glass against the **worst backdrop** (black behind light glass, white behind dark glass), not the typical one. Fifteen pairs are checked for every preset in both themes; see [Color](02-color.md#contrast-pairs) and the [contrast report](appendix-contrast.md).

## Focus

- Keyboard focus is a **2px outline in the accent color, offset 2px**, on every interactive kit component. It never animates.
- Fields and the composer show focus with a 1.5px accent ring plus a soft glow.
- Overlays move focus in when they open and return it to the opener when they close.
- Blob hosts (tab bars, segments) support arrow keys, Home and End; tablists use roving `tabindex`.

## Touch and pointer

- Targets are at least 44 × 44px (chips extend their hit area invisibly).
- Every touch interaction has a keyboard equivalent: Space and Enter press with the same dent and peel; long-press actions are also available from a visible control or the context menu.
- Dragging off a control cancels it, so a slip never fires an action.

## Meaning without color

- Selection is shown by the blob or Lagoon layer **and** a second cue (icon fill, weight, a check).
- Status colors always come with an icon or words.
- Deep toggles change their subtitle text ("On", "Off"), not just their color.

## Screen readers

- Toggles use `aria-pressed`, `aria-checked` or native checkboxes with `role="switch"`.
- Tabs use `role="tablist"`/`role="tab"` with `aria-selected`, or links with `aria-current="page"`.
- The blob, rim, sheen, pools and grain are decorative and hidden from assistive technology.
- Live updates (new messages, toasts) use `aria-live="polite"` or `role="status"`.
- Haptics are never the only feedback.

## Rules

- **AX-1** Every color pair **must** meet the contrast in [Color](02-color.md#contrast-pairs) against the worst backdrop.
- **AX-2** Reduce motion, reduce transparency, increase contrast and forced colors **must** each produce the outcome in the table above.
- **AX-3** Keyboard focus **must** be visible on every interactive element, at 3:1 or better, and **must not** animate.
- **AX-4** Every touch action **must** have a keyboard and screen-reader equivalent.
- **AX-5** State **must not** be shown by color alone.
- **AX-6** Touch targets **must** be at least 44 × 44px.
- **AX-7** Text **must** scale with the person's text size up to 200% without loss of content.
