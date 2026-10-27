# Contributing to Tideglass

Thanks for helping. Tideglass is a standard first and a kit second, so changes are judged by one question: does this make screens more consistent, more legible or more pleasant to touch, for everyone?

## Before you start

- **Bugs in the kit or demos:** open an issue with the browser, the page, and what you expected. A failing `npm run smoke` case is the best bug report.
- **Changes to the standard** (a new rule, a changed number, a new component): open an issue first and describe the screen that needs it. Rules are versioned, and other people's reviews cite them.
- **Wording fixes:** send a pull request directly.

## Setup

```sh
npm install        # installs puppeteer-core, which drives your own Chrome or Edge
npm run check      # contrast, springs, tokens, versions, links, docs coverage
npm run smoke      # browser tests on the demos
```

Set `CHROME_PATH` if the tools cannot find your browser. Both commands must pass before a pull request is merged; CI runs them on every push.

## How the pieces fit

| Edit this | Then |
|---|---|
| `kit/tideglass.css` | Run `npm run tokens` to regenerate `tokens/tideglass.tokens.json` and `spec/appendix-contrast.md`. Never edit those two files by hand. |
| The `tg:dark-auto` block | Make the same change in `tg:dark-forced`; `npm run check` fails if they differ. |
| A spring (`--tg-spring-*`) | Run `npm run springs` and paste the new `linear()` curve; update the tables in [spec/05-motion.md](spec/05-motion.md). |
| `kit/tideglass-presets.css` | `npm run check` measures every preset in both themes. Keep `seafoam` equal to the default brand inputs. |
| A new `tg-` class | Document it in the spec, usually [spec/09-components.md](spec/09-components.md); `npm run check` fails on undocumented classes. |
| A new rule | Give it the next free number in its chapter and add it to the checklist in [spec/12-review.md](spec/12-review.md); `npm run check` fails if the two disagree. Never reuse a retired number. |
| A demo page | Run `npm run smoke`, then `npm run shots` if the README images should change. Check them by eye. |

## Writing the spec

- Plain words. Say what a thing is and what it does; avoid metaphors that need explaining.
- One idea per rule. Rules use **must**, **must not**, **should** and **may** in their RFC 2119 sense.
- Every number in the spec is measured, generated or tested. If you add one, add the check too.
- Sentence case for headings and labels.
- In tables, escape pipes inside code as `\|`.

## Versioning

The spec, kit and tokens share one version. A release changes it in six places, and `npm run check` verifies all of them:

1. `package.json` `version`
2. The banner at the top of `kit/tideglass.css`
3. The banner at the top of `kit/tideglass-presets.css`
4. `VERSION` in `kit/tideglass.js`
5. `metadata.version` in `SKILL.md`
6. A new `## x.y.z` entry in `CHANGELOG.md`

What counts as major, minor or patch is defined in [spec/README.md](spec/README.md#versioning).

## Pull request checklist

- [ ] `npm run check` passes.
- [ ] `npm run smoke` passes.
- [ ] New behavior has a smoke test; new numbers have a check.
- [ ] The spec and [SKILL.md](SKILL.md) say the same thing as the kit.
- [ ] The CHANGELOG has an entry under the next version.

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
