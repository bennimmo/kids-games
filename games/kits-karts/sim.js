// Kits Karts race simulation. Plain data, no drawing.
//   stepRace(race, inputs, dt)   inputs = { [carId]: { up, down, left, right, fire } }
// The world is 2D (x, y from the track designer) plus a height z.
import { WORLD, SOLIDS, JUMP_L, WATER_RX, WATER_RY, BOOST_L } from '../race-track/track.js';
import { TRACK_W, RAIL_H, LAND_H, BARRIER, locate, elevAt } from './course.js';
import { statsOf } from './karts.js';

export const LAPS = 3;
const GRAV = 900;
const CAR_R = 11;
export const CONE_R = 7;
const BOX_RESPAWN = 3;
const ROLL_TIME = 1.0;
const MAX_LAST = 25;        // seconds the others get after the first finish

export const ITEMS = {
  banana: '🍌', triple: '🍌', rocket: '🚀', ball: '🟢', turbo: '🍄', turbo3: '🍄', shield: '🛡️', star: '⭐', bomb: '💣', oil: '🛢️', zap: '⚡',
};
export const ITEM_LIST = Object.keys(ITEMS);
const ITEM_USES = { triple: 3, turbo3: 3 };
// which items you get depends on your place (front .. back)
const TABLE = [
  ['banana', 'banana', 'oil', 'ball', 'shield', 'turbo', 'bomb', 'triple'],
  ['ball', 'rocket', 'turbo', 'triple', 'bomb', 'shield', 'oil', 'banana'],
  ['rocket', 'rocket', 'turbo3', 'star', 'zap', 'ball', 'bomb', 'turbo'],
  ['rocket', 'turbo3', 'star', 'star', 'zap', 'turbo3', 'rocket', 'bomb'],
];

// Each 'box' extra = a row of 4 mystery boxes across the road.
function boxRow(course, it, k) {
  const out = [];
  const z = it.idx >= 0 ? course.elev[it.idx] : 0;
  for (const o of [-30, -10, 10, 30]) out.push({ id: `b${k}_${o}`, x: it.x - Math.sin(it.a) * o, y: it.y + Math.cos(it.a) * o, z, cool: 0 });
  return out;
}

// safe flat spot near index i (not on a ramp or bridge)
export function flatIdx(course, i) {
  const { n } = course;
  for (let o = 0; o < n; o++) {
    for (const s of [1, -1]) {
      const j = ((i + o * s) % n + n) % n;
      if (course.jumpOf[j] < 0 && course.elev[j] === 0) return j;
    }
  }
  return i;
}

// No boxes placed? Put three rows on automatically.
export function withAutoBoxes(course, items) {
  if (items.some(i => i.type === 'box')) return items;
  const rows = [0.22, 0.5, 0.78].map(f => {
    const i = flatIdx(course, Math.floor(course.n * f));
    const p = course.pts[i];
    return { type: 'box', x: p.x, y: p.y, a: p.a, idx: i, auto: true };
  });
  return [...items, ...rows];
}
export function boxesOf(course, items) {
  return items.filter(i => i.type === 'box').flatMap((it, k) => boxRow(course, it, k));
}

function params(look, theme) {
  const [sp, ac, tu, we, of] = statsOf(look);
  return {
    max: 235 + sp * 14, acc: 190 + ac * 40, turn: 1.9 + tu * 0.18, mass: 0.7 + we * 0.2,
    off: Math.min(0.95, (theme.offroad || 0.5) * (0.7 + of * 0.12)), hover: look.body === 'hover',
  };
}

export function createRace(course, items, racers, theme) {
  const { n, pts } = course;
  const start = 0;
  const cars = racers.map((r, k) => {
    const back = 3 + Math.floor(k / 2) * 3;
    const i = ((start - back) % n + n) % n;
    const p = pts[i];
    const side = (k % 2 === 0 ? -1 : 1) * 18;
    return {
      id: r.id, name: r.name, look: r.look, cpu: !!r.cpu, level: r.level ?? 1, slot: k, p: params(r.look, theme),
      x: p.x - Math.sin(p.a) * side, y: p.y + Math.cos(p.a) * side, z: course.elev[i], vz: 0, a: p.a,
      vF: 0, vR: 0, vx: 0, vy: 0, speed: 0, air: false, ground: course.elev[i], slopeVz: 0,
      idx: i, dist: -back, lap: 0, finished: false, finishT: 0, place: k + 1,
      item: null, itemN: 0, rollT: 0, firePrev: false,
      spinT: 0, flipT: 0, boostT: 0, starT: 0, shieldT: 0, smallT: 0, rescueT: 0, safeT: 0,
      driftT: 0, driftDir: 0, drifting: false, trick: false, trickT: 0, assist: -1,
      onRoad: true, surface: 'road', skid: 0, steer: 0, hitCool: {},
    };
  });
  const all = withAutoBoxes(course, items);
  return {
    t: 0, phase: 'countdown', countdown: 3.5, beeped: 4, goT: -1, cars, events: [], laps: LAPS,
    course, items: all, theme, grav: GRAV * (theme.gravity || 1),
    boxes: boxesOf(course, all),
    cones: all.filter(i => i.type === 'cone').map(i => ({ x: i.x, y: i.y, z: 0, vx: 0, vy: 0, vz: 0, spin: 0, rot: 0, tip: 0, down: false })),
    solids: all.filter(i => SOLIDS[i.type]),
    pads: all.filter(i => ['boost', 'jump', 'mud', 'ice', 'water'].includes(i.type)).map(i => ({ ...i, z: i.idx >= 0 ? course.elev[i.idx] : 0 })),
    objs: [], nextId: 1, firstFinish: -1, doneT: -1, hitIds: new Set(), netFx: [],
  };
}

const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));

// ------------------------------------------------------------------ hits
function hitCar(race, car, kind, by) {
  if (car.remote || car.gone) return false; // friends' karts are looked after on their own device
  if (car.starT > 0 || car.rescueT > 0 || car.safeT > 0) return false;
  if (car.shieldT > 0) { car.shieldT = 0; race.events.push({ type: 'shield', id: car.id }); return true; }
  if (kind === 'flip') {
    car.flipT = 1.1; car.spinT = 0; car.air = true; car.vz = Math.max(car.vz, 260); car.vF *= 0.25;
  } else {
    car.spinT = kind === 'oil' ? 1.2 : 0.9; car.vF *= 0.45;
  }
  car.boostT = 0; car.drifting = false; car.driftT = 0;
  if (car.item && car.rollT > 0) { car.item = null; }
  race.events.push({ type: 'hit', id: car.id, kind, by });
  return true;
}

function rescue(race, car) {
  car.rescueT = 1.3;
  race.events.push({ type: 'rescue', id: car.id });
}
function placeOnTrack(race, car) {
  const c = race.course;
  const i = flatIdx(c, (car.idx + 4) % c.n);
  const p = c.pts[i];
  car.x = p.x; car.y = p.y; car.a = p.a; car.idx = i; car.z = 0; car.vz = 0; car.air = false;
  car.vF = 0; car.vR = 0; car.vx = car.vy = 0; car.spinT = 0; car.flipT = 0; car.safeT = 1.5; car.assist = -1;
}

// ------------------------------------------------------------------ items
function rollItem(race, car) {
  const humans = race.cars.length;
  const f = humans > 1 ? (car.place - 1) / (humans - 1) : 0.5;
  const row = TABLE[Math.min(3, Math.floor(f * 3.999))];
  car.item = row[Math.floor(Math.random() * row.length)];
  car.itemN = ITEM_USES[car.item] || 1;
  car.rollT = ROLL_TIME;
}

function carAhead(race, car) {
  let best = null, bd = Infinity;
  for (const c of race.cars) {
    if (c === car || c.finished) continue;
    const d = c.dist - car.dist;
    if (d > 0 && d < bd) { bd = d; best = c; }
  }
  return best;
}

function useItem(race, car) {
  const it = car.item;
  const fx = Math.cos(car.a), fy = Math.sin(car.a);
  const id = race.nextId++;
  const ev = { type: 'use', id: car.id, item: it };
  const behind = (d) => ({ x: car.x - fx * d, y: car.y - fy * d, z: car.ground });
  if (it === 'banana' || it === 'triple') race.objs.push({ id, kind: 'banana', ...behind(22), owner: car.id, life: 60 });
  if (it === 'oil') race.objs.push({ id, kind: 'oil', ...behind(30), owner: car.id, life: 18 });
  if (it === 'rocket') {
    const tgt = carAhead(race, car);
    race.objs.push({ id, kind: 'rocket', x: car.x + fx * 20, y: car.y + fy * 20, z: car.z + 6, a: car.a, sp: Math.max(560, car.speed + 200), owner: car.id, target: tgt ? tgt.id : null, life: 7, idx: car.idx });
  }
  if (it === 'ball') race.objs.push({ id, kind: 'ball', x: car.x + fx * 22, y: car.y + fy * 22, z: car.z, vx: fx * 540, vy: fy * 540, owner: car.id, life: 8, idx: car.idx, safe: 0.3 });
  if (it === 'bomb') race.objs.push({ id, kind: 'bomb', x: car.x + fx * 14, y: car.y + fy * 14, z: car.z + 12, vx: fx * (car.speed + 260), vy: fy * (car.speed + 260), vz: 260, owner: car.id, fuse: 1.6, idx: car.idx, landed: false });
  if (it === 'turbo' || it === 'turbo3') { car.boostT = 1.3; race.events.push({ type: 'boost', id: car.id }); }
  if (it === 'shield') car.shieldT = 12;
  if (it === 'star') { car.starT = 7; car.spinT = 0; car.smallT = 0; }
  if (it === 'zap') {
    zapAhead(race, car.dist, car.id);
    race.netFx.push({ id: car.id + ':' + id, type: 'zap', dist: car.dist, by: car.id });
  }
  race.events.push(ev);
  car.itemN--;
  if (car.itemN <= 0) car.item = null;
}

// zap every (local) kart ahead of 'dist'. Also used for a friend's zap online.
export function zapAhead(race, dist, byId) {
  for (const c of race.cars) {
    if (c.id === byId || c.remote || c.dist < dist || c.finished || c.starT > 0) continue;
    if (c.shieldT > 0) { c.shieldT = 0; race.events.push({ type: 'shield', id: c.id }); continue; }
    c.smallT = 4; c.spinT = 0.5; c.vF *= 0.5;
    race.events.push({ type: 'zapped', id: c.id });
  }
}
// a bomb going off (ours, or a friend's online)
export function boomAt(race, x, y, z, owner) {
  race.events.push({ type: 'boom', x, y, z });
  for (const c of race.cars) if (Math.hypot(c.x - x, c.y - y) < 80 && Math.abs(c.z - z) < 40) hitCar(race, c, 'flip', owner);
}

// ------------------------------------------------------------------ one car
function local(it, x, y) {
  const dx = x - it.x, dy = y - it.y;
  const c = Math.cos(it.a), s = Math.sin(it.a);
  return [dx * c + dy * s, -dx * s + dy * c];
}

function roadAt(course, x, y, idx) {
  const L = locate(course, x, y, idx);
  const gap = course.gap[L.i] || course.gap[(L.i + 1) % course.n];
  const onRoad = L.d <= TRACK_W / 2 + 2 && !gap;
  const z = onRoad ? elevAt(course, L.i, L.f) : 0;
  return { L, onRoad, z, gap: !!course.gap[L.i] };
}

function updateCar(race, car, input, dt) {
  const course = race.course, ev = race.events, P = car.p;
  if (car.rescueT > 0) {
    car.rescueT -= dt;
    if (car.rescueT <= 0) placeOnTrack(race, car);
    return;
  }
  car.safeT = Math.max(0, car.safeT - dt);
  car.starT = Math.max(0, car.starT - dt);
  car.shieldT = Math.max(0, car.shieldT - dt);
  car.smallT = Math.max(0, car.smallT - dt);
  if (car.rollT > 0) car.rollT -= dt;

  // ---- where are we?
  const prevIdx = car.idx;
  const here = roadAt(course, car.x, car.y, car.idx);
  car.idx = here.L.i;
  let dI = car.idx - prevIdx;
  if (dI > course.n / 2) dI -= course.n;
  if (dI < -course.n / 2) dI += course.n;
  if (Math.abs(dI) < 20) car.dist += dI;
  if (!car.air && here.L.d > TRACK_W * 2.2) {      // way off: find the nearest road
    const g = locate(course, car.x, car.y, car.idx, true);
    if (g.d < TRACK_W * 0.6 && Math.abs(elevAt(course, g.i, g.f) - car.z) < 6) car.idx = g.i;
  }
  car.onRoad = here.onRoad;

  // ---- what are we driving on?
  let maxF = P.max, drag = 0.35, grip = 10, turn = P.turn;
  let surface = here.onRoad ? 'road' : 'off';
  if (!here.onRoad && !car.air) { maxF *= P.off; drag = 1.0; grip = 5.5; }
  if (race.theme.slippy && here.onRoad) grip *= race.theme.slippy;
  let ramp = false, boost = false;
  if (!car.air) {
    for (const it of race.pads) {
      if (Math.abs(it.z - car.z) > 10) continue;
      const [lx, ly] = local(it, car.x, car.y);
      const blob = (lx / WATER_RX) ** 2 + (ly / WATER_RY) ** 2 < 1;
      if (it.type === 'mud' && blob && !P.hover) { maxF = Math.min(maxF, 120); drag = 1.8; grip = 3.5; surface = 'mud'; }
      if (it.type === 'water' && blob && !P.hover) { maxF = Math.min(maxF, 170); grip = 2.5; drag = 1; surface = 'water'; }
      if (it.type === 'ice' && blob) { grip = 0.7; drag = 0.12; surface = 'ice'; }
      if (it.type === 'jump' && Math.abs(lx) < JUMP_L / 2 && Math.abs(ly) < TRACK_W / 2 + 3) ramp = true;
      if (it.type === 'boost' && Math.abs(lx) < BOOST_L / 2 && Math.abs(ly) < TRACK_W / 2) boost = true;
    }
  }
  if (surface !== car.surface && (surface === 'mud' || surface === 'water') && car.speed > 60) ev.push({ type: surface, id: car.id });
  car.surface = surface;
  if (boost && !car.onBoost) { car.boostT = Math.max(car.boostT, 1.1); ev.push({ type: 'boost', id: car.id }); }
  car.onBoost = boost;

  if (car.smallT > 0) maxF *= 0.7;
  if (car.starT > 0) maxF *= 1.18;
  if (car.boostT > 0) {
    car.boostT -= dt;
    maxF = Math.max(maxF, P.max * 1.35);
    if (car.vF > 0) car.vF += 450 * dt;
  }

  // ---- controls
  let steer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
  let gas = !!input.up, brake = !!input.down;
  if (car.spinT > 0) {
    car.spinT -= dt;
    car.a += 12 * dt;
    grip = 1.2; steer = 0; gas = false; brake = false;
  }
  if (car.flipT > 0) { car.flipT -= dt; steer = 0; gas = false; }
  if (race.phase === 'countdown') { gas = false; steer = 0; brake = false; }
  // fire (on press)
  const fire = !!input.fire;
  if (fire && !car.firePrev && car.item && car.rollT <= 0 && race.phase === 'racing' && car.spinT <= 0 && car.flipT <= 0) useItem(race, car);
  car.firePrev = fire;

  if (car.air) {
    // flying: a little air control, tricks
    car.vz -= race.grav * dt;
    car.z += car.vz * dt;
    if (steer && !car.trick && car.trickT <= 0 && car.flipT <= 0 && car.vz > -120) { car.trick = true; car.trickT = 0.5; car.trickDir = steer; ev.push({ type: 'trick', id: car.id }); }
    car.a += steer * turn * 0.25 * dt;
    if (car.assist >= 0) { // crossing jump: aim for the landing
      const p = course.pts[(car.idx + 3) % course.n];
      car.a += wrapA(p.a - car.a) * Math.min(1, 4 * dt);
      const L = here.L;
      car.x -= L.nx * L.lat * Math.min(1, 3 * dt);
      car.y -= L.ny * L.lat * Math.min(1, 3 * dt);
    }
  } else {
    // drifting: hold ▼ while turning fast. Let go for a mini turbo.
    if (!car.drifting && brake && steer && car.vF > 170) { car.drifting = true; car.driftDir = steer; car.driftT = 0; ev.push({ type: 'hop', id: car.id }); }
    if (car.drifting) {
      if (!brake || car.vF < 110) {
        if (car.driftT > 0.7) { car.boostT = Math.max(car.boostT, car.driftT > 1.6 ? 1.0 : 0.55); ev.push({ type: 'miniturbo', id: car.id, big: car.driftT > 1.6 }); }
        car.drifting = false; car.driftT = 0;
      } else {
        car.driftT += dt;
        brake = false; gas = true;
        steer = car.driftDir * 0.75 + steer * 0.6;
        turn *= 1.2; grip = Math.min(grip, 3.2);
      }
    }
    if (gas) car.vF += P.acc * dt * (car.vF < maxF * 0.5 ? 1.2 : 1);
    if (brake) car.vF -= (car.vF > 10 ? 700 : 260) * dt;
    if (car.vF < -130) car.vF = -130;
    if (car.vF > maxF) car.vF = maxF + (car.vF - maxF) * Math.exp(-3 * dt);
    car.vF *= Math.exp(-drag * dt);
    if (!gas && !brake) car.vF *= Math.exp(-0.8 * dt);
    // steering eases in (no twitchy snaps) and is a bit gentler at top speed
    car.steerIn = (car.steerIn || 0) + Math.max(-dt * 6, Math.min(dt * 6, steer - (car.steerIn || 0)));
    const sf = Math.min(1, Math.abs(car.vF) / 80) * (1 - Math.min(0.25, Math.max(0, (Math.abs(car.vF) - 180) / 500)));
    car.a += car.steerIn * turn * sf * (car.vF < 0 ? -1 : 1) * dt;
    car.vR *= Math.exp(-grip * dt);
    if (car.drifting) car.vR += -car.driftDir * car.vF * 0.35 * dt * 3;
  }
  car.steer += ((steer || 0) - car.steer) * Math.min(1, 10 * dt);
  car.trickT = Math.max(0, car.trickT - dt);
  car.jumpCool = Math.max(0, (car.jumpCool || 0) - dt);

  // ---- move
  const fx = Math.cos(car.a), fy = Math.sin(car.a);
  car.vx = fx * car.vF - fy * car.vR;
  car.vy = fy * car.vF + fx * car.vR;
  const ox = car.x, oy = car.y;
  car.x += car.vx * dt;
  car.y += car.vy * dt;

  const now = roadAt(course, car.x, car.y, car.idx);
  // side rails on bridges and ramps
  {
    const L = now.L;
    const rz = elevAt(course, L.i, L.f);
    const lim = TRACK_W / 2 - 7;
    if (rz > RAIL_H * 0.5 && !now.gap && car.z > rz - 12 && L.d > lim && L.d < TRACK_W * 1.2) {
      const push = L.d - lim, s = Math.sign(L.lat);
      car.x -= L.nx * push * s; car.y -= L.ny * push * s;
      const vn = (car.vx * L.nx + car.vy * L.ny) * s;
      if (vn > 0) { car.vR *= -0.3; car.vF *= 0.97; if (vn > 80) ev.push({ type: 'rail', id: car.id }); }
    }
  }
  const after = roadAt(course, car.x, car.y, car.idx);
  const gz = after.z;
  if (!car.air) {
    if (gz - car.z > 6) { // a wall (side of a ramp or bridge): bounce back
      car.x = ox; car.y = oy; car.vF *= -0.3; car.vR *= -0.3;
      ev.push({ type: 'crash', id: car.id, wall: true, gz, z: car.z, i: after.L.i, d: after.L.d });
    } else if (gz < car.z - 3 || (ramp && car.vF > 80 && car.jumpCool <= 0)) {
      // launch!
      car.air = true;
      car.vz = Math.max(0, car.slopeVz);
      const L = after.L;
      const k = course.jumpOf[L.i];
      const cr = k >= 0 ? course.crossings[k] : null;
      if (cr && cr.mode === 'jump' && (after.gap || course.lip[L.i] || course.gap[(L.i + 1) % course.n])) {
        const v = Math.max(car.vF, 270);
        car.vF = v;
        const D = cr.half * 2 + 80;
        const T = D / v;
        car.vz = (LAND_H - car.z) / T + 0.5 * race.grav * T;
        car.assist = k;
        ev.push({ type: 'bigjump', id: car.id });
      } else if (ramp) {
        car.vz = 140 + car.vF * 0.5;
        ev.push({ type: 'jump', id: car.id });
      }
      car.trick = false;
    } else {
      car.slopeVz = (gz - car.z) / dt;
      car.z = gz;
    }
  }
  if (car.air) {
    if (car.z <= gz) {
      car.z = gz; car.air = false; car.slopeVz = 0; car.jumpCool = 0.4;
      const wasBig = car.assist >= 0;
      car.assist = -1;
      if (after.gap && after.L.d < TRACK_W / 2 + 10 && course.jumpOf[after.L.i] >= 0 && gz === 0 && course.elev[after.L.i] === 0 && course.crossings[course.jumpOf[after.L.i]].mode === 'jump') {
        rescue(race, car); // fell into the gap
      } else {
        ev.push({ type: 'land', id: car.id, big: wasBig || car.vz < -300 });
        if (car.trick && car.flipT <= 0) { car.boostT = Math.max(car.boostT, 0.9); ev.push({ type: 'trickboost', id: car.id }); }
        car.vz = 0;
      }
      car.trick = false;
    }
  }
  car.ground = gz;

  // barriers a little way off the road: you can go on the grass, but not get lost
  if (car.z < 15) {
    const lim = BARRIER - 11;
    let L = locate(course, car.x, car.y, car.idx);
    if (L.d > lim) L = locate(course, car.x, car.y, car.idx, true); // maybe near another bit of road
    if (L.d > lim) {
      const s = Math.sign(L.lat), push = L.d - lim;
      const nx = L.nx * s, ny = L.ny * s;
      car.x -= nx * push; car.y -= ny * push;
      const vn = car.vx * nx + car.vy * ny;
      if (vn > 0) {
        const vx = car.vx - 1.4 * vn * nx, vy = car.vy - 1.4 * vn * ny;
        const fx2 = Math.cos(car.a), fy2 = Math.sin(car.a);
        car.vF = (vx * fx2 + vy * fy2) * 0.9; car.vR = -vx * fy2 + vy * fx2;
        if (vn > 70) ev.push({ type: 'rail', id: car.id });
      }
    }
  }
  // keep inside the world
  const m = 18;
  if (car.x < m) { car.x = m; car.vF *= 0.5; }
  if (car.x > WORLD.w - m) { car.x = WORLD.w - m; car.vF *= 0.5; }
  if (car.y < m) { car.y = m; car.vF *= 0.5; }
  if (car.y > WORLD.h - m) { car.y = WORLD.h - m; car.vF *= 0.5; }

  car.speed = Math.hypot(car.vx, car.vy);
  car.skid = car.air ? 0 : Math.abs(car.vR);

  // laps
  if (!car.finished && car.dist >= (car.lap + 1) * course.n) {
    car.lap++;
    if (car.lap >= race.laps) {
      car.finished = true; car.finishT = race.t;
      if (race.firstFinish < 0) race.firstFinish = race.t;
      ev.push({ type: 'finish', id: car.id });
    } else ev.push({ type: 'lap', id: car.id, lap: car.lap });
  }
}

// bump into tyre walls, trees and grandstands
function hitSolids(race, car) {
  for (const o of race.solids) {
    if (car.z > (o.type === 'tyres' ? 12 : 60)) continue;
    const S = SOLIDS[o.type];
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
      if (d === 0) { ox = 0; oy = Math.sign(ly) || 1; d = 1; pen = hh - Math.abs(ly) + CAR_R; } else pen = CAR_R - d;
      const lnx = ox / d, lny = oy / d;
      nx = lnx * c - lny * s; ny = lnx * s + lny * c;
    }
    car.x += nx * pen; car.y += ny * pen;
    const fx = Math.cos(car.a), fy = Math.sin(car.a);
    const vn = car.vx * nx + car.vy * ny;
    if (vn < 0) {
      const vx = car.vx - 1.5 * vn * nx, vy = car.vy - 1.5 * vn * ny;
      car.vF = vx * fx + vy * fy; car.vR = -vx * fy + vy * fx;
      if (-vn > 70) race.events.push({ type: 'crash', id: car.id });
    }
  }
}

// karts bash into each other
function bashCars(race) {
  const cs = race.cars;
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j];
    if (a.rescueT > 0 || b.rescueT > 0 || a.gone || b.gone || (a.remote && b.remote)) continue;
    if (Math.abs(a.z - b.z) > 12) continue;
    const ra = CAR_R * (a.smallT > 0 ? 0.6 : 1), rb = CAR_R * (b.smallT > 0 ? 0.6 : 1);
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d >= ra + rb || d === 0) continue;
    const nx = dx / d, ny = dy / d, pen = ra + rb - d;
    let ma = a.p.mass * (a.smallT > 0 ? 0.4 : 1) * (a.starT > 0 ? 6 : 1);
    let mb = b.p.mass * (b.smallT > 0 ? 0.4 : 1) * (b.starT > 0 ? 6 : 1);
    const fa = a.remote ? 0 : b.remote ? 1 : mb / (ma + mb), fb = b.remote ? 0 : a.remote ? 1 : ma / (ma + mb);
    a.x -= nx * pen * fa; a.y -= ny * pen * fa;
    b.x += nx * pen * fb; b.y += ny * pen * fb;
    const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (rv >= 0) continue;
    const J = -(1 + 0.9) * rv / (1 / ma + 1 / mb) + 40; // a bit extra so bashes feel strong
    const push = (c, s, m) => {
      const vx = c.vx + s * J / m * nx, vy = c.vy + s * J / m * ny;
      const fx = Math.cos(c.a), fy = Math.sin(c.a);
      c.vF = vx * fx + vy * fy; c.vR = -vx * fy + vy * fx;
    };
    if (!a.remote) push(a, -1, ma);
    if (!b.remote) push(b, 1, mb);
    if (a.starT > 0 && b.starT <= 0) hitCar(race, b, 'flip', a.id);
    if (b.starT > 0 && a.starT <= 0) hitCar(race, a, 'flip', b.id);
    if (-rv > 60) race.events.push({ type: 'bash', id: a.id, id2: b.id, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2, hard: -rv > 200 });
    if (-rv > 220) { // big bash: the lighter one hops
      const light = ma < mb ? a : b;
      if (!light.air && !light.remote && light.starT <= 0) { light.air = true; light.vz = 120; }
    }
  }
}

function updateBoxes(race, dt) {
  for (const b of race.boxes) {
    if (b.cool > 0) { b.cool -= dt; continue; }
    for (const c of race.cars) {
      if (c.remote || c.gone || c.rescueT > 0 || Math.abs(c.z - b.z) > 16) continue;
      if (Math.hypot(c.x - b.x, c.y - b.y) < CAR_R + 9) {
        b.cool = BOX_RESPAWN;
        race.events.push({ type: 'box', id: c.id, x: b.x, y: b.y, z: b.z });
        if (!c.item) { rollItem(race, c); race.events.push({ type: 'pickup', id: c.id }); }
        break;
      }
    }
  }
}

function updateCones(race, dt) {
  for (const k of race.cones) {
    for (const c of race.cars) {
      if (c.z > 15) continue;
      const dx = k.x - c.x, dy = k.y - c.y, d = Math.hypot(dx, dy);
      if (d < CAR_R + CONE_R && c.speed > 10) {
        const nx = dx / (d || 1), ny = dy / (d || 1);
        k.vx = c.vx * 1.2 + nx * 60; k.vy = c.vy * 1.2 + ny * 60;
        k.vz = 120 + c.speed * 0.3; k.spin = (Math.random() - 0.5) * 20;
        if (!k.down) race.events.push({ type: 'cone', id: c.id });
        k.down = true;
      }
    }
    if (!k.vx && !k.vy && !k.vz) continue;
    k.x += k.vx * dt; k.y += k.vy * dt; k.z += k.vz * dt; k.vz -= race.grav * dt; k.rot += k.spin * dt;
    if (k.z <= 0) { k.z = 0; k.vz = Math.abs(k.vz) > 80 ? -k.vz * 0.3 : 0; k.vx *= 0.8; k.vy *= 0.8; k.spin *= 0.8; k.tip = 1; if (Math.hypot(k.vx, k.vy) < 5) k.vx = k.vy = 0; }
  }
}

function updateObjs(race, dt) {
  const course = race.course;
  const keep = [];
  for (const o of race.objs) {
    let dead = false;
    if (o.remote) { // a friend's item: it moves on their device, we only check if it hits our karts
      if (race.hitIds.has(o.id)) continue;
      const R = o.kind === 'oil' ? 24 : o.kind === 'banana' ? 13 : 16;
      for (const c of race.cars) {
        if (c.remote || c.rescueT > 0 || o.kind === 'bomb') continue;
        if (Math.abs(c.z - o.z) > 14 || Math.hypot(c.x - o.x, c.y - o.y) > R + CAR_R) continue;
        if (o.kind === 'oil') { if ((c.hitCool[o.id] || 0) > race.t) continue; c.hitCool[o.id] = race.t + 2; if (!c.air) hitCar(race, c, 'oil', o.owner); continue; }
        hitCar(race, c, o.kind === 'rocket' ? 'flip' : 'spin', o.owner);
        race.events.push({ type: 'pop', x: o.x, y: o.y, z: o.z, kind: o.kind });
        race.hitIds.add(o.id);
        dead = true;
        break;
      }
      if (!dead) keep.push(o);
      continue;
    }
    if (o.life !== undefined) { o.life -= dt; if (o.life <= 0) dead = true; }
    if (o.kind === 'rocket') {
      const tgt = race.cars.find(c => c.id === o.target);
      let aimX, aimY;
      if (tgt && !tgt.finished) { aimX = tgt.x; aimY = tgt.y; o.z += ((tgt.z + 6) - o.z) * Math.min(1, 4 * dt); }
      else { const p = course.pts[(o.idx + 6) % course.n]; aimX = p.x; aimY = p.y; }
      // follow the road until close, then go straight for the target
      const L = locate(course, o.x, o.y, o.idx); o.idx = L.i;
      if (tgt && Math.hypot(tgt.x - o.x, tgt.y - o.y) > 260) { const p = course.pts[(o.idx + 5) % course.n]; aimX = p.x; aimY = p.y; if (course.elev[o.idx] > 0) o.z += ((course.elev[o.idx] + 6) - o.z) * Math.min(1, 4 * dt); }
      o.a += Math.max(-6 * dt, Math.min(6 * dt, wrapA(Math.atan2(aimY - o.y, aimX - o.x) - o.a)));
      o.x += Math.cos(o.a) * o.sp * dt; o.y += Math.sin(o.a) * o.sp * dt;
    }
    if (o.kind === 'ball') {
      o.safe -= dt;
      o.x += o.vx * dt; o.y += o.vy * dt;
      const L = locate(course, o.x, o.y, o.idx); o.idx = L.i;
      o.z = L.d < TRACK_W / 2 + 2 && !course.gap[L.i] ? elevAt(course, L.i, L.f) : 0;
      if (o.x < 10 || o.x > WORLD.w - 10) { o.vx *= -1; race.events.push({ type: 'boing', x: o.x, y: o.y }); }
      if (o.y < 10 || o.y > WORLD.h - 10) { o.vy *= -1; race.events.push({ type: 'boing', x: o.x, y: o.y }); }
      for (const s of race.solids) {
        const S = SOLIDS[s.type];
        const r = (S.r || Math.max(...S.box)) + 8;
        const dx = o.x - s.x, dy = o.y - s.y, d = Math.hypot(dx, dy);
        if (d < r) { const nx = dx / d, ny = dy / d, vn = o.vx * nx + o.vy * ny; if (vn < 0) { o.vx -= 2 * vn * nx; o.vy -= 2 * vn * ny; } }
      }
    }
    if (o.kind === 'bomb') {
      if (!o.landed) {
        o.vz -= race.grav * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.z += o.vz * dt;
        const L = locate(course, o.x, o.y, o.idx); o.idx = L.i;
        const gz = L.d < TRACK_W / 2 + 2 && !course.gap[L.i] ? elevAt(course, L.i, L.f) : 0;
        if (o.z <= gz) { o.z = gz; o.landed = true; o.vx = o.vy = 0; }
      }
      o.fuse -= dt;
      if (o.fuse <= 0) {
        dead = true;
        boomAt(race, o.x, o.y, o.z, o.owner);
        race.netFx.push({ id: o.owner + ':' + o.id, type: 'boom', x: o.x, y: o.y, z: o.z, by: o.owner });
      }
    }
    // hit a kart?
    if (!dead && o.kind !== 'bomb') {
      const R = o.kind === 'oil' ? 24 : o.kind === 'banana' ? 13 : 16;
      for (const c of race.cars) {
        if (c.rescueT > 0 || c.remote || c.gone) continue;
        if ((o.kind === 'rocket' || o.kind === 'ball') && c.id === o.owner && (o.kind === 'rocket' || o.safe > 0)) continue;
        if (o.kind === 'rocket' && o.life > 6.6 && c.id === o.owner) continue;
        if (Math.abs(c.z - o.z) > 14) continue;
        if (Math.hypot(c.x - o.x, c.y - o.y) > R + CAR_R) continue;
        if (o.kind === 'oil') {
          if ((c.hitCool[o.id] || 0) > race.t) continue;
          c.hitCool[o.id] = race.t + 2;
          if (!c.air) hitCar(race, c, 'oil', o.owner);
          continue;
        }
        hitCar(race, c, o.kind === 'rocket' ? 'flip' : 'spin', o.owner);
        race.events.push({ type: 'pop', x: o.x, y: o.y, z: o.z, kind: o.kind });
        dead = true;
        break;
      }
    }
    // things hit each other (rocket/ball vs banana)
    if (!dead) keep.push(o); else if (o.kind === 'rocket' || o.kind === 'ball') race.events.push({ type: 'pop', x: o.x, y: o.y, z: o.z, kind: o.kind });
  }
  // rockets and balls knock out bananas
  const flying = keep.filter(o => o.kind === 'rocket' || o.kind === 'ball');
  const out = [];
  for (const o of keep) {
    if (o.kind === 'banana' && flying.some(f => Math.hypot(f.x - o.x, f.y - o.y) < 20)) { race.events.push({ type: 'pop', x: o.x, y: o.y, z: o.z, kind: 'banana' }); continue; }
    out.push(o);
  }
  race.objs = out;
}

export function standings(race) {
  return [...race.cars].sort((a, b) => {
    if (a.finished && b.finished) return a.finishT - b.finishT;
    if (a.finished !== b.finished) return a.finished ? -1 : 1;
    return b.dist - a.dist;
  });
}

export function stepRace(race, inputs, dt) {
  race.events = [];
  race.t += dt;
  if (race.phase === 'countdown') {
    race.countdown -= dt;
    const n = Math.ceil(race.countdown);
    if (n < race.beeped && n >= 1 && n <= 3) { race.beeped = n; race.events.push({ type: 'beep', n }); }
    if (race.countdown <= 0) { race.phase = 'racing'; race.goT = race.t; race.events.push({ type: 'go' }); }
  }
  for (const c of race.cars) if (!c.remote && !c.gone) updateCar(race, c, inputs[c.id] || {}, dt);
  bashCars(race);
  for (const c of race.cars) if (!c.remote) hitSolids(race, c);
  updateBoxes(race, dt);
  updateCones(race, dt);
  updateObjs(race, dt);
  standings(race).forEach((c, i) => { c.place = i + 1; });

  if (race.phase === 'racing') {
    const humans = race.cars.filter(c => !c.cpu && !c.gone);
    const allHumans = humans.length && humans.every(c => c.finished);
    const tooLong = race.firstFinish >= 0 && race.t - race.firstFinish > MAX_LAST;
    if (allHumans || tooLong || race.cars.every(c => c.finished)) {
      race.phase = 'done'; race.doneT = race.t;
      race.events.push({ type: 'done' });
    }
  }
}
