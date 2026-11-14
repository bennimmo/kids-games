// Draw a Road – draw lines with your finger so the car can get to the flag.
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
        <h2>✏️ Draw a Road</h2>
        <p>Draw a line so the car gets to the flag 🏁</p>
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
    if (mode !== 'drive' || !sim) return;

    if (sim.state.status === 'driving') {
      acc += dt;
      while (acc >= STEP && sim.state.status === 'driving') { sim.step(); acc -= STEP; }
    }
    const c = sim.car();
    for (const ev of sim.state.events.splice(0)) {
      if (ev === 'bounce') { sound.tone(200, 0.35, 'sine', 0.25, 900); burst(c.x, c.y - 0.5, 10, ['#fff', '#ffeb3b']); }
      if (ev === 'boost') { sound.tone(300, 0.4, 'sawtooth', 0.08, 1400); }
      if (ev === 'portal') { sound.tone(1200, 0.3, 'sine', 0.15, 300); burst(c.x, c.y, 16, ['#ce93d8', '#ff9800', '#fff']); }
      if (ev === 'win') { sound.win(); burst(level.flag.x, level.flag.y + 2, 60, CRAYONS, 9); }
      if (ev === 'lose') { sound.bump(); }
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

  function drawBackground(L) {
    const g = ctx.createLinearGradient(0, 0, 0, view.height);
    g.addColorStop(0, '#81d4fa');
    g.addColorStop(1, '#e1f5fe');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, view.width, view.height);
    // clouds drift slowly
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    [[4, 16, 1], [15, 15.5, 1.3], [26, 16.5, 0.9]].forEach(([cx, cy, k], i) => {
      const x = ((cx + time * 0.15 * (i + 1)) % (WORLD_W + 6)) - 3;
      const [px, py] = toScreen(L, x, cy);
      const r = L.s * k;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, 7); ctx.arc(px + r, py - r * 0.4, r * 1.1, 0, 7); ctx.arc(px + r * 2, py, r * 0.9, 0, 7);
      ctx.fill();
    });
  }

  function drawGround(L) {
    for (const g of level.ground) {
      const pts = g.pts.map(p => [p[0] <= 0 ? -60 : p[0] >= WORLD_W ? WORLD_W + 60 : p[0], p[1]]);
      const sp = pts.map(p => toScreen(L, p[0], p[1]));
      if (!g.float) {
        ctx.beginPath();
        ctx.moveTo(sp[0][0], view.height + 10);
        sp.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.lineTo(sp[sp.length - 1][0], view.height + 10);
        ctx.closePath();
        ctx.fillStyle = '#a1887f';
        ctx.fill();
        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = L.s * 0.12;
        ctx.stroke();
      }
      ctx.beginPath();
      sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = '#66bb6a';
      ctx.lineWidth = L.s * 0.45;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
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
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = L.s * 0.3;
    ctx.stroke();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = L.s * 0.2;
    ctx.stroke();
  }

  function drawCar(L, c) {
    const s = L.s;
    // wheels
    c.wheels.forEach(w => {
      const [px, py] = toScreen(L, w.x, w.y);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-w.angle);
      ctx.beginPath(); ctx.arc(0, 0, CAR.wheelR * s, 0, 7); ctx.fillStyle = '#263238'; ctx.fill();
      ctx.beginPath(); ctx.arc(0, 0, CAR.wheelR * s * 0.5, 0, 7); ctx.fillStyle = '#cfd8dc'; ctx.fill();
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = s * 0.05;
      for (let i = 0; i < 3; i++) {
        ctx.rotate(Math.PI / 1.5);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(CAR.wheelR * s * 0.5, 0); ctx.stroke();
      }
      ctx.restore();
    });
    const [px, py] = toScreen(L, c.x, c.y);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-c.angle);
    // cab
    ctx.beginPath();
    ctx.moveTo(-0.55 * s, -0.2 * s); ctx.lineTo(0.35 * s, -0.2 * s); ctx.lineTo(0.15 * s, -0.62 * s); ctx.lineTo(-0.45 * s, -0.62 * s);
    ctx.closePath();
    ctx.fillStyle = '#1e88e5'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-0.38 * s, -0.25 * s); ctx.lineTo(0.22 * s, -0.25 * s); ctx.lineTo(0.08 * s, -0.54 * s); ctx.lineTo(-0.32 * s, -0.54 * s);
    ctx.closePath();
    ctx.fillStyle = '#e3f2fd'; ctx.fill();
    // driver's happy face
    ctx.beginPath(); ctx.arc(-0.1 * s, -0.4 * s, 0.12 * s, 0, 7); ctx.fillStyle = '#ffcc80'; ctx.fill();
    ctx.fillStyle = '#3e2723';
    ctx.beginPath(); ctx.arc(-0.06 * s, -0.43 * s, 0.025 * s, 0, 7); ctx.fill();
    // body
    roundRect(-CAR.bodyW / 2 * s, -CAR.bodyH / 2 * s, CAR.bodyW * s, CAR.bodyH * s, 0.18 * s);
    ctx.fillStyle = '#29b6f6'; ctx.fill();
    ctx.strokeStyle = '#0d47a1'; ctx.lineWidth = s * 0.06; ctx.stroke();
    ctx.fillStyle = '#fff59d';
    ctx.beginPath(); ctx.arc(0.82 * s, -0.05 * s, 0.08 * s, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${s * 0.3}px Fredoka, system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('★', 0.1 * s, 0.02 * s);
    if (c.boosting) {
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(-0.9 * s, -0.12 * s); ctx.lineTo((-1.3 - Math.random() * 0.4) * s, 0); ctx.lineTo(-0.9 * s, 0.12 * s);
      ctx.fill();
    }
    ctx.restore();
  }

  function staticCar() {
    const x = level.car.x, y = level.car.y + 0.75;
    const bob = mode === 'draw' ? Math.sin(time * 3) * 0.03 : 0;
    return {
      x, y: y + bob, angle: 0, boosting: false,
      wheels: [-1, 1].map(s => ({ x: x + s * CAR.wheelX, y: level.car.y + CAR.wheelR, angle: 0 })),
    };
  }

  function draw() {
    const L = layout();
    drawBackground(L);
    if (!level || mode === 'menu') return;
    drawSpecials(L);
    drawGround(L);
    drawFlag(L);
    strokes.forEach(s => drawStroke(L, s));
    if (drawing) drawStroke(L, drawing);
    drawHint(L);
    drawCar(L, sim ? sim.car() : staticCar());
    particles.forEach(p => {
      const [px, py] = toScreen(L, p.x, p.y);
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.fillStyle = p.c;
      ctx.fillRect(px, py, p.r * L.s * 2, p.r * L.s * 2);
    });
    ctx.globalAlpha = 1;
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
