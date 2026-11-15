// Tiny sound effects made with Web Audio (no files needed).
let ctx = null, paused = false;
function ac() {
  if (paused) throw new Error('sound paused');
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur = 0.12, type = 'sine', vol = 0.2, slideTo = null) {
  try {
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, a.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime + dur);
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g).connect(a.destination);
    o.start();
    o.stop(a.currentTime + dur);
  } catch (e) { /* sound is optional */ }
}

// Filtered white noise: splashes, whooshes.
function noise(dur = 0.4, freq = 1000, vol = 0.3) {
  try {
    const a = ac();
    const len = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = 0.7;
    const g = a.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination);
    src.start();
  } catch (e) { /* sound is optional */ }
}

// Start sound again with a fresh context. iPad/Safari: turning the mic on changes the
// sound hardware's speed, and an older context then plays too high/low.
// pauseAudio() before the mic starts, resetAudio() once it's on.
export function pauseAudio() {
  paused = true;
  const old = ctx;
  ctx = null;
  if (old) old.close().catch(() => {});
}
export function resetAudio() {
  paused = false;
  const old = ctx;
  ctx = null;
  if (old) old.close().catch(() => {});
}

// Shared audio context (for things like engine sounds).
export function audioCtx() {
  try { return ac(); } catch (e) { return null; }
}

export const sound = {
  pop: () => tone(600, 0.12, 'sine', 0.25, 1200),
  win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'triangle'), i * 120)),
  bump: () => tone(150, 0.15, 'square', 0.15, 80),
  splash: () => noise(0.45, 900, 0.35),
  whoosh: () => { noise(0.5, 2600, 0.25); tone(300, 0.4, 'sawtooth', 0.06, 900); },
  squelch: () => { noise(0.3, 350, 0.4); tone(120, 0.25, 'sine', 0.15, 60); },
  tok: () => tone(900, 0.07, 'square', 0.12, 500),
  cheer: () => { noise(1.4, 1300, 0.18); noise(1.1, 2400, 0.1); },
  tone,
  noise,
};
