# 9 · Components

Every component is four answers: a **material**, a **layer**, a **thickness** and a **touch tier**. This table is the whole system at a glance; the sections after it give markup for the web kit.

| Component | Class | Material | Layer | Thickness | Tier |
|---|---|---|---|---|---|
| Page | `.tg-ground` | ground | n/a | n/a | n/a |
| Top bar | `.tg-tide.tg-tide-top` + `.tg-appbar` | tide | n/a | veil 74% | none |
| Dock | `.tg-tide.tg-tide-bottom` + `.tg-dock` | tide | n/a | veil 60% | none |
| Tab bar | `.tg-tabbar` + `.tg-tab` | jelly | Foam | Regular | M per tab |
| Selection blob | `.tg-blob` | jelly | Lagoon | Solid | none (it moves) |
| Segmented control | `.tg-seg` + `.tg-seg-item` | sea glass | Foam | Solid | M per item |
| Button | `.tg-btn` | jelly | Foam (any) | Solid | by size (M usually) |
| Main action orb | `.tg-orb` | jelly | Deep | Solid | S |
| Icon button | `.tg-icon-btn` | jelly | Foam (any) | Solid or Thin | S |
| Chip | `.tg-chip` | jelly | Foam; Lagoon when selected | Solid | M |
| Pill | `.tg-pill` | jelly | Foam (any) | any | none (or M with `.tg-press`) |
| Tile | `.tg-tile` | jelly + prism | Foam; Deep when on | Solid | M or L |
| Switch | `.tg-switch` | jelly thumb | Deep track when on | Solid | S |
| Slider | `.tg-slider` | jelly track | Deep fill | Solid | none (drag) |
| Field | `.tg-field` | sea glass | Foam | Solid | none |
| Composer | `.tg-composer` | jelly | Foam | Regular | none |
| Card | `.tg-card` | sea glass | Foam (any) | Solid | none, or L when it opens something |
| List and row | `.tg-list` + `.tg-row` | sea glass | Foam | Solid | L |
| Thumb | `.tg-thumb` | jelly | Foam (any) | Solid | none |
| Avatar | `.tg-avatar` | jelly | Shallow (any) | Solid | S when pressable |
| Badge | `.tg-badge` | flat Deep | n/a | n/a | none |
| Message bubble | `.tg-bubble` | sea glass | Foam in, Shallow out | Solid | none; L with long-press |
| Menu | `.tg-menu` + `.tg-menu-item` | sea glass | Foam | Thick | L per item |
| Sheet | `.tg-sheet` + `.tg-grabber`, over `.tg-scrim` | sea glass | Foam | Thick | none |
| Toast | `.tg-toast` | sea glass | Foam | Thick | none |
| Emoji key | `.tg-key` | none (the glyph) | n/a | n/a | Lift |
| Text link | `.tg-link` | none | n/a | n/a | None |
| Typing status | `.tg-typing` | none | n/a | n/a | none |

Generic material and modifier classes work on anything: `.tg-glass`, `.tg-jelly`, `.tg-deep`, `.tg-foam`, `.tg-shallow`, `.tg-lagoon`, `.tg-thin`, `.tg-regular`, `.tg-thick`, `.tg-prism`, `.tg-grain`, and `.tg-press` (makes any element pressable).

## Buttons

```html
<button class="tg-btn tg-deep" data-haptic="impact">Continue</button>   <!-- the one main action -->
<button class="tg-btn">Not now</button>                                   <!-- Foam -->
<button class="tg-btn tg-shallow"><svg class="tg-icon">…</svg>Save</button>
<button class="tg-btn is-danger" data-press="firm">Delete</button>        <!-- danger text, Firm -->
```

- Height 44px, capsule, Body Strong, 20px side padding, icons 20px.
- One Deep button or orb per screen.
- Costly actions (pay, buy, confirm, delete) take `data-press="firm"`.

## Icon button and orb

```html
<button class="tg-icon-btn" aria-label="More"><svg class="tg-icon">…</svg></button>
<button class="tg-icon-btn tg-thin" aria-label="Close">…</button>         <!-- floating over media -->
<button class="tg-icon-btn is-plain" aria-label="Attach">…</button>      <!-- inside a bar that is already glass -->
<button class="tg-orb" aria-label="Send" data-haptic="impact">…</button>  <!-- 56px, Deep -->
<button class="tg-orb is-small" aria-label="Send">…</button>              <!-- 44px -->
```

`is-plain` drops the surface but keeps the touch: use it for icons inside the composer, a field or a toolbar, so glass never stacks three deep.

## Chips, pills and badges

```html
<button class="tg-chip" aria-pressed="true">Today</button>
<span class="tg-pill tg-regular">Today</span>          <!-- floating date label -->
<span class="tg-badge">3</span>
```

- Chips are 36px tall with a 44px hit area. Selected (`aria-pressed`, `aria-selected` or `aria-checked` = true) turns Lagoon.
- Pills are labels, not buttons, unless given `.tg-press`.
- Badges are flat Deep with a 2px base-colored ring, rounded tabular numerals, Micro size. They arrive with `.tg-drop`.

## Tiles

```html
<button class="tg-tile" aria-pressed="true">
  <span class="tg-tile-icon"><svg class="tg-icon">…</svg></span>
  <span class="tg-tile-text">Ceiling lights<small>On · 70%</small></span>
</button>

<button class="tg-tile tg-stack">
  <span class="tg-tile-icon"><svg class="tg-icon">…</svg></span>
  Movie night
</button>
```

- Capsule tiles are toggles or shortcuts, at least 72px tall, with a 40px icon disc and prism light. `aria-pressed="true"` (or `aria-checked`) turns a tile Deep; its title and subtitle become white.
- `.tg-stack` stacks the icon over the label in a 22px-radius tile, for shortcut grids.
- A tile without text (`aria-label` only) makes a round quick toggle.

## Fields and the composer

```html
<label class="tg-field">
  <svg class="tg-icon" aria-hidden="true">…</svg>
  <input type="search" placeholder="Search" aria-label="Search">
  <button type="button" class="tg-icon-btn is-plain" aria-label="Filters">…</button>
</label>

<div class="tg-tide tg-tide-bottom">
  <form class="tg-dock">
    <div class="tg-composer tg-regular">
      <button type="button" class="tg-icon-btn is-plain" aria-label="Attach">…</button>
      <input placeholder="Message" aria-label="Message">
    </div>
    <button class="tg-orb" aria-label="Send">…</button>
  </form>
</div>
```

Typing surfaces never dent. On focus the rim goes to full strength and a 1.5px accent ring and soft glow appear in 200ms.

## Switch and slider

```html
<input class="tg-switch" type="checkbox" role="switch" checked aria-label="Run reminders">
<input class="tg-slider" type="range" min="0" max="100" value="60" aria-label="Brightness">
```

- The switch is 52 × 32px; its on track is Deep. The thumb glides and stretches; the kit marks a `selection` haptic on change.
- The slider is a 44px jelly track with a Deep fill and a slim Deep handle bar that thickens while dragged. The kit keeps `--tg-value` (0 to 1) in sync; call `Tideglass.sync(el)` after setting the value from code.

## Cards, lists and rows

```html
<div class="tg-list tg-grain" style="--tg-row-inset:68px">
  <a class="tg-row" href="/runs/1">
    <span class="tg-thumb tg-shallow"><svg class="tg-icon">…</svg></span>
    <span class="tg-row-main">
      <span class="tg-row-title"><span>Riverside loop</span><span class="tg-row-meta">7:10 AM</span></span>
      <span class="tg-row-sub">6.2 km · 31:04 · 5:01 /km</span>
    </span>
  </a>
</div>
```

- `.tg-row-title` holds the title (one line, ellipsis) and `.tg-row-meta` (Label, tabular). `.tg-row-sub` clamps to two lines.
- Separators are inset hairlines; set `--tg-row-inset` to align them with the text.
- Interactive rows (`a.tg-row`, `button.tg-row`, `.tg-row[role="button"]`) dent as L and tint while pressed. Add `data-hold` for a long-press.
- `.tg-card` is a 22px-radius Solid sea glass panel with 16px padding.

## Message bubbles

```html
<div class="tg-bubble is-in">Still on for Saturday?<span class="tg-bubble-meta">9:12 AM</span></div>
<div class="tg-bubble is-out" data-press="l" data-hold>Yes, I'll drive<span class="tg-bubble-meta">9:20 AM</span></div>
```

- `is-in` is Foam, `is-out` is Shallow; the tail corner flattens to 6px and new bubbles arrive from it (`.tg-arrive`).
- `.tg-bubble-meta` floats to the end of the last line in Micro.
- Bubbles are Solid. Never blur them, never dent them on tap.
- Typing status: `<span class="tg-typing"><i></i><i></i><i></i></span>`.

## Menus, sheets and toasts

```html
<div class="tg-menu tg-thick tg-grain" role="menu" hidden>
  <button class="tg-menu-item" role="menuitem"><svg class="tg-icon">…</svg>Share</button>
  <hr>
  <button class="tg-menu-item is-danger" role="menuitem" data-press="firm">Delete</button>
</div>

<div class="tg-scrim" hidden></div>
<div class="tg-sheet tg-thick tg-grain" role="dialog" aria-modal="true" hidden>
  <span class="tg-grabber"></span>
  …
</div>
```

```js
Tideglass.open(menu, button);   // grows from the button
Tideglass.close(menu);          // leaves quietly, then sets hidden
Tideglass.toast('Saved');       // Thick capsule above the dock, gone after 2.8s
```

## Structure helpers

| Class | Role |
|---|---|
| `.tg-appbar`, `.tg-appbar-title` | The row inside a top tide: 56px tall plus the safe area; the title truncates |
| `.tg-dock` | The row inside a bottom tide: holds the tab bar or composer and the orb |
| `.tg-tabbar.is-fill` | Lets the tab bar take the remaining width beside an orb |
| `.tg-tile-icon`, `.tg-tile-text` | The icon disc and the title + `small` subtitle of a tile |
| `.tg-row-main` | The flexible middle of a row |
| `.tg-icon` | Stroke rules for inline SVG icons |
| `.tg-theme` | Marks a scope root that recomputes theme roles from overridden brand inputs |

## Type and text utilities

`.tg-type-title`, `.tg-type-heading`, `.tg-type-body`, `.tg-type-body-strong`, `.tg-type-label`, `.tg-type-label-strong`, `.tg-type-micro` set the type styles. `.tg-text-2` sets secondary text, `.tg-accent` the accent color, `.tg-num` tabular figures, and `.tg-sr-only` hides text visually while keeping it for screen readers.

## Motion classes

`.tg-enter`, `.tg-exit`, `.tg-arrive` and `.tg-drop` play the moments in [Motion](05-motion.md). Add them once; `Tideglass.open()` and `close()` manage enter and exit for you.

## Rules

- **CP-1** A component **must** state its material, layer, thickness and tier, and match this table unless a rule elsewhere allows otherwise.
- **CP-2** Toggles **must** expose state with `aria-pressed`, `aria-checked` or a native checked input, and the look **must** follow that state.
- **CP-3** Icons inside glass bars and fields **must** use `is-plain` (or no surface) so glass never stacks three deep.
- **CP-4** Destructive menu items and buttons **must** use danger text and the Firm tier.
- **CP-5** Overlays **must** be dismissible (Escape, scrim tap or a close control) and **must** trap or return focus correctly.
