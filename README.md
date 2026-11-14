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

## Plans
- 🏎️ Race Track – draw a track with jumps and tunnels, race a friend on one keyboard
- ✏️ Draw a Road – draw a line for the car to get from start to flag
- Later: physics (e.g. Matter.js / Planck.js) and online multiplayer (Firebase)
