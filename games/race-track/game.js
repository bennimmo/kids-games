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
import { createRoom, joinRoom, codeToPics, CODE_PICS, CODE_LEN } from '../../js/engine/net.js';
import { WORLD, buildTrack, snapItem, resnapItems, trackFromJSON, trackToJSON } from './track.js';
import { loadSaved, saveTrack, toggleFav, deleteSaved } from './saved.js';
import { createRace, stepRace, LAPS, lapsDone, standings } from './sim.js';
import { createRenderer, drawCarIcon, drawItemIcon, drawTrackThumb, STYLES, DECALS } from './render.js';

const COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00', '#8e24aa', '#ec407a', '#212121'];
const EXTRAS = ['jump', 'water', 'tunnel'];
const STEP = 1 / 60;
const MEDALS = ['🥇', '🥈', '🥉', '🏅'];

const CONTROLS = {
  arrows: k => ({ up: k.isDown('ArrowUp'), down: k.isDown('ArrowDown'), left: k.isDown('ArrowLeft'), right: k.isDown('ArrowRight') }),
  wasd: k => ({ up: k.isDown('KeyW'), down: k.isDown('KeyS'), left: k.isDown('KeyA'), right: k.isDown('KeyD') }),
};
const KEY_LABELS = { arrows: ['▲', '◀', '▼', '▶'], wasd: ['W', 'A', 'S', 'D'] };
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const TOUCH_ICON = { left: '◀', right: '▶', up: '▲', down: '▼' };
const PLAYERS_KEY = 'raffy-race-players-v1';
const GAME = 'raffy-race';
const SEND_EVERY = 1 / 15;

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
    phase: 'build',       // build | race | results | choose | saved | online | join | lobby
    back: 'build',        // where ↩️ goes from the saved screen
    track: null,
    items: [],
    players: loadPlayers(),
    customFor: null,      // player id whose customise box is open
    race: null,
    stroke: null,
    drag: null,
    paused: false,
    doneAt: 0,
    time: 0,
    net: null,            // online room state, see goOnline()
    busy: false,          // waiting for the internet
    sad: 0,               // time to show 😢 until
    joinCode: '',
  };
  let engines = [];
  let acc = 0;

  // ---------- helpers ----------
  const $ = sel => ui.querySelector(sel);
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node.addEventListener('click', e => { e.stopPropagation(); sound.pop(); fn(e); });

  function previewCars() {
    if (!S.track) return [];
    return createRace(S.track, S.net ? roster() : S.players).cars;
  }

  // ---------- screens ----------
  function render() {
    ui.innerHTML = '';
    touches.clear();
    if (S.phase === 'build') buildUI();
    if (S.phase === 'race' || S.phase === 'results') raceUI();
    if (S.phase === 'results') resultsUI();
    if (S.phase === 'choose') chooseUI();
    if (S.phase === 'saved') savedUI();
    if (S.phase === 'online') onlineUI();
    if (S.phase === 'join') joinUI();
    if (S.phase === 'lobby') lobbyUI();
    if (S.net && S.phase === 'build') badgeUI();
    if (S.busy) ui.appendChild(el(`<div class="rt-overlay"><div class="rt-wait">⏳</div></div>`));
    if (S.time < S.sad) ui.appendChild(el(`<div class="rt-overlay rt-sad"><div class="rt-wait">😢</div></div>`));
  }

  function buildUI() {
    const top = el(`<div class="rt-top">
      ${S.net ? '' : '<button class="rt-btn rt-online" title="Play with friends">🌍</button>'}
      <button class="rt-btn rt-saved" title="Saved tracks">🖼️</button>
      <button class="rt-btn rt-clear" title="Clear">🗑️</button></div>`);
    click(top.querySelector('.rt-clear'), () => { S.track = null; S.items = []; sceneChanged(); render(); });
    click(top.querySelector('.rt-saved'), () => openSaved('build'));
    const on = top.querySelector('.rt-online');
    if (on) click(on, () => { S.phase = 'online'; render(); });
    ui.appendChild(top);

    const bar = el(`<div class="rt-bar"></div>`);
    // players
    const pl = el(`<div class="rt-panel rt-players"></div>`);
    S.players.forEach((p, i) => {
      const card = el(`
        <div class="rt-player">
          <canvas width="120" height="72"></canvas>
          <div class="rt-keys">${keyHTML(p.controls)}</div>
          ${i > 0 ? '<button class="rt-x">✖</button>' : ''}
        </div>`);
      drawCarIcon(card.querySelector('canvas'), p);
      click(card, () => { S.customFor = S.customFor === p.id ? null : p.id; render(); });
      const x = card.querySelector('.rt-x');
      if (x) click(x, () => { S.players.splice(i, 1); S.customFor = null; savePlayers(S.players); syncMyPlayers(); render(); });
      pl.appendChild(card);
    });
    if (S.players.length < 2) {
      const add = el(`<button class="rt-player rt-add"><canvas width="120" height="72"></canvas><div class="rt-plus">➕</div></button>`);
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

    const go = el(`<button class="rt-go ${S.track ? '' : 'off'}">🏁</button>`);
    click(go, () => { if (S.track) (S.net ? hostStartRace() : startRace()); });
    bar.appendChild(go);
    ui.appendChild(bar);

    ui.appendChild(el(`<div class="rt-bin">🗑️</div>`));
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
      <button class="rt-ok">✔️</button>
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
      ? `<div class="rt-top"><button class="rt-btn rt-leave" title="Leave">🚪</button></div>`
      : `<div class="rt-top">
      <button class="rt-btn rt-again" title="Race again">🔁</button>
      <button class="rt-btn rt-draw" title="Draw">✏️</button>
    </div>`);
    if (guest) click(top.querySelector('.rt-leave'), () => leaveOnline());
    else {
      click(top.querySelector('.rt-again'), raceAgain);
      click(top.querySelector('.rt-draw'), () => { S.paused = !S.net; S.phase = 'choose'; render(); });
    }
    ui.appendChild(top);

    const hud = el(`<div class="rt-hud"></div>`);
    S.race.cars.forEach(c => {
      const row = el(`<div class="rt-row" data-id="${c.id}"><canvas width="60" height="36"></canvas>
        <div class="rt-dots">${Array.from({ length: LAPS }, () => '<i></i>').join('')}</div><span class="rt-medal"></span></div>`);
      drawCarIcon(row.querySelector('canvas'), c);
      hud.appendChild(row);
    });
    ui.appendChild(hud);
    ui.appendChild(el(`<div class="rt-lights"><i></i><i></i><i></i></div>`));
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
      wrap.appendChild(pad(S.players[0], ['left', 'right'], 'rt-pad-l'));
      wrap.appendChild(pad(S.players[0], ['down', 'up'], 'rt-pad-r'));
    } else {
      wrap.appendChild(pad(S.players[0], ['left', 'right', 'down', 'up'], 'rt-pad-l rt-pad-4'));
      wrap.appendChild(pad(S.players[1], ['left', 'right', 'down', 'up'], 'rt-pad-r rt-pad-4'));
    }
    ui.appendChild(wrap);
  }

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
      const done = lapsDone(c, S.track);
      row.querySelectorAll('i').forEach((d, i) => {
        d.className = i < done ? 'on' : (i === done && !c.finished ? 'now' : '');
      });
      row.querySelector('.rt-medal').textContent = c.finished ? MEDALS[places.indexOf(c)] || '🏅' : '';
    });
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
        : '<button class="rt-big rt-again2">🔁</button><button class="rt-big rt-draw2">✏️</button>'}
      </div></div></div>`);
    list.forEach((c, i) => {
      const row = el(`<div class="rt-place"><span>${c.finished ? MEDALS[i] || '🏅' : '🐢'}</span><canvas width="120" height="72"></canvas></div>`);
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
      <button class="rt-btn rt-back">↩️</button>
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
      <button class="rt-btn rt-back">↩️</button>
      <div class="rt-gallery-grid"></div>
    </div></div>`);
    const grid = box.querySelector('.rt-gallery-grid');
    if (!list.length) grid.appendChild(el(`<div class="rt-empty">🏁 ➜ 🖼️</div>`));
    list.forEach(s => {
      const card = el(`<div class="rt-saved-item ${s.fav ? 'fav' : ''}">
        <canvas width="240" height="150"></canvas>
        <button class="rt-star">⭐</button>
        <button class="rt-del">✖</button>
        <button class="rt-del-yes">🗑️</button>
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
    return Object.entries(S.net.players)
      .sort((a, b) => (a[1].joined - b[1].joined) || (a[0] < b[0] ? -1 : 1))
      .slice(0, 6)
      .map(([id, p]) => ({ id, color: p.color, style: p.style, decal: p.decal }));
  }

  function syncMyPlayers() {
    if (!S.net) return;
    const now = new Set();
    S.players.forEach((p, i) => {
      const id = pidOf(p);
      now.add(id);
      S.net.room.setPlayer(id, { color: p.color, style: p.style || 'truck', decal: p.decal || 'none', joined: S.net.joined + i });
    });
    S.net.synced.forEach(id => { if (!now.has(id)) S.net.room.setPlayer(id, null); });
    S.net.synced = now;
  }

  function goOnline(room) {
    S.net = { room, isHost: room.isHost, code: room.code, meta: null, players: {}, live: {}, raceId: 0, trackKey: '', synced: new Set(), joined: room.now(), sendAcc: 0, unsubs: [] };
    S.net.unsubs.push(room.onMeta(onMeta));
    S.net.unsubs.push(room.onPlayers(p => {
      if (!S.net) return;
      S.net.players = p;
      if (['build', 'lobby'].includes(S.phase)) render();
    }));
    S.net.unsubs.push(room.onLive(l => { if (S.net) S.net.live = l; }));
    syncMyPlayers();
  }

  async function hostRoom() {
    if (!S.track) return;
    S.busy = true; render();
    try {
      const room = await createRoom(GAME, { state: 'build', raceId: 0, track: trackData() });
      S.busy = false;
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

  async function tryJoin(code) {
    S.busy = true; render();
    try {
      const room = await joinRoom(GAME, code);
      S.busy = false;
      if (!room) { S.joinCode = ''; S.sad = S.time + 1.5; sound.bump(); render(); return; }
      goOnline(room);
      S.phase = 'lobby';
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false;
      S.joinCode = '';
      S.sad = S.time + 2;
    }
    render();
  }

  function leaveOnline(gone = false) {
    if (!S.net) return;
    const net = S.net;
    S.net = null;
    net.unsubs.forEach(u => u && u());
    net.room.leave();
    stopEngines();
    S.race = null;
    S.paused = false;
    R.setScene(S.track, S.items);
    R.resetRace();
    S.phase = 'build';
    if (gone) S.sad = S.time + 2;
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
        idx: c.idx, prog: c.prog, lap: c.lap, fin: c.finished, ft: c.finished ? c.finishT : -1,
      });
    }
  }

  // move friends' cars smoothly towards where they really are
  function applyRemote(dt) {
    const n = S.net;
    const k = 1 - Math.exp(-12 * dt);
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
      if (s.fin && !c.finished) R.burst(c.x, c.y, '255,215,0', 30);
      Object.assign(c, {
        vx: s.vx, vy: s.vy, z: s.z, air: s.air, up: s.up, onTrack: s.on, inWater: s.w, skid: s.sk, speed: s.sp,
        idx: s.idx, prog: s.prog, lap: s.lap, finished: s.fin, finishT: s.ft >= 0 ? s.ft : undefined,
      });
    }
  }

  function picsHTML(code) {
    return `<div class="rt-code">${codeToPics(code).map(p => `<span>${p}</span>`).join('')}</div>`;
  }
  function carsHTML() {
    return `<div class="rt-room-cars">${roster().map(() => '<canvas width="100" height="70"></canvas>').join('')}</div>`;
  }
  function fillCars(node) {
    const list = roster();
    node.querySelectorAll('.rt-room-cars canvas').forEach((c, i) => drawCarIcon(c, list[i]));
  }

  // host: code + who is here, shown on the drawing screen
  function badgeUI() {
    const b = el(`<div class="rt-badge">${picsHTML(S.net.code)}${carsHTML()}<button class="rt-btn rt-leave">🚪</button></div>`);
    fillCars(b);
    click(b.querySelector('.rt-leave'), () => leaveOnline());
    ui.appendChild(b);
  }

  function onlineUI() {
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-actions">
        <button class="rt-choice rt-host ${S.track ? '' : 'off'}"><canvas width="240" height="150"></canvas><span>🌍</span></button>
        <button class="rt-choice rt-join"><div class="rt-blank rt-gallery">🔑</div><span>🌍</span></button>
      </div>
      <button class="rt-btn rt-back">↩️</button>
    </div></div>`);
    if (S.track) R.thumb(box.querySelector('canvas'));
    click(box.querySelector('.rt-host'), () => { if (S.track) hostRoom(); });
    click(box.querySelector('.rt-join'), () => { S.joinCode = ''; S.phase = 'join'; render(); });
    click(box.querySelector('.rt-back'), () => { S.phase = 'build'; render(); });
    ui.appendChild(box);
  }

  function joinUI() {
    const slots = Array.from({ length: CODE_LEN }, (_, i) => i).map(i => `<span>${S.joinCode[i] !== undefined ? CODE_PICS[parseInt(S.joinCode[i], 16)] : ''}</span>`).join('');
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-code rt-slots">${slots}</div>
      <div class="rt-keypad">${CODE_PICS.map((p, i) => `<button data-h="${i.toString(16)}">${p}</button>`).join('')}</div>
      <button class="rt-btn rt-del-pic">⌫</button>
      <button class="rt-btn rt-back">↩️</button>
    </div></div>`);
    box.querySelectorAll('.rt-keypad button').forEach(b => click(b, () => {
      if (S.joinCode.length >= CODE_LEN) return;
      S.joinCode += b.dataset.h;
      if (S.joinCode.length === CODE_LEN) tryJoin(S.joinCode);
      else render();
    }));
    click(box.querySelector('.rt-del-pic'), () => { S.joinCode = S.joinCode.slice(0, -1); render(); });
    click(box.querySelector('.rt-back'), () => { S.phase = 'online'; render(); });
    ui.appendChild(box);
  }

  // guest: waiting for the host to start
  function lobbyUI() {
    const box = el(`<div class="rt-overlay rt-lobby"><div class="rt-card">
      ${picsHTML(S.net.code)}
      ${carsHTML()}
      <div class="rt-wait rt-wait-small">⏳</div>
      <button class="rt-btn rt-back rt-leave">🚪</button>
    </div></div>`);
    fillCars(box);
    click(box.querySelector('.rt-leave'), () => leaveOnline());
    ui.appendChild(box);
  }

  function startRace() {
    stopEngines();
    saveTrack(S.track, S.items);
    S.race = createRace(S.track, S.players);
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
      if (e.type === 'finish') { sound.win(); R.burst(car.x, car.y, '255,215,0', 30); }
      if (e.type === 'jump') sound.tone(300, 0.3, 'sine', 0.2, 800);
      if (e.type === 'land') { sound.bump(); R.dust(car.x, car.y); }
      if (e.type === 'bump') sound.bump();
      if (e.type === 'splash') { sound.splash(); R.splash(car.x, car.y); }
      if (e.type === 'done') S.doneAt = S.time;
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
    return inputs;
  }

  // online, our cars are called "<uid>_p1" instead of "p1"
  function onlineInputs() {
    const inputs = gatherInputs();
    if (!S.net) return inputs;
    const out = {};
    for (const p of S.players) out[pidOf(p)] = inputs[p.id];
    return out;
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
        stepRace(S.race, S.track, S.items, onlineInputs(), STEP);
        handleEvents(S.race.events);
        acc -= STEP;
      }
      if (S.net) { applyRemote(dt); sendCars(dt); }
      S.race.cars.forEach((c, i) => engines[i] && engines[i].set(c.speed, S.phase === 'race'));
      if (S.phase === 'race' && S.doneAt && S.time - S.doneAt > 1.2) {
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
    R.frame({
      insets: building ? { top: 8, bottom: 130 } : { top: 70, bottom: TOUCH ? 40 : 8 },
      cars: S.race ? S.race.cars : previewCars(),
      live: !!S.race && !S.paused,
      dt: S.paused ? 0 : (S._dt || 0),
      stroke: S.stroke,
      drag: S.drag && S.drag.item,
      hint: building && !S.track && !S.stroke,
      time: S.time,
    });
  });

  R.setScene(null, []);
  render();

  return () => {
    if (S.net) { S.net.unsubs.forEach(u => u && u()); S.net.room.leave(); S.net = null; }
    stopLoop();
    stopEngines();
    keys.destroy();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('pointermove', onTouchMove);
    window.removeEventListener('pointerup', onTouchEnd);
    window.removeEventListener('pointercancel', onTouchEnd);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
