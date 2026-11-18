// Friends: link up with up to MAX_FRIENDS other devices. The link stays on across every game.
//
// Firebase is only used so devices can find each other (inside the normal rooms rules):
//   games/friends/rooms/<code>   my friend code (6 hex = 6 pictures), new on every visit to the menu
//       host, meta: { name, ok/<pid>: <group>, no/<pid>, full/<pid> }   (written by me)
//       players/<uid>_k: { name }                                       (a friend knocking)
//   games/friends/rooms/h<uid>  my home: always there while the app is open, so saved friends can call me
//       host, meta: { name, face, on, game, at, invite? }  (on = app open; game = what I'm playing;
//             invite = { game, code, at }: "come and play my game", seen by every friend, see together.js)
//       players/<uid>_k: { name, face, group? }   (a friend calling; group = their call to join)
//       players/<uid>_r: { code, at }             (a friend saying "not this time" to my invite)
// Adding a friend (code) just saves each other: ok/<pid> = 'f'. Calls are separate (the group).
//   games/friends/rooms/<group>  the group ('c' + 16 random)
//       players/<uid>_m: { name, face, sid, game }                         (one per device)
//       live/<uid>_m/<toUid>/<key>: WebRTC hand-shake messages
// The link itself is WebRTC, straight between devices, ready for voice/video later
// (peer.pc is the RTCPeerConnection; tracks friends add arrive as friend.stream).
// Friends you've been in a call with are saved on this device (FRIENDS_KEY) so you can call them again.
// Only the name, picture and what you're playing are shared.

import { firebaseCore } from './net.js';
import { myName, cleanName, myFace, cleanFace } from './profile.js';
import { pauseAudio, resetAudio } from './sound.js';
import { voiceOpts, onVoiceOpts } from './voice-opts.js';

// Game sounds back on, unless switched off for calls (🔧) while in a group.
const soundsBack = () => { if (group && !voiceOpts().gameSounds) pauseAudio(); else resetAudio(); };
let lastEcho = voiceOpts().echo;
onVoiceOpts(o => {
  soundsBack();
  if (o.echo !== lastEcho) { lastEcho = o.echo; if (mic) chooseMic(savedMic()); }
  if (group) group.peers.forEach(p => { p.relayOnly = false; try { p.pc.setConfiguration(iceConfig()); } catch (e) { /* */ } p.retry(); }); // relay switch
});
export const micTrack = () => (mic ? mic.getAudioTracks()[0] : null);

export const FRIEND_CODE_LEN = 6;
export const MAX_FRIENDS = 4;
const AREA = 'games/friends/rooms';
const KEEP_KEY = 'kg-group';
const FRIENDS_KEY = 'kg-friends';
const REJOIN_MS = 15 * 60 * 1000;   // reload/wake within this -> back in the group
const KNOCK_WAIT_MS = 60 * 1000;    // stop asking after this
const ALONE_MS = 45 * 1000;         // left on your own this long -> call over
// STUN finds a direct path. TURN = relay for when devices can't link directly.
// Our own free Metered account (20 GB a month). These details are meant to sit in the page;
// if someone uses up the allowance, make new ones in the Metered dashboard and swap them here.
const ICE = [
  { urls: ['stun:stun.relay.metered.ca:80', 'stun:stun.l.google.com:19302'] },
  {
    urls: [
      'turn:global.relay.metered.ca:80',
      'turn:global.relay.metered.ca:80?transport=tcp',
      'turn:global.relay.metered.ca:443',
      'turns:global.relay.metered.ca:443?transport=tcp',
    ],
    username: '8afd11852f70919b82fce652',
    credential: 'UwFRBOq7fSXaEVrn',
  },
];
export const iceServers = () => ICE;
const iceConfig = () => ({ iceServers: ICE, iceTransportPolicy: voiceOpts().relay ? 'relay' : 'all' });

const bytes = n => crypto.getRandomValues(new Uint8Array(n));
const randomHex = n => [...bytes(n)].map(b => (b & 15).toString(16)).join('');
const randomGroup = () => 'c' + [...bytes(16)].map(b => (b % 36).toString(36)).join('');
const plain = x => JSON.parse(JSON.stringify(x)); // Firebase can't store undefined
let sid = randomHex(10); // this page load (new one if we rebuild every link)

let fb = null;
async function core() { if (!fb) fb = await firebaseCore(); return fb; }
const ref = p => fb.D.ref(fb.db, `${AREA}/${p}`);

// ------------------------------------------------------------ state + events

let code = null, codeStatus = 'off';  // off | noname | loading | ok | offline
let codeToken = 0, codeUnsubs = [];
let knocks = [];                      // [{ pid, name }] waiting for an answer
const answered = new Set();
let outgoing = null;                  // { code, name, status: asking|no|full|none|self|offline }
let outUnsub = null, outTimer = null, outToken = 0;
let group = null;                     // { id, peers: Map(uid -> peer), unsubs, live, timer }
let mic = null, micStatus = 'off', muted = false; // micStatus: off | asking | on | denied
let wantCam = false;                               // start the camera when the call connects (video call)
let cam = null, camStatus = 'off';                 // camera: off | asking | on | denied (off unless tapped)
let invites = [];                     // [{ uid, name, face, game, code, at }] from friends
const dismissed = new Set();          // 'uid:code' already answered
let playing = null;                   // { game, code } room I'm in (from together.js)
const INVITE_MS = 15 * 60 * 1000;
let declines = [];                    // [{ uid, code }] friends who said no to my invite
let where = '';                       // game id I'm in ('' = menu)
let home = null;                      // { id, unsubs }
let contacts = loadFriends();         // saved friends [{ uid, name, face, at }]
const presence = new Map();           // uid -> { on, game } from their home
let presenceUnsubs = new Map();

const subs = new Set();
const state = () => ({
  code, codeStatus, outgoing, knocks: knocks.slice(),
  inGroup: !!group, micStatus, muted, uid: fb ? fb.uid : null, playing, camStatus, myCam: cam,
  invites: liveInvites().filter(v => !dismissed.has(v.uid + ':' + v.code) && !(playing && playing.code === v.code && playing.game === v.game)),
  friends: group ? [...group.peers.values()].map(p => ({ uid: p.uid, name: p.name, face: p.face || '', status: p.status, stream: p.stream, game: p.game || '', cam: !!p.cam, stuck: isStuck(p), weak: !!p.weak })) : [],
  declines: declines.slice(),
  // Bubbles: friends who are on now (in a call with me or not).
  buddies: buddies(),
  // Saved friends, online ones first: { uid, name, face, online, game, inCall, calling }
  contacts: contacts.map(c => {
    const pr = presence.get(c.uid) || {};
    const peer = group && group.peers.get(c.uid);
    return {
      uid: c.uid, name: c.name, face: c.face, online: !!pr.on || !!peer, game: peer ? (peer.game || '') : (pr.game || ''),
      inCall: !!peer, calling: !!(outgoing && outgoing.code === homeId(c.uid) && outgoing.status === 'asking'),
      said: outgoing && outgoing.code === homeId(c.uid) ? outgoing.status : '',
    };
  }).sort((a, b) => (b.inCall - a.inCall) || (b.online - a.online) || (b.at || 0) - (a.at || 0)),
});
let emitQueued = false;
function emit() {
  if (emitQueued) return;
  emitQueued = true;
  queueMicrotask(() => { emitQueued = false; const s = state(); subs.forEach(cb => cb(s)); });
}
export function onFriends(cb) { subs.add(cb); cb(state()); return () => subs.delete(cb); }
export const friendState = state;
export const friendPeers = () => (group ? [...group.peers.values()] : []); // for tests / debugging

// ------------------------------------------------------------ voice

// Mic on (asks permission the first time). Sent to every friend in the group.
export async function startMic() {
  if (mic || micStatus === 'asking') return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { micStatus = 'denied'; emit(); return; }
  micStatus = 'asking'; emit();
  // iPad: a sound context running while the mic starts makes voices play too high. Stop it first.
  pauseAudio();
  try {
    const m = await getMic().catch(e => { // chosen mic gone (unplugged): use the normal one
      if (!savedMic()) throw e;
      try { localStorage.removeItem(MIC_KEY); } catch (er) { /* */ }
      return getMic();
    });
    if (!group) { m.getTracks().forEach(t => t.stop()); micStatus = 'off'; emit(); return; } // left meanwhile
    mic = m; micStatus = 'on';
    mic.getAudioTracks().forEach(t => { t.enabled = !muted; });
    group.peers.forEach(addMic);
    // Chrome (Android) hides local addresses until the mic is allowed: look for a link again now.
    group.peers.forEach(p => { if (p.status !== 'on') p.retry(); });
  } catch (e) { micStatus = 'denied'; }
  soundsBack();
  emit();
}
const MIC_KEY = 'kg-mic';
const savedMic = () => { try { return localStorage.getItem(MIC_KEY) || ''; } catch (e) { return ''; } };
function getMic() {
  const id = savedMic();
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: voiceOpts().echo, noiseSuppression: voiceOpts().echo, autoGainControl: voiceOpts().echo, ...(id ? { deviceId: { exact: id } } : {}) },
    video: false,
  });
}
// [{ id, label, chosen }] (names only show once the mic has been allowed)
export async function listMics() {
  try {
    // Windows/Chrome also lists "default" and "communications" copies of real mics: skip those.
    const all = (await navigator.mediaDevices.enumerateDevices())
      .filter(d => d.kind === 'audioinput' && d.deviceId && d.deviceId !== 'default' && d.deviceId !== 'communications');
    const t = mic && mic.getAudioTracks()[0];
    const set = t ? t.getSettings() : {};
    let cur = all.find(d => d.deviceId === set.deviceId) || all.find(d => set.groupId && d.groupId === set.groupId);
    if (!cur && t) cur = all.find(d => d.label === t.label);
    return all.map((d, i) => ({ id: d.deviceId, label: d.label || `Mic ${i + 1}`, chosen: d === cur }));
  } catch (e) { return []; }
}
// Swap to another mic without dropping the call.
export async function chooseMic(id) {
  try { if (id) localStorage.setItem(MIC_KEY, id); } catch (e) { /* */ }
  if (!mic) return startMic();
  const m = await getMic().catch(() => null);
  if (!m) return;
  const t = m.getAudioTracks()[0];
  t.enabled = !muted;
  const old = mic;
  mic = m;
  if (group) group.peers.forEach(p => { if (p.micSender) p.micSender.replaceTrack(t).catch(() => {}); else addMic(p); });
  old.getTracks().forEach(x => x.stop());
  emit();
}
// ------------------------------------------------------------ camera (small video in the bubbles)

const CAM_BITRATE = 150000; // bubbles are tiny: keep it light on wifi and battery
export async function startCam() {
  if (cam || camStatus === 'asking' || !group) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { camStatus = 'denied'; emit(); return; }
  camStatus = 'asking'; emit();
  try {
    const c = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 240 }, height: { ideal: 240 }, frameRate: { ideal: 15, max: 15 } },
      audio: false,
    });
    if (!group) { c.getTracks().forEach(t => t.stop()); camStatus = 'off'; emit(); return; }
    cam = c; camStatus = 'on';
    group.peers.forEach(addCam);
    if (group.writeMe) group.writeMe();
  } catch (e) { camStatus = 'denied'; }
  emit();
}
export function stopCam() {
  if (cam) cam.getTracks().forEach(t => t.stop());
  cam = null;
  if (camStatus !== 'denied') camStatus = 'off';
  if (group) {
    group.peers.forEach(p => { if (p.camSender) p.camSender.replaceTrack(null).catch(() => {}); });
    if (group.writeMe) group.writeMe();
  }
  emit();
}
function addCam(p) {
  if (!cam || p.pc.signalingState === 'closed') return;
  const t = cam.getVideoTracks()[0];
  if (!t) return;
  if (p.camSender) { p.camSender.replaceTrack(p.weak ? null : t).catch(() => {}); return; } // no new hand-shake needed
  p.camSender = p.pc.addTrack(t, cam);
  try {
    const prm = p.camSender.getParameters();
    if (!prm.encodings || !prm.encodings.length) prm.encodings = [{}];
    prm.encodings[0].maxBitrate = CAM_BITRATE;
    p.camSender.setParameters(prm).catch(() => {});
  } catch (e) { /* not supported: browser picks */ }
}

function stopMic() {
  if (mic) mic.getTracks().forEach(t => t.stop());
  mic = null; micStatus = 'off'; emit();
  resetAudio();
}
function addMic(p) {
  if (!mic || p.micSender || p.pc.signalingState === 'closed') return;
  const t = mic.getAudioTracks()[0];
  if (t) p.micSender = p.pc.addTrack(t, mic); // starts a new hand-shake by itself
}
export function setMuted(m) {
  muted = !!m;
  if (mic) mic.getAudioTracks().forEach(t => { t.enabled = !muted; });
  emit();
}

// ------------------------------------------------------------ my code

function dropCode() {
  codeToken++;
  codeUnsubs.forEach(u => u()); codeUnsubs = [];
  if (code && fb) {
    const r = ref(code);
    fb.D.onDisconnect(r).cancel().catch(() => {});
    fb.D.remove(r).catch(() => {});
  }
  code = null; codeKnocks = []; mergeKnocks();
}

// A fresh code (called every time the menu opens).
export async function newCode() {
  dropCode();
  const token = codeToken;
  if (!myName()) { codeStatus = 'noname'; emit(); return; }
  codeStatus = 'loading'; emit();
  try {
    await core();
    const { D, uid } = fb;
    let c = null;
    for (let i = 0; i < 20 && !c; i++) {
      const t = randomHex(FRIEND_CODE_LEN);
      if (!(await D.get(ref(`${t}/host`))).exists()) c = t;
    }
    if (!c) throw new Error('no free code');
    if (token !== codeToken) return;
    const make = () => {
      D.onDisconnect(ref(c)).remove();
      return D.set(ref(c), { host: uid, created: D.serverTimestamp(), meta: { name: myName(), face: myFace() } });
    };
    await make();
    if (token !== codeToken) { D.remove(ref(c)).catch(() => {}); return; }
    code = c; codeStatus = 'ok'; emit();

    let first = true;
    codeUnsubs.push(D.onValue(D.ref(fb.db, '.info/connected'), s => { // put it back after a dropout
      if (!s.val()) return;
      if (first) { first = false; return; }
      D.get(ref(`${c}/host`)).then(h => { if (token === codeToken && !h.exists()) make().catch(() => {}); }).catch(() => {});
    }));
    codeUnsubs.push(D.onValue(ref(`${c}/players`), s => {
      const v = s.val() || {};
      for (const a of answered) if (a.startsWith(c) && !v[a.slice(c.length)]) { // they gave up: tidy their answer
        const pid = a.slice(c.length);
        answered.delete(a);
        D.update(ref(`${c}/meta`), { [`ok/${pid}`]: null, [`no/${pid}`]: null, [`full/${pid}`]: null }).catch(() => {});
      }
      codeKnocks = Object.entries(v)
        .filter(([pid, k]) => pid.endsWith('_k') && k && cleanName(k.name))
        .map(([pid, k]) => ({ pid, room: c, name: cleanName(k.name), face: cleanFace(k.face), group: cleanGroup(k.group) }));
      mergeKnocks();
    }));
  } catch (e) {
    if (token === codeToken) { codeStatus = 'offline'; emit(); }
  }
}

// Knocks come in on my code (new friends) and on my home (saved friends calling).
let codeKnocks = [], homeKnocks = [];
function mergeKnocks() {
  const seen = new Set();
  knocks = [...homeKnocks, ...codeKnocks].filter(k => !answered.has(k.room + k.pid) && !seen.has(k.pid) && seen.add(k.pid));
  emit();
}
const cleanGroup = g => (typeof g === 'string' && /^c[a-z0-9]{16}$/.test(g) ? g : '');

export async function accept(pid, video) {
  wantCam = !!video;
  if (video && group && group.peers.size) startCam();
  const k = knocks.find(x => x.pid === pid);
  if (!k || answered.has(k.room + pid)) return;
  answered.add(k.room + pid);
  knocks = knocks.filter(x => x.pid !== pid); emit();
  const meta = ref(`${k.room}/meta`);
  try {
    if (k.room[0] !== 'h') { // picture code: just friends, no call
      wantCam = false;
      saveFriend(pid.slice(0, -2), k.name, k.face);
      await fb.D.update(meta, { [`ok/${pid}`]: 'f' });
      return;
    }
    if (group && group.peers.size >= MAX_FRIENDS) { await fb.D.update(meta, { [`full/${pid}`]: true }); return; }
    // They're already in a call: hop into theirs (if I'm on my own), so friends come along.
    if (k.group && (!group || !group.peers.size)) await joinGroup(k.group);
    else if (!group) await joinGroup(randomGroup());
    await fb.D.update(meta, { [`ok/${pid}`]: group.id });
  } catch (e) { /* offline */ }
}

export function decline(pid) {
  const k = knocks.find(x => x.pid === pid);
  if (!k || answered.has(k.room + pid)) return;
  answered.add(k.room + pid);
  knocks = knocks.filter(x => x.pid !== pid); emit();
  fb.D.update(ref(`${k.room}/meta`), { [`no/${pid}`]: true }).catch(() => {});
}

// ------------------------------------------------------------ asking a friend (their code)

function stopAsking(keepStatus) {
  outToken++;
  if (outUnsub) { outUnsub(); outUnsub = null; }
  if (outTimer) { clearTimeout(outTimer); outTimer = null; }
  if (outgoing && fb) {
    const r = ref(`${outgoing.code}/players/${fb.uid}_k`);
    fb.D.onDisconnect(r).cancel().catch(() => {});
    fb.D.remove(r).catch(() => {});
  }
  if (!keepStatus) outgoing = null;
}
export function cancelAsk() { wantCam = false; stopAsking(); emit(); }

export async function askFriend(theirCode) {
  stopAsking();
  const token = outToken;
  const name = myName();
  if (!name) return;
  const set = (status, extra) => { if (token !== outToken) return; outgoing = { ...outgoing, ...extra, status }; emit(); };
  outgoing = { code: theirCode, name: '', status: 'asking' }; emit();
  if (theirCode === code) { set('self'); return; }
  try {
    await core();
    const { D, uid } = fb;
    const room = (await D.get(ref(theirCode))).val();
    if (token !== outToken) return;
    if (!room || !room.host) { set('none'); return; }
    if (room.host === uid) { set('self'); return; }
    set('asking', { name: cleanName(room.meta && room.meta.name) });
    if (room.meta && room.meta.on === false && theirCode[0] === 'h') { stopAsking(true); outgoing = { ...outgoing, status: 'away' }; emit(); return; }
    const pid = `${uid}_k`;
    const kr = ref(`${theirCode}/players/${pid}`);
    D.onDisconnect(kr).remove();
    await D.set(kr, plain({ name, face: myFace(), group: group && group.peers.size ? group.id : undefined }));
    if (token !== outToken) return;
    const finish = status => { if (token !== outToken) return; wantCam = false; stopAsking(true); outgoing = { ...outgoing, status }; emit(); };
    outTimer = setTimeout(() => finish('none'), KNOCK_WAIT_MS);
    outUnsub = D.onValue(ref(`${theirCode}/meta`), s => {
      const m = s.val();
      if (!m) return finish('none');  // they left / got a new code
      if (m.on === false) return finish('away'); // closed the app
      if (m.ok && m.ok[pid]) {
        const id = m.ok[pid];
        if (id === 'f') { // friends now (no call)
          saveFriend(room.host, cleanName(m.name) || '?', cleanFace(m.face));
          finish('added'); return;
        }
        stopAsking(); emit();
        joinGroup(id).catch(() => {});
      } else if (m.full && m.full[pid]) finish('full');
      else if (m.no && m.no[pid]) finish('no');
    });
  } catch (e) { set('offline'); }
}

// ------------------------------------------------------------ the group

function keep() {
  try { if (group) localStorage.setItem(KEEP_KEY, JSON.stringify({ id: group.id, at: Date.now() })); } catch (e) { /* private mode */ }
}
function forget() { try { localStorage.removeItem(KEEP_KEY); } catch (e) { /* private mode */ } }

async function joinGroup(id) {
  if (group && group.id === id) return;
  if (group) await leaveGroup();
  await core();
  const { D, uid } = fb;
  const g = { id, peers: new Map(), unsubs: [], live: null, timer: null };
  group = g;
  const meR = ref(`${id}/players/${uid}_m`);
  const liveR = ref(`${id}/live/${uid}_m`);
  const writeMe = () => {
    if (group !== g) return;
    D.onDisconnect(meR).remove();
    D.onDisconnect(liveR).remove();
    D.set(meR, { name: myName(), face: myFace(), sid, game: where, cam: !!cam }).catch(() => {});
  };
  g.writeMe = writeMe;
  await D.remove(liveR).catch(() => {}); // old messages from before a reload
  if (group !== g) return;
  writeMe();
  keep();
  g.timer = setInterval(keep, 20000);
  emit();
  startMic().then(() => { if (wantCam && group === g) { wantCam = false; startCam(); } });

  let first = true, online = true;
  g.unsubs.push(D.onValue(D.ref(fb.db, '.info/connected'), s => {
    online = !!s.val();
    if (!online) return;
    if (first) { first = false; return; }
    writeMe();
  }));
  g.unsubs.push(D.onValue(ref(`${id}/players`), s => {
    if (group !== g) return;
    const v = s.val() || {};
    if (online && !first && !v[`${uid}_m`]) writeMe();
    const seen = new Set();
    for (const [pid, m] of Object.entries(v)) {
      if (!pid.endsWith('_m') || !m || !m.sid) continue;
      const u = pid.slice(0, -2);
      if (u === uid) continue;
      seen.add(u);
      let p = g.peers.get(u);
      if (p && p.sid !== m.sid) { p.close(); p = null; } // they reloaded
      if (!p) { p = makePeer(g, u, m.sid); g.peers.set(u, p); }
      p.name = cleanName(m.name) || '?';
      p.face = cleanFace(m.face);
      p.game = typeof m.game === 'string' ? m.game.slice(0, 30) : '';
      p.cam = m.cam === true;
      // Only keep friends' names fresh. Someone else in the call (a friend's friend) is NOT added
      // as my friend: they show while we're in the call, then go.
      if (p.name !== '?' && contacts.some(c => c.uid === u)) saveFriend(u, p.name, p.face);
    }
    for (const [u, p] of g.peers) if (!seen.has(u)) { p.close(); g.peers.delete(u); }
    // Everyone else gone (and not back after a reload): leave too, so a refresh doesn't put you back in.
    if (!g.peers.size && !g.aloneTimer) g.aloneTimer = setTimeout(() => { if (group === g && !g.peers.size) leaveGroup(); }, ALONE_MS);
    if (g.peers.size && g.aloneTimer) { clearTimeout(g.aloneTimer); g.aloneTimer = null; }
    readSignals(g);
    emit();
  }));
  g.unsubs.push(D.onValue(ref(`${id}/live`), s => {
    if (group !== g) return;
    g.live = s.val() || {};
    readSignals(g);
  }));
}

export async function leaveGroup() {
  const g = group;
  if (!g) return;
  group = null;
  forget();
  clearInterval(g.timer);
  clearTimeout(g.aloneTimer);
  g.unsubs.forEach(u => u());
  g.peers.forEach(p => p.close());
  stopCam();
  stopMic();
  emit();
  const { D, uid } = fb;
  const meR = ref(`${g.id}/players/${uid}_m`), liveR = ref(`${g.id}/live/${uid}_m`);
  D.onDisconnect(meR).cancel().catch(() => {});
  D.onDisconnect(liveR).cancel().catch(() => {});
  await Promise.all([D.remove(meR), D.remove(liveR)]).catch(() => {});
}

function readSignals(g) {
  if (!g.live || !fb) return;
  for (const [pid, toMap] of Object.entries(g.live)) {
    const p = g.peers.get(pid.slice(0, -2));
    const msgs = toMap && toMap[fb.uid];
    if (!p || !msgs) continue;
    const prefix = `${p.sid}_${sid}_`;
    for (const key of Object.keys(msgs).sort()) {
      if (!key.startsWith(prefix) || p.handled.has(key)) continue;
      p.handled.add(key);
      p.handle(msgs[key]);
    }
  }
}

const isStuck = p => p.status !== 'on' && Date.now() - p.lostAt > 45000;

// Start every link in the group again from scratch: a new page id makes friends' devices
// treat it like a reload and build fresh links too.
function rebuildLinks(g) {
  if (group !== g || !fb) return;
  g.rebuiltAt = Date.now();
  sid = randomHex(10);
  g.peers.forEach(p => p.close());
  g.peers.clear();
  fb.D.remove(ref(`${g.id}/live/${fb.uid}_m`)).catch(() => {}).then(() => { if (g.writeMe) g.writeMe(); });
  emit();
}

// One WebRTC link to one friend ("perfect negotiation", so either side can add video later).
function makePeer(g, theirUid, theirSid) {
  const { D } = fb;
  const polite = fb.uid > theirUid;
  const pc = new RTCPeerConnection(iceConfig());
  const out = ref(`${g.id}/live/${fb.uid}_m/${theirUid}`);
  let n = 0, makingOffer = false, ignoreOffer = false, closed = false, chain = Promise.resolve();
  const peer = { uid: theirUid, sid: theirSid, name: '', status: 'connecting', stream: null, pc, handled: new Set(), lostAt: Date.now(), weak: false };
  const send = msg => {
    if (closed) return;
    const key = `${sid}_${theirSid}_${String(n++).padStart(6, '0')}`;
    D.set(D.child(out, key), plain(msg)).catch(() => {});
  };
  const setStatus = st => { if (peer.status !== st) { if (peer.status === 'on') peer.lostAt = Date.now(); peer.status = st; emit(); } };

  pc.onnegotiationneeded = async () => {
    try {
      makingOffer = true;
      await pc.setLocalDescription();
      send({ d: pc.localDescription.toJSON() });
    } catch (e) { /* try again on next change */ } finally { makingOffer = false; }
  };
  pc.onicecandidate = e => { if (e.candidate) send({ c: e.candidate.toJSON() }); };
  // Not linked yet: try again every 15 s (new network paths, e.g. once the mic is allowed).
  peer.retry = () => { if (!closed && pc.signalingState !== 'closed') { try { pc.restartIce(); } catch (e) { /* */ } } };
  // Normal mode already tries direct first, then the relay. Still stuck after ~30 s? Force the
  // relay for this friend (and flip back if that doesn't work either), so nobody needs the 🔧 switch.
  let stuck = 0;
  peer.relayOnly = false;
  const watchdog = setInterval(() => {
    if (closed) { clearInterval(watchdog); return; }
    if (peer.status === 'on') { stuck = 0; return; }
    ++stuck;
    emit(); // bubble: "Connecting…" -> "Can't connect"
    // ~90 s and still nothing: start every link again from scratch (one side does it, so they don't clash).
    if (stuck >= 6 && polite && Date.now() - (g.rebuiltAt || 0) > 120000) { rebuildLinks(g); return; }
    if (stuck % 2 === 0 && !voiceOpts().relay) {
      peer.relayOnly = !peer.relayOnly;
      try { pc.setConfiguration({ ...iceConfig(), iceTransportPolicy: peer.relayOnly ? 'relay' : 'all' }); } catch (e) { /* */ }
    }
    peer.retry();
  }, 15000);
  // Weak line: lots lost or very slow -> stop sending my video to this friend (voice keeps going),
  // send it again once the line is better. Shows "Weak line" on their bubble.
  let weakN = 0;
  const weakCheck = setInterval(async () => {
    if (closed) { clearInterval(weakCheck); return; }
    if (peer.status !== 'on') return;
    let rtt = 0, avail = Infinity, lost = 0;
    try {
      (await pc.getStats()).forEach(r => {
        if (r.type === 'candidate-pair' && r.nominated && r.state === 'succeeded') {
          rtt = r.currentRoundTripTime || 0;
          if (r.availableOutgoingBitrate) avail = r.availableOutgoingBitrate;
        }
        if (r.type === 'remote-inbound-rtp') lost = Math.max(lost, r.fractionLost || 0);
      });
    } catch (e) { return; }
    const sendingVideo = !!(peer.camSender && peer.camSender.track);
    const bad = rtt > 0.7 || lost > 0.12 || (sendingVideo && avail < 80000);
    weakN = bad ? Math.min(weakN + 1, 8) : Math.max(weakN - 1, 0);
    const was = peer.weak;
    if (!peer.weak && weakN >= 3) peer.weak = true;
    else if (peer.weak && weakN === 0) peer.weak = false;
    if (was !== peer.weak) {
      if (peer.camSender && cam) peer.camSender.replaceTrack(peer.weak ? null : cam.getVideoTracks()[0]).catch(() => {});
      emit();
    }
  }, 4000);
  pc.onconnectionstatechange = () => {
    const st = pc.connectionState;
    if (st === 'failed') pc.restartIce();
    if (st !== 'connected') setStatus('connecting');
    else if (dc.readyState === 'open') setStatus('on');
  };
  pc.ontrack = e => {
    // A bit more buffer: smooths bumpy wifi instead of speeding voices up to catch up.
    try { if ('jitterBufferTarget' in e.receiver) e.receiver.jitterBufferTarget = 250; else if ('playoutDelayHint' in e.receiver) e.receiver.playoutDelayHint = 0.25; } catch (er) { /* */ }
    // One stream per friend holding their voice and (if on) camera, whichever arrives first.
    if (!peer.stream) peer.stream = new MediaStream();
    if (!peer.stream.getTracks().includes(e.track)) {
      // keep every video track (both sides adding a camera can make two); the bubble shows the one with pictures
      if (e.track.kind === 'video') peer.stream.getVideoTracks().forEach(t => { if (t.readyState === 'ended') peer.stream.removeTrack(t); });
      peer.stream.addTrack(e.track);
    }
    e.track.onunmute = e.track.onmute = () => emit();
    emit();
  };

  // Always-open little channel: shows the link really works (and can carry messages later).
  const dc = pc.createDataChannel('kg', { negotiated: true, id: 0 });
  dc.onopen = () => {
    setStatus('on');
    setTimeout(() => { if (!closed && dc.readyState === 'open') D.remove(out).catch(() => {}); }, 5000); // tidy delivered messages
  };
  dc.onclose = () => setStatus('connecting');
  peer.dc = dc;
  addMic(peer);
  addCam(peer);

  async function handle(msg) {
    if (closed || !msg) return;
    if (msg.d) {
      const d = msg.d;
      const collision = d.type === 'offer' && (makingOffer || pc.signalingState !== 'stable');
      ignoreOffer = !polite && collision;
      if (ignoreOffer) return;
      await pc.setRemoteDescription(d);
      if (d.type === 'offer') {
        await pc.setLocalDescription();
        send({ d: pc.localDescription.toJSON() });
      }
    } else if (msg.c) {
      try { await pc.addIceCandidate(msg.c); } catch (e) { if (!ignoreOffer) throw e; }
    }
  }
  peer.handle = msg => { chain = chain.then(() => handle(msg)).catch(() => {}); };
  peer.close = () => {
    if (closed) return;
    closed = true;
    clearInterval(watchdog);
    clearInterval(weakCheck);
    try { pc.close(); } catch (e) { /* already */ }
    D.remove(out).catch(() => {});
  };
  return peer;
}

// ------------------------------------------------------------ invites ("come and play my game")

// Tell friends: come and join my room in this game (on my home, they all watch it).
// to = the uids picked (null = everyone who's on).
let myInvite = null;
export function sendInvite(game, roomCode, to = null) {
  myInvite = { game, code: roomCode, at: fb ? fb.now() : Date.now() };
  if (to && to.length) myInvite.to = Object.fromEntries(to.map(u => [u, true]));
  if (home && fb) fb.D.update(ref(`${home.id}/meta`), { invite: myInvite }).catch(() => {});
  return true;
}
export function clearInvite() {
  myInvite = null;
  if (home && fb) fb.D.update(ref(`${home.id}/meta`), { invite: null }).catch(() => {});
}
function liveInvites() {
  if (!fb) return [];
  const out = [];
  for (const c of contacts) {
    const pr = presence.get(c.uid);
    const v = pr && pr.on && pr.invite;
    if (v && v.game && v.code && (!v.to || v.to[fb.uid] === true) && fb.now() - (v.at || 0) < INVITE_MS) out.push({ uid: c.uid, name: c.name, face: c.face, game: String(v.game), code: String(v.code), at: v.at });
  }
  return out.sort((x, y) => y.at - x.at);
}
export function dismissInvite(inv) { dismissed.add(inv.uid + ':' + inv.code); emit(); }
// "No thanks": the friend who asked sees it (together.js lobby strip).
export function declineInvite(inv) {
  dismissInvite(inv);
  if (!fb) return;
  const r = ref(`${homeId(inv.uid)}/players/${fb.uid}_r`);
  fb.D.onDisconnect(r).remove();
  fb.D.set(r, { code: inv.code, at: fb.now() }).catch(() => {});
}
// ------------------------------------------------------------ quick messages
// Sent to the friend's home room, shown as a speech bubble, then deleted (never kept).
export const MSG_MAX = 80;
const msgSubs = new Set();
export function onMessage(cb) { msgSubs.add(cb); return () => msgSubs.delete(cb); }
export function sendMessage(uid, text) {
  text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, MSG_MAX);
  if (!text || !fb) return false;
  const r = ref(`${homeId(uid)}/players/${fb.uid}_t`);
  fb.D.onDisconnect(r).remove();
  fb.D.set(r, { text, at: fb.now() }).catch(() => {});
  return true;
}
function readMessages(id, v) {
  for (const [pid, m] of Object.entries(v)) {
    if (!pid.endsWith('_t') || !m) continue;
    fb.D.remove(ref(`${id}/players/${pid}`)).catch(() => {});
    const uid = pid.slice(0, -2), c = contacts.find(x => x.uid === uid);
    const text = String(m.text || '').replace(/\s+/g, ' ').trim().slice(0, MSG_MAX);
    if (!c || !text || fb.now() - (m.at || 0) > 120000) continue; // friends only, nothing old
    msgSubs.forEach(cb => cb({ uid, name: c.name, face: c.face, text }));
  }
}

// Friends who are on now: { uid, name, face, game, inCall, status, stream }
function buddies() {
  const out = [];
  for (const c of contacts) {
    const pr = presence.get(c.uid) || {};
    const p = group && group.peers.get(c.uid);
    if (!pr.on && !p) continue;
    out.push({ uid: c.uid, name: p ? p.name : c.name, face: p ? (p.face || '') : c.face, game: p ? (p.game || '') : (pr.game || ''),
      inCall: !!p, status: p ? p.status : 'idle', stream: p ? p.stream : null, cam: !!(p && p.cam), stuck: !!p && isStuck(p), weak: !!(p && p.weak),
      calling: !!(outgoing && outgoing.code === homeId(c.uid) && outgoing.status === 'asking') });
  }
  if (group) for (const p of group.peers.values()) if (!out.some(o => o.uid === p.uid)) {
    out.push({ uid: p.uid, name: p.name, face: p.face || '', game: p.game || '', inCall: true, status: p.status, stream: p.stream, cam: !!p.cam, stuck: isStuck(p), weak: !!p.weak, calling: false });
  }
  return out;
}
// The room I'm playing in (so its invite doesn't pop up), or null.
export function setPlaying(game, roomCode) { playing = game && roomCode ? { game, code: roomCode } : null; emit(); }
export const myUid = () => (fb ? fb.uid : null);
export const ensureCore = () => core();

// ------------------------------------------------------------ saved friends + my home

function loadFriends() {
  try { const a = JSON.parse(localStorage.getItem(FRIENDS_KEY) || '[]'); return Array.isArray(a) ? a.filter(f => f && typeof f.uid === 'string' && /^[\w-]{6,64}$/.test(f.uid)).slice(0, 30) : []; } catch (e) { return []; }
}
function storeFriends() { try { localStorage.setItem(FRIENDS_KEY, JSON.stringify(contacts)); } catch (e) { /* private mode */ } }
function saveFriend(uid, name, face) {
  const old = contacts.find(c => c.uid === uid);
  if (old && old.name === name && old.face === face) return;
  // Same person on a new device id (cleared browser): keep just the newest.
  contacts = contacts.filter(c => c.uid !== uid && !(c.name === name && c.face === face && face));
  contacts.unshift({ uid, name, face: face || '', at: Date.now() });
  storeFriends();
  watchPresence();
}
export function removeFriend(uid) {
  contacts = contacts.filter(c => c.uid !== uid);
  storeFriends(); watchPresence(); emit();
}
const homeId = uid => 'h' + uid;

// Who's on, and what they're playing (read from each saved friend's home).
function watchPresence() {
  if (!fb) return;
  const want = new Set(contacts.map(c => c.uid));
  for (const [u, off] of presenceUnsubs) if (!want.has(u)) { off(); presenceUnsubs.delete(u); presence.delete(u); }
  for (const u of want) {
    if (presenceUnsubs.has(u)) continue;
    presenceUnsubs.set(u, fb.D.onValue(ref(`${homeId(u)}/meta`), s => {
      const m = s.val() || {};
      presence.set(u, { on: m.on === true, game: typeof m.game === 'string' ? m.game.slice(0, 30) : '', invite: m.invite && typeof m.invite === 'object' ? m.invite : null });
      const c = contacts.find(x => x.uid === u);
      if (c && m.name && (cleanName(m.name) !== c.name || cleanFace(m.face) !== c.face)) { // they changed name/picture
        c.name = cleanName(m.name) || c.name; c.face = cleanFace(m.face); storeFriends();
      }
      emit();
    }, () => {}));
  }
}

async function openHome() {
  if (home || !myName()) return;
  await core();
  const { D, uid } = fb;
  const id = homeId(uid);
  home = { id, unsubs: [] };
  const meta = () => ({ name: myName(), face: myFace(), on: true, game: where, at: D.serverTimestamp(), invite: myInvite });
  const put = async () => {
    D.onDisconnect(ref(`${id}/meta/on`)).set(false);
    D.onDisconnect(ref(`${id}/players`)).remove();
    const h = await D.get(ref(`${id}/host`));
    if (h.exists()) await D.update(ref(`${id}/meta`), meta());
    else await D.set(ref(id), { host: uid, created: D.serverTimestamp(), meta: meta() });
  };
  home.put = put;
  await put().catch(() => {});
  let first = true;
  home.unsubs.push(D.onValue(D.ref(fb.db, '.info/connected'), s => {
    if (!s.val()) return;
    if (first) { first = false; return; }
    put().catch(() => {});
  }));
  home.unsubs.push(D.onValue(ref(`${id}/players`), s => {
    const v = s.val() || {};
    for (const a of answered) if (a.startsWith(id) && !v[a.slice(id.length)]) {
      const pid = a.slice(id.length);
      answered.delete(a);
      D.update(ref(`${id}/meta`), { [`ok/${pid}`]: null, [`no/${pid}`]: null, [`full/${pid}`]: null }).catch(() => {});
    }
    declines = Object.entries(v)
      .filter(([pid, r]) => pid.endsWith('_r') && r && r.code)
      .map(([pid, r]) => ({ uid: pid.slice(0, -2), code: String(r.code) }));
    readMessages(id, v);
    homeKnocks = Object.entries(v)
      .filter(([pid, k]) => pid.endsWith('_k') && k && cleanName(k.name))
      .map(([pid, k]) => ({ pid, room: id, name: cleanName(k.name), face: cleanFace(k.face), group: cleanGroup(k.group), saved: true }));
    mergeKnocks();
  }));
  // Self-repair: an old tab's late "gone" (onDisconnect) can mark me offline while I'm here.
  let leaving = false;
  home.unsubs.push(D.onValue(ref(`${id}/meta/on`), s => {
    if (s.val() !== true && !leaving) setTimeout(() => { if (!leaving) put().catch(() => {}); }, 1500);
  }));
  watchPresence();
  window.addEventListener('pagehide', () => { leaving = true; D.update(ref(`${id}/meta`), { on: false }).catch(() => {}); });
  window.addEventListener('pageshow', () => { if (leaving) { leaving = false; put().catch(() => {}); } });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') put().catch(() => {}); });
}

// Call a saved friend (they get the "is calling" pop-up wherever they are).
export function callFriend(uid, video) {
  if (video && group && group.peers.size) startCam();
  const p = askFriend(homeId(uid));
  wantCam = !!video;
  return p;
}

// What I'm playing ('' = menu): friends see it on my bubble and in their list.
export function setWhere(gameId) {
  where = gameId || '';
  if (group && group.writeMe) group.writeMe();
  if (home && fb) fb.D.update(ref(`${home.id}/meta`), { game: where }).catch(() => {});
}

// ------------------------------------------------------------ start + name

let started = false;
export function startFriends() {
  if (started) return;
  started = true;
  window.addEventListener('pagehide', keep);
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEEP_KEY) || 'null'); } catch (e) { /* private mode */ }
  if (saved && saved.id && Date.now() - saved.at < REJOIN_MS && myName()) joinGroup(saved.id).catch(() => {});
  else forget();
  openHome().catch(() => {});
}

// Call after the name box changes.
export function nameChanged() {
  const name = myName();
  if (!name) { stopAsking(); dropCode(); codeStatus = 'noname'; emit(); return; }
  if (codeStatus === 'noname' || codeStatus === 'offline') { newCode(); openHome().catch(() => {}); return; }
  if (code && fb) fb.D.update(ref(`${code}/meta`), { name, face: myFace() }).catch(() => {});
  if (group && group.writeMe) group.writeMe();
  if (home && home.put) home.put().catch(() => {}); else openHome().catch(() => {});
}
export const _rebuildNow = () => { if (group) { group.rebuiltAt = 0; rebuildLinks(group); } }; // for tests
