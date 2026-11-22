// Axie Pals – look after your own axolotl.
// Feed it, scoop the poo, scrub the tank, lights off for sleep, medicine when poorly,
// tickle it, play bubble pop for coins, buy things, dress up, birthdays with presents, photo album.
// Real time (gentle): needs go down while the game is closed, never below sulky. Saved on this device.
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound } from '../../js/engine/sound.js';
import { LEVELS, COLOURS, NAMES, FOODS, ITEMS, SHOP, stageOf } from './items.js';
import {
  newPet, loadPet, savePet, forgetPet, catchUp, update as tickPet, addPoo, clamp,
  mood, sulky, nightNow, nextBirthday, birthdayProgress, isGrowing, giftFor,
} from './pet.js';
import { hostPlaydate, joinPlaydate, connect as connectPlaydate } from './playdate.js';
import { takeJoinCode } from '../../js/engine/together.js';
import { createRoom } from '../../js/engine/net.js';
import { drawTank, drawGlass, drawShadow, drawAlgae, drawNight, drawEmoji, drawPoo, drawBubble, drawEgg, drawAxolotl, drawSay, drawCake } from './draw.js';

const rand = (a, b) => a + Math.random() * (b - a);
const esc = s => String(s).replace(/[&<>"']/g, '');
const cleanName = n => String(n || '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 12);
const BAR_H = 104;

// ---------- Sounds ----------
const sfx = {
  munch: () => [0, 110, 220].forEach(t => setTimeout(() => sound.tone(rand(180, 240), 0.07, 'square', 0.08, 120), t)),
  plop: () => { sound.tone(500, 0.12, 'sine', 0.2, 140); setTimeout(() => sound.noise(0.15, 600, 0.15), 60); },
  giggle: () => [0, 90, 180, 270].forEach((t, i) => setTimeout(() => sound.tone(900 + i * 80 + rand(-40, 40), 0.08, 'triangle', 0.12, 1300), t)),
  scrub: () => sound.noise(0.12, 3000, 0.08),
  bubble: () => sound.tone(rand(500, 800), 0.1, 'sine', 0.15, 1400),
  coin: () => { sound.tone(1320, 0.08, 'square', 0.07); setTimeout(() => sound.tone(1760, 0.12, 'square', 0.07), 70); },
  snore: () => sound.tone(110, 0.6, 'sawtooth', 0.04, 70),
  no: () => { sound.tone(300, 0.12, 'square', 0.08); setTimeout(() => sound.tone(220, 0.15, 'square', 0.08), 130); },
  yuck: () => sound.tone(260, 0.4, 'sawtooth', 0.08, 120),
  heal: () => [523, 784, 1047].forEach((f, i) => setTimeout(() => sound.tone(f, 0.15, 'triangle', 0.15), i * 90)),
  click: () => sound.tone(700, 0.05, 'square', 0.08),
  birthday() { // Happy birthday tune
    const n = [[392, 1], [392, 1], [440, 2], [392, 2], [523, 2], [494, 4], [392, 1], [392, 1], [440, 2], [392, 2], [587, 2], [523, 4]];
    let t = 0;
    for (const [f, d] of n) { setTimeout(() => sound.tone(f, d * 0.16, 'triangle', 0.14), t); t += d * 170; }
  },
};

const CSS = `
.axie { position:absolute; inset:0; overflow:hidden; user-select:none; -webkit-user-select:none; }
.axie-hud { position:absolute; top:14px; left:84px; right:14px; display:flex; gap:8px; align-items:flex-start; justify-content:space-between; pointer-events:none; z-index:5; }
.axie-hud > * { pointer-events:auto; }
.axie-chip { display:flex; align-items:center; gap:6px; height:44px; padding:0 14px; border-radius:16px; background:rgba(16,18,38,.6); color:#fff; font-weight:800; font-size:17px; -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.18); white-space:nowrap; }
.axie-chip button { all:unset; cursor:pointer; font-size:22px; }
.axie-needs { display:flex; gap:6px; flex-wrap:wrap; justify-content:center; flex:1; }
.axie-need { width:60px; height:44px; border-radius:14px; background:rgba(16,18,38,.6); border:1px solid rgba(255,255,255,.18); position:relative; overflow:hidden; display:grid; place-items:center; font-size:22px; -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
.axie-need i { position:absolute; left:0; bottom:0; height:6px; background:#4ade80; transition:width .4s, background .4s; }
.axie-need.low { animation: axie-pulse 1s infinite; }
@keyframes axie-pulse { 50% { transform:scale(1.08); } }
.axie-right { display:flex; gap:8px; }
.axie-bar { position:absolute; left:50%; bottom:12px; transform:translateX(-50%); display:flex; gap:8px; padding:8px; border-radius:26px; background:rgba(16,18,38,.62); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.18); z-index:6; max-width:calc(100% - 24px); overflow-x:auto; }
.axie-bar button, .axie-tray button { all:unset; cursor:pointer; width:64px; height:64px; border-radius:20px; display:grid; place-items:center; font-size:34px; background:rgba(255,255,255,.1); transition:transform .1s, background .2s; flex:none; position:relative; }
.axie-bar button:active, .axie-tray button:active { transform:scale(.9); }
.axie-bar button.on { background:var(--accent); }
.axie-bar button.hot { animation: axie-pulse .8s infinite; background:#ef4444; }
.axie-bar button[hidden] { display:none; }
.axie-tray { position:absolute; left:50%; bottom:${BAR_H + 4}px; transform:translateX(-50%); display:flex; gap:8px; padding:8px; border-radius:22px; background:rgba(255,255,255,.9); z-index:6; animation: ui-in .2s both; }
.axie-tray button { background:rgba(0,0,0,.06); }
.axie-hint { position:absolute; left:50%; top:76px; transform:translateX(-50%); padding:10px 18px; border-radius:18px; background:rgba(255,255,255,.92); color:#15172e; font-weight:800; font-size:20px; z-index:6; pointer-events:none; white-space:nowrap; animation: ui-in .25s both; }
.axie-toast { position:absolute; left:50%; top:40%; transform:translate(-50%,-50%); padding:16px 26px; border-radius:24px; background:rgba(255,255,255,.95); color:#15172e; font-weight:900; font-size:28px; z-index:8; pointer-events:none; text-align:center; animation: ui-in .3s both; }
.axie-grid { width:100%; display:grid; grid-template-columns:repeat(auto-fill, minmax(84px,1fr)); gap:10px; }
.axie-item { all:unset; cursor:pointer; position:relative; height:84px; border-radius:18px; background:var(--ui-card); display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:38px; border:2px solid transparent; }
.axie-item small { font-size:14px; font-weight:800; color:var(--ui-dim); }
.axie-item.on { border-color:var(--accent); background:rgba(255,255,255,.16); }
.axie-item.on::after { content:'✔'; position:absolute; top:4px; right:8px; font-size:16px; color:var(--accent); }
.axie-item.poor { opacity:.45; }
.axie-swatch { width:56px; height:56px; border-radius:50%; margin:auto; border:4px solid rgba(255,255,255,.7); }
.axie-name { width:100%; height:58px; border-radius:18px; border:2px solid var(--ui-line); background:rgba(255,255,255,.95); color:#15172e; font-size:28px; font-weight:900; text-align:center; }
.axie-photos { width:100%; display:grid; grid-template-columns:repeat(auto-fill, minmax(130px,1fr)); gap:10px; }
.axie-photos figure { margin:0; border-radius:16px; overflow:hidden; background:#000; position:relative; cursor:pointer; }
.axie-photos img { width:100%; display:block; }
.axie-photos figcaption { position:absolute; left:6px; bottom:6px; padding:2px 8px; border-radius:10px; background:rgba(0,0,0,.55); color:#fff; font-weight:800; font-size:14px; }
.axie-big { width:100%; border-radius:20px; display:block; }
.axie-big { width:100%; }
@media (max-width: 640px) {
  .axie-hud { flex-wrap:wrap; left:80px; }
  .axie-hint { top:128px; }
  .axie-needs { order:3; flex:1 1 100%; flex-wrap:nowrap; }
  .axie-need { width:auto; flex:1; height:38px; font-size:19px; }
  .axie-chip { height:40px; padding:0 10px; font-size:15px; }
  .axie-bar { gap:5px; padding:6px; border-radius:22px; }
  .axie-bar button, .axie-tray button { width:46px; height:50px; font-size:26px; border-radius:15px; }
}
.axie-party { position:absolute; left:50%; top:16%; transform:translateX(-50%); text-align:center; color:#fff; font-weight:900; font-size:clamp(26px,5vw,44px); text-shadow:0 3px 0 rgba(0,0,0,.25), 0 0 20px rgba(0,0,0,.3); z-index:7; pointer-events:none; white-space:nowrap; }
.axie-party small { display:block; font-size:.55em; }
`;

export function mount(stage, info) {
  if (!document.getElementById('axie-css')) {
    const st = document.createElement('style');
    st.id = 'axie-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  const root = document.createElement('div');
  root.className = 'axie';
  stage.appendChild(root);
  const view = createCanvas(root);
  const ctx = view.ctx;
  const ui = document.createElement('div');
  root.appendChild(ui);

  let pet = loadPet();
  let screen = 'setup';      // setup | egg | tank
  let t = 0;
  let W = 0, H = 0, TOP = 60, FLOOR = 0, S = 1;

  // Session things (not saved)
  const ax = { x: 0, y: 0, vx: 0, vy: 0, dir: 1, tx: null, ty: null, idle: 1, blink: 0, faceId: null, faceUntil: 0, shake: 0 };
  let foods = [], bubbles = [], parts = [], scoops = [];
  let ball = null, friends = {}, flt = {};
  let say = null, sayNext = 4;
  let mode = null;             // null | 'clean'
  let dark = 0;                // 0 lights on .. 1 off (animated)
  let pooTimer = 0, snoreT = 0, saveT = 0;
  let drag = null;             // { kind: 'pet'|'clean'|'item', ... }
  let party = null;            // birthday
  let game = null;             // bubble pop mini game
  let egg = null;
  let panelOpen = false;
  // Playdate (friends' axolotls in the tank)
  let pd = null, pdStarting = false, foodN = 0, tankT = 0, lastTank = '';
  const mates = new Map();   // pid -> { x, y, dir, face, pet, who, face, seen, photo }

  const colOf = () => COLOURS.find(c => c.id === pet?.colour) || COLOURS[0];
  const save = () => { if (pet && screen === 'tank') savePet(pet); };
  const setFace = (id, secs) => { ax.faceId = id; ax.faceUntil = t + secs; };
  const sayIt = (icon, secs = 2.2) => { say = { icon, until: t + secs, born: t }; };
  const pop = (icon, x, y, n = 1, big = 30) => {
    for (let i = 0; i < n; i++) parts.push({ icon, x: x + rand(-20, 20), y: y + rand(-10, 10), vx: rand(-30, 30), vy: rand(-90, -50), life: 1.4, size: big });
  };
  const addCoins = (n, x, y) => {
    pet.coins += n;
    sfx.coin();
    pop('🪙', x ?? ax.x, y ?? ax.y - 40, Math.min(n, 4), 26);
    refreshHud();
  };

  // ---------- Layout ----------
  function layout() {
    W = view.width; H = view.height;
    TOP = W <= 640 ? 116 : 76;
    FLOOR = H - BAR_H - 34;
    const base = clamp(Math.min(W, H) / 680, 0.55, 1.25);
    S = base * (pet ? stageOf(pet.age).scale : 0.7);
  }
  const swimBox = () => ({ x0: 150 * S, x1: W - 110 * S, y0: TOP + 130, y1: FLOOR - 34 * S });

  // ---------- HUD + toolbar (HTML) ----------
  let hud, needsEl, nameChip, coinChip, bar, trayEl, hintEl, toastEl, partyEl;
  function buildTankUI() {
    ui.innerHTML = `
      <div class="axie-hud">
        <div class="axie-chip" data-name></div>
        <div class="axie-needs">
          <div class="axie-need" data-k="food">🍤<i></i></div>
          <div class="axie-need" data-k="clean">🧽<i></i></div>
          <div class="axie-need" data-k="fun">⚽<i></i></div>
          <div class="axie-need" data-k="energy">💤<i></i></div>
        </div>
        <div class="axie-right">
          <div class="axie-chip" data-pd hidden></div>
          <div class="axie-chip" data-coins></div>
          <div class="axie-chip"><button data-act="settings" aria-label="Settings">⚙️</button></div>
        </div>
      </div>
      <div class="axie-bar">
        <button data-act="feed" aria-label="Feed">🍤</button>
        <button data-act="clean" aria-label="Clean">🧽</button>
        <button data-act="lights" aria-label="Lights">💡</button>
        <button data-act="medicine" aria-label="Medicine" hidden>💊</button>
        <button data-act="play" aria-label="Play">🎮</button>
        <button data-act="friends" aria-label="Playdate">👫</button>
        <button data-act="things" aria-label="Things">🎁</button>
        <button data-act="photo" aria-label="Photos">📸</button>
      </div>`;
    hud = ui.querySelector('.axie-hud');
    needsEl = [...ui.querySelectorAll('.axie-need')];
    nameChip = ui.querySelector('[data-name]');
    coinChip = ui.querySelector('[data-coins]');
    bar = ui.querySelector('.axie-bar');
    ui.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); act(b.dataset.act); }));
    refreshHud();
  }

  function refreshHud() {
    if (!hud || !pet) return;
    for (const el of needsEl) {
      const v = pet[el.dataset.k];
      const i = el.querySelector('i');
      i.style.width = v + '%';
      i.style.background = v < 30 ? '#ef4444' : v < 55 ? '#fbbf24' : '#4ade80';
      el.classList.toggle('low', v < 25);
    }
    const st = stageOf(pet.age);
    nameChip.innerHTML = `${esc(pet.name)} <span title="${st.name}">${st.icon}</span> 🎂${pet.age}`;
    coinChip.textContent = `🪙 ${pet.coins}`;
    const med = bar.querySelector('[data-act=medicine]');
    med.hidden = !pet.sick;
    med.classList.toggle('hot', pet.sick);
    bar.querySelector('[data-act=lights]').textContent = pet.lights ? '💡' : '🌙';
    bar.querySelector('[data-act=clean]').classList.toggle('on', mode === 'clean');
    bar.querySelector('[data-act=friends]').classList.toggle('on', !!pd);
    const pc = ui.querySelector('[data-pd]');
    if (pc) {
      pc.hidden = !pd;
      if (pd) pc.textContent = pd.isHost ? `👫 ${mates.size || '…'}` : `🏠 ${pd.hostName()}`;
    }
  }

  function hint(text, secs = 2.5) {
    hintEl?.remove();
    if (!text) return;
    hintEl = document.createElement('div');
    hintEl.className = 'axie-hint';
    hintEl.textContent = text;
    ui.appendChild(hintEl);
    const me = hintEl;
    if (secs) setTimeout(() => { if (hintEl === me) { me.remove(); hintEl = null; } }, secs * 1000);
  }
  function toast(html, secs = 2.6) {
    toastEl?.remove();
    toastEl = document.createElement('div');
    toastEl.className = 'axie-toast';
    toastEl.innerHTML = html;
    ui.appendChild(toastEl);
    const me = toastEl;
    setTimeout(() => { me.remove(); if (toastEl === me) toastEl = null; }, secs * 1000);
  }
  function closeTray() { trayEl?.remove(); trayEl = null; }

  // ---------- Toolbar actions ----------
  function act(a) {
    if (party || game) return;
    sfx.click();
    if (a !== 'feed') closeTray();
    if (a !== 'clean' && mode === 'clean') { mode = null; hint(''); }
    if (a === 'feed') {
      if (trayEl) { closeTray(); return; }
      trayEl = document.createElement('div');
      trayEl.className = 'axie-tray';
      trayEl.innerHTML = FOODS.map(f => `<button data-f="${f.id}">${f.icon}</button>`).join('');
      trayEl.querySelectorAll('button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); dropFood(FOODS.find(f => f.id === b.dataset.f)); }));
      ui.appendChild(trayEl);
    } else if (a === 'clean') {
      mode = mode === 'clean' ? null : 'clean';
      if (mode) hint('🧽 Rub the glass! Tap the 💩', 3);
      else hint('');
    } else if (a === 'lights') {
      pet.lights = !pet.lights;
      pet.asleep = !pet.lights;
      if (pet.asleep) { ax.tx = null; sayIt('💤'); }
      else if (pet.energy < 40) { setFace('sleepy', 2); sayIt('🥱'); }
      else setFace('wow', 1);
      sound.tone(pet.lights ? 900 : 400, 0.08, 'square', 0.08);
    } else if (a === 'medicine') {
      giveMedicine();
    } else if (a === 'play') {
      if (pet.asleep) { sayIt('😴'); hint('Turn the light on first 💡'); return; }
      if (pet.sick) { sayIt('🤢'); hint('Give medicine first 💊'); return; }
      startGame();
    } else if (a === 'things') openThings('mine');
    else if (a === 'photo') openAlbum();
    else if (a === 'settings') openSettings();
    else if (a === 'friends') pd ? openPlaydate() : startPlaydate();
    refreshHud();
  }

  // ---------- Food ----------
  function dropFood(f) {
    if (pet.asleep) { sayIt('😴'); hint('Shh! Sleeping 💤'); return; }
    if (pet.food >= 95) { setFace('sad', 1); ax.shake = 0.8; sayIt('🙅'); sfx.no(); return; }
    const box = swimBox();
    const x = clamp(ax.x + ax.dir * rand(60, 160) * S, box.x0, box.x1);
    const id = (pd ? pd.uid.slice(0, 6) : 'me') + '-' + (++foodN);
    foods.push({ f, x, y: TOP - 10, vy: 30, age: 0, id });
    pd?.send({ k: 'food', f: f.id, id, fx: x / W });
    sound.tone(700, 0.08, 'sine', 0.12, 400);
    setFace('wow', 0.8);
  }

  function eat(food) {
    const f = food.f;
    pd?.send({ k: 'ate', id: food.id });
    pet.food = clamp(pet.food + f.food);
    pet.fun = clamp(pet.fun + f.fun);
    setFace('eat', 1.1);
    sfx.munch();
    pop(f.treat ? '😋' : '✨', ax.x + 30 * S * ax.dir, ax.y - 20 * S);
    pet.tummy += 1;
    if (!pooTimer) pooTimer = rand(25, 50);
    if (f.treat) {
      pet.treats += 1;
      if (pet.treats >= 3 && !pet.sick) {
        setTimeout(() => {
          if (!pet || pet.sick) return;
          pet.sick = true; setFace('sick', 2); sayIt('🤢', 3); sfx.yuck(); hint('Too many cakes! Tummy ache 💊'); refreshHud();
        }, 1500);
      }
    }
    if (Math.random() < 0.5) addCoins(1);
    refreshHud();
  }

  function giveMedicine() {
    parts.push({ icon: '🥄', x: ax.x + 30 * S * ax.dir, y: ax.y - 60 * S, vx: 0, vy: 0, life: 1.4, size: 40, still: true });
    setFace('yuck', 1.6);
    sfx.yuck();
    setTimeout(() => {
      if (!pet) return;
      pet.sick = false; pet.treats = 0;
      pet.fun = clamp(pet.fun + 10);
      setFace('joy', 2);
      sfx.heal();
      pop('✨', ax.x, ax.y - 30 * S, 6);
      refreshHud();
    }, 1600);
  }

  // ---------- Things (my things / shop / dress up) ----------
  const isOn = id => {
    const it = ITEMS[id];
    if (it.kind === 'wear') return pet.wear[it.slot] === id;
    return !!pet.placed[id];
  };
  function toggleThing(id) {
    setTimeout(() => pd?.updateInfo(), 0);
    const it = ITEMS[id];
    if (it.kind === 'wear') {
      pet.wear[it.slot] = pet.wear[it.slot] === id ? undefined : id;
      if (pet.wear[it.slot]) { setFace('giggle', 1.2); sfx.giggle(); }
    } else if (pet.placed[id]) {
      delete pet.placed[id];
      delete friends[id]; delete flt[id];
      if (id === 'ball') ball = null;
    } else {
      pet.placed[id] = { fx: rand(0.15, 0.85), fy: 0.5 };
      if (id === 'ball') ball = null;
    }
    save();
  }

  function overlay(html, wide = true) {
    closeTray();
    panelOpen = true;
    const ov = document.createElement('div');
    ov.className = 'ui-overlay';
    ov.innerHTML = `<div class="ui-panel ${wide ? 'wide' : ''}">${html}</div>`;
    ui.appendChild(ov);
    ov.addEventListener('pointerdown', e => { if (e.target === ov) close(); });
    function close() { ov.remove(); panelOpen = false; refreshHud(); }
    ov.close = close;
    ov.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => { sfx.click(); close(); }));
    return ov;
  }

  function openThings(tab) {
    const mine = pet.owned.slice();
    const tabs = `<div class="ui-seg"><button data-tab="mine" class="${tab === 'mine' ? 'on' : ''}">🧸 Mine</button><button data-tab="shop" class="${tab === 'shop' ? 'on' : ''}">🛒 Shop</button></div>`;
    let body;
    if (tab === 'mine') {
      body = mine.length
        ? `<div class="axie-grid">${mine.map(id => `<button class="axie-item ${isOn(id) ? 'on' : ''}" data-id="${id}">${ITEMS[id].icon}</button>`).join('')}</div>
           <div class="ui-sub">Tap to put in or take out. 🎩 = wear it!</div>`
        : `<div class="ui-sub">Nothing yet. Presents come on birthdays 🎂 or buy things in the 🛒 Shop.</div>`;
    } else {
      body = `<div class="axie-grid">${SHOP.filter(s => !pet.owned.includes(s.id)).map(s => `<button class="axie-item ${pet.coins < s.price ? 'poor' : ''}" data-buy="${s.id}">${ITEMS[s.id].icon}<small>🪙 ${s.price}</small></button>`).join('') || '<div class="ui-sub">You have everything! 🎉</div>'}</div>
        <div class="ui-sub">Earn 🪙 by looking after ${esc(pet.name)} and playing 🎮</div>`;
    }
    const ov = overlay(`
      <div class="ui-title">🎁 Things</div>
      ${tabs}
      <div class="ui-chip">🪙 ${pet.coins}</div>
      ${body}
      <div class="ui-row"><button class="ui-btn primary" data-close>Done</button></div>`);
    ov.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { sfx.click(); ov.close(); openThings(b.dataset.tab); }));
    ov.querySelectorAll('[data-id]').forEach(b => b.addEventListener('click', () => {
      sfx.click(); toggleThing(b.dataset.id); b.classList.toggle('on', isOn(b.dataset.id));
    }));
    ov.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => {
      const s = SHOP.find(x => x.id === b.dataset.buy);
      if (pet.coins < s.price) { sfx.no(); b.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 250); return; }
      pet.coins -= s.price;
      pet.owned.push(s.id);
      toggleThing(s.id);
      sfx.coin(); sound.win();
      ov.close();
      toast(`${ITEMS[s.id].icon}<br>Yours!`);
    }));
  }

  // ---------- Photos ----------
  function snap() {
    const dpr = view.canvas.width / W;
    const w = Math.min(W, 420 * Math.max(S, 0.8)), h = w * 0.75;
    const sx = clamp(ax.x - w * 0.45, 0, W - w), sy = clamp(ax.y - h * 0.55, 0, H - h);
    const c = document.createElement('canvas');
    c.width = 280; c.height = 210;
    c.getContext('2d').drawImage(view.canvas, sx * dpr, sy * dpr, w * dpr, h * dpr, 0, 0, 280, 210);
    try {
      pet.photos.push({ at: Date.now(), age: pet.age, img: c.toDataURL('image/jpeg', 0.72) });
      if (pet.photos.length > 24) pet.photos.shift();
    } catch (e) { /* canvas blocked */ }
    // flash
    const fl = document.createElement('div');
    fl.style.cssText = 'position:absolute;inset:0;background:#fff;z-index:9;pointer-events:none;transition:opacity .5s';
    ui.appendChild(fl);
    requestAnimationFrame(() => { fl.style.opacity = '0'; });
    setTimeout(() => fl.remove(), 600);
    sound.tone(1800, 0.05, 'square', 0.1);
    save();
  }

  function openAlbum() {
    const list = pet.photos.slice().reverse();
    const ov = overlay(`
      <div class="ui-title">📸 ${esc(pet.name)}'s album</div>
      <button class="ui-btn go big" data-snap>📸 Take a photo</button>
      ${list.length ? `<div class="axie-photos">${list.map((p, i) => `<figure data-i="${i}"><img src="${p.img}" alt=""><figcaption>🎂 ${p.age}</figcaption></figure>`).join('')}</div>`
        : '<div class="ui-sub">No photos yet. One is taken on every birthday 🎂</div>'}
      <div class="ui-row"><button class="ui-btn primary" data-close>Done</button></div>`);
    ov.querySelector('[data-snap]').addEventListener('click', () => {
      ov.close();
      setFace('joy', 1.5);
      setTimeout(snap, 350);
    });
    ov.querySelectorAll('figure').forEach(f => f.addEventListener('click', () => {
      const p = list[+f.dataset.i];
      const big = overlay(`<img class="axie-big" src="${p.img}" alt=""><div class="ui-sub">🎂 ${p.age} · ${new Date(p.at).toLocaleDateString()}</div><div class="ui-row"><button class="ui-btn primary" data-close>Back</button></div>`, false);
      big.style.zIndex = 30;
    }));
  }

  // ---------- Settings ----------
  function openSettings() {
    const L = LEVELS[pet.level];
    const ms = nextBirthday(pet);
    const hrs = Math.ceil(ms / 3600e3);
    const when = hrs <= 1 ? 'less than 1 hour' : hrs < 48 ? `${hrs} hours` : `${Math.round(hrs / 24)} days`;
    const growingNow = isGrowing(pet);
    const ov = overlay(`
      <div class="ui-kicker">Axie Pals</div>
      <div class="ui-title">${esc(pet.name)}</div>
      <div class="ui-row">
        <span class="ui-chip">${stageOf(pet.age).icon} ${stageOf(pet.age).name}</span>
        <span class="ui-chip">🎂 ${pet.age}</span>
        <span class="ui-chip">${L.icon} ${L.name}</span>
      </div>
      <div class="ui-sub">Next birthday in about <b>${when}</b>${growingNow ? '' : '<br>⚠️ Not growing right now. Look after every need!'}</div>
      <div style="width:100%;height:14px;border-radius:7px;background:rgba(255,255,255,.12);overflow:hidden"><div style="height:100%;width:${Math.round(birthdayProgress(pet) * 100)}%;background:var(--accent)"></div></div>
      <div class="ui-row">
        <button class="ui-btn danger small" data-new>🥚 New pet</button>
        <button class="ui-btn primary" data-close>Done</button>
      </div>`, false);
    const nb = ov.querySelector('[data-new]');
    let sure = false;
    nb.addEventListener('click', () => {
      if (!sure) { sure = true; nb.textContent = `Say bye to ${pet.name}? Tap again`; sfx.no(); return; }
      ov.close();
      forgetPet();
      pet = null;
      startSetup();
    });
  }

  // ---------- Birthday party ----------
  function startParty() {
    const age = pet.gifts[0];
    party = { age, stage: 'cake', t: 0, gift: giftFor(age), lit: true };
    closeTray();
    mode = null;
    pet.asleep = false; pet.lights = true;
    sfx.birthday();
    partyEl = document.createElement('div');
    partyEl.className = 'axie-party';
    partyEl.innerHTML = `🎉 Happy birthday ${esc(pet.name)}! 🎉<small>${age} today · tap the cake to blow!</small>`;
    ui.appendChild(partyEl);
    if (bar) bar.style.visibility = 'hidden';
    layout();
  }
  function partyTap(x, y) {
    const cx = W / 2, cy = FLOOR - 10;
    if (party.stage === 'cake' && Math.abs(x - cx) < 140 && y > cy - 160 && y < cy + 40) {
      party.stage = 'gift'; party.lit = false; party.t = 0;
      sound.cheer(); sound.win();
      for (let i = 0; i < 40; i++) parts.push({ icon: ['🎊', '🎉', '✨', '🎈'][i % 4], x: rand(0, W), y: rand(-60, 0), vx: rand(-40, 40), vy: rand(60, 160), life: 3, size: 28, fall: true });
      setFace('giggle', 2);
      partyEl.innerHTML = `🎉 Happy birthday ${esc(pet.name)}! 🎉<small>A present! Tap it 🎁</small>`;
    } else if (party.stage === 'gift' && Math.hypot(x - cx, y - (cy - 70)) < 90) {
      party.stage = 'open'; party.t = 0;
      sfx.heal();
      const g = party.gift;
      if (g && !pet.owned.includes(g)) {
        pet.owned.push(g);
        toggleThing(g);
        partyEl.innerHTML = `${ITEMS[g].icon}<small>${ITEMS[g].kind === 'wear' ? 'Something to wear!' : 'A new thing for the tank!'}</small>`;
      } else {
        pet.coins += 20;
        partyEl.innerHTML = `🪙 20<small>A bag of coins!</small>`;
      }
      setFace('joy', 3);
      setTimeout(() => { if (party) snap(); }, 900);
      setTimeout(endParty, 2600);
    }
  }
  function endParty() {
    if (!party) return;
    pet.gifts.shift();
    party = null;
    partyEl?.remove(); partyEl = null;
    if (bar) bar.style.visibility = '';
    layout();
    const st = stageOf(pet.age), prev = stageOf(pet.age - 1);
    if (st.name !== prev.name) toast(`${st.icon}<br>${esc(pet.name)} is a ${st.name} now!`, 3);
    save();
    refreshHud();
  }

  // ---------- Bubble pop mini game ----------
  function startGame(fromFriend) {
    if (game || party) return;
    if (!fromFriend) pd?.send({ k: 'game' });
    closeTray();
    game = { t: 25, score: 0, spawn: 0, list: [] };
    bar.style.visibility = 'hidden';
    hint('🫧 Pop the bubbles! Gold = 3 🪙', 2.5);
  }
  function endGame() {
    const n = game.score;
    game = null;
    bar.style.visibility = '';
    pet.fun = clamp(pet.fun + 25);
    pet.energy = clamp(pet.energy - 5);
    if (n) addCoins(n, W / 2, H / 2);
    toast(`🫧 ${n}<br>+${n} 🪙`, 2.5);
    sound.win();
    setFace('joy', 2);
    refreshHud();
  }

  // ---------- Setup (new pet) ----------
  function startSetup() {
    screen = 'setup';
    let pick = { colour: 'pink', name: NAMES[Math.floor(Math.random() * NAMES.length)], level: 'easy' };
    const step1 = () => {
      ui.innerHTML = '';
      const ov = overlay(`
        <div class="ui-kicker">Axie Pals</div>
        <div class="ui-title">Pick your egg 🥚</div>
        <div class="ui-choices tight">${COLOURS.map(c => `<button class="ui-choice ${c.id === pick.colour ? 'on' : ''}" data-c="${c.id}"><div class="axie-swatch" style="background:radial-gradient(circle at 35% 30%, #fff, ${c.body} 45%, ${c.gill})"></div>${c.name}</button>`).join('')}</div>
        <div class="ui-row"><button class="ui-btn primary big" data-next>Next ➜</button></div>`);
      ov.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
        sfx.click(); pick.colour = b.dataset.c;
        ov.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b));
      }));
      ov.querySelector('[data-next]').addEventListener('click', () => { sfx.click(); ov.remove(); step2(); });
    };
    const step2 = () => {
      const ov = overlay(`
        <div class="ui-title">Name your axolotl</div>
        <input class="axie-name" maxlength="12" value="${esc(pick.name)}" aria-label="Name">
        <div class="ui-row">${NAMES.slice().sort(() => Math.random() - 0.5).slice(0, 5).map(n => `<button class="ui-btn small" data-n="${n}">${n}</button>`).join('')}</div>
        <div class="ui-row"><button class="ui-btn ghost" data-back>Back</button><button class="ui-btn primary big" data-next>Next ➜</button></div>`);
      const inp = ov.querySelector('input');
      ov.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { sfx.click(); inp.value = b.dataset.n; }));
      ov.querySelector('[data-back]').addEventListener('click', () => { ov.remove(); step1(); });
      ov.querySelector('[data-next]').addEventListener('click', () => {
        pick.name = cleanName(inp.value) || 'Noodle';
        sfx.click(); ov.remove(); step3();
      });
    };
    const step3 = () => {
      const ov = overlay(`
        <div class="ui-title">How hard?</div>
        <div class="ui-choices">
          <button class="ui-choice ${pick.level === 'easy' ? 'on' : ''}" data-l="easy"><span style="font-size:40px">🐣</span>Easy<small class="ui-sub">Birthday every day</small></button>
          <button class="ui-choice ${pick.level === 'medium' ? 'on' : ''}" data-l="medium"><span style="font-size:40px">🐥</span>Medium<small class="ui-sub">Every 2 days. Grows when looked after</small></button>
          <button class="ui-choice ${pick.level === 'hard' ? 'on' : ''}" data-l="hard"><span style="font-size:40px">🦅</span>Hard<small class="ui-sub">Every 3 days. Keep every need up!</small></button>
        </div>
        <div class="ui-row"><button class="ui-btn ghost" data-back>Back</button><button class="ui-btn go big" data-next>🥚 Hatch!</button></div>`);
      ov.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => {
        sfx.click(); pick.level = b.dataset.l;
        ov.querySelectorAll('[data-l]').forEach(x => x.classList.toggle('on', x === b));
      }));
      ov.querySelector('[data-back]').addEventListener('click', () => { ov.remove(); step2(); });
      ov.querySelector('[data-next]').addEventListener('click', () => {
        sfx.click(); ov.remove(); panelOpen = false;
        pet = newPet(pick);
        pet.owned = ['plant'];
        pet.placed = { plant: { fx: 0.82, fy: 0.5 } };
        startEgg();
      });
    };
    step1();
  }

  function startEgg() {
    screen = 'egg';
    egg = { taps: 0, wob: 0, done: 0 };
    ui.innerHTML = '';
    layout();
    hint('👆 Tap the egg!', 0);
  }

  function hatch() {
    pet.hatched = true;
    pet.born = Date.now(); pet.last = Date.now();
    savePet(pet);
    hint('');
    startTank(true);
    for (let i = 0; i < 30; i++) parts.push({ icon: ['✨', '🎉', '💖'][i % 3], x: W / 2 + rand(-60, 60), y: H / 2 + rand(-40, 40), vx: rand(-200, 200), vy: rand(-260, -60), life: 1.8, size: 30, grav: true });
    sound.win();
    setFace('giggle', 2.5);
    toast(`Hello ${esc(pet.name)}! 💖`, 2.5);
  }

  function startTank(fresh) {
    screen = 'tank';
    layout();
    const box = swimBox();
    ax.x = fresh ? W / 2 : rand(box.x0, box.x1);
    ax.y = fresh ? H / 2 : rand(box.y0, box.y1);
    buildTankUI();
    if (!fresh) {
      const hours = catchUp(pet);
      if (pet.asleep) { pet.asleep = false; }
      pet.lights = true;
      if (hours >= 1 && !pet.gifts.length) {
        setFace('wow', 1.5);
        setTimeout(() => toast(`${esc(pet.name)} missed you! 💖`), 300);
      }
      if (sulky(pet)) setTimeout(() => sayIt(mood(pet).say, 3), 1500);
      refreshHud();
    }
  }

  // ---------- Input ----------
  const pt = e => { const r = view.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const petHit = (x, y) => {
    const dx = (x - ax.x) * ax.dir / S, dy = (y - ax.y) / S;
    return ((dx + 25) ** 2) / (110 ** 2) + (dy ** 2) / (55 ** 2) < 1;
  };
  // What's in the tank: mine, or the host's when I'm visiting a friend.
  const shown = () => (pd && !pd.isHost ? pd.tank() : pet.placed);
  function itemPos(id) {
    const it = ITEMS[id], p = shown()[id] || pet.placed[id];
    if (it.kind === 'decor') return { x: p.fx * W, y: FLOOR + 10 - it.size * 0.4 };
    if (it.kind === 'float') return { x: (flt[id]?.x ?? p.fx * W), y: TOP + 6 };
    if (it.kind === 'toy' && ball) return { x: ball.x, y: ball.y };
    if (it.kind === 'friend' && friends[id]) return { x: friends[id].x, y: friends[id].y };
    return { x: p.fx * W, y: FLOOR - 20 };
  }

  function onDown(e) {
    if (panelOpen) return;
    const p = pt(e);
    closeTray();
    view.canvas.setPointerCapture?.(e.pointerId);
    if (screen === 'egg') {
      if (Math.hypot(p.x - W / 2, p.y - H / 2) < 120 && !egg.done) {
        egg.taps++; egg.wob = 1;
        sound.tone(400 + egg.taps * 80, 0.1, 'triangle', 0.15);
        if (egg.taps >= 6) { egg.done = 1; sfx.plop(); setTimeout(hatch, 250); }
      }
      return;
    }
    if (screen !== 'tank') return;
    if (party) { partyTap(p.x, p.y); return; }
    if (game) {
      for (const b of game.list) {
        if (!b.dead && Math.hypot(p.x - b.x, p.y - b.y) < b.r + 14) {
          b.dead = true; game.score += b.gold ? 3 : 1;
          sfx.bubble(); pop(b.gold ? '🪙' : '✨', b.x, b.y, 1, 24);
          return;
        }
      }
      return;
    }
    // Poo first
    for (let i = 0; i < pet.poos.length; i++) {
      const px = pet.poos[i].x * W, py = FLOOR + 14;
      if (Math.hypot(p.x - px, p.y - (py - 14)) < 34) {
        scoops.push({ x: px, y: py, t: 0 });
        pet.poos.splice(i, 1);
        pet.clean = clamp(pet.clean + 8);
        sfx.plop();
        addCoins(1, px, py - 30);
        refreshHud();
        return;
      }
    }
    if (mode === 'clean') { drag = { kind: 'clean', x: p.x, y: p.y, got: 0 }; return; }
    for (const [mid, m] of mates) {
      const dx = (p.x - m.x) * m.dir / m.s, dy = (p.y - m.y) / m.s;
      if (((dx + 25) ** 2) / (110 ** 2) + (dy ** 2) / (55 ** 2) < 1) {
        pd?.send({ k: 'tickle', to: mid });
        sfx.giggle();
        pop('💖', p.x, p.y, 2);
        pet.fun = clamp(pet.fun + 2);
        return;
      }
    }
    if (petHit(p.x, p.y)) {
      if (pet.asleep) { sayIt('😴'); sfx.snore(); return; }
      drag = { kind: 'pet', x: p.x, y: p.y, dist: 0 };
      setFace('giggle', 0.8);
      sfx.giggle();
      pet.fun = clamp(pet.fun + 2);
      pop('💖', p.x, p.y);
      return;
    }
    for (const id of Object.keys(pd && !pd.isHost ? {} : pet.placed)) {
      const it = ITEMS[id];
      if (!it || it.kind === 'wear') continue;
      const q = itemPos(id);
      if (Math.hypot(p.x - q.x, p.y - q.y) < it.size * 0.6) {
        drag = { kind: 'item', id, x: p.x, y: p.y, lx: p.x, ly: p.y, lt: performance.now(), vx: 0, vy: 0 };
        if (id === 'ball') { initBall(); ball.held = true; }
        if (it.kind === 'friend') { pop('💖', q.x, q.y - 20); sfx.giggle(); }
        return;
      }
    }
    // Empty water: blow a bubble for the axolotl to chase
    if (p.y > TOP && p.y < FLOOR) {
      bubbles.push({ x: p.x, y: p.y, r: rand(14, 22), vy: -rand(18, 30), chase: !pet.asleep });
      pd?.send({ k: 'bub', fx: p.x / W, fy: (p.y - TOP) / (FLOOR - TOP) });
      sfx.bubble();
    }
  }

  function onMove(e) {
    if (!drag) return;
    const p = pt(e);
    const d = Math.hypot(p.x - drag.x, p.y - drag.y);
    if (drag.kind === 'clean') {
      if (pet.clean < 100) {
        const before = pet.clean;
        pet.clean = clamp(pet.clean + d * 0.05);
        drag.got += pet.clean - before;
        if (Math.random() < 0.3) sfx.scrub();
        if (Math.random() < 0.25) bubbles.push({ x: p.x + rand(-20, 20), y: p.y + rand(-20, 20), r: rand(5, 10), vy: -rand(30, 60), chase: false });
        if (drag.got >= 20) { drag.got = 0; addCoins(1, p.x, p.y); }
        if (pet.clean >= 100) {
          mode = null; hint('✨ Sparkly clean!', 2); sound.win(); setFace('joy', 2);
          pop('✨', W / 2, H / 2, 8);
          drag = null; refreshHud(); return;
        }
        refreshHud();
      }
      drag.sx = p.x; drag.sy = p.y;
    } else if (drag.kind === 'pet') {
      drag.dist += d;
      if (drag.dist > 60) {
        drag.dist = 0;
        pet.fun = clamp(pet.fun + 3);
        setFace('giggle', 0.8);
        pop('💖', p.x, p.y);
        if (Math.random() < 0.4) sfx.giggle();
        refreshHud();
      }
    } else if (drag.kind === 'item') {
      const it = ITEMS[drag.id];
      const now = performance.now();
      const dt = Math.max(1, now - drag.lt) / 1000;
      drag.vx = (p.x - drag.lx) / dt; drag.vy = (p.y - drag.ly) / dt;
      drag.lx = p.x; drag.ly = p.y; drag.lt = now;
      const fx = clamp(p.x / W, 0.06, 0.94);
      if (drag.id === 'ball' && ball) { ball.x = p.x; ball.y = clamp(p.y, TOP + 20, FLOOR); }
      else if (it.kind === 'float') { flt[drag.id] = { x: fx * W }; pet.placed[drag.id].fx = fx; }
      else if (it.kind === 'friend' && friends[drag.id]) { friends[drag.id].x = p.x; if (it.swims) friends[drag.id].y = clamp(p.y, TOP + 40, FLOOR - 20); pet.placed[drag.id].fx = fx; }
      else pet.placed[drag.id].fx = fx;
    }
    drag.x = p.x; drag.y = p.y;
  }

  function onUp() {
    if (drag?.kind === 'item') {
      if (drag.id === 'ball' && ball) {
        ball.held = false;
        ball.vx = clamp(drag.vx, -900, 900); ball.vy = clamp(drag.vy, -900, 900);
        pet.placed.ball.fx = clamp(ball.x / W, 0.05, 0.95);
      }
      save();
    }
    drag = null;
  }

  view.canvas.addEventListener('pointerdown', onDown);
  view.canvas.addEventListener('pointermove', onMove);
  view.canvas.addEventListener('pointerup', onUp);
  view.canvas.addEventListener('pointercancel', onUp);

  function initBall() {
    if (!ball && pet.placed.ball) ball = { x: pet.placed.ball.fx * W, y: FLOOR - 22, vx: 0, vy: 0, rot: 0 };
  }

  // ---------- Update ----------
  function update(dt) {
    t += dt;
    if (screen === 'egg') { egg.wob = Math.max(0, egg.wob - dt * 2); return; }
    if (screen !== 'tank' || !pet) return;
    layout();

    tickPet(pet, dt);
    if (pet.gifts.length && !party && !game && !panelOpen) startParty();
    if (party) party.t += dt;

    const box = swimBox();
    const night = nightNow();
    dark += ((pet.lights ? (night ? 0.25 : 0) : 1) - dark) * Math.min(1, dt * 3);

    // Poo after eating
    if (pooTimer > 0 && !pet.asleep) {
      pooTimer -= dt;
      if (pooTimer <= 0) {
        pooTimer = 0;
        if (pet.tummy > 0) {
          pet.tummy = Math.max(0, pet.tummy - 2);
          addPoo(pet, clamp((ax.x - ax.dir * 70 * S) / W, 0.05, 0.95));
          sfx.plop();
          setFace('wow', 1);
          if (pet.tummy > 0) pooTimer = rand(30, 60);
          refreshHud();
        }
      }
    }

    // ---- Where does the axolotl want to go?
    let speed = 110 * (pet.energy < 25 ? 0.55 : 1) * (pet.sick ? 0.6 : 1) * Math.max(0.8, S);
    const food = foods.filter(f => !f.gone).sort((a, b) => Math.abs(a.x - ax.x) - Math.abs(b.x - ax.x))[0];
    const chase = bubbles.find(b => b.chase);
    if (party) {
      ax.tx = W / 2 - 160 * S; ax.ty = FLOOR - 120 * S;
    } else if (pet.asleep) {
      ax.tx = clamp(ax.x, box.x0, box.x1); ax.ty = FLOOR - 26 * S;
      speed *= 0.9;
    } else if (game) {
      const b = game.list.find(q => !q.dead);
      if (b) { ax.tx = b.x - 30 * S * ax.dir; ax.ty = b.y; }
    } else if (food && pet.food < 98) {
      ax.tx = food.x - 34 * S * ax.dir; ax.ty = food.y - 4 * S;
      speed *= 1.4;
      if (Math.hypot(ax.x + 34 * S * ax.dir - food.x, ax.y - food.y) < 34 * S) { food.gone = true; eat(food); }
    } else if (chase) {
      ax.tx = chase.x - 34 * S * ax.dir; ax.ty = chase.y;
      speed *= 1.3;
      if (Math.hypot(ax.x + 34 * S * ax.dir - chase.x, ax.y - chase.y) < 30 * S) {
        chase.popped = true; sfx.bubble(); pet.fun = clamp(pet.fun + 3); setFace('giggle', 0.6); refreshHud();
      }
    } else if (ball && !ball.held && pet.fun < 92 && !sulky(pet) && Math.random() < dt * 0.3) {
      ax.tx = ball.x - 70 * S * Math.sign(ball.x - ax.x || 1); ax.ty = ball.y - 10;
      ax.wantBall = true;
    } else {
      ax.idle -= dt;
      if (ax.idle <= 0 || ax.tx === null) {
        ax.idle = rand(2.5, 6);
        const lazy = sulky(pet) || pet.energy < 25;
        ax.tx = rand(box.x0, box.x1);
        ax.ty = lazy || Math.random() < 0.3 ? box.y1 : rand(box.y0, box.y1);
      }
    }
    if (ax.tx !== null) {
      ax.tx = clamp(ax.tx, box.x0, box.x1); ax.ty = clamp(ax.ty, box.y0, FLOOR - 24 * S);
      const dx = ax.tx - ax.x, dy = ax.ty - ax.y, dist = Math.hypot(dx, dy);
      const sp = dist > 4 ? speed * Math.min(1, dist / 80) : 0;
      const k = Math.min(1, dt * 2.5);
      ax.vx += ((dist ? dx / dist : 0) * sp - ax.vx) * k;
      ax.vy += ((dist ? dy / dist : 0) * sp - ax.vy) * k;
    }
    // gentle bob
    ax.vy += Math.sin(t * 1.3) * 3 * dt;
    if (ax.shake > 0) { ax.shake -= dt; ax.x += Math.sin(t * 40) * 1.5; }
    ax.x += ax.vx * dt; ax.y += ax.vy * dt;
    if (ax.vx > 18) ax.dir = 1; else if (ax.vx < -18) ax.dir = -1;
    ax.blink -= dt;
    if (ax.blink < -3.5) ax.blink = 0.15;

    // Nudge the ball
    if (ball && !ball.held && ax.wantBall && Math.hypot(ax.x + 40 * S * ax.dir - ball.x, ax.y - ball.y) < 50 * S) {
      ball.vx += ax.dir * 260; ball.vy -= 160;
      ax.wantBall = false;
      pet.fun = clamp(pet.fun + 5);
      setFace('giggle', 0.8); sfx.bubble(); refreshHud();
    }

    // ---- Food falls
    for (const f of foods) {
      f.age += dt;
      f.y = Math.min(f.y + f.vy * dt, FLOOR + 4);
      f.vy = Math.min(f.vy + 40 * dt, 70);
      if (f.age > 25) f.gone = true;
    }
    foods = foods.filter(f => !f.gone);

    // ---- Bubbles
    for (const b of bubbles) { b.y += b.vy * dt; b.x += Math.sin(t * 3 + b.r) * 10 * dt; }
    bubbles = bubbles.filter(b => !b.popped && b.y > TOP);
    if (Math.random() < dt * 1.2) bubbles.push({ x: rand(20, W - 20), y: FLOOR, r: rand(3, 7), vy: -rand(30, 60), chase: false });
    if (pet.placed.bubbler && Math.random() < dt * 6) {
      bubbles.push({ x: pet.placed.bubbler.fx * W + rand(-5, 5), y: FLOOR - 20, r: rand(4, 9), vy: -rand(60, 100), chase: false });
    }

    // ---- Ball
    if (pet.placed.ball) {
      initBall();
      if (!ball.held) {
        ball.vy += 120 * dt;
        ball.vx *= 1 - Math.min(1, dt * 0.9); ball.vy *= 1 - Math.min(1, dt * 0.9);
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        const r = 22;
        if (ball.y > FLOOR - r + 8) { ball.y = FLOOR - r + 8; ball.vy *= -0.5; ball.vx *= 0.92; }
        if (ball.y < TOP + r) { ball.y = TOP + r; ball.vy *= -0.5; }
        if (ball.x < r) { ball.x = r; ball.vx *= -0.7; }
        if (ball.x > W - r) { ball.x = W - r; ball.vx *= -0.7; }
        ball.rot += ball.vx * dt / r;
      }
    }

    // ---- Friends
    for (const id of Object.keys(pet.placed)) {
      const it = ITEMS[id];
      if (!it || it.kind !== 'friend') continue;
      let f = friends[id];
      if (!f) f = friends[id] = { x: pet.placed[id].fx * W, y: it.swims ? rand(box.y0, box.y1) : FLOOR + 2 - it.size * 0.3, dir: 1, ty: 0, wait: 0 };
      if (drag?.id === id) continue;
      if (it.walks) {
        f.wait -= dt;
        if (f.wait <= 0) { f.dir = Math.random() < 0.5 ? -1 : 1; f.wait = rand(2, 5); }
        f.x += f.dir * (it.slow ? 8 : 30) * dt;
        f.y = FLOOR + 2 - it.size * 0.3;
      } else {
        f.wait -= dt;
        if (f.wait <= 0) { f.dir = Math.random() < 0.5 ? -1 : 1; f.ty = rand(box.y0, box.y1); f.wait = rand(3, 6); }
        f.x += f.dir * 50 * dt;
        f.y += (f.ty - f.y) * Math.min(1, dt);
      }
      if (f.x < 30) { f.x = 30; f.dir = 1; } else if (f.x > W - 30) { f.x = W - 30; f.dir = -1; }
    }

    // ---- Particles
    for (const p of parts) {
      p.life -= dt;
      if (!p.still) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.grav) p.vy += 400 * dt;
      }
    }
    parts = parts.filter(p => p.life > 0);
    for (const s of scoops) s.t += dt;
    scoops = scoops.filter(s => s.t < 0.8);

    // ---- Talking
    if (!party && !game) {
      sayNext -= dt;
      if (sayNext <= 0) {
        sayNext = rand(6, 10);
        const m = mood(pet);
        if (!['ok', 'joy', 'sleep'].includes(m.id)) sayIt(m.say);
        else if (night && pet.lights && pet.energy < 60) sayIt('🥱');
        else if (m.id === 'joy' && Math.random() < 0.4) sayIt('💖');
      }
    }
    if (pet.asleep) {
      snoreT -= dt;
      if (snoreT <= 0) { snoreT = 2.4; sfx.snore(); parts.push({ text: 'Z', x: ax.x + 40 * S * ax.dir, y: ax.y - 40 * S, vx: 10, vy: -25, life: 2, size: 26 }); }
    }

    // ---- Mini game
    if (game) {
      game.t -= dt;
      game.spawn -= dt;
      if (game.spawn <= 0 && game.t > 1) {
        game.spawn = rand(0.35, 0.7);
        const gold = Math.random() < 0.12;
        game.list.push({ x: rand(40, W - 40), y: FLOOR, r: gold ? 26 : rand(22, 34), vy: -rand(70, 140), gold });
      }
      for (const b of game.list) {
        b.y += b.vy * dt; b.x += Math.sin(t * 2 + b.r) * 20 * dt;
        if (!b.dead && Math.hypot(ax.x + 34 * S * ax.dir - b.x, ax.y - b.y) < b.r + 10 * S) { b.dead = true; game.score += 1; sfx.bubble(); }
      }
      game.list = game.list.filter(b => !b.dead && b.y > TOP - 40);
      if (game.t <= 0) endGame();
    }

    // HUD bars move slowly; refresh now and then
    // ---- Playdate: move friends' axolotls, send mine
    if (pd) {
      pd.setPos(ax.x / W, (ax.y - TOP) / (FLOOR - TOP), ax.dir, faceNow());
      for (const m of mates.values()) {
        const k = Math.min(1, dt * 6);
        m.x += (m.tx - m.x) * k; m.y += (m.ty - m.y) * k;
        m.swim = clamp(Math.hypot(m.tx - m.x, m.ty - m.y) / 40, 0, 1);
        if (!m.photo && t - m.seen > 5 && !party && !game && !panelOpen) {
          m.photo = true; setFace('joy', 1.5); setTimeout(() => { snap(); hint('📸 Playdate photo!', 2); }, 300);
        }
      }
      if (mates.size) pet.fun = clamp(pet.fun + dt * 0.4);  // friends make it happy
      if (pd.isHost) {
        tankT -= dt;
        if (tankT <= 0) {
          tankT = 2;
          const tk = {};
          for (const [id, v] of Object.entries(pet.placed)) if (ITEMS[id] && (ITEMS[id].kind === 'decor' || ITEMS[id].kind === 'float')) tk[id] = Math.round(v.fx * 1000);
          const js = JSON.stringify(tk);
          if (js !== lastTank) { lastTank = js; pd.setTank({ placed: tk }); }
        }
      }
    }

    saveT += dt;
    if (saveT > 4) { saveT = 0; save(); refreshHud(); pd?.updateInfo(); }
  }

  // ---------- Draw ----------
  function faceNow() {
    if (ax.faceUntil > t) return ax.faceId;
    const m = mood(pet).id;
    if (m === 'sick' || m === 'sleep' || m === 'hungry' || m === 'sleepy') return m;
    if (m === 'yucky') return 'yuck';
    if (m === 'bored' || sulky(pet)) return 'sad';
    if (m === 'joy') return 'joy';
    return 'ok';
  }

  function wearIcons() {
    const w = pet.wear;
    return {
      hat: w.hat ? ITEMS[w.hat].icon : null, partyHat: w.hat === 'party',
      face: w.face ? ITEMS[w.face].icon : null,
      neck: w.neck || null, neckBow: w.neck === 'tie',
    };
  }

  function draw() {
    layout();
    ctx.clearRect(0, 0, W, H);
    drawTank(ctx, { W, H, top: TOP, floorY: FLOOR, t });
    if (screen === 'setup') return;
    if (screen === 'egg') {
      drawShadow(ctx, W / 2, FLOOR, 70, FLOOR - H / 2);
      drawEgg(ctx, W / 2, H / 2, clamp(Math.min(W, H) / 600, 0.7, 1.4), colOf(), Math.floor(egg.taps * 0.7), egg.wob, t);
      return;
    }

    // Decor on the floor
    for (const id of Object.keys(shown())) {
      const it = ITEMS[id];
      if (!it || it.kind !== 'decor') continue;
      const q = itemPos(id);
      drawShadow(ctx, q.x, FLOOR, it.size * 0.4, 0);
      drawEmoji(ctx, it.icon, q.x, q.y, it.size, it.tilt || 0);
    }
    // Poos
    pet.poos.forEach((p, i) => drawPoo(ctx, p.x * W, FLOOR + 16, 1.1, Math.sin(t * 3 + i) * 0.5 + 0.5));
    for (const s of scoops) {
      const k = s.t / 0.8;
      ctx.save(); ctx.globalAlpha = 1 - k;
      drawPoo(ctx, s.x, s.y - k * 120, 1.1 * (1 - k * 0.5));
      ctx.restore();
      drawEmoji(ctx, '🥅', s.x, s.y - k * 120 - 10, 44, 0, 1 - k);
    }
    // Food
    for (const f of foods) drawEmoji(ctx, f.f.icon, f.x, f.y, 30, Math.sin(t * 4 + f.x) * 0.3, f.age > 22 ? (25 - f.age) / 3 : 1);
    // Friends
    for (const [id, f] of Object.entries(friends)) {
      const it = ITEMS[id];
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(it.swims ? -f.dir : (it.slow ? -f.dir : 1), 1);
      drawEmoji(ctx, it.icon, 0, Math.sin(t * 6 + f.x) * (it.walks ? 1.5 : 3), it.size);
      ctx.restore();
    }
    // Ball
    if (ball && pet.placed.ball) drawShadow(ctx, ball.x, FLOOR, 18, FLOOR - ball.y);
    if (ball && pet.placed.ball) drawEmoji(ctx, '⚽', ball.x, ball.y, 44, ball.rot);

    // Friends' axolotls (with a name tag)
    for (const m of mates.values()) {
      const col = COLOURS.find(c => c.id === m.pet.colour) || COLOURS[0];
      drawShadow(ctx, m.x - 20 * m.s * m.dir, FLOOR, 70 * m.s, FLOOR - m.y);
      const w = m.pet.wear;
      drawAxolotl(ctx, m.x, m.y, m.s, {
        col, dir: m.dir, t: t + m.ph, swim: m.swim, face: m.face, blink: false, sick: m.face === 'sick',
        wear: { hat: w.hat ? ITEMS[w.hat].icon : null, partyHat: w.hat === 'party', face: w.face ? ITEMS[w.face].icon : null, neck: w.neck || null, neckBow: w.neck === 'tie' },
      });
      const label = `${m.who === m.pet.name ? '' : m.who + "'s "}${m.pet.name}`;
      ctx.save();
      ctx.font = '800 15px Nunito, sans-serif';
      const tw = ctx.measureText(label).width + 20;
      const ly = m.y - 70 * m.s - (w.hat ? 34 * m.s : 0);
      ctx.fillStyle = 'rgba(255,255,255,.88)';
      ctx.beginPath(); ctx.roundRect(m.x + 20 * m.s * m.dir - tw / 2, ly - 13, tw, 26, 13); ctx.fill();
      ctx.fillStyle = '#15172e'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, m.x + 20 * m.s * m.dir, ly + 1);
      ctx.restore();
    }

    drawShadow(ctx, ax.x - 20 * S * ax.dir, FLOOR, 70 * S, FLOOR - ax.y);
    // The axolotl
    const dir = ax.dir;
    const swim = clamp(Math.hypot(ax.vx, ax.vy) / 120, 0, 1);
    const tilt = clamp(ax.vy / 300, -0.35, 0.35) * dir;
    ctx.save();
    ctx.translate(ax.x, ax.y);
    ctx.rotate(pet.asleep ? 0 : tilt);
    drawAxolotl(ctx, 0, 0, S, {
      col: colOf(), dir, t, swim, face: faceNow(), blink: ax.blink > 0,
      wear: wearIcons(), sick: pet.sick,
    });
    ctx.restore();

    if (party) {
      const cx = W / 2, cy = FLOOR - 10;
      if (party.stage === 'cake') drawCake(ctx, cx + 60, cy, clamp(Math.min(W, H) / 700, 0.7, 1.2), party.age, t);
      else if (party.stage === 'gift') drawEmoji(ctx, '🎁', cx, cy - 70 + Math.sin(t * 6) * 6, 110, Math.sin(t * 8) * 0.08);
      else if (party.stage === 'open') {
        const g = party.gift;
        drawEmoji(ctx, g ? ITEMS[g].icon : '🪙', cx, cy - 90 - Math.min(1, party.t) * 40, 70 + Math.min(1, party.t) * 50);
      }
    }

    // Floats on top of the water
    for (const id of Object.keys(shown())) {
      const it = ITEMS[id];
      if (!it || it.kind !== 'float') continue;
      const q = itemPos(id);
      drawEmoji(ctx, it.icon, q.x, q.y + Math.sin(t * 2 + q.x) * 4, it.size, Math.sin(t * 1.5 + q.x) * 0.1);
    }

    // Bubbles
    for (const b of bubbles) drawBubble(ctx, b.x, b.y, b.r, b.chase ? 1 : 0.7);
    if (game) for (const b of game.list) {
      drawBubble(ctx, b.x, b.y, b.r);
      if (b.gold) drawEmoji(ctx, '🪙', b.x, b.y, b.r * 1.1);
    }

    // Particles
    for (const p of parts) {
      const a = Math.min(1, p.life / 0.5);
      if (p.text) {
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.font = `900 ${p.size}px Nunito, sans-serif`; ctx.fillText(p.text, p.x, p.y); ctx.restore();
      } else drawEmoji(ctx, p.icon, p.x, p.y, p.size, 0, a);
    }

    // Speech bubble
    if (say && say.until > t) {
      const k = Math.min(1, (t - say.born) * 5, (say.until - t) * 4);
      drawSay(ctx, clamp(ax.x + 70 * S * dir, 50, W - 50), clamp(ax.y - 100 * S, TOP + 40, H), say.icon, k);
    }

    // Glass dirt, lights off, clean mode sponge
    drawAlgae(ctx, W, H, 1 - pet.clean / 100);
    drawGlass(ctx, W, H);
    drawNight(ctx, W, H, dark);
    if (drag?.kind === 'clean' && drag.sx != null) drawEmoji(ctx, '🧽', drag.sx, drag.sy, 52);

    // Mini game timer
    if (game) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.beginPath(); ctx.roundRect(W / 2 - 90, H - 86, 180, 56, 20); ctx.fill();
      ctx.fillStyle = '#15172e';
      ctx.font = '900 26px Nunito, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`⏱ ${Math.ceil(game.t)}   🫧 ${game.score}`, W / 2, H - 58);
      ctx.restore();
    }
  }

  // ---------- Playdate ----------
  const petInfo = () => ({ name: pet.name, colour: pet.colour, age: pet.age, wear: { ...pet.wear } });
  function syncMates() {
    if (!pd) return;
    const list = pd.mates();
    const base = clamp(Math.min(W, H) / 680, 0.55, 1.25);
    const ids = new Set();
    for (const f of list) {
      ids.add(f.pid);
      let m = mates.get(f.pid);
      if (!f.pos) continue;
      const tx = f.pos.fx * W, ty = TOP + f.pos.fy * (FLOOR - TOP);
      if (!m) {
        m = { x: tx, y: ty, swim: 0, seen: t, photo: false, ph: Math.random() * 10 };
        mates.set(f.pid, m);
        sound.win();
        toast(`${f.face} ${esc(f.pet.name)} came to play! 💖`, 2.6);
        if (pet.asleep) { pet.asleep = false; pet.lights = true; }
      }
      Object.assign(m, { tx, ty, dir: f.pos.dir, face: f.pos.face, pet: f.pet, who: f.who, s: base * stageOf(f.pet.age).scale });
    }
    for (const [id, m] of mates) if (!ids.has(id)) {
      mates.delete(id);
      hint(`👋 Bye ${m.pet.name}!`, 2.5);
    }
    refreshHud();
  }
  function onPlaydateEvent(from, e) {
    if (screen !== 'tank') return;
    if (e.k === 'food') {
      const f = FOODS.find(x => x.id === e.f);
      if (f && !foods.some(x => x.id === e.id)) foods.push({ f, x: e.fx * W, y: TOP - 10, vy: 30, age: 0, id: e.id });
    } else if (e.k === 'ate') {
      const f = foods.find(x => x.id === e.id);
      if (f) f.gone = true;
    } else if (e.k === 'bub') {
      bubbles.push({ x: e.fx * W, y: TOP + e.fy * (FLOOR - TOP), r: rand(14, 22), vy: -rand(18, 30), chase: !pet.asleep });
      sfx.bubble();
    } else if (e.k === 'tickle' && pd && e.to === pd.pid) {
      if (pet.asleep) return;
      setFace('giggle', 1); sfx.giggle();
      pet.fun = clamp(pet.fun + 3);
      pop('💖', ax.x, ax.y - 30 * S, 2);
      refreshHud();
    } else if (e.k === 'game') {
      if (!pet.asleep && !pet.sick && !panelOpen) startGame(true);
    }
  }
  function usePlaydate(room) {
    pd = connectPlaydate(room, {
      petInfo,
      onEvent: onPlaydateEvent,
      onChange: syncMates,
      onClosed: () => {
        pd = null; mates.clear();
        toast('Playdate over 👋', 2.5);
        refreshHud();
      },
    });
    lastTank = '';
    tankT = 0;
    refreshHud();
  }
  async function startPlaydate() {
    if (pd || pdStarting) return;
    pdStarting = true;
    try {
      const tk = {};
      for (const [id, v] of Object.entries(pet.placed)) if (ITEMS[id] && (ITEMS[id].kind === 'decor' || ITEMS[id].kind === 'float')) tk[id] = Math.round(v.fx * 1000);
      const room = await hostPlaydate({ placed: tk });
      if (!room) return;
      usePlaydate(room);
      hint('👫 Waiting for friends…', 3);
    } catch (e) {
      hint("Couldn't connect 😢 Try again", 3);
    } finally { pdStarting = false; }
  }
  async function joinFrom(code) {
    try {
      const room = await joinPlaydate(code);
      if (!room) { hint('That playdate has finished 👋', 3); return; }
      usePlaydate(room);
      sound.win();
      hint('🏠 Off to play!', 2.5);
    } catch (e) {
      hint("Couldn't connect 😢 Try again", 3);
    }
  }
  async function leavePlaydate() {
    const p = pd;
    pd = null; mates.clear();
    if (p) await p.leave();
    refreshHud();
  }
  function openPlaydate() {
    const list = pd.mates();
    const ov = overlay(`
      <div class="ui-kicker">Playdate</div>
      <div class="ui-title">${pd.isHost ? '👫 In your tank' : `🏠 At ${esc(pd.hostName())}'s tank`}</div>
      <div class="ui-row">${list.length ? list.map(m => `<span class="ui-chip">${m.face} ${esc(m.pet.name)}</span>`).join('') : '<span class="ui-sub">Waiting for friends…</span>'}</div>
      <div class="ui-sub">Feed, blow bubbles and play 🎮 together. Tap a friend's axolotl to tickle it!</div>
      <div class="ui-row"><button class="ui-btn danger" data-leave>👋 ${pd.isHost ? 'End playdate' : 'Go home'}</button><button class="ui-btn primary" data-close>Keep playing</button></div>`, false);
    ov.querySelector('[data-leave]').addEventListener('click', () => { ov.close(); leavePlaydate(); });
  }

  // Tests: ?axdebug&net=local, then __axie.host() in one tab and #/axie?join=<code> in another.
  if (/axdebug/.test(location.search)) {
    window.__axie = {
      host: async () => { const r = await createRoom('axie', { v: 1, tank: {} }); await r.setMeta({ hostUid: r.uid }); usePlaydate(r); return r.code; },
      state: () => ({ pd: !!pd, mates: mates.size, foods: foods.length, game: !!game, fun: pet && pet.fun }),
    };
  }

  // ---------- Start ----------
  const stopLoop = startLoop(update, draw);
  const inviteCode = takeJoinCode('axie');
  if (pet && pet.hatched) {
    startTank(false);
    if (inviteCode) joinFrom(inviteCode);
  } else if (pet) startEgg();
  else startSetup();
  if (inviteCode && !(pet && pet.hatched)) setTimeout(() => hint('Hatch your own axolotl first, then join! 🥚', 4), 500);

  const onVis = () => {
    if (!pet || screen !== 'tank') return;
    if (document.hidden) savePet(pet);
    else { catchUp(pet); refreshHud(); }
  };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('pagehide', save);

  return () => {
    save();
    if (pd) { const p = pd; pd = null; p.leave(); }
    stopLoop();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pagehide', save);
    view.destroy();
    root.remove();
  };
}
