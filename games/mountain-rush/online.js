// Mountain Rush: riding with other people.
//
// - Everyone online: each map has one shared mountain (joinPublic). You see every rider on
//   the same map, with their name over them. Nothing to set up.
// - Friends: "Ride with friends" makes a room and invites friends who are on (together.js).
//   Everyone in the room rides the host's map, sees each other, and the host can start a race:
//   all riders go back to the start gate, count down 3-2-1, and the times go on a board.
//
// Each device sends its own rider ~8 times a second: position, rotation, speed and pose.
import * as THREE from '../../js/vendor/three.module.min.js';
import { createRoom, joinRoom, joinPublic, firebaseCore } from '../../js/engine/net.js';
import { playTogether, joined, leftRoom, people, playerInfo, lobbyHTML } from '../../js/engine/together.js';
import { myName, myFace, cleanName, nameHTML } from '../../js/engine/profile.js';

const GAME = 'mountain-rush';
const MAX_REMOTES = 10;

// ctx: { scene(), world(), makeBike(type, look), me(): { p, q, v, ps, bk, lk, cr, hey } , onMeta(meta), onPlayers(list), wantPublic() }
export function createOnline(ctx) {
  const net = { pub: null, room: null, live: {}, players: {}, meta: {}, unsubs: [], sendAcc: 0, connecting: false, hostUid: '' };
  const remotes = new Map();
  const tv = new THREE.Vector3();

  // ------------------------------------------------------------ connect
  async function goPublic(map) {
    if (net.pub || net.room || net.connecting) return;
    net.connecting = true;
    try {
      const api = await joinPublic(GAME, 'pub-' + map);
      net.connecting = false;
      if (net.room || !ctx.wantPublic()) { api.leave(); return; }
      net.pub = api; net.pubMap = map;
      net.unsubs.push(api.onLive(l => { net.live = l; }));
    } catch (e) { net.connecting = false; console.warn('online offline', e); }
  }
  function leavePublic() {
    if (!net.pub) return;
    net.unsubs.forEach(u => u && u()); net.unsubs = [];
    net.pub.leave(); net.pub = null; net.live = {};
    clearRemotes();
  }
  async function hostRoom(map) {
    const room = await playTogether(GAME, () => createRoom(GAME, { map }));
    if (!room) return null;           // the friends panel opened instead
    room.setMeta({ hostUid: room.uid, map }).catch(() => {});
    goRoom(room);
    return room;
  }
  async function joinCode(code) {
    const room = await joinRoom(GAME, code);
    if (!room) return null;
    joined(GAME, code);
    goRoom(room);
    return room;
  }
  function goRoom(room) {
    leavePublic();
    net.room = room; net.hostUid = room.isHost ? room.uid : '';
    room.setPlayer(room.uid + '_p0', { joined: room.now(), ...playerInfo(true) });
    net.unsubs.push(room.onLive(l => { net.live = l; }));
    net.unsubs.push(room.onPlayers(pl => { net.players = pl; ctx.onPlayers(list()); }));
    net.unsubs.push(room.onMeta(m => {
      if (!m) { if (net.room === room) leaveRoom(true); return; }
      if (m.hostUid) net.hostUid = m.hostUid;
      net.meta = m; ctx.onMeta(m);
    }));
  }
  function leaveRoom(gone = false) {
    if (!net.room) return;
    const r = net.room; net.room = null;
    leftRoom();
    net.unsubs.forEach(u => u && u()); net.unsubs = [];
    r.leave(); net.live = {}; net.players = {}; net.meta = {};
    clearRemotes();
    ctx.onLeft && ctx.onLeft(gone);
  }
  const list = () => people(net.players, net.hostUid).map(p => ({ ...p, ...(net.players[p.pid] || {}), host: p.host }));
  const isHost = () => !!(net.room && net.room.isHost);
  const now = () => (net.room || net.pub ? (net.room || net.pub).now() : Date.now());

  // ------------------------------------------------------------ send + receive
  function tick(dt, map, riding) {
    // public mountain follows the map; leave it when not riding or switched off
    if (!net.room) {
      if (riding && ctx.wantPublic()) { if (net.pub && net.pubMap !== map) leavePublic(); if (!net.pub) goPublic(map); }
      else if (net.pub) leavePublic();
    }
    const api = net.room || net.pub;
    if (!api) return;
    net.sendAcc += dt;
    if (riding && net.sendAcc >= (net.room ? 1 / 8 : 1 / 5)) {
      net.sendAcc = 0;
      const me = ctx.me();
      api.setLive(api.uid + '_p0', { t: api.now(), m: map, n: myName(), ...me });
    }
    const t = api.now(), seen = new Set(), sc = ctx.scene();
    for (const [pid, d] of Object.entries(net.live || {})) {
      if (pid.startsWith(api.uid + '_') || !d || typeof d !== 'object' || d.m !== map) continue;
      if (!Array.isArray(d.p) || d.p.length !== 3 || !Array.isArray(d.q) || d.q.length !== 4 || ![...d.p, ...d.q].every(Number.isFinite)) continue;
      if (typeof d.t !== 'number' || t - d.t > 10000) continue;
      if (!remotes.has(pid) && remotes.size >= MAX_REMOTES) continue;
      seen.add(pid);
      let r = remotes.get(pid);
      const lookKey = JSON.stringify([d.bk, d.lk]);
      if (!r || r.lookKey !== lookKey) {
        if (r) dropRemote(r);
        const bike = ctx.makeBike(typeof d.bk === 'string' ? d.bk : 'trek', lookFrom(d.lk));
        bike.root.matrixAutoUpdate = false; bike.rider.matrixAutoUpdate = false;
        sc.add(bike.root); sc.add(bike.rider);
        const tag = nameTag(cleanName(d.n) || 'Rider'); sc.add(tag);
        r = { bike, tag, lookKey, name: cleanName(d.n), pos: new THREE.Vector3(...d.p), vel: new THREE.Vector3(), quat: new THREE.Quaternion(...d.q), tq: new THREE.Quaternion(...d.q), t: 0, d, heyT: 0, bubble: null };
        remotes.set(pid, r);
        ctx.onJoin && ctx.onJoin(r.name);
      }
      if (cleanName(d.n) !== r.name) { sc.remove(r.tag); r.tag = nameTag(cleanName(d.n) || 'Rider'); sc.add(r.tag); r.name = cleanName(d.n); }
      if (r.t !== d.t) {
        r.t = d.t; r.d = d;
        r.vel.set(...(Array.isArray(d.v) && d.v.every(Number.isFinite) ? d.v : [0, 0, 0]));
        r.tq.set(...d.q).normalize();
        r.target = new THREE.Vector3(...d.p).addScaledVector(r.vel, Math.min(1, Math.max(0, (t - d.t) / 1000)));
        if (r.pos.distanceTo(r.target) > 25) r.pos.copy(r.target);
        if (d.hey && d.hey !== r.heyAt) { if (r.heyAt) showHey(r); r.heyAt = d.hey; }
      }
    }
    for (const [pid, r] of remotes) if (!seen.has(pid)) { dropRemote(r); remotes.delete(pid); }
  }
  const m4 = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1);
  function update(dt) {
    for (const r of remotes.values()) {
      if (r.target) { r.target.addScaledVector(r.vel, dt); r.pos.lerp(r.target, 1 - Math.exp(-dt * 6)); }
      r.quat.slerp(r.tq, 1 - Math.exp(-dt * 10));
      m4.compose(r.pos, r.quat, one);
      r.bike.root.matrix.copy(m4); r.bike.rider.matrix.copy(m4);
      r.bike.root.matrixWorldNeedsUpdate = r.bike.rider.matrixWorldNeedsUpdate = true;
      const vis = !r.d.cr;
      r.bike.root.visible = r.bike.rider.visible = vis;
      const ps = Array.isArray(r.d.ps) ? r.d.ps : [];
      const g = i => (Number.isFinite(ps[i]) ? ps[i] : 0);
      r.wheel = (r.wheel || 0) + r.vel.length() * dt / 0.36;
      if (vis) r.bike.pose({ steer: g(0), crouch: g(1), lean: 0, crank: g(10), wheel: r.wheel, superman: g(2), nohand: g(3), table: g(4), cancan: g(5), nofoot: g(6), whip: g(7), bar: g(8), manual: g(9) });
      r.tag.position.copy(r.pos).add(tv.set(0, 2.3, 0));
      r.tag.visible = vis;
      if (r.bubble) { r.heyT -= dt; r.bubble.position.copy(r.pos).add(tv.set(0, 2.9, 0)); if (r.heyT <= 0) { ctx.scene().remove(r.bubble); r.bubble = null; } }
    }
  }
  function showHey(r) {
    if (r.bubble) ctx.scene().remove(r.bubble);
    r.bubble = nameTag('👋 Hey!', '#ffd54f'); r.bubble.scale.multiplyScalar(1.2);
    ctx.scene().add(r.bubble); r.heyT = 2;
    ctx.onHey && ctx.onHey(r.name);
  }
  function dropRemote(r) {
    const sc = ctx.scene();
    for (const o of [r.bike.root, r.bike.rider, r.tag, r.bubble]) if (o) { sc.remove(o); o.traverse(x => { if (x.geometry) x.geometry.dispose(); }); }
  }
  function clearRemotes() { for (const r of remotes.values()) dropRemote(r); remotes.clear(); }
  const others = () => [...remotes.values()];

  // ------------------------------------------------------------ races (host only starts them)
  function startRace() {
    if (!isHost()) return;
    net.room.setMeta({ race: { id: Math.random().toString(36).slice(2, 8), t: net.room.now() + 6000 } }).catch(() => {});
  }
  function postResult(raceId, time) {
    if (!net.room) return;
    net.room.setPlayer(net.room.uid + '_p0', { joined: net.room.now(), ...playerInfo(true), race: raceId, time: Math.round(time * 100) / 100 }).catch(() => {});
  }
  const stripHTML = () => (net.room ? lobbyHTML(list(), { hostDoing: 'riding', myUid: net.room.uid, showComing: true }) : '');

  async function leaveAll() { leaveRoom(); leavePublic(); }

  // ------------------------------------------------------------ fastest times board (one per map, kept for good)
  const LOCAL = new URLSearchParams(location.search).get('net') === 'local';
  async function submitBest(map, time, score) {
    if (LOCAL) return;
    try {
      const { D, db, uid } = await firebaseCore();
      const ref = D.ref(db, `games/${GAME}/rooms/lb-${map}/players/${uid}_b`);
      const old = (await D.get(ref)).val();
      if (old && old.time <= time && (old.score || 0) >= score) return;
      await D.set(ref, { name: cleanName(myName()) || 'Rider', face: myFace() || '🙂', time: old && old.time < time ? old.time : Math.round(time * 100) / 100, score: Math.max(score, (old && old.score) || 0), at: Date.now() });
    } catch (e) { /* offline */ }
  }
  async function board(map) {
    if (LOCAL) return [];
    try {
      const { D, db, uid } = await firebaseCore();
      const v = (await D.get(D.ref(db, `games/${GAME}/rooms/lb-${map}/players`))).val() || {};
      return Object.entries(v).filter(([, e]) => e && Number.isFinite(e.time) && e.time > 20)
        .map(([pid, e]) => ({ me: pid.startsWith(uid + '_'), name: cleanName(e.name) || 'Rider', face: e.face || '🙂', time: e.time, score: e.score || 0 }))
        .sort((a, b) => a.time - b.time).slice(0, 10);
    } catch (e) { return []; }
  }

  return { net, submitBest, board, clear: clearRemotes, goRoom, goPublic, leavePublic, hostRoom, joinCode, leaveRoom, leaveAll, tick, update, others, list, isHost, now, startRace, postResult, stripHTML, remotes };
}

function lookFrom(lk) {
  const a = Array.isArray(lk) ? lk : [];
  const num = (v, d) => (Number.isFinite(v) ? v : d);
  return { frame: num(a[0], 0xe53935), jersey: num(a[1], 0x1e88e5), helmet: num(a[2], 0xffffff), pants: num(a[3], 0x23262d), goggle: num(a[4], 0xffb300), open: a[5] ? 1 : 0 };
}

function nameTag(text, color = '#ffb74d') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.font = '800 34px Nunito, Arial, sans-serif';
  const w = Math.min(248, g.measureText(text).width + 34);
  g.fillStyle = 'rgba(10,20,40,.72)'; g.beginPath(); g.roundRect(128 - w / 2, 6, w, 50, 22); g.fill();
  g.strokeStyle = color; g.lineWidth = 5; g.stroke();
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 33);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true }));
  sp.scale.set(0.2, 0.05, 1); sp.renderOrder = 20;
  return sp;
}
export { nameHTML };
