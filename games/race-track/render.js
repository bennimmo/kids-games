// All drawing for Raffy Race. Reads game state, never changes it.
import { WORLD, TRACK_W, TUNNEL_HALF, JUMP_L, WATER_RX, WATER_RY, inRange } from './track.js';

export const STYLES = ['truck', 'rally', 'buggy'];
export const DECALS = ['none', 'stripes', 'flames', 'star'];

const rand = (a, b) => a + Math.random() * (b - a);

function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function off(w = WORLD.w, h = WORLD.h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// Smooth value noise that wraps around (so textures tile).
function noise2(size, rnd) {
  const grid = new Float32Array(size * size).map(() => rnd());
  const at = (a, b) => grid[(((b % size) + size) % size) * size + (((a % size) + size) % size)];
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = s => {
    const v = (n >> s) & 255;
    return Math.round(f <= 1 ? v * f : v + (255 - v) * (f - 1));
  };
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

function rr(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else g.rect(x, y, w, h);
}

// ---------------------------------------------------------------- textures

function makeGrass() {
  const W = 800, H = 500;
  const c = off(W, H);
  const g = c.getContext('2d');
  const img = g.createImageData(W, H);
  const rnd = mulberry(7);
  const n1 = noise2(64, rnd), n2 = noise2(64, rnd), n3 = noise2(64, rnd), n4 = noise2(64, rnd);
  let o = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = n1(x / 70, y / 70) * 0.5 + n2(x / 20, y / 20) * 0.3 + n3(x / 5, y / 5) * 0.2;
      const dry = Math.max(0, (n4(x / 110, y / 110) - 0.62) * 2.2);
      let r = 52 + 62 * v, gg = 88 + 70 * v, b = 34 + 34 * v;
      r += (150 - r) * dry; gg += (146 - gg) * dry; b += (84 - b) * dry;
      const grain = (rnd() - 0.5) * 16;
      img.data[o++] = r + grain; img.data[o++] = gg + grain; img.data[o++] = b + grain * 0.5; img.data[o++] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const big = off();
  const bg = big.getContext('2d');
  bg.imageSmoothingEnabled = true;
  bg.drawImage(c, 0, 0, WORLD.w, WORLD.h);
  bg.lineCap = 'round';
  const blades = ['rgba(40,75,25,.5)', 'rgba(110,150,60,.45)', 'rgba(70,110,40,.5)', 'rgba(150,170,90,.3)'];
  for (let i = 0; i < 12000; i++) {
    const x = rnd() * WORLD.w, y = rnd() * WORLD.h;
    bg.strokeStyle = blades[i % blades.length];
    bg.lineWidth = 1 + rnd();
    bg.beginPath(); bg.moveTo(x, y); bg.lineTo(x + (rnd() - 0.5) * 4, y - 2 - rnd() * 5); bg.stroke();
  }
  for (let i = 0; i < 120; i++) { // little stones
    const x = rnd() * WORLD.w, y = rnd() * WORLD.h, r = 1.5 + rnd() * 2.5;
    bg.fillStyle = 'rgba(0,0,0,.25)';
    bg.beginPath(); bg.ellipse(x + 1, y + 1, r, r * 0.8, 0, 0, 7); bg.fill();
    bg.fillStyle = `rgb(${140 + rnd() * 40},${135 + rnd() * 30},${120 + rnd() * 30})`;
    bg.beginPath(); bg.ellipse(x, y, r, r * 0.8, rnd() * 3, 0, 7); bg.fill();
  }
  return big;
}

let dirtCanvas = null;
function dirt(g) {
  if (!dirtCanvas) {
    const S = 256;
    dirtCanvas = off(S, S);
    const d = dirtCanvas.getContext('2d');
    const img = d.createImageData(S, S);
    const rnd = mulberry(3);
    const a = noise2(8, rnd), b = noise2(32, rnd), c = noise2(64, rnd);
    let o = 0;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const v = a(x / 32, y / 32) * 0.45 + b(x / 8, y / 8) * 0.35 + c(x / 4, y / 4) * 0.2;
        const grain = (rnd() - 0.5) * 22;
        img.data[o++] = 118 + 64 * v + grain;
        img.data[o++] = 86 + 52 * v + grain;
        img.data[o++] = 54 + 38 * v + grain * 0.7;
        img.data[o++] = 255;
      }
    }
    d.putImageData(img, 0, 0);
    for (let i = 0; i < 160; i++) { // pebbles
      const x = rnd() * S, y = rnd() * S, r = 0.8 + rnd() * 2.2;
      d.fillStyle = 'rgba(40,25,10,.35)';
      d.beginPath(); d.ellipse(x + 0.8, y + 0.8, r, r * 0.75, 0, 0, 7); d.fill();
      const t = 120 + rnd() * 70;
      d.fillStyle = `rgb(${t},${t * 0.9},${t * 0.78})`;
      d.beginPath(); d.ellipse(x, y, r, r * 0.75, rnd() * 3, 0, 7); d.fill();
    }
  }
  return g.createPattern(dirtCanvas, 'repeat');
}

// ---------------------------------------------------------------- track

function pathLoop(g, pts) {
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
}
function pathRange(g, track, start, len, o = 0) {
  g.beginPath();
  for (let k = 0; k <= len; k++) {
    const p = track.pts[(((start + k) % track.n) + track.n) % track.n];
    const x = p.x - Math.sin(p.a) * o, y = p.y + Math.cos(p.a) * o;
    k ? g.lineTo(x, y) : g.moveTo(x, y);
  }
}
function pathOffsetLoop(g, track, o) {
  g.beginPath();
  track.pts.forEach((p, i) => {
    const x = p.x - Math.sin(p.a) * o, y = p.y + Math.cos(p.a) * o;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  });
  g.closePath();
}

function drawStartLine(g, track) {
  const p = track.pts[0];
  g.save();
  g.translate(p.x, p.y);
  g.rotate(p.a);
  const sq = 8;
  g.globalAlpha = 0.9;
  for (let r = 0; r < 2; r++) {
    for (let c = 0, y = -TRACK_W / 2; y < TRACK_W / 2 - 0.1; c++, y += sq) {
      g.fillStyle = (r + c) % 2 ? '#1d1d1d' : '#f2f2f2';
      g.fillRect(r * sq - sq, y, sq, Math.min(sq, TRACK_W / 2 - y));
    }
  }
  g.globalAlpha = 1;
  for (const side of [-1, 1]) { // posts
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.fillRect(-2, side * (TRACK_W / 2 + 10) - 2, 7, 7);
    g.fillStyle = '#ddd';
    g.fillRect(-4, side * (TRACK_W / 2 + 10) - 4, 7, 7);
  }
  g.restore();
}

function drawTrack(g, track, detail = true) {
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'round';
  pathLoop(g, track.pts);
  g.strokeStyle = 'rgba(70,55,25,.22)'; g.lineWidth = TRACK_W + 34; g.stroke();
  g.strokeStyle = 'rgba(85,62,35,.45)'; g.lineWidth = TRACK_W + 16; g.stroke();
  g.strokeStyle = dirt(g); g.lineWidth = TRACK_W; g.stroke();
  g.strokeStyle = 'rgba(30,18,5,.18)'; g.lineWidth = TRACK_W; g.stroke();
  g.strokeStyle = dirt(g); g.lineWidth = TRACK_W - 16; g.stroke();
  g.strokeStyle = 'rgba(255,235,200,.07)'; g.lineWidth = TRACK_W * 0.45; g.stroke();
  // worn tyre grooves
  for (const o of [-TRACK_W * 0.22, TRACK_W * 0.22]) {
    pathOffsetLoop(g, track, o);
    g.strokeStyle = 'rgba(55,35,15,.2)'; g.lineWidth = 9; g.stroke();
    pathOffsetLoop(g, track, o + 4);
    g.strokeStyle = 'rgba(255,230,190,.06)'; g.lineWidth = 2; g.stroke();
  }
  g.restore();
  if (detail) { // grass tufts creeping over the edges
    const rnd = mulberry(11);
    const cols = ['#3d6b25', '#5a8a35', '#4b7a2c', '#6f9a40'];
    g.lineCap = 'round';
    for (let i = 0; i < track.n; i++) {
      const p = track.pts[i];
      for (const side of [-1, 1]) {
        if (rnd() < 0.35) continue;
        const o = side * (TRACK_W / 2 + (rnd() - 0.6) * 8);
        const x = p.x - Math.sin(p.a) * o, y = p.y + Math.cos(p.a) * o;
        for (let k = 0; k < 4; k++) {
          g.strokeStyle = cols[(i + k) % cols.length];
          g.lineWidth = 1.4;
          g.beginPath(); g.moveTo(x + (rnd() - 0.5) * 6, y + (rnd() - 0.5) * 6);
          g.lineTo(x + (rnd() - 0.5) * 10, y + (rnd() - 0.5) * 10); g.stroke();
        }
      }
    }
  }
  drawStartLine(g, track);
}

function drawBridges(g, track) {
  const n = track.n;
  const rnd = mulberry(5);
  const tones = ['#7a5b3a', '#8f6d47', '#84653f', '#9a7850', '#735435'];
  g.save();
  g.lineJoin = 'round';
  for (const r of track.runs) {
    g.lineCap = 'butt';
    // soft shadow on the road below
    for (let k = 0; k < 3; k++) {
      g.save();
      g.translate(10, 14);
      pathRange(g, track, r.start, r.len);
      g.strokeStyle = 'rgba(0,0,0,.13)'; g.lineWidth = TRACK_W + 34 - k * 9; g.stroke();
      g.restore();
    }
    pathRange(g, track, r.start, r.len);
    g.strokeStyle = '#3a2817'; g.lineWidth = TRACK_W + 18; g.stroke();
    g.strokeStyle = '#7d5f3e'; g.lineWidth = TRACK_W + 4; g.stroke();
    // planks
    for (let k = 0; k < r.len; k++) {
      const a = track.pts[(r.start + k) % n], b = track.pts[(r.start + k + 1) % n];
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      for (let t = 0; t < d; t += 6) {
        const x = a.x + (b.x - a.x) * (t / d), y = a.y + (b.y - a.y) * (t / d);
        const nx = -Math.sin(a.a) * (TRACK_W / 2 + 2), ny = Math.cos(a.a) * (TRACK_W / 2 + 2);
        g.strokeStyle = tones[Math.floor(rnd() * tones.length)];
        g.lineWidth = 5.2;
        g.beginPath(); g.moveTo(x - nx, y - ny); g.lineTo(x + nx, y + ny); g.stroke();
      }
    }
    // rails
    for (const o of [-(TRACK_W / 2 + 6), TRACK_W / 2 + 6]) {
      pathRange(g, track, r.start, r.len, o);
      g.strokeStyle = '#4e3822'; g.lineWidth = 5; g.stroke();
      pathRange(g, track, r.start, r.len, o - 1.5);
      g.strokeStyle = 'rgba(200,160,110,.5)'; g.lineWidth = 1.2; g.stroke();
    }
    for (let k = 0; k <= r.len; k += 3) {
      const p = track.pts[(r.start + k) % n];
      for (const side of [-1, 1]) {
        const o = side * (TRACK_W / 2 + 6);
        g.fillStyle = '#2a1c0f';
        g.fillRect(p.x - Math.sin(p.a) * o - 3.5, p.y + Math.cos(p.a) * o - 3.5, 7, 7);
      }
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- extras

const pathCache = new Map();
export function puddlePath(it, scale = 1) {
  const key = `${Math.round(it.x)},${Math.round(it.y)},${it.a.toFixed(3)},${scale}`;
  if (pathCache.has(key)) return pathCache.get(key);
  const rnd = mulberry(Math.round(it.x) * 7919 + Math.round(it.y) * 31);
  const p1 = rnd() * 6, p2 = rnd() * 6, p3 = rnd() * 6;
  const path = new Path2D();
  const c = Math.cos(it.a), s = Math.sin(it.a);
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * Math.PI * 2;
    const k = scale * (1 + 0.1 * Math.sin(3 * t + p1) + 0.07 * Math.sin(5 * t + p2) + 0.04 * Math.sin(8 * t + p3));
    const lx = Math.cos(t) * WATER_RX * k, ly = Math.sin(t) * WATER_RY * k;
    const x = it.x + lx * c - ly * s, y = it.y + lx * s + ly * c;
    i ? path.lineTo(x, y) : path.moveTo(x, y);
  }
  path.closePath();
  if (pathCache.size > 200) pathCache.clear();
  pathCache.set(key, path);
  return path;
}

function drawWater(g, it) {
  const path = puddlePath(it);
  g.save();
  g.fillStyle = 'rgba(52,36,20,.4)'; g.fill(puddlePath(it, 1.22));
  g.fillStyle = 'rgba(45,30,16,.55)'; g.fill(puddlePath(it, 1.1));
  const gr = g.createRadialGradient(it.x, it.y, 0, it.x, it.y, WATER_RX * 1.1);
  gr.addColorStop(0, 'rgb(96,112,106)');
  gr.addColorStop(0.6, 'rgb(84,90,74)');
  gr.addColorStop(1, 'rgb(70,60,40)');
  g.fillStyle = gr;
  g.fill(path);
  g.clip(path);
  const lg = g.createLinearGradient(it.x - WATER_RX, it.y - WATER_RY, it.x + WATER_RX, it.y + WATER_RY);
  lg.addColorStop(0, 'rgba(215,232,240,.32)');
  lg.addColorStop(0.45, 'rgba(215,232,240,.04)');
  lg.addColorStop(1, 'rgba(215,232,240,.18)');
  g.fillStyle = lg;
  g.fillRect(it.x - WATER_RX * 1.3, it.y - WATER_RX * 1.3, WATER_RX * 2.6, WATER_RX * 2.6);
  g.lineWidth = 8; g.strokeStyle = 'rgba(35,25,12,.35)'; g.stroke(path);
  g.restore();
}

function drawJump(g, it) {
  const L = JUMP_L, W = TRACK_W + 8;
  g.save();
  g.translate(it.x, it.y);
  g.rotate(it.a);
  for (let k = 0; k < 3; k++) {
    g.fillStyle = 'rgba(0,0,0,.12)';
    g.fillRect(-L / 2 + 4 - k * 2, -W / 2 + 4 - k * 2, L + 8 + k * 4, W + k * 4);
  }
  const gr = g.createLinearGradient(-L / 2, 0, L / 2, 0);
  gr.addColorStop(0, '#5f4630');
  gr.addColorStop(1, '#cfae7e');
  g.fillStyle = gr;
  g.fillRect(-L / 2, -W / 2, L, W);
  g.strokeStyle = 'rgba(40,25,10,.45)';
  g.lineWidth = 1;
  for (let x = -L / 2 + 7; x < L / 2; x += 7) {
    g.beginPath(); g.moveTo(x, -W / 2); g.lineTo(x, W / 2); g.stroke();
  }
  g.fillStyle = 'rgba(30,20,10,.5)';
  for (let x = -L / 2 + 3.5; x < L / 2; x += 7) {
    for (const y of [-W / 2 + 8, 0, W / 2 - 8]) g.fillRect(x, y, 1.2, 1.2);
  }
  g.fillStyle = '#3e2c1a';
  g.fillRect(-L / 2, -W / 2 - 3, L, 4);
  g.fillRect(-L / 2, W / 2 - 1, L, 4);
  // steel lip with hazard stripes
  g.fillStyle = '#9a9a9a';
  g.fillRect(L / 2 - 5, -W / 2, 5, W);
  for (let y = -W / 2, i = 0; y < W / 2; y += 6, i++) {
    g.fillStyle = i % 2 ? '#1d1d1d' : '#e6b422';
    g.fillRect(L / 2 - 4, y, 3, Math.min(6, W / 2 - y));
  }
  g.restore();
}

export function drawItem(g, it) {
  if (it.type === 'jump') drawJump(g, it);
  else if (it.type === 'water') drawWater(g, it);
}

function drawTunnel(g, track, it) {
  const n = track.n;
  const s = (((it.idx - TUNNEL_HALF) % n) + n) % n;
  const len = TUNNEL_HALF * 2;
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'butt';
  g.save();
  g.translate(8, 10);
  pathRange(g, track, s, len);
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = TRACK_W + 74; g.stroke();
  g.restore();
  const rings = [['#36602a', 70], ['#44722f', 56], ['#528236', 40], ['#61913f', 24], ['#70a049', 10]];
  for (const [c, w] of rings) {
    pathRange(g, track, s, len);
    g.strokeStyle = c; g.lineWidth = TRACK_W + w; g.stroke();
  }
  const rnd = mulberry(it.idx * 13 + 1);
  g.lineCap = 'round';
  for (let k = 0; k < 120; k++) { // grass texture on the hill
    const p = track.pts[(s + Math.floor(rnd() * len)) % n];
    const o = (rnd() - 0.5) * (TRACK_W + 60);
    const x = p.x - Math.sin(p.a) * o, y = p.y + Math.cos(p.a) * o;
    g.strokeStyle = rnd() < 0.5 ? 'rgba(30,60,20,.45)' : 'rgba(140,180,90,.35)';
    g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 5, y - 3 - rnd() * 4); g.stroke();
  }
  for (const [k, flip] of [[0, Math.PI], [len, 0]]) { // concrete portals
    const p = track.pts[(s + k) % n];
    g.save();
    g.translate(p.x, p.y);
    g.rotate(p.a + flip);
    const W = TRACK_W / 2;
    const dark = g.createLinearGradient(0, 0, -26, 0);
    dark.addColorStop(0, 'rgba(10,8,6,.95)');
    dark.addColorStop(1, 'rgba(10,8,6,0)');
    g.fillStyle = dark;
    g.fillRect(-26, -W, 26, W * 2);
    const cg = g.createLinearGradient(0, -W - 8, 0, W + 8);
    cg.addColorStop(0, '#6e6e6e'); cg.addColorStop(0.5, '#b4b4b4'); cg.addColorStop(1, '#6e6e6e');
    g.fillStyle = cg;
    g.fillRect(-2, -W - 8, 8, W * 2 + 16);
    g.strokeStyle = 'rgba(0,0,0,.4)';
    g.lineWidth = 1;
    g.strokeRect(-2, -W - 8, 8, W * 2 + 16);
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- cars

// tyre boxes for each style: [x, y, length, width]
const TYRES = {
  truck: [[-13, -14, 15, 10], [13, -14, 15, 10], [-13, 14, 15, 10], [13, 14, 15, 10]],
  rally: [[-12, -10, 10, 5], [12, -10, 10, 5], [-12, 10, 10, 5], [12, 10, 10, 5]],
  buggy: [[-12, -13, 15, 10], [-12, 13, 15, 10], [13, -11, 11, 7], [13, 11, 11, 7]],
};
const SIZE = { truck: [46, 38], rally: [42, 24], buggy: [44, 36] };

function tyre(g, x, y, l, w) {
  g.fillStyle = '#141414';
  rr(g, x - l / 2, y - w / 2, l, w, 2.5); g.fill();
  g.strokeStyle = '#2e2e2e';
  g.lineWidth = 1.3;
  for (let t = x - l / 2 + 1.6; t < x + l / 2 - 0.5; t += 2.7) {
    g.beginPath(); g.moveTo(t, y - w / 2 + 0.8); g.lineTo(t, y + w / 2 - 0.8); g.stroke();
  }
  g.fillStyle = 'rgba(255,255,255,.1)';
  g.fillRect(x - l / 2 + 1, y - w / 2 + 0.8, l - 2, 1.4);
}

function bodyGrad(g, color, w, lift = 0) {
  const gr = g.createLinearGradient(0, -w / 2, 0, w / 2);
  gr.addColorStop(0, shade(color, 0.5 + lift));
  gr.addColorStop(0.22, shade(color, 1 + lift));
  gr.addColorStop(0.5, shade(color, 1.28 + lift));
  gr.addColorStop(0.78, shade(color, 1 + lift));
  gr.addColorStop(1, shade(color, 0.5 + lift));
  return gr;
}

function glass(g, x0, x1) {
  const gr = g.createLinearGradient(x0, -8, x1, 8);
  gr.addColorStop(0, '#16222b'); gr.addColorStop(0.5, '#4f6d80'); gr.addColorStop(1, '#1b2a34');
  return gr;
}

function lights(g, front, back, ys) {
  for (const y of ys) {
    g.fillStyle = '#fff6cc';
    rr(g, front - 2.5, y - 2, 3, 4, 1); g.fill();
    g.fillStyle = '#b71c1c';
    g.fillRect(back - 0.5, y - 2, 2, 4);
  }
}

function star(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.45 : r;
    g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  g.closePath();
  g.fill();
}

function flames(g, x0, x1, y, dir) {
  // flames start at the front (x1) and lick back towards x0
  const gr = g.createLinearGradient(x1, 0, x0, 0);
  gr.addColorStop(0, '#ffeb3b'); gr.addColorStop(0.5, '#ff9800'); gr.addColorStop(1, 'rgba(229,57,53,.9)');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x1, y);
  const steps = 4, len = x1 - x0;
  for (let i = 0; i <= steps; i++) {
    const x = x1 - (len * (i + 0.5)) / steps;
    g.lineTo(x, y + dir * (i % 2 ? 2 : 5.5));
  }
  g.lineTo(x0, y);
  g.closePath();
  g.fill();
}

function decal(g, look, area) {
  const [x0, x1, w] = area;
  if (look.decal === 'stripes') {
    g.fillStyle = 'rgba(255,255,255,.85)';
    g.fillRect(x0, -3.6, x1 - x0, 2.4);
    g.fillRect(x0, 1.2, x1 - x0, 2.4);
  } else if (look.decal === 'flames') {
    flames(g, x1 - 18, x1, -w / 2 + 0.5, 1);
    flames(g, x1 - 18, x1, w / 2 - 0.5, -1);
  }
}

function drawTruck(g, look) {
  const c = look.color;
  g.strokeStyle = '#2b2b2b'; g.lineWidth = 3;
  for (const [x, y] of TYRES.truck) { g.beginPath(); g.moveTo(x, y * 0.4); g.lineTo(x, y * 0.85); g.stroke(); }
  TYRES.truck.forEach(t => tyre(g, ...t));
  g.fillStyle = bodyGrad(g, c, 24);
  rr(g, -21, -12, 42, 24, 5); g.fill();
  g.strokeStyle = shade(c, 0.4); g.lineWidth = 1; g.stroke();
  g.fillStyle = shade(c, 0.62);
  rr(g, -19, -9.5, 15, 19, 2); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.28)';
  for (let x = -17; x < -5; x += 3) { g.beginPath(); g.moveTo(x, -8.5); g.lineTo(x, 8.5); g.stroke(); }
  decal(g, look, [-3, 21, 24]);
  g.fillStyle = bodyGrad(g, c, 20, 0.12);
  rr(g, -3, -10, 12, 20, 3); g.fill();
  if (look.decal === 'stripes') { g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(-3, -3.6, 12, 2.4); g.fillRect(-3, 1.2, 12, 2.4); }
  if (look.decal === 'star') { g.fillStyle = '#fff'; star(g, 3, 0, 6); }
  g.fillStyle = glass(g, 9, 14);
  g.beginPath(); g.moveTo(9, -10); g.lineTo(14, -8.5); g.lineTo(14, 8.5); g.lineTo(9, 10); g.closePath(); g.fill();
  g.fillStyle = '#ffb300';
  for (let y = -6; y <= 6; y += 4) { g.beginPath(); g.arc(-1.5, y, 1.2, 0, 7); g.fill(); }
  g.fillStyle = '#262626';
  g.fillRect(20.5, -11.5, 2.8, 23);
  lights(g, 20.5, -21.5, [-8.5, 8.5]);
}

function drawRally(g, look) {
  const c = look.color;
  TYRES.rally.forEach(t => tyre(g, ...t));
  g.fillStyle = bodyGrad(g, c, 21);
  rr(g, -20, -10.5, 40, 21, 6); g.fill();
  g.strokeStyle = shade(c, 0.4); g.lineWidth = 1; g.stroke();
  decal(g, look, [-20, 20, 21]);
  g.fillStyle = glass(g, 3, 10);
  g.beginPath(); g.moveTo(3, -8.5); g.lineTo(10, -7); g.lineTo(10, 7); g.lineTo(3, 8.5); g.closePath(); g.fill();
  g.fillStyle = shade(c, 1.15);
  rr(g, -7, -8.5, 10, 17, 2); g.fill();
  if (look.decal === 'stripes') { g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(-7, -3.6, 10, 2.4); g.fillRect(-7, 1.2, 10, 2.4); }
  if (look.decal === 'star') { g.fillStyle = '#fff'; star(g, -2, 0, 5.5); }
  g.fillStyle = glass(g, -11, -7);
  g.fillRect(-11, -7, 4, 14);
  g.fillStyle = shade(c, 0.45);
  g.fillRect(-22.5, -11, 3, 22);
  lights(g, 19.5, -20.5, [-6.5, 6.5]);
}

function drawBuggy(g, look) {
  const c = look.color;
  g.strokeStyle = '#2b2b2b'; g.lineWidth = 2.5;
  g.beginPath(); g.moveTo(-12, -13); g.lineTo(-12, 13); g.moveTo(13, -11); g.lineTo(13, 11); g.stroke();
  TYRES.buggy.forEach(t => tyre(g, ...t));
  g.strokeStyle = '#3a3a3a'; g.lineWidth = 2.2;
  g.strokeRect(-17, -7, 33, 14);
  g.fillStyle = '#5a5a5a';
  rr(g, -20, -6, 9, 12, 2); g.fill();
  g.strokeStyle = '#8a8a8a'; g.lineWidth = 1;
  for (let x = -19; x < -12; x += 2) { g.beginPath(); g.moveTo(x, -5); g.lineTo(x, 5); g.stroke(); }
  g.fillStyle = bodyGrad(g, c, 4);
  g.fillRect(-8, -10, 15, 3.5);
  g.fillRect(-8, 6.5, 15, 3.5);
  if (look.decal === 'flames') { flames(g, -8, 7, -10, 1); flames(g, -8, 7, 10, -1); }
  g.fillStyle = bodyGrad(g, c, 14);
  g.beginPath(); g.moveTo(6, -7); g.lineTo(21, -4); g.lineTo(21, 4); g.lineTo(6, 7); g.closePath(); g.fill();
  if (look.decal === 'stripes') { g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(6, -3.6, 15, 2.4); g.fillRect(6, 1.2, 15, 2.4); }
  if (look.decal === 'star') { g.fillStyle = '#fff'; star(g, 13, 0, 4.5); }
  g.strokeStyle = shade(c, 0.6); g.lineWidth = 2.4;
  rr(g, -8, -7.5, 12, 15, 3); g.stroke();
  const hg = g.createRadialGradient(-3, -1.5, 1, -2, 0, 6);
  hg.addColorStop(0, '#fff'); hg.addColorStop(1, '#bdbdbd');
  g.fillStyle = hg;
  g.beginPath(); g.arc(-2, 0, 5.2, 0, 7); g.fill();
  g.fillStyle = '#1b2a34';
  g.beginPath(); g.arc(-2, 0, 5.2, -0.9, 0.9); g.lineTo(-2, 0); g.closePath(); g.fill();
  lights(g, 21, -20.5, [-2.5, 2.5]);
}

export function drawCar(g, x, y, a, look, s = 1) {
  g.save();
  g.translate(x, y);
  g.rotate(a);
  g.scale(s, s);
  const style = look.style || 'truck';
  if (style === 'rally') drawRally(g, look);
  else if (style === 'buggy') drawBuggy(g, look);
  else drawTruck(g, look);
  g.restore();
}

function carShadow(g, c, z) {
  const [L, W] = SIZE[c.style || 'truck'];
  g.save();
  g.translate(c.x + 4 + z * 0.4, c.y + 6 + z * 0.6);
  g.rotate(c.a);
  const fade = Math.max(0.3, 1 - z / 120);
  for (let k = 0; k < 4; k++) {
    g.fillStyle = `rgba(0,0,0,${0.11 * fade})`;
    rr(g, -L / 2 - k * 2, -W / 2 - k * 2, L + k * 4, W + k * 4, 6 + k * 2);
    g.fill();
  }
  g.restore();
}

function headBeams(g, c, s) {
  const [L] = SIZE[c.style || 'truck'];
  g.save();
  g.translate(c.x, c.y - (c.z || 0) * 0.3);
  g.rotate(c.a);
  g.scale(s, s);
  const gr = g.createLinearGradient(L / 2, 0, L / 2 + 40, 0);
  gr.addColorStop(0, 'rgba(255,245,200,.22)');
  gr.addColorStop(1, 'rgba(255,245,200,0)');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(L / 2, -9); g.lineTo(L / 2 + 40, -18); g.lineTo(L / 2 + 40, 18); g.lineTo(L / 2, 9);
  g.closePath();
  g.fill();
  g.restore();
}

function drawRaceCar(g, c) {
  const z = c.z || 0;
  const s = 1 + z / 90;
  carShadow(g, c, z);
  headBeams(g, c, s);
  drawCar(g, c.x, c.y - z * 0.3, c.a, c, s);
}

// ---------------------------------------------------------------- renderer

export function createRenderer(view) {
  const grass = makeGrass();
  const ground = off(), bridgeL = off(), tunnelL = off(), skid = off();
  const fit = { s: 1, ox: 0, oy: 0 };
  const parts = [];
  const rings = [];
  const prevWheels = new Map();
  const wet = new Map();
  let track = null, items = [];
  let waters = [];

  function setScene(t, its) {
    track = t; items = its;
    waters = its.filter(i => i.type === 'water');
    const g = ground.getContext('2d');
    g.drawImage(grass, 0, 0);
    const b = bridgeL.getContext('2d');
    const tu = tunnelL.getContext('2d');
    b.clearRect(0, 0, WORLD.w, WORLD.h);
    tu.clearRect(0, 0, WORLD.w, WORLD.h);
    if (!t) return;
    drawTrack(g, t);
    items.filter(i => !i.up && i.type !== 'tunnel').forEach(i => drawItem(g, i));
    drawBridges(b, t);
    items.filter(i => i.up && i.type !== 'tunnel').forEach(i => drawItem(b, i));
    items.filter(i => i.type === 'tunnel').forEach(i => drawTunnel(tu, t, i));
  }

  function resetRace() {
    skid.getContext('2d').clearRect(0, 0, WORLD.w, WORLD.h);
    parts.length = 0;
    rings.length = 0;
    prevWheels.clear();
    wet.clear();
  }

  function computeFit(ins) {
    const W = view.width, H = view.height - ins.top - ins.bottom;
    fit.s = Math.min(W / WORLD.w, H / WORLD.h);
    fit.ox = (W - WORLD.w * fit.s) / 2;
    fit.oy = ins.top + (H - WORLD.h * fit.s) / 2;
  }

  function toWorld(cx, cy) {
    const r = view.canvas.getBoundingClientRect();
    return { x: (cx - r.left - fit.ox) / fit.s, y: (cy - r.top - fit.oy) / fit.s };
  }

  function hidden(c) {
    if (c.air || !c.onTrack || !track) return false;
    return items.some(it => it.type === 'tunnel' && it.up === c.up &&
      inRange(c.idx, it.idx - TUNNEL_HALF, TUNNEL_HALF * 2 + 1, track.n));
  }

  const add = p => parts.push(Object.assign({ z: 0, vz: 0, grav: 0, grow: 0, a: 1 }, p, { max: p.life }));

  function effects(cars, dt) {
    const sg = skid.getContext('2d');
    sg.lineCap = 'round';
    for (const c of cars) {
      const fx = Math.cos(c.a), fy = Math.sin(c.a);
      const wheel = (along, side) => ({ x: c.x + fx * along - fy * side, y: c.y + fy * along + fx * side });
      const now = { l: wheel(-12, -12), r: wheel(-12, 12) };
      const prev = prevWheels.get(c.id);
      const w = c.inWater ? 1.6 : Math.max(0, (wet.get(c.id) || 0) - dt);
      wet.set(c.id, w);
      if (prev && !c.air) {
        const marks = [];
        if (c.skid > 55) marks.push([c.onTrack ? 'rgba(35,22,12,.24)' : 'rgba(35,55,20,.25)', 5]);
        else if (!c.onTrack && c.speed > 40) marks.push(['rgba(45,65,25,.12)', 6]);
        if (w > 0 && !c.inWater && c.speed > 20) marks.push([`rgba(30,22,14,${0.3 * (w / 1.6)})`, 5]);
        for (const [col, lw] of marks) {
          sg.strokeStyle = col;
          sg.lineWidth = lw;
          for (const k of ['l', 'r']) {
            sg.beginPath(); sg.moveTo(prev[k].x, prev[k].y); sg.lineTo(now[k].x, now[k].y); sg.stroke();
          }
        }
      }
      prevWheels.set(c.id, c.air ? null : now);
      if (c.air) continue;
      const chance = rate => Math.random() < rate * dt;
      if (c.skid > 80 && chance(25)) {
        add({ x: now.l.x, y: now.l.y, vx: rand(-15, 15), vy: rand(-15, 15), life: 0.9, r: 5, grow: 22, color: c.onTrack ? '175,150,120' : '200,200,190', a: 0.3 });
      }
      if (c.onTrack && !c.inWater && c.speed > 150 && chance(12)) {
        const p = Math.random() < 0.5 ? now.l : now.r;
        add({ x: p.x, y: p.y, vx: -c.vx * 0.1, vy: -c.vy * 0.1, life: 1, r: 6, grow: 26, color: '170,140,100', a: 0.18 });
      }
      if (!c.onTrack && c.speed > 70) {
        if (chance(28)) {
          const p = Math.random() < 0.5 ? now.l : now.r;
          add({ x: p.x, y: p.y, vx: -c.vx * 0.3 + rand(-30, 30), vy: -c.vy * 0.3 + rand(-30, 30), vz: rand(60, 140), grav: 700, life: 0.7, r: rand(1.5, 3), color: Math.random() < 0.6 ? '90,62,35' : '70,110,40' });
        }
      }
      if (c.inWater && c.speed > 25) {
        const n = Math.min(4, c.speed / 60);
        for (let k = 0; k < n; k++) {
          if (!chance(30)) continue;
          const side = Math.random() < 0.5 ? -1 : 1;
          const p = wheel(rand(-14, 14), side * 14);
          add({ x: p.x, y: p.y, vx: -fy * side * rand(40, 110) + c.vx * 0.3, vy: fx * side * rand(40, 110) + c.vy * 0.3, vz: rand(70, 180), grav: 650, life: 0.8, r: rand(1.2, 2.6), color: Math.random() < 0.6 ? '215,228,232' : '120,140,138', a: 0.9 });
        }
        if (chance(6)) add({ x: c.x, y: c.y, vx: 0, vy: 0, life: 0.6, r: 10, grow: 40, color: '235,240,242', a: 0.18 });
        if (chance(9)) rings.push({ x: c.x - fx * 10, y: c.y - fy * 10, r: 10, life: 1.2, max: 1.2 });
      }
    }
  }

  function burst(x, y, color, count = 14) {
    for (let k = 0; k < count; k++) {
      add({ x, y, vx: rand(-90, 90), vy: rand(-90, 90), vz: rand(60, 180), grav: 600, life: 0.9, r: rand(1.5, 3.5), color });
    }
  }
  function splash(x, y) {
    for (let k = 0; k < 40; k++) {
      const a = rand(0, 7), sp = rand(40, 160);
      add({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: rand(120, 260), grav: 650, life: 1, r: rand(1.2, 3), color: Math.random() < 0.6 ? '220,232,236' : '120,140,138', a: 0.9 });
    }
    for (let k = 0; k < 3; k++) rings.push({ x, y, r: 8 + k * 10, life: 1.3, max: 1.3 });
    add({ x, y, vx: 0, vy: 0, life: 0.7, r: 14, grow: 60, color: '240,245,246', a: 0.25 });
  }
  function dust(x, y) {
    for (let k = 0; k < 8; k++) {
      add({ x: x + rand(-12, 12), y: y + rand(-12, 12), vx: rand(-40, 40), vy: rand(-40, 40), life: 1, r: 8, grow: 30, color: '170,140,100', a: 0.3 });
    }
    burst(x, y, '95,68,40', 10);
  }

  function drawWaterLive(g, its, time, dt) {
    for (const it of its) {
      const path = puddlePath(it);
      g.save();
      g.clip(path);
      for (let k = 0; k < 3; k++) { // slow shimmer
        const t = time * 0.6 + k * 2.1;
        g.fillStyle = 'rgba(230,240,245,.07)';
        g.beginPath();
        g.ellipse(it.x + Math.sin(t) * WATER_RX * 0.4, it.y + Math.cos(t * 0.7) * WATER_RY * 0.4, WATER_RX * 0.5, 5, it.a + 0.4, 0, 7);
        g.fill();
      }
      g.restore();
    }
    if (!rings.length || !its.length) return;
    g.save();
    const clip = new Path2D();
    its.forEach(it => clip.addPath(puddlePath(it)));
    g.clip(clip);
    for (const r of rings) {
      const a = r.life / r.max;
      g.strokeStyle = `rgba(235,242,245,${0.55 * a})`;
      g.lineWidth = 1.6;
      g.beginPath(); g.arc(r.x, r.y, r.r, 0, 7); g.stroke();
      g.strokeStyle = `rgba(30,40,38,${0.3 * a})`;
      g.beginPath(); g.arc(r.x, r.y, Math.max(0, r.r - 2.5), 0, 7); g.stroke();
    }
    g.restore();
  }

  function waterOnCar(g, c) {
    // tyres look half under water
    g.save();
    const clip = new Path2D();
    waters.forEach(it => clip.addPath(puddlePath(it)));
    g.clip(clip);
    g.translate(c.x, c.y);
    g.rotate(c.a);
    g.fillStyle = 'rgba(70,88,84,.6)';
    for (const [x, y, l, w] of TYRES[c.style || 'truck']) { rr(g, x - l / 2 - 1, y - w / 2 - 1, l + 2, w + 2, 3); g.fill(); }
    if (c.speed > 40) { // bow wave
      const [L, W] = SIZE[c.style || 'truck'];
      g.strokeStyle = `rgba(235,242,245,${Math.min(0.8, c.speed / 300)})`;
      g.lineWidth = 2.5;
      g.beginPath(); g.ellipse(L / 2 - 4, 0, 8, W / 2 + 3, 0, -1.4, 1.4); g.stroke();
    }
    g.restore();
  }

  function drawHint(g, time) {
    const cx = WORLD.w / 2, cy = WORLD.h / 2, rx = 520, ry = 300;
    g.save();
    g.setLineDash([24, 22]);
    g.lineDashOffset = -time * 60;
    g.strokeStyle = 'rgba(255,255,255,.7)';
    g.lineWidth = 14;
    g.lineCap = 'round';
    g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.stroke();
    g.setLineDash([]);
    const t = time * 1.2;
    g.font = '110px serif';
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.fillText('👆', cx + Math.cos(t) * rx, cy + Math.sin(t) * ry - 10);
    g.restore();
  }

  function frame(o) {
    const g = view.ctx;
    const dt = o.dt;
    computeFit(o.insets);
    g.fillStyle = '#3f5f2c';
    g.fillRect(0, 0, view.width, view.height);
    g.save();
    g.translate(fit.ox, fit.oy);
    g.scale(fit.s, fit.s);
    g.drawImage(ground, 0, 0);
    g.drawImage(skid, 0, 0);

    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.life -= dt; r.r += 32 * dt;
      if (r.life <= 0) rings.splice(i, 1);
    }
    drawWaterLive(g, waters.filter(w => !w.up), o.time, dt);

    const cars = o.cars || [];
    if (o.live) effects(cars, dt);
    const vis = cars.filter(c => !hidden(c));
    const draw = c => { drawRaceCar(g, c); if (c.inWater && !c.air) waterOnCar(g, c); };
    vis.filter(c => !c.air && !c.up).forEach(draw);
    g.drawImage(bridgeL, 0, 0);
    drawWaterLive(g, waters.filter(w => w.up), o.time, dt);
    vis.filter(c => !c.air && c.up).forEach(draw);
    g.drawImage(tunnelL, 0, 0);

    // particles below flying cars
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.grav) {
        p.vz -= p.grav * dt; p.z += p.vz * dt;
        if (p.z < 0) { p.z = 0; p.vz = 0; p.vx *= 0.3; p.vy *= 0.3; p.life = Math.min(p.life, 0.15); }
      }
      p.r += p.grow * dt;
      g.fillStyle = `rgba(${p.color},${p.a * Math.min(1, (p.life / p.max) * 1.5)})`;
      g.beginPath(); g.arc(p.x, p.y - p.z * 0.6, p.r, 0, 7); g.fill();
    }

    vis.filter(c => c.air).forEach(c => drawRaceCar(g, c));
    g.globalAlpha = 0.35; // cars inside a tunnel: see-through
    cars.filter(c => hidden(c)).forEach(c => drawCar(g, c.x, c.y, c.a, c));
    g.globalAlpha = 1;

    if (o.stroke && o.stroke.length > 1) {
      g.save();
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath();
      o.stroke.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.strokeStyle = 'rgba(85,62,35,.6)'; g.lineWidth = TRACK_W + 16; g.stroke();
      g.strokeStyle = dirt(g); g.lineWidth = TRACK_W; g.stroke();
      g.restore();
    }

    if (o.drag) {
      g.globalAlpha = 0.85;
      if (o.drag.type === 'tunnel') {
        g.fillStyle = '#528236';
        g.strokeStyle = '#36602a';
        g.lineWidth = 8;
        g.beginPath(); g.ellipse(o.drag.x, o.drag.y, 95, 66, 0, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#9e9e9e';
        g.fillRect(o.drag.x - 92, o.drag.y - 44, 10, 88);
        g.fillRect(o.drag.x + 82, o.drag.y - 44, 10, 88);
      } else {
        drawItem(g, o.drag);
      }
      g.globalAlpha = 1;
    }

    if (o.hint) drawHint(g, o.time);
    g.restore();
  }

  function thumb(canvas) {
    const g = canvas.getContext('2d');
    g.drawImage(ground, 0, 0, canvas.width, canvas.height);
    g.drawImage(bridgeL, 0, 0, canvas.width, canvas.height);
    g.drawImage(tunnelL, 0, 0, canvas.width, canvas.height);
  }

  return { setScene, resetRace, frame, toWorld, thumb, burst, splash, dust };
}

// ---------------------------------------------------------------- icons

export function drawCarIcon(canvas, look) {
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, canvas.width, canvas.height);
  const s = Math.min(canvas.width / 52, canvas.height / 42);
  drawCar(g, canvas.width / 2, canvas.height / 2, 0, look, s);
}

export function drawItemIcon(canvas, type) {
  const g = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  g.clearRect(0, 0, w, h);
  g.save();
  g.translate(w / 2, h / 2);
  const s = w / 190;
  g.scale(s, s);
  g.fillStyle = 'rgba(85,62,35,.6)';
  g.fillRect(-95, -TRACK_W / 2 - 7, 190, TRACK_W + 14);
  g.fillStyle = dirt(g);
  g.fillRect(-95, -TRACK_W / 2, 190, TRACK_W);
  if (type === 'tunnel') {
    const fake = { n: 15, pts: Array.from({ length: 15 }, (_, i) => ({ x: -56 + i * 8, y: 0, a: 0 })) };
    drawTunnel(g, fake, { idx: TUNNEL_HALF });
  } else {
    drawItem(g, { type, x: 0, y: 0, a: 0 });
  }
  g.restore();
}

// Small picture of any track (for the saved tracks screen)
export function drawTrackThumb(canvas, track, items) {
  const g = canvas.getContext('2d');
  g.save();
  g.fillStyle = '#5f8a3c';
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.scale(canvas.width / WORLD.w, canvas.height / WORLD.h);
  drawTrack(g, track, false);
  items.filter(i => !i.up && i.type !== 'tunnel').forEach(i => drawItem(g, i));
  drawBridges(g, track);
  items.filter(i => i.up && i.type !== 'tunnel').forEach(i => drawItem(g, i));
  items.filter(i => i.type === 'tunnel').forEach(i => drawTunnel(g, track, i));
  g.restore();
}
