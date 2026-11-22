// Axie Pals – the pet's state and how it changes over time (no drawing here).
// Real time, gentle: needs go down while the game is closed, but never below the level's floor.
import { LEVELS, GIFTS } from './items.js';

const KEY = 'kg-axie';
const VERSION = 1;
const HOUR = 3600e3;
const STEP = 10 * 60e3;          // away time is worked out in 10 minute steps
const MAX_AWAY = 21 * 24 * HOUR; // after 3 weeks away we stop counting

// Needs lost per hour on Easy (times the level's mult).
const DECAY = { food: 9, fun: 8, clean: 3.5, energy: 7 };

export const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export function newPet({ name, colour, level }) {
  const now = Date.now();
  return {
    v: VERSION, name, colour, level,
    born: now, last: now,
    food: 70, fun: 80, clean: 100, energy: 90,
    poos: [],             // [{ x: 0..1 }]
    asleep: false, lights: true,
    sick: false, treats: 0, tummy: 0,
    grow: 0, age: 0, gifts: [],   // gifts = birthdays not opened yet
    coins: 5, owned: [], placed: {}, wear: {},
    photos: [], hatched: false,
    pooAway: 0,
  };
}

export function loadPet() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!p || p.v !== VERSION || !LEVELS[p.level]) return null;
    return p;
  } catch (e) { return null; }
}

export function savePet(p) {
  if (!p) return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {
    // Full? Drop the oldest photos and try again.
    if (p.photos.length > 4) { p.photos.splice(0, 2); savePet(p); }
  }
}

export function forgetPet() {
  try { localStorage.removeItem(KEY); } catch (e) { /* blocked */ }
}

const isNight = t => { const h = new Date(t).getHours(); return h >= 20 || h < 7; };
export const nightNow = () => isNight(Date.now());

// Does growing count right now? (depends on level)
function growing(p) {
  const L = LEVELS[p.level];
  if (L.grow === 'always') return true;
  const n = [p.food, p.fun, p.clean, p.energy];
  if (L.grow === 'average') return n.reduce((a, b) => a + b, 0) / 4 >= 35 && !p.sick;
  return Math.min(...n) >= 35 && !p.sick;
}

// Move time on by ms. away = the game was closed (night = asleep, floors apply).
function tick(p, ms, t, away) {
  const L = LEVELS[p.level];
  const h = ms / HOUR;
  const m = L.mult;
  const asleep = away ? isNight(t) : p.asleep;
  const floor = away ? L.floor : 0;
  const down = (k, rate) => { if (p[k] > floor) p[k] = Math.max(floor, p[k] - rate * h); };

  down('food', DECAY.food * m * (asleep ? 0.5 : 1));
  down('clean', DECAY.clean * m);
  if (!asleep) down('fun', DECAY.fun * m * (p.sick ? 2 : 1));
  if (asleep) p.energy = clamp(p.energy + 25 * h);
  else down('energy', DECAY.energy * m);

  p.treats = Math.max(0, p.treats - h * 2);  // treats wear off in about an hour or two

  if (away) {
    // Poos while away: about one every 4 hours (faster on harder levels), 5 at most.
    p.pooAway += h * m / 4;
    while (p.pooAway >= 1) { p.pooAway -= 1; addPoo(p); }
    // A dirty tank can make it poorly.
    if (!p.sick && p.clean < 30 && Math.random() < 0.01 * L.sick * (ms / STEP)) p.sick = true;
  }

  if (growing(p)) p.grow += ms;
  while (p.grow >= (p.age + 1) * L.hours * HOUR) {
    p.age++;
    p.gifts.push(p.age);
  }
}

export function addPoo(p, x) {
  if (p.poos.length >= 5) return;
  p.poos.push({ x: x ?? 0.12 + Math.random() * 0.76 });
  p.clean = clamp(p.clean - 8);
}

// Catch up on the time the game was closed. Returns hours away.
export function catchUp(p) {
  const now = Date.now();
  let from = Math.max(p.last, now - MAX_AWAY);
  const away = now - from;
  if (away > 60e3) {
    p.asleep = false;
    p.lights = true;
    while (from < now) {
      const ms = Math.min(STEP, now - from);
      tick(p, ms, from, true);
      from += ms;
    }
  }
  p.last = now;
  return away / HOUR;
}

// Called every frame while playing.
export function update(p, dt) {
  const now = Date.now();
  tick(p, dt * 1000, now, false);
  // In the game sleep is quick, so little ones see it work.
  if (p.asleep) p.energy = clamp(p.energy + dt * 2.2);
  p.last = now;
}

// Time left to the next birthday (ms), if growing keeps counting.
export function nextBirthday(p) {
  const L = LEVELS[p.level];
  return Math.max(0, (p.age + 1) * L.hours * HOUR - p.grow);
}
export function birthdayProgress(p) {
  const L = LEVELS[p.level];
  const len = L.hours * HOUR;
  return clamp((p.grow - p.age * len) / len, 0, 1);
}
export const isGrowing = growing;

export const giftFor = age => GIFTS[age - 1] || null;

// What the pet feels most right now (one word + emoji for the speech bubble).
export function mood(p) {
  if (p.sick) return { id: 'sick', say: '🤢' };
  if (p.asleep) return { id: 'sleep', say: '💤' };
  if (p.food < 30) return { id: 'hungry', say: '🍤' };
  if (p.energy < 22) return { id: 'sleepy', say: '🥱' };
  if (p.clean < 30 || p.poos.length >= 3) return { id: 'yucky', say: '💩' };
  if (p.fun < 30) return { id: 'bored', say: '⚽' };
  const avg = (p.food + p.fun + p.clean + p.energy) / 4;
  if (avg > 75) return { id: 'joy', say: '💖' };
  return { id: 'ok', say: '🙂' };
}

// Sulky = something is right down at the floor.
export function sulky(p) {
  return Math.min(p.food, p.fun, p.clean) <= LEVELS[p.level].floor + 2;
}
