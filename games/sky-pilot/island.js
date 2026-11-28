// Sky Pilot: the island. Pure maths, no 3D here (the physics uses it too).
//
// Units: metres. x = east, z = south, y = up. Sea level is y = 0.
// Headings: 0 = north (-z), PI/2 = east (+x).
//
//   north: snowy mountains (Mountain Field airstrip in a valley)
//   east:  desert with dunes and mesas (Desert Strip)
//   west:  forest, farms, a lake and hills (Forest grass strip)
//   south: beaches, Sunny Town and the big airport
//   sea:   a carrier, small islands, boats, whales
import { makeNoise, smooth, lerp, clamp, hash2 } from './noise.js';

export const N = makeNoise(20261115);
const N2 = makeNoise(777);

export const GRID = 768;              // height grid cells across
export const SPAN = 36000;            // metres the grid covers
export const HALF = SPAN / 2;
export const CELL = SPAN / GRID;
export const SEA_FLOOR = -45;
export const WORLD_EDGE = 26000;      // planes are turned back past this

export const dirOf = h => [Math.sin(h), -Math.cos(h)]; // heading -> [dx, dz]

// ---------------------------------------------------------------- airports
// x, z = runway centre. hdg = direction you take off in from the start spot.
export const AIRPORTS = [
  { id: 'main', name: 'Sunny Bay', icon: '🏙️', x: 2600, z: 7600, hdg: Math.PI / 2 - 0.12, len: 3000, wid: 60, elev: 14, surface: 'asphalt', big: true },
  { id: 'desert', name: 'Desert Strip', icon: '🏜️', x: 8600, z: -600, hdg: 0.35, len: 1800, wid: 40, elev: 0, surface: 'asphalt' },
  { id: 'mountain', name: 'Mountain Field', icon: '🏔️', x: -1500, z: -5200, hdg: Math.PI / 2 + 0.25, len: 1300, wid: 30, elev: 0, surface: 'asphalt' },
  { id: 'forest', name: 'Forest Farm', icon: '🌲', x: -7600, z: 2300, hdg: 0.15, len: 900, wid: 30, elev: 0, surface: 'grass' },
];

// Aircraft carrier (deck is a flat box).
export const CARRIER = { x: -2500, z: 16500, hdg: Math.PI / 2 + 0.3, len: 320, wid: 72, deck: 19 };
// Seaplane harbour (in the bay by the town) and helipads.
export const HARBOUR = { x: -3400, z: 10900, hdg: Math.PI / 2 };
export const HELIPADS = [];   // filled once the town is known (roof tops)
export const LANDMARKS = [];
export const SPIRES = [];    // rock spire clusters { x, z, n } (filled by scenery.js): the paper course weaves through them  // { icon, name, x, z } for the map (filled by scenery.js)

// Flat areas for towns.
// towns are blob shaped (see townMask), w/d = rough size
export const TOWNS = [
  { id: 'sunny', name: 'Sunny Town', x: -2600, z: 9000, w: 2700, d: 1800, rot: 0.1, kind: 'city' },
  { id: 'alpine', name: 'Snow Village', x: -3600, z: -3300, w: 800, d: 600, rot: 0.5, kind: 'chalet' },
  { id: 'oasis', name: 'Oasis', x: 6200, z: 2600, w: 900, d: 700, rot: -0.3, kind: 'adobe' },
  { id: 'farm', name: 'Farm Village', x: -9200, z: 4400, w: 800, d: 700, rot: 0.2, kind: 'village' },
  { id: 'palm', name: 'Palm Bay', x: 10800, z: 6800, w: 1300, d: 900, rot: 0.6, kind: 'resort' },
  { id: 'fish', name: 'Fishport', x: -11600, z: 1600, w: 900, d: 700, rot: -0.4, kind: 'village' },
  { id: 'lake', name: 'Lakeside', x: -5000, z: 300, w: 700, d: 600, rot: 0.3, kind: 'village' },
];
// 0 in the middle of a town, 1 at its edge (wobbly, so towns aren't squares)
export function townMask(t, x, z) {
  const c = Math.cos(t.rot), s = Math.sin(t.rot), dx = x - t.x, dz = z - t.z;
  const u = (dx * c - dz * s) / (t.w / 2), v = (dx * s + dz * c) / (t.d / 2);
  const a = Math.atan2(v, u);
  const wob = 1 + 0.22 * Math.sin(a * 3 + t.x * 0.001) + 0.12 * Math.sin(a * 5 + t.z * 0.002) + (N2.n2(x / 400, z / 400)) * 0.15;
  return Math.hypot(u, v) / wob;
}
// little hamlets dotted about (a farm, a few houses)
export const VILLAGES = [];

export const LAKE = { x: -6200, z: -400, r: 900 };

// small islands: x, z, radius, height
const ISLETS = [
  [7200, 14300, 700, 40], [-11500, 12800, 900, 90], [13800, 9500, 500, 30], [-14500, -4000, 1100, 160], [3500, 19500, 400, 20],
];

// ---------------------------------------------------------------- raw land shape
function regionWeights(x, z) {
  const wob = (N2.fbm(x / 4500, z / 4500, 3) - 0.5) * 5200;
  const wm = smooth(-900, -5200, z + wob * 0.8);
  const wd = smooth(2200, 5200, x + wob) * (1 - wm);
  const ww = smooth(-2200, -5200, x - wob * 0.9) * (1 - wm);
  const ws = Math.max(0, 1 - wm - wd - ww);
  return { wm, wd, ww, ws };
}

// land mask: 1 inland, 0 at sea
function landMask(x, z) {
  const r = Math.hypot(x * 0.95, z * 1.05) / 12800;
  const wob = (N.fbm(x / 4200 + 9, z / 4200, 4) - 0.5) * 0.36;
  let m = smooth(1.02, 0.78, r + wob);
  for (const [ix, iz, ir] of ISLETS) {
    const d = Math.hypot(x - ix, z - iz) / ir + (N.fbm(x / 600, z / 600, 3) - 0.5) * 0.6;
    m = Math.max(m, smooth(1.1, 0.35, d));
  }
  return m;
}

function rawHeight(x, z) {
  const m = landMask(x, z);
  if (m <= 0) return SEA_FLOOR + N.fbm(x / 3000, z / 3000, 2) * 10;
  const { wm, wd, ww, ws } = regionWeights(x, z);
  let h = 0;
  if (ws > 0) h += ws * (6 + 55 * Math.pow(N.fbm(x / 2600, z / 2600, 4), 1.6));
  if (ww > 0) {
    const hills = 30 + 260 * Math.pow(N.fbm(x / 2400 + 3, z / 2400, 5), 2);
    h += ww * hills;
  }
  if (wd > 0) {
    const base = 40 + 60 * N.fbm(x / 3000 + 7, z / 3000, 3);
    const dir = (x * 0.8 + z * 0.6) / 140 + N.n2(x / 900, z / 900) * 2.2;
    const dune = Math.pow(1 - Math.abs(Math.sin(dir)), 2.2) * 16 * N.fbm(x / 1500, z / 1500 + 4, 2);
    const mf = N.fbm(x / 1700 - 5, z / 1700, 3);
    const mesa = smooth(0.66, 0.7, mf) * 120;
    h += wd * (base + dune + mesa);
  }
  if (wm > 0) {
    const rd = N.ridged(x / 4200 + 11, z / 4200 - 3, 6);
    const peaks = 150 + 2600 * Math.pow(rd, 1.7) * smooth(-1500, -6000, z);
    h += wm * peaks;
  }
  // coast: land rises gently from the sea
  const c = smooth(0.0, 0.55, m);
  h = SEA_FLOOR + (h * c + 3 - SEA_FLOOR) * smooth(0, 0.32, m);
  return h;
}

// ---------------------------------------------------------------- flattening (airports, towns, lake)
function rectDist(x, z, cx, cz, hw, hd, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  const dx = x - cx, dz = z - cz;
  const u = Math.abs(dx * c + dz * s) - hw, v = Math.abs(-dx * s + dz * c) - hd;
  return Math.hypot(Math.max(u, 0), Math.max(v, 0)) + Math.min(Math.max(u, v), 0);
}

// runway frame: along = metres along the takeoff direction from the centre, side = metres to the right
export function runwayLocal(ap, x, z) {
  const [dx, dz] = dirOf(ap.hdg);
  const ox = x - ap.x, oz = z - ap.z;
  return { along: ox * dx + oz * dz, side: ox * -dz + oz * dx };
}
export function runwayPoint(ap, along, side = 0) {
  const [dx, dz] = dirOf(ap.hdg);
  return [ap.x + dx * along - dz * side, ap.z + dz * along + dx * side];
}
// width of the flat area to the right of the runway (taxiway + apron + buildings)
export const apronSide = ap => (ap.big ? 420 : 200);

function flatten(x, z, h) {
  for (const ap of AIRPORTS) {
    const { along, side } = runwayLocal(ap, x, z);
    const hw = ap.len / 2 + 220;
    const sideIn = side > 0 ? side - apronSide(ap) : -side - 90;
    const d = Math.hypot(Math.max(Math.abs(along) - hw, 0), Math.max(sideIn, 0));
    const blend = ap.id === 'mountain' ? 900 : 600;
    if (d < blend) h = lerp(ap.elev, h, smooth(0, blend, d));
  }
  for (const t of TOWNS) {
    if (Math.abs(x - t.x) > t.w * 1.4 || Math.abs(z - t.z) > t.w * 1.4) continue;
    const m = townMask(t, x, z);
    if (m < 1.5) h = lerp(t.elev, h, smooth(0.85, 1.5, m));
  }
  for (const v of VILLAGES) {
    const d = Math.hypot(x - v.x, z - v.z);
    if (d < v.r * 2.2) h = lerp(v.elev, h, smooth(v.r * 0.6, v.r * 2.2, d));
  }
  const ld = Math.hypot(x - LAKE.x, z - LAKE.z) / LAKE.r + (N.fbm(x / 500, z / 500, 2) - 0.5) * 0.5;
  if (ld < 1.6) h = lerp(-9, h, smooth(0.55, 1.6, ld));
  // carrier sits in deep water
  return h;
}

// elevations: airports and towns sit at the average ground height around them
function settle() {
  for (const ap of AIRPORTS) if (!ap.elev) {
    let s = 0, n = 0;
    for (let a = -ap.len / 2; a <= ap.len / 2; a += 100) { const [px, pz] = runwayPoint(ap, a, 60); s += rawHeight(px, pz); n++; }
    ap.elev = Math.max(8, Math.round(s / n));
  }
  if (AIRPORTS[2].elev < 500) AIRPORTS[2].elev = Math.max(AIRPORTS[2].elev, 0);
  for (const t of TOWNS) {
    let s = 0, n = 0;
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { s += rawHeight(t.x + i * t.w / 5, t.z + j * t.d / 5); n++; }
    t.elev = Math.max(5, Math.round(s / n));
  }
}
settle();

// hamlets: flat-ish land away from towns and airports (same every time)
(function placeVillages() {
  let seed = 9871;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const kinds = { south: 'cottage', west: 'farm', desert: 'adobe', mountain: 'chalet' };
  for (let tries = 0; tries < 4000 && VILLAGES.length < 34; tries++) {
    const x = (rnd() - 0.5) * 26000, z = (rnd() - 0.5) * 26000;
    const h = rawHeight(x, z);
    if (h < 4 || h > 700) continue;
    const sl = Math.abs(rawHeight(x + 80, z) - h) + Math.abs(rawHeight(x, z + 80) - h);
    if (sl > 14) continue;
    if (AIRPORTS.some(a => Math.hypot(a.x - x, a.z - z) < a.len * 0.9)) continue;
    if (TOWNS.some(t => Math.hypot(t.x - x, t.z - z) < Math.max(t.w, t.d) * 0.9 + 400)) continue;
    if (VILLAGES.some(v => Math.hypot(v.x - x, v.z - z) < 1300)) continue;
    const { wm, wd, ww } = regionWeights(x, z);
    const kind = wm > 0.5 ? kinds.mountain : wd > 0.5 ? kinds.desert : ww > 0.5 ? kinds.west : kinds.south;
    VILLAGES.push({ x, z, r: 110 + rnd() * 70, elev: Math.round(h), kind, seed: Math.floor(rnd() * 1e6) });
  }
})();

export function exactHeight(x, z) { return flatten(x, z, rawHeight(x, z)); }

// ---------------------------------------------------------------- the height grid (built once)
// heights[(GRID+1)^2], row major in z. Mesh and physics both use it, so they match.
export let heights = null;

export async function buildHeights(progress) {
  const n = GRID + 1;
  heights = new Float32Array(n * n);
  let t0 = performance.now();
  for (let j = 0; j < n; j++) {
    const z = -HALF + j * CELL;
    for (let i = 0; i < n; i++) heights[j * n + i] = exactHeight(-HALF + i * CELL, z);
    if (performance.now() - t0 > 30) { progress && progress(j / n); await new Promise(r => setTimeout(r, 0)); t0 = performance.now(); }
  }
  carveRoutes();
  return heights;
}

// Roads and the railway get gentle slopes: the ground is cut away or built up under them,
// with bridges over deep dips and tunnels through big hills (like real ones).
// Each route gets .path = [[x, y, z, dirX, dirZ, 'bridge' | 'tunnel' | ''], ...] every 20 m.
function carveRoutes() {
  const n = GRID + 1;
  const best = new Map();   // grid index -> [distance, target height]
  for (const road of ROADS) {
    const rail = road.kind === 'rail';
    const pts = splinePath(road.pts, 10);
    const g = pts.map(p => terrainHeight(p[0], p[2]));
    // smooth, then limit how steep it can be
    const W = rail ? 12 : 8, G = (rail ? 0.04 : 0.1) * 10;
    const t = g.map((_, i) => { let sm = 0, c = 0; for (let k = Math.max(0, i - W); k <= Math.min(g.length - 1, i + W); k++) { sm += Math.max(g[k], 2); c++; } return sm / c; });
    t[0] = Math.max(g[0], 2); t[t.length - 1] = Math.max(g[g.length - 1], 2);
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < t.length; i++) t[i] = clamp(t[i], t[i - 1] - G, t[i - 1] + G);
      for (let i = t.length - 2; i >= 0; i--) t[i] = clamp(t[i], t[i + 1] - G, t[i + 1] + G);
    }
    const fillMax = rail ? 18 : 9, cutMax = rail ? 30 : 18, halfW = rail ? 8 : 10, blend = CELL * 2.2;
    const flags = t.map((ti, i) => (ti - g[i] > fillMax || g[i] < 0.5 ? 'bridge' : g[i] - ti > cutMax ? 'tunnel' : ''));
    // tidy: short gaps between bridges/tunnels join up
    for (let i = 1; i < flags.length - 1; i++) if (!flags[i] && flags[i - 1] && flags[i - 1] === flags[Math.min(flags.length - 1, i + 3)]) flags[i] = flags[i - 1];
    pts.forEach((p, i) => {
      if (flags[i]) return;
      const R = halfW + blend, ci = Math.round((p[0] + HALF) / CELL), cj = Math.round((p[2] + HALF) / CELL), rc = Math.ceil(R / CELL);
      for (let dj = -rc; dj <= rc; dj++) for (let di = -rc; di <= rc; di++) {
        const ii = ci + di, jj = cj + dj;
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue;
        const d = Math.hypot(-HALF + ii * CELL - p[0], -HALF + jj * CELL - p[2]);
        if (d > R) continue;
        const k = jj * n + ii, b = best.get(k);
        if (!b || d < b[0]) best.set(k, [d, t[i], halfW, blend]);
      }
    });
    road.path = [];
    for (let i = 0; i < pts.length; i += 2) {
      const p = pts[i];
      road.path.push([p[0], t[i] + (rail ? 0.7 : 0.4), p[2], p[3], p[4], flags[i]]);
    }
  }
  for (const [k, [d, ti, halfW, blend]] of best) {
    const h = heights[k];
    // don't touch runways / town centres (already flat)
    heights[k] = lerp(ti, h, smooth(halfW, halfW + blend, d));
  }
}
function splinePath(p, step) {
  const out = [];
  const cr = (a, b, c, d, t) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(p.length - 1, i + 2)];
    const nn = Math.max(1, Math.round(Math.hypot(c[0] - b[0], c[1] - b[1]) / step));
    for (let k = 0; k < nn; k++) { const t = k / nn; out.push([cr(a[0], b[0], c[0], d[0], t), 0, cr(a[1], b[1], c[1], d[1], t)]); }
  }
  out.push([p[p.length - 1][0], 0, p[p.length - 1][1]]);
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1;
    out[i][3] = (b[0] - a[0]) / l; out[i][4] = (b[2] - a[2]) / l;
  }
  return out;
}

// height of the terrain mesh (triangles split the same way as the mesh)
export function terrainHeight(x, z) {
  const fx = (x + HALF) / CELL, fz = (z + HALF) / CELL;
  if (!heights || fx < 0 || fz < 0 || fx >= GRID || fz >= GRID) return SEA_FLOOR;
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, n = GRID + 1;
  const a = heights[j * n + i], b = heights[j * n + i + 1], c = heights[(j + 1) * n + i], d = heights[(j + 1) * n + i + 1];
  // triangles: (a, c, b) and (b, c, d)
  return u + v < 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v);
}

export function terrainNormal(x, z) {
  const e = CELL * 0.5;
  const hx = terrainHeight(x + e, z) - terrainHeight(x - e, z), hz = terrainHeight(x, z + e) - terrainHeight(x, z - e);
  const l = Math.hypot(hx, 2 * e, hz);
  return [-hx / l, 2 * e / l, -hz / l];
}

// ---------------------------------------------------------------- buildings you can hit (or land on the roof of)
// box: { x, z, hw, hd, rot, top, pad? } kept in a grid so lookups are quick
const ROOF_CELL = 250, roofGrid = new Map();
export const ROOFS = [];
export function addRoof(b) {
  ROOFS.push(b);
  const r = Math.hypot(b.hw, b.hd);
  for (let i = Math.floor((b.x - r) / ROOF_CELL); i <= Math.floor((b.x + r) / ROOF_CELL); i++)
    for (let j = Math.floor((b.z - r) / ROOF_CELL); j <= Math.floor((b.z + r) / ROOF_CELL); j++) {
      const k = i + ',' + j;
      if (!roofGrid.has(k)) roofGrid.set(k, []);
      roofGrid.get(k).push(b);
    }
}
function roofAt(x, z) {
  const list = roofGrid.get(Math.floor(x / ROOF_CELL) + ',' + Math.floor(z / ROOF_CELL));
  if (!list) return null;
  for (const b of list) {
    const c = Math.cos(b.rot), s = Math.sin(b.rot), dx = x - b.x, dz = z - b.z;
    if (Math.abs(dx * c + dz * s) < b.hw && Math.abs(-dx * s + dz * c) < b.hd) return b;
  }
  return null;
}

// highest solid thing at a point: ground or a building roof
export function solidHeight(x, z) {
  const rf = roofAt(x, z), t = Math.max(0, terrainHeight(x, z));
  return rf ? Math.max(rf.top, t) : t;
}

// ---------------------------------------------------------------- Sunny Town avenues: a wide clear canyon between the towers to fly down
// two straight avenues through the middle of the city (local x and local z), crossing at the park
export const AVE = { off: 15, half: 40, gap: 150 };   // local offset of the avenue line, clear half width, hoop spacing
export function aveLocal(t, x, z) { const c = Math.cos(t.rot), s = Math.sin(t.rot), dx = x - t.x, dz = z - t.z; return [dx * c - dz * s, dx * s + dz * c]; }
export function aveWorld(t, lx, lz) { const c = Math.cos(t.rot), s = Math.sin(t.rot); return [t.x + lx * c + lz * s, t.z - lx * s + lz * c]; }
let RUNS = null;
// [{ axis, dir:{x,z}, pts:[{x, y, z, R, sky, a}] }]: hoop spots down each avenue, low over the street
export function cityRuns() {
  if (RUNS) return RUNS;
  const t = TOWNS[0];
  RUNS = [0, 1].map(axis => {
    const at = a => aveWorld(t, axis ? AVE.off : a, axis ? a : AVE.off);
    const ok = a => { const [x, z] = at(a); return townMask(t, x, z) < 0.86 && terrainHeight(x, z) > 2; };
    let lo = AVE.off, hi = AVE.off;
    while (ok(lo - AVE.gap)) lo -= AVE.gap;
    while (ok(hi + AVE.gap)) hi += AVE.gap;
    const pts = [];
    let wv = 1;
    for (let a = lo, i = 0; a <= hi + 1; a += AVE.gap, i++) {
      const [cx, cz] = at(a), m = townMask(t, cx, cz);
      const end = i === 0 || a + AVE.gap > hi + 1 || Math.abs(a - AVE.off) < 110;   // ends, and where the two avenues cross
      const sky = !end && m < 0.7 && Math.abs(a - AVE.off) > 160 && i % 3 === 1;
      // slalom: hoops swing from side to side, with a tower standing in the road on the other side (so you can't go straight)
      const off = sky || end ? 0 : (wv = -wv) * 17;
      const [x, z] = aveWorld(t, axis ? AVE.off + off : a, axis ? a : AVE.off + off), g = terrainHeight(x, z);
      const low = !sky && !end && i % 3 === 0;                     // some hoops dip right down to the street
      pts.push({ x, z, g, y: g + (low ? 17 : sky ? 22 : 27), R: 13, a, sky, block: off ? -Math.sign(off) * (AVE.half - 13) : 0 });
    }
    const [x0, z0] = at(0), [x1, z1] = at(1);
    return { axis, dir: { x: x1 - x0, z: z1 - z0 }, pts };
  });
  return RUNS;
}
// is a building (local centre lx,lz, half sizes hw,hd) in the way of an avenue? returns how far to push it along local z / x
export function aveClear(lx, lz, hw, hd) {
  let px = 0, pz = 0;
  const need = AVE.half;
  if (Math.abs(lz - AVE.off) < need + hd) pz = (lz >= AVE.off ? 1 : -1) * (need + hd) + AVE.off - lz;
  if (Math.abs(lx - AVE.off) < need + hw) px = (lx >= AVE.off ? 1 : -1) * (need + hw) + AVE.off - lx;
  return [px, pz];
}

// ---------------------------------------------------------------- what's under a point (physics)
// returns { h, kind } kind: 'water' | 'land' | 'runway' | 'grass' | 'deck' | 'roof'
const under = { h: 0, kind: 'land', ap: null };
export function surfaceAt(x, z) {
  under.ap = null;
  const rf = roofAt(x, z);
  if (rf) { under.h = rf.top; under.kind = rf.pad ? 'deck' : 'roof'; return under; }
  // carrier deck
  const c = CARRIER, cl = runwayLocal({ x: c.x, z: c.z, hdg: c.hdg }, x, z);
  if (Math.abs(cl.along) < c.len / 2 && Math.abs(cl.side) < c.wid / 2) { under.h = c.deck; under.kind = 'deck'; return under; }
  const t = terrainHeight(x, z);
  if (t < 0.3) { under.h = 0; under.kind = 'water'; return under; }
  under.h = t; under.kind = 'land';
  for (const ap of AIRPORTS) {
    const { along, side } = runwayLocal(ap, x, z);
    if (Math.abs(along) < ap.len / 2 + 60 && side > -ap.wid / 2 - 30 && side < apronSide(ap)) {
      under.ap = ap;
      under.kind = Math.abs(side) < ap.wid / 2 + 4 && Math.abs(along) < ap.len / 2 ? (ap.surface === 'grass' ? 'grass' : 'runway') : 'grass';
      if (side > ap.wid / 2 + 30 && ap.surface !== 'grass') under.kind = 'runway'; // taxiway + apron are paved
      break;
    }
  }
  return under;
}

// ---------------------------------------------------------------- what kind of land (colours, trees, names)
export function biomeAt(x, z) {
  const h = terrainHeight(x, z);
  const { wm, wd, ww } = regionWeights(x, z);
  if (h < 0.3) return 'sea';
  if (h > 1250 + N.n2(x / 700, z / 700) * 150) return 'snow';
  if (wm > 0.5) return 'mountain';
  if (wd > 0.5) return 'desert';
  if (ww > 0.5) return 'forest';
  return 'beach';
}

export function placeName(x, z) {
  for (const ap of AIRPORTS) if (Math.hypot(x - ap.x, z - ap.z) < ap.len * 0.8) return ap.icon + ' ' + ap.name;
  for (const t of TOWNS) if (Math.hypot(x - t.x, z - t.z) < Math.max(t.w, t.d) * 0.7) return '🏘️ ' + t.name;
  if (Math.hypot(x - CARRIER.x, z - CARRIER.z) < 1200) return '🚢 Carrier';
  if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r * 1.5) return '🦆 Duck Lake';
  const b = biomeAt(x, z);
  return { sea: '🌊 Sea', snow: '❄️ Snowy Peaks', mountain: '⛰️ Mountains', desert: '🏜️ Desert', forest: '🌲 Forest', beach: '🏖️ Sunny Coast' }[b];
}

export { hash2, clamp, regionWeights, landMask };

// ---------------------------------------------------------------- roads and the railway
export const ROADS = [
  { kind: 'road', pts: [[-2600, 9000], [-600, 8650], [1200, 8250], [2500, 8050]] },
  { kind: 'road', pts: [[-2900, 8600], [-5000, 7700], [-7400, 6000], [-9200, 4400], [-8400, 3000], [-7350, 2350]] },
  { kind: 'road', pts: [[4200, 7900], [5100, 6600], [5900, 4600], [6200, 2600], [7300, 900], [8350, -300]] },
  { kind: 'road', pts: [[-2400, 8400], [-2000, 6000], [-2500, 3000], [-3100, 300], [-3600, -3300], [-2500, -4500], [-1600, -4950]] },
  { kind: 'road', pts: [[5900, 4600], [7800, 5300], [9400, 6200], [10800, 6800]] },
  { kind: 'road', pts: [[-9200, 4400], [-10400, 3000], [-11600, 1600]] },
  { kind: 'road', pts: [[-2500, 3000], [-3600, 1500], [-5000, 300]] },
  // the railway: Forest Farm - Farm Village - Sunny Town - past the airport - Oasis - Desert Strip
  { kind: 'rail', pts: [[-7300, 2600], [-8400, 3600], [-8800, 4900], [-7200, 6700], [-5200, 7900], [-3400, 8300], [-1500, 7300], [600, 6500], [3000, 6250], [5000, 5000], [6000, 3100], [7000, 1500], [8000, 200]] },
];
// smooth path, a point every `step` metres: [[x, y, z, dirX, dirZ], ...]
export function roadPath(road, step = 15) {
  const p = road.pts, out = [];
  const cr = (a, b, c, d, t) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], d = p[Math.min(p.length - 1, i + 2)];
    const len = Math.hypot(c[0] - b[0], c[1] - b[1]), n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push([cr(a[0], b[0], c[0], d[0], t), 0, cr(a[1], b[1], c[1], d[1], t)]);
    }
  }
  out.push([p[p.length - 1][0], 0, p[p.length - 1][1]]);
  for (let i = 0; i < out.length; i++) {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[2] - a[2]) || 1;
    out[i][3] = (b[0] - a[0]) / l; out[i][4] = (b[2] - a[2]) / l;
    out[i][1] = Math.max(0.5, terrainHeight(out[i][0], out[i][2])) + (road.kind === 'rail' ? 0.6 : 0.35);
  }
  // smooth the heights a bit so cars don't jump
  for (let pass = 0; pass < 3; pass++) for (let i = 1; i < out.length - 1; i++) out[i][1] = Math.max(out[i][1], (out[i - 1][1] + out[i + 1][1]) / 2);
  return out;
}
