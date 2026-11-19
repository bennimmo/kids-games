// Friends on screen: the bar + panel on the menu, the "wants to connect" popup,
// and the floating friend bubbles that stay on top of every game.
import { CODE_PICS, picImg } from './engine/net.js';
import { nameHTML, myName, myFace } from './engine/profile.js';
import { sound } from './engine/sound.js';
import { icon } from './engine/icons.js';
import { GAMES } from './games.js';
import { gameArt } from './game-art.js';
import { playVoice, tidyVoices, unlockVoices, openVoiceTools } from './voice-tools.js';
import { onVoiceOpts } from './engine/voice-opts.js';
import {
  onFriends, friendState, startFriends, dismissInvite, declineInvite, callFriend, removeFriend, newCode, askFriend, cancelAsk, accept, decline, leaveGroup, sendMessage, onMessage, MSG_MAX, introduce, answerIntro, startMic, setMuted, listMics, chooseMic, startCam, stopCam,
  FRIEND_CODE_LEN, MAX_FRIENDS,
} from './engine/friends.js';

const DOCK_KEY = 'kg-bubbles';
const COLORS = ['#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ffca28', '#26c6da', '#ec407a', '#8d6e63'];
const colorFor = uid => COLORS[[...uid].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7) % COLORS.length];
const picsHTML = c => [...c].map(h => `<span class="pic">${picImg(parseInt(h, 16))}</span>`).join('');
const gameOf = id => GAMES.find(g => g.id === id);
// "Playing Kit's Karts" / "On the menu" / "Not on"
const whereText = (online, game) => !online ? 'Not on' : (gameOf(game) ? `Playing ${gameOf(game).name}` : 'On the menu');

let layer, dock, list, micBtn, hangBtn, badge, knockEl, inviteEl, panel = null, camBtn, meEl;
const quiet = new Set(); // friends I've muted (just on this device)
let openTimer = null;
function openDock(on) {
  clearTimeout(openTimer);
  dock.classList.toggle('open', on);
  if (on) openTimer = setTimeout(() => openDock(false), 5000);
  else { hangBtn.classList.remove('sure'); hangBtn.innerHTML = icon('hangup'); }
}
let onEditName = () => {};

// Keep taps on our things away from the game underneath.
function shield(el) {
  for (const t of ['pointerdown', 'pointerup', 'pointermove', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'touchmove', 'click', 'wheel', 'keydown']) {
    el.addEventListener(t, e => e.stopPropagation());
  }
}

// ------------------------------------------------------------ bubbles

function loadDock() {
  try { const d = JSON.parse(localStorage.getItem(DOCK_KEY) || 'null'); if (d && (d.side === 'left' || d.side === 'right')) return d; } catch (e) { /* */ }
  return { side: 'right', y: 0.5 };
}
let dockPos = loadDock();
function placeDock() {
  dock.classList.toggle('left', dockPos.side === 'left');
  const h = dock.offsetHeight || 0;
  // dockPos.t = where the top sits, so friends don't shift when bubbles come and go.
  if (dockPos.t == null && h) dockPos.t = (dockPos.y * innerHeight - h / 2) / innerHeight; // fix it after first showing
  const want = dockPos.t != null ? dockPos.t * innerHeight : dockPos.y * innerHeight - h / 2;
  const top = Math.max(96, Math.min(innerHeight - h - 12, want));
  dock.style.top = top + 'px';
}

function wireDrag() {
  let start = null;
  dock.addEventListener('pointerdown', e => {
    start = { x: e.clientX, y: e.clientY, top: dock.offsetTop, moved: false, id: e.pointerId };
  });
  dock.addEventListener('pointermove', e => {
    if (!start || e.pointerId !== start.id) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!start.moved && Math.hypot(dx, dy) < 8) return;
    if (!start.moved) { start.moved = true; try { dock.setPointerCapture(e.pointerId); } catch (er) { /* */ } }
    dock.classList.add('dragging');
    dock.style.top = (start.top + dy) + 'px';
    dock.style.transform = `translateX(${dx}px)`;
  });
  const end = e => {
    if (!start || e.pointerId !== start.id) return;
    if (!start.moved && !e.target.closest('button')) {
      // tap = show buttons; tapping a friend's video also makes it bigger (tap again: smaller)
      const vid = e.target.closest('.fb.video');
      if (vid) { vid.classList.toggle('big'); openDock(true); } else openDock(!dock.classList.contains('open'));
      placeDock();
    }
    if (start.moved) {
      dockPos = { side: e.clientX < innerWidth / 2 ? 'left' : 'right', y: (dock.offsetTop + dock.offsetHeight / 2) / innerHeight, t: dock.offsetTop / innerHeight };
      try { localStorage.setItem(DOCK_KEY, JSON.stringify(dockPos)); } catch (er) { /* */ }
    }
    dock.classList.remove('dragging');
    dock.style.transform = '';
    start = null;
    placeDock();
  };
  dock.addEventListener('pointerup', end);
  dock.addEventListener('pointercancel', end);
  addEventListener('resize', placeDock);
}

function renderBubbles(s) {
  const want = new Map(s.buddies.map(f => [f.uid, f]));
  for (const el of [...list.children]) if (!want.has(el.dataset.uid)) el.remove();
  for (const f of s.buddies) {
    let el = list.querySelector(`[data-uid="${CSS.escape(f.uid)}"]`);
    if (!el) {
      el = document.createElement('div');
      el.className = 'fb';
      el.dataset.uid = f.uid;
      // <audio> plays their voice. <video> (muted, sound comes from <audio>) is ready for cameras.
      el.innerHTML = `<div class="fb-face" style="--c:${colorFor(f.uid)}"><b></b><video playsinline autoplay muted></video></div><span class="fb-game" hidden></span><div class="fb-side"><button class="fb-quiet" aria-label="Mute friend"></button><button class="fb-ring" aria-label="Call">${icon('phone')}</button><button class="fb-ring fb-vring" aria-label="Video call">${icon('video')}</button><button class="fb-chat" aria-label="Send a message">${icon('chat')}</button><div class="fb-where"></div></div><div class="fb-name"></div><div class="fb-state" hidden></div><audio autoplay playsinline></audio>`;
      el.querySelector('.fb-quiet').addEventListener('click', () => {
        sound.pop();
        quiet.has(f.uid) ? quiet.delete(f.uid) : quiet.add(f.uid);
        openDock(true);
        renderBubbles(friendState());
      });
      el.querySelector('.fb-chat').addEventListener('click', () => { sound.pop(); openCompose(el.dataset.uid); });
      el.querySelectorAll('.fb-ring').forEach(b => b.addEventListener('click', () => { sound.pop(); callFriend(f.uid, b.classList.contains('fb-vring')); openDock(true); }));
      list.appendChild(el);
      sound.pop();
    }
    el.classList.toggle('on', f.status === 'on' || !f.inCall);
    el.classList.toggle('incall', f.inCall);
    el.classList.toggle('calling', !!f.calling);
    el.querySelectorAll('.fb-ring').forEach(b => { b.hidden = f.inCall || s.friends.length >= MAX_FRIENDS; });
    el.querySelector('.fb-face b').textContent = f.face || [...f.name][0] || '?';
    el.classList.toggle('has-face', !!f.face);
    el.querySelector('.fb-name').textContent = f.name;
    const g = gameOf(f.game), gb = el.querySelector('.fb-game');
    if (gb.dataset.g !== (f.game || '')) { gb.dataset.g = f.game || ''; gb.innerHTML = g ? (gameArt(g.id) || g.icon) : ''; gb.style.setProperty('--c', g ? g.color : '#fff'); }
    gb.hidden = !g;
    el.querySelector('.fb-where').textContent = whereText(true, f.game);
    el.title = `${f.name}: ${whereText(true, f.game)}`;
    const v = el.querySelector('video'), a = el.querySelector('audio');
    // Video only gets the stream while their camera is on (iPad: two players on one voice can sound wrong).
    const vts = f.stream ? f.stream.getVideoTracks().filter(t => t.readyState === 'live') : [];
    const vt = vts.find(t => !t.muted) || vts[vts.length - 1]; // 'muted' isn't always right, so it's only a preference
    const showVid = !!(f.inCall && f.cam && vt && f.status === 'on'); // link down: no frozen picture
    if (vt && (!el._vs || el._vs.getVideoTracks()[0] !== vt)) el._vs = new MediaStream([vt]); // video only: voice plays from <audio>
    const vs = showVid ? el._vs : null;
    if (v.srcObject !== vs) { v.srcObject = vs; if (vs) v.play().catch(() => {}); }
    const q = quiet.has(f.uid);
    playVoice(a, f.stream, q);
    el.classList.toggle('quiet', q);
    el.querySelector('.fb-quiet').textContent = q ? '🔈' : '🔊';
    el.classList.toggle('video', showVid);
    // How the link is doing (always shown, not just on hover)
    const stTxt = !f.inCall ? '' : f.status !== 'on' ? (f.stuck ? "Can't connect" : 'Connecting…') : f.weak ? 'Weak line' : '';
    const stEl = el.querySelector('.fb-state');
    stEl.textContent = stTxt; stEl.hidden = !stTxt;
    stEl.classList.toggle('bad', !!f.stuck);
    if (!showVid) el.classList.remove('big');
  }
  for (const u of quiet) if (!want.has(u) || !want.get(u).inCall) quiet.delete(u);
  tidyVoices(new Set(s.buddies.filter(f => f.inCall && !quiet.has(f.uid)).map(f => f.stream).filter(Boolean)));
  dock.classList.toggle('incall', s.inGroup);
  // my camera: button + my own little (mirrored) bubble while it's on
  camBtn.innerHTML = s.camStatus === 'asking' ? '⏳' : s.camStatus === 'denied' ? '🚫' : icon(s.camStatus === 'on' ? 'video' : 'videoOff');
  camBtn.classList.toggle('off', s.camStatus !== 'on');
  const mv = meEl.querySelector('video');
  if (mv.srcObject !== (s.myCam || null)) { mv.srcObject = s.myCam || null; if (s.myCam) mv.play().catch(() => {}); }
  // "Me" bubble while in a call: my controls pop out beside it (they're about me, for everyone).
  meEl.hidden = !s.inGroup;
  meEl.classList.toggle('video', !!s.myCam);
  meEl.classList.toggle('has-face', !!myFace());
  meEl.querySelector('.fb-face b').textContent = myFace() || [...(myName() || '?')][0];
  micBtn.innerHTML = s.micStatus === 'denied' ? '🚫' : s.micStatus === 'asking' ? '⏳' : icon(s.micStatus === 'on' && !s.muted ? 'mic' : 'micOff');
  micBtn.classList.toggle('off', s.micStatus !== 'on' || s.muted);
  badge.hidden = !(s.muted || s.micStatus === 'denied');
  badge.innerHTML = s.micStatus === 'denied' ? '🚫' : icon('micOff');
  if (!s.buddies.length) openDock(false);
  dock.hidden = !s.buddies.length;
  placeDock();
}

// ------------------------------------------------------------ "wants to connect" popup (any screen)

let shownKnock = null;
function renderKnock(s) {
  const k = s.knocks[0];
  if ((k && k.pid) === shownKnock) return;
  shownKnock = k ? k.pid : null;
  knockEl.hidden = !k;
  if (!k) return;
  knockEl.innerHTML = `<div class="app-help-card fk-card">
      <div class="fk-ring${k.face ? ' face' : ''}">${k.face || icon('phone')}</div>
      <div class="fk-name">${nameHTML(k.name)}</div>
      <div class="fi-says">${k.saved ? 'is calling you' : 'wants to be friends'}</div>
      <div class="name-row">
        <button class="app-btn fk-no" aria-label="No">${icon('close')}</button>
        <button class="app-btn fk-yes name-ok" aria-label="Yes">${icon('check')}</button>${k.saved ? `<button class="app-btn fk-yes fk-video name-ok" aria-label="Yes with video">${icon('video')}</button>` : ''}
      </div>
    </div>`;
  knockEl.querySelectorAll('.fk-yes').forEach(b => b.addEventListener('click', () => { sound.pop(); accept(k.pid, b.classList.contains('fk-video')); }));
  knockEl.querySelector('.fk-no').addEventListener('click', () => { sound.pop(); decline(k.pid); });
  sound.pop();
}

// ------------------------------------------------------------ "Kit says you know Sam" popup (any screen)

let shownIntro = '', introEl = null;
function renderIntro(s) {
  const v = s.knocks.length ? null : s.intros[0]; // a call comes first
  const key = v ? v.pid : '';
  if (key === shownIntro) return;
  shownIntro = key;
  introEl.hidden = !v;
  if (!v) return;
  introEl.innerHTML = `<div class="app-help-card fk-card">
      <div class="fn-from"><span>${v.fromFace || ''}</span> ${nameHTML(v.fromName)} says you know</div>
      <div class="fk-ring${v.face ? ' face' : ''}" style="--c:${colorFor(v.uid)}">${v.face || nameHTML(v.name).slice(0, 1)}</div>
      <div class="fk-name">${nameHTML(v.name)}</div>
      <div class="fi-says">Be friends?</div>
      <div class="name-row">
        <button class="app-btn fk-no" aria-label="No">${icon('close')}</button>
        <button class="app-btn fn-yes name-ok" aria-label="Yes">${icon('check')}</button>
      </div>
    </div>`;
  introEl.querySelector('.fn-yes').addEventListener('click', () => { sound.pop(); answerIntro(v.pid, true); });
  introEl.querySelector('.fk-no').addEventListener('click', () => { sound.pop(); answerIntro(v.pid, false); });
  sound.pop();
}

// ------------------------------------------------------------ introduce friends (from the friends panel)
// Step 1: who's the new friend? Step 2: who to meet them (all ticked, tap to leave out).
function openIntroduce() {
  let who = null;
  const out = new Set();
  const o = document.createElement('div');
  o.className = 'ui-overlay tg-pick fintro-pick';
  const face = c => `<span class="tg-face">${c.face || nameHTML(c.name).slice(0, 1)}</span><b>${nameHTML(c.name)}</b>`;
  const draw = () => {
    const all = friendState().contacts;
    const w = who && all.find(c => c.uid === who);
    const others = w ? all.filter(c => c.uid !== who) : all;
    o.innerHTML = `<div class="ui-panel">
        <div class="ui-kicker">${icon('people')} Introduce friends</div>
        <h2 class="ui-title">${w ? `Who should meet ${nameHTML(w.name)}?` : 'Who is the new friend?'}</h2>
        <p class="ui-sub">${w ? 'Tap a friend to leave them out.' : 'Tap the friend you want to introduce.'}</p>
        <div class="tg-pick-list">${others.map(c => w
          ? `<button class="tg-pick-f${out.has(c.uid) ? '' : ' on'}" data-uid="${c.uid}" aria-pressed="${!out.has(c.uid)}">${face(c)}<i>${icon('check')}</i></button>`
          : `<button class="tg-pick-f on fintro-who" data-who="${c.uid}">${face(c)}</button>`).join('')}</div>
        <div class="ui-row"><button class="ui-btn ghost fintro-no">${icon(w ? 'back' : 'close')}<span>${w ? 'Back' : 'Cancel'}</span></button>
          ${w ? `<button class="ui-btn primary big fintro-go"${others.some(c => !out.has(c.uid)) ? '' : ' disabled'}>${icon('check')}<span>Introduce</span></button>` : ''}</div>
      </div>`;
  };
  const close = () => o.remove();
  o.addEventListener('click', e => {
    if (e.target === o) { sound.pop(); close(); return; }
    const b = e.target.closest('button');
    if (!b) return;
    sound.pop();
    if (b.dataset.who) { who = b.dataset.who; out.clear(); draw(); }
    else if (b.dataset.uid) { out.has(b.dataset.uid) ? out.delete(b.dataset.uid) : out.add(b.dataset.uid); draw(); }
    else if (b.matches('.fintro-no')) { if (who) { who = null; draw(); } else close(); }
    else if (b.matches('.fintro-go')) {
      const to = friendState().contacts.map(c => c.uid).filter(u => u !== who && !out.has(u));
      const c = friendState().contacts.find(x => x.uid === who);
      if (!introduce(who, to)) return;
      close();
      sayAt(who, `${icon('check')} Introduced ${nameHTML(c ? c.name : '')}!`, true);
    }
  });
  shield(o);
  draw();
  document.body.appendChild(o);
}

// ------------------------------------------------------------ "come and play" invite popup (any screen)

let shownInvite = '';
function renderInvite(s) {
  const v = s.knocks.length ? null : s.invites[0]; // a knock comes first
  const key = v ? v.uid + ':' + v.code : '';
  if (key === shownInvite) return;
  shownInvite = key;
  inviteEl.hidden = !v;
  if (!v) return;
  const g = GAMES.find(x => x.id === v.game);
  if (!g) { dismissInvite(v); return; }
  inviteEl.innerHTML = `<div class="app-help-card fi-card">
      <div class="fi-who"><span class="fi-face">${v.face || '🙂'}</span><b>${nameHTML(v.name)}</b></div>
      <div class="fi-says">wants to play</div>
      <div class="fi-game" style="--c:${g.color}"><span class="fi-art">${gameArt(g.id) || g.icon}</span><b>${g.name}</b></div>
      <div class="name-row">
        <button class="app-btn fk-no fi-no" aria-label="No">${icon('close')}</button>
        <button class="app-btn name-ok fi-yes" aria-label="Play">${icon('check')}</button>
      </div>
    </div>`;
  inviteEl.querySelector('.fi-yes').addEventListener('click', () => {
    sound.pop(); dismissInvite(v);
    closePanel();
    location.hash = `#/${v.game}?join=${v.code}`;
  });
  inviteEl.querySelector('.fi-no').addEventListener('click', () => { sound.pop(); declineInvite(v); });
  sound.pop();
}

// ------------------------------------------------------------ menu bar + panel

export function friendBarHTML() { return '<div class="friend-bar"></div>'; }

function renderBar(s) {
  const bar = document.querySelector('.friend-bar');
  if (!bar) return;
  // Just a phone button (the code is in the panel). Little number = friends connected.
  let inner = s.codeStatus === 'offline' ? '📵' : icon('people');
  const on = s.buddies.length;
  if (on) inner += `<span class="fbar-count on">${on}</span>`;
  else inner += `<span class="fbar-plus">${icon('plus')}</span>`;
  bar.innerHTML = `<button class="fbar-btn${s.friends.length ? ' live' : ''}" aria-label="Friends">${inner}</button>`;
  bar.firstChild.addEventListener('click', () => {
    sound.pop();
    if (s.codeStatus === 'noname') onEditName(true);
    else openPanel();
  });
}

const OUT_MSG = {
  asking: n => `⏳ ${n ? nameHTML(n) : ''}…`,
  away: () => '😴 Not on',
  added: n => `🎉 Friends with ${n ? nameHTML(n) : 'them'}!`,
  no: () => '🙅 No',
  full: () => '👫 Full',
  none: () => '🤷 Not found',
  self: () => '🙃 That\'s you',
  offline: () => '📵 No internet',
};

let entry = [];
let adding = false, editing = false, sureRm = null;
function openPanel(add = false) {
  if (panel) return;
  entry = []; editing = false; sureRm = null;
  adding = add || !friendState().contacts.length; // no friends yet: straight to adding one
  panel = document.createElement('div');
  panel.className = 'app-help friend-panel';
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); else panelClick(e); });
  shield(panel);
  document.body.appendChild(panel);
  renderPanel(friendState());
}
function closePanel() {
  if (!panel) return;
  panel.remove(); panel = null;
  const s = friendState();
  if (s.outgoing && s.outgoing.status !== 'asking') cancelAsk();
}

function friendRow(c, s) {
  const full = s.friends.length >= MAX_FRIENDS;
  let act = '';
  const chat = c.online && !editing ? `<button class="frow-btn fchat" data-msg="${c.uid}" aria-label="Send a message">${icon('chat')}</button>` : '';
  if (editing) act = sureRm === c.uid
    ? `<button class="frow-btn frm sure" data-rm="${c.uid}" aria-label="Yes, remove">${icon('check')}</button>`
    : `<button class="frow-btn frm" data-rm="${c.uid}" aria-label="Remove">${icon('trash')}</button>`;
  else if (c.inCall) act = `<span class="frow-tag">${icon('phone')} In call</span>`;
  else if (c.calling) act = `<button class="frow-btn fcancel calling" aria-label="Stop">${icon('close')}</button>`;
  else if (c.online && !full) act = `<button class="frow-btn fring fvring" data-call="${c.uid}" data-video="1" aria-label="Video call">${icon('video')}</button><button class="frow-btn fring" data-call="${c.uid}" aria-label="Call">${icon('phone')}</button>`;
  const said = c.said && c.said !== 'asking' && OUT_MSG[c.said] ? `<small class="frow-said">${OUT_MSG[c.said]()}</small>` : '';
  const status = c.calling ? `Calling… ⏳` : whereText(c.online, c.game);
  const g = gameOf(c.game);
  return `<div class="frow${c.online ? ' on' : ''}${c.inCall ? ' incall' : ''}">
      <span class="frow-face" style="--c:${colorFor(c.uid)}">${c.face || nameHTML(c.name).slice(0, 1)}<i></i></span>
      <span class="frow-txt"><b>${nameHTML(c.name)}</b><small>${c.online && g ? `<span class="frow-game">${gameArt(g.id) || g.icon}</span>` : ''}${status}</small>${said}</span>
      ${chat}${act}
    </div>`;
}

// ------------------------------------------------------------ quick messages (never kept)
const QUICK = ['👋 Hi!', '😂', '👍', '❤️', '🎮 Come and play!', '📞 Call me!'];
let composeEl = null;
function openCompose(uid) {
  const c = friendState().contacts.find(x => x.uid === uid);
  if (!c) return;
  if (composeEl) composeEl.remove();
  const o = composeEl = document.createElement('div');
  o.className = 'app-help fmsg-box';
  o.innerHTML = `<form class="app-help-card fmsg-card">
      <div class="fmsg-to"><span class="frow-face" style="--c:${colorFor(uid)}">${c.face || nameHTML(c.name).slice(0, 1)}</span><b>Message ${nameHTML(c.name)}</b></div>
      <div class="fmsg-quick">${QUICK.map(q => `<button type="button" class="ui-chip">${q}</button>`).join('')}</div>
      <div class="fmsg-row"><input class="name-input fmsg-input" maxlength="${MSG_MAX}" placeholder="Type a message" autocomplete="off" spellcheck="true" enterkeyhint="send" aria-label="Message">
        <button type="submit" class="app-btn name-ok fmsg-send" aria-label="Send">${icon('send')}</button></div>
    </form>`;
  const input = o.querySelector('input');
  const close = () => { o.remove(); if (composeEl === o) composeEl = null; };
  const send = text => {
    if (!sendMessage(uid, text)) { input.focus(); return; }
    sound.pop(); close();
    sayAt(uid, `${icon('check')} Sent`, true);
  };
  o.querySelectorAll('.fmsg-quick button').forEach(b => b.addEventListener('click', () => send(b.textContent)));
  o.querySelector('form').addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  o.addEventListener('click', e => { if (e.target === o) close(); });
  shield(o);
  document.body.appendChild(o);
  input.focus();
}
// A speech bubble out of a friend's bubble (or a note at the top if their bubble isn't showing).
function sayAt(uid, html, mine) {
  const fb = list && list.querySelector(`.fb[data-uid="${CSS.escape(uid)}"]`);
  const host = fb || document.body;
  const old = host.querySelector(':scope > .fb-say');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'fb-say' + (fb ? '' : ' loose') + (mine ? ' mine' : '');
  el.innerHTML = html;
  if (!mine) el.addEventListener('click', e => { e.stopPropagation(); sound.pop(); el.remove(); openCompose(uid); });
  host.appendChild(el);
  const ms = mine ? 1800 : Math.min(15000, 6000 + el.textContent.length * 120);
  setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 400); }, ms);
}
function showMessage(m) {
  const t = m.text.replace(/[<>&"]/g, ch => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[ch]));
  const inBubble = list && list.querySelector(`.fb[data-uid="${CSS.escape(m.uid)}"]`);
  sayAt(m.uid, inBubble ? t : `<b>${m.face || ''} ${nameHTML(m.name)}</b> ${t}`);
  sound.pop();
}

function renderPanel(s) {
  if (!panel) return;
  const out = s.outgoing;
  const newOut = out && out.code && out.code[0] !== 'h' ? out : null; // asking by code (not calling a saved friend)
  const slots = Array.from({ length: FRIEND_CODE_LEN }, (_, i) => `<span class="fslot pic">${entry[i] != null ? picImg(entry[i]) : ''}</span>`).join('');
  const full = s.friends.length >= MAX_FRIENDS;
  const list = s.contacts;
  const justAdded = newOut && newOut.status === 'added';
  if (justAdded) adding = false;
  const html = `<div class="app-help-card friend-card">
      <div class="fhead"><h2>${icon('people')} My friends</h2>
        ${list.length ? `<button class="fsmall fedit${editing ? ' on' : ''}" aria-label="Edit friends">${icon(editing ? 'check' : 'edit')}</button>` : ''}</div>
      ${justAdded ? `<div class="fmsg fadded">${OUT_MSG.added(newOut.name)}</div>` : ''}
      ${list.length ? `<div class="flistv">${list.map(c => friendRow(c, s)).join('')}</div>` : `<div class="fempty">No friends yet. Add one with their pictures!</div>`}
      ${adding ? `<div class="fsec fadd">
        <div class="flabel">${icon('user')} My pictures <small>(show your friend)</small></div>
        <div class="fcode big">${s.codeStatus === 'ok' ? picsHTML(s.code) : (s.codeStatus === 'offline' ? '📵' : '⏳')}</div>
        ${full ? '' : `<div class="flabel">${icon('plus')} Friend's pictures</div>
        <div class="fslots">${slots}</div>
        <div class="fpad">${CODE_PICS.map((p, i) => `<button data-i="${i}" class="pic" aria-label="${p}">${picImg(i)}</button>`).join('')}</div>
        <div class="name-row">
          <button class="app-btn fback" aria-label="Delete">${icon('backspace')}</button>
          <button class="app-btn fcall name-ok" aria-label="Connect" ${entry.length === FRIEND_CODE_LEN ? '' : 'disabled'}>${icon('check')}</button>
        </div>
        ${newOut ? `<div class="fmsg">${OUT_MSG[newOut.status](newOut.name)}${newOut.status === 'asking' ? ` <button class="fsmall fcancel" aria-label="Stop">${icon('close')}</button>` : ''}</div>` : ''}`}
      </div>` : `<button class="tg-btn small fadd-btn">${icon('plus')}<span>Add a friend</span></button>${list.length >= 2 && !editing ? `<button class="tg-btn small fintro-btn">${icon('people')}<span>Introduce friends</span></button>` : ''}`}
      ${s.friends.length ? `<div class="fsec">
        <div class="flabel">${icon('phone')} In the call</div>
        <div class="flist">${s.friends.map(f => `<span class="fchip${f.status === 'on' ? ' on' : ''}" style="--c:${colorFor(f.uid)}">${f.face ? f.face + ' ' : ''}${nameHTML(f.name)}</span>`).join('')}</div>
        <select class="fmic" aria-label="Microphone" hidden></select>
        <div class="name-row"><button class="app-btn ftools" aria-label="Voice tools">${icon('settings')}</button><button class="app-btn fleave" aria-label="End call">${icon('hangup')}</button></div>
      </div>` : ''}
      <button class="app-btn fclose" aria-label="Close">${icon('check')}</button>
    </div>`;
  // Only redraw what changed (rebuilding everything made the pictures flash on iPad).
  const t = document.createElement('div');
  t.innerHTML = html;
  if (panel.firstChild) patch(panel.firstChild, t.firstChild); else panel.appendChild(t.firstChild);
  const q = sel => panel.querySelector(sel);
  const sel = q('.fmic');
  if (sel && s.micStatus === 'on' && !sel.dataset.filled) { sel.dataset.filled = '1'; listMics().then(mics => {
    if (!panel || !sel.isConnected || mics.length < 2) return;
    sel.innerHTML = mics.map(m => `<option value="${m.id.replace(/"/g, '')}"${m.chosen ? ' selected' : ''}>🎤 ${m.label.replace(/[<>&"]/g, '')}</option>`).join('');
    sel.hidden = false;
    sel.addEventListener('change', () => { sound.pop(); chooseMic(sel.value); });
  }); }
}

// Make `cur` look like `want`, keeping nodes that haven't changed (so images don't reload).
function patch(cur, want) {
  if (cur.isEqualNode(want)) return;
  if (cur.nodeName === 'SELECT' && want.nodeName === 'SELECT') return; // keep the mic list it filled in
  if (cur.nodeType !== want.nodeType || cur.nodeName !== want.nodeName || cur.nodeType !== 1) {
    cur.replaceWith(want); return;
  }
  for (const at of [...cur.attributes]) if (!want.hasAttribute(at.name)) cur.removeAttribute(at.name);
  for (const at of [...want.attributes]) if (cur.getAttribute(at.name) !== at.value) cur.setAttribute(at.name, at.value);
  const a = [...cur.childNodes], b = [...want.childNodes];
  for (let k = 0; k < b.length; k++) {
    if (k < a.length) patch(a[k], b[k]);
    else cur.appendChild(b[k]);
  }
  for (let k = b.length; k < a.length; k++) a[k].remove();
}

// One click handler for the whole panel (the panel is patched, not rebuilt).
function panelClick(e) {
  const btn = e.target.closest('button');
  if (!btn || !panel.contains(btn)) return;
  const re = () => renderPanel(friendState());
  if (btn.matches('.fclose')) { sound.pop(); closePanel(); }
  else if (btn.matches('.fadd-btn')) { sound.pop(); adding = true; cancelAsk(); newCode(); re(); }
  else if (btn.matches('.fintro-btn')) { sound.pop(); closePanel(); openIntroduce(); }
  else if (btn.matches('.fedit')) { sound.pop(); editing = !editing; sureRm = null; re(); }
  else if (btn.dataset.call) { sound.pop(); callFriend(btn.dataset.call, !!btn.dataset.video); }
  else if (btn.dataset.rm) {
    sound.pop();
    if (sureRm !== btn.dataset.rm) { sureRm = btn.dataset.rm; re(); return; } // tap again to be sure
    sureRm = null;
    removeFriend(btn.dataset.rm);
  } else if (btn.closest('.fpad')) {
    if (entry.length >= FRIEND_CODE_LEN) return;
    sound.pop(); entry.push(+btn.dataset.i); re();
  } else if (btn.matches('.fback')) { sound.pop(); entry.pop(); re(); }
  else if (btn.matches('.fcall')) {
    if (entry.length !== FRIEND_CODE_LEN) return;
    sound.pop();
    askFriend(entry.map(i => i.toString(16)).join(''));
    entry = [];
  } else if (btn.matches('.fcancel')) { sound.pop(); cancelAsk(); }
  else if (btn.matches('.fleave')) { sound.pop(); leaveGroup(); }
  else if (btn.matches('.ftools')) { sound.pop(); openVoiceTools(); }
  else if (btn.dataset.msg) { sound.pop(); const u = btn.dataset.msg; closePanel(); openCompose(u); }
}

// ------------------------------------------------------------ start

export function mountFriends({ editName }) {
  onEditName = editName;
  layer = document.createElement('div');
  layer.className = 'friends-layer';
  layer.innerHTML = `<div class="fb-dock" hidden><div class="fb-list"></div><div class="fb fb-me on" hidden><div class="fb-face"><b></b><video playsinline autoplay muted></video></div><div class="fb-tools"><button class="fb-mic" aria-label="My microphone">${icon('mic')}</button><button class="fb-cam off" aria-label="My camera">${icon('videoOff')}</button><button class="fb-hang" aria-label="Hang up">${icon('hangup')}</button></div><span class="fb-badge" hidden>${icon('micOff')}</span><div class="fb-name">Me</div></div></div><div class="app-help fk" hidden></div><div class="app-help fk fi" hidden></div><div class="app-help fk fn" hidden></div>`;
  document.body.appendChild(layer);
  dock = layer.querySelector('.fb-dock');
  list = layer.querySelector('.fb-list');
  micBtn = layer.querySelector('.fb-mic');
  hangBtn = layer.querySelector('.fb-hang');
  badge = layer.querySelector('.fb-badge');
  // Hang up: tap twice (first tap asks "sure?") so a stray tap doesn't end the call.
  hangBtn.addEventListener('click', () => {
    sound.pop();
    if (hangBtn.classList.contains('sure')) { openDock(false); leaveGroup(); return; }
    hangBtn.classList.add('sure'); hangBtn.innerHTML = icon('check');
    openDock(true);
  });
  camBtn = layer.querySelector('.fb-cam');
  meEl = layer.querySelector('.fb-me');
  camBtn.addEventListener('click', () => {
    sound.pop();
    openDock(true);
    if (friendState().camStatus === 'on') stopCam(); else startCam();
  });
  micBtn.addEventListener('click', () => {
    const s = friendState();
    sound.pop();
    openDock(true);
    if (s.micStatus === 'on') setMuted(!s.muted);
    else { setMuted(false); startMic(); }
  });
  // Browsers only play sound after a tap: any tap starts friends' voices if they were blocked.
  document.addEventListener('pointerdown', () => {
    layer.querySelectorAll('.fb audio').forEach(a => { if (a.srcObject && a.paused) a.play().catch(() => {}); });
    unlockVoices();
  }, true);
  knockEl = layer.querySelector('.fk:not(.fi)');
  inviteEl = layer.querySelector('.fi');
  introEl = layer.querySelector('.fn');
  shield(dock); shield(knockEl); shield(inviteEl); shield(introEl);
  // Games ask for this ("Play with friends" before linking up).
  window.addEventListener('kg-open-friends', () => {
    if (friendState().codeStatus === 'noname') onEditName(true);
    else openPanel();
  });
  wireDrag();
  let wasAsking = false;
  onFriends(s => {
    renderBubbles(s);
    renderKnock(s);
    renderInvite(s);
    renderIntro(s);
    renderBar(s);
    // they said yes: close the panel so the bubble shows
    if (panel && wasAsking && !s.outgoing && s.inGroup) closePanel();
    else renderPanel(s);
    wasAsking = !!(s.outgoing && s.outgoing.status === 'asking');
  });
  onVoiceOpts(() => renderBubbles(friendState()));
  onMessage(showMessage);
  startFriends();
}

// Menu was just drawn: fill in the bar.
export const refreshFriendBar = () => renderBar(friendState());
export { newCode };
