// Age groups on the menu, in order. Each game picks one with `age`.
export const AGES = [
  { id: 'little', name: 'Ages 3–5', color: '#ffca28' },
  { id: 'middle', name: 'Ages 5–7', color: '#66bb6a' },
  { id: 'big', name: 'Ages 7+', color: '#42a5f5' },
];

// The list of games shown on the menu.
// To add a game: make a folder in /games with a game.js, then add it here.
export const GAMES = [
  {
    id: 'sky-pilot',
    age: 'big',
    name: 'Sky Pilot',
    icon: '✈️',
    color: '#81d4fa',
    load: () => import('../games/sky-pilot/game.js'),
  },
  {
    id: 'choo-choo',
    age: 'little',
    name: 'Choo Choo Wilf',
    icon: '🚂',
    color: '#ef9a9a',
    load: () => import('../games/choo-choo/game.js'),
  },
  {
    id: 'kits-karts',
    age: 'middle',
    name: "Kit's Karts",
    icon: '🏁',
    color: '#ff7043',
    load: () => import('../games/kits-karts/game.js'),
  },
  {
    id: 'race-track',
    age: 'middle',
    name: 'Raffy Race',
    icon: '🏎️',
    color: '#ffd54f',
    load: () => import('../games/race-track/game.js'),
  },
  {
    id: 'space-race',
    age: 'middle',
    name: 'Star Dash',
    icon: '🚀',
    color: '#b39ddb',
    load: () => import('../games/space-race/game.js'),
  },
  {
    id: 'draw-a-road',
    age: 'middle',
    name: 'Monster Doodle',
    icon: '🛻',
    color: '#81c784',
    load: () => import('../games/draw-a-road/game.js'),
  },
  {
    id: 'beautiful-bells',
    age: 'little',
    name: 'Beautiful Bells',
    icon: '💄',
    color: '#f8a5d0',
    load: () => import('../games/beautiful-bells/game.js'),
  },
  {
    id: 'balloon-pop',
    age: 'little',
    name: 'Balloon Pop',
    icon: '🎈',
    color: '#ff8a80',
    load: () => import('../games/balloon-pop/game.js'),
  },
  {
    id: 'tank-tantrum',
    age: 'big',
    name: 'Tank Tantrum',
    icon: '💥',
    color: '#ffab91',
    load: () => import('../games/tank-tantrum/game.js'),
  },
  {
    id: 'paint',
    age: 'little',
    name: 'Paint Party',
    icon: '🎨',
    color: '#90caf9',
    load: () => import('../games/paint/game.js'),
  },
];
