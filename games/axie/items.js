// Axie Pals – data: levels, colours, food, things (toys, decor, clothes), birthday gifts.

// How hard it is to grow up.
// mult = how fast needs go down. hours = real hours per birthday.
// floor = needs never drop below this while you're away (gentle: never worse than sulky).
// grow = when growing counts: always / average need ok / every need ok.
export const LEVELS = {
  easy: { id: 'easy', name: 'Easy', icon: '🐣', mult: 1, hours: 24, floor: 22, grow: 'always', sick: 0.4 },
  medium: { id: 'medium', name: 'Medium', icon: '🐥', mult: 1.4, hours: 48, floor: 15, grow: 'average', sick: 1 },
  hard: { id: 'hard', name: 'Hard', icon: '🦅', mult: 2, hours: 72, floor: 8, grow: 'all', sick: 1.6 },
};

export const COLOURS = [
  { id: 'pink', name: 'Pink', body: '#ffb8cc', belly: '#ffd9e3', gill: '#ff4f86', dark: '#e0708f' },
  { id: 'gold', name: 'Gold', body: '#ffe08a', belly: '#fff1c4', gill: '#ff8a3d', dark: '#d9a93f' },
  { id: 'blue', name: 'Blue', body: '#a8d8ff', belly: '#d8eeff', gill: '#4f6dff', dark: '#6b9fd1' },
  { id: 'white', name: 'Pearl', body: '#f6efff', belly: '#ffffff', gill: '#ff6fa6', dark: '#c9b8dd' },
  { id: 'green', name: 'Glow', body: '#bdf5a8', belly: '#e2ffd6', gill: '#22c26a', dark: '#7fc46a' },
  { id: 'wild', name: 'Wild', body: '#8d7a66', belly: '#b5a28c', gill: '#b34a73', dark: '#5e4f40', spots: true },
];

export const NAMES = ['Noodle', 'Bubbles', 'Gilly', 'Squiggle', 'Pinky', 'Wiggles', 'Lottie', 'Axel', 'Splash', 'Mochi', 'Pip', 'Ziggy'];

// food: how full. fun: happy boost. treat: too many = tummy ache.
export const FOODS = [
  { id: 'worm', icon: '🪱', food: 30, fun: 2 },
  { id: 'shrimp', icon: '🦐', food: 25, fun: 5 },
  { id: 'pellet', icon: '🟤', food: 20, fun: 0 },
  { id: 'cake', icon: '🧁', food: 10, fun: 18, treat: true },
];

// Things. kind: toy (moves, pet plays), decor (sits on the floor), float (on top of the water),
// friend (moves by itself), wear (hat/face/neck slot).
export const ITEMS = {
  ball: { icon: '⚽', kind: 'toy', size: 44 },
  duck: { icon: '🦆', kind: 'float', size: 46 },
  castle: { icon: '🏰', kind: 'decor', size: 96 },
  shell: { icon: '🐚', kind: 'decor', size: 50 },
  chest: { icon: '🧰', kind: 'decor', size: 60 },
  rocket: { icon: '🚀', kind: 'decor', size: 80, tilt: -0.8 },
  plant: { icon: '🌿', kind: 'decor', size: 80 },
  coral: { icon: '🪸', kind: 'decor', size: 76 },
  rock: { icon: '🪨', kind: 'decor', size: 70 },
  mushroom: { icon: '🍄', kind: 'decor', size: 56 },
  balloon: { icon: '🎈', kind: 'float', size: 54 },
  bubbler: { icon: '🫧', kind: 'decor', size: 50, bubbles: true },
  crab: { icon: '🦀', kind: 'friend', size: 44, walks: true },
  fish: { icon: '🐠', kind: 'friend', size: 40, swims: true },
  snail: { icon: '🐌', kind: 'friend', size: 36, walks: true, slow: true },
  tophat: { icon: '🎩', kind: 'wear', slot: 'hat' },
  crown: { icon: '👑', kind: 'wear', slot: 'hat' },
  cap: { icon: '🧢', kind: 'wear', slot: 'hat' },
  party: { icon: '🥳', kind: 'wear', slot: 'hat', drawn: 'party' },
  sunhat: { icon: '👒', kind: 'wear', slot: 'hat' },
  grad: { icon: '🎓', kind: 'wear', slot: 'hat' },
  berry: { icon: '🍓', kind: 'wear', slot: 'hat' },
  bow: { icon: '🎀', kind: 'wear', slot: 'hat' },
  flower: { icon: '🌸', kind: 'wear', slot: 'hat' },
  shades: { icon: '🕶️', kind: 'wear', slot: 'face' },
  glasses: { icon: '👓', kind: 'wear', slot: 'face' },
  heartspecs: { icon: '💗', kind: 'wear', slot: 'face', drawn: 'hearts' },
  starspecs: { icon: '⭐', kind: 'wear', slot: 'face', drawn: 'stars' },
  scarf: { icon: '🧣', kind: 'wear', slot: 'neck', drawn: 'scarf' },
  tie: { icon: '🎀', kind: 'wear', slot: 'neck', drawn: 'bowtie' },
  necklace: { icon: '📿', kind: 'wear', slot: 'neck', drawn: 'pearls' },
  medal: { icon: '🏅', kind: 'wear', slot: 'neck', drawn: 'medal' },
  cape: { icon: '🦸', kind: 'wear', slot: 'back', drawn: 'cape' },
  wings: { icon: '🧚', kind: 'wear', slot: 'back', drawn: 'wings' },
  backpack: { icon: '🎒', kind: 'wear', slot: 'back', drawn: 'backpack' },
  balloonb: { icon: '🎈', kind: 'wear', slot: 'back', drawn: 'balloon' },
};

// One present per birthday, in this order. After the list: a bag of coins.
export const GIFTS = ['ball', 'castle', 'tophat', 'shell', 'shades', 'duck', 'bow', 'rocket', 'crown', 'balloon', 'chest', 'party'];

// Things you can buy with coins.
export const SHOP = [
  { id: 'plant', price: 10 },
  { id: 'rock', price: 10 },
  { id: 'coral', price: 15 },
  { id: 'mushroom', price: 15 },
  { id: 'bubbler', price: 30 },
  { id: 'snail', price: 35 },
  { id: 'crab', price: 40 },
  { id: 'fish', price: 50 },
];

// Growing up: name + size by age (birthdays).
export function stageOf(age) {
  if (age < 1) return { name: 'Baby', icon: '🍼', scale: 0.62 };
  if (age < 3) return { name: 'Little', icon: '🐣', scale: 0.72 };
  if (age < 6) return { name: 'Kid', icon: '🧒', scale: 0.84 };
  if (age < 9) return { name: 'Big kid', icon: '🧑', scale: 0.95 };
  return { name: 'Grown-up', icon: '⭐', scale: 1.05 };
}

// ---------- Wardrobe ----------
// Tabs in the wardrobe.
export const SLOTS = [
  { id: 'hat', icon: '🎩', name: 'Hats' },
  { id: 'face', icon: '👓', name: 'Glasses' },
  { id: 'neck', icon: '🧣', name: 'Neck' },
  { id: 'back', icon: '🎒', name: 'Back' },
  { id: 'pattern', icon: '✨', name: 'Patterns' },
  { id: 'colour', icon: '🎨', name: 'Colour' },
  { id: 'outfits', icon: '⭐', name: 'Outfits' },
];

// Clothes and their prices. null = birthday present only 🎂.
export const WARDROBE = {
  tophat: null, crown: null, party: null, bow: null, shades: null,
  cap: 20, flower: 15, sunhat: 20, grad: 25, berry: 15,
  glasses: 20, heartspecs: 25, starspecs: 25,
  scarf: 25, tie: 20, necklace: 30, medal: 30,
  backpack: 30, balloonb: 20, cape: 35, wings: 45,
};

// Patterns painted on the body. Owned as 'pat-<id>'.
export const PATTERNS = {
  spots: { icon: '🔵', price: 20 },
  stripes: { icon: '🦓', price: 20 },
  hearts: { icon: '💕', price: 25 },
  stars: { icon: '🌟', price: 25 },
  sparkle: { icon: '✨', price: 35 },
  rainbow: { icon: '🌈', price: 40 },
};

// Changing colour: each new colour costs this (owned colours are free to swap).
export const COLOUR_PRICE = 30;
export const OUTFIT_SLOTS = 3;
