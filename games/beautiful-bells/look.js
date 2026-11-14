// The girl's "look" is one plain JSON object, changed only by small actions.
// This keeps multiplayer easy later: send each action (or the whole look)
// to Firebase, e.g. rooms/{room}/players/{playerId}/look, and render what comes back.
// Actions carry everything they need (even random keys), so every friend's
// screen ends up the same when they replay them.

const MAX_PLACED = 30;
const MAKEUP = ['lipstick', 'eyeshadow', 'mascara', 'blush', 'earrings', 'necklace', 'headwear'];

export function newLook(girl) {
  return {
    girl: girl.id,
    name: girl.name,
    skin: girl.skin,
    hairColor: girl.hairColor,
    hairLength: girl.hairLength,
    eyeColor: girl.eyeColor,
    hairStyle: girl.hairStyle || 'down',
    top: girl.top,
    lipstick: null,
    eyeshadow: null,
    mascara: null,
    blush: null,
    earrings: null,
    necklace: null,
    headwear: null,
    extensions: [],
    freckles: false,
    placed: [], // [{ key, item, x, y }]
  };
}

export function reduce(s, a) {
  switch (a.type) {
    case 'set':
      return { ...s, [a.key]: a.value };
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
    case 'wipe': {
      const out = { ...s, extensions: [], freckles: false, placed: [] };
      for (const k of MAKEUP) out[k] = null;
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
    canUndo: () => history.length > 0,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  };
}

export const newKey = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
