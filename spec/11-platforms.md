# 11 · Platforms

## Web kit

Three files implement the standard. No build step, no dependencies.

| File | What it holds |
|---|---|
| [`kit/tideglass.css`](../kit/tideglass.css) | Tokens, theme roles, materials, layers, thickness, the tide, touch states, motion, components, accessibility |
| [`kit/tideglass-presets.css`](../kit/tideglass-presets.css) | Six sea glass brand presets (optional) |
| [`kit/tideglass.js`](../kit/tideglass.js) | Dent and peel, long-press, the blob, switch stretch, slider sync, overlays, the haptics bridge (~9 KB unminified) |

### Install

Copy the three files into your project, or install from the repository:

```sh
npm install github:cocaina999/Tideglass-standard
```

```js
import 'tideglass/css';
import 'tideglass/presets.css';   // optional
import Tideglass from 'tideglass'; // also sets window.Tideglass
```

Or link them directly:

```html
<link rel="stylesheet" href="kit/tideglass.css">
<script src="kit/tideglass.js" defer></script>
```

### A first screen

```html
<!doctype html>
<html lang="en" data-tg-brand="seafoam">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <link rel="stylesheet" href="kit/tideglass.css">
  <link rel="stylesheet" href="kit/tideglass-presets.css">
</head>
<body class="tg-ground tg-grain">
  <header class="tg-tide tg-tide-top" data-tide="auto">
    <div class="tg-appbar"><span class="tg-appbar-title">Inbox</span></div>
  </header>
  <main style="padding:16px">
    <div class="tg-card">Read on sea glass.</div>
  </main>
  <div class="tg-tide tg-tide-bottom">
    <nav class="tg-dock">
      <div class="tg-tabbar tg-regular is-fill">
        <span class="tg-blob" aria-hidden="true"></span>
        <a class="tg-tab" href="#" aria-current="page">Home</a>
        <a class="tg-tab" href="#">You</a>
      </div>
      <button class="tg-orb" aria-label="New" data-haptic="impact">+</button>
    </nav>
  </div>
  <script src="kit/tideglass.js"></script>
</body>
</html>
```

### Attributes you set

| Attribute | On | Effect |
|---|---|---|
| `data-tg-brand="seafoam\|cornflower\|lavender\|amber\|kelly\|coral"` | `<html>` or any element | Applies a preset (needs the presets file) and recomputes theme roles there |
| `data-tg-theme="light\|dark"` | `<html>` or any element | Forces a theme; omit to follow the OS |
| `data-tg-motion="reduce\|full"` | `<html>` | In-app reduce motion, or an explicit opt back in |
| `data-tg-transparency="reduce"` | `<html>` | In-app reduce transparency |
| `data-tg-contrast="more"` | `<html>` | In-app increase contrast |
| `data-press="s\|m\|l\|firm\|lift\|none"` | a control | Names its tier; also makes any element pressable |
| `data-hold` | a control | Enables long-press (fires `tg-hold`) |
| `data-haptic="impact\|selection\|hold\|threshold"` | a control | Marks a haptic moment on click |
| `data-tide="auto"` | a `.tg-tide` | The tide rises only once content scrolls under it |
| `data-tg-blob` | any container | Gives it a selection blob (automatic for `.tg-tabbar` and `.tg-seg`) |

### State the kit writes

| Attribute or property | Meaning |
|---|---|
| `data-tg-tier` | The tier in use for the current press |
| `data-tg-state="dent\|peel\|held"` | The press phase. Style hooks for custom components. |
| `data-tg-scrub` | On a blob host while the finger drags the blob |
| `--tg-ox`, `--tg-oy` | Press origin (the touch point) |
| `--tg-lx`, `--tg-ly` | Lean offset |
| `--tg-value` | A slider's position, 0 to 1 |
| `--tg-press` | The press tint amount, 0 to 1 (a registered property, so it animates) |
| `--tg-tide` | The tide's strength, 0 to 1 (animated by `data-tide="auto"`) |

### Events

| Event | Fired on | `detail` |
|---|---|---|
| `tg-hold` | the long-pressed element | `{ x, y }` |
| `tg-change` | a blob host, when the selection changes | `{ item, index, previous }` |
| `tg-haptic` | the element, bubbling to `document` | `{ kind }` |

### JavaScript API

```js
Tideglass.version             // "1.0.0"
Tideglass.init(root?)         // set up blob hosts and sliders under root (automatic, also for added DOM)
Tideglass.select(host, item)  // select an item in a tab bar or segmented control
Tideglass.open(el, opener?)   // show an overlay, growing from opener; returns a promise
Tideglass.close(el)           // hide it quietly; returns a promise
Tideglass.toast(text, { duration, parent })
Tideglass.sync(slider)        // after setting a slider's value from code
Tideglass.haptic(kind, el?)   // mark a haptic moment yourself
Tideglass.reducedMotion()     // true when reduce motion is on (OS or data attribute)
```

The script is safe to load on the server (it exports no-ops) and safe to load twice.

### Frameworks

The kit is plain classes and attributes, so it works the same in React, Vue, Svelte, Solid or server templates.

- Render the `<span class="tg-blob">` yourself inside tab bars and segments, so your framework owns that node.
- Keep selection state in your framework and mirror it in `aria-selected` / `aria-current`; listen to `tg-change` to learn about scrubs and arrow keys.
- A MutationObserver sets up blob hosts and sliders added later; `Tideglass.init(node)` does it on demand.

### Tailwind and other utility CSS

Map utilities to the tokens rather than copying values:

```js
// tailwind.config.js (v3) — in v4, use @theme with the same var() values
theme: { extend: {
  colors: { tint: 'var(--tg-tint)', deep: 'var(--tg-deep)', ink: 'var(--tg-text)' },
  borderRadius: { l: 'var(--tg-r-l)', xl: 'var(--tg-r-xl)' },
  transitionTimingFunction: { glide: 'var(--tg-glide)', firm: 'var(--tg-firm)' },
}}
```

Keep the materials as kit classes; utilities are for layout and spacing.

### Browser support

The kit targets evergreen browsers: Chrome and Edge 115+, Safari 17.2+, Firefox 128+. It degrades gracefully:

| Feature | Without it |
|---|---|
| `linear()` easing | Glide and Firm fall back to cubic-bezier curves |
| `@property` | The press tint does not fade; the squash still works |
| Scroll-driven animations | `data-tide="auto"` tides are always on |
| `backdrop-filter` | Floating glass shows its tint without blur (still legible: contrast is measured without relying on blur) |
| Pseudo-element animation | The switch thumb glides without stretching |

### Performance

- Blur is the main cost. Respect the budget of about six live blurs per screen, and never blur inside scrolling lists.
- Pools and grain live on fixed layers, so scrolling does not repaint them.
- Presses animate `transform` and one registered number; `will-change` is set only while pressed.
- Long lists: keep rows Solid and use `content-visibility: auto` on offscreen sections.

## Design tokens

[`tokens/tideglass.tokens.json`](../tokens/tideglass.tokens.json) follows the W3C Design Tokens Format Module 2025.10. It holds the brand inputs, presets, resolved theme roles for light and dark, opacities, blur, radius, space, size, type, durations, easings, springs and press poses. It is generated from the CSS by `npm run tokens`; edit the CSS, never the JSON. Use it with Style Dictionary, Tokens Studio or your own pipeline to feed native platforms and design tools.

## SwiftUI

Build the surface yourself. System materials are vivid and lens-like, which is the Apple look; use the thinnest one only as a blur source, then paint the tint over it.

> These recipes are reference sketches for iOS 18+. They follow the spec's numbers but are not yet compiled in this repository's CI.

```swift
import SwiftUI

struct TGBrand {
    var tint = Color(red: 0.302, green: 0.714, blue: 0.737)   // #4DB6BC
    var deep = Color(red: 0.055, green: 0.400, blue: 0.439)   // #0E6670
    var rim: [Color] = [.white,
                        Color(red: 0.741, green: 0.902, blue: 1.000),   // #BDE6FF
                        Color(red: 0.957, green: 0.722, blue: 0.894),   // #F4B8E4
                        Color(red: 1.000, green: 0.894, blue: 0.651),   // #FFE4A6
                        .white]
}

enum TGLayer { case foam, shallow, lagoon
    func mix(dark: Bool) -> (Double, Double) {
        switch self {
        case .foam:    dark ? (0.07, 0.13) : (0.04, 0.12)
        case .shallow: dark ? (0.18, 0.30) : (0.22, 0.45)
        case .lagoon:  dark ? (0.26, 0.40) : (0.30, 0.62)
        }
    }
}

enum TGThickness { case solid, thin, regular, thick
    func opacity(dark: Bool) -> Double {
        switch self {
        case .solid: 1
        case .thin: dark ? 0.64 : 0.56
        case .regular: dark ? 0.76 : 0.68
        case .thick: dark ? 0.88 : 0.84
        }
    }
}

struct TGSurface: ViewModifier {
    var layer = TGLayer.foam
    var thickness = TGThickness.solid
    var jelly = false
    var radius: CGFloat = 22
    var brand = TGBrand()
    @Environment(\.colorScheme) private var scheme
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    func body(content: Content) -> some View {
        let dark = scheme == .dark
        let shape = RoundedRectangle(cornerRadius: radius, style: .continuous)
        let base = dark ? Color(red: 0.07, green: 0.10, blue: 0.11) : .white
        let (p1, p2) = layer.mix(dark: dark)
        let floating = thickness != .solid && !reduceTransparency
        let body = LinearGradient(colors: [base.mix(with: brand.tint, by: p1), base.mix(with: brand.tint, by: p2)],
                                  startPoint: .top, endPoint: .bottom)
        return content
            .background {
                ZStack {
                    if floating { shape.fill(.ultraThinMaterial) }                           // blur source only
                    shape.fill(body.shadow(.inner(color: brand.tint.opacity(dark ? 0.28 : 0.40), radius: 12, y: -10)))
                        .opacity(floating ? thickness.opacity(dark: dark) : 1)
                    if jelly {                                                               // still sheen
                        shape.fill(RadialGradient(colors: [.white.opacity(dark ? 0.10 : 0.55), .clear],
                                                  center: UnitPoint(x: 0.5, y: -0.16), startRadius: 0, endRadius: 120))
                    }
                }
            }
            .overlay {                                                                       // the still rim
                shape.strokeBorder(LinearGradient(colors: brand.rim, startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1)
                    .opacity(dark ? 0.42 : 0.8)
            }
            .shadow(color: dark ? .black.opacity(0.45) : brand.deep.opacity(0.16), radius: 1, y: 1)
            .shadow(color: jelly ? brand.tint.opacity(dark ? 0.24 : 0.42) : brand.deep.opacity(0.16), radius: 14, y: 10)
    }
}

extension View {
    func tgSurface(_ layer: TGLayer = .foam, _ thickness: TGThickness = .solid, jelly: Bool = false, radius: CGFloat = 22) -> some View {
        modifier(TGSurface(layer: layer, thickness: thickness, jelly: jelly, radius: radius))
    }
}
```

Dent and peel as a `ButtonStyle`, playing the same poses and timings as the web keyframes:

```swift
enum TGTier { case s, m, l, firm, lift }

struct TGPose: Equatable {
    var x: CGFloat = 1, y: CGFloat = 1, dy: CGFloat = 0
    static let rest = TGPose()
}

extension TGTier {
    var dent: TGPose { switch self {
        case .s: TGPose(x: 1.035, y: 0.93, dy: 1)
        case .m: TGPose(x: 1.02, y: 0.955, dy: 0.5)
        case .l: TGPose(x: 0.985, y: 0.985)
        case .firm: TGPose(x: 0.97, y: 0.97)
        case .lift: TGPose(x: 1.15, y: 1.15, dy: -4) } }
    var peel: TGPose { switch self {
        case .s: TGPose(x: 0.985, y: 1.05, dy: -1.5)
        case .m: TGPose(x: 0.992, y: 1.03, dy: -1)
        default: TGPose(x: 1.004, y: 1.004) } }
    var settle: TGPose { switch self {
        case .s: TGPose(x: 1.008, y: 0.992)
        case .m: TGPose(x: 1.004, y: 0.996)
        default: .rest } }
}

struct TGPressStyle: ButtonStyle {
    var tier = TGTier.m
    func makeBody(configuration: Configuration) -> some View {
        TGPressBody(label: configuration.label, isPressed: configuration.isPressed, tier: tier)
    }
}

private struct TGPressBody<Label: View>: View {
    let label: Label
    let isPressed: Bool
    let tier: TGTier
    @State private var pose = TGPose.rest
    @State private var pressedAt = Date.distantPast
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        label
            .scaleEffect(x: pose.x, y: pose.y)
            .offset(y: pose.dy)
            .opacity(reduceMotion && isPressed ? 0.85 : 1)
            .onChange(of: isPressed) { _, pressed in
                guard !reduceMotion else { return }
                if pressed {
                    pressedAt = .now
                    withAnimation(.timingCurve(0.3, 0.7, 0.4, 1, duration: 0.12)) { pose = tier.dent }
                    return
                }
                // Every tap shows the whole dent (TO-2).
                let wait = max(0, 0.09 - Date.now.timeIntervalSince(pressedAt))
                DispatchQueue.main.asyncAfter(deadline: .now() + wait) { release() }
            }
    }

    private func release() {
        switch tier {
        case .firm: withAnimation(.spring(response: 0.3, dampingFraction: 1)) { pose = .rest }
        case .lift: withAnimation(.spring(response: 0.4, dampingFraction: 0.75)) { pose = .rest }
        default:
            withAnimation(.timingCurve(0.2, 0.7, 0.3, 1, duration: 0.167)) { pose = tier.peel } completion: {
                withAnimation(.timingCurve(0.4, 0, 0.5, 1, duration: 0.141)) { pose = tier.settle } completion: {
                    withAnimation(.timingCurve(0.3, 0, 0.3, 1, duration: 0.132)) { pose = .rest }
                }
            }
        }
    }
}
```

Haptics with `sensoryFeedback`:

```swift
.sensoryFeedback(.selection, trigger: selectedTab)
.sensoryFeedback(.impact(flexibility: .soft, intensity: 0.5), trigger: sentCount)
```

The tide: a `LinearGradient` of the ground color (74% → 0) over a thin material, masked with the same gradient, placed with `.safeAreaInset(edge: .top)` / `.bottom` so content scrolls beneath it.

## Jetpack Compose

> Reference sketch for Compose 1.7+. Not yet compiled in this repository's CI.

```kotlin
enum class TgTier(
    val dentX: Float, val dentY: Float, val sinkDp: Float,
    val peelX: Float, val peelY: Float, val liftDp: Float,
    val settleX: Float, val settleY: Float,
) {
    S(1.035f, 0.93f, 1f, 0.985f, 1.05f, -1.5f, 1.008f, 0.992f),
    M(1.02f, 0.955f, 0.5f, 0.992f, 1.03f, -1f, 1.004f, 0.996f),
    L(0.985f, 0.985f, 0f, 1.004f, 1.004f, 0f, 1f, 1f),
}

private val Dent = CubicBezierEasing(0.3f, 0.7f, 0.4f, 1f)

private fun peel(from: Float, pose: Float, settle: Float) = keyframes<Float> {
    durationMillis = 440
    from at 0 using CubicBezierEasing(0.2f, 0.7f, 0.3f, 1f)
    pose at 167 using CubicBezierEasing(0.4f, 0f, 0.5f, 1f)
    settle at 308 using CubicBezierEasing(0.3f, 0f, 0.3f, 1f)
}

fun Modifier.tideglassPress(interaction: InteractionSource, tier: TgTier = TgTier.M): Modifier = composed {
    val pressed by interaction.collectIsPressedAsState()
    val sx = remember { Animatable(1f) }
    val sy = remember { Animatable(1f) }
    val dy = remember { Animatable(0f) }
    LaunchedEffect(pressed) {
        if (pressed) {
            launch { sx.animateTo(tier.dentX, tween(120, easing = Dent)) }
            launch { sy.animateTo(tier.dentY, tween(120, easing = Dent)) }
            launch { dy.animateTo(tier.sinkDp, tween(120, easing = Dent)) }
        } else {
            launch { sx.animateTo(1f, peel(sx.value, tier.peelX, tier.settleX)) }
            launch { sy.animateTo(1f, peel(sy.value, tier.peelY, tier.settleY)) }
            launch { dy.animateTo(0f, peel(dy.value, tier.liftDp, 0f)) }
        }
    }
    graphicsLayer {
        scaleX = sx.value
        scaleY = sy.value
        translationY = dy.value * density
    }
}

// Springs (from `npm run springs`)
val TgGlide = spring<Float>(dampingRatio = 0.75f, stiffness = 247f)
val TgFirm = spring<Float>(dampingRatio = 1f, stiffness = 439f)

// Haptics
view.performHapticFeedback(HapticFeedbackConstants.CLOCK_TICK)   // selection
view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)  // impact
view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)   // hold
```

For blur on Android 12+, use `Modifier.blur` on a captured backdrop layer or `RenderEffect.createBlurEffect`; on older versions, fall back to Solid (the reduce-transparency look), which is always legible.

## Rules

- **PL-1** Native implementations **must** use the spec's poses, timings and springs, not platform defaults.
- **PL-2** Native implementations **must not** use system glass materials as the visible surface; a material may serve only as a blur source under the tint.
- **PL-3** Every platform **must** honor the OS accessibility settings listed in [Accessibility](10-accessibility.md).
- **PL-4** Tokens **must** come from `tokens/tideglass.tokens.json` (or the CSS), never be retyped by hand.
