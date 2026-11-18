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
  // tech zones: a stretch where the trail zig-zags hard between trees (after a steep rocky pitch).
  // Picked where the two routes are well apart, so the wiggles never run into the other trail.
  const pickZones = (own, other, want) => {
    const out = [];
    for (let z = 270; z < L - 340 && out.length < want; z += 15) {
      let clear = true;
      for (let q = z - 30; q < z + 100; q += 6) if (Math.abs(own(q) - other(q)) < 30) { clear = false; break; }
      if (clear && (!out.length || z - out[out.length - 1].z0 > 210)) out.push({ z0: z, len: 78, amp: 4.6, lam: 30 });
    }
    return out;
  };
  const zonesA = pickZones(xA, xB, 2), zonesB = pickZones(xB, xA, 3);
  const zig = (zones, z) => { let o = 0; for (const q of zones) if (z > q.z0 && z < q.z0 + q.len) o += q.amp * Math.sin((z - q.z0) / q.lam * Math.PI * 2) * smooth(q.z0, q.z0 + 5, z) * (1 - smooth(q.z0 + q.len - 8, q.z0 + q.len, z)); return o; };
  const lines = [z => xA(z) + zig(zonesA, z), z => xB(z) + zig(zonesB, z)].map(fx => makeLine(fx, L, HALF));
  lines[0].zones = zonesA; lines[1].zones = zonesB;

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
  Bl.yc = blur(Bl.yc, 4);        // no sudden steps where the nearest point on A jumps
  A.busy = Float32Array.from(AtoB.nd, (d, i) => (A.z[i] > 150 && A.z[i] < L - 250 && d < 13 ? 1 : 0));   // A keeps features where the lines share
  Bl.busy = Float32Array.from(BtoA.nd, d => (d < 13 ? 1 : 0));

  // where the routes cross (at a decent angle): [{ i: [index on A, index on B], gap, jumper }]
  const crossings = [];
  {
    let prev = 0, n = 0;
    for (let j = 40; j < Bl.n - 40; j++) {
      const i = BtoA.ni[j], side = Math.sign((Bl.x[j] - A.x[i]) * A.tz[i] - (Bl.z[j] - A.z[i]) * A.tx[i]);
      if (prev && side && side !== prev && BtoA.nd[j] < 2.5 && A.z[i] > 190 && A.z[i] < L - 280) {
        const ang = Math.abs(Math.asin(clamp(A.tx[i] * Bl.tz[j] - A.tz[i] * Bl.tx[j], -1, 1)));
        // long enough that the take-off and landing mounds (about 2.6 m wide each side) stay off the other trail
        const gap = 2 * (2.05 + ST.width + 0.5 + 2.0 * Math.cos(ang)) / Math.max(0.2, Math.sin(ang));
        // the jumper needs a fairly straight, downhill run-in (for speed)
        const straight = q => { let m = 0; const [ln2, c0] = q ? [Bl, j] : [A, i]; for (let t = c0 - 24; t < c0 + 26; t++) m = Math.max(m, Math.abs(ln2.curvS[clamp(t, 0, ln2.n - 1)])); return m < 0.022 && (ln2.yc[Math.max(0, c0 - 50)] - ln2.yc[Math.max(0, c0 - 8)]) / 42 > 0.11 && (ln2.yc[Math.max(0, c0 - 12)] - ln2.yc[Math.min(ln2.n - 1, c0 + 16)]) / 28 > 0.07; };
        const last = crossings[crossings.length - 1];
        if (ang > 0.62 && gap < 12 && (!last || j - last.i[1] > 90)) {
          const pick = n % 2;                                   // take turns: A jumps, then B
          const jumper = straight(pick) ? pick : straight(1 - pick) ? 1 - pick : -1;
          if (jumper >= 0) { crossings.push({ i: [i, j], gap: Math.max(9, gap), jumper }); n++; }
        }
        // road gap: the other trail dips into a cutting and you jump across the top of it.
        // No mounds needed, so the gap is short and works on flatter ground.
        const lastC = crossings[crossings.length - 1];
        if (ang > 0.85 && (!lastC || j - lastC.i[1] > 90)) {
          const okRun = q => { let m = 0; const [ln2, c0] = q ? [Bl, j] : [A, i]; for (let t = c0 - 26; t < c0 + 22; t++) m = Math.max(m, Math.abs(ln2.curvS[clamp(t, 0, ln2.n - 1)])); let step = 0; for (let t = c0 - 40; t < c0 + 20; t++) step = Math.max(step, Math.abs(ln2.yc[clamp(t, 0, ln2.n - 2)] - ln2.yc[clamp(t + 1, 1, ln2.n - 1)])); return step < 0.6 && m < 0.03 && (ln2.yc[Math.max(0, c0 - 45)] - ln2.yc[Math.max(0, c0 - 5)]) / 40 > 0.06; };
          const pick = n % 2, jumper = okRun(pick) ? pick : okRun(1 - pick) ? 1 - pick : -1;
          if (jumper >= 0) { const sx = A.tx[i] * Bl.tz[j] - A.tz[i] * Bl.tx[j];      // which side of the lower trail the jumper lands on
            crossings.push({ i: [i, j], gap: (2.0 + 3.2) / Math.sin(ang) + 2.2, jumper, cut: true, ang, es: jumper === 0 ? Math.sign(sx) : -Math.sign(sx) }); n++; }
        }
      }
      if (side) prev = side;
    }
  }

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
    // cross-over jumps: where the two routes cross, one of them jumps clean over the other
    const taken = new Float32Array(N);
    for (const c of crossings) if (c.jumper === ri) {
      const i0 = c.i[ri], half = c.gap / 2;
      // a low, long take-off (keeps your speed) and a low landing (more hang time), so it clears at a normal pace
      const f = c.cut ? { kind: 'kicker', s: i0 - 2.0 / Math.sin(c.ang) - 1.8 - 5.6, lk: 5.6, hk: 1.4, gap: c.gap, ll: 9, off: 0, flat: true, hoop: false, over: true, fw: 1.3, edge: 0.4 }
        : { kind: 'kicker', s: i0 - half - 8, lk: 8, hk: 1.9, gap: c.gap, ll: 14, off: 0, flat: true, hoop: true, over: true, fw: 1.2, edge: 0.4 };
      f.hl = c.cut ? 0.25 : f.hk * 0.35; f.face = c.cut ? 0.6 : 1.2; f.end = f.s + f.lk + f.gap + f.ll + f.face; feats.push(f);
      for (let j = Math.max(0, Math.floor(f.s - 22)); j < Math.min(N, f.end + 16); j++) taken[j] = 1;
    }
    // road gaps: this route is the one underneath, so it dips through a cutting
    for (const c of crossings) if (c.cut && c.jumper !== ri) {
      const i0 = c.i[ri], fl = 2.6 / Math.sin(c.ang) + 1.5;      // flat floor right under the jump
      const f = { kind: 'cut', s: i0 - fl - 13, end: i0 + fl + 13, fl, mid: i0, D: 2.1, es: c.es, sin: Math.sin(c.ang) }; feats.push(f);
      for (let j = Math.max(0, Math.floor(f.s - 20)); j < Math.min(N, f.end + 20); j++) taken[j] = 1;
    }
    // tech zones: steep rocky pitch on the way in, rock steps part-way through, nothing else inside
    const idxAtZ = z => { let lo = 0, hi = N - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (ln.z[m] < z) lo = m + 1; else hi = m; } return lo; };
    const zoneIdx = [];
    for (const q of ln.zones) {
      const i0 = idxAtZ(q.z0), i1 = idxAtZ(q.z0 + q.len);
      zoneIdx.push([i0, i1]);
      const t = { kind: 'tech', s: i0 + 5, len: 24, D: 2.8, ret: 170 }; t.end = t.s + t.len; feats.push(t);
      const st = { kind: 'stairs', s: Math.round(i0 + (i1 - i0) * 0.62), n: 3, sp: 4.5, st: 0.45, ret: 170 }; st.D = st.n * st.st; st.end = st.s + st.n * st.sp; feats.push(st);
      for (let j = Math.max(0, i0 - 40); j < Math.min(N, i1 + 14); j++) taken[j] = 1;
    }
    { const wallD = ri ? BtoA.nd : AtoB.nd;
      // wall rides: a tall plank wall round the outside of a proper bend. Ride up it and carve back down
    { let run = 0, lastW = -999, nW = 0;
      for (let i = START + 40; i < FINISH - 40 && nW < 3; i++) {
        if (Math.abs(ln.curvS[i]) > 0.024 && !taken[i]) { run++; continue; }
        if (run >= 9 && i - run - lastW > 120) {
          const len = Math.min(22, run + 6), s = Math.round(i - run / 2 - len / 2);
          let ok = true; for (let j = s - 5; j < s + len + 5; j++) if (taken[clamp(j, 0, N - 1)] || wallD[clamp(j, 0, N - 1)] < 12) ok = false;
          if (ok) {
            const f = { kind: 'wallride', s, len, end: s + len, side: -Math.sign(ln.curvS[Math.round(s + len / 2)]), d0: 1.15 + ST.width * 0.5, wd: 3.8, sl: 0.42, filler: true };
            feats.push(f); lastW = s; nW++;
            for (let j = Math.max(0, s - 22); j < Math.min(N, f.end + 16); j++) taken[j] = 1;
          }
        }
        run = 0;
      }
    }
    }
    let s = 64, k = 0;
    while (s < FINISH - 70) {
      s = Math.round(s);                 // whole metres: the checks below index the route's points
      let maxC = 0, busy = 0;
      for (let j = s; j < s + 32 && j < N; j++) maxC = Math.max(maxC, Math.abs(ln.curvS[j]));
      // the whole feature, its run-in and its landing run-out must be clear of the other route (and of cross-over jumps)
      for (let j = Math.max(0, s - 14); j < s + 52 && j < N; j++) busy = Math.max(busy, ln.busy[j], taken[j]);
      if (busy) { s += 6; continue; }
      let kind = kinds[k % kinds.length];
      if (STRAIGHT.has(kind) && maxC > 0.026) {
        // too twisty here for a jump: something that works on a bend instead, or move on
        // (the jump stays next in line for the next straight)
        if (r() < 0.4) { kind = ['rollers', 'lowtable', 'whoops'][Math.floor(r() * 3)]; k--; } else { s += 5; continue; }
      }
      k++;
      const grade = (ln.yc[Math.max(0, s - 40)] - ln.yc[s]) / 40;
      if ((kind === 'stepup' || kind === 'woodstep') && grade < 0.09) kind = 'table';     // these need speed coming in
      // rocky pitches belong before a bend, not in the middle of a straight
      // rocks only live in the tech zones (sharp turns round trees), never out on a straight
      if (kind === 'tech' || kind === 'rocks' || kind === 'stairs') kind = grade > 0.13 ? 'drop' : ['rollers', 'table', 'whoops'][k % 3];
      const gapAfter = 17 + r() * 8;
      const kick = (s0, o) => { const f = { kind: 'kicker', s: s0, ll: 14, off: 0, ...o }; f.hl = f.table ? f.hk * 0.8 : f.hk * 0.95; f.face = f.table ? 0.01 : 1.8 * (f.hl + 0.3); f.end = s0 + f.lk + f.gap + f.ll + f.face; feats.push(f); return f; };
      if (kind === 'kicker') s = kick(s, r() < 0.5 ? { lk: 7.5, hk: 2.3, gap: 11, hoop: r() < 0.6 } : { lk: 6, hk: 1.6, gap: 7, table: true }).end + gapAfter;
      else if (kind === 'lowtable') s = kick(s, { lk: 4.5, hk: 1.15, gap: 4.5, ll: 7, table: true }).end + gapAfter;
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
    // fill the quiet stretches: compact features that don't need a straight or a big landing, so they fit
    // on bends and near the other route:
    //   ladder   - a plank ladder bridge humping over the rocks
    //   rockroll - a rock slab: the trail rises onto it, then rolls steeply off the front
    //   rollin   - up onto a timber deck, then down a steep plank ramp
    {
      const otherD = ri ? BtoA.nd : AtoB.nd;
      const used = new Uint8Array(N);
      for (const f of feats) for (let j = Math.max(0, Math.floor(f.s - 9)); j < Math.min(N, f.end + 11); j++) used[j] = 1;
      // where the two routes run together as one trail, route A owns the features; where they cross, nobody builds
      const oth = ri ? A : Bl, oi = ri ? BtoA.ni : AtoB.ni;
      for (let j = 0; j < N; j++) {
        const par = Math.abs(ln.tx[j] * oth.tz[oi[j]] - ln.tz[j] * oth.tx[oi[j]]) < 0.2;
        if (taken[j] || (otherD[j] < 9 && (ri === 1 || !par || otherD[j] > 4.5))) used[j] = 1;
      }
      let fk = ri;
      for (let s0 = START + 28; s0 < FINISH - 50; s0++) {
        let free = 0; while (s0 + free < FINISH - 40 && !used[s0 + free]) free++;
        if (free < 32) { s0 += free; continue; }
        // room for one every 36 m or so
        const count = Math.max(1, Math.floor((free - 2) / 30)), pitch = free / count;
        for (let q = 0; q < count; q++) {
          const s = Math.round(s0 + pitch * q + (pitch - 20) / 2);
          let c = 0; for (let j = s; j < s + 20; j++) c = Math.max(c, Math.abs(ln.curvS[j]));
          let kind = ['ladder', 'rockroll', 'rollin'][fk++ % 3];
          if (c > 0.03 && kind !== 'rockroll') kind = c > 0.05 ? 'rollers' : 'rockroll';
          let f;
          if (kind === 'ladder') f = { kind, s, len: 16 };
          else if (kind === 'rockroll') f = { kind, s, run: 11, h: 1.35, len: 3.2 };
          else if (kind === 'rollin') f = { kind, s, lk: 6, hk: 1.3, top: 3, down: 4.6 };
          else f = { kind: 'rollers', s, n: 3, wl: 6, a: 0.4 };
          f.filler = true;
          f.end = kind === 'ladder' ? s + f.len : kind === 'rockroll' ? s + f.run + f.len : kind === 'rollin' ? s + f.lk + f.top + f.down : s + f.n * f.wl;
          feats.push(f);
        }
        s0 += free;
      }
    }
    // the trail gets wider at jumps so you can ride round them (and out of a gap if you come up short)
    let widen = new Float32Array(N);
    for (const f of feats) if (['kicker', 'stepup', 'woodstep', 'stepdown'].includes(f.kind)) for (let i = Math.max(0, Math.floor(f.s - 6)); i < Math.min(N, f.end + 4); i++) widen[i] = f.off ? 2.4 : 0.9;
    widen = blur(widen, 5);
    // plank berms: every other proper turn gets a taller wooden wall on the outside
    let woodBerm = new Float32Array(N);
    { let run = 0, count = 0;
      for (let i = START + 30; i < FINISH - 10; i++) {
        if (Math.abs(ln.curvS[i]) > 0.021) run++; else { if (run >= 12) { if (count++ % 2 === 0) for (let j = i - run; j < i; j++) woodBerm[j] = 1; } run = 0; }
      }
      woodBerm = blur(woodBerm, 3); }
    // sideways shape of a narrow feature: full height within `fw` of its centre line `c`, gone by fw + edge
    const nar = (d, c = 0, fw = 1.45, edge = 0.4) => 1 - smooth(fw, fw + edge, Math.abs(d - c));      // steep sides: off the edge = drop off, not a ramp to slide on
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
        } else if (f.kind === 'cut') {
          const a = Math.abs(sc - f.mid);
          // steep walls, but a ramp out on the jumper's landing side, so coming up short isn't a trap
          const notch = (1 - smooth(1.0, 1.7, a * f.sin)) * (d * f.es > 0 ? 1 : 0);
          hN += -f.D * (1 - smooth(f.fl, f.fl + 13, a)) * lerp(1 - smooth(1.25, 2.0, Math.abs(d)), 1 - smooth(0.3, 3.2, Math.abs(d)), notch);
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
          const back = 1.6, low = f.table ? f.hk * 0.8 : f.flat ? 0 : -0.3;
          if (u < f.lk) { hN += f.hk * Math.pow(clamp(u / f.lk, 0, 1), 1.9) * (f.wood ? nar(d, 0, 1.55, 0.5) : f.fw ? nar(d, 0, f.fw, f.edge) : nar(d)); }
          else if (u < f.lk + back) { const t = (u - f.lk) / back; hN += lerp(f.hk, low, 0.5 - 0.5 * Math.cos(t * Math.PI)) * (f.wood && !f.table ? nar(d, 0, 1.55, 0.5) : nar(d)); }
          else if (u < f.lk + f.gap) { hN += low * nar(d); }                                                    // gap (or table top)
          else {
            const v = u - f.lk - f.gap;
            const hh = v < f.face ? lerp(low, f.hl, smooth(0, f.face, v)) : f.hl * (1 - smooth(0, 1, clamp((v - f.face) / f.ll, 0, 1)));   // back face, then the long landing
            hN += hh * (f.off ? nar(d, f.off, 2.0, 0.5) : f.fw ? nar(d, 0, f.fw + 0.4, f.edge) : nar(d));
          }
          if (f.wood && u > -0.2 && u < f.lk + back) wood = Math.max(wood, nar(d, 0, 1.85, 0.25));
        } else if (f.kind === 'wallride') {
          const dd = d * f.side, fade = smooth(0, 3, u) * (1 - smooth(f.len - 3, f.len, u));
          const on = 1 - smooth(f.d0 + f.wd, f.d0 + f.wd + 0.3, dd);                       // sheer drop off the back
          hN += clamp(dd - f.d0, 0, f.wd) * f.sl * fade * on;
          if (fade > 0.25 && dd > f.d0 - 0.15 && dd < f.d0 + f.wd + 0.3) wood = 1;
        } else if (f.kind === 'ladder') {
          const fade = smooth(0, 2.2, u) * (1 - smooth(f.len - 2.2, f.len, u));
          const side = nar(d, 0, 1.05, 0.22);
          hN += (0.3 + 0.45 * Math.sin(clamp(u / f.len, 0, 1) * Math.PI)) * fade * side;      // humps up in the middle like a bridge
          wood = Math.max(wood, (u > 0.6 && u < f.len - 0.6 ? 1 : 0) * nar(d, 0, 1.2, 0.2));
          hW += fade * Math.max(0, nz.n2(sc / 1.4 + 31, d / 1.1 + ri * 9)) * 0.3 * smooth(1.3, 2.0, Math.abs(d));   // rocks either side
        } else if (f.kind === 'rockroll') {
          if (u < f.run) hW += f.h * smooth(0, f.run, u);
          else hW += f.h * (1 - smooth(f.run, f.run + f.len, u));
          jump = 1;
        } else if (f.kind === 'rollin') {
          const g1 = f.lk + f.top;
          const side = nar(d, 0, 1.3, 0.3);
          if (u < f.lk) hN += f.hk * smooth(0, f.lk, u) * side;
          else if (u < g1) hN += f.hk * side;
          else hN += f.hk * (1 - clamp((u - g1) / f.down, 0, 1)) * side;
          if (u > f.lk - 0.3 && u < g1 + f.down + 0.2) wood = Math.max(wood, nar(d, 0, 1.45, 0.2));
          jump = 1;
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
    const halfW = i => { i = clamp(i, 0, N - 1); const i0 = Math.floor(i), i1 = Math.min(N - 1, i0 + 1), f = i - i0; return 2.05 + ST.width + Math.min(1.2, Math.abs(lerp(ln.curvS[i0], ln.curvS[i1], f)) * 45) + lerp(widen[i0], widen[i1], f); };
    return { id: ri, name: M.routes[ri].name, x: ln.x, z: ln.z, tx: ln.tx, tz: ln.tz, curvS: ln.curvS, yc: ln.yc, n: N, start: START, finish: FINISH, feats, featAt, halfW, woodBerm, zones: ln.zones, zoneIdx };
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
    // the whole trail tilts into the turn (like a banked track), so even the middle line holds you
    const tilt = clamp(-c * 11, -0.32, 0.32) * clamp(d, -w - 1, w + 1) * wide;
    const dish = -0.12 * (1 - smooth(0, w, ad));
    const wood = Math.max(f.wood, outside ? wb * smooth(1.5, 2.3, ad) * (1 - smooth(w + 2.3, w + 3.0, ad)) : 0);
    return { y: y + bank + tilt + f.hN + f.hW * wide + dish, d, ad, w, sc, jump: f.jump, wood, shaped: Math.min(1, Math.abs(f.hN) * 2), rough: f.rough * (1 - smooth(w - 0.3, w + 0.8, ad)) };
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
    let sum = 0, wsum = 0, wmax = 0, m = 0, sink = 0, inRib = false, best = 1e9, bestR = -1, bestI = -1, rough = 0, wood = 0, tsc = 0, tdd = 0;
    for (let ri = 0; ri < NR; ri++) {
      const i = nearI[ri][id];
      if (i < 0) continue;
      const R = routes[ri], t = trailHeight(R, x, z, nearestOnLine(R, x, z, i));
      tmpT[ri] = t;
      const wt = 1 - smooth(t.w + 1.5, t.w + 16, t.ad);
      const pr = wt * (0.02 + (1 - smooth(t.w - 0.5, t.w + 2.2, t.ad)) * (1 + 14 * t.shaped));     // priority: strongest on the trail itself, and on a built jump
      sum += pr * (t.y - n0); wsum += pr; wmax = Math.max(wmax, wt);
      m = Math.max(m, maskOf(t, R)); rough = Math.max(rough, t.rough);
      if (withSink) sink = Math.max(sink, 0.5 * (1 - smooth(t.w + RIB - 1.4, t.w + RIB - 0.2, t.ad)));
      if (t.ad < t.w + RIB) inRib = true;
      if (t.wood > wood) wood = t.wood;
      if (t.ad - t.w < best) { best = t.ad - t.w; bestR = ri; bestI = i; tsc = t.sc; tdd = t.d; }
    }
    out.h = n0 + (wsum > 0 ? sum / wsum * wmax : 0) - sink;
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
    // at a sharp edge (foot of a jump's side, lip of a drop) don't smear the slope across it:
    // use the gentler side, which is the ground the wheels are really on
    const h0 = height(x, z);
    const crease = (a, b) => { const sa = a - h0, sb = h0 - b; return Math.abs(sa - sb) > 0.08 ? 2 * (Math.abs(sa) < Math.abs(sb) ? sa : sb) : a - b; };
    const hx = crease(height(x + e, z), height(x - e, z)), hz = crease(height(x, z + e), height(x, z - e));
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

  // boulders flanking the rock rolls and ladder bridges
  for (const R of routes) for (const f of R.feats) if (f.kind === 'rockroll' || f.kind === 'ladder') for (let k2 = 0; k2 < 10; k2++) {
    const i = Math.floor(f.kind === 'rockroll' ? f.s + f.run - 3 + r() * (f.len + 4) : f.s + 1 + r() * (f.len - 2)), w = R.halfW(i);
    const d = (k2 % 2 ? 1 : -1) * (f.kind === 'rockroll' ? w + 0.5 + r() * 1.4 : 1.7 + r() * (w - 0.9));
    const x = R.x[i] + R.tz[i] * d, z = R.z[i] - R.tx[i] * d;
    rocks.push({ x, z, y: height(x, z), s: f.kind === 'rockroll' ? 0.7 + r() * 0.9 : 0.25 + r() * 0.4, rot: r() * 6.3, tilt: r() });
  }

  // tech zones: a padded tree on the inside of every hard turn (the thing you zig-zag round)
  const pads = [];
  for (const R of routes) for (const q of R.zones) for (let a = 0; a * q.lam / 2 + q.lam / 4 < q.len - 6; a++) {
    const i = indexAtZ(R, q.z0 + q.lam / 4 + a * q.lam / 2), c = R.curvS[i];
    if (Math.abs(c) < 0.012) continue;
    const dd = (R.halfW(i) + 0.75) * Math.sign(c), x = R.x[i] + R.tz[i] * dd, z = R.z[i] - R.tx[i] * dd;
    const t = { x, z, y: height(x, z), s: 0.85, rot: r() * 6.3, kind: B.trees.kinds[0][0], tint: r() };
    trees.push(t); pads.push({ x, z, y: t.y });
  }
  // roots: trees close to a trail send roots out across its edge
  const roots = [];
  for (const t of trees) {
    if (roots.length > 500 || t.kind === 'cactus') continue;
    const ta = trailAt(t.x, t.z); if (ta.i < 0) continue;
    const R = routes[ta.r], w = R.halfW(ta.i); if (ta.d > w + 3.4) continue;
    const ang = Math.atan2(R.x[ta.i] - t.x, R.z[ta.i] - t.z);
    for (let q = 0; q < 3; q++) { const a = ang + (q - 1) * 0.5 + (r() - 0.5) * 0.3, len = Math.min(ta.d + 0.6, 1.8 + r() * 2.2); roots.push({ x: t.x, z: t.z, y: t.y, rot: a, len }); }
  }
  // timber frames: legs, rails and cross-braces under the plank decks and behind the wall rides
  const timbers = [];
  for (const R of routes) {
    const pt = (sc, dd) => { const i0 = clamp(Math.floor(sc), 0, R.n - 2), fr = sc - i0, x = lerp(R.x[i0], R.x[i0 + 1], fr) + R.tz[i0] * dd, z = lerp(R.z[i0], R.z[i0 + 1], fr) - R.tx[i0] * dd; return { x, z, y: height(x, z) }; };
    // a row of legs along one side: the foot stands at dPost on the ground found at dGround, the head reaches the deck height found at dTop
    const frame = (u0, u1, dPost, dTop, dGround, step, minH = 0.45) => {
      let prev = null; const n = Math.max(1, Math.round((u1 - u0) / step));
      for (let k = 0; k <= n; k++) {
        const sc = u0 + (u1 - u0) * k / n, a = pt(sc, dPost), top = pt(sc, dTop).y - 0.06, bot = Math.min(pt(sc, dGround).y, a.y) - 0.25;
        if (top - bot < minH + 0.25) { prev = null; continue; }
        const cur = { x: a.x, z: a.z, top, bot };
        timbers.push({ x0: a.x, y0: bot, z0: a.z, x1: a.x, y1: top, z1: a.z, t: 0.13 });
        if (prev) {
          timbers.push({ x0: prev.x, y0: prev.top - 0.08, z0: prev.z, x1: a.x, y1: top - 0.08, z1: a.z, t: 0.1 });
          if (top - bot > 1.1 && prev.top - prev.bot > 1.1) timbers.push({ x0: prev.x, y0: prev.bot + 0.3, z0: prev.z, x1: a.x, y1: top - 0.25, z1: a.z, t: 0.07 });
        }
        prev = cur;
      }
    };
    for (const f of R.feats) {
      if (f.kind === 'woodstep') { const g0 = f.s + f.lk + f.gap; for (const sd of [-1, 1]) frame(g0, g0 + f.top, sd * 1.95, sd * 1.5, sd * 2.5, 2.25); }
      else if (f.kind === 'rollin') for (const sd of [-1, 1]) frame(f.s + f.lk - 0.2, f.s + f.lk + f.top + f.down - 0.6, sd * 1.5, sd * 1.15, sd * 2.0, 1.9);
      else if (f.kind === 'kicker' && f.wood) for (const sd of [-1, 1]) frame(f.s + 1.2, f.s + f.lk, sd * 1.8, sd * 1.4, sd * 2.4, 1.7);
      else if (f.kind === 'skinny') for (const sd of [-1, 1]) frame(f.s + 2.5, f.s + f.len - 2.5, sd * 0.72, sd * 0.4, sd * 1.1, 3.2, 0.3);
      else if (f.kind === 'wallride') { const dt2 = f.d0 + f.wd; frame(f.s + 2.5, f.end - 2.5, f.side * (dt2 + 0.45), f.side * (dt2 - 0.1), f.side * (dt2 + 1.0), 2.0); }
    }
  }
  // stumps beside the trail, arrow boards on sharp turns, warning signs, flags at jumps, banners on straights
  const stumps = [], arrows = [], warns = [], flags = [], banners = [];
  for (const R of routes) {
    const sidePt = (i, dd) => { const x = R.x[i] + R.tz[i] * dd, z = R.z[i] - R.tx[i] * dd; return { x, z, y: height(x, z), yaw: Math.atan2(R.tx[i], R.tz[i]) }; };
    const free = p => { const ta = trailAt(p.x, p.z); return ta.i < 0 || ta.d > routes[ta.r].halfW(ta.i) + 0.6; };
    let inTurn = false, lastBanner = 0;
    for (let i = R.start + 30; i < R.finish - 10; i++) {
      const c = R.curvS[i];
      if (!inTurn && Math.abs(c) > 0.03) { inTurn = true; for (let q = 0; q < 3; q++) { const p = sidePt(Math.min(R.n - 1, i + 3 + q * 4), -(R.halfW(i) + 3.2) * Math.sign(c)); p.dir = Math.sign(c); if (free(p)) arrows.push(p); } }
      if (inTurn && Math.abs(c) < 0.015) inTurn = false;
      if (r() < 0.012) { const p = sidePt(i, (r() < 0.5 ? -1 : 1) * (R.halfW(i) + 1.6 + r() * 3)); p.s = 0.7 + r() * 0.7; if (free(p) && clearOf(p.x, p.z, 1)) stumps.push(p); }
      if (Math.abs(c) < 0.006 && i - lastBanner > 170 && !R.feats.some(f => i > f.s - 6 && i < f.end + 6)) { const p = sidePt(i, (r() < 0.5 ? -1 : 1) * (R.halfW(i) + 2.6)); if (free(p)) { banners.push(p); lastBanner = i; } }
    }
    for (const f of R.feats) {
      const i = Math.round(f.s);
      if (['drop', 'tech', 'stairs', 'woodstep', 'stepdown', 'skinny'].includes(f.kind)) { const p = sidePt(Math.max(0, i - (f.kind === 'drop' ? 30 : 12)), R.halfW(i) + 1.1); if (free(p)) warns.push(p); }
      if (f.kind === 'kicker' || f.kind === 'woodstep' || f.kind === 'stepup') for (const sd of [-1, 1]) { const p = sidePt(Math.min(R.n - 1, Math.round(f.s + f.lk)), sd * (R.halfW(i) + 0.9)); p.tint = f.wood ? 1 : f.over ? 2 : 0; if (free(p)) flags.push(p); }
    }
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
    trees, rocks, plants, logs, pads, roots, stumps, timbers, arrows, warns, flags, banners,
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
