// Tank Tantrum – take turns driving, aiming and firing silly weapons.
// Last tank standing wins. Play on one device (pass it round, or against
// computer tanks) or with friends ("Play with friends", js/engine/together.js).
// Files: sim.js (world + rules, no DOM), weapons.js, ai.js (computer tanks),
// render.js (drawing), online.js (rooms), game.js (screens + controls).
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound } from '../../js/engine/sound.js';
import { icon } from '../../js/engine/icons.js';
import { togetherButton, playTogether, takeJoinCode, joined as joinedRoom, leftRoom, people, lobbyHTML, waitHTML, readyButton, allReady, notReady, startLabel } from '../../js/engine/together.js';
import { World, W, H, DT, MAX_SPEED, MAX_FUEL, MAPS, WATER_Y } from './sim.js';
import { WEAPONS, WEAPON } from './weapons.js';
import { planShot } from './ai.js';
import { createRenderer, tankIcon, randomLook, sanitizeLook, TANK_COLORS, HATS, FLAGS, NAMES } from './render.js';
import { myName } from '../../js/engine/profile.js';
import { makeRoom, findRoom, connect, MAP_IDS, GAME_ID } from './online.js';

const TURN_TIME = 45;
const NEXT_GAME = 15;   // online: seconds until the next game starts
const MAX_TANKS = 6;
const LOOK_KEY = 'tt-look', LOCAL_KEY = 'tt-local';
const DANCES = ['bounce', 'spin', 'wiggle', 'flip'];
const SLOT_TYPES = ['human', 'easy', 'tricky', 'off'];
const SLOT_LABEL = { human: 'Player', easy: 'Easy computer', tricky: 'Tricky computer', off: 'Empty' };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r2 = n => Math.round(n * 100) / 100;

function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; }
}
function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* storage full or blocked */ } }

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const root = document.createElement('div');
  root.className = 'tt';
  stage.appendChild(root);
  const view = createCanvas(root);
  const ui = document.createElement('div');
  ui.className = 'tt-ui';
  root.appendChild(ui);
  const renderer = createRenderer();

  // ---------------------------------------------------------------- state
  let myLook = sanitizeLook(load(LOOK_KEY, null) || randomLook(0));
  // my name from the main menu, unless I gave my tank a name of its own
  if (myName() && (NAMES.includes(myLook.name) || myLook.name === 'Tank')) myLook.name = myName();
  const localSetup = (() => {
    const s = load(LOCAL_KEY, null);
    const slots = [0, 1, 2, 3].map(i => {
      const o = s && s.slots && s.slots[i];
      return { type: o && SLOT_TYPES.includes(o.type) ? o.type : (i === 1 ? 'easy' : 'off'), look: sanitizeLook(o && o.look ? o.look : randomLook(i + 1)) };
    });
    slots[0].type = 'human';
    return { slots, map: s && (MAPS[s.map] || s.map === 'random') ? s.map : 'random', wind: !!(s && s.wind) };
  })();

  let screen = 'title';
  let match = null;       // the game being played (or the demo behind the menus)
  let replay = null;      // kill cam
  let net = null;         // online connection
  let lastLobbyHtml = '';
  let time = 0, acc = 0, closed = false;
  const cam = { x: W / 2, y: H / 2, z: 0.6 };
  let overview = false, userPan = false, userZoom = 1;
  let aim = null;         // { dx, dy, power } while aiming
  let aiming = null;      // pointer id of the aiming drag
  let driveDir = 0, keyDrive = 0, spaceAt = 0;
  let elev = 0.6;         // keyboard aim angle
  const pointers = new Map();
  let pinch = null;

  const pickMap = m => (m === 'random' || !MAPS[m] ? MAP_IDS[Math.floor(Math.random() * MAP_IDS.length)] : m);

  // ---------------------------------------------------------------- matches
  // ctrl[i]: 'me' (a person on this device), 'easy'/'tricky' (computer on this device), 'remote'
  function newMatch({ seed, map, wind, looks, ctrl, mode, owners, gameId }) {
    const world = new World({ seed, map, wind, tanks: looks });
    match = {
      world, mode, ctrl, owners: owners || [], gameId,
      sel: looks.map(() => 'shell'),
      humans: ctrl.filter(c => c === 'me').length,
      turnStart: 0, ready: true, plan: null, planAt: 0, sentSkip: false,
      snap: null, lastShot: null, died: false, resolved: false, checked: new Set(),
      picked: [], over: null, overShown: false, hitTick: {},
    };
    replay = null;
    acc = 0;
    renderer.setWorld(world);
    world.beginTurn();
    userPan = false; overview = true; userZoom = 1;   // zoomed out: see everyone
    focusNow();
  }
  function startDemo() {
    const n = 3;
    newMatch({
      seed: Math.floor(Math.random() * 1e9), map: pickMap('random'), wind: true,
      looks: [0, 1, 2].map(i => randomLook(Math.floor(Math.random() * 8) + i)),
      ctrl: Array(n).fill('tricky'), mode: 'demo',
    });
    overview = true;
  }
  const isDemo = () => match && match.mode === 'demo';
  const muted = () => !match || isDemo();

  function startLocal() {
    const slots = localSetup.slots.filter(s => s.type !== 'off');
    if (slots.length < 2) return;
    const looks = slots.map((s, i) => (i === 0 ? myLook : s.look));
    newMatch({
      seed: Math.floor(Math.random() * 1e9), map: pickMap(localSetup.map), wind: localSetup.wind,
      looks, ctrl: slots.map(s => (s.type === 'human' ? 'me' : s.type)), mode: 'local',
    });
    show('game');
  }

  function startOnline(game) {
    const roster = Array.isArray(game.roster) ? game.roster.slice(0, MAX_TANKS) : [];
    if (roster.length < 2) return false;
    const hostPid = net.hostPid();
    const looks = roster.map(r => sanitizeLook(r.look));
    const ctrl = roster.map(r => (r.pid ? (r.pid === net.pid ? 'me' : 'remote') : (net.isHost ? (r.bot === 'tricky' ? 'tricky' : 'easy') : 'remote')));
    const owners = roster.map(r => (r.pid ? r.pid : hostPid));
    if (!ctrl.includes('me')) return false;   // joined after it started
    net.joinGame(game.id);
    newMatch({ seed: game.seed >>> 0, map: MAPS[game.map] ? game.map : 'grass', wind: game.wind === true, looks, ctrl, owners, mode: 'online', gameId: game.id });
    show('game');
    return true;
  }

  function onTurnStart() {
    const w = match.world, i = w.active;
    match.turnStart = time;
    match.plan = null;
    match.planAt = time + (isDemo() ? 0.8 : 1.4);
    match.sentSkip = false;
    match.picked = [];
    match.resolved = false;
    match.died = false;
    aim = null; aiming = null;
    const t = w.tanks[i];
    if (t.ammo[match.sel[i]] === 0) match.sel[i] = 'shell';
    elev = 0.6;
    match.ready = !(match.mode === 'local' && match.humans > 1 && match.ctrl[i] === 'me');
    userPan = false;
    overview = true; userZoom = 1;   // back to seeing everyone each turn
    closeBackpack();
    if (!match.ready) readyCard();
    else hideCard();
  }

  const myTurn = () => match && !replay && match.world.phase === 'aim' && match.ctrl[match.world.active] === 'me' && match.ready;
  const activeTank = () => match.world.tanks[match.world.active];

  // A shot from this device (person or computer).
  function fire(shot) {
    const w = match.world;
    if (w.phase !== 'aim') return;
    if (match.mode === 'online' && match.ctrl[w.active] !== 'remote') net.sendShot(w.turn, shot);
    applyShot(shot);
  }
  function applyShot(shot) {
    const w = match.world;
    match.snap = w.snapshot();
    match.lastShot = shot;
    match.died = false;
    match.resolved = false;
    match.lastOwnerTurn = { n: w.turn, mine: match.ctrl[w.active] !== 'remote', owner: match.owners[w.active] };
    match.shotTurn = w.turn;
    aim = null; aiming = null;
    userPan = false;
    closeBackpack();
    w.applyShot(shot);
  }

  function shootFromAim() {
    const w = match.world, t = activeTank();
    const wid = match.sel[w.active];
    const p = aim ? aim.power : 0;
    if (!WEAPON[wid].noAim && p < 0.08) return;
    fire({
      x: r2(t.x), y: r2(t.y), f: t.face, w: wid,
      vx: aim ? r2(aim.dx * p * MAX_SPEED) : 0, vy: aim ? r2(aim.dy * p * MAX_SPEED) : 0,
      picked: match.picked.slice(),
    });
  }

  // ---------------------------------------------------------------- update
  function update(dt) {
    if (closed) return;
    time += dt;
    renderer.update(dt);
    if (!match) return;
    if (replay) { stepReplay(dt); updateCamera(dt); return; }
    const w = match.world;
    if (w.phase === 'fly' || w.phase === 'settle') {
      acc += dt * (isDemo() ? 1.3 : 1);
      let n = 0;
      while (acc >= DT && n++ < 10) { w.step(); acc -= DT; events(w, true); }
      if (n >= 10) acc = 0;
    } else acc = 0;
    renderer.syncTerrain();

    if ((w.phase === 'done' || w.phase === 'over') && !match.resolved) resolveShot();
    else if (w.phase === 'done') { w.beginTurn(); }
    else if (w.phase === 'aim') aimPhase(dt);
    else if (w.phase === 'over') gameOver(dt);

    // a new turn just started
    if (w.phase !== 'fly' && w.phase !== 'done' && match.turnSeen !== w.turn) {
      match.turnSeen = w.turn;
      onTurnStart();
    }
    updateCamera(dt);
    updateHud();
  }

  function resolveShot() {
    const w = match.world;
    match.resolved = true;
    const lo = match.lastOwnerTurn;
    const shotNow = match.shotTurn === w.turn;   // not a rain/mine turn-start settle
    if (shotNow) match.afterLocal = { n: w.turn, t: w.tankState() };
    if (shotNow && match.mode === 'online' && lo && lo.mine && net) net.sendAfter(lo.n, w.tankState());
    if (shotNow && match.died && match.snap && match.lastShot && !isDemo()) startReplay();
    else if (w.phase === 'done') w.beginTurn();
  }

  function events(w, real) {
    for (const e of w.events) {
      renderer.fx(e);
      if (real && e.type === 'dmg') match.hitTick[e.tank] = w.ticks;
      if (real && e.type === 'drown') match.hitTick[e.tank] = w.ticks;
      if (real && (e.type === 'die' || e.type === 'drown')) { match.died = true; match.victim = e.tank; }
      if (!muted() && (real || replay)) sfx(e);
    }
    w.events.length = 0;
  }

  function aimPhase(dt) {
    const w = match.world, i = w.active, t = w.tanks[i], c = match.ctrl[i];
    // did the last shooter's device see the same result? (online)
    if (match.mode === 'online' && match.lastOwnerTurn && !match.lastOwnerTurn.mine && !match.checked.has(match.lastOwnerTurn.n)) {
      const st = net.after(match.lastOwnerTurn.n, match.lastOwnerTurn.owner);
      if (st) {
        match.checked.add(match.lastOwnerTurn.n);
        if (match.afterLocal && match.afterLocal.n === match.lastOwnerTurn.n && w.fixTanks(st, match.afterLocal.t)) console.warn('tank-tantrum: out of step, fixed');
      }
    }
    if (c === 'me') {
      if (!match.ready) { match.turnStart = time; return; }
      if (time - match.turnStart > TURN_TIME) { fire({ skip: 1 }); return; }
      const dir = driveDir || keyDrive;
      if (dir) {
        if (w.drive(dir, dt)) {
          match.picked.push(...w.pickupNear(t));
          events(w, true);
          if (!muted() && Math.random() < dt * 8) sound.tone(70 + Math.random() * 20, 0.08, 'square', 0.04);
          if (aim) aim.dx = Math.abs(aim.dx) * dir;
        }
      }
      if (spaceAt) {
        const p = Math.min(1, (time - spaceAt) / 1.6);
        aim = { dx: t.face * Math.cos(elev), dy: -Math.sin(elev), power: p };
      }
      if (match.mode === 'online') {
        net.sendDrive({ n: w.turn, x: r2(t.x), y: r2(t.y), f: t.face, ax: aim ? r2(aim.dx) : t.aimX, ay: aim ? r2(aim.dy) : t.aimY, p: aim ? r2(aim.power) : 0, w: match.sel[i] });
      }
    } else if (c === 'easy' || c === 'tricky') {
      if (!match.plan && time >= match.planAt) {
        match.plan = planShot(w, c);
        match.planAt = time + 0.9;
        if (!match.plan.skip && match.plan.w) match.sel[i] = match.plan.w;
      }
      if (match.plan) {
        const p = match.plan, sp = Math.hypot(p.vx, p.vy) || 1;
        const k = Math.min(1, 1 - (match.planAt - time) / 0.9);
        if (!p.skip && !WEAPON[p.w].noAim) aim = { dx: p.vx / sp, dy: p.vy / sp, power: (sp / MAX_SPEED) * k };
        if (time >= match.planAt) fire(p);
      }
    } else { // remote
      const owner = match.owners[i];
      const d = net.drive(owner);
      if (d && d.n === w.turn) {
        t.x += (d.x - t.x) * Math.min(1, dt * 10);
        t.y = d.y; t.face = d.f;
        match.sel[i] = d.w;
        aim = d.p > 0 ? { dx: d.ax, dy: d.ay, power: d.p } : null;
        if (!aim) { t.aimX = d.ax; t.aimY = d.ay; }
      }
      const shot = net.shot(w.turn, owner);
      if (shot) { applyShot(shot); return; }
      if (net.isHost && !match.sentSkip) {
        if (!net.hasPlayer(owner)) { match.goneSince = match.goneSince || time; } else match.goneSince = 0;
        if ((match.goneSince && time - match.goneSince > 6) || time - match.turnStart > TURN_TIME + 20) {
          match.sentSkip = true;
          net.sendShot(w.turn, { skip: 1 });
        }
      }
    }
  }

  // ---------------------------------------------------------------- kill cam
  function startReplay() {
    const rw = World.fromSnapshot(match.snap);
    rw.applyShot(match.lastShot);
    // skip to just before the knock-out hit, then show it slowly
    const hit = match.hitTick[match.victim] ?? rw.ticks;
    while (rw.ticks < hit - 75 && (rw.phase === 'fly' || rw.phase === 'settle')) rw.step();
    rw.events.length = 0;
    replay = { world: rw, acc: 0, t: 0, victim: match.victim, end: hit + 50 };
    renderer.setWorld(rw);
    banner('🎬 REPLAY', 2500);
  }
  function stepReplay(dt) {
    const rw = replay.world;
    replay.t += dt;
    replay.acc += dt * 0.45;
    while (replay.acc >= DT) { rw.step(); replay.acc -= DT; events(rw, false); }
    renderer.syncTerrain();
    if ((rw.phase !== 'fly' && rw.phase !== 'settle') || rw.ticks > replay.end || replay.t > 8) endReplay();
  }
  function endReplay() {
    replay = null;
    renderer.setWorld(match.world);
    if (match.world.phase === 'done') match.world.beginTurn();
  }

  // ---------------------------------------------------------------- game over
  function gameOver(dt) {
    const w = match.world;
    if (!match.over) {
      match.over = { t: 0, kind: DANCES[Math.floor(Math.random() * DANCES.length)] };
      if (isDemo()) { setTimeout(() => { if (!closed && isDemo() && match.world === w) startDemo(); }, 3500); }
      else { sound.win(); winCard(); }
      if (match.mode === 'online') match.over.nextAt = time + NEXT_GAME;
    }
    match.over.t += dt;
    if (match.mode === 'online' && match.over.nextAt) {   // next game starts by itself
      const left = Math.max(0, Math.ceil(match.over.nextAt - time));
      const el = ui.querySelector('.tt-next b');
      if (el && el.textContent !== String(left)) el.textContent = left;
      if (left <= 0 && net && net.isHost && !match.over.started) { match.over.started = true; nextOrLobby(); }
    }
    if (w.winner >= 0 && Math.random() < dt * 4) {
      const t = w.tanks[w.winner];
      renderer.confetti(t.x + (Math.random() - 0.5) * 300, t.y - 250);
    }
  }

  // ---------------------------------------------------------------- camera
  function baseZoom() { return Math.min(1.4, Math.max(0.45, Math.max(view.width / 1400, view.height / 1000))); }
  // Zooming is smooth from "whole map" (overview) up to close in.
  function curZoom() { return overview ? fitZoom() : baseZoom() * userZoom; }
  // (px, py) = the screen spot to zoom around (finger or mouse)
  function setZoom(z, px = view.width / 2, py = view.height / 2) {
    const fit = fitZoom();
    z = Math.min(baseZoom() * 2.2, Math.max(fit, z));
    if (z <= fit * 1.02) { overview = true; userZoom = 1; userPan = false; return; }
    const wx = cam.x + (px - view.width / 2) / cam.z, wy = cam.y + (py - view.height / 2) / cam.z;
    overview = false; userPan = true;
    userZoom = z / baseZoom();
    cam.z = z;
    cam.x = wx - (px - view.width / 2) / z;
    cam.y = wy - (py - view.height / 2) / z;
    clampCam();
  }
  function fitZoom() { return Math.min(view.width / W, view.height / (H - 100)); }
  function camTarget() {
    const w = replay ? replay.world : match.world;
    if (overview && !replay && w.phase !== 'over') {
      const z = fitZoom();   // whole map, with the sea line just above the buttons
      return { x: W / 2, y: WATER_Y + 30 - (view.height / 2 - 110) / z, z };
    }
    const z = baseZoom() * userZoom;
    if (w.projectiles.length) {
      const p = w.projectiles[0];
      return { x: p.x, y: Math.max(p.y, -300), z };
    }
    if (w.boots.length) return { x: w.boots[0].x, y: Math.max(w.boots[0].y, 200), z };
    if (replay && w.tanks[replay.victim]) return { x: w.tanks[replay.victim].x, y: w.tanks[replay.victim].y - 80, z: z * 1.3 };
    if (w.phase === 'over' && w.winner >= 0) return { x: w.tanks[w.winner].x, y: w.tanks[w.winner].y - 100, z: z * 1.4 };
    const t = w.tanks[w.active];
    if (!t) return { x: cam.x, y: cam.y, z };
    return { x: t.x, y: t.y - 100, z };
  }
  function clampCam() {
    const hw = view.width / 2 / cam.z, hh = view.height / 2 / cam.z;
    const pad = overview ? 0 : 320;   // a bit of sea past each end, so edge tanks can be in the middle
    cam.x = W + pad * 2 < hw * 2 ? W / 2 : Math.min(W + pad - hw, Math.max(hw - pad, cam.x));
    const top = -500 + hh, bottom = H + (overview ? 400 : 200) - hh;
    cam.y = bottom < top ? (top + bottom) / 2 : Math.min(bottom, Math.max(top, cam.y));
  }
  function updateCamera(dt) {
    const tg = camTarget();
    const k = Math.min(1, dt * 4);
    if (!userPan || overview) {
      cam.x += (tg.x - cam.x) * k;
      cam.y += (tg.y - cam.y) * k;
    }
    cam.z += (tg.z - cam.z) * k;
    clampCam();
  }
  function focusNow() { const tg = camTarget(); cam.x = tg.x; cam.y = tg.y; cam.z = tg.z; clampCam(); }

  function draw() {
    const ctx = view.ctx;
    const w = replay ? replay.world : match && match.world;
    let aimOpt = null;
    if (w && aim && w.phase === 'aim' && !replay) aimOpt = { tank: w.active, ...aim };
    const dance = match && match.over && w && w.winner >= 0 ? { tank: w.winner, t: match.over.t, kind: match.over.kind } : null;
    renderer.draw(ctx, view, cam, { time, aim: aimOpt, dance });
    if (replay) {
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.fillRect(0, 0, view.width, 40); ctx.fillRect(0, view.height - 40, view.width, 40);
    }
  }

  // ---------------------------------------------------------------- input
  const canvas = view.canvas;
  const tankScreen = t => {
    const k = t.shrink > 0 ? 0.5 : 1;
    return { x: (t.x - cam.x) * cam.z + view.width / 2, y: (t.y - 20 * k - cam.y) * cam.z + view.height / 2 };
  };
  function setAimFromPointer(e) {
    const t = activeTank(), s = tankScreen(t);
    const r = canvas.getBoundingClientRect();
    const dx = s.x - (e.clientX - r.left), dy = s.y - (e.clientY - r.top);
    const l = Math.hypot(dx, dy);
    if (l < 4) { aim = { dx: t.face, dy: -0.5, power: 0 }; return; }
    aim = { dx: dx / l, dy: dy / l, power: Math.min(1, l / 170) };
    if (Math.abs(aim.dx) > 0.05) t.face = aim.dx > 0 ? 1 : -1;
    t.aimX = aim.dx; t.aimY = aim.dy;
  }
  function onDown(e) {
    if (screen !== 'game' || !match) return;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      aiming = null; aim = null;
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: curZoom() };
      return;
    }
    if (myTurn() && !WEAPON[match.sel[match.world.active]].noAim) {
      const s = tankScreen(activeTank());
      const r = canvas.getBoundingClientRect();
      if (Math.hypot(s.x - (e.clientX - r.left), s.y - (e.clientY - r.top)) < Math.max(90, 40 * cam.z)) {
        aiming = e.pointerId;
        setAimFromPointer(e);
        return;
      }
    }
  }
  function onMove(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const r = canvas.getBoundingClientRect();
      setZoom(pinch.z * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    if (aiming === e.pointerId) { if (myTurn()) setAimFromPointer(e); return; }
    if (Math.abs(dx) + Math.abs(dy) > 0) {
      userPan = true;
      cam.x -= dx / cam.z; cam.y -= dy / cam.z;
      clampCam();
    }
  }
  function onUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (aiming === e.pointerId) {
      aiming = null;
      if (myTurn() && aim && aim.power >= 0.08) shootFromAim();
      else aim = null;
    }
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  const onWheel = e => {
    if (screen !== 'game') return;
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    setZoom(curZoom() * (e.deltaY > 0 ? 0.9 : 1.1), e.clientX - r.left, e.clientY - r.top);
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });

  const typing = () => document.activeElement && document.activeElement.tagName === 'INPUT';
  function onKey(e) {
    if (screen !== 'game' || !match || typing()) return;
    const down = e.type === 'keydown';
    const code = e.code;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(code)) e.preventDefault();
    if (code === 'ArrowLeft' || code === 'KeyA') keyDrive = down ? -1 : (keyDrive === -1 ? 0 : keyDrive);
    if (code === 'ArrowRight' || code === 'KeyD') keyDrive = down ? 1 : (keyDrive === 1 ? 0 : keyDrive);
    if (!myTurn()) { if (code === 'Space' && !down) spaceAt = 0; return; }
    const t = activeTank();
    if (down && (code === 'ArrowUp' || code === 'KeyW' || code === 'ArrowDown' || code === 'KeyS')) {
      elev = Math.min(1.55, Math.max(-0.2, elev + (code === 'ArrowUp' || code === 'KeyW' ? 0.06 : -0.06)));
      aim = { dx: t.face * Math.cos(elev), dy: -Math.sin(elev), power: aim ? aim.power : 0.5 };
      t.aimX = aim.dx; t.aimY = aim.dy;
    }
    if (down && (code === 'KeyQ' || code === 'KeyE')) cycleWeapon(code === 'KeyE' ? 1 : -1);
    if (code === 'Space') {
      if (down && !e.repeat) {
        if (WEAPON[match.sel[match.world.active]].noAim) { shootFromAim(); return; }
        if (aim) elev = Math.atan2(-aim.dy, Math.abs(aim.dx));
        spaceAt = time;
      } else if (!down && spaceAt) {
        spaceAt = 0;
        shootFromAim();
      }
    }
  }
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  function cycleWeapon(d) {
    const i = match.world.active, t = activeTank();
    const ids = WEAPONS.filter(w => t.ammo[w.id] !== 0).map(w => w.id);
    const cur = ids.indexOf(match.sel[i]);
    match.sel[i] = ids[(cur + d + ids.length) % ids.length];
    sound.pop();
  }

  // ---------------------------------------------------------------- sounds
  function sfx(e) {
    const T = sound.tone, N = sound.noise;
    switch (e.type) {
      case 'explode': N(0.5, 260, 0.45); T(90, 0.3, 'sine', 0.3, 40); break;
      case 'bigboom': N(0.9, 160, 0.6); T(70, 0.6, 'sawtooth', 0.2, 30); break;
      case 'pop': T(900 + Math.random() * 600, 0.07, 'square', 0.05, 1500); break;
      case 'burst': for (let i = 0; i < 6; i++) setTimeout(() => T(700 + Math.random() * 900, 0.08, 'square', 0.06, 1600), i * 70); break;
      case 'whoopee': T(130, 0.8, 'sawtooth', 0.22, 55); break;
      case 'stomp': N(0.5, 100, 0.6); T(55, 0.4, 'square', 0.2, 30); break;
      case 'splash': sound.splash(); break;
      case 'bounce': T(650, 0.12, 'square', 0.1, 1300); setTimeout(() => T(900, 0.1, 'square', 0.08, 500), 90); break;
      case 'dig': N(0.35, 400, 0.25); break;
      case 'pickup': T(700, 0.1, 'triangle', 0.2); setTimeout(() => T(1050, 0.15, 'triangle', 0.2), 90); break;
      case 'flush': N(1.1, 700, 0.3); T(500, 0.7, 'sine', 0.15, 90); break;
      case 'cloudOn': case 'rain': T(220, 0.5, 'triangle', 0.15, 150); break;
      case 'shrink': T(1300, 0.45, 'sine', 0.15, 250); break;
      case 'fizz': T(300, 0.3, 'sine', 0.1, 100); break;
      case 'wall': T(260, 0.35, 'sine', 0.2, 700); break;
      case 'catch': T(1000, 0.1, 'sine', 0.2, 1400); break;
      case 'flare': T(1500, 0.3, 'sine', 0.1, 600); break;
      case 'crate': T(500, 0.25, 'triangle', 0.1, 900); break;
      case 'pull': T(180, 0.3, 'sawtooth', 0.08, 360); break;
      case 'thud': T(80, 0.12, 'square', 0.1, 50); break;
      case 'skip': T(300, 0.4, 'sine', 0.12, 150); break;
      case 'fire':
        if (e.w === 'chicken') { T(800, 0.15, 'square', 0.1, 1400); }
        else if (e.w === 'toilet') { /* flush sound comes next */ }
        else { T(240, 0.15, 'square', 0.14, 90); N(0.15, 1200, 0.15); }
        break;
    }
  }

  // ---------------------------------------------------------------- HUD
  function buildHud() {
    ui.innerHTML = `
      <div class="tt-hud">
        <div class="tt-top">
          <div class="tt-who"><canvas></canvas><span class="tt-name"></span><span class="tt-timer"></span></div>
          <div class="tt-wind"><span>🌬️</span><b></b></div>
        </div>
        <div class="tt-side">
          <button class="ui-hud-btn tt-mapbtn" aria-label="See the whole map">🗺️</button>
          <button class="ui-hud-btn tt-quit" aria-label="Pause">${icon('pause')}</button>
        </div>
        <div class="tt-room"></div>
        <div class="tt-drive">
          <button data-dir="-1" aria-label="Drive left">${icon('left')}</button>
          <div class="tt-fuel"><i></i><span>⛽</span></div>
          <button data-dir="1" aria-label="Drive right">${icon('right')}</button>
        </div>
        <div class="tt-arms">
          <button class="tt-fire" aria-label="Fire">🔥</button>
          <button class="tt-weapon" aria-label="Pick a weapon"><span class="i"></span><span class="c"></span></button>
        </div>
        <div class="tt-hint"></div>
      </div>
      <div class="tt-bp" hidden></div>
      <div class="tt-banner" hidden></div>
      <div class="tt-card-wrap" hidden></div>`;
    hud.root = ui.querySelector('.tt-hud');
    hud.who = ui.querySelector('.tt-who canvas');
    hud.name = ui.querySelector('.tt-name');
    hud.timer = ui.querySelector('.tt-timer');
    hud.wind = ui.querySelector('.tt-wind b');
    hud.drive = ui.querySelector('.tt-drive');
    hud.fuel = ui.querySelector('.tt-fuel i');
    hud.arms = ui.querySelector('.tt-arms');
    hud.wIcon = ui.querySelector('.tt-weapon .i');
    hud.wCount = ui.querySelector('.tt-weapon .c');
    hud.fire = ui.querySelector('.tt-fire');
    hud.hint = ui.querySelector('.tt-hint');
    hud.room = ui.querySelector('.tt-room');
    hud.cache = {};
    hud.drive.querySelectorAll('button').forEach(b => {
      const dir = Number(b.dataset.dir);
      const stop = () => { if (driveDir === dir) driveDir = 0; b.classList.remove('on'); };
      b.addEventListener('pointerdown', e => { e.preventDefault(); driveDir = dir; b.classList.add('on'); b.setPointerCapture && b.setPointerCapture(e.pointerId); });
      b.addEventListener('pointerup', stop);
      b.addEventListener('pointercancel', stop);
      b.addEventListener('lostpointercapture', stop);
    });
    ui.querySelector('.tt-weapon').addEventListener('click', () => { sound.pop(); openBackpack(); });
    hud.fire.addEventListener('click', () => { if (myTurn()) shootFromAim(); });
    ui.querySelector('.tt-mapbtn').addEventListener('click', () => { sound.pop(); overview = !overview; userZoom = 1; userPan = false; });
    ui.querySelector('.tt-quit').addEventListener('click', () => { sound.pop(); quitCard(); });
  }
  const hud = {};
  const setText = (key, el, v) => { if (hud.cache[key] !== v) { hud.cache[key] = v; el.textContent = v; } };
  const setShow = (key, el, v) => { if (hud.cache[key] !== v) { hud.cache[key] = v; el.hidden = !v; } };

  function updateHud() {
    if (screen !== 'game' || !hud.root || !match) return;
    const w = match.world, t = w.tanks[w.active];
    const mine = myTurn();
    const whoKey = w.active + ':' + t.look.name;
    if (hud.cache.who !== whoKey) { hud.cache.who = whoKey; tankIcon(hud.who, t.look, 44); }
    let name = t.look.name;
    if (w.phase === 'over') name = '🏁';
    else if (match.ctrl[w.active] === 'easy' || match.ctrl[w.active] === 'tricky') name += ' 🤖';
    setText('name', hud.name, name);
    const left = w.phase === 'aim' && match.ready && match.ctrl[w.active] !== 'easy' && match.ctrl[w.active] !== 'tricky' ? Math.max(0, Math.ceil(TURN_TIME - (time - match.turnStart))) : '';
    setText('timer', hud.timer, left === '' ? '' : String(left));
    hud.timer.classList.toggle('low', left !== '' && left <= 10);
    const wind = w.wind;
    setShow('windPill', hud.wind.parentElement, !!w.windOn);
    setText('wind', hud.wind, wind === 0 ? '·' : (wind < 0 ? '⬅'.repeat(Math.ceil(Math.abs(wind) / 4)) : '➡'.repeat(Math.ceil(wind / 4))));
    setShow('drive', hud.drive, mine);
    setShow('arms', hud.arms, mine);
    if (mine) {
      hud.fuel.style.width = (t.fuel / MAX_FUEL * 100) + '%';
      const wid = match.sel[w.active], wp = WEAPON[wid];
      setText('wIcon', hud.wIcon, wp.icon);
      const n = t.ammo[wid];
      setText('wCount', hud.wCount, n < 0 ? '∞' : '×' + n);
      setShow('fire', hud.fire, !!wp.noAim);
      setText('fireTxt', hud.fire, wp.noAim ? wp.icon + ' Go!' : '🔥');
    }
    let hint = '';
    if (mine && w.turn <= 3 && !aim) hint = WEAPON[match.sel[w.active]].noAim ? 'Tap Go! to use it' : 'Drag back from your tank to aim 🎯 Let go to FIRE!';
    else if (w.phase === 'aim' && match.ctrl[w.active] === 'remote') hint = t.look.name + ' is having a go…';
    setText('hint', hud.hint, hint);
    setShow('hint', hud.hint, !!hint);
  }

  function openBackpack() {
    if (!myTurn()) return;
    const bp = ui.querySelector('.tt-bp');
    const i = match.world.active, t = activeTank();
    bp.innerHTML = `<div class="tt-bp-card ui-panel wide">
        <button class="tt-x ui-btn ghost round small" aria-label="Close">${icon('close')}</button>
        <div class="ui-kicker">Tank Tantrum</div>
        <h2 class="ui-title">Pick a weapon</h2>
        <div class="tt-bp-grid ui-choices tight">${WEAPONS.map(wp => {
          const n = t.ammo[wp.id];
          return `<button class="tt-wp ui-choice ${match.sel[i] === wp.id ? 'on' : ''}" data-w="${wp.id}" ${n === 0 ? 'disabled' : ''}>
            <span class="i">${wp.icon}</span><b>${wp.name}</b><small>${wp.desc}</small><span class="n">${n < 0 ? '∞' : '×' + n}</span></button>`;
        }).join('')}</div></div>`;
    bp.hidden = false;
    bp.querySelector('.tt-x').addEventListener('click', () => { sound.pop(); closeBackpack(); });
    bp.addEventListener('pointerdown', e => { if (e.target === bp) closeBackpack(); });
    bp.querySelectorAll('[data-w]').forEach(b => b.addEventListener('click', () => {
      if (!myTurn()) return;
      match.sel[i] = b.dataset.w;
      sound.pop();
      closeBackpack();
    }));
  }
  function closeBackpack() { const bp = ui.querySelector('.tt-bp'); if (bp) { bp.hidden = true; bp.innerHTML = ''; } }

  let bannerTimer = null;
  function banner(text, ms = 2000) {
    const b = ui.querySelector('.tt-banner');
    if (!b) return;
    b.textContent = text;
    b.hidden = false;
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => { b.hidden = true; }, ms);
  }

  function card(html) {
    const wrap = ui.querySelector('.tt-card-wrap');
    if (!wrap) return null;
    wrap.className = 'tt-card-wrap';
    wrap.innerHTML = `<div class="tt-card ui-panel">${html}</div>`;
    wrap.hidden = false;
    return wrap;
  }
  function hideCard() { const wrap = ui.querySelector('.tt-card-wrap'); if (wrap) { wrap.hidden = true; wrap.innerHTML = ''; } }

  function readyCard() {
    const t = activeTank();
    const wrap = card(`<canvas class="tt-big-tank"></canvas><div class="ui-kicker">Your turn</div><h2 class="ui-title">${esc(t.look.name)}</h2><button class="ui-btn primary big tt-go">${icon('play')} Go</button>`);
    tankIcon(wrap.querySelector('canvas'), t.look, 140);
    wrap.querySelector('.tt-go').addEventListener('click', () => { sound.pop(); match.ready = true; match.turnStart = time; hideCard(); focusNow(); });
  }

  function winCard() {
    const w = match.world;
    const t = w.tanks[w.winner];
    const title = t ? `${esc(t.look.name)} wins!` : 'Nobody wins!';
    let buttons;
    if (match.mode === 'online') {
      const next = `<p class="ui-sub tt-next">Next game in <b>${NEXT_GAME}</b>…</p>`;
      buttons = net && net.isHost
        ? `${next}<div class="ui-row tt-foot"><button class="ui-btn ghost" data-a="lobby">${icon('people')} Room</button><button class="ui-btn primary" data-a="again">${icon('play')} Play now</button></div>`
        : `${next}<div class="ui-row tt-foot"><button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave room</button></div>`;
    } else buttons = `<button class="ui-btn ghost" data-a="menu">${icon('home')} Menu</button><button class="ui-btn primary" data-a="again">${icon('retry')} Again</button>`;
    setTimeout(() => {
      if (closed || !match || match.world !== w || screen !== 'game') return;
      const wrap = card(`${t ? '<canvas class="tt-big-tank"></canvas>' : ''}<div class="ui-kicker">Game over</div><h2 class="ui-title">${title}</h2>${match.mode === 'online' ? buttons : `<div class="ui-row tt-foot">${buttons}</div>`}`);
      wrap.classList.add('low');
      if (t) tankIcon(wrap.querySelector('canvas'), t.look, 120);
      wrap.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
        sound.pop();
        const a = b.dataset.a;
        if (a === 'again') { if (match.mode === 'online') { match.over.started = true; nextOrLobby(); } else startLocal(); }
        else if (a === 'menu') { startDemo(); show('local'); }
        else if (a === 'lobby') { net.setLobby({ phase: 'lobby' }); }
        else if (a === 'leave') confirmLeave();
      }));
    }, 2200);
  }

  function quitCard() {
    const online = match && match.mode === 'online';
    if (online) {   // the host can take everyone back to the room; friends can leave
      const host = net && net.isHost;
      const wrap = card(`<div class="ui-kicker">Tank Tantrum</div><h2 class="ui-title">${host ? 'Paused' : 'Leave the room?'}</h2><div class="tt-col">
        <button class="ui-btn primary big" data-a="no">${icon('play')} Resume</button>
        ${host ? `<button class="ui-btn" data-a="room">${icon('people')} Everyone back to room</button>` : ''}
        <button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave room</button></div>`);
      wrap.querySelector('[data-a="no"]').addEventListener('click', () => { sound.pop(); hideCard(); });
      const room = wrap.querySelector('[data-a="room"]');
      if (room) room.addEventListener('click', () => { sound.pop(); net.setLobby({ phase: 'lobby' }); });
      wrap.querySelector('[data-a="leave"]').addEventListener('click', () => { sound.pop(); leaveRoom(); });
      return;
    }
    const wrap = card(`<div class="ui-kicker">Tank Tantrum</div><h2 class="ui-title">Paused</h2><div class="tt-col">
      <button class="ui-btn primary big" data-a="no">${icon('play')} Resume</button>
      <button class="ui-btn" data-a="restart">${icon('retry')} Restart</button>
      <button class="ui-btn ghost" data-a="yes">${icon('leave')} Quit</button></div>`);
    wrap.querySelector('[data-a="restart"]').addEventListener('click', () => { sound.pop(); hideCard(); startLocal(); });
    wrap.querySelector('[data-a="no"]').addEventListener('click', () => { sound.pop(); hideCard(); if (!match.ready) readyCard(); });
    wrap.querySelector('[data-a="yes"]').addEventListener('click', () => {
      sound.pop();
      if (online) leaveRoom();
      else { startDemo(); show('local'); }
    });
  }

  // ---------------------------------------------------------------- menus
  function show(s) {
    screen = s;
    driveDir = 0; keyDrive = 0; spaceAt = 0;
    lastLobbyHtml = '';
    if (s === 'game') { buildHud(); return; }
    if (s === 'title') titleScreen();
    else if (s === 'local') localScreen();
    else if (s === 'lobby') lobbyScreen();
  }
  function panel(html, cls = '') {
    ui.innerHTML = `<div class="tt-menu ui-overlay ${cls}"><div class="tt-panel ui-panel ${/\bwide\b/.test(cls) ? 'wide' : ''}">${html}</div></div>`;
    return ui.querySelector('.tt-panel');
  }

  function titleScreen() {
    const p = panel(`
      <h1 class="ui-title">Tank Tantrum</h1>
      <p class="ui-sub">Take turns to aim and fire. Last tank standing wins.</p>
      <div class="ui-choices tt-modes">
        <button class="ui-choice" data-a="local"><span class="i">📱</span><span>Play here</span><small>Pass it round, or vs computer</small></button>
        <button class="ui-choice tt-mytank" data-a="tank"><canvas></canvas><span>My tank</span><small>${esc(myLook.name)} ${icon('edit')}</small></button>
      </div>
      ${togetherButton()}
      <p class="tt-msg"></p>`);
    tankIcon(p.querySelector(".tt-mytank canvas"), myLook, 56);
    p.querySelector('[data-a="local"]').addEventListener('click', () => { sound.pop(); show('local'); });
    p.querySelector('[data-together]').addEventListener('click', async () => {
      sound.pop();
      const msg = p.querySelector('.tt-msg');
      msg.textContent = '⏳';
      try {
        const room = await playTogether(GAME_ID, makeRoom);
        msg.textContent = '';
        if (!room) return;
        if (closed) { room.leave(); leftRoom(); return; }
        joined(room);
      } catch (e) { msg.textContent = "Couldn't connect 😢 Try again"; }
    });
    p.querySelector('[data-a="tank"]').addEventListener('click', () => { sound.pop(); editLook(myLook, l => { myLook = l; save(LOOK_KEY, l); titleScreen(); }); });
  }

  function windPicker(on) {
    return `<div class="tt-wind-row"><span class="ui-label">${icon('wind')} Wind</span><div class="ui-seg"><button class="${on ? '' : 'on'}" data-wind="0">Off</button><button class="${on ? 'on' : ''}" data-wind="1">On</button></div></div>`;
  }
  function mapPicker(cur) {
    return `<div class="tt-maps ui-choices tight">${[...MAP_IDS, 'random'].map(id => `<button class="tt-map ui-choice ${cur === id ? 'on' : ''}" data-map="${id}">
      <span class="i">${id === 'random' ? '🎲' : MAPS[id].icon}</span><span>${id === 'random' ? 'Surprise' : MAPS[id].name}</span></button>`).join('')}</div>`;
  }

  function localScreen() {
    const s = localSetup;
    const count = s.slots.filter(x => x.type !== 'off').length;
    const p = panel(`
      <div class="ui-kicker">Tank Tantrum</div>
      <h2 class="ui-title">Who's playing?</h2>
      <div class="ui-label">Players</div>
      <div class="tt-slots">${s.slots.map((sl, i) => {
        const look = i === 0 ? myLook : sl.look;
        const off = sl.type === 'off';
        return `<div class="tt-slot ${off ? 'off' : ''}">
          <button class="tt-slot-tank" data-edit="${i}" ${off ? 'disabled' : ''}><canvas></canvas><b>${off ? '—' : esc(look.name)}</b>${off ? '' : `<small>${icon('edit')}</small>`}</button>
          <button class="tt-slot-type" data-type="${i}" ${i === 0 ? 'disabled' : ''}>${SLOT_LABEL[sl.type]}</button>
        </div>`;
      }).join('')}</div>
      <div class="ui-label">Map</div>
      ${mapPicker(s.map)}
      ${windPicker(s.wind)}
      <div class="ui-row tt-foot">
        <button class="ui-btn ghost" data-a="back">${icon('back')} Back</button>
        <button class="ui-btn primary big" data-a="go" ${count < 2 ? 'disabled' : ''}>${icon('play')} Start</button>
      </div>`, 'wide');
    p.querySelectorAll('.tt-slot').forEach((el, i) => {
      const look = i === 0 ? myLook : s.slots[i].look;
      tankIcon(el.querySelector('canvas'), look, 80);
    });
    p.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      const i = Number(b.dataset.edit);
      editLook(i === 0 ? myLook : s.slots[i].look, l => {
        if (i === 0) { myLook = l; save(LOOK_KEY, l); } else s.slots[i].look = l;
        save(LOCAL_KEY, s);
        localScreen();
      });
    }));
    p.querySelectorAll('[data-type]').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      const sl = s.slots[Number(b.dataset.type)];
      sl.type = SLOT_TYPES[(SLOT_TYPES.indexOf(sl.type) + 1) % SLOT_TYPES.length];
      save(LOCAL_KEY, s);
      localScreen();
    }));
    p.querySelectorAll('[data-map]').forEach(b => b.addEventListener('click', () => { sound.pop(); s.map = b.dataset.map; save(LOCAL_KEY, s); localScreen(); }));
    p.querySelectorAll('[data-wind]').forEach(b => b.addEventListener('click', () => { sound.pop(); s.wind = b.dataset.wind === '1'; save(LOCAL_KEY, s); localScreen(); }));
    p.querySelector('[data-a="back"]').addEventListener('click', () => { sound.pop(); show('title'); });
    p.querySelector('[data-a="go"]').addEventListener('click', () => { sound.pop(); startLocal(); });
  }

  function editLook(start, done) {
    const look = { ...start };
    const wrap = document.createElement('div');
    wrap.className = 'tt-modal ui-overlay';
    wrap.innerHTML = `<div class="tt-edit ui-panel">
      <div class="ui-kicker">Tank Tantrum</div>
      <h2 class="ui-title">My tank</h2>
      <canvas class="tt-preview"></canvas>
      <input class="tt-input" maxlength="12" value="${esc(look.name)}" aria-label="Tank name" placeholder="Name">
      <div class="ui-label">Colour</div>
      <div class="tt-swatches">${TANK_COLORS.map(c => `<button class="tt-sw" data-c="${c}" style="--c:${c}" aria-label="Colour"></button>`).join('')}</div>
      <div class="ui-label">Hat</div>
      <div class="tt-picks" data-k="hat">${HATS.map(h => `<button data-v="${h}">${h || icon('close')}</button>`).join('')}</div>
      <div class="ui-label">Flag</div>
      <div class="tt-picks" data-k="flag">${FLAGS.map(f => `<button data-v="${f}">${f ? '🚩' + f : icon('close')}</button>`).join('')}</div>
      <div class="ui-row tt-foot end"><button class="ui-btn go big" data-a="done">${icon('check')} Done</button></div>
    </div>`;
    ui.appendChild(wrap);
    const prev = wrap.querySelector('.tt-preview');
    const refresh = () => {
      tankIcon(prev, look, 150);
      wrap.querySelectorAll('.tt-sw').forEach(b => b.classList.toggle('on', b.dataset.c === look.color));
      wrap.querySelectorAll('.tt-picks').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === look[g.dataset.k])));
    };
    refresh();
    wrap.querySelectorAll('.tt-sw').forEach(b => b.addEventListener('click', () => { look.color = b.dataset.c; sound.pop(); refresh(); }));
    wrap.querySelectorAll('.tt-picks').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { look[g.dataset.k] = b.dataset.v; sound.pop(); refresh(); })));
    const input = wrap.querySelector('.tt-input');
    input.addEventListener('input', () => { look.name = input.value; });
    wrap.querySelector('[data-a="done"]').addEventListener('click', () => {
      sound.pop();
      wrap.remove();
      done(sanitizeLook(look));
    });
  }

  // ---------------------------------------------------------------- play with friends
  // Opened from a friend's "come and play" pop-up: join their room straight away.
  async function joinFromInvite(code) {
    panel(`<div class="ui-kicker">Tank Tantrum</div><h2 class="ui-title">Joining your friend…</h2>`);
    try {
      const room = await findRoom(code);
      if (closed) { if (room) room.leave(); return; }
      if (!room) { finished(); return; }
      joinedRoom(GAME_ID, code);
      joined(room);
    } catch (e) { finished("Couldn't connect 😢"); }
  }
  function finished(text = 'That game has finished 👋') {
    leftRoom();
    const p = panel(`<div class="ui-kicker">Tank Tantrum</div><h2 class="ui-title">${text}</h2><button class="ui-btn primary" data-a="ok">${icon('check')} OK</button>`);
    p.querySelector('[data-a="ok"]').addEventListener('click', () => { sound.pop(); show('title'); });
  }

  function joined(room) {
    net = connect(room, myLook, {
      onChange: onNet,
      onClosed: () => {
        net = null;
        startDemo();
        finished();
      },
    });
    sound.win();
    show('lobby');
  }
  // Are you sure? (so nobody leaves the room by accident)
  function confirmLeave(thenHome = false) {
    const old = ui.querySelector('.tt-modal.leave');
    if (old) old.remove();
    const m = document.createElement('div');
    m.className = 'tt-modal ui-overlay leave';
    const host = net && net.isHost;
    m.innerHTML = `<div class="tt-edit ui-panel"><h2 class="ui-title">${host ? 'Close the room for everyone?' : 'Leave the room?'}</h2>
      <div class="ui-row tt-foot"><button class="ui-btn ghost" data-a="stay">${icon('back')} Stay</button><button class="ui-btn danger" data-a="go">${icon('leave')} Leave</button></div></div>`;
    ui.appendChild(m);
    m.querySelector('[data-a="stay"]').addEventListener('click', () => { sound.pop(); m.remove(); });
    m.querySelector('[data-a="go"]').addEventListener('click', async () => {
      sound.pop(); m.remove();
      await leaveRoom();
      if (thenHome) location.hash = '';
    });
  }
  const onHomeClick = e => {
    if (!net || closed) return;
    if (!(e.target.closest && e.target.closest('.home-btn'))) return;
    e.stopPropagation(); e.preventDefault();
    confirmLeave(true);
  };
  document.addEventListener('click', onHomeClick, true);

  async function leaveRoom() {
    const n = net;
    net = null;
    leftRoom();
    startDemo();
    show('title');
    if (n) await n.leave();
  }

  let lastPhase = null;
  function onNet() {
    if (!net) return;
    const meta = net.meta() || {};
    // back in the room after games: friends say I'm ready again (they may want a new tank)
    if (lastPhase === 'play' && meta.phase === 'lobby' && !net.isHost) net.setReady(false);
    if (meta.phase) lastPhase = meta.phase;
    if (meta.phase === 'play' && meta.game && (!match || match.gameId !== meta.game.id)) {
      if (startOnline(meta.game)) return;
    }
    if (meta.phase !== 'play' && screen === 'game' && match && match.mode === 'online') { startDemo(); show('lobby'); return; }
    if (screen === 'lobby') lobbyScreen();
  }

  function lobbyBots() { const m = net.meta() || {}; return Array.isArray(m.bots) ? m.bots.slice(0, MAX_TANKS) : []; }

  const hostUid = () => (net && net.hostPid() ? net.hostPid().split('_')[0] : null);
  const lobbyPeople = () => people(net.rawPlayers(), hostUid());

  function lobbyScreen() {
    if (!net) return;
    if (ui.querySelector('.tt-modal')) return;   // tank editor open: redraw when it closes
    const meta = net.meta() || {};
    const players = net.players();
    const bots = lobbyBots();
    const total = players.length + bots.length;
    const playing = meta.phase === 'play' && !(match && match.mode === 'online');
    const map = meta.map || 'random';
    const list = lobbyPeople();
    const host = list.find(x => x.host);
    const doing = 'picking the map';
    const lock = !net.isHost ? '' : notReady(list).length ? startLabel(list) : (total < 2 ? 'Wait for a friend, or add a 🤖' : '');
    const tanks = `<div class="tt-players">
        ${players.map(pl => `<div class="tt-pl ${pl.me ? 'me' : ''}"><canvas data-look='${esc(JSON.stringify(pl.look))}'></canvas><b>${esc(pl.look.name)}</b></div>`).join('')}
        ${bots.map((b, i) => `<div class="tt-pl bot"><canvas data-look='${esc(JSON.stringify(sanitizeLook(b.look)))}'></canvas><b>${esc(sanitizeLook(b.look).name)}</b><small>Computer</small>${net.isHost ? `<button class="tt-rm" data-rm="${i}" aria-label="Remove">${icon('close')}</button>` : ''}</div>`).join('')}
      </div>`;
    const html = `
      <div class="ui-kicker">Tank Tantrum</div>
      <h2 class="ui-title">Play with friends</h2>
      ${lobbyHTML(list, { hostDoing: doing, myUid: net.uid })}
      ${net.isHost ? `
        <div class="ui-label">Tanks</div>
        ${tanks}
        <div class="ui-row">
          <button class="ui-btn small" data-bot="easy" ${total >= MAX_TANKS ? 'disabled' : ''}>${icon('plus')} Easy computer</button>
          <button class="ui-btn small" data-bot="tricky" ${total >= MAX_TANKS ? 'disabled' : ''}>${icon('plus')} Tricky computer</button>
          <button class="ui-btn small" data-a="tank">${icon('edit')} My tank</button>
        </div>
        <div class="ui-label">Map</div>${mapPicker(map)}
        ${windPicker(meta.wind === true)}
        <div class="ui-row tt-foot">
          <button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave</button>
          <button class="ui-btn primary big ${lock ? 'tg-locked' : ''}" data-a="go" ${lock ? 'disabled' : ''}>${icon('play')} Start</button>
        </div>
        ${lock ? `<p class="ui-sub tt-lock">${lock}</p>` : ''}` : `
        ${playing
          ? `<div class="tg-wait"><div class="tg-wait-who">A game is going on. You can play in the next one!</div>${readyButton(net.ready())}</div>`
          : waitHTML(host, doing, net.ready())}
        <button class="ui-btn tt-mytank-big" data-a="tank"><canvas data-look='${esc(JSON.stringify(myLook))}'></canvas>${icon('edit')} My tank</button>
        <div class="ui-label">Tanks</div>
        ${tanks}
        <div class="ui-row tt-foot">
          <button class="ui-btn ghost" data-a="leave">${icon('leave')} Leave</button>
        </div>`}`;
    if (html === lastLobbyHtml && ui.querySelector('.tt-panel')) return;
    lastLobbyHtml = html;
    const old = ui.querySelector('.tt-menu.lobby');   // just an update: no pop, keep the scroll
    const scroll = old ? old.scrollTop : 0;
    const p = panel(html, old ? 'lobby again wide' : 'lobby wide');
    if (old) ui.querySelector('.tt-menu').scrollTop = scroll;
    p.querySelectorAll('canvas[data-look]').forEach(c => { try { tankIcon(c, sanitizeLook(JSON.parse(c.dataset.look)), 72); } catch (e) { /* bad look */ } });
    p.querySelectorAll('[data-bot]').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      const list = lobbyBots();
      list.push({ level: b.dataset.bot, look: randomLook(Math.floor(Math.random() * 8)) });
      net.setLobby({ bots: list });
    }));
    p.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      const list = lobbyBots();
      list.splice(Number(b.dataset.rm), 1);
      net.setLobby({ bots: list });
    }));
    p.querySelectorAll('[data-map]').forEach(b => b.addEventListener('click', () => { sound.pop(); net.setLobby({ map: b.dataset.map }); }));
    p.querySelectorAll('[data-wind]').forEach(wb => wb.addEventListener('click', () => { sound.pop(); net.setLobby({ wind: wb.dataset.wind === '1' }); }));
    const q = s => p.querySelector(s);
    q('[data-a="leave"]').addEventListener('click', () => { sound.pop(); confirmLeave(); });
    q('[data-a="tank"]').addEventListener('click', () => {
      sound.pop();
      if (net && !net.isHost) net.setReady(false); // changing tank: not ready until done
      editLook(myLook, l => { myLook = l; save(LOOK_KEY, l); if (net) net.setLook(l); lastLobbyHtml = ''; lobbyScreen(); });
    });
    const rd = q('[data-ready]');
    if (rd) rd.addEventListener('click', () => { sound.pop(); net.setReady(!net.ready()); });
    const go = q('[data-a="go"]');
    if (go) go.addEventListener('click', () => { sound.pop(); if (!go.disabled) hostStart(); });
  }

  // After a game: straight into the next one if everyone's still ready, else back to the room.
  function nextOrLobby() {
    if (!net || !net.isHost) return;
    if (allReady(lobbyPeople())) hostStart();
    else net.setLobby({ phase: 'lobby' });
  }

  function hostStart() {
    if (!net || !net.isHost) return;
    const players = net.players().sort((a, b) => (a.pid === net.pid ? -1 : b.pid === net.pid ? 1 : a.pid < b.pid ? -1 : 1));
    const roster = [
      ...players.map(pl => ({ pid: pl.pid, look: pl.look })),
      ...lobbyBots().map(b => ({ bot: b.level === 'tricky' ? 'tricky' : 'easy', look: sanitizeLook(b.look) })),
    ].slice(0, MAX_TANKS);
    if (roster.length < 2) { net.setLobby({ phase: 'lobby' }); return; }   // everyone else left: wait in the room
    const meta = net.meta() || {};
    net.startGame({
      id: Math.random().toString(36).slice(2, 10),
      seed: Math.floor(Math.random() * 1e9),
      map: pickMap(meta.map || 'random'),
      wind: meta.wind === true,
      roster,
    });
  }

  // ---------------------------------------------------------------- go
  if (/[?&]ttdebug/.test(location.search)) window.__tt = () => ({ match, replay, screen, net, time });
  startDemo();
  const inviteCode = takeJoinCode(GAME_ID);
  if (inviteCode) joinFromInvite(inviteCode); else show('title');
  const stopLoop = startLoop(update, draw);

  return () => {
    closed = true;
    stopLoop();
    clearTimeout(bannerTimer);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('keyup', onKey);
    document.removeEventListener('click', onHomeClick, true);
    if (net) { net.leave(); leftRoom(); }
    view.destroy();
    root.remove();
    css.remove();
  };
}
