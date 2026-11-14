// Drawing together. Uses the shared rooms in js/engine/net.js:
//   games/paint/rooms/<code>/meta          = { v, base }  (host's picture when the room was made)
//   games/paint/rooms/<code>/players/<pid> = { emoji }
//   games/paint/rooms/<code>/live/<pid>    = { here: 1, cur: <stroke being drawn>, <opId>: <op> ... }
// Everyone draws on the same page. Each device writes only its own strokes.
// When a friend leaves, their strokes would vanish with them, so the host
// copies them into its own area (everyone else keeps them in the meantime).
import { createRoom, joinRoom, CODE_PICS, codeToPics } from '../../js/engine/net.js';
import { sanitizeOp } from './ops.js';

export { CODE_PICS };
export const GAME_ID = 'paint';
const AVATARS = ['🦄', '🐸', '🦁', '🐼', '🦊', '🐙', '🐝', '🐧'];
const CUR_EVERY = 120; // ms

const cleanBase = b => (typeof b === 'string' && /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(b) && b.length < 3e6 ? b : null);

export const makeRoom = base => createRoom(GAME_ID, { v: 1, base: base || '' });
export const findRoom = code => joinRoom(GAME_ID, code);

export function connect(room, { onChange, onBase, onClosed }) {
  const pid = room.uid + '_0'; // database rules: player ids start with "<uid>_"
  const emoji = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  const mine = new Set();      // ids of strokes I made (the game keeps those)
  const others = new Map();    // id -> { op, owner }
  let cursors = {};            // pid -> op being drawn right now
  let players = {};
  let metaSeen = false, closed = false;
  let curPending, curTimer = null;
  const unsubs = [];
  const emit = () => { if (!closed) onChange(); };

  room.setPlayer(pid, { emoji }).catch(() => {});
  room.setLiveItem(pid, 'here', 1).catch(() => {});

  unsubs.push(room.onPlayers(p => { players = p || {}; emit(); }));
  unsubs.push(room.onMeta(m => {
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
    const seen = new Set();
    const next = {};
    for (const [owner, node] of Object.entries(live)) {
      if (!node || typeof node !== 'object') continue;
      for (const [key, raw] of Object.entries(node)) {
        if (key === 'here') continue;
        if (key === 'cur') {
          if (owner !== pid) { const op = sanitizeOp(raw); if (op) next[owner] = op; }
          continue;
        }
        if (mine.has(key)) continue;
        seen.add(key);
        const known = others.get(key);
        if (known) { known.owner = owner; continue; }
        const op = sanitizeOp(raw);
        if (op && op.id === key) others.set(key, { op, owner });
      }
    }
    cursors = next;
    for (const [id, o] of others) {
      if (seen.has(id)) continue;
      if (live[o.owner]) others.delete(id);         // they pressed undo
      else if (room.isHost) {                        // they left: keep their picture
        o.owner = pid;
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
    pics: codeToPics(room.code),
    isHost: room.isHost,
    emoji,
    now: room.now,
    ops: () => [...others.values()].map(o => o.op),
    cursors: () => Object.entries(cursors).map(([id, op]) => ({ op, emoji: emojiOf(id) })),
    players: () => Object.keys(players).map(id => ({ me: id === pid, emoji: emojiOf(id) })),
    add(op) {
      mine.add(op.id);
      room.setLiveItem(pid, op.id, op).catch(() => {});
    },
    remove(id) { room.setLiveItem(pid, id, null).catch(() => {}); },
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

  function emojiOf(id) {
    const e = players[id] && players[id].emoji;
    return AVATARS.includes(e) ? e : '🙂';
  }
}
