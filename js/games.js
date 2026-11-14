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
    id: 'draw-a-road',
    name: 'Draw a Road',
    icon: '✏️',
    color: '#81c784',
    load: () => import('../games/draw-a-road/game.js'),
  },
];
