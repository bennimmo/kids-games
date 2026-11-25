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
    name: 'Oil drum', w: 0.9, h: 1.3,
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
    name: 'Old fridge', w: 1.0, h: 1.8,
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
    name: 'Flat tyre', w: 1.3, h: 0.7,
    shapes: [{ poly: [[-0.45, -0.35], [0.45, -0.35], [0.65, -0.12], [0.62, 0.15], [0.42, 0.35], [-0.42, 0.35], [-0.62, 0.15], [-0.65, -0.12]] }],
    friction: 1, density: 1.1,
    draw(ctx) {
      poly(ctx, [[-0.45, -0.35], [0.45, -0.35], [0.66, -0.12], [0.62, 0.15], [0.42, 0.35], [-0.42, 0.35], [-0.62, 0.15], [-0.66, -0.12]]);
      ctx.fillStyle = '#2b2b2b'; ctx.fill();
      ctx.strokeStyle = '#4a4a4a'; ctx.lineWidth = 0.06;
      for (let x = -0.5; x <= 0.5; x += 0.2) { ctx.beginPath(); ctx.moveTo(x, 0.3); ctx.lineTo(x + 0.06, 0.36); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(0, -0.02, 0.3, 0.13, 0, 0, Math.PI * 2); ctx.fillStyle = '#8d9aa1'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -0.04, 0.16, 0.06, 0, 0, Math.PI * 2); ctx.fillStyle = '#555'; ctx.fill();
      ctx.fillStyle = '#ffeb3b'; poly(ctx, [[0.3, 0.12], [0.38, 0.22], [0.42, 0.1]]); ctx.fill();
    },
  },
  pallet: {
    name: 'Pallet', w: 1.8, h: 0.32,
    shapes: [{ box: [0.9, 0.16] }],
    density: 0.7, friction: 0.85,
    draw(ctx) {
      ctx.fillStyle = '#c9a26b'; ctx.strokeStyle = OUT; ctx.lineWidth = 0.03;
      rr(ctx, -0.9, 0.04, 1.8, 0.12, 0.02); ctx.fill(); ctx.stroke();
      rr(ctx, -0.9, -0.16, 1.8, 0.1, 0.02); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#a57d47';
      [-0.8, -0.08, 0.64].forEach(x => { ctx.fillRect(x, -0.06, 0.16, 0.1); });
    },
  },
  tv: {
    name: 'Old telly', w: 1.1, h: 0.9,
    shapes: [{ box: [0.55, 0.45] }],
    density: 1.1, friction: 0.7,
    draw(ctx) {
      rr(ctx, -0.55, -0.45, 1.1, 0.9, 0.12); ctx.fillStyle = '#8d6e63'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = OUT; ctx.stroke();
      rr(ctx, -0.45, -0.33, 0.7, 0.66, 0.1); ctx.fillStyle = '#90a4ae'; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      for (let i = 0; i < 14; i++) ctx.fillRect(-0.42 + ((i * 37) % 60) / 100, -0.3 + ((i * 53) % 58) / 100, 0.05, 0.03);
      ctx.fillStyle = '#ffca28'; circle(ctx, 0.4, 0.15, 0.05); ctx.fill();
      ctx.fillStyle = '#5d4037'; circle(ctx, 0.4, -0.05, 0.05); ctx.fill();
      ctx.strokeStyle = '#37474f'; ctx.lineWidth = 0.03;
      ctx.beginPath(); ctx.moveTo(-0.05, 0.45); ctx.lineTo(-0.2, 0.62); ctx.moveTo(0.05, 0.45); ctx.lineTo(0.25, 0.6); ctx.stroke();
    },
  },
  washer: {
    name: 'Washing machine', w: 1.0, h: 1.05,
    shapes: [{ box: [0.5, 0.525] }],
    density: 1.2, friction: 0.65,
    draw(ctx) {
      rr(ctx, -0.5, -0.525, 1.0, 1.05, 0.08); ctx.fillStyle = '#f5f5f5'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#78909c'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.5, 0.3); ctx.lineTo(0.5, 0.3); ctx.stroke();
      ctx.fillStyle = '#42a5f5'; circle(ctx, 0.3, 0.41, 0.05); ctx.fill();
      ctx.fillStyle = '#ef5350'; circle(ctx, 0.15, 0.41, 0.04); ctx.fill();
      circle(ctx, 0, -0.1, 0.3); ctx.fillStyle = '#b0bec5'; ctx.fill();
      circle(ctx, 0, -0.1, 0.22); ctx.fillStyle = '#4fc3f7'; ctx.fill();
      ctx.fillStyle = '#ff8a80'; circle(ctx, -0.07, -0.16, 0.06); ctx.fill();
      ctx.fillStyle = '#fff59d'; circle(ctx, 0.08, -0.05, 0.05); ctx.fill();
    },
  },
  bin: {
    name: 'Wheelie bin', w: 1.0, h: 1.4,
    shapes: [{ poly: [[-0.4, -0.7], [0.4, -0.7], [0.5, 0.62], [-0.5, 0.62]] }],
    friction: 0.75,
    draw(ctx) {
      poly(ctx, [[-0.4, -0.7], [0.4, -0.7], [0.5, 0.58], [-0.5, 0.58]]); ctx.fillStyle = '#43a047'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#1b5e20'; ctx.stroke();
      rr(ctx, -0.54, 0.56, 1.08, 0.1, 0.03); ctx.fillStyle = '#2e7d32'; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 0.05;
      [-0.2, 0, 0.2].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -0.55); ctx.lineTo(x * 1.15, 0.45); ctx.stroke(); });
      ctx.fillStyle = '#212121'; circle(ctx, -0.32, -0.66, 0.1); ctx.fill();
    },
  },
  mattress: {
    name: 'Mattress', w: 2.4, h: 0.4,
    shapes: [{ box: [1.2, 0.2] }],
    density: 0.45, friction: 1,
    draw(ctx) {
      rr(ctx, -1.2, -0.2, 2.4, 0.4, 0.14); ctx.fillStyle = '#e3f2fd'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#64b5f6'; ctx.stroke();
      ctx.fillStyle = '#90caf9';
      for (let x = -1.05; x < 1.1; x += 0.3) ctx.fillRect(x, -0.18, 0.12, 0.36);
      ctx.fillStyle = '#c8b273'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(0.5, 0.02, 0.22, 0.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    },
  },
  suitcase: {
    name: 'Suitcase', w: 1.2, h: 0.8,
    shapes: [{ box: [0.6, 0.4] }],
    density: 0.8, friction: 0.7,
    draw(ctx) {
      ctx.strokeStyle = '#4e342e'; ctx.lineWidth = 0.06;
      ctx.beginPath(); ctx.moveTo(-0.16, 0.4); ctx.lineTo(-0.16, 0.5); ctx.lineTo(0.16, 0.5); ctx.lineTo(0.16, 0.4); ctx.stroke();
      rr(ctx, -0.6, -0.4, 1.2, 0.8, 0.1); ctx.fillStyle = '#ff7043'; ctx.fill();
      ctx.lineWidth = 0.04; ctx.strokeStyle = '#8d3a1c'; ctx.stroke();
      ctx.fillStyle = '#8d3a1c'; ctx.fillRect(-0.4, -0.4, 0.08, 0.8); ctx.fillRect(0.32, -0.4, 0.08, 0.8);
      ctx.fillStyle = '#fff176'; ctx.save(); ctx.translate(-0.05, 0.05); ctx.rotate(0.2); ctx.fillRect(-0.15, -0.1, 0.3, 0.2); ctx.restore();
      ctx.fillStyle = '#4fc3f7'; circle(ctx, 0.15, -0.18, 0.09); ctx.fill();
    },
  },
  toilet: {
    name: 'Toilet', w: 1.0, h: 1.2,
    shapes: [{ box: [0.38, 0.25, 0.1, -0.35] }, { box: [0.17, 0.38, -0.32, 0.22] }],
    friction: 0.7, density: 1.1,
    draw(ctx) {
      ctx.fillStyle = '#fafafa'; ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 0.04;
      rr(ctx, -0.49, -0.16, 0.34, 0.76, 0.06); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.28, -0.1); ctx.lineTo(0.48, -0.1); ctx.quadraticCurveTo(0.45, -0.45, 0.2, -0.5);
      ctx.lineTo(0.15, -0.6); ctx.lineTo(-0.1, -0.6); ctx.lineTo(-0.12, -0.45); ctx.quadraticCurveTo(-0.28, -0.35, -0.28, -0.1);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4fc3f7'; ctx.fillRect(-0.24, -0.14, 0.68, 0.05);
      ctx.fillStyle = '#b0bec5'; ctx.fillRect(-0.4, 0.45, 0.12, 0.05);
    },
  },
  boot: {
    name: 'Welly boot', w: 0.9, h: 1.2,
    shapes: [{ box: [0.22, 0.45, -0.18, 0.15] }, { box: [0.45, 0.15, 0.05, -0.45] }],
    density: 0.8, friction: 0.9,
    draw(ctx) {
      ctx.fillStyle = '#ffeb3b'; ctx.strokeStyle = '#a68b00'; ctx.lineWidth = 0.04;
      ctx.beginPath();
      ctx.moveTo(-0.4, 0.6); ctx.lineTo(0.04, 0.6); ctx.lineTo(0.04, -0.2);
      ctx.quadraticCurveTo(0.45, -0.22, 0.5, -0.45); ctx.lineTo(0.5, -0.6); ctx.lineTo(-0.4, -0.6); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5d4037'; ctx.fillRect(-0.4, -0.6, 0.9, 0.1);
      ctx.fillStyle = '#fff'; ctx.fillRect(-0.4, 0.5, 0.44, 0.06);
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

// sc = { x, y }: this item's size (1 = normal). Every item is a bit different.
export function makeBody(world, type, x, y, angle = 0, sc = { x: 1, y: 1 }) {
  const def = ITEMS[type];
  const body = world.createBody({
    type: 'dynamic', position: Vec2(x, y), angle,
    angularDamping: def.angularDamping ?? 0.2, linearDamping: 0.05,
  });
  const fd = { density: def.density ?? 1, friction: def.friction ?? 0.7, restitution: 0.02 };
  def.shapes.forEach(sh => {
    if (sh.circle) body.createFixture(planck.Circle(sh.circle * sc.x), fd);
    if (sh.box) { const [hw, hh, cx = 0, cy = 0] = sh.box; body.createFixture(planck.Box(hw * sc.x, hh * sc.y, Vec2(cx * sc.x, cy * sc.y), 0), fd); }
    if (sh.poly) body.createFixture(planck.Polygon(sh.poly.map(([px, py]) => Vec2(px * sc.x, py * sc.y))), fd);
  });
  body.setUserData({ type });
  return body;
}

// Draw an item (metres, y up) at its size.
export function drawItem(ctx, type, sc) {
  ctx.scale(sc.x, sc.y);
  ITEMS[type].draw(ctx);
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EASY = ['crate', 'pallet', 'barrel', 'fridge', 'washer', 'tv', 'crate', 'mattress'];
const MID = [...EASY, 'bathtub', 'sofa', 'suitcase', 'bin', 'plank'];
const HARD = [...MID, 'tyre', 'cone', 'toilet', 'boot', 'plank', 'bin'];

// Endless junk. Same seed = same junk in the same order (fair races).
// Each kind of junk is always the same size. Trickier shapes turn up the more you stack.
export function junkSequence(seed) {
  const rnd = mulberry32(seed);
  let n = 0;
  return () => {
    const pool = n < 6 ? EASY : n < 14 ? MID : HARD;
    n++;
    return { type: pool[Math.floor(rnd() * pool.length)], sc: { x: 1, y: 1 } };
  };
}
