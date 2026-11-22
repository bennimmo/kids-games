// Axie Pals – drawing: the tank, the axolotl, the egg, poo and things.
// Everything is drawn on one 2D canvas. Sizes are in CSS pixels.

const TAU = Math.PI * 2;

// Little seeded random so pebbles and weeds stay in the same place every frame.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const mix = (a, b, t) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
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
  const wave = Math.sin(t * (4 + a.swim * 6)) * (4 + a.swim * 8);
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

  // Tail: a long see-through fin with a fleshy middle
  const tailY = k => Math.sin(t * (4 + a.swim * 6) - k * 2.5) * (4 + a.swim * 8) * k;
  ctx.fillStyle = mix(body, '#ffffff', 0.25);
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.moveTo(-20, -24);
  ctx.bezierCurveTo(-60, -34, -110, -26 + tailY(0.7), -146, tailY(1));
  ctx.bezierCurveTo(-110, 26 + tailY(0.7), -64, 30, -36, 18);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = line; ctx.lineWidth = 1.5;
  ctx.stroke();
  // fin lines
  ctx.globalAlpha = 0.18; ctx.lineWidth = 1.2;
  for (let i = 0; i < 9; i++) {
    const k = 0.25 + i * 0.08, xx = -40 - k * 100;
    ctx.beginPath(); ctx.moveTo(xx, tailY(k) - 4); ctx.lineTo(xx - 8, tailY(k) - 20 + k * 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(xx, tailY(k) + 4); ctx.lineTo(xx - 8, tailY(k) + 18 - k * 8); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // fleshy tail middle
  ctx.fillStyle = shade(-14, 14);
  ctx.beginPath();
  ctx.moveTo(-40, -15);
  ctx.quadraticCurveTo(-95, -8 + tailY(0.6), -140, tailY(1));
  ctx.quadraticCurveTo(-95, 8 + tailY(0.6), -40, 15);
  ctx.closePath();
  ctx.fill();

  // Legs: little arms with 4 fingers (paddle when swimming)
  const leg = (lx, ly, ph, back) => {
    const k = Math.sin(t * 8 + ph) * a.swim * 0.6;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(0.6 + k);
    ctx.fillStyle = back ? lo : shade(0, 22);
    ctx.strokeStyle = line; ctx.lineWidth = 1.5; ctx.globalAlpha = back ? 0.85 : 1;
    ctx.beginPath(); ctx.ellipse(0, 9, 5.5, 12, 0, 0, TAU); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const ang = -0.6 + i * 0.4;
      ctx.beginPath(); ctx.ellipse(Math.sin(ang) * 7, 20 + Math.cos(ang) * 3, 2.2, 4.5, -ang, 0, TAU); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  };
  leg(-50, 12, 1, true); leg(4, 14, 0, true);

  // Back fin ridge (dorsal crest) from behind the head down the back
  ctx.fillStyle = mix(body, '#ffffff', 0.3);
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(4, -20);
  ctx.quadraticCurveTo(-30, -36, -50, -26);
  ctx.lineTo(-30, -18);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Body
  ctx.fillStyle = shade(-24, 26);
  ctx.strokeStyle = line; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(-18, 2, 52, 23, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
  // belly
  ctx.fillStyle = belly; ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.ellipse(-14, 13, 40, 9, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  // ribs (little grooves along the side)
  ctx.strokeStyle = lo; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.35;
  for (let i = 0; i < 7; i++) {
    const xx = -52 + i * 9;
    ctx.beginPath(); ctx.moveTo(xx, -6); ctx.quadraticCurveTo(xx - 3, 4, xx, 12); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // shine along the back
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.beginPath(); ctx.ellipse(-24, -14, 28, 4, -0.05, 0, TAU); ctx.fill();
  // speckles
  ctx.fillStyle = col.spots ? col.dark : lo;
  for (const [u, v, w] of SPECKS) {
    const sx = -66 + u * 80, sy = -16 + v * 22;
    ctx.globalAlpha = col.spots ? 0.8 : 0.22;
    ctx.beginPath(); ctx.arc(sx, sy, col.spots ? 2 + w * 3 : 0.8 + w * 1.2, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  leg(-38, 16, 2.5, false); leg(16, 18, 1.6, false);

  // Gills: 3 feathery branches each side of the head
  const gill = (bx, by, ang, len, i) => {
    const sway = Math.sin(t * 2.4 + i) * 0.12 + a.swim * 0.15;
    const A = ang - sway * Math.sign(Math.cos(ang) || 1);
    const ex = bx + Math.cos(A) * len, ey = by + Math.sin(A) * len;
    const cx = bx + Math.cos(A + 0.35) * len * 0.55, cy = by + Math.sin(A + 0.35) * len * 0.55;
    const P = k => [ // point along the curve
      (1 - k) * (1 - k) * bx + 2 * (1 - k) * k * cx + k * k * ex,
      (1 - k) * (1 - k) * by + 2 * (1 - k) * k * cy + k * k * ey,
    ];
    // feathery filaments
    ctx.strokeStyle = mix(col.gill, '#ffffff', 0.15);
    ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    for (let k = 0.18; k <= 1.001; k += 0.075) {
      const [px, py] = P(k);
      const [qx, qy] = P(Math.min(1, k + 0.02));
      const tx = qx - px, ty = qy - py, tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl;
      const fl = 8 * (1.15 - k * 0.6) + Math.sin(t * 5 + k * 9 + i) * 0.8;
      ctx.beginPath(); ctx.moveTo(px - nx * fl, py - ny * fl); ctx.lineTo(px + nx * fl, py + ny * fl); ctx.stroke();
    }
    // stalk
    const gg = ctx.createLinearGradient(bx, by, ex, ey);
    gg.addColorStop(0, mix(col.gill, col.dark, 0.3)); gg.addColorStop(1, col.gill);
    ctx.strokeStyle = gg; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
  };
  [-2.5, -2.1, -1.75].forEach((ang, i) => gill(-4, -6 + i * 7, ang + 0.0, 34 - i * 3, i));
  [-0.64, -1.04, -1.39].forEach((ang, i) => gill(64, -6 + i * 7, ang, 34 - i * 3, i + 3));

  // Head: wide and flat like a real axolotl
  ctx.fillStyle = shade(-38, 32);
  ctx.strokeStyle = line; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(30, -3, 46, 33, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
  // chin/lip lighter
  ctx.fillStyle = belly; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.ellipse(30, 18, 30, 9, 0, 0, TAU); ctx.fill();
  ctx.globalAlpha = 1;
  // shine on the head
  const sh = ctx.createRadialGradient(18, -22, 0, 18, -22, 22);
  sh.addColorStop(0, 'rgba(255,255,255,.6)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sh;
  ctx.beginPath(); ctx.ellipse(18, -22, 22, 12, -0.3, 0, TAU); ctx.fill();
  // head speckles
  ctx.fillStyle = col.spots ? col.dark : lo;
  for (const [u, v, w] of SPECKS.slice(0, 10)) {
    ctx.globalAlpha = col.spots ? 0.7 : 0.2;
    ctx.beginPath(); ctx.arc(4 + u * 52, -30 + v * 12, col.spots ? 1.5 + w * 2 : 0.7 + w, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // cheeks
  const ck = a.sick ? 'rgba(120,170,60,' : 'rgba(255,90,130,';
  for (const cx of [3, 57]) {
    const cg = ctx.createRadialGradient(cx, 9, 0, cx, 9, 10);
    cg.addColorStop(0, ck + '.45)'); cg.addColorStop(1, ck + '0)');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.ellipse(cx, 9, 10, 7, 0, 0, TAU); ctx.fill();
  }

  drawFace(ctx, a);

  // Clothes
  const w = a.wear || {};
  if (w.neck) {
    if (w.neckBow) drawEmoji(ctx, '🎀', 30, 30, 30);
    else {
      ctx.save();
      ctx.fillStyle = '#e53935';
      ctx.beginPath(); ctx.ellipse(28, 27, 36, 8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffeb3b';
      for (let i = -2; i <= 2; i++) ctx.fillRect(22 + i * 13, 21, 5, 12);
      ctx.fillStyle = '#e53935';
      ctx.beginPath(); ctx.moveTo(4, 26); ctx.lineTo(-6, 52); ctx.lineTo(8, 50); ctx.lineTo(14, 28); ctx.fill();
      ctx.restore();
    }
  }
  if (w.face) unflipEmoji(ctx, dir, w.face, 30, -12, 58);
  if (w.hat) {
    if (w.partyHat) drawPartyHat(ctx, 30, -36);
    else unflipEmoji(ctx, dir, w.hat, 30, -48, 46);
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

function drawFace(ctx, a) {
  const f = a.face;
  const ex1 = 14, ex2 = 46, ey = -10;
  ctx.fillStyle = '#1d1b2c';
  ctx.strokeStyle = '#1d1b2c';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const closed = f === 'sleep' || f === 'giggle' || a.blink;
  if (f === 'giggle' || f === 'joy') {
    // happy ^ ^ eyes
    for (const ex of [ex1, ex2]) {
      ctx.beginPath(); ctx.arc(ex, ey + 3, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
  } else if (closed) {
    for (const ex of [ex1, ex2]) {
      ctx.beginPath(); ctx.arc(ex, ey - 2, 6, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    }
  } else {
    const r = f === 'wow' ? 7 : 6;
    for (const ex of [ex1, ex2]) {
      const eg = ctx.createRadialGradient(ex - 1, ey - 1, 0, ex, ey, r + 1);
      eg.addColorStop(0, '#3a3550'); eg.addColorStop(0.7, '#15131f'); eg.addColorStop(1, '#000');
      ctx.fillStyle = eg;
      ctx.beginPath(); ctx.arc(ex, ey, r + 1, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ex, ey, r - 1.5, 0.3, 2.2); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(ex - 2.2, ey - 2.6, 2.6, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + 2.4, ey + 2.4, 1.1, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1d1b2c'; ctx.strokeStyle = '#1d1b2c'; ctx.lineWidth = 3;
    }
    if (f === 'sleepy' || f === 'sick') {
      // heavy eyelids
      ctx.fillStyle = a.sick ? mix(a.col.body, '#b6d98a', 0.35) : a.col.body;
      for (const ex of [ex1, ex2]) { ctx.beginPath(); ctx.rect(ex - 8, ey - 9, 16, 8); ctx.fill(); }
      ctx.fillStyle = '#1d1b2c';
    }
    if (f === 'sad' || f === 'yuck') {
      // worried brows
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(ex1 - 7, ey - 9); ctx.lineTo(ex1 + 5, ey - 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex2 + 7, ey - 9); ctx.lineTo(ex2 - 5, ey - 12); ctx.stroke();
      ctx.lineWidth = 3;
    }
  }

  // Mouth
  const mx = 30, my = 8;
  if (f === 'eat') {
    const o = 4 + Math.abs(Math.sin(a.t * 14)) * 8;
    ctx.fillStyle = '#9b2c4a';
    ctx.beginPath(); ctx.ellipse(mx, my + 2, 9, o, 0, 0, TAU); ctx.fill();
  } else if (f === 'hungry' || f === 'wow') {
    ctx.fillStyle = '#9b2c4a';
    ctx.beginPath(); ctx.ellipse(mx, my + 3, 5, 6, 0, 0, TAU); ctx.fill();
  } else if (f === 'sad' || f === 'yuck') {
    ctx.beginPath(); ctx.arc(mx, my + 12, 9, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
  } else if (f === 'sick') {
    ctx.beginPath();
    ctx.moveTo(mx - 10, my + 4);
    for (let i = 1; i <= 4; i++) ctx.lineTo(mx - 10 + i * 5, my + 4 + (i % 2 ? -3 : 3));
    ctx.stroke();
  } else if (f === 'giggle') {
    ctx.fillStyle = '#9b2c4a';
    ctx.beginPath(); ctx.moveTo(mx - 13, my); ctx.quadraticCurveTo(mx, my + 20, mx + 13, my); ctx.closePath(); ctx.fill();
  } else if (f === 'sleep') {
    ctx.beginPath(); ctx.arc(mx, my + 3, 3, 0, TAU); ctx.stroke();
  } else {
    // smile (big when joy)
    const k = f === 'joy' ? 1.3 : 1;
    ctx.beginPath(); ctx.moveTo(mx - 13 * k, my); ctx.quadraticCurveTo(mx, my + 12 * k, mx + 13 * k, my); ctx.stroke();
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
