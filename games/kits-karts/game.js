// Kit's Karts: draw a track (like Raffy Race), pick a theme, build your kart,
// then race it in 3D with mystery boxes, robots and split screen.
//
// Files: course.js (track + jumps/bridges), sim.js (physics + items), ai.js (robots),
// karts.js (kart options + 3D models), world.js (3D world), editor.js (2D designer),
// preview.js (garage viewer), themes.js.
import * as THREE from '../../js/vendor/three.module.min.js';
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { createKeys } from '../../js/engine/keys.js';
import { sound, audioCtx } from '../../js/engine/sound.js';
import { icon } from '../../js/engine/icons.js';
import { WORLD, buildTrack, snapItem, resnapItems, trackFromJSON, trackToJSON } from '../race-track/track.js';
import { makeCourse, smoothTrack, spreadTrack } from './course.js';
import { createRace, stepRace, standings, ITEMS, ITEM_LIST, zapAhead, boomAt } from './sim.js';
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { togetherButton, playTogether, takeJoinCode, joined, leftRoom, playerInfo, people, lobbyHTML, waitHTML, allReady, startLabel } from '../../js/engine/together.js';
import { aiInput } from './ai.js';
import { myName, cleanName } from '../../js/engine/profile.js';
import { THEMES, THEME_IDS, PLANT_ICON } from './themes.js';
import { createWorld, chaseCam } from './world.js';
import { createEditor, drawThumb, EXTRA_ICON } from './editor.js';
import { createPreview } from './preview.js';
import {
  COLORS, BODIES, WHEELS, DRIVERS, DRIVER_ICON, SPOILERS, SPOILER_ICON, TOPPERS, TOPPER_ICON,
  DECALS, DECAL_ICON, FLAMES, FLAME_COLORS, defaultLook, cleanLook, statsOf,
} from './karts.js';

const PREFS = 'kits-karts-v1';
const TRACKS = 'kits-karts-tracks-v1';
const EXTRAS = ['box', 'boost', 'jump', 'mud', 'ice', 'water', 'cone', 'tyres', 'tree', 'stand'];
const STEP = 1 / 60;
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const MEDALS = ['🥇', '🥈', '🥉'];
const ORD = n => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
const LEVELS = ['🐢', '🐇', '🚀'];
const LAP_CHOICES = [1, 2, 3, 5];
const P_COLORS = ['#ff3d6e', '#2ec4ff'];
const BOT_NAMES = ['Bolt', 'Zippy', 'Sparky', 'Gizmo', 'Nitro', 'Beep', 'Rusty'];
const GAME = 'kits-karts';
const SEND_EVERY = 1 / 15;
const MAX_KARTS = 8;
const NET_KINDS = ['banana', 'oil', 'rocket', 'ball', 'bomb'];

const CONTROLS = {
  arrows: k => ({ up: k.isDown('ArrowUp'), down: k.isDown('ArrowDown'), left: k.isDown('ArrowLeft'), right: k.isDown('ArrowRight'),
    fire: k.isDown('Enter') || k.isDown('ShiftRight') || k.isDown('Slash') || k.isDown('NumpadEnter') || k.isDown('ControlRight') }),
  wasd: k => ({ up: k.isDown('KeyW'), down: k.isDown('KeyS'), left: k.isDown('KeyA'), right: k.isDown('KeyD'),
    fire: k.isDown('Space') || k.isDown('ShiftLeft') || k.isDown('KeyE') || k.isDown('KeyQ') }),
};

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS)) || {}; } catch (e) { return {}; }
}
function loadTracks() {
  try { const l = JSON.parse(localStorage.getItem(TRACKS) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; }
}
function writeTracks(list) { try { localStorage.setItem(TRACKS, JSON.stringify(list)); } catch (e) { /* full */ } }

function botLook(k) {
  return cleanLook({
    body: BODIES[(k * 3 + 2) % BODIES.length].id, color: COLORS[(k * 5 + 3) % COLORS.length], color2: COLORS[(k * 7 + 9) % COLORS.length],
    wheels: WHEELS[(k * 2 + 1) % WHEELS.length].id, driver: DRIVERS[(k * 3 + 2) % DRIVERS.length], helmet: COLORS[(k * 4 + 1) % COLORS.length],
    spoiler: SPOILERS[k % SPOILERS.length], topper: TOPPERS[(k * 3 + 1) % TOPPERS.length], decal: DECALS[(k * 5 + 1) % DECALS.length],
    flame: FLAMES[k % FLAMES.length], num: 10 + k * 7,
  });
}

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  stage.innerHTML = '<div class="kk"><canvas class="kk-3d"></canvas><div class="kk-ed"></div><div class="kk-hud"></div><div class="kk-ui"></div></div>';
  const root = stage.querySelector('.kk');
  const canvas3d = root.querySelector('.kk-3d');
  const edWrap = root.querySelector('.kk-ed');
  const hud = root.querySelector('.kk-hud');
  const ui = root.querySelector('.kk-ui');
  const edView = createCanvas(edWrap);
  const editor = createEditor(edView);
  const keys = createKeys();
  const preview = createPreview();

  const prefs = loadPrefs();
  const S = {
    phase: 'build',      // build | saved | lobby | race | results
    theme: THEME_IDS.includes(prefs.theme) ? prefs.theme : 'country',
    players: (Array.isArray(prefs.players) && prefs.players.length ? prefs.players.slice(0, 2) : [{}]).map((p, i) => ({ id: 'p' + (i + 1), look: cleanLook(p.look, i), controls: i ? 'wasd' : 'arrows' })),
    bots: Number.isInteger(prefs.bots) ? Math.max(0, Math.min(6, prefs.bots)) : 3,
    level: Number.isInteger(prefs.level) ? Math.max(0, Math.min(2, prefs.level)) : 1,
    laps: LAP_CHOICES.includes(prefs.laps) ? prefs.laps : 3,
    tilt: typeof prefs.tilt === 'boolean' ? prefs.tilt : Math.min(screen.width, screen.height) < 600,
    track: null, modes: [], items: [], course: null,
    stroke: null, drag: null, garage: null, gTab: 'body', paused: false, time: 0,
    net: null, busy: false, sad: 0, ready: false, note: null,
  };
  function savePrefs() {
    hostSync();
    syncMyPlayers();
    if (S.net && !S.net.isHost) { try { localStorage.setItem(PREFS, JSON.stringify({ ...loadPrefs(), players: S.players.map(p => ({ look: p.look })) })); } catch (e) { /* ignore */ } return; }
    try { localStorage.setItem(PREFS, JSON.stringify({ theme: S.theme, players: S.players.map(p => ({ look: p.look })), bots: S.bots, level: S.level, laps: S.laps, tilt: S.tilt })); } catch (e) { /* ignore */ }
  }

  const $ = sel => ui.querySelector(sel);
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node && node.addEventListener('click', e => { e.stopPropagation(); sound.pop(); fn(e); });
  const kartImg = look => (preview ? `<img class="kk-kimg" src="${preview.snap(look)}" alt="">` : '<span class="kk-kemoji">🏎️</span>');

  function setCourse() {
    S.course = S.track ? makeCourse(S.track, S.modes) : null;
    if (S.course) S.items = resnapItems(S.items, S.track);
    editor.setScene(S.course, S.items, S.theme);
    hostSync();
  }

  // ------------------------------------------------------------ build screen
  function render() {
    ui.innerHTML = '';
    hud.innerHTML = '';
    touches.clear();
    root.classList.toggle('racing', S.phase === 'race' || S.phase === 'results');
    if (S.phase === 'build') buildUI();
    if (S.phase === 'saved') savedUI();
    if (S.phase === 'lobby') lobbyUI();
    if (S.net && (S.phase === 'build' || S.phase === 'lobby')) stripUI();
    if (S.note && S.time < S.note.until) ui.appendChild(el(`<div class="kk-note">${S.note.text}</div>`));
    if (S.net && S.net.status === 'waiting') ui.appendChild(el(`<div class="kk-netwait">📶⏳</div>`));
    if (S.busy) ui.appendChild(el(`<div class="ui-overlay kk-overlay"><div class="ui-panel kk-mini-panel"><div class="kk-wait">⏳</div><p class="ui-sub">One moment…</p></div></div>`));
    if (S.time < S.sad) ui.appendChild(el(`<div class="ui-overlay kk-overlay"><div class="ui-panel kk-mini-panel"><div class="kk-wait">😢</div><p class="ui-sub">That didn't work</p></div></div>`));
    if (S.phase === 'race' || S.phase === 'results') raceUI();
    if (S.phase === 'results') resultsUI();
    if (S.garage) garageUI();
  }

  function buildUI() {
    const top = el(`<div class="kk-top">
      <div class="kk-themes">${THEME_IDS.map(t => `<button class="kk-theme ${t === S.theme ? 'on' : ''}" data-t="${t}" title="${THEMES[t].name}">${THEMES[t].icon}</button>`).join('')}</div>
      <div class="kk-tools">
        ${S.net ? '' : togetherButton('Play with friends', 'small')}
        <button class="kk-btn ui-hud-btn kk-dice" title="Make me a track">${icon('dice')}</button>
        <button class="kk-btn ui-hud-btn kk-saved" title="Saved tracks">${icon('gallery')}</button>
        <button class="kk-btn ui-hud-btn kk-clear" title="Clear">${icon('trash')}</button>
      </div></div>`);
    top.querySelectorAll('.kk-theme').forEach(b => click(b, () => { S.theme = b.dataset.t; savePrefs(); setCourse(); render(); }));
    click(top.querySelector('.kk-dice'), randomTrack);
    click(top.querySelector('[data-together]'), hostRoom);
    click(top.querySelector('.kk-saved'), () => { S.phase = 'saved'; render(); });
    click(top.querySelector('.kk-clear'), () => { S.track = null; S.items = []; S.modes = []; setCourse(); render(); });
    ui.appendChild(top);

    const bar = el(`<div class="kk-bar"></div>`);
    const pl = el(`<div class="kk-panel kk-players"></div>`);
    S.players.forEach((p, i) => {
      const card = el(`<div class="kk-player" style="--pc:${P_COLORS[i]}">${kartImg(p.look)}<b>${pname(i)}</b>${i ? `<button class="kk-x">${icon('close')}</button>` : ''}<i>🔧</i></div>`);
      click(card, () => openGarage(i));
      click(card.querySelector('.kk-x'), () => { S.players.splice(i, 1); savePrefs(); render(); });
      pl.appendChild(card);
    });
    if (S.players.length < 2) {
      const add = el(`<button class="kk-player kk-add" title="Two players">${icon('plus')}<b>P2</b></button>`);
      click(add, () => { S.players.push({ id: 'p2', look: cleanLook(prefs.p2look, 1), controls: 'wasd' }); savePrefs(); openGarage(1); });
      pl.appendChild(add);
    }
    const bots = el(`<div class="kk-bots">
      <div class="kk-botrow"><button class="kk-mini kk-bminus">${icon('minus')}</button><span class="kk-bcount">🤖<b>${S.bots}</b></span><button class="kk-mini kk-bplus">${icon('plus')}</button></div>
      <div class="kk-botrow"><button class="kk-mini kk-level" title="How fast are the robots?">${LEVELS[S.level]}</button><button class="kk-mini kk-laps" title="Laps">🏁<b>${S.laps}</b></button></div>
    </div>`);
    click(bots.querySelector('.kk-bminus'), () => { S.bots = Math.max(0, S.bots - 1); savePrefs(); render(); });
    click(bots.querySelector('.kk-bplus'), () => { S.bots = Math.min(6, S.bots + 1); savePrefs(); render(); });
    click(bots.querySelector('.kk-level'), () => { S.level = (S.level + 1) % 3; savePrefs(); render(); });
    click(bots.querySelector('.kk-laps'), () => { S.laps = LAP_CHOICES[(LAP_CHOICES.indexOf(S.laps) + 1) % LAP_CHOICES.length]; savePrefs(); render(); });
    pl.appendChild(bots);
    bar.appendChild(pl);

    const pal = el(`<div class="kk-panel kk-palette ${S.track ? '' : 'off'}"></div>`);
    EXTRAS.forEach(type => {
      const icon = type === 'tree' ? (PLANT_ICON[THEMES[S.theme].plant] || '🌳') : EXTRA_ICON[type];
      const b = el(`<div class="kk-extra" data-type="${type}">${icon}</div>`);
      b.addEventListener('pointerdown', e => {
        if (!S.track) return;
        e.preventDefault();
        const w = editor.toWorld(e.clientX, e.clientY);
        S.drag = { item: { type, x: w.x, y: w.y, a: 0 }, existing: null };
        sound.pop();
        showBin(true);
      });
      pal.appendChild(b);
    });
    bar.appendChild(pal);
    // online: locked until every friend has pressed I'm ready
    const list = S.net ? people(S.net.players, S.net.room.uid) : [];
    const locked = S.net && list.length > 1 && !allReady(list);
    const go = el(`<button class="kk-go ${S.track ? '' : 'off'} ${locked ? 'tg-locked' : ''}">${icon('flag')}<span>Race</span></button>`);
    click(go, () => { askTilt(); if (S.track && !locked) (S.net ? hostStartRace() : startRace()); });
    bar.appendChild(go);
    if (locked) ui.appendChild(el(`<div class="kk-waitfor">⏳ ${startLabel(list)}</div>`));
    ui.appendChild(bar);
    ui.appendChild(el(`<div class="kk-bin">${icon('trash')}</div>`));
  }

  function showBin(on) { const b = $('.kk-bin'); if (b) b.classList.toggle('show', on); }
  function overBin(e) {
    const b = $('.kk-bin');
    if (!b) return false;
    const r = b.getBoundingClientRect();
    return e.clientX > r.left - 20 && e.clientX < r.right + 20 && e.clientY > r.top - 20 && e.clientY < r.bottom + 20;
  }

  // ------------------------------------------------------------ random track
  function randomTrack() {
    const cx = WORLD.w / 2, cy = WORLD.h / 2;
    const kind = Math.floor(Math.random() * 3);
    const raw = [];
    const N = 220;
    const ph = Math.random() * 6, wob = 0.12 + Math.random() * 0.12;
    for (let k = 0; k <= N + 8; k++) {
      const t = (k / N) * Math.PI * 2;
      let x, y;
      if (kind === 0) { x = cx + Math.sin(t) * 620; y = cy + Math.sin(t) * Math.cos(t) * 700; }           // figure of 8
      else if (kind === 1) { const r = 1 + Math.sin(t * 3 + ph) * wob + Math.sin(t * 5 + ph * 2) * wob * 0.5; x = cx + Math.cos(t) * 600 * r; y = cy + Math.sin(t) * 360 * r; }
      else { x = cx + Math.sin(t) * 640 + Math.sin(t * 3) * 60; y = cy + Math.sin(2 * t) * 320 + Math.cos(t * 3) * 40; } // wavy 8
      raw.push({ x, y });
    }
    const t0 = buildTrack(raw), t = t0 && smoothTrack(spreadTrack(smoothTrack(t0)), 3, 2);
    if (!t) return;
    S.track = t; S.modes = [];
    S.items = [];
    const n = t.n;
    const put = (type, f, side = 0) => {
      const p = t.pts[Math.floor(n * f) % n];
      const it = snapItem(t, type, p.x - Math.sin(p.a) * side, p.y + Math.cos(p.a) * side);
      if (it) S.items.push(it);
    };
    put('boost', 0.12); put('boost', 0.62);
    if (kind !== 0) put('jump', 0.4);
    put(['mud', 'ice', 'water'][Math.floor(Math.random() * 3)], 0.85);
    put('stand', 0.05, 110); put('tree', 0.3, 80); put('tree', 0.7, -80); put('tyres', 0.47, 75);
    setCourse();
    // keep extras off the jumps
    S.items = S.items.filter(it => it.idx < 0 || (S.course.jumpOf[it.idx] < 0));
    setCourse();
    sound.win();
    render();
  }

  // ------------------------------------------------------------ saved tracks
  function saveTrack() {
    const pts = trackToJSON(S.track);
    const items = S.items.map(({ type, x, y }) => ({ type, x: Math.round(x), y: Math.round(y) }));
    const key = JSON.stringify([pts, items]);
    let list = loadTracks();
    const same = list.find(s => JSON.stringify([s.pts, s.items]) === key);
    if (same) { same.t = Date.now(); same.theme = S.theme; same.modes = S.modes; }
    else list.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), pts, items, theme: S.theme, modes: S.modes, fav: false, t: Date.now() });
    const recent = list.filter(s => !s.fav).sort((a, b) => b.t - a.t);
    const drop = new Set(recent.slice(12).map(s => s.id));
    list = list.filter(s => !drop.has(s.id)).sort((a, b) => (b.fav - a.fav) || (b.t - a.t));
    writeTracks(list);
  }

  function savedUI() {
    const list = loadTracks();
    const box = el(`<div class="ui-overlay kk-overlay"><div class="ui-panel wide kk-saved-card">
      <div class="ui-kicker">Kit's Karts</div><h2 class="ui-title">Saved tracks</h2><p class="ui-sub">Tap a track to race it again. ⭐ keeps it.</p>
      <div class="kk-grid"></div>
      <div class="ui-row kk-foot"><button class="ui-btn ghost kk-back">${icon('back')}<span>Back</span></button></div></div></div>`);
    const grid = box.querySelector('.kk-grid');
    if (!list.length) grid.appendChild(el(`<div class="kk-empty ui-sub">No tracks yet. Draw one and race it!</div>`));
    list.forEach(s => {
      const card = el(`<div class="kk-saved-item ${s.fav ? 'fav' : ''}"><canvas width="240" height="150"></canvas><button class="kk-star">${icon('star')}</button><button class="kk-del">${icon('close')}</button><button class="kk-del-yes">${icon('trash')}</button></div>`);
      const track = trackFromJSON(s.pts);
      const items = resnapItems(s.items || [], track);
      const theme = THEME_IDS.includes(s.theme) ? s.theme : 'country';
      drawThumb(card.querySelector('canvas'), makeCourse(track, s.modes || []), items, theme);
      click(card, () => { S.track = track; S.items = items; S.modes = s.modes || []; S.theme = theme; setCourse(); S.phase = 'build'; render(); });
      click(card.querySelector('.kk-star'), () => { const l = loadTracks(); const x = l.find(q => q.id === s.id); if (x) x.fav = !x.fav; writeTracks(l.sort((a, b) => (b.fav - a.fav) || (b.t - a.t))); render(); });
      click(card.querySelector('.kk-del'), () => card.classList.toggle('asking'));
      click(card.querySelector('.kk-del-yes'), () => { writeTracks(loadTracks().filter(q => q.id !== s.id)); sound.bump(); render(); });
      grid.appendChild(card);
    });
    click(box.querySelector('.kk-back'), () => { S.phase = 'build'; render(); });
    ui.appendChild(box);
  }

  // ------------------------------------------------------------ garage
  function openGarage(i) { S.garage = { i }; render(); }

  const TABS = [['body', '🚗', 'Kart'], ['paint', '🎨', 'Paint'], ['wheels', '🛞', 'Wheels'], ['driver', '🧑', 'Driver'], ['extras', '✨', 'Extras']];
  function garageUI() {
    const p = S.players[S.garage.i];
    if (!p) { S.garage = null; return; }
    const L = p.look;
    const box = el(`<div class="ui-overlay kk-overlay kk-garage-wrap"><div class="ui-panel wide left kk-garage" style="--pc:${P_COLORS[S.garage.i]}">
      <div class="kk-ghead"><div class="ui-kicker">Kit's Karts</div><h2 class="ui-title">${pname(S.garage.i)}'s kart</h2></div>
      <div class="kk-gbody">
        <div class="kk-gleft"><div class="kk-gview"></div><div class="kk-stats"></div></div>
        <div class="kk-gright">
          <div class="ui-seg kk-tabs">${TABS.map(([id, ic, name]) => `<button class="kk-tab ${S.gTab === id ? 'on' : ''}" data-tab="${id}"><span>${ic}</span><span class="kk-tabname">${name}</span></button>`).join('')}</div>
          <div class="kk-opts"></div>
        </div>
      </div>
      <div class="ui-row end kk-foot"><button class="ui-btn go kk-ok">${icon('check')}<span>Done</span></button></div></div></div>`);
    if (preview) { box.querySelector('.kk-gview').appendChild(preview.canvas); preview.show(L); }
    const st = statsOf(L);
    box.querySelector('.kk-stats').innerHTML = [['⚡', 'Speed'], ['🚀', 'Pick-up'], ['🌀', 'Turning'], ['🏋️', 'Weight'], ['🌲', 'Off-road']].map(([ic, name], k) => `<div class="kk-stat"><span>${ic}</span><em>${name}</em><i>${Array.from({ length: 6 }, (_, j) => `<b class="${j < Math.round(st[k]) ? 'on' : ''}"></b>`).join('')}</i></div>`).join('');
    box.querySelectorAll('.kk-tab').forEach(b => click(b, () => { S.gTab = b.dataset.tab; render(); }));
    const opts = box.querySelector('.kk-opts');
    const set = (k, v) => { p.look = cleanLook({ ...p.look, [k]: v }, S.garage.i); savePrefs(); render(); };
    const row = (label, html) => { const r = el(`<div class="kk-orow">${label ? `<span class="kk-olabel">${label}</span>` : ''}<div class="kk-ochoices">${html}</div></div>`); opts.appendChild(r); return r; };
    const swatches = (k) => COLORS.map(c => `<button class="kk-sw ${L[k] === c ? 'on' : ''}" data-k="${k}" data-v="${c}" style="background:${c}"></button>`).join('');
    const iconBtns = (k, list, icons) => list.map(v => `<button class="kk-ob ${L[k] === v ? 'on' : ''}" data-k="${k}" data-v="${v}">${icons[v]}</button>`).join('');
    if (S.gTab === 'body') {
      row('', BODIES.map(b => `<button class="kk-ob kk-obig ${L.body === b.id ? 'on' : ''}" data-k="body" data-v="${b.id}">${kartImg({ ...L, body: b.id })}<small>${b.name}</small></button>`).join(''));
    }
    if (S.gTab === 'paint') {
      row('🎨', swatches('color'));
      row('〰️', swatches('color2'));
      row('', iconBtns('decal', DECALS, DECAL_ICON));
      if (L.decal === 'number') row('#️⃣', `<button class="kk-ob kk-numdown">${icon('minus')}</button><b class="kk-num">${L.num}</b><button class="kk-ob kk-numup">${icon('plus')}</button>`);
    }
    if (S.gTab === 'wheels') {
      if (L.body === 'hover') row('', '<div class="ui-sub kk-hovernote">🛸 Hover karts float, so no wheels needed.</div>');
      else row('', WHEELS.map(w => `<button class="kk-ob kk-obig ${L.wheels === w.id ? 'on' : ''}" data-k="wheels" data-v="${w.id}">${kartImg({ ...L, wheels: w.id })}<small>${w.icon}</small></button>`).join(''));
    }
    if (S.gTab === 'driver') {
      row('', iconBtns('driver', DRIVERS, DRIVER_ICON));
      row('⛑️', swatches('helmet'));
    }
    if (S.gTab === 'extras') {
      row('🪽', iconBtns('spoiler', SPOILERS, SPOILER_ICON));
      row('🎩', iconBtns('topper', TOPPERS, TOPPER_ICON));
      row('🔥', FLAMES.map(f => `<button class="kk-ob kk-flame ${L.flame === f ? 'on' : ''}" data-k="flame" data-v="${f}" style="background:${f === 'rainbow' ? 'linear-gradient(90deg,#f44,#fd0,#4f4,#4cf,#c4f)' : `radial-gradient(${FLAME_COLORS[f][0]},${FLAME_COLORS[f][1]})`}"></button>`).join(''));
    }
    opts.querySelectorAll('[data-k]').forEach(b => click(b, () => set(b.dataset.k, b.dataset.v)));
    click(opts.querySelector('.kk-numdown'), () => set('num', Math.max(1, L.num - 1)));
    click(opts.querySelector('.kk-numup'), () => set('num', Math.min(99, L.num + 1)));
    click(box.querySelector('.kk-ok'), () => { S.garage = null; render(); });
    box.addEventListener('click', e => { if (e.target === box) { S.garage = null; render(); } });
    ui.appendChild(box);
  }

  // ------------------------------------------------------------ 3D renderer
  let renderer = null, noGL = false;
  function getRenderer() {
    if (renderer || noGL) return renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, powerPreference: 'high-performance' });
    } catch (e) { noGL = true; return null; }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    return renderer;
  }

  // ------------------------------------------------------------ race
  let R = null; // { race, world, views:[{car, cam, hud}], engines }
  let acc = 0;

  function endRace() {
    if (!R) return;
    R.engines.forEach(e => e && e.stop());
    R.world.dispose();
    R = null;
  }

  // the first player on this device uses the name from the main menu
  function pname(i) { return (i === 0 && myName()) || 'P' + (i + 1); }

  function startRace() {
    const humans = S.players.map((p, i) => ({ id: p.id, name: pname(i), look: p.look }));
    const bots = Array.from({ length: S.bots }, (_, k) => ({ id: 'bot' + k, name: BOT_NAMES[k % BOT_NAMES.length], look: botLook(k + (S.theme.length * 3)), cpu: true, level: S.level }));
    // humans start at the back so there's someone to catch
    beginRace([...bots, ...humans], S.laps, humans.map(h => h.id));
  }

  // localIds: the car id for each of S.players (on this device)
  function beginRace(racers, laps, localIds, countdown) {
    const r3 = getRenderer();
    if (!r3) { alert('Sorry, this game needs 3D (WebGL).'); return false; }
    endRace();
    saveTrack();
    const theme = THEMES[S.theme];
    const race = createRace(S.course, S.items, racers, theme);
    race.laps = laps;
    if (countdown) race.countdown = countdown;
    if (S.net) race.cars.forEach(c => { c.remote = !isMine(c.id); });
    const world = createWorld(S.course, race.items, theme, { shadows: !location.search.includes('kklow') });
    race.cars.forEach(c => {
      const hi = localIds.indexOf(c.id);
      let tag = null;
      if (hi >= 0 && localIds.length > 1) tag = { text: pname(hi), color: P_COLORS[hi], layer: 10 + hi };
      else if (c.remote && !c.cpu) tag = { text: c.name || '🙂', color: c.look.color };
      world.addKart(c.id, c.look, tag);
    });
    const views = localIds.map((id, i) => ({ car: race.cars.find(c => c.id === id), cam: new THREE.PerspectiveCamera(70, 1, 2, 9000), i, first: true }));
    views.forEach((v, i) => localIds.forEach((_, j) => { if (j !== i) v.cam.layers.enable(10 + j); })); // see the other player's tag, not your own
    R = { race, world, views, localIds, engines: views.map(() => makeEngine()), msgs: views.map(() => ({ text: '', until: 0 })), mini: null };
    acc = 0;
    S.paused = false;
    S.phase = 'race';
    render();
    return true;
  }

  function layout() {
    const W = root.clientWidth, H = root.clientHeight;
    const n = R ? R.views.length : 1;
    if (n === 1) return [{ x: 0, y: 0, w: W, h: H }];
    if (W >= H) return [{ x: W / 2 + 2, y: 0, w: W / 2 - 2, h: H }, { x: 0, y: 0, w: W / 2 - 2, h: H }];
    return [{ x: 0, y: 0, w: W, h: H / 2 - 2 }, { x: 0, y: H / 2 + 2, w: W, h: H / 2 - 2 }];
  }

  function raceUI() {
    const rects = layout();
    R.views.forEach((v, i) => {
      const r = rects[i];
      const d = el(`<div class="kk-view" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;--pc:${P_COLORS[i]}">
        <div class="kk-item" data-p="${S.players[i] ? S.players[i].id : ''}" data-k="fire"><span></span></div>
        <div class="kk-place"></div>
        <div class="kk-lap"></div>
        <div class="kk-msg"></div>
        <div class="kk-big"></div>
        ${R.views.length > 1 ? `<div class="kk-who">P${i + 1}</div>` : ''}
      </div>`);
      hud.appendChild(d);
      v.hud = { root: d, item: d.querySelector('.kk-item'), itemS: d.querySelector('.kk-item span'), place: d.querySelector('.kk-place'), lap: d.querySelector('.kk-lap'), msg: d.querySelector('.kk-msg'), big: d.querySelector('.kk-big'), last: {} };
      if (TOUCH && S.phase === 'race') {
        const p = S.players[i];
        const pad = el(`<div class="kk-pad">
          <div><button class="kk-tb" data-p="${p.id}" data-k="left">${icon('left')}</button><button class="kk-tb" data-p="${p.id}" data-k="right">${icon('right')}</button></div>
          <div><button class="kk-tb kk-tb-s" data-p="${p.id}" data-k="down">${icon('down')}</button><button class="kk-tb kk-tb-fire" data-p="${p.id}" data-k="fire">💥</button></div>
        </div>`);
        d.appendChild(pad);
        if (R.views.length === 1) {
          const tb = el(`<button class="kk-tilt" title="Tilt to steer">${S.tilt ? '📱' : '👆'}</button>`);
          tb.addEventListener('pointerdown', e => {
            e.preventDefault(); e.stopPropagation();
            S.tilt = !S.tilt; askTilt(); tilt.base = tilt.steer; savePrefs();
            tb.textContent = S.tilt ? '📱' : '👆';
            sound.pop();
          });
          d.appendChild(tb);
        }
      }
    });
    if (R.views.length > 1) {
      const W = root.clientWidth, H = root.clientHeight;
      hud.appendChild(el(W >= H ? `<div class="kk-divider" style="left:${W / 2 - 2}px;top:0;width:4px;height:${H}px"></div>` : `<div class="kk-divider" style="left:0;top:${H / 2 - 2}px;width:${W}px;height:4px"></div>`));
    }
    const mini = el(`<canvas class="kk-map ${R.views.length > 1 ? 'mid' : ''}" width="320" height="200"></canvas>`);
    hud.appendChild(mini);
    R.mini = mini;
    R.miniBg = null;
    const guest = S.net && !S.net.isHost;
    const top = el(`<div class="kk-racetop"><button class="kk-btn ui-hud-btn kk-pause" title="${guest ? 'Leave' : 'Pause'}">${icon(guest ? 'leave' : 'pause')}</button></div>`);
    click(top.querySelector('.kk-pause'), () => { if (guest) { leaveOnline(); return; } S.paused = !S.net; pauseUI(); });
    ui.appendChild(top);
    if (S.paused) pauseUI();
  }

  function pauseUI() {
    if ($('.kk-pausebox')) return;
    const box = el(`<div class="ui-overlay kk-overlay kk-pausebox"><div class="ui-panel">
      <div class="ui-kicker">Kit's Karts</div><h2 class="ui-title">Paused</h2>
      <div class="kk-stack">
        <button class="ui-btn primary big kk-resume">${icon('play')}<span>Resume</span></button>
        <button class="ui-btn kk-again">${icon('retry')}<span>Restart race</span></button>
        <button class="ui-btn ghost kk-edit">${icon('edit')}<span>Back to the track</span></button>
      </div></div></div>`);
    click(box.querySelector('.kk-resume'), () => { S.paused = false; box.remove(); });
    click(box.querySelector('.kk-again'), () => raceAgain());
    click(box.querySelector('.kk-edit'), () => toBuild());
    ui.appendChild(box);
  }

  function resultsUI() {
    const list = standings(R.race);
    const guest = S.net && !S.net.isHost;
    const box = el(`<div class="ui-overlay kk-overlay"><div class="ui-panel kk-results">
      <div class="ui-kicker">Kit's Karts</div><h2 class="ui-title">Results</h2><ol></ol>
      ${guest ? '<p class="ui-sub">⏳ Waiting for the next race…</p>' : `<div class="ui-row kk-foot"><button class="ui-btn ghost kk-edit">${icon('edit')}<span>Track</span></button><button class="ui-btn primary big kk-again">${icon('retry')}<span>Race again</span></button></div>`}</div></div>`);
    list.forEach((c, i) => {
      const hi = R.localIds.indexOf(c.id);
      const who = hi >= 0 ? pname(hi) : c.cpu ? '🤖 ' + c.name : '🌍 ' + (c.name || '');
      const li = el(`<li class="${hi >= 0 ? 'me' : ''}" style="--pc:${hi >= 0 ? P_COLORS[hi] : c.cpu ? '#888' : c.look.color}"><span class="kk-medal">${MEDALS[i] || ORD(i + 1)}</span>${kartImg(c.look)}<b>${who}</b></li>`);
      box.querySelector('ol').appendChild(li);
    });
    click(box.querySelector('.kk-again'), () => raceAgain());
    click(box.querySelector('.kk-edit'), () => toBuild());
    ui.appendChild(box);
  }

  function toBuild() {
    endRace();
    S.phase = S.net && !S.net.isHost ? 'lobby' : 'build';
    S.paused = false;
    if (S.net && S.net.isHost) S.net.room.setMeta({ state: 'build' });
    render();
  }
  function raceAgain() { if (S.net) hostStartRace(); else startRace(); }

  // ------------------------------------------------------------ online
  const pidOf = p => `${S.net.room.uid}_${p.id}`;
  const isMine = id => !!S.net && id.startsWith(S.net.room.uid + '_');

  function trackData() {
    if (!S.track) return null;
    return {
      pts: trackToJSON(S.track),
      items: S.items.map(({ type, x, y }) => ({ type, x: Math.round(x), y: Math.round(y) })),
      modes: S.course ? S.course.crossings.map(c => c.mode) : [],
      theme: S.theme,
    };
  }
  function hostSync() {
    if (!S.net || !S.net.isHost) return;
    S.net.room.setMeta({ track: trackData(), bots: S.bots, level: S.level, laps: S.laps, hostUid: S.net.room.uid });
  }
  function syncMyPlayers() {
    if (!S.net) return;
    const now = new Set();
    S.players.forEach((p, i) => {
      const id = pidOf(p);
      now.add(id);
      S.net.room.setPlayer(id, { ...playerInfo(S.ready), look: p.look, name: (i === 0 && myName()) || DRIVER_ICON[p.look.driver] || '🙂', joined: S.net.joined + i });
    });
    S.net.synced.forEach(id => { if (!now.has(id)) S.net.room.setPlayer(id, null); });
    S.net.synced = now;
  }

  // everyone in the room, same order on every device: robots first, then people
  function roster() {
    const m = S.net.meta || {};
    const humans = Object.entries(S.net.players)
      .filter(([, p]) => p && p.look)
      .sort((a, b) => (a[1].joined - b[1].joined) || (a[0] < b[0] ? -1 : 1))
      .slice(0, MAX_KARTS)
      .map(([id, p]) => ({ id, look: cleanLook(p.look), name: cleanName(p.name) || (typeof p.name === 'string' ? p.name.slice(0, 8) : '') || '🙂' }));
    const nb = Math.max(0, Math.min(6, m.bots | 0, MAX_KARTS - humans.length));
    const theme = (m.track && m.track.theme) || '';
    const bots = Array.from({ length: nb }, (_, k) => ({ id: `${m.hostUid}_bot${k}`, name: BOT_NAMES[k % BOT_NAMES.length], look: botLook(k + theme.length * 3), cpu: true, level: Math.max(0, Math.min(2, m.level | 0)) }));
    return [...bots, ...humans];
  }

  function goOnline(room) {
    S.net = { room, isHost: room.isHost, code: room.code, meta: null, players: {}, live: {}, raceId: 0, trackKey: '', synced: new Set(), joined: room.now(), sendAcc: 0, unsubs: [], status: 'ok', seenFx: new Set() };
    keepAwake(true);
    S.net.unsubs.push(room.onMeta(onMeta));
    if (room.onStatus) S.net.unsubs.push(room.onStatus(st => { if (!S.net || S.net.status === st) return; S.net.status = st; if (!R) render(); }));
    S.net.unsubs.push(room.onPlayers(p => { if (!S.net) return; S.net.players = p; if (['build', 'lobby'].includes(S.phase)) render(); }));
    S.net.unsubs.push(room.onLive(l => { if (S.net) S.net.live = l; }));
    syncMyPlayers();
    hostSync();
  }

  // "Play with friends": make a room, friends get an invite (together.js)
  async function hostRoom() {
    if (S.net || S.busy) return;
    S.busy = true; render();
    try {
      const room = await playTogether(GAME, () => createRoom(GAME, { state: 'build', raceId: 0 }));
      S.busy = false;
      if (room) { goOnline(room); S.phase = 'build'; }
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false; S.sad = S.time + 2; S.phase = 'build';
    }
    render();
  }

  async function tryJoin(code) {
    S.busy = true; render();
    try {
      const room = await joinRoom(GAME, code);
      S.busy = false;
      if (!room) { S.note = { text: '😢 That game has finished', until: S.time + 3 }; sound.bump(); render(); return; }
      S.ready = false;
      goOnline(room);
      joined(GAME, code);
      S.phase = 'lobby';
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false; S.sad = S.time + 2;
    }
    render();
  }

  function leaveOnline(gone = false) {
    if (!S.net) return;
    const net = S.net;
    S.net = null;
    keepAwake(false);
    net.unsubs.forEach(u => u && u());
    net.room.leave();
    leftRoom();
    S.ready = false;
    endRace();
    S.paused = false;
    S.phase = 'build';
    if (gone) S.sad = S.time + 2;
    setCourse();
    render();
  }

  function onMeta(m) {
    if (!S.net) return;
    if (!m) { leaveOnline(true); return; } // the host left
    S.net.meta = m;
    if (m.hostUid !== S.net.hostUid) { S.net.hostUid = m.hostUid; if (['build', 'lobby'].includes(S.phase) && !R) render(); } // now we know who's building
    if (!S.net.isHost && m.track) {
      const key = JSON.stringify(m.track);
      if (key !== S.net.trackKey) {
        S.net.trackKey = key;
        S.track = trackFromJSON(m.track.pts);
        S.items = resnapItems(m.track.items || [], S.track);
        S.modes = Array.isArray(m.track.modes) ? m.track.modes : [];
        if (THEME_IDS.includes(m.track.theme)) S.theme = m.track.theme;
        if (!R) setCourse();
      }
    }
    if (!S.net.isHost && S.phase === 'lobby') { const b = $('.kk-lobby-info'); if (b) b.innerHTML = lobbyInfo(); }
    if (m.state === 'race' && m.raceId !== S.net.raceId) startOnlineRace(m);
    if (m.state === 'build' && !S.net.isHost && (S.phase === 'race' || S.phase === 'results')) { endRace(); setCourse(); S.phase = 'lobby'; S.ready = false; syncMyPlayers(); render(); }
  }

  function hostStartRace() {
    const n = S.net;
    hostSync();
    n.room.setMeta({ state: 'race', raceId: ((n.meta && n.meta.raceId) || 0) + 1, startAt: n.room.now() + 3500 });
  }

  function startOnlineRace(m) {
    const n = S.net;
    n.raceId = m.raceId;
    if (!S.track) return;
    setCourse();
    const cd = Math.max(0.01, (m.startAt - n.room.now()) / 1000);
    if (cd < -60) return; // an old race we missed
    const laps = LAP_CHOICES.includes(m.laps) ? m.laps : 3;
    if (beginRace(roster(), laps, S.players.map(pidOf), cd)) n.sendAcc = 0;
  }

  const r1 = v => Math.round(v * 10) / 10;
  function sendCars(dt) {
    const n = S.net, race = R.race;
    n.sendAcc += dt;
    if (n.sendAcc < SEND_EVERY) return;
    n.sendAcc = 0;
    race.netFx.forEach(e => { if (e.t === undefined) e.t = race.t; });
    race.netFx = race.netFx.filter(e => race.t - e.t < 3);
    const hit = [...race.hitIds].slice(-20);
    for (const c of race.cars) {
      if (c.remote) continue;
      n.room.setLive(c.id, {
        r: n.raceId, t: n.room.now(),
        x: r1(c.x), y: r1(c.y), z: r1(c.z), a: Math.round(c.a * 1000) / 1000, vx: Math.round(c.vx), vy: Math.round(c.vy),
        g: r1(c.ground), air: c.air ? 1 : 0, vz: Math.round(c.vz), sv: Math.round(c.slopeVz || 0), sp: Math.round(c.speed), vF: Math.round(c.vF), st: Math.round(c.steer * 100) / 100,
        b: c.boostT > 0 ? 1 : 0, sh: c.shieldT > 0 ? 1 : 0, s: c.starT > 0 ? 1 : 0, sm: c.smallT > 0 ? 1 : 0, dr: c.drifting ? 1 : 0, dT: r1(c.driftT),
        fl: r1(c.flipT), tr: r1(c.trickT), td: c.trickDir || 1, rs: r1(c.rescueT), sf: c.surface, sk: Math.round(c.skid),
        idx: c.idx, dist: c.dist, lap: c.lap, fin: c.finished ? 1 : 0, ft: c.finished ? r1(c.finishT) : -1,
        o: race.objs.filter(o => o.owner === c.id && !o.remote).map(o => [`${o.owner}:${o.id}`, o.kind, r1(o.x), r1(o.y), r1(o.z), Math.round((o.a || 0) * 100) / 100, Math.round(o.vx || Math.cos(o.a || 0) * (o.sp || 0)), Math.round(o.vy || Math.sin(o.a || 0) * (o.sp || 0)), r1(o.fuse || 0)]),
        hit,
        fx: race.netFx.filter(e => e.by === c.id).map(({ id, type, x, y, z, dist }) => ({ id, type, x: r1(x || 0), y: r1(y || 0), z: r1(z || 0), dist: dist || 0 })),
      });
    }
  }

  // friends' karts glide to where they really are; their items can hit our karts
  function applyRemote(dt) {
    const n = S.net, race = R.race;
    const k = 1 - Math.exp(-12 * dt);
    const now = n.room.now();
    const ghosts = [], theyHit = new Set();
    const before = race.events.length;
    for (const [id, s] of Object.entries(n.live)) {
      if (isMine(id) || !s || s.r !== n.raceId) continue;
      const age = Math.min(0.3, Math.max(0, (now - s.t) / 1000));
      (s.o || []).forEach(o => {
        if (!Array.isArray(o) || !NET_KINDS.includes(o[1]) || race.hitIds.has(o[0])) return;
        const [oid, kind, x, y, z, a, vx, vy, fuse] = o;
        const moving = kind === 'rocket' || kind === 'ball';
        ghosts.push({ id: String(oid), kind, x: x + (moving ? vx * age : 0), y: y + (moving ? vy * age : 0), z, a, fuse, remote: true, owner: id });
      });
      (s.hit || []).forEach(h => theyHit.add(h));
      (s.fx || []).forEach(e => {
        if (!e || n.seenFx.has(e.id)) return;
        n.seenFx.add(e.id);
        if (e.type === 'zap') { zapAhead(race, e.dist, id); R.flash = 0.25; sound.noise(0.5, 3000, 0.2); }
        if (e.type === 'boom') boomAt(race, e.x, e.y, e.z, id);
      });
    }
    race.objs = race.objs.filter(o => !o.remote && !theyHit.has(`${o.owner}:${o.id}`)).concat(ghosts);
    if (race.events.length > before) handleEvents(race.events.splice(before));
    for (const c of race.cars) {
      if (!c.remote) continue;
      const s = n.live[c.id];
      if (!s || s.r !== n.raceId) {
        if (race.phase === 'racing' && !c.cpu && !n.players[c.id]) { c.goneT = (c.goneT || 0) + dt; if (c.goneT > 5) c.gone = true; }
        continue;
      }
      c.goneT = 0;
      const age = Math.min(0.3, Math.max(0, (now - s.t) / 1000));
      const tx = s.x + s.vx * age, ty = s.y + s.vy * age;
      if (Math.hypot(tx - c.x, ty - c.y) > 200) { c.x = tx; c.y = ty; c.a = s.a; }
      else {
        c.x += (tx - c.x) * k; c.y += (ty - c.y) * k;
        c.a += Math.atan2(Math.sin(s.a - c.a), Math.cos(s.a - c.a)) * k;
      }
      c.z += (s.z - c.z) * k;
      Object.assign(c, {
        vx: s.vx, vy: s.vy, ground: s.g, air: !!s.air, vz: s.vz, slopeVz: s.sv, speed: s.sp, vF: s.vF, steer: s.st,
        boostT: s.b ? 0.5 : 0, shieldT: s.sh ? 1 : 0, starT: s.s ? 1 : 0, smallT: s.sm ? 1 : 0, drifting: !!s.dr, driftT: s.dT,
        flipT: s.fl, trickT: s.tr, trickDir: s.td, rescueT: s.rs, surface: s.sf, skid: s.sk, idx: s.idx, dist: s.dist, lap: s.lap,
      });
      if (s.fin && !c.finished) {
        c.finished = true; c.finishT = s.ft >= 0 ? s.ft : race.t;
        if (race.firstFinish < 0) race.firstFinish = race.t;
        R.world.fx.confetti(c.x, c.y, c.z);
      }
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

  // who's in the room and what they're doing (same strip in every game, together.js)
  function stripUI() {
    const list = people(S.net.players, (S.net.meta && S.net.meta.hostUid) || (S.net.isHost ? S.net.room.uid : ''));
    const b = el(`<div class="kk-strip ${S.phase === 'lobby' ? 'up' : ''}">${lobbyHTML(list, { hostDoing: 'building the track', myUid: S.net.room.uid })}<button class="ui-btn danger round small kk-leave" title="Leave">${icon('leave')}</button></div>`);
    click(b.querySelector('.kk-leave'), () => leaveOnline());
    ui.appendChild(b);
  }
  function lobbyInfo() {
    const m = (S.net && S.net.meta) || {};
    return `<span>🤖 ${Math.min(6, m.bots | 0)}</span><span>🏁 ${m.laps || 3}</span>`;
  }
  // a friend waits while the host draws: do up your kart, then I'm ready!
  function lobbyUI() {
    const list = people(S.net.players, (S.net.meta && S.net.meta.hostUid) || '');
    const host = list.find(p => p.host);
    const card = el(`<div class="kk-bar kk-lobbybar">${waitHTML(host, 'building the track', S.ready)}</div>`);
    const wait = card.querySelector('.tg-wait');
    const karts = el(`<div class="kk-mykarts"></div>`);
    S.players.forEach((p, i) => {
      const b = el(`<button class="kk-mykart" style="--pc:${P_COLORS[i]}">${kartImg(p.look)}<b>${icon('edit')} ${i ? 'P2 kart' : 'My kart'}</b>${i ? `<span class="kk-x">${icon('close')}</span>` : ''}</button>`);
      click(b, e => { if (e.target.closest('.kk-x')) { S.players.splice(i, 1); savePrefs(); render(); return; } openGarage(i); });
      karts.appendChild(b);
    });
    if (S.players.length < 2) {
      const add = el(`<button class="kk-mykart kk-add2" title="Two players">${icon('plus')}<b>P2</b></button>`);
      click(add, () => { S.players.push({ id: 'p2', look: cleanLook(null, 1), controls: 'wasd' }); savePrefs(); openGarage(1); });
      karts.appendChild(add);
    }
    karts.appendChild(el(`<div class="kk-lobby-info">${lobbyInfo()}</div>`));
    wait.insertBefore(karts, wait.querySelector('[data-ready]'));
    click(wait.querySelector('[data-ready]'), () => { askTilt(); S.ready = !S.ready; syncMyPlayers(); render(); });
    ui.appendChild(card);
  }

  // ------------------------------------------------------------ HUD
  function say(i, text, secs = 1.4) { if (R && R.msgs[i]) R.msgs[i] = { text, until: S.time + secs }; }
  function viewOf(id) { return R ? R.views.findIndex(v => v.car.id === id) : -1; }

  function updateHUD() {
    const race = R.race;
    R.views.forEach((v, i) => {
      const h = v.hud; if (!h) return;
      const c = v.car;
      const set = (k, node, val, prop = 'textContent') => { if (h.last[k] !== val) { h.last[k] = val; node[prop] = val; } };
      let icon = '';
      if (c.item) icon = c.rollT > 0 ? ITEMS[ITEM_LIST[Math.floor(S.time * 14) % ITEM_LIST.length]] : ITEMS[c.item] + (c.itemN > 1 ? `<sup>${c.itemN}</sup>` : '');
      set('item', h.itemS, icon, 'innerHTML');
      h.item.classList.toggle('ready', !!c.item && c.rollT <= 0);
      h.root.classList.toggle('kk-tilting', tiltActive());
      set('place', h.place, `${c.place}<small>${ORD(c.place).slice(-2)}</small>`, 'innerHTML');
      set('lap', h.lap, c.finished ? '🏁' : `🏁 ${Math.min(race.laps, c.lap + 1)}/${race.laps}`);
      let big = '';
      if (race.phase === 'countdown') { const n = Math.ceil(race.countdown); big = n <= 3 ? String(n) : ''; }
      else if (race.goT >= 0 && race.t - race.goT < 0.9) big = 'GO!';
      else if (c.finished) big = `${MEDALS[c.place - 1] || '🏁'}<br><small>${ORD(c.place)}</small>`;
      else if (c.rescueT > 0) big = '🚁';
      set('big', h.big, big, 'innerHTML');
      const m = R.msgs[i];
      const mt = S.time < m.until ? m.text : '';
      set('msg', h.msg, mt);
      h.msg.classList.toggle('show', !!mt);
    });
    drawMini();
  }

  function drawMini() {
    const cv = R.mini; if (!cv) return;
    const g = cv.getContext('2d');
    const s = Math.min(cv.width / WORLD.w, cv.height / WORLD.h) * 0.94;
    const ox = (cv.width - WORLD.w * s) / 2, oy = (cv.height - WORLD.h * s) / 2;
    if (!R.miniBg) {
      const b = document.createElement('canvas'); b.width = cv.width; b.height = cv.height;
      const bg = b.getContext('2d');
      bg.translate(ox, oy); bg.scale(s, s);
      bg.lineJoin = 'round';
      bg.beginPath(); S.course.pts.forEach((p, i) => (i ? bg.lineTo(p.x, p.y) : bg.moveTo(p.x, p.y))); bg.closePath();
      bg.strokeStyle = 'rgba(0,0,0,.55)'; bg.lineWidth = 70; bg.stroke();
      bg.strokeStyle = 'rgba(255,255,255,.9)'; bg.lineWidth = 34; bg.stroke();
      R.miniBg = b;
    }
    g.clearRect(0, 0, cv.width, cv.height);
    g.drawImage(R.miniBg, 0, 0);
    const order = [...R.race.cars].sort((a, b) => (a.cpu ? 0 : 1) - (b.cpu ? 0 : 1));
    for (const c of order) {
      const hi = R.localIds.indexOf(c.id);
      g.fillStyle = hi >= 0 ? P_COLORS[hi] : c.look.color;
      g.strokeStyle = hi >= 0 ? '#fff' : '#222'; g.lineWidth = hi >= 0 ? 3 : 1.5;
      g.beginPath(); g.arc(ox + c.x * s, oy + c.y * s, hi >= 0 ? 8 : 5.5, 0, 7); g.fill(); g.stroke();
    }
  }

  // ------------------------------------------------------------ inputs
  const touches = new Map();
  function markTouches() {
    const on = [...touches.values()];
    ui.parentElement.querySelectorAll('.kk-tb').forEach(b => b.classList.toggle('on', on.some(t => t.p === b.dataset.p && t.k === b.dataset.k)));
  }
  const onPadDown = e => {
    const b = e.target.closest && e.target.closest('.kk-tb, .kk-item[data-p]');
    if (!b) return;
    e.preventDefault();
    touches.set(e.pointerId, { p: b.dataset.p, k: b.dataset.k });
    markTouches();
  };
  hud.addEventListener('pointerdown', onPadDown);
  const onPadMove = e => {
    const t = touches.get(e.pointerId);
    if (!t) return;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const b = hit && hit.closest && hit.closest('.kk-tb');
    if (b && b.dataset.p === t.p && b.dataset.k !== t.k) { t.k = b.dataset.k; markTouches(); }
  };
  const onPadUp = e => { if (touches.delete(e.pointerId)) markTouches(); };
  window.addEventListener('pointermove', onPadMove);
  window.addEventListener('pointerup', onPadUp);
  window.addEventListener('pointercancel', onPadUp);
  root.addEventListener('contextmenu', e => e.preventDefault());

  function padInput(k) {
    const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : [];
    const gp = pads[k];
    if (!gp) return null;
    const b = i => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.4));
    const ax = gp.axes[0] || 0;
    return { up: b(0) || b(7), down: b(1) || b(6), left: ax < -0.35 || b(14), right: ax > 0.35 || b(15), fire: b(2) || b(3) || b(4) || b(5) };
  }

  // ------------------------------------------------------------ tilt to steer (phones, one player)
  const tilt = { ok: false, listening: false, steer: 0, base: 0 };
  function tiltAxes(e) {
    const a = ((screen.orientation && screen.orientation.angle) ?? window.orientation ?? 0) % 360;
    const b = e.beta || 0, g = e.gamma || 0;
    if (a === 90) return b;
    if (a === 270 || a === -90) return -b;
    if (a === 180 || a === -180) return -g;
    return g;
  }
  const onOrient = e => { if (e.beta == null) return; tilt.ok = true; tilt.steer = tiltAxes(e); };
  // must be called straight from a tap (iPhone/iPad ask for permission)
  function askTilt() {
    if (!TOUCH || !S.tilt || tilt.listening || typeof DeviceOrientationEvent === 'undefined') return;
    const listen = () => { tilt.listening = true; addEventListener('deviceorientation', onOrient); };
    if (typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(listen, listen); // if it says no, nothing arrives anyway
    else listen();
  }
  const dead = (v, lo, hi) => { const a = Math.abs(v); return a < lo ? 0 : Math.sign(v) * Math.min(1, (a - lo) / (hi - lo)); };
  const tiltActive = () => TOUCH && S.tilt && tilt.ok && S.players.length === 1 && R && R.views.length === 1;

  function gatherInputs() {
    const inputs = {};
    const solo = S.players.length === 1;
    S.players.forEach((p, k) => {
      const inp = CONTROLS[p.controls](keys);
      if (solo) { const o = CONTROLS.wasd(keys); for (const q in o) inp[q] = inp[q] || o[q]; }
      const gp = padInput(k);
      if (gp) for (const q in gp) inp[q] = inp[q] || gp[q];
      inputs[p.id] = inp;
    });
    for (const t of touches.values()) if (inputs[t.p]) inputs[t.p][t.k] = true;
    if (TOUCH) for (const p of S.players) { const i = inputs[p.id]; if (!i.down && !keys.isDown('ArrowDown')) i.up = true; }
    if (tiltActive()) { const i = inputs[S.players[0].id]; if (!i.left && !i.right) i.steer = dead(tilt.steer - tilt.base, 3, 24); }
    if (S.net) S.players.forEach(p => { inputs[pidOf(p)] = inputs[p.id]; });
    for (const c of R.race.cars) {
      if (c.remote) continue;
      if (c.cpu || c.finished || R.race.phase === 'done') inputs[c.id] = aiInput(c, R.race);
    }
    return inputs;
  }

  // ------------------------------------------------------------ sounds
  function makeEngine() {
    const a = audioCtx();
    if (!a) return null;
    const o = a.createOscillator(); o.type = 'sawtooth';
    const o2 = a.createOscillator(); o2.type = 'square';
    const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    const g = a.createGain(); g.gain.value = 0;
    o.connect(f); o2.connect(f); f.connect(g).connect(a.destination);
    o.start(); o2.start();
    return {
      set(speed, on, boost) {
        const fq = 45 + speed * 0.28 + (boost ? 40 : 0);
        o.frequency.setTargetAtTime(fq, a.currentTime, 0.06);
        o2.frequency.setTargetAtTime(fq * 0.5, a.currentTime, 0.06);
        g.gain.setTargetAtTime(on ? 0.03 : 0, a.currentTime, 0.1);
      },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); o.stop(a.currentTime + 0.2); o2.stop(a.currentTime + 0.2); },
    };
  }

  function handleEvents(events) {
    const race = R.race, fx = R.world.fx;
    const car = id => race.cars.find(c => c.id === id);
    const mine = id => viewOf(id) >= 0;
    for (const e of events) {
      const c = e.id && car(e.id);
      const vi = e.id ? viewOf(e.id) : -1;
      switch (e.type) {
        case 'beep': sound.tone(440, 0.25, 'square', 0.12); break;
        case 'go': sound.tone(880, 0.6, 'square', 0.14); tilt.base = tilt.steer; break;
        case 'lap':
          if (vi >= 0) { sound.tone(660, 0.12, 'triangle'); setTimeout(() => sound.tone(990, 0.2, 'triangle'), 110); say(vi, e.lap === race.laps - 1 ? '🏁 FINAL LAP! 🏁' : `Lap ${e.lap + 1}`, 1.8); }
          break;
        case 'finish':
          fx.confetti(c.x, c.y, c.z);
          if (vi >= 0) sound.win();
          break;
        case 'bigjump': if (mine(e.id)) { sound.whoosh(); say(vi, '🚀 JUMP!', 1); } break;
        case 'jump': if (mine(e.id)) sound.tone(300, 0.3, 'sine', 0.2, 800); break;
        case 'land': fx.dust(c.x, c.y, c.z, e.big ? 14 : 6); if (mine(e.id)) sound.bump(); break;
        case 'trick': if (mine(e.id)) { sound.tone(700, 0.15, 'triangle', 0.15, 1400); } break;
        case 'trickboost': if (mine(e.id)) { say(vi, '✨ TRICK! ✨', 1); sound.whoosh(); } break;
        case 'bash':
          fx.sparks(e.x, e.y, e.z + 6, '#ffeb3b', e.hard ? 16 : 8, 120);
          if (mine(e.id) || mine(e.id2)) { sound.bump(); if (e.hard) sound.tone(120, 0.2, 'square', 0.15, 60); }
          if (e.hard) { const a = viewOf(e.id), b = viewOf(e.id2); if (a >= 0) say(a, '💥 BASH!', 0.8); if (b >= 0) say(b, '💥 BASH!', 0.8); }
          break;
        case 'crash': case 'rail': if (mine(e.id)) sound.bump(); fx.sparks(c.x, c.y, c.z + 4, '#ffffff', 4); break;
        case 'hit':
          fx.pop(c.x, c.y, c.z, e.kind === 'flip' ? '#ff7043' : '#ffeb3b');
          if (mine(e.id)) { sound.bump(); sound.tone(700, 0.5, 'triangle', 0.15, 150); say(vi, e.kind === 'flip' ? '😵 KABOOM!' : '😵 Whoops!', 1.2); }
          if (mine(e.by)) say(viewOf(e.by), '🎯 GOT ONE!', 1.2);
          break;
        case 'box': fx.box(e.x, e.y, e.z); if (mine(e.id)) sound.tone(900, 0.08, 'square', 0.08, 1300); break;
        case 'pickup': if (mine(e.id)) [0, 1, 2, 3, 4, 5].forEach(k => setTimeout(() => sound.tone(500 + k * 110, 0.05, 'square', 0.06), k * 140)); break;
        case 'use':
          if (mine(e.id)) {
            if (e.item === 'rocket') sound.tone(250, 0.4, 'sawtooth', 0.12, 800);
            else if (e.item === 'ball') sound.tone(500, 0.15, 'square', 0.1, 900);
            else if (e.item === 'bomb') sound.tone(200, 0.3, 'triangle', 0.15, 500);
            else if (e.item === 'star') { [523, 659, 784, 1047, 1319].forEach((f, k) => setTimeout(() => sound.tone(f, 0.12, 'square', 0.08), k * 70)); say(vi, '⭐ SUPER STAR! ⭐', 1.5); }
            else if (e.item === 'shield') { sound.tone(400, 0.4, 'sine', 0.15, 1200); say(vi, '🛡️ SHIELD!', 1); }
            else if (e.item === 'zap') { sound.noise(0.5, 3000, 0.3); say(vi, '⚡ ZAP!', 1); }
            else if (e.item === 'banana' || e.item === 'triple' || e.item === 'oil') sound.tone(400, 0.15, 'sine', 0.15, 200);
          }
          if (e.item === 'zap') R.flash = 0.25;
          break;
        case 'boost': if (mine(e.id)) sound.whoosh(); break;
        case 'miniturbo': if (mine(e.id)) { sound.whoosh(); if (e.big) say(vi, '🔥 TURBO!', 0.8); } break;
        case 'hop': if (mine(e.id)) sound.tone(200, 0.08, 'sine', 0.1, 400); break;
        case 'boom': fx.boom(e.x, e.y, e.z); sound.noise(0.9, 300, 0.5); sound.tone(90, 0.6, 'sawtooth', 0.15, 40); break;
        case 'pop': fx.pop(e.x, e.y, e.z, e.kind === 'banana' ? '#ffe135' : '#ffffff'); break;
        case 'shield': fx.pop(c.x, c.y, c.z, '#64d8ff'); if (mine(e.id)) { sound.tone(1200, 0.3, 'sine', 0.15, 400); say(vi, '🛡️ Saved!', 1); } break;
        case 'zapped': fx.sparks(c.x, c.y, c.z + 10, '#fff176', 20, 120); if (mine(e.id)) say(vi, '⚡ Shrunk!', 1.5); break;
        case 'rescue': if (mine(e.id)) { sound.tone(500, 0.6, 'sine', 0.15, 200); say(vi, '🚁 Oops! Back you go', 1.3); } break;
        case 'mud': if (mine(e.id)) sound.squelch(); fx.dust(c.x, c.y, c.z, 8, '#6d4c41'); break;
        case 'water': if (mine(e.id)) sound.splash(); fx.splash(c.x, c.y, c.z); break;
        case 'cone': if (mine(e.id)) sound.tok(); break;
        case 'boing': sound.tone(300, 0.1, 'sine', 0.05, 600); break;
        case 'done': R.doneAt = S.time; break;
      }
    }
  }

  // ------------------------------------------------------------ drawing the track
  function hitItem(w) {
    let best = null, bd = 45;
    for (const it of S.items) { const d = Math.hypot(it.x - w.x, it.y - w.y); if (d < bd) { bd = d; best = it; } }
    return best;
  }
  edView.canvas.addEventListener('pointerdown', e => {
    if (S.phase !== 'build' || S.garage) return;
    const w = editor.toWorld(e.clientX, e.clientY);
    const ci = editor.crossingAt(w);
    if (ci >= 0) { // switch jump <-> bridge
      const n = S.course.crossings.length;
      S.modes = Array.from({ length: n }, (_, k) => S.course.crossings[k].mode);
      S.modes[ci] = S.modes[ci] === 'jump' ? 'bridge' : 'jump';
      setCourse();
      sound.tone(S.modes[ci] === 'jump' ? 500 : 300, 0.2, 'triangle', 0.15, S.modes[ci] === 'jump' ? 1000 : 200);
      return;
    }
    const it = hitItem(w);
    if (it) {
      S.drag = { item: { ...it }, existing: it };
      S.items = S.items.filter(x => x !== it);
      editor.setScene(S.course, S.items, S.theme);
      showBin(true);
    } else S.stroke = [w];
  });
  const onMove = e => {
    if (S.phase !== 'build') return;
    const w = editor.toWorld(e.clientX, e.clientY);
    if (S.stroke) { const last = S.stroke[S.stroke.length - 1]; if (Math.hypot(w.x - last.x, w.y - last.y) > 6) S.stroke.push(w); }
    if (S.drag) { S.drag.item.x = w.x; S.drag.item.y = w.y; const b = $('.kk-bin'); if (b) b.classList.toggle('hot', overBin(e)); }
  };
  const onUp = e => {
    if (S.phase !== 'build') return;
    if (S.stroke) {
      const t0 = buildTrack(S.stroke), t = t0 && smoothTrack(spreadTrack(smoothTrack(t0)), 3, 2);
      S.stroke = null;
      if (t) { S.track = t; S.modes = []; setCourse(); sound.win(); render(); } else sound.bump();
    }
    if (S.drag) {
      const { item, existing } = S.drag;
      S.drag = null;
      showBin(false);
      if (!overBin(e)) {
        const placed = snapItem(S.track, item.type, item.x, item.y);
        const inside = item.x > 0 && item.y > 0 && item.x < WORLD.w && item.y < WORLD.h;
        const onJump = placed && placed.idx >= 0 && S.course && S.course.jumpOf[placed.idx] >= 0 && item.type !== 'box';
        if (placed && inside && !onJump) { S.items.push(placed); sound.pop(); }
        else if (existing) S.items.push(existing);
        else sound.bump();
      } else sound.bump();
      editor.setScene(S.course, S.items, S.theme);
      hostSync();
    }
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  const onKey = e => {
    if (e.code === 'Escape' && S.phase === 'race' && !S.net) { S.paused = !S.paused; if (S.paused) pauseUI(); else { const b = $('.kk-pausebox'); if (b) b.remove(); } }
    if ((e.code === 'Enter' || e.code === 'Space') && S.phase === 'results' && !(S.net && !S.net.isHost)) raceAgain();
  };
  window.addEventListener('keydown', onKey);

  // how much room the bars take, so the track fills the rest
  function edInsets() {
    const rr = root.getBoundingClientRect();
    let top = 12, bottom = 12;
    for (const sel of ['.kk-top', '.kk-strip']) { const e = $(sel); if (e) top = Math.max(top, e.getBoundingClientRect().bottom - rr.top + 6); }
    const b = $('.kk-bar'); if (b) bottom = rr.bottom - b.getBoundingClientRect().top + 6;
    return { top, bottom };
  }

  // ------------------------------------------------------------ main loop
  let lastW = 0, lastH = 0;
  const stopLoop = startLoop(dt => {
    S.time += dt;
    if (R && !S.paused) {
      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 4) {
        stepRace(R.race, gatherInputs(), STEP);
        handleEvents(R.race.events);
        acc -= STEP; steps++;
      }
      if (steps === 4) acc = 0;
      if (S.net && R) { applyRemote(dt); sendCars(dt); }
      R.views.forEach((v, i) => R.engines[i] && R.engines[i].set(v.car.speed, S.phase === 'race', v.car.boostT > 0));
      if (S.phase === 'race' && R.doneAt && S.time - R.doneAt > 1.8) { S.phase = 'results'; render(); }
    }
    if (R && S.paused) R.engines.forEach(e => e && e.set(0, false));
  }, () => {
    if (S.sad && S.time >= S.sad) { S.sad = 0; render(); }
    if (['build', 'saved', 'lobby'].includes(S.phase)) {
      editor.frame({ insets: edInsets(), stroke: S.stroke, drag: S.drag && S.drag.item, hint: !S.track && !S.stroke, time: S.time });
    }
    if (S.garage && preview) preview.frame(1 / 60);
    if (R) {
      const W = root.clientWidth, H = root.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, R.views.length > 1 ? 1.25 : 1.6);
      if (W !== lastW || H !== lastH || renderer.getPixelRatio() !== dpr) {
        renderer.setPixelRatio(dpr); renderer.setSize(W, H, false); lastW = W; lastH = H;
        if (S.phase === 'race' || S.phase === 'results') { const saved = S.paused; render(); S.paused = saved; }
      }
      const dt = S.paused ? 0 : Math.min(0.05, 1 / 60);
      R.views.forEach(v => chaseCam(v.cam, v.car, dt || 0.0001, v.first));
      R.views.forEach(v => { v.first = false; });
      R.world.update(dt, R.race, R.views.map(v => v.cam));
      const rects = layout();
      renderer.setScissorTest(true);
      renderer.shadowMap.needsUpdate = true;
      R.views.forEach((v, i) => {
        const r = rects[i];
        renderer.setViewport(r.x, H - r.y - r.h, r.w, r.h);
        renderer.setScissor(r.x, H - r.y - r.h, r.w, r.h);
        v.cam.aspect = r.w / r.h; v.cam.updateProjectionMatrix();
        renderer.render(R.world.scene, v.cam);
      });
      renderer.setScissorTest(false);
      if (R.flash > 0) { R.flash -= 1 / 60; root.classList.add('flash'); } else root.classList.remove('flash');
      updateHUD();
    }
  });

  setCourse();
  render();
  // opened from a friend's invite (together.js): join straight away
  const inviteCode = takeJoinCode(GAME);
  if (inviteCode) tryJoin(inviteCode);
  if (location.search.includes('kkdebug')) window.__kk = () => ({ S, R, renderer, tilt });

  return () => {
    removeEventListener('deviceorientation', onOrient);
    if (S.net) { S.net.unsubs.forEach(u => u && u()); S.net.room.leave(); S.net = null; leftRoom(); }
    keepAwake(false);
    document.removeEventListener('visibilitychange', onVisible);
    stopLoop();
    endRace();
    keys.destroy();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('pointermove', onPadMove);
    window.removeEventListener('pointerup', onPadUp);
    window.removeEventListener('pointercancel', onPadUp);
    window.removeEventListener('keydown', onKey);
    if (renderer) renderer.dispose();
    if (preview) preview.dispose();
    edView.destroy();
    css.remove();
    stage.innerHTML = '';
  };
}
