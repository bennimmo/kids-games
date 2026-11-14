// Placeholder screen for games we have not built yet.
export function comingSoon(stage, game) {
  stage.innerHTML = `
    <div class="soon-screen" style="--c:${game.color}">
      <div class="icon">${game.icon}</div>
      <h2>${game.name}</h2>
      <p>Coming soon! 🚧</p>
    </div>`;
  return () => { stage.innerHTML = ''; };
}
