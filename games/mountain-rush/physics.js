// Mountain Rush: bike physics, tricks and crashes. Pure maths, no 3D.
//
// The bike is a point on the ground (where the wheels touch) with a heading (yaw).
// On the ground its speed follows the slope; it leaves the ground when the ground drops away
// faster than it can follow (jump lips, drops, crests). In the air you flip and spin;
// land with the bike pointing where you're going or you crash.
//
// Input each step: { steer -1..1 (right +), throttle -1..1 (up = pedal / front flip),
//   jump (held, bunny hop), pump (held, crouch: speed on down-slopes), stretch (held: stay low off lips),
//   whip, barspin (tap), superman, nohand, table, cancan, nofoot (hold), manual (held),
//   flipLock / spinLock (a trick modifier is held, so the arrows pick tricks instead of flipping) }
import { clamp, lerp } from '../sky-pilot/noise.js';

const G = 9.81;
const HOLDS = ['superman', 'nohand', 'table', 'cancan', 'nofoot'];   // tricks you hold in the air
export const COM = 0.95;            // centre of mass above the wheels' contact point
const TAU = Math.PI * 2;

export const TRICKS = {
  backflip: { name: 'Backflip', pts: 600 },
  frontflip: { name: 'Front flip', pts: 750 },
  spin: { name: '360', pts: 400 },
  whip: { name: 'Tailwhip', pts: 450 },
  barspin: { name: 'Barspin', pts: 300 },
  superman: { name: 'Superman', pts: 350 },
  nohand: { name: 'No hander', pts: 250 },
  table: { name: 'Table top', pts: 300 },
  cancan: { name: 'Can-can', pts: 300 },
  nofoot: { name: 'No footer', pts: 350 },
};

export function newRider(world) {
  const b = {
    pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
    yaw: 0, ground: true, n: { x: 0, y: 1, z: 0 }, up: { x: 0, y: 1, z: 0 },
    steer: 0, lean: 0, crouch: 0, charge: 0, jumpHeld: false,
    // air
    air: 0, flip: 0, flipV: 0, spin: 0, spinV: 0, basePitch: 0, takeoffUp: { x: 0, y: 1, z: 0 },
    whip: 0, whipping: false, bar: 0, barring: false, superman: 0, nohand: 0, table: 0, cancan: 0, nofoot: 0, holdT: {},
    whipEdge: false, barEdge: false, airTricks: [],
    // ground tricks
    manual: 0, manualT: 0, manualBal: 0,
    // pedalling, wheels
    crank: 0, wheel: 0, slide: 0, speed: 0, pedal: 0, brake: 0,
    // state
    crashed: false, crashT: 0, finished: false, events: [],
    cp: 0, progress: 0, route: 0, onTrail: true,
    P: { pedal: 1, drag: 1, grip: 1, spin: 1, pop: 1, soak: 1.6 },     // bike stats (bike.js BIKES)
  };
  placeAt(b, world, world.start);
  return b;
}

export function placeAt(b, world, p) {
  b.pos.x = p.x; b.pos.z = p.z; b.pos.y = world.height(p.x, p.z);
  b.yaw = p.yaw; b.vel.x = b.vel.y = b.vel.z = 0;
  b.ground = true; b.air = 0; b.flip = b.spin = b.flipV = b.spinV = 0;
  b.whip = b.bar = 0; for (const k of HOLDS) b[k] = 0; b.holdT = {}; b.whipping = b.barring = false;
  b.manual = 0; b.crashed = false; b.crashT = 0; b.airTricks = [];
  b.steer = 0; b.lean = 0; b.crouch = 0; b.charge = 0; b.slide = 0;
  world.normal(b.pos.x, b.pos.z, b.n); copy(b.up, b.n);
}

// ------------------------------------------------------------------ tiny vector helpers
const copy = (o, a) => { o.x = a.x; o.y = a.y; o.z = a.z; return o; };
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b, o = {}) => { const x = a.y * b.z - a.z * b.y, y = a.z * b.x - a.x * b.z, z = a.x * b.y - a.y * b.x; o.x = x; o.y = y; o.z = z; return o; };
const norm = o => { const l = Math.hypot(o.x, o.y, o.z) || 1; o.x /= l; o.y /= l; o.z /= l; return o; };
const wrap = a => { a %= TAU; if (a > Math.PI) a -= TAU; if (a < -Math.PI) a += TAU; return a; };

// bike forward direction from heading + pitch (pitch + = nose up)
export function bikeForward(yaw, pitch, o = {}) {
  const c = Math.cos(pitch);
  o.x = Math.sin(yaw) * c; o.y = Math.sin(pitch); o.z = Math.cos(yaw) * c; return o;
}

const tmpF = {}, tmpS = {}, tmpN = {}, tmpT = {}, tmpB = {};

export function stepRider(b, world, inp, dt) {
  b.events.length = 0;
  if (b.crashed) { b.crashT += dt; return; }

  // smooth the controls a little so keyboards feel like a stick
  b.steer = lerp(b.steer, inp.steer, 1 - Math.exp(-dt * (b.ground ? 9 : 14)));
  b.lean = lerp(b.lean, inp.throttle, 1 - Math.exp(-dt * 12));
  b.pedal = b.ground ? Math.max(0, inp.throttle) : 0;
  b.stretch = !!inp.stretch; b.pump = !!inp.pump;
  b.brake = b.ground ? Math.max(0, -inp.throttle) : 0;

  // jump: hold to crouch, let go to pop
  if (inp.jump) { b.charge = Math.min(1, b.charge + dt * 3); }
  b.crouch = lerp(b.crouch, inp.jump || inp.pump ? 1 : inp.stretch ? -0.6 : 0, 1 - Math.exp(-dt * 10));
  const popNow = b.jumpHeld && !inp.jump;
  b.jumpHeld = inp.jump;

  if (b.ground) groundStep(b, world, inp, dt, popNow);
  else airStep(b, world, inp, dt);
  if (!inp.jump) b.charge = Math.max(0, b.charge - dt * 4);

  // trees
  if (!b.crashed) {
    const sp = Math.hypot(b.vel.x, b.vel.z);
    for (const t of world.treesNear(b.pos.x, b.pos.z)) {
      const dx = b.pos.x - t.x, dz = b.pos.z - t.z, d = Math.hypot(dx, dz), rr = 0.5 + 0.25 * t.s;
      if (d < rr && b.pos.y < t.y + 10) {
        if (sp > 5) { crash(b, 'tree'); break; }
        const nx = dx / (d || 1), nz = dz / (d || 1), into = b.vel.x * nx + b.vel.z * nz;
        if (into < 0) { b.vel.x -= into * nx; b.vel.z -= into * nz; }
        b.pos.x = t.x + nx * rr; b.pos.z = t.z + nz * rr;
      }
    }
  }

  // where on the trail
  const ta = world.trailAt(b.pos.x, b.pos.z);
  b.onTrail = ta.i >= 0 && ta.d < world.routes[ta.r].halfW(ta.i) + 1;
  if (ta.i >= 0 && ta.d < 25) { b.progress = ta.i; b.route = ta.r; }
  b.speed = Math.hypot(b.vel.x, b.vel.y, b.vel.z);
  // out of the map
  if (Math.abs(b.pos.x) > world.HALF - 3 || b.pos.z < 2 || b.pos.z > world.L - 3) crash(b, 'edge');
}

function groundStep(b, world, inp, dt, popNow) {
  const n = world.normal(b.pos.x, b.pos.z, tmpN);
  copy(b.n, n);
  // heading direction along the ground
  const f = bikeForward(b.yaw, 0, tmpF);
  const fn = dot(f, n); f.x -= n.x * fn; f.y -= n.y * fn; f.z -= n.z * fn; norm(f);
  const s = cross(n, f, tmpS); norm(s);           // points to the rider's left
  let vF = dot(b.vel, f), vS = dot(b.vel, s);
  const speed = Math.hypot(vF, vS);
  const onDirt = world.trailMask(b.pos.x, b.pos.z) > 0.4;

  // steering: tighter when slow
  const rate = lerp(2.4, 1.05, clamp(Math.abs(vF) / 16, 0, 1)) * (b.manual > 0.3 ? 0.6 : 1);
  b.yaw = wrap(b.yaw - b.steer * rate * dt * (Math.abs(vF) > 0.3 ? 1 : 0.3));

  // forces along the bike
  const gF = -G * f.y, gS = -G * s.y;
  const pedalA = b.pedal * b.P.pedal * Math.max(0, 8 - 0.48 * Math.max(0, vF));
  const roll = (onDirt ? 0.22 : 0.9) * world.B.roll * Math.sign(vF);
  const drag = 0.0062 * b.P.drag * vF * Math.abs(vF);
  // pumping: crouch on the way down a roller / landing to gain speed
  const pumpA = inp.pump && f.y < -0.03 ? clamp(-f.y * 6, 0, 1) * 1.6 : 0;
  let a = gF + pedalA + pumpA - roll - drag * (inp.pump ? 0.75 : 1);
  vF += a * dt;
  if (b.brake > 0) { const bd = b.brake * 8 * dt; vF = Math.abs(vF) <= bd ? 0 : vF - Math.sign(vF) * bd; }
  if (Math.abs(vF) < 0.05 && b.pedal === 0 && Math.abs(gF) < 0.6) vF = 0;   // stop on gentle bits

  // sideways: grip, or slide (drift) when asking too much
  vS += gS * dt;
  const grip = (onDirt ? 9.5 : 7.5) * world.B.grip * b.P.grip * n.y * (b.brake > 0.5 ? 0.75 : 1);
  const dv = grip * dt;
  const old = vS;
  vS = Math.abs(vS) <= dv ? 0 : vS - Math.sign(vS) * dv;
  b.slide = lerp(b.slide, Math.abs(old) > dv ? Math.min(1, Math.abs(old) / 4) : 0, 0.2);

  b.vel.x = f.x * vF + s.x * vS; b.vel.y = f.y * vF + s.y * vS; b.vel.z = f.z * vF + s.z * vS;

  // manual (front wheel up): balance it with forward/back
  if (inp.manual && speed > 2) {
    b.manual = Math.min(1, b.manual + dt * 4);
    b.manualBal += (Math.sin(b.manualT * 2.3) * 0.5 + (Math.random() - 0.5)) * dt * 1.2 - inp.throttle * dt * 1.6;
    b.manualBal = clamp(b.manualBal, -1.2, 1.2);
    b.manualT += dt;
    if (Math.abs(b.manualBal) >= 1.2) { endManual(b); }
  } else if (b.manual > 0) endManual(b);

  // pop off the ground
  if (popNow && speed > 0.5 || popNow && b.charge > 0.2) {
    const pop = (2.4 + 2.4 * b.charge) * b.P.pop;
    b.vel.x += n.x * pop; b.vel.y += n.y * pop; b.vel.z += n.z * pop;
    b.charge = 0;
    takeOff(b);
    b.pos.y += 0.05;
    b.events.push({ type: 'pop' });
    return;
  }

  // move, then see if the ground is still under us
  b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt; b.pos.z += b.vel.z * dt;
  const h = world.height(b.pos.x, b.pos.z);
  const n2 = world.normal(b.pos.x, b.pos.z, tmpT);
  const into = dot(b.vel, n2);
  if (b.pos.y > h + 0.03 || (into > 0.3 && b.pos.y > h - 0.05)) {
    // the ground falls away. A sharp lip throws you up; a gentle hump or roller the suspension
    // and your legs soak up (up to about 1.6 g), so you stay on the ground.
    const hv = Math.hypot(b.vel.x, b.vel.z) || 1, dx = b.vel.x / hv * 0.8, dz = b.vel.z / hv * 0.8;
    const kap = (world.height(b.pos.x + dx, b.pos.z + dz) - 2 * h + world.height(b.pos.x - dx, b.pos.z - dz)) / 0.64;
    const need = -kap * hv * hv;
    if (need > G * b.P.soak || b.pos.y > h + 0.25) { b.pos.y = Math.max(b.pos.y, h) + 0.005; takeOff(b); return; }
  }
  b.pos.y = h;
  if (into < 0) {   // ground came up: lose the bit going into it (suspension soaks it up)
    const sp = Math.hypot(b.vel.x, b.vel.y, b.vel.z);
    b.vel.x -= n2.x * into; b.vel.y -= n2.y * into; b.vel.z -= n2.z * into;
    const sp2 = Math.hypot(b.vel.x, b.vel.y, b.vel.z) || 1, keep = lerp(sp, sp2, 0.6) / sp2;
    b.vel.x *= keep; b.vel.y *= keep; b.vel.z *= keep;
    if (-into > 2.5) b.events.push({ type: 'thud', v: -into });
  } else if (into > 0) { // ground falls away a bit: follow it
    b.vel.x -= n2.x * into; b.vel.y -= n2.y * into; b.vel.z -= n2.z * into;
  }
  b.up.x = lerp(b.up.x, n2.x, 0.3); b.up.y = lerp(b.up.y, n2.y, 0.3); b.up.z = lerp(b.up.z, n2.z, 0.3); norm(b.up);
  // pedal crank + wheels
  b.wheel += vF * dt / 0.36;
  if (b.pedal > 0) b.crank += dt * (4 + vF * 0.5);
  else b.crank = lerp(b.crank, Math.round(b.crank / Math.PI) * Math.PI, 0.08);
}

function endManual(b) {
  if (b.manualT > 0.6) {
    const pts = Math.round(b.manualT * 120 / 10) * 10;
    b.events.push({ type: 'trick', list: [`Manual ${b.manualT.toFixed(1)}s`], pts, ground: true });
  }
  b.manual = 0; b.manualT = 0; b.manualBal = 0;
}

function takeOff(b) {
  if (b.manual > 0) endManual(b);
  // counterpump: stretching at the lip soaks it up and keeps you low
  if (b.stretch && b.vel.y > 0) { const n = b.n, vn = dot(b.vel, n); if (vn > 0) { b.vel.x -= n.x * vn * 0.45; b.vel.y -= n.y * vn * 0.45; b.vel.z -= n.z * vn * 0.45; } }
  b.ground = false; b.air = 0;
  b.flip = b.spin = 0; b.flipV = b.spinV = 0;
  const hs = Math.hypot(b.vel.x, b.vel.z);
  // start with the bike pitched like the ground it left
  const f = bikeForward(b.yaw, 0, tmpB);
  const along = dot(b.n, f);
  b.basePitch = Math.atan2(-along, b.n.y);
  if (hs < 0.5) b.basePitch = 0;
  copy(b.takeoffUp, b.up);
  b.airTricks = []; b.holdT = {};
}

function airStep(b, world, inp, dt) {
  b.air += dt;
  b.vel.y -= G * dt;
  const hs = Math.hypot(b.vel.x, b.vel.z);
  const dragK = 0.004 * Math.hypot(b.vel.x, b.vel.y, b.vel.z);
  b.vel.x -= b.vel.x * dragK * dt; b.vel.z -= b.vel.z * dragK * dt;
  b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt; b.pos.z += b.vel.z * dt;

  // the bike's nose slowly follows the way it's flying (riders do this without thinking)
  const velPitch = Math.atan2(b.vel.y, Math.max(0.5, hs));
  // ...and near the ground, lines up with the landing (an easy-landing helper)
  const g0 = world.height(b.pos.x, b.pos.z), above = b.pos.y - g0;
  let target = velPitch * 0.85;
  if (hs > 1 && Math.abs(b.lean) < 0.2) {
    const dx = b.vel.x / hs, dz = b.vel.z / hs;
    const slope = Math.atan2(world.height(b.pos.x + dx * 1.5, b.pos.z + dz * 1.5) - world.height(b.pos.x - dx * 0.5, b.pos.z - dz * 0.5), 2);
    target = lerp(target, slope, clamp(1 - above / 3.5, 0, 1) * 0.85);
  }
  b.basePitch = lerp(b.basePitch, target, 1 - Math.exp(-dt * 2.2));

  // flips and spins (only once properly in the air)
  const can = b.air > 0.12;
  const wantFlip = can && !inp.flipLock ? -b.lean * 7.2 * b.P.spin : 0;            // down / back = backflip (nose up)
  const wantSpin = can && !inp.spinLock ? -b.steer * 7.6 * b.P.spin : 0;           // right = spin right
  b.flipV = lerp(b.flipV, wantFlip, 1 - Math.exp(-dt * (Math.abs(wantFlip) > 0.1 ? 5 : 7)));
  b.spinV = lerp(b.spinV, wantSpin, 1 - Math.exp(-dt * (Math.abs(wantSpin) > 0.1 ? 6 : 8)));
  b.flip += b.flipV * dt; b.spin += b.spinV * dt;
  // no input: settle to the nearest whole turn (helps land)
  if (Math.abs(wantFlip) < 0.1) { const tgt = Math.round(b.flip / TAU) * TAU; b.flip = lerp(b.flip, tgt, 1 - Math.exp(-dt * 2.2)); }
  if (Math.abs(wantSpin) < 0.1) { const tgt = Math.round(b.spin / TAU) * TAU; b.spin = lerp(b.spin, tgt, 1 - Math.exp(-dt * 2.6)); }

  // tricks
  if (can && inp.whip && !b.whipEdge && !b.whipping) { b.whipping = true; b.whip = 0; }
  b.whipEdge = inp.whip;
  if (b.whipping) { b.whip += dt * TAU / 0.55 * b.P.spin; if (b.whip >= TAU) { b.whip = 0; b.whipping = false; b.airTricks.push('whip'); } }
  if (can && inp.barspin && !b.barEdge && !b.barring) { b.barring = true; b.bar = 0; }
  b.barEdge = inp.barspin;
  if (b.barring) { b.bar += dt * TAU / 0.42 * b.P.spin; if (b.bar >= TAU) { b.bar = 0; b.barring = false; b.airTricks.push('barspin'); } }
  for (const k of HOLDS) {
    const on = can && !!inp[k];
    b[k] = lerp(b[k], on ? 1 : 0, 1 - Math.exp(-dt * (on ? 6.5 : 9.5)));
    const t = b.holdT[k] || 0;
    if (b[k] > 0.8) b.holdT[k] = t + dt;
    else if (t > 0.15) { b.airTricks.push(k); b.holdT[k] = 0; }
    else if (b[k] < 0.3) b.holdT[k] = 0;
  }
  b.wheel += hs * dt / 0.36 * 0.98;

  // landing?
  const h = world.height(b.pos.x, b.pos.z);
  if (b.pos.y <= h) {
    if (b.air < 0.06 && b.vel.y > 0) b.pos.y = h + 0.005;    // just left a lip: don't land straight back on it
    else land(b, world, h);
  }
}

function land(b, world, h) {
  b.pos.y = h;
  const n = world.normal(b.pos.x, b.pos.z, tmpN);
  copy(b.n, n);
  // the way the ground goes, in the direction we're moving
  const vh = Math.hypot(b.vel.x, b.vel.z) || 1;
  const t = { x: b.vel.x / vh, y: 0, z: b.vel.z / vh };
  const tn = dot(t, n); t.x -= n.x * tn; t.y -= n.y * tn; t.z -= n.z * tn; norm(t);
  const bf = bikeForward(b.yaw + b.spin, b.basePitch + b.flip, tmpF);
  const err = Math.acos(clamp(dot(bf, t), -1, 1));
  const into = -dot(b.vel, n);
  const flips = Math.round(b.flip / TAU), spins = Math.round(b.spin / TAU);
  const whipBad = b.whipping && b.whip > 0.9 && b.whip < TAU - 0.9;
  const barBad = false;
  const poseBad = b.superman > 0.45 || b.nohand > 0.6 || b.table > 0.5 || b.cancan > 0.55 || b.nofoot > 0.5;
  const shortHop = b.air < 0.35;
  // landing on the up-slope (came up short: "cased it") hurts but you ride away
  const cased = t.y > 0.08 && Math.abs(wrap(b.flip)) < 0.6 && Math.abs(wrap(b.spin)) < 0.6;
  const okErr = shortHop ? 1.1 : cased ? 1.5 : 0.85;
  if (err > okErr || into > 16 || whipBad || barBad || poseBad) {
    crash(b, err > okErr ? 'angle' : into > 15 ? 'hard' : 'trick');
    b.crashInfo = { err, into, air: b.air, flip: b.flip, spin: b.spin, base: b.basePitch };
    return;
  }
  // count tricks
  const list = [];
  let pts = 0;
  const add = (k, n2 = 1) => { if (n2 <= 0) return; const T = TRICKS[k]; list.push((n2 > 1 ? n2 + 'x ' : '') + T.name); pts += T.pts * n2; };
  if (flips > 0) add('backflip', flips);
  if (flips < 0) add('frontflip', -flips);
  if (spins !== 0) { const sp = Math.abs(spins); list.push(sp * 360 + ''); pts += TRICKS.spin.pts * sp * (sp > 1 ? 1.3 : 1); }
  if (b.whipping && b.whip > TAU - 0.9) b.airTricks.push('whip');
  for (const k of HOLDS) if (b[k] > 0.8 && (b.holdT[k] || 0) > 0.15) b.airTricks.push(k);
  const counts = {};
  for (const k of b.airTricks) counts[k] = (counts[k] || 0) + 1;
  for (const k in counts) add(k, counts[k]);
  const kinds = (flips !== 0 ? 1 : 0) + (spins !== 0 ? 1 : 0) + Object.keys(counts).length;
  if (kinds > 1) pts = Math.round(pts * (1 + 0.5 * (kinds - 1)));
  const perfect = err < 0.22 && into < 9;
  if (b.air > 0.7) { const airPts = Math.round(b.air * 60 / 10) * 10; pts += airPts; if (!list.length) list.push(`Air ${b.air.toFixed(1)}s`); }
  if (perfect && list.length) { pts += 100; }
  // keep going the way we were going, bike now points along the ground
  b.yaw = wrap(Math.atan2(bf.x, bf.z));
  // sharp landings lose speed
  const keep = 1 - clamp(err / 0.85, 0, 1.4) * 0.3 - clamp(into / 15, 0, 1) * 0.15;
  const vt = { x: b.vel.x + n.x * into, y: b.vel.y + n.y * into, z: b.vel.z + n.z * into };
  b.vel.x = vt.x * keep; b.vel.y = vt.y * keep; b.vel.z = vt.z * keep;
  b.ground = true; b.flip = b.spin = 0; b.flipV = b.spinV = 0;
  b.whip = 0; b.whipping = false; b.bar = 0; b.barring = false; for (const k of HOLDS) b[k] = 0; b.holdT = {};
  copy(b.up, n);
  b.events.push({ type: 'land', v: into, air: b.air, perfect, cased: cased && err > 0.85 });
  if (list.length && pts > 0) b.events.push({ type: 'trick', list, pts, perfect });
  b.air = 0;
}

export function crash(b, why) {
  if (b.crashed) return;
  if (b.manual > 0) { b.manual = 0; b.manualT = 0; }
  b.crashed = true; b.crashT = 0; b.crashWhy = why;
  b.events.push({ type: 'crash', why });
}

// bike orientation for drawing: { up, fwd } unit vectors, plus pitch/yaw used in the air
export function bikeFrame(b, out) {
  if (b.ground) {
    const f = bikeForward(b.yaw, 0, out.fwd);
    // riders stay upright on a side slope: keep the ground's tilt along the bike (pitch), not across it (roll)
    const sx = Math.cos(b.yaw), sz = -Math.sin(b.yaw);          // sideways, level
    const ns = b.up.x * sx + b.up.z * sz;
    const n = out.up; n.x = b.up.x - sx * ns * 0.9; n.y = b.up.y; n.z = b.up.z - sz * ns * 0.9; norm(n);
    const fn = dot(f, n); f.x -= n.x * fn; f.y -= n.y * fn; f.z -= n.z * fn; norm(f);
  } else {
    bikeForward(b.yaw + b.spin, b.basePitch + b.flip, out.fwd);
    // up is at right angles to forward, in the flip plane
    bikeForward(b.yaw + b.spin, b.basePitch + b.flip + Math.PI / 2, out.up);
  }
  return out;
}
