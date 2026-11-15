// Choo Choo Wilf: 3D building blocks and moving models (train, ducks, cars...).
// Static things are merged into one mesh with vertex colours (fast on iPads).
import * as THREE from '../../js/vendor/three.module.min.js';

export { THREE };
export const V3 = THREE.Vector3;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- unit shapes
const G = {};
function roofGeo() {
  // triangular prism: base 1 wide (x) at y=0, ridge at y=1, length 1 (z)
  const A = [-0.5, 0], B = [0.5, 0], C = [0, 1];
  const p = [];
  const v = (q, z) => p.push(q[0], q[1], z);
  // ends
  v(A, 0.5); v(B, 0.5); v(C, 0.5);
  v(B, -0.5); v(A, -0.5); v(C, -0.5);
  // slopes
  v(B, 0.5); v(B, -0.5); v(C, -0.5); v(B, 0.5); v(C, -0.5); v(C, 0.5);
  v(A, -0.5); v(A, 0.5); v(C, 0.5); v(A, -0.5); v(C, 0.5); v(C, -0.5);
  // bottom
  v(A, 0.5); v(A, -0.5); v(B, -0.5); v(A, 0.5); v(B, -0.5); v(B, 0.5);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return g;
}
function geo(name) {
  if (G[name]) return G[name];
  let g;
  switch (name) {
    case 'box': g = new THREE.BoxGeometry(1, 1, 1); break;
    case 'cyl': g = new THREE.CylinderGeometry(0.5, 0.5, 1, 10); break;
    case 'cyl6': g = new THREE.CylinderGeometry(0.5, 0.5, 1, 6); break;
    case 'cyl16': g = new THREE.CylinderGeometry(0.5, 0.5, 1, 16); break;
    case 'cone': g = new THREE.ConeGeometry(0.5, 1, 10); break;
    case 'cone6': g = new THREE.ConeGeometry(0.5, 1, 7); break;
    case 'ball': g = new THREE.IcosahedronGeometry(0.5, 1); break;
    case 'ball0': g = new THREE.IcosahedronGeometry(0.5, 0); break;
    case 'dodec': g = new THREE.DodecahedronGeometry(0.5, 0); break;
    case 'roof': g = roofGeo(); break;
    default: throw new Error('no shape ' + name);
  }
  if (g.index) g = g.toNonIndexed();
  G[name] = g;
  return g;
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new V3(), _s = new V3(), _c = new THREE.Color();
const _a = new V3(), _b = new V3(), _n = new V3();

export class Builder {
  constructor(ox = 0, oz = 0) {
    this.p = []; this.c = [];
    this.ox = ox; this.oz = oz;
    this.base = new THREE.Matrix4().makeTranslation(-ox, 0, -oz);
  }
  setBase(x, y, z, ry = 0, s = 1) {
    this.base.compose(_v.set(x - this.ox, y, z - this.oz), _q.setFromEuler(_e.set(0, ry, 0)), _s.set(s, s, s));
    return this;
  }
  part(name, color, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) {
    _m.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz)).premultiply(this.base);
    const pos = geo(name).attributes.position;
    _c.set(color);
    for (let i = 0; i < pos.count; i++) {
      _v.fromBufferAttribute(pos, i).applyMatrix4(_m);
      this.p.push(_v.x, _v.y, _v.z);
      this.c.push(_c.r, _c.g, _c.b);
    }
  }
  // raw triangles in world space (origin is subtracted here)
  tri(a, b, c, color) {
    _c.set(color);
    for (const q of [a, b, c]) {
      this.p.push(q[0] - this.ox, q[1], q[2] - this.oz);
      this.c.push(_c.r, _c.g, _c.b);
    }
  }
  quad(a, b, c, d, color, hint) {
    if (hint) {
      _a.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      _b.set(c[0] - a[0], c[1] - a[1], c[2] - a[2]);
      _n.crossVectors(_a, _b);
      if (_n.x * hint[0] + _n.y * hint[1] + _n.z * hint[2] < 0) { this.tri(a, c, b, color); this.tri(a, d, c, color); return; }
    }
    this.tri(a, b, c, color); this.tri(a, c, d, color);
  }
  mesh(material) {
    if (!this.p.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.computeVertexNormals();
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.position.set(this.ox, 0, this.oz);
    return m;
  }
}

export const MAT = {
  flat: new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }),
  decal: new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }),
  glow: new THREE.MeshBasicMaterial({ color: '#5d7184' }),
};

export function bmesh(fn, mat = MAT.flat) {
  const b = new Builder();
  fn(b);
  const m = b.mesh(mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------- textures
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
let puffTex = null;
export function puffTexture() {
  if (puffTex) return puffTex;
  puffTex = canvasTex(64, 64, g => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  });
  return puffTex;
}
const emojiMats = new Map();
export function emojiMaterial(e) {
  if (emojiMats.has(e)) return emojiMats.get(e);
  const t = canvasTex(128, 128, g => {
    g.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(e, 64, 72);
  });
  const m = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false });
  emojiMats.set(e, m);
  return m;
}
export function emojiSprite(e, size = 1) {
  const s = new THREE.Sprite(emojiMaterial(e));
  s.scale.set(size, size, 1);
  return s;
}
export function signTexture(text) {
  return canvasTex(512, 128, (g, w, h) => {
    g.fillStyle = '#1e5aa8'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#fff'; g.font = 'bold 54px "Fredoka", system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, w / 2, h / 2 + 3, w - 40);
  });
}

// ---------------------------------------------------------------- the train
const RED = '#d32f2f', DARK = '#263238', GOLD = '#ffca28', BLACK = '#1d1d1d';
const HALF = Math.PI / 2;

function wheel(r, tyre = BLACK, hub = RED) {
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('cyl16', tyre, 0, 0, 0, r * 2, 0.14, r * 2, 0, 0, HALF);
    b.part('cyl16', hub, 0, 0, 0, r * 1.6, 0.16, r * 1.6, 0, 0, HALF);
    b.part('box', '#ffe082', 0, 0, 0, 0.18, r * 1.5, 0.08);
    b.part('box', '#ffe082', 0, 0, 0, 0.18, 0.08, r * 1.5);
  }));
  return g;
}

export function makeLoco() {
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('box', DARK, 0, 0.6, 0.1, 1.36, 0.22, 4.3);
    b.part('cyl16', RED, 0, 1.2, 0.55, 1.12, 2.5, 1.12, HALF);
    for (const z of [-0.15, 0.6, 1.35]) b.part('cyl16', GOLD, 0, 1.2, z, 1.16, 0.07, 1.16, HALF);
    b.part('cyl16', '#37474f', 0, 1.2, 1.95, 1.16, 0.32, 1.16, HALF);
    b.part('cyl16', DARK, 0, 1.2, 2.12, 0.8, 0.04, 0.8, HALF);
    b.part('cyl16', BLACK, 0, 2.0, 1.7, 0.36, 0.75, 0.36);
    b.part('cyl16', BLACK, 0, 2.38, 1.7, 0.5, 0.12, 0.5);
    b.part('ball', GOLD, 0, 1.75, 0.55, 0.5, 0.42, 0.5);
    b.part('cyl', GOLD, 0, 1.92, -0.35, 0.13, 0.36, 0.13);
    // cab
    b.part('box', RED, 0, 1.45, -1.35, 1.5, 1.5, 1.3);
    b.part('box', BLACK, 0, 2.25, -1.4, 1.72, 0.12, 1.6);
    for (const s of [-1, 1]) {
      b.part('box', '#90caf9', s * 0.76, 1.78, -1.25, 0.03, 0.46, 0.62);
      b.part('box', '#90caf9', s * 0.4, 1.85, -0.69, 0.36, 0.32, 0.03);
      b.part('box', GOLD, s * 0.76, 1.08, -1.35, 0.03, 0.1, 1.2);
      b.part('cyl16', '#455a64', s * 0.55, 0.75, 1.75, 0.38, 0.6, 0.38, HALF); // cylinders
    }
    // front
    b.part('box', RED, 0, 0.62, 2.22, 1.5, 0.3, 0.14);
    for (const s of [-1, 1]) b.part('cyl', BLACK, s * 0.5, 0.62, 2.36, 0.2, 0.16, 0.2, HALF);
    b.part('box', '#455a64', 0, 0.36, 2.32, 1.2, 0.3, 0.4, -0.5);
    b.part('box', DARK, 0, 0.55, -2.15, 0.4, 0.2, 0.3);
  }));
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 14), new THREE.MeshBasicMaterial({ color: '#fff6c8' }));
  lamp.rotation.x = HALF; lamp.position.set(0, 1.9, 2.05);
  g.add(lamp);
  const wheels = [], rods = [];
  for (const z of [0.95, 0, -0.95]) for (const s of [-1, 1]) {
    const w = wheel(0.42); w.position.set(s * 0.72, 0.42, z); g.add(w); wheels.push({ o: w, r: 0.42 });
  }
  for (const s of [-1, 1]) {
    const w = wheel(0.25, BLACK, DARK); w.position.set(s * 0.6, 0.25, 1.85); g.add(w); wheels.push({ o: w, r: 0.25 });
    const rod = bmesh(b => b.part('box', '#b0bec5', 0, 0, 0, 0.06, 0.1, 2.05));
    rod.position.set(s * 0.82, 0.42, 0); g.add(rod); rods.push(rod);
  }
  return { group: g, wheels, rods, lamp, chimney: new V3(0, 2.5, 1.7), whistle: new V3(0, 2.15, -0.35), len: 4.6 };
}

export function makeTender() {
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('box', DARK, 0, 0.55, 0, 1.3, 0.2, 2.2);
    b.part('box', RED, 0, 1.1, 0, 1.4, 0.95, 2.1);
    b.part('box', GOLD, 0, 1.0, 0, 1.43, 0.08, 1.9);
    for (let i = 0; i < 7; i++) b.part('ball0', '#222', (i % 3 - 1) * 0.35, 1.6, -0.7 + i * 0.24, 0.55, 0.3, 0.5);
  }));
  const wheels = [];
  for (const z of [0.62, -0.62]) for (const s of [-1, 1]) {
    const w = wheel(0.3); w.position.set(s * 0.66, 0.3, z); g.add(w); wheels.push({ o: w, r: 0.3 });
  }
  return { group: g, wheels, len: 2.3 };
}

export function makeCarriage(color, trim) {
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('box', DARK, 0, 0.55, 0, 1.3, 0.2, 3.5);
    b.part('box', '#a1887f', 0, 0.7, 0, 1.36, 0.1, 3.46);
    for (const s of [-1, 1]) {
      b.part('box', color, s * 0.66, 1.0, 0, 0.1, 0.56, 3.5);
      b.part('box', trim, s * 0.66, 1.3, 0, 0.14, 0.07, 3.54);
      b.part('box', color, 0, 1.0, s * 1.72, 1.42, 0.56, 0.1);
      b.part('box', trim, 0, 1.3, s * 1.72, 1.46, 0.07, 0.14);
    }
    for (const z of [0.62, -0.98]) {
      b.part('box', '#8d6e63', 0, 0.9, z, 1.2, 0.18, 0.5);
      b.part('box', '#6d4c41', 0, 1.15, z - 0.28, 1.2, 0.5, 0.1);
    }
  }));
  const wheels = [];
  for (const z of [1.15, -1.15]) for (const s of [-1, 1]) {
    const w = wheel(0.3); w.position.set(s * 0.66, 0.3, z); g.add(w); wheels.push({ o: w, r: 0.3 });
  }
  const seats = [];
  for (const z of [0.72, -0.88]) for (const s of [-1, 1]) seats.push(new V3(s * 0.32, 1.45, z));
  return { group: g, wheels, seats, len: 3.6 };
}

// ---------------------------------------------------------------- animals and vehicles
export function makeDuck(mum) {
  const g = new THREE.Group();
  const body = mum ? '#ffffff' : '#ffd740';
  g.add(bmesh(b => {
    b.part('ball', body, 0, 0.38, 0, 0.6, 0.48, 0.8);
    b.part('ball', mum ? '#eeeeee' : '#ffca28', 0, 0.45, -0.05, 0.66, 0.3, 0.6);
    b.part('ball', body, 0, 0.82, 0.3, 0.42, 0.42, 0.42);
    b.part('box', '#ff8f00', 0, 0.78, 0.56, 0.2, 0.08, 0.22);
    for (const s of [-1, 1]) {
      b.part('ball0', '#111', s * 0.15, 0.9, 0.46, 0.08, 0.08, 0.08);
      b.part('box', '#ff8f00', s * 0.14, 0.04, 0.1, 0.16, 0.06, 0.26);
    }
    b.part('cone6', body, 0, 0.52, -0.42, 0.22, 0.3, 0.22, -2.0);
  }));
  return g;
}

const CAR_COLS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa', '#fb8c00', '#00acc1'];
export function makeCar(r, kind) {
  const g = new THREE.Group();
  const col = CAR_COLS[(r() * CAR_COLS.length) | 0];
  const wheels = [];
  if (kind === 'bus') {
    g.add(bmesh(b => {
      b.part('box', '#fbc02d', 0, 1.2, 0, 1.9, 1.7, 5.6);
      b.part('box', '#b3e5fc', 0, 1.55, 0.2, 1.94, 0.6, 4.6);
      b.part('box', '#b3e5fc', 0, 1.5, 2.81, 1.6, 0.8, 0.04);
      b.part('box', '#f9a825', 0, 2.08, 0, 1.7, 0.08, 5.2);
      for (const s of [-1, 1]) b.part('box', '#fffde7', s * 0.65, 0.7, 2.81, 0.3, 0.2, 0.04);
    }));
    for (const z of [1.8, -1.8]) for (const s of [-1, 1]) { const w = wheel(0.42, BLACK, '#9e9e9e'); w.position.set(s * 0.9, 0.42, z); g.add(w); wheels.push(w); }
    return { group: g, wheels, len: 5.6 };
  }
  const van = kind === 'van';
  g.add(bmesh(b => {
    b.part('box', col, 0, 0.6, 0, 1.6, 0.62, 3.1);
    if (van) b.part('box', col, 0, 1.2, -0.3, 1.58, 0.9, 2.3);
    else {
      b.part('box', '#cfe8ff', 0, 1.15, -0.15, 1.36, 0.52, 1.6);
      b.part('box', col, 0, 1.44, -0.15, 1.4, 0.08, 1.5);
    }
    if (van) b.part('box', '#cfe8ff', 0, 1.35, 0.86, 1.4, 0.45, 0.06);
    for (const s of [-1, 1]) {
      b.part('box', '#fffde7', s * 0.55, 0.65, 1.56, 0.3, 0.16, 0.04);
      b.part('box', '#ff1744', s * 0.6, 0.65, -1.56, 0.25, 0.14, 0.04);
    }
  }));
  for (const z of [1.0, -1.0]) for (const s of [-1, 1]) { const w = wheel(0.32, BLACK, '#bdbdbd'); w.position.set(s * 0.78, 0.32, z); g.add(w); wheels.push(w); }
  return { group: g, wheels, len: 3.1 };
}

export function makeDigger() {
  const g = new THREE.Group();
  const Y = '#fbc02d';
  g.add(bmesh(b => {
    for (const s of [-1, 1]) {
      b.part('box', '#37474f', s * 0.85, 0.32, 0, 0.55, 0.64, 2.7);
      for (let i = 0; i < 4; i++) b.part('cyl', '#607d8b', s * 0.85, 0.32, -0.9 + i * 0.6, 0.5, 0.58, 0.5, 0, 0, HALF);
    }
    b.part('box', Y, 0, 0.95, -0.1, 1.9, 0.62, 2.2);
    b.part('box', Y, -0.35, 1.8, -0.35, 1.1, 1.1, 1.15);
    b.part('box', '#b3e5fc', -0.35, 1.9, 0.24, 0.9, 0.6, 0.04);
    b.part('box', '#b3e5fc', -0.91, 1.9, -0.35, 0.04, 0.6, 0.8);
    b.part('box', '#b3e5fc', 0.21, 1.9, -0.35, 0.04, 0.6, 0.8);
    b.part('box', '#424242', -0.35, 2.38, -0.35, 1.2, 0.08, 1.25);
    b.part('cyl', '#424242', 0.6, 1.6, -0.9, 0.14, 0.9, 0.14);
    b.part('box', '#f57f17', 0, 0.95, -1.25, 1.9, 0.5, 0.2);
    b.part('ball0', '#ff6d00', -0.35, 2.5, -0.35, 0.22, 0.2, 0.22);
  }));
  const boom = new THREE.Group();
  boom.position.set(0.4, 1.25, 0.9);
  boom.add(bmesh(b => b.part('box', Y, 0, 0, 1.1, 0.32, 0.32, 2.3)));
  const stick = new THREE.Group();
  stick.position.set(0, 0, 2.2);
  stick.add(bmesh(b => {
    b.part('box', Y, 0, -0.7, 0, 0.26, 1.5, 0.26);
    b.part('box', '#f9a825', 0, -1.45, 0.2, 0.85, 0.45, 0.6);
    for (let i = -1; i <= 1; i++) b.part('box', '#9e9e9e', i * 0.25, -1.7, 0.45, 0.1, 0.12, 0.2);
  }));
  boom.add(stick);
  g.add(boom);
  return { group: g, boom, stick };
}

export function makeBarrier() {
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('box', '#eceff1', -2.4, 0.65, 0, 0.35, 1.3, 0.35);
    b.part('box', '#ffc107', -2.4, 0.1, 0, 0.7, 0.2, 0.7);
    b.part('box', '#c62828', -2.4, 1.35, 0, 0.45, 0.2, 0.45);
  }));
  const pivot = new THREE.Group();
  pivot.position.set(-2.4, 1.15, 0.3);
  pivot.add(bmesh(b => {
    for (let i = 0; i < 8; i++) b.part('box', i % 2 ? '#ffffff' : '#e53935', 0.3 + i * 0.6, 0, 0, 0.6, 0.2, 0.14);
    b.part('box', '#424242', -0.5, 0, 0, 0.7, 0.32, 0.22);
  }));
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff1744' }));
  light.position.set(4.6, 0.18, 0);
  pivot.add(light);
  g.add(pivot);
  return { group: g, pivot, light };
}

export function makeAnimal(kind) {
  const g = new THREE.Group();
  const legs = [];
  if (kind === 'cow') {
    g.add(bmesh(b => {
      b.part('box', '#fafafa', 0, 1.05, 0, 0.95, 0.8, 1.7);
      b.part('box', '#212121', 0.3, 1.25, 0.3, 0.4, 0.45, 0.6);
      b.part('box', '#212121', -0.36, 0.95, -0.4, 0.3, 0.5, 0.5);
      b.part('box', '#fafafa', 0, 1.35, 1.05, 0.62, 0.6, 0.65);
      b.part('box', '#f8bbd0', 0, 1.2, 1.4, 0.55, 0.3, 0.12);
      for (const s of [-1, 1]) {
        b.part('cone6', '#fff8e1', s * 0.25, 1.75, 1.0, 0.1, 0.3, 0.1);
        b.part('box', '#212121', s * 0.38, 1.5, 0.9, 0.2, 0.12, 0.1);
        b.part('ball0', '#111', s * 0.2, 1.5, 1.38, 0.1, 0.1, 0.1);
      }
      b.part('ball0', '#f48fb1', 0, 0.62, -0.3, 0.35, 0.2, 0.35);
      b.part('box', '#424242', 0, 1.0, -0.95, 0.08, 0.7, 0.08, 0.3);
    }));
    for (const [x, z] of [[-0.32, 0.6], [0.32, 0.6], [-0.32, -0.6], [0.32, -0.6]]) {
      const l = bmesh(b => b.part('box', '#424242', 0, -0.35, 0, 0.2, 0.7, 0.2)); l.position.set(x, 0.7, z); g.add(l); legs.push(l);
    }
  } else if (kind === 'sheep') {
    g.add(bmesh(b => {
      b.part('ball', '#fafafa', 0, 1.0, 0, 1.2, 0.95, 1.5);
      for (const [x, y, z] of [[0.35, 1.35, 0.3], [-0.3, 1.35, -0.3], [0, 1.4, 0], [0.4, 1.0, -0.5], [-0.4, 1.0, 0.45]]) b.part('ball0', '#ffffff', x, y, z, 0.6, 0.55, 0.6);
      b.part('box', '#263238', 0, 1.2, 0.85, 0.45, 0.5, 0.55);
      for (const s of [-1, 1]) {
        b.part('box', '#263238', s * 0.32, 1.3, 0.8, 0.3, 0.1, 0.15);
        b.part('ball0', '#fff', s * 0.13, 1.32, 1.12, 0.1, 0.1, 0.06);
      }
    }));
    for (const [x, z] of [[-0.3, 0.45], [0.3, 0.45], [-0.3, -0.45], [0.3, -0.45]]) {
      const l = bmesh(b => b.part('box', '#263238', 0, -0.3, 0, 0.16, 0.6, 0.16)); l.position.set(x, 0.6, z); g.add(l); legs.push(l);
    }
  } else if (kind === 'penguin') {
    g.add(bmesh(b => {
      b.part('ball', '#263238', 0, 0.75, 0, 0.85, 1.3, 0.75);
      b.part('ball', '#ffffff', 0, 0.7, 0.18, 0.62, 1.0, 0.45);
      b.part('cone6', '#ff9800', 0, 1.15, 0.45, 0.16, 0.3, 0.16, HALF);
      for (const s of [-1, 1]) {
        b.part('ball0', '#fff', s * 0.14, 1.25, 0.3, 0.14, 0.14, 0.08);
        b.part('ball0', '#111', s * 0.14, 1.25, 0.34, 0.07, 0.07, 0.05);
        b.part('box', '#263238', s * 0.45, 0.75, 0, 0.1, 0.65, 0.35, 0, 0, s * 0.3);
      }
    }));
    for (const s of [-1, 1]) {
      const l = bmesh(b => b.part('box', '#ff9800', 0, 0.04, 0.12, 0.25, 0.08, 0.35)); l.position.set(s * 0.2, 0, 0); g.add(l); legs.push(l);
    }
  } else { // crab
    g.add(bmesh(b => {
      b.part('ball', '#e53935', 0, 0.35, 0, 1.1, 0.45, 0.8);
      for (const s of [-1, 1]) {
        b.part('ball0', '#e53935', s * 0.85, 0.45, 0.35, 0.42, 0.32, 0.36);
        b.part('box', '#e53935', s * 0.6, 0.4, 0.2, 0.4, 0.1, 0.1, 0, s * 0.6);
        b.part('cyl6', '#e53935', s * 0.18, 0.65, 0.25, 0.06, 0.3, 0.06);
        b.part('ball0', '#fff', s * 0.18, 0.84, 0.25, 0.16, 0.16, 0.16);
        b.part('ball0', '#111', s * 0.18, 0.86, 0.32, 0.08, 0.08, 0.06);
      }
    }));
    for (const s of [-1, 1]) for (const z of [-0.25, 0, 0.2]) {
      const l = bmesh(b => b.part('box', '#c62828', s * 0.3, 0, 0, 0.6, 0.08, 0.08, 0, 0, s * -0.5)); l.position.set(s * 0.45, 0.25, z); g.add(l); legs.push(l);
    }
  }
  return { group: g, legs };
}

const BIRDS = [
  { body: '#1e88e5', breast: '#bbdefb', wing: '#1565c0' },
  { body: '#6d4c41', breast: '#ff7043', wing: '#5d4037' },
  { body: '#fdd835', breast: '#fff59d', wing: '#f9a825' },
  { body: '#e53935', breast: '#ffcdd2', wing: '#b71c1c' },
];
export function makeBird(r, gull) {
  const c = gull ? { body: '#fafafa', breast: '#ffffff', wing: '#b0bec5' } : BIRDS[(r() * BIRDS.length) | 0];
  const g = new THREE.Group();
  g.add(bmesh(b => {
    b.part('ball', c.body, 0, 0, 0, 0.5, 0.48, 0.85);
    b.part('ball', c.breast, 0, -0.08, 0.15, 0.42, 0.36, 0.55);
    b.part('ball', c.body, 0, 0.14, 0.45, 0.42, 0.4, 0.42);
    b.part('cone6', '#ffa000', 0, 0.12, 0.72, 0.13, 0.26, 0.13, HALF);
    b.part('box', c.wing, 0, 0.05, -0.55, 0.36, 0.06, 0.45, 0.2);
    for (const s of [-1, 1]) b.part('ball0', '#111', s * 0.16, 0.22, 0.6, 0.08, 0.08, 0.08);
  }));
  const wings = [];
  for (const s of [-1, 1]) {
    const w = new THREE.Group();
    w.position.set(s * 0.2, 0.08, 0);
    w.add(bmesh(b => b.part('box', c.wing, s * 0.5, 0, 0, 1.0, 0.06, 0.5)));
    g.add(w); wings.push(w);
  }
  return { group: g, wings };
}
