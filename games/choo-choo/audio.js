// Choo Choo Wilf: sounds made with Web Audio (no files).
import { audioCtx } from '../../js/engine/sound.js';

let out = null, nbuf = null, unlocked = false;
function ctx() {
  if (!unlocked) return null;
  const a = audioCtx();
  if (!a) return null;
  if (!out) {
    out = a.createGain(); out.gain.value = 0.9; out.connect(a.destination);
    nbuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = nbuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return a;
}

function env(a, g, t0, attack, hold, release, vol) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.setValueAtTime(vol, t0 + attack + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
}

function noise({ when = 0, dur = 0.2, freq = 800, q = 1, type = 'bandpass', vol = 0.2, attack = 0.005 }) {
  const a = ctx(); if (!a) return;
  try {
    const t0 = a.currentTime + when;
    const src = a.createBufferSource(); src.buffer = nbuf; src.loop = true;
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = a.createGain();
    env(a, g, t0, attack, 0, Math.max(0.02, dur - attack), vol);
    src.connect(f).connect(g).connect(out);
    src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
  } catch (e) { /* sound is optional */ }
}

function osc({ when = 0, type = 'sine', f0 = 440, f1 = null, dur = 0.2, vol = 0.2, attack = 0.01, hold = 0, filter = null, fq = 1, vib = 0, vibRate = 6 }) {
  const a = ctx(); if (!a) return;
  try {
    const t0 = a.currentTime + when;
    const o = a.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + attack + hold + dur);
    let node = o;
    if (vib) {
      const l = a.createOscillator(), lg = a.createGain();
      l.frequency.value = vibRate; lg.gain.value = vib;
      l.connect(lg).connect(o.frequency); l.start(t0); l.stop(t0 + attack + hold + dur + 0.05);
    }
    if (filter) {
      const f = a.createBiquadFilter(); f.type = filter[0]; f.frequency.value = filter[1]; f.Q.value = fq;
      node.connect(f); node = f;
    }
    const g = a.createGain();
    env(a, g, t0, attack, hold, dur, vol);
    node.connect(g).connect(out);
    o.start(t0); o.stop(t0 + attack + hold + dur + 0.05);
  } catch (e) { /* sound is optional */ }
}

function blast(when, len) {
  for (const f of [466.2, 587.3, 698.5]) {
    osc({ when, type: 'sawtooth', f0: f * 0.93, f1: f, dur: 0.12, attack: 0.05, hold: len, vol: 0.05, filter: ['lowpass', 2200], vib: 3, vibRate: 5.5 });
  }
  noise({ when, dur: len + 0.15, freq: 1800, q: 0.7, vol: 0.05, attack: 0.04 });
}

export const sfx = {
  unlock() { unlocked = true; ctx(); },
  chuff(p = 1) {
    noise({ dur: 0.16, freq: 650, q: 0.8, vol: 0.16 * p });
    noise({ dur: 0.1, freq: 160, type: 'lowpass', q: 0.5, vol: 0.22 * p });
  },
  hiss() { noise({ dur: 0.9, freq: 4000, type: 'highpass', q: 0.3, vol: 0.06, attack: 0.03 }); },
  whistle() { blast(0, 0.28); blast(0.45, 0.6); },
  toot() { blast(0, 0.35); },
  quack() {
    for (const w of [0, 0.17]) osc({ when: w, type: 'square', f0: 430, f1: 300, dur: 0.12, vol: 0.12, filter: ['bandpass', 1000], fq: 2.5 });
  },
  peep() { for (const w of [0, 0.12]) osc({ when: w, type: 'sine', f0: 2200, f1: 2800, dur: 0.07, vol: 0.1 }); },
  moo() { osc({ type: 'sawtooth', f0: 160, f1: 105, attack: 0.15, hold: 0.4, dur: 0.5, vol: 0.18, filter: ['lowpass', 650], vib: 4, vibRate: 5 }); },
  baa() { osc({ type: 'sawtooth', f0: 330, f1: 300, attack: 0.05, hold: 0.3, dur: 0.25, vol: 0.12, filter: ['bandpass', 1200], fq: 1.5, vib: 25, vibRate: 11 }); },
  squawk() { for (const w of [0, 0.22]) osc({ when: w, type: 'square', f0: 750, f1: 480, dur: 0.18, vol: 0.09, filter: ['bandpass', 1300], fq: 2 }); },
  click() { for (let i = 0; i < 4; i++) osc({ when: i * 0.07, type: 'square', f0: 2400, f1: 1600, dur: 0.03, vol: 0.08 }); },
  tweet() { for (let i = 0; i < 3; i++) osc({ when: i * 0.12, type: 'sine', f0: 2600 + i * 200, f1: 3800, dur: 0.08, vol: 0.12 }); },
  gull() { osc({ type: 'sawtooth', f0: 900, f1: 700, attack: 0.08, hold: 0.1, dur: 0.3, vol: 0.08, filter: ['bandpass', 1500], fq: 2, vib: 60, vibRate: 14 }); },
  bell() {
    osc({ type: 'triangle', f0: 1250, dur: 0.35, vol: 0.12, attack: 0.003 });
    osc({ type: 'sine', f0: 2500, dur: 0.2, vol: 0.05, attack: 0.003 });
  },
  horn() { for (const w of [0, 0.25]) for (const f of [415, 523]) osc({ when: w, type: 'square', f0: f, dur: 0.06, hold: 0.12, vol: 0.05, filter: ['lowpass', 1800] }); },
  beep() { for (const w of [0, 0.3]) osc({ when: w, type: 'sine', f0: 1050, dur: 0.05, hold: 0.15, vol: 0.12 }); },
  rumble() { osc({ type: 'sawtooth', f0: 55, f1: 70, attack: 0.1, hold: 0.5, dur: 0.4, vol: 0.12, filter: ['lowpass', 260], vib: 6, vibRate: 18 }); },
  boing() { osc({ type: 'sine', f0: 260, f1: 760, dur: 0.25, vol: 0.18, vib: 30, vibRate: 18 }); },
  ding() {
    osc({ type: 'sine', f0: 880, f1: 1320, dur: 0.35, vol: 0.15 });
    osc({ when: 0.15, type: 'sine', f0: 1320, f1: 1760, dur: 0.4, vol: 0.12 });
  },
  sticker() {
    [784, 988, 1175].forEach((f, i) => osc({ when: i * 0.07, type: 'triangle', f0: f, dur: 0.18, vol: 0.12 }));
  },
  yay() {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => osc({ when: i * 0.13, type: 'triangle', f0: f, dur: 0.25, vol: 0.14 }));
    noise({ when: 0.1, dur: 1.4, freq: 1400, q: 0.4, vol: 0.12, attack: 0.15 });
  },
};

// Spoken words, so a toddler who can't read knows what to do.
let voice = null;
export function say(text) {
  try {
    const ss = window.speechSynthesis;
    if (!ss) return;
    if (!voice) {
      const vs = ss.getVoices();
      voice = vs.find(v => /en-GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
    }
    ss.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = 0.95; u.pitch = 1.15; u.volume = 1;
    ss.speak(u);
  } catch (e) { /* speech is optional */ }
}
export function stopSpeech() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
