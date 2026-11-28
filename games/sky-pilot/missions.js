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
import { AIRPORTS, TOWNS, LANDMARKS, LAKE, ROADS, terrainHeight, surfaceAt, runwayPoint, runwayLocal, biomeAt, solidHeight, cityRuns } from './island.js';
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

// ---------------------------------------------------------------- spots under bridges (between two pillars) for a hoop
let BRIDGES = null;
export function bridgeSpots() {
  if (BRIDGES) return BRIDGES;
  const all = [];
  for (const road of ROADS) {
    const P = road.path; if (!P) continue;
    for (let i = 1; i < P.length - 2; i++) {
      if (i % 3 !== 1) continue;                                  // pillars stand at every 3rd point: this is half-way between two
      const a = P[i], b = P[i + 1];
      if (a[5] !== 'bridge' || b[5] !== 'bridge') continue;
      const x = (a[0] + b[0]) / 2, z = (a[2] + b[2]) / 2, deck = (a[1] + b[1]) / 2 - 2.6;
      const g = Math.max(0, terrainHeight(x, z), terrainHeight(x + 15, z), terrainHeight(x - 15, z), terrainHeight(x, z + 15), terrainHeight(x, z - 15));
      const R = Math.min(24, (deck - g - 6) / 2);
      if (R < 10) continue;
      const dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz) || 1;
      all.push({ x, z, y: g + 3 + R, R, nx: dz / l, nz: -dx / l });
    }
  }
  all.sort((p, q) => q.R - p.R);
  BRIDGES = [];
  for (const b of all) if (!BRIDGES.some(o => Math.hypot(o.x - b.x, o.z - b.z) < 350)) BRIDGES.push(b);
  return BRIDGES;
}
// things to fly through: under a bridge (one hoop) or down a city avenue (a line of hoops, either way)
let FEATS = null;
export function features() {
  if (FEATS) return FEATS;
  FEATS = [...cityRuns().map(r => ({ city: true, run: r })), ...bridgeSpots().map(b => ({ bridge: b }))];
  return FEATS;
}
// ways in: [{ pts, n:{x,z} }] (n = direction of travel)
function waysIn(f) {
  if (f.bridge) { const b = f.bridge; return [{ pts: [b], n: { x: b.nx, z: b.nz } }, { pts: [b], n: { x: -b.nx, z: -b.nz } }]; }
  const r = f.run, l = Math.hypot(r.dir.x, r.dir.z), n = { x: r.dir.x / l, z: r.dir.z / l };
  return [{ pts: r.pts, n }, { pts: [...r.pts].reverse(), n: { x: -n.x, z: -n.z } }];
}
const segDist = (px, pz, a, b) => {
  const vx = b.x - a.x, vz = b.z - a.z, t = clamp(((px - a.x) * vx + (pz - a.z) * vz) / (vx * vx + vz * vz || 1), 0, 1);
  return Math.hypot(px - a.x - vx * t, pz - a.z - vz * t);
};

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
  const sunny = pool.find(p => p.name === '🏘️ ' + TOWNS[0].name);
  const wantCity = r() < 0.55;                                    // about half the races go through the city
  const near = sunny && wantCity ? pool.filter(p => { const d = Math.hypot(p.x - sunny.x, p.z - sunny.z); return d >= 2300 && d <= 8500; }) : [];
  for (let attempt = 0; attempt < 60; attempt++) {
    const used = new Set(), way = [];
    const viaCity = near.length && attempt % 2 === 0;           // half the tries go through the city
    let cur = viaCity ? r.pick(near) : r.pick(pool); used.add(cur); way.push(cur);
    let dir = null, ok = true;
    for (let leg = 0; leg < (viaCity ? 2 : 3); leg++) {
      const cand = viaCity && leg === 0 ? [sunny] : pool.filter(p => {
        if (used.has(p)) return false;
        const d = Math.hypot(p.x - cur.x, p.z - cur.z);
        if (d < 2300 || d > (viaCity ? 8500 : 5200)) return false;
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
    const W = [{ x: 2 * way[0].x - way[1].x, z: 2 * way[0].z - way[1].z }, ...way, { x: 2 * way.at(-1).x - way.at(-2).x, z: 2 * way.at(-1).z - way.at(-2).z }];
    for (let i = 1; i < W.length - 2; i++) for (let k = 0; k < 40; k++) pts.push(catmull(W[i - 1], W[i], W[i + 1], W[i + 2], k / 40));
    pts.push({ x: way.at(-1).x, z: way.at(-1).z });
    const rings = [];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
      if (acc >= 450) { acc = 0; rings.push({ x: pts[i].x, z: pts[i].z }); }
    }
    if (rings.length < 15 || rings.length > 32) continue;
    rings.forEach(g => { delete g.city; });
    rings.forEach(g => { delete g.bridge; });
    // height: just above the ground under each ring (the biggest ring clears it)
    const gnd = (x, z) => { let m = 0; for (const [dx, dz] of [[0, 0], [40, 0], [-40, 0], [0, 40], [0, -40]]) m = Math.max(m, solidHeight(x + dx, z + dz)); return m; };
    rings.forEach(g => { g.y = g.floor = gnd(g.x, g.z) + 46; });
    // through Sunny Town? then the rings go down the avenue between the towers (whichever way fits best)
    let city = 0;
    {
      const t = TOWNS[0];
      let ci = -1, cd = 1e9;
      rings.forEach((g, i) => { const d = Math.hypot(g.x - t.x, g.z - t.z); if (d < cd) { cd = d; ci = i; } });
      if (cd < 700 && ci >= 2 && ci <= rings.length - 3) {
        const cx = rings[ci + 1].x - rings[ci - 1].x, cz = rings[ci + 1].z - rings[ci - 1].z, cl = Math.hypot(cx, cz) || 1;
        let way = null, wd = -2;
        for (const f of features()) if (f.city) for (const w of waysIn(f)) { const d = (w.n.x * cx + w.n.z * cz) / cl; if (d > wd) { wd = d; way = w; } }
        const P = way.pts, A = P[0], Z = P[P.length - 1];
        // drop the rings over the town, keep the ones before the way in and after the way out
        let i0 = ci, i1 = ci;
        while (i0 > 0 && Math.hypot(rings[i0].x - t.x, rings[i0].z - t.z) < Math.hypot(A.x - t.x, A.z - t.z) + 250) i0--;
        while (i1 < rings.length - 1 && Math.hypot(rings[i1].x - t.x, rings[i1].z - t.z) < Math.hypot(Z.x - t.x, Z.z - t.z) + 250) i1++;
        if (i0 >= 1 && i1 <= rings.length - 2) {
          rings.splice(i0 + 1, i1 - i0 - 1, ...P.map(p => ({ x: p.x, z: p.z, y: p.y, floor: p.y, city: way.n, R: p.R })));
          city = 1;
        }
      }
    }
    // a bridge near the course? put a ring under it (the rings either side come down to meet it)
    let added = 0;
    for (const b of bridgeSpots()) {
      if (added >= 2) break;
      let bi = -1, bd = 1e9;
      for (let i = 0; i < rings.length - 1; i++) { const d = segDist(b.x, b.z, rings[i], rings[i + 1]); if (d < bd) { bd = d; bi = i; } }
      if (bi < 0 || bd > 550 || rings[bi].bridge || rings[bi + 1].bridge || rings[bi].city || rings[bi + 1].city) continue;
      if (Math.max(rings[bi].floor, rings[bi + 1].floor) - b.y > 60) continue;
      rings.splice(bi + 1, 0, { x: b.x, z: b.z, y: b.y, floor: b.y, bridge: b });
      added++;
    }
    // the straight line from ring to ring must clear the hills (raise both ends if not), then gentle climbs
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < rings.length; i++) {
        const a = rings[i - 1], b = rings[i];
        let need = 0;
        if (a.city && b.city) continue;                             // the avenue is clear
        for (let q = 1; q < 12; q++) { const t = q / 12, y = a.y + (b.y - a.y) * t; need = Math.max(need, solidHeight(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t) + 14 - y); }
        if (need > 0) { if (!a.bridge && !a.city) a.y += need; if (!b.bridge && !b.city) b.y += need; }
      }
      const fixed = g => g.bridge || g.city;
      for (let i = rings.length - 2; i >= 0; i--) if (!fixed(rings[i])) rings[i].y = Math.max(rings[i].y, rings[i + 1].y - 45);
      for (let i = 1; i < rings.length; i++) if (!fixed(rings[i])) rings[i].y = Math.max(rings[i].y, rings[i - 1].y - 70);
    }
    const maxY = Math.max(...rings.map(g => g.y));
    const nb = rings.filter(g => g.bridge).length;
    const score = (maxY > 600 ? 1000 : 0) + Math.abs(rings.length - 30) * 0.3 - nb * 6 - city * (wantCity ? 10 : 0);      // courses with a bridge and the city win
    if (!best || score < best.score) best = { score, rings, way };
    if (score < -12) break;
  }
  const rings = best.rings;
  rings.forEach((g, i) => {
    const a = rings[Math.max(0, i - 1)], b = rings[Math.min(rings.length - 1, i + 1)];
    let n = new THREE.Vector3(b.x - a.x, (b.y - a.y) * 0.5, b.z - a.z).normalize();
    if (g.bridge) { const sg = n.x * g.bridge.nx + n.z * g.bridge.nz >= 0 ? 1 : -1; n = new THREE.Vector3(g.bridge.nx * sg, 0, g.bridge.nz * sg); g.Rmax = g.bridge.R; }
    if (g.city) { n = new THREE.Vector3(g.city.x, (b.y - a.y) * 0.002, g.city.z).normalize(); g.Rmax = g.R + 2; delete g.R; }
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
  const ghost = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false });
  return { next: ring(0xffd54f, 0.75), far: ghost, finish: ring(0x66ff88, 0.6), discNext: disc(0.55), discFar: disc(0) };
}

// ================================================================= controller
export function createMissions(ctx) {
  const { scene } = ctx;
  const box = document.createElement('div');
  box.className = 'sp-mis';
  box.innerHTML = `<div class="sp-mpanel"><div class="sp-mtitle"></div><div class="sp-mline"></div>
      <div class="sp-mboard"></div></div>
    <div class="sp-mgo"><div class="sp-mtilt"><svg class="sp-marrow" viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id="spag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#bfe6ff" stop-opacity=".55"/></linearGradient></defs>
      <path d="M50 6 L90 86 L50 66 L10 86 Z" fill="url(#spag)" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <path d="M50 6 L50 66 L10 86 Z" fill="#0b2a4a" opacity=".18"/></svg></div><span class="sp-mdist"></span></div>
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
  let lobby = null;        // asking friends in the sky to join: { id, n, until, prev }
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
    // friends flying in the same sky: ask them first (they tap Join), then start with whoever said yes
    if (ctx.canAsk && ctx.canAsk() && !lobby) {
      const n = (Math.floor(now / 1000) % 1e8) * 10 + Math.floor(Math.random() * 10);
      lobby = { id, n, until: now + 15000, prev: run ? run.who.filter(u => u !== ctx.myUid()) : [] };
      ctx.announce({ inv: id, n, until: lobby.until });
      pickerOpen = false;
      lobbyShow();
      return;
    }
    go(id, [ctx.myUid(), ...ctx.others().map(o => o.uid)]);
  }
  const joiners = () => (lobby ? [...new Set(ctx.others().filter(o => o.jn === lobby.n).map(o => o.uid))] : []);
  function lobbyShow() {
    if (!lobby) return;
    const def = DEF[lobby.id], j = joiners(), names = ctx.others().filter(o => j.includes(o.uid)).map(o => o.name);
    const sec = Math.max(0, Math.ceil((lobby.until - ctx.now()) / 1000));
    const html = `<div class="ui-overlay sp-mlobby"><div class="ui-panel">
      <div class="ui-kicker">${def.icon} ${def.name}</div><h2 class="ui-title">👫 Asking friends…</h2>
      <p class="ui-sub">Friends flying near you can tap <b>Join</b>. Starting in ${sec}s</p>
      <div class="sp-mlist">${[`<div class="sp-mrow me"><span>✈️</span><b>${esc(ctx.myName() || 'You')}</b><i>ready</i></div>`, ...names.map(nm => `<div class="sp-mrow"><span>✅</span><b>${esc(nm)}</b><i>joined!</i></div>`)].join('')}</div>
      <div class="ui-row"><button class="ui-btn primary big sp-lgo">▶️ Start now</button><button class="ui-btn ghost sp-lno">Cancel</button></div></div></div>`;
    if (H.ov._lobby === html) return;
    H.ov._lobby = html;
    openOverlay(html);
    tapBtn('.sp-lgo', () => lobbyGo());
    tapBtn('.sp-lno', () => { lobby = null; H.ov._lobby = ''; ctx.announce(null); closeOverlay(); });
  }
  function lobbyTick() {
    if (!lobby) return;
    const j = joiners();
    // everyone from last time is back (or time's up): go
    if (ctx.now() >= lobby.until || (lobby.prev.length && lobby.prev.every(u => j.includes(u)))) lobbyGo();
    else lobbyShow();
  }
  function lobbyGo() {
    if (!lobby) return;
    const { id } = lobby, j = joiners();
    lobby = null; H.ov._lobby = '';
    go(id, [ctx.myUid(), ...j]);
  }
  function go(id, uids) {
    const now = ctx.now();
    const who = [...new Set(uids)].sort();
    const m = { id, n: (Math.floor(now / 1000) % 1e8) * 10 + Math.floor(Math.random() * 10), seed: Math.floor(Math.random() * 1e9), at: now + 4500, who };
    if (id === 'fire') m.fires = Array(Math.min(10, 3 + 2 * who.length)).fill(100);
    closeOverlay(); pickerOpen = false;
    ctx.setMeta(m);
  }
  function stopMission() { if (lobby) { lobby = null; ctx.announce(null); } if (ctx.isHost()) ctx.setMeta(null); else { if (run) closedN = run.n; endRun(); closeOverlay(); if (ctx.leaveGroup) ctx.leaveGroup(); } }

  // ------------------------------------------------------------ a run
  function startRun(m) {
    if (run) endRun();
    closeOverlay();
    const def = DEF[m.id];
    const me = ctx.myUid();
    const who = Array.isArray(m.who) ? m.who : [me];
    const idx = Math.max(0, who.indexOf(me));
    const part = who.includes(me) || m.id === 'fire';
    run = { m, def, n: m.n, who, idx, part, phase: 'count', sc: 0, k: 0, bonus: 0, tk: {}, passT: {}, myT: {}, rescues: 0, dn: 0, t: 0, h: 0, dr: [], drId: 0, group: new THREE.Group(), lastSec: -1, endCheck: 0, pushT: 0, fx: [] };
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

  // ------------------------------------------------------------ flying together
  // passing the same ring / hoop as a teammate within 5 s (either way round) = +5 each
  const TOGETHER = 5000;
  function togetherOnPass(k) {
    const now = ctx.now();
    run.myT[k] = now;
    if (run.passT[k] && now - run.passT[k] < TOGETHER) { run.bonus += 5; run.passT[k] = 0; setTimeout(() => ctx.flash('👫 Together! +5'), 700); }
  }
  function trackTeam() {
    if (!run || !run.part || run.who.length < 2) return;
    const now = ctx.now();
    for (const o of ctx.others()) {
      if (!run.who.includes(o.uid) || !o.ms || o.ms.n !== run.n) continue;
      const k = +o.ms.k || 0, was = run.tk[o.uid];
      run.tk[o.uid] = k;
      if (was == null || k <= was) continue;
      for (let q = was; q < k && q < was + 5; q++) {
        if (run.myT[q] && now - run.myT[q] < TOGETHER) { run.bonus += 5; run.myT[q] = 0; ctx.flash(`👫 Together with ${o.name}! +5`); ctx.sound.tone(660, 0.2, 'triangle', 0.1, 990); }
        else run.passT[q] = now;
      }
    }
  }
  const team = () => run && run.who.length > 1 && run.def.id !== 'fire';

  // ------------------------------------------------------------ Ring Race
  function ringR(p) { const P = p.s.P; return Math.min(40, Math.max(30, P.span * 1.8) * (ctx.easy() ? 1.35 : 1)); }
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
      g.R = Math.min(R, g.Rmax || R);                                          // under a bridge: smaller
      grp.position.copy(g.c); grp.lookAt(v1.copy(g.c).sub(g.n)); /* target faces the pilot, numbers read the right way */ grp.scale.setScalar(g.R);
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
      g.obj.visible = i === run.k || i === run.k + 1;          // the next ring, and a faint outline of the one after
      g.torus.material = i === run.k ? (last ? run.mat.finish : run.mat.next) : run.mat.far;
      g.torus.renderOrder = i === run.k ? 0 : 8;
      g.disc.material = run.mat.discNext; g.disc.visible = i === run.k;
    });
  }
  function updateRings(dt, p) {
    const s = p.s, pos = s.pos;
    if (run.part && !run.dn) run.sc = (run.pts || 0) + run.bonus;
    if (!run.part || run.dn) { run.prev.copy(pos); return ringTarget(); }
    const g = run.rings[run.k];
    if (g && !s.crashed) {
      const d0 = v1.copy(run.prev).sub(g.c).dot(g.n), d1 = v2.copy(pos).sub(g.c).dot(g.n);
      if (d0 < 0 && d1 >= 0) {
        const f = d0 / (d0 - d1);
        const hit = v1.copy(run.prev).lerp(pos, f);
        const lat = hit.distanceTo(g.c);
        if (lat < 1500) {
          const fr = lat / (g.R || run.R);
          const pts = fr < 0.25 ? 10 : fr < 0.5 ? 6 : fr < 0.75 ? 3 : fr < 1 ? 1 : 0;
          run.pts = (run.pts || 0) + pts; run.k++;
          if (team()) togetherOnPass(run.k - 1);
          run.sc = run.pts + run.bonus;
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
    const st = TOWNS[0];
    for (let i = 0; i < 600; i++) {
      // first try: hills a few km from Sunny Town, so the city comes along soon
      const a = r() * Math.PI * 2, dd = r.range(2500, 5000);
      const x = i < 300 ? st.x + Math.cos(a) * dd : r.range(-12000, 9000), z = i < 300 ? st.z + Math.sin(a) * dd : r.range(-9000, 9000), h = terrainHeight(x, z), b = biomeAt(x, z);
      if ((b === 'forest' || b === 'mountain') && h > 30 && h < 450) { sx = x; sz = z; sh = r() * Math.PI * 2; break; }
    }
    let top = 0;
    for (const [dx, dz] of [[0, 0], [100, 0], [-100, 0], [0, 100], [0, -100]]) top = Math.max(top, terrainHeight(sx + dx, sz + dz));
    run.visited = new Map();
    run.cur = { x: sx, z: sz, y: Math.max(0, top) + 70, hdg: sh };
    run.usedB = new Map(); run.feat = null;
    run.hoops = []; run.dist = 0; run.hpts = 0;
    run.mat = hoopMats(tex.target);
    run.geo = { torus: new THREE.TorusGeometry(1, 0.08, 8, 40), disc: new THREE.CircleGeometry(1, 40) };
    const c0 = run.cur, n2 = run.who.length, side = (run.idx - (n2 - 1) / 2) * 30;
    run.spot = { x: c0.x - Math.cos(c0.hdg) * side, z: c0.z - Math.sin(c0.hdg) * side, y: c0.y + 10, hdg: c0.hdg, air: true, speed: 24 };
    paperFill();
    const h0 = run.hoops[0];
    run.spot.hdg = hdgOf(h0.c.x - run.spot.x, h0.c.z - run.spot.z);            // facing the first hoop
    run.spot.y = Math.max(run.spot.y, h0.c.y + 8);
    if (run.part) ctx.placeMe(run.spot, 'paper');
    run.prev = ctx.me().s.pos.clone();
  }
  // the next hoop: skim low over the land, through valleys and gaps between mountains, under bridges, never into a hill
  function paperGen() {
    const r = run.prng, c = run.cur, easy = ctx.easy();
    const i = run.hoops.length;
    const R = (easy ? 30 : 22) * Math.max(0.75, 1 - i * 0.004);
    const groundAt = (x, z) => Math.max(solidHeight(x, z), solidHeight(x + 15, z), solidHeight(x - 15, z), solidHeight(x, z + 15), solidHeight(x, z - 15));
    // hoop bottom just above the ground under it, and the straight line from the last hoop clear of the hills
    const floorOf = (top, local) => Math.max(local + R + (easy ? 5 : 3), top + 10);
    const away = Math.hypot(c.x, c.z - 1500) > 9500 || terrainHeight(c.x, c.z) < 0.3;
    const dropFor = fl => clamp((c.y - fl) * 0.25, PAPER.drop, 45);
    const toC = Math.atan2(-c.x, -(1500 - c.z));
    const push = g => {
      run.cur = { x: g.c.x, z: g.c.z, y: g.c.y, hdg: hdgOf(g.n.x, g.n.z) };
      const key = Math.round(g.c.x / 400) + ',' + Math.round(g.c.z / 400);
      run.visited.set(key, (run.visited.get(key) || 0) + 1);
      run.hoops.push(g);
      return g;
    };
    const featHoop = F => {
      const p = F.pts[F.j], a = new THREE.Vector3(c.x, c.y, c.z), cc = new THREE.Vector3(p.x, p.y, p.z);
      const n = F.j === 0 ? new THREE.Vector3(F.n.x, 0, F.n.z).add(cc.clone().sub(a).normalize()).normalize() : new THREE.Vector3(F.n.x, 0, F.n.z);
      const hr = F.f.city ? (easy ? 16 : 13) : p.R;
      F.j++;
      if (F.j >= F.pts.length) { run.usedB.set(F.f, run.hoops.length); run.feat = null; }
      return push({ c: cc, n, R: hr, bridge: !!F.f.bridge, city: !!F.f.city });
    };
    const used = f => run.usedB.has(f) && (!f.city || i - run.usedB.get(f) < 45);   // the city can come round again
    // flying down a city avenue: the next hoop along it
    const f0 = run.feat;
    if (f0 && f0.j > 0) return featHoop(f0);
    // a bridge or a city avenue ahead? head for it and fly through
    if (!f0 && i > 2) pick: for (const f of features()) {
      if (used(f)) continue;
      for (const w of waysIn(f)) {
        const b = w.pts[0], d = Math.hypot(b.x - c.x, b.z - c.z);
        if (d < 300 || d > (f.city ? 2600 : 1800)) continue;
        const hb = Math.atan2(b.x - c.x, -(b.z - c.z));
        if (Math.abs(Math.atan2(Math.sin(hb - c.hdg), Math.cos(hb - c.hdg))) > 1.3) continue;
        if (((b.x - c.x) * w.n.x + (b.z - c.z) * w.n.z) / d < 0.45) continue;      // need to come at it from the front
        run.feat = { f, pts: w.pts, n: w.n, j: 0 }; break pick;
      }
    }
    if (run.feat) {
      const F = run.feat, b = F.pts[0], d = Math.hypot(b.x - c.x, b.z - c.z), nx = F.n.x, nz = F.n.z;
      if (d <= PAPER.gap * 1.35) return featHoop(F);
      // line up: aim at a point just before it, coming straight at it
      const ax = b.x - nx * PAPER.gap, az = b.z - nz * PAPER.gap;
      let h = Math.atan2(ax - c.x, -(az - c.z));
      h = c.hdg + clamp(Math.atan2(Math.sin(h - c.hdg), Math.cos(h - c.hdg)), -0.6, 0.6);
      const x = c.x + Math.sin(h) * PAPER.gap, z = c.z - Math.cos(h) * PAPER.gap;
      let top = 0;
      for (let q = 0; q <= 8; q++) top = Math.max(top, solidHeight(c.x + (x - c.x) * q / 8, c.z + (z - c.z) * q / 8));
      const fl = floorOf(top, groundAt(x, z));
      const y = Math.max(fl, c.y + (b.y - c.y) * clamp(PAPER.gap / d, 0, 1));
      if (y - c.y < PAPER.rise + 5 && y < b.y + 120) {
        const a = new THREE.Vector3(c.x, c.y, c.z), cc = new THREE.Vector3(x, y, z);
        return push({ c: cc, n: cc.clone().sub(a).normalize(), R });
      }
      run.feat = null;                                            // hills in the way: forget it this time
    }
    // the nearest bridge or avenue we haven't been through pulls the course gently towards it (the city most of all)
    let lure = null, ld = 7000, lw = 0;
    for (const f of features()) {
      if (used(f)) continue;
      for (const w of waysIn(f)) { const b = w.pts[0], d = Math.hypot(b.x - c.x, b.z - c.z) * (f.city ? 0.35 : 1); if (d < ld) { ld = d; lure = b; lw = f.city ? 32 : 24; } }
    }
    const lureH = lure ? Math.atan2(lure.x - c.x, -(lure.z - c.z)) : 0;
    const look = (h, wide) => {
      const x = c.x + Math.sin(h) * PAPER.gap, z = c.z - Math.cos(h) * PAPER.gap;
      let top = 0;
      for (let q = 0; q <= 8; q++) for (const sd of [-12, 0, 12]) {
        const px = c.x + (x - c.x) * q / 8 + Math.cos(h) * sd, pz = c.z + (z - c.z) * q / 8 + Math.sin(h) * sd;
        top = Math.max(top, solidHeight(px, pz));
      }
      top = Math.max(top, 0);
      const local = groundAt(x, z), fl = floorOf(top, local);
      let ahead = 0;
      for (let q = 2; q <= 6; q++) ahead = Math.max(ahead, terrainHeight(c.x + Math.sin(h) * PAPER.gap * q, c.z - Math.cos(h) * PAPER.gap * q));
      const want = c.y - dropFor(fl), climb = Math.max(0, fl - want), yEst = Math.max(want, fl);
      // walls either side = flying through a gap or a valley: fun!
      const wl = solidHeight(x + Math.cos(h) * 170, z + Math.sin(h) * 170), wr = solidHeight(x - Math.cos(h) * 170, z - Math.sin(h) * 170);
      const gap = Math.min(wl, wr) > yEst + 25 ? -35 : Math.max(wl, wr) > yEst + 25 ? -12 : 0;
      const turn = Math.abs(Math.atan2(Math.sin(h - c.hdg), Math.cos(h - c.hdg)));
      const b = biomeAt(x, z);
      const seen = run.visited.get(Math.round(x / 400) + ',' + Math.round(z / 400)) || 0;
      const pull = lure ? -lw * Math.cos(h - lureH) : 0;
      const score = seen * 25 + climb * 4 + turn * (wide ? 5 : 15) + gap + pull + Math.max(0, top - 450) * 1.5 + Math.max(0, ahead - 650) * 0.6
        + (b === 'sea' ? 300 : b === 'forest' || b === 'mountain' ? -10 : 0) + r() * 12;
      return { h, x, z, fl, climb, score };
    };
    let best = null;
    for (let k = 0; k < 7; k++) {
      let h = c.hdg + r.range(-0.6, 0.6);
      if (away) h = c.hdg + clamp(Math.atan2(Math.sin(toC - c.hdg), Math.cos(toC - c.hdg)), -0.55, 0.55) + r.range(-0.15, 0.15);
      const o = look(h, false);
      if (!best || o.score < best.score) best = o;
    }
    if (best.climb > PAPER.rise || best.fl > 650) for (let k = 0; k < 12; k++) {
      const o = look(c.hdg + (k / 11 - 0.5) * 2 * 2.2, true);
      if (o.score < best.score) best = o;
    }
    let y = Math.max(c.y - dropFor(best.fl), best.fl);
    y = Math.min(y, Math.max(c.y + PAPER.rise, best.fl));
    const a = new THREE.Vector3(c.x, c.y, c.z), cc = new THREE.Vector3(best.x, y, best.z);
    return push({ c: cc, n: cc.clone().sub(a).normalize(), R });
  }
  function paperFill() {
    while (run.hoops.length < run.k + 9) paperGen();
    run.hoops.forEach((g, i) => {
      const want = i === run.k || i === run.k + 1;            // the next hoop, and a faint outline of the one after
      if (want && !g.obj) {
        const grp = new THREE.Group();
        g.torus = new THREE.Mesh(run.geo.torus, run.mat.far); g.disc = new THREE.Mesh(run.geo.disc, run.mat.discFar); g.disc.renderOrder = 8;
        grp.add(g.torus, g.disc); grp.position.copy(g.c); grp.lookAt(v1.copy(g.c).sub(g.n)); /* target faces the pilot, numbers read the right way */ grp.scale.setScalar(g.R);
        run.group.add(grp); g.obj = grp;
      } else if (!want && g.obj) { run.group.remove(g.obj); g.obj = null; }
      if (g.obj) { g.torus.material = i === run.k ? run.mat.next : run.mat.far; g.torus.renderOrder = i === run.k ? 0 : 8; g.disc.material = run.mat.discNext; g.disc.visible = i === run.k; }
    });
  }
  function updatePaper(dt, p) {
    const s = p.s, pos = s.pos;
    if (run.rescueAt && ctx.now() >= run.rescueAt) {
      run.rescueAt = 0;
      const o = ctx.others().find(x => x.uid === run.rescuer && Array.isArray(x.p) && Array.isArray(x.q) && x.ms && x.ms.n === run.n && !x.ms.dn);
      if (!o) { run.dn = 1; run.t = elapsed(); ctx.flash(`📄 Landed! ${(run.dist / 1000).toFixed(1)} km · ⭐ ${run.sc}`); }
      else {
        // just behind and beside them, flying the same way, with their next hoop ahead
        const fq = new THREE.Quaternion(...o.q), fw = new THREE.Vector3(0, 0, -1).applyQuaternion(fq); fw.y = 0;
        if (fw.lengthSq() < 1e-4) fw.set(0, 0, -1); fw.normalize();
        const side = new THREE.Vector3(-fw.z, 0, fw.x);
        const spot = { x: o.p[0] - fw.x * 30 + side.x * 14, z: o.p[2] - fw.z * 30 + side.z * 14, y: o.p[1] + 4, hdg: hdgOf(fw.x, fw.z), air: true, speed: 24 };
        const k = Math.max(run.k, +o.ms.k || 0);
        while (run.hoops.length < k + 9) paperGen();
        run.k = k; paperFill();
        ctx.placeMe(spot, 'paper');
        if (p.s) p.s.boostE = Math.max(p.s.boostE || 0, 0.5);
        run.prev.copy(ctx.me().s.pos);
        ctx.flash(`🤝 Back in the air with ${o.name}! (${2 - run.rescues} left)`);
      }
    }
    if (run.rescueAt) { run.prev.copy(pos); const nx = run.hoops[run.k]; return nx ? { x: nx.c.x, z: nx.c.z } : null; }
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
          if (team()) togetherOnPass(run.k - 1);
          if (refill && s.P.kind === 'paper') s.boostE = Math.min(1, (s.boostE || 0) + refill);
          if (pts === 10) { ctx.flash('🎯 10! +🚀'); ctx.sound.win(); }
          else if (pts) { ctx.flash(`⭕ ${pts} +🚀`); ctx.sound.tone(400 + pts * 60, 0.15, 'triangle', 0.1, 700 + pts * 60); }
          else { ctx.flash('❌ Missed! Keep going ➡️'); ctx.sound.bump(); }
          paperFill();
        }
      }
    }
    if (!run.dn) run.sc = Math.round(run.dist / 10) + run.hpts + run.bonus;
    run.prev.copy(pos);
    const nx = run.hoops[run.k];
    if (nx && nx.torus) nx.torus.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.05);
    return nx ? { x: nx.c.x, z: nx.c.z } : null;
  }
  function paperEvent(name, p) {
    if (!run.part || run.dn || run.rescueAt || (name !== 'paperdown' && name !== 'paperwet')) return;
    // a teammate still gliding? they carry you on (twice per flight)
    const mate = run.rescues < 2 && ctx.others().find(o => run.who.includes(o.uid) && o.ms && o.ms.n === run.n && !o.ms.dn && Array.isArray(o.p) && Array.isArray(o.q));
    if (mate) {
      run.rescues++; run.rescueAt = ctx.now() + 2500; run.rescuer = mate.uid;
      ctx.flash(`🤝 ${mate.name} will carry you on!`); ctx.sound.tone(520, 0.25, 'triangle', 0.1, 780);
      return;
    }
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
    if (lobby) { lobby.tickT = (lobby.tickT || 0) - dt; if (lobby.tickT <= 0) { lobby.tickT = 0.25; lobbyTick(); } }
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
    if (run.phase === 'go' && (run.def.id === 'rings' || run.def.id === 'paper') && !run.dn) trackTeam();
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
      if (H.arrow._r !== 'down') { H.arrow._r = 'down'; H.arrow.style.transform = 'rotateZ(180deg)'; H.go.classList.remove('ahead'); }
      setText(H.dist, s.onGround || s.agl < 6 ? '💧 Filling up!' : '💧 Go down and skim the water');
      H.go.style.display = '';
    } else if (target && run.phase === 'go' && !(run.dn && def.id !== 'fire')) {
      const dx = target.x - s.pos.x, dz = target.z - s.pos.z, d = Math.hypot(dx, dz);
      const rel = (bearing(dx, dz) - s.heading) / D;
      const relN = Math.round(((rel % 360) + 540) % 360 - 180);
      const rot = `rotateX(50deg) rotateZ(${relN}deg)`;              // lies flat like a compass needle pointing the way
      if (H.arrow._r !== rot) { H.arrow._r = rot; H.arrow.style.transform = rot; H.go.classList.toggle('ahead', Math.abs(relN) < 12); }
      setText(H.dist, (target.water ? '💧 ' : '') + (d < 1000 ? Math.round(d) + ' m' : (d / 1000).toFixed(1) + ' km'));
      H.go.style.display = '';
    } else H.go.style.display = 'none';
    // friends' scores
    const rows = boardRows();
    const tm = rows.length > 1 && def.id !== 'fire';
    const html = (tm ? `<div class="sp-mteam"><span>👫</span><b>Team</b><i>⭐ ${rows.reduce((a, r) => a + r.sc, 0)}</i></div>` : '')
      + (rows.length > 1 || ctx.inRoom() ? rows.slice(0, 6).map(r => `<div class="${r.me ? 'me' : ''}"><span>${def.id === 'fire' ? '💦' : r.dn ? '🏁' : '✈️'}</span><b>${esc(r.name)}</b><i>${def.id === 'fire' ? r.h : r.sc}</i></div>`).join('') : '');
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
  // stars: for a team, the average of everyone's score (so a team of 3 isn't 3x easier, or harder)
  function stars(rows) {
    if (!run) return 1;
    const R = rows && rows.length ? rows : [{ sc: run.sc, d: run.dist || 0 }];
    const sc = R.reduce((a, r) => a + r.sc, 0) / R.length, dist = R.reduce((a, r) => a + (r.d || 0), 0) / R.length;
    if (run.def.id === 'rings') { const max = run.rings.length * 10; return sc >= max * 0.7 ? 3 : sc >= max * 0.4 ? 2 : 1; }
    if (run.def.id === 'fire') { const t = run.t || elapsed(); return t < 240 ? 3 : t < 420 ? 2 : 1; }
    if (run.def.id === 'paper') return dist >= 7000 ? 3 : dist >= 3000 ? 2 : 1;
    return sc >= 240 ? 3 : sc >= 150 ? 2 : 1;
  }
  function showResults() {
    if (!run) return;
    run.phase = 'over';
    if (!run.t) run.t = elapsed();
    const def = run.def, rows = boardRows(), tm = rows.length > 1 && def.id !== 'fire', st = stars(tm ? rows : null);
    if (run.part) { const b = loadBest(); if (!b[def.id] || b[def.id] < st) { b[def.id] = st; try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch (e) { /* */ } } }
    const total = rows.reduce((a, r) => a + r.sc, 0);
    const head = tm ? `<p class="ui-sub">👫 Team score <b>${total}</b>${def.id === 'paper' ? ` · <b>${(rows.reduce((a, r) => a + r.d, 0) / 1000).toFixed(1)} km</b> together` : ''}${run.bonus ? ` · you got <b>+${run.bonus}</b> for flying together` : ''}</p>`
      : def.id === 'fire'
      ? `<p class="ui-sub">All fires out in <b>${fmtT(run.t)}</b>${rows.length > 1 ? ' together!' : '!'}</p>`
      : def.id === 'paper' ? `<p class="ui-sub">${run.part ? `You glided <b>${(run.dist / 1000).toFixed(2)} km</b> through <b>${run.k}</b> hoops` : 'Mission over'}</p>`
      : `<p class="ui-sub">${run.part ? `You got <b>${run.sc}</b> points` : 'Mission over'}</p>`;
    const list = rows.map(r => `<div class="sp-mrow ${r.me ? 'me' : ''}"><span>${def.id === 'fire' ? '💦' : tm ? '✈️' : '⭐'}</span><b>${esc(r.name)}</b><i>${def.id === 'fire' ? r.h + ' hits' : def.id === 'paper' ? (r.d / 1000).toFixed(1) + ' km · ' + r.sc + ' pts' : r.sc + ' pts'}</i></div>`).join('');
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
    tapBtn('.sp-mfree', () => { closeOverlay(); if (host) ctx.setMeta(null); else { closedN = run ? run.n : closedN; endRun(); if (ctx.leaveGroup) ctx.leaveGroup(); } });
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
      ${ctx.canAsk && ctx.canAsk() ? '<p class="ui-sub">👫 Friends flying near you will be asked to join. Play as a team!</p>' : ctx.inRoom() ? (host ? '<p class="ui-sub">Everyone in your group plays together, as a team</p>' : `<p class="ui-sub">${esc(ctx.hostName())} picks the mission</p>`) : ''}
      <div class="sp-mcards">${cards}</div>
      <div class="ui-row">${!ctx.inRoom() && !(ctx.canAsk && ctx.canAsk()) ? '<button class="ui-btn sp-minvite">👫 With friends</button>' : ''}
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
      if (run.def.id === 'rings') return run.rings.slice(run.k, run.k + 2).map((g, i) => ({ x: g.c.x, z: g.c.z, c: i === 0 ? '#ffd54f' : 'rgba(255,255,255,.8)', r: i === 0 ? 4 : 2.5 }));
      if (run.def.id === 'paper') return run.hoops.slice(run.k, run.k + 2).map((g, i) => ({ x: g.c.x, z: g.c.z, c: i === 0 ? '#ffd54f' : 'rgba(255,255,255,.8)', r: i === 0 ? 4 : 2.5 }));
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
    _bridge: () => run && (run.rings || run.hoops || []).find(g => g.bridge),
    _city: () => run && (run.rings || run.hoops || []).find(g => g.city),
    _setTank: v => { if (run) run.tank = v; },
    _count: () => run && run.rings ? run.rings.length : 0,
    _jump: k => { if (run && run.rings) { run.k = k; highlightRing(); } else if (run && run.hoops) { while (run.hoops.length < k + 9) paperGen(); run.k = k; paperFill(); } },
    _hoops: () => run && run.hoops,
    _run: () => run && { bonus: run.bonus, who: run.who, n: run.n, seed: run.m.seed, part: run.part, phase: run.phase, rescues: run.rescues, dn: run.dn, k: run.k, sc: run.sc },
    dispose() { endRun(); drops.forEach(d => scene.remove(d.sp)); box.remove(); },
  };
}
