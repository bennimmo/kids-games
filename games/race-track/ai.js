// The computer car. Follows the track, slows for bends, steers round
// tyre walls and trees, and uses items. It eases off when it is ahead
// so small children can still win.
import { SOLIDS, nearestGlobal } from './track.js';

export function aiInput(car, race, track, dt) {
  const n = track.n, pts = track.pts;
  const out = { up: false, down: false, left: false, right: false, fire: false };
  if (race.phase !== 'racing' || car.finished) return out;

  let idx = car.idx;
  if (!car.near) idx = nearestGlobal(track, car.x, car.y).i; // lost: head back to the nearest bit of track

  // aim at a point further ahead the faster we go
  const look = 5 + Math.round(car.speed / 50);
  const p = pts[(idx + look) % n];
  const lane = Math.sin(race.t * 0.3 + 1.7) * 12; // drift around the track a little, not a perfect line
  let tx = p.x - Math.sin(p.a) * lane, ty = p.y + Math.cos(p.a) * lane;

  // steer round solid things near where we're heading
  for (const o of race.solids || []) {
    const S = SOLIDS[o.type];
    const R = (S.r || Math.max(...S.box)) + 30;
    const d = Math.hypot(o.x - tx, o.y - ty);
    if (d < R) {
      const side = Math.sign((tx - o.x) * -Math.sin(p.a) + (ty - o.y) * Math.cos(p.a)) || 1;
      tx += -Math.sin(p.a) * side * (R - d);
      ty += Math.cos(p.a) * side * (R - d);
    }
  }
  for (const bn of [...race.bananas, ...race.remoteBananas]) { // dodge bananas
    if (Math.hypot(bn.x - tx, bn.y - ty) < 30) { tx += -Math.sin(p.a) * 30; ty += Math.cos(p.a) * 30; }
  }

  let da = Math.atan2(ty - car.y, tx - car.x) - car.a;
  da = Math.atan2(Math.sin(da), Math.cos(da));
  out.left = da < -0.06;
  out.right = da > 0.06;

  // how bendy is the track ahead?
  let bend = 0;
  for (let k = 0; k < 14; k++) {
    const a = pts[(idx + k) % n].a, b = pts[(idx + k + 1) % n].a;
    bend += Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));
  }
  let target = Math.max(150, Math.min(330, 330 - bend * 160));

  // ease off when ahead of the children, push when behind
  const humans = race.cars.filter(c => !c.cpu);
  if (humans.length) {
    const lead = car.prog - Math.max(...humans.map(c => c.prog));
    if (lead > n * 0.08) target *= 0.72;
    else if (lead > 0) target *= 0.9;
    else if (lead < -n * 0.25) target *= 1.08;
  }
  if (Math.abs(da) > 1.2) target = Math.min(target, 120);
  out.up = car.speed < target;
  out.down = car.speed > target + 70;

  // stuck against something? back up for a moment
  car.aiStuck = car.speed < 25 ? (car.aiStuck || 0) + dt : 0;
  if (car.aiStuck > 1.2) car.aiBack = 0.8;
  if (car.aiBack > 0) {
    car.aiBack -= dt;
    return { up: false, down: true, left: da > 0, right: da < 0, fire: false };
  }

  // items
  if (car.item && car.rollT <= 0) {
    car.aiWait = (car.aiWait || 0) + dt;
    const fx = Math.cos(car.a), fy = Math.sin(car.a);
    const others = race.cars.filter(c => c !== car && !c.finished);
    if (car.item === 'rocket') {
      out.fire = others.some(c => {
        const dx = c.x - car.x, dy = c.y - car.y, d = Math.hypot(dx, dy);
        return d < 420 && (dx * fx + dy * fy) / (d || 1) > 0.7;
      }) && car.aiWait > 0.6;
    } else if (car.item === 'banana') {
      out.fire = others.some(c => {
        const dx = c.x - car.x, dy = c.y - car.y, d = Math.hypot(dx, dy);
        return d < 200 && (dx * fx + dy * fy) / (d || 1) < -0.5;
      }) || car.aiWait > 6;
    } else if (car.item === 'turbo') {
      out.fire = bend < 0.25 || car.aiWait > 4;
    }
    if (out.fire) car.aiWait = 0;
  }
  return out;
}
