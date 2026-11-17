// Mountain Rush: 3D downhill mountain biking.
//
// Step 1 (test version): one map (Pine Ridge), one trail with jumps, drops, berms and rollers,
// one bike, air tricks (flips, 360s, tailwhip, barspin, superman, no hander), manuals,
// crashes, instant reset to the last checkpoint.
//
// Files: world.js (mountain + trail maths), physics.js (bike, tricks, crashes),
// scene.js (sky, ground, trees, grass, gates, dust), bike.js (bike + rider model),
// textures.js (textures painted in code).
import * as THREE from '../../js/vendor/three.module.min.js';
import { audioCtx } from '../../js/engine/sound.js';
import { buildWorld, MAPS } from './world.js';
import { newRider, placeAt, stepRider, bikeFrame, COM, TRICKS } from './physics.js';
import { createScene, SUN_DIR } from './scene.js';
import { createBike, COLORS } from './bike.js';
import { makeTextures } from './textures.js';
import { clamp, lerp } from '../sky-pilot/noise.js';

const PREFS_KEY = 'mountain-rush-v1';
const TOUCH = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
const STEP = 1 / 120;
const PARAMS = new URLSearchParams(location.search);

const QUALITY = {
  low: { name: 'low', dpr: 1, shadows: 0, shadowBox: 40, trees: 0.55, grass: 0, grassPatch: 0, particles: 300, fog: 0.0105, viewDist: 190 },
  mid: { name: 'mid', dpr: 1.25, shadows: 2048, shadowBox: 42, trees: 0.8, grass: 0.7, grassPatch: 40, particles: 500, fog: 0.0088, viewDist: 230 },
  high: { name: 'high', dpr: 2, shadows: 4096, shadowBox: 48, trees: 1, grass: 0.5, grassPatch: 48, particles: 800, fog: 0.0076, viewDist: 260 },
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
    const d = { quality: PARAMS.get('mrq') || (Math.min(screen.width, screen.height) < 520 ? 'low' : TOUCH ? 'mid' : 'high'), cam: 'chase', sound: true, best: {}, look: { frame: 0, jersey: 0 } };
    try { return { ...d, ...(JSON.parse(localStorage.getItem(PREFS_KEY)) || {}) }; } catch (e) { return d; }
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
  const S = { phase: 'loading', paused: false, map: 'pine-ridge', time: 0, timing: false, score: 0, cp: 0, finished: false, crashT: 0, msgT: 0 };
  let alive = true, raf = 0, W = null, scene = null, bike = null, rider = null, Q = QUALITY[prefs.quality] || QUALITY.high;
  const camera = new THREE.PerspectiveCamera(70, 1, 0.08, 600);
  const cam = { pos: new THREE.Vector3(), look: new THREE.Vector3(), yaw: 0, fov: 70, shake: 0 };

  // ---------------------------------------------------------------- loading
  function loadingUI(txt, f) {
    ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h1 class="ui-title">${txt}</h1><div class="mr-load"><i style="width:${Math.round(f * 100)}%"></i></div></div></div>`;
  }
  const tick = () => new Promise(r => setTimeout(r, 16));
  let T = null, envTex = null;

  async function build() {
    S.phase = 'loading';
    loadingUI('Shaping the mountain', 0.05); await tick();
    if (!alive) return;
    W = buildWorld(S.map);
    loadingUI('Painting the ground', 0.3); await tick();
    if (!T) T = makeTextures(TOUCH ? 512 : 1024);
    loadingUI('Growing the forest', 0.5); await tick();
    if (scene) disposeScene(scene.scene);
    renderer.shadowMap.enabled = Q.shadows > 0;
    scene = createScene(W, T, Q);
    if (!envTex) envTex = makeEnv();
    loadingUI('Pumping up the tyres', 0.85); await tick();
    bike = createBike(T, envTex, lookColors());
    bike.root.matrixAutoUpdate = false; bike.rider.matrixAutoUpdate = false;
    scene.scene.add(bike.root); scene.scene.add(bike.rider);
    rider = newRider(W);
    resize();
    camera.far = Q.viewDist + 140; camera.updateProjectionMatrix();
    snapCamera();
    placeBike(0);
    renderer.compile(scene.scene, camera);
    if (!alive) return;
    S.phase = 'menu';
    menu();
  }

  function makeEnv() {
    // soft sky reflections for the shiny bits (frame, helmet, goggles)
    const pm = new THREE.PMREMGenerator(renderer);
    const es = new THREE.Scene();
    const sky = scene.scene.children.find(o => o.isMesh && o.material && o.material.type === 'ShaderMaterial');
    if (sky) es.add(sky.clone());
    const ground = new THREE.Mesh(new THREE.CircleGeometry(400, 24), new THREE.MeshBasicMaterial({ color: 0x3c4a32 }));
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

  const lookColors = () => ({ frame: COLORS.frame[prefs.look.frame] ?? COLORS.frame[0], jersey: COLORS.jersey[prefs.look.jersey] ?? COLORS.jersey[0] });

  // ---------------------------------------------------------------- input
  const keys = new Set();
  const onKey = e => {
    if (e.type === 'keydown') {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      if (!keys.has(e.code)) pressed(e.code);
      keys.add(e.code);
    } else keys.delete(e.code);
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  const onBlur = () => keys.clear();
  window.addEventListener('blur', onBlur);
  function pressed(code) {
    if (S.phase !== 'ride') return;
    if (code === 'KeyR' || code === 'Enter') resetToCheckpoint();
    else if (code === 'KeyT' || code === 'Backspace') restartRun();
    else if (code === 'KeyC') toggleCam();
    else if (code === 'Escape' || code === 'KeyP') togglePause();
  }
  const touchState = { x: 0, y: 0, jump: false, whip: false, bar: false, sup: false, noh: false, man: false };
  let padPrev = {};
  function readInput() {
    const k = c => keys.has(c);
    let steer = (k('ArrowRight') || k('KeyD') ? 1 : 0) - (k('ArrowLeft') || k('KeyA') ? 1 : 0);
    let thr = (k('ArrowUp') || k('KeyW') ? 1 : 0) - (k('ArrowDown') || k('KeyS') ? 1 : 0);
    const inp = {
      steer, throttle: thr, jump: k('Space'),
      whip: k('KeyJ'), barspin: k('KeyI'), superman: k('KeyK'), nohand: k('KeyL'),
      manual: k('KeyQ') || k('ShiftLeft') || k('ShiftRight'),
    };
    // touch
    if (TOUCH) {
      if (Math.abs(touchState.x) > 0.05) inp.steer = touchState.x;
      if (Math.abs(touchState.y) > 0.05) inp.throttle = touchState.y;
      inp.jump = inp.jump || touchState.jump; inp.whip = inp.whip || touchState.whip; inp.barspin = inp.barspin || touchState.bar;
      inp.superman = inp.superman || touchState.sup; inp.nohand = inp.nohand || touchState.noh; inp.manual = inp.manual || touchState.man;
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
      if (rider && !rider.ground) { if (ly) inp.throttle = -ly; }
      else if (Math.abs(trig) > 0.05) inp.throttle = trig; else if (ly) inp.throttle = -ly;
      inp.jump = inp.jump || bt(0); inp.whip = inp.whip || bt(2); inp.superman = inp.superman || bt(3); inp.nohand = inp.nohand || bt(1);
      inp.barspin = inp.barspin || bt(5); inp.manual = inp.manual || bt(4);
      const edge = i => bt(i) && !padPrev[gp.index + ':' + i];
      if (edge(8)) resetToCheckpoint();
      if (edge(9)) togglePause();
      if (edge(3) && S.phase === 'menu') startRide();
      if (edge(12) || edge(13)) { /* d-pad reserved */ }
      if (edge(10) || edge(11)) toggleCam();
      for (let i = 0; i < gp.buttons.length; i++) padPrev[gp.index + ':' + i] = bt(i);
    }
    inp.steer = clamp(inp.steer, -1, 1); inp.throttle = clamp(inp.throttle, -1, 1);
    return inp;
  }

  // ---------------------------------------------------------------- HUD
  function buildHUD() {
    hudEl.innerHTML = `
      <div class="mr-top"><div class="mr-pill mr-time">0:00.0</div><div class="mr-pill mr-cp">CP 0/${W.checkpoints.length - 1}</div></div>
      <div class="mr-prog"><i></i>${W.checkpoints.slice(1).map(c => `<em style="left:${(c.i - W.path.start) / (W.path.finish - W.path.start) * 100}%"></em>`).join('')}</div>
      <div class="mr-score"><span>Tricks</span><b>0</b></div>
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
    for (const [k, sel] of Object.entries({ time: '.mr-time', cp: '.mr-cp', prog: '.mr-prog i', score: '.mr-score b', speed: '.mr-speed b', trick: '.mr-trick', trickT: '.mr-trick .t', trickP: '.mr-trick .p', air: '.mr-airname', msg: '.mr-msg' })) H[k] = hudEl.querySelector(sel);
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
    const btns = [['whip', 'Tail<br>whip'], ['bar', 'Bar<br>spin'], ['reset', '↺<br>Reset'], ['sup', 'Super<br>man'], ['noh', 'No<br>hands'], ['man', 'Man<br>ual']];
    box.innerHTML = btns.map(([k, l]) => `<button class="mr-tb ${k}" data-k="${k}">${l}</button>`).join('') + '<button class="mr-tb jump" data-k="jump">JUMP</button>';
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
    const best = prefs.best[S.map];
    const sw = (kind, list, cur) => list.map((c, i) => `<button class="mr-sw${i === cur ? ' on' : ''}" data-kind="${kind}" data-i="${i}" style="background:#${c.toString(16).padStart(6, '0')}" aria-label="colour"></button>`).join('');
    ui.innerHTML = `<div class="ui-overlay"><div class="ui-panel wide">
      <div class="ui-kicker">Downhill</div><h1 class="ui-title">Mountain Rush</h1>
      <div class="mr-maps">
        <button class="mr-map on">${mapPic('#9fc3d4', '#3f6b45', '#2c4a30', '#7a5634')}<div class="nm">${MAPS[S.map].name}<small>${MAPS[S.map].sub}</small></div></button>
        <button class="mr-map" disabled>${mapPic('#f2c48d', '#b5532c', '#8a3b1d', '#c9824b')}<div class="nm">Red Rock<small>Coming soon</small></div></button>
        <button class="mr-map" disabled>${mapPic('#cfe0ee', '#f5f8fb', '#9fb3c2', '#6d7f8c')}<div class="nm">Snow Peak<small>Coming soon</small></div></button>
      </div>
      ${best ? `<div class="mr-best">Best: ${fmt(best.time)} · ${best.score.toLocaleString()} trick points</div>` : ''}
      <div class="ui-label">Bike</div><div class="mr-swatches">${sw('frame', COLORS.frame, prefs.look.frame)}</div>
      <div class="ui-label">Jersey</div><div class="mr-swatches">${sw('jersey', COLORS.jersey, prefs.look.jersey)}</div>
      <div class="ui-label">Graphics</div>
      <div class="ui-seg mr-q">${['low', 'mid', 'high'].map(q => `<button data-q="${q}" class="${Q.name === q ? 'on' : ''}">${q === 'low' ? 'Fast' : q === 'mid' ? 'Good' : 'Best'}</button>`).join('')}</div>
      <div class="ui-row"><button class="ui-btn go big mr-go">Ride!</button></div>
      ${controlsHTML()}
    </div></div>`;
    click(ui.querySelector('.mr-go'), startRide);
    ui.querySelectorAll('.mr-sw').forEach(b => click(b, () => {
      prefs.look[b.dataset.kind] = +b.dataset.i; savePrefs();
      bike.setLook(lookColors());
      ui.querySelectorAll(`.mr-sw[data-kind="${b.dataset.kind}"]`).forEach(x => x.classList.toggle('on', x === b));
    }));
    ui.querySelectorAll('.mr-q button').forEach(b => click(b, () => {
      if (b.dataset.q === Q.name) return;
      prefs.quality = b.dataset.q; savePrefs(); Q = QUALITY[b.dataset.q];
      build();
    }));
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
      <kbd>Stick</kbd><span>Steer. Up = pedal, down = brake. In the air: flip and spin</span>
      <kbd>Jump</kbd><span>Hold to crouch, let go to pop. Pop at the top of a jump to go higher</span>
      <kbd>Tricks</kbd><span>In the air: Tailwhip, Barspin, Superman, No hands. Let go before you land!</span>
      <kbd>↺</kbd><span>Back to the last checkpoint</span></div>`;
    return `<div class="ui-label">How to ride</div><div class="mr-keys">
      <kbd>W A S D</kbd><span>or arrows: pedal, brake, steer. In the air: flip (W/S) and spin (A/D)</span>
      <kbd>Space</kbd><span>Hold to crouch, let go to jump. Pop at the lip to go higher</span>
      <kbd>J K L I</kbd><span>Air tricks: Tailwhip, Superman, No hander, Barspin. Let go before landing!</span>
      <kbd>Q / Shift</kbd><span>Manual (wheelie). Balance with W/S</span>
      <kbd>R</kbd><span>Back to the last checkpoint &nbsp; <kbd>T</kbd> restart from the top &nbsp; <kbd>C</kbd> camera</span>
      <kbd>🎮</kbd><span>Gamepad works too: stick, triggers, A jump, X Y B RB tricks</span></div>`;
  }

  function startRide() {
    if (!W) return;
    initAudio();
    buildHUD(); hudRefs();
    restartRun();
    S.phase = 'ride';
  }
  function restartRun() {
    placeAt(rider, W, W.start);
    S.time = 0; S.timing = false; S.score = 0; S.cp = 0; S.finished = false; S.crashT = 0;
    snapCamera();
    if (H.score) { H.score.textContent = '0'; H.cp.textContent = `CP 0/${W.checkpoints.length - 1}`; }
    if (S.phase === 'ride' || S.phase === 'done') { S.phase = 'ride'; if (ui.querySelector('.ui-overlay')) buildHUD(), hudRefs(); }
  }
  function resetToCheckpoint() {
    if (S.phase !== 'ride') return;
    if (S.finished) { restartRun(); return; }
    const c = W.checkpoints[S.cp];
    placeAt(rider, W, c);
    S.crashT = 0;
    snapCamera();
  }
  function togglePause() {
    if (S.phase === 'ride') {
      S.phase = 'paused';
      const ov = document.createElement('div');
      ov.className = 'ui-overlay mr-pausepanel';
      ov.innerHTML = `<div class="ui-panel"><div class="ui-kicker">Mountain Rush</div><h2 class="ui-title">Paused</h2>
        <div class="ui-row"><button class="ui-btn go mr-res1">Resume</button><button class="ui-btn mr-res2">Restart</button><button class="ui-btn ghost mr-res3">Menu</button></div>${controlsHTML()}</div>`;
      ui.appendChild(ov);
      click(ov.querySelector('.mr-res1'), togglePause);
      click(ov.querySelector('.mr-res2'), () => { ov.remove(); S.phase = 'ride'; restartRun(); });
      click(ov.querySelector('.mr-res3'), () => { menu(); placeAt(rider, W, W.start); snapCamera(); });
    } else if (S.phase === 'paused') {
      const ov = ui.querySelector('.mr-pausepanel'); if (ov) ov.remove();
      S.phase = 'ride';
    }
  }
  function toggleCam() { prefs.cam = prefs.cam === 'chase' ? 'helmet' : 'chase'; savePrefs(); }

  function finishRun() {
    S.finished = true; S.timing = false;
    const best = prefs.best[S.map];
    const newBest = !best || S.time < best.time;
    const newScore = !best || S.score > (best.score || 0);
    prefs.best[S.map] = { time: newBest ? S.time : best.time, score: Math.max(S.score, best ? best.score : 0) };
    savePrefs();
    snd('finish');
    setTimeout(() => {
      if (!alive || !S.finished) return;
      S.phase = 'done';
      const ov = document.createElement('div'); ov.className = 'ui-overlay';
      ov.innerHTML = `<div class="ui-panel"><div class="ui-kicker">${W.name}</div><h2 class="ui-title">Finished!</h2>
        <div class="mr-res"><div><span>Time</span><b>${fmt(S.time)}</b>${newBest ? '<span>Best!</span>' : ''}</div><div><span>Tricks</span><b>${S.score.toLocaleString()}</b>${newScore && S.score ? '<span>Best!</span>' : ''}</div><div><span>Best time</span><b>${fmt(prefs.best[S.map].time)}</b></div></div>
        <div class="ui-row"><button class="ui-btn go big mr-again">Ride again</button><button class="ui-btn ghost mr-menu">Menu</button></div></div>`;
      ui.appendChild(ov);
      click(ov.querySelector('.mr-again'), () => { ov.remove(); S.phase = 'ride'; restartRun(); });
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
  const vis = { roll: 0, manual: 0, up: new THREE.Vector3(0, 1, 0) };
  const crashSim = { bike: null, rider: null };
  function placeBike(dt) {
    const b = rider;
    if (b.crashed && crashSim.bike) { drawCrash(dt); return; }
    bikeFrame(b, frameOut);
    const fwd = frameOut.fwd, up = frameOut.up;
    // lean into turns
    const targetRoll = b.ground ? clamp(b.steer * Math.min(1, b.speed / 9) * 0.55, -0.6, 0.6) : vis.roll * 0.95;
    vis.roll = lerp(vis.roll, targetRoll, 1 - Math.exp(-dt * 8));
    up.applyAxisAngle(fwd, vis.roll);
    vis.manual = lerp(vis.manual, b.manual ? 0.42 + b.manualBal * 0.12 : 0, 1 - Math.exp(-dt * 10));
    xAxis.crossVectors(up, fwd).normalize();
    m4.makeBasis(xAxis, up, fwd);
    if (b.ground) m4.setPosition(b.pos.x, b.pos.y, b.pos.z);
    else {
      const c = b.takeoffUp;
      const com = new THREE.Vector3(b.pos.x + c.x * COM, b.pos.y + c.y * COM, b.pos.z + c.z * COM);
      mA.makeTranslation(0, -COM, 0);
      m4.setPosition(com).multiply(mA);
    }
    if (vis.manual > 0.01) {
      mA.makeTranslation(0, 0, -0.62); mB.makeRotationX(-vis.manual);
      m4.multiply(mA).multiply(mB); mA.makeTranslation(0, 0, 0.62); m4.multiply(mA);
    }
    bike.root.matrix.copy(m4); bike.root.matrixWorldNeedsUpdate = true;
    bike.rider.matrix.copy(m4); bike.rider.matrixWorldNeedsUpdate = true;
    bike.pose({ steer: b.steer, crouch: b.crouch * 0.8 + (b.ground ? clamp(b.speed / 25, 0, 0.3) : 0.15), lean: b.ground ? 0 : -b.flipV * 0.03, crank: b.crank, wheel: b.wheel, superman: b.superman, nohand: b.nohand, whip: b.whipping ? b.whip : 0, bar: b.barring ? b.bar : 0, manual: vis.manual * 2 });
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
  let dustAcc = 0;
  function emitDust(dt) {
    const b = rider;
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
      const dist = 4.4 + clamp(b.speed / 18, 0, 1) * 1.2, height = 1.9;
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
  let acc = 0, last = performance.now(), airShow = 0;
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
      if (!S.timing && !S.finished && rider.progress > W.path.start) S.timing = true;
      const nextCp = W.checkpoints[S.cp + 1];
      if (nextCp && rider.progress >= nextCp.i && !rider.crashed) { S.cp++; snd('cp'); showMsg(`Checkpoint ${S.cp}  ·  ${fmt(S.time)}`); }
      if (!S.finished && rider.progress >= W.path.finish && !rider.crashed) { finishRun(); showMsg(`Finish! ${fmt(S.time)}`, 3); }
      emitDust(dt);
      // stuck? remind how to reset
      if (rider.ground && !rider.crashed && rider.speed < 0.6 && !S.finished) { S.stuckT = (S.stuckT || 0) + dt; if (S.stuckT > 3.5) { showMsg(TOUCH ? 'Stuck? Tap ↺ Reset' : 'Stuck? Press R', 2); S.stuckT = 0; } }
      else S.stuckT = 0;
    } else if (S.phase === 'menu') {
      // slow orbit round the rider at the start
      S.time += dt;
    }
    if (!(window.__mr && window.__mr.hold)) placeBike(dt);
    if (S.phase === 'menu') {
      const b = rider, a = S.time * 0.15 + 2.2;
      camera.position.set(b.pos.x + Math.sin(a) * 5.5, b.pos.y + 1.6, b.pos.z + Math.cos(a) * 5.5);
      camera.up.set(0, 1, 0);
      camera.lookAt(b.pos.x, b.pos.y + 0.8, b.pos.z);
      bike.head.visible = true;
      if (camera.fov !== 55) { camera.fov = 55; camera.updateProjectionMatrix(); }
    } else if (!(window.__mr && window.__mr.hold)) updateCamera(dt);
    scene.update(dt, camera, rider.pos);
    updateHUD(dt);
    updateAudio(dt);
    renderer.render(scene.scene, camera);
  }
  function handleEvents() {
    for (const e of rider.events) {
      if (e.type === 'trick') {
        if (S.finished) continue;
        S.score += e.pts; showTrick(e.list, e.pts, e.perfect ? 'Perfect landing!' : ''); snd('trick');
      } else if (e.type === 'land') {
        snd('land', clamp(e.v / 10, 0.2, 1));
        cam.shake = Math.min(0.25, e.v * 0.02);
        if (e.v > 3) for (let i = 0; i < Math.min(16, e.v * 1.5); i++) dustAt(rider.pos.x, rider.pos.y + 0.1, rider.pos.z, 2.5, 1.1, 1.0);
      } else if (e.type === 'crash') {
        snd('crash'); cam.shake = 0.35;
        showMsg(e.why === 'tree' ? 'Ouch! Tree!' : e.why === 'edge' ? 'Off the mountain!' : 'Crashed!', 1.4);
      } else if (e.type === 'pop') snd('pop');
    }
  }
  function updateHUD(dt) {
    if (S.phase !== 'ride' && S.phase !== 'done' || !H.time) return;
    H.time.textContent = fmt(S.time);
    H.cp.textContent = `CP ${S.cp}/${W.checkpoints.length - 1}`;
    H.score.textContent = S.score.toLocaleString();
    H.speed.textContent = Math.round(rider.speed * 3.6);
    H.prog.style.width = clamp((rider.progress - W.path.start) / (W.path.finish - W.path.start), 0, 1) * 100 + '%';
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
      if (b.superman > 0.5) parts.push('Superman');
      if (b.nohand > 0.5) parts.push('No hander');
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
    S, get rider() { return rider; }, get W() { return W; }, get scene() { return scene; }, startRide, keys, camera,
    // run the game for `sec` seconds with fixed inputs, without waiting for frames (for tests)
    sim(sec, inp = {}, stopWhen) {
      const full = { steer: 0, throttle: 0, jump: false, ...inp };
      for (let t = 0; t < sec; t += STEP) {
        const was = rider.crashed;
        stepRider(rider, W, full, STEP); handleEvents();
        if (rider.crashed && !was) startCrash();
        if (rider.crashed) { S.crashT += STEP; drawCrash(STEP); }
        else placeBike(STEP);
        updateCamera(STEP); scene.dust.update(STEP);
        if (S.crashT > 1.5) { crashSim.bike = null; resetToCheckpoint(); }
        if (stopWhen && stopWhen(rider)) break;
      }
      updateHUD(0.016);
    },
    hold: false,
  };

  return () => {
    alive = false;
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
