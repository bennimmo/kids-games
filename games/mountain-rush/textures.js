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

export function makeTextures(size = 512) {
  const T = {};
  // ---- grass ground (under the blades): mixed greens, dry bits, moss
  T.grass = toTex(paint(size, 11, (u, v, N) => {
    const a = N(u, v, 4, 6), b = N(u + 0.3, v, 32, 3), dry = N(u, v + 0.5, 3, 3);
    const k = a * 0.7 + b * 0.3;
    let r = 52 + k * 50, g2 = 78 + k * 62, bl = 28 + k * 22;
    const d = Math.max(0, dry - 0.55) * 3;
    r += d * 60; g2 += d * 25; bl += d * 10;
    return [r, g2, bl];
  }).c);

  // ---- forest floor (needles and earth, under trees)
  T.floor = toTex(paint(size, 19, (u, v, N) => {
    const a = N(u, v, 6, 6), n = N(u, v, 64, 2);
    const k = a * 0.6 + n * 0.4;
    return [70 + k * 55, 52 + k * 38, 34 + k * 22];
  }).c);

  // ---- dirt trail: packed brown earth with a few stones
  const k5 = size / 512;
  {
    const { c, g } = paint(size, 23, (u, v, N) => {
      const a = N(u, v, 3, 5), b = N(u + 0.5, v, 12, 3), f = N(u, v + 0.3, 40, 2);
      const k = 0.86 + a * 0.22 + (b - 0.5) * 0.12 + (f - 0.5) * 0.06;
      return [128 * k, 93 * k, 63 * k];
    });
    stones(g, size, 5, 70, 1.2 * k5, 3 * k5, [['#cbb89c', '#8a755e'], ['#b3a08a', '#76634f']]);
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
    let r = k, g2 = k * 0.98, bl = k * 0.94;
    if (lic > 0.62) { const m = (lic - 0.62) * 3; r = r * (1 - m) + 150 * m; g2 = g2 * (1 - m) + 160 * m; bl = bl * (1 - m) + 95 * m; }
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
