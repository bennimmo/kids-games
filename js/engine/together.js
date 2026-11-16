// Play together: ONE way to play with friends, the same in every game.
//
//  1. Friends link up once on the menu (picture code, friends.js).
//  2. In a game, the big "Play with friends" button (togetherButton) -> playTogether():
//     not linked yet -> the friends panel opens; linked -> the game makes a room and
//     every friend gets a pop-up "Kit wants to play Kit's Karts" (friends-ui.js).
//  3. Tapping ✔ opens that game with #/<game>?join=<code>; the game calls takeJoinCode()
//     on start and joins straight away. No codes to type in games.
//  4. Lobby: every player entry carries { name, face, ready } (playerInfo()).
//     lobbyHTML() shows who's here and what they're doing; joiners get waitHTML()
//     ("Kit is building the track…") and a big I'm ready button; the host's start
//     button stays locked (startLabel/allReady) until every friend is ready.

import { icon } from './icons.js';
import { myName, myFace, nameHTML, cleanFace, cleanName } from './profile.js';
import { friendState, onFriends, sendInvite, clearInvite, setPlaying, ensureCore } from './friends.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, '');
const faceOf = p => cleanFace(p && p.face) || '🙂';
const nameOf = p => cleanName(p && p.name) || 'Friend';

// ------------------------------------------------------------ start / join

// The big green button. Same look everywhere (css/style.css .tg-btn).
export function togetherButton(label = 'Play with friends', cls = '') {
  return `<button class="tg-btn${cls ? ' ' + cls : ''}" data-together>${icon('people')}<span>${esc(label)}</span></button>`;
}

// Tap on the button. create() makes the room (createRoom(...)) and returns it.
// Returns the room, or null if the friends panel opened instead.
export async function playTogether(game, create) {
  if (!friendState().inGroup) { openFriends(); return null; }
  const room = await create();
  if (!room) return null;
  hosting(game, room.code);
  return room;
}

// Already have a room (e.g. made it another way): tell friends about it.
export function hosting(game, code) {
  setPlaying(game, code);
  sendInvite(game, code);
}

// Opened from an invite? Returns the room code once (and tidies the address bar).
export function takeJoinCode(game) {
  const m = location.hash.match(/^#\/?([^?]+)\?join=([0-9a-f]+)/i);
  if (!m || m[1] !== game) return null;
  history.replaceState(null, '', '#/' + game);
  return m[2].toLowerCase();
}
export function joined(game, code) { setPlaying(game, code); }

// Left the room (or the game): stop inviting.
export function leftRoom() { setPlaying(null); clearInvite(); }

export function openFriends() { window.dispatchEvent(new CustomEvent('kg-open-friends')); }
export const inFriendGroup = () => friendState().inGroup;

// ------------------------------------------------------------ lobby

// Put this in every player entry you write with room.setPlayer().
export const playerInfo = (ready = false) => ({ name: myName(), face: myFace(), ready: !!ready });

// players: room.onPlayers() value ({ pid: data }). Returns one entry per device
// (pids are '<uid>_<n>'), first entry wins: [{ uid, pid, name, face, ready, host }]
export function people(players, hostUid) {
  const seen = new Map();
  for (const [pid, p] of Object.entries(players || {})) {
    if (!p) continue;
    const uid = pid.split('_')[0];
    if (seen.has(uid)) continue;
    seen.set(uid, { uid, pid, name: nameOf(p), face: faceOf(p), ready: !!p.ready, host: uid === hostUid });
  }
  return [...seen.values()].sort((a, b) => (b.host - a.host));
}

// Friends in my group who said "no thanks" to this room's invite.
export function saidNo(list = []) {
  const s = friendState();
  const here = new Set(list.map(p => p.uid));
  const code = s.playing && s.playing.code;
  const no = new Set(s.declines.filter(d => d.code === code).map(d => d.uid));
  return s.friends.filter(f => no.has(f.uid) && !here.has(f.uid));
}
// Friends in my group who haven't come into the room yet (and haven't said no).
export function coming(list) {
  const here = new Set(list.map(p => p.uid));
  const no = new Set(saidNo(list).map(f => f.uid));
  return friendState().friends.filter(f => f.status === 'on' && !here.has(f.uid) && !no.has(f.uid));
}

// Everyone (except the host) has pressed I'm ready.
export const allReady = list => list.every(p => p.host || p.ready);
export const notReady = list => list.filter(p => !p.host && !p.ready);

// Label for the host's start button: '' if everyone's ready, else 'Waiting for Kit…'
export function startLabel(list) {
  const w = notReady(list);
  if (!w.length) return list.length > 1 ? '' : 'Waiting for friends…';
  return `Waiting for ${w.map(p => nameHTML(p.name)).join(' & ')}…`;
}

// The strip of people. hostDoing: what the host is busy with, e.g. 'building the track'.
// myUid marks me. Shows friends still on their way too.
// Strips on screen are redrawn when friends change (someone says no / comes online),
// so games don't have to listen for that themselves.
const strips = new Map();
let stripN = 0;
onFriends(() => {
  for (const [id, args] of strips) {
    const el = document.querySelector(`.tg-strip[data-tg="${id}"]`);
    if (!el) { strips.delete(id); continue; }
    const t = document.createElement('div');
    t.innerHTML = stripHTML(...args, id);
    el.replaceWith(t.firstChild);
  }
});

export function lobbyHTML(list, opts = {}) {
  const id = ++stripN;
  strips.set(id, [list, opts]);
  if (strips.size > 20) strips.delete(strips.keys().next().value);
  return stripHTML(list, opts, id);
}

function stripHTML(list, { hostDoing = 'getting ready', myUid = null, showComing = true } = {}, id = 0) {
  const chip = (face, name, status, cls) =>
    `<div class="tg-p ${cls}"><span class="tg-face">${face}</span><span class="tg-txt"><b>${nameHTML(name)}</b><small>${status}</small></span></div>`;
  const rows = list.map(p => {
    const me = p.uid === myUid ? ' me' : '';
    if (p.host) return chip(p.face, p.name, esc(hostDoing), 'host' + me);
    return p.ready ? chip(p.face, p.name, `${icon('check')} Ready!`, 'ready' + me) : chip(p.face, p.name, 'getting ready…', 'busy' + me);
  });
  if (showComing) {
    for (const f of coming(list)) rows.push(chip(cleanFace(f.face) || '🙂', f.name, 'on the way…', 'coming'));
    for (const f of saidNo(list)) rows.push(chip(cleanFace(f.face) || '🙂', f.name, `${icon('close')} not this time`, 'said-no'));
  }
  return `<div class="tg-strip" data-tg="${id}">${rows.join('')}</div>`;
}

// For joiners: big "Kit is building the track…" + the I'm ready button.
export function waitHTML(host, doing, ready) {
  return `<div class="tg-wait">
    <div class="tg-wait-who"><span class="tg-face big">${host ? host.face : '🙂'}</span>
      <div><b>${host ? nameHTML(host.name) : 'Your friend'}</b> is ${esc(doing)}…</div></div>
    ${readyButton(ready)}
  </div>`;
}
export function readyButton(ready) {
  return ready
    ? `<button class="tg-ready on" data-ready>${icon('check')}<span>Ready!</span></button>`
    : `<button class="tg-ready" data-ready><span>I'm ready!</span>${icon('check')}</button>`;
}

// Make sure the Firebase uid exists before a game needs it.
export const warmUp = () => ensureCore().catch(() => {});
