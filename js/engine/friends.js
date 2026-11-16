// Friends: link up with up to MAX_FRIENDS other devices. The link stays on across every game.
//
// Firebase is only used so devices can find each other (inside the normal rooms rules):
//   games/friends/rooms/<code>   my friend code (6 hex = 6 pictures), new on every visit to the menu
//       host, meta: { name, ok/<pid>: <group>, no/<pid>, full/<pid> }   (written by me)
//       players/<uid>_k: { name }                                       (a friend knocking)
//   games/friends/rooms/<group>  the group ('c' + 16 random)
//       players/<uid>_m: { name, face, sid }                                (one per device)
//       players/<uid>_i: { game, code, name, face, at }                 ("come and play" invite, see together.js)
//       live/<uid>_m/<toUid>/<key>: WebRTC hand-shake messages
// The link itself is WebRTC, straight between devices, ready for voice/video later
// (peer.pc is the RTCPeerConnection; tracks friends add arrive as friend.stream).
// Nothing is kept: entries go when you leave or lose connection. Only the name and picture are shared.

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
  if (group) group.peers.forEach(p => { try { p.pc.setConfiguration(iceConfig()); } catch (e) { /* */ } p.retry(); }); // relay switch
});
export const micTrack = () => (mic ? mic.getAudioTracks()[0] : null);

export const FRIEND_CODE_LEN = 6;
export const MAX_FRIENDS = 4;
const AREA = 'games/friends/rooms';
const KEEP_KEY = 'kg-group';
const REJOIN_MS = 15 * 60 * 1000;   // reload/wake within this -> back in the group
const KNOCK_WAIT_MS = 60 * 1000;    // stop asking after this
const ALONE_MS = 45 * 1000;         // left on your own this long -> call over
// STUN finds a direct path. TURN = relay for when devices can't link directly (free public
// Open Relay server: may be slow or down; swap for a paid/own one if it's unreliable).
const ICE = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  {
    urls: [
      'turn:staticauth.openrelay.metered.ca:80',
      'turn:staticauth.openrelay.metered.ca:80?transport=tcp',
      'turn:staticauth.openrelay.metered.ca:443',
      'turns:staticauth.openrelay.metered.ca:443?transport=tcp',
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];
const iceConfig = () => ({ iceServers: ICE, iceTransportPolicy: voiceOpts().relay ? 'relay' : 'all' });

const bytes = n => crypto.getRandomValues(new Uint8Array(n));
const randomHex = n => [...bytes(n)].map(b => (b & 15).toString(16)).join('');
const randomGroup = () => 'c' + [...bytes(16)].map(b => (b % 36).toString(36)).join('');
const plain = x => JSON.parse(JSON.stringify(x)); // Firebase can't store undefined
const sid = randomHex(10); // this page load

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
let invites = [];                     // [{ uid, name, face, game, code, at }] from friends
const dismissed = new Set();          // 'uid:code' already answered
let playing = null;                   // { game, code } room I'm in (from together.js)
const INVITE_MS = 15 * 60 * 1000;

const subs = new Set();
const state = () => ({
  code, codeStatus, outgoing, knocks: knocks.slice(),
  inGroup: !!group, micStatus, muted, uid: fb ? fb.uid : null, playing,
  invites: invites.filter(v => !dismissed.has(v.uid + ':' + v.code) && !(playing && playing.code === v.code && playing.game === v.game)),
  friends: group ? [...group.peers.values()].map(p => ({ uid: p.uid, name: p.name, face: p.face || '', status: p.status, stream: p.stream })) : [],
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
  code = null; knocks = []; answered.clear();
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
      return D.set(ref(c), { host: uid, created: D.serverTimestamp(), meta: { name: myName() } });
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
      for (const pid of answered) if (!v[pid]) { // they gave up: tidy their answer
        answered.delete(pid);
        D.update(ref(`${c}/meta`), { [`ok/${pid}`]: null, [`no/${pid}`]: null, [`full/${pid}`]: null }).catch(() => {});
      }
      knocks = Object.entries(v)
        .filter(([pid, k]) => pid.endsWith('_k') && !answered.has(pid) && k && cleanName(k.name))
        .map(([pid, k]) => ({ pid, name: cleanName(k.name) }));
      emit();
    }));
  } catch (e) {
    if (token === codeToken) { codeStatus = 'offline'; emit(); }
  }
}

export async function accept(pid) {
  if (!code || answered.has(pid)) return;
  answered.add(pid);
  knocks = knocks.filter(k => k.pid !== pid); emit();
  const meta = ref(`${code}/meta`);
  try {
    if (group && group.peers.size >= MAX_FRIENDS) { await fb.D.update(meta, { [`full/${pid}`]: true }); return; }
    if (!group) await joinGroup(randomGroup());
    await fb.D.update(meta, { [`ok/${pid}`]: group.id });
  } catch (e) { /* offline */ }
}

export function decline(pid) {
  if (!code || answered.has(pid)) return;
  answered.add(pid);
  knocks = knocks.filter(k => k.pid !== pid); emit();
  fb.D.update(ref(`${code}/meta`), { [`no/${pid}`]: true }).catch(() => {});
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
export function cancelAsk() { stopAsking(); emit(); }

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
    const pid = `${uid}_k`;
    const kr = ref(`${theirCode}/players/${pid}`);
    D.onDisconnect(kr).remove();
    await D.set(kr, { name });
    if (token !== outToken) return;
    const finish = status => { stopAsking(true); set(status); };
    outTimer = setTimeout(() => finish('none'), KNOCK_WAIT_MS);
    outUnsub = D.onValue(ref(`${theirCode}/meta`), s => {
      const m = s.val();
      if (!m) return finish('none');  // they left / got a new code
      if (m.ok && m.ok[pid]) {
        const id = m.ok[pid];
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
    D.set(meR, { name: myName(), face: myFace(), sid }).catch(() => {});
  };
  g.writeMe = writeMe;
  await D.remove(liveR).catch(() => {}); // old messages from before a reload
  if (group !== g) return;
  writeMe();
  keep();
  g.timer = setInterval(keep, 20000);
  emit();
  startMic();

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
    }
    for (const [u, p] of g.peers) if (!seen.has(u)) { p.close(); g.peers.delete(u); }
    invites = Object.entries(v)
      .filter(([pid, i]) => pid.endsWith('_i') && i && i.game && i.code && seen.has(pid.slice(0, -2)) && fb.now() - (i.at || 0) < INVITE_MS)
      .map(([pid, i]) => ({ uid: pid.slice(0, -2), name: cleanName(i.name) || '?', face: cleanFace(i.face), game: String(i.game), code: String(i.code), at: i.at }))
      .sort((a, b) => b.at - a.at);
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
  clearInvite();
  invites = [];
  group = null;
  forget();
  clearInterval(g.timer);
  clearTimeout(g.aloneTimer);
  g.unsubs.forEach(u => u());
  g.peers.forEach(p => p.close());
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

// One WebRTC link to one friend ("perfect negotiation", so either side can add video later).
function makePeer(g, theirUid, theirSid) {
  const { D } = fb;
  const polite = fb.uid > theirUid;
  const pc = new RTCPeerConnection(iceConfig());
  const out = ref(`${g.id}/live/${fb.uid}_m/${theirUid}`);
  let n = 0, makingOffer = false, ignoreOffer = false, closed = false, chain = Promise.resolve();
  const peer = { uid: theirUid, sid: theirSid, name: '', status: 'connecting', stream: null, pc, handled: new Set() };
  const send = msg => {
    if (closed) return;
    const key = `${sid}_${theirSid}_${String(n++).padStart(6, '0')}`;
    D.set(D.child(out, key), plain(msg)).catch(() => {});
  };
  const setStatus = st => { if (peer.status !== st) { peer.status = st; emit(); } };

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
  const watchdog = setInterval(() => { if (closed) clearInterval(watchdog); else if (peer.status !== 'on') peer.retry(); }, 15000);
  pc.onconnectionstatechange = () => {
    const st = pc.connectionState;
    if (st === 'failed') pc.restartIce();
    if (st !== 'connected') setStatus('connecting');
    else if (dc.readyState === 'open') setStatus('on');
  };
  pc.ontrack = e => {
    // A bit more buffer: smooths bumpy wifi instead of speeding voices up to catch up.
    try { if ('jitterBufferTarget' in e.receiver) e.receiver.jitterBufferTarget = 250; else if ('playoutDelayHint' in e.receiver) e.receiver.playoutDelayHint = 0.25; } catch (er) { /* */ }
    peer.stream = e.streams[0] || peer.stream || new MediaStream();
    if (!e.streams[0]) peer.stream.addTrack(e.track);
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
    try { pc.close(); } catch (e) { /* already */ }
    D.remove(out).catch(() => {});
  };
  return peer;
}

// ------------------------------------------------------------ invites ("come and play my game")

// Tell every friend in the group: come and join my room in this game.
export function sendInvite(game, roomCode) {
  if (!group || !fb) return false;
  const r = ref(`${group.id}/players/${fb.uid}_i`);
  fb.D.onDisconnect(r).remove();
  fb.D.set(r, { game, code: roomCode, name: myName(), face: myFace(), at: fb.now() }).catch(() => {});
  return true;
}
export function clearInvite() {
  if (!group || !fb) return;
  const r = ref(`${group.id}/players/${fb.uid}_i`);
  fb.D.onDisconnect(r).cancel().catch(() => {});
  fb.D.remove(r).catch(() => {});
}
export function dismissInvite(inv) { dismissed.add(inv.uid + ':' + inv.code); emit(); }
// The room I'm playing in (so its invite doesn't pop up), or null.
export function setPlaying(game, roomCode) { playing = game && roomCode ? { game, code: roomCode } : null; emit(); }
export const myUid = () => (fb ? fb.uid : null);
export const ensureCore = () => core();

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
}

// Call after the name box changes.
export function nameChanged() {
  const name = myName();
  if (!name) { stopAsking(); dropCode(); codeStatus = 'noname'; emit(); return; }
  if (codeStatus === 'noname' || codeStatus === 'offline') { newCode(); return; }
  if (code && fb) fb.D.update(ref(`${code}/meta`), { name }).catch(() => {});
  if (group && group.writeMe) group.writeMe();
}
