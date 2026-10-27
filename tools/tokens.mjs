#!/usr/bin/env node
// Generates tokens/tideglass.tokens.json (DTCG 2025.10) and spec/appendix-contrast.md
// from kit/tideglass.css. The CSS is the single source of truth; never edit the outputs.
//   npm run tokens

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, read, color, declarations, hex } from './lib.mjs';
import { loadKit, environment, measure, allPresets, THEMES } from './model.mjs';

export const VERSION = JSON.parse(read('package.json')).version;

const round = (v, d = 4) => Number(v.toFixed(d));

function colorToken([r, g, b, a]) {
  const value = { colorSpace: 'srgb', components: [r, g, b].map(v => round(v / 255)) };
  if (a < 1) value.alpha = round(a, 3);
  value.hex = hex([r, g, b]).toLowerCase();
  return value;
}

const dim = (value, unit) => ({ value: round(value, 4), unit });
function parseDim(v) {
  const m = String(v).trim().match(/^(-?[\d.]+)(px|rem)$/);
  if (!m) throw new Error(`not a dimension: ${v}`);
  return dim(Number(m[1]), m[2]);
}
function parseDur(v) {
  const m = String(v).trim().match(/^([\d.]+)(ms|s)$/);
  if (!m) throw new Error(`not a duration: ${v}`);
  return { value: Number(m[1]), unit: m[2] };
}
const parseBezier = v => v.match(/cubic-bezier\(([^)]+)\)/)[1].split(',').map(Number);
const fontList = v => v.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(s => !s.startsWith('var('));

const DESCRIPTIONS = {
  tint: 'Bright brand hue. Tints every glass layer.',
  deep: 'Dark brand hue: the main action, links, focus. Must pass 4.5:1 on the ground; white must pass on it.',
  ink: 'Text color.',
  'rim-a': 'Rim pastel 1 of 3. Take the pastels from the hero or logo.',
  'rim-b': 'Rim pastel 2 of 3.',
  'rim-c': 'Rim pastel 3 of 3.',
};

// Theme roles exported as resolved colors (for the default brand).
const COLOR_ROLES = ['base', 'ground', 'pool-1', 'pool-2', 'pool-3', 'pool-4', 'foam-1', 'foam-2', 'shallow-1', 'shallow-2',
  'lagoon-1', 'lagoon-2', 'deep-1', 'deep-2', 'text', 'text-2', 'accent', 'on-deep', 'separator', 'hairline', 'edge', 'glow',
  'sheen', 'shade', 'caustic', 'rim-hi', 'veil', 'veil-soft', 'scrim', 'danger', 'success', 'warning'];

export function buildTokens(kit) {
  const s = kit.scales;
  const brand = { $type: 'color' };
  for (const [k, v] of Object.entries(kit.brand)) {
    const name = k.replace('--tg-', '');
    brand[name] = { $value: colorToken(color(v, {})), $description: DESCRIPTIONS[name] };
  }

  const preset = { $type: 'color', $description: 'Brand starts named after sea glass colors. Set data-tg-brand="<name>".' };
  for (const [name, decls] of allPresets(kit)) {
    preset[name] = {};
    for (const [k, v] of Object.entries(decls)) preset[name][k.replace('--tg-', '')] = { $value: colorToken(color(v, {})) };
  }

  const theme = {};
  const opacity = { $type: 'number', $description: 'Glass opacity per thickness, and rim, grain and prism strength, per theme.' };
  for (const t of THEMES) {
    const env = environment(kit, kit.brand, t);
    theme[t] = { $type: 'color', $description: `Theme roles in ${t} mode, resolved for the default brand. In CSS they are recomputed from the brand inputs.` };
    for (const role of COLOR_ROLES) theme[t][role] = { $value: colorToken(color(`var(--tg-${role})`, env)) };
    opacity[t] = {
      thin: { $value: parseFloat(env['--tg-o-thin']) / 100 },
      regular: { $value: parseFloat(env['--tg-o-regular']) / 100 },
      thick: { $value: parseFloat(env['--tg-o-thick']) / 100 },
      rim: { $value: Number(env['--tg-rim-o']) },
      grain: { $value: Number(env['--tg-grain-o']) },
      prism: { $value: parseFloat(env['--tg-prism-o']) / 100 },
    };
  }

  const group = (type, prefix, map = parseDim) => {
    const out = { $type: type };
    for (const [k, v] of Object.entries(s)) if (k.startsWith(prefix)) out[k.slice(prefix.length)] = { $value: map(v) };
    return out;
  };

  const type = { $type: 'typography' };
  const spacing = { title: -0.02, heading: -0.01, micro: 0.01 };
  for (const [k, v] of Object.entries(s)) {
    if (!k.startsWith('--tg-type-')) continue;
    const name = k.slice('--tg-type-'.length);
    const m = v.match(/^(\d+)\s+([\d.]+)rem\/([\d.]+)rem/);
    const size = Number(m[2]);
    const base = name.replace('-strong', '');
    type[name] = {
      $value: {
        fontFamily: fontList(s['--tg-font']),
        fontSize: dim(size, 'rem'),
        fontWeight: Number(m[1]),
        lineHeight: round(Number(m[3]) / size, 3),
        letterSpacing: dim((spacing[base] || 0) * size, 'rem'),
      },
    };
  }

  const press = { $type: 'number', $description: 'Dent and peel poses per touch tier (scale x, scale y, sink and lift in px).' };
  for (const m of kit.css.matchAll(/\[data-tg-tier="([a-z]+)"\]\{([^}]*)\}/g)) {
    const d = declarations(m[2]);
    press[m[1]] = {};
    for (const [k, v] of Object.entries(d)) press[m[1]][k.replace('--_', '')] = { $value: parseFloat(v) };
  }

  const spring = { $type: 'number', $description: 'Springs as response (s) and damping ratio. tools/springs.mjs converts them for CSS, SwiftUI, Compose and Motion.' };
  for (const name of ['glide', 'firm', 'peel']) {
    const [response, damping] = s[`--tg-spring-${name}`].split(/\s+/).map(Number);
    spring[name] = { response: { $value: response }, damping: { $value: damping } };
  }

  return {
    $description: `Tideglass ${VERSION} design tokens (DTCG 2025.10). Generated from kit/tideglass.css by \`npm run tokens\`. Edit the CSS, not this file.`,
    brand,
    preset,
    theme,
    opacity,
    blur: group('dimension', '--tg-blur-'),
    radius: group('dimension', '--tg-r-'),
    space: group('dimension', '--tg-space-'),
    size: group('dimension', '--tg-size-'),
    font: { $type: 'fontFamily', sans: { $value: fontList(s['--tg-font']) }, rounded: { $value: fontList(s['--tg-font-round']) } },
    type,
    duration: group('duration', '--tg-dur-', parseDur),
    easing: { $type: 'cubicBezier', dent: { $value: parseBezier(s['--tg-ease-dent']) }, exit: { $value: parseBezier(s['--tg-ease-exit']) } },
    spring,
    press,
  };
}

export function buildContrastReport(kit) {
  const lines = [
    '# Appendix: contrast report',
    '',
    `Generated by \`npm run tokens\` from kit/tideglass.css (Tideglass ${VERSION}). Do not edit by hand.`,
    '',
    'Every pair below is measured on the colors the kit actually renders, for every preset in both themes. "Worst backdrop" means pure black under light glass and pure white under dark glass. The rules behind each pair are in [02-color.md](02-color.md#contrast-pairs).',
    '',
  ];
  const all = allPresets(kit).flatMap(([name, inputs]) => THEMES.map(t => ({ name, t, ...measure(kit, inputs, t) })));
  const ids = all[0].results.map(r => r);
  lines.push('| Pair | Needs | ' + all.map(a => `${a.name} ${a.t}`).join(' | ') + ' |');
  lines.push('|---|---|' + all.map(() => '---|').join(''));
  ids.forEach((r, i) => {
    lines.push(`| ${r.id} ${r.label} | ${r.min}:1 | ` + all.map(a => `${a.results[i].ratio.toFixed(2)}${a.results[i].pass ? '' : ' ✗'}`).join(' | ') + ' |');
  });
  lines.push('', '## Known limits', '', 'These pairs are not required. They are measured to show why the matching rule exists.', '');
  lines.push('| Pair | ' + all.map(a => `${a.name} ${a.t}`).join(' | ') + ' |');
  lines.push('|---|' + all.map(() => '---|').join(''));
  all[0].limits.forEach((l, i) => {
    lines.push(`| ${l.label} | ` + all.map(a => a.limits[i].ratio.toFixed(2)).join(' | ') + ' |');
  });
  return lines.join('\n') + '\n';
}

export const OUTPUTS = {
  'tokens/tideglass.tokens.json': kit => JSON.stringify(buildTokens(kit), null, 2) + '\n',
  'spec/appendix-contrast.md': buildContrastReport,
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const kit = loadKit();
  for (const [file, build] of Object.entries(OUTPUTS)) {
    writeFileSync(join(ROOT, file), build(kit));
    console.log('wrote', file);
  }
}
