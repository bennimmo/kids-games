// Race simulation. Pure data in, pure data out:
//   stepRace(race, track, items, inputs, dt)
// inputs = { [playerId]: { up, down, left, right } }
// Inputs can come from the keyboard now, or from a friend online later.
import { WORLD, TRACK_W, JUMP_L, WATER_RX, WATER_RY, nearestLocal, nearestGlobal } from './track.js';

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
      vx: 0, vy: 0, idx: i, prog: -back, lap: 1,
      z: 0, vz: 0, air: false, jumpCool: 0,
      onTrack: true, up: !!track.bridge[i], inWater: false,
      skid: 0, speed: 0, finished: false, place: 0,
    };
  });
  return { t: 0, phase: 'countdown', countdown: 3, goT: -1, cars, finishOrder: [], endTimer: 12, events: [] };
}

function local(it, car) {
  const dx = car.x - it.x, dy = car.y - it.y;
  const c = Math.cos(it.a), s = Math.sin(it.a);
  return [dx * c + dy * s, -dx * s + dy * c];
}
const sameLayer = (it, car) => (it.idx < 0 ? !car.up : it.up === car.up);

function locate(car, track) {
  const n = track.n;
  let { i, d } = nearestLocal(track, car.x, car.y, car.idx);
  if (d > TRACK_W * 1.2) {
    const g = nearestGlobal(track, car.x, car.y);
    if (g.d < TRACK_W * 0.6) { i = g.i; d = g.d; }
    else { car.onTrack = false; car.up = false; return; }
  }
  let delta = i - car.idx;
  if (delta > n / 2) delta -= n;
  if (delta < -n / 2) delta += n;
  if (Math.abs(delta) <= 30) car.prog += delta; // no credit for big shortcuts
  car.idx = i;
  car.onTrack = d <= TRACK_W / 2 + 4;
  car.up = car.onTrack && !!track.bridge[i];
}

function updateCar(car, input, track, items, dt, ev) {
  const fx = Math.cos(car.a), fy = Math.sin(car.a);
  const rx = -fy, ry = fx;
  let vF = car.vx * fx + car.vy * fy;
  let vR = car.vx * rx + car.vy * ry;

  if (!car.air) locate(car, track);

  // what are we driving on?
  let grip = 6.5, drag = 0.45, maxF = MAX;
  let water = false, ramp = false;
  if (!car.air) {
    for (const it of items) {
      if (!sameLayer(it, car)) continue;
      const [lx, ly] = local(it, car);
      if (it.type === 'water' && (lx / WATER_RX) ** 2 + (ly / WATER_RY) ** 2 < 1) water = true;
      if (it.type === 'jump' && Math.abs(lx) < JUMP_L / 2 && Math.abs(ly) < TRACK_W / 2 + 3) ramp = true;
    }
    if (!car.onTrack) { maxF = OFF_MAX; drag = 1.2; grip = 5; }
    if (water) { maxF = Math.min(maxF, WATER_MAX); grip = 2; drag = 1.0; }
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

function collide(cars, ev) {
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i], b = cars[j];
      if (a.air || b.air || a.up !== b.up) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d === 0 || d > CAR_R * 2) continue;
      const nx = dx / d, ny = dy / d;
      const push = (CAR_R * 2 - d) / 2;
      a.x -= nx * push; a.y -= ny * push;
      b.x += nx * push; b.y += ny * push;
      const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (rel < 0) {
        const k = -rel * 0.8;
        a.vx -= nx * k / 2 * 1; a.vy -= ny * k / 2;
        b.vx += nx * k / 2; b.vy += ny * k / 2;
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

  for (const car of race.cars) {
    const live = race.phase === 'racing' && !car.finished;
    updateCar(car, live ? (inputs[car.id] || {}) : {}, track, items, dt, ev);

    const lap = Math.floor(car.prog / n) + 1;
    if (!car.finished && lap > car.lap) {
      car.lap = lap;
      if (car.prog >= LAPS * n) {
        car.finished = true;
        race.finishOrder.push(car.id);
        car.place = race.finishOrder.length;
        ev.push({ type: 'finish', id: car.id, place: car.place });
      } else {
        ev.push({ type: 'lap', id: car.id, lap });
      }
    }
  }
  collide(race.cars, ev);

  if (race.phase === 'racing' && race.finishOrder.length) {
    race.endTimer -= dt;
    if (race.cars.every(c => c.finished) || race.endTimer <= 0) {
      race.phase = 'done';
      ev.push({ type: 'done' });
    }
  }
  race.t += dt;
}

// lap progress 0..LAPS for the HUD
export function lapsDone(car, track) {
  return Math.max(0, Math.min(LAPS, Math.floor(car.prog / track.n)));
}

// finishing order, then everyone else by how far they got
export function standings(race) {
  const done = race.finishOrder.map(id => race.cars.find(c => c.id === id));
  const rest = race.cars.filter(c => !c.finished).sort((a, b) => b.prog - a.prog);
  return [...done, ...rest];
}
