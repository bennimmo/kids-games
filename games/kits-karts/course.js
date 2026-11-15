// Course: the drawn track (from Raffy Race's track.js) plus heights.
// Where the loop crosses itself, the later part goes over the top:
//   'jump'   = ramp up, a gap over the other road, and a landing ramp
//   'bridge' = a bridge with ramps either side
// Pure data, no drawing.
import { TRACK_W, SPACING, nearestLocal, nearestGlobal } from '../race-track/track.js';

export { TRACK_W, SPACING };
export const BRIDGE_H = 42;
export const JUMP_H = 26;
export const LAND_H = 20;
export const RAMP = 170;      // length of each ramp
export const RAIL_H = 8;      // anything higher than this gets side rails
export const BARRIER = TRACK_W / 2 + 40; // barriers this far from the middle of the road

function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
function segInter(a, b, c, d) {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

// Every place the loop crosses itself. 'top' = the index of the part that goes over.
export function findCrossings(track) {
  const { pts, n } = track;
  const gap = Math.ceil((TRACK_W * 1.5) / SPACING);
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    for (let j = i + gap; j < n; j++) {
      if (n - (j - i) < gap) continue;
      const c = pts[j], d = pts[(j + 1) % n];
      if (!segInter(a, b, c, d)) continue;
      if (out.some(o => Math.abs(o.top - j) < 6 && Math.abs(o.low - i) < 6)) continue;
      const s = Math.abs(Math.sin(Math.atan2(b.y - a.y, b.x - a.x) - Math.atan2(d.y - c.y, d.x - c.x)));
      // where exactly they cross
      const r = { x: b.x - a.x, y: b.y - a.y }, q = { x: d.x - c.x, y: d.y - c.y };
      const den = r.x * q.y - r.y * q.x || 1;
      const t = ((c.x - a.x) * q.y - (c.y - a.y) * q.x) / den;
      out.push({ top: j, low: i, s: Math.max(s, 0.35), x: a.x + r.x * t, y: a.y + r.y * t });
    }
  }
  return out;
}

const smooth = t => t * t * (3 - 2 * t);
const clamp01 = t => Math.max(0, Math.min(1, t));

// Build the course: heights (elev), gaps (no road: the middle of a jump), rails.
// modes[k] is 'jump' or 'bridge' for crossing k (default jump).
export function makeCourse(track, modes = []) {
  const { n } = track;
  const crossings = findCrossings(track).map((c, k) => ({ ...c, mode: modes[k] === 'bridge' ? 'bridge' : 'jump' }));
  const elev = new Float32Array(n);
  const gap = new Uint8Array(n);
  const lip = new Int8Array(n);          // 1 = last bit of a jump ramp (launch!)
  const jumpOf = new Int16Array(n).fill(-1); // which crossing a point belongs to
  const deck = new Uint8Array(n);        // flat top of a bridge (the other road goes under)
  crossings.forEach((c, k) => {
    const g = (TRACK_W / 2 + 16) / c.s;  // half the gap over the other road
    c.half = g;
    const reach = Math.ceil((g + RAMP) / SPACING) + 1;
    for (let o = -reach; o <= reach; o++) {
      const i = ((c.top + o) % n + n) % n;
      const d = o * SPACING;
      const ad = Math.abs(d);
      let h = 0;
      if (c.mode === 'bridge') {
        h = BRIDGE_H * smooth(clamp01((g + RAMP - ad) / RAMP));
        if (ad <= g + SPACING) deck[i] = 1;
      } else if (d < -g) {
        const t = clamp01((d + g + RAMP) / RAMP);
        h = JUMP_H * Math.pow(t, 1.6);
        if (d + SPACING >= -g) lip[i] = 1;
      } else if (d <= g) {
        gap[i] = 1;
      } else {
        h = LAND_H * smooth(clamp01((g + RAMP - d) / RAMP));
      }
      if (h > elev[i]) elev[i] = h;
      if (ad <= g + RAMP) jumpOf[i] = k;
    }
  });
  return { track, n, pts: track.pts, crossings, elev, gap, lip, jumpOf, deck };
}

// Height of the road at a point index + fraction.
export function elevAt(course, i, f = 0) {
  const { n, elev } = course;
  const a = elev[i % n], b = elev[(i + 1) % n];
  return a + (b - a) * f;
}

// Where is this point relative to the road near index idx?
// Returns { i, f, lat (signed sideways distance), d (abs), along }
export function locate(course, x, y, idx, global = false) {
  const { pts, n } = course;
  const r = global ? nearestGlobal(course.track, x, y) : nearestLocal(course.track, x, y, idx);
  let i = r.i;
  // pick the segment (i -> i+1) or (i-1 -> i) that the point projects onto
  const p = pts[i], q = pts[(i + 1) % n];
  let vx = q.x - p.x, vy = q.y - p.y, L = Math.hypot(vx, vy) || 1;
  let t = ((x - p.x) * vx + (y - p.y) * vy) / (L * L);
  if (t < 0) {
    i = (i - 1 + n) % n;
    const p2 = pts[i];
    vx = p.x - p2.x; vy = p.y - p2.y; L = Math.hypot(vx, vy) || 1;
    t = clamp01(((x - p2.x) * vx + (y - p2.y) * vy) / (L * L));
  } else t = Math.min(1, t);
  const a = pts[i];
  const px = a.x + vx * t, py = a.y + vy * t;
  const lat = ((x - px) * -vy + (y - py) * vx) / L;
  return { i, f: t, lat, d: Math.abs(lat), px, py, nx: -vy / L, ny: vx / L };
}

// A simple hash of the track, so scenery is the same every time for the same track.
export function trackSeed(track) {
  let h = 2166136261;
  for (let i = 0; i < track.n; i += 3) {
    h ^= Math.round(track.pts[i].x) * 31 + Math.round(track.pts[i].y);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed) {
  let a = seed >>> 0;
  const r = () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + r() * (hi - lo);
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  return r;
}

// How far is (x,y) from the road centre line (any part)? Rough and fast (every 2nd point).
export function distToRoad(course, x, y) {
  const { pts, n } = course;
  let best = Infinity;
  for (let i = 0; i < n; i += 2) {
    const d = (pts[i].x - x) ** 2 + (pts[i].y - y) ** 2;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

// Where to paint direction arrows on the road: flat bits, spread round the loop.
export function arrowSpots(course, items = []) {
  const { n } = course, out = [];
  const busy = new Set();
  items.forEach(it => { if (it.idx >= 0) for (let o = -5; o <= 5; o++) busy.add(((it.idx + o) % n + n) % n); });
  const count = Math.max(4, Math.round(n / 55));
  for (let k = 0; k < count; k++) {
    let i = Math.floor((k + 0.5) * n / count);
    for (let t = 0; t < 12; t++) {
      const j = (i + t) % n;
      if (course.elev[j] === 0 && course.jumpOf[j] < 0 && !busy.has(j) && j > 6 && j < n - 4) { out.push(j); break; }
    }
  }
  return out;
}
