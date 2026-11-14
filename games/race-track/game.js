// Raffy Race: draw a track, add extras, race up to 2 players on one keyboard.
//
// Multiplayer-ready design:
// - The track + extras are plain data (see trackToJSON in track.js).
// - The race is a pure simulation: stepRace(race, track, items, inputs, dt).
// - Each player has a "controls" source. Today: 'arrows' or 'wasd'.
//   Later: 'remote' (inputs arriving from a friend over Firebase).
import { createCanvas } from '../../js/engine/canvas.js';
import { startLoop } from '../../js/engine/loop.js';
import { createKeys } from '../../js/engine/keys.js';
import { sound, audioCtx } from '../../js/engine/sound.js';
import { WORLD, buildTrack, snapItem, resnapItems } from './track.js';
import { createRace, stepRace, LAPS, lapsDone, standings } from './sim.js';
import { createRenderer, drawCarIcon, drawItemIcon } from './render.js';

const COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00', '#8e24aa', '#ec407a', '#212121'];
const EXTRAS = ['jump', 'water', 'tunnel'];
const STEP = 1 / 60;
const MEDALS = ['🥇', '🥈', '🥉', '🏅'];

const CONTROLS = {
  arrows: k => ({ up: k.isDown('ArrowUp'), down: k.isDown('ArrowDown'), left: k.isDown('ArrowLeft'), right: k.isDown('ArrowRight') }),
  wasd: k => ({ up: k.isDown('KeyW'), down: k.isDown('KeyS'), left: k.isDown('KeyA'), right: k.isDown('KeyD') }),
};
const KEY_LABELS = { arrows: ['▲', '◀', '▼', '▶'], wasd: ['W', 'A', 'S', 'D'] };

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const view = createCanvas(stage);
  const ui = document.createElement('div');
  ui.className = 'rt-ui';
  stage.appendChild(ui);
  const keys = createKeys();
  const R = createRenderer(view);

  const S = {
    phase: 'build',       // build | race | results | choose
    track: null,
    items: [],
    players: [{ id: 'p1', color: COLORS[0], controls: 'arrows' }],
    race: null,
    stroke: null,
    drag: null,
    paused: false,
    doneAt: 0,
    time: 0,
  };
  let engines = [];
  let acc = 0;

  // ---------- helpers ----------
  const $ = sel => ui.querySelector(sel);
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const click = (node, fn) => node.addEventListener('click', e => { e.stopPropagation(); sound.pop(); fn(e); });

  function previewCars() {
    if (!S.track) return [];
    return createRace(S.track, S.players).cars;
  }

  // ---------- screens ----------
  function render() {
    ui.innerHTML = '';
    if (S.phase === 'build') buildUI();
    if (S.phase === 'race' || S.phase === 'results') raceUI();
    if (S.phase === 'results') resultsUI();
    if (S.phase === 'choose') chooseUI();
  }

  function buildUI() {
    const top = el(`<div class="rt-top"><button class="rt-btn rt-clear" title="Clear">🗑️</button></div>`);
    click(top.querySelector('.rt-clear'), () => { S.track = null; S.items = []; R.setScene(null, []); render(); });
    ui.appendChild(top);

    const bar = el(`<div class="rt-bar"></div>`);
    // players
    const pl = el(`<div class="rt-panel rt-players"></div>`);
    S.players.forEach((p, i) => {
      const card = el(`
        <div class="rt-player">
          <canvas width="120" height="72"></canvas>
          <div class="rt-keys">${keyHTML(p.controls)}</div>
          ${i > 0 ? '<button class="rt-x">✖</button>' : ''}
        </div>`);
      drawCarIcon(card.querySelector('canvas'), p.color);
      click(card, () => colorPicker(card, p));
      const x = card.querySelector('.rt-x');
      if (x) click(x, () => { S.players.splice(i, 1); render(); });
      pl.appendChild(card);
    });
    if (S.players.length < 2) {
      const add = el(`<button class="rt-player rt-add"><canvas width="120" height="72"></canvas><div class="rt-plus">➕</div></button>`);
      drawCarIcon(add.querySelector('canvas'), '#bdbdbd');
      click(add, () => {
        const used = S.players.map(p => p.color);
        S.players.push({ id: 'p2', color: COLORS.find(c => !used.includes(c)), controls: 'wasd' });
        render();
      });
      pl.appendChild(add);
    }
    bar.appendChild(pl);

    // extras palette
    const pal = el(`<div class="rt-panel rt-palette ${S.track ? '' : 'off'}"></div>`);
    EXTRAS.forEach(type => {
      const b = el(`<div class="rt-extra" data-type="${type}"><canvas width="120" height="90"></canvas></div>`);
      drawItemIcon(b.querySelector('canvas'), type);
      b.addEventListener('pointerdown', e => {
        if (!S.track) return;
        e.preventDefault();
        const w = R.toWorld(e.clientX, e.clientY);
        S.drag = { item: { type, x: w.x, y: w.y, a: 0 }, existing: false };
        sound.pop();
        showBin(true);
      });
      pal.appendChild(b);
    });
    bar.appendChild(pal);

    const go = el(`<button class="rt-go ${S.track ? '' : 'off'}">🏁</button>`);
    click(go, () => { if (S.track) startRace(); });
    bar.appendChild(go);
    ui.appendChild(bar);

    ui.appendChild(el(`<div class="rt-bin">🗑️</div>`));
  }

  function keyHTML(controls) {
    const [u, l, d, r] = KEY_LABELS[controls];
    return `<span></span><b>${u}</b><span></span><b>${l}</b><b>${d}</b><b>${r}</b>`;
  }

  function colorPicker(card, player) {
    const old = $('.rt-colors');
    if (old) { old.remove(); return; }
    const used = S.players.filter(p => p !== player).map(p => p.color);
    const pop = el(`<div class="rt-colors"></div>`);
    COLORS.forEach(c => {
      const sw = el(`<button class="rt-swatch ${used.includes(c) ? 'taken' : ''} ${c === player.color ? 'on' : ''}" style="background:${c}"></button>`);
      click(sw, () => {
        if (used.includes(c)) return;
        player.color = c;
        render();
      });
      pop.appendChild(sw);
    });
    const r = card.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    pop.style.left = (r.left - sr.left) + 'px';
    pop.style.bottom = (sr.bottom - r.top + 10) + 'px';
    ui.appendChild(pop);
  }

  function showBin(on) {
    const b = $('.rt-bin');
    if (b) b.classList.toggle('show', on);
  }
  function overBin(e) {
    const b = $('.rt-bin');
    if (!b) return false;
    const r = b.getBoundingClientRect();
    return e.clientX > r.left - 20 && e.clientX < r.right + 20 && e.clientY > r.top - 20 && e.clientY < r.bottom + 20;
  }

  function raceUI() {
    const top = el(`<div class="rt-top">
      <button class="rt-btn rt-again" title="Race again">🔁</button>
      <button class="rt-btn rt-draw" title="Draw">✏️</button>
    </div>`);
    click(top.querySelector('.rt-again'), startRace);
    click(top.querySelector('.rt-draw'), () => { S.paused = true; S.phase = 'choose'; render(); });
    ui.appendChild(top);

    const hud = el(`<div class="rt-hud"></div>`);
    S.race.cars.forEach(c => {
      const row = el(`<div class="rt-row" data-id="${c.id}"><canvas width="60" height="36"></canvas>
        <div class="rt-dots">${Array.from({ length: LAPS }, () => '<i></i>').join('')}</div><span class="rt-medal"></span></div>`);
      drawCarIcon(row.querySelector('canvas'), c.color);
      hud.appendChild(row);
    });
    ui.appendChild(hud);
    ui.appendChild(el(`<div class="rt-lights"><i></i><i></i><i></i></div>`));
  }

  function updateHUD() {
    if (!S.race) return;
    S.race.cars.forEach(c => {
      const row = ui.querySelector(`.rt-row[data-id="${c.id}"]`);
      if (!row) return;
      const done = lapsDone(c, S.track);
      row.querySelectorAll('i').forEach((d, i) => {
        d.className = i < done ? 'on' : (i === done && !c.finished ? 'now' : '');
      });
      row.querySelector('.rt-medal').textContent = c.finished ? MEDALS[c.place - 1] || '🏅' : '';
    });
    const lights = $('.rt-lights');
    if (lights) {
      const r = S.race;
      const show = r.phase === 'countdown' || (r.goT >= 0 && r.t - r.goT < 0.8);
      lights.classList.toggle('show', show);
      const n = r.phase === 'countdown' ? Math.ceil(r.countdown) : 0;
      lights.querySelectorAll('i').forEach((d, i) => {
        d.className = n === 0 ? 'green' : (i < 4 - n ? 'red' : '');
      });
    }
  }

  function resultsUI() {
    const list = standings(S.race);
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-trophy">🏆</div>
      <div class="rt-podium"></div>
      <div class="rt-actions">
        <button class="rt-big rt-again2">🔁</button>
        <button class="rt-big rt-draw2">✏️</button>
      </div></div></div>`);
    list.forEach((c, i) => {
      const row = el(`<div class="rt-place"><span>${c.finished ? MEDALS[i] || '🏅' : '🐢'}</span><canvas width="120" height="72"></canvas></div>`);
      drawCarIcon(row.querySelector('canvas'), c.color);
      box.querySelector('.rt-podium').appendChild(row);
    });
    click(box.querySelector('.rt-again2'), startRace);
    click(box.querySelector('.rt-draw2'), () => { S.phase = 'choose'; render(); });
    ui.appendChild(box);
  }

  function chooseUI() {
    const box = el(`<div class="rt-overlay"><div class="rt-card">
      <div class="rt-actions">
        <button class="rt-choice rt-edit"><canvas width="240" height="150"></canvas><span>✏️</span></button>
        <button class="rt-choice rt-fresh"><div class="rt-blank"></div><span>✨</span></button>
      </div>
      <button class="rt-btn rt-back">↩️</button>
    </div></div>`);
    R.thumb(box.querySelector('canvas'));
    click(box.querySelector('.rt-edit'), () => toBuild(false));
    click(box.querySelector('.rt-fresh'), () => toBuild(true));
    click(box.querySelector('.rt-back'), () => {
      S.paused = false;
      S.phase = S.race && S.race.phase === 'done' ? 'results' : 'race';
      render();
    });
    ui.appendChild(box);
  }

  // ---------- phase changes ----------
  function toBuild(fresh) {
    stopEngines();
    S.race = null;
    S.paused = false;
    if (fresh) { S.track = null; S.items = []; }
    R.setScene(S.track, S.items);
    R.resetRace();
    S.phase = 'build';
    render();
  }

  function startRace() {
    stopEngines();
    S.race = createRace(S.track, S.players);
    S.paused = false;
    S.doneAt = 0;
    acc = 0;
    R.resetRace();
    S.phase = 'race';
    engines = S.race.cars.map(() => makeEngine());
    render();
  }

  // ---------- sounds ----------
  function makeEngine() {
    const a = audioCtx();
    if (!a) return null;
    const o = a.createOscillator();
    o.type = 'sawtooth';
    const f = a.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 500;
    const g = a.createGain();
    g.gain.value = 0;
    o.connect(f).connect(g).connect(a.destination);
    o.start();
    return {
      set(speed, on) {
        o.frequency.setTargetAtTime(40 + speed * 0.32, a.currentTime, 0.05);
        g.gain.setTargetAtTime(on ? 0.035 : 0, a.currentTime, 0.1);
      },
      stop() { g.gain.setTargetAtTime(0, a.currentTime, 0.03); o.stop(a.currentTime + 0.2); },
    };
  }
  function stopEngines() { engines.forEach(e => e && e.stop()); engines = []; }

  function handleEvents(events) {
    for (const e of events) {
      const car = e.id && S.race.cars.find(c => c.id === e.id);
      if (e.type === 'beep') sound.tone(440, 0.25, 'square', 0.12);
      if (e.type === 'go') sound.tone(880, 0.5, 'square', 0.14);
      if (e.type === 'lap') { sound.tone(660, 0.12, 'triangle'); setTimeout(() => sound.tone(990, 0.18, 'triangle'), 110); }
      if (e.type === 'finish') { sound.win(); R.burst(car.x, car.y, '255,215,0', 30); }
      if (e.type === 'jump') sound.tone(300, 0.3, 'sine', 0.2, 800);
      if (e.type === 'land') { sound.bump(); R.burst(car.x, car.y, '150,110,70', 10); }
      if (e.type === 'bump') sound.bump();
      if (e.type === 'splash') sound.tone(900, 0.25, 'sine', 0.15, 200);
      if (e.type === 'done') S.doneAt = S.time;
    }
  }

  function gatherInputs() {
    const inputs = {};
    const solo = S.players.length === 1;
    for (const p of S.players) {
      const src = CONTROLS[p.controls];
      inputs[p.id] = src ? src(keys) : {};
      if (solo) { // one player can use either set of keys
        const o = CONTROLS.wasd(keys);
        for (const k in o) inputs[p.id][k] = inputs[p.id][k] || o[k];
      }
    }
    return inputs;
  }

  // ---------- drawing the track with the mouse / finger ----------
  function hitItem(w) {
    let best = null, bd = 45;
    for (const it of S.items) {
      const d = Math.hypot(it.x - w.x, it.y - w.y);
      if (d < bd) { bd = d; best = it; }
    }
    return best;
  }

  view.canvas.addEventListener('pointerdown', e => {
    if (S.phase !== 'build') return;
    const old = $('.rt-colors');
    if (old) old.remove();
    const w = R.toWorld(e.clientX, e.clientY);
    const it = hitItem(w);
    if (it) {
      S.drag = { item: { ...it }, existing: it };
      S.items = S.items.filter(x => x !== it);
      R.setScene(S.track, S.items);
      showBin(true);
    } else {
      S.stroke = [w];
    }
  });

  const onMove = e => {
    if (S.phase !== 'build') return;
    const w = R.toWorld(e.clientX, e.clientY);
    if (S.stroke) {
      const last = S.stroke[S.stroke.length - 1];
      if (Math.hypot(w.x - last.x, w.y - last.y) > 6) S.stroke.push(w);
    }
    if (S.drag) {
      S.drag.item.x = w.x;
      S.drag.item.y = w.y;
      const b = $('.rt-bin');
      if (b) b.classList.toggle('hot', overBin(e));
    }
  };

  const onUp = e => {
    if (S.phase !== 'build') return;
    if (S.stroke) {
      const t = buildTrack(S.stroke);
      S.stroke = null;
      if (t) {
        S.track = t;
        S.items = resnapItems(S.items, t);
        R.setScene(S.track, S.items);
        sound.win();
        render();
      } else {
        sound.bump();
      }
    }
    if (S.drag) {
      const { item, existing } = S.drag;
      S.drag = null;
      showBin(false);
      if (!overBin(e)) {
        const placed = snapItem(S.track, item.type, item.x, item.y);
        const inside = item.x > 0 && item.y > 0 && item.x < WORLD.w && item.y < WORLD.h;
        if (placed && inside) { S.items.push(placed); sound.pop(); }
        else if (existing) S.items.push(existing); // put it back
      } else {
        sound.bump();
      }
      R.setScene(S.track, S.items);
    }
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  // ---------- main loop ----------
  const stopLoop = startLoop(dt => {
    S.time += dt;
    if (S.race && !S.paused) {
      acc += dt;
      while (acc >= STEP) {
        stepRace(S.race, S.track, S.items, gatherInputs(), STEP);
        handleEvents(S.race.events);
        acc -= STEP;
      }
      S.race.cars.forEach((c, i) => engines[i] && engines[i].set(c.speed, S.phase === 'race'));
      if (S.phase === 'race' && S.doneAt && S.time - S.doneAt > 1.2) {
        S.phase = 'results';
        render();
      }
      updateHUD();
    }
    if (S.paused) engines.forEach(e => e && e.set(0, false));
    S._dt = dt;
  }, () => {
    const building = S.phase === 'build';
    R.frame({
      insets: building ? { top: 8, bottom: 130 } : { top: 70, bottom: 8 },
      cars: S.race ? S.race.cars : previewCars(),
      live: !!S.race && !S.paused,
      dt: S.paused ? 0 : (S._dt || 0),
      stroke: S.stroke,
      drag: S.drag && S.drag.item,
      hint: building && !S.track && !S.stroke,
      time: S.time,
    });
  });

  R.setScene(null, []);
  render();

  return () => {
    stopLoop();
    stopEngines();
    keys.destroy();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    view.destroy();
    ui.remove();
    css.remove();
  };
}
