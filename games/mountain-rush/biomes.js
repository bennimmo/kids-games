// Mountain Rush: the maps and how each one looks. Pure data.
//
// Each map has two routes from the same start gate to the same finish. They split, cross
// and tangle on the way down. Route A is the flowy line (berms, tables, rollers),
// route B the techy line (drops, gaps, rock gardens).

export const BIOMES = {
  forest: {
    fog: 0xb9c9cf, zenith: [0.24, 0.45, 0.78], sun: [-0.45, 0.62, 0.64], sunColor: 0xfff0d8, sunI: 2.7, hemiSky: 0xc4dcf2, hemiGround: 0x55603f, hemiI: 0.75,
    grass: [52, 78, 28, 50, 62, 22], dry: [60, 25, 10], floor: [70, 52, 34, 55, 38, 22],
    dirt: [128, 93, 63], stones: [['#cbb89c', '#8a755e'], ['#b3a08a', '#76634f']],
    rock: [1, 0.98, 0.94], lichen: true, blades: [0.2, 0.36, 0.1], bladeTip: [0.05, 0.04, 0],
    trees: { density: 0.85, kinds: [['pine', 0.82], ['birch', 0.18]] },
    plants: { density: 0.5, kinds: [['fern', 0.6], ['bush', 0.4]] }, logs: 0.6,
    dust: 0xb59a7a, grip: 1, roll: 1, snow: 0,
  },
  desert: {
    fog: 0xe3c9a8, zenith: [0.33, 0.52, 0.82], sun: [-0.5, 0.7, 0.5], sunColor: 0xfff2dc, sunI: 3.1, hemiSky: 0xd8e2f0, hemiGround: 0x8a5a3a, hemiI: 0.8,
    grass: [188, 140, 96, 44, 34, 26], dry: [20, 14, 4], floor: [170, 112, 74, 40, 28, 20],
    dirt: [150, 88, 56], stones: [['#e2b590', '#9c6444'], ['#cf9f7d', '#8a5236']],
    rock: [1.25, 0.82, 0.62], lichen: false, blades: [0.42, 0.36, 0.16], bladeTip: [0.12, 0.08, 0.02],
    trees: { density: 0.3, kinds: [['juniper', 0.6], ['cactus', 0.3], ['dead', 0.1]] },
    plants: { density: 0.35, kinds: [['shrub', 1]] }, logs: 0,
    dust: 0xd09a6a, grip: 0.95, roll: 0.9, snow: 0, terrace: 9,
  },
  snow: {
    fog: 0xd3dde6, zenith: [0.3, 0.5, 0.8], sun: [-0.4, 0.55, 0.7], sunColor: 0xfff6ea, sunI: 2.5, hemiSky: 0xdbe8f5, hemiGround: 0x9aa8b6, hemiI: 0.95,
    grass: [232, 238, 245, 18, 16, 12], dry: [0, 0, 0], floor: [220, 228, 238, 20, 18, 14],
    dirt: [196, 188, 178], stones: [['#e8eef4', '#a8b4c0'], ['#d0d8e0', '#8f9aa6']],
    rock: [0.92, 0.95, 1.02], lichen: false, blades: [0, 0, 0], bladeTip: [0, 0, 0],
    trees: { density: 0.7, kinds: [['snowpine', 1]] },
    plants: { density: 0.15, kinds: [['snowbush', 1]] }, logs: 0.2,
    dust: 0xf2f6fa, grip: 0.82, roll: 0.75, snow: 1,
  },
};

export const MAPS = {
  'pine-ridge': { name: 'Pine Ridge', sub: 'Forest flow, berms and jumps', style: { twist: 1, width: 0, minG: 0.07, maxG: 0.36, drop: 1 }, biome: 'forest', seed: 7, W: 520, L: 1300, top: 330, hills: 34, ridges: 10,
    routes: [{ name: 'Flow line', kinds: ['table', 'woodstep', 'rollers', 'hip', 'kicker', 'triple', 'woodkicker', 'whoops', 'stepdown', 'double', 'stepup', 'drop'] }, { name: 'Tech line', kinds: ['tech', 'woodstep', 'drop', 'skinny', 'gap', 'stairs', 'woodkicker', 'rocks', 'stepdown', 'tech', 'hip', 'drop'] }] },
  'red-rock': { name: 'Red Rock', sub: 'Wide, steep and fast. Big drops', biome: 'desert', seed: 23, W: 560, L: 1250, top: 330, hills: 40, ridges: 18, style: { twist: 0.6, width: 0.5, minG: 0.09, maxG: 0.42, drop: 1.5 },
    routes: [{ name: 'Canyon line', kinds: ['table', 'stepdown', 'woodkicker', 'triple', 'drop', 'hip', 'woodstep', 'rollers', 'gap', 'whoops', 'stepup'] }, { name: 'Mesa line', kinds: ['stairs', 'drop', 'gap', 'woodstep', 'tech', 'stepdown', 'skinny', 'drop', 'woodkicker', 'tech', 'gap'] }] },
  'snow-peak': { name: 'Snow Peak', sub: 'Twisty, slippy, tight berms', biome: 'snow', seed: 41, W: 520, L: 1350, top: 380, hills: 30, ridges: 14, style: { twist: 1.35, width: -0.15, minG: 0.08, maxG: 0.34, drop: 1 },
    routes: [{ name: 'Glacier line', kinds: ['table', 'triple', 'woodstep', 'whoops', 'kicker', 'hip', 'rollers', 'woodkicker', 'double', 'stepdown', 'stepup'] }, { name: 'Couloir line', kinds: ['tech', 'drop', 'woodstep', 'stairs', 'skinny', 'gap', 'tech', 'stepdown', 'woodkicker', 'drop', 'hip'] }] },
};
export const MAP_ORDER = ['pine-ridge', 'red-rock', 'snow-peak'];
