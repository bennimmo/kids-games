// The girl's "look" is one plain JSON object, changed only by small actions.
// This keeps multiplayer easy later: send each action (or the whole look)
// to Firebase, e.g. rooms/{room}/players/{playerId}/look, and render what comes back.
// Actions carry everything they need (even random keys and brush points),
// so every friend's screen ends up the same when they replay them.
import { GIRLS, ITEMS } from './items.js';

const MAX_PLACED = 40;
const MAX_PAINT_POINTS = 12000; // numbers (x and y) kept across all brush strokes
const WEARABLES = ['mascara', 'eyeliner', 'earrings', 'necklace', 'headwear', 'glasses'];

export function newLook(girl) {
  return {
    v: 2,
    girl: girl.id,
    name: girl.name,
    skin: girl.skin,
    hairColor: girl.hairColor,
    hairLength: girl.hairLength,
    eyeColor: girl.eyeColor,
    hairStyle: girl.hairStyle || 'down',
    cut: null,            // hair cut off below this y (null = full length)
    topStyle: girl.topStyle || 'tee',
    topColor: girl.topColor || 'pink',
    topPattern: 'plain',
    mascara: null,
    eyeliner: null,
    earrings: null,
    necklace: null,
    headwear: null,
    glasses: null,
    extensions: [],
    freckles: false,
    paint: [],            // [{ item, layer, pts: [x, y, x, y, …] }]
    placed: [],           // [{ key, item, x, y }]
  };
}

// Brings old saved girls up to date.
export function migrate(look) {
  const girl = GIRLS.find(g => g.id === look.girl) || GIRLS[0];
  const out = { ...newLook(girl), ...look, v: 2 };
  if (!look.v) {
    out.paint = [];
    for (const [key, layer] of [['lipstick', 'lips'], ['eyeshadow', 'shadow'], ['blush', 'blush']]) {
      if (look[key] && ITEMS[look[key]]) out.paint.push(...presetStrokes(layer, look[key]));
      delete out[key];
    }
    const old = (look.top || '').replace('top-', '');
    out.topStyle = 'tee';
    out.topColor = { sparkpink: 'hotpink', sparkpurple: 'purple', rainbow: 'pink' }[old] || old || 'pink';
    if (old === 'rainbow') out.topPattern = 'rainbow';
    delete out.top;
  }
  out.placed = (out.placed || []).filter(p => ITEMS[p.item]);
  out.paint = (out.paint || []).filter(s => ITEMS[s.item] && Array.isArray(s.pts));
  return out;
}

// Ready-made brush strokes (used by "surprise me" and old saves).
export function presetStrokes(layer, item) {
  const zig = (x0, x1, step, yA, yB) => {
    const pts = [];
    for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push(x, i % 2 ? yB : yA);
    return pts;
  };
  const spiral = (cx, cy) => {
    const pts = [];
    for (let a = 0; a < Math.PI * 4; a += .5) {
      const r = 3 + a * 1.6;
      pts.push(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * .8));
    }
    return pts;
  };
  switch (layer) {
    case 'lips': return [{ item, layer, pts: zig(174, 226, 3, 274, 298) }];
    case 'shadow': return [160, 240].map(cx => ({ item, layer, pts: zig(cx - 26, cx + 26, 4, 214, 190) }));
    case 'blush': return [142, 258].map(cx => ({ item, layer, pts: spiral(cx, 264) }));
  }
  return [];
}

export function reduce(s, a) {
  switch (a.type) {
    case 'set': {
      const out = { ...s, [a.key]: a.value };
      if (a.key === 'hairLength') out.cut = null;
      return out;
    }
    case 'toggle': {
      const cur = s[a.key];
      if (Array.isArray(cur)) {
        return { ...s, [a.key]: cur.includes(a.value) ? cur.filter(v => v !== a.value) : [...cur, a.value] };
      }
      return { ...s, [a.key]: !cur };
    }
    case 'place':
      return { ...s, placed: [...s.placed, { key: a.key, item: a.item, x: a.x, y: a.y }].slice(-MAX_PLACED) };
    case 'move':
      return { ...s, placed: s.placed.map(p => p.key === a.key ? { ...p, x: a.x, y: a.y } : p) };
    case 'remove':
      return { ...s, placed: s.placed.filter(p => p.key !== a.key) };
    case 'paint': {
      const paint = [...s.paint, { item: a.item, layer: a.layer, pts: a.pts }];
      let total = paint.reduce((t, st) => t + st.pts.length, 0);
      while (total > MAX_PAINT_POINTS && paint.length > 1) total -= paint.shift().pts.length;
      return { ...s, paint };
    }
    case 'clearPaint': {
      if (!s.paint.some(st => st.layer === a.layer)) return s;
      return { ...s, paint: s.paint.filter(st => st.layer !== a.layer) };
    }
    case 'wipe': {
      const out = { ...s, extensions: [], freckles: false, placed: [], paint: [] };
      for (const k of WEARABLES) out[k] = null;
      return out;
    }
    case 'replace':
      return { ...a.look };
    default:
      return s;
  }
}

// A tiny store with undo.
export function createStore(look) {
  let state = look;
  const history = [];
  const listeners = new Set();
  const emit = () => listeners.forEach(fn => fn(state));
  return {
    get: () => state,
    dispatch(action) {
      const next = reduce(state, action);
      if (next === state) return;
      history.push(state);
      if (history.length > 60) history.shift();
      state = next;
      emit();
    },
    undo() {
      if (!history.length) return false;
      state = history.pop();
      emit();
      return true;
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

export const newKey = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
