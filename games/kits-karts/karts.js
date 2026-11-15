// Karts: all the ways to customise them, their stats, and the 3D models.
// A kart model faces +X, sits on the ground at y = 0, about 28 long.
import * as THREE from '../../js/vendor/three.module.min.js';

export const COLORS = ['#e53935', '#fb8c00', '#fdd835', '#7cb342', '#00897b', '#1e88e5', '#3949ab', '#8e24aa',
  '#ec407a', '#ffffff', '#9e9e9e', '#212121', '#6d4c41', '#00e5ff'];

// stats 1..5: speed, accel, turn, weight, offroad
export const BODIES = [
  { id: 'kart', name: 'Go-kart', stats: [3, 4, 4, 2, 2] },
  { id: 'f1', name: 'F1', stats: [5, 3, 4, 2, 1] },
  { id: 'buggy', name: 'Off-road', stats: [3, 3, 3, 3, 5] },
  { id: 'monster', name: 'Monster', stats: [3, 2, 2, 5, 5] },
  { id: 'rover', name: 'NASA rover', stats: [3, 4, 3, 3, 5] },
  { id: 'rocket', name: 'Rocket car', stats: [5, 2, 2, 3, 1] },
  { id: 'tractor', name: 'Tractor', stats: [2, 3, 2, 5, 4] },
  { id: 'hover', name: 'Hover car', stats: [4, 3, 5, 1, 3] },
  { id: 'police', name: 'Police', stats: [4, 3, 3, 4, 2] },
  { id: 'bath', name: 'Bath tub', stats: [3, 3, 3, 3, 3] },
];
export const WHEELS = [
  { id: 'normal', icon: '⚫', mod: [0, 0, 0, 0, 0] },
  { id: 'slick', icon: '🏁', mod: [1, 0, 0, 0, -1] },
  { id: 'knobbly', icon: '🌲', mod: [-0.5, 0, 0, 0, 2] },
  { id: 'big', icon: '🛞', mod: [0, -0.5, 0, 1, 1.5] },
  { id: 'gold', icon: '🥇', mod: [0, 0.5, 0, 0, 0] },
  { id: 'neon', icon: '💡', mod: [0, 0, 0.5, 0, 0] },
];
export const DRIVERS = ['kid', 'astro', 'robot', 'cat', 'dog', 'bear', 'alien', 'dino'];
export const DRIVER_ICON = { kid: '🧒', astro: '🧑‍🚀', robot: '🤖', cat: '🐱', dog: '🐶', bear: '🐻', alien: '👽', dino: '🦖' };
export const SPOILERS = ['none', 'small', 'big', 'twin'];
export const SPOILER_ICON = { none: '🚫', small: '▬', big: '🪽', twin: '〰️' };
export const TOPPERS = ['none', 'flag', 'siren', 'dish', 'fin', 'horns', 'crown', 'propeller'];
export const TOPPER_ICON = { none: '🚫', flag: '🚩', siren: '🚨', dish: '📡', fin: '🦈', horns: '🐮', crown: '👑', propeller: '🌀' };
export const DECALS = ['none', 'stripes', 'flames', 'stars', 'checks', 'bolt', 'spots', 'number'];
export const DECAL_ICON = { none: '🚫', stripes: '〰️', flames: '🔥', stars: '⭐', checks: '🏁', bolt: '⚡', spots: '🐆', number: '#️⃣' };
export const FLAMES = ['fire', 'blue', 'green', 'pink', 'rainbow'];
export const FLAME_COLORS = { fire: ['#ffcc33', '#ff5a1f'], blue: ['#bff4ff', '#2f7bff'], green: ['#d6ffb0', '#25c43b'], pink: ['#ffd1f4', '#ff2fb4'], rainbow: ['#ffffff', '#ff3d3d'] };

export function defaultLook(i = 0) {
  return {
    body: ['kart', 'f1', 'buggy', 'rover'][i % 4], color: COLORS[[0, 5, 2, 3][i % 4]], color2: '#ffffff',
    wheels: 'normal', driver: DRIVERS[i % DRIVERS.length], helmet: COLORS[[5, 0, 8, 1][i % 4]],
    spoiler: 'small', topper: 'none', decal: 'stripes', flame: 'fire', num: 1 + i,
  };
}
export function cleanLook(l, i = 0) {
  const d = defaultLook(i);
  if (!l || typeof l !== 'object') return d;
  const pick = (v, list, def) => (list.includes(v) ? v : def);
  const col = (v, def) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : def);
  return {
    body: pick(l.body, BODIES.map(b => b.id), d.body), color: col(l.color, d.color), color2: col(l.color2, d.color2),
    wheels: pick(l.wheels, WHEELS.map(w => w.id), d.wheels), driver: pick(l.driver, DRIVERS, d.driver),
    helmet: col(l.helmet, d.helmet), spoiler: pick(l.spoiler, SPOILERS, d.spoiler), topper: pick(l.topper, TOPPERS, d.topper),
    decal: pick(l.decal, DECALS, d.decal), flame: pick(l.flame, FLAMES, d.flame), num: Math.max(1, Math.min(99, l.num | 0 || d.num)),
  };
}

// final stats 1..6 after wheels
export function statsOf(look) {
  const b = BODIES.find(x => x.id === look.body) || BODIES[0];
  const w = look.body === 'hover' ? WHEELS[0] : (WHEELS.find(x => x.id === look.wheels) || WHEELS[0]);
  return b.stats.map((s, i) => Math.max(1, Math.min(6, s + w.mod[i])));
}

// ------------------------------------------------------------------ materials (cached)
const MATS = new Map();
function mat(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!MATS.has(key)) {
    MATS.set(key, new THREE.MeshStandardMaterial({
      color, roughness: o.r ?? 0.45, metalness: o.m ?? 0.1,
      emissive: o.e || '#000000', emissiveIntensity: o.ei ?? 1, transparent: !!o.t, opacity: o.t ?? 1,
      flatShading: !!o.flat, side: o.ds ? THREE.DoubleSide : THREE.FrontSide,
    }));
  }
  return MATS.get(key);
}
const paint = c => mat(c, { r: 0.28, m: 0.35 });
const RUBBER = () => mat('#1d1d20', { r: 0.9 });
const CHROME = () => mat('#d9dde3', { r: 0.18, m: 0.95 });
const DARK = () => mat('#2a2c31', { r: 0.6, m: 0.4 });

const G = {}; // shared geometries
function geo(key, make) { return G[key] || (G[key] = make()); }
const box = (w, h, d) => geo(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
const cyl = (rt, rb, h, s = 16) => geo(`c${rt},${rb},${h},${s}`, () => new THREE.CylinderGeometry(rt, rb, h, s));
const sph = (r, s = 16) => geo(`s${r},${s}`, () => new THREE.SphereGeometry(r, s, Math.max(8, s * 0.75 | 0)));
const cone = (r, h, s = 12) => geo(`k${r},${h},${s}`, () => new THREE.ConeGeometry(r, h, s));
const cap = (r, l) => geo(`p${r},${l}`, () => new THREE.CapsuleGeometry(r, l, 6, 14));
const tor = (r, t) => geo(`t${r},${t}`, () => new THREE.TorusGeometry(r, t, 8, 20));

function M(g, m, x = 0, y = 0, z = 0, parent) {
  const o = new THREE.Mesh(g, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  if (parent) parent.add(o);
  return o;
}

// decal painted on a canvas -> body texture
const DECAL_TEX = new Map();
function decalTex(look) {
  const key = [look.color, look.color2, look.decal, look.num].join();
  if (DECAL_TEX.has(key)) return DECAL_TEX.get(key);
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = look.color; g.fillRect(0, 0, 256, 128);
  g.fillStyle = look.color2; g.strokeStyle = look.color2;
  const d = look.decal;
  if (d === 'stripes') { g.fillRect(0, 40, 256, 16); g.fillRect(0, 72, 256, 16); }
  if (d === 'checks') for (let x = 0; x < 16; x++) for (let y = 0; y < 8; y++) if ((x + y) % 2) g.fillRect(x * 16, y * 16, 16, 16);
  if (d === 'spots') for (let k = 0; k < 18; k++) { g.beginPath(); g.ellipse((k * 53) % 256, (k * 37) % 128, 9 + (k % 3) * 4, 7 + (k % 2) * 4, k, 0, 7); g.fill(); }
  if (d === 'stars') { g.font = '44px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let k = 0; k < 5; k++) g.fillText('★', 26 + k * 52, k % 2 ? 40 : 88); }
  if (d === 'bolt') { g.beginPath(); g.moveTo(10, 50); g.lineTo(120, 40); g.lineTo(110, 64); g.lineTo(246, 52); g.lineTo(130, 92); g.lineTo(140, 70); g.lineTo(10, 80); g.closePath(); g.fill(); }
  if (d === 'flames') {
    const gr = g.createLinearGradient(0, 0, 256, 0);
    gr.addColorStop(0, '#ffeb3b'); gr.addColorStop(0.5, '#ff9800'); gr.addColorStop(1, 'rgba(244,67,54,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 30);
    for (let k = 0; k < 6; k++) { g.quadraticCurveTo(40 + k * 34, 30 + (k % 2 ? -10 : 30), 60 + k * 36, 64); g.quadraticCurveTo(50 + k * 36, 80, 70 + k * 36, 100 - k * 4); }
    g.lineTo(0, 100); g.closePath(); g.fill();
  }
  if (d === 'number') {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 64, 46, 0, 7); g.fill();
    g.fillStyle = '#111'; g.font = 'bold 62px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(look.num), 128, 68);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  DECAL_TEX.set(key, t);
  return t;
}
function bodyMat(look) {
  const key = 'body' + [look.color, look.color2, look.decal, look.num].join();
  if (!MATS.has(key)) MATS.set(key, new THREE.MeshStandardMaterial({ map: decalTex(look), roughness: 0.28, metalness: 0.3 }));
  return MATS.get(key);
}

// ------------------------------------------------------------------ wheels
function makeWheel(r, w, style, parent, x, z, front) {
  const pivot = new THREE.Group(); // steers
  pivot.position.set(x, r, z);
  parent.add(pivot);
  const spin = new THREE.Group();
  pivot.add(spin);
  const tyre = M(cyl(r, r, w, 20), RUBBER(), 0, 0, 0, spin);
  tyre.rotation.x = Math.PI / 2;
  const rimC = style === 'gold' ? mat('#ffd54f', { r: 0.2, m: 1 }) : style === 'neon' ? mat('#00e5ff', { e: '#00e5ff', ei: 1.5 }) : CHROME();
  const hub = M(cyl(r * 0.55, r * 0.55, w + 0.3, 10), rimC, 0, 0, 0, spin);
  hub.rotation.x = Math.PI / 2;
  if (style === 'knobbly' || style === 'big') { // chunky tread
    for (let k = 0; k < 10; k++) {
      const a = k / 10 * Math.PI * 2;
      const b = M(box(r * 0.35, r * 0.25, w + 0.4), RUBBER(), Math.cos(a) * r, Math.sin(a) * r, 0, spin);
      b.rotation.z = a; b.castShadow = false;
    }
  }
  if (style === 'neon') { const ring = M(tor(r * 0.98, 0.35), mat('#00e5ff', { e: '#00e5ff', ei: 2 }), 0, 0, w / 2 * Math.sign(z), spin); ring.castShadow = false; }
  return { pivot, spin, r, front };
}

// ------------------------------------------------------------------ drivers
function makeDriver(look, parent, x, y) {
  const d = new THREE.Group();
  d.position.set(x, y, 0);
  parent.add(d);
  const suit = look.driver === 'robot' ? mat('#b0bec5', { m: 0.8, r: 0.3 }) : look.driver === 'astro' ? mat('#f5f5f5') : paint(look.helmet);
  M(cap(2.6, 3), suit, 0, 3, 0, d);            // body
  const H = new THREE.Group(); H.position.set(0.3, 8.6, 0); d.add(H);
  const hc = look.helmet;
  switch (look.driver) {
    case 'kid': {
      M(sph(3.2), paint(hc), 0, 0, 0, H);
      const v = M(sph(2.6), mat('#1b2a3a', { r: 0.05, m: 0.9 }), 1.2, 0.1, 0, H); v.scale.set(0.8, 0.6, 1.05);
      M(box(0.8, 0.6, 6.6), mat('#ffffff'), 0, 1.3, 0, H);
      break;
    }
    case 'astro': {
      M(sph(3.4), mat('#ffffff', { r: 0.3 }), 0, 0, 0, H);
      const v = M(sph(2.8), mat('#ffb300', { r: 0.05, m: 1 }), 1.1, 0.2, 0, H); v.scale.set(0.8, 0.75, 1);
      M(box(2, 2.2, 3), mat('#eeeeee'), -3.2, -2.8, 0, H); // backpack
      break;
    }
    case 'robot': {
      M(box(5, 4.6, 5), mat('#90a4ae', { m: 0.9, r: 0.25 }), 0, 0, 0, H);
      [-1.2, 1.2].forEach(z => M(sph(0.8, 8), mat('#00e5ff', { e: '#00e5ff', ei: 2 }), 2.5, 0.5, z, H));
      M(cyl(0.2, 0.2, 3, 6), DARK(), 0, 3.6, 0, H);
      M(sph(0.7, 8), mat('#ff1744', { e: '#ff1744' }), 0, 5.2, 0, H);
      break;
    }
    case 'cat': case 'dog': case 'bear': {
      const fur = { cat: '#ff9f43', dog: '#c49a6c', bear: '#7b5236' }[look.driver];
      M(sph(3.1), mat(fur, { r: 0.8 }), 0, 0, 0, H);
      const sn = M(sph(1.5), mat(look.driver === 'cat' ? '#ffe0c2' : '#e8d3b5', { r: 0.8 }), 2.6, -0.8, 0, H); sn.scale.set(0.8, 0.7, 1);
      M(sph(0.55, 8), mat('#222'), 3.6, -0.5, 0, H);
      [-1.2, 1.2].forEach(z => M(sph(0.5, 8), mat('#111'), 2.6, 0.8, z, H));
      [-1.8, 1.8].forEach(z => {
        if (look.driver === 'cat') { const e = M(cone(1.1, 2.2, 4), mat(fur, { r: 0.8 }), -0.2, 3, z, H); e.rotation.x = z * 0.15; }
        if (look.driver === 'bear') M(sph(1.1, 10), mat(fur, { r: 0.8 }), -0.3, 2.6, z * 1.1, H);
        if (look.driver === 'dog') { const e = M(cap(0.8, 2.4), mat('#8d6e4a', { r: 0.8 }), -0.4, 0.4, z * 1.7, H); e.rotation.x = z * 0.25; }
      });
      M(box(0.6, 0.6, 6.4), paint(hc), -0.5, 2.2, 0, H); // little headband in helmet colour
      break;
    }
    case 'alien': {
      const s = mat('#7ee35b', { r: 0.5 });
      const h = M(sph(3.2), s, 0, 0.5, 0, H); h.scale.set(1, 1.15, 1);
      [-1.3, 1.3].forEach(z => { const e = M(sph(1.2, 10), mat('#111', { r: 0.1 }), 2.4, 0.8, z, H); e.scale.set(0.5, 1, 0.8); });
      [-1.3, 1.3].forEach(z => { M(cyl(0.15, 0.15, 3, 5), s, -0.3, 4.4, z, H); M(sph(0.6, 8), mat(hc, { e: hc, ei: 0.8 }), -0.3, 6, z, H); });
      break;
    }
    case 'dino': {
      const s = mat('#43a047', { r: 0.6 });
      M(sph(3, 14), s, 0, 0, 0, H);
      const sn = M(cap(2, 2.4), s, 2.8, -0.6, 0, H); sn.rotation.z = Math.PI / 2;
      [-1.2, 1.2].forEach(z => M(sph(0.6, 8), mat('#fff'), 1.6, 1.6, z, H));
      for (let k = 0; k < 3; k++) M(cone(0.8, 1.8, 4), mat(hc), -1 - k * 1.3, 2.6 - k * 0.5, 0, H);
      break;
    }
  }
  return { group: d, head: H };
}

// ------------------------------------------------------------------ bodies
function buildBody(look, g) {
  const P = paint(look.color), P2 = paint(look.color2), B = bodyMat(look);
  const W = look.wheels;
  const wheels = [];
  let seat = { x: -2, y: 4 }, top = 10, back = -12, hover = false;
  const four = (rf, rr, xf, xr, zf, zr, w = 3.5) => {
    wheels.push(makeWheel(rf, w, W, g, xf, -zf, true), makeWheel(rf, w, W, g, xf, zf, true));
    wheels.push(makeWheel(rr, w + 0.6, W, g, xr, -zr, false), makeWheel(rr, w + 0.6, W, g, xr, zr, false));
  };
  const big = W === 'big' ? 1.35 : W === 'knobbly' ? 1.12 : 1;
  switch (look.body) {
    case 'kart': {
      four(4.2 * big, 5 * big, 10, -9, 8.5, 9);
      M(box(24, 1.6, 12), DARK(), 0, 4, 0, g);
      const nose = M(box(9, 3, 13), B, 11, 5.2, 0, g); nose.rotation.z = -0.15;
      [-1, 1].forEach(s => M(box(12, 3.4, 2.5), B, 0, 5.4, s * 7, g));      // side pods
      M(box(6, 5, 9), P2, -5, 7, 0, g);                                      // seat back
      M(box(6, 4, 8), DARK(), -11, 6.5, 0, g);                               // engine
      M(cyl(0.9, 0.9, 5, 8), CHROME(), -14, 8, 2.5, g).rotation.z = Math.PI / 2;
      const sw = M(tor(1.8, 0.35), DARK(), 4, 9, 0, g); sw.rotation.y = Math.PI / 2; sw.rotation.x = 0.4;
      seat = { x: -2, y: 4.5 }; top = 15; back = -15;
      break;
    }
    case 'f1': {
      four(4.4 * big, 5 * big, 13, -11, 9.5, 9.5, 4.2);
      const tub = M(box(20, 4.5, 8), B, -1, 5.5, 0, g);
      const nose = M(cyl(1.4, 3.6, 14, 10), B, 14, 5, 0, g); nose.rotation.z = -Math.PI / 2 - 0.05;
      M(box(4, 0.8, 22), P2, 21, 2.6, 0, g);                                 // front wing
      [-1, 1].forEach(s => M(box(4, 2.5, 0.6), P, 21, 3.5, s * 11, g));
      [-1, 1].forEach(s => M(box(12, 4, 4), B, -3, 5, s * 5.5, g));        // sidepods
      M(box(8, 6, 6), P, -9, 8.5, 0, g);                                     // airbox
      const halo = M(tor(3, 0.4), DARK(), 2, 10, 0, g); halo.rotation.x = Math.PI / 2; halo.scale.set(1.3, 1, 1);
      if (look.spoiler === 'none') look = { ...look, spoiler: 'big' };
      seat = { x: -1, y: 4 }; top = 14; back = -17;
      tub.castShadow = true;
      break;
    }
    case 'buggy': {
      four(6.2 * big, 6.8 * big, 11, -10, 10, 10, 4.4);
      M(box(22, 2, 11), DARK(), 0, 8, 0, g);
      M(box(10, 3, 12), B, 11, 9.5, 0, g).rotation.z = -0.3;
      M(box(8, 5, 12), B, -9, 10, 0, g);
      // roll cage tubes
      const tube = (x1, y1, z1, x2, y2, z2) => {
        const a = new THREE.Vector3(x1, y1, z1), b = new THREE.Vector3(x2, y2, z2);
        const m = M(cyl(0.6, 0.6, a.distanceTo(b), 6), P2, 0, 0, 0, g);
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      };
      [-1, 1].forEach(s => { tube(5, 9, s * 5, 0, 20, s * 4.5); tube(0, 20, s * 4.5, -7, 20, s * 4.5); tube(-7, 20, s * 4.5, -10, 9, s * 5); });
      tube(0, 20, -4.5, 0, 20, 4.5); tube(-7, 20, -4.5, -7, 20, 4.5);
      [-1, 1].forEach(s => M(cyl(0.9, 0.9, 6, 8), mat('#ffeb3b', { e: '#ffeb3b', ei: 0.6 }), 1, 21, s * 3, g).rotation.z = Math.PI / 2);
      seat = { x: -3, y: 9 }; top = 23; back = -16;
      break;
    }
    case 'monster': {
      four(9 * big, 9 * big, 10, -10, 11, 11, 6);
      M(box(26, 2.5, 12), DARK(), 0, 13, 0, g);
      [-1, 1].forEach(s => { const sp = M(cyl(0.8, 0.8, 8, 6), mat('#ffeb3b'), 10 * s, 11, 0, g); sp.rotation.x = Math.PI / 2; sp.scale.y = 2.4; });
      M(box(12, 5, 15), B, 7, 17, 0, g);                                      // bonnet
      M(box(9, 8, 15), B, -2, 20, 0, g);                                      // cab
      M(box(8.6, 5, 15.4), mat('#9fd3ff', { r: 0.05, m: 0.7 }), -1.6, 21, 0, g);
      M(box(10, 3, 15), P2, -11, 16.5, 0, g);                                 // bed
      M(box(1, 4, 15), DARK(), 13.5, 17, 0, g);
      seat = { x: -2, y: 14 }; top = 25; back = -17;
      break;
    }
    case 'rover': {
      const r = 4.6 * big;
      [-1, 1].forEach(s => [11, 0, -11].forEach((x, k) => wheels.push(makeWheel(r, 3.4, W === 'normal' ? 'knobbly' : W, g, x, s * 11, k === 0))));
      M(box(28, 2.5, 16), mat('#d0d4da', { m: 0.85, r: 0.3 }), 0, 10, 0, g);
      M(box(9, 6, 12), mat('#ffc94a', { m: 1, r: 0.35 }), -8, 14, 0, g);     // gold foil box
      M(box(6, 3, 12), B, 9, 12.5, 0, g);
      [-1, 1].forEach(s => { [11, 0, -11].forEach(x => { const a = M(box(1.2, 4, 1.2), DARK(), x, 9, s * 9, g); a.rotation.x = s * 0.4; }); });
      const mast = M(cyl(0.5, 0.5, 9, 6), mat('#eeeeee'), 10, 17, -5, g);
      M(box(2.4, 2, 3.6), mat('#eeeeee'), 10.6, 22, -5, g);
      [-0.8, 0.8].forEach(z => M(sph(0.6, 8), mat('#111', { r: 0.05, m: 0.8 }), 11.9, 22.2, -5 + z, g));
      const dish = M(sph(4, 14), mat('#f5f5f5', { ds: true }), -12, 21, 4, g); dish.scale.set(1, 0.3, 1); dish.rotation.z = 0.7;
      M(box(10, 0.5, 18), mat('#1a237e', { m: 0.6, r: 0.2, e: '#0d1a5a', ei: 0.4 }), -2, 18, 0, g); // solar panel
      seat = { x: 1, y: 11 }; top = 22; back = -16;
      break;
    }
    case 'rocket': {
      four(3.8 * big, 4.6 * big, 11, -10, 8.5, 9);
      const f = M(cyl(5, 5, 22, 18), B, -1, 7.5, 0, g); f.rotation.z = Math.PI / 2;
      const n = M(cone(5, 10, 18), P2, 15, 7.5, 0, g); n.rotation.z = -Math.PI / 2;
      [[0, 1], [Math.PI / 2, 0], [-Math.PI / 2, 0]].forEach(([a]) => {
        const fin = M(box(7, 6, 0.8), P2, -10, 7.5 + Math.cos(a) * 6, Math.sin(a) * 6, g); fin.rotation.x = a;
      });
      const noz = M(cyl(3, 4.2, 3, 14), CHROME(), -13.5, 7.5, 0, g); noz.rotation.z = Math.PI / 2;
      seat = { x: 0, y: 8.5 }; top = 18; back = -16;
      break;
    }
    case 'tractor': {
      wheels.push(makeWheel(4.6 * big, 3.5, W, g, 10, -8, true), makeWheel(4.6 * big, 3.5, W, g, 10, 8, true));
      wheels.push(makeWheel(8.5 * big, 5, W === 'normal' ? 'knobbly' : W, g, -8, -10, false), makeWheel(8.5 * big, 5, W === 'normal' ? 'knobbly' : W, g, -8, 10, false));
      M(box(16, 7, 8), B, 7, 10, 0, g);                                        // bonnet
      M(box(2, 6, 7), mat('#cfd8dc', { m: 0.9 }), 15.2, 10, 0, g);            // grille
      M(box(10, 3, 12), DARK(), -7, 9, 0, g);
      [-1, 1].forEach(s => M(box(1, 14, 1), DARK(), -12 + (s + 1) * 4.5, 18, 5.5, g));
      [-1, 1].forEach(s => M(box(1, 14, 1), DARK(), -12 + (s + 1) * 4.5, 18, -5.5, g));
      M(box(12, 1, 13), P2, -7.5, 25.5, 0, g);                                 // roof
      M(cyl(0.8, 0.8, 9, 8), DARK(), 11, 17, 2.5, g);
      seat = { x: -7, y: 9 }; top = 27; back = -17;
      break;
    }
    case 'hover': {
      hover = true;
      const b = M(sph(10, 20), B, 0, 9, 0, g); b.scale.set(1.5, 0.45, 0.85);
      const c = M(sph(5.5, 16), mat('#9fe6ff', { r: 0.05, m: 0.4, t: 0.55 }), 0, 12, 0, g); c.scale.set(1.3, 0.7, 0.9);
      [[9, 8], [9, -8], [-9, 8], [-9, -8]].forEach(([x, z]) => {
        M(cyl(3, 3.4, 2, 14), DARK(), x, 5, z, g);
        const glow = M(cyl(2.6, 2.6, 0.6, 14), mat(FLAME_COLORS[look.flame][1], { e: FLAME_COLORS[look.flame][1], ei: 2.5 }), x, 3.8, z, g); glow.castShadow = false;
      });
      seat = { x: -1, y: 6.5 }; top = 18; back = -15;
      break;
    }
    case 'police': {
      four(4.4 * big, 4.4 * big, 10, -10, 8.5, 8.5);
      M(box(30, 6, 15), B, 0, 8, 0, g);
      M(box(14, 5.5, 14), mat('#ffffff'), -2, 13.5, 0, g);
      M(box(13.6, 4, 14.4), mat('#223', { r: 0.05, m: 0.8 }), -2, 14, 0, g);
      M(box(3, 1.4, 8), mat('#ff1744', { e: '#ff1744', ei: 1.2 }), -2, 17, -2.2, g);
      M(box(3, 1.4, 4), mat('#2979ff', { e: '#2979ff', ei: 1.2 }), -2, 17, 3, g);
      [-1, 1].forEach(s => M(sph(1, 8), mat('#fff9c4', { e: '#fff9c4', ei: 1.5 }), 15, 8.5, s * 5, g));
      seat = { x: -1, y: 7 }; top = 18; back = -16;
      break;
    }
    case 'bath': {
      four(3.6 * big, 3.6 * big, 10, -10, 8, 8);
      const tub = M(cap(7, 14), mat('#ffffff', { r: 0.15, m: 0.1 }), 0, 9, 0, g); tub.rotation.z = Math.PI / 2; tub.scale.set(1, 1, 1.05);
      const water = M(box(22, 0.4, 12), mat('#6fd0ff', { r: 0.05, t: 0.85 }), 0, 13.6, 0, g); water.castShadow = false;
      for (let k = 0; k < 7; k++) M(sph(1.6 + (k % 3) * 0.6, 8), mat('#ffffff', { r: 0.9 }), -8 + k * 2.8, 14, (k % 2 ? 3 : -3), g);
      M(sph(1.6, 10), mat('#ffeb3b'), 8, 15, 3, g);                                       // rubber duck
      M(cyl(0.6, 0.6, 7, 8), CHROME(), 12, 17, 0, g);                                     // tap
      M(box(2, 1.4, 12), B, 0, 15.6, 0, g).visible = false;
      [-1, 1].forEach(s => [-1, 1].forEach(t => M(sph(1.2, 8), mat('#ffd54f', { m: 1, r: 0.2 }), t * 9, 3.5, s * 6, g)));
      seat = { x: -2, y: 7 }; top = 18; back = -15;
      break;
    }
  }
  return { wheels, seat, top, back, hover, look };
}

function addSpoiler(look, g, back, top) {
  const s = look.spoiler;
  if (s === 'none' || look.body === 'bath') return;
  const P2 = paint(look.color2), D = DARK();
  const h = s === 'small' ? 3 : 7;
  const y = Math.max(8, top - 8) + h;
  const plates = s === 'twin' ? [0, 3] : [0];
  [-1, 1].forEach(z => M(box(1.4, h + 1, 0.8), D, back + 1.5, y - h / 2, z * 5, g));
  plates.forEach(o => M(box(4, 0.7, s === 'small' ? 14 : 20), P2, back + 1 - o * 0.6, y + o, 0, g));
}

function addTopper(look, g, top, seatX) {
  const t = look.topper; const x = seatX - 6;
  if (t === 'none') return null;
  const T = new THREE.Group(); T.position.set(x, top - 2, 0); g.add(T);
  if (t === 'flag') { M(cyl(0.25, 0.25, 14, 5), DARK(), 0, 7, -5, T); const f = M(box(5, 3.4, 0.2), paint(look.color2), 2.6, 12.4, -5, T); f.userData.wave = true; }
  if (t === 'siren') { M(cyl(1.6, 1.6, 2.4, 12), mat('#ff1744', { e: '#ff1744', ei: 1.6, t: 0.9 }), 0, 1.2, 0, T).userData.flash = true; }
  if (t === 'dish') { M(cyl(0.4, 0.4, 4, 6), DARK(), 0, 2, 0, T); const d = M(sph(3, 12), mat('#eeeeee', { ds: true }), 0, 4.5, 0, T); d.scale.set(1, 0.3, 1); d.rotation.z = 0.6; d.userData.spin = 1.5; }
  if (t === 'fin') { const f = M(cone(3.5, 8, 3), paint(look.color), -1, 3, 0, T); f.scale.set(1.4, 1, 0.25); }
  if (t === 'horns') [-1, 1].forEach(s => { const h = M(cone(0.9, 5, 8), mat('#fff8e1'), 6, 6, s * 4, T); h.rotation.x = s * 0.9; });
  if (t === 'crown') { T.position.x = seatX + 0.3; T.position.y = 0; return 'crown'; }
  if (t === 'propeller') { T.position.x = seatX + 0.3; T.position.y = 0; return 'propeller'; }
  return T;
}

function addHeadTopper(look, head) {
  if (look.topper === 'crown') {
    const c = M(cyl(2.4, 2.1, 2, 10, true), mat('#ffd54f', { m: 1, r: 0.25 }), 0, 3.6, 0, head);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; M(cone(0.6, 1.6, 4), mat('#ffd54f', { m: 1, r: 0.25 }), Math.cos(a) * 2.2, 5.2, Math.sin(a) * 2.2, head); }
    return c;
  }
  if (look.topper === 'propeller') {
    const cap2 = M(sph(3.3, 14), paint(look.color2), 0, 0.4, 0, head); cap2.scale.set(1, 0.6, 1);
    const p = new THREE.Group(); p.position.y = 3.6; head.add(p);
    [0, Math.PI / 2].forEach(a => { const b = M(box(8, 0.3, 1), mat('#ffeb3b'), 0, 0, 0, p); b.rotation.y = a; });
    p.userData.spin = 18;
    return p;
  }
  return null;
}

// Flames out the back (boost) + shield bubble + star glow.
function addEffects(look, g, back, seatY) {
  const [c1, c2] = FLAME_COLORS[look.flame];
  const flame = new THREE.Group(); flame.position.set(back - 1, Math.max(5, seatY + 2), 0); g.add(flame);
  const outer = new THREE.Mesh(cone(2.6, 12, 12), new THREE.MeshBasicMaterial({ color: c2, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
  outer.rotation.z = Math.PI / 2; outer.position.x = -6; flame.add(outer);
  const inner = new THREE.Mesh(cone(1.3, 7, 10), new THREE.MeshBasicMaterial({ color: c1, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  inner.rotation.z = Math.PI / 2; inner.position.x = -3.5; flame.add(inner);
  flame.visible = false;
  const shield = new THREE.Mesh(sph(20, 24), new THREE.MeshStandardMaterial({ color: '#64d8ff', emissive: '#2aa8ff', emissiveIntensity: 0.6, transparent: true, opacity: 0.28, depthWrite: false, roughness: 0.1 }));
  shield.position.y = 9; shield.visible = false; g.add(shield);
  return { flame, outer, inner, shield, rainbow: look.flame === 'rainbow' };
}

// Make a kart. Returns { root, update(dt, state) }.
export function buildKart(lookIn) {
  const root = new THREE.Group();   // position + heading
  const tilt = new THREE.Group();   // bounce, lean, flips
  root.add(tilt);
  const g = new THREE.Group();
  tilt.add(g);
  const b = buildBody(lookIn, g);
  const look = b.look;
  const drv = makeDriver(look, g, b.seat.x, b.seat.y);
  addSpoiler(look, g, b.back, b.top);
  const topper = addTopper(look, g, b.top, b.seat.x);
  const headTop = addHeadTopper(look, drv.head);
  const fx = addEffects(look, g, b.back, b.seat.y);
  const shadow = new THREE.Mesh(geo('shadow', () => new THREE.CircleGeometry(1, 20)), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.scale.set(17, 11, 1); shadow.renderOrder = 1;
  root.add(shadow);
  root.userData.shadow = shadow;
  let t = 0, roll = 0, starWas = false;
  const spinners = [];
  g.traverse(o => { if (o.userData.spin) spinners.push(o); });
  if (headTop && headTop.userData.spin) spinners.push(headTop);
  const flashers = []; g.traverse(o => { if (o.userData.flash) flashers.push(o); });

  function update(dt, s) {
    t += dt;
    const sp = s.speed || 0;
    roll += (s.vF ?? sp) * dt;
    for (const w of b.wheels) {
      w.spin.rotation.z = -roll / w.r;
      if (w.front) w.pivot.rotation.y = -(s.steer || 0) * 0.45;
    }
    // bounce + lean into turns
    const bob = b.hover ? Math.sin(t * 4) * 1.2 + 2 : Math.sin(t * 30) * Math.min(0.25, sp * 0.0008);
    g.position.y = bob;
    tilt.rotation.x = -(s.steer || 0) * Math.min(0.12, sp * 0.0004) * (s.drift ? 2 : 1);
    drv.head.rotation.y = -(s.steer || 0) * 0.35;
    drv.head.rotation.z = Math.sin(t * 2) * 0.03;
    for (const o of spinners) o.rotation.y += o.userData.spin * dt;
    for (const o of flashers) o.visible = Math.floor(t * 6) % 2 === 0;
    const boosting = s.boost > 0;
    fx.flame.visible = boosting;
    if (boosting) {
      const k = 0.8 + Math.random() * 0.5;
      fx.flame.scale.set(k, 0.9 + Math.random() * 0.2, 0.9 + Math.random() * 0.2);
      if (fx.rainbow) fx.outer.material.color.setHSL((t * 2) % 1, 1, 0.55);
    }
    fx.shield.visible = s.shield > 0;
    if (s.shield > 0) fx.shield.rotation.y += dt * 2;
    // star = rainbow flashing kart
    const star = s.star > 0;
    if (star || starWas) g.traverse(o => {
      if (!o.isMesh || !o.material || o.material.isMeshBasicMaterial) return;
      if (star) {
        if (!o.userData.orig) { o.userData.orig = o.material; o.material = o.material.clone(); }
        o.material.emissive.setHSL((t * 3 + o.id * 0.07) % 1, 1, 0.45);
      } else if (o.userData.orig) { o.material.dispose(); o.material = o.userData.orig; o.userData.orig = null; }
    });
    starWas = star;
    const sc = s.small > 0 ? 0.55 : 1;
    g.scale.setScalar(sc);
  }
  return { root, tilt, body: g, update, look };
}
