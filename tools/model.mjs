// The Tideglass contrast model. It resolves the theme roles straight from
// kit/tideglass.css (no copied numbers), composites each surface the way the
// kit paints it, and checks every pair the spec promises (spec/02-color.md).

import { read, markedBlock, presetBlocks, color, mix, over, withAlpha, contrast } from './lib.mjs';

export function loadKit() {
  const css = read('kit/tideglass.css');
  return {
    css,
    brand: markedBlock(css, 'brand').decls,
    scales: markedBlock(css, 'scales').decls,
    light: markedBlock(css, 'light').decls,
    darkAuto: markedBlock(css, 'dark-auto').decls,
    darkForced: markedBlock(css, 'dark-forced').decls,
    presets: presetBlocks(read('kit/tideglass-presets.css')),
  };
}

export const THEMES = ['light', 'dark'];

// Every custom property visible on a scope root, for one brand and theme.
export function environment(kit, inputs, theme) {
  return { ...inputs, ...kit.light, ...(theme === 'dark' ? kit.darkAuto : {}) };
}

export function resolver(env) {
  return {
    c: name => color(`var(${name})`, env),
    pct: name => parseFloat(env[name]) / 100,
  };
}

// Builds the surfaces as rendered, then measures each promised pair.
export function measure(kit, inputs, theme) {
  const env = environment(kit, inputs, theme);
  const { c, pct } = resolver(env);
  // The worst thing that can scroll behind floating glass: black under light glass, white under dark.
  const worst = theme === 'light' ? [0, 0, 0, 1] : [255, 255, 255, 1];

  const ground = c('--tg-ground');
  const grounds = [ground, ...[1, 2, 3, 4].map(i => over(c(`--tg-pool-${i}`), ground))];
  const layer = name => [c(`--tg-${name}-1`), c(`--tg-${name}-2`)];
  const foam = layer('foam'), shallow = layer('shallow'), lagoon = layer('lagoon');
  const floating = (o, backdrop) => foam.map(f => over(withAlpha(f, o), backdrop));
  const regular = floating(pct('--tg-o-regular'), worst);
  const thick = floating(pct('--tg-o-thick'), worst);
  const thin = floating(pct('--tg-o-thin'), worst);
  const tideBand = [over(c('--tg-veil'), worst)];
  const dock = floating(pct('--tg-o-regular'), over(c('--tg-veil-soft'), worst));
  // Deep's label band: below the top sheen (ends at 23% height), above the pool (starts at 71%).
  const deep1 = c('--tg-deep-1'), deep2 = c('--tg-deep-2');
  const deepBand = [mix(deep1, deep2, 0.75), mix(deep1, deep2, 0.3)];

  const text = c('--tg-text'), text2 = c('--tg-text-2'), accent = c('--tg-accent'), onDeep = c('--tg-on-deep');
  const status = ['--tg-danger', '--tg-success', '--tg-warning'].map(c);

  const pairs = [
    ['CT-1', 'Text on the ground and its pools', [text], grounds, 4.5],
    ['CT-2', 'Secondary text on the ground and its pools', [text2], grounds, 4.5],
    ['CT-3', 'Accent (links) on the ground, pools and Foam', [accent], [...grounds, ...foam], 4.5],
    ['CT-4', 'Text on Foam, Shallow and Lagoon', [text], [...foam, ...shallow, ...lagoon], 4.5],
    ['CT-5', 'Secondary text on Foam and Shallow', [text2], [...foam, ...shallow], 4.5],
    ['CT-6', 'Text on Deep, in its label band', [onDeep], deepBand, 4.5],
    ['CT-7', 'Text on Regular and Thick glass over the worst backdrop', [text], [...regular, ...thick], 4.5],
    ['CT-8', 'Secondary text on Thick glass over the worst backdrop', [text2], thick, 4.5],
    ['CT-9', 'Icons on Thin glass over the worst backdrop', [text], thin, 3],
    ['CT-10', 'Text in the tide band over the worst backdrop', [text], tideBand, 4.5],
    ['CT-11', 'Text and secondary text on glass docked over the bottom tide', [text, text2], dock, 4.5],
    ['CT-12', 'Status colors on the ground and Foam', status, [ground, ...foam], 4.5],
    ['CT-13', 'Focus ring (accent) against the ground', [accent], grounds, 3],
    ['CT-14', 'Switch thumb against its on track', [[255, 255, 255, 1]], [deep1], 3],
    ['CT-15', 'Badge text on Deep', [onDeep], [deep2], 4.5],
  ];

  const results = pairs.map(([id, label, fgs, bgs, min]) => {
    let ratio = Infinity;
    for (const fg of fgs) for (const bg of bgs) ratio = Math.min(ratio, contrast(fg, bg));
    return { id, label, min, ratio, pass: ratio >= min - 1e-9 };
  });

  // Known limits, reported but not required: these are why the rules exist.
  const limits = [
    ['Secondary text on Lagoon (rule: use primary text on Lagoon)', [text2], lagoon],
    ['Secondary text on Regular glass over the worst backdrop (rule: needs Thick or a tide)', [text2], regular],
    ['Text on Thin glass over the worst backdrop (rule: Thin carries icons only)', [text], thin],
    ['Secondary text in the tide band (rule: tide text is primary only)', [text2], tideBand],
    ['Accent text in the tide band (rule: actions in the tide are jelly controls)', [accent], tideBand],
  ].map(([label, fgs, bgs]) => {
    let ratio = Infinity;
    for (const fg of fgs) for (const bg of bgs) ratio = Math.min(ratio, contrast(fg, bg));
    return { label, ratio };
  });

  return { results, limits };
}

export function allPresets(kit) {
  return Object.entries(kit.presets);
}
