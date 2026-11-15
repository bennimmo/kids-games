// Sky Pilot: things that stay put. Airports (runways, lights, PAPI), towns, trees, the carrier,
// lighthouse, wind turbines, ferris wheel, pyramids, roads and railway.
import * as THREE from '../../js/vendor/three.module.min.js';
import {
  AIRPORTS, TOWNS, CARRIER, HARBOUR, HELIPADS, LANDMARKS, LAKE, ROADS, roadPath, runwayPoint, runwayLocal, apronSide, dirOf,
  terrainHeight, terrainNormal, regionWeights, biomeAt, addRoof, surfaceAt, HALF, CELL, GRID, N,
} from './island.js';
import { rng, hash2, clamp, smooth, lerp } from './noise.js';
import { buildPlane, paint } from './planes.js';

const V3 = THREE.Vector3;

// ---------------------------------------------------------------- little helpers
function canvas(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// merge all meshes of a group into one mesh per material (fewer draw calls for static things)
export function mergeByMaterial(group) {
  group.updateMatrixWorld(true);
  const byMat = new Map();
  group.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh) return;
    const m = o.material;
    if (m.transparent && m.opacity < 0.5 && !m.map) return;
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const keep = m.map ? ['position', 'normal', 'uv'] : ['position', 'normal'];
    for (const k of Object.keys(g.attributes)) if (!keep.includes(k)) g.deleteAttribute(k);
    if (!byMat.has(m)) byMat.set(m, []);
    byMat.get(m).push(g);
  });
  const out = new THREE.Group();
  for (const [m, list] of byMat) {
    const attrs = Object.keys(list[0].attributes);
    const merged = new THREE.BufferGeometry();
    for (const a of attrs) {
      const size = list[0].attributes[a].itemSize;
      const total = list.reduce((s, g) => s + (g.attributes[a] ? g.attributes[a].count : 0), 0);
      const arr = new Float32Array(total * size);
      let off = 0;
      for (const g of list) { if (g.attributes[a]) { arr.set(g.attributes[a].array, off); off += g.attributes[a].array.length; } }
      merged.setAttribute(a, new THREE.BufferAttribute(arr, size));
    }
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, m); mesh.castShadow = true; mesh.receiveShadow = true;
    out.add(mesh);
    list.forEach(g => g.dispose());
  }
  return out;
}

// boxes + roofs merged into one geometry, UVs in metres (for window textures)
class Builder {
  constructor() { this.pos = []; this.nor = []; this.uv = []; this.col = []; }
  quad(a, b, c, d, n, uw, uh, col, u0 = 0, v0 = 0) {
    const P = [a, b, c, a, c, d], U = [[u0, v0], [u0 + uw, v0], [u0 + uw, v0 + uh], [u0, v0], [u0 + uw, v0 + uh], [u0, v0 + uh]];
    for (let i = 0; i < 6; i++) { this.pos.push(...P[i]); this.nor.push(...n); this.uv.push(...U[i]); this.col.push(...col); }
  }
  // axis box at x,z (rotated rot), from y0 up h. uvScale: metres per texture repeat [u, v]
  box(x, y0, z, w, h, d, rot, col = [1, 1, 1], us = [12, 12], top = true) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const P = (lx, ly, lz) => [x + lx * c + lz * s, y0 + ly, z - lx * s + lz * c];
    const N = (lx, lz) => [lx * c + lz * s, 0, -lx * s + lz * c];
    const hw = w / 2, hd = d / 2;
    const ru = (m, k) => m / us[k];
    this.quad(P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, hd), P(-hw, h, hd), N(0, 1), ru(w, 0), ru(h, 1), col);
    this.quad(P(hw, 0, -hd), P(-hw, 0, -hd), P(-hw, h, -hd), P(hw, h, -hd), N(0, -1), ru(w, 0), ru(h, 1), col);
    this.quad(P(hw, 0, hd), P(hw, 0, -hd), P(hw, h, -hd), P(hw, h, hd), N(1, 0), ru(d, 0), ru(h, 1), col);
    this.quad(P(-hw, 0, -hd), P(-hw, 0, hd), P(-hw, h, hd), P(-hw, h, -hd), N(-1, 0), ru(d, 0), ru(h, 1), col);
    if (top) this.quad(P(-hw, h, hd), P(hw, h, hd), P(hw, h, -hd), P(-hw, h, -hd), [0, 1, 0], 0.01, 0.01, col, 0.99, 0.99);
  }
  // pitched roof along the width
  roof(x, y0, z, w, d, h, rot, col) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const P = (lx, ly, lz) => [x + lx * c + lz * s, y0 + ly, z - lx * s + lz * c];
    const hw = w / 2, hd = d / 2;
    const n1 = new V3(0, hw, h).normalize(), n2 = new V3(0, hw, -h).normalize();
    const rn = v => [v.x * c + v.z * s, v.y, -v.x * s + v.z * c];
    this.quad(P(-hw, 0, hd), P(hw, 0, hd), P(hw, h, 0), P(-hw, h, 0), rn(n1), 1, 1, col);
    this.quad(P(hw, 0, -hd), P(-hw, 0, -hd), P(-hw, h, 0), P(hw, h, 0), rn(n2), 1, 1, col);
    const sx = [c, 0, -s];
    this.pos.push(...P(hw, 0, hd), ...P(hw, 0, -hd), ...P(hw, h, 0)); for (let i = 0; i < 3; i++) { this.nor.push(...sx); this.uv.push(0, 0); this.col.push(...col); }
    this.pos.push(...P(-hw, 0, -hd), ...P(-hw, 0, hd), ...P(-hw, h, 0)); for (let i = 0; i < 3; i++) { this.nor.push(-sx[0], 0, -sx[2]); this.uv.push(0, 0); this.col.push(...col); }
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeBoundingSphere();
    return g;
  }
}

// ---------------------------------------------------------------- glowing lights (one draw call per set)
const lightVert = `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 color;
attribute float size;
attribute float blink;
uniform float amount, time, dpr;
varying vec3 vCol;
varying float vOn;
void main() {
  vCol = color;
  vOn = blink < 0.0 ? 1.0 : (fract(time * 0.9 - blink) < 0.08 ? 1.0 : 0.0);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(size * 600.0 / -mv.z, 2.0, size * 10.0) * dpr;
  if (vOn < 0.5 || amount < 0.01) gl_PointSize = 0.0;
  #include <logdepthbuf_vertex>
}`;
const lightFrag = `
#include <common>
#include <logdepthbuf_pars_fragment>
uniform float amount;
varying vec3 vCol;
void main() {
  #include <logdepthbuf_fragment>
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a = a * a + smoothstep(0.35, 0.0, d);
  gl_FragColor = vec4(vCol * a * amount * 1.6, 1.0);
}`;
export function makeLights(list, dpr, always = false) {
  // list: [x, y, z, r, g, b, size, blink]
  const n = list.length, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n), blink = new Float32Array(n);
  list.forEach((l, i) => { pos.set(l.slice(0, 3), i * 3); col.set(l.slice(3, 6), i * 3); size[i] = l[6] || 1; blink[i] = l[7] ?? -1; });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('size', new THREE.BufferAttribute(size, 1));
  g.setAttribute('blink', new THREE.BufferAttribute(blink, 1));
  const u = { amount: { value: 0 }, time: { value: 0 }, dpr: { value: dpr } };
  const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: lightVert, fragmentShader: lightFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  const p = new THREE.Points(g, m);
  p.frustumCulled = false; p.renderOrder = 4;
  return { obj: p, u, always, col, geo: g };
}

// ---------------------------------------------------------------- runway texture
const WHITE = '#f4f4f0';
function runwayTexture(ap) {
  const L = ap.len, Wd = ap.wid, H = 4096, Wp = 256;
  const sy = H / L, sx = Wp / Wd;
  const grass = ap.surface === 'grass';
  return canvas(Wp, H, g => {
    const R = rng(ap.len);
    g.fillStyle = grass ? '#5b7d36' : '#3a3b3d'; g.fillRect(0, 0, Wp, H);
    for (let i = 0; i < 9000; i++) { const v = grass ? 70 + R() * 60 : 45 + R() * 30; g.fillStyle = grass ? `rgba(${v * 0.7},${v},${v * 0.45},.5)` : `rgba(${v},${v},${v + 2},.5)`; g.fillRect(R() * Wp, R() * H, 1 + R() * 2, 1 + R() * 4); }
    // tyre marks in the touchdown zones
    if (!grass) for (const end of [0, 1]) for (let i = 0; i < 40; i++) {
      const y = end ? H - (300 + R() * 500) * sy : (300 + R() * 500) * sy;
      g.fillStyle = 'rgba(15,15,15,.22)'; g.fillRect(Wp / 2 + (R() - 0.5) * 12 * sx, y, (2 + R() * 3), 30 + R() * 80);
    }
    const M = (x, y, w, h) => g.fillRect(Wp / 2 + x * sx, H - y * sy, w * sx, h * sy); // x across from centre, y along from bottom end (m)
    g.fillStyle = WHITE;
    if (grass) {
      for (let y = 0; y < L; y += 50) { M(-Wd / 2, y + 3, 1.5, 3); M(Wd / 2 - 1.5, y + 3, 1.5, 3); }
      return;
    }
    M(-Wd / 2 + 1, L, 0.9, L); M(Wd / 2 - 1.9, L, 0.9, L);                  // edges
    for (let y = 120; y < L - 120; y += 60) M(-0.45, y + 30, 0.9, 30);        // centre dashes
    const num = h => { let n = Math.round(((h * 180 / Math.PI) % 360 + 360) % 360 / 10); if (n === 0) n = 36; return String(n).padStart(2, '0'); };
    for (const end of [0, 1]) {
      g.save();
      if (end) { g.translate(Wp, H); g.rotate(Math.PI); }
      g.fillStyle = WHITE;
      const bars = Wd >= 45 ? 12 : 8, bw = 1.8, gap = (Wd - 6) / bars;
      for (let i = 0; i < bars; i++) { const x = -Wd / 2 + 3 + i * gap + (i >= bars / 2 ? 0.8 : 0); if (Math.abs(x + bw / 2) > 1.5) M(x, 6 + 45, bw, 45); }
      // number
      g.save();
      g.translate(Wp / 2, H - 70 * sy);
      g.scale(sx, sy);
      g.font = '700 22px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.scale(1, -1); g.scale(1, -1);
      g.save(); g.scale(0.42, 1.0); g.fillText(num(end ? ap.hdg + Math.PI : ap.hdg), 0, 0); g.restore();
      g.restore();
      // touchdown zone + aiming point
      for (const y of [150, 450, 600]) { M(-Wd * 0.32, y + 22, 1.8, 22); M(-Wd * 0.32 + 2.6, y + 22, 1.8, 22); M(Wd * 0.32 - 1.8, y + 22, 1.8, 22); M(Wd * 0.32 - 4.4, y + 22, 1.8, 22); }
      M(-Wd * 0.18 - 4, 300 + 45, 6, 45); M(Wd * 0.18 - 2, 300 + 45, 6, 45);
      g.restore();
    }
  });
}

function concreteTexture() {
  return canvas(256, 256, (g, w, h) => {
    const R = rng(4);
    g.fillStyle = '#8d8e8a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { const v = 120 + R() * 40; g.fillStyle = `rgba(${v},${v},${v - 4},.4)`; g.fillRect(R() * w, R() * h, 2, 2); }
    g.strokeStyle = 'rgba(60,60,60,.35)'; g.lineWidth = 2;
    for (let x = 0; x <= w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); }
  });
}

// window textures: colour map + glow map (lit windows at night)
function facadeTextures(kind) {
  const R = rng(kind.length * 31);
  const S = 256;
  const draw = glow => canvas(S, S, g => {
    const base = { glass: '#3d5a78', concrete: '#c9c1b0', brick: '#a5634b', white: '#e8e6df', adobe: '#d9b48a', wood: '#7a5332' }[kind];
    g.fillStyle = glow ? '#000' : base; g.fillRect(0, 0, S, S);
    const cols = kind === 'glass' ? 8 : 4, rows = 4, cw = S / cols, rh = S / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * cw + cw * 0.15, y = r * rh + rh * 0.25, w = cw * 0.7, h = rh * 0.55;
      if (glow) { if (R() < 0.45) { g.fillStyle = R() < 0.8 ? '#ffd890' : '#bfe0ff'; g.fillRect(x, y, w, h); } }
      else { g.fillStyle = kind === 'glass' ? '#1d2c3c' : '#2a3441'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(x, y, w, h * 0.3); }
    }
  });
  const map = draw(false), em = draw(true);
  map.wrapS = map.wrapT = em.wrapS = em.wrapT = THREE.RepeatWrapping;
  return { map, em };
}

function findCoast(angle, from = [0, 0]) {
  let last = null;
  for (let r = 0; r < 22000; r += 20) {
    const x = from[0] + Math.sin(angle) * r, z = from[1] + Math.cos(angle) * r;
    if (terrainHeight(x, z) < 0.3) return { land: last, sea: [x, z] };
    last = [x, z];
  }
  return { land: last, sea: last };
}

// ================================================================ build it all
export function createScenery(scene, sky, quality, dpr) {
  const R = rng(9090);
  const root = new THREE.Group(); scene.add(root);
  const lights = [];        // lights that turn on at night
  const papis = [];         // { pos, ends } colours change with the viewer's angle
  const spinners = [];      // things that turn (turbines, ferris wheel)
  const beams = [];
  const concrete = new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: 0.9, color: 0xdddddd });
  concrete.map.wrapS = concrete.map.wrapT = THREE.RepeatWrapping;
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x45464a, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const flatMat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...o });
  const facades = {};
  for (const k of ['glass', 'concrete', 'brick', 'white', 'adobe', 'wood']) {
    const t = facadeTextures(k);
    const m = new THREE.MeshStandardMaterial({ map: t.map, emissiveMap: t.em, emissive: 0xffffff, emissiveIntensity: 0, roughness: k === 'glass' ? 0.15 : 0.85, metalness: k === 'glass' ? 0.6 : 0, vertexColors: true });
    sky.addNightMat(m, k === 'glass' ? 1.6 : 1.2);
    facades[k] = m;
  }
  const roofMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
  const builders = {};
  const B = k => (builders[k] = builders[k] || new Builder());

  // flat ground patch (apron, taxiway) following a rectangle in an airport's frame
  function pad(ap, a0, a1, s0, s1, mat, y = 0.12) {
    const L = a1 - a0, W = s1 - s0;
    const g = new THREE.PlaneGeometry(W, L); g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, mat);
    const [cx, cz] = runwayPoint(ap, (a0 + a1) / 2, (s0 + s1) / 2);
    m.position.set(cx, ap.elev + y, cz); m.rotation.y = -ap.hdg;
    m.receiveShadow = true;
    if (mat.map) { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 40, uv.getY(i) * L / 40); }
    root.add(m);
    return m;
  }
  function building(x, z, y0, w, h, d, rot, kind, col = [1, 1, 1], pad = false) {
    const us = kind === 'glass' ? [24, 14] : [12, 12];
    B(kind).box(x, y0, z, w, h, d, rot, col, us);
    addRoof({ x, z, hw: w / 2, hd: d / 2, rot, top: y0 + h, pad });
  }

  // ------------------------------------------------------------ airports
  for (const ap of AIRPORTS) {
    const [dx, dz] = dirOf(ap.hdg);
    const tex = runwayTexture(ap);
    const rg = new THREE.PlaneGeometry(ap.wid, ap.len); rg.rotateX(-Math.PI / 2); rg.rotateY(-ap.hdg);
    const rw = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    rw.position.set(ap.x, ap.elev + 0.3, ap.z); rw.receiveShadow = true;
    root.add(rw);
    // shoulders
    if (ap.surface !== 'grass') pad(ap, -ap.len / 2 - 60, ap.len / 2 + 60, -ap.wid / 2 - 8, ap.wid / 2 + 8, flatMat(0x6d6e66, { polygonOffset: true, polygonOffsetFactor: -2 }), 0.1);
    const big = !!ap.big, side = apronSide(ap);
    const twy = ap.wid / 2 + 50;
    const paved = ap.surface !== 'grass';
    const twMat = paved ? asphalt : flatMat(0x6b7a3e);
    pad(ap, -ap.len / 2, ap.len / 2, twy - 10, twy + 10, twMat, 0.13);
    for (const a of [-ap.len / 2 + 15, ap.len / 2 - 15, 0]) pad(ap, a - 12, a + 12, ap.wid / 2, twy, twMat, 0.13);
    const apA = big ? 700 : 260, apS0 = twy + 12, apS1 = side - 40;
    pad(ap, -apA, apA, apS0, apS1, paved ? concrete : flatMat(0x7a8a48), 0.14);

    // buildings along the back of the apron
    const back = side - 30;
    const put = (along, sideOff, w, h, d, kind, col) => { const [x, z] = runwayPoint(ap, along, sideOff); building(x, z, ap.elev, w, h, d, -ap.hdg, kind, col); return [x, z]; };
    if (big) {
      put(-150, back - 20, 340, 22, 50, 'glass');                    // terminal
      put(-150, back + 6, 360, 4, 6, 'concrete');
      for (let i = 0; i < 4; i++) put(260 + i * 95, back - 30, 80, 24, 56, 'white', [0.95, 0.95, 1]); // hangars
      // control tower
      const [tx, tz] = runwayPoint(ap, -420, back - 20);
      const tower = new THREE.Group(); tower.position.set(tx, ap.elev, tz); root.add(tower);
      tower.add(new THREE.Mesh(new THREE.CylinderGeometry(5, 7, 52, 16), flatMat(0xd8d4cc)).translateY(26));
      const cab = new THREE.Mesh(new THREE.CylinderGeometry(10, 8, 9, 12), new THREE.MeshStandardMaterial({ color: 0x2a5577, metalness: 0.8, roughness: 0.1, emissive: 0x88ccff, emissiveIntensity: 0 })); cab.position.y = 57; tower.add(cab);
      sky.addNightMat(cab.material, 0.8);
      tower.add(new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 1.2, 12), flatMat(0xeeeeee)).translateY(62));
      tower.traverse(o => { o.castShadow = true; });
      addRoof({ x: tx, z: tz, hw: 9, hd: 9, rot: 0, top: ap.elev + 62 });
      lights.push(makeLights([[tx, ap.elev + 66, tz, 1, 0.1, 0.1, 2.2, 0.3]], dpr, true));
    } else {
      put(-60, back - 10, 60, 7, 18, paved ? 'white' : 'wood');
      put(60, back - 15, 45, 12, 30, 'white', [0.9, 0.9, 0.95]);
      const [tx, tz] = put(-130, back - 12, 8, 14, 8, 'concrete');
      addRoof({ x: tx, z: tz, hw: 4, hd: 4, rot: 0, top: ap.elev + 14 });
    }
    // fuel tanks
    for (let i = 0; i < (big ? 3 : 1); i++) {
      const [x, z] = runwayPoint(ap, (big ? 600 : 140) + i * 22, back - 10);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 10, 20), flatMat(0xe8e8e8, { metalness: 0.4, roughness: 0.4 }));
      t.position.set(x, ap.elev + 5, z); t.castShadow = true; root.add(t);
    }
    // windsock
    const [wx, wz] = runwayPoint(ap, -ap.len / 2 + 300, -ap.wid / 2 - 40);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 7, 6), flatMat(0xdddddd)); pole.position.set(wx, ap.elev + 3.5, wz); root.add(pole);
    const sock = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4, 12, 1, true).rotateX(-Math.PI / 2).translate(0, 0, 2), new THREE.MeshStandardMaterial({ color: 0xff6f00, side: THREE.DoubleSide, roughness: 0.7 }));
    sock.position.set(wx, ap.elev + 6.8, wz); root.add(sock);
    spinners.push({ kind: 'sock', obj: sock });

    // parked planes
    const parked = big ? [['jumbo', -60, 0x1e88e5], ['jumbo', -240, 0xe53935], ['cub', 380, 0xffb300], ['cub', 420, 0x43a047]] : [['cub', 30, R.pick([0xe53935, 0x1e88e5, 0x8e24aa])]];
    for (const [type, along, color] of parked) {
      const pl = buildPlane(type, color);
      const [x, z] = runwayPoint(ap, along, big && type === 'jumbo' ? back - 75 : back - 50);
      pl.group.position.set(x, ap.elev + (type === 'jumbo' ? 3.6 : 1.25), z);
      pl.group.rotation.y = -ap.hdg + Math.PI / 2 + Math.PI;
      pl.parts.gear.forEach(gr => { gr.g.rotation.set(0, 0, 0); });
      root.add(mergeByMaterial(pl.group));
    }

    // ---- lights
    const L = [];
    if (paved) {
      for (let a = -ap.len / 2; a <= ap.len / 2 + 1; a += 60) for (const s of [-1, 1]) {
        const [x, z] = runwayPoint(ap, a, s * (ap.wid / 2 + 1.5));
        const yel = Math.abs(a) > ap.len / 2 - 600;
        L.push([x, ap.elev + 0.6, z, 1, yel ? 0.85 : 0.95, yel ? 0.5 : 0.85, 1.1]);
      }
      // threshold green / end red, both ends
      for (let s = -ap.wid / 2; s <= ap.wid / 2; s += 4) {
        const [x1, z1] = runwayPoint(ap, -ap.len / 2, s), [x2, z2] = runwayPoint(ap, ap.len / 2, s);
        L.push([x1, ap.elev + 0.5, z1, 0.2, 1, 0.35, 1.1], [x2, ap.elev + 0.5, z2, 0.2, 1, 0.35, 1.1]);
      }
      // approach lights + running "rabbit" strobes at both ends
      for (const e of [-1, 1]) {
        const n = big ? 15 : 6;
        for (let i = 1; i <= n; i++) {
          const a = e * (ap.len / 2 + i * 60);
          const tg = surfaceAt(...runwayPoint(ap, a, 0)).h;
          const y = Math.max(ap.elev, tg) + 1.5;
          for (let s = -6; s <= 6; s += 3) { const [x, z] = runwayPoint(ap, a, s); L.push([x, y, z, 1, 0.95, 0.85, 1.2]); }
          if (i === 10) for (let s = -15; s <= 15; s += 3) { const [x, z] = runwayPoint(ap, a, s); L.push([x, y, z, 1, 0.95, 0.85, 1.2]); }
          const [x, z] = runwayPoint(ap, a, 0); L.push([x, y + 0.5, z, 1, 1, 1, 2.6, (n - i) / n * 0.5]);
        }
      }
      // taxiway edges (blue)
      for (let a = -ap.len / 2; a <= ap.len / 2; a += 60) for (const s of [twy - 11, twy + 11]) { const [x, z] = runwayPoint(ap, a, s); L.push([x, ap.elev + 0.5, z, 0.2, 0.4, 1, 0.8]); }
    } else {
      for (let a = -ap.len / 2; a <= ap.len / 2; a += 90) for (const s of [-1, 1]) { const [x, z] = runwayPoint(ap, a, s * (ap.wid / 2 + 2)); L.push([x, ap.elev + 0.6, z, 1, 0.8, 0.4, 1]); }
    }
    // apron floodlights
    for (let a = -apA; a <= apA; a += big ? 140 : 120) { const [x, z] = runwayPoint(ap, a, apS1 - 5); L.push([x, ap.elev + 14, z, 1, 0.85, 0.6, 3]); }
    lights.push(makeLights(L, dpr));
    // PAPI: 4 lights left of the touchdown point at each end
    if (paved) for (const e of [-1, 1]) {
      const list = [];
      for (let i = 0; i < 4; i++) { const [x, z] = runwayPoint(ap, e * (ap.len / 2 - 300), e * -(ap.wid / 2 + 15 + i * 9)); list.push([x, ap.elev + 1, z, 1, 1, 1, 1.8]); }
      const lp = makeLights(list, dpr, true);
      lights.push(lp);
      const [tx, tz] = runwayPoint(ap, e * (ap.len / 2 - 300), 0);
      papis.push({ lp, x: tx, z: tz, y: ap.elev, dir: e, ap });
    }
  }

  // ------------------------------------------------------------ carrier
  {
    const c = CARRIER, g = new THREE.Group();
    g.position.set(c.x, 0, c.z); g.rotation.y = -c.hdg + Math.PI;
    root.add(g);
    // the deck runs along local z (forward = +z after the turn above, to match the heading)
    const hullMat = flatMat(0x5f6a72, { roughness: 0.7 });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(c.wid * 0.6, c.deck + 6, c.len * 0.92), hullMat); hull.position.set(0, (c.deck - 6) / 2, -c.len * 0.02); g.add(hull);
    const bow = new THREE.Mesh(new THREE.ConeGeometry(c.wid * 0.3, 40, 4, 1).rotateX(Math.PI / 2).rotateZ(Math.PI / 4), hullMat); bow.scale.set(1, (c.deck + 6) / (c.wid * 0.42), 1); bow.position.set(0, (c.deck - 6) / 2, c.len * 0.46 + 14); g.add(bow);
    const deckTex = canvas(256, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#3e4246'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 3000; i++) { ctx.fillStyle = `rgba(${70 + Math.random() * 30},${70 + Math.random() * 30},${75 + Math.random() * 30},.4)`; ctx.fillRect(Math.random() * w, Math.random() * h, 2, 3); }
      ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 3; ctx.setLineDash([24, 16]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = '#ffd400'; ctx.lineWidth = 2; ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.fillStyle = '#f2f2f2'; ctx.font = '700 120px Arial'; ctx.textAlign = 'center'; ctx.fillText('77', w / 2, h - 60);
      ctx.strokeStyle = '#c33'; ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(30, h * 0.78 + k * 20); ctx.lineTo(w - 30, h * 0.78 + k * 20); ctx.stroke(); }
    });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(c.wid, 1.2, c.len), [hullMat, hullMat, new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.8 }), hullMat, hullMat, hullMat]);
    deck.position.y = c.deck - 0.6; deck.receiveShadow = true; g.add(deck);
    const isl = new THREE.Mesh(new THREE.BoxGeometry(10, 22, 40), hullMat); isl.position.set(-c.wid / 2 + 5, c.deck + 11, -20); g.add(isl);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1, 18, 8), hullMat); mast.position.set(-c.wid / 2 + 5, c.deck + 31, -24); g.add(mast);
    const br = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3, 30), new THREE.MeshStandardMaterial({ color: 0x223344, metalness: 0.8, roughness: 0.1 })); br.position.set(-c.wid / 2 + 5, c.deck + 18, -18); g.add(br);
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    // parked jets on deck
    for (let i = 0; i < 3; i++) {
      const pl = buildPlane('zoom', 0x78909c);
      pl.group.position.set(c.wid / 2 - 12, c.deck + 1.85, -60 + i * 18); pl.group.rotation.y = -Math.PI / 2 - 0.5;
      g.add(pl.group);
      g.updateMatrixWorld(true);
      const m = mergeByMaterial(pl.group);
      g.remove(pl.group);
      root.add(m);
    }
    // deck edge lights
    const L = [];
    const loc = (lx, ly, lz) => new V3(lx, ly, lz).applyEuler(g.rotation).add(g.position);
    for (let z = -c.len / 2; z <= c.len / 2; z += 20) for (const s of [-1, 1]) { const p = loc(s * c.wid / 2, c.deck + 0.4, z); L.push([p.x, p.y, p.z, 1, 1, 0.8, 1]); }
    for (let z = -c.len / 2; z <= c.len / 2; z += 15) { const p = loc(0, c.deck + 0.3, z); L.push([p.x, p.y, p.z, 1, 1, 1, 0.8]); }
    const mp = loc(-c.wid / 2 + 5, c.deck + 41, -24); L.push([mp.x, mp.y, mp.z, 1, 0.1, 0.1, 2, 0.2]);
    lights.push(makeLights(L, dpr));
  }

  // ------------------------------------------------------------ towns
  const cityPadTex = (t) => canvas(1024, Math.round(1024 * t.d / t.w), (g, w, h) => {
    g.fillStyle = '#9a9890'; g.fillRect(0, 0, w, h);
    const bx = w / (t.w / 130), by = h / (t.d / 130);
    for (let x = 0; x < w; x += bx) { g.fillStyle = '#4a4b4e'; g.fillRect(x, 0, bx * 0.17, h); g.fillStyle = '#e6e2c8'; g.fillRect(x + bx * 0.083, 0, 1, h); }
    for (let y = 0; y < h; y += by) { g.fillStyle = '#4a4b4e'; g.fillRect(0, y, w, by * 0.17); }
    // a park in the middle
    g.fillStyle = '#5c8d3a'; g.fillRect(w * 0.46, h * 0.42, bx * 0.8, by * 0.8);
  });
  const townLights = [];
  for (const t of TOWNS) {
    const c = Math.cos(t.rot), s = Math.sin(t.rot);
    const W = (lx, lz) => [t.x + lx * c + lz * s, t.z - lx * s + lz * c];
    if (t.kind === 'city') {
      const pg = new THREE.PlaneGeometry(t.w, t.d); pg.rotateX(-Math.PI / 2);
      const pm = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map: cityPadTex(t), roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 }));
      pm.position.set(t.x, t.elev + 0.2, t.z); pm.rotation.y = t.rot; pm.receiveShadow = true; root.add(pm);
    }
    const step = t.kind === 'city' ? 130 : 46;
    let hospital = t.kind === 'city';
    for (let lx = -t.w / 2 + step / 2; lx < t.w / 2; lx += step) for (let lz = -t.d / 2 + step / 2; lz < t.d / 2; lz += step) {
      const [x, z] = W(lx, lz);
      const gh = terrainHeight(x, z);
      if (gh < 1.5) continue;
      const centre = 1 - Math.min(1, Math.hypot(lx / (t.w / 2), lz / (t.d / 2)));
      if (t.kind === 'city') {
        if (Math.abs(lx) < 70 && Math.abs(lz) < 70) continue; // park
        // block of buildings
        const y0 = gh;
        const tall = centre > 0.55 && R() < 0.8;
        if (hospital && centre > 0.4 && centre < 0.6) {
          hospital = false;
          building(x, z, y0, 80, 30, 80, t.rot, 'white', [1, 1, 1]);
          // helipad on the roof
          const hp = new THREE.Mesh(new THREE.CircleGeometry(14, 32).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: canvas(128, 128, g => { g.fillStyle = '#3c3c40'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#ffd400'; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 56, 0, 7); g.stroke(); g.fillStyle = '#fff'; g.font = '700 80px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', 64, 68); }), roughness: 0.9 }));
          hp.position.set(x, y0 + 30.1, z); hp.rotation.y = t.rot; root.add(hp);
          addRoof({ x, z, hw: 40, hd: 40, rot: t.rot, top: y0 + 30, pad: true });
          HELIPADS.push({ x, z, y: y0 + 30, hdg: t.rot + Math.PI, name: 'Hospital' });
          LANDMARKS.push({ icon: '🏥', name: 'Hospital', x, z });
          townLights.push([x, y0 + 30.5, z + 14, 0.3, 1, 0.3, 1.5], [x + 14, y0 + 30.5, z, 0.3, 1, 0.3, 1.5], [x - 14, y0 + 30.5, z, 0.3, 1, 0.3, 1.5], [x, y0 + 30.5, z - 14, 0.3, 1, 0.3, 1.5]);
          continue;
        }
        const n = tall ? 1 + R.int(2) : 2 + R.int(3);
        for (let k = 0; k < n; k++) {
          const ox = (R() - 0.5) * 40, oz = (R() - 0.5) * 40;
          const w = tall ? 34 + R() * 26 : 18 + R() * 22, d = tall ? 34 + R() * 26 : 18 + R() * 22;
          const h = tall ? 50 + R() * 130 * centre : 9 + R() * 25 * (0.3 + centre);
          const kind = tall ? R.pick(['glass', 'glass', 'concrete']) : R.pick(['concrete', 'brick', 'white', 'brick']);
          const [bx, bz] = W(lx + ox, lz + oz);
          building(bx, bz, y0, w, h, d, t.rot, kind, [0.85 + R() * 0.15, 0.85 + R() * 0.15, 0.85 + R() * 0.15]);
          if (h > 90) townLights.push([bx, y0 + h + 3, bz, 1, 0.1, 0.1, 2, R()]);
          if (!tall && R() < 0.3) B('roof').box(bx, y0 + h, bz, w * 0.4, 3, d * 0.4, t.rot, [0.5, 0.5, 0.5]);
        }
        // street lights at the corners
        const [sx, sz] = W(lx - step / 2 + 11, lz - step / 2 + 11);
        townLights.push([sx, gh + 8, sz, 1, 0.75, 0.4, 1.6]);
      } else {
        if (R() < 0.25) continue;
        const kind = t.kind === 'chalet' ? 'wood' : t.kind === 'adobe' ? 'adobe' : 'white';
        const w = 9 + R() * 8, d = 7 + R() * 6, h = t.kind === 'adobe' ? 4 + R() * 4 : 5 + R() * 3;
        const ox = (R() - 0.5) * 16, oz = (R() - 0.5) * 16;
        const [bx, bz] = W(lx + ox, lz + oz);
        const y0 = terrainHeight(bx, bz) - 0.5;
        const rot = t.rot + (R() < 0.5 ? 0 : Math.PI / 2);
        building(bx, bz, y0, w, h, d, rot, kind);
        if (t.kind !== 'adobe') {
          const rc = t.kind === 'chalet' ? [0.95, 0.97, 1] : R.pick([[0.65, 0.22, 0.15], [0.45, 0.3, 0.22], [0.55, 0.25, 0.2]]);
          B('roof').roof(bx, y0 + h, bz, w + 1.2, d + 1.2, t.kind === 'chalet' ? 5 : 3.5, rot, rc);
        }
        if (R() < 0.4) townLights.push([bx + w * 0.6, y0 + 4, bz, 1, 0.75, 0.4, 1.1]);
      }
    }
  }
  // farm barns + fields' silos near the farm village
  for (let i = 0; i < 14; i++) {
    const x = -9500 + (R() - 0.5) * 3500, z = 3800 + (R() - 0.5) * 3500, h0 = terrainHeight(x, z);
    if (h0 < 2 || h0 > 250 || biomeAt(x, z) !== 'forest') continue;
    const rot = R() * 3;
    building(x, z, h0 - 0.5, 22, 8, 12, rot, 'brick', [0.9, 0.4, 0.35]);
    B('roof').roof(x, h0 + 7.5, z, 23, 13, 5, rot, [0.4, 0.4, 0.42]);
    const silo = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 16, 12), flatMat(0xcfd4d6, { metalness: 0.5 }));
    silo.position.set(x + 16, h0 + 8, z); silo.castShadow = true; root.add(silo);
  }
  if (townLights.length) lights.push(makeLights(townLights, dpr));

  // merge buildings
  for (const [k, b] of Object.entries(builders)) {
    const m = new THREE.Mesh(b.geometry(), k === 'roof' ? roofMat : facades[k]);
    m.castShadow = true; m.receiveShadow = true;
    root.add(m);
  }

  // ------------------------------------------------------------ roads and railway
  const roadMeshes = [];
  for (const road of ROADS) {
    const pts = roadPath(road, 20);
    road.path = pts;
    const w = road.kind === 'rail' ? 3.2 : 9;
    const pos = [], idx = [];
    pts.forEach(([x, y, z, dx, dz], i) => {
      pos.push(x - dz * w / 2, y, z + dx * w / 2, x + dz * w / 2, y, z - dx * w / 2);
      if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, road.kind === 'rail' ? flatMat(0x5a4636, { polygonOffset: true, polygonOffsetFactor: -2 }) : asphalt);
    m.receiveShadow = true; root.add(m); roadMeshes.push(m);
    if (road.kind === 'road') {
      const L = [];
      for (let i = 0; i < pts.length; i += 4) { const [x, y, z, dx, dz] = pts[i]; L.push([x - dz * 7, y + 7, z + dx * 7, 1, 0.75, 0.4, 1.1]); }
      // only near towns: keep the first and last bits
      lights.push(makeLights(L.filter((_, i) => i < 14 || i > L.length - 14), dpr));
    }
  }

  // ------------------------------------------------------------ landmarks
  // lighthouse on the south-east coast
  {
    const cst = findCoast(2.3);
    const [x, z] = cst.land;
    const y = terrainHeight(x, z);
    const lh = new THREE.Group(); lh.position.set(x, y, z); root.add(lh);
    for (let i = 0; i < 5; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(3.4 - i * 0.35, 3.75 - i * 0.35, 6, 16), flatMat(i % 2 ? 0xd32f2f : 0xf5f5f5));
      seg.position.y = 3 + i * 6; lh.add(seg);
    }
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3, 12), new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffee99, emissiveIntensity: 0 })); lamp.position.y = 32; lh.add(lamp);
    sky.addNightMat(lamp.material, 3);
    const top = new THREE.Mesh(new THREE.ConeGeometry(2.8, 2.5, 12), flatMat(0x333333)); top.position.y = 34.7; lh.add(top);
    lh.traverse(o => { o.castShadow = true; });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const beam = new THREE.Group(); beam.position.set(x, y + 32, z); root.add(beam);
    for (const s of [1, -1]) { const b = new THREE.Mesh(new THREE.ConeGeometry(30, 600, 16, 1, true).rotateZ(s * Math.PI / 2).translate(s * 300, 0, 0), beamMat); beam.add(b); }
    beams.push({ obj: beam, mat: beamMat });
    LANDMARKS.push({ icon: '🗼', name: 'Lighthouse', x, z });
    addRoof({ x, z, hw: 3.5, hd: 3.5, rot: 0, top: y + 36 });
  }
  // ferris wheel on the beach by town
  {
    const t = TOWNS[0], cst = findCoast(0, [t.x, t.z]);
    const [sx, sz] = cst.land;
    const x = sx, z = sz - 60, y = Math.max(2, terrainHeight(x, z));
    const fw = new THREE.Group(); fw.position.set(x, y, z); root.add(fw);
    const legM = flatMat(0xeeeeee, { metalness: 0.4 });
    for (const s of [-1, 1]) for (const k of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 34, 6), legM); leg.position.set(k * 9, 16, s * 4); leg.rotation.z = k * 0.28; fw.add(leg); }
    const wheelG = new THREE.Group(); wheelG.position.y = 32; fw.add(wheelG);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(24, 0.5, 6, 48), legM); wheelG.add(rim);
    const cols = [0xe53935, 0x1e88e5, 0xffb300, 0x43a047, 0x8e24aa, 0xff7043];
    const L = [];
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 24, 4), legM); sp.position.set(Math.cos(a) * 12, Math.sin(a) * 12, 0); sp.rotation.z = a + Math.PI / 2; wheelG.add(sp);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), flatMat(cols[i % cols.length])); cab.position.set(Math.cos(a) * 24, Math.sin(a) * 24 - 2, 0); cab.userData.cab = true; wheelG.add(cab);
    }
    for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; L.push([Math.cos(a) * 24.6, Math.sin(a) * 24.6, 0.8, ...[[1, 0.3, 0.3], [1, 0.9, 0.3], [0.3, 0.7, 1]][i % 3], 0.9]); }
    const wl = makeLights(L, dpr); wl.obj.frustumCulled = false; wheelG.add(wl.obj); lights.push(wl);
    fw.rotation.y = TOWNS[0].rot;
    fw.traverse(o => { if (o.isMesh) o.castShadow = true; });
    spinners.push({ kind: 'ferris', obj: wheelG });
    LANDMARKS.push({ icon: '🎡', name: 'Fair', x, z });
    // a pier
    const pier = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 220), flatMat(0x8d6e4f)); pier.position.set(x + 70, 2.2, z + 120); root.add(pier);
    addRoof({ x, z, hw: 12, hd: 26, rot: TOWNS[0].rot + Math.PI / 2, top: y + 56 });
  }
  // harbour for the seaplane: just off the town beach
  {
    const t = TOWNS[0], cst = findCoast(-0.5, [t.x, t.z]);
    const [sx, sz] = cst.sea;
    HARBOUR.x = sx - 120; HARBOUR.z = sz + 220; HARBOUR.hdg = Math.PI / 2;
    LANDMARKS.push({ icon: '⛵', name: 'Harbour', x: sx - 60, z: sz + 30 });
    for (let i = 0; i < 3; i++) {
      const jet = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 70), flatMat(0x8d6e4f));
      jet.position.set(sx - 60 + i * 40, 1.0, sz + 30); root.add(jet);
    }
  }
  // wind turbines on the western hills
  {
    const TL = [];
    let placed = 0;
    for (let tries = 0; tries < 400 && placed < 10; tries++) {
      const x = -8500 + (R() - 0.5) * 6000, z = -500 + R() * 6000, h = terrainHeight(x, z);
      if (h < 120 || h > 450) continue;
      const [nx, ny] = terrainNormal(x, z);
      if (ny < 0.97) continue;
      if (Math.hypot(x - AIRPORTS[3].x, z - AIRPORTS[3].z) < 1500) continue;
      placed++;
      const tb = new THREE.Group(); tb.position.set(x, h, z); root.add(tb);
      const white = flatMat(0xf2f2f2, { roughness: 0.5 });
      tb.add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.2, 70, 12), white).translateY(35));
      const nac = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 8), white); nac.position.set(0, 71, 0); tb.add(nac);
      const hub = new THREE.Group(); hub.position.set(0, 71, 4.3); tb.add(hub);
      for (let i = 0; i < 3; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(2, 36, 0.4).translate(0, 18, 0), white); bl.rotation.z = i * Math.PI * 2 / 3; hub.add(bl); }
      tb.rotation.y = 0.7;
      tb.traverse(o => { o.castShadow = true; });
      spinners.push({ kind: 'turbine', obj: hub, speed: 0.8 + R() * 0.4 });
      TL.push([x, h + 74, z, 1, 0.1, 0.1, 2.2, R()]);
      if (placed === 1) LANDMARKS.push({ icon: '🌬️', name: 'Wind farm', x, z });
      addRoof({ x, z, hw: 2.5, hd: 2.5, rot: 0, top: h + 72 });
    }
    lights.push(makeLights(TL, dpr, true));
  }
  // pyramids in the desert
  {
    const t = TOWNS[2];
    for (const [ox, oz, s] of [[900, -400, 140], [1150, -150, 100], [1300, 150, 70]]) {
      const x = t.x + ox, z = t.z + oz, h = terrainHeight(x, z);
      const p = new THREE.Mesh(new THREE.ConeGeometry(s * 0.75, s * 0.65, 4, 1), new THREE.MeshStandardMaterial({ color: 0xd8b07a, roughness: 0.95, flatShading: true }));
      p.position.set(x, h + s * 0.32 - 2, z); p.rotation.y = Math.PI / 4; p.castShadow = true; p.receiveShadow = true; root.add(p);
      addRoof({ x, z, hw: s * 0.3, hd: s * 0.3, rot: 0, top: h + s * 0.45 });
    }
    LANDMARKS.push({ icon: '🔺', name: 'Pyramids', x: t.x + 1100, z: t.z - 150 });
  }
  // radio mast on a mountain
  {
    let best = null;
    for (let i = 0; i < 300; i++) { const x = (R() - 0.5) * 6000 - 2000, z = -6500 + (R() - 0.5) * 3000, h = terrainHeight(x, z); if (!best || h > best[2]) best = [x, z, h]; }
    const [x, z, h] = best;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.6, 90, 6), flatMat(0xd84315)); m.position.set(x, h + 45, z); m.castShadow = true; root.add(m);
    lights.push(makeLights([[x, h + 92, z, 1, 0.1, 0.1, 3, 0.1], [x, h + 50, z, 1, 0.1, 0.1, 2, 0.6]], dpr, true));
    addRoof({ x, z, hw: 2, hd: 2, rot: 0, top: h + 90 });
    LANDMARKS.push({ icon: '📡', name: 'Peak', x, z });
  }

  // ------------------------------------------------------------ trees (instanced per chunk, only near you)
  const treeGeos = makeTreeGeos();
  const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: false });
  const swayU = { swayT: { value: 0 }, swayW: { value: 0.3 } };
  treeMat.onBeforeCompile = sh => {
    sh.uniforms.swayT = swayU.swayT; sh.uniforms.swayW = swayU.swayW;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float swayT, swayW;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
        vec3 ip = instanceMatrix[3].xyz;
        float bend = pow(max(transformed.y, 0.0) / 12.0, 1.6) * swayW;
        transformed.x += sin(swayT * 1.7 + ip.x * 0.05 + ip.z * 0.03) * bend;
        transformed.z += cos(swayT * 1.3 + ip.z * 0.05) * bend * 0.6;
        #endif`);
  };
  const TCH = 3000, treeChunks = [];
  const nearAirport = (x, z) => AIRPORTS.some(ap => { const l = runwayLocal(ap, x, z); return Math.abs(l.along) < ap.len / 2 + 450 && l.side > -ap.wid / 2 - 160 && l.side < apronSide(ap) + 60; });
  const inTown = (x, z) => TOWNS.some(t => { const c = Math.cos(t.rot), s = Math.sin(t.rot), dx = x - t.x, dz = z - t.z; return Math.abs(dx * c - dz * s) < t.w / 2 + 40 && Math.abs(dx * s + dz * c) < t.d / 2 + 40; });
  const roadNear = (x, z) => ROADS.some(r => r.path && r.path.some((p, i) => i % 3 === 0 && Math.abs(p[0] - x) < 25 && Math.abs(p[2] - z) < 25));
  const dens = quality.trees;
  for (let cz = -HALF; cz < HALF; cz += TCH) for (let cx = -HALF; cx < HALF; cx += TCH) {
    const lists = { pine: [], leaf: [], palm: [], cactus: [] };
    const tries = Math.round(2600 * dens);
    for (let i = 0; i < tries; i++) {
      const x = cx + R() * TCH, z = cz + R() * TCH;
      const h = terrainHeight(x, z);
      if (h < 1.2) continue;
      const nrm = terrainNormal(x, z);
      if (nrm[1] < 0.8) continue;
      const { wm, wd, ww } = regionWeights(x, z);
      const f = N.fbm(x / 1100 + 20, z / 1100, 3);
      let type = null;
      if (h < 7 && wd < 0.5 && wm < 0.5) { if (R() < 0.25) type = 'palm'; }
      else if (wd > 0.5) { if (R() < 0.05 && f > 0.4) type = 'cactus'; else if (h < 200 && Math.hypot(x - TOWNS[2].x, z - TOWNS[2].z) < 700 && R() < 0.4) type = 'palm'; }
      else if (wm > 0.5) { if (h < 1150 && f > 0.42 && R() < 0.55) type = 'pine'; }
      else if (ww > 0.5) { if (f > 0.4 && R() < 0.85) type = R() < 0.55 ? 'pine' : 'leaf'; else if (R() < 0.05) type = 'leaf'; }
      else { if (f > 0.52 && R() < 0.5) type = 'leaf'; else if (R() < 0.03) type = 'leaf'; }
      if (!type) continue;
      if (nearAirport(x, z) || inTown(x, z) || Math.hypot(x - LAKE.x, z - LAKE.z) < 200) continue;
      lists[type].push([x, h - 0.4, z, 0.7 + R() * 0.7, R() * 6.28]);
    }
    const group = new THREE.Group(); group.visible = false; root.add(group);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new V3(), pv = new V3(), col = new THREE.Color();
    for (const [type, list] of Object.entries(lists)) {
      if (!list.length) continue;
      const im = new THREE.InstancedMesh(treeGeos[type], treeMat, list.length);
      list.forEach(([x, y, z, s, r], i) => {
        q.setFromAxisAngle(new V3(0, 1, 0), r); sc.setScalar(s); pv.set(x, y, z);
        im.setMatrixAt(i, m4.compose(pv, q, sc));
        const snow = type === 'pine' && y > 900 ? 0.3 : 0;
        col.setRGB(0.85 + hash2(i, 1) * 0.3 + snow, 0.85 + hash2(i, 2) * 0.3 + snow, 0.85 + hash2(i, 3) * 0.2 + snow);
        im.setColorAt(i, col);
      });
      im.castShadow = true; im.receiveShadow = true;
      im.computeBoundingSphere();
      group.add(im);
    }
    treeChunks.push({ group, x: cx + TCH / 2, z: cz + TCH / 2 });
  }

  const allLights = lights;
  allLights.forEach(l => root.add(l.obj));

  // ------------------------------------------------------------ per frame
  function update(dt, T, st, cams) {
    const L = st.lightsOn;
    for (const l of allLights) { l.u.amount.value = l.always ? Math.max(0.35, L) : L; l.u.time.value = T; }
    for (const s of spinners) {
      if (s.kind === 'turbine') s.obj.rotation.z += dt * s.speed * (0.5 + st.weather.wind * 0.1);
      if (s.kind === 'ferris') { s.obj.rotation.z += dt * 0.08; s.obj.children.forEach(c => { if (c.userData.cab) c.rotation.z = -s.obj.rotation.z; }); }
      if (s.kind === 'sock') { const w = st.wind; s.obj.rotation.y = Math.atan2(w.x, w.z); s.obj.rotation.x = 0.9 - Math.min(0.85, st.weather.wind * 0.07); }
    }
    swayU.swayT.value = T; swayU.swayW.value = 0.15 + st.weather.wind * 0.06;
    for (const b of beams) { b.obj.rotation.y = T * 0.9; b.mat.opacity = st.night * 0.18 * (1 - st.weather.haze * 0.3); b.obj.visible = st.night > 0.1; }
    // trees near any camera
    for (const c of treeChunks) {
      let d = 1e9; for (const p of cams) d = Math.min(d, Math.hypot(p.x - c.x, p.z - c.z));
      c.group.visible = d < 4200 + 2000 * quality.trees;
    }
  }
  // PAPI colours depend on where the viewer is: 4 white = too high, 4 red = too low, 2 + 2 = just right
  function beforeView(cam) {
    for (const p of papis) {
      const dx = cam.x - p.x, dz = cam.z - p.z, dist = Math.hypot(dx, dz);
      if (dist > 15000) continue;
      const ang = Math.atan2(cam.y - p.y, dist) * 180 / Math.PI;
      const th = [2.5, 2.83, 3.17, 3.5];
      // light 0 is the outermost (furthest from the runway)
      for (let i = 0; i < 4; i++) {
        const white = ang > th[3 - i];
        p.lp.col.set(white ? [1, 1, 1] : [1, 0.1, 0.1], i * 3);
      }
      p.lp.geo.attributes.color.needsUpdate = true;
    }
  }
  return { root, update, beforeView, papis };
}

// ---------------------------------------------------------------- tree shapes (vertex coloured)
function makeTreeGeos() {
  const colorize = (g, c) => {
    const n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const y = g.attributes.position.getY(i); const k = 0.75 + Math.min(0.4, y * 0.02); a.set([c[0] * k, c[1] * k, c[2] * k], i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3));
    return g;
  };
  const merge = gs => {
    const list = gs.map(g => (g.index ? g.toNonIndexed() : g));
    const out = new THREE.BufferGeometry();
    for (const k of ['position', 'normal', 'color']) {
      const tot = list.reduce((s, g) => s + g.attributes[k].array.length, 0), arr = new Float32Array(tot);
      let o = 0; for (const g of list) { arr.set(g.attributes[k].array, o); o += g.attributes[k].array.length; }
      out.setAttribute(k, new THREE.BufferAttribute(arr, 3));
    }
    return out;
  };
  const trunk = (h, r, c = [0.35, 0.24, 0.15]) => colorize(new THREE.CylinderGeometry(r * 0.7, r, h, 6).translate(0, h / 2, 0), c);
  const pine = merge([trunk(4, 0.45), colorize(new THREE.ConeGeometry(4, 8, 8).translate(0, 7, 0), [0.13, 0.3, 0.14]), colorize(new THREE.ConeGeometry(3.2, 7, 8).translate(0, 10.5, 0), [0.15, 0.33, 0.15]), colorize(new THREE.ConeGeometry(2.2, 5.5, 8).translate(0, 14, 0), [0.17, 0.36, 0.16])]);
  const blob = (r, x, y, z, c) => { const g = new THREE.IcosahedronGeometry(r, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const s = 1 + Math.sin(p.getX(i) * 3 + p.getY(i) * 5) * 0.08; p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * 0.85, p.getZ(i) * s); } g.computeVertexNormals(); return colorize(g.translate(x, y, z), c); };
  const leaf = merge([trunk(5, 0.5), blob(4.2, 0, 8, 0, [0.25, 0.45, 0.15]), blob(3, 2, 9.5, 1, [0.28, 0.5, 0.17]), blob(3, -1.8, 9, -1.2, [0.22, 0.42, 0.13])]);
  const palmParts = [];
  for (let i = 0; i < 6; i++) { const t = colorize(new THREE.CylinderGeometry(0.32, 0.4, 1.6, 6), [0.55, 0.42, 0.28]); t.translate(i * 0.12, 0.8 + i * 1.55, 0); palmParts.push(t); }
  for (let i = 0; i < 7; i++) {
    const f = new THREE.BoxGeometry(0.9, 0.08, 5.5).translate(0, 0, 2.8);
    f.rotateX(0.45); f.rotateY(i / 7 * Math.PI * 2); f.translate(0.7, 9.5, 0);
    palmParts.push(colorize(f, [0.2, 0.5, 0.18]));
  }
  const palm = merge(palmParts);
  const cactus = merge([colorize(new THREE.CylinderGeometry(0.55, 0.6, 6, 8).translate(0, 3, 0), [0.25, 0.5, 0.25]), colorize(new THREE.CylinderGeometry(0.35, 0.35, 2, 8).rotateZ(Math.PI / 2).translate(0.9, 2.6, 0), [0.25, 0.5, 0.25]), colorize(new THREE.CylinderGeometry(0.33, 0.33, 2.2, 8).translate(1.8, 3.5, 0), [0.25, 0.5, 0.25]), colorize(new THREE.CylinderGeometry(0.3, 0.3, 1.6, 8).translate(-1.4, 4, 0), [0.25, 0.5, 0.25]), colorize(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 8).rotateZ(Math.PI / 2).translate(-0.8, 3.3, 0), [0.25, 0.5, 0.25])]);
  for (const g of [pine, leaf, palm, cactus]) g.computeVertexNormals();
  return { pine, leaf, palm, cactus };
}
