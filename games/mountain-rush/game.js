// Mountain Rush: 3D downhill mountain biking.
//
// Three maps (forest, desert, snow), each with two routes that split, cross and tangle.
// Air tricks (flips, 360s, tailwhip, barspin, superman, no hander, table top, can-can,
// no footer) chain into combos, manuals, pumping, crashes, instant reset to checkpoints.
// Keys follow Descenders where it makes sense.
//
// Files: biomes.js (maps + looks), world.js (mountain + route maths), physics.js (bike, tricks, crashes),
// scene.js (sky, ground, trees, grass, gates, dust), bike.js (bike + rider model),
// textures.js (textures painted in code).
import * as THREE from '../../js/vendor/three.module.min.js';
import { audioCtx } from '../../js/engine/sound.js';
import { buildWorld, MAPS } from './world.js';
import { MAP_ORDER } from './biomes.js';
import { newRider, placeAt, stepRider, bikeFrame, COM, TRICKS } from './physics.js';
import { createScene, SUN_DIR } from './scene.js';
import { createBike, COLORS, BIKES, BIKE_ORDER, OUTFIT, GOLD, GOLD_HEX } from './bike.js';
import { makeTextures } from './textures.js';
import { createOnline } from './online.js';
import { togetherButton, takeJoinCode } from '../../js/engine/together.js';
import { clamp, lerp } from '../sky-pilot/noise.js';

const PREFS_KEY = 'mountain-rush-v1';
const COMBO_GAP = 2.5;      // seconds on the ground before a combo is banked
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const STEP = 1 / 120;
const PARAMS = new URLSearchParams(location.search);

const QUALITY = {
  low: { name: 'low', dpr: 1, shadows: 0, shadowBox: 40, trees: 0.55, plants: 0.3, grass: 0, grassPatch: 0, particles: 300, fog: 0.0118, viewDist: 170 },
  mid: { name: 'mid', dpr: 1.25, shadows: 2048, shadowBox: 42, trees: 0.8, plants: 0.6, grass: 0.7, grassPatch: 40, particles: 500, fog: 0.0099, viewDist: 205 },
  high: { name: 'high', dpr: 2, shadows: 4096, shadowBox: 48, trees: 1, plants: 1, grass: 0.5, grassPatch: 48, particles: 800, fog: 0.0086, viewDist: 232 },
};

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);
  stage.innerHTML = `<div class="mr${TOUCH ? ' mr-touch' : ''}"><canvas class="mr-canvas"></canvas><div class="mr-hud"></div><div class="mr-ui"></div></div>`;
  const root = stage.querySelector('.mr'), canvas = root.querySelector('canvas');
  const hudEl = root.querySelector('.mr-hud'), ui = root.querySelector('.mr-ui');
  const click = (node, fn) => node && node.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); fn(e); });

  // ---------------------------------------------------------------- prefs
  const prefs = (() => {
    const d = { quality: PARAMS.get('mrq') || (Math.min(screen.width, screen.height) < 520 ? 'low' : TOUCH ? 'mid' : 'high'), cam: 'chase', sound: true, best: {}, look: { frame: 0, jersey: 0, helmet: 0, pants: 0, goggle: 0, open: 0 }, map: 'pine-ridge', bike: 'trek', points: 0, online: true, noCrash: false };
    try { const p = { ...d, ...(JSON.parse(localStorage.getItem(PREFS_KEY)) || {}) }; p.look = { ...d.look, ...p.look }; return p; } catch (e) { return d; }
  })();
  const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ } };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    ui.innerHTML = '<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h2 class="ui-title">No 3D here</h2><p class="ui-sub">This game needs WebGL. Try Chrome, Safari or Edge.</p></div></div>';
    return () => css.remove();
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------------------------------------------------------- state
  const S = { phase: 'loading', paused: false, map: MAPS[prefs.map] ? prefs.map : 'pine-ridge', time: 0, timing: false, score: 0, cp: 0, gate: null, finished: false, crashT: 0, msgT: 0, combo: null, hideUI: false, route: 0, hoopsDone: new Set() };
  let alive = true, raf = 0, W = null, scene = null, bike = null, rider = null, Q = QUALITY[prefs.quality] || QUALITY.high;
  const camera = new THREE.PerspectiveCamera(70, 1, 0.08, 600);
  let inviteCode = takeJoinCode('mountain-rush');
  let lastPose = null;
  const q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const r2 = v => Math.round(v * 100) / 100;
  const online = createOnline({
    scene: () => scene.scene,
    world: () => W,
    makeBike: (type, look) => createBike(T, envTex, look, type),
    wantPublic: () => prefs.online,
    me: () => {
      bike.root.matrix.decompose(p3, q4, s3);
      const P = lastPose || {};
      return {
        p: [r2(p3.x), r2(p3.y), r2(p3.z)], q: [q4.x, q4.y, q4.z, q4.w].map(v => Math.round(v * 1000) / 1000), v: [r2(rider.vel.x), r2(rider.vel.y), r2(rider.vel.z)],
        ps: [P.steer, P.crouch, P.superman, P.nohand, P.table, P.cancan, P.nofoot, P.whip, P.bar, P.manual, P.crank].map(v => r2(v || 0)),
        bk: bikeType(), lk: [pickColor('frame'), pickColor('jersey'), pickColor('helmet'), pickColor('pants'), pickColor('goggle'), prefs.look.open ? 1 : 0],
        cr: rider.crashed ? 1 : 0, hey: S.hey || 0,
      };
    },
    onPlayers: () => { refreshRoomBits(); },
    onMeta: m => {
      if (m.map && m.map !== S.map && !online.isHost() && MAPS[m.map]) { S.map = m.map; build(); return; }
      if (m.race && m.race.id !== S.raceSeen) { S.raceSeen = m.race.id; if (online.now() < m.race.t + 3000) startRaceCountdown(m.race); }
      refreshRoomBits();
    },
    onLeft: gone => { if (gone) showMsgSafe('Your friend has left'); if (S.phase === 'menu') menu(); },
    onJoin: name => showMsgSafe(`👋 ${name || 'A rider'} is here`),
    onHey: name => { showMsgSafe(`👋 ${name || 'Rider'} says hey!`); snd('hey'); },
  });
  const cam = { pos: new THREE.Vector3(), look: new THREE.Vector3(), yaw: 0, fov: 70, shake: 0 };

  // ---------------------------------------------------------------- loading
  function loadingUI(txt, f) {
    ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h1 class="ui-title">${txt}</h1><div class="mr-load"><i style="width:${Math.round(f * 100)}%"></i></div></div></div>`;
  }
  const tick = () => new Promise(r => setTimeout(r, 16));
  let T = null, envTex = null, tBiome = '';

  async function build() {
    S.phase = 'loading';
    online.clear();
    loadingUI('Shaping the mountain', 0.05); await tick();
    if (!alive) return;
    W = buildWorld(S.map);
    loadingUI('Painting the ground', 0.3); await tick();
    if (!T || tBiome !== W.biome) { if (T) Object.values(T).forEach(t => t.dispose && t.dispose()); T = makeTextures(TOUCH ? 512 : 1024, W.B); tBiome = W.biome; envTex = null; }
    loadingUI('Growing the forest', 0.5); await tick();
    if (scene) disposeScene(scene.scene);
    renderer.shadowMap.enabled = Q.shadows > 0;
    scene = createScene(W, T, Q);
    if (!envTex) envTex = makeEnv();
    if (bike) bike.dispose && bike.dispose();
    loadingUI('Pumping up the tyres', 0.85); await tick();
    bike = createBike(T, envTex, lookColors(), bikeType());
    bike.root.matrixAutoUpdate = false; bike.rider.matrixAutoUpdate = false;
    scene.scene.add(bike.root); scene.scene.add(bike.rider);
    rider = newRider(W);
    rider.P = { ...BIKES[bikeType()].stats };
    rider.noCrash = !!prefs.noCrash;
    resize();
    camera.far = Q.viewDist + 140; camera.updateProjectionMatrix();
    snapCamera();
    placeBike(0);
    renderer.compile(scene.scene, camera);
    if (!alive) return;
    S.phase = 'menu';
    menu();
    const code = inviteCode; inviteCode = null;
    if (code) online.joinCode(code).then(r => { if (!r) showMenuNote('That ride has finished'); else menu(); }).catch(() => showMenuNote('Could not join'));
  }

  function makeEnv() {
    // soft sky reflections for the shiny bits (frame, helmet, goggles)
    const pm = new THREE.PMREMGenerator(renderer);
    const es = new THREE.Scene();
    const sky = scene.scene.children.find(o => o.isMesh && o.material && o.material.type === 'ShaderMaterial');
    if (sky) es.add(sky.clone());
    const ground = new THREE.Mesh(new THREE.CircleGeometry(400, 24), new THREE.MeshBasicMaterial({ color: W.B.snow ? 0xc8d0d8 : W.B.terrace ? 0x8a5a3a : 0x3c4a32 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -20; es.add(ground);
    const tex = pm.fromScene(es, 0.03, 1, 1000).texture;
    pm.dispose();
    return tex;
  }

  function disposeScene(sc) {
    sc.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
    });
  }

  // outfit: each choice is an index into its list; one past the end = gold (unlocked at GOLD points)
  const LISTS = { frame: COLORS.frame, jersey: COLORS.jersey, helmet: OUTFIT.helmet, pants: OUTFIT.pants, goggle: OUTFIT.goggle };
  const pickColor = k => { const L = LISTS[k], i = prefs.look[k] | 0; return i >= L.length ? (prefs.points >= GOLD ? GOLD_HEX : L[0]) : L[i]; };
  const lookColors = () => ({ frame: pickColor('frame'), jersey: pickColor('jersey'), helmet: pickColor('helmet'), pants: pickColor('pants'), goggle: pickColor('goggle'), open: prefs.look.open ? 1 : 0 });
  const bikeType = () => (BIKES[prefs.bike] && prefs.points >= BIKES[prefs.bike].unlock ? prefs.bike : 'trek');
  function swapBike() {
    const old = bike;
    bike = createBike(T, envTex, lookColors(), bikeType());
    bike.root.matrixAutoUpdate = false; bike.rider.matrixAutoUpdate = false;
    scene.scene.add(bike.root); scene.scene.add(bike.rider);
    if (old) { scene.scene.remove(old.root); scene.scene.remove(old.rider); disposeScene(old.root); disposeScene(old.rider); }
    rider.P = { ...BIKES[bikeType()].stats };
    placeBike(0);
  }

  // ---------------------------------------------------------------- input
  const keys = new Set();
  const onKey = e => {
    if (e.type === 'keydown') {
      if (S.phase === 'ride' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Backspace'].includes(e.code)) e.preventDefault();
      if (!keys.has(e.code)) pressed(e.code);
      keys.add(e.code);
    } else { keys.delete(e.code); released(e.code); }
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  const onBlur = () => keys.clear();
  window.addEventListener('blur', onBlur);
  // Keys (like Descenders): Z pedal, ←/→ steer, ↑/↓ lean (flip in the air; ↓ brakes on the ground),
  // X bunny hop, S crouch / pump, D stretch / counterpump, Space tweak (in the air),
  // C + arrows trick modifier (tap C = camera), A "Hey!", R respawn, Backspace start,
  // T set respawn point, V reset camera, U hide the HUD. J K L I still do tricks too.
  let cUsed = false;
  function pressed(code) {
    if (code === 'KeyC') cUsed = false;
    if (S.phase !== 'ride') return;
    if (code === 'KeyR' || code === 'Enter') resetToCheckpoint();
    else if (code === 'Backspace') restartRun();
    else if (code === 'KeyT') setRespawn();
    else if (code === 'KeyV') snapCamera();
    else if (code === 'KeyU') toggleUI();
    else if (code === 'KeyA') sayHey();
    else if (code === 'Escape' || code === 'KeyP') togglePause();
  }
  function released(code) {
    if (code === 'KeyC' && !cUsed && S.phase === 'ride') toggleCam();
  }
  const touchState = { x: 0, y: 0, pedal: false, jump: false, whip: false, bar: false, sup: false, noh: false, man: false, tweak: false };
  let padPrev = {};
  const airLatch = { armed: false };
  function readInput() {
    const k = c => keys.has(c);
    const L = k('ArrowLeft'), R = k('ArrowRight'), U = k('ArrowUp'), D = k('ArrowDown');
    const air = rider && !rider.ground;
    const mod = k('KeyC'), tweak = k('Space');
    if (mod && (L || R || U || D)) cUsed = true;
    const inp = {
      steer: (R ? 1 : 0) - (L ? 1 : 0),
      throttle: air ? (U ? 1 : 0) - (D ? 1 : 0) : (k('KeyZ') || U ? 1 : 0) - (D ? 1 : 0),
      jump: k('KeyX'), pump: k('KeyS'), stretch: k('KeyD'),
      whip: k('KeyJ'), barspin: k('KeyI'), superman: k('KeyK'), nohand: k('KeyL'),
      manual: k('KeyQ') || k('ShiftLeft') || k('ShiftRight'),
    };
    // trick modifier: C + arrows
    if (mod) {
      inp.flipLock = inp.spinLock = true;
      if (air) { inp.whip ||= L; inp.barspin ||= R; inp.superman ||= U; inp.nohand ||= D; }
      else if (D) { inp.manual = true; inp.throttle = 0; }
      if (air) { inp.steer = 0; inp.throttle = 0; }
    }
    // tweak: Space (with ← can-can, → no footer)
    if (tweak && air) { inp.spinLock = true; if (L) inp.cancan = true; else if (R) inp.nofoot = true; else inp.table = true; inp.steer = 0; }
    // touch
    if (TOUCH) {
      // touch: stick steers and leans (down brakes on the ground); the pedal button pedals
      if (Math.abs(touchState.x) > 0.05) inp.steer = touchState.x;
      if (air) { if (Math.abs(touchState.y) > 0.25) inp.throttle = touchState.y; }
      else if (touchState.pedal) inp.throttle = 1;
      else if (touchState.y < -0.35) inp.throttle = touchState.y;
      inp.jump = inp.jump || touchState.jump; inp.whip = inp.whip || touchState.whip; inp.barspin = inp.barspin || touchState.bar;
      inp.superman = inp.superman || touchState.sup; inp.nohand = inp.nohand || touchState.noh; inp.manual = inp.manual || touchState.man;
      if (touchState.tweak && air) { inp.spinLock = true; if (touchState.x < -0.4) inp.cancan = true; else if (touchState.x > 0.4) inp.nofoot = true; else inp.table = true; inp.steer = 0; }
    }
    // gamepad
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp) continue;
      const ax = gp.axes, bt = i => gp.buttons[i] && gp.buttons[i].pressed, val = i => gp.buttons[i] ? gp.buttons[i].value : 0;
      const dz = v => Math.abs(v) < 0.15 ? 0 : v;
      const lx = dz(ax[0] || 0), ly = dz(ax[1] || 0);
      if (lx) inp.steer = lx;
      const trig = val(7) - val(6);
      if (air) { if (ly) inp.throttle = -ly; if (val(6) > 0.5) { inp.spinLock = true; if (lx < -0.4) inp.cancan = true; else if (lx > 0.4) inp.nofoot = true; else inp.table = true; inp.steer = 0; } }
      else if (Math.abs(trig) > 0.05) inp.throttle = trig; else if (ly) inp.throttle = -ly;
      inp.jump = inp.jump || bt(0); inp.whip = inp.whip || bt(2); inp.superman = inp.superman || bt(3); inp.nohand = inp.nohand || bt(1);
      inp.barspin = inp.barspin || bt(5); inp.manual = inp.manual || bt(4);
      const edge = i => bt(i) && !padPrev[gp.index + ':' + i];
      if (edge(8)) resetToCheckpoint();
      if (edge(9)) togglePause();
      if (edge(3) && S.phase === 'menu') startRide();
      if (edge(10) || edge(11)) toggleCam();
      for (let i = 0; i < gp.buttons.length; i++) padPrev[gp.index + ':' + i] = bt(i);
    }
    // whatever you were holding when you left the ground (pedalling, leaning) doesn't flip you:
    // flips only start once you've let go and pressed again
    if (air) {
      if (!airLatch.armed) { if (Math.abs(inp.throttle) < 0.2) airLatch.armed = true; else inp.throttle = 0; }
    } else airLatch.armed = false;
    inp.steer = clamp(inp.steer, -1, 1); inp.throttle = clamp(inp.throttle, -1, 1);
    return inp;
  }

  // ---------------------------------------------------------------- HUD
  function buildHUD() {
    hudEl.innerHTML = `
      <div class="mr-top"><div class="mr-pill mr-time">0:00.0</div><div class="mr-pill mr-cp">CP 0/${W.checkpoints.length - 1}</div></div>
      <div class="mr-prog"><i></i>${W.checkpoints.slice(1).map(c => `<em style="left:${(c.z - W.startZ) / (W.finishZ - W.startZ) * 100}%"></em>`).join('')}</div>
      <div class="mr-score"><span>Tricks</span><b>0</b><div class="mr-combo"></div></div>
      <div class="mr-route"></div>
      <div class="mr-online"></div>
      <div class="mr-speed"><b>0</b><small>km/h</small></div>
      <div class="mr-trick"><div class="t"></div><div class="p"></div></div>
      <div class="mr-airname"></div>
      <div class="mr-msg"></div>`;
    const tr = document.createElement('div');
    tr.className = 'mr-tr';
    tr.innerHTML = `<button class="mr-b mr-camb" aria-label="Camera">🎥</button><button class="mr-b mr-pause" aria-label="Pause">⏸</button>`;
    ui.innerHTML = ''; ui.appendChild(tr);
    click(tr.querySelector('.mr-camb'), toggleCam);
    click(tr.querySelector('.mr-pause'), togglePause);
    if (TOUCH) buildTouch();
  }
  const H = {};
  function hudRefs() {
    for (const [k, sel] of Object.entries({ time: '.mr-time', cp: '.mr-cp', onl: '.mr-online', combo: '.mr-combo', route: '.mr-route', prog: '.mr-prog i', score: '.mr-score b', speed: '.mr-speed b', trick: '.mr-trick', trickT: '.mr-trick .t', trickP: '.mr-trick .p', air: '.mr-airname', msg: '.mr-msg' })) H[k] = hudEl.querySelector(sel);
  }
  const fmt = t => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s < 10 ? '0' : ''}${s.toFixed(1)}`; };
  let trickHide = 0, msgHide = 0;
  function showTrick(list, pts, extra) {
    H.trickT.textContent = list.join(' + ');
    H.trickP.innerHTML = `+${pts.toLocaleString()}${extra ? ` <span class="x">${extra}</span>` : ''}`;
    H.trick.classList.add('show'); trickHide = 2.2;
  }
  function showMsg(t, dur = 1.6) { H.msg.textContent = t; H.msg.classList.add('show'); msgHide = dur; }

  function buildTouch() {
    const pad = document.createElement('div'); pad.className = 'mr-pad'; pad.innerHTML = '<i></i>';
    const knob = pad.querySelector('i');
    let pid = null;
    const setPad = e => {
      const r = pad.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
      let dx = (e.clientX - cx) / R, dy = (e.clientY - cy) / R; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
      touchState.x = dx; touchState.y = -dy;
      knob.style.transform = `translate(${dx * R * 0.6}px, ${dy * R * 0.6}px)`;
    };
    pad.addEventListener('pointerdown', e => { pid = e.pointerId; pad.setPointerCapture(pid); setPad(e); e.preventDefault(); });
    pad.addEventListener('pointermove', e => { if (e.pointerId === pid) setPad(e); });
    const end = e => { if (e.pointerId !== pid) return; pid = null; touchState.x = touchState.y = 0; knob.style.transform = ''; };
    pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
    ui.appendChild(pad);
    const box = document.createElement('div'); box.className = 'mr-tbtns';
    const btns = [['whip', 'Tail<br>whip'], ['bar', 'Bar<br>spin'], ['sup', 'Super<br>man'], ['reset', '↺<br>Reset'], ['noh', 'No<br>hands'], ['man', 'Man<br>ual'], ['tweak', 'Tweak'], ['jump', 'JUMP'], ['pedal', 'PEDAL']];
    box.innerHTML = btns.map(([k, l]) => `<button class="mr-tb ${k}" data-k="${k}">${l}</button>`).join('');
    box.querySelectorAll('.mr-tb').forEach(b => {
      const k = b.dataset.k;
      b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); if (k === 'reset') { resetToCheckpoint(); return; } touchState[k] = true; b.classList.add('on'); });
      const up = () => { if (k !== 'reset') { touchState[k] = false; b.classList.remove('on'); } };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
    });
    ui.appendChild(box);
  }

  // ---------------------------------------------------------------- menus
  function menu() {
    S.phase = 'menu';
    hudEl.innerHTML = '';
    ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel wide">
      <div class="ui-kicker">Downhill</div><h1 class="ui-title">Mountain Rush</h1>
      <div class="mr-maps">${MAP_ORDER.map(id => {
        const pic = { 'pine-ridge': ['#9fc3d4', '#3f6b45', '#2c4a30', '#7a5634'], 'red-rock': ['#f2c48d', '#b5532c', '#8a3b1d', '#e0a070'], 'snow-peak': ['#cfe0ee', '#f5f8fb', '#9fb3c2', '#6d7f8c'] }[id];
        const bt = prefs.best[id];
        return `<button class="mr-map${id === S.map ? ' on' : ''}" data-map="${id}">${mapPic(...pic)}<div class="nm">${MAPS[id].name}<small>${bt ? 'Best ' + fmt(bt.time) : MAPS[id].sub}</small></div></button>`;
      }).join('')}</div>
      <div class="mr-best">${MAPS[S.map].routes.map(r => r.name).join(' and ')}: two routes that cross. Swap lines whenever you like.</div>
      <div class="ui-row"><button class="ui-btn mr-garageb">🚲 Garage: ${BIKES[bikeType()].name}</button><span class="mr-pts">⭐ ${Math.round(prefs.points).toLocaleString()} trick points</span></div>
      <div class="ui-label">Graphics</div>
      <div class="ui-seg mr-q">${['low', 'mid', 'high'].map(q => `<button data-q="${q}" class="${Q.name === q ? 'on' : ''}">${q === 'low' ? 'Fast' : q === 'mid' ? 'Good' : 'Best'}</button>`).join('')}</div>
      <div class="ui-row"><button class="ui-btn go big mr-go">Ride!</button></div>
      ${online.net.room ? `<div class="ui-label">Riding with friends</div><div class="mr-roomstrip">${online.stripHTML()}</div>
        <div class="ui-row">${online.isHost() ? '<button class="ui-btn primary mr-race">🏁 Race!</button>' : '<span class="mr-best">Your friend can start a race</span>'}<button class="ui-btn ghost mr-leave">Leave friends</button></div>`
        : `<div class="ui-row">${togetherButton('Ride with friends')}</div>`}
      <div class="ui-seg mr-onl"><button data-o="1" class="${prefs.online ? 'on' : ''}">🌍 See everyone online</button><button data-o="0" class="${prefs.online ? '' : 'on'}">Just me</button></div>
      <div class="ui-seg mr-nc"><button data-n="0" class="${prefs.noCrash ? '' : 'on'}">💥 Crashes on</button><button data-n="1" class="${prefs.noCrash ? 'on' : ''}">🛟 No crashes (easy)</button></div>
      <div class="mr-note mr-best"></div>
      <div class="ui-label">Fastest on ${MAPS[S.map].name}</div><div class="mr-lb mr-best">Loading…</div>
      ${controlsHTML()}
    </div></div>`;
    click(ui.querySelector('.mr-go'), startRide);
    ui.querySelectorAll('.mr-map').forEach(b => click(b, () => {
      if (b.dataset.map === S.map) return;
      S.map = b.dataset.map; prefs.map = S.map; savePrefs();
      build();
    }));
    click(ui.querySelector('.mr-garageb'), garage);
    const lbMap = S.map;
    online.board(lbMap).then(list => {
      const el = ui.querySelector('.mr-lb'); if (!el || S.map !== lbMap) return;
      el.innerHTML = list.length ? `<div class="mr-boardlist">${list.slice(0, 5).map((p, i) => `<div class="${p.me ? 'me' : ''}"><span>${['🥇', '🥈', '🥉'][i] || i + 1 + '.'}</span><b>${p.face} ${p.name}</b><i>${fmt(p.time)}</i></div>`).join('')}</div>` : 'No times yet. Finish a run to be first!';
    });
    const tb = ui.querySelector('[data-together]');
    if (tb) click(tb, async () => { tb.disabled = true; try { const r = await online.hostRoom(S.map); if (r) menu(); else tb.disabled = false; } catch (e) { tb.disabled = false; showMenuNote('Could not go online'); } });
    click(ui.querySelector('.mr-race'), () => online.startRace());
    click(ui.querySelector('.mr-leave'), () => { online.leaveRoom(); menu(); });
    ui.querySelectorAll('.mr-nc button').forEach(b => click(b, () => { prefs.noCrash = b.dataset.n === '1'; savePrefs(); rider.noCrash = prefs.noCrash; ui.querySelectorAll('.mr-nc button').forEach(x => x.classList.toggle('on', x === b)); }));
    ui.querySelectorAll('.mr-onl button').forEach(b => click(b, () => { prefs.online = b.dataset.o === '1'; savePrefs(); ui.querySelectorAll('.mr-onl button').forEach(x => x.classList.toggle('on', x === b)); }));
    ui.querySelectorAll('.mr-q button').forEach(b => click(b, () => {
      if (b.dataset.q === Q.name) return;
      prefs.quality = b.dataset.q; savePrefs(); Q = QUALITY[b.dataset.q];
      build();
    }));
  }
  // the garage: pick a bike and an outfit; the bike turns round behind the panel
  function garage() {
    S.phase = 'garage';
    const gold = prefs.points >= GOLD;
    const sw = kind => {
      const L = LISTS[kind], cur = prefs.look[kind] | 0;
      return L.map((c, i) => `<button class="mr-sw${i === cur ? ' on' : ''}" data-kind="${kind}" data-i="${i}" style="background:#${c.toString(16).padStart(6, '0')}" aria-label="colour"></button>`).join('')
        + `<button class="mr-sw gold${cur >= L.length ? ' on' : ''}" data-kind="${kind}" data-i="${L.length}" ${gold ? '' : 'disabled'} aria-label="gold" title="${gold ? 'Gold' : 'Gold: ' + GOLD.toLocaleString() + ' points'}">${gold ? '' : '🔒'}</button>`;
    };
    ui.innerHTML = `<div class="ui-overlay mr-garage"><div class="ui-panel left">
      <div class="ui-kicker">Garage</div><h2 class="ui-title">Your bike</h2>
      <div class="mr-pts">⭐ ${Math.round(prefs.points).toLocaleString()} trick points. Earn more to unlock bikes and gold.</div>
      <div class="mr-bikes">${BIKE_ORDER.map(id => {
        const B2 = BIKES[id], locked = prefs.points < B2.unlock;
        return `<button class="mr-bike${id === bikeType() ? ' on' : ''}" data-bike="${id}" ${locked ? 'disabled' : ''}><b>${B2.name}</b><small>${locked ? '🔒 ' + B2.unlock.toLocaleString() + ' points' : B2.sub}</small></button>`;
      }).join('')}</div>
      <div class="ui-label">Frame</div><div class="mr-swatches">${sw('frame')}</div>
      <div class="ui-label">Jersey</div><div class="mr-swatches">${sw('jersey')}</div>
      <div class="ui-label">Trousers</div><div class="mr-swatches">${sw('pants')}</div>
      <div class="ui-label">Helmet</div><div class="mr-swatches">${sw('helmet')}</div>
      <div class="ui-seg mr-htype">${OUTFIT.helmetType.map((n, i) => `<button data-i="${i}" class="${(prefs.look.open | 0) === i ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="ui-label">Goggles</div><div class="mr-swatches">${sw('goggle')}</div>
      <div class="ui-row"><button class="ui-btn go mr-done">Done</button></div>
    </div></div>`;
    ui.querySelectorAll('.mr-sw').forEach(b => click(b, () => {
      prefs.look[b.dataset.kind] = +b.dataset.i; savePrefs();
      bike.setLook(lookColors());
      ui.querySelectorAll(`.mr-sw[data-kind="${b.dataset.kind}"]`).forEach(x => x.classList.toggle('on', x === b));
    }));
    ui.querySelectorAll('.mr-htype button').forEach(b => click(b, () => {
      prefs.look.open = +b.dataset.i; savePrefs(); bike.setLook(lookColors());
      ui.querySelectorAll('.mr-htype button').forEach(x => x.classList.toggle('on', x === b));
    }));
    ui.querySelectorAll('.mr-bike').forEach(b => click(b, () => {
      prefs.bike = b.dataset.bike; savePrefs(); swapBike();
      ui.querySelectorAll('.mr-bike').forEach(x => x.classList.toggle('on', x === b));
    }));
    click(ui.querySelector('.mr-done'), menu);
  }
  function addPoints(n) {
    const before = prefs.points;
    prefs.points += n; savePrefs();
    for (const id of BIKE_ORDER) if (before < BIKES[id].unlock && prefs.points >= BIKES[id].unlock) showMsg(`🔓 ${BIKES[id].name} bike unlocked!`, 3);
    if (before < GOLD && prefs.points >= GOLD) showMsg('🔓 Gold paint unlocked!', 3);
  }
  // little picture of a map for the menu cards
  function mapPic(sky, far, near, trail) {
    return `<svg class="pic" viewBox="0 0 160 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="80" fill="${sky}"/>
      <path d="M0 52 L30 26 L52 40 L82 12 L112 38 L134 24 L160 44 V80 H0z" fill="${far}" opacity=".75"/>
      <path d="M0 62 L40 46 L80 58 L120 44 L160 56 V80 H0z" fill="${near}"/>
      <path d="M86 80 C80 70 100 66 92 58 C86 52 104 50 98 46" stroke="${trail}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g fill="${near}">${[[14, 50], [24, 54], [128, 48], [142, 52], [60, 56]].map(([x, y]) => `<path d="M${x} ${y - 14} L${x - 5} ${y} H${x + 5}z"/>`).join('')}</g>
    </svg>`;
  }
  function controlsHTML() {
    if (TOUCH) return `<div class="ui-label">How to ride</div><div class="mr-keys">
      <kbd>Stick</kbd><span>Steer. Pull down to brake. In the air: flip. To spin, turn into the jump as you take off and keep holding</span>
      <kbd>Pedal</kbd><span>Hold the big green button to pedal</span>
      <kbd>Jump</kbd><span>Hold to crouch, let go to pop. Pop at the top of a jump to go higher</span>
      <kbd>Tricks</kbd><span>In the air: Tailwhip, Barspin, Superman, No hands. Tweak = table top (stick left: can-can, right: no footer). Let go before you land!</span>
      <kbd>Combo</kbd><span>Land tricks one after another to build a combo. Crash and you lose it</span>
      <kbd>↺</kbd><span>Back to the last checkpoint</span></div>`;
    return `<div class="ui-label">How to ride</div><div class="mr-keys">
      <kbd>Z</kbd><span>Pedal &nbsp; <kbd>← →</kbd> steer &nbsp; <kbd>↑ ↓</kbd> lean (↓ brakes; in the air: flip)</span>
      <kbd>Spin</kbd><span>Turn into the jump as you take off and keep holding ← or →. No turn-in, no 360</span>
      <kbd>X</kbd><span>Bunny hop (hold, then let go at a lip to go higher)</span>
      <kbd>S</kbd><span>Crouch / pump: hold going down rollers for speed &nbsp; <kbd>D</kbd> stretch to stay low off lips</span>
      <kbd>C + arrows</kbd><span>Tricks in the air: ← tailwhip, → barspin, ↑ superman, ↓ no hander. On the ground C + ↓ = manual</span>
      <kbd>Space</kbd><span>Tweak in the air: table top (with ← can-can, → no footer). Let go before landing!</span>
      <kbd>R</kbd><span>Respawn &nbsp; <kbd>Backspace</kbd> start &nbsp; <kbd>T</kbd> set respawn point &nbsp; <kbd>C</kbd> camera &nbsp; <kbd>V</kbd> reset camera &nbsp; <kbd>U</kbd> hide HUD &nbsp; <kbd>A</kbd> say hey</span>
      <kbd>🎮</kbd><span>Gamepad: stick, triggers, A jump, X Y B RB tricks, LT tweak in the air</span></div>`;
  }

  function startRide() {
    if (!W) return;
    initAudio();
    buildHUD(); hudRefs();
    restartRun();
    S.phase = 'ride';
  }
  function restartRun(keepRace) {
    if (!keepRace) { S.racing = false; S.raceT = 0; }
    placeAt(rider, W, W.start);
    S.hoopsDone = new Set(); S.time = 0; S.timing = false; S.score = 0; S.cp = 0; S.gate = null; S.finished = false; S.crashT = 0; S.combo = null; S.route = 0;
    snapCamera();
    if (H.score) { H.score.textContent = '0'; H.cp.textContent = `CP 0/${W.checkpoints.length - 1}`; }
    if (S.phase === 'ride' || S.phase === 'done') { S.phase = 'ride'; if (ui.querySelector('.ui-overlay')) buildHUD(), hudRefs(); }
  }
  function resetToCheckpoint() {
    if (S.phase !== 'ride') return;
    if (S.finished) { restartRun(); return; }
    placeAt(rider, W, S.gate || W.start);
    if (S.combo) loseCombo();
    S.crashT = 0;
    snapCamera();
  }
  function togglePause() {
    if (S.phase === 'ride') {
      S.phase = 'paused';
      const ov = document.createElement('div');
      ov.className = 'ui-overlay mr-pausepanel';
      ov.innerHTML = `<div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h2 class="ui-title">Paused</h2>
        <div class="ui-row"><button class="ui-btn go mr-res1">Resume</button><button class="ui-btn mr-res2">Restart</button>${online.isHost() ? '<button class="ui-btn primary mr-res4">🏁 Race friends</button>' : ''}<button class="ui-btn ghost mr-res3">Menu</button></div>${online.net.room ? `<div class="mr-roomstrip">${online.stripHTML()}</div>` : ''}${controlsHTML()}</div>`;
      ui.appendChild(ov);
      click(ov.querySelector('.mr-res1'), togglePause);
      click(ov.querySelector('.mr-res4'), () => { ov.remove(); S.phase = 'ride'; online.startRace(); });
      click(ov.querySelector('.mr-res2'), () => { ov.remove(); S.phase = 'ride'; restartRun(); });
      click(ov.querySelector('.mr-res3'), () => { menu(); placeAt(rider, W, W.start); snapCamera(); });
    } else if (S.phase === 'paused') {
      const ov = ui.querySelector('.mr-pausepanel'); if (ov) ov.remove();
      S.phase = 'ride';
    }
  }
  function toggleCam() { prefs.cam = prefs.cam === 'chase' ? 'helmet' : 'chase'; savePrefs(); }
  function toggleUI() { S.hideUI = !S.hideUI; hudEl.style.display = S.hideUI ? 'none' : ''; ui.querySelectorAll('.mr-tr').forEach(e => { e.style.display = S.hideUI ? 'none' : ''; }); }
  function setRespawn() {
    if (!rider.ground || rider.crashed) return;
    S.gate = { x: rider.pos.x, z: rider.pos.z, yaw: rider.yaw, own: true };
    showMsg('Respawn point set', 1.2); snd('cp');
  }
  function sayHey() { showMsg('👋 Hey!', 1); snd('hey'); S.hey = Date.now(); }
  const showMsgSafe = (t, d) => { if (H.msg && hudEl.contains(H.msg)) showMsg(t, d); };
  function showMenuNote(t) { const n = ui.querySelector('.mr-note'); if (n) n.textContent = t; }
  // ---- friends room + races
  function refreshRoomBits() {
    if (S.phase === 'menu' && online.net.room && !ui.querySelector('.mr-roomstrip')) { menu(); return; }
    ui.querySelectorAll('.mr-roomstrip').forEach(e => { e.innerHTML = online.stripHTML(); });
    const rb = ui.querySelector('.mr-board'); if (rb) rb.innerHTML = boardHTML();
  }
  function boardHTML() {
    if (!online.net.room || !S.raceId) return '';
    const rows = online.list().filter(p => p.race === S.raceId && Number.isFinite(p.time)).sort((a, b) => a.time - b.time);
    if (!rows.length) return '<div class="mr-best">Waiting for riders to finish…</div>';
    return `<div class="mr-boardlist">${rows.map((p, i) => `<div><span>${['🥇', '🥈', '🥉'][i] || i + 1 + '.'}</span><b>${p.face || '🙂'} ${p.name}</b><i>${fmt(p.time)}</i></div>`).join('')}</div>`;
  }
  function startRaceCountdown(race) {
    if (S.phase !== 'ride') { if (!hudEl.querySelector('.mr-time')) startRide(); else { ui.querySelectorAll('.ui-overlay').forEach(o => o.remove()); S.phase = 'ride'; } }
    S.raceId = race.id; S.raceT = race.t; S.cdShown = undefined;
    restartRun(true);
    S.racing = true; S.timing = false;
  }
  // combos: tricks landed one after another add up; banked after COMBO_GAP seconds on the ground
  function addCombo(list, pts) {
    if (!S.combo) S.combo = { pts: 0, n: 0, t: COMBO_GAP };
    S.combo.pts += pts; S.combo.n++; S.combo.t = COMBO_GAP;
  }
  function bankCombo() {
    const c = S.combo; S.combo = null;
    if (!c) return;
    const total = c.pts * c.n;
    S.score += total;
    addPoints(total);
    if (c.n > 1) { showTrick([`Combo x${c.n}`], total, ''); snd('combo'); }
  }
  function loseCombo() { if (S.combo && S.combo.n > 1) showMsg('Combo lost!', 1.2); S.combo = null; }

  function finishRun() {
    S.finished = true; S.timing = false;
    const raceRun = S.racing && S.raceId;
    if (raceRun) online.postResult(S.raceId, S.time);
    const best = prefs.best[S.map];
    const newBest = !best || S.time < best.time;
    const newScore = !best || S.score > (best.score || 0);
    prefs.best[S.map] = { time: newBest ? S.time : best.time, score: Math.max(S.score, best ? best.score : 0) };
    savePrefs();
    if (prefs.online) online.submitBest(S.map, prefs.best[S.map].time, prefs.best[S.map].score);
    snd('finish');
    setTimeout(() => {
      if (!alive || !S.finished) return;
      S.phase = 'done';
      const ov = document.createElement('div'); ov.className = 'ui-overlay';
      ov.innerHTML = `<div class="ui-panel"><div class="ui-kicker">${W.name}</div><h2 class="ui-title">Finished!</h2>
        <div class="mr-res"><div><span>Time</span><b>${fmt(S.time)}</b>${newBest ? '<span>Best!</span>' : ''}</div><div><span>Tricks</span><b>${S.score.toLocaleString()}</b>${newScore && S.score ? '<span>Best!</span>' : ''}</div><div><span>Best time</span><b>${fmt(prefs.best[S.map].time)}</b></div></div>
        ${raceRun ? `<div class="ui-label">Race</div><div class="mr-board">${boardHTML()}</div>` : ''}
        <div class="ui-row"><button class="ui-btn go big mr-again">Ride again</button>${raceRun && online.isHost() ? '<button class="ui-btn primary mr-race2">Race again</button>' : ''}<button class="ui-btn ghost mr-menu">Menu</button></div></div>`;
      ui.appendChild(ov);
      click(ov.querySelector('.mr-again'), () => { ov.remove(); S.phase = 'ride'; restartRun(); });
      click(ov.querySelector('.mr-race2'), () => online.startRace());
      click(ov.querySelector('.mr-menu'), () => { menu(); placeAt(rider, W, W.start); snapCamera(); });
    }, 1200);
  }

  // ---------------------------------------------------------------- sound
  let A = null;
  function initAudio() {
    if (A || !prefs.sound) return;
    const a = audioCtx(); if (!a) return;
    const noiseBuf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate), d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const loop = () => { const s = a.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(); return s; };
    const out = a.createGain(); out.gain.value = 0.9; out.connect(a.destination);
    const wind = loop(), wf = a.createBiquadFilter(), wg = a.createGain(); wf.type = 'lowpass'; wf.frequency.value = 500; wg.gain.value = 0; wind.connect(wf).connect(wg).connect(out);
    const tyre = loop(), tf = a.createBiquadFilter(), tg = a.createGain(); tf.type = 'bandpass'; tf.frequency.value = 900; tf.Q.value = 0.8; tg.gain.value = 0; tyre.connect(tf).connect(tg).connect(out);
    const skid = loop(), sf = a.createBiquadFilter(), sg = a.createGain(); sf.type = 'bandpass'; sf.frequency.value = 2200; sf.Q.value = 1.5; sg.gain.value = 0; skid.connect(sf).connect(sg).connect(out);
    A = { a, out, wg, wf, tg, tf, sg, noiseBuf, clickT: 0, nodes: [wind, tyre, skid] };
  }
  function snd(kind, v = 1) {
    if (!A) return;
    const a = A.a, t = a.currentTime;
    const burst = (dur, freq, vol, type = 'lowpass') => {
      const s = a.createBufferSource(); s.buffer = A.noiseBuf; const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; const g = a.createGain();
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); s.connect(f).connect(g).connect(A.out); s.start(t, Math.random()); s.stop(t + dur);
    };
    const tone = (f0, f1, dur, vol, type = 'sine', delay = 0) => {
      const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t + delay); o.frequency.exponentialRampToValueAtTime(f1, t + delay + dur);
      g.gain.setValueAtTime(0.0001, t + delay); g.gain.linearRampToValueAtTime(vol, t + delay + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + delay + dur); o.connect(g).connect(A.out); o.start(t + delay); o.stop(t + delay + dur + 0.02);
    };
    if (kind === 'land') { burst(0.25, 300, 0.35 * v); tone(90, 50, 0.18, 0.4 * v); }
    else if (kind === 'crash') { burst(0.6, 900, 0.5); burst(0.4, 200, 0.6); tone(120, 40, 0.3, 0.4); }
    else if (kind === 'trick') { tone(660, 990, 0.12, 0.12, 'triangle'); tone(990, 1320, 0.16, 0.12, 'triangle', 0.09); }
    else if (kind === 'cp') { tone(880, 880, 0.12, 0.15, 'triangle'); tone(1175, 1175, 0.2, 0.15, 'triangle', 0.12); }
    else if (kind === 'finish') { [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.25, 0.15, 'triangle', i * 0.12)); burst(1.2, 1500, 0.15, 'bandpass'); }
    else if (kind === 'pop') { burst(0.12, 600, 0.15); }
    else if (kind === 'combo') { [784, 988, 1175, 1568].forEach((f, i) => tone(f, f, 0.14, 0.12, 'triangle', i * 0.07)); }
    else if (kind === 'hey') { tone(520, 640, 0.12, 0.18, 'square'); tone(640, 520, 0.16, 0.18, 'square', 0.13); }
    else if (kind === 'splash') { burst(0.35, 2600, 0.3 * v, 'highpass'); burst(0.2, 900, 0.2 * v, 'bandpass'); }
    else if (kind === 'click') { tone(3000, 2000, 0.015, 0.03, 'square'); }
  }
  function updateAudio(dt) {
    if (!A) return;
    const t = A.a.currentTime, b = rider, sp = S.phase === 'ride' ? b.speed : 0;
    A.wg.gain.setTargetAtTime(Math.min(0.5, sp * sp * 0.0016), t, 0.1);
    A.wf.frequency.setTargetAtTime(300 + sp * 60, t, 0.1);
    const onG = b.ground && !b.crashed && S.phase === 'ride';
    A.tg.gain.setTargetAtTime(onG ? Math.min(0.22, sp * 0.018) : 0, t, 0.05);
    A.tf.frequency.setTargetAtTime(500 + sp * 50, t, 0.1);
    A.sg.gain.setTargetAtTime(onG ? (b.slide * 0.18 + (b.brake > 0.3 && sp > 3 ? 0.08 : 0)) : 0, t, 0.05);
    // freewheel clicks when coasting
    if (onG && b.pedal === 0 && sp > 1) { A.clickT -= dt * (6 + sp * 2.5); if (A.clickT <= 0) { A.clickT = 1; snd('click'); } }
  }

  // ---------------------------------------------------------------- bike drawing
  const frameOut = { up: new THREE.Vector3(), fwd: new THREE.Vector3() };
  const m4 = new THREE.Matrix4(), mA = new THREE.Matrix4(), mB = new THREE.Matrix4(), xAxis = new THREE.Vector3();
  const vis = { roll: 0, manual: 0, up: new THREE.Vector3(0, 1, 0), com: new THREE.Vector3(0, COM, 0), sf: 0.25, vf: 0, sr: 0.25, vr: 0 };
  const crashSim = { bike: null, rider: null };
  function placeBike(dt) {
    const b = rider;
    if (b.crashed && crashSim.bike) { drawCrash(dt); return; }
    bikeFrame(b, frameOut);
    const fwd = frameOut.fwd, up = frameOut.up;
    // when the tyres let go it's the back wheel that steps out: swing the bike round its front wheel
    vis.skid = lerp(vis.skid || 0, b.ground ? clamp(-(b.vS || 0) * 0.3, -0.45, 0.45) : 0, 1 - Math.exp(-dt * 9));
    const fx0 = fwd.x, fy0 = fwd.y, fz0 = fwd.z;
    if (Math.abs(vis.skid) > 0.002) fwd.applyAxisAngle(up, vis.skid);
    const skX = (fx0 - fwd.x) * 0.6, skY = (fy0 - fwd.y) * 0.6, skZ = (fz0 - fwd.z) * 0.6;
    // lean into turns
    // the faster you go the further you lean, and more again when a berm is holding you
    const inBerm = clamp((b.bankUp || 0) * 4, 0, 1) * clamp(b.speed / 12, 0, 1);
    const targetRoll = b.ground ? clamp(b.steer * (0.12 + 0.62 * clamp(b.speed / 15, 0, 1) + 0.22 * inBerm), -0.95, 0.95) : vis.roll * 0.95;
    vis.roll = lerp(vis.roll, targetRoll, 1 - Math.exp(-dt * 6));
    up.applyAxisAngle(fwd, vis.roll);
    vis.manual = lerp(vis.manual, b.manual ? 0.42 + b.manualBal * 0.12 : 0, 1 - Math.exp(-dt * 10));
    xAxis.crossVectors(up, fwd).normalize();
    m4.makeBasis(xAxis, up, fwd);
    // the bike turns round its middle; that middle point glides smoothly between riding and flying
    const want = b.ground ? up : b.takeoffUp;
    vis.com.lerp(new THREE.Vector3(want.x * COM, want.y * COM, want.z * COM), dt > 0 ? 1 - Math.exp(-dt * 14) : 1);
    mA.makeTranslation(0, -COM, 0);
    m4.setPosition(b.pos.x + vis.com.x + skX, b.pos.y + vis.com.y + skY, b.pos.z + vis.com.z + skZ).multiply(mA);
    if (vis.manual > 0.01) {
      mA.makeTranslation(0, 0, -0.62); mB.makeRotationX(-vis.manual);
      m4.multiply(mA).multiply(mB); mA.makeTranslation(0, 0, 0.62); m4.multiply(mA);
    }
    bike.root.matrix.copy(m4); bike.root.matrixWorldNeedsUpdate = true;
    bike.rider.matrix.copy(m4); bike.rider.matrixWorldNeedsUpdate = true;
    // suspension: springs that squash on landings and bumps, stretch out in the air
    if (dt > 0) {
      const bump = b.ground ? (b.rough * 0.25 + Math.min(0.08, b.speed * 0.004)) * (Math.random() - 0.5) : 0;
      const tgt = b.ground ? 0.25 + 0.15 * Math.max(0, b.crouch) + bump : 0.03;
      const st = (s0, v0, k, c) => { const a = (tgt - s0) * k - v0 * c; v0 += a * dt; s0 = clamp(s0 + v0 * dt, 0, 1); return [s0, v0]; };
      [vis.sf, vis.vf] = st(vis.sf, vis.vf, 160, 15); [vis.sr, vis.vr] = st(vis.sr, vis.vr, 110, 12);
      if (vis.manual > 0.1) vis.sr = Math.max(vis.sr, 0.45);
    }
    lastPose = { suspF: vis.sf, suspR: vis.sr, steer: b.steer, crouch: b.crouch * 0.8 + (b.ground ? clamp(b.speed / 25, 0, 0.3) : 0.15), lean: b.ground ? 0 : -b.flipV * 0.03, crank: b.crank, wheel: b.wheel, superman: b.superman, nohand: b.nohand, table: b.table, cancan: b.cancan, nofoot: b.nofoot, whip: b.whipping ? b.whip : 0, bar: b.barring ? b.bar : 0, manual: vis.manual * 2 };
    bike.pose(lastPose);
  }
  function startCrash() {
    const b = rider;
    const v = new THREE.Vector3(b.vel.x, b.vel.y, b.vel.z);
    const rv = v.clone().multiplyScalar(0.8); rv.y += 2.5;
    const sp = Math.max(3, v.length());
    crashSim.bike = { m: bike.root.matrix.clone(), pos: new THREE.Vector3().setFromMatrixPosition(bike.root.matrix).add(new THREE.Vector3(0, 0.4, 0)), vel: v.clone().multiplyScalar(0.7), q: new THREE.Quaternion().setFromRotationMatrix(bike.root.matrix), w: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8) };
    crashSim.rider = { pos: new THREE.Vector3().setFromMatrixPosition(bike.rider.matrix).add(new THREE.Vector3(0, 0.6, 0)), vel: rv, q: new THREE.Quaternion().setFromRotationMatrix(bike.rider.matrix), w: new THREE.Vector3(-sp * 0.6, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 4) };
    bike.pose({ steer: 0, crouch: 1, lean: 0, crank: 0, wheel: b.wheel, superman: 0, nohand: 0.6, whip: 0, bar: 0, manual: 0 });
    for (let i = 0; i < 14; i++) dustAt(b.pos.x, b.pos.y + 0.2, b.pos.z, 3, 0.9, 1.6);
  }
  const dq = new THREE.Quaternion(), tv = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  function simBody(o, dt, rad) {
    o.vel.y -= 9.81 * dt;
    o.pos.addScaledVector(o.vel, dt);
    const h = W.height(o.pos.x, o.pos.z) + rad;
    if (o.pos.y < h) {
      o.pos.y = h;
      if (o.vel.y < -1.5) dustAt(o.pos.x, h - rad, o.pos.z, 1.5, 0.8, 1);
      o.vel.y = Math.abs(o.vel.y) * 0.25; o.vel.x *= 0.82; o.vel.z *= 0.82; o.w.multiplyScalar(0.8);
    }
    const wl = o.w.length();
    if (wl > 0.001) { dq.setFromAxisAngle(tv.copy(o.w).divideScalar(wl), wl * dt); o.q.premultiply(dq); }
  }
  function drawCrash(dt) {
    simBody(crashSim.bike, dt, 0.35); simBody(crashSim.rider, dt, 0.35);
    bike.root.matrix.compose(crashSim.bike.pos.clone().add(new THREE.Vector3(0, -0.5, 0).applyQuaternion(crashSim.bike.q)), crashSim.bike.q, one);
    bike.rider.matrix.compose(crashSim.rider.pos.clone().add(new THREE.Vector3(0, -0.9, 0).applyQuaternion(crashSim.rider.q)), crashSim.rider.q, one);
    bike.root.matrixWorldNeedsUpdate = bike.rider.matrixWorldNeedsUpdate = true;
  }

  // ---------------------------------------------------------------- dust
  function dustAt(x, y, z, spread, life, size) {
    scene.dust.puff(x + (Math.random() - 0.5) * 0.4, y, z + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * spread, Math.random() * spread * 0.5, (Math.random() - 0.5) * spread, size, life, 2.2, 0.45);
  }
  let dustAcc = 0, skidLast = null;
  function emitDust(dt) {
    const b = rider;
    // tyre marks when sliding or braking hard
    const marking = b.ground && !b.crashed && (b.slide > 0.25 || (b.brake > 0.5 && b.speed > 5));
    if (marking) {
      const f0 = bikeFrame(b, frameOut).fwd, x = b.pos.x - f0.x * 0.62, z = b.pos.z - f0.z * 0.62, y = W.height(x, z);
      if (skidLast && Math.hypot(x - skidLast.x, z - skidLast.z) > 0.25) {
        if (Math.hypot(x - skidLast.x, z - skidLast.z) < 2) scene.skids.add(skidLast.x, skidLast.y, skidLast.z, x, y, z, 0.12, Math.min(1, 0.4 + b.slide));
        skidLast = { x, y, z };
      } else if (!skidLast) skidLast = { x, y, z };
    } else skidLast = null;
    if (!b.ground || b.crashed) return;
    const onDirt = W.trailMask(b.pos.x, b.pos.z) > 0.4;
    const rate = (b.slide * 50 + (b.brake > 0.3 && b.speed > 4 ? 25 : 0) + (b.speed > 9 ? (b.speed - 9) * 1.5 : 0)) * (onDirt ? 1 : 0.25);
    dustAcc += rate * dt;
    const f = bikeFrame(b, frameOut).fwd;
    while (dustAcc > 1) {
      dustAcc -= 1;
      const x = b.pos.x - f.x * 0.62, z = b.pos.z - f.z * 0.62;
      scene.dust.puff(x + (Math.random() - 0.5) * 0.3, W.height(x, z) + 0.1, z + (Math.random() - 0.5) * 0.3, -b.vel.x * 0.15 + (Math.random() - 0.5), Math.random() * 0.8, -b.vel.z * 0.15 + (Math.random() - 0.5), 0.6 + b.slide, 1.0 + Math.random() * 0.6, 2.5, 0.35);
    }
  }

  // ---------------------------------------------------------------- camera
  function snapCamera() {
    if (!rider) return;
    cam.yaw = rider.yaw;
    const b = rider;
    cam.pos.set(b.pos.x - Math.sin(cam.yaw) * 5, b.pos.y + 2.2, b.pos.z - Math.cos(cam.yaw) * 5);
    cam.look.set(b.pos.x + Math.sin(cam.yaw) * 3, b.pos.y + 0.8, b.pos.z + Math.cos(cam.yaw) * 3);
  }
  const tmpV = new THREE.Vector3();
  function updateCamera(dt) {
    const b = rider;
    const crashed = b.crashed && crashSim.rider;
    const focus = crashed ? crashSim.rider.pos : tmpV.set(b.pos.x, b.pos.y + (b.ground ? 0 : 0), b.pos.z);
    const hs = Math.hypot(b.vel.x, b.vel.z);
    const travelYaw = hs > 1.5 ? Math.atan2(b.vel.x, b.vel.z) : b.yaw;
    let dy = travelYaw - cam.yaw; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    if (!crashed) cam.yaw += dy * (1 - Math.exp(-dt * (b.ground ? 4 : 1.5)));
    let fovT = 68 + clamp(b.speed - 8, 0, 14) * 0.9;
    bike.head.visible = !(prefs.cam === 'helmet' && !crashed);
    if (prefs.cam === 'helmet' && !crashed) {
      // rider's eyes
      const hp = bike.headPos().clone().add(new THREE.Vector3(0, 0.02, 0.12)).applyMatrix4(bike.rider.matrix);
      camera.position.copy(hp);
      const f = bikeFrame(b, frameOut);
      const lookAt = hp.clone().add(new THREE.Vector3(f.fwd.x, f.fwd.y - 0.18, f.fwd.z).multiplyScalar(5));
      camera.up.copy(f.up);
      camera.lookAt(lookAt);
      fovT += 6;
    } else {
      camera.up.set(0, 1, 0);
      const dist = 5.0 + clamp(b.speed / 18, 0, 1) * 1.4, height = 2.5;
      const want = new THREE.Vector3(focus.x - Math.sin(cam.yaw) * dist, focus.y + height, focus.z - Math.cos(cam.yaw) * dist);
      // stay above the ground (and above the trail behind on steep bits)
      const gh = W.height(want.x, want.z) + 1.1;
      if (want.y < gh) want.y = gh;
      const k = 1 - Math.exp(-dt * (crashed ? 2 : 7));
      cam.pos.lerp(want, k);
      if (cam.pos.y < W.height(cam.pos.x, cam.pos.z) + 0.6) cam.pos.y = W.height(cam.pos.x, cam.pos.z) + 0.6;
      const lookWant = new THREE.Vector3(focus.x + Math.sin(cam.yaw) * 2.5, focus.y + 0.9, focus.z + Math.cos(cam.yaw) * 2.5);
      cam.look.lerp(lookWant, 1 - Math.exp(-dt * 10));
      camera.position.copy(cam.pos);
      if (cam.shake > 0) { camera.position.x += (Math.random() - 0.5) * cam.shake; camera.position.y += (Math.random() - 0.5) * cam.shake; cam.shake = Math.max(0, cam.shake - dt * 1.2); }
      camera.lookAt(cam.look);
    }
    cam.fov = lerp(cam.fov, fovT, 1 - Math.exp(-dt * 3));
    if (Math.abs(camera.fov - cam.fov) > 0.05) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
  }

  // ---------------------------------------------------------------- game step
  let acc = 0, last = performance.now(), airShow = 0, routeHide = 0;
  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!scene || !rider || !bike || S.phase === 'loading') return;
    const inp = readInput();
    if (S.phase === 'ride' && window.__mr && window.__mr.hold) { /* test: frozen */ }
    else if (S.phase === 'ride') {
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 12) {
        acc -= STEP; n++;
        const useInp = S.finished ? { steer: 0, throttle: -0.6, jump: false } : inp;
        const wasCrashed = rider.crashed;
        stepRider(rider, W, useInp, STEP);
        handleEvents();
        if (rider.crashed && !wasCrashed) { startCrash(); }
      }
      if (rider.crashed) { S.crashT += dt; if (S.crashT > 1.5) { crashSim.bike = null; resetToCheckpoint(); } }
      else { crashSim.bike = null; }
      if (S.timing) S.time += dt;
      // start timer, checkpoints, finish
      if (S.racing && S.raceT) {
        const left = (S.raceT - online.now()) / 1000;
        if (left > 0) { placeAt(rider, W, W.start); S.time = 0; const n = Math.ceil(left); if (n !== S.cdShown && n <= 3) { S.cdShown = n; showMsg(String(n), 0.9); snd('cp'); } }
        else if (S.cdShown !== 0) { S.cdShown = 0; S.timing = true; S.time = -left; showMsg('GO!', 1); snd('combo'); }
      } else if (!S.timing && !S.finished && rider.pos.z > W.startZ + 2) S.timing = true;
      const nextCp = W.checkpoints[S.cp + 1];
      if (nextCp && !rider.crashed && rider.onTrail) {
        const g = nextCp.gates.find(g => g.r === rider.route && rider.progress >= g.i) || (rider.pos.z > nextCp.z + 6 ? nextCp.gates.reduce((a, b) => (Math.hypot(a.x - rider.pos.x, a.z - rider.pos.z) < Math.hypot(b.x - rider.pos.x, b.z - rider.pos.z) ? a : b)) : null);
        if (g) { S.cp++; if (!S.gate || !S.gate.own || S.gate.z < g.z) S.gate = g; snd('cp'); showMsg(`Checkpoint ${S.cp}  ·  ${fmt(S.time)}`); }
      }
      if (!S.finished && !rider.crashed && rider.progress >= W.routes[rider.route].finish) { bankCombo(); finishRun(); showMsg(`Finish! ${fmt(S.time)}`, 3); }
      if (rider.route !== S.route && rider.onTrail) { S.route = rider.route; if (H.route) { H.route.textContent = W.routes[S.route].name; H.route.classList.add('show'); routeHide = 2; } }
      // hoops: fly through one for a bonus
      for (let hi = 0; hi < W.hoops.length; hi++) {
        if (S.hoopsDone.has(hi) || rider.crashed) continue;
        const h = W.hoops[hi], rx = rider.pos.x - h.x, ry = rider.pos.y + 0.9 - h.y, rz = rider.pos.z - h.z;
        const along = rx * Math.sin(h.yaw) + rz * Math.cos(h.yaw), side = rx * Math.cos(h.yaw) - rz * Math.sin(h.yaw);
        if (Math.abs(along) < 0.9 && Math.hypot(side, ry) < h.r) { S.hoopsDone.add(hi); addCombo(['Hoop!'], 500); showTrick(['🔥 Through the hoop!'], 500, ''); snd('combo'); }
      }
      // combo timer runs while you're riding on the ground (manuals keep it going)
      if (S.combo && rider.ground && !rider.crashed && !rider.manual) { S.combo.t -= dt; if (S.combo.t <= 0) bankCombo(); }
      emitDust(dt);
      // warn when coming into the rocks too fast
      if (!rider.crashed && rider.ground && rider.speed > 9.5) {
        const hv = Math.hypot(rider.vel.x, rider.vel.z) || 1, ax = rider.pos.x + rider.vel.x / hv * 14, az = rider.pos.z + rider.vel.z / hv * 14;
        if (W.roughAt(ax, az) > 0.4 && performance.now() - (S.warnT || 0) > 4000) { S.warnT = performance.now(); showMsg('🪨 Rocks! Slow down!', 1.5); }
      }
      if (rider.rattle > 0.3) cam.shake = Math.max(cam.shake, rider.rattle * 0.12);
      // stuck? remind how to reset
      if (rider.ground && !rider.crashed && rider.speed < 0.6 && !S.finished) { S.stuckT = (S.stuckT || 0) + dt; if (S.stuckT > 3.5) { showMsg(TOUCH ? 'Stuck? Tap ↺ Reset' : 'Stuck? Press R', 2); S.stuckT = 0; } }
      else S.stuckT = 0;
    } else if (S.phase === 'menu' || S.phase === 'garage') {
      // slow orbit round the rider at the start
      S.time += dt;
    }
    if (!(window.__mr && window.__mr.hold)) placeBike(dt);
    const showroom = S.phase === 'garage';
    if (showroom !== !!camera.view?.enabled) {
      const w = root.clientWidth || innerWidth, h = root.clientHeight || innerHeight;
      if (showroom && w > 700) camera.setViewOffset(w, h, -w * 0.22, 0, w, h); else camera.clearViewOffset();
    }
    if (S.phase === 'menu' || showroom) {
      const b = rider, a = S.time * (showroom ? 0.35 : 0.15) + 2.2, d = showroom ? 3.6 : 5.5;
      camera.position.set(b.pos.x + Math.sin(a) * d, b.pos.y + (showroom ? 1.2 : 1.6), b.pos.z + Math.cos(a) * d);
      camera.up.set(0, 1, 0);
      camera.lookAt(b.pos.x, b.pos.y + 0.8, b.pos.z);
      bike.head.visible = true;
      if (camera.fov !== 55) { camera.fov = 55; camera.updateProjectionMatrix(); }
    } else if (!(window.__mr && window.__mr.hold)) updateCamera(dt);
    online.tick(dt, S.map, S.phase === 'ride' || S.phase === 'paused' || S.phase === 'done');
    online.update(dt);
    scene.update(dt, camera, rider.pos);
    updateHUD(dt);
    updateAudio(dt);
    renderer.render(scene.scene, camera);
  }
  function handleEvents() {
    for (const e of rider.events) {
      if (e.type === 'trick') {
        if (S.finished) continue;
        addCombo(e.list, e.pts); showTrick(e.list, e.pts, e.perfect ? 'Perfect landing!' : ''); snd('trick');
      } else if (e.type === 'splash') {
        // spray thrown up and out from the wheels
        const b = rider, n = Math.min(10, 3 + Math.floor(e.v * 0.6)), hs = Math.hypot(b.vel.x, b.vel.z) || 1, fx = b.vel.x / hs, fz = b.vel.z / hs;
        for (let i = 0; i < n; i++) { const sd = Math.random() < 0.5 ? -1 : 1, out = 1.2 + Math.random() * 2.2 + e.v * 0.12, up = 1.6 + Math.random() * 2.4 + e.v * 0.14;
          scene.spray.puff(b.pos.x - fx * 0.5 + (Math.random() - 0.5) * 0.5, b.pos.y + 0.25, b.pos.z - fz * 0.5 + (Math.random() - 0.5) * 0.5, fz * sd * out + fx * e.v * 0.25, up, -fx * sd * out + fz * e.v * 0.25, 0.25 + Math.random() * 0.3, 0.45 + Math.random() * 0.35, 1.6, 0.75); }
        if (!A.splashT || performance.now() - A.splashT > 140) { A.splashT = performance.now(); snd('splash', clamp(e.v / 12, 0.25, 1)); }
      } else if (e.type === 'land') {
        snd('land', clamp(e.v / 10, 0.2, 1));
        vis.vf += Math.min(9, e.v * 0.55); vis.vr += Math.min(9, e.v * 0.5);
        cam.shake = Math.min(0.25, e.v * 0.02);
        if (e.v > 3) for (let i = 0; i < Math.min(16, e.v * 1.5); i++) dustAt(rider.pos.x, rider.pos.y + 0.1, rider.pos.z, 2.5, 1.1, 1.0);
      } else if (e.type === 'crash') {
        snd('crash'); cam.shake = 0.35; loseCombo();
        showMsg({ tree: 'Ouch! Tree!', edge: 'Off the mountain!', rocks: 'Too fast for the rocks!', wall: 'Bonk! Ride round or jump it' }[e.why] || 'Crashed!', 1.4);
      } else if (e.type === 'pop') snd('pop');
      else if (e.type === 'save') { cam.shake = Math.max(cam.shake, 0.2); snd('land', 0.6); if (performance.now() - (S.saveT || 0) > 1500) { S.saveT = performance.now(); showMsg(e.why === 'tree' ? '🛟 Bumped a tree!' : e.why === 'rocks' ? '🛟 Whoa, rocks!' : '🛟 Saved it!', 1); } if (S.combo) loseCombo(); }
    }
  }
  function updateHUD(dt) {
    if (S.phase !== 'ride' && S.phase !== 'done' || !H.time) return;
    H.time.textContent = fmt(Math.max(0, S.time));
    const nOn = online.remotes.size;
    H.onl.textContent = nOn ? `${online.net.room ? '👫' : '🌍'} ${nOn + 1} riding` : '';
    H.cp.textContent = `CP ${S.cp}/${W.checkpoints.length - 1}`;
    H.score.textContent = S.score.toLocaleString();
    H.speed.textContent = Math.round(rider.speed * 3.6);
    H.prog.style.width = clamp((rider.pos.z - W.startZ) / (W.finishZ - W.startZ), 0, 1) * 100 + '%';
    H.combo.textContent = S.combo ? `Combo x${S.combo.n} · ${(S.combo.pts * S.combo.n).toLocaleString()}` : '';
    if (routeHide > 0) { routeHide -= dt; if (routeHide <= 0) H.route.classList.remove('show'); }
    if (trickHide > 0) { trickHide -= dt; if (trickHide <= 0) H.trick.classList.remove('show'); }
    if (msgHide > 0) { msgHide -= dt; if (msgHide <= 0) H.msg.classList.remove('show'); }
    // live trick names while in the air
    const b = rider;
    if (!b.ground && !b.crashed && b.air > 0.25) {
      const parts = [];
      const fl = b.flip / (Math.PI * 2), sp = b.spin / (Math.PI * 2);
      if (Math.abs(fl) > 0.3) parts.push(`${fl > 0 ? 'Backflip' : 'Front flip'}${Math.abs(fl) > 1.3 ? ' x' + Math.round(Math.abs(fl)) : ''}`);
      if (Math.abs(sp) > 0.3) parts.push(Math.round(Math.abs(sp) * 2) * 180 + '');
      if (b.whipping) parts.push('Tailwhip');
      if (b.barring) parts.push('Barspin');
      for (const k of ['superman', 'nohand', 'table', 'cancan', 'nofoot']) if (b[k] > 0.5) parts.push(TRICKS[k].name);
      for (const k of b.airTricks) if (!parts.includes(TRICKS[k].name)) parts.push(TRICKS[k].name);
      H.air.textContent = parts.length ? parts.join(' + ') : `Air ${b.air.toFixed(1)}s`;
      H.air.classList.add('show');
    } else H.air.classList.remove('show');
  }

  // ---------------------------------------------------------------- size
  function resize() {
    const w = root.clientWidth || innerWidth, h = root.clientHeight || innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q.dpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (scene) scene.dust.setScale(h * renderer.getPixelRatio() * 0.6);
  }
  const ro = new ResizeObserver(resize); ro.observe(root);
  const onVis = () => { if (document.hidden && S.phase === 'ride') togglePause(); };
  document.addEventListener('visibilitychange', onVis);

  build().catch(e => {
    console.error(e);
    ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h2 class="ui-title">Something went wrong</h2><p class="ui-sub">${String(e.message || e).slice(0, 160)}</p></div></div>`;
  });
  raf = requestAnimationFrame(frame);

  // testing hook
  if (PARAMS.has('mrtest')) window.__mr = {
    S, get rider() { return rider; }, get W() { return W; }, get scene() { return scene; }, startRide, keys, camera, online, menu,
    // run the game for `sec` seconds with fixed inputs, without waiting for frames (for tests)
    sim(sec, inp = {}, stopWhen) {
      const full = { steer: 0, throttle: 0, jump: false, ...inp };
      for (let t = 0; t < sec; t += STEP) {
        const was = rider.crashed;
        stepRider(rider, W, full, STEP); handleEvents();
        if (rider.crashed && !was) startCrash();
        if (rider.crashed) { S.crashT += STEP; drawCrash(STEP); }
        else placeBike(STEP);
        updateCamera(STEP); scene.dust.update(STEP); scene.spray.update(STEP);
        if (S.crashT > 1.5) { crashSim.bike = null; resetToCheckpoint(); }
        if (stopWhen && stopWhen(rider)) break;
      }
      updateHUD(0.016);
    },
    hold: false,
  };

  return () => {
    alive = false;
    online.leaveAll();
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('keyup', onKey);
    window.removeEventListener('blur', onBlur);
    document.removeEventListener('visibilitychange', onVis);
    if (A) { try { A.nodes.forEach(n => n.stop()); A.out.disconnect(); } catch (e) { /* */ } }
    if (scene) disposeScene(scene.scene);
    renderer.dispose();
    css.remove();
  };
}
