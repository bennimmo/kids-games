// Sky Pilot: things that move by themselves. Everything is worked out from the world clock,
// so every device online sees the boats, cars and planes in the same places.
import * as THREE from '../../js/vendor/three.module.min.js';
import { AIRPORTS, ROADS, CARRIER, TOWNS, LAKE, runwayPoint, dirOf, terrainHeight, regionWeights, biomeAt, apronSide } from './island.js';
import { rng, clamp, smooth, lerp } from './noise.js';
import { buildPlane, animatePlane, paint } from './planes.js';
import { mergeByMaterial, makeLights } from './scenery.js';

const V3 = THREE.Vector3;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, ...o });

// sample a closed loop of [x, z] points smoothly; returns fn(t 0..1) -> { x, z, dx, dz }
function loop(pts) {
  const n = pts.length, seg = [];
  let total = 0;
  const cr = (a, b, c, d, t) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  const P = (i, t) => { const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n], d = pts[(i + 2) % n]; return [cr(a[0], b[0], c[0], d[0], t), cr(a[1], b[1], c[1], d[1], t)]; };
  const fine = [];
  for (let i = 0; i < n; i++) for (let k = 0; k < 20; k++) fine.push(P(i, k / 20));
  const cum = [0];
  for (let i = 1; i <= fine.length; i++) { const a = fine[i - 1], b = fine[i % fine.length]; total += Math.hypot(b[0] - a[0], b[1] - a[1]); cum.push(total); }
  return {
    length: total,
    at(t) {
      const d = ((t % 1) + 1) % 1 * total;
      let lo = 0, hi = cum.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= d) lo = m; else hi = m; }
      const f = (d - cum[lo]) / (cum[hi] - cum[lo] || 1);
      const a = fine[lo % fine.length], b = fine[hi % fine.length];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return { x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f, dx: (b[0] - a[0]) / l, dz: (b[1] - a[1]) / l };
    },
  };
}
// walk along an open path of [x,y,z,dx,dz] points, there and back
function along(path, d) {
  const L = path.length - 1, span = L * 20;
  let s = ((d % (span * 2)) + span * 2) % (span * 2), back = false;
  if (s > span) { s = span * 2 - s; back = true; }
  const i = Math.min(L - 1, Math.floor(s / 20)), f = s / 20 - i;
  const a = path[i], b = path[i + 1];
  return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), z: lerp(a[2], b[2], f), dx: a[3] * (back ? -1 : 1), dz: a[4] * (back ? -1 : 1), back };
}

// ---------------------------------------------------------------- models
function boat(kind) {
  const g = new THREE.Group();
  if (kind === 'sail') {
    const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xffffff)); hull.scale.set(2, 1.4, 6); g.add(hull);
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 12, 6), mat(0xdddddd)).translateY(6.5));
    const sail = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new V3(0, 1.5, -3.5), new V3(0, 12.5, 0), new V3(0, 1.5, 0.5)]), mat(0xfafafa, { side: THREE.DoubleSide }));
    sail.geometry.computeVertexNormals(); g.add(sail);
  } else if (kind === 'ferry') {
    const hull = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 60), mat(0x1e3a5f)); hull.position.y = 1; g.add(hull);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(13, 6, 40), mat(0xf5f5f5)); deck.position.set(0, 6.5, -4); g.add(deck);
    const fun = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 5, 12), mat(0xe53935)); fun.position.set(0, 12, -10); g.add(fun);
  } else if (kind === 'cargo') {
    const hull = new THREE.Mesh(new THREE.BoxGeometry(24, 9, 150), mat(0x8b2e2e)); hull.position.y = 1.5; g.add(hull);
    const cols = [0x1e88e5, 0xffb300, 0x43a047, 0xe53935, 0x8e24aa];
    for (let i = 0; i < 18; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 12), mat(cols[i % 5])); c.position.set(((i % 3) - 1) * 7.5, 7.5 + Math.floor(i / 9) * 3, -50 + Math.floor(i / 3) % 6 * 14); g.add(c); }
    const br = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 10), mat(0xf5f5f5)); br.position.set(0, 12, -65); g.add(br);
  } else {
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 1.4, 8), mat(0xffffff)); hull.position.y = 0.4; g.add(hull);
    const c = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 3), mat(0x1e88e5)); c.position.set(0, 1.6, -0.5); g.add(c);
  }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function car(color) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 4.2), paint(color)); b.position.y = 0.7; g.add(b);
  const t = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.2), mat(0x223344, { metalness: 0.8, roughness: 0.2 })); t.position.set(0, 1.4, -0.2); g.add(t);
  for (const x of [-0.9, 0.9]) for (const z of [-1.3, 1.3]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 10).rotateZ(Math.PI / 2), mat(0x111111)); w.position.set(x, 0.35, z); g.add(w); }
  return g;
}
function balloon(c1, c2) {
  const g = new THREE.Group();
  const pts = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; pts.push(new THREE.Vector2(Math.sin(a) * 9 * (1 - (i / 16) * 0.25) + (i > 13 ? 0 : 0), -Math.cos(a) * 11)); }
  pts.push(new THREE.Vector2(2, -13));
  const envG = new THREE.LatheGeometry(pts.reverse(), 16);
  const cols = new Float32Array(envG.attributes.position.count * 3), ca = new THREE.Color(c1), cb = new THREE.Color(c2);
  for (let i = 0; i < envG.attributes.position.count; i++) { const p = envG.attributes.position; const a = Math.atan2(p.getZ(i), p.getX(i)); const c = Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 ? ca : cb; cols.set([c.r, c.g, c.b], i * 3); }
  envG.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const env = new THREE.Mesh(envG, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })); env.position.y = 14; g.add(env);
  const bk = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 2), mat(0x8d6e4f)); bk.position.y = -0.75; g.add(bk);
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 8), new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); fl.position.y = 1.8; g.add(fl);
  g.userData.flame = fl;
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function birdGeo() {
  const g = new THREE.BufferGeometry();
  // body + 2 wings (wing tips move in the shader-free way: we bend in update)
  g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.5, 0, 0, -0.5, 0.9, 0, 0, 0, 0, 0.5, 0, 0, -0.5, -0.9, 0, 0], 3));
  g.computeVertexNormals();
  return g;
}
function whale() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), mat(0x34495e, { roughness: 0.4 })); body.scale.set(3, 2.2, 11); g.add(body);
  const tail = new THREE.Group(); tail.position.z = -11; g.add(tail);
  const fl = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 2.2), mat(0x2c3e50)); fl.position.z = -1.2; tail.add(fl);
  g.userData.tail = tail;
  return g;
}
function dolphin() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), mat(0x78909c, { roughness: 0.3 })); b.scale.set(0.6, 0.6, 1.8); g.add(b);
  const fin = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 4), mat(0x607d8b)); fin.position.set(0, 0.6, -0.1); g.add(fin);
  return g;
}
function deer() {
  const g = new THREE.Group(), m = mat(0x8d5a2b);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 1.5), m); b.position.y = 1.1; g.add(b);
  const n = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), m); n.position.set(0, 1.6, 0.7); n.rotation.x = 0.4; g.add(n);
  const h = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.6), m); h.position.set(0, 2.0, 0.95); g.add(h);
  for (const x of [-0.2, 0.2]) for (const z of [-0.6, 0.6]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.12), m); l.position.set(x, 0.4, z); g.add(l); }
  return g;
}

// ---------------------------------------------------------------- AI planes: fly a lap of an airport (take off, circuit, land, taxi back)
function circuitPath(ap, alt, wide) {
  // in the runway frame: along (+ = takeoff direction), side (+ = right). Left-hand circuit.
  const L = ap.len, s = -wide;
  return [
    [-L / 2 + 60, 0, 0], [L * 0.1, 0, 0], [L / 2 - 50, alt * 0.15, 0], [L / 2 + 1500, alt * 0.7, 0],
    [L / 2 + 2600, alt, s * 0.5], [L / 2 + 2200, alt, s], [0, alt, s], [-L / 2 - 2200, alt, s], [-L / 2 - 3200, alt * 0.8, s * 0.5],
    [-L / 2 - 3600, alt * 0.55, 0], [-L / 2 - 1600, alt * 0.28, 0], [-L / 2 + 280, 0.8, 0], [-L / 2 + 500, 0, 0], [0, 0, 0], [L / 2 - 200, 0, 0],
  ];
}

export function createLife(scene, sky, quality, dpr) {
  const R = rng(3131);
  const root = new THREE.Group(); scene.add(root);
  const movers = [];   // { update(T, dt) }
  const glowLights = [];

  // ------------------------------------------------------------ sea traffic
  const routes = [
    { kind: 'ferry', pts: [[-3200, 11800], [3000, 12500], [8000, 15000], [2000, 17500], [-6000, 15500]], speed: 9 },
    { kind: 'cargo', pts: [[-17000, 9000], [-5000, 20000], [10000, 19500], [19000, 6000], [16000, -14000], [0, -19000], [-16000, -12000]], speed: 7 },
    { kind: 'sail', pts: [[-1000, 11500], [1500, 11300], [1200, 12600], [-1500, 12500]], speed: 4 },
    { kind: 'sail', pts: [[4000, 11000], [6500, 11600], [6000, 13000], [3500, 12200]], speed: 4.5 },
    { kind: 'sail', pts: [[-7500, 11000], [-5500, 12000], [-7000, 13000], [-9000, 12000]], speed: 3.5 },
    { kind: 'motor', pts: [[-4000, 11300], [-2000, 12200], [-3500, 13500]], speed: 12 },
    { kind: 'motor', pts: [[10500, 6000], [12000, 9000], [9500, 9500]], speed: 13 },
  ];
  const wakeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false });
  for (const r of routes) {
    const lp = loop(r.pts), b = boat(r.kind), off = R();
    const wake = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), wakeMat);
    const size = r.kind === 'cargo' ? 40 : r.kind === 'ferry' ? 20 : 6;
    wake.scale.set(size * 0.6, 1, size * 4); wake.position.y = 0.15;
    root.add(b, wake);
    const BL = r.kind === 'cargo' || r.kind === 'ferry' ? makeLights([[0, 14, 0, 1, 1, 0.8, 1.5]], dpr) : null;
    if (BL) { glowLights.push(BL); root.add(BL.obj); }
    movers.push({
      update(T) {
        const p = lp.at(off + T * r.speed / lp.length);
        b.position.set(p.x, Math.sin(T * 0.8 + off * 9) * 0.25, p.z);
        b.rotation.set(Math.sin(T * 0.7 + off) * 0.03, Math.atan2(p.dx, p.dz), Math.sin(T * 0.9) * 0.04);
        wake.position.set(p.x - p.dx * size * 2.2, 0.15, p.z - p.dz * size * 2.2); wake.rotation.y = Math.atan2(p.dx, p.dz);
        if (BL) BL.obj.position.set(p.x, 0, p.z);
      },
    });
  }

  // ------------------------------------------------------------ cars + train
  const carCols = [0xe53935, 0x1e88e5, 0xfafafa, 0x212121, 0xffb300, 0x43a047, 0x9e9e9e, 0x8e24aa];
  const headL = [];
  for (const road of ROADS) {
    if (!road.path) continue;
    const span = (road.path.length - 1) * 20;
    if (road.kind === 'road') {
      const n = Math.max(2, Math.round(span / 900 * quality.life));
      for (let i = 0; i < n; i++) {
        const c = car(carCols[i % carCols.length]), off = R() * span * 2, sp = 14 + R() * 8;
        root.add(c);
        const hl = { x: 0, y: 0, z: 0 }; headL.push(hl);
        movers.push({
          update(T) {
            const p = along(road.path, off + T * sp);
            const side = p.back ? -2.2 : 2.2;
            c.position.set(p.x - p.dz * side, p.y, p.z + p.dx * side);
            c.rotation.y = Math.atan2(p.dx, p.dz);
            hl.x = c.position.x + p.dx * 2.4; hl.y = p.y + 0.8; hl.z = c.position.z + p.dz * 2.4;
          },
        });
      }
    } else {
      // train: engine + 5 carriages
      const cars = [];
      const tm = [0xc62828, 0x2e7d32, 0x1565c0, 0xf9a825, 0x6a1b9a, 0xef6c00];
      for (let i = 0; i < 6; i++) {
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.2, 12), mat(i ? tm[i] : 0x263238)); b.position.y = 2.2; g.add(b);
        const rf = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 12.2), mat(0xeeeeee)); rf.position.y = 3.9; g.add(rf);
        if (!i) { const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2, 8), mat(0x111111)); ch.position.set(0, 4.6, 3.5); g.add(ch); }
        g.traverse(o => { if (o.isMesh) o.castShadow = true; });
        root.add(g); cars.push(g);
      }
      const hl = { x: 0, y: 0, z: 0 }; headL.push(hl);
      movers.push({
        update(T) {
          const base = T * 16;
          cars.forEach((g, i) => {
            const p = along(road.path, base - (along(road.path, base).back ? -1 : 1) * i * 13);
            g.position.set(p.x, p.y, p.z); g.rotation.y = Math.atan2(p.dx, p.dz);
            if (!i) { hl.x = p.x + p.dx * 6.5; hl.y = p.y + 2; hl.z = p.z + p.dz * 6.5; }
          });
        },
      });
    }
  }
  const head = makeLights(headL.map(() => [0, 0, 0, 1, 0.95, 0.8, 1.3]), dpr);
  head.obj.frustumCulled = false; root.add(head.obj); glowLights.push(head);

  // ------------------------------------------------------------ AI planes doing circuits
  const aiPlanes = [];
  const aiDefs = [
    { ap: 0, type: 'jumbo', color: 0xffffff, alt: 650, wide: 3200, speed: 75, off: 0 },
    { ap: 0, type: 'cub', color: 0x8e24aa, alt: 300, wide: 1500, speed: 34, off: 0.5 },
    { ap: 1, type: 'cub', color: 0x00acc1, alt: 300, wide: 1400, speed: 33, off: 0.2 },
    { ap: 3, type: 'cub', color: 0xff7043, alt: 250, wide: 1200, speed: 30, off: 0.7 },
  ];
  for (const d of aiDefs) {
    const ap = AIRPORTS[d.ap];
    const pts = circuitPath(ap, d.alt, d.wide).map(([a, y, s]) => { const [x, z] = runwayPoint(ap, a, s); return [x, z, y]; });
    const lp = loop(pts.map(p => [p[0], p[1]]));
    const pl = buildPlane(d.type, d.color);
    root.add(pl.group);
    const st = { roll: 0, pitch: 0, yaw: 0, flaps: 0, gear: 1, rpm: 0.7, lights: true, landLight: true, t: 0, ab: 0 };
    let prevYaw = 0;
    aiPlanes.push(pl);
    movers.push({
      update(T, dt) {
        const t = d.off + T * d.speed / lp.length;
        const p = lp.at(t), p2 = lp.at(t + 30 / lp.length);
        // height: closest circuit point blend
        const k = ((t % 1) + 1) % 1 * pts.length;
        let best = 0, bd = 1e9;
        for (let i = 0; i < pts.length; i++) { const dd = Math.hypot(pts[i][0] - p.x, pts[i][1] - p.z); if (dd < bd) { bd = dd; best = i; } }
        // interpolate height between the two nearest points
        const a = pts[best], nb = [pts[(best + 1) % pts.length], pts[(best - 1 + pts.length) % pts.length]];
        const n2 = Math.hypot(nb[0][0] - p.x, nb[0][1] - p.z) < Math.hypot(nb[1][0] - p.x, nb[1][1] - p.z) ? nb[0] : nb[1];
        const dA = Math.hypot(a[0] - p.x, a[1] - p.z), dB = Math.hypot(n2[0] - p.x, n2[1] - p.z);
        const hAbove = lerp(a[2], n2[2], dA / (dA + dB || 1));
        const gh = ap.elev + (d.type === 'jumbo' ? 3.6 : 1.25);
        const y = gh + hAbove;
        const yaw = Math.atan2(p.dx, p.dz);
        let dyaw = yaw - prevYaw; while (dyaw > Math.PI) dyaw -= Math.PI * 2; while (dyaw < -Math.PI) dyaw += Math.PI * 2;
        prevYaw = yaw;
        const bank = hAbove > 5 ? clamp(-dyaw / Math.max(dt, 0.001) * 1.4, -0.5, 0.5) : 0;
        pl.group.position.set(p.x, y, p.z);
        const climb = (pl.group.userData.lastY !== undefined ? (y - pl.group.userData.lastY) / Math.max(dt, 0.001) : 0);
        pl.group.userData.lastY = y;
        pl.group.rotation.set(0, 0, 0);
        pl.group.rotation.order = 'YXZ';
        pl.group.rotation.y = yaw;
        pl.group.rotation.x = -clamp(climb / d.speed, -0.25, 0.25) - (hAbove > 2 ? 0.05 : 0);
        pl.group.rotation.z = lerp(pl.group.rotation.z, bank, 0.1);
        st.gear = hAbove < 220 ? 1 : 0;
        st.flaps = hAbove < 300 && dB > 0 ? 0.6 : 0;
        st.t = T; st.lights = true; st.landLight = sky.state.lightsOn > 0.3;
        animatePlane(pl, st, dt);
      },
    });
  }

  // ------------------------------------------------------------ hot air balloons
  const bCols = [[0xe53935, 0xffeb3b], [0x1e88e5, 0xffffff], [0x43a047, 0xff9800], [0x8e24aa, 0x00bcd4], [0xff7043, 0x3949ab]];
  for (let i = 0; i < 6; i++) {
    const b = balloon(...bCols[i % bCols.length]);
    const cx = -4000 + R() * 9000, cz = -1000 + R() * 9000, r = 600 + R() * 1200, sp = 0.004 + R() * 0.004, off = R() * 7;
    root.add(b);
    movers.push({
      update(T) {
        const x = cx + Math.cos(T * sp + off) * r, z = cz + Math.sin(T * sp * 1.3 + off) * r;
        const g = Math.max(0, terrainHeight(x, z));
        b.position.set(x, g + 350 + Math.sin(T * 0.05 + off) * 150, z);
        b.userData.flame.visible = Math.sin(T * 0.7 + off * 3) > 0.6;
      },
    });
  }

  // ------------------------------------------------------------ birds (flocks in a V or a swirl)
  const birdMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide });
  const gullMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide });
  const flocks = [];
  for (let f = 0; f < Math.round(14 * quality.life); f++) {
    const gull = f % 3 === 0;
    const cx = (R() - 0.5) * 22000, cz = (R() - 0.5) * 22000;
    const n = 7 + R.int(8), g = new THREE.Group();
    const birds = [];
    for (let i = 0; i < n; i++) {
      const geo = birdGeo();
      const m = new THREE.Mesh(geo, gull ? gullMat : birdMat);
      const row = Math.ceil(i / 2), side = i % 2 ? 1 : -1;
      m.position.set(side * row * 2.5 + (R() - 0.5), (R() - 0.5) * 1.5, -row * 2.5);
      m.scale.setScalar(gull ? 1.4 : 1.1);
      m.userData.ph = R() * 6;
      g.add(m); birds.push(m);
    }
    root.add(g);
    const r = 800 + R() * 2500, sp = (14 + R() * 6) / r * (R() < 0.5 ? 1 : -1), off = R() * 6, alt = 100 + R() * 500;
    flocks.push({ g, birds, cx, cz, r, sp, off, alt });
  }
  movers.push({
    update(T) {
      for (const f of flocks) {
        const a = T * f.sp + f.off;
        const x = f.cx + Math.cos(a) * f.r, z = f.cz + Math.sin(a) * f.r;
        const gh = Math.max(0, terrainHeight(x, z));
        f.g.position.set(x, gh + f.alt + Math.sin(T * 0.2 + f.off) * 30, z);
        f.g.rotation.y = Math.atan2(-Math.sin(a) * Math.sign(f.sp), Math.cos(a) * Math.sign(f.sp)) + (f.sp > 0 ? 0 : 0);
        for (const b of f.birds) {
          const fl = Math.sin(T * 9 + b.userData.ph) * 0.7;
          const p = b.geometry.attributes.position;
          p.setY(2, fl); p.setY(5, fl);
          p.needsUpdate = true;
        }
      }
    },
  });

  // ------------------------------------------------------------ whales, dolphins
  const whales = [];
  for (let i = 0; i < 4; i++) {
    const w = whale(); root.add(w);
    const a = i / 4 * Math.PI * 2 + 0.4, rr = 15500 + R() * 3000;
    whales.push({ w, x: Math.sin(a) * rr, z: Math.cos(a) * rr, off: R() * 40, spout: null });
  }
  const spoutMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false });
  for (const wh of whales) { wh.spout = new THREE.Mesh(new THREE.ConeGeometry(2.5, 12, 8, 1, true), spoutMat); root.add(wh.spout); }
  const dolphins = [];
  for (let i = 0; i < 10; i++) { const d = dolphin(); root.add(d); dolphins.push({ d, i, off: R() * 10 }); }
  movers.push({
    update(T) {
      for (const wh of whales) {
        const cyc = (T + wh.off) % 40, up = cyc < 14;
        const sx = wh.x + Math.sin(T * 0.01 + wh.off) * 400, sz = wh.z + Math.cos(T * 0.012 + wh.off) * 400;
        const k = up ? Math.sin(cyc / 14 * Math.PI) : 0;
        wh.w.userData.hide = !up;
        wh.w.position.set(sx, -3 + k * 3.2, sz);
        wh.w.rotation.set(up ? (cyc > 10 ? (cyc - 10) * 0.25 : 0) : 0, T * 0.01 + wh.off, 0);
        wh.w.userData.tail.rotation.x = up && cyc > 10 ? -(cyc - 10) * 0.35 : Math.sin(T * 2) * 0.15;
        wh.spout.visible = up && cyc > 2 && cyc < 4.5;
        wh.spout.position.set(sx, 6 + (cyc - 2) * 2, sz);
        wh.spout.scale.setScalar(0.5 + (cyc - 2) * 0.3);
      }
      // dolphins jump next to the ferry route
      const c = TOWNS[0];
      for (const dd of dolphins) {
        const base = T * 9 + dd.i * 6;
        const x = 1000 + Math.cos(base / 900) * 2500 + dd.i * 7, z = 12500 + Math.sin(base / 900) * 900 + (dd.i % 3) * 6;
        const ph = (T * 0.8 + dd.off) % 3;
        const jump = ph < 1 ? Math.sin(ph * Math.PI) : 0;
        dd.d.position.set(x, -0.6 + jump * 3, z);
        dd.d.rotation.set(-Math.cos(ph * Math.PI) * 0.8 * (ph < 1 ? 1 : 0), Math.atan2(-Math.sin(base / 900), Math.cos(base / 900) * 0.36) + Math.PI / 2, 0);
        dd.d.userData.hide = !(ph < 1.1);
      }
    },
  });

  // ------------------------------------------------------------ deer in the forest meadows, ducks on the lake
  const herd = [];
  for (let h = 0; h < 4; h++) {
    let x, z, tries = 0;
    do { x = -9000 + R() * 5000; z = -500 + R() * 7000; tries++; } while ((terrainHeight(x, z) < 5 || regionWeights(x, z).ww < 0.5) && tries < 50);
    for (let i = 0; i < 6; i++) { const d = deer(); root.add(d); herd.push({ d, x: x + (R() - 0.5) * 60, z: z + (R() - 0.5) * 60, off: R() * 10 }); }
  }
  const ducks = [];
  for (let i = 0; i < 12; i++) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), mat(i % 3 ? 0x8d6e4f : 0xffffff)); b.scale.set(1, 0.7, 1.5); g.add(b);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), mat(0x2e7d32)); hd.position.set(0, 0.35, 0.45); g.add(hd);
    root.add(g); ducks.push({ g, i });
  }
  movers.push({
    update(T) {
      for (const h of herd) {
        const wx = h.x + Math.sin(T * 0.03 + h.off) * 25, wz = h.z + Math.cos(T * 0.025 + h.off) * 25;
        h.d.position.set(wx, terrainHeight(wx, wz), wz);
        h.d.rotation.y = T * 0.03 + h.off + Math.PI / 2;
      }
      for (const d of ducks) {
        const a = T * 0.02 + d.i * 0.5, rr = 120 + d.i * 12;
        d.g.position.set(LAKE.x + Math.cos(a) * rr, 0.1, LAKE.z + Math.sin(a) * rr);
        d.g.rotation.y = -a;
      }
    },
  });

  // ------------------------------------------------------------ fireworks over town at night
  const fwMax = 180, fwPos = new Float32Array(fwMax * 3), fwCol = new Float32Array(fwMax * 3);
  const fwGeo = new THREE.BufferGeometry();
  fwGeo.setAttribute('position', new THREE.BufferAttribute(fwPos, 3)); fwGeo.setAttribute('color', new THREE.BufferAttribute(fwCol, 3));
  const fwPts = new THREE.Points(fwGeo, new THREE.PointsMaterial({ size: 5, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  fwPts.frustumCulled = false; root.add(fwPts);
  const bursts = [];
  movers.push({
    update(T, dt) {
      const night = sky.state.night > 0.7 && sky.state.weather.rain < 0.3;
      const slot = Math.floor(T / 2.2);
      if (night && bursts.length < 3 && bursts.lastSlot !== slot) {
        bursts.lastSlot = slot;
        const r2 = rng(slot);
        if (r2() < 0.6) {
          const t = TOWNS[0];
          bursts.push({ t0: T, x: t.x + (r2() - 0.5) * 900, y: t.elev + 260 + r2() * 160, z: t.z + 400 + (r2() - 0.5) * 400, col: new THREE.Color().setHSL(r2(), 1, 0.6), seed: slot });
        }
      }
      let k = 0;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i], age = T - b.t0;
        if (age > 2.5 || age < 0) { bursts.splice(i, 1); continue; }
        const r2 = rng(b.seed * 7);
        for (let j = 0; j < 60 && k < fwMax; j++, k++) {
          const u = r2() * 2 - 1, th = r2() * 6.28, s = Math.sqrt(1 - u * u), sp = 60 + r2() * 20;
          fwPos.set([b.x + s * Math.cos(th) * sp * age, b.y + u * sp * age - 10 * age * age, b.z + s * Math.sin(th) * sp * age], k * 3);
          const fade = 1 - age / 2.5;
          fwCol.set([b.col.r * fade, b.col.g * fade, b.col.b * fade], k * 3);
        }
      }
      for (; k < fwMax; k++) fwPos.set([0, -1000, 0], k * 3);
      fwGeo.attributes.position.needsUpdate = true; fwGeo.attributes.color.needsUpdate = true;
    },
  });

  // far away things are hidden (they'd only be a pixel or two)
  const cullList = [];
  root.children.forEach(o => { if (o.isGroup) cullList.push(o); });
  function update(T, dt, cams = []) {
    for (const m of movers) m.update(T, dt);
    for (const o of cullList) {
      let d = 1e9;
      for (const c of cams) d = Math.min(d, Math.abs(c.x - o.position.x) + Math.abs(c.z - o.position.z));
      o.visible = d < 9000 && (o.userData.hide !== true);
    }
    for (const l of glowLights) { l.u.amount.value = sky.state.lightsOn; l.u.time.value = T; }
    // car headlights follow the cars
    const hp = head.geo.attributes.position;
    headL.forEach((h, i) => hp.setXYZ(i, h.x, h.y, h.z));
    hp.needsUpdate = true;
  }
  return { update, root, aiPlanes };
}
