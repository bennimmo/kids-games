// Choo Choo Wilf: the endless railway. Makes the track a "leg" at a time
// (station to station), each leg with its own land, a bridge/tunnel/hill
// and a few things that happen. Builds 3D pieces in chunks just ahead of
// the train and throws them away behind it.
import { THREE, Builder, MAT, rng, smooth, signTexture } from './models.js';
import { SCENERY, pickItem } from './scenery.js';

export const DS = 0.5;      // track sample spacing
const CH = 60;              // chunk length
const TH0 = -Math.PI / 2;   // the track heads roughly this way (towards -z)
const UP = [0, 1, 0];

export const BIOMES = [
  { id: 'country', ground: '#86c75a', bank: '#71b04c', water: '#4fb6ea', name: 'Daisy Meadow', patch: '#7bbd4f', fence: true, density: 1,
    items: { tree: 3, bush: 3, flowers: 2.2, house: 0.9, rock: 0.6, hay: 0.9, pond: 0.35 },
    events: ['ducks', 'animals', 'crossing', 'barrier', 'digger'], animal: 'cow' },
  { id: 'forest', ground: '#5f9f48', bank: '#4f8b3c', water: '#3fa6d8', name: 'Pinecone Wood', patch: '#558f40', fence: false, density: 1.7,
    items: { pine: 5, tree: 3, bush: 2.5, rock: 1, mushroom: 0.8 },
    events: ['animals', 'ducks', 'barrier', 'digger', 'crossing'], animal: 'sheep' },
  { id: 'snow', ground: '#f2f7fc', bank: '#e2ebf4', water: '#bfe7f7', name: 'Snowy Peak', patch: '#e6eef7', fence: false, density: 1.2, snow: true,
    items: { snowpine: 5, snowman: 0.9, igloo: 0.45, rock: 0.7, house: 0.5 },
    events: ['animals', 'crossing', 'barrier', 'digger'], animal: 'penguin' },
  { id: 'town', ground: '#a9b39c', bank: '#93a083', water: '#4fb6ea', name: 'Wilfton', patch: '#9aa68d', fence: true, density: 1.25,
    items: { building: 3, house: 2.4, lamp: 1.3, tree: 1, bush: 1 },
    events: ['crossing', 'ducks', 'barrier', 'digger'], animal: null },
  { id: 'beach', ground: '#f3dfa0', bank: '#e2c987', water: '#3fb8e6', name: 'Sandy Bay', patch: '#ead293', fence: false, density: 1, beach: true,
    items: { palm: 3, hut: 1.2, parasol: 1.5, rock: 1, pond: 0.45, bush: 0.4 },
    events: ['animals', 'ducks', 'crossing', 'barrier'], animal: 'crab' },
];

export class World {
  constructor(scene, seed = (Math.random() * 1e9) | 0) {
    this.scene = scene;
    this.seed = seed;
    this.r = rng(seed);
    this.xs = [0]; this.zs = [0]; this.ys = [0]; this.th = [TH0];
    this.legs = [];
    this.chunks = new Map();
    this.tunnels = [];   // {s0, s1, mat}
    this.rivers = [];    // {x, z, tx, tz}
    this.mounts = [];    // {x, z, tx, tz, A, B}
    this._straight(40);
    this.genLeg();
    this.genLeg();
  }

  get length() { return (this.xs.length - 1) * DS; }

  // ------------------------------------------------------------ path making
  _step(dth) {
    const i = this.xs.length - 1;
    const th = this.th[i] + dth;
    this.xs.push(this.xs[i] + Math.cos(th) * DS);
    this.zs.push(this.zs[i] + Math.sin(th) * DS);
    this.ys.push(0);
    this.th.push(th);
  }
  _straight(len) { const n = Math.round(len / DS); for (let i = 0; i < n; i++) this._step(0); }
  _arc(ang, R) {
    const n = Math.max(1, Math.round(Math.abs(ang) * R / DS));
    for (let i = 0; i < n; i++) this._step(ang / n);
  }
  _random(len) {
    const r = this.r, target = this.length + len;
    while (this.length < target) {
      if (r() < 0.3) { this._straight(8 + r() * 18); continue; }
      const off = this.th[this.th.length - 1] - TH0;
      const sign = Math.abs(off) > 0.5 ? -Math.sign(off) : (r() < 0.5 ? -1 : 1);
      let mag = 0.45 + r() * 0.75;
      const lim = 1.15;
      if (Math.abs(off + sign * mag) > lim) mag = lim - Math.abs(off) * (sign === Math.sign(off) ? 1 : -1);
      if (mag < 0.2) { this._straight(10); continue; }
      this._arc(sign * mag, 19 + r() * 14);
    }
  }

  genLeg() {
    const r = this.r, k = this.legs.length;
    const biome = BIOMES[k % BIOMES.length];
    const S = this.length, i0 = this.xs.length - 1;
    const leg = { k, S, biome, night: k % 3 === 2, name: biome.name, feats: [], events: [], end: 0 };
    this._straight(30);
    this._random(70 + r() * 40);
    const ft = ['bridge', 'tunnel', 'hill'][k % 3];
    if (ft === 'bridge') {
      const c = this.length + 32;
      this._straight(64);
      leg.feats.push({ type: 'bridge', c, H: 2.6, flat: 13, ramp: 24, zone: 44 });
      this._random(40 + r() * 20);
    } else if (ft === 'tunnel') {
      const c = this.length + 36;
      this._straight(72);
      leg.feats.push({ type: 'tunnel', c, A: 24, B: 17, H: 9.5, zone: 36 });
    } else {
      const c = this.length + 62;
      leg.feats.push({ type: 'hill', c, H: 6.5, flat: 16, ramp: 44, zone: 66 });
      this._random(130);
    }
    this._random(110 + r() * 60);
    this._straight(46);
    leg.end = this.length;

    // heights (bridges and hills)
    for (let i = i0; i < this.xs.length; i++) {
      const s = i * DS;
      let y = 0;
      for (const f of leg.feats) {
        if (!f.H || f.type === 'tunnel') continue;
        const d = Math.abs(s - f.c);
        y += f.H * (d < f.flat ? 1 : d < f.flat + f.ramp ? smooth(1 - (d - f.flat) / f.ramp) : 0);
      }
      this.ys[i] = y;
    }
    for (const f of leg.feats) {
      const fr = this.frame(f.c);
      if (f.type === 'bridge') this.rivers.push({ x: fr.x, z: fr.z, tx: fr.tx, tz: fr.tz });
      if (f.type === 'tunnel') this.mounts.push({ x: fr.x, z: fr.z, tx: fr.tx, tz: fr.tz, A: f.A, B: f.B });
    }

    // things that happen
    let pool = biome.events.filter(e => e !== 'animals' || biome.animal);
    for (let i = pool.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const lo = S + 55, hi = leg.end - 55, chosen = [];
    for (let t = 0; t < 80 && chosen.length < 3; t++) {
      const s = lo + r() * (hi - lo);
      if (leg.feats.some(f => Math.abs(s - f.c) < f.zone + 8)) continue;
      if (chosen.some(c => Math.abs(c - s) < 55)) continue;
      chosen.push(s);
    }
    chosen.sort((a, b) => a - b);
    leg.events = chosen.map((s, i) => ({ type: pool[i % pool.length], s, leg: k, frame: this.frame(s) }));
    this.legs.push(leg);
  }

  // ------------------------------------------------------------ lookups
  frame(s, o = {}) {
    const n = this.xs.length;
    let f = s / DS;
    if (f < 0) f = 0;
    if (f > n - 1.001) f = n - 1.001;
    const i = f | 0, t = f - i;
    const xs = this.xs, zs = this.zs, ys = this.ys;
    o.x = xs[i] + (xs[i + 1] - xs[i]) * t;
    o.z = zs[i] + (zs[i + 1] - zs[i]) * t;
    o.y = ys[i] + (ys[i + 1] - ys[i]) * t;
    const dx = xs[i + 1] - xs[i], dz = zs[i + 1] - zs[i], L = Math.hypot(dx, dz) || 1;
    o.tx = dx / L; o.tz = dz / L;
    o.nx = o.tz; o.nz = -o.tx;        // "lateral" direction (local +x of a frame)
    o.ry = Math.atan2(o.tx, o.tz);     // rotation.y that points a model's +z along the track
    o.slope = (ys[i + 1] - ys[i]) / DS;
    return o;
  }
  legIndexAt(s) {
    const L = this.legs;
    let k = L.length - 1;
    while (k > 0 && L[k].S > s) k--;
    return k;
  }
  legAt(s) { return this.legs[this.legIndexAt(s)]; }
  // blend between the previous leg and this one around each station
  blendAt(s) {
    const L = this.legs;
    let k = L.length - 1;
    while (k > 0 && L[k].S - 30 > s) k--;
    const w = k === 0 ? 1 : smooth((s - (L[k].S - 30)) / 70);
    return { cur: L[k], prev: L[Math.max(0, k - 1)], w };
  }
  nextStationAfter(s) {
    for (const l of this.legs) if (l.S > s + 0.01) return l;
    return null;
  }
  tunnelAt(s) {
    for (const t of this.tunnels) if (s > t.s0 - 6 && s < t.s1 + 16) return t;
    return null;
  }

  // ------------------------------------------------------------ chunks
  update(sFront) {
    while (this.length < sFront + 500) this.genLeg();
    const c0 = Math.floor((sFront - 80) / CH), c1 = Math.floor((sFront + 170) / CH);
    for (const [c, g] of this.chunks) if (c < c0) { this._dispose(g); this.chunks.delete(c); }
    this.tunnels = this.tunnels.filter(t => t.s1 > sFront - 150);
    for (let c = Math.max(0, c0); c <= c1; c++) {
      if (!this.chunks.has(c)) { this.chunks.set(c, this._build(c)); return true; }
    }
    return false;
  }
  buildAll(sFront) { while (this.update(sFront)); }
  _dispose(g) {
    this.scene.remove(g);
    g.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material && o.userData.own) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    });
  }
  disposeAll() { for (const g of this.chunks.values()) this._dispose(g); this.chunks.clear(); }

  _lp(i, lat, dy, ox, oz) {
    const th = this.th[i], tx = Math.cos(th), tz = Math.sin(th);
    return [this.xs[i] + tz * lat, this.ys[i] + dy, this.zs[i] - tx * lat];
  }

  _build(c) {
    const s0 = c * CH, s1 = (c + 1) * CH;
    const f0 = this.frame(s0);
    const ox = f0.x, oz = f0.z;
    const b = new Builder(ox, oz), gl = new Builder(ox, oz), dec = new Builder(ox, oz);
    const g = new THREE.Group();
    this._track(b, s0, s1);
    for (const leg of this.legs) {
      if (leg.end < s0 - 100 || leg.S > s1 + 100) continue;
      for (const f of leg.feats) {
        if (f.c < s0 || f.c >= s1) continue;
        if (f.type === 'bridge') this._bridge(b, dec, f, leg.biome);
        if (f.type === 'tunnel') this._tunnel(g, f, leg.biome);
      }
      if (leg.S >= s0 && leg.S < s1) this._station(b, gl, g, leg);
    }
    this._scenery(b, gl, dec, s0, s1, c);
    const m = b.mesh(MAT.flat);
    if (m) { m.castShadow = m.receiveShadow = true; g.add(m); }
    const gm = gl.mesh(MAT.glow);
    if (gm) g.add(gm);
    const dm = dec.mesh(MAT.decal);
    if (dm) { dm.receiveShadow = true; g.add(dm); }
    this.scene.add(g);
    return g;
  }

  _track(b, s0, s1) {
    const i0 = Math.round(s0 / DS), i1 = Math.min(this.xs.length - 1, Math.round(s1 / DS));
    const L = (i, lat, dy) => this._lp(i, lat, dy);
    const BAL = '#a89c8c', BALS = '#8f8374', RAIL = '#d5dae0', RAILS = '#6f7680';
    for (let i = i0; i < i1; i++) {
      const j = i + 1;
      const th = this.th[i], nx = Math.sin(th), nz = -Math.cos(th);
      const hp = [nx, 0.3, nz], hm = [-nx, 0.3, -nz];
      const lat = this.legAt(i * DS);
      const bank = lat.biome.bank;
      b.quad(L(i, -1.05, 0.14), L(i, 1.05, 0.14), L(j, 1.05, 0.14), L(j, -1.05, 0.14), BAL, UP);
      b.quad(L(i, 1.05, 0.14), L(i, 1.5, 0), L(j, 1.5, 0), L(j, 1.05, 0.14), BALS, hp);
      b.quad(L(i, -1.05, 0.14), L(i, -1.5, 0), L(j, -1.5, 0), L(j, -1.05, 0.14), BALS, hm);
      for (const rl of [-0.5, 0.5]) {
        b.quad(L(i, rl - 0.06, 0.36), L(i, rl + 0.06, 0.36), L(j, rl + 0.06, 0.36), L(j, rl - 0.06, 0.36), RAIL, UP);
        b.quad(L(i, rl + 0.06, 0.36), L(i, rl + 0.06, 0.22), L(j, rl + 0.06, 0.22), L(j, rl + 0.06, 0.36), RAILS, hp);
        b.quad(L(i, rl - 0.06, 0.36), L(i, rl - 0.06, 0.22), L(j, rl - 0.06, 0.22), L(j, rl - 0.06, 0.36), RAILS, hm);
      }
      // embankment under raised track (not where a bridge is)
      const yi = this.ys[i], yj = this.ys[j];
      if (Math.max(yi, yj) > 0.02 && !this._onBridge(i * DS)) {
        const wi = 1.5 + yi * 1.7, wj = 1.5 + yj * 1.7;
        b.quad(L(i, 1.5, 0), L(i, wi, -yi), L(j, wj, -yj), L(j, 1.5, 0), bank, hp);
        b.quad(L(i, -1.5, 0), L(i, -wi, -yi), L(j, -wj, -yj), L(j, -1.5, 0), bank, hm);
      }
    }
    const SL = '#6d4c33';
    const fr = {};
    for (let s = Math.ceil(s0 / 0.8) * 0.8; s < s1; s += 0.8) {
      this.frame(s, fr);
      b.setBase(fr.x, fr.y, fr.z, fr.ry);
      b.part('box', SL, 0, 0.19, 0, 1.8, 0.1, 0.3);
    }
  }
  _onBridge(s) {
    const leg = this.legAt(s);
    for (const l of [leg, this.legs[leg.k - 1]]) if (l) for (const f of l.feats) if (f.type === 'bridge' && Math.abs(s - f.c) < 13.5) return true;
    return false;
  }

  _bridge(b, dec, f, biome) {
    const fr = this.frame(f.c), H = f.H;
    b.setBase(fr.x, 0, fr.z, fr.ry);
    const RED = '#c62828', STONE = '#a0a0a0';
    b.part('box', '#8d6e63', 0, H - 0.3, 0, 3.3, 0.6, 27.2);
    for (const s of [-1, 1]) {
      b.part('box', RED, s * 1.75, H + 0.95, 0, 0.22, 0.22, 27);
      b.part('box', RED, s * 1.75, H - 0.05, 0, 0.26, 0.3, 27);
      for (let z = -13; z <= 13; z += 2.6) b.part('box', RED, s * 1.75, H + 0.45, z, 0.18, 1.0, 0.18);
      for (let z = -11.7; z <= 11.7; z += 2.6) b.part('box', RED, s * 1.75, H + 0.45, z, 0.12, 0.12, 2.9, 0.35 * (Math.round(z / 2.6) % 2 ? 1 : -1));
    }
    for (const z of [-6.5, 0, 6.5]) {
      b.part('box', STONE, 0, (H - 0.6) / 2, z, 2.3, H - 0.6, 1.2);
      b.part('box', '#bdbdbd', 0, H - 0.6, z, 2.7, 0.2, 1.5);
    }
    // close the ends of the embankments
    for (const e of [-1, 1]) {
      const s = f.c + e * 13.5, q = this.frame(s), h = q.y, w = 1.5 + h * 1.7;
      const P = (lat, y) => [q.x + q.nx * lat, y, q.z + q.nz * lat];
      const hint = [-e * q.tx, 0, -e * q.tz];
      b.quad(P(-w, 0), P(-1.5, h), P(1.5, h), P(w, 0), STONE, hint);
      b.quad(P(-1.5, h), P(-1.5, h + 0.14), P(1.5, h + 0.14), P(1.5, h), STONE, hint);
    }
    // river
    dec.setBase(fr.x, 0, fr.z, fr.ry);
    const mud = biome.snow ? '#dfe9f2' : biome.beach ? '#e8d08a' : '#8d7b5c';
    dec.part('box', mud, 0, 0.02, 0, 90, 0.02, 15);
    dec.part('box', biome.water, 0, 0.04, 0, 90, 0.02, 12);
    const r = rng(f.c | 0);
    for (let i = 0; i < 26; i++) dec.part('box', biome.snow ? '#e6f6fd' : '#a6e1f8', (r() - 0.5) * 80, 0.055, (r() - 0.5) * 10, 1.5 + r() * 3, 0.01, 0.16);
  }

  _tunnel(g, f, biome) {
    const fr = this.frame(f.c), { A, B, H } = f;
    const b = new Builder(fr.x, fr.z);
    const seed = (f.c * 0.37) % 7;
    const hf = (u, v) => {
      const e = 1 - Math.pow(Math.abs(u) / A, 4) - Math.pow(Math.abs(v) / B, 2);
      if (e <= 0) return -0.2;
      const n = (Math.sin(u * 0.55 + v * 0.31 + seed) * 0.7 + Math.cos(v * 0.7 - u * 0.27 + seed * 2) * 0.6) * Math.min(1, e * 4);
      return H * Math.sqrt(e) + n;
    };
    const P = (u, v) => [fr.x + fr.tx * u + fr.nx * v, hf(u, v), fr.z + fr.tz * u + fr.nz * v];
    const grass = biome.snow ? '#e8f0f7' : biome.beach ? '#d8b878' : biome.bank;
    const rock = biome.beach ? '#c9a46a' : '#8d8478';
    const st = 1.6;
    for (let u = -A - st; u < A + st; u += st) for (let v = -B - st; v < B + st; v += st) {
      const a = P(u, v), bb = P(u + st, v), c = P(u + st, v + st), d = P(u, v + st);
      const h = (a[1] + bb[1] + c[1] + d[1]) / 4;
      if (h < -0.15) continue;
      const col = h > H * 0.78 ? '#ffffff' : h > H * 0.42 ? rock : grass;
      b.quad(a, bb, c, d, col, UP);
    }
    // portals
    b.setBase(fr.x, 0, fr.z, fr.ry);
    for (const e of [-1, 1]) {
      const z = e * (A - 0.9);
      for (const s of [-1, 1]) b.part('box', '#9e9e9e', s * 1.75, 1.75, z, 0.7, 3.5, 1.0);
      b.part('box', '#9e9e9e', 0, 3.75, z, 4.2, 0.8, 1.0);
      b.part('box', '#757575', 0, 4.25, z, 4.5, 0.2, 1.1);
    }
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, transparent: true, side: THREE.DoubleSide });
    const m = b.mesh(mat);
    m.castShadow = true; m.receiveShadow = true; m.userData.own = true;
    g.add(m);
    this.tunnels.push({ s0: f.c - A, s1: f.c + A, mat, fade: 1 });
  }

  _station(b, gl, g, leg) {
    const fr = this.frame(leg.S);
    b.setBase(fr.x, fr.y, fr.z, fr.ry);
    gl.setBase(fr.x, fr.y, fr.z, fr.ry);
    const P = 0.76;
    b.part('box', '#d9cfbd', 4.2, P / 2, -7, 4.9, P, 23);
    b.part('box', '#ffd54f', 1.86, P + 0.01, -7, 0.24, 0.02, 23);
    // building
    b.part('box', '#fff1d6', 9.0, P + 1.6, -7, 4.4, 3.2, 9.5);
    b.part('roof', '#c0392b', 9.0, P + 3.2, -7, 5.2, 1.9, 10.2);
    b.part('box', '#8d6e63', 10.0, P + 4.6, -9.5, 0.6, 1.4, 0.6);
    b.part('box', '#6d4c41', 6.78, P + 0.8, -7, 0.06, 1.6, 1.2);
    b.part('cyl', '#ffffff', 6.78, P + 2.6, -7, 0.8, 0.06, 0.8, 0, 0, Math.PI / 2);
    b.part('box', '#111', 6.73, P + 2.7, -7, 0.04, 0.3, 0.05);
    b.part('box', '#111', 6.73, P + 2.6, -6.92, 0.04, 0.05, 0.22);
    for (const z of [-10, -4]) gl.part('box', '', 6.78, P + 1.4, z, 0.06, 1.0, 1.1);
    // lamps, benches, flowers
    for (const z of [-16, -10, -4, 2]) {
      b.part('cyl6', '#37474f', 2.7, P + 1.3, z, 0.13, 2.6, 0.13);
      gl.part('box', '', 2.7, P + 2.7, z, 0.4, 0.4, 0.4);
    }
    const flag = ['#e53935', '#fdd835', '#1e88e5', '#43a047', '#ff7043'];
    for (let z = -16, i = 0; z < 2; z += 0.75, i++) {
      const sag = Math.sin(((z + 16) % 6) / 6 * Math.PI) * 0.4;
      b.part('box', flag[i % 5], 2.7, P + 2.45 - sag, z, 0.03, 0.32, 0.32, Math.PI / 4);
    }
    for (const z of [-13, -1]) {
      b.part('box', '#8d6e63', 5.9, P + 0.45, z, 0.55, 0.12, 1.8);
      b.part('box', '#6d4c41', 6.2, P + 0.75, z, 0.1, 0.5, 1.8);
    }
    for (const z of [-7, 3.5]) {
      b.part('cyl6', '#8d6e63', 5.8, P + 0.3, z, 0.9, 0.6, 0.9);
      for (let i = 0; i < 5; i++) b.part('ball0', flag[i], 5.8 + Math.cos(i * 1.3) * 0.25, P + 0.7, z + Math.sin(i * 1.3) * 0.25, 0.3, 0.25, 0.3);
    }
    for (const z of [-0.2, 2.6]) b.part('box', '#5d4037', 5.4, P + 1.0, z, 0.14, 2.0, 0.14);
    // sign
    const tex = signTexture(leg.name);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
    sign.userData.own = true;
    const holder = new THREE.Group();
    holder.position.set(fr.x + fr.nx * 5.3 + fr.tx * 1.2, fr.y + P + 2.0, fr.z + fr.nz * 5.3 + fr.tz * 1.2);
    holder.rotation.y = fr.ry - Math.PI / 2;
    sign.rotation.x = -0.55;
    holder.add(sign);
    g.add(holder);
  }

  _free(px, pz, s, alat) {
    // track (and its embankments)
    const n = this.xs.length;
    const a = Math.max(0, Math.floor((s - 80) / DS)), z = Math.min(n - 1, Math.floor((s + 80) / DS));
    for (let i = a; i <= z; i += 3) {
      const dx = px - this.xs[i], dz = pz - this.zs[i];
      const need = 3.4 + this.ys[i] * 1.7 + 0.6;
      if (dx * dx + dz * dz < need * need) return false;
    }
    return this._freeOther(px, pz, s);
  }
  _freeOther(px, pz, s) {
    const local = (o, x, z2) => {
      const dx = px - x, dz = pz - z2;
      return [dx * o.tx + dz * o.tz, dx * o.tz - dz * o.tx]; // [along, lateral]
    };
    for (const rv of this.rivers) {
      const [u, v] = local(rv, rv.x, rv.z);
      if (Math.abs(u) < 9.5 && Math.abs(v) < 47) return false;
    }
    for (const m of this.mounts) {
      const [u, v] = local(m, m.x, m.z);
      if (Math.abs(u) < m.A + 3 && Math.abs(v) < m.B + 2) return false;
    }
    const k = this.legIndexAt(s);
    for (let j = Math.max(0, k - 1); j <= Math.min(this.legs.length - 1, k + 1); j++) {
      const leg = this.legs[j];
      const sf = this.frame(leg.S);
      const [u, v] = local(sf, sf.x, sf.z);
      if (u > -22 && u < 9 && v > -5 && v < 15) return false;
      for (const ev of leg.events) {
        const [eu, ev2] = local(ev.frame, ev.frame.x, ev.frame.z);
        if (ev.type === 'crossing') { if (Math.abs(eu) < 4 && Math.abs(ev2) < 70) return false; }
        else if (Math.abs(eu) < 5 && Math.abs(ev2) < 18) return false;
      }
    }
    return true;
  }

  _scenery(b, gl, dec, s0, s1, c) {
    const r = rng(this.seed + c * 7919);
    const fr = {};
    // soft patches of a different shade so the ground isn't flat colour
    for (let i = 0; i < 14; i++) {
      const s = s0 + r() * CH, B = this.legAt(s).biome;
      this.frame(s, fr);
      const lat = (r() < 0.5 ? -1 : 1) * (4 + r() * 40);
      const px = fr.x + fr.nx * lat, pz = fr.z + fr.nz * lat;
      dec.setBase(px, 0, pz, r() * 6.3, 1);
      dec.part('cyl6', B.patch, 0, 0.012, 0, 5 + r() * 9, 0.01, 4 + r() * 7);
    }
    // fences along the line in the countryside and town
    const legF = this.legAt(s0 + CH / 2);
    if (legF.biome.fence && r() < 0.7) {
      for (const side of [-1, 1]) {
        if (r() < 0.35) continue;
        for (let s = s0; s < s1; s += 2.5) {
          this.frame(s, fr);
          if (fr.y > 0.05 || this._onBridge(s)) continue;
          const lat = side * 4.6, px = fr.x + fr.nx * lat, pz = fr.z + fr.nz * lat;
          if (!this._freeOther(px, pz, s)) continue;
          b.setBase(px, 0, pz, fr.ry);
          b.part('box', '#8d6e63', 0, 0.5, 0, 0.14, 1.0, 0.14);
          b.part('box', '#a1887f', 0, 0.75, 1.25, 0.08, 0.14, 2.6);
          b.part('box', '#a1887f', 0, 0.4, 1.25, 0.08, 0.14, 2.6);
        }
      }
    }
    for (let s = s0; s < s1; s += 2) {
      const B = this.legAt(s).biome;
      this.frame(s, fr);
      for (const side of [-1, 1]) {
        if (r() > 0.75 * B.density) continue;
        const lat = side * (3.8 + Math.pow(r(), 1.6) * 36);
        const px = fr.x + fr.nx * lat + fr.tx * (r() - 0.5) * 2, pz = fr.z + fr.nz * lat + fr.tz * (r() - 0.5) * 2;
        if (!this._free(px, pz, s, Math.abs(lat))) continue;
        const type = pickItem(r, B.items, Math.abs(lat) > 10);
        const ry = r() * Math.PI * 2, sc = 0.8 + r() * 0.5;
        b.setBase(px, 0, pz, ry, sc); gl.setBase(px, 0, pz, ry, sc); dec.setBase(px, 0, pz, ry, sc);
        SCENERY[type](b, gl, dec, r, !!B.snow, B.water);
      }
    }
  }
}
