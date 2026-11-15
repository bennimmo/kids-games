// Choo Choo Wilf: scenery pieces. Each one draws into merged builders:
// b = solid things, gl = windows/lamps (glow at night), dec = flat ground bits.
const TAU = Math.PI * 2;
const pick = (r, a) => a[(r() * a.length) | 0];
const GREENS = ['#5fb547', '#4caf50', '#7cc24f', '#43a047'];
const HOUSE = ['#fff3e0', '#ffe0b2', '#e3f2fd', '#fce4ec', '#f1f8e9', '#fff9c4'];
const ROOFS = ['#c0392b', '#8d4e2a', '#5d6d7e', '#b03a2e'];
const BRIGHT = ['#e53935', '#fdd835', '#1e88e5', '#8e24aa', '#ff7043', '#ec407a', '#ffffff'];

export const BIG = new Set(['house', 'building', 'igloo', 'hut', 'pond']);

export const SCENERY = {
  tree(b, gl, dec, r) {
    b.part('cyl6', '#795548', 0, 0.75, 0, 0.36, 1.5, 0.36);
    const g = pick(r, GREENS);
    b.part('ball0', g, 0, 2.4, 0, 2.3, 2.1, 2.3, 0, r() * TAU);
    b.part('ball0', g, 0.55, 3.0, 0.3, 1.5, 1.4, 1.5, 0, r() * TAU);
    if (r() < 0.3) for (let i = 0; i < 4; i++) b.part('ball0', '#e53935', Math.cos(i * 1.7) * 0.9, 2.2 + (i % 2) * 0.6, Math.sin(i * 1.7) * 0.9, 0.22, 0.22, 0.22);
  },
  pine(b, gl, dec, r, snow) {
    b.part('cyl6', '#6d4c41', 0, 0.5, 0, 0.32, 1.0, 0.32);
    const g = snow ? '#2e7d4f' : pick(r, ['#2e7d32', '#388e3c', '#1b5e20']);
    const tiers = [[2.6, 1.9, 1.5], [2.0, 1.7, 2.4], [1.35, 1.5, 3.2]];
    for (const [w, h, y] of tiers) {
      b.part('cone6', g, 0, y, 0, w, h, w);
      if (snow) b.part('cone6', '#ffffff', 0, y + h * 0.28, 0, w * 0.6, h * 0.45, w * 0.6);
    }
  },
  snowpine(b, gl, dec, r) { SCENERY.pine(b, gl, dec, r, true); },
  bush(b, gl, dec, r) {
    const g = pick(r, GREENS);
    const n = 2 + ((r() * 2) | 0);
    for (let i = 0; i < n; i++) b.part('ball0', g, (r() - 0.5) * 1.2, 0.45, (r() - 0.5) * 1.2, 1.1 + r() * 0.5, 0.9, 1.1 + r() * 0.5, 0, r() * TAU);
  },
  flowers(b, gl, dec, r) {
    dec.part('cyl6', '#6cbf4a', 0, 0.02, 0, 2.2, 0.03, 2.2);
    for (let i = 0; i < 8; i++) {
      const a = r() * TAU, d = r() * 0.9;
      b.part('ball0', pick(r, BRIGHT), Math.cos(a) * d, 0.22, Math.sin(a) * d, 0.28, 0.2, 0.28);
    }
  },
  mushroom(b, gl, dec, r) {
    b.part('cyl6', '#fff8e1', 0, 0.35, 0, 0.35, 0.7, 0.35);
    b.part('ball', '#e53935', 0, 0.75, 0, 1.1, 0.6, 1.1);
    for (let i = 0; i < 5; i++) b.part('ball0', '#ffffff', Math.cos(i * 1.3) * 0.32, 0.98, Math.sin(i * 1.3) * 0.32, 0.14, 0.08, 0.14);
  },
  rock(b, gl, dec, r, snow) {
    const c = pick(r, ['#9e9e9e', '#8d8478', '#a1a1a1']);
    b.part('dodec', c, 0, 0.35, 0, 1.2 + r() * 0.9, 0.8 + r() * 0.5, 1.1 + r() * 0.7, r(), r() * TAU);
    if (snow) b.part('dodec', '#ffffff', 0, 0.7, 0, 1.0, 0.3, 0.9);
  },
  hay(b, gl, dec, r) {
    b.part('cyl', '#f2c94c', 0, 0.6, 0, 1.2, 1.4, 1.2, 0, 0, Math.PI / 2);
    b.part('cyl', '#e0b23a', 0.71, 0.6, 0, 0.9, 0.02, 0.9, 0, 0, Math.PI / 2);
  },
  pond(b, gl, dec, r, snow, water) {
    dec.part('cyl', '#7c6a4f', 0, 0.025, 0, 5.2, 0.03, 4.2);
    dec.part('cyl', water, 0, 0.04, 0, 4.6, 0.03, 3.6);
    if (!snow) for (let i = 0; i < 4; i++) b.part('cyl6', '#558b2f', 2.2 + r() * 0.3, 0.5, (r() - 0.5) * 2, 0.08, 1.0, 0.08);
  },
  house(b, gl, dec, r, snow) {
    const w = 3 + r() * 1.2, d = 2.6 + r() * 0.8, h = 2.2 + r() * 0.6;
    b.part('box', pick(r, HOUSE), 0, h / 2, 0, w, h, d);
    b.part('roof', snow ? '#ffffff' : pick(r, ROOFS), 0, h, 0, d + 0.4, 1.5, w + 0.4, 0, Math.PI / 2);
    b.part('box', '#8d6e63', w * 0.25, h + 1.0, 0, 0.45, 1.2, 0.45);
    b.part('box', '#6d4c41', 0, 0.55, d / 2 + 0.01, 0.65, 1.1, 0.05);
    for (const x of [-w * 0.3, w * 0.3]) gl.part('box', '', x, h * 0.62, d / 2 + 0.02, 0.6, 0.55, 0.05);
    gl.part('box', '', w / 2 + 0.02, h * 0.6, 0, 0.05, 0.55, 0.6);
    gl.part('box', '', -w / 2 - 0.02, h * 0.6, 0, 0.05, 0.55, 0.6);
  },
  building(b, gl, dec, r) {
    const w = 3.5 + r() * 2, d = 3.5 + r() * 2, h = 5 + r() * 6;
    const c = pick(r, ['#f8bbd0', '#b3e5fc', '#ffe082', '#c5e1a5', '#d1c4e9', '#ffccbc', '#e0e0e0']);
    b.part('box', c, 0, h / 2, 0, w, h, d);
    b.part('box', '#78909c', 0, h + 0.15, 0, w + 0.3, 0.3, d + 0.3);
    b.part('box', '#607d8b', w * 0.2, h + 0.6, -d * 0.2, 0.9, 0.7, 0.9);
    const rows = Math.floor((h - 1) / 1.6), cw = Math.floor(w / 1.2), cd = Math.floor(d / 1.2);
    for (let y = 0; y < rows; y++) {
      const yy = 1.4 + y * 1.6;
      for (let i = 0; i < cw; i++) {
        const x = (i - (cw - 1) / 2) * 1.2;
        gl.part('box', '', x, yy, d / 2 + 0.02, 0.6, 0.7, 0.05);
        gl.part('box', '', x, yy, -d / 2 - 0.02, 0.6, 0.7, 0.05);
      }
      for (let i = 0; i < cd; i++) {
        const z = (i - (cd - 1) / 2) * 1.2;
        gl.part('box', '', w / 2 + 0.02, yy, z, 0.05, 0.7, 0.6);
        gl.part('box', '', -w / 2 - 0.02, yy, z, 0.05, 0.7, 0.6);
      }
    }
  },
  lamp(b, gl) {
    b.part('cyl6', '#37474f', 0, 1.6, 0, 0.14, 3.2, 0.14);
    b.part('box', '#37474f', 0.35, 3.15, 0, 0.8, 0.1, 0.12);
    gl.part('box', '', 0.7, 3.0, 0, 0.35, 0.25, 0.35);
  },
  snowman(b, gl, dec, r) {
    b.part('ball', '#ffffff', 0, 0.6, 0, 1.3, 1.2, 1.3);
    b.part('ball', '#ffffff', 0, 1.5, 0, 0.9, 0.85, 0.9);
    b.part('ball', '#ffffff', 0, 2.15, 0, 0.62, 0.6, 0.62);
    b.part('cone6', '#ff6d00', 0, 2.15, 0.45, 0.13, 0.45, 0.13, Math.PI / 2);
    for (const s of [-1, 1]) b.part('ball0', '#111', s * 0.13, 2.28, 0.27, 0.09, 0.09, 0.09);
    b.part('cyl', '#212121', 0, 2.55, 0, 0.6, 0.06, 0.6);
    b.part('cyl', '#212121', 0, 2.75, 0, 0.42, 0.42, 0.42);
    b.part('box', '#e53935', 0, 1.88, 0, 0.75, 0.14, 0.75);
    for (const s of [-1, 1]) b.part('box', '#6d4c41', s * 0.75, 1.6, 0, 0.8, 0.07, 0.07, 0, 0, s * 0.5);
  },
  igloo(b, gl, dec) {
    b.part('ball', '#f5fbff', 0, 0, 0, 3.4, 2.6, 3.4);
    b.part('box', '#e3f2fd', 0, 0.45, 1.6, 0.95, 0.9, 0.9);
    b.part('box', '#37474f', 0, 0.4, 2.06, 0.6, 0.65, 0.04);
  },
  palm(b, gl, dec, r) {
    let x = 0, y = 0, lean = 0.12 + r() * 0.15;
    for (let i = 0; i < 6; i++) {
      b.part('cyl6', i % 2 ? '#a1887f' : '#8d6e63', x, y + 0.35, 0, 0.32 - i * 0.02, 0.75, 0.32 - i * 0.02, 0, 0, -lean * i * 0.5);
      x += Math.sin(lean * i * 0.5) * 0.7; y += 0.7;
    }
    for (let i = 0; i < 7; i++) {
      const a = i / 7 * TAU;
      b.part('box', i % 2 ? '#43a047' : '#66bb6a', x + Math.cos(a) * 0.9, y + 0.05, Math.sin(a) * 0.9, 1.9, 0.07, 0.5, 0, -a, -0.45);
    }
    for (let i = 0; i < 3; i++) b.part('ball0', '#6d4c41', x + Math.cos(i * 2) * 0.25, y - 0.2, Math.sin(i * 2) * 0.25, 0.3, 0.3, 0.3);
  },
  hut(b, gl, dec, r) {
    const c = pick(r, ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#ab47bc']);
    for (let i = 0; i < 5; i++) b.part('box', i % 2 ? '#ffffff' : c, -0.8 + i * 0.4, 1.0, 0, 0.4, 2.0, 1.8);
    b.part('roof', '#ffffff', 0, 2.0, 0, 2.3, 0.9, 2.1);
    b.part('box', '#5d4037', 0, 0.75, 0.91, 0.6, 1.3, 0.04);
  },
  parasol(b, gl, dec, r) {
    b.part('cyl6', '#eeeeee', 0, 1.1, 0, 0.1, 2.2, 0.1);
    const c = pick(r, BRIGHT);
    b.part('cone', c, 0, 2.35, 0, 2.6, 0.6, 2.6);
    dec.part('box', pick(r, BRIGHT), 1.2, 0.03, 0.3, 0.9, 0.03, 1.8);
  },
};

export function pickItem(r, items, big) {
  let total = 0;
  for (const k in items) if (big || !BIG.has(k)) total += items[k];
  let x = r() * total;
  for (const k in items) {
    if (!big && BIG.has(k)) continue;
    x -= items[k];
    if (x <= 0) return k;
  }
  return 'bush';
}
