// Monster Doodle – levels. World is 32 wide x 18 tall (metres), y goes UP.
// ground:   lines of solid land (filled down to the bottom unless float: true)
// blocks:   solid boxes  {x, y, w, h}  (x,y = bottom-left)
// bouncers: trampolines  {x, y, w, power}  (y = top surface)
// boosters: speed arrows {x, y, w, h, dir}
// portals:  magic doors  {in:{x,y}, out:{x,y}, dir}
// floaty:   zones where the car floats up {x, y, w, h, lift}
// ink:      how much crayon you get (metres)
// stars:    [ink for 2 stars, ink for 3 stars] – use this much or less
// hint:     dotted line to show little ones where to draw
// engine:   false = no motor, roll with gravity
export const LEVELS = [
  {
    name: 'Fill the Gap',
    car: { x: 3, y: 6 }, flag: { x: 28, y: 6 },
    ground: [{ pts: [[0, 6], [11, 6]] }, { pts: [[20, 6], [32, 6]] }],
    ink: 30, stars: [18, 13],
    hint: [[10, 6], [21, 6]],
  },
  {
    name: 'Down the Hill',
    car: { x: 2.5, y: 13 }, flag: { x: 28, y: 3 },
    ground: [{ pts: [[0, 13], [6, 13]] }, { pts: [[21, 3], [32, 3]] }],
    ink: 34, stars: [22, 18],
    hint: [[5.5, 13], [12, 9], [22, 3]],
  },
  {
    name: 'Up We Go',
    car: { x: 3, y: 3 }, flag: { x: 28.5, y: 10 },
    ground: [{ pts: [[0, 3], [9, 3]] }, { pts: [[24, 10], [32, 10]] }],
    ink: 34, stars: [22, 18],
    hint: [[8.5, 3], [16, 6], [24.5, 10]],
  },
  {
    name: 'Stepping Stones',
    car: { x: 2.5, y: 5 }, flag: { x: 29, y: 5 },
    ground: [
      { pts: [[0, 5], [6, 5]] },
      { pts: [[11, 5], [13, 5]] },
      { pts: [[18, 5], [20, 5]] },
      { pts: [[25, 5], [32, 5]] },
    ],
    ink: 30, stars: [20, 16],
  },
  {
    name: 'Big Wall',
    car: { x: 3, y: 3 }, flag: { x: 28, y: 3 },
    ground: [{ pts: [[0, 3], [32, 3]] }],
    blocks: [{ x: 15, y: 3, w: 1.6, h: 6 }],
    ink: 34, stars: [24, 19],
  },
  {
    name: 'Bumpy Hole',
    car: { x: 2.5, y: 4 }, flag: { x: 29, y: 4 },
    ground: [{ pts: [[0, 4], [9, 4], [10, 1], [21, 1], [22, 4], [32, 4]] }],
    blocks: [{ x: 14, y: 1, w: 2.5, h: 2.5 }],
    ink: 26, stars: [16, 13],
  },
  {
    name: 'Boing!',
    car: { x: 2.5, y: 3 }, flag: { x: 28.5, y: 9 },
    ground: [{ pts: [[0, 3], [13, 3]] }, { pts: [[24, 9], [32, 9]] }],
    bouncers: [{ x: 10, y: 3, w: 3, power: 10 }],
    ink: 22, stars: [13, 9],
  },
  {
    name: 'Zoom!',
    car: { x: 2.5, y: 5 }, flag: { x: 29, y: 5 },
    ground: [{ pts: [[0, 5], [11, 5]] }, { pts: [[26, 5], [32, 5]] }],
    boosters: [{ x: 6, y: 5, w: 4, h: 1.5, dir: 1 }],
    ink: 12, stars: [7, 4.5],
  },
  {
    name: 'Magic Door',
    car: { x: 2.5, y: 3 }, flag: { x: 29.5, y: 3 },
    ground: [{ pts: [[0, 3], [12, 3]] }, { pts: [[27, 3], [32, 3]] }],
    blocks: [{ x: 12, y: 0, w: 1.4, h: 18 }],
    portals: [{ in: { x: 10, y: 4.2 }, out: { x: 16, y: 13 }, dir: 1 }],
    ink: 30, stars: [18, 13],
  },
  {
    name: 'No Engine!',
    engine: false,
    car: { x: 2, y: 15 }, flag: { x: 28.5, y: 6 },
    ground: [{ pts: [[0, 15.5], [5, 14]] }, { pts: [[24, 6], [32, 6]] }],
    ink: 36, stars: [24, 20],
    hint: [[4.5, 14.2], [13, 7], [24.5, 6]],
  },
  {
    name: 'Floaty Bubbles',
    car: { x: 2.5, y: 3 }, flag: { x: 28.5, y: 12 },
    ground: [{ pts: [[0, 3], [10, 3]] }, { pts: [[21, 12], [32, 12]] }],
    floaty: [{ x: 10, y: 0, w: 8, h: 18, lift: 2 }],
    ink: 22, stars: [10, 6],
  },
  {
    name: 'Crazy Ride',
    car: { x: 2, y: 12 }, flag: { x: 30, y: 13 },
    ground: [{ pts: [[0, 12], [6, 12]] }, { pts: [[8, 1], [19, 1]] }, { pts: [[28, 13], [32, 13]] }],
    boosters: [{ x: 12, y: 1, w: 4, h: 1.5, dir: 1 }],
    portals: [{ in: { x: 18, y: 2.2 }, out: { x: 22, y: 15 }, dir: 1 }],
    blocks: [{ x: 19, y: 0, w: 1.2, h: 11 }, { x: 5.4, y: 12, w: 0.6, h: 1 }],
    ink: 30, stars: [16, 10],
  },
  {
    name: 'Ski Jump',
    car: { x: 2.5, y: 14 }, flag: { x: 29, y: 5 },
    ground: [{ pts: [[0, 14], [6, 14]] }, { pts: [[17, 5], [32, 5]] }],
    ink: 16, stars: [12, 9],
  },
  {
    name: 'Low Bridge',
    car: { x: 2.5, y: 5 }, flag: { x: 29, y: 5 },
    ground: [{ pts: [[0, 5], [10, 5]] }, { pts: [[22, 5], [32, 5]] }],
    blocks: [{ x: 14, y: 7.4, w: 4, h: 10.6 }],
    ink: 26, stars: [16, 13.5],
  },
  {
    name: 'Squeeze Through',
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 3 },
    ground: [{ pts: [[0, 3], [32, 3]] }],
    blocks: [{ x: 15, y: 3, w: 1.6, h: 2.2 }, { x: 15, y: 8.2, w: 1.6, h: 9.8 }],
    ink: 24, stars: [15, 12.5],
  },
  {
    name: 'Twin Doors',
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 5 },
    ground: [{ pts: [[0, 3], [9.5, 3]] }, { pts: [[24, 5], [32, 5]] }],
    blocks: [{ x: 9.5, y: 0, w: 1.2, h: 10 }],
    portals: [{ in: { x: 8, y: 4.2 }, out: { x: 12.5, y: 14 }, dir: 1 }, { in: { x: 20, y: 14 }, out: { x: 25.5, y: 6.5 }, dir: 1 }],
    ink: 22, stars: [14, 11],
  },
  {
    name: 'Roller Coaster',
    engine: false,
    car: { x: 2, y: 15 }, flag: { x: 29, y: 8 },
    ground: [{ pts: [[0, 15.5], [5, 14]] }, { pts: [[23, 8], [32, 8]] }],
    ink: 34, stars: [27, 24],
  },
  {
    name: 'Rocket Climb',
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 13 },
    ground: [{ pts: [[0, 3], [12, 3]] }, { pts: [[24, 13], [32, 13]] }],
    boosters: [{ x: 6, y: 3, w: 4, h: 1.5, dir: 1 }],
    ink: 14, stars: [10, 8],
  },
  {
    name: 'Bubble Hop',
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 3 },
    ground: [{ pts: [[0, 3], [32, 3]] }],
    blocks: [{ x: 18, y: 3, w: 1.5, h: 8 }],
    floaty: [{ x: 9, y: 0, w: 9, h: 18, lift: 2 }],
    ink: 14, stars: [8, 5],
  },
  {
    name: 'Long Slide',
    engine: false,
    car: { x: 2, y: 16 }, flag: { x: 29, y: 2 },
    ground: [{ pts: [[0, 16.5], [5, 15.5]] }, { pts: [[24, 2], [32, 2]] }],
    blocks: [{ x: 14, y: 0, w: 1.5, h: 8 }],
    ink: 36, stars: [29, 26],
  },
  {
    name: 'Double Boing',
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 10.5 },
    ground: [{ pts: [[0, 3], [11, 3]] }, { pts: [[20, 6], [24, 6]], float: true }, { pts: [[25, 10.5], [32, 10.5]] }],
    bouncers: [{ x: 8, y: 3, w: 3, power: 9 }, { x: 20.5, y: 6, w: 3, power: 12 }],
    ink: 16, stars: [10, 7],
  },
  {
    name: 'Zig Zag',
    car: { x: 2.5, y: 4 }, flag: { x: 29.5, y: 9 },
    ground: [{ pts: [[0, 4], [6, 4]] }, { pts: [[9, 6.5], [12, 6.5]], float: true }, { pts: [[15, 4], [18, 4]], float: true }, { pts: [[21, 6.5], [24, 6.5]], float: true }, { pts: [[27, 9], [32, 9]] }],
    ink: 34, stars: [28, 24],
  },
  {
    name: 'Down the Hole',
    car: { x: 2.5, y: 10 }, flag: { x: 29, y: 13 },
    ground: [{ pts: [[0, 10], [8, 10]] }, { pts: [[17.5, 1], [20, 1]] }, { pts: [[26, 13], [32, 13]] }],
    blocks: [{ x: 20, y: 0, w: 1.5, h: 13 }, { x: 7.4, y: 10, w: 0.6, h: 1 }],
    portals: [{ in: { x: 18.5, y: 2.2 }, out: { x: 23, y: 15.5 }, dir: 1 }],
    ink: 24, stars: [17, 14.5],
  },
  {
    name: 'Grand Finale',
    car: { x: 2, y: 7 }, flag: { x: 29.5, y: 14 },
    ground: [{ pts: [[0, 7], [7, 7]] }, { pts: [[27, 14], [32, 14]] }],
    blocks: [{ x: 22.5, y: 0, w: 1.2, h: 14 }],
    boosters: [{ x: 2, y: 7, w: 4, h: 1.5, dir: 1 }],
    portals: [{ in: { x: 21.6, y: 9.2 }, out: { x: 24.5, y: 16.5 }, dir: 1 }],
    floaty: [{ x: 11, y: 0, w: 6, h: 18, lift: 2 }],
    ink: 12, stars: [5, 3.2],
  },
];
