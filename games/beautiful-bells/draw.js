// Draws the girl and every item as SVG strings.
// The girl lives in a 400 x 520 box: face centre (200, 210), eyes at (160|240, 215), ears at x 106 / 294.
import { HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS, SKINS, ITEMS, RAINBOW, TOP_COLORS } from './items.js';

let n = 0;
const uid = () => `bb${++n}`;
const MIRROR = 'transform="translate(400 0) scale(-1 1)"';
// An element plus its mirror image (for things on both sides of the head).
const both = el => [el, /^<[^>]*\stransform=/.test(el)
  ? `<g ${MIRROR}>${el}</g>` // already has a transform: wrap it instead of adding a second one
  : el.replace(/^<(\w+)/, `<$1 ${MIRROR}`)];
const r1 = v => Math.round(v * 10) / 10;
const circle = (x, y, r, extra = '') => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" ${extra}/>`;
const quad = (p0, c, p2, t) => [
  (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p2[1],
];
const cubic = (p0, c1, c2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map(i => u * u * u * p0[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * p3[i]);
};

// ---------- colour helpers ----------
const hex = h => {
  if (h.length === 4) h = '#' + [...h.slice(1)].map(ch => ch + ch).join('');
  return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
};
const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const lum = h => { const [r, g, b] = hex(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

// ---------- little shapes, drawn around (0, 0), about `s` in radius ----------
const HEART = 'M0 .35C-.1 .25-.5 0-.5-.25C-.5-.5-.15-.6 0-.35C.15-.6 .5-.5 .5-.25C.5 0 .1 .25 0 .35Z';
function starPts(x, y, r, inner = .45, points = 5) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / points;
    const rr = i % 2 ? r * inner : r;
    pts.push(`${r1(x + Math.cos(a) * rr)},${r1(y + Math.sin(a) * rr)}`);
  }
  return pts.join(' ');
}
const gemSvg = (x, y, r, fill) =>
  `<polygon points="${x},${r1(y - r)} ${r1(x + r * .8)},${r1(y - r * .2)} ${x},${r1(y + r)} ${r1(x - r * .8)},${r1(y - r * .2)}" fill="${fill}" stroke="#fff" stroke-width="1.3"/>` +
  `<polygon points="${x},${r1(y - r)} ${r1(x + r * .35)},${r1(y - r * .2)} ${x},${r1(y + r * .5)} ${r1(x - r * .35)},${r1(y - r * .2)}" fill="#fff" opacity=".45"/>`;
const butterfly = (s, fill) => `<g transform="scale(${r1(s * 100) / 100})">
  <ellipse cx="-8" cy="-6" rx="8" ry="10" transform="rotate(-35 -8 -6)" fill="${fill}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
  <ellipse cx="8" cy="-6" rx="8" ry="10" transform="rotate(35 8 -6)" fill="${fill}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
  <ellipse cx="-6" cy="7" rx="5" ry="7" transform="rotate(30 -6 7)" fill="${fill}" opacity=".85"/>
  <ellipse cx="6" cy="7" rx="5" ry="7" transform="rotate(-30 6 7)" fill="${fill}" opacity=".85"/>
  <circle cx="-8" cy="-7" r="2.6" fill="#fff" opacity=".7"/><circle cx="8" cy="-7" r="2.6" fill="#fff" opacity=".7"/>
  <rect x="-1.6" y="-12" width="3.2" height="22" rx="1.6" fill="#3b2a4a"/></g>`;
function flowerShape(s, fill, centre = '#ffd23f') {
  let out = `<g transform="scale(${r1(s * 100) / 100})">`;
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5 - Math.PI / 2;
    out += circle(Math.cos(a) * 9, Math.sin(a) * 9, 8, `fill="${fill}" stroke="rgba(0,0,0,.14)" stroke-width="1"`);
  }
  return out + circle(0, 0, 5.5, `fill="${centre}"`) + circle(-1.5, -1.5, 1.8, 'fill="#fff" opacity=".5"') + '</g>';
}

export function shape(name, s, c, edge = 'rgba(0,0,0,.22)') {
  const st = `stroke="${edge}" stroke-width="1.4" stroke-linejoin="round"`;
  switch (name) {
    case 'heart': return `<path transform="scale(${r1(s * 2.1)})" d="${HEART}" fill="${c}" ${st} vector-effect="non-scaling-stroke"/>` +
      circle(-s * .45, -s * .45, s * .18, 'fill="#fff" opacity=".55"');
    case 'star': return `<polygon points="${starPts(0, 0, s)}" fill="${c}" ${st}/>`;
    case 'gem': return gemSvg(0, 0, s, c);
    case 'pearl': return circle(0, 0, s * .8, 'fill="#fbf8ff" stroke="#d8d0e0" stroke-width="1.2"') +
      circle(s * .15, s * .2, s * .5, 'fill="#e7e0ef" opacity=".7"') + circle(-s * .28, -s * .28, s * .22, 'fill="#fff"');
    case 'butterfly': return butterfly(s / 12, c);
    case 'flower': return flowerShape(s / 17, c);
    case 'rainbow':
      return RAINBOW.slice(0, 5).map((col, i) => {
        const r = s * (1 - i * .18);
        return `<path d="M${r1(-r)} ${r1(s * .4)} A${r1(r)} ${r1(r)} 0 0 1 ${r1(r)} ${r1(s * .4)}" stroke="${col}" stroke-width="${r1(s * .2)}" fill="none"/>`;
      }).join('');
    case 'moon':
      return `<path d="M${r1(s * .35)} ${-s} A${s} ${s} 0 0 0 ${r1(s * .35)} ${s} A${r1(s * 1.3)} ${r1(s * 1.3)} 0 0 1 ${r1(s * .35)} ${-s}Z" fill="${c}" ${st}/>`;
    case 'sparkle': {
      const k = r1(s * .18);
      return `<path d="M0 ${-s} Q${k} ${-k} ${s} 0 Q${k} ${k} 0 ${s} Q${-k} ${k} ${-s} 0 Q${-k} ${-k} 0 ${-s}Z" fill="${c}" stroke="#f5c542" stroke-width="1"/>`;
    }
    case 'ladybird':
      return circle(0, -s * .8, s * .45, 'fill="#222"') + circle(0, 0, s * .85, `fill="${c}" ${st}`) +
        `<line x1="0" y1="${r1(-s * .85)}" x2="0" y2="${r1(s * .85)}" stroke="#222" stroke-width="1.4"/>` +
        [[-.4, -.3], [.4, -.3], [-.45, .3], [.45, .3]].map(([x, y]) => circle(x * s, y * s, s * .16, 'fill="#222"')).join('');
    case 'bolt': {
      const p = [[.2, -1], [-.55, .12], [-.05, .12], [-.25, 1], [.55, -.18], [.05, -.18]];
      return `<polygon points="${p.map(([x, y]) => `${r1(x * s)},${r1(y * s)}`).join(' ')}" fill="${c}" ${st}/>`;
    }
    case 'crown': {
      const p = [[-1, .6], [-1, -.5], [-.5, 0], [0, -.85], [.5, 0], [1, -.5], [1, .6]];
      return `<polygon points="${p.map(([x, y]) => `${r1(x * s)},${r1(y * s)}`).join(' ')}" fill="${c}" ${st}/>` +
        circle(0, s * .2, s * .16, 'fill="#ff5fa2"') + circle(-s * .55, s * .25, s * .12, 'fill="#4fd6ff"') + circle(s * .55, s * .25, s * .12, 'fill="#4fd6ff"');
    }
    case 'cherry':
      return `<path d="M${r1(s * .1)} ${-s} Q${r1(-s * .1)} ${r1(-s * .2)} ${r1(-s * .45)} ${r1(s * .3)} M${r1(s * .1)} ${-s} Q${r1(s * .4)} ${r1(-s * .2)} ${r1(s * .45)} ${r1(s * .4)}" stroke="#3c8a2e" stroke-width="1.6" fill="none"/>` +
        circle(-s * .45, s * .45, s * .45, `fill="${c}" ${st}`) + circle(s * .45, s * .55, s * .45, `fill="${c}" ${st}`) +
        circle(-s * .6, s * .3, s * .13, 'fill="#fff" opacity=".7"');
    case 'note':
      return `<ellipse cx="${r1(-s * .3)}" cy="${r1(s * .6)}" rx="${r1(s * .4)}" ry="${r1(s * .3)}" transform="rotate(-20 ${r1(-s * .3)} ${r1(s * .6)})" fill="${c}"/>` +
        `<path d="M${r1(s * .08)} ${r1(s * .55)} L${r1(s * .08)} ${-s} Q${r1(s * .6)} ${r1(-s * .6)} ${r1(s * .5)} ${r1(-s * .1)}" stroke="${c}" stroke-width="${r1(s * .18)}" fill="none" stroke-linecap="round"/>`;
    case 'teardrop':
      return `<path d="M0 ${-s} Q${r1(s * .9)} ${r1(s * .2)} 0 ${s} Q${r1(-s * .9)} ${r1(s * .2)} 0 ${-s}Z" fill="${c}" stroke="#fff" stroke-width="1.2"/>` +
        circle(-s * .25, s * .1, s * .2, 'fill="#fff" opacity=".7"');
  }
  return '';
}

const glitterDots = (pts, color = '#fff') => pts.map(([x, y], i) => circle(x, y, i % 3 ? 1.2 : 1.9, `fill="${color}" opacity=".9"`)).join('');

// ---------- brush paint ----------
export const PAINT = {
  lips:   { w: 8,  o: .82, blur: .6 },
  shadow: { w: 11, o: .5,  blur: 2.2 },
  blush:  { w: 26, o: .2,  blur: 6 },
  face:   { w: 6,  o: .95, blur: 0 },
};
export function strokeAttrs(item, rainbowId) {
  const cfg = PAINT[item.layer];
  return { stroke: item.rainbow ? `url(#${rainbowId})` : item.color, width: item.width || cfg.w, opacity: cfg.o };
}
export const ptsToD = pts => {
  if (pts.length < 4) return `M${pts[0]} ${pts[1]} l.1 0`;
  let d = `M${pts[0]} ${pts[1]}`;
  for (let i = 2; i < pts.length; i += 2) d += `L${pts[i]} ${pts[i + 1]}`;
  return d;
};
function glitterAlong(pts) {
  let s = '';
  for (let i = 0; i < pts.length; i += 6) {
    const k = i / 2;
    s += circle(pts[i] + ((k * 37) % 9) - 4, pts[i + 1] + ((k * 53) % 9) - 4, k % 3 ? 1.1 : 1.8, 'fill="#fff" opacity=".9"');
  }
  return s;
}

// ---------- hair ----------
function plait(x0, y0, x1, y1, f, rx = 17) {
  const out = [];
  const steps = Math.max(2, Math.floor((y1 - y0) / 21));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t + (i % 2 ? 4 : -4);
    const y = y0 + (y1 - y0) * t;
    const rot = i % 2 ? 28 : -28;
    out.push(`<ellipse ${f} cx="${r1(x)}" cy="${r1(y)}" rx="${rx}" ry="${Math.round(rx * .75)}" transform="rotate(${rot} ${r1(x)} ${r1(y)})"/>`);
  }
  out.push(`<path ${f} d="M${x1 - 8} ${y1 + 6} Q${x1} ${y1 + 34} ${x1 + 8} ${y1 + 6}Z"/>`);
  return out;
}

function hairParts(style, L, c, f) {
  const P = { back: [], backDeco: [], strand: [], front: [], deco: [], ties: [] };
  const back = len => `<path ${f} d="M200 78 C95 78 66 160 74 ${len - 30} Q76 ${len} 112 ${len} L288 ${len} Q324 ${len} 326 ${len - 30} C334 160 305 78 200 78Z"/>`;
  const fringe = `<path ${f} d="M102 240 C85 30 315 30 298 240 Q292 165 262 140 Q220 172 168 148 Q140 166 126 152 Q108 175 102 240Z"/>`;
  const slick = `<path ${f} d="M106 214 C88 42 312 42 294 214 Q286 150 252 128 Q200 116 148 128 Q114 150 106 214Z"/>`;
  const strand = len => `<path ${f} d="M108 185 C84 250 74 ${len - 50} 80 ${len} Q100 ${len + 10} 122 ${len - 4} C116 ${len - 70} 120 300 128 250Z"/>`;
  const line = (d, w = 2.2, o = .35) => `<path d="${d}" stroke="${c.shade}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="${o}"/>`;
  const shine = d => `<path d="${d}" stroke="${c.light}" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/>`;
  const swirl = (x, y, r) => `<path d="M${x - r * .6} ${y} Q${x} ${y - r * .8} ${x + r * .6} ${y} Q${x} ${y + r * .5} ${x - r * .3} ${y + r * .1}" stroke="${c.shade}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const backLines = len => both(line(`M128 104 Q88 ${r1(len * .5)} 94 ${len - 16}`)).join('') + both(line(`M150 96 Q112 ${r1(len * .5)} 118 ${len - 10}`, 1.8, .25)).join('');
  const fringeLines = line('M150 98 Q142 128 132 150') + line('M188 90 Q184 124 172 148') + line('M236 94 Q250 122 262 140') + line('M212 92 Q214 130 206 158', 1.8, .25);
  const fringeShine = shine('M140 106 Q200 84 260 106');
  const wavyPts = (len, x0, amp) => { const p = []; for (let y = 150; y <= len; y += 8) p.push([x0 + Math.sin(y / 16) * amp, y]); return p; };

  switch (style) {
    case 'wavy': {
      const pts = wavyPts(L, 74, 8);
      const last = pts[pts.length - 1];
      P.back.push(`<path ${f} d="M200 78 C110 78 76 110 74 150 ${pts.map(([x, y]) => `L${r1(x)} ${y}`).join('')} Q200 ${L + 14} ${r1(400 - last[0])} ${last[1]} ${pts.slice().reverse().map(([x, y]) => `L${r1(400 - x)} ${y}`).join('')} L326 150 C324 110 290 78 200 78Z"/>`);
      P.backDeco.push(backLines(L));
      if (L > 300) {
        const outer = [], inner = [];
        for (let y = 200; y <= L; y += 8) { outer.push([86 + Math.sin(y / 16) * 7, y]); inner.push([122 + Math.sin(y / 16) * 6, y]); }
        P.strand.push(...both(`<path ${f} d="M110 185 ${outer.map(([x, y]) => `L${r1(x)} ${y}`).join('')} ${inner.reverse().map(([x, y]) => `L${r1(x)} ${y}`).join('')} L128 240Z"/>`));
      }
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      break;
    }
    case 'curly': {
      P.back.push(back(L));
      for (let y = 130; y <= L - 10; y += 30) P.back.push(...both(circle(80 + Math.sin(y / 40) * 4, y, 26, f)));
      for (let x = 110; x <= 290; x += 30) P.back.push(circle(x, L - 6, 22, f));
      if (L > 300) for (let y = 230; y <= L - 10; y += 28) P.strand.push(...both(circle(102 + Math.sin(y / 30) * 4, y, 19, f)));
      P.front.push(fringe);
      for (const [x, y] of [[110, 150], [125, 110], [155, 88], [200, 80], [245, 88], [275, 110], [290, 150]]) P.front.push(circle(x, y, 22, f));
      for (const [x, y] of [[108, 185], [126, 156], [150, 160], [175, 152], [200, 160], [225, 160], [250, 150], [272, 152], [292, 185]]) P.front.push(circle(x, y, 15, f));
      break;
    }
    case 'afro': {
      const rad = 108 + (L - 290) * .18;
      P.back.push(circle(200, 188, rad, f));
      for (let a = 0; a < 360; a += 20) {
        const t = a * Math.PI / 180;
        P.back.push(circle(200 + Math.cos(t) * (rad - 8), 188 + Math.sin(t) * (rad - 8) * .95, 30, f));
      }
      P.front.push(`<path ${f} d="M108 202 C92 60 308 60 292 202 Q286 150 258 128 Q200 112 142 128 Q114 150 108 202Z"/>`);
      for (const [x, y] of [[112, 178], [117, 148], [133, 124], [158, 110], [200, 104], [242, 110], [267, 124], [283, 148], [288, 178]]) P.front.push(circle(x, y, 14, f));
      break;
    }
    case 'sidesweep': {
      P.back.push(back(L));
      P.backDeco.push(backLines(L));
      if (L > 300) P.strand.push(...both(strand(L)));
      P.front.push(`<path ${f} d="M102 240 C85 30 315 30 298 240 Q292 170 272 148 Q236 134 196 150 Q156 166 124 196 Q108 214 102 240Z"/>`);
      P.deco.push(line('M250 96 Q230 130 196 150') + line('M210 90 Q180 130 150 168') + line('M170 92 Q140 140 126 190', 1.8, .25), shine('M150 104 Q210 84 262 108'));
      break;
    }
    case 'halfup': {
      P.back.push(back(L), circle(200, 72, 26, f));
      P.backDeco.push(backLines(L), swirl(200, 66, 18));
      if (L > 300) P.strand.push(...both(strand(L)));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      break;
    }
    case 'bob': {
      P.back.push(`<path ${f} d="M200 78 C95 78 70 160 74 262 Q76 300 118 300 L282 300 Q324 300 326 262 C330 160 305 78 200 78Z"/>`);
      P.backDeco.push(backLines(300));
      P.front.push(`<path ${f} d="M104 238 C85 30 315 30 296 238 L294 166 Q200 176 106 166Z"/>`);
      P.deco.push(line('M150 96 L146 166') + line('M200 88 L200 170') + line('M250 96 L254 166') + line('M176 92 L172 168', 1.8, .25) + line('M226 92 L228 168', 1.8, .25), fringeShine);
      break;
    }
    case 'pixie': {
      P.back.push(back(250));
      P.front.push(`<path ${f} d="M106 214 C88 42 312 42 294 214 Q292 170 270 140 Q236 150 196 138 Q150 150 122 168 Q110 186 106 214Z"/>`);
      P.deco.push(line('M240 96 Q230 124 196 138') + line('M190 92 Q170 124 130 160'), shine('M150 100 Q200 84 250 100'));
      break;
    }
    case 'ponytail': {
      P.back.push(`<path ${f} d="M236 100 C330 66 360 ${r1(L * .55)} 332 ${L} Q318 ${L + 14} 302 ${L - 6} C318 ${r1(L * .62)} 300 170 252 124Z"/>`);
      P.backDeco.push(line(`M262 110 Q336 ${r1(L * .45)} 318 ${L - 10}`));
      P.front.push(slick);
      P.deco.push(line('M200 120 Q220 100 246 102') + line('M150 128 Q190 96 240 100', 1.8, .25), shine('M150 100 Q190 84 230 92'));
      P.ties.push([248, 104]);
      break;
    }
    case 'highpony': {
      P.back.push(`<path ${f} d="M188 76 C180 30 250 14 284 52 C330 110 336 ${r1(L * .6)} 312 ${L} Q300 ${L + 12} 288 ${L - 8} C306 ${r1(L * .62)} 296 130 256 92 C240 76 220 72 212 80Z"/>`);
      P.backDeco.push(line(`M240 40 Q316 ${r1(L * .4)} 300 ${L - 10}`));
      P.front.push(slick);
      P.deco.push(line('M140 140 Q160 100 200 86') + line('M260 140 Q240 100 206 86'), shine('M150 104 Q200 84 250 104'));
      P.ties.push([204, 74]);
      break;
    }
    case 'pigtails': {
      P.back.push(...both(`<path ${f} d="M114 178 C56 168 34 ${r1(L * .62)} 52 ${L} Q66 ${L + 12} 84 ${L - 4} C70 ${r1(L * .66)} 80 252 114 214Z"/>`));
      P.backDeco.push(...both(line(`M100 190 Q54 ${r1(L * .55)} 66 ${L - 8}`)));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      P.ties.push([110, 196], [290, 196]);
      break;
    }
    case 'bun': {
      P.back.push(circle(200, 70, 44, f));
      P.backDeco.push(swirl(200, 62, 30));
      P.front.push(slick);
      P.deco.push(line('M150 128 Q170 100 200 92') + line('M250 128 Q230 100 200 92'), shine('M150 100 Q200 82 250 100'));
      break;
    }
    case 'messybun': {
      P.back.push(circle(200, 68, 40, f));
      for (let a = 0; a < 360; a += 50) { const t = a * Math.PI / 180; P.back.push(circle(200 + Math.cos(t) * 36, 66 + Math.sin(t) * 30, 16, f)); }
      P.backDeco.push(swirl(200, 62, 26));
      P.front.push(slick);
      P.deco.push(...both(`<path d="M116 176 Q100 214 112 262" stroke="${c.base}" stroke-width="6" fill="none" stroke-linecap="round"/>`),
        ...both(`<path d="M116 176 Q100 214 112 262" stroke="${c.shade}" stroke-width="1.5" fill="none" opacity=".5"/>`),
        shine('M150 100 Q200 82 250 100'));
      break;
    }
    case 'spacebuns': {
      P.back.push(circle(126, 96, 36, f), circle(274, 96, 36, f));
      P.backDeco.push(swirl(122, 86, 24), swirl(270, 86, 24));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      break;
    }
    case 'braids': {
      P.back.push(back(250));
      P.strand.push(...plait(100, 232, 98, L - 20, f));
      P.strand.push(...plait(300, 232, 302, L - 20, f));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      P.ties.push([98, L - 16], [302, L - 16]);
      break;
    }
    case 'sidebraid': {
      P.back.push(back(260));
      P.strand.push(...plait(120, 214, 150, L - 20, f, 20));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
      P.ties.push([150, L - 16]);
      break;
    }
    default: { // hair down
      P.back.push(back(L));
      P.backDeco.push(backLines(L));
      if (L > 300) P.strand.push(...both(strand(L)));
      P.front.push(fringe);
      P.deco.push(fringeLines, fringeShine);
    }
  }
  return P;
}

function stripes(exts) {
  return exts.map((e, i) => {
    const x = [86, 120, 150][i % 3] + Math.floor(i / 3) * 6;
    const cols = e.rainbow ? RAINBOW : [e.color];
    const w = e.rainbow ? 4 : 13;
    return cols.map((col, j) =>
      `<rect x="${x + j * w}" y="0" width="${w}" height="600" fill="${col}"/>` +
      `<rect x="${400 - x - (j + 1) * w}" y="0" width="${w}" height="600" fill="${col}"/>`).join('');
  }).join('');
}

// ---------- accessories ----------
// Things you place (bows, clips, stickers…) are drawn around (0, 0).
export function drawThing(it) {
  const c = it.color;
  const edge = mix(c, '#000', .3);
  const line = `stroke="${edge}" stroke-width="1.5"`;
  switch (it.kind) {
    case 'bow':
      return `<g ${line} stroke-linejoin="round">
        <path d="M-3 4 L-12 24 L-5 21 L0 26Z" fill="${c}"/><path d="M3 4 L12 24 L5 21 L0 26Z" fill="${c}"/>
        <path d="M0 0 L-25 -15 Q-32 0 -25 15Z" fill="${c}"/><path d="M0 0 L25 -15 Q32 0 25 15Z" fill="${c}"/>
        <path d="M-6 0 L-20 -7 M-6 0 L-20 7 M6 0 L20 -7 M6 0 L20 7" opacity=".35" fill="none"/>
        <circle r="6.5" fill="${c}"/></g>
        <path d="M-20 -8 Q-24 0 -20 6" stroke="#fff" stroke-width="2.5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    case 'clip':
      return `<rect x="-17" y="-3.5" width="34" height="7" rx="3.5" fill="#e6e1ea" stroke="#b9b1c4" stroke-width="1"/>` + shape(it.shape, 12, c, edge);
    case 'flower':
      return flowerShape(1.1, c, it.id === 'flower-sun' ? '#7a4a1c' : '#ffd23f');
    case 'bobble':
      return `<rect x="-11" y="-3" width="22" height="6" rx="3" fill="#7a5a8a"/>
        ${circle(-11, 0, 9, `fill="${c}" ${line}`)}${circle(11, 0, 9, `fill="${c}" ${line}`)}
        ${circle(-13, -3, 2.6, 'fill="#fff" opacity=".7"')}${circle(9, -3, 2.6, 'fill="#fff" opacity=".7"')}`;
    case 'sticker':
      return shape(it.shape, 12, c, '#fff');
  }
  return '';
}

// Earrings are drawn at the ear lobe, (0, 0).
function earring(it) {
  const c = it.color;
  switch (it.style) {
    case 'stud': return `<g transform="translate(0 2)">${shape(it.shape, 6.5, c)}</g>`;
    case 'hoop': {
      const s = it.size || 14;
      return `<circle cx="0" cy="${s}" r="${s}" fill="none" stroke="${mix(c, '#000', .2)}" stroke-width="4"/>` +
        `<circle cx="0" cy="${s}" r="${s}" fill="none" stroke="${c}" stroke-width="2.6"/>` +
        `<path d="M${r1(-s * .7)} ${r1(s * .3)} A${s} ${s} 0 0 1 ${r1(s * .2)} ${r1(-s * .02 + 1)}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7"/>`;
    }
    case 'drop':
      return `<line x1="0" y1="0" x2="0" y2="10" stroke="#d8b23a" stroke-width="1.6"/><g transform="translate(0 19)">${shape(it.shape, 8.5, c)}</g>`;
  }
  return '';
}

function necklace(it) {
  const p0 = [170, 368], cc = [200, 414], p2 = [230, 368];
  const beads = (count, fn) => {
    let s = '';
    for (let i = 0; i <= count; i++) { const [x, y] = quad(p0, cc, p2, i / count); s += fn(x, y, i); }
    return s;
  };
  const d = 'M170 368 Q200 414 230 368';
  switch (it.style) {
    case 'pearls': return beads(13, (x, y) => `<g transform="translate(${r1(x)} ${r1(y)})">${shape('pearl', 5.6, '#fff')}</g>`);
    case 'chain': {
      let s = `<path d="${d}" fill="none" stroke="${mix(it.chain, '#000', .25)}" stroke-width="${it.thick ? 4.5 : 2.6}"/>` +
        `<path d="${d}" fill="none" stroke="${it.chain}" stroke-width="${it.thick ? 3 : 1.6}" stroke-dasharray="${it.thick ? '4 1.5' : '3 1'}"/>`;
      if (it.shape) s += `<line x1="200" y1="391" x2="200" y2="396" stroke="${it.chain}" stroke-width="1.6"/><g transform="translate(200 ${it.big ? 406 : 403})">${shape(it.shape, it.big ? 11 : 8.5, it.pendant)}</g>`;
      return s;
    }
    case 'beads': return beads(14, (x, y, i) => circle(x, y, 4.6, `fill="${RAINBOW[i % RAINBOW.length]}" stroke="rgba(0,0,0,.15)" stroke-width="1"`) + circle(x - 1.4, y - 1.4, 1.3, 'fill="#fff" opacity=".7"'));
    case 'sweets': return beads(10, (x, y, i) => `<rect x="${r1(x - 5)}" y="${r1(y - 4)}" width="10" height="8" rx="4" fill="${['#ffb3d9', '#b3e5ff', '#fff3a6', '#c7f5c4', '#e0c6ff'][i % 5]}" stroke="#fff" stroke-width="1"/>`);
    case 'daisies': return `<path d="${d}" fill="none" stroke="#5cb85c" stroke-width="2.5"/>` +
      beads(6, (x, y) => `<g transform="translate(${r1(x)} ${r1(y)})">${flowerShape(.42, '#fff')}</g>`);
    case 'choker': return `<path d="M172 336 Q200 348 228 336 L228 348 Q200 360 172 348Z" fill="${it.color}" stroke="${mix(it.color, '#000', .3)}" stroke-width="1"/>` +
      `<g transform="translate(200 358)">${shape('gem', 6, '#ff9ccf')}</g>`;
  }
  return '';
}

function headwear(it) {
  const bandD = 'M108 196 C96 64 304 64 292 196';
  const band = col => `<path d="${bandD}" stroke="${mix(col, '#000', .25)}" stroke-width="16" fill="none" stroke-linecap="round"/>` +
    `<path d="${bandD}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<path d="M130 120 C160 90 240 90 270 120" stroke="#fff" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>`;
  const arc = t => cubic([108, 196], [96, 64], [304, 64], [292, 196], t);
  switch (it.shape) {
    case 'band': return band(it.color);
    case 'bowband': return band(it.color) + `<g transform="translate(250 100) rotate(20) scale(1.3)">${drawThing({ kind: 'bow', color: it.color })}</g>`;
    case 'sparkleband': {
      let s = band(it.color);
      for (let i = 0; i < 7; i++) { const [x, y] = arc(.12 + i * .127); s += `<g transform="translate(${r1(x)} ${r1(y)})">${shape(i % 2 ? 'gem' : 'star', 6, i % 2 ? '#7fdcff' : '#fff1a8')}</g>`; }
      return s;
    }
    case 'tiara':
      return `<path d="M150 104 L160 72 L178 92 L200 56 L222 92 L240 72 L250 104 Q200 92 150 104Z" fill="${it.color}" stroke="#c99a10" stroke-width="2" stroke-linejoin="round"/>` +
        gemSvg(200, 84, 7, '#ff5fa2') + circle(160, 74, 3.5, 'fill="#7fdcff"') + circle(240, 74, 3.5, 'fill="#7fdcff"') + circle(200, 56, 3, 'fill="#fff"');
    case 'crown':
      return `<path d="M140 110 L134 54 L168 84 L200 38 L232 84 L266 54 L260 110 Q200 96 140 110Z" fill="${it.color}" stroke="#c99a10" stroke-width="2.4" stroke-linejoin="round"/>` +
        `<path d="M142 102 Q200 90 258 102" stroke="#c99a10" stroke-width="2" fill="none"/>` +
        gemSvg(200, 74, 9, '#e8213f') + gemSvg(160, 90, 6, '#4fa3ff') + gemSvg(240, 90, 6, '#4fa3ff') +
        circle(134, 54, 4, 'fill="#fff"') + circle(200, 38, 4, 'fill="#fff"') + circle(266, 54, 4, 'fill="#fff"');
    case 'flowers': {
      let s = `<path d="${bandD}" stroke="#4e9a4e" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      const cols = ['#ff8ac2', '#ffd23f', '#fff', '#c58af0', '#ff8ac2', '#ffd23f', '#fff'];
      cols.forEach((col, i) => {
        const [x, y] = arc(.08 + i * .14);
        s += `<ellipse cx="${r1(x + 8)}" cy="${r1(y + 4)}" rx="7" ry="3.5" fill="#5cb85c" transform="rotate(30 ${r1(x + 8)} ${r1(y + 4)})"/>`;
        s += `<g transform="translate(${r1(x)} ${r1(y)})">${flowerShape(.85, col, col === '#ffd23f' ? '#ff8a3d' : '#ffd23f')}</g>`;
      });
      return s;
    }
    case 'cat':
      return band(it.color) +
        `<path d="M122 120 L118 66 L162 92Z" fill="${it.color}"/><path d="M128 110 L126 78 L152 94Z" fill="#ff9ccf"/>` +
        `<path d="M278 120 L282 66 L238 92Z" fill="${it.color}"/><path d="M272 110 L274 78 L248 94Z" fill="#ff9ccf"/>`;
    case 'bunny':
      return both(`<ellipse cx="166" cy="46" rx="16" ry="46" transform="rotate(-12 166 46)" fill="#fff" stroke="#e0d6e8" stroke-width="2"/>`).join('') +
        both(`<ellipse cx="166" cy="50" rx="7" ry="32" transform="rotate(-12 166 50)" fill="#ffb8d9"/>`).join('') + band('#fff');
    case 'unicorn':
      return band('#ffffff') +
        both(`<path d="M150 104 L146 74 L172 92Z" fill="#fff" stroke="#e0d6e8" stroke-width="2"/>`).join('') +
        `<path d="M186 100 L200 26 L214 100Z" fill="#ffe08a" stroke="#e0b440" stroke-width="2" stroke-linejoin="round"/>` +
        `<path d="M189 86 L211 80 M192 70 L208 64 M195 54 L205 50" stroke="#e0b440" stroke-width="2"/>` +
        `<g transform="translate(160 96)">${flowerShape(.6, '#ff8ac2')}</g><g transform="translate(240 96)">${flowerShape(.6, '#c58af0')}</g>`;
  }
  return '';
}

function glassesSvg(it) {
  const c = it.color;
  const tint = it.tint ? `fill="${it.tint}" fill-opacity=".55"` : it.shape === 'sun' ? 'fill="#2c2a30" fill-opacity=".72"' : 'fill="#fff" fill-opacity=".14"';
  const st = `stroke="${c}" stroke-width="4" stroke-linejoin="round"`;
  const frame = `<path d="M186 211 Q200 203 214 211" stroke="${c}" stroke-width="3.5" fill="none"/>` +
    both(`<path d="M133 208 L110 204" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
  let lenses = '';
  switch (it.shape) {
    case 'round': lenses = [160, 240].map(x => circle(x, 216, 27, `${tint} ${st}`)).join(''); break;
    case 'heart': lenses = [160, 240].map(x => `<path transform="translate(${x} 222) scale(64)" d="${HEART}" ${tint} ${st} vector-effect="non-scaling-stroke"/>`).join(''); break;
    case 'star': lenses = [160, 240].map(x => `<polygon points="${starPts(x, 218, 34, .55)}" ${tint} ${st}/>`).join(''); break;
    case 'cat': lenses = both(`<path d="M134 206 Q136 238 160 240 Q184 238 186 212 Q160 200 126 194Z" ${tint} ${st}/>`).join(''); break;
    case 'sun': lenses = [160, 240].map(x => `<rect x="${x - 28}" y="198" width="56" height="38" rx="16" ${tint} ${st}/>`).join('') +
      [160, 240].map(x => `<path d="M${x - 16} 206 L${x - 4} 206" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`).join(''); break;
  }
  return frame + lenses;
}

// ---------- body ----------
// Face view shows head and shoulders; body view shows the whole girl.
export const FACE_VIEW = '0 0 400 520';
export const BODY_VIEW = '0 10 400 1050';
const FACE = 'M200 100 C254 100 294 138 294 198 C294 250 278 288 248 306 C230 318 214 322 200 322 C186 322 170 318 152 306 C122 288 106 250 106 198 C106 138 146 100 200 100Z';
const TORSO = 'M172 300 L172 372 C168 390 152 398 128 405 C104 412 86 420 78 440 Q72 462 92 476 L106 480 C112 540 122 600 124 640 C122 680 112 700 110 730 Q150 760 200 776 Q250 760 290 730 C288 700 278 680 276 640 C278 600 288 540 294 480 L308 476 Q328 462 322 440 C314 420 296 412 272 405 C248 398 232 390 228 372 L228 300Z';
const ARM = 'M78 440 C56 466 52 540 55 592 C57 640 62 690 64 724 L89 724 C92 690 98 640 100 592 C102 540 106 500 108 478 Q100 450 78 440Z';
const LEG = 'M112 718 C116 800 126 860 130 900 C134 950 142 990 146 1014 L172 1014 C172 990 176 950 178 900 C180 860 196 800 202 772 L202 720Z';
const MIRROR_ATTR = 'transform="translate(400 0) scale(-1 1)"';
const twoPaths = d => `<path d="${d}"/><path d="${d}" ${MIRROR_ATTR}/>`;
const twoPathsFill = (d, fill) => `<path d="${d}" fill="${fill}"/><path d="${d}" fill="${fill}" ${MIRROR_ATTR}/>`;

function patternDef(pat, ink, id, scale = 1) {
  const tf = scale !== 1 ? ` patternTransform="scale(${scale})"` : '';
  const P = (w, h, body) => `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}"${tf}>${body}</pattern>`;
  switch (pat) {
    case 'dots': return P(20, 20, circle(5, 5, 3.2, `fill="${ink}"`) + circle(15, 15, 3.2, `fill="${ink}"`));
    case 'stripes': return P(20, 16, `<rect width="20" height="7" fill="${ink}" opacity=".75"/>`);
    case 'hearts': return P(28, 28, `<path transform="translate(7 8) scale(10)" d="${HEART}" fill="${ink}"/><path transform="translate(21 22) scale(10)" d="${HEART}" fill="${ink}"/>`);
    case 'stars': return P(28, 28, `<polygon points="${starPts(7, 8, 5.5)}" fill="${ink}"/><polygon points="${starPts(21, 22, 5.5)}" fill="${ink}"/>`);
    case 'flowers': return P(32, 32, `<g transform="translate(8 8)">${flowerShape(.36, ink)}</g><g transform="translate(24 24)">${flowerShape(.36, ink)}</g>`);
    case 'checks': return P(24, 24, `<rect width="12" height="12" fill="${ink}" opacity=".4"/><rect x="12" y="12" width="12" height="12" fill="${ink}" opacity=".4"/>`);
    case 'leopard': return P(34, 34,
      [[8, 8], [25, 14], [12, 26], [29, 30]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 4 : 5}" ry="3.6" fill="#f0b45a" opacity=".85" stroke="#4a2c12" stroke-width="2.2" stroke-dasharray="5 2.5"/>`).join(''));
    case 'sparkles': return P(30, 30, circle(6, 6, 1.4, 'fill="#fff"') + circle(20, 12, 1, 'fill="#fff"') + circle(12, 24, 1.2, 'fill="#fff"') +
      `<g transform="translate(24 24)">${shape('sparkle', 4.5, '#fff')}</g>`);
    case 'rainbow': return P(400, 96, RAINBOW.map((col, i) => `<rect y="${i * 16}" width="400" height="16" fill="${col}"/>`).join(''));
    case 'scales': return P(20, 14, `<path d="M0 14 A10 10 0 0 1 20 14 M-10 7 A10 10 0 0 1 10 7 M10 7 A10 10 0 0 1 30 7" fill="none" stroke="${ink}" stroke-width="1.6" opacity=".55"/>`);
  }
  return '';
}

// A piece of cloth: its colour, pattern and soft shading.
function fabric(col, pat, key, defs, ctx) {
  const dark = mix(col, '#000', .22);
  const light = mix(col, '#fff', .45);
  const ink = pat === 'leopard' ? '#000' : lum(col) > .78 ? '#ff6fb0' : '#ffffff';
  let patId = null;
  if (pat && pat !== 'plain') { patId = `${ctx.id}${key}`; defs.push(patternDef(pat, ink, patId)); }
  const fill = d => `<path d="${d}" fill="${col}"/>` + (patId ? `<path d="${d}" fill="url(#${patId})"/>` : '') +
    `<path d="${d}" fill="url(#${ctx.id}ts)"/><path d="${d}" fill="url(#${ctx.id}tl)"/>` +
    (ctx.lite ? '' : `<path d="${d}" fill="#000" filter="url(#${ctx.id}fab)" opacity=".45"/>`);
  return { col, dark, light, fill };
}
// A soft fold in cloth: a blurred shadow with a highlight beside it.
const fold = (d, F, ctx, w = 7) => ctx.lite ? lineD(d, F.dark, 2, .25) :
  `<path d="${d}" stroke="${F.dark}" stroke-width="${w}" fill="none" opacity=".35" stroke-linecap="round" filter="url(#${ctx.id}b3)"/>` +
  `<path d="${d}" stroke="${F.light}" stroke-width="${w * .6}" fill="none" opacity=".3" stroke-linecap="round" transform="translate(5 0)" filter="url(#${ctx.id}b3)"/>`;
const lineD = (d, col, w = 2, o = .45) => `<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
const scallops = (pts, r, fill) => pts.map(([x, y]) => circle(x, y, r, `fill="${fill}" stroke="${mix(fill, '#000', .15)}" stroke-width="1"`)).join('');

function sleeves(kind, F, ctx) {
  if (!kind) return '';
  const end = kind === 'long' ? 712 : 528;
  let s = `<g clip-path="url(#${ctx.armClip})">` +
    (ctx.lite ? '' : `<rect x="0" y="${end}" width="400" height="8" fill="#000" opacity=".12" filter="url(#${ctx.id}b3)"/>`) +
    F.fill(`M0 400 L400 400 L400 ${end} L0 ${end}Z`) +
    `<g clip-path="url(#${ctx.sleeveEnd}${end})">${twoPathsFill(ARM, `url(#${ctx.id}cyl)`)}</g>` +
    (kind === 'long' ? `<rect x="0" y="${end - 12}" width="400" height="12" fill="${F.dark}" opacity=".6"/>` : `<path d="M0 ${end} L400 ${end}" stroke="${F.dark}" stroke-width="2.5" opacity=".7"/>`) +
    both(fold('M86 470 Q78 520 76 560', F, ctx, 5)).join('') + (kind === 'long' ? both(fold('M70 600 Q82 620 92 610', F, ctx, 5)).join('') : '') + '</g>';
  ctx.defs.push(`<clipPath id="${ctx.sleeveEnd}${end}"><rect x="0" y="0" width="400" height="${end}"/></clipPath>`);
  if (kind === 'puff') s += both(`<path d="M76 438 Q44 470 56 516 Q82 532 106 514 Q116 470 98 446Z" fill="${F.col}" stroke="${F.dark}" stroke-width="2"/>`).join('') +
    both(lineD('M70 470 Q76 500 72 516 M88 456 Q92 490 90 518', F.dark, 1.6, .4)).join('');
  return s;
}

const NECKS = {
  crew: H => `M0 ${H} L0 385 L162 385 Q200 418 238 385 L400 385 L400 ${H}Z`,
  vneck: H => `M0 ${H} L0 385 L164 385 L200 440 L236 385 L400 385 L400 ${H}Z`,
  tank: H => `M0 ${H} L0 478 L110 478 Q122 452 128 446 L128 398 L150 398 L152 430 Q200 470 248 430 L250 398 L272 398 L278 452 Q290 478 400 478 L400 ${H}Z`,
  offshoulder: H => `M0 ${H} L0 470 Q100 452 200 460 Q300 452 400 470 L400 ${H}Z`,
  polo: H => `M0 ${H} L0 386 L170 386 L170 334 L230 334 L230 386 L400 386 L400 ${H}Z`,
  sweetheart: H => `M0 ${H} L0 478 L106 478 Q120 450 146 444 Q170 420 200 446 Q230 420 254 444 Q280 450 294 478 L400 478 L400 ${H}Z`,
};
const neckTrim = (neck, F) => {
  switch (neck) {
    case 'crew': case 'collar': return `<path d="M162 385 Q200 418 238 385" stroke="${F.dark}" stroke-width="5" fill="none"/>`;
    case 'vneck': return `<path d="M164 385 L200 440 L236 385" stroke="${F.dark}" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    case 'tank': return `<path d="M152 430 Q200 470 248 430" stroke="${F.dark}" stroke-width="4" fill="none"/>`;
    case 'offshoulder': { const pts = []; for (let x = 70; x <= 330; x += 14) pts.push([x, 466 - Math.cos((x - 200) / 160) * 3 + (x % 28 ? 2 : 0)]); return scallops(pts, 9, F.light); }
    case 'polo': return [342, 354, 366, 378].map(y => lineD(`M170 ${y} Q200 ${y + 9} 230 ${y}`, F.dark, 2.4, .55)).join('');
    case 'sweetheart': {
      const pts = []; for (let t = 0; t <= 1.001; t += .1) pts.push(quad([146, 444], [170, 420], [200, 446], t), quad([200, 446], [230, 420], [254, 444], t));
      return both(`<path d="M150 442 L146 400" stroke="${F.dark}" stroke-width="4" stroke-linecap="round"/>`).join('') +
        pts.map(([x, y], i) => circle(x, y + 2, 2.2, `fill="${i % 2 ? '#fff' : '#ffe08a'}"`)).join('');
    }
  }
  return '';
};
const collarBits = F => both(`<path d="M200 410 Q170 424 152 396 Q160 386 164 385 Q184 404 200 410Z" fill="#fff" stroke="#ddd" stroke-width="1.5"/>`).join('') +
  [432, 460, 488, 516, 544, 572, 600].map(y => circle(200, y, 3.5, `fill="${F.light}" stroke="${F.dark}" stroke-width="1"`)).join('');

const TOP_HEM = { tee: 662, vneck: 662, tank: 650, offshoulder: 650, polo: 672, hoodie: 690, collar: 662, frill: 655, party: 632, cardigan: 690 };
const TOP_SLEEVE = { tee: 'short', vneck: 'short', collar: 'short', frill: 'puff', polo: 'long', hoodie: 'long', cardigan: 'long' };

function topSvg(look, defs, ctx) {
  const style = TOP_HEM[look.topStyle] ? look.topStyle : 'tee';
  const H = TOP_HEM[style];
  const F = fabric(TOP_COLORS[look.topColor] || TOP_COLORS.pink, look.topPattern, 'tp', defs, ctx);
  const W = fabric('#fafafc', null, 'tw', defs, ctx);
  const hem = `<path d="M0 ${H} L400 ${H}" stroke="${F.dark}" stroke-width="2.5" opacity=".7"/>`;
  const seams = both(lineD('M82 446 Q92 470 106 480', F.dark, 2, .5)).join('');
  const folds = fold('M150 560 Q160 600 152 640', F, ctx) + fold('M252 548 Q242 590 250 636', F, ctx) + fold('M132 486 Q160 500 176 520', F, ctx, 5) + fold('M268 486 Q240 500 224 520', F, ctx, 5);
  let inside = '', after = '', sl = TOP_SLEEVE[style];
  switch (style) {
    case 'vneck': inside = F.fill(NECKS.vneck(H)) + neckTrim('vneck', F); break;
    case 'tank': inside = F.fill(NECKS.tank(H)) + neckTrim('tank', F); break;
    case 'offshoulder': inside = F.fill(NECKS.offshoulder(H)) + neckTrim('offshoulder', F); break;
    case 'polo': inside = F.fill(NECKS.polo(H)) + neckTrim('polo', F); break;
    case 'party': inside = F.fill(NECKS.sweetheart(H)) + neckTrim('sweetheart', F); break;
    case 'hoodie':
      inside = F.fill(NECKS.crew(H)) + `<path d="M146 600 L254 600 L262 ${H - 4} L138 ${H - 4}Z" fill="none" stroke="${F.dark}" stroke-width="3"/>` + `<rect x="0" y="${H - 14}" width="400" height="14" fill="${F.dark}"/>`;
      after = `<path d="M146 398 Q150 362 174 356 L174 378 Q200 410 226 378 L226 356 Q250 362 254 398 Q200 432 146 398Z" fill="${F.dark}"/>` +
        lineD('M158 396 Q200 424 242 396', mix(F.col, '#000', .4), 2, .5) +
        `<path d="M186 410 L182 452 M214 410 L218 452" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` + circle(182, 455, 3.5, 'fill="#fff"') + circle(218, 455, 3.5, 'fill="#fff"');
      break;
    case 'collar': inside = F.fill(NECKS.crew(H)) + neckTrim('crew', F) + collarBits(F); break;
    case 'frill': {
      const pts = []; for (let t = -.08; t <= 1.08; t += .08) { const [x, y] = quad([162, 385], [200, 418], [238, 385], t); pts.push([x, y + 7]); }
      inside = F.fill(NECKS.crew(H)) + scallops(pts, 9, F.light) + scallops(pts.map(([x, y]) => [x, y - 2]), 4, '#fff');
      break;
    }
    case 'cardigan':
      inside = W.fill(NECKS.crew(H)) + neckTrim('crew', W) +
        F.fill(`M0 ${H} L0 385 L158 385 Q166 410 182 440 L190 ${H}Z M400 ${H} L400 385 L242 385 Q234 410 218 440 L210 ${H}Z`) +
        `<path d="M158 385 Q166 410 182 440 L190 ${H} M242 385 Q234 410 218 440 L210 ${H}" stroke="${F.dark}" stroke-width="4" fill="none"/>` +
        [460, 500, 540, 580, 620].map(y => circle(184 + (y - 452) * .04, y, 4, `fill="${F.light}" stroke="${F.dark}" stroke-width="1"`)).join('');
      break;
    default: inside = F.fill(NECKS.crew(H)) + neckTrim('crew', F);
  }
  const hemShadow = ctx.lite ? '' : `<g clip-path="url(#${ctx.lowerClip})"><rect x="0" y="${H}" width="400" height="10" fill="#000" opacity=".2" filter="url(#${ctx.id}b3)"/></g>`;
  return `${hemShadow}<g clip-path="url(#${ctx.torsoClip})">${inside}${seams}${folds}${hem}</g>${after}${sleeves(sl, F, ctx)}`;
}

function skirtD(hem, flare, top = 636) {
  return `M122 ${top} L278 ${top} L${278 + flare} ${hem} Q200 ${hem + 14} ${122 - flare} ${hem}Z`;
}
function tutu(col, rainbow, ctx, hemBase = 850) {
  let s = '';
  for (let i = 0; i < 3; i++) {
    const w = 138 - i * 18, hem = hemBase - i * 26;
    const c = rainbow ? [RAINBOW[4], RAINBOW[2], RAINBOW[0]][i] : mix(col, '#fff', i * .18);
    let d = `M124 636 L276 636 L${200 + w} ${hem}`;
    for (let x = 200 + w, k = 0; x >= 200 - w; x -= 10, k++) d += ` L${x} ${hem + (k % 2 ? 10 : 0)}`;
    s += `<path d="${d}Z" fill="${c}" opacity=".88" stroke="${mix(c, '#000', .12)}" stroke-width="1"/>`;
  }
  return s + glitterDots([[170, 720], [230, 710], [200, 760], [150, 790], [252, 780], [190, 690], [214, 800]]);
}
const waistband = col => `<path d="M125 634 L275 634 L275 650 L125 650Z" fill="${mix(col, '#000', .25)}"/>`;

function bottomSvg(it, defs, ctx) {
  const F = fabric(it.color, it.pattern, 'bt', defs, ctx);
  switch (it.style) {
    case 'trousers': {
      const end = it.end || (it.tight ? 1000 : 1006);
      let s = F.fill(`M0 636 L400 636 L400 ${end} L0 ${end}Z`) +
        `<g clip-path="url(#${ctx.legClip})">${twoPathsFill(LEG, `url(#${ctx.id}cyl)`)}</g>` +
        both(lineD(`M158 780 Q164 ${(780 + end) / 2} 160 ${end}`, F.dark, 1.6, .3)).join('') +
        (end > 900 ? both(fold('M134 880 Q154 872 172 884', F, ctx, 5)).join('') + both(fold('M140 960 Q156 952 170 962', F, ctx, 4)).join('') : '') +
        both(fold('M150 700 Q170 712 196 704', F, ctx, 5)).join('') +
        `<path d="M0 ${end} L400 ${end}" stroke="${F.dark}" stroke-width="2.5" opacity=".7"/>`;
      if (!it.tight) s += `<rect x="0" y="634" width="400" height="14" fill="${F.dark}"/>` + lineD('M200 650 L200 700', F.dark, 2, .5);
      if (it.denim) s += both(`<path d="M128 652 Q142 680 168 662" stroke="#e8b923" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/>`).join('') +
        `<path d="M0 ${end - 8} L400 ${end - 8}" stroke="#e8b923" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      if (it.cuff) s += `<rect x="0" y="${end - 16}" width="400" height="16" fill="${F.dark}"/>`;
      return `<g clip-path="url(#${ctx.lowerClip})">${s}</g>`;
    }
    case 'skirt': {
      const d = skirtD(it.hem, it.flare);
      let s = F.fill(d) + waistband(F.col) + `<path d="M${122 - it.flare} ${it.hem} Q200 ${it.hem + 14} ${278 + it.flare} ${it.hem}" stroke="${F.dark}" stroke-width="3" fill="none"/>`;
      const n = it.pleats ? 7 : 3;
      for (let i = 1; i < n; i++) {
        const t = i / n;
        s += lineD(`M${122 + 156 * t} 650 L${122 - it.flare + (156 + it.flare * 2) * t} ${it.hem + 6}`, F.dark, it.pleats ? 2 : 1.6, it.pleats ? .45 : .25);
      }
      if (it.denim) s += lineD(`M${122 - it.flare + 6} ${it.hem - 8} Q200 ${it.hem + 4} ${278 + it.flare - 6} ${it.hem - 8}`, '#e8b923', 1.5, .9).replace('stroke-linecap', 'stroke-dasharray="3 2" stroke-linecap');
      return s;
    }
    case 'tutu':
      return tutu(it.color, it.rainbow, ctx) + `<path d="M125 632 L275 632 L275 648 L125 648Z" fill="${it.rainbow ? '#fff' : mix(it.color, '#000', .15)}"/>`;
  }
  return '';
}

function dressSvg(it, defs, ctx) {
  const F = fabric(it.color, it.pattern, 'dr', defs, ctx);
  if (it.special === 'dungarees') {
    const W = fabric('#fafafc', null, 'dw', defs, ctx);
    return {
      lower: `<g clip-path="url(#${ctx.lowerClip})">${F.fill('M0 636 L400 636 L400 1006 L0 1006Z')}<g clip-path="url(#${ctx.legClip})">${twoPathsFill(LEG, `url(#${ctx.id}cyl)`)}</g>` +
        both(lineD('M158 780 Q164 890 160 1006', F.dark, 2, .35)).join('') + `<path d="M0 998 L400 998" stroke="#e8b923" stroke-width="1.5" stroke-dasharray="3 2"/></g>`,
      upper: `<g clip-path="url(#${ctx.torsoClip})">${W.fill(NECKS.crew(660))}${neckTrim('crew', W)}${F.fill('M144 470 L256 470 L262 660 L138 660Z')}` +
        `<rect x="176" y="500" width="48" height="34" rx="4" fill="none" stroke="${F.dark}" stroke-width="2.5" stroke-dasharray="4 3"/></g>` +
        `<path d="M152 474 L132 404 M248 474 L268 404" stroke="${F.col}" stroke-width="15"/><path d="M152 474 L132 404 M248 474 L268 404" stroke="${F.dark}" stroke-width="15" opacity=".25"/>` +
        circle(152, 476, 5, 'fill="#f5c542" stroke="#c99a10" stroke-width="1"') + circle(248, 476, 5, 'fill="#f5c542" stroke="#c99a10" stroke-width="1"') +
        sleeves('short', W, ctx),
    };
  }
  let skirt = '';
  switch (it.skirt) {
    case 'ball': {
      const d = 'M124 628 L276 628 Q318 760 374 1004 Q200 1040 26 1004 Q82 760 124 628Z';
      skirt = F.fill(d) + [[150, 60], [178, 120], [222, 280], [250, 340], [200, 200]].map(([x, hx]) => fold(`M${x} 650 Q${x + (x - 200) * .4} 820 ${hx} 1014`, F, ctx, 10)).join('') +
        lineD('M26 1004 Q200 1040 374 1004', F.dark, 3, .6);
      if (it.glitter) skirt += glitterDots([[120, 900], [170, 860], [240, 880], [300, 930], [200, 960], [90, 970], [270, 790], [140, 780], [330, 990], [210, 740]]);
      break;
    }
    case 'party':
      skirt = `<path d="${skirtD(888, 80, 630)}" fill="${F.light}"/>` + F.fill(skirtD(870, 68, 630)) + lineD('M54 870 Q200 884 346 870', F.dark, 3, .6) +
        [1, 2, 3, 4].map(i => lineD(`M${122 + 31 * i} 650 L${54 + 58 * i} 876`, F.dark, 1.6, .25)).join('');
      if (it.glitter) skirt += glitterDots([[110, 830], [170, 760], [240, 790], [290, 850], [200, 840], [150, 700]]);
      break;
    case 'summer': skirt = F.fill(skirtD(880, 52, 630)) + lineD('M70 880 Q200 894 330 880', F.dark, 3, .6); break;
    case 'collar': skirt = F.fill(skirtD(876, 48, 630)) + [1, 2, 3, 4, 5].map(i => lineD(`M${122 + 26 * i} 650 L${74 + 42 * i} 882`, F.dark, 2, .4)).join(''); break;
    case 'mermaid': {
      const d = 'M122 628 L278 628 Q292 760 262 880 Q300 960 334 1012 Q200 1034 66 1012 Q100 960 138 880 Q108 760 122 628Z';
      skirt = F.fill(d) + `<path d="M138 880 Q200 892 262 880" stroke="${F.light}" stroke-width="4" fill="none"/>` + lineD('M66 1012 Q200 1034 334 1012', F.dark, 3, .6);
      break;
    }
    case 'unicorn': {
      skirt = tutu(it.color, false, ctx, 880).replace(/fill="#[0-9a-f]{6}" opacity=".88"/g, (m, off) => m);
      const cols = ['#ffb3d9', '#c9b3ff', '#b3e5ff'];
      let k = 0;
      skirt = skirt.replace(/fill="#[0-9a-f]{6}" opacity=".88"/g, () => `fill="${cols[k++ % 3]}" opacity=".9"`);
      skirt += [[150, 760], [250, 780], [200, 820], [120, 820], [280, 830]].map(([x, y]) => `<g transform="translate(${x} ${y})">${shape('star', 7, '#fff1a8')}</g>`).join('');
      break;
    }
  }
  const neck = it.neck === 'collar' ? 'crew' : it.neck;
  let upper = `<g clip-path="url(#${ctx.torsoClip})">${F.fill(NECKS[neck](660))}${neckTrim(it.neck, F)}${it.neck === 'collar' ? collarBits(F) : ''}</g>`;
  if (it.sash) upper += `<path d="M120 624 Q200 634 280 624 L281 644 Q200 654 119 644Z" fill="${it.sash}" stroke="${mix(it.sash, '#000', .15)}" stroke-width="1"/>` +
    `<g transform="translate(266 636) scale(.6)">${drawThing({ kind: 'bow', color: it.sash })}</g>`;
  if (it.glitter) upper += glitterDots([[170, 520], [230, 540], [200, 580], [160, 600], [240, 610]]);
  upper += sleeves(it.sleeve, F, ctx);
  return { lower: skirt, upper };
}

function socksSvg(it, defs, ctx) {
  const F = fabric(it.color, it.pattern, 'sk', defs, ctx);
  let s = `<g clip-path="url(#${it.tights ? ctx.lowerClip : ctx.legClip})">${F.fill(`M0 ${it.top} L400 ${it.top} L400 1016 L0 1016Z`)}<g clip-path="url(#${ctx.legClip})">${twoPathsFill(LEG, `url(#${ctx.id}cyl)`)}</g>` +
    (it.tights ? '' : `<rect x="0" y="${it.top}" width="400" height="7" fill="${F.dark}" opacity=".5"/>`) + '</g>';
  if (it.frill) s += both(scallops([[136, it.top + 2], [146, it.top - 1], [156, it.top - 2], [166, it.top - 1], [175, it.top + 2]], 5.5, '#fff')).join('');
  return s;
}

function shoeSvg(it) {
  const c = it.color, d = mix(c, '#000', .28), l = mix(c, '#fff', .55);
  let s = '';
  switch (it.style) {
    case 'trainer':
      s = `<path d="M140 1002 L176 1002 Q186 1020 182 1034 L126 1034 Q118 1020 138 1012Z" fill="${c}" stroke="${d}" stroke-width="2"/>` +
        `<path d="M122 1030 L184 1030 L183 1040 L123 1040Z" fill="#fff" stroke="#c8c8d0" stroke-width="1.5"/>` +
        `<path d="M148 1008 L172 1008 M146 1014 L172 1014 M144 1020 L170 1020" stroke="${lum(c) > .8 ? '#ff6fb0' : '#fff'}" stroke-width="2" stroke-linecap="round"/>` +
        lineD('M130 1026 Q150 1018 176 1026', d, 2.5, .6);
      break;
    case 'flat':
      s = `<path d="M138 1014 Q158 1008 176 1014 Q186 1024 182 1036 L126 1036 Q118 1026 138 1016Z" fill="${c}" stroke="${d}" stroke-width="2"/>`;
      if (it.strap) s += `<path d="M144 1006 L176 1006" stroke="${c}" stroke-width="4"/>`;
      if (it.bow) s += `<g transform="translate(136 1020) scale(.35)">${drawThing({ kind: 'bow', color: mix(c, '#000', .1) })}</g>`;
      if (it.glitter) s += glitterDots([[140, 1026], [152, 1020], [164, 1030], [172, 1022], [132, 1030]]);
      break;
    case 'sandal':
      s = `<path d="M122 1030 L184 1030 L183 1038 L123 1038Z" fill="${c}" stroke="${d}" stroke-width="1.5"/>` +
        `<path d="M134 1024 Q152 1012 174 1022 M144 1008 L174 1008" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
      break;
    case 'boot': {
      const top = it.top || 950;
      s = `<path d="M140 ${top} L180 ${top} L182 1036 L124 1036 Q116 1020 140 1008Z" fill="${c}" stroke="${d}" stroke-width="2"/>` +
        `<rect x="138" y="${top}" width="44" height="10" rx="3" fill="${d}"/>` + `<path d="M122 1032 L184 1032 L183 1040 L123 1040Z" fill="${d}"/>` +
        lineD(`M172 ${top + 16} L174 1018`, '#fff', 3, .45);
      if (it.dots) for (let y = top + 22; y < 1024; y += 22) s += circle(150, y, 4, 'fill="#fff"') + circle(166, y + 11, 4, 'fill="#fff"');
      break;
    }
    case 'slipper':
      s = [[132, 1028], [142, 1020], [154, 1016], [166, 1018], [176, 1026], [148, 1030], [164, 1030]].map(([x, y]) => circle(x, y, 10, 'fill="#fff" stroke="#e6dff0" stroke-width="1.5"')).join('') +
        `<path d="M128 1014 L122 994 L136 1010Z" fill="#ffe08a" stroke="#e0b440" stroke-width="1.2"/>` +
        circle(140, 1012, 4, 'fill="#ff9ccf"') + circle(148, 1008, 4, 'fill="#c9b3ff"') + circle(156, 1008, 4, 'fill="#b3e5ff"') +
        `<path d="M130 1024 Q134 1028 138 1024" stroke="#3a2a40" stroke-width="1.6" fill="none"/>`;
      break;
  }
  return s;
}

function bagSvg(it) {
  const c = it.color, d = mix(c, '#000', .25);
  const handle = `<path d="M314 792 Q320 744 331 742 Q346 744 360 792" stroke="${d}" stroke-width="4" fill="none"/>`;
  switch (it.style) {
    case 'handbag': return handle + `<rect x="304" y="788" width="66" height="50" rx="12" fill="${c}" stroke="${d}" stroke-width="2"/>` +
      `<path d="M304 806 L370 806" stroke="${d}" stroke-width="2"/>` + circle(337, 808, 4.5, 'fill="#f5c542" stroke="#c99a10" stroke-width="1"');
    case 'heart': return handle + `<g transform="translate(337 818)">${shape('heart', 30, c, d)}</g>`;
    case 'star': return handle + `<g transform="translate(337 818)">${shape('star', 32, c, d)}</g>`;
    case 'unicorn': return handle + `<rect x="306" y="788" width="62" height="54" rx="22" fill="#fff" stroke="#e0d6e8" stroke-width="2"/>` +
      `<path d="M330 790 L337 762 L344 790Z" fill="#ffe08a" stroke="#e0b440" stroke-width="1.2"/>` +
      `<path d="M322 814 Q326 818 330 814 M344 814 Q348 818 352 814" stroke="#3a2a40" stroke-width="2" fill="none"/>` + circle(320, 824, 4, 'fill="#ffb3d9"') + circle(354, 824, 4, 'fill="#ffb3d9"');
    case 'rainbow': return handle + `<path d="M304 836 Q304 788 337 788 Q370 788 370 836Z" fill="#fff" stroke="#ddd" stroke-width="2"/>` +
      `<g transform="translate(337 836)">${shape('rainbow', 28, c)}</g>`;
  }
  return '';
}

function braceletSvg(it) {
  const c = it.color;
  switch (it.style) {
    case 'beads': { let s = ''; for (let i = 0; i < 7; i++) s += circle(57 + i * 4.2, 712 + Math.sin(i / 6 * Math.PI) * 3, 3.2, `fill="${RAINBOW[i % 6]}"`); return s; }
    case 'bangle': return `<ellipse cx="69" cy="712" rx="15" ry="4.5" fill="none" stroke="${mix(c, '#000', .2)}" stroke-width="5"/><ellipse cx="69" cy="712" rx="15" ry="4.5" fill="none" stroke="${c}" stroke-width="3"/>`;
    case 'pearls': { let s = ''; for (let i = 0; i < 7; i++) s += circle(57 + i * 4.2, 712 + Math.sin(i / 6 * Math.PI) * 3, 3, 'fill="#fff" stroke="#d8d0e0" stroke-width=".8"'); return s; }
    case 'charm': return `<ellipse cx="69" cy="712" rx="15" ry="4.5" fill="none" stroke="${c}" stroke-width="2"/>` +
      `<g transform="translate(62 722)">${shape('heart', 4, '#ff3d7f')}</g><g transform="translate(76 722)">${shape('star', 4, '#ffcc33')}</g>`;
    case 'watch': return `<rect x="54" y="706" width="30" height="11" rx="4" fill="${c}"/>` + circle(69, 711, 8, 'fill="#fff" stroke="#c4cbd8" stroke-width="2"') +
      `<path d="M69 711 L69 706 M69 711 L73 712" stroke="#3a2a40" stroke-width="1.4" stroke-linecap="round"/>`;
  }
  return '';
}

// ---------- the girl ----------
export function renderGirl(look, opts = {}) {
  const id = uid();
  const c = HAIR_COLORS[look.hairColor] || HAIR_COLORS.brown;
  const skin = SKINS[look.skin] || SKINS.s2;
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  const eyeCol = EYE_COLORS[look.eyeColor] || EYE_COLORS.blue;
  const it = k => (look[k] && ITEMS[look[k]]) || null;
  const lite = !!opts.lite; // menu pictures: fewer strands, no texture, so iPads stay quick
  // The same girl always gets the same strands, so nothing flickers when she is redrawn.
  let seed = [...String(look.girl || 'x')].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 2147483647, 7) || 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const masc = it('mascara'), liner = it('eyeliner'), ear = it('earrings'), neck = it('necklace'), head = it('headwear'), specs = it('glasses');
  const exts = (look.extensions || []).map(v => ITEMS['ext-' + v]).filter(Boolean);
  const paint = look.paint || [];
  const defs = [];

  // Gradients and clips
  const hg = `${id}h`, rb = `${id}r`;
  defs.push(`<linearGradient id="${hg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.light}"/><stop offset=".42" stop-color="${c.base}"/><stop offset="1" stop-color="${mix(c.base, c.shade, .75)}"/></linearGradient>`);
  defs.push(`<linearGradient id="${rb}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="56" y2="0" spreadMethod="repeat">${RAINBOW.map((col, i) => `<stop offset="${r1(i / 5 * 100) / 100}" stop-color="${col}"/>`).join('')}</linearGradient>`);
  defs.push(`<radialGradient id="${id}fs" cx=".5" cy=".42" r=".62"><stop offset=".55" stop-color="${skin.shade}" stop-opacity="0"/><stop offset="1" stop-color="${skin.shade}" stop-opacity=".6"/></radialGradient>`);
  defs.push(`<radialGradient id="${id}ig" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="${mix(eyeCol, '#fff', .5)}"/><stop offset=".45" stop-color="${eyeCol}"/><stop offset=".85" stop-color="${mix(eyeCol, '#000', .25)}"/><stop offset="1" stop-color="${mix(eyeCol, '#000', .55)}"/></radialGradient>`);
  defs.push(`<radialGradient id="${id}ck" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7a8a" stop-opacity=".22"/><stop offset="1" stop-color="#ff7a8a" stop-opacity="0"/></radialGradient>`);
  defs.push(`<linearGradient id="${id}bs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${skin.shade}" stop-opacity=".7"/><stop offset=".3" stop-color="${skin.shade}" stop-opacity="0"/><stop offset=".7" stop-color="${skin.shade}" stop-opacity="0"/><stop offset="1" stop-color="${skin.shade}" stop-opacity=".7"/></linearGradient>`);
  for (const [k, sd] of [['b6', 6], ['b2', 2.2], ['b1', .6], ['b3', 3]]) {
    defs.push(`<filter id="${id}${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  }
  // Eye shape: inner corner towards the nose, outer corner slightly higher. s = -1 left eye, 1 right eye.
  const eyeShape = (cx, cy, s) => {
    const X = dx => r1(cx + s * dx);
    return `M${X(-25)} ${cy + 2} C${X(-16)} ${cy - 11} ${X(-6)} ${cy - 15} ${X(2)} ${cy - 15} C${X(12)} ${cy - 15} ${X(20)} ${cy - 9} ${X(26)} ${cy - 1} C${X(19)} ${cy + 8} ${X(10)} ${cy + 13} ${X(2)} ${cy + 13} C${X(-7)} ${cy + 13} ${X(-17)} ${cy + 9} ${X(-25)} ${cy + 2}Z`;
  };
  const upperLip = 'M172 282 Q182 274 192 272 Q197 271 200 275 Q203 271 208 272 Q218 274 228 282 Q214 285 200 285 Q186 285 172 282Z';
  const lowerLip = 'M172 282 Q186 285 200 285 Q214 285 228 282 Q220 298 200 300 Q180 298 172 282Z';
  const lid = (cx, s) => {
    const X = dx => r1(cx + s * dx), cy = 215;
    return `M${X(-34)} ${cy + 2} L${X(-25)} ${cy + 2} C${X(-16)} ${cy - 11} ${X(-6)} ${cy - 15} ${X(2)} ${cy - 15} C${X(12)} ${cy - 15} ${X(20)} ${cy - 9} ${X(26)} ${cy - 1} L${X(35)} ${cy} Q${X(32)} ${cy - 44} ${X(0)} ${cy - 46} Q${X(-32)} ${cy - 44} ${X(-34)} ${cy + 2}Z`;
  };
  defs.push(`<clipPath id="${id}ec"><path d="${eyeShape(160, 215, -1)}"/><path d="${eyeShape(240, 215, 1)}"/></clipPath>`);
  // Fine skin texture and light coming from the left.
  if (!lite) defs.push(`<filter id="${id}nz" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .2  0 0 0 0 .15  0 0 0 .9 -.32"/></filter>`);
  defs.push(`<linearGradient id="${id}lt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="${skin.shade}" stop-opacity="0"/><stop offset="1" stop-color="${skin.shade}" stop-opacity=".5"/></linearGradient>`);
  defs.push(`<radialGradient id="${id}scl" cx=".5" cy=".6" r=".6"><stop offset=".4" stop-color="#f6efec"/><stop offset=".85" stop-color="#e2d0ce"/><stop offset="1" stop-color="#cfaeae"/></radialGradient>`);
  defs.push(`<clipPath id="${id}fc"><path d="${FACE}"/></clipPath>`);
  defs.push(`<radialGradient id="${id}sc" cx=".5" cy=".55" r=".6"><stop offset=".55" stop-color="#fffdfc"/><stop offset="1" stop-color="#e7dde2"/></radialGradient>`);
  defs.push(`<radialGradient id="${id}lp" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="${mix(skin.lip, '#fff', .22)}"/><stop offset="1" stop-color="${mix(skin.lip, '#000', .1)}"/></radialGradient>`);
  defs.push(`<clipPath id="${id}lc"><path d="${upperLip}"/><path d="${lowerLip}"/></clipPath>`);
  defs.push(`<clipPath id="${id}dc"><path d="${lid(160, -1)}"/><path d="${lid(240, 1)}"/></clipPath>`);

  // Hair
  const hp = hairParts(look.hairStyle, L, c, `fill="url(#${hg})"`);
  const curlyHair = ['curly', 'afro'].includes(look.hairStyle);
  const hairCol = t => t < .45 ? mix(c.shade, c.base, t / .45) : mix(c.base, c.light, (t - .45) / .55);
  const strand = (x0, y0, a, b, cc, d2, x1, y1, col, w, op) =>
    `<path d="M${r1(x0)} ${r1(y0)} C${r1(a)} ${r1(b)} ${r1(cc)} ${r1(d2)} ${r1(x1)} ${r1(y1)}" stroke="${col}" stroke-width="${r1(w)}" opacity="${r1(op * 100) / 100}" fill="none" stroke-linecap="round"/>`;
  const strandsFor = kind => {
    const n = lite ? 40 : kind === 'front' ? 240 : 260;
    let out = '';
    if (curlyHair) {
      // little curls instead of long strands
      for (let i = 0; i < n * 1.4; i++) {
        const x = 50 + rand() * 300, y = 40 + rand() * (L + 40), r = 3 + rand() * 6, a0 = rand() * 6.28;
        out += `<path d="M${r1(x + Math.cos(a0) * r)} ${r1(y + Math.sin(a0) * r)} A${r1(r)} ${r1(r)} 0 1 1 ${r1(x + Math.cos(a0 + 2.6) * r)} ${r1(y + Math.sin(a0 + 2.6) * r)}" stroke="${hairCol(rand())}" stroke-width="${r1(.6 + rand() * .9)}" fill="none" opacity="${r1((.35 + rand() * .45) * 100) / 100}"/>`;
      }
      return out;
    }
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const col = hairCol(Math.pow(rand(), kind === 'front' ? .8 : 1.2) * .95), w = .5 + rand() * 1.2, op = .4 + rand() * .45;
      if (kind === 'back') {
        const out1 = 112 + rand() * 24;
        out += strand(196 + side * rand() * 40, 74 + rand() * 30, 200 + side * out1, 120 + rand() * 60, 200 + side * (out1 - 8 + rand() * 12), 260 + rand() * 120,
          200 + side * (30 + rand() * 120), L - 40 + rand() * 80, col, w, op);
      } else if (kind === 'strand') {
        const x = 60 + rand() * 280;
        out += strand(x, 170 + rand() * 30, x + (rand() - .5) * 16, 260, x + (rand() - .5) * 16, 380, x + (rand() - .5) * 20, L + 20, col, w, op);
      } else {
        const py = 76 + rand() * 46, reach = 70 + rand() * 46, lift = (122 - py) * .5;
        out += strand(195 + side * (1 + rand() * 3), py, 200 + side * (24 + rand() * 32), py - 6 - lift * .3 + rand() * 6,
          200 + side * (reach + 14 + rand() * 14), 100 + rand() * 50 + (py - 76) * .6, 200 + side * reach, 150 + rand() * 190, col, w, op);
        if (i % 3 === 0) { // fringe strands falling over the forehead
          const x = 110 + rand() * 180;
          out += strand(x + (200 - x) * .3, 84 + rand() * 10, x - 6 + rand() * 12, 120, x - 10 + rand() * 20, 150, x + (x - 200) * .25, 168 + rand() * 24, hairCol(.2 + rand() * .7), .5 + rand(), .5 + rand() * .4);
        }
      }
    }
    if (kind === 'front' && !lite) {
      out += `<path d="M132 118 Q200 78 268 118" stroke="${mix(c.light, '#ffffff', .2)}" stroke-width="22" fill="none" opacity=".2" filter="url(#${id}b6)"/>`;
      for (let i = 0; i < 60; i++) {
        const side = i % 2 ? 1 : -1, py = 80 + rand() * 30;
        out += strand(195 + side * (1 + rand() * 3), py, 200 + side * (26 + rand() * 24), py - 8, 200 + side * (66 + rand() * 16), 90 + rand() * 20,
          200 + side * (90 + rand() * 10), 140 + rand() * 40, mix(c.light, '#ffffff', .1 + rand() * .3), .4 + rand() * .7, .2 + rand() * .35);
      }
    }
    return out;
  };
  const layer = (shapes, kind) => {
    if (!shapes.length) return '';
    const cid = uid();
    return `<g stroke="${mix(c.shade, '#000', .25)}" stroke-width="1.2" stroke-opacity=".55" stroke-linejoin="round">${shapes.join('')}</g>` +
      `<clipPath id="${cid}">${shapes.join('')}</clipPath><g clip-path="url(#${cid})">${strandsFor(kind)}${exts.length ? `<g opacity=".85">${stripes(exts)}</g>` : ''}</g>`;
  };
  let cutOpen = '', cutClose = '';
  const cut = look.cut || 9999;
  if (look.cut) {
    let d = `M-10 -10 L410 -10 L410 ${cut}`;
    for (let x = 410, i = 0; x >= -10; x -= 7, i++) d += ` L${x} ${cut + (i % 2 ? 4 : -3)}`;
    defs.push(`<clipPath id="${id}cut"><path d="${d}Z"/></clipPath>`);
    cutOpen = `<g clip-path="url(#${id}cut)">`;
    cutClose = '</g>';
  }
  const ties = hp.ties.filter(([, y]) => y < cut - 4)
    .map(([x, y]) => `<rect x="${x - 9}" y="${y - 6}" width="18" height="12" rx="5" fill="${c.shade}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`).join('');

  // Brush paint layers
  const paintLayer = (layerName, clipId, blur) => {
    const strokes = paint.filter(s => s.layer === layerName);
    let paths = '', sparkles = '';
    for (const s of strokes) {
      const item = ITEMS[s.item];
      if (!item) continue;
      const a = strokeAttrs(item, rb);
      paths += `<path d="${ptsToD(s.pts)}" fill="none" stroke="${a.stroke}" stroke-width="${a.width}" opacity="${a.opacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (item.glitter) sparkles += glitterAlong(s.pts);
    }
    return `<g clip-path="url(#${clipId})"><g data-strokes="${layerName}"${blur ? ` filter="url(#${id}${blur})"` : ''}>${paths}</g>${sparkles}</g>`;
  };

  // Eyes, lashes, liner and brows
  const browCol = mix(c.shade, '#3a2a20', lum(c.shade) > .5 ? .45 : .1);
  const outline = mix(skin.shade, '#000', .12);
  const eye = (cx, cy, s) => {
    const X = dx => r1(cx + s * dx);
    const ix = X(1.5), iy = cy - 1;
    let fibres = '';
    for (let k = 0; k < (lite ? 24 : 70); k++) {
      const a = k / (lite ? 24 : 70) * Math.PI * 2 + rand() * .05, r0 = 4.6 + rand() * 1.2, r2 = 11 + rand() * 1.8;
      const col = rand() < .5 ? mix(eyeCol, '#ffffff', .25 + rand() * .3) : mix(eyeCol, '#000000', .2 + rand() * .3);
      fibres += `<path d="M${r1(ix + Math.cos(a) * r0)} ${r1(iy + Math.sin(a) * r0)} L${r1(ix + Math.cos(a) * r2)} ${r1(iy + Math.sin(a) * r2)}" stroke="${col}" stroke-width=".6" opacity=".7"/>`;
    }
    const nL = masc ? 30 : 22;
    let lashes = '';
    for (let k = 0; k < nL; k++) {
      const t = k / (nL - 1);
      const bx = t < .5 ? cx + s * (-25 + t * 2 * 27) : cx + s * (2 + (t - .5) * 2 * 24);
      const by = t < .5 ? cy + 2 - Math.sin(t * Math.PI) * 17 : cy - 15 + (t - .5) * 2 * 14;
      const len = (masc ? 5 + t * 7 : 3 + t * 5) * (.8 + rand() * .4);
      const ang = -Math.PI / 2 + s * (t * 1.1 - .2) + (rand() - .5) * .25;
      const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
      lashes += `<path d="M${r1(bx)} ${r1(by)} Q${r1(bx + Math.cos(ang) * len * .4 + s * 1.2)} ${r1(by + Math.sin(ang) * len * .6)} ${r1(ex)} ${r1(ey)}" stroke-width="${r1((masc ? .9 : .6) + rand() * .4)}" fill="none" stroke-linecap="round"/>`;
    }
    let lower = '';
    for (let k = 0; k < 12; k++) {
      const t = .3 + k / 11 * .65;
      lower += `<path d="M${r1(cx + s * (-25 + t * 51))} ${r1(cy + 2 + Math.sin(t * Math.PI) * 11)} l${r1(s * (t - .4) * 2.5)} ${r1(2.5 + rand() * 1.8)}" stroke-width=".55"/>`;
    }
    let brow = '';
    for (let k = 0; k < (lite ? 30 : 90); k++) {
      const t = rand();
      const bx = cx + s * (-22 + t * 46), by = cy - 31 - Math.sin(Math.min(1, t * 1.25) * Math.PI * .9) * 7 + (rand() - .5) * (5 - t * 3);
      const ang = -Math.PI / 2 + s * (.9 + t * .7) + (rand() - .5) * .3, len = 4 + rand() * 4;
      brow += `<path d="M${r1(bx)} ${r1(by)} l${r1(Math.cos(ang) * len)} ${r1(Math.sin(ang) * len)}" stroke-width="${r1(.6 + rand() * .5)}" opacity="${r1((.35 + rand() * .45) * 100) / 100}"/>`;
    }
    const outer = cx + s * 26;
    const linerSvg = liner ? `<path d="M${X(-25)} ${cy + 1} C${X(-16)} ${cy - 12} ${X(-6)} ${cy - 16} ${X(2)} ${cy - 16} C${X(12)} ${cy - 16} ${X(20)} ${cy - 10} ${X(27)} ${cy - 2} L${r1(outer + s * 11)} ${cy - 10}" stroke="${liner.color}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      (liner.glitter ? glitterDots([[cx - 10, cy - 15], [cx + 6, cy - 16], [outer + s * 6, cy - 6]]) : '') : '';
    const shape = eyeShape(cx, cy, s);
    return `
      <path d="M${X(-27)} ${cy - 6} C${X(-12)} ${cy - 30} ${X(12)} ${cy - 30} ${X(30)} ${cy - 9}" stroke="${skin.shade}" stroke-width="3" fill="none" opacity=".7" filter="url(#${id}b2)"/>
      <path d="M${X(-24)} ${cy - 2} C${X(-10)} ${cy - 20} ${X(12)} ${cy - 20} ${X(26)} ${cy - 4}" stroke="#fff" stroke-width="5" fill="none" opacity=".18" filter="url(#${id}b2)"/>
      <ellipse cx="${X(2)}" cy="${cy + 16}" rx="19" ry="5" fill="${skin.shade}" opacity=".35" filter="url(#${id}b3)"/>
      <g class="bb-eye">
        <path d="${shape}" fill="url(#${id}scl)"/>
        <g clip-path="url(#${id}ec)">
          ${circle(ix, iy, 13, `fill="url(#${id}ig)"`)}
          <g filter="url(#${id}b1)">${fibres}</g>
          ${circle(ix, iy, 13, `fill="none" stroke="${mix(eyeCol, '#000', .7)}" stroke-width="1.7" opacity=".8"`)}
          ${circle(ix, iy, 5, 'fill="#0d0a0a"')}
          <path d="M${X(-28)} ${cy - 17} L${X(30)} ${cy - 17} L${X(30)} ${cy - 4} Q${X(2)} ${cy - 11} ${X(-28)} ${cy - 1}Z" fill="#3a2020" opacity=".35" filter="url(#${id}b2)"/>
          <path d="M${r1(ix + 2.5)} ${iy - 7} l4.4 0 l0 3.8 l-4.4 0Z" fill="#fff" opacity=".92" filter="url(#${id}b1)"/>
          ${circle(ix - 4, iy + 4.5, 1.2, 'fill="#fff" opacity=".6"')}
          <path d="M${X(-23)} ${cy + 3} C${X(-11)} ${cy + 11} ${X(11)} ${cy + 12} ${X(24)} ${cy}" stroke="#f3c4c4" stroke-width="1.7" fill="none" opacity=".8"/>
        </g>
        <ellipse cx="${X(-24)}" cy="${cy + 2}" rx="2.8" ry="2.1" fill="#e8a2a2" opacity=".8"/>
        <path d="M${X(-25)} ${cy + 2} C${X(-16)} ${cy - 11} ${X(-6)} ${cy - 15.5} ${X(2)} ${cy - 15.5} C${X(12)} ${cy - 15.5} ${X(20)} ${cy - 9.5} ${X(27)} ${cy - 1.5}" stroke="#241614" stroke-width="2.3" fill="none" stroke-linecap="round"/>
        ${linerSvg}
        <g stroke="${masc ? masc.color : '#2a1a14'}" opacity=".88">${lashes}</g>
        <g stroke="${masc ? masc.color : '#2a1d1d'}" opacity=".6">${lower}</g>
      </g>
      <g stroke="${browCol}" stroke-linecap="round">${brow}</g>`;
  };

  const freckles = look.freckles
    ? glitterDots([[176, 250], [184, 258], [170, 260], [224, 250], [216, 258], [230, 260], [192, 244], [208, 244], [164, 252], [236, 252]], mix(skin.shade, '#5a3020', .3))
    : '';

  let lipLines = '';
  if (!lite) for (let x = 177; x <= 223; x += 2.4) lipLines += `<path d="M${r1(x)} ${r1(285.5 - Math.abs(x - 200) * .06)} Q${r1(x + (x - 200) * .02)} 292 ${r1(x + (x - 200) * .04)} ${r1(298.5 - Math.abs(x - 200) * .28)}" stroke="${mix(skin.lip, '#000', .35)}" stroke-width=".5" opacity=".25"/>`;
  const lips = `<path d="M197 262 Q198 270 196 274 M203 262 Q202 270 204 274" stroke="${skin.shade}" stroke-width="2.4" fill="none" opacity=".22" filter="url(#${id}b2)"/>
    <path d="${upperLip}" fill="${mix(skin.lip, '#000', .18)}" filter="url(#${id}b1)"/><path d="${lowerLip}" fill="url(#${id}lp)" filter="url(#${id}b1)"/>
    ${paintLayer('lips', `${id}lc`, 'b1')}
    <g clip-path="url(#${id}lc)">${lipLines}</g>
    <path d="M172 282 Q186 286 200 285.5 Q214 286 228 282" stroke="${mix(skin.lip, '#2a0a0a', .6)}" stroke-width="1.6" fill="none" opacity=".7" filter="url(#${id}b1)"/>
    ${both(`<circle cx="173" cy="282" r="2.6" fill="${skin.shade}" opacity=".55" filter="url(#${id}b2)"/>`).join('')}
    <ellipse cx="205" cy="292" rx="8" ry="2.5" fill="#fff" opacity=".42" filter="url(#${id}b2)"/>
    <ellipse cx="190" cy="278" rx="4" ry="1.4" fill="#fff" opacity=".22" filter="url(#${id}b1)"/>
    <ellipse cx="200" cy="306" rx="14" ry="3.5" fill="${skin.shade}" opacity=".35" filter="url(#${id}b2)"/>`;

  const earringSvg = ear
    ? `<g transform="translate(106 244)">${earring(ear)}</g><g transform="translate(294 244) scale(-1 1)">${earring(ear)}</g>`
    : '';

  const placed = opts.noPlaced ? '' : (look.placed || []).map(p => {
    const item = ITEMS[p.item];
    if (!item) return '';
    const attrs = opts.still ? '' : `class="bb-placed" data-placed="${p.key}" `;
    return `<g ${attrs}transform="translate(${r1(p.x)} ${r1(p.y)})">${drawThing(item)}</g>`;
  }).join('');

  // Whole body: skin, then clothes from the feet up.
  const ctx = { id, lite, defs, torsoClip: `${id}tc`, armClip: `${id}ac`, legClip: `${id}lg`, lowerClip: `${id}lw`, sleeveEnd: `${id}se` };
  // Round shading for arms and legs (dark edges, soft highlight), and a woven texture for cloth.
  defs.push(`<linearGradient id="${id}cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".1"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>`);
  if (!lite) defs.push(`<filter id="${id}fab" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85 .45" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.3"/><feComposite operator="in" in2="SourceGraphic"/></filter>`);
  const skinNoise = d => lite ? '' : `<path d="${d}" fill="#000" filter="url(#${id}nzb)" opacity=".28"/>`;
  if (!lite) defs.push(`<filter id="${id}nzb" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .2  0 0 0 0 .15  0 0 0 .9 -.32"/><feComposite operator="in" in2="SourceGraphic"/></filter>`);
  defs.push(`<clipPath id="${ctx.torsoClip}"><path d="${TORSO}"/></clipPath>`,
    `<clipPath id="${ctx.armClip}">${twoPaths(ARM)}</clipPath>`,
    `<clipPath id="${ctx.legClip}">${twoPaths(LEG)}</clipPath>`,
    `<clipPath id="${ctx.lowerClip}"><path d="${TORSO}"/>${twoPaths(LEG)}</clipPath>`,
    `<linearGradient id="${id}ts" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".28" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`,
    `<linearGradient id="${id}tl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>`);
  const skinPath = d => `<path d="${d}" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".5"/><path d="${d}" fill="url(#${id}bs)"/>${skinNoise(d)}`;
  const dress = it('dress'), bottom = it('bottom'), socks = it('socks'), shoes = it('shoes'), bag = it('bag'), bracelet = it('bracelet');
  const dressParts = dress ? dressSvg(dress, defs, ctx) : null;
  const legs = `<ellipse cx="200" cy="1040" rx="100" ry="11" fill="#5a2a5e" opacity=".14" filter="url(#${id}b6)"/>` +
    both(`<path d="${LEG}" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".5"/>`).join('') + twoPathsFill(LEG, `url(#${id}cyl)`) +
    (lite ? '' : twoPathsFill(LEG, '#000').replace(/fill="#000"/g, `fill="#000" filter="url(#${id}nzb)" opacity=".28"`)) +
    both(`<ellipse cx="152" cy="884" rx="14" ry="9" fill="#fff" opacity=".12" filter="url(#${id}b3)"/>`).join('') +
    both(`<path d="M134 770 Q144 880 156 1000" stroke="#fff" stroke-width="7" opacity=".14" fill="none" stroke-linecap="round" filter="url(#${id}b3)"/>`).join('') +
    both(`<path d="M140 884 Q154 892 168 884" stroke="${skin.shade}" stroke-width="2" fill="none" opacity=".4"/>`).join('') +
    both(`<ellipse cx="152" cy="1022" rx="22" ry="11" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".6"/>`).join('') + both(`<ellipse cx="146" cy="1018" rx="10" ry="4" fill="#fff" opacity=".2"/>`).join('');
  const arms = both(`<path d="${ARM}" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".5"/>`).join('') + twoPathsFill(ARM, `url(#${id}cyl)`) +
    (lite ? '' : twoPathsFill(ARM, '#000').replace(/fill="#000"/g, `fill="#000" filter="url(#${id}nzb)" opacity=".28"`)) +
    both(`<path d="M70 588 Q78 596 92 590" stroke="${skin.shade}" stroke-width="3" fill="none" opacity=".35" filter="url(#${id}b2)"/>`).join('') +
    both(`<path d="M74 478 Q64 590 74 708" stroke="#fff" stroke-width="6" opacity=".14" fill="none" stroke-linecap="round" filter="url(#${id}b3)"/>`).join('');
  // Hand: a relaxed hand with fingers together, a thumb in front and soft shading.
  const HAND = 'M63 724 C60 738 60 752 62 764 C64 774 70 779 76 779 C83 779 88 774 89 764 C90 752 90 738 88 724Z';
  const hand = `<path d="${HAND}" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".6"/>` +
    `<path d="${HAND}" fill="url(#${id}cyl)"/>` +
    `<path d="M70 758 Q70 768 71 776 M76 760 Q76 770 76 778 M82 758 Q82 768 81 776" stroke="${skin.shade}" stroke-width="1.1" fill="none" opacity=".55"/>` +
    `<path d="M86 734 C92 740 93 752 88 760 C85 762 82 760 83 756 C85 750 84 742 82 738Z" fill="${skin.base}" stroke="${outline}" stroke-width=".8" stroke-opacity=".6"/>` +
    `<ellipse cx="72" cy="740" rx="5" ry="9" fill="#fff" opacity=".12"/>`;
  const rightHand = `<g ${MIRROR}>${hand}</g>`;
  const hands = hand + rightHand;
  const shoeStr = shoes ? shoeSvg(shoes) + `<g ${MIRROR}>${shoeSvg(shoes)}</g>` : '';
  const lowerClothes = dressParts ? dressParts.lower : bottom ? bottomSvg(bottom, defs, ctx) : '';
  const upperClothes = dressParts ? dressParts.upper : topSvg(look, defs, ctx);
  const body = `${legs}${socks ? socksSvg(socks, defs, ctx) : ''}
    ${skinPath(TORSO)}
    ${both(`<path d="M150 398 Q168 404 186 399" stroke="${skin.shade}" stroke-width="2" fill="none" opacity=".55"/>`).join('')}
    <ellipse cx="200" cy="326" rx="38" ry="13" fill="${skin.shade}" opacity=".55" filter="url(#${id}b3)"/>
    ${lowerClothes}${shoeStr}${arms}${hands}
    ${upperClothes}
    ${bracelet ? `<g transform="translate(7 3)">${braceletSvg(bracelet)}</g>` : ''}${bag ? `<g transform="translate(-7 5)">${bagSvg(bag)}</g>` + rightHand : ''}`;

  const ears = both(`<ellipse cx="106" cy="222" rx="13" ry="22" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".6"/>`).join('') +
    both(`<ellipse cx="104" cy="224" rx="7" ry="12" fill="#ff8a8a" opacity=".15"/>`).join('') +
    both(`<path d="M104 208 Q96 222 106 236" stroke="${skin.shade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('');

  const face = `<path d="${FACE}" fill="${skin.base}" stroke="${outline}" stroke-width="1" stroke-opacity=".5"/>
    <path d="${FACE}" fill="url(#${id}fs)"/>
    <g clip-path="url(#${id}fc)">
      <ellipse cx="200" cy="146" rx="70" ry="22" fill="#fff" opacity=".22" filter="url(#${id}b6)"/>
      ${both(`<ellipse cx="116" cy="186" rx="18" ry="46" fill="${skin.shade}" opacity=".45" filter="url(#${id}b6)"/>`).join('')}
      ${both(`<ellipse cx="148" cy="244" rx="16" ry="7" fill="#fff" opacity="${lum(skin.base) > .6 ? .26 : .12}" filter="url(#${id}b3)"/>`).join('')}
      <path d="M110 238 C120 282 156 316 200 326 C244 316 280 282 290 238" stroke="${skin.shade}" stroke-width="16" fill="none" opacity=".42" filter="url(#${id}b6)"/>
      <ellipse cx="200" cy="312" rx="16" ry="7" fill="#fff" opacity=".16" filter="url(#${id}b3)"/>
      <ellipse cx="200" cy="124" rx="96" ry="26" fill="${mix(skin.shade, c.shade, .3)}" opacity=".5" filter="url(#${id}b6)"/>
      ${both(`<path d="M190 122 C140 126 116 170 112 260" stroke="${mix(skin.shade, '#000', .2)}" stroke-width="16" fill="none" opacity=".4" filter="url(#${id}b6)"/>`).join('')}
      <rect x="100" y="96" width="200" height="232" fill="url(#${id}lt)"/>
      ${lite ? '' : `<rect x="100" y="96" width="200" height="232" fill="#000" filter="url(#${id}nz)" opacity=".3"/>`}
    </g>
    ${both(`<ellipse cx="146" cy="260" rx="28" ry="19" fill="url(#${id}ck)"/>`).join('')}`;

  const nose = `<path d="M193 214 C186 232 184 246 188 256" stroke="${skin.shade}" stroke-width="6" fill="none" opacity=".42" filter="url(#${id}b3)"/>
    <path d="M205 222 L206 242" stroke="#fff" stroke-width="3" opacity=".16" stroke-linecap="round" filter="url(#${id}b2)"/>
    <ellipse cx="201" cy="247" rx="7" ry="5" fill="#fff" opacity=".26" filter="url(#${id}b2)"/>
    <ellipse cx="200" cy="263" rx="14" ry="3.5" fill="${skin.shade}" opacity=".42" filter="url(#${id}b2)"/>
    <ellipse cx="192" cy="256" rx="4.2" ry="2.2" transform="rotate(20 192 256)" fill="${mix(skin.shade, '#3a1a10', .5)}" opacity=".72" filter="url(#${id}b1)"/>
    <ellipse cx="208" cy="256" rx="4.2" ry="2.2" transform="rotate(-20 208 256)" fill="${mix(skin.shade, '#3a1a10', .5)}" opacity=".72" filter="url(#${id}b1)"/>
    <path d="M186 250 Q184 256 189 259 M214 250 Q216 256 211 259" stroke="${skin.shade}" stroke-width="2" fill="none" opacity=".6" filter="url(#${id}b1)"/>`;

  return `<svg viewBox="${opts.viewBox || '0 0 400 520'}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" data-rainbow="${rb}">
  <defs>${defs.join('')}</defs>
  ${cutOpen}${layer(hp.back, 'back')}${cutClose}
  ${body}
  ${neck ? necklace(neck) : ''}
  ${cutOpen}${layer(hp.strand, 'strand')}${cutClose}
  ${ears}
  ${face}
  ${paintLayer('blush', `${id}fc`, 'b6')}
  ${freckles}
  ${paintLayer('face', `${id}fc`, null)}
  ${paintLayer('shadow', `${id}dc`, 'b2')}
  ${eye(160, 215, -1)}${eye(240, 215, 1)}
  ${nose}
  ${lips}
  ${earringSvg}
  ${layer(hp.front, 'front')}${ties}
  ${specs ? glassesSvg(specs) : ''}
  ${head ? headwear(head) : ''}
  ${placed}
</svg>`;
}

// Where hair ties are for this hairstyle (bobbles snap there).
export function tiePoints(look) {
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  return hairParts(look.hairStyle, L, HAIR_COLORS.brown, '').ties;
}

// How far down the hair goes right now (for the scissors).
export function hairBottom(look) {
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  const full = { bob: 300, pixie: 250, bun: 250, messybun: 250, spacebuns: 250, afro: 188 + 108 + (L - 290) * .18 + 22 }[look.hairStyle] || L + 14;
  return Math.min(full, look.cut || 9999);
}

// ---------- menu pictures ----------
const TEE = 'M18 10 L6 19 L12 30 L18 26 L18 54 L42 54 L42 26 L48 30 L54 19 L42 10 Q30 19 18 10Z';
export function swatch(item, look) {
  const c = item.color;
  const svg = (vb, body) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const rainbowDef = () => { const g = uid(); return [g, `<defs><linearGradient id="${g}">${RAINBOW.map((col, i) => `<stop offset="${i / 5}" stop-color="${col}"/>`).join('')}</linearGradient></defs>`]; };
  switch (item.kind) {
    case 'paint': {
      let fill = c, defs = '';
      if (item.rainbow) { const [g, d] = rainbowDef(); fill = `url(#${g})`; defs = d; }
      const glit = pts => item.glitter ? glitterDots(pts) : '';
      if (item.layer === 'lips') {
        return svg('0 0 60 60', `${defs}<rect x="20" y="31" width="20" height="24" rx="3" fill="#3a3550"/><rect x="22" y="23" width="16" height="10" rx="1" fill="#e8c25a"/>
          <path d="M24 23 L24 10 Q30 3 36 8 L36 23Z" fill="${fill}"/><path d="M27 21 L27 11" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>${glit([[30, 14], [33, 19], [27, 17]])}`);
      }
      if (item.layer === 'shadow') {
        return svg('0 0 60 60', `${defs}<circle cx="30" cy="30" r="24" fill="#f4eef7" stroke="#d9cfe3" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="${fill}"/>
          <path d="M18 24 Q22 16 30 14" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>${glit([[24, 32], [34, 26], [36, 38], [28, 40], [40, 32], [22, 24]])}`);
      }
      if (item.layer === 'blush') {
        return svg('0 0 60 60', `<circle cx="26" cy="32" r="22" fill="#f8e1ec" stroke="#e2b6cb" stroke-width="2"/><circle cx="26" cy="32" r="16" fill="${c}" opacity=".85"/>${glit([[20, 30], [30, 26], [32, 38], [24, 40]])}
          <g transform="rotate(35 46 18)"><rect x="43" y="14" width="6" height="26" rx="3" fill="#b07a4a"/><ellipse cx="46" cy="10" rx="7" ry="9" fill="#f4d6c4"/><ellipse cx="46" cy="6" rx="6" ry="5" fill="${c}" opacity=".7"/></g>`);
      }
      return svg('0 0 60 60', `${defs}<path d="M12 30 L48 30 L45 52 Q30 56 15 52Z" fill="#eef0f6" stroke="#c9cede" stroke-width="2"/><ellipse cx="30" cy="30" rx="18" ry="6" fill="${fill}"/>${glit([[24, 30], [34, 29], [30, 32]])}
        <g transform="rotate(25 40 14)"><rect x="38" y="2" width="4" height="26" rx="2" fill="#7a5ad0"/><path d="M37 26 L43 26 L40 34Z" fill="${fill}"/></g>`);
    }
    case 'remover':
      return svg('0 0 60 60', `<circle cx="30" cy="32" r="21" fill="#fff" stroke="#dde3ee" stroke-width="2"/>
        ${[[22, 26], [32, 22], [38, 32], [28, 38], [20, 36], [34, 42]].map(([x, y]) => circle(x, y, 2.4, 'fill="#e9eef7"')).join('')}
        <path d="M18 14 Q30 4 42 14" stroke="#7fc8ff" stroke-width="3" fill="none" stroke-linecap="round"/><text x="30" y="56" font-size="0">wipe</text>`);
    case 'scissors':
      return svg('0 0 60 60', `<g transform="rotate(-40 30 30)">
        <path d="M28 2 L34 33 L29 35Z" fill="#dfe5ee" stroke="#8a94a6" stroke-width="1.4"/><path d="M32 2 L26 33 L31 35Z" fill="#cfd6e0" stroke="#8a94a6" stroke-width="1.4"/>
        <circle cx="23" cy="45" r="7.5" fill="none" stroke="#ff5fa2" stroke-width="4.5"/><circle cx="37" cy="45" r="7.5" fill="none" stroke="#ff5fa2" stroke-width="4.5"/>
        <path d="M27 35 L24 38 M33 35 L36 38" stroke="#ff5fa2" stroke-width="4"/><circle cx="30" cy="33" r="2.2" fill="#6b7385"/></g>`);
    case 'grow':
      return svg('0 0 60 60', `<rect x="24" y="2" width="12" height="7" rx="2" fill="#b07a4a"/>
        <path d="M24 9 L36 9 L36 18 Q48 26 48 40 Q48 55 30 55 Q12 55 12 40 Q12 26 24 18Z" fill="#e8f8ff" stroke="#8ec5dc" stroke-width="2"/>
        <path d="M14 38 Q30 32 46 38 Q46 53 30 53 Q14 53 14 38Z" fill="#b56cff"/>${circle(24, 44, 3, 'fill="#fff" opacity=".6"')}${circle(34, 47, 2, 'fill="#fff" opacity=".6"')}
        <g transform="translate(46 12)">${shape('sparkle', 7, '#fff1a8')}</g>`);
    case 'masc':
      return svg('0 0 60 60', `<g transform="rotate(-35 30 30)"><rect x="26" y="2" width="8" height="28" rx="4" fill="${c}"/><rect x="28.8" y="30" width="2.4" height="8" fill="#999"/>
        <rect x="25" y="37" width="10" height="20" rx="5" fill="#222"/>
        ${[40, 44, 48, 52].map(y => `<line x1="21" y1="${y}" x2="39" y2="${y}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g>`);
    case 'liner':
      return svg('0 0 60 60', `<path d="M8 44 Q24 30 44 40 L54 32" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${item.glitter ? glitterDots([[20, 38], [32, 35], [46, 37]]) : ''}
        <g transform="rotate(45 30 20)"><rect x="26" y="-2" width="8" height="30" rx="2" fill="#3a3550"/><path d="M26 28 L34 28 L30 36Z" fill="${c}"/></g>`);
    case 'sticker': case 'bow': case 'clip': case 'flower': case 'bobble':
      return svg('-32 -32 64 64', drawThing(item));
    case 'freckles': {
      const sk = SKINS[look.skin] || SKINS.s2;
      return svg('0 0 60 60', `<circle cx="30" cy="30" r="25" fill="${sk.base}" stroke="${sk.shade}" stroke-width="2"/>` +
        [[20, 30], [26, 36], [18, 38], [40, 30], [34, 36], [42, 38], [30, 28]].map(([x, y]) => circle(x, y, 2.2, `fill="${sk.shade}"`)).join(''));
    }
    case 'ext': {
      const cols = item.rainbow ? RAINBOW : [c];
      const w = item.rainbow ? 4 : 12;
      return svg('0 0 60 60', `<rect x="18" y="4" width="24" height="7" rx="3" fill="#bbb"/>` +
        cols.map((col, j) => `<path d="M${24 + j * w - (cols.length - 1) * w / 2 + 6 - w / 2} 10 Q${14 + j * w} 30 ${30 + j * w - (cols.length - 1) * w / 2} 56" stroke="${col}" stroke-width="${w + 1}" fill="none" stroke-linecap="round"/>`).join('') +
        (c === '#ffffff' ? `<path d="M30 10 Q14 30 30 56" stroke="#ccc" stroke-width="1" fill="none"/>` : ''));
    }
    case 'ear':
      return svg('-26 -6 52 56', earring(item));
    case 'neck':
      return svg('150 322 100 100', `<path d="M172 300 L172 372 Q200 384 228 372 L228 300Z" fill="#f3dccd"/>${necklace(item)}`);
    case 'head':
      return svg('84 18 232 200', `<ellipse cx="200" cy="210" rx="92" ry="108" fill="#f3dccd"/>${headwear(item)}`);
    case 'specs':
      return svg('100 176 200 84', `<ellipse cx="200" cy="230" rx="96" ry="60" fill="#f3dccd"/>${glassesSvg(item)}`);
    case 'bot':
      return renderGirl({ ...look, bottom: item.id, dress: null, bag: null, paint: [] }, { viewBox: '30 600 340 450', noPlaced: true, lite: true });
    case 'dress':
      return renderGirl({ ...look, dress: item.id, bag: null, paint: [] }, { viewBox: '-20 330 440 720', noPlaced: true, lite: true });
    case 'sock':
      return renderGirl({ ...look, socks: item.id, shoes: null, bottom: null, dress: null, paint: [] }, { viewBox: '100 680 200 370', noPlaced: true, lite: true });
    case 'shoe':
      return svg('112 940 176 110', `<g fill="#f3dccd">${both(`<path d="${LEG}"/>`).join('')}${both('<ellipse cx="152" cy="1022" rx="22" ry="11"/>').join('')}</g>${shoeSvg(item)}<g ${MIRROR}>${shoeSvg(item)}</g>`);
    case 'bag':
      return svg('290 730 94 120', `<ellipse cx="331" cy="738" rx="14" ry="20" fill="#f3dccd"/>${bagSvg(item)}`);
    case 'brace':
      return svg('44 690 50 50', `<path d="M56 690 L82 690 L82 720 L56 720Z" fill="#f3dccd"/><ellipse cx="69" cy="732" rx="14" ry="16" fill="#f3dccd"/>${braceletSvg(item)}`);
    case 'topStyle':
      return renderGirl({ ...look, topStyle: item.value, dress: null, necklace: null, bag: null, paint: [] }, { viewBox: '20 300 360 420', noPlaced: true, lite: true });
    case 'topColor':
      return svg('0 0 60 60', `<path d="${TEE}" fill="${c}" stroke="${mix(c, '#000', .25)}" stroke-width="2" stroke-linejoin="round"/>`);
    case 'topPattern': {
      const col = TOP_COLORS[look.topColor] || TOP_COLORS.pink;
      const ink = item.value === 'leopard' ? '#000' : lum(col) > .78 ? '#ff6fb0' : '#fff';
      const p = uid();
      return svg('0 0 60 60', `<defs>${patternDef(item.value, ink, p, .45)}</defs><path d="${TEE}" fill="${col}"/>` +
        (item.value !== 'plain' ? `<path d="${TEE}" fill="url(#${p})"/>` : '') +
        `<path d="${TEE}" fill="none" stroke="${mix(col, '#000', .25)}" stroke-width="2" stroke-linejoin="round"/>`);
    }
    case 'hairStyle':
      return renderGirl({ ...look, hairStyle: item.value, headwear: null, glasses: null, extensions: [], cut: null, paint: [] }, { viewBox: '0 0 400 520', noPlaced: true, lite: true });
    case 'hairColor':
      return renderGirl({ ...look, hairColor: item.value, headwear: null, glasses: null, paint: [] }, { viewBox: '50 30 300 330', noPlaced: true, lite: true });
  }
  return '';
}
