// Mountain Rush: the downhill bike and the rider, built from shapes, posed every frame.
//
// Bike space: +z forward, +y up, ground at y = 0. Wheels 27.5" (radius 0.36 m).
// The rider's joints (hips, knees, feet, shoulders, elbows, hands) are worked out each frame
// (simple two-bone IK), so tricks (superman, no hander, tailwhip, barspin, manual) are just poses.
import * as THREE from '../../js/vendor/three.module.min.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const P2 = (z, y) => new THREE.Vector3(0, y, z);                   // a point in the bike's side view
// Hard points measured off real bikes (metres). 29" wheels, 1.30 m wheelbase, 64° head angle.
const WHEEL_R = 0.37;
const STEER_AXIS = V(0, 0.899, -0.438).normalize();                // up along the fork / head tube
const F_AXLE = V(0, WHEEL_R, 0.68), BB = V(0, 0.34, -0.17);
const AX_BACK = V(0, -0.438, -0.899);                              // square to the fork, pointing back
const HT_TOP = F_AXLE.clone().addScaledVector(STEER_AXIS, 0.75).addScaledVector(AX_BACK, 0.045);
const HT_BOT = F_AXLE.clone().addScaledVector(STEER_AXIS, 0.60).addScaledVector(AX_BACK, 0.045);

// The bikes. Stats change how they ride (physics.js). Each frame is drawn from a real bike's
// side-on shape: a sculpted front triangle (outline + cut-out), a swingarm, where the shock sits.
// Brand names are plain lettering on the down tube.
//   outer / hole: [z, y] points of the front triangle, in metres        piv: main pivot
//   swing: swingarm side plate outline (null = hardtail)                  shock: [frame mount, swingarm mount]
const HEAD = [[0.35, 1.045], [0.275, 1.02]], HEAD_END = [[0.418, 0.872]];
export const BIKES = {
  trek: { name: 'Trek', sub: 'Downhill race bike. Fast and steady', unlock: 0, size: 1, wheel: 0.37, fork: 'dual', brand: 'TREK', accent: 0xffffff, rear: null, forkCol: 0x111111, stan: 0xc9a24a, spring: 0xff5a00,
    outer: [...HEAD, [-0.215, 0.735], [-0.275, 0.895], [-0.33, 0.89], [-0.285, 0.6], [-0.24, 0.37], [-0.185, 0.282], [-0.11, 0.292], ...HEAD_END],
    hole: [[0.285, 0.935], [-0.17, 0.7], [-0.085, 0.38]],
    piv: [-0.15, 0.535], swing: [[-0.11, 0.57], [-0.62, 0.42], [-0.672, 0.37], [-0.625, 0.318], [-0.27, 0.34], [-0.2, 0.5]], swingHole: [[-0.2, 0.52], [-0.52, 0.41], [-0.3, 0.385]],
    ear: [[-0.12, 0.56], [-0.19, 0.68], [-0.235, 0.655], [-0.18, 0.53]], shock: [[-0.1, 0.405], [-0.205, 0.655]], idler: [-0.15, 0.57], coil: true,
    stats: { pedal: 1, drag: 1, grip: 1, spin: 1, pop: 1, soak: 1.6 } },
  cube: { name: 'Cube', sub: 'Enduro. Light, pedals and turns well', unlock: 0, size: 0.98, wheel: 0.37, fork: 'single', brand: 'CUBE', accent: 0x111111, rear: 0x151517, forkCol: 0x151515, stan: 0x2a2a2a, spring: 0x888888,
    outer: [...HEAD, [-0.2, 0.775], [-0.275, 0.945], [-0.33, 0.94], [-0.275, 0.62], [-0.24, 0.37], [-0.185, 0.282], [-0.11, 0.292], ...HEAD_END],
    hole: [[0.285, 0.94], [-0.16, 0.74], [-0.085, 0.38]],
    piv: [-0.14, 0.445], swing: [[-0.1, 0.47], [-0.6, 0.43], [-0.672, 0.37], [-0.625, 0.318], [-0.25, 0.345], [-0.18, 0.42]], swingHole: [[-0.2, 0.44], [-0.52, 0.41], [-0.3, 0.385]],
    ear: [[-0.11, 0.45], [-0.13, 0.76], [-0.185, 0.75], [-0.175, 0.44]], shock: [[0.12, 0.845], [-0.155, 0.74]], coil: false,
    stats: { pedal: 1.2, drag: 1.06, grip: 1.05, spin: 1.1, pop: 1.05, soak: 1.45 } },
  cannondale: { name: 'Cannondale', sub: 'Trail bike. Quick and playful', unlock: 2500, size: 0.98, wheel: 0.37, fork: 'single', brand: 'CANNONDALE', accent: 0xffffff, rear: null, forkCol: 0x151515, stan: 0xc8ccd2, spring: 0x888888,
    outer: [...HEAD, [-0.2, 0.75], [-0.27, 0.93], [-0.32, 0.925], [-0.265, 0.6], [-0.23, 0.37], [-0.185, 0.287], [-0.115, 0.297], ...HEAD_END],
    hole: [[0.29, 0.95], [-0.165, 0.725], [-0.1, 0.375]],
    piv: [-0.15, 0.45], swing: [[-0.11, 0.48], [-0.6, 0.425], [-0.668, 0.37], [-0.625, 0.322], [-0.25, 0.35], [-0.19, 0.43]], swingHole: [[-0.2, 0.45], [-0.52, 0.41], [-0.3, 0.39]],
    ear: [[-0.12, 0.46], [-0.19, 0.64], [-0.235, 0.62], [-0.18, 0.44]], shock: [[0.04, 0.655], [-0.2, 0.615]], coil: false,
    stats: { pedal: 1.12, drag: 1.03, grip: 1.02, spin: 1.2, pop: 1.15, soak: 1.4 } },
  canyon: { name: 'Canyon', sub: 'Big downhill bike. Unshakeable in rocks', unlock: 6000, size: 1.01, wheel: 0.37, fork: 'dual', brand: 'CANYON', accent: 0x111111, rear: 0x151517, forkCol: 0xff6a00, stan: 0xc9a24a, spring: 0xff5a00, bigLogo: true,
    outer: [...HEAD, [-0.225, 0.7], [-0.28, 0.875], [-0.335, 0.87], [-0.29, 0.58], [-0.24, 0.37], [-0.185, 0.282], [-0.105, 0.29], ...HEAD_END],
    hole: [[0.275, 0.925], [-0.175, 0.665], [-0.08, 0.39]],
    piv: [-0.13, 0.455], swing: [[-0.09, 0.48], [-0.61, 0.425], [-0.672, 0.37], [-0.625, 0.318], [-0.25, 0.345], [-0.17, 0.42]], swingHole: [[-0.19, 0.45], [-0.52, 0.41], [-0.3, 0.385]],
    ear: [[-0.1, 0.46], [-0.16, 0.6], [-0.21, 0.58], [-0.16, 0.44]], shock: [[0.03, 0.535], [-0.165, 0.57]], coil: true,
    stats: { pedal: 0.92, drag: 0.97, grip: 1.08, spin: 0.92, pop: 0.95, soak: 1.85 } },
  marin: { name: 'Marin', sub: 'Dirt jump hardtail. Pops high, spins fast', unlock: 12000, size: 0.9, wheel: 0.345, fork: 'single', brand: 'MARIN', accent: 0xffffff, rear: null, forkCol: 0x151515, stan: 0x2a2a2a, short: true,
    outer: [...HEAD, [-0.21, 0.66], [-0.25, 0.77], [-0.3, 0.765], [-0.275, 0.56], [-0.235, 0.37], [-0.185, 0.287], [-0.12, 0.3], ...HEAD_END],
    hole: [[0.29, 0.955], [-0.165, 0.645], [-0.11, 0.39]],
    piv: [-0.17, 0.36], swing: null,
    stats: { pedal: 1.15, drag: 1.12, grip: 0.92, spin: 1.3, pop: 1.25, soak: 1.25 } },
};
export const BIKE_ORDER = ['trek', 'cube', 'cannondale', 'canyon', 'marin'];
// outfit options; a gold set unlocks at GOLD points
export const GOLD = 20000;
export const OUTFIT = {
  helmet: [0xffffff, 0x111111, 0xe53935, 0x1e88e5, 0xfdd835, 0x43a047, 0xff7043, 0x8e24aa],
  pants: [0x3a3f48, 0x3b4a5a, 0x5a4636, 0x1e3a5f, 0x7a1f1f, 0x2f4f2f, 0xd0d0d0, 0x111111],
  goggle: [0xffb300, 0x00b0ff, 0xff4081, 0x76ff03, 0xeeeeee, 0x212121],
  helmetType: ['Full face', 'Open face'],
};
export const GOLD_HEX = 0xd4a017;

export const COLORS = {
  frame: [0xe53935, 0x1e88e5, 0x43a047, 0xfdd835, 0x212121, 0xff7043, 0x8e24aa, 0xf5f5f5],
  jersey: [0x1e88e5, 0xe53935, 0x111111, 0xfdd835, 0x43a047, 0xff7043, 0x8e24aa, 0xffffff],
};

export function createBike(T, env, look = {}, type = 'trek') {
  const BK = BIKES[type] || BIKES.trek;
  const root = new THREE.Group();           // placed from physics each frame
  const body = new THREE.Group(); root.add(body);   // the whole bike; tilts sideways for a table top
  const sizer = new THREE.Group(); sizer.scale.setScalar(BK.size); body.add(sizer);
  const chassis = new THREE.Group(); sizer.add(chassis);   // drops down as the suspension squashes
  const mats = makeMaterials(T, env, look, BK);
  const WR = BK.wheel, ax = STEER_AXIS;
  const hard = !BK.swing;
  const R_AX = P2(hard ? -0.6 : -0.62, WR), F_AX = P2(F_AXLE.z, WR);
  const PIV = P2(...BK.piv);

  // ---- helpers
  const SIDE = V(1, 0, 0);
  const placeAlong = (mesh, a, b) => {
    const d = b.clone().sub(a), len = d.length(), y = d.divideScalar(len);
    const z = new THREE.Vector3().crossVectors(SIDE, y); if (z.lengthSq() < 1e-6) z.set(0, 0, 1); z.normalize();
    const x = new THREE.Vector3().crossVectors(y, z);
    mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)); mesh.position.copy(a);
    mesh.castShadow = true; return len;
  };
  const tube = (parent, a, b, r0, r1 = r0, m = mats.frame, oval = 1) => {
    const len = a.distanceTo(b);
    const g = new THREE.CylinderGeometry(r1, r0, len, 16, 1); g.translate(0, len / 2, 0); g.scale(oval, 1, 1);
    const mesh = new THREE.Mesh(g, m); placeAlong(mesh, a, b); parent.add(mesh); return mesh;
  };
  const curveTube = (parent, pts, r, m = mats.frame, seg = 24) => {
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 10, false), m);
    mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  const part = (parent, g, m, p) => { const mesh = new THREE.Mesh(g, m); if (p) mesh.position.copy(p); mesh.castShadow = true; parent.add(mesh); return mesh; };
  const crossCyl = (parent, p, r, w, m) => { const g = new THREE.CylinderGeometry(r, r, w, 20); g.rotateZ(Math.PI / 2); return part(parent, g, m, p); };
  // a sculpted plate from a side-on outline (rounded corners, rounded edges), `width` thick across the bike
  const plate = (pts, hole, width, bevel, m, corner = 0.03, origin = null) => {
    const off = origin ? [origin.z, origin.y] : [0, 0];
    const sh = roundedPath(new THREE.Shape(), pts.map(([z, y]) => [z - off[0], y - off[1]]), corner);
    if (hole) sh.holes.push(roundedPath(new THREE.Path(), hole.map(([z, y]) => [z - off[0], y - off[1]]), corner * 0.8));
    const depth = Math.max(0.001, width - bevel * 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, -depth / 2); g.rotateY(-Math.PI / 2);
    const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; return mesh;
  };

  // --------------------------------------------------------------- frame (can tailwhip around the steering axis)
  const whipPivot = new THREE.Group(); whipPivot.position.copy(HT_TOP);
  const whipAxis = STEER_AXIS.clone();
  const frame = new THREE.Group(); frame.position.copy(HT_TOP).negate();
  whipPivot.add(frame); chassis.add(whipPivot);
  const FW = BK.fork === 'dual' ? 0.062 : 0.054;                       // frame width
  frame.add(plate(BK.outer, BK.hole, FW, 0.016, mats.frame, 0.035));
  tube(frame, HT_BOT.clone().addScaledVector(ax, -0.012), HT_TOP.clone().addScaledVector(ax, 0.012), 0.037, 0.035);     // head tube
  for (const t of [-0.014, 0.014]) tube(frame, (t < 0 ? HT_BOT : HT_TOP).clone().addScaledVector(ax, t - 0.004), (t < 0 ? HT_BOT : HT_TOP).clone().addScaledVector(ax, t + 0.004), 0.039, 0.039, mats.dark);   // headset cups
  crossCyl(frame, BB, 0.043, 0.085, mats.frame);
  // seat post + saddle
  const mast = P2((BK.outer[3][0] + BK.outer[4][0]) / 2, (BK.outer[3][1] + BK.outer[4][1]) / 2 - 0.02);
  const seatTop = mast.clone().add(V(0, BK.short ? 0.05 : 0.09, -0.028));
  tube(frame, mast, seatTop, 0.0155, 0.0155, mats.dark);
  crossCyl(frame, mast.clone().add(V(0, 0.022, -0.006)), 0.021, 0.02, mats.dark);
  { const g = roundBox(0.135, 0.032, 0.26, 0.014); const pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) { const z = pa.getZ(i), t = (z + 0.13) / 0.26; pa.setX(i, pa.getX(i) * (1 - 0.68 * Math.pow(t, 1.6))); pa.setY(i, pa.getY(i) - 0.012 * Math.sin(t * Math.PI)); }
    g.computeVertexNormals();
    const sd = part(frame, g, mats.saddle, seatTop.clone().add(V(0, 0.022, 0.03))); sd.rotation.x = -0.05; }

  // ---- rear end
  const swing = new THREE.Group(); swing.position.copy(PIV); frame.add(swing);
  const L = p => p.clone().sub(PIV);                  // into swingarm space
  const axL = L(R_AX);
  let swingShock = null, shockMount = null;
  if (!hard) {
    for (const sx of [-1, 1]) {
      const pl = plate(BK.swing, BK.swingHole, 0.02, 0.006, mats.frame2, 0.022, PIV); pl.position.x = sx * 0.066; swing.add(pl);
      if (BK.ear) { const e = plate(BK.ear, null, 0.012, 0.004, mats.frame2, 0.018, PIV); e.position.x = sx * 0.043; swing.add(e); }
    }
    crossCyl(swing, V(0, 0, 0), 0.024, 0.15, mats.dark);                                      // main pivot axle
    const br = BK.swing[0]; crossCyl(swing, L(P2(br[0] - 0.06, br[1] - 0.045)), 0.016, 0.14, mats.frame2);   // bridge between the plates
    shockMount = P2(...BK.shock[0]); swingShock = L(P2(...BK.shock[1]));
    crossCyl(swing, swingShock, 0.012, 0.09, mats.dark);
    if (BK.idler) crossCyl(frame, P2(...BK.idler).add(V(-0.052, 0, 0)), 0.034, 0.012, mats.metal);
  } else {
    const J = P2(BK.outer[2][0] - 0.015, BK.outer[2][1] - 0.03);
    for (const sx of [-1, 1]) {
      curveTube(swing, [L(BB).add(V(sx * 0.035, 0, -0.03)), L(BB).add(V(sx * 0.07, 0.005, -0.2)), axL.clone().add(V(sx * 0.07, 0, 0))], 0.0125, mats.frame);
      curveTube(swing, [L(J).add(V(sx * 0.025, 0, 0)), L(J).add(V(sx * 0.065, -0.08, -0.14)), axL.clone().add(V(sx * 0.07, 0.01, 0))], 0.01, mats.frame);
      part(swing, roundBox(0.012, 0.05, 0.06, 0.005), mats.frame, axL.clone().add(V(sx * 0.07, 0, 0.01)));
    }
  }
  // rear wheel, cassette, derailleur, brake
  const rear = makeWheel(mats, WR); rear.position.copy(axL); swing.add(rear);
  { const cg = new THREE.CylinderGeometry(0.1, 0.03, 0.045, 24, 6); cg.rotateZ(-Math.PI / 2); part(swing, cg, mats.cassette, axL.clone().add(V(-0.05, 0, 0)));
    part(swing, roundBox(0.022, 0.07, 0.045, 0.008), mats.dark, axL.clone().add(V(-0.082, -0.06, 0.005)));
    const cage = part(swing, roundBox(0.01, 0.12, 0.03, 0.004), mats.dark, axL.clone().add(V(-0.085, -0.15, 0.03))); cage.rotation.x = 0.35;
    crossCyl(swing, axL.clone().add(V(-0.085, -0.2, 0.05)), 0.024, 0.008, mats.metal);
    part(swing, roundBox(0.03, 0.045, 0.075, 0.01), mats.caliper, axL.clone().add(V(0.068, 0.085, 0.07))); }

  // ---- shock: body on the frame, shaft to the swingarm (re-aimed every frame)
  let shock = null;
  if (shockMount) {
    const coil = BK.coil;
    const bodyG = new THREE.CylinderGeometry(coil ? 0.02 : 0.03, coil ? 0.02 : 0.03, 0.12, 16); bodyG.translate(0, 0.07, 0);
    const shaftG = new THREE.CylinderGeometry(0.0085, 0.0085, 1, 10); shaftG.translate(0, 0.5, 0);
    const sb = part(frame, bodyG, coil ? mats.dark : mats.airCan), ss = part(frame, shaftG, mats.metal);
    const resG = new THREE.CylinderGeometry(0.016, 0.016, 0.085, 12); resG.translate(0, 0.075, 0.04);
    const res = part(frame, resG, mats.shockRes);
    let spring = null;
    if (coil) { const pts = []; for (let i = 0; i <= 100; i++) { const a = i / 100 * Math.PI * 2 * 6.5; pts.push(V(Math.cos(a) * 0.03, i / 100, Math.sin(a) * 0.03)); }
      spring = part(frame, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.0058, 6, false), mats.spring); }
    crossCyl(frame, shockMount, 0.012, 0.05, mats.dark);
    shock = { sb, ss, res, spring, a: shockMount };
  }
  const aimShock = () => {
    if (!shock) return;
    const b = swingShock.clone().applyQuaternion(swing.quaternion).add(PIV);
    const len = placeAlong(shock.sb, shock.a, b);
    placeAlong(shock.res, shock.a, b);
    placeAlong(shock.ss, shock.a, b); shock.ss.scale.set(1, len, 1);
    if (shock.spring) { placeAlong(shock.spring, shock.a.clone().lerp(b, 0.1), b); shock.spring.scale.set(1, len * 0.84, 1); }
  };

  // ---- cranks, chainring, pedals, chain
  const crank = new THREE.Group(); crank.position.copy(BB); frame.add(crank);
  { const rg = new THREE.CylinderGeometry(0.068, 0.068, 0.005, 32); rg.rotateZ(Math.PI / 2); part(crank, rg, mats.chain, V(-0.052, 0, 0));
    const sg = new THREE.CylinderGeometry(0.03, 0.03, 0.012, 16); sg.rotateZ(Math.PI / 2); part(crank, sg, mats.crank, V(-0.056, 0, 0)); }
  { const bg = new THREE.TorusGeometry(0.078, 0.007, 6, 20, Math.PI * 0.7); bg.rotateY(Math.PI / 2); const b = part(frame, bg, mats.dark, BB.clone().add(V(-0.052, 0, 0))); b.rotation.x = 2.6; }   // bash guard
  const pedals = [];
  for (const sx of [-1, 1]) {
    const ag = roundBox(0.018, 0.03, 0.185, 0.008); ag.translate(0, 0, sx * 0.08);
    part(crank, ag, mats.crank, V(sx * 0.075, 0, 0));
    const pd = part(crank, roundBox(0.1, 0.016, 0.105, 0.005), mats.pedal, V(sx * 0.135, 0, sx * 0.165)); pedals.push(pd);
  }
  {
    const cx = -0.052, top = 0.068, ca = L(R_AX).add(PIV);
    const pts = [V(cx, BB.y + top, BB.z), V(cx, ca.y + 0.06, ca.z + 0.02), V(cx, ca.y + 0.02, ca.z - 0.06), V(cx, ca.y - 0.1, ca.z - 0.01), V(cx, ca.y - 0.21, ca.z + 0.06), V(cx, BB.y - top, BB.z + 0.01)];
    part(frame, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.25), 64, 0.0045, 4, true), mats.chain);
  }
  addDecal(frame, mats, BK, FW); applyLook(mats, look);

  // --------------------------------------------------------------- front end: fork, wheel, bars (steers + barspins)
  const steer = new THREE.Group(); steer.position.copy(HT_TOP); chassis.add(steer);
  const front = new THREE.Group(); front.position.copy(HT_TOP).negate(); steer.add(front);
  const dual = BK.fork === 'dual';
  const legX = dual ? 0.086 : 0.078;
  const leg = (t, sx = 0) => F_AX.clone().addScaledVector(ax, t).add(V(sx * legX, 0, 0));
  const lowTop = dual ? 0.37 : 0.41, crownT = 0.578, topT = 0.776;
  const axQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(SIDE, ax, new THREE.Vector3().crossVectors(SIDE, ax)));
  for (const sx of [-1, 1]) tube(front, leg(lowTop - 0.12, sx), leg(dual ? topT + 0.012 : crownT, sx), dual ? 0.02 : 0.0185, dual ? 0.02 : 0.0185, mats.stanchion);
  const crownM = (t, thick, depth) => { const c = part(front, roundBox(legX * 2 + 0.056, thick, depth, 0.012), mats.crownM, leg(t).addScaledVector(AX_BACK, 0.02)); c.quaternion.copy(axQ); };
  crownM(crownT, 0.04, 0.1); if (dual) crownM(topT, 0.028, 0.095);
  // lowers slide up the stanchions when the fork squashes
  const lowers = new THREE.Group(); front.add(lowers);
  for (const sx of [-1, 1]) {
    tube(lowers, leg(-0.035, sx), leg(lowTop, sx), 0.027, 0.031, mats.forkM);
    tube(lowers, leg(lowTop - 0.004, sx), leg(lowTop + 0.012, sx), 0.033, 0.03, mats.dark);          // dust seal
    part(lowers, new THREE.SphereGeometry(0.031, 14, 10), mats.forkM, leg(-0.005, sx).addScaledVector(AX_BACK, -0.012));   // dropout
  }
  { const ag = new THREE.TorusGeometry(legX, 0.015, 8, 22, Math.PI); const a = part(lowers, ag, mats.forkM, leg(lowTop - 0.035)); a.quaternion.copy(axQ); }   // arch over the tyre
  crossCyl(lowers, F_AX.clone(), 0.012, legX * 2 + 0.03, mats.dark);                                   // axle
  part(lowers, roundBox(0.03, 0.045, 0.075, 0.01), mats.caliper, F_AX.clone().add(V(0.07, 0.07, -0.085)));
  const frontW = makeWheel(mats, WR); frontW.position.copy(F_AX); lowers.add(frontW);
  // stem + bars (780 mm, a little rise and sweep), grips, levers, cables
  const BAR_C = HT_TOP.clone().addScaledVector(ax, 0.055).add(V(0, 0.0, 0.035));
  part(front, roundBox(0.05, 0.042, 0.075, 0.012), mats.dark, HT_TOP.clone().addScaledVector(ax, 0.045).add(V(0, 0, 0.015)));
  tube(front, HT_TOP.clone().addScaledVector(ax, 0.01), HT_TOP.clone().addScaledVector(ax, 0.06), 0.02, 0.02, mats.dark);
  const barPts = [[-0.39, 0.03, -0.035], [-0.22, 0.028, -0.01], [-0.08, 0.002, 0], [0.08, 0.002, 0], [0.22, 0.028, -0.01], [0.39, 0.03, -0.035]].map(([x, y, z]) => V(x, y, z).add(BAR_C));
  curveTube(front, barPts, 0.0115, mats.bar, 32);
  const GRIPS = [];
  for (const sx of [-1, 1]) {
    const gp = V(sx * 0.335, 0.03, -0.03).add(BAR_C);
    const gg = new THREE.CylinderGeometry(0.0165, 0.0165, 0.125, 12); gg.rotateZ(Math.PI / 2); part(front, gg, mats.grip, gp);
    const lg = new THREE.CylinderGeometry(0.019, 0.019, 0.01, 12); lg.rotateZ(Math.PI / 2); part(front, lg, mats.metal, gp.clone().add(V(sx * 0.066, 0, 0)));
    part(front, roundBox(0.022, 0.025, 0.03, 0.006), mats.dark, V(sx * 0.25, 0.028, 0.008).add(BAR_C));                    // lever clamp
    const lev = part(front, roundBox(0.085, 0.009, 0.012, 0.003), mats.dark, V(sx * 0.3, 0.012, 0.05).add(BAR_C)); lev.rotation.y = sx * -0.25;
    // brake hose loops forward and down to the frame / fork
    curveTube(front, [V(sx * 0.245, 0.028, 0.02).add(BAR_C), V(sx * 0.17, 0.0, 0.13).add(BAR_C), V(sx * 0.07, -0.12, 0.12).add(BAR_C), V(sx * 0.045, -0.2, 0.045).add(BAR_C)], 0.0032, mats.dark, 16);
    GRIPS[sx > 0 ? 0 : 1] = gp;      // [0] = the +x hand, to match the shoulders
  }
  { const pl = part(front, roundBox(0.19, 0.16, 0.006, 0.002), mats.plate, BAR_C.clone().add(V(0, -0.075, 0.075))); pl.rotation.x = -0.22; pl.castShadow = false; }
  const TRAVEL = dual ? 0.17 : (BK.short ? 0.08 : 0.13), RTRAVEL = hard ? 0 : (dual ? 0.34 : 0.28);
  // squash the suspension: 0 = topped out, 1 = bottomed out (the chassis drops so the wheels stay down)
  const setSusp = (f, r) => {
    lowers.position.copy(ax).multiplyScalar(TRAVEL * f);
    swing.rotation.x = RTRAVEL * r;
    chassis.position.y = -(TRAVEL * f * ax.y + RTRAVEL * r * Math.abs(axL.z)) * 0.5;
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
    thigh: [0, 1].map(() => add(limbGeo(0.078, 0.058, 0.008, 0.3), mats.pants)),
    shin: [0, 1].map(() => add(limbGeo(0.057, 0.043, 0.008, 0.28), mats.pants)),
    knee: [0, 1].map(() => add(new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), mats.pad)),
    shoe: [0, 1].map(() => add(shoeGeo(), mats.shoe)),
    sole: [0, 1].map(() => add(new THREE.BoxGeometry(0.1, 0.022, 0.27), mats.sole, false)),
    upper: [0, 1].map(() => add(limbGeo(0.052, 0.043, 0.006, 0.35), mats.sleeve)),
    fore: [0, 1].map(() => add(limbGeo(0.043, 0.033, 0.005, 0.25), mats.sleeve)),
    elbow: [0, 1].map(() => add(new THREE.SphereGeometry(1, 14, 10), mats.sleeve)),
    cuff: [0, 1].map(() => add(new THREE.CylinderGeometry(0.042, 0.04, 0.07, 12), mats.glove)),
    hand: [0, 1].map(() => add(handGeo(), mats.glove)),
    shoulder: [0, 1].map(() => add(new THREE.SphereGeometry(0.0505, 16, 12), mats.sleeve)),
    kneeJ: [0, 1].map(() => add(new THREE.SphereGeometry(0.0555, 14, 10), mats.pants)),
    hipJ: [0, 1].map(() => add(new THREE.SphereGeometry(0.08, 14, 10), mats.pants)),
  };
  // body: one smooth shape from hips to collar; shorts over the hips
  const torsoGeo = new THREE.LatheGeometry([[0.0001, -0.02], [0.15, 0], [0.142, 0.18], [0.135, 0.3], [0.15, 0.5], [0.165, 0.7], [0.168, 0.82], [0.13, 0.93], [0.07, 0.99], [0.055, 1.02], [0.0001, 1.03]].map(([r, y]) => new THREE.Vector2(r, y)), 24);
  const torso = add(torsoGeo, mats.jersey);
  const shorts = add(new THREE.LatheGeometry([[0.0001, -0.12], [0.13, -0.1], [0.155, -0.02], [0.148, 0.08], [0.13, 0.12], [0.0001, 0.13]].map(([r, y]) => new THREE.Vector2(r, y)), 24), mats.pants);
  const neck = add(new THREE.CylinderGeometry(0.046, 0.052, 0.08, 12), mats.skin);
  const pack = add(roundBox(0.2, 0.26, 0.08, 0.035), mats.packM);
  const straps = [0, 1].map(() => add(new THREE.TorusGeometry(0.11, 0.012, 6, 16, Math.PI), mats.strap, false));
  pack.visible = false; straps.forEach(st => { st.visible = false; });      // no backpack: the race number shows
  // race number printed on the back
  const numTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.font = '900 200px Nunito, Arial Black, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 16; g.strokeStyle = 'rgba(0,0,0,.75)'; g.strokeText('7', 128, 140); g.fillStyle = '#ffffff'; g.fillText('7', 128, 140);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; })();
  const number = add(new THREE.PlaneGeometry(0.24, 0.24), new THREE.MeshStandardMaterial({ map: numTex, transparent: true, roughness: 0.8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 }), false);
  const numQ = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), Math.PI);
  const head = new THREE.Group(); head.scale.setScalar(0.82); rider.add(head);
  {
    const H = (g, m) => { const mesh = new THREE.Mesh(g, m); mesh.castShadow = true; head.add(mesh); return mesh; };
    // face underneath (seen through the opening)
    const face = H(new THREE.SphereGeometry(0.112, 18, 14), mats.skin); face.scale.set(0.88, 1.05, 0.98); face.position.set(0, -0.02, 0.02);
    const inner = H(new THREE.SphereGeometry(0.146, 20, 14), mats.helmetIn); inner.material.side = THREE.BackSide; inner.scale.set(0.93, 1, 1.1);
    // one smooth shell: full-face (chin guard part of the shell) and open-face versions
    const full = H(helmetGeo(false), mats.helmet), open = H(helmetGeo(true), mats.helmet);
    full.visible = !look.open; open.visible = !!look.open;
    head.userData.full = full; head.userData.open = open;
    // peak: thin, tipped slightly up, like a real MTB helmet
    const peak = H(roundBox(0.19, 0.008, 0.12, 0.003), mats.helmet); peak.rotation.x = -0.1; peak.position.set(0, 0.098, 0.19);
    for (const sx of [-1, 1]) { const st = H(roundBox(0.012, 0.03, 0.05, 0.004), mats.helmet); st.position.set(sx * 0.082, 0.085, 0.135); st.rotation.x = -0.5; }
    // goggles: frame + shiny lens sitting in the opening, strap round the helmet
    const gframe = H(new THREE.CylinderGeometry(0.139, 0.139, 0.088, 28, 1, true, -0.92, 1.84), mats.goggleFrame); gframe.position.set(0, 0.014, 0.012); gframe.scale.set(1, 1, 1.1);
    const lens = H(new THREE.CylinderGeometry(0.1405, 0.1405, 0.072, 28, 1, true, -0.8, 1.6), mats.goggle); lens.position.set(0, 0.014, 0.013); lens.scale.set(1, 1, 1.1);
    const sg = new THREE.TorusGeometry(0.153, 0.011, 4, 32, Math.PI * 2 - 1.9); sg.rotateZ(Math.PI / 2 + 0.95);      // round the back only, not over the lens
    const strap = H(sg, mats.strap); strap.rotation.x = Math.PI / 2; strap.position.y = 0.014; strap.scale.set(0.93, 1.2, 1);
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

    let hip = V(0, 1.04 - 0.2 * c - 0.05 * m, -0.38 - 0.04 * c + 0.1 * l - 0.22 * m);
    let sh = V(0, 1.42 - 0.18 * c - 0.05 * m, 0.02 + 0.04 * c + 0.12 * l - 0.2 * m);
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
      const foot = ik(hips[i], feet[i], 0.45, 0.47, V(sx * 0.3, 0.25, 1), tmp.k);
      const knee = tmp.k.clone();
      between(P.thigh[i], hips[i], knee); between(P.shin[i], knee, foot);
      const shinDir = foot.clone().sub(knee).normalize();
      const kneeFwd = V(0, 0, 1).sub(shinDir.clone().multiplyScalar(shinDir.z)).normalize();
      orient(P.knee[i], shinDir.clone().negate().lerp(kneeFwd, 0.75).normalize(), shinDir);
      P.knee[i].position.copy(knee).addScaledVector(kneeFwd, 0.035).addScaledVector(shinDir, 0.05);
      P.knee[i].visible = false;      // joints sit flush with the limbs (no bobbles)
      P.kneeJ[i].position.copy(knee); P.hipJ[i].position.copy(hips[i]);
      P.shoe[i].position.copy(foot).add(V(0, -0.015, 0.035)); P.shoe[i].rotation.set(0.05, 0, 0);
      P.sole[i].position.copy(foot).add(V(0, -0.05, 0.035)); P.sole[i].rotation.set(0.05, 0, 0);
      // arms
      const hand = ik(shoulders[i], hands[i], 0.31, 0.29, V(sx * 1, 0.15, -0.6), tmp.e);
      const elbow = tmp.e.clone();
      between(P.upper[i], shoulders[i], elbow); between(P.fore[i], elbow, hand);
      const foreDir = hand.clone().sub(elbow).normalize();
      P.elbow[i].position.copy(elbow); P.elbow[i].scale.setScalar(0.0415);
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
    shorts.quaternion.copy(torso.quaternion); shorts.position.copy(hip); shorts.scale.set(0.99, 1, 0.74);
    neck.position.copy(neckP).addScaledVector(up, 0.045); neck.quaternion.copy(torso.quaternion);
    pack.quaternion.copy(torso.quaternion); pack.position.copy(hip).addScaledVector(up, tl * 0.66).addScaledVector(fwd, -0.14);
    straps.forEach((st, i) => { st.quaternion.copy(torso.quaternion).multiply(strapQ); st.position.copy(hip).addScaledVector(up, tl * 0.78).addScaledVector(side, i ? -0.09 : 0.09).addScaledVector(fwd, -0.02); });
    number.quaternion.copy(torso.quaternion).multiply(numQ); number.position.copy(hip).addScaledVector(up, tl * 0.6).addScaledVector(fwd, -0.128);
    // head: above the neck, looking ahead
    head.position.copy(neckP).addScaledVector(up, 0.155).addScaledVector(fwd, 0.05);
    head.rotation.set(-0.12 + s * 0.5, 0, 0);
  }
  pose({ steer: 0, crouch: 0, lean: 0, crank: 0, wheel: 0, superman: 0, nohand: 0, whip: 0, bar: 0, manual: 0 });

  function setLook(look2) { applyLook(mats, look2); head.userData.full.visible = !look2.open; head.userData.open.visible = !!look2.open; }
  return { root, rider, pose, setLook, mats, head, headPos: () => head.position };
}

// helmet shell: a sphere reshaped into a helmet (longer at the back, snug chin guard) with the
// eye port and neck hole cut out. openFace = no chin guard.
function helmetGeo(openFace) {
  const W = 96, Hh = 64;
  const src = new THREE.SphereGeometry(0.15, W, Hh);
  const pa = src.attributes.position, uv = src.attributes.uv, ix = src.index.array;
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (let i = 0; i < pa.count; i++) {
    const d = new THREE.Vector3(pa.getX(i), pa.getY(i), pa.getZ(i)).normalize();
    let r = 0.15;
    const front = sm(0.0, 0.7, d.z);
    const chin = front * sm(-0.12, -0.5, d.y);
    r += 0.03 * chin;                                    // chin guard juts forward, part of the shell
    r += 0.012 * front * sm(0.25, 0.6, d.y) * (1 - sm(0.75, 0.95, d.y));   // brow over the goggles
    r -= 0.014 * sm(-0.3, -0.9, d.y) * (1 - chin);       // tucks in toward the neck
    r -= 0.01 * sm(0.75, 1, d.y);                        // slightly flatter on top
    const jaw = 1 - 0.14 * sm(-0.1, -0.7, d.y);          // narrower at the jaw
    const lenZ = d.z < 0 ? 1.2 : 1.1;                    // longer front to back
    pa.setXYZ(i, d.x * r * 0.92 * jaw, d.y * r * 0.98 + 0.004, d.z * r * lenZ);
  }
  // cut the eye port and neck hole, a whole grid square at a time (clean edges, no saw-teeth)
  const keep = [];
  const cellDir = (cu, cv) => { const phi = (cu + 0.5) / W * Math.PI * 2, th = (cv + 0.5) / Hh * Math.PI; return new THREE.Vector3(-Math.cos(phi) * Math.sin(th), Math.cos(th), Math.sin(phi) * Math.sin(th)); };
  for (let i = 0; i < ix.length; i += 3) {
    const u = (uv.getX(ix[i]) + uv.getX(ix[i + 1]) + uv.getX(ix[i + 2])) / 3, v = 1 - (uv.getY(ix[i]) + uv.getY(ix[i + 1]) + uv.getY(ix[i + 2])) / 3;
    const c = cellDir(Math.min(W - 1, Math.floor(u * W)), Math.min(Hh - 1, Math.floor(v * Hh)));
    if (c.y < -0.78) continue;                                                        // neck hole
    const ang = Math.atan2(Math.abs(c.x), c.z);                                       // angle round from straight ahead
    if (ang < 0.95 && c.y > -0.17 && c.y < 0.36) continue;                            // eye port
    if (openFace && ((ang < 1.5 && c.y < 0.0) || c.y < -0.42)) continue;              // open face: no chin guard, shorter shell
    keep.push(ix[i], ix[i + 1], ix[i + 2]);
  }
  src.setIndex(keep);
  src.computeVertexNormals();
  return src;
}
// a closed outline with rounded corners (points are [x, y])
function roundedPath(path, pts, r) {
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const l1 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const rr = Math.min(r, l1 * 0.45, l2 * 0.45);
    const a = [p1[0] + (p0[0] - p1[0]) / l1 * rr, p1[1] + (p0[1] - p1[1]) / l1 * rr], b = [p1[0] + (p2[0] - p1[0]) / l2 * rr, p1[1] + (p2[1] - p1[1]) / l2 * rr];
    if (i === 0) path.moveTo(a[0], a[1]); else path.lineTo(a[0], a[1]);
    path.quadraticCurveTo(p1[0], p1[1], b[0], b[1]);
  }
  path.closePath();
  return path;
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
    // (plain chest: stripes wrapped badly round the back)
    // number on the back
    // (the race number is a separate print on the back)
    // collar
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, w, h * 0.04);
  });
  jersey.colorSpace = THREE.SRGBColorSpace;
  const knit = mk(128, 128, (g, w, h) => { const im = g.createImageData(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = 128 + 50 * Math.sin(x * 1.6) * Math.sin(y * 0.8 + (x % 2) * 1.5) + (Math.random() - 0.5) * 30; const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); });
  knit.repeat.set(6, 6);
  const pants = mk(256, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,1)';
    for (const cx of [0.25, 0.75]) { g.fillStyle = 'rgba(0,0,0,.0)'; g.fillRect(cx * w - 14, 0, 28, h); g.fillStyle = '#cfcfcf'; }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, h * 0.62, w, h * 0.38);            // darker lower leg / knee panel
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(w * 0.22, 0, w * 0.06, h); g.fillRect(w * 0.72, 0, w * 0.06, h);   // side stripes
    g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, h * 0.6, w, 3);
  });
  pants.colorSpace = THREE.SRGBColorSpace;
  const helmet = mk(512, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    // u: 0 = right side, .25 = front... two swooshes on the sides and a stripe over the top
    g.fillStyle = 'rgba(0,0,0,.55)';
    for (const cx of [0.02, 0.52]) { g.beginPath(); g.moveTo(cx * w - 60, h * 0.75); g.quadraticCurveTo(cx * w, h * 0.2, cx * w + 90, h * 0.45); g.quadraticCurveTo(cx * w + 10, h * 0.5, cx * w - 60, h * 0.75); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(w * 0.23, 0, w * 0.04, h * 0.6); g.fillRect(w * 0.73, 0, w * 0.04, h * 0.6);
  });
  helmet.colorSpace = THREE.SRGBColorSpace;
  clothTex = { jersey, knit, pants, helmet };
  return clothTex;
}

// wheel, sized off a real 29er: slim 2.5" tyre with knobs, deep rim, hub, 28 spokes, 200 mm rotor
function makeWheel(m, R = 0.37) {
  const w = new THREE.Group();
  const tr = 0.031, rc = R - tr;                      // tyre section radius, centre radius
  const tire = new THREE.Mesh(new THREE.TorusGeometry(rc, tr, 14, 72), m.tire);
  tire.rotation.y = Math.PI / 2; tire.castShadow = true; w.add(tire);
  const knobs = [], nK = Math.round(R * 190);
  for (let i = 0; i < nK; i++) {
    const a = i / nK * Math.PI * 2;
    const c = new THREE.BoxGeometry(i % 2 ? 0.02 : 0.012, 0.007, 0.016); c.translate(i % 2 ? 0 : (i % 4 ? 0.008 : -0.008), R + 0.001, 0); c.rotateX(a); knobs.push(c);
    for (const sx of [-1, 1]) { const g = new THREE.BoxGeometry(0.009, 0.008, 0.014); g.rotateZ(-sx * 0.75); g.translate(sx * 0.024, R - 0.011, 0); g.rotateX(a + 0.5 / nK * Math.PI * 2); knobs.push(g); }
  }
  const km = new THREE.Mesh(mergeSimple(knobs), m.tire); km.castShadow = true; w.add(km);
  // rim: box section
  const rp = [[R - 0.056, -0.016], [R - 0.056, 0.016], [R - 0.08, 0.012], [R - 0.08, -0.012], [R - 0.056, -0.016]].map(([r, x]) => new THREE.Vector2(r, x));
  const rg = new THREE.LatheGeometry(rp, 64); rg.rotateZ(Math.PI / 2);
  w.add(new THREE.Mesh(rg, m.rim));
  const hg = new THREE.CylinderGeometry(0.019, 0.019, 0.11, 12); hg.rotateZ(Math.PI / 2); w.add(new THREE.Mesh(hg, m.hub));
  for (const sx of [-1, 1]) { const fg = new THREE.CylinderGeometry(0.028, 0.028, 0.006, 16); fg.rotateZ(Math.PI / 2); fg.translate(sx * 0.036, 0, 0); w.add(new THREE.Mesh(fg, m.hub)); }
  const rot = new THREE.RingGeometry(0.068, 0.101, 36); rot.rotateY(Math.PI / 2); const rm = new THREE.Mesh(rot, m.rotor); rm.position.x = 0.052; w.add(rm);
  const spd = new THREE.CylinderGeometry(0.03, 0.068, 0.003, 6); spd.rotateZ(Math.PI / 2); const sm = new THREE.Mesh(spd, m.rotor); sm.position.x = 0.05; w.add(sm);
  const sp = [], rimR = R - 0.079;
  for (let i = 0; i < 28; i++) {
    const side = i % 2 ? 1 : -1, a0 = i / 28 * Math.PI * 2, a1 = a0 + (i % 4 < 2 ? 0.55 : -0.55);
    const p0 = new THREE.Vector3(side * 0.036, Math.cos(a0) * 0.027, Math.sin(a0) * 0.027), p1 = new THREE.Vector3(side * 0.004, Math.cos(a1) * rimR, Math.sin(a1) * rimR);
    const d = p1.clone().sub(p0), len = d.length();
    const g = new THREE.CylinderGeometry(0.0011, 0.0011, len, 3); g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate(p0.x, p0.y, p0.z);
    sp.push(g);
  }
  w.add(new THREE.Mesh(mergeSimple(sp), m.spoke));
  return w;
}

function mergeSimple(list) {
  let n = 0; for (const g of list) n += g.index.count;
  const pos = [], idx = []; let vo = 0;
  for (const g of list) { const p = g.attributes.position.array; for (let i = 0; i < p.length; i++) pos.push(p[i]); for (const i of g.index.array) idx.push(i + vo); vo += p.length / 3; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setIndex(idx); out.computeVertexNormals();
  return out;
}

// brand name in plain letters on both sides of the down tube
function addDecal(frame, mats, BK, FW) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
  const g = c.getContext('2d'); g.clearRect(0, 0, 1024, 128);
  g.fillStyle = '#ffffff';
  g.font = `${BK.bigLogo ? '900' : 'italic 900'} ${BK.brand.length > 8 ? 92 : 108}px Nunito, Arial Black, sans-serif`; g.textBaseline = 'middle'; g.textAlign = 'center';
  g.fillText(BK.brand.split('').join(BK.bigLogo ? ' ' : ''), 512, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
  mats.decal = m;
  // centre line of the down tube: between the cut-out's lower edge and the frame's underside
  const n = BK.outer.length, h0 = BK.hole[0], h2 = BK.hole[2], o0 = BK.outer[n - 1], o1 = BK.outer[n - 2];
  const a = P2((h0[0] + o0[0]) / 2 - 0.05, (h0[1] + o0[1]) / 2 - 0.045), b = P2((h2[0] + o1[0]) / 2 + 0.03, (h2[1] + o1[1]) / 2 + 0.035);
  const len = a.distanceTo(b);
  for (const sx of [-1, 1]) {
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.82, len * 0.82 / 8), m);
    pl.position.copy(a).lerp(b, 0.5).add(V(sx * (FW / 2 + 0.0015), 0, 0));
    // the words read left to right from whichever side you look
    const nrm = V(sx, 0, 0), xa = (sx < 0 ? a.clone().sub(b) : b.clone().sub(a)).normalize(), ya = new THREE.Vector3().crossVectors(nrm, xa);
    pl.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, ya, nrm));
    frame.add(pl);
  }
}

function makeMaterials(T, env, look, BK = {}) {
  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.9, ...o });
  const phys = (o) => new THREE.MeshPhysicalMaterial({ envMap: env, envMapIntensity: 1, ...o });
  const m = {
    frame: phys({ color: 0xe53935, roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08 }),
    frame2: phys({ color: BK.rear ?? 0xe53935, roughness: 0.32, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }),
    metal: std({ color: 0xb8bcc4, roughness: 0.25, metalness: 1 }),
    fork: phys({ color: 0x111111, roughness: 0.3, metalness: 0.4, clearcoat: 0.8 }),
    forkM: phys({ color: BK.forkCol ?? 0x151515, roughness: 0.3, metalness: 0.3, clearcoat: 0.9 }),
    crownM: std({ color: 0x1a1a1c, roughness: 0.35, metalness: 0.7 }),
    stanchion: std({ color: BK.stan ?? 0xc8ccd2, roughness: 0.15, metalness: 1 }),
    shockRes: std({ color: 0x1d1d20, roughness: 0.3, metalness: 0.8 }),
    cassette: std({ color: 0xa7abb2, roughness: 0.3, metalness: 1 }),
    hub: std({ color: 0x1c1c1e, roughness: 0.3, metalness: 0.8 }),
    spoke: std({ color: 0x25262a, roughness: 0.4, metalness: 0.8 }),
    pedal: std({ color: 0x1e1e20, roughness: 0.4, metalness: 0.7 }),
    airCan: std({ color: 0x2b2b2b, roughness: 0.3, metalness: 0.8 }),
    caliper: std({ color: 0xc62828, roughness: 0.35, metalness: 0.7 }),
    crank: std({ color: 0x1c1c1e, roughness: 0.35, metalness: 0.6 }),
    chain: std({ color: 0x8a8f96, roughness: 0.4, metalness: 0.9 }),
    bar: std({ color: 0x1a1a1c, roughness: 0.35, metalness: 0.6 }),
    saddle: std({ color: 0x151515, roughness: 0.7 }),
    spring: std({ color: BK.spring ?? 0xff6d00, roughness: 0.3, metalness: 0.6 }),
    dark: std({ color: 0x1a1b1e, roughness: 0.6, metalness: 0.2 }),
    rim: std({ color: 0x141416, roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide }),
    rotor: std({ color: 0xd0d4da, roughness: 0.2, metalness: 1, side: THREE.DoubleSide }),
    tire: std({ color: 0x1c1c1c, roughness: 0.92 }),
    grip: std({ color: 0x222222, roughness: 0.95 }),
    plate: std({ color: 0xffffff, roughness: 0.6 }),
    sleeve: phys({ color: 0x1e88e5, roughness: 0.82, envMapIntensity: 0.35, bumpMap: cloth().knit, bumpScale: 0.6, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffffff }),
    jersey: phys({ color: 0x1e88e5, roughness: 0.82, envMapIntensity: 0.35, map: cloth().jersey, bumpMap: cloth().knit, bumpScale: 0.6, sheen: 0.6, sheenRoughness: 0.5, sheenColor: 0xffffff }),
    pants: phys({ color: 0x23262d, roughness: 0.88, envMapIntensity: 0.3, map: cloth().pants, bumpMap: cloth().knit, bumpScale: 0.8, sheen: 0.4, sheenRoughness: 0.6, sheenColor: 0xbfc4cc }),
    pad: phys({ color: 0x2a2c31, roughness: 0.45, clearcoat: 0.4, envMapIntensity: 0.6 }),
    shoe: std({ color: 0x202226, roughness: 0.75 }),
    sole: std({ color: 0xd9d9d0, roughness: 0.9 }),
    glove: phys({ color: 0x15161a, roughness: 0.75, sheen: 0.3, sheenColor: 0x777777 }),
    skin: std({ color: 0xd9a27e, roughness: 0.6, envMapIntensity: 0.3 }),
    helmetIn: std({ color: 0x15161a, roughness: 0.9 }),
    goggleFrame: std({ color: 0x18191d, roughness: 0.5 }),
    packM: phys({ color: 0x2b2f36, roughness: 0.7, sheen: 0.3, sheenColor: 0x999999 }),
    helmet: phys({ color: 0xffffff, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, map: cloth().helmet, side: THREE.DoubleSide }),
    goggle: phys({ color: 0xffb300, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.6, side: THREE.DoubleSide }),
    strap: std({ color: 0x111111, roughness: 0.8 }),
  };
  m.frame2.userData.same = BK.rear == null;
  applyLook(m, look);
  return m;
}

function applyLook(m, look) {
  if (look.frame !== undefined) { m.frame.color.setHex(look.frame); if (m.frame2.userData.same) m.frame2.color.setHex(look.frame); }
  if (m.decal && look.frame !== undefined) { const c = new THREE.Color(look.frame), lum = c.r * 0.3 + c.g * 0.6 + c.b * 0.1; m.decal.color.setHex(lum > 0.45 ? 0x111111 : 0xffffff); }
  if (look.jersey !== undefined) { m.jersey.color.setHex(look.jersey); m.sleeve.color.setHex(look.jersey); }
  if (look.helmet !== undefined) m.helmet.color.setHex(look.helmet);
  if (look.pants !== undefined) m.pants.color.setHex(look.pants);
  if (look.goggle !== undefined) m.goggle.color.setHex(look.goggle);
  const gold = c => c === GOLD_HEX;
  m.frame.metalness = gold(look.frame) ? 0.9 : 0.35; m.frame.roughness = gold(look.frame) ? 0.25 : 0.32;
  m.helmet.metalness = gold(look.helmet) ? 0.9 : 0.1;
}

export { STEER_AXIS };
