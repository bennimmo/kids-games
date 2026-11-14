// Keeps the last 20 girls in this browser (localStorage) so you can carry on later.
const KEY = 'beautiful-bells-gallery';
const MAX = 20;

export function loadGallery() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter(s => s && s.id && s.look) : [];
  } catch (e) {
    return [];
  }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch (e) { /* storage full or blocked */ }
}

// Newest first. Saving an existing girl moves her to the front.
export function saveToGallery(id, look) {
  const list = loadGallery().filter(s => s.id !== id);
  list.unshift({ id, look, updated: Date.now() });
  write(list);
}

export function removeFromGallery(id) {
  write(loadGallery().filter(s => s.id !== id));
}
