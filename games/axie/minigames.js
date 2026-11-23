// Axie Pals – little games to play WITH your axolotl (it plays too, and gets better as it grows).
//   ttt     ❌⭕ Noughts & crosses – you vs your axolotl
//   shells  🐚 Where's Noodle? – it hides under a shell, shells shuffle, find it
//   memory  🃏 Memory – take turns finding pairs
//   copy    🎵 Copy me – it sings a tune on coloured bubbles, you copy it
// Each game runs in a panel (DOM), with the axolotl drawn live at the top.
// play(id, env) – env: { ui, pet, col(), overlay(html), sfx, sound, done(result) }
// result: 'win' | 'draw' | 'lose'  (the caller gives coins / fun)
import { drawAxolotl, drawSay, drawBubble } from './draw.js';

const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, '');

export const MINI = [
  { id: 'bubbles', icon: '🫧', name: 'Bubble pop' },
  { id: 'ttt', icon: '❌', name: 'Noughts & crosses' },
  { id: 'shells', icon: '🐚', name: 'Find me!' },
  { id: 'memory', icon: '🃏', name: 'Memory' },
  { id: 'copy', icon: '🎵', name: 'Copy me' },
];

// How clever the axolotl is (0..1): a baby makes lots of silly moves.
const skill = age => Math.min(0.92, 0.3 + age * 0.07);

export const MINI_CSS = `
.ui-btn[hidden] { display:none; }
.mg-pet { width:100%; max-width:420px; height:150px; border-radius:22px; display:block; }
.mg-score { display:flex; gap:10px; justify-content:center; font-weight:900; font-size:20px; }
.mg-score span { padding:6px 14px; border-radius:14px; background:var(--ui-card); }
.mg-score span.on { background:var(--accent); color:var(--ui-ink); }
.mg-ttt { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; width:min(300px, 80vw); }
.mg-ttt button { all:unset; cursor:pointer; aspect-ratio:1; border-radius:18px; background:rgba(255,255,255,.1); display:grid; place-items:center; font-size:clamp(36px, 10vw, 56px); transition:transform .1s, background .2s; }
.mg-ttt button:active { transform:scale(.92); }
.mg-ttt button.win { background:#22c55e; }
.mg-shells { position:relative; width:min(420px, 90vw); height:150px; }
.mg-shell { all:unset; cursor:pointer; position:absolute; top:40px; width:30%; height:100px; display:grid; place-items:center; transition:left .35s ease-in-out, transform .35s; }
.mg-shell .cup { font-size:clamp(56px, 15vw, 84px); transition:transform .35s; z-index:2; filter:drop-shadow(0 6px 6px rgba(0,0,0,.35)); }
.mg-shell img { position:absolute; bottom:6px; width:86%; opacity:0; transition:opacity .2s; z-index:1; }
.mg-shell.up .cup { transform:translateY(-60px); }
.mg-shell.up img { opacity:1; }
.mg-mem { display:grid; gap:8px; width:min(440px, 92vw); }
.mg-card { all:unset; cursor:pointer; aspect-ratio:1; border-radius:16px; display:grid; place-items:center; font-size:clamp(28px, 8vw, 44px); background:linear-gradient(160deg, var(--accent), #7c4dff); transition:transform .25s; }
.mg-card.open { background:#fff; transform:rotateY(180deg); }
.mg-card.open span { transform:rotateY(180deg); }
.mg-card span { display:none; }
.mg-card.open span { display:block; }
.mg-card.got { background:#bbf7d0; transform:rotateY(180deg); }
.mg-card.got span { display:block; transform:rotateY(180deg); }
.mg-card .who { position:absolute; }
.mg-copy { display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; width:min(300px, 80vw); }
.mg-copy button { all:unset; cursor:pointer; aspect-ratio:1; border-radius:50%; opacity:.55; transition:opacity .1s, transform .1s; box-shadow:inset -8px -10px 0 rgba(0,0,0,.15), inset 8px 8px 0 rgba(255,255,255,.35); }
.mg-copy button.lit { opacity:1; transform:scale(1.08); }
.mg-copy button:active { transform:scale(.94); }
.mg-msg { font-weight:900; font-size:22px; min-height:30px; text-align:center; }
`;

// The axolotl drawn live in a little window, with faces and speech bubbles.
function petView(cv, env) {
  let face = 'joy', faceUntil = 0, say = null, t = 0, last = performance.now(), hop = 0;
  const loop = now => {
    if (!cv.isConnected) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    hop = Math.max(0, hop - dt * 2);
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const c = cv.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#9be8ef'); g.addColorStop(1, '#2a8fb8');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#e8c58f'; c.fillRect(0, h - 16, w, 16);
    for (let i = 0; i < 5; i++) drawBubble(c, (i * 83 + t * 8) % w, h - ((t * 26 + i * 37) % h), 3 + (i % 3) * 2, 0.6);
    const s = Math.min(h / 175, w / 330);
    const p = env.pet;
    drawAxolotl(c, w * 0.5, h * 0.6 + Math.sin(t * 1.6) * 4 - Math.sin(hop * Math.PI) * 18, s, {
      col: env.col(), dir: 1, t, swim: 0.2 + hop, face: faceUntil > t ? face : 'joy', blink: (t % 4) < 0.15,
      wear: p.wear, pattern: p.pattern, sick: false,
    });
    if (say && say.until > t) drawSay(c, w * 0.5 + 110 * s, h * 0.28, say.icon, Math.min(1, (say.until - t) * 4));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return {
    face(f, secs = 1.2) { face = f; faceUntil = t + secs; },
    say(icon, secs = 1.6) { say = { icon, until: t + secs }; },
    hop() { hop = 1; },
  };
}

// A picture of the axolotl (for under the shell).
function petPicture(env) {
  const c = document.createElement('canvas');
  c.width = 300; c.height = 170;
  drawAxolotl(c.getContext('2d'), 168, 98, 0.95, { col: env.col(), dir: 1, t: 1, swim: 0, face: 'giggle', wear: env.pet.wear, pattern: env.pet.pattern });
  return c.toDataURL();
}

// The shared panel: title, axolotl window, game area, footer.
function frame(env, title) {
  const ov = env.overlay(`
    <div class="ui-title">${title}</div>
    <canvas class="mg-pet"></canvas>
    <div class="mg-msg"></div>
    <div class="mg-area"></div>
    <div class="ui-row"><button class="ui-btn ghost" data-back>⬅ Games</button><button class="ui-btn primary" data-again hidden>🔁 Again</button></div>`);
  const view = petView(ov.querySelector('.mg-pet'), env);
  const msg = t => { ov.querySelector('.mg-msg').innerHTML = t; };
  const again = ov.querySelector('[data-again]');
  ov.querySelector('[data-back]').addEventListener('click', () => { env.sfx.click(); ov.close(); env.menu(); });
  return { ov, view, msg, area: ov.querySelector('.mg-area'), again };
}

export function play(id, env) {
  if (id === 'ttt') return noughts(env);
  if (id === 'shells') return shells(env);
  if (id === 'memory') return memory(env);
  if (id === 'copy') return copyMe(env);
}

// ---------------------------------------------------------------- Noughts & crosses
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const winner = b => {
  for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { who: b[l[0]], line: l };
  return b.every(Boolean) ? { who: 'draw' } : null;
};
function best(b, me, them) { // minimax: perfect move for `me`
  let top = -2, move = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = me;
    const sc = -score(b, them, me);
    b[i] = null;
    if (sc > top) { top = sc; move = i; }
  }
  return move;
}
function score(b, turn, other) {
  const w = winner(b);
  if (w) return w.who === 'draw' ? 0 : w.who === turn ? 1 : -1;
  let top = -2;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = turn;
    top = Math.max(top, -score(b, other, turn));
    b[i] = null;
    if (top === 1) break;
  }
  return top;
}

function noughts(env) {
  const f = frame(env, '❌ Noughts & crosses ⭕');
  const name = esc(env.pet.name);
  let wins = { you: 0, pet: 0 }, youStart = true;
  const round = () => {
    const b = Array(9).fill(null);
    let busy = false, over = false;
    f.again.hidden = true;
    f.area.innerHTML = `<div class="mg-score"><span data-y>❌ You ${wins.you}</span><span data-p>⭕ ${name} ${wins.pet}</span></div><div style="height:10px"></div><div class="mg-ttt">${b.map((_, i) => `<button data-i="${i}"></button>`).join('')}</div>`;
    const cells = [...f.area.querySelectorAll('[data-i]')];
    const turn = mine => {
      f.area.querySelector('[data-y]').classList.toggle('on', mine);
      f.area.querySelector('[data-p]').classList.toggle('on', !mine);
      f.msg(mine ? 'Your go! ❌' : `${name} is thinking… 🤔`);
    };
    const put = (i, who) => {
      b[i] = who;
      cells[i].textContent = who === 'x' ? '❌' : '⭕';
      env.sound.tone(who === 'x' ? 660 : 440, 0.1, 'triangle', 0.15);
      const w = winner(b);
      if (!w) return false;
      over = true;
      if (w.line) w.line.forEach(k => cells[k].classList.add('win'));
      if (w.who === 'x') { wins.you++; f.msg('You win! 🎉'); f.view.face('wow', 2); f.view.say('🎉'); env.done('win'); }
      else if (w.who === 'o') { wins.pet++; f.msg(`${name} wins! 😜`); f.view.face('giggle', 2); f.view.say('😜'); f.view.hop(); env.sfx.giggle(); env.done('lose'); }
      else { f.msg("It's a draw! 🤝"); f.view.say('🤝'); env.done('draw'); }
      f.area.querySelector('[data-y]').textContent = `❌ You ${wins.you}`;
      f.area.querySelector('[data-p]').textContent = `⭕ ${name} ${wins.pet}`;
      f.again.hidden = false;
      return true;
    };
    const petGo = async () => {
      busy = true; turn(false); f.view.face('wow', 1);
      await wait(rand(600, 1100));
      if (!f.ov.isConnected || over) return;
      const empty = b.map((v, i) => (v ? -1 : i)).filter(i => i >= 0);
      const i = Math.random() < skill(env.pet.age) ? best(b, 'o', 'x') : pick(empty);
      if (!put(i, 'o')) { busy = false; turn(true); }
    };
    cells.forEach((c, i) => c.addEventListener('click', () => {
      if (busy || over || b[i]) return;
      if (!put(i, 'x')) petGo();
    }));
    if (youStart) turn(true); else petGo();
    youStart = !youStart;
  };
  f.again.addEventListener('click', () => { env.sfx.click(); round(); });
  round();
}

// ---------------------------------------------------------------- Find me! (shell game)
function shells(env) {
  const f = frame(env, '🐚 Find me!');
  const name = esc(env.pet.name);
  const img = petPicture(env);
  const round = async () => {
    f.again.hidden = true;
    const n = env.pet.age >= 6 ? 4 : 3;
    const swaps = 4 + Math.min(8, env.pet.age);
    const speed = Math.max(220, 480 - env.pet.age * 25);
    f.area.innerHTML = `<div class="mg-shells">${Array.from({ length: n }, (_, i) => `<button class="mg-shell" data-i="${i}"><img src="${img}" alt=""><span class="cup">🐚</span></button>`).join('')}</div>`;
    const el = [...f.area.querySelectorAll('.mg-shell')];
    const slot = el.map((_, i) => i);   // slot[shell] = position
    const place = () => el.forEach((e, i) => { e.style.left = `${(slot[i] + 0.5) * (100 / n) - 15}%`; e.style.transitionDuration = speed + 'ms'; });
    place();
    const hide = Math.floor(Math.random() * n);
    el.forEach((e, i) => { if (i !== hide) e.querySelector('img').remove(); });
    f.msg(`Watch ${name}! 👀`);
    await wait(500);
    el[hide].classList.add('up'); f.view.say('🙈');
    await wait(1300);
    el[hide].classList.remove('up');
    await wait(500);
    f.msg('Shuffle! 🌀');
    for (let k = 0; k < swaps; k++) {
      if (!f.ov.isConnected) return;
      const a = Math.floor(Math.random() * n);
      let b2 = Math.floor(Math.random() * (n - 1)); if (b2 >= a) b2++;
      const ia = slot.indexOf(a), ib = slot.indexOf(b2);
      slot[ia] = b2; slot[ib] = a;
      place();
      env.sound.tone(300 + k * 30, 0.06, 'sine', 0.08);
      await wait(speed + 60);
    }
    f.msg(`Where's ${name}? Tap a shell!`);
    let done = false;
    el.forEach((e, i) => e.addEventListener('click', () => {
      if (done) return;
      done = true;
      e.classList.add('up');
      if (i === hide) { f.msg('You found me! 🎉'); f.view.face('giggle', 2); f.view.say('💖'); f.view.hop(); env.sfx.giggle(); env.done('win'); }
      else {
        setTimeout(() => el[hide].classList.add('up'), 500);
        f.msg('Not there! Here I am 😜'); f.view.face('giggle', 2); f.view.say('😜'); env.sfx.no(); env.done('lose');
      }
      f.again.hidden = false;
    }));
  };
  f.again.addEventListener('click', () => { env.sfx.click(); round(); });
  round();
}

// ---------------------------------------------------------------- Memory (take turns)
const MEM_ICONS = ['🪱', '🦐', '🧁', '⚽', '🐚', '🦆', '🍄', '🌷', '🦀', '🐠', '⭐', '🎈'];
function memory(env) {
  const f = frame(env, '🃏 Memory');
  const name = esc(env.pet.name);
  const round = () => {
    f.again.hidden = true;
    const pairs = 4 + 2 * Math.min(2, Math.floor(env.pet.age / 4));   // 4, 6 or 8 pairs
    const icons = MEM_ICONS.slice().sort(() => Math.random() - 0.5).slice(0, pairs);
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    const cols = 4;
    f.area.innerHTML = `<div class="mg-score"><span data-y>🙂 You 0</span><span data-p>🩷 ${name} 0</span></div><div style="height:10px"></div>
      <div class="mg-mem" style="grid-template-columns:repeat(${cols},1fr)">${deck.map((ic, i) => `<button class="mg-card" data-i="${i}"><span>${ic}</span></button>`).join('')}</div>`;
    const cards = [...f.area.querySelectorAll('.mg-card')];
    const got = new Set(), seen = new Map(); // seen: index -> icon (what the axolotl might remember)
    const sc = { you: 0, pet: 0 };
    let open = [], yourTurn = true, busy = false;
    const turn = () => {
      f.area.querySelector('[data-y]').classList.toggle('on', yourTurn);
      f.area.querySelector('[data-p]').classList.toggle('on', !yourTurn);
      f.area.querySelector('[data-y]').textContent = `🙂 You ${sc.you}`;
      f.area.querySelector('[data-p]').textContent = `🩷 ${name} ${sc.pet}`;
      f.msg(yourTurn ? 'Your go! Find a pair' : `${name}'s go…`);
    };
    const flip = i => { cards[i].classList.add('open'); seen.set(i, deck[i]); env.sound.tone(520 + open.length * 120, 0.08, 'triangle', 0.12); open.push(i); };
    const check = async () => {
      busy = true;
      await wait(700);
      if (!f.ov.isConnected) return;
      const [a, b] = open;
      open = [];
      if (deck[a] === deck[b]) {
        got.add(a); got.add(b);
        cards[a].classList.replace('open', 'got'); cards[b].classList.replace('open', 'got');
        seen.delete(a); seen.delete(b);
        yourTurn ? sc.you++ : sc.pet++;
        env.sound.tone(880, 0.15, 'triangle', 0.15);
        if (!yourTurn) { f.view.face('giggle', 1.2); f.view.say('😄'); }
        else f.view.face('wow', 1);
      } else {
        cards[a].classList.remove('open'); cards[b].classList.remove('open');
        yourTurn = !yourTurn;
      }
      if (got.size === deck.length) {
        turn();
        if (sc.you > sc.pet) { f.msg('You win! 🎉'); f.view.say('🎉'); env.done('win'); }
        else if (sc.you < sc.pet) { f.msg(`${name} wins! 😜`); f.view.say('😜'); f.view.hop(); env.sfx.giggle(); env.done('lose'); }
        else { f.msg("It's a draw! 🤝"); f.view.say('🤝'); env.done('draw'); }
        f.again.hidden = false;
        return;
      }
      turn();
      busy = false;
      if (!yourTurn) petGo();
    };
    const petGo = async () => {
      busy = true;
      await wait(700);
      if (!f.ov.isConnected) return;
      const left = deck.map((_, i) => i).filter(i => !got.has(i));
      const remembers = Math.random() < skill(env.pet.age);
      // a pair it has already seen?
      let a = -1, b = -1;
      if (remembers) {
        for (const [i, ic] of seen) for (const [j, jc] of seen) if (i < j && ic === jc) { a = i; b = j; }
      }
      if (a < 0) {
        a = pick(left.filter(i => !seen.has(i)).length ? left.filter(i => !seen.has(i)) : left);
        flip(a);
        await wait(650);
        if (!f.ov.isConnected) return;
        const match = remembers ? [...seen.keys()].find(j => j !== a && deck[j] === deck[a] && !got.has(j)) : undefined;
        b = match !== undefined ? match : pick(left.filter(i => i !== a));
        flip(b);
      } else {
        flip(a); await wait(500); flip(b);
      }
      check();
    };
    cards.forEach((c, i) => c.addEventListener('click', () => {
      if (!yourTurn || busy || got.has(i) || open.includes(i)) return;
      flip(i);
      if (open.length === 2) check();
    }));
    turn();
  };
  f.again.addEventListener('click', () => { env.sfx.click(); round(); });
  round();
}

// ---------------------------------------------------------------- Copy me (Simon)
const PADS = [
  { col: '#ef4444', note: 392 },
  { col: '#facc15', note: 494 },
  { col: '#22c55e', note: 587 },
  { col: '#3b82f6', note: 698 },
];
function copyMe(env) {
  const f = frame(env, '🎵 Copy me');
  const name = esc(env.pet.name);
  const goal = 4 + Math.min(4, Math.floor(env.pet.age / 2));
  const round = async () => {
    f.again.hidden = true;
    f.area.innerHTML = `<div class="mg-score"><span data-n>🎵 0 / ${goal}</span></div><div style="height:10px"></div>
      <div class="mg-copy">${PADS.map((p, i) => `<button data-i="${i}" style="background:${p.col}"></button>`).join('')}</div>`;
    const pads = [...f.area.querySelectorAll('[data-i]')];
    const seq = [];
    let pos = 0, listening = false;
    const light = async (i, ms = 420) => {
      pads[i].classList.add('lit');
      env.sound.tone(PADS[i].note, ms / 1000, 'triangle', 0.18);
      await wait(ms);
      pads[i].classList.remove('lit');
    };
    const sing = async () => {
      listening = false;
      seq.push(Math.floor(Math.random() * 4));
      f.area.querySelector('[data-n]').textContent = `🎵 ${seq.length - 1} / ${goal}`;
      f.msg(`${name} sings… 🎶`);
      f.view.face('giggle', seq.length * 0.6 + 0.5);
      await wait(600);
      const ms = Math.max(260, 460 - seq.length * 20);
      for (const i of seq) { if (!f.ov.isConnected) return; await light(i, ms); await wait(120); }
      f.msg('Your turn! Copy me 🎵');
      pos = 0; listening = true;
    };
    pads.forEach((p, i) => p.addEventListener('click', async () => {
      if (!listening) return;
      light(i, 250);
      if (i !== seq[pos]) {
        listening = false;
        f.msg(`Oops! You got ${seq.length - 1} 🎵`); f.view.face('wow', 1.5); f.view.say('🙊'); env.sfx.no();
        env.done(seq.length - 1 >= Math.ceil(goal / 2) ? 'draw' : 'lose');
        f.again.hidden = false;
        return;
      }
      pos++;
      if (pos === seq.length) {
        listening = false;
        if (seq.length >= goal) {
          f.area.querySelector('[data-n]').textContent = `🎵 ${goal} / ${goal}`;
          f.msg('Perfect! You win! 🎉'); f.view.face('giggle', 2); f.view.say('🎉'); f.view.hop(); env.sound.win(); env.done('win');
          f.again.hidden = false;
          return;
        }
        f.view.say('👏', 0.8);
        await wait(700);
        sing();
      }
    }));
    sing();
  };
  f.again.addEventListener('click', () => { env.sfx.click(); round(); });
  round();
}
