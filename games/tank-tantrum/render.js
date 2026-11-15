// Drawing for Tank Tantrum: sky, ground, water, tanks, shots and bangs.
import { W, H, CELL, COLS, ROWS, WATER_Y } from './sim.js';
import { WEAPON } from './weapons.js';
import { createGround } from './ground.js';

// ---------------------------------------------------------------- tank looks
export const TANK_COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#00acc1', '#1e88e5', '#8e24aa', '#ec407a', '#6d4c41', '#546e7a', '#212121', '#ffffff'];
export const HATS = ['', '🎩', '👑', '🧢', '🤠', '🎓', '⛑️', '🎀', '🪖', '🎉'];
export const FLAGS = ['', '🏴‍☠️', '⭐', '❤️', '⚡', '🌈', '🐉', '🦄', '💀', '⚽', '🍕', '🐸'];
export const NAMES = ['Boomer', 'Rusty', 'Tanky', 'Blaster', 'Zapper', 'Bonkers', 'Wobbles', 'Kaboom'];

export function randomLook(i = Math.floor(Math.random() * 8)) {
  return {
    name: NAMES[i % NAMES.length],
    color: TANK_COLORS[(i * 5 + 1) % TANK_COLORS.length],
    hat: HATS[1 + (i * 3) % (HATS.length - 1)],
    flag: FLAGS[1 + (i * 7) % (FLAGS.length - 1)],
  };
}
export function sanitizeLook(l) {
  const o = l && typeof l === 'object' ? l : {};
  const name = typeof o.name === 'string' ? o.name.replace(/[<>&"'`]/g, '').trim().slice(0, 12) : '';
  return {
    name: name || 'Tank',
    color: TANK_COLORS.includes(o.color) ? o.color : TANK_COLORS[0],
    hat: HATS.includes(o.hat) ? o.hat : '',
    flag: FLAGS.includes(o.flag) ? o.flag : '',
  };
}

// ---------------------------------------------------------------- themes
const THEMES = {
  grass: { sky: ['#7cc8ff', '#dff4ff'], hills: '#9ed59a', top: [92, 200, 74], dirt: [168, 107, 60], deep: [120, 74, 40], water: 'rgba(40,140,230,.78)', wave: '#bfe6ff' },
  snow: { sky: ['#a9c8e8', '#f2f8ff'], hills: '#dbe8f5', top: [255, 255, 255], dirt: [150, 178, 202], deep: [110, 138, 166], water: 'rgba(80,160,220,.78)', wave: '#e6f5ff' },
  candy: { sky: ['#ffb6e1', '#fff0fa'], hills: '#ffd2ec', top: [255, 120, 190], dirt: [205, 140, 92], deep: [160, 100, 62], water: 'rgba(170,100,255,.75)', wave: '#f0d9ff', sprinkles: true },
  moon: { sky: ['#07071f', '#2b2356'], hills: '#3b3466', top: [222, 222, 232], dirt: [150, 150, 165], deep: [100, 100, 118], water: 'rgba(80,230,120,.7)', wave: '#c9ffd8', stars: true },
};

const TS = 1.4; // tanks are drawn this much bigger than drawTank's size
const emojiFont = px => `${px}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;

export function createRenderer() {
  const ground = createGround();
  let theme = THEMES.grass;
  let world = null;
  const parts = [];       // particles
  const texts = [];       // floating words
  let shake = 0, flash = 0;
  const stars = Array.from({ length: 120 }, () => [Math.random(), Math.random(), Math.random() * 1.5 + 0.5]);
  const flakes = Array.from({ length: 70 }, () => [Math.random(), Math.random(), Math.random() * 0.5 + 0.5]);

  function setWorld(w) {
    world = w;
    theme = THEMES[w.map] || THEMES.grass;
    ground.setWorld(w);
  }
  function syncTerrain() { ground.sync(); }

  // ---------------------------------------------------------------- effects
  function burstParts(x, y, n, colors, speed, life, size, grav = 400) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = speed * (0.3 + Math.random() * 0.7);
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - speed * 0.3, life, max: life, size: size * (0.5 + Math.random()), color: colors[i % colors.length], grav });
    }
  }
  function say(x, y, text, color = '#fff', size = 22) { texts.push({ x, y, text, color, size, life: 1.4 }); }

  function fx(e) {
    const dirt = `rgb(${theme.dirt.join(',')})`;
    switch (e.type) {
      case 'explode': case 'bigboom':
        burstParts(e.x, e.y, 18, ['#fff176', '#ffb300', '#ff7043', '#e53935'], e.r * 6, 0.6, 7, 200);
        burstParts(e.x, e.y, 14, [dirt, '#795548'], e.r * 7, 1.1, 4);
        burstParts(e.x, e.y, 8, ['rgba(80,80,80,.6)', 'rgba(140,140,140,.5)'], 60, 1.6, 16, -30);
        parts.push({ ring: true, x: e.x, y: e.y, r: e.r, life: 0.35, max: 0.35 });
        shake = Math.max(shake, e.r / 3 + (e.type === 'bigboom' ? 10 : 0));
        flash = Math.max(flash, e.type === 'bigboom' ? 0.5 : 0.2);
        break;
      case 'pop': burstParts(e.x, e.y, 8, ['#ff4081', '#40c4ff', '#ffff00', '#69f0ae'], 200, 0.5, 4, 200); shake = Math.max(shake, 3); break;
      case 'burst': burstParts(e.x, e.y, 40, ['#ff4081', '#40c4ff', '#ffff00', '#69f0ae', '#e040fb'], 300, 1, 4, 120); flash = 0.25; break;
      case 'whoopee':
        burstParts(e.x, e.y, 26, ['rgba(160,220,80,.7)', 'rgba(120,190,60,.6)'], 300, 1.2, 18, -20);
        say(e.x, e.y - 40, 'PFFFRRT!', '#7cb342', 34); shake = 14; break;
      case 'stomp': burstParts(e.x, e.y, 30, [dirt, '#bcaaa4', '#fff'], 360, 1, 6); shake = 22; say(e.x, e.y - 60, 'STOMP!', '#6d4c41', 36); break;
      case 'splash': burstParts(e.x, WATER_Y, e.big ? 30 : 14, ['#bbdefb', '#e3f2fd', '#64b5f6'], e.big ? 300 : 200, 0.9, 5); break;
      case 'bounce': burstParts(e.x, e.y, 6, [dirt, '#fff'], 120, 0.5, 4); say(e.x, e.y - 20, 'SQUAWK!', '#fff59d', 18); break;
      case 'dig': burstParts(e.x, e.y, 10, [dirt], 150, 0.7, 5); break;
      case 'dmg': say(e.x, e.y, '-' + e.amount, '#ff5252', 26); break;
      case 'pickup': say(e.x, e.y - 30, e.kind === 'health' ? '+30 ❤️' : '+1 ' + (WEAPON[e.w] ? WEAPON[e.w].icon : ''), '#fff', 26); burstParts(e.x, e.y - 10, 16, ['#ffd54f', '#fff'], 160, 0.7, 4, 100); break;
      case 'flush': burstParts(e.x, e.y - 10, 20, ['#4fc3f7', '#e1f5fe'], 200, 0.8, 6, -50); burstParts(e.x2, e.y2 - 10, 20, ['#4fc3f7', '#e1f5fe'], 200, 0.8, 6, -50); say(e.x2, e.y2 - 50, 'FLUSH!', '#4fc3f7', 30); break;
      case 'cloudOn': say(e.x, e.y - 40, 'Grumpy!', '#90a4ae', 28); break;
      case 'shrink': burstParts(e.x, e.y, 20, ['#b2ff59', '#69f0ae'], 180, 0.8, 4, 0); say(e.x, e.y - 40, 'Tiny!', '#b2ff59', 28); break;
      case 'fizz': say(e.x, e.y - 30, 'fizzle…', '#ccc', 22); break;
      case 'wall': burstParts(e.x, e.y - 60, 20, ['#ffd54f', '#fff59d'], 160, 0.8, 6); say(e.x, e.y - 160, 'Wobble!', '#ffca28', 26); break;
      case 'catch': say(e.x, e.y - 30, 'Caught it!', '#fff', 22); break;
      case 'die': say(e.x, e.y - 60, '💥 BOOM 💥', '#ffeb3b', 40); break;
      case 'drown': say(e.x, e.y - 60, 'SPLOOSH!', '#81d4fa', 40); break;
      case 'skip': if (world) { const t = world.tanks[e.tank]; say(t.x, t.y - 60, 'Too slow! 💤', '#fff', 26); } break;
      case 'pull': say(e.x, e.y - 30, '🧲 ZZZT', '#ff5252', 22); break;
      case 'thud': burstParts(e.x, e.y, 6, [dirt], 100, 0.5, 4); break;
    }
  }
  function confetti(x, y) {
    burstParts(x, y, 6, ['#ff4081', '#40c4ff', '#ffff00', '#69f0ae', '#e040fb', '#ff9100'], 380, 2.2, 5, 260);
  }
  function trail(p) {
    if (Math.random() < 0.5) parts.push({ x: p.x, y: p.y, vx: 0, vy: -10, life: 0.6, max: 0.6, size: p.kind === 'spark' ? 3 : 5, color: p.kind === 'spark' ? '#fff59d' : p.kind === 'sock' ? 'rgba(140,200,60,.6)' : 'rgba(255,255,255,.6)', grav: 0 });
  }

  function update(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      if (!p.ring) { p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    }
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.life -= dt; t.y -= 40 * dt;
      if (t.life <= 0) texts.splice(i, 1);
    }
    shake = Math.max(0, shake - dt * 40);
    flash = Math.max(0, flash - dt * 1.5);
  }

  // ---------------------------------------------------------------- drawing
  function draw(ctx, view, cam, opts = {}) {
    const vw = view.width, vh = view.height, z = cam.z;
    const time = opts.time || 0;
    const sh = shake > 0 ? [(Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake] : [0, 0];
    const ox = vw / 2 - cam.x * z + sh[0], oy = vh / 2 - cam.y * z + sh[1];
    const sx = x => ox + x * z, sy = y => oy + y * z;

    // sky
    const g = ctx.createLinearGradient(0, 0, 0, vh);
    g.addColorStop(0, theme.sky[0]); g.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, vw, vh);
    if (theme.stars) {
      ctx.fillStyle = '#fff';
      for (const [a, b, s] of stars) {
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time * 2 + a * 40);
        ctx.fillRect(((a * 1.3 * vw - cam.x * z * 0.05) % vw + vw) % vw, b * vh * 0.8, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.font = emojiFont(60 * z);
      ctx.fillText('🪐', ox * 0.2 + vw * 0.75, vh * 0.2);
    }
    // far hills (parallax)
    ctx.fillStyle = theme.hills;
    ctx.beginPath();
    const par = 0.4, base = vh * 0.5 + (oy - vh / 2) * par * 0.3;
    ctx.moveTo(0, vh);
    for (let x = 0; x <= vw + 20; x += 20) {
      const wx = (x - ox * par) / 140;
      ctx.lineTo(x, base + Math.sin(wx) * 40 + Math.sin(wx * 2.7) * 18);
    }
    ctx.lineTo(vw, vh);
    ctx.fill();
    if (world && world.map === 'candy') {
      ctx.font = emojiFont(70 * z);
      const sp = 330 * z, per = sp * 6;
      for (let i = 0; i < 6; i++) ctx.fillText('🍭', (((i * sp - cam.x * 0.4 * z) % per) + per) % per - 60, base + 20);
    }
    if (world && (world.map === 'grass')) {
      ctx.font = emojiFont(40 * z);
      ctx.globalAlpha = 0.9;
      const sp = Math.max(260 * z, (vw + 200) / 5), per = sp * 5;
      for (let i = 0; i < 5; i++) ctx.fillText('☁️', (((i * sp + time * 12 - cam.x * 0.2 * z) % per) + per) % per - 100, 60 + (i % 3) * 50);
      ctx.globalAlpha = 1;
    }

    // ground
    ctx.drawImage(ground.canvas, sx(0), sy(0), W * z, H * z);
    const bed = sy(H);   // sea floor under the map
    if (bed < vh) { ctx.fillStyle = `rgb(${theme.deep.join(',')})`; ctx.fillRect(0, bed - 1, vw, vh - bed + 1); }

    if (!world) return;
    const w = world;

    // crates + mines
    for (const k of w.crates) {
      const x = sx(k.x), y = sy(k.y);
      if (!k.landed) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 * z;
        ctx.beginPath(); ctx.moveTo(x - 12 * z, y - 18 * z); ctx.lineTo(x - 18 * z, y - 42 * z); ctx.moveTo(x + 12 * z, y - 18 * z); ctx.lineTo(x + 18 * z, y - 42 * z); ctx.stroke();
        ctx.fillStyle = k.kind === 'health' ? '#ef5350' : '#ffca28';
        ctx.beginPath(); ctx.arc(x, y - 42 * z, 22 * z, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = k.kind === 'health' ? '#fff' : '#a1662f';
      ctx.strokeStyle = k.kind === 'health' ? '#e53935' : '#5d3b17';
      ctx.lineWidth = 2 * z;
      ctx.fillRect(x - 12 * z, y - 22 * z, 24 * z, 22 * z);
      ctx.strokeRect(x - 12 * z, y - 22 * z, 24 * z, 22 * z);
      ctx.font = emojiFont(14 * z); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(k.kind === 'health' ? '❤️' : '❓', x, y - 11 * z);
    }
    for (const m of w.mines) {
      const x = sx(m.x), y = sy(m.y);
      ctx.strokeStyle = `rgba(255,60,60,${0.4 + 0.4 * Math.sin(time * 6)})`;
      ctx.lineWidth = 2 * z;
      ctx.beginPath(); ctx.arc(x, y - 8 * z, (16 + 6 * Math.sin(time * 6)) * z, 0, Math.PI * 2); ctx.stroke();
      ctx.font = emojiFont(18 * z); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🧲', x, y - 9 * z);
    }

    // tanks
    for (const t of w.tanks) {
      if (!t.alive) continue;
      const dance = opts.dance && opts.dance.tank === t.i ? opts.dance : null;
      const aim = opts.aim && opts.aim.tank === t.i ? opts.aim : null;
      drawWorldTank(ctx, w, t, sx(t.x), sy(t.y), z, time, aim, dance, w.active === t.i && w.phase === 'aim');
    }

    // shots
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const p of w.projectiles) {
      trail(p);
      const x = sx(p.x), y = sy(p.y);
      const ang = Math.atan2(p.vy, p.vx);
      switch (p.kind) {
        case 'shell':
          ctx.fillStyle = '#263238'; ctx.beginPath(); ctx.arc(x, y, 5 * z, 0, Math.PI * 2); ctx.fill(); break;
        case 'spark':
          ctx.fillStyle = ['#ff4081', '#40c4ff', '#ffff00', '#69f0ae'][Math.floor(p.age * 20) % 4];
          ctx.beginPath(); ctx.arc(x, y, 3.5 * z, 0, Math.PI * 2); ctx.fill(); break;
        case 'mole':
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
          ctx.fillStyle = '#6d4c41'; ctx.beginPath(); ctx.ellipse(0, 0, 11 * z, 7 * z, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#f48fb1'; ctx.beginPath(); ctx.arc(11 * z, 0, 3 * z, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#000'; ctx.fillRect(4 * z, -4 * z, 2 * z, 2 * z); ctx.fillRect(4 * z, 2 * z, 2 * z, 2 * z);
          ctx.restore(); break;
        case 'flare':
          ctx.fillStyle = '#ff1744'; ctx.beginPath(); ctx.arc(x, y, 5 * z, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,82,82,.35)'; ctx.beginPath(); ctx.arc(x, y, (10 + 4 * Math.sin(time * 20)) * z, 0, Math.PI * 2); ctx.fill(); break;
        case 'shrink':
          ctx.fillStyle = '#b2ff59'; ctx.shadowColor = '#76ff03'; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(x, y, 6 * z, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; break;
        case 'firework':
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang + Math.PI / 4);
          ctx.font = emojiFont(20 * z); ctx.fillText('🚀', 0, 0); ctx.restore(); break;
        default: {
          const icon = { chicken: '🐔', cupcake: '🧁', mini: '🧁', sock: '🧦', cloud: '☁️', custard: '🍮', whoopee: '💨', magnet: '🧲', yoyo: '🪀' }[p.kind] || '●';
          const size = p.kind === 'mini' ? 12 : 22;
          ctx.save(); ctx.translate(x, y);
          if (p.kind === 'chicken' || p.kind === 'yoyo') ctx.rotate(p.age * 12);
          else if (p.kind === 'sock') ctx.rotate(ang);
          ctx.font = emojiFont(size * z); ctx.fillText(icon, 0, 0); ctx.restore();
        }
      }
    }
    for (const b of w.boots) {
      ctx.font = emojiFont(90 * z); ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('🥾', sx(b.x), sy(b.y) + 6 * z);
    }

    // water
    const wy = sy(WATER_Y);
    if (wy < vh) {
      ctx.fillStyle = theme.water;
      ctx.beginPath();
      ctx.moveTo(0, vh);
      for (let x = 0; x <= vw + 16; x += 16) ctx.lineTo(x, wy + Math.sin((x - ox) / (30 * z) + time * 2) * 4 * z);
      ctx.lineTo(vw, vh);
      ctx.fill();
      ctx.strokeStyle = theme.wave; ctx.lineWidth = 3 * z;
      ctx.beginPath();
      for (let x = 0; x <= vw + 16; x += 16) ctx[x ? 'lineTo' : 'moveTo'](x, wy + Math.sin((x - ox) / (30 * z) + time * 2) * 4 * z);
      ctx.stroke();
    }

    // particles
    for (const p of parts) {
      const a = Math.max(0, p.life / p.max);
      if (p.ring) {
        ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 6 * z * a;
        ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), p.r * z * (1.4 - a * 0.6), 0, Math.PI * 2); ctx.stroke();
        continue;
      }
      ctx.globalAlpha = Math.min(1, a * 1.5);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), p.size * z * (p.grav < 0 ? 2 - a : 1), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // snow falling
    if (w.map === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      for (const f of flakes) {
        const x = ((f[0] * vw + Math.sin(time + f[1] * 9) * 20) % vw + vw) % vw;
        const y = ((f[1] * vh + time * 40 * f[2]) % vh);
        ctx.beginPath(); ctx.arc(x, y, 2.5 * f[2], 0, Math.PI * 2); ctx.fill();
      }
    }

    // words
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const t of texts) {
      ctx.globalAlpha = Math.min(1, t.life * 2);
      ctx.font = `700 ${Math.max(14, t.size * Math.min(1.2, z + 0.3))}px Fredoka, system-ui, sans-serif`;
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.55)';
      ctx.strokeText(t.text, sx(t.x), sy(t.y));
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, sx(t.x), sy(t.y));
    }
    ctx.globalAlpha = 1;

    // aim helper
    if (opts.aim && opts.aim.power > 0) {
      const t = w.tanks[opts.aim.tank];
      const k = t.shrink > 0 ? 0.5 : 1;
      const bx = sx(t.x), by = sy(t.y - 20 * k);
      const L = (40 + 110 * opts.aim.power) * z;
      const ex = bx + opts.aim.dx * L, ey = by + opts.aim.dy * L;
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]); ctx.lineDashOffset = -time * 40;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `hsl(${120 - opts.aim.power * 120},90%,55%)`;
      ctx.beginPath(); ctx.arc(ex, ey, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = '700 18px Fredoka, sans-serif'; ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 4;
      const txt = Math.round(opts.aim.power * 100) + '%';
      ctx.strokeText(txt, ex, ey - 22); ctx.fillText(txt, ex, ey - 22);
    }

    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * 0.6})`; ctx.fillRect(0, 0, vw, vh); }
  }

  function drawWorldTank(ctx, w, t, x, y, z, time, aim, dance, active) {
    const k = t.shrink > 0 ? 0.5 : 1;
    // tilt with the ground
    let tilt = 0;
    if (t.ground && !dance) {
      const a = w.groundAt(t.x - 10, t.y, 12, 12), b = w.groundAt(t.x + 10, t.y, 12, 12);
      if (a !== null && b !== null) tilt = Math.max(-0.5, Math.min(0.5, Math.atan2(b - a, 20)));
    }
    let ax = t.aimX, ay = t.aimY;
    if (aim) { ax = aim.dx; ay = aim.dy; }
    let dy = 0, spin = 0;
    if (dance) {
      const s = dance.t;
      if (dance.kind === 'bounce') dy = -Math.abs(Math.sin(s * 6)) * 30;
      else if (dance.kind === 'spin') { dy = -Math.abs(Math.sin(s * 3)) * 50; spin = s * 6; }
      else if (dance.kind === 'wiggle') { tilt = Math.sin(s * 14) * 0.35; dy = -Math.abs(Math.sin(s * 7)) * 8; }
      else { dy = -Math.abs(Math.sin(s * 2.5)) * 70; spin = Math.floor(s * 2.5 / Math.PI) % 2 ? 0 : (s * 2.5 % Math.PI) * 2; }
      const a = s * 5; ax = Math.cos(a) * 0.5; ay = -Math.abs(Math.sin(a)) - 0.4;
    }
    ctx.save();
    ctx.translate(x, y + dy * z);
    const big = Math.min(2, Math.max(1, 0.6 / z));   // easier to spot when zoomed out
    ctx.scale(z * k * TS * big, z * k * TS * big);
    if (spin) { ctx.translate(0, -10); ctx.rotate(spin); ctx.translate(0, 10); }
    ctx.rotate(tilt);
    drawTank(ctx, t.look, ax, ay, time, t.cloud > 0);
    ctx.restore();

    // name + health
    const ny = y - (dance ? 110 : 66 * k) * z * big + dy * z;
    const bw = 44;
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.fillRect(x - bw / 2 - 2, ny - 2, bw + 4, 9);
    ctx.fillStyle = t.hp > 60 ? '#66bb6a' : t.hp > 30 ? '#ffca28' : '#ef5350';
    ctx.fillRect(x - bw / 2, ny, bw * Math.max(0, Math.min(100, t.hp)) / 100, 5);
    ctx.font = '700 14px Fredoka, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.5)';
    ctx.strokeText(t.look.name, x, ny - 3);
    ctx.fillStyle = active ? '#fff59d' : '#fff';
    ctx.fillText(t.look.name, x, ny - 3);
    if (active) {
      ctx.fillStyle = '#fff59d';
      const by = ny - 26 + Math.sin(time * 6) * 4;
      ctx.beginPath(); ctx.moveTo(x - 8, by); ctx.lineTo(x + 8, by); ctx.lineTo(x, by + 9); ctx.fill();
    }
    if (t.cloud > 0) {
      const cy = y - 100 * z * k * big;
      ctx.font = emojiFont(30 * z); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🌧️', x, cy);
      ctx.strokeStyle = 'rgba(120,180,255,.8)'; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const rx = x + (i - 2.5) * 6 * z, ry = cy + 14 * z + ((time * 120 + i * 17) % (50 * z));
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + 7); ctx.stroke();
      }
    }
  }

  return { setWorld, syncTerrain, fx, confetti, update, draw, get world() { return world; } };
}

// One tank, drawn at (0,0) = middle of the bottom, ~34 wide, ~30 tall.
export function drawTank(ctx, look, ax, ay, time = 0, sad = false) {
  const col = look.color;
  // flag at the back
  const back = ax >= 0 ? -1 : 1;
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(back * 12, -10); ctx.lineTo(back * 12, -38); ctx.stroke();
  if (look.flag) {
    ctx.fillStyle = '#fff';
    const wave = Math.sin(time * 6) * 1.5;
    ctx.beginPath();
    ctx.moveTo(back * 12, -38); ctx.lineTo(back * 12 + back * 18, -35 + wave); ctx.lineTo(back * 12 + back * 18, -25 + wave); ctx.lineTo(back * 12, -28);
    ctx.fill();
    ctx.font = emojiFont(9); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(look.flag, back * 21, -31 + wave);
  }
  // barrel
  const l = Math.hypot(ax, ay) || 1;
  ctx.save();
  ctx.translate(0, -14);
  ctx.rotate(Math.atan2(ay / l, ax / l));
  ctx.fillStyle = '#37474f';
  ctx.fillRect(0, -2.5, 20, 5);
  ctx.fillRect(17, -3.5, 4, 7);
  ctx.restore();
  // tracks
  ctx.fillStyle = '#37474f';
  roundRect(ctx, -17, -8, 34, 8, 4); ctx.fill();
  ctx.fillStyle = '#90a4ae';
  for (let i = -12; i <= 12; i += 6) { ctx.beginPath(); ctx.arc(i, -4, 2.2, 0, Math.PI * 2); ctx.fill(); }
  // body
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-15, -8); ctx.lineTo(15, -8); ctx.lineTo(12, -14); ctx.lineTo(-12, -14); ctx.closePath();
  ctx.fill();
  ctx.beginPath(); ctx.arc(0, -14, 8, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; ctx.stroke();
  // eyes
  const ex = ax >= 0 ? 2 : -2;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-3 + ex, -15, 2.4, 0, Math.PI * 2); ctx.arc(3 + ex, -15, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-3 + ex * 1.4, -15 + (sad ? 0.8 : 0), 1.2, 0, Math.PI * 2); ctx.arc(3 + ex * 1.4, -15 + (sad ? 0.8 : 0), 1.2, 0, Math.PI * 2); ctx.fill();
  if (look.hat) {
    ctx.font = emojiFont(14); ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(look.hat, 0, -18);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
}

// A tank picture for menus (in a <canvas>).
export function tankIcon(canvas, look, size = 96) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.translate(size / 2, size * 0.8);
  ctx.scale(size / 48, size / 48);
  drawTank(ctx, look, 0.8, -0.6);
}
