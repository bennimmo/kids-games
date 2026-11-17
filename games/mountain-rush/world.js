// Mountain Rush: builds the mountain, the trail and where trees/rocks go.
// Pure maths (no 3D), from a fixed seed, so every device makes the same mountain.
//
// x = across the mountain (-W/2..W/2), z = downhill (0 = top), y = up. 1 grid cell = 1 m.
// The trail is a line of points 1 m apart. Each grid cell knows its nearest trail point,
// so the ground can be shaped: smoothed trail, berms on turns, jumps, drops, rollers.
import { makeNoise, rng, clamp, lerp, smooth } from '../sky-pilot/noise.js';

export const MAPS = {
  'pine-ridge': { name: 'Pine Ridge', seed: 7, W: 480, L: 1300, top: 330, sub: 'Forest flow, berms and jumps' },
};

export function buildWorld(mapId = 'pine-ridge') {
  const M = MAPS[mapId];
  const { W, L } = M;
  const NX = W + 1, NZ = L + 1, HALF = W / 2;
  const nz = makeNoise(M.seed), r = rng(M.seed * 31 + 5);

  // ---------------------------------------------------------------- natural mountain
  const nat = (x, z) => {
    const t = clamp(z / L, 0, 1);
    let h = M.top * Math.pow(1 - t, 1.12);
    h += Math.pow(Math.abs(x) / HALF, 2) * 70;                        // valley sides rise
    h += (nz.fbm(x / 260 + 3, z / 260, 3) - 0.5) * 34;                // big hills
    h += (nz.ridged(x / 90, z / 90 + 9, 4) - 0.5) * 10;               // ridges and gullies
    h += (nz.fbm(x / 18, z / 18 + 40, 2) - 0.5) * 2.2;                // lumps
    return h;
  };

  // ---------------------------------------------------------------- trail line
  const ph = [r() * 6.3, r() * 6.3, r() * 6.3, r() * 6.3];
  const wig = z => {
    const fade = smooth(0, 70, z);
    return fade * (95 * Math.sin(z / 150 + ph[0]) + 38 * Math.sin(z / 61 + ph[1]) + 14 * Math.sin(z / 27 + ph[2]));
  };
  const raw = [];
  for (let z = 30; z <= L - 50; z += 0.25) raw.push([clamp(wig(z), -HALF + 40, HALF - 40), z]);
  // resample every 1 m along the line
  const px = [], pz = [];
  px.push(raw[0][0]); pz.push(raw[0][1]);
  let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    const dx = raw[i][0] - raw[i - 1][0], dz = raw[i][1] - raw[i - 1][1], d = Math.hypot(dx, dz);
    acc += d;
    while (acc >= 1) { acc -= 1; const k = 1 - acc / d; px.push(raw[i - 1][0] + dx * k); pz.push(raw[i - 1][1] + dz * k); }
  }
  const N = px.length;
  const tx = new Float32Array(N), tz = new Float32Array(N), curv = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const a = Math.max(0, i - 2), b = Math.min(N - 1, i + 2);
    const dx = px[b] - px[a], dz = pz[b] - pz[a], d = Math.hypot(dx, dz) || 1;
    tx[i] = dx / d; tz[i] = dz / d;
  }
  for (let i = 0; i < N; i++) {
    const a = Math.max(0, i - 4), b = Math.min(N - 1, i + 4);
    let da = Math.atan2(tx[b], tz[b]) - Math.atan2(tx[a], tz[a]);
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    curv[i] = da / Math.max(1, b - a);               // + = turning toward +x (left on screen)
  }
  // smooth curvature so berms grow and fade gently
  const curvS = blur(curv, 10);

  // trail height: smoothed ground, always going down a bit
  let yc = new Float32Array(N);
  for (let i = 0; i < N; i++) yc[i] = nat(px[i], pz[i]);
  yc = blur(yc, 30);
  // keep the grade between gentle and steep (no uphill, no cliffs)
  const MIN_G = 0.07, MAX_G = 0.36;
  for (let it = 0; it < 3; it++) {
    for (let i = 1; i < N; i++) yc[i] = clamp(yc[i], yc[i - 1] - MAX_G, yc[i - 1] - MIN_G);
    for (let i = N - 2; i >= 0; i--) yc[i] = clamp(yc[i], yc[i + 1] + MIN_G, yc[i + 1] + MAX_G);
    yc = blur(yc, 8);
  }

  // ---------------------------------------------------------------- features (jumps, drops, rollers, rock gardens)
  const feats = [];
  const START = 12, FINISH = N - 15;
  let s = 70;
  const kinds = ['kicker', 'rollers', 'kicker', 'drop', 'kicker', 'rocks', 'double', 'kicker', 'drop', 'rollers'];
  let k = 0;
  while (s < FINISH - 60) {
    // need a fairly straight bit
    let maxC = 0;
    for (let j = s; j < s + 40 && j < N; j++) maxC = Math.max(maxC, Math.abs(curvS[j]));
    if (maxC > 0.012) { s += 6; continue; }
    const kind = kinds[k % kinds.length]; k++;
    if (kind === 'kicker') {
      const big = r() < 0.4;
      const f = { kind, s, lk: big ? 7.5 : 6, hk: big ? 2.3 : 1.6, gap: big ? 11 : 7, ll: 14, table: !big };
      f.hl = f.table ? f.hk * 0.8 : f.hk * 0.95; f.end = s + f.lk + f.gap + f.ll + 3.2; feats.push(f); s = f.end + 30;
    } else if (kind === 'double') {
      const f = { kind: 'kicker', s, lk: 6.5, hk: 1.9, gap: 9, ll: 13 }; f.hl = f.hk; f.end = s + f.lk + f.gap + f.ll + 3.2; feats.push(f);
      const g = { kind: 'kicker', s: f.end + 4, lk: 6, hk: 1.6, gap: 8, ll: 13, table: true }; g.hl = g.hk * 0.8; g.end = g.s + g.lk + g.gap + g.ll; feats.push(g);
      s = g.end + 30;
    } else if (kind === 'drop') {
      const f = { kind, s, d: 1.5 + r() * 0.8, run: 26, land: 9 }; f.end = s + f.land; feats.push(f); s = f.end + 35;
    } else if (kind === 'rollers') {
      const f = { kind, s, n: 4, wl: 7, a: 0.55 }; f.end = s + f.n * f.wl; feats.push(f); s = f.end + 25;
    } else {
      const f = { kind: 'rocks', s, len: 22 }; f.end = s + f.len; feats.push(f); s = f.end + 25;
    }
  }
  // the trail gets wider at jumps so you can ride round them (and out of a gap if you come up short)
  let widen = new Float32Array(N);
  for (const f of feats) if (f.kind === 'kicker') for (let i = Math.max(0, Math.floor(f.s - 6)); i < Math.min(N, f.end + 4); i++) widen[i] = 1.6;
  widen = blur(widen, 5);
  const featAt = (sc, d) => {
    let h = 0, jump = 0, narrow = 0;
    for (const f of feats) {
      if (f.kind === 'drop') {
        if (sc > f.s - f.run && sc < f.s) h += f.d * smooth(f.s - f.run, f.s - f.run * 0.35, sc);
        else if (sc >= f.s && sc < f.end) { h += f.d * 0.45 * (1 - smooth(f.s, f.end, sc)); jump = 1; }
        if (sc > f.s - 3 && sc < f.s) jump = 1;
        continue;
      }
      if (sc < f.s - 1 || sc > f.end + 1) continue;
      const u = sc - f.s;
      if (f.kind === 'kicker') {
        jump = 1; narrow = 1;
        const back = 1.6, low = f.table ? f.hk * 0.8 : -0.3, face = f.table ? 0.01 : 3.2;
        if (u < f.lk) { const t = clamp(u / f.lk, 0, 1); h += f.hk * Math.pow(t, 1.9); }
        else if (u < f.lk + back) { const t = (u - f.lk) / back; h += lerp(f.hk, low, 0.5 - 0.5 * Math.cos(t * Math.PI)); }
        else if (u < f.lk + f.gap) { h += low; }                                                               // gap (or table top)
        else {
          const v = u - f.lk - f.gap;
          if (v < face) { const t = v / face; h += lerp(low, f.hl, Math.sin(t * Math.PI / 2)); }              // back face up to the knuckle
          else { const t = clamp((v - face) / f.ll, 0, 1); h += f.hl * (1 - smooth(0, 1, t)); }              // long landing down
        }
      } else if (f.kind === 'rollers') {
        const t = u / f.wl;
        if (t > 0 && t < f.n) h += f.a * (1 - Math.cos(t * 2 * Math.PI)) * 0.5;
      } else if (f.kind === 'rocks') {
        const fade = smooth(0, 3, u) * (1 - smooth(f.len - 3, f.len, u));
        const v = nz.n2(sc / 1.7, d / 1.5 + 77);
        h += fade * Math.max(0, v) * 0.45;
      }
    }
    return { h, jump, narrow };
  };

  // ---------------------------------------------------------------- bake the ground grid
  const H = new Float32Array(NX * NZ);
  const mask = new Float32Array(NX * NZ);      // 1 = dirt trail
  const nearI = new Int32Array(NX * NZ).fill(-1);
  const nearD = new Float32Array(NX * NZ).fill(1e9);
  const R = 22;
  for (let i = 0; i < N; i++) {
    const cx = px[i] + HALF, cz = pz[i];
    const x0 = Math.max(0, Math.floor(cx - R)), x1 = Math.min(NX - 1, Math.ceil(cx + R));
    const z0 = Math.max(0, Math.floor(cz - R)), z1 = Math.min(NZ - 1, Math.ceil(cz + R));
    for (let gz = z0; gz <= z1; gz++) for (let gx = x0; gx <= x1; gx++) {
      const d2 = (gx - cx) ** 2 + (gz - cz) ** 2;
      const id = gz * NX + gx;
      if (d2 < nearD[id]) { nearD[id] = d2; nearI[id] = i; }
    }
  }
  const halfW = i => { i = clamp(i, 0, N - 1); const i0 = Math.floor(i), i1 = Math.min(N - 1, i0 + 1), f = i - i0; return 2.7 + Math.min(1.2, Math.abs(lerp(curvS[i0], curvS[i1], f)) * 40) + lerp(widen[i0], widen[i1], f); };
  const trailHeight = (x, z, i) => {
    // continuous position along and across the line
    let ox = x - px[i], oz = z - pz[i];
    const along = ox * tx[i] + oz * tz[i];
    const sc = clamp(i + along, 0, N - 1);
    const i0 = Math.floor(sc), i1 = Math.min(N - 1, i0 + 1), fr = sc - i0;
    // point and direction on the line at sc
    const cx = lerp(px[i0], px[i1], fr), cz = lerp(pz[i0], pz[i1], fr);
    let ttx = lerp(tx[i0], tx[i1], fr), ttz = lerp(tz[i0], tz[i1], fr); const tl = Math.hypot(ttx, ttz) || 1; ttx /= tl; ttz /= tl;
    ox = x - cx; oz = z - cz;
    const d = ox * ttz - oz * ttx;                  // + = toward +x side
    const y = lerp(yc[i0], yc[i1], fr);
    const w = halfW(sc);
    const ad = Math.abs(d);
    // berm: outside of the turn rises
    const c = lerp(curvS[i0], curvS[i1], fr);
    const bank = clamp(-c * Math.sign(d) * 55, 0, 1.4) * Math.pow(clamp(ad / (w + 2), 0, 1.2), 1.6);
    const f = featAt(sc, d);
    // jumps sit in the middle with a ride-round on each side; other features use the full width
    const shoulder = f.narrow ? 1 - smooth(1.5, 2.6, ad) : 1 - smooth(w - 0.2, w + 2.4, ad);
    // a gentle dip worn into the middle
    const dish = -0.12 * (1 - smooth(0, w, ad));
    return { y: y + bank + f.h * shoulder + dish, d, w, sc, jump: f.jump };
  };
  const nearestOnLine = (x, z, i) => {
    let best = i, bd = 1e9;
    for (let j = Math.max(0, i - 3); j <= Math.min(N - 1, i + 3); j++) { const dd = (x - px[j]) ** 2 + (z - pz[j]) ** 2; if (dd < bd) { bd = dd; best = j; } }
    return best;
  };
  // exact ground height + dirt amount near the trail (what the ribbon mesh and the physics use)
  const exactAt = (x, z, i, out) => {
    const t = trailHeight(x, z, nearestOnLine(x, z, i));
    const ad = Math.abs(t.d);
    const wt = 1 - smooth(t.w + 1.5, t.w + 16, ad);
    out.h = lerp(nat(x, z), t.y, wt);
    out.m = (1 - smooth(t.w - 0.6, t.w + 0.8 + (t.jump ? 1.6 : 0), ad)) * (t.sc > 0.5 && t.sc < N - 1.5 ? 1 : 0);
    out.d = ad; out.w = t.w;
    return out;
  };
  const RIB = 4;      // the ribbon mesh covers the trail out to halfW + RIB

  for (let gz = 0; gz < NZ; gz++) for (let gx = 0; gx < NX; gx++) {
    const id = gz * NX + gx, x = gx - HALF, z = gz;
    const n0 = nat(x, z);
    const i = nearI[id];
    if (i < 0) { H[id] = n0; continue; }
    const t = trailHeight(x, z, nearestOnLine(x, z, i));
    const ad = Math.abs(t.d);
    const wt = 1 - smooth(t.w + 1.5, t.w + 16, ad);
    // under the ribbon the grid sinks a little so it never pokes through it
    H[id] = lerp(n0, t.y, wt) - 0.5 * (1 - smooth(t.w + RIB - 1.4, t.w + RIB - 0.2, ad));
    mask[id] = (1 - smooth(t.w - 0.6, t.w + 0.8 + (t.jump ? 1.6 : 0), ad)) * (t.sc > 0.5 && t.sc < N - 1.5 ? 1 : 0);
  }

  // ---------------------------------------------------------------- lookups
  const ex = { h: 0, m: 0, d: 0, w: 0 };
  const gridHeight = (x, z) => {
    const fx = clamp(x + HALF, 0, NX - 1.001), fz = clamp(z, 0, NZ - 1.001);
    const ix = Math.floor(fx), iz = Math.floor(fz), ax = fx - ix, az = fz - iz;
    const i = iz * NX + ix;
    const a = H[i], b = H[i + 1], c = H[i + NX], d = H[i + NX + 1];
    return (a * (1 - ax) + b * ax) * (1 - az) + (c * (1 - ax) + d * ax) * az;
  };
  const height = (x, z) => {
    const ix = clamp(Math.round(x + HALF), 0, NX - 1), iz = clamp(Math.round(z), 0, NZ - 1), id = iz * NX + ix, i = nearI[id];
    if (i >= 0 && nearD[id] < (halfW(i) + RIB + 0.8) ** 2) { exactAt(x, z, i, ex); if (ex.d < ex.w + RIB) return ex.h; }
    return gridHeight(x, z);
  };
  const normal = (x, z, out = {}) => {
    const e = 0.3;
    const hx = height(x + e, z) - height(x - e, z), hz = height(x, z + e) - height(x, z - e);
    const nx = -hx, ny = 2 * e, nzz = -hz, l = Math.hypot(nx, ny, nzz);
    out.x = nx / l; out.y = ny / l; out.z = nzz / l;
    return out;
  };
  const trailMask = (x, z) => {
    const ix = clamp(Math.round(x + HALF), 0, NX - 1), iz = clamp(Math.round(z), 0, NZ - 1), id = iz * NX + ix, i = nearI[id];
    if (i >= 0 && nearD[id] < (halfW(i) + 3) ** 2) return exactAt(x, z, i, ex).m;
    return mask[id];
  };
  // nearest trail point (index along the trail) and distance, or -1 when far away
  const trailAt = (x, z) => {
    const ix = clamp(Math.round(x + HALF), 0, NX - 1), iz = clamp(Math.round(z), 0, NZ - 1);
    const id = iz * NX + ix;
    return { i: nearI[id], d: Math.sqrt(nearD[id]) };
  };
  const pathPoint = i => {
    i = clamp(Math.round(i), 0, N - 1);
    return { x: px[i], z: pz[i], y: height(px[i], pz[i]), yaw: Math.atan2(tx[i], tz[i]), i };
  };

  // checkpoints every ~220 m
  const checkpoints = [];
  for (let i = START; i < FINISH - 100; i += 220) checkpoints.push(pathPoint(i));
  const finish = pathPoint(FINISH);

  // ---------------------------------------------------------------- trees and rocks
  const trees = [], rocks = [];
  const keepClear = (x, z, extra) => {
    const t = trailAt(x, z);
    if (t.i < 0) return false;
    const w = halfW(t.i);
    if (t.d < w + extra) return true;
    // keep the fly-zone over jumps clear
    return false;
  };
  const nrm = {};
  for (let z = 4; z < L - 4; z += 5.5) for (let x = -HALF + 4; x < HALF - 4; x += 5.5) {
    const jx = x + (r() - 0.5) * 5, jz = z + (r() - 0.5) * 5;
    const dens = nz.fbm(jx / 70 + 20, jz / 70, 3);
    if (r() > smooth(0.32, 0.6, dens) * 0.85) continue;
    if (keepClear(jx, jz, 3.2)) continue;
    normal(jx, jz, nrm);
    if (nrm.y < 0.72) continue;
    // near the start gate leave an open area
    if (Math.hypot(jx - px[0], jz - pz[0]) < 22) continue;
    trees.push({ x: jx, z: jz, y: height(jx, jz), s: 0.75 + r() * 0.6, rot: r() * 6.3, kind: r() < 0.18 ? 1 : 0, tint: r() });
  }
  for (let z = 4; z < L - 4; z += 9) for (let x = -HALF + 4; x < HALF - 4; x += 9) {
    const jx = x + (r() - 0.5) * 8, jz = z + (r() - 0.5) * 8;
    if (r() > 0.22) continue;
    if (keepClear(jx, jz, 1.2)) continue;
    rocks.push({ x: jx, z: jz, y: height(jx, jz), s: 0.4 + r() * r() * 2.2, rot: r() * 6.3, tilt: r() });
  }
  // little rocks along the trail edges
  for (let i = START + 20; i < FINISH; i += 3) {
    if (r() > 0.35) continue;
    const side = r() < 0.5 ? -1 : 1, w = halfW(i) + 0.7 + r() * 1.8;
    const x = px[i] + tz[i] * w * side, z = pz[i] - tx[i] * w * side;
    rocks.push({ x, z, y: height(x, z), s: 0.18 + r() * 0.35, rot: r() * 6.3, tilt: r() });
  }

  // tree lookup grid (8 m cells) for crashes
  const TG = 8, tgw = Math.ceil(W / TG) + 1, tgrid = new Map();
  trees.forEach((t, idx) => { const k2 = Math.floor((t.x + HALF) / TG) + Math.floor(t.z / TG) * tgw; if (!tgrid.has(k2)) tgrid.set(k2, []); tgrid.get(k2).push(idx); });
  const treesNear = (x, z) => {
    const cx = Math.floor((x + HALF) / TG), cz = Math.floor(z / TG), out = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const l = tgrid.get(cx + a + (cz + b) * tgw); if (l) for (const i of l) out.push(trees[i]); }
    return out;
  };

  return {
    id: mapId, name: M.name, W, L, NX, NZ, HALF, H, mask,
    height, normal, trailMask, trailAt, pathPoint, treesNear,
    exact: (x, z, out = {}) => { const ix = clamp(Math.round(x + HALF), 0, NX - 1), iz = clamp(Math.round(z), 0, NZ - 1), i = nearI[iz * NX + ix]; return exactAt(x, z, i < 0 ? 0 : i, out); },
    RIB,
    path: { x: px, z: pz, tx, tz, n: N, start: START, finish: FINISH, halfW },
    feats, checkpoints, finish, trees, rocks,
    start: pathPoint(START - 6),
  };
}

function blur(arr, rad) {
  const n = arr.length, out = new Float32Array(n);
  let sum = 0, cnt = 0;
  for (let i = 0; i < Math.min(n, rad); i++) { sum += arr[i]; cnt++; }
  for (let i = 0; i < n; i++) {
    const add = i + rad, rem = i - rad - 1;
    if (add < n) { sum += arr[add]; cnt++; }
    if (rem >= 0) { sum -= arr[rem]; cnt--; }
    out[i] = sum / cnt;
  }
  return out;
}
