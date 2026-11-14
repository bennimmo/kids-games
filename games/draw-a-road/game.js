// Monster Doodle – draw lines with your finger so the car can get to the flag.
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound } from '../../js/engine/sound.js';
import { LEVELS } from './levels.js';
import { createSim, strokeLength, STEP, WORLD_W, WORLD_H, CAR } from './sim.js';

const SAVE_KEY = 'draw-a-road:stars';
const HUD_H = 92;
const CRAYONS = ['#e53935', '#8e24aa', '#1e88e5', '#43a047', '#fb8c00', '#d81b60'];

function loadStars() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; }
}
function saveStars(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ok */ }
}

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const view = createCanvas(stage);
  const { canvas, ctx } = view;
  const ui = document.createElement('div');
  ui.className = 'dar';
  stage.appendChild(ui);

  let stars = loadStars();
  let levelIdx = 0;
  let level = null;
  let strokes = [];        // [{pts:[[x,y],...], color}]
  let drawing = null;      // stroke being drawn
  let mode = 'menu';       // 'menu' | 'draw' | 'drive' | 'done'
  let sim = null;
  let acc = 0;
  let time = 0;
  let particles = [];
  let smoke = [];          // exhaust puffs
  let shake = 0;           // screen wobble on big bumps
  let puffTimer = 0;
  let lastTick = 0;
  let loseTimer = 0;
  let winTimer = 0;

  // ---------- helpers ----------
  const inkUsed = () => strokes.reduce((a, s) => a + strokeLength(s.pts), 0) + (drawing ? strokeLength(drawing.pts) : 0);
  const inkLeft = () => Math.max(0, level.ink - inkUsed());
  const starsFor = used => (used <= level.stars[1] ? 3 : used <= level.stars[0] ? 2 : 1);
  const unlocked = i => i === 0 || stars[i - 1] > 0 || stars[i] > 0;

  function layout() {
    const hud = ui.querySelector('.dar-hud');
    const top = hud ? Math.max(HUD_H, hud.offsetHeight) : HUD_H;
    const w = view.width, h = view.height - top;
    const s = Math.min(w / WORLD_W, h / WORLD_H);
    return { s, ox: (w - WORLD_W * s) / 2, oy: top + (h - WORLD_H * s) / 2 };
  }
  const toScreen = (L, x, y) => [L.ox + x * L.s, L.oy + (WORLD_H - y) * L.s];
  const toWorld = (L, px, py) => [(px - L.ox) / L.s, WORLD_H - (py - L.oy) / L.s];

  // ---------- screens ----------
  function showMenu() {
    mode = 'menu';
    ui.innerHTML = `
      <div class="dar-menu">
        <h2>🛻 Monster Doodle</h2>
        <p>Draw a road so the monster truck gets to the flag 🏁</p>
        <div class="dar-levels">
          ${LEVELS.map((lv, i) => {
            const open = unlocked(i);
            const st = stars[i] || 0;
            return `<button class="dar-lv ${open ? '' : 'locked'}" data-i="${i}" ${open ? '' : 'disabled'}>
              <span class="num">${open ? i + 1 : '🔒'}</span>
              <span class="nm">${lv.name}</span>
              <span class="st">${[1, 2, 3].map(n => `<b class="${n <= st ? 'on' : ''}">★</b>`).join('')}</span>
            </button>`;
          }).join('')}
        </div>
      </div>`;
    ui.querySelectorAll('.dar-lv').forEach(b => b.addEventListener('click', () => {
      sound.pop();
      startLevel(+b.dataset.i);
    }));
  }

  function startLevel(i) {
    levelIdx = i;
    level = LEVELS[i];
    strokes = [];
    drawing = null;
    particles = [];
    enterDraw();
  }

  function enterDraw() {
    mode = 'draw';
    sim = null;
    ui.innerHTML = `
      <div class="dar-hud">
        <div class="dar-title"><span class="n">${levelIdx + 1}</span> ${level.name}${level.engine === false ? ' <small>(no engine!)</small>' : ''}</div>
        <div class="dar-ink">
          <div class="bar"><div class="fill"></div></div>
          <div class="stars"></div>
        </div>
        <div class="dar-btns">
          <button class="dar-btn levels" aria-label="Levels">☰</button>
          <button class="dar-btn undo" aria-label="Undo">↶</button>
          <button class="dar-btn clear" aria-label="Rub out">🧽</button>
          <button class="dar-btn go" aria-label="Go">▶</button>
        </div>
      </div>
      <div class="dar-toast"></div>`;
    const q = sel => ui.querySelector(sel);
    q('.levels').onclick = () => { sound.pop(); showMenu(); };
    q('.undo').onclick = () => { sound.pop(); strokes.pop(); updateHud(); };
    q('.clear').onclick = () => { sound.pop(); strokes = []; updateHud(); };
    q('.go').onclick = () => { sound.pop(); mode === 'drive' ? enterDraw() : go(); };
    updateHud();
  }

  function updateHud() {
    const fill = ui.querySelector('.dar-ink .fill');
    if (!fill || !level) return;
    const left = inkLeft();
    fill.style.width = (left / level.ink * 100) + '%';
    fill.style.background = left < level.ink * 0.2 ? '#ef5350' : '';
    const st = starsFor(inkUsed());
    ui.querySelector('.dar-ink .stars').innerHTML = [1, 2, 3].map(n => `<b class="${n <= st ? 'on' : ''}">★</b>`).join('');
    const drive = mode === 'drive';
    ui.querySelector('.go').textContent = drive ? '■' : '▶';
    ui.querySelector('.go').classList.toggle('stop', drive);
    ui.querySelector('.undo').disabled = drive || !strokes.length;
    ui.querySelector('.clear').disabled = drive || !strokes.length;
  }

  function go() {
    mode = 'drive';
    acc = 0;
    loseTimer = 0;
    winTimer = 0;
    sim = createSim(level, strokes);
    updateHud();
  }

  function toast(text) {
    const t = ui.querySelector('.dar-toast');
    if (!t) return;
    t.textContent = text;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
  }

  function showWin() {
    mode = 'done';
    const got = starsFor(inkUsed());
    if (!(stars[levelIdx] >= got)) { stars[levelIdx] = got; saveStars(stars); }
    const last = levelIdx >= LEVELS.length - 1;
    const pop = document.createElement('div');
    pop.className = 'dar-pop';
    pop.innerHTML = `
      <div class="card">
        <h3>${got === 3 ? 'Amazing!' : got === 2 ? 'Great job!' : 'You did it!'}</h3>
        <div class="big-stars">${[1, 2, 3].map(n => `<b class="${n <= got ? 'on' : ''}" style="animation-delay:${n * 0.25}s">★</b>`).join('')}</div>
        <p>${got < 3 ? 'Use less crayon for more stars ✏️' : 'All the stars! ⭐'}</p>
        <div class="row">
          <button class="dar-btn again" aria-label="Again">↻</button>
          <button class="dar-btn levels" aria-label="Levels">☰</button>
          ${last ? '' : '<button class="dar-btn next" aria-label="Next">▶</button>'}
        </div>
      </div>`;
    ui.appendChild(pop);
    pop.querySelector('.again').onclick = () => { sound.pop(); enterDraw(); };
    pop.querySelector('.levels').onclick = () => { sound.pop(); showMenu(); };
    const nx = pop.querySelector('.next');
    if (nx) nx.onclick = () => { sound.pop(); startLevel(levelIdx + 1); };
  }

  // ---------- input ----------
  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    const [x, y] = toWorld(layout(), e.clientX - r.left, e.clientY - r.top);
    return [Math.max(0, Math.min(WORLD_W, x)), Math.max(0.2, Math.min(WORLD_H, y))];
  }
  function onDown(e) {
    if (mode !== 'draw' || inkLeft() < 0.3) {
      if (mode === 'draw') toast('Out of crayon! Tap 🧽 or ↶');
      return;
    }
    canvas.setPointerCapture?.(e.pointerId);
    drawing = { pts: [pointer(e)], color: CRAYONS[strokes.length % CRAYONS.length] };
  }
  function onMove(e) {
    if (!drawing) return;
    const p = pointer(e);
    const last = drawing.pts[drawing.pts.length - 1];
    let d = Math.hypot(p[0] - last[0], p[1] - last[1]);
    if (d < 0.3) return;
    const left = inkLeft();
    if (d > left) { // clip to the crayon that is left
      const t = left / d;
      p[0] = last[0] + (p[0] - last[0]) * t;
      p[1] = last[1] + (p[1] - last[1]) * t;
      d = left;
    }
    drawing.pts.push(p);
    if (time - lastTick > 0.06) { sound.tone(300 + Math.random() * 200, 0.03, 'triangle', 0.05); lastTick = time; }
    if (inkLeft() < 0.05) onUp();
    updateHud();
  }
  function onUp() {
    if (!drawing) return;
    if (strokeLength(drawing.pts) >= 0.4) strokes.push(drawing);
    drawing = null;
    updateHud();
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  const onKey = e => {
    if (!level || mode === 'menu') return;
    if (e.code === 'Space') { e.preventDefault(); mode === 'drive' ? enterDraw() : mode === 'draw' && go(); }
    if (e.code === 'KeyZ' && mode === 'draw') { strokes.pop(); updateHud(); }
  };
  window.addEventListener('keydown', onKey);

  // ---------- update ----------
  function burst(x, y, n, colors, speed = 6) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = speed * (0.3 + Math.random());
      particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 3, life: 1 + Math.random(), c: colors[i % colors.length], r: 0.12 + Math.random() * 0.12 });
    }
  }

  function update(dt) {
    time += dt;
    particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy -= 12 * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);
    smoke.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.9; });
    smoke = smoke.filter(p => p.life > 0);
    shake = Math.max(0, shake - dt * 1.5);
    if (mode !== 'drive' || !sim) return;

    if (sim.state.status === 'driving') {
      acc += dt;
      while (acc >= STEP && sim.state.status === 'driving') { sim.step(); acc -= STEP; }
    }
    const c = sim.car();
    // vroom: puffs from the exhaust pipe
    puffTimer -= dt;
    if (sim.state.status === 'driving' && level.engine !== false && puffTimer <= 0) {
      puffTimer = c.boosting ? 0.03 : 0.09;
      const cos = Math.cos(c.angle), sin = Math.sin(c.angle);
      smoke.push({ x: c.x - 0.53 * cos - 1.1 * sin, y: c.y - 0.53 * sin + 1.1 * cos, vx: -0.8 + Math.random() * 0.4, vy: 1 + Math.random() * 0.5,
        life: 1, r: 0.18 + Math.random() * 0.08, c: c.boosting ? '#ffb74d' : '#9e9e9e' });
    }
    for (const ev of sim.state.events.splice(0)) {
      if (ev === 'bounce') { shake = 0.25; sound.tone(200, 0.35, 'sine', 0.25, 900); burst(c.x, c.y - 0.5, 10, ['#fff', '#ffeb3b']); }
      if (ev === 'boost') { sound.tone(300, 0.4, 'sawtooth', 0.08, 1400); }
      if (ev === 'portal') { sound.tone(1200, 0.3, 'sine', 0.15, 300); burst(c.x, c.y, 16, ['#ce93d8', '#ff9800', '#fff']); }
      if (ev === 'win') { sound.win(); burst(level.flag.x, level.flag.y + 2, 60, CRAYONS, 9); }
      if (ev === 'lose') { shake = 0.4; sound.bump(); }
    }
    if (sim.state.status === 'won') {
      winTimer += dt;
      if (winTimer > 1.2) showWin();
    }
    if (sim.state.status === 'lost') {
      if (loseTimer === 0) toast(sim.state.reason === 'fell' ? 'Oops! Try again 🙂' : 'Stuck! Try again 🙂');
      loseTimer += dt;
      if (loseTimer > 1.4) enterDraw();
    }
  }

  // ---------- draw ----------
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  }

  // little pseudo-random helper so the scenery stays the same every frame
  const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function drawBackground(L) {
    const W = view.width, H = view.height;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#4fc3f7');
    g.addColorStop(0.6, '#b3e5fc');
    g.addColorStop(1, '#fff8e1');
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // sun with turning rays
    const [sx, sy] = toScreen(L, 9, WORLD_H - 2.6);
    const r = L.s * 1.4;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(time * 0.2);
    ctx.fillStyle = 'rgba(255,235,59,.35)';
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath(); ctx.moveTo(r * 1.15, -r * 0.18); ctx.lineTo(r * 1.9, 0); ctx.lineTo(r * 1.15, r * 0.18); ctx.fill();
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, 7);
    ctx.fillStyle = '#ffee58'; ctx.fill();
    ctx.lineWidth = L.s * 0.15; ctx.strokeStyle = '#fdd835'; ctx.stroke();

    // clouds drift slowly
    [[4, 15.5, 1], [15, 16, 1.3], [24, 14.5, 0.8], [30, 16.5, 0.7]].forEach(([cx, cy, k], i) => {
      const x = ((cx + time * 0.12 * (i + 1)) % (WORLD_W + 8)) - 4;
      const [px, py] = toScreen(L, x, cy);
      const rr = L.s * k;
      const blob = dy => {
        ctx.beginPath();
        ctx.arc(px, py + dy, rr, 0, 7); ctx.arc(px + rr, py - rr * 0.5 + dy, rr * 1.15, 0, 7);
        ctx.arc(px + rr * 2.1, py + dy, rr * 0.9, 0, 7); ctx.rect(px, py + dy, rr * 2.1, rr * 0.9);
        ctx.fill();
      };
      ctx.fillStyle = 'rgba(144,202,249,.5)'; blob(rr * 0.25);
      ctx.fillStyle = '#fff'; blob(0);
    });

    // two layers of rolling hills with trees
    const hills = (base, amp, col, seed, trees) => {
      const pts = [];
      for (let x = -4; x <= WORLD_W + 4; x += 0.5) {
        pts.push([x, base + Math.sin(x * 0.25 + seed) * amp + Math.sin(x * 0.6 + seed * 2) * amp * 0.35]);
      }
      ctx.beginPath();
      ctx.moveTo(-20, H + 20);
      pts.forEach(([x, y]) => { const [a, b] = toScreen(L, x, y); ctx.lineTo(x <= -4 ? -20 : x >= WORLD_W + 4 ? W + 20 : a, b); });
      ctx.lineTo(W + 20, H + 20);
      ctx.fillStyle = col;
      ctx.fill();
      if (!trees) return;
      for (let i = 0; i < 6; i++) {
        const tx = rnd(i + seed * 10) * WORLD_W;
        const ty = base + Math.sin(tx * 0.25 + seed) * amp + Math.sin(tx * 0.6 + seed * 2) * amp * 0.35;
        const [a, b] = toScreen(L, tx, ty);
        const ts = L.s * (0.5 + rnd(i + 3) * 0.3);
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(a - ts * 0.1, b - ts * 0.9, ts * 0.2, ts * 0.9);
        ctx.fillStyle = trees;
        ctx.beginPath(); ctx.arc(a, b - ts * 1.1, ts * 0.55, 0, 7); ctx.fill();
      }
    };
    hills(6.5, 1.6, '#c5e1a5', 1.3, null);
    hills(3, 1.1, '#aed581', 4.1, '#7cb342');
  }

  let dirtPattern = null, dirtScale = 0;
  function dirt(L) {
    if (dirtPattern && dirtScale === L.s) return dirtPattern;
    const n = Math.max(16, Math.round(L.s * 3));
    const c = document.createElement('canvas');
    c.width = c.height = n;
    const x = c.getContext('2d');
    x.fillStyle = '#a1887f';
    x.fillRect(0, 0, n, n);
    for (let i = 0; i < 14; i++) {
      x.fillStyle = i % 3 ? 'rgba(93,64,55,.35)' : 'rgba(255,255,255,.18)';
      x.beginPath();
      x.ellipse(rnd(i) * n, rnd(i + 50) * n, n * (0.02 + rnd(i + 9) * 0.04), n * (0.015 + rnd(i + 7) * 0.025), 0, 0, 7);
      x.fill();
    }
    dirtPattern = ctx.createPattern(c, 'repeat');
    dirtScale = L.s;
    return dirtPattern;
  }

  function drawGround(L) {
    for (const [gi, g] of level.ground.entries()) {
      const pts = g.pts.map(p => [p[0] <= 0 ? -60 : p[0] >= WORLD_W ? WORLD_W + 60 : p[0], p[1]]);
      const sp = pts.map(p => toScreen(L, p[0], p[1]));
      const line = () => { ctx.beginPath(); sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); };
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (!g.float) {
        ctx.beginPath();
        ctx.moveTo(sp[0][0], view.height + 30);
        sp.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.lineTo(sp[sp.length - 1][0], view.height + 30);
        ctx.closePath();
        ctx.fillStyle = dirt(L);
        ctx.fill();
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = L.s * 0.14;
        ctx.stroke();
      } else {
        line();
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = L.s * 0.7;
        ctx.stroke();
      }
      // grass: dark edge, bright top, then tufts and flowers
      line(); ctx.strokeStyle = '#388e3c'; ctx.lineWidth = L.s * 0.55; ctx.stroke();
      ctx.save(); ctx.translate(0, -L.s * 0.06);
      line(); ctx.strokeStyle = '#66bb6a'; ctx.lineWidth = L.s * 0.4; ctx.stroke();
      ctx.restore();
      for (let i = 1; i < g.pts.length; i++) {
        const [x1, y1] = g.pts[i - 1], [x2, y2] = g.pts[i];
        const len = Math.hypot(x2 - x1, y2 - y1);
        for (let d = 0.4; d < len - 0.2; d += 0.7) {
          const k = gi * 100 + i * 37 + d * 3;
          const t = d / len, gx = x1 + (x2 - x1) * t, gy = y1 + (y2 - y1) * t;
          const [a, b] = toScreen(L, gx, gy);
          const h = L.s * (0.2 + rnd(k) * 0.15);
          ctx.fillStyle = '#43a047';
          ctx.beginPath();
          ctx.moveTo(a - L.s * 0.12, b - L.s * 0.15); ctx.lineTo(a - L.s * 0.05, b - L.s * 0.15 - h);
          ctx.lineTo(a, b - L.s * 0.15); ctx.lineTo(a + L.s * 0.07, b - L.s * 0.15 - h * 0.8); ctx.lineTo(a + L.s * 0.12, b - L.s * 0.15);
          ctx.fill();
          if (rnd(k + 5) > 0.8) {
            ctx.fillStyle = ['#fff', '#ffeb3b', '#f06292'][Math.floor(rnd(k + 2) * 3)];
            ctx.beginPath(); ctx.arc(a + L.s * 0.25, b - L.s * 0.3, L.s * 0.08, 0, 7); ctx.fill();
          }
        }
      }
    }
    for (const b of level.blocks || []) {
      const [x, y] = toScreen(L, b.x, b.y + b.h);
      const bottom = b.y <= 0 ? view.height + 20 : y + b.h * L.s; // blocks on the floor go off screen
      roundRect(x, y, b.w * L.s, bottom - y, L.s * 0.2);
      ctx.fillStyle = '#ffb74d';
      ctx.fill();
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = L.s * 0.1;
      ctx.stroke();
      // brick lines
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = 'rgba(230,81,0,.4)';
      ctx.lineWidth = L.s * 0.06;
      for (let yy = 0, row = 0; yy < b.h; yy += 0.8, row++) {
        const [, ly] = toScreen(L, 0, b.y + yy);
        ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + b.w * L.s, ly); ctx.stroke();
        const off = row % 2 ? 0.5 : 0;
        for (let xx = off; xx < b.w; xx += 1) {
          const [lx] = toScreen(L, b.x + xx, 0);
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly - 0.8 * L.s); ctx.stroke();
        }
      }
      ctx.restore();
    }
  }

  function drawSpecials(L) {
    for (const z of level.floaty || []) {
      const [x, y] = toScreen(L, z.x, z.y + z.h);
      ctx.fillStyle = 'rgba(244,143,177,.22)';
      ctx.fillRect(x, y, z.w * L.s, z.h * L.s);
      ctx.strokeStyle = 'rgba(255,255,255,.8)';
      ctx.lineWidth = L.s * 0.06;
      for (let i = 0; i < 14; i++) {
        const bx = z.x + ((i * 3.7) % z.w);
        const by = z.y + ((i * 5.3 + time * (1 + (i % 3) * 0.4)) % z.h);
        const [px, py] = toScreen(L, bx, by);
        ctx.beginPath(); ctx.arc(px, py, L.s * (0.2 + (i % 3) * 0.1), 0, 7); ctx.stroke();
      }
    }
    for (const b of level.boosters || []) {
      const [x, y] = toScreen(L, b.x, b.y + b.h);
      roundRect(x, y, b.w * L.s, b.h * L.s, L.s * 0.3);
      ctx.fillStyle = 'rgba(255,235,59,.45)';
      ctx.fill();
      const dir = b.dir || 1;
      for (let i = 0; i < 3; i++) {
        const t = ((time * 2 + i / 3) % 1);
        const cx = b.x + (dir > 0 ? t : 1 - t) * b.w;
        const [px, py] = toScreen(L, cx, b.y + b.h / 2);
        const a = L.s * 0.45 * dir;
        ctx.globalAlpha = Math.sin(t * Math.PI);
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = L.s * 0.22;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(px - a, py - L.s * 0.4); ctx.lineTo(px, py); ctx.lineTo(px - a, py + L.s * 0.4);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    for (const b of level.bouncers || []) {
      const [x, y] = toScreen(L, b.x, b.y);
      const w = b.w * L.s;
      ctx.strokeStyle = '#546e7a';
      ctx.lineWidth = L.s * 0.1;
      for (let i = 0; i <= 3; i++) {
        const lx = x + w * (i / 3);
        ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx, y + L.s * 0.3); ctx.stroke();
      }
      roundRect(x, y - L.s * 0.25, w, L.s * 0.3, L.s * 0.15);
      const sg = ctx.createLinearGradient(x, 0, x + w, 0);
      for (let i = 0; i <= 6; i++) sg.addColorStop(i / 6, i % 2 ? '#fff' : '#e53935');
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.strokeStyle = '#b71c1c';
      ctx.lineWidth = L.s * 0.06;
      ctx.stroke();
    }
    for (const pt of level.portals || []) {
      [[pt.in, '#ab47bc', '#e1bee7'], [pt.out, '#fb8c00', '#ffe0b2']].forEach(([p, c1, c2], k) => {
        const [px, py] = toScreen(L, p.x, p.y);
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(0.6, 1);
        for (let i = 3; i >= 1; i--) {
          ctx.beginPath();
          ctx.arc(0, 0, L.s * (0.45 + i * 0.25 + Math.sin(time * 4 + i + k) * 0.05), 0, 7);
          ctx.fillStyle = i % 2 ? c1 : c2;
          ctx.fill();
        }
        ctx.restore();
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(time * (k ? -3 : 3));
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath(); ctx.arc(L.s * 0.5, 0, L.s * 0.08, 0, 7); ctx.fill();
        }
        ctx.restore();
      });
    }
  }

  function drawFlag(L) {
    const f = level.flag;
    const [px, py] = toScreen(L, f.x, f.y);
    const h = 3 * L.s;
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(px - L.s * 0.08, py - h, L.s * 0.16, h);
    ctx.beginPath(); ctx.arc(px, py - h, L.s * 0.15, 0, 7); ctx.fillStyle = '#ffca28'; ctx.fill();
    const cols = 4, rows = 3, cw = L.s * 0.4, ch = L.s * 0.4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wave = Math.sin(time * 5 + c * 0.8) * L.s * 0.08 * c / cols;
      ctx.fillStyle = (r + c) % 2 ? '#212121' : '#fff';
      ctx.fillRect(px + c * cw, py - h + L.s * 0.1 + r * ch + wave, cw + 0.5, ch + 0.5);
    }
  }

  function drawHint(L) {
    if (!level.hint || strokes.length || drawing || mode !== 'draw') return;
    const sp = level.hint.map(p => toScreen(L, p[0], p[1]));
    ctx.save();
    ctx.setLineDash([L.s * 0.3, L.s * 0.35]);
    ctx.lineDashOffset = -time * L.s * 1.5;
    ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.lineWidth = L.s * 0.15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.stroke();
    ctx.restore();
    // pointing finger moves along the hint
    const t = (time * 0.35) % 1;
    const total = strokeLength(level.hint);
    let d = t * total, i = 1;
    while (i < level.hint.length - 1 && d > Math.hypot(level.hint[i][0] - level.hint[i - 1][0], level.hint[i][1] - level.hint[i - 1][1])) {
      d -= Math.hypot(level.hint[i][0] - level.hint[i - 1][0], level.hint[i][1] - level.hint[i - 1][1]);
      i++;
    }
    const a = level.hint[i - 1], b = level.hint[i];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const k = Math.min(1, d / seg);
    const [hx, hy] = toScreen(L, a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k);
    ctx.font = `${L.s * 1.4}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('👆', hx, hy);
  }

  function drawStroke(L, s) {
    if (s.pts.length < 2) return;
    const sp = s.pts.map(p => toScreen(L, p[0], p[1]));
    const path = (dy = 0) => {
      ctx.beginPath();
      sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] + dy) : ctx.moveTo(p[0], p[1] + dy));
    };
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    path(L.s * 0.08);
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; // soft shadow
    ctx.lineWidth = L.s * 0.32;
    ctx.stroke();
    path();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = L.s * 0.26;
    ctx.stroke();
    // waxy crayon texture
    path(-L.s * 0.05);
    ctx.setLineDash([L.s * 0.25, L.s * 0.18, L.s * 0.08, L.s * 0.2]);
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    ctx.lineWidth = L.s * 0.06;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ----- monster truck -----
  const TRUCK = { body: '#8e24aa', dark: '#4a148c', flame1: '#ffeb3b', flame2: '#ff9800' };

  function drawTyre(px, py, R, angle) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-angle);
    // chunky treads
    ctx.fillStyle = '#1b1b1b';
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      roundRect(R * 0.78, -R * 0.15, R * 0.3, R * 0.3, R * 0.06);
      ctx.fill();
    }
    ctx.beginPath(); ctx.arc(0, 0, R * 0.95, 0, 7); ctx.fillStyle = '#212121'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, R * 0.68, 0, 7); ctx.fillStyle = '#424242'; ctx.fill();
    // shiny rim
    ctx.beginPath(); ctx.arc(0, 0, R * 0.48, 0, 7); ctx.fillStyle = '#ffca28'; ctx.fill();
    ctx.strokeStyle = '#f57f17'; ctx.lineWidth = R * 0.06; ctx.stroke();
    ctx.fillStyle = '#f57f17';
    for (let i = 0; i < 5; i++) {
      ctx.rotate(Math.PI * 2 / 5);
      ctx.beginPath(); ctx.arc(R * 0.3, 0, R * 0.06, 0, 7); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(0, 0, R * 0.14, 0, 7); ctx.fillStyle = '#fff8e1'; ctx.fill();
    ctx.restore();
  }

  function drawCar(L, c) {
    const s = L.s;
    const cos = Math.cos(c.angle), sin = Math.sin(c.angle);
    const local = (lx, ly) => toScreen(L, c.x + lx * cos - ly * sin, c.y + lx * sin + ly * cos);

    // straight springy shocks from the frame down to each wheel
    c.wheels.forEach((w, i) => {
      const side = i ? 1 : -1;
      const [ax, ay] = local(side * CAR.wheelX, 0.05);
      const [bx, by] = toScreen(L, w.x, w.y);
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#78909c'; ctx.lineWidth = s * 0.1;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      ctx.strokeStyle = '#ffca28'; ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      for (let k = 0; k <= 7; k++) {
        const t = 0.05 + k / 7 * 0.6, off = (k % 2 ? 1 : -1) * s * 0.1;
        ctx.lineTo(ax + dx * t + nx * off, ay + dy * t + ny * off);
      }
      ctx.stroke();
    });
    c.wheels.forEach(w => { const [px, py] = toScreen(L, w.x, w.y); drawTyre(px, py, CAR.wheelR * s, w.angle); });

    const [px, py] = toScreen(L, c.x, c.y);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-c.angle);
    const P = (x, y) => [x * s, -y * s];
    const poly = pts => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(...P(x, y)) : ctx.moveTo(...P(x, y))); ctx.closePath(); };
    const box = (x1, y1, x2, y2, r) => { roundRect(x1 * s, -y2 * s, (x2 - x1) * s, (y2 - y1) * s, r * s); };
    ctx.lineJoin = 'round';

    // chassis frame between the wheels
    ctx.fillStyle = '#37474f';
    box(-0.9, -0.1, 0.9, 0.06, 0.05); ctx.fill();
    // exhaust stack behind the cab
    ctx.fillStyle = '#b0bec5';
    box(-0.58, 0.4, -0.48, 1.08, 0.04); ctx.fill();
    ctx.fillStyle = '#546e7a';
    box(-0.6, 1.02, -0.46, 1.1, 0.03); ctx.fill();
    // cab
    poly([[-0.45, 0.44], [0.38, 0.44], [0.2, 0.92], [-0.38, 0.92]]);
    ctx.fillStyle = TRUCK.body; ctx.fill();
    ctx.strokeStyle = TRUCK.dark; ctx.lineWidth = s * 0.06; ctx.stroke();
    poly([[-0.31, 0.52], [0.25, 0.52], [0.12, 0.84], [-0.27, 0.84]]);
    ctx.fillStyle = '#b3e5fc'; ctx.fill();
    // driver with a helmet and a big smile
    ctx.beginPath(); ctx.arc(-0.06 * s, -0.64 * s, 0.12 * s, 0, 7); ctx.fillStyle = '#ffcc80'; ctx.fill();
    ctx.beginPath(); ctx.arc(-0.06 * s, -0.67 * s, 0.13 * s, Math.PI, 0); ctx.fillStyle = '#e53935'; ctx.fill();
    ctx.fillStyle = '#3e2723';
    ctx.beginPath(); ctx.arc(0.0, -0.64 * s, 0.02 * s, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3e2723'; ctx.lineWidth = s * 0.022;
    ctx.beginPath(); ctx.arc(-0.02 * s, -0.6 * s, 0.045 * s, 0.2, 2.2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    poly([[0.15, 0.55], [0.2, 0.55], [0.1, 0.81], [0.06, 0.81]]); ctx.fill();
    // roof lights
    ctx.fillStyle = '#263238';
    box(-0.38, 0.92, 0.18, 1.0, 0.03); ctx.fill();
    ctx.fillStyle = '#fff59d';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc((-0.28 + i * 0.18) * s, -0.96 * s, 0.04 * s, 0, 7); ctx.fill(); }
    // main body with flames
    const bodyPts = [[-1.0, 0.04], [0.96, 0.04], [1.03, 0.16], [1.0, 0.36], [0.4, 0.46], [-1.0, 0.47]];
    poly(bodyPts);
    const g = ctx.createLinearGradient(0, -0.47 * s, 0, -0.04 * s);
    g.addColorStop(0, '#ba68c8'); g.addColorStop(1, TRUCK.body);
    ctx.fillStyle = g; ctx.fill();
    ctx.save();
    poly(bodyPts);
    ctx.clip();
    const flame = (col, k) => {
      ctx.beginPath();
      ctx.moveTo(...P(1.05, 0.04));
      ctx.lineTo(...P(1.05, 0.04 + 0.3 * k));
      for (let i = 0; i < 4; i++) {
        const x = 0.8 - i * 0.33;
        ctx.quadraticCurveTo(...P(x + 0.08, 0.04 + 0.34 * k), ...P(x - 0.2, 0.04 + 0.26 * k + 0.04));
        ctx.quadraticCurveTo(...P(x - 0.04, 0.04 + 0.16 * k), ...P(x - 0.1, 0.1));
      }
      ctx.lineTo(...P(-0.55, 0.04));
      ctx.closePath();
      ctx.fillStyle = col; ctx.fill();
    };
    flame(TRUCK.flame2, 1);
    flame(TRUCK.flame1, 0.55);
    ctx.restore();
    poly(bodyPts);
    ctx.strokeStyle = TRUCK.dark; ctx.lineWidth = s * 0.06; ctx.stroke();
    // door line + handle
    ctx.strokeStyle = 'rgba(74,20,140,.5)'; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(...P(0.3, 0.44)); ctx.lineTo(...P(0.3, 0.08)); ctx.stroke();
    // truck bed rim
    ctx.fillStyle = TRUCK.dark;
    box(-1.03, 0.45, -0.5, 0.55, 0.04); ctx.fill();
    // bumpers + headlight
    ctx.fillStyle = '#cfd8dc';
    box(0.96, 0.04, 1.14, 0.2, 0.05); ctx.fill();
    box(-1.12, 0.04, -0.96, 0.2, 0.05); ctx.fill();
    ctx.beginPath(); ctx.arc(0.95 * s, -0.3 * s, 0.07 * s, 0, 7); ctx.fillStyle = '#fff176'; ctx.fill();
    ctx.strokeStyle = '#f9a825'; ctx.lineWidth = s * 0.02; ctx.stroke();
    ctx.fillStyle = '#e53935';
    box(-1.03, 0.26, -0.97, 0.38, 0.02); ctx.fill();
    if (c.boosting) {
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(-1.1 * s, -0.06 * s); ctx.lineTo((-1.6 - Math.random() * 0.5) * s, -0.14 * s); ctx.lineTo(-1.1 * s, -0.24 * s);
      ctx.fill();
      ctx.fillStyle = '#fff176';
      ctx.beginPath();
      ctx.moveTo(-1.1 * s, -0.1 * s); ctx.lineTo((-1.4 - Math.random() * 0.3) * s, -0.14 * s); ctx.lineTo(-1.1 * s, -0.19 * s);
      ctx.fill();
    }
    ctx.restore();
  }

  function staticCar() {
    const x = level.car.x, y = level.car.y + CAR.rideH;
    const bob = mode === 'draw' ? Math.sin(time * 3) * 0.04 : 0;
    return {
      x, y: y + bob, angle: 0, boosting: false,
      wheels: [-1, 1].map(s => ({ x: x + s * CAR.wheelX, y: level.car.y + CAR.wheelR, angle: 0 })),
    };
  }

  function draw() {
    const L = layout();
    ctx.save();
    if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * L.s, (Math.random() - 0.5) * shake * L.s);
    drawBackground(L);
    if (!level || mode === 'menu') { ctx.restore(); return; }
    drawSpecials(L);
    drawGround(L);
    drawFlag(L);
    strokes.forEach(s => drawStroke(L, s));
    if (drawing) drawStroke(L, drawing);
    drawHint(L);
    smoke.forEach(p => {
      const [px, py] = toScreen(L, p.x, p.y);
      ctx.globalAlpha = Math.max(0, p.life) * 0.5;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(px, py, p.r * L.s * (1.6 - p.life), 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawCar(L, sim ? sim.car() : staticCar());
    particles.forEach(p => {
      const [px, py] = toScreen(L, p.x, p.y);
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.fillStyle = p.c;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.life * 6);
      ctx.fillRect(-p.r * L.s, -p.r * L.s * 0.6, p.r * L.s * 2, p.r * L.s * 1.2);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  const stop = startLoop(update, draw);
  showMenu();

  return () => {
    stop();
    window.removeEventListener('keydown', onKey);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
