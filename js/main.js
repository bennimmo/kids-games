import { GAMES, AGES } from './games.js';
import { gameArt } from './game-art.js';
import { icon } from './engine/icons.js';
import { VERSION } from './version.js';
import { sound } from './engine/sound.js';
import { myName, setMyName, nameHTML, NAME_MAX, myFace, setMyFace, FACES } from './engine/profile.js';
import { mountFriends, friendBarHTML, refreshFriendBar, newCode } from './friends-ui.js';
import { nameChanged } from './engine/friends.js';
import { leftRoom } from './engine/together.js';

const app = document.getElementById('app');
let cleanup = null, current = null;

// ---------- install as an app / full screen ----------
const standalone = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const canFullscreen = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
let installPrompt = null;

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {});
}

// Installed apps (iPad, Windows) often just wake up instead of loading again.
// Coming back after a while: check for an update, and reload if we're on the menu (never mid-game).
const RELOAD_AFTER_MS = 10 * 60 * 1000;
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { hiddenAt = Date.now(); return; }
  if (!hiddenAt || Date.now() - hiddenAt < RELOAD_AFTER_MS || !navigator.onLine) return;
  navigator.serviceWorker?.getRegistration().then(r => r && r.update()).catch(() => {});
  if (!location.hash.replace(/^#\/?/, '')) location.reload();
});
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installPrompt = e;
  if (!location.hash.replace(/^#\/?/, '')) showMenu();
});
window.addEventListener('appinstalled', () => { installPrompt = null; showMenu(); });

function toggleFullscreen() {
  const d = document;
  if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  else {
    const el = d.documentElement;
    const r = (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    if (r && r.catch) r.catch(() => {});
  }
}

function appButtons() {
  if (standalone) return '';
  const b = [];
  if (installPrompt || isIOS) b.push(`<button class="app-btn app-install" aria-label="Install app">${icon('install')}</button>`);
  if (canFullscreen) b.push(`<button class="app-btn app-full" aria-label="Full screen">${icon('fullscreen')}</button>`);
  return b.length ? `<div class="app-btns">${b.join('')}</div>` : '';
}

function iosHelp() {
  const o = document.createElement('div');
  o.className = 'app-help';
  o.innerHTML = `<div class="app-help-card">
      <div class="app-help-steps"><span>⬆️</span><span>➜</span><span>➕</span><span>➜</span><span>🎮</span></div>
      <p>Tap <b>Share</b> <span class="ios-share">⬆️</span> at the top of Safari, then <b>Add to Home Screen</b>.</p>
      <button class="app-btn name-ok" aria-label="OK">${icon('check')}</button>
    </div>`;
  o.addEventListener('click', () => o.remove());
  document.body.appendChild(o);
}

function wireAppButtons() {
  const full = app.querySelector('.app-full');
  if (full) full.addEventListener('click', () => { sound.pop(); toggleFullscreen(); });
  const inst = app.querySelector('.app-install');
  if (inst) inst.addEventListener('click', async () => {
    sound.pop();
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice.catch(() => {});
      installPrompt = null;
      showMenu();
    } else if (isIOS) iosHelp();
  });
}

// ---------- my name (used in every online game) ----------
function nameButton() {
  const n = myName(), f = myFace();
  return `<button class="name-btn${n ? '' : ' empty'}" aria-label="My name"><span class="name-ico${f ? ' emo' : ''}">${f || icon('user')}</span>${n ? `<b>${nameHTML(n)}</b>` : `<b class="name-pen">${icon('edit')}</b>`}</button>`;
}

function editName() {
  const o = document.createElement('div');
  o.className = 'app-help name-edit';
  o.innerHTML = `<form class="app-help-card name-card">
      <div class="name-face"></div>
      <input class="name-input" maxlength="${NAME_MAX}" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="My name">
      <div class="face-grid">${FACES.map(f => `<button type="button" data-f="${f}">${f}</button>`).join('')}</div>
      <div class="name-row"><button type="button" class="app-btn name-clear" aria-label="Clear">${icon('backspace')}</button><button type="submit" class="app-btn name-ok" aria-label="Done">${icon('check')}</button></div>
    </form>`;
  const input = o.querySelector('input');
  const before = myName(), faceBefore = myFace();
  let face = faceBefore;
  input.value = before;
  const showFace = () => {
    const el = o.querySelector('.name-face');
    el.innerHTML = face || icon('user');
    el.classList.toggle('emo', !!face);
    o.querySelectorAll('.face-grid button').forEach(b => b.classList.toggle('on', b.dataset.f === face));
  };
  showFace();
  o.querySelectorAll('.face-grid button').forEach(b => b.addEventListener('click', () => {
    sound.pop(); face = b.dataset.f; showFace();
    if (setMyFace(face) !== faceBefore) nameChanged(); // saved straight away
  }));
  // Saved however the box is closed (tick, Enter or tapping outside).
  const close = () => {
    const changed = (setMyName(input.value) !== before) | (setMyFace(face) !== faceBefore) | (face !== faceBefore);
    o.remove();
    if (changed) nameChanged();
    showMenu();
  };
  o.querySelector('form').addEventListener('submit', e => { e.preventDefault(); sound.pop(); close(); });
  o.querySelector('.name-clear').addEventListener('click', () => { input.value = ''; input.focus(); });
  o.addEventListener('click', e => { if (e.target === o) close(); });
  document.body.appendChild(o);
  input.focus();
}

function showMenu() {
  app.innerHTML = `
    <div class="menu">
      <div class="top-left">${nameButton()}${friendBarHTML()}</div>
      ${appButtons()}
      <h1>${[...'Kids Games'].map(ch => ch === ' ' ? ' ' : `<span>${ch}</span>`).join('')}</h1>
      ${AGES.map(a => {
        const list = GAMES.filter(g => (g.age || AGES[0].id) === a.id);
        return list.length ? `<section class="age" style="--a:${a.color}">
        <h2 class="age-title"><span>${a.name}</span></h2>
        <div class="grid">
          ${list.map(g => `
            <button class="tile" style="--c:${g.color}" data-id="${g.id}">
              <div class="icon">${gameArt(g.id) || g.icon}</div>
              <div class="name">${g.name}</div>
            </button>`).join('')}
        </div>
      </section>` : '';
      }).join('')}
      <div class="version">v${VERSION}</div>
    </div>`;
  wireAppButtons();
  refreshFriendBar();
  app.querySelector('.name-btn').addEventListener('click', () => { sound.pop(); editName(); });
  app.querySelectorAll('.tile').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.pop();
      location.hash = '#/' + btn.dataset.id;
    });
  });
}

async function showGame(game) {
  app.innerHTML = `
    <div class="game">
      <div class="game-stage"></div>
      <button class="home-btn" aria-label="Home">${icon('home')}</button>
    </div>`;
  app.querySelector('.home-btn').addEventListener('click', () => {
    sound.pop();
    location.hash = '';
  });
  const stage = app.querySelector('.game-stage');
  const mod = await game.load();
  // Each game exports mount(stage, info) and returns a function that tidies up.
  cleanup = mod.mount(stage, game) || null;
}

function route() {
  const id = location.hash.replace(/^#\/?/, '').split('?')[0];
  // same game, just tidying the address bar (together.js takeJoinCode)
  if (cleanup && id === current && !location.hash.includes('?join=')) return;
  if (cleanup) { cleanup(); cleanup = null; }
  leftRoom(); // never keep inviting friends to a game you've left
  current = id;
  const game = GAMES.find(g => g.id === id);
  if (game) showGame(game);
  else { showMenu(); newCode(); } // a new friend code every visit
}

mountFriends({ editName });
window.addEventListener('hashchange', route);
route();
