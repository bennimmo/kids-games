// Choo Choo Wilf – drive a steam train through a 3D world. Made for a
// 2–3 year old: hold anywhere to go, let go to slow down. Whistle button
// goes "choo choo". Ducks, cars, diggers, barriers and animals get in the
// way; the train always stops itself. Stations at the end of each stretch
// say "well done", passengers hop on and off, then the land changes.
// Files: models.js (3D models), scenery.js, world.js (track + land),
// events.js (things that happen), audio.js (sounds + speech), game.js.
import { THREE, V3, clamp, lerp, rng, makeLoco, makeTender, makeCarriage, puffTexture, emojiSprite, makeBird, MAT } from './models.js';
import { World } from './world.js';
import { createEvent } from './events.js';
import { sfx, say, stopSpeech } from './audio.js';
import { Fun } from './interact.js';
import { startLoop } from '../../js/engine/loop.js';

const VMAX = 7, ACC = 2.4, DEC = 3.0, BRAKE = 3.0;
const RAIL = 0.36;
const PASSENGERS = ['🐶', '🐱', '🐰', '🐻', '🐼', '🐷', '🐸', '🐵', '🦊', '🐯', '🐨', '🐮', '🐔', '🦁', '🐭', '🐹', '🐧', '🦄'];
const WHISTLE_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <path d="M10 22c6-12 20-16 26-8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
  <path d="M4 12c3-6 9-8 14-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
  <rect x="28" y="22" width="16" height="30" rx="3" fill="#ffca28" stroke="#8d6e00" stroke-width="2.5"/>
  <rect x="26" y="18" width="20" height="6" rx="2" fill="#ffb300" stroke="#8d6e00" stroke-width="2.5"/>
  <rect x="31" y="30" width="10" height="5" rx="1" fill="#5d4037"/>
  <rect x="24" y="50" width="24" height="8" rx="2" fill="#ffb300" stroke="#8d6e00" stroke-width="2.5"/>
  <path d="M44 40h10l4-6" fill="none" stroke="#8d6e00" stroke-width="4" stroke-linecap="round"/>
</svg>`;

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const root = document.createElement('div');
  root.className = 'cc';
  stage.appendChild(root);
  const canvas = document.createElement('canvas');
  canvas.className = 'cc-canvas';
  root.appendChild(canvas);
  const ui = document.createElement('div');
  ui.className = 'cc-ui';
  ui.innerHTML = `
    <div class="cc-prog"><div class="cc-line"></div><span class="cc-me">🚂</span><span class="cc-end">🚉</span></div>
    <div class="cc-stickers"></div>
    <button class="cc-whistle" aria-label="Whistle">${WHISTLE_SVG}</button>
    <div class="cc-hand cc-tap">👆</div>
    <div class="cc-go"><div class="cc-ring"></div><span>👆</span></div>
    <button class="cc-arrow cc-left" aria-label="Go left">⬅</button>
    <button class="cc-arrow cc-right" aria-label="Go right">➡</button>
    <div class="cc-bubble">CHOO CHOO!</div>
    <div class="cc-done"><div class="cc-star">⭐</div><div class="cc-well">Well done!</div><div class="cc-name"></div></div>
    <div class="cc-confetti"></div>`;
  root.appendChild(ui);
  const $ = q => ui.querySelector(q);
  const el = {
    me: $('.cc-me'), stickers: $('.cc-stickers'), whistle: $('.cc-whistle'), hand: $('.cc-hand'), go: $('.cc-go'),
    bubble: $('.cc-bubble'), done: $('.cc-done'), name: $('.cc-name'), confetti: $('.cc-confetti'),
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    ui.innerHTML = '<div class="cc-nogl">😢 This game needs 3D (WebGL). Try Safari or Chrome.</div>';
    return () => { css.remove(); root.remove(); };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const sky = new THREE.Color('#a8dcff');
  scene.background = sky;
  scene.fog = new THREE.Fog(sky, 75, 175);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.5, 400);

  const hemi = new THREE.HemisphereLight('#e8f6ff', '#6f8a52', 1.5);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff4e0', 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -42, right: 42, top: 42, bottom: -42, near: 1, far: 140 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const groundMat = new THREE.MeshLambertMaterial({ color: '#86c75a' });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const r = rng((Math.random() * 1e9) | 0);
  const world = new World(scene);

  // ------------------------------------------------------------------ train
  const loco = makeLoco(), tender = makeTender();
  const coach1 = makeCarriage('#1e88e5', '#ffca28'), coach2 = makeCarriage('#43a047', '#ffca28');
  const cars = [loco, tender, coach1, coach2];
  for (const c of cars) scene.add(c.group);
  const headlight = new THREE.SpotLight('#fff3c4', 0, 45, 0.55, 0.6, 1);
  headlight.position.set(0, 1.9, 2.2);
  const hlTarget = new THREE.Object3D();
  hlTarget.position.set(0, 0, 14);
  loco.group.add(headlight, hlTarget);
  headlight.target = hlTarget;

  let s = world.legs[0].S, v = 0, wheelAng = 0;
  const fA = {}, fB = {}, fT = {}, tmp = new V3(), tmp2 = new V3();
  function placeTrain() {
    let pos = s;
    for (const c of cars) {
      const half = c.len / 2, mid = pos - half;
      world.frame(mid + half * 0.7, fA); world.frame(mid - half * 0.7, fB);
      c.group.position.set((fA.x + fB.x) / 2, (fA.y + fB.y) / 2 + RAIL, (fA.z + fB.z) / 2);
      c.group.lookAt(tmp.set(fA.x, fA.y + RAIL, fA.z));
      pos = mid - half - 0.3;
    }
    for (const c of cars) for (const w of c.wheels) w.o.rotation.x = wheelAng * 0.42 / w.r;
    loco.rods.forEach((rod, i) => {
      const a = wheelAng + i * Math.PI / 2;
      rod.position.y = 0.42 + 0.17 * Math.cos(a);
      rod.position.z = 0.17 * Math.sin(a);
    });
  }

  // ------------------------------------------------------------------ smoke
  const puffs = [];
  for (let i = 0; i < 80; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTexture(), transparent: true, depthWrite: false }));
    sp.visible = false;
    scene.add(sp);
    puffs.push({ sp, life: 1, max: 1, vel: new V3(), size: 1, grow: 1, op: 0.85 });
  }
  let puffIdx = 0;
  const puffColor = new THREE.Color('#ffffff');
  function puff(pos, vx, vy, vz, size, life, grow, op = 0.85) {
    const p = puffs[puffIdx = (puffIdx + 1) % puffs.length];
    p.sp.position.copy(pos);
    p.vel.set(vx, vy, vz);
    p.life = 0; p.max = life; p.size = size; p.grow = grow; p.op = op;
    p.sp.material.color.copy(puffColor);
    p.sp.visible = true;
  }
  function chimneyPuff(big) {
    loco.group.localToWorld(tmp.copy(loco.chimney));
    puff(tmp, (r() - 0.5) * 0.5, 3.4 + r() + (big ? 1 : 0), (r() - 0.5) * 0.5, big ? 0.9 : 0.6, 1.3 + r() * 0.4, big ? 2.2 : 1.6, big ? 0.7 : 0.5);
  }
  function sidePuff() {
    for (const sd of [-1, 1]) {
      loco.group.localToWorld(tmp.set(sd * 0.8, 0.5, 1.6));
      loco.group.localToWorld(tmp2.set(sd * 3, 0.5, 1.6)).sub(tmp).multiplyScalar(0.5);
      puff(tmp, tmp2.x, 0.6, tmp2.z, 0.5, 1.0, 1.6, 0.6);
    }
  }

  // ------------------------------------------------------------------ passengers
  const seats = [];
  for (const c of [coach1, coach2]) for (const p of c.seats) seats.push({ car: c, local: p, sp: null });
  const anims = [];
  function seatPassenger(seat, sp) {
    sp.position.copy(seat.local);
    sp.scale.set(1.15, 1.15, 1);
    seat.car.group.add(sp);
    seat.sp = sp;
  }
  const randEmoji = () => PASSENGERS[(r() * PASSENGERS.length) | 0];
  for (let i = 0; i < 3; i++) seatPassenger(seats[(i * 3) % seats.length], emojiSprite(randEmoji(), 1.15));
  const waiters = new Map(); // leg.k -> [{sp, base}]
  function makeWaiters(leg) {
    const fr = world.frame(leg.S);
    const n = 2 + (r() < 0.5 ? 1 : 0), list = [];
    for (let i = 0; i < n; i++) {
      const lat = 3.3 + (i % 2) * 1.2, along = -12.5 + i * 3.6;
      const sp = emojiSprite(randEmoji(), 1.35);
      const base = new V3(fr.x + fr.nx * lat + fr.tx * along, fr.y + 0.76 + 0.7, fr.z + fr.nz * lat + fr.tz * along);
      sp.position.copy(base);
      scene.add(sp);
      list.push({ sp, base, ph: r() * 6 });
    }
    waiters.set(leg.k, list);
  }
  function jump(sp, to, dur, arc, then) { anims.push({ sp, from: sp.position.clone(), to: to.clone(), t: 0, dur, arc, then }); }

  // ------------------------------------------------------------------ events and birds
  const events = [];
  let bird = null, birdTimer = 9;
  function spawnBird(fr, beach) {
    const B = makeBird(r, beach);
    B.group.scale.setScalar(1.7);
    const side = r() < 0.5 ? -1 : 1, ahead = 14 + r() * 14;
    const p = new V3(fr.x + fr.tx * ahead - fr.nx * side * 34, fr.y + 7 + r() * 3, fr.z + fr.tz * ahead - fr.nz * side * 34);
    const vel = new V3(fr.nx * side * 7, 0, fr.nz * side * 7);
    B.group.position.copy(p);
    B.group.lookAt(tmp.copy(p).add(vel));
    scene.add(B.group);
    bird = { B, vel, t: 0, dist: 0, tapped: 0, beach };
    (beach ? sfx.gull : sfx.tweet)();
  }
  function removeBird() {
    scene.remove(bird.B.group);
    bird.B.group.traverse(o => o.geometry && o.geometry.dispose());
    bird = null;
  }

  // ------------------------------------------------------------------ stickers
  const stickers = new Map();
  function project(obj, yOff = 0.8) {
    obj.getWorldPosition(tmp); tmp.y += yOff;
    tmp.project(camera);
    const rect = canvas.getBoundingClientRect();
    return { x: (tmp.x + 1) / 2 * rect.width, y: (1 - tmp.y) / 2 * rect.height, ok: tmp.z < 1 && tmp.z > -1 };
  }
  function renderStickers() {
    el.stickers.innerHTML = [...stickers].map(([e, n]) => `<span class="cc-chip" data-e="${e}">${e}${n > 1 ? `<b>${n}</b>` : ''}</span>`).join('');
  }
  function award(emoji, obj) {
    sfx.sticker();
    const p = obj ? project(obj, 1) : { x: innerWidth / 2, y: innerHeight / 2, ok: true };
    const fly = document.createElement('div');
    fly.className = 'cc-fly';
    fly.textContent = emoji;
    fly.style.left = p.x + 'px'; fly.style.top = p.y + 'px';
    ui.appendChild(fly);
    stickers.set(emoji, (stickers.get(emoji) || 0));
    renderStickers();
    const chip = el.stickers.querySelector(`[data-e="${emoji}"]`);
    const cr = chip.getBoundingClientRect(), rr = root.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fly.style.left = (cr.left - rr.left + cr.width / 2) + 'px';
      fly.style.top = (cr.top - rr.top + cr.height / 2) + 'px';
      fly.style.transform = 'translate(-50%,-50%) scale(.6)';
    }));
    setTimeout(() => {
      fly.remove();
      stickers.set(emoji, stickers.get(emoji) + 1);
      renderStickers();
      const c2 = el.stickers.querySelector(`[data-e="${emoji}"]`);
      if (c2) c2.classList.add('pop');
    }, 950);
  }

  const fun = new Fun(scene, r, award);

  // ------------------------------------------------------------------ input
  const holds = new Set();
  let keyHold = false;
  function allTargets() {
    const t = [];
    for (const E of events) for (const x of E.targets) t.push(x);
    if (bird && !bird.tapped) t.push({ obj: bird.B.group, r: 100, tap: tapBird });
    return t;
  }
  function tapBird() {
    bird.tapped = 1;
    (bird.beach ? sfx.gull : sfx.tweet)();
    award('🐦', bird.B.group);
  }
  function findTarget(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    const x = cx - rect.left, y = cy - rect.top;
    const k = clamp(Math.min(rect.width, rect.height) / 700, 0.7, 1.4);
    let best = null, bd = Infinity;
    for (const t of allTargets()) {
      const p = project(t.obj, 0.6);
      if (!p.ok) continue;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < t.r * k && d < bd) { bd = d; best = t; }
    }
    if (best) return best;
    // things in the world: houses, trees, animals, clouds...
    const v3 = new V3();
    for (const t of world.taps()) {
      fun.pos(t, v3).project(camera);
      if (v3.z > 1 || v3.z < -1) continue;
      const d = Math.hypot((v3.x + 1) / 2 * rect.width - x, (1 - v3.y) / 2 * rect.height - y);
      const rr = (t.kind === 'cloud' ? 110 : t.kind === 'critter' ? 80 : 65) * k;
      if (d < rr && d < bd) { bd = d; best = { tap: () => fun.tap(t, { night: nightNow }) }; }
    }
    return best;
  }
  function onDown(e) {
    e.preventDefault();
    sfx.unlock();
    const t = findTarget(e.clientX, e.clientY);
    if (t) t.tap();
    holds.add(e.pointerId);
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
  }
  function onUp(e) { holds.delete(e.pointerId); }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('lostpointercapture', onUp);
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  let bubbleT = 0;
  function whistle() {
    sfx.unlock();
    sfx.whistle();
    el.whistle.classList.remove('blow'); void el.whistle.offsetWidth; el.whistle.classList.add('blow');
    for (let i = 0; i < 6; i++) setTimeout(() => {
      loco.group.localToWorld(tmp.copy(loco.whistle));
      puff(tmp, (r() - 0.5) * 0.4, 4 + r(), (r() - 0.5) * 0.4, 0.5, 1.1, 1.8, 0.95);
    }, i * 130);
    bubbleT = 1.6;
    for (const E of events) if (E.onWhistle) E.onWhistle();
  }
  el.whistle.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); whistle(); });
  function onKey(e) {
    if (e.repeat) return;
    if (e.code === 'Space' || e.code === 'ArrowUp') { keyHold = e.type === 'keydown'; sfx.unlock(); e.preventDefault(); }
    if (e.type === 'keydown' && (e.code === 'KeyW' || e.code === 'KeyH')) whistle();
  }
  addEventListener('keydown', onKey);
  addEventListener('keyup', onKey);

  // ------------------------------------------------------------------ stations
  let phase = 'station';
  let station = { leg: world.legs[0], t: 1.2, first: true, did: {} };
  let nextStation = null;
  function confetti() {
    const bits = ['⭐', '🌟', '🎉', '✨', '🎈'];
    el.confetti.innerHTML = '';
    for (let i = 0; i < 26; i++) {
      const sp = document.createElement('span');
      sp.textContent = bits[i % bits.length];
      sp.style.left = (Math.random() * 100) + '%';
      sp.style.animationDelay = (Math.random() * 0.8) + 's';
      sp.style.fontSize = (24 + Math.random() * 26) + 'px';
      el.confetti.appendChild(sp);
    }
    setTimeout(() => { el.confetti.innerHTML = ''; }, 4200);
  }
  function arrive(leg) {
    phase = 'station';
    station = { leg, t: 0, first: false, did: {} };
    v = 0;
    s = leg.S;
    sfx.toot();
    sfx.hiss();
    sidePuff();
  }
  function stationUpdate(dt) {
    const st = station, leg = st.leg, did = st.did;
    st.t += dt;
    const at = (t, key, fn) => { if (st.t >= t && !did[key]) { did[key] = true; fn(); } };
    if (!st.first) {
      at(0.4, 'yay', () => {
        el.name.textContent = leg.name;
        el.done.classList.add('show');
        sfx.yay();
        confetti();
        say(`Well done! We made it to ${leg.name}!`);
        award('⭐', loco.group);
      });
      at(0.9, 'off', () => {
        const full = seats.filter(x => x.sp);
        const w = waiters.get(leg.k) || [];
        let n = Math.min(full.length, 1 + (r() < 0.5 ? 1 : 0));
        while (seats.length - (full.length - n) < w.length && n < full.length) n++;
        for (let i = full.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [full[i], full[j]] = [full[j], full[i]]; }
        full.slice(0, n).forEach((seat, i) => setTimeout(() => {
          const sp = seat.sp;
          seat.sp = null;
          sp.getWorldPosition(tmp);
          seat.car.group.remove(sp);
          sp.position.copy(tmp);
          scene.add(sp);
          const fr = world.frame(leg.S);
          tmp2.copy(tmp).addScaledVector(new V3(fr.nx, 0, fr.nz), 3.2);
          tmp2.y = fr.y + 0.76 + 0.7;
          sfx.boing();
          jump(sp, tmp2, 0.6, 1.6, () => {
            const door = new V3(fr.x + fr.nx * 6.6 - fr.tx * 7, fr.y + 0.76 + 0.7, fr.z + fr.nz * 6.6 - fr.tz * 7);
            jump(sp, door, 1.4, 0.3, () => { anims.push({ sp, fade: true, t: 0, dur: 0.5 }); });
          });
        }, i * 450));
      });
    }
    at(st.first ? 1.4 : 2.2, 'on', () => {
      const w = waiters.get(leg.k) || [];
      waiters.delete(leg.k);
      w.forEach((wt, i) => setTimeout(() => {
        const seat = seats.find(x => !x.sp && !x.booked);
        if (!seat) { scene.remove(wt.sp); return; }
        seat.booked = true;
        const to = seat.car.group.localToWorld(seat.local.clone());
        sfx.boing();
        jump(wt.sp, to, 0.65, 1.8, () => { scene.remove(wt.sp); seat.booked = false; seatPassenger(seat, wt.sp); });
      }, i * 500));
    });
    at(st.first ? 3.2 : 4.6, 'aboard', () => { say('All aboard!'); });
    if (st.t > (st.first ? 3.6 : 6.2)) {
      el.done.classList.remove('show');
      phase = 'drive';
      while (world.legs.length <= station.leg.k + 1) world.genLeg();
      nextStation = world.legs[station.leg.k + 1];
    }
  }

  // ------------------------------------------------------------------ snow
  const SNOW_N = 700;
  const snowGeo = new THREE.BufferGeometry();
  const snowPos = new Float32Array(SNOW_N * 3);
  for (let i = 0; i < SNOW_N; i++) { snowPos[i * 3] = (Math.random() - 0.5) * 90; snowPos[i * 3 + 1] = Math.random() * 30; snowPos[i * 3 + 2] = (Math.random() - 0.5) * 90; }
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
  const snowMat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.6, map: puffTexture(), transparent: true, opacity: 0, depthWrite: false });
  const snow = new THREE.Points(snowGeo, snowMat);
  snow.frustumCulled = false;
  scene.add(snow);

  // ------------------------------------------------------------------ env colours
  const C = {
    skyDay: new THREE.Color('#a8dcff'), skyNight: new THREE.Color('#101b36'),
    glowDay: new THREE.Color('#5d7184'), glowNight: new THREE.Color('#ffd166'),
    sunDay: new THREE.Color('#fff4e0'), sunNight: new THREE.Color('#8fa6ff'),
    hemiDay: new THREE.Color('#e8f6ff'), hemiNight: new THREE.Color('#5a6fa8'),
    puffDay: new THREE.Color('#ffffff'), puffNight: new THREE.Color('#9aa6bf'),
    g1: new THREE.Color(), g2: new THREE.Color(),
  };
  let tunnelDark = 0;
  function environment(dt) {
    const bl = world.blendAt(s - 6);
    const w = bl.w;
    const night = lerp(bl.prev.night ? 1 : 0, bl.cur.night ? 1 : 0, w);
    C.g1.set(bl.prev.biome.ground); C.g2.set(bl.cur.biome.ground);
    groundMat.color.copy(C.g1).lerp(C.g2, w);
    const snowW = lerp(bl.prev.biome.snow ? 1 : 0, bl.cur.biome.snow ? 1 : 0, w);
    const tun = world.tunnelAt(s);
    const inside = tun && s > tun.s0 + 1 && s - 14 < tun.s1 ? 1 : 0;
    tunnelDark += (inside - tunnelDark) * Math.min(1, dt * 3);
    for (const t of world.tunnels) {
      const want = t === tun ? 0.22 : 1;
      t.fade += (want - t.fade) * Math.min(1, dt * 4);
      t.mat.opacity = t.fade;
      t.mat.depthWrite = t.fade > 0.97;
    }
    const dark = Math.max(night, tunnelDark * 0.7);
    sky.copy(C.skyDay).lerp(C.skyNight, night);
    scene.fog.color.copy(sky);
    hemi.intensity = lerp(1.5, 0.7, dark);
    hemi.color.copy(C.hemiDay).lerp(C.hemiNight, night);
    sun.intensity = lerp(2.6, 0.9, night) * (1 - tunnelDark * 0.6);
    sun.color.copy(C.sunDay).lerp(C.sunNight, night);
    MAT.glow.color.copy(C.glowDay).lerp(C.glowNight, night);
    headlight.intensity = Math.max(night, tunnelDark) * 70;
    puffColor.copy(C.puffDay).lerp(C.puffNight, night);
    snowMat.opacity = snowW * 0.9;
    snow.visible = snowW > 0.01;
    return { night, snowW };
  }

  // ------------------------------------------------------------------ camera
  const camDir = new V3(0, 0, -1), look = new V3(), camPos = new V3();
  let aspect = 1;
  function updateCamera(dt, snap) {
    world.frame(s - 8, fT);
    const k = snap ? 1 : Math.min(1, dt * 1.4);
    camDir.x += (fT.tx - camDir.x) * k; camDir.z += (fT.tz - camDir.z) * k;
    camDir.y = 0; camDir.normalize();
    const tall = clamp((1.3 - aspect) / 0.7, 0, 1);
    const back = lerp(11, 15, tall), high = lerp(20, 28, tall), ahead = lerp(5, 9, tall);
    const ty = fT.y + RAIL;
    const tx = fT.x + camDir.x * ahead, tz = fT.z + camDir.z * ahead;
    const want = tmp.set(fT.x - camDir.x * back, ty + high, fT.z - camDir.z * back);
    if (snap) { camPos.copy(want); look.set(tx, ty, tz); }
    else {
      camPos.lerp(want, Math.min(1, dt * 3));
      look.lerp(tmp2.set(tx, ty, tz), Math.min(1, dt * 4));
    }
    camera.position.copy(camPos);
    camera.lookAt(look);
    sun.target.position.set(look.x, 0, look.z);
    sun.position.set(look.x + 22, 45, look.z + 14);
    ground.position.set(Math.round(look.x / 10) * 10, 0, Math.round(look.z / 10) * 10);
  }

  function onResize() {
    const w = root.clientWidth || innerWidth, h = root.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = aspect = w / h;
    camera.fov = aspect < 1 ? 58 : 48;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', onResize);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(root);
  onResize();

  // ------------------------------------------------------------------ main loop
  world.buildAll(s);
  makeWaiters(world.legs[0]);
  placeTrain();
  updateCamera(0, true);

  let time = 0, chuffAcc = 0, idlePuff = 0, waitT = 0, waitE = null, stillT = 0, wasMoving = false;
  function update(dt) {
    dt *= window.__ccSpeed || 1;
    time += dt;
    world.update(s);
    const holding = holds.size > 0 || keyHold;

    // what's in the way?
    let stopAt = Infinity, blockE = null;
    if (phase === 'drive') {
      if (nextStation) stopAt = nextStation.S;
      for (const E of events) if (E.blocked) {
        const sa = E.ev.s - E.stopGap;
        if (sa > s - 0.3 && sa < stopAt) { stopAt = sa; blockE = E; }
      }
      jNext = world.junctions.find(J => !J.choice && J.s0 > s - 1) || null;
      if (jNext && jNext.s0 - 3 < stopAt) { stopAt = jNext.s0 - 3; blockE = null; }
    } else stopAt = s;
    const jBlock = !!(jNext && phase === 'drive' && stopAt === jNext.s0 - 3);
    junction(dt, jBlock);
    const dist = Math.max(0, stopAt - s);
    if (holding && phase === 'drive') v = Math.min(VMAX, v + ACC * dt);
    else v = Math.max(0, v - DEC * dt);
    // roll into the station by itself
    if (phase === 'drive' && nextStation && !blockE && nextStation.S - s < 30) v = Math.max(v, Math.min(1.8, v + ACC * dt));
    v = Math.min(v, Math.sqrt(2 * BRAKE * dist));
    const ds = Math.min(v * dt, dist);
    s += ds;
    wheelAng += ds / 0.42;
    if (phase === 'drive' && nextStation && !blockE && nextStation.S - s < 0.03) arrive(nextStation);
    if (phase === 'station') stationUpdate(dt);

    // waiting for something?
    if (blockE && blockE === waitE && v < 0.15) waitT += dt; else { waitT = 0; waitE = blockE; }
    stillT = v < 0.05 ? stillT + dt : 0;

    // steam
    chuffAcc += ds;
    const moving = v > 0.15;
    if (moving && !wasMoving) { chimneyPuff(true); sidePuff(); sfx.chuff(1); }
    if (!moving && wasMoving) sfx.hiss();
    wasMoving = moving;
    if (chuffAcc > 1.35) {
      chuffAcc = 0;
      sfx.chuff(0.35 + 0.65 * v / VMAX);
      chimneyPuff(true);
      if (v < 2.5) sidePuff();
    } else if (moving && r() < dt * 2) chimneyPuff(false);
    idlePuff -= dt;
    if (!moving && idlePuff <= 0) { idlePuff = 0.9 + r() * 0.6; loco.group.localToWorld(tmp.copy(loco.chimney)); puff(tmp, 0.2, 1.2, 0.1, 0.5, 1.8, 1.2, 0.55); }
    for (const p of puffs) {
      if (!p.sp.visible) continue;
      p.life += dt;
      const t = p.life / p.max;
      if (t >= 1) { p.sp.visible = false; continue; }
      p.sp.position.addScaledVector(p.vel, dt);
      p.vel.multiplyScalar(1 - dt * 0.9);
      p.vel.y += dt * 0.3;
      const sz = p.size + p.grow * Math.sqrt(t);
      p.sp.scale.set(sz, sz, 1);
      p.sp.material.opacity = p.op * Math.pow(1 - t, 1.4);
    }

    // events
    for (const leg of world.legs) {
      if (leg.end < s - 60 || leg.S > s + 200) continue;
      for (const ev of leg.events) if (!ev.made && ev.s < s + 140 && ev.s > s - 20) {
        ev.made = true;
        events.push(createEvent(ev, leg.biome, scene, r));
      }
      if (leg.k > 0 && !waiters.has(leg.k) && !leg.waitersMade && leg.S - s < 150 && leg.S > s) { leg.waitersMade = true; makeWaiters(leg); }
    }
    const ctx = { s, v, time, wait: 0, say, award };
    for (let i = events.length - 1; i >= 0; i--) {
      const E = events[i];
      ctx.wait = E === waitE ? waitT : 0;
      E.update(dt, ctx);
      if (s > E.ev.s + 45) { E.dispose(); events.splice(i, 1); }
    }

    // birds
    const env = environment(dt);
    nightNow = env.night;
    fun.update(dt, world.taps(), camera);
    world.frame(s, fT);
    if (!bird) {
      birdTimer -= dt;
      if (birdTimer <= 0) {
        birdTimer = 10 + r() * 14;
        if (env.night < 0.5 && tunnelDark < 0.1) spawnBird(fT, !!world.legAt(s).biome.beach);
      }
    } else {
      const b = bird;
      b.t += dt;
      const step = tmp.copy(b.vel).multiplyScalar(dt);
      b.B.group.position.add(step);
      b.dist += step.length();
      const flap = Math.sin(b.t * (b.tapped ? 22 : 13)) * 0.8;
      b.B.wings[0].rotation.z = flap; b.B.wings[1].rotation.z = -flap;
      if (b.tapped) {
        b.tapped += dt;
        b.B.group.position.y += dt * 3;
        b.vel.multiplyScalar(1 + dt * 0.6);
        b.B.group.rotateZ(dt * 7);
      } else b.B.group.position.y += Math.sin(b.t * 3) * dt * 0.6;
      if (b.dist > 72) removeBird();
    }

    // waiting passengers wave
    for (const list of waiters.values()) for (const w of list) {
      w.ph += dt * 5;
      w.sp.position.y = w.base.y + Math.abs(Math.sin(w.ph)) * 0.25;
    }
    for (let i = anims.length - 1; i >= 0; i--) {
      const a = anims[i];
      a.t += dt;
      const k = Math.min(1, a.t / a.dur);
      if (a.fade) {
        a.sp.scale.setScalar(1.35 * (1 - k));
        if (k >= 1) { scene.remove(a.sp); anims.splice(i, 1); }
        continue;
      }
      a.sp.position.lerpVectors(a.from, a.to, k);
      a.sp.position.y += Math.sin(k * Math.PI) * a.arc;
      if (k >= 1) { anims.splice(i, 1); if (a.then) a.then(); }
    }

    placeTrain();
    updateCamera(dt, false);
    snowUpdate(dt);
    hud(dt, holding, blockE);
  }

  function snowUpdate(dt) {
    if (!snow.visible) return;
    snow.position.set(look.x, look.y, look.z);
    for (let i = 0; i < SNOW_N; i++) {
      let y = snowPos[i * 3 + 1] - dt * 3.2;
      if (y < 0) y += 30;
      snowPos[i * 3 + 1] = y;
      snowPos[i * 3] += Math.sin(time + i) * dt * 0.4;
    }
    snowGeo.attributes.position.needsUpdate = true;
  }

  // ------------------------------------------------------------------ junctions: pick a way
  let jNext = null, jWait = 0, jSaid = null, nightNow = 0;
  const arrowL = ui.querySelector('.cc-left'), arrowR = ui.querySelector('.cc-right');
  function choose(side) {
    if (!jNext || jNext.choice) return;
    jNext.choice = side;
    sfx.clunk();
    say('Off we go!');
    arrowL.classList.remove('show'); arrowR.classList.remove('show');
  }
  for (const [btn, side] of [[arrowL, 1], [arrowR, -1]]) {
    btn.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); sfx.unlock(); choose(side); });
  }
  function junction(dt, jBlock) {
    const show = !!(jNext && phase === 'drive' && jNext.s0 - s < 45);
    arrowL.classList.toggle('show', show); arrowR.classList.toggle('show', show);
    if (show && jSaid !== jNext) { jSaid = jNext; say('Which way shall we go? Tap an arrow!'); }
    if (jBlock && v < 0.15) { jWait += dt; if (jWait > 25) choose(r() < 0.5 ? 1 : -1); } else jWait = 0;
  }

  function hud(dt, holding, blockE) {
    // progress to next station
    const legK = phase === 'station' ? station.leg.k : (nextStation ? nextStation.k - 1 : 0);
    const a = world.legs[legK] ? world.legs[legK].S : 0, b = world.legs[legK + 1] ? world.legs[legK + 1].S : a + 1;
    const frac = phase === 'station' ? 1 : clamp((s - a) / (b - a), 0, 1);
    el.me.style.left = (frac * 100) + '%';
    // tap hint over a thing that needs tapping
    let hint = null;
    if (blockE && blockE.needsTap && blockE.hintObj && blockE.ev.s - s < 26) hint = blockE.hintObj;
    if (hint) {
      const p = project(hint, 1.8);
      el.hand.style.left = p.x + 'px'; el.hand.style.top = p.y + 'px';
      el.hand.classList.add('show');
    } else el.hand.classList.remove('show');
    // hold-to-go hint
    const showGo = phase === 'drive' && !holding && v < 0.1 && !blockE && stillT > 1.2 && !arrowL.classList.contains('show');
    el.go.classList.toggle('show', showGo);
    // CHOO CHOO bubble
    if (bubbleT > 0) {
      bubbleT -= dt;
      const p = project(loco.group, 3.2);
      el.bubble.style.left = p.x + 'px'; el.bubble.style.top = p.y + 'px';
      el.bubble.classList.add('show');
    } else el.bubble.classList.remove('show');
  }

  const stopLoop = startLoop(update, () => renderer.render(scene, camera));
  window.__ccFind = kind => {
    const v3 = new V3(), rect = canvas.getBoundingClientRect();
    for (const t of world.taps()) if (t.kind === kind) {
      fun.pos(t, v3).project(camera);
      const x = (v3.x + 1) / 2 * rect.width, y = (1 - v3.y) / 2 * rect.height;
      if (x > 100 && x < rect.width - 140 && y > 90 && y < rect.height - 130 && v3.z < 1) return { x, y };
    }
    return null;
  };
  window.__ccJump = to => { s = to; world.buildAll(s); };
  window.__cc = () => ({ nextS: nextStation && nextStation.S, s, v, phase, leg: world.legIndexAt(s), waitFor: waitE && waitE.ev.type, stickers: [...stickers] });

  return () => {
    stopLoop();
    stopSpeech();
    delete window.__cc;
    delete window.__ccJump;
    delete window.__ccFind;
    removeEventListener('resize', onResize);
    removeEventListener('keydown', onKey);
    removeEventListener('keyup', onKey);
    if (ro) ro.disconnect();
    for (const E of events) E.dispose();
    fun.dispose();
    world.disposeAll();
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    renderer.dispose();
    renderer.forceContextLoss();
    root.remove();
    css.remove();
  };
}
