// All the data for Beautiful Bells: girls, colours and every item in the menu.
// Items are plain data. `action` says what happens when one is dragged onto the girl:
//   slot   – sets look[key] = value (tap a worn item to take it off, unless required)
//   toggle – adds/removes value from a list (or flips true/false)
//   place  – sticks it where you drop it (bows, clips, face gems…)
//   paint  – a brush: rub it on to paint (lipstick, eyeshadow, blusher, face paint)
//   clear  – wipes one kind of paint off
//   cut    – scissors: swipe across the hair to cut it
//   grow   – magic potion: hair grows back

export const HAIR_COLORS = {
  platinum:   { name: 'Platinum',    base: '#f4e7c0', shade: '#cdb984', light: '#fffaf0' },
  blonde:     { name: 'Blonde',      base: '#f2cc6b', shade: '#c99a35', light: '#fff0b8' },
  strawberry: { name: 'Strawberry',  base: '#efaa6e', shade: '#c47c40', light: '#ffd7b0' },
  ginger:     { name: 'Ginger',      base: '#d8692e', shade: '#a54a17', light: '#f6a26c' },
  auburn:     { name: 'Auburn',      base: '#97412a', shade: '#672614', light: '#c46a4c' },
  brown:      { name: 'Brown',       base: '#8b5a3c', shade: '#5e3a24', light: '#b88461' },
  darkbrown:  { name: 'Dark brown',  base: '#4e3020', shade: '#2e1a10', light: '#7a5038' },
  black:      { name: 'Black',       base: '#2f2a2c', shade: '#141113', light: '#615a5e' },
  red:        { name: 'Red',         base: '#d93a4a', shade: '#a01f2e', light: '#ff7f8a' },
  pink:       { name: 'Pink',        base: '#ff8cc6', shade: '#d9579a', light: '#ffd0e8' },
  purple:     { name: 'Purple',      base: '#a67de8', shade: '#7650c2', light: '#d6c0fa' },
  blue:       { name: 'Blue',        base: '#5db5ef', shade: '#2f86c9', light: '#b5e0fc' },
  mint:       { name: 'Mint',        base: '#86dfc0', shade: '#4fb393', light: '#c9f5e5' },
  silver:     { name: 'Silver',      base: '#e4e0ee', shade: '#aca5bf', light: '#ffffff' },
};

export const HAIR_LENGTHS = {
  short:     { name: 'Short',      L: 290 },
  medium:    { name: 'Medium',     L: 365 },
  long:      { name: 'Long',       L: 445 },
  superlong: { name: 'Super long', L: 515 },
};

export const EYE_COLORS = {
  blue: '#3f8fe0', green: '#3fae67', brown: '#7a4626', hazel: '#a77a2c',
  grey: '#8394a8', violet: '#9b5fdc', amber: '#d08a1c', teal: '#21a39a',
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
  { id: 'bella',  name: 'Bella',  skin: 's2', hairColor: 'blonde',    hairLength: 'long',      eyeColor: 'blue',  hairStyle: 'down',      topStyle: 'tee',        topColor: 'pink', bottom: 'bot-skirtpink', shoes: 'shoe-pinktrainer' },
  { id: 'lily',   name: 'Lily',   skin: 's1', hairColor: 'ginger',    hairLength: 'medium',    eyeColor: 'green', hairStyle: 'pigtails',  topStyle: 'collar',     topColor: 'mint', bottom: 'bot-jeans', shoes: 'shoe-wellies', socks: 'sock-frilly' },
  { id: 'mia',    name: 'Mia',    skin: 's3', hairColor: 'brown',     hairLength: 'superlong', eyeColor: 'hazel', hairStyle: 'wavy',      topStyle: 'vneck',      topColor: 'purple', bottom: 'bot-leggingsblack', shoes: 'shoe-ballet' },
  { id: 'zara',   name: 'Zara',   skin: 's5', hairColor: 'black',     hairLength: 'long',      eyeColor: 'brown', hairStyle: 'curly',     topStyle: 'offshoulder', topColor: 'yellow', bottom: 'bot-shortsdenim', shoes: 'shoe-sandals' },
  { id: 'ava',    name: 'Ava',    skin: 's6', hairColor: 'black',     hairLength: 'medium',    eyeColor: 'brown', hairStyle: 'afro',      topStyle: 'hoodie',     topColor: 'sky', bottom: 'bot-joggers', shoes: 'shoe-whitetrainer' },
  { id: 'rosie',  name: 'Rosie',  skin: 's4', hairColor: 'auburn',    hairLength: 'long',      eyeColor: 'amber', hairStyle: 'braids',    topStyle: 'tee',        topColor: 'white', dress: 'dress-dungarees', shoes: 'shoe-boots' },
  { id: 'sophie', name: 'Sophie', skin: 's1', hairColor: 'platinum',  hairLength: 'superlong', eyeColor: 'teal',  hairStyle: 'sidesweep', topStyle: 'frill',      topColor: 'lilac', bottom: 'bot-tutulilac', shoes: 'shoe-silver', socks: 'sock-whitetights' },
  { id: 'priya',  name: 'Priya',  skin: 's4', hairColor: 'darkbrown', hairLength: 'superlong', eyeColor: 'brown', hairStyle: 'sidebraid', topStyle: 'party',      topColor: 'hotpink', bottom: 'bot-midi', shoes: 'shoe-gold' },
];

export const RAINBOW = ['#ff4d4d', '#ffa63d', '#ffe14d', '#4dd97a', '#4da6ff', '#a46bff'];

export const TOP_COLORS = {
  pink: '#ff9cc9', hotpink: '#ff3d9a', red: '#ef4b4b', coral: '#ff7f6b',
  orange: '#ffa94d', yellow: '#ffe066', mint: '#7fe0c0', green: '#5cc96b',
  teal: '#2ec4b6', sky: '#7cc4ff', denim: '#5a7fb5', navy: '#2f4a8a',
  lilac: '#c9a8f7', purple: '#9b5de5', white: '#f8f8fb', black: '#2c2a30',
};

// ---------- item makers ----------
const slot = (key, kind) => (id, label, color, extra = {}) =>
  ({ id: `${kind}-${id}`, value: `${kind}-${id}`, label, kind, action: 'slot', key, color, ...extra });
const masc = slot('mascara', 'masc');
const liner = slot('eyeliner', 'liner');
const ear = slot('earrings', 'ear');
const neck = slot('necklace', 'neck');
const head = slot('headwear', 'head');
const specs = slot('glasses', 'specs');
const bottom = slot('bottom', 'bot');
const dress = slot('dress', 'dress');
const sock = slot('socks', 'sock');
const shoe = slot('shoes', 'shoe');
const bag = slot('bag', 'bag');
const bracelet = slot('bracelet', 'brace');

const paint = (layer, prefix) => (id, label, color, extra = {}) =>
  ({ id: `${prefix}-${id}`, label, kind: 'paint', layer, action: 'paint', color, ...extra });
const lip = paint('lips', 'lip');
const shadow = paint('shadow', 'shadow');
const blush = paint('blush', 'blush');
const facepaint = paint('face', 'fp');
const remover = layer => ({ id: `wipe-${layer}`, label: 'Wipe off', kind: 'remover', layer, action: 'clear' });

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
const topStyle = (value, label) =>
  ({ id: `tstyle-${value}`, value, label, kind: 'topStyle', action: 'slot', key: 'topStyle', required: true });
const topColor = (value, label) =>
  ({ id: `tcol-${value}`, value, label, kind: 'topColor', action: 'slot', key: 'topColor', required: true, color: TOP_COLORS[value] });
const topPattern = (value, label) =>
  ({ id: `tpat-${value}`, value, label, kind: 'topPattern', action: 'slot', key: 'topPattern', required: true });

export const TABS = [
  { id: 'lips', icon: '💄', label: 'Lipstick', groups: [{ items: [
    remover('lips'),
    lip('red', 'Ruby red', '#d9143f'),
    lip('cherry', 'Cherry', '#b0102e'),
    lip('pink', 'Bubblegum', '#ff4f9a'),
    lip('rose', 'Rose', '#e2557a'),
    lip('coral', 'Coral', '#ff6f61'),
    lip('peach', 'Peach', '#ff9e7a'),
    lip('nude', 'Toffee', '#c7856f'),
    lip('berry', 'Berry', '#9e1859'),
    lip('plum', 'Plum', '#7d3aa8'),
    lip('lilac', 'Lilac', '#c48ef0'),
    lip('orange', 'Orange', '#ff7b1f'),
    lip('blue', 'Mermaid', '#3d8cff'),
    lip('gold', 'Gold', '#e2b13c', { glitter: true }),
    lip('sparkle', 'Pink sparkle', '#e33bb0', { glitter: true }),
    lip('rainbow', 'Rainbow', '#ff4d4d', { rainbow: true }),
  ] }] },
  { id: 'shadow', icon: '👁️', label: 'Eyeshadow', groups: [{ items: [
    remover('shadow'),
    shadow('pink', 'Pink', '#ff7ec0'),
    shadow('rose', 'Rose gold', '#e8a09a', { glitter: true }),
    shadow('peach', 'Peach', '#ffad85'),
    shadow('orange', 'Sunset', '#ff8c42'),
    shadow('gold', 'Gold', '#f2c14e', { glitter: true }),
    shadow('lemon', 'Lemon', '#ffe45c'),
    shadow('green', 'Green', '#5cc96b'),
    shadow('teal', 'Teal', '#2ec4b6'),
    shadow('blue', 'Blue', '#4fa3ff'),
    shadow('navy', 'Night', '#2f4a8a'),
    shadow('lilac', 'Lilac', '#c9a0f5'),
    shadow('purple', 'Purple', '#9b4fe0'),
    shadow('brown', 'Cocoa', '#8a5a44'),
    shadow('silver', 'Silver', '#c9d1e3', { glitter: true }),
    shadow('pinkglitter', 'Pink glitter', '#ff5fae', { glitter: true }),
    shadow('rainbow', 'Rainbow', '#ff7ec0', { rainbow: true }),
  ] }] },
  { id: 'blush', icon: '🌸', label: 'Blusher', groups: [{ items: [
    remover('blush'),
    blush('pink', 'Pink', '#ff5f9e'),
    blush('baby', 'Baby pink', '#ff9cc7'),
    blush('peach', 'Peach', '#ff9a76'),
    blush('coral', 'Coral', '#ff6f61'),
    blush('rose', 'Rose', '#d9466f'),
    blush('berry', 'Berry', '#b02a64'),
    blush('apricot', 'Apricot', '#ffb067'),
    blush('lilac', 'Lilac', '#c58af0'),
    blush('bronze', 'Bronze', '#b8794a'),
    blush('glitter', 'Glitter', '#ff7ec0', { glitter: true }),
    blush('gold', 'Gold shimmer', '#f2c14e', { glitter: true }),
  ] }] },
  { id: 'lashes', icon: '🖌️', label: 'Lashes', groups: [
    { label: 'Mascara', items: [
      masc('black', 'Black', '#1d1416'),
      masc('brown', 'Brown', '#5b3420'),
      masc('blue', 'Blue', '#2f6fe0'),
      masc('navy', 'Navy', '#24346e'),
      masc('purple', 'Purple', '#8a3fd1'),
      masc('pink', 'Pink', '#ff3d9a'),
      masc('green', 'Green', '#22a65a'),
      masc('teal', 'Teal', '#14a3a0'),
      masc('gold', 'Gold', '#d9a520'),
      masc('red', 'Red', '#d61f3c'),
    ] },
    { label: 'Eyeliner', items: [
      liner('black', 'Black wing', '#1d1416'),
      liner('brown', 'Brown wing', '#5b3420'),
      liner('purple', 'Purple wing', '#8a3fd1'),
      liner('blue', 'Blue wing', '#2f6fe0'),
      liner('pink', 'Pink wing', '#ff3d9a'),
      liner('gold', 'Gold glitter', '#e2b13c', { glitter: true }),
      liner('silver', 'Silver glitter', '#b8c2d6', { glitter: true }),
    ] },
  ] },
  { id: 'face', icon: '🖍️', label: 'Face paint', groups: [{ items: [
    remover('face'),
    facepaint('red', 'Red', '#ef3b4f'),
    facepaint('pink', 'Pink', '#ff5fae'),
    facepaint('orange', 'Orange', '#ff8c2e'),
    facepaint('yellow', 'Yellow', '#ffd23f'),
    facepaint('green', 'Green', '#3ccf7a'),
    facepaint('blue', 'Blue', '#3fa0ff'),
    facepaint('purple', 'Purple', '#9b5de5'),
    facepaint('white', 'White', '#ffffff'),
    facepaint('black', 'Black', '#2a2026'),
    facepaint('gold', 'Gold glitter', '#e8b923', { glitter: true }),
    facepaint('rainbow', 'Rainbow', '#ff4d4d', { rainbow: true }),
  ] }] },
  { id: 'sparkles', icon: '✨', label: 'Sparkles', groups: [{ items: [
    sticker('heart', 'Heart', '#ff3d7f', { shape: 'heart' }),
    sticker('star', 'Star', '#ffcc33', { shape: 'star' }),
    sticker('gem', 'Gem', '#4fd6ff', { shape: 'gem' }),
    sticker('pinkgem', 'Pink gem', '#ff6fc8', { shape: 'gem' }),
    sticker('butterfly', 'Butterfly', '#b06cf0', { shape: 'butterfly' }),
    sticker('flower', 'Flower', '#ff8ac2', { shape: 'flower' }),
    sticker('rainbow', 'Rainbow', '#ff4d4d', { shape: 'rainbow' }),
    sticker('moon', 'Moon', '#ffd84d', { shape: 'moon' }),
    sticker('sparkle', 'Twinkle', '#fff1a8', { shape: 'sparkle' }),
    sticker('ladybird', 'Ladybird', '#e8213f', { shape: 'ladybird' }),
    sticker('bolt', 'Lightning', '#ffcf2e', { shape: 'bolt' }),
    sticker('crown', 'Crown', '#f5c542', { shape: 'crown' }),
    sticker('cherry', 'Cherries', '#e8213f', { shape: 'cherry' }),
    sticker('note', 'Music', '#7b4bd6', { shape: 'note' }),
    { id: 'freckles', label: 'Freckles', kind: 'freckles', action: 'toggle', key: 'freckles', value: true },
  ] }] },
  { id: 'hair', icon: '💇‍♀️', label: 'Hair', groups: [
    { label: 'Hair tools', items: [
      { id: 'scissors', label: 'Scissors', kind: 'scissors', action: 'cut' },
      { id: 'grow', label: 'Grow potion', kind: 'grow', action: 'grow' },
    ] },
    { label: 'Hairstyles', items: [
      style('down', 'Hair down'),
      style('wavy', 'Wavy'),
      style('curly', 'Curly'),
      style('afro', 'Afro puff'),
      style('sidesweep', 'Side sweep'),
      style('halfup', 'Half up'),
      style('bob', 'Bob'),
      style('pixie', 'Pixie'),
      style('ponytail', 'Ponytail'),
      style('highpony', 'High pony'),
      style('pigtails', 'Pigtails'),
      style('bun', 'Bun'),
      style('messybun', 'Messy bun'),
      style('spacebuns', 'Space buns'),
      style('braids', 'Plaits'),
      style('sidebraid', 'Side plait'),
    ] },
  ] },
  { id: 'hairColor', icon: '🌈', label: 'Hair colour', groups: [{ items:
    Object.keys(HAIR_COLORS).map(hairColor),
  }] },
  { id: 'hairbits', icon: '🎀', label: 'Hair bits', groups: [
    { label: 'Bows', items: [
      bow('pink', 'Pink bow', '#ff5fa2'),
      bow('red', 'Red bow', '#e63946'),
      bow('blue', 'Blue bow', '#4f9dff'),
      bow('purple', 'Purple bow', '#9b5de5'),
      bow('yellow', 'Yellow bow', '#ffd23f'),
      bow('white', 'White bow', '#ffffff'),
      bow('black', 'Black bow', '#2c2a30'),
      bow('mint', 'Mint bow', '#5fd8b0'),
    ] },
    { label: 'Clips', items: [
      clip('heart', 'Heart clip', '#ff4f9a', { shape: 'heart' }),
      clip('star', 'Star clip', '#ffc933', { shape: 'star' }),
      clip('butterfly', 'Butterfly clip', '#5aa9ff', { shape: 'butterfly' }),
      clip('pinkfly', 'Pink butterfly', '#ff7ec0', { shape: 'butterfly' }),
      clip('moon', 'Moon clip', '#ffd84d', { shape: 'moon' }),
      clip('gem', 'Gem clip', '#4fd6ff', { shape: 'gem' }),
      clip('pearl', 'Pearl clip', '#ffffff', { shape: 'pearl' }),
      clip('cherry', 'Cherry clip', '#e8213f', { shape: 'cherry' }),
    ] },
    { label: 'Flowers', items: [
      flower('pink', 'Pink flower', '#ff8ac2'),
      flower('daisy', 'Daisy', '#ffffff'),
      flower('sun', 'Sunflower', '#ffc52e'),
      flower('lilac', 'Lilac flower', '#c58af0'),
      flower('red', 'Red flower', '#ef3b4f'),
    ] },
    { label: 'Bobbles', items: [
      bobble('pink', 'Pink bobble', '#ff6fb0'),
      bobble('yellow', 'Yellow bobble', '#ffd23f'),
      bobble('purple', 'Purple bobble', '#a970ff'),
      bobble('blue', 'Blue bobble', '#4fb3ff'),
      bobble('green', 'Green bobble', '#4fd67a'),
      bobble('red', 'Red bobble', '#ef3b4f'),
    ] },
    { label: 'Headbands', items: [
      head('pinkband', 'Pink band', '#ff5fa2', { shape: 'band' }),
      head('blueband', 'Blue band', '#4f9dff', { shape: 'band' }),
      head('bowband', 'Bow band', '#e63946', { shape: 'bowband' }),
      head('sparkle', 'Sparkle band', '#c9a0f5', { shape: 'sparkleband' }),
      head('tiara', 'Tiara', '#f5c542', { shape: 'tiara' }),
      head('crown', 'Queen crown', '#f5c542', { shape: 'crown' }),
      head('flowers', 'Flower crown', '#ff8ac2', { shape: 'flowers' }),
      head('cat', 'Cat ears', '#2f2a2c', { shape: 'cat' }),
      head('bunny', 'Bunny ears', '#ffffff', { shape: 'bunny' }),
      head('unicorn', 'Unicorn', '#ffffff', { shape: 'unicorn' }),
    ] },
    { label: 'Extensions', items: [
      ext('pink', 'Pink streaks', '#ff4fa7'),
      ext('blue', 'Blue streaks', '#3fa0ff'),
      ext('purple', 'Purple streaks', '#9b5de5'),
      ext('green', 'Green streaks', '#3ccf7a'),
      ext('gold', 'Gold streaks', '#ffd23f'),
      ext('red', 'Red streaks', '#ef3b4f'),
      ext('white', 'White streaks', '#ffffff'),
      ext('rainbow', 'Rainbow streaks', '#ff4d4d', { rainbow: true }),
    ] },
  ] },
  { id: 'earrings', icon: '💎', label: 'Earrings', groups: [{ items: [
    ear('pearl', 'Pearls', '#ffffff', { style: 'stud', shape: 'pearl' }),
    ear('diamond', 'Diamonds', '#bdf3ff', { style: 'stud', shape: 'gem' }),
    ear('starstud', 'Star studs', '#ffcc33', { style: 'stud', shape: 'star' }),
    ear('goldhoop', 'Gold hoops', '#e8b923', { style: 'hoop', size: 14 }),
    ear('bighoop', 'Big hoops', '#e8b923', { style: 'hoop', size: 22 }),
    ear('silverhoop', 'Silver hoops', '#c4cbd8', { style: 'hoop', size: 14 }),
    ear('pinkhoop', 'Pink hoops', '#ff5fa2', { style: 'hoop', size: 16 }),
    ear('heart', 'Hearts', '#ff3d7f', { style: 'drop', shape: 'heart' }),
    ear('star', 'Stars', '#ffcc33', { style: 'drop', shape: 'star' }),
    ear('gem', 'Blue gems', '#4fa3ff', { style: 'drop', shape: 'teardrop' }),
    ear('pinkgem', 'Pink gems', '#ff6fc8', { style: 'drop', shape: 'teardrop' }),
    ear('pearldrop', 'Pearl drops', '#ffffff', { style: 'drop', shape: 'pearl' }),
    ear('moon', 'Moons', '#ffd84d', { style: 'drop', shape: 'moon' }),
    ear('butterfly', 'Butterflies', '#b06cf0', { style: 'drop', shape: 'butterfly' }),
    ear('flower', 'Flowers', '#ff8ac2', { style: 'drop', shape: 'flower' }),
    ear('rainbow', 'Rainbows', '#ff4d4d', { style: 'drop', shape: 'rainbow' }),
    ear('cherry', 'Cherries', '#e8213f', { style: 'drop', shape: 'cherry' }),
  ] }] },
  { id: 'necklace', icon: '📿', label: 'Necklaces', view: 'both', groups: [{ items: [
    neck('pearls', 'Pearls', '#ffffff', { style: 'pearls' }),
    neck('heart', 'Gold heart', '#e8b923', { style: 'chain', chain: '#e8b923', shape: 'heart', pendant: '#ff3d7f' }),
    neck('locket', 'Locket', '#e8b923', { style: 'chain', chain: '#e8b923', shape: 'heart', pendant: '#e8b923', big: true }),
    neck('star', 'Star', '#ffcc33', { style: 'chain', chain: '#c4cbd8', shape: 'star', pendant: '#ffcc33' }),
    neck('moon', 'Moon', '#ffd84d', { style: 'chain', chain: '#c4cbd8', shape: 'moon', pendant: '#ffd84d' }),
    neck('diamond', 'Diamond', '#7fdcff', { style: 'chain', chain: '#c4cbd8', shape: 'gem', pendant: '#7fdcff' }),
    neck('butterfly', 'Butterfly', '#b06cf0', { style: 'chain', chain: '#e8b923', shape: 'butterfly', pendant: '#b06cf0' }),
    neck('gold', 'Gold chain', '#e8b923', { style: 'chain', chain: '#e8b923', thick: true }),
    neck('rainbow', 'Rainbow beads', '#ff4d4d', { style: 'beads' }),
    neck('sweets', 'Sweetie', '#ffb3d9', { style: 'sweets' }),
    neck('daisy', 'Daisy chain', '#ffffff', { style: 'daisies' }),
    neck('choker', 'Choker', '#8e44c9', { style: 'choker' }),
    neck('blackchoker', 'Black choker', '#2c2a30', { style: 'choker' }),
  ] }] },
  { id: 'glasses', icon: '🕶️', label: 'Glasses', groups: [{ items: [
    specs('round', 'Round', '#7b4bd6', { shape: 'round' }),
    specs('gold', 'Gold round', '#d9a520', { shape: 'round' }),
    specs('heart', 'Hearts', '#ff3d7f', { shape: 'heart' }),
    specs('star', 'Stars', '#ffc933', { shape: 'star' }),
    specs('cat', 'Cat eye', '#2c2a30', { shape: 'cat' }),
    specs('pinkcat', 'Pink cat eye', '#ff5fa2', { shape: 'cat' }),
    specs('sun', 'Sunglasses', '#2c2a30', { shape: 'sun' }),
    specs('pinksun', 'Pink shades', '#ff5fa2', { shape: 'sun', tint: '#ff9ccf' }),
  ] }] },
  { id: 'top', icon: '👚', label: 'Tops', view: 'body', groups: [
    { label: 'Styles', items: [
      topStyle('tee', 'T-shirt'),
      topStyle('vneck', 'V-neck'),
      topStyle('tank', 'Vest top'),
      topStyle('offshoulder', 'Off shoulder'),
      topStyle('polo', 'Polo neck'),
      topStyle('hoodie', 'Hoodie'),
      topStyle('collar', 'Collar top'),
      topStyle('frill', 'Frilly top'),
      topStyle('party', 'Party top'),
      topStyle('cardigan', 'Cardigan'),
    ] },
    { label: 'Colours', items: [
      topColor('pink', 'Pink'), topColor('hotpink', 'Hot pink'), topColor('red', 'Red'), topColor('coral', 'Coral'),
      topColor('orange', 'Orange'), topColor('yellow', 'Yellow'), topColor('mint', 'Mint'), topColor('green', 'Green'),
      topColor('teal', 'Teal'), topColor('sky', 'Sky blue'), topColor('denim', 'Denim'), topColor('navy', 'Navy'),
      topColor('lilac', 'Lilac'), topColor('purple', 'Purple'), topColor('white', 'White'), topColor('black', 'Black'),
    ] },
    { label: 'Patterns', items: [
      topPattern('plain', 'Plain'),
      topPattern('dots', 'Spots'),
      topPattern('stripes', 'Stripes'),
      topPattern('hearts', 'Hearts'),
      topPattern('stars', 'Stars'),
      topPattern('flowers', 'Flowers'),
      topPattern('checks', 'Checks'),
      topPattern('leopard', 'Leopard'),
      topPattern('sparkles', 'Sparkles'),
      topPattern('rainbow', 'Rainbow'),
    ] },
  ] },
  { id: 'bottoms', icon: '👖', label: 'Bottoms', view: 'body', groups: [
    { label: 'Trousers', items: [
      bottom('jeans', 'Jeans', '#5a7fb5', { style: 'trousers', denim: true }),
      bottom('pinkjeans', 'Pink jeans', '#ff8fc4', { style: 'trousers', denim: true }),
      bottom('joggers', 'Joggers', '#9aa3b5', { style: 'trousers', cuff: true }),
      bottom('leggingsblack', 'Black leggings', '#2c2a30', { style: 'trousers', tight: true }),
      bottom('leggingspink', 'Pink leggings', '#ff5fae', { style: 'trousers', tight: true }),
      bottom('leggingsstars', 'Star leggings', '#5b4bd6', { style: 'trousers', tight: true, pattern: 'stars' }),
      bottom('leggingsrainbow', 'Rainbow leggings', '#ff4d4d', { style: 'trousers', tight: true, pattern: 'rainbow' }),
    ] },
    { label: 'Shorts', items: [
      bottom('shortsdenim', 'Denim shorts', '#6a8fc5', { style: 'trousers', end: 805, denim: true }),
      bottom('shortspink', 'Pink shorts', '#ff9cc9', { style: 'trousers', end: 800 }),
      bottom('shortsyellow', 'Spotty shorts', '#ffd84d', { style: 'trousers', end: 800, pattern: 'dots' }),
    ] },
    { label: 'Skirts', items: [
      bottom('skirtpink', 'Pink skirt', '#ff7ec0', { style: 'skirt', hem: 795, flare: 40 }),
      bottom('skirtdenim', 'Denim skirt', '#5a7fb5', { style: 'skirt', hem: 790, flare: 22, denim: true }),
      bottom('skirtplaid', 'Tartan skirt', '#d6334a', { style: 'skirt', hem: 805, flare: 36, pattern: 'checks', pleats: true }),
      bottom('skirtnavy', 'School skirt', '#2f4a8a', { style: 'skirt', hem: 815, flare: 34, pleats: true }),
      bottom('midi', 'Flowery skirt', '#ffb3d1', { style: 'skirt', hem: 900, flare: 70, pattern: 'flowers' }),
      bottom('long', 'Long skirt', '#9b5de5', { style: 'skirt', hem: 990, flare: 90 }),
      bottom('tutupink', 'Pink tutu', '#ff9cc9', { style: 'tutu' }),
      bottom('tutulilac', 'Lilac tutu', '#c9a8f7', { style: 'tutu' }),
      bottom('tuturainbow', 'Rainbow tutu', '#ff4d4d', { style: 'tutu', rainbow: true }),
    ] },
  ] },
  { id: 'dresses', icon: '👗', label: 'Dresses', view: 'body', groups: [{ items: [
    dress('ballpink', 'Pink ball gown', '#ff8fc4', { neck: 'sweetheart', skirt: 'ball', sleeve: 'puff', sash: '#fff' }),
    dress('ballblue', 'Ice ball gown', '#8fd3ff', { neck: 'offshoulder', skirt: 'ball', sash: '#e0f6ff', glitter: true }),
    dress('ballgold', 'Gold ball gown', '#f5c542', { neck: 'sweetheart', skirt: 'ball', sash: '#fff3c4', glitter: true }),
    dress('party', 'Party dress', '#e63973', { neck: 'tank', skirt: 'party', sash: '#ffd23f' }),
    dress('partypurple', 'Purple party', '#9b5de5', { neck: 'sweetheart', skirt: 'party', glitter: true }),
    dress('summer', 'Summer dress', '#ffe066', { neck: 'tank', skirt: 'summer', pattern: 'flowers' }),
    dress('spotty', 'Spotty dress', '#ff6b6b', { neck: 'crew', skirt: 'party', pattern: 'dots', sleeve: 'short' }),
    dress('collar', 'Collar dress', '#2f4a8a', { neck: 'collar', skirt: 'collar', sleeve: 'short', pattern: 'dots' }),
    dress('mermaid', 'Mermaid', '#2ec4b6', { neck: 'sweetheart', skirt: 'mermaid', pattern: 'scales' }),
    dress('unicorn', 'Unicorn', '#f3d9ff', { neck: 'crew', skirt: 'unicorn', sleeve: 'puff' }),
    dress('dungarees', 'Dungarees', '#5a7fb5', { special: 'dungarees' }),
    dress('pinkdungarees', 'Pink dungarees', '#ff8fc4', { special: 'dungarees' }),
  ] }] },
  { id: 'shoes', icon: '👟', label: 'Shoes', view: 'body', groups: [
    { label: 'Shoes', items: [
      shoe('pinktrainer', 'Pink trainers', '#ff6fb0', { style: 'trainer' }),
      shoe('whitetrainer', 'White trainers', '#f4f4f8', { style: 'trainer' }),
      shoe('bluetrainer', 'Blue trainers', '#4f9dff', { style: 'trainer' }),
      shoe('ballet', 'Ballet shoes', '#ffb8d9', { style: 'flat', bow: true }),
      shoe('silver', 'Silver sparkles', '#cfd6e6', { style: 'flat', glitter: true }),
      shoe('gold', 'Gold sparkles', '#f5c542', { style: 'flat', glitter: true }),
      shoe('red', 'Red shoes', '#e0243c', { style: 'flat', strap: true }),
      shoe('sandals', 'Sandals', '#c98a4a', { style: 'sandal' }),
      shoe('wellies', 'Yellow wellies', '#ffd23f', { style: 'boot', top: 920 }),
      shoe('pinkwellies', 'Spotty wellies', '#ff6fb0', { style: 'boot', top: 920, dots: true }),
      shoe('boots', 'Brown boots', '#8a5a3c', { style: 'boot', top: 965 }),
      shoe('whiteboots', 'White boots', '#f4f4f8', { style: 'boot', top: 900 }),
      shoe('unicorn', 'Unicorn slippers', '#ffffff', { style: 'slipper' }),
    ] },
    { label: 'Socks & tights', items: [
      sock('white', 'White socks', '#ffffff', { top: 985 }),
      sock('frilly', 'Frilly socks', '#ffffff', { top: 980, frill: true }),
      sock('pinkknee', 'Pink knee socks', '#ff9cc9', { top: 885 }),
      sock('stripy', 'Stripy socks', '#ff5fae', { top: 885, pattern: 'stripes' }),
      sock('rainbowknee', 'Rainbow socks', '#ff4d4d', { top: 885, pattern: 'rainbow' }),
      sock('whitetights', 'White tights', '#f6f4fa', { top: 700, tights: true }),
      sock('pinktights', 'Pink tights', '#ffb3d9', { top: 700, tights: true }),
      sock('blacktights', 'Black tights', '#3a3540', { top: 700, tights: true }),
      sock('spottytights', 'Spotty tights', '#c9a8f7', { top: 700, tights: true, pattern: 'dots' }),
    ] },
  ] },
  { id: 'extras', icon: '👜', label: 'Extras', view: 'body', groups: [
    { label: 'Bags', items: [
      bag('pink', 'Pink handbag', '#ff6fb0', { style: 'handbag' }),
      bag('purple', 'Purple handbag', '#9b5de5', { style: 'handbag' }),
      bag('heart', 'Heart bag', '#e63973', { style: 'heart' }),
      bag('star', 'Star bag', '#ffc933', { style: 'star' }),
      bag('unicorn', 'Unicorn bag', '#ffffff', { style: 'unicorn' }),
      bag('rainbow', 'Rainbow purse', '#ff4d4d', { style: 'rainbow' }),
    ] },
    { label: 'Bracelets', items: [
      bracelet('beads', 'Friendship', '#ff4d4d', { style: 'beads' }),
      bracelet('gold', 'Gold bangle', '#e8b923', { style: 'bangle' }),
      bracelet('silver', 'Silver bangle', '#c4cbd8', { style: 'bangle' }),
      bracelet('pearls', 'Pearls', '#ffffff', { style: 'pearls' }),
      bracelet('charm', 'Charm bracelet', '#e8b923', { style: 'charm' }),
      bracelet('watch', 'Pink watch', '#ff6fb0', { style: 'watch' }),
    ] },
  ] },
];

// Quick lookup: ITEMS['lip-red'] etc.
export const ITEMS = {};
for (const t of TABS) for (const g of t.groups) for (const it of g.items) ITEMS[it.id] = it;
