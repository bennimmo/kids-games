// Junk Stack – a boat brings junk, the crane lifts it onto the rock.
// Keep stacking higher and higher. If anything falls in the sea, it's game over.
// Real physics (planck.js): everything pushes on everything, and the item on
// the crane can knock the tower while you move it. Every item is a slightly
// different size, and it gets windier the higher you go.
// Race friends: same junk for everyone, watch their towers grow, tallest wins.
import * as planck from '../../js/vendor/planck.mjs';
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound } from '../../js/engine/sound.js';
import { icon } from '../../js/engine/icons.js';
import { nameHTML } from '../../js/engine/profile.js';
import {
  togetherButton, playTogether, takeJoinCode, joined as joinedRoom, leftRoom,
  lobbyHTML, waitHTML, notReady, startLabel,
} from '../../js/engine/together.js';
import { ITEMS, makeBody, drawItem, junkSequence } from './items.js';
import { createScenery } from './scenery.js';
import { GAME_ID, RACE_SECONDS, makeRoom, findRoom, connect } from './online.js';

const { Vec2 } = planck;
const STEP = 1 / 60;
const SAVE_KEY = 'junk-stack:v2';
const SEA = -2.2;          // sea level (platform top is y = 0)
const BASE_CAM = -5.0;     // bottom of the view (world y)
const PW = 4.4;            // rock platform width
const ROT = Math.PI / 4;   // one turn of the rotate button
const SLOTS = [-1.9, 0, 1.9]; // where junk sits on the boat
const DECK = SEA + 0.35;   // boat deck height
const MIN_ZOOM = 0.32;

function load() {
  try { return { best: 0, ...JSON.parse(localStorage.getItem(SAVE_KEY)) }; } catch (e) { return { best: 0 }; }
}
function save(d) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch (e) { /* ok */ } }

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const view = createCanvas(stage);
  const { canvas, ctx } = view;
  const ui = document.createElement('div');
  ui.className = 'js-ui';
  stage.appendChild(ui);

  let data = load();
  // menu | play | paused | over | lobby | race-wait | race | race-result
  let mode = 'menu';
  let world = null, ground = null;
  let bodies = [];           // stacked items: { body, type, sc, wet }
  let held = null;           // { body, joint, slot, boatId, type, sc, r, pointerId, touch }
  let boat = null;           // { id, x, phase: 'in'|'docked'|'out', t, items: [{ type, sc } | null] }
  let boatN = 0;
  let picks = 0;             // for the first-time hint
  let nextJunk = null;
  let rot = 0;               // turn for the next pick (steps of 45°)
  let acc = 0, time = 0;
  let camY = BASE_CAM, zoom = 1;
  let craneX = 0;
  let particles = [];
  let maxTop = 0;            // best height while still standing
  let lost = false;
  let wind = 0;
  let closed = false;
  const scenery = createScenery();
  // racing
  let net = null, race = null, myFinal = null, lastLobbyHtml = '', lastCount = -1, resultAt = 0;

  const racing = () => mode === 'race-wait' || mode === 'race' || mode === 'race-result';
  const canBuild = () => mode === 'play' || mode === 'race';

  // ---------- layout ----------
  function L() {
    const w = view.width, h = view.height, playH = h;
    const s1 = Math.min(w / 11, playH / 13);
    const s = s1 * zoom;
    return { w, h, playH, s, s1, viewH: playH / s, viewW: w / s };
  }
  const sx = (l, x) => l.w / 2 + x * l.s;
  const sy = (l, y) => l.playH - (y - camY) * l.s;
  function pointerWorld(e) {
    const r = canvas.getBoundingClientRect();
    const l = L();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    return { px, py, x: (px - l.w / 2) / l.s, y: camY + (l.playH - py) / l.s, l };
  }

  function bodyTop(b) {
    let top = -Infinity;
    for (let f = b.getFixtureList(); f; f = f.getNext()) top = Math.max(top, f.getAABB(0).upperBound.y);
    return top;
  }
  const touching = b => { for (let c = b.getContactList(); c; c = c.next) if (c.contact.isTouching()) return true; return false; };
  // top of the tower: highest item that is resting on something
  function towerTop() {
    let top = 0;
    bodies.forEach(it => {
      if (it.wet) return;
      const v = it.body.getLinearVelocity();
      if (Math.hypot(v.x, v.y) < 0.4 && touching(it.body)) top = Math.max(top, bodyTop(it.body));
    });
    return top;
  }
  const itemR = (type, sc) => ITEMS[type].r * Math.max(sc.x, sc.y);
  const deckScale = (type, sc) => Math.min(1, 1.7 / Math.max(ITEMS[type].w * sc.x, ITEMS[type].h * sc.y));

  // ---------- screens ----------
  function showMenu(msg = '') {
    mode = 'menu';
    leaveWorld();
    ui.innerHTML = `
      <div class="ui-overlay js-menu"><div class="ui-panel">
        <div class="ui-kicker">Junk Stack</div>
        <h2 class="ui-title">How high can you go?</h2>
        <p class="ui-sub">The rubbish barge is here! Tap some junk, drag it onto the platform and stack it up. Don't let any fall in the sea!</p>
        ${data.best ? `<p class="js-best">🏆 Best: <b>${data.best.toFixed(2)} m</b></p>` : ''}
        <div class="ui-row"><button class="ui-btn primary big" data-a="play">${icon('play')} Play</button></div>
        ${togetherButton('Race friends')}
        <p class="js-msg">${msg}</p>
      </div></div>`;
    ui.querySelector('[data-a="play"]').addEventListener('click', () => { sound.pop(); startGame(); });
    ui.querySelector('[data-together]').addEventListener('click', async () => {
      sound.pop();
      const m = ui.querySelector('.js-msg');
      m.textContent = '⏳';
      try {
        const room = await playTogether(GAME_ID, makeRoom);
        if (m.isConnected) m.textContent = '';
        if (!room) return;
        if (closed) { room.leave(); leftRoom(); return; }
        enterRoom(room);
      } catch (e) { if (m.isConnected) m.textContent = "Couldn't connect 😢 Try again"; }
    });
  }

  function leaveWorld() {
    held = null; world = null; ground = null; bodies = []; particles = []; boat = null;
  }

  function newWorld(seed) {
    leaveWorld();
    world = new planck.World({ gravity: Vec2(0, -10) });
    ground = world.createBody();
    ground.createFixture(planck.Box(PW / 2, 0.3, Vec2(0, -0.3), 0), { friction: 0.9 });
    nextJunk = junkSequence(seed);
    rot = 0; acc = 0; maxTop = 0; lost = false; wind = 0;
    camY = BASE_CAM; zoom = 1;
    boatN = 0;
    newBoat();
  }

  function newBoat() {
    boat = { id: ++boatN, x: -16, phase: 'in', t: 0, items: SLOTS.map(() => nextJunk()) };
    sound.tone(220, 0.5, 'sine', 0.12, 180); // toot
  }

  function startGame() {
    newWorld(Math.floor(Math.random() * 1e9));
    mode = 'play';
    buildUI();
    toast('Here comes the junk barge! 🚢');
  }

  function buildUI() {
    const r = racing();
    ui.innerHTML = `
      <div class="js-hud">
        ${r ? `<div class="ui-chip js-time">0:00</div>` : ''}
        <div class="ui-chip js-height">0.0 m</div>
        ${r ? `<div class="ui-chip js-rank"></div>` : `<div class="ui-chip js-bestchip">🏆 ${data.best.toFixed(1)} m</div>
          <button class="ui-hud-btn js-pause" aria-label="Pause">${icon('pause')}</button>`}
      </div>
      <div class="js-toast"></div>
      <button class="ui-hud-btn js-rot" aria-label="Turn">${icon('redo')}</button>`;
    ui.querySelector('.js-pause')?.addEventListener('click', () => { sound.pop(); pause(); });
    ui.querySelector('.js-rot').addEventListener('click', () => turn(1));
  }

  function toast(text) {
    const t = ui.querySelector('.js-toast');
    if (!t) return;
    t.textContent = text;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
  }

  function pause() {
    if (mode !== 'play') return;
    if (held) drop(true);
    mode = 'paused';
    const p = document.createElement('div');
    p.className = 'ui-overlay js-pop';
    p.innerHTML = `<div class="ui-panel">
      <h3 class="ui-title">Paused</h3>
      <div class="ui-row"><button class="ui-btn primary big resume">${icon('play')} Resume</button></div>
      <div class="ui-row">
        <button class="ui-btn restart">${icon('retry')} Start again</button>
        <button class="ui-btn ghost quit">${icon('menu')} Menu</button>
      </div></div>`;
    ui.appendChild(p);
    p.querySelector('.resume').onclick = () => { sound.pop(); p.remove(); mode = 'play'; };
    p.querySelector('.restart').onclick = () => { sound.pop(); startGame(); };
    p.querySelector('.quit').onclick = () => { sound.pop(); showMenu(); };
  }

  function gameOver() {
    mode = 'over';
    const h = Math.round(maxTop * 100) / 100;
    const best = h > data.best;
    if (best) { data.best = h; save(data); }
    const bc = ui.querySelector('.js-bestchip');
    if (bc) bc.textContent = `🏆 ${data.best.toFixed(1)} m`;
    if (best && h > 0.5) { sound.win(); setTimeout(() => sound.cheer(), 400); }
    const p = document.createElement('div');
    p.className = 'ui-overlay js-pop js-result';
    p.innerHTML = `<div class="ui-panel">
      <div class="ui-kicker">Splash! 🌊</div>
      <h3 class="ui-title">${h.toFixed(2)} m tall!</h3>
      <p class="ui-sub">${best && h > 0.5 ? '🏆 New best!' : `Best: ${data.best.toFixed(2)} m`}</p>
      <div class="ui-row js-foot">
        <button class="ui-btn ghost quit">${icon('menu')} Menu</button>
        <button class="ui-btn primary big again">${icon('retry')} Play again</button>
      </div></div>`;
    ui.appendChild(p);
    ui.querySelector('.js-rot')?.remove();
    p.querySelector('.again').onclick = () => { sound.pop(); startGame(); };
    p.querySelector('.quit').onclick = () => { sound.pop(); showMenu(); };
  }

  // ---------- racing friends ----------
  function enterRoom(room) {
    net = connect(room, { onChange: onNet, onClosed: () => leaveRoom('The race has finished 👋') });
    mode = 'lobby';
    lastLobbyHtml = '';
    leaveWorld();
    showLobby();
  }

  async function joinFromInvite(code) {
    ui.innerHTML = `<div class="ui-overlay js-menu"><div class="ui-panel"><div class="ui-kicker">Junk Stack</div><h2 class="ui-title">Joining your friend…</h2></div></div>`;
    try {
      const room = await findRoom(code);
      if (closed) { if (room) room.leave(); return; }
      if (!room) { showMenu('That race has finished 👋'); return; }
      joinedRoom(GAME_ID, code);
      enterRoom(room);
    } catch (e) { showMenu("Couldn't connect 😢"); }
  }

  function leaveRoom(msg = '') {
    if (net) { net.leave(); net = null; }
    leftRoom();
    race = null;
    showMenu(msg);
  }

  function onNet() {
    if (!net) return;
    const meta = net.meta();
    if (!meta) return;
    if (meta.phase === 'race' && meta.race && (!race || meta.race.id !== race.id)) {
      if (net.now() < meta.race.start + meta.race.dur - 5000) { startRace(meta.race); return; }
    }
    if (meta.phase === 'lobby' && racing()) {
      mode = 'lobby';
      race = null;
      leaveWorld();
      lastLobbyHtml = '';
    }
    if (mode === 'lobby') showLobby();
    if (mode === 'race-result') showRaceResult();
  }

  function showLobby() {
    const list = net.people();
    const host = list.find(p => p.host);
    const doing = 'getting the race ready';
    const lock = !net.isHost ? '' : notReady(list).length || list.length < 2 ? startLabel(list) : '';
    const html = `<div class="ui-overlay js-menu"><div class="ui-panel wide">
      <div class="ui-kicker">Junk Stack</div>
      <h2 class="ui-title">Race friends!</h2>
      <p class="ui-sub">Same junk for everyone. ${RACE_SECONDS / 60} minutes. Splash and you're out. Tallest tower wins!</p>
      ${lobbyHTML(list, { hostDoing: doing, myUid: net.uid })}
      ${net.isHost ? '' : waitHTML(host, doing, net.ready())}
      <div class="ui-row js-foot">
        <button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave</button>
        ${net.isHost ? `<button class="ui-btn primary big ${lock ? 'tg-locked' : ''}" data-a="go" ${lock ? 'disabled' : ''}>${icon('play')} Start</button>` : ''}
      </div>
      ${lock ? `<p class="ui-sub">${lock}</p>` : ''}
    </div></div>`;
    const same = html.replace(/data-tg="\d+"/g, '');
    if (same === lastLobbyHtml && ui.querySelector('.js-menu')) return;
    lastLobbyHtml = same;
    ui.innerHTML = html;
    ui.querySelector('[data-ready]')?.addEventListener('click', () => { sound.pop(); net.setReady(!net.ready()); });
    ui.querySelector('[data-a="leave"]').addEventListener('click', () => { sound.pop(); leaveRoom(); });
    ui.querySelector('[data-a="go"]')?.addEventListener('click', () => { sound.pop(); net.startRace(); });
  }

  function startRace(r) {
    race = r;
    newWorld(r.seed);
    myFinal = null;
    lastCount = -1;
    mode = 'race-wait';
    buildUI();
  }

  function finishRace(out) {
    if (held) drop(false);
    myFinal = Math.round(maxTop * 100) / 100;
    net.sendTower(race.id, bodies, maxTop, { out, f: myFinal, now: true });
    mode = 'race-result';
    resultAt = time;
    ui.querySelector('.js-rot')?.remove();
    showRaceResult();
  }

  function raceTick() {
    const now = net.now();
    const tEl = ui.querySelector('.js-time');
    if (mode === 'race-wait') {
      const left = Math.ceil((race.start - now) / 1000);
      if (left !== lastCount && left > 0 && left <= 3) { toast(String(left)); sound.tok(); }
      lastCount = left;
      if (now >= race.start) { mode = 'race'; toast('Go! 🏗️'); sound.whoosh(); }
      if (tEl) tEl.textContent = fmt(race.dur);
    } else if (mode === 'race') {
      const left = race.start + race.dur - now;
      if (tEl) {
        tEl.textContent = fmt(left);
        tEl.classList.toggle('hurry', left < 10000);
      }
      const sec = Math.ceil(left / 1000);
      if (sec <= 5 && sec > 0 && sec !== lastCount) { sound.tok(); lastCount = sec; }
      net.sendTower(race.id, bodies, maxTop);
      if (left <= 0) { toast("Time's up! ⏱️"); sound.whoosh(); finishRace(false); }
    }
    const rk = ui.querySelector('.js-rank');
    if (rk) {
      const mine = myFinal ?? maxTop;
      const others = net.towers(race.id);
      const place = 1 + others.filter(o => (o.f ?? o.h) > mine).length;
      rk.textContent = others.length ? `${place}${['st', 'nd', 'rd'][place - 1] || 'th'} of ${others.length + 1}` : 'Solo';
    }
  }
  const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  function showRaceResult() {
    const me = net.people().find(p => p.pid === net.pid) || { face: '🙂', name: 'Me' };
    const over = net.now() > race.start + race.dur + 6000;
    const rows = [
      { ...me, me: true, h: myFinal, status: lost ? '🌊' : '✅', done: true },
      ...net.towers(race.id).map(t => ({ ...t, h: t.f ?? t.h, status: t.out ? '🌊' : t.f !== null ? '✅' : '🏗️', done: t.f !== null || over })),
    ];
    rows.sort((a, b) => (b.h ?? -1) - (a.h ?? -1));
    const allIn = rows.every(r => r.done);
    const iWon = allIn && rows[0].me && rows.length > 1;
    const html = `<div class="ui-panel">
      <div class="ui-kicker">${lost ? 'Splash! 🌊' : 'Race'}</div>
      <h3 class="ui-title">${!allIn ? 'Friends still building…' : iWon ? 'You win! 🏆' : rows.length > 1 ? `${nameHTML(rows[0].name)} wins! 🏆` : `${myFinal.toFixed(2)} m!`}</h3>
      <div class="js-ranks">${rows.map((r, i) => `<div class="js-rk ${r.me ? 'me' : ''}">
          <span class="pl">${allIn ? (i === 0 ? '👑' : i + 1) : ''}</span><span class="fc">${r.face}</span>
          <b>${r.me ? 'You' : nameHTML(r.name)}</b><span class="stt">${r.status}</span><span class="hh">${(r.h ?? 0).toFixed(2)} m</span></div>`).join('')}</div>
      <div class="ui-row js-foot">
        <button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave</button>
        ${net.isHost ? `<button class="ui-btn primary" data-a="again">${icon('retry')} Race again</button>` : `<span class="ui-sub">Waiting for the next race…</span>`}
      </div></div>`;
    let p = ui.querySelector('.js-result');
    if (p && p.dataset.html === html) return;
    const wasIn = p && p.dataset.allIn === '1';
    if (!p) {
      p = document.createElement('div');
      p.className = 'ui-overlay js-pop js-result';
      ui.appendChild(p);
    }
    if (allIn && !wasIn && iWon) { sound.win(); setTimeout(() => sound.cheer(), 400); }
    p.dataset.allIn = allIn ? '1' : '0';
    p.dataset.html = html;
    p.innerHTML = html;
    p.querySelector('[data-a="leave"]').onclick = () => { sound.pop(); leaveRoom(); };
    const ag = p.querySelector('[data-a="again"]');
    if (ag) ag.onclick = () => { sound.pop(); net.backToLobby(); };
  }

  // ---------- the boat ----------
  // Where the boat is on screen. Pinned to the bottom if the sea is out of view.
  function boatPlace(l) {
    const bob = Math.sin(time * 2) * 0.06;
    let deckY = sy(l, DECK + bob);
    deckY = Math.min(deckY, l.playH - 0.9 * l.s);
    return { cx: sx(l, boat.x), deckY, k: l.s };
  }
  function slotAt(e) {
    if (!boat || boat.phase !== 'docked') return -1;
    const p = pointerWorld(e);
    const bp = boatPlace(p.l);
    let best = -1, bestD = Infinity;
    boat.items.forEach((it, i) => {
      if (!it) return;
      const ds = deckScale(it.type, it.sc);
      const hgt = ITEMS[it.type].h * it.sc.y * ds;
      const ix = bp.cx + SLOTS[i] * bp.k, iy = bp.deckY - hgt / 2 * bp.k;
      const rad = Math.max(38, itemR(it.type, it.sc) * ds * bp.k + 10);
      const d = Math.hypot(p.px - ix, p.py - iy);
      if (d < rad && d < bestD) { best = i; bestD = d; }
    });
    return best;
  }
  function updateBoat(dt) {
    if (!boat) return;
    boat.t += dt;
    if (boat.phase === 'in') {
      const k = Math.min(1, boat.t / 2.2);
      boat.x = -16 * Math.pow(1 - k, 3);
      if (k >= 1) { boat.phase = 'docked'; boat.t = 0; }
    } else if (boat.phase === 'docked') {
      if (boat.items.every(it => !it) && !(held && held.boatId === boat.id)) { boat.phase = 'out'; boat.t = 0; }
    } else if (boat.phase === 'out') {
      const k = Math.min(1, boat.t / 1.8);
      boat.x = 16 * k * k;
      if (k >= 1) newBoat();
    }
  }

  // ---------- crane: pick up, move, turn, drop ----------
  // Tap junk on the boat: the crane lifts it up above the tower and holds it there.
  function pick(slot, e) {
    if (!canBuild() || !boat || boat.phase !== 'docked') return;
    const it = boat.items[slot];
    if (!it) return;
    e.preventDefault();
    if (held) { if (held.pointerId !== null) return; drop(true); } // swap: put the hanging one back
    const r = itemR(it.type, it.sc);
    const x = 0;
    const y = Math.max(towerTop() + r + 1, 1 + r);
    const body = makeBody(world, it.type, x, y, rot * ROT, it.sc);
    body.setFixedRotation(true);
    const joint = world.createJoint(new planck.MouseJoint(
      { maxForce: 70 * body.getMass(), frequencyHz: 3.5, dampingRatio: 0.85 }, ground, body, Vec2(x, y)));
    held = { body, joint, slot, boatId: boat.id, type: it.type, sc: it.sc, r, pointerId: null, target: { x, y }, grab: null };
    boat.items[slot] = null;
    sound.pop();
    if (picks++ < 2) toast('Now drag it onto the tower! 👆');
  }
  // Then press anywhere and drag: the item moves with your finger. Let go to drop it.
  function grab(e) {
    e.preventDefault();
    canvas.setPointerCapture?.(e.pointerId);
    const p = pointerWorld(e);
    held.pointerId = e.pointerId;
    held.grab = { dx: held.target.x - p.x, dy: held.target.y - p.y };
  }
  function clampX(x, l, r) {
    const lim = Math.max(1, l.viewW / 2 - r * 0.6);
    return Math.max(-lim, Math.min(lim, x));
  }

  function onMove(e) {
    if (!held || held.pointerId === null || e.pointerId !== held.pointerId) return;
    const p = pointerWorld(e);
    const r = held.r;
    const x = clampX(p.x + held.grab.dx, p.l, r);
    const y = Math.max(0.3 + r * 0.5, Math.min(p.y + held.grab.dy, camY + p.l.viewH - r * 0.5));
    held.target = { x, y };
    held.joint.setTarget(Vec2(x, y));
  }
  function onUp(e) {
    if (!held || held.pointerId === null || e.pointerId !== held.pointerId) return;
    drop(false);
  }
  // let go. back=true puts it back on the boat.
  function drop(back) {
    const h = held;
    held = null;
    world.destroyJoint(h.joint);
    if (back) {
      world.destroyBody(h.body);
      if (boat && boat.id === h.boatId) boat.items[h.slot] = { type: h.type, sc: h.sc };
      return;
    }
    h.body.setFixedRotation(false);
    h.body.setAwake(true);
    const v = h.body.getLinearVelocity();
    const sp = Math.hypot(v.x, v.y);
    if (sp > 6) h.body.setLinearVelocity(Vec2(v.x * 6 / sp, v.y * 6 / sp));
    bodies.push({ body: h.body, type: h.type, sc: h.sc, wet: false });
    sound.tok();
  }

  function turn(dir) {
    if (!canBuild() && mode !== 'race-wait') return;
    sound.tok();
    if (held) {
      const b = held.body;
      b.setTransform(b.getPosition(), b.getAngle() - dir * ROT);
      b.setAwake(true);
    } else rot = (rot + dir + 8) % 8;
  }

  function onCanvasDown(e) {
    if (e.target !== canvas) return;
    const slot = slotAt(e);
    if (held && held.pointerId !== null) { if (e.pointerId !== held.pointerId) { e.preventDefault(); turn(1); } return; } // 2nd finger = turn
    if (slot >= 0) { pick(slot, e); return; }
    if (held) grab(e);
  }
  function onWheel(e) {
    if (!held) return;
    e.preventDefault();
    turn(e.deltaY > 0 ? 1 : -1);
  }
  function onKey(e) {
    if (e.key === 'r' || e.key === 'R' || e.key === 'ArrowUp') turn(1);
    else if (e.key === 'ArrowDown') turn(-1);
    else if (e.key === 'Escape') pause();
  }
  function onContext(e) { if (held) e.preventDefault(); }

  // ---------- simulation ----------
  const gust = t => Math.sin(t * 0.37 + 0.6) * (0.75 + 0.25 * Math.sin(t * 1.9));

  function splashLose() {
    if (lost) return;
    lost = true;
    if (held) drop(false);
    if (mode === 'play') setTimeout(() => { if (mode === 'play') gameOver(); }, 900);
    else if (mode === 'race') setTimeout(() => { if (mode === 'race') { toast("Splash! You're out 🌊"); finishRace(true); } }, 900);
  }

  function update(dt) {
    time += dt;
    const live = world && mode !== 'paused' && mode !== 'menu' && mode !== 'lobby';
    if (live) {
      updateBoat(dt);
      acc = Math.min(acc + dt, 0.1);
      while (acc >= STEP) {
        const g = wind * gust(time);
        if (g) bodies.forEach(it => {
          const pos = it.body.getPosition();
          if (pos.y > 4 && !it.wet) it.body.applyForceToCenter(Vec2(it.body.getMass() * g * Math.min(1, pos.y / 20), 0), true);
        });
        if (held) {
          const v = held.body.getLinearVelocity();
          const sp = Math.hypot(v.x, v.y);
          if (sp > 10) held.body.setLinearVelocity(Vec2(v.x * 10 / sp, v.y * 10 / sp));
        }
        world.step(STEP, 10, 8);
        acc -= STEP;
      }
      // anything in the sea = game over
      for (let k = bodies.length - 1; k >= 0; k--) {
        const it = bodies[k];
        const pos = it.body.getPosition();
        if (!it.wet && pos.y < SEA) {
          it.wet = true;
          splash(pos.x);
          if (mode === 'play' || mode === 'race') splashLose();
        }
        if (pos.y < SEA - 4) { world.destroyBody(it.body); bodies.splice(k, 1); }
      }
      if (!lost && (mode === 'play' || mode === 'race')) {
        const top = towerTop();
        if (top > maxTop) maxTop = top;
        wind = maxTop > 8 ? Math.min(2.2, (maxTop - 8) * 0.12) : 0;
      }
      if (net && race && racing()) raceTick();
      const hEl = ui.querySelector('.js-height');
      if (hEl) hEl.textContent = `${(myFinal ?? maxTop).toFixed(1)} m`;
    }
    if (mode === 'race-result' && Math.floor(time) !== Math.floor(time - dt)) showRaceResult();
    scenery.update(dt, sceneView(L()));
    particles.forEach(p => { p.vy -= 12 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);

    // camera: keep the sea (and the boat) in view, zoom out as the tower grows
    const l = L();
    const panel = (mode === 'over' || mode === 'race-result') ? ui.querySelector('.js-result .ui-panel') : null;
    const panelPx = panel ? panel.offsetHeight + 40 : 0;
    let top = Math.max(towerTop(), maxTop * 0.6);
    if (held) top = Math.max(top, held.body.getPosition().y + held.r);
    const above = panel ? 2 : 5.5;
    const availPx = Math.max(120, l.playH - panelPx - (panel ? 100 : 0));
    const need = top + above - BASE_CAM;
    let targetZoom = Math.max(MIN_ZOOM, Math.min(1, availPx / (need * l.s1)));
    let targetCam = BASE_CAM - panelPx / (l.s1 * targetZoom);
    const viewHz = l.playH / (l.s1 * targetZoom);
    if (!panel && top + above > targetCam + viewHz) targetCam = top + above - viewHz; // very tall: scroll up
    zoom += (targetZoom - zoom) * Math.min(1, dt * 2.5);
    camY += (targetCam - camY) * Math.min(1, dt * 2.5);
    const hx = held ? held.body.getPosition().x : craneX;
    craneX += (hx - craneX) * Math.min(1, dt * 8);
  }

  function splash(x) {
    sound.splash();
    for (let i = 0; i < 18; i++) {
      particles.push({ x: x + (Math.random() - 0.5) * 0.8, y: SEA, vx: (Math.random() - 0.5) * 4, vy: 3 + Math.random() * 5, life: 0.6 + Math.random() * 0.5, r: 0.06 + Math.random() * 0.08 });
    }
  }

  // ---------- drawing ----------
  const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mix = (a, b, t) => {
    const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
  };
  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function sceneView(l) {
    return {
      ctx, w: l.w, playH: l.playH, s: l.s, time, sx: x => sx(l, x), sy: y => sy(l, y),
      seaY: sy(l, SEA), topY: sy(l, Math.max(0, towerTop())),
    };
  }

  function draw() {
    const l = L();
    const { w, h, playH, s } = l;
    ctx.clearRect(0, 0, w, h);

    // sky gets deeper blue the higher you go
    const alt = Math.max(0, Math.min(1, maxTop / 40));
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, mix('#4aa3ec', '#14205a', alt));
    sky.addColorStop(1, mix('#c4ecff', '#5b8fe0', alt));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    if (alt > 0.4) {
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = (alt - 0.4) * 1.5;
      for (let i = 0; i < 60; i++) ctx.fillRect(rnd(i) * w, rnd(i + 99) * playH * 0.7, 2, 2);
      ctx.globalAlpha = 1;
    }

    // clouds, and things flying about
    const v = sceneView(l);
    scenery.drawClouds(v, camY);
    scenery.drawSky(v);

    // wind streaks
    const g = wind * gust(time);
    if (Math.abs(g) > 0.05) {
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) {
        const yy = rnd(i + 40) * playH * 0.7;
        const len = Math.abs(g) * 25 + 10;
        let xx = ((rnd(i + 50) * w + time * g * 120) % (w + 200));
        if (xx < -100) xx += w + 200;
        ctx.globalAlpha = Math.min(1, Math.abs(g) / 1.2) * 0.6;
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - Math.sign(g) * len, yy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // far islands + sea (back)
    const seaY = sy(l, SEA);
    ctx.fillStyle = '#7fb3a8';
    ctx.beginPath();
    ctx.moveTo(0, seaY);
    ctx.quadraticCurveTo(w * 0.12, seaY - 2.2 * s, w * 0.25, seaY);
    ctx.quadraticCurveTo(w * 0.82, seaY - 3 * s, w, seaY - 0.6 * s);
    ctx.lineTo(w, seaY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2f8fd8';
    ctx.fillRect(0, seaY, w, h - seaY);

    // rock + platform
    ctx.fillStyle = '#7b6a5d';
    ctx.beginPath();
    ctx.moveTo(sx(l, -PW * 0.38), sy(l, -0.5)); ctx.lineTo(sx(l, PW * 0.38), sy(l, -0.5));
    ctx.lineTo(sx(l, PW * 0.62), sy(l, SEA - 3)); ctx.lineTo(sx(l, -PW * 0.62), sy(l, SEA - 3));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.moveTo(sx(l, PW * 0.1), sy(l, -0.5)); ctx.lineTo(sx(l, PW * 0.38), sy(l, -0.5));
    ctx.lineTo(sx(l, PW * 0.62), sy(l, SEA - 3)); ctx.lineTo(sx(l, PW * 0.25), sy(l, SEA - 3));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#455a64';
    ctx.fillRect(sx(l, -PW / 2), sy(l, 0), PW * s, 0.6 * s);
    ctx.save();
    ctx.beginPath(); ctx.rect(sx(l, -PW / 2), sy(l, 0), PW * s, 0.18 * s); ctx.clip();
    ctx.fillStyle = '#ffca28'; ctx.fillRect(sx(l, -PW / 2), sy(l, 0), PW * s, 0.18 * s);
    ctx.fillStyle = '#263238';
    for (let x = -PW / 2 - 1; x < PW / 2 + 1; x += 0.5) {
      ctx.beginPath();
      ctx.moveTo(sx(l, x), sy(l, 0) + 0.18 * s); ctx.lineTo(sx(l, x + 0.25), sy(l, 0) + 0.18 * s);
      ctx.lineTo(sx(l, x + 0.43), sy(l, 0)); ctx.lineTo(sx(l, x + 0.18), sy(l, 0));
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // height ruler on the right
    if (world) {
      const rx = w - 8;
      ctx.font = '700 12px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      const step = s < 14 ? 10 : s < 22 ? 5 : s < 40 ? 2 : 1;
      for (let m = 0; m < 500; m += step) {
        const y = sy(l, m);
        if (y < 0) break;
        if (y > playH) continue;
        const big = m % (step * 5) === 0;
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.fillRect(rx - (big ? 14 : 8), y - 1, big ? 14 : 8, 2);
        if (big || step >= 2) ctx.fillText(`${m}m`, rx - 18, y);
      }
      // best height so far
      if (maxTop > 0.3) {
        const y = sy(l, maxTop);
        ctx.strokeStyle = 'rgba(250,204,21,.9)';
        ctx.setLineDash([8, 8]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx(l, -PW * 0.8), y); ctx.lineTo(w - 60, y); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // stacked items
    const drawBody = (b, type, sc) => {
      const p = b.getPosition();
      ctx.save();
      ctx.translate(sx(l, p.x), sy(l, p.y));
      ctx.rotate(-b.getAngle());
      ctx.scale(s, -s);
      drawItem(ctx, type, sc);
      ctx.restore();
    };
    bodies.forEach(it => drawBody(it.body, it.type, it.sc));

    // things poking out of the sea (behind the barge)
    scenery.drawSea(v, false);

    // boat (in front of the rock)
    if (boat) drawBoat(l);

    // crane
    if (mode === 'play' || mode === 'paused' || mode === 'race' || mode === 'race-wait') drawCrane(l);
    if (held) drawBody(held.body, held.type, held.sc);
    scenery.drawUfo(v);

    // sea (front, so things sink in)
    const wave = t => Math.sin(t) * 0.08 * s;
    ctx.fillStyle = 'rgba(47,143,216,.82)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 10; x += 10) ctx.lineTo(x, seaY + 0.12 * s + wave(x * 0.03 + time * 2));
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w + 10; x += 10) {
      const y = seaY + 0.12 * s + wave(x * 0.03 + time * 2);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    // sea creatures: under the water (a bit faded), then the ones poking out
    ctx.globalAlpha = 0.85;
    scenery.drawSea(v, true);
    ctx.globalAlpha = 1;

    // splash drops
    ctx.fillStyle = '#e3f4ff';
    particles.forEach(p => {
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.beginPath(); ctx.arc(sx(l, p.x), sy(l, p.y), p.r * s, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (net && race && (mode === 'race' || mode === 'race-wait')) drawFriends(l);
  }

  function drawBoat(l) {
    const { cx, deckY, k } = boatPlace(l);
    ctx.save();
    ctx.translate(cx, deckY);
    // rusty rubbish barge, with tyres hung on the side
    ctx.fillStyle = '#4e6b4a';
    ctx.beginPath();
    ctx.moveTo(-3.4 * k, -0.05 * k); ctx.lineTo(3.6 * k, -0.05 * k);
    ctx.lineTo(3.2 * k, 1.0 * k); ctx.lineTo(-3.1 * k, 1.0 * k); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a0522d'; ctx.globalAlpha = 0.6;
    [[-2.6, 0.1, 0.12, 0.6], [-0.4, 0.05, 0.1, 0.5], [1.7, 0.1, 0.14, 0.7], [2.9, 0.05, 0.08, 0.4]].forEach(([x, y, w, h]) => ctx.fillRect(x * k, y * k, w * k, h * k));
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffca28'; ctx.fillRect(-3.35 * k, 0.05 * k, 6.9 * k, 0.1 * k);
    ctx.fillStyle = '#212121';
    [-2.0, 0.1, 2.2].forEach(x => { ctx.beginPath(); ctx.arc(x * k, 0.5 * k, 0.22 * k, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#4e6b4a';
    [-2.0, 0.1, 2.2].forEach(x => { ctx.beginPath(); ctx.arc(x * k, 0.5 * k, 0.1 * k, 0, Math.PI * 2); ctx.fill(); });
    // deck, tug cabin at the back, chimney puffing smoke
    ctx.fillStyle = '#6d5a4b'; ctx.fillRect(-3.4 * k, -0.14 * k, 7.0 * k, 0.14 * k);
    ctx.fillStyle = '#f5f5f5'; ctx.fillRect(-3.35 * k, -1.0 * k, 0.8 * k, 0.88 * k);
    ctx.fillStyle = '#e53935'; ctx.fillRect(-3.4 * k, -1.08 * k, 0.9 * k, 0.12 * k);
    ctx.fillStyle = '#4fc3f7'; ctx.fillRect(-3.2 * k, -0.85 * k, 0.5 * k, 0.32 * k);
    ctx.fillStyle = '#37474f'; ctx.fillRect(-3.1 * k, -1.55 * k, 0.24 * k, 0.48 * k);
    for (let i = 0; i < 3; i++) {
      const t = (time * 0.5 + i / 3) % 1;
      ctx.fillStyle = `rgba(200,200,200,${0.6 * (1 - t)})`;
      ctx.beginPath(); ctx.arc((-2.98 - t * 0.6) * k, (-1.6 - t * 1.2) * k, (0.12 + t * 0.25) * k, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // junk on deck (shown smaller if it's big)
    const glow = boat.phase === 'docked' && canBuild() && !held;
    boat.items.forEach((it, i) => {
      if (!it) return;
      const ds = deckScale(it.type, it.sc);
      const hgt = ITEMS[it.type].h * it.sc.y * ds;
      const ix = cx + SLOTS[i] * k, iy = deckY - (0.12 + hgt / 2) * k;
      if (glow) {
        ctx.fillStyle = `rgba(255,255,255,${0.18 + 0.12 * Math.sin(time * 4 + i)})`;
        ctx.beginPath(); ctx.arc(ix, iy, Math.max(30, itemR(it.type, it.sc) * ds * k + 6), 0, Math.PI * 2); ctx.fill();
      }
      ctx.save();
      ctx.translate(ix, iy);
      ctx.rotate(-rot * ROT);
      ctx.scale(k * ds, -k * ds);
      drawItem(ctx, it.type, it.sc);
      ctx.restore();
    });
  }

  // Little windows down the left showing each friend's tower right now.
  function drawFriends(l) {
    const list = net.towers(race.id);
    if (!list.length) return;
    const bw = l.w < 600 ? 84 : 120;
    const labelH = 34;
    const room = l.playH * 0.62 - 120;
    const bh = Math.max(70, Math.min(bw * 1.5, room / list.length - labelH - 8));
    const best = Math.max(maxTop, ...list.map(t => t.h));
    list.forEach((t, n) => {
      const x0 = 10, y0 = 120 + n * (bh + labelH + 8);
      if (y0 + bh > l.playH) return;
      const lead = t.h >= best && best > 0.3;
      ctx.save();
      if (t.out) ctx.globalAlpha = 0.55;
      rrect(x0, y0, bw, bh + labelH, 12);
      ctx.fillStyle = 'rgba(16,18,38,.55)'; ctx.fill();
      ctx.strokeStyle = lead ? '#facc15' : 'rgba(255,255,255,.25)';
      ctx.lineWidth = 2; ctx.stroke();
      rrect(x0 + 3, y0 + 3, bw - 6, bh - 3, 10);
      ctx.clip();
      const sky = ctx.createLinearGradient(0, y0, 0, y0 + bh);
      sky.addColorStop(0, '#5aaef0'); sky.addColorStop(1, '#c4ecff');
      ctx.fillStyle = sky; ctx.fillRect(x0, y0, bw, bh);
      const k2 = Math.min((bw - 6) / 8, (bh - 8) / (Math.max(3, t.h) + 3.2));
      const cx = x0 + bw / 2, baseY = y0 + bh - 1.4 * k2 - 4;
      ctx.fillStyle = '#2f8fd8'; ctx.fillRect(x0, baseY + 1.2 * k2, bw, bh);
      ctx.fillStyle = '#455a64'; ctx.fillRect(cx - PW / 2 * k2, baseY, PW * k2, 0.6 * k2);
      ctx.fillStyle = '#ffca28'; ctx.fillRect(cx - PW / 2 * k2, baseY, PW * k2, Math.max(1, 0.18 * k2));
      t.items.forEach(it => {
        ctx.save();
        ctx.translate(cx + it.x * k2, baseY - it.y * k2);
        ctx.rotate(-it.a);
        ctx.scale(k2, -k2);
        drawItem(ctx, it.type, it.sc);
        ctx.restore();
      });
      ctx.restore();
      ctx.font = '800 13px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(`${t.face} ${String(t.name || 'Friend').slice(0, 10)}`, x0 + bw / 2, y0 + bh + 10);
      ctx.fillStyle = lead ? '#facc15' : 'rgba(255,255,255,.8)';
      ctx.fillText(`${t.h.toFixed(1)} m${t.out ? ' 🌊' : lead ? ' 👑' : ''}`, x0 + bw / 2, y0 + bh + 25);
    });
  }

  function drawCrane(l) {
    const { w, s } = l;
    const beamY = 100;
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(0, beamY - 12, w, 12);
    ctx.strokeStyle = '#c17900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x += 24) { ctx.moveTo(x, beamY - 12); ctx.lineTo(x + 12, beamY); ctx.lineTo(x + 24, beamY - 12); }
    ctx.stroke();
    const tx = sx(l, craneX);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(tx - 16, beamY - 2, 32, 12);
    let hy, hx;
    if (held) {
      const p = held.body.getPosition();
      hx = sx(l, p.x);
      hy = sy(l, p.y) - Math.min(ITEMS[held.type].h * held.sc.y / 2 + 0.15, held.r) * s;
    } else {
      hx = tx + Math.sin(time * 1.6) * 4;
      hy = beamY + 50;
    }
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(tx, beamY + 10); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hx, hy + 6, 6, -Math.PI / 2, Math.PI * 0.9); ctx.stroke();
  }

  // ---------- go ----------
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  window.addEventListener('keydown', onKey);
  stage.addEventListener('pointerdown', onCanvasDown);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('contextmenu', onContext);

  if (/[?&]jsdebug/.test(location.search)) {
    // tests: make / join a room without friends, and peek inside
    window.__jsHost = async () => { const r = await makeRoom(); enterRoom(r); return r.code; };
    window.__jsJoin = code => joinFromInvite(code);
    window.__jsScene = scenery._debug;
    window.__js = () => {
      const l = L();
      const bp = boat ? boatPlace(l) : null;
      return {
        mode, maxTop, bodies: bodies.length, held: !!held, lost,
        boat: boat && { phase: boat.phase, slots: boat.items.map((it, i) => it && { x: bp.cx + SLOTS[i] * bp.k, y: bp.deckY - 20 }) },
        platformY: sy(l, 0), cx: sx(l, 0), s: l.s,
      };
    };
  }

  const stop = startLoop(update, draw);
  const inviteCode = takeJoinCode(GAME_ID);
  if (inviteCode) joinFromInvite(inviteCode); else showMenu();

  return () => {
    closed = true;
    stop();
    if (net) { net.leave(); net = null; leftRoom(); }
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('keydown', onKey);
    stage.removeEventListener('pointerdown', onCanvasDown);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
