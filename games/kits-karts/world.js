// The 3D world for a race: sky, ground, road (with bridges and jumps),
// extras, scenery for the theme, mystery boxes, items and effects.
// 3D axes: X = track x, Z = track y, Y = up (height).
import * as THREE from '../../js/vendor/three.module.min.js';
import { WORLD, SOLIDS, JUMP_L, WATER_RX, WATER_RY, BOOST_L } from '../race-track/track.js';
import { TRACK_W, RAIL_H, BARRIER, trackSeed, rng, distToRoad, arrowSpots } from './course.js';
import { buildKart } from './karts.js';

const CX = WORLD.w / 2, CZ = WORLD.h / 2;

// ------------------------------------------------------------------ helpers
function canvasTex(w, h, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.anisotropy = 4;
  return t;
}
function speckle(g, w, h, base, dark, light, count, size = 2, alpha = 0.3) {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < count; i++) {
    g.fillStyle = Math.random() < 0.6 ? dark : light;
    g.globalAlpha = alpha * (0.4 + Math.random() * 0.6);
    const s = size * (0.5 + Math.random());
    g.fillRect(Math.random() * w, Math.random() * h, s, s);
  }
  g.globalAlpha = 1;
}
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? 0.8, metalness: o.m ?? 0, emissive: o.e || '#000', emissiveIntensity: o.ei ?? 1, flatShading: !!o.flat, transparent: !!o.t, opacity: o.t ?? 1, side: o.ds ? THREE.DoubleSide : THREE.FrontSide });

let GLOW = null;
function glowTex() {
  if (GLOW) return GLOW;
  GLOW = canvasTex(64, 64, g => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  }, false);
  return GLOW;
}

// Instanced scenery: add(kind, x, z, rot, scale) then build().
function scatterer(scene, shadows) {
  const parts = new Map(); // key -> { geo, mat, mats: [], cast }
  return {
    add(kind, x, y, z, rot = 0, s = 1, sy = s) {
      const base = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)), new THREE.Vector3(s, sy, s));
      kind.forEach((p, k) => {
        const key = p.key || (kind.id + k);
        if (!parts.has(key)) parts.set(key, { geo: p.geo, mat: p.mat, list: [], cast: p.cast !== false });
        parts.get(key).list.push(base.clone().multiply(p.m));
      });
    },
    build() {
      for (const p of parts.values()) {
        const im = new THREE.InstancedMesh(p.geo, p.mat, p.list.length);
        p.list.forEach((m, i) => im.setMatrixAt(i, m));
        im.castShadow = shadows && p.cast; im.receiveShadow = true;
        im.instanceMatrix.needsUpdate = true;
        im.computeBoundingSphere();
        scene.add(im);
      }
    },
  };
}
let KID = 0;
// a scenery kind = list of parts { geo, mat, m (matrix) }
function kind(list) {
  const id = 'k' + (KID++);
  const parts = list.map(([geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, cast = true]) => ({
    geo, mat, cast,
    m: new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz)),
  }));
  parts.id = id;
  return parts;
}

// ------------------------------------------------------------------ theme scenery kinds
function sceneryKinds(theme) {
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const C = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);
  const S = (r, s = 12) => new THREE.SphereGeometry(r, s, Math.max(6, s * 0.7 | 0));
  const K = (r, h, s = 10) => new THREE.ConeGeometry(r, h, s);
  const D = (r, s = 1) => new THREE.DodecahedronGeometry(r, s);
  const k = {};
  const trunk = std('#7a5230');
  switch (theme.plant) {
    case 'tree': {
      const leaf = std('#3f9b35', { flat: true }), leaf2 = std('#2f8a3a', { flat: true });
      k.tree = kind([[C(2.5, 3.5, 22, 7), trunk, 0, 11], [D(14, 1), leaf, 0, 30], [D(10, 1), leaf2, 5, 38, 3]]);
      k.pine = kind([[C(2, 3, 12, 6), trunk, 0, 6], [K(13, 26, 8), leaf2, 0, 22], [K(10, 20, 8), leaf2, 0, 34]]);
      k.bush = kind([[D(7, 1), leaf, 0, 4], [D(5, 1), leaf2, 6, 3, 2]]);
      k.barn = kind([[B(60, 34, 44), std('#c0392b'), 0, 17], [new THREE.CylinderGeometry(0.1, 32, 18, 4, 1), std('#5d4037', { flat: true }), 0, 43, 0, 0, Math.PI / 4, 0, 1.3, 1, 0.98], [B(16, 22, 1), std('#fff3e0'), 0, 11, 22.2]]);
      k.sheep = kind([[D(6, 1), std('#fafafa', { flat: true }), 0, 8], [S(3, 8), std('#333'), 6, 9], [C(0.8, 0.8, 5, 5), std('#333'), 3, 2.5, 2.5], [C(0.8, 0.8, 5, 5), std('#333'), -3, 2.5, -2.5]]);
      k.hay = kind([[C(7, 7, 10, 14), std('#e8c15a'), 0, 7, 0, Math.PI / 2]]);
      k.flower = kind([[C(0.3, 0.3, 5, 4), std('#3c8d2f'), 0, 2.5], [S(1.8, 6), std('#ff5fa2'), 0, 5.5]]);
      k.fence = kind([[B(40, 2, 1.5), std('#a1887f'), 0, 6], [B(40, 2, 1.5), std('#a1887f'), 0, 11], [B(2, 14, 2), std('#8d6e63'), -19, 7], [B(2, 14, 2), std('#8d6e63'), 19, 7]]);
      break;
    }
    case 'lamp': {
      const glass = std('#9ec9ff', { r: 0.1, m: 0.6 });
      for (let i = 0; i < 6; i++) {
        const col = ['#e57373', '#90a4ae', '#ffd180', '#81d4fa', '#a5d6a7', '#ce93d8'][i];
        k['b' + i] = kind([[B(1, 1, 1), std(col), 0, 0.5], [B(1.02, 0.02, 1.02), std('#555'), 0, 1]]);
      }
      k.windows = glass;
      k.lamp = kind([[C(1.2, 1.6, 40, 6), std('#455a64', { m: 0.6 }), 0, 20], [B(10, 1.5, 3), std('#455a64', { m: 0.6 }), 4, 40], [B(4, 1, 3), std('#fff9c4', { e: '#fff59d', ei: 1 }), 8, 39.2, 0, 0, 0, 0, 1, 1, 1, false]]);
      k.tree = kind([[C(2, 3, 18, 6), trunk, 0, 9], [S(11, 10), std('#4caf50', { flat: true }), 0, 26]]);
      k.bin = kind([[C(4, 3.5, 9, 10), std('#2e7d32'), 0, 4.5]]);
      k.bus = kind([[B(70, 26, 24), std('#fdd835'), 0, 17], [B(71, 8, 24.4), glass, 0, 21], ...[-24, 24].flatMap(x => [-12, 12].map(z => [C(5, 5, 4, 12), std('#212121'), x, 5, z, Math.PI / 2]))]);
      k.cone = kind([[K(3, 9, 10), std('#ff6d00'), 0, 4.5]]);
      break;
    }
    case 'cactus': {
      const green = std('#5f9e46', { flat: true });
      k.cactus = kind([[C(3.5, 4, 36, 8), green, 0, 18], [S(3.5, 8), green, 0, 36], [C(2.4, 2.4, 14, 8), green, 7, 22, 0, 0, 0, 0], [C(2.4, 2.4, 9, 8), green, 4, 16, 0, 0, 0, Math.PI / 2], [C(2.2, 2.2, 10, 8), green, -6, 28], [C(2.2, 2.2, 7, 8), green, -3.5, 23, 0, 0, 0, Math.PI / 2]]);
      k.rock = kind([[D(12, 0), std('#b5651d', { flat: true }), 0, 6, 0, 0.3, 0.5, 0, 1.3, 0.8, 1]]);
      k.mesa = kind([[C(60, 80, 70, 9), std('#c1693c', { flat: true }), 0, 35], [C(62, 62, 6, 9), std('#a0522d', { flat: true }), 0, 72]]);
      k.skull = kind([[S(4, 8), std('#f5f0e1'), 0, 3], [C(0.8, 0.5, 14, 5), std('#f5f0e1'), 0, 3, 0, 0, 0, Math.PI / 2]]);
      k.tumble = kind([[D(5, 0), std('#a1887f', { flat: true, t: 0.9 }), 0, 5]]);
      k.pyramid = kind([[new THREE.ConeGeometry(160, 150, 4), std('#e0b064', { flat: true }), 0, 75, 0, 0, Math.PI / 4]]);
      break;
    }
    case 'pine': {
      const pine = std('#2e6b4a', { flat: true }), snow = std('#ffffff', { flat: true });
      k.pine = kind([[C(2, 3, 12, 6), trunk, 0, 6], [K(14, 26, 8), pine, 0, 22], [K(10, 12, 8), snow, 0, 30], [K(10, 20, 8), pine, 0, 36], [K(6, 8, 8), snow, 0, 43]]);
      k.snowman = kind([[S(8, 12), snow, 0, 8], [S(6, 12), snow, 0, 19], [S(4.5, 12), snow, 0, 28], [K(1, 5, 6), std('#ff7043'), 4.5, 28, 0, 0, 0, -Math.PI / 2], [C(4, 4, 6, 10), std('#222'), 0, 34], [C(3, 3, 1, 10), std('#c62828'), 0, 23, 0, 0, 0, 0, 1.4, 1, 1.4]]);
      k.igloo = kind([[new THREE.SphereGeometry(18, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), std('#e3f2fd', { flat: true }), 0, 0], [C(6, 6, 12, 10), std('#e3f2fd'), 0, 5, 16, Math.PI / 2]]);
      k.rock = kind([[D(9, 0), std('#90a4ae', { flat: true }), 0, 4], [D(5, 0), snow, 0, 9]]);
      k.mountain = kind([[K(180, 260, 7), std('#8199b0', { flat: true }), 0, 130], [K(80, 118, 7), snow, 0, 202]]);
      break;
    }
    case 'palm': {
      const leaf = std('#3aa04a', { flat: true, ds: true });
      const fronds = [];
      for (let i = 0; i < 6; i++) fronds.push([B(22, 0.6, 6), leaf, Math.cos(i) * 9, 38, Math.sin(i) * 9, 0, -i, -0.35]);
      k.palm = kind([[C(1.8, 3, 40, 7), std('#a1785a', { flat: true }), 0, 20, 0, 0, 0, 0.08], ...fronds, [S(2, 6), std('#6d4c41'), 1, 36, 1]]);
      k.umbrella = kind([[C(0.5, 0.5, 18, 5), std('#eee'), 0, 9], [K(13, 5, 8), std('#ff5252', { flat: true }), 0, 19]]);
      k.umbrella2 = kind([[C(0.5, 0.5, 18, 5), std('#eee'), 0, 9], [K(13, 5, 8), std('#ffd740', { flat: true }), 0, 19]]);
      k.castle = kind([[B(16, 10, 16), std('#e6c27a', { flat: true }), 0, 5], ...[[-8, -8], [8, -8], [-8, 8], [8, 8]].map(([x, z]) => [C(3, 3.5, 15, 8), std('#e6c27a', { flat: true }), x, 7.5, z])]);
      k.ball = kind([[S(4, 12), std('#ff4081'), 0, 4]]);
      k.lighthouse = kind([[C(10, 16, 90, 12), std('#ffffff'), 0, 45], [C(10.5, 13, 18, 12), std('#e53935'), 0, 50], [C(8, 8, 10, 12), std('#fff59d', { e: '#ffee58', ei: 1.2 }), 0, 95], [K(10, 10, 12), std('#e53935'), 0, 105]]);
      break;
    }
    case 'deadtree': {
      const rock = std('#2b2220', { flat: true });
      k.rock = kind([[D(12, 0), rock, 0, 6, 0, 0.3, 0.5, 0, 1.2, 0.9, 1]]);
      k.spike = kind([[K(8, 40, 5), rock, 0, 20]]);
      k.lava = kind([[new THREE.CircleGeometry(30, 16), std('#ff6d00', { e: '#ff3d00', ei: 1.6 }), 0, 0.6, 0, -Math.PI / 2, 0, 0, 1, 1, 1, false]]);
      k.dead = kind([[C(1.5, 2.5, 26, 5), std('#1c1412', { flat: true }), 0, 13], [C(0.8, 1.2, 12, 5), std('#1c1412'), 4, 22, 0, 0, 0, -0.7], [C(0.8, 1.2, 10, 5), std('#1c1412'), -3, 19, 0, 0, 0, 0.8]]);
      k.volcano = kind([[new THREE.CylinderGeometry(70, 260, 300, 10, 1, true), std('#2a1a16', { flat: true }), 0, 150], [new THREE.CircleGeometry(70, 10), std('#ff5722', { e: '#ff3d00', ei: 2 }), 0, 296, 0, -Math.PI / 2, 0, 0, 1, 1, 1, false]]);
      k.crystal = kind([[new THREE.OctahedronGeometry(6, 0), std('#ff7043', { e: '#ff3d00', ei: 1.2, flat: true }), 0, 8, 0, 0, 0, 0, 0.7, 1.6, 0.7]]);
      break;
    }
    case 'lolly': {
      const stick = std('#ffffff');
      const cols = ['#ff4081', '#7c4dff', '#ffd740', '#00e5ff', '#69f0ae'];
      cols.forEach((c, i) => {
        k['lolly' + i] = kind([[C(1.2, 1.2, 34, 6), stick, 0, 17], [C(12, 12, 4, 20), std(c, { r: 0.25 }), 0, 40, 0, Math.PI / 2], [new THREE.TorusGeometry(8, 1.6, 6, 18), std('#ffffff', { r: 0.25 }), 0, 40, 0]]);
        k['gum' + i] = kind([[new THREE.SphereGeometry(9, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(c, { r: 0.2, t: 0.92 }), 0, 0]]);
      });
      k.cane = kind([[C(2, 2, 40, 10), std('#ff1744', { r: 0.3 }), 0, 20], [new THREE.TorusGeometry(7, 2, 8, 14, Math.PI), std('#ff1744', { r: 0.3 }), 7, 40, 0]]);
      k.icecream = kind([[K(8, 24, 12), std('#d7a35c', { flat: true }), 0, 12, 0, Math.PI], [S(9, 12), std('#ffb3d9'), 0, 28], [S(7, 12), std('#fff8e1'), 0, 38]]);
      k.cupcake = kind([[C(14, 10, 14, 12), std('#ff80ab', { flat: true }), 0, 7], [S(14, 12), std('#fff3e0'), 0, 16, 0, 0, 0, 0, 1, 0.7, 1], [S(3, 8), std('#e53935'), 0, 27]]);
      break;
    }
    case 'crystal': {
      const moon = std('#8d8d96', { flat: true });
      k.rock = kind([[D(10, 0), moon, 0, 4, 0, 0.3, 0.5, 0, 1.3, 0.7, 1]]);
      k.crater = kind([[new THREE.TorusGeometry(30, 6, 6, 18), moon, 0, 0, 0, Math.PI / 2, 0, 0, 1, 1, 0.5, false], [new THREE.CircleGeometry(30, 18), std('#76767f'), 0, 0.3, 0, -Math.PI / 2, 0, 0, 1, 1, 1, false]]);
      ['#5cf2ff', '#e040fb', '#76ff03'].forEach((c, i) => {
        k['crystal' + i] = kind([[new THREE.OctahedronGeometry(5, 0), std(c, { e: c, ei: 0.8, flat: true, r: 0.2 }), 0, 12, 0, 0, 0, 0.2, 0.8, 2.4, 0.8], [new THREE.OctahedronGeometry(3, 0), std(c, { e: c, ei: 0.8, flat: true }), 5, 6, 2, 0, 0, -0.5, 0.8, 2, 0.8]]);
      });
      k.dish = kind([[C(1.5, 2, 20, 6), std('#ddd', { m: 0.6 }), 0, 10], [new THREE.SphereGeometry(14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3), std('#f5f5f5', { ds: true, r: 0.3 }), 0, 22, 0, 0.9, 0, 0]]);
      k.base = kind([[new THREE.SphereGeometry(24, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), std('#eceff1', { m: 0.4, r: 0.3 }), 0, 0], [C(5, 5, 20, 10), std('#b0bec5', { m: 0.5 }), 26, 5, 0, 0, 0, Math.PI / 2]]);
      k.flag = kind([[C(0.4, 0.4, 24, 5), std('#ddd'), 0, 12], [B(10, 6, 0.3), std('#1e88e5'), 5, 21]]);
      break;
    }
  }
  return k;
}

// where scenery goes (per theme)
function placeScenery(theme, course, sc, r, kinds) {
  const ok = (x, z, rad) => distToRoad(course, x, z) > TRACK_W / 2 + 14 + rad;
  const near = [], far = [];
  // inside + around the world
  for (let i = 0; i < 420; i++) {
    const x = r.range(-500, WORLD.w + 500), z = r.range(-400, WORLD.h + 400);
    const inside = x > 0 && x < WORLD.w && z > 0 && z < WORLD.h;
    (inside ? near : far).push([x, z]);
  }
  const put = (kd, x, z, rad, s = 1, sy = s) => { if (kd && ok(x, z, rad * s)) { sc.add(kd, x, 0, z, r() * Math.PI * 2, s, sy); return true; } return false; };
  const back = (fn) => { for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + r() * 0.1; fn(CX + Math.cos(a) * r.range(1300, 1800), CZ + Math.sin(a) * r.range(1000, 1500)); } };
  switch (theme.plant) {
    case 'tree':
      near.forEach(([x, z], i) => put(i % 5 === 0 ? kinds.pine : i % 7 === 0 ? kinds.hay : i % 3 === 0 ? kinds.bush : i % 11 === 0 ? kinds.sheep : i % 2 ? kinds.flower : kinds.tree, x, z, 14, r.range(0.8, 1.3)));
      far.forEach(([x, z], i) => put(i % 9 === 0 ? kinds.barn : i % 4 === 0 ? kinds.pine : kinds.tree, x, z, 30, r.range(1, 1.6)));
      for (let i = 0; i < 12; i++) put(kinds.sheep, r.range(100, WORLD.w - 100), r.range(100, WORLD.h - 100), 10);
      break;
    case 'lamp': {
      // buildings all around the outside, a few inside
      const bld = (x, z, big) => {
        const w = r.range(60, 130), d = r.range(60, 130), h = big ? r.range(120, 420) : r.range(50, 130);
        if (!ok(x, z, Math.max(w, d) * 0.75 + 60)) return;
        const kd = kinds['b' + Math.floor(r() * 6)];
        sc.addBuilding(kd, x, z, w, h, d, r() < 0.5 ? 0 : Math.PI / 2);
      };
      far.forEach(([x, z]) => bld(x, z, true));
      near.forEach(([x, z], i) => { if (i % 6 === 0) bld(x, z, false); else if (i % 4 === 0) put(kinds.tree, x, z, 12); else if (i % 13 === 0) put(kinds.bus, x, z, 40); else if (i % 5 === 0) put(kinds.bin, x, z, 5); });
      // lamp posts along the road
      for (let i = 0; i < course.n; i += 9) {
        const p = course.pts[i];
        if (course.elev[i] > 0 || course.jumpOf[i] >= 0) continue;
        const s = (i / 9) % 2 ? 1 : -1, off = TRACK_W / 2 + 18;
        const x = p.x - Math.sin(p.a) * off * s, z = p.y + Math.cos(p.a) * off * s;
        if (distToRoad(course, x, z) > TRACK_W / 2 + 10) sc.add(kinds.lamp, x, 0, z, -p.a + (s > 0 ? Math.PI / 2 : -Math.PI / 2));
      }
      break;
    }
    case 'cactus':
      near.forEach(([x, z], i) => put(i % 3 === 0 ? kinds.cactus : i % 5 === 0 ? kinds.rock : i % 17 === 0 ? kinds.skull : i % 7 === 0 ? kinds.tumble : null, x, z, 12, r.range(0.8, 1.4)));
      far.forEach(([x, z], i) => put(i % 6 === 0 ? kinds.mesa : i % 2 ? kinds.cactus : kinds.rock, x, z, 40, r.range(1, 1.8)));
      [[-900, -700], [WORLD.w + 900, -600], [WORLD.w + 700, WORLD.h + 900]].forEach(([x, z], i) => sc.add(kinds.pyramid, x, 0, z, 0.3 * i, 1 + i * 0.3));
      break;
    case 'pine':
      near.forEach(([x, z], i) => put(i % 2 ? kinds.pine : i % 9 === 0 ? kinds.snowman : i % 13 === 0 ? kinds.igloo : kinds.rock, x, z, 14, r.range(0.8, 1.4)));
      far.forEach(([x, z]) => put(kinds.pine, x, z, 20, r.range(1, 1.7)));
      back((x, z) => sc.add(kinds.mountain, x, 0, z, r() * 6, r.range(0.8, 1.6), r.range(0.8, 1.4)));
      break;
    case 'palm':
      near.forEach(([x, z], i) => put(i % 3 === 0 ? kinds.palm : i % 7 === 0 ? kinds.umbrella : i % 8 === 0 ? kinds.umbrella2 : i % 11 === 0 ? kinds.castle : i % 17 === 0 ? kinds.ball : null, x, z, 12, r.range(0.9, 1.3)));
      far.forEach(([x, z], i) => { if (z < WORLD.h + 60) put(i % 2 ? kinds.palm : kinds.umbrella, x, z, 20, r.range(1, 1.5)); });
      sc.add(kinds.lighthouse, WORLD.w + 260, 0, WORLD.h + 120);
      break;
    case 'deadtree':
      near.forEach(([x, z], i) => put(i % 4 === 0 ? kinds.rock : i % 7 === 0 ? kinds.lava : i % 5 === 0 ? kinds.dead : i % 9 === 0 ? kinds.crystal : null, x, z, i % 7 === 0 ? 30 : 12, r.range(0.8, 1.4)));
      far.forEach(([x, z], i) => put(i % 3 === 0 ? kinds.spike : i % 4 === 0 ? kinds.lava : kinds.rock, x, z, 30, r.range(1, 2)));
      sc.add(kinds.volcano, CX + 300, 0, -1300, 0, 1.6, 1.4);
      break;
    case 'lolly': {
      const lolls = Object.keys(kinds).filter(k => k.startsWith('lolly')), gums = Object.keys(kinds).filter(k => k.startsWith('gum'));
      near.forEach(([x, z], i) => put(i % 3 === 0 ? kinds[lolls[i % 5]] : i % 4 === 0 ? kinds[gums[i % 5]] : i % 7 === 0 ? kinds.cane : i % 11 === 0 ? kinds.icecream : null, x, z, 14, r.range(0.8, 1.3)));
      far.forEach(([x, z], i) => put(i % 4 === 0 ? kinds.cupcake : i % 3 === 0 ? kinds.icecream : kinds[lolls[i % 5]], x, z, 30, r.range(1.5, 3)));
      break;
    }
    case 'crystal':
      near.forEach(([x, z], i) => put(i % 3 === 0 ? kinds.rock : i % 5 === 0 ? kinds['crystal' + (i % 3)] : i % 4 === 0 ? kinds.crater : i % 23 === 0 ? kinds.flag : null, x, z, i % 4 === 0 ? 36 : 12, r.range(0.8, 1.4)));
      far.forEach(([x, z], i) => put(i % 9 === 0 ? kinds.base : i % 7 === 0 ? kinds.dish : i % 2 ? kinds.crater : kinds['crystal' + (i % 3)], x, z, 40, r.range(1, 2)));
      break;
  }
}

// ------------------------------------------------------------------ textures per theme
function groundTex(theme) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = theme.ground; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { // soft patches
      const x = Math.random() * w, y = Math.random() * h, r = 20 + Math.random() * 60;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, theme.ground2); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalAlpha = 0.5; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.globalAlpha = 1;
    speckle(g, w, h, 'rgba(0,0,0,0)', theme.ground2, 'rgba(255,255,255,.5)', 3000, 2);
    if (theme.plant === 'lamp') { // paving slabs
      g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2;
      for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); }
    }
    if (theme.plant === 'tree' || theme.plant === 'lolly') for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(30,90,20,${Math.random() * 0.25})`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 5); }
    if (theme.plant === 'cactus' || theme.plant === 'palm') { g.strokeStyle = 'rgba(160,110,50,.18)'; g.lineWidth = 3; for (let y = 10; y < h; y += 26) { g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x / 20 + y) * 5); g.stroke(); } }
  });
}
function roadTex(theme) {
  return canvasTex(256, 512, (g, w, h) => {
    speckle(g, w, h, theme.road, theme.road2, '#9e9e9e', 9000, 2, 0.25);
    // faint tyre marks
    g.globalAlpha = 0.08; g.fillStyle = '#000';
    g.fillRect(w * 0.28, 0, 18, h); g.fillRect(w * 0.66, 0, 18, h);
    g.fillStyle = theme.line; g.globalAlpha = 0.9;
    g.fillRect(w / 2 - 3, 40, 6, 180); g.fillRect(w / 2 - 3, 296, 6, 180);
    g.fillRect(10, 0, 5, h); g.fillRect(w - 15, 0, 5, h);
    g.globalAlpha = 1;
  });
}
function kerbTex(colors) {
  return canvasTex(16, 64, (g) => { g.fillStyle = colors[0]; g.fillRect(0, 0, 16, 32); g.fillStyle = colors[1]; g.fillRect(0, 32, 16, 32); });
}
function stripeTex(a, b) {
  return canvasTex(64, 16, g => { g.fillStyle = a; g.fillRect(0, 0, 64, 16); g.fillStyle = b; for (let x = -16; x < 64; x += 16) { g.beginPath(); g.moveTo(x, 16); g.lineTo(x + 8, 16); g.lineTo(x + 16, 0); g.lineTo(x + 8, 0); g.fill(); } });
}

// ------------------------------------------------------------------ road geometry
function ribbon(course, from, to, y0, y1, opts) {
  // a strip along the road between sideways offsets 'from'..'to', at the road height
  const { pts, n, elev, gap } = course;
  const pos = [], uv = [], idx = [];
  let v = 0, vi = 0;
  const skip = opts.skip || (i => gap[i] || gap[(i + 1) % n]);
  let prevOK = false;
  for (let k = 0; k <= n; k++) {
    const i = k % n, p = pts[i];
    const nx = -Math.sin(p.a), nz = Math.cos(p.a);
    if (k > 0) { const q = pts[(k - 1) % n]; v += Math.hypot(p.x - q.x, p.y - q.y) / (opts.vScale || 100); }
    const h = elev[i];
    const yA = (opts.wall ? (opts.wallBottom ? opts.wallBottom(i, h) : 0) : h) + y0;
    const yB = (opts.wall ? h : h) + y1;
    pos.push(p.x + nx * from, opts.wall ? yA : h + y0, p.y + nz * from);
    pos.push(p.x + nx * to, opts.wall ? yB : h + y1, p.y + nz * to);
    uv.push(0, v, 1, v);
    const ok = !skip(i);
    if (k > 0 && ok && prevOK) {
      const a = vi - 2, b = vi - 1, c = vi, d = vi + 1;
      if (opts.flip) idx.push(a, c, b, b, c, d); else idx.push(a, b, c, b, d, c);
    }
    prevOK = ok;
    vi += 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ------------------------------------------------------------------ the world
export function createWorld(course, items, theme, opts = {}) {
  const scene = new THREE.Scene();
  const shadows = opts.shadows !== false;
  const seed = trackSeed(course.track);
  const r = rng(seed);
  scene.fog = new THREE.Fog(theme.fog, theme.fogNear, theme.fogFar);
  scene.background = new THREE.Color(theme.fog);
  const disposables = [];

  // sky dome
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(theme.sky[0]) }, bot: { value: new THREE.Color(theme.sky[1]) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float t = clamp(vP.y*1.6+0.05,0.0,1.0); gl_FragColor = vec4(mix(bot, top, pow(t,0.7)),1.0); }',
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(5200, 24, 12), skyMat);
  sky.position.set(CX, 0, CZ);
  sky.renderOrder = -1;
  scene.add(sky);
  if (theme.stars) {
    const g = new THREE.BufferGeometry(), p = [];
    for (let i = 0; i < 1500; i++) { const a = r() * Math.PI * 2, b = r() * 1.3 + 0.05; p.push(CX + Math.cos(a) * Math.cos(b) * 4800, Math.sin(b) * 4800, CZ + Math.sin(a) * Math.cos(b) * 4800); }
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#fff', size: 2.5, sizeAttenuation: false, fog: false })));
    const earthTex = canvasTex(256, 128, (g2, w, h) => { g2.fillStyle = '#1e5bd6'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#3fae49'; for (let i = 0; i < 14; i++) { g2.beginPath(); g2.ellipse(r() * w, r() * h, 10 + r() * 30, 6 + r() * 16, r() * 3, 0, 7); g2.fill(); } g2.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 18; i++) { g2.beginPath(); g2.ellipse(r() * w, r() * h, 10 + r() * 24, 3 + r() * 5, 0, 0, 7); g2.fill(); } }, false);
    const earth = new THREE.Mesh(new THREE.SphereGeometry(260, 32, 20), new THREE.MeshStandardMaterial({ map: earthTex, emissive: '#112244', emissiveIntensity: 0.4, fog: false }));
    earth.position.set(CX - 1500, 1300, CZ - 3400);
    scene.add(earth);
  }

  // lights
  scene.add(new THREE.HemisphereLight(theme.hemi[0], theme.hemi[1], theme.hemiI));
  const sun = new THREE.DirectionalLight(theme.sun, theme.sunI);
  sun.position.set(CX + 600, 1100, CZ + 400);
  sun.target.position.set(CX, 0, CZ);
  scene.add(sun, sun.target);
  if (shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -1150; sc.right = 1150; sc.top = 900; sc.bottom = -900; sc.near = 100; sc.far = 3000;
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 1.2;
  }

  // ground
  const gt = groundTex(theme);
  gt.repeat.set(30, 30);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), std(theme.ground, { r: 1 }));
  ground.material.map = gt; ground.material.color.set('#ffffff');
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(CX, 0, CZ);
  ground.receiveShadow = true;
  scene.add(ground);
  if (theme.sea) {
    const seaMat = std('#1fb3e0', { r: 0.15, m: 0.2, t: 0.92 });
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(9000, 3800), seaMat);
    sea.rotation.x = -Math.PI / 2; sea.position.set(CX, 0.8, WORLD.h + 260 + 1900);
    scene.add(sea);
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(9000, 26), std('#ffffff', { t: 0.7 }));
    foam.rotation.x = -Math.PI / 2; foam.position.set(CX, 1, WORLD.h + 260);
    scene.add(foam);
    scene.userData.sea = sea;
  }

  // road
  const roadMat = std('#ffffff', { r: 0.85 });
  roadMat.map = roadTex(theme); roadMat.polygonOffset = true; roadMat.polygonOffsetFactor = -2;
  const road = new THREE.Mesh(ribbon(course, -TRACK_W / 2, TRACK_W / 2, 0.6, 0.6, { vScale: 120 }), roadMat);
  road.receiveShadow = true;
  scene.add(road);
  const kerbMat = std('#ffffff', { r: 0.7 }); kerbMat.map = kerbTex(theme.kerb);
  [[-TRACK_W / 2 - 7, -TRACK_W / 2], [TRACK_W / 2, TRACK_W / 2 + 7]].forEach(([a, b]) => {
    const k = new THREE.Mesh(ribbon(course, a, b, 0.9, 0.9, { vScale: 30 }), kerbMat);
    k.receiveShadow = true; scene.add(k);
  });
  // under the raised bits: walls down to the ground (or a thin deck on bridges)
  const wallMat = std(theme.plant === 'lamp' ? '#9aa0a6' : theme.plant === 'lolly' ? '#ffd1ec' : theme.plant === 'crystal' ? '#5d6680' : '#a1887f', { r: 0.9 });
  wallMat.side = THREE.DoubleSide;
  const raised = i => course.elev[i] > 0.3;
  // end caps where a jump ramp stops at the gap
  for (let i = 0; i < course.n; i++) {
    const j = (i + 1) % course.n, h = course.elev[i];
    if (h <= 0.3 || course.gap[i]) continue;
    if (!course.gap[j] && !course.gap[(i - 1 + course.n) % course.n]) continue;
    const p = course.pts[i];
    const cap = new THREE.Mesh(new THREE.PlaneGeometry(TRACK_W + 14, h + 0.9), wallMat);
    cap.position.set(p.x, (h + 0.9) / 2, p.y); cap.rotation.y = -p.a + Math.PI / 2;
    cap.castShadow = shadows; scene.add(cap);
  }
  const bottom = (i, h) => (course.deck[i] ? h - 7 : 0);
  [[-TRACK_W / 2 - 7, true], [TRACK_W / 2 + 7, false]].forEach(([off, flip]) => {
    const w = new THREE.Mesh(ribbon(course, off, off, 0, 0.9, { wall: true, wallBottom: bottom, skip: i => !raised(i) || !raised((i + 1) % course.n), flip }), wallMat);
    w.castShadow = shadows; w.receiveShadow = true;
    scene.add(w);
  });
  // deck underside on bridges
  const under = new THREE.Mesh(ribbon(course, TRACK_W / 2 + 7, -TRACK_W / 2 - 7, -6.4, -6.4, { skip: i => !course.deck[i] || !course.deck[(i + 1) % course.n] }), wallMat);
  scene.add(under);
  // side rails on raised bits
  const railMat = std('#ffffff', { r: 0.5, m: 0.3 }); railMat.map = stripeTex(theme.kerb[0], '#ffffff');
  railMat.side = THREE.DoubleSide;
  [-TRACK_W / 2 - 6, TRACK_W / 2 + 6].forEach(off => {
    const rail = new THREE.Mesh(ribbon(course, off, off, 0.9, 7, { wall: true, wallBottom: (i, h) => h + 0.9, skip: i => course.elev[i] < RAIL_H * 0.5 || course.elev[(i + 1) % course.n] < RAIL_H * 0.5, vScale: 40 }), railMat);
    rail.castShadow = shadows; scene.add(rail);
  });
  // bridge pillars + jump lip stripes
  const pillarMat = wallMat;
  course.crossings.forEach(c => {
    const p = course.pts[c.top];
    if (c.mode === 'bridge') {
      for (const s of [-1, 1]) {
        const d = (c.half + 6) * s;
        const x = p.x + Math.cos(p.a) * d, z = p.y + Math.sin(p.a) * d;
        for (const t of [-1, 1]) {
          const pl = new THREE.Mesh(new THREE.BoxGeometry(10, 36, 10), pillarMat);
          pl.position.set(x - Math.sin(p.a) * (TRACK_W / 2) * t, 18, z + Math.cos(p.a) * (TRACK_W / 2) * t);
          pl.castShadow = shadows; scene.add(pl);
        }
      }
    } else {
      // chevrons at the lip, and a big arrow sign
      const lipMat = std('#ffffff', { r: 0.6 }); lipMat.map = stripeTex('#ffd600', '#212121');
      for (let o = -Math.ceil((c.half + 20) / 12); o <= Math.ceil((c.half + 20) / 12); o++) {
        const i = ((c.top + o) % course.n + course.n) % course.n;
        if (!course.lip[i]) continue;
        const q = course.pts[i];
        const strip = new THREE.Mesh(new THREE.PlaneGeometry(TRACK_W, 8), lipMat);
        strip.rotation.order = 'YXZ'; strip.rotation.y = -q.a + Math.PI / 2; strip.rotation.x = -Math.PI / 2 + 0.17;
        strip.position.set(q.x, course.elev[i] + 1.2, q.y);
        scene.add(strip);
      }
    }
  });

  // barriers each side, a little way off the road (not where they'd cross other road)
  {
    const bm = std('#ffffff', { r: 0.5, m: 0.2 }); bm.map = stripeTex(theme.kerb[0], '#ffffff'); bm.side = THREE.DoubleSide;
    const capM = std('#9e9e9e', { r: 0.4, m: 0.6 });
    const H = 9;
    for (const side of [-1, 1]) {
      const pos = [], uv = [], idx = [], top = [], tidx = [];
      let v = 0, prevOK = false;
      for (let k = 0; k <= course.n; k++) {
        const i = k % course.n, p = course.pts[i];
        const x = p.x - Math.sin(p.a) * BARRIER * side, z = p.y + Math.cos(p.a) * BARRIER * side;
        if (k) { const q = course.pts[k - 1]; v += Math.hypot(p.x - q.x, p.y - q.y) / 30; }
        pos.push(x, 0, z, x, H, z); uv.push(v, 0, v, 1);
        top.push(x - Math.sin(p.a) * 1.5, H, z + Math.cos(p.a) * 1.5, x + Math.sin(p.a) * 1.5, H, z - Math.cos(p.a) * 1.5);
        const ok = distToRoad(course, x, z) > BARRIER - 6;
        if (k && ok && prevOK) { const a = (k - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); tidx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
        prevOK = ok;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx); g.computeVertexNormals();
      const wall = new THREE.Mesh(g, bm); wall.castShadow = shadows; wall.receiveShadow = true; scene.add(wall);
      const tg = new THREE.BufferGeometry();
      tg.setAttribute('position', new THREE.Float32BufferAttribute(top, 3));
      tg.setIndex(tidx); tg.computeVertexNormals();
      const capMesh = new THREE.Mesh(tg, capM); capMesh.material.side = THREE.DoubleSide; scene.add(capMesh);
    }
  }

  // arrows on the road showing which way to go
  {
    const at = canvasTex(64, 96, g => {
      g.fillStyle = 'rgba(255,255,255,.85)';
      for (const y of [6, 46]) { g.beginPath(); g.moveTo(32, y); g.lineTo(60, y + 30); g.lineTo(46, y + 30); g.lineTo(32, y + 16); g.lineTo(18, y + 30); g.lineTo(4, y + 30); g.closePath(); g.fill(); }
    }, false);
    const am = new THREE.MeshBasicMaterial({ map: at, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6 });
    for (const i of arrowSpots(course, items)) {
      const p = course.pts[i];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(34, 50), am);
      m.rotation.order = 'YXZ'; m.rotation.y = -p.a - Math.PI / 2; m.rotation.x = -Math.PI / 2;
      m.position.set(p.x, 0.9, p.y);
      scene.add(m);
    }
  }

  // start line + gantry
  {
    const p = course.pts[0];
    const chk = canvasTex(128, 16, g => { for (let x = 0; x < 16; x++) for (let y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 8, y * 8, 8, 8); } }, false);
    const line = new THREE.Mesh(new THREE.PlaneGeometry(TRACK_W, 12), new THREE.MeshStandardMaterial({ map: chk, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -4 }));
    line.rotation.order = 'YXZ'; line.rotation.y = -p.a + Math.PI / 2; line.rotation.x = -Math.PI / 2;
    line.position.set(p.x, course.elev[0] + 0.8, p.y);
    scene.add(line);
    const gan = new THREE.Group();
    gan.position.set(p.x, course.elev[0], p.y); gan.rotation.y = -p.a;
    const postM = std('#37474f', { m: 0.6, r: 0.4 });
    [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.BoxGeometry(5, 64, 5), postM); m.position.set(0, 32, s * (TRACK_W / 2 + 12)); m.castShadow = shadows; gan.add(m); });
    const ban = canvasTex(512, 96, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#ff3d00'); gr.addColorStop(0.5, '#ffd600'); gr.addColorStop(1, '#ff3d00');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1a1a2e'; g.font = 'bold 64px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText("🏁 KIT'S KARTS 🏁", w / 2, h / 2 + 4);
    }, false);
    const banM = new THREE.MeshStandardMaterial({ map: ban, emissive: '#ffffff', emissiveMap: ban, emissiveIntensity: 0.25 });
    const bm = new THREE.Mesh(new THREE.BoxGeometry(4, 18, TRACK_W + 28), [banM, banM, postM, postM, postM, postM]);
    bm.position.set(0, 62, 0); bm.castShadow = shadows; gan.add(bm);
    scene.add(gan);
  }

  // pads: boost, jump, mud, ice, water
  const arrowTex = canvasTex(64, 64, g => { g.fillStyle = '#ff9100'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#fff59d'; for (const y of [8, 36]) { g.beginPath(); g.moveTo(10, y + 20); g.lineTo(32, y); g.lineTo(54, y + 20); g.lineTo(44, y + 20); g.lineTo(32, y + 9); g.lineTo(20, y + 20); g.fill(); } });
  const boostMat = new THREE.MeshStandardMaterial({ map: arrowTex, emissive: '#ff6d00', emissiveIntensity: 0.7, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -6 });
  const anim = { boost: boostMat, boxes: [], cones: [], items: new Map(), t: 0 };
  const padY = it => (it.idx >= 0 ? course.elev[it.idx] : 0);
  for (const it of items) {
    const y = padY(it);
    if (it.type === 'boost') {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(BOOST_L, TRACK_W * 0.8), boostMat);
      m.rotation.order = 'YXZ'; m.rotation.y = -it.a; m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.PI / 2;
      m.position.set(it.x, y + 1.1, it.y); scene.add(m);
    }
    if (it.type === 'jump') {
      const shape = new THREE.Shape(); shape.moveTo(-JUMP_L / 2, 0); shape.lineTo(JUMP_L / 2, 0); shape.lineTo(JUMP_L / 2, 10); shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: TRACK_W * 0.9, bevelEnabled: false });
      geo.translate(0, 0, -TRACK_W * 0.45);
      const jm = new THREE.MeshStandardMaterial({ map: stripeTex('#ffd600', '#e53935'), roughness: 0.6 });
      jm.map.repeat.set(0.05, 0.1);
      const m = new THREE.Mesh(geo, jm);
      m.rotation.y = -it.a; m.position.set(it.x, y + 0.5, it.y); m.castShadow = shadows; m.receiveShadow = true; scene.add(m);
    }
    if (it.type === 'mud' || it.type === 'water' || it.type === 'ice') {
      const mat = it.type === 'mud' ? std('#5d4037', { r: 1 }) : it.type === 'water' ? std('#29b6f6', { r: 0.05, m: 0.3, t: 0.75 }) : std('#e1f5fe', { r: 0.05, m: 0.2, t: 0.85 });
      mat.polygonOffset = true; mat.polygonOffsetFactor = -5;
      const m = new THREE.Mesh(new THREE.CircleGeometry(1, 28), mat);
      m.scale.set(WATER_RX, WATER_RY, 1);
      m.rotation.order = 'YXZ'; m.rotation.y = -it.a; m.rotation.x = -Math.PI / 2;
      m.position.set(it.x, y + 1.0, it.y); m.receiveShadow = true; scene.add(m);
      if (it.type === 'mud') for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(3 + r() * 3, 8, 6), mat); b.scale.y = 0.4; b.position.set(it.x + (r() - 0.5) * WATER_RX, y + 1, it.y + (r() - 0.5) * WATER_RY); scene.add(b); }
    }
  }

  // solids: tyre walls, plants, grandstands
  const sc = scatterer(scene, shadows);
  const kinds = sceneryKinds(theme);
  sc.addBuilding = (kd, x, z, w, h, d, rot) => {
    sc.add(kd, x, 0, z, rot, 1, 1);
    // scale the unit box: re-add with matrix scale
  };
  // buildings need non-uniform scale, so handle them directly
  const buildings = [];
  sc.addBuilding = (kd, x, z, w, h, d, rot) => buildings.push({ kd, x, z, w, h, d, rot });
  const tyreKind = kind([[new THREE.TorusGeometry(7, 3.4, 8, 16), std('#222', { r: 0.9 }), 0, 3.4, 0, Math.PI / 2], [new THREE.TorusGeometry(7, 3.4, 8, 16), std('#222', { r: 0.9 }), 0, 10.2, 0, Math.PI / 2], [new THREE.TorusGeometry(7.2, 1, 6, 16), std(theme.kerb[0]), 0, 6.8, 0, Math.PI / 2]]);
  const plantKind = kinds.tree || kinds.cactus || kinds.pine || kinds.palm || kinds.dead || kinds.lolly0 || kinds.crystal0 || kinds.lamp;
  for (const it of items) {
    if (it.type === 'tyres') { for (const [ox, oz] of [[0, 0], [-12, 6], [12, 6], [-12, -6], [12, -6], [0, -12], [0, 12]]) sc.add(tyreKind, it.x + ox * 0.9, 0, it.y + oz * 0.9); }
    if (it.type === 'tree') sc.add(plantKind, it.x, 0, it.y, r() * 6, 1);
    if (it.type === 'stand') scene.add(grandstand(it, shadows, theme));
  }
  placeScenery(theme, course, sc, r, kinds);
  sc.build();
  // buildings with lit windows
  if (buildings.length) {
    const winTex = canvasTex(64, 128, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      for (let y = 6; y < h; y += 16) for (let x = 6; x < w; x += 14) { g.fillStyle = Math.random() < 0.25 ? '#ffe9a8' : '#4a6a8a'; g.fillRect(x, y, 8, 10); }
    });
    const cols = ['#ef9a9a', '#b0bec5', '#ffe0b2', '#b3e5fc', '#c8e6c9', '#e1bee7', '#d7ccc8'];
    const byCol = new Map();
    buildings.forEach((b, i) => { const c = cols[i % cols.length]; if (!byCol.has(c)) byCol.set(c, []); byCol.get(c).push(b); });
    const bg = new THREE.BoxGeometry(1, 1, 1); bg.translate(0, 0.5, 0);
    for (const [c, list] of byCol) {
      const t = winTex.clone(); t.needsUpdate = true;
      const m = new THREE.MeshStandardMaterial({ color: c, map: t, roughness: 0.7, metalness: 0.1 });
      const im = new THREE.InstancedMesh(bg, m, list.length);
      list.forEach((b, i) => im.setMatrixAt(i, new THREE.Matrix4().compose(new THREE.Vector3(b.x, 0, b.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, b.rot, 0)), new THREE.Vector3(b.w, b.h, b.d))));
      im.castShadow = shadows; im.receiveShadow = true; im.computeBoundingSphere();
      scene.add(im);
    }
  }

  // world edge: a low barrier round the outside
  {
    const bm = std('#ffffff', { r: 0.6 }); bm.map = stripeTex(theme.kerb[0], theme.kerb[1]); bm.map.repeat.set(30, 1);
    const L = [[WORLD.w, 0, CX, -6], [WORLD.w, 0, CX, WORLD.h + 6], [WORLD.h, Math.PI / 2, -6, CZ], [WORLD.h, Math.PI / 2, WORLD.w + 6, CZ]];
    L.forEach(([len, rot, x, z]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(len + 12, 9, 4), bm); m.rotation.y = rot; m.position.set(x, 4.5, z); m.castShadow = shadows; scene.add(m); });
  }

  // mystery boxes
  const qTex = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#ff6ec7'); gr.addColorStop(0.33, '#ffd54f'); gr.addColorStop(0.66, '#64ffda'); gr.addColorStop(1, '#7c4dff');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = '#fff'; g.font = 'bold 90px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 6; g.fillText('?', w / 2, h / 2 + 6);
  }, false);
  const boxMat = new THREE.MeshStandardMaterial({ map: qTex, transparent: true, opacity: 0.88, roughness: 0.15, metalness: 0.1, emissive: '#ffffff', emissiveMap: qTex, emissiveIntensity: 0.35 });
  const boxGeo = new THREE.BoxGeometry(13, 13, 13);
  function makeBoxes(list) {
    anim.boxes.forEach(b => scene.remove(b.mesh));
    anim.boxes = list.map((b, i) => {
      const m = new THREE.Mesh(boxGeo, boxMat);
      m.castShadow = shadows;
      m.position.set(b.x, b.z + 12, b.y);
      scene.add(m);
      return { mesh: m, data: b, ph: i * 0.7, s: 1 };
    });
  }

  // cones
  const coneGroupGeo = [new THREE.ConeGeometry(5, 14, 12), new THREE.CylinderGeometry(3.2, 3.9, 2.5, 12), new THREE.BoxGeometry(11, 1.2, 11)];
  const coneMats = [std('#ff6d00', { r: 0.5 }), std('#ffffff'), std('#ff6d00')];
  function makeCones(list) {
    anim.cones.forEach(c => scene.remove(c.mesh));
    anim.cones = list.map(k => {
      const g = new THREE.Group();
      const a = new THREE.Mesh(coneGroupGeo[0], coneMats[0]); a.position.y = 7.6; a.castShadow = shadows; g.add(a);
      const b = new THREE.Mesh(coneGroupGeo[1], coneMats[1]); b.position.y = 8; g.add(b);
      const c = new THREE.Mesh(coneGroupGeo[2], coneMats[2]); c.position.y = 0.6; g.add(c);
      scene.add(g);
      return { mesh: g, data: k };
    });
  }
  makeCones(items.filter(i => i.type === 'cone').map(i => ({ x: i.x, y: i.y, z: 0, rot: 0, tip: 0 })));

  // ---------------------------------------------------------------- items flying about
  const itemMeshes = {
    banana: () => { const g = new THREE.Group(); const m = std('#ffe135', { r: 0.4 }); for (let k = 0; k < 3; k++) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(2.2, 8, 4, 8), m); p.position.set(0, 5, 0); p.rotation.set(0.4, k * 2.1, 0.5); g.add(p); } const s = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3), std('#6d4c41')); s.position.y = 10; g.add(s); return g; },
    oil: () => { const m = new THREE.Mesh(new THREE.CircleGeometry(24, 20), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.05, metalness: 0.7, polygonOffset: true, polygonOffsetFactor: -8 })); m.rotation.x = -Math.PI / 2; m.position.y = 1.2; const g = new THREE.Group(); g.add(m); return g; },
    rocket: () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 16, 12), std('#e53935', { r: 0.3, m: 0.3 })); b.rotation.z = Math.PI / 2; g.add(b); const n = new THREE.Mesh(new THREE.ConeGeometry(3, 7, 12), std('#fafafa')); n.rotation.z = -Math.PI / 2; n.position.x = 11; g.add(n); [0, 1, 2, 3].forEach(k => { const f = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 5), std('#ffd600')); f.position.x = -7; f.rotation.x = k * Math.PI / 4 * 2; f.position.y = 0; g.add(f); }); const fl = new THREE.Mesh(new THREE.ConeGeometry(2.4, 10, 10), new THREE.MeshBasicMaterial({ color: '#ffab40', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })); fl.rotation.z = Math.PI / 2; fl.position.x = -13; g.add(fl); g.userData.flame = fl; return g; },
    ball: () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), std('#2ecc40', { r: 0.25 })); b.position.y = 7; g.add(b); const band = new THREE.Mesh(new THREE.TorusGeometry(7, 1.4, 6, 20), std('#ffffff')); band.rotation.x = Math.PI / 2; band.position.y = 6; g.add(band); return g; },
    bomb: () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), std('#212121', { r: 0.3, m: 0.4 })); b.position.y = 7; g.add(b); const f = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffeb3b' })); f.position.y = 15; g.add(f); g.userData.spark = f; const eyes = std('#ffffff'); [-2.5, 2.5].forEach(z => { const e = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6), eyes); e.position.set(6, 9, z); g.add(e); }); return g; },
  };
  function syncItems(objs, dt) {
    const seen = new Set();
    for (const o of objs) {
      seen.add(o.id);
      let m = anim.items.get(o.id);
      if (!m) { m = itemMeshes[o.kind](); m.traverse(x => { if (x.isMesh) x.castShadow = shadows && o.kind !== 'oil'; }); scene.add(m); anim.items.set(o.id, m); }
      m.position.set(o.x, o.z, o.y);
      if (o.kind === 'rocket') { m.rotation.y = -o.a; m.position.y = o.z + 4; m.userData.flame.scale.set(1, 0.8 + Math.random() * 0.5, 1); }
      if (o.kind === 'ball') m.rotation.y += dt * 8;
      if (o.kind === 'banana') m.rotation.y = (o.x * 7.3) % 6.28;
      if (o.kind === 'bomb') { m.userData.spark.visible = Math.floor(anim.t * (o.fuse < 0.6 ? 20 : 8)) % 2 === 0; const s = 1 + (o.fuse < 0.6 ? Math.sin(anim.t * 40) * 0.15 : 0); m.scale.setScalar(s); }
    }
    for (const [id, m] of anim.items) if (!seen.has(id)) { scene.remove(m); anim.items.delete(id); }
  }

  // ---------------------------------------------------------------- particles
  function particles(max, additive, size) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(max * 3), col = new Float32Array(max * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size, map: glowTex(), vertexColors: true, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, opacity: additive ? 1 : 0.75 });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    const P = [];
    const tmp = new THREE.Color();
    return {
      emit(x, y, z, vx, vy, vz, color, life, grav = 0) {
        if (P.length >= max) P.shift();
        tmp.set(color);
        P.push({ x, y, z, vx, vy, vz, r: tmp.r, g: tmp.g, b: tmp.b, life, max: life, grav });
      },
      update(dt) {
        let k = 0;
        for (let i = P.length - 1; i >= 0; i--) {
          const p = P[i];
          p.life -= dt;
          if (p.life <= 0) { P.splice(i, 1); continue; }
        }
        for (const p of P) {
          p.vy -= p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          const f = p.life / p.max;
          pos[k * 3] = p.x; pos[k * 3 + 1] = p.y; pos[k * 3 + 2] = p.z;
          col[k * 3] = p.r * f; col[k * 3 + 1] = p.g * f; col[k * 3 + 2] = p.b * f;
          k++;
        }
        geo.setDrawRange(0, k);
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
      },
    };
  }
  const sparks = particles(700, true, 7);
  const dust = particles(500, false, 16);
  const R = (a) => (Math.random() - 0.5) * a;
  const dustCol = theme.plant === 'pine' ? '#ffffff' : theme.plant === 'cactus' || theme.plant === 'palm' ? '#e8c88a' : theme.plant === 'lolly' ? '#ffc1e3' : '#bdb2a6';
  const fx = {
    dust(x, z, y, n = 6, col = dustCol) { for (let i = 0; i < n; i++) dust.emit(x + R(10), y + 2, z + R(10), R(40), 20 + Math.random() * 30, R(40), col, 0.6 + Math.random() * 0.4); },
    sparks(x, z, y, col, n = 4, sp = 60) { for (let i = 0; i < n; i++) sparks.emit(x, y + 2, z, R(sp), 30 + Math.random() * sp, R(sp), col, 0.25 + Math.random() * 0.2, 300); },
    boom(x, z, y) {
      for (let i = 0; i < 70; i++) sparks.emit(x, y + 6, z, R(360), Math.random() * 300, R(360), ['#ffeb3b', '#ff9800', '#ff3d00'][i % 3], 0.6 + Math.random() * 0.4, 300);
      for (let i = 0; i < 26; i++) dust.emit(x + R(30), y + 8, z + R(30), R(80), 30 + Math.random() * 60, R(80), '#555555', 1.2);
      const fl = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffcc66', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      fl.position.set(x, y + 10, z); scene.add(fl); flashes.push({ m: fl, t: 0 });
    },
    pop(x, z, y, col = '#ffffff') { for (let i = 0; i < 24; i++) sparks.emit(x, y + 6, z, R(200), Math.random() * 160, R(200), col, 0.5, 300); },
    confetti(x, z, y) { const cs = ['#ff1744', '#ffd600', '#00e676', '#2979ff', '#d500f9']; for (let i = 0; i < 80; i++) sparks.emit(x + R(20), y + 20, z + R(20), R(200), 100 + Math.random() * 200, R(200), cs[i % 5], 1.6, 160); },
    splash(x, z, y) { for (let i = 0; i < 20; i++) dust.emit(x + R(16), y + 2, z + R(16), R(80), 60 + Math.random() * 80, R(80), '#b3e5fc', 0.7, 300); },
    box(x, z, y) { for (let i = 0; i < 30; i++) sparks.emit(x, y + 12, z, R(160), Math.random() * 150, R(160), ['#ff6ec7', '#ffd54f', '#64ffda', '#7c4dff'][i % 4], 0.6, 200); },
  };
  const flashes = [];

  // snow falling (follows the first camera)
  let snow = null;
  if (theme.snowfall || theme.plant === 'deadtree') {
    const N = 1200, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { p[i * 3] = R(900); p[i * 3 + 1] = Math.random() * 400; p[i * 3 + 2] = R(900); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const ash = theme.plant === 'deadtree';
    snow = new THREE.Points(g, new THREE.PointsMaterial({ color: ash ? '#ff8a50' : '#ffffff', size: ash ? 3 : 4, map: glowTex(), transparent: true, depthWrite: false, blending: ash ? THREE.AdditiveBlending : THREE.NormalBlending }));
    snow.frustumCulled = false;
    snow.userData.ash = ash;
    scene.add(snow);
  }

  // ---------------------------------------------------------------- karts
  const karts = new Map();
  function addKart(id, look, tag) {
    const k = buildKart(look);
    k.root.traverse(o => { if (o.isMesh && o !== k.root.userData.shadow) o.castShadow = shadows; });
    scene.add(k.root);
    if (tag) {
      const tex = canvasTex(128, 64, (g, w, h) => { g.fillStyle = tag.color; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 20); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 40px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(tag.text, w / 2, h / 2 + 2); }, false);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      sp.scale.set(18, 9, 1); sp.position.y = 40; sp.renderOrder = 10;
      if (tag.layer) sp.layers.set(tag.layer);
      k.root.add(sp); k.tag = sp;
    }
    karts.set(id, k);
    return k;
  }

  function syncKarts(cars, dt) {
    for (const c of cars) {
      const k = karts.get(c.id);
      if (!k) continue;
      k.root.visible = !c.gone && (c.rescueT <= 0 || Math.floor(c.rescueT * 10) % 2 === 0 && c.rescueT < 0.5);
      k.root.position.set(c.x, c.z, c.y);
      k.root.rotation.y = -c.a;
      // flips and tricks
      let rz = 0, rx = 0;
      if (c.flipT > 0) rz = (1 - c.flipT / 1.1) * Math.PI * 2;
      if (c.trickT > 0) rx = (1 - c.trickT / 0.5) * Math.PI * 2 * (c.trickDir || 1);
      // pitch with the road slope
      const pitch = c.air ? Math.max(-0.5, Math.min(0.5, c.vz / 700)) : Math.max(-0.4, Math.min(0.4, c.slopeVz / Math.max(60, c.speed) * 0.9));
      k.tilt.rotation.set(rx, 0, rz + pitch);
      const sh = k.root.userData.shadow;
      const h = c.z - c.ground;
      sh.position.y = -h + 0.9;
      const s = Math.max(0.3, 1 - h / 120);
      sh.scale.set(17 * s, 11 * s, 1);
      sh.material.opacity = 0.35 * s;
      k.update(dt, { speed: c.speed, vF: c.vF, steer: c.steer, boost: c.boostT, shield: c.shieldT, star: c.starT, small: c.smallT, drift: c.drifting });
      // drift sparks + dust
      const fxX = Math.cos(c.a), fxZ = Math.sin(c.a);
      if (c.drifting && !c.air) {
        const col = c.driftT > 1.6 ? '#ff9100' : c.driftT > 0.7 ? '#40c4ff' : '#ffffff';
        for (const s2 of [-1, 1]) fx.sparks(c.x - fxX * 12 - fxZ * 8 * s2, c.y - fxZ * 12 + fxX * 8 * s2, c.z, col, 2, 50);
      }
      if (!c.air && (c.surface === 'off' || c.skid > 60) && c.speed > 100 && Math.random() < 0.5) fx.dust(c.x - fxX * 12, c.y - fxZ * 12, c.z, 1);
      if (c.boostT > 0 && Math.random() < 0.6) fx.sparks(c.x - fxX * 18, c.y - fxZ * 18, c.z + 6, '#ffab40', 1, 30);
    }
  }

  function update(dt, race, cams) {
    anim.t += dt;
    boostMat.map.offset.y -= dt * 2;
    if (race) {
      if (anim.boxes.length !== race.boxes.length) makeBoxes(race.boxes);
      for (const b of anim.boxes) {
        const vis = b.data.cool <= 0;
        b.s += ((vis ? 1 : 0) - b.s) * Math.min(1, dt * 8);
        b.mesh.visible = b.s > 0.02;
        b.mesh.scale.setScalar(Math.max(0.01, b.s));
        b.mesh.rotation.set(anim.t * 0.7 + b.ph, anim.t * 1.1 + b.ph, 0);
        b.mesh.position.y = b.data.z + 12 + Math.sin(anim.t * 2 + b.ph) * 2;
      }
      if (anim.cones.length !== race.cones.length) makeCones(race.cones);
      anim.cones.forEach((c, i) => {
        const k = race.cones[i];
        c.mesh.position.set(k.x, k.z, k.y);
        c.mesh.rotation.set(k.tip ? Math.PI / 2 : 0, k.rot, 0);
      });
      syncItems(race.objs, dt);
      syncKarts(race.cars, dt);
    } else {
      for (const b of anim.boxes) { b.mesh.rotation.set(anim.t * 0.7 + b.ph, anim.t * 1.1 + b.ph, 0); }
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]; f.t += dt;
      f.m.scale.setScalar(10 + f.t * 160); f.m.material.opacity = Math.max(0, 0.9 - f.t * 2.4);
      if (f.t > 0.4) { scene.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); flashes.splice(i, 1); }
    }
    sparks.update(dt); dust.update(dt);
    if (snow && cams && cams[0]) {
      const p = snow.geometry.attributes.position.array;
      const c = cams[0].position;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 1] -= dt * (snow.userData.ash ? -20 : 60);
        p[i] += Math.sin(anim.t + i) * dt * 8;
        if (p[i + 1] < 0) p[i + 1] += 400;
        if (p[i + 1] > 400) p[i + 1] -= 400;
      }
      snow.position.set(c.x, 0, c.z);
      snow.geometry.attributes.position.needsUpdate = true;
    }
    if (scene.userData.sea) scene.userData.sea.position.y = 0.8 + Math.sin(anim.t) * 0.6;
  }

  function dispose() {
    scene.traverse(o => {
      if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
    });
    disposables.forEach(d => d.dispose());
  }

  return { scene, addKart, karts, update, fx, dispose, sun };
}

function grandstand(it, shadows, theme) {
  const g = new THREE.Group();
  g.position.set(it.x, 0, it.y);
  g.rotation.y = -it.a;
  const seat = std(theme.plant === 'lolly' ? '#ff80ab' : '#90a4ae', { r: 0.7 });
  for (let k = 0; k < 4; k++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(144, 7, 12), seat);
    m.position.set(0, 3.5 + k * 7, -18 + k * 12 - 0);
    m.castShadow = shadows; m.receiveShadow = true; g.add(m);
    // crowd
    const cols = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#fb8c00', '#8e24aa', '#ffffff'];
    const crowd = new THREE.InstancedMesh(new THREE.CapsuleGeometry(2.2, 3, 3, 6), std('#ffffff'), 16);
    for (let j = 0; j < 16; j++) {
      crowd.setMatrixAt(j, new THREE.Matrix4().makeTranslation(-64 + j * 8.5 + Math.random() * 2, 11 + k * 7, -18 + k * 12));
      crowd.setColorAt(j, new THREE.Color(cols[(j + k * 3) % cols.length]));
    }
    crowd.castShadow = shadows; g.add(crowd);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(150, 2, 54), std(theme.kerb[0]));
  roof.position.set(0, 52, 0); roof.castShadow = shadows; g.add(roof);
  [-72, 72].forEach(x => [-24, 24].forEach(z => { const p = new THREE.Mesh(new THREE.BoxGeometry(3, 52, 3), std('#455a64')); p.position.set(x, 26, z); g.add(p); }));
  return g;
}

// chase camera for one kart
export function chaseCam(cam, car, dt, first) {
  const fx = Math.cos(car.camA ?? car.a), fz = Math.sin(car.camA ?? car.a);
  // camera heading follows the kart smoothly (not during spins)
  if (car.camA === undefined || first) car.camA = car.a;
  if (car.spinT <= 0 && car.flipT <= 0) {
    let d = car.a - car.camA; d = Math.atan2(Math.sin(d), Math.cos(d));
    car.camA += d * Math.min(1, dt * (car.drifting ? 3 : 5));
  }
  const back = 62 + Math.min(20, car.speed * 0.03), up = 26;
  const tx = car.x - fx * back, tz = car.y - fz * back;
  const ty = Math.max(car.z, car.ground) + up + (car.air ? 6 : 0);
  if (first) cam.position.set(tx, ty, tz);
  else {
    const k = Math.min(1, dt * 8);
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.z += (tz - cam.position.z) * k;
    cam.position.y += (ty - cam.position.y) * Math.min(1, dt * 5);
  }
  cam.lookAt(car.x + fx * 40, car.z + 10, car.y + fz * 40);
  const fov = 68 + (car.boostT > 0 ? 10 : 0) + Math.min(6, car.speed * 0.012);
  cam.fov += (fov - cam.fov) * Math.min(1, dt * 4);
  cam.updateProjectionMatrix();
}
