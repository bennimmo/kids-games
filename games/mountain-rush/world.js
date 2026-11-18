// Mountain Rush: builds the mountain, the routes and where trees/rocks/plants go.
// Pure maths (no 3D), from a fixed seed, so every device makes the same mountain.
//
// x = across the mountain (-W/2..W/2), z = downhill (0 = top), y = up. 1 grid cell = 1 m.
// Each route is a line of points 1 m apart. Two routes per map share the start and the finish,
// split, cross and tangle in between. Each grid cell knows its nearest point on each route,
// so the ground is shaped around them: smoothed trail, berms on turns, jumps, drops, rollers.
// Near the trail the ground is worked out exactly (no grid) so jump lips stay sharp.
import { makeNoise, rng, clamp, lerp, smooth } from '../sky-pilot/noise.js';
import { MAPS, BIOMES } from './biomes.js';
export { MAPS, BIOMES };

const RIB = 4;            // the fine trail mesh covers each route out to halfW + RIB
const CP_EVERY = 220;     // metres downhill between checkpoints

export function buildWorld(mapId = 'pine-ridge') {
  const M = MAPS[mapId] || MAPS['pine-ridge'];
  const B = BIOMES[M.biome];
  const ST = { twist: 1, width: 0, minG: 0.07, maxG: 0.36, drop: 1, ...(M.style || {}) };
  const { W, L } = M;
  const NX = W + 1, NZ = L + 1, HALF = W / 2;
  const nz = makeNoise(M.seed), r = rng(M.seed * 31 + 5);

  // ---------------------------------------------------------------- natural mountain
  const nat = (x, z) => {
    const t = clamp(z / L, 0, 1);
    let h = M.top * Math.pow(1 - t, 1.12);
    h += Math.pow(Math.abs(x) / HALF, 2) * 70;                          // valley sides rise
    h += (nz.fbm(x / 260 + 3, z / 260, 3) - 0.5) * M.hills;             // big hills
    h += (nz.ridged(x / 90, z / 90 + 9, 4) - 0.5) * M.ridges;           // ridges and gullies
    if (B.terrace) {                                                     // desert: stepped mesas away from the middle
      const k = smooth(60, 160, Math.abs(x)) * 0.8, st = B.terrace, f = h / st, fl = Math.floor(f), fr = f - fl;
      h = lerp(h, (fl + smooth(0.55, 0.85, fr)) * st, k);
    }
    h += (nz.fbm(x / 18, z / 18 + 40, 2) - 0.5) * 2.2;                  // lumps
    return h;
  };

  // ---------------------------------------------------------------- route lines
  const ph = Array.from({ length: 6 }, () => r() * 6.3);
  const tw = ST.twist;
  const xA = z => smooth(0, 70, z) * (95 * Math.sin(z / 150 + ph[0]) + 38 * tw * Math.sin(z / 61 + ph[1]) + 16 * tw * Math.sin(z / 27 + ph[2]) + 6 * tw * tw * Math.sin(z / 14.5 + ph[3] * 2));
  const env = z => smooth(70, 170, z) * (1 - smooth(L - 230, L - 120, z));
  const xB = z => xA(z) + env(z) * (68 * Math.sin(z / 96 + ph[3]) + 26 * Math.sin(z / 41 + ph[4]) + 12 * Math.sin(z / 19 + ph[5]));
  const lines = [xA, xB].map(fx => makeLine(fx, L, HALF));

  // trail heights: route A follows the smoothed ground; route B too, but matches A where they meet
  const MIN_G = ST.minG, MAX_G = ST.maxG;
  const gradeFix = (yc, pull) => {
    for (let it = 0; it < 3; it++) {
      for (let i = 1; i < yc.length; i++) yc[i] = clamp(yc[i], yc[i - 1] - MAX_G, yc[i - 1] - MIN_G);
      for (let i = yc.length - 2; i >= 0; i--) yc[i] = clamp(yc[i], yc[i + 1] + MIN_G, yc[i + 1] + MAX_G);
      yc = blur(yc, 8);
      if (pull) pull(yc);
    }
    return yc;
  };
  const A = lines[0], Bl = lines[1];
  A.yc = gradeFix(blur(Float32Array.from(A.x, (x, i) => nat(x, A.z[i])), 30));
  // nearest A point for every B point (both lines go steadily downhill, so search near the same z)
  const near = (P, Q) => {
    const ni = new Int32Array(P.n), nd = new Float32Array(P.n);
    let j0 = 0;
    for (let i = 0; i < P.n; i++) {
      while (j0 < Q.n - 1 && Q.z[j0] < P.z[i] - 60) j0++;
      let best = j0, bd = 1e9;
      for (let j = j0; j < Q.n && Q.z[j] < P.z[i] + 60; j++) { const d = (P.x[i] - Q.x[j]) ** 2 + (P.z[i] - Q.z[j]) ** 2; if (d < bd) { bd = d; best = j; } }
      ni[i] = best; nd[i] = Math.sqrt(bd);
    }
    return { ni, nd };
  };
  const BtoA = near(Bl, A), AtoB = near(A, Bl);
  const pullB = yc => { for (let i = 0; i < Bl.n; i++) { const w = 1 - smooth(4, 24, BtoA.nd[i]); yc[i] = lerp(yc[i], A.yc[BtoA.ni[i]], w); } };
  Bl.yc = blur(Float32Array.from(Bl.x, (x, i) => nat(x, Bl.z[i])), 30);
  pullB(Bl.yc);
  Bl.yc = gradeFix(Bl.yc, pullB);
  A.busy = Float32Array.from(AtoB.nd, (d, i) => (A.z[i] > 150 && A.z[i] < L - 250 && d < 26 ? 1 : 0));   // A keeps features where the lines share
  Bl.busy = Float32Array.from(BtoA.nd, d => (d < 26 ? 1 : 0));

  // ---------------------------------------------------------------- features
  // Every route gets a run of course features, picked in turn from the map's list (biomes.js):
  //   dirt jumps:  kicker, table, gap, double, triple, hip (landing off to one side), stepdown (landing far below)
  //   wood:        woodkicker (steep plank ramp), woodstep (jump up onto a plank deck, ride it, drop off the end),
  //                skinny (a raised plank to balance along), plus plank berms on some turns
  //   ground:      drop, stepup, rollers, whoops, rocks
  //   steep+tricky: tech (rocky pitch), stairs (rock steps down a pitch)
  const routes = lines.map((ln, ri) => {
    const N = ln.n, feats = [];
    const START = 12, FINISH = N - 15;
    const kinds = M.routes[ri].kinds;
    const STRAIGHT = new Set(['kicker', 'table', 'gap', 'double', 'triple', 'hip', 'stepdown', 'woodkicker', 'woodstep', 'drop', 'stepup', 'skinny']);
    let s = 64, k = 0;
    while (s < FINISH - 70) {
      let maxC = 0, busy = 0;
      for (let j = s - 4; j < s + 44 && j < N; j++) { if (j < 0) continue; maxC = Math.max(maxC, Math.abs(ln.curvS[j])); busy = Math.max(busy, ln.busy[j]); }
      if (busy) { s += 6; continue; }
      let kind = kinds[k % kinds.length];
      if (STRAIGHT.has(kind) && maxC > 0.015) {
        // too twisty here for a jump: something that works on a bend instead, or move on
        if (maxC < 0.034 && r() < 0.6) kind = ['rocks', 'rollers', 'whoops'][Math.floor(r() * 3)]; else { s += 6; continue; }
      }
      k++;
      const grade = (ln.yc[Math.max(0, s - 40)] - ln.yc[s]) / 40;
      if ((kind === 'stepup' || kind === 'woodstep') && grade < 0.12) kind = 'table';     // these need speed coming in
      const gapAfter = 17 + r() * 8;
      const kick = (s0, o) => { const f = { kind: 'kicker', s: s0, ll: 14, off: 0, ...o }; f.hl = f.table ? f.hk * 0.8 : f.hk * 0.95; f.face = f.table ? 0.01 : 1.8 * (f.hl + 0.3); f.end = s0 + f.lk + f.gap + f.ll + f.face; feats.push(f); return f; };
      if (kind === 'kicker') s = kick(s, r() < 0.5 ? { lk: 7.5, hk: 2.3, gap: 11, hoop: r() < 0.6 } : { lk: 6, hk: 1.6, gap: 7, table: true }).end + gapAfter;
      else if (kind === 'table') s = kick(s, { lk: 6.5, hk: 1.8, gap: 8, table: true }).end + gapAfter;
      else if (kind === 'gap') s = kick(s, { lk: 8, hk: 2.6, gap: 12.5, ll: 15, hoop: true }).end + gapAfter;
      else if (kind === 'double') { const f = kick(s, { lk: 6.5, hk: 1.9, gap: 9 }); s = kick(f.end + 4, { lk: 6, hk: 1.6, gap: 8, table: true }).end + gapAfter; }
      else if (kind === 'triple') { let e = s; for (let q = 0; q < 3; q++) e = kick(e, { lk: 4.5, hk: 1.15, gap: 4.5, ll: 7, table: true }).end + 1.5; s = e + gapAfter; }
      else if (kind === 'hip') s = kick(s, { lk: 6.5, hk: 1.9, gap: 8, off: (r() < 0.5 ? -1 : 1) * 2.7 }).end + gapAfter;
      else if (kind === 'woodkicker') s = kick(s, { lk: 4.6, hk: 2.1, gap: 9.5, ll: 15, wood: true, hoop: r() < 0.4 }).end + gapAfter;
      else if (kind === 'stepdown') { const f = { kind, s, lk: 6, hk: 1.4, gap: 8, ll: 14, D: 2.4, ret: 170 }; f.end = s + f.lk + f.gap + f.ll; feats.push(f); s = f.end + gapAfter + 6; }
      else if (kind === 'woodstep') {
        const f = { kind, s, lk: 4.5, hk: 1.3, gap: 1.6, top: 9 };
        const a0 = Math.min(N - 1, Math.floor(s + f.lk)), a1 = Math.min(N - 1, Math.floor(s + f.lk + f.gap));
        f.hp = f.hk - 0.25 + (ln.yc[a0] - ln.yc[a1]);            // deck sits just below the lip, so it's easy to land on
        f.end = s + f.lk + f.gap + f.top + 0.5; feats.push(f); s = f.end + gapAfter + 8;
      }
      else if (kind === 'drop') { const f = { kind, s, d: ((ri ? 1.9 : 1.5) + r() * 0.8) * ST.drop, run: 26, land: 9 * Math.sqrt(ST.drop) }; f.end = s + f.land; feats.push(f); s = f.end + gapAfter + 8; }
      else if (kind === 'stepup') {
        const f = { kind, s, lk: 5, hk: 1.6, gap: 3, face: 1, top: 10, down: 9 };
        const a0 = Math.min(N - 1, Math.floor(s + f.lk)), a1 = Math.min(N - 1, Math.floor(s + f.lk + f.gap + f.face));
        f.hp = f.hk + 0.15 + (ln.yc[a0] - ln.yc[a1]);
        f.face = 2.4 * (f.hp - 0.2);                             // a rideable face, so coming up short isn't a trap
        f.end = s + f.lk + f.gap + f.face + f.top + f.down; feats.push(f); s = f.end + gapAfter;
      }
      else if (kind === 'tech') { const f = { kind, s, len: 26, D: 2.8, ret: 170 }; f.end = s + f.len; feats.push(f); s = f.end + gapAfter + 4; }
      else if (kind === 'stairs') { const f = { kind, s, n: 4, sp: 4.5, st: 0.5, ret: 170 }; f.D = f.n * f.st; f.end = s + f.n * f.sp; feats.push(f); s = f.end + gapAfter + 4; }
      else if (kind === 'skinny') { const f = { kind, s, len: 18 }; f.end = s + f.len; feats.push(f); s = f.end + gapAfter; }
      else if (kind === 'whoops') { const f = { kind: 'rollers', s, n: 6, wl: 3.6, a: 0.36 }; f.end = s + f.n * f.wl; feats.push(f); s = f.end + gapAfter; }
      else if (kind === 'rollers') { const f = { kind, s, n: 4, wl: 9, a: 0.45 }; f.end = s + f.n * f.wl; feats.push(f); s = f.end + gapAfter; }
      else { const f = { kind: 'rocks', s, len: 22 }; f.end = s + f.len; feats.push(f); s = f.end + gapAfter; }
    }
    // the trail gets wider at jumps so you can ride round them (and out of a gap if you come up short)
    let widen = new Float32Array(N);
    for (const f of feats) if (['kicker', 'stepup', 'woodstep', 'stepdown'].includes(f.kind)) for (let i = Math.max(0, Math.floor(f.s - 6)); i < Math.min(N, f.end + 4); i++) widen[i] = f.off ? 2.6 : 1.6;
    widen = blur(widen, 5);
    // plank berms: every other proper turn gets a taller wooden wall on the outside
    let woodBerm = new Float32Array(N);
    { let run = 0, count = 0;
      for (let i = START + 30; i < FINISH - 10; i++) {
        if (Math.abs(ln.curvS[i]) > 0.021) run++; else { if (run >= 12) { if (count++ % 2 === 0) for (let j = i - run; j < i; j++) woodBerm[j] = 1; } run = 0; }
      }
      woodBerm = blur(woodBerm, 3); }
    // sideways shape of a narrow feature: full height within `fw` of its centre line `c`, gone by fw + edge
    const nar = (d, c = 0, fw = 1.5, edge = 1.5) => 1 - smooth(fw, fw + edge, Math.abs(d - c));
    const featAt = (sc, d) => {
      let hN = 0, hW = 0, jump = 0, rough = 0, wood = 0;
      for (const f of feats) {
        const u = sc - f.s;
        if (f.kind === 'tech') {
          if (sc > f.s && sc < f.end + f.ret) hW += -f.D * smooth(f.s, f.end, sc) + f.D * smooth(f.end, f.end + f.ret, sc);
          if (sc > f.s - 1 && sc < f.end + 2) {
            const fade = smooth(f.s - 1, f.s + 2, sc) * (1 - smooth(f.end - 1, f.end + 2, sc));
            hW += fade * Math.max(0, nz.n2(sc / 1.7, d / 1.3 + 13 + ri * 7)) * 0.42;
            rough = Math.max(rough, fade);
          }
        } else if (f.kind === 'stairs') {
          if (sc > f.s - 1 && sc < f.end + f.ret) {
            let dn = 0; for (let q = 0; q < f.n; q++) dn += f.st * smooth(f.s + q * f.sp + 2, f.s + q * f.sp + 2.45, sc);
            hW += -dn + f.D * smooth(f.end, f.end + f.ret, sc);
            if (sc < f.end + 1) { const fade = smooth(f.s - 1, f.s + 1, sc) * (1 - smooth(f.end - 1, f.end + 1, sc)); rough = Math.max(rough, fade * 0.7); jump = 1; hW += fade * Math.max(0, nz.n2(sc / 2.2 + 5, d / 1.6)) * 0.12; }
          }
        } else if (f.kind === 'stepdown') {
          if (sc > f.s - 1 && sc < f.end + f.ret) {
            if (u < f.lk) hN += f.hk * Math.pow(clamp(u / f.lk, 0, 1), 1.9) * nar(d);
            else if (u < f.lk + 1.5) hN += f.hk * (1 - smooth(f.lk, f.lk + 1.5, u)) * nar(d);
            hW += -f.D * smooth(f.s + f.lk + 1, f.end, sc) + f.D * smooth(f.end, f.end + f.ret, sc);
            if (sc < f.end) jump = 1;
          }
        } else if (f.kind === 'drop') {
          if (sc > f.s - f.run && sc < f.s) hW += f.d * smooth(f.s - f.run, f.s - f.run * 0.35, sc);
          else if (sc >= f.s && sc < f.end) { hW += f.d * 0.45 * Math.pow(1 - (sc - f.s) / (f.end - f.s), 1.8); jump = 1; }
          if (sc > f.s - 3 && sc < f.s) jump = 1;
        } else if (sc < f.s - 1 || sc > f.end + 1) {
          // not near this one
        } else if (f.kind === 'stepup') {
          jump = 1;
          const g0 = f.lk + f.gap, g1 = g0 + f.face, g2 = g1 + f.top;
          let h;
          if (u < f.lk) h = f.hk * Math.pow(clamp(u / f.lk, 0, 1), 1.9);
          else if (u < f.lk + 1.2) h = lerp(f.hk, 0.2, smooth(f.lk, f.lk + 1.2, u));
          else if (u < g0) h = 0.2;
          else if (u < g1) h = lerp(0.2, f.hp, smooth(g0, g1, u));
          else if (u < g2) h = f.hp;
          else h = f.hp * (1 - smooth(g2, f.end - f.s, u));
          hN += h * nar(d);
        } else if (f.kind === 'woodstep') {
          jump = 1;
          const g0 = f.lk + f.gap, g2 = g0 + f.top;
          if (u < f.lk) hN += f.hk * Math.pow(clamp(u / f.lk, 0, 1), 1.9) * nar(d);                    // dirt kicker
          else if (u < f.lk + 0.8) hN += lerp(f.hk, 0.1, smooth(f.lk, f.lk + 0.8, u)) * nar(d);
          else if (u < g0 - 0.15) hN += 0.1 * nar(d);
          else {                                                                                       // the plank deck: square sides, drop off the end
            const deck = smooth(g0 - 0.15, g0 + 0.1, u) * (1 - smooth(g2, g2 + 0.3, u));
            hN += f.hp * deck * nar(d, 0, 1.7, 0.5);
            wood = Math.max(wood, (u < g2 + 0.35 ? 1 : 0) * nar(d, 0, 2.0, 0.25));
          }
        } else if (f.kind === 'kicker') {
          jump = 1;
          const back = 1.6, low = f.table ? f.hk * 0.8 : -0.3;
          if (u < f.lk) { hN += f.hk * Math.pow(clamp(u / f.lk, 0, 1), 1.9) * (f.wood ? nar(d, 0, 1.55, 0.5) : nar(d)); }
          else if (u < f.lk + back) { const t = (u - f.lk) / back; hN += lerp(f.hk, low, 0.5 - 0.5 * Math.cos(t * Math.PI)) * (f.wood && !f.table ? nar(d, 0, 1.55, 0.5) : nar(d)); }
          else if (u < f.lk + f.gap) { hN += low * nar(d); }                                                    // gap (or table top)
          else {
            const v = u - f.lk - f.gap;
            const hh = v < f.face ? lerp(low, f.hl, smooth(0, f.face, v)) : f.hl * (1 - smooth(0, 1, clamp((v - f.face) / f.ll, 0, 1)));   // back face, then the long landing
            hN += hh * (f.off ? nar(d, f.off, 1.9, 1.6) : nar(d));
          }
          if (f.wood && u > -0.2 && u < f.lk + back) wood = Math.max(wood, nar(d, 0, 1.85, 0.25));
        } else if (f.kind === 'skinny') {
          const fade = smooth(0, 2.5, u) * (1 - smooth(f.len - 2.5, f.len, u));
          hW += -0.75 * fade * smooth(0.5, 0.95, Math.abs(d));       // the ground drops away each side of the plank
          wood = Math.max(wood, fade * (1 - smooth(0.55, 0.7, Math.abs(d))));
          jump = 1;
        } else if (f.kind === 'rollers') {
          const t = u / f.wl;
          if (t > 0 && t < f.n) hW += f.a * (1 - Math.cos(t * 2 * Math.PI)) * 0.5;
        } else if (f.kind === 'rocks') {
          const fade = smooth(0, 3, u) * (1 - smooth(f.len - 3, f.len, u));
          hW += fade * Math.max(0, nz.n2(sc / 1.7, d / 1.5 + 77 + ri * 31)) * 0.45;
        }
      }
      return { hN, hW, jump, rough, wood };
    };
    const halfW = i => { i = clamp(i, 0, N - 1); const i0 = Math.floor(i), i1 = Math.min(N - 1, i0 + 1), f = i - i0; return 2.7 + ST.width + Math.min(1.6, Math.abs(lerp(ln.curvS[i0], ln.curvS[i1], f)) * 50) + lerp(widen[i0], widen[i1], f); };
    return { id: ri, name: M.routes[ri].name, x: ln.x, z: ln.z, tx: ln.tx, tz: ln.tz, curvS: ln.curvS, yc: ln.yc, n: N, start: START, finish: FINISH, feats, featAt, halfW, woodBerm };
  });

  // ---------------------------------------------------------------- ground shape near a route
  const trailHeight = (R, x, z, i) => {
    const N = R.n;
    let ox = x - R.x[i], oz = z - R.z[i];
    const along = ox * R.tx[i] + oz * R.tz[i];
    const sc = clamp(i + along, 0, N - 1);
    const i0 = Math.floor(sc), i1 = Math.min(N - 1, i0 + 1), fr = sc - i0;
    const cx = lerp(R.x[i0], R.x[i1], fr), cz = lerp(R.z[i0], R.z[i1], fr);
    let ttx = lerp(R.tx[i0], R.tx[i1], fr), ttz = lerp(R.tz[i0], R.tz[i1], fr); const tl = Math.hypot(ttx, ttz) || 1; ttx /= tl; ttz /= tl;
    ox = x - cx; oz = z - cz;
    const d = ox * ttz - oz * ttx;                  // + = toward +x side
    const y = lerp(R.yc[i0], R.yc[i1], fr);
    const w = R.halfW(sc);
    const ad = Math.abs(d);
    const c = lerp(R.curvS[i0], R.curvS[i1], fr);
    // berm: the outside of the turn rises. Plank berms are taller and steeper.
    const wb = lerp(R.woodBerm[i0], R.woodBerm[i1], fr), outside = -c * Math.sign(d) > 0;
    const bank = clamp(-c * Math.sign(d) * 85, 0, 2.1) * (1 + 0.45 * wb) * Math.pow(clamp(ad / (w + 2), 0, 1.25), 1.5 - 0.3 * wb);
    const f = R.featAt(sc, d);
    const wide = 1 - smooth(w - 0.2, w + 2.4, ad);
    const dish = -0.12 * (1 - smooth(0, w, ad));
    const wood = Math.max(f.wood, outside ? wb * smooth(1.5, 2.3, ad) * (1 - smooth(w + 2.3, w + 3.0, ad)) : 0);
    return { y: y + bank + f.hN + f.hW * wide + dish, d, ad, w, sc, jump: f.jump, wood, rough: f.rough * (1 - smooth(w - 0.3, w + 0.8, ad)) };
  };
  const nearestOnLine = (R, x, z, i) => {
    let best = i, bd = 1e9;
    for (let j = Math.max(0, i - 3); j <= Math.min(R.n - 1, i + 3); j++) { const dd = (x - R.x[j]) ** 2 + (z - R.z[j]) ** 2; if (dd < bd) { bd = dd; best = j; } }
    return best;
  };
  const maskOf = (t, R) => (1 - smooth(t.w - 0.6, t.w + 0.8 + (t.jump ? 1.6 : 0), t.ad)) * (t.sc > 0.5 && t.sc < R.n - 1.5 ? 1 : 0);

  // nearest point on each route for every grid cell
  const NR = routes.length;
  const nearI = routes.map(() => new Int32Array(NX * NZ).fill(-1));
  const nearD = routes.map(() => new Float32Array(NX * NZ).fill(1e9));
  const RAD = 22;
  routes.forEach((R, ri) => {
    const nI = nearI[ri], nD = nearD[ri];
    for (let i = 0; i < R.n; i++) {
      const cx = R.x[i] + HALF, cz = R.z[i];
      const x0 = Math.max(0, Math.floor(cx - RAD)), x1 = Math.min(NX - 1, Math.ceil(cx + RAD));
      const z0 = Math.max(0, Math.floor(cz - RAD)), z1 = Math.min(NZ - 1, Math.ceil(cz + RAD));
      for (let gz = z0; gz <= z1; gz++) for (let gx = x0; gx <= x1; gx++) {
        const d2 = (gx - cx) ** 2 + (gz - cz) ** 2, id = gz * NX + gx;
        if (d2 < nD[id]) { nD[id] = d2; nI[id] = i; }
      }
    }
  });

  // ground height from all routes nearby (they agree where they cross)
  const tmpT = [];
  const shape = (x, z, id, out, withSink) => {
    const n0 = nat(x, z);
    let sum = 0, wsum = 0, m = 0, sink = 0, inRib = false, best = 1e9, bestR = -1, bestI = -1, rough = 0, wood = 0, tsc = 0, tdd = 0;
    for (let ri = 0; ri < NR; ri++) {
      const i = nearI[ri][id];
      if (i < 0) continue;
      const R = routes[ri], t = trailHeight(R, x, z, nearestOnLine(R, x, z, i));
      tmpT[ri] = t;
      const wt = 1 - smooth(t.w + 1.5, t.w + 16, t.ad);
      sum += wt * (t.y - n0); wsum += wt;
      m = Math.max(m, maskOf(t, R)); rough = Math.max(rough, t.rough);
      if (withSink) sink = Math.max(sink, 0.5 * (1 - smooth(t.w + RIB - 1.4, t.w + RIB - 0.2, t.ad)));
      if (t.ad < t.w + RIB) inRib = true;
      if (t.wood > wood) wood = t.wood;
      if (t.ad - t.w < best) { best = t.ad - t.w; bestR = ri; bestI = i; tsc = t.sc; tdd = t.d; }
    }
    out.h = n0 + (wsum > 0 ? sum / Math.max(1, wsum) : 0) - sink;
    out.m = m; out.rough = rough; out.wood = wood; out.sc = tsc; out.dd = tdd; out.inRib = inRib; out.edge = best; out.r = bestR; out.i = bestI;
    return out;
  };

  const H = new Float32Array(NX * NZ);
  const mask = new Float32Array(NX * NZ);
  const sh = {};
  for (let gz = 0; gz < NZ; gz++) for (let gx = 0; gx < NX; gx++) {
    const id = gz * NX + gx;
    shape(gx - HALF, gz, id, sh, true);
    H[id] = sh.h; mask[id] = sh.m;
  }

  // ---------------------------------------------------------------- lookups
  const cellId = (x, z) => clamp(Math.round(z), 0, NZ - 1) * NX + clamp(Math.round(x + HALF), 0, NX - 1);
  const gridHeight = (x, z) => {
    const fx = clamp(x + HALF, 0, NX - 1.001), fz = clamp(z, 0, NZ - 1.001);
    const ix = Math.floor(fx), iz = Math.floor(fz), ax = fx - ix, az = fz - iz;
    const i = iz * NX + ix;
    const a = H[i], b = H[i + 1], c = H[i + NX], d = H[i + NX + 1];
    return (a * (1 - ax) + b * ax) * (1 - az) + (c * (1 - ax) + d * ax) * az;
  };
  const nearRib = id => { for (let ri = 0; ri < NR; ri++) { const i = nearI[ri][id]; if (i >= 0 && nearD[ri][id] < (routes[ri].halfW(i) + RIB + 0.8) ** 2) return true; } return false; };
  const ex = {};
  const height = (x, z) => {
    const id = cellId(x, z);
    if (nearRib(id)) { shape(x, z, id, ex, false); if (ex.inRib) return ex.h; }
    return gridHeight(x, z);
  };
  const exact = (x, z, out = {}) => shape(x, z, cellId(x, z), out, false);
  const normal = (x, z, out = {}) => {
    const e = 0.3;
    const hx = height(x + e, z) - height(x - e, z), hz = height(x, z + e) - height(x, z - e);
    const nx = -hx, ny = 2 * e, nzz = -hz, l = Math.hypot(nx, ny, nzz);
    out.x = nx / l; out.y = ny / l; out.z = nzz / l;
    return out;
  };
  // how rocky the ground is here (tech sections): 0..1
  const roughAt = (x, z) => { const id = cellId(x, z); return nearRib(id) ? shape(x, z, id, ex, false).rough : 0; };
  const trailMask = (x, z) => {
    const id = cellId(x, z);
    if (nearRib(id)) return shape(x, z, id, ex, false).m;
    return mask[id];
  };
  // nearest route point: { r, i, d } (i = -1 when far from every route)
  const trailAt = (x, z) => {
    const id = cellId(x, z);
    let r0 = 0, i0 = -1, d0 = 1e9;
    for (let ri = 0; ri < NR; ri++) { const i = nearI[ri][id]; if (i >= 0 && nearD[ri][id] < d0) { d0 = nearD[ri][id]; i0 = i; r0 = ri; } }
    return { r: r0, i: i0, d: Math.sqrt(d0) };
  };
  const pathPoint = (i, ri = 0) => {
    const R = routes[ri];
    i = clamp(Math.round(i), 0, R.n - 1);
    return { x: R.x[i], z: R.z[i], y: height(R.x[i], R.z[i]), yaw: Math.atan2(R.tx[i], R.tz[i]), i, r: ri };
  };
  // index on a route at a given distance downhill (lines always go downhill)
  const indexAtZ = (R, z) => { let lo = 0, hi = R.n - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (R.z[m] < z) lo = m + 1; else hi = m; } return lo; };

  // checkpoints: levels down the mountain, a gate on each route (where they're apart)
  const startZ = routes[0].z[routes[0].start], finishZ = routes[0].z[routes[0].finish];
  const checkpoints = [{ k: 0, z: startZ, gates: [pathPoint(routes[0].start - 6, 0)] }];
  for (let z = startZ + CP_EVERY, k = 1; z < finishZ - 90; z += CP_EVERY, k++) {
    const gates = routes.map((R, ri) => pathPoint(indexAtZ(R, z), ri));
    const g = Math.hypot(gates[0].x - gates[1].x, gates[0].z - gates[1].z) < 9 ? [gates[0]] : gates;   // one gate where the lines share
    checkpoints.push({ k, z, gates: g });
  }
  const finish = pathPoint(routes[0].finish, 0);
  // hoops to fly through over some of the jumps (bonus points)
  const hoops = [];
  for (const R of routes) for (const f of R.feats) if (f.hoop) {
    const p = pathPoint(f.s + f.lk + f.gap * 0.42, R.id), base = R.yc[Math.min(R.n - 1, Math.round(f.s + f.lk))];
    hoops.push({ x: p.x, z: p.z, y: base + f.hk + 1.35, yaw: p.yaw, r: 1.75, ground: height(p.x, p.z) });
  }

  // ---------------------------------------------------------------- trees, plants, logs, rocks
  const trees = [], rocks = [], plants = [], logs = [];
  const clearOf = (x, z, extra) => {
    const t = trailAt(x, z);
    if (t.i < 0) return true;
    return t.d > routes[t.r].halfW(t.i) + extra;
  };
  const pick = list => { let u = r(), acc = 0; for (const [k, w] of list) { acc += w; if (u <= acc) return k; } return list[list.length - 1][0]; };
  const nrm = {};
  const start = pathPoint(routes[0].start - 6, 0);
  for (let z = 4; z < L - 4; z += 5.5) for (let x = -HALF + 4; x < HALF - 4; x += 5.5) {
    const jx = x + (r() - 0.5) * 5, jz = z + (r() - 0.5) * 5;
    const dens = nz.fbm(jx / 70 + 20, jz / 70, 3);
    if (r() > smooth(0.32, 0.6, dens) * B.trees.density) continue;
    if (!clearOf(jx, jz, 3.2)) continue;
    normal(jx, jz, nrm);
    if (nrm.y < 0.72) continue;
    if (Math.hypot(jx - start.x, jz - start.z) < 22) continue;
    trees.push({ x: jx, z: jz, y: height(jx, jz), s: 0.75 + r() * 0.6, rot: r() * 6.3, kind: pick(B.trees.kinds), tint: r() });
  }
  for (let z = 4; z < L - 4; z += 2.6) for (let x = -HALF + 4; x < HALF - 4; x += 2.6) {
    if (r() > B.plants.density * 0.5) continue;
    const jx = x + (r() - 0.5) * 2.4, jz = z + (r() - 0.5) * 2.4;
    const dens = nz.fbm(jx / 40 + 7, jz / 40, 2);
    if (r() > smooth(0.35, 0.65, dens)) continue;
    if (!clearOf(jx, jz, 0.9)) continue;
    plants.push({ x: jx, z: jz, y: height(jx, jz), s: 0.6 + r() * 0.8, rot: r() * 6.3, kind: pick(B.plants.kinds), tint: r() });
  }
  if (B.logs) for (let z = 20; z < L - 20; z += 14) for (let x = -HALF + 10; x < HALF - 10; x += 14) {
    if (r() > B.logs * 0.18) continue;
    const jx = x + (r() - 0.5) * 12, jz = z + (r() - 0.5) * 12;
    if (!clearOf(jx, jz, 4)) continue;
    logs.push({ x: jx, z: jz, y: height(jx, jz), rot: r() * 6.3, len: 3 + r() * 5, rad: 0.18 + r() * 0.2 });
  }
  for (let z = 4; z < L - 4; z += 9) for (let x = -HALF + 4; x < HALF - 4; x += 9) {
    const jx = x + (r() - 0.5) * 8, jz = z + (r() - 0.5) * 8;
    if (r() > (B.terrace ? 0.4 : 0.22)) continue;
    if (!clearOf(jx, jz, 1.2)) continue;
    rocks.push({ x: jx, z: jz, y: height(jx, jz), s: 0.4 + r() * r() * (B.terrace ? 3.4 : 2.2), rot: r() * 6.3, tilt: r() });
  }
  // little rocks along the trail edges
  for (const R of routes) for (let i = R.start + 20; i < R.finish; i += 3) {
    if (r() > 0.3) continue;
    const side = r() < 0.5 ? -1 : 1, w = R.halfW(i) + 0.7 + r() * 1.8;
    const x = R.x[i] + R.tz[i] * w * side, z = R.z[i] - R.tx[i] * w * side;
    if (!clearOf(x, z, 0.5)) continue;
    rocks.push({ x, z, y: height(x, z), s: 0.18 + r() * 0.35, rot: r() * 6.3, tilt: r() });
  }

  // loose rocks sticking out of the tech sections
  for (const R of routes) for (const f of R.feats) if (f.kind === 'tech') for (let k2 = 0; k2 < 40; k2++) {
    const i = Math.floor(f.s + 1 + r() * (f.len - 2)), w = R.halfW(i), d = (r() * 2 - 1) * (w + 0.6);
    const x = R.x[i] + R.tz[i] * d, z = R.z[i] - R.tx[i] * d;
    rocks.push({ x, z, y: height(x, z), s: 0.2 + r() * 0.35, rot: r() * 6.3, tilt: r() });
  }

  // tree + log lookup grid (8 m cells) for crashes
  const TG = 8, tgw = Math.ceil(W / TG) + 1, tgrid = new Map();
  const solid = trees.map(t => ({ x: t.x, z: t.z, y: t.y, rr: t.kind === 'cactus' ? 0.45 : 0.5 + 0.25 * t.s }));
  solid.forEach((t, idx) => { const k2 = Math.floor((t.x + HALF) / TG) + Math.floor(t.z / TG) * tgw; if (!tgrid.has(k2)) tgrid.set(k2, []); tgrid.get(k2).push(idx); });
  const treesNear = (x, z) => {
    const cx = Math.floor((x + HALF) / TG), cz = Math.floor(z / TG), out = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const l = tgrid.get(cx + a + (cz + b) * tgw); if (l) for (const i of l) out.push(solid[i]); }
    return out;
  };

  return {
    id: mapId, name: M.name, biome: M.biome, B, W, L, NX, NZ, HALF, H, mask, RIB,
    height, normal, trailMask, roughAt, trailAt, pathPoint, treesNear, exact,
    routes, path: routes[0],
    checkpoints, finish, start, startZ, finishZ, hoops,
    trees, rocks, plants, logs,
  };
}

// a line down the mountain from x(z), resampled to points 1 m apart, with direction and curvature
function makeLine(fx, L, HALF) {
  const raw = [];
  for (let z = 30; z <= L - 50; z += 0.25) raw.push([clamp(fx(z), -HALF + 40, HALF - 40), z]);
  const x = [raw[0][0]], z = [raw[0][1]];
  let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    const dx = raw[i][0] - raw[i - 1][0], dz = raw[i][1] - raw[i - 1][1], d = Math.hypot(dx, dz);
    acc += d;
    while (acc >= 1) { acc -= 1; const k = 1 - acc / d; x.push(raw[i - 1][0] + dx * k); z.push(raw[i - 1][1] + dz * k); }
  }
  const n = x.length;
  const tx = new Float32Array(n), tz = new Float32Array(n), curv = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 2), b = Math.min(n - 1, i + 2);
    const dx = x[b] - x[a], dz = z[b] - z[a], d = Math.hypot(dx, dz) || 1;
    tx[i] = dx / d; tz[i] = dz / d;
  }
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 4), b = Math.min(n - 1, i + 4);
    let da = Math.atan2(tx[b], tz[b]) - Math.atan2(tx[a], tz[a]);
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    curv[i] = da / Math.max(1, b - a);            // + = turning toward +x
  }
  return { x: Float32Array.from(x), z: Float32Array.from(z), tx, tz, curvS: blur(curv, 10), n };
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
