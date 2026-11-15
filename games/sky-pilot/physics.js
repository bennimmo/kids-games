// Sky Pilot: the flight model. Plain maths on plain data (no 3D objects), so it can run anywhere.
//
// Body axes: forward = +z, up = +y, left = +x.
// Inputs (-1..1): pitch (+ = nose up), roll (+ = roll right), yaw (+ = nose right), throttle 0..1
// Easy mode helps: wings level, holds height, auto gear/flaps/brakes, no stalls.
// No-crash mode: hitting the ground just bounces you back up.
import * as THREE from '../../js/vendor/three.module.min.js';
import { PLANES } from './planes.js';
import { surfaceAt, terrainHeight, WORLD_EDGE, CARRIER, runwayLocal } from './island.js';
import { clamp, lerp, smooth } from './noise.js';

const G = 9.81, D = Math.PI / 180;
const V = THREE.Vector3, Q = THREE.Quaternion;
const tv1 = new V(), tv2 = new V(), tv3 = new V(), tv4 = new V(), tq = new Q(), tq2 = new Q(), tm = new THREE.Matrix4(), te = new THREE.Euler();
const FWD = new V(0, 0, 1), UPV = new V(0, 1, 0), LEFT = new V(1, 0, 0), ZERO = new V();
// reused every step (no garbage = no little pauses)
const tF = new V(), tL = new V(), tT = new V();

export function newPlaneState(type) {
  const P = PLANES[type];
  return {
    type, P,
    pos: new V(), vel: new V(), quat: new Q(), omega: new V(), // omega: body rates (x = pitch down?, see below)
    throttle: 0, rpm: 0, ab: 0,
    gear: 1, gearDown: true, flaps: 0, flapPos: 0, brakes: 0, parking: false,
    onGround: true, surface: 'runway', crashed: 0, crashWhy: '',
    lights: true, landLight: true, smoke: false, hookCaught: false, catapult: 0,
    // read-outs
    speed: 0, ias: 0, alt: 0, agl: 0, vs: 0, aoa: 0, gload: 1, heading: 0, pitchAng: 0, bank: 0, stall: false, pullUp: false, gearWarn: false,
    events: [],           // 'takeoff', 'landing:<quality>', 'crash', 'bounce', 'stall', 'wire', 'splash'
    lastGround: 0, airTime: 0, steer: 0,
    input: { pitch: 0, roll: 0, yaw: 0, throttle: 0, brake: false },
  };
}

// put a plane somewhere. spot = { x, z, y?, hdg, air?, speed? }
export function placePlane(s, spot) {
  const P = s.P;
  s.quat.setFromEuler(te.set(0, 0, 0));
  const hq = new Q().setFromAxisAngle(UPV, -spot.hdg + Math.PI);      // heading -> model faces that way
  // model forward is +z; heading 0 = north = -z, so turn by PI
  s.quat.copy(hq);
  s.omega.set(0, 0, 0); s.crashed = 0; s.hookCaught = false; s.catapult = 0;
  s.events.length = 0;
  if (spot.air) {
    const v = spot.speed || (P.kind === 'heli' ? 0 : P.vref * 1.5);
    s.pos.set(spot.x, spot.y, spot.z);
    s.vel.copy(FWD).applyQuaternion(s.quat).multiplyScalar(v);
    s.onGround = false; s.gearDown = P.kind === 'heli' || P.gear !== 'retract' ? true : false; s.gear = s.gearDown ? 1 : 0;
    s.throttle = s.input.throttle = P.kind === 'heli' ? 0.5 : 0.7; s.rpm = s.throttle; s.flaps = 0; s.flapPos = 0; s.brakes = 0;
  } else {
    const g = surfaceAt(spot.x, spot.z);
    s.pos.set(spot.x, (spot.y ?? g.h) + P.gearH, spot.z);
    const pitch = P.groundPitch;
    s.quat.multiply(tq.setFromAxisAngle(LEFT, -pitch));
    s.vel.set(0, 0, 0);
    s.onGround = true; s.gearDown = true; s.gear = 1;
    s.throttle = s.input.throttle = 0; s.rpm = 0.2; s.flaps = P.flaps.length > 2 ? 1 : 0; s.flapPos = s.flaps; s.brakes = 1;
    s.surface = g.kind;
  }
  readouts(s);
}

// ---------------------------------------------------------------- helpers
function readouts(s) {
  const f = tv1.copy(FWD).applyQuaternion(s.quat), u = tv2.copy(UPV).applyQuaternion(s.quat);
  s.heading = (Math.atan2(f.x, -f.z) + Math.PI * 2) % (Math.PI * 2);
  s.pitchAng = Math.asin(clamp(f.y, -1, 1));
  // bank: angle of the up vector around the forward axis (+ = right wing down)
  const left = tv3.copy(LEFT).applyQuaternion(s.quat);
  s.bank = Math.atan2(left.y, u.y);
  s.speed = s.vel.length();
  s.ias = s.speed * Math.sqrt(Math.exp(-Math.max(0, s.pos.y) / 9000));
  s.alt = s.pos.y;
  const g = surfaceAt(s.pos.x, s.pos.z);
  s.agl = s.pos.y - g.h - s.P.gearH;
  s.vs = s.vel.y;
}

function crash(s, why, opts) {
  if (s.crashed) return;
  if (opts.noDie) { s.events.push('bounce'); return 'bounce'; }
  s.crashed = 1; s.crashWhy = why; s.events.push('crash');
  s.vel.multiplyScalar(0.1); s.omega.set(0, 0, 0); s.throttle = 0;
  return 'crash';
}

// gentle "boing" for no-crash mode: put the plane back above the ground, level and flying
function bounceUp(s, groundH) {
  const P = s.P;
  readouts(s);
  s.pos.y = Math.max(s.pos.y, groundH + P.gearH + 6);
  const hq = tq.setFromAxisAngle(UPV, -s.heading + Math.PI);
  s.quat.slerp(hq, 0.85);
  const sp = Math.max(s.speed, P.kind === 'heli' ? 0 : P.vref * 1.25);
  s.vel.copy(FWD).applyQuaternion(s.quat).multiplyScalar(sp);
  s.vel.y = Math.max(s.vel.y, 4);
  s.omega.set(0, 0, 0);
}

// ---------------------------------------------------------------- one step
// opts: { easy, noDie, wind: Vector3 }
export function stepPlane(s, dt, opts) {
  if (s.crashed) { s.crashed += dt; readouts(s); return; }
  const P = s.P, inp = s.input;
  // spool engine
  s.throttle = clamp(inp.throttle, 0, 1);
  const spool = P.jet ? 0.45 : 2.5;
  s.rpm += (s.throttle - s.rpm) * Math.min(1, dt * spool * (P.kind === 'heli' ? 2 : 1));
  s.ab = P.ab && s.throttle > 0.95 && s.rpm > 0.9 ? Math.min(1, (s.rpm - 0.9) * 10) : 0;
  // gear + flaps move slowly
  if (P.gear === 'retract') s.gear = clamp(s.gear + (s.gearDown ? 1 : -1) * dt / 4.5, 0, 1); else s.gear = 1;
  s.flapPos += clamp(s.flaps - s.flapPos, -dt * 0.5, dt * 0.5);
  s.brakes = inp.brake || s.parking ? 1 : 0;

  if (P.kind === 'heli') stepHeli(s, dt, opts);
  else stepFixed(s, dt, opts);

  // turn back at the edge of the world
  const r = Math.hypot(s.pos.x, s.pos.z);
  s.edge = r > WORLD_EDGE - 2500;
  if (r > WORLD_EDGE) { s.pos.multiplyScalar(WORLD_EDGE / r); s.vel.reflect(tv1.set(s.pos.x, 0, s.pos.z).normalize()); }
  if (s.pos.y > 12000) { s.pos.y = 12000; s.vel.y = Math.min(0, s.vel.y); }
  readouts(s);
  // warnings
  const groundAhead = terrainHeight(s.pos.x + s.vel.x * 8, s.pos.z + s.vel.z * 8);
  s.pullUp = !s.onGround && s.vel.y < -3 && (s.pos.y + s.vel.y * 6 < groundAhead + 20) && s.agl > 15 && !(s.gearDown && s.flapPos > 0.4 && s.vel.y > -8 && s.landingNear);
  s.gearWarn = !s.onGround && P.gear === 'retract' && !s.gearDown && s.agl < 120 && s.vel.y < -1 && s.ias < P.vref * 1.5;
  if (!s.onGround) s.airTime += dt;
}

function stepFixed(s, dt, opts) {
  const P = s.P, inp = s.input;
  const q = s.quat;
  const fwd = tv1.copy(FWD).applyQuaternion(q), up = tv2.copy(UPV).applyQuaternion(q), left = tv3.copy(LEFT).applyQuaternion(q);
  const air = tv4.copy(s.vel).sub(opts.wind || ZERO);       // airflow relative to the plane
  const v = air.length();
  const rho = 1.225 * Math.exp(-Math.max(0, s.pos.y) / 9000);
  const qd = 0.5 * rho * v * v;
  // angle of attack and sideslip
  const vf = air.dot(fwd), vu = air.dot(up), vl = air.dot(left);
  const aoa = v > 1 ? Math.atan2(-vu, Math.max(vf, 0.1)) : 0;
  const beta = v > 1 ? Math.atan2(vl, Math.max(vf, 0.1)) : 0;
  s.aoa = aoa;
  const flapsCL = lerp(P.flaps[Math.floor(s.flapPos)] || 0, P.flaps[Math.ceil(s.flapPos)] || 0, s.flapPos % 1);
  const flapsCD = lerp(P.flapDrag[Math.floor(s.flapPos)] || 0, P.flapDrag[Math.ceil(s.flapPos)] || 0, s.flapPos % 1);
  const stallA = P.stall + flapsCL * 0.06;
  // lift curve with a stall
  let cl = P.cl0 + flapsCL + P.cla * aoa;
  const over = Math.abs(aoa) - stallA;
  if (over > 0) cl = Math.sign(aoa) * Math.max(0.3, (P.clmax + flapsCL) * (1 - over * 2.2)) + (aoa < 0 ? 0 : 0);
  cl = clamp(cl, -1.2, P.clmax + flapsCL + 0.1);
  s.stall = over > 0 && !s.onGround && v > 5;
  const cd = P.cd0 + flapsCD + P.k * cl * cl + s.gear * (P.gear === 'retract' ? 0.015 : 0) + (s.spoilers ? 0.05 : 0) + Math.abs(beta) * 0.3;

  const F = tF.set(0, -P.mass * G, 0);
  if (v > 0.5) {
    const vd = tv4.copy(air).divideScalar(v);
    // lift: at right angles to the airflow, towards the plane's up
    const liftDir = tL.copy(up).addScaledVector(vd, -up.dot(vd)).normalize();
    F.addScaledVector(liftDir, qd * P.wing * cl);
    F.addScaledVector(vd, -qd * P.wing * cd);
    F.addScaledVector(left, -qd * P.wing * 0.5 * beta);   // side force
  }
  // thrust
  let thrust = P.thrust * (P.jet ? Math.pow(s.rpm, 1.7) : s.rpm) * (rho / 1.225) ** (P.jet ? 0.7 : 0.9);
  if (!P.jet) thrust *= clamp(1 - Math.max(0, vf) / P.vmaxProp, 0, 1) * 1.2;
  else thrust *= 1 - clamp(vf / 600, 0, 0.35);
  if (s.ab) thrust *= 1 + (P.ab - 1) * s.ab;
  if (s.reverse && s.onGround) thrust *= -0.4;
  F.addScaledVector(fwd, thrust);
  // catapult (carrier)
  if (s.catapult > 0) { F.addScaledVector(fwd, P.mass * 28); s.catapult -= dt; }

  // ---------------- rotation (rate model: stick sets how fast you turn, the air keeps the nose pointing into the wind)
  const auth = clamp(v / (P.vr * 0.9), 0, 1) ** 1.3;                 // controls work better with speed
  let pi = inp.pitch, ri = inp.roll, yi = inp.yaw;
  const bank = Math.atan2(left.y, up.y), pitchA = Math.asin(clamp(fwd.y, -1, 1));
  // easy mode: loops and rolls only high up (safe), otherwise normal limits
  const stunts = P.aerobatic && s.agl > 300;
  if (opts.easy && !s.onGround) {
    // wings level when you let go, and limit the bank
    if (Math.abs(ri) < 0.05) ri = clamp(-bank * 1.6, -0.6, 0.6);
    else if (!stunts && Math.abs(bank) > 58 * D && Math.sign(ri) === Math.sign(bank)) ri = clamp((58 * D * Math.sign(bank) - bank) * 2, -1, 1);
    // hold height when you let go
    const gamma = v > 1 ? Math.asin(clamp(s.vel.y / v, -1, 1)) : 0;
    // just after take-off it climbs by itself to a safe height
    const want = s.agl < 150 && s.airTime < 60 && s.throttle > 0.5 ? 7 * D : 0;
    // landing: wheels down, low and slow on power -> settle gently onto the runway
    const settle = s.gearDown && s.agl < 12 && s.throttle < 0.4 && s.vel.y < 0 ? clamp(-1 / Math.max(v, 1), -0.05, 0) : null;
    const tg = settle !== null ? settle : want;
    if (Math.abs(pi) < 0.05 || (settle !== null && pi < 0)) pi = clamp((tg - gamma) * 3 - s.omega.x * 0.3, -0.5, 0.5);
    if (!stunts && pitchA > 35 * D && pi > 0) pi *= 0.2;     // the jet can loop (high up), the others can't
    if (!stunts && pitchA < -35 * D && pi < 0) pi *= 0.2;
    // no stalling: limit the angle of attack
    if (aoa > stallA * 0.75 && pi > 0) pi *= clamp(1 - (aoa - stallA * 0.75) / (stallA * 0.2), -0.6, 1);
    // turns are coordinated by the tail
    yi += clamp(bank * 0.15, -0.3, 0.3);
  }
  const [rr, pr, yr] = P.rates;
  // targets in rad/s. omega.x = pitch up rate, omega.z = roll right rate, omega.y = yaw right rate
  const easyRoll = opts.easy ? 1.4 : 1;
  const target = tT.set(pi * pr * D * auth, yi * yr * D * auth, ri * rr * D * auth * easyRoll);
  // stability: the nose wants to follow the airflow
  const qn = clamp(qd / (0.5 * 1.225 * P.vr * P.vr), 0, 4);
  // easy mode: trim for a level turn (more lift when banked)
  const nTrim = opts.easy && !s.onGround ? 1 / Math.max(Math.cos(bank), 0.5) : 1;
  const trimAoa = clamp(nTrim * P.mass * G / Math.max(qd * P.wing, 1) / P.cla - (P.cl0 + flapsCL) / P.cla, -4 * D, stallA * 0.85);
  target.x += -(aoa - (s.onGround ? aoa : trimAoa)) * 1.4 * Math.min(qn, 1.5) * (P.agile || 1);
  target.y -= beta * 1.2 * Math.min(qn, 1.5);
  // stalled: nose drops, a wing may drop (not in easy mode)
  if (s.stall) {
    target.x -= 0.5;
    if (!opts.easy) target.z += Math.sin(s.airTime * 2.3) * 0.6;
  }
  // g limit
  const gnow = qd * P.wing * cl / (P.mass * G);
  s.gload = gnow;
  if (gnow > P.maxG && target.x > 0) target.x *= 0.3;
  const resp = 4.5;
  s.omega.x += (target.x - s.omega.x) * Math.min(1, dt * resp);
  s.omega.y += (target.y - s.omega.y) * Math.min(1, dt * resp);
  s.omega.z += (target.z - s.omega.z) * Math.min(1, dt * resp * 1.4);

  if (!s.onGround) {
    // integrate rotation in body axes
    tq.setFromAxisAngle(LEFT, -s.omega.x * dt); q.multiply(tq);
    tq.setFromAxisAngle(UPV, -s.omega.y * dt); q.multiply(tq);
    tq.setFromAxisAngle(FWD, s.omega.z * dt); q.multiply(tq);
    q.normalize();
    s.vel.addScaledVector(F, dt / P.mass);
    // easy mode: a little extra turn when banked, so turning feels quick
    if (opts.easy && !s.stall) {
      const extra = clamp(bank, -1, 1) * 0.16 * dt;
      tq.setFromAxisAngle(UPV, -extra);
      s.vel.applyQuaternion(tq); q.premultiply(tq);
    }
    s.pos.addScaledVector(s.vel, dt);
    airContact(s, opts);
  } else {
    groundRoll(s, dt, opts, F, thrust, cl, qd);
  }
}

// ---------------- on the ground: roll along, steer with the nose wheel, lift off when there's enough lift
function groundRoll(s, dt, opts, F, thrust, cl, qd) {
  const P = s.P, inp = s.input;
  readouts(s);
  let hdg = s.heading;
  const fwdFlat = tv1.set(Math.sin(hdg), 0, -Math.cos(hdg));
  let vf = s.vel.dot(fwdFlat);
  const g = surfaceAt(s.pos.x, s.pos.z);
  s.surface = g.kind;
  const water = g.kind === 'water';
  // wrong surface?
  if (water && P.gear !== 'floats') {
    if (crash(s, 'water', opts) === 'bounce') { bounceUp(s, 0); s.onGround = false; s.events.push('splash'); }
    return;
  }
  // forces along the ground
  const lift = qd * P.wing * cl;
  const weight = Math.max(0, P.mass * G - lift);
  let mu = water ? 0.06 + Math.abs(vf) * 0.004 : g.kind === 'grass' || g.kind === 'land' ? 0.05 : 0.02;
  let brake = s.brakes;
  if (opts.easy && inp.throttle < 0.08 && Math.abs(vf) > 0.5) brake = Math.max(brake, 0.7);
  if (water) brake *= 0.2;
  const along = F.dot(fwdFlat) + thrust * 0 - Math.sign(vf) * weight * (mu + brake * 0.55);
  let acc = along / P.mass;
  if (Math.abs(vf) < 0.3 && Math.abs(F.dot(fwdFlat)) < weight * (mu + brake * 0.55)) { vf = 0; acc = 0; }
  // arrestor wire on the carrier
  if (g.kind === 'deck' && P.hook && s.gearDown && vf > 20 && !s.hookCaught && s.justLanded) { s.hookCaught = true; s.events.push('wire'); }
  if (s.hookCaught) { acc = Math.min(acc, -vf * vf / 160 - 3); if (vf < 1) { s.hookCaught = false; vf = 0; } }
  vf += acc * dt;
  if (s.hookCaught && vf < 0) vf = 0;
  s.justLanded = false;
  // steering: rudder or stick, less at speed
  const steerIn = clamp(inp.yaw + inp.roll, -1, 1);
  s.steer = steerIn;
  const maxSteer = lerp(0.9, 0.05, smooth(4, 45, Math.abs(vf)));
  const turnRate = vf * Math.tan(steerIn * maxSteer) / P.wheelbase + (water ? steerIn * 0.2 * clamp(Math.abs(vf) / 5, 0, 1) : 0);
  hdg += turnRate * dt;
  // pitch: rotate for take-off
  let pitch = s.pitchAng;
  const groundPitch = P.groundPitch;
  const auth = clamp((Math.abs(vf) - P.vr * 0.75) / (P.vr * 0.35), 0, 1);
  let pi = inp.pitch;
  if (opts.easy && Math.abs(pi) < 0.05 && vf > P.vr && s.throttle > 0.5) pi = 0.7;    // easy take-off: lifts the nose itself
  if (pi > 0.05 && auth > 0) pitch += pi * auth * 6 * D * dt;
  else pitch += (groundPitch - pitch) * Math.min(1, dt * 2.5);
  pitch = clamp(pitch, groundPitch, P.tailStrike);
  if (pitch >= P.tailStrike - 0.001 && vf > 20 && !opts.easy && !opts.noDie) { /* tail scrape: just a bump */ }
  // ground slope
  const yGround = g.h + (water ? Math.sin(s.T * 2) * 0.05 : 0);
  // attitude from heading + pitch
  s.quat.setFromAxisAngle(UPV, -hdg + Math.PI).multiply(tq.setFromAxisAngle(LEFT, -pitch));
  s.vel.copy(tv1.set(Math.sin(hdg), 0, -Math.cos(hdg))).multiplyScalar(vf);
  s.pos.addScaledVector(s.vel, dt);
  // off the runway end into the sea / off the carrier
  const g2 = surfaceAt(s.pos.x, s.pos.z);
  if (g.kind === 'deck' && g2.kind !== 'deck') { s.onGround = false; s.vel.y = -1; s.events.push('offdeck'); return; }
  s.pos.y = g2.h + P.gearH + (pitch - groundPitch) * 2.5;
  s.omega.set(0, 0, 0);
  // lift off
  if (lift > P.mass * G * 1.02 && vf > P.vr * 0.85 && s.throttle > 0.4) {
    s.onGround = false; s.vel.y = 1.5; s.events.push('takeoff'); s.airTime = 0;
  }
  // bumpy off-runway at speed
  if ((g2.kind === 'land') && Math.abs(vf) > 40 && !opts.noDie && !opts.easy) {
    const slope = Math.abs(terrainHeight(s.pos.x + s.vel.x * 0.5, s.pos.z + s.vel.z * 0.5) - g2.h);
    if (slope > 3) crash(s, 'rough', opts);
  }
}

// ---------------- in the air: did we touch something?
function airContact(s, opts) {
  const P = s.P;
  const g = surfaceAt(s.pos.x, s.pos.z);
  const fwd = tv1.copy(FWD).applyQuaternion(s.quat), up = tv2.copy(UPV).applyQuaternion(s.quat);
  // lowest point: the wheels (or belly if the gear is up), and a wing tip when banked
  const wheels = s.pos.y - P.gearH * (P.gear === 'retract' ? (0.35 + 0.65 * s.gear) : 1) * up.y;
  const left = tv3.copy(LEFT).applyQuaternion(s.quat);
  const tip = s.pos.y - Math.abs(left.y) * P.span * 0.5;
  const nose = s.pos.y + fwd.y * P.length * 0.45 - 0.5;
  const tail = s.pos.y - fwd.y * P.length * 0.45 - 0.5;
  const ground = g.h;
  const lowest = Math.min(wheels, tip + 0.3, nose, tail);
  // tall buildings / mountains in front are handled by the same check (terrain height)
  if (lowest > ground) return;
  const vs = s.vel.y;
  readouts(s);
  const bankOk = Math.abs(s.bank) < 18 * D;
  const pitchOk = s.pitchAng > -6 * D && s.pitchAng < P.tailStrike + 3 * D;
  const surfaceOk = g.kind === 'water' ? P.gear === 'floats' : P.gear !== 'floats' || g.kind === 'runway' || g.kind === 'grass' || g.kind === 'land' || g.kind === 'deck';
  const gearOk = s.gear > 0.95;
  const softEnough = vs > -(opts.easy ? 6 : 4.2);
  const speedOk = s.speed < P.vno * 1.4;
  if (bankOk && pitchOk && surfaceOk && gearOk && softEnough && speedOk && wheels <= ground + 0.2) {
    // landed!
    const q = vs > -0.9 ? 'butter' : vs > -2 ? 'good' : vs > -3.2 ? 'ok' : 'hard';
    s.onGround = true; s.justLanded = true;
    s.pos.y = ground + P.gearH;
    s.vel.y = 0;
    s.events.push('landing:' + q);
    if (g.kind === 'water') s.events.push('splash');
    return;
  }
  // a bit too hard but upright: bounce
  if (bankOk && pitchOk && gearOk && surfaceOk && vs > -7 && (opts.easy || opts.noDie)) {
    s.pos.y = ground + P.gearH + 0.3; s.vel.y = Math.abs(vs) * 0.35; s.events.push('bounce');
    return;
  }
  const why = !gearOk ? 'gear' : !surfaceOk ? (g.kind === 'water' ? 'water' : 'surface') : !bankOk ? 'wing' : !softEnough ? 'hard' : 'ground';
  if (crash(s, why, opts) === 'bounce') bounceUp(s, ground);
  else s.pos.y = Math.max(s.pos.y, ground + 0.5);
}

// ---------------------------------------------------------------- helicopter
function stepHeli(s, dt, opts) {
  const P = s.P, inp = s.input, q = s.quat;
  const up = tv2.copy(UPV).applyQuaternion(q);
  readouts(s);
  // collective: throttle. 0.5 = hover (easy mode holds height at 0.5)
  const rho = Math.exp(-Math.max(0, s.pos.y) / 9000);
  let lift;
  if (opts.easy) {
    const wantVs = (s.throttle - 0.5) * 2 * 8;                 // -8..8 m/s
    lift = P.mass * (G + (wantVs - s.vel.y) * 1.5) / Math.max(0.4, up.y);
    lift = clamp(lift, 0, P.mass * G * P.lift) * Math.min(1, s.rpm * 2.2);
  } else lift = P.mass * G * P.lift * s.throttle * Math.min(1, s.rpm * 1.2) * rho;
  const F = tF.set(0, -P.mass * G, 0).addScaledVector(up, lift);
  // drag
  const air = tv4.copy(s.vel).sub(opts.wind || ZERO);
  F.addScaledVector(air, -air.length() * P.mass * G / (P.vmax * P.vmax) * 1.0 - P.mass * 0.05);
  // rotation: cyclic tilts, pedals yaw
  let yi = inp.yaw;
  readouts(s);
  const pitchA = s.pitchAng, bank = s.bank;
  const [rr, pr, yr] = P.rates;
  let tx, tz;
  if (opts.easy) {
    // stick sets the tilt: forward = nose down = fly forward. Let go = level hover.
    tx = (inp.pitch * 22 * D - pitchA) * 2.5;
    tz = (inp.roll * 28 * D - bank) * 2.5;
    yi += inp.roll * 0.7 * clamp(s.speed / 15, 0, 1);  // turn with the stick when moving
  } else {
    tx = (inp.pitch * 40 * D - pitchA) * 1.3;
    tz = (inp.roll * 50 * D - bank) * 1.3;
  }
  const target = tT.set(tx, yi * yr * D, tz);
  // forward flight makes the nose follow the airflow a little
  s.omega.x += (target.x - s.omega.x) * Math.min(1, dt * 4);
  s.omega.y += (target.y - s.omega.y) * Math.min(1, dt * 3);
  s.omega.z += (target.z - s.omega.z) * Math.min(1, dt * 4);
  if (s.onGround) {
    s.steer = 0;
    // sit on skids until there's enough lift
    if (lift > P.mass * G * 1.01 && s.rpm > 0.4) { s.onGround = false; s.events.push('takeoff'); s.airTime = 0; }
    else {
      s.vel.set(0, 0, 0); s.omega.set(0, s.omega.y * 0.5, 0);
      tq.setFromAxisAngle(UPV, -s.omega.y * dt); q.multiply(tq);
      readouts(s);
      const g = surfaceAt(s.pos.x, s.pos.z);
      s.quat.setFromAxisAngle(UPV, -s.heading + Math.PI);
      s.pos.y = g.h + P.gearH;
      if (g.kind === 'water') { if (crash(s, 'water', opts) === 'bounce') { bounceUp(s, 0); s.onGround = false; } }
      return;
    }
  }
  tq.setFromAxisAngle(LEFT, -s.omega.x * dt); q.multiply(tq);
  tq.setFromAxisAngle(UPV, -s.omega.y * dt); q.multiply(tq);
  tq.setFromAxisAngle(FWD, s.omega.z * dt); q.multiply(tq);
  q.normalize();
  s.vel.addScaledVector(F, dt / P.mass);
  s.pos.addScaledVector(s.vel, dt);
  s.aoa = 0; s.stall = false; s.gload = lift / (P.mass * G);
  // touch down
  const g = surfaceAt(s.pos.x, s.pos.z);
  if (s.pos.y - P.gearH * up.y <= g.h) {
    readouts(s);
    const ok = s.vel.y > -(opts.easy ? 5 : 3) && Math.abs(s.bank) < 15 * D && Math.abs(s.pitchAng) < 15 * D && s.speed < 12 && g.kind !== 'water';
    if (ok) {
      const vs = s.vel.y;
      s.onGround = true; s.pos.y = g.h + P.gearH; s.vel.set(0, 0, 0);
      s.events.push('landing:' + (vs > -0.8 ? 'butter' : vs > -1.8 ? 'good' : 'ok'));
    } else {
      const why = g.kind === 'water' ? 'water' : 'ground';
      if (crash(s, why, opts) === 'bounce') bounceUp(s, g.h);
      else s.pos.y = g.h + 0.5;
    }
  }
}

// snapshot for online (small numbers)
export function netState(s) {
  const r = v => Math.round(v * 100) / 100;
  return {
    p: [r(s.pos.x), r(s.pos.y), r(s.pos.z)], v: [r(s.vel.x), r(s.vel.y), r(s.vel.z)],
    q: [s.quat.x, s.quat.y, s.quat.z, s.quat.w].map(x => Math.round(x * 10000) / 10000),
    th: r(s.rpm), g: r(s.gear), f: r(s.flapPos), l: s.lights ? 1 : 0, sm: s.smoke ? 1 : 0, cr: s.crashed ? 1 : 0, ab: r(s.ab),
    i: [r(s.input.pitch), r(s.input.roll), r(s.input.yaw)],
  };
}
