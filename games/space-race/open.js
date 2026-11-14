// Star Dash, style B: Open Space.
// Fly anywhere. Go through every ring in order (follow your arrow). Each ring = boost.
// Rocks: bonk = slow down. The same seed always makes the same rings and rocks.
import { THREE, V3, UP, clamp, wrapAng, rng, addSky, makeRockField, makeShip, setFlames, shipTrails, loopCurve, textures, glowMat } from './art.js';

export const OPEN_LAPS = 2;
const RING_R = 20;
const NR = 12;

export function createOpen({ scene, seed, dpr }) {
  const r = rng(seed);
  const T = textures();
  addSky(scene, dpr);
  const curve = loopCurve(r.range(880, 1000), r.range(140, 200), 12, 0.85, r.range(0.14, 0.24), r() * 6.28);
  const L = curve.getLength();

  // ---- rings
  const rings = [];
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x8a7cff, emissive: 0x3a2a9a, metalness: 0.6, roughness: 0.3 });
  const ringGeo = new THREE.TorusGeometry(RING_R, 1.3, 14, 72);
  const Z = new V3(0, 0, 1);
  for (let i = 0; i < NR; i++) {
    const u = i / NR, c = curve.getPointAt(u), n = curve.getTangentAt(u).normalize();
    const m = new THREE.Mesh(ringGeo, i === 0 ? new THREE.MeshBasicMaterial({ map: T.checker }) : ringMat);
    m.position.copy(c); m.quaternion.setFromUnitVectors(Z, n); scene.add(m);
    const g = new THREE.Sprite(glowMat(0x9d8cff, 0.35)); g.scale.setScalar(RING_R * 3.2); g.position.copy(c); scene.add(g);
    rings.push({ c, n });
  }
  // dotted guide line
  const dots = [];
  for (let s = 0; s < L; s += 14) { const p = curve.getPointAt(s / L); dots.push(p.x, p.y, p.z); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
  scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ size: 2.2, map: T.glow, color: 0x7fd8ff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })));

  const startU = 0.012, startP = curve.getPointAt(startU), startT = curve.getTangentAt(startU).normalize();
  const startB = new V3().crossVectors(startT, UP).normalize();

  // ---- rocks (kept away from rings and the start)
  const rocks = [];
  let tries = 0;
  while (rocks.length < 300 && tries++ < 5000) {
    const p = curve.getPointAt(r()).add(r.dir().multiplyScalar(r.range(15, 170)));
    const size = r() < 0.12 ? r.range(14, 26) : r.range(3, 9);
    if (rings.some(k => k.c.distanceTo(p) < RING_R + size + 22) || p.distanceTo(startP) < 70 + size) continue;
    rocks.push({ pos: p, size });
  }
  for (let i = 0; i < 120; i++) rocks.push({ pos: curve.getPointAt(r()).add(r.dir().multiplyScalar(r.range(260, 600))), size: r.range(10, 40), far: true });
  const spinRocks = makeRockField(scene, rocks, r);
  const near = rocks.filter(k => !k.far);

  // ---------------------------------------------------------------- ships
  function addShip({ color, slot = 0, of = 2, layer = 0 }) {
    const mesh = makeShip(color); mesh.scale.setScalar(0.8); scene.add(mesh);
    const off = of <= 1 ? 0 : -7 + slot * 14 / (of - 1);
    const pos = startP.clone().addScaledVector(startB, off);
    // highlight on the next ring + arrow over the ship. Only this player's camera sees them.
    const hi = new THREE.Group();
    hi.add(new THREE.Mesh(new THREE.TorusGeometry(RING_R + 0.6, 1.8, 12, 72), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })));
    const hs = new THREE.Sprite(glowMat(color, 0.6)); hs.scale.setScalar(RING_R * 3.6); hi.add(hs);
    const arrow = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.6, 16), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 }));
    cone.geometry.rotateX(Math.PI / 2); arrow.add(cone);
    for (const g of [hi, arrow]) { g.traverse(o => o.layers.set(layer)); g.visible = layer > 0; scene.add(g); }
    return {
      mesh, trail: shipTrails(scene, mesh, color, 0.4), color, hi, arrow,
      pos, prev: pos.clone(), yaw: Math.atan2(startT.x, startT.z), pitch: Math.asin(startT.y), yawV: 0, pitchV: 0,
      speed: 0, boost: 0, hit: 0, next: 1, lap: 0, done: false, input: {}, events: [], camPos: null, net: null,
    };
  }

  const fwdOf = (sh, out) => out.set(Math.sin(sh.yaw) * Math.cos(sh.pitch), Math.sin(sh.pitch), Math.cos(sh.yaw) * Math.cos(sh.pitch));
  const fwd = new V3(), right = new V3(), up = new V3(), side = new V3(), mB = new THREE.Matrix4(), tmp = new V3(), tmp2 = new V3();

  function aiInput(sh, skill) {
    const k = rings[sh.next];
    const want = tmp.copy(k.c).sub(sh.pos);
    const dist = want.length(); want.normalize();
    if (dist > 60) want.addScaledVector(k.n, -0.35).normalize();  // line up with the ring
    fwdOf(sh, fwd);
    if (Math.random() < 0.5 + skill * 0.45) {
      for (const rk of near) {
        const d = tmp2.copy(rk.pos).sub(sh.pos), ahead = d.dot(fwd);
        if (ahead > 0 && ahead < 70) { d.addScaledVector(fwd, -ahead); if (d.length() < rk.size + 6) want.addScaledVector(d.normalize(), -1.2).normalize(); }
      }
    }
    const dy = wrapAng(Math.atan2(want.x, want.z) - sh.yaw), dp = Math.asin(clamp(want.y, -1, 1)) - sh.pitch;
    const slack = 0.04 + (1.05 - skill) * 0.25;
    return { l: dy > slack, r: dy < -slack, u: dp > slack, d: dp < -slack };
  }

  function simulate(sh, dt, racing) {
    const inp = sh.input;
    const yIn = racing ? (inp.l ? 1 : 0) - (inp.r ? 1 : 0) : 0, pIn = racing ? (inp.u ? 1 : 0) - (inp.d ? 1 : 0) : 0;
    sh.yawV += (yIn * 1.55 - sh.yawV) * Math.min(1, dt * 6);
    sh.pitchV += (pIn * 1.15 - sh.pitchV) * Math.min(1, dt * 6);
    sh.yaw += sh.yawV * dt; sh.pitch = clamp(sh.pitch + sh.pitchV * dt, -1.1, 1.1);
    if (!pIn) sh.pitch *= 1 - dt * 0.45;
    let target = racing ? (sh.done ? 40 : 78 * (sh.topSpeed || 1)) : 0;
    if (sh.boost > 0) target = 140 * (sh.topSpeed || 1);
    if (sh.hit > 0) target = Math.min(target, 25);
    sh.speed += (target - sh.speed) * Math.min(1, dt * (sh.boost > 0 ? 3 : 1.4));
    sh.boost = Math.max(0, sh.boost - dt); sh.hit = Math.max(0, sh.hit - dt);
    fwdOf(sh, fwd);
    sh.prev.copy(sh.pos); sh.pos.addScaledVector(fwd, sh.speed * dt);
    for (const k of near) {
      const d = sh.pos.distanceTo(k.pos), lim = k.size * 0.95 + 2.4;
      if (d < lim) {
        sh.pos.copy(k.pos).addScaledVector(tmp.copy(sh.pos).sub(k.pos).normalize(), lim + 0.1);
        if (sh.hit <= 0) { sh.speed *= 0.3; sh.hit = 0.8; sh.boost = 0; sh.events.push('bonk'); }
      }
    }
    if (sh.done) return;
    const k = rings[sh.next];
    const a = tmp.copy(sh.prev).sub(k.c).dot(k.n), b = tmp2.copy(sh.pos).sub(k.c).dot(k.n);
    if (a < 0 && b >= 0 && tmp2.addScaledVector(k.n, -b).length() < RING_R + 0.5) {
      sh.boost = 1.1;
      if (sh.next === 0) {
        sh.lap++;
        if (sh.lap >= OPEN_LAPS) { sh.done = true; sh.events.push('finish'); } else sh.events.push('lap');
      } else sh.events.push('ring');
      sh.next = (sh.next + 1) % NR;
    }
  }

  function follow(sh, dt) {
    const n = sh.net; if (!n) return;
    fwdOf({ yaw: n.yaw, pitch: n.pitch }, tmp);
    n.pos.addScaledVector(tmp, n.v * dt);
    sh.prev.copy(sh.pos);
    sh.pos.lerp(n.pos, Math.min(1, dt * 8));
    sh.yaw += wrapAng(n.yaw - sh.yaw) * Math.min(1, dt * 10);
    sh.pitch += (n.pitch - sh.pitch) * Math.min(1, dt * 10);
    sh.yawV = n.yv; sh.speed = n.v; sh.boost = n.b; sh.hit = n.h; sh.next = n.next; sh.lap = n.lap; sh.done = n.d;
  }

  function place(sh, t) {
    fwdOf(sh, fwd); right.crossVectors(fwd, UP).normalize(); up.crossVectors(right, fwd);
    side.crossVectors(up, fwd);
    mB.makeBasis(side, up, fwd);
    sh.mesh.position.copy(sh.pos); sh.mesh.quaternion.setFromRotationMatrix(mB);
    sh.mesh.userData.inner.rotation.z = -sh.yawV * 0.5 + (sh.hit > 0 ? Math.sin(t * 40) * sh.hit * 0.5 : 0);
    const power = clamp(sh.speed / 140, 0, 1) + (sh.boost > 0 ? 0.5 : 0);
    setFlames(sh.mesh, power);
    sh.trail(side, power);
    const k = rings[sh.next];
    sh.hi.position.copy(k.c); sh.hi.quaternion.setFromUnitVectors(Z, k.n);
    sh.hi.children[0].material.opacity = 0.6 + 0.4 * Math.sin(t * 6);
    sh.arrow.position.copy(sh.pos).addScaledVector(fwd, 9).addScaledVector(up, 3.4); sh.arrow.lookAt(k.c);
    sh.arrow.visible = sh.hi.visible = sh.hi.visible && !sh.done;
  }

  function step(dt, racing, t, ships) {
    spinRocks(dt);
    for (const sh of ships) { if (sh.ctrl === 'remote') follow(sh, dt); else simulate(sh, dt, racing); }
    for (let i = 0; i < ships.length; i++) for (let j = i + 1; j < ships.length; j++) {
      const a = ships[i], b = ships[j], d = a.pos.distanceTo(b.pos);
      if (d < 5 && d > 0.01) {
        const push = tmp.copy(a.pos).sub(b.pos).normalize().multiplyScalar((5 - d) / 2);
        if (a.ctrl !== 'remote') a.pos.add(push);
        if (b.ctrl !== 'remote') b.pos.sub(push);
      }
    }
    for (const sh of ships) place(sh, t);
  }

  const want = new V3(), look = new V3(), shake = new V3();
  function camera(cam, sh, dt) {
    fwdOf(sh, fwd); right.crossVectors(fwd, UP).normalize(); up.crossVectors(right, fwd);
    want.copy(sh.pos).addScaledVector(fwd, -19).addScaledVector(up, 6);
    if (!sh.camPos) sh.camPos = want.clone();
    sh.camPos.lerp(want, 1 - Math.exp(-dt * 9));
    cam.position.copy(sh.camPos);
    if (sh.hit > 0) cam.position.addScaledVector(shake.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), sh.hit * 1.4);
    cam.up.copy(up).addScaledVector(right, sh.yawV * 0.12).normalize();
    cam.lookAt(look.copy(sh.pos).addScaledVector(fwd, 16).addScaledVector(up, 2));
    const fov = 66 + sh.speed * 0.06 + (sh.boost > 0 ? 6 : 0);
    cam.fov += (fov - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix();
  }

  function progress(sh) {
    if (sh.done) return 1;
    const prevR = rings[(sh.next + NR - 1) % NR].c, nextR = rings[sh.next].c;
    const f = clamp(1 - sh.pos.distanceTo(nextR) / prevR.distanceTo(nextR), 0, 1);
    return clamp((sh.lap * NR + ((sh.next + NR - 1) % NR) + f) / (OPEN_LAPS * NR), 0, 1);
  }

  return {
    kind: 'open', LAPS: OPEN_LAPS,
    addShip, step, camera, aiInput, progress,
    lap: sh => clamp(sh.lap + 1, 1, OPEN_LAPS),
    speed01: sh => clamp(sh.speed / 140, 0, 1),
    state: sh => ({
      p: [+sh.pos.x.toFixed(2), +sh.pos.y.toFixed(2), +sh.pos.z.toFixed(2)], y: +sh.yaw.toFixed(3), pi: +sh.pitch.toFixed(3), yv: +sh.yawV.toFixed(2),
      v: +sh.speed.toFixed(1), b: +sh.boost.toFixed(2), h: +sh.hit.toFixed(2), n: sh.next, l: sh.lap, d: sh.done,
    }),
    applyRemote(sh, d, age) {
      if (!Array.isArray(d.p) || d.p.length !== 3 || !d.p.every(Number.isFinite)) return;
      const first = !sh.net;
      const n = { pos: new V3(...d.p), yaw: +d.y || 0, pitch: clamp(+d.pi || 0, -1.2, 1.2), yv: +d.yv || 0, v: +d.v || 0, b: +d.b || 0, h: +d.h || 0, next: clamp(d.n | 0, 0, NR - 1), lap: clamp(d.l | 0, 0, OPEN_LAPS), d: !!d.d };
      fwdOf({ yaw: n.yaw, pitch: n.pitch }, tmp); n.pos.addScaledVector(tmp, n.v * age);
      sh.net = n;
      if (first) { sh.pos.copy(n.pos); sh.yaw = n.yaw; sh.pitch = n.pitch; }
    },
  };
}
