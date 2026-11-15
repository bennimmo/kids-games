// The 2D track designer view (top-down). Same drawing as Raffy Race:
// drag to draw a loop, drag extras on. Crossings show a 🚀 jump / 🌉 bridge
// badge: tap it to switch.
import { WORLD, TRACK_W, JUMP_L, WATER_RX, WATER_RY, BOOST_L } from '../race-track/track.js';
import { RAMP } from './course.js';
import { THEMES, PLANT_ICON } from './themes.js';

export const EXTRA_ICON = { box: '❓', boost: '⏩', jump: '🛹', mud: '🟤', ice: '🧊', water: '💧', cone: '🔺', tyres: '⚫', tree: '🌳', stand: '🏟️' };

function pathOf(g, pts, from = 0, to = pts.length, closed = true) {
  g.beginPath();
  const n = pts.length;
  for (let k = from; k <= to; k++) {
    const p = pts[((k % n) + n) % n];
    if (k === from) g.moveTo(p.x, p.y); else g.lineTo(p.x, p.y);
  }
  if (closed && from === 0 && to === n) g.closePath();
}

// draw one course (track + extras) in world units into g
export function drawCourse(g, course, items, theme, time = 0, opts = {}) {
  const T = THEMES[theme] || THEMES.country;
  const pts = course.pts, n = course.n;
  g.lineJoin = 'round'; g.lineCap = 'round';
  // kerbs, then road
  pathOf(g, pts);
  g.strokeStyle = T.kerb[1]; g.lineWidth = TRACK_W + 14; g.stroke();
  g.setLineDash([16, 16]); g.strokeStyle = T.kerb[0]; g.stroke(); g.setLineDash([]);
  g.strokeStyle = T.ed.road; g.lineWidth = TRACK_W; g.stroke();
  g.setLineDash([22, 22]); g.strokeStyle = T.ed.line; g.globalAlpha = 0.7; g.lineWidth = 3; g.stroke(); g.setLineDash([]); g.globalAlpha = 1;

  // the parts that go over the top
  course.crossings.forEach(c => {
    const reach = Math.ceil((c.half + RAMP) / 12);
    const seg = (a, b) => { pathOf(g, pts, c.top + a, c.top + b, false); };
    g.save();
    g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 14; g.shadowOffsetY = 8;
    if (c.mode === 'bridge') {
      seg(-reach, reach);
      g.strokeStyle = '#eceff1'; g.lineWidth = TRACK_W + 16; g.stroke();
      g.shadowColor = 'transparent';
      g.strokeStyle = T.ed.road; g.lineWidth = TRACK_W; g.stroke();
    } else {
      const gap = Math.ceil(c.half / 12);
      for (const [a, b] of [[-reach, -gap], [gap, reach]]) {
        seg(a, b);
        g.strokeStyle = '#ffd600'; g.lineWidth = TRACK_W + 14; g.stroke();
        g.shadowColor = 'transparent';
        g.strokeStyle = T.ed.road; g.lineWidth = TRACK_W; g.stroke();
        g.shadowColor = 'rgba(0,0,0,.45)';
      }
      g.shadowColor = 'transparent';
      // chevrons pointing over the gap
      for (let o = -reach + 3; o < -gap; o += 4) {
        const p = pts[((c.top + o) % n + n) % n];
        g.save(); g.translate(p.x, p.y); g.rotate(p.a);
        g.strokeStyle = '#ffd600'; g.lineWidth = 6;
        g.beginPath(); g.moveTo(-8, -26); g.lineTo(8, 0); g.lineTo(-8, 26); g.stroke();
        g.restore();
      }
    }
    g.restore();
  });

  // start line
  const s = pts[0];
  g.save(); g.translate(s.x, s.y); g.rotate(s.a);
  for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#111' : '#fff'; g.fillRect(-8 + j * 8, -TRACK_W / 2 + i * TRACK_W / 8, 8, TRACK_W / 8); }
  g.restore();

  for (const it of items) drawExtra(g, it, T, time);

  // crossing badges
  if (opts.badges) course.crossings.forEach(c => {
    const pulse = (1 + Math.sin(time * 4) * 0.06) * (opts.badgeScale || 1);
    g.save(); g.translate(c.x, c.y); g.scale(pulse, pulse);
    g.fillStyle = c.mode === 'jump' ? '#ff6d00' : '#546e7a';
    g.strokeStyle = '#fff'; g.lineWidth = 5;
    g.beginPath(); g.arc(0, 0, 30, 0, 7); g.fill(); g.stroke();
    g.font = '34px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(c.mode === 'jump' ? '🚀' : '🌉', 0, 2);
    g.restore();
  });
}

export function drawExtra(g, it, T, time = 0) {
  g.save(); g.translate(it.x, it.y); g.rotate(it.a || 0);
  const emoji = (e, size = 30) => { g.rotate(-(it.a || 0)); g.font = `${size}px serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e, 0, 2); };
  switch (it.type) {
    case 'box':
      for (const o of [-30, -10, 10, 30]) {
        g.save(); g.translate(0, o); g.rotate(time * 1.5);
        g.fillStyle = `hsl(${(time * 120 + o * 3) % 360},90%,60%)`; g.fillRect(-7, -7, 14, 14);
        g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(-7, -7, 14, 14);
        g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 0, 1);
        g.restore();
      }
      break;
    case 'boost':
      g.fillStyle = '#ff9100'; g.fillRect(-BOOST_L / 2, -TRACK_W * 0.4, BOOST_L, TRACK_W * 0.8);
      g.strokeStyle = '#fff59d'; g.lineWidth = 5;
      for (const x of [-10, 8]) { g.beginPath(); g.moveTo(x - 6, -14); g.lineTo(x + 6, 0); g.lineTo(x - 6, 14); g.stroke(); }
      break;
    case 'jump': {
      const gr = g.createLinearGradient(-JUMP_L / 2, 0, JUMP_L / 2, 0);
      gr.addColorStop(0, '#fff176'); gr.addColorStop(1, '#e53935');
      g.fillStyle = gr; g.fillRect(-JUMP_L / 2, -TRACK_W * 0.45, JUMP_L, TRACK_W * 0.9);
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(-JUMP_L / 2, -TRACK_W * 0.45, JUMP_L, TRACK_W * 0.9);
      break;
    }
    case 'mud': case 'water': case 'ice':
      g.fillStyle = it.type === 'mud' ? '#6d4c41' : it.type === 'water' ? 'rgba(41,182,246,.85)' : 'rgba(225,245,254,.95)';
      g.beginPath(); g.ellipse(0, 0, WATER_RX, WATER_RY, 0, 0, 7); g.fill();
      if (it.type === 'ice') { g.strokeStyle = '#81d4fa'; g.lineWidth = 3; g.stroke(); }
      break;
    case 'cone':
      g.fillStyle = '#ff6d00'; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 3.5, 0, 7); g.fill();
      break;
    case 'tyres':
      for (const [x, y] of [[0, 0], [-11, 6], [11, 6], [-11, -6], [11, -6], [0, -12], [0, 12]]) { g.fillStyle = '#222'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); g.fillStyle = T.kerb[0]; g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); }
      break;
    case 'tree': emoji(PLANT_ICON[T.plant] || '🌳', 38); break;
    case 'stand':
      g.fillStyle = '#90a4ae'; g.fillRect(-72, -24, 144, 48);
      g.fillStyle = T.kerb[0]; g.fillRect(-72, -24, 144, 8);
      for (let i = 0; i < 16; i++) { g.fillStyle = ['#e53935', '#1e88e5', '#fdd835', '#43a047'][i % 4]; g.beginPath(); g.arc(-64 + i * 8.5, 4 + (i % 2) * 8, 3, 0, 7); g.fill(); }
      break;
  }
  g.restore();
}

export function createEditor(view) {
  const E = { course: null, items: [], theme: 'country', scale: 1, ox: 0, oy: 0, deco: [] };

  function fit(insets) {
    const w = view.width, h = view.height - insets.top - insets.bottom;
    E.scale = Math.min((w - 20) / WORLD.w, (h - 10) / WORLD.h);
    E.ox = (w - WORLD.w * E.scale) / 2;
    E.oy = insets.top + (h - WORLD.h * E.scale) / 2;
  }
  function makeDeco() {
    const T = THEMES[E.theme];
    const set = { lamp: ['🏢', '🏬', '🚕', '🌳'], tree: ['🌳', '🌲', '🐑', '🌼'], cactus: ['🌵', '🪨', '🌵', '🦎'], pine: ['🌲', '⛄', '🌲', '❄️'], palm: ['🌴', '⛱️', '🐚', '🦀'], deadtree: ['🪨', '🔥', '🪨', '🌋'], lolly: ['🍭', '🍬', '🧁', '🍦'], crystal: ['💎', '🪨', '🛰️', '👽'] }[T.plant] || ['🌳'];
    E.deco = [];
    let a = 7;
    const rnd = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
    for (let i = 0; i < 46; i++) E.deco.push({ x: rnd() * WORLD.w, y: rnd() * WORLD.h, e: set[i % set.length], s: 22 + rnd() * 16 });
  }
  makeDeco();

  return {
    setScene(course, items, theme) {
      const changed = theme !== E.theme;
      E.course = course; E.items = items; E.theme = theme;
      if (changed) makeDeco();
    },
    toWorld(cx, cy) {
      const r = view.canvas.getBoundingClientRect();
      return { x: (cx - r.left - E.ox) / E.scale, y: (cy - r.top - E.oy) / E.scale };
    },
    crossingAt(w) {
      if (!E.course) return -1;
      return E.course.crossings.findIndex(c => Math.hypot(c.x - w.x, c.y - w.y) < 40 * Math.max(1, 0.95 / E.scale));
    },
    frame({ insets, stroke, drag, hint, time }) {
      const g = view.ctx, T = THEMES[E.theme];
      fit(insets);
      g.fillStyle = T.ed.dots; g.fillRect(0, 0, view.width, view.height);
      g.save();
      g.translate(E.ox, E.oy); g.scale(E.scale, E.scale);
      // ground
      g.fillStyle = T.ed.bg;
      g.beginPath(); g.roundRect(0, 0, WORLD.w, WORLD.h, 30); g.fill();
      g.save(); g.clip();
      g.fillStyle = T.ed.dots;
      for (let x = 20; x < WORLD.w; x += 40) for (let y = 20; y < WORLD.h; y += 40) g.fillRect(x, y, 3, 3);
      g.globalAlpha = 0.35; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const d of E.deco) { g.font = `${d.s}px serif`; g.fillText(d.e, d.x, d.y); }
      g.globalAlpha = 1;
      if (E.course) drawCourse(g, E.course, E.items, E.theme, time, { badges: true, badgeScale: Math.max(1, 0.95 / E.scale) });
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 6;
      g.beginPath(); g.roundRect(0, 0, WORLD.w, WORLD.h, 30); g.stroke();
      if (stroke && stroke.length > 1) {
        g.lineJoin = 'round'; g.lineCap = 'round';
        g.beginPath(); stroke.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
        g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = TRACK_W; g.stroke();
        g.strokeStyle = T.ed.road; g.lineWidth = TRACK_W * 0.8; g.stroke();
      }
      if (drag) { g.globalAlpha = 0.85; drawExtra(g, drag, T, time); g.globalAlpha = 1; }
      if (hint) {
        const k = (time * 0.5) % 1;
        const a = k * Math.PI * 2;
        const x = WORLD.w / 2 + Math.cos(a) * 420, y = WORLD.h / 2 + Math.sin(a * 2) * 220;
        g.font = '90px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('👆', x, y + 40);
        g.globalAlpha = 0.5; g.strokeStyle = '#fff'; g.lineWidth = 10; g.setLineDash([20, 20]);
        g.beginPath();
        for (let t = 0; t <= 1.001; t += 0.01) { const b = t * Math.PI * 2; const px = WORLD.w / 2 + Math.cos(b) * 420, py = WORLD.h / 2 + Math.sin(b * 2) * 220; t ? g.lineTo(px, py) : g.moveTo(px, py); }
        g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
      }
      g.restore();
    },
  };
}

// small picture of a saved track
export function drawThumb(canvas, course, items, theme) {
  const g = canvas.getContext('2d');
  const T = THEMES[theme] || THEMES.country;
  const s = Math.min(canvas.width / WORLD.w, canvas.height / WORLD.h);
  g.fillStyle = T.ed.bg; g.fillRect(0, 0, canvas.width, canvas.height);
  g.save();
  g.translate((canvas.width - WORLD.w * s) / 2, (canvas.height - WORLD.h * s) / 2); g.scale(s, s);
  drawCourse(g, course, items, theme, 0, { badges: false });
  g.restore();
  g.font = '28px serif'; g.textAlign = 'left'; g.textBaseline = 'top';
  g.fillText(T.icon, 6, 4);
}
