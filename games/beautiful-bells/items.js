// All the data for Beautiful Bells: girls, colours and every item in the menu.
// Items are plain data. `action` says what happens when one is dropped on the girl:
//   slot   – sets look[key] = value (tap again to take it off, unless required)
//   toggle – adds/removes value from a list (or flips a true/false)
//   place  – sticks it where you drop it (bows, clips, face gems…)

export const HAIR_COLORS = {
  blonde: { name: 'Blonde', base: '#f2cc6b', shade: '#c99a35', light: '#fff0b8' },
  brown:  { name: 'Brown',  base: '#8b5a3c', shade: '#5e3a24', light: '#b88461' },
  black:  { name: 'Black',  base: '#2f2a2c', shade: '#141113', light: '#615a5e' },
  ginger: { name: 'Ginger', base: '#d8692e', shade: '#a54a17', light: '#f6a26c' },
  pink:   { name: 'Pink',   base: '#ff8cc6', shade: '#d9579a', light: '#ffd0e8' },
  purple: { name: 'Purple', base: '#a67de8', shade: '#7650c2', light: '#d6c0fa' },
  blue:   { name: 'Blue',   base: '#5db5ef', shade: '#2f86c9', light: '#b5e0fc' },
  silver: { name: 'Silver', base: '#e4e0ee', shade: '#aca5bf', light: '#ffffff' },
};

export const HAIR_LENGTHS = {
  short:     { name: 'Short',      L: 290 },
  medium:    { name: 'Medium',     L: 365 },
  long:      { name: 'Long',       L: 445 },
  superlong: { name: 'Super long', L: 515 },
};

export const EYE_COLORS = {
  blue: '#3f8fe0', green: '#3fae67', brown: '#7a4626',
  hazel: '#a77a2c', grey: '#8394a8', violet: '#9b5fdc',
};

export const SKINS = {
  s1: { base: '#ffe3d0', shade: '#eebfa2', lip: '#e89a9a' },
  s2: { base: '#f8cfae', shade: '#e0a780', lip: '#d98579' },
  s3: { base: '#e6b088', shade: '#c78a5f', lip: '#c46f62' },
  s4: { base: '#c68b5e', shade: '#a2693f', lip: '#a85a4c' },
  s5: { base: '#9a6342', shade: '#77482c', lip: '#8a4a3c' },
  s6: { base: '#6e452d', shade: '#4f301d', lip: '#6e3a30' },
};

export const GIRLS = [
  { id: 'bella', name: 'Bella', skin: 's2', hairColor: 'blonde', hairLength: 'long',      eyeColor: 'blue',  hairStyle: 'down',      top: 'top-pink' },
  { id: 'lily',  name: 'Lily',  skin: 's1', hairColor: 'ginger', hairLength: 'medium',    eyeColor: 'green', hairStyle: 'pigtails',  top: 'top-mint' },
  { id: 'mia',   name: 'Mia',   skin: 's3', hairColor: 'brown',  hairLength: 'superlong', eyeColor: 'hazel', hairStyle: 'down',      top: 'top-purple' },
  { id: 'zara',  name: 'Zara',  skin: 's5', hairColor: 'black',  hairLength: 'long',      eyeColor: 'brown', hairStyle: 'curly',     top: 'top-yellow' },
  { id: 'ava',   name: 'Ava',   skin: 's6', hairColor: 'black',  hairLength: 'medium',    eyeColor: 'brown', hairStyle: 'spacebuns', top: 'top-blue' },
  { id: 'rosie', name: 'Rosie', skin: 's4', hairColor: 'brown',  hairLength: 'long',      eyeColor: 'grey',  hairStyle: 'braids',    top: 'top-red' },
];

export const RAINBOW = ['#ff4d4d', '#ffa63d', '#ffe14d', '#4dd97a', '#4da6ff', '#a46bff'];

// ---------- item makers ----------
const slot = (key, kind) => (id, label, color, extra = {}) =>
  ({ id: `${kind}-${id}`, value: `${kind}-${id}`, label, kind, action: 'slot', key, color, ...extra });

const lip = slot('lipstick', 'lip');
const shadow = slot('eyeshadow', 'shadow');
const masc = slot('mascara', 'masc');
const blush = slot('blush', 'blush');
const ear = slot('earrings', 'ear');
const neck = slot('necklace', 'neck');
const head = slot('headwear', 'head');
const top = slot('top', 'top');
const place = (kind, zone) => (id, label, color, extra = {}) =>
  ({ id: `${kind}-${id}`, label, kind, action: 'place', zone, color, ...extra });
const sticker = place('sticker', 'face');
const bow = place('bow', 'hair');
const clip = place('clip', 'hair');
const flower = place('flower', 'hair');
const bobble = place('bobble', 'hair');
const ext = (id, label, color, extra = {}) =>
  ({ id: `ext-${id}`, value: id, label, kind: 'ext', action: 'toggle', key: 'extensions', color, ...extra });
const style = (value, label) =>
  ({ id: `style-${value}`, value, label, kind: 'hairStyle', action: 'slot', key: 'hairStyle', required: true });
const hairColor = value =>
  ({ id: `haircol-${value}`, value, label: HAIR_COLORS[value].name, kind: 'hairColor', action: 'slot', key: 'hairColor', required: true });

export const TABS = [
  { id: 'lipstick', icon: '💄', label: 'Lipstick', groups: [{ items: [
    lip('red', 'Ruby red', '#e0174f'),
    lip('pink', 'Bubblegum', '#ff4f9a'),
    lip('coral', 'Coral', '#ff6f61'),
    lip('berry', 'Berry', '#9e1859'),
    lip('purple', 'Plum', '#8e44c9'),
    lip('nude', 'Toffee', '#c7856f'),
    lip('gloss', 'Pink gloss', '#ff94c8', { gloss: true }),
    lip('peach', 'Peach gloss', '#ffa47a', { gloss: true }),
    lip('sparkle', 'Sparkle', '#e33bb0', { glitter: true, gloss: true }),
    lip('blue', 'Mermaid', '#3d8cff', { gloss: true }),
  ] }] },
  { id: 'eyeshadow', icon: '👁️', label: 'Eyeshadow', groups: [{ items: [
    shadow('pink', 'Pink', '#ff7ec0'),
    shadow('purple', 'Purple', '#a35ce6'),
    shadow('blue', 'Blue', '#4fa3ff'),
    shadow('teal', 'Teal', '#2ec4b6'),
    shadow('green', 'Green', '#5cc96b'),
    shadow('peach', 'Peach', '#ffad85'),
    shadow('gold', 'Gold glitter', '#f2c14e', { glitter: true }),
    shadow('silver', 'Silver glitter', '#c9d1e3', { glitter: true }),
    shadow('pinkglitter', 'Pink glitter', '#ff5fae', { glitter: true }),
    shadow('rainbow', 'Rainbow', '#ff7ec0', { rainbow: true }),
  ] }] },
  { id: 'mascara', icon: '🖌️', label: 'Mascara', groups: [{ items: [
    masc('black', 'Black', '#1d1416'),
    masc('brown', 'Brown', '#5b3420'),
    masc('blue', 'Blue', '#2f6fe0'),
    masc('purple', 'Purple', '#8a3fd1'),
    masc('pink', 'Pink', '#ff3d9a'),
    masc('green', 'Green', '#22a65a'),
    masc('gold', 'Gold', '#d9a520'),
  ] }] },
  { id: 'blush', icon: '🌸', label: 'Blusher', groups: [{ items: [
    blush('pink', 'Pink', '#ff6fa8'),
    blush('peach', 'Peach', '#ff9a76'),
    blush('coral', 'Coral', '#ff6f61'),
    blush('rose', 'Rose', '#e04f7a'),
    blush('lilac', 'Lilac', '#c58af0'),
    blush('glitter', 'Glitter', '#ff7ec0', { glitter: true }),
    blush('hearts', 'Heart cheeks', '#ff5f9e', { hearts: true }),
  ] }] },
  { id: 'sparkles', icon: '✨', label: 'Sparkles', groups: [{ items: [
    sticker('heart', 'Heart', '#ff3d7f', { shape: 'heart' }),
    sticker('star', 'Star', '#ffcc33', { shape: 'star' }),
    sticker('gem', 'Gem', '#4fd6ff', { shape: 'gem' }),
    sticker('butterfly', 'Butterfly', '#b06cf0', { shape: 'butterfly' }),
    sticker('flower', 'Flower', '#ff8ac2', { shape: 'flower' }),
    sticker('rainbow', 'Rainbow', '#ff4d4d', { shape: 'rainbow' }),
    { id: 'freckles', label: 'Freckles', kind: 'freckles', action: 'toggle', key: 'freckles', value: true },
  ] }] },
  { id: 'hairStyle', icon: '💇‍♀️', label: 'Hairstyles', groups: [{ items: [
    style('down', 'Hair down'),
    style('curly', 'Curly'),
    style('ponytail', 'Ponytail'),
    style('pigtails', 'Pigtails'),
    style('bun', 'Bun'),
    style('spacebuns', 'Space buns'),
    style('braids', 'Plaits'),
    style('sidebraid', 'Side plait'),
  ] }] },
  { id: 'hairColor', icon: '🎨', label: 'Hair colour', groups: [{ items:
    Object.keys(HAIR_COLORS).map(hairColor),
  }] },
  { id: 'hairbits', icon: '🎀', label: 'Hair bits', groups: [
    { label: 'Bows', items: [
      bow('pink', 'Pink bow', '#ff5fa2'),
      bow('red', 'Red bow', '#e63946'),
      bow('blue', 'Blue bow', '#4f9dff'),
      bow('purple', 'Purple bow', '#9b5de5'),
      bow('yellow', 'Yellow bow', '#ffd23f'),
    ] },
    { label: 'Clips', items: [
      clip('heart', 'Heart clip', '#ff4f9a', { shape: 'heart' }),
      clip('star', 'Star clip', '#ffc933', { shape: 'star' }),
      clip('butterfly', 'Butterfly clip', '#5aa9ff', { shape: 'butterfly' }),
      flower('pink', 'Pink flower', '#ff8ac2'),
      flower('daisy', 'Daisy', '#ffffff'),
    ] },
    { label: 'Bobbles', items: [
      bobble('pink', 'Pink bobble', '#ff6fb0'),
      bobble('yellow', 'Yellow bobble', '#ffd23f'),
      bobble('purple', 'Purple bobble', '#a970ff'),
      bobble('blue', 'Blue bobble', '#4fb3ff'),
    ] },
    { label: 'Headbands', items: [
      head('pinkband', 'Pink headband', '#ff5fa2', { shape: 'band' }),
      head('blueband', 'Blue headband', '#4f9dff', { shape: 'band' }),
      head('tiara', 'Tiara', '#f5c542', { shape: 'tiara' }),
      head('crown', 'Flower crown', '#ff8ac2', { shape: 'flowers' }),
      head('cat', 'Cat ears', '#2f2a2c', { shape: 'cat' }),
    ] },
    { label: 'Extensions', items: [
      ext('pink', 'Pink streaks', '#ff4fa7'),
      ext('blue', 'Blue streaks', '#3fa0ff'),
      ext('purple', 'Purple streaks', '#9b5de5'),
      ext('green', 'Green streaks', '#3ccf7a'),
      ext('gold', 'Gold streaks', '#ffd23f'),
      ext('rainbow', 'Rainbow streaks', '#ff4d4d', { rainbow: true }),
    ] },
  ] },
  { id: 'earrings', icon: '💎', label: 'Earrings', groups: [{ items: [
    ear('pearl', 'Pearls', '#ffffff', { shape: 'pearl' }),
    ear('diamond', 'Diamonds', '#bdf3ff', { shape: 'diamond' }),
    ear('goldhoop', 'Gold hoops', '#e8b923', { shape: 'hoop' }),
    ear('silverhoop', 'Silver hoops', '#c4cbd8', { shape: 'hoop' }),
    ear('pinkhoop', 'Pink hoops', '#ff5fa2', { shape: 'hoop' }),
    ear('heart', 'Hearts', '#ff3d7f', { shape: 'heart' }),
    ear('star', 'Stars', '#ffcc33', { shape: 'star' }),
    ear('gem', 'Blue gems', '#4fa3ff', { shape: 'gem' }),
    ear('cherry', 'Cherries', '#e8213f', { shape: 'cherry' }),
  ] }] },
  { id: 'necklace', icon: '📿', label: 'Necklaces', groups: [{ items: [
    neck('pearls', 'Pearls', '#ffffff', { shape: 'pearls' }),
    neck('heart', 'Gold heart', '#e8b923', { shape: 'heart' }),
    neck('rainbow', 'Rainbow beads', '#ff4d4d', { shape: 'rainbow' }),
    neck('star', 'Star', '#ffcc33', { shape: 'star' }),
    neck('choker', 'Choker', '#8e44c9', { shape: 'choker' }),
    neck('diamond', 'Diamond', '#7fdcff', { shape: 'diamond' }),
    neck('sweets', 'Sweetie', '#ffb3d9', { shape: 'sweets' }),
  ] }] },
  { id: 'top', icon: '👚', label: 'Tops', groups: [{ items: [
    top('pink', 'Pink', '#ff8fc4'),
    top('purple', 'Purple', '#b38cf2'),
    top('blue', 'Blue', '#7cc4ff'),
    top('mint', 'Mint', '#7fe0c0'),
    top('yellow', 'Yellow', '#ffe17a'),
    top('red', 'Red', '#ff6b6b'),
    top('sparkpink', 'Sparkly pink', '#ff6fb0', { glitter: true }),
    top('sparkpurple', 'Sparkly purple', '#9b6bf0', { glitter: true }),
    top('rainbow', 'Rainbow', '#ff4d4d', { rainbow: true }),
  ] }] },
];

// Quick lookup: ITEMS['lip-red'] etc.
export const ITEMS = {};
for (const t of TABS) for (const g of t.groups) for (const it of g.items) ITEMS[it.id] = it;
