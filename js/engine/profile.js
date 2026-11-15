// The player's name, set on the main menu and shared by every online game.
const KEY = 'kg-name';
export const NAME_MAX = 12;

// Letters, numbers and spaces only (names also arrive from other devices).
export const cleanName = n => String(n ?? '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);

export function myName() {
  try { return cleanName(localStorage.getItem(KEY)); } catch (e) { return ''; }
}
export function setMyName(n) {
  const v = cleanName(n);
  if (v) navigator.storage?.persist?.().catch(() => {}); // ask the browser not to clear it
  try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
  return v;
}
// Safe to put in innerHTML.
export const nameHTML = n => cleanName(n).replace(/[&<>"']/g, '');

// The player's picture (an emoji), picked in the name box. Only these are allowed.
const FACE_KEY = 'kg-face';
export const FACES = [
  '😀', '😎', '🤩', '😜', '🥳', '🤠', '👸', '🤴', '🦸', '🧚', '🧜', '🥷',
  '🐶', '🐱', '🦊', '🐼', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲', '🦖', '🐙',
  '🐧', '🦉', '🐝', '🦋', '👽', '🤖', '👻', '🎃', '⚽', '🌈', '⭐', '🍕',
];
export const cleanFace = f => (FACES.includes(f) ? f : '');
export function myFace() {
  try { return cleanFace(localStorage.getItem(FACE_KEY)); } catch (e) { return ''; }
}
export function setMyFace(f) {
  const v = cleanFace(f);
  try { v ? localStorage.setItem(FACE_KEY, v) : localStorage.removeItem(FACE_KEY); } catch (e) { /* private mode */ }
  return v;
}
