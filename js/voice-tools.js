// Playing friends' voices, plus the 🔧 voice tools (info + switches to try when a voice sounds wrong).
import { icon } from './engine/icons.js';
import { voiceOpts, setVoiceOpt, onVoiceOpts } from './engine/voice-opts.js';
import { friendPeers, micTrack } from './engine/friends.js';
import { audioCtx } from './engine/sound.js';
import { nameHTML } from './engine/profile.js';
import { sound } from './engine/sound.js';

// ------------------------------------------------------------ voice player
// 'element': an <audio> per friend (normal).  'webaudio': through one Web Audio context at 48 kHz.
let vctx = null;
const nodes = new Map(); // stream -> source node
function voiceCtx() {
  if (!vctx) {
    try { vctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 }); }
    catch (e) { vctx = new (window.AudioContext || window.webkitAudioContext)(); }
  }
  if (vctx.state === 'suspended') vctx.resume().catch(() => {});
  return vctx;
}

// Called for each bubble's <audio> whenever things change.
export function playVoice(audioEl, stream) {
  const web = voiceOpts().player === 'webaudio';
  if (audioEl.srcObject !== (stream || null)) audioEl.srcObject = stream || null;
  audioEl.muted = web; // Chrome needs the element playing (muted) for Web Audio to get the sound
  if (stream && audioEl.paused) audioEl.play().catch(() => {});
  if (web && stream && stream.getAudioTracks().length && !nodes.has(stream)) {
    try {
      const c = voiceCtx();
      const src = c.createMediaStreamSource(stream);
      src.connect(c.destination);
      nodes.set(stream, src);
    } catch (e) { /* stays on the element */ }
  }
}
export function tidyVoices(liveStreams) {
  for (const [st, n] of nodes) {
    if (voiceOpts().player !== 'webaudio' || !liveStreams.has(st)) { try { n.disconnect(); } catch (e) { /* */ } nodes.delete(st); }
  }
  if (!nodes.size && vctx) { vctx.close().catch(() => {}); vctx = null; }
}
export function unlockVoices() { if (vctx && vctx.state === 'suspended') vctx.resume().catch(() => {}); }

// ------------------------------------------------------------ 🔧 tools
let el = null, timer = null;
const last = new Map(); // peer uid -> { t, samples }

async function info() {
  const rows = [];
  const ua = navigator.userAgent;
  rows.push(['Device', /iPad|Macintosh.*Mobile|iPhone/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua)) ? 'iPad/iPhone' : /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : 'Other']);
  const g = audioCtx();
  rows.push(['Game sound rate', g ? `${g.sampleRate} Hz` : 'off']);
  if (vctx) rows.push(['Voice player rate', `${vctx.sampleRate} Hz (${vctx.state})`]);
  const t = micTrack();
  if (t) {
    const s = t.getSettings();
    rows.push(['My mic', `${(t.label || '?').slice(0, 28)}`]);
    rows.push(['My mic rate', `${s.sampleRate || '?'} Hz, ${s.channelCount || '?'} ch, echo ${s.echoCancellation ? 'on' : 'off'}`]);
  } else rows.push(['My mic', 'off']);
  for (const p of friendPeers()) {
    let codec = '?', rate = '?', level = '?', lost = '?', pkt = '?', jit = '?', buf = '?', speed = '?', path = '?', rtt = '?';
    try {
      const stats = await p.pc.getStats();
      const byId = new Map(); stats.forEach(r => byId.set(r.id, r));
      stats.forEach(r => {
        if (r.type !== 'inbound-rtp' || r.kind !== 'audio') return;
        const c = byId.get(r.codecId);
        if (c) codec = `${(c.mimeType || '').replace('audio/', '')} ${c.clockRate || ''} ${c.channels ? c.channels + 'ch' : ''}`;
        if (r.audioLevel != null) level = r.audioLevel.toFixed(2);
        if (r.totalSamplesReceived != null) {
          const now = performance.now(), prev = last.get(p.uid);
          if (prev) rate = Math.round((r.totalSamplesReceived - prev.samples) / ((now - prev.t) / 1000)) + '/s';
          last.set(p.uid, { t: now, samples: r.totalSamplesReceived });
        }
        // real gaps only (not quiet moments where the sender sends nothing on purpose)
        if (r.concealedSamples != null && r.totalSamplesReceived) lost = Math.round(100 * (r.concealedSamples - (r.silentConcealedSamples || 0)) / r.totalSamplesReceived) + '%';
        if (r.packetsReceived != null) pkt = (100 * (r.packetsLost || 0) / Math.max(1, r.packetsReceived + (r.packetsLost || 0))).toFixed(1) + '%';
        if (r.jitter != null) jit = Math.round(r.jitter * 1000) + 'ms';
        if (r.jitterBufferEmittedCount) buf = Math.round(1000 * r.jitterBufferDelay / r.jitterBufferEmittedCount) + 'ms';
        if (r.totalSamplesReceived) {
          const up = r.removedSamplesForAcceleration || 0, down = r.insertedSamplesForDeceleration || 0;
          speed = `+${(100 * up / r.totalSamplesReceived).toFixed(0)}% / -${(100 * down / r.totalSamplesReceived).toFixed(0)}%`;
        }
      });
      stats.forEach(r => {
        if (r.type !== 'candidate-pair' || !(r.nominated || r.selected) || r.state !== 'succeeded') return;
        const l = byId.get(r.localCandidateId), rm = byId.get(r.remoteCandidateId);
        const kind = c => (c ? `${c.candidateType}${c.protocol ? '/' + c.protocol : ''}` : '?');
        path = `${kind(l)} → ${kind(rm)}`;
        if (r.currentRoundTripTime != null) rtt = Math.round(r.currentRoundTripTime * 1000) + 'ms';
      });
    } catch (e) { /* */ }
    rows.push([`${nameHTML(p.name)} ⬇`, `${codec} · ${rate} · level ${level}`]);
    rows.push(['  gaps / lost', `${lost} / ${pkt} packets`]);
    rows.push(['  jitter / buffer', `${jit} / ${buf}`]);
    rows.push(['  sped up / slowed', speed]);
    rows.push(['  path / delay', `${path} · ${rtt}`]);
  }
  return rows;
}

function render() {
  if (!el) return;
  const o = voiceOpts();
  const sw = (k, on, label) => `<button class="vt-sw${on ? ' on' : ''}" data-k="${k}"><span class="vt-box">${on ? icon('check') : ''}</span> ${label}</button>`;
  el.querySelector('.vt-sws').innerHTML =
    sw('gameSounds', o.gameSounds, 'Game sounds during calls') +
    sw('player', o.player === 'webaudio', 'Play voices with Web Audio') +
    sw('echo', o.echo, 'My mic: echo/noise cleaning');
  el.querySelectorAll('.vt-sw').forEach(b => b.addEventListener('click', () => {
    sound.pop();
    const k = b.dataset.k;
    setVoiceOpt(k, k === 'player' ? (o.player === 'webaudio' ? 'element' : 'webaudio') : !o[k]);
  }));
}
async function renderInfo() {
  if (!el) return;
  const rows = await info();
  if (!el) return;
  el.querySelector('.vt-info').innerHTML = rows.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join('');
}

export function openVoiceTools() {
  if (el) return;
  el = document.createElement('div');
  el.className = 'app-help vt';
  el.innerHTML = `<div class="app-help-card vt-card">
      <div class="flabel">🔧 Voice tools</div>
      <div class="vt-sws"></div>
      <div class="vt-info"></div>
      <button class="app-btn vt-close name-ok" aria-label="Close">${icon('check')}</button>
    </div>`;
  for (const t of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'click', 'keydown']) el.addEventListener(t, e => e.stopPropagation());
  el.addEventListener('click', e => { if (e.target === el) closeVoiceTools(); });
  el.querySelector('.vt-close').addEventListener('click', () => { sound.pop(); closeVoiceTools(); });
  document.body.appendChild(el);
  render(); renderInfo();
  timer = setInterval(renderInfo, 1000);
}
function closeVoiceTools() { clearInterval(timer); if (el) el.remove(); el = null; }
onVoiceOpts(() => { render(); });
