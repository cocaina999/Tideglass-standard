// Shared helpers for the Tideglass tools: spring math, a small CSS reader,
// and a color evaluator that resolves the kit's own color-mix() recipes.
// No dependencies, so `npm run check` works on a fresh clone.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const read = rel => readFileSync(join(ROOT, rel), 'utf8');

/* ---------------------------------------------------------------- springs */

// Unit step response of a damped spring, released from 0 toward 1.
// `response` is the period in seconds (SwiftUI's meaning), `damping` the ratio.
export function springCurve(response, damping) {
  const w = (2 * Math.PI) / response;
  if (damping < 1) {
    const wd = w * Math.sqrt(1 - damping ** 2);
    const k = damping / Math.sqrt(1 - damping ** 2);
    return t => 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + k * Math.sin(wd * t));
  }
  if (damping === 1) return t => 1 - Math.exp(-w * t) * (1 + w * t);
  const s = Math.sqrt(damping ** 2 - 1);
  const r1 = -w * (damping - s), r2 = -w * (damping + s);
  return t => 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

export function springParams(response, damping) {
  const w = (2 * Math.PI) / response;
  const x = springCurve(response, damping);
  let settle = 0;
  for (let t = 3; t > 0; t -= 0.001) if (Math.abs(x(t) - 1) > 0.001) { settle = t + 0.001; break; }
  return {
    stiffness: w * w,                       // Compose, Motion, React Spring (mass 1)
    damping: 2 * damping * w,               // Motion / Framer damping coefficient
    overshoot: damping < 1 ? Math.exp((-damping * Math.PI) / Math.sqrt(1 - damping ** 2)) : 0,
    settleMs: Math.round(settle * 1000),
  };
}

const num = v => Number(v.toFixed(3)).toString();

// A CSS linear() easing that traces the spring over `durationMs`, sampled every 4%.
export function springLinear(response, damping, durationMs) {
  const x = springCurve(response, damping);
  const pts = [];
  for (let p = 0; p <= 100; p += 4) {
    if (p === 0) pts.push('0');
    else if (p === 100) pts.push('1');
    else pts.push(`${num(x((p / 100) * durationMs / 1000))} ${p}%`);
  }
  return `linear(${pts.join(', ')})`;
}

/* ---------------------------------------------------------------- CSS reading */

// Returns the declarations of the first rule after a `/* tg:<marker> */` comment.
export function markedBlock(css, marker) {
  const at = css.indexOf(`/* tg:${marker} */`);
  if (at < 0) throw new Error(`marker tg:${marker} not found`);
  const open = css.indexOf('{', at);
  let depth = 0, i = open;
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) break;
  }
  let body = css.slice(open + 1, i);
  // A marked @media block wraps one rule: unwrap it.
  if (/^\s*[^{}]*\{/.test(body) && body.trim().endsWith('}')) body = body.slice(body.indexOf('{') + 1, body.lastIndexOf('}'));
  return { selector: css.slice(at, open).replace(/\/\*[^]*?\*\//g, '').trim(), decls: declarations(body) };
}

export function declarations(body) {
  const out = {};
  const clean = body.replace(/\/\*[^]*?\*\//g, '');
  let depth = 0, start = 0;
  for (let i = 0; i <= clean.length; i++) {
    const c = clean[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if ((c === ';' || i === clean.length) && depth === 0) {
      const d = clean.slice(start, i).trim();
      start = i + 1;
      const colon = d.indexOf(':');
      if (colon > 0) out[d.slice(0, colon).trim()] = d.slice(colon + 1).trim();
    }
  }
  return out;
}

// [data-tg-brand="name"]{...} blocks from the presets file.
export function presetBlocks(css) {
  const out = {};
  for (const m of css.matchAll(/\[data-tg-brand="([a-z-]+)"\]\s*\{([^}]*)\}/g)) out[m[1]] = declarations(m[2]);
  return out;
}

/* ---------------------------------------------------------------- colors */

const NAMED = { transparent: [0, 0, 0, 0], white: [255, 255, 255, 1], black: [0, 0, 0, 1] };

function splitTop(s, sep) {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === sep && depth === 0) { parts.push(s.slice(start, i)); start = i + 1; }
  }
  parts.push(s.slice(start));
  return parts.map(p => p.trim()).filter(Boolean);
}

const inner = (s, fn) => s.slice(fn.length + 1, s.lastIndexOf(')'));

// Resolves a CSS color expression against `env` (custom property -> raw value).
// Supports what the kit uses: hex, rgb(), named, var() and color-mix(in srgb, ...).
// Colors are [r, g, b, a] with r,g,b in 0..255 (gamma-encoded) and a in 0..1.
export function color(expr, env, depth = 0) {
  if (depth > 40) throw new Error(`recursion resolving ${expr}`);
  const s = expr.trim();
  if (NAMED[s]) return NAMED[s];
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3) h = [...h].map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  if (s.startsWith('var(')) {
    const [name, ...fallback] = splitTop(inner(s, 'var'), ',');
    if (name in env) return color(env[name], env, depth + 1);
    if (fallback.length) return color(fallback.join(','), env, depth + 1);
    throw new Error(`undefined ${name}`);
  }
  if (s.startsWith('rgb(') || s.startsWith('rgba(')) {
    const body = inner(s, s.startsWith('rgba') ? 'rgba' : 'rgb');
    const [rgb, a] = body.includes('/') ? body.split('/') : [body, '1'];
    const c = rgb.split(/[\s,]+/).filter(Boolean).map(Number);
    return [...c, parseFloat(a) / (a.trim().endsWith('%') ? 100 : 1)];
  }
  if (s.startsWith('color-mix(')) {
    const [space, a, b] = splitTop(inner(s, 'color-mix'), ',');
    if (space !== 'in srgb') throw new Error(`unsupported space ${space}`);
    const arg = t => {
      const m = t.match(/^(.*?)\s+(\d+(?:\.\d+)?)%$/);
      return m ? [color(m[1], env, depth + 1), Number(m[2])] : [color(t, env, depth + 1), null];
    };
    let [c1, p1] = arg(a), [c2, p2] = arg(b);
    if (p1 === null && p2 === null) p1 = p2 = 50;
    else if (p1 === null) p1 = 100 - p2;
    else if (p2 === null) p2 = 100 - p1;
    return mix(c1, c2, p1 / (p1 + p2), Math.min(1, (p1 + p2) / 100));
  }
  throw new Error(`cannot resolve color "${s}"`);
}

// CSS Color 5 color-mix in srgb: premultiplied interpolation. `w` is the weight of c1.
export function mix(c1, c2, w, alphaScale = 1) {
  const a = c1[3] * w + c2[3] * (1 - w);
  if (a === 0) return [0, 0, 0, 0];
  const ch = i => (c1[i] * c1[3] * w + c2[i] * c2[3] * (1 - w)) / a;
  return [ch(0), ch(1), ch(2), a * alphaScale];
}

export const withAlpha = (c, a) => [c[0], c[1], c[2], c[3] * a];

// Source-over compositing of `top` onto `bottom`.
export function over(top, bottom) {
  const a = top[3] + bottom[3] * (1 - top[3]);
  if (a === 0) return [0, 0, 0, 0];
  const ch = i => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a;
  return [ch(0), ch(1), ch(2), a];
}

export function luminance([r, g, b]) {
  const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(fg, bg) {
  const solidFg = fg[3] < 1 ? over(fg, bg) : fg;
  const l1 = luminance(solidFg), l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export const hex = c => '#' + c.slice(0, 3).map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
