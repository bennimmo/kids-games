// Balloon Pop – for very little ones (age 2+).
// Tap balloons to pop them. Sometimes a digger or a train floats up too!
// No losing, no timer. Fill the stars for a party.
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound, audioCtx } from '../../js/engine/sound.js';

const COLOURS = [
  { name: 'Red', fill: '#ef5350', dark: '#c62828', note: 523 },
  { name: 'Orange', fill: '#ffa726', dark: '#ef6c00', note: 587 },
  { name: 'Yellow', fill: '#ffee58', dark: '#f9a825', note: 659 },
  { name: 'Green', fill: '#66bb6a', dark: '#2e7d32', note: 698 },
  { name: 'Blue', fill: '#42a5f5', dark: '#1565c0', note: 784 },
  { name: 'Purple', fill: '#ab47bc', dark: '#6a1b9a', note: 880 },
  { name: 'Pink', fill: '#f48fb1', dark: '#d81b60', note: 988 },
];
const GOAL = 20;           // stars to fill before a party
const VEHICLE_STARS = 3;   // a digger/train is worth more
const HOLD_TO_EXIT = 1.2;  // seconds a grown-up holds 🏠

const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ---------- Sounds ----------
// Short burst of filtered noise (train chuff, bucket scrape).
function hiss(dur, freq, vol, type = 'bandpass') {
  try {
    const a = audioCtx();
    if (!a) return;
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = 1;
    const g = a.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination);
    src.start();
  } catch (e) { /* sound is optional */ }
}
const later = (ms, fn) => setTimeout(fn, ms);

// A held whistle note (chord) that swells in and out – a proper steam whistle.
function blast(freqs, dur, vol = 0.12) {
  try {
    const a = audioCtx();
    if (!a) return;
    const t = a.currentTime;
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.05);
    g.gain.setValueAtTime(vol, t + dur - 0.08);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    g.connect(a.destination);
    for (const f of freqs) {
      const o = a.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f * 0.92, t);
      o.frequency.linearRampToValueAtTime(f, t + 0.08);
      o.connect(g);
      o.start(t);
      o.stop(t + dur + 0.02);
    }
  } catch (e) { /* sound is optional */ }
}

const sfx = {
  pop(note) {
    sound.tone(note, 0.15, 'sine', 0.25, note * 2);
    setTimeout(() => sound.tone(note * 1.5, 0.12, 'triangle', 0.12), 60);
  },
  ding: n => sound.tone(1000 + n * 60, 0.15, 'triangle', 0.12),
  beep() { // digger reversing beep
    [0, 350, 700].forEach(t => setTimeout(() => sound.tone(1050, 0.18, 'square', 0.07), t));
  },
  // ---- Train ----
  chuff: () => hiss(0.12, 1800, 0.18),
  choochoo() { // "ch-ch-ch-ch CHOO-CHOOOO!"
    [0, 140, 280, 420].forEach(t => later(t, () => hiss(0.1, 1600, 0.25)));
    const chord = [523, 659, 784];
    later(600, () => { blast(chord, 0.32); hiss(0.3, 2500, 0.06); });
    later(1020, () => { blast(chord, 0.65); hiss(0.6, 2500, 0.06); });
  },
  bell() { // ding-ding
    [0, 220].forEach(t => later(t, () => { sound.tone(1568, 0.4, 'sine', 0.12); sound.tone(2350, 0.3, 'sine', 0.05); }));
  },
  // ---- Digger ----
  honk() { // "meep meep!" when it appears
    [0, 260].forEach(t => later(t, () => { sound.tone(440, 0.18, 'square', 0.08); sound.tone(554, 0.18, 'square', 0.06); }));
  },
  putter: () => sound.tone(rand(60, 75), 0.08, 'sawtooth', 0.1),
  vroom() { // engine revs up
    sound.tone(70, 0.7, 'sawtooth', 0.14, 160);
    later(150, () => sound.tone(90, 0.6, 'square', 0.06, 200));
  },
  clank() { // bucket clank-clank
    [0, 200].forEach(t => later(t, () => { sound.tone(1900, 0.12, 'square', 0.05); sound.tone(2700, 0.08, 'triangle', 0.06); hiss(0.08, 3000, 0.12); }));
  },
  // ---- Car ----
  carBeep() { // "beep beep!" when it appears
    [0, 220].forEach(t => later(t, () => { sound.tone(660, 0.14, 'square', 0.07); sound.tone(830, 0.14, 'square', 0.05); }));
  },
  honkHonk() {
    [0, 300].forEach(t => later(t, () => { sound.tone(392, 0.22, 'sawtooth', 0.07); sound.tone(494, 0.22, 'sawtooth', 0.05); }));
  },
  vroomVroom() {
    [0, 450].forEach(t => later(t, () => sound.tone(90, 0.45, 'sawtooth', 0.14, 260)));
  },
  hum: () => sound.tone(rand(100, 115), 0.07, 'sawtooth', 0.06),
  // ---- All ----
  wheee: () => sound.tone(1300, 0.9, 'sine', 0.16, 350), // slide whistle down
  thud: () => sound.tone(120, 0.2, 'sine', 0.3, 60),
  giggle() { // quick bubbly trill
    const base = rand(700, 1000);
    [0, 50, 100].forEach((t, i) => setTimeout(() => sound.tone(base * (1 + i * 0.25), 0.07, 'sine', 0.1), 90 + t));
  },
  boing: () => sound.tone(180, 0.5, 'sine', 0.3, 700),
  fanfare() {
    [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => setTimeout(() => sound.tone(f, 0.22, 'square', 0.06), 400 + i * 140));
  },
  firework: () => sound.tone(rand(300, 500), 0.4, 'sine', 0.12, rand(900, 1400)),
};

export function mount(stage) {
  const view = createCanvas(stage);
  const { canvas, ctx } = view;

  let balloons = [];
  let vehicles = [];
  let bits = [];        // confetti, smoke, sparks
  let flyers = [];      // stars flying to the star bar
  let clouds = [];
  let filled = 0;       // stars landed in the bar
  let earned = 0;       // stars on their way (incl. landed)
  let spawnT = 0.3;
  let vehicleT = rand(5, 7);
  const KINDS = ['digger', 'train', 'car'];
  let kindIdx = Math.floor(Math.random() * KINDS.length);
  let party = null;     // { t } while celebrating
  let time = 0;

  const W = () => view.width;
  const H = () => view.height;
  const groundY = () => H() - Math.max(40, H() * 0.08);
  const size = () => Math.max(46, Math.min(W(), H()) * 0.085); // balloon radius

  for (let i = 0; i < 4; i++) clouds.push({ x: rand(0, 1), y: rand(0.08, 0.5), s: rand(0.7, 1.3), v: rand(0.004, 0.01) });

  // ---------- Spawning ----------
  // Bottom-middle of the screen is where Android's "switch app" bar lives.
  // Keep balloons out of it so little fingers don't swipe away the game.
  const NO_GO = { left: 0.3, right: 0.7, top: 0.75 };
  const inNoGoColumn = (x, halfW) => x + halfW > W() * NO_GO.left && x - halfW < W() * NO_GO.right;

  function addBalloon(y) {
    const r = size() * rand(0.9, 1.1);
    const c = pick(COLOURS);
    const x = rand(r + 10, W() - r - 10);
    const safeY = H() * NO_GO.top - r * 1.2; // balloon body stays above the no-go zone
    let grow = 1;
    if (inNoGoColumn(x, r + 20)) {
      // Middle column: pop in above the zone instead of rising from the bottom.
      if (y === undefined || y > safeY) { y = safeY; grow = 0; }
    }
    balloons.push({
      x, y: y ?? H() + r * 1.5, grow,
      r, c, vy: -rand(0.74, 1.1) * r, // px/s
      sway: rand(0, Math.PI * 2), swaySpeed: rand(0.6, 1.1),
    });
  }

  function addVehicle() {
    kindIdx = (kindIdx + 1) % KINDS.length;
    const kind = KINDS[kindIdx];
    if (kind === 'train') sfx.choochoo(); else if (kind === 'digger') sfx.honk(); else sfx.carBeep();
    const s = size() * 1.25;
    const x = Math.random() < 0.5 ? s * 1.8 : W() - s * 1.8;
    // Narrow screens: if it would still touch the middle column, pop in above the no-go zone.
    const tooClose = inNoGoColumn(x, s * 1.7 + 20);
    vehicles.push({
      kind, s, carColour: pick(['#e53935', '#1e88e5', '#43a047', '#8e24aa', '#fb8c00']), grow: tooClose ? 0 : 1,
      x, y: tooClose ? H() * NO_GO.top - s * 1.0 : H() + s * 3,
      vy: -s * 0.45, vx: 0, state: 'float', sway: rand(0, 6), wheel: 0,
      dir: Math.random() < 0.5 ? -1 : 1, smokeT: 0,
      balloonColours: [pick(COLOURS), pick(COLOURS), pick(COLOURS)],
    });
  }

  // ---------- Effects ----------
  function burst(x, y, colour, n = 18) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(120, 380);
      bits.push({
        kind: 'confetti', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80,
        life: rand(0.8, 1.4), max: 1.4, rot: rand(0, 6), vr: rand(-10, 10),
        color: Math.random() < 0.6 ? colour : pick(COLOURS).fill, w: rand(6, 12),
      });
    }
  }

  function giveStars(x, y, n) {
    for (let i = 0; i < n && earned < GOAL; i++) {
      flyers.push({ x0: x, y0: y, slot: earned, t: -i * 0.15 });
      earned++;
    }
  }

  function slotPos(i) {
    const left = 100, right = 20;
    const gap = Math.min(56, (W() - left - right) / GOAL);
    const total = gap * GOAL;
    const x0 = left + (W() - left - right - total) / 2 + gap / 2;
    return { x: x0 + i * gap, y: 46, r: Math.min(22, gap * 0.42) };
  }

  // ---------- Tapping ----------
  const active = new Set();
  function onDown(e) {
    active.add(e.pointerId);
    if (active.size > 3) return;          // palm / whole-hand slap
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    tap(x, y);
  }
  const onUp = e => active.delete(e.pointerId);

  function tap(x, y) {
    // Vehicles first (they're the big prize).
    for (const v of vehicles) {
      if (v.state !== 'float') continue;
      const top = v.y - v.s * 3.2, bottom = v.y + v.s * 0.9;
      if (Math.abs(x - v.x) < v.s * 1.7 && y > top && y < bottom) {
        popVehicle(v);
        return;
      }
    }
    // Nearest balloon within a generous radius.
    let best = null, bestD = Infinity;
    for (const b of balloons) {
      const d = Math.hypot(x - b.x, (y - b.y) * 0.85);
      if (d < b.r * 1.35 && d < bestD) { best = b; bestD = d; }
    }
    if (best) popBalloon(best, true);
  }

  function popBalloon(b, byTap) {
    balloons = balloons.filter(o => o !== b);
    burst(b.x, b.y, b.c.fill);
    sfx.pop(b.c.note);
    if (byTap) {
      sfx.giggle();
      giveStars(b.x, b.y, 1);
    }
  }

  function popVehicle(v) {
    v.state = 'fall';
    v.vy = 0;
    v.balloonColours.forEach((c, i) => burst(v.x + (i - 1) * v.s * 0.7, v.y - v.s * 2.4, c.fill, 12));
    sfx.pop(784);
    sfx.boing();
    later(200, () => sfx.wheee());
    if (v.kind === 'train') later(250, () => sfx.bell());
    else if (v.kind === 'digger') later(250, () => sfx.clank());
    else later(250, () => sfx.honkHonk());
    giveStars(v.x, v.y - v.s, VEHICLE_STARS);
  }

  // ---------- Grown-up exit: hold 🏠 ----------
  const homeBtn = stage.parentElement?.querySelector('.home-btn');
  let holdT = null, holdStart = 0;
  const blockClick = e => { e.stopImmediatePropagation(); e.preventDefault(); };
  const holdDown = () => { holdStart = performance.now(); holdT = setTimeout(() => { location.hash = ''; }, HOLD_TO_EXIT * 1000); };
  const holdUp = () => { clearTimeout(holdT); holdT = null; homeBtn && (homeBtn.style.background = ''); };
  if (homeBtn) {
    homeBtn.addEventListener('click', blockClick, true);
    homeBtn.addEventListener('pointerdown', holdDown);
    homeBtn.addEventListener('pointerup', holdUp);
    homeBtn.addEventListener('pointerleave', holdUp);
    homeBtn.addEventListener('pointercancel', holdUp);
    homeBtn.style.opacity = '0.55';
  }

  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  // ---------- Update ----------
  function update(dt) {
    time += dt;

    // Hold-to-exit progress ring on the home button.
    if (homeBtn && holdT) {
      const p = Math.min(1, (performance.now() - holdStart) / (HOLD_TO_EXIT * 1000));
      homeBtn.style.background = `conic-gradient(#ffd54f ${p * 360}deg, #ff6a3d 0)`;
    }

    for (const c of clouds) { c.x += c.v * dt; if (c.x > 1.2) c.x = -0.2; }

    // Spawning
    if (!party) {
      spawnT -= dt;
      const want = W() < 600 ? 6 : 9;
      if (spawnT <= 0 && balloons.length < want) {
        addBalloon();
        spawnT = rand(0.6, 1.2);
      }
      vehicleT -= dt;
      if (vehicleT <= 0 && vehicles.length === 0) {
        addVehicle();
        vehicleT = rand(7, 10);
      }
    }

    for (const b of balloons) {
      b.grow = Math.min(1, b.grow + dt * 3);
      b.y += b.vy * dt * b.grow;
      b.sway += b.swaySpeed * dt;
      b.x += Math.sin(b.sway) * 12 * dt;
    }
    balloons = balloons.filter(b => b.y > -b.r * 3);

    for (const v of vehicles) {
      v.sway += dt;
      if (v.state === 'float') {
        v.grow = Math.min(1, v.grow + dt * 3);
        v.y += v.vy * dt * v.grow;
        v.x += Math.sin(v.sway * 0.8) * 15 * dt;
        if (v.y < -v.s * 1.5) v.gone = true;
      } else if (v.state === 'fall') {
        // Float down gently, like a feather.
        v.vy = Math.min(v.vy + 500 * dt, 260);
        v.y += v.vy * dt;
        if (v.y >= groundY()) {
          v.y = groundY();
          v.state = 'drive';
          v.vx = v.dir * v.s * 1.6;
          sfx.thud();
          if (v.kind === 'digger') { later(200, () => sfx.vroom()); later(800, () => sfx.beep()); }
          else if (v.kind === 'car') later(200, () => sfx.vroomVroom());
          else { later(200, () => sfx.choochoo()); v.chooT = 2.6; }
        }
      } else if (v.state === 'drive') {
        v.x += v.vx * dt;
        v.wheel += (v.vx / (v.s * 0.2)) * dt;
        v.smokeT -= dt;
        if (v.smokeT <= 0) {
          v.smokeT = v.kind === 'train' ? 0.28 : 0.35;
          const cx = v.kind === 'train' ? v.x + v.dir * v.s * 0.55 : v.kind === 'car' ? v.x - v.dir * v.s * 1.05 : v.x - v.dir * v.s * 0.35;
          const cy = v.kind === 'train' ? v.y - v.s * 1.35 : v.kind === 'car' ? v.y - v.s * 0.25 : v.y - v.s * 1.25;
          bits.push({ kind: 'smoke', x: cx, y: cy, vx: -v.dir * 20, vy: -50, life: 1.4, max: 1.4, w: v.s * 0.18 });
          if (v.kind === 'train') sfx.chuff();
        }
        if (v.kind === 'digger' || v.kind === 'car') {
          v.engineT = (v.engineT ?? 0) - dt;
          if (v.engineT <= 0) { v.engineT = v.kind === 'car' ? 0.08 : 0.11; v.kind === 'car' ? sfx.hum() : sfx.putter(); }
        }
        if (v.kind === 'train') {
          v.chooT -= dt;
          if (v.chooT <= 0) { v.chooT = 3; sfx.choochoo(); }
        }
        if (v.x < -v.s * 3 || v.x > W() + v.s * 3) v.gone = true;
      }
    }
    vehicles = vehicles.filter(v => !v.gone);

    for (const p of bits) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'confetti') { p.vy += 500 * dt; p.vx *= 0.98; p.rot += p.vr * dt; }
      if (p.kind === 'spark') { p.vy += 120 * dt; p.vx *= 0.98; p.vy *= 0.98; }
      if (p.kind === 'smoke') { p.w += 14 * dt; }
    }
    bits = bits.filter(p => p.life > 0);

    for (const f of flyers) {
      f.t += dt / 0.8;
      if (f.t >= 1 && !f.done) {
        f.done = true;
        filled++;
        sfx.ding(filled);
      }
    }
    flyers = flyers.filter(f => !f.done);

    // Party!
    if (!party && filled >= GOAL) {
      party = { t: 0, fw: 0 };
      sound.win();
      sfx.fanfare();
      balloons.forEach((b, i) => setTimeout(() => balloons.includes(b) && popBalloon(b, false), i * 120));
    }
    if (party) {
      party.t += dt;
      party.fw -= dt;
      if (party.fw <= 0 && party.t < 4) {
        party.fw = 0.35;
        firework(rand(W() * 0.15, W() * 0.85), rand(H() * 0.15, H() * 0.5));
      }
      if (party.t > 5.5) {
        party = null;
        filled = 0;
        earned = 0;
        spawnT = 0.3;
      }
    }
  }

  function firework(x, y) {
    sfx.firework();
    const c = pick(COLOURS).fill;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2, sp = rand(150, 260);
      bits.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.3, max: 1.3, color: c });
    }
  }

  // ---------- Drawing ----------
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, '#81d4fa');
    g.addColorStop(1, '#e1f5fe');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());

    // Sun
    const sx = W() - 90, sy = 130;
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(sx, sy, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff59d'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + time * 0.2;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(a) * 60, sy + Math.sin(a) * 60);
      ctx.lineTo(sx + Math.cos(a) * 76, sy + Math.sin(a) * 76);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,.9)';
    for (const c of clouds) {
      const x = c.x * W(), y = c.y * H(), s = 40 * c.s;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.arc(x + s, y + s * 0.2, s * 0.8, 0, Math.PI * 2);
      ctx.arc(x - s, y + s * 0.25, s * 0.7, 0, Math.PI * 2);
      ctx.arc(x + s * 0.3, y - s * 0.5, s * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grass
    const gy = groundY();
    ctx.fillStyle = '#8bc34a';
    ctx.fillRect(0, gy, W(), H() - gy);
    ctx.fillStyle = '#7cb342';
    for (let x = 0; x < W(); x += 28) {
      ctx.beginPath(); ctx.arc(x + 14, gy, 16, Math.PI, 0); ctx.fill();
    }
  }

  function balloonShape(x, y, r, c) {
    // String
    ctx.strokeStyle = 'rgba(80,80,80,.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + r * 1.15);
    for (let i = 1; i <= 6; i++) ctx.lineTo(x + Math.sin(time * 3 + i + x) * 5, y + r * 1.15 + i * r * 0.22);
    ctx.stroke();
    // Knot
    ctx.fillStyle = c.dark;
    ctx.beginPath();
    ctx.moveTo(x, y + r * 1.05);
    ctx.lineTo(x - r * 0.12, y + r * 1.22);
    ctx.lineTo(x + r * 0.12, y + r * 1.22);
    ctx.fill();
    // Body
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.2);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.18, c.fill);
    g.addColorStop(1, c.dark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.88, r * 1.08, 0, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.38, y - r * 0.45, r * 0.13, r * 0.25, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  }

  function wheel(x, y, r, rot, hub) {
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hub;
    ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = Math.max(2, r * 0.15);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(rot) * r * 0.5, y + Math.sin(rot) * r * 0.5);
    ctx.lineTo(x - Math.cos(rot) * r * 0.5, y - Math.sin(rot) * r * 0.5);
    ctx.stroke();
  }

  // Digger: origin at bottom-centre of the tracks, facing right. s ≈ half width.
  function drawDigger(s, rot) {
    // Tracks
    ctx.fillStyle = '#424242';
    rrect(-s * 0.95, -s * 0.38, s * 1.5, s * 0.38, s * 0.19); ctx.fill();
    for (let i = 0; i < 4; i++) wheel(-s * 0.75 + i * s * 0.37, -s * 0.19, s * 0.13, rot, '#9e9e9e');
    // Body
    ctx.fillStyle = '#fbc02d';
    rrect(-s * 0.9, -s * 0.85, s * 1.1, s * 0.5, s * 0.08); ctx.fill();
    // Cab
    rrect(-s * 0.55, -s * 1.45, s * 0.6, s * 0.65, s * 0.1); ctx.fill();
    ctx.fillStyle = '#b3e5fc';
    rrect(-s * 0.45, -s * 1.35, s * 0.42, s * 0.35, s * 0.06); ctx.fill();
    // Light
    ctx.fillStyle = '#ff7043';
    ctx.beginPath(); ctx.arc(-s * 0.25, -s * 1.5, s * 0.07, 0, Math.PI * 2); ctx.fill();
    // Arm
    ctx.strokeStyle = '#f9a825'; ctx.lineCap = 'round'; ctx.lineWidth = s * 0.16;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.8);
    ctx.lineTo(s * 0.6, -s * 1.35);
    ctx.lineTo(s * 0.95, -s * 0.6);
    ctx.stroke();
    // Bucket
    ctx.fillStyle = '#757575';
    ctx.beginPath();
    ctx.moveTo(s * 0.8, -s * 0.65);
    ctx.lineTo(s * 1.15, -s * 0.65);
    ctx.lineTo(s * 1.1, -s * 0.3);
    ctx.lineTo(s * 0.9, -s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  // Train engine: origin at bottom-centre of wheels, facing right.
  function drawTrain(s, rot) {
    // Base
    ctx.fillStyle = '#333';
    ctx.fillRect(-s * 0.95, -s * 0.5, s * 1.9, s * 0.15);
    // Cab (back)
    ctx.fillStyle = '#e53935';
    rrect(-s * 0.95, -s * 1.3, s * 0.7, s * 0.85, s * 0.06); ctx.fill();
    ctx.fillStyle = '#b71c1c';
    rrect(-s * 1.02, -s * 1.42, s * 0.84, s * 0.16, s * 0.05); ctx.fill();
    ctx.fillStyle = '#fff9c4';
    rrect(-s * 0.82, -s * 1.15, s * 0.44, s * 0.32, s * 0.06); ctx.fill();
    // Boiler
    ctx.fillStyle = '#1e88e5';
    rrect(-s * 0.3, -s * 1.0, s * 1.15, s * 0.55, s * 0.25); ctx.fill();
    ctx.fillStyle = '#fdd835';
    ctx.fillRect(s * 0.05, -s * 1.0, s * 0.08, s * 0.55);
    ctx.fillRect(s * 0.4, -s * 1.0, s * 0.08, s * 0.55);
    // Chimney
    ctx.fillStyle = '#333';
    ctx.fillRect(s * 0.5, -s * 1.35, s * 0.16, s * 0.38);
    ctx.fillRect(s * 0.44, -s * 1.42, s * 0.28, s * 0.1);
    // Front light
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(s * 0.85, -s * 0.72, s * 0.08, 0, Math.PI * 2); ctx.fill();
    // Cow catcher
    ctx.fillStyle = '#fdd835';
    ctx.beginPath();
    ctx.moveTo(s * 0.85, -s * 0.45);
    ctx.lineTo(s * 1.1, -s * 0.05);
    ctx.lineTo(s * 0.85, -s * 0.05);
    ctx.fill();
    // Wheels
    wheel(-s * 0.6, -s * 0.22, s * 0.22, rot, '#e53935');
    wheel(0, -s * 0.22, s * 0.22, rot, '#e53935');
    wheel(s * 0.55, -s * 0.22, s * 0.22, rot, '#e53935');
  }

  // Car: origin at bottom-centre of wheels, facing right.
  function drawCar(s, rot, colour) {
    // Body
    ctx.fillStyle = colour;
    rrect(-s * 1.0, -s * 0.75, s * 2.0, s * 0.45, s * 0.18); ctx.fill();
    // Roof / cabin
    ctx.beginPath();
    ctx.moveTo(-s * 0.6, -s * 0.72);
    ctx.lineTo(-s * 0.4, -s * 1.2);
    ctx.lineTo(s * 0.3, -s * 1.2);
    ctx.lineTo(s * 0.6, -s * 0.72);
    ctx.closePath();
    ctx.fill();
    // Windows
    ctx.fillStyle = '#b3e5fc';
    ctx.beginPath();
    ctx.moveTo(-s * 0.48, -s * 0.78); ctx.lineTo(-s * 0.33, -s * 1.1); ctx.lineTo(-s * 0.06, -s * 1.1); ctx.lineTo(-s * 0.06, -s * 0.78);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.04, -s * 0.78); ctx.lineTo(s * 0.04, -s * 1.1); ctx.lineTo(s * 0.25, -s * 1.1); ctx.lineTo(s * 0.47, -s * 0.78);
    ctx.closePath(); ctx.fill();
    // Lights
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(s * 0.92, -s * 0.58, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff7043';
    ctx.fillRect(-s * 1.0, -s * 0.66, s * 0.08, s * 0.14);
    // Smiley grille
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath(); ctx.arc(s * 0.72, -s * 0.5, s * 0.1, 0.2, Math.PI - 0.2); ctx.stroke();
    // Wheels
    wheel(-s * 0.55, -s * 0.24, s * 0.24, rot, '#bdbdbd');
    wheel(s * 0.55, -s * 0.24, s * 0.24, rot, '#bdbdbd');
  }

  function drawVehicle(v) {
    const g = v.grow, k = 1.7;
    const e = g >= 1 ? 1 : 1 + (k + 1) * (g - 1) ** 3 + k * (g - 1) ** 2;
    if (e < 0.02) return;
    if (e !== 1) {
      ctx.save();
      ctx.translate(v.x, v.y - v.s);
      ctx.scale(e, e);
      ctx.translate(-v.x, -(v.y - v.s));
    }
    drawVehicleInner(v);
    if (e !== 1) ctx.restore();
  }

  function drawVehicleInner(v) {
    const s = v.s;
    if (v.state === 'float') {
      // Three balloons holding it up.
      const tops = [[-s * 0.7, -s * 2.6], [0, -s * 3.0], [s * 0.7, -s * 2.6]];
      ctx.strokeStyle = 'rgba(80,80,80,.6)'; ctx.lineWidth = 2;
      tops.forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(v.x + dx, v.y + dy + s * 0.6); ctx.lineTo(v.x, v.y - s * 1.4); ctx.stroke();
      });
      tops.forEach(([dx, dy], i) => {
        const c = v.balloonColours[i];
        const r = s * 0.5;
        const g = ctx.createRadialGradient(v.x + dx - r * 0.3, v.y + dy - r * 0.3, r * 0.1, v.x + dx, v.y + dy, r * 1.2);
        g.addColorStop(0, '#fff'); g.addColorStop(0.2, c.fill); g.addColorStop(1, c.dark);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(v.x + dx, v.y + dy, r * 0.88, r * 1.08, 0, 0, Math.PI * 2); ctx.fill();
      });
      // Gentle glow so it stands out.
      ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.sin(time * 4) * 0.1})`;
      ctx.beginPath(); ctx.ellipse(v.x, v.y - s * 0.7, s * 1.5, s * 1.0, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.save();
    ctx.translate(v.x, v.y);
    const bob = v.state === 'drive' ? Math.abs(Math.sin(time * 12)) * s * 0.03 : 0;
    ctx.translate(0, -bob);
    ctx.scale(v.dir, 1);
    if (v.state !== 'drive') ctx.rotate(Math.sin(v.sway * 2) * 0.06);
    if (v.kind === 'digger') drawDigger(s, v.wheel);
    else if (v.kind === 'car') drawCar(s, v.wheel, v.carColour);
    else drawTrain(s, v.wheel);
    ctx.restore();
  }

  function star(x, y, r, fill, stroke) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
  }

  function drawStarBar() {
    for (let i = 0; i < GOAL; i++) {
      const p = slotPos(i);
      if (i < filled) {
        const wob = party ? Math.sin(time * 10 + i) * 0.2 : 0;
        star(p.x, p.y, p.r * (1.1 + wob), '#ffd600', '#ff8f00');
      } else {
        star(p.x, p.y, p.r, 'rgba(255,255,255,.5)', 'rgba(255,255,255,.9)');
      }
    }
    for (const f of flyers) {
      if (f.t < 0) continue;
      const p = slotPos(f.slot);
      const t = f.t, e = t * t * (3 - 2 * t);
      const x = f.x0 + (p.x - f.x0) * e;
      const y = f.y0 + (p.y - f.y0) * e - Math.sin(t * Math.PI) * 80;
      star(x, y, p.r * (1.6 - t * 0.5), '#ffd600', '#ff8f00');
    }
  }

  function drawBits() {
    for (const p of bits) {
      const a = Math.max(0, p.life / p.max);
      if (p.kind === 'confetti') {
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2);
        ctx.restore();
      } else if (p.kind === 'smoke') {
        ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.w, 0, Math.PI * 2); ctx.fill();
      } else if (p.kind === 'spark') {
        ctx.globalAlpha = a;
        star(p.x, p.y, 6, p.color);
        ctx.globalAlpha = 1;
      }
    }
  }

  function draw() {
    drawSky();
    for (const b of balloons) {
      // Springy pop-in for balloons that appear in the middle.
      const g = b.grow, k = 1.7;
      const e = g >= 1 ? 1 : 1 + (k + 1) * (g - 1) ** 3 + k * (g - 1) ** 2;
      if (e > 0.02) balloonShape(b.x, b.y, b.r * e, b.c);
    }
    for (const v of vehicles) drawVehicle(v);
    drawBits();
    drawStarBar();
    if (party && party.t < 5) {
      const s = 1 + Math.sin(time * 6) * 0.06;
      ctx.save();
      ctx.translate(W() / 2, H() * 0.45);
      ctx.scale(s, s);
      ctx.font = `700 ${Math.min(120, W() * 0.16)}px Fredoka, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#fff';
      ctx.strokeText('Hooray! 🎉', 0, 0);
      ctx.fillStyle = '#e91e63';
      ctx.fillText('Hooray! 🎉', 0, 0);
      ctx.restore();
    }
  }

  // A few balloons already up so there's something to tap straight away.
  for (let i = 0; i < 3; i++) addBalloon(H() * rand(0.45, 0.85));

  const stop = startLoop(update, draw);

  return () => {
    stop();
    clearTimeout(holdT);
    canvas.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    if (homeBtn) {
      homeBtn.removeEventListener('click', blockClick, true);
      homeBtn.removeEventListener('pointerdown', holdDown);
      homeBtn.removeEventListener('pointerup', holdUp);
      homeBtn.removeEventListener('pointerleave', holdUp);
      homeBtn.removeEventListener('pointercancel', holdUp);
    }
    view.destroy();
  };
}
