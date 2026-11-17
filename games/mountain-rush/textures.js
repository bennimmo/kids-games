// Mountain Rush: textures painted in code (no image files). All tile seamlessly.
import * as THREE from '../../js/vendor/three.module.min.js';
import { rng } from '../sky-pilot/noise.js';

// periodic value noise (wraps every `per` cells) so textures tile
function periodicNoise(seed) {
  const r = rng(seed), P = 256, tab = new Float32Array(P * P);
  for (let i = 0; i < P * P; i++) tab[i] = r();
  const at = (x, y, per) => tab[((y % per + per) % per) * P + ((x % per + per) % per)];
  const v = (x, y, per) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = at(ix, iy, per), b = at(ix + 1, iy, per), c = at(ix, iy + 1, per), d = at(ix + 1, iy + 1, per);
    return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
  };
  // u, v in 0..1 ; base = cells per tile at octave 0
  return (u, w, base = 4, oct = 5) => {
    let s = 0, a = 0.5, n = 0, per = base;
    for (let o = 0; o < oct; o++) { s += a * v(u * per, w * per, per); n += a; a *= 0.5; per *= 2; }
    return s / n;
  };
}

function canvas(size) { const c = document.createElement('canvas'); c.width = c.height = size; return c; }
function toTex(c, srgb = true, repeat = true) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

function paint(size, seed, fn) {
  const c = canvas(size), g = c.getContext('2d'), img = g.createImageData(size, size), d = img.data;
  const N = periodicNoise(seed);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const col = fn(x / size, y / size, N);
    const i = (y * size + x) * 4;
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = col[3] === undefined ? 255 : col[3];
  }
  g.putImageData(img, 0, 0);
  return { c, g };
}

// little stones scattered with wrap-around
function stones(g, size, seed, count, rMin, rMax, cols) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = r() * size, y = r() * size, rad = rMin + r() * (rMax - rMin), col = cols[Math.floor(r() * cols.length)];
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      const cx = x + ox, cy = y + oy;
      if (cx < -rad || cy < -rad || cx > size + rad || cy > size + rad) continue;
      const gr = g.createRadialGradient(cx - rad * 0.3, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
      gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]);
      g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rad, rad * (0.6 + r() * 0.4), r() * 3, 0, 7); g.fill();
    }
  }
}

// B = the map's look (biomes.js): colours for ground, dirt, rock
export function makeTextures(size = 512, B) {
  const T = {};
  const G = B.grass, F = B.floor, D = B.dirt, RK = B.rock;
  // ---- open ground (grass / sand / snow)
  T.grass = toTex(paint(size, 11, (u, v, N) => {
    const a = N(u, v, 4, 6), b = N(u + 0.3, v, 32, 3), dry = N(u, v + 0.5, 3, 3);
    const k = a * 0.7 + b * 0.3;
    let r = G[0] + k * G[3], g2 = G[1] + k * G[4], bl = G[2] + k * G[5];
    const d = Math.max(0, dry - 0.55) * 3;
    r += d * B.dry[0]; g2 += d * B.dry[1]; bl += d * B.dry[2];
    if (B.snow) { const sp = N(u, v, 64, 2); r += sp * 10; g2 += sp * 10; bl += sp * 8; }
    return [r, g2, bl];
  }).c);

  // ---- ground under trees (needles and earth / darker sand / old snow)
  T.floor = toTex(paint(size, 19, (u, v, N) => {
    const a = N(u, v, 6, 6), n = N(u, v, 64, 2);
    const k = a * 0.6 + n * 0.4;
    return [F[0] + k * F[3], F[1] + k * F[4], F[2] + k * F[5]];
  }).c);

  // ---- dirt trail: packed brown earth with a few stones
  const k5 = size / 512;
  {
    const { c, g } = paint(size, 23, (u, v, N) => {
      const a = N(u, v, 3, 5), b = N(u + 0.5, v, 12, 3), f = N(u, v + 0.3, 40, 2);
      const k = 0.86 + a * 0.22 + (b - 0.5) * 0.12 + (f - 0.5) * 0.06;
      return [D[0] * k, D[1] * k, D[2] * k];
    });
    stones(g, size, 5, 70, 1.2 * k5, 3 * k5, B.stones);
    stones(g, size, 6, 12, 3 * k5, 6 * k5, [['#bfb5a6', '#7a7064']]);
    T.dirt = toTex(c);
  }
  // dirt bump (height): gentle lumps, stones stick up
  {
    const { c, g } = paint(size, 23, (u, v, N) => { const k = N(u, v, 3, 5) * 0.6 + N(u + 0.5, v, 12, 3) * 0.4; const x = 70 + k * 90; return [x, x, x]; });
    stones(g, size, 5, 70, 1.2 * k5, 3 * k5, [['#d0d0d0', '#a0a0a0']]);
    stones(g, size, 6, 12, 3 * k5, 6 * k5, [['#e0e0e0', '#a8a8a8']]);
    T.dirtBump = toTex(c, false);
  }

  // ---- rock: grey with lichen and cracks
  T.rock = toTex(paint(size, 31, (u, v, N) => {
    const a = N(u, v, 4, 6), cr = Math.abs(N(u, v + 0.7, 8, 4) - 0.5), lic = N(u + 0.4, v, 10, 4);
    let k = 95 + a * 90;
    if (cr < 0.02) k *= 0.55;
    let r = k * RK[0], g2 = k * RK[1], bl = k * RK[2];
    if (B.terrace) { const band = N(u * 0.1, v * 2, 8, 3); r *= 0.85 + band * 0.3; g2 *= 0.85 + band * 0.25; }
    if (B.lichen && lic > 0.62) { const m = (lic - 0.62) * 3; r = r * (1 - m) + 150 * m; g2 = g2 * (1 - m) + 160 * m; bl = bl * (1 - m) + 95 * m; }
    return [r, g2, bl];
  }).c);

  // ---- tree bark (vertical grooves)
  T.bark = toTex(paint(256, 41, (u, v, N) => {
    const groove = N(u * 1, v * 0.08, 16, 4), n = N(u, v, 8, 4);
    const k = 0.45 + groove * 0.6 + n * 0.2;
    return [76 * k, 54 * k, 40 * k];
  }).c);

  // ---- pine branch card (needles on a twig), with see-through gaps
  {
    const S = 256, c = canvas(S), g = c.getContext('2d'), r = rng(77);
    g.clearRect(0, 0, S, S);
    // main twig along the middle, from left (trunk) to right (tip)
    const drawTwig = (x0, y0, x1, y1, len, depth) => {
      g.strokeStyle = 'rgba(70,50,35,1)'; g.lineWidth = depth === 0 ? 4 : 2;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      const steps = Math.floor(len / 3);
      for (let i = 0; i < steps; i++) {
        const t = i / steps, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
        const ang = Math.atan2(y1 - y0, x1 - x0);
        for (const side of [-1, 1]) {
          const a = ang + side * (0.9 + r() * 0.5), l = (10 + r() * 9) * (1 - t * 0.5) * (depth === 0 ? 1.2 : 0.9);
          const shade = 0.6 + r() * 0.5;
          g.strokeStyle = `rgb(${Math.round(52 * shade)},${Math.round(96 * shade)},${Math.round(50 * shade)})`;
          g.lineWidth = 1.8;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
        }
      }
    };
    drawTwig(4, S / 2, S - 8, S / 2 + 6, S, 0);
    for (let i = 0; i < 7; i++) {
      const t = 0.12 + i * 0.12, x = 4 + (S - 12) * t, y = S / 2 + t * 6, side = i % 2 ? -1 : 1;
      drawTwig(x, y, x + 60 * (1 - t * 0.5), y + side * (50 + r() * 30) * (1 - t * 0.4), 70 * (1 - t * 0.5), 1);
    }
    T.branch = toTex(c, true, false);
    T.branch.wrapS = T.branch.wrapT = THREE.ClampToEdgeWrapping;
  }

  // ---- pine branch with snow on top
  {
    const c = canvas(256), g = c.getContext('2d');
    g.drawImage(T.branch.image, 0, 0);
    const r = rng(78);
    g.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 260; i++) { const x = r() * 256, y = r() * 256; g.fillStyle = `rgba(250,252,255,${0.55 + r() * 0.4})`; g.beginPath(); g.ellipse(x, y, 4 + r() * 8, 2 + r() * 3, 0, 0, 7); g.fill(); }
    T.branchSnow = toTex(c, true, false); T.branchSnow.wrapS = T.branchSnow.wrapT = THREE.ClampToEdgeWrapping;
  }
  // ---- leaf clusters (birch), scale leaves (juniper), fern, dry shrub
  const cardTex = (seed, draw) => { const c = canvas(256), g = c.getContext('2d'), r = rng(seed); g.clearRect(0, 0, 256, 256); draw(g, r); const t = toTex(c, true, false); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t; };
  T.leaves = cardTex(81, (g, r) => {
    for (let i = 0; i < 420; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * 112, x = 128 + Math.cos(a) * d, y = 128 + Math.sin(a) * d * 0.85;
      const sh = 0.6 + r() * 0.55;
      g.fillStyle = `rgb(${Math.round(92 * sh)},${Math.round(138 * sh)},${Math.round(52 * sh)})`;
      g.beginPath(); g.ellipse(x, y, 5 + r() * 4, 3 + r() * 2, r() * 3, 0, 7); g.fill();
    }
  });
  T.juniper = cardTex(82, (g, r) => {
    for (let i = 0; i < 900; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * 115, x = 128 + Math.cos(a) * d, y = 128 + Math.sin(a) * d * 0.8;
      const sh = 0.55 + r() * 0.5;
      g.fillStyle = `rgb(${Math.round(70 * sh)},${Math.round(104 * sh)},${Math.round(80 * sh)})`;
      g.beginPath(); g.arc(x, y, 2.5 + r() * 3, 0, 7); g.fill();
    }
  });
  T.fern = cardTex(83, (g, r) => {
    g.strokeStyle = '#3c5a26'; g.lineWidth = 3; g.beginPath(); g.moveTo(128, 250); g.quadraticCurveTo(120, 120, 128, 8); g.stroke();
    for (let i = 0; i < 26; i++) {
      const t = i / 26, y = 245 - t * 232, x = 128 - Math.sin(t * 3) * 4, l = (1 - Math.abs(t - 0.35) * 1.2) * 70;
      for (const sd of [-1, 1]) {
        const sh = 0.7 + r() * 0.4;
        g.fillStyle = `rgb(${Math.round(70 * sh)},${Math.round(118 * sh)},${Math.round(44 * sh)})`;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sd * l * 0.5, y - 10, x + sd * l, y - 4 - t * 6); g.quadraticCurveTo(x + sd * l * 0.5, y + 2, x, y + 4); g.fill();
      }
    }
  });
  T.shrub = cardTex(84, (g, r) => {
    const twig = (x, y, a, l, d) => {
      if (d > 4 || l < 6) { g.fillStyle = `rgba(${120 + r() * 40},${110 + r() * 30},${60 + r() * 20},1)`; g.beginPath(); g.arc(x, y, 3 + r() * 3, 0, 7); g.fill(); return; }
      const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l;
      g.strokeStyle = '#6b5240'; g.lineWidth = Math.max(1, 4 - d); g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
      twig(x2, y2, a - 0.4 - r() * 0.3, l * 0.72, d + 1); twig(x2, y2, a + 0.4 + r() * 0.3, l * 0.72, d + 1);
    };
    for (let i = 0; i < 5; i++) twig(128 + (r() - 0.5) * 30, 250, -Math.PI / 2 + (r() - 0.5) * 1.2, 50 + r() * 20, 0);
  });

  // ---- soft round puff (dust)
  {
    const c = canvas(64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    T.puff = toTex(c, true, false);
  }

  // ---- tyre tread (normal-ish bump): knobs
  {
    const c = canvas(128), g = c.getContext('2d');
    g.fillStyle = '#202020'; g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 16) for (let x = 0; x < 128; x += 16) {
      g.fillStyle = '#e8e8e8';
      const ox = (y / 16) % 2 ? 8 : 0;
      g.fillRect((x + ox) % 128 + 3, y + 3, 9, 9);
    }
    T.tread = toTex(c, false);
  }

  // ---- carbon/paint flakes for the frame (tiny noise for clearcoat sparkle)
  T.flake = toTex(paint(128, 51, (u, v, N) => { const x = 110 + N(u, v, 64, 2) * 60; return [x, x, x]; }).c, false);
  return T;
}
