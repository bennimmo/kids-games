// Star Dash: 3D space race. Two styles, three ways to play.
//
// Styles:  🌀 Tube Race (tube.js)   🪐 Open Space (open.js)
// Play:    🙂 vs 🤖 (full screen)   🙂 vs 🙂 (split screen, one device)   🌍 online (js/engine/net.js)
//
// A world is built from a seed, so online every device builds the same track.
// Online each device flies its own ship and sends where it is ~15 times a second.
import { myName, cleanName } from '../../js/engine/profile.js';
import { THREE, isSharedGeo } from './art.js';
import { createTube } from './tube.js';
import { createOpen } from './open.js';
import { createRoom, joinRoom, codeToPics, CODE_PICS, CODE_LEN } from '../../js/engine/net.js';
import { sound, audioCtx } from '../../js/engine/sound.js';

const GAME = 'star-dash';
const PREFS_KEY = 'star-dash-v1';
const COLORS = [0xff8a3d, 0x3dd6ff, 0x6cff6c, 0xff5fd2];
const CSS_COLORS = ['#ff8a3d', '#3dd6ff', '#6cff6c', '#ff5fd2'];
const LEVELS = [
  { icon: '🐢', skill: 0.84, top: 0.9 },
  { icon: '🐇', skill: 0.95, top: 0.97 },
  { icon: '🚀', skill: 1.03, top: 1.03 },
];
const STYLES = { tube: { icon: '🌀', name: 'Tube Race', make: createTube }, open: { icon: '🪐', name: 'Open Space', make: createOpen } };
const SEND_EVERY = 1 / 15;
const MAX_ONLINE = 4;
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const MEDALS = ['🥇', '🥈', '🥉', '🏅'];
const ORD = ['1st', '2nd', '3rd', '4th'];

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  stage.innerHTML = '<div class="sd"><canvas class="sd-canvas"></canvas><div class="sd-hud"></div><div class="sd-ui"></div></div>';
  const root = stage.querySelector('.sd'), canvas = root.querySelector('canvas');
  const hudEl = root.querySelector('.sd-hud'), ui = root.querySelector('.sd-ui');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    ui.innerHTML = '<div class="sd-overlay"><div class="sd-card"><h2>😢 No 3D</h2><p>This game needs WebGL. Try Chrome, Safari or Edge.</p></div></div>';
    return () => css.remove();
  }
  const DPR = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ---------------------------------------------------------------- state
  const prefs = loadPrefs();
  const S = {
    phase: 'menu',        // menu | race | results | online | join | lobby
    style: prefs.style || 'tube',
    level: prefs.level ?? 1,
    joinCode: '', busy: false, sad: 0,
    net: null,
  };
  let race = null, clock = 0, alive = true, raf = 0;

  function loadPrefs() { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } }
  function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify({ style: S.style, level: S.level, tilt: tilt.on })); } catch (e) { /* ignore */ } }

  // ---------------------------------------------------------------- input
  const keys = new Set();
  const touch = [{}, {}];
  const onKeyDown = e => {
    keys.add(e.code);
    if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
    if (S.phase === 'results' && (e.code === 'Enter' || e.code === 'Space')) again();
  };
  const onKeyUp = e => keys.delete(e.code);
  const onBlur = () => keys.clear();
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  addEventListener('blur', onBlur);
  const ARROWS = () => ({ l: keys.has('ArrowLeft'), r: keys.has('ArrowRight'), u: keys.has('ArrowUp'), d: keys.has('ArrowDown') });
  const WASD = () => ({ l: keys.has('KeyA'), r: keys.has('KeyD'), u: keys.has('KeyW'), d: keys.has('KeyS') });
  const or = (a, b) => ({ l: a.l || b.l, r: a.r || b.r, u: a.u || b.u, d: a.d || b.d });

  // ---------------------------------------------------------------- tilt (phones / iPads, one player only)
  // sx: -1 (left) .. 1 (right). sy: -1 (down) .. 1 (up, tilt the top towards you).
  const tilt = { on: prefs.tilt ?? true, ok: false, listening: false, steer: 0, pitch: 0, base: null };
  function tiltAxes(e) {
    const a = ((screen.orientation && screen.orientation.angle) ?? window.orientation ?? 0) % 360;
    const b = e.beta || 0, g = e.gamma || 0;
    if (a === 90) return [b, g];
    if (a === 270 || a === -90) return [-b, -g];
    if (a === 180 || a === -180) return [-g, -b];
    return [g, b];
  }
  const onOrient = e => {
    if (e.beta == null) return;
    tilt.ok = true;
    [tilt.steer, tilt.pitch] = tiltAxes(e);
    if (tilt.base == null) tilt.base = tilt.pitch;
  };
  // must be called straight from a tap (iPhone/iPad ask for permission)
  function askTilt() {
    if (!TOUCH || tilt.listening || typeof DeviceOrientationEvent === 'undefined') return;
    const listen = () => { tilt.listening = true; addEventListener('deviceorientation', onOrient); };
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') listen(); }).catch(() => {});
    } else listen();
  }
  const dead = (v, lo, hi) => { const a = Math.abs(v); return a < lo ? 0 : Math.sign(v) * Math.min(1, (a - lo) / (hi - lo)); };
  const tiltActive = () => TOUCH && tilt.on && tilt.ok && race && race.views.length === 1 && race.mode !== 'demo';
  const recenter = () => { tilt.base = tilt.pitch; };

  // ---------------------------------------------------------------- races
  // mode: demo | ai | two | online
  function newRace({ style, seed, mode, players }) {
    endRace();
    const scene = new THREE.Scene();
    const world = STYLES[style].make({ scene, seed, dpr: DPR });
    const ships = [];
    const add = (ctrl, slot, of, layer, extra = {}) => {
      const sh = world.addShip({ color: COLORS[slot], slot, of, layer });
      Object.assign(sh, { ctrl, slot, ...extra });
      ships.push(sh); return sh;
    };
    let views = [];
    if (mode === 'demo') {
      const a = add('ai', 0, 2, 1, { skill: 1, topSpeed: 1 }); add('ai', 1, 2, 0, { skill: 0.97, topSpeed: 0.99 });
      views = [{ ship: a }];
    } else if (mode === 'ai') {
      const lv = LEVELS[S.level];
      const me = add('solo', 0, 2, 1); add('ai', 1, 2, 0, { skill: lv.skill, topSpeed: lv.top });
      views = [{ ship: me }];
    } else if (mode === 'two') {
      views = [{ ship: add('p1', 0, 2, 1) }, { ship: add('p2', 1, 2, 2) }];
    } else {
      players.forEach((p, i) => {
        const mine = p.id === S.net.pid;
        const sh = add(mine ? 'solo' : 'remote', i, players.length, mine ? 1 : 0, { pid: p.id });
        if (mine) views = [{ ship: sh }];
      });
    }
    const cams = views.map((v, i) => {
      const c = new THREE.PerspectiveCamera(70, 1, 0.3, 20000);
      c.layers.enable(i + 1); v.cam = c; return c;
    });
    race = {
      style, seed, mode, scene, world, ships, views, cams,
      countdown: mode === 'demo' ? 0 : 3.999, startAt: 0, lastCount: 4, finish: [], t: 0, doneAt: 0, sendAcc: 0, engines: [],
    };
    // settle cameras on the start line
    world.step(0, false, 0, ships);
    for (let n = 0; n < 30; n++) views.forEach(v => world.camera(v.cam, v.ship, 1 / 30));
    buildHud();
    layout();
    if (mode !== 'demo') race.engines = views.map(() => makeEngine());
  }

  function endRace() {
    if (!race) return;
    race.engines.forEach(e => e && e.stop());
    race.scene.traverse(o => {
      if (o.geometry && !isSharedGeo(o.geometry)) o.geometry.dispose();
    });
    race = null;
    hudEl.innerHTML = '';
  }

  function startLocal(mode) {
    sound.pop();
    savePrefs();
    newRace({ style: S.style, seed: (Math.random() * 1e9) | 0, mode });
    S.phase = 'race';
    render();
  }

  function demo() { newRace({ style: S.style, seed: 1234 + (S.style === 'open' ? 1 : 0), mode: 'demo' }); }

  // ---------------------------------------------------------------- HUD
  function buildHud() {
    hudEl.innerHTML = '';
    if (race.mode === 'demo') return;
    race.views.forEach((v, i) => {
      const sh = v.ship;
      const label = race.mode === 'two' ? `🙂 Player ${i + 1}` : race.mode === 'ai' ? '🙂 You' : '🙂 You';
      const el = document.createElement('div');
      el.className = 'sd-view';
      el.style.setProperty('--pc', CSS_COLORS[sh.slot]);
      el.innerHTML = `<div class="sd-tl"><div class="sd-tag">${label}</div><div class="sd-lap"></div></div>
        <div class="sd-place"></div>
        <div class="sd-prog">${race.ships.map(s => `<i style="background:${CSS_COLORS[s.slot]}"></i>`).join('')}</div>
        <div class="sd-speed"><i></i></div>
        <div class="sd-big"></div><div class="sd-msg"></div>
        ${TOUCH ? `<div class="sd-pad"><div><button data-k="l">◀</button><button data-k="r">▶</button></div>
          <div><button data-k="d">▼</button><button data-k="u">▲</button></div></div>` : ''}
        ${TOUCH && race.views.length === 1 ? '<button class="sd-tilt" aria-label="Tilt to steer"></button>' : ''}`;
      hudEl.appendChild(el);
      el.querySelectorAll('.sd-pad button').forEach(b => {
        const set = on => e => { e.preventDefault(); touch[i][b.dataset.k] = on; b.classList.toggle('on', on); };
        b.addEventListener('pointerdown', set(true));
        for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, set(false));
      });
      const tb = el.querySelector('.sd-tilt');
      if (tb) tb.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (!tilt.listening) { askTilt(); tilt.on = true; } else tilt.on = !tilt.on;
        recenter(); savePrefs(); sound.pop();
      });
      const q = s => el.querySelector(s);
      Object.assign(v, { el, tiltBtn: tb, lap: q('.sd-lap'), place: q('.sd-place'), dots: [...el.querySelectorAll('.sd-prog i')], speed: q('.sd-speed i'), big: q('.sd-big'), msg: q('.sd-msg'), msgT: 0 });
    });
    touch[0] = {}; touch[1] = {};
    if (race.views.length === 2) { const d = document.createElement('div'); d.className = 'sd-divider'; hudEl.appendChild(d); race.divider = d; }
  }

  function flash(v, text) { if (!v.msg) return; v.msg.textContent = text; v.msg.classList.add('show'); v.msgT = 1.1; }

  function layout() {
    const w = root.clientWidth, h = root.clientHeight;
    renderer.setSize(w, h, false);
    if (!race) return;
    const side = w > h * 1.25;
    const rects = race.views.length === 1 ? [{ x: 0, y: 0, w, h }]
      // side by side: WASD player on the left, arrows player on the right (like the keyboard)
      : side ? [{ x: w / 2, y: 0, w: w / 2, h }, { x: 0, y: 0, w: w / 2, h }]
        : [{ x: 0, y: 0, w, h: h / 2 }, { x: 0, y: h / 2, w, h: h / 2 }];
    race.views.forEach((v, i) => {
      v.rect = rects[i];
      v.cam.aspect = rects[i].w / rects[i].h; v.cam.updateProjectionMatrix();
      if (v.el) {
        Object.assign(v.el.style, { left: rects[i].x + 'px', top: rects[i].y + 'px', width: rects[i].w + 'px', height: rects[i].h + 'px' });
        v.el.classList.toggle('sd-corner', rects[i].x === 0 && rects[i].y === 0); // the 🏠 button is here
      }
    });
    if (race.divider) Object.assign(race.divider.style, side ? { left: (w / 2 - 2) + 'px', top: 0, width: '4px', height: h + 'px' } : { left: 0, top: (h / 2 - 2) + 'px', width: w + 'px', height: '4px' });
  }
  const onResize = () => layout();
  addEventListener('resize', onResize);
  // the stylesheet loads after mount, so watch the size instead of trusting the first layout
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(root);

  // ---------------------------------------------------------------- sound
  function makeEngine() {
    const a = audioCtx();
    if (!a) return null;
    const o = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain();
    o.type = 'sawtooth'; o2.type = 'triangle'; f.type = 'lowpass'; f.frequency.value = 700; g.gain.value = 0;
    o.connect(f); o2.connect(f); f.connect(g).connect(a.destination);
    o.start(); o2.start();
    return {
      set(v, boost) {
        o.frequency.setTargetAtTime(55 + v * 120 + (boost ? 40 : 0), a.currentTime, 0.08);
        o2.frequency.setTargetAtTime(110 + v * 260, a.currentTime, 0.08);
        g.gain.setTargetAtTime(0.025 + v * 0.02, a.currentTime, 0.1);
      },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); o.stop(a.currentTime + 0.2); o2.stop(a.currentTime + 0.2); },
    };
  }

  function handleEvents(sh) {
    const v = race.views.find(x => x.ship === sh);
    for (const e of sh.events) {
      if (e === 'finish') onFinish(sh);
      if (!v) continue;
      if (e === 'bonk') { sound.bump(); sound.tone(90, 0.3, 'sawtooth', 0.1, 50); flash(v, 'Bonk! 💥'); }
      if (e === 'boost') { sound.tone(400, 0.35, 'square', 0.07, 1200); flash(v, 'BOOST! ⚡'); }
      if (e === 'ring') { sound.tone(700, 0.15, 'triangle', 0.12, 1100); flash(v, 'Ring! ✨'); }
      if (e === 'lap') { sound.tone(660, 0.12, 'triangle'); setTimeout(() => sound.tone(990, 0.2, 'triangle'), 110); flash(v, race.world.lap(sh) === race.world.LAPS ? 'Last lap! 🔥' : `Lap ${race.world.lap(sh)}! 🚀`); }
    }
    sh.events.length = 0;
  }

  function onFinish(sh) {
    if (race.finish.includes(sh)) return;
    race.finish.push(sh);
    const place = race.finish.length - 1;
    const v = race.views.find(x => x.ship === sh);
    if (v) {
      v.big.innerHTML = `${MEDALS[place]}<br>${ORD[place]}!`;
      if (place === 0) sound.win(); else sound.tone(520, 0.3, 'triangle');
    }
  }

  // ---------------------------------------------------------------- main loop
  let last = performance.now();
  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    if (!race) return;
    const R = race, W = R.world;

    // countdown
    if (R.countdown > 0 || R.startAt) {
      if (R.startAt && S.net) R.countdown = (R.startAt - S.net.room.now()) / 1000;
      else R.countdown -= dt;
      const n = Math.ceil(R.countdown);
      if (n !== R.lastCount && n <= 3) {
        R.lastCount = n;
        if (n > 0) sound.tone(440, 0.18, 'square', 0.1); else sound.tone(880, 0.5, 'square', 0.12);
        R.views.forEach(v => { if (v.big) v.big.textContent = n > 0 ? n : 'GO!'; });
      }
      if (R.countdown <= 0) {
        R.countdown = 0; R.startAt = 0; recenter();
        setTimeout(() => R.views.forEach(v => { if (v.big && !R.finish.includes(v.ship)) v.big.textContent = ''; }), 700);
      }
    }
    const racing = R.countdown <= 0;
    if (racing) R.t += dt;

    // inputs
    const single = R.views.length === 1;
    for (const sh of R.ships) {
      if (sh.ctrl === 'ai') sh.input = W.aiInput(sh, sh.skill, dt);
      else if (sh.ctrl === 'solo') {
        sh.input = or(or(ARROWS(), WASD()), touch[0]);
        if (tiltActive()) {
          sh.input.sx = dead(tilt.steer, 3, 20);
          sh.input.sy = dead(tilt.pitch - tilt.base, 4, 18);
          if (W.kind === 'tube' && !sh.input.d) sh.input.u = true; // tube: tilt steers, ship goes fast by itself
        }
      }
      else if (sh.ctrl === 'p1') sh.input = or(single ? or(ARROWS(), WASD()) : ARROWS(), touch[0]);
      else if (sh.ctrl === 'p2') sh.input = or(WASD(), touch[1]);
    }
    W.step(dt, racing, clock, R.ships);
    for (const sh of R.ships) {
      if (sh.ctrl === 'remote' && sh.done && !R.finish.includes(sh)) sh.events.push('finish');
      handleEvents(sh);
    }
    R.views.forEach(v => W.camera(v.cam, v.ship, dt));

    if (R.mode === 'online') netTick(dt);

    // demo: start again when the leader finishes
    if (R.mode === 'demo' && R.finish.length) { demo(); return; }

    // hud
    if (R.mode !== 'demo') {
      const prog = R.ships.map(s => W.progress(s));
      R.views.forEach((v, i) => {
        const sh = v.ship, me = R.ships.indexOf(sh);
        v.lap.textContent = `Lap ${W.lap(sh)}/${W.LAPS}`;
        let place = R.finish.indexOf(sh);
        if (place < 0) place = R.finish.length + R.ships.filter((s, k) => k !== me && !R.finish.includes(s) && prog[k] > prog[me]).length;
        v.place.innerHTML = `${place + 1}<small>${ORD[place].slice(1)}</small>`;
        v.dots.forEach((d, k) => { d.style.left = (prog[k] * 100) + '%'; });
        v.speed.style.width = (W.speed01(sh) * 100) + '%';
        if (v.msgT > 0) { v.msgT -= dt; if (v.msgT <= 0) v.msg.classList.remove('show'); }
        if (R.engines[i]) R.engines[i].set(racing ? W.speed01(sh) : 0.1, sh.boost > 0);
        if (v.tiltBtn) {
          const on = tiltActive();
          v.el.classList.toggle('sd-tilting', on);
          v.tiltBtn.textContent = on ? '📱' : '👆';
        }
      });
      // results when every player on this device is done (wait a bit for the others)
      if (S.phase === 'race' && R.views.every(v => v.ship.done)) {
        if (!R.doneAt) R.doneAt = clock;
        const allDone = R.ships.every(s => s.done || (s.ctrl === 'remote' && !s.net));
        if (clock - R.doneAt > (allDone ? 1.6 : 7)) { S.phase = 'results'; render(); }
      }
    }

    // draw
    const H = root.clientHeight;
    renderer.setScissorTest(true);
    for (const v of R.views) {
      const r = v.rect, y = H - r.y - r.h;
      renderer.setViewport(r.x, y, r.w, r.h); renderer.setScissor(r.x, y, r.w, r.h);
      renderer.render(R.scene, v.cam);
    }
  }
  raf = requestAnimationFrame(frame);

  // ---------------------------------------------------------------- screens
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node && node.addEventListener('click', e => { e.preventDefault(); fn(e); });
  const picsHTML = code => `<div class="sd-code"><b>🔑</b>${codeToPics(code).map(p => `<span>${p}</span>`).join('')}</div>`;

  function render() {
    ui.innerHTML = '';
    if (S.phase === 'menu') menuUI();
    if (S.phase === 'race') raceUI();
    if (S.phase === 'results') resultsUI();
    if (S.phase === 'online') onlineUI();
    if (S.phase === 'join') joinUI();
    if (S.phase === 'lobby') lobbyUI();
    if (S.net && S.net.status === 'waiting') ui.appendChild(el('<div class="sd-netwait">📶⏳</div>'));
  }

  function styleButtons(enabled = true) {
    return Object.entries(STYLES).map(([k, s]) => `<button class="sd-style ${S.style === k ? 'on' : ''} ${enabled ? '' : 'off'}" data-style="${k}"><span>${s.icon}</span>${s.name}</button>`).join('');
  }
  function wireStyles(box, after) {
    box.querySelectorAll('.sd-style').forEach(b => click(b, () => {
      if (b.classList.contains('off') || S.style === b.dataset.style) return;
      sound.pop(); S.style = b.dataset.style; savePrefs(); after();
    }));
  }

  function menuUI() {
    const box = el(`<div class="sd-overlay"><div class="sd-card sd-menu">
      <h1>Star <b>Dash</b></h1>
      <div class="sd-row">${styleButtons()}</div>
      <div class="sd-row sd-levels"><span>🤖</span>${LEVELS.map((l, i) => `<button class="sd-level ${S.level === i ? 'on' : ''}" data-l="${i}" aria-label="computer level ${i + 1}">${l.icon}</button>`).join('')}</div>
      <div class="sd-row sd-play">
        <button class="sd-go" data-m="ai"><span>🙂 vs 🤖</span>Computer</button>
        <button class="sd-go" data-m="two"><span>🙂 vs 🙂</span>Same screen</button>
        <button class="sd-go" data-m="online"><span>🌍</span>Online</button>
      </div>
      <p class="sd-keys">Player 1: ← → ↑ ↓ · Player 2: W A S D</p>
    </div></div>`);
    wireStyles(box, () => { demo(); render(); });
    box.querySelectorAll('.sd-level').forEach(b => click(b, () => { sound.pop(); S.level = +b.dataset.l; savePrefs(); render(); }));
    box.querySelectorAll('.sd-go').forEach(b => click(b, () => {
      const m = b.dataset.m;
      if (m !== 'two' && tilt.on) askTilt();
      if (m === 'online') { sound.pop(); S.phase = 'online'; render(); } else startLocal(m);
    }));
    ui.appendChild(box);
  }

  function raceUI() {
    const b = el('<button class="sd-btn sd-quit" aria-label="Stop race">✖</button>');
    click(b, () => { sound.pop(); if (S.net) toLobby(); else { S.phase = 'menu'; demo(); render(); } });
    ui.appendChild(b);
  }

  function resultsUI() {
    const R = race;
    const order = [...R.finish, ...R.ships.filter(s => !R.finish.includes(s)).sort((a, b) => R.world.progress(b) - R.world.progress(a))];
    const names = sh => {
      if (R.mode === 'ai') return sh.ctrl === 'ai' ? `🤖 ${LEVELS[S.level].icon}` : `🙂 ${myName() || 'You'}`;
      if (R.mode === 'two') return `🙂 Player ${sh.slot + 1}`;
      const who = S.net && cleanName(S.net.players[sh.pid] && S.net.players[sh.pid].name);
      return sh.ctrl === 'solo' ? `🙂 ${who || 'You'}` : `🌍 ${who || 'Friend'}`;
    };
    const host = !S.net || S.net.isHost;
    const box = el(`<div class="sd-overlay"><div class="sd-card sd-results">
      <h2>🏁 Race over!</h2>
      <ol>${order.map((sh, i) => `<li style="--pc:${CSS_COLORS[sh.slot]}"><span>${MEDALS[i]}</span><i></i>${names(sh)}</li>`).join('')}</ol>
      <div class="sd-row">
        ${host ? '<button class="sd-btn sd-again" aria-label="Race again">🔁</button>' : '<span class="sd-wait">⏳</span>'}
        <button class="sd-btn sd-back" aria-label="Back">↩️</button>
      </div>
    </div></div>`);
    click(box.querySelector('.sd-again'), again);
    click(box.querySelector('.sd-back'), () => { sound.pop(); if (S.net) toLobby(); else { S.phase = 'menu'; demo(); render(); } });
    ui.appendChild(box);
  }

  function again() {
    if (!race) return;
    if (S.net) { if (S.net.isHost) hostStart(); return; }
    startLocal(race.mode);
  }

  // ---------------------------------------------------------------- online
  function onlineUI() {
    const box = el(`<div class="sd-overlay"><div class="sd-card">
      <h2>🌍 Race a friend</h2>
      <div class="sd-row sd-play">
        <button class="sd-go sd-host"><span>🏠</span>Make a room</button>
        <button class="sd-go sd-join"><span>🔑</span>Join a room</button>
      </div>
      ${S.busy ? '<p class="sd-wait">⏳</p>' : ''}${S.sad > clock ? '<p class="sd-sad">😢</p>' : ''}
      <button class="sd-btn sd-back" aria-label="Back">↩️</button>
    </div></div>`);
    click(box.querySelector('.sd-host'), () => { if (!S.busy) hostRoom(); });
    click(box.querySelector('.sd-join'), () => { if (S.busy) return; sound.pop(); S.joinCode = ''; S.phase = 'join'; render(); });
    click(box.querySelector('.sd-back'), () => { sound.pop(); S.phase = 'menu'; render(); });
    ui.appendChild(box);
  }

  function joinUI() {
    const slots = Array.from({ length: CODE_LEN }, (_, i) => `<span>${S.joinCode[i] !== undefined ? CODE_PICS[parseInt(S.joinCode[i], 16)] : ''}</span>`).join('');
    const box = el(`<div class="sd-overlay"><div class="sd-card">
      <div class="sd-code sd-slots">${slots}</div>
      ${S.busy ? '<p class="sd-wait">⏳</p>' : ''}${S.sad > clock ? '<p class="sd-sad">😢</p>' : ''}
      <div class="sd-keypad">${CODE_PICS.map((p, i) => `<button data-h="${i.toString(16)}">${p}</button>`).join('')}</div>
      <div class="sd-row"><button class="sd-btn sd-del" aria-label="Delete">⌫</button><button class="sd-btn sd-back" aria-label="Back">↩️</button></div>
    </div></div>`);
    box.querySelectorAll('.sd-keypad button').forEach(b => click(b, () => {
      if (S.busy || S.joinCode.length >= CODE_LEN) return;
      sound.pop();
      S.joinCode += b.dataset.h;
      if (S.joinCode.length === CODE_LEN) tryJoin(S.joinCode); else render();
    }));
    click(box.querySelector('.sd-del'), () => { S.joinCode = S.joinCode.slice(0, -1); render(); });
    click(box.querySelector('.sd-back'), () => { S.phase = 'online'; render(); });
    ui.appendChild(box);
  }

  function lobbyPlayers() {
    const n = S.net;
    return Object.entries(n.players || {})
      .filter(([, p]) => p && typeof p.joined === 'number')
      .sort((a, b) => a[1].joined - b[1].joined || (a[0] < b[0] ? -1 : 1))
      .slice(0, MAX_ONLINE)
      .map(([id, p]) => ({ id, joined: p.joined, name: cleanName(p.name) }));
  }

  function lobbyUI() {
    const n = S.net, list = lobbyPlayers();
    const style = (n.meta && STYLES[n.meta.style]) ? n.meta.style : S.style;
    if (!n.isHost) S.style = style;
    const box = el(`<div class="sd-overlay"><div class="sd-card sd-lobby">
      ${picsHTML(n.code)}
      <div class="sd-ships">${list.map((p, i) => `<span style="--pc:${CSS_COLORS[i]}">🚀${p.id === n.pid ? '<b>🙂</b>' : ''}${p.name ? `<small class="sd-name">${p.name}</small>` : ''}</span>`).join('')}${list.length < 2 ? '<span class="sd-empty">⏳</span>' : ''}</div>
      <div class="sd-row">${styleButtons(n.isHost)}</div>
      <div class="sd-row">
        ${n.isHost ? `<button class="sd-btn sd-start ${list.length < 2 ? 'off' : ''}" aria-label="Start">▶</button>` : '<span class="sd-wait">⏳</span>'}
        <button class="sd-btn sd-leave" aria-label="Leave">🚪</button>
      </div>
    </div></div>`);
    if (n.isHost) wireStyles(box, () => { n.room.setMeta({ style: S.style }); demo(); render(); });
    click(box.querySelector('.sd-start'), () => { if (lobbyPlayers().length >= 2) hostStart(); });
    click(box.querySelector('.sd-leave'), () => { sound.pop(); leaveOnline(); });
    ui.appendChild(box);
  }

  function goOnline(room) {
    S.net = { room, isHost: room.isHost, code: room.code, pid: room.uid + '_p1', meta: null, players: {}, live: {}, raceId: 0, unsubs: [], status: 'ok', seen: {} };
    keepAwake(true);
    room.setPlayer(S.net.pid, { joined: room.now(), name: myName() });
    S.net.unsubs.push(room.onMeta(onMeta));
    S.net.unsubs.push(room.onPlayers(p => { if (!S.net) return; S.net.players = p; if (S.phase === 'lobby') render(); }));
    S.net.unsubs.push(room.onLive(l => { if (S.net) S.net.live = l; }));
    if (room.onStatus) S.net.unsubs.push(room.onStatus(st => { if (!S.net || S.net.status === st) return; S.net.status = st; render(); }));
    S.phase = 'lobby';
    render();
  }

  async function hostRoom() {
    S.busy = true; render();
    try {
      const room = await createRoom(GAME, { state: 'lobby', style: S.style, raceId: 0 });
      S.busy = false;
      goOnline(room);
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false; S.sad = clock + 2; render();
    }
  }

  async function tryJoin(code) {
    S.busy = true; render();
    try {
      const room = await joinRoom(GAME, code);
      S.busy = false;
      if (!room) { S.joinCode = ''; S.sad = clock + 1.5; sound.bump(); render(); return; }
      goOnline(room);
    } catch (e) {
      console.warn('online failed', e);
      S.busy = false; S.joinCode = ''; S.sad = clock + 2; render();
    }
  }

  function hostStart() {
    const n = S.net;
    sound.pop();
    n.room.setMeta({
      state: 'race', style: S.style, seed: (Math.random() * 1e9) | 0,
      raceId: ((n.meta && n.meta.raceId) || 0) + 1, startAt: n.room.now() + 3500,
      players: lobbyPlayers().map(p => p.id),
    });
  }

  function toLobby() {
    const n = S.net;
    if (n.isHost) n.room.setMeta({ state: 'lobby' });
    else { demo(); S.phase = 'lobby'; render(); }
  }

  function onMeta(m) {
    const n = S.net;
    if (!n) return;
    if (!m) { leaveOnline(true); return; } // the host left
    n.meta = m;
    if (STYLES[m.style] && m.style !== S.style && (!race || race.mode === 'demo')) { S.style = m.style; demo(); }
    if (m.state === 'race' && m.raceId !== n.raceId && Array.isArray(m.players) && m.players.includes(n.pid) && STYLES[m.style]) {
      n.raceId = m.raceId; n.seen = {};
      S.style = m.style;
      newRace({ style: m.style, seed: m.seed | 0, mode: 'online', players: m.players.slice(0, MAX_ONLINE).map(id => ({ id })) });
      race.startAt = m.startAt;
      race.countdown = Math.max(0.01, (m.startAt - n.room.now()) / 1000);
      S.phase = 'race';
      render();
      return;
    }
    if (m.state === 'lobby' && S.phase !== 'lobby') {
      if (race && race.mode === 'online') demo();
      S.phase = 'lobby';
    }
    if (S.phase === 'lobby') render();
  }

  function netTick(dt) {
    const n = S.net, R = race;
    if (!n || !R) return;
    R.sendAcc += dt;
    const me = R.views[0].ship;
    if (R.sendAcc >= SEND_EVERY) {
      R.sendAcc = 0;
      n.room.setLive(n.pid, { r: n.raceId, t: n.room.now(), ...R.world.state(me) });
    }
    for (const sh of R.ships) {
      if (sh.ctrl !== 'remote') continue;
      const d = n.live[sh.pid];
      if (!d || d.r !== n.raceId || typeof d.t !== 'number' || n.seen[sh.pid] === d.t) continue;
      n.seen[sh.pid] = d.t;
      R.world.applyRemote(sh, d, Math.min(0.3, Math.max(0, (n.room.now() - d.t) / 1000)));
    }
  }

  function leaveOnline(gone = false) {
    const n = S.net;
    if (!n) return;
    S.net = null;
    keepAwake(false);
    n.unsubs.forEach(u => u && u());
    n.room.leave();
    if (!alive) return;
    S.phase = 'menu';
    if (gone) S.sad = clock + 2;
    demo();
    render();
  }

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

  // ---------------------------------------------------------------- go
  demo();
  render();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    if (S.net) leaveOnline();
    endRace();
    removeEventListener('keydown', onKeyDown);
    removeEventListener('keyup', onKeyUp);
    removeEventListener('blur', onBlur);
    removeEventListener('deviceorientation', onOrient);
    removeEventListener('resize', onResize);
    if (ro) ro.disconnect();
    document.removeEventListener('visibilitychange', onVisible);
    keepAwake(false);
    renderer.dispose();
    renderer.forceContextLoss();
    css.remove();
  };
}
