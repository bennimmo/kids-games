// Beautiful Bells – a makeover game.
// Screens: pick a girl → choose hair colour / length / eyes → salon (drag things on).
// Everything is drag and drop. Brushes (lipstick, eyeshadow, blusher, face paint)
// paint as you rub, and stay in your hand until you put them down. Scissors cut hair.
// Every girl you make is saved in this browser (last 20) so you can carry on later.
import { sound } from '../../js/engine/sound.js';
import { GIRLS, TABS, ITEMS, HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS } from './items.js';
import { renderGirl, swatch, tiePoints, hairBottom, strokeAttrs, ptsToD } from './draw.js';
import { createStore, newLook, newKey, presetStrokes } from './look.js';
import { loadGallery, saveToGallery, removeFromGallery } from './gallery.js';

const HAIR_SPOTS = [[132, 128], [268, 128], [160, 104], [240, 104], [118, 172], [282, 172], [200, 96]];
const isTool = it => it && (it.action === 'paint' || it.action === 'cut');
const MIN_CUT = 250;

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const root = document.createElement('div');
  root.className = 'bb';
  stage.appendChild(root);

  let store = null;      // the look being made
  let saveId = null;     // gallery id for this girl
  let saving = false;    // only save once she reaches the salon
  let unsub = null;
  let saveTimer = null;
  let tab = 'lips';
  let teardownSalon = null;
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };

  function startSession(look, id = null) {
    if (unsub) unsub();
    store = createStore(look);
    saveId = id || newKey();
    saving = !!id;
    unsub = store.subscribe(() => {
      if (!saving) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveToGallery(saveId, store.get()), 300);
    });
  }

  function clearScreen() {
    if (teardownSalon) { teardownSalon(); teardownSalon = null; }
    root.innerHTML = '';
  }

  // ---------- 1. Pick a girl ----------
  function pickScreen() {
    clearScreen();
    const saved = loadGallery();
    root.innerHTML = `
      <div class="bb-pick">
        <h1 class="bb-title">Beautiful Bells</h1>
        <p class="bb-sub">Pick your girl!</p>
        <div class="bb-girls">
          ${GIRLS.map(g => `
            <button class="bb-card" data-girl="${g.id}">
              <div class="bb-card-pic">${renderGirl(newLook(g), { viewBox: '20 10 360 460' })}</div>
              <span>${g.name}</span>
            </button>`).join('')}
        </div>
        ${saved.length ? `
          <h2 class="bb-sub">💖 My girls</h2>
          <div class="bb-girls bb-saved">
            ${saved.map(s => `
              <div class="bb-card-wrap">
                <button class="bb-card" data-saved="${s.id}">
                  <div class="bb-card-pic">${renderGirl(s.look, { viewBox: '20 10 360 460' })}</div>
                  <span>${s.look.name}</span>
                </button>
                <button class="bb-del" data-del="${s.id}" aria-label="Delete">🗑️</button>
              </div>`).join('')}
          </div>` : ''}
      </div>`;
    root.querySelectorAll('[data-girl]').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      startSession(newLook(GIRLS.find(g => g.id === b.dataset.girl)));
      setupScreen();
    }));
    root.querySelectorAll('[data-saved]').forEach(b => b.addEventListener('click', () => {
      const s = saved.find(x => x.id === b.dataset.saved);
      if (!s) return;
      sound.pop();
      startSession(s.look, s.id);
      salonScreen();
    }));
    root.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      // First tap asks "sure?", second tap deletes.
      if (!b.classList.contains('sure')) {
        b.classList.add('sure');
        b.textContent = 'Sure?';
        later(() => { if (b.isConnected) { b.classList.remove('sure'); b.textContent = '🗑️'; } }, 2500);
        return;
      }
      sound.bump();
      removeFromGallery(b.dataset.del);
      pickScreen();
    }));
  }

  // ---------- 2. Hair colour, length and eyes ----------
  function setupScreen() {
    clearScreen();
    const draw = () => {
      const look = store.get();
      root.innerHTML = `
        <div class="bb-setup">
          <button class="bb-back" aria-label="Back">⬅️</button>
          <div class="bb-setup-pic">
            <h1 class="bb-title">${look.name}</h1>
            <div class="bb-setup-girl">${renderGirl(look)}</div>
          </div>
          <div class="bb-setup-panel">
            <h3>Hair colour</h3>
            <div class="bb-row">
              ${Object.entries(HAIR_COLORS).map(([k, c]) => `
                <button class="bb-dot ${look.hairColor === k ? 'on' : ''}" data-set="hairColor" data-v="${k}"
                  style="background:linear-gradient(135deg, ${c.light}, ${c.base} 55%, ${c.shade})" aria-label="${c.name}"></button>`).join('')}
            </div>
            <h3>Hair length</h3>
            <div class="bb-row">
              ${Object.entries(HAIR_LENGTHS).map(([k, l]) => `
                <button class="bb-len ${look.hairLength === k ? 'on' : ''}" data-set="hairLength" data-v="${k}">
                  ${renderGirl({ ...look, hairLength: k, hairStyle: 'down', cut: null }, { viewBox: '30 40 340 490', noPlaced: true })}
                  <span>${l.name}</span>
                </button>`).join('')}
            </div>
            <h3>Eye colour</h3>
            <div class="bb-row">
              ${Object.entries(EYE_COLORS).map(([k, c]) => `
                <button class="bb-dot bb-eyedot ${look.eyeColor === k ? 'on' : ''}" data-set="eyeColor" data-v="${k}" aria-label="${k}">
                  <svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="13" fill="#fff"/><circle cx="20" cy="20" r="10" fill="${c}"/><circle cx="20" cy="20" r="4.5" fill="#1f1a1a"/><circle cx="23" cy="17" r="2.6" fill="#fff"/></svg>
                </button>`).join('')}
            </div>
            <button class="bb-go">Let's go! ✨</button>
          </div>
        </div>`;
      root.querySelector('.bb-back').addEventListener('click', () => { sound.pop(); pickScreen(); });
      root.querySelectorAll('[data-set]').forEach(b => b.addEventListener('click', () => {
        sound.pop();
        store.dispatch({ type: 'set', key: b.dataset.set, value: b.dataset.v });
        draw();
      }));
      root.querySelector('.bb-go').addEventListener('click', () => {
        sound.win();
        salonScreen();
      });
    };
    draw();
  }

  // ---------- 3. The salon ----------
  function salonScreen() {
    clearScreen();
    if (!saving) { saving = true; saveToGallery(saveId, store.get()); }
    root.innerHTML = `
      <div class="bb-salon">
        <div class="bb-stage">
          <h1 class="bb-title bb-title-small">Beautiful Bells</h1>
          <div class="bb-tools">
            <button data-tool="undo" aria-label="Undo">↩️</button>
            <button data-tool="wipe" aria-label="Wipe off">🧽</button>
            <button data-tool="random" aria-label="Surprise me">🎲</button>
            <button data-tool="setup" aria-label="Hair and eyes">👧</button>
            <button data-tool="girls" aria-label="My girls">👭</button>
          </div>
          <div class="bb-doll"></div>
          <div class="bb-held" hidden>
            <div class="bb-held-pic"></div>
            <button class="bb-held-x" aria-label="Put down">✖</button>
          </div>
          <button class="bb-photo" aria-label="Save picture">📸<span>Save</span></button>
          <div class="bb-toast" hidden></div>
        </div>
        <div class="bb-panel">
          <div class="bb-tabs">
            ${TABS.map(t => `<button class="bb-tab" data-tab="${t.id}"><span class="i">${t.icon}</span><span class="l">${t.label}</span></button>`).join('')}
          </div>
          <div class="bb-items"></div>
        </div>
      </div>`;
    const doll = root.querySelector('.bb-doll');
    const itemsEl = root.querySelector('.bb-items');
    const held = root.querySelector('.bb-held');
    const toastEl = root.querySelector('.bb-toast');
    let active = null; // the brush or scissors in your hand

    const drawDoll = (look = store.get()) => { doll.innerHTML = renderGirl(look); };
    const drawItems = () => {
      const look = store.get();
      const t = TABS.find(x => x.id === tab) || TABS[0];
      const sx = itemsEl.scrollLeft, sy = itemsEl.scrollTop;
      itemsEl.innerHTML = t.groups.map(g => `
        ${g.label ? `<div class="bb-group">${g.label}</div>` : ''}
        ${g.items.map(it => `
          <button class="bb-item ${isOn(it, look) ? 'on' : ''} ${active && active.id === it.id ? 'held' : ''}" data-id="${it.id}" aria-label="${it.label}">
            <div class="bb-item-pic">${swatch(it, look)}</div>
            <span>${it.label}</span>
          </button>`).join('')}`).join('');
      itemsEl.scrollLeft = sx; itemsEl.scrollTop = sy;
      root.querySelectorAll('.bb-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    };
    const drawAll = () => { drawDoll(); drawItems(); };
    const off = store.subscribe(drawAll);
    drawAll();

    const setActive = item => {
      active = item;
      if (hover) { hover.remove(); hover = null; }
      held.hidden = !item;
      if (item) held.querySelector('.bb-held-pic').innerHTML = swatch(item, store.get());
      doll.classList.toggle('bb-has-tool', !!item);
      drawItems();
    };
    // Tapping anywhere on the "in your hand" badge puts the tool down.
    held.addEventListener('click', () => { sound.pop(); setActive(null); });

    let toastTimer = null;
    const toast = text => {
      toastEl.textContent = text;
      toastEl.hidden = false;
      toastEl.classList.remove('show'); void toastEl.offsetWidth; toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2200);
    };

    root.querySelectorAll('.bb-tab').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      tab = b.dataset.tab;
      if (active) setActive(null);
      itemsEl.scrollTop = 0; itemsEl.scrollLeft = 0;
      drawItems();
    }));

    root.querySelector('.bb-tools').addEventListener('click', e => {
      const b = e.target.closest('[data-tool]');
      if (!b) return;
      switch (b.dataset.tool) {
        case 'undo': if (store.undo()) sound.tone(500, .12, 'sine', .2, 300); else sound.bump(); break;
        case 'wipe': sound.tone(400, .3, 'sine', .15, 900); store.dispatch({ type: 'wipe' }); break;
        case 'random': sound.win(); store.dispatch({ type: 'replace', look: randomLook(store.get()) }); break;
        case 'setup': sound.pop(); setupScreen(); break;
        case 'girls': sound.pop(); pickScreen(); break;
      }
    });
    root.querySelector('.bb-photo').addEventListener('click', () => savePicture());

    // ----- helpers -----
    const svgEl = () => doll.querySelector('svg');
    const svgPoint = (x, y) => {
      const p = new DOMPoint(x, y).matrixTransform(svgEl().getScreenCTM().inverse());
      return { x: Math.round(p.x), y: Math.round(p.y) };
    };
    const clampPt = p => ({ x: Math.max(20, Math.min(380, p.x)), y: Math.max(30, Math.min(505, p.y)) });
    const overDoll = (x, y) => {
      const r = doll.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const makeGhost = (item, tool) => {
      const g = document.createElement('div');
      g.className = 'bb-ghost' + (tool ? ' bb-ghost-tool' : '');
      g.innerHTML = item ? swatch(item, store.get()) : '';
      root.appendChild(g);
      return g;
    };
    const moveGhost = (g, x, y) => {
      const r = root.getBoundingClientRect();
      g.style.transform = `translate(${x - r.left}px, ${y - r.top}px)`;
    };

    // ----- brushes and scissors -----
    function toolMove(d, x, y) {
      if (!overDoll(x, y)) return;
      const p = svgPoint(x, y);
      if (d.item.action === 'paint') {
        if (!d.stroke) {
          const a = strokeAttrs(d.item, svgEl().dataset.rainbow);
          const layer = svgEl().querySelector(`[data-strokes="${d.item.layer}"]`);
          if (!layer) return;
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', a.stroke);
          path.setAttribute('stroke-width', a.width);
          path.setAttribute('opacity', a.opacity);
          path.setAttribute('stroke-linecap', 'round');
          path.setAttribute('stroke-linejoin', 'round');
          layer.appendChild(path);
          d.stroke = { pts: [p.x, p.y], path };
          path.setAttribute('d', ptsToD(d.stroke.pts));
          d.used = true;
          return;
        }
        const pts = d.stroke.pts;
        if (Math.hypot(p.x - pts[pts.length - 2], p.y - pts[pts.length - 1]) < 3) return;
        pts.push(p.x, p.y);
        d.stroke.path.setAttribute('d', ptsToD(pts));
        const now = performance.now();
        if (!d.lastSound || now - d.lastSound > 110) { d.lastSound = now; sound.tone(260 + Math.random() * 120, .06, 'triangle', .035); }
      } else if (d.item.action === 'cut') {
        d.used = true;
        if (d.cut === undefined) d.cut = hairBottom(store.get());
        if (p.x < 50 || p.x > 350 || p.y < MIN_CUT || p.y > d.cut - 4) return;
        d.cut = p.y;
        drawDoll({ ...store.get(), cut: d.cut });
        snip(x, y);
      }
    }
    function toolEnd(d) {
      if (d.item.action === 'paint' && d.stroke) {
        store.dispatch({ type: 'paint', item: d.item.id, layer: d.item.layer, pts: d.stroke.pts });
      } else if (d.item.action === 'cut' && d.cut !== undefined && d.cut < hairBottom(store.get())) {
        store.dispatch({ type: 'set', key: 'cut', value: d.cut });
      }
    }

    // ----- drag and drop -----
    let drag = null;
    let hover = null; // ghost that follows the mouse while holding a tool
    // Stops a drag without dropping anything, and makes sure no floating picture is left behind.
    const cancelDrag = () => {
      if (drag) {
        if (drag.placedKey && drag.el) drag.el.style.opacity = '';
        if (drag.stroke) toolEnd(drag);
        drag = null;
      }
      root.querySelectorAll('.bb-ghost').forEach(g => { if (g !== hover) g.remove(); });
      doll.classList.remove('bb-over');
    };
    const onDown = e => {
      if (e.button > 0 || !e.isPrimary) return; // ignore extra fingers
      if (drag) cancelDrag(); // a lost finger-lift must never leave a picture stuck
      const itemEl = e.target.closest('.bb-item');
      const placedEl = e.target.closest('.bb-placed');
      const onDoll = e.target.closest('.bb-doll');
      if (itemEl) {
        drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moving: false, item: ITEMS[itemEl.dataset.id], el: itemEl };
      } else if (placedEl && !active) {
        e.preventDefault();
        drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moving: false, placedKey: placedEl.dataset.placed, el: placedEl };
      } else if (onDoll && active) {
        e.preventDefault();
        drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moving: true, item: active, fromDoll: true };
        drag.ghost = makeGhost(active, true);
        moveGhost(drag.ghost, e.clientX, e.clientY);
        if (hover) hover.style.display = 'none';
        toolMove(drag, e.clientX, e.clientY);
      }
    };
    const onMove = e => {
      if (!drag) {
        // Show the held tool under the mouse.
        if (active && e.pointerType === 'mouse' && overDoll(e.clientX, e.clientY)) {
          if (!hover) hover = makeGhost(active, true);
          hover.style.display = '';
          moveGhost(hover, e.clientX, e.clientY);
        } else if (hover) hover.style.display = 'none';
        return;
      }
      if (e.pointerId !== drag.id) return;
      if (!drag.moving && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 10) {
        drag.moving = true;
        let item = drag.item;
        if (drag.placedKey) {
          const p = store.get().placed.find(q => q.key === drag.placedKey);
          item = p && ITEMS[p.item];
          drag.el.style.opacity = '0';
        }
        drag.ghost = makeGhost(item, isTool(item));
        if (hover) hover.style.display = 'none';
        sound.tone(700, .06, 'sine', .12);
      }
      if (!drag.moving) return;
      e.preventDefault();
      moveGhost(drag.ghost, e.clientX, e.clientY);
      if (isTool(drag.item)) toolMove(drag, e.clientX, e.clientY);
      else doll.classList.toggle('bb-over', overDoll(e.clientX, e.clientY));
    };
    const onUp = e => {
      if (!drag || e.pointerId !== drag.id) {
        if (!drag) cancelDrag(); // tidy up any stray picture
        return;
      }
      const d = drag;
      drag = null;
      cancelDrag();
      const inside = overDoll(e.clientX, e.clientY);

      if (d.placedKey) {
        if (!d.moving) return;
        if (inside) {
          const p = clampPt(svgPoint(e.clientX, e.clientY));
          store.dispatch({ type: 'move', key: d.placedKey, x: p.x, y: p.y });
          sparkle(e.clientX, e.clientY);
        } else {
          sound.bump();
          store.dispatch({ type: 'remove', key: d.placedKey });
        }
        return;
      }
      if (!d.item) return;
      if (!d.moving) { tapItem(d.item, d.el); return; }
      if (isTool(d.item)) {
        toolEnd(d);
        if (d.used && !d.fromDoll) {
          setActive(d.item);
          toast(d.item.action === 'cut' ? 'Keep snipping! ✂️' : 'Keep painting! 🖌️');
        }
        if (!d.used && !d.fromDoll) toast(d.item.action === 'cut' ? 'Swipe the scissors across her hair ✂️' : 'Rub it on her face! 🖌️');
        return;
      }
      if (inside) applyItem(d.item, clampPt(svgPoint(e.clientX, e.clientY)), e.clientX, e.clientY);
    };
    const onCancel = e => {
      if (!drag || e.pointerId !== drag.id) return;
      cancelDrag();
    };
    const onBlur = () => { cancelDrag(); if (hover) hover.style.display = 'none'; };
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onBlur);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);

    // Tapping only hints – things go on by dragging. Tapping something she's wearing takes it off.
    function tapItem(item, el) {
      const look = store.get();
      if (isOn(item, look) && !item.required) {
        if (item.action === 'slot') store.dispatch({ type: 'set', key: item.key, value: null });
        else store.dispatch({ type: 'toggle', key: item.key, value: item.value });
        sound.tone(500, .12, 'sine', .2, 300);
        return;
      }
      if (active && active.id === item.id) { setActive(null); sound.pop(); return; }
      el.classList.remove('bb-shake'); void el.offsetWidth; el.classList.add('bb-shake');
      sound.tone(420, .08, 'sine', .12);
      toast(item.action === 'cut' ? 'Drag the scissors onto her hair! ✂️'
        : item.action === 'paint' ? 'Drag it onto her face and rub! 🖌️'
          : 'Drag it onto her! 👆');
    }

    function applyItem(item, p, sx, sy) {
      const look = store.get();
      setActive(null);
      if (item.action === 'slot') {
        if (look[item.key] === item.value) { sparkle(sx, sy); return; }
        store.dispatch({ type: 'set', key: item.key, value: item.value });
      } else if (item.action === 'toggle') {
        if (!isOn(item, look)) store.dispatch({ type: 'toggle', key: item.key, value: item.value });
      } else if (item.action === 'place') {
        let pt = p;
        if (item.kind === 'bobble') {
          // Bobbles snap onto a hair tie if one is close.
          const tie = tiePoints(look).find(([x, y]) => Math.hypot(x - p.x, y - p.y) < 40);
          if (tie) pt = { x: tie[0], y: tie[1] };
        }
        store.dispatch({ type: 'place', key: newKey(), item: item.id, x: pt.x, y: pt.y });
      } else if (item.action === 'clear') {
        store.dispatch({ type: 'clearPaint', layer: item.layer });
        sound.tone(400, .3, 'sine', .15, 900);
      } else if (item.action === 'grow') {
        if (look.cut) {
          store.dispatch({ type: 'set', key: 'cut', value: null });
          sound.win();
        }
      }
      sparkle(sx, sy);
      twinkle();
    }

    teardownSalon = () => {
      off();
      clearTimeout(toastTimer);
      if (hover) hover.remove();
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onBlur);
    };
  }

  // ---------- effects ----------
  function twinkle() {
    sound.tone(1200, .08, 'sine', .14, 1800);
    later(() => sound.tone(1600, .1, 'sine', .12, 2200), 70);
  }

  let lastSnip = 0;
  function snip(x, y) {
    const now = performance.now();
    if (now - lastSnip < 90) return;
    lastSnip = now;
    sound.tone(2200, .03, 'square', .07);
    later(() => sound.tone(1500, .03, 'square', .06), 40);
    const r = root.getBoundingClientRect();
    const col = (HAIR_COLORS[store.get().hairColor] || HAIR_COLORS.brown).base;
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.className = 'bb-hairbit';
      s.style.left = `${x - r.left + (Math.random() - .5) * 40}px`;
      s.style.top = `${y - r.top}px`;
      s.style.background = col;
      s.style.setProperty('--rot', `${Math.random() * 180}deg`);
      s.style.setProperty('--dx', `${(Math.random() - .5) * 60}px`);
      root.appendChild(s);
      later(() => s.remove(), 1200);
    }
  }

  function sparkle(x, y) {
    const r = root.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.className = 'bb-spark';
      s.textContent = ['✨', '💖', '⭐', '✨'][i % 4];
      const a = (i / 7) * Math.PI * 2;
      s.style.left = `${x - r.left}px`;
      s.style.top = `${y - r.top}px`;
      s.style.setProperty('--dx', `${Math.cos(a) * 60}px`);
      s.style.setProperty('--dy', `${Math.sin(a) * 60}px`);
      root.appendChild(s);
      later(() => s.remove(), 800);
    }
  }

  function celebrate(name) {
    const flash = document.createElement('div');
    flash.className = 'bb-flash';
    root.appendChild(flash);
    later(() => flash.remove(), 600);
    sound.tone(1800, .05, 'square', .1);
    later(() => sound.win(), 250);
    const banner = document.createElement('div');
    banner.className = 'bb-banner';
    banner.textContent = `${name} looks beautiful! 💖`;
    root.appendChild(banner);
    later(() => banner.remove(), 3000);
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('span');
      s.className = 'bb-confetti';
      s.textContent = ['💖', '✨', '⭐', '🌸', '💜', '🎀'][i % 6];
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * .8}s`;
      s.style.animationDuration = `${2 + Math.random() * 1.2}s`;
      root.appendChild(s);
      later(() => s.remove(), 3500);
    }
  }

  // Draws the girl onto a canvas and downloads it as a PNG.
  function savePicture() {
    const look = store.get();
    saveToGallery(saveId, look);
    celebrate(look.name);
    const W = 800, H = 1100;
    const svg = renderGirl(look).replace('<svg ', `<svg width="${W}" height="${W * 520 / 400}" `);
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const g = cv.getContext('2d');
      const bg = g.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#ffd6ec'); bg.addColorStop(1, '#e3d2ff');
      g.fillStyle = bg;
      g.fillRect(0, 0, W, H);
      g.font = '40px sans-serif';
      g.textAlign = 'center';
      for (let i = 0; i < 18; i++) {
        g.globalAlpha = .5;
        g.fillText(['💖', '✨', '⭐', '🌸'][i % 4], (i * 137) % W, 60 + ((i * 251) % (H - 120)));
      }
      g.globalAlpha = 1;
      g.drawImage(img, 0, 120, W, W * 520 / 400);
      g.font = '700 64px Fredoka, system-ui, sans-serif';
      g.lineWidth = 10; g.strokeStyle = '#fff'; g.fillStyle = '#d63384';
      g.strokeText(`${look.name} ✨`, W / 2, 90);
      g.fillText(`${look.name} ✨`, W / 2, 90);
      g.font = '500 30px Fredoka, system-ui, sans-serif';
      g.fillStyle = '#7b4bb7';
      g.fillText('Beautiful Bells', W / 2, H - 20);
      cv.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `beautiful-bells-${look.name.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        later(() => URL.revokeObjectURL(a.href), 5000);
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  pickScreen();

  return () => {
    clearScreen();
    if (unsub) unsub();
    clearTimeout(saveTimer);
    if (saving && store) saveToGallery(saveId, store.get());
    timers.forEach(clearTimeout);
    root.remove();
    css.remove();
  };
}

function isOn(it, look) {
  if (it.action === 'slot') return look[it.key] === it.value;
  if (it.action === 'toggle') {
    const v = look[it.key];
    return Array.isArray(v) ? v.includes(it.value) : !!v;
  }
  return false;
}

function randomLook(look) {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const group = (tabId, label) => {
    const t = TABS.find(x => x.id === tabId);
    return (label ? t.groups.find(g => g.label === label) : t.groups[0]).items;
  };
  const maybe = (items, chance) => Math.random() < chance ? pick(items).value : null;
  const paintItems = layer => group(layer).filter(i => i.action === 'paint');
  const paint = [];
  for (const [layer, chance] of [['lips', .9], ['shadow', .8], ['blush', .85]]) {
    if (Math.random() < chance) paint.push(...presetStrokes(layer, pick(paintItems(layer)).id));
  }
  const out = {
    ...look,
    hairStyle: pick(group('hair', 'Hairstyles')).value,
    cut: null,
    topStyle: pick(group('top', 'Styles')).value,
    topColor: pick(group('top', 'Colours')).value,
    topPattern: Math.random() < .4 ? pick(group('top', 'Patterns')).value : 'plain',
    mascara: maybe(group('lashes', 'Mascara'), .8),
    eyeliner: maybe(group('lashes', 'Eyeliner'), .3),
    earrings: maybe(group('earrings'), .85),
    necklace: maybe(group('necklace'), .7),
    headwear: maybe(group('hairbits', 'Headbands'), .4),
    glasses: maybe(group('glasses'), .15),
    extensions: Math.random() < .3 ? [pick(group('hairbits', 'Extensions')).value] : [],
    freckles: Math.random() < .2,
    paint,
    placed: [],
  };
  if (Math.random() < .6) {
    const bits = [...group('hairbits', 'Bows'), ...group('hairbits', 'Clips'), ...group('hairbits', 'Flowers')];
    const [x, y] = pick(HAIR_SPOTS);
    out.placed.push({ key: newKey(), item: pick(bits).id, x, y });
  }
  return out;
}
