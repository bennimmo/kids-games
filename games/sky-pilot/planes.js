// Sky Pilot: the aircraft. Numbers for the flight model + 3D models with moving parts.
//
// Model axes: forward = +z, up = +y, left wing = +x. Origin = centre of gravity.
import * as THREE from '../../js/vendor/three.module.min.js';
import { glowTexture } from './sky.js';

const D = Math.PI / 180;

// ---------------------------------------------------------------- flight numbers
// speeds in m/s (1 m/s = 1.94 knots). thrust in newtons.
export const PLANES = {
  cub: {
    name: 'Sky Cub', icon: '🛩️', stars: 1, desc: 'Small and easy',
    kind: 'plane', mass: 1100, wing: 16.2, cla: 5.0, cl0: 0.32, clmax: 1.55, stall: 16 * D, cd0: 0.03, k: 0.055,
    thrust: 3600, vmaxProp: 88, jet: false, rates: [85, 34, 22], vr: 27, vref: 33, vno: 75,
    gear: 'fixed', gearH: 1.25, groundPitch: 0.5 * D, tailStrike: 13 * D, wheelbase: 2.4,
    flaps: [0, 0.22, 0.42, 0.62], flapDrag: [0, 0.006, 0.016, 0.03], maxG: 4.4,
    eye: [0.32, 0.72, 0.65], camDist: 14, length: 8.3, span: 11, panel: 'analog', engine: 'prop', color: 0xe53935,
  },
  splash: {
    name: 'Splash', icon: '🌊', stars: 2, desc: 'Lands on water',
    kind: 'plane', mass: 2300, wing: 23, cla: 5.0, cl0: 0.34, clmax: 1.6, stall: 16 * D, cd0: 0.042, k: 0.055,
    thrust: 7400, vmaxProp: 82, jet: false, rates: [70, 28, 20], vr: 30, vref: 34, vno: 70,
    gear: 'floats', gearH: 2.35, groundPitch: 1.5 * D, tailStrike: 12 * D, wheelbase: 3,
    flaps: [0, 0.25, 0.45, 0.65], flapDrag: [0, 0.008, 0.018, 0.032], maxG: 4,
    eye: [0.38, 1.0, 1.1], camDist: 17, length: 10.5, span: 14.6, panel: 'analog', engine: 'prop', color: 0xffb300,
  },
  jumbo: {
    name: 'Jumbo Jet', icon: '✈️', stars: 3, desc: 'Big passenger jet',
    kind: 'plane', mass: 62000, wing: 122, cla: 5.6, cl0: 0.22, clmax: 1.45, stall: 14 * D, cd0: 0.021, k: 0.045,
    thrust: 240000, jet: true, rates: [32, 11, 7], vr: 72, vref: 70, vno: 175,
    gear: 'retract', gearH: 3.6, groundPitch: 0.2 * D, tailStrike: 11 * D, wheelbase: 12.6,
    flaps: [0, 0.25, 0.5, 0.8, 1.05], flapDrag: [0, 0.006, 0.012, 0.025, 0.045], maxG: 2.5,
    eye: [0.5, 1.95, 16.4], camDist: 60, length: 37.6, span: 34, panel: 'glass', engine: 'jet', color: 0x1e88e5,
  },
  zoom: {
    name: 'Zoom Jet', icon: '🚀', stars: 3, desc: 'Super fast, loops',
    kind: 'plane', mass: 12000, wing: 38, cla: 4.0, cl0: 0.05, clmax: 1.7, stall: 26 * D, cd0: 0.02, k: 0.11,
    thrust: 125000, ab: 1.55, jet: true, rates: [240, 32, 18], vr: 72, vref: 72, vno: 400,
    gear: 'retract', gearH: 1.85, groundPitch: 0, tailStrike: 14 * D, wheelbase: 5.2, hook: true,
    flaps: [0, 0.2, 0.4], flapDrag: [0, 0.01, 0.025], maxG: 9,
    eye: [0, 1.05, 4.1], camDist: 24, length: 15.5, span: 10, panel: 'fighter', engine: 'fighter', color: 0x607d8b,
  },
  whirly: {
    name: 'Whirly', icon: '🚁', stars: 2, desc: 'Helicopter, hovers',
    kind: 'heli', mass: 2400, lift: 2.0, rates: [70, 55, 70], vmax: 72, vr: 0, vref: 0, vno: 70,
    gear: 'skids', gearH: 1.35, groundPitch: 0, tailStrike: 30 * D, wheelbase: 2.5,
    flaps: [0], flapDrag: [0], maxG: 3.5,
    eye: [0.35, 0.95, 1.2], camDist: 20, length: 12, span: 10.6, panel: 'analog', engine: 'heli', color: 0x43a047,
  },
};
export const PLANE_ORDER = ['cub', 'splash', 'whirly', 'jumbo', 'zoom'];

export const LIVERIES = [0xe53935, 0x1e88e5, 0xffb300, 0x43a047, 0x8e24aa, 0xff7043, 0x00acc1, 0xf5f5f5];

// ---------------------------------------------------------------- materials
const matCache = new Map();
export function paint(color, opts = {}) {
  const k = 'p' + color + JSON.stringify(opts);
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshPhysicalMaterial({ color, metalness: 0.25, roughness: 0.38, clearcoat: 0.8, clearcoatRoughness: 0.15, ...opts }));
  return matCache.get(k);
}
const M = {
  get white() { return paint(0xf4f6f8); },
  get grey() { return paint(0x9aa3ab, { metalness: 0.6, roughness: 0.45, clearcoat: 0 }); },
  get dark() { return paint(0x2b2f33, { metalness: 0.3, roughness: 0.6, clearcoat: 0 }); },
  get metal() { return paint(0xc9ced3, { metalness: 0.95, roughness: 0.28, clearcoat: 0 }); },
  get rubber() { return paint(0x1a1a1a, { metalness: 0, roughness: 0.9, clearcoat: 0 }); },
  get glass() { return paint(0x223040, { metalness: 0.9, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0 }); },
  get canopy() { return paint(0x8fb4d8, { metalness: 0.2, roughness: 0.02, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false }); },
  get black() { return paint(0x0c0d0f, { metalness: 0.2, roughness: 0.5, clearcoat: 0 }); },
};

// ---------------------------------------------------------------- shapes
// body of revolution along z: pts = [[radius, z], ...] from nose (high z) to tail
function lathe(pts, seg = 24, sy = 1, sx = 1) {
  const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(Math.max(r, 0.0001), z)), seg);
  g.rotateX(Math.PI / 2);
  // LatheGeometry points go up the y axis; after the turn they run along z
  g.scale(sx, sy, 1);
  g.computeVertexNormals();
  return g;
}
// NACA-ish wing: sections [{ p: [x,y,z] leading edge, c: chord, t: thickness ratio }], vertical = fin
function loft(sections, vertical = false, M2 = 12) {
  const prof = [];
  for (let i = 0; i <= M2; i++) {
    const u = (1 - Math.cos(i / M2 * Math.PI)) / 2;
    const yt = 5 * (0.2969 * Math.sqrt(u) - 0.126 * u - 0.3516 * u * u + 0.2843 * u ** 3 - 0.1036 * u ** 4);
    prof.push([u, yt]);
  }
  const ring = [];
  for (let i = M2; i >= 0; i--) ring.push([prof[i][0], prof[i][1]]);       // upper, TE -> LE
  for (let i = 1; i <= M2; i++) ring.push([prof[i][0], -prof[i][1]]);      // lower, LE -> TE
  const R = ring.length, pos = [], idx = [];
  for (const s of sections) {
    for (const [u, yt] of ring) {
      const th = yt * s.t * s.c, along = -u * s.c;
      if (vertical) pos.push(s.p[0] + th, s.p[1], s.p[2] + along);
      else pos.push(s.p[0], s.p[1] + th + (s.camber || 0) * Math.sin(u * Math.PI) * s.c, s.p[2] + along);
    }
  }
  for (let k = 0; k < sections.length - 1; k++) for (let i = 0; i < R - 1; i++) {
    const a = k * R + i, b = a + 1, c = a + R, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  // caps
  for (const k of [0, sections.length - 1]) {
    const base = pos.length / 3, s = sections[k];
    pos.push(vertical ? s.p[0] : s.p[0], s.p[1], s.p[2] - s.c * 0.35);
    for (let i = 0; i < R - 1; i++) { if (k === 0) idx.push(base, k * R + i, k * R + i + 1); else idx.push(base, k * R + i + 1, k * R + i); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; return o; };
const cyl = (r1, r2, h, seg = 16) => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); g.rotateX(Math.PI / 2); return g; };
// a pivot for a moving part (hinge line along axis through point)
function pivot(parent, x, y, z) { const p = new THREE.Group(); p.position.set(x, y, z); parent.add(p); return p; }

function wheel(r, w, parent, x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const tyre = mesh(new THREE.TorusGeometry(r * 0.72, r * 0.3, 10, 20), M.rubber); tyre.rotation.y = Math.PI / 2; tyre.scale.z = w / (r * 0.6);
  const hub = mesh(new THREE.CylinderGeometry(r * 0.48, r * 0.48, w * 0.9, 14), M.metal); hub.rotation.z = Math.PI / 2;
  g.add(tyre, hub); parent.add(g); return g;
}

// window strip texture for the airliner
function windowTexture(color) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f6f8'; g.fillRect(0, 0, 1024, 128);
  g.fillStyle = '#' + new THREE.Color(color).getHexString(); g.fillRect(0, 88, 1024, 16);
  g.fillStyle = '#1b2633';
  for (let x = 30; x < 1000; x += 18) { g.beginPath(); g.roundRect(x, 50, 9, 14, 4); g.fill(); }
  // cockpit windscreen (near the nose end of the strip)
  g.fillStyle = '#1b2633';
  g.beginPath(); g.moveTo(16, 22); g.lineTo(44, 18); g.lineTo(46, 36); g.lineTo(18, 40); g.fill();
  g.beginPath(); g.moveTo(48, 18); g.lineTo(64, 20); g.lineTo(64, 36); g.lineTo(50, 36); g.fill();
  g.fillRect(70, 40, 18, 46); g.fillRect(900, 40, 18, 46); // doors
  g.fillStyle = '#f4f6f8'; g.fillRect(72, 42, 14, 42); g.fillRect(902, 42, 14, 42);
  g.strokeStyle = '#9aa'; g.lineWidth = 2; g.strokeRect(70, 40, 18, 46); g.strokeRect(900, 40, 18, 46);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// ---------------------------------------------------------------- lights on the plane
let GLOW = null;
const glowMat = (color, size) => {
  GLOW = GLOW || glowTexture();
  return new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
};
function navLight(parent, color, x, y, z, size = 1.2) {
  const s = new THREE.Sprite(glowMat(color)); s.position.set(x, y, z); s.scale.setScalar(size);
  parent.add(s); return s;
}

// ---------------------------------------------------------------- build one plane
// returns { group, body (hidden in own cockpit view), parts, update(st, dt) }
export function buildPlane(type, color = PLANES[type].color) {
  const P = PLANES[type];
  const root = new THREE.Group();          // the whole aircraft
  const body = new THREE.Group();          // fuselage etc. (hidden in cockpit view)
  const outer = new THREE.Group();         // wings etc. (seen from inside too)
  root.add(body, outer);
  const parts = { props: [], ailL: null, ailR: null, elev: null, rudder: null, flapL: null, flapR: null, gear: [], gearDoors: [], lights: {}, flame: null, rotor: null, tailRotor: null, smoke: new THREE.Vector3(0, 0, -P.length / 2) };
  const C = paint(color), W = M.white;
  const accent = paint(new THREE.Color(color).offsetHSL(0, 0, -0.18).getHex());

  if (type === 'cub') {
    body.add(mesh(lathe([[0.001, 3.5], [0.22, 3.42], [0.42, 3.2], [0.55, 2.9], [0.6, 2.4], [0.62, 1.6], [0.62, 0.4], [0.58, -0.4], [0.42, -2.2], [0.22, -4.2], [0.08, -4.9], [0.001, -5]], 24, 1.25, 0.92), W));
    // stripe + cabin
    body.add(mesh(lathe([[0.63, 2.2], [0.64, 1.6], [0.64, 0.4], [0.6, -0.4], [0.44, -2.2], [0.24, -4.2]], 24, 0.5, 0.94), C, 0, -0.25, 0));
    const cab = mesh(new THREE.SphereGeometry(0.66, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.glass, 0, 0.52, 0.65); cab.scale.set(0.95, 0.75, 1.7); body.add(cab);
    // high wing with struts
    const ws = [{ p: [5.5, 1.35, 1.0], c: 1.35, t: 0.13 }, { p: [0.6, 1.4, 1.0], c: 1.5, t: 0.14 }, { p: [-0.6, 1.4, 1.0], c: 1.5, t: 0.14 }, { p: [-5.5, 1.35, 1.0], c: 1.35, t: 0.13 }];
    outer.add(mesh(loft(ws), W));
    outer.add(mesh(loft([{ p: [5.52, 1.34, 1.0], c: 1.35, t: 0.13 }, { p: [5.6, 1.34, 1.0], c: 1.35, t: 0.13 }]), C));
    outer.add(mesh(loft([{ p: [-5.52, 1.34, 1.0], c: 1.35, t: 0.13 }, { p: [-5.6, 1.34, 1.0], c: 1.35, t: 0.13 }]), C));
    for (const s of [1, -1]) {
      const st = mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.3, 6), M.metal, s * 1.7, 0.5, 0.4);
      st.rotation.z = s * 1.05; outer.add(st);
    }
    parts.ailL = pivot(outer, 4.1, 1.38, -0.42); parts.ailL.add(mesh(new THREE.BoxGeometry(2.6, 0.06, 0.4), C, 0, 0, -0.2));
    parts.ailR = pivot(outer, -4.1, 1.38, -0.42); parts.ailR.add(mesh(new THREE.BoxGeometry(2.6, 0.06, 0.4), C, 0, 0, -0.2));
    parts.flapL = pivot(outer, 1.9, 1.36, -0.45); parts.flapL.add(mesh(new THREE.BoxGeometry(2.4, 0.06, 0.42), W, 0, 0, -0.21));
    parts.flapR = pivot(outer, -1.9, 1.36, -0.45); parts.flapR.add(mesh(new THREE.BoxGeometry(2.4, 0.06, 0.42), W, 0, 0, -0.21));
    // tail
    outer.add(mesh(loft([{ p: [1.7, 0.15, -3.9], c: 0.8, t: 0.1 }, { p: [0, 0.15, -3.8], c: 1.0, t: 0.1 }, { p: [-1.7, 0.15, -3.9], c: 0.8, t: 0.1 }]), W));
    parts.elev = pivot(outer, 0, 0.15, -4.75); parts.elev.add(mesh(new THREE.BoxGeometry(3.3, 0.05, 0.45), C, 0, 0, -0.22));
    body.add(mesh(loft([{ p: [0, 0.3, -3.6], c: 1.3, t: 0.1 }, { p: [0, 1.5, -4.3], c: 0.7, t: 0.1 }], true), C));
    parts.rudder = pivot(outer, 0, 0.3, -4.85); parts.rudder.add(mesh(new THREE.BoxGeometry(0.06, 1.3, 0.4), C, 0, 0.6, -0.2));
    // engine + prop
    const prop = pivot(body, 0, 0, 3.52);
    prop.add(mesh(new THREE.ConeGeometry(0.22, 0.45, 16).rotateX(Math.PI / 2), M.white, 0, 0, 0.1));
    for (const a of [0, Math.PI]) { const b = mesh(new THREE.BoxGeometry(0.14, 0.9, 0.03), M.black, 0, 0, 0); b.position.set(Math.sin(a) * 0.45, Math.cos(a) * 0.45, 0); b.rotation.z = -a; b.rotation.y = 0.25; prop.add(b); }
    parts.props.push(prop);
    // fixed gear with wheel pants
    const g = new THREE.Group(); body.add(g);
    const nose = new THREE.Group(); nose.position.set(0, -0.6, 2.4); g.add(nose); parts.noseGear = nose;
    nose.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6), M.metal, 0, -0.2, 0)); wheel(0.22, 0.12, nose, 0, -0.43, 0);
    for (const s of [1, -1]) {
      const leg = mesh(new THREE.BoxGeometry(0.08, 0.05, 1.4), M.white, s * 0.7, -0.75, 0); leg.rotation.z = s * -0.55; leg.rotation.y = Math.PI / 2; g.add(leg);
      wheel(0.26, 0.15, g, s * 1.15, -0.99, -0.1);
      const pant = mesh(new THREE.SphereGeometry(0.3, 12, 8), C, s * 1.15, -0.95, -0.1); pant.scale.set(0.45, 0.8, 1.6); g.add(pant);
    }
    parts.lights = { left: [3, 1.4, 0.4], right: [-3, 1.4, 0.4], wingL: [5.6, 1.38, 0.4], wingR: [-5.6, 1.38, 0.4], tail: [0, 1.6, -4.7], beacon: [0, 1.55, -4.1], land: [0, -0.3, 3] };
  }

  if (type === 'splash') {
    body.add(mesh(lathe([[0.001, 3.9], [0.55, 3.8], [0.75, 3.5], [0.78, 3.0], [0.8, 2.0], [0.8, 0.5], [0.72, -1.5], [0.45, -4.0], [0.18, -6.2], [0.001, -6.5]], 24, 1.25, 0.95), C));
    body.add(mesh(lathe([[0.79, 3.0], [0.81, 2.0], [0.81, 0.5], [0.73, -1.5], [0.46, -4.0]], 24, 0.4, 0.96), W, 0, -0.38, 0));
    const cab = mesh(new THREE.SphereGeometry(0.8, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.glass, 0, 0.62, 1.0); cab.scale.set(0.95, 0.65, 1.9); body.add(cab);
    // radial engine cowl
    body.add(mesh(cyl(0.82, 0.8, 0.9, 20), M.dark, 0, 0, 3.4));
    const ws = [{ p: [7.3, 1.55, 1.4], c: 1.7, t: 0.13 }, { p: [0.7, 1.62, 1.4], c: 1.9, t: 0.14 }, { p: [-0.7, 1.62, 1.4], c: 1.9, t: 0.14 }, { p: [-7.3, 1.55, 1.4], c: 1.7, t: 0.13 }];
    outer.add(mesh(loft(ws), C));
    for (const s of [1, -1]) { const st = mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.9, 6), M.metal, s * 2.1, 0.55, 0.7); st.rotation.z = s * 1.05; outer.add(st); }
    parts.ailL = pivot(outer, 5.6, 1.58, -0.35); parts.ailL.add(mesh(new THREE.BoxGeometry(3, 0.07, 0.5), W, 0, 0, -0.25));
    parts.ailR = pivot(outer, -5.6, 1.58, -0.35); parts.ailR.add(mesh(new THREE.BoxGeometry(3, 0.07, 0.5), W, 0, 0, -0.25));
    parts.flapL = pivot(outer, 2.4, 1.6, -0.38); parts.flapL.add(mesh(new THREE.BoxGeometry(3.2, 0.07, 0.5), C, 0, 0, -0.25));
    parts.flapR = pivot(outer, -2.4, 1.6, -0.38); parts.flapR.add(mesh(new THREE.BoxGeometry(3.2, 0.07, 0.5), C, 0, 0, -0.25));
    outer.add(mesh(loft([{ p: [2.4, 0.25, -5.0], c: 1.0, t: 0.1 }, { p: [0, 0.25, -4.8], c: 1.3, t: 0.1 }, { p: [-2.4, 0.25, -5.0], c: 1.0, t: 0.1 }]), C));
    parts.elev = pivot(outer, 0, 0.25, -6.1); parts.elev.add(mesh(new THREE.BoxGeometry(4.6, 0.06, 0.55), W, 0, 0, -0.27));
    body.add(mesh(loft([{ p: [0, 0.4, -4.5], c: 1.8, t: 0.1 }, { p: [0, 2.2, -5.6], c: 0.9, t: 0.1 }], true), W));
    parts.rudder = pivot(outer, 0, 0.4, -6.3); parts.rudder.add(mesh(new THREE.BoxGeometry(0.07, 1.8, 0.5), C, 0, 0.85, -0.25));
    const prop = pivot(body, 0, 0, 3.95);
    prop.add(mesh(new THREE.ConeGeometry(0.3, 0.5, 16).rotateX(Math.PI / 2), C, 0, 0, 0.15));
    for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; const b = mesh(new THREE.BoxGeometry(0.18, 1.2, 0.04), M.black); b.position.set(Math.sin(a) * 0.6, Math.cos(a) * 0.6, 0); b.rotation.z = -a; b.rotation.y = 0.3; prop.add(b); }
    parts.props.push(prop);
    // floats
    const g = new THREE.Group(); outer.add(g);
    for (const s of [1, -1]) {
      g.add(mesh(lathe([[0.001, 4.6], [0.2, 4.4], [0.38, 3.8], [0.42, 2.5], [0.42, 0], [0.35, -2.2], [0.12, -3.8], [0.001, -4.0]], 16, 0.9, 1), W, s * 1.4, -1.95, 0.3));
      g.add(mesh(lathe([[0.43, 2.5], [0.43, 0], [0.36, -2.2]], 16, 0.35, 1.01), C, s * 1.4, -2.15, 0.3));
      for (const z of [1.4, -0.6]) { const st = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.75, 6), M.metal, s * 1.05, -1.0, z); st.rotation.z = s * 0.35; g.add(st); }
    }
    parts.lights = { left: [3, 1.6, 0.6], right: [-3, 1.6, 0.6], wingL: [7.4, 1.58, 0.6], wingR: [-7.4, 1.58, 0.6], tail: [0, 2.3, -5.9], beacon: [0, 1.0, -1.0], land: [0, -0.4, 3.4] };
  }

  if (type === 'jumbo') {
    const tex = windowTexture(color);
    const fus = lathe([[0.001, 18.8], [0.6, 18.6], [1.25, 18.0], [1.7, 17.0], [1.95, 15.5], [2.0, 13], [2.0, -8], [1.9, -11], [1.5, -14.5], [0.9, -17.5], [0.3, -18.8], [0.001, -18.9]], 32, 1.05, 1);
    // map the window strip along the side
    const uv = fus.attributes.uv, p = fus.attributes.position;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (18.8 - p.getZ(i)) / 37.7, (p.getY(i) / 2.1) * 0.5 + 0.5);
    const fm = new THREE.MeshPhysicalMaterial({ map: tex, metalness: 0.25, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15 });
    body.add(mesh(fus, fm));
    body.add(mesh(lathe([[2.02, 12], [2.02, -8], [1.92, -11]], 32, 0.55, 1.01), M.grey, 0, -0.95, 0)); // grey belly
    // cockpit windows
    // swept wing, low, with dihedral
    const wsec = [{ p: [17, 0.4, -5.6], c: 1.6, t: 0.1 }, { p: [6, -0.75, 0.6], c: 4.6, t: 0.12 }, { p: [1.8, -1.15, 3.2], c: 7.2, t: 0.14 }, { p: [-1.8, -1.15, 3.2], c: 7.2, t: 0.14 }, { p: [-6, -0.75, 0.6], c: 4.6, t: 0.12 }, { p: [-17, 0.4, -5.6], c: 1.6, t: 0.1 }];
    outer.add(mesh(loft(wsec), M.grey));
    // winglets
    for (const s of [1, -1]) outer.add(mesh(loft([{ p: [s * 17, 0.4, -5.5], c: 1.6, t: 0.08 }, { p: [s * 17.25, 2.6, -7.0], c: 0.8, t: 0.08 }], true), C));
    parts.ailL = pivot(outer, 13.5, 0.15, -5.0); parts.ailL.add(mesh(new THREE.BoxGeometry(4, 0.1, 0.7), M.grey, 0, 0, -0.35)); parts.ailL.rotation.y = -0.47;
    parts.ailR = pivot(outer, -13.5, 0.15, -5.0); parts.ailR.add(mesh(new THREE.BoxGeometry(4, 0.1, 0.7), M.grey, 0, 0, -0.35)); parts.ailR.rotation.y = 0.47;
    parts.flapL = pivot(outer, 6.5, -0.75, -3.6); parts.flapL.add(mesh(new THREE.BoxGeometry(8, 0.12, 1.3), M.grey, 0, 0, -0.65)); parts.flapL.rotation.y = -0.3;
    parts.flapR = pivot(outer, -6.5, -0.75, -3.6); parts.flapR.add(mesh(new THREE.BoxGeometry(8, 0.12, 1.3), M.grey, 0, 0, -0.65)); parts.flapR.rotation.y = 0.3;
    // engines
    for (const s of [1, -1]) {
      const e = new THREE.Group(); e.position.set(s * 5.8, -2.0, 3.6); outer.add(e);
      e.add(mesh(lathe([[1.08, 2.0], [1.22, 1.6], [1.25, 0.4], [1.1, -1.4], [0.7, -2.2]], 24), C));
      e.add(mesh(new THREE.CircleGeometry(1.0, 24), M.dark, 0, 0, 1.85));
      e.add(mesh(new THREE.ConeGeometry(0.32, 0.7, 16).rotateX(Math.PI / 2), M.metal, 0, 0, 1.95));
      e.add(mesh(cyl(0.6, 0.35, 0.9, 16), M.grey, 0, 0, -2.5));
      const fan = pivot(e, 0, 0, 1.88);
      for (let i = 0; i < 12; i++) { const b = mesh(new THREE.BoxGeometry(0.16, 0.85, 0.02), M.metal); b.position.set(Math.sin(i / 12 * 6.283) * 0.55, Math.cos(i / 12 * 6.283) * 0.55, 0); b.rotation.z = -i / 12 * 6.283; b.rotation.y = 0.5; fan.add(b); }
      parts.props.push(fan);
      const py = mesh(new THREE.BoxGeometry(0.35, 1.0, 3.2), M.grey, s * 5.8, -1.3, 3.0); outer.add(py);
    }
    // tail
    body.add(mesh(loft([{ p: [0, 1.6, -11.8], c: 6.0, t: 0.1 }, { p: [0, 8.3, -16.8], c: 2.6, t: 0.1 }], true), C));
    parts.rudder = pivot(outer, 0, 1.9, -17.3); parts.rudder.add(mesh(new THREE.BoxGeometry(0.14, 6.0, 1.0), C, 0, 3.0, -0.45)); parts.rudder.rotation.x = -0.235;
    outer.add(mesh(loft([{ p: [6.2, 1.4, -16.0], c: 1.6, t: 0.09 }, { p: [0, 1.0, -13.0], c: 3.8, t: 0.1 }, { p: [-6.2, 1.4, -16.0], c: 1.6, t: 0.09 }]), M.grey));
    parts.elev = pivot(outer, 0, 1.1, -16.9); parts.elev.add(mesh(new THREE.BoxGeometry(10, 0.1, 0.9), M.grey, 0, 0, -0.4));
    // retractable gear
    const ng = pivot(body, 0, -1.4, 13.8); parts.gear.push({ g: ng, axis: 'x', up: -1.6 }); parts.noseGear = ng;
    ng.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.0, 8), M.metal, 0, -0.9, 0));
    wheel(0.48, 0.3, ng, 0.28, -1.75, 0); wheel(0.48, 0.3, ng, -0.28, -1.75, 0);
    for (const s of [1, -1]) {
      const mg = pivot(outer, s * 3.4, -1.3, 0.6); parts.gear.push({ g: mg, axis: 'z', up: s * 1.5 });
      mg.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.2, 8), M.metal, 0, -1.0, 0));
      wheel(0.62, 0.4, mg, 0.35, -1.85, 0.55); wheel(0.62, 0.4, mg, -0.35, -1.85, 0.55);
      wheel(0.62, 0.4, mg, 0.35, -1.85, -0.75); wheel(0.62, 0.4, mg, -0.35, -1.85, -0.75);
    }
    parts.lights = { left: [3, 0, 3], right: [-3, 0, 3], wingL: [17.1, 0.45, -6.2], wingR: [-17.1, 0.45, -6.2], tail: [0, 1.0, -18.9], beacon: [0, 2.15, 2], beacon2: [0, -2.2, 2], land: [0, -1.5, 13.5] };
    parts.smoke.set(0, 0, -18.5);
  }

  if (type === 'zoom') {
    body.add(mesh(lathe([[0.001, 8.3], [0.18, 7.8], [0.42, 6.6], [0.7, 5.0], [0.9, 3.4], [1.0, 1.0], [1.05, -3.0], [0.95, -5.6], [0.72, -6.9], [0.66, -7.2]], 24, 0.9, 1.15), C));
    // intakes
    for (const s of [1, -1]) body.add(mesh(new THREE.BoxGeometry(0.55, 0.8, 4.2), accent, s * 1.05, -0.15, 0.6));
    const can = mesh(new THREE.SphereGeometry(0.62, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.canopy, 0, 0.62, 3.8); can.scale.set(0.9, 0.95, 2.6); body.add(can); parts.canopy = can;
    const canFrame = mesh(new THREE.TorusGeometry(0.56, 0.035, 6, 24, Math.PI), M.dark, 0, 0.62, 3.1); canFrame.scale.set(1, 1, 1); body.add(canFrame);
    // delta-ish wings
    const ws = [{ p: [5.0, 0.0, -3.3], c: 1.6, t: 0.05 }, { p: [1.0, 0.05, 1.8], c: 7.0, t: 0.06 }, { p: [-1.0, 0.05, 1.8], c: 7.0, t: 0.06 }, { p: [-5.0, 0.0, -3.3], c: 1.6, t: 0.05 }];
    outer.add(mesh(loft(ws), C));
    for (const s of [1, -1]) outer.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 3, 8).rotateX(Math.PI / 2), M.grey, s * 5.05, 0, -3.2)); // wingtip rails
    parts.ailL = pivot(outer, 3.6, 0.0, -4.7); parts.ailL.add(mesh(new THREE.BoxGeometry(2.4, 0.06, 0.55), accent, 0, 0, -0.27));
    parts.ailR = pivot(outer, -3.6, 0.0, -4.7); parts.ailR.add(mesh(new THREE.BoxGeometry(2.4, 0.06, 0.55), accent, 0, 0, -0.27));
    parts.flapL = pivot(outer, 1.7, 0.0, -4.9); parts.flapL.add(mesh(new THREE.BoxGeometry(1.6, 0.06, 0.6), accent, 0, 0, -0.3));
    parts.flapR = pivot(outer, -1.7, 0.0, -4.9); parts.flapR.add(mesh(new THREE.BoxGeometry(1.6, 0.06, 0.6), accent, 0, 0, -0.3));
    // tail planes
    parts.elev = pivot(outer, 0, 0, -5.6);
    parts.elev.add(mesh(loft([{ p: [3.0, 0, -1.3], c: 1.0, t: 0.05 }, { p: [0.8, 0, 0.4], c: 2.6, t: 0.05 }, { p: [-0.8, 0, 0.4], c: 2.6, t: 0.05 }, { p: [-3.0, 0, -1.3], c: 1.0, t: 0.05 }]), C));
    body.add(mesh(loft([{ p: [0, 0.8, -2.6], c: 4.2, t: 0.06 }, { p: [0, 4.2, -6.4], c: 1.4, t: 0.06 }], true), C));
    parts.rudder = pivot(outer, 0, 1.0, -6.45); parts.rudder.add(mesh(new THREE.BoxGeometry(0.07, 2.8, 0.6), accent, 0, 1.5, -0.28)); parts.rudder.rotation.x = -0.29;
    // nozzle + afterburner
    body.add(mesh(cyl(0.68, 0.6, 1.0, 20), M.dark, 0, 0, -7.6));
    const flame = new THREE.Group(); flame.position.set(0, 0, -8.1); body.add(flame);
    const fm1 = new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const fm2 = new THREE.MeshBasicMaterial({ color: 0x80b0ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const f1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 4, 16, 1, true).rotateX(-Math.PI / 2), fm1); f1.position.z = -2;
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2, 16, 1, true).rotateX(-Math.PI / 2), fm2); f2.position.z = -1;
    flame.add(f1, f2); flame.visible = false; parts.flame = flame;
    // gear
    const ng = pivot(body, 0, -0.7, 4.4); parts.gear.push({ g: ng, axis: 'x', up: -1.7 }); parts.noseGear = ng;
    ng.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 8), M.metal, 0, -0.5, 0)); wheel(0.3, 0.18, ng, 0, -1.0, 0);
    for (const s of [1, -1]) {
      const mg = pivot(outer, s * 1.5, -0.6, -0.8); parts.gear.push({ g: mg, axis: 'z', up: s * 1.6 });
      mg.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), M.metal, 0, -0.5, 0)); wheel(0.36, 0.22, mg, 0, -0.98, 0);
    }
    const hook = pivot(body, 0, -0.6, -6.0); hook.add(mesh(new THREE.BoxGeometry(0.08, 0.08, 1.8), M.dark, 0, 0, -0.9)); parts.hook = hook;
    parts.lights = { left: [2, 0, 0], right: [-2, 0, 0], wingL: [5.05, 0.1, -3.2], wingR: [-5.05, 0.1, -3.2], tail: [0, 4.3, -6.6], beacon: [0, -0.9, 0], land: [0, -1.0, 4.4] };
    parts.smoke.set(0, 0, -8);
  }

  if (type === 'whirly') {
    const cab = mesh(new THREE.SphereGeometry(1.25, 28, 18), C, 0, 0.3, 0.2); cab.scale.set(0.95, 1, 1.55); body.add(cab);
    const bub = mesh(new THREE.SphereGeometry(1.27, 28, 14, -1.2, 2.4, 0.35, 1.25), M.glass, 0, 0.3, 0.25); bub.scale.set(0.96, 1.01, 1.56); body.add(bub);
    body.add(mesh(lathe([[0.55, -1.2], [0.42, -3], [0.2, -6.4], [0.15, -6.8]], 16, 1.2), C, 0, 0.55, 0));
    body.add(mesh(new THREE.BoxGeometry(1.1, 0.45, 1.6), M.grey, 0, 1.55, -0.6)); // engine
    body.add(mesh(loft([{ p: [0, 0.6, -6.0], c: 1.0, t: 0.12 }, { p: [0, 2.2, -6.9], c: 0.6, t: 0.12 }], true), C));
    outer.add(mesh(loft([{ p: [1.0, 0.75, -5.4], c: 0.6, t: 0.1 }, { p: [-1.0, 0.75, -5.4], c: 0.6, t: 0.1 }]), C));
    // skids
    for (const s of [1, -1]) {
      const sk = mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 8), M.metal, s * 1.05, -1.3, 0.1); sk.rotation.x = Math.PI / 2; outer.add(sk);
      for (const z of [1.0, -0.8]) { const st = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 6), M.metal, s * 0.85, -0.8, z); st.rotation.z = s * 0.4; outer.add(st); }
    }
    // rotor
    const mast = pivot(outer, 0, 2.05, -0.2);
    mast.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.5, 10), M.metal, 0, -0.1, 0));
    const rotor = new THREE.Group(); mast.add(rotor);
    for (let i = 0; i < 4; i++) { const b = mesh(new THREE.BoxGeometry(0.28, 0.05, 5.2), M.dark); b.position.set(Math.sin(i * Math.PI / 2) * 2.7, 0.12, Math.cos(i * Math.PI / 2) * 2.7); b.rotation.y = i * Math.PI / 2; rotor.add(b); }
    const disc = new THREE.Mesh(new THREE.CircleGeometry(5.3, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide }));
    disc.position.y = 0.12; mast.add(disc); parts.disc = disc;
    parts.rotor = rotor;
    const tr = pivot(body, 0.25, 1.75, -6.75); parts.tailRotor = tr;
    for (let i = 0; i < 2; i++) { const b = mesh(new THREE.BoxGeometry(0.03, 1.3, 0.15), M.dark); b.rotation.x = i * Math.PI / 2; tr.add(b); }
    parts.lights = { left: [1.1, 0.4, 0.2], right: [-1.1, 0.4, 0.2], wingL: [1.0, 0.75, -5.4], wingR: [-1.0, 0.75, -5.4], tail: [0, 2.25, -6.9], beacon: [0, 1.8, -1.2], land: [0, -0.7, 1.6] };
    parts.smoke.set(0, 0.5, -6.5);
  }

  // nav lights (red left, green right, white tail), strobes, beacon
  const L = parts.lights;
  parts.nav = [
    navLight(outer, 0xff2020, ...L.wingL, P.length > 20 ? 2.2 : 1.4),
    navLight(outer, 0x20ff40, ...L.wingR, P.length > 20 ? 2.2 : 1.4),
    navLight(outer, 0xffffff, ...L.tail, 1.2),
  ];
  parts.strobes = [navLight(outer, 0xffffff, ...L.wingL, 5), navLight(outer, 0xffffff, ...L.wingR, 5)];
  parts.beacons = [navLight(outer, 0xff3020, ...L.beacon, 2.2)];
  if (L.beacon2) parts.beacons.push(navLight(outer, 0xff3020, ...L.beacon2, 2.2));
  parts.landGlow = navLight(outer, 0xfff4d0, ...L.land, P.length > 20 ? 5 : 2.5);
  parts.smokeAt = parts.smoke;

  root.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  parts.nav.concat(parts.strobes, parts.beacons, [parts.landGlow]).forEach(s => { s.castShadow = false; });

  return { group: root, body, outer, parts, type, color };
}

// animate the moving parts. st = { roll, pitch, yaw (inputs -1..1), flaps (0..1), gear (0 up..1 down), rpm (0..1), lights, t, ab }
export function animatePlane(pl, st, dt) {
  const p = pl.parts, P = PLANES[pl.type];
  const sp = st.rpm;
  for (const pr of p.props) pr.rotation.z -= dt * (8 + sp * 60);
  if (p.ailL) { p.ailL.rotation.x = st.roll * 0.35; p.ailR.rotation.x = -st.roll * 0.35; }
  if (p.elev) p.elev.rotation.x = -st.pitch * 0.35;
  if (p.rudder) p.rudder.rotation.y = -st.yaw * 0.4;
  if (p.flapL) { p.flapL.rotation.x = st.flaps * 0.6; p.flapR.rotation.x = st.flaps * 0.6; }
  for (const gr of p.gear) {
    const a = (1 - st.gear) * gr.up;
    gr.g.rotation.set(gr.axis === 'x' ? a : 0, 0, gr.axis === 'z' ? a : 0);
    gr.g.visible = st.gear > 0.02;
  }
  if (p.noseGear && st.steer !== undefined && P.gear !== 'retract') p.noseGear.rotation.y = st.steer * 0.5;
  if (p.hook) p.hook.rotation.x = st.gear > 0.5 ? 0.5 : 0;
  if (p.flame) {
    const on = st.ab > 0.01;
    p.flame.visible = on;
    if (on) { const s = 0.5 + st.ab * 0.8 + Math.random() * 0.12; p.flame.scale.set(s * 0.9 + 0.2, s * 0.9 + 0.2, s); }
  }
  if (p.rotor) {
    p.rotor.rotation.y += dt * (4 + sp * 38);
    p.tailRotor.rotation.x += dt * (10 + sp * 80);
    p.disc.material.opacity = sp > 0.3 ? 0.18 : 0;
    if (sp > 0.7) p.rotor.visible = Math.random() > 0.15;
    else p.rotor.visible = true;
  }
  // lights: nav steady, strobes double-flash, beacon pulse
  const on = st.lights;
  const t = st.t;
  p.nav.forEach(s => { s.visible = on; });
  const sf = (t % 1.2);
  p.strobes.forEach(s => { s.visible = on && (sf < 0.05 || (sf > 0.14 && sf < 0.19)); });
  const bf = (t * 1.1) % 1;
  p.beacons.forEach(s => { s.visible = on; s.material.opacity = Math.max(0, Math.sin(bf * Math.PI * 2)); });
  p.landGlow.visible = on && st.landLight;
}
