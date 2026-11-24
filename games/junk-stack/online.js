// Junk Stack – racing friends. Uses the shared rooms in js/engine/net.js:
//   meta (host only) = { v, hostPid, phase: 'lobby'|'race', race: { id, seed, start, dur } }
//   players/<pid>    = { name, face, ready }            (js/engine/together.js)
//   live/<pid>       = { id: race id, b: [type, x, y, angle, sx, sy, ...], h: best height, out: 1 if splashed, f: final }
// Everyone stacks their own tower with the same junk (same seed). Only tower snapshots are sent,
// a few times a second, so friends can watch each other's towers grow.
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { playerInfo, people } from '../../js/engine/together.js';
import { ITEMS } from './items.js';

export const GAME_ID = 'junk-stack';
export const TYPES = Object.keys(ITEMS);
export const RACE_SECONDS = 180;
const SEND_EVERY = 250; // ms
const MAX_ITEMS = 80;

export const makeRoom = () => createRoom(GAME_ID, { v: 2, phase: 'lobby' });
export const findRoom = code => joinRoom(GAME_ID, code);

const num = (v, lo, hi) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : null);

// tower snapshot from a friend -> [{ type, x, y, a, sc }]
export function cleanTower(b) {
  if (!Array.isArray(b)) return [];
  const out = [];
  for (let i = 0; i + 5 < b.length && out.length < MAX_ITEMS; i += 6) {
    const type = TYPES[b[i]];
    const x = num(b[i + 1], -40, 40), y = num(b[i + 2], -20, 500), a = num(b[i + 3], -1000, 1000);
    const sx = num(b[i + 4], 0.3, 2), sy = num(b[i + 5], 0.3, 2);
    if (type && x !== null && y !== null && a !== null && sx && sy) out.push({ type, x, y, a, sc: { x: sx, y: sy } });
  }
  return out;
}

export function connect(room, { onChange, onClosed }) {
  const pid = room.uid + '_0';   // database rules: player ids start with "<uid>_"
  let players = {}, live = {}, meta = null;
  let metaSeen = false, closed = false, ready = false;
  const unsubs = [];
  const emit = () => { if (!closed) onChange(); };
  const writeMe = () => room.setPlayer(pid, playerInfo(ready)).catch(() => {});

  writeMe();
  if (room.isHost) room.setMeta({ hostPid: pid }).catch(() => {});
  unsubs.push(room.onPlayers(p => { players = p || {}; emit(); }));
  unsubs.push(room.onLive(l => { live = l || {}; emit(); }));
  unsubs.push(room.onMeta(m => {
    if (m) { metaSeen = true; meta = m; emit(); }
    else if (metaSeen && !closed) { closed = true; onClosed(); }
  }));

  let sendTimer = null, pending = null, lastSend = 0;
  const flush = () => {
    sendTimer = null; lastSend = Date.now();
    if (!closed && pending) room.setLive(pid, pending).catch(() => {});
  };

  return {
    pid,
    uid: room.uid,
    code: room.code,
    isHost: room.isHost,
    now: () => room.now(),
    meta: () => meta,
    ready: () => ready,
    setReady(r) { ready = !!r; writeMe(); },
    people() {
      const hostUid = meta && typeof meta.hostPid === 'string' ? meta.hostPid.split('_')[0] : (room.isHost ? room.uid : null);
      return people(players, hostUid);
    },
    // everyone else's tower in this race
    towers(raceId) {
      return this.people().filter(p => p.pid !== pid).map(p => {
        const l = live[p.pid];
        const ok = l && typeof l === 'object' && l.id === raceId;
        return {
          ...p,
          items: ok ? cleanTower(l.b) : [],
          h: ok ? num(l.h, 0, 500) || 0 : 0,
          out: ok && !!l.out,
          f: ok && Number.isFinite(l.f) ? num(l.f, 0, 500) : null,
        };
      });
    },
    // send my tower (a few times a second, or now)
    sendTower(raceId, bodies, h, { out = false, f = null, now = false } = {}) {
      const b = [];
      bodies.slice(0, MAX_ITEMS).forEach(it => {
        const p = it.body.getPosition();
        b.push(TYPES.indexOf(it.type), +p.x.toFixed(2), +p.y.toFixed(2), +it.body.getAngle().toFixed(2), it.sc.x, it.sc.y);
      });
      pending = { id: raceId, b, h: +h.toFixed(2) };
      if (out) pending.out = 1;
      if (f !== null) pending.f = +f.toFixed(2);
      if (now) { clearTimeout(sendTimer); flush(); return; }
      if (!sendTimer) sendTimer = setTimeout(flush, Math.max(0, SEND_EVERY - (Date.now() - lastSend)));
    },
    startRace() {
      if (!room.isHost) return;
      const race = { id: Math.random().toString(36).slice(2, 8), seed: Math.floor(Math.random() * 1e9), start: room.now() + 4000, dur: RACE_SECONDS * 1000 };
      room.setMeta({ phase: 'race', race }).catch(() => {});
      ready = false; writeMe();
    },
    backToLobby() {
      if (room.isHost) room.setMeta({ phase: 'lobby' }).catch(() => {});
      ready = false; writeMe();
    },
    async leave() {
      closed = true;
      clearTimeout(sendTimer);
      unsubs.forEach(u => u());
      await room.leave().catch(() => {});
    },
  };
}
