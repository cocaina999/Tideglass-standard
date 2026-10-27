/*!
 * Tideglass 1.0.0 · touch physics for the web kit.
 * Dent and peel, long-press, the selection blob, switch stretch, slider sync,
 * overlays and the haptics bridge. No dependencies. Works as a classic
 * <script>, a CommonJS require, or a side-effect import in a bundler.
 * MIT License
 */
(function (global, factory) {
  var api = factory(global);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (global) global.Tideglass = api;
})(typeof window !== 'undefined' ? window : undefined, function (win) {
  'use strict';

  var VERSION = '1.0.0';
  var noop = function () {};
  // Server rendering: expose the same shape, do nothing.
  if (!win || !win.document) {
    return { version: VERSION, init: noop, haptic: noop, open: noop, close: noop, toast: noop, select: noop, sync: noop, reducedMotion: function () { return false; } };
  }
  if (win.Tideglass && win.Tideglass.version) return win.Tideglass;   // loaded twice

  const doc = win.document;
  const html = doc.documentElement;

  const PRESSABLE = '.tg-press,.tg-btn,.tg-icon-btn,.tg-orb,.tg-chip,.tg-tile,.tg-key,.tg-switch,.tg-tab,.tg-seg-item,.tg-menu-item,a.tg-row,button.tg-row,.tg-row[role="button"],[data-press]';
  const BLOB_HOST = '[data-tg-blob],.tg-seg,.tg-tabbar';
  const ITEM = '.tg-tab,.tg-seg-item,[role="tab"]';
  const SELECTED = '[aria-selected="true"],[aria-current]:not([aria-current="false"]),[aria-checked="true"],.is-selected';

  // Timings and limits from spec/04-touch.md.
  const T = {
    minDent: 90,     // every tap shows the whole dent
    dragOff: 40,     // drag this far and the press peels back without firing
    lean: 0.3,       // S and M follow the finger by 30% of the drag...
    leanMax: 3,      // ...up to 3px
    peel: 440,
    back: 520,       // Firm and Lift ease back on their own springs
    hold: 350,       // long-press threshold
    holdSlop: 8,
    pop: 320,
    scrub: 10,       // horizontal travel before a tab bar starts scrubbing
  };

  const motionQuery = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => html.dataset.tgMotion === 'reduce' || (html.dataset.tgMotion !== 'full' && !!(motionQuery && motionQuery.matches));
  const isDisabled = el => el.matches(':disabled,[aria-disabled="true"]');
  const now = () => win.performance.now();
  const closest = (node, sel) => (node && node.closest ? node.closest(sel) : null);


  /* ------------------------------------------------------------ haptics */

  // The web has no reliable haptics. Tideglass marks the moments instead;
  // a native shell (Capacitor, React Native WebView, Tauri) can listen and play them.
  function haptic(kind, el) {
    (el || doc).dispatchEvent(new CustomEvent('tg-haptic', { bubbles: true, detail: { kind: kind } }));
  }


  /* ------------------------------------------------------------ dent and peel */

  // Size picks the tier; data-press can only name one explicitly.
  function tierOf(el) {
    const set = el.getAttribute('data-press');
    if (set) return set;
    if (el.classList.contains('tg-key')) return 'lift';
    const w = el.offsetWidth;
    return w <= 56 ? 's' : w <= 160 ? 'm' : 'l';
  }

  // Controls inside a scrolling list never lean (TO-6): the scroll owns that drag.
  function inScroller(el) {
    for (let n = el.parentElement; n && n !== doc.body && n !== html; n = n.parentElement) {
      const s = win.getComputedStyle(n);
      if ((/auto|scroll/.test(s.overflowY) && n.scrollHeight > n.clientHeight) ||
          (/auto|scroll/.test(s.overflowX) && n.scrollWidth > n.clientWidth)) return true;
    }
    return false;
  }

  function dent(el, x, y) {
    const tier = tierOf(el);
    if (tier === 'none') return 0;
    el.setAttribute('data-tg-tier', tier);
    if (x == null) {
      el.style.removeProperty('--tg-ox');
      el.style.removeProperty('--tg-oy');
    } else {                                    // the dent starts where the finger is
      const r = el.getBoundingClientRect();
      el.style.setProperty('--tg-ox', ((x - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--tg-oy', ((y - r.top) / r.height * 100).toFixed(1) + '%');
    }
    el.style.willChange = 'transform';
    el.setAttribute('data-tg-state', 'dent');
    el._tgId = (el._tgId || 0) + 1;
    return el._tgId;
  }

  function settle(el) {
    el.removeAttribute('data-tg-state');
    el.style.removeProperty('--tg-lx');
    el.style.removeProperty('--tg-ly');
    el.style.removeProperty('will-change');
  }

  function release(el, id, wait) {
    setTimeout(() => {
      if (el._tgId !== id) return;              // pressed again meanwhile
      const tier = el.getAttribute('data-tg-tier');
      const springy = (tier === 's' || tier === 'm' || tier === 'l') && !reduced();
      if (springy) el.setAttribute('data-tg-state', 'peel');
      else el.removeAttribute('data-tg-state');  // Firm, Lift and reduced motion ease back in CSS
      setTimeout(() => { if (el._tgId === id) settle(el); }, springy ? T.peel : T.back);
    }, wait);
  }

  // Scrolling took over: the dent drops at once, with no peel.
  function drop(el) {
    el._tgId = (el._tgId || 0) + 1;
    settle(el);
  }

  function swallowClick(el) {
    const stop = e => { e.preventDefault(); e.stopImmediatePropagation(); };
    el.addEventListener('click', stop, { capture: true, once: true });
    setTimeout(() => el.removeEventListener('click', stop, { capture: true }), 350);
  }

  let press = null;

  function onDown(e) {
    if (e.button !== 0) return;
    if (press) {
      if (!e.isPrimary) return;                 // a second finger: keep the first press
      clearTimeout(press.timer);
      drop(press.el);
      press = null;
    }
    const el = closest(e.target, PRESSABLE);
    if (!el || isDisabled(el)) return;
    const id = dent(el, e.clientX, e.clientY);
    if (!id) return;
    const tier = el.getAttribute('data-tg-tier');
    const lean = (tier === 's' || tier === 'm') && !inScroller(el);
    press = { el: el, id: id, pointerId: e.pointerId, x: e.clientX, y: e.clientY, t: now(), lean: lean, cancelled: false, held: 0, timer: 0 };
    if (el.hasAttribute('data-hold')) press.timer = setTimeout(hold, T.hold, press);
  }

  function onMove(e) {
    if (!press || e.pointerId !== press.pointerId || press.cancelled) return;
    const dx = e.clientX - press.x, dy = e.clientY - press.y, d = Math.hypot(dx, dy);
    if (press.timer && d > T.holdSlop) { clearTimeout(press.timer); press.timer = 0; }
    if (d > T.dragOff) {                        // dragged off: peel back, and the tap will not fire
      press.cancelled = true;
      if (!press.held) release(press.el, press.id, 0);
      return;
    }
    if (press.lean && !press.held && !reduced()) {
      const lean = v => Math.max(-T.leanMax, Math.min(T.leanMax, v * T.lean)).toFixed(2) + 'px';
      press.el.style.setProperty('--tg-lx', lean(dx));
      press.el.style.setProperty('--tg-ly', lean(dy));
    }
  }

  function onUp(e) {
    if (!press || e.pointerId !== press.pointerId) return;
    const p = press;
    press = null;
    clearTimeout(p.timer);
    if (p.cancelled || p.held) swallowClick(p.el);
    if (p.held) {
      setTimeout(() => { if (p.el._tgId === p.id) settle(p.el); }, Math.max(0, T.pop - (now() - p.held)));
    } else if (!p.cancelled) {
      release(p.el, p.id, Math.max(0, T.minDent - (now() - p.t)));   // quick taps still show the full dent
    }
  }

  function onCancel(e) {
    if (!press || e.pointerId !== press.pointerId) return;
    clearTimeout(press.timer);
    drop(press.el);
    press = null;
  }

  function hold(p) {
    if (press !== p) return;
    p.timer = 0;
    p.held = now();
    p.el.setAttribute('data-tg-state', 'held');
    haptic('hold', p.el);
    p.el.dispatchEvent(new CustomEvent('tg-hold', { bubbles: true, detail: { x: p.x, y: p.y } }));
  }

  // Keyboard presses get the same feedback: Enter fires on keydown, Space on keyup.
  let keyPress = null;

  function onKeyDown(e) {
    if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return;
    const el = e.target;
    if (!el.matches || !el.matches(PRESSABLE) || isDisabled(el)) return;
    if (e.key === 'Enter' && el.matches('input')) return;
    if (e.key === ' ' && el.matches('a')) return;
    const id = dent(el);
    if (!id) return;
    if (e.key === 'Enter') release(el, id, T.minDent);
    else keyPress = { el: el, id: id, t: now() };
  }

  function onKeyUp(e) {
    if (!keyPress || e.key !== ' ') return;
    const k = keyPress;
    keyPress = null;
    release(k.el, k.id, Math.max(0, T.minDent - (now() - k.t)));
  }


  /* ------------------------------------------------------------ selection blob */

  function setSelected(item, on) {
    const role = item.getAttribute('role');
    if (role === 'tab') {
      item.setAttribute('aria-selected', on ? 'true' : 'false');
      item.setAttribute('tabindex', on ? '0' : '-1');
    } else if (role === 'radio') {
      item.setAttribute('aria-checked', on ? 'true' : 'false');
    } else if (item.matches('a') || item.hasAttribute('aria-current')) {
      if (on) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    } else {
      item.classList.toggle('is-selected', on);
    }
  }

  function initBlob(host) {
    if (host._tg) return host._tg;
    let blob = host.querySelector(':scope > .tg-blob');
    if (!blob) {
      blob = doc.createElement('span');
      blob.className = 'tg-blob';
      blob.setAttribute('aria-hidden', 'true');
      host.prepend(blob);
    }
    const items = () => Array.from(host.querySelectorAll(ITEM));
    const current = () => items().find(i => i.matches(SELECTED));
    const glide = 'transform var(--tg-dur-glide) var(--tg-glide),width var(--tg-dur-glide) var(--tg-glide),height var(--tg-dur-glide) var(--tg-glide)';

    function place(item, animate) {
      if (!item) { blob.style.opacity = '0'; return; }
      blob.style.opacity = '';
      blob.style.transition = animate ? glide : 'none';
      blob.style.width = item.offsetWidth + 'px';
      blob.style.height = item.offsetHeight + 'px';
      blob.style.transform = 'translate(' + item.offsetLeft + 'px,' + item.offsetTop + 'px)';
      // On its way, the blob stretches 14% along and thins 6%.
      if (animate && !reduced() && blob.animate) {
        blob.animate([{ scale: '1 1' }, { scale: '1.14 0.94', offset: 0.35 }, { scale: '1 1' }], { duration: 420, easing: 'ease-out' });
      }
    }

    function select(item) {
      if (!item || isDisabled(item)) return;
      const prev = current();
      if (prev !== item) {
        items().forEach(i => setSelected(i, i === item));
        haptic('selection', item);
        host.dispatchEvent(new CustomEvent('tg-change', { bubbles: true, detail: { item: item, index: items().indexOf(item), previous: prev || null } }));
      }
      place(item, true);
    }

    host.addEventListener('click', e => {
      const item = closest(e.target, ITEM);
      if (item && host.contains(item)) select(item);
    });

    // Scrub: press and slide along the bar; the blob follows like a drop of jelly.
    host.addEventListener('pointerdown', e => {
      if (e.button !== 0 || !e.isPrimary) return;
      const list = items();
      if (list.length < 2) return;
      const startX = e.clientX;
      let scrubbing = false, lastX = startX, lastT = now(), v = 0;

      const move = ev => {
        if (ev.pointerId !== e.pointerId) return;
        if (!scrubbing) {
          if (Math.abs(ev.clientX - startX) < T.scrub) return;
          scrubbing = true;
          host.setAttribute('data-tg-scrub', '');
          blob.style.opacity = '';
          blob.style.transition = 'width var(--tg-dur-glide) var(--tg-glide),height var(--tg-dur-glide) var(--tg-glide)';
          try { host.setPointerCapture(e.pointerId); } catch (_) { /* pointer already gone */ }
        }
        const t = now();
        v = v * 0.6 + ((ev.clientX - lastX) / Math.max(1, t - lastT)) * 1000 * 0.4;
        lastX = ev.clientX;
        lastT = t;
        const first = list[0], last = list[list.length - 1];
        const w = blob.offsetWidth || first.offsetWidth;
        const x = ev.clientX - host.getBoundingClientRect().left - host.clientLeft - w / 2;
        const clamped = Math.max(first.offsetLeft, Math.min(last.offsetLeft + last.offsetWidth - w, x));
        blob.style.transform = 'translate(' + clamped + 'px,' + first.offsetTop + 'px)';
        if (!reduced()) {
          const s = Math.min(0.18, Math.abs(v) / 4000);
          blob.style.scale = (1 + s).toFixed(3) + ' ' + (1 - s * 0.4).toFixed(3);
        }
      };

      const end = ev => {
        if (ev.pointerId !== e.pointerId) return;
        doc.removeEventListener('pointermove', move);
        doc.removeEventListener('pointerup', end, true);
        doc.removeEventListener('pointercancel', end, true);
        if (!scrubbing) return;
        host.removeAttribute('data-tg-scrub');
        blob.style.scale = '';
        if (ev.type === 'pointercancel') { place(current(), true); return; }
        const cx = ev.clientX - host.getBoundingClientRect().left;
        let target = list[0], best = Infinity;
        list.forEach(i => {
          const d = Math.abs(i.offsetLeft + i.offsetWidth / 2 - cx);
          if (d < best && !isDisabled(i)) { best = d; target = i; }
        });
        if (target !== current()) target.click();   // links navigate, tabs select
        else place(target, true);
        swallowClick(host);                          // the pointer's own click must not fire twice
      };

      doc.addEventListener('pointermove', move);
      // Capture phase, so the blob decides before the press logic swallows the click.
      doc.addEventListener('pointerup', end, true);
      doc.addEventListener('pointercancel', end, true);
    });

    // Arrow keys move between items; in a tablist, selection follows focus.
    host.addEventListener('keydown', e => {
      if (!/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) return;
      const list = items().filter(i => !isDisabled(i));
      const i = list.indexOf(doc.activeElement);
      if (i < 0) return;
      const rtl = win.getComputedStyle(host).direction === 'rtl';
      let n = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : i + ((e.key === 'ArrowRight') !== rtl ? 1 : -1);
      n = (n + list.length) % list.length;
      e.preventDefault();
      list[n].focus();
      if (/^(tablist|radiogroup)$/.test(host.getAttribute('role') || '')) select(list[n]);
    });

    if (win.ResizeObserver) {
      const ro = new ResizeObserver(() => { if (!host.hasAttribute('data-tg-scrub')) place(current(), false); });
      ro.observe(host);
      items().forEach(i => ro.observe(i));
    }
    place(current(), false);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => place(current(), false));

    host._tg = { select: select, refresh: () => place(current(), false), blob: blob };
    return host._tg;
  }


  /* ------------------------------------------------------------ switch and slider */

  function onChange(e) {
    const el = e.target;
    if (!el.matches || !el.matches('.tg-switch')) return;
    haptic('selection', el);
    if (!reduced() && el.animate) {
      try {   // the thumb stretches along its travel, like the blob
        el.animate([{ scale: '1 1' }, { scale: '1.14 0.94', offset: 0.35 }, { scale: '1 1' }], { duration: 420, easing: 'ease-out', pseudoElement: '::before' });
      } catch (_) { /* pseudo-element animation unsupported: the glide alone is fine */ }
    }
  }

  function syncSlider(el) {
    const min = parseFloat(el.min) || 0;
    const max = el.max === '' ? 100 : parseFloat(el.max);
    const v = parseFloat(el.value);
    el.style.setProperty('--tg-value', max > min ? ((v - min) / (max - min)).toFixed(4) : '0');
  }

  function onInput(e) {
    if (e.target.matches && e.target.matches('.tg-slider')) syncSlider(e.target);
  }


  /* ------------------------------------------------------------ overlays */

  function afterAnimations(el, fallbackMs, fn) {
    let done = false;
    const finish = () => { if (!done) { done = true; fn(); } };
    const anims = el.getAnimations ? el.getAnimations() : [];
    if (anims.length) Promise.all(anims.map(a => a.finished)).then(finish, finish);
    else finish();
    setTimeout(finish, fallbackMs);
  }

  // Menus, popovers and sheets grow out of what opened them.
  function open(el, opener) {
    el.hidden = false;
    if (opener && !el.classList.contains('tg-sheet')) {
      const a = opener.getBoundingClientRect(), b = el.getBoundingClientRect();
      el.style.transformOrigin = (a.left + a.width / 2 - b.left) + 'px ' + (a.top + a.height / 2 - b.top) + 'px';
    }
    el.classList.remove('tg-exit');
    el.classList.add('tg-enter');
    return new Promise(res => afterAnimations(el, 900, () => { el.classList.remove('tg-enter'); res(); }));
  }

  // They leave quietly: no overshoot.
  function close(el) {
    if (el.hidden) return Promise.resolve();
    el.classList.remove('tg-enter');
    el.classList.add('tg-exit');
    return new Promise(res => afterAnimations(el, 500, () => { el.hidden = true; el.classList.remove('tg-exit'); res(); }));
  }

  function toast(message, options) {
    const opts = options || {};
    const el = doc.createElement('div');
    el.className = 'tg-toast tg-thick';
    el.setAttribute('role', 'status');
    el.textContent = message;
    (opts.parent || doc.body).appendChild(el);
    el.style.transformOrigin = '50% 100%';
    open(el);
    setTimeout(() => close(el).then(() => el.remove()), opts.duration || 2800);
    return el;
  }


  /* ------------------------------------------------------------ wiring */

  function init(root) {
    const scope = root || doc;
    if (scope.matches && scope.matches(BLOB_HOST)) initBlob(scope);
    scope.querySelectorAll(BLOB_HOST).forEach(initBlob);
    if (scope.matches && scope.matches('.tg-slider')) syncSlider(scope);
    scope.querySelectorAll('.tg-slider').forEach(syncSlider);
  }

  doc.addEventListener('pointerdown', onDown, { passive: true });
  doc.addEventListener('pointermove', onMove, { passive: true });
  doc.addEventListener('pointerup', onUp);
  doc.addEventListener('pointercancel', onCancel);
  doc.addEventListener('keydown', onKeyDown);
  doc.addEventListener('keyup', onKeyUp);
  doc.addEventListener('change', onChange);
  doc.addEventListener('input', onInput);
  doc.addEventListener('click', e => {
    const el = closest(e.target, '[data-haptic]');
    if (el && !isDisabled(el)) haptic(el.getAttribute('data-haptic'), el);
  });
  // Android fires contextmenu during a long-press; the hold already answered it.
  doc.addEventListener('contextmenu', e => {
    if (press && press.held && press.el.contains(e.target)) e.preventDefault();
  });
  // A press must never stick if the window loses the pointer.
  win.addEventListener('blur', () => { if (press) { clearTimeout(press.timer); drop(press.el); press = null; } });

  function start() {
    init();
    // Frameworks add markup later: initialize blob hosts and sliders as they appear.
    if (win.MutationObserver) {
      new MutationObserver(records => {
        records.forEach(r => r.addedNodes.forEach(n => { if (n.nodeType === 1) init(n); }));
      }).observe(doc.body || html, { childList: true, subtree: true });
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
  else start();

  return {
    version: VERSION,
    init: init,
    haptic: haptic,
    open: open,
    close: close,
    toast: toast,
    select: (host, item) => initBlob(host).select(item),
    sync: syncSlider,
    reducedMotion: reduced,
  };
});
