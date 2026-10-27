# 4 · Touch: dent and peel

## The feel

You press into soft jelly and it gives a little. When you lift your finger it clings for a beat, pulls up and out toward you, then settles. One rebound, never a wobble that keeps going.

Every press has three phases:

| Phase | When | What happens |
|---|---|---|
| **Dent** | Finger down | The control squashes (a little wider, a little shorter), sinks a hair, and its tint deepens about 6%. It gets there in 120ms and holds while you press. The dent starts where the finger is. |
| **Lean** | Finger held and moved | S and M controls follow the finger by 30% of the drag, at most 3px. This is the sticky part. |
| **Peel** | Finger up | The control stretches the other way (narrower, taller), lifts toward you, then settles. 440ms in all. |

Peel timing: dent pose → peel pose at 38% (ease-out), peel pose → settle pose at 70%, settle → rest at 100%.

## Tiers

**Size picks the tier.** A role can only make it calmer, never stronger. The kit measures width at press time when `data-press` is not set.

| Tier | For | Dent: x, y, sink | Peel: x, y, lift | Settle |
|---|---|---|---|---|
| **S** | Up to 56px wide: icon buttons, the orb, avatars, switches | 1.035, 0.93, 1px | 0.985, 1.05, −1.5px | 1.008, 0.992 |
| **M** | 57–160px: chips, pills, tabs, tiles, segments, short buttons | 1.02, 0.955, 0.5px | 0.992, 1.03, −1px | 1.004, 0.996 |
| **L** | Wider: rows, cards, wide buttons | 0.985 even | 1.004 even | none |
| **Firm** | Buy, pay, confirm, delete: anything with money or loss | 0.97 even, no tint | none: eases back on the Firm spring (360ms, no overshoot) | none |
| **Lift** | Small keys the finger covers: emoji, reaction pickers | grows to 1.15, rises 4px | glides back on the Glide spring | none |
| **None** | Text links, disabled controls, typing surfaces | links dim to 60% | fade back in 150ms | none |

Set a tier explicitly with `data-press="s|m|l|firm|lift|none"`. `.tg-key` defaults to Lift.

## Long-press

Add `data-hold` to rows, cards and bubbles that have a long-press action.

- The dent **charges**: it deepens to 0.965 over 350ms.
- At the threshold it **pops** out (0.965 → 1.012 → 1 in 320ms), fires `tg-hold`, and marks a `hold` haptic.
- Whatever the long-press opens (a menu, a reaction picker) **grows from the pressed element**.
- The release after a long-press does not click.

## Every control

| Control | Tier | Release and extras |
|---|---|---|
| Main action orb (send, mic, new) | S | Peel. Icon swaps (mic → send) drop in: scale 0.25 → 1.16 → 0.93 → 1, riding the peel. |
| Icon button (menu, back, more) | S | Peel. |
| Toggle icon button (+ → ×, save) | S | Peel, then the icon turns or fills on the Glide spring. Its menu grows out of the button. |
| Chip, pill, tile | M | Peel. Selected state is Lagoon (chips) or Deep (toggle tiles). |
| Tab bar, segmented control | M on the touched item | Peel. The shared blob glides to it (see [Navigation](06-navigation.md#the-blob)). Selection haptic. |
| Switch | S | The thumb glides and stretches 14% along its travel; the track tint fades in 150ms. Selection haptic. |
| Row, card | L | Long-press charges and pops when it has `data-hold`. |
| Message bubble | None on tap | Long-press as rows (`data-press="l" data-hold`). Swipe to reply follows the finger with a rubber band; past 56px the reply icon drops in with a light tick; it springs back on Glide. |
| Text field, composer | None | On focus the rim brightens and a soft glow appears in 200ms. Still at rest. |
| Buy, pay, confirm, delete | Firm | No peel, no wobble. Success shows when the action is done, not on the press. |
| Emoji and reaction keys | Lift | Glide back. |
| Text link | None | Dims, then fades back. |
| Disabled | None | Content at 40%, no haptic, no dent. |

## Rules of the press

- **TO-1** Every pressable control **must** use dent and peel through a tier. No custom press animation for a single button.
- **TO-2** Every tap **must** show the whole dent: if the finger lifts before 90ms, finish the dent, then peel.
- **TO-3** The dent **must** start where the finger is (transform origin at the touch point).
- **TO-4** Dragging 40px or more off a control **must** peel it back without firing, even if the finger returns.
- **TO-5** Scrolling wins: if a scroll starts, the dent **must** drop at once, with no peel.
- **TO-6** Only S and M **may** lean. Rows, cards and anything inside a scrolling list **must not**.
- **TO-7** Text you read **must not** squash: bubbles do not dent on tap, rows are L at most, and labels move only inside S or M controls.
- **TO-8** A press **must** show one visible rebound at most. Firm **must not** overshoot.
- **TO-9** A role **may** make a tier calmer (S → M → L → Firm), never stronger.
- **TO-10** Presses **must** animate transform and tint only. `will-change` is set while pressed and removed after.
- **TO-11** Keyboard activation **must** give the same feedback: Space dents on keydown and peels on keyup; Enter dents and peels at once.
- **TO-12** Hover **must not** move anything. It may deepen the tint by about 3%.
- **TO-13** A long-press **must not** also fire a click.

## Haptics

Haptics mark a decision, not a touch.

| Moment | Kind | iOS | Android |
|---|---|---|---|
| Tab, segment, switch or toggle tile changes | `selection` | `UISelectionFeedbackGenerator` | `CLOCK_TICK` |
| The main action fires (send) | `impact` | soft impact, intensity 0.5 | `VIRTUAL_KEY` |
| Long-press threshold | `hold` | soft impact, intensity 0.8 | `LONG_PRESS` |
| A swipe passes its threshold | `threshold` | light impact, intensity 0.4 | `CLOCK_TICK` |
| Everything else | none | none | none |

**On the web** there are no reliable haptics, and the UI is silent. The kit marks each moment with a `tg-haptic` event (`detail.kind` is one of the kinds above) so a native shell (Capacitor, React Native WebView, Tauri) can play it:

```js
document.addEventListener('tg-haptic', e => NativeHaptics.play(e.detail.kind));
```

Mark a main action with `data-haptic="impact"`; the kit fires the event on click.

- **TO-14** Haptics **must** fire only for the moments in the table, and **must not** be faked with sound.
- **TO-15** Disabled controls **must not** fire haptics.
