// Race simulation. Pure data in, pure data out:
//   stepRace(race, track, items, inputs, dt)
// inputs = { [playerId]: { up, down, left, right } }
// Inputs can come from the keyboard now, or from a friend online later.
import { WORLD, TRACK_W, JUMP_L, WATER_RX, WATER_RY, BOOST_L, SOLIDS, nearestLocal, nearestGlobal } from './track.js';

export const LAPS = 5;

const ACC = 430;       // throttle
const BRAKE = 650;
const REV_ACC = 260;
const REV_MAX = 120;
const MAX = 360;       // top speed on dirt track
const OFF_MAX = 140;   // top speed on grass
const WATER_MAX = 170;
const TURN = 3.3;      // radians / sec at speed
const CAR_R = 17;      // collision radius
const GRAVITY = 900;
const MUD_MAX = 115;
const BOOST_TIME = 1.0;
export const CONE_R = 7;
const END_WAIT = 8;    // seconds the others get after the winner finishes

// ---- item boxes (Mario Kart style) ----
export const PICKUPS = ['rocket', 'banana', 'turbo'];
const BOX_RESPAWN = 3;
const ROLL_TIME = 0.9;      // the item "spins" before you can use it
const SHOT_SPEED = 620;
const HIT_R = 22;

// Each 'box' extra is a row of 3 boxes across the track.
export function boxesFromItems(items) {
  const out = [];
  items.filter(i => i.type === 'box').forEach((it, k) => {
    for (const o of [-29, 0, 29]) {
      out.push({ id: `b${k}_${o}`, x: it.x - Math.sin(it.a) * o, y: it.y + Math.cos(it.a) * o, up: it.up, cool: 0 });
    }
  });
  return out;
}

// No boxes placed? Put two rows on the track automatically (same on every device).
export function withAutoBoxes(track, items) {
  if (!track || items.some(i => i.type === 'box')) return items;
  const rows = [Math.floor(track.n * 0.3), Math.floor(track.n * 0.7)].map(i => {
    const p = track.pts[i];
    return { type: 'box', x: p.x, y: p.y, a: p.a, idx: i, up: !!track.bridge[i], auto: true };
  });
  return [...items, ...rows];
}

export function createRace(track, players) {
  const n = track.n;
  const cars = players.map((pl, k) => {
    const back = 5 + Math.floor(k / 2) * 5;
    const i = (n - back) % n;
    const p = track.pts[i];
    const side = (k % 2 === 0 ? -1 : 1) * 21;
    return {
      id: pl.id, color: pl.color, style: pl.style || 'truck', decal: pl.decal || 'none',
      x: p.x - Math.sin(p.a) * side, y: p.y + Math.cos(p.a) * side, a: p.a,
      vx: 0, vy: 0, idx: i, prog: -back, lap: 1, lapsDone: 0, started: false, seen: 0, near: true,
      boostT: 0, onBoost: false, inMud: false, onIce: false,
      item: null, rollT: 0, firePrev: false, spinT: 0, spinDir: 1, cpu: !!pl.cpu,
      z: 0, vz: 0, air: false, jumpCool: 0,
      onTrack: true, up: !!track.bridge[i], inWater: false,
      skid: 0, speed: 0, finished: false, place: 0,
    };
  });
  return {
    t: 0, phase: 'countdown', countdown: 3, goT: -1, cars, finishOrder: [], endTimer: END_WAIT, events: [],
    shots: [], bananas: [], remoteShots: [], remoteBananas: [], hitIds: new Set(), nextId: 1,
  };
}

function local(it, car) {
  const dx = car.x - it.x, dy = car.y - it.y;
  const c = Math.cos(it.a), s = Math.sin(it.a);
  return [dx * c + dy * s, -dx * s + dy * c];
}
const sameLayer = (it, car) => (it.idx < 0 ? !car.up : it.up === car.up);

function locate(car, track) {
  let { i, d } = nearestLocal(track, car.x, car.y, car.idx);
  if (d > TRACK_W * 1.2) {
    const g = nearestGlobal(track, car.x, car.y);
    if (g.d < TRACK_W * 0.6) { i = g.i; d = g.d; }
    else { car.onTrack = false; car.up = false; car.near = false; return; }
  }
  car.near = true;
  car.idx = i;
  car.onTrack = d <= TRACK_W / 2 + 4;
  car.up = car.onTrack && !!track.bridge[i];
}

function updateCar(car, inputIn, track, items, dt, ev) {
  let input = inputIn;
  const fx = Math.cos(car.a), fy = Math.sin(car.a);
  const rx = -fy, ry = fx;
  let vF = car.vx * fx + car.vy * fy;
  let vR = car.vx * rx + car.vy * ry;

  if (!car.air) locate(car, track);

  // what are we driving on?
  let grip = 6.5, drag = 0.45, maxF = MAX;
  let water = false, ramp = false, mud = false, ice = false, boost = false;
  if (!car.air) {
    for (const it of items) {
      if (!sameLayer(it, car)) continue;
      const [lx, ly] = local(it, car);
      const inBlob = (lx / WATER_RX) ** 2 + (ly / WATER_RY) ** 2 < 1;
      if (it.type === 'water' && inBlob) water = true;
      if (it.type === 'mud' && inBlob) mud = true;
      if (it.type === 'ice' && inBlob) ice = true;
      if (it.type === 'jump' && Math.abs(lx) < JUMP_L / 2 && Math.abs(ly) < TRACK_W / 2 + 3) ramp = true;
      if (it.type === 'boost' && Math.abs(lx) < BOOST_L / 2 && Math.abs(ly) < TRACK_W / 2) boost = true;
    }
    if (!car.onTrack) { maxF = OFF_MAX; drag = 1.2; grip = 5; }
    if (water) { maxF = Math.min(maxF, WATER_MAX); grip = 2; drag = 1.0; }
    if (mud) { maxF = Math.min(maxF, MUD_MAX); grip = 3.5; drag = 1.8; }
    if (ice) { grip = 0.6; drag = 0.12; }
    if (boost && !car.onBoost) { car.boostT = BOOST_TIME; ev.push({ type: 'boost', id: car.id }); }
  }
  car.onBoost = boost;
  if (car.spinT > 0) { // spinning out: no steering, slides
    car.spinT -= dt;
    car.a += car.spinDir * 13 * dt;
    grip = 1.2;
    input = {};
  }
  if (mud && !car.inMud && Math.abs(vF) > 40) ev.push({ type: 'mud', id: car.id });
  car.inMud = mud;
  car.onIce = ice;
  if (car.boostT > 0) {
    car.boostT -= dt;
    maxF = Math.max(maxF, MAX * 1.5);
    if (vF > 0) vF += 520 * dt;
  }
  if (water && !car.inWater && Math.abs(vF) > 40) ev.push({ type: 'splash', id: car.id });
  car.inWater = water;

  if (car.air) {
    car.vz -= GRAVITY * dt;
    car.z += car.vz * dt;
    if (car.z <= 0) {
      car.z = 0; car.vz = 0; car.air = false; car.jumpCool = 0.35;
      ev.push({ type: 'land', id: car.id });
    }
  } else {
    if (input.up) vF += ACC * dt;
    if (input.down) vF -= (vF > 10 ? BRAKE : REV_ACC) * dt;
    if (vF < -REV_MAX) vF = -REV_MAX;
    if (vF > maxF) vF = maxF + (vF - maxF) * Math.exp(-4 * dt); // slow down, don't stop
    vF *= Math.exp(-drag * dt);
    if (!input.up && !input.down) vF *= Math.exp(-0.9 * dt);
    const steer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
    const speedFactor = Math.min(1, Math.abs(vF) / 90);
    car.a += steer * TURN * speedFactor * (vF < 0 ? -1 : 1) * dt;
    vR *= Math.exp(-grip * dt); // partial grip = skidding

    car.jumpCool = Math.max(0, car.jumpCool - dt);
    if (ramp && car.jumpCool <= 0 && Math.abs(vF) > 70) {
      car.air = true;
      car.vz = 110 + Math.abs(vF) * 0.55;
      car.z = 0.01;
      ev.push({ type: 'jump', id: car.id });
    }
  }

  // velocity in the OLD heading: the car turns, its momentum lags = skid
  car.vx = fx * vF + rx * vR;
  car.vy = fy * vF + ry * vR;
  car.skid = car.air ? 0 : Math.abs(vR);
  car.speed = Math.hypot(car.vx, car.vy);
  car.x += car.vx * dt;
  car.y += car.vy * dt;

  // keep inside the world
  const m = 14;
  if (car.x < m) { car.x = m; car.vx = Math.abs(car.vx) * 0.3; }
  if (car.x > WORLD.w - m) { car.x = WORLD.w - m; car.vx = -Math.abs(car.vx) * 0.3; }
  if (car.y < m) { car.y = m; car.vy = Math.abs(car.vy) * 0.3; }
  if (car.y > WORLD.h - m) { car.y = WORLD.h - m; car.vy = -Math.abs(car.vy) * 0.3; }
}

// bump into tyre walls, trees and grandstands
function hitSolids(car, solids, ev) {
  for (const o of solids) {
    const S = SOLIDS[o.type];
    if (car.air && car.z > (o.type === 'tyres' ? 12 : 60)) continue; // fly over low things
    let nx, ny, pen;
    if (S.r) {
      const dx = car.x - o.x, dy = car.y - o.y, d = Math.hypot(dx, dy);
      if (d >= S.r + CAR_R || d === 0) continue;
      nx = dx / d; ny = dy / d; pen = S.r + CAR_R - d;
    } else {
      const c = Math.cos(o.a), s = Math.sin(o.a);
      const dx = car.x - o.x, dy = car.y - o.y;
      const lx = dx * c + dy * s, ly = -dx * s + dy * c;
      const [hw, hh] = S.box;
      const cx = Math.max(-hw, Math.min(hw, lx)), cy = Math.max(-hh, Math.min(hh, ly));
      let ox = lx - cx, oy = ly - cy, d = Math.hypot(ox, oy);
      if (d >= CAR_R) continue;
      if (d === 0) { // centre inside the box: push out the short way
        if (hw - Math.abs(lx) < hh - Math.abs(ly)) { ox = Math.sign(lx) || 1; oy = 0; pen = hw - Math.abs(lx) + CAR_R; }
        else { ox = 0; oy = Math.sign(ly) || 1; pen = hh - Math.abs(ly) + CAR_R; }
        d = 1;
      } else pen = CAR_R - d;
      const lnx = ox / d, lny = oy / d;
      nx = lnx * c - lny * s; ny = lnx * s + lny * c;
    }
    car.x += nx * pen; car.y += ny * pen;
    const vn = car.vx * nx + car.vy * ny;
    if (vn < 0) {
      car.vx -= 1.4 * vn * nx; car.vy -= 1.4 * vn * ny;
      if (-vn > 60) ev.push({ type: 'crash', id: car.id });
    }
  }
}

function updateCones(race, dt, ev) {
  for (const k of race.cones) {
    for (const c of race.cars) {
      if (c.air && c.z > 15) continue;
      const dx = k.x - c.x, dy = k.y - c.y, d = Math.hypot(dx, dy);
      if (d < CAR_R + CONE_R && c.speed > 10) {
        const nx = dx / (d || 1), ny = dy / (d || 1);
        k.vx = c.vx * 1.2 + nx * 60 + (Math.random() - 0.5) * 60;
        k.vy = c.vy * 1.2 + ny * 60 + (Math.random() - 0.5) * 60;
        k.vz = 90 + c.speed * 0.3;
        k.spin = (Math.random() - 0.5) * 20;
        if (!k.down) ev.push({ type: 'cone', id: c.id });
        k.down = true;
        if (!c.remote) { c.vx *= 0.95; c.vy *= 0.95; }
      }
    }
    if (!k.vx && !k.vy && !k.vz) continue;
    k.x += k.vx * dt; k.y += k.vy * dt;
    k.z += k.vz * dt; k.vz -= GRAVITY * dt;
    if (k.z <= 0) { k.z = 0; k.vz = 0; const f = Math.exp(-3 * dt); k.vx *= f; k.vy *= f; }
    k.a += k.spin * dt; k.spin *= Math.exp(-2 * dt);
    if (Math.abs(k.vx) < 2 && Math.abs(k.vy) < 2 && k.z === 0) { k.vx = 0; k.vy = 0; }
    k.x = Math.max(5, Math.min(WORLD.w - 5, k.x)); k.y = Math.max(5, Math.min(WORLD.h - 5, k.y));
  }
}

function knock(car, dx, dy, ev, kind) {
  if (car.spinT > 0 || car.air) return false;
  car.spinT = 1.0;
  car.spinDir = Math.random() < 0.5 ? -1 : 1;
  if (kind === 'rocket') {
    const d = Math.hypot(dx, dy) || 1;
    // shove sideways to the shot, so the car goes off the track
    let nx = -dy / d, ny = dx / d;
    if (Math.random() < 0.5) { nx = -nx; ny = -ny; }
    car.vx = car.vx * 0.4 + nx * 380 + (dx / d) * 120;
    car.vy = car.vy * 0.4 + ny * 380 + (dy / d) * 120;
  } else {
    car.vx *= 0.5; car.vy *= 0.5;
  }
  ev.push({ type: 'hit', id: car.id, kind });
  return true;
}

function useItem(car, race, ev) {
  const fx = Math.cos(car.a), fy = Math.sin(car.a);
  const id = `${car.id}:${race.nextId++}`;
  if (car.item === 'rocket') {
    race.shots.push({ id, owner: car.id, x: car.x + fx * 28, y: car.y + fy * 28, vx: fx * (SHOT_SPEED + Math.max(0, car.speed * 0.5)), vy: fy * (SHOT_SPEED + Math.max(0, car.speed * 0.5)), life: 2.6 });
  } else if (car.item === 'banana') {
    race.bananas.push({ id, owner: car.id, x: car.x - fx * 32, y: car.y - fy * 32, a: car.a, life: 60 });
  } else if (car.item === 'turbo') {
    car.boostT = 1.5;
    ev.push({ type: 'boost', id: car.id });
  }
  ev.push({ type: 'use', id: car.id, item: car.item });
  car.item = null;
}

function updateItems(race, dt, inputs, ev) {
  // pick up boxes
  for (const b of race.boxes) {
    if (b.cool > 0) { b.cool -= dt; continue; }
    for (const c of race.cars) {
      if (c.air || Math.hypot(c.x - b.x, c.y - b.y) > 27) continue;
      b.cool = BOX_RESPAWN;
      if (!c.remote && !c.item && !c.finished) {
        c.item = PICKUPS[Math.floor(Math.random() * PICKUPS.length)];
        c.rollT = ROLL_TIME;
        ev.push({ type: 'pickup', id: c.id });
      }
      break;
    }
  }
  // use items (press fire)
  for (const c of race.cars) {
    if (c.remote) continue;
    if (c.rollT > 0) c.rollT -= dt;
    const fire = race.phase === 'racing' && !!(inputs[c.id] && inputs[c.id].fire);
    if (fire && !c.firePrev && c.item && c.rollT <= 0 && c.spinT <= 0) useItem(c, race, ev);
    c.firePrev = fire;
  }
  // rockets: home in on the nearest car in front
  for (let i = race.shots.length - 1; i >= 0; i--) {
    const s = race.shots[i];
    s.life -= dt;
    let target = null, best = 520;
    for (const c of race.cars) {
      if (c.id === s.owner || c.air || c.finished) continue;
      const dx = c.x - s.x, dy = c.y - s.y, d = Math.hypot(dx, dy);
      const sp = Math.hypot(s.vx, s.vy);
      if (d < best && (dx * s.vx + dy * s.vy) / (d * sp || 1) > 0.3) { best = d; target = c; }
    }
    if (target) {
      const want = Math.atan2(target.y - s.y, target.x - s.x), cur = Math.atan2(s.vy, s.vx);
      const turn = Math.max(-4 * dt, Math.min(4 * dt, Math.atan2(Math.sin(want - cur), Math.cos(want - cur))));
      const sp = Math.hypot(s.vx, s.vy);
      s.vx = Math.cos(cur + turn) * sp; s.vy = Math.sin(cur + turn) * sp;
    }
    s.x += s.vx * dt; s.y += s.vy * dt;
    let gone = s.life <= 0 || s.x < 0 || s.y < 0 || s.x > WORLD.w || s.y > WORLD.h;
    for (const c of race.cars) {
      if (gone || c.id === s.owner || c.air || Math.hypot(c.x - s.x, c.y - s.y) > HIT_R) continue;
      if (!c.remote) knock(c, s.vx, s.vy, ev, 'rocket');
      gone = true; // a friend's device does the knock for their own car
    }
    for (const o of race.solids) if (!gone && Math.hypot(o.x - s.x, o.y - s.y) < 22) gone = true;
    if (gone) { race.shots.splice(i, 1); ev.push({ type: 'pop', x: s.x, y: s.y }); }
  }
  // bananas
  for (let i = race.bananas.length - 1; i >= 0; i--) {
    const bn = race.bananas[i];
    bn.life -= dt;
    let gone = bn.life <= 0;
    for (const c of race.cars) {
      if (gone || c.air || Math.hypot(c.x - bn.x, c.y - bn.y) > 20) continue;
      if (c.id === bn.owner && bn.life > 59.4) continue; // just dropped it
      if (!c.remote) knock(c, 0, 0, ev, 'banana');
      gone = true;
    }
    if (gone) race.bananas.splice(i, 1);
  }
  // friends' rockets and bananas (from the network) hitting our cars
  for (const list of [race.remoteShots, race.remoteBananas]) {
    for (const o of list) {
      if (race.hitIds.has(o.id)) continue;
      for (const c of race.cars) {
        if (c.remote || c.air || Math.hypot(c.x - o.x, c.y - o.y) > HIT_R) continue;
        if (knock(c, o.vx || 0, o.vy || 0, ev, list === race.remoteShots ? 'rocket' : 'banana')) race.hitIds.add(o.id);
      }
    }
  }
}

// A lap counts when you cross the line going forwards, after visiting
// the other three quarters of the track. Going off the track for a bit
// doesn't matter, and it counts the moment you cross the line.
function lapCheck(car, track, prevIdx, race, ev) {
  const n = track.n;
  if (car.near) car.seen |= 1 << Math.min(3, Math.floor((car.idx * 4) / n));
  if (prevIdx > n * 0.75 && car.idx < n * 0.25) {
    if (!car.started) { car.started = true; car.seen = 1; }
    else if ((car.seen & 0b1110) === 0b1110 && !car.finished) {
      car.lapsDone++;
      car.seen = 1;
      if (car.lapsDone >= LAPS) {
        car.finished = true;
        car.finishT = race.t - race.goT;
        race.finishOrder.push(car.id);
        car.place = race.finishOrder.length;
        ev.push({ type: 'finish', id: car.id, place: car.place });
      } else {
        car.lap = car.lapsDone + 1;
        ev.push({ type: 'lap', id: car.id, lap: car.lap });
      }
    }
  }
  // how far round you are, for who's in front
  car.prog = car.started ? car.lapsDone * n + car.idx : car.idx - n;
}

function collide(cars, ev) {
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i], b = cars[j];
      if (a.air || b.air || a.up !== b.up) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d === 0 || d > CAR_R * 2) continue;
      const nx = dx / d, ny = dy / d;
      if (a.remote && b.remote) continue; // the other devices handle that
      // online cars are moved by their owner, so only push our own car
      const wa = a.remote ? 0 : b.remote ? 1 : 0.5, wb = 1 - wa;
      const push = CAR_R * 2 - d;
      a.x -= nx * push * wa; a.y -= ny * push * wa;
      b.x += nx * push * wb; b.y += ny * push * wb;
      const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (rel < 0) {
        const k = -rel * 0.8;
        a.vx -= nx * k * wa; a.vy -= ny * k * wa;
        b.vx += nx * k * wb; b.vy += ny * k * wb;
        if (-rel > 80) ev.push({ type: 'bump' });
      }
    }
  }
}

export function stepRace(race, track, items, inputs, dt) {
  const ev = (race.events = []);
  const n = track.n;

  if (race.phase === 'countdown') {
    const before = Math.ceil(race.countdown);
    race.countdown -= dt;
    const after = Math.ceil(race.countdown);
    if (after !== before && after > 0) ev.push({ type: 'beep' });
    if (race.countdown <= 0) { race.phase = 'racing'; race.goT = race.t; ev.push({ type: 'go' }); }
  }

  if (race.itemsRef !== items) {
    race.itemsRef = items;
    race.solids = items.filter(i => SOLIDS[i.type]);
    if (!race.boxes) race.boxes = boxesFromItems(items);
    if (!race.cones) race.cones = items.filter(i => i.type === 'cone').map(i => ({ x: i.x, y: i.y, a: 0, vx: 0, vy: 0, z: 0, vz: 0, spin: 0, down: false }));
  }

  for (const car of race.cars) {
    if (car.remote) continue; // position comes from the network
    const live = race.phase === 'racing' && !car.finished;
    const prevIdx = car.idx;
    updateCar(car, live ? (inputs[car.id] || {}) : {}, track, items, dt, ev);
    hitSolids(car, race.solids, ev);
    lapCheck(car, track, prevIdx, race, ev);
  }
  collide(race.cars, ev);
  updateCones(race, dt, ev);
  updateItems(race, dt, inputs, ev);

  if (race.phase === 'racing' && race.cars.some(c => c.finished)) {
    race.endTimer -= dt;
    if (race.cars.every(c => c.finished) || race.endTimer <= 0) {
      race.phase = 'done';
      ev.push({ type: 'done' });
    }
  }
  race.t += dt;
}

// lap progress 0..LAPS for the HUD
export function lapsDone(car) {
  return Math.max(0, Math.min(LAPS, car.lapsDone || 0));
}

// finishing order (by finish time, works online too), then everyone else by how far they got
export function standings(race) {
  const done = race.cars.filter(c => c.finished).sort((a, b) => (a.finishT ?? 1e9) - (b.finishT ?? 1e9));
  const rest = race.cars.filter(c => !c.finished).sort((a, b) => b.prog - a.prog);
  return [...done, ...rest];
}
