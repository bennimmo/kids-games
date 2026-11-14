// Draws the girl and every item as SVG strings.
// The girl lives in a 400 x 520 box: face centre (200, 210), ears at x 106 / 294.
import { HAIR_COLORS, HAIR_LENGTHS, EYE_COLORS, SKINS, ITEMS, RAINBOW } from './items.js';

let n = 0;
const uid = () => `bb${++n}`;
const MIRROR = 'transform="translate(400 0) scale(-1 1)"';
// An element plus its mirror image (for things on both sides of the head).
const both = el => [el, el.replace(/^<(\w+)/, `<$1 ${MIRROR}`)];
const r1 = v => Math.round(v * 10) / 10;
const circle = (x, y, r, extra = '') => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" ${extra}/>`;
const quad = (p0, c, p2, t) => [
  (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p2[1],
];
const cubic = (p0, c1, c2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map(i => u * u * u * p0[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * p3[i]);
};

const HEART = 'M0 .35C-.1 .25-.5 0-.5-.25C-.5-.5-.15-.6 0-.35C.15-.6 .5-.5 .5-.25C.5 0 .1 .25 0 .35Z';
const heart = (x, y, s, fill, extra = '') =>
  `<path transform="translate(${r1(x)} ${r1(y)}) scale(${s})" d="${HEART}" fill="${fill}" vector-effect="non-scaling-stroke" ${extra}/>`;
function star(x, y, r, fill, extra = '') {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${r1(x + Math.cos(a) * rr)},${r1(y + Math.sin(a) * rr)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke-linejoin="round" ${extra}/>`;
}
const gem = (x, y, r, fill) =>
  `<polygon points="${x},${y - r} ${r1(x + r * .8)},${r1(y - r * .2)} ${x},${y + r} ${r1(x - r * .8)},${r1(y - r * .2)}" fill="${fill}" stroke="#fff" stroke-width="1.5"/>` +
  `<polygon points="${x},${y - r} ${r1(x + r * .35)},${r1(y - r * .2)} ${x},${r1(y + r * .5)} ${r1(x - r * .35)},${r1(y - r * .2)}" fill="#fff" opacity=".45"/>`;
const butterfly = (s, fill) => `<g transform="scale(${s})">
  <ellipse cx="-8" cy="-6" rx="8" ry="10" transform="rotate(-35 -8 -6)" fill="${fill}"/>
  <ellipse cx="8" cy="-6" rx="8" ry="10" transform="rotate(35 8 -6)" fill="${fill}"/>
  <ellipse cx="-6" cy="7" rx="5" ry="7" transform="rotate(30 -6 7)" fill="${fill}" opacity=".85"/>
  <ellipse cx="6" cy="7" rx="5" ry="7" transform="rotate(-30 6 7)" fill="${fill}" opacity=".85"/>
  <circle cx="-8" cy="-7" r="2.6" fill="#fff" opacity=".7"/><circle cx="8" cy="-7" r="2.6" fill="#fff" opacity=".7"/>
  <rect x="-1.6" y="-12" width="3.2" height="22" rx="1.6" fill="#3b2a4a"/></g>`;
function flowerShape(s, fill, centre = '#ffd23f') {
  let out = `<g transform="scale(${s})">`;
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5 - Math.PI / 2;
    out += circle(Math.cos(a) * 9, Math.sin(a) * 9, 8, `fill="${fill}" stroke="rgba(0,0,0,.12)" stroke-width="1"`);
  }
  return out + circle(0, 0, 5.5, `fill="${centre}"`) + '</g>';
}
const glitterDots = (pts, color = '#fff') => pts.map(([x, y], i) => circle(x, y, i % 3 ? 1.3 : 2, `fill="${color}" opacity=".9"`)).join('');

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

function hairParts(style, L, c) {
  const P = { back: [], backDeco: [], strand: [], front: [], deco: [], ties: [] };
  const f = `fill="${c.base}"`;
  const back = len => `<path ${f} d="M200 78 C95 78 66 160 74 ${len - 30} Q76 ${len} 112 ${len} L288 ${len} Q324 ${len} 326 ${len - 30} C334 160 305 78 200 78Z"/>`;
  const fringe = `<path ${f} d="M102 240 C85 30 315 30 298 240 Q292 165 262 140 Q220 172 168 148 Q140 166 126 152 Q108 175 102 240Z"/>`;
  const slick = `<path ${f} d="M106 214 C88 42 312 42 294 214 Q286 150 252 128 Q200 116 148 128 Q114 150 106 214Z"/>`;
  const strand = len => `<path ${f} d="M108 185 C84 250 74 ${len - 50} 80 ${len} Q100 ${len + 10} 122 ${len - 4} C116 ${len - 70} 120 300 128 250Z"/>`;
  const shine = d => `<path d="${d}" stroke="${c.light}" stroke-width="6" stroke-linecap="round" fill="none" opacity=".6"/>`;
  const swirl = (x, y, r) => `<path d="M${x - r * .6} ${y} Q${x} ${y - r * .8} ${x + r * .6} ${y} Q${x} ${y + r * .5} ${x - r * .3} ${y + r * .1}" stroke="${c.shade}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const fringeShine = shine('M140 108 Q200 86 260 108');

  switch (style) {
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
    case 'ponytail': {
      P.back.push(`<path ${f} d="M236 100 C330 66 360 ${r1(L * .55)} 332 ${L} Q318 ${L + 14} 302 ${L - 6} C318 ${r1(L * .62)} 300 170 252 124Z"/>`);
      P.front.push(slick);
      P.deco.push(shine('M150 100 Q190 84 230 92'));
      P.ties.push([248, 104]);
      break;
    }
    case 'pigtails': {
      P.back.push(...both(`<path ${f} d="M114 178 C56 168 34 ${r1(L * .62)} 52 ${L} Q66 ${L + 12} 84 ${L - 4} C70 ${r1(L * .66)} 80 252 114 214Z"/>`));
      P.front.push(fringe);
      P.deco.push(fringeShine);
      P.ties.push([110, 196], [290, 196]);
      break;
    }
    case 'bun': {
      P.back.push(circle(200, 70, 44, f));
      P.backDeco.push(swirl(200, 62, 30));
      P.front.push(slick);
      P.deco.push(shine('M150 100 Q200 82 250 100'));
      break;
    }
    case 'spacebuns': {
      P.back.push(circle(126, 96, 36, f), circle(274, 96, 36, f));
      P.backDeco.push(swirl(122, 86, 24), swirl(270, 86, 24));
      P.front.push(fringe);
      P.deco.push(fringeShine);
      break;
    }
    case 'braids': {
      P.back.push(back(250));
      P.strand.push(...plait(100, 232, 98, L - 20, f));
      P.strand.push(...plait(300, 232, 302, L - 20, f));
      P.front.push(fringe);
      P.deco.push(fringeShine);
      P.ties.push([98, L - 16], [302, L - 16]);
      break;
    }
    case 'sidebraid': {
      P.back.push(back(260));
      P.strand.push(...plait(120, 214, 150, L - 20, f, 20));
      P.front.push(fringe);
      P.deco.push(fringeShine);
      P.ties.push([150, L - 16]);
      break;
    }
    default: { // hair down
      P.back.push(back(L));
      if (L > 300) P.strand.push(...both(strand(L)));
      P.front.push(fringe);
      P.deco.push(fringeShine);
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
  const line = 'stroke="rgba(0,0,0,.22)" stroke-width="1.5"';
  switch (it.kind) {
    case 'bow':
      return `<g ${line}>
        <path d="M-3 4 L-12 24 L-5 21 L0 26Z" fill="${c}"/><path d="M3 4 L12 24 L5 21 L0 26Z" fill="${c}"/>
        <path d="M0 0 L-25 -15 Q-32 0 -25 15Z" fill="${c}"/><path d="M0 0 L25 -15 Q32 0 25 15Z" fill="${c}"/>
        <circle r="6.5" fill="${c}"/></g>
        <path d="M-20 -8 Q-24 0 -20 6" stroke="#fff" stroke-width="2.5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    case 'clip': {
      const bar = `<rect x="-17" y="-3.5" width="34" height="7" rx="3.5" fill="#e6e1ea" stroke="#b9b1c4" stroke-width="1"/>`;
      if (it.shape === 'heart') return bar + heart(0, 2, 26, c, line);
      if (it.shape === 'star') return bar + star(0, 0, 14, c, line);
      return bar + butterfly(1, c);
    }
    case 'flower':
      return flowerShape(1.1, c);
    case 'bobble':
      return `<rect x="-11" y="-3" width="22" height="6" rx="3" fill="#7a5a8a"/>
        ${circle(-11, 0, 9, `fill="${c}" ${line}`)}${circle(11, 0, 9, `fill="${c}" ${line}`)}
        ${circle(-13, -3, 2.6, 'fill="#fff" opacity=".7"')}${circle(9, -3, 2.6, 'fill="#fff" opacity=".7"')}`;
    case 'sticker':
      switch (it.shape) {
        case 'heart': return heart(0, 2, 24, c, 'stroke="#fff" stroke-width="2"');
        case 'star': return star(0, 0, 12, c, 'stroke="#fff" stroke-width="1.5"');
        case 'gem': return gem(0, 0, 11, c);
        case 'butterfly': return butterfly(.8, c);
        case 'flower': return flowerShape(.7, c);
        case 'rainbow':
          return RAINBOW.slice(0, 5).map((col, i) =>
            `<path d="M${-14 + i * 2.6} 6 A${14 - i * 2.6} ${14 - i * 2.6} 0 0 1 ${14 - i * 2.6} 6" stroke="${col}" stroke-width="2.8" fill="none"/>`).join('');
      }
  }
  return '';
}

// Earrings are drawn at the ear lobe, (0, 0).
function earring(it) {
  const c = it.color;
  const hook = len => `<line x1="0" y1="0" x2="0" y2="${len}" stroke="#d8b23a" stroke-width="1.6"/>`;
  switch (it.shape) {
    case 'pearl': return circle(0, 2, 6, 'fill="#fff" stroke="#d8d0e0" stroke-width="1.5"') + circle(-2, 0, 1.8, 'fill="#fff"');
    case 'diamond': return gem(0, 2, 7, c);
    case 'hoop': return `<circle cx="0" cy="14" r="14" fill="none" stroke="${c}" stroke-width="3.6"/>`;
    case 'heart': return hook(9) + heart(0, 17, 18, c, 'stroke="#fff" stroke-width="1"');
    case 'star': return hook(8) + star(0, 17, 9, c, 'stroke="#fff" stroke-width="1"');
    case 'gem': return hook(8) + `<path d="M0 8 Q8 18 0 26 Q-8 18 0 8Z" fill="${c}" stroke="#fff" stroke-width="1.2"/>` + circle(-2, 17, 2, 'fill="#fff" opacity=".7"');
    case 'cherry': return `<path d="M0 0 Q2 8 -6 18 M0 0 Q4 10 6 20" stroke="#3c8a2e" stroke-width="1.8" fill="none"/>` +
      circle(-6, 20, 5.5, `fill="${c}"`) + circle(6, 22, 5.5, `fill="${c}"`) + circle(-7.5, 18.5, 1.6, 'fill="#fff" opacity=".7"');
  }
  return '';
}

function necklace(it) {
  const p0 = [168, 372], cc = [200, 420], p2 = [232, 372];
  const beads = (count, fn) => {
    let s = '';
    for (let i = 0; i <= count; i++) { const [x, y] = quad(p0, cc, p2, i / count); s += fn(x, y, i); }
    return s;
  };
  const chain = col => `<path d="M168 372 Q200 420 232 372" fill="none" stroke="${col}" stroke-width="2"/>`;
  switch (it.shape) {
    case 'pearls': return beads(12, (x, y) => circle(x, y, 5, 'fill="#fff" stroke="#cfc6db" stroke-width="1"'));
    case 'heart': return chain('#e8b923') + heart(200, 408, 26, it.color, 'stroke="#b88a10" stroke-width="1"');
    case 'rainbow': return beads(14, (x, y, i) => circle(x, y, 4.6, `fill="${RAINBOW[i % RAINBOW.length]}"`));
    case 'star': return chain('#c4cbd8') + star(200, 406, 12, it.color, 'stroke="#c99a10" stroke-width="1"');
    case 'choker': return `<path d="M172 338 Q200 350 228 338 L228 350 Q200 362 172 350Z" fill="${it.color}"/>` + gem(200, 360, 6, '#ff7ec0');
    case 'diamond': return chain('#c4cbd8') + gem(200, 406, 11, it.color);
    case 'sweets': return beads(10, (x, y, i) => `<rect x="${r1(x - 5)}" y="${r1(y - 4)}" width="10" height="8" rx="4" fill="${['#ffb3d9', '#b3e5ff', '#fff3a6', '#c7f5c4', '#e0c6ff'][i % 5]}" stroke="#fff" stroke-width="1"/>`);
  }
  return '';
}

function headwear(it) {
  const band = col => `<path d="M108 196 C96 64 304 64 292 196" stroke="${col}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  const arc = t => cubic([108, 196], [96, 64], [304, 64], [292, 196], t);
  switch (it.shape) {
    case 'band':
      return band(it.color) + `<path d="M130 120 C160 90 240 90 270 120" stroke="#fff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>`;
    case 'tiara':
      return `<path d="M150 104 L160 72 L178 92 L200 56 L222 92 L240 72 L250 104 Q200 92 150 104Z" fill="${it.color}" stroke="#c99a10" stroke-width="2" stroke-linejoin="round"/>` +
        gem(200, 84, 7, '#ff5fa2') + circle(160, 74, 3.5, 'fill="#7fdcff"') + circle(240, 74, 3.5, 'fill="#7fdcff"');
    case 'flowers': {
      let s = band('#5cb85c').replace('stroke-width="14"', 'stroke-width="6"');
      const cols = ['#ff8ac2', '#ffd23f', '#fff', '#c58af0', '#ff8ac2', '#ffd23f', '#fff'];
      cols.forEach((col, i) => { const [x, y] = arc(.08 + i * .14); s += `<g transform="translate(${r1(x)} ${r1(y)})">${flowerShape(.85, col, col === '#ffd23f' ? '#ff8a3d' : '#ffd23f')}</g>`; });
      return s;
    }
    case 'cat':
      return band(it.color) +
        `<path d="M122 120 L118 66 L162 92Z" fill="${it.color}"/><path d="M128 110 L126 78 L152 94Z" fill="#ff9ccf"/>` +
        `<path d="M278 120 L282 66 L238 92Z" fill="${it.color}"/><path d="M272 110 L274 78 L248 94Z" fill="#ff9ccf"/>`;
  }
  return '';
}

function topSvg(it) {
  const d = 'M40 520 Q46 410 140 392 Q200 440 260 392 Q354 410 360 520Z';
  if (!it) return `<path d="${d}" fill="#ffb3d9"/>`;
  let s = `<path d="${d}" fill="${it.color}" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
  if (it.rainbow) {
    const id = uid();
    s = `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">` +
      RAINBOW.map((col, i) => `<rect x="0" y="${392 + i * 22}" width="400" height="22" fill="${col}"/>`).join('') + '</g>';
  }
  if (it.glitter) {
    const pts = [[90, 470], [130, 430], [170, 480], [230, 470], [270, 430], [310, 480], [110, 505], [200, 500], [290, 505], [150, 455], [250, 455], [200, 455]];
    s += pts.map(([x, y], i) => star(x, y, i % 2 ? 5 : 7, '#fff', 'opacity=".85"')).join('');
  }
  return s;
}

// ---------- the girl ----------
export function renderGirl(look, opts = {}) {
  const c = HAIR_COLORS[look.hairColor] || HAIR_COLORS.brown;
  const skin = SKINS[look.skin] || SKINS.s2;
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  const eyeCol = EYE_COLORS[look.eyeColor] || EYE_COLORS.blue;
  const hp = hairParts(look.hairStyle, L, c);
  const exts = (look.extensions || []).map(v => ITEMS['ext-' + v]).filter(Boolean);
  const it = k => (look[k] && ITEMS[look[k]]) || null;
  const lip = it('lipstick'), shadow = it('eyeshadow'), masc = it('mascara'), blush = it('blush');
  const ear = it('earrings'), neck = it('necklace'), head = it('headwear'), top = it('top');

  const layer = shapes => {
    if (!shapes.length) return '';
    let out = `<g stroke="${c.shade}" stroke-width="2.5" stroke-linejoin="round">${shapes.join('')}</g>`;
    if (exts.length) {
      const id = uid();
      out += `<clipPath id="${id}">${shapes.join('')}</clipPath><g clip-path="url(#${id})" opacity=".92">${stripes(exts)}</g>`;
    }
    return out;
  };

  const defs = [];
  const eyeClip = uid();
  const almond = (cx, cy) => `M${cx - 22} ${cy} Q${cx} ${cy - 26} ${cx + 22} ${cy} Q${cx} ${cy + 20} ${cx - 22} ${cy}Z`;
  defs.push(`<clipPath id="${eyeClip}"><path d="${almond(160, 215)}"/><path d="${almond(240, 215)}"/></clipPath>`);

  // Eyeshadow
  let shadowSvg = '';
  if (shadow) {
    let fill = shadow.color;
    if (shadow.rainbow) {
      const g = uid();
      defs.push(`<linearGradient id="${g}">${RAINBOW.map((col, i) => `<stop offset="${i / (RAINBOW.length - 1)}" stop-color="${col}"/>`).join('')}</linearGradient>`);
      fill = `url(#${g})`;
    }
    for (const cx of [160, 240]) {
      shadowSvg += `<path d="M${cx - 28} 218 Q${cx} 152 ${cx + 28} 218Z" fill="${fill}" opacity=".85"/>`;
      if (shadow.glitter) shadowSvg += glitterDots([[cx - 14, 202], [cx - 4, 196], [cx + 8, 199], [cx + 16, 205], [cx, 204], [cx - 9, 207], [cx + 12, 190], [cx - 2, 188]]);
    }
  }

  // Eyes, lashes and brows
  const eye = (cx, cy, s) => {
    const p0 = [cx - 22, cy], cc = [cx, cy - 26], p2 = [cx + 22, cy];
    const ts = masc ? [.5, .62, .74, .86, .98] : [.7, .85, 1];
    const len = masc ? 11 : 6;
    let lashes = '';
    for (const t0 of ts) {
      const t = s > 0 ? t0 : 1 - t0;
      const [x, y] = quad(p0, cc, p2, t);
      const dx = s * (.25 + (t0 - .5) * 1.4), dy = -1, m = Math.hypot(dx, dy);
      lashes += `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x + dx / m * len)}" y2="${r1(y + dy / m * len)}"/>`;
    }
    return `<g class="bb-eye">
      <path d="${almond(cx, cy)}" fill="#fff"/>
      <g clip-path="url(#${eyeClip})">
        ${circle(cx, cy - 1, 11.5, `fill="${eyeCol}"`)}${circle(cx, cy - 1, 11.5, 'fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.5"')}
        ${circle(cx, cy - 1, 5.5, 'fill="#1f1a1a"')}${circle(cx + 4, cy - 5, 3.2, 'fill="#fff"')}${circle(cx - 4, cy + 3, 1.5, 'fill="#fff" opacity=".8"')}
      </g>
      <path d="M${cx - 22} ${cy} Q${cx} ${cy - 26} ${cx + 22} ${cy}" fill="none" stroke="#2a1d1d" stroke-width="3" stroke-linecap="round"/>
      <g stroke="${masc ? masc.color : '#2a1d1d'}" stroke-width="${masc ? 3.2 : 2}" stroke-linecap="round">${lashes}</g>
    </g>
    <path d="M${cx - 20} ${cy - 31} Q${cx} ${cy - 43} ${cx + 20} ${cy - 31}" stroke="${c.shade}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  };

  // Blusher
  let blushSvg = both(circle(142, 262, 20, 'fill="#ff8a8a" opacity=".15"')).join('');
  if (blush) {
    if (blush.hearts) {
      blushSvg += heart(142, 262, 30, blush.color, 'opacity=".8"') + heart(258, 262, 30, blush.color, 'opacity=".8"');
    } else {
      const g = uid();
      defs.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${blush.color}" stop-opacity=".7"/><stop offset="1" stop-color="${blush.color}" stop-opacity="0"/></radialGradient>`);
      blushSvg += both(circle(142, 262, 28, `fill="url(#${g})"`)).join('');
      if (blush.glitter) blushSvg += glitterDots([[132, 254], [146, 250], [152, 264], [138, 270], [126, 262], [268, 254], [254, 250], [248, 264], [262, 270], [274, 262]]);
    }
  }

  const freckles = look.freckles
    ? glitterDots([[176, 250], [184, 258], [170, 260], [224, 250], [216, 258], [230, 260], [192, 244], [208, 244]], skin.shade)
    : '';

  // Lips
  const lipCol = lip ? lip.color : skin.lip;
  let lips = `<path d="M174 281 Q186 270 200 276 Q214 270 226 281 Q200 286 174 281Z" fill="${lipCol}"/>
    <path d="M174 281 Q200 286 226 281 Q214 299 200 299 Q186 299 174 281Z" fill="${lipCol}"/>
    <path d="M174 281 Q200 286 226 281" stroke="rgba(0,0,0,.28)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  if (lip && lip.gloss) lips += `<ellipse cx="206" cy="290" rx="8" ry="2.6" fill="#fff" opacity=".7"/><ellipse cx="190" cy="276" rx="4" ry="1.5" fill="#fff" opacity=".5"/>`;
  if (lip && lip.glitter) lips += glitterDots([[184, 286], [194, 292], [212, 287], [218, 284], [200, 280], [205, 294]]);

  const earringSvg = ear
    ? `<g transform="translate(106 244)">${earring(ear)}</g><g transform="translate(294 244) scale(-1 1)">${earring(ear)}</g>`
    : '';

  const placed = opts.noPlaced ? '' : (look.placed || []).map(p => {
    const item = ITEMS[p.item];
    if (!item) return '';
    return `<g class="bb-placed" data-placed="${p.key}" transform="translate(${r1(p.x)} ${r1(p.y)})">${drawThing(item)}</g>`;
  }).join('');

  const ties = hp.ties.map(([x, y]) => `<rect x="${x - 9}" y="${y - 6}" width="18" height="12" rx="5" fill="${c.shade}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`).join('');

  return `<svg viewBox="${opts.viewBox || '0 0 400 520'}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>${defs.join('')}</defs>
  ${layer(hp.back)}${hp.backDeco.join('')}
  <path d="M60 520 Q60 395 172 368 L228 368 Q340 395 340 520Z" fill="${skin.base}"/>
  <path d="M172 285 L172 372 Q200 384 228 372 L228 285Z" fill="${skin.base}"/>
  <ellipse cx="200" cy="318" rx="30" ry="12" fill="${skin.shade}" opacity=".6"/>
  ${topSvg(top)}
  ${neck ? necklace(neck) : ''}
  ${layer(hp.strand)}
  ${both(`<ellipse cx="106" cy="222" rx="13" ry="22" fill="${skin.base}" stroke="${skin.shade}" stroke-width="2"/>`).join('')}
  ${both(`<path d="M104 210 Q98 222 106 234" stroke="${skin.shade}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('')}
  <ellipse cx="200" cy="210" rx="92" ry="108" fill="${skin.base}" stroke="${skin.shade}" stroke-width="2"/>
  ${blushSvg}${freckles}
  ${shadowSvg}
  ${eye(160, 215, -1)}${eye(240, 215, 1)}
  <path d="M195 247 Q200 254 206 249" stroke="${skin.shade}" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${lips}
  ${earringSvg}
  ${layer(hp.front)}${hp.deco.join('')}${ties}
  ${head ? headwear(head) : ''}
  ${placed}
</svg>`;
}

// Where hair ties are for this hairstyle (bobbles snap there when tapped).
export function tiePoints(look) {
  const c = HAIR_COLORS[look.hairColor] || HAIR_COLORS.brown;
  const L = (HAIR_LENGTHS[look.hairLength] || HAIR_LENGTHS.long).L;
  return hairParts(look.hairStyle, L, c).ties;
}

// ---------- menu pictures ----------
export function swatch(item, look) {
  const c = item.color;
  const svg = (vb, body) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  switch (item.kind) {
    case 'lip':
      return svg('0 0 60 60', `<rect x="20" y="31" width="20" height="24" rx="3" fill="#3a3550"/><rect x="22" y="23" width="16" height="10" rx="1" fill="#e8c25a"/>
        <path d="M24 23 L24 10 Q30 3 36 8 L36 23Z" fill="${c}"/>${item.gloss ? '<path d="M27 21 L27 11" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>' : ''}
        ${item.glitter ? glitterDots([[30, 14], [33, 19], [27, 17]]) : ''}`);
    case 'shadow': {
      let fill = c, defs = '';
      if (item.rainbow) { const g = uid(); defs = `<defs><linearGradient id="${g}">${RAINBOW.map((col, i) => `<stop offset="${i / 5}" stop-color="${col}"/>`).join('')}</linearGradient></defs>`; fill = `url(#${g})`; }
      return svg('0 0 60 60', `${defs}<circle cx="30" cy="30" r="24" fill="#f4eef7" stroke="#d9cfe3" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="${fill}"/>
        <path d="M18 24 Q22 16 30 14" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>
        ${item.glitter ? glitterDots([[24, 32], [34, 26], [36, 38], [28, 40], [40, 32], [22, 24]]) : ''}`);
    }
    case 'masc':
      return svg('0 0 60 60', `<g transform="rotate(-35 30 30)"><rect x="26" y="2" width="8" height="28" rx="4" fill="${c}"/><rect x="28.8" y="30" width="2.4" height="8" fill="#999"/>
        <rect x="25" y="37" width="10" height="20" rx="5" fill="#222"/>
        ${[40, 44, 48, 52].map(y => `<line x1="21" y1="${y}" x2="39" y2="${y}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join('')}</g>`);
    case 'blush':
      return svg('0 0 60 60', `<circle cx="30" cy="30" r="25" fill="#f8e1ec" stroke="#e2b6cb" stroke-width="2"/>
        ${item.hearts ? heart(30, 32, 34, c) : `<circle cx="30" cy="30" r="19" fill="${c}" opacity=".9"/>`}
        ${item.glitter ? glitterDots([[24, 30], [34, 24], [36, 36], [28, 38], [22, 22]]) : ''}`);
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
        cols.map((col, j) => `<path d="M${24 + j * w - (cols.length - 1) * w / 2 + 6 - w / 2} 10 Q${14 + j * w} 30 ${30 + j * w - (cols.length - 1) * w / 2} 56" stroke="${col}" stroke-width="${w + 1}" fill="none" stroke-linecap="round"/>`).join(''));
    }
    case 'ear':
      return svg('-22 -6 44 44', earring(item));
    case 'neck':
      return svg('150 326 100 100', `<path d="M172 300 L172 372 Q200 384 228 372 L228 300Z" fill="#f3dccd"/>${necklace(item)}`);
    case 'head':
      return svg('88 44 224 160', `<ellipse cx="200" cy="210" rx="92" ry="108" fill="#f3dccd"/>${headwear(item)}`);
    case 'top':
      return svg('30 370 340 155', topSvg(item));
    case 'hairStyle':
      return renderGirl({ ...look, hairStyle: item.value, headwear: null, extensions: [] }, { viewBox: '20 20 360 500', noPlaced: true });
    case 'hairColor':
      return renderGirl({ ...look, hairColor: item.value, headwear: null }, { viewBox: '50 30 300 330', noPlaced: true });
  }
  return '';
}
