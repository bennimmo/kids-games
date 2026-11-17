// The ground's look: rock layers, roots, pebbles and silly things buried in it
// (dinosaur skeletons, fossils, lost socks…). Looks only – the shape comes from sim.js.
// art   = the full picture (1 pixel per world unit), made once per map
// shown = art cut to the ground's shape + the grass/snow/icing on top
import { H, CELL, ROWS, WATER_Y } from './sim.js';

const emojiFont = px => `${px}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;

export const GROUNDS = {
  grass: {
    layers: [[26, [150, 98, 56]], [12, [176, 118, 68]], [30, [132, 84, 48]], [8, [196, 142, 88]], [36, [116, 72, 42]], [16, [146, 96, 58]], [22, [104, 66, 40]]],
    top: [92, 196, 70], shine: [150, 228, 100], topDepth: [3, 5], edge: [50, 30, 14],
    roots: true, pebbles: [[96, 88, 80], [140, 130, 118], [180, 168, 150]],
    things: ['🦴', '💎', '🪙', '🗝️', '👑', '🧦', '🥾', '🦆', '🏺', '🧸', '🎮', '🐌', '🪱', '🍕', '🧰', '🛞', '🥔', '🐚'],
    dinos: 3,
  },
  snow: {
    layers: [[28, [168, 194, 218]], [10, [210, 228, 242]], [32, [140, 168, 196]], [8, [196, 218, 236]], [40, [122, 150, 180]], [14, [156, 184, 210]]],
    top: [250, 252, 255], shine: [255, 255, 255], topDepth: [4, 7], edge: [60, 80, 110],
    ice: true, pebbles: [[110, 130, 150], [190, 214, 236]],
    things: ['🦣', '🐧', '🐟', '⛄', '🧊', '🧤', '🧣', '🦴', '💎', '🪙', '🥶', '🎿', '🦭', '🍦'],
    dinos: 2,
  },
  candy: {
    layers: [[30, [222, 168, 104]], [7, [255, 250, 240]], [6, [220, 40, 90]], [28, [206, 146, 86]], [10, [112, 62, 40]], [24, [230, 180, 112]], [7, [255, 238, 246]], [8, [130, 200, 90]]],
    top: [255, 128, 194], shine: [255, 196, 228], topDepth: [3, 5], edge: [120, 50, 70], drips: true,
    sprinkles: true, pebbles: [],
    things: ['🍬', '🍫', '🍩', '🍪', '🧁', '🍭', '🦷', '🍒', '🍓', '🎂', '🍰', '🧸', '🪥', '🍯'],
    dinos: 2,
  },
  moon: {
    layers: [[30, [176, 176, 188]], [14, [154, 154, 168]], [38, [136, 136, 152]], [10, [192, 192, 204]], [30, [122, 122, 140]]],
    top: [226, 226, 234], shine: [246, 246, 252], topDepth: [2, 3], edge: [50, 50, 70],
    craters: true, pebbles: [[110, 110, 126], [200, 200, 212]],
    things: ['👽', '🛸', '🧀', '🚀', '🛰️', '👾', '🪐', '⭐', '🌟', '🤖', '🧑‍🚀', '💫'],
    dinos: 1,
  },
};

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    let t = (s = (s + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- the picture
export function makeArt(world) {
  const W = world.W, COLS = world.cols;
  const k = W / 2000;   // wider map = more stuff
  const g = GROUNDS[world.map] || GROUNDS.grass;
  const R = rng(world.artSeed ^ 0x5eed);
  const art = document.createElement('canvas');
  art.width = W; art.height = H;
  const ctx = art.getContext('2d');

  // surface height per column (in world units)
  const surf = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const c = Math.floor(x / CELL);
    let r = 0;
    while (r < ROWS && !world.mask[r * COLS + c]) r++;
    surf[x] = r * CELL;
  }
  let avg = 0;
  for (let x = 0; x < W; x++) avg += surf[x];
  avg /= W;
  // smoothed surface, so rock layers bend gently (no steps under cliffs)
  const soft = new Float32Array(W);
  const pre = new Float64Array(W + 1);
  for (let x = 0; x < W; x++) pre[x + 1] = pre[x] + surf[x];
  for (let x = 0; x < W; x++) {
    const lo = Math.max(0, x - 60), hi = Math.min(W, x + 61);
    soft[x] = (pre[hi] - pre[lo]) / (hi - lo);
  }

  // rock layers
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const bands = [];
  let total = 0;
  for (const [h, col] of g.layers) { bands.push([total, col]); total += h; }
  const p1 = R() * 10, p2 = R() * 10;
  for (let x = 0; x < W; x++) {
    const wob = Math.sin(x / 41 + p1) * 7 + Math.sin(x / 13 + p2) * 3;
    const s = surf[x];
    const base = soft[x] * 0.55 + avg * 0.45;
    for (let y = Math.max(0, Math.floor(s) - 16); y < H; y++) {
      const depth = y - base + wob + 400;
      const k = ((depth % total) + total) % total;
      let col = bands[0][1];
      for (let i = bands.length - 1; i >= 0; i--) if (k >= bands[i][0]) { col = bands[i][1]; break; }
      let h = Math.imul(x, 73856093) ^ Math.imul(y, 19349663);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      const n = (((h >>> 24) & 31) - 16) * 0.9;
      const dark = 1 - Math.min(0.38, Math.max(0, y - s) / 1300);
      const o = (y * W + x) * 4;
      d[o] = (col[0] + n) * dark; d[o + 1] = (col[1] + n) * dark; d[o + 2] = (col[2] + n) * dark; d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const under = (x, minD) => surf[Math.max(0, Math.min(W - 1, Math.floor(x)))] + minD;
  const randSpot = (minD, maxD) => {
    const x = 30 + R() * (W - 60);
    const top = under(x, minD), bottom = Math.min(H - 20, under(x, maxD), WATER_Y + 40);
    if (bottom <= top) return null;
    return { x, y: top + R() * (bottom - top) };
  };

  // roots hanging down from the grass
  if (g.roots) {
    ctx.strokeStyle = 'rgba(70,40,18,.55)';
    ctx.lineCap = 'round';
    for (let i = 0; i < 70 * k; i++) {
      let x = R() * W, y = under(x, 6);
      ctx.lineWidth = 1 + R() * 2;
      ctx.beginPath(); ctx.moveTo(x, y);
      const n = 3 + Math.floor(R() * 4);
      for (let j = 0; j < n; j++) { x += (R() - 0.5) * 14; y += 6 + R() * 10; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  }
  // pebbles
  for (let i = 0; i < 420 * k && g.pebbles.length; i++) {
    const p = randSpot(14, 600);
    if (!p) continue;
    const col = g.pebbles[Math.floor(R() * g.pebbles.length)];
    const rx = 2 + R() * 6, ry = rx * (0.5 + R() * 0.4);
    ctx.fillStyle = `rgb(${col.join(',')})`;
    ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, R() * 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.beginPath(); ctx.ellipse(p.x - rx * 0.3, p.y - ry * 0.3, rx * 0.4, ry * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (g.sprinkles) {
    const cols = ['#ff4d6d', '#4dc9ff', '#ffe14d', '#7be36b', '#ffffff', '#b46bff'];
    for (let i = 0; i < 1600 * k; i++) {
      const p = randSpot(10, 700);
      if (!p) continue;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(R() * 3);
      ctx.fillStyle = cols[Math.floor(R() * cols.length)];
      ctx.fillRect(-3, -1, 6, 2.4);
      ctx.restore();
    }
  }
  if (g.craters) {
    for (let i = 0; i < 40 * k; i++) {
      const p = randSpot(10, 500);
      if (!p) continue;
      const r = 6 + R() * 18;
      ctx.fillStyle = 'rgba(80,80,100,.35)';
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(230,230,240,.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
    }
  }
  if (g.ice) {
    for (let i = 0; i < 60 * k; i++) {
      const p = randSpot(16, 500);
      if (!p) continue;
      const s = 5 + R() * 12;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(R() * 3);
      ctx.fillStyle = 'rgba(220,240,255,.7)'; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.7, 0); ctx.lineTo(0, s); ctx.lineTo(-s * 0.7, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }

  // buried things: dinosaurs first (they need room), then the rest
  const placed = [];
  const free = (x, y, r) => placed.every(p => Math.hypot(p.x - x, p.y - y) > p.r + r);
  const place = (r, minD, maxD) => {
    for (let t = 0; t < 60; t++) {
      const p = randSpot(minD, maxD);
      if (p && free(p.x, p.y, r)) { placed.push({ ...p, r }); return p; }
    }
    return null;
  };
  for (let i = 0; i < Math.round(g.dinos * k); i++) {
    const p = place(110, 70, 380);
    if (!p) continue;
    const kind = ['longneck', 'trex', 'trike'][Math.floor(R() * 3)];
    ctx.save(); ctx.translate(p.x, p.y);
    if (R() < 0.5) ctx.scale(-1, 1);
    ctx.rotate((R() - 0.5) * 0.4);
    const sc = 0.8 + R() * 0.4;
    ctx.scale(sc, sc);
    pocket(ctx, 0, 0, 105, 60);
    skeleton(ctx, kind);
    ctx.restore();
  }
  const extras = Math.round(16 * k);
  for (let i = 0; i < extras; i++) {
    const p = place(34, 30, 520);
    if (!p) continue;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((R() - 0.5) * 1.2);
    const r = R();
    if (r < 0.18 && world.map !== 'candy') { pocket(ctx, 0, 0, 22, 20); ammonite(ctx, 14 + R() * 8); }
    else if (r < 0.28) { pocket(ctx, 0, 0, 34, 16); fishBones(ctx); }
    else {
      const e = g.things[Math.floor(R() * g.things.length)];
      const s = 26 + R() * 16;
      pocket(ctx, 0, 0, s * 0.62, s * 0.55);
      ctx.font = emojiFont(s); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.92;
      ctx.fillText(e, 0, 0);
    }
    ctx.restore();
  }
  return art;
}

// A dark hollow behind a buried thing, so it looks dug into the rock.
function pocket(ctx, x, y, rx, ry) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
  g.addColorStop(0, 'rgba(0,0,0,.28)');
  g.addColorStop(0.7, 'rgba(0,0,0,.16)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}

const BONE = '#f4ecd8', BONE_EDGE = '#a8987a';
function boneLine(ctx, pts, w) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [col, lw] of [[BONE_EDGE, w + 2.5], [BONE, w]]) {
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.beginPath(); pts.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](x, y)); ctx.stroke();
  }
}
function vertebrae(ctx, pts, r) {
  for (const [x, y, s] of pts) {
    ctx.fillStyle = BONE_EDGE; ctx.beginPath(); ctx.arc(x, y, r * s + 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = BONE; ctx.beginPath(); ctx.arc(x, y, r * s, 0, Math.PI * 2); ctx.fill();
  }
}
// points along a curve through p0..p3
function curve(p0, p1, p2, p3, n, s0 = 1, s1 = 1) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      s0 + (s1 - s0) * t,
    ]);
  }
  return out;
}
function skull(ctx, x, y, w, h, teeth) {
  ctx.fillStyle = BONE; ctx.strokeStyle = BONE_EDGE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y, w, h, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4a3b2a';
  ctx.beginPath(); ctx.arc(x - w * 0.25, y - h * 0.2, h * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + w * 0.45, y - h * 0.1, h * 0.14, h * 0.1, 0, 0, Math.PI * 2); ctx.fill();
  if (teeth) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
      const tx = x - w * 0.1 + i * w * 0.2;
      ctx.beginPath(); ctx.moveTo(tx, y + h * 0.45); ctx.lineTo(tx + w * 0.07, y + h * 0.85); ctx.lineTo(tx + w * 0.14, y + h * 0.45); ctx.fill();
    }
  }
}
function ribs(ctx, spine, from, to, len) {
  for (let i = from; i < to; i++) {
    const [x, y] = spine[i];
    const l = len * (1 - Math.abs((i - from) / (to - from) - 0.5) * 0.8);
    boneLine(ctx, [[x, y], [x - 3, y + l * 0.6], [x + 2, y + l]], 3);
  }
}
function leg(ctx, x, y, a, b, c) {
  boneLine(ctx, [[x, y], [x + a[0], y + a[1]], [x + b[0], y + b[1]], [x + c[0], y + c[1]]], 5);
}
function skeleton(ctx, kind) {
  if (kind === 'longneck') {
    const spine = curve([-100, 14], [-50, -10], [10, -14], [40, -8], 16, 0.6, 1.2);
    const neck = curve([40, -8], [60, -20], [70, -50], [86, -62], 9, 1.1, 0.7);
    leg(ctx, -20, -6, [-4, 22], [2, 40], [10, 42]);
    leg(ctx, 28, -6, [-2, 22], [4, 40], [12, 42]);
    ribs(ctx, spine, 6, 14, 26);
    vertebrae(ctx, spine, 4.5);
    vertebrae(ctx, neck, 4.5);
    skull(ctx, 94, -64, 13, 8, false);
  } else if (kind === 'trex') {
    const spine = curve([-100, -4], [-50, -24], [-10, -30], [20, -28], 14, 0.6, 1.3);
    leg(ctx, -14, -26, [10, 24], [-4, 46], [10, 52]);
    leg(ctx, 2, -26, [12, 22], [0, 46], [14, 52]);
    ribs(ctx, spine, 8, 14, 22);
    vertebrae(ctx, spine, 4.5);
    boneLine(ctx, [[22, -20], [30, -12], [36, -14]], 2.5);   // tiny arms!
    skull(ctx, 40, -38, 24, 14, true);
  } else {  // triceratops
    const spine = curve([-90, 0], [-50, -18], [0, -22], [40, -16], 14, 0.6, 1.2);
    leg(ctx, -30, -14, [-2, 18], [2, 34], [10, 36]);
    leg(ctx, 26, -12, [-2, 18], [2, 32], [10, 34]);
    ribs(ctx, spine, 5, 13, 24);
    vertebrae(ctx, spine, 4.5);
    ctx.fillStyle = BONE; ctx.strokeStyle = BONE_EDGE; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(48, -24, 22, -2.4, 0.6); ctx.closePath(); ctx.fill(); ctx.stroke();   // frill
    skull(ctx, 62, -16, 18, 11, false);
    boneLine(ctx, [[60, -26], [84, -38]], 3); boneLine(ctx, [[70, -24], [92, -30]], 3); boneLine(ctx, [[76, -12], [86, -16]], 2.5);
  }
}
function ammonite(ctx, r) {
  ctx.strokeStyle = '#7a6040'; ctx.fillStyle = '#d9c39a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 6; a += 0.2) {
    const rr = r * (1 - a / (Math.PI * 6.4));
    ctx[a ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.stroke();
  for (let a = 0; a < Math.PI * 2; a += 0.45) {
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
  }
}
function fishBones(ctx) {
  boneLine(ctx, [[-26, 0], [18, 0]], 2.5);
  for (let x = -18; x <= 10; x += 6) { boneLine(ctx, [[x, 0], [x - 5, -9]], 2); boneLine(ctx, [[x, 0], [x - 5, 9]], 2); }
  boneLine(ctx, [[-26, 0], [-34, -8]], 2); boneLine(ctx, [[-26, 0], [-34, 8]], 2);
  skull(ctx, 24, 0, 9, 7, false);
}

// ---------------------------------------------------------------- the ground on screen
export function createGround() {
  const shown = document.createElement('canvas');
  const sctx = shown.getContext('2d');
  const maskC = document.createElement('canvas'), topC = document.createElement('canvas');
  const mctx = maskC.getContext('2d'), tctx = topC.getContext('2d');
  let mImg = null, tImg = null;
  const artCache = new Map();
  let world = null, g = GROUNDS.grass, art = null;
  let topDepth = null;
  let COLS = 0;
  function resize(w) {   // maps are wider when there are more tanks
    if (COLS === w.cols) return;
    COLS = w.cols;
    shown.width = w.W; shown.height = H;
    maskC.width = topC.width = COLS; maskC.height = topC.height = ROWS;
    mImg = mctx.createImageData(COLS, ROWS); tImg = tctx.createImageData(COLS, ROWS);
    topDepth = new Uint8Array(COLS);
  }

  function cells(c0, r0, c1, r1) {
    const m = world.mask, md = mImg.data, td = tImg.data;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const i = r * COLS + c, o = i * 4, v = m[i];
        md[o + 3] = v === 1 ? 255 : 0;
        if (!v) { td[o + 3] = 0; continue; }
        md[o] = md[o + 1] = md[o + 2] = 255;
        let col = null, a = 255;
        if (v === 2) {
          const up = r > 0 && m[i - COLS];
          col = up ? [255, 212, 70] : [255, 236, 150];
        } else {
          let depth = 0;
          const t = topDepth[c];
          while (depth < t && r - depth - 1 >= 0 && m[i - (depth + 1) * COLS]) depth++;
          if (depth < t) {
            col = depth === 0 ? g.shine : g.top;
            if (depth === t - 1) col = col.map(x => x * 0.9);
          } else {
            const air = (c > 0 && !m[i - 1]) || (c < COLS - 1 && !m[i + 1]) || (r < ROWS - 1 && !m[i + COLS]);
            if (air) { col = g.edge; a = 120; }
          }
        }
        if (!col) { td[o + 3] = 0; continue; }
        td[o] = col[0]; td[o + 1] = col[1]; td[o + 2] = col[2]; td[o + 3] = a;
      }
    }
  }
  function compose(c0, r0, c1, r1) {
    const x = c0 * CELL, y = r0 * CELL, w = (c1 - c0 + 1) * CELL, h = (r1 - r0 + 1) * CELL;
    // draw from a slightly bigger area so smoothing has neighbours, but only change our box
    const e0 = Math.max(0, c0 - 2), f0 = Math.max(0, r0 - 2), e1 = Math.min(COLS - 1, c1 + 2), f1 = Math.min(ROWS - 1, r1 + 2);
    const ew = e1 - e0 + 1, eh = f1 - f0 + 1;
    sctx.save();
    sctx.beginPath(); sctx.rect(x, y, w, h); sctx.clip();
    sctx.clearRect(x, y, w, h);
    sctx.imageSmoothingEnabled = true;
    sctx.drawImage(art, x, y, w, h, x, y, w, h);
    sctx.globalCompositeOperation = 'destination-in';
    sctx.drawImage(maskC, e0, f0, ew, eh, e0 * CELL, f0 * CELL, ew * CELL, eh * CELL);
    sctx.globalCompositeOperation = 'source-over';
    sctx.drawImage(topC, e0, f0, ew, eh, e0 * CELL, f0 * CELL, ew * CELL, eh * CELL);
    sctx.restore();
  }

  function setWorld(w) {
    world = w;
    resize(w);
    g = GROUNDS[w.map] || GROUNDS.grass;
    const key = w.map + ':' + w.artSeed + ':' + w.W;
    art = artCache.get(key);
    if (!art) {
      art = makeArt(w);
      artCache.clear();
      artCache.set(key, art);
    }
    const R = rng(w.artSeed ^ 0x70b);
    for (let c = 0; c < COLS; c++) {
      let t = g.topDepth[0] + Math.round((g.topDepth[1] - g.topDepth[0]) * (0.5 + 0.5 * Math.sin(c * 0.07 + 1)));
      topDepth[c] = t;
    }
    if (g.drips) {   // icing drips down here and there
      for (let c = 0; c < COLS;) {
        c += 6 + Math.floor(R() * 18);
        const wdt = 3 + Math.floor(R() * 4), len = 4 + Math.floor(R() * 10);
        for (let k = 0; k < wdt && c + k < COLS; k++) topDepth[c + k] += Math.round(len * Math.sin(Math.PI * (k + 0.5) / wdt));
      }
    }
    cells(0, 0, COLS - 1, ROWS - 1);
    mctx.putImageData(mImg, 0, 0); tctx.putImageData(tImg, 0, 0);
    compose(0, 0, COLS - 1, ROWS - 1);
    w.dirty.length = 0;
  }
  function sync() {
    if (!world || !world.dirty.length) return;
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const [c0, r0, c1, r1] of world.dirty) {
      a = Math.min(a, c0 - 1); b = Math.min(b, r0 - 1); c = Math.max(c, c1 + 1); d = Math.max(d, r1 + 16); // the grass under a hole changes too
    }
    world.dirty.length = 0;
    a = Math.max(0, a); b = Math.max(0, b); c = Math.min(COLS - 1, c); d = Math.min(ROWS - 1, d);
    if (a > c || b > d) return;
    cells(a, b, c, d);
    mctx.putImageData(mImg, 0, 0, a, b, c - a + 1, d - b + 1);
    tctx.putImageData(tImg, 0, 0, a, b, c - a + 1, d - b + 1);
    compose(a, b, c, d);
  }
  return { canvas: shown, setWorld, sync };
}
