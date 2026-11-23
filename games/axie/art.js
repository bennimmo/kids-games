// Axie Pals – hand-drawn tank things (instead of emoji).
// Each drawer works in a 100 x 100 box centred on (0, 0); floor things stand on y = 50.
// drawThing(ctx, id, x, y, size, t, rot, alpha) – falls back to the emoji if there's no drawing.
import { ITEMS, FOODS } from './items.js';

const TAU = Math.PI * 2;

function lin(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
function rad(ctx, x, y, r0, r1, stops, fx = x, fy = y) {
  const g = ctx.createRadialGradient(fx, fy, r0, x, y, r1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
const shine = (ctx, x, y, rx, ry, a = 0.55, rot = -0.4) => {
  ctx.fillStyle = `rgba(255,255,255,${a})`;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fill();
};
const outline = (ctx, c = 'rgba(40,25,30,.35)', w = 2) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); };

const ART = {
  rock(ctx) {
    ctx.fillStyle = lin(ctx, 0, -30, 0, 50, [[0, '#b9c2cc'], [0.6, '#7d8894'], [1, '#55606b']]);
    ctx.beginPath();
    ctx.moveTo(-46, 50); ctx.quadraticCurveTo(-50, 10, -26, -10); ctx.quadraticCurveTo(-8, -34, 14, -22);
    ctx.quadraticCurveTo(40, -14, 46, 14); ctx.quadraticCurveTo(50, 40, 44, 50); ctx.closePath();
    ctx.fill(); outline(ctx, 'rgba(30,35,45,.4)');
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.moveTo(-24, -6); ctx.quadraticCurveTo(-4, -28, 14, -18); ctx.quadraticCurveTo(-4, -14, -14, 6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(30,35,45,.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(8, -18); ctx.quadraticCurveTo(4, 10, 14, 48); ctx.stroke();
    // moss
    ctx.fillStyle = '#5fae4f';
    for (const [x, y, r] of [[-30, 44, 8], [-20, 47, 6], [30, 46, 7], [38, 42, 5], [-36, 36, 5]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  },

  plant(ctx, t) {
    const blades = [[-26, 70, -0.5], [-14, 92, -0.25], [0, 100, 0], [14, 88, 0.22], [26, 66, 0.5], [-6, 60, -0.1], [8, 56, 0.12]];
    blades.forEach(([bx, h, lean], i) => {
      const sw = Math.sin(t * 1.2 + i) * 6;
      const tipx = bx + lean * h * 0.6 + sw, tipy = 50 - h;
      ctx.fillStyle = lin(ctx, 0, 50, 0, tipy, [[0, '#1f6b34'], [0.5, '#3fa04a'], [1, '#9be36b']]);
      ctx.beginPath();
      ctx.moveTo(bx - 5, 50);
      ctx.quadraticCurveTo(bx - 9 + lean * h * 0.3 + sw * 0.5, 50 - h * 0.5, tipx, tipy);
      ctx.quadraticCurveTo(bx + 9 + lean * h * 0.3 + sw * 0.5, 50 - h * 0.5, bx + 5, 50);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(bx, 48); ctx.quadraticCurveTo(bx + lean * h * 0.3 + sw * 0.5, 50 - h * 0.5, tipx, tipy + 4); ctx.stroke();
    });
  },

  coral(ctx, t) {
    const col = lin(ctx, 0, 50, 0, -50, [[0, '#d9485f'], [1, '#ff9a8b']]);
    ctx.strokeStyle = col; ctx.lineCap = 'round';
    const branch = (x, y, ang, len, w, d) => {
      const sw = Math.sin(t * 0.8 + d + x * 0.1) * 0.04;
      const ex = x + Math.cos(ang + sw) * len, ey = y + Math.sin(ang + sw) * len;
      ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
      if (d < 3) { branch(ex, ey, ang - 0.45, len * 0.72, w * 0.72, d + 1); branch(ex, ey, ang + 0.42, len * 0.7, w * 0.72, d + 1); }
      else { ctx.fillStyle = '#ffd1c7'; ctx.beginPath(); ctx.arc(ex, ey, w * 0.7, 0, TAU); ctx.fill(); }
    };
    branch(0, 50, -Math.PI / 2, 34, 12, 0);
    ctx.fillStyle = 'rgba(255,240,235,.8)';
    for (const [x, y] of [[-14, -2], [10, 8], [-4, 20], [18, -14], [-22, -20], [4, -26]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
  },

  shell(ctx) {
    ctx.save();
    ctx.translate(0, 18);
    ctx.fillStyle = rad(ctx, 0, 30, 4, 60, [[0, '#fff3e8'], [0.6, '#ffc7b0'], [1, '#e58e7a']]);
    ctx.beginPath();
    ctx.moveTo(-8, 30);
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + i * Math.PI / 8;
      const r = 40, r2 = 44;
      const x1 = Math.cos(a - Math.PI / 16) * r2, y1 = Math.sin(a - Math.PI / 16) * r2;
      const x2 = Math.cos(a) * r, y2 = Math.sin(a) * r;
      if (i) ctx.quadraticCurveTo(x1, y1 + 10, x2, y2 + 10);
      else ctx.lineTo(x2, y2 + 10);
    }
    ctx.lineTo(8, 30); ctx.closePath(); ctx.fill(); outline(ctx, 'rgba(150,70,60,.45)');
    ctx.strokeStyle = 'rgba(180,90,70,.45)'; ctx.lineWidth = 1.6;
    for (let i = 1; i < 8; i++) { const a = Math.PI + i * Math.PI / 8; ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(Math.cos(a) * 38, Math.sin(a) * 38 + 10); ctx.stroke(); }
    ctx.fillStyle = '#f2a48f';
    ctx.beginPath(); ctx.moveTo(-14, 26); ctx.lineTo(-6, 34); ctx.lineTo(6, 34); ctx.lineTo(14, 26); ctx.closePath(); ctx.fill();
    shine(ctx, -14, -12, 9, 4, 0.5);
    ctx.restore();
  },

  castle(ctx, t) {
    const stone = lin(ctx, -50, 0, 50, 0, [[0, '#c9c2b5'], [0.5, '#e6dfd2'], [1, '#a59d90']]);
    const tower = (x, w, top, roof) => {
      ctx.fillStyle = stone;
      ctx.fillRect(x - w / 2, top, w, 50 - top);
      for (let i = 0; i < 3; i++) ctx.fillRect(x - w / 2 + i * (w / 2.5), top - 7, w / 4, 8);
      ctx.strokeStyle = 'rgba(80,70,60,.25)'; ctx.lineWidth = 1;
      for (let y = top + 8; y < 50; y += 9) {
        ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.stroke();
        const off = ((y / 9) % 2) * 5;
        for (let bx = x - w / 2 + off; bx < x + w / 2; bx += 10) { ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx, y + 9); ctx.stroke(); }
      }
      if (roof) {
        ctx.fillStyle = lin(ctx, 0, top - 34, 0, top, [[0, '#e04f4f'], [1, '#a32929']]);
        ctx.beginPath(); ctx.moveTo(x - w / 2 - 4, top - 6); ctx.lineTo(x, top - 34); ctx.lineTo(x + w / 2 + 4, top - 6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, top - 34); ctx.lineTo(x, top - 46); ctx.stroke();
        ctx.fillStyle = '#ffcf33';
        const wv = Math.sin(t * 3 + x) * 2;
        ctx.beginPath(); ctx.moveTo(x, top - 46); ctx.quadraticCurveTo(x + 6, top - 44 + wv, x + 12, top - 42); ctx.lineTo(x, top - 38); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = '#3b3550';
      ctx.beginPath(); ctx.moveTo(x - 3, top + 18); ctx.lineTo(x - 3, top + 12); ctx.arc(x, top + 12, 3, Math.PI, 0); ctx.lineTo(x + 3, top + 18); ctx.closePath(); ctx.fill();
    };
    tower(-30, 22, -14, true);
    tower(30, 22, -14, true);
    tower(0, 34, -30, true);
    ctx.fillStyle = stone; ctx.fillRect(-20, 4, 40, 46);
    // door
    ctx.fillStyle = lin(ctx, 0, 20, 0, 50, [[0, '#6b4226'], [1, '#3e2414']]);
    ctx.beginPath(); ctx.moveTo(-9, 50); ctx.lineTo(-9, 30); ctx.arc(0, 30, 9, Math.PI, 0); ctx.lineTo(9, 50); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1;
    for (let x = -5; x <= 5; x += 5) { ctx.beginPath(); ctx.moveTo(x, 24); ctx.lineTo(x, 50); ctx.stroke(); }
    // moss
    ctx.fillStyle = 'rgba(80,160,70,.85)';
    for (const [x, y, r] of [[-38, 48, 6], [-24, 49, 5], [22, 48, 6], [38, 47, 5], [-12, 49, 4]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  },

  chest(ctx, t) {
    // glow of gold
    ctx.fillStyle = rad(ctx, 0, -6, 2, 40, [[0, 'rgba(255,220,90,.55)'], [1, 'rgba(255,220,90,0)']]);
    ctx.beginPath(); ctx.arc(0, -6, 40, 0, TAU); ctx.fill();
    // coins
    ctx.fillStyle = '#ffcd38';
    ctx.beginPath(); ctx.ellipse(0, -2, 34, 12, 0, 0, TAU); ctx.fill();
    for (const [x, y] of [[-16, -6], [-4, -10], [10, -7], [20, -3], [2, -2]]) {
      ctx.fillStyle = '#ffdf6e'; ctx.beginPath(); ctx.ellipse(x, y, 6, 3.5, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#c99410'; ctx.lineWidth = 1; ctx.stroke();
    }
    // lid (open)
    ctx.fillStyle = lin(ctx, 0, -40, 0, -6, [[0, '#a8663a'], [1, '#6e3d1f']]);
    ctx.beginPath(); ctx.moveTo(-38, -4); ctx.lineTo(-34, -34); ctx.quadraticCurveTo(0, -46, 34, -34); ctx.lineTo(38, -4); ctx.closePath(); ctx.fill(); outline(ctx);
    // box
    ctx.fillStyle = lin(ctx, 0, 0, 0, 50, [[0, '#a8663a'], [1, '#5c3218']]);
    ctx.beginPath(); ctx.roundRect(-40, 2, 80, 48, 6); ctx.fill(); outline(ctx);
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1.2;
    for (const y of [18, 34]) { ctx.beginPath(); ctx.moveTo(-40, y); ctx.lineTo(40, y); ctx.stroke(); }
    // gold bands + lock
    ctx.fillStyle = lin(ctx, 0, 0, 0, 50, [[0, '#ffe07a'], [1, '#c99410']]);
    for (const x of [-30, 24]) ctx.fillRect(x, 2, 6, 48);
    ctx.beginPath(); ctx.roundRect(-7, 6, 14, 16, 3); ctx.fill();
    ctx.fillStyle = '#5c3218'; ctx.beginPath(); ctx.arc(0, 13, 2.4, 0, TAU); ctx.fill(); ctx.fillRect(-1, 13, 2, 5);
    // twinkle
    const k = (Math.sin(t * 3) + 1) / 2;
    ctx.fillStyle = `rgba(255,255,255,${k})`;
    ctx.beginPath(); ctx.moveTo(14, -22); ctx.lineTo(16, -16); ctx.lineTo(22, -14); ctx.lineTo(16, -12); ctx.lineTo(14, -6); ctx.lineTo(12, -12); ctx.lineTo(6, -14); ctx.lineTo(12, -16); ctx.closePath(); ctx.fill();
  },

  mushroom(ctx) {
    ctx.fillStyle = lin(ctx, -10, 0, 10, 0, [[0, '#efe6d8'], [0.5, '#fffaf0'], [1, '#d8cbb6']]);
    ctx.beginPath(); ctx.moveTo(-10, 50); ctx.quadraticCurveTo(-14, 20, -8, 0); ctx.lineTo(8, 0); ctx.quadraticCurveTo(14, 20, 10, 50); ctx.closePath(); ctx.fill(); outline(ctx, 'rgba(90,70,50,.3)');
    ctx.fillStyle = rad(ctx, -10, -26, 4, 50, [[0, '#ff7a6b'], [0.6, '#e53935'], [1, '#a31f1f']]);
    ctx.beginPath(); ctx.moveTo(-44, 4); ctx.quadraticCurveTo(-44, -38, 0, -40); ctx.quadraticCurveTo(44, -38, 44, 4); ctx.quadraticCurveTo(0, 12, -44, 4); ctx.closePath(); ctx.fill(); outline(ctx, 'rgba(90,20,20,.4)');
    ctx.fillStyle = '#fff6ec';
    for (const [x, y, r] of [[-22, -16, 7], [4, -28, 6], [24, -12, 7], [-4, -8, 4], [34, -2, 3.5], [-34, -2, 3.5]]) { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.8, 0, 0, TAU); ctx.fill(); }
    shine(ctx, -18, -28, 10, 4, 0.35);
  },

  anchor(ctx) {
    const metal = lin(ctx, -30, 0, 30, 0, [[0, '#4d6475'], [0.5, '#8aa3b5'], [1, '#3c4f5d']]);
    ctx.strokeStyle = metal; ctx.lineCap = 'round';
    ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 40); ctx.stroke();
    ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(18, -18); ctx.stroke();
    ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 4, 38, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke();
    ctx.fillStyle = metal;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 27, 32); ctx.lineTo(s * 38, 20); ctx.lineTo(s * 34, 38); ctx.closePath(); ctx.fill(); }
    ctx.lineWidth = 6; ctx.strokeStyle = metal; ctx.beginPath(); ctx.arc(0, -38, 8, 0, TAU); ctx.stroke();
    // rust spots
    ctx.fillStyle = 'rgba(170,90,40,.55)';
    for (const [x, y, r] of [[2, 10, 3], [-12, 36, 3], [16, 34, 2.5], [-6, -18, 2]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  },

  bubbler(ctx) {
    ctx.fillStyle = lin(ctx, 0, 30, 0, 50, [[0, '#9aa7b3'], [1, '#55626e']]);
    ctx.beginPath(); ctx.ellipse(0, 42, 26, 10, 0, 0, TAU); ctx.fill(); outline(ctx);
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(-18 + (i % 6) * 7, 39 + Math.floor(i / 6) * 5, 1.2, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = 'rgba(200,230,240,.6)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(24, 42); ctx.quadraticCurveTo(46, 40, 50, 10); ctx.stroke();
  },

  ball(ctx) {
    const cols = ['#ef4444', '#facc15', '#3b82f6', '#ffffff', '#22c55e', '#ffffff'];
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = cols[i];
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 46, i * TAU / 6, (i + 1) * TAU / 6); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = rad(ctx, -14, -16, 2, 60, [[0, 'rgba(255,255,255,.45)'], [0.5, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,.35)']]);
    ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); outline(ctx, 'rgba(0,0,0,.3)');
    shine(ctx, -18, -22, 10, 5, 0.6);
  },

  duck(ctx, t) {
    ctx.save();
    ctx.rotate(Math.sin(t * 2) * 0.06);
    ctx.fillStyle = rad(ctx, -6, -6, 4, 60, [[0, '#fff27a'], [0.7, '#ffd21f'], [1, '#e6a800']]);
    ctx.beginPath(); ctx.ellipse(-4, 16, 42, 24, 0, 0, TAU); ctx.fill(); outline(ctx, 'rgba(150,100,0,.4)');
    ctx.beginPath(); ctx.moveTo(-40, 6); ctx.quadraticCurveTo(-52, -6, -44, -14); ctx.quadraticCurveTo(-36, 0, -28, 4); ctx.fill();
    ctx.beginPath(); ctx.arc(18, -16, 22, 0, TAU); ctx.fill(); outline(ctx, 'rgba(150,100,0,.4)');
    ctx.fillStyle = '#ff8a1f';
    ctx.beginPath(); ctx.moveTo(36, -14); ctx.quadraticCurveTo(52, -14, 52, -8); ctx.quadraticCurveTo(46, -2, 34, -6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1d1b2c'; ctx.beginPath(); ctx.arc(24, -20, 3.5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(25, -21, 1.2, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f5b800';
    ctx.beginPath(); ctx.ellipse(-10, 12, 18, 9, -0.3, 0, TAU); ctx.fill();
    shine(ctx, 8, -26, 7, 3.5, 0.6);
    ctx.restore();
  },

  crab(ctx, t) {
    const walk = Math.sin(t * 10);
    ctx.strokeStyle = '#c62828'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
      const lift = (i % 2 ? walk : -walk) * 4;
      ctx.beginPath(); ctx.moveTo(s * 14, 24 + i * 4); ctx.lineTo(s * (30 + i * 4), 30 + i * 5 - lift); ctx.lineTo(s * (36 + i * 4), 46 - lift); ctx.stroke();
    }
    // claws
    for (const s of [-1, 1]) {
      const snap = Math.max(0, Math.sin(t * 4 + s)) * 0.4;
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(s * 18, 14); ctx.lineTo(s * 30, -2); ctx.stroke();
      ctx.fillStyle = '#ef5350';
      ctx.save(); ctx.translate(s * 32, -8);
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 8, s * 0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ff8a80';
      ctx.rotate(s * (-0.6 - snap));
      ctx.beginPath(); ctx.ellipse(s * 4, -8, 4, 7, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = rad(ctx, -6, 10, 2, 40, [[0, '#ff8a80'], [0.6, '#ef5350'], [1, '#b71c1c']]);
    ctx.beginPath(); ctx.ellipse(0, 22, 26, 16, 0, 0, TAU); ctx.fill(); outline(ctx, 'rgba(100,0,0,.4)');
    // eyes on stalks
    ctx.strokeStyle = '#c62828'; ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 7, 10); ctx.lineTo(s * 9, 0); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s * 9, -2, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1d1b2c'; ctx.beginPath(); ctx.arc(s * 9 + 1, -2, 2.4, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = '#7f1010'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 22, 6, 0.2, Math.PI - 0.2); ctx.stroke();
    shine(ctx, -10, 14, 7, 3, 0.4);
  },

  snail(ctx, t) {
    const stretch = Math.sin(t * 2) * 2;
    ctx.fillStyle = lin(ctx, 0, 30, 0, 50, [[0, '#d9c3a0'], [1, '#a78b64']]);
    ctx.beginPath(); ctx.moveTo(-40, 48); ctx.quadraticCurveTo(-40, 34, -20, 34); ctx.lineTo(28 + stretch, 30); ctx.quadraticCurveTo(44 + stretch, 30, 42 + stretch, 48); ctx.closePath(); ctx.fill(); outline(ctx, 'rgba(90,70,40,.35)');
    ctx.strokeStyle = '#a78b64'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const dx of [0, 8]) { ctx.beginPath(); ctx.moveTo(30 + stretch + dx * 0.3, 32); ctx.lineTo(32 + dx + stretch, 10); ctx.stroke(); ctx.fillStyle = '#5c4630'; ctx.beginPath(); ctx.arc(32 + dx + stretch, 9, 3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = rad(ctx, -10, 0, 2, 34, [[0, '#ffcc80'], [0.6, '#e08a3c'], [1, '#9c5320']]);
    ctx.beginPath(); ctx.arc(-6, 10, 28, 0, TAU); ctx.fill(); outline(ctx, 'rgba(90,40,10,.4)');
    ctx.strokeStyle = 'rgba(110,50,15,.6)'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let a = 0; a < TAU * 2.4; a += 0.2) { const r = 3 + a * 3.3; const x = -6 + Math.cos(a) * r, y = 10 + Math.sin(a) * r; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    shine(ctx, -16, -6, 8, 4, 0.45);
  },

  fish(ctx, t) {
    const wag = Math.sin(t * 9) * 0.35;
    ctx.save();
    ctx.translate(-26, 0); ctx.rotate(wag);
    ctx.fillStyle = '#ff7a1a';
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-22, -18); ctx.quadraticCurveTo(-14, 0, -22, 18); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = rad(ctx, 4, -8, 2, 40, [[0, '#ffb04d'], [0.6, '#ff7a1a'], [1, '#d4520a']]);
    ctx.beginPath(); ctx.ellipse(4, 0, 32, 20, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = '#fff';
    for (const x of [-12, 10]) { ctx.beginPath(); ctx.ellipse(x, 0, 5, 24, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = '#1d1b2c'; ctx.lineWidth = 1.5;
    for (const x of [-12, 10]) { ctx.beginPath(); ctx.ellipse(x, 0, 5, 24, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(4, 0, 32, 20, 0, 0, TAU); outline(ctx, 'rgba(120,40,0,.4)');
    ctx.fillStyle = '#ff9a3d';
    ctx.beginPath(); ctx.moveTo(-6, -18); ctx.quadraticCurveTo(6, -32, 18, -18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(24, -4, 5.5, 0, TAU); ctx.fill();
    ctx.fillStyle = '#1d1b2c'; ctx.beginPath(); ctx.arc(25.5, -4, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#7a2a00'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(30, 6, 4, 0.2, 1.6); ctx.stroke();
    shine(ctx, 8, -10, 9, 3.5, 0.45, -0.2);
  },

  // ---- food ----
  'food-worm'(ctx, t) {
    ctx.lineCap = 'round';
    const pts = [];
    for (let i = 0; i <= 10; i++) pts.push([-36 + i * 7.2, Math.sin(t * 6 + i * 0.9) * 8]);
    ctx.strokeStyle = '#c2185b'; ctx.lineWidth = 15;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
    ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = 11;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
    ctx.strokeStyle = 'rgba(194,24,91,.5)'; ctx.lineWidth = 1.5;
    pts.slice(1, -1).forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke(); });
    ctx.fillStyle = '#1d1b2c'; ctx.beginPath(); ctx.arc(pts[10][0] - 1, pts[10][1] - 2, 1.8, 0, TAU); ctx.fill();
  },
  'food-shrimp'(ctx) {
    ctx.strokeStyle = '#ff7043'; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * 0.9 + i * 0.32, r = 26;
      ctx.lineWidth = 16 - i * 1.6;
      ctx.beginPath(); ctx.arc(0, 0, r, a, a + 0.36); ctx.stroke();
    }
    ctx.strokeStyle = '#ffab91'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 30, Math.PI * 0.95, Math.PI * 2.6); ctx.stroke();
    ctx.fillStyle = '#e64a19';
    ctx.beginPath(); ctx.moveTo(22, 14); ctx.lineTo(36, 8); ctx.lineTo(34, 22); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e64a19'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-26, -6); ctx.quadraticCurveTo(-40, -30, -20, -38); ctx.stroke();
    ctx.fillStyle = '#1d1b2c'; ctx.beginPath(); ctx.arc(-24, -2, 2.5, 0, TAU); ctx.fill();
  },
  'food-pellet'(ctx) {
    for (const [x, y] of [[-14, 6], [12, 4], [0, -10]]) {
      ctx.fillStyle = rad(ctx, x - 4, y - 4, 1, 16, [[0, '#b07a4a'], [1, '#5c3a1e']]);
      ctx.beginPath(); ctx.arc(x, y, 13, 0, TAU); ctx.fill();
      shine(ctx, x - 4, y - 5, 4, 2, 0.4);
    }
  },
  'food-cake'(ctx) {
    ctx.fillStyle = lin(ctx, 0, 0, 0, 40, [[0, '#ffcc80'], [1, '#e09a48']]);
    ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-18, 38); ctx.lineTo(18, 38); ctx.lineTo(26, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(150,80,20,.4)'; ctx.lineWidth = 1.5;
    for (let x = -18; x <= 18; x += 7) { ctx.beginPath(); ctx.moveTo(x, 2); ctx.lineTo(x * 0.75, 38); ctx.stroke(); }
    ctx.fillStyle = rad(ctx, -6, -16, 2, 34, [[0, '#ffe0f0'], [1, '#f48fb1']]);
    ctx.beginPath(); ctx.moveTo(-30, 2); ctx.quadraticCurveTo(-34, -20, -10, -22); ctx.quadraticCurveTo(0, -38, 12, -22); ctx.quadraticCurveTo(34, -20, 30, 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(2, -32, 7, 0, TAU); ctx.fill();
    for (const [x, y, c] of [[-14, -8, '#42a5f5'], [8, -12, '#ffee58'], [16, -4, '#66bb6a'], [-4, -16, '#ab47bc']]) { ctx.fillStyle = c; ctx.fillRect(x, y, 4, 2); }
    shine(ctx, -12, -14, 6, 3, 0.5);
  },
};

export const hasArt = id => !!ART[id];

export function drawThing(ctx, id, x, y, size, t = 0, rot = 0, alpha = 1, flip = 1) {
  const fn = ART[id];
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.globalAlpha *= alpha;
  if (fn) {
    ctx.scale((size / 100) * flip, size / 100);
    ctx.lineJoin = 'round';
    fn(ctx, t);
  } else {
    const icon = ITEMS[id]?.icon || FOODS.find(f => 'food-' + f.id === id)?.icon || '❓';
    ctx.scale(flip, 1);
    ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(icon, 0, 0);
  }
  ctx.restore();
}
