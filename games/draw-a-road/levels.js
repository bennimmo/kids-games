// Draw a Road – levels. World is 32 wide x 18 tall (metres), y goes UP.
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
    car: { x: 2.5, y: 3 }, flag: { x: 29, y: 3 },
    ground: [{ pts: [[0, 3], [12, 3]] }, { pts: [[25, 3], [32, 3]] }],
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
    blocks: [{ x: 19, y: 0, w: 1.2, h: 11 }],
    ink: 30, stars: [16, 10],
  },
];
