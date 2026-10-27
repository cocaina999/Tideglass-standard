# Changelog

Tideglass follows [semantic versioning](https://semver.org). The spec, the kit and the tokens share one version number; see [spec/README.md](spec/README.md#versioning) for what counts as major, minor and patch.

## 1.0.0

The first release of the standard.

### Standard

- Twelve chapters with 86 numbered rules: foundations, color, materials, touch, motion, navigation, layout, type and icons, components, accessibility, platforms and review, plus a glossary.
- Three materials, each chosen by its job: **sea glass** to read, **jelly** to touch, **tide** to see through.
- Four layers (Foam, Shallow, Lagoon, Deep) and four thicknesses (Solid, Thin, Regular, Thick).
- Dent and peel touch in six tiers (S, M, L, Firm, Lift, None), with lean, drag-off, long-press and keyboard parity.
- Three springs (Glide, Firm, Peel) with one definition across CSS, SwiftUI, Compose and Motion.
- Fifteen contrast pairs (CT-1 to CT-15), measured against the worst backdrop.

### Kit

- `kit/tideglass.css`: tokens, theme roles for light and dark, materials, the tide, press states, motion and components, with reduce motion, reduce transparency, increase contrast, forced colors and print.
- `kit/tideglass-presets.css`: six sea glass presets (seafoam, cornflower, lavender, amber, kelly, coral).
- `kit/tideglass.js`: dent and peel, long-press, the draggable selection blob, switch stretch, slider sync, overlays, toasts and a haptics bridge for native shells.

### Tokens and tools

- `tokens/tideglass.tokens.json` in the W3C Design Tokens Format (2025.10), generated from the CSS.
- `npm run check`, `smoke`, `tokens`, `springs` and `shots`.

### Migrating from the Teal Glass draft

Tideglass replaces the earlier "Teal Glass" draft. The name changed because the color comes from the brand, not from teal; the material is what stays.

The six brand inputs (`--tg-tint`, `--tg-deep`, `--tg-ink`, `--tg-rim-a/b/c`) and the layer classes keep their names, so a draft brand carries over unchanged.

| Teal Glass draft | Tideglass 1.0 |
|---|---|
| "Jelly where you touch, sea glass where you read" | Three materials: sea glass, jelly and **tide**, the see-through layer at scroll edges |
| Floating bars as translucent glass | Edge bars are tides (`.tg-tide`); the tab bar and composer float as jelly inside a bottom tide |
| `.tg` base class | `.tg-glass` for sea glass, `.tg-jelly` for jelly, or a component class (`.tg-card`, `.tg-btn`…) |
| `.tg-float` | `.tg-regular` |
| `backdrop-filter: … saturate(130%)` | `saturate(110%)`: sea glass is muted, never vivid |
| `class="tg-press"` on every control | Kit components are pressable on their own; `.tg-press` or `data-press` for anything else |
| `data-press="key"` / `data-press="icon"` | `data-press="lift"` for small keys; icons take the S tier by size |
| `.is-dent` class, `--ox` / `--oy` | `data-tg-state` (`dent`, `peel`, `held`), `--tg-ox` / `--tg-oy` |
| `--tg-jelly` spring | Removed: the press release is the `tg-peel` keyframes; things that travel use `--tg-glide` |
| Increase contrast rim: ink at 35% | Text color at 40% |
| Keyboard focus in the deep color | Accent color (the same hue, adjusted per theme) |
| Contrast by eye | Fifteen contrast pairs, checked for every preset in both themes |
| Teal as the identity | Six presets; seafoam is only the default |
