// Sky Pilot: missions. Solo, or with friends in a "Play with friends" room (never strangers).
//
// How friends play together:
//  - The host (or you, solo) picks a mission. It goes into the room meta as
//    mission = { id, n, seed, at, who, fires?, over? }   (n = run number, at = start time on the server clock)
//  - Every device builds the same rings / fires from the seed, counts down to `at`, and plays.
//  - Each device scores itself and sends its progress with its plane: ms = { n, sc, k, dn, t, h, dr }.
//  - Fire Fight is shared: water drops (dr) go to the host, who puts the fires out and writes their
//    strength back into the meta (fires). The host also decides when the mission is over.
//
// ctx (from game.js): { scene, root, me(), easy(), now(), myUid(), inRoom(), isHost(), setMeta(m),
//   others() -> [{ uid, name, color, ms }], myName(), placeMe(spot, type?), flash(text), sound, invite(), hostName() }
import * as THREE from '../../js/vendor/three.module.min.js';
import { PLANES } from './planes.js';
import { AIRPORTS, TOWNS, LANDMARKS, LAKE, terrainHeight, surfaceAt, runwayPoint, runwayLocal, biomeAt } from './island.js';
import { rng, clamp } from './noise.js';

export const MISSIONS = [
  { id: 'rings', name: 'Ring Race', icon: '⭕', tag: '🏁 Race', desc: 'Fly through the middle of each ring. Closer to the middle = more points. Missed one? Keep going!' },
  { id: 'fire', name: 'Fire Fight', icon: '🔥', tag: '👫 Team', desc: 'Skim the lake in the Splash to fill up with water, then drop it on the forest fires.' },
  { id: 'paper', name: 'Paper Plane', icon: '📄', tag: '🕊️ Glide', desc: 'No engine! Glide low through hoops over forests and hills, as far as you can. Space / 🚀 = boost. Hoops refill it.' },
  { id: 'land', name: 'Landing Contest', icon: '🛬', tag: '🏁 Contest', desc: 'Three landings. Soft, on the green box, in the middle and straight wins.' },
];
const DEF = Object.fromEntries(MISSIONS.map(m => [m.id, m]));
const D = Math.PI / 180;
const BEST_KEY = 'sky-pilot-missions';
const esc = s => String(s ?? '').replace(/[&<>"']/g, '');
const loadBest = () => { try { return JSON.parse(localStorage.getItem(BEST_KEY) || '{}') || {}; } catch (e) { return {}; } };
const bearing = (dx, dz) => Math.atan2(dx, -dz);
const hdgOf = (dx, dz) => (Math.atan2(dx, -dz) + Math.PI * 2) % (Math.PI * 2);

// ---------------------------------------------------------------- shared textures
function canvasTex(size, draw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const targetTex = () => canvasTex(256, (g, S) => {
  const bands = [[1, '#1e88e5', '1'], [0.75, '#ffffff', '3'], [0.5, '#e53935', '6'], [0.25, '#ffd54f', '10']];
  for (const [r, col] of bands) { g.fillStyle = col; g.beginPath(); g.arc(S / 2, S / 2, r * S / 2 - 1, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#10223a'; g.font = '900 22px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const [r, , label] of bands) g.fillText(label, S / 2, S / 2 - (r - 0.125) * S / 2);
});
const fireTex = () => canvasTex(64, (g, S) => {
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(255,250,200,1)'); gr.addColorStop(0.35, 'rgba(255,170,40,.9)'); gr.addColorStop(0.7, 'rgba(230,60,10,.45)'); gr.addColorStop(1, 'rgba(200,30,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
});
const dropTex = () => canvasTex(32, (g, S) => {
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(200,235,255,.7)'); gr.addColorStop(1, 'rgba(160,210,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
});

// ---------------------------------------------------------------- Ring Race course (same on every device: from the seed)
function places() {
  const list = [
    ...AIRPORTS.map(a => ({ x: a.x, z: a.z, name: a.icon + ' ' + a.name })),
    ...TOWNS.map(t => ({ x: t.x, z: t.z, name: '🏘️ ' + t.name })),
    ...LANDMARKS.map(l => ({ x: l.x, z: l.z, name: l.icon + ' ' + l.name })),
    { x: LAKE.x, z: LAKE.z, name: '🦆 Duck Lake' },
  ];
  return list.filter(p => terrainHeight(p.x, p.z) < 320);
}
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), z: f(p0.z, p1.z, p2.z, p3.z) };
}
export function makeCourse(seed) {
  const pool = places();
  const r = rng(seed);
  let best = null;
  for (let attempt = 0; attempt < 60; attempt++) {
    const used = new Set(), way = [];
    let cur = r.pick(pool); used.add(cur); way.push(cur);
    let dir = null, ok = true;
    for (let leg = 0; leg < 3; leg++) {
      const cand = pool.filter(p => {
        if (used.has(p)) return false;
        const d = Math.hypot(p.x - cur.x, p.z - cur.z);
        if (d < 2300 || d > 5200) return false;
        if (!dir) return true;
        const a = Math.atan2(p.z - cur.z, p.x - cur.x) - dir;
        return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 105 * D;
      });
      if (!cand.length) { ok = false; break; }
      const nx = r.pick(cand);
      dir = Math.atan2(nx.z - cur.z, nx.x - cur.x);
      used.add(nx); way.push(nx); cur = nx;
    }
    if (!ok) continue;
    // smooth path through the places, a ring every ~600 m
    const pts = [];
    const W = [{ x: 2 * way[0].x - way[1].x, z: 2 * way[0].z - way[1].z }, ...way, { x: 2 * way[3].x - way[2].x, z: 2 * way[3].z - way[2].z }];
    for (let i = 1; i < W.length - 2; i++) for (let k = 0; k < 40; k++) pts.push(catmull(W[i - 1], W[i], W[i + 1], W[i + 2], k / 40));
    pts.push({ x: way[3].x, z: way[3].z });
    const rings = [];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
      if (acc >= 600) { acc = 0; rings.push({ x: pts[i].x, z: pts[i].z }); }
    }
    if (rings.length < 12 || rings.length > 24) continue;
    // height: clear the ground under and before each ring, then smooth (gentle climbs)
    rings.forEach((g, i) => {
      const prev = i ? rings[i - 1] : { x: g.x - (rings[1].x - g.x), z: g.z - (rings[1].z - g.z) };
      let top = 0;
      for (let k = 0; k <= 8; k++) for (const sd of [-160, 0, 160]) {
        const x = prev.x + (g.x - prev.x) * k / 8, z = prev.z + (g.z - prev.z) * k / 8;
        const dx = g.z - prev.z, dz = -(g.x - prev.x), l = Math.hypot(dx, dz) || 1;
        top = Math.max(top, terrainHeight(x + dx / l * sd, z + dz / l * sd));
      }
      g.y = Math.max(top, 0) + 75;
    });
    for (let i = rings.length - 2; i >= 0; i--) rings[i].y = Math.max(rings[i].y, rings[i + 1].y - 45);
    for (let i = 1; i < rings.length; i++) rings[i].y = Math.max(rings[i].y, rings[i - 1].y - 70);
    const maxY = Math.max(...rings.map(g => g.y));
    const score = (maxY > 600 ? 1000 : 0) + Math.abs(rings.length - 18);
    if (!best || score < best.score) best = { score, rings, way };
    if (score < 4) break;
  }
  const rings = best.rings;
  rings.forEach((g, i) => {
    const a = rings[Math.max(0, i - 1)], b = rings[Math.min(rings.length - 1, i + 1)];
    const n = new THREE.Vector3(b.x - a.x, (b.y - a.y) * 0.5, b.z - a.z).normalize();
    g.c = new THREE.Vector3(g.x, g.y, g.z); g.n = n;
  });
  return { rings, way: best.way };
}

// ---------------------------------------------------------------- Fire Fight fires (from the seed)
export function makeFires(seed, count) {
  const r = rng(seed ^ 0x5f17e);
  const out = [];
  for (let tries = 0; out.length < count && tries < 4000; tries++) {
    const a = r() * Math.PI * 2, d = r.range(1150, 3000);
    const x = LAKE.x + Math.cos(a) * d, z = LAKE.z + Math.sin(a) * d;
    const h = terrainHeight(x, z);
    if (h < 4 || h > 320 || surfaceAt(x, z).kind !== 'land') continue;
    if (tries < 2500 && biomeAt(x, z) !== 'forest') continue;
    if (out.some(f => Math.hypot(f.x - x, f.z - z) < 420)) continue;
    out.push({ x, z, y: h });
  }
  return out;
}

// ---------------------------------------------------------------- Landing Contest rounds
// (only approaches with no hills in the way)
const ROUNDS = ['main', 'desert', 'forest'];
const DIRS = { main: [1], desert: [1], forest: [1, -1] };
function landSpot(round, seed, idx, n, type, easy) {
  const ap = AIRPORTS.find(a => a.id === ROUNDS[round]) || AIRPORTS[0];
  const dir = rng(seed + round * 7).pick(DIRS[ap.id] || [1]);
  const P = PLANES[type], heli = P.kind === 'heli';
  const back = heli ? 800 : easy ? 1800 : 2600;
  const side = (idx - (n - 1) / 2) * 22;
  const [x, z] = runwayPoint(ap, dir * (-ap.len / 2 - back), side);
  const hdg = ap.hdg + (dir < 0 ? Math.PI : 0);
  const y = Math.max(ap.elev + (heli ? 90 : Math.tan(3 * D) * (back + 300)), terrainHeight(x, z) + 50) + P.gearH;
  const aim = runwayPoint(ap, dir * (-ap.len / 2 + 300), 0);
  return { ap, dir, hdg, spot: { x, z, y, hdg, air: true, speed: heli ? 22 : P.vref * 1.25 }, aim: { x: aim[0], z: aim[1] } };
}


// hoop materials: solid lit rings (proper depth with clouds), see-through targets drawn after the clouds
function hoopMats(tex) {
  const ring = (color, glow) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: glow, roughness: 0.45, metalness: 0.1 });
  const disc = op => new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
  return { next: ring(0xffd54f, 0.75), far: ring(0xe8eef5, 0.25), finish: ring(0x66ff88, 0.6), discNext: disc(0.5), discFar: disc(0.14) };
}

// ================================================================= controller
export function createMissions(ctx) {
  const { scene } = ctx;
  const box = document.createElement('div');
  box.className = 'sp-mis';
  box.innerHTML = `<div class="sp-mpanel"><div class="sp-mtitle"></div><div class="sp-mline"></div>
      <div class="sp-mgo"><i class="sp-marrow">⬆️</i><span class="sp-mdist"></span></div><div class="sp-mboard"></div></div>
    <div class="sp-mcount"></div><div class="sp-mcard"></div><div class="sp-mov"></div>`;
  ctx.root.insertBefore(box, ctx.before || null);
  const q = s => box.querySelector(s);
  const H = { panel: q('.sp-mpanel'), title: q('.sp-mtitle'), line: q('.sp-mline'), go: q('.sp-mgo'), arrow: q('.sp-marrow'), dist: q('.sp-mdist'), board: q('.sp-mboard'), count: q('.sp-mcount'), card: q('.sp-mcard'), ov: q('.sp-mov') };
  const setText = (el, t) => { if (el._t !== t) { el._t = t; el.textContent = t; } };
  const setHTML = (el, t) => { if (el._h !== t) { el._h = t; el.innerHTML = t; } };

  const tex = { target: targetTex(), fire: fireTex(), drop: dropTex(), marker: canvasTex(128, (g, S) => {
    g.fillStyle = 'rgba(180,30,10,.85)'; g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 6, 0, 7); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 8; g.stroke();
    g.font = '72px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🔥', S / 2, S / 2 + 4);
  }) };
  let run = null;          // the mission being played
  let pending = null;      // meta seen while not flying
  let closedN = 0;         // run number we've closed (don't restart it)
  let flying = false;
  let pickerOpen = false;
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

  // water drops in the air (gravity)
  const drops = [];
  const dropMat = new THREE.SpriteMaterial({ map: tex.drop, transparent: true, depthWrite: false, opacity: 0.85 });
  for (let i = 0; i < 70; i++) { const sp = new THREE.Sprite(dropMat); sp.visible = false; scene.add(sp); drops.push({ sp, vel: new THREE.Vector3(), life: 0 }); }
  let dropNext = 0;

  // ------------------------------------------------------------ meta in (from the room, or straight from us when solo)
  function onMeta(m) {
    if (!m || !DEF[m.id]) { if (run) endRun(); pending = null; closeOverlay(); return; }
    if (!flying) { pending = m; return; }
    if (run && run.n === m.n) { run.m = m; if (m.over && run.phase !== 'over') showResults(); return; }
    if (m.n === closedN) return;
    if (m.over) { closedN = m.n; return; }
    startRun(m);
  }

  function startMission(id) {
    if (!ctx.isHost()) return;
    const now = ctx.now();
    const uids = [ctx.myUid(), ...ctx.others().map(o => o.uid)];
    const who = [...new Set(uids)].sort();
    const m = { id, n: (Math.floor(now / 1000) % 1e8) * 10 + Math.floor(Math.random() * 10), seed: Math.floor(Math.random() * 1e9), at: now + 4500, who };
    if (id === 'fire') m.fires = Array(Math.min(10, 3 + 2 * who.length)).fill(100);
    closeOverlay(); pickerOpen = false;
    ctx.setMeta(m);
  }
  function stopMission() { if (ctx.isHost()) ctx.setMeta(null); else { if (run) closedN = run.n; endRun(); closeOverlay(); } }

  // ------------------------------------------------------------ a run
  function startRun(m) {
    if (run) endRun();
    closeOverlay();
    const def = DEF[m.id];
    const me = ctx.myUid();
    const who = Array.isArray(m.who) ? m.who : [me];
    const idx = Math.max(0, who.indexOf(me));
    const part = who.includes(me) || m.id === 'fire';
    run = { m, def, n: m.n, who, idx, part, phase: 'count', sc: 0, k: 0, dn: 0, t: 0, h: 0, dr: [], drId: 0, group: new THREE.Group(), lastSec: -1, endCheck: 0, pushT: 0, fx: [] };
    scene.add(run.group);
    if (m.id === 'rings') setupRings(); else if (m.id === 'fire') setupFire(); else if (m.id === 'paper') setupPaper(); else setupLand();
    if (!part) ctx.flash('👀 Watching. Join the next one!');
    H.panel.classList.add('show');
    box.classList.toggle('sp-mfire', m.id === 'fire');
  }
  function endRun() {
    if (!run) return;
    scene.remove(run.group);
    run.group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material !== dropMat && !o.material._shared) o.material.dispose(); });
    const p = ctx.me();
    if (p && p.model.parts.doors) p.model.parts.doors.forEach(d => { d.rotation.z = 0; });
    const paperDown = run.def.id === 'paper' && p && p.s.P.kind === 'paper' && p.s.onGround;
    run = null;
    if (paperDown) ctx.respawnMe();               // back up into the sky for free flying
    H.panel.classList.remove('show'); H.count.textContent = ''; H.card.classList.remove('show');
    box.classList.remove('sp-mfire');
  }
  const elapsed = () => Math.max(0, (ctx.now() - run.m.at) / 1000);
  const fmtT = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  // ------------------------------------------------------------ Ring Race
  function ringR(p) { const P = p.s.P; return Math.max(30, P.span * 1.8) * (ctx.easy() ? 1.35 : 1); }
  function setupRings() {
    const course = makeCourse(run.m.seed);
    run.rings = course.rings;
    const p = ctx.me();
    const R = ringR(p);
    run.R = R;
    const torusG = new THREE.TorusGeometry(1, 0.07, 8, 48), discG = new THREE.CircleGeometry(1, 48);
    run.mat = hoopMats(tex.target);
    run.rings.forEach((g, i) => {
      const grp = new THREE.Group();
      const torus = new THREE.Mesh(torusG, i === run.rings.length - 1 ? run.mat.finish : run.mat.far);
      const disc = new THREE.Mesh(discG, run.mat.discFar); disc.renderOrder = 8;
      grp.add(torus, disc);
      grp.position.copy(g.c); grp.lookAt(v1.copy(g.c).add(g.n)); grp.scale.setScalar(R);
      run.group.add(grp); g.obj = grp; g.torus = torus; g.disc = disc;
    });
    highlightRing();
    run.spot = ringStart(-1);
    if (run.part) ctx.placeMe(run.spot);
    run.prev = ctx.me().s.pos.clone();
  }
  function ringStart(k) {
    // just before ring k+1, side by side
    const g = run.rings[Math.max(0, k + 1)] || run.rings[run.rings.length - 1];
    const n = v1.set(g.n.x, 0, g.n.z).normalize();
    const n2 = run.who.length, side = (run.idx - (n2 - 1) / 2) * 50;
    const back = k < 0 ? 700 : 450;
    const x = g.c.x - n.x * back - n.z * side, z = g.c.z - n.z * back + n.x * side;
    const P = ctx.me().s.P;
    return { x, z, y: Math.max(g.c.y, terrainHeight(x, z) + 60), hdg: hdgOf(n.x, n.z), air: true, speed: P.kind === 'heli' ? 30 : P.vref * 1.45 };
  }
  function highlightRing() {
    run.rings.forEach((g, i) => {
      const last = i === run.rings.length - 1;
      g.obj.visible = i >= run.k;
      g.torus.material = i === run.k ? (last ? run.mat.finish : run.mat.next) : last ? run.mat.finish : run.mat.far;
      g.disc.material = i === run.k ? run.mat.discNext : run.mat.discFar;
    });
  }
  function updateRings(dt, p) {
    const s = p.s, pos = s.pos;
    if (!run.part || run.dn) { run.prev.copy(pos); return ringTarget(); }
    const g = run.rings[run.k];
    if (g && !s.crashed) {
      const d0 = v1.copy(run.prev).sub(g.c).dot(g.n), d1 = v2.copy(pos).sub(g.c).dot(g.n);
      if (d0 < 0 && d1 >= 0) {
        const f = d0 / (d0 - d1);
        const hit = v1.copy(run.prev).lerp(pos, f);
        const lat = hit.distanceTo(g.c);
        if (lat < 1500) {
          const fr = lat / run.R;
          const pts = fr < 0.25 ? 10 : fr < 0.5 ? 6 : fr < 0.75 ? 3 : fr < 1 ? 1 : 0;
          run.sc += pts; run.k++;
          if (pts === 10) { ctx.flash('🎯 10! Bullseye!'); ctx.sound.win(); }
          else if (pts) { ctx.flash(`⭕ ${pts} point${pts > 1 ? 's' : ''}`); ctx.sound.tone(400 + pts * 60, 0.15, 'triangle', 0.1, 700 + pts * 60); }
          else { ctx.flash('❌ Missed! Keep going ➡️'); ctx.sound.bump(); }
          run.spot = ringStart(run.k - 1);
          if (run.k >= run.rings.length) { run.dn = 1; run.t = elapsed(); ctx.flash(`🏁 Finished! ${run.sc} points`); ctx.sound.win(); }
          highlightRing();
        }
      }
    }
    run.prev.copy(pos);
    // the next ring gently pulses
    const nx = run.rings[run.k];
    if (nx) nx.torus.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.04);
    return ringTarget();
  }
  const ringTarget = () => { const g = run.rings[Math.min(run.k, run.rings.length - 1)]; return g ? { x: g.c.x, z: g.c.z } : null; };

  // ------------------------------------------------------------ Paper Plane: endless hoops, glide as far as you can
  const PAPER = { gap: 200, drop: 18, rise: 16 };
  function setupPaper() {
    const r = rng(run.m.seed ^ 0x9a9e7);
    run.prng = r;
    // start low over the forests and foothills, where there's lots to fly around
    let sx = LAKE.x, sz = LAKE.z, sh = 0;
    for (let i = 0; i < 300; i++) {
      const x = r.range(-12000, 9000), z = r.range(-9000, 9000), h = terrainHeight(x, z), b = biomeAt(x, z);
      if ((b === 'forest' || b === 'mountain') && h > 30 && h < 450) { sx = x; sz = z; sh = r() * Math.PI * 2; break; }
    }
    let top = 0;
    for (const [dx, dz] of [[0, 0], [100, 0], [-100, 0], [0, 100], [0, -100]]) top = Math.max(top, terrainHeight(sx + dx, sz + dz));
    run.visited = new Map();
    run.cur = { x: sx, z: sz, y: Math.max(0, top) + 130, hdg: sh };
    run.hoops = []; run.dist = 0; run.hpts = 0;
    run.mat = hoopMats(tex.target);
    run.geo = { torus: new THREE.TorusGeometry(1, 0.08, 8, 40), disc: new THREE.CircleGeometry(1, 40) };
    const c0 = run.cur, n2 = run.who.length, side = (run.idx - (n2 - 1) / 2) * 30;
    run.spot = { x: c0.x - Math.cos(c0.hdg) * side, z: c0.z - Math.sin(c0.hdg) * side, y: c0.y + 10, hdg: c0.hdg, air: true, speed: 24 };
    paperFill();
    if (run.part) ctx.placeMe(run.spot, 'paper');
    run.prev = ctx.me().s.pos.clone();
  }
  // the next hoop: wander low over the land, through the valleys, round the hills, never into one
  function paperGen() {
    const r = run.prng, c = run.cur, easy = ctx.easy();
    const i = run.hoops.length;
    const R = (easy ? 32 : 24) * Math.max(0.75, 1 - i * 0.004);
    const floorOf = top => top + R + (easy ? 12 : 7);
    const away = Math.hypot(c.x, c.z - 1500) > 9500 || terrainHeight(c.x, c.z) < 0.3;
    // high above the ground: dive down faster (up to ~12°) to get back amongst the trees
    const dropFor = top => clamp((c.y - floorOf(top)) * 0.2, PAPER.drop, 42);
    const toC = Math.atan2(-c.x, -(1500 - c.z));
    const look = (h, wide) => {
      const x = c.x + Math.sin(h) * PAPER.gap, z = c.z - Math.cos(h) * PAPER.gap;
      let top = 0;
      for (let q = 0; q <= 8; q++) for (const sd of [-25, 0, 25]) {
        const px = c.x + (x - c.x) * q / 8 + Math.cos(h) * sd, pz = c.z + (z - c.z) * q / 8 + Math.sin(h) * sd;
        top = Math.max(top, terrainHeight(px, pz));
      }
      top = Math.max(top, 0);
      // how high is it further on that way? (don't fly into a mountain bowl)
      let ahead = 0;
      for (let q = 2; q <= 6; q++) ahead = Math.max(ahead, terrainHeight(c.x + Math.sin(h) * PAPER.gap * q, c.z - Math.cos(h) * PAPER.gap * q));
      const want = c.y - dropFor(top), climb = Math.max(0, floorOf(top) - want);
      const turn = Math.abs(Math.atan2(Math.sin(h - c.hdg), Math.cos(h - c.hdg)));
      const b = biomeAt(x, z);
      const seen = run.visited.get(Math.round(x / 400) + ',' + Math.round(z / 400)) || 0;   // somewhere new, not round in circles
      const score = seen * 25 + climb * 3 + turn * (wide ? 5 : 15) + Math.max(0, top - 450) * 1.5 + Math.max(0, ahead - 600) * 0.6
        + (b === 'sea' ? 150 : b === 'forest' || b === 'mountain' ? -10 : 0) + r() * 12;
      return { h, x, z, top, climb, score };
    };
    let best = null;
    for (let k = 0; k < 7; k++) {
      let h = c.hdg + r.range(-0.6, 0.6);
      if (away) h = c.hdg + clamp(Math.atan2(Math.sin(toC - c.hdg), Math.cos(toC - c.hdg)), -0.55, 0.55) + r.range(-0.15, 0.15);
      const o = look(h, false);
      if (!best || o.score < best.score) best = o;
    }
    // a hill in the way: look further round (but never straight back)
    if (best.climb > PAPER.rise || best.top > 600) for (let k = 0; k < 12; k++) {
      const o = look(c.hdg + (k / 11 - 0.5) * 2 * 2.2, true);
      if (o.score < best.score) best = o;
    }
    let y = Math.max(c.y - dropFor(best.top), floorOf(best.top));
    y = Math.min(y, Math.max(c.y + PAPER.rise, floorOf(best.top)));   // a big hill: climb (boost!) rather than hit it
    const a = new THREE.Vector3(c.x, c.y, c.z), b = new THREE.Vector3(best.x, y, best.z);
    const g = { c: b, n: b.clone().sub(a).normalize(), R };
    run.cur = { x: best.x, z: best.z, y, hdg: best.h };
    const key = Math.round(best.x / 400) + ',' + Math.round(best.z / 400);
    run.visited.set(key, (run.visited.get(key) || 0) + 1);
    run.hoops.push(g);
    return g;
  }
  function paperFill() {
    while (run.hoops.length < run.k + 9) paperGen();
    run.hoops.forEach((g, i) => {
      const want = i >= run.k && i < run.k + 9;
      if (want && !g.obj) {
        const grp = new THREE.Group();
        g.torus = new THREE.Mesh(run.geo.torus, run.mat.far); g.disc = new THREE.Mesh(run.geo.disc, run.mat.discFar); g.disc.renderOrder = 8;
        grp.add(g.torus, g.disc); grp.position.copy(g.c); grp.lookAt(v1.copy(g.c).add(g.n)); grp.scale.setScalar(g.R);
        run.group.add(grp); g.obj = grp;
      } else if (!want && g.obj) { run.group.remove(g.obj); g.obj = null; }
      if (g.obj) { g.torus.material = i === run.k ? run.mat.next : run.mat.far; g.disc.material = i === run.k ? run.mat.discNext : run.mat.discFar; }
    });
  }
  function updatePaper(dt, p) {
    const s = p.s, pos = s.pos;
    const step = Math.hypot(pos.x - run.prev.x, pos.z - run.prev.z);
    if (run.part && !run.dn && run.phase === 'go' && !s.onGround && step < 40) run.dist += step;   // (jumps don't count)
    const g = run.hoops[run.k];
    if (run.part && !run.dn && g) {
      const d0 = v1.copy(run.prev).sub(g.c).dot(g.n), d1 = v2.copy(pos).sub(g.c).dot(g.n);
      if (d0 < 0 && d1 >= 0) {
        const hit = v1.copy(run.prev).lerp(pos, d0 / (d0 - d1));
        const lat = hit.distanceTo(g.c);
        if (lat < 900) {
          const fr = lat / g.R;
          const pts = fr < 0.25 ? 10 : fr < 0.5 ? 6 : fr < 0.75 ? 3 : fr < 1 ? 1 : 0;
          const refill = { 10: 0.45, 6: 0.35, 3: 0.25, 1: 0.15 }[pts] || 0;
          run.hpts += pts; run.k++;
          if (refill && s.P.kind === 'paper') s.boostE = Math.min(1, (s.boostE || 0) + refill);
          if (pts === 10) { ctx.flash('🎯 10! +🚀'); ctx.sound.win(); }
          else if (pts) { ctx.flash(`⭕ ${pts} +🚀`); ctx.sound.tone(400 + pts * 60, 0.15, 'triangle', 0.1, 700 + pts * 60); }
          else { ctx.flash('❌ Missed! Keep going ➡️'); ctx.sound.bump(); }
          paperFill();
        }
      }
    }
    run.sc = Math.round(run.dist / 10) + run.hpts;
    run.prev.copy(pos);
    const nx = run.hoops[run.k];
    if (nx && nx.torus) nx.torus.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.05);
    return nx ? { x: nx.c.x, z: nx.c.z } : null;
  }
  function paperEvent(name, p) {
    if (!run.part || run.dn || (name !== 'paperdown' && name !== 'paperwet')) return;
    run.dn = 1; run.t = elapsed();
    ctx.flash(`📄 Landed! ${(run.dist / 1000).toFixed(1)} km · ⭐ ${run.sc}`);
  }

  // ------------------------------------------------------------ Fire Fight
  function setupFire() {
    const n = (run.m.fires || []).length || 5;
    run.fires = makeFires(run.m.seed, n);
    run.hp = run.fires.map((f, i) => (run.m.fires ? run.m.fires[i] ?? 100 : 100));
    run.seen = new Set();                  // host: drops already counted
    run.tank = 0; run.dropping = 0; run.sprayT = 0; run.splashT = 0; run.fullSaid = false; run.lastOut = run.hp.filter(h => h <= 0).length;
    const fm = new THREE.SpriteMaterial({ map: tex.fire, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    fm._shared = true;
    run.fires.forEach(f => {
      const g = new THREE.Group(); g.position.set(f.x, f.y, f.z);
      f.flames = [];
      for (let i = 0; i < 9; i++) {
        const sp = new THREE.Sprite(fm.clone()); sp.material.color.setHSL(0.04 + Math.random() * 0.07, 1, 0.55);
        sp.userData = { ox: (Math.random() - 0.5) * 80, oz: (Math.random() - 0.5) * 80, ph: Math.random() * 6, sz: 30 + Math.random() * 34 };
        g.add(sp); f.flames.push(sp);
      }
      const glow = new THREE.Sprite(fm.clone()); glow.material.opacity = 0.35; glow.userData = { glow: true }; g.add(glow); f.glow = glow;
      // a 🔥 marker you can see from far away
      const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.marker, depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true, fog: false }));
      tag.scale.set(0.07, 0.07, 1); tag.position.set(0, 170, 0); tag.renderOrder = 19; g.add(tag); f.tag = tag;
      f.smokeT = Math.random();
      run.group.add(g); f.obj = g;
    });
    // where the water will land
    run.aimRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 40), new THREE.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
    run.aimRing.rotation.x = Math.PI / 2; run.aimRing.visible = false; run.group.add(run.aimRing);
    const lakeX = LAKE.x, lakeZ = LAKE.z;
    run.spot = { x: lakeX - 350, z: lakeZ, y: 150, hdg: Math.PI / 2, air: true, speed: PLANES.splash.vref * 1.4 };
    run.spot.z += (run.idx - (run.who.length - 1) / 2) * 60;
    if (run.part) ctx.placeMe(run.spot, 'splash');
  }
  const dropR = () => (ctx.easy() ? 110 : 80);
  function impactOf(s) {
    const g = surfaceAt(s.pos.x, s.pos.z);
    const h = Math.max(1, s.pos.y - g.h - 2), vy = s.vel.y;
    const t = (vy + Math.sqrt(vy * vy + 2 * 9.81 * h)) / 9.81;
    return { x: s.pos.x + s.vel.x * t * 0.82, z: s.pos.z + s.vel.z * t * 0.82, t };
  }
  function drop() {
    if (!run || run.def.id !== 'fire' || !run.part || run.phase !== 'go') return;
    const p = ctx.me(), s = p.s;
    if (s.P.gear !== 'floats') { ctx.flash('🌊 Only the Splash carries water'); return; }
    if (run.tank < 0.05) { ctx.flash('💧 Empty! Skim the lake to fill up'); ctx.sound.bump(); return; }
    if (run.dropping > 0) return;
    if (s.onGround) { ctx.flash('🛫 Take off first!'); return; }
    const amt = run.tank; run.tank = 0; run.dropping = 1.1;
    const im = impactOf(s);
    ctx.sound.splash();
    const id = ++run.drId;
    const r = dropR();
    setTimeout(() => landWater(im.x, im.z, amt, r, id), im.t * 1000);
    ctx.flash('💦 Water away!');
  }
  function landWater(x, z, amt, r, id) {
    if (!run || run.def.id !== 'fire') return;
    const y = terrainHeight(x, z);
    for (let i = 0; i < 14; i++) ctx.fx.puff(new THREE.Vector3(x + (Math.random() - 0.5) * r, y + 3, z + (Math.random() - 0.5) * r), 0xffffff, 10, 2.5, new THREE.Vector3(0, 4 + Math.random() * 5, 0), 1.5, 0.7);
    // did it hit? (my own feedback; the host keeps the real score)
    let hit = false;
    run.fires.forEach((f, i) => { if (run.hp[i] > 0 && Math.hypot(f.x - x, f.z - z) < r) hit = true; });
    if (hit) { run.h++; ctx.flash('💦 Hit! 🔥 getting smaller'); ctx.sound.win(); } else ctx.flash('💧 Missed the fire');
    const rec = [id, Math.round(x), Math.round(z), Math.round(amt * 100) / 100, r];
    if (ctx.isHost()) applyDrop(ctx.myUid(), rec); else { run.dr.push(rec); if (run.dr.length > 8) run.dr.shift(); }
  }
  function applyDrop(uid, rec) {
    const key = uid + ':' + rec[0];
    if (run.seen.has(key)) return; run.seen.add(key);
    const [, x, z, amt, r] = rec;
    if (![x, z, amt, r].every(Number.isFinite)) return;
    run.fires.forEach((f, i) => {
      const d = Math.hypot(f.x - x, f.z - z);
      if (d < Math.min(r, 140) && run.hp[i] > 0) run.hp[i] = Math.max(0, Math.round(run.hp[i] - clamp(amt, 0, 1) * 100 * (1 - 0.45 * d / r)));
    });
    run.hpDirty = true;
  }
  function updateFire(dt, p) {
    const s = p.s;
    // host: collect friends' drops, publish fire strength
    if (ctx.isHost()) {
      for (const o of ctx.others()) if (o.ms && o.ms.n === run.n && Array.isArray(o.ms.dr)) for (const rec of o.ms.dr) if (Array.isArray(rec)) applyDrop(o.uid, rec);
      run.pushT -= dt;
      if (run.hpDirty && run.pushT <= 0 && ctx.inRoom()) { run.hpDirty = false; run.pushT = 0.3; ctx.setMeta({ ...run.m, fires: run.hp.slice() }); }
    } else if (Array.isArray(run.m.fires)) run.hp = run.fires.map((f, i) => Math.min(run.hp[i] ?? 100, run.m.fires[i] ?? 100));
    // fires burn, shrink, go out
    const t = performance.now() / 1000;
    let out = 0;
    run.fires.forEach((f, i) => {
      const k = run.hp[i] / 100;
      if (k <= 0) { out++; if (f.obj.visible) { f.obj.visible = false; for (let j = 0; j < 12; j++) ctx.fx.puff(v1.set(f.x + (Math.random() - 0.5) * 40, f.y + 4, f.z + (Math.random() - 0.5) * 40).clone(), 0xeeeeee, 12, 4, new THREE.Vector3(0, 6, 0), 2, 0.6); } return; }
      const sz = 0.35 + 0.65 * k;
      f.flames.forEach(sp => { const u = sp.userData; const fl = 0.75 + 0.25 * Math.sin(t * 9 + u.ph) + 0.1 * Math.sin(t * 23 + u.ph * 3); sp.position.set(u.ox * sz, u.sz * sz * 0.45 * fl, u.oz * sz); sp.scale.setScalar(u.sz * sz * fl); });
      f.glow.position.set(0, 25 * sz, 0); f.glow.scale.setScalar(220 * sz);
      f.tag.material.opacity = 0.75 + 0.25 * Math.sin(t * 4);
      f.smokeT -= dt;
      if (f.smokeT <= 0) { f.smokeT = 0.5; ctx.fx.puff(new THREE.Vector3(f.x + (Math.random() - 0.5) * 40 * sz, f.y + 40 * sz, f.z + (Math.random() - 0.5) * 40 * sz), 0x2e2b29, 45 * sz, 10, new THREE.Vector3(2, 15, 1), 2.4, 0.8); }
    });
    if (out > run.lastOut) { const left = run.fires.length - out; ctx.flash(left ? `✅ Fire out! ${left} to go` : '🎉 All fires out!'); ctx.sound.win(); run.lastOut = out; }
    run.left = run.fires.length - out;
    if (run.part && !run.dn && run.left === 0) { run.dn = 1; run.t = elapsed(); }
    // scoop: skim the water in the Splash
    const doors = p.model.parts.doors;
    if (run.part && s.P.gear === 'floats' && run.phase === 'go') {
      const g = surfaceAt(s.pos.x, s.pos.z);
      const skim = g.kind === 'water' && (s.onGround || s.agl < (ctx.easy() ? 6 : 3)) && s.speed > 12;
      if (skim && run.tank < 1) {
        run.tank = Math.min(1, run.tank + dt / (ctx.easy() ? 3 : 4.5));
        run.sprayT -= dt;
        if (run.sprayT <= 0) { run.sprayT = 0.05; ctx.fx.puff(v1.set(s.pos.x, 0.6, s.pos.z).addScaledVector(s.vel, -0.05).clone(), 0xffffff, 2.5, 1.2, new THREE.Vector3((Math.random() - 0.5) * 6, 5 + Math.random() * 4, (Math.random() - 0.5) * 6), 1.5, 0.8); }
        run.splashT -= dt; if (run.splashT <= 0) { run.splashT = 0.6; ctx.sound.splash(); }
        run.fullSaid = false;
      }
      if (run.tank >= 1 && !run.fullSaid) { run.fullSaid = true; ctx.flash('💧 Full! Over a fire press 💧 or B'); ctx.sound.tone(600, 0.2, 'triangle', 0.1, 900); }
      // where it would land
      const show = run.tank > 0.05 && !s.onGround && s.agl > 8;
      run.aimRing.visible = show;
      if (show) { const im = impactOf(s); const r = dropR(); run.aimRing.position.set(im.x, terrainHeight(im.x, im.z) + 3, im.z); run.aimRing.scale.setScalar(r); }
    } else run.aimRing.visible = false;
    // pouring water
    if (run.dropping > 0) {
      run.dropping -= dt;
      for (let j = 0; j < 3; j++) {
        const d = drops[dropNext]; dropNext = (dropNext + 1) % drops.length;
        d.sp.visible = true; d.sp.position.copy(s.pos).add(v1.set((Math.random() - 0.5) * 3, -1.8, (Math.random() - 0.5) * 3));
        d.vel.copy(s.vel).multiplyScalar(0.9).add(v1.set((Math.random() - 0.5) * 4, -2, (Math.random() - 0.5) * 4)); d.life = 6; d.sp.scale.setScalar(3 + Math.random() * 3);
      }
    }
    if (doors) doors.forEach((d, i) => { const want = run.dropping > 0 ? (i ? -1.2 : 1.2) : 0; d.rotation.z += (want - d.rotation.z) * Math.min(1, dt * 8); });
    // arrow: water first, then the nearest fire
    if (run.tank < 0.3 && !run.dropping) return surfaceAt(s.pos.x, s.pos.z).kind === 'water' ? { here: true } : { x: LAKE.x, z: LAKE.z, water: true };
    let best = null, bd = 1e9;
    run.fires.forEach((f, i) => { if (run.hp[i] <= 0) return; const d = Math.hypot(f.x - s.pos.x, f.z - s.pos.z); if (d < bd) { bd = d; best = f; } });
    return best;
  }

  // ------------------------------------------------------------ Landing Contest
  function setupLand() {
    run.round = 0; run.rounds = [];
    run.aimMat = new THREE.MeshBasicMaterial({ color: 0x39ff7a, transparent: true, opacity: 0.45, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    run.aimBox = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), run.aimMat);
    run.aimBox.rotation.x = -Math.PI / 2; run.group.add(run.aimBox);
    run.aimRot = new THREE.Group(); run.group.add(run.aimRot); run.aimRot.add(run.aimBox);
    landRound();
  }
  function landRound() {
    const p = ctx.me();
    const L = landSpot(run.round, run.m.seed, run.idx, run.who.length, p.type, ctx.easy());
    run.L = L; run.touch = null; run.roundT = 0; run.landed = false;
    run.spot = L.spot;
    run.aimRot.position.set(L.aim.x, L.ap.elev + 0.25, L.aim.z);
    run.aimRot.rotation.y = -L.hdg;
    run.aimBox.scale.set(L.ap.wid * 0.7, 60, 1);
    if (run.part) {
      ctx.placeMe(L.spot);
      const s = ctx.me().s;
      s.gearDown = true; s.gear = 1;
      if (s.P.flaps.length > 1) { s.flaps = s.P.flaps.length - 1; s.flapPos = s.flaps; }
      s.throttle = s.input.throttle = s.P.kind === 'heli' ? 0.45 : 0.3; s.rpm = s.throttle;
      if (run.round) ctx.flash(`🛬 Landing ${run.round + 1}: ${L.ap.icon} ${L.ap.name}`);
    }
  }
  function scoreLanding(t, P) {
    const L = run.L, ap = L.ap;
    const loc = runwayLocal(ap, t.x, t.z);
    const onRwy = Math.abs(loc.along) < ap.len / 2 && Math.abs(loc.side) < ap.wid / 2;
    const soft = Math.round(40 * clamp((t.vs + 4) / 3.4, 0, 1));
    const aimD = Math.hypot(t.x - L.aim.x, t.z - L.aim.z);
    const aim = onRwy ? Math.round(30 * clamp(1 - (aimD - 30) / 370, 0, 1)) : 0;
    const mid = onRwy ? Math.round(20 * clamp(1 - (Math.abs(loc.side) - 2) / (ap.wid / 2 - 2), 0, 1)) : 0;
    let dh = Math.abs(((t.hdg - L.hdg + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (P.kind === 'heli') dh = Math.min(dh, Math.abs(Math.PI - dh));
    const straight = Math.round(10 * clamp(1 - (Math.abs(t.bank) / D - 2) / 10, 0, 1) * clamp(1 - (dh / D - 3) / 15, 0, 1));
    const bounce = run.bounced ? 10 : 0;
    return { soft, aim, mid, straight, bounce, total: Math.max(0, soft + aim + mid + straight - bounce) };
  }
  function landEvent(name, p) {
    if (run.landed || !run.part || run.dn || run.phase !== 'go') return;
    const s = p.s;
    if (name === 'bounce') { run.bounced = true; if (!run.touch && s.touch) run.touch = { ...s.touch }; return; }
    if (name === 'crash') { finishRound({ soft: 0, aim: 0, mid: 0, straight: 0, bounce: 0, total: 0, crash: true }); return; }
    if (name === 'landing') {
      const t = run.touch || (s.touch ? { ...s.touch } : { vs: s.vs, x: s.pos.x, z: s.pos.z, bank: s.bank, hdg: s.heading });
      finishRound(scoreLanding(t, s.P));
    }
  }
  function finishRound(sc) {
    run.landed = true; run.bounced = false;
    run.rounds.push(sc.total); run.sc += sc.total; run.k = run.round + 1;
    const row = (l, v, m) => `<div><span>${l}</span><b>${v}</b><small>/${m}</small></div>`;
    setHTML(H.card, sc.crash ? `<h3>💥 Crash! 0 points</h3>` : `<h3>${sc.total >= 80 ? '🌟' : sc.total >= 50 ? '👍' : '🙂'} ${sc.total} points</h3>
      ${row('🪶 Soft', sc.soft, 40)}${row('🟩 On the box', sc.aim, 30)}${row('↔️ In the middle', sc.mid, 20)}${row('✈️ Straight', sc.straight, 10)}${sc.bounce ? row('🦘 Bounce', '-' + sc.bounce, 10) : ''}`);
    H.card.classList.add('show');
    if (sc.total >= 60) ctx.sound.win();
    setTimeout(() => {
      if (!run || run.def.id !== 'land') return;
      H.card.classList.remove('show');
      run.round++;
      if (run.round >= ROUNDS.length) { run.dn = 1; run.t = elapsed(); ctx.flash(`🏁 All done! ${run.sc} points`); return; }
      landRound();
    }, 5000);
  }
  function updateLand(dt, p) {
    if (run.part && !run.dn && !run.landed && run.phase === 'go') {
      run.roundT += dt;
      if (run.roundT > 150) finishRound({ soft: 0, aim: 0, mid: 0, straight: 0, bounce: 0, total: 0, crash: true });
    }
    run.aimMat.opacity = 0.35 + 0.15 * Math.sin(performance.now() / 250);
    return run.L && !run.landed ? run.L.aim : null;
  }

  // ------------------------------------------------------------ each frame
  function update(dt) {
    for (const d of drops) {
      if (d.life <= 0) continue;
      d.life -= dt; d.vel.y -= 9.81 * dt; d.vel.multiplyScalar(1 - dt * 0.25);
      d.sp.position.addScaledVector(d.vel, dt);
      if (d.life <= 0 || d.sp.position.y < terrainHeight(d.sp.position.x, d.sp.position.z)) { d.life = 0; d.sp.visible = false; }
    }
    if (!run) return;
    const p = ctx.me(); if (!p) return;
    const now = ctx.now(), m = run.m;
    // countdown
    if (now < m.at) {
      run.phase = 'count';
      const sec = Math.ceil((m.at - now) / 1000);
      if (sec !== run.lastSec) { run.lastSec = sec; if (sec <= 3) { setText(H.count, String(sec)); ctx.sound.tone(440, 0.15, 'square', 0.08, 440); } else setText(H.count, run.def.icon); }
      if (run.part && run.spot && sec > 0) { /* held still by frozen() */ }
    } else if (run.phase === 'count') {
      run.phase = 'go'; setText(H.count, 'GO!'); ctx.sound.tone(880, 0.3, 'square', 0.1, 880);
      setTimeout(() => { if (run && run.phase === 'go') setText(H.count, ''); }, 900);
    }
    let target = null;
    if (run.def.id === 'rings') target = updateRings(dt, p);
    else if (run.def.id === 'fire') target = updateFire(dt, p);
    else if (run.def.id === 'paper') target = updatePaper(dt, p);
    else target = updateLand(dt, p);
    hud(p, target);
    // host: is it over?
    if (ctx.isHost() && run.phase === 'go' && !m.over) {
      run.endCheck -= dt;
      if (run.endCheck <= 0) {
        run.endCheck = 0.5;
        const others = ctx.others().filter(o => run.who.includes(o.uid));
        const done = o => o.ms && o.ms.n === run.n && o.ms.dn;
        let over = false;
        if (run.def.id === 'fire') over = run.left === 0;
        else {
          const all = [run.dn, ...others.map(done)];
          if (all.every(Boolean)) over = true;
          if (all.some(Boolean)) { run.firstDone = run.firstDone || now; if (now - run.firstDone > (run.def.id === 'paper' ? 240000 : 120000)) over = true; }
        }
        if (over) { const mm = { ...m, over: now }; if (run.def.id === 'fire') mm.fires = run.hp.slice(); ctx.setMeta(mm); if (!ctx.inRoom()) { /* solo: onMeta already ran */ } }
      }
    }
  }

  function hud(p, target) {
    const s = p.s, def = run.def;
    setText(H.title, `${def.icon} ${def.name}`);
    let line = '';
    if (def.id === 'rings') line = run.dn ? `🏁 ${run.sc} points · ${fmtT(run.t)}` : `Ring ${Math.min(run.k + 1, run.rings.length)}/${run.rings.length} · ⭐ ${run.sc}`;
    else if (def.id === 'fire') line = `🔥 ${run.left ?? run.fires.length} left · 💧 ${Math.round(run.tank * 100)}% · ${fmtT(run.dn ? run.t : elapsed())}`;
    else if (def.id === 'paper') line = `📏 ${(run.dist / 1000).toFixed(2)} km · ⭕ ${run.k} · ⭐ ${run.sc}`;
    else line = run.dn ? `🏁 ${run.sc} points` : `Landing ${run.round + 1}/${ROUNDS.length} · ⭐ ${run.sc}`;
    if (!run.part) line = '👀 ' + line;
    setText(H.line, line);
    if (target && target.here && run.phase === 'go') {
      if (H.arrow._r !== 'down') { H.arrow._r = 'down'; H.arrow.style.transform = 'rotate(180deg)'; }
      setText(H.dist, s.onGround || s.agl < 6 ? '💧 Filling up!' : '💧 Go down and skim the water');
      H.go.style.display = '';
    } else if (target && run.phase === 'go' && !(run.dn && def.id !== 'fire')) {
      const dx = target.x - s.pos.x, dz = target.z - s.pos.z, d = Math.hypot(dx, dz);
      const rel = (bearing(dx, dz) - s.heading) / D;
      const rot = `rotate(${Math.round(rel)}deg)`;
      if (H.arrow._r !== rot) { H.arrow._r = rot; H.arrow.style.transform = rot; }
      setText(H.dist, (target.water ? '💧 ' : '') + (d < 1000 ? Math.round(d) + ' m' : (d / 1000).toFixed(1) + ' km'));
      H.go.style.display = '';
    } else H.go.style.display = 'none';
    // friends' scores
    const rows = boardRows();
    const html = rows.length > 1 || ctx.inRoom() ? rows.slice(0, 6).map((r, i) => `<div class="${r.me ? 'me' : ''}"><span>${def.id === 'fire' ? '💦' : ['🥇', '🥈', '🥉'][i] || '·'}</span><b>${esc(r.name)}</b><i>${def.id === 'fire' ? r.h : r.sc}${r.dn && def.id !== 'fire' ? ' 🏁' : ''}</i></div>`).join('') : '';
    setHTML(H.board, html);
  }
  function boardRows() {
    if (!run) return [];
    const rows = [];
    if (run.part) rows.push({ me: true, name: ctx.myName() || 'You', sc: run.sc, dn: run.dn, t: run.t, h: run.h, d: run.dist || 0 });
    for (const o of ctx.others()) {
      if (!o.ms || o.ms.n !== run.n) continue;
      rows.push({ name: o.name, sc: +o.ms.sc || 0, dn: o.ms.dn ? 1 : 0, t: +o.ms.t || 0, h: +o.ms.h || 0, d: +o.ms.d || 0 });
    }
    if (run.def.id === 'fire') rows.sort((a, b) => b.h - a.h);
    else rows.sort((a, b) => (b.sc - a.sc) || ((a.t || 1e9) - (b.t || 1e9)));
    return rows;
  }

  // ------------------------------------------------------------ end screen
  function stars() {
    if (!run) return 1;
    if (run.def.id === 'rings') { const max = run.rings.length * 10; return run.sc >= max * 0.7 ? 3 : run.sc >= max * 0.4 ? 2 : 1; }
    if (run.def.id === 'fire') { const t = run.t || elapsed(); return t < 240 ? 3 : t < 420 ? 2 : 1; }
    if (run.def.id === 'paper') return run.dist >= 7000 ? 3 : run.dist >= 3000 ? 2 : 1;
    return run.sc >= 240 ? 3 : run.sc >= 150 ? 2 : 1;
  }
  function showResults() {
    if (!run) return;
    run.phase = 'over';
    if (!run.t) run.t = elapsed();
    const st = stars(), def = run.def;
    if (run.part) { const b = loadBest(); if (!b[def.id] || b[def.id] < st) { b[def.id] = st; try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch (e) { /* */ } } }
    const rows = boardRows();
    const head = def.id === 'fire'
      ? `<p class="ui-sub">All fires out in <b>${fmtT(run.t)}</b>${rows.length > 1 ? ' together!' : '!'}</p>`
      : def.id === 'paper' ? `<p class="ui-sub">${run.part ? `You glided <b>${(run.dist / 1000).toFixed(2)} km</b> through <b>${run.k}</b> hoops` : 'Mission over'}</p>`
      : `<p class="ui-sub">${run.part ? `You got <b>${run.sc}</b> points` : 'Mission over'}</p>`;
    const list = rows.map((r, i) => `<div class="sp-mrow ${r.me ? 'me' : ''}"><span>${def.id === 'fire' ? '💦' : ['🥇', '🥈', '🥉'][i] || i + 1}</span><b>${esc(r.name)}</b><i>${def.id === 'fire' ? r.h + ' hits' : def.id === 'paper' ? (r.d / 1000).toFixed(1) + ' km · ' + r.sc + ' pts' : r.sc + ' pts'}</i></div>`).join('');
    const host = ctx.isHost();
    openOverlay(`<div class="ui-overlay sp-mres"><div class="ui-panel">
      <div class="ui-kicker">${def.icon} ${def.name}</div>
      <h2 class="ui-title">${run.part ? '⭐'.repeat(st) + '<span class="sp-dim">' + '☆'.repeat(3 - st) + '</span>' : 'Finished'}</h2>
      ${head}<div class="sp-mlist">${list}</div>
      <div class="ui-row">${host ? `<button class="ui-btn primary big sp-magain">🔁 Again</button><button class="ui-btn sp-mother">🎯 Missions</button>` : `<p class="ui-sub">${esc(ctx.hostName())} can start another one</p>`}
        <button class="ui-btn ghost sp-mfree">✈️ Free fly</button></div></div></div>`);
    const id = def.id;
    tapBtn('.sp-magain', () => startMission(id));
    tapBtn('.sp-mother', () => { openPicker(); });
    tapBtn('.sp-mfree', () => { closeOverlay(); if (host) ctx.setMeta(null); else { closedN = run ? run.n : closedN; endRun(); } });
  }

  // ------------------------------------------------------------ picker
  function openPicker() {
    pickerOpen = true;
    const host = ctx.isHost(), best = loadBest();
    const cards = MISSIONS.map(m => `<button class="ui-choice sp-mpick" data-id="${m.id}" ${host ? '' : 'disabled'}>
      <span class="i">${m.icon}</span><b>${m.name}</b><small class="sp-mtag">${m.tag}</small><small>${m.desc}</small>
      <small class="sp-mbest">${best[m.id] ? '⭐'.repeat(best[m.id]) : '☆☆☆'}</small></button>`).join('');
    openOverlay(`<div class="ui-overlay sp-mpickov"><div class="ui-panel wide">
      <div class="ui-kicker">Sky Pilot</div><h2 class="ui-title">🎯 Missions</h2>
      ${ctx.inRoom() ? (host ? '<p class="ui-sub">Everyone in your group plays together</p>' : `<p class="ui-sub">${esc(ctx.hostName())} picks the mission</p>`) : ''}
      <div class="sp-mcards">${cards}</div>
      <div class="ui-row">${!ctx.inRoom() ? '<button class="ui-btn sp-minvite">👫 With friends</button>' : ''}
        ${run && host ? '<button class="ui-btn ghost sp-mstop">⏹️ Stop mission</button>' : ''}
        <button class="ui-btn ghost sp-mclose">Close</button></div></div></div>`);
    box.querySelectorAll('.sp-mpick').forEach(b => tapBtn(b, () => { if (host) startMission(b.dataset.id); }));
    tapBtn('.sp-minvite', () => { closeOverlay(); ctx.invite(); });
    tapBtn('.sp-mstop', () => { closeOverlay(); stopMission(); });
    tapBtn('.sp-mclose', () => closeOverlay());
  }
  function openOverlay(html) { H.ov.innerHTML = html; H.ov.classList.add('show'); }
  function closeOverlay() { H.ov.innerHTML = ''; H.ov.classList.remove('show'); pickerOpen = false; }
  function tapBtn(sel, fn) {
    const b = typeof sel === 'string' ? H.ov.querySelector(sel) : sel;
    if (b) b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); ctx.sound.pop(); fn(); });
  }

  // ------------------------------------------------------------ outside hooks
  return {
    MISSIONS,
    onMeta,
    openPicker,
    stop: stopMission,
    drop,
    update,
    get running() { return !!run; },
    get kind() { return run ? run.def.id : ''; },
    // planes wait on the start line during the countdown (and solo while picking)
    frozen: () => (run && run.part && run.phase === 'count') || (pickerOpen && !ctx.inRoom()),
    event(name, p) { if (run && run.def.id === 'land') landEvent(name, p); else if (run && run.def.id === 'paper') paperEvent(name, p); },
    respawnSpot() { return run && run.part && run.phase !== 'over' && !run.dn ? run.spot : null; },
    // sent with my plane
    status() { return run ? { n: run.n, sc: run.sc, k: run.k, dn: run.dn, t: Math.round(run.t * 10) / 10, h: run.h, d: Math.round(run.dist || 0), dr: run.dr.slice(-6) } : null; },
    mapPoints() {
      if (!run) return [];
      if (run.def.id === 'rings') return run.rings.slice(run.k).map((g, i) => ({ x: g.c.x, z: g.c.z, c: i === 0 ? '#ffd54f' : 'rgba(255,255,255,.8)', r: i === 0 ? 4 : 2.5 }));
      if (run.def.id === 'paper') return run.hoops.slice(run.k, run.k + 8).map((g, i) => ({ x: g.c.x, z: g.c.z, c: i === 0 ? '#ffd54f' : 'rgba(255,255,255,.8)', r: i === 0 ? 4 : 2.5 }));
      if (run.def.id === 'fire') return run.fires.filter((f, i) => run.hp[i] > 0).map(f => ({ x: f.x, z: f.z, c: '#ff5722', r: 4 }));
      return run.L ? [{ x: run.L.aim.x, z: run.L.aim.z, c: '#39ff7a', r: 4 }] : [];
    },
    setFlying(on) {
      flying = on;
      if (!on) { if (run) endRun(); closeOverlay(); return; }
      if (pending) { const m = pending; pending = null; onMeta(m); }
    },
    _next: () => run && (run.rings ? run.rings[Math.min(run.k, run.rings.length - 1)] : run.hoops ? run.hoops[run.k] : null),   // tests
    _R: () => run && run.R,
    _fires: () => run && run.fires && { tank: run.tank, f: run.fires.map((f, i) => ({ x: Math.round(f.x), z: Math.round(f.z), y: Math.round(f.y), hp: run.hp[i] })) },
    _setTank: v => { if (run) run.tank = v; },
    _count: () => run && run.rings ? run.rings.length : 0,
    _jump: k => { if (run && run.rings) { run.k = k; highlightRing(); } },
    dispose() { endRun(); drops.forEach(d => scene.remove(d.sp)); box.remove(); },
  };
}
