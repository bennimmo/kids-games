// Tank Tantrum world: terrain, tanks, weapons, turns. No DOM.
// Same seed + same shots = same game on every device, so online play only
// sends shots. To keep that true: fixed time step, our own random numbers,
// and no Math.sin/cos/atan2/pow in here (those can differ between browsers).
import { WEAPONS, WEAPON } from './weapons.js';

export const W = 2000, H = 1000, CELL = 2, COLS = W / CELL, ROWS = H / CELL;   // W, COLS = the smallest map
export const MAX_W = 4200;
// Map width for a number of tanks (a multiple of 200).
export const mapWidth = n => (n <= 3 ? 2000 : n === 4 ? 2600 : n === 5 ? 3000 : n === 6 ? 3400 : n === 7 ? 3800 : MAX_W);
export const WATER_Y = 940;
export const DT = 1 / 60;
export const MAX_SPEED = 800;
export const MAX_FUEL = 100;
export const DRIVE_SPEED = 70;      // world units a second
const FUEL_PER_UNIT = 0.4;          // 100 fuel = 250 units of driving
const WIND_K = 7;
const TANK_R = 18;
const MID = 12;
const MUZZLE_GRACE = 75;   // shots ignore the ground this close to the shooter  // tank middle is this far above its bottom

export const MAPS = {
  grass: { name: 'Grass', icon: '🌳', g: 300 },
  snow: { name: 'Snow', icon: '❄️', g: 300 },
  candy: { name: 'Candy', icon: '🍭', g: 300 },
  moon: { name: 'Moon', icon: '🌙', g: 130 },
};

const CUPCAKE_V = [[-251, -67], [-184, -184], [-67, -251], [67, -251], [184, -184], [251, -67]];
const SPARK_V = [[230, -60], [207, 40], [143, 120], [51, 164], [-51, 164], [-143, 120], [-207, 40], [-230, -60], [-207, -160], [-143, -240], [-51, -284], [51, -284], [143, -240], [207, -160]];
const CRATE_WEAPONS = WEAPONS.filter(w => w.id !== 'shell').map(w => w.id);

const len = (x, y) => Math.sqrt(x * x + y * y);

export class World {
  // opts: { seed, map, tanks: [ { name, color, hat, flag } ] }
  constructor(opts) {
    this.seed = (opts.seed >>> 0) || 1;
    this.W = mapWidth(opts.tanks.length);   // more tanks = wider map
    this.cols = this.W / CELL;
    this.artSeed = this.seed;   // for the pictures in the ground (looks only)
    this.map = MAPS[opts.map] ? opts.map : 'grass';
    this.windOn = !!opts.wind;   // off unless asked for
    this.g = MAPS[this.map].g;
    this.mask = new Uint8Array(this.cols * ROWS);
    this.projectiles = [];
    this.boots = [];
    this.crates = [];
    this.mines = [];
    this.events = [];
    this.dirty = [];
    this.turn = 0;
    this.wind = 0;
    this.phase = 'settle';
    this.quiet = 0;
    this.ticks = 0;
    this.nextId = 1;
    this.winner = -1;
    this.lastActive = -1;
    this.makeTerrain();
    const n = opts.tanks.length;
    this.tanks = [];
    opts.tanks.forEach((look, i) => this.tanks.push(this.makeTank(look, i, n)));
    this.active = (Math.floor(this.rand() * n) + n - 1) % n; // beginTurn moves on one
  }

  rand() {
    let t = (this.seed = (this.seed + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // ---------------------------------------------------------------- terrain
  makeTerrain() {
    const waterRow = WATER_Y / CELL;
    const step = 100, pts = [];
    for (let i = 0; i <= this.cols / step; i++) {
      let h = ROWS * 0.42 + this.rand() * ROWS * 0.34;
      if (i > 1 && i < this.cols / step - 1 && this.rand() < 0.15) h = waterRow + 20;   // a lake
      if (i === 0 || i === this.cols / step) h = waterRow + 30;                          // cliffs at the ends
      pts.push(h);
    }
    const bumps = [];
    for (let i = 0; i <= this.cols / 20; i++) bumps.push((this.rand() - 0.5) * 16);
    const heights = new Float64Array(this.cols);
    for (let c = 0; c < this.cols; c++) {
      const i = Math.floor(c / step), f = (c % step) / step;
      const s = f * f * (3 - 2 * f);
      const j = Math.floor(c / 20), g = (c % 20) / 20;
      const b = bumps[j] + (bumps[j + 1] - bumps[j]) * g;
      heights[c] = pts[i] + (pts[i + 1] - pts[i]) * s + b;
    }
    for (let c = 0; c < this.cols; c++) {
      const top = Math.floor(heights[c]);
      for (let r = Math.max(0, top); r < ROWS; r++) this.mask[r * this.cols + c] = 1;
    }
    const caves = 2 + Math.floor(this.rand() * 3);
    for (let k = 0; k < caves; k++) {
      const c = 100 + Math.floor(this.rand() * (this.cols - 200));
      const r = Math.floor(heights[c]) + 25 + Math.floor(this.rand() * 40);
      if (r < waterRow - 15) this.carveCells(c, r, 12 + Math.floor(this.rand() * 14));
    }
    this.dirty = [];
  }

  cellSolid(c, r) {
    if (c < 0 || c >= this.cols || r < 0) return false;
    if (r >= ROWS) return true;
    return this.mask[r * this.cols + c] !== 0;
  }
  solidAt(x, y) { return this.cellSolid(Math.floor(x / CELL), Math.floor(y / CELL)); }

  carveCells(cc, cr, rad) {
    const r2 = rad * rad;
    for (let r = Math.max(0, cr - rad); r <= Math.min(ROWS - 1, cr + rad); r++) {
      for (let c = Math.max(0, cc - rad); c <= Math.min(this.cols - 1, cc + rad); c++) {
        const dx = c - cc, dy = r - cr;
        if (dx * dx + dy * dy <= r2) this.mask[r * this.cols + c] = 0;
      }
    }
    this.dirty.push([cc - rad - 4, cr - rad - 4, cc + rad + 4, cr + rad + 4]);
  }
  carve(x, y, r) { this.carveCells(Math.floor(x / CELL), Math.floor(y / CELL), Math.round(r / CELL)); }

  // Top of the ground at x, near y (climb up to 8, step down up to 30). null = wall or cliff.
  groundAt(x, y, up = 8, down = 30) {
    const c = Math.floor(x / CELL);
    if (c < 0 || c >= this.cols) return null;
    const r0 = Math.floor((y - up) / CELL), r1 = Math.floor((y + down) / CELL);
    if (this.cellSolid(c, r0 - 1)) return null;
    for (let r = r0; r <= r1; r++) if (this.cellSolid(c, r)) return r * CELL;
    return null;
  }
  // Top of the ground at x, from the sky.
  skyGround(x) {
    const c = Math.floor(x / CELL);
    for (let r = 0; r < ROWS; r++) if (this.cellSolid(c, r)) return r * CELL;
    return H;
  }

  // ---------------------------------------------------------------- tanks
  makeTank(look, i, n) {
    const base = this.W * (i + 0.5) / n + (this.rand() - 0.5) * 120;
    const gap = Math.min(260, this.W / n * 0.6);
    const ok = (x, d) => x > 60 && x < this.W - 60 && this.skyGround(x) < WATER_Y - 40 && this.tanks.every(t => Math.abs(t.x - x) > d);
    let x = base;
    search: for (const d of [gap, gap / 2, 60, 0]) {
      for (let o = 0; o <= this.W; o += 20) {
        if (ok(base + o, d)) { x = base + o; break search; }
        if (ok(base - o, d)) { x = base - o; break search; }
      }
    }
    const ammo = {};
    for (const w of WEAPONS) ammo[w.id] = w.ammo;
    return {
      i, look, x, y: this.skyGround(x), vx: 0, vy: 0, ground: true, fallTop: 0,
      hp: 100, alive: true, face: x < this.W / 2 ? 1 : -1, aimX: x < this.W / 2 ? 1 : -1, aimY: -1,
      fuel: MAX_FUEL, ammo, cloud: 0, shrink: 0,
    };
  }
  tankR(t) { return t.shrink > 0 ? TANK_R / 2 : TANK_R; }
  living() { return this.tanks.filter(t => t.alive); }

  // Owner device only, while aiming. Others get the final spot in the shot.
  drive(dir, dt) {
    const t = this.tanks[this.active];
    if (this.phase !== 'aim' || !t || t.fuel <= 0 || !dir) return false;
    t.face = dir;
    const dx = dir * DRIVE_SPEED * dt * (t.shrink > 0 ? 0.6 : 1);
    const nx = t.x + dx;
    if (nx < 20 || nx > this.W - 20) return false;
    const ny = this.groundAt(nx, t.y);
    if (ny === null || ny >= WATER_Y - 6) return false;
    t.x = nx; t.y = ny;
    t.fuel = Math.max(0, t.fuel - Math.abs(dx) * FUEL_PER_UNIT);
    return true;
  }
  // Crates the driving tank is touching (owner device). Returns ids picked.
  pickupNear(t) {
    const got = [];
    for (const k of [...this.crates]) {
      if (len(k.x - t.x, k.y - t.y) < 28) { this.pickup(t, k); got.push(k.id); }
    }
    return got;
  }
  pickup(t, k) {
    this.crates = this.crates.filter(c => c !== k);
    if (k.kind === 'health') t.hp = Math.min(100, t.hp + 30);
    else if (t.ammo[k.w] !== -1) t.ammo[k.w] += 1;
    this.events.push({ type: 'pickup', x: k.x, y: k.y, kind: k.kind, w: k.w, tank: t.i });
  }

  // ---------------------------------------------------------------- turns
  beginTurn() {
    if (this.phase === 'over') return;
    const prev = this.tanks[this.active];
    if (prev && prev.shrink > 0) prev.shrink--;
    this.turn++;
    const n = this.tanks.length;
    for (let k = 1; k <= n; k++) {
      const t = this.tanks[(this.active + k) % n];
      if (t.alive) { this.active = t.i; break; }
    }
    const t = this.tanks[this.active];
    t.fuel = MAX_FUEL;
    const wind = Math.round(this.rand() * 20 - 10);
    this.wind = this.windOn ? wind : 0;
    if (t.cloud > 0) {
      t.cloud--;
      t.hp -= 10;
      this.events.push({ type: 'dmg', tank: t.i, amount: 10, x: t.x, y: t.y - 30 });
      this.events.push({ type: 'rain', tank: t.i });
    }
    if (this.rand() < 0.4) {
      const x = 100 + this.rand() * (this.W - 200);
      const gy = this.skyGround(x);
      const kind = this.rand() < 0.3 ? 'health' : 'weapon';
      const w = CRATE_WEAPONS[Math.floor(this.rand() * CRATE_WEAPONS.length)];
      if (gy < WATER_Y) {
        this.crates.push({ id: this.nextId++, x, y: Math.max(-100, gy - 320), kind, w, landed: false });
        this.events.push({ type: 'crate', x });
      }
    }
    for (const m of this.mines) {
      for (const o of this.tanks) {
        if (!o.alive) continue;
        const d = len(m.x - o.x, m.y - o.y);
        if (d < 260 && d > 20) {
          o.vx = (m.x > o.x ? 1 : -1) * Math.min(160, 40 + d * 0.6);
          o.vy = -140; o.ground = false; o.fallTop = o.y;
          this.events.push({ type: 'pull', x: m.x, y: m.y, tank: o.i });
        }
      }
    }
    this.phase = 'settle';
    this.quiet = 0;
  }

  // shot: { x, y, f, w, vx, vy, picked:[ids] } or { skip: 1 }
  applyShot(shot) {
    if (this.phase !== 'aim') return;
    const t = this.tanks[this.active];
    this.lastActive = t.i;
    this.phase = 'fly';
    this.quiet = 0;
    if (!shot || shot.skip) { this.events.push({ type: 'skip', tank: t.i }); return; }
    if (Number.isFinite(shot.x) && Number.isFinite(shot.y) && shot.x > 0 && shot.x < this.W && shot.y > 0 && shot.y < WATER_Y) {
      t.x = shot.x; t.y = shot.y;
    }
    t.face = shot.f < 0 ? -1 : 1;
    if (Array.isArray(shot.picked)) {
      for (const id of shot.picked) {
        const k = this.crates.find(c => c.id === id);
        if (k && len(k.x - t.x, k.y - t.y) < 400) this.pickup(t, k);
      }
    }
    let id = WEAPON[shot.w] ? shot.w : 'shell';
    if (t.ammo[id] === 0) id = 'shell';
    if (t.ammo[id] > 0) t.ammo[id]--;
    if (id === 'toilet') { this.flush(t); return; }

    let vx = Number(shot.vx) || 0, vy = Number(shot.vy) || 0;
    let sp = len(vx, vy);
    if (sp < 1) { vx = t.face * 100; vy = -100; sp = len(vx, vy); }
    if (sp > MAX_SPEED) { vx = vx / sp * MAX_SPEED; vy = vy / sp * MAX_SPEED; sp = MAX_SPEED; }
    t.aimX = vx / sp; t.aimY = vy / sp;
    const k = t.shrink > 0 ? 0.5 : 1;
    const p = {
      kind: id, x: t.x + t.aimX * 30 * k, y: t.y - 20 * k + t.aimY * 30 * k, vx, vy,
      age: 0, owner: t.i, mul: k, grav: 1, windK: 1, state: 'fly', bounces: 0,
    };
    if (id === 'boot') p.kind = 'flare';
    if (id === 'shrink') { p.grav = 0.5; }
    if (id === 'yoyo') { p.grav = 0; p.windK = 0; p.v0x = vx; p.v0y = vy; }
    // Muzzle grace: the shot passes through ground near the tank, so a bit of
    // hill sticking out in front of you doesn't blow you up.
    p.sx = t.x; p.sy = t.y - MID * k; p.grace = MUZZLE_GRACE * k;
    this.projectiles.push(p);
    this.events.push({ type: 'fire', tank: t.i, w: id, x: p.x, y: p.y });
  }

  flush(t) {
    const from = { x: t.x, y: t.y };
    for (let tries = 0; tries < 40; tries++) {
      const x = 80 + this.rand() * (this.W - 160);
      const y = this.skyGround(x);
      if (y >= WATER_Y - 30) continue;
      if (this.tanks.some(o => o !== t && o.alive && Math.abs(o.x - x) < 80)) continue;
      t.x = x; t.y = y; t.vx = 0; t.vy = 0; t.ground = true;
      break;
    }
    this.events.push({ type: 'flush', tank: t.i, x: from.x, y: from.y, x2: t.x, y2: t.y });
  }

  // ---------------------------------------------------------------- explosions
  explode(x, y, r, dmg, opts = {}) {
    if (opts.carve !== false) this.carve(x, y, r);
    const mul = opts.mul || 1;
    const push = opts.push ?? 260;
    for (const t of this.tanks) {
      if (!t.alive) continue;
      const dx = t.x - x, dy = (t.y - MID) - y;
      const d = len(dx, dy), R = r + 14;
      if (d >= R) continue;
      const f = 1 - d / R;
      if (dmg > 0) {
        const amount = Math.max(1, Math.round(dmg * mul * (0.35 + 0.65 * f)));
        t.hp -= amount;
        this.events.push({ type: 'dmg', tank: t.i, amount, x: t.x, y: t.y - 30 });
      }
      const nx = d > 0.01 ? dx / d : 0;
      t.vx += nx * push * f;
      t.vy = Math.min(t.vy, 0) - push * f * 0.8;
      t.ground = false;
      t.fallTop = Math.min(t.fallTop, t.y);
    }
    for (const m of this.mines) if (len(m.x - x, m.y - y) < r + 10) m.boom = true;
    this.events.push({ type: opts.kind || 'explode', x, y, r });
    this.quiet = 0;
  }

  buildWall(x, y) {
    const c0 = Math.floor((x - 14) / CELL), c1 = Math.floor((x + 14) / CELL);
    const r0 = Math.floor((y - 140) / CELL), r1 = Math.floor((y + 14) / CELL);
    for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) {
      for (let c = Math.max(0, c0); c <= Math.min(this.cols - 1, c1); c++) {
        const cx = c * CELL, cy = r * CELL;
        if (this.tanks.some(t => t.alive && Math.abs(cx - t.x) < 26 && cy > t.y - 34 && cy < t.y + 2)) continue;
        if (this.mask[r * this.cols + c] === 0) this.mask[r * this.cols + c] = 2;
      }
    }
    this.dirty.push([c0 - 2, r0 - 2, c1 + 2, r1 + 2]);
    this.events.push({ type: 'wall', x, y });
  }

  nearestTank(x, y, maxD, not = -1) {
    let best = null, bd = maxD;
    for (const t of this.tanks) {
      if (!t.alive || t.i === not) continue;
      const d = len(t.x - x, t.y - MID - y);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  // A projectile hit something. (px, py) = last spot in the air. Returns true if it's used up.
  impact(p, x, y, px, py, tank) {
    const m = p.mul;
    switch (p.kind) {
      case 'shell': this.explode(x, y, 40, 40, { mul: m }); return true;
      case 'mini': this.explode(x, y, 24, 16, { mul: m }); return true;
      case 'spark': this.explode(x, y, 18, 9, { mul: m, kind: 'pop' }); return true;
      case 'sock': this.explode(x, y, 36, 38, { mul: m }); return true;
      case 'yoyo':
        if (p.state === 'fly') { p.x = x; p.y = y; this.yoyoBoom(p); return false; }
        this.explode(x, y, 36, 30, { mul: m }); return true;
      case 'chicken':
        if (tank || p.bounces >= 4) { this.explode(x, y, 36, 38, { mul: m }); return true; }
        this.bounce(p, x, y, px, py);
        return false;
      case 'cupcake':
        this.explode(x, y, 28, 20, { mul: m });
        for (const [vx, vy] of CUPCAKE_V) {
          this.projectiles.push({ kind: 'mini', x: px, y: py - 4, vx: vx + p.vx * 0.15, vy, age: 0, owner: p.owner, mul: m, grav: 1, windK: 1, state: 'fly', bounces: 0, safe: 0.12 });
        }
        return true;
      case 'mole':
        if (tank) { this.explode(x, y, 44, 42, { mul: m }); return true; }
        p.state = 'dig'; p.digT = 0;
        {
          let dx = p.vx, dy = Math.max(p.vy, 40);
          const l = len(dx, dy) || 1;
          p.vx = dx / l * 150; p.vy = dy / l * 150;
        }
        this.events.push({ type: 'dig', x, y });
        return false;
      case 'cloud': {
        const t = this.nearestTank(x, y, 320);
        if (t) { t.cloud = 3; this.events.push({ type: 'cloudOn', tank: t.i, x, y }); }
        else this.events.push({ type: 'fizz', x, y });
        return true;
      }
      case 'custard': this.buildWall(px, py); return true;
      case 'flare':
        this.boots.push({ x, y: Math.min(-120, y - 700), vy: 300, owner: p.owner, mul: m });
        this.events.push({ type: 'flare', x, y });
        return true;
      case 'whoopee': this.explode(x, y, 110, 0, { push: 560, carve: false, kind: 'whoopee' }); return true;
      case 'shrink': {
        const t = tank || this.nearestTank(x, y, 160);
        if (t) { t.shrink = 2; this.events.push({ type: 'shrink', tank: t.i, x, y }); }
        else this.events.push({ type: 'fizz', x, y });
        return true;
      }
      case 'magnet':
        this.mines.push({ id: this.nextId++, x: px, y: py, landed: false, boom: false, age: 0 });
        this.events.push({ type: 'mine', x: px, y: py });
        return true;
      case 'firework': this.burst(p, px, py); return true;
    }
    return true;
  }

  yoyoBoom(p) {
    this.explode(p.x, p.y, 42, 42, { mul: p.mul });
    const o = this.tanks[p.owner];
    p.state = 'back'; p.backAt = p.age; p.vx = 0; p.vy = 0;
    p.half = len(o.x - p.x, o.y - MID - p.y) / 2;
    if (p.half < 40) this.remove(p);   // too close to home for a second boom
  }

  burst(p, x, y) {
    for (const [vx, vy] of SPARK_V) {
      this.projectiles.push({ kind: 'spark', x, y, vx: vx + p.vx * 0.3, vy: vy + p.vy * 0.2, age: 0, owner: p.owner, mul: p.mul, grav: 1, windK: 0.5, state: 'fly', bounces: 0, safe: 0.1 });
    }
    this.events.push({ type: 'burst', x, y });
  }

  bounce(p, x, y, px, py) {
    const cc = Math.floor(x / CELL), cr = Math.floor(y / CELL);
    let nx = 0, ny = 0;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      if (this.cellSolid(cc + dx, cr + dy)) { nx -= dx; ny -= dy; }
    }
    let l = len(nx, ny);
    if (l < 0.01) { nx = 0; ny = -1; l = 1; }
    nx /= l; ny /= l;
    const dot = p.vx * nx + p.vy * ny;
    if (dot < 0) { p.vx -= 2 * dot * nx; p.vy -= 2 * dot * ny; }
    p.vx *= 0.72; p.vy *= 0.72;
    if (len(p.vx, p.vy) < 60) { p.vx += nx * 120; p.vy += ny * 120 - 60; }
    p.x = px; p.y = py;
    p.bounces++;
    this.events.push({ type: 'bounce', x, y, n: p.bounces });
  }

  // ---------------------------------------------------------------- step
  step() {
    if (this.phase !== 'fly' && this.phase !== 'settle') return;
    this.ticks++;
    let busy = false;
    if (this.projectiles.length) { busy = true; this.stepProjectiles(); }
    if (this.boots.length) { busy = true; this.stepBoots(); }
    for (const t of this.tanks) if (t.alive && this.stepTank(t)) busy = true;
    if (this.stepCrates()) busy = true;
    if (this.stepMines()) busy = true;
    if (busy) { this.quiet = 0; return; }
    if (++this.quiet < 30) return;

    const dying = this.tanks.filter(t => t.alive && t.hp <= 0);
    if (dying.length) {
      for (const t of dying) {
        t.alive = false; t.hp = 0;
        this.events.push({ type: 'die', tank: t.i, x: t.x, y: t.y });
        this.explode(t.x, t.y - MID, 34, 22, { kind: 'bigboom' });
      }
      return;
    }
    const alive = this.living();
    if (alive.length <= 1) {
      this.phase = 'over';
      this.winner = alive.length ? alive[0].i : -1;
      this.events.push({ type: 'over', winner: this.winner });
      return;
    }
    if (this.phase === 'fly') this.phase = 'done';
    else this.phase = this.tanks[this.active].alive ? 'aim' : 'done';
  }

  stepProjectiles() {
    const g = this.g;
    for (const p of [...this.projectiles]) {
      if (!this.projectiles.includes(p)) continue;
      p.age += DT;
      // special movers
      if (p.kind === 'sock' && p.age > 0.5) {
        if (!p.target || !this.tanks[p.target - 1].alive) {
          const t = this.nearestTank(p.x, p.y, 1e9, p.owner);
          p.target = t ? t.i + 1 : 0;
        }
        if (p.target) {
          const t = this.tanks[p.target - 1];
          const dx = t.x - p.x, dy = t.y - MID - p.y, l = len(dx, dy) || 1;
          const k = 2.4 * DT;
          p.vx += (dx / l * 330 - p.vx) * k;
          p.vy += (dy / l * 330 - p.vy) * k;
        }
        p.grav = 0.15;
        if (p.age > 7) { this.remove(p); this.explode(p.x, p.y, 36, 38, { mul: p.mul }); continue; }
      }
      if (p.kind === 'firework' && p.age > 0.25 && p.vy > 0) { this.remove(p); this.burst(p, p.x, p.y); continue; }
      // Yo-yo: drills out through the ground, BOOM at the end of its string,
      // then zooms back and goes BOOM again half way home.
      if (p.kind === 'yoyo') {
        const o = this.tanks[p.owner];
        if (p.ticks === undefined) p.ticks = 0;
        if (p.ticks++ % 3 === 0 && len(p.x - o.x, p.y - o.y + MID) > 45) this.carve(p.x, p.y, 9);
        if (p.state === 'fly') {
          p.vx -= p.v0x * DT / 1.2; p.vy -= p.v0y * DT / 1.2;
          if (p.age >= 1.2) { this.yoyoBoom(p); if (!this.projectiles.includes(p)) continue; }
        } else {
          const dx = o.x - p.x, dy = o.y - MID - p.y, l = len(dx, dy) || 1;
          const sp = Math.min(700, 250 + (p.age - p.backAt) * 600);
          p.vx = dx / l * sp; p.vy = dy / l * sp;
          if (l <= p.half || !o.alive || p.age > 6) { this.remove(p); this.explode(p.x, p.y, 36, 30, { mul: p.mul }); continue; }
        }
      }
      if (p.kind === 'mole' && p.state !== 'fly') {
        p.digT += DT;
        if (p.state === 'dig' && p.digT > 1.1) { p.state = 'up'; p.vx = 0; p.vy = -180; }
        if (p.ticks === undefined) p.ticks = 0;
        if (p.ticks++ % 3 === 0) this.carve(p.x, p.y, 10);
        if (p.state === 'up' && !this.solidAt(p.x, p.y) && !this.solidAt(p.x, p.y - 14)) {
          this.remove(p); this.explode(p.x, p.y, 44, 42, { mul: p.mul }); continue;
        }
        if (p.digT > 4) { this.remove(p); this.explode(p.x, p.y, 44, 42, { mul: p.mul }); continue; }
      }
      const ghost = p.kind === 'yoyo' || (p.kind === 'mole' && p.state !== 'fly');
      if (p.grav) p.vy += g * p.grav * DT;
      if (p.windK && !ghost) p.vx += this.wind * WIND_K * p.windK * DT;

      const sp = len(p.vx, p.vy);
      const n = Math.max(1, Math.ceil(sp * DT / 1.5));
      for (let s = 0; s < n; s++) {
        const px = p.x, py = p.y;
        const nx = px + p.vx * DT / n, ny = py + p.vy * DT / n;
        if (ny > WATER_Y || nx < -600 || nx > this.W + 600) {
          this.remove(p);
          if (ny > WATER_Y) this.events.push({ type: 'splash', x: nx, y: WATER_Y });
          break;
        }
        let hitTank = null;
        for (const t of this.tanks) {
          if (!t.alive) continue;
          if (t.i === p.owner && (p.age < 0.4 || p.kind === 'yoyo')) continue;
          if (p.safe && p.age < p.safe) continue;
          const k = t.shrink > 0 ? 0.5 : 1;
          if (len(nx - t.x, ny - (t.y - MID * k)) < this.tankR(t)) { hitTank = t; break; }
        }
        if (hitTank) {
          if (this.impact(p, nx, ny, px, py, hitTank)) this.remove(p);
          break;
        }
        if (p.grace && len(nx - p.sx, ny - p.sy) >= p.grace) p.grace = 0;
        if (!ghost && !p.grace && this.solidAt(nx, ny)) {
          if (this.impact(p, nx, ny, px, py, null)) this.remove(p);
          break;
        }
        p.x = nx; p.y = ny;
      }
    }
  }
  remove(p) { const i = this.projectiles.indexOf(p); if (i >= 0) this.projectiles.splice(i, 1); }

  stepBoots() {
    for (const b of [...this.boots]) {
      b.vy += this.g * 2 * DT;
      const n = Math.max(1, Math.ceil(b.vy * DT / 2));
      let hit = false;
      for (let s = 0; s < n && !hit; s++) {
        b.y += b.vy * DT / n;
        if (b.y > WATER_Y) { this.boots.splice(this.boots.indexOf(b), 1); this.events.push({ type: 'splash', x: b.x, y: WATER_Y }); hit = true; break; }
        const tankHit = this.tanks.some(t => t.alive && Math.abs(t.x - b.x) < 40 && b.y > t.y - 30 && b.y < t.y + 4);
        if (tankHit || this.solidAt(b.x, b.y)) {
          hit = true;
          this.boots.splice(this.boots.indexOf(b), 1);
          this.stomp(b);
        }
      }
    }
  }
  stomp(b) {
    const c0 = Math.floor((b.x - 36) / CELL), c1 = Math.floor((b.x + 36) / CELL);
    const r0 = Math.floor((b.y - 10) / CELL), r1 = Math.floor((b.y + 34) / CELL);
    for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) {
      for (let c = Math.max(0, c0); c <= Math.min(this.cols - 1, c1); c++) this.mask[r * this.cols + c] = 0;
    }
    this.dirty.push([c0 - 2, r0 - 2, c1 + 2, r1 + 2]);
    for (const t of this.tanks) {
      if (!t.alive) continue;
      const dx = t.x - b.x;
      if (Math.abs(dx) < 48 && t.y > b.y - 60 && t.y < b.y + 80) {
        const amount = Math.round(50 * b.mul);
        t.hp -= amount;
        this.events.push({ type: 'dmg', tank: t.i, amount, x: t.x, y: t.y - 30 });
        t.vx = (dx < 0 ? -1 : 1) * 120; t.vy = 60; t.ground = false; t.fallTop = t.y;
      }
    }
    for (const m of this.mines) if (Math.abs(m.x - b.x) < 50 && Math.abs(m.y - b.y) < 60) m.boom = true;
    this.events.push({ type: 'stomp', x: b.x, y: b.y });
    this.quiet = 0;
  }

  // Returns true while the tank is moving.
  stepTank(t) {
    const supported = this.solidAt(t.x, t.y + 1);
    if (t.ground && supported && t.vx === 0 && t.vy === 0) return false;
    if (t.ground && supported && t.vy >= 0) {         // sliding along the ground
      t.vy = 0;
      const dx = t.vx * DT;
      const ny = this.groundAt(t.x + dx, t.y, 6, 6);
      if (ny !== null) { t.x += dx; t.y = ny; }
      else if (!this.solidAt(t.x + dx, t.y - 6)) { t.x += dx; t.ground = false; t.fallTop = t.y; } // off a ledge
      else t.vx = 0;
      t.vx *= 0.86;
      if (Math.abs(t.vx) < 4) t.vx = 0;
      return true;
    }
    if (t.ground) { t.ground = false; t.fallTop = t.y; }
    t.vy = Math.min(900, t.vy + this.g * DT);
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(t.vx), Math.abs(t.vy)) * DT / CELL));
    for (let s = 0; s < n; s++) {
      let nx = t.x + t.vx * DT / n;
      let ny = t.y + t.vy * DT / n;
      if (this.solidAt(nx, ny - 16)) {
        if (!this.solidAt(t.x, ny - 16)) { t.vx = -t.vx * 0.3; nx = t.x; }
        else if (t.vy < 0) { t.vy = 0; ny = t.y; }
      }
      if (t.vy >= 0 && this.solidAt(nx, ny)) {
        ny = Math.floor(ny / CELL) * CELL;
        let guard = 0;
        while (this.solidAt(nx, ny - 1) && guard++ < 12) ny -= CELL;
        t.x = nx; t.y = ny;
        this.land(t);
        return true;
      }
      t.x = nx; t.y = ny;
      t.fallTop = Math.min(t.fallTop, t.y);
    }
    if (t.y > WATER_Y) {
      t.alive = false; t.hp = 0; t.vx = 0; t.vy = 0;
      this.events.push({ type: 'splash', x: t.x, y: WATER_Y, big: true });
      this.events.push({ type: 'drown', tank: t.i, x: t.x, y: WATER_Y });
    }
    return true;
  }
  land(t) {
    const drop = t.y - t.fallTop;
    if (drop > 90) {
      const amount = Math.min(30, Math.round((drop - 90) * 0.2));
      if (amount > 0) { t.hp -= amount; this.events.push({ type: 'dmg', tank: t.i, amount, x: t.x, y: t.y - 30 }); }
    }
    if (Math.abs(t.vy) > 150) this.events.push({ type: 'thud', x: t.x, y: t.y });
    t.vy = 0;
    t.vx *= 0.5;
    if (Math.abs(t.vx) < 4) t.vx = 0;
    t.ground = true;
  }

  stepCrates() {
    let busy = false;
    for (const k of [...this.crates]) {
      if (k.landed && !this.solidAt(k.x, k.y + 1)) k.landed = false;
      if (!k.landed) {
        busy = true;
        k.y += 160 * DT;
        if (this.solidAt(k.x, k.y)) {
          k.y = Math.floor(k.y / CELL) * CELL;
          let guard = 0;
          while (this.solidAt(k.x, k.y - 1) && guard++ < 10) k.y -= CELL;
          k.landed = true;
        }
        if (k.y > WATER_Y) { this.crates.splice(this.crates.indexOf(k), 1); this.events.push({ type: 'splash', x: k.x, y: WATER_Y }); continue; }
      }
      for (const t of this.tanks) {
        if (t.alive && len(k.x - t.x, k.y - t.y) < 28) { this.pickup(t, k); break; }
      }
    }
    return busy;
  }

  stepMines() {
    let busy = false;
    for (const m of [...this.mines]) {
      m.age += DT;
      if (m.landed && !this.solidAt(m.x, m.y + 1)) m.landed = false;
      if (!m.landed) {
        busy = true;
        m.y += 220 * DT;
        if (this.solidAt(m.x, m.y)) {
          m.y = Math.floor(m.y / CELL) * CELL;
          let guard = 0;
          while (this.solidAt(m.x, m.y - 1) && guard++ < 10) m.y -= CELL;
          m.landed = true;
        }
        if (m.y > WATER_Y) { this.mines.splice(this.mines.indexOf(m), 1); this.events.push({ type: 'splash', x: m.x, y: WATER_Y }); continue; }
      }
      const near = this.tanks.some(t => t.alive && len(t.x - m.x, t.y - m.y) < 26);
      if (m.boom || (near && m.age > 0.3)) {
        this.mines.splice(this.mines.indexOf(m), 1);
        this.explode(m.x, m.y - 4, 46, 40, {});
        busy = true;
      }
    }
    return busy;
  }

  // ---------------------------------------------------------------- copies
  snapshot() {
    const { mask, events, dirty, ...rest } = this;
    return { s: JSON.stringify(rest), mask: mask.slice() };
  }
  static fromSnapshot(snap) {
    const w = Object.create(World.prototype);
    Object.assign(w, JSON.parse(snap.s));
    w.mask = snap.mask.slice();
    w.events = [];
    w.dirty = [];
    return w;
  }
  // Short summary of the tanks, to spot a device that got out of step.
  tankState() { return this.tanks.map(t => [Math.round(t.x * 10) / 10, Math.round(t.y * 10) / 10, t.hp, t.alive ? 1 : 0]); }
  // theirs = the shooter's tankState() after a shot, mine = ours after the same shot.
  // Things may have happened since (rain, crates), so only the difference is applied.
  fixTanks(theirs, mine) {
    if (!Array.isArray(theirs) || !Array.isArray(mine) || theirs.length !== this.tanks.length || mine.length !== theirs.length) return false;
    let changed = false;
    theirs.forEach((s, i) => {
      const m = mine[i];
      if (!Array.isArray(s) || s.length !== 4 || !s.every(Number.isFinite)) return;
      const t = this.tanks[i];
      const dx = s[0] - m[0], dy = s[1] - m[1], dhp = s[2] - m[2];
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2 && dhp === 0 && s[3] === m[3]) return;
      changed = true;
      if (!s[3]) { t.alive = false; t.hp = 0; return; }
      t.x += dx; t.y += dy; t.hp += dhp;
      const gy = this.groundAt(t.x, t.y, 20, 40);
      if (gy !== null) t.y = gy;
      t.vx = 0; t.vy = 0; t.ground = true;
    });
    return changed;
  }
}
