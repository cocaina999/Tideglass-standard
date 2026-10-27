# 12 · Review

This chapter is for the person signing off a screen. It gives the audit procedure, the ship checklist with every rule in one place, and the mistakes that come up most.

## Audit a screen in eight passes

Do the passes in order. Each one assumes the one before it is clean.

1. **Inventory.** List every element on the screen. For each, write its four answers: material, layer, thickness and tier ([Components](09-components.md) has the table). An element you cannot answer for is the first finding.
2. **Job check.** Read the answers back against the three questions in [Foundations](01-foundations.md#the-one-rule). Is everything you read on sea glass, everything you touch jelly, and every edge that content passes under a tide? Is there one Deep?
3. **Hue swap.** Switch the brand to a preset far from yours (amber if you are cool, cornflower if you are warm). Anything that keeps its old color is hard-coded (FD-4, CO-1).
4. **Worst backdrop.** Scroll the darkest and lightest content you have under every floating bar, menu and sheet. Text must stay readable without squinting; if it doesn't, the glass is too thin for its text (MA-1, CO-6).
5. **Touch.** Press every control with a finger or a mouse: a quick tap, a long hold, a drag off and back, a press that turns into a scroll. Then do the same with Tab, Space and Enter.
6. **Motion.** Open and close every overlay, switch every tab and segment, push and pop a page. Watch for a second bounce, a big thing that overshoots, or anything that moves at rest.
7. **Settings.** Repeat passes 4 to 6 with reduce motion, reduce transparency, increase contrast, forced colors, dark mode and 200% text. The demo page has a switch for each except forced colors; in an app, use the OS settings or the `data-tg-*` attributes.
8. **Record.** Write each finding as a rule number and one line ("breaks NA-4: Saved tab shows selection by color only"). Write each departure from a *should* with its reason (FD-5).

## Ship checklist

Every rule in the standard, grouped by chapter. A screen is conformant when every *must* line is checked. *Should* lines are marked; leaving one unchecked needs a written reason.

### Foundations

- [ ] **FD-1** Every element's material comes from its job: sea glass to read, jelly to touch, tide to see through.
- [ ] **FD-2** Nothing moves at rest except live status and one optional hero.
- [ ] **FD-3** No lensing, no moving specular highlights, no color borrowed from content.
- [ ] **FD-4** Brand color enters only through the six brand inputs.
- [ ] **FD-5** Every departure from a *should* has a written reason.

### Color

- [ ] **CO-1** Components use theme roles, never raw hex or brand inputs.
- [ ] **CO-2** The brand passes CT-1 to CT-15 in light and dark (`npm run check` with the brand added as a preset).
- [ ] **CO-3** White appears only on Deep, and all text on Deep is `--tg-on-deep`.
- [ ] **CO-4** Text on Deep sits in the label band.
- [ ] **CO-5** No secondary text on Lagoon or Deep.
- [ ] **CO-6** Secondary text on floating glass uses Thick, or sits over a tide.
- [ ] **CO-7** Thin glass carries icons only.
- [ ] **CO-8** Text in a tide is primary; actions in a tide are jelly controls.
- [ ] **CO-9** Status colors keep their meaning and always come with an icon or words.
- [ ] **CO-10** *(should)* Shadows are tinted, not gray, in light mode.

### Materials

- [ ] **MA-1** Text sits only on Solid glass, Regular or Thick glass that passes CT-7, or a tide band that passes CT-10.
- [ ] **MA-2** Thin glass carries icons only.
- [ ] **MA-3** Sea glass moves no more than the L tier under a finger, and never loops.
- [ ] **MA-4** The rim is 1px and still.
- [ ] **MA-5** Tides have no rim, shadow, grain or press state.
- [ ] **MA-6** Tide text sits in the dense band, never in the feather.
- [ ] **MA-7** At most two glass layers stack, and the upper one is Thick.
- [ ] **MA-8** No blur on list items or bubbles. *(should)* Six live blurs at most.
- [ ] **MA-9** Deep is solid. *(should)* One Deep element per screen.
- [ ] **MA-10** *(should)* Prism only on jelly at least 96px wide.
- [ ] **MA-11** No grain on controls smaller than 96px.

### Touch

- [ ] **TO-1** Every pressable control uses dent and peel through a tier.
- [ ] **TO-2** A quick tap still shows the whole dent (90ms minimum) before it peels.
- [ ] **TO-3** The dent starts at the touch point.
- [ ] **TO-4** Dragging 40px off a control cancels it, even if the finger returns.
- [ ] **TO-5** A press that turns into a scroll drops the dent at once, with no peel.
- [ ] **TO-6** Only S and M lean; nothing inside a scroller leans.
- [ ] **TO-7** Text you read never squashes: bubbles don't dent on tap, rows are L at most.
- [ ] **TO-8** One visible rebound at most; Firm never overshoots.
- [ ] **TO-9** Roles only make a tier calmer.
- [ ] **TO-10** Presses animate transform and tint only.
- [ ] **TO-11** Space and Enter give the same dent and peel as a finger.
- [ ] **TO-12** Hover moves nothing.
- [ ] **TO-13** A long-press never also clicks.
- [ ] **TO-14** Haptics fire only for the listed moments, never as sound.
- [ ] **TO-15** Disabled controls fire no haptics.

### Motion

- [ ] **MO-1** Only the Glide, Firm and Peel springs.
- [ ] **MO-2** Things larger than half the screen move on Firm.
- [ ] **MO-3** Exits don't overshoot.
- [ ] **MO-4** Overlays grow from the element that opened them.
- [ ] **MO-5** Only live status and the hero loop, and status stops when the work stops.
- [ ] **MO-6** Color and opacity never bounce.
- [ ] **MO-7** With reduce motion, nothing squashes, stretches, leans or overshoots, and transitions finish within 150ms.
- [ ] **MO-8** Motion animates transform and opacity, not layout (the blob's size is the exception).

### Navigation

- [ ] **NA-1** Full-width edge bars are tides; floating bars are jelly on a tide.
- [ ] **NA-2** Top bar text is primary, in the dense band; its actions are jelly controls.
- [ ] **NA-3** Each tab bar or segment has one blob that glides; selection never jumps.
- [ ] **NA-4** The selected tab has the blob plus a second cue.
- [ ] **NA-5** *(should)* One orb, beside the tab bar or composer, never inside the tab bar.
- [ ] **NA-6** Pushes and pops move on Firm; tab switches cross-fade.
- [ ] **NA-7** Sheets and menus close on Escape and return focus to the opener.
- [ ] **NA-8** Selection changes mark a `selection` haptic.
- [ ] **NA-9** Arrow keys move through every blob host.

### Layout

- [ ] **LA-1** Touch targets are at least 44 × 44px, or extend their hit area to it.
- [ ] **LA-2** Corners nest (inner = outer − padding). *(should)* Touch controls are capsules.
- [ ] **LA-3** Spacing sits on the 4px grid.
- [ ] **LA-4** Layouts grow with text size; nothing important truncates at 200%.
- [ ] **LA-5** The last item is reachable above the dock and the home indicator.

### Type and icons

- [ ] **TY-1** One family, the five sizes, the two weights.
- [ ] **TY-2** Text is sized in `rem` or dynamic type.
- [ ] **TY-3** Changing or aligned numbers use tabular figures.
- [ ] **TY-4** Tide hierarchy comes from size and weight, not a lighter color.
- [ ] **IC-1** One stroke per icon size, round caps, `currentColor`.
- [ ] **IC-2** Icons fill only to show selection.
- [ ] **IC-3** Every icon-only control has an accessible name.

### Components

- [ ] **CP-1** Every component matches its material, layer, thickness and tier in the table.
- [ ] **CP-2** Toggles expose state with `aria-pressed`, `aria-checked` or a checked input, and the look follows it.
- [ ] **CP-3** Icons inside glass bars and fields are `is-plain`.
- [ ] **CP-4** Destructive actions use danger text and the Firm tier.
- [ ] **CP-5** Overlays are dismissible and handle focus correctly.

### Accessibility

- [ ] **AX-1** Every color pair meets its contrast against the worst backdrop.
- [ ] **AX-2** Reduce motion, reduce transparency, increase contrast and forced colors each give their outcome.
- [ ] **AX-3** Focus is visible on every interactive element, at 3:1, and doesn't animate.
- [ ] **AX-4** Every touch action has a keyboard and screen-reader equivalent.
- [ ] **AX-5** No state is shown by color alone.
- [ ] **AX-6** Touch targets are at least 44 × 44px.
- [ ] **AX-7** Text scales to 200% without loss of content.

### Platforms

- [ ] **PL-1** Native code uses the spec's poses, timings and springs.
- [ ] **PL-2** No system glass material as the visible surface.
- [ ] **PL-3** Every OS accessibility setting is honored.
- [ ] **PL-4** Tokens come from the token file or the CSS, never retyped.

## The don'ts

The mistakes reviews catch most often, with the rule each one breaks.

| Don't | Do instead | Rule |
|---|---|---|
| Put a light gray caption on a floating Regular bar | Make the bar Thick, put it on a tide, or use primary text | CO-6 |
| Use a bare accent-colored "Edit" link in the top bar | Use a jelly icon button or button | CO-8, NA-2 |
| Make the tab bar a full-width solid strip | Float a jelly capsule in a bottom tide | NA-1 |
| Show the selected tab by color only | Blob plus icon fill or weight | NA-4, AX-5 |
| Snap the selection from tab to tab | One blob that glides | NA-3 |
| Put the orb inside the tab bar, or add a second Deep button | One orb beside the bar | NA-5, MA-9 |
| Squash a whole message bubble on tap | Bubbles are still; long-press charges at L | TO-7 |
| Let a row or card wobble | Rows and cards are L: a slight even dent, no rebound | TO-6, TO-8 |
| Bounce a sheet into place | Big things move on Firm | MO-2 |
| Bounce a "Buy" button | Costly actions are Firm | TO-9, CP-4 |
| Write a custom press animation for one button | Pick a tier | TO-1 |
| Blur every bubble or list row | Solid surfaces inside scrollers | MA-8 |
| Stack a menu on a sheet on a card | Two glass layers at most, upper one Thick | MA-7 |
| Animate the rim, or make it follow the pointer | The rim is still | MA-4, FD-3 |
| Use neutral gray shadows | Tinted shade and caustic | CO-10 |
| Add a text shadow to rescue text on glass | Thicker glass | MA-1 |
| Hard-code a hex color in a component | Use a theme role | CO-1, FD-4 |
| Add a glass surface around icons inside the composer | `is-plain` icon buttons | CP-3 |
| Fade the bar's title into the feather | Keep text in the dense band | MA-6 |
| Leave a spinner looping after the result arrives | Stop the loop with the work | MO-5 |

## What the tools check

`npm run check` and `npm run smoke` cover the kit itself: contrast pairs for every preset in both themes, spring curves, generated tokens, versions, links, and the press, blob, overlay and settings behaviors in a real browser. They cannot see your screens. A product built on the kit still needs passes 1 to 8, because the most common failures (wrong material, two Deeps, a gray caption on Regular glass) are choices, not code.

To check a custom brand, add it as a preset in `kit/tideglass-presets.css` and run `npm run check`; every contrast pair is measured for it in both themes.
