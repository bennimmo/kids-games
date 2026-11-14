// A drawing is a list of "ops" (plain data), drawn in order onto a white page.
//   { id, t, k: kind, c: colour, s: size 0-3, p: [x, y, x, y ...], e?: stamp, f?: filled }
// The same ops are sent to friends, so everyone's page looks the same.
// No DOM here except the canvas we are given.

export const W = 1500;
export const H = 1000;

export const BRUSH = [5, 12, 24, 48];
export const SPRAY = [16, 30, 50, 80];
export const STAMP = [56, 100, 160, 240];

export const COLORS = [
  '#222222', '#ffffff', '#9e9e9e', '#8d5524', '#e53935', '#fb8c00',
  '#fdd835', '#7cb342', '#2e7d32', '#00bcd4', '#1e88e5', '#283593',
  '#8e24aa', '#ec407a', '#f8bbd0', '#ffcc80', '#f1c27d', '#c68642',
];
export const STAMPS = ['⭐', '❤️', '🌸', '🌈', '☀️', '🌙', '☁️', '🦋', '🐶', '🐱', '🐰', '🦄', '🐠', '🦖', '🚗', '🚀', '🏠', '🌳', '🍎', '🎈'];

const KINDS = new Set(['pen', 'rainbow', 'spray', 'eraser', 'line', 'rect', 'oval', 'fill', 'stamp', 'clear']);
export const SHAPES = new Set(['line', 'rect', 'oval']);
export const MAX_NUMS = 6000; // 3000 points per stroke, then a new stroke starts
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

export const byOrder = (a, b) => (a.t - b.t) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

// ---------- friends' ops come from other devices, so check every bit ----------
const list = v => Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : [];
export function sanitizeOp(raw) {
  if (!raw || typeof raw !== 'object' || !KINDS.has(raw.k)) return null;
  if (typeof raw.id !== 'string' || !/^[a-z0-9]{1,24}$/.test(raw.id)) return null;
  const p = list(raw.p).slice(0, MAX_NUMS)
    .filter(v => typeof v === 'number' && isFinite(v))
    .map(v => Math.max(-300, Math.min(W + 300, Math.round(v))));
  if (p.length % 2) p.pop();
  const need = raw.k === 'clear' ? 0 : SHAPES.has(raw.k) ? 4 : 2;
  if (p.length < need) return null;
  const op = {
    id: raw.id,
    t: typeof raw.t === 'number' && isFinite(raw.t) ? raw.t : 0,
    k: raw.k,
    c: typeof raw.c === 'string' && /^#[0-9a-f]{6}$/i.test(raw.c) ? raw.c.toLowerCase() : '#222222',
    s: [0, 1, 2, 3].includes(raw.s) ? raw.s : 1,
    p,
  };
  if (op.k === 'stamp') op.e = STAMPS.includes(raw.e) ? raw.e : STAMPS[0];
  if (raw.f === true) op.f = true;
  return op;
}

// ---------- drawing one op ----------
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}
function random(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothLine(ctx, p) {
  ctx.beginPath();
  ctx.moveTo(p[0], p[1]);
  if (p.length === 2) ctx.lineTo(p[0] + 0.01, p[1]);
  else {
    for (let i = 2; i < p.length - 2; i += 2) {
      ctx.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
    }
    ctx.lineTo(p[p.length - 2], p[p.length - 1]);
  }
  ctx.stroke();
}

export function drawOp(ctx, op) {
  const { k, c, s, p } = op;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = BRUSH[s];
  ctx.strokeStyle = ctx.fillStyle = k === 'eraser' ? '#ffffff' : c;
  switch (k) {
    case 'pen':
    case 'eraser':
      smoothLine(ctx, p);
      break;
    case 'rainbow': {
      const h0 = hash(op.id) % 360;
      for (let i = 0; i < p.length; i += 2) {
        ctx.strokeStyle = `hsl(${(h0 + i * 3) % 360},90%,55%)`;
        ctx.beginPath();
        ctx.moveTo(i ? p[i - 2] : p[i] - 0.01, i ? p[i - 1] : p[i + 1]);
        ctx.lineTo(p[i], p[i + 1]);
        ctx.stroke();
      }
      break;
    }
    case 'spray': {
      const rnd = random(hash(op.id));
      const R = SPRAY[s];
      const n = Math.round(R * 0.5);
      const dot = Math.max(2, R / 14);
      for (let i = 0; i < p.length; i += 2) {
        for (let j = 0; j < n; j++) {
          const a = rnd() * Math.PI * 2;
          const r = Math.sqrt(rnd()) * R;
          ctx.fillRect(p[i] + Math.cos(a) * r, p[i + 1] + Math.sin(a) * r, dot, dot);
        }
      }
      break;
    }
    case 'line':
      smoothLine(ctx, p.slice(0, 4));
      break;
    case 'rect': {
      const x = Math.min(p[0], p[2]), y = Math.min(p[1], p[3]);
      ctx.beginPath();
      ctx.rect(x, y, Math.abs(p[2] - p[0]), Math.abs(p[3] - p[1]));
      if (op.f) ctx.fill();
      ctx.stroke();
      break;
    }
    case 'oval': {
      ctx.beginPath();
      ctx.ellipse((p[0] + p[2]) / 2, (p[1] + p[3]) / 2, Math.abs(p[2] - p[0]) / 2 + 0.01, Math.abs(p[3] - p[1]) / 2 + 0.01, 0, 0, Math.PI * 2);
      if (op.f) ctx.fill();
      ctx.stroke();
      break;
    }
    case 'stamp':
      ctx.font = `${STAMP[s]}px ${EMOJI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(op.e, p[0], p[1]);
      break;
    case 'fill':
      floodFill(ctx, p[0], p[1], c);
      break;
    case 'clear':
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      break;
  }
  ctx.restore();
}

// Paint bucket. Fills colours close to the one tapped, then grows 1px so
// there is no white fuzz along the edges of lines.
function floodFill(ctx, x0, y0, hex) {
  x0 = Math.round(x0); y0 = Math.round(y0);
  if (x0 < 0 || y0 < 0 || x0 >= W || y0 >= H) return;
  const img = ctx.getImageData(0, 0, W, H);
  const d = new Uint32Array(img.data.buffer);
  const start = d[y0 * W + x0];
  const sr = start & 255, sg = (start >>> 8) & 255, sb = (start >>> 16) & 255;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const fill = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
  if ((start >>> 0) === fill) return;
  const TOL = 110;
  const match = i => {
    const c = d[i];
    return Math.abs((c & 255) - sr) + Math.abs(((c >>> 8) & 255) - sg) + Math.abs(((c >>> 16) & 255) - sb) <= TOL;
  };
  const mask = new Uint8Array(W * H);
  const stack = [x0, y0];
  while (stack.length) {
    const sy = stack.pop(), sx = stack.pop();
    const row = sy * W;
    if (mask[row + sx] || !match(row + sx)) continue;
    let l = sx, rr = sx;
    while (l > 0 && !mask[row + l - 1] && match(row + l - 1)) l--;
    while (rr < W - 1 && !mask[row + rr + 1] && match(row + rr + 1)) rr++;
    for (let x = l; x <= rr; x++) mask[row + x] = 1;
    for (const ny of [sy - 1, sy + 1]) {
      if (ny < 0 || ny >= H) continue;
      let run = false;
      for (let x = l; x <= rr; x++) {
        const i = ny * W + x;
        const ok = !mask[i] && match(i);
        if (ok && !run) { stack.push(x, ny); run = true; } else if (!ok) run = false;
      }
    }
  }
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const i = row + x;
      if (mask[i] === 1) d[i] = fill;
      else if ((x > 0 && mask[i - 1] === 1) || (x < W - 1 && mask[i + 1] === 1) ||
               (y > 0 && mask[i - W] === 1) || (y < H - 1 && mask[i + W] === 1)) {
        d[i] = fill;
        mask[i] = 2;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ---------- the page ----------
// sync(ops) redraws only what changed. Adding to the end is quick; undo goes
// back to the nearest saved snapshot and redraws from there.
const SNAP_EVERY = 25;
const MAX_SNAPS = 5;

export function createPainter(canvas) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let base = null;
  let done = [];
  let snaps = [];
  let last = [];

  const blank = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    if (base) ctx.drawImage(base, 0, 0, W, H);
  };
  blank();

  function sync(ops) {
    last = ops;
    let same = 0;
    while (same < done.length && same < ops.length && done[same] === ops[same].id) same++;
    if (same < done.length) {
      snaps = snaps.filter(sn => sn.n <= same);
      const sn = snaps[snaps.length - 1];
      if (sn) ctx.drawImage(sn.canvas, 0, 0);
      else blank();
      done = done.slice(0, sn ? sn.n : 0);
    }
    let from = done.length;
    for (let i = ops.length - 1; i > from; i--) {
      if (ops[i].k === 'clear') {
        for (let j = from; j < i; j++) done.push(ops[j].id);
        from = i;
        break;
      }
    }
    for (let i = from; i < ops.length; i++) {
      drawOp(ctx, ops[i]);
      done.push(ops[i].id);
      if (done.length % SNAP_EVERY === 0 && i < ops.length - 3) snap();
    }
  }
  function snap() {
    const c = snaps.length >= MAX_SNAPS ? snaps.shift().canvas : document.createElement('canvas');
    c.width = W; c.height = H;
    c.getContext('2d').drawImage(canvas, 0, 0);
    snaps.push({ n: done.length, canvas: c });
  }

  return {
    sync,
    // A fresh page (optionally starting from a picture). Forgets all ops.
    reset(img = null) {
      base = img;
      done = [];
      snaps = [];
      last = [];
      blank();
    },
    // Swap the picture under the ops (keeps the ops).
    setBase(img) {
      base = img;
      done = [];
      snaps = [];
      blank();
      sync(last);
    },
    hasBase: () => !!base,
  };
}
