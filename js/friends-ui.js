// Friends on screen: the bar + panel on the menu, the "wants to connect" popup,
// and the floating friend bubbles that stay on top of every game.
import { CODE_PICS, codeToPics } from './engine/net.js';
import { nameHTML } from './engine/profile.js';
import { sound } from './engine/sound.js';
import { playVoice, tidyVoices, unlockVoices, openVoiceTools } from './voice-tools.js';
import { onVoiceOpts } from './engine/voice-opts.js';
import {
  onFriends, friendState, startFriends, newCode, askFriend, cancelAsk, accept, decline, leaveGroup, startMic, setMuted, listMics, chooseMic,
  FRIEND_CODE_LEN, MAX_FRIENDS,
} from './engine/friends.js';

const DOCK_KEY = 'kg-bubbles';
const COLORS = ['#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ffca28', '#26c6da', '#ec407a', '#8d6e63'];
const colorFor = uid => COLORS[[...uid].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7) % COLORS.length];
const picsHTML = c => codeToPics(c).map(p => `<span>${p}</span>`).join('');

let layer, dock, list, micBtn, hangBtn, badge, knockEl, panel = null;
const quiet = new Set(); // friends I've muted (just on this device)
let openTimer = null;
function openDock(on) {
  clearTimeout(openTimer);
  dock.classList.toggle('open', on);
  if (on) openTimer = setTimeout(() => openDock(false), 5000);
  else { hangBtn.classList.remove('sure'); hangBtn.textContent = '📴'; }
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
      el.innerHTML = `<div class="fb-face" style="--c:${colorFor(f.uid)}"><b></b><video playsinline autoplay muted></video></div><button class="fb-quiet" aria-label="Mute friend"></button><div class="fb-name"></div><audio autoplay playsinline></audio>`;
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
    el.querySelector('.fb-face b').textContent = [...f.name][0] || '?';
    el.querySelector('.fb-name').textContent = f.name;
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
  micBtn.textContent = s.micStatus === 'denied' ? '🚫' : s.micStatus === 'asking' ? '⏳' : (s.muted || s.micStatus !== 'on') ? '🔇' : '🎤';
  micBtn.classList.toggle('off', s.micStatus !== 'on' || s.muted);
  badge.hidden = !(s.muted || s.micStatus === 'denied');
  badge.textContent = s.micStatus === 'denied' ? '🚫' : '🔇';
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
      <div class="fk-ring">📞</div>
      <div class="fk-name">${nameHTML(k.name)}</div>
      <div class="name-row">
        <button class="app-btn fk-no" aria-label="No">❌</button>
        <button class="app-btn fk-yes name-ok" aria-label="Yes">✅</button>
      </div>
    </div>`;
  knockEl.querySelector('.fk-yes').addEventListener('click', () => { sound.pop(); accept(k.pid); });
  knockEl.querySelector('.fk-no').addEventListener('click', () => { sound.pop(); decline(k.pid); });
  sound.pop();
}

// ------------------------------------------------------------ menu bar + panel

export function friendBarHTML() { return '<div class="friend-bar"></div>'; }

function renderBar(s) {
  const bar = document.querySelector('.friend-bar');
  if (!bar) return;
  let inner;
  if (s.codeStatus === 'noname') inner = '<span class="fbar-ico">📞</span><b>👤 ✏️</b>';
  else if (s.codeStatus === 'offline') inner = '<span class="fbar-ico">📵</span>';
  else if (s.codeStatus === 'ok') inner = `<span class="fbar-ico">📞</span><span class="fcode">${picsHTML(s.code)}</span>`;
  else inner = '<span class="fbar-ico">📞</span><span class="fcode fcode-wait">⏳</span>';
  if (s.friends.length) inner += `<span class="fbar-count">👫 ${s.friends.length}</span>`;
  bar.innerHTML = `<button class="fbar-btn" aria-label="Friends">${inner}</button>`;
  bar.firstChild.addEventListener('click', () => {
    sound.pop();
    if (s.codeStatus === 'noname') onEditName();
    else openPanel();
  });
}

const OUT_MSG = {
  asking: n => `⏳ ${n ? nameHTML(n) : ''}…`,
  no: () => '🙅 No',
  full: () => '👫 Full',
  none: () => '🤷 Not found',
  self: () => '🙃 That\'s you',
  offline: () => '📵 No internet',
};

let entry = [];
function openPanel() {
  if (panel) return;
  entry = [];
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

function renderPanel(s) {
  if (!panel) return;
  const out = s.outgoing;
  const slots = Array.from({ length: FRIEND_CODE_LEN }, (_, i) => `<span class="fslot">${entry[i] != null ? CODE_PICS[entry[i]] : ''}</span>`).join('');
  const full = s.friends.length >= MAX_FRIENDS;
  panel.innerHTML = `<div class="app-help-card friend-card">
      <div class="fsec">
        <div class="flabel">👤 My code</div>
        <div class="fcode big">${s.codeStatus === 'ok' ? picsHTML(s.code) : (s.codeStatus === 'offline' ? '📵' : '⏳')}</div>
        <button class="fsmall fnew" aria-label="New code">🔄</button>
      </div>
      ${full ? '' : `<div class="fsec">
        <div class="flabel">👫 Friend's code</div>
        <div class="fslots">${slots}</div>
        <div class="fpad">${CODE_PICS.map((p, i) => `<button data-i="${i}">${p}</button>`).join('')}</div>
        <div class="name-row">
          <button class="app-btn fback" aria-label="Delete">⌫</button>
          <button class="app-btn fcall name-ok" aria-label="Connect" ${entry.length === FRIEND_CODE_LEN ? '' : 'disabled'}>📞</button>
        </div>
        ${out ? `<div class="fmsg">${OUT_MSG[out.status](out.name)}${out.status === 'asking' ? ' <button class="fsmall fcancel" aria-label="Stop">✖️</button>' : ''}</div>` : ''}
      </div>`}
      ${s.friends.length ? `<div class="fsec">
        <div class="flist">${s.friends.map(f => `<span class="fchip${f.status === 'on' ? ' on' : ''}" style="--c:${colorFor(f.uid)}">${nameHTML(f.name)}</span>`).join('')}</div>
        <select class="fmic" aria-label="Microphone" hidden></select>
        <div class="name-row"><button class="app-btn ftools" aria-label="Voice tools">🔧</button><button class="app-btn fleave" aria-label="End call">👋</button></div>
      </div>` : ''}
      <button class="app-btn fclose" aria-label="Close">✔️</button>
    </div>`;
  const q = sel => panel.querySelector(sel);
  q('.fnew').addEventListener('click', () => { sound.pop(); newCode(); });
  q('.fclose').addEventListener('click', () => { sound.pop(); closePanel(); });
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
  q('.fcancel')?.addEventListener('click', () => { sound.pop(); cancelAsk(); });
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
  layer.innerHTML = '<div class="fb-dock" hidden><div class="fb-tools"><button class="fb-mic" aria-label="My microphone">🎤</button><button class="fb-hang" aria-label="Hang up">📴</button></div><span class="fb-badge" hidden>🔇</span><div class="fb-list"></div></div><div class="app-help fk" hidden></div>';
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
    hangBtn.classList.add('sure'); hangBtn.textContent = '✔️';
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
  knockEl = layer.querySelector('.fk');
  shield(dock); shield(knockEl);
  wireDrag();
  let wasAsking = false;
  onFriends(s => {
    renderBubbles(s);
    renderKnock(s);
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
