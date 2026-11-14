// Beautiful Bells – a makeover game.
// Screens: pick a girl → choose hair colour / length / eyes → salon (drag things on).
// Every girl you make is saved in this browser (last 20) so you can carry on later.
import { sound } from '../../js/engine/sound.js';
import { GIRLS, TABS, ITEMS, HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS } from './items.js';
import { renderGirl, swatch, drawThing, tiePoints } from './draw.js';
import { createStore, newLook, newKey } from './look.js';
import { loadGallery, saveToGallery, removeFromGallery } from './gallery.js';

const HAIR_SPOTS = [[132, 128], [268, 128], [160, 104], [240, 104], [118, 172], [282, 172], [200, 96]];
const FACE_SPOTS = [[142, 262], [258, 262], [124, 236], [276, 236], [200, 312]];

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
  let tab = 'lipstick';
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
              <div class="bb-card-pic">${renderGirl(newLook(g), { viewBox: '30 20 340 440' })}</div>
              <span>${g.name}</span>
            </button>`).join('')}
        </div>
        ${saved.length ? `
          <h2 class="bb-sub">💖 My girls</h2>
          <div class="bb-girls bb-saved">
            ${saved.map(s => `
              <div class="bb-card-wrap">
                <button class="bb-card" data-saved="${s.id}">
                  <div class="bb-card-pic">${renderGirl(s.look, { viewBox: '20 20 360 460' })}</div>
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
      const s = loadGallery().find(x => x.id === b.dataset.saved);
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
                  ${renderGirl({ ...look, hairLength: k, hairStyle: 'down' }, { viewBox: '30 40 340 490', noPlaced: true })}
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
          <button class="bb-photo" aria-label="Save picture">📸<span>Save</span></button>
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

    const drawDoll = () => { doll.innerHTML = renderGirl(store.get()); };
    const drawItems = () => {
      const look = store.get();
      const t = TABS.find(x => x.id === tab) || TABS[0];
      const sx = itemsEl.scrollLeft, sy = itemsEl.scrollTop;
      itemsEl.innerHTML = t.groups.map(g => `
        ${g.label ? `<div class="bb-group">${g.label}</div>` : ''}
        ${g.items.map(it => `
          <button class="bb-item ${isOn(it, look) ? 'on' : ''}" data-id="${it.id}" aria-label="${it.label}">
            <div class="bb-item-pic">${swatch(it, look)}</div>
            <span>${it.label}</span>
          </button>`).join('')}`).join('');
      itemsEl.scrollLeft = sx; itemsEl.scrollTop = sy;
      root.querySelectorAll('.bb-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    };
    const drawAll = () => { drawDoll(); drawItems(); };
    const off = store.subscribe(drawAll);
    drawAll();

    root.querySelectorAll('.bb-tab').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      tab = b.dataset.tab;
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

    // ----- drag and drop (tap works too) -----
    let drag = null;
    const svgPoint = (x, y) => {
      const svg = doll.querySelector('svg');
      const p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM().inverse());
      return { x: Math.max(20, Math.min(380, p.x)), y: Math.max(30, Math.min(505, p.y)) };
    };
    const overDoll = (x, y) => {
      const r = doll.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const onDown = e => {
      if (e.button > 0) return;
      const itemEl = e.target.closest('.bb-item');
      const placedEl = e.target.closest('.bb-placed');
      if (!itemEl && !placedEl) return;
      if (placedEl) e.preventDefault();
      drag = {
        id: e.pointerId, x0: e.clientX, y0: e.clientY, moving: false, ghost: null,
        item: itemEl ? ITEMS[itemEl.dataset.id] : null,
        placedKey: placedEl ? placedEl.dataset.placed : null,
        el: itemEl || placedEl,
      };
    };
    const onMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moving && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 10) {
        drag.moving = true;
        let item = drag.item;
        if (drag.placedKey) {
          const p = store.get().placed.find(q => q.key === drag.placedKey);
          item = p && ITEMS[p.item];
          drag.el.style.opacity = '0';
        }
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'bb-ghost';
        drag.ghost.innerHTML = item ? swatch(item, store.get()) : '';
        root.appendChild(drag.ghost);
        sound.tone(700, .06, 'sine', .12);
      }
      if (drag.moving) {
        e.preventDefault();
        const r = root.getBoundingClientRect();
        drag.ghost.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
        doll.classList.toggle('bb-over', overDoll(e.clientX, e.clientY));
      }
    };
    const onUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      if (d.ghost) d.ghost.remove();
      doll.classList.remove('bb-over');
      const inside = overDoll(e.clientX, e.clientY);
      if (d.placedKey) {
        if (!d.moving) return;
        if (inside) {
          const p = svgPoint(e.clientX, e.clientY);
          store.dispatch({ type: 'move', key: d.placedKey, x: p.x, y: p.y });
          sparkle(e.clientX, e.clientY);
        } else {
          sound.bump();
          store.dispatch({ type: 'remove', key: d.placedKey });
        }
        return;
      }
      if (!d.item) return;
      if (!d.moving) applyItem(d.item, null, e.clientX, e.clientY);
      else if (inside) applyItem(d.item, svgPoint(e.clientX, e.clientY), e.clientX, e.clientY);
    };
    const onCancel = e => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.ghost) drag.ghost.remove();
      if (drag.placedKey) drag.el.style.opacity = '';
      doll.classList.remove('bb-over');
      drag = null;
    };
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);

    function applyItem(item, pt, sx, sy) {
      const look = store.get();
      if (item.action === 'slot') {
        const cur = look[item.key];
        const v = cur === item.value && !item.required ? null : item.value;
        if (v === cur) { sparkleOnDoll(); return; }
        store.dispatch({ type: 'set', key: item.key, value: v });
        if (v === null) { sound.tone(500, .12, 'sine', .2, 300); return; }
      } else if (item.action === 'toggle') {
        const wasOn = isOn(item, look);
        store.dispatch({ type: 'toggle', key: item.key, value: item.value });
        if (wasOn) { sound.tone(500, .12, 'sine', .2, 300); return; }
      } else if (item.action === 'place') {
        let p = pt;
        if (!p) {
          const inZone = look.placed.filter(q => ITEMS[q.item]?.zone === item.zone).length;
          let spots = item.zone === 'hair' ? HAIR_SPOTS : FACE_SPOTS;
          if (item.kind === 'bobble') {
            const ties = tiePoints(look);
            if (ties.length) spots = ties;
          }
          const [x, y] = spots[inZone % spots.length];
          p = { x, y };
        }
        store.dispatch({ type: 'place', key: newKey(), item: item.id, x: p.x, y: p.y });
        if (!pt) { sparkleAtSvg(p); twinkle(); return; }
      }
      if (pt) sparkle(sx, sy); else sparkleOnDoll();
      twinkle();
    }

    const sparkleOnDoll = () => {
      const r = doll.getBoundingClientRect();
      sparkle(r.left + r.width / 2, r.top + r.height * .45);
    };
    const sparkleAtSvg = p => {
      const svg = doll.querySelector('svg');
      const s = new DOMPoint(p.x, p.y).matrixTransform(svg.getScreenCTM());
      sparkle(s.x, s.y);
    };

    teardownSalon = () => {
      off();
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }

  // ---------- effects ----------
  function twinkle() {
    sound.tone(1200, .08, 'sine', .14, 1800);
    later(() => sound.tone(1600, .1, 'sine', .12, 2200), 70);
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
  const fromTab = (id, chance = .85) => {
    const items = TABS.find(t => t.id === id).groups.flatMap(g => g.items);
    return Math.random() < chance ? pick(items).value : null;
  };
  const hairbits = TABS.find(t => t.id === 'hairbits').groups;
  const heads = hairbits.find(g => g.label === 'Headbands').items;
  const exts = hairbits.find(g => g.label === 'Extensions').items;
  const out = {
    ...look,
    hairStyle: fromTab('hairStyle', 1),
    top: fromTab('top', 1),
    lipstick: fromTab('lipstick'),
    eyeshadow: fromTab('eyeshadow'),
    mascara: fromTab('mascara'),
    blush: fromTab('blush'),
    earrings: fromTab('earrings'),
    necklace: fromTab('necklace', .7),
    headwear: Math.random() < .4 ? pick(heads).value : null,
    extensions: Math.random() < .3 ? [pick(exts).value] : [],
    freckles: Math.random() < .2,
    placed: [],
  };
  if (Math.random() < .6) {
    const bits = [...hairbits[0].items, ...hairbits[1].items];
    const [x, y] = pick(HAIR_SPOTS);
    out.placed.push({ key: newKey(), item: pick(bits).id, x, y });
  }
  return out;
}
