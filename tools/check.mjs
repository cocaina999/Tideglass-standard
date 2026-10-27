#!/usr/bin/env node
// `npm run check`: keeps the kit, the tokens, the spec and the contrast claims honest.
// Dependency-free; runs in CI on every push.

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, read, springLinear } from './lib.mjs';
import { loadKit, measure, allPresets, THEMES } from './model.mjs';
import { OUTPUTS, VERSION } from './tokens.mjs';

let failures = 0;
const section = name => console.log(`\n${name}`);
const ok = msg => console.log(`  ✓ ${msg}`);
const fail = msg => { failures++; console.log(`  ✗ ${msg}`); };
const expect = (cond, pass, why) => (cond ? ok(pass) : fail(`${pass}: ${why}`));

const kit = loadKit();

section('Springs');
for (const name of ['glide', 'firm']) {
  const [response, damping] = kit.scales[`--tg-spring-${name}`].split(/\s+/).map(Number);
  const duration = parseFloat(kit.scales[`--tg-dur-${name}`]);
  const want = springLinear(response, damping, duration);
  expect(kit.scales[`--tg-${name}`] === want, `--tg-${name} traces its spring (${response}s, ${damping})`, `regenerate with \`npm run springs\` and paste:\n      ${want}`);
}

section('Themes and presets');
expect(JSON.stringify(kit.darkAuto) === JSON.stringify(kit.darkForced), 'automatic and forced dark blocks are identical', 'edit both blocks together');
const missing = Object.keys(kit.darkAuto).filter(k => !(k in kit.light));
expect(!missing.length, 'every dark role has a light counterpart', missing.join(', '));
const seafoam = kit.presets.seafoam || {};
expect(Object.keys(kit.brand).every(k => kit.brand[k].toUpperCase() === (seafoam[k] || '').toUpperCase()), 'the seafoam preset equals the default brand inputs', 'keep kit/tideglass-presets.css in step with tg:brand');
for (const [name, p] of allPresets(kit)) {
  expect(Object.keys(kit.brand).every(k => k in p), `preset "${name}" sets all six brand inputs`, 'a preset must set tint, deep, ink and three rims');
}

section('Contrast (spec/02-color.md)');
for (const [name, inputs] of allPresets(kit)) {
  for (const theme of THEMES) {
    const { results } = measure(kit, inputs, theme);
    const bad = results.filter(r => !r.pass);
    expect(!bad.length, `${name} ${theme}: ${results.length} pairs pass`, bad.map(r => `${r.id} ${r.ratio.toFixed(2)} < ${r.min}`).join(', '));
  }
}

section('Generated files');
for (const [file, build] of Object.entries(OUTPUTS)) {
  const current = existsSync(join(ROOT, file)) ? read(file).replace(/\r\n/g, '\n') : '';
  expect(current === build(kit), `${file} is up to date`, 'run `npm run tokens`');
}

section('Versions');
const readIf = f => (existsSync(join(ROOT, f)) ? read(f) : '');
const js = read('kit/tideglass.js');
expect(kit.css.includes(`Tideglass ${VERSION}`), `CSS header says ${VERSION}`, 'update the banner in kit/tideglass.css');
expect(js.includes(`var VERSION = '${VERSION}'`), `JS says ${VERSION}`, 'update VERSION in kit/tideglass.js');
expect(read('kit/tideglass-presets.css').includes(`Tideglass ${VERSION}`), `presets header says ${VERSION}`, 'update the banner');
expect(readIf('SKILL.md').includes(`version: "${VERSION}"`), `SKILL.md says ${VERSION}`, 'update metadata.version in the frontmatter');
expect(readIf('CHANGELOG.md').includes(`## ${VERSION}`), `CHANGELOG has ${VERSION}`, 'add a release entry');

section('Syntax');
try {
  execFileSync(process.execPath, ['--check', join(ROOT, 'kit/tideglass.js')], { stdio: 'pipe' });
  ok('kit/tideglass.js parses');
} catch (e) { fail(`kit/tideglass.js: ${e.stderr}`); }
const depth = [...kit.css.replace(/\/\*[^]*?\*\//g, '')].reduce((d, c) => d + (c === '{') - (c === '}'), 0);
expect(depth === 0, 'kit/tideglass.css braces balance', `off by ${depth}`);

section('Docs');
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.git')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.md')) files.push(p);
  }
})(ROOT);
// GitHub's heading anchors: lowercase, punctuation dropped, spaces to hyphens.
const slug = h => h.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const anchors = file => new Set([...read(relative(ROOT, file)).replace(/```[^]*?```/g, '').matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => slug(m[1])));
let broken = [];
for (const file of files) {
  const text = read(relative(ROOT, file)).replace(/```[^]*?```/g, '');
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const [target, hash] = m[1].split('#');
    if (/^[a-z]+:/i.test(target)) continue;
    const path = target ? join(dirname(file), decodeURI(target)) : file;
    if (!existsSync(path)) broken.push(`${relative(ROOT, file)} -> ${m[1]}`);
    else if (hash && path.endsWith('.md') && !anchors(path).has(hash)) broken.push(`${relative(ROOT, file)} -> ${m[1]} (no such heading)`);
  }
}
expect(!broken.length, `relative links and anchors resolve in ${files.length} markdown files`, broken.join('\n      '));

// GitHub splits table cells on any unescaped pipe, even inside `code`.
const pipes = files.flatMap(file => read(relative(ROOT, file)).replace(/```[^]*?```/g, '').split('\n')
  .map((line, i) => [line, i + 1])
  .filter(([line]) => line.startsWith('|') && [...line.matchAll(/`[^`]*`/g)].some(m => /(^|[^\\])\|/.test(m[0])))
  .map(([, n]) => `${relative(ROOT, file)}:${n}`));
expect(!pipes.length, 'table cells escape pipes inside code', pipes.join(', '));

const chapters = readdirSync(join(ROOT, 'spec')).filter(f => f.endsWith('.md'));
const specText = chapters.map(f => read(`spec/${f}`)).join('\n');
const classes = [...new Set([...kit.css.matchAll(/\.(tg-[a-z0-9-]+)/g)].map(m => m[1]))];
const undocumented = classes.filter(c => !specText.includes(c));
expect(!undocumented.length, `all ${classes.length} kit classes appear in the spec`, undocumented.join(', '));

const ruleIds = text => [...text.matchAll(/^- (?:\[ \] )?\*\*([A-Z]{2}-\d+)\*\*/gm)].map(m => m[1]);
const defined = chapters.filter(f => /^\d\d-/.test(f) && f !== '12-review.md').flatMap(f => ruleIds(read(`spec/${f}`)));
const listed = ruleIds(readIf('spec/12-review.md'));
const dupes = defined.filter((id, i) => defined.indexOf(id) !== i);
expect(!dupes.length, `${defined.length} rule IDs are unique`, dupes.join(', '));
const unlisted = defined.filter(id => !listed.includes(id));
const stale = listed.filter(id => !defined.includes(id));
expect(!unlisted.length && !stale.length, 'the review checklist lists every rule exactly', [...unlisted.map(id => `missing ${id}`), ...stale.map(id => `unknown ${id}`)].join(', '));

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
