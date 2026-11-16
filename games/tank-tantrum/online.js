// Playing with friends. Uses the shared rooms in js/engine/net.js:
//   meta (host only)   = { v, hostPid, phase: 'lobby'|'play', map, bots: [{ level, look }],
//                          game: { id, seed, map, roster: [{ pid } | { bot: level, look }] } }
//   players/<pid>      = { look, name, face, ready }   (name/face/ready: js/engine/together.js)
//   live/<pid>         = { g: game id, d: <driving/aiming now>, s<turn>: <shot>, a<turn>: <tanks after> }
// Every device runs the same game from the same seed. Only shots are sent.
// Computer tanks belong to the host, so the host sends their shots.
// If someone drops out on their turn, the host sends { skip: 1 } for them.
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { playerInfo } from '../../js/engine/together.js';
import { sanitizeLook } from './render.js';
import { WEAPON } from './weapons.js';
import { MAPS, MAX_SPEED, W, H } from './sim.js';

export const GAME_ID = 'tank-tantrum';
const DRIVE_EVERY = 110; // ms

export const makeRoom = () => createRoom(GAME_ID, { v: 1, phase: 'lobby', map: 'random', bots: [] });
export const findRoom = code => joinRoom(GAME_ID, code);

const num = (v, lo, hi) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : null);

export function cleanShot(s) {
  if (!s || typeof s !== 'object') return null;
  if (s.skip) return { skip: 1 };
  const x = num(s.x, 0, W), y = num(s.y, 0, H), vx = num(s.vx, -MAX_SPEED, MAX_SPEED), vy = num(s.vy, -MAX_SPEED, MAX_SPEED);
  if (x === null || y === null || vx === null || vy === null) return null;
  const picked = Array.isArray(s.picked) ? s.picked.filter(n => Number.isInteger(n)).slice(0, 10) : [];
  return { x, y, f: s.f < 0 ? -1 : 1, w: WEAPON[s.w] ? s.w : 'shell', vx, vy, picked };
}
function cleanDrive(d) {
  if (!d || typeof d !== 'object') return null;
  const x = num(d.x, 0, W), y = num(d.y, 0, H);
  if (x === null || y === null || !Number.isInteger(d.n)) return null;
  return { n: d.n, x, y, f: d.f < 0 ? -1 : 1, ax: num(d.ax, -1, 1) ?? 1, ay: num(d.ay, -1, 1) ?? -1, p: num(d.p, 0, 1) ?? 0, w: WEAPON[d.w] ? d.w : 'shell' };
}

export function connect(room, look, { onChange, onClosed }) {
  const pid = room.uid + '_0';   // database rules: player ids start with "<uid>_"
  let players = {}, live = {}, meta = null;
  let metaSeen = false, closed = false, gameId = null;
  let myLook = sanitizeLook(look), myReady = false;
  const writeMe = () => room.setPlayer(pid, { look: myLook, ...playerInfo(myReady) }).catch(() => {});
  let driveTimer = null, drivePending = null, lastDrive = 0;
  const unsubs = [];
  const emit = () => { if (!closed) onChange(); };

  writeMe();
  if (room.isHost) room.setMeta({ hostPid: pid }).catch(() => {});

  unsubs.push(room.onPlayers(p => { players = p || {}; emit(); }));
  unsubs.push(room.onLive(l => { live = l || {}; emit(); }));
  unsubs.push(room.onMeta(m => {
    if (m) { metaSeen = true; meta = m; emit(); }
    else if (metaSeen && !closed) { closed = true; onClosed(); }
  }));
  // After a dropout our live area is gone: put the game id back.
  let lastStatus = null;
  if (room.onStatus) unsubs.push(room.onStatus(st => {
    if (st === 'ok' && lastStatus && lastStatus !== 'ok' && gameId) room.setLiveItem(pid, 'g', gameId).catch(() => {});
    lastStatus = st;
  }));

  const area = p => (live[p] && typeof live[p] === 'object' ? live[p] : null);
  const hostPid = () => (meta && typeof meta.hostPid === 'string' ? meta.hostPid : null);

  const sendDrive = () => {
    driveTimer = null; lastDrive = Date.now();
    if (!closed && drivePending) room.setLiveItem(pid, 'd', drivePending).catch(() => {});
  };

  return {
    pid,
    uid: room.uid,
    code: room.code,
    isHost: room.isHost,
    meta: () => meta,
    hostPid,
    players: () => Object.entries(players).map(([id, p]) => ({ pid: id, me: id === pid, look: sanitizeLook(p && p.look) })),
    rawPlayers: () => players,
    hasPlayer: id => !!players[id],
    setLook(l) { myLook = sanitizeLook(l); writeMe(); },
    ready: () => myReady,
    setReady(r) { if (myReady === !!r) return; myReady = !!r; writeMe(); },
    // host
    setLobby(data) { if (room.isHost) room.setMeta(data).catch(() => {}); },
    startGame(game) { if (room.isHost) room.setMeta({ phase: 'play', game }).catch(() => {}); },
    // every device, at the start of each game
    joinGame(id) { gameId = id; room.setLive(pid, { g: id }).catch(() => {}); },
    sendShot(n, shot) { room.setLiveItem(pid, 's' + n, { g: gameId, ...shot }).catch(() => {}); },
    sendAfter(n, state) { room.setLiveItem(pid, 'a' + n, { g: gameId, t: state }).catch(() => {}); },
    sendDrive(d) {
      drivePending = { ...d, g: gameId };
      if (driveTimer) return;
      driveTimer = setTimeout(sendDrive, Math.max(0, DRIVE_EVERY - (Date.now() - lastDrive)));
    },
    // The shot for turn n by owner (or the host's skip for them).
    shot(n, owner) {
      for (const p of [owner, hostPid()]) {
        const a = p && area(p);
        const s = a && a['s' + n];
        if (s && s.g === gameId) { const c = cleanShot(s); if (c) return c; }
      }
      return null;
    },
    after(n, owner) {
      const a = owner && area(owner);
      const s = a && a['a' + n];
      return s && s.g === gameId && Array.isArray(s.t) ? s.t : null;
    },
    drive(owner) {
      const a = owner && area(owner);
      const d = a && a.d;
      return d && d.g === gameId ? cleanDrive(d) : null;
    },
    async leave() {
      closed = true;
      clearTimeout(driveTimer);
      unsubs.forEach(u => { try { typeof u === 'function' && u(); } catch (e) { /* ignore */ } });
      await room.leave();
    },
  };
}

export const MAP_IDS = Object.keys(MAPS);
