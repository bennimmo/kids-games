// Saved drawings in this browser (localStorage). Each picture is a JPEG in its
// own key, plus a small list. If storage is full the oldest pictures go first.
const LIST = 'paint-gallery';
const PIC = 'paint-pic:';
const CURRENT = 'paint-current';
const MAX = 12;

export function loadGallery() {
  try {
    const list = JSON.parse(localStorage.getItem(LIST) || '[]');
    return Array.isArray(list) ? list.filter(s => s && typeof s.id === 'string' && localStorage.getItem(PIC + s.id)) : [];
  } catch (e) {
    return [];
  }
}

export function loadPicture(id) {
  try { return localStorage.getItem(PIC + id); } catch (e) { return null; }
}

// Newest first. Saving an existing picture moves it to the front.
export function saveToGallery(id, img) {
  let list = loadGallery().filter(s => s.id !== id);
  list.unshift({ id, updated: Date.now() });
  while (list.length > MAX) removePic(list.pop().id);
  for (;;) {
    try {
      localStorage.setItem(PIC + id, img);
      localStorage.setItem(LIST, JSON.stringify(list));
      return true;
    } catch (e) {
      if (list.length <= 1) return false;
      removePic(list.pop().id);
    }
  }
}

function removePic(id) {
  try { localStorage.removeItem(PIC + id); } catch (e) { /* ignore */ }
}

export function removeFromGallery(id) {
  removePic(id);
  try { localStorage.setItem(LIST, JSON.stringify(loadGallery().filter(s => s.id !== id))); } catch (e) { /* ignore */ }
}

export const getCurrent = () => { try { return localStorage.getItem(CURRENT); } catch (e) { return null; } };
export const setCurrent = id => { try { localStorage.setItem(CURRENT, id); } catch (e) { /* ignore */ } };
