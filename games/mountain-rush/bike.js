// Mountain Rush: the downhill bike and the rider, built from shapes, posed every frame.
//
// Bike space: +z forward, +y up, ground at y = 0. Wheels 27.5" (radius 0.36 m).
// The rider's joints (hips, knees, feet, shoulders, elbows, hands) are worked out each frame
// (simple two-bone IK), so tricks (superman, no hander, tailwhip, barspin, manual) are just poses.
import * as THREE from '../../js/vendor/three.module.min.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const R_AXLE = V(0, 0.36, -0.62), F_AXLE = V(0, 0.36, 0.63), BB = V(0, 0.33, -0.16);
const HT_BOT = V(0, 0.84, 0.39), HT_TOP = V(0, 1.0, 0.305);
const STEER_AXIS = HT_TOP.clone().sub(F_AXLE).normalize();       // up along the head tube
const SEAT_TOP = V(0, 0.93, -0.4);

export const COLORS = {
  frame: [0xe53935, 0x1e88e5, 0x43a047, 0xfdd835, 0x212121, 0xff7043, 0x8e24aa, 0xf5f5f5],
  jersey: [0x1e88e5, 0xe53935, 0x111111, 0xfdd835, 0x43a047, 0xff7043, 0x8e24aa, 0xffffff],
};

export function createBike(T, env, look = {}) {
  const root = new THREE.Group();           // placed from physics each frame
  const mats = makeMaterials(T, env, look);

  // --------------------------------------------------------------- frame (can tailwhip around the steering axis)
  const whipPivot = new THREE.Group(); whipPivot.position.copy(HT_TOP);
  const whipAxis = STEER_AXIS.clone();
  const frame = new THREE.Group(); frame.position.copy(HT_TOP).negate();
  whipPivot.add(frame); root.add(whipPivot);
  const tube = (a, b, r, m, r2) => {
    const d = b.clone().sub(a), len = d.length();
    const g = new THREE.CylinderGeometry(r2 ?? r, r, len, 12, 1);
    g.translate(0, len / 2, 0);
    const mesh = new THREE.Mesh(g, m);
    mesh.position.copy(a);
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    mesh.castShadow = true;
    return mesh;
  };
  const SEAT_J = V(0, 0.8, -0.32);
  frame.add(tube(HT_BOT, BB, 0.032, mats.frame, 0.028));            // down tube
  frame.add(tube(V(0, 0.95, 0.32), SEAT_J, 0.026, mats.frame, 0.022)); // top tube
  frame.add(tube(BB, SEAT_J, 0.024, mats.frame));                    // seat tube
  frame.add(tube(HT_BOT, HT_TOP, 0.036, mats.frame));                // head tube
  for (const s of [-1, 1]) {
    frame.add(tube(V(s * 0.03, BB.y, BB.z), V(s * 0.07, R_AXLE.y, R_AXLE.z), 0.016, mats.frame));     // chainstays
    frame.add(tube(V(s * 0.02, 0.72, -0.27), V(s * 0.07, R_AXLE.y + 0.02, R_AXLE.z), 0.014, mats.frame)); // seatstays
  }
  // rear shock with a spring
  {
    const a = V(0, 0.55, 0.05), b = V(0, 0.73, -0.25);
    frame.add(tube(a, b, 0.022, mats.metal));
    const spring = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 14), mats.spring);
    for (let i = 0; i < 6; i++) { const s = spring.clone(); const t = 0.2 + i * 0.11; s.position.lerpVectors(a, b, t); s.lookAt(b.clone().add(b.clone().sub(a))); frame.add(s); }
  }
  frame.add(tube(SEAT_J, SEAT_TOP, 0.016, mats.metal));             // seat post
  {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.27), mats.dark);
    seat.geometry.translate(0, 0, 0.03);
    seat.position.copy(SEAT_TOP).add(V(0, 0.02, 0)); seat.rotation.x = 0.08; seat.castShadow = true; frame.add(seat);
  }
  // cranks + chainring
  const crank = new THREE.Group(); crank.position.copy(BB); frame.add(crank);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.006, 24), mats.metal); ring.rotation.z = Math.PI / 2; ring.position.x = -0.06; crank.add(ring);
  const pedals = [];
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.17), mats.dark); arm.geometry.translate(0, 0, s * 0.085); arm.position.x = s * 0.08; crank.add(arm);
    const pd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.018, 0.1), mats.dark); pd.position.set(s * 0.13, 0, s * 0.17); crank.add(pd); pedals.push(pd);
  }
  // chain (simple loop)
  {
    const pts = [V(-0.06, BB.y + 0.085, BB.z), V(-0.06, R_AXLE.y + 0.05, R_AXLE.z), V(-0.06, R_AXLE.y - 0.05, R_AXLE.z), V(-0.06, BB.y - 0.085, BB.z)];
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const ch = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.005, 4, true), mats.metal); frame.add(ch);
  }
  const rear = makeWheel(mats); rear.position.copy(R_AXLE); frame.add(rear);
  addDecal(frame, mats);

  // --------------------------------------------------------------- front end: fork, wheel, bars (steers + barspins)
  const steer = new THREE.Group(); steer.position.copy(HT_TOP); root.add(steer);
  const front = new THREE.Group(); front.position.copy(HT_TOP).negate(); steer.add(front);
  const crown = HT_BOT.clone().add(STEER_AXIS.clone().multiplyScalar(-0.06));
  for (const s of [-1, 1]) {
    front.add(tube(V(s * 0.075, crown.y, crown.z), V(s * 0.075, F_AXLE.y + 0.18, F_AXLE.z - 0.09), 0.02, mats.metal));     // stanchions
    front.add(tube(V(s * 0.075, F_AXLE.y + 0.22, F_AXLE.z - 0.11), V(s * 0.075, F_AXLE.y, F_AXLE.z), 0.026, mats.fork));   // lowers
    front.add(tube(V(s * 0.075, HT_TOP.y + 0.03, HT_TOP.z - 0.04), V(s * 0.075, crown.y, crown.z), 0.018, mats.metal));    // dual crown uppers
  }
  for (const y of [crown.y, HT_TOP.y + 0.03]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.06), mats.dark); c.position.set(0, y, y === crown.y ? crown.z : HT_TOP.z - 0.04); c.castShadow = true; front.add(c); }
  const BAR_C = V(0, HT_TOP.y + 0.08, HT_TOP.z - 0.02);
  const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.8, 8); barGeo.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeo, mats.dark); bar.position.copy(BAR_C); bar.castShadow = true; front.add(bar);
  for (const s of [-1, 1]) { const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.13, 8), mats.grip); gr.rotation.z = Math.PI / 2; gr.position.set(s * 0.34, BAR_C.y, BAR_C.z); front.add(gr); }
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), mats.plate); plate.position.set(0, BAR_C.y - 0.03, BAR_C.z + 0.06); plate.rotation.x = -0.2; front.add(plate);
  const frontW = makeWheel(mats); frontW.position.copy(F_AXLE); front.add(frontW);
  const GRIPS = [V(0.33, BAR_C.y, BAR_C.z), V(-0.33, BAR_C.y, BAR_C.z)];

  // --------------------------------------------------------------- rider (its own group so it can fly off in a crash)
  const rider = new THREE.Group();
  const limb = (r0, r1, m) => { const g = new THREE.CylinderGeometry(r1, r0, 1, 10, 1); g.translate(0, 0.5, 0); const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; rider.add(mesh); return mesh; };
  const ball = (r, m, sx = 1, sy = 1, sz = 1) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); mesh.scale.set(sx, sy, sz); mesh.castShadow = true; rider.add(mesh); return mesh; };
  const P = {
    thigh: [limb(0.085, 0.07, mats.pants), limb(0.085, 0.07, mats.pants)],
    shin: [limb(0.065, 0.05, mats.pants), limb(0.065, 0.05, mats.pants)],
    knee: [ball(0.075, mats.pad), ball(0.075, mats.pad)],
    shoe: [ball(0.06, mats.shoe, 1, 0.7, 2), ball(0.06, mats.shoe, 1, 0.7, 2)],
    upper: [limb(0.055, 0.048, mats.jersey), limb(0.055, 0.048, mats.jersey)],
    fore: [limb(0.047, 0.04, mats.jersey), limb(0.047, 0.04, mats.jersey)],
    elbow: [ball(0.05, mats.jersey), ball(0.05, mats.jersey)],
    hand: [ball(0.045, mats.glove), ball(0.045, mats.glove)],
    shoulder: [ball(0.065, mats.jersey), ball(0.065, mats.jersey)],
    hips: ball(0.16, mats.pants, 1.1, 0.75, 0.9),
  };
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.32, 6, 14), mats.jersey);
  torso.castShadow = true; rider.add(torso);
  const pack = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.16, 4, 10), mats.dark); pack.castShadow = true; rider.add(pack);
  const head = new THREE.Group(); head.scale.setScalar(0.86); rider.add(head);
  {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.16, 22, 16), mats.helmet); shell.scale.set(0.95, 1, 1.12); shell.castShadow = true; head.add(shell);
    const chin = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 8, 18, Math.PI), mats.helmet); chin.rotation.set(Math.PI / 2 + 0.5, 0, 0); chin.position.set(0, -0.07, 0.06); head.add(chin);
    const peak = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.015, 0.12), mats.helmet); peak.position.set(0, 0.08, 0.17); peak.rotation.x = -0.25; head.add(peak);
    const gog = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.06, 20, 1, true, -1.1, 2.2), mats.goggle); gog.position.set(0, 0.0, 0.03); gog.scale.set(1, 1, 1.05); head.add(gog);
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.012, 4, 24), mats.strap); strap.rotation.x = Math.PI / 2; strap.position.y = 0.0; head.add(strap);
  }

  // --------------------------------------------------------------- posing
  const ik = (a, b, l1, l2, hint, out) => {
    const d = b.clone().sub(a); let len = d.length();
    const maxL = (l1 + l2) * 0.999; if (len > maxL) { d.multiplyScalar(maxL / len); len = maxL; b = a.clone().add(d); }
    const dir = d.clone().normalize();
    const along = (l1 * l1 - l2 * l2 + len * len) / (2 * len);
    const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
    const perp = hint.clone().sub(dir.clone().multiplyScalar(hint.dot(dir))).normalize();
    out.copy(a).addScaledVector(dir, along).addScaledVector(perp, h);
    return b;
  };
  const between = (m, a, b) => {
    const d = b.clone().sub(a), len = d.length() || 0.001;
    m.position.copy(a); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.divideScalar(len)); m.scale.set(1, len, 1);
  };
  const lerpV = (a, b, t) => a.clone().lerp(b, t);
  const tmp = { k: V(0, 0, 0), e: V(0, 0, 0) };
  const steerQ = new THREE.Quaternion(), whipQ = new THREE.Quaternion();

  // pose: { steer, crouch, lean, crank, wheel, superman, nohand, whip (0..2π), bar (0..2π), manual, crashed }
  function pose(p) {
    // wheels + cranks
    rear.rotation.x = p.wheel; frontW.rotation.x = p.wheel;
    crank.rotation.x = p.crank;
    // steering / barspin
    steerQ.setFromAxisAngle(STEER_AXIS, -p.steer * 0.35 + p.bar);
    steer.quaternion.copy(steerQ);
    whipQ.setFromAxisAngle(whipAxis, p.whip);
    whipPivot.quaternion.copy(whipQ);
    if (p.crashed) return;

    const c = p.crouch, l = p.lean, s = p.superman, n = p.nohand, m = p.manual;
    const whipOn = p.whip > 0.05 && p.whip < Math.PI * 2 - 0.05 ? 1 : 0;
    const barOff = p.bar > 0.25 && p.bar < Math.PI * 2 - 0.25 ? 1 : 0;
    // feet on pedals (in frame space, which may be whipping)
    root.updateMatrixWorld(true);
    // work in bike space: rider shares the bike's transform while riding
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const toLocal = obj => { const w = new THREE.Vector3(); obj.getWorldPosition(w); return w.applyMatrix4(inv); };
    let feet = [toLocal(pedals[1]).add(V(0, 0.05, 0)), toLocal(pedals[0]).add(V(0, 0.05, 0))];

    let hip = V(0, 1.06 - 0.2 * c - 0.05 * m, -0.33 - 0.04 * c + 0.1 * l - 0.22 * m);
    let sh = V(0, 1.45 - 0.18 * c - 0.05 * m, 0.0 + 0.04 * c + 0.12 * l - 0.2 * m);
    // grips follow the bars
    const grip = i => { const w = GRIPS[i].clone(); front.localToWorld(w); return w.applyMatrix4(inv); };
    let hands = [grip(0), grip(1)];

    if (s > 0.01) {
      hip = lerpV(hip, V(0, 1.22, -0.72), s); sh = lerpV(sh, V(0, 1.24, 0.08), s);
      feet = feet.map((f, i) => lerpV(f, V(i ? -0.14 : 0.14, 1.18 + 0.05 * Math.sin(i), -1.42), s));
    }
    if (n > 0.01) {
      sh = lerpV(sh, V(0, 1.5, -0.08), n); hip = lerpV(hip, V(0, 1.02, -0.36), n);
      hands = hands.map((h, i) => lerpV(h, V(i ? -0.78 : 0.78, 1.55, -0.02), n));
    }
    if (whipOn) {
      const k = Math.min(1, Math.sin(Math.min(Math.PI, p.whip * 0.5 + 0.3)) * 2);
      feet = feet.map((f, i) => lerpV(f, V(i ? -0.38 : 0.38, 0.78, -0.25), k));
      hip = lerpV(hip, V(0, 1.15, -0.22), k);
    }
    if (barOff) hands = hands.map((h, i) => lerpV(h, V(i ? -0.28 : 0.28, 1.3, 0.22), 1));

    const shoulders = [sh.clone().add(V(0.19, 0, -0.02)), sh.clone().add(V(-0.19, 0, -0.02))];
    const hips = [hip.clone().add(V(0.1, -0.04, 0)), hip.clone().add(V(-0.1, -0.04, 0))];
    for (let i = 0; i < 2; i++) {
      const sx = i ? -1 : 1;
      // legs
      const foot = ik(hips[i], feet[i], 0.46, 0.46, V(sx * 0.35, 0.1, 1), tmp.k);
      const knee = tmp.k.clone();
      between(P.thigh[i], hips[i], knee); between(P.shin[i], knee, foot);
      P.knee[i].position.copy(knee).add(V(0, 0, 0.03));
      P.shoe[i].position.copy(foot).add(V(0, -0.02, 0.03));
      P.shoe[i].rotation.set(0, 0, 0);
      // arms
      const hand = ik(shoulders[i], hands[i], 0.31, 0.3, V(sx * 1, -0.4, -0.5), tmp.e);
      const elbow = tmp.e.clone();
      between(P.upper[i], shoulders[i], elbow); between(P.fore[i], elbow, hand);
      P.elbow[i].position.copy(elbow); P.hand[i].position.copy(hand); P.shoulder[i].position.copy(shoulders[i]);
    }
    P.hips.position.copy(hip);
    // torso from hips to neck
    const neck = sh.clone();
    const mid = hip.clone().lerp(neck, 0.52);
    torso.position.copy(mid);
    const up = neck.clone().sub(hip); const tl = up.length(); up.normalize();
    torso.quaternion.setFromUnitVectors(V(0, 1, 0), up);
    torso.scale.set(1.2, tl / 0.62, 0.85);
    pack.position.copy(mid).add(V(0, 0.05, -0.16).applyQuaternion(torso.quaternion)); pack.quaternion.copy(torso.quaternion);
    // head: above the neck, looking ahead
    head.position.copy(neck).addScaledVector(up, 0.2).add(V(0, 0, 0.06));
    head.rotation.set(0.25 - 0.3 * c * 0 + (s * 0.6), 0, 0);
  }
  pose({ steer: 0, crouch: 0, lean: 0, crank: 0, wheel: 0, superman: 0, nohand: 0, whip: 0, bar: 0, manual: 0 });

  function setLook(look2) { applyLook(mats, look2); }
  return { root, rider, pose, setLook, mats, head, headPos: () => head.position };
}

function makeWheel(m) {
  const w = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.305, 0.055, 14, 48), m.tire);
  tire.rotation.y = Math.PI / 2; tire.castShadow = true; w.add(tire);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.014, 8, 48), m.rim); rim.rotation.y = Math.PI / 2; w.add(rim);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.13, 10), m.metal); hub.rotation.z = Math.PI / 2; w.add(hub);
  const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.004, 24), m.rotor); rotor.rotation.z = Math.PI / 2; rotor.position.x = 0.055; w.add(rotor);
  // spokes
  const sp = [];
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * Math.PI * 2, side = i % 2 ? 1 : -1;
    const g = new THREE.CylinderGeometry(0.0018, 0.0018, 0.27, 3);
    g.translate(0, 0.27 / 2 + 0.015, 0);
    g.rotateZ(side * 0.12 * 0); g.rotateX(a);
    g.translate(side * 0.03, 0, 0);
    sp.push(g);
  }
  const spokes = new THREE.Mesh(mergeSimple(sp), m.metal); w.add(spokes);
  return w;
}

function mergeSimple(list) {
  let n = 0; for (const g of list) n += g.index.count;
  const pos = [], idx = []; let vo = 0;
  for (const g of list) { const p = g.attributes.position.array; for (let i = 0; i < p.length; i++) pos.push(p[i]); for (const i of g.index.array) idx.push(i + vo); vo += p.length / 3; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setIndex(idx); out.computeVertexNormals();
  return out;
}

function addDecal(frame, mats) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64;
  const g = c.getContext('2d'); g.clearRect(0, 0, 512, 64);
  g.fillStyle = '#fff'; g.font = 'italic 900 52px Nunito, Arial Black, sans-serif'; g.textBaseline = 'middle'; g.fillText('RUSH', 12, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.4, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const a = HT_BOT, b = BB, d = b.clone().sub(a), len = d.length();
  for (const s of [-1, 1]) {
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.6, len * 0.075), m);
    pl.position.copy(a).lerp(b, 0.48).add(V(s * 0.033, 0, 0));
    pl.rotation.set(0, s * Math.PI / 2, Math.atan2(d.y, -d.z) * s * -1 + (s < 0 ? Math.PI : 0));
    pl.rotation.order = 'YXZ';
    frame.add(pl);
  }
}

function makeMaterials(T, env, look) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.9, ...o });
  const phys = (o) => new THREE.MeshPhysicalMaterial({ envMap: env, envMapIntensity: 1, ...o });
  const m = {
    frame: phys({ color: 0xe53935, roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08 }),
    metal: std({ color: 0xb8bcc4, roughness: 0.25, metalness: 1 }),
    fork: phys({ color: 0x111111, roughness: 0.3, metalness: 0.4, clearcoat: 0.8 }),
    spring: std({ color: 0xff8f00, roughness: 0.3, metalness: 0.6 }),
    dark: std({ color: 0x1a1b1e, roughness: 0.6, metalness: 0.2 }),
    rim: std({ color: 0x15161a, roughness: 0.35, metalness: 0.8 }),
    rotor: std({ color: 0xd0d4da, roughness: 0.2, metalness: 1 }),
    tire: std({ color: 0x1c1c1c, roughness: 0.9, bumpMap: T.tread, bumpScale: 3 }),
    grip: std({ color: 0x222222, roughness: 0.95 }),
    plate: std({ color: 0xffffff, roughness: 0.6 }),
    jersey: std({ color: 0x1e88e5, roughness: 0.85, envMapIntensity: 0.4 }),
    pants: std({ color: 0x23262d, roughness: 0.9, envMapIntensity: 0.3 }),
    pad: std({ color: 0x111215, roughness: 0.7 }),
    shoe: std({ color: 0x202226, roughness: 0.8 }),
    glove: std({ color: 0x15161a, roughness: 0.85 }),
    helmet: phys({ color: 0xffffff, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 }),
    goggle: phys({ color: 0xffb300, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    strap: std({ color: 0x111111, roughness: 0.8 }),
  };
  applyLook(m, look);
  return m;
}

function applyLook(m, look) {
  if (look.frame !== undefined) m.frame.color.setHex(look.frame);
  if (look.jersey !== undefined) m.jersey.color.setHex(look.jersey);
  if (look.helmet !== undefined) m.helmet.color.setHex(look.helmet);
  if (look.pants !== undefined) m.pants.color.setHex(look.pants);
}

export { STEER_AXIS };
