// The list of games shown on the menu.
// To add a game: make a folder in /games with a game.js, then add it here.
export const GAMES = [
  {
    id: 'race-track',
    name: 'Raffy Race',
    icon: '🏎️',
    color: '#ffd54f',
    load: () => import('../games/race-track/game.js'),
  },
  {
    id: 'space-race',
    name: 'Star Dash',
    icon: '🚀',
    color: '#b39ddb',
    load: () => import('../games/space-race/game.js'),
  },
  {
    id: 'draw-a-road',
    name: 'Monster Doodle',
    icon: '🛻',
    color: '#81c784',
    load: () => import('../games/draw-a-road/game.js'),
  },
  {
    id: 'beautiful-bells',
    name: 'Beautiful Bells',
    icon: '💄',
    color: '#f8a5d0',
    load: () => import('../games/beautiful-bells/game.js'),
  },
  {
    id: 'balloon-pop',
    name: 'Balloon Pop',
    icon: '🎈',
    color: '#ff8a80',
    load: () => import('../games/balloon-pop/game.js'),
  },
  {
    id: 'paint',
    name: 'Paint Party',
    icon: '🎨',
    color: '#90caf9',
    load: () => import('../games/paint/game.js'),
  },
];
