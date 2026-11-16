// Voice settings people can try from 🔧 in the friends panel (kept on this device).
const KEY = 'kg-voice';
const DEFAULTS = { gameSounds: true, player: 'element', echo: true, relay: false };
let opts = { ...DEFAULTS };
try { opts = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { /* */ }
const subs = new Set();
export const voiceOpts = () => opts;
export function setVoiceOpt(k, v) {
  opts = { ...opts, [k]: v };
  try { localStorage.setItem(KEY, JSON.stringify(opts)); } catch (e) { /* */ }
  subs.forEach(cb => cb(opts));
}
export function onVoiceOpts(cb) { subs.add(cb); return () => subs.delete(cb); }
