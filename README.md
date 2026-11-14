# Kids Games 🎮

Simple browser games for kids (aimed at ages 4–6).

## Play
Live at GitHub Pages: https://bennimmo.github.io/kids-games/

Every push to `main` deploys automatically (see `.github/workflows/deploy.yml`).

## Run locally
No build step. Just serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Add a new game
1. Make `games/<my-game>/game.js` that exports `mount(stage, game)`.
   - `stage` is the full-screen element to draw in.
   - Return a function that tidies up (stop loops, remove listeners).
2. Add it to the list in `js/games.js` (name, emoji icon, colour).

## Shared engine bits (`js/engine/`)
- `canvas.js` – full-screen sharp canvas
- `loop.js` – game loop with `update(dt)` / `draw()`
- `keys.js` – keyboard state (for 2 players on one keyboard)
- `sound.js` – little beeps, no audio files needed
- `coming-soon.js` – placeholder screen

## Games
### 🏎️ Raffy Race (`games/race-track/`)
- Drag to draw a dirt track. It closes into a loop. Crossings become a bridge.
- Drag extras onto the track: jump, water, tunnel. Drag to 🗑️ to remove.
- Up to 2 players: arrows and WASD. Tap a car to pick its colour.
- 5 laps. Then 🔁 race again or ✏️ redraw (edit, start fresh, or pick a saved track).
- 🖼️ Saved tracks: every raced track is saved in the browser (last 12). ⭐ keeps one forever. ✖ then 🗑️ deletes.
- Files: `track.js` (geometry), `sim.js` (physics + laps), `render.js` (drawing), `game.js` (screens).

### ✏️ Draw a Road – coming soon

### 💄 Beautiful Bells (`games/beautiful-bells/`)
- Pick a girl, then hair colour, length and eye colour.
- Drag (or tap) makeup, hairstyles, hair bits, earrings, necklaces and tops onto her.
- 📸 saves a PNG. Last 20 girls kept in the browser ("My girls").
- Files: `items.js` (data), `draw.js` (SVG), `look.js` (state + actions), `gallery.js`, `game.js` (screens).

## Design rules
- Icons, not words (players are 4–6).
- Multiplayer-ready: game state is plain data, and the simulation is
  `step(state, inputs, dt)`. Inputs come from "controls" (keyboard now,
  a friend over Firebase later).
