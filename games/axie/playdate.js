// Axie Pals – playdates: friends' axolotls come and swim in your tank.
// Uses the shared rooms in js/engine/net.js:
//   games/axie/rooms/<code>/meta          = { v, hostUid, tank: { placed: { id: fx*1000 } } }   (host only)
//   games/axie/rooms/<code>/players/<pid> = { name, face, ready, pet: { name, colour, age, wear } }
//   games/axie/rooms/<code>/live/<pid>    = { p: [fx, fy, dir, face], ev: [...last events], t }
// Each device moves its own axolotl. Taps that others should see (food, bubbles, tickles,
// bubble pop) go as small numbered events in live/<pid>.ev. Every bit from friends is checked.
import { createRoom, joinRoom } from '../../js/engine/net.js';
import { playerInfo, playTogether, joined, leftRoom } from '../../js/engine/together.js';
import { cleanName, cleanFace } from '../../js/engine/profile.js';
import { COLOURS, FOODS, ITEMS, PATTERNS } from './items.js';

export const GAME_ID = 'axie';
const SEND_EVERY = 140; // ms
export const FACES = ['ok', 'joy', 'hungry', 'sleepy', 'sleep', 'sick', 'sad', 'giggle', 'eat', 'yuck', 'wow'];
const KEEP_EVENTS = 10;

const num = (v, lo, hi, d = lo) => (typeof v === 'number' && isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d);
const str = (v, re, max = 40) => (typeof v === 'string' && v.length <= max && re.test(v) ? v : null);
const petName = n => String(n || '').replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 12) || 'Axie';

function cleanPet(raw) {
  const p = raw && typeof raw === 'object' ? raw : {};
  const wear = {};
  const w = p.wear && typeof p.wear === 'object' ? p.wear : {};
  for (const slot of ['hat', 'face', 'neck', 'back']) {
    const id = w[slot];
    if (typeof id === 'string' && ITEMS[id] && ITEMS[id].kind === 'wear' && ITEMS[id].slot === slot) wear[slot] = id;
  }
  return {
    name: petName(p.name),
    colour: COLOURS.some(c => c.id === p.colour) ? p.colour : 'pink',
    age: Math.round(num(p.age, 0, 99, 0)),
    wear,
    pattern: typeof p.pattern === 'string' && PATTERNS[p.pattern] ? p.pattern : null,
  };
}

function cleanEvent(e) {
  if (!e || typeof e !== 'object') return null;
  const n = num(e.n, 0, 1e9, -1);
  if (n < 0) return null;
  switch (e.k) {
    case 'food': {
      const f = FOODS.find(x => x.id === e.f);
      const id = str(e.id, /^[\w-]+$/);
      return f && id ? { n, k: 'food', f: f.id, id, fx: num(e.fx, 0, 1, 0.5) } : null;
    }
    case 'ate': { const id = str(e.id, /^[\w-]+$/); return id ? { n, k: 'ate', id } : null; }
    case 'bub': return { n, k: 'bub', fx: num(e.fx, 0, 1, 0.5), fy: num(e.fy, 0, 1, 0.5) };
    case 'tickle': { const to = str(e.to, /^[\w-]+$/, 80); return to ? { n, k: 'tickle', to } : null; }
    case 'game': return { n, k: 'game' };
    default: return null;
  }
}

function cleanTank(raw) {
  const out = {};
  const pl = raw && raw.placed && typeof raw.placed === 'object' ? raw.placed : {};
  for (const [id, v] of Object.entries(pl).slice(0, 40)) {
    const it = ITEMS[id];
    if (it && (it.kind === 'decor' || it.kind === 'float')) out[id] = { fx: num(v, 0, 1000, 500) / 1000 };
  }
  return out;
}

// Start a playdate: pick friends, make a room, invite them. Returns the room or null.
export const hostPlaydate = tank => playTogether(GAME_ID, async () => {
  const r = await createRoom(GAME_ID, { v: 1, tank });
  await r.setMeta({ hostUid: r.uid }).catch(() => {});
  return r;
});

// Opened from a friend's invite.
export async function joinPlaydate(code) {
  const r = await joinRoom(GAME_ID, code);
  if (r) joined(GAME_ID, code);
  return r;
}

// A connected playdate.
// petInfo() -> { name, colour, age, wear }. onEvent(pid, ev). onChange(). onClosed().
export function connect(room, { petInfo, onEvent, onChange, onClosed }) {
  const pid = room.uid + '_0';
  let players = {}, live = {}, tank = {};
  let hostUid = room.isHost ? room.uid : '';
  let closed = false, metaSeen = false, status = 'ok';
  const seen = {};                 // pid -> last event number handled
  let events = [], seq = 1, pos = null, timer = null, lastInfo = '';
  const unsubs = [];

  const sendInfo = () => {
    const data = { ...playerInfo(true), pet: petInfo() };
    const s = JSON.stringify(data);
    if (s === lastInfo) return;
    lastInfo = s;
    room.setPlayer(pid, data).catch(() => {});
  };
  const flush = () => {
    timer = null;
    if (closed || status !== 'ok' || !pos) return;
    room.setLive(pid, { p: pos, ev: events, t: room.now() }).catch(() => {});
  };
  const later = () => { if (!timer) timer = setTimeout(flush, SEND_EVERY); };

  unsubs.push(room.onPlayers(p => { players = p || {}; onChange(); }));
  unsubs.push(room.onLive(l => {
    live = l || {};
    for (const [id, d] of Object.entries(live)) {
      if (id === pid || !d || !Array.isArray(d.ev)) continue;
      const first = seen[id] === undefined;
      let top = seen[id] ?? 0;
      for (const raw of d.ev.slice(-KEEP_EVENTS)) {
        const e = cleanEvent(raw);
        if (!e || e.n <= (seen[id] ?? 0)) continue;
        top = Math.max(top, e.n);
        if (!first) onEvent(id, e);   // don't replay old taps from before we came in
      }
      seen[id] = top;
    }
    onChange();
  }));
  unsubs.push(room.onMeta(m => {
    if (m) {
      metaSeen = true;
      if (m.hostUid) hostUid = String(m.hostUid);
      tank = cleanTank(m.tank);
      onChange();
    } else if (metaSeen && !closed) { closed = true; onClosed(); }
  }));
  if (room.onStatus) unsubs.push(room.onStatus(st => {
    if (st === 'ok' && status !== 'ok' && !closed) { lastInfo = ''; sendInfo(); later(); }
    status = st;
  }));
  sendInfo();

  return {
    pid, uid: room.uid, isHost: room.isHost, code: room.code,
    // Everyone else here: [{ pid, who, face, pet, pos: { fx, fy, dir, face } | null, host }]
    mates() {
      return Object.entries(players).filter(([id, p]) => id !== pid && p).slice(0, 6).map(([id, p]) => {
        const l = live[id];
        const a = l && Array.isArray(l.p) ? l.p : null;
        return {
          pid: id,
          who: cleanName(p.name) || 'Friend',
          face: cleanFace(p.face) || '🙂',
          pet: cleanPet(p.pet),
          host: id.split('_')[0] === hostUid,
          pos: a ? { fx: num(a[0], 0, 1, 0.5), fy: num(a[1], 0, 1, 0.5), dir: a[2] === -1 ? -1 : 1, face: FACES[Math.round(num(a[3], 0, FACES.length - 1, 0))] } : null,
        };
      });
    },
    hostName() {
      const h = Object.entries(players).find(([id]) => id.split('_')[0] === hostUid);
      return h ? cleanName(h[1].name) || 'Friend' : 'Friend';
    },
    tank: () => tank,
    setTank(t) { if (room.isHost && !closed) room.setMeta({ tank: t }).catch(() => {}); },
    setPos(fx, fy, dir, face) {
      pos = [Math.round(fx * 1000) / 1000, Math.round(fy * 1000) / 1000, dir, Math.max(0, FACES.indexOf(face))];
      later();
    },
    send(ev) {
      events.push({ ...ev, n: seq++ });
      if (events.length > KEEP_EVENTS) events = events.slice(-KEEP_EVENTS);
      later();
    },
    updateInfo: sendInfo,
    async leave() {
      closed = true;
      clearTimeout(timer);
      unsubs.forEach(u => { try { typeof u === 'function' && u(); } catch (e) { /* ignore */ } });
      leftRoom();
      await room.leave().catch(() => {});
    },
  };
}
