// Tiny sound effects made with Web Audio (no files needed).
let ctx = null;
function ac() {
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

export const sound = {
  pop: () => tone(600, 0.12, 'sine', 0.25, 1200),
  win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'triangle'), i * 120)),
  bump: () => tone(150, 0.15, 'square', 0.15, 80),
  tone,
};
