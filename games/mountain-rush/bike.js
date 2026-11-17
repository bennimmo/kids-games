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

// The bikes. Stats change how they ride (physics.js), look changes the model.
//   size: whole bike scale (BMX is small), shock: rear suspension, dual: dual-crown fork, rigid: no fork travel
export const BIKES = {
  downhill: { name: 'Downhill', sub: 'Fast and steady. Soaks up bumps', unlock: 0, size: 1, shock: true, dual: true,
    stats: { pedal: 1, drag: 1, grip: 1, spin: 1, pop: 1, soak: 1.6 } },
  enduro: { name: 'Enduro', sub: 'Light. Pedals and turns well', unlock: 0, size: 0.97, shock: true, dual: false,
    stats: { pedal: 1.2, drag: 1.06, grip: 1.05, spin: 1.1, pop: 1.05, soak: 1.45 } },
  dirtjump: { name: 'Dirt Jump', sub: 'Pops high, spins fast', unlock: 5000, size: 0.9, shock: false, dual: false,
    stats: { pedal: 1.15, drag: 1.12, grip: 0.92, spin: 1.3, pop: 1.25, soak: 1.25 } },
  bmx: { name: 'BMX', sub: 'Tiny trick machine. Slow downhill', unlock: 15000, size: 0.72, shock: false, dual: false, rigid: true,
    stats: { pedal: 1.3, drag: 1.25, grip: 0.86, spin: 1.45, pop: 1.3, soak: 1.1 } },
};
export const BIKE_ORDER = ['downhill', 'enduro', 'dirtjump', 'bmx'];
// outfit options; a gold set unlocks at GOLD points
export const GOLD = 20000;
export const OUTFIT = {
  helmet: [0xffffff, 0x111111, 0xe53935, 0x1e88e5, 0xfdd835, 0x43a047, 0xff7043, 0x8e24aa],
  pants: [0x23262d, 0x3b4a5a, 0x5a4636, 0x1e3a5f, 0x7a1f1f, 0x2f4f2f, 0xd0d0d0, 0x111111],
  goggle: [0xffb300, 0x00b0ff, 0xff4081, 0x76ff03, 0xeeeeee, 0x212121],
  helmetType: ['Full face', 'Open face'],
};
export const GOLD_HEX = 0xd4a017;

export const COLORS = {
  frame: [0xe53935, 0x1e88e5, 0x43a047, 0xfdd835, 0x212121, 0xff7043, 0x8e24aa, 0xf5f5f5],
  jersey: [0x1e88e5, 0xe53935, 0x111111, 0xfdd835, 0x43a047, 0xff7043, 0x8e24aa, 0xffffff],
};

export function createBike(T, env, look = {}, type = 'downhill') {
  const BK = BIKES[type] || BIKES.downhill;
  const root = new THREE.Group();           // placed from physics each frame
  const body = new THREE.Group(); root.add(body);   // the whole bike; tilts sideways for a table top
  const sizer = new THREE.Group(); sizer.scale.setScalar(BK.size); body.add(sizer);
  const mats = makeMaterials(T, env, look);

  // --------------------------------------------------------------- frame (can tailwhip around the steering axis)
  const whipPivot = new THREE.Group(); whipPivot.position.copy(HT_TOP);
  const whipAxis = STEER_AXIS.clone();
  const frame = new THREE.Group(); frame.position.copy(HT_TOP).negate();
  whipPivot.add(frame); sizer.add(whipPivot);
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
  if (BK.shock) {
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
  const steer = new THREE.Group(); steer.position.copy(HT_TOP); sizer.add(steer);
  const front = new THREE.Group(); front.position.copy(HT_TOP).negate(); steer.add(front);
  const crown = HT_BOT.clone().add(STEER_AXIS.clone().multiplyScalar(-0.06));
  for (const s of [-1, 1]) {
    front.add(tube(V(s * 0.075, crown.y, crown.z), V(s * 0.075, F_AXLE.y + 0.18, F_AXLE.z - 0.09), 0.02, mats.metal));     // stanchions
    front.add(tube(V(s * 0.075, F_AXLE.y + 0.22, F_AXLE.z - 0.11), V(s * 0.075, F_AXLE.y, F_AXLE.z), 0.026, mats.fork));   // lowers
    if (BK.dual) front.add(tube(V(s * 0.075, HT_TOP.y + 0.03, HT_TOP.z - 0.04), V(s * 0.075, crown.y, crown.z), 0.018, mats.metal));    // dual crown uppers
  }
  for (const y of BK.dual ? [crown.y, HT_TOP.y + 0.03] : [crown.y]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.06), mats.dark); c.position.set(0, y, y === crown.y ? crown.z : HT_TOP.z - 0.04); c.castShadow = true; front.add(c); }
  const BAR_C = V(0, HT_TOP.y + 0.08, HT_TOP.z - 0.02);
  const barGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.8, 8); barGeo.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeo, mats.dark); bar.position.copy(BAR_C); bar.castShadow = true; front.add(bar);
  for (const s of [-1, 1]) { const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.13, 8), mats.grip); gr.rotation.z = Math.PI / 2; gr.position.set(s * 0.34, BAR_C.y, BAR_C.z); front.add(gr); }
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), mats.plate); plate.position.set(0, BAR_C.y - 0.03, BAR_C.z + 0.06); plate.rotation.x = -0.2; front.add(plate);
  const frontW = makeWheel(mats); frontW.position.copy(F_AXLE); front.add(frontW);
  const GRIPS = [V(0.33, BAR_C.y, BAR_C.z), V(-0.33, BAR_C.y, BAR_C.z)];

  // --------------------------------------------------------------- rider (its own group so it can fly off in a crash)
  const rider = new THREE.Group();
  const add = (g, m, shadow = true) => { const mesh = new THREE.Mesh(g, m); mesh.castShadow = shadow; rider.add(mesh); return mesh; };
  // smooth tapered limb, 1 m long along +y (scaled to fit between two joints each frame)
  const limbGeo = (r0, r1, bulge = 0, at = 0.4, seg = 14) => {
    const pts = [new THREE.Vector2(0.0001, -0.04)];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new THREE.Vector2(r0 + (r1 - r0) * t + bulge * Math.exp(-((t - at) ** 2) / 0.06), t)); }
    pts.push(new THREE.Vector2(0.0001, 1.04));
    return new THREE.LatheGeometry(pts, seg);
  };
  const P = {
    thigh: [0, 1].map(() => add(limbGeo(0.088, 0.066, 0.012, 0.35), mats.pants)),
    shin: [0, 1].map(() => add(limbGeo(0.066, 0.052, 0.01, 0.3), mats.pants)),
    knee: [0, 1].map(() => add(new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), mats.pad)),
    shoe: [0, 1].map(() => add(shoeGeo(), mats.shoe)),
    sole: [0, 1].map(() => add(new THREE.BoxGeometry(0.1, 0.022, 0.27), mats.sole, false)),
    upper: [0, 1].map(() => add(limbGeo(0.058, 0.048, 0.008, 0.4), mats.sleeve)),
    fore: [0, 1].map(() => add(limbGeo(0.047, 0.036, 0.006, 0.25), mats.sleeve)),
    elbow: [0, 1].map(() => add(new THREE.SphereGeometry(1, 14, 10), mats.pad)),
    cuff: [0, 1].map(() => add(new THREE.CylinderGeometry(0.042, 0.04, 0.07, 12), mats.glove)),
    hand: [0, 1].map(() => add(handGeo(), mats.glove)),
    shoulder: [0, 1].map(() => add(new THREE.SphereGeometry(0.07, 16, 12), mats.sleeve)),
  };
  // body: one smooth shape from hips to collar; shorts over the hips
  const torsoGeo = new THREE.LatheGeometry([[0.0001, -0.02], [0.15, 0], [0.142, 0.18], [0.135, 0.3], [0.15, 0.5], [0.165, 0.7], [0.168, 0.82], [0.13, 0.93], [0.07, 0.99], [0.055, 1.02], [0.0001, 1.03]].map(([r, y]) => new THREE.Vector2(r, y)), 24);
  const torso = add(torsoGeo, mats.jersey);
  const shorts = add(new THREE.LatheGeometry([[0.0001, -0.12], [0.13, -0.1], [0.155, -0.02], [0.148, 0.08], [0.13, 0.12], [0.0001, 0.13]].map(([r, y]) => new THREE.Vector2(r, y)), 24), mats.pants);
  const neck = add(new THREE.CylinderGeometry(0.046, 0.052, 0.08, 12), mats.skin);
  const pack = add(roundBox(0.2, 0.26, 0.08, 0.035), mats.packM);
  const straps = [0, 1].map(() => add(new THREE.TorusGeometry(0.11, 0.012, 6, 16, Math.PI), mats.strap, false));
  const head = new THREE.Group(); head.scale.setScalar(0.86); rider.add(head);
  {
    const H = (g, m) => { const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; head.add(mesh); return mesh; };
    // face underneath (seen through the opening)
    const face = H(new THREE.SphereGeometry(0.115, 18, 14), mats.skin); face.scale.set(0.92, 1.05, 1); face.position.set(0, -0.025, 0.035);
    // helmet shell: a smooth dome, longer front to back
    const shell = H(new THREE.SphereGeometry(0.162, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.58), mats.helmet); shell.scale.set(0.95, 1.02, 1.12); shell.position.y = 0.005;
    const back = H(new THREE.SphereGeometry(0.158, 24, 12, Math.PI * 0.6, Math.PI * 0.8, Math.PI * 0.55, Math.PI * 0.25), mats.helmet); back.scale.set(0.95, 1, 1.1);
    const inner = H(new THREE.SphereGeometry(0.155, 20, 14), mats.helmetIn); inner.material.side = THREE.BackSide; inner.scale.set(0.94, 1, 1.1);
    // chin bar (full face)
    const chin = H(new THREE.TorusGeometry(0.13, 0.032, 10, 24, Math.PI), mats.helmet); chin.rotation.set(Math.PI / 2 + 0.25, 0, 0); chin.position.set(0, -0.085, 0.01); chin.scale.set(0.92, 1.2, 1.25);
    const vent = H(new THREE.BoxGeometry(0.07, 0.02, 0.025), mats.dark); vent.position.set(0, -0.085, 0.165);
    chin.visible = vent.visible = !look.open; head.userData.chin = chin; head.userData.vent = vent;
    // peak
    const peak = H(roundBox(0.2, 0.012, 0.11, 0.005), mats.helmet); peak.rotation.x = 0.1; peak.position.set(0, 0.075, 0.17);
    // vents on top
    for (const x of [-0.05, 0, 0.05]) { const v = H(new THREE.BoxGeometry(0.018, 0.012, 0.09), mats.dark); v.position.set(x, 0.158, 0.02); v.rotation.x = 0.15; }
    // goggles: frame + shiny lens + strap round the helmet
    const gframe = H(new THREE.CylinderGeometry(0.152, 0.152, 0.068, 24, 1, true, -1.05, 2.1), mats.goggleFrame); gframe.position.set(0, 0.012, 0.03); gframe.scale.set(1, 1, 1.08);
    const lens = H(new THREE.CylinderGeometry(0.156, 0.156, 0.05, 24, 1, true, -0.9, 1.8), mats.goggle); lens.position.set(0, 0.012, 0.032); lens.scale.set(1, 1, 1.08);
    const strap = H(new THREE.TorusGeometry(0.16, 0.013, 4, 32), mats.strap); strap.rotation.x = Math.PI / 2; strap.position.y = 0.012; strap.scale.set(0.95, 1.1, 1);
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
  const strapQ = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), Math.PI / 2);
  const ox = V(0, 0, 0), oz = V(0, 0, 0), om = new THREE.Matrix4();
  // point a mesh's +y along yDir, turned so its +x is square to `hint`
  const orient = (m, yDir, hint) => {
    const y = yDir.clone().normalize();
    ox.crossVectors(hint, y); if (ox.lengthSq() < 1e-6) ox.set(1, 0, 0); ox.normalize();
    oz.crossVectors(ox, y).normalize();
    om.makeBasis(ox, y, oz); m.quaternion.setFromRotationMatrix(om);
  };
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
    // table top: bike lies over sideways, pivoting near the rider's hands
    const tb = p.table || 0;
    body.position.set(0, 0, 0); body.rotation.set(0, 0, 0);
    if (tb > 0.01) { const piv = V(0, 1.0, 0.1); body.rotation.z = -tb * 1.15; body.position.copy(piv).sub(piv.clone().applyEuler(body.rotation)); }
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
    // smaller bikes: rider crouches lower and closer
    if (BK.size < 1) { const k = 0.45 + 0.55 * BK.size; hip.y *= k; sh.y *= k; hip.z *= BK.size; sh.z = sh.z * BK.size + (1 - BK.size) * 0.15; }
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
    const cc = p.cancan || 0, nf = p.nofoot || 0;
    if (cc > 0.01) feet[1] = lerpV(feet[1], V(0.32, 0.72, 0.25), cc);                      // one leg over the top tube
    if (nf > 0.01) { feet = feet.map((f, i) => lerpV(f, V(i ? -0.55 : 0.55, 0.85, 0.05), nf)); hip = lerpV(hip, V(0, 1.12, -0.3), nf); }
    if (tb > 0.01) hip = lerpV(hip, V(-0.12, 1.12, -0.28), tb);
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
      const shinDir = foot.clone().sub(knee).normalize();
      const kneeFwd = V(0, 0, 1).sub(shinDir.clone().multiplyScalar(shinDir.z)).normalize();
      orient(P.knee[i], shinDir.clone().negate().lerp(kneeFwd, 0.75).normalize(), shinDir);
      P.knee[i].position.copy(knee).addScaledVector(kneeFwd, 0.035).addScaledVector(shinDir, 0.05);
      P.knee[i].scale.set(0.068, 0.1, 0.062);
      P.shoe[i].position.copy(foot).add(V(0, -0.015, 0.035)); P.shoe[i].rotation.set(0.05, 0, 0);
      P.sole[i].position.copy(foot).add(V(0, -0.05, 0.035)); P.sole[i].rotation.set(0.05, 0, 0);
      // arms
      const hand = ik(shoulders[i], hands[i], 0.31, 0.3, V(sx * 1, -0.4, -0.5), tmp.e);
      const elbow = tmp.e.clone();
      between(P.upper[i], shoulders[i], elbow); between(P.fore[i], elbow, hand);
      const foreDir = hand.clone().sub(elbow).normalize();
      P.elbow[i].position.copy(elbow).add(V(sx * 0.008, 0, -0.022)); P.elbow[i].scale.set(0.045, 0.06, 0.04);
      P.cuff[i].position.copy(hand).addScaledVector(foreDir, -0.06); P.cuff[i].quaternion.setFromUnitVectors(V(0, 1, 0), foreDir);
      P.hand[i].position.copy(hand); orient(P.hand[i], foreDir, V(0, 1, 0));
      P.shoulder[i].position.copy(shoulders[i]);
    }
    // body: hips to neck, facing forward
    const neckP = sh.clone().add(V(0, 0.02, 0));
    const up = neckP.clone().sub(hip); const tl = up.length(); up.normalize();
    const side = V(1, 0, 0), fwd = new THREE.Vector3().crossVectors(side, up).normalize(); side.crossVectors(up, fwd).normalize();
    const basis = new THREE.Matrix4().makeBasis(side, up, fwd);
    torso.quaternion.setFromRotationMatrix(basis); torso.position.copy(hip).addScaledVector(up, -0.06);
    torso.scale.set(1.18, tl * 1.08, 0.78);
    shorts.quaternion.copy(torso.quaternion); shorts.position.copy(hip); shorts.scale.set(1.02, 1, 0.82);
    neck.position.copy(neckP).addScaledVector(up, 0.045); neck.quaternion.copy(torso.quaternion);
    pack.quaternion.copy(torso.quaternion); pack.position.copy(hip).addScaledVector(up, tl * 0.66).addScaledVector(fwd, -0.14);
    straps.forEach((st, i) => { st.quaternion.copy(torso.quaternion).multiply(strapQ); st.position.copy(hip).addScaledVector(up, tl * 0.78).addScaledVector(side, i ? -0.09 : 0.09).addScaledVector(fwd, -0.02); });
    // head: above the neck, looking ahead
    head.position.copy(neckP).addScaledVector(up, 0.155).addScaledVector(fwd, 0.05);
    head.rotation.set(0.25 - 0.3 * c * 0 + (s * 0.6), 0, 0);
  }
  pose({ steer: 0, crouch: 0, lean: 0, crank: 0, wheel: 0, superman: 0, nohand: 0, whip: 0, bar: 0, manual: 0 });

  function setLook(look2) { applyLook(mats, look2); if (head.userData.chin) head.userData.chin.visible = head.userData.vent.visible = !look2.open; }
  return { root, rider, pose, setLook, mats, head, headPos: () => head.position };
}

// shoe: rounded box, toe a bit narrower (built along +z, sole at y = 0)
function shoeGeo() {
  const g = new THREE.BoxGeometry(0.1, 0.075, 0.26, 4, 3, 6);
  const pa = g.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    let x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
    const t = (z + 0.13) / 0.26;                  // 0 heel .. 1 toe
    x *= 1 - 0.18 * t * t; y *= 1 - 0.25 * t * t;
    // round the edges
    const k = 0.75 + 0.25 * Math.cos(Math.max(Math.abs(x) / 0.05, Math.abs(y) / 0.0375) * 1.2);
    pa.setXYZ(i, x * (0.9 + 0.1 * k), y + 0.01, z);
  }
  g.computeVertexNormals();
  return g;
}
// gloved hand gripping: palm + curled fingers + thumb, along +y
function handGeo() {
  const palm = new THREE.SphereGeometry(0.042, 14, 10); palm.scale(1, 1.25, 0.75);
  const fing = new THREE.TorusGeometry(0.03, 0.017, 8, 12, Math.PI * 1.2); fing.rotateY(Math.PI / 2); fing.translate(0, 0.045, 0.012);
  const thumb = new THREE.CapsuleGeometry(0.012, 0.035, 4, 8); thumb.rotateZ(0.6); thumb.translate(-0.03, 0.03, 0.02);
  return mergeAll([palm, fing, thumb]);
}
function roundBox(w, h, d, r) {
  const g = new THREE.BoxGeometry(w, h, d, 6, 6, 4);
  const pa = g.attributes.position, v = new THREE.Vector3();
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  for (let i = 0; i < pa.count; i++) {
    v.set(pa.getX(i), pa.getY(i), pa.getZ(i));
    const c = new THREE.Vector3(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
    const dlt = v.clone().sub(c); if (dlt.lengthSq() > 0) dlt.setLength(r);
    pa.setXYZ(i, c.x + dlt.x, c.y + dlt.y, c.z + dlt.z);
  }
  g.computeVertexNormals();
  return g;
}
function mergeAll(list) {
  const pos = [], nrm = [], idx = []; let vo = 0;
  for (const g0 of list) {
    const g = g0.index ? g0 : g0;
    const p = g.attributes.position.array, n = g.attributes.normal.array;
    for (let i = 0; i < p.length; i++) { pos.push(p[i]); nrm.push(n[i]); }
    if (g.index) for (const i of g.index.array) idx.push(i + vo); else for (let i = 0; i < p.length / 3; i++) idx.push(i + vo);
    vo += p.length / 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); out.setIndex(idx);
  return out;
}

// jersey / trouser patterns, grey so the chosen colour tints them; knit bump for the cloth
let clothTex = null;
function cloth() {
  if (clothTex) return clothTex;
  const mk = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
  const jersey = mk(512, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    // darker side panels (u = 0.25 and 0.75 are the sides; u 0 front, 0.5 back)
    for (const cx of [0.25, 0.75]) { const gr = g.createLinearGradient((cx - 0.12) * w, 0, (cx + 0.12) * w, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.3, 'rgba(0,0,0,.45)'); gr.addColorStop(0.7, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect((cx - 0.12) * w, 0, 0.24 * w, h); }
    // chest stripes
    g.fillStyle = 'rgba(255,255,255,1)'; g.fillRect(0, h * 0.3, w, h * 0.05);
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, h * 0.36, w, h * 0.03);
    // number on the back
    g.fillStyle = 'rgba(0,0,0,.7)'; g.font = '900 72px Nunito, Arial Black, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('7', w * 0.5, h * 0.42);
    // collar
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, w, h * 0.04);
  });
  jersey.colorSpace = THREE.SRGBColorSpace;
  const knit = mk(128, 128, (g, w, h) => { const im = g.createImageData(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = 128 + 50 * Math.sin(x * 1.6) * Math.sin(y * 0.8 + (x % 2) * 1.5) + (Math.random() - 0.5) * 30; const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); });
  knit.repeat.set(6, 6);
  clothTex = { jersey, knit };
  return clothTex;
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
    sleeve: phys({ color: 0x1e88e5, roughness: 0.82, envMapIntensity: 0.35, bumpMap: cloth().knit, bumpScale: 0.6, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffffff }),
    jersey: phys({ color: 0x1e88e5, roughness: 0.82, envMapIntensity: 0.35, map: cloth().jersey, bumpMap: cloth().knit, bumpScale: 0.6, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffffff }),
    pants: phys({ color: 0x23262d, roughness: 0.88, envMapIntensity: 0.3, bumpMap: cloth().knit, bumpScale: 0.8, sheen: 0.4, sheenRoughness: 0.6, sheenColor: 0xbfc4cc }),
    pad: phys({ color: 0x2a2c31, roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.6 }),
    shoe: std({ color: 0x202226, roughness: 0.75 }),
    sole: std({ color: 0xd9d9d0, roughness: 0.9 }),
    glove: phys({ color: 0x15161a, roughness: 0.75, sheen: 0.3, sheenColor: 0x777777 }),
    skin: std({ color: 0xd9a27e, roughness: 0.6, envMapIntensity: 0.3 }),
    helmetIn: std({ color: 0x15161a, roughness: 0.9 }),
    goggleFrame: std({ color: 0x18191d, roughness: 0.5 }),
    packM: phys({ color: 0x2b2f36, roughness: 0.7, sheen: 0.3, sheenColor: 0x999999 }),
    helmet: phys({ color: 0xffffff, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 }),
    goggle: phys({ color: 0xffb300, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    strap: std({ color: 0x111111, roughness: 0.8 }),
  };
  applyLook(m, look);
  return m;
}

function applyLook(m, look) {
  if (look.frame !== undefined) m.frame.color.setHex(look.frame);
  if (look.jersey !== undefined) { m.jersey.color.setHex(look.jersey); m.sleeve.color.setHex(look.jersey); }
  if (look.helmet !== undefined) m.helmet.color.setHex(look.helmet);
  if (look.pants !== undefined) m.pants.color.setHex(look.pants);
  if (look.goggle !== undefined) m.goggle.color.setHex(look.goggle);
  const gold = c => c === GOLD_HEX;
  m.frame.metalness = gold(look.frame) ? 0.9 : 0.35; m.frame.roughness = gold(look.frame) ? 0.25 : 0.32;
  m.helmet.metalness = gold(look.helmet) ? 0.9 : 0.1;
}

export { STEER_AXIS };
