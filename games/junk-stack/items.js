// Junk Stack – the junk you can stack, and the stages.
// Shapes are in metres, y up, centred on the body. draw(ctx) also uses metres, y up.
import * as planck from '../../js/vendor/planck.mjs';

const { Vec2 } = planck;

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function poly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
const OUT = '#3b2a1e';

export const ITEMS = {
  crate: {
    name: 'Crate', w: 1.2, h: 1.2,
    shapes: [{ box: [0.6, 0.6] }],
    friction: 0.75,
    draw(ctx) {
      rr(ctx, -0.6, -0.6, 1.2, 1.2, 0.08); ctx.fillStyle = '#c98a45'; ctx.fill();
      ctx.lineWidth = 0.05; ctx.strokeStyle = OUT; ctx.stroke();
      ctx.strokeStyle = '#8d5a25'; ctx.lineWidth = 0.1;
      ctx.strokeRect(-0.48, -0.48, 0.96, 0.96);
      ctx.beginPath(); ctx.moveTo(-0.45, -0.45); ctx.lineTo(0.45, 0.45); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 0.04;
      ctx.beginPath(); ctx.moveTo(-0.4, 0.15); ctx.lineTo(0.1, 0.15); ctx.moveTo(-0.1, -0.2); ctx.lineTo(0.4, -0.2); ctx.stroke();
    },
  },
  plank: {
    name: 'Plank', w: 3.2, h: 0.34,
    shapes: [{ box: [1.6, 0.17] }],
    density: 0.8, friction: 0.8,
    draw(ctx) {
      rr(ctx, -1.6, -0.17, 3.2, 0.34, 0.06); ctx.fillStyle = '#e0aa66'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = OUT; ctx.stroke();
      ctx.strokeStyle = '#b07a3a'; ctx.lineWidth = 0.03;
      ctx.beginPath(); ctx.moveTo(-1.4, 0.04); ctx.lineTo(-0.2, 0.06); ctx.moveTo(0.2, -0.05); ctx.lineTo(1.3, -0.04); ctx.stroke();
      ctx.fillStyle = '#6d6d6d';
      [-1.45, 1.45].forEach(x => { circle(ctx, x, 0, 0.045); ctx.fill(); });
    },
  },
  barrel: {
    name: 'Barrel', w: 0.9, h: 1.3,
    shapes: [{ box: [0.45, 0.65] }],
    friction: 0.7,
    draw(ctx) {
      rr(ctx, -0.45, -0.65, 0.9, 1.3, 0.2); ctx.fillStyle = '#e53935'; ctx.fill();
      ctx.lineWidth = 0.05; ctx.strokeStyle = OUT; ctx.stroke();
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(-0.45, 0.36, 0.9, 0.09); ctx.fillRect(-0.45, -0.45, 0.9, 0.09);
      ctx.fillStyle = 'rgba(255,255,255,.28)'; rr(ctx, -0.32, -0.5, 0.1, 1.0, 0.05); ctx.fill();
    },
  },
  fridge: {
    name: 'Fridge', w: 1.0, h: 1.8,
    shapes: [{ box: [0.5, 0.9] }],
    density: 1.1, friction: 0.6,
    draw(ctx) {
      rr(ctx, -0.5, -0.9, 1.0, 1.8, 0.14); ctx.fillStyle = '#eef3f6'; ctx.fill();
      ctx.lineWidth = 0.05; ctx.strokeStyle = '#7f95a3'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.5, 0.3); ctx.lineTo(0.5, 0.3); ctx.stroke();
      ctx.fillStyle = '#90a4ae';
      rr(ctx, 0.3, 0.45, 0.07, 0.3, 0.03); ctx.fill();
      rr(ctx, 0.3, -0.1, 0.07, 0.3, 0.03); ctx.fill();
      ctx.fillStyle = '#ff7043'; circle(ctx, -0.22, 0.6, 0.07); ctx.fill();
      ctx.fillStyle = '#42a5f5'; ctx.fillRect(-0.28, -0.3, 0.16, 0.12);
      ctx.fillStyle = '#66bb6a'; circle(ctx, -0.05, -0.5, 0.06); ctx.fill();
    },
  },
  bathtub: {
    name: 'Bath', w: 2.2, h: 0.9,
    shapes: [{ box: [1.1, 0.15, 0, -0.35] }, { box: [0.12, 0.4, -0.98, 0] }, { box: [0.12, 0.4, 0.98, 0] }],
    friction: 0.6,
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(-1.1, 0.4); ctx.lineTo(-1.1, -0.3);
      ctx.quadraticCurveTo(-1.1, -0.5, -0.85, -0.5); ctx.lineTo(0.85, -0.5);
      ctx.quadraticCurveTo(1.1, -0.5, 1.1, -0.3); ctx.lineTo(1.1, 0.4);
      ctx.lineTo(0.86, 0.4); ctx.lineTo(0.86, -0.2); ctx.lineTo(-0.86, -0.2); ctx.lineTo(-0.86, 0.4);
      ctx.closePath();
      ctx.fillStyle = '#fafafa'; ctx.fill();
      ctx.lineWidth = 0.05; ctx.strokeStyle = '#78909c'; ctx.stroke();
      ctx.fillStyle = '#4fc3f7'; ctx.globalAlpha = 0.6; ctx.fillRect(-0.86, -0.2, 1.72, 0.12); ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffd54f'; circle(ctx, -0.98, 0.42, 0.07); ctx.fill(); circle(ctx, 0.98, 0.42, 0.07); ctx.fill();
    },
  },
  cheese: {
    name: 'Cheese', w: 1.6, h: 1.1,
    shapes: [{ poly: [[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.6]] }],
    friction: 0.8,
    draw(ctx) {
      poly(ctx, [[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.6]]); ctx.fillStyle = '#ffcf33'; ctx.fill();
      ctx.lineWidth = 0.05; ctx.strokeStyle = '#c99400'; ctx.stroke();
      ctx.fillStyle = '#e6a800';
      [[-0.5, -0.2, 0.12], [-0.1, -0.3, 0.08], [-0.55, 0.22, 0.07], [0.25, -0.35, 0.06]].forEach(([x, y, r]) => { circle(ctx, x, y, r); ctx.fill(); });
    },
  },
  cone: {
    name: 'Cone', w: 1.0, h: 1.2,
    shapes: [{ poly: [[-0.5, -0.6], [0.5, -0.6], [0.14, 0.6], [-0.14, 0.6]] }],
    density: 0.7, friction: 0.8,
    draw(ctx) {
      poly(ctx, [[-0.5, -0.6], [0.5, -0.6], [0.14, 0.6], [-0.14, 0.6]]); ctx.fillStyle = '#ff7a1a'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#a84300'; ctx.stroke();
      ctx.fillStyle = '#fff';
      poly(ctx, [[-0.33, -0.1], [0.33, -0.1], [0.27, 0.1], [-0.27, 0.1]]); ctx.fill();
      ctx.fillStyle = '#37474f'; ctx.fillRect(-0.5, -0.6, 1.0, 0.12);
    },
  },
  sofa: {
    name: 'Sofa', w: 2.0, h: 1.5,
    shapes: [{ box: [1.0, 0.25, 0, -0.25] }, { box: [0.25, 0.5, -0.75, 0.5] }],
    friction: 0.85,
    draw(ctx) {
      ctx.fillStyle = '#7e57c2'; ctx.strokeStyle = '#3f2a6b'; ctx.lineWidth = 0.05;
      rr(ctx, -1.0, 0, 0.5, 1.0, 0.16); ctx.fill(); ctx.stroke();
      rr(ctx, -1.0, -0.5, 2.0, 0.5, 0.14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#9575cd'; rr(ctx, -0.45, -0.12, 1.35, 0.14, 0.07); ctx.fill();
      ctx.fillStyle = '#3f2a6b'; ctx.fillRect(-0.9, -0.5, 0.1, 0.06); ctx.fillRect(0.8, -0.5, 0.1, 0.06);
    },
  },
  tyre: {
    name: 'Tyre', w: 1.2, h: 1.2,
    shapes: [{ circle: 0.6 }],
    friction: 0.95, angularDamping: 1.5,
    draw(ctx) {
      circle(ctx, 0, 0, 0.6); ctx.fillStyle = '#2b2b2b'; ctx.fill();
      ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 0.07;
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 0.45, Math.sin(a) * 0.45); ctx.lineTo(Math.cos(a) * 0.57, Math.sin(a) * 0.57); ctx.stroke();
      }
      circle(ctx, 0, 0, 0.3); ctx.fillStyle = '#b0bec5'; ctx.fill();
      ctx.fillStyle = '#607d8b';
      for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; circle(ctx, Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0.04); ctx.fill(); }
    },
  },
  ball: {
    name: 'Ball', w: 0.9, h: 0.9,
    shapes: [{ circle: 0.45 }],
    density: 0.5, friction: 0.6, angularDamping: 1,
    draw(ctx) {
      const cols = ['#ef5350', '#fff', '#42a5f5', '#fff', '#ffca28', '#fff'];
      cols.forEach((c, i) => {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 0.45, i * Math.PI / 3, (i + 1) * Math.PI / 3); ctx.closePath();
        ctx.fillStyle = c; ctx.fill();
      });
      circle(ctx, 0, 0, 0.45); ctx.lineWidth = 0.04; ctx.strokeStyle = '#90a4ae'; ctx.stroke();
      circle(ctx, 0, 0, 0.08); ctx.fillStyle = '#fff'; ctx.fill();
    },
  },
  flag: {
    name: 'Flag', w: 1.0, h: 1.5,
    shapes: [{ box: [0.45, 0.12, 0, -0.63] }, { box: [0.05, 0.62, 0, 0.13] }],
    density: 1, friction: 1,
    draw(ctx) {
      rr(ctx, -0.45, -0.75, 0.9, 0.24, 0.06); ctx.fillStyle = '#455a64'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#263238'; ctx.stroke();
      ctx.fillStyle = '#eceff1'; ctx.fillRect(-0.04, -0.51, 0.08, 1.26);
      ctx.fillStyle = '#ffca28'; circle(ctx, 0, 0.76, 0.07); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0.04, 0.7); ctx.quadraticCurveTo(0.3, 0.78, 0.62, 0.62);
      ctx.lineTo(0.62, 0.22); ctx.quadraticCurveTo(0.3, 0.36, 0.04, 0.28); ctx.closePath();
      ctx.fillStyle = '#e53935'; ctx.fill(); ctx.strokeStyle = '#8e1b18'; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath();
      const cx = 0.32, cy = 0.48, R = 0.11;
      for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
    },
  },
};

// Bounding radius of each item (for spacing and icons).
for (const def of Object.values(ITEMS)) {
  let r = 0;
  def.shapes.forEach(sh => {
    if (sh.circle) r = Math.max(r, sh.circle);
    if (sh.box) { const [hw, hh, cx = 0, cy = 0] = sh.box; r = Math.max(r, Math.hypot(Math.abs(cx) + hw, Math.abs(cy) + hh)); }
    if (sh.poly) sh.poly.forEach(([x, y]) => { r = Math.max(r, Math.hypot(x, y)); });
  });
  def.r = r;
}

export function makeBody(world, type, x, y, angle = 0) {
  const def = ITEMS[type];
  const body = world.createBody({
    type: 'dynamic', position: Vec2(x, y), angle,
    angularDamping: def.angularDamping ?? 0.2, linearDamping: 0.05,
  });
  const fd = { density: def.density ?? 1, friction: def.friction ?? 0.7, restitution: 0.02 };
  def.shapes.forEach(sh => {
    if (sh.circle) body.createFixture(planck.Circle(sh.circle), fd);
    if (sh.box) { const [hw, hh, cx = 0, cy = 0] = sh.box; body.createFixture(planck.Box(hw, hh, Vec2(cx, cy), 0), fd); }
    if (sh.poly) body.createFixture(planck.Polygon(sh.poly.map(([px, py]) => Vec2(px, py))), fd);
  });
  body.setUserData({ type });
  return body;
}

// Draw an item onto a little canvas (tray buttons).
export function drawIcon(canvas, type, angle = 0) {
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 56;
  canvas.width = size * dpr; canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  const def = ITEMS[type];
  const k = (size * 0.44) / def.r;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-angle);
  ctx.scale(k, -k);
  def.draw(ctx);
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const STAGE_COUNT = 20;

// Each stage: what junk you get, how wide the rock is, how windy it is.
// Same stage = same junk every time.
export function stageInfo(n) {
  const rnd = mulberry32(n * 9973 + 7);
  const easy = ['crate', 'plank', 'barrel', 'fridge', 'bathtub', 'crate'];
  const mid = [...easy, 'cheese', 'cone', 'sofa'];
  const hard = [...mid, 'tyre', 'ball', 'cheese', 'cone', 'sofa'];
  let items;
  if (n === 1) items = ['crate', 'crate', 'plank', 'barrel', 'fridge'];
  else {
    const pool = n <= 3 ? easy : n <= 7 ? mid : hard;
    const count = Math.min(4 + n, 14);
    items = [];
    for (let i = 0; i < count; i++) items.push(pool[Math.floor(rnd() * pool.length)]);
  }
  const platformW = Math.max(3.2, 7 - (n - 1) * 0.3);
  const wind = n < 5 ? 0 : Math.min(2.4, (n - 4) * 0.3);
  const flat = items.reduce((a, t) => a + Math.min(ITEMS[t].w, ITEMS[t].h), 0);
  return { items, platformW, wind, star2: +(flat * 0.6).toFixed(1), star3: +(flat * 0.9).toFixed(1) };
}
