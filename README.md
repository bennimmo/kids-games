# Kids Games 🎮

Simple browser games for kids (aimed at ages 4–6).

## Play
Live at GitHub Pages: https://bennimmo.github.io/kids-games/

Every push to `main` deploys automatically (see `.github/workflows/deploy.yml`).

## Install as an app
- iPad/iPhone: open in **Safari** → Share ⬆️ → **Add to Home Screen**. Opens full screen.
- Android/Chrome/Edge: tap 📲 on the menu (or the install icon in the address bar).
- ⛶ on the menu = full screen in a normal browser.
- `manifest.webmanifest`, `icons/`, `sw.js` (network first, so pushes go live straight away; works offline for games already opened).
- Updates: with internet, every load gets the newest files (our files skip the browser's ~10 min cache). An installed app that wakes up after 10+ min away reloads itself if it's on the menu (never mid-game).

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
2. Add it to the list in `js/games.js` (name, emoji icon, colour, `age`: little / middle / big).
   - Optional: a drawn menu icon in `js/game-art.js`.

## Shared engine bits (`js/engine/`)
- `canvas.js` – full-screen sharp canvas
- `loop.js` – game loop with `update(dt)` / `draw()`
- `keys.js` – keyboard state (for 2 players on one keyboard)
- `sound.js` – little beeps, no audio files needed
- `coming-soon.js` – placeholder screen

## 📞 Friends (on the menu)
- Every visit to the menu gives a new 6-picture code. Give it to a friend; they type it in (📞 on the menu), you tap ✅.
- Up to 4 friends in a group. Anyone in the group can let more in.
- Friend bubbles float on the side over every game. Drag them up/down or to the other side.
- Reload / iPad sleep: rejoins the group if back within 15 min. 👋 in the panel = leave.
- 🎤 Voice: mic turns on when you join (asks once). 🎤/🔇 above the bubbles = mute. Pick a mic in the 📞 panel (if more than one).
- `js/engine/friends.js`: Firebase only for finding each other (`games/friends/rooms/`, normal rules); the link is WebRTC, ready for voice/video (bubbles already have a `<video>`). Only names are shared, nothing kept.
- Some networks block direct links: a TURN server would fix that (not added yet).

## Games
### ✈️ Sky Pilot (`games/sky-pilot/`)
3D flight simulator with an easy mode. Built with three.js.
- 5 aircraft: 🛩️ Sky Cub (easy), 🌊 Splash (seaplane, lands on water), 🚁 Whirly (helicopter), ✈️ Jumbo Jet, 🚀 Zoom Jet (fast, carrier catapult + arrestor wire). 8 colours.
- One island: snowy mountains (north), desert with pyramids (east), forest + farms + Duck Lake (west), Sunny Town + beaches + ferris wheel + lighthouse (south), carrier and small islands at sea.
- 4 airports with real markings, edge/approach lights, running strobes and PAPI lights (2 red + 2 white = right glide path). Hospital roof helipad, harbour for the seaplane.
- Start on a runway or ☁️ in the sky (lined up to land at Sunny Bay).
- Life: boats with wakes, cars + train, other planes doing circuits, hot air balloons, bird flocks, whales, dolphins, deer, ducks, fireworks at night.
- Day/night cycle (15 min) and weather spells (clear, cloudy, rain, storms with lightning + thunder, snow over the mountains, rainbows after rain). Fly through clouds. Lights come on at night.
- Views (just two): 🎥 behind the plane and 👨‍✈️ cockpit (working instruments; glass cockpit in the jumbo, HUD in the jet). Drag to look, wheel/pinch to zoom, double-tap to reset.
- 🐣 Easy: quick turns (extra turn help when banked), wings level when you let go, holds height, climbs after take-off, turns stay level, no stalls, auto wheels/flaps/brakes, green landing hoops, settles gently onto the runway. 🧑‍✈️ Real: you do it all (altimeter shows sea level height).
- 🛡️ No crash mode: hitting the ground just bounces you back up. Otherwise a crash = puff of smoke, back to the start.
- Keys (always pilot style: ↑ = nose down, ↓ = nose up): W S / ↑ ↓ nose, A D / ← → roll, Q E rudder, R F / Shift Ctrl power, G wheels, V flaps ([ ]), Space brakes, C camera, X smoke, M map, Esc pause, Backspace restart. Gamepads work.
- Touch: stick (left), power slider (right), ⚙️ 🪶 🛑 💨 buttons, 📱 tilt to fly (one tap on 👆).
- 🌍 Shared sky: everyone playing is in the same sky (planes + name tags, no chat). Time and weather come from the server clock so everyone sees the same sky. Each device sends its plane ~4×/sec (`games/sky-pilot/rooms/public/live/<uid>_p0`). Start spots avoid planes already parked there; 👋 shows when someone arrives. Tap the 🌍 chip (or T) for a list of pilots: tap one to jump in just behind them with the same speed, angle, wheels and flaps (parked = park next to them). Turn off with 🌍 in the menu.
- 🔑 Friends: picture-code rooms, just you and your friends (8×/sec).
- Missions: ready for later (`missions.js` explains the hooks). The 🎯 menu button appears once `MISSIONS` has some.
- Test params: `?sptime=<seconds>` fixes the time of day (0–900), `?spq=low|mid|high` quality, `?spdebug` adds `window.__sp()`.
- Files: `island.js` (land, airports, roads, what's under you), `terrain.js`, `sky.js`, `scenery.js`, `life.js`, `planes.js`, `cockpit.js`, `physics.js`, `missions.js`, `game.js` (screens, controls, cameras, HUD, online).

### 🚂 Choo Choo Wilf (`games/choo-choo/`)
3D steam train for age 2–3 (no reading needed, spoken prompts). Built with three.js.
- Hold anywhere = go (puffs of steam + chuff chuff). Let go = slows down. Red button = whistle "CHOO CHOO!".
- Endless track: corners, bridges over rivers, tunnels through mountains, hills.
- Things get in the way. The train always stops itself:
  - 🦆 ducks cross, 🚗 cars at a level crossing, 🚜 digger drives across (just wait).
  - 🚧 barrier down, 🐄🐑🐧🦀 animals on the line (tap them; a 👆 shows where).
  - 💧 water tower (tap it to fill up), 🪨 rock on the line (tap, the crane lifts it off), 🚦 red signal (tap to make it green).
- 🔀 Junctions: the line splits round a duck pond. Big ⬅ ➡ arrows: tap to pick the way (picks itself after a while).
- Tap things in the world: 🐄 field animals jump and moo/baa/quack, 🏠 someone pops out and waves, 🌳 squirrel / 🍎 apple (🦉 at night), 🌴 coconut, 🌿 bunny, 🍄 frog, 🌼 butterflies, 🐟 fish in ponds, ☁️ clouds rain then make a 🌈.
- 🐦 birds fly over now and then. Tap to spot them.
- Every sticker flies to the row at the bottom.
- 🚉 Each stretch ends at a station: "Well done!", passengers (animals) hop off and on.
- Lands change at each station: meadow → forest → snowy (snowing) → town → seaside. Every 3rd stretch is at night (headlight, glowing windows).
- Keyboard: Space = go, W = whistle.
- Files: `world.js` (track, land, stations, junctions), `scenery.js`, `models.js` (train, animals, vehicles), `events.js` (things on the line), `interact.js` (tap surprises), `audio.js` (sounds + speech), `game.js`.

### 🏁 Kit's Karts (`games/kits-karts/`)
3D kart racing for age 8+. Draw a track like Raffy Race (uses its `track.js`), then race it in 3D (three.js).
- 8 themes (top bar): 🏙️ city, 🌳 countryside, 🏜️ desert, ❄️ snow (slippy, snowing), 🏖️ beach, 🌋 volcano, 🍭 candy, 🌙 moon (low gravity).
- Drawn tracks are smoothed (wobbles from the finger/mouse removed) and roads drawn too close side by side are pushed apart (`spreadTrack`, MIN_GAP), so there's room for a barrier. Real crossings are kept.
- Crossings (figure of 8): 🚀 jump over the other road (default) or 🌉 bridge. Tap the badge on the crossing to switch. Ramps have rails. A kart that misses the jump is carried back by 🚁.
- Extras to drag on: ❓ mystery boxes, ⏩ boost, 🛹 ramp, mud, ice, water, cones, tyre walls, trees (theme plant), grandstand. No boxes placed = 3 rows added. 🎲 makes a random track.
- Mystery box items (better ones the further back you are): 🍌 banana (x1 or x3), 🛢️ oil, 🚀 homing rocket, 🟢 bouncing ball, 💣 bomb, 🍄 turbo (x1 or x3), 🛡️ shield, ⭐ star, ⚡ zap (shrinks everyone ahead).
- Barriers a little way off the road (you can go on the grass, not get lost). Arrows on the road show the way.
- Driving: ▲ go, ▼ brake. Hold ▼ while turning fast = drift; let go for a mini turbo (blue/orange sparks). Steer in the air = trick, turbo when you land. Karts bash each other (heavy karts win).
- 🤖 robots: 0–6, speed 🐢 / 🐇 / 🚀. Laps 1/2/3/5. 
- 2 players = split screen (P1 arrows + Enter, P2 WASD + Space). Solo: either keys. Gamepads work (A go, B brake, X fire). Touch: ◀ ▶ ▼ 💥, goes by itself. Tapping the item box (top left) also fires.
- 📱 Tilt to steer (one player on a touch screen; on by default on phones). 📱/👆 button in the race switches it. Straight = how you hold it at GO. iPhone asks permission on the first 🏁 tap.
- 🔧 Garage (tap your kart): 10 bodies (go-kart, F1, off-road, monster, NASA rover, rocket, tractor, hover, police, bath tub), colours, decals, wheels (slicks, knobbly, big, gold, neon), drivers (kid, astronaut, robot, cat, dog, bear, alien, dino), helmet, spoilers, toppers, boost flame colour. Bodies and wheels change the stat bars (speed, accel, turn, weight, off-road).
- Saved tracks 🖼️ keep the theme and jump/bridge choices.
- 🌍 Online (up to 8 karts): host draws the track, then 🌍 → host. Friends tap 🌍 → 🔑 and the 3 pictures. Friends watch the track being made and can do up their kart 🔧. Host picks robots/laps and taps 🏁; host's device drives the robots.
  - Each device drives its own karts and sends where they are ~15×/sec (`live/<uid>_p1`). Items are sent too: bananas, oil, rockets, balls and bombs show on friends' screens and hit their karts; zaps and bomb blasts are sent as one-off events. A device that's hit sends back the item id so the owner removes it.
  - Test with 2 tabs: `?net=local`.
- `?kkdebug` puts `window.__kk()` in the console. `?kklow` turns shadows off.
- Files: `course.js` (heights, jumps, bridges), `sim.js` (physics, items, laps), `ai.js`, `karts.js` (options + 3D karts), `world.js` (3D world + scenery), `editor.js` (2D designer), `preview.js` (garage viewer), `themes.js`, `game.js` (screens, HUD, split screen).

### 🏎️ Raffy Race (`games/race-track/`)
- Drag to draw a dirt track. It closes into a loop. Crossings become a bridge.
- Drag extras onto the track: jump, speed boost, water, mud, ice, tunnel. Scenery anywhere: cones (knock them over), tyre walls, trees (drive under), grandstand (crowd cheers). Drag to 🗑️ to remove.
- 🤖 Playing alone? A computer car joins (eases off when it's ahead). ✖ removes it, 🤖 brings it back.
- 🎁 Item boxes (2 rows added automatically, or place your own): 🥊 punch rocket (homes in, knocks the car off the track), 🍌 banana (drop behind), ⚡ turbo. Fire: Enter (arrows player), Space (WASD player), 💥 on touch.
- A lap counts the moment you cross the line, as long as you've been round the other 3 quarters of the track.
- Up to 2 players: arrows and WASD, or touch buttons on iPad/tablets.
- Tap a car to customise: colour, type (monster truck, rally, buggy) and sticker. Choices are remembered.
- If the end of your line overlaps the start, the extra bit is trimmed so the loop joins cleanly.
- 5 laps. Then 🔁 race again or ✏️ redraw (edit, start fresh, or pick a saved track).
- 🖼️ Saved tracks: every raced track is saved in the browser (last 12). ⭐ keeps one forever. ✖ then 🗑️ deletes.
- Files: `track.js` (geometry), `sim.js` (physics + laps), `render.js` (drawing), `game.js` (screens).

### 🚀 Star Dash (`games/space-race/`)
3D space race for age 8+. Built with [three.js](https://threejs.org) r160 (MIT), saved in `js/vendor/`.
- Two styles:
  - 🌀 **Tube Race**: fly inside a glowing tube. ◀ ▶ slide round the wall, ▲ faster, ▼ brake. Red rocks = bonk, green arrows = boost. 3 laps.
  - 🪐 **Open Space**: fly anywhere. Go through every ring in order (follow your arrow). Each ring = boost. 2 laps.
- Three ways to play:
  - 🙂 vs 🤖 full screen. Computer level 🐢 / 🐇 / 🚀 (remembered).
- 📱 Tilt to steer on phones/iPads (one player only: vs computer and online). Tap 📱/👆 in the race to switch tilt on/off. Straight is set at GO.
  - Tube: tilt left/right steers, the ship goes fast by itself (▼ brakes).
  - Open Space: tilt left/right turns, tilt the top towards you to climb, away to dive.
  - iPhone/iPad ask for permission the first time (needs https, so it works on GitHub Pages, not on http://localhost).
  - 🙂 vs 🙂 split screen. Arrows vs WASD, or touch buttons. Wide screens split left/right (WASD player on the left), tall screens top/bottom.
  - 🌍 online (up to 4). Host picks the style and taps ▶. Each device flies its own ship and sends where it is ~15×/sec.
- Every track comes from a seed, so all devices build the same tube, rocks and rings. New seed each race.
- Files: `art.js` (sky, ships, rocks, trails), `tube.js` (style A), `open.js` (style B), `game.js` (screens, HUD, online).

### 🛻 Monster Doodle (`games/draw-a-road/`)
Draw lines with your finger/mouse so the monster truck gets to the flag 🏁.
- 48 levels: gaps, hills, walls, trampolines, speed arrows, magic doors, no-engine and floaty zones, ski jumps, low bridges, zig zags and a grand finale
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
- 😊 Face / 👗 Clothes switch: zoom out to the whole girl and dress her (tops, bottoms, dresses, shoes and socks, bags, bracelets). A dress hides the top and bottoms; putting either back on takes the dress off.
- 👭 Play with friends (uses `js/engine/net.js`): make a room or join with 3 pictures. Everyone makes their own girl; your girl and one friend's girl show big side by side, others as small faces to tap. 🎉 Show off sends confetti to everyone. Friends' girls are checked by `sanitizeLook()` before drawing.
- Files: `items.js` (data), `draw.js` (SVG), `look.js` (state + actions), `gallery.js`, `online.js` (friends), `game.js` (screens).

### 💥 Tank Tantrum (`games/tank-tantrum/`)
Take turns to drive, aim and fire silly weapons. Last tank standing wins 🏆.
- Your turn (45 s): ◀ ▶ drive (fuel runs out), 🎒 pick a weapon, drag back from your tank like a slingshot, let go to fire.
- Keys: ← → drive, ↑ ↓ aim, hold Space for power, Q / E change weapon.
- 14 weapons: shell, rubber chicken (bounces), cupcake cluster, smelly sock (homing), mole missile (digs), grumpy cloud (rains 3 turns), custard wall, giant boot, whoopee blast (big push), shrink ray, magnet mine, teleport toilet, firework party, yo-yo bomb.
- 🌬️ Wind is OFF by default; switch it on in "Who's playing?" or the online room (host). When on it changes every turn. Crates drop with extra weapons or ❤️. Ground blows up, tanks fall, water = out.
- 📱 Play here: up to 4 tanks, each a person (pass the iPad) or 🤖 Easy / Tricky.
- 👫 Online: picture-code rooms, up to 6 tanks, host can add 🤖. After a game the next one starts by itself in 15 s with everyone still in the room (host: ▶ Play now or 👥 Room). 🏠 and 🚪 ask first, so nobody leaves by accident. Only shots are sent; every device runs the same game from the same seed (`sim.js` has no DOM, fixed time step, own random numbers, no trig). After each shot the shooter sends the tanks' state; anything out of step is nudged back.
- Maps: grass, snow, candy, moon (low gravity). Tank maker: name, colour, hat, flag (saved).
- 🎬 Replay when a tank is knocked out, and a victory dance.
- `?ttdebug` puts `window.__tt()` in the console.
- Ground art (`ground.js`): rock layers, roots, pebbles, and buried dinosaur skeletons, fossils and silly things per map. Looks only, made from the map seed so friends see the same.
- Zoomed out to the whole map by default (and again every turn). Pinch / mouse wheel zooms around your finger, 🗺️ switches between whole map and your tank.
- Files: `sim.js` (world + rules), `weapons.js`, `ai.js`, `render.js`, `ground.js`, `online.js`, `game.js` (screens + controls).

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
- Every 7–10 sec a digger 🚜, train 🚂 or car 🚗 floats up on balloons (meep meep / choo-choo / beep beep). Tap it: wheee, it drops, then drives off with its own noises (+3 stars)
- Fill 20 stars → fireworks party, then start again
- Big tap areas, palm slaps ignored
- Nothing floats in the bottom middle (Android app-switch bar). Balloons there pop in higher up instead
- Grown-ups: hold 🏠 for a second to exit (a quick tap does nothing)
