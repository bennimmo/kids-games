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

// The bikes: four made-up brands. Stats change how they ride (physics.js); each has its own frame.
//   frame: 'straight' | 'curved' | 'box' | 'hardtail'   shock: 'vertical' | 'under-top' | 'low' | null
//   fork: 'dual' | 'single'   size: whole-bike scale   wheel: tyre radius
export const BIKES = {
  talon: { name: 'Talon DH', sub: 'Downhill. Fast, steady, soaks up bumps', unlock: 0, size: 1, wheel: 0.36, frame: 'straight', shock: 'vertical', fork: 'dual', brand: 'TALON', accent: 0xffffff, rear: 0x1b1b1d,
    stats: { pedal: 1, drag: 1, grip: 1, spin: 1, pop: 1, soak: 1.6 } },
  vortex: { name: 'Vortex Enduro', sub: 'Light. Pedals and turns well', unlock: 0, size: 0.97, wheel: 0.36, frame: 'curved', shock: 'under-top', fork: 'single', brand: 'VORTEX', accent: 0x111111, rear: 0xf0f0f0,
    stats: { pedal: 1.2, drag: 1.06, grip: 1.05, spin: 1.1, pop: 1.05, soak: 1.45 } },
  granite: { name: 'Granite Slab', sub: 'Big and burly. Unshakeable in rocks', unlock: 5000, size: 1.02, wheel: 0.37, frame: 'box', shock: 'low', fork: 'dual', brand: 'GRANITE', accent: 0xffb300, rear: 0x9aa0a8,
    stats: { pedal: 0.92, drag: 0.97, grip: 1.08, spin: 0.92, pop: 0.95, soak: 1.85 } },
  kestrel: { name: 'Kestrel Air', sub: 'Dirt jumper. Pops high, spins fast', unlock: 12000, size: 0.9, wheel: 0.33, frame: 'hardtail', shock: null, fork: 'single', brand: 'KESTREL', accent: 0x00e5ff, rear: null,
    stats: { pedal: 1.15, drag: 1.12, grip: 0.92, spin: 1.3, pop: 1.25, soak: 1.25 } },
};
export const BIKE_ORDER = ['talon', 'vortex', 'granite', 'kestrel'];
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

export function createBike(T, env, look = {}, type = 'talon') {
  const BK = BIKES[type] || BIKES.talon;
  const root = new THREE.Group();           // placed from physics each frame
  const body = new THREE.Group(); root.add(body);   // the whole bike; tilts sideways for a table top
  const sizer = new THREE.Group(); sizer.scale.setScalar(BK.size); body.add(sizer);
  const chassis = new THREE.Group(); sizer.add(chassis);   // drops down as the suspension squashes
  const mats = makeMaterials(T, env, look, BK);
  const WR = BK.wheel;

  // ---- helpers: tubes lie in the bike's side plane, so oval/box sections face the right way
  const SIDE = V(1, 0, 0);
  const placeAlong = (mesh, a, b) => {
    const d = b.clone().sub(a), len = d.length(), y = d.divideScalar(len);
    const z = new THREE.Vector3().crossVectors(SIDE, y).normalize(), x = new THREE.Vector3().crossVectors(y, z);
    mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)); mesh.position.copy(a);
    mesh.castShadow = true; return len;
  };
  const tube = (parent, a, b, r0, r1 = r0, m = mats.frame, oval = 1) => {
    const len = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(r1, r0, len, 16, 1); g.translate(0, len / 2, 0); g.scale(oval, 1, 1);
    const mesh = new THREE.Mesh(g, m); placeAlong(mesh, a, b); parent.add(mesh); return mesh;
  };
  const boxTube = (parent, a, b, w, d, m = mats.frame) => {
    const len = a.distanceTo(b);
    const g = roundBox(w, len, d, Math.min(w, d) * 0.3); g.translate(0, len / 2, 0);
    const mesh = new THREE.Mesh(g, m); placeAlong(mesh, a, b); parent.add(mesh); return mesh;
  };
  const curveTube = (parent, pts, r, m = mats.frame) => {
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, r, 12, false);
    const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  const ball = (parent, p, r, m = mats.frame) => { const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); mesh.position.copy(p); mesh.castShadow = true; parent.add(mesh); return mesh; };

  // ---- key points (bike space)
  const R_AX = V(0, WR, -0.62), F_AX = V(0, WR, 0.63);
  const PIV = V(0, 0.47, -0.12);                       // main suspension pivot
  const SEAT_J = V(0, BK.frame === 'hardtail' ? 0.7 : 0.82, -0.31);
  const hard = BK.frame === 'hardtail';

  // --------------------------------------------------------------- frame (can tailwhip around the steering axis)
  const whipPivot = new THREE.Group(); whipPivot.position.copy(HT_TOP);
  const whipAxis = STEER_AXIS.clone();
  const frame = new THREE.Group(); frame.position.copy(HT_TOP).negate();
  whipPivot.add(frame); chassis.add(whipPivot);
  // head tube
  tube(frame, HT_BOT.clone().addScaledVector(STEER_AXIS, -0.02), HT_TOP.clone().addScaledVector(STEER_AXIS, 0.02), 0.04, 0.036);
  let shockMount = null;
  if (BK.frame === 'straight') {
    tube(frame, V(0, 0.95, 0.3), SEAT_J, 0.03, 0.025, mats.frame, 0.8);            // top tube
    tube(frame, HT_BOT, BB.clone().add(V(0, 0.04, 0.02)), 0.045, 0.038, mats.frame, 0.75); // big down tube
    tube(frame, BB, SEAT_J.clone().add(V(0, 0.08, -0.05)), 0.03, 0.026);            // seat tube
    shockMount = V(0, 0.6, 0.12);
    tube(frame, shockMount, V(0, 0.64, 0.2), 0.02, 0.02);                           // shock tab
  } else if (BK.frame === 'curved') {
    curveTube(frame, [V(0, 0.96, 0.3), V(0, 0.85, 0.1), V(0, 0.8, -0.1), SEAT_J.clone().add(V(0, 0.02, 0))], 0.03);
    curveTube(frame, [HT_BOT, V(0, 0.62, 0.3), V(0, 0.42, 0.1), BB.clone().add(V(0, 0.03, 0))], 0.042);
    tube(frame, BB, SEAT_J.clone().add(V(0, 0.1, -0.06)), 0.028, 0.025);
    shockMount = V(0, 0.84, 0.06);
  } else if (BK.frame === 'box') {
    boxTube(frame, V(0, 0.95, 0.3), SEAT_J, 0.06, 0.08);
    boxTube(frame, HT_BOT, BB.clone().add(V(0, 0.05, 0.03)), 0.08, 0.11);
    boxTube(frame, BB, SEAT_J.clone().add(V(0, 0.06, -0.04)), 0.05, 0.05);
    // gusset plates behind the head tube
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(-0.16, 0.02); sh.lineTo(-0.02, -0.17); sh.closePath();
    const gg = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false });
    for (const x of [-0.034, 0.022]) { const gm = new THREE.Mesh(gg, mats.frame); gm.rotation.y = -Math.PI / 2; gm.position.set(x, 0.93, 0.36); gm.castShadow = true; frame.add(gm); }
    shockMount = V(0, 0.44, 0.08);
    // idler pulley (high pivot look)
    const idl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16), mats.metal); idl.rotation.z = Math.PI / 2; idl.position.set(-0.06, 0.55, -0.1); frame.add(idl);
  } else {
    tube(frame, V(0, 0.93, 0.32), SEAT_J, 0.022, 0.02);                             // low sloping top tube
    tube(frame, HT_BOT, BB, 0.026, 0.024);
    tube(frame, BB, SEAT_J.clone().add(V(0, 0.08, -0.04)), 0.022, 0.02);
  }
  ball(frame, BB, 0.045, mats.dark);                                                 // bottom bracket shell
  // seat post + saddle (dropped low for downhill)
  const seatTop = SEAT_J.clone().add(V(0, hard ? 0.12 : 0.12, -0.08));
  tube(frame, SEAT_J, seatTop, 0.016, 0.016, mats.dark);
  { const sd = new THREE.Mesh(roundBox(0.13, 0.045, 0.26, 0.02), mats.saddle); sd.position.copy(seatTop).add(V(0, 0.025, 0.02)); sd.rotation.x = 0.06; sd.castShadow = true; frame.add(sd); }

  // ---- rear end: a swingarm that pivots (hardtails: stays fixed)
  const swing = new THREE.Group(); swing.position.copy(PIV); frame.add(swing);
  const L = p => p.clone().sub(PIV);                  // into swingarm space
  const axL = L(R_AX);
  for (const sx of [-1, 1]) {
    const cs0 = hard ? L(BB).add(V(sx * 0.03, 0, 0)) : V(sx * 0.04, -0.02, -0.02);
    if (BK.frame === 'box') boxTube(swing, cs0, axL.clone().add(V(sx * 0.07, 0, 0)), 0.035, 0.055, mats.frame2);
    else tube(swing, cs0, axL.clone().add(V(sx * 0.07, 0, 0)), 0.022, 0.016, mats.frame2, 0.8);     // chainstays
    const ssTop = hard ? L(SEAT_J).add(V(sx * 0.02, -0.02, 0)) : V(sx * 0.03, 0.27, -0.27);
    tube(swing, axL.clone().add(V(sx * 0.07, 0.02, 0)), ssTop, 0.016, 0.018, mats.frame2);          // seatstays
  }
  let swingShock = null;
  if (!hard) {
    // rocker / yoke up to where the shock bolts on
    const yokeTop = BK.shock === 'low' ? V(0, 0.1, -0.12) : BK.shock === 'under-top' ? V(0, 0.3, -0.1) : V(0, 0.26, -0.08);
    for (const sx of [-1, 1]) tube(swing, V(sx * 0.03, 0.27, -0.27), yokeTop.clone().add(V(sx * 0.03, 0, 0)), 0.015, 0.015, mats.frame2);
    tube(swing, V(0, 0, 0), yokeTop, 0.02, 0.018, mats.frame2, 0.8);
    swingShock = yokeTop;
    ball(swing, V(0, 0, 0), 0.03, mats.dark);                                         // pivot bolt
  }
  // rear wheel + cassette + derailleur
  const rear = makeWheel(mats, WR); rear.position.copy(axL); swing.add(rear);
  { const cas = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.03, 0.04, 18), mats.metal); cas.rotation.z = Math.PI / 2; cas.position.copy(axL).add(V(-0.05, 0, 0)); swing.add(cas);
    const der = new THREE.Mesh(roundBox(0.02, 0.09, 0.04, 0.008), mats.dark); der.position.copy(axL).add(V(-0.07, -0.07, 0.01)); swing.add(der);
    const cal = new THREE.Mesh(roundBox(0.03, 0.05, 0.08, 0.01), mats.caliper); cal.position.copy(axL).add(V(0.06, 0.08, 0.05)); swing.add(cal); }

  // ---- shock: body on the frame, shaft to the swingarm (re-aimed every frame)
  let shock = null;
  if (shockMount && swingShock) {
    const coil = BK.shock !== 'under-top';
    const bodyG = new THREE.CylinderGeometry(coil ? 0.026 : 0.032, coil ? 0.026 : 0.032, 0.13, 14); bodyG.translate(0, 0.065, 0);
    const shaftG = new THREE.CylinderGeometry(0.011, 0.011, 1, 10); shaftG.translate(0, 0.5, 0);
    const sb = new THREE.Mesh(bodyG, coil ? mats.dark : mats.airCan), ss = new THREE.Mesh(shaftG, mats.metal);
    sb.castShadow = ss.castShadow = true; frame.add(sb); frame.add(ss);
    let spring = null;
    if (coil) { const pts = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2 * 7; pts.push(V(Math.cos(a) * 0.034, i / 120, Math.sin(a) * 0.034)); }
      const sg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.0055, 6, false); spring = new THREE.Mesh(sg, mats.spring); spring.castShadow = true; frame.add(spring); }
    shock = { sb, ss, spring, a: shockMount };
  }
  const aimShock = () => {
    if (!shock) return;
    const b = swingShock.clone().applyQuaternion(swing.quaternion).add(PIV);
    const len = placeAlong(shock.sb, shock.a, b);
    placeAlong(shock.ss, shock.a, b); shock.ss.scale.set(1, len, 1);
    if (shock.spring) { placeAlong(shock.spring, shock.a.clone().lerp(b, 0.08), b); shock.spring.scale.set(1, len * 0.86, 1); }
  };

  // cranks + chainring + chain guide
  const crank = new THREE.Group(); crank.position.copy(BB); frame.add(crank);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.006, 28), mats.metal); ring.rotation.z = Math.PI / 2; ring.position.x = -0.06; crank.add(ring);
  const guide = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.008, 6, 20, Math.PI * 0.6), mats.dark); guide.rotation.y = Math.PI / 2; guide.position.set(-0.06, BB.y, BB.z); guide.rotation.z = 2.2; frame.add(guide);
  const pedals = [];
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(roundBox(0.022, 0.035, 0.19, 0.01), mats.crank); arm.geometry.translate(0, 0, sx * 0.085); arm.position.x = sx * 0.08; arm.castShadow = true; crank.add(arm);
    const pd = new THREE.Mesh(roundBox(0.1, 0.02, 0.1, 0.006), mats.dark); pd.position.set(sx * 0.13, 0, sx * 0.17); pd.castShadow = true; crank.add(pd); pedals.push(pd);
  }
  {
    const pts = [V(-0.06, BB.y + 0.075, BB.z), V(-0.06, R_AX.y + 0.05, R_AX.z), V(-0.06, R_AX.y - 0.05, R_AX.z), V(-0.06, BB.y - 0.075, BB.z)];
    const ch = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 48, 0.005, 4, true), mats.chain); frame.add(ch);
  }
  addDecal(frame, mats, BK);

  // --------------------------------------------------------------- front end: fork, wheel, bars (steers + barspins)
  const steer = new THREE.Group(); steer.position.copy(HT_TOP); chassis.add(steer);
  const front = new THREE.Group(); front.position.copy(HT_TOP).negate(); steer.add(front);
  const ax = STEER_AXIS;
  const crownLo = HT_BOT.clone().addScaledVector(ax, -0.05), crownHi = HT_TOP.clone().addScaledVector(ax, 0.03);
  const dual = BK.fork === 'dual';
  const legX = dual ? 0.078 : 0.072;
  const stanBot = F_AX.clone().addScaledVector(ax, 0.26);
  for (const sx of [-1, 1]) {
    const o = V(sx * legX, 0, 0);
    tube(front, (dual ? crownHi : crownLo).clone().add(o), stanBot.clone().add(o), dual ? 0.019 : 0.018, dual ? 0.019 : 0.018, mats.stanchion);
  }
  const crownM = (p, w) => { const c = new THREE.Mesh(roundBox(w, 0.035, 0.06, 0.012), mats.forkM); c.position.copy(p); c.quaternion.setFromUnitVectors(V(0, 1, 0), ax); c.castShadow = true; front.add(c); };
  crownM(crownLo, 0.2); if (dual) crownM(crownHi, 0.19);
  // lowers slide up the stanchions when the fork squashes
  const lowers = new THREE.Group(); front.add(lowers);
  for (const sx of [-1, 1]) {
    const o = V(sx * legX, 0, 0);
    tube(lowers, F_AX.clone().addScaledVector(ax, -0.02).add(o), F_AX.clone().addScaledVector(ax, 0.33).add(o), 0.026, 0.027, mats.forkM);
    ball(lowers, F_AX.clone().add(o), 0.022, mats.forkM);
  }
  if (!dual) { // arch over the tyre
    const arch = new THREE.Mesh(new THREE.TorusGeometry(legX, 0.014, 8, 18, Math.PI), mats.forkM);
    arch.position.copy(F_AX.clone().addScaledVector(ax, 0.32)); arch.quaternion.setFromUnitVectors(V(0, 1, 0), ax); arch.rotateX(-Math.PI / 2 + 0.2); arch.rotateX(Math.PI / 2); front.add(arch); lowers.add(arch);
  }
  { const cal = new THREE.Mesh(roundBox(0.03, 0.05, 0.08, 0.01), mats.caliper); cal.position.copy(F_AX).add(V(0.065, 0.08, -0.05)); lowers.add(cal); }
  const frontW = makeWheel(mats, WR); frontW.position.copy(F_AX); lowers.add(frontW);
  // stem + bars with rise and sweep, grips, brake levers
  const BAR_C = V(0, HT_TOP.y + 0.08, HT_TOP.z - 0.02);
  { const stem = new THREE.Mesh(roundBox(0.045, 0.04, 0.06, 0.012), mats.dark); stem.position.copy(HT_TOP).add(V(0, 0.06, 0.0)); stem.castShadow = true; front.add(stem); }
  const barPts = [V(-0.4, 0.035, -0.03), V(-0.2, 0.03, 0), V(-0.07, 0, 0.005), V(0.07, 0, 0.005), V(0.2, 0.03, 0), V(0.4, 0.035, -0.03)].map(p => p.add(BAR_C).add(V(0, -0.01, 0)));
  curveTube(front, barPts, 0.0115, mats.bar);
  for (const sx of [-1, 1]) {
    const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.13, 10), mats.grip); gr.rotation.z = Math.PI / 2; gr.position.set(sx * 0.34, BAR_C.y + 0.03, BAR_C.z - 0.025); front.add(gr);
    const lever = new THREE.Mesh(roundBox(0.012, 0.012, 0.1, 0.004), mats.metal); lever.position.set(sx * 0.27, BAR_C.y + 0.02, BAR_C.z + 0.04); lever.rotation.y = sx * 0.4; front.add(lever);
  }
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.15), mats.plate); plate.position.set(0, BAR_C.y - 0.04, BAR_C.z + 0.07); plate.rotation.x = -0.2; front.add(plate);
  const GRIPS = [V(0.33, BAR_C.y + 0.03, BAR_C.z - 0.025), V(-0.33, BAR_C.y + 0.03, BAR_C.z - 0.025)];
  const TRAVEL = dual ? 0.17 : 0.13, RTRAVEL = hard ? 0 : (dual ? 0.36 : 0.3);
  // squash the suspension: 0 = sagged at rest, 1 = bottomed out
  const setSusp = (f, r) => {
    lowers.position.copy(ax).multiplyScalar(TRAVEL * f);
    swing.rotation.x = RTRAVEL * r;
    const drop = (TRAVEL * f * ax.y + RTRAVEL * r * 0.49) * 0.5;
    chassis.position.y = -drop;
    aimShock();
  };
  setSusp(0.25, 0.25);

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
    setSusp(p.suspF ?? 0.25, p.suspR ?? 0.25);
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

// wheel: knobbly tyre (real knobs on the tread), rim, hub, 32 spokes, brake rotor
function makeWheel(m, R = 0.36) {
  const w = new THREE.Group();
  const tr = 0.055, rr = R - tr;
  const tire = new THREE.Mesh(new THREE.TorusGeometry(rr, tr, 16, 64), m.tire);
  tire.rotation.y = Math.PI / 2; tire.castShadow = true; w.add(tire);
  // knobs: little blocks round the tread, two rows of side knobs
  const knobs = [];
  const nK = Math.round(R * 150);
  for (let i = 0; i < nK; i++) {
    const a = i / nK * Math.PI * 2;
    for (const [off, sz] of [[0, 0.016], [i % 2 ? 0.032 : -0.032, 0.013]]) {
      const g = new THREE.BoxGeometry(sz * 1.4, 0.009, sz);
      g.translate(off, R - 0.003, 0); g.rotateX(a);
      knobs.push(g);
    }
  }
  const km = new THREE.Mesh(mergeSimple(knobs), m.tire); km.castShadow = true; w.add(km);
  const wall = new THREE.Mesh(new THREE.TorusGeometry(rr - 0.012, tr * 0.72, 8, 48), m.tireWall); wall.rotation.y = Math.PI / 2; wall.scale.set(1, 1, 1.3); w.add(wall);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(rr - 0.02, 0.014, 8, 48), m.rim); rim.rotation.y = Math.PI / 2; rim.scale.set(1, 1, 1.6); w.add(rim);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.13, 12), m.metal); hub.rotation.z = Math.PI / 2; w.add(hub);
  const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.004, 28), m.rotor); rotor.rotation.z = Math.PI / 2; rotor.position.x = 0.058; w.add(rotor);
  const sp = [];
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * Math.PI * 2, side = i % 2 ? 1 : -1, len = rr - 0.05;
    const g = new THREE.CylinderGeometry(0.0016, 0.0016, len, 3);
    g.translate(0, len / 2 + 0.025, 0); g.rotateZ(-side * 0.08); g.rotateX(a + side * 0.12); g.translate(side * 0.03, 0, 0);
    sp.push(g);
  }
  w.add(new THREE.Mesh(mergeSimple(sp), m.metal));
  return w;
}

function mergeSimple(list) {
  let n = 0; for (const g of list) n += g.index.count;
  const pos = [], idx = []; let vo = 0;
  for (const g of list) { const p = g.attributes.position.array; for (let i = 0; i < p.length; i++) pos.push(p[i]); for (const i of g.index.array) idx.push(i + vo); vo += p.length / 3; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setIndex(idx); out.computeVertexNormals();
  return out;
}

// brand name on both sides of the down tube
function addDecal(frame, mats, BK) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64;
  const g = c.getContext('2d'); g.clearRect(0, 0, 512, 64);
  g.fillStyle = '#' + new THREE.Color(BK.accent).getHexString(); g.font = 'italic 900 50px Nunito, Arial Black, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'center';
  g.fillText(BK.brand, 256, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
  const a = HT_BOT, b = BB, d = b.clone().sub(a), len = d.length();
  const ang = Math.atan2(d.y, d.z);
  const r = BK.frame === 'box' ? 0.042 : BK.frame === 'hardtail' ? 0.028 : 0.04;
  for (const sx of [-1, 1]) {
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.55, len * 0.07), m);
    pl.position.copy(a).lerp(b, 0.45).add(V(sx * (r + 0.003), 0, 0));
    pl.rotation.order = 'YXZ';
    pl.rotation.set(0, sx * Math.PI / 2, 0);
    pl.rotateZ(sx > 0 ? -ang + Math.PI : ang);
    frame.add(pl);
  }
}

function makeMaterials(T, env, look, BK = {}) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.9, ...o });
  const phys = (o) => new THREE.MeshPhysicalMaterial({ envMap: env, envMapIntensity: 1, ...o });
  const m = {
    frame: phys({ color: 0xe53935, roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08 }),
    frame2: phys({ color: BK.rear ?? 0xe53935, roughness: BK.brand === 'GRANITE' ? 0.3 : 0.32, metalness: BK.brand === 'GRANITE' ? 0.9 : 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }),
    metal: std({ color: 0xb8bcc4, roughness: 0.25, metalness: 1 }),
    fork: phys({ color: 0x111111, roughness: 0.3, metalness: 0.4, clearcoat: 0.8 }),
    forkM: phys({ color: BK.fork === 'dual' ? 0x151515 : 0xd8d8d8, roughness: 0.3, metalness: 0.5, clearcoat: 0.8 }),
    stanchion: std({ color: BK.brand === 'VORTEX' ? 0xc9a24a : BK.brand === 'KESTREL' ? 0x2a2a2a : 0xc8ccd2, roughness: 0.15, metalness: 1 }),
    airCan: std({ color: 0x2b2b2b, roughness: 0.3, metalness: 0.8 }),
    caliper: std({ color: 0xc62828, roughness: 0.35, metalness: 0.7 }),
    crank: std({ color: 0x1c1c1e, roughness: 0.35, metalness: 0.6 }),
    chain: std({ color: 0x8a8f96, roughness: 0.4, metalness: 0.9 }),
    bar: std({ color: 0x1a1a1c, roughness: 0.35, metalness: 0.6 }),
    saddle: std({ color: 0x151515, roughness: 0.7 }),
    tireWall: std({ color: BK.brand === 'TALON' ? 0x8a6a45 : 0x1e1e1e, roughness: 0.9 }),
    spring: std({ color: BK.brand === 'GRANITE' ? 0xffd600 : 0xff6d00, roughness: 0.3, metalness: 0.6 }),
    dark: std({ color: 0x1a1b1e, roughness: 0.6, metalness: 0.2 }),
    rim: std({ color: 0x15161a, roughness: 0.35, metalness: 0.8 }),
    rotor: std({ color: 0xd0d4da, roughness: 0.2, metalness: 1 }),
    tire: std({ color: 0x1c1c1c, roughness: 0.92 }),
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
  m.frame2.userData.same = BK.rear == null;
  applyLook(m, look);
  return m;
}

function applyLook(m, look) {
  if (look.frame !== undefined) { m.frame.color.setHex(look.frame); if (m.frame2.userData.same) m.frame2.color.setHex(look.frame); }
  if (look.jersey !== undefined) { m.jersey.color.setHex(look.jersey); m.sleeve.color.setHex(look.jersey); }
  if (look.helmet !== undefined) m.helmet.color.setHex(look.helmet);
  if (look.pants !== undefined) m.pants.color.setHex(look.pants);
  if (look.goggle !== undefined) m.goggle.color.setHex(look.goggle);
  const gold = c => c === GOLD_HEX;
  m.frame.metalness = gold(look.frame) ? 0.9 : 0.35; m.frame.roughness = gold(look.frame) ? 0.25 : 0.32;
  m.helmet.metalness = gold(look.helmet) ? 0.9 : 0.1;
}

export { STEER_AXIS };
