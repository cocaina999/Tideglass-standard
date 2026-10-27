---
name: tideglass
description: Tideglass, a premium UI material and touch standard - frosted sea glass to read on, squishy jelly controls that dent and peel under a finger, and a liquid tide at the scroll edges where content shows through (like a Telegram chat header). Use when designing, building or reviewing any screen, component, design system or theme in the Tideglass style, in any brand color, on the web, SwiftUI or Compose.
license: MIT
metadata:
  version: "1.0.0"
  spec: spec/README.md
---

# Tideglass

**Read on sea glass. Touch jelly. See through the tide.**

Tideglass is a UI standard with three materials. Sea glass is frosted, tinted and matte, for reading. Jelly is gummy, lit from inside and squishy, for touching. Tide is a liquid veil at scroll edges, for seeing through. It is a deliberate alternative to Apple's Liquid Glass: no lensing, no moving highlights, no color borrowed from content.

This file is the working summary. The full standard is in [spec/](spec/README.md); every rule below has an ID you can cite in a review.

## Answer three questions for every element

| Question | Picks | Answers |
|---|---|---|
| 1. What does the person do with it? | **Material** | Read → sea glass. Touch → jelly. See through → tide. |
| 2. Does content pass underneath? | **Thickness** | No → Solid. Yes → Thin (icons only), Regular (bars), Thick (menus, sheets, glass over glass). |
| 3. How important is it? | **Layer** | Foam (most things), Shallow (yours, secondary), Lagoon (selected), Deep (the one main action). |

Then **size picks the touch tier**: S up to 56px, M up to 160px, L wider. Money or loss → Firm. Emoji and reaction keys → Lift. Links, disabled controls and typing surfaces → None. A role may make a tier calmer, never stronger.

## Hard rules

These are the rules agents break most. All are *must* unless marked.

- **One Deep per screen** (the orb or one main button; an active toggle group counts as one). White text appears only on Deep. (MA-9, CO-3)
- **Text needs proof.** Text sits on Solid glass, Regular/Thick glass, or a tide's dense band. Secondary (gray) text on floating glass needs Thick or a tide under it. Thin glass carries icons only. No secondary text on Lagoon or Deep. (MA-1, CO-5, CO-6, CO-7)
- **Bars are tides.** Full-width top and bottom bars are `.tg-tide`; the tab bar and composer are floating jelly *inside* a bottom tide. Tide text is primary text in the dense band, and tide actions are jelly icon buttons, never bare accent links. (NA-1, NA-2, CO-8)
- **One blob per tab bar or segment.** It glides between items; selection never jumps and never shows by color alone (add icon fill or weight). (NA-3, NA-4)
- **Reading surfaces are still.** Bubbles never dent on tap; rows and cards are L at most and never lean. (TO-6, TO-7)
- **Small things glide, big things are firm.** Sheets, pages and anything over half the screen move on Firm (no overshoot). Exits never overshoot. Color and opacity never bounce. (MO-2, MO-3, MO-6)
- **Nothing moves at rest** except live status (typing, progress) and one optional hero. The rim is 1px and still. (FD-2, MA-4)
- **At most two glass layers stack**, the upper one Thick. Icons inside glass bars and fields use `.is-plain`. Never blur list rows or bubbles. (MA-7, MA-8, CP-3)
- **Brand only through six inputs**; components use theme roles, never hex. (FD-4, CO-1)
- **Shadows are tinted**, never gray (*should*, CO-10). Never rescue text with a text shadow; make the glass thicker.
- **Everyone:** 44px targets, visible 2px accent focus that never animates, keyboard parity for every touch action, state never by color alone, and reduce motion / reduce transparency / increase contrast / forced colors / 200% text all honored. (AX-1 to AX-7)

## Build on the web kit

The kit implements every rule above. Use it unless the target is native.

```html
<html lang="en" data-tg-brand="seafoam">            <!-- or cornflower, lavender, amber, kelly, coral -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="stylesheet" href="kit/tideglass.css">
<link rel="stylesheet" href="kit/tideglass-presets.css">
<body class="tg-ground tg-grain">
  …
  <script src="kit/tideglass.js"></script>
```

Files: [kit/tideglass.css](kit/tideglass.css), [kit/tideglass-presets.css](kit/tideglass-presets.css), [kit/tideglass.js](kit/tideglass.js). No build step. Copy them next to the page you are building, or reference them from this skill's folder.

### Component cheatsheet

| Need | Markup |
|---|---|
| Page | `<body class="tg-ground tg-grain">` |
| Top bar | `<header class="tg-tide tg-tide-top" data-tide="auto"><div class="tg-appbar">…<span class="tg-appbar-title">Title</span>…</div></header>` (drop `data-tide="auto"` in chats, where content is always underneath) |
| Tab bar + orb | `<div class="tg-tide tg-tide-bottom"><nav class="tg-dock"><div class="tg-tabbar tg-regular is-fill"><span class="tg-blob" aria-hidden="true"></span><a class="tg-tab" aria-current="page">…</a>…</div><button class="tg-orb" aria-label="New">…</button></nav></div>` |
| Segmented control | `<div class="tg-seg" role="tablist"><span class="tg-blob" aria-hidden="true"></span><button class="tg-seg-item" role="tab" aria-selected="true">Day</button>…</div>` |
| Main action | `<button class="tg-btn tg-deep">Continue</button>` or `.tg-orb` |
| Other buttons | `.tg-btn` (Foam), `.tg-btn.tg-shallow`, `.tg-btn.is-danger[data-press="firm"]` |
| Icon button | `.tg-icon-btn` with `aria-label`; `.tg-thin` over media; `.is-plain` inside bars and fields |
| Chip | `<button class="tg-chip" aria-pressed="true">` (selected turns Lagoon) |
| Toggle tile | `<button class="tg-tile" aria-pressed="true"><span class="tg-tile-icon">…</span><span class="tg-tile-text">Wi-Fi<small>On</small></span></button>` (on = Deep; change the subtitle too) |
| Switch / slider | `<input class="tg-switch" type="checkbox" role="switch">`, `<input class="tg-slider" type="range">` |
| List | `<div class="tg-list"><a class="tg-row">` with `.tg-thumb`, `.tg-row-main`, `.tg-row-title`, `.tg-row-meta`, `.tg-row-sub` |
| Card | `.tg-card` |
| Field | `<label class="tg-field"><svg class="tg-icon">…</svg><input …></label>` |
| Composer | `<div class="tg-tide tg-tide-bottom"><form class="tg-dock"><div class="tg-composer tg-regular">…<input>…</div><button class="tg-orb">…</button></form></div>` |
| Bubbles | `.tg-bubble.is-in` (Foam), `.tg-bubble.is-out` (Shallow), `.tg-bubble-meta`; `data-press="l" data-hold` for long-press |
| Overlays | `.tg-menu.tg-thick`, `.tg-sheet.tg-thick` + `.tg-scrim`, opened with `Tideglass.open(el, opener)`; `Tideglass.toast('Saved')` |
| Anything custom | `.tg-glass` / `.tg-jelly` / `.tg-deep` + a layer (`.tg-foam`, `.tg-shallow`, `.tg-lagoon`) + a thickness (`.tg-thin`, `.tg-regular`, `.tg-thick`); `.tg-press` or `data-press` makes it pressable |

Attributes: `data-press="s|m|l|firm|lift|none"`, `data-hold` (fires `tg-hold`), `data-haptic="impact|selection|hold|threshold"`, `data-tg-theme="light|dark"`, `data-tg-motion|transparency|contrast` for in-app settings. Events: `tg-change` on blob hosts, `tg-hold`, `tg-haptic`. Full API: [spec/11-platforms.md](spec/11-platforms.md).

### Custom brand

Set the six inputs on `:root` (or any scope with `.tg-theme`): `--tg-tint` (the sea glass color), `--tg-deep` (main action, dark enough for white text), `--tg-ink` (text, near-black with a hint of tint) and `--tg-rim-a/b/c` (three pastels for the rim and prism). Everything else, including dark mode, is derived. To prove contrast, add the brand as a preset in `kit/tideglass-presets.css` and run `npm run check`.

## Native

Use the same tokens ([tokens/tideglass.tokens.json](tokens/tideglass.tokens.json), DTCG format) and the SwiftUI and Compose recipes in [spec/11-platforms.md](spec/11-platforms.md). Never use the system glass material as the visible surface (PL-2). Springs: Glide = response 0.40s, damping 0.75; Firm = 0.30s, 1.0; the press release is keyframed (dent → peel at 38% → settle at 70% → rest, 440ms).

## Where the details live

| Topic | Chapter |
|---|---|
| The idea, signature, Liquid Glass comparison | [01 Foundations](spec/01-foundations.md) |
| Brand inputs, roles, dark mode, contrast pairs | [02 Color](spec/02-color.md) |
| Sea glass, jelly, tide, layers, thickness, rim | [03 Materials](spec/03-materials.md) |
| Dent and peel, tiers, long-press, haptics | [04 Touch](spec/04-touch.md) |
| Springs and moments | [05 Motion](spec/05-motion.md) |
| Bars, tab bar, blob, sheets, menus | [06 Navigation](spec/06-navigation.md) |
| Radius, spacing, sizes, safe areas | [07 Layout](spec/07-layout.md) |
| Type scale and icons | [08 Type and icons](spec/08-type-and-icons.md) |
| Every component with markup | [09 Components](spec/09-components.md) |
| Settings, focus, screen readers | [10 Accessibility](spec/10-accessibility.md) |
| Web API, SwiftUI, Compose, tokens | [11 Platforms](spec/11-platforms.md) |
| Ship checklist and common mistakes | [12 Review](spec/12-review.md) |

Working examples: [demo/home.html](demo/home.html) (assistant home), [demo/chat.html](demo/chat.html) (chat with tide header and composer), [demo/controls.html](demo/controls.html) (quick settings), [demo/index.html](demo/index.html) (specimen of everything).

## Before you hand over a screen

1. Every element has a material, layer, thickness and tier, and they follow the three questions.
2. One Deep. White text only on it.
3. No gray text on Regular, Thin, Lagoon or Deep; no text in a tide's feather.
4. Edge bars are tides; the tab bar has one blob and a second selection cue.
5. Big things are Firm; nothing bounces twice; nothing moves at rest.
6. Swap the brand to a far preset: nothing keeps its old color.
7. Turn on reduce motion, reduce transparency, increase contrast and dark mode: each still works.
8. Every icon-only control has an `aria-label`; every touch action works from the keyboard.

The full checklist, with every rule ID, is in [spec/12-review.md](spec/12-review.md).
