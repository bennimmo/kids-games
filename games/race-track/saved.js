// Saved tracks in this browser (localStorage).
// Recent tracks are kept automatically (up to MAX_RECENT); favourites are kept forever.
import { trackToJSON } from './track.js';

const KEY = 'raffy-race-tracks-v1';
const MAX_RECENT = 12;

export function loadSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage full or blocked */ }
}

function sortList(list) {
  return list.sort((a, b) => (b.fav - a.fav) || (b.t - a.t));
}

// Save the current track. Same track again just moves to the top.
export function saveTrack(track, items) {
  const pts = trackToJSON(track);
  const its = items.map(({ type, x, y }) => ({ type, x: Math.round(x), y: Math.round(y) }));
  const key = JSON.stringify([pts, its]);
  let list = loadSaved();
  const same = list.find(s => JSON.stringify([s.pts, s.items]) === key);
  if (same) {
    same.t = Date.now();
  } else {
    list.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), pts, items: its, fav: false, t: Date.now() });
  }
  // drop the oldest non-favourites
  const recent = list.filter(s => !s.fav).sort((a, b) => b.t - a.t);
  const drop = new Set(recent.slice(MAX_RECENT).map(s => s.id));
  list = list.filter(s => !drop.has(s.id));
  write(sortList(list));
}

export function toggleFav(id) {
  const list = loadSaved();
  const s = list.find(x => x.id === id);
  if (s) s.fav = !s.fav;
  write(sortList(list));
}

export function deleteSaved(id) {
  write(loadSaved().filter(s => s.id !== id));
}
