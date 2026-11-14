import { GAMES } from './games.js';
import { sound } from './engine/sound.js';

const app = document.getElementById('app');
let cleanup = null;

function showMenu() {
  app.innerHTML = `
    <div class="menu">
      <h1>${[...'Kids Games'].map(ch => ch === ' ' ? ' ' : `<span>${ch}</span>`).join('')}</h1>
      <div class="grid">
        ${GAMES.map(g => `
          <button class="tile" style="--c:${g.color}" data-id="${g.id}">
            <div class="icon">${g.icon}</div>
            <div class="name">${g.name}</div>
          </button>`).join('')}
      </div>
    </div>`;
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
