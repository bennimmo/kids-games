// Track geometry: turns a hand-drawn stroke into a smooth closed loop,
// finds where it crosses itself (bridges) and snaps extras onto it.
// Everything here is plain data so it can be sent to friends online later.

export const WORLD = { w: 1600, h: 1000 };
export const TRACK_W = 88;
export const JUMP_L = 50;
export const WATER_RX = TRACK_W * 0.75;
export const WATER_RY = TRACK_W * 0.62;
export const BOOST_L = 46;

// Extras that sit where you drop them (not snapped onto the track).
export const FREE_ITEMS = ['cone', 'tyres', 'tree', 'stand'];
// Things cars bump into: circle radius, or box half-sizes.
export const SOLIDS = { tyres: { r: 20 }, tree: { r: 15 }, stand: { box: [72, 24] } };
export const SPACING = 12;
export const TUNNEL_HALF = 7; // tunnel covers idx-7 .. idx+7

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function resample(pts, spacing) {
  if (pts.length < 2) return pts.map(p => ({ x: p.x, y: p.y }));
  const out = [{ x: pts[0].x, y: pts[0].y }];
  let prev = pts[0];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    let dx = p.x - prev.x, dy = p.y - prev.y, d = Math.hypot(dx, dy);
    while (d > 0 && carry + d >= spacing) {
      const t = (spacing - carry) / d;
      const q = { x: prev.x + dx * t, y: prev.y + dy * t };
      out.push(q);
      prev = q; carry = 0;
      dx = p.x - prev.x; dy = p.y - prev.y; d = Math.hypot(dx, dy);
    }
    carry += d;
    prev = p;
  }
  return out;
}

function chaikinClosed(pts) {
  const out = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    out.push({ x: p.x * 0.75 + q.x * 0.25, y: p.y * 0.75 + q.y * 0.25 });
    out.push({ x: p.x * 0.25 + q.x * 0.75, y: p.y * 0.25 + q.y * 0.75 });
  }
  return out;
}

function closedResample(pts, spacing) {
  const p = resample([...pts, pts[0]], spacing);
  while (p.length > 2 && dist(p[p.length - 1], p[0]) < spacing * 0.6) p.pop();
  return p;
}

function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
function segInter(a, b, c, d) {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

// Where the loop crosses itself, the later part becomes a bridge.
function findBridges(pts) {
  const n = pts.length;
  const bridge = new Array(n).fill(false);
  const under = new Array(n).fill(false); // the road going under a bridge
  const gap = Math.ceil((TRACK_W * 1.5) / SPACING);
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    for (let j = i + gap; j < n; j++) {
      if (n - (j - i) < gap) continue;
      const c = pts[j], d = pts[(j + 1) % n];
      if (!segInter(a, b, c, d)) continue;
      const s = Math.abs(Math.sin(Math.atan2(b.y - a.y, b.x - a.x) - Math.atan2(d.y - c.y, d.x - c.x)));
      const L = (TRACK_W / 2 + 18) / Math.max(s, 0.3) + 16;
      const k = Math.ceil(L / SPACING);
      for (let o = -k; o <= k + 1; o++) bridge[((j + o) % n + n) % n] = true;
      for (let o = -k; o <= k + 1; o++) under[((i + o) % n + n) % n] = true;
    }
  }
  // contiguous runs, for drawing
  const runs = [];
  if (bridge.every(Boolean)) bridge.fill(false); // silly case
  for (let i = 0; i < n; i++) {
    if (bridge[i] && !bridge[(i - 1 + n) % n]) {
      let len = 0;
      while (bridge[(i + len) % n] && len < n) len++;
      runs.push({ start: i, len });
    }
  }
  return { bridge, runs, under };
}

// Put the start line on a spot far away from any bridge.
function pickStart(p) {
  const n = p.length;
  const { bridge: top, under } = findBridges(withAngles(p));
  const bridge = top.map((b, i) => b || under[i]);
  if (!bridge.some(Boolean)) return p;
  let best = 0, bestD = -1;
  for (let i = 0; i < n; i++) {
    let d = n;
    for (let j = 0; j < n; j++) {
      if (!bridge[j]) continue;
      const g = Math.abs(i - j);
      d = Math.min(d, g, n - g);
    }
    if (d > bestD) { bestD = d; best = i; }
  }
  return [...p.slice(best), ...p.slice(0, best)];
}

function withAngles(p) {
  const n = p.length;
  return p.map((q, i) => {
    const a = p[(i - 1 + n) % n], b = p[(i + 1) % n];
    return { x: q.x, y: q.y, a: Math.atan2(b.y - a.y, b.x - a.x) };
  });
}

function finish(p) {
  const n = p.length;
  const pts = p.map((q, i) => {
    const a = p[(i - 1 + n) % n], b = p[(i + 1) % n];
    return { x: q.x, y: q.y, a: Math.atan2(b.y - a.y, b.x - a.x) };
  });
  const { bridge, runs } = findBridges(pts);
  return { pts, n, bridge, runs };
}

function segPoint(a, b, c, d) {
  const r = { x: b.x - a.x, y: b.y - a.y }, q = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * q.y - r.y * q.x || 1;
  const t = ((c.x - a.x) * q.y - (c.y - a.y) * q.x) / den;
  return { x: a.x + r.x * t, y: a.y + r.y * t };
}

// smallest distance from point q to the polyline pts[a..b]
function distToPart(q, pts, a, b) {
  let best = Infinity;
  for (let i = a; i < b; i++) {
    const p = pts[i], r = pts[i + 1];
    const vx = r.x - p.x, vy = r.y - p.y;
    const t = Math.max(0, Math.min(1, ((q.x - p.x) * vx + (q.y - p.y) * vy) / (vx * vx + vy * vy || 1)));
    best = Math.min(best, Math.hypot(p.x + vx * t - q.x, p.y + vy * t - q.y));
  }
  return best;
}

// If the end of the line overlaps the start, cut off the extra bits
// so the loop joins cleanly (no messy bridge at the join).
// Only cuts bits that go over track we keep anyway, so a figure of eight
// (which crosses itself in the middle) is never chopped down to one loop.
function trimEnds(p) {
  const n = p.length;
  const head = Math.floor(n * 0.35), tail = Math.floor(n * 0.65);
  let bi = 0, bj = n - 1, bd = Infinity;
  for (let i = 0; i <= head; i++) {
    for (let j = tail; j < n; j++) {
      const d = (p[i].x - p[j].x) ** 2 + (p[i].y - p[j].y) ** 2;
      if (d < bd) { bd = d; bi = i; bj = j; }
    }
  }
  if (Math.sqrt(bd) >= TRACK_W * 0.8) return p;
  if (bi === 0 && bj === n - 1) return p;
  const removed = [...p.slice(0, bi), ...p.slice(bj + 1)];
  for (const q of removed) {
    if (distToPart(q, p, bi, bj) > TRACK_W * 0.9) return p; // a real part of the track: keep it all
  }
  return p.slice(bi, bj + 1);
}

// Remove little knots (tiny loops) where the line crosses itself very close by.
function removeSmallLoops(p, maxLen) {
  for (let guard = 0; guard < 30; guard++) {
    let found = false;
    outer:
    for (let i = 0; i < p.length - 3; i++) {
      for (let j = i + 2; j < p.length - 1 && (j - i) * 8 < maxLen; j++) {
        if (segInter(p[i], p[i + 1], p[j], p[j + 1])) {
          const x = segPoint(p[i], p[i + 1], p[j], p[j + 1]);
          p = [...p.slice(0, i + 1), x, ...p.slice(j + 1)];
          found = true;
          break outer;
        }
      }
    }
    if (!found) break;
  }
  return p;
}

// raw: array of {x,y} from the finger/mouse. Returns null if too small.
export function buildTrack(raw) {
  const m = 50;
  const clamped = raw.map(p => ({
    x: Math.max(m, Math.min(WORLD.w - m, p.x)),
    y: Math.max(m, Math.min(WORLD.h - m, p.y)),
  }));
  let p = resample(clamped, 8);
  if (p.length < 12) return null;
  p = trimEnds(p);
  p = removeSmallLoops(p, 320);
  if (p.length < 12) return null;
  p = closedResample(p, 8);
  p = removeSmallLoops([...p, p[0]], 320).slice(0, -1);
  for (let k = 0; k < 3; k++) p = chaikinClosed(p);
  p = closedResample(p, SPACING);
  if (p.length * SPACING < 700) return null;
  return finish(pickStart(p));
}

// For sending over the network later: compact form and back again.
export function trackToJSON(track) {
  return track.pts.map(p => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10]);
}
export function trackFromJSON(arr) {
  return finish(arr.map(([x, y]) => ({ x, y })));
}

export function nearestLocal(track, x, y, idx, back = 6, fwd = 12) {
  const { pts, n } = track;
  let best = idx, bd = Infinity;
  for (let o = -back; o <= fwd; o++) {
    const i = ((idx + o) % n + n) % n;
    const d = (pts[i].x - x) ** 2 + (pts[i].y - y) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return { i: best, d: segDist(track, x, y, best) };
}

export function nearestGlobal(track, x, y) {
  const { pts, n } = track;
  let best = 0, bd = Infinity;
  for (let i = 0; i < n; i++) {
    const d = (pts[i].x - x) ** 2 + (pts[i].y - y) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return { i: best, d: segDist(track, x, y, best) };
}

// distance from point to the two segments around point i
function segDist(track, x, y, i) {
  const { pts, n } = track;
  const p = pts[i];
  let best = Math.hypot(p.x - x, p.y - y);
  for (const j of [(i - 1 + n) % n, (i + 1) % n]) {
    const q = pts[j];
    const vx = q.x - p.x, vy = q.y - p.y;
    const t = Math.max(0, Math.min(1, ((x - p.x) * vx + (y - p.y) * vy) / (vx * vx + vy * vy || 1)));
    best = Math.min(best, Math.hypot(p.x + vx * t - x, p.y + vy * t - y));
  }
  return best;
}

// Snap a dropped extra onto the track. Tunnels must be on the track.
export function snapItem(track, type, x, y) {
  if (FREE_ITEMS.includes(type)) {
    let a = 0;
    if (type === 'stand' && track) { // grandstand faces the track
      const g = nearestGlobal(track, x, y);
      const p = track.pts[g.i];
      a = Math.atan2(p.y - y, p.x - x) - Math.PI / 2;
    }
    return { type, x, y, a, idx: -1, up: false };
  }
  if (track) {
    const g = nearestGlobal(track, x, y);
    if (g.d < TRACK_W * 0.9) {
      const p = track.pts[g.i];
      return { type, x: p.x, y: p.y, a: p.a, idx: g.i, up: !!track.bridge[g.i] };
    }
  }
  if (type === 'tunnel') return null;
  return { type, x, y, a: 0, idx: -1, up: false };
}

export function resnapItems(items, track) {
  return items.map(it => snapItem(track, it.type, it.x, it.y)).filter(Boolean);
}

export function inRange(i, start, len, n) {
  return ((i - start) % n + n) % n < len;
}
