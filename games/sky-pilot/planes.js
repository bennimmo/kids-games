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
    thrust: 3600, vmaxProp: 88, jet: false, rates: [90, 40, 24], vr: 27, vref: 33, vno: 75,
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
    thrust: 240000, jet: true, rates: [40, 17, 9], vr: 72, vref: 70, vno: 175,
    gear: 'retract', gearH: 3.6, groundPitch: 0.2 * D, tailStrike: 11 * D, wheelbase: 12.6,
    flaps: [0, 0.25, 0.5, 0.8, 1.05], flapDrag: [0, 0.006, 0.012, 0.025, 0.045], maxG: 3,
    eye: [0.5, 1.95, 16.4], camDist: 60, length: 37.6, span: 34, panel: 'glass', engine: 'jet', color: 0x1e88e5,
  },
  zoom: {
    name: 'Zoom Jet', icon: '🚀', stars: 3, desc: 'Super fast, loops',
    kind: 'plane', mass: 12000, wing: 38, cla: 4.6, cl0: 0.05, clmax: 1.7, stall: 26 * D, cd0: 0.02, k: 0.11,
    thrust: 125000, ab: 1.55, jet: true, rates: [260, 55, 22], agile: 0.55, aerobatic: true, vr: 72, vref: 72, vno: 400,
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
  // a giant paper plane: no engine, it glides. Boost (Space / 🚀) runs out and refills.
  paper: {
    name: 'Paper Plane', icon: '📄', stars: 1, desc: 'No engine, glides',
    kind: 'paper', mass: 40, rates: [90, 60, 30], vstall: 11, vtrim: 22, drag: 0.0025, boost: 8, vr: 0, vref: 25, vno: 70,
    gear: 'none', gearH: 0.35, groundPitch: 0, tailStrike: 30 * D, wheelbase: 1,
    flaps: [0], flapDrag: [0], maxG: 6,
    eye: [0, 0.55, 1.6], camDist: 12, length: 5.6, span: 5.2, panel: 'none', engine: 'paper', color: 0xffffff,
  },
};
export const PLANE_ORDER = ['cub', 'splash', 'whirly', 'jumbo', 'zoom', 'paper'];

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
  get glass() { return paint(0x0e1724, { metalness: 0.4, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.55 }); },
  get glassT() { return paint(0x1c2c3c, { metalness: 0.3, roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1, clearcoatRoughness: 0, depthWrite: false, envMapIntensity: 0.9 }); },
  get canopy() { return paint(0x8fb4d8, { metalness: 0.2, roughness: 0.02, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false }); },
  get black() { return paint(0x0c0d0f, { metalness: 0.2, roughness: 0.5, clearcoat: 0 }); },
};

// ---------------------------------------------------------------- shapes
// body of revolution along z: pts = [[radius, z], ...] from nose (high z) to tail
function lathe(pts, seg = 24, sy = 1, sx = 1) {
  // points go tail -> nose so the faces point outwards
  const g = new THREE.LatheGeometry(pts.slice().reverse().map(([r, z]) => new THREE.Vector2(Math.max(r, 0.0001), z)), seg);
  g.rotateX(Math.PI / 2);
  // LatheGeometry points go up the y axis; after the turn they run along z
  g.scale(sx, sy, 1);
  g.computeVertexNormals();
  return g;
}
// a piece of the body's skin (between two angles round it), used for windows that follow the body shape.
// angle 0 = bottom, PI = top, PI/2 = left side
function skin(pts, a0, a1, sy = 1, sx = 1, grow = 1.025, seg = 12) {
  const g = new THREE.LatheGeometry(pts.slice().reverse().map(([r, z]) => new THREE.Vector2(r * grow, z)), seg, a0, a1 - a0);
  g.rotateX(Math.PI / 2);
  g.scale(sx, sy, 1);
  g.computeVertexNormals();
  return g;
}
// body with openings for windows: cuts = [{ from: z, to: z, holes: [[a0, a1], ...] }] (angles as in skin())
function bodyWithHoles(pts, cuts, sy, sx, seg = 32) {
  const zs = new Set(pts.map(p => p[1]));
  for (const c of cuts) { zs.add(c.from); zs.add(c.to); }
  const rAt = z => { for (let i = 0; i < pts.length - 1; i++) { const [r0, z0] = pts[i], [r1, z1] = pts[i + 1]; if (z <= z0 && z >= z1) return r0 + (r1 - r0) * (z0 - z) / ((z0 - z1) || 1); } return 0.001; };
  const all = [...zs].sort((a, b) => b - a).map(z => [rAt(z), z]);
  const out = [];
  let i = 0;
  while (i < all.length - 1) {
    const zMid = (all[i][1] + all[i + 1][1]) / 2;
    const cut = cuts.find(c => zMid < c.from && zMid > c.to);
    let j = i + 1;
    while (j < all.length - 1 && cuts.find(c => ((all[j][1] + all[j + 1][1]) / 2) < c.from && ((all[j][1] + all[j + 1][1]) / 2) > c.to) === cut) j++;
    const sub = all.slice(i, j + 1);
    const ranges = [];
    if (!cut) ranges.push([0, Math.PI * 2]);
    else {
      const h = cut.holes.slice().sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < h.length; k++) { const a0 = h[k][1], a1 = k < h.length - 1 ? h[k + 1][0] : h[0][0] + Math.PI * 2; if (a1 - a0 > 0.01) ranges.push([a0, a1]); }
    }
    for (const [a0, a1] of ranges) out.push(skin(sub, a0, a1, sy, sx, 1, Math.max(4, Math.round(seg * (a1 - a0) / (Math.PI * 2)))));
    i = j;
  }
  return out;
}

// ---------------------------------------------------------------- paint jobs (drawn on a canvas, wrapped round the body)
// u runs nose -> tail, v runs round the body (top in the middle, left side at 1/4, right side at 3/4 down the canvas)
function bodyUV(g, zNose, zTail, yMid = 0) {
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (zNose - p.getZ(i)) / (zNose - zTail), Math.atan2(p.getX(i), p.getY(i) - yMid) / (Math.PI * 2) + 0.5);
  return g;
}
const hex = c => '#' + new THREE.Color(c).getHexString();
// draw(L): L.band(p0, p1, a0, a1, col)  stripe from p0..p1 along (0 nose .. 1 tail), a0..a1 radians below the side middle (- = up)
//          L.text(str, p, a, px, col)   words on both sides, readable from each side
//          L.ring(p, col)  panel line all round   L.line(a, p0, p1, col)  panel line along   L.rect(p0, p1, a0, a1, col, fill)
function livery(base, draw, W = 1024) {
  const H = 512, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = hex(base); g.fillRect(0, 0, W, H);
  const A = H / (Math.PI * 2);
  const sides = fn => {
    // left side: plane-down = canvas-up
    g.save(); g.translate(0, H * 0.25); g.scale(1, -1); fn(p => p * W); g.restore();
    // right side: mirrored along so words read the right way
    g.save(); g.translate(W, H * 0.75); g.scale(-1, 1); fn(p => (1 - p) * W, true); g.restore();
  };
  const L = {
    W, H, A, g,
    band(p0, p1, a0, a1, col) { sides(X => { g.fillStyle = col; const x0 = Math.min(X(p0), X(p1)); g.fillRect(x0, a0 * A, Math.abs(X(p1) - X(p0)), (a1 - a0) * A); }); },
    rect(p0, p1, a0, a1, col, fill = false, lw = 2) { sides(X => { const x0 = Math.min(X(p0), X(p1)), w = Math.abs(X(p1) - X(p0)); if (fill) { g.fillStyle = col; g.fillRect(x0, a0 * A, w, (a1 - a0) * A); } else { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(x0, a0 * A, w, (a1 - a0) * A); } }); },
    text(str, p, a, px, col, font = '800') { sides(X => { g.save(); g.translate(X(p), a * A); g.fillStyle = col; g.font = `${font} ${px}px Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, 0); g.restore(); }); },
    dot(p, a, r, col) { sides(X => { g.fillStyle = col; g.beginPath(); g.arc(X(p), a * A, r, 0, 7); g.fill(); }); },
    ring(p, col = 'rgba(0,0,0,.18)', lw = 1.5) { g.fillStyle = col; g.fillRect(p * W - lw / 2, 0, lw, H); },
    line(a, p0, p1, col = 'rgba(0,0,0,.18)', lw = 1.5) { sides(X => { g.fillStyle = col; g.fillRect(Math.min(X(p0), X(p1)), a * A - lw / 2, Math.abs(X(p1) - X(p0)), lw); }); },
    top(p0, p1, half, col) { g.fillStyle = col; g.fillRect(p0 * W, H * 0.5 - half * A, (p1 - p0) * W, half * 2 * A); },
    belly(p0, p1, from, col) { g.fillStyle = col; const y = (Math.PI / 2 - from) * A; g.fillRect(p0 * W, 0, (p1 - p0) * W, y); g.fillRect(p0 * W, H - y, (p1 - p0) * W, y); },
  };
  draw(L);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return new THREE.MeshPhysicalMaterial({ map: t, metalness: 0.25, roughness: 0.38, clearcoat: 0.8, clearcoatRoughness: 0.15 });
}
// a pilot: body, head, headset or helmet
function pilot(parent, x, y, z, helmet = false, shirt = 0x3f6fb5) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  const skinM = paint(0xe8b98f, { metalness: 0, roughness: 0.7, clearcoat: 0 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.28, 4, 10), paint(shirt, { metalness: 0, roughness: 0.8, clearcoat: 0 })); torso.position.y = -0.36; torso.scale.z = 0.75; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 10), skinM); g.add(head);
  if (helmet) {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 12), paint(0xf2f2f2)); h.position.y = 0.02; g.add(h);
    const v = new THREE.Mesh(new THREE.SphereGeometry(0.138, 16, 8, Math.PI / 2 - 0.9, 1.8, 1.1, 0.75), M.black); v.position.y = 0.02; g.add(v);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.1, 8).rotateX(Math.PI / 2), M.dark); m.position.set(0, -0.06, 0.11); g.add(m);
  } else {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.012, 6, 16, Math.PI), M.dark); band.rotation.y = Math.PI / 2; band.position.y = 0.01; g.add(band);
    for (const sx of [1, -1]) { const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 10).rotateZ(Math.PI / 2), M.dark); cup.position.set(sx * 0.11, -0.01, 0); g.add(cup); }
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.108, 14, 8, 0, Math.PI * 2, 0, 1.2), paint(0x4a3020, { metalness: 0, roughness: 0.9, clearcoat: 0 })); hair.position.y = 0.012; hair.rotation.x = -0.25; g.add(hair);
  }
  return g;
}
// dark inside of a cabin (seen through the windows)
const interior = () => new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.9, side: THREE.BackSide });

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
// a control surface on a hinge line from a to b (b further left, +x): it hangs aft of the hinge and turns about it
function hinge(parent, a, b, chord, thick, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const X = B.clone().sub(A).normalize();
  const fwd = new THREE.Vector3(0, 0, 1); fwd.addScaledVector(X, -fwd.dot(X)).normalize();
  const Y = new THREE.Vector3().crossVectors(fwd, X);
  const h = new THREE.Group(); h.position.copy(A).add(B).multiplyScalar(0.5);
  h.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, fwd));
  parent.add(h);
  const d = new THREE.Group(); h.add(d);
  d.add(mesh(new THREE.BoxGeometry(A.distanceTo(B), thick, chord), mat, 0, 0, -chord / 2));
  return d;
}
function pivot(parent, x, y, z) { const p = new THREE.Group(); p.position.set(x, y, z); parent.add(p); return p; }

function wheel(r, w, parent, x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const tyre = mesh(new THREE.TorusGeometry(r * 0.72, r * 0.3, 10, 20), M.rubber); tyre.rotation.y = Math.PI / 2; tyre.scale.z = w / (r * 0.6);
  const hub = mesh(new THREE.CylinderGeometry(r * 0.48, r * 0.48, w * 0.9, 14), M.metal); hub.rotation.z = Math.PI / 2;
  g.add(tyre, hub); parent.add(g); return g;
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
  const accent = paint(new THREE.Color(color).offsetHSL(0, 0, -0.07).getHex());

  if (type === 'cub') {
    const cubPts = [[0.001, 3.5], [0.22, 3.42], [0.42, 3.2], [0.55, 2.9], [0.6, 2.4], [0.62, 1.6], [0.62, 0.4], [0.58, -0.4], [0.42, -2.2], [0.22, -4.2], [0.08, -4.9], [0.001, -5]];
    const reg = 'G-SKY' + (1 + Math.floor(Math.random() * 9));
    const PI = Math.PI;
    const cubCuts = [{ from: 2.9, to: 2.0, holes: [[PI - 0.75, PI + 0.75]] }, { from: 1.9, to: -0.1, holes: [[PI / 2 + 0.25, PI - 0.3], [PI + 0.3, PI * 1.5 - 0.25]] }];
    const cubMat = livery(0xf4f6f8, L => {
      L.band(0.05, 1, 0.18, 0.36, hex(color)); L.band(0.25, 1, 0.42, 0.48, hex(color));
      L.top(0.0, 0.07, 0.6, hex(color));                                        // painted spinner end
      for (const p of [0.19, 0.47, 0.58, 0.72, 0.86]) L.ring(p);
      L.line(-0.9, 0.2, 0.95); L.line(0.85, 0.05, 0.95);
      L.rect(0.205, 0.45, -1.05, 0.5, 'rgba(0,0,0,.35)');                         // door
      L.rect(0.43, 0.44, -0.05, 0.03, '#888', true);                            // handle
      for (let i = 0; i < 5; i++) L.rect(0.07 + i * 0.018, 0.08 + i * 0.018, -0.25, 0.05, 'rgba(0,0,0,.5)', true); // cowl louvres
      L.text(reg, 0.68, -0.18, 34, '#1c2430');
      L.rect(0.6, 0.66, 0.6, 0.75, 'rgba(0,0,0,.3)');                           // baggage door
    });
    for (const g of bodyWithHoles(cubPts, cubCuts, 1.25, 0.92)) body.add(mesh(bodyUV(g, 3.5, -5), cubMat));
    body.add(mesh(lathe([[0.6, 2.9], [0.6, -0.15]], 16, 1.22, 0.9), interior()));
    // windscreen + side windows (see-through)
    body.add(mesh(skin([[0.555, 2.9], [0.6, 2.4], [0.62, 2.0]], Math.PI - 0.75, Math.PI + 0.75, 1.25, 0.92), M.glassT));
    for (const [a0, a1] of [[Math.PI / 2 + 0.25, Math.PI - 0.3], [Math.PI + 0.3, Math.PI * 1.5 - 0.25]]) body.add(mesh(skin([[0.62, 1.9], [0.62, 0.9], [0.62, 0.4], [0.6, -0.1]], a0, a1, 1.25, 0.92), M.glassT));
    pilot(body, 0.3, 0.7, 0.6);
    // little bits: antenna, pitot tube, exhaust, air inlets, step, tail beacon
    const ant = mesh(new THREE.BoxGeometry(0.02, 0.45, 0.08), M.dark, 0, 1.05, -1.3); ant.rotation.x = -0.4; body.add(ant);
    outer.add(mesh(cyl(0.02, 0.02, 0.5, 6), M.metal, 3.0, 1.2, 1.25));
    body.add(mesh(cyl(0.05, 0.05, 0.35, 8), M.metal, 0.18, -0.72, 2.3));
    for (const sx of [1, -1]) body.add(mesh(new THREE.CircleGeometry(0.09, 12), M.black, sx * 0.22, -0.18, 3.31));
    body.add(mesh(new THREE.BoxGeometry(0.18, 0.03, 0.12), M.metal, 0.62, -0.75, 0.4));
    // high wing with struts
    const ws = [{ p: [5.5, 1.35, 1.0], c: 1.35, t: 0.13 }, { p: [0.6, 1.4, 1.0], c: 1.5, t: 0.14 }, { p: [-0.6, 1.4, 1.0], c: 1.5, t: 0.14 }, { p: [-5.5, 1.35, 1.0], c: 1.35, t: 0.13 }];
    outer.add(mesh(loft(ws), W));
    outer.add(mesh(loft([{ p: [5.52, 1.34, 1.0], c: 1.35, t: 0.13 }, { p: [5.6, 1.34, 1.0], c: 1.35, t: 0.13 }]), C));
    outer.add(mesh(loft([{ p: [-5.52, 1.34, 1.0], c: 1.35, t: 0.13 }, { p: [-5.6, 1.34, 1.0], c: 1.35, t: 0.13 }]), C));
    for (const s of [1, -1]) {
      // strut: from the bottom of the body up and out to the wing
      const st = mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.0, 6), M.metal, s * 1.75, 0.52, 0.4);
      st.rotation.z = -s * 0.99; outer.add(st);
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
    const PI = Math.PI;
    const spPts = [[0.001, 3.9], [0.55, 3.8], [0.75, 3.5], [0.78, 3.0], [0.8, 2.0], [0.8, 0.5], [0.72, -1.5], [0.45, -4.0], [0.18, -6.2], [0.001, -6.5]];
    const spCuts = [{ from: 3.05, to: 2.2, holes: [[PI - 0.8, PI + 0.8]] }, { from: 2.1, to: -0.4, holes: [[PI / 2 + 0.25, PI - 0.32], [PI + 0.32, PI * 1.5 - 0.25]] }];
    const spMat = (livery(color, L => {
      L.belly(0, 1, 0.55, '#f4f6f8');
      L.band(0.12, 1, 0.42, 0.5, '#1c2430');
      for (const p of [0.12, 0.36, 0.47, 0.6, 0.75, 0.88]) L.ring(p);
      L.line(-0.95, 0.12, 0.95);
      L.rect(0.17, 0.4, -1.0, 0.4, 'rgba(0,0,0,.35)');                         // cabin door
      L.rect(0.39, 0.4, -0.25, -0.15, '#666', true);
      L.text('SPLASH', 0.66, -0.12, 38, '#1c2430');
      L.text('🌊', 0.82, -0.12, 30, '#fff', '400');
    }));
    for (const g of bodyWithHoles(spPts, spCuts, 1.25, 0.95)) body.add(mesh(bodyUV(g, 3.9, -6.5), spMat));
    body.add(mesh(lathe([[0.77, 3.1], [0.77, -0.45]], 16, 1.22, 0.92), interior()));
    body.add(mesh(skin([[0.77, 3.05], [0.79, 2.6], [0.8, 2.2]], Math.PI - 0.8, Math.PI + 0.8, 1.25, 0.95), M.glassT));
    for (const [a0, a1] of [[Math.PI / 2 + 0.25, Math.PI - 0.32], [Math.PI + 0.32, Math.PI * 1.5 - 0.25]]) body.add(mesh(skin([[0.8, 2.1], [0.8, 1.0], [0.79, 0.2], [0.77, -0.4]], a0, a1, 1.25, 0.95), M.glassT));
    pilot(body, 0.36, 0.98, 1.1, false, 0xc0392b);
    // radial engine: 9 cylinders you can see in the cowl, exhaust stacks
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, cy = mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 8), M.metal, Math.sin(a) * 0.55, Math.cos(a) * 0.55, 3.72); cy.rotation.z = -a; body.add(cy); }
    for (const sx of [1, -1]) { const ex = mesh(cyl(0.06, 0.06, 0.5, 8), M.dark, sx * 0.55, -0.62, 2.85); ex.rotation.x = 0.4; body.add(ex); }
    const ant = mesh(new THREE.BoxGeometry(0.02, 0.5, 0.1), M.dark, 0, 1.25, -1.6); ant.rotation.x = -0.4; body.add(ant);
    outer.add(mesh(cyl(0.025, 0.025, 0.6, 6), M.metal, 4.0, 1.42, 1.6));
    // radial engine cowl
    body.add(mesh(cyl(0.82, 0.8, 0.9, 20), M.dark, 0, 0, 3.4));
    const ws = [{ p: [7.3, 1.55, 1.4], c: 1.7, t: 0.13 }, { p: [0.7, 1.62, 1.4], c: 1.9, t: 0.14 }, { p: [-0.7, 1.62, 1.4], c: 1.9, t: 0.14 }, { p: [-7.3, 1.55, 1.4], c: 1.7, t: 0.13 }];
    outer.add(mesh(loft(ws), C));
    for (const s of [1, -1]) { const st = mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.85, 6), M.metal, s * 2.25, 0.55, 0.9); st.rotation.z = -s * 1.0; outer.add(st); }
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
      // cross brace, water rudder, cleats
      const br = mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6), M.metal, s * 1.05, -1.1, 0.4); br.rotation.x = 1.0; br.rotation.z = s * 0.3; g.add(br);
      g.add(mesh(new THREE.BoxGeometry(0.03, 0.25, 0.2), M.grey, s * 1.4, -2.25, -3.72));
      for (const z of [3.6, -2.6]) g.add(mesh(new THREE.BoxGeometry(0.06, 0.05, 0.14), M.metal, s * 1.4, -1.58, z + 0.3));
    }
    // water bomber kit: belly tank with two doors (open when dropping) + scoop probes under the floats
    const tankM = paint(0xffb300);
    outer.add(mesh(new THREE.BoxGeometry(1.05, 0.42, 2.4), tankM, 0, -0.92, 0.5));
    outer.add(mesh(new THREE.BoxGeometry(0.9, 0.3, 0.5).translate(0, 0, 0), tankM, 0, -0.86, 1.85));
    parts.doors = [];
    for (const sx of [1, -1]) {
      const d = pivot(outer, sx * 0.5, -1.13, 0.5);
      d.add(mesh(new THREE.BoxGeometry(0.5, 0.04, 2.3), M.grey, -sx * 0.25, 0, 0));
      parts.doors.push(d);
    }
    for (const sx of [1, -1]) {
      const pr = mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.5, 8), M.metal, sx * 1.4, -2.42, 0.9); pr.rotation.x = 0.7; outer.add(pr);
    }
    parts.lights = { left: [3, 1.6, 0.6], right: [-3, 1.6, 0.6], wingL: [7.4, 1.58, 0.6], wingR: [-7.4, 1.58, 0.6], tail: [0, 2.3, -5.9], beacon: [0, 1.0, -1.0], land: [0, -0.4, 3.4] };
  }

  if (type === 'jumbo') {
    const fus = bodyUV(lathe([[0.001, 18.8], [0.6, 18.6], [1.25, 18.0], [1.7, 17.0], [1.95, 15.5], [2.0, 13], [2.0, -8], [1.9, -11], [1.5, -14.5], [0.9, -17.5], [0.3, -18.8], [0.001, -18.9]], 40, 1.05, 1), 18.8, -18.9);
    const LEN = 37.7, at = z => (18.8 - z) / LEN;
    body.add(mesh(fus, livery(0xf4f6f8, L => {
      L.belly(0, 1, 0.75, '#b9c0c7');                                            // grey belly
      L.band(at(17.5), at(-17), 0.18, 0.3, hex(color));                            // cheat line
      L.band(at(17.0), at(-16), 0.34, 0.38, hex(color));
      // passenger windows
      for (let z = 12.5; z > -12; z -= 0.52) if (Math.abs(z - 9.6) > 0.5 && Math.abs(z + 9.6) > 0.5) L.rect(at(z) - 0.0035, at(z) + 0.0035, -0.32, -0.16, '#1b2633', true);
      // doors (front, over wing exits, back) and cargo doors
      for (const z of [14.6, 9.6, -9.6, -14]) L.rect(at(z + 0.5), at(z - 0.5), -0.62, 0.28, 'rgba(60,70,80,.7)', false, 2);
      for (const z of [10.5, -6]) L.rect(at(z + 0.9), at(z - 0.9), 0.48, 0.85, 'rgba(60,70,80,.6)', false, 2);
      // cockpit windscreen
      L.rect(at(17.6), at(16.9), -0.75, -0.42, '#1b2633', true); L.rect(at(16.85), at(16.4), -0.72, -0.44, '#1b2633', true);
      for (const p of [at(13), at(8), at(3), at(-3), at(-8), at(-13)]) L.ring(p, 'rgba(0,0,0,.08)', 1.2);
      L.text('SUNNY AIR', at(4), -0.62, 64, hex(new THREE.Color(color).offsetHSL(0, 0, -0.15).getHex()));
      L.text('☀', at(10.8), -0.62, 44, '#ffb300', '400');
      L.text('G-SUNY', at(-15.2), 0.05, 22, '#2a3441');
    }, 2048)));
    // airline sun logo on the tail (both sides)
    const logoC = document.createElement('canvas'); logoC.width = logoC.height = 128;
    { const g = logoC.getContext('2d'); g.fillStyle = '#ffb300'; g.beginPath(); g.arc(64, 64, 30, 0, 7); g.fill(); g.strokeStyle = '#ffb300'; g.lineWidth = 8; g.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(64 + Math.cos(a) * 40, 64 + Math.sin(a) * 40); g.lineTo(64 + Math.cos(a) * 56, 64 + Math.sin(a) * 56); g.stroke(); } }
    const logoT = new THREE.CanvasTexture(logoC); logoT.colorSpace = THREE.SRGBColorSpace;
    const logoM = new THREE.MeshStandardMaterial({ map: logoT, transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
    for (const sx of [1, -1]) { const lg = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), logoM); lg.position.set(sx * 0.27, 4.6, -15.0); lg.rotation.y = sx * Math.PI / 2; body.add(lg); }
    // antennas, APU exhaust, pitot tubes, flap track fairings
    for (const [y, z] of [[2.15, 6], [2.12, -4], [-2.15, 9]]) { const a = mesh(new THREE.BoxGeometry(0.04, 0.4, 0.3), M.grey, 0, y + Math.sign(y) * 0.2, z); a.rotation.x = -0.3 * Math.sign(y); body.add(a); }
    body.add(mesh(cyl(0.22, 0.18, 0.5, 12), M.dark, 0, 0.05, -19.0));
    for (const sx of [1, -1]) body.add(mesh(cyl(0.025, 0.025, 0.3, 6), M.metal, sx * 1.5, 0.3, 16.8));
    for (const sx of [1, -1]) for (const [x, y, z] of [[4, -0.95, -1.8], [8.5, -0.55, -3.6], [12.5, -0.15, -5.2]]) {
      const ftf = mesh(lathe([[0.001, 1.2], [0.18, 0.6], [0.2, -0.6], [0.05, -1.4]], 10, 1.4, 1), M.grey, sx * x, y - 0.18, z); body.add(ftf);
    }
    // swept wing, low, with dihedral
    const wsec = [{ p: [17, 0.4, -5.6], c: 1.6, t: 0.1 }, { p: [6, -0.75, 0.6], c: 4.6, t: 0.12 }, { p: [1.8, -1.15, 3.2], c: 7.2, t: 0.14 }, { p: [-1.8, -1.15, 3.2], c: 7.2, t: 0.14 }, { p: [-6, -0.75, 0.6], c: 4.6, t: 0.12 }, { p: [-17, 0.4, -5.6], c: 1.6, t: 0.1 }];
    outer.add(mesh(loft(wsec), M.grey));
    // winglets
    for (const s of [1, -1]) outer.add(mesh(loft([{ p: [s * 17, 0.4, -5.5], c: 1.6, t: 0.08 }, { p: [s * 17.25, 2.6, -7.0], c: 0.8, t: 0.08 }], true), C));
    // flaps (inner + outer) and ailerons on hinges that follow the wing's trailing edge (unswept inside, swept outside)
    const teZ = x => (x <= 6 ? -4.0 : -4.0 - (x - 6) * (3.2 / 11)), teY = x => (x <= 6 ? -1.15 + (x - 1.8) * (0.4 / 4.2) : -0.75 + (x - 6) * (1.15 / 11)) - 0.04;
    const surf = (x0, x1, chord, s) => hinge(outer, [s * (s > 0 ? x0 : x1), teY(s > 0 ? x0 : x1), teZ(s > 0 ? x0 : x1) + chord], [s * (s > 0 ? x1 : x0), teY(s > 0 ? x1 : x0), teZ(s > 0 ? x1 : x0) + chord], chord, 0.1, M.grey);
    parts.flapL = surf(2.2, 5.9, 1.5, 1); parts.flapR = surf(2.2, 5.9, 1.5, -1);
    parts.flaps2 = [surf(6.2, 11.6, 1.15, 1), surf(6.2, 11.6, 1.15, -1)];
    parts.ailL = surf(12, 15.6, 0.8, 1); parts.ailR = surf(12, 15.6, 0.8, -1);
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
    body.add(mesh(bodyUV(lathe([[0.001, 8.3], [0.18, 7.8], [0.42, 6.6], [0.7, 5.0], [0.9, 3.4], [1.0, 1.0], [1.05, -3.0], [0.95, -5.6], [0.72, -6.9], [0.66, -7.2]], 32, 0.9, 1.15), 8.3, -7.2), livery(color, L => {
      const at = z => (8.3 - z) / 15.5;
      L.top(at(8.3), at(7.2), 3.2, '#2b2f33');                                    // dark radome
      for (const z of [6.2, 4.2, 1.5, -1, -3.5, -5.6]) L.ring(at(z), 'rgba(0,0,0,.22)');
      L.line(-0.6, at(6), at(-7)); L.line(0.6, at(6), at(-7)); L.line(0, at(1.5), at(-5.5), 'rgba(0,0,0,.15)');
      L.text('77', at(5.6), 0.0, 40, '#f4f6f8');
      L.dot(at(-1.8), -0.1, 30, '#1e3a8a'); L.text('★', at(-1.8), -0.1, 40, '#f4f6f8', '400'); // star insignia
      L.band(at(-2.6), at(-1.0), 0.28, 0.33, '#d32f2f');
      L.text('NO STEP', at(0.8), -1.0, 12, 'rgba(0,0,0,.6)', '700');
      L.text('DANGER ▲', at(3.0), 0.5, 11, '#d32f2f', '700');
    })));
    // pilot on an ejection seat under the canopy, pitot boom, missiles, ventral fins
    pilot(body, 0, 1.0, 3.95, true, 0x556b2f);
    body.add(mesh(new THREE.BoxGeometry(0.5, 0.9, 0.12), M.dark, 0, 0.75, 3.55));
    body.add(mesh(new THREE.BoxGeometry(0.12, 0.25, 0.08), paint(0xffd400), 0, 1.25, 3.5));
    body.add(mesh(cyl(0.025, 0.012, 1.4, 6), M.metal, 0, 0, 8.9));
    for (const sx of [1, -1]) {
      const ms = new THREE.Group(); ms.position.set(sx * 5.02, -0.14, -3.6); outer.add(ms);
      ms.add(mesh(cyl(0.08, 0.08, 2.6, 10), M.white, 0, 0, 0));
      ms.add(mesh(new THREE.ConeGeometry(0.08, 0.3, 10).rotateX(Math.PI / 2), M.dark, 0, 0, 1.45));
      for (let i = 0; i < 4; i++) { const f = mesh(new THREE.BoxGeometry(0.01, 0.28, 0.3), M.white, 0, 0, -1.1); f.rotation.z = i * Math.PI / 2 + Math.PI / 4; ms.add(f); }
      const vf = mesh(new THREE.BoxGeometry(0.04, 0.5, 1.2), C, sx * 0.55, -0.85, -5.6); vf.rotation.z = sx * 0.4; body.add(vf);
    }
    // stars on the wings
    const starC = document.createElement('canvas'); starC.width = starC.height = 128;
    { const g = starC.getContext('2d'); g.fillStyle = '#1e3a8a'; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '400 100px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('★', 64, 70); }
    const starT = new THREE.CanvasTexture(starC); starT.colorSpace = THREE.SRGBColorSpace;
    const starM = new THREE.MeshStandardMaterial({ map: starT, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 });
    for (const sx of [1, -1]) { const st = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), starM); st.rotation.x = -Math.PI / 2; st.position.set(sx * 3.2, 0.09, -2.2); outer.add(st); }
    // intakes
    for (const s of [1, -1]) {
      body.add(mesh(lathe([[0.36, 2.6], [0.42, 2.2], [0.42, -0.6], [0.2, -1.8]], 16, 1.2, 0.8), C, s * 0.98, -0.2, 0.4));
      body.add(mesh(new THREE.CircleGeometry(0.32, 16).scale(0.8, 1.2, 1), M.black, s * 0.98, -0.2, 3.0 + 0.01));
    }
    const can = mesh(new THREE.SphereGeometry(0.62, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.canopy, 0, 0.62, 3.8); can.scale.set(0.9, 0.95, 2.6); body.add(can); parts.canopy = can;
    const canFrame = mesh(new THREE.TorusGeometry(0.56, 0.035, 6, 24, Math.PI), M.dark, 0, 0.62, 3.1); canFrame.scale.set(1, 1, 1); body.add(canFrame);
    // delta-ish wings
    const ws = [{ p: [5.0, 0.0, -3.3], c: 1.6, t: 0.05 }, { p: [1.0, 0.05, 1.8], c: 7.0, t: 0.06 }, { p: [-1.0, 0.05, 1.8], c: 7.0, t: 0.06 }, { p: [-5.0, 0.0, -3.3], c: 1.6, t: 0.05 }];
    outer.add(mesh(loft(ws), C));
    for (const s of [1, -1]) outer.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8).rotateX(Math.PI / 2), M.grey, s * 5.02, 0, -4.0)); // wingtip rails
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
    // cabin shell with an opening where the glass bubble goes
    for (const [p0, pl, t0, tl] of [[0, Math.PI * 2, 1.65, Math.PI - 1.65], [Math.PI / 2 + 1.15, Math.PI * 2 - 2.3, 0, 1.65], [Math.PI / 2 - 1.15, 2.3, 0, 0.35]]) {
      const cab = mesh(new THREE.SphereGeometry(1.25, 28, 18, p0, pl, t0, tl), C, 0, 0.3, 0.2); cab.scale.set(0.95, 1, 1.55); body.add(cab);
    }
    const bub = mesh(new THREE.SphereGeometry(1.27, 28, 14, Math.PI / 2 - 1.15, 2.3, 0.35, 1.3), M.glassT, 0, 0.3, 0.25); bub.scale.set(0.96, 1.01, 1.56); body.add(bub);
    const inside = mesh(new THREE.SphereGeometry(1.2, 20, 12), interior(), 0, 0.3, 0.2); inside.scale.set(0.95, 1, 1.5); body.add(inside);
    pilot(body, 0.35, 0.92, 1.2, false, 0xff7043); pilot(body, -0.35, 0.92, 1.2, false, 0x5c6bc0);
    body.add(mesh(bodyUV(lathe([[0.55, -1.2], [0.42, -3], [0.2, -6.4], [0.15, -6.8]], 24, 1.2), -1.2, -6.8), livery(color, L => {
      L.band(0, 1, -0.2, 0.2, '#f4f6f8'); L.band(0, 1, -0.06, 0.06, '#d32f2f');
      L.text('RESCUE', 0.3, -0.55, 34, '#f4f6f8');
      for (const p of [0.15, 0.45, 0.75]) L.ring(p);
    }), 0, 0.55, 0));
    // rotor hub detail, searchlight, exhaust, tail rotor guard, steps, antenna, cargo hook
    body.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), M.metal, 0, 2.0, -0.2));
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; body.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 4), M.dark, Math.sin(a) * 0.22, 2.15, -0.2 + Math.cos(a) * 0.22)); }
    const sl = new THREE.Group(); sl.position.set(0, -0.82, 1.4); body.add(sl);
    sl.add(mesh(cyl(0.13, 0.15, 0.22, 12), M.dark)); sl.add(mesh(new THREE.CircleGeometry(0.12, 12), paint(0xfffbe6, { emissive: 0xfff2c0, emissiveIntensity: 0.4 }), 0, 0, 0.115));
    body.add(mesh(cyl(0.12, 0.1, 0.4, 10), M.dark, 0, 1.55, -1.5));
    const guard = mesh(new THREE.TorusGeometry(0.75, 0.035, 6, 24, Math.PI * 1.3), M.metal, 0.3, 1.75, -6.75); guard.rotation.y = Math.PI / 2; guard.rotation.x = Math.PI * 0.85; body.add(guard);
    for (const sx of [1, -1]) outer.add(mesh(new THREE.BoxGeometry(0.25, 0.04, 0.5), M.metal, sx * 1.0, -1.05, 0.5));
    body.add(mesh(new THREE.BoxGeometry(0.02, 0.4, 0.08), M.dark, 0, 1.45, -3.5));
    body.add(mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), M.metal, 0, -0.95, -0.2));
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

  if (type === 'paper') {
    // folded white paper: two wings meeting at the nose, a keel folded down the middle, a coloured stripe on each wing
    const paper = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, side: THREE.DoubleSide, flatShading: true });
    const shade = new THREE.MeshStandardMaterial({ color: 0xe9eef4, roughness: 0.9, side: THREE.DoubleSide, flatShading: true });
    const stripe = new THREE.MeshStandardMaterial({ color, roughness: 0.8, side: THREE.DoubleSide });
    const tri = (pts, m) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3)); g.computeVertexNormals(); return new THREE.Mesh(g, m); };
    const N = [0, 0.02, 2.8], TL = [2.6, 0.32, -2.7], TR = [-2.6, 0.32, -2.7], RL = [0.12, 0.02, -2.75], RR = [-0.12, 0.02, -2.75], K = [0, -0.62, -2.5], KB = [0, -0.05, -2.8];
    outer.add(tri([N, TL, RL], paper), tri([N, RR, TR], paper));
    body.add(tri([N, RL, K], shade), tri([N, K, RR], shade), tri([RL, KB, K], shade), tri([RR, K, KB], shade));
    // stripe near the trailing edge of each wing (tells friends apart)
    const lerp3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
    for (const [tip, root] of [[TL, RL], [TR, RR]]) {
      const a = lerp3(N, tip, 0.78), b = lerp3(N, root, 0.78), c = lerp3(N, root, 0.9), d = lerp3(N, tip, 0.9);
      const up = p => [p[0], p[1] + 0.01, p[2]];
      outer.add(tri([up(a), up(b), up(c), up(a), up(c), up(d)], stripe));
    }
    // the centre crease
    const crease = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 5.5), new THREE.MeshBasicMaterial({ color: 0xb8c4d0 }));
    crease.position.set(0, 0.03, 0.02); outer.add(crease);
    parts.tips = [new THREE.Vector3(...TL), new THREE.Vector3(...TR)];
    parts.lights = { left: [0.5, 0.1, 0], right: [-0.5, 0.1, 0], wingL: TL, wingR: TR, tail: [0, 0, -2.8], beacon: [0, -0.3, -1], land: [0, 0, 2.5] };
    parts.smoke.set(0, -0.2, -2.8);
  }

  // nav lights (red left, green right, white tail), strobes, beacon
  const L = parts.lights;
  parts.nav = [
    navLight(outer, 0xff2020, ...L.wingL, P.length > 20 ? 2.2 : 1.4),
    navLight(outer, 0x20ff40, ...L.wingR, P.length > 20 ? 2.2 : 1.4),
    navLight(outer, 0xffffff, ...L.tail, 1.2),
  ];
  parts.strobes = [navLight(outer, 0xffffff, ...L.wingL, P.length > 20 ? 4 : 2.6), navLight(outer, 0xffffff, ...L.wingR, P.length > 20 ? 4 : 2.6)];
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
  // trailing edge down = a negative turn about the hinge. Roll right: left aileron down, right aileron up. Nose up: elevator up.
  if (p.ailL) { p.ailL.rotation.x = -st.roll * 0.35; p.ailR.rotation.x = st.roll * 0.35; }
  if (p.elev) p.elev.rotation.x = st.pitch * 0.35;
  if (p.rudder) p.rudder.rotation.y = -st.yaw * 0.4;
  if (p.flapL) { p.flapL.rotation.x = -st.flaps * 0.6; p.flapR.rotation.x = -st.flaps * 0.6; }
  if (p.flaps2) p.flaps2.forEach(f => { f.rotation.x = -st.flaps * 0.55; });
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
  const on = st.lights && P.kind !== 'paper';
  const t = st.t;
  p.nav.forEach(s => { s.visible = on; });
  const sf = (t % 1.2);
  p.strobes.forEach(s => { s.visible = on && (sf < 0.05 || (sf > 0.14 && sf < 0.19)); });
  const bf = (t * 1.1) % 1;
  p.beacons.forEach(s => { s.visible = on; s.material.opacity = Math.max(0, Math.sin(bf * Math.PI * 2)); });
  p.landGlow.visible = on && st.landLight;
}
