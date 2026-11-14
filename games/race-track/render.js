// All drawing for the race track game. Reads game state, never changes it.
import { WORLD, TRACK_W, TUNNEL_HALF, inRange } from './track.js';

function off(w = WORLD.w, h = WORLD.h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
const rand = (a, b) => a + Math.random() * (b - a);

let dirtCanvas = null;
function dirt(g) {
  if (!dirtCanvas) {
    dirtCanvas = off(128, 128);
    const d = dirtCanvas.getContext('2d');
    d.fillStyle = '#c8955f';
    d.fillRect(0, 0, 128, 128);
    const cols = ['#b5844f', '#d8ab76', '#a8763f', '#e0bb88', '#9c6b38'];
    for (let i = 0; i < 700; i++) {
      d.fillStyle = cols[i % cols.length];
      d.beginPath();
      d.arc(Math.random() * 128, Math.random() * 128, rand(0.6, 2.2), 0, 7);
      d.fill();
    }
  }
  return g.createPattern(dirtCanvas, 'repeat');
}

function makeGrass() {
  const c = off();
  const g = c.getContext('2d');
  g.fillStyle = '#7cc55f';
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 50; i++) {
    g.fillStyle = Math.random() < 0.5 ? 'rgba(70,140,50,.13)' : 'rgba(170,220,120,.13)';
    g.beginPath();
    g.ellipse(rand(0, c.width), rand(0, c.height), rand(40, 120), rand(30, 90), rand(0, 3), 0, 7);
    g.fill();
  }
  g.lineWidth = 1.5;
  for (let i = 0; i < 3500; i++) {
    const x = rand(0, c.width), y = rand(0, c.height);
    g.strokeStyle = Math.random() < 0.5 ? '#68b04c' : '#93d673';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + rand(-2, 2), y - rand(3, 7)); g.stroke();
  }
  const petals = ['#fff', '#ffeb3b', '#f48fb1', '#ce93d8'];
  for (let i = 0; i < 70; i++) {
    const x = rand(0, c.width), y = rand(0, c.height);
    g.fillStyle = petals[i % petals.length];
    for (let k = 0; k < 5; k++) {
      g.beginPath(); g.arc(x + Math.cos(k * 1.26) * 3, y + Math.sin(k * 1.26) * 3, 2.4, 0, 7); g.fill();
    }
    g.fillStyle = '#ffa000';
    g.beginPath(); g.arc(x, y, 1.8, 0, 7); g.fill();
  }
  return c;
}

function pathLoop(g, pts) {
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
}
function pathRange(g, track, start, len) {
  g.beginPath();
  for (let k = 0; k <= len; k++) {
    const p = track.pts[(start + k) % track.n];
    k ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y);
  }
}

function drawStartLine(g, track) {
  const p = track.pts[0];
  g.save();
  g.translate(p.x, p.y);
  g.rotate(p.a);
  const sq = 7;
  for (let r = 0; r < 2; r++) {
    for (let c = 0, y = -TRACK_W / 2; y < TRACK_W / 2 - 0.1; c++, y += sq) {
      g.fillStyle = (r + c) % 2 ? '#222' : '#fff';
      g.fillRect(r * sq - sq, y, sq, Math.min(sq, TRACK_W / 2 - y));
    }
  }
  g.restore();
}

export function drawItem(g, it) {
  g.save();
  g.translate(it.x, it.y);
  g.rotate(it.a);
  if (it.type === 'jump') {
    const L = 44, W = TRACK_W + 6;
    g.fillStyle = 'rgba(0,0,0,.25)';
    g.fillRect(-L / 2 + 4, -W / 2 + 5, L, W);
    const grad = g.createLinearGradient(-L / 2, 0, L / 2, 0);
    grad.addColorStop(0, '#a1887f');
    grad.addColorStop(1, '#efebe9');
    g.fillStyle = grad;
    g.fillRect(-L / 2, -W / 2, L, W);
    g.strokeStyle = '#6d4c41';
    g.lineWidth = 1.5;
    for (let x = -L / 2 + 8; x < L / 2; x += 8) {
      g.beginPath(); g.moveTo(x, -W / 2); g.lineTo(x, W / 2); g.stroke();
    }
    g.fillStyle = '#4e342e';
    g.fillRect(L / 2 - 4, -W / 2, 4, W);
    g.strokeStyle = '#4e342e';
    g.lineWidth = 3;
    g.strokeRect(-L / 2, -W / 2, L, W);
    g.strokeStyle = '#ffca28';
    g.lineWidth = 5;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (const o of [-14, 14]) {
      g.beginPath(); g.moveTo(-6, o - 9); g.lineTo(4, o); g.lineTo(-6, o + 9); g.stroke();
    }
  } else if (it.type === 'water') {
    const rx = 52, ry = TRACK_W * 0.62;
    g.fillStyle = '#0288d1';
    g.beginPath(); g.ellipse(0, 0, rx + 3, ry + 3, 0, 0, 7); g.fill();
    g.fillStyle = '#4fc3f7';
    g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, 7); g.fill();
    g.strokeStyle = '#b3e5fc';
    g.lineWidth = 3;
    g.lineCap = 'round';
    for (const [x, y, r] of [[-20, -12, 10], [14, 8, 12], [-6, 20, 7], [24, -18, 6]]) {
      g.beginPath(); g.arc(x, y, r, 3.6, 5.8); g.stroke();
    }
  }
  g.restore();
}

function tunnelRange(it) { return { start: it.idx - TUNNEL_HALF, len: TUNNEL_HALF * 2 }; }

function drawTunnel(g, track, it) {
  const n = track.n;
  const { start, len } = tunnelRange(it);
  const s = ((start % n) + n) % n;
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'butt';
  pathRange(g, track, s, len);
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = TRACK_W + 50; g.stroke();
  g.strokeStyle = '#4e8a2c'; g.lineWidth = TRACK_W + 44; g.stroke();
  g.strokeStyle = '#8bc34a'; g.lineWidth = TRACK_W + 34; g.stroke();
  g.strokeStyle = '#a5d66f'; g.lineWidth = TRACK_W * 0.5; g.stroke();
  // rocks
  for (let k = 2; k < len; k += 3) {
    const p = track.pts[(s + k) % n];
    g.fillStyle = '#9e9e9e';
    g.beginPath(); g.arc(p.x + Math.cos(k) * 14, p.y + Math.sin(k * 1.7) * 14, 4, 0, 7); g.fill();
  }
  // entrances
  for (const [k, flip] of [[0, Math.PI], [len, 0]]) {
    const p = track.pts[(s + k) % n];
    g.save();
    g.translate(p.x, p.y);
    g.rotate(p.a + flip);
    g.fillStyle = '#2b1d14';
    g.beginPath(); g.ellipse(0, 0, 9, TRACK_W / 2 + 2, 0, 0, 7); g.fill();
    g.strokeStyle = '#bdbdbd';
    g.lineWidth = 6;
    g.beginPath(); g.ellipse(0, 0, 9, TRACK_W / 2 + 2, 0, -Math.PI / 2, Math.PI / 2); g.stroke();
    g.restore();
  }
  g.restore();
}

function drawBridges(g, track) {
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'butt';
  for (const r of track.runs) {
    g.save();
    g.translate(8, 11);
    pathRange(g, track, r.start, r.len);
    g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = TRACK_W + 18; g.stroke();
    g.restore();
    pathRange(g, track, r.start, r.len);
    g.strokeStyle = '#4e342e'; g.lineWidth = TRACK_W + 18; g.stroke();
    g.strokeStyle = '#8d6e63'; g.lineWidth = TRACK_W + 10; g.stroke();
    g.strokeStyle = dirt(g); g.lineWidth = TRACK_W; g.stroke();
    for (let k = 0; k <= r.len; k += 3) {
      const p = track.pts[(r.start + k) % track.n];
      for (const side of [-1, 1]) {
        const o = side * (TRACK_W / 2 + 5);
        g.fillStyle = '#3e2723';
        g.fillRect(p.x - Math.sin(p.a) * o - 3, p.y + Math.cos(p.a) * o - 3, 6, 6);
      }
    }
  }
  g.restore();
}

function drawTrack(g, track) {
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'round';
  pathLoop(g, track.pts);
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = TRACK_W + 24; g.stroke();
  g.strokeStyle = '#8a6440'; g.lineWidth = TRACK_W + 10; g.stroke();
  g.strokeStyle = dirt(g); g.lineWidth = TRACK_W; g.stroke();
  g.restore();
  drawStartLine(g, track);
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

export function drawCar(g, x, y, a, color, s = 1) {
  g.save();
  g.translate(x, y);
  g.rotate(a);
  g.scale(s, s);
  g.fillStyle = '#222';
  for (const [wx, wy] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) g.fillRect(wx - 4.5, wy - 2.5, 9, 5);
  g.fillStyle = color;
  g.strokeStyle = shade(color, 0.6);
  g.lineWidth = 2;
  g.beginPath();
  g.roundRect ? g.roundRect(-16, -8, 32, 16, 6) : g.rect(-16, -8, 32, 16);
  g.fill(); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.55)';
  g.fillRect(-16, -2, 32, 4);
  g.fillStyle = '#bfe9ff';
  g.beginPath();
  g.roundRect ? g.roundRect(3, -6, 6, 12, 2) : g.rect(3, -6, 6, 12);
  g.fill();
  g.fillStyle = '#fff';
  g.strokeStyle = '#333';
  g.lineWidth = 1.5;
  g.beginPath(); g.arc(-4, 0, 4.5, 0, 7); g.fill(); g.stroke();
  g.restore();
}

function drawCarWithShadow(g, c) {
  const z = c.z || 0;
  const s = 1 + z / 90;
  g.fillStyle = `rgba(0,0,0,${0.28 - Math.min(0.15, z / 400)})`;
  g.beginPath();
  g.ellipse(c.x + 3 + z * 0.4, c.y + 4 + z * 0.6, 18, 11, c.a, 0, 7);
  g.fill();
  drawCar(g, c.x, c.y - z * 0.3, c.a, c.color, s);
}

export function createRenderer(view) {
  const grass = makeGrass();
  const ground = off(), bridgeL = off(), tunnelL = off(), skid = off();
  const fit = { s: 1, ox: 0, oy: 0 };
  const parts = [];
  const prevWheels = new Map();
  let track = null, items = [];

  function setScene(t, its) {
    track = t; items = its;
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
    prevWheels.clear();
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

  function effects(cars, dt) {
    const sg = skid.getContext('2d');
    sg.lineCap = 'round';
    for (const c of cars) {
      const fx = Math.cos(c.a), fy = Math.sin(c.a);
      const wheel = side => ({ x: c.x - fx * 9 - fy * 8 * side, y: c.y - fy * 9 + fx * 8 * side });
      const now = { l: wheel(-1), r: wheel(1) };
      const prev = prevWheels.get(c.id);
      if (prev && !c.air && c.skid > 55) {
        sg.strokeStyle = c.onTrack ? 'rgba(70,40,15,.28)' : 'rgba(40,80,20,.25)';
        sg.lineWidth = 4;
        for (const k of ['l', 'r']) {
          sg.beginPath(); sg.moveTo(prev[k].x, prev[k].y); sg.lineTo(now[k].x, now[k].y); sg.stroke();
        }
      }
      prevWheels.set(c.id, c.air ? null : now);
      if (c.air) continue;
      const spawn = (rate, make) => { if (Math.random() < rate * dt) parts.push(make()); };
      if (c.skid > 80) spawn(40, () => ({ x: now.l.x, y: now.l.y, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.6, max: 0.6, r: rand(5, 9), color: '230,220,210' }));
      if (!c.onTrack && c.speed > 70) spawn(30, () => ({ x: c.x - fx * 14, y: c.y - fy * 14, vx: rand(-25, 25), vy: rand(-25, 25), life: 0.5, max: 0.5, r: rand(3, 6), color: '120,90,50' }));
      if (c.inWater && c.speed > 30) for (let k = 0; k < 2; k++) spawn(60, () => ({ x: c.x + rand(-10, 10), y: c.y + rand(-10, 10), vx: rand(-70, 70), vy: rand(-70, 70), life: 0.5, max: 0.5, r: rand(2, 5), color: Math.random() < 0.5 ? '255,255,255' : '79,195,247' }));
    }
  }

  function burst(x, y, color, count = 14) {
    for (let k = 0; k < count; k++) {
      parts.push({ x, y, vx: rand(-90, 90), vy: rand(-90, 90), life: 0.6, max: 0.6, r: rand(3, 6), color });
    }
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
    computeFit(o.insets);
    g.fillStyle = '#5c9e45';
    g.fillRect(0, 0, view.width, view.height);
    g.save();
    g.translate(fit.ox, fit.oy);
    g.scale(fit.s, fit.s);
    g.drawImage(ground, 0, 0);
    g.drawImage(skid, 0, 0);

    const cars = o.cars || [];
    if (o.live) effects(cars, o.dt);
    const vis = cars.filter(c => !hidden(c));
    vis.filter(c => !c.air && !c.up).forEach(c => drawCarWithShadow(g, c));
    g.drawImage(bridgeL, 0, 0);
    vis.filter(c => !c.air && c.up).forEach(c => drawCarWithShadow(g, c));
    g.drawImage(tunnelL, 0, 0);
    vis.filter(c => c.air).forEach(c => drawCarWithShadow(g, c));
    // cars inside a tunnel: see-through so you know where they are
    g.globalAlpha = 0.35;
    cars.filter(c => hidden(c)).forEach(c => drawCar(g, c.x, c.y, c.a, c.color));
    g.globalAlpha = 1;

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= o.dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.x += p.vx * o.dt; p.y += p.vy * o.dt;
      g.fillStyle = `rgba(${p.color},${p.life / p.max})`;
      g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill();
    }

    if (o.stroke && o.stroke.length > 1) {
      g.save();
      g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath();
      o.stroke.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.strokeStyle = '#8a6440'; g.lineWidth = TRACK_W + 10; g.stroke();
      g.strokeStyle = dirt(g); g.lineWidth = TRACK_W; g.stroke();
      g.restore();
    }

    if (o.drag) {
      g.globalAlpha = 0.8;
      if (o.drag.type === 'tunnel') {
        g.fillStyle = '#8bc34a';
        g.strokeStyle = '#4e8a2c';
        g.lineWidth = 6;
        g.beginPath(); g.ellipse(o.drag.x, o.drag.y, 90, 60, 0, 0, 7); g.fill(); g.stroke();
        g.fillStyle = '#2b1d14';
        g.beginPath(); g.ellipse(o.drag.x - 80, o.drag.y, 10, 34, 0, 0, 7); g.fill();
        g.beginPath(); g.ellipse(o.drag.x + 80, o.drag.y, 10, 34, 0, 0, 7); g.fill();
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

  return { setScene, resetRace, frame, toWorld, thumb, burst };
}

// Little pictures for the buttons
export function drawCarIcon(canvas, color) {
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, canvas.width, canvas.height);
  const s = Math.min(canvas.width / 40, canvas.height / 26);
  drawCar(g, canvas.width / 2, canvas.height / 2, 0, color, s);
}

export function drawItemIcon(canvas, type) {
  const g = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  g.clearRect(0, 0, w, h);
  g.save();
  g.translate(w / 2, h / 2);
  const s = w / 170;
  g.scale(s, s);
  g.fillStyle = '#8a6440';
  g.fillRect(-85, -TRACK_W / 2 - 5, 170, TRACK_W + 10);
  g.fillStyle = dirt(g);
  g.fillRect(-85, -TRACK_W / 2, 170, TRACK_W);
  if (type === 'tunnel') {
    const fake = { n: 15, pts: Array.from({ length: 15 }, (_, i) => ({ x: -56 + i * 8, y: 0, a: 0 })) };
    drawTunnel(g, fake, { idx: TUNNEL_HALF });
  } else {
    drawItem(g, { type, x: 0, y: 0, a: 0 });
  }
  g.restore();
}
