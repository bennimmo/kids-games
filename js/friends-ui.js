// Friends on screen: the bar + panel on the menu, the "wants to connect" popup,
// and the floating friend bubbles that stay on top of every game.
import { CODE_PICS, codeToPics } from './engine/net.js';
import { nameHTML } from './engine/profile.js';
import { sound } from './engine/sound.js';
import { icon } from './engine/icons.js';
import { GAMES } from './games.js';
import { gameArt } from './game-art.js';
import { playVoice, tidyVoices, unlockVoices, openVoiceTools } from './voice-tools.js';
import { onVoiceOpts } from './engine/voice-opts.js';
import {
  onFriends, friendState, startFriends, dismissInvite, declineInvite, callFriend, removeFriend, newCode, askFriend, cancelAsk, accept, decline, leaveGroup, startMic, setMuted, listMics, chooseMic,
  FRIEND_CODE_LEN, MAX_FRIENDS,
} from './engine/friends.js';

const DOCK_KEY = 'kg-bubbles';
const COLORS = ['#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ffca28', '#26c6da', '#ec407a', '#8d6e63'];
const colorFor = uid => COLORS[[...uid].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7) % COLORS.length];
const picsHTML = c => codeToPics(c).map(p => `<span class="pic">${p}</span>`).join('');
const gameOf = id => GAMES.find(g => g.id === id);
// "Playing Kit's Karts" / "On the menu" / "Not on"
const whereText = (online, game) => !online ? 'Not on' : (gameOf(game) ? `Playing ${gameOf(game).name}` : 'On the menu');

let layer, dock, list, micBtn, hangBtn, badge, knockEl, inviteEl, panel = null;
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
  const top = Math.max(96, Math.min(innerHeight - h - 12, dockPos.y * innerHeight - h / 2));
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
    if (!start.moved && !e.target.closest('button')) openDock(!dock.classList.contains('open')); // tap = show buttons
    if (start.moved) {
      dockPos = { side: e.clientX < innerWidth / 2 ? 'left' : 'right', y: (dock.offsetTop + dock.offsetHeight / 2) / innerHeight };
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
  const want = new Map(s.friends.map(f => [f.uid, f]));
  for (const el of [...list.children]) if (!want.has(el.dataset.uid)) el.remove();
  for (const f of s.friends) {
    let el = list.querySelector(`[data-uid="${f.uid}"]`);
    if (!el) {
      el = document.createElement('div');
      el.className = 'fb';
      el.dataset.uid = f.uid;
      // <audio> plays their voice. <video> (muted, sound comes from <audio>) is ready for cameras.
      el.innerHTML = `<div class="fb-face" style="--c:${colorFor(f.uid)}"><b></b><video playsinline autoplay muted></video></div><span class="fb-game" hidden></span><button class="fb-quiet" aria-label="Mute friend"></button><div class="fb-name"></div><div class="fb-where"></div><audio autoplay playsinline></audio>`;
      el.querySelector('.fb-quiet').addEventListener('click', () => {
        sound.pop();
        quiet.has(f.uid) ? quiet.delete(f.uid) : quiet.add(f.uid);
        openDock(true);
        renderBubbles(friendState());
      });
      list.appendChild(el);
      sound.pop();
    }
    el.classList.toggle('on', f.status === 'on');
    el.querySelector('.fb-face b').textContent = f.face || [...f.name][0] || '?';
    el.classList.toggle('has-face', !!f.face);
    el.querySelector('.fb-name').textContent = f.name;
    const g = gameOf(f.game), gb = el.querySelector('.fb-game');
    if (gb.dataset.g !== (f.game || '')) { gb.dataset.g = f.game || ''; gb.innerHTML = g ? (gameArt(g.id) || g.icon) : ''; gb.style.setProperty('--c', g ? g.color : '#fff'); }
    gb.hidden = !g;
    el.querySelector('.fb-where').textContent = whereText(true, f.game);
    el.title = `${f.name}: ${whereText(true, f.game)}`;
    const v = el.querySelector('video'), a = el.querySelector('audio');
    // Video only gets the stream once there's a camera (iPad: two players on one voice can sound wrong).
    const vs = f.stream && f.stream.getVideoTracks().length ? f.stream : null;
    if (v.srcObject !== vs) v.srcObject = vs;
    const q = quiet.has(f.uid);
    playVoice(a, f.stream, q);
    el.classList.toggle('quiet', q);
    el.querySelector('.fb-quiet').textContent = q ? '🔈' : '🔊';
    el.classList.toggle('video', !!(f.stream && f.stream.getVideoTracks().length));
  }
  for (const u of quiet) if (!want.has(u)) quiet.delete(u);
  tidyVoices(new Set(s.friends.filter(f => !quiet.has(f.uid)).map(f => f.stream).filter(Boolean)));
  micBtn.innerHTML = s.micStatus === 'denied' ? '🚫' : s.micStatus === 'asking' ? '⏳' : icon(s.micStatus === 'on' && !s.muted ? 'mic' : 'micOff');
  micBtn.classList.toggle('off', s.micStatus !== 'on' || s.muted);
  badge.hidden = !(s.muted || s.micStatus === 'denied');
  badge.innerHTML = s.micStatus === 'denied' ? '🚫' : icon('micOff');
  if (!s.friends.length) openDock(false);
  dock.hidden = !s.friends.length;
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
        <button class="app-btn fk-yes name-ok" aria-label="Yes">${icon('check')}</button>
      </div>
    </div>`;
  knockEl.querySelector('.fk-yes').addEventListener('click', () => { sound.pop(); accept(k.pid); });
  knockEl.querySelector('.fk-no').addEventListener('click', () => { sound.pop(); decline(k.pid); });
  sound.pop();
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
  let inner = s.codeStatus === 'offline' ? '📵' : icon('phone');
  const on = s.contacts.filter(c => c.online && !c.inCall).length;
  if (s.friends.length) inner += `<span class="fbar-count">${s.friends.length}</span>`;
  else if (on) inner += `<span class="fbar-count on">${on}</span>`;
  bar.innerHTML = `<button class="fbar-btn${s.friends.length ? ' live' : ''}" aria-label="Friends">${inner}</button>`;
  bar.firstChild.addEventListener('click', () => {
    sound.pop();
    if (s.codeStatus === 'noname') onEditName();
    else openPanel();
  });
}

const OUT_MSG = {
  asking: n => `⏳ ${n ? nameHTML(n) : ''}…`,
  away: () => '😴 Not on',
  no: () => '🙅 No',
  full: () => '👫 Full',
  none: () => '🤷 Not found',
  self: () => '🙃 That\'s you',
  offline: () => '📵 No internet',
};

let entry = [];
let adding = false, editing = false;
function openPanel(add = false) {
  if (panel) return;
  entry = []; editing = false;
  adding = add || !friendState().contacts.length; // no friends yet: straight to adding one
  panel = document.createElement('div');
  panel.className = 'app-help friend-panel';
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
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
  if (editing) act = `<button class="frow-btn frm" data-rm="${c.uid}" aria-label="Remove">${icon('trash')}</button>`;
  else if (c.inCall) act = `<span class="frow-tag">${icon('phone')} In call</span>`;
  else if (c.calling) act = `<button class="frow-btn fcancel calling" aria-label="Stop">${icon('close')}</button>`;
  else if (c.online && !full) act = `<button class="frow-btn fring" data-call="${c.uid}" aria-label="Call">${icon('phone')}</button>`;
  const said = c.said && c.said !== 'asking' && OUT_MSG[c.said] ? `<small class="frow-said">${OUT_MSG[c.said]()}</small>` : '';
  const status = c.calling ? `Calling… ⏳` : whereText(c.online, c.game);
  const g = gameOf(c.game);
  return `<div class="frow${c.online ? ' on' : ''}${c.inCall ? ' incall' : ''}">
      <span class="frow-face" style="--c:${colorFor(c.uid)}">${c.face || nameHTML(c.name).slice(0, 1)}<i></i></span>
      <span class="frow-txt"><b>${nameHTML(c.name)}</b><small>${c.online && g ? `<span class="frow-game">${gameArt(g.id) || g.icon}</span>` : ''}${status}</small>${said}</span>
      ${act}
    </div>`;
}

function renderPanel(s) {
  if (!panel) return;
  const out = s.outgoing;
  const newOut = out && out.code && out.code[0] !== 'h' ? out : null; // asking by code (not calling a saved friend)
  const slots = Array.from({ length: FRIEND_CODE_LEN }, (_, i) => `<span class="fslot pic">${entry[i] != null ? CODE_PICS[entry[i]] : ''}</span>`).join('');
  const full = s.friends.length >= MAX_FRIENDS;
  const list = s.contacts;
  panel.innerHTML = `<div class="app-help-card friend-card">
      <div class="fhead"><h2>${icon('people')} My friends</h2>
        ${list.length ? `<button class="fsmall fedit${editing ? ' on' : ''}" aria-label="Edit friends">${icon(editing ? 'check' : 'edit')}</button>` : ''}</div>
      ${list.length ? `<div class="flistv">${list.map(c => friendRow(c, s)).join('')}</div>` : `<div class="fempty">No friends yet. Add one with their pictures!</div>`}
      ${adding ? `<div class="fsec fadd">
        <div class="flabel">${icon('user')} My pictures <small>(show your friend)</small></div>
        <div class="fcode big">${s.codeStatus === 'ok' ? picsHTML(s.code) : (s.codeStatus === 'offline' ? '📵' : '⏳')}</div>
        ${full ? '' : `<div class="flabel">${icon('plus')} Friend's pictures</div>
        <div class="fslots">${slots}</div>
        <div class="fpad">${CODE_PICS.map((p, i) => `<button data-i="${i}" class="pic">${p}</button>`).join('')}</div>
        <div class="name-row">
          <button class="app-btn fback" aria-label="Delete">${icon('backspace')}</button>
          <button class="app-btn fcall name-ok" aria-label="Connect" ${entry.length === FRIEND_CODE_LEN ? '' : 'disabled'}>${icon('check')}</button>
        </div>
        ${newOut ? `<div class="fmsg">${OUT_MSG[newOut.status](newOut.name)}${newOut.status === 'asking' ? ` <button class="fsmall fcancel" aria-label="Stop">${icon('close')}</button>` : ''}</div>` : ''}`}
      </div>` : `<button class="tg-btn small fadd-btn">${icon('plus')}<span>Add a friend</span></button>`}
      ${s.friends.length ? `<div class="fsec">
        <div class="flabel">${icon('phone')} In the call</div>
        <div class="flist">${s.friends.map(f => `<span class="fchip${f.status === 'on' ? ' on' : ''}" style="--c:${colorFor(f.uid)}">${f.face ? f.face + ' ' : ''}${nameHTML(f.name)}</span>`).join('')}</div>
        <select class="fmic" aria-label="Microphone" hidden></select>
        <div class="name-row"><button class="app-btn ftools" aria-label="Voice tools">${icon('settings')}</button><button class="app-btn fleave" aria-label="End call">${icon('hangup')}</button></div>
      </div>` : ''}
      <button class="app-btn fclose" aria-label="Close">${icon('check')}</button>
    </div>`;
  const q = sel => panel.querySelector(sel);
  q('.fclose').addEventListener('click', () => { sound.pop(); closePanel(); });
  q('.fadd-btn')?.addEventListener('click', () => { sound.pop(); adding = true; newCode(); renderPanel(friendState()); });
  q('.fedit')?.addEventListener('click', () => { sound.pop(); editing = !editing; renderPanel(friendState()); });
  panel.querySelectorAll('[data-call]').forEach(b => b.addEventListener('click', () => { sound.pop(); callFriend(b.dataset.call); }));
  panel.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
    sound.pop();
    if (!b.classList.contains('sure')) { b.classList.add('sure'); b.innerHTML = icon('check'); return; }
    removeFriend(b.dataset.rm);
  }));
  panel.querySelectorAll('.fpad button').forEach(b => b.addEventListener('click', () => {
    if (entry.length >= FRIEND_CODE_LEN) return;
    sound.pop(); entry.push(+b.dataset.i); renderPanel(friendState());
  }));
  q('.fback')?.addEventListener('click', () => { sound.pop(); entry.pop(); renderPanel(friendState()); });
  q('.fcall')?.addEventListener('click', () => {
    if (entry.length !== FRIEND_CODE_LEN) return;
    sound.pop();
    askFriend(entry.map(i => i.toString(16)).join(''));
    entry = [];
  });
  panel.querySelectorAll('.fcancel').forEach(b => b.addEventListener('click', () => { sound.pop(); cancelAsk(); }));
  q('.fleave')?.addEventListener('click', () => { sound.pop(); leaveGroup(); });
  q('.ftools')?.addEventListener('click', () => { sound.pop(); openVoiceTools(); });
  const sel = q('.fmic');
  if (sel && s.micStatus === 'on') listMics().then(mics => {
    if (!panel || !sel.isConnected || mics.length < 2) return;
    sel.innerHTML = mics.map(m => `<option value="${m.id.replace(/"/g, '')}"${m.chosen ? ' selected' : ''}>🎤 ${m.label.replace(/[<>&"]/g, '')}</option>`).join('');
    sel.hidden = false;
    sel.addEventListener('change', () => { sound.pop(); chooseMic(sel.value); });
  });
}

// ------------------------------------------------------------ start

export function mountFriends({ editName }) {
  onEditName = editName;
  layer = document.createElement('div');
  layer.className = 'friends-layer';
  layer.innerHTML = `<div class="fb-dock" hidden><div class="fb-tools"><button class="fb-mic" aria-label="My microphone">${icon('mic')}</button><button class="fb-hang" aria-label="Hang up">${icon('hangup')}</button></div><span class="fb-badge" hidden>${icon('micOff')}</span><div class="fb-list"></div></div><div class="app-help fk" hidden></div><div class="app-help fk fi" hidden></div>`;
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
  shield(dock); shield(knockEl); shield(inviteEl);
  // Games ask for this ("Play with friends" before linking up).
  window.addEventListener('kg-open-friends', () => {
    if (friendState().codeStatus === 'noname') onEditName();
    else openPanel();
  });
  wireDrag();
  let wasAsking = false;
  onFriends(s => {
    renderBubbles(s);
    renderKnock(s);
    renderInvite(s);
    renderBar(s);
    // they said yes: close the panel so the bubble shows
    if (panel && wasAsking && !s.outgoing && s.inGroup) closePanel();
    else renderPanel(s);
    wasAsking = !!(s.outgoing && s.outgoing.status === 'asking');
  });
  onVoiceOpts(() => renderBubbles(friendState()));
  startFriends();
}

// Menu was just drawn: fill in the bar.
export const refreshFriendBar = () => renderBar(friendState());
export { newCode };
