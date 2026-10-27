#!/usr/bin/env node
// `npm run smoke`: drives the demos in a real headless browser and checks the
// behavior the spec promises: dent and peel, tiers, drag-off, long-press, the blob,
// keyboard, switches, overlays, reduced motion and theme scoping.

import { launch, open, wait } from './browser.mjs';

let failures = 0;
const ok = msg => console.log(`  ✓ ${msg}`);
const fail = msg => { failures++; console.log(`  ✗ ${msg}`); };
const expect = (cond, msg, detail = '') => (cond ? ok(msg) : fail(detail ? `${msg} (${detail})` : msg));

const browser = await launch();
// Waits for something to happen instead of guessing how long a slow machine needs.
const until = (page, fn, arg, timeout = 1000) =>
  page.waitForFunction(fn, { timeout, polling: 10 }, arg).then(() => true, () => false);
const state = (page, sel) => page.$eval(sel, el => ({ state: el.getAttribute('data-tg-state'), tier: el.getAttribute('data-tg-tier') }));
const center = async (page, sel) => {
  const box = await (await page.$(sel)).boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};
async function scrollInto(page, sel) {
  await page.$eval(sel, el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await wait(150);
}

console.log('\nPages load cleanly');
for (const file of ['demo/index.html', 'demo/home.html', 'demo/chat.html', 'demo/controls.html']) {
  for (const theme of ['light', 'dark']) {
    const { page, errors } = await open(browser, file, { query: `theme=${theme}&haptics=0` });
    await wait(300);
    expect(!errors.length, `${file} (${theme})`, errors.join('; '));
    await page.close();
  }
}

console.log('\nDent and peel');
{
  const { page } = await open(browser, 'demo/index.html', { query: 'theme=light&haptics=0', width: 1280, height: 900 });
  const iconBtn = '#touch .tg-icon-btn';
  await scrollInto(page, iconBtn);
  let p = await center(page, iconBtn);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(30);
  let s = await state(page, iconBtn);
  expect(s.state === 'dent' && s.tier === 's', 'a 44px icon button dents as tier S', JSON.stringify(s));
  await wait(150);
  const dented = await page.$eval(iconBtn, el => getComputedStyle(el).transform);
  expect(dented !== 'none', 'the dent squashes the control', dented);
  await page.mouse.up();
  let done = await until(page, sel => document.querySelector(sel).getAttribute('data-tg-state') === 'peel', iconBtn, 300);
  expect(done, 'release peels', JSON.stringify(await state(page, iconBtn)));
  done = await until(page, sel => !document.querySelector(sel).hasAttribute('data-tg-state'), iconBtn, 1000);
  expect(done, 'then it settles to rest', JSON.stringify(await state(page, iconBtn)));

  // Timed inside the page, so the protocol's own latency can't blur the 90ms.
  await page.$eval(iconBtn, el => {
    window.__states = [];
    new MutationObserver(() => window.__states.push([el.getAttribute('data-tg-state'), performance.now()]))
      .observe(el, { attributes: true, attributeFilter: ['data-tg-state'] });
  });
  await page.mouse.down();
  await page.mouse.up();
  await until(page, () => window.__states.some(([st]) => st === null), null, 1500);
  const states = await page.evaluate(() => window.__states);
  const at = name => (states.find(([st]) => st === name) || [])[1];
  const held = at('peel') - at('dent');
  expect(held >= 85, 'a quick tap still shows the full dent (90ms) before peeling', `${Math.round(held)}ms`);

  const chip = '#touch .tg-chip';
  p = await center(page, chip);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(20);
  expect((await state(page, chip)).tier === 'm', 'a chip dents as tier M');
  await page.mouse.move(p.x + 4, p.y + 2);
  await wait(30);
  const lean = await page.$eval(chip, el => el.style.getPropertyValue('--tg-lx'));
  expect(lean === '1.20px', 'S and M lean 30% of the drag', `lean ${lean}`);
  await page.mouse.up();
  await wait(700);

  const row = '#touch .tg-row';
  p = await center(page, row);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(20);
  expect((await state(page, row)).tier === 'l', 'a wide row dents as tier L');
  await page.mouse.up();
  await wait(700);

  const pay = '#touch [data-press="firm"]';
  p = await center(page, pay);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(20);
  expect((await state(page, pay)).tier === 'firm', 'data-press="firm" names the Firm tier');
  await page.mouse.up();
  await wait(140);
  expect((await state(page, pay)).state === null, 'Firm never peels');
  await wait(600);

  const key = '#touch .tg-key';
  p = await center(page, key);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(20);
  expect((await state(page, key)).tier === 'lift', 'emoji keys use Lift');
  await page.mouse.up();
  await wait(700);

  console.log('\nDrag off and long-press');
  const chip2 = '#touch .tg-chip:nth-of-type(2)';
  await page.$eval(chip2, el => { window.__clicks = 0; el.addEventListener('click', () => window.__clicks++); });
  p = await center(page, chip2);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x + 60, p.y, { steps: 6 });
  await page.mouse.move(p.x, p.y, { steps: 6 });
  await page.mouse.up();
  await wait(50);
  expect(await page.evaluate(() => window.__clicks) === 0, 'dragging 40px off cancels the tap, even after coming back');
  await wait(600);

  await page.evaluate(() => { window.__held = 0; window.__holdClicks = 0; const r = document.getElementById('holdrow'); r.addEventListener('tg-hold', () => window.__held++); r.addEventListener('click', () => window.__holdClicks++); });
  p = await center(page, '#holdrow');
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(450);
  expect(await page.evaluate(() => window.__held) === 1, 'holding 350ms fires tg-hold');
  expect((await state(page, '#holdrow')).state === 'held', 'the row pops out when the hold fires');
  await page.mouse.up();
  await wait(50);
  expect(await page.evaluate(() => window.__holdClicks) === 0, 'a long-press does not also click');
  await wait(500);

  console.log('\nKeyboard');
  await page.focus(iconBtn);
  await page.keyboard.down('Space');
  await wait(20);
  expect((await state(page, iconBtn)).state === 'dent', 'Space dents a focused control');
  await page.keyboard.up('Space');
  await wait(700);

  console.log('\nSelection blob');
  const tabs = '#navigation [role="tablist"].tg-tabbar';
  await scrollInto(page, tabs);
  await page.click(`${tabs} .tg-tab:nth-of-type(2)`);
  await wait(700);
  let sel = await page.$eval(tabs, host => {
    const t = host.querySelector('[aria-selected="true"]');
    const blob = host.querySelector('.tg-blob');
    return { label: t.textContent.trim(), left: t.offsetLeft, blob: new DOMMatrix(getComputedStyle(blob).transform).m41 };
  });
  expect(sel.label === 'Search' && Math.abs(sel.left - sel.blob) < 1, 'tapping a tab selects it and the blob glides under it', JSON.stringify(sel));

  await page.focus(`${tabs} [aria-selected="true"]`);
  await page.keyboard.press('ArrowRight');
  await wait(100);
  sel = await page.$eval(tabs, host => host.querySelector('[aria-selected="true"]').textContent.trim());
  expect(sel === 'Saved', 'ArrowRight moves the selection in a tablist', sel);

  const first = await center(page, `${tabs} .tg-tab:nth-of-type(1)`);
  const last = await center(page, `${tabs} .tg-tab:nth-of-type(4)`);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  await page.mouse.move(last.x, last.y, { steps: 14 });
  const scrubbing = await page.$eval(tabs, h => h.hasAttribute('data-tg-scrub'));
  await page.mouse.up();
  await wait(700);
  sel = await page.$eval(tabs, host => host.querySelector('[aria-selected="true"]').textContent.trim());
  expect(scrubbing && sel === 'You', 'pressing and sliding scrubs the blob and selects where it lands', `${scrubbing} ${sel}`);

  console.log('\nSwitch, slider, menu');
  const sw = '#navigation .tg-switch';
  await page.evaluate(() => { window.__haptics = []; document.addEventListener('tg-haptic', e => window.__haptics.push(e.detail.kind)); });
  const before = await page.$eval(sw, el => el.checked);
  await page.click(sw);
  await wait(50);
  expect((await page.$eval(sw, el => el.checked)) !== before, 'a switch toggles');
  expect((await page.evaluate(() => window.__haptics)).includes('selection'), 'and marks a selection haptic');

  const slider = '#navigation .tg-slider';
  await page.focus(slider);
  await page.keyboard.press('ArrowRight');
  const v = await page.$eval(slider, el => [el.value, el.style.getPropertyValue('--tg-value')]);
  expect(Number(v[1]).toFixed(2) === (Number(v[0]) / 100).toFixed(2), 'the slider keeps --tg-value in sync', v.join(' / '));

  await scrollInto(page, '#menu-btn');
  await page.click('#menu-btn');
  await wait(60);
  expect(await page.$eval('#menu', m => !m.hidden && m.classList.contains('tg-enter')), 'the menu opens with the enter motion');
  expect(await until(page, () => !document.getElementById('menu').classList.contains('tg-enter'), null, 1500), 'the enter class clears when the motion ends');
  await page.keyboard.press('Escape');
  expect(await until(page, () => document.getElementById('menu').hidden, null, 1500), 'Escape closes it');
  await page.close();
}

console.log('\nSettings people turn on');
{
  const { page } = await open(browser, 'demo/index.html', { query: 'theme=light&haptics=0', width: 1280, height: 900, media: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const btn = '#touch .tg-icon-btn';
  await scrollInto(page, btn);
  const p = await center(page, btn);
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await wait(200);
  const look = await page.$eval(btn, el => [getComputedStyle(el).transform, getComputedStyle(el).opacity]);
  expect(look[0] === 'none' && look[1] === '0.85', 'reduce motion turns the dent into a dim', look.join(' '));
  await page.mouse.up();
  await wait(100);
  expect((await state(page, btn)).state === null, 'and skips the peel');
  await page.close();

  const t = await open(browser, 'demo/home.html', { query: 'theme=light&transparency=reduce&haptics=0' });
  const bf = await t.page.$eval('.tg-tabbar', el => getComputedStyle(el).backdropFilter);
  expect(bf === 'none', 'reduce transparency removes the blur from floating glass', bf);
  await t.page.close();

  const c = await open(browser, 'demo/home.html', { query: 'theme=light&contrast=more&haptics=0' });
  const same = await c.page.evaluate(() => { const s = getComputedStyle(document.documentElement); return s.getPropertyValue('--tg-text-2').trim() === s.getPropertyValue('--tg-text').trim(); });
  expect(same, 'increase contrast makes secondary text primary');
  await c.page.close();
}

console.log('\nThemes and scoping');
{
  const { page } = await open(browser, 'demo/home.html', { query: 'theme=light&haptics=0' });
  const scoped = await page.evaluate(() => {
    const box = document.createElement('section');
    box.setAttribute('data-tg-brand', 'coral');
    box.setAttribute('data-tg-theme', 'dark');
    box.innerHTML = '<div class="tg-card">x</div>';
    document.body.appendChild(box);
    const root = getComputedStyle(document.documentElement), card = getComputedStyle(box.firstChild);
    return { rootText: root.color, cardText: card.color, rootFoam: root.getPropertyValue('--tg-foam-2'), boxFoam: getComputedStyle(box).getPropertyValue('--tg-foam-2') };
  });
  expect(scoped.rootText !== scoped.cardText, 'a nested data-tg-theme switches theme inside it', JSON.stringify(scoped));
  expect(scoped.rootFoam !== scoped.boxFoam, 'a nested data-tg-brand recomputes the layers', `${scoped.rootFoam} vs ${scoped.boxFoam}`);
  await page.close();
}

console.log('\nDemos');
{
  const { page } = await open(browser, 'demo/chat.html', { query: 'theme=light&haptics=0' });
  const count = () => page.$$eval('.tg-bubble', b => b.length);
  const n = await count();
  await page.type('#msg', 'Is it in stock?');
  expect(await page.$eval('#send', b => b.getAttribute('aria-label')) === 'Send', 'typing swaps the mic for send');
  await page.click('#send');
  expect(await until(page, k => document.querySelectorAll('.tg-bubble').length === k, n + 1, 1000), 'sending adds a bubble');
  expect(await until(page, k => document.querySelectorAll('.tg-bubble').length === k, n + 2, 5000), 'and a reply arrives');
  await page.close();

  const cc = await open(browser, 'demo/controls.html', { query: 'theme=light&haptics=0' });
  const tile = '#tiles .tg-tile:nth-of-type(2)';
  await cc.page.click(tile);
  expect(await until(cc.page, sel => document.querySelector(sel).getAttribute('aria-pressed') === 'true', tile, 1000), 'a control tile toggles to Deep');
  await cc.page.close();
}

await browser.close();
console.log(failures ? `\n${failures} smoke check(s) failed.` : '\nAll smoke checks passed.');
process.exit(failures ? 1 : 0);
