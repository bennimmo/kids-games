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
- Up to 2 players: arrows and WASD, or touch buttons on iPad/tablets.
- Tap a car to customise: colour, type (monster truck, rally, buggy) and sticker. Choices are remembered.
- If the end of your line overlaps the start, the extra bit is trimmed so the loop joins cleanly.
- 5 laps. Then 🔁 race again or ✏️ redraw (edit, start fresh, or pick a saved track).
- 🖼️ Saved tracks: every raced track is saved in the browser (last 12). ⭐ keeps one forever. ✖ then 🗑️ deletes.
- Files: `track.js` (geometry), `sim.js` (physics + laps), `render.js` (drawing), `game.js` (screens).

### 🛻 Monster Doodle (`games/draw-a-road/`)
Draw lines with your finger/mouse so the monster truck gets to the flag 🏁.
- 24 levels: gaps, hills, walls, trampolines, speed arrows, magic doors, no-engine and floaty zones, ski jumps, low bridges, zig zags and a grand finale
- Up to 3 stars – use less crayon for more stars (saved on the device)
- Space = go/stop, Z = undo
- Files: `levels.js` (level data), `sim.js` (physics, no DOM), `game.js` (drawing + screens)
- Physics: [Planck.js](https://github.com/piqnt/planck.js) (MIT), saved in `js/vendor/`
- Ready for multiplayer later: the sim uses a fixed time step, so the same lines give the same run.
  Players could just swap their lines (plain `[x, y]` lists) and race side by side.


### 💄 Beautiful Bells (`games/beautiful-bells/`)
- Pick a girl, then hair colour, length and eye colour.
- Everything is drag and drop (tapping a worn item takes it off).
- Lipstick, eyeshadow, blusher and face paint are brushes: rub to paint, colours blend. The brush stays in your hand until ✖.
- ✂️ Scissors cut the hair, 🧪 grow potion brings it back.
- Tops: 11 styles, 16 colours, 10 patterns. Plus hairstyles, glasses, earrings, necklaces, hair bits.
- 📸 saves a PNG. Last 20 girls kept in the browser ("My girls"). Bump `LOOK_VERSION` in `look.js` on breaking changes; older saves just disappear.
- 👭 Play with friends (uses `js/engine/net.js`): make a room or join with 3 pictures. Everyone makes their own girl; your girl and one friend's girl show big side by side, others as small faces to tap. 🎉 Show off sends confetti to everyone. Friends' girls are checked by `sanitizeLook()` before drawing.
- Files: `items.js` (data), `draw.js` (SVG), `look.js` (state + actions), `gallery.js`, `online.js` (friends), `game.js` (screens).

### 🎨 Paint Party (`games/paint/`)
A simple paint program, like old Windows Paint.
- Tools: pen, rainbow pen, spray can, rubber, fill bucket, stickers, line, box, circle (outline or filled)
- 18 colours + 🎨 any colour, 4 sizes. ↩️ undo / ↪️ redo (Ctrl+Z / Ctrl+Y), 🗑️ clear (can be undone)
- Saves itself in the browser (last 12, oldest go first if storage is full). 🖼️ opens them, ➕ new page
- 📥 downloads a PNG
- 👫 Draw with friends: make a room or join with 3 pictures. Everyone draws on the same page and sees friends' lines as they draw.
  Each device writes its own strokes (`live/<pid>/<opId>`). If a friend leaves, the host keeps their strokes.
- A drawing is a list of plain "ops" (`ops.js`), checked by `sanitizeOp()` before drawing friends' ones.
- Files: `ops.js` (drawing + fill), `gallery.js` (saving), `online.js` (friends), `game.js` (screen)

## Online play (Firebase)
- Shared code: `js/engine/net.js` (any game can use it).
- One Realtime Database for all games: `games/<game>/rooms/<code>/...`
- Room codes are 3 pictures (`CODE_LEN` in net.js), so kids can join without reading.
- Security rules: `database.rules.json` (paste into Firebase → Realtime Database → Rules).
- Test on one computer with 2 tabs, no internet: add `?net=local` to the URL,
  e.g. `http://localhost:8000/?net=local#/race-track`

### Raffy Race online
- 🌍 → host (shares your track) or 🔑 join (tap the 3 pictures).
- Host draws/edits and starts races; friends wait in the lobby.
- Each device drives its own cars and sends positions ~15×/sec.

## Design rules
- Icons, not words (players are 4–6).
- Multiplayer-ready: game state is plain data, and the simulation is
  `step(state, inputs, dt)`. Inputs come from "controls" (keyboard now,
  a friend over Firebase later).

### 🎈 Balloon Pop (`games/balloon-pop/`)
For age 2+. Tap balloons to pop them. No losing, no timer.
- Each pop plays a bubbly pop sound (pitch changes with the colour)
- Every 15–20 sec a digger 🚜 or train 🚂 floats up on balloons (meep meep / toot toot). Tap it: wheee, it drops, then drives off with engine putter or choo-choo chuffs (+3 stars)
- Fill 10 stars → fireworks party, then start again
- Big tap areas, palm slaps ignored
- Nothing floats in the bottom middle (Android app-switch bar). Balloons there pop in higher up instead
- Grown-ups: hold 🏠 for a second to exit (a quick tap does nothing)
