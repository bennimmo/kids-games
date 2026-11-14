// Draws the girl and every item as SVG strings.
// The girl lives in a 400 x 520 box: face centre (200, 210), eyes at (160|240, 215), ears at x 106 / 294.
import { HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS, SKINS, ITEMS, RAINBOW, TOP_COLORS } from './items.js';

let n = 0;
const uid = () => `bb${++n}`;
const MIRROR = 'transform="translate(400 0) scale(-1 1)"';
// An element plus its mirror image (for things on both sides of the head).
const both = el => [el, el.replace(/^<(\w+)/, `<$1 ${MIRROR}`)];
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

// ---------- body and tops ----------
const BODY = 'M172 300 L172 372 C168 390 152 398 128 405 C84 418 62 452 58 520 L342 520 C338 452 316 418 272 405 C248 398 232 390 228 372 L228 300Z';
const CREW = 'M0 520 L0 385 L162 385 Q200 418 238 385 L400 385 L400 520Z';

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
  }
  return '';
}

function topSvg(look, id, defs) {
  const style = look.topStyle || 'tee';
  const col = TOP_COLORS[look.topColor] || TOP_COLORS.pink;
  const pat = look.topPattern && look.topPattern !== 'plain' ? look.topPattern : null;
  const dark = mix(col, '#000', .22);
  const light = mix(col, '#fff', .45);
  const ink = pat === 'leopard' ? '#000' : lum(col) > .78 ? '#ff6fb0' : '#ffffff';
  const bodyClip = `${id}bc`;
  defs.push(`<clipPath id="${bodyClip}"><path d="${BODY}"/></clipPath>`);
  const patId = `${id}p`;
  if (pat) defs.push(patternDef(pat, ink, patId));
  const shadeId = `${id}ts`;
  defs.push(`<linearGradient id="${shadeId}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".28" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`);
  const lightId = `${id}tl`;
  defs.push(`<linearGradient id="${lightId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>`);

  const fillMain = d => `<path d="${d}" fill="${col}"/>` + (pat ? `<path d="${d}" fill="url(#${patId})"/>` : '') +
    `<path d="${d}" fill="url(#${shadeId})"/><path d="${d}" fill="url(#${lightId})"/>`;
  const under = d => `<path d="${d}" fill="#fafafc"/><path d="${d}" fill="url(#${shadeId})"/>`;
  const rib = (d, w = 5) => `<path d="${d}" stroke="${dark}" stroke-width="${w}" fill="none" stroke-linejoin="round"/>`;
  const seams = both(`<path d="M110 410 Q96 455 94 520" stroke="${dark}" stroke-width="2" fill="none" opacity=".45"/>`).join('');
  const folds = `<path d="M146 470 Q156 492 148 518" stroke="${dark}" stroke-width="2" fill="none" opacity=".3"/><path d="M258 462 Q248 488 256 516" stroke="${dark}" stroke-width="2" fill="none" opacity=".3"/>`;
  const scallops = (pts, r, fill) => pts.map(([x, y]) => circle(x, y, r, `fill="${fill}" stroke="${mix(fill, '#000', .15)}" stroke-width="1"`)).join('');

  let inside = '', after = '';
  switch (style) {
    case 'vneck':
      inside = fillMain('M0 520 L0 385 L164 385 L200 440 L236 385 L400 385 L400 520Z') + rib('M164 385 L200 440 L236 385') + seams + folds; break;
    case 'tank':
      inside = fillMain('M58 520 L66 452 Q100 440 128 446 L128 398 L150 398 L152 430 Q200 470 248 430 L250 398 L272 398 L272 446 Q300 440 334 452 L342 520Z') +
        rib('M152 430 Q200 470 248 430', 4) + folds; break;
    case 'offshoulder': {
      const d = 'M0 520 L0 452 Q100 436 200 444 Q300 436 400 452 L400 520Z';
      const pts = []; for (let x = 50; x <= 350; x += 14) pts.push([x, 446 - Math.cos((x - 200) / 160) * 2 + (x % 28 ? 2 : 0)]);
      inside = fillMain(d) + scallops(pts, 9, light) + folds; break;
    }
    case 'polo':
      inside = fillMain('M0 520 L0 386 L170 386 L170 334 L230 334 L230 386 L400 386 L400 520Z') +
        [342, 354, 366, 378].map(y => `<path d="M170 ${y} Q200 ${y + 9} 230 ${y}" stroke="${dark}" stroke-width="2.4" fill="none" opacity=".55"/>`).join('') + seams + folds; break;
    case 'hoodie':
      inside = fillMain(CREW) + seams +
        `<path d="M150 478 L250 478 L256 520 L144 520Z" fill="none" stroke="${dark}" stroke-width="3"/>`;
      after = `<path d="M146 398 Q150 362 174 356 L174 378 Q200 410 226 378 L226 356 Q250 362 254 398 Q200 432 146 398Z" fill="${dark}"/>` +
        `<path d="M158 396 Q200 424 242 396" stroke="${mix(col, '#000', .4)}" stroke-width="2" fill="none" opacity=".5"/>` +
        `<path d="M186 410 L182 452 M214 410 L218 452" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` + circle(182, 455, 3.5, 'fill="#fff"') + circle(218, 455, 3.5, 'fill="#fff"');
      break;
    case 'collar':
      inside = fillMain(CREW) + seams + folds +
        both(`<path d="M200 410 Q170 424 152 396 Q160 386 164 385 Q184 404 200 410Z" fill="#fff" stroke="#ddd" stroke-width="1.5"/>`).join('') +
        [430, 456, 482, 508].map(y => circle(200, y, 3.5, `fill="${light}" stroke="${dark}" stroke-width="1"`)).join('');
      break;
    case 'frill': {
      const pts = []; for (let t = -.08; t <= 1.08; t += .08) { const [x, y] = quad([162, 385], [200, 418], [238, 385], t); pts.push([x, y + 7]); }
      inside = fillMain(CREW) + seams + folds + scallops(pts, 9, light) + scallops(pts.map(([x, y]) => [x, y - 2]), 4, '#fff');
      break;
    }
    case 'party': {
      const d = 'M58 520 L64 450 Q100 438 146 444 Q170 420 200 446 Q230 420 254 444 Q300 438 336 450 L342 520Z';
      const pts = []; for (let t = 0; t <= 1.001; t += .1) pts.push(quad([146, 444], [170, 420], [200, 446], t), quad([200, 446], [230, 420], [254, 444], t));
      inside = fillMain(d) + both(`<path d="M150 442 L146 400" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`).join('') +
        pts.map(([x, y], i) => circle(x, y + 2, 2.2, `fill="${i % 2 ? '#fff' : '#ffe08a'}"`)).join('') + folds;
      break;
    }
    case 'dungarees':
      inside = under(CREW) + rib('M162 385 Q200 418 238 385', 4).replace(dark, '#ddd') + seams.replaceAll(dark, '#ccc') +
        fillMain('M148 440 L252 440 L256 494 L400 494 L400 520 L0 520 L0 494 L144 494Z') +
        `<path d="M157 444 L136 400 M243 444 L264 400" stroke="${col}" stroke-width="15"/>` +
        `<path d="M157 444 L136 400 M243 444 L264 400" stroke="${dark}" stroke-width="15" opacity=".25"/>` +
        `<rect x="176" y="456" width="48" height="30" rx="4" fill="none" stroke="${dark}" stroke-width="2.5" stroke-dasharray="4 3"/>` +
        circle(157, 446, 4.5, 'fill="#f5c542" stroke="#c99a10" stroke-width="1"') + circle(243, 446, 4.5, 'fill="#f5c542" stroke="#c99a10" stroke-width="1"');
      break;
    case 'cardigan':
      inside = under(CREW) + rib('M162 385 Q200 418 238 385', 4).replace(dark, '#ddd') +
        fillMain('M0 520 L0 385 L158 385 Q166 410 182 440 L190 520Z M400 520 L400 385 L242 385 Q234 410 218 440 L210 520Z') +
        rib('M158 385 Q166 410 182 440 L190 520', 4) + rib('M242 385 Q234 410 218 440 L210 520', 4) +
        [452, 478, 504].map(y => circle(186 + (y - 452) * .06, y, 4, `fill="${light}" stroke="${dark}" stroke-width="1"`)).join('') + seams;
      break;
    default: // tee
      inside = fillMain(CREW) + rib('M162 385 Q200 418 238 385') + seams + folds;
  }
  return `<g clip-path="url(#${bodyClip})">${inside}</g>${after}`;
}

// ---------- the girl ----------
export function renderGirl(look, opts = {}) {
  const id = uid();
  const c = HAIR_COLORS[look.hairColor] || HAIR_COLORS.brown;
  const skin = SKINS[look.skin] || SKINS.s2;
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  const eyeCol = EYE_COLORS[look.eyeColor] || EYE_COLORS.blue;
  const it = k => (look[k] && ITEMS[look[k]]) || null;
  const masc = it('mascara'), liner = it('eyeliner'), ear = it('earrings'), neck = it('necklace'), head = it('headwear'), specs = it('glasses');
  const exts = (look.extensions || []).map(v => ITEMS['ext-' + v]).filter(Boolean);
  const paint = look.paint || [];
  const defs = [];

  // Gradients and clips
  const hg = `${id}h`, rb = `${id}r`;
  defs.push(`<linearGradient id="${hg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.light}"/><stop offset=".42" stop-color="${c.base}"/><stop offset="1" stop-color="${mix(c.base, c.shade, .75)}"/></linearGradient>`);
  defs.push(`<linearGradient id="${rb}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="56" y2="0" spreadMethod="repeat">${RAINBOW.map((col, i) => `<stop offset="${r1(i / 5 * 100) / 100}" stop-color="${col}"/>`).join('')}</linearGradient>`);
  defs.push(`<radialGradient id="${id}fs" cx=".5" cy=".42" r=".62"><stop offset=".55" stop-color="${skin.shade}" stop-opacity="0"/><stop offset="1" stop-color="${skin.shade}" stop-opacity=".6"/></radialGradient>`);
  defs.push(`<radialGradient id="${id}ig" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${mix(eyeCol, '#fff', .35)}"/><stop offset=".6" stop-color="${eyeCol}"/><stop offset="1" stop-color="${mix(eyeCol, '#000', .4)}"/></radialGradient>`);
  defs.push(`<radialGradient id="${id}ck" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7a8a" stop-opacity=".22"/><stop offset="1" stop-color="#ff7a8a" stop-opacity="0"/></radialGradient>`);
  defs.push(`<linearGradient id="${id}bs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${skin.shade}" stop-opacity=".7"/><stop offset=".3" stop-color="${skin.shade}" stop-opacity="0"/><stop offset=".7" stop-color="${skin.shade}" stop-opacity="0"/><stop offset="1" stop-color="${skin.shade}" stop-opacity=".7"/></linearGradient>`);
  for (const [k, sd] of [['b6', 6], ['b2', 2.2], ['b1', .6], ['b3', 3]]) {
    defs.push(`<filter id="${id}${k}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`);
  }
  const almond = (cx, cy) => `M${cx - 22} ${cy} Q${cx} ${cy - 26} ${cx + 22} ${cy} Q${cx} ${cy + 20} ${cx - 22} ${cy}Z`;
  const upperLip = 'M174 281 Q186 270 200 276 Q214 270 226 281 Q200 286 174 281Z';
  const lowerLip = 'M174 281 Q200 286 226 281 Q214 299 200 299 Q186 299 174 281Z';
  const lid = cx => `M${cx - 31} 216 L${cx - 22} 215 Q${cx} 189 ${cx + 22} 215 L${cx + 31} 216 Q${cx + 30} 180 ${cx} 177 Q${cx - 30} 180 ${cx - 31} 216Z`;
  defs.push(`<clipPath id="${id}ec"><path d="${almond(160, 215)}"/><path d="${almond(240, 215)}"/></clipPath>`);
  defs.push(`<clipPath id="${id}fc"><ellipse cx="200" cy="210" rx="92" ry="108"/></clipPath>`);
  defs.push(`<clipPath id="${id}lc"><path d="${upperLip}"/><path d="${lowerLip}"/></clipPath>`);
  defs.push(`<clipPath id="${id}dc"><path d="${lid(160)}"/><path d="${lid(240)}"/></clipPath>`);

  // Hair
  const hp = hairParts(look.hairStyle, L, c, `fill="url(#${hg})"`);
  const layer = shapes => {
    if (!shapes.length) return '';
    let out = `<g stroke="${c.shade}" stroke-width="2.2" stroke-linejoin="round">${shapes.join('')}</g>`;
    if (exts.length) {
      const cid = uid();
      out += `<clipPath id="${cid}">${shapes.join('')}</clipPath><g clip-path="url(#${cid})" opacity=".92">${stripes(exts)}</g>`;
    }
    return out;
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
  const eye = (cx, cy, s) => {
    const p0 = [cx - 22, cy], cc = [cx, cy - 26], p2 = [cx + 22, cy];
    const ts = masc ? [.42, .54, .66, .78, .9, 1] : [.62, .76, .9, 1];
    const len = masc ? 11 : 6.5;
    let lashes = '';
    for (const t0 of ts) {
      const t = s > 0 ? t0 : 1 - t0;
      const [x, y] = quad(p0, cc, p2, t);
      const dx = s * (.2 + (t0 - .5) * 1.5), dy = -1, m = Math.hypot(dx, dy);
      const ex = x + dx / m * len, ey = y + dy / m * len;
      lashes += `<path d="M${r1(x)} ${r1(y)} Q${r1(x + dx / m * len * .3)} ${r1(ey + 1)} ${r1(ex)} ${r1(ey)}" fill="none"/>`;
    }
    const outer = s > 0 ? cx + 22 : cx - 22;
    const linerSvg = liner ? `<path d="M${cx - 22} ${cy - 1} Q${cx} ${cy - 27} ${cx + 22} ${cy - 1} M${outer} ${cy - 1} L${outer + s * 11} ${cy - 9}" stroke="${liner.color}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      (liner.glitter ? glitterDots([[cx - 10, cy - 12], [cx + 6, cy - 13], [outer + s * 6, cy - 6]]) : '') : '';
    return `<path d="M${cx - 17} ${cy - 13} Q${cx} ${cy - 25} ${cx + 17} ${cy - 13}" stroke="${skin.shade}" stroke-width="1.8" fill="none" opacity=".7"/>
    <g class="bb-eye">
      <path d="${almond(cx, cy)}" fill="#fdfcfb"/>
      <g clip-path="url(#${id}ec)">
        ${circle(cx, cy - 1, 11.5, `fill="url(#${id}ig)"`)}${circle(cx, cy - 1, 11.5, 'fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1.5"')}
        ${circle(cx, cy - 1, 5.3, 'fill="#1a1414"')}${circle(cx + 4, cy - 5, 3.2, 'fill="#fff"')}${circle(cx - 4, cy + 3, 1.4, 'fill="#fff" opacity=".8"')}
        <path d="M${cx - 22} ${cy} Q${cx} ${cy - 26} ${cx + 22} ${cy} Q${cx} ${cy - 14} ${cx - 22} ${cy}Z" fill="rgba(60,30,30,.16)"/>
      </g>
      <path d="M${cx - 22} ${cy} Q${cx} ${cy - 26} ${cx + 22} ${cy}" fill="none" stroke="#2a1d1d" stroke-width="3" stroke-linecap="round"/>
      ${linerSvg}
      <g stroke="${masc ? masc.color : '#2a1d1d'}" stroke-width="${masc ? 3 : 1.8}" stroke-linecap="round">${lashes}</g>
    </g>
    <path d="M${cx - 18} ${cy + 6} Q${cx} ${cy + 12} ${cx + 18} ${cy + 6}" stroke="${skin.shade}" stroke-width="1.5" fill="none" opacity=".7"/>
    <path d="M${cx - s * 19} ${cy - 30} L${cx - s * 19} ${cy - 36} Q${cx + s * 2} ${cy - 47} ${cx + s * 22} ${cy - 34} Q${cx + s * 2} ${cy - 41} ${cx - s * 19} ${cy - 30}Z" fill="${browCol}"/>`;
  };

  const freckles = look.freckles
    ? glitterDots([[176, 250], [184, 258], [170, 260], [224, 250], [216, 258], [230, 260], [192, 244], [208, 244], [164, 252], [236, 252]], mix(skin.shade, '#5a3020', .3))
    : '';

  const lips = `<path d="${upperLip}" fill="${mix(skin.lip, '#000', .12)}"/><path d="${lowerLip}" fill="${skin.lip}"/>
    ${paintLayer('lips', `${id}lc`, 'b1')}
    <path d="M174 281 Q200 286 226 281" stroke="rgba(60,20,20,.35)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    ${circle(174, 281, 1.6, `fill="${skin.shade}"`)}${circle(226, 281, 1.6, `fill="${skin.shade}"`)}
    <ellipse cx="206" cy="290" rx="8" ry="2.4" fill="#fff" opacity=".35"/>`;

  const earringSvg = ear
    ? `<g transform="translate(106 244)">${earring(ear)}</g><g transform="translate(294 244) scale(-1 1)">${earring(ear)}</g>`
    : '';

  const placed = opts.noPlaced ? '' : (look.placed || []).map(p => {
    const item = ITEMS[p.item];
    if (!item) return '';
    return `<g class="bb-placed" data-placed="${p.key}" transform="translate(${r1(p.x)} ${r1(p.y)})">${drawThing(item)}</g>`;
  }).join('');

  const body = `<path d="${BODY}" fill="${skin.base}"/><path d="${BODY}" fill="url(#${id}bs)"/>
    ${both(`<path d="M150 398 Q168 404 186 399" stroke="${skin.shade}" stroke-width="2" fill="none" opacity=".55"/>`).join('')}
    <ellipse cx="200" cy="320" rx="36" ry="13" fill="${skin.shade}" opacity=".5" filter="url(#${id}b3)"/>`;

  const ears = both(`<ellipse cx="106" cy="222" rx="13" ry="22" fill="${skin.base}" stroke="${skin.shade}" stroke-width="1.6"/>`).join('') +
    both(`<path d="M104 208 Q96 222 106 236" stroke="${skin.shade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('');

  const face = `<ellipse cx="200" cy="210" rx="92" ry="108" fill="${skin.base}" stroke="${mix(skin.shade, '#000', .05)}" stroke-width="1.5"/>
    <ellipse cx="200" cy="210" rx="92" ry="108" fill="url(#${id}fs)"/>
    ${both(`<ellipse cx="142" cy="262" rx="30" ry="22" fill="url(#${id}ck)"/>`).join('')}`;

  const nose = `<path d="M194 228 Q190 244 193 252" stroke="${skin.shade}" stroke-width="2" fill="none" opacity=".35" stroke-linecap="round"/>
    <path d="M189 253 Q194 259 199 256 M201 256 Q206 259 211 253" stroke="${skin.shade}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${circle(201, 247, 3.5, 'fill="#fff" opacity=".22"')}`;

  const topStr = topSvg(look, id, defs); // adds to defs, so it must run before defs are joined
  return `<svg viewBox="${opts.viewBox || '0 0 400 520'}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" data-rainbow="${rb}">
  <defs>${defs.join('')}</defs>
  ${cutOpen}${layer(hp.back)}${hp.backDeco.join('')}${cutClose}
  ${body}
  ${topStr}
  ${neck ? necklace(neck) : ''}
  ${cutOpen}${layer(hp.strand)}${cutClose}
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
  ${layer(hp.front)}${hp.deco.join('')}${ties}
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
    case 'topStyle':
      return renderGirl({ ...look, topStyle: item.value, necklace: null, paint: [] }, { viewBox: '40 296 320 224', noPlaced: true });
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
      return renderGirl({ ...look, hairStyle: item.value, headwear: null, glasses: null, extensions: [], cut: null, paint: [] }, { viewBox: '0 0 400 520', noPlaced: true });
    case 'hairColor':
      return renderGirl({ ...look, hairColor: item.value, headwear: null, glasses: null, paint: [] }, { viewBox: '50 30 300 330', noPlaced: true });
  }
  return '';
}
