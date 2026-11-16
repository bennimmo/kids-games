// Raffy Race: draw a track, add extras, race on one keyboard, a tablet, or online.
//
// - The track + extras are plain data (see trackToJSON in track.js).
// - The race is a simulation: stepRace(race, track, items, inputs, dt).
// - Online (js/engine/net.js): each device drives its own cars and sends
//   their positions ~15 times a second. Other devices show them smoothly.
//   The host owns the track and starts each race.
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { createKeys } from '../../js/engine/keys.js';
import { sound, audioCtx } from '../../js/engine/sound.js';
import { icon } from '../../js/engine/icons.js';
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { togetherButton, playTogether, takeJoinCode, joined, leftRoom, playerInfo, people, lobbyHTML, waitHTML, notReady, startLabel } from '../../js/engine/together.js';
import { onFriends } from '../../js/engine/friends.js';
import { WORLD, buildTrack, snapItem, resnapItems, trackFromJSON, trackToJSON } from './track.js';
import { loadSaved, saveTrack, toggleFav, deleteSaved } from './saved.js';
import { createRace, stepRace, LAPS, lapsDone, standings, withAutoBoxes, boxesFromItems, PICKUPS } from './sim.js';
import { myName, cleanName } from '../../js/engine/profile.js';
import { aiInput } from './ai.js';
import { createRenderer, drawCarIcon, drawItemIcon, drawTrackThumb, STYLES, DECALS } from './render.js';

const COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00', '#8e24aa', '#ec407a', '#212121'];
const EXTRAS = ['box', 'jump', 'boost', 'water', 'mud', 'ice', 'tunnel', 'cone', 'tyres', 'tree', 'stand'];
const ITEM_ICON = { rocket: '🥊', banana: '🍌', turbo: '⚡' };
const CPU_KEY = 'raffy-race-cpu';
const STEP = 1 / 60;
const MEDALS = ['🥇', '🥈', '🥉', '🏅'];

const CONTROLS = {
  arrows: k => ({ up: k.isDown('ArrowUp'), down: k.isDown('ArrowDown'), left: k.isDown('ArrowLeft'), right: k.isDown('ArrowRight'),
    fire: k.isDown('Enter') || k.isDown('ShiftRight') || k.isDown('Slash') || k.isDown('NumpadEnter') }),
  wasd: k => ({ up: k.isDown('KeyW'), down: k.isDown('KeyS'), left: k.isDown('KeyA'), right: k.isDown('KeyD'),
    fire: k.isDown('Space') || k.isDown('ShiftLeft') || k.isDown('KeyE') }),
};
const KEY_LABELS = { arrows: ['▲', '◀', '▼', '▶'], wasd: ['W', 'A', 'S', 'D'] };
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const TOUCH_ICON = { left: icon('left'), right: icon('right'), up: icon('up'), down: icon('down'), fire: '💥' };
// phones: small screen, so the camera follows your car and there's no 2-player mode
const PHONE = () => TOUCH && Math.min(innerWidth, innerHeight) < 520;
// how you steer on a touch screen: 👆 finger on the track, 📱 tilt, 🎮 buttons
const CTRL_ICON = { finger: '👆', tilt: '📱', buttons: '🎮' };
const CTRL_KEY = 'rt-ctrl';
const PLAYERS_KEY = 'raffy-race-players-v1';
const GAME = 'raffy-race';           // online room area
const ID = 'race-track';              // menu id (invites, together.js)
const SEND_EVERY = 1 / 15;
const DRAFT_EVERY = 0.1;              // host's half-drawn line is sent 10x a second
const REJOIN_KEY = 'raffy-race-room-v1';
const REJOIN_MS = 15 * 60 * 1000;     // come back within 15 min = rejoin straight away
const HOST_DOING = 'drawing the track';

function rememberRoom(code) {
  try { localStorage.setItem(REJOIN_KEY, JSON.stringify({ code, t: Date.now() })); } catch (e) { /* ignore */ }
}
function forgetRoom() {
  try { localStorage.removeItem(REJOIN_KEY); } catch (e) { /* ignore */ }
}
function rememberedRoom() {
  try {
    const r = JSON.parse(localStorage.getItem(REJOIN_KEY));
    if (r && r.code && Date.now() - r.t < REJOIN_MS) return r.code;
  } catch (e) { /* ignore */ }
  return null;
}

function loadPlayers() {
  const def = [{ id: 'p1', color: COLORS[0], style: 'truck', decal: 'none', controls: 'arrows' }];
  try {
    const p = JSON.parse(localStorage.getItem(PLAYERS_KEY));
    if (Array.isArray(p) && p.length && p.length <= 2) return p;
  } catch (e) { /* ignore */ }
  return def;
}
function savePlayers(players) {
  try { localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); } catch (e) { /* ignore */ }
}

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const view = createCanvas(stage);
  const ui = document.createElement('div');
  ui.className = 'rt-ui';
  stage.appendChild(ui);
  const keys = createKeys();
  const R = createRenderer(view);

  const S = {
    phase: 'build',       // build | race | results | choose | saved | lobby
    back: 'build',        // where ↩️ goes from the saved screen
    track: null,
    items: [],
    players: loadPlayers(),
    customFor: null,      // player id whose customise box is open
    cpuOn: (() => { try { return localStorage.getItem(CPU_KEY) !== 'off'; } catch (e) { return true; } })(),
    raceItems: [],        // extras used in this race (+ automatic item boxes)
    race: null,
    stroke: null,
    drag: null,
    paused: false,
    doneAt: 0,
    time: 0,
    net: null,            // online room state, see goOnline()
    busy: false,          // waiting for the internet
    sad: 0,               // time to show 😢 until
    msg: '',              // friendly message with the 😢 (e.g. "That game has finished")
  };
  let engines = [];
  let acc = 0;

  // ---------- helpers ----------
  const $ = sel => ui.querySelector(sel);
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node.addEventListener('click', e => { e.stopPropagation(); sound.pop(); fn(e); });

  // the computer car joins when you play alone (not online)
  function cpuPlayer() {
    const used = S.players.map(p => p.color);
    return { id: 'cpu', cpu: true, name: '🤖', color: COLORS.find(c => !used.includes(c)) || '#757575', style: 'truck', decal: 'flames' };
  }
  const cpuPlaying = () => !S.net && S.players.length === 1 && S.cpuOn;
  // my name (from the main menu) goes on the first car; with a robot to race, everyone gets a tag
  const named = () => S.players.map((p, i) => ({ ...p, name: i === 0 ? myName() : '' }));
  const racers = () => (S.net ? roster() : cpuPlaying() ? [...named(), cpuPlayer()] : named());
  function setCpu(on) {
    S.cpuOn = on;
    try { localStorage.setItem(CPU_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    render();
  }

  function previewCars() {
    if (!S.track) return [];
    return createRace(S.track, racers()).cars;
  }

  // ---------- screens ----------
  function render() {
    ui.innerHTML = '';
    touches.clear();
    finger = null;
    if (PHONE() && S.players.length > 1 && !S.race) { S.players.length = 1; S.customFor = null; savePlayers(S.players); syncMyPlayers(); }
    if (S.phase === 'build') buildUI();
    if (S.phase === 'race' || S.phase === 'results') raceUI();
    if (S.phase === 'results') resultsUI();
    if (S.phase === 'choose') chooseUI();
    if (S.phase === 'saved') savedUI();
    if (S.phase === 'lobby') lobbyUI();
    if (S.net && S.phase === 'build') badgeUI();
    if (S.net && S.net.status === 'waiting' && S.phase !== 'build' && S.phase !== 'lobby') ui.appendChild(el(`<div class="rt-netwait">📶⏳</div>`));
    if (S.busy) ui.appendChild(el(`<div class="rt-overlay"><div class="rt-wait">⏳</div></div>`));
    if (S.time < S.sad) ui.appendChild(el(`<div class="rt-overlay rt-sad"><div class="rt-wait">😢</div>${S.msg ? `<div class="rt-msg">${S.msg}</div>` : ''}</div>`));
    if (!S.rotateOk) { // only shows on a phone held upright (CSS); tap to carry on anyway
      const r = el(`<div class="rt-rotate"><span>📱</span></div>`);
      r.addEventListener('click', () => { S.rotateOk = true; r.remove(); });
      ui.appendChild(r);
    }
  }

  function buildUI() {
    const top = el(`<div class="rt-top">
      ${S.net ? '' : togetherButton('Play with friends', 'small')}
      <button class="rt-btn rt-saved" title="Saved tracks">${icon('gallery')}</button>
      <button class="rt-btn rt-clear" title="Clear">${icon('trash')}</button></div>`);
    click(top.querySelector('.rt-clear'), () => { S.track = null; S.items = []; sceneChanged(); render(); });
    click(top.querySelector('.rt-saved'), () => openSaved('build'));
    const on = top.querySelector('[data-together]');
    if (on) click(on, hostRoom);
    ui.appendChild(top);

    const bar = el(`<div class="rt-bar"></div>`);
    // players
    const pl = el(`<div class="rt-panel rt-players"></div>`);
    S.players.forEach((p, i) => {
      const card = el(`
        <div class="rt-player">
          <canvas width="120" height="72"></canvas>
          <div class="rt-keys">${keyHTML(p.controls)}</div>
          ${i > 0 ? `<button class="rt-x">${icon('close')}</button>` : ''}
        </div>`);
      drawCarIcon(card.querySelector('canvas'), p);
      click(card, () => { S.customFor = S.customFor === p.id ? null : p.id; render(); });
      const x = card.querySelector('.rt-x');
      if (x) click(x, () => { S.players.splice(i, 1); S.customFor = null; savePlayers(S.players); syncMyPlayers(); render(); });
      pl.appendChild(card);
    });
    if (cpuPlaying()) {
      const bot = el(`<div class="rt-player rt-cpu"><canvas width="120" height="72"></canvas><div class="rt-robot">🤖</div><button class="rt-x">${icon('close')}</button></div>`);
      drawCarIcon(bot.querySelector('canvas'), cpuPlayer());
      click(bot.querySelector('.rt-x'), () => setCpu(false));
      pl.appendChild(bot);
    } else if (!S.net && S.players.length === 1) {
      const bot = el(`<button class="rt-player rt-add rt-cpu-add"><canvas width="120" height="72"></canvas><div class="rt-plus">🤖</div></button>`);
      drawCarIcon(bot.querySelector('canvas'), { color: '#bdbdbd', style: 'truck' });
      click(bot, () => setCpu(true));
      pl.appendChild(bot);
    }
    if (S.players.length < 2 && !PHONE()) {
      const add = el(`<button class="rt-player rt-add"><canvas width="120" height="72"></canvas><div class="rt-plus">${icon('plus')}</div></button>`);
      drawCarIcon(add.querySelector('canvas'), { color: '#bdbdbd', style: 'truck' });
      click(add, () => {
        const used = S.players.map(p => p.color);
        S.players.push({ id: 'p2', color: COLORS.find(c => !used.includes(c)), style: 'truck', decal: 'none', controls: 'wasd' });
        S.customFor = 'p2';
        savePlayers(S.players);
        syncMyPlayers();
        render();
      });
      pl.appendChild(add);
    }
    bar.appendChild(pl);

    // extras palette
    const pal = el(`<div class="rt-panel rt-palette ${S.track ? '' : 'off'}"></div>`);
    EXTRAS.forEach(type => {
      const b = el(`<div class="rt-extra" data-type="${type}"><canvas width="120" height="90"></canvas></div>`);
      drawItemIcon(b.querySelector('canvas'), type);
      b.addEventListener('pointerdown', e => {
        if (!S.track) return;
        e.preventDefault();
        const w = R.toWorld(e.clientX, e.clientY);
        S.drag = { item: { type, x: w.x, y: w.y, a: 0 }, existing: false };
        sound.pop();
        showBin(true);
      });
      pal.appendChild(b);
    });
    bar.appendChild(pal);

    const locked = S.net && notReady(netPeople()).length > 0; // a friend is still getting ready
    const go = el(`<button class="rt-go ${S.track ? '' : 'off'} ${locked ? 'tg-locked' : ''}">🏁</button>`);
    click(go, () => { if (S.track && !locked) (S.net ? hostStartRace() : startRace()); });
    bar.appendChild(go);
    ui.appendChild(bar);

    ui.appendChild(el(`<div class="rt-bin">${icon('trash')}</div>`));
    const who = S.players.find(p => p.id === S.customFor);
    if (who) customise(who);
  }

  function keyHTML(controls) {
    const [u, l, d, r] = KEY_LABELS[controls];
    return `<span></span><b>${u}</b><span></span><b>${l}</b><b>${d}</b><b>${r}</b>`;
  }

  // Pick colour, car type and sticker. Icons only.
  function customise(player) {
    const used = S.players.filter(p => p !== player).map(p => p.color);
    const pop = el(`<div class="rt-custom" style="--c:${player.color}">
      <div class="rt-opts rt-opt-colors"></div>
      <div class="rt-opts rt-opt-styles"></div>
      <div class="rt-opts rt-opt-decals"></div>
      <button class="rt-ok">${icon('check')}</button>
    </div>`);
    const set = (k, v) => { player[k] = v; savePlayers(S.players); syncMyPlayers(); render(); };
    COLORS.forEach(c => {
      const sw = el(`<button class="rt-swatch ${used.includes(c) ? 'taken' : ''} ${c === player.color ? 'on' : ''}" style="background:${c}"></button>`);
      click(sw, () => { if (!used.includes(c)) set('color', c); });
      pop.querySelector('.rt-opt-colors').appendChild(sw);
    });
    STYLES.forEach(st => {
      const b = el(`<button class="rt-opt ${player.style === st ? 'on' : ''}"><canvas width="104" height="84"></canvas></button>`);
      drawCarIcon(b.querySelector('canvas'), { ...player, style: st });
      click(b, () => set('style', st));
      pop.querySelector('.rt-opt-styles').appendChild(b);
    });
    DECALS.forEach(d => {
      const b = el(`<button class="rt-opt ${player.decal === d ? 'on' : ''}"><canvas width="104" height="84"></canvas></button>`);
      drawCarIcon(b.querySelector('canvas'), { ...player, decal: d });
      click(b, () => set('decal', d));
      pop.querySelector('.rt-opt-decals').appendChild(b);
    });
    click(pop.querySelector('.rt-ok'), () => { S.customFor = null; render(); });
    ui.appendChild(pop);
  }

  function showBin(on) {
    const b = $('.rt-bin');
    if (b) b.classList.toggle('show', on);
  }
  function overBin(e) {
    const b = $('.rt-bin');
    if (!b) return false;
    const r = b.getBoundingClientRect();
    return e.clientX > r.left - 20 && e.clientX < r.right + 20 && e.clientY > r.top - 20 && e.clientY < r.bottom + 20;
  }

  function raceUI() {
    const guest = S.net && !S.net.isHost;
    const top = el(guest
      ? `<div class="rt-top"><button class="rt-btn rt-leave" title="Leave">${icon('leave')}</button></div>`
      : `<div class="rt-top">
      <button class="rt-btn rt-again" title="Race again">${icon('retry')}</button>
      <button class="rt-btn rt-draw" title="Draw">${icon('edit')}</button>
    </div>`);
    if (guest) click(top.querySelector('.rt-leave'), () => leaveOnline());
    else {
      click(top.querySelector('.rt-again'), raceAgain);
      click(top.querySelector('.rt-draw'), () => { S.paused = !S.net; S.phase = 'choose'; render(); });
    }
    ui.appendChild(top);

    const hud = el(`<div class="rt-hud"></div>`);
    S.race.cars.forEach(c => {
      const row = el(`<div class="rt-row" data-id="${c.id}"><canvas width="60" height="36"></canvas>${c.cpu ? '<span class="rt-bot">🤖</span>' : ''}
        <div class="rt-dots">${Array.from({ length: LAPS }, () => '<i></i>').join('')}</div><span class="rt-item"></span><span class="rt-medal"></span></div>`);
      drawCarIcon(row.querySelector('canvas'), c);
      hud.appendChild(row);
    });
    ui.appendChild(hud);
    ui.appendChild(el(`<div class="rt-lights"><i></i><i></i><i></i></div>`));
    ui.appendChild(el(`<div class="rt-end">🏁 ⏳ <b></b></div>`));
    if (TOUCH && S.phase === 'race') touchUI();
  }

  // ---------- touch buttons (iPad) ----------
  const touches = new Map(); // pointerId -> { p: playerId, k: key }

  function touchUI() {
    const pad = (p, keys, cls) => {
      const d = el(`<div class="rt-pad ${cls}" style="--c:${p.color}">
        ${keys.map(k => `<button class="rt-tb rt-tb-${k}" data-k="${k}" data-p="${p.id}">${TOUCH_ICON[k]}</button>`).join('')}
      </div>`);
      return d;
    };
    const wrap = el(`<div class="rt-touch"></div>`);
    if (S.players.length === 1) {
      const mode = ctrlMode();
      const left = pad(S.players[0], mode === 'buttons' ? ['left', 'right'] : [], 'rt-pad-l');
      const mb = el(`<button class="rt-mode ${mode === 'tilt' && !tilt.listening ? 'ask' : ''}" aria-label="How to steer">${CTRL_ICON[mode]}</button>`);
      mb.addEventListener('click', () => {
        if (mode === 'tilt' && !tilt.listening) { startTilt().then(() => mb.classList.toggle('ask', !tilt.listening)); return; }
        const order = Object.keys(CTRL_ICON);
        setCtrl(order[(order.indexOf(mode) + 1) % order.length]);
      });
      left.prepend(mb);
      wrap.appendChild(left);
      wrap.appendChild(pad(S.players[0], mode === 'finger' ? ['fire'] : ['fire', 'down', 'up'], 'rt-pad-r'));
      if (mode === 'finger' && !S.fingerHint) { S.fingerHint = true; wrap.appendChild(el(`<div class="rt-finger-hint">👆</div>`)); }
      if (mode === 'tilt') startTilt();
    } else {
      wrap.appendChild(pad(S.players[0], ['left', 'right', 'fire', 'down', 'up'], 'rt-pad-l rt-pad-4'));
      wrap.appendChild(pad(S.players[1], ['left', 'right', 'fire', 'down', 'up'], 'rt-pad-r rt-pad-4'));
    }
    ui.appendChild(wrap);
  }

  // ---------- steering mode: finger / tilt / buttons ----------
  let finger = null; // { id, x, y } screen point the car drives towards
  let tilt = { on: false, val: 0, zero: null };
  function ctrlMode() {
    if (S.players.length > 1) return 'buttons';
    let m = null;
    try { m = localStorage.getItem(CTRL_KEY); } catch (e) { /* private mode */ }
    return CTRL_ICON[m] ? m : PHONE() ? 'finger' : 'buttons';
  }
  function setCtrl(m) {
    try { localStorage.setItem(CTRL_KEY, m); } catch (e) { /* private mode */ }
    sound.pop();
    tilt.zero = null;
    render();
  }
  const onTilt = e => {
    if (e.beta == null) return;
    const ang = (screen.orientation && screen.orientation.angle) ?? window.orientation ?? 0;
    const v = ang === 90 ? e.beta : (ang === -90 || ang === 270) ? -e.beta : ang === 180 ? -e.gamma : e.gamma;
    if (tilt.zero === null) tilt.zero = Math.abs(ang) === 90 || ang === 270 ? 0 : v; // landscape: flat = straight
    tilt.val = v - tilt.zero;
    tilt.on = true;
  };
  async function startTilt() {
    if (tilt.listening) return;
    try {
      // iPhone/iPad ask first (needs a tap: the 📱 button is that tap)
      if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== 'granted') { setCtrl('buttons'); return; }
      }
    } catch (e) { /* not from a tap yet: the 📱 button asks again */ return; }
    tilt.listening = true;
    window.addEventListener('deviceorientation', onTilt);
    const b = ui.querySelector('.rt-mode'); if (b) b.classList.remove('ask');
  }
  // turn towards a world point: returns { steer -1..1, up, down }
  function steerTo(car, tx, ty) {
    const want = Math.atan2(ty - car.y, tx - car.x);
    let d = want - car.a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    const dist = Math.hypot(tx - car.x, ty - car.y);
    return { steer: Math.max(-1, Math.min(1, d * 2.2)), up: dist > 35, down: false };
  }
  function myCar(p) {
    if (!S.race) return null;
    const id = S.net ? pidOf(p) : p.id;
    return S.race.cars.find(c => c.id === id);
  }
  view.canvas.addEventListener('pointerdown', e => {
    if (S.phase !== 'race' || ctrlMode() !== 'finger') return;
    finger = { id: e.pointerId, x: e.clientX, y: e.clientY };
    const h = ui.querySelector('.rt-finger-hint'); if (h) h.remove();
  });
  const onFingerMove = e => { if (finger && finger.id === e.pointerId) { finger.x = e.clientX; finger.y = e.clientY; } };
  const onFingerUp = e => { if (finger && finger.id === e.pointerId) finger = null; };
  window.addEventListener('pointermove', onFingerMove);
  window.addEventListener('pointerup', onFingerUp);
  window.addEventListener('pointercancel', onFingerUp);

  function markTouches() {
    const on = [...touches.values()];
    ui.querySelectorAll('.rt-tb').forEach(b => {
      b.classList.toggle('on', on.some(t => t.p === b.dataset.p && t.k === b.dataset.k));
    });
  }

  ui.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest('.rt-tb');
    if (!b) return;
    e.preventDefault();
    touches.set(e.pointerId, { p: b.dataset.p, k: b.dataset.k });
    markTouches();
  });
  const onTouchMove = e => {
    const t = touches.get(e.pointerId);
    if (!t) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const b = hit && hit.closest && hit.closest('.rt-tb');
    if (b && b.dataset.p === t.p && b.dataset.k !== t.k) { t.k = b.dataset.k; markTouches(); }
  };
  const onTouchEnd = e => {
    if (touches.delete(e.pointerId)) markTouches();
  };
  window.addEventListener('pointermove', onTouchMove);
  window.addEventListener('pointerup', onTouchEnd);
  window.addEventListener('pointercancel', onTouchEnd);
  ui.addEventListener('contextmenu', e => e.preventDefault());

  function updateHUD() {
    if (!S.race) return;
    const places = standings(S.race);
    S.race.cars.forEach(c => {
      const row = ui.querySelector(`.rt-row[data-id="${c.id}"]`);
      if (!row) return;
      const done = lapsDone(c);
      row.querySelectorAll('i').forEach((d, i) => {
        d.className = i < done ? 'on' : (i === done && !c.finished ? 'now' : '');
      });
      row.querySelector('.rt-medal').textContent = c.finished ? MEDALS[places.indexOf(c)] || '🏅' : '';
      const slot = row.querySelector('.rt-item');
      const icon = !c.item ? '' : c.rollT > 0 ? ITEM_ICON[PICKUPS[Math.floor(S.time * 12) % PICKUPS.length]] : ITEM_ICON[c.item];
      if (slot.textContent !== icon) slot.textContent = icon;
      slot.classList.toggle('ready', !!c.item && c.rollT <= 0);
    });
    const end = $('.rt-end');
    if (end) {
      const r = S.race;
      const show = r.phase === 'racing' && r.cars.some(c => c.finished) && !r.cars.every(c => c.finished);
      end.classList.toggle('show', show);
      if (show) end.querySelector('b').textContent = Math.max(1, Math.ceil(r.endTimer));
    }
    const lights = $('.rt-lights');
    if (lights) {
      const r = S.race;
      const show = r.phase === 'countdown' || (r.goT >= 0 && r.t - r.goT < 0.8);
      lights.classList.toggle('show', show);
      const n = r.phase === 'countdown' ? Math.ceil(r.countdown) : 0;
      lights.querySelectorAll('i').forEach((d, i) => {
        d.className = n === 0 ? 'green' : (i < 4 - n ? 'red' : '');
      });
    }
  }

  function resultsUI() {
    const list = standings(S.race);
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-trophy">🏆</div>
      <div class="rt-podium"></div>
      <div class="rt-actions">${S.net && !S.net.isHost
        ? '<div class="rt-wait rt-wait-small">⏳</div>'
        : `<button class="rt-big rt-again2">${icon('retry')}</button><button class="rt-big rt-draw2">${icon('edit')}</button>`}
      </div></div></div>`);
    list.forEach((c, i) => {
      const row = el(`<div class="rt-place"><span>${c.finished ? MEDALS[i] || '🏅' : '🐢'}</span><canvas width="120" height="72"></canvas>${c.name ? `<b class="rt-name">${c.name}</b>` : ''}</div>`);
      drawCarIcon(row.querySelector('canvas'), c);
      box.querySelector('.rt-podium').appendChild(row);
    });
    if (box.querySelector('.rt-again2')) {
      click(box.querySelector('.rt-again2'), raceAgain);
      click(box.querySelector('.rt-draw2'), () => { S.phase = 'choose'; render(); });
    }
    ui.appendChild(box);
  }

  function chooseUI() {
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-actions">
        <button class="rt-choice rt-edit"><canvas width="240" height="150"></canvas><span>✏️</span></button>
        <button class="rt-choice rt-fresh"><div class="rt-blank"></div><span>✨</span></button>
        <button class="rt-choice rt-open"><div class="rt-blank rt-gallery">🖼️</div><span>⭐</span></button>
      </div>
      <button class="rt-btn rt-back">${icon('back')}</button>
    </div></div>`);
    R.thumb(box.querySelector('canvas'));
    click(box.querySelector('.rt-edit'), () => toBuild(false));
    click(box.querySelector('.rt-fresh'), () => toBuild(true));
    click(box.querySelector('.rt-open'), () => openSaved('choose'));
    click(box.querySelector('.rt-back'), () => {
      S.paused = false;
      S.phase = S.race && S.race.phase === 'done' ? 'results' : 'race';
      render();
    });
    ui.appendChild(box);
  }

  // ---------- saved tracks ----------
  function openSaved(from) {
    S.back = from;
    S.phase = 'saved';
    render();
  }

  function savedUI() {
    const list = loadSaved();
    const box = el(`<div class="rt-overlay"><div class="rt-card rt-saved-card">
      <button class="rt-btn rt-back">${icon('back')}</button>
      <div class="rt-gallery-grid"></div>
    </div></div>`);
    const grid = box.querySelector('.rt-gallery-grid');
    if (!list.length) grid.appendChild(el(`<div class="rt-empty">🏁 ➜ 🖼️</div>`));
    list.forEach(s => {
      const card = el(`<div class="rt-saved-item ${s.fav ? 'fav' : ''}">
        <canvas width="240" height="150"></canvas>
        <button class="rt-star">${icon('star')}</button>
        <button class="rt-del">${icon('close')}</button>
        <button class="rt-del-yes">${icon('trash')}</button>
      </div>`);
      const track = trackFromJSON(s.pts);
      const items = resnapItems(s.items, track);
      drawTrackThumb(card.querySelector('canvas'), track, items);
      click(card, () => {
        stopEngines();
        S.race = null;
        S.paused = false;
        S.track = track;
        S.items = items;
        sceneChanged();
        R.resetRace();
        S.phase = 'build';
        if (S.net) S.net.room.setMeta({ state: 'build' });
        render();
      });
      click(card.querySelector('.rt-star'), () => { toggleFav(s.id); render(); });
      click(card.querySelector('.rt-del'), () => card.classList.toggle('asking'));
      click(card.querySelector('.rt-del-yes'), () => { deleteSaved(s.id); sound.bump(); render(); });
      grid.appendChild(card);
    });
    click(box.querySelector('.rt-back'), () => { S.phase = S.back; render(); });
    ui.appendChild(box);
  }

  // ---------- phase changes ----------
  function toBuild(fresh) {
    stopEngines();
    S.race = null;
    S.paused = false;
    if (fresh) { S.track = null; S.items = []; }
    sceneChanged();
    R.resetRace();
    S.phase = 'build';
    if (S.net) S.net.room.setMeta({ state: 'build' });
    render();
  }

  function raceAgain() {
    if (S.net) hostStartRace();
    else startRace();
  }

  // ---------- online ----------
  const pidOf = p => `${S.net.room.uid}_${p.id}`;
  const isMine = id => !!S.net && id.startsWith(S.net.room.uid + '_');

  function trackData() {
    if (!S.track) return null;
    return {
      pts: trackToJSON(S.track),
      items: S.items.map(({ type, x, y }) => ({ type, x: Math.round(x), y: Math.round(y) })),
    };
  }

  // the track or extras changed: redraw, and tell friends if we are hosting
  function sceneChanged() {
    R.setScene(S.track, S.items);
    if (S.net && S.net.isHost) S.net.room.setMeta({ track: trackData() });
  }

  // everyone in the room, in a fixed order (same on every device)
  function roster() {
    const used = new Set();
    return Object.entries(S.net.players)
      .sort((a, b) => (a[1].joined - b[1].joined) || (a[0] < b[0] ? -1 : 1))
      .slice(0, 6)
      .map(([id, p]) => {
        // two friends picked the same colour: the later one gets a free colour (same on every device)
        const color = used.has(p.color) ? (COLORS.find(c => !used.has(c)) || p.color) : p.color;
        used.add(color);
        return { id, color, style: p.style, decal: p.decal, name: cleanName(p.name) };
      });
  }

  function syncMyPlayers() {
    if (!S.net) return;
    const now = new Set();
    S.players.forEach((p, i) => {
      const id = pidOf(p);
      now.add(id);
      S.net.room.setPlayer(id, { ...playerInfo(S.net.isHost || S.net.ready), color: p.color, style: p.style || 'truck', decal: p.decal || 'none', name: i === 0 ? myName() : '', joined: S.net.joined + i });
    });
    S.net.synced.forEach(id => { if (!now.has(id)) S.net.room.setPlayer(id, null); });
    S.net.synced = now;
  }

  function goOnline(room) {
    S.net = { room, isHost: room.isHost, code: room.code, ready: false, meta: null, players: {}, live: {}, raceId: 0, trackKey: '', synced: new Set(), joined: room.now(), sendAcc: 0, unsubs: [], status: 'ok', draftAt: 0 };
    if (!room.isHost) { rememberRoom(room.code); joined(ID, room.code); }
    keepAwake(true);
    S.net.unsubs.push(room.onMeta(onMeta));
    if (room.onStatus) S.net.unsubs.push(room.onStatus(st => {
      if (!S.net || S.net.status === st) return;
      S.net.status = st;
      render();
    }));
    S.net.unsubs.push(room.onPlayers(p => {
      if (!S.net) return;
      S.net.players = p;
      if (['build', 'lobby'].includes(S.phase)) render();
    }));
    S.net.unsubs.push(room.onLive(l => { if (S.net) S.net.live = l; }));
    syncMyPlayers();
  }

  // "Play with friends": make a room and invite friends (or link up with friends first)
  async function hostRoom() {
    S.busy = true; render();
    try {
      const room = await playTogether(ID, () => createRoom(GAME, { state: 'build', raceId: 0, track: trackData() }));
      S.busy = false;
      if (!room) { render(); return; } // friends panel opened instead
      room.setMeta({ hostUid: room.uid });
      goOnline(room);
      S.phase = 'build';
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false;
      S.sad = S.time + 2;
      S.phase = 'build';
    }
    render();
  }

  async function tryJoin(code, silent = false) {
    S.busy = true; render();
    try {
      const room = await joinRoom(GAME, code);
      S.busy = false;
      if (!room) {
        forgetRoom();
        if (!silent) { S.msg = 'That game has finished'; S.sad = S.time + 2.5; sound.bump(); }
        render(); return;
      }
      goOnline(room);
      S.phase = 'lobby';
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false;
      if (!silent) { S.msg = ''; S.sad = S.time + 2; }
    }
    render();
  }

  function leaveOnline(gone = false) {
    if (!S.net) return;
    const net = S.net;
    S.net = null;
    forgetRoom();
    leftRoom();
    keepAwake(false);
    net.unsubs.forEach(u => u && u());
    net.room.leave();
    stopEngines();
    S.race = null;
    S.paused = false;
    R.setScene(S.track, S.items);
    R.resetRace();
    S.phase = 'build';
    if (gone) { S.msg = 'That game has finished'; S.sad = S.time + 2.5; }
    render();
  }

  function onMeta(m) {
    if (!S.net) return;
    if (!m) { leaveOnline(true); return; } // the host left
    S.net.meta = m;
    if (!S.net.isHost && m.track) {
      const key = JSON.stringify(m.track);
      if (key !== S.net.trackKey) {
        S.net.trackKey = key;
        S.track = trackFromJSON(m.track.pts);
        S.items = resnapItems(m.track.items || [], S.track);
        if (!S.race) R.setScene(S.track, S.items);
      }
    }
    if (m.state === 'race' && m.raceId !== S.net.raceId) startOnlineRace(m);
    if (m.state === 'build' && !S.net.isHost && S.phase !== 'lobby') {
      stopEngines();
      S.race = null;
      R.setScene(S.track, S.items);
      R.resetRace();
      S.phase = 'lobby';
      if (S.net.ready) { S.net.ready = false; syncMyPlayers(); } // get ready again for the next race
      render();
    }
  }

  function hostStartRace() {
    const n = S.net;
    saveTrack(S.track, S.items);
    n.room.setMeta({ state: 'race', raceId: ((n.meta && n.meta.raceId) || 0) + 1, startAt: n.room.now() + 3500, track: trackData() });
  }

  function startOnlineRace(m) {
    const n = S.net;
    n.raceId = m.raceId;
    if (!S.track) return;
    if (!n.isHost) saveTrack(S.track, S.items);
    stopEngines();
    R.setScene(S.track, S.items);
    S.raceItems = withAutoBoxes(S.track, S.items);
    S.race = createRace(S.track, roster());
    S.race.countdown = Math.max(0.01, (m.startAt - n.room.now()) / 1000);
    S.race.cars.forEach(c => { c.remote = !isMine(c.id); });
    S.paused = false;
    S.doneAt = 0;
    acc = 0;
    n.sendAcc = 0;
    R.resetRace();
    S.phase = 'race';
    engines = S.race.cars.map(c => (c.remote ? null : makeEngine()));
    render();
  }

  const r1 = v => Math.round(v * 10) / 10;
  function sendCars(dt) {
    const n = S.net;
    n.sendAcc += dt;
    if (n.sendAcc < SEND_EVERY) return;
    n.sendAcc = 0;
    for (const c of S.race.cars) {
      if (c.remote) continue;
      n.room.setLive(c.id, {
        r: n.raceId, t: n.room.now(),
        x: r1(c.x), y: r1(c.y), a: Math.round(c.a * 1000) / 1000, vx: Math.round(c.vx), vy: Math.round(c.vy),
        z: r1(c.z), air: c.air, up: c.up, on: c.onTrack, w: c.inWater, sk: Math.round(c.skid), sp: Math.round(c.speed),
        idx: c.idx, prog: c.prog, lap: c.lap, ld: c.lapsDone, fin: c.finished, ft: c.finished ? c.finishT : -1,
        bt: c.boostT > 0 ? 1 : 0, md: c.inMud ? 1 : 0, ic: c.onIce ? 1 : 0, spn: c.spinT > 0 ? 1 : 0,
        sh: S.race.shots.filter(o => o.owner === c.id).map(o => [o.id, r1(o.x), r1(o.y), Math.round(o.vx), Math.round(o.vy)]),
        bn: S.race.bananas.filter(o => o.owner === c.id).map(o => [o.id, r1(o.x), r1(o.y), Math.round(o.a * 100) / 100]),
        hit: [...S.race.hitIds].slice(-20),
      });
    }
  }

  // move friends' cars smoothly towards where they really are
  function applyRemote(dt) {
    const n = S.net;
    const k = 1 - Math.exp(-12 * dt);
    // friends' rockets and bananas, and the ones of ours they say they were hit by
    const shots = [], bananas = [], theyHit = new Set();
    for (const [id, s] of Object.entries(n.live)) {
      if (isMine(id) || !s || s.r !== n.raceId) continue;
      const age = Math.min(0.3, Math.max(0, (n.room.now() - s.t) / 1000));
      (s.sh || []).forEach(([sid, x, y, vx, vy]) => { if (!S.race.hitIds.has(sid)) shots.push({ id: sid, x: x + vx * age, y: y + vy * age, vx, vy }); });
      (s.bn || []).forEach(([sid, x, y, a]) => { if (!S.race.hitIds.has(sid)) bananas.push({ id: sid, x, y, a }); });
      (s.hit || []).forEach(h => theyHit.add(h));
    }
    S.race.remoteShots = shots;
    S.race.remoteBananas = bananas;
    if (theyHit.size) {
      S.race.shots = S.race.shots.filter(o => !theyHit.has(o.id));
      S.race.bananas = S.race.bananas.filter(o => !theyHit.has(o.id));
    }
    for (const c of S.race.cars) {
      if (!c.remote) continue;
      const s = n.live[c.id];
      if (!s || s.r !== n.raceId) continue;
      const age = Math.min(0.3, Math.max(0, (n.room.now() - s.t) / 1000));
      const tx = s.x + s.vx * age, ty = s.y + s.vy * age;
      if (Math.hypot(tx - c.x, ty - c.y) > 200) { c.x = tx; c.y = ty; c.a = s.a; }
      else {
        c.x += (tx - c.x) * k;
        c.y += (ty - c.y) * k;
        c.a += Math.atan2(Math.sin(s.a - c.a), Math.cos(s.a - c.a)) * k;
      }
      const justFinished = s.fin && !c.finished;
      Object.assign(c, {
        vx: s.vx, vy: s.vy, z: s.z, air: s.air, up: s.up, onTrack: s.on, inWater: s.w, skid: s.sk, speed: s.sp,
        idx: s.idx, prog: s.prog, lap: s.lap, lapsDone: s.ld || 0, finished: s.fin, finishT: s.ft >= 0 ? s.ft : undefined,
        boostT: s.bt ? 0.5 : 0, inMud: !!s.md, onIce: !!s.ic, spinT: s.spn ? 0.3 : 0,
      });
      if (justFinished) { R.burst(c.x, c.y, '255,215,0', 30); finishToast(c); }
    }
  }

  // keep the iPad screen on while playing online
  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && !wakeLock && navigator.wakeLock && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      } else if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) { /* not supported */ }
  }
  const onVisible = () => { if (S.net && document.visibilityState === 'visible') keepAwake(true); };
  document.addEventListener('visibilitychange', onVisible);

  // host: send the half-drawn line / dragged extra so friends can watch
  function sendDraft(force) {
    const n = S.net;
    if (!n || !n.isHost) return;
    if (!force && S.time - n.draftAt < DRAFT_EVERY) return;
    n.draftAt = S.time;
    let draft = null;
    if (S.stroke && S.stroke.length > 1) {
      const step = Math.ceil(S.stroke.length / 300);
      draft = { stroke: S.stroke.filter((_, i) => i % step === 0 || i === S.stroke.length - 1).map(p => [Math.round(p.x), Math.round(p.y)]) };
    } else if (S.drag) {
      const it = S.drag.item;
      draft = { drag: { type: it.type, x: Math.round(it.x), y: Math.round(it.y), a: 0 } };
    }
    if (!draft && !n.draftSent) return;
    n.draftSent = !!draft;
    n.room.setMeta({ draft });
  }
  function guestDraft() {
    const d = S.net && !S.net.isHost && S.phase === 'lobby' && S.net.meta && S.net.meta.draft;
    if (!d) return {};
    return {
      stroke: d.stroke ? d.stroke.map(([x, y]) => ({ x, y })) : null,
      drag: d.drag || null,
    };
  }

  // who's here and what they're doing (same strip in every game, together.js)
  function netPeople() {
    if (!S.net) return [];
    const hostUid = S.net.isHost ? S.net.room.uid : S.net.meta && S.net.meta.hostUid;
    return people(S.net.players, hostUid);
  }
  function badgeUI() {
    const list = netPeople();
    const wait = S.net.status === 'waiting' ? '<span class="rt-badge-wait">📶⏳</span>' : '';
    const label = S.net.isHost && notReady(list).length ? `<div class="rt-golabel">${startLabel(list)}</div>` : '';
    const b = el(`<div class="rt-badge">${lobbyHTML(list, { hostDoing: HOST_DOING, myUid: S.net.room.uid })}${wait}<button class="rt-btn rt-leave" title="Leave">${icon('leave')}</button>${label}</div>`);
    click(b.querySelector('.rt-leave'), () => leaveOnline());
    ui.appendChild(b);
  }

  // friend: watch the host draw, do up your car, then press I'm ready
  function lobbyUI() {
    badgeUI();
    const list = netPeople();
    const host = list.find(p => p.host);
    const box = el(`<div class="rt-lobby">
      <div class="rt-mycars"><b>My car</b><div class="rt-mycar-row"></div></div>
      ${waitHTML(host, HOST_DOING, S.net.ready)}
    </div>`);
    S.players.forEach(p => {
      const c = el(`<button class="rt-mycar" title="Change my car"><canvas width="120" height="72"></canvas><span class="rt-mycar-pen">${icon('edit')}</span></button>`);
      drawCarIcon(c.querySelector('canvas'), p);
      click(c, () => { S.customFor = S.customFor === p.id ? null : p.id; render(); });
      box.querySelector('.rt-mycar-row').appendChild(c);
    });
    click(box.querySelector('[data-ready]'), () => { S.net.ready = !S.net.ready; syncMyPlayers(); render(); });
    ui.appendChild(box);
    const who = S.players.find(p => p.id === S.customFor);
    if (who) customise(who);
  }

  function startRace() {
    stopEngines();
    saveTrack(S.track, S.items);
    S.raceItems = withAutoBoxes(S.track, S.items);
    S.race = createRace(S.track, racers());
    S.paused = false;
    S.doneAt = 0;
    acc = 0;
    R.resetRace();
    S.phase = 'race';
    engines = S.race.cars.map(() => makeEngine());
    render();
  }

  // ---------- sounds ----------
  function makeEngine() {
    const a = audioCtx();
    if (!a) return null;
    const o = a.createOscillator();
    o.type = 'sawtooth';
    const f = a.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 500;
    const g = a.createGain();
    g.gain.value = 0;
    o.connect(f).connect(g).connect(a.destination);
    o.start();
    return {
      set(speed, on) {
        o.frequency.setTargetAtTime(40 + speed * 0.32, a.currentTime, 0.05);
        g.gain.setTargetAtTime(on ? 0.035 : 0, a.currentTime, 0.1);
      },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); o.stop(a.currentTime + 0.2); },
    };
  }
  function stopEngines() { engines.forEach(e => e && e.stop()); engines = []; }

  function handleEvents(events) {
    for (const e of events) {
      const car = e.id && S.race.cars.find(c => c.id === e.id);
      if (e.type === 'beep') sound.tone(440, 0.25, 'square', 0.12);
      if (e.type === 'go') sound.tone(880, 0.5, 'square', 0.14);
      if (e.type === 'lap') { sound.tone(660, 0.12, 'triangle'); setTimeout(() => sound.tone(990, 0.18, 'triangle'), 110); }
      if (e.type === 'finish') { sound.win(); R.burst(car.x, car.y, '255,215,0', 30); finishToast(car); }
      if (e.type === 'jump') sound.tone(300, 0.3, 'sine', 0.2, 800);
      if (e.type === 'land') { sound.bump(); R.dust(car.x, car.y); }
      if (e.type === 'bump') sound.bump();
      if (e.type === 'splash') { sound.splash(); R.splash(car.x, car.y); }
      if (e.type === 'boost') sound.whoosh();
      if (e.type === 'mud') sound.squelch();
      if (e.type === 'crash') { sound.bump(); R.dust(car.x, car.y); }
      if (e.type === 'cone') sound.tok();
      if (e.type === 'pickup') [0, 1, 2, 3, 4].forEach(k => setTimeout(() => sound.tone(500 + k * 120, 0.06, 'square', 0.08), k * 150));
      if (e.type === 'use' && e.item === 'rocket') sound.tone(250, 0.3, 'sawtooth', 0.12, 700);
      if (e.type === 'use' && e.item === 'banana') sound.tone(400, 0.15, 'sine', 0.15, 200);
      if (e.type === 'hit') { sound.bump(); sound.tone(700, 0.4, 'triangle', 0.15, 200); R.pop(car.x, car.y); }
      if (e.type === 'pop') R.pop(e.x, e.y);
      if (e.type === 'done') S.doneAt = S.time;
    }
  }

  // big medal pops up the moment a car crosses the line for the last time
  function finishToast(car) {
    const place = standings(S.race).indexOf(car);
    const t = el(`<div class="rt-toast"><span>${MEDALS[place] || '🏅'}</span><canvas width="120" height="80"></canvas></div>`);
    drawCarIcon(t.querySelector('canvas'), car);
    t.style.marginTop = (place * 110) + 'px';
    ui.appendChild(t);
    setTimeout(() => t.remove(), 1800);
  }

  // the crowd cheers when a car zooms past a grandstand
  const cheered = new Map();
  function crowd() {
    for (const it of S.items) {
      if (it.type !== 'stand') continue;
      if (S.time - (cheered.get(it) || -9) < 4) continue;
      if (S.race.cars.some(c => c.speed > 120 && Math.hypot(c.x - it.x, c.y - it.y) < 150)) { cheered.set(it, S.time); sound.cheer(); }
    }
  }

  function gatherInputs() {
    const inputs = {};
    const solo = S.players.length === 1;
    for (const p of S.players) {
      const src = CONTROLS[p.controls];
      inputs[p.id] = src ? src(keys) : {};
      if (solo) { // one player can use either set of keys
        const o = CONTROLS.wasd(keys);
        for (const k in o) inputs[p.id][k] = inputs[p.id][k] || o[k];
      }
    }
    for (const t of touches.values()) if (inputs[t.p]) inputs[t.p][t.k] = true;
    if (S.players.length === 1 && TOUCH) {
      const p = S.players[0], inp = inputs[p.id], car = myCar(p), mode = ctrlMode();
      if (car && mode === 'finger' && finger) {
        const w = R.toWorld(finger.x, finger.y);
        Object.assign(inp, steerTo(car, w.x, w.y));
      } else if (mode === 'tilt' && tilt.on && !inp.left && !inp.right) {
        const t = tilt.val, dead = 4, full = 22;
        inp.steer = Math.abs(t) < dead ? 0 : Math.sign(t) * Math.min(1, (Math.abs(t) - dead) / (full - dead));
      }
    }
    return inputs;
  }

  // online, our cars are called "<uid>_p1" instead of "p1"
  function onlineInputs() {
    const inputs = gatherInputs();
    if (S.race) for (const c of S.race.cars) if (c.cpu) inputs[c.id] = aiInput(c, S.race, S.track, STEP);
    if (!S.net) return inputs;
    const out = {};
    for (const p of S.players) out[pidOf(p)] = inputs[p.id];
    return out;
  }

  // ---------- phones: the camera zooms in and follows my car ----------
  function followCam() {
    if (!PHONE() || !S.race || S.phase !== 'race') { S.cam = null; return null; }
    const mine = S.players.map(myCar).filter(Boolean);
    if (!mine.length) return null;
    const x = mine.reduce((a, c) => a + c.x, 0) / mine.length;
    const y = mine.reduce((a, c) => a + c.y, 0) / mine.length;
    const car = mine[0];
    // look a little ahead of the car so you can see what's coming
    const ax = x + (car.vx || 0) * 0.35, ay = y + (car.vy || 0) * 0.35;
    if (!S.cam) S.cam = { x: ax, y: ay };
    const k = Math.min(1, (S._dt || 0.016) * 4);
    S.cam.x += (ax - S.cam.x) * k;
    S.cam.y += (ay - S.cam.y) * k;
    return { x: S.cam.x, y: S.cam.y, span: 620 };
  }

  // ---------- drawing the track with the mouse / finger ----------
  function hitItem(w) {
    let best = null, bd = 45;
    for (const it of S.items) {
      const d = Math.hypot(it.x - w.x, it.y - w.y);
      if (d < bd) { bd = d; best = it; }
    }
    return best;
  }

  view.canvas.addEventListener('pointerdown', e => {
    if (S.phase !== 'build') return;
    if (S.customFor) { S.customFor = null; render(); return; }
    const w = R.toWorld(e.clientX, e.clientY);
    const it = hitItem(w);
    if (it) {
      S.drag = { item: { ...it }, existing: it };
      S.items = S.items.filter(x => x !== it);
      R.setScene(S.track, S.items);
      showBin(true);
    } else {
      S.stroke = [w];
    }
  });

  const onMove = e => {
    if (S.phase !== 'build') return;
    const w = R.toWorld(e.clientX, e.clientY);
    if (S.stroke) {
      const last = S.stroke[S.stroke.length - 1];
      if (Math.hypot(w.x - last.x, w.y - last.y) > 6) S.stroke.push(w);
    }
    if (S.drag) {
      S.drag.item.x = w.x;
      S.drag.item.y = w.y;
      const b = $('.rt-bin');
      if (b) b.classList.toggle('hot', overBin(e));
    }
    if (S.stroke || S.drag) sendDraft(false);
  };

  const onUp = e => {
    if (S.phase !== 'build') return;
    if (S.stroke) {
      const t = buildTrack(S.stroke);
      S.stroke = null;
      if (t) {
        S.track = t;
        S.items = resnapItems(S.items, t);
        sceneChanged();
        sound.win();
        render();
      } else {
        sound.bump();
      }
    }
    if (S.drag) {
      const { item, existing } = S.drag;
      S.drag = null;
      showBin(false);
      if (!overBin(e)) {
        const placed = snapItem(S.track, item.type, item.x, item.y);
        const inside = item.x > 0 && item.y > 0 && item.x < WORLD.w && item.y < WORLD.h;
        if (placed && inside) { S.items.push(placed); sound.pop(); }
        else if (existing) S.items.push(existing); // put it back
      } else {
        sound.bump();
      }
      sceneChanged();
    }
    sendDraft(true);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  // ---------- main loop ----------
  const stopLoop = startLoop(dt => {
    S.time += dt;
    if (S.race && !S.paused) {
      acc += dt;
      while (acc >= STEP) {
        stepRace(S.race, S.track, S.raceItems, onlineInputs(), STEP);
        handleEvents(S.race.events);
        acc -= STEP;
      }
      if (S.net) { applyRemote(dt); sendCars(dt); }
      if (S.race.phase === 'racing') crowd();
      S.race.cars.forEach((c, i) => engines[i] && engines[i].set(c.speed, S.phase === 'race'));
      if (S.phase === 'race' && S.doneAt && S.time - S.doneAt > 0.6) {
        S.phase = 'results';
        render();
      }
      updateHUD();
    }
    if (S.paused) engines.forEach(e => e && e.set(0, false));
    S._dt = dt;
  }, () => {
    const building = S.phase === 'build';
    if (S.sad && S.time >= S.sad) { S.sad = 0; render(); }
    const gd = guestDraft();
    const cam = followCam();
    R.frame({
      insets: cam ? { top: 0, bottom: 0 } : building ? (PHONE() ? { top: 4, bottom: 84 } : { top: 8, bottom: 130 }) : { top: 70, bottom: TOUCH ? 40 : 8 },
      cam,
      cars: S.race ? S.race.cars : previewCars(),
      cones: S.race ? S.race.cones : undefined,
      boxes: S.race ? S.race.boxes : (S.track ? boxesFromItems(withAutoBoxes(S.track, S.items)) : []),
      shots: S.race ? [...S.race.shots, ...S.race.remoteShots] : [],
      bananas: S.race ? [...S.race.bananas, ...S.race.remoteBananas] : [],
      live: !!S.race && !S.paused,
      dt: S.paused ? 0 : (S._dt || 0),
      stroke: S.stroke || gd.stroke,
      drag: (S.drag && S.drag.item) || gd.drag,
      hint: building && !S.track && !S.stroke,
      time: S.time,
    });
  });

  R.setScene(null, []);
  render();
  const invited = takeJoinCode(ID); // came from a friend's "come and play" pop-up
  const again = rememberedRoom();
  if (invited) tryJoin(invited);
  else if (again) tryJoin(again, true); // came back (reload, 🏠 by mistake): rejoin straight away
  // friends coming / going: keep the strip up to date
  const unFriends = onFriends(() => { if (S.net && (S.phase === 'build' || S.phase === 'lobby') && !S.stroke && !S.drag) render(); });

  return () => {
    if (S.net) { S.net.unsubs.forEach(u => u && u()); S.net.room.leave(); S.net = null; leftRoom(); }
    unFriends();
    keepAwake(false);
    document.removeEventListener('visibilitychange', onVisible);
    stopLoop();
    stopEngines();
    keys.destroy();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('pointermove', onFingerMove);
    window.removeEventListener('pointerup', onFingerUp);
    window.removeEventListener('pointercancel', onFingerUp);
    window.removeEventListener('deviceorientation', onTilt);
    window.removeEventListener('pointermove', onTouchMove);
    window.removeEventListener('pointerup', onTouchEnd);
    window.removeEventListener('pointercancel', onTouchEnd);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
