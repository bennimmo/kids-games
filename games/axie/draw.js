// Axie Pals – drawing: the tank, the axolotl, the egg, poo and things.
// Everything is drawn on one 2D canvas. Sizes are in CSS pixels.

import { ITEMS } from './items.js';

const TAU = Math.PI * 2;
function rad2(ctx, fx, fy, r0, x, y, r1, stops) {
  const g = ctx.createRadialGradient(fx, fy, r0, x, y, r1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

// Little seeded random so pebbles and weeds stay in the same place every frame.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const mix = (a, b, t) => {
  if (a[0] !== '#' || b[0] !== '#') return a;
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
};

// ---------- Tank ----------
// The still parts (water, far rocks, sand, pebbles) are drawn once into a cache canvas.
let cache = null;
function tankCache(W, H, top, floorY) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const key = `${W}x${H}x${floorY}x${dpr}`;
  if (cache && cache.key === key) return cache.c;
  const c = document.createElement('canvas');
  c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
  const g = c.getContext('2d');
  g.scale(dpr, dpr);

  // Water: deep at the bottom, bright near the top, a glow in the middle
  let gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#9be8ef'); gr.addColorStop(0.35, '#3cb6cf'); gr.addColorStop(0.75, '#1a7ea5'); gr.addColorStop(1, '#0f5a80');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  gr = g.createRadialGradient(W * 0.5, top, 0, W * 0.5, top, Math.max(W, H) * 0.8);
  gr.addColorStop(0, 'rgba(255,255,230,.35)'); gr.addColorStop(1, 'rgba(255,255,230,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);

  // Far rocks (hazy blue, like they're far back in the water)
  const r = rng(21);
  for (let layer = 0; layer < 2; layer++) {
    g.fillStyle = layer ? 'rgba(24,96,128,.55)' : 'rgba(40,120,150,.35)';
    g.beginPath();
    g.moveTo(0, floorY + 10);
    let x = 0;
    while (x < W + 60) {
      const w = 60 + r() * 140, h = (layer ? 40 : 90) + r() * (layer ? 70 : 120);
      g.quadraticCurveTo(x + w * 0.2, floorY - h, x + w * 0.5, floorY - h * 0.95);
      g.quadraticCurveTo(x + w * 0.85, floorY - h * 0.9, x + w, floorY + 4);
      x += w;
    }
    g.lineTo(W, H); g.lineTo(0, H); g.fill();
  }

  // Sand
  gr = g.createLinearGradient(0, floorY - 10, 0, H);
  gr.addColorStop(0, '#f0d6a2'); gr.addColorStop(0.4, '#ddb478'); gr.addColorStop(1, '#a87c4c');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(0, floorY + 8);
  for (let x = 0; x <= W + 30; x += 30) g.lineTo(x, floorY + Math.sin(x * 0.011) * 8 + Math.sin(x * 0.031) * 3);
  g.lineTo(W, H); g.lineTo(0, H); g.fill();
  // ripples in the sand
  g.strokeStyle = 'rgba(255,240,205,.45)'; g.lineWidth = 2; g.lineCap = 'round';
  for (let i = 0; i < W / 18; i++) {
    const x = r() * W, y = floorY + 14 + r() * (H - floorY - 10), w = 20 + r() * 40;
    g.beginPath(); g.moveTo(x - w / 2, y); g.quadraticCurveTo(x, y - 5, x + w / 2, y); g.stroke();
  }
  g.strokeStyle = 'rgba(120,80,40,.18)';
  for (let i = 0; i < W / 30; i++) {
    const x = r() * W, y = floorY + 16 + r() * (H - floorY - 10), w = 20 + r() * 30;
    g.beginPath(); g.moveTo(x - w / 2, y + 2); g.quadraticCurveTo(x, y - 2, x + w / 2, y + 2); g.stroke();
  }
  // pebbles with shading and a shadow
  const cols = ['#f6e3c0', '#c6966a', '#9fb9c9', '#d99a90', '#fdfdfd', '#8a6c52', '#b8c7a0'];
  for (let i = 0; i < W / 7; i++) {
    const x = r() * W, y = floorY + 8 + Math.pow(r(), 0.8) * (H - floorY);
    const k = 0.6 + (y - floorY) / (H - floorY);   // bigger nearer the front
    const rx = (2.5 + r() * 5) * k, ry = rx * (0.55 + r() * 0.25);
    const col = cols[Math.floor(r() * cols.length)];
    g.fillStyle = 'rgba(70,45,20,.25)';
    g.beginPath(); g.ellipse(x + 1.5, y + ry * 0.7, rx, ry * 0.6, 0, 0, TAU); g.fill();
    const pg = g.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 0, x, y, rx * 1.1);
    pg.addColorStop(0, '#fff'); pg.addColorStop(0.25, col); pg.addColorStop(1, mix(col, '#3a2a1a', 0.45));
    g.fillStyle = pg;
    g.beginPath(); g.ellipse(x, y, rx, ry, (r() - 0.5) * 0.6, 0, TAU); g.fill();
  }
  // Soft dark corners
  gr = g.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.8);
  gr.addColorStop(0, 'rgba(0,20,40,0)'); gr.addColorStop(1, 'rgba(0,20,40,.35)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);

  cache = { key, c };
  return c;
}

// Kelp: a swaying stalk with leaves.
function kelp(ctx, x, base, h, t, seed, front) {
  const r = rng(seed);
  const segs = 7;
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const k = i / segs;
    const sway = Math.sin(t * 0.9 + seed + k * 2.2) * 18 * k * k;
    pts.push([x + sway, base - h * k]);
  }
  const dark = front ? '#2f7d3b' : '#2b6f62';
  const light = front ? '#7ccf5a' : '#5fb39a';
  ctx.strokeStyle = dark; ctx.lineWidth = front ? 5 : 4; ctx.lineCap = 'round';
  ctx.beginPath();
  pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)));
  ctx.stroke();
  for (let i = 1; i <= segs; i++) {
    const [a, b] = pts[i];
    const side = i % 2 ? 1 : -1;
    const len = (front ? 30 : 24) * (1.1 - i / segs * 0.5) * (0.8 + r() * 0.4);
    const ang = side * (0.9 + Math.sin(t * 1.3 + i + seed) * 0.15) - Math.PI / 2;
    ctx.save();
    ctx.translate(a, b);
    ctx.rotate(ang + Math.PI / 2);
    const lg = ctx.createLinearGradient(0, 0, 0, -len);
    lg.addColorStop(0, dark); lg.addColorStop(1, light);
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.45, -len * 0.5, 0, -len);
    ctx.quadraticCurveTo(-len * 0.45, -len * 0.5, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

// o = { W, H, top, floorY, t }
export function drawTank(ctx, o) {
  const { W, H, top, floorY, t } = o;
  ctx.drawImage(tankCache(W, H, top, floorY), 0, 0, W, H);

  // Light rays from the top
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const x = W * (0.08 + i * 0.17) + Math.sin(t * 0.25 + i * 1.7) * 40;
    const a = 0.05 + 0.03 * Math.sin(t * 0.6 + i);
    const gr = ctx.createLinearGradient(0, top, 0, floorY);
    gr.addColorStop(0, `rgba(255,255,220,${a})`); gr.addColorStop(1, 'rgba(255,255,220,0)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x - 24, top); ctx.lineTo(x + 24, top);
    ctx.lineTo(x + 130, floorY); ctx.lineTo(x - 20, floorY);
    ctx.fill();
  }
  // Caustics: wobbly light patches on the sand
  const r = rng(5);
  for (let i = 0; i < W / 26; i++) {
    const bx = r() * W, by = floorY + 6 + r() * (H - floorY) * 0.8;
    const x = bx + Math.sin(t * 0.8 + i) * 12, y = by + Math.cos(t * 0.7 + i * 1.3) * 4;
    const rr = 10 + r() * 18;
    ctx.fillStyle = `rgba(255,250,220,${0.06 + 0.05 * Math.sin(t * 1.5 + i * 2)})`;
    ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.35, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();

  // Kelp: back row (blue-green) then front row (bright)
  const n = Math.ceil(W / 170);
  const rr = rng(9);
  for (let i = 0; i < n; i++) kelp(ctx, (i + 0.2 + rr() * 0.6) * 170, floorY + 4, 120 + rr() * 160, t, i * 7 + 1, false);
  for (let i = 0; i < Math.ceil(n / 2); i++) {
    const x = (i + 0.3 + rr() * 0.4) * (W / Math.ceil(n / 2));
    kelp(ctx, x, floorY + 18, 70 + rr() * 70, t, i * 13 + 5, true);
  }

  // Surface: bright shimmering band
  ctx.save();
  const sg = ctx.createLinearGradient(0, 0, 0, top + 14);
  sg.addColorStop(0, 'rgba(230,255,255,.75)'); sg.addColorStop(1, 'rgba(230,255,255,.15)');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let x = 0; x <= W + 16; x += 16) ctx.lineTo(x, top + Math.sin(x * 0.02 + t * 1.4) * 4 + Math.sin(x * 0.05 - t) * 2);
  ctx.lineTo(W, 0); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W + 16; x += 16) { const y = top + Math.sin(x * 0.02 + t * 1.4) * 4 + Math.sin(x * 0.05 - t) * 2; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke();
  ctx.restore();
}

// Glass shine streaks, drawn last (over everything in the tank).
export function drawGlass(ctx, W, H) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,255,255,.05)';
  ctx.beginPath(); ctx.moveTo(W * 0.06, 0); ctx.lineTo(W * 0.16, 0); ctx.lineTo(W * 0.02, H); ctx.lineTo(-W * 0.08, H); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.035)';
  ctx.beginPath(); ctx.moveTo(W * 0.2, 0); ctx.lineTo(W * 0.23, 0); ctx.lineTo(W * 0.09, H); ctx.lineTo(W * 0.06, H); ctx.fill();
  ctx.restore();
}

// Soft shadow on the sand under something floating above it.
export function drawShadow(ctx, x, floorY, w, height) {
  const k = Math.max(0.15, 1 - height / 500);
  ctx.save();
  ctx.fillStyle = `rgba(40,30,20,${0.22 * k})`;
  ctx.beginPath(); ctx.ellipse(x, floorY + 12, w * (1.2 - k * 0.4), 9 * k + 3, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

// Green smudges on the glass when the tank is dirty. Drawn on top of everything.
export function drawAlgae(ctx, W, H, dirt) {
  if (dirt <= 0.02) return;
  const r = rng(11);
  ctx.save();
  for (let i = 0; i < 26; i++) {
    const x = r() * W, y = r() * H, rad = 40 + r() * 90;
    const a = Math.max(0, Math.min(1, dirt * 1.4 - r() * 0.5)) * 0.35;
    if (a <= 0) continue;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(90,140,40,${a})`);
    g.addColorStop(1, 'rgba(90,140,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.restore();
}

// Dark blue overlay with a moon glow when the lights are off.
export function drawNight(ctx, W, H, k) {
  if (k <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(6,10,40,${0.68 * k})`;
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W * 0.8, 40, 0, W * 0.8, 40, Math.max(W, H) * 0.6);
  g.addColorStop(0, `rgba(170,190,255,${0.18 * k})`);
  g.addColorStop(1, 'rgba(170,190,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ---------- Emoji things ----------
export function drawEmoji(ctx, icon, x, y, size, rot = 0, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.globalAlpha *= alpha;
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 0, 0);
  ctx.restore();
}

export function drawPoo(ctx, x, y, s, wob = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (1 + wob * 0.08), s * (1 - wob * 0.08));
  ctx.fillStyle = '#7a4a24';
  ctx.strokeStyle = '#5a3416';
  ctx.lineWidth = 1.5;
  const blob = (cx, cy, rx, ry) => { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke(); };
  blob(0, -4, 16, 8);
  blob(0, -13, 11, 6.5);
  blob(1, -21, 6.5, 5);
  ctx.beginPath();
  ctx.moveTo(1, -25); ctx.quadraticCurveTo(5, -30, 3, -33);
  ctx.stroke();
  // little eyes, it's a happy poo
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-4, -13, 2.4, 0, TAU); ctx.arc(4, -13, 2.4, 0, TAU); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(-4, -12.6, 1.2, 0, TAU); ctx.arc(4, -12.6, 1.2, 0, TAU); ctx.fill();
  ctx.restore();
}

export function drawBubble(ctx, x, y, r, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255,255,255,.85)';
  ctx.fillStyle = 'rgba(255,255,255,.12)';
  ctx.lineWidth = Math.max(1.2, r * 0.12);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------- Egg ----------
export function drawEgg(ctx, x, y, s, col, crack, wob, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 20) * wob * 0.15);
  ctx.scale(s, s);
  // jelly
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.strokeStyle = 'rgba(255,255,255,.8)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, 70, 64, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // curled baby inside
  ctx.fillStyle = col.body;
  ctx.beginPath(); ctx.arc(0, 4, 34, 0.3, TAU - 0.6); ctx.lineWidth = 22; ctx.strokeStyle = col.body; ctx.stroke();
  ctx.beginPath(); ctx.arc(26, -14, 20, 0, TAU); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(22, -18, 3, 0, TAU); ctx.arc(34, -16, 3, 0, TAU); ctx.fill();
  ctx.strokeStyle = col.gill; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(12, -24 + i * 6); ctx.lineTo(2 - i * 2, -36 + i * 7); ctx.stroke();
  }
  // shine
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.beginPath(); ctx.ellipse(-36, -30, 10, 16, 0.6, 0, TAU); ctx.fill();
  // cracks
  ctx.strokeStyle = 'rgba(255,255,255,.95)';
  ctx.lineWidth = 3;
  const cracks = [
    [[-60, -10], [-40, -2], [-30, -18], [-14, -6]],
    [[50, -30], [36, -18], [46, -4], [30, 6]],
    [[-20, 50], [-8, 34], [8, 44], [18, 30]],
    [[-66, 20], [-44, 24], [-36, 10]],
  ];
  for (let i = 0; i < Math.min(crack, cracks.length); i++) {
    ctx.beginPath();
    cracks[i].forEach(([a, b], j) => (j ? ctx.lineTo(a, b) : ctx.moveTo(a, b)));
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- The axolotl ----------
// a = { col, dir (1 right, -1 left), t, swim (0..1), face, blink, wear: {hat,face,neck} (icons), sick }
// face: joy ok hungry sleepy sleep sick sad giggle eat yuck wow
const SPECKS = (() => { const r = rng(42); return Array.from({ length: 26 }, () => [r(), r(), r()]); })();

export function drawAxolotl(ctx, x, y, s, a) {
  const { col, dir, t } = a;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * dir, s);
  const sick = a.sick ? 0.35 : 0;
  const body = sick ? mix(col.body, '#b6d98a', sick) : col.body;
  const belly = sick ? mix(col.belly, '#d9efb8', sick) : col.belly;
  const hi = mix(body, '#ffffff', 0.5);
  const lo = mix(body, col.dark, 0.7);
  const line = mix(col.dark, '#000000', 0.15);
  // Top-lit shading: light on top, darker underneath.
  const shade = (y0, y1) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, hi); g.addColorStop(0.45, body); g.addColorStop(1, lo);
    return g;
  };
  ctx.lineJoin = 'round';
  const W = a.wear || {};
  const back = W.back && ITEMS[W.back] ? ITEMS[W.back].drawn : null;
  if (back === 'balloon') drawBalloonBack(ctx, t);
  if (back === 'cape') drawCape(ctx, t, a.swim);
  if (back === 'wings') drawWings(ctx, t, false);

  // ---- Body: one smooth, bendy shape along a wavy spine (neck -> tail tip) ----
  const N = 26;
  const f = 3 + a.swim * 5, amp = 3 + a.swim * 9;
  const sp = [];
  for (let i = 0; i <= N; i++) {
    const k = i / N;
    sp.push({ k, x: 8 - k * 142, y: 4 + Math.sin(t * f - k * 3.2) * amp * Math.pow(k, 1.3) });
  }
  sp.forEach((p, i) => {
    const q = sp[Math.max(0, i - 1)], r = sp[Math.min(N, i + 1)];
    const dx = r.x - q.x, dy = r.y - q.y, l = Math.hypot(dx, dy) || 1;
    p.nx = dy / l; p.ny = -dx / l;            // points "up" from the spine
    if (p.ny > 0) { p.nx = -p.nx; p.ny = -p.ny; }
    p.w = (p.k < 0.3 ? 21 + p.k * 10 : 24 * Math.pow(1 - (p.k - 0.3) / 0.7, 1.1)) + 1;
  });
  const at = (p, d) => [p.x + p.nx * d, p.y + p.ny * d];
  const smooth = (path, pts, start) => {
    if (start) path.moveTo(...pts[0]); else path.lineTo(...pts[0]);
    for (let i = 1; i < pts.length - 1; i++) {
      const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      path.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
    }
    path.lineTo(...pts[pts.length - 1]);
  };
  // Fins (behind the body): a see-through frill along the top and under the tail
  const finH = (k, k0, hmax) => (k <= k0 ? 0 : hmax * Math.pow(Math.sin(Math.PI * (k - k0) / (1 - k0 + 0.02)), 0.8));
  const fin = (k0, hmax, side) => {
    const ps = sp.filter(p => p.k >= k0 - 0.04);
    const outer = ps.map(p => at(p, side * (p.w + finH(p.k, k0, hmax))));
    const inner = ps.map(p => at(p, side * (p.w - 3))).reverse();
    const path = new Path2D();
    smooth(path, outer, true); smooth(path, inner, false); path.closePath();
    const g = ctx.createLinearGradient(0, -40 * side, 0, 0);
    g.addColorStop(0, mix(body, '#ffffff', 0.35)); g.addColorStop(0.6, mix(body, col.gill, 0.12)); g.addColorStop(1, body);
    ctx.save();
    ctx.globalAlpha = 0.75; ctx.fillStyle = g; ctx.fill(path);
    ctx.globalAlpha = 0.35; ctx.strokeStyle = line; ctx.lineWidth = 1.2; ctx.stroke(path);
    ctx.globalAlpha = 0.18; ctx.lineWidth = 1;
    ps.forEach((p, i) => { if (i % 2) return; const h = finH(p.k, k0, hmax); if (h < 3) return; ctx.beginPath(); ctx.moveTo(...at(p, side * p.w)); ctx.lineTo(...at(p, side * (p.w + h - 1))); ctx.stroke(); });
    ctx.restore();
  };
  fin(0.16, 18, 1);
  fin(0.5, 13, -1);

  // Legs: arm + 4 splayed fingers (paddle when swimming)
  const leg = (p, ph, far) => {
    const [lx, ly] = at(p, -p.w * 0.55);
    const k = Math.sin(t * 8 + ph) * a.swim * 0.6;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(0.55 + k);
    ctx.globalAlpha = far ? 0.8 : 1;
    const g = ctx.createLinearGradient(0, 0, 0, 24);
    g.addColorStop(0, far ? lo : body); g.addColorStop(1, far ? mix(lo, '#000', 0.15) : lo);
    ctx.fillStyle = g; ctx.strokeStyle = line; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-7, 12, -3, 18); ctx.lineTo(4, 18); ctx.quadraticCurveTo(7, 10, 6, 0); ctx.closePath();
    ctx.fill(); ctx.globalAlpha *= 0.6; ctx.stroke(); ctx.globalAlpha = far ? 0.8 : 1;
    for (let i = 0; i < 4; i++) {
      const ang = -0.75 + i * 0.5;
      ctx.save();
      ctx.translate(0.5, 17); ctx.rotate(ang);
      ctx.beginPath(); ctx.ellipse(0, 4.5, 2, 5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = far ? lo : hi;
      ctx.beginPath(); ctx.arc(0, 8.6, 1.6, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.fillStyle = g;
    }
    ctx.restore();
  };
  leg(sp[2], 0, true); leg(sp[10], 1, true);

  // The body itself
  const tops = sp.map(p => at(p, p.w)), bots = sp.map(p => at(p, -p.w)).reverse();
  const bodyPath = new Path2D();
  smooth(bodyPath, tops, true); smooth(bodyPath, bots, false); bodyPath.closePath();
  ctx.save();
  ctx.shadowColor = 'rgba(0,30,60,.28)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
  ctx.fillStyle = shade(-26, 28);
  ctx.fill(bodyPath);
  ctx.restore();
  ctx.save();
  ctx.clip(bodyPath);
  // belly glow underneath
  const bg = ctx.createLinearGradient(0, 4, 0, 28);
  bg.addColorStop(0, 'rgba(255,255,255,0)'); bg.addColorStop(1, belly);
  ctx.fillStyle = bg; ctx.globalAlpha = 0.9; ctx.fillRect(-170, 4, 200, 30);
  // soft inner glow (looks squishy)
  const ig = ctx.createRadialGradient(-30, -6, 4, -30, -6, 60);
  ig.addColorStop(0, 'rgba(255,255,255,.28)'); ig.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.globalAlpha = 1; ctx.fillStyle = ig; ctx.fillRect(-170, -40, 200, 80);
  // little grooves along the side
  ctx.strokeStyle = lo; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.28;
  for (let i = 1; i <= 8; i++) {
    const p = sp[i];
    ctx.beginPath(); ctx.moveTo(...at(p, p.w * 0.35)); ctx.quadraticCurveTo(...at({ ...p, x: p.x - 3 }, -p.w * 0.1), ...at(p, -p.w * 0.6)); ctx.stroke();
  }
  // speckles
  ctx.fillStyle = col.spots ? col.dark : lo;
  for (const [u, v, w] of SPECKS) {
    const p = sp[Math.floor(u * N * 0.8)];
    const [sx, sy] = at(p, (v - 0.5) * p.w * 1.6);
    ctx.globalAlpha = col.spots ? 0.8 : 0.22;
    ctx.beginPath(); ctx.arc(sx, sy, col.spots ? 2 + w * 3 : 0.8 + w * 1.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
  if (a.pattern) drawPattern(ctx, a.pattern, col, t, bodyPath);
  // shine along the back + outline
  ctx.save();
  const rim = new Path2D(); smooth(rim, sp.slice(1, Math.floor(N * 0.75)).map(p => at(p, p.w - 4)), true);
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke(rim);
  ctx.globalAlpha = 0.45; ctx.strokeStyle = line; ctx.lineWidth = 1.8; ctx.stroke(bodyPath);
  ctx.restore();

  if (W.back && ITEMS[W.back] && (back === 'backpack' || !back)) unflipEmoji(ctx, a.dir, ITEMS[W.back].icon, -26, -20, 38);
  if (back === 'wings') drawWings(ctx, t, true);
  leg(sp[1], 2.5, false); leg(sp[9], 1.6, false);

  // Gills: 3 feathery branches each side of the head
  const gill = (bx, by, ang, len, i, far) => {
    const sway = Math.sin(t * 2.4 + i) * 0.12 + a.swim * 0.15;
    const A = ang - sway * Math.sign(Math.cos(ang) || 1);
    const ex = bx + Math.cos(A) * len, ey = by + Math.sin(A) * len;
    const cx = bx + Math.cos(A + 0.35) * len * 0.55, cy = by + Math.sin(A + 0.35) * len * 0.55;
    const P = k => [
      (1 - k) * (1 - k) * bx + 2 * (1 - k) * k * cx + k * k * ex,
      (1 - k) * (1 - k) * by + 2 * (1 - k) * k * cy + k * k * ey,
    ];
    const gc = far ? mix(col.gill, col.dark, 0.35) : col.gill;
    ctx.lineCap = 'round';
    // feathery filaments, lighter at the tips
    for (let k = 0.2; k <= 1.001; k += 0.07) {
      const [px, py] = P(k);
      const [qx, qy] = P(Math.min(1, k + 0.02));
      const tx = qx - px, ty = qy - py, tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl;
      const fl = (9 + ((k * 40) % 2) * 2) * (1.15 - k * 0.6) + Math.sin(t * 5 + k * 9 + i) * 0.8;
      for (const sd of [-1, 1]) {
        const ex2 = px + nx * fl * sd + tx / tl * 2, ey2 = py + ny * fl * sd + ty / tl * 2;
        const lg = ctx.createLinearGradient(px, py, ex2, ey2);
        lg.addColorStop(0, gc); lg.addColorStop(1, mix(gc, '#ffffff', 0.45));
        ctx.strokeStyle = lg; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex2, ey2); ctx.stroke();
      }
    }
    // stalk (thick at the base)
    const gg = ctx.createLinearGradient(bx, by, ex, ey);
    gg.addColorStop(0, mix(gc, col.dark, 0.35)); gg.addColorStop(1, mix(gc, '#ffffff', 0.2));
    ctx.strokeStyle = gg;
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(cx, cy, ...P(0.5)); ctx.stroke();
    ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(...P(0.45)); ctx.quadraticCurveTo(...P(0.75), ex, ey); ctx.stroke();
  };
  // ---- Head: broad, flat and smooth, flowing out of the body (side-on, facing right) ----
  const headPath = new Path2D();
  headPath.moveTo(-6, -19);
  headPath.bezierCurveTo(12, -33, 46, -36, 64, -27);   // top of the head
  headPath.bezierCurveTo(80, -19, 86, -3, 81, 9);      // round snout
  headPath.bezierCurveTo(76, 21, 56, 28, 32, 27);      // jaw
  headPath.bezierCurveTo(14, 27, 0, 24, -8, 20);       // throat into the body
  headPath.closePath();
  const outlineHead = new Path2D();                    // the visible edge (not the neck side)
  outlineHead.moveTo(4, -26);
  outlineHead.bezierCurveTo(20, -34, 46, -36, 64, -27);
  outlineHead.bezierCurveTo(80, -19, 86, -3, 81, 9);
  outlineHead.bezierCurveTo(76, 21, 56, 28, 32, 27);
  outlineHead.bezierCurveTo(20, 27, 10, 26, 2, 23);

  // gills on the far side peek out over the top of the head
  [[26, -28, -1.62, 30], [19, -25, -1.98, 32], [12, -21, -2.34, 30]].forEach(([bx, by, ang, len], i) => gill(bx, by, ang, len, i, true));

  ctx.save();
  ctx.shadowColor = 'rgba(0,30,60,.22)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
  ctx.fillStyle = rad2(ctx, 38, -18, 4, 30, 0, 66, [[0, hi], [0.5, body], [1, lo]]);
  ctx.fill(headPath);
  ctx.restore();
  ctx.save();
  ctx.clip(headPath);
  // pale throat and lower lip
  const tg = ctx.createLinearGradient(0, 6, 0, 30);
  tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, belly);
  ctx.fillStyle = tg; ctx.fillRect(-10, 6, 100, 26);
  // soft shade where the head meets the body
  const ng = ctx.createLinearGradient(-8, 0, 18, 0);
  ng.addColorStop(0, mix(lo, body, 0.3)); ng.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.35; ctx.fillStyle = ng; ctx.fillRect(-10, -40, 30, 70); ctx.globalAlpha = 1;
  // speckles
  ctx.fillStyle = col.spots ? col.dark : lo;
  for (const [u, v, w] of SPECKS.slice(0, 14)) {
    ctx.globalAlpha = col.spots ? 0.7 : 0.18;
    ctx.beginPath(); ctx.arc(6 + u * 64, -28 + v * 22, col.spots ? 1.5 + w * 2 : 0.7 + w, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (a.pattern) drawPattern(ctx, a.pattern, col, t, bodyPath, headPath);
  ctx.restore();
  // wet shine on top of the head + rim light
  const sh = ctx.createRadialGradient(40, -26, 0, 40, -26, 24);
  sh.addColorStop(0, 'rgba(255,255,255,.7)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh;
  ctx.beginPath(); ctx.ellipse(40, -25, 24, 6, -0.08, 0, TAU); ctx.fill();
  ctx.strokeStyle = line; ctx.lineWidth = 1.8; ctx.globalAlpha = 0.45; ctx.stroke(outlineHead); ctx.globalAlpha = 1;
  // nostril
  ctx.fillStyle = lo; ctx.globalAlpha = 0.55;
  ctx.beginPath(); ctx.ellipse(79, -6, 1.3, 1.8, 0.3, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  // blush under the eye
  const ck = a.sick ? 'rgba(120,170,60,' : 'rgba(255,95,135,';
  const cg = ctx.createRadialGradient(54, 6, 0, 54, 6, 11);
  cg.addColorStop(0, ck + '.42)'); cg.addColorStop(1, ck + '0)');
  ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(54, 6, 11, 7, 0, 0, TAU); ctx.fill();

  ctx.save(); ctx.clip(headPath);
  drawFace(ctx, a, { body, lo });
  ctx.restore();

  // near-side gills, sprouting from the back of the head
  [[19, -18, -1.9, 38], [13, -6, -2.55, 36], [12, 7, -3.15, 31]].forEach(([bx, by, ang, len], i) => gill(bx, by, ang, len, i + 3, false));

  // Clothes
  const neck = W.neck && ITEMS[W.neck];
  if (neck) {
    ctx.save(); ctx.translate(-12, -4);
    if (neck.drawn === 'scarf') drawScarf(ctx);
    else if (neck.drawn === 'bowtie') drawBowtie(ctx);
    else if (neck.drawn === 'pearls') drawPearls(ctx);
    else if (neck.drawn === 'medal') { drawRibbon(ctx); unflipEmoji(ctx, dir, '🏅', 30, 38, 26); }
    else unflipEmoji(ctx, dir, neck.icon, 30, 30, 28);
    ctx.restore();
  }
  const face = W.face && ITEMS[W.face];
  if (face) {
    if (face.drawn === 'hearts') drawSpecs(ctx, 'heart');
    else if (face.drawn === 'stars') drawSpecs(ctx, 'star');
    else unflipEmoji(ctx, dir, face.icon, 62, -11, 46);
  }
  const hat = W.hat && ITEMS[W.hat];
  if (hat) {
    if (hat.drawn === 'party') drawPartyHat(ctx, 40, -32);
    else unflipEmoji(ctx, dir, hat.icon, 40, -46, 46);
  }
  ctx.restore();
}

// ---------- Clothes (drawn in the axolotl's own coordinates, facing right) ----------
function drawScarf(ctx) {
  ctx.save();
  ctx.fillStyle = '#e53935';
  ctx.beginPath(); ctx.ellipse(28, 27, 36, 8, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#ffeb3b';
  for (let i = -2; i <= 2; i++) ctx.fillRect(22 + i * 13, 21, 5, 12);
  ctx.fillStyle = '#e53935';
  ctx.beginPath(); ctx.moveTo(4, 26); ctx.lineTo(-6, 52); ctx.lineTo(8, 50); ctx.lineTo(14, 28); ctx.fill();
  ctx.restore();
}
function drawBowtie(ctx) {
  ctx.save();
  ctx.translate(30, 29);
  ctx.fillStyle = '#7c4dff'; ctx.strokeStyle = '#4a2ab0'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -9); ctx.lineTo(-16, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -9); ctx.lineTo(16, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#b39dff';
  ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function drawPearls(ctx) {
  ctx.save();
  for (let i = 0; i <= 10; i++) {
    const k = i / 10, x = 4 + k * 52, y = 22 + Math.sin(k * Math.PI) * 9;
    const g = ctx.createRadialGradient(x - 1.5, y - 1.5, 0, x, y, 4);
    g.addColorStop(0, '#fff'); g.addColorStop(1, '#d9cfe8');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 3.6, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
function drawRibbon(ctx) {
  ctx.save();
  ctx.fillStyle = '#1e88e5';
  ctx.beginPath(); ctx.moveTo(14, 20); ctx.lineTo(22, 20); ctx.lineTo(32, 34); ctx.lineTo(26, 36); ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.beginPath(); ctx.moveTo(46, 20); ctx.lineTo(38, 20); ctx.lineTo(28, 34); ctx.lineTo(34, 36); ctx.fill();
  ctx.restore();
}
function heartPath(ctx, x, y, r) {
  ctx.moveTo(x, y + r * 0.9);
  ctx.bezierCurveTo(x - r * 1.5, y - r * 0.1, x - r * 0.8, y - r * 1.3, x, y - r * 0.45);
  ctx.bezierCurveTo(x + r * 0.8, y - r * 1.3, x + r * 1.5, y - r * 0.1, x, y + r * 0.9);
}
function starPath(ctx, x, y, r) {
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
    i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
}
function drawSpecs(ctx, kind) {
  ctx.save();
  const col = kind === 'heart' ? '#ff4081' : '#ffc107';
  ctx.fillStyle = kind === 'heart' ? 'rgba(255,128,171,.55)' : 'rgba(255,224,130,.55)';
  ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  for (const [x, y, r] of [[74, -13, 7.5], [55, -9, 11]]) {
    ctx.beginPath();
    kind === 'heart' ? heartPath(ctx, x, y, r) : starPath(ctx, x, y, r * 1.2);
    ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(64, -12); ctx.lineTo(68, -13); ctx.stroke();
  ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(44, -10); ctx.lineTo(14, -12); ctx.stroke();
  ctx.restore();
}
function drawCape(ctx, t, swim) {
  ctx.save();
  const w = Math.sin(t * 5) * (4 + swim * 6);
  const g = ctx.createLinearGradient(0, -20, -90, 20);
  g.addColorStop(0, '#e53935'); g.addColorStop(1, '#b71c1c');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(14, -22);
  ctx.quadraticCurveTo(-30, -40 + w, -92, -14 + w * 1.5);
  ctx.lineTo(-84, 8 + w);
  ctx.quadraticCurveTo(-40, -2, 10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath(); ctx.arc(12, -14, 5, 0, TAU); ctx.fill();
  ctx.restore();
}
function drawWings(ctx, t, front) {
  ctx.save();
  const flap = Math.sin(t * 9) * 0.25;
  ctx.translate(-22, -20);
  ctx.globalAlpha = front ? 0.55 : 0.4;
  for (const [ang, len] of front ? [[-1.9, 40], [-2.6, 30]] : [[-1.6, 36], [-2.3, 26]]) {
    ctx.save();
    ctx.rotate(ang + flap);
    const g = ctx.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, '#e1f5fe'); g.addColorStop(1, '#f8bbd0');
    ctx.fillStyle = g; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(len / 2, 0, len / 2, len / 4, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function drawBalloonBack(ctx, t) {
  ctx.save();
  const sx = Math.sin(t * 1.5) * 6;
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-26, -18); ctx.quadraticCurveTo(-34 + sx, -60, -40 + sx, -96); ctx.stroke();
  const g = ctx.createRadialGradient(-46 + sx, -126, 2, -40 + sx, -118, 24);
  g.addColorStop(0, '#ff8a80'); g.addColorStop(1, '#e53935');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(-40 + sx, -118, 18, 22, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-43 + sx, -95); ctx.lineTo(-37 + sx, -95); ctx.lineTo(-40 + sx, -99); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.beginPath(); ctx.ellipse(-46 + sx, -126, 4, 7, 0.4, 0, TAU); ctx.fill();
  ctx.restore();
}

// Patterns on the body and head (clipped to them).
const PAT_R = (() => { const r = rng(77); return Array.from({ length: 36 }, () => [r(), r(), r()]); })();
function drawPattern(ctx, id, col, t, bodyPath, headPath) {
  ctx.save();
  ctx.clip(headPath || bodyPath);
  const pts = PAT_R.map(([u, v, w]) => [-110 + u * 180, -34 + v * 58, w]);
  if (id === 'spots') {
    ctx.fillStyle = mix(col.gill, col.dark, 0.3); ctx.globalAlpha = 0.45;
    for (const [x, y, w] of pts) { if (x > 38 && x < 90 && y > -24 && y < 22) continue; ctx.beginPath(); ctx.arc(x, y, 3 + w * 4, 0, TAU); ctx.fill(); }
  } else if (id === 'stripes') {
    ctx.strokeStyle = mix(col.gill, col.dark, 0.2); ctx.globalAlpha = 0.4; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let x = -120; x < 0; x += 14) { ctx.beginPath(); ctx.moveTo(x, -26); ctx.quadraticCurveTo(x - 6, 2, x, 26); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(14, -34); ctx.quadraticCurveTo(30, -38, 46, -34); ctx.stroke();
  } else if (id === 'hearts' || id === 'stars') {
    ctx.fillStyle = id === 'hearts' ? '#ff4f86' : '#ffc107'; ctx.globalAlpha = 0.6;
    for (const [x, y, w] of pts) {
      if (x > 38 && x < 90 && y > -24 && y < 22) continue;
      ctx.beginPath(); id === 'hearts' ? heartPath(ctx, x, y, 3 + w * 2.5) : starPath(ctx, x, y, 3.5 + w * 3); ctx.fill();
    }
  } else if (id === 'sparkle') {
    ctx.fillStyle = '#fff';
    pts.forEach(([x, y, w], i) => {
      ctx.globalAlpha = Math.max(0, Math.sin(t * 3 + i * 1.7)) * 0.9;
      ctx.beginPath(); starPath(ctx, x, y, 2.5 + w * 3); ctx.fill();
    });
  } else if (id === 'zigzag') {
    ctx.strokeStyle = '#ffd400'; ctx.globalAlpha = 0.6; ctx.lineWidth = 4; ctx.lineJoin = 'round';
    for (const y0 of [-12, 6]) {
      ctx.beginPath();
      for (let x = -70, k = 0; x <= 2; x += 9, k++) (k ? ctx.lineTo(x, y0 + (k % 2 ? -6 : 6)) : ctx.moveTo(x, y0));
      ctx.stroke();
    }
  } else if (id === 'leopard') {
    ctx.strokeStyle = mix(col.dark, '#3b2410', 0.5); ctx.lineWidth = 2.5; ctx.globalAlpha = 0.55;
    for (const [x, y, w] of pts) {
      if (x > 38 && x < 90 && y > -24 && y < 22) continue;
      ctx.beginPath(); ctx.arc(x, y, 3 + w * 3, 0.4, TAU - 0.6); ctx.stroke();
    }
  } else if (id === 'galaxy') {
    const g = ctx.createLinearGradient(-160, -30, 76, 30);
    g.addColorStop(0, '#2a1b5c'); g.addColorStop(0.5, '#5b2a86'); g.addColorStop(1, '#1b3a6b');
    ctx.fillStyle = g; ctx.globalAlpha = 0.5;
    ctx.fillRect(-175, -45, 260, 90);
    ctx.fillStyle = '#fff';
    pts.forEach(([x, y, w], i) => {
      if (x > 38 && x < 90 && y > -24 && y < 22) return;
      ctx.globalAlpha = 0.5 + 0.5 * Math.max(0, Math.sin(t * 2 + i));
      ctx.beginPath(); ctx.arc(x, y, 0.8 + w * 1.4, 0, TAU); ctx.fill();
    });
  } else if (id === 'rainbow') {
    const g = ctx.createLinearGradient(-160, 0, 76, 0);
    ['#ff5252', '#ffab40', '#ffee58', '#69f0ae', '#40c4ff', '#b388ff'].forEach((c, i) => g.addColorStop(i / 5, c));
    ctx.fillStyle = g; ctx.globalAlpha = 0.38;
    ctx.fillRect(-175, -45, 260, 90);
  }
  ctx.restore();
}

function unflipEmoji(ctx, dir, icon, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  drawEmoji(ctx, icon, 0, 0, size);
  ctx.restore();
}

function drawPartyHat(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.15);
  ctx.fillStyle = '#7c4dff';
  ctx.beginPath(); ctx.moveTo(-18, 4); ctx.lineTo(0, -40); ctx.lineTo(18, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffd54f';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-6 + i * 6, -6 - i * 10, 3, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#ff4081';
  ctx.beginPath(); ctx.arc(0, -42, 6, 0, TAU); ctx.fill();
  ctx.restore();
}

// Face, side-on: one big glossy eye near us, the far eye peeking past the snout, and the long axolotl smile.
const EYE = { x: 55, y: -9, r: 7.6 }, EYE2 = { x: 74, y: -13, r: 5.2 };
function eyeOpen(ctx, e, look, lid, lidCol) {
  ctx.save();
  // socket shadow
  ctx.fillStyle = 'rgba(0,0,0,.12)';
  ctx.beginPath(); ctx.ellipse(e.x, e.y + 1, e.r + 2, e.r + 1.6, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(e.x - e.r * 0.3, e.y - e.r * 0.3, 0, e.x, e.y, e.r);
  g.addColorStop(0, '#4b3f63'); g.addColorStop(0.55, '#1a1526'); g.addColorStop(1, '#07060c');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, TAU); ctx.fill();
  // iris ring glint
  ctx.strokeStyle = 'rgba(160,140,220,.35)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(e.x + look, e.y + 0.5, e.r * 0.62, 0.2, Math.PI - 0.2); ctx.stroke();
  // highlights
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(e.x - e.r * 0.32 + look * 0.3, e.y - e.r * 0.38, e.r * 0.36, e.r * 0.3, -0.5, 0, TAU); ctx.fill();
  ctx.globalAlpha = 0.8;
  ctx.beginPath(); ctx.arc(e.x + e.r * 0.38, e.y + e.r * 0.36, e.r * 0.14, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  if (lid > 0) { // eyelid coming down (sleepy / poorly)
    ctx.fillStyle = lidCol;
    ctx.beginPath(); ctx.rect(e.x - e.r - 2, e.y - e.r - 2, e.r * 2 + 4, (e.r * 2 + 2) * lid); ctx.fill();
    ctx.strokeStyle = 'rgba(30,20,30,.55)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(e.x - e.r, e.y - e.r - 1 + (e.r * 2 + 2) * lid); ctx.lineTo(e.x + e.r, e.y - e.r - 1 + (e.r * 2 + 2) * lid); ctx.stroke();
  }
  ctx.restore();
}
function eyeClosed(ctx, e, happy) {
  ctx.save();
  ctx.strokeStyle = '#2a2033'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath();
  if (happy) ctx.arc(e.x, e.y + e.r * 0.5, e.r * 0.9, Math.PI * 1.15, Math.PI * 1.85);   // smiling eyes ◠
  else ctx.arc(e.x, e.y - e.r * 0.4, e.r * 0.9, Math.PI * 0.15, Math.PI * 0.85);       // sleeping ◡
  ctx.stroke();
  // lashes
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(e.x + e.r * 0.8, e.y + (happy ? -e.r * 0.05 : e.r * 0.1)); ctx.lineTo(e.x + e.r * 1.15, e.y + (happy ? -e.r * 0.35 : e.r * 0.35)); ctx.stroke();
  ctx.restore();
}

function drawFace(ctx, a, c) {
  const f = a.face;
  const happyShut = f === 'giggle';
  const shut = f === 'sleep' || happyShut || a.blink;
  const lid = f === 'sleepy' ? 0.45 : f === 'sick' ? 0.35 : 0;
  const look = f === 'wow' || f === 'hungry' ? 0.8 : 0;
  // far eye first (smaller, partly round the snout)
  if (shut) eyeClosed(ctx, EYE2, happyShut); else eyeOpen(ctx, EYE2, look, lid, c.body);
  if (shut) eyeClosed(ctx, EYE, happyShut); else eyeOpen(ctx, EYE, look, lid, c.body);
  if (f === 'sad' || f === 'yuck') {
    ctx.strokeStyle = 'rgba(40,25,35,.7)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(EYE.x - 7, EYE.y - 10); ctx.quadraticCurveTo(EYE.x, EYE.y - 13, EYE.x + 7, EYE.y - 13); ctx.stroke();
  }

  // Mouth: runs from the tip of the snout back under the eye
  const lip = '#7a3346';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const front = [81, 9];
  if (f === 'eat' || f === 'giggle') {
    const o = f === 'eat' ? 3 + Math.abs(Math.sin(a.t * 14)) * 7 : 6;
    ctx.fillStyle = '#8c2f48';
    ctx.beginPath();
    ctx.moveTo(...front);
    ctx.quadraticCurveTo(64, 15, 44, 9);
    ctx.quadraticCurveTo(60, 18 + o * 1.4, 79, 12 + o * 0.4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff8fa8';                                    // tongue
    ctx.beginPath(); ctx.ellipse(64, 14 + o * 0.7, 9, Math.max(2, o * 0.45), 0.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = lip; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...front); ctx.quadraticCurveTo(64, 15, 44, 9); ctx.stroke();
  } else if (f === 'hungry' || f === 'wow') {
    ctx.strokeStyle = lip; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...front); ctx.quadraticCurveTo(66, 15, 50, 13); ctx.stroke();
    ctx.fillStyle = '#8c2f48';
    ctx.beginPath(); ctx.ellipse(74, 14, 4, 4.5, 0, 0, TAU); ctx.fill();
  } else if (f === 'sad' || f === 'yuck') {
    ctx.strokeStyle = lip; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...front); ctx.quadraticCurveTo(64, 10, 46, 17); ctx.stroke();
  } else if (f === 'sick') {
    ctx.strokeStyle = lip; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(...front);
    for (let i = 1; i <= 6; i++) ctx.lineTo(81 - i * 6, 11 + (i % 2 ? 3 : -1));
    ctx.stroke();
  } else if (f === 'sleep') {
    ctx.strokeStyle = lip; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(...front); ctx.quadraticCurveTo(66, 13, 50, 11); ctx.stroke();
  } else {
    // the classic axolotl smile: long, curling up at the back
    const big = f === 'joy' ? 1 : 0;
    ctx.strokeStyle = lip; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(...front); ctx.quadraticCurveTo(64, 16 + big * 2, 44 - big * 2, 7 - big); ctx.stroke();
    ctx.lineWidth = 1.6;  // dimple
    ctx.beginPath(); ctx.arc(44 - big * 2, 9 - big, 2.6, Math.PI * 0.9, Math.PI * 1.6); ctx.stroke();
  }
}

// Speech bubble with an emoji in it.
export function drawSay(ctx, x, y, icon, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(x, y, 34, 28, 0, 0, TAU);
  ctx.moveTo(x - 12, y + 22); ctx.lineTo(x - 22, y + 40); ctx.lineTo(x, y + 26);
  ctx.fill();
  drawEmoji(ctx, icon, x, y + 1, 32);
  ctx.restore();
}

// Birthday cake with candles.
export function drawCake(ctx, x, y, s, candles, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#ffb3c6';
  ctx.beginPath(); ctx.roundRect(-70, -40, 140, 50, 12); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.roundRect(-74, -46, 148, 16, 8); ctx.fill();
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i * 20, -30, 7, 0, Math.PI); ctx.fill(); }
  ctx.fillStyle = '#8d5a3c';
  ctx.fillRect(-80, 10, 160, 8);
  const n = Math.min(candles, 10);
  for (let i = 0; i < n; i++) {
    const cx = (i - (n - 1) / 2) * 13;
    ctx.fillStyle = ['#42a5f5', '#ffca28', '#66bb6a', '#ab47bc'][i % 4];
    ctx.fillRect(cx - 3, -70, 6, 24);
    ctx.fillStyle = '#ffb300';
    ctx.beginPath(); ctx.ellipse(cx, -78 + Math.sin(t * 12 + i) * 1.2, 4, 7, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.ellipse(cx, -76, 2, 3.5, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
