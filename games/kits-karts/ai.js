// Robot racers. Follow the road, slow for bends, dodge bananas, use items.
// Levels: 0 🐢 easy, 1 🐇 medium, 2 🚀 hard. They ease off when far ahead of the children.
import { SOLIDS } from '../race-track/track.js';
import { TRACK_W, locate } from './course.js';

const LEVEL = [
  { top: 0.8, look: 1.0, aim: 0.6 },
  { top: 0.92, look: 1.0, aim: 0.8 },
  { top: 1.02, look: 1.1, aim: 1 },
];

export function aiInput(car, race) {
  const c = race.course, n = c.n, pts = c.pts;
  const out = { up: false, down: false, left: false, right: false, fire: false };
  if (race.phase === 'countdown') return out;
  const lv = LEVEL[car.level] || LEVEL[1];
  if (car.lane === undefined) car.lane = ((car.slot * 37) % 5 - 2) * 9;

  let idx = car.idx;
  const L = locate(c, car.x, car.y, idx);
  const look = Math.round((5 + car.speed / 55) * lv.look);
  const p = pts[(idx + look) % n];
  const lane = car.lane + Math.sin(race.t * 0.25 + car.slot * 2) * 10;
  let tx = p.x - Math.sin(p.a) * lane, ty = p.y + Math.cos(p.a) * lane;
  // way off the road: head straight back
  if (L.d > TRACK_W) { const q = pts[(idx + 3) % n]; tx = q.x; ty = q.y; }

  for (const o of race.solids) {
    const S = SOLIDS[o.type];
    const R = (S.r || Math.max(...S.box)) + 26;
    const d = Math.hypot(o.x - tx, o.y - ty);
    if (d < R) {
      const side = Math.sign((tx - o.x) * -Math.sin(p.a) + (ty - o.y) * Math.cos(p.a)) || 1;
      tx += -Math.sin(p.a) * side * (R - d); ty += Math.cos(p.a) * side * (R - d);
    }
  }
  if (car.level > 0) for (const o of race.objs) {
    if (o.kind !== 'banana' && o.kind !== 'oil') continue;
    if (Math.hypot(o.x - tx, o.y - ty) < 34) { tx += -Math.sin(p.a) * 34; ty += Math.cos(p.a) * 34; }
  }

  let da = Math.atan2(ty - car.y, tx - car.x) - car.a;
  da = Math.atan2(Math.sin(da), Math.cos(da));
  out.left = da < -0.05;
  out.right = da > 0.05;

  let bend = 0;
  for (let k = 0; k < 14; k++) {
    const a = pts[(idx + k) % n].a, b = pts[(idx + k + 1) % n].a;
    bend += Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));
  }
  let target = Math.max(170, car.p.max - bend * 150) * lv.top;
  if (c.jumpOf[idx] >= 0 || c.jumpOf[(idx + 8) % n] >= 0) target = Math.max(target, 300); // go for the jumps

  const humans = race.cars.filter(x => !x.cpu && !x.finished);
  if (humans.length && !car.finished) {
    const lead = car.dist - Math.max(...humans.map(x => x.dist));
    if (lead > n * 0.12) target *= 0.7;
    else if (lead > n * 0.04) target *= 0.88;
    else if (lead < -n * 0.2) target *= 1.08;
  }
  if (car.finished) target *= 0.6;
  if (Math.abs(da) > 1.1) target = Math.min(target, 130);
  out.up = car.vF < target;
  out.down = car.vF > target + 80;

  car.aiStuck = car.speed < 25 && race.phase === 'racing' ? (car.aiStuck || 0) + 1 / 60 : 0;
  if (car.aiStuck > 1.2) { car.aiBack = 0.8; car.aiStuck = 0; }
  if (car.aiBack > 0) {
    car.aiBack -= 1 / 60;
    return { up: false, down: true, left: da > 0, right: da < 0, fire: false };
  }

  if (car.item && car.rollT <= 0 && !car.finished) {
    car.aiWait = (car.aiWait || 0) + 1 / 60;
    const fx = Math.cos(car.a), fy = Math.sin(car.a);
    const others = race.cars.filter(o => o !== car && !o.finished);
    const ahead = d => others.some(o => { const dx = o.x - car.x, dy = o.y - car.y, dd = Math.hypot(dx, dy); return dd < d && (dx * fx + dy * fy) / (dd || 1) > 0.75; });
    const behind = d => others.some(o => { const dx = o.x - car.x, dy = o.y - car.y, dd = Math.hypot(dx, dy); return dd < d && (dx * fx + dy * fy) / (dd || 1) < -0.5; });
    const it = car.item;
    let fire = false;
    if (it === 'rocket' || it === 'zap') fire = car.aiWait > 1.2;
    else if (it === 'ball' || it === 'bomb') fire = ahead(380) && car.aiWait > 0.6 || car.aiWait > 8;
    else if (it === 'banana' || it === 'triple' || it === 'oil') fire = behind(220) || car.aiWait > 5;
    else if (it === 'turbo' || it === 'turbo3') fire = bend < 0.3 || car.aiWait > 3;
    else if (it === 'star') fire = car.aiWait > 0.8;
    else if (it === 'shield') fire = car.aiWait > 2;
    if (car.level === 0 && Math.random() < 0.5) fire = fire && car.aiWait > 3;
    // tap, don't hold
    out.fire = fire && !car.firePrev;
    if (out.fire) car.aiWait = 0;
  }
  return out;
}
