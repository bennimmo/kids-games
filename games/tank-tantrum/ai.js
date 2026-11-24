// Computer tanks. Tries lots of shots in its head and picks the closest,
// then wobbles it a bit (a lot on easy). Runs on one device; the shot it
// picks is sent like anyone else's, so trig is fine in here.
import { WATER_Y, DT } from './sim.js';

const FUN = ['chicken', 'cupcake', 'sock', 'mole', 'boot', 'firework', 'cloud', 'shrink', 'whoopee', 'magnet'];

// Where a plain shot from (x, y) with speed (vx, vy) would land.
function landing(world, sx, sy, vx, vy, grav, ownerI) {
  let x = sx, y = sy;
  for (let i = 0; i < 900; i++) {
    vy += world.g * grav * DT;
    vx += world.wind * 7 * DT;
    x += vx * DT; y += vy * DT;
    if (y > WATER_Y || x < -300 || x > world.W + 300) return { x, y, water: true };
    if (i > 20) {
      for (const t of world.tanks) {
        if (t.alive && t.i !== ownerI && Math.hypot(x - t.x, y - t.y + 12) < 18) return { x, y, tank: t };
      }
    }
    if (world.solidAt(x, y)) return { x, y };
  }
  return { x, y, water: true };
}

export function planShot(world, level) {
  const me = world.tanks[world.active];
  const foes = world.tanks.filter(t => t.alive && t !== me);
  if (!foes.length) return { skip: 1 };
  // Go for someone close and hurt.
  foes.sort((a, b) => (Math.abs(a.x - me.x) + a.hp * 6) - (Math.abs(b.x - me.x) + b.hp * 6));
  const target = level === 'easy' ? foes[Math.floor(Math.random() * foes.length)] : foes[0];

  let w = 'shell';
  const fun = FUN.filter(id => me.ammo[id] > 0);
  if (fun.length && Math.random() < (level === 'easy' ? 0.35 : 0.5)) w = fun[Math.floor(Math.random() * fun.length)];
  if (w === 'whoopee' && !(target.x < 250 || target.x > world.W - 250)) w = 'shell';
  if (w === 'magnet' && Math.abs(target.x - me.x) < 300) w = 'shell';
  if (me.hp < 35 && me.ammo.toilet > 0 && Math.random() < 0.3) {
    return { x: me.x, y: me.y, f: me.face, w: 'toilet', vx: 0, vy: 0, picked: [] };
  }
  const grav = w === 'shrink' ? 0.5 : 1;

  const dir = target.x >= me.x ? 1 : -1;
  const sx = me.x, sy = me.y - 20;
  let best = null;
  for (let deg = 10; deg <= 85; deg += 3) {
    const a = deg * Math.PI / 180;
    for (let p = 0.25; p <= 1.001; p += 0.04) {
      const vx = Math.cos(a) * dir * p * world.vmax, vy = -Math.sin(a) * p * world.vmax;
      const hit = landing(world, sx + Math.cos(a) * dir * 30, sy - Math.sin(a) * 30, vx, vy, grav, me.i);
      let score = Math.hypot(hit.x - target.x, hit.y - target.y);
      if (hit.tank === target) score -= 30;
      if (Math.hypot(hit.x - me.x, hit.y - me.y) < 60) score += 400; // don't blow yourself up
      if (hit.water) score += 200;
      if (!best || score < best.score) best = { score, a, p };
    }
  }
  const wob = level === 'easy' ? { a: 0.14, p: 0.12 } : { a: 0.06, p: 0.05 };
  const a = best.a + (Math.random() - 0.5) * 2 * wob.a;
  const p = Math.min(1, Math.max(0.15, best.p * (1 + (Math.random() - 0.5) * 2 * wob.p)));
  const r = n => Math.round(n * 100) / 100;
  return { x: me.x, y: me.y, f: dir, w, vx: r(Math.cos(a) * dir * p * world.vmax), vy: r(-Math.sin(a) * p * world.vmax), picked: [] };
}
