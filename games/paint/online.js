// Drawing together. Uses the shared rooms in js/engine/net.js:
//   games/paint/rooms/<code>/meta          = { v, base, hostUid }  (host's picture when the room was made)
//   games/paint/rooms/<code>/players/<pid> = { emoji, name, face, ready }
//   games/paint/rooms/<code>/live/<pid>    = { here: 1, cur: <stroke being drawn>, <opId>: <op> ... }
// Everyone draws on the same page. Each device writes only its own strokes.
// When a friend leaves, their strokes would vanish with them, so the host
// copies them into its own area (everyone else keeps them in the meantime).
// Dropouts (iPad sleeps, wifi blips): when we're back online we write our whole
// area again in one go, with sync: 1. Only an area with sync counts as "here",
// so half-written areas never make anyone's strokes disappear. If a friend
// comes back, the host drops its copies so their undo works again.
import { cleanName, myFace, cleanFace } from '../../js/engine/profile.js';
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { playerInfo, people } from '../../js/engine/together.js';
import { sanitizeOp } from './ops.js';

export const GAME_ID = 'paint';
const AVATARS = ['🦄', '🐸', '🦁', '🐼', '🦊', '🐙', '🐝', '🐧'];
const CUR_EVERY = 120; // ms

const cleanBase = b => (typeof b === 'string' && /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(b) && b.length < 3e6 ? b : null);

export const makeRoom = (base, hostUid) => createRoom(GAME_ID, { v: 1, base: base || '', hostUid: hostUid || '' });
export const findRoom = code => joinRoom(GAME_ID, code);

export function connect(room, { onChange, onBase, onClosed }) {
  const pid = room.uid + '_0'; // database rules: player ids start with "<uid>_"
  const emoji = myFace() || AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const myIds = new Set();     // ids of strokes I ever made (never shown as a friend's)
  const myOps = new Map();     // id -> op, the ones still on the page (sent again after a dropout)
  const others = new Map();    // id -> { op, owner }
  const adoptedFrom = new Map(); // host only: id -> friend who left (I keep a copy)
  let cursors = {};            // pid -> op being drawn right now
  let players = {};
  let metaSeen = false, closed = false;
  let hostUid = room.isHost ? room.uid : '';
  let curPending, curTimer = null;
  const unsubs = [];
  const emit = () => { if (!closed) onChange(); };

  room.setPlayer(pid, { emoji, ...playerInfo(true) }).catch(() => {});

  // My whole area in one write: on joining and every time we're back online.
  const writeAll = () => {
    if (closed) return;
    const all = { here: 1, sync: 1 };
    for (const [id, op] of myOps) all[id] = op;
    for (const id of adoptedFrom.keys()) { const o = others.get(id); if (o) all[id] = o.op; }
    room.setLive(pid, all).catch(() => {});
  };
  let lastStatus = null;
  const onStatus = st => {
    if (st === 'ok' && lastStatus !== 'ok') writeAll();
    lastStatus = st;
  };
  if (room.onStatus) unsubs.push(room.onStatus(onStatus));
  else onStatus('ok');

  unsubs.push(room.onPlayers(p => { players = p || {}; emit(); }));
  unsubs.push(room.onMeta(m => {
    if (m && m.hostUid && m.hostUid !== hostUid) { hostUid = m.hostUid; emit(); }
    if (m && !metaSeen) {
      metaSeen = true;
      if (!room.isHost) onBase(cleanBase(m.base));
    } else if (!m && metaSeen && !closed) {
      closed = true;
      onClosed();
    }
  }));
  unsubs.push(room.onLive(live => {
    live = live || {};
    const here = o => !!(live[o] && live[o].sync);
    const seen = new Set();
    const next = {};
    for (const [owner, node] of Object.entries(live)) {
      if (!node || typeof node !== 'object') continue;
      for (const [key, raw] of Object.entries(node)) {
        if (key === 'here' || key === 'sync') continue;
        if (key === 'cur') {
          if (owner !== pid) { const op = sanitizeOp(raw); if (op) next[owner] = op; }
          continue;
        }
        if (myIds.has(key)) continue;
        seen.add(key);
        if (owner !== pid && adoptedFrom.has(key)) {   // they're back: drop my copy
          adoptedFrom.delete(key);
          room.setLiveItem(pid, key, null).catch(() => {});
        }
        const known = others.get(key);
        if (known) { if (owner !== pid || !known.owner) known.owner = owner; continue; }
        const op = sanitizeOp(raw);
        if (op && op.id === key) others.set(key, { op, owner });
      }
    }
    cursors = next;
    for (const [id, o] of others) {
      const from = adoptedFrom.get(id);
      if (from && here(from) && !(id in live[from])) {  // back, and pressed undo meanwhile
        adoptedFrom.delete(id);
        others.delete(id);
        room.setLiveItem(pid, id, null).catch(() => {});
        continue;
      }
      if (seen.has(id)) continue;
      if (o.owner !== pid && here(o.owner)) others.delete(id); // they pressed undo
      else if (room.isHost && o.owner !== pid) {        // they left: keep their picture
        adoptedFrom.set(id, o.owner);
        o.owner = pid;
        room.setLiveItem(pid, id, o.op).catch(() => {});
      } else if (room.isHost && adoptedFrom.has(id)) {  // my copy got lost in a dropout
        room.setLiveItem(pid, id, o.op).catch(() => {});
      }
    }
    emit();
  }));

  const sendCur = () => {
    curTimer = null;
    if (!closed) room.setLiveItem(pid, 'cur', curPending).catch(() => {});
  };

  return {
    code: room.code,
    uid: room.uid,
    // [{ uid, name, face, ... }] for the shared lobby strip
    people: () => people(players, hostUid),
    isHost: room.isHost,
    emoji,
    now: room.now,
    ops: () => [...others.values()].map(o => o.op),
    cursors: () => Object.entries(cursors).map(([id, op]) => ({ op, emoji: emojiOf(id), name: nameOf(id) })),
    players: () => Object.keys(players).map(id => ({ me: id === pid, emoji: emojiOf(id), name: nameOf(id) })),
    add(op) {
      myIds.add(op.id);
      myOps.set(op.id, op);
      room.setLiveItem(pid, op.id, op).catch(() => {});
    },
    remove(id) {
      myOps.delete(id);
      room.setLiveItem(pid, id, null).catch(() => {});
    },
    // The stroke being drawn (or null), so friends see it as it happens.
    setCur(op) {
      curPending = op ? { ...op, p: op.p.slice(-800) } : null;
      if (!op) { clearTimeout(curTimer); sendCur(); return; }
      if (!curTimer) curTimer = setTimeout(sendCur, CUR_EVERY);
    },
    async leave() {
      closed = true;
      clearTimeout(curTimer);
      unsubs.forEach(u => { try { typeof u === 'function' && u(); } catch (e) { /* ignore */ } });
      await room.leave();
    },
  };

  function nameOf(id) { return cleanName(players[id] && players[id].name); }
  function emojiOf(id) {
    const p = players[id] || {};
    return cleanFace(p.face) || (AVATARS.includes(p.emoji) ? p.emoji : '🙂');
  }
}
