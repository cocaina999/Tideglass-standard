#!/usr/bin/env node
// Renders the README images into docs/assets with a local headless browser.
//   npm run shots
//   node tools/shoot.mjs demo/messages.html out.png 390x844 "theme=dark" [scrollY]

import { launch, open, wait } from './browser.mjs';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { ROOT } from './lib.mjs';

const SHOTS = [
  // file, out, size, query, scrollY ('end' = bottom)
  ['docs/poster.html', 'docs/assets/poster.jpg', '1280x640', ''],
  ['demo/fitness.html', 'docs/assets/fitness-light.webp', '390x844', 'haptics=0&theme=light', 110],
  ['demo/fitness.html', 'docs/assets/fitness-dark.webp', '390x844', 'haptics=0&theme=dark', 110],
  ['demo/messages.html', 'docs/assets/messages-light.webp', '390x844', 'haptics=0&theme=light', 'end'],
  ['demo/messages.html', 'docs/assets/messages-dark.webp', '390x844', 'haptics=0&theme=dark', 'end'],
  ['demo/smart-home.html', 'docs/assets/smart-home-light.webp', '390x844', 'haptics=0&theme=light', 0],
  ['demo/smart-home.html', 'docs/assets/smart-home-dark.webp', '390x844', 'haptics=0&theme=dark', 0],
];

async function shoot(browser, file, out, size = '390x844', query = '', scrollY = 0) {
  const [width, height] = size.split('x').map(Number);
  const { page, errors } = await open(browser, file, { query, width, height, scale: 2 });
  await wait(400);
  await page.evaluate(y => scrollTo(0, y === 'end' ? document.documentElement.scrollHeight : y), scrollY);
  await wait(1200);
  mkdirSync(resolve(ROOT, out, '..'), { recursive: true });
  // JPEG for the poster (GitHub's social preview must stay under 1 MB), WebP for the rest:
  // the frost grain makes PNGs several times larger for no visible gain.
  const type = /.jpe?g$/.test(out) ? 'jpeg' : /.webp$/.test(out) ? 'webp' : 'png';
  await page.screenshot({ path: resolve(ROOT, out), type, ...(type === 'png' ? {} : { quality: 90 }) });
  await page.close();
  console.log(errors.length ? `wrote ${out} with errors:\n  ${errors.join('\n  ')}` : `wrote ${out}`);
}

const browser = await launch();
const [file, out, size, query, y] = process.argv.slice(2);
if (file) await shoot(browser, file, out, size, query, y === 'end' ? 'end' : Number(y || 0));
else for (const s of SHOTS) await shoot(browser, ...s);
await browser.close();
