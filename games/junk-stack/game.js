// Junk Stack – crane junk onto the rock, stack it as high as you can,
// then put the flag on top to measure how tall your tower is.
// Real physics (planck.js): everything pushes on everything, and the item on
// the crane can knock the tower while you move it.
import * as planck from '../../js/vendor/planck.mjs';
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { sound } from '../../js/engine/sound.js';
import { icon } from '../../js/engine/icons.js';
import { ITEMS, makeBody, drawIcon, stageInfo, STAGE_COUNT } from './items.js';

const { Vec2 } = planck;
const STEP = 1 / 60;
const SAVE_KEY = 'junk-stack:v1';
const SEA = -2.2;         // sea level (platform top is y = 0)
const BASE_CAM = -3.6;    // lowest the camera goes
const ROT = Math.PI / 4;  // one turn of the rotate button

function load() {
  try { return { best: {}, stars: {}, ...JSON.parse(localStorage.getItem(SAVE_KEY)) }; } catch (e) { return { best: {}, stars: {} }; }
}
function save(d) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch (e) { /* ok */ } }

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const view = createCanvas(stage);
  const { canvas, ctx } = view;
  const ui = document.createElement('div');
  ui.className = 'js-ui';
  stage.appendChild(ui);

  let data = load();
  let mode = 'menu';        // menu | build | measure | result | paused
  let pausedFrom = null;
  let stageNo = 1;
  let info = stageInfo(1);
  let world = null, ground = null;
  let bodies = [];          // placed items: { body, type, wet }
  let tray = [];            // { type, used }
  let flagUsed = false, flagBody = null;
  let held = null;          // { body, joint, i, type, pointerId, touch }
  let rot = 0;              // rotation for the next pick (in steps of 45°)
  let acc = 0, time = 0;
  let camY = BASE_CAM, zoom = 1;
  let craneX = 0;
  let measureT = 0, stillT = 0;
  let particles = [];
  let resultH = 0;
  let toldFlag = false;

  // ---------- layout ----------
  function L() {
    const trayEl = ui.querySelector('.js-tray');
    const trayH = trayEl ? trayEl.offsetHeight : 0;
    const w = view.width, h = view.height, playH = h - trayH;
    const s = Math.min(w / 11, playH / 12) * zoom;
    return { w, h, playH, s, viewH: playH / s, viewW: w / s };
  }
  const sx = (l, x) => l.w / 2 + x * l.s;
  const sy = (l, y) => l.playH - (y - camY) * l.s;
  function pointerWorld(e) {
    const r = canvas.getBoundingClientRect();
    const l = L();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    return { x: (px - l.w / 2) / l.s, y: camY + (l.playH - py) / l.s, inTray: py > l.playH, l };
  }

  function bodyTop(b) {
    let top = -Infinity;
    for (let f = b.getFixtureList(); f; f = f.getNext()) top = Math.max(top, f.getAABB(0).upperBound.y);
    return top;
  }
  function bodyBottom(b) {
    let bot = Infinity;
    for (let f = b.getFixtureList(); f; f = f.getNext()) bot = Math.min(bot, f.getAABB(0).lowerBound.y);
    return bot;
  }
  // top of the tower: highest item that is resting on something (not mid-air or in the sea)
  function towerTop() {
    let top = 0;
    bodies.forEach(it => {
      if (it.wet) return;
      const v = it.body.getLinearVelocity();
      if (Math.hypot(v.x, v.y) < 1.5) top = Math.max(top, bodyTop(it.body));
    });
    return top;
  }

  // ---------- screens ----------
  const starsHTML = n => [1, 2, 3].map(k => `<b class="${k <= n ? 'on' : ''}">${icon('star')}</b>`).join('');
  const unlocked = n => n === 1 || (data.stars[n - 1] || 0) > 0 || (data.stars[n] || 0) > 0;

  function showMenu() {
    mode = 'menu';
    clearWorld();
    info = stageInfo(1);
    ui.innerHTML = `
      <div class="ui-overlay js-menu"><div class="ui-panel wide">
        <div class="ui-kicker">Junk Stack</div>
        <h2 class="ui-title">Build a junk tower!</h2>
        <p class="ui-sub">Drag junk onto the rock. Stack it high. Put the flag on top to measure it.</p>
        <div class="ui-label">Stages</div>
        <div class="js-stages ui-choices tight">
          ${Array.from({ length: STAGE_COUNT }, (_, i) => {
            const n = i + 1, open = unlocked(n);
            return `<button class="ui-choice js-st ${open ? '' : 'locked'}" data-n="${n}" ${open ? '' : 'disabled'}>
              <span class="num">${open ? n : '🔒'}</span>
              <span class="hi">${data.best[n] ? data.best[n].toFixed(1) + ' m' : '&nbsp;'}</span>
              <span class="st">${starsHTML(data.stars[n] || 0)}</span>
            </button>`;
          }).join('')}
        </div>
      </div></div>`;
    ui.querySelectorAll('.js-st').forEach(b => b.addEventListener('click', () => { sound.pop(); startStage(+b.dataset.n); }));
  }

  function clearWorld() {
    held = null;
    world = null; ground = null; bodies = []; flagBody = null;
    particles = [];
  }

  function startStage(n) {
    stageNo = n;
    info = stageInfo(n);
    clearWorld();
    world = new planck.World({ gravity: Vec2(0, -10) });
    ground = world.createBody();
    ground.createFixture(planck.Box(info.platformW / 2, 0.3, Vec2(0, -0.3), 0), { friction: 0.9 });
    tray = info.items.map(type => ({ type, used: false }));
    flagUsed = false;
    toldFlag = false;
    rot = 0;
    acc = 0;
    camY = BASE_CAM; zoom = 1;
    mode = 'build';
    buildUI();
    toast(n === 1 ? 'Drag something onto the rock!' : info.wind ? 'Windy up high! 🌬️' : `Stage ${n}`);
  }

  function buildUI() {
    ui.innerHTML = `
      <div class="js-hud">
        <div class="ui-chip js-stage">Stage ${stageNo}</div>
        <div class="ui-chip js-height">0.0 m</div>
        <button class="ui-hud-btn js-pause" aria-label="Pause">${icon('pause')}</button>
      </div>
      <div class="js-toast"></div>
      <div class="js-tray">
        <button class="ui-hud-btn js-rot" aria-label="Turn">${icon('redo')}</button>
        <div class="js-items"></div>
        <button class="js-flag" aria-label="Flag"><canvas></canvas><span>Flag</span></button>
      </div>`;
    ui.querySelector('.js-pause').onclick = () => { sound.pop(); pause(); };
    ui.querySelector('.js-rot').onclick = () => { turn(1); };
    const flagBtn = ui.querySelector('.js-flag');
    flagBtn.addEventListener('pointerdown', e => pick(-1, e));
    renderTray();
  }

  function renderTray() {
    const box = ui.querySelector('.js-items');
    if (!box) return;
    box.innerHTML = tray.map((t, i) => `<button class="js-item ${t.used ? 'used' : ''}" data-i="${i}" aria-label="${ITEMS[t.type].name}"><canvas></canvas></button>`).join('');
    box.querySelectorAll('.js-item').forEach(b => {
      const t = tray[+b.dataset.i];
      drawIcon(b.querySelector('canvas'), t.type, rot * ROT);
      b.addEventListener('pointerdown', e => pick(+b.dataset.i, e));
    });
    const fb = ui.querySelector('.js-flag');
    if (fb) {
      drawIcon(fb.querySelector('canvas'), 'flag', 0);
      fb.classList.toggle('used', flagUsed);
      fb.classList.toggle('ready', !flagUsed && tray.every(t => t.used));
    }
    ui.querySelector('.js-tray')?.classList.toggle('done', flagUsed);
  }

  function toast(text) {
    const t = ui.querySelector('.js-toast');
    if (!t) return;
    t.textContent = text;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
  }

  function pause() {
    if (mode !== 'build' && mode !== 'measure') return;
    if (held) drop(true);
    pausedFrom = mode;
    mode = 'paused';
    const p = document.createElement('div');
    p.className = 'ui-overlay js-pop';
    p.innerHTML = `<div class="ui-panel">
      <h3 class="ui-title">Paused</h3>
      <div class="ui-row">
        <button class="ui-btn primary big resume">${icon('play')} Resume</button>
      </div>
      <div class="ui-row">
        <button class="ui-btn restart">${icon('retry')} Restart</button>
        <button class="ui-btn ghost quit">${icon('menu')} Stages</button>
      </div></div>`;
    ui.appendChild(p);
    p.querySelector('.resume').onclick = () => { sound.pop(); p.remove(); mode = pausedFrom; };
    p.querySelector('.restart').onclick = () => { sound.pop(); startStage(stageNo); };
    p.querySelector('.quit').onclick = () => { sound.pop(); showMenu(); };
  }

  function showResult(ok) {
    mode = 'result';
    let got = 0;
    let best = false;
    if (ok) {
      got = resultH >= info.star3 ? 3 : resultH >= info.star2 ? 2 : 1;
      if (!(data.stars[stageNo] >= got)) data.stars[stageNo] = got;
      if (!(data.best[stageNo] >= resultH)) { data.best[stageNo] = resultH; best = true; }
      save(data);
      sound.win();
      if (got === 3) setTimeout(() => sound.cheer(), 400);
    }
    const last = stageNo >= STAGE_COUNT;
    const p = document.createElement('div');
    p.className = 'ui-overlay js-pop js-result';
    p.innerHTML = `<div class="ui-panel">
      <div class="ui-kicker">Stage ${stageNo}</div>
      ${ok ? `
        <h3 class="ui-title">${resultH.toFixed(2)} m tall!</h3>
        <div class="js-big-stars">${[1, 2, 3].map(k => `<b class="${k <= got ? 'on' : ''}" style="animation-delay:${k * 0.25}s">${icon('star')}</b>`).join('')}</div>
        <p class="ui-sub">${best ? 'New best! ' : `Best: ${data.best[stageNo].toFixed(2)} m. `}${got < 3 ? `${(got < 2 ? info.star2 : info.star3).toFixed(1)} m for the next star.` : 'All the stars!'}</p>`
      : `
        <h3 class="ui-title">Splash! 🌊</h3>
        <p class="ui-sub">The flag fell in the sea. Try again!</p>`}
      <div class="ui-row js-foot">
        <button class="ui-btn ghost quit">${icon('menu')} Stages</button>
        <span class="ui-row">
          <button class="ui-btn again">${icon('retry')} Again</button>
          ${ok && !last ? `<button class="ui-btn primary next">${icon('next')} Next</button>` : ''}
        </span>
      </div></div>`;
    ui.appendChild(p);
    p.querySelector('.again').onclick = () => { sound.pop(); startStage(stageNo); };
    p.querySelector('.quit').onclick = () => { sound.pop(); showMenu(); };
    const nx = p.querySelector('.next');
    if (nx) nx.onclick = () => { sound.pop(); startStage(stageNo + 1); };
    ui.querySelector('.js-tray')?.remove();
  }

  // ---------- crane: pick up, move, turn, drop ----------
  function pick(i, e) {
    if (mode !== 'build' || held) return;
    const type = i < 0 ? 'flag' : tray[i]?.type;
    if (!type || (i < 0 ? flagUsed : tray[i].used)) return;
    e.preventDefault();
    const def = ITEMS[type];
    const p = pointerWorld(e);
    const top = towerTop();
    const touch = e.pointerType === 'touch';
    const angle = i < 0 ? 0 : rot * ROT;
    const x = clampX(p.x, p.l, def.r);
    const y = Math.max(top + def.r + 0.8, Math.min(p.y, camY + p.l.viewH - def.r - 1));
    const body = makeBody(world, type, x, y, angle);
    body.setFixedRotation(true);
    const joint = world.createJoint(new planck.MouseJoint(
      { maxForce: 70 * body.getMass(), frequencyHz: 3.5, dampingRatio: 0.85 }, ground, body, Vec2(x, y)));
    held = { body, joint, i, type, pointerId: e.pointerId, touch, def };
    if (i < 0) flagUsed = true; else tray[i].used = true;
    renderTray();
    sound.pop();
  }
  function clampX(x, l, r) {
    const lim = Math.max(1, l.viewW / 2 - r * 0.6);
    return Math.max(-lim, Math.min(lim, x));
  }

  function onMove(e) {
    if (!held || e.pointerId !== held.pointerId) return;
    const p = pointerWorld(e);
    const r = held.def.r;
    let x = clampX(p.x, p.l, r);
    let y = p.y + (held.touch ? r + 0.4 : 0); // keep it above your finger
    if (p.inTray) y = Math.max(y, towerTop() + r + 0.8);
    y = Math.max(SEA + 0.3, Math.min(y, camY + p.l.viewH - r * 0.5));
    held.joint.setTarget(Vec2(x, y));
    held.overTray = p.inTray;
  }
  function onUp(e) {
    if (!held || e.pointerId !== held.pointerId) return;
    const p = pointerWorld(e);
    drop(p.inTray);
  }
  // let go of the item. back=true puts it back in the tray instead.
  function drop(back) {
    const h = held;
    held = null;
    world.destroyJoint(h.joint);
    if (back) {
      world.destroyBody(h.body);
      if (h.i < 0) flagUsed = false; else tray[h.i].used = false;
      renderTray();
      return;
    }
    h.body.setFixedRotation(false);
    h.body.setAwake(true);
    const v = h.body.getLinearVelocity();
    const sp = Math.hypot(v.x, v.y);
    if (sp > 6) h.body.setLinearVelocity(Vec2(v.x * 6 / sp, v.y * 6 / sp));
    bodies.push({ body: h.body, type: h.type, wet: false });
    sound.tok();
    if (h.type === 'flag') {
      flagBody = h.body;
      mode = 'measure';
      measureT = 0; stillT = 0;
      toast('Wait for it…');
    } else if (!toldFlag && tray.every(t => t.used)) {
      toldFlag = true;
      toast('Now put the flag on top! 🚩');
    }
    renderTray();
  }

  function turn(dir) {
    if (mode !== 'build') return;
    sound.tok();
    if (held) {
      const b = held.body;
      b.setTransform(b.getPosition(), b.getAngle() - dir * ROT);
      b.setAwake(true);
    } else {
      rot = (rot + dir + 8) % 8;
      renderTray();
    }
  }

  // second finger (or right click) while holding = turn it
  function onCanvasDown(e) {
    if (held && e.target === canvas && e.pointerId !== held.pointerId) { e.preventDefault(); turn(1); }
  }
  function onWheel(e) {
    if (!held) return;
    e.preventDefault();
    turn(e.deltaY > 0 ? 1 : -1);
  }
  function onKey(e) {
    if (e.key === 'r' || e.key === 'R' || e.key === 'ArrowUp') turn(1);
    else if (e.key === 'ArrowDown') turn(-1);
    else if (e.key === 'Escape') pause();
  }
  function onContext(e) { if (held) { e.preventDefault(); } }

  // ---------- simulation ----------
  function windAt(t) {
    if (!info.wind) return 0;
    return info.wind * Math.sin(t * 0.37 + 0.6) * (0.75 + 0.25 * Math.sin(t * 1.9));
  }

  function update(dt) {
    time += dt;
    const live = world && (mode === 'build' || mode === 'measure' || mode === 'result');
    if (live) {
      acc = Math.min(acc + dt, 0.1);
      while (acc >= STEP) {
        const g = windAt(time);
        if (g) bodies.forEach(it => {
          const pos = it.body.getPosition();
          if (pos.y > 1 && !it.wet) it.body.applyForceToCenter(Vec2(it.body.getMass() * g * Math.min(1, pos.y / 12), 0), true);
        });
        if (held) {
          const v = held.body.getLinearVelocity();
          const sp = Math.hypot(v.x, v.y);
          if (sp > 10) held.body.setLinearVelocity(Vec2(v.x * 10 / sp, v.y * 10 / sp));
        }
        world.step(STEP, 10, 8);
        acc -= STEP;
      }
      // things that fall in the sea
      for (let k = bodies.length - 1; k >= 0; k--) {
        const it = bodies[k];
        const pos = it.body.getPosition();
        if (!it.wet && pos.y < SEA) {
          it.wet = true;
          splash(pos.x);
          if (it.body === flagBody && mode === 'measure') {
            setTimeout(() => { if (mode === 'measure') showResult(false); }, 700);
          }
        }
        if (pos.y < SEA - 4) {
          world.destroyBody(it.body);
          bodies.splice(k, 1);
        }
      }
      if (mode === 'measure' && flagBody) {
        measureT += dt;
        const still = bodies.every(it => {
          if (it.wet) return true;
          const v = it.body.getLinearVelocity();
          return Math.hypot(v.x, v.y) < 0.12 && Math.abs(it.body.getAngularVelocity()) < 0.15;
        });
        stillT = still ? stillT + dt : 0;
        if ((stillT > 1.3 || measureT > 9) && flagBody.getPosition().y > SEA) {
          resultH = Math.max(0, Math.round(bodyBottom(flagBody) * 100) / 100);
          showResult(true);
        }
      }
      const hEl = ui.querySelector('.js-height');
      if (hEl) hEl.textContent = `${towerTop().toFixed(1)} m`;
    }
    // particles
    particles.forEach(p => { p.vy -= 12 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    particles = particles.filter(p => p.life > 0);

    // camera
    const l = L();
    const viewH1 = l.viewH * zoom;
    let targetZoom = 1, targetCam = BASE_CAM;
    if (mode === 'result' || mode === 'menu') {
      // fit the whole tower above the result card
      const panel = mode === 'result' ? ui.querySelector('.js-result .ui-panel') : null;
      const panelPx = panel ? panel.offsetHeight + 40 : 0;
      const s1 = l.s / zoom;
      const availPx = Math.max(120, l.playH - panelPx - 110);
      const need = towerTop() + 2 - BASE_CAM;
      targetZoom = Math.min(1, availPx / (need * s1));
      targetCam = BASE_CAM - panelPx / (s1 * targetZoom);
    } else {
      let top = towerTop();
      if (held) top = Math.max(top, held.body.getPosition().y + held.def.r);
      targetCam = Math.max(BASE_CAM, top + 5 - viewH1);
    }
    zoom += (targetZoom - zoom) * Math.min(1, dt * 3);
    camY += (targetCam - camY) * Math.min(1, dt * 2.5);
    const hx = held ? held.body.getPosition().x : craneX;
    craneX += (hx - craneX) * Math.min(1, dt * 8);
  }

  function splash(x) {
    sound.splash();
    for (let i = 0; i < 18; i++) {
      particles.push({ x: x + (Math.random() - 0.5) * 0.8, y: SEA, vx: (Math.random() - 0.5) * 4, vy: 3 + Math.random() * 5, life: 0.6 + Math.random() * 0.5, r: 0.06 + Math.random() * 0.08 });
    }
  }

  // ---------- drawing ----------
  const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const mix = (a, b, t) => {
    const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
  };

  function draw() {
    const l = L();
    const { w, h, playH, s } = l;
    ctx.clearRect(0, 0, w, h);

    // sky gets deeper blue the higher you go
    const alt = Math.max(0, Math.min(1, (camY - BASE_CAM) / 40));
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, mix('#4aa3ec', '#14205a', alt));
    sky.addColorStop(1, mix('#c4ecff', '#5b8fe0', alt));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // stars when very high
    if (alt > 0.4) {
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = (alt - 0.4) * 1.5;
      for (let i = 0; i < 60; i++) ctx.fillRect(rnd(i) * w, rnd(i + 99) * playH, 2, 2);
      ctx.globalAlpha = 1;
    }

    // clouds (slower than the tower, so it feels far away)
    for (let k = 0; k < 40; k++) {
      const cy = 3 + k * 3.2;
      const cx = ((rnd(k) * 24 + time * (0.15 + rnd(k + 7) * 0.2)) % 28) - 14;
      const px = sx(l, cx), py = l.playH - (cy - camY * 0.7) * s;
      if (py < -60 || py > playH + 60) continue;
      const cs = (0.8 + rnd(k + 3)) * s;
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath();
      ctx.ellipse(px, py, cs * 1.6, cs * 0.45, 0, 0, Math.PI * 2);
      ctx.ellipse(px + cs * 0.5, py - cs * 0.3, cs * 0.8, cs * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // wind streaks
    const g = windAt(time);
    if (g && mode !== 'menu') {
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) {
        const yy = (rnd(i + 40) * playH * 0.8);
        const len = Math.abs(g) * 25 + 10;
        let xx = ((rnd(i + 50) * w + time * g * 120) % (w + 200));
        if (xx < -100) xx += w + 200;
        ctx.globalAlpha = Math.min(1, Math.abs(g) / 1.2) * 0.6;
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - Math.sign(g) * len, yy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // far islands
    const seaY = sy(l, SEA);
    ctx.fillStyle = '#7fb3a8';
    ctx.beginPath();
    ctx.moveTo(0, seaY);
    ctx.quadraticCurveTo(w * 0.12, seaY - 2.2 * s, w * 0.25, seaY);
    ctx.quadraticCurveTo(w * 0.82, seaY - 3 * s, w, seaY - 0.6 * s);
    ctx.lineTo(w, seaY); ctx.closePath(); ctx.fill();

    // sea (back)
    ctx.fillStyle = '#2f8fd8';
    ctx.fillRect(0, seaY, w, h - seaY);

    // rock + platform
    const pw = info.platformW;
    ctx.fillStyle = '#7b6a5d';
    ctx.beginPath();
    ctx.moveTo(sx(l, -pw * 0.38), sy(l, -0.5));
    ctx.lineTo(sx(l, pw * 0.38), sy(l, -0.5));
    ctx.lineTo(sx(l, pw * 0.62), sy(l, SEA - 3));
    ctx.lineTo(sx(l, -pw * 0.62), sy(l, SEA - 3));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    ctx.beginPath();
    ctx.moveTo(sx(l, pw * 0.1), sy(l, -0.5)); ctx.lineTo(sx(l, pw * 0.38), sy(l, -0.5));
    ctx.lineTo(sx(l, pw * 0.62), sy(l, SEA - 3)); ctx.lineTo(sx(l, pw * 0.25), sy(l, SEA - 3));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#455a64';
    ctx.fillRect(sx(l, -pw / 2), sy(l, 0), pw * s, 0.6 * s);
    // hazard stripes on top
    ctx.save();
    ctx.beginPath(); ctx.rect(sx(l, -pw / 2), sy(l, 0), pw * s, 0.18 * s); ctx.clip();
    ctx.fillStyle = '#ffca28'; ctx.fillRect(sx(l, -pw / 2), sy(l, 0), pw * s, 0.18 * s);
    ctx.fillStyle = '#263238';
    for (let x = -pw / 2 - 1; x < pw / 2 + 1; x += 0.5) {
      ctx.beginPath();
      ctx.moveTo(sx(l, x), sy(l, 0) + 0.18 * s); ctx.lineTo(sx(l, x + 0.25), sy(l, 0) + 0.18 * s);
      ctx.lineTo(sx(l, x + 0.43), sy(l, 0)); ctx.lineTo(sx(l, x + 0.18), sy(l, 0));
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // height ruler on the right
    if (mode !== 'menu') {
      const rx = w - 8;
      ctx.font = '700 12px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      const step = s < 22 ? 5 : s < 40 ? 2 : 1;
      for (let m = 0; m < 400; m += step) {
        const y = sy(l, m);
        if (y < 0) break;
        if (y > playH) continue;
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.fillRect(rx - (m % (step * 5) === 0 ? 14 : 8), y - 1, m % (step * 5) === 0 ? 14 : 8, 2);
        if (m % (step * 5) === 0 || step >= 2) ctx.fillText(`${m}m`, rx - 18, y);
      }
    }

    // items
    const drawBody = (b, type) => {
      const p = b.getPosition();
      ctx.save();
      ctx.translate(sx(l, p.x), sy(l, p.y));
      ctx.rotate(-b.getAngle());
      ctx.scale(s, -s);
      ITEMS[type].draw(ctx);
      ctx.restore();
    };
    bodies.forEach(it => drawBody(it.body, it.type));

    // dashed line at the top of the tower
    if (mode === 'build' || mode === 'measure') {
      const top = towerTop();
      if (top > 0.2) {
        const y = sy(l, top);
        ctx.strokeStyle = 'rgba(255,255,255,.8)';
        ctx.setLineDash([8, 8]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx(l, -pw), y); ctx.lineTo(w - 60, y); ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // the crane
    if (mode !== 'menu' && mode !== 'result') drawCrane(l);
    if (held) drawBody(held.body, held.type);

    // sea (front, so things sink in)
    const wave = t => Math.sin(t) * 0.08 * s;
    ctx.fillStyle = 'rgba(47,143,216,.82)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 10; x += 10) ctx.lineTo(x, seaY + 0.12 * s + wave(x * 0.03 + time * 2));
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w + 10; x += 10) {
      const y = seaY + 0.12 * s + wave(x * 0.03 + time * 2);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();

    // splash drops
    ctx.fillStyle = '#e3f4ff';
    particles.forEach(p => {
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.beginPath(); ctx.arc(sx(l, p.x), sy(l, p.y), p.r * s, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // flag height while measuring
    if (mode === 'measure' && flagBody && !bodies.find(it => it.body === flagBody)?.wet) {
      const fp = flagBody.getPosition();
      const label = `${Math.max(0, bodyBottom(flagBody)).toFixed(1)} m`;
      ctx.font = '800 18px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.45)';
      const tx = sx(l, fp.x), ty = sy(l, fp.y + 1.1);
      ctx.strokeText(label, tx, ty);
      ctx.fillStyle = '#fff'; ctx.fillText(label, tx, ty);
    }
  }

  function drawCrane(l) {
    const { w, s } = l;
    const beamY = 100;
    // beam across the top
    ctx.fillStyle = '#f9a825';
    ctx.fillRect(0, beamY - 12, w, 12);
    ctx.strokeStyle = '#c17900';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x += 24) { ctx.moveTo(x, beamY - 12); ctx.lineTo(x + 12, beamY); ctx.lineTo(x + 24, beamY - 12); }
    ctx.stroke();
    // trolley
    const tx = sx(l, craneX);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(tx - 16, beamY - 2, 32, 12);
    // cable + hook
    let hy, hx = tx;
    if (held) {
      const p = held.body.getPosition();
      hx = sx(l, p.x);
      hy = sy(l, p.y) - Math.min(held.def.h / 2 + 0.15, held.def.r) * s;
    } else {
      hx = tx + Math.sin(time * 1.6) * 4;
      hy = beamY + 50;
    }
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(tx, beamY + 10); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hx, hy + 6, 6, -Math.PI / 2, Math.PI * 0.9); ctx.stroke();
    void s;
  }

  // ---------- go ----------
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  window.addEventListener('keydown', onKey);
  stage.addEventListener('pointerdown', onCanvasDown);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('contextmenu', onContext);

  const stop = startLoop(update, draw);
  showMenu();

  return () => {
    stop();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('keydown', onKey);
    stage.removeEventListener('pointerdown', onCanvasDown);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
