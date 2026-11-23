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
  ball: { icon: '⚽', kind: 'toy', size: 50 },
  duck: { icon: '🦆', kind: 'float', size: 56 },
  castle: { icon: '🏰', kind: 'decor', size: 120 },
  shell: { icon: '🐚', kind: 'decor', size: 58 },
  chest: { icon: '🧰', kind: 'decor', size: 78 },
  rocket: { icon: '🚀', kind: 'decor', size: 80, tilt: -0.8 },
  plant: { icon: '🌿', kind: 'decor', size: 100 },
  coral: { icon: '🪸', kind: 'decor', size: 92 },
  rock: { icon: '🪨', kind: 'decor', size: 82 },
  mushroom: { icon: '🍄', kind: 'decor', size: 70 },
  balloon: { icon: '🎈', kind: 'float', size: 54 },
  bubbler: { icon: '🫧', kind: 'decor', size: 50, bubbles: true },
  crab: { icon: '🦀', kind: 'friend', size: 62, walks: true },
  fish: { icon: '🐠', kind: 'friend', size: 60, swims: true },
  snail: { icon: '🐌', kind: 'friend', size: 54, walks: true, slow: true },
  tulip: { icon: '🌷', kind: 'decor', size: 56 },
  anchor: { icon: '⚓', kind: 'decor', size: 80 },
  vase: { icon: '🏺', kind: 'decor', size: 60 },
  statue: { icon: '🗿', kind: 'decor', size: 76 },
  ship: { icon: '🚢', kind: 'decor', size: 96, tilt: 0.25 },
  house: { icon: '🏡', kind: 'decor', size: 84 },
  gem: { icon: '💎', kind: 'decor', size: 48 },
  sunflower: { icon: '🌻', kind: 'decor', size: 70 },
  ufo: { icon: '🛸', kind: 'decor', size: 76 },
  trophy: { icon: '🏆', kind: 'decor', size: 62 },
  ring: { icon: '🛟', kind: 'float', size: 50 },
  lotus: { icon: '🪷', kind: 'float', size: 48 },
  boat: { icon: '⛵', kind: 'float', size: 60 },
  turtle: { icon: '🐢', kind: 'friend', size: 50, walks: true, slow: true },
  shrimpy: { icon: '🦐', kind: 'friend', size: 34, walks: true },
  octopus: { icon: '🐙', kind: 'friend', size: 52, swims: true },
  puffer: { icon: '🐡', kind: 'friend', size: 44, swims: true },
  tophat: { icon: '🎩', kind: 'wear', slot: 'hat' },
  crown: { icon: '👑', kind: 'wear', slot: 'hat' },
  cap: { icon: '🧢', kind: 'wear', slot: 'hat' },
  party: { icon: '🥳', kind: 'wear', slot: 'hat', drawn: 'party' },
  sunhat: { icon: '👒', kind: 'wear', slot: 'hat' },
  grad: { icon: '🎓', kind: 'wear', slot: 'hat' },
  berry: { icon: '🍓', kind: 'wear', slot: 'hat' },
  bow: { icon: '🎀', kind: 'wear', slot: 'hat' },
  flower: { icon: '🌸', kind: 'wear', slot: 'hat' },
  cherry: { icon: '🍒', kind: 'wear', slot: 'hat' },
  frog: { icon: '🐸', kind: 'wear', slot: 'hat' },
  donut: { icon: '🍩', kind: 'wear', slot: 'hat' },
  unicorn: { icon: '🦄', kind: 'wear', slot: 'hat' },
  starhat: { icon: '🌟', kind: 'wear', slot: 'hat' },
  goggles: { icon: '🥽', kind: 'wear', slot: 'face' },
  snorkel: { icon: '🤿', kind: 'wear', slot: 'face' },
  lei: { icon: '🌺', kind: 'wear', slot: 'neck' },
  bell: { icon: '🔔', kind: 'wear', slot: 'neck' },
  guitar: { icon: '🎸', kind: 'wear', slot: 'back' },
  jetpack: { icon: '🚀', kind: 'wear', slot: 'back' },
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

// Things you can buy with coins. age = which birthday it shows up in the shop.
export const SHOP = [
  { id: 'rock', price: 15, age: 0 },
  { id: 'plant', price: 15, age: 0 },
  { id: 'coral', price: 25, age: 1 },
  { id: 'mushroom', price: 25, age: 1 },
  { id: 'snail', price: 50, age: 1 },
  { id: 'tulip', price: 25, age: 2 },
  { id: 'anchor', price: 30, age: 2 },
  { id: 'bubbler', price: 50, age: 3 },
  { id: 'crab', price: 60, age: 3 },
  { id: 'ring', price: 35, age: 3 },
  { id: 'vase', price: 35, age: 4 },
  { id: 'shrimpy', price: 55, age: 4 },
  { id: 'fish', price: 70, age: 5 },
  { id: 'lotus', price: 35, age: 5 },
  { id: 'statue', price: 50, age: 6 },
  { id: 'ship', price: 70, age: 6 },
  { id: 'boat', price: 50, age: 6 },
  { id: 'turtle', price: 80, age: 7 },
  { id: 'house', price: 60, age: 7 },
  { id: 'gem', price: 60, age: 8 },
  { id: 'sunflower', price: 40, age: 8 },
  { id: 'octopus', price: 90, age: 8 },
  { id: 'ufo', price: 80, age: 9 },
  { id: 'puffer', price: 90, age: 9 },
  { id: 'trophy', price: 80, age: 10 },
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

// Clothes: price + which birthday they show up. null = birthday present only 🎂.
export const WARDROBE = {
  tophat: null, crown: null, party: null, bow: null, shades: null,
  cap: { price: 30, age: 0 }, glasses: { price: 30, age: 0 },
  flower: { price: 25, age: 1 }, scarf: { price: 35, age: 1 },
  berry: { price: 30, age: 2 }, tie: { price: 35, age: 2 },
  sunhat: { price: 35, age: 3 }, backpack: { price: 45, age: 3 },
  cherry: { price: 35, age: 4 }, heartspecs: { price: 40, age: 4 }, necklace: { price: 45, age: 4 },
  starspecs: { price: 40, age: 5 }, goggles: { price: 45, age: 5 }, lei: { price: 40, age: 5 },
  grad: { price: 45, age: 6 }, medal: { price: 50, age: 6 },
  frog: { price: 45, age: 7 }, snorkel: { price: 50, age: 7 }, cape: { price: 60, age: 7 },
  donut: { price: 45, age: 8 }, bell: { price: 40, age: 8 },
  unicorn: { price: 60, age: 9 }, wings: { price: 80, age: 9 },
  balloonb: { price: 40, age: 10 }, guitar: { price: 70, age: 10 },
  starhat: { price: 60, age: 11 }, jetpack: { price: 90, age: 11 },
};

// Patterns painted on the body. Owned as 'pat-<id>'.
export const PATTERNS = {
  spots: { icon: '🔵', price: 40, age: 0 },
  stripes: { icon: '🦓', price: 40, age: 2 },
  hearts: { icon: '💕', price: 50, age: 4 },
  stars: { icon: '🌟', price: 50, age: 6 },
  sparkle: { icon: '✨', price: 60, age: 7 },
  zigzag: { icon: '⚡', price: 55, age: 8 },
  leopard: { icon: '🐆', price: 60, age: 9 },
  rainbow: { icon: '🌈', price: 80, age: 10 },
  galaxy: { icon: '🌌', price: 90, age: 11 },
};

// Changing colour: each new colour costs this (owned colours are free to swap).
export const COLOUR_PRICE = 60;
export const COLOUR_AGE = 2;
export const OUTFIT_SLOTS = 3;

// ---------- Coins ----------
// Coins are kept small on purpose: things come with birthdays, coins just help a bit.
export const COINS = {
  careDay: 12,      // most coins a day from feeding, scooping and scrubbing
  gamesPaid: 3,     // bubble pop games a day that pay
  gameMax: 10,      // most coins from one bubble pop game (1 per 3 bubbles)
  daily: 5,         // hello bonus, once a day
  birthday: 15,     // extra coins at each birthday party
};

// Everything that shows up in the shop / wardrobe at this birthday (icons).
export function newAt(age) {
  const out = SHOP.filter(s => s.age === age).map(s => ITEMS[s.id].icon);
  for (const [id, w] of Object.entries(WARDROBE)) if (w && w.age === age) out.push(ITEMS[id].icon);
  for (const p of Object.values(PATTERNS)) if (p.age === age) out.push(p.icon);
  if (age === COLOUR_AGE) out.push('🎨');
  return out;
}
