// Playing with friends. Uses the shared rooms in js/engine/net.js:
//   games/beautiful-bells/rooms/<code>/players/<pid> = { name, emoji, showoff }
//   games/beautiful-bells/rooms/<code>/live/<pid>    = { look, t }
// Everyone makes their own girl; friends' girls are shown live (watch only).
import { createRoom, joinRoom, CODE_PICS, codeToPics } from '../../js/engine/net.js';
import { ITEMS, HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS, SKINS, TOP_COLORS, GIRLS } from './items.js';
import { LOOK_VERSION, newLook } from './look.js';

export { CODE_PICS, codeToPics };
export const GAME_ID = 'beautiful-bells';
export const MAX_PLAYERS = 4;
const AVATARS = ['🦄', '🌸', '⭐', '🦋', '🌈', '🍓', '🐱', '🐰'];
const SEND_EVERY = 300; // ms

export const makeRoom = () => createRoom(GAME_ID, { v: LOOK_VERSION });
export const findRoom = code => joinRoom(GAME_ID, code);

// ---------- friends' data comes from other devices, so check every bit of it ----------
const has = (map, v) => typeof v === 'string' && Object.prototype.hasOwnProperty.call(map, v);
const list = v => Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : [];
const num = (v, lo, hi) => (typeof v === 'number' && isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v))) : null);
export const cleanName = n => String(n || '').replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 12) || 'Friend';
const slotOk = key => v => typeof v === 'string' && ITEMS[v] && ITEMS[v].key === key;
const valueOk = key => v => Object.values(ITEMS).some(it => it.key === key && it.value === v);

export function sanitizeLook(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const girl = GIRLS.find(g => g.id === raw.girl) || GIRLS[0];
  const out = newLook(girl);
  out.name = cleanName(raw.name);
  if (has(SKINS, raw.skin)) out.skin = raw.skin;
  if (has(HAIR_COLORS, raw.hairColor)) out.hairColor = raw.hairColor;
  if (has(HAIR_LENGTHS, raw.hairLength)) out.hairLength = raw.hairLength;
  if (has(EYE_COLORS, raw.eyeColor)) out.eyeColor = raw.eyeColor;
  if (has(TOP_COLORS, raw.topColor)) out.topColor = raw.topColor;
  for (const k of ['hairStyle', 'topStyle', 'topPattern']) if (valueOk(k)(raw[k])) out[k] = raw[k];
  for (const k of ['mascara', 'eyeliner', 'earrings', 'necklace', 'headwear', 'glasses', 'bottom', 'dress', 'socks', 'shoes', 'bag', 'bracelet']) out[k] = slotOk(k)(raw[k]) ? raw[k] : null;
  out.cut = num(raw.cut, 250, 600);
  out.freckles = raw.freckles === true;
  out.extensions = list(raw.extensions).filter(v => typeof v === 'string' && ITEMS['ext-' + v]).slice(0, 10);
  out.placed = list(raw.placed).slice(0, 40).map(p => {
    const item = p && ITEMS[p.item];
    if (!item || item.action !== 'place') return null;
    const key = String(p.key || '').replace(/[^a-z0-9]/g, '').slice(0, 20) || 'k';
    return { key, item: p.item, x: num(p.x, 0, 400) ?? 200, y: num(p.y, 0, 520) ?? 200 };
  }).filter(Boolean);
  let total = 0;
  out.paint = list(raw.paint).slice(-300).map(s => {
    const item = s && ITEMS[s.item];
    if (!item || item.action !== 'paint') return null;
    const pts = list(s.pts).slice(0, 2000).map(v => num(v, -50, 600)).filter(v => v !== null);
    if (pts.length % 2) pts.pop();
    if (!pts.length || (total += pts.length) > 14000) return null;
    return { item: s.item, layer: item.layer, pts };
  }).filter(Boolean);
  return out;
}

// ---------- a connected room ----------
export function connect(room, { onChange, onClosed, onShowOff }) {
  const pid = room.uid + '_0'; // database rules: player ids start with "<uid>_"
  const emoji = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  let players = {};
  let looks = {};
  let name = 'Friend';
  let showoff = 0;
  let pending = null, timer = null, lastSent = '';
  let metaSeen = false, closed = false;
  const seenShowoff = {};
  const unsubs = [];

  const emit = () => { if (!closed) onChange(); };
  unsubs.push(room.onPlayers(p => {
    players = p || {};
    for (const [id, info] of Object.entries(players)) {
      const t = info && typeof info.showoff === 'number' ? info.showoff : 0;
      if (id !== pid && seenShowoff[id] !== undefined && t > seenShowoff[id]) onShowOff(cleanName(info.name));
      seenShowoff[id] = t;
    }
    emit();
  }));
  unsubs.push(room.onLive(l => { looks = l || {}; emit(); }));
  // After a Wi-Fi dropout my girl is removed from the room, so send her again.
  let lastStatus = 'ok';
  if (room.onStatus) unsubs.push(room.onStatus(st => {
    if (st === 'ok' && lastStatus !== 'ok' && !closed) {
      lastSent = '';
      sendInfo();
      if (pending && !timer) timer = setTimeout(flush, 50);
    }
    lastStatus = st;
  }));
  unsubs.push(room.onMeta(m => {
    if (m) metaSeen = true;
    else if (metaSeen && !closed) { closed = true; onClosed(); }
  }));

  const sendInfo = () => room.setPlayer(pid, { name, emoji, showoff }).catch(() => {});
  const flush = () => {
    timer = null;
    if (!pending || closed || lastStatus !== 'ok') return; // resent when back online
    const s = JSON.stringify(pending);
    if (s === lastSent) return;
    lastSent = s;
    room.setLive(pid, { look: pending, t: room.now() }).catch(() => {});
  };

  return {
    code: room.code,
    pics: codeToPics(room.code),
    emoji,
    // Friends who have a girl to show (not me).
    friends() {
      return Object.entries(players)
        .filter(([id]) => id !== pid)
        .map(([id, info]) => ({
          id,
          name: cleanName(info && info.name),
          emoji: AVATARS.includes(info && info.emoji) ? info.emoji : '🙂',
          look: looks[id] && sanitizeLook(looks[id].look),
        }));
    },
    count: () => Object.keys(players).length,
    setName(n) { name = cleanName(n); sendInfo(); },
    publish(look) {
      pending = look;
      if (!timer) timer = setTimeout(flush, SEND_EVERY);
    },
    showOff() { showoff = room.now(); sendInfo(); },
    async leave() {
      closed = true;
      clearTimeout(timer);
      unsubs.forEach(u => { try { typeof u === 'function' && u(); } catch (e) { /* ignore */ } });
      await room.leave();
    },
  };
}
