// Demo settings: brand, theme and accessibility, from the URL or the playground.
// Phones embedded in the specimen get their settings through URL parameters.
(function () {
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const ATTR = { brand: 'tgBrand', theme: 'tgTheme', motion: 'tgMotion', transparency: 'tgTransparency', contrast: 'tgContrast' };
  const OFF = { brand: '', theme: 'auto', motion: 'full', transparency: 'full', contrast: 'standard' };
  const store = {
    get: k => { try { return localStorage.getItem('tideglass.' + k); } catch (_) { return null; } },
    set: (k, v) => { try { localStorage.setItem('tideglass.' + k, v); } catch (_) { /* private mode */ } },
  };
  const remember = html.hasAttribute('data-demo-remember');

  function apply(key, value) {
    const attr = ATTR[key];
    if (!value || value === OFF[key]) delete html.dataset[attr];
    else html.dataset[attr] = value;
  }

  for (const key of Object.keys(ATTR)) {
    const v = params.get(key) || (remember ? store.get(key) : null);
    if (v) apply(key, v);
  }

  window.demo = {
    get: key => html.dataset[ATTR[key]] || OFF[key] || 'seafoam',
    set(key, value) {
      apply(key, value);
      if (remember) store.set(key, value);
      document.dispatchEvent(new CustomEvent('demo-settings', { detail: { key: key, value: value } }));
    },
    query() {
      const q = new URLSearchParams();
      for (const key of Object.keys(ATTR)) if (html.dataset[ATTR[key]]) q.set(key, html.dataset[ATTR[key]]);
      return q.toString();
    },
  };

  // ?scroll=N starts the page scrolled, so screenshots can show the tide at work.
  const startAt = Number(params.get('scroll'));
  if (startAt) addEventListener('load', () => scrollTo(0, startAt));

  // Demo links go nowhere.
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // A small pill names each haptic moment, the way a native app would play it.
  if (params.get('haptics') !== '0') {
    let pill, timer;
    document.addEventListener('tg-haptic', e => {
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'd-haptic tg-pill tg-jelly tg-thick';
        pill.setAttribute('aria-hidden', 'true');
        document.body.appendChild(pill);
      }
      pill.textContent = 'haptic · ' + e.detail.kind;
      pill.hidden = false;
      pill.classList.remove('tg-drop');
      void pill.offsetWidth;
      pill.classList.add('tg-drop');
      clearTimeout(timer);
      timer = setTimeout(() => { pill.hidden = true; }, 1100);
    });
  }
})();
