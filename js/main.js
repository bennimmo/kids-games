import { GAMES } from './games.js';
import { sound } from './engine/sound.js';
import { myName, setMyName, nameHTML, NAME_MAX } from './engine/profile.js';

const app = document.getElementById('app');
let cleanup = null;

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
  if (installPrompt || isIOS) b.push('<button class="app-btn app-install" aria-label="Install app">📲</button>');
  if (canFullscreen) b.push('<button class="app-btn app-full" aria-label="Full screen">⛶</button>');
  return b.length ? `<div class="app-btns">${b.join('')}</div>` : '';
}

function iosHelp() {
  const o = document.createElement('div');
  o.className = 'app-help';
  o.innerHTML = `<div class="app-help-card">
      <div class="app-help-steps"><span>⬆️</span><span>➜</span><span>➕</span><span>➜</span><span>🎮</span></div>
      <p>Tap <b>Share</b> <span class="ios-share">⬆️</span> at the top of Safari, then <b>Add to Home Screen</b>.</p>
      <button class="app-btn">✔️</button>
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
  const n = myName();
  return `<button class="name-btn${n ? '' : ' empty'}" aria-label="My name"><span>👤</span>${n ? `<b>${nameHTML(n)}</b>` : '<b>✏️</b>'}</button>`;
}

function editName() {
  const o = document.createElement('div');
  o.className = 'app-help name-edit';
  o.innerHTML = `<form class="app-help-card name-card">
      <div class="name-face">👤</div>
      <input class="name-input" maxlength="${NAME_MAX}" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done" aria-label="My name">
      <div class="name-row"><button type="button" class="app-btn name-clear" aria-label="Clear">⌫</button><button type="submit" class="app-btn name-ok" aria-label="Done">✔️</button></div>
    </form>`;
  const input = o.querySelector('input');
  input.value = myName();
  const close = () => { o.remove(); showMenu(); };
  o.querySelector('form').addEventListener('submit', e => { e.preventDefault(); setMyName(input.value); sound.pop(); close(); });
  o.querySelector('.name-clear').addEventListener('click', () => { input.value = ''; input.focus(); });
  o.addEventListener('click', e => { if (e.target === o) close(); });
  document.body.appendChild(o);
  input.focus();
}

function showMenu() {
  app.innerHTML = `
    <div class="menu">
      ${nameButton()}
      ${appButtons()}
      <h1>${[...'Kids Games'].map(ch => ch === ' ' ? ' ' : `<span>${ch}</span>`).join('')}</h1>
      <div class="grid">
        ${GAMES.map(g => `
          <button class="tile" style="--c:${g.color}" data-id="${g.id}">
            <div class="icon">${g.icon}</div>
            <div class="name">${g.name}</div>
          </button>`).join('')}
      </div>
    </div>`;
  wireAppButtons();
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
      <button class="home-btn" aria-label="Home">🏠</button>
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
  if (cleanup) { cleanup(); cleanup = null; }
  const id = location.hash.replace(/^#\/?/, '');
  const game = GAMES.find(g => g.id === id);
  if (game) showGame(game);
  else showMenu();
}

window.addEventListener('hashchange', route);
route();
