// Sky Pilot: a flight simulator with an easy mode.
//
// Fly 5 aircraft round an island (beaches, town, desert, snowy mountains, a carrier at sea).
// Day turns to night, weather changes (clouds, rain, snow, storms, rainbows).
// Play:  🙂 one pilot per device   🌍 everyone shares one sky online
//        🔑 friends rooms (picture codes)
//
// Files: island.js (land shape, airports, physics ground), terrain.js (3D ground + sea), sky.js (sky, weather),
// scenery.js (airports, towns, trees, landmarks), life.js (boats, cars, planes, birds, whales),
// planes.js (aircraft data + models), cockpit.js (inside view), physics.js (flight model), missions.js (Ring Race, Fire Fight, Landing Contest).
import * as THREE from '../../js/vendor/three.module.min.js';
import { myName, cleanName } from '../../js/engine/profile.js';
import { sound, audioCtx } from '../../js/engine/sound.js';
import { createRoom, joinRoom, joinPublic, serverNow, friendUids } from '../../js/engine/net.js';
import { togetherButton, playTogether, takeJoinCode, joined, leftRoom, lobbyHTML, people, playerInfo } from '../../js/engine/together.js';
import { buildHeights, AIRPORTS, CARRIER, HARBOUR, HELIPADS, TOWNS, VILLAGES, townMask, LANDMARKS, ROADS, LAKE, HALF, GRID, CELL, heights, regionWeights, placeName, runwayPoint, runwayLocal, surfaceAt, terrainHeight } from './island.js';
import { createSky, DAY, START_TIME } from './sky.js';
import { createTerrain } from './terrain.js';
import { createScenery } from './scenery.js';
import { createLife } from './life.js';
import { PLANES, PLANE_ORDER, LIVERIES, buildPlane, animatePlane } from './planes.js';
import { buildCockpit } from './cockpit.js';
import { newPlaneState, placePlane, stepPlane, netState } from './physics.js';
import { MISSIONS, createMissions } from './missions.js';
import { clamp, lerp, smooth } from './noise.js';
import { icon } from '../../js/engine/icons.js';

const GAME = 'sky-pilot';
const PREFS_KEY = 'sky-pilot-v1';
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const PERIOD = DAY * 7;               // world clock repeats (day + weather line up)
const STEP = 1 / 120;
const VIEWS = ['chase', 'cockpit'];   // just two: behind the plane and inside it
const VIEW_ICON = { chase: '🎥', cockpit: '👨‍✈️', orbit: '🔄', flyby: '📸' };
const D = Math.PI / 180;
const kts = v => Math.round(v * 1.944), ftOf = m => Math.round(m * 3.281);
const PARAMS = new URLSearchParams(location.search);

function pickQuality() {
  const q = PARAMS.get('spq');
  const small = Math.min(screen.width, screen.height) < 520;
  const level = q || (small ? 'low' : TOUCH ? 'mid' : 'high');
  const Q = {
    low: { dpr: 1, shadows: 0, trees: 0.35, clouds: 0.6, particles: 0.5, life: 0.6, name: 'low' },
    mid: { dpr: 1.5, shadows: 1024, trees: 0.6, clouds: 0.8, particles: 0.8, life: 0.8, name: 'mid' },
    high: { dpr: 2, shadows: 2048, trees: 1, clouds: 1, particles: 1, life: 1, name: 'high' },
  };
  return Q[level] || Q.high;
}

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);
  stage.innerHTML = '<div class="sp"><canvas class="sp-canvas"></canvas><div class="sp-hud"></div><div class="sp-ui"></div></div>';
  const root = stage.querySelector('.sp'), canvas = root.querySelector('canvas');
  const hudEl = root.querySelector('.sp-hud'), ui = root.querySelector('.sp-ui');
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node && node.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); fn(e); });
  // in-flight buttons: react on finger down (a 'click' never comes if another finger is on the stick)
  const tap = (node, fn) => node && node.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); fn(e); });

  const quality = pickQuality();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.name !== 'low', powerPreference: 'high-performance', logarithmicDepthBuffer: true });
  } catch (e) {
    ui.innerHTML = '<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Sky Pilot</div><h2 class="ui-title">No 3D here</h2><p class="ui-sub">This game needs WebGL. Try Chrome, Safari or Edge.</p></div></div>';
    return () => css.remove();
  }
  let DPR = Math.min(devicePixelRatio || 1, quality.dpr);
  renderer.setPixelRatio(DPR);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = quality.shadows > 0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------------------------------------------------------- prefs
  const prefs = loadPrefs();
  function loadPrefs() {
    const d = { easy: true, noDie: true, shared: true, sound: true, start: 'main', tilt: true, guide: true, pl: [{ type: 'cub', color: 0 }, { type: 'cub', color: 1 }], view: ['chase', 'chase'] };
    try {
      const p = { ...d, ...(JSON.parse(localStorage.getItem(PREFS_KEY)) || {}) };
      return p;
    } catch (e) { return d; }
  }
  const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ } };

  // ---------------------------------------------------------------- state
  const S = { phase: 'loading', mode: 'solo', busy: false, sad: 0, paused: false, help: false };
  const inviteCode = takeJoinCode(GAME); // opened from a friend's invite (together.js)
  let alive = true, raf = 0, world = null, scene = null;
  const players = [];
  const remotes = new Map();
  let localT = START_TIME, clockFn = () => Date.now();
  serverNow().then(f => { clockFn = f; }).catch(() => {});
  const FORCE_T = PARAMS.has('sptime') ? +PARAMS.get('sptime') : null;   // testing: ?sptime=<seconds into the day>
  if (FORCE_T !== null) localT = FORCE_T;
  const worldTime = () => (FORCE_T === null && (prefs.shared || net.room) ? ((clockFn() / 1000) % PERIOD) : localT % PERIOD);

  // ---------------------------------------------------------------- loading screen
  ui.innerHTML = '<div class="ui-overlay sp-loading"><div class="ui-panel"><div class="ui-kicker">Sky Pilot</div><h1 class="ui-title">Getting the island ready</h1><div class="sp-bar"><i></i></div><p class="ui-sub sp-loadtxt">🏝️</p></div></div>';
  const bar = ui.querySelector('.sp-bar i'), loadTxt = ui.querySelector('.sp-loadtxt');
  const prog = (a, b, txt) => f => { if (bar) bar.style.width = ((a + (b - a) * f) * 100) + '%'; if (txt && loadTxt) loadTxt.textContent = txt; };

  (async () => {
    try {
      await buildHeights(prog(0, 0.35, '🏝️ ⛰️'));
      if (!alive) return;
      scene = new THREE.Scene();
      const sky = createSky(scene, renderer, quality);
      const terrain = await createTerrain(scene, sky, prog(0.35, 0.75, '🌲 🏜️ ❄️'), quality);
      if (!alive) return;
      prog(0.75, 0.9, '🛫 🏙️')(0);
      await new Promise(r => setTimeout(r, 0));
      const scenery = createScenery(scene, sky, quality, DPR);
      prog(0.9, 1, '🚢 🐋 🎈')(0);
      await new Promise(r => setTimeout(r, 0));
      const life = createLife(scene, sky, quality, DPR);
      const fx = createEffects(scene);
      fx.wind = createWindStreaks(scene);
      world = { sky, terrain, scenery, life, fx, mapImg: makeMapImage() };
      missions = createMissions(missionCtx(fx));
      prog(1, 1)(1);
      menuCam.position.set(AIRPORTS[0].x - 900, AIRPORTS[0].elev + 220, AIRPORTS[0].z + 700);
      renderer.compile(scene, menuCam);
      S.phase = 'menu';
      render();
      if (inviteCode) tryJoin(inviteCode);
    } catch (e) {
      console.error(e);
      ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Sky Pilot</div><h2 class="ui-title">Something went wrong</h2><p class="ui-sub">${String(e.message || e).slice(0, 120)}</p></div></div>`;
    }
  })();

  const menuCam = new THREE.PerspectiveCamera(55, 1, 1, 90000);

  // ---------------------------------------------------------------- effects: smoke, puffs, splash, landing guide rings
  function createEffects(scn) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    const N = Math.round(500 * quality.particles), pool = [];
    for (let i = 0; i < N; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
      sp.visible = false; scn.add(sp);
      pool.push({ sp, life: 0, max: 1, vel: new THREE.Vector3(), grow: 1, op: 1 });
    }
    let next = 0;
    function puff(pos, color, size, life, vel, grow = 1.5, op = 0.8) {
      const p = pool[next]; next = (next + 1) % N;
      p.sp.position.copy(pos); p.sp.scale.setScalar(size); p.sp.material.color.set(color); p.sp.visible = true;
      p.life = life; p.max = life; p.vel.copy(vel || new THREE.Vector3()); p.grow = grow; p.op = op; p.size = size;
    }
    // landing guide hoops (one set per local player)
    const ringSets = [0, 1].map(slot => {
      const m = new THREE.MeshBasicMaterial({ color: 0x39ff7a, transparent: true, opacity: 0.55, depthWrite: false });
      const rings = [];
      for (let i = 0; i < 10; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 32), m); r.visible = false; r.layers.set(16 + slot); scn.add(r); rings.push(r); }
      return rings;
    });
    return {
      puff,
      update(dt, sky) {
        const dark = lerp(0.25, 1, sky.state.daylight + 0.15);
        for (const p of pool) {
          if (p.life <= 0) continue;
          p.life -= dt;
          if (p.life <= 0) { p.sp.visible = false; continue; }
          const k = 1 - p.life / p.max;
          p.sp.position.addScaledVector(p.vel, dt);
          p.vel.multiplyScalar(1 - dt * 0.6);
          p.sp.scale.setScalar(p.size * (1 + k * p.grow * 3));
          p.sp.material.opacity = p.op * (1 - k) * Math.min(1, k * 8 + 0.3);
          p.sp.material.color.multiplyScalar(1); // keep
        }
      },
      ringSets,
    };
  }

  // faint streaks of air drifting past with the wind (very light: just enough to see which way it blows).
  // Thin ribbons that face the camera, tapering to nothing at the tail.
  function createWindStreaks(scn) {
    const N = 60, R = 45;
    const pos = new Float32Array(N * 4 * 3), col = new Float32Array(N * 4 * 4), idx = [];
    for (let i = 0; i < N; i++) { const a = i * 4; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
    geo.setIndex(idx);
    const lines = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    lines.frustumCulled = false; lines.renderOrder = 4; scn.add(lines);
    const P = Array.from({ length: N }, () => ({ p: new THREE.Vector3(), life: 0, max: 1 }));
    const dir = new THREE.Vector3(), fwd = new THREE.Vector3(), toCam = new THREE.Vector3(), side = new THREE.Vector3();
    return {
      lines,
      update(cam, wind, dt, night) {
        const sp = wind.length(), k = clamp((sp - 1.5) / 6, 0, 1);
        lines.visible = k > 0.01;
        if (!lines.visible) return;
        dir.copy(wind).divideScalar(sp);
        const len = 5 + sp * 1.1;
        cam.getWorldDirection(fwd);
        for (let i = 0; i < N; i++) {
          const q = P[i];
          q.life -= dt;
          toCam.copy(q.p).sub(cam.position);
          if (q.life <= 0 || toCam.dot(fwd) < -4 || toCam.length() > R * 3) {
            // ahead of the camera (you fly towards them), spread left/right and a little up/down
            q.p.copy(cam.position).addScaledVector(fwd, 25 + Math.random() * 90);
            q.p.x += (Math.random() - 0.5) * 90; q.p.y += (Math.random() - 0.5) * 30; q.p.z += (Math.random() - 0.5) * 90;
            q.max = q.life = 1.6 + Math.random() * 2.4;
          }
          q.p.addScaledVector(wind, dt * 1.4);
          const a = Math.min(1, (q.max - q.life) * 3, q.life * 1.5) * 0.75 * (0.6 + 0.4 * k) * (night ? 0.55 : 1);
          toCam.copy(cam.position).sub(q.p);
          side.crossVectors(dir, toCam);
          if (side.lengthSq() < 1e-6) side.set(0, 1, 0);
          side.normalize().multiplyScalar(clamp(toCam.length() * 0.008, 0.05, 0.7));
          const tx = q.p.x - dir.x * len, tz = q.p.z - dir.z * len, o = i * 12, c = i * 16;
          pos[o] = q.p.x + side.x; pos[o + 1] = q.p.y + side.y; pos[o + 2] = q.p.z + side.z;
          pos[o + 3] = q.p.x - side.x; pos[o + 4] = q.p.y - side.y; pos[o + 5] = q.p.z - side.z;
          pos[o + 6] = tx; pos[o + 7] = q.p.y; pos[o + 8] = tz;
          pos[o + 9] = tx; pos[o + 10] = q.p.y; pos[o + 11] = tz;
          for (let v = 0; v < 4; v++) { col[c + v * 4] = col[c + v * 4 + 1] = col[c + v * 4 + 2] = 1; col[c + v * 4 + 3] = v < 2 ? a : 0; }
        }
        geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true;
      },
    };
  }

  // ---------------------------------------------------------------- map picture (once): hill shading, height lines, sea depth, towns, roads, runways
  function makeMapImage() {
    const S2 = 1024, c = document.createElement('canvas'); c.width = c.height = S2;
    const g = c.getContext('2d'), img = g.createImageData(S2, S2);
    const W = HALF * 2, px = W / S2;
    const H = new Float32Array(S2 * S2);
    for (let j = 0; j < S2; j++) for (let i = 0; i < S2; i++) H[j * S2 + i] = terrainHeight(-HALF + (i + 0.5) * px, -HALF + (j + 0.5) * px);
    const L = [-0.6, 0.7, -0.4], ll = Math.hypot(...L);
    for (let j = 0; j < S2; j++) for (let i = 0; i < S2; i++) {
      const k = j * S2 + i, h = H[k];
      const x = -HALF + (i + 0.5) * px, z = -HALF + (j + 0.5) * px;
      const hr = H[j * S2 + Math.min(S2 - 1, i + 1)], hd = H[Math.min(S2 - 1, j + 1) * S2 + i];
      let col;
      if (h < 0.3) {
        const d = Math.min(1, -h / 40);
        col = [40 + (1 - d) * 70, 120 + (1 - d) * 85, 175 + (1 - d) * 30];
        if (hr >= 0.3 || hd >= 0.3) col = [235, 245, 245];                       // surf line
      } else {
        const { wm, wd, ww } = regionWeights(x, z);
        const snow = h > 1250;
        col = snow ? [246, 249, 253] : h < 5 ? [236, 220, 168] : wd > 0.5 ? [224, 176, 110] : wm > 0.5 ? (h > 700 ? [150, 140, 128] : [120, 150, 90]) : ww > 0.5 ? [72, 128, 62] : [126, 178, 82];
        // hill shading
        const nx = (H[j * S2 + Math.max(0, i - 1)] - hr) / (2 * px), nz = (H[Math.max(0, j - 1) * S2 + i] - hd) / (2 * px);
        const nl = Math.hypot(nx, 1, nz), sh = (nx * L[0] + L[1] + nz * L[2]) / (nl * ll);
        const shade = 0.55 + 0.65 * Math.max(0, sh);
        col = col.map(v => v * shade);
        // height lines every 250 m
        if (Math.floor(h / 250) !== Math.floor(hr / 250) || Math.floor(h / 250) !== Math.floor(hd / 250)) col = col.map(v => v * 0.78);
      }
      const o = k * 4; img.data[o] = col[0]; img.data[o + 1] = col[1]; img.data[o + 2] = col[2]; img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const P = (x, z) => [(x + HALF) / px, (z + HALF) / px];
    // towns: their wobbly outline, with streets; hamlets as little dots
    for (const t of TOWNS) {
      const outline = [];
      for (let ang = 0; ang < Math.PI * 2; ang += 0.08) { let r = 0; while (r < 3000 && townMask(t, t.x + Math.cos(ang) * r, t.z + Math.sin(ang) * r) < 1) r += 15; outline.push(P(t.x + Math.cos(ang) * r, t.z + Math.sin(ang) * r)); }
      g.save();
      g.beginPath(); outline.forEach((pt, i) => (i ? g.lineTo(...pt) : g.moveTo(...pt))); g.closePath();
      g.fillStyle = t.kind === 'city' ? 'rgba(175,170,160,.92)' : 'rgba(205,185,155,.85)'; g.fill();
      g.clip();
      g.translate(...P(t.x, t.z)); g.rotate(-t.rot);
      g.strokeStyle = 'rgba(90,90,95,.55)'; g.lineWidth = 1;
      const step = (t.kind === 'city' ? 120 : t.kind === 'resort' ? 90 : 70) / px, R2 = 3000 / px;
      for (let x = -R2; x <= R2; x += step) { g.beginPath(); g.moveTo(x, -R2); g.lineTo(x, R2); g.stroke(); g.beginPath(); g.moveTo(-R2, x); g.lineTo(R2, x); g.stroke(); }
      g.restore();
    }
    for (const v of VILLAGES) { g.fillStyle = '#c9a77c'; g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 1; g.beginPath(); g.arc(...P(v.x, v.z), 3, 0, 7); g.fill(); g.stroke(); }
    // roads + railway
    for (const r of ROADS) {
      if (!r.path) continue;
      const line = () => { g.beginPath(); let on = false; r.path.forEach(p => { const [a, b] = P(p[0], p[2]); if (p[5] === 'tunnel') { on = false; return; } on ? g.lineTo(a, b) : g.moveTo(a, b); on = true; }); g.stroke(); };
      g.lineCap = 'round'; g.lineJoin = 'round';
      if (r.kind === 'rail') { g.setLineDash([]); g.strokeStyle = '#5a4030'; g.lineWidth = 3; line(); g.setLineDash([4, 4]); g.strokeStyle = '#f0e6d0'; g.lineWidth = 1.5; line(); g.setLineDash([]); }
      else { g.strokeStyle = '#6b5a3a'; g.lineWidth = 4; line(); g.strokeStyle = '#f6d684'; g.lineWidth = 2.2; line(); }
    }
    // runways + aprons
    for (const ap of AIRPORTS) {
      const [x1, z1] = runwayPoint(ap, -ap.len / 2), [x2, z2] = runwayPoint(ap, ap.len / 2);
      g.lineCap = 'butt';
      g.strokeStyle = ap.surface === 'grass' ? '#4f7a33' : '#3a3c40'; g.lineWidth = Math.max(4, ap.wid / px * 2.2);
      g.beginPath(); g.moveTo(...P(x1, z1)); g.lineTo(...P(x2, z2)); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = 1; g.setLineDash([5, 4]);
      g.beginPath(); g.moveTo(...P(x1, z1)); g.lineTo(...P(x2, z2)); g.stroke(); g.setLineDash([]);
    }
    // carrier
    g.save(); g.translate(...P(CARRIER.x, CARRIER.z)); g.rotate(CARRIER.hdg); g.fillStyle = '#4a5560'; g.fillRect(-4, -CARRIER.len / px / 2 - 2, 8, CARRIER.len / px + 4); g.restore();
    return c;
  }

  // ---------------------------------------------------------------- input
  const keys = new Set();
  const pressed = [];             // key presses this frame
  const onKeyDown = e => {
    if (e.target && (e.target.tagName === 'INPUT')) return;
    if (!keys.has(e.code)) pressed.push(e.code);
    keys.add(e.code);
    if (S.phase === 'fly' && (e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'Backspace')) e.preventDefault();
  };
  const onKeyUp = e => keys.delete(e.code);
  const onBlur = () => keys.clear();
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  addEventListener('blur', onBlur);
  const KEYS = [
    { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', yawL: 'KeyQ', yawR: 'KeyE', thrUp: 'KeyR', thrDn: 'KeyF', gear: 'KeyG', flaps: 'KeyV', brake: 'Space', cam: 'KeyC', smoke: 'KeyX' },
    { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', yawL: 'KeyJ', yawR: 'KeyL', thrUp: 'KeyI', thrDn: 'KeyK', gear: 'KeyU', flaps: 'KeyO', brake: 'Enter', cam: 'KeyP', smoke: 'KeyH' },
  ];
  const EXTRA = { thrUp: ['ShiftLeft', 'ShiftRight', 'Equal', 'NumpadAdd', 'PageUp'], thrDn: ['ControlLeft', 'ControlRight', 'Minus', 'NumpadSubtract', 'PageDown'], flapsUp: ['BracketLeft'], flapsDn: ['BracketRight'] };

  // tilt (phones / tablets, one pilot)
  const tilt = { ok: false, listening: false, steer: 0, pitch: 0, base: null };
  function tiltAxes(e) {
    const a = ((screen.orientation && screen.orientation.angle) ?? window.orientation ?? 0) % 360;
    const b = e.beta || 0, g = e.gamma || 0;
    if (a === 90) return [b, g];
    if (a === 270 || a === -90) return [-b, -g];
    if (a === 180 || a === -180) return [-g, -b];
    return [g, b];
  }
  const onOrient = e => { if (e.beta == null) return; tilt.ok = true; [tilt.steer, tilt.pitch] = tiltAxes(e); if (tilt.base == null) { tilt.base = tilt.pitch; tilt.sbase = tilt.steer; } };
  function askTilt() {
    if (!TOUCH || tilt.listening || typeof DeviceOrientationEvent === 'undefined') return;
    const listen = () => { tilt.listening = true; addEventListener('deviceorientation', onOrient); };
    if (typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') listen(); }).catch(() => {});
    else listen();
  }
  const dead = (v, lo, hi) => { const a = Math.abs(v); return a < lo ? 0 : Math.sign(v) * Math.min(1, (a - lo) / (hi - lo)); };
  const tiltActive = () => TOUCH && prefs.tilt && tilt.ok && players.length === 1;

  function pads() { try { return [...(navigator.getGamepads ? navigator.getGamepads() : [])].filter(Boolean); } catch (e) { return []; } }
  const padPrev = [{}, {}];

  function readInput(p, dt) {
    const s = p.s, K = KEYS[p.slot], solo = players.length === 1;
    const has = code => keys.has(code);
    const any = (name) => has(K[name]) || (solo && has(KEYS[1 - p.slot][name])) || (solo && (EXTRA[name] || []).some(has));
    const hit = (name) => pressed.includes(K[name]) || (solo && pressed.includes(KEYS[1 - p.slot][name])) || (solo && (EXTRA[name] || []).some(c => pressed.includes(c)));
    const inv = -1;   // always pilot style: ↑ / stick forward = nose down, ↓ / pull back = nose up (tilt: top of phone toward you = nose up)
    let tp = ((any('up') ? 1 : 0) - (any('down') ? 1 : 0)) * inv;
    let tr = (any('right') ? 1 : 0) - (any('left') ? 1 : 0);
    let ty = (any('yawR') ? 1 : 0) - (any('yawL') ? 1 : 0);
    let thrDelta = (any('thrUp') ? 1 : 0) - (any('thrDn') ? 1 : 0);
    let brake = any('brake');
    const actions = [];
    if (hit('gear')) actions.push('gear');
    if (hit('flaps')) actions.push('flaps');
    if (hit('cam')) actions.push('cam');
    if (hit('smoke')) actions.push('smoke');
    if (solo || p.slot === 0) { if ((EXTRA.flapsDn).some(c => pressed.includes(c))) actions.push('flapsDn'); if (EXTRA.flapsUp.some(c => pressed.includes(c))) actions.push('flapsUp'); }
    // gamepad
    const gp = pads()[p.slot];
    let analog = null;
    if (gp) {
      const ax = i => dead(gp.axes[i] || 0, 0.12, 1);
      const bt = i => gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5);
      if (Math.abs(ax(0)) > 0 || Math.abs(ax(1)) > 0) analog = { roll: ax(0), pitch: -ax(1) * inv };
      if (Math.abs(ax(2)) > 0) ty = ax(2);
      if (bt(4)) ty = -1; if (bt(5)) ty = 1;
      const tUp = gp.buttons[7] ? gp.buttons[7].value : 0, tDn = gp.buttons[6] ? gp.buttons[6].value : 0;
      if (tUp > 0.05 || tDn > 0.05) thrDelta = tUp - tDn;
      if (bt(1)) brake = true;
      const pp = padPrev[p.slot];
      const edge = (i, a) => { const b = bt(i); if (b && !pp[i]) actions.push(a); pp[i] = b; };
      edge(0, 'gear'); edge(2, 'flaps'); edge(3, 'cam'); edge(8, 'smoke'); edge(9, 'pause');
    }
    // touch
    const T = p.touch;
    if (T && T.stick.active) analog = { roll: T.stick.x, pitch: -T.stick.y * inv };
    if (T && T.brake) brake = true;
    if (T && T.actions.length) { actions.push(...T.actions); T.actions.length = 0; }
    if (tiltActive() && !(T && T.stick.active)) analog = { roll: dead(tilt.steer - (tilt.sbase || 0), 5, 25), pitch: dead(tilt.pitch - tilt.base, 4, 22) };
    // smooth keys, take analog straight
    const ease = (cur, tgt) => cur + clamp(tgt - cur, -dt * (tgt === 0 ? 5 : 3), dt * (tgt === 0 ? 5 : 3));
    const inp = s.input;
    inp.pitch = analog ? analog.pitch : ease(inp.pitch, tp);
    inp.roll = analog ? analog.roll : ease(inp.roll, tr);
    inp.yaw = ease(inp.yaw, ty);
    if (thrDelta) inp.throttle = clamp(inp.throttle + thrDelta * dt * 0.55, 0, 1);
    if (T && T.thrSet !== null) { inp.throttle = T.thrSet; T.thrSet = null; }
    inp.brake = brake;
    inp.boost = brake || any('thrUp') || !!(T && T.boost) || !!(gp && gp.buttons[7] && gp.buttons[7].value > 0.5);   // paper plane
    return actions;
  }

  // ---------------------------------------------------------------- players
  const spotFor = (choice, slot, type) => {
    const P = PLANES[type];
    if (choice === 'peak') {
      // high over the snowy mountains, gliding south
      const pk = LANDMARKS.find(l => l.icon === '📡') || { x: -1500, z: -9000 };
      const x = pk.x + slot * 40, z = pk.z + 900;
      return { x, z, y: terrainHeight(pk.x, pk.z) + 160 + slot * 15, hdg: Math.PI, air: true, speed: P.vref };
    }
    if (choice === 'air' && P.kind === 'paper') {
      const ap = AIRPORTS[0], [x, z] = runwayPoint(ap, -ap.len / 2 - 2500, slot * 50);
      return { x, z, y: ap.elev + 650 + slot * 20, hdg: ap.hdg, air: true, speed: P.vref };
    }
    if (choice === 'air') {
      const ap = AIRPORTS[0], [x, z] = runwayPoint(ap, -ap.len / 2 - 6000, slot * 60);
      const y = ap.elev + 380 + slot * 30;
      return { x, z, y, hdg: ap.hdg, air: true, speed: P.kind === 'heli' ? 25 : P.vref * 1.45 };
    }
    if (choice === 'carrier') {
      const k = slot % 3, c = CARRIER, [x, z] = runwayPoint({ x: c.x, z: c.z, hdg: c.hdg }, -c.len / 2 + 40 + k * 50, k ? 15 : 0);
      return { x, z, y: c.deck, hdg: c.hdg };
    }
    if (choice === 'harbour') return { x: HARBOUR.x + slot * 50, z: HARBOUR.z + slot * 30, y: 0, hdg: HARBOUR.hdg };
    if (choice === 'helipad' && HELIPADS[0]) { const h = HELIPADS[0]; return { x: h.x + (slot % 3 - 1) * 22, z: h.z + (slot % 3 ? 15 : 0), y: h.y, hdg: h.hdg }; }
    const ap = AIRPORTS.find(a => a.id === choice) || AIRPORTS[0];
    const [x, z] = runwayPoint(ap, -ap.len / 2 + 70 + slot * 170, 0);
    return { x, z, hdg: ap.hdg };
  };
  // where can this plane start?
  function startsFor(type) {
    const P = PLANES[type];
    if (P.kind === 'paper') return [{ id: 'air', icon: '☁️', name: 'High in the sky' }, { id: 'peak', icon: '🏔️', name: 'Mountain top' }];
    const list = [];
    for (const ap of AIRPORTS) {
      const need = type === 'jumbo' ? 1700 : type === 'zoom' ? 1250 : 0;
      if (ap.len >= need && !(type === 'jumbo' && ap.surface === 'grass')) list.push({ id: ap.id, icon: ap.icon, name: ap.name });
    }
    if (type === 'zoom') list.push({ id: 'carrier', icon: '⚓', name: 'Carrier' });
    if (type === 'splash') list.unshift({ id: 'harbour', icon: '⛵', name: 'Harbour' });
    if (type === 'whirly') list.unshift({ id: 'helipad', icon: '🏥', name: 'Hospital roof' });
    list.push({ id: 'air', icon: '☁️', name: 'In the sky' });
    return list;
  }

  function nameTag(text, color) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 128;
    const g = c.getContext('2d');
    g.font = '900 68px Nunito, Arial, sans-serif';
    const w = Math.min(500, g.measureText(text).width + 64);
    g.fillStyle = 'rgba(10,20,40,.82)'; g.beginPath(); g.roundRect(256 - w / 2, 10, w, 100, 46); g.fill();
    g.strokeStyle = '#' + new THREE.Color(color).getHexString(); g.lineWidth = 10; g.stroke();
    // little pointer down to the plane
    g.fillStyle = 'rgba(10,20,40,.82)'; g.beginPath(); g.moveTo(240, 108); g.lineTo(272, 108); g.lineTo(256, 126); g.fill();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 62, 470);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, fog: false, toneMapped: false }));
    sp.scale.set(0.48, 0.12, 1); sp.center.set(0.5, 0); sp.renderOrder = 20;
    return sp;
  }
  // two white ribbons streaming from the paper plane's wing tips (show the way it flew).
  // Points are sampled as it flies; every frame the ribbon is rebuilt facing the camera, about the same width on screen.
  function makeTrails(model) {
    const N = 220, tips = model.parts.tips;
    const mk = () => {
      const pos = new Float32Array(N * 2 * 3), col = new Float32Array(N * 2 * 4), idx = [];
      for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
      g.setIndex(idx);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      m.frustumCulled = false; scene.add(m);
      return { m, pos, col, pts: new Float32Array(N * 3), n: 0 };
    };
    const tr = { list: [mk(), mk()], acc: 0, last: new THREE.Vector3(1e9, 0, 0) };
    const tp = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), side = new THREE.Vector3(), toCam = new THREE.Vector3();
    tr.update = (group, dt, moving, camPos) => {
      tr.acc += dt;
      const here = group.position;
      if (here.distanceTo(tr.last) > 60) tr.list.forEach(t => { t.n = 0; });      // jumped (respawn / teleport): start fresh
      const sample = tr.acc >= 0.035 && moving;
      if (sample) { tr.acc = 0; tr.last.copy(here); }
      const cam = camPos || here;
      tr.list.forEach((t, k) => {
        if (sample) {
          t.pts.copyWithin(3, 0, (N - 1) * 3);
          tp.copy(tips[k]).applyQuaternion(group.quaternion).add(here);
          t.pts[0] = tp.x; t.pts[1] = tp.y; t.pts[2] = tp.z;
          t.n = Math.min(N, t.n + 1);
        }
        for (let i = 0; i < N; i++) {
          const o = i * 6, c = i * 8;
          if (i >= t.n) { t.col[c + 3] = 0; t.col[c + 7] = 0; continue; }
          a.fromArray(t.pts, i * 3);
          b.fromArray(t.pts, Math.min(t.n - 1, i + 1) * 3);
          if (i === t.n - 1 && i > 0) b.fromArray(t.pts, (i - 1) * 3).sub(a).negate().add(a);
          toCam.copy(cam).sub(a);
          const dist = toCam.length();
          side.crossVectors(b.sub(a), toCam);
          if (side.lengthSq() < 1e-8) side.set(0, 1, 0);
          side.normalize().multiplyScalar(clamp(dist * 0.0028, 0.03, 0.9));
          t.pos[o] = a.x + side.x; t.pos[o + 1] = a.y + side.y; t.pos[o + 2] = a.z + side.z;
          t.pos[o + 3] = a.x - side.x; t.pos[o + 4] = a.y - side.y; t.pos[o + 5] = a.z - side.z;
          const al = Math.pow(1 - i / N, 1.4) * 0.9 * Math.min(1, i / 3);
          for (const j of [c, c + 4]) { t.col[j] = 1; t.col[j + 1] = 1; t.col[j + 2] = 1; t.col[j + 3] = al; }
        }
        t.m.geometry.attributes.position.needsUpdate = true; t.m.geometry.attributes.color.needsUpdate = true;
      });
    };
    tr.dispose = () => tr.list.forEach(t => { scene.remove(t.m); t.m.geometry.dispose(); t.m.material.dispose(); });
    return tr;
  }
  const displayName = (n, type) => cleanName(n) || (PLANES[type] ? PLANES[type].icon + ' Pilot' : 'Pilot');

  function makePlayer(slot, type, colorIdx) {
    const color = LIVERIES[colorIdx % LIVERIES.length];
    const s = newPlaneState(type);
    const model = buildPlane(type, color);
    model.body.traverse(o => o.layers.set(10 + slot));
    const cockpit = buildCockpit(type, color);
    cockpit.group.traverse(o => o.layers.set(12 + slot));
    model.group.add(cockpit.group);
    scene.add(model.group);
    const tagObj = nameTag(displayName(myName(), type), color);
    tagObj.layers.set(14 + slot); scene.add(tagObj);
    const cam = new THREE.PerspectiveCamera(65, 1, 0.3, 90000);
    const trail = PLANES[type].kind === 'paper' ? makeTrails(model) : null;
    const p = {
      trail,
      slot, s, model, cockpit, tag: tagObj, cam, type, color, colorIdx,
      view: VIEWS.includes(prefs.view[slot]) ? prefs.view[slot] : 'chase', look: { yaw: 0, pitch: 0, dist: 1, oyaw: 0.6, opitch: 0.25 },
      flyby: null, crashAt: 0, spot: null, smokeT: 0, engine: null, msgT: 0, warnSaid: 0, said: {}, camPos: new THREE.Vector3(), camInit: false,
      touch: TOUCH ? { stick: { active: false, x: 0, y: 0 }, thrSet: null, brake: false, actions: [] } : null,
    };
    return p;
  }

  function removePlayers() {
    for (const p of players) {
      scene.remove(p.model.group); scene.remove(p.tag);
      if (p.trail) p.trail.dispose();
      if (p.engine) p.engine.stop();
      p.model.group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    }
    players.length = 0;
    hudEl.innerHTML = '';
  }

  function startFlying() {
    removePlayers();
    const n = 1;
    for (let i = 0; i < n; i++) {
      const pl = prefs.pl[i];
      const starts = startsFor(pl.type);
      const choice = starts.find(x => x.id === prefs.start) ? prefs.start : starts[0].id;
      const p = makePlayer(i, pl.type, pl.color);
      p.choice = choice;
      p.spot = freeSpot(choice, pl.type);
      placePlane(p.s, p.spot);
      players.push(p);
    }
    S.phase = 'fly'; S.paused = false;
    if (tilt.ok) { tilt.base = tilt.pitch; tilt.sbase = tilt.steer; }    // "level" = however you're holding it now
    buildHud();
    layout();
    for (const p of players) p.engine = makeEngine(p.type, players.length);
    if (prefs.shared && !net.room) goPublic();
    keepAwake(true);
    render();
    if (missions) { missions.setFlying(true); if (S.openMis) missions.openPicker(); }
    S.openMis = false;
  }

  // pick a start spot nobody else is sitting on (shared sky: planes don't bump into each other)
  function freeSpot(choice, type) {
    for (let k = 0; k < 6; k++) {
      const sp = spotFor(choice, k, type);
      const busy = [...remotes.values()].some(r => Math.hypot(r.pos.x - sp.x, r.pos.z - sp.z) < 45 && Math.abs(r.pos.y - (sp.y ?? r.pos.y)) < 60);
      if (!busy) return sp;
    }
    return spotFor(choice, Math.floor(Math.random() * 4), type);
  }
  function respawn(p) {
    const ms = missions && missions.respawnSpot();
    p.spot = ms || freeSpot(p.choice, p.type);
    placePlane(p.s, p.spot);
    p.camInit = false;
    flash(p, '🛫');
  }

  // ---------------------------------------------------------------- fly with a friend: jump in right behind them
  const pilotList = () => {
    const me = players[0];
    return [...remotes.entries()].map(([pid, r]) => ({ pid, r, d: me ? r.pos.distanceTo(me.s.pos) : 0 })).sort((a, b) => a.d - b.d);
  };
  function togglePilots(p) {
    sound.pop();
    const box = p.hud.v.querySelector('.sp-pilots');
    if (box.classList.contains('show')) { box.classList.remove('show'); return; }
    fillPilots(p, box);
    box.classList.add('show');
  }
  function pilotStatus() {
    if (net.room) return '👫 In a friends game';
    if (!prefs.shared) return '👫 Flying with friends is off (turn it on in ⏸️)';
    if (!friendUids().length) return '👫 Add friends on the main menu to fly together';
    if (!net.pub) return '👫 Connecting… ⏳';
    return '🌤️ No friends flying right now';
  }
  // rebuild only when who's in the list changes (rebuilding under a finger loses the tap); distances update in place
  function fillPilots(p, box) {
    const list = pilotList();
    const key = list.slice(0, 12).map(x => x.pid).join() + '|' + (list.length ? '' : pilotStatus());
    if (box.dataset.key !== key) {
      box.dataset.key = key;
      box.innerHTML = list.length
        ? list.slice(0, 12).map(x => `<button data-pid="${x.pid}" style="--rc:#${new THREE.Color(x.r.color).getHexString()}"><span>${PLANES[x.r.type].icon}</span><b>${(x.r.name || "Pilot").replace(/[<>&"]/g, "")}</b><small></small><i>✈️➡️</i></button>`).join('')
        : `<p>${pilotStatus()}</p>`;
      box.querySelectorAll('button').forEach(b => tap(b, () => { const r = remotes.get(b.dataset.pid); box.classList.remove('show'); if (r) teleportTo(p, r); }));
    }
    for (const x of list.slice(0, 12)) {
      const el = box.querySelector(`button[data-pid="${x.pid}"] small`);
      if (el) { const t = x.d < 1000 ? Math.round(x.d) + ' m' : (x.d / 1000).toFixed(1) + ' km'; if (el.textContent !== t) el.textContent = t; }
    }
  }
  function teleportNext(p) {
    const list = pilotList();
    if (!list.length) { flash(p, pilotStatus()); return; }
    p.tpIndex = ((p.tpIndex ?? -1) + 1) % list.length;
    teleportTo(p, list[p.tpIndex].r);
  }
  function teleportTo(p, r) {
    const s = p.s, P = s.P, d = r.d || {};
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(r.tq), side = new THREE.Vector3(-fwd.z, 0, fwd.x).normalize();
    const g = surfaceAt(r.pos.x, r.pos.z);
    const theirP = PLANES[r.type];
    const parked = r.vel.length() < 3 && r.pos.y - g.h < theirP.gearH + 2;
    const gap = Math.max(P.span, theirP.span) * 1.2 + 12;
    s.crashed = 0; s.events.length = 0; s.hookCaught = false; s.catapult = 0;
    if (parked) {
      // they're on the ground: park next to them, same way round
      const hdg = Math.atan2(fwd.x, -fwd.z);
      const x = r.pos.x + side.x * gap, z = r.pos.z + side.z * gap;
      placePlane(s, { x, z, y: surfaceAt(x, z).h, hdg });
    } else {
      // just behind and a little to the side, same speed, same angles
      // use where they are now (predicted), not where their model has smoothed to
      s.pos.copy(r.target || r.pos).addScaledVector(fwd, -gap * 1.6).addScaledVector(side, gap * 0.6);
      s.pos.y += 4;
      const gh = surfaceAt(s.pos.x, s.pos.z).h;
      if (s.pos.y < gh + P.gearH + 3) s.pos.y = gh + P.gearH + 3;
      s.quat.copy(r.tq);
      s.vel.copy(r.vel);
      s.omega.set(0, 0, 0);
      s.onGround = false; s.airTime = 30;
      const th = clamp(d.th ?? 0.6, 0, 1);
      s.throttle = s.input.throttle = th; s.rpm = th;
      if (P.gear === 'retract') { s.gearDown = (d.g ?? 1) > 0.5; s.gear = s.gearDown ? 1 : 0; }
      s.flaps = clamp(Math.round(d.f || 0), 0, P.flaps.length - 1); s.flapPos = s.flaps;
    }
    p.camInit = false; p.flyby = null;
    p.spot = p.spot || { x: s.pos.x, z: s.pos.z, hdg: 0 };
    flash(p, '✈️ Flying with ' + displayName(r.name, r.type) + '!');
    sound.whoosh();
  }

  // ---------------------------------------------------------------- cameras
  const tv = new THREE.Vector3(), tv2 = new THREE.Vector3(), tq = new THREE.Quaternion(), te = new THREE.Euler();
  function updateCamera(p, dt) {
    const s = p.s, P = s.P, cam = p.cam, pos = s.pos;
    const fwd = tv.set(0, 0, 1).applyQuaternion(s.quat), up = tv2.set(0, 1, 0).applyQuaternion(s.quat);
    cam.near = p.view === 'cockpit' ? 0.05 : 0.5;
    if (p.view === 'cockpit') {
      const [ex, ey, ez] = P.eye;
      cam.position.set(ex, ey, ez).applyQuaternion(s.quat).add(pos);
      cam.quaternion.copy(s.quat).multiply(tq.setFromEuler(te.set(p.look.pitch, Math.PI + p.look.yaw, 0, 'YXZ')));
      cam.fov = 70;
    } else if (p.view === 'chase') {
      const d = P.camDist * p.look.dist;
      // follow the plane, but keep the horizon mostly level
      const flatF = new THREE.Vector3(fwd.x, 0, fwd.z);
      if (flatF.lengthSq() < 0.01) flatF.set(0, 0, 1); flatF.normalize();
      const dir = s.onGround || P.kind === 'heli' ? flatF : fwd.clone().lerp(flatF, 0.35).normalize();
      const want = pos.clone().addScaledVector(dir, -d).addScaledVector(new THREE.Vector3(0, 1, 0), d * 0.26);
      const gh = Math.max(surfaceAt(want.x, want.z).h, 0) + 2;
      if (want.y < gh) want.y = gh;
      // orbit offset from dragging
      if (p.look.yaw || p.look.pitch) {
        const off = want.clone().sub(pos).applyAxisAngle(new THREE.Vector3(0, 1, 0), p.look.yaw);
        want.copy(pos).add(off); want.y += p.look.pitch * d;
      }
      if (!p.camInit) { p.camPos.copy(want); p.camInit = true; }
      p.camPos.lerp(want, 1 - Math.exp(-dt * (P.kind === 'heli' ? 4 : 7)));
      cam.position.copy(p.camPos);
      const look = pos.clone().addScaledVector(fwd, d * 0.3).addScaledVector(new THREE.Vector3(0, 1, 0), d * 0.05);
      cam.up.set(0, 1, 0).lerp(up, P.kind === 'heli' ? 0.1 : 0.3).normalize();
      cam.lookAt(look);
      cam.fov = 62 + clamp((s.speed - P.vref) / 6, 0, 10);
    } else if (p.view === 'orbit') {
      const d = P.camDist * 1.2 * p.look.dist;
      const a = p.look.oyaw, b = clamp(p.look.opitch, -0.2, 1.4);
      p.look.oyaw += dt * 0.08 * (PARAMS.has("spfreeze") ? 0 : 1);
      cam.position.set(pos.x + Math.sin(a) * Math.cos(b) * d, pos.y + Math.sin(b) * d, pos.z + Math.cos(a) * Math.cos(b) * d);
      const gh = Math.max(surfaceAt(cam.position.x, cam.position.z).h, 0) + 2;
      if (cam.position.y < gh) cam.position.y = gh;
      cam.up.set(0, 1, 0); cam.lookAt(pos); cam.fov = 55;
    } else {
      // fly-by: sit ahead of the plane and watch it go past
      const ahead = s.vel.length() > 3 ? s.vel.clone().normalize() : fwd.clone();
      if (!p.flyby || p.flyby.distanceTo(pos) > Math.max(500, P.length * 25) || (p.flyby.clone().sub(pos).dot(ahead) < -P.length * 12)) {
        const side = new THREE.Vector3(-ahead.z, 0, ahead.x).normalize();
        p.flyby = pos.clone().addScaledVector(ahead, Math.max(150, s.speed * 4)).addScaledVector(side, P.length * 2.5 + 15);
        p.flyby.y = Math.max(p.flyby.y + 6, surfaceAt(p.flyby.x, p.flyby.z).h + 3);
      }
      cam.position.copy(p.flyby); cam.up.set(0, 1, 0); cam.lookAt(pos);
      cam.fov = clamp(4000 / Math.max(30, p.flyby.distanceTo(pos)), 12, 60);
    }
    cam.updateProjectionMatrix();
  }
  function setLayers(p) {
    const cam = p.cam;
    cam.layers.set(0);
    for (const q of players) {
      const mine = q === p;
      if (!(mine && p.view === 'cockpit')) cam.layers.enable(10 + q.slot);
      if (mine && p.view === 'cockpit') cam.layers.enable(12 + q.slot);
      if (!mine) cam.layers.enable(14 + q.slot);
      if (mine) cam.layers.enable(16 + q.slot);
    }
  }

  // ---------------------------------------------------------------- sound
  let noiseBuf = null;
  function noise(a) {
    if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = a.createBufferSource(); src.buffer = noiseBuf; src.loop = true; return src;
  }
  function makeEngine(type, count) {
    const a = prefs.sound ? audioCtx() : null;
    if (!a) return null;
    const P = PLANES[type], vol = count > 1 ? 0.6 : 1;
    const out = a.createGain(); out.gain.value = 0; out.connect(a.destination);
    const nodes = [];
    const n = noise(a), nf = a.createBiquadFilter(), ng = a.createGain();
    nf.type = 'lowpass'; nf.frequency.value = 400; n.connect(nf).connect(ng).connect(out); n.start(); nodes.push(n);
    const o = a.createOscillator(), og = a.createGain(), of = a.createBiquadFilter();
    o.type = P.engine === 'prop' ? 'sawtooth' : 'sine'; of.type = 'lowpass'; of.frequency.value = 900;
    o.connect(of).connect(og).connect(out); o.start(); nodes.push(o);
    // helicopter / prop "thump"
    const lfo = a.createOscillator(), lg = a.createGain();
    lfo.frequency.value = 10; lg.gain.value = 0; lfo.connect(lg).connect(out.gain); lfo.start(); nodes.push(lfo);
    // wind
    const w = noise(a), wf = a.createBiquadFilter(), wg = a.createGain();
    wf.type = 'bandpass'; wf.frequency.value = 800; wf.Q.value = 0.5; w.connect(wf).connect(wg).connect(a.destination); wg.gain.value = 0; w.start(); nodes.push(w);
    return {
      set(rpm, speed, ab, inside) {
        const t = a.currentTime, k = inside ? 0.6 : 1;
        if (P.engine === 'prop') {
          o.frequency.setTargetAtTime(40 + rpm * 70, t, 0.1); og.gain.setTargetAtTime(0.05 + rpm * 0.06, t, 0.1);
          nf.frequency.setTargetAtTime(200 + rpm * 600, t, 0.1); ng.gain.setTargetAtTime(0.05 + rpm * 0.1, t, 0.1);
          lfo.frequency.setTargetAtTime(15 + rpm * 30, t, 0.1); lg.gain.setTargetAtTime(0.08 * rpm * vol, t, 0.1);
        } else if (P.engine === 'paper') {
          og.gain.setTargetAtTime(0, t, 0.1); lg.gain.setTargetAtTime(0, t, 0.1);
          nf.frequency.setTargetAtTime(700 + ab * 1400, t, 0.08); ng.gain.setTargetAtTime(ab * 0.16, t, 0.08);
        } else if (P.engine === 'heli') {
          o.frequency.setTargetAtTime(60 + rpm * 40, t, 0.1); og.gain.setTargetAtTime(0.03, t, 0.1);
          nf.frequency.setTargetAtTime(300 + rpm * 400, t, 0.1); ng.gain.setTargetAtTime(0.1 + rpm * 0.1, t, 0.1);
          lfo.frequency.setTargetAtTime(4 + rpm * 14, t, 0.1); lg.gain.setTargetAtTime(0.2 * rpm * vol, t, 0.1);
        } else {
          o.frequency.setTargetAtTime(300 + rpm * 900, t, 0.3); og.gain.setTargetAtTime(0.012 + rpm * 0.02, t, 0.2);
          nf.frequency.setTargetAtTime(300 + rpm * 1500 + ab * 800, t, 0.3); ng.gain.setTargetAtTime(0.08 + rpm * 0.18 + ab * 0.2, t, 0.3);
        }
        out.gain.setTargetAtTime(vol * k * (prefs.sound ? 0.9 : 0), t, 0.1);
        wf.frequency.setTargetAtTime(400 + speed * 8, t, 0.2);
        wg.gain.setTargetAtTime(prefs.sound ? clamp(speed / (P.engine === 'paper' ? 45 : 120), 0, 1) * (P.engine === 'paper' ? 0.08 : 0.12) * vol * k : 0, t, 0.2);
      },
      stop() { const t = a.currentTime; out.gain.setTargetAtTime(0, t, 0.05); wg.gain.setTargetAtTime(0, t, 0.05); nodes.forEach(x => { try { x.stop(t + 0.3); } catch (e) { /* */ } }); },
    };
  }
  // rain + thunder (shared)
  let rainSnd = null;
  function rainSound(amount) {
    const a = prefs.sound ? audioCtx() : null;
    if (!a) return;
    if (!rainSnd) { const n = noise(a), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = 1500; g.gain.value = 0; n.connect(f).connect(g).connect(a.destination); n.start(); rainSnd = { n, g }; }
    rainSnd.g.gain.setTargetAtTime(amount * 0.08, a.currentTime, 0.5);
  }
  function thunder(dist) {
    const a = prefs.sound ? audioCtx() : null; if (!a) return;
    const n = noise(a), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'lowpass'; f.frequency.value = 160; const t = a.currentTime, v = clamp(1.5 - dist / 6000, 0.2, 1) * 0.6;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.1); g.gain.exponentialRampToValueAtTime(0.001, t + 3.5);
    n.connect(f).connect(g).connect(a.destination); n.start(); n.stop(t + 3.6);
  }
  const speak = text => {
    if (!prefs.sound || !('speechSynthesis' in window)) return;
    try { const u = new SpeechSynthesisUtterance(text); u.rate = 1.15; u.pitch = 0.9; u.volume = 0.8; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* */ }
  };

  // ---------------------------------------------------------------- events -> messages and sounds
  const LANDING = { butter: ['🧈 Butter landing!', 3], good: ['👍 Nice landing!', 2], ok: ['🙂 Landed!', 1], hard: ['😬 Bumpy landing!', 0] };
  function handleEvents(p) {
    const s = p.s, fx = world.fx;
    for (const e of s.events) {
      if (e === 'takeoff') { flash(p, '🛫 Up we go!'); sound.tone(500, 0.2, 'triangle', 0.1, 800); }
      else if (e.startsWith('landing:')) {
        const q = e.split(':')[1];
        flash(p, LANDING[q][0] + (LANDING[q][1] ? ' ' + '⭐'.repeat(LANDING[q][1]) : ''));
        if (q === 'butter' || q === 'good') sound.win(); else sound.bump();
        for (let i = 0; i < 6; i++) fx.puff(s.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, -s.P.gearH, (Math.random() - 0.5) * 3)), 0xdddddd, 1.5, 1.5, new THREE.Vector3(0, 1, 0), 1);
        p.said = {};
      } else if (e === 'bounce') { flash(p, '🦘 Boing!'); sound.bump(); }
      else if (e === 'crash') {
        flash(p, s.crashWhy === 'gear' ? '⚙️ Wheels were up! 💥' : s.crashWhy === 'water' ? '💦 Splash! 💥' : '💥 Oops!');
        sound.bump(); sound.tone(80, 0.6, 'sawtooth', 0.15, 40);
        const water = s.crashWhy === 'water';
        for (let i = 0; i < 26; i++) fx.puff(s.pos.clone(), water ? 0xffffff : i % 3 ? 0x555555 : 0xff9a3c, water ? 6 : 5, 3 + Math.random() * 2, new THREE.Vector3((Math.random() - 0.5) * 14, Math.random() * 10, (Math.random() - 0.5) * 14), 2);
        p.crashAt = clock + 2.8;
      } else if (e === 'splash') { sound.splash(); for (let i = 0; i < 10; i++) fx.puff(s.pos.clone().setY(0.5), 0xffffff, 2, 1.2, new THREE.Vector3((Math.random() - 0.5) * 8, 4 + Math.random() * 4, (Math.random() - 0.5) * 8)); }
      else if (e === 'wire') { flash(p, '⚓ Caught the wire!'); sound.tone(200, 0.5, 'sawtooth', 0.1, 80); }
      else if (e === 'offdeck') { flash(p, '🚀 Off the deck!'); }
      else if (e === 'paperdown' || e === 'paperwet') {
        const wet = e === 'paperwet';
        flash(p, wet ? '💦 Splash! The paper got wet' : '📄 Landed!'); sound.bump();
        for (let i = 0; i < 10; i++) fx.puff(s.pos.clone(), wet ? 0xffffff : 0xd8cbb0, 2, 1.4, new THREE.Vector3((Math.random() - 0.5) * 5, 2 + Math.random() * 3, (Math.random() - 0.5) * 5), 1.2, 0.7);
        if (!(missions && missions.kind === 'paper')) p.crashAt = clock + 2.6;   // free flying: back up into the sky
      }
      if (missions) missions.event(e.split(':')[0], p);
    }
    s.events.length = 0;
  }
  let missions = null;
  // what missions.js may use
  function missionCtx(fx) {
    return {
      scene, fx, root, before: ui, sound,
      me: () => players[0],
      easy: () => prefs.easy,
      now: () => (net.room ? net.room.now() : Date.now()),
      myUid: () => (net.room ? net.room.uid : 'me'),
      inRoom: () => !!net.room,
      isHost: () => !net.room || !!net.room.isHost,
      setMeta: m => { if (net.room) net.room.setMeta({ mission: m || null }).catch(() => {}); else missions.onMeta(m); },
      others: () => {
        if (!net.room) return [];
        const out = [], uid = net.room.uid, now = net.room.now();
        for (const [pid, d] of Object.entries(net.live || {})) {
          if (pid.startsWith(uid + '_') || !d || typeof d !== 'object' || typeof d.t !== 'number' || now - d.t > 12000) continue;
          out.push({ uid: pid.split('_')[0], name: displayName(d.n, d.ty), color: d.c, ms: d.ms && typeof d.ms === 'object' ? d.ms : null });
        }
        return out;
      },
      myName: () => myName(),
      hostName: () => { const e = Object.entries(net.players || {}).find(([pid]) => pid.startsWith((net.hostUid || '?') + '_')); return (e && cleanName(e[1].name)) || 'The host'; },
      placeMe: (spot, type) => {
        const p = players[0]; if (!p) return;
        if (type && p.type !== type) swapPlane(p, type);
        placePlane(p.s, spot); p.s.crashed = 0; p.crashAt = 0; p.camInit = false; p.said = {};
      },
      flash: t => players[0] && flash(players[0], t),
      respawnMe: () => { const p = players[0]; if (p) { p.crashAt = 0; respawn(p); } },
      invite: () => hostRoomFlying(),
    };
  }
  // change plane while flying (missions): keep the same player, HUD and controls
  function swapPlane(p, type) {
    scene.remove(p.model.group); scene.remove(p.tag);
    if (p.trail) p.trail.dispose();
    p.model.group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    if (p.engine) p.engine.stop();
    const np = makePlayer(p.slot, type, p.colorIdx);
    Object.assign(p, { s: np.s, model: np.model, cockpit: np.cockpit, tag: np.tag, type, color: np.color, trail: np.trail });
    p.engine = makeEngine(type, players.length);
    flash(p, PLANES[type].icon + ' ' + PLANES[type].name);
  }

  // ---------------------------------------------------------------- easy-mode helpers + warnings
  function helpers(p, dt) {
    const s = p.s, P = s.P;
    // nearest airport / approach
    let near = null, nd = 1e9;
    for (const ap of AIRPORTS) { const d = Math.hypot(s.pos.x - ap.x, s.pos.z - ap.z); if (d < nd) { nd = d; near = ap; } }
    s.landingNear = nd < 8000;
    if (prefs.easy && P.kind === 'plane' && P.gear === 'retract' && !s.onGround) {
      if (s.gearDown && s.agl > 200 && s.vs > 2) s.gearDown = false;
      if (!s.gearDown && s.agl < 260 && s.vs < -0.5 && s.ias < P.vref * 1.7) { s.gearDown = true; flash(p, '⚙️ Wheels down'); }
    }
    if (prefs.easy && P.kind === 'plane') {
      const max = P.flaps.length - 1;
      const want = s.onGround ? (s.speed < 3 ? Math.min(1, max) : s.flaps) : s.ias < P.vref * 1.2 && s.agl < 400 ? max : s.ias < P.vref * 1.45 && s.agl < 600 ? Math.min(max, Math.ceil(max / 2)) : 0;
      s.flaps = want;
    }
    s.landLight = world.sky.state.lightsOn > 0.2 && s.agl < 1200;
    // catapult on the carrier
    if (P.hook && s.onGround && s.surface === 'deck' && s.throttle > 0.9 && s.speed < 3 && !s.input.brake && !s.catapult) { s.catapult = 2.4; flash(p, '🚀 Catapult!'); sound.whoosh(); }
    // landing callouts (gear down, coming down)
    if (P.kind === 'plane' && !s.onGround && s.gearDown && s.vs < -0.5 && s.landingNear) {
      const aglFt = ftOf(s.agl);
      for (const c of [100, 50, 30, 10]) if (aglFt < c && aglFt > c - 15 && !p.said[c] && players.length === 1) { p.said[c] = 1; speak(c === 100 ? 'one hundred' : String(c)); }
    }
    if (s.agl > 400) p.said = {};
    // smoke trail
    if (s.smoke && !s.crashed) {
      p.smokeT -= dt;
      if (p.smokeT <= 0) { p.smokeT = 0.04; world.fx.puff(p.model.parts.smokeAt.clone().applyQuaternion(s.quat).add(s.pos), p.color, 1.6, 7, null, 1.2, 0.85); }
    }
    // engine smoke on take-off runs, tyre smoke etc. (a little dust on grass)
    if (s.onGround && s.speed > 15 && (s.surface === 'grass' || s.surface === 'land') && Math.random() < 0.3) world.fx.puff(s.pos.clone().setY(s.pos.y - P.gearH), 0xb8a27a, 1.5, 1.5, null, 1, 0.5);
    if (s.onGround && s.surface === 'water' && s.speed > 6 && Math.random() < 0.5) world.fx.puff(s.pos.clone().setY(0.4), 0xffffff, 1.5, 1, new THREE.Vector3(0, 2, 0), 1, 0.7);
    // heli downwash near the ground
    if (P.kind === 'heli' && s.agl < 25 && s.rpm > 0.5 && Math.random() < 0.4) world.fx.puff(new THREE.Vector3(s.pos.x + (Math.random() - 0.5) * 16, surfaceAt(s.pos.x, s.pos.z).h + 0.5, s.pos.z + (Math.random() - 0.5) * 16), surfaceAt(s.pos.x, s.pos.z).kind === 'water' ? 0xffffff : 0xc8b890, 2, 1.2, null, 1, 0.4);
    // landing guide hoops (easy mode, gear down, near an airport, lined up)
    const rings = world.fx.ringSets[p.slot];
    let shown = false;
    if (prefs.easy && prefs.guide && P.kind === 'plane' && !s.onGround && s.gearDown && near && nd < 9000) {
      // pick the runway end we're heading towards
      for (const dir of [1, -1]) {
        const hdg = near.hdg + (dir < 0 ? Math.PI : 0);
        let dh = ((s.heading - hdg + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        if (Math.abs(dh) > 70 * D) continue;
        const loc = runwayLocal(near, s.pos.x, s.pos.z);
        const distTo = dir > 0 ? -near.len / 2 - loc.along : loc.along - near.len / 2;
        if (distTo < 150 || distTo > 8000) continue;
        rings.forEach((r, i) => {
          const dd = 300 + i * 450;
          if (dd > distTo + 200) { r.visible = false; return; }
          const [x, z] = runwayPoint(near, dir * (-near.len / 2 - dd + 300), 0);
          const y = near.elev + Math.tan(3 * D) * dd + P.gearH + 2;
          r.position.set(x, y, z); r.rotation.set(0, -hdg, 0);
          const sz = 12 + P.span * 0.8; r.scale.setScalar(sz);
          r.visible = true;
        });
        shown = true; break;
      }
    }
    if (!shown) rings.forEach(r => { r.visible = false; });
  }

  // ---------------------------------------------------------------- HUD
  function buildHud() {
    hudEl.innerHTML = '';
    players.forEach((p, i) => {
      const v = el(`<div class="sp-view" style="--pc:#${new THREE.Color(p.color).getHexString()}">
        <div class="sp-tl">
          <div class="sp-read"><span>💨</span><b class="sp-spd">0</b><small>kt</small></div>
          <div class="sp-read"><span>⛰️</span><b class="sp-alt">0</b><small>ft</small><i class="sp-vsi"></i></div>
          <div class="sp-chips"><i class="sp-c-gear"></i><i class="sp-c-flaps"></i><i class="sp-c-brake">🅿️</i><button class="sp-c-net"></button><button class="sp-c-mis" aria-label="Missions">🎯</button><i class="sp-wind">🌬️<b>➜</b><small></small></i></div>
        </div>
        <div class="sp-pilots"></div>
        <div class="sp-place"></div>
        <div class="sp-msg"></div>
        <div class="sp-warn"></div>
        <div class="sp-hint"></div>
        <div class="sp-tr">
          <canvas class="sp-map" width="320" height="320"></canvas>
          <div class="sp-near"><i class="sp-near-arrow">⬆️</i><span class="sp-near-txt"></span><b class="sp-sky"></b></div>
          <div class="sp-trb"><button class="sp-b sp-cam"></button><button class="sp-b sp-pause" aria-label="Pause">${icon('pause')}</button></div>
        </div>
        <div class="sp-thrbar"><i></i><span class="sp-thricon">⚡</span></div>
        ${p.touch ? `<div class="sp-stick"><i></i></div>
          <div class="sp-thr"><div class="sp-thr-fill"></div><div class="sp-thr-knob">⚡</div></div>
          <button class="sp-boostbtn" aria-label="Boost">🚀<i></i></button>
          <div class="sp-tbtns"><button data-a="gear">⚙️</button><button data-a="flaps">🪶</button><button data-a="brake" class="sp-hold">🛑</button><button data-a="smoke">💨</button><button data-a="drop" class="sp-dropbtn">💧</button>${players.length === 1 ? '<button data-a="tilt" class="sp-tilt">👆</button>' : ''}</div>` : ''}
      </div>`);
      hudEl.appendChild(v);
      const q = s => v.querySelector(s);
      p.hud = { v, spd: q('.sp-spd'), alt: q('.sp-alt'), vsi: q('.sp-vsi'), gear: q('.sp-c-gear'), flaps: q('.sp-c-flaps'), brake: q('.sp-c-brake'), net: q('.sp-c-net'), place: q('.sp-place'), msg: q('.sp-msg'), warn: q('.sp-warn'), hint: q('.sp-hint'), map: q('.sp-map'), near: q('.sp-near'), nearTxt: q('.sp-near-txt'), nearArrow: q('.sp-near-arrow'), sky: q('.sp-sky'), cam: q('.sp-cam'), thr: q('.sp-thrbar i'), acc: 0 };
      click(q('.sp-cam'), () => cycleView(p));
      tap(q('.sp-c-net'), () => togglePilots(p));
      tap(q('.sp-c-mis'), () => { sound.pop(); if (missions) missions.openPicker(); });
      click(q('.sp-pause'), () => pause(true));
      click(q('.sp-map'), () => { p.mapBig = !p.mapBig; v.classList.toggle('sp-bigmap', p.mapBig); });
      if (p.touch) wireTouch(p, v);
      wireLook(p, v);
    });
    if (players.length === 2) { const d = el('<div class="sp-divider"></div>'); hudEl.appendChild(d); }
  }
  function wireTouch(p, v) {
    const T = p.touch;
    const stick = v.querySelector('.sp-stick'), knob = stick.querySelector('i');
    let sid = null;
    const setStick = e => {
      const r = stick.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, rad = r.width / 2;
      let x = (e.clientX - cx) / rad, y = (e.clientY - cy) / rad; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
      T.stick.x = x; T.stick.y = y; knob.style.transform = `translate(${x * rad * 0.6}px, ${y * rad * 0.6}px)`;
    };
    stick.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); sid = e.pointerId; stick.setPointerCapture(sid); T.stick.active = true; setStick(e); });
    stick.addEventListener('pointermove', e => { if (e.pointerId === sid) setStick(e); });
    const endStick = e => { if (e.pointerId !== sid) return; sid = null; T.stick.active = false; T.stick.x = T.stick.y = 0; knob.style.transform = ''; };
    stick.addEventListener('pointerup', endStick); stick.addEventListener('pointercancel', endStick);
    const thr = v.querySelector('.sp-thr');
    let tid = null;
    const setThr = e => { const r = thr.getBoundingClientRect(); T.thrSet = clamp(1 - (e.clientY - r.top - 20) / (r.height - 40), 0, 1); };
    thr.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); tid = e.pointerId; thr.setPointerCapture(tid); setThr(e); });
    thr.addEventListener('pointermove', e => { if (e.pointerId === tid) setThr(e); });
    thr.addEventListener('pointerup', () => { tid = null; }); thr.addEventListener('pointercancel', () => { tid = null; });
    const bb = v.querySelector('.sp-boostbtn');
    if (bb) {
      bb.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); T.boost = true; bb.classList.add('on'); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) bb.addEventListener(ev, () => { T.boost = false; bb.classList.remove('on'); });
    }
    v.querySelectorAll('.sp-tbtns button').forEach(b => {
      const a = b.dataset.a;
      if (a === 'brake') {
        b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); T.brake = true; b.classList.add('on'); });
        for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => { T.brake = false; b.classList.remove('on'); });
      } else if (a === 'tilt') {
        b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (!tilt.listening) { askTilt(); prefs.tilt = true; } else prefs.tilt = !prefs.tilt; tilt.base = tilt.pitch; tilt.sbase = tilt.steer; savePrefs(); sound.pop(); });
      } else b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); T.actions.push(a); sound.tok(); });
    });
  }
  // drag to look around, wheel / pinch to zoom
  function wireLook(p, v) {
    const ptrs = new Map();
    let pinch0 = 0, dist0 = 1;
    v.addEventListener('pointerdown', e => {
      if (e.target.closest('button,.sp-stick,.sp-thr,.sp-map')) return;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = p.look.dist; }
    });
    v.addEventListener('pointermove', e => {
      const o = ptrs.get(e.pointerId); if (!o) return;
      const dx = e.clientX - o.x, dy = e.clientY - o.y; o.x = e.clientX; o.y = e.clientY;
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); p.look.dist = clamp(dist0 * pinch0 / Math.max(d, 1), 0.4, 4); return; }
      if (p.view === 'cockpit') { p.look.yaw = clamp(p.look.yaw - dx * 0.006, -2.6, 2.6); p.look.pitch = clamp(p.look.pitch + dy * 0.005, -1, 1.2); }
      else if (p.view === 'orbit') { p.look.oyaw -= dx * 0.008; p.look.opitch = clamp(p.look.opitch + dy * 0.006, -0.2, 1.4); }
      else if (p.view === 'chase') { p.look.yaw -= dx * 0.008; p.look.pitch = clamp(p.look.pitch + dy * 0.006, -0.3, 1.2); }
    });
    const up = e => { ptrs.delete(e.pointerId); };
    v.addEventListener('pointerup', up); v.addEventListener('pointercancel', up); v.addEventListener('pointerleave', up);
    v.addEventListener('dblclick', () => { p.look.yaw = 0; p.look.pitch = 0; p.look.dist = 1; });
    v.addEventListener('wheel', e => { e.preventDefault(); p.look.dist = clamp(p.look.dist * (e.deltaY > 0 ? 1.1 : 0.9), 0.4, 4); }, { passive: false });
  }
  function cycleView(p) {
    sound.pop();
    p.view = VIEWS[(VIEWS.indexOf(p.view) + 1) % VIEWS.length];
    p.look.yaw = 0; p.look.pitch = 0; p.flyby = null; p.camInit = false;
    prefs.view[p.slot] = p.view; savePrefs();
    flash(p, VIEW_ICON[p.view]);
  }
  function flash(p, text) { if (!p.hud) return; p.hud.msg.textContent = text; p.hud.msg.classList.add('show'); p.msgT = 2.2; }

  function updateHud(p, dt) {
    const firing = !!missions && missions.kind === 'fire';
    if (p.hud.firing !== firing) { p.hud.firing = firing; p.hud.v.classList.toggle('sp-firing', firing); }
    const s = p.s, P = s.P, h = p.hud;
    if (!h) return;
    if (p.msgT > 0) { p.msgT -= dt; if (p.msgT <= 0) h.msg.classList.remove('show'); }
    h.acc += dt;
    if (h.acc < 1 / 12) return;
    h.acc = 0;
    h.spd.textContent = kts(s.ias);
    // easy: height above the ground. real: height above the sea (like a real altimeter)
    h.alt.textContent = ftOf(Math.max(0, prefs.easy ? s.agl : s.alt));
    h.vsi.style.transform = `rotate(${clamp(-s.vs * 6, -80, 80)}deg)`;
    h.vsi.className = 'sp-vsi ' + (s.vs > 1 ? 'up' : s.vs < -1 ? 'down' : '');
    const gearTxt = P.gear === 'retract' ? (s.gear > 0.99 ? '⚙️⬇️' : s.gear < 0.01 ? '⚙️⬆️' : '⚙️…') : '';
    h.gear.textContent = gearTxt; h.gear.className = 'sp-c-gear ' + (s.gear > 0.99 ? 'ok' : s.gear > 0.01 ? 'moving' : '');
    h.gear.style.display = gearTxt ? '' : 'none';
    h.flaps.textContent = P.flaps.length > 1 ? '🪶' + Math.round(s.flapPos) : ''; h.flaps.style.display = P.flaps.length > 1 ? '' : 'none';
    h.brake.style.display = s.brakes && s.onGround ? '' : 'none';
    const nOnline = remotes.size;
    const nt = net.room ? `🔑 ${nOnline + 1}` : `👫 ${net.pub ? nOnline + 1 : '…'}`;
    if (h.net.textContent !== nt) h.net.textContent = nt;
    const nd = net.room || prefs.shared ? '' : 'none';
    if (h.net.style.display !== nd) h.net.style.display = nd;
    const paperP = P.kind === 'paper';
    if (h.paper !== paperP) { h.paper = paperP; h.v.classList.toggle('sp-paper', paperP); h.v.querySelector('.sp-thricon').textContent = paperP ? '🚀' : '⚡'; }
    const lvl = paperP ? s.boostE : s.throttle;
    h.thr.style.height = (lvl * 100) + '%';
    h.thr.classList.toggle('ab', s.ab > 0);
    if (paperP) { h.thr.classList.toggle('low', s.boostE < 0.2); const bi = h.v.querySelector('.sp-boostbtn i'); if (bi) bi.style.height = (s.boostE * 100) + '%'; }
    h.cam.textContent = VIEW_ICON[p.view];
    h.place.textContent = placeName(s.pos.x, s.pos.z);
    // warnings
    const warn = s.crashed ? '' : s.stall ? '⚠️ STALL – nose down!' : s.pullUp ? '⛰️ PULL UP!' : s.gearWarn ? '⚙️ Wheels down! (G)' : s.edge ? '↩️ Turn back!' : '';
    h.warn.textContent = warn; h.warn.classList.toggle('show', !!warn);
    if (warn && clock - p.warnSaid > 2.5 && players.length === 1) { p.warnSaid = clock; if (s.stall) sound.tone(420, 0.35, 'square', 0.1); if (s.pullUp) speak('Pull up'); if (s.gearWarn) sound.tone(700, 0.2, 'square', 0.08); }
    // hint for new pilots
    let hint = '';
    if (P.kind === 'paper') hint = s.onGround ? '' : s.boostE > 0.98 && s.airTime < 6 ? (TOUCH ? '🚀 Hold for a boost' : '🚀 Space = boost') : '';
    else if (s.onGround && s.speed < 2 && s.throttle < 0.05 && P.kind !== 'heli') hint = TOUCH ? '⚡ Slide power up to go!' : '⚡ Power up: R or Shift';
    else if (s.onGround && P.kind === 'heli' && s.throttle < 0.55) hint = TOUCH ? '⚡ Slide power up to lift off!' : '⚡ Lift: R or Shift';
    else if (s.onGround && s.speed > P.vr * 0.9 && !prefs.easy && P.kind !== 'heli') hint = TOUCH ? '⬇️ Pull back to take off' : '⬇️ Pull back (S / ↓) to take off';
    h.hint.textContent = hint; h.hint.classList.toggle('show', !!hint);
    drawMap(p);
    if (p.touch) {
      const k = h.v.querySelector('.sp-thr-knob'), f = h.v.querySelector('.sp-thr-fill');
      if (k) { k.style.bottom = `calc(${s.throttle * 100}% - ${s.throttle * 56}px)`; f.style.height = (s.throttle * 100) + '%'; }
      const tb = h.v.querySelector('.sp-tilt');
      if (tb) { tb.textContent = tiltActive() ? '📱' : '👆'; h.v.classList.toggle('sp-tilting', tiltActive()); }
    }
  }

  const WEATHER_ICON = { clear: '☀️', sunny: '🌤️', cloudy: '☁️', rain: '🌧️', storm: '⛈️' };
  function drawMap(p) {
    const c = p.hud.map, g = c.getContext('2d'), W = c.width, s = p.s;
    const big = !!p.mapBig;
    const range = big ? 40000 : 9000;           // metres across
    const k = W / range, img = world.mapImg;
    const rot = big ? 0 : -s.heading;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const cx = big ? 0 : s.pos.x, cz = big ? 1500 : s.pos.z;     // big map: the whole island
    const toS = (x, z) => { const dx = (x - cx) * k, dz = (z - cz) * k; return [W / 2 + dx * cr - dz * sr, W / 2 + dx * sr + dz * cr]; };
    const inside = ([a, b], m = 6) => Math.hypot(a - W / 2, b - W / 2) < W / 2 - m;
    g.save();
    g.clearRect(0, 0, W, W);
    g.beginPath(); g.arc(W / 2, W / 2, W / 2, 0, 7); g.clip();
    g.fillStyle = '#2a70a8'; g.fillRect(0, 0, W, W);
    g.save();
    g.translate(W / 2, W / 2); g.rotate(rot); g.scale(k, k); g.translate(-cx, -cz);
    g.drawImage(img, -HALF, -HALF, HALF * 2, HALF * 2);
    g.restore();
    // labels stay upright
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const label = (pt, text, size, col = '#fff') => { g.font = `700 ${size}px Nunito, Arial`; g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.65)'; g.strokeText(text, pt[0], pt[1]); g.fillStyle = col; g.fillText(text, pt[0], pt[1]); };
    const icon = (pt, ic, size) => { g.font = `${size}px sans-serif`; g.fillText(ic, pt[0], pt[1]); };
    const fs = big ? 1 : 1.15;
    for (const t of TOWNS) { const pt = toS(t.x, t.z); if (inside(pt) && (big || Math.hypot(t.x - s.pos.x, t.z - s.pos.z) < 6000)) label([pt[0], pt[1]], t.name, 13 * fs, '#ffe9a8'); }
    for (const m of LANDMARKS) { const pt = toS(m.x, m.z); if (inside(pt)) { icon(pt, m.icon, 15 * fs); const crowded = AIRPORTS.concat(TOWNS).some(a => Math.hypot(a.x - m.x, a.z - m.z) < 1800); if (big && !crowded) label([pt[0], pt[1] + 13], m.name, 10); } }
    { const pt = toS(LAKE.x, LAKE.z); if (inside(pt)) { icon(pt, '🦆', 14 * fs); if (big) label([pt[0], pt[1] + 13], 'Duck Lake', 10); } }
    { const pt = toS(CARRIER.x, CARRIER.z); if (inside(pt)) { icon(pt, '⚓', 16 * fs); if (big) label([pt[0], pt[1] + 14], 'Carrier', 10); } }
    for (const ap of AIRPORTS) {
      const pt = toS(ap.x, ap.z);
      if (!inside(pt, 4)) continue;
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(pt[0], pt[1], 13 * fs, 0, 7); g.fill();
      icon(pt, '🛫', 15 * fs);
      label([pt[0], pt[1] + 20 * fs], ap.name, 12 * fs);
    }
    // other pilots
    const dot = (x, z, col, name) => {
      const pt = toS(x, z); if (!inside(pt, 3)) return;
      g.fillStyle = col; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(pt[0], pt[1], 6, 0, 7); g.fill(); g.stroke();
      if (name) label([pt[0], pt[1] - 13], name, 11);
    };
    for (const r of remotes.values()) dot(r.pos.x, r.pos.z, '#' + new THREE.Color(r.color).getHexString(), r.name);
    for (const q of players) if (q !== p) dot(q.s.pos.x, q.s.pos.z, '#' + new THREE.Color(q.color).getHexString(), '');
    if (missions) for (const m of missions.mapPoints()) { const pt = toS(m.x, m.z); if (!inside(pt, 3)) continue; g.fillStyle = m.c; g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 1.5; g.beginPath(); g.arc(pt[0], pt[1], m.r * fs * (big ? 0.8 : 1.4), 0, 7); g.fill(); g.stroke(); }
    g.restore();
    // me (in the middle of the small map)
    g.save(); g.translate(...(big ? toS(s.pos.x, s.pos.z) : [W / 2, W / 2])); if (big) g.rotate(s.heading);
    g.fillStyle = '#ffd400'; g.strokeStyle = '#000'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, -12); g.lineTo(9, 10); g.lineTo(0, 5); g.lineTo(-9, 10); g.closePath(); g.fill(); g.stroke();
    g.restore();
    if (!big) { g.fillStyle = '#fff'; g.font = '700 22px Arial'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; const a = -s.heading; g.fillText('N', W / 2 + Math.sin(a) * (W / 2 - 16), W / 2 - Math.cos(a) * (W / 2 - 16) + 8); }
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 4; g.beginPath(); g.arc(W / 2, W / 2, W / 2 - 2, 0, 7); g.stroke();
    // nearest airport, time and weather under the map
    let near = null, nd = 1e9;
    for (const ap of AIRPORTS) { const d = Math.hypot(ap.x - s.pos.x, ap.z - s.pos.z); if (d < nd) { nd = d; near = ap; } }
    const st = world.sky.state;
    const brg = Math.atan2(near.x - s.pos.x, -(near.z - s.pos.z)) - s.heading;
    if (p.hud.near) {
      p.hud.nearTxt.textContent = `${near.icon} ${near.name} · ${nd < 1000 ? Math.round(nd) + ' m' : (nd / 1000).toFixed(1) + ' km'}`;
      p.hud.nearArrow.style.transform = `rotate(${brg}rad)`;
      const w = st.wind, wsp = w.length(), we = p.hud.v.querySelector('.sp-wind');
      if (we) {
        // arrow = where the wind blows, turned to your heading (up = pushing you along)
        const rel = (Math.atan2(w.x, -w.z) - s.heading) * 180 / Math.PI - 90;
        we.querySelector('b').style.transform = `rotate(${Math.round(rel)}deg)`;
        we.lastChild.textContent = Math.round(wsp * 1.944) + '';
        we.style.display = wsp > 1.5 ? '' : 'none';
        we.title = prefs.easy ? 'Wind (easy mode: it does not push you)' : 'Wind';
      }
      p.hud.sky.textContent = (st.night > 0.6 ? '🌙' : st.dusk > 0.4 ? '🌅' : '') + (st.weather.rainbow > 0.3 ? '🌈' : (WEATHER_ICON[st.weather.kind] || ''));
    }
  }

  function layout() {
    const w = root.clientWidth, h = root.clientHeight;
    renderer.setSize(w, h, false);
    menuCam.aspect = w / h; menuCam.updateProjectionMatrix();
    if (!players.length) return;
    const side = w > h * 1.1;
    const rects = players.length === 1 ? [{ x: 0, y: 0, w, h }]
      : side ? [{ x: 0, y: 0, w: w / 2, h }, { x: w / 2, y: 0, w: w / 2, h }] : [{ x: 0, y: 0, w, h: h / 2 }, { x: 0, y: h / 2, w, h: h / 2 }];
    players.forEach((p, i) => {
      p.rect = rects[i];
      p.cam.aspect = rects[i].w / rects[i].h; p.cam.updateProjectionMatrix();
      if (p.hud) {
        Object.assign(p.hud.v.style, { left: rects[i].x + 'px', top: rects[i].y + 'px', width: rects[i].w + 'px', height: rects[i].h + 'px' });
        p.hud.v.classList.toggle('sp-corner', i === 0);
        p.hud.v.classList.toggle('sp-small', rects[i].w < 600 || rects[i].h < 420);
      }
    });
    const d = hudEl.querySelector('.sp-divider');
    if (d) Object.assign(d.style, side ? { left: (w / 2 - 2) + 'px', top: 0, width: '4px', height: h + 'px' } : { left: 0, top: (h / 2 - 2) + 'px', width: w + 'px', height: '4px' });
  }
  const onResize = () => layout();
  addEventListener('resize', onResize);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(root);

  // ---------------------------------------------------------------- online: shared sky + friends rooms
  const net = { pub: null, room: null, live: {}, sendAcc: 0, unsubs: [], players: {}, code: '' };
  async function goPublic() {
    if (net.pub || net.room || net.connecting) return;
    net.connecting = true;
    try {
      const jp = joinPublic(GAME);
      jp.then(a => { if (net.pub !== a) setTimeout(() => { if (net.pub !== a) a.leave(); }, 0); }).catch(() => {});
      const api = await Promise.race([jp, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 15000))]);
      net.connecting = false;
      if (!alive || !prefs.shared || net.room || S.phase !== 'fly') { api.leave(); return; }
      net.pub = api;
      net.unsubs.push(api.onLive(l => { net.live = l; }));
    } catch (e) { net.connecting = false; console.warn('shared sky offline', e); }
  }
  function leavePublic() {
    if (!net.pub) return;
    net.unsubs.forEach(u => u && u()); net.unsubs = [];
    net.pub.leave(); net.pub = null; net.live = {};
    clearRemotes();
  }
  function clearRemotes() { for (const r of remotes.values()) disposeRemote(r); remotes.clear(); }
  function disposeRemote(r) { if (r.trail) r.trail.dispose(); scene.remove(r.model.group); scene.remove(r.tag); r.model.group.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }

  function netTick(dt) {
    const api = net.room || net.pub;
    if (!api) return;
    const uid = api.uid;
    net.sendAcc += dt;
    const every = net.room ? 1 / 8 : 1 / 4;
    if (net.sendAcc >= every) {
      net.sendAcc = 0;
      for (const p of players) {
        const name = p.slot === 0 ? myName() : '';
        const ms = net.room && missions && p.slot === 0 ? missions.status() : null;
        api.setLive(`${uid}_p${p.slot}`, { t: api.now(), ty: p.type, c: p.color, n: name, ...netState(p.s), ...(ms ? { ms } : {}) });
      }
    }
    // friends' planes
    const now = api.now();
    const seen = new Set();
    for (const [pid, d] of Object.entries(net.live || {})) {
      if (pid.startsWith(uid + '_') || !d || typeof d !== 'object') continue;
      if (!PLANES[d.ty] || !Array.isArray(d.p) || !Array.isArray(d.q) || d.p.length !== 3 || d.q.length !== 4) continue;
      if (![...d.p, ...d.q].every(Number.isFinite) || typeof d.t !== 'number' || now - d.t > 12000) continue;
      seen.add(pid);
      let r = remotes.get(pid);
      const color = Number.isInteger(d.c) ? d.c : 0xffffff;
      if (!r || r.type !== d.ty || r.color !== color) {
        if (r) disposeRemote(r);
        const model = buildPlane(d.ty, color);
        scene.add(model.group);
        const tag = nameTag(displayName(d.n, d.ty), color); scene.add(tag);
        if (!remotes.has(pid) && remotes.size < 8 && players[0]) flash(players[0], '👋 ' + displayName(d.n, d.ty));
        r = { trail: PLANES[d.ty].kind === 'paper' ? makeTrails(model) : null, model, tag, type: d.ty, color, name: cleanName(d.n), pos: new THREE.Vector3(...d.p), vel: new THREE.Vector3(), quat: new THREE.Quaternion(...d.q), tq: new THREE.Quaternion(...d.q), t: 0, d, smokeT: 0 };
        remotes.set(pid, r);
      }
      if (cleanName(d.n) !== r.name) { scene.remove(r.tag); r.tag = nameTag(displayName(d.n, d.ty), color); scene.add(r.tag); r.name = cleanName(d.n); }
      if (r.t !== d.t) {
        r.t = d.t; r.d = d;
        r.vel.set(...(Array.isArray(d.v) && d.v.every(Number.isFinite) ? d.v : [0, 0, 0]));
        r.tq.set(...d.q).normalize();
        r.target = new THREE.Vector3(...d.p).addScaledVector(r.vel, clamp((now - d.t) / 1000, 0, 1));
        if (r.pos.distanceTo(r.target) > 300) r.pos.copy(r.target);
      }
    }
    for (const [pid, r] of remotes) if (!seen.has(pid)) { disposeRemote(r); remotes.delete(pid); }
    // still parked inside someone else's plane? move along to a free spot (random wait so two people don't both move)
    for (const p of players) {
      const s = p.s;
      if (!s.onGround || s.speed > 0.5 || s.throttle > 0.05 || Math.random() > dt * 0.7) continue;
      if ([...remotes.values()].some(r => Math.hypot(r.pos.x - s.pos.x, r.pos.z - s.pos.z) < 15 && Math.abs(r.pos.y - s.pos.y) < 10)) respawn(p);
    }
  }
  function updateRemotes(dt) {
    for (const r of remotes.values()) {
      if (r.target) { r.target.addScaledVector(r.vel, dt); r.pos.lerp(r.target, 1 - Math.exp(-dt * 5)); }
      r.quat.slerp(r.tq, 1 - Math.exp(-dt * 8));
      r.model.group.position.copy(r.pos); r.model.group.quaternion.copy(r.quat);
      r.model.group.visible = !r.d.cr;
      if (r.trail) r.trail.update(r.model.group, dt, r.vel.lengthSq() > 4, players[0] && players[0].cam.position);
      const P = PLANES[r.type];
      r.tag.position.copy(r.pos).add(tv.set(0, P.span * 0.15 + 3, 0));
      const inp = Array.isArray(r.d.i) ? r.d.i : [0, 0, 0];
      animatePlane(r.model, { roll: inp[1] || 0, pitch: inp[0] || 0, yaw: inp[2] || 0, flaps: (r.d.f || 0) / Math.max(1, P.flaps.length - 1), gear: r.d.g ?? 1, rpm: r.d.th || 0, lights: true, landLight: world.sky.state.lightsOn > 0.3, t: clock, ab: r.d.ab || 0 }, dt);
      if (r.d.sm && !r.d.cr) { r.smokeT -= dt; if (r.smokeT <= 0) { r.smokeT = 0.06; world.fx.puff(r.model.parts.smokeAt.clone().applyQuaternion(r.quat).add(r.pos), r.color, 1.6, 7, null, 1.2, 0.85); } }
    }
  }

  // friends room: "Play with friends" (together.js) makes a room and invites linked friends
  async function hostRoom() {
    S.busy = true; render();
    try {
      const room = await playTogether(GAME, () => createRoom(GAME, { state: 'fly' }));
      S.busy = false;
      if (!room) { render(); return; } // friends panel opened instead
      if (!alive) { room.leave(); return; }
      room.setMeta({ hostUid: room.uid }).catch(() => {});
      goRoom(room);
    } catch (e) { console.warn(e); S.busy = false; S.sad = clock + 2; render(); }
  }
  async function tryJoin(code) {
    S.busy = true; render();
    try {
      const room = await joinRoom(GAME, code);
      S.busy = false;
      if (!alive) { if (room) room.leave(); return; }
      if (!room) { S.gone = clock + 3; sound.bump(); render(); return; }
      joined(GAME, code);
      S.mode = 'solo';
      goRoom(room);
    } catch (e) { console.warn(e); S.busy = false; S.sad = clock + 2; render(); }
  }
  const stripHtml = () => lobbyHTML(people(net.players, net.hostUid).map(p => ({ ...p, host: true })), { hostDoing: 'flying', myUid: net.room && net.room.uid });
  const updateStrip = () => ui.querySelectorAll('.sp-strip').forEach(e => { e.innerHTML = stripHtml(); });
  async function hostRoomFlying() {
    if (net.room) return;
    try {
      const room = await playTogether(GAME, () => createRoom(GAME, { state: 'fly' }));
      if (!room) { if (players[0]) flash(players[0], '👫 Add friends on the main menu first'); return; }
      if (!alive) { room.leave(); return; }
      room.setMeta({ hostUid: room.uid }).catch(() => {});
      goRoom(room, true);
      if (players[0]) flash(players[0], '👫 Friends invited! Tap 🎯 when they arrive');
    } catch (e) { console.warn(e); if (players[0]) flash(players[0], '😢 Could not invite'); }
  }
  function goRoom(room, stay = false) {
    leavePublic();
    net.room = room; net.code = room.code; net.hostUid = room.isHost ? room.uid : '';
    room.setPlayer(room.uid + '_p0', { joined: room.now(), ...playerInfo(true) });
    net.unsubs.push(room.onLive(l => { net.live = l; }));
    net.unsubs.push(room.onPlayers(pl => { net.players = pl; updateStrip(); }));
    net.unsubs.push(room.onMeta(m => {
      if (!m && net.room === room) { leaveRoom(true); return; }
      if (m && m.hostUid && m.hostUid !== net.hostUid) { net.hostUid = m.hostUid; updateStrip(); }
      if (missions && net.room === room) missions.onMeta(m ? m.mission : null);
    }));
    if (room.onStatus) net.unsubs.push(room.onStatus(st => { net.status = st; }));
    if (!stay) S.phase = 'hangar';
    render();
  }
  function leaveRoom(gone = false) {
    if (!net.room) return;
    const r = net.room; net.room = null;
    leftRoom();
    net.unsubs.forEach(u => u && u()); net.unsubs = [];
    r.leave(); net.live = {}; clearRemotes();
    if (missions) missions.onMeta(null);
    if (gone) { S.sad = clock + 2; }
    if (S.phase === 'fly' && prefs.shared) goPublic();
    render();
  }

  // ---------------------------------------------------------------- main loop
  let last = performance.now(), clock = 0, slowT = 0, slowN = 0;
  const physOpts = { easy: true, noDie: true, wind: null };
  let dtSmooth = 1 / 60;
  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const rawDt = Math.min(0.1, (now - last) / 1000); last = now;
    // even out tiny timing wobbles between frames (big changes still go straight through)
    dtSmooth = Math.abs(rawDt - dtSmooth) > 0.02 ? rawDt : dtSmooth + (rawDt - dtSmooth) * 0.25;
    const dt = dtSmooth; clock += dt;
    if (!world) return;
    localT += dt;
    const T = worldTime();
    const { sky, terrain, scenery, life, fx } = world;

    // adaptive resolution: drop the pixel ratio if frames are slow
    slowT += dt; slowN++;
    if (slowT > 3) {
      const fps = slowN / slowT; slowT = 0; slowN = 0;
      if (fps < 26 && DPR > 0.75) { DPR = Math.max(0.75, DPR - 0.25); renderer.setPixelRatio(DPR); layout(); }
    }

    const flying = S.phase === 'fly';
    if (flying && !S.paused) {
      // inputs + actions
      for (const p of players) {
        const actions = readInput(p, dt);
        for (const a of actions) {
          const s = p.s, P = s.P;
          if (a === 'gear' && P.gear === 'retract') { if (s.onGround && s.gearDown) { flash(p, '⚙️ Not on the ground!'); continue; } s.gearDown = !s.gearDown; sound.tok(); flash(p, s.gearDown ? '⚙️⬇️ Wheels down' : '⚙️⬆️ Wheels up'); }
          if (a === 'flaps' && P.flaps.length > 1) { s.flaps = (s.flaps + 1) % P.flaps.length; sound.tok(); flash(p, '🪶 Flaps ' + s.flaps); }
          if (a === 'flapsDn' && P.flaps.length > 1) { s.flaps = Math.min(P.flaps.length - 1, s.flaps + 1); flash(p, '🪶 Flaps ' + s.flaps); }
          if (a === 'flapsUp' && P.flaps.length > 1) { s.flaps = Math.max(0, s.flaps - 1); flash(p, '🪶 Flaps ' + s.flaps); }
          if (a === 'cam') cycleView(p);
          if (a === 'smoke') { s.smoke = !s.smoke; sound.pop(); flash(p, s.smoke ? '💨 Smoke on' : '💨 Smoke off'); }
          if (a === 'pause') pause(true);
          if (a === 'drop' && missions) missions.drop();
        }
      }
      if (pressed.includes('Escape')) pause(true);
      if (pressed.includes('Backspace')) for (const p of players) respawn(p);
      if (pressed.includes('KeyT')) for (const p of players) teleportNext(p);
      if (pressed.includes('KeyM')) for (const p of players) { p.mapBig = !p.mapBig; p.hud.v.classList.toggle('sp-bigmap', p.mapBig); }
      // physics (fixed steps)
      // split this frame into equal small steps (smooth: every frame moves the plane by exactly its frame time)
      const opts = physOpts; opts.easy = prefs.easy; opts.noDie = prefs.noDie; opts.wind = prefs.easy ? null : sky.state.wind;   // easy: no crosswind (no crabbing sideways)
      const n = Math.min(14, Math.max(1, Math.ceil(dt / STEP))), h = dt / n;
      const hold = missions && missions.frozen();      // waiting on the start line
      if (!hold) for (let k = 0; k < n; k++) for (const p of players) { p.s.T = T; stepPlane(p.s, h, opts); }
      for (const p of players) {
        handleEvents(p);
        helpers(p, dt);
        if ((p.s.crashed || p.s.P.kind === 'paper') && p.crashAt && clock > p.crashAt) { p.crashAt = 0; respawn(p); }
      }
      if (missions && pressed.includes('KeyB')) missions.drop();
    } else if (S.phase === 'fly' && S.paused) pressed.includes('Escape') && pause(false);
    pressed.length = 0;

    // planes follow their state
    for (const p of players) {
      const s = p.s, m = p.model;
      m.group.position.copy(s.pos); m.group.quaternion.copy(s.quat);
      m.group.visible = !s.crashed;
      animatePlane(m, { roll: s.input.roll, pitch: s.input.pitch, yaw: s.input.yaw, flaps: s.flapPos / Math.max(1, s.P.flaps.length - 1), gear: s.gear, rpm: s.rpm, lights: true, landLight: s.landLight, t: clock, ab: s.ab, steer: s.steer }, dt);
      if (p.view === 'cockpit') p.cockpit.update(s, dt);
      if (p.trail) p.trail.update(m.group, dt, !s.onGround, p.cam.position);
      p.tag.position.copy(s.pos).add(tv.set(0, s.P.span * 0.15 + 3, 0));
      updateCamera(p, dt);
      if (p.engine) p.engine.set(s.crashed ? 0 : s.rpm, s.speed, s.ab, p.view === 'cockpit');
      updateHud(p, dt);
    }
    if (flying) {
      if (missions && !S.paused) missions.update(dt);
      netTick(dt); updateRemotes(dt);
      // shared sky dropped or never connected: keep trying
      if (prefs.shared && !net.pub && !net.room && !net.connecting && clock > (net.retryAt || 0)) { net.retryAt = clock + 5; goPublic(); }
      // keep an open pilot list up to date
      for (const p of players) { const box = p.hud && p.hud.v.querySelector('.sp-pilots.show'); if (box) fillPilots(p, box); }
    }

    // menu camera: slow circle over the main airport
    if (!flying) {
      const ap = AIRPORTS[0], a = clock * 0.03;
      const target = S.phase === 'hangar' && hangarPlane ? hangarPlane.group.position : new THREE.Vector3(ap.x, ap.elev + 40, ap.z);
      const r = S.phase === 'hangar' && hangarPlane ? PLANES[hangarPlane.type].camDist * 1.1 : 1400;
      menuCam.position.set(target.x + Math.sin(a) * r, target.y + (S.phase === 'hangar' ? r * 0.3 : 380), target.z + Math.cos(a) * r);
      menuCam.lookAt(S.phase === 'hangar' ? target.clone().add(new THREE.Vector3(0, -r * 0.32, 0)) : target);
      if (hangarPlane) animatePlane(hangarPlane, { roll: Math.sin(clock) * 0.3, pitch: 0, yaw: 0, flaps: 0.3, gear: 1, rpm: 0.15, lights: true, landLight: false, t: clock, ab: 0 }, dt);
    }

    // world
    const cams = flying ? players.map(p => p.cam) : [menuCam];
    sky.update(T, dt, cams[0].position);
    terrain.update(cams[0].position, T);
    terrain.lod(cams.map(c => c.position));
    scenery.update(dt, T, sky.state, cams.map(c => c.position));
    life.update(T, dt, cams.map(c => c.position));
    fx.update(dt, sky);
    if (flying) fx.wind.update(cams[0], sky.state.wind, dt, sky.state.night > 0.6); else fx.wind.update(cams[0], new THREE.Vector3(), dt, false);
    renderer.toneMappingExposure = lerp(1.0, 1.4, sky.state.night) + sky.state.weather.haze * 0.1;
    if (sky.state.thunder) thunder(sky.state.thunder);
    musicTick(dt);
    if (flying) rainSound(sky.state.weather.rain * (cams[0].position.y < 2200 ? 1 : 0.2));
    else rainSound(0);

    // draw each view
    const H = root.clientHeight;
    if (flying) {
      renderer.setScissorTest(true);
      players.forEach((p, i) => {
        setLayers(p);
        sky.beforeView(p.cam, i, dt);
        scenery.beforeView(p.cam.position);
        const r = p.rect || { x: 0, y: 0, w: root.clientWidth, h: H }, y = H - r.y - r.h;
        renderer.setViewport(r.x, y, r.w, r.h); renderer.setScissor(r.x, y, r.w, r.h);
        renderer.render(scene, p.cam);
      });
      renderer.setScissorTest(false);
    } else {
      menuCam.layers.set(0); menuCam.layers.enable(10); menuCam.layers.enable(11);
      sky.beforeView(menuCam, 0, dt);
      scenery.beforeView(menuCam.position);
      const w = root.clientWidth;
      renderer.setViewport(0, 0, w, H);
      renderer.render(scene, menuCam);
    }
  }
  raf = requestAnimationFrame(frame);

  // ---------------------------------------------------------------- screens
  let hangarPlane = null;
  function showHangarPlane(type, colorIdx) {
    if (hangarPlane) { scene.remove(hangarPlane.group); hangarPlane = null; }
    if (!scene) return;
    hangarPlane = buildPlane(type, LIVERIES[colorIdx % LIVERIES.length]);
    hangarPlane.type = type;
    const ap = AIRPORTS[0], [x, z] = runwayPoint(ap, -480, 190);
    hangarPlane.group.position.set(x, ap.elev + PLANES[type].gearH, z);
    hangarPlane.group.rotation.y = -ap.hdg + Math.PI + 0.6;
    scene.add(hangarPlane.group);
  }
  function hideHangarPlane() { if (hangarPlane) { scene.remove(hangarPlane.group); hangarPlane = null; } }

  function render() {
    ui.innerHTML = '';
    if (S.phase === 'loading') return;
    if (S.phase !== 'hangar') hideHangarPlane();
    if (S.phase === 'menu') menuUI();
    if (S.phase === 'hangar') hangarUI();
    if (S.phase === 'fly' && S.paused) pauseUI();
    if (S.phase === 'fly' && net.room) {
      const b = el(`<div class="sp-roombadge sp-strip">${stripHtml()}</div>`);
      ui.appendChild(b);
    }
  }

  // Settings: one row per switch, a segmented Off/On control on the right.
  const SETTINGS = {
    easy: ['Flying', '🧑‍✈️ Real', '🐣 Easy'],
    noDie: ['Crashes', '💥 On', '🛡️ Off'],
    shared: ['Friends', '🏝️ Just me', '👫 Fly with friends'],
    guide: ['Landing hoops', 'Off', '🟢 On'],
    sound: ['Sound', '🔇 Off', '🔊 On'],
  };
  const settingsHTML = keys => `<div class="sp-settings">${keys.map(k => {
    const [label, off, on] = SETTINGS[k];
    return `<div class="sp-set"><span>${label}</span><div class="ui-seg" data-k="${k}"><button data-v="0" class="${prefs[k] ? '' : 'on'}">${off}</button><button data-v="1" class="${prefs[k] ? 'on' : ''}">${on}</button></div></div>`;
  }).join('')}</div>`;
  function wireSettings(box, after) {
    box.querySelectorAll('.sp-settings .ui-seg button').forEach(b => click(b, () => {
      const k = b.parentNode.dataset.k, v = b.dataset.v === '1';
      if (prefs[k] === v) return;
      sound.pop(); prefs[k] = v; savePrefs(); after ? after(k) : render();
    }));
  }

  function menuUI() {
    const box = el(`<div class="ui-overlay sp-menuov"><div class="ui-panel sp-menu">
      <div class="ui-kicker">Sky Pilot</div>
      <h1 class="ui-title">Ready for take-off</h1>
      <p class="ui-sub">Fly anywhere on the island</p>
      <div class="ui-row sp-play">
        <button class="ui-btn primary big sp-go" data-m="solo">${icon('play')}<span>Fly</span></button>
        <button class="ui-btn big sp-go" data-m="missions">🎯<span>Missions</span></button>
        ${togetherButton()}
      </div>
      ${S.busy ? '<p class="ui-sub">Joining… ⏳</p>' : ''}${S.sad > clock ? '<p class="ui-sub">Couldn\'t join that game 😢</p>' : ''}${S.gone > clock ? '<p class="ui-sub">That game has finished 👋</p>' : ''}
      <div class="ui-label">Settings</div>
      ${settingsHTML(['easy', 'noDie', 'shared', 'sound'])}
      <div class="ui-row sp-foot"><button class="ui-btn ghost small sp-help-btn">${icon('keyboard')}<span>Controls</span></button></div>
    </div></div>`);
    wireSettings(box);
    box.querySelectorAll('.sp-go').forEach(b => click(b, () => {
      sound.pop();
      S.mode = 'solo';
      S.openMis = b.dataset.m === 'missions';
      if (TOUCH && prefs.tilt) askTilt();
      S.phase = 'hangar'; S.who = 0; render();
    }));
    click(box.querySelector('[data-together]'), () => { if (S.busy) return; sound.pop(); S.mode = 'solo'; hostRoom(); });
    click(box.querySelector('.sp-help-btn'), () => { S.help = true; helpUI(); });
    ui.appendChild(box);
  }

  function helpUI() {
    const box = el(`<div class="ui-overlay sp-helpov"><div class="ui-panel wide sp-help">
      <div class="ui-kicker">Sky Pilot</div>
      <h2 class="ui-title">Controls</h2>
      <table>
        <tr><td>⬆️⬇️ Nose up / down</td><td>W S &nbsp;or&nbsp; ↑ ↓</td></tr>
        <tr><td>⬅️➡️ Roll</td><td>A D &nbsp;or&nbsp; ← →</td></tr>
        <tr><td>↪️ Rudder</td><td>Q E</td></tr>
        <tr><td>⚡ Power</td><td>R F &nbsp;or&nbsp; Shift Ctrl</td></tr>
        <tr><td>⚙️ Wheels</td><td>G</td></tr>
        <tr><td>💧 Drop water (Fire Fight)</td><td>B</td></tr>
        <tr><td>🪶 Flaps</td><td>V &nbsp;( [ ] )</td></tr>
        <tr><td>🛑 Brakes</td><td>Space</td></tr>
        <tr><td>🎥 Camera</td><td>C</td></tr>
        <tr><td>💨 Smoke</td><td>X</td></tr>
      </table>
      <div class="sp-tips">
        <p>🌍 Tap the 🌍 button (or T) to jump in right behind another pilot and fly together.</p>
        <p>⏸ Esc · 🗺️ M · 🔁 Backspace · 🎮 Gamepads work · 🖱️ Drag to look, wheel to zoom</p>
        <p>🚁 Helicopter: power = lift, stick = tilt and fly that way.</p>
        <p>🛬 Landing: slow down, wheels down, flaps down, follow the green hoops. PAPI lights: 2 red + 2 white = just right.</p>
      </div>
      <div class="ui-row"><button class="ui-btn go sp-ok" aria-label="OK">${icon('check')}<span>Got it</span></button></div>
    </div></div>`);
    click(box.querySelector('.sp-ok'), () => { S.help = false; box.remove(); });
    ui.appendChild(box);
  }

  function hangarUI() {
    const who = 0;
    const pl = prefs.pl[who];
    showHangarPlane(pl.type, pl.color);
    const starts = startsFor(pl.type);
    if (!starts.find(s => s.id === prefs.start)) prefs.start = starts[0].id;
    const box = el(`<div class="ui-overlay sp-hangar"><div class="ui-panel wide left sp-hcard">
      <div class="sp-hhead"><div><div class="ui-kicker">Sky Pilot · Hangar</div><h2 class="ui-title">Choose your plane</h2></div>
        ${net.room ? `<div class="sp-strip sp-hstrip">${stripHtml()}</div>` : ''}</div>
      <div class="ui-choices tight sp-planes">${PLANE_ORDER.map(t => `<button class="ui-choice sp-pcard ${pl.type === t ? 'on' : ''}" data-t="${t}"><span class="i">${PLANES[t].icon}</span>${PLANES[t].name}<small>${'★'.repeat(PLANES[t].stars)}${'☆'.repeat(Math.max(0, 3 - PLANES[t].stars))}</small></button>`).join('')}</div>
      <div class="sp-hrow">
        <div class="sp-hcol"><div class="ui-label">Colour</div>
          <div class="sp-colors">${LIVERIES.map((c, i) => `<button class="sp-col ${pl.color === i ? 'on' : ''}" data-c="${i}" aria-label="Colour ${i + 1}" style="background:#${new THREE.Color(c).getHexString()}"></button>`).join('')}</div></div>
        <div class="sp-hcol"><div class="ui-label">Start at</div>
          <div class="sp-starts">${starts.map(s => `<button class="ui-choice sp-start ${prefs.start === s.id ? 'on' : ''}" data-s="${s.id}" title="${s.name}"><span class="i">${s.icon}</span><small>${s.name}</small></button>`).join('')}</div></div>
      </div>
      <div class="ui-row sp-foot">
        <button class="ui-btn ghost sp-back" aria-label="Back">${icon('back')}<span>Back</span></button>
        <button class="ui-btn primary big sp-fly" aria-label="Fly">${icon('play')}<span>Fly</span></button>
      </div>
    </div></div>`);
    box.querySelectorAll('.sp-pcard').forEach(b => click(b, () => { sound.pop(); pl.type = b.dataset.t; savePrefs(); render(); }));
    box.querySelectorAll('.sp-col').forEach(b => click(b, () => { sound.pop(); pl.color = +b.dataset.c; savePrefs(); render(); }));
    box.querySelectorAll('.sp-start').forEach(b => click(b, () => { sound.pop(); prefs.start = b.dataset.s; savePrefs(); render(); }));
    click(box.querySelector('.sp-back'), () => { sound.pop(); if (net.room) leaveRoom(); S.phase = 'menu'; render(); });
    click(box.querySelector('.sp-fly'), () => { sound.pop(); hideHangarPlane(); startFlying(); });
    ui.appendChild(box);
  }

  function pause(on) {
    if (S.phase !== 'fly') return;
    S.paused = on; sound.pop();
    render();
  }
  function pauseUI() {
    const box = el(`<div class="ui-overlay"><div class="ui-panel sp-pausecard">
      <div class="ui-kicker">Sky Pilot</div>
      <h2 class="ui-title">Paused</h2>
      <div class="ui-row sp-pbtns">
        <button class="ui-btn primary big sp-resume" aria-label="Keep flying">${icon('play')}<span>Resume</span></button>
        <button class="ui-btn sp-respawn" aria-label="Start again">${icon('retry')}<span>Start again</span></button>
        <button class="ui-btn sp-plane">🛩️<span>Change plane</span></button>
        <button class="ui-btn sp-pmis">🎯<span>Missions</span></button>
      </div>
      <div class="ui-label">Settings</div>
      ${settingsHTML(['easy', 'noDie', 'shared', 'guide', 'sound'])}
      <div class="ui-row sp-foot">
        <div class="ui-row">
          <button class="ui-btn ghost sp-quit" aria-label="Quit">${icon('home')}<span>Quit</span></button>
          ${net.room ? `<button class="ui-btn ghost sp-leave" aria-label="Leave">${icon('leave')}<span>Leave friends</span></button>` : ''}
        </div>
        <button class="ui-btn ghost small sp-helpb" aria-label="Keys">${icon('keyboard')}<span>Controls</span></button>
      </div>
    </div></div>`);
    wireSettings(box, k => {
      if (k === 'shared') { if (prefs.shared) goPublic(); else leavePublic(); }
      if (k === 'sound') players.forEach(p => { if (p.engine) p.engine.stop(); p.engine = makeEngine(p.type, players.length); });
      render();
    });
    click(box.querySelector('.sp-resume'), () => pause(false));
    click(box.querySelector('.sp-pmis'), () => { pause(false); if (missions) missions.openPicker(); });
    click(box.querySelector('.sp-respawn'), () => { players.forEach(respawn); pause(false); });
    click(box.querySelector('.sp-plane'), () => { stopFlying(); S.phase = 'hangar'; render(); });
    click(box.querySelector('.sp-helpb'), () => helpUI());
    click(box.querySelector('.sp-leave'), () => { leaveRoom(); render(); });
    click(box.querySelector('.sp-quit'), () => { stopFlying(); if (net.room) leaveRoom(); S.phase = 'menu'; render(); });
    ui.appendChild(box);
  }
  function stopFlying() {
    if (missions) missions.setFlying(false);
    removePlayers(); leavePublic(); clearRemotes(); S.paused = false; keepAwake(false);
    for (const set of world.fx.ringSets) set.forEach(r => { r.visible = false; });
    rainSound(0);
  }

  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && !wakeLock && navigator.wakeLock && document.visibilityState === 'visible') { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
      else if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) { /* not supported */ }
  }
  const music = { el: null, vol: 0 };
  function musicTick(dt) {
    const want = S.phase === 'fly' && !S.paused && prefs.sound && document.visibilityState === 'visible' && !!players[0] && players[0].s.P.kind === 'paper';
    if (want && !music.el) {
      try { music.el = new Audio(new URL('./music/calm.mp3', import.meta.url).href); music.el.loop = true; music.el.volume = 0; music.el.preload = 'auto'; } catch (e) { return; }
    }
    if (!music.el) return;
    music.vol += ((want ? 0.42 : 0) - music.vol) * Math.min(1, dt * (want ? 0.6 : 2));
    music.el.volume = clamp(music.vol, 0, 1);
    if (want && music.el.paused) music.el.play().catch(() => {});
    if (!want && music.vol < 0.01 && !music.el.paused) music.el.pause();
  }
  // phones only start sound after a tap
  const musicKick = () => { if (music.el && music.el.paused && music.vol > 0) music.el.play().catch(() => {}); };
  addEventListener('pointerdown', musicKick); addEventListener('keydown', musicKick);
  const onVisible = () => { if (S.phase === 'fly' && document.visibilityState === 'visible') keepAwake(true); if (music.el && document.visibilityState !== 'visible') music.el.pause(); };
  document.addEventListener('visibilitychange', onVisible);

  if (PARAMS.has('spdebug')) window.__sp = () => ({ S, tilt, missions, music, hostTest: async () => { const r = await createRoom(GAME, { state: 'fly' }); r.setMeta({ hostUid: r.uid }); goRoom(r, true); return r.code; }, joinTest: c => tryJoin(c), players, world, net, remotes, prefs, scene, renderer, startFlying, setMode: m => { S.mode = m; } });

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    try { if (world) stopFlying(); } catch (e) { /* */ }
    try { if (missions) missions.dispose(); } catch (e) { /* */ }
    if (net.room) leaveRoom();
    removeEventListener('keydown', onKeyDown);
    removeEventListener('pointerdown', musicKick); removeEventListener('keydown', musicKick);
    if (music.el) { music.el.pause(); music.el.src = ''; }
    removeEventListener('keyup', onKeyUp);
    removeEventListener('blur', onBlur);
    removeEventListener('deviceorientation', onOrient);
    removeEventListener('resize', onResize);
    if (ro) ro.disconnect();
    document.removeEventListener('visibilitychange', onVisible);
    keepAwake(false);
    if (rainSnd) { try { rainSnd.n.stop(); } catch (e) { /* */ } }
    if (world) world.sky.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    css.remove();
  };
}
