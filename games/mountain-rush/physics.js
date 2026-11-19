// Mountain Rush: bike physics, tricks and crashes. Pure maths, no 3D.
//
// The bike is tracked at the point midway between its wheels, with a heading (yaw) and a lean angle (roll).
// It steers like a real bike: the stick leans it over, and the lean is what turns it. The tyres grip on a
// curve: a little slip gives the most grip, push past that and they let go gradually and slide.
// Its pitch comes from where the front and rear wheels touch the ground.
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

// How the bike handles.
//   grip: how hard the tyres hold      tip: how fast the bike leans in      low: turn rate at walking pace
//   rear: how much the back tyre holds (below 1 it steps out before the front lets go)
//   drift: how far and fast the back swings when it goes      hook: how quickly it grips again
export const HANDLING = {
  sharp: { grip: 21, tip: 24, low: 3.8, rear: 0.92, drift: 1.2, hook: 7 },
};

export function newRider(world) {
  const b = {
    pos: { x: 0, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 },
    yaw: 0, ground: true, n: { x: 0, y: 1, z: 0 }, up: { x: 0, y: 1, z: 0 },
    steer: 0, lean: 0, crouch: 0, charge: 0, jumpHeld: false, roll: 0, rollV: 0, slip: 0,
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
    cp: 0, progress: 0, route: 0, onTrail: true, rough: 0, rattle: 0, noCrash: false,
    P: { pedal: 1, drag: 1, grip: 1, spin: 1, pop: 1, soak: 1.6 },     // bike stats (bike.js BIKES)
    H: HANDLING.sharp, drift: 0,
  };
  placeAt(b, world, world.start);
  return b;
}

export function placeAt(b, world, p) {
  b.pos.x = p.x; b.pos.z = p.z; b.pos.y = world.height(p.x, p.z);
  b.yaw = p.yaw; b.vel.x = b.vel.y = b.vel.z = 0;
  b.ground = true; b.air = 0; b.flip = b.spin = b.flipV = b.spinV = 0;
  b.whip = b.bar = 0; for (const k of HOLDS) b[k] = 0; b.holdT = {}; b.whipping = b.barring = false;
  b.manual = 0; b.crashed = false; b.crashT = 0; b.airTricks = []; b.rattle = 0;
  b.steer = 0; b.lean = 0; b.crouch = 0; b.charge = 0; b.slide = 0; b.carve = 0; b.spinSet = 0; b.roll = 0; b.rollV = 0; b.slip = 0; b.drift = 0;
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

const tmpF = {}, tmpS = {}, tmpN = {}, tmpT = {}, tmpB = {}, tmpSurf = { wood: 0, stone: 0, rough: 0 };

export function stepRider(b, world, inp, dt) {
  b.events.length = 0;
  if (world.setRef) world.setRef(b.pos.y + 0.3);       // which level we're on where a bridge crosses a tunnel
  if (b.crashed) { b.crashT += dt; return; }
  inp = { ...inp, steer: inp.steer || 0, throttle: inp.throttle || 0 };

  // smooth the controls a little so keyboards feel like a stick
  // (turning in eases on gently; letting go straightens up quicker)
  const turnIn = Math.abs(inp.steer) > Math.abs(b.steer) && inp.steer * b.steer >= 0;
  b.steer = lerp(b.steer, inp.steer, 1 - Math.exp(-dt * (b.ground ? (turnIn ? 11 : 13) : 14)));
  b.lean = lerp(b.lean, inp.throttle, 1 - Math.exp(-dt * 12));
  // how hard you're carving right now: turning into a lip is what sets up a spin
  if (b.ground) b.carve = lerp(b.carve || 0, inp.steer, 1 - Math.exp(-dt * 5));
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
        if (sp > 5 && !b.noCrash) { crash(b, 'tree'); break; }
        if (sp > 5) { b.vel.x *= 0.5; b.vel.z *= 0.5; b.events.push({ type: 'save', why: 'tree' }); }      // no-crash mode: bump off it
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
  // rock gardens on the tech sections: fine slowly; too fast and they shake you off
  b.rough = world.roughAt(b.pos.x, b.pos.z);
  const safe = 9.2 + (b.P.soak - 1.6) * 4;
  if (b.rough > 0.4 && speed > safe && !b.crashed) { b.rattle += (speed - safe) * dt * 0.55 * b.rough; if (b.rattle > 1) { if (b.noCrash) { b.rattle = 0.4; b.vel.x *= 0.7; b.vel.z *= 0.7; b.events.push({ type: 'save', why: 'rocks' }); } else { crash(b, 'rocks'); return; } } }
  else b.rattle = Math.max(0, b.rattle - dt * 0.8);

  // water: drags a little and throws spray
  const wet = world.waterAt ? world.waterAt(b.pos.x, b.pos.z, b.pos.y) : 0;
  b.wet = wet;
  if (wet > 0.02) { b.splashT = (b.splashT || 0) - dt; if (speed > 2 && b.splashT <= 0) { b.splashT = 0.05; b.events.push({ type: 'splash', v: speed, deep: wet }); } }
  // too steep to ride up and you've run out of speed (the side of a cutting, a bank): don't sit there perched
  // on it pedalling. The front wheel falls away along the slope and you roll off it.
  if (n.y < 0.62 && speed < 3) { const l = Math.hypot(n.x, n.z) || 1; glance(b, n.x / l, n.z / l, 3.5 * dt); }
  // ---- what the tyres are on, and how much grip that gives
  const sf = world.surfaceAt ? world.surfaceAt(b.pos.x, b.pos.z, tmpSurf) : tmpSurf;
  const mu = (onDirt ? 1 : 0.72) * world.B.grip * b.P.grip * (sf.wood > 0.5 ? 0.86 : 1) * (sf.stone > 0.5 ? 0.92 : 1) * (wet > 0.02 ? 0.72 : 1);
  const H = b.H || HANDLING.sharp;
  const tyre = H.grip * mu * n.y;
  // ---- lean to steer: the stick asks for a turn, the bike leans over to make it, and the lean is what turns you.
  // Slow: you turn the bars (quick, tight). Fast: you can only ask for what the tyres can hold, so the same
  // stick gives a wider, smoother arc, and it takes a moment to tip in and to stand back up.
  const v = Math.abs(vF), vv = Math.max(v, 0.6);
  const yawCmd = b.steer * Math.min(H.low, 0.97 * tyre / vv) * (b.manual > 0.3 ? 0.6 : 1);
  const rollWant = Math.atan(yawCmd * vv / G);
  const tipIn = Math.abs(rollWant) > Math.abs(b.roll) ? H.tip : H.tip + 2;
  b.rollV += (tipIn * tipIn * (rollWant - b.roll) - 2 * tipIn * b.rollV) * dt;
  b.roll += b.rollV * dt;
  // (when the front tyre is pushing wide the bike turns less than its lean asks: understeer)
  const push = b.brake > 0.5 ? 0 : clamp((b.slip - 3) / 3, 0, 2);
  const yawRate = G * Math.tan(b.roll) / vv / (1 + 0.45 * push) * (1 + 0.5 * Math.abs(b.drift));      // (with the back stepped out the bike rotates quicker)
  b.yaw = wrap(b.yaw - yawRate * dt * (v > 0.3 ? 1 : 0.3));
  // ---- the back wheel. The front tyre carries the steering and digs in; it almost never slides. The back
  // just follows, and it is the one that lets go: when the turn (or the brake) asks more than it can hold it
  // swings out, the bike points further into the corner, and it costs you speed until it hooks up again.
  { const rearGrip = tyre * H.rear * (b.brake > 0.5 ? 0.42 : 1) * (b.pedal > 0.5 && v < 7 ? 0.85 : 1);
    const ask = Math.abs(yawRate) * v + Math.abs(b.rollV) * 2.2;          // cornering load, plus a flick of the bike
    const turnDir = Math.sign(b.roll) || Math.sign(b.steer);
    if (ask > rearGrip && v > 3) b.drift += -turnDir * Math.min(3.2, (ask - rearGrip) / Math.max(4, v) * 1.6 * H.drift) * dt;
    else b.drift -= b.drift * Math.min(1, H.hook * dt);
    b.drift = clamp(b.drift, -0.62, 0.62);
    if (Math.abs(b.drift) > 0.03) vF -= Math.sign(vF) * Math.min(Math.abs(vF), Math.abs(b.drift) * 9 * dt); }

  // forces along the bike
  const gF = -G * f.y, gS = -G * s.y;
  const pedalA = b.pedal * b.P.pedal * Math.max(0, 8 - 0.48 * Math.max(0, vF));
  const roll = (onDirt ? 0.22 : 0.9) * world.B.roll * Math.sign(vF);
  const drag = 0.0062 * b.P.drag * vF * Math.abs(vF);
  // pumping: crouch on the way down a roller / landing to gain speed
  const pumpA = inp.pump && f.y < -0.03 ? clamp(-f.y * 6, 0, 1) * 1.6 : 0;
  let a = gF + pedalA + pumpA - roll - drag * (inp.pump ? 0.75 : 1) - (wet > 0.02 ? vF * Math.min(1.6, 0.5 + wet * 3) : 0);
  vF += a * dt;
  if (b.brake > 0) {
    const bd = b.brake * 8 * dt;
    if (vF > bd) vF -= bd;
    else if (vF > -0.05 && b.brake > 0.5) vF = Math.max(vF - 2.5 * dt, -2);     // stopped and still braking: roll backwards (to get off a wall)
    else if (vF < -2) vF = Math.min(-2, vF + bd);
  }
  if (Math.abs(vF) < 0.05 && b.pedal === 0 && Math.abs(gF) < 0.6) vF = 0;   // stop on gentle bits

  // sideways: grip, or slide (drift) when asking too much
  // on a bank the tyres dig in: the slope turns the bike down and round it (you ride up a berm and
  // carve back off it) rather than the whole bike slipping sideways
  const dig = Math.abs(s.y) < 0.84 ? 0.85 * (1 - b.rough * 0.8) : 0;
  // (gentle cross-slopes, like the dish of the trail, don't steer you)
  const gDig = Math.abs(vF) > 1.5 ? -G * Math.sign(s.y) * Math.max(0, Math.abs(s.y) - 0.13) * dig : 0;
  b.yaw = wrap(b.yaw + gDig / Math.max(3, Math.abs(vF)) * Math.sign(vF) * dt);
  vS += (gS - gDig) * dt;
  // a berm holds you: when the ground banks up on the outside of your turn it pushes you round,
  // so you can rail it flat out without sliding
  const bankUp = s.y * Math.sign(vS || b.steer);              // > 0 when the ground rises on the side you're being pushed toward
  const berm = clamp(bankUp * 6, 0, 2.6);
  // a steep side-slope that isn't holding you up as a berm: the tyres let go and you slip straight down it
  const steepSide = berm < 0.5 ? clamp((Math.abs(s.y) - 0.83) * 10, 0, 1) : 0;
  const grip = tyre * (b.brake > 0.5 ? 0.72 : 1) * (1 + berm) * (1 - steepSide);
  // tyre grip curve: a little sideways slip gives more and more grip up to a peak; past the peak the tyre lets
  // go gradually and slides with less grip than it had, until you ease off and it hooks up again
  // (stiff tyres: the peak comes at a very small slip, so in normal cornering - and round a berm - the bike goes
  //  where its front wheel points instead of creeping sideways)
  const vPeak = 0.3 + 0.012 * v, sl = Math.abs(vS) / vPeak;
  const curve = sl < 1 ? sl * (2 - sl) : Math.max(0.88, 1 - 0.03 * (sl - 1));       // the front tyre keeps biting
  const dv = grip * curve * dt;
  vS = Math.abs(vS) <= dv ? 0 : vS - Math.sign(vS) * dv;
  b.slip = sl;
  if (sl > 2.5 && steepSide < 0.5) {
    vF -= Math.sign(vF) * Math.min(Math.abs(vF), grip * 0.1 * Math.min(1.5, (sl - 2.5) / 3) * dt);        // sliding scrubs speed
  }
  if (steepSide < 0.5) vS -= vS * Math.min(1, (6 + 10 * clamp(berm, 0, 1)) * dt);       // ...and a berm holds it harder still
  b.slide = lerp(b.slide, clamp(Math.max((sl - 3) / 4, Math.abs(b.drift) / 0.3), 0, 1), 0.2);
  b.vS = vS; b.bankUp = bankUp;

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
    // a bunny hop is worth most on the flat. Off a jump lip you're already flying up, so a well-timed
    // pop only adds a little (like real pre-jumping), never a second jump's worth.
    let pop = (1.9 + 1.6 * b.charge) * b.P.pop / (1 + Math.max(0, b.vel.y) * 0.9);
    // right at a lip (the ground drops away just ahead) a hop adds very little, even on a steep downhill
    if (speed > 3) {
      const hv = Math.hypot(b.vel.x, b.vel.z) || 1, ahead = world.height(b.pos.x + b.vel.x / hv * 1.6, b.pos.z + b.vel.z / hv * 1.6);
      if (b.pos.y + b.vel.y / hv * 1.6 - ahead > 0.3) pop *= 0.3;
    }
    b.vel.x += n.x * pop; b.vel.y += n.y * pop; b.vel.z += n.z * pop;
    b.charge = 0;
    takeOff(b);
    b.pos.y += 0.05;
    b.events.push({ type: 'pop' });
    return;
  }

  // move, then see if the ground is still under us
  const ox = b.pos.x, oy = b.pos.y, oz = b.pos.z;
  b.pos.x += b.vel.x * dt; b.pos.y += b.vel.y * dt; b.pos.z += b.vel.z * dt;
  let h = world.height(b.pos.x, b.pos.z);
  // ran into a wall (the side of a jump, a step-up face): stop against it, don't pop up on top
  // (a face steeper than about 63 degrees is a wall at any speed - no creeping up it)
  if (h - b.pos.y > 0.35 || (h > oy + 0.015 && world.normal(b.pos.x, b.pos.z, tmpB).y < 0.45)) { if (hitWall(b, world, ox, oy, oz)) return; h = world.height(b.pos.x, b.pos.z); }
  const n2 = world.normal(b.pos.x, b.pos.z, tmpT);
  const into = dot(b.vel, n2);
  if (b.pos.y > h + 0.03 || (into > 0.3 && b.pos.y > h - 0.05)) {
    // the ground falls away. A sharp lip throws you up; a gentle hump or roller the suspension
    // and your legs soak up (up to about 1.6 g), so you stay on the ground.
    const hv = Math.hypot(b.vel.x, b.vel.z) || 1, dx = b.vel.x / hv * 0.8, dz = b.vel.z / hv * 0.8;
    const kap = (world.height(b.pos.x + dx, b.pos.z + dz) - 2 * h + world.height(b.pos.x - dx, b.pos.z - dz)) / 0.64;
    const need = -kap * hv * hv;
    // Rock gardens: the wheels follow the bumps and the rider soaks them up, so you stay on the ground through
    // them (and on the lip where the rocks start) unless the ground really drops away from under you.
    const rocky = Math.max(b.rough, world.roughAt(b.pos.x + dx * 4, b.pos.z + dz * 4), world.roughAt(b.pos.x - dx * 2.5, b.pos.z - dz * 2.5)) > 0.25;
    let needR = need;
    if (rocky) { const ex = dx * 3.5, ez = dz * 3.5; needR = -(world.height(b.pos.x + ex, b.pos.z + ez) - 2 * h + world.height(b.pos.x - ex, b.pos.z - ez)) / 7.84 * hv * hv; }     // judge the shape of the hill, not each rock
    if ((rocky ? needR > G * b.P.soak * 1.5 : need > G * b.P.soak) || b.pos.y > h + (rocky ? 0.55 : 0.25)) { b.pos.y = Math.max(b.pos.y, h) + 0.005; takeOff(b); return; }
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
  // over rocks the wheels and suspension do the work: the frame and rider stay steady, not see-sawing
  const follow = b.rough > 0.2 ? 0.035 : 0.3;
  // two wheels: the bike's pitch comes from where its front and rear tyres touch (0.58 m ahead and behind),
  // so the front rises onto a ramp first and drops off an edge first, like the real thing
  { const fx = Math.sin(b.yaw), fz = Math.cos(b.yaw), WB = 0.58;
    const hF = clamp(world.height(b.pos.x + fx * WB, b.pos.z + fz * WB) - h, -0.7, 0.7), hR = clamp(world.height(b.pos.x - fx * WB, b.pos.z - fz * WB) - h, -0.7, 0.7);
    const tl = Math.hypot(2 * WB, hF - hR), tx = fx * 2 * WB / tl, ty = (hF - hR) / tl, tz = fz * 2 * WB / tl;      // along the bike, wheel to wheel
    const d2 = n2.x * tx + n2.y * ty + n2.z * tz; let ux = n2.x - tx * d2, uy = n2.y - ty * d2, uz = n2.z - tz * d2; const ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    b.up.x = lerp(b.up.x, ux, follow); b.up.y = lerp(b.up.y, uy, follow); b.up.z = lerp(b.up.z, uz, follow); norm(b.up); }
  // pedal crank + wheels
  b.wheel += vF * dt / 0.36;
  if (b.pedal > 0) b.crank += dt * (4 + vF * 0.5);
  else b.crank = lerp(b.crank, Math.round(b.crank / Math.PI) * Math.PI, 0.08);
}

// back off a wall; true if it was hard enough to crash
function hitWall(b, world, ox, oy, oz) {
  const n = world.normal(b.pos.x, b.pos.z, tmpB);
  let nx = n.x, nz = n.z; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;      // points away from the high side
  b.pos.x = ox; b.pos.z = oz; b.pos.y = Math.max(oy, world.height(ox, oz));
  const into = -(b.vel.x * nx + b.vel.z * nz);
  if (into > 0) { b.vel.x += nx * into * 1.05; b.vel.z += nz * into * 1.05; }
  if (into > 6.5 && !b.noCrash) { crash(b, 'wall'); return true; }
  // glance off: the front wheel is turned along the wall, so you slide along it and away instead of sitting
  // there pushing into it (and then pinging out when something finally gives)
  if (b.ground) glance(b, nx, nz, 0.07);
  return false;
}

// turn the bike along a wall (nx, nz points away from it) and a touch away from it
function glance(b, nx, nz, maxTurn) {
  const hx = Math.sin(b.yaw), hz = Math.cos(b.yaw), hi = -(hx * nx + hz * nz);
  if (hi <= 0) return;
  let tx = hx + nx * hi, tz = hz + nz * hi; const tl = Math.hypot(tx, tz);
  if (tl < 0.15) { const sgn = b.steer > 0 ? -1 : 1; tx = -nz * sgn; tz = nx * sgn; } else { tx /= tl; tz /= tl; }      // head-on: peel off to one side (the way you're steering)
  const want = Math.atan2(tx + nx * 0.25, tz + nz * 0.25);
  b.yaw = wrap(b.yaw + clamp(wrap(want - b.yaw), -maxTurn, maxTurn));
  b.roll *= 0.8; b.drift *= 0.8;
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
  b.spinSet = b.carve || 0;
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
  // spins come from the take-off: carve into the lip and you can keep it turning (a 360 and more);
  // with no set-up you can only nudge the bike round a little
  const set = b.spinSet || 0, setUp = b.steer * set > 0 ? clamp(Math.abs(set) * 1.35, 0, 1) : 0;
  const wantSpin = can && !inp.spinLock ? -b.steer * 7.6 * b.P.spin * (0.15 + 0.85 * setUp) : 0;           // right = spin right
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
  let h = world.height(b.pos.x, b.pos.z);
  // flew into the side of something much higher than you: bump off it
  // (or came down onto a near-vertical face: you can't land on that, you bump off and keep falling)
  if (h - b.pos.y > 0.5 || (b.pos.y <= h && b.air > 0.15 && world.normal(b.pos.x, b.pos.z, tmpB).y < 0.45)) { const px = b.pos.x - b.vel.x * dt, pz = b.pos.z - b.vel.z * dt, py = b.pos.y; if (hitWall(b, world, px, py, pz)) return; b.pos.y = Math.max(py, world.height(b.pos.x, b.pos.z)); h = world.height(b.pos.x, b.pos.z); }
  if (b.pos.y <= h) {
    // just left a lip and only brushing it: keep flying, don't count a landing
    const nn = world.normal(b.pos.x, b.pos.z, tmpT), hitV = -dot(b.vel, nn);
    if (b.air < 0.12 && hitV < 2.2) { b.pos.y = h + 0.005; if (hitV > 0) { b.vel.x += nn.x * hitV; b.vel.y += nn.y * hitV; b.vel.z += nn.z * hitV; } }
    else land(b, world, h);
  }
}

function land(b, world, h) {
  b.pos.y = h;
  const n = world.normal(b.pos.x, b.pos.z, tmpN);
  copy(b.n, n);
  // a tiny skim (wheels barely left the ground, no tricks): just carry on riding, no thud, no lost speed
  const skimV = -dot(b.vel, n);
  if (b.air < 0.22 && skimV < 3.5 && Math.abs(b.flip) < 0.3 && Math.abs(b.spin) < 0.3 && !b.whipping && !b.barring) {
    if (skimV > 0) { b.vel.x += n.x * skimV; b.vel.y += n.y * skimV; b.vel.z += n.z * skimV; }
    b.ground = true; b.air = 0; b.flip = b.spin = b.flipV = b.spinV = 0;
    for (const k of HOLDS) b[k] = 0; b.holdT = {};
    copy(b.up, n);
    return;
  }
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
  const wouldCrash = err > okErr || into > 16 || whipBad || barBad || poseBad;
  if (wouldCrash && !b.noCrash) {
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
  b.yaw = wouldCrash ? wrap(Math.atan2(b.vel.x, b.vel.z)) : wrap(Math.atan2(bf.x, bf.z));
  if (wouldCrash) { list.length = 0; pts = 0; b.events.push({ type: 'save', why: 'landing' }); }
  // sharp landings lose speed
  const keep = 1 - clamp(err / 0.85, 0, 1.4) * 0.3 - clamp(into / 15, 0, 1) * 0.15;
  const vt = { x: b.vel.x + n.x * into, y: b.vel.y + n.y * into, z: b.vel.z + n.z * into };
  b.vel.x = vt.x * keep; b.vel.y = vt.y * keep; b.vel.z = vt.z * keep;
  b.ground = true; b.flip = b.spin = 0; b.flipV = b.spinV = 0;
  b.whip = 0; b.whipping = false; b.bar = 0; b.barring = false; for (const k of HOLDS) b[k] = 0; b.holdT = {};
  copy(b.up, n);
  // landing in the rocks too fast shakes you
  const rgh = world.roughAt(b.pos.x, b.pos.z), safe = 9.2 + (b.P.soak - 1.6) * 4, hsp = Math.hypot(b.vel.x, b.vel.z);
  if (rgh > 0.4 && hsp > safe) { b.rattle += 0.35 + (hsp - safe) * 0.08; if (b.rattle > 1) { if (b.noCrash) b.rattle = 0.4; else { crash(b, 'rocks'); return; } } }
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
