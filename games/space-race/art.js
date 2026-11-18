// Star Dash: shared 3D bits (textures, sky, ships, trails, rocks).
// Nothing here knows about the race rules.
import * as THREE from '../../js/vendor/three.module.min.js';

export { THREE };
export const V3 = THREE.Vector3;
export const UP = new V3(0, 1, 0);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const wrapAng = a => { a = (a + Math.PI) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return a - Math.PI; };

// Seeded random, so every device builds the same track from the same seed.
export function rng(seed) {
  let a = seed >>> 0;
  const r = () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + r() * (hi - lo);
  r.dir = () => { const z = r() * 2 - 1, t = r() * Math.PI * 2, s = Math.sqrt(1 - z * z); return new V3(s * Math.cos(t), z, s * Math.sin(t)); };
  return r;
}

// ---------------------------------------------------------------- textures (made once)
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let TEX = null;
export function textures() {
  if (TEX) return TEX;
  const r = rng(99);
  const glow = canvasTex(128, 128, g => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,.85)');
    gr.addColorStop(0.45, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  });
  const nebula = canvasTex(2048, 1024, (g, w, h) => {
    g.fillStyle = '#03020b'; g.fillRect(0, 0, w, h);
    const cols = ['110,50,210', '40,80,230', '230,60,170', '30,170,210', '255,120,80'];
    for (let i = 0; i < 110; i++) {
      const x = r() * w, y = h * 0.5 + (r() - 0.5) * h * 0.55 * r() * 1.6;
      const rad = 60 + r() * 260, c = cols[(r() * cols.length) | 0], a = 0.04 + r() * 0.09;
      for (const dx of [-w, 0, w]) {
        const gr = g.createRadialGradient(x + dx, y, 0, x + dx, y, rad);
        gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`);
        g.fillStyle = gr; g.fillRect(x + dx - rad, y - rad, rad * 2, rad * 2);
      }
    }
    for (let i = 0; i < 4000; i++) {
      const y = h * 0.5 + (r() - 0.5) * h * (r() < 0.6 ? 0.35 : 1);
      g.fillStyle = `rgba(255,255,255,${r() * 0.7})`;
      const s = r() < 0.97 ? 1 : 2;
      g.fillRect(r() * w, y, s, s);
    }
  });
  const planet = canvasTex(512, 256, (g, w, h) => {
    const img = g.createImageData(w, h);
    const pal = [[232, 168, 107], [201, 116, 74], [243, 210, 162], [168, 91, 60], [240, 192, 136], [120, 70, 60]];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h;
      const n = Math.sin(v * 38 + Math.sin(u * Math.PI * 6) * 0.7 + Math.sin(v * 9 + u * 20) * 0.35) * 0.5 + 0.5;
      const k = n * (pal.length - 1), i0 = Math.floor(k), f = k - i0, a = pal[i0], b = pal[Math.min(i0 + 1, pal.length - 1)];
      const spot = Math.exp(-(((u - 0.3) * 5) ** 2 + ((v - 0.62) * 14) ** 2));
      const o = (y * w + x) * 4;
      img.data[o] = a[0] + (b[0] - a[0]) * f + spot * 30;
      img.data[o + 1] = a[1] + (b[1] - a[1]) * f - spot * 30;
      img.data[o + 2] = a[2] + (b[2] - a[2]) * f - spot * 30;
      img.data[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  const ring = canvasTex(512, 4, (g, w) => {
    for (let x = 0; x < w; x++) {
      const a = (0.25 + 0.55 * (Math.sin(x * 0.21) * 0.5 + 0.5) * (Math.sin(x * 0.047 + 1) * 0.5 + 0.5)) * (x < 30 || (x > 300 && x < 318) ? 0.1 : 1);
      g.fillStyle = `rgba(230,200,160,${a})`; g.fillRect(x, 0, 1, 4);
    }
  });
  const moon = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#8d8fa8'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      const x = r() * w, y = r() * h, rad = 2 + r() * 10;
      g.fillStyle = `rgba(60,60,80,${0.2 + r() * 0.3})`; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
      g.fillStyle = 'rgba(220,220,240,.15)'; g.beginPath(); g.arc(x - rad * 0.25, y - rad * 0.25, rad * 0.7, 0, 7); g.fill();
    }
  });
  const chevron = canvasTex(128, 128, g => {
    g.strokeStyle = '#fff'; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(20, 90); g.lineTo(64, 40); g.lineTo(108, 90); g.stroke();
  });
  chevron.wrapS = chevron.wrapT = THREE.RepeatWrapping;
  chevron.repeat.set(1, 2);
  const checker = canvasTex(256, 16, g => {
    for (let x = 0; x < 32; x++) for (let y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * 8, y * 8, 8, 8); }
  });
  checker.wrapS = THREE.RepeatWrapping; checker.repeat.set(3, 1);
  TEX = { glow, nebula, planet, ring, moon, chevron, checker };
  return TEX;
}

export function textTex(text, color) {
  return canvasTex(512, 128, (g, w, h) => {
    g.font = '700 84px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = color; g.shadowBlur = 24; g.fillStyle = '#fff'; g.fillText(text, w / 2, h / 2 + 4);
  });
}

const glowMats = {};
export function glowMat(color, opacity = 1) {
  const k = color + '_' + opacity;
  return glowMats[k] || (glowMats[k] = new THREE.SpriteMaterial({ map: textures().glow, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
}

// ---------------------------------------------------------------- sky: nebula, stars, sun, ringed planet, moon
export function addSky(scene, dpr) {
  const T = textures(), r = rng(5);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(9000, 48, 24), new THREE.MeshBasicMaterial({ map: T.nebula, side: THREE.BackSide, depthWrite: false }));
  sky.rotation.z = 0.35; scene.add(sky);
  const n = 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const v = r.dir().multiplyScalar(r.range(6000, 8000));
    pos.set([v.x, v.y, v.z], i * 3);
    c.setHSL([0.6, 0.12, 0.08, 0][(r() * 4) | 0], 0.6, r.range(0.6, 1)); col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 4 * dpr, sizeAttenuation: false, map: T.glow, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  const sunDir = new V3(-0.6, 0.35, -0.7).normalize();
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glow, color: 0xfff1c4, blending: THREE.AdditiveBlending, depthWrite: false }));
  sun.position.copy(sunDir).multiplyScalar(6500); sun.scale.setScalar(1500); scene.add(sun);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glow, color: 0xffa860, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 }));
  halo.position.copy(sun.position); halo.scale.setScalar(5000); scene.add(halo);
  const dl = new THREE.DirectionalLight(0xfff0dd, 2.6); dl.position.copy(sunDir).multiplyScalar(100); scene.add(dl);
  scene.add(new THREE.HemisphereLight(0x8fa0ff, 0x2a1440, 0.9));

  const planet = new THREE.Mesh(new THREE.SphereGeometry(1400, 64, 32), new THREE.MeshStandardMaterial({ map: T.planet, roughness: 1 }));
  planet.position.set(3800, -700, -4800); planet.rotation.z = 0.3; scene.add(planet);
  const atm = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.glow, color: 0xff9a66, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5 }));
  atm.position.copy(planet.position); atm.scale.setScalar(3700); scene.add(atm);
  const rg = new THREE.RingGeometry(1800, 2900, 128, 1), rp = rg.attributes.position, ruv = rg.attributes.uv;
  for (let i = 0; i < rp.count; i++) { const rr = Math.hypot(rp.getX(i), rp.getY(i)); ruv.setXY(i, (rr - 1800) / 1100, 0.5); }
  const ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ map: T.ring, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.9 }));
  ring.position.copy(planet.position); ring.rotation.set(-1.25, 0.2, 0.3); scene.add(ring);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(300, 40, 20), new THREE.MeshStandardMaterial({ map: T.moon, roughness: 1 }));
  moon.position.set(-3000, 400, 2600); scene.add(moon);
}

// ---------------------------------------------------------------- rocks
let ROCK_GEOS = null;
function rockGeos() {
  if (ROCK_GEOS) return ROCK_GEOS;
  ROCK_GEOS = [0, 1, 2, 3, 4].map(seed => {
    const g = new THREE.IcosahedronGeometry(1, 2), p = g.attributes.position, v = new V3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      const d = 1 + 0.24 * Math.sin(v.x * 3.1 + seed) * Math.sin(v.y * 2.3 + seed * 1.7) + 0.13 * Math.sin(v.z * 6.7 + seed * 3) + 0.07 * Math.sin((v.x + v.y) * 11 + seed);
      v.multiplyScalar(d); p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals(); return g;
  });
  return ROCK_GEOS;
}
export const isSharedGeo = g => !!ROCK_GEOS && ROCK_GEOS.includes(g);
const rockMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0.05, flatShading: true });

// rocks: [{ pos: V3, size, danger? }] -> returns update(dt) that spins them. danger rocks are red.
export function makeRockField(scene, rocks, r) {
  const geos = rockGeos(), byGeo = geos.map(() => []), c = new THREE.Color();
  rocks.forEach(k => {
    k.geo = (r() * geos.length) | 0;
    k.q = new THREE.Quaternion().setFromAxisAngle(r.dir(), r() * 6.28);
    k.axis = r.dir(); k.spin = r.range(-0.6, 0.6);
    byGeo[k.geo].push(k);
  });
  const meshes = byGeo.map((list, gi) => {
    if (!list.length) return null;
    const m = new THREE.InstancedMesh(geos[gi], rockMat, list.length);
    list.forEach((k, i) => { const h = r.range(0.02, 0.1) + (r() < 0.15 ? 0.7 : 0), sat = r.range(0.12, 0.3), l = r.range(0.32, 0.5); c.setHSL(k.danger ? 0.01 : h, k.danger ? 0.75 : sat, k.danger ? 0.5 : l); m.setColorAt(i, c); });
    scene.add(m); return { m, list };
  }).filter(Boolean);
  const mat = new THREE.Matrix4(), dq = new THREE.Quaternion(), s = new V3();
  return function update(dt) {
    for (const { m, list } of meshes) {
      list.forEach((k, i) => { dq.setFromAxisAngle(k.axis, k.spin * dt); k.q.premultiply(dq); mat.compose(k.pos, k.q, s.setScalar(k.size)); m.setMatrixAt(i, mat); });
      m.instanceMatrix.needsUpdate = true;
    }
  };
}

// ---------------------------------------------------------------- ships
// Ship faces +Z, up is +Y. userData.inner can be rolled for banking.
export function makeShip(color) {
  const root = new THREE.Group(), inner = new THREE.Group(); root.add(inner);
  const paint = new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.32 });
  const white = new THREE.MeshStandardMaterial({ color: 0xeef0ff, metalness: 0.25, roughness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x24223c, metalness: 0.6, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.LatheGeometry([[0, -3], [0.95, -3], [1.25, -1.2], [1.05, 1.4], [0.55, 3.1], [0, 4.4]].map(p => new THREE.Vector2(p[0], p[1])), 24), paint);
  body.geometry.rotateX(Math.PI / 2); inner.add(body);
  const ws = new THREE.Shape(); ws.moveTo(0, 1.2); ws.lineTo(4.4, -1.6); ws.lineTo(4.6, -2.6); ws.lineTo(0, -2.2); ws.closePath();
  const wg = new THREE.ExtrudeGeometry(ws, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 1 });
  wg.rotateX(Math.PI / 2); wg.translate(0, 0.15, 0);
  for (const sx of [1, -1]) {
    const w = new THREE.Mesh(wg, white); w.scale.x = sx; w.position.y = -0.25; inner.add(w);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 1.6), paint); tip.position.set(4.5 * sx, -0.15, -1.9); inner.add(tip);
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 1.8, 16), dark); eng.geometry.rotateX(Math.PI / 2); eng.position.set(1.05 * sx, -0.1, -2.9); inner.add(eng);
  }
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.7, 1.7), paint); fin.position.set(0, 1.1, -2.1); fin.rotation.x = -0.45; inner.add(fin);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), new THREE.MeshStandardMaterial({ color: 0x7fe6ff, emissive: 0x123a55, metalness: 0.1, roughness: 0.05 }));
  glass.scale.set(0.68, 0.55, 1.45); glass.position.set(0, 0.72, 1.0); inner.add(glass);
  const glows = [];
  for (const sx of [1, -1]) {
    const o = new THREE.Sprite(glowMat(color)); o.position.set(1.05 * sx, -0.1, -4.0); o.userData.base = 2.6; inner.add(o);
    const c = new THREE.Sprite(glowMat(0xffffff)); c.position.set(1.05 * sx, -0.1, -3.9); c.userData.base = 1.1; inner.add(c);
    glows.push(o, c);
  }
  const aura = new THREE.Sprite(glowMat(color, 0.5)); aura.scale.setScalar(9); inner.add(aura);
  root.userData = { inner, glows, nozzles: [glows[0], glows[2]] };
  return root;
}

export function setFlames(mesh, power) {
  for (const g of mesh.userData.glows) g.scale.setScalar(g.userData.base * (0.7 + power * 0.9) * (0.92 + Math.random() * 0.16));
}

// fading ribbon behind an engine
export class Trail {
  constructor(scene, color, n = 22, width = 0.32) {
    this.n = n; this.width = width; this.color = new THREE.Color(color); this.hist = [];
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 6); this.col = new Float32Array(n * 6);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const idx = []; for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    g.setIndex(idx); this.geo = g;
    this.mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    this.mesh.frustumCulled = false; scene.add(this.mesh);
  }
  reset() { this.hist = []; this.pos.fill(0); this.geo.attributes.position.needsUpdate = true; }
  push(p, side, power) {
    this.hist.unshift({ p: p.clone(), s: side.clone(), k: power });
    if (this.hist.length > this.n) this.hist.pop();
    for (let i = 0; i < this.n; i++) {
      const h = this.hist[Math.min(i, this.hist.length - 1)];
      const t = i / (this.n - 1), w = this.width * (1 - t) * (0.6 + h.k * 0.6), f = (1 - t) ** 1.6 * (0.5 + h.k * 0.7);
      this.pos.set([h.p.x + h.s.x * w, h.p.y + h.s.y * w, h.p.z + h.s.z * w, h.p.x - h.s.x * w, h.p.y - h.s.y * w, h.p.z - h.s.z * w], i * 6);
      this.col.set([this.color.r * f, this.color.g * f, this.color.b * f, this.color.r * f, this.color.g * f, this.color.b * f], i * 6);
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.attributes.color.needsUpdate = true;
  }
}

// engine trails for one ship
export function shipTrails(scene, ship, color, width) {
  const trails = [new Trail(scene, color, 22, width), new Trail(scene, color, 22, width)];
  const tmp = new V3();
  return (side, power) => ship.userData.nozzles.forEach((n, k) => trails[k].push(n.getWorldPosition(tmp), side, power));
}

// a closed loop in space
export function loopCurve(radius, height, n, squash = 0.8, wobble = 0.28, phase = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / n * Math.PI * 2, rr = radius * (1 + wobble * Math.sin(3 * t + 0.5 + phase));
    pts.push(new V3(Math.cos(t) * rr, height * Math.sin(2 * t + phase) + height * 0.55 * Math.sin(5 * t + 1 + phase * 2), Math.sin(t) * rr * squash));
  }
  return new THREE.CatmullRomCurve3(pts, true, 'centripetal');
}
