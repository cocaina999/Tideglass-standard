# Glossary

Every Tideglass term in one place, with the chapter that defines it.

| Term | Meaning | Defined in |
|---|---|---|
| **Band** (dense band) | The opaque part of a tide that holds text. Text there passes CT-10. | [Materials](03-materials.md#tide) |
| **Blob** | The one Lagoon jelly capsule behind the selected tab or segment. It glides, stretches and can be dragged. | [Navigation](06-navigation.md#the-blob) |
| **Brand inputs** | The six colors that define a brand: `--tg-tint`, `--tg-deep`, `--tg-ink` and `--tg-rim-a/b/c`. Everything else is derived. | [Color](02-color.md#brand-inputs) |
| **Caustic** | The colored light a jelly control throws below itself, used in place of a gray drop shadow. | [Materials](03-materials.md#jelly) |
| **Charge** | The deepening dent of a long-press, from the press to the 350ms threshold. | [Touch](04-touch.md#long-press) |
| **Conformant** | A screen that meets every *must* in chapters 2 to 10. | [README](README.md#conformance) |
| **Contrast pair** | A text or icon color measured against a surface, CT-1 to CT-15. | [Color](02-color.md#contrast-pairs) |
| **Deep** | The darkest layer: solid jelly lit from inside, for the one main action and active toggles. Only Deep carries white text. | [Materials](03-materials.md#layers) |
| **Dent** | The first phase of a press: the control squashes and sinks under the finger, starting at the touch point. | [Touch](04-touch.md#the-feel) |
| **Departure** | A choice that differs from a *should*, written down with its reason. | [Foundations](01-foundations.md#rules) |
| **Drag-off** | Moving 40px or more off a pressed control, which cancels it. | [Touch](04-touch.md#rules-of-the-press) |
| **Edge** (thickness edge) | The 1px darker line inside a jelly control's bottom edge that makes it read as thick. | [Materials](03-materials.md#jelly) |
| **Feather** | The 24px soft edge of a tide, where content shows through and fades. Text never sits in it. | [Materials](03-materials.md#tide) |
| **Firm** | The no-overshoot spring (0.30s, 1.0) for big and costly things; also the calm press tier for buy, pay and delete. | [Motion](05-motion.md#the-springs) |
| **Foam** | The palest layer, used for most glass. | [Materials](03-materials.md#layers) |
| **Glide** | The soft spring (0.40s, 0.75) for small things that travel: the blob, thumbs, menus. | [Motion](05-motion.md#the-springs) |
| **Glow** | Light pooling inside the bottom edge of glass and jelly. | [Materials](03-materials.md#sea-glass) |
| **Grain** | A fine frost noise on large surfaces only. | [Materials](03-materials.md#sea-glass) |
| **Ground** | The pale page behind everything, with soft color pools. | [Materials](03-materials.md#ground) |
| **Hero** | An optional mascot or mark, the only thing that may move at rest. | [Foundations](01-foundations.md#the-hero-optional) |
| **Jelly** | The material for touching: thick, gummy, lit from inside, with a sheen, an edge and a caustic. The only material that dents. | [Materials](03-materials.md#jelly) |
| **Label band** | The middle of a Deep surface (about 23% to 71% of its height), between the sheen and the pool, where its white text sits. | [Color](02-color.md#rules) |
| **Lagoon** | The selected layer: the blob, selected chips, your reactions. | [Materials](03-materials.md#layers) |
| **Layer** | How much tint a surface carries: Foam, Shallow, Lagoon or Deep. Answers "how important is it?" | [Materials](03-materials.md#layers) |
| **Lean** | S and M controls following a held finger by 30% of the drag, at most 3px. | [Touch](04-touch.md#the-feel) |
| **Lift** | The press tier for small keys under the finger (emoji, reactions): the key grows and rises above the finger. | [Touch](04-touch.md#tiers) |
| **Material** | What a surface is made of, chosen by its job: sea glass, jelly or tide. | [Foundations](01-foundations.md#the-one-rule) |
| **Orb** | The round Deep jelly button for the screen's one main action. | [Navigation](06-navigation.md#tab-bar) |
| **Peel** | The release phase of a press: the control clings, stretches out toward you, and settles with one rebound in 440ms. Also the spring (0.34s, 0.45) native code may fall back to. | [Touch](04-touch.md#the-feel) |
| **Pool** | A soft wash of color: on the ground, at the bottom of Deep, or inside the bottom edge of glass (see Glow). | [Materials](03-materials.md#ground) |
| **Pop** | The quick swell when a long-press reaches its threshold. | [Touch](04-touch.md#long-press) |
| **Preset** | A named set of the six brand inputs: seafoam, cornflower, lavender, amber, kelly, coral. | [Color](02-color.md#presets) |
| **Prism** | Pastel light pooling in the bottom corners of large jelly. | [Materials](03-materials.md#jelly) |
| **Regular** | Floating glass at 68% (light) / 76% (dark) with a 20px blur, for tab bars and composers. | [Materials](03-materials.md#thickness) |
| **Rim** | The still 1px pastel edge of every glass surface. | [Materials](03-materials.md#the-rim) |
| **Scrub** | Dragging along a tab bar or segment so the blob follows the finger. | [Navigation](06-navigation.md#the-blob) |
| **Sea glass** | The material for reading: frosted, tinted, matte and still. | [Materials](03-materials.md#sea-glass) |
| **Settle** | The last pose of a peel before rest. | [Touch](04-touch.md#the-feel) |
| **Shade** | The tinted color of shadows under sea glass. | [Color](02-color.md#theme-roles) |
| **Shallow** | The second layer: your own bubbles, secondary actions, avatars. | [Materials](03-materials.md#layers) |
| **Sheen** | The still white light across the top of jelly. It never follows the pointer. | [Materials](03-materials.md#jelly) |
| **Solid** | Fully opaque glass with no blur, for anything you read. | [Materials](03-materials.md#thickness) |
| **Theme roles** | The colors components use (`--tg-text`, `--tg-accent`, `--tg-veil`…), derived from the brand inputs for light and dark. | [Color](02-color.md#theme-roles) |
| **Thick** | Floating glass at 84% / 88% with a 28px blur, for menus, sheets, toasts and glass over glass. | [Materials](03-materials.md#thickness) |
| **Thickness** | How much a surface lets you see through: Solid, Thin, Regular or Thick. Answers "does content pass underneath?" | [Materials](03-materials.md#thickness) |
| **Thin** | Floating glass at 56% / 64% with a 12px blur. Icons only. | [Materials](03-materials.md#thickness) |
| **Tide** | The liquid see-through layer at scroll edges: a veil, a dense band and a feather, with no rim. | [Materials](03-materials.md#tide) |
| **Tier** | How strongly a control responds to a press: S, M, L, Firm, Lift or None. Size picks it. | [Touch](04-touch.md#tiers) |
| **Veil** | The ground-colored gradient that forms a tide. | [Materials](03-materials.md#tide) |
| **Worst backdrop** | Pure black behind light glass and pure white behind dark glass; contrast is measured against it. | [Color](02-color.md#contrast-pairs) |
