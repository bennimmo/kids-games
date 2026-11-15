// Themes: how the world looks. Pick one before racing.
// Colours are used by the 2D track designer and the 3D race.
export const THEMES = {
  city: {
    icon: '🏙️', name: 'City',
    sky: ['#4f9de8', '#cfe8ff'], fog: '#cfe2f5', fogNear: 700, fogFar: 2600,
    sun: '#fff4e0', sunI: 2.6, hemi: ['#dbeeff', '#5a5f66'], hemiI: 1.1,
    ground: '#7d8590', ground2: '#6c737d', grass: '#5fae4a',
    road: '#3c4048', road2: '#2f3238', line: '#ffffff', kerb: ['#e53935', '#ffffff'],
    edge: 'pavement', plant: 'lamp', offroad: 0.55, gravity: 1,
    ed: { bg: '#8b939e', dots: '#7a828c', road: '#3c4048', line: '#fff' },
  },
  country: {
    icon: '🌳', name: 'Countryside',
    sky: ['#3d8de0', '#d8f0ff'], fog: '#d5ecf7', fogNear: 800, fogFar: 3000,
    sun: '#fff1d6', sunI: 2.8, hemi: ['#e4f4ff', '#4a6b2a'], hemiI: 1.15,
    ground: '#5fae3e', ground2: '#4f9a34', grass: '#5fae3e',
    road: '#45474d', road2: '#393b40', line: '#ffffff', kerb: ['#e53935', '#ffffff'],
    edge: 'grass', plant: 'tree', offroad: 0.5, gravity: 1,
    ed: { bg: '#6dbb4c', dots: '#5ea83f', road: '#45474d', line: '#fff' },
  },
  desert: {
    icon: '🏜️', name: 'Desert',
    sky: ['#2f86d6', '#ffe7b8'], fog: '#f6dfb0', fogNear: 700, fogFar: 2800,
    sun: '#fff0c8', sunI: 3.1, hemi: ['#fff1d0', '#a8763c'], hemiI: 1.1,
    ground: '#e3b46a', ground2: '#d5a258', grass: '#e3b46a',
    road: '#6d5a4a', road2: '#5c4b3d', line: '#ffe082', kerb: ['#ff7043', '#fff3e0'],
    edge: 'sand', plant: 'cactus', offroad: 0.45, gravity: 1,
    ed: { bg: '#e8bd74', dots: '#d9aa5e', road: '#6d5a4a', line: '#ffe082' },
  },
  snow: {
    icon: '❄️', name: 'Snow',
    sky: ['#7fb0e0', '#eef6ff'], fog: '#e8f1fb', fogNear: 500, fogFar: 2300,
    sun: '#ffffff', sunI: 2.2, hemi: ['#ffffff', '#9fb4c8'], hemiI: 1.3,
    ground: '#f4f8fc', ground2: '#e2ebf4', grass: '#f4f8fc',
    road: '#5b6676', road2: '#4b5563', line: '#bfe9ff', kerb: ['#1e88e5', '#ffffff'],
    edge: 'snow', plant: 'pine', offroad: 0.45, gravity: 1, snowfall: true, slippy: 0.75,
    ed: { bg: '#eef4fa', dots: '#dde7f1', road: '#5b6676', line: '#bfe9ff' },
  },
  beach: {
    icon: '🏖️', name: 'Beach',
    sky: ['#1fa3e8', '#e6fbff'], fog: '#dff5fb', fogNear: 800, fogFar: 3000,
    sun: '#fff6dc', sunI: 3.0, hemi: ['#e8fbff', '#d6b77a'], hemiI: 1.15,
    ground: '#f1d79a', ground2: '#e6c886', grass: '#f1d79a',
    road: '#5a6670', road2: '#4b555e', line: '#ffffff', kerb: ['#00bcd4', '#ffffff'],
    edge: 'sand', plant: 'palm', offroad: 0.5, gravity: 1, sea: true,
    ed: { bg: '#f3dc9f', dots: '#e5cb88', road: '#5a6670', line: '#fff' },
  },
  volcano: {
    icon: '🌋', name: 'Volcano',
    sky: ['#2a0f12', '#c2552b'], fog: '#5a2a1e', fogNear: 500, fogFar: 2200,
    sun: '#ffb27a', sunI: 2.0, hemi: ['#ff9a6a', '#2a1410'], hemiI: 0.9,
    ground: '#3b2d2a', ground2: '#2c201e', grass: '#3b2d2a',
    road: '#26222a', road2: '#1d1a20', line: '#ffb300', kerb: ['#ff5722', '#212121'],
    edge: 'rock', plant: 'deadtree', offroad: 0.5, gravity: 1, lava: true,
    ed: { bg: '#4a3631', dots: '#3b2b27', road: '#26222a', line: '#ffb300' },
  },
  candy: {
    icon: '🍭', name: 'Candy Land',
    sky: ['#ff8ad8', '#fff0fb'], fog: '#ffe3f6', fogNear: 700, fogFar: 2800,
    sun: '#fff7fb', sunI: 2.6, hemi: ['#fff0fb', '#c06aa8'], hemiI: 1.25,
    ground: '#9de6b0', ground2: '#86d89c', grass: '#9de6b0',
    road: '#d36aa6', road2: '#bf5a93', line: '#ffffff', kerb: ['#ff4081', '#ffffff'],
    edge: 'grass', plant: 'lolly', offroad: 0.55, gravity: 1,
    ed: { bg: '#a8eabb', dots: '#93dca7', road: '#d36aa6', line: '#fff' },
  },
  moon: {
    icon: '🌙', name: 'Moon',
    sky: ['#000008', '#0b0c24'], fog: '#090a1c', fogNear: 1200, fogFar: 4200,
    sun: '#ffffff', sunI: 3.0, hemi: ['#aab4ff', '#222233'], hemiI: 0.7,
    ground: '#9a9aa2', ground2: '#85858e', grass: '#9a9aa2',
    road: '#30364a', road2: '#252a3a', line: '#5cf2ff', kerb: ['#5cf2ff', '#30364a'],
    edge: 'rock', plant: 'crystal', offroad: 0.5, gravity: 0.55, stars: true,
    ed: { bg: '#a3a3ab', dots: '#8e8e97', road: '#30364a', line: '#5cf2ff' },
  },
};
export const THEME_IDS = Object.keys(THEMES);

// what the 'tree' extra looks like in each theme (2D designer)
export const PLANT_ICON = { lamp: '💡', tree: '🌳', cactus: '🌵', pine: '🌲', palm: '🌴', deadtree: '🪨', lolly: '🍭', crystal: '💎' };
