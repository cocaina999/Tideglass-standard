#!/usr/bin/env node
// Prints the Tideglass springs for every platform, from one definition.
//   npm run springs                 -> glide, firm and peel
//   node tools/springs.mjs 0.4 0.75 520   -> any spring (response s, damping ratio, CSS duration ms)

import { springLinear, springParams } from './lib.mjs';
import { loadKit } from './model.mjs';

function show(name, response, damping, durationMs) {
  const p = springParams(response, damping);
  console.log(`\n${name}: response ${response}s, damping ${damping}`);
  console.log(`  overshoot ${(p.overshoot * 100).toFixed(1)}%, settles (0.1%) in ${p.settleMs}ms`);
  if (durationMs) console.log(`  CSS       ${springLinear(response, damping, durationMs)}  /* ${durationMs}ms */`);
  console.log(`  SwiftUI   .spring(response: ${response}, dampingFraction: ${damping})`);
  console.log(`  Compose   spring(dampingRatio = ${damping}f, stiffness = ${p.stiffness.toFixed(0)}f)`);
  console.log(`  Motion    { type: "spring", stiffness: ${p.stiffness.toFixed(0)}, damping: ${p.damping.toFixed(1)}, mass: 1 }`);
}

const args = process.argv.slice(2).map(Number);
if (args.length >= 2) {
  show('custom', args[0], args[1], args[2]);
} else {
  const s = loadKit().scales;
  for (const name of ['glide', 'firm', 'peel']) {
    const [response, damping] = s[`--tg-spring-${name}`].split(/\s+/).map(Number);
    const dur = s[`--tg-dur-${name}`] && name !== 'peel' ? parseFloat(s[`--tg-dur-${name}`]) : 0;
    show(name, response, damping, dur);
  }
}
