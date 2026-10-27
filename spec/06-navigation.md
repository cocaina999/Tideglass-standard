# 6 · Navigation

Navigation is where all three materials meet. Bars are **tide** at the screen edges, the controls inside them are **jelly**, and the content scrolling underneath is **sea glass**.

```
┌────────────────────────────────┐
│ status                         │ ┐
│ (‹)  Title              (•••)  │ │ top tide: dense band holds text
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ┘ feather: content shows faintly
│ ┌────────────────────────────┐ │
│ │ sea glass content…         │ │
│ └────────────────────────────┘ │
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ┐ feather
│ ( ◉Home   Saved   You )   (✎) │ │ bottom tide with floating jelly:
│                                │ ┘ tab bar + one Deep orb
└────────────────────────────────┘
```

## Top bar

The top bar is a tide, like a Telegram chat header: messages roll underneath and stay faintly visible, then fade into a dense band where the title sits.

```html
<header class="tg-tide tg-tide-top" data-tide="auto">
  <div class="tg-appbar">
    <a class="tg-icon-btn" href="/" aria-label="Back"><svg class="tg-icon">…</svg></a>
    <span class="tg-appbar-title">Inbox</span>
    <button class="tg-icon-btn" aria-label="More">…</button>
  </div>
</header>
```

- The band holds **primary text only**, at Body or Label size. Status lines ("online", "typing…") are primary text at Label size; hierarchy comes from size and weight, not from a lighter color.
- Actions are **jelly icon buttons** (Solid Foam, S tier), never bare accent-colored text.
- `data-tide="auto"` keeps the bar clear at the top of the page and lets the tide rise over the first 40px of scroll. Without it, the tide is always on (right for chats, where content is always underneath).
- A **large title** may sit in the content below the bar and scroll away under it.

## Tab bar

The tab bar is a floating **jelly capsule** (Foam, Regular) sitting in a bottom tide, inset 12px from the screen edges and 10px above the safe area.

```html
<div class="tg-tide tg-tide-bottom">
  <nav class="tg-dock" aria-label="Main">
    <div class="tg-tabbar tg-regular is-fill">
      <span class="tg-blob" aria-hidden="true"></span>
      <a class="tg-tab" href="/" aria-current="page"><svg class="tg-icon">…</svg>Home</a>
      <a class="tg-tab" href="/saved"><svg class="tg-icon">…</svg>Saved</a>
      <a class="tg-tab" href="/you"><svg class="tg-icon">…</svg>You</a>
    </div>
    <button class="tg-orb" aria-label="New" data-haptic="impact">…</button>
  </nav>
</div>
```

- 2 to 5 tabs. Each tab is an icon (24px) over a Micro label, at least 60px wide.
- The selected tab sits on **the blob** and its icon gets a soft fill (22% of its color). Its label stays primary text. Selection is never shown by color alone.
- Tab labels pass CT-11 because the bar sits on a tide: the tide is what makes text on floating glass legible.
- The **orb** (Deep, the one main action) may sit beside the tab bar, never inside it.
- Tapping the current tab scrolls its page to the top.

## The blob

Tabs and segmented controls share one **selection blob**: a Lagoon jelly capsule behind the selected item.

| Moment | Behavior |
|---|---|
| Select | The blob glides to the new item on the Glide spring, stretching 14% along the travel and thinning 6%, then settles. A `selection` haptic marks the change. |
| Scrub | Press anywhere on the bar and slide: after 10px of horizontal travel the blob leaves its item and follows the finger, stretching with speed (up to 18% longer, 7% thinner). Release over an item to select it. |
| Keyboard | Arrow keys move focus; in a `tablist` or `radiogroup`, selection follows focus. Home and End jump to the ends. |
| Resize | The blob re-measures without animating. |

The kit handles all of this for any `.tg-tabbar`, `.tg-seg` or `[data-tg-blob]`. It reads the selected item from `aria-selected`, `aria-current`, `aria-checked` or `.is-selected`, updates the same attribute, and fires a bubbling `tg-change` event with `detail.item`, `detail.index` and `detail.previous`.

## Segmented control

A Solid Foam track (`.tg-seg`) with the blob inside; items are `.tg-seg-item`, Label Strong. Use `role="tablist"` for views, `role="radiogroup"` for settings. Two to five items; for more, use chips.

## Moving between pages

| Move | Motion |
|---|---|
| Push (deeper) | The new page slides in from the trailing edge on Firm; the old page shifts 30% the other way and dims by 10%. |
| Pop (back) | The reverse, on Firm. |
| Edge swipe back | The page follows the finger 1:1; on release it completes or returns on Firm. |
| Tab switch | Cross-fade, 150ms. No slide: tabs are siblings, not depths. |

## Sheets and menus

- **Sheets** (`.tg-sheet`, Thick, grain) rise from the bottom on Firm over a scrim. They have a grabber, one or more detents, and close on scrim tap, swipe down and Escape. Dragging past the top detent rubber-bands by at most 2% of the sheet's height.
- **Menus** (`.tg-menu`, Thick, grain) grow out of the button that opened them on Glide, and leave in 180ms. One menu at a time. Escape closes and returns focus to the opener.
- **Reaction pickers** are menus of Lift keys that grow out of the long-pressed bubble.

## Sticky headers and media

- **Date pills** in a chat are Regular jelly pills (`.tg-pill.tg-regular`) that stick below the top bar.
- **Section headers** in long lists are small tides (`.tg-tide` with a short band) that stick to the top of their section.
- **Captions on photos** sit in a tide anchored to the photo's bottom edge: the photo keeps showing through the feather, and the caption sits in the dense band.

## Rules

- **NA-1** Full-width bars at the screen edges **must** be tides; floating bars **must** be jelly sitting on a tide.
- **NA-2** Text in a top bar **must** be primary text in the dense band; actions **must** be jelly controls.
- **NA-3** Tabs and segments **must** share one blob per group that glides on the Glide spring; selection **must not** jump.
- **NA-4** The selected tab **must** be marked by the blob and one more cue (icon fill or weight), never by color alone.
- **NA-5** A screen **should** have one orb, placed beside the tab bar or composer, never inside the tab bar.
- **NA-6** Page pushes and pops **must** move on Firm; tab switches **must** cross-fade.
- **NA-7** Sheets and menus **must** close on Escape and return focus to their opener.
- **NA-8** Selection changes in tabs, segments and switches **must** mark a `selection` haptic.
- **NA-9** A blob host **must** be keyboard operable: arrow keys move between items.
