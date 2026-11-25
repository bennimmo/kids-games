// Junk Stack – how each bit of junk looks. Metres, y up, centred like its shape in items.js.
// These are drawn once into a picture (see items.js drawItem), so they can be as fancy as we like.

const OUT = '#2a1d14';

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const circle = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
function lg(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
// text that reads the right way up (we're drawing with y up)
function txt(ctx, s, x, y, size, col, rot = 0, weight = 900) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(0.01, -0.01);
  ctx.font = `${weight} ${size * 100}px Nunito, Arial, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = col; ctx.fillText(s, 0, 0);
  ctx.restore();
}
const stroke = (ctx, col = OUT, w = 0.045) => { ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
const fillStroke = (ctx, fill, col = OUT, w = 0.045) => { ctx.fillStyle = fill; ctx.fill(); stroke(ctx, col, w); };
const line = (ctx, pts, col, w) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); stroke(ctx, col, w); };
const shine = (ctx, x, y, w, h, a = 0.35) => { ctx.fillStyle = `rgba(255,255,255,${a})`; rr(ctx, x, y, w, h, Math.min(w, h) / 2); ctx.fill(); };

const wood = (ctx, x0, x1, dark = false) => lg(ctx, 0, -1, 0, 1, dark
  ? [[0, '#8a5a2b'], [1, '#a8713a']]
  : [[0, '#c48745'], [0.5, '#dca664'], [1, '#c48745']]);

export const ART = {
  crate(ctx) {
    rr(ctx, -0.6, -0.6, 1.2, 1.2, 0.05); fillStroke(ctx, lg(ctx, 0, -0.6, 0, 0.6, [[0, '#b77937'], [1, '#d9a160']]));
    // planks
    ctx.strokeStyle = 'rgba(70,40,15,.55)'; ctx.lineWidth = 0.025;
    [-0.2, 0.2].forEach(y => line(ctx, [[-0.5, y], [0.5, y]], 'rgba(70,40,15,.55)', 0.025));
    // frame
    ctx.fillStyle = '#8f5b27';
    ctx.fillRect(-0.6, 0.44, 1.2, 0.16); ctx.fillRect(-0.6, -0.6, 1.2, 0.16);
    ctx.fillRect(-0.6, -0.6, 0.16, 1.2); ctx.fillRect(0.44, -0.6, 0.16, 1.2);
    // brace
    poly(ctx, [[-0.44, -0.36], [-0.32, -0.44], [0.44, 0.36], [0.32, 0.44]]); fillStroke(ctx, '#a06a32', 'rgba(60,35,10,.6)', 0.02);
    // nails
    ctx.fillStyle = '#5a5a5a';
    [[-0.52, -0.52], [0.52, -0.52], [-0.52, 0.52], [0.52, 0.52]].forEach(([x, y]) => { circle(ctx, x, y, 0.03); ctx.fill(); });
    txt(ctx, 'FRAGILE', 0.0, -0.05, 0.13, 'rgba(190,30,30,.75)', 0.3);
    rr(ctx, -0.6, -0.6, 1.2, 1.2, 0.05); stroke(ctx);
  },

  plank(ctx) {
    poly(ctx, [[-1.6, -0.17], [1.52, -0.17], [1.6, -0.08], [1.56, 0.02], [1.6, 0.17], [-1.6, 0.17]]);
    fillStroke(ctx, lg(ctx, 0, -0.17, 0, 0.17, [[0, '#b97c3c'], [0.5, '#e2ad6c'], [1, '#c58a48']]));
    ctx.save(); ctx.clip();
    [[-0.06, 0.02], [0.05, -0.03], [0.1, 0.04]].forEach(([y, a]) => {
      ctx.beginPath(); ctx.moveTo(-1.6, y);
      for (let x = -1.6; x <= 1.6; x += 0.2) ctx.lineTo(x, y + Math.sin(x * 3 + a * 50) * 0.025);
      stroke(ctx, 'rgba(120,70,25,.45)', 0.018);
    });
    ctx.beginPath(); ctx.ellipse(0.6, 0, 0.09, 0.05, 0, 0, Math.PI * 2); fillStroke(ctx, '#9c6229', 'rgba(90,50,15,.7)', 0.015);
    ctx.restore();
    ctx.fillStyle = '#666';
    [-1.48, -1.48, 1.44, 1.44].forEach((x, i) => { circle(ctx, x, i % 2 ? 0.07 : -0.07, 0.025); ctx.fill(); });
  },

  barrel(ctx) {
    const body = lg(ctx, -0.45, 0, 0.45, 0, [[0, '#7f1414'], [0.3, '#e53935'], [0.45, '#ff8a80'], [0.6, '#e53935'], [1, '#7f1414']]);
    rr(ctx, -0.45, -0.62, 0.9, 1.24, 0.06); fillStroke(ctx, body);
    // rims and ribs
    const metal = lg(ctx, -0.45, 0, 0.45, 0, [[0, '#5d6b73'], [0.45, '#e0e6ea'], [1, '#5d6b73']]);
    [[0.56, 0.09], [-0.65, 0.09], [0.2, 0.06], [-0.26, 0.06]].forEach(([y, h]) => { rr(ctx, -0.47, y, 0.94, h, 0.03); fillStroke(ctx, metal, OUT, 0.025); });
    // hazard label
    ctx.save(); ctx.translate(0.02, -0.03); ctx.rotate(Math.PI / 4);
    rr(ctx, -0.14, -0.14, 0.28, 0.28, 0.02); fillStroke(ctx, '#ffd54f', '#3e2723', 0.02); ctx.restore();
    ctx.beginPath(); ctx.moveTo(0.02, 0.07); ctx.quadraticCurveTo(0.1, -0.05, 0.02, -0.11); ctx.quadraticCurveTo(-0.06, -0.05, 0.02, 0.07); ctx.fillStyle = '#212121'; ctx.fill();
    // rust drip
    ctx.fillStyle = 'rgba(120,60,20,.6)'; rr(ctx, -0.3, 0.3, 0.06, 0.22, 0.03); ctx.fill();
    rr(ctx, -0.45, -0.62, 0.9, 1.24, 0.06); stroke(ctx);
  },

  fridge(ctx) {
    ctx.fillStyle = '#546e7a'; ctx.fillRect(-0.42, -0.9, 0.1, 0.06); ctx.fillRect(0.32, -0.9, 0.1, 0.06);
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.84); ctx.lineTo(0.5, -0.84); ctx.lineTo(0.5, 0.65);
    ctx.quadraticCurveTo(0.5, 0.9, 0.2, 0.9); ctx.lineTo(-0.2, 0.9); ctx.quadraticCurveTo(-0.5, 0.9, -0.5, 0.65); ctx.closePath();
    fillStroke(ctx, lg(ctx, -0.5, 0, 0.5, 0, [[0, '#cfe3d4'], [0.35, '#f1fbf3'], [1, '#a9c7b1']]), '#4d6b57');
    line(ctx, [[-0.5, 0.28], [0.5, 0.28]], '#4d6b57', 0.035);
    // chrome handles
    const chrome = lg(ctx, 0.3, 0, 0.4, 0, [[0, '#90a4ae'], [0.5, '#ffffff'], [1, '#78909c']]);
    rr(ctx, 0.32, 0.38, 0.07, 0.32, 0.035); fillStroke(ctx, chrome, '#455a64', 0.02);
    rr(ctx, 0.32, -0.25, 0.07, 0.45, 0.035); fillStroke(ctx, chrome, '#455a64', 0.02);
    // badge, magnets, a drawing
    rr(ctx, -0.22, 0.75, 0.3, 0.07, 0.03); fillStroke(ctx, '#b0bec5', '#607d8b', 0.015);
    ctx.save(); ctx.translate(-0.15, -0.15); ctx.rotate(0.08);
    ctx.fillStyle = '#fff'; ctx.fillRect(-0.18, -0.2, 0.36, 0.38);
    ctx.strokeStyle = '#e53935'; ctx.lineWidth = 0.02; ctx.beginPath(); ctx.arc(0, -0.02, 0.09, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#1e88e5'; ctx.beginPath(); ctx.moveTo(-0.12, -0.15); ctx.lineTo(0.12, -0.15); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#ff7043'; circle(ctx, -0.15, 0.03, 0.045); ctx.fill();
    ctx.fillStyle = '#ab47bc'; circle(ctx, -0.25, 0.55, 0.05); ctx.fill();
    ctx.fillStyle = '#66bb6a'; circle(ctx, -0.05, 0.45, 0.04); ctx.fill();
    shine(ctx, -0.4, -0.7, 0.07, 0.9, 0.5);
  },

  bathtub(ctx) {
    // claw feet
    ctx.fillStyle = '#e0a800';
    [-0.75, 0.75].forEach(x => { ctx.beginPath(); ctx.moveTo(x - 0.1, -0.38); ctx.lineTo(x + 0.1, -0.38); ctx.lineTo(x + 0.13, -0.5); ctx.lineTo(x - 0.13, -0.5); ctx.closePath(); ctx.fill(); stroke(ctx, '#8d6e00', 0.02); });
    ctx.beginPath();
    ctx.moveTo(-1.1, 0.4); ctx.lineTo(-1.08, -0.15);
    ctx.quadraticCurveTo(-1.0, -0.42, -0.7, -0.42); ctx.lineTo(0.7, -0.42);
    ctx.quadraticCurveTo(1.0, -0.42, 1.08, -0.15); ctx.lineTo(1.1, 0.4);
    ctx.lineTo(0.86, 0.4); ctx.lineTo(0.86, -0.2); ctx.lineTo(-0.86, -0.2); ctx.lineTo(-0.86, 0.4); ctx.closePath();
    fillStroke(ctx, lg(ctx, 0, -0.45, 0, 0.4, [[0, '#cfd8dc'], [0.6, '#ffffff'], [1, '#eceff1']]), '#607d8b');
    // roll top rims
    [-0.98, 0.98].forEach(x => { rr(ctx, x - 0.14, 0.34, 0.28, 0.1, 0.05); fillStroke(ctx, '#fff', '#607d8b', 0.025); });
    // bubbly water
    ctx.fillStyle = lg(ctx, 0, -0.2, 0, -0.05, [[0, '#4fc3f7'], [1, '#b3e5fc']]); ctx.fillRect(-0.86, -0.2, 1.72, 0.14);
    ctx.fillStyle = '#fff';
    [[-0.5, -0.05, 0.06], [-0.38, -0.03, 0.04], [0.2, -0.05, 0.05], [0.32, -0.04, 0.035]].forEach(([x, y, r]) => { circle(ctx, x, y, r); ctx.fill(); });
    // gold taps
    ctx.fillStyle = '#ffca28';
    rr(ctx, 0.62, 0.0, 0.06, 0.38, 0.03); ctx.fill(); stroke(ctx, '#8d6e00', 0.02);
    rr(ctx, 0.5, 0.32, 0.22, 0.06, 0.03); ctx.fill(); stroke(ctx, '#8d6e00', 0.02);
    shine(ctx, -0.6, -0.36, 1.0, 0.05, 0.6);
  },

  cone(ctx) {
    rr(ctx, -0.5, -0.6, 1.0, 0.12, 0.02); fillStroke(ctx, '#263238', '#111', 0.03);
    poly(ctx, [[-0.42, -0.48], [0.42, -0.48], [0.12, 0.58], [-0.12, 0.58]]);
    fillStroke(ctx, lg(ctx, -0.42, 0, 0.42, 0, [[0, '#d84315'], [0.4, '#ff7a1a'], [0.55, '#ffab70'], [1, '#c43c00']]), '#7a2600');
    ctx.save(); ctx.clip();
    ctx.fillStyle = lg(ctx, -0.4, 0, 0.4, 0, [[0, '#cfd8dc'], [0.5, '#ffffff'], [1, '#b0bec5']]);
    ctx.fillRect(-0.5, -0.2, 1.0, 0.16); ctx.fillRect(-0.5, 0.18, 1.0, 0.12);
    ctx.restore();
    rr(ctx, -0.13, 0.55, 0.26, 0.06, 0.03); fillStroke(ctx, '#ff7a1a', '#7a2600', 0.025);
  },

  sofa(ctx) {
    const fab = lg(ctx, 0, -0.5, 0, 1, [[0, '#5e35b1'], [1, '#8e6dd6']]);
    // legs
    ctx.fillStyle = '#4e342e'; ctx.fillRect(-0.92, -0.5, 0.1, 0.08); ctx.fillRect(0.82, -0.5, 0.1, 0.08);
    // back rest (left) and seat
    rr(ctx, -1.0, -0.1, 0.5, 1.1, 0.2); fillStroke(ctx, fab, '#311b92');
    rr(ctx, -1.0, -0.44, 2.0, 0.44, 0.14); fillStroke(ctx, fab, '#311b92');
    // seat cushion with seam + buttons
    rr(ctx, -0.5, -0.06, 1.42, 0.14, 0.07); fillStroke(ctx, '#9575cd', '#311b92', 0.025);
    line(ctx, [[0.2, -0.05], [0.2, 0.07]], '#311b92', 0.02);
    ctx.fillStyle = '#311b92'; [[-0.75, 0.3], [-0.75, 0.65]].forEach(([x, y]) => { circle(ctx, x, y, 0.035); ctx.fill(); });
    // a patch and a spring poking out (it's junk!)
    rr(ctx, 0.35, -0.32, 0.22, 0.16, 0.02); fillStroke(ctx, '#ffb74d', '#e65100', 0.02);
    ctx.beginPath(); for (let i = 0; i <= 12; i++) { const a = i * 0.9; ctx.lineTo(-0.15 + Math.cos(a) * 0.06, 0.06 + i * 0.022); } stroke(ctx, '#90a4ae', 0.025);
    shine(ctx, -0.92, 0.1, 0.06, 0.7, 0.25);
  },

  tyre(ctx) {
    const pts = [[-0.45, -0.35], [0.45, -0.35], [0.66, -0.12], [0.62, 0.15], [0.42, 0.35], [-0.42, 0.35], [-0.62, 0.15], [-0.66, -0.12]];
    // rubber body (squashed tyre, flat at the bottom)
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.35); ctx.lineTo(0.5, -0.35);
    ctx.quadraticCurveTo(0.7, -0.33, 0.66, -0.08); ctx.quadraticCurveTo(0.62, 0.33, 0.0, 0.35);
    ctx.quadraticCurveTo(-0.62, 0.33, -0.66, -0.08); ctx.quadraticCurveTo(-0.7, -0.33, -0.5, -0.35); ctx.closePath();
    fillStroke(ctx, lg(ctx, 0, -0.35, 0, 0.35, [[0, '#1a1a1a'], [0.5, '#3a3a3a'], [1, '#222']]), '#000', 0.035);
    // tread blocks round the edge
    ctx.save(); ctx.clip();
    ctx.fillStyle = '#5a5a5a';
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      const x = Math.cos(a) * 0.66, y = Math.sin(a) * 0.36;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillRect(-0.05, -0.025, 0.1, 0.05); ctx.restore();
    }
    ctx.restore();
    // sidewall ring
    ctx.beginPath(); ctx.ellipse(0, -0.01, 0.48, 0.24, 0, 0, Math.PI * 2); stroke(ctx, '#4a4a4a', 0.03);
    // shiny wheel rim with bolts
    ctx.beginPath(); ctx.ellipse(0, -0.02, 0.34, 0.19, 0, 0, Math.PI * 2);
    fillStroke(ctx, lg(ctx, 0, -0.21, 0, 0.17, [[0, '#78909c'], [0.5, '#eceff1'], [1, '#90a4ae']]), '#37474f', 0.025);
    ctx.beginPath(); ctx.ellipse(0, -0.02, 0.1, 0.06, 0, 0, Math.PI * 2); fillStroke(ctx, '#607d8b', '#37474f', 0.015);
    ctx.fillStyle = '#37474f';
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 + 0.3; circle(ctx, Math.cos(a) * 0.19, -0.02 + Math.sin(a) * 0.11, 0.022); ctx.fill(); }
    // puncture patch + hiss lines
    ctx.save(); ctx.translate(0.42, 0.18); ctx.rotate(-0.5); ctx.fillStyle = '#ffeb3b'; ctx.fillRect(-0.05, -0.03, 0.1, 0.06); ctx.restore();
    shine(ctx, -0.4, 0.22, 0.4, 0.04, 0.18);
    void pts;
  },

  pallet(ctx) {
    const board = lg(ctx, 0, -0.16, 0, 0.16, [[0, '#b98c55'], [0.5, '#dcb27a'], [1, '#c69a60']]);
    rr(ctx, -0.9, 0.05, 1.8, 0.11, 0.015); fillStroke(ctx, board, OUT, 0.025);
    rr(ctx, -0.9, -0.16, 1.8, 0.09, 0.015); fillStroke(ctx, board, OUT, 0.025);
    [-0.8, -0.08, 0.64].forEach(x => { rr(ctx, x, -0.07, 0.16, 0.12, 0.01); fillStroke(ctx, '#a57a43', OUT, 0.02); });
    ctx.fillStyle = '#555';
    [-0.84, -0.76, -0.04, 0.04, 0.68, 0.76].forEach(x => { circle(ctx, x, 0.1, 0.015); ctx.fill(); circle(ctx, x, -0.12, 0.015); ctx.fill(); });
    txt(ctx, 'EUR', -0.4, 0.105, 0.07, 'rgba(60,35,10,.7)');
    line(ctx, [[0.2, 0.1], [0.5, 0.11]], 'rgba(110,70,30,.5)', 0.012);
  },

  tv(ctx) {
    // rabbit ears
    line(ctx, [[0, 0.45], [-0.22, 0.66]], '#455a64', 0.025);
    line(ctx, [[0, 0.45], [0.26, 0.64]], '#455a64', 0.025);
    ctx.fillStyle = '#455a64'; circle(ctx, -0.22, 0.66, 0.025); ctx.fill(); circle(ctx, 0.26, 0.64, 0.025); ctx.fill();
    // wooden box
    rr(ctx, -0.55, -0.45, 1.1, 0.9, 0.1);
    fillStroke(ctx, lg(ctx, 0, -0.45, 0, 0.45, [[0, '#6d4c41'], [0.5, '#a1765c'], [1, '#7b5646']]));
    // screen (bulgy glass)
    rr(ctx, -0.46, -0.34, 0.7, 0.66, 0.14);
    fillStroke(ctx, lg(ctx, -0.46, 0.32, 0.24, -0.34, [[0, '#cfd8dc'], [0.5, '#78909c'], [1, '#37474f']]), '#212121', 0.035);
    ctx.save(); rr(ctx, -0.46, -0.34, 0.7, 0.66, 0.14); ctx.clip();
    for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 3 ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.35)'; ctx.fillRect(-0.46 + ((i * 37) % 70) / 100, -0.34 + ((i * 53) % 66) / 100, 0.04, 0.02); }
    ctx.restore();
    shine(ctx, -0.38, 0.12, 0.22, 0.12, 0.45);
    // dials + speaker
    ctx.fillStyle = '#ffd54f'; circle(ctx, 0.4, 0.22, 0.06); ctx.fill(); stroke(ctx, '#5d4037', 0.02);
    ctx.fillStyle = '#d7ccc8'; circle(ctx, 0.4, 0.04, 0.05); ctx.fill(); stroke(ctx, '#5d4037', 0.02);
    [-0.14, -0.2, -0.26, -0.32].forEach(y => line(ctx, [[0.32, y], [0.48, y]], '#3e2723', 0.018));
  },

  washer(ctx) {
    rr(ctx, -0.5, -0.525, 1.0, 1.05, 0.07);
    fillStroke(ctx, lg(ctx, -0.5, 0, 0.5, 0, [[0, '#d5dde2'], [0.4, '#ffffff'], [1, '#b8c4cb']]), '#546e7a');
    // control panel
    ctx.fillStyle = '#eceff1'; ctx.fillRect(-0.48, 0.28, 0.96, 0.22);
    line(ctx, [[-0.5, 0.28], [0.5, 0.28]], '#546e7a', 0.025);
    rr(ctx, -0.42, 0.33, 0.24, 0.1, 0.02); fillStroke(ctx, '#cfd8dc', '#78909c', 0.015);
    rr(ctx, -0.08, 0.34, 0.2, 0.08, 0.01); fillStroke(ctx, '#263238', '#263238', 0.01);
    txt(ctx, '40°', 0.02, 0.38, 0.06, '#69f0ae');
    circle(ctx, 0.32, 0.39, 0.07); fillStroke(ctx, lg(ctx, 0.25, 0.32, 0.39, 0.46, [[0, '#90a4ae'], [1, '#fff']]), '#546e7a', 0.02);
    // door: chrome ring, glass, sloshing water with a sock
    circle(ctx, 0, -0.12, 0.33); fillStroke(ctx, lg(ctx, -0.33, -0.45, 0.33, 0.21, [[0, '#78909c'], [0.5, '#f5f5f5'], [1, '#90a4ae']]), '#455a64', 0.025);
    circle(ctx, 0, -0.12, 0.24); fillStroke(ctx, '#263238', '#263238', 0.01);
    ctx.save(); circle(ctx, 0, -0.12, 0.23); ctx.clip();
    ctx.fillStyle = lg(ctx, 0, -0.35, 0, -0.05, [[0, '#0288d1'], [1, '#4fc3f7']]);
    ctx.beginPath(); ctx.moveTo(-0.3, -0.12); ctx.quadraticCurveTo(-0.1, -0.02, 0.05, -0.12); ctx.quadraticCurveTo(0.2, -0.22, 0.3, -0.1); ctx.lineTo(0.3, -0.4); ctx.lineTo(-0.3, -0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff5252'; rr(ctx, -0.12, -0.22, 0.14, 0.06, 0.03); ctx.fill(); rr(ctx, 0.0, -0.22, 0.05, 0.12, 0.025); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.8)'; [[0.1, -0.06, 0.025], [0.15, -0.0, 0.018], [-0.15, -0.05, 0.02]].forEach(([x, y, r]) => { circle(ctx, x, y, r); ctx.fill(); });
    ctx.restore();
    shine(ctx, -0.15, -0.02, 0.1, 0.05, 0.6);
  },

  bin(ctx) {
    poly(ctx, [[-0.4, -0.66], [0.4, -0.66], [0.5, 0.56], [-0.5, 0.56]]);
    fillStroke(ctx, lg(ctx, -0.5, 0, 0.5, 0, [[0, '#1b5e20'], [0.35, '#43a047'], [0.5, '#66bb6a'], [1, '#1b5e20']]), '#0d3b12');
    // ribs
    [-0.22, 0, 0.22].forEach(x => line(ctx, [[x * 0.95, -0.55], [x * 1.12, 0.45]], 'rgba(0,0,0,.25)', 0.035));
    // lid (slightly open) with a fish bone poking out
    ctx.save(); ctx.translate(-0.54, 0.6); ctx.rotate(0.12);
    ctx.strokeStyle = '#eceff1'; ctx.lineWidth = 0.025;
    ctx.beginPath(); ctx.moveTo(0.55, 0.0); ctx.lineTo(0.85, 0.06); ctx.stroke();
    [0.62, 0.7, 0.78].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -0.03); ctx.lineTo(x + 0.02, 0.08); ctx.stroke(); });
    rr(ctx, 0, -0.02, 1.08, 0.1, 0.04); fillStroke(ctx, '#2e7d32', '#0d3b12', 0.03);
    rr(ctx, 0.85, 0.06, 0.2, 0.05, 0.02); fillStroke(ctx, '#1b5e20', '#0d3b12', 0.02);
    ctx.restore();
    // recycling arrows
    ctx.save(); ctx.translate(0.02, 0.05);
    for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ctx.beginPath(); ctx.arc(0, 0, 0.12, 0.2, 1.6); stroke(ctx, '#e8f5e9', 0.035); ctx.beginPath(); ctx.moveTo(-0.01, 0.15); ctx.lineTo(-0.06, 0.1); ctx.lineTo(-0.06, 0.18); ctx.closePath(); ctx.fillStyle = '#e8f5e9'; ctx.fill(); }
    ctx.restore();
    // wheel
    circle(ctx, -0.3, -0.62, 0.11); fillStroke(ctx, '#212121', '#000', 0.02);
    circle(ctx, -0.3, -0.62, 0.04); ctx.fillStyle = '#9e9e9e'; ctx.fill();
  },

  mattress(ctx) {
    rr(ctx, -1.2, -0.2, 2.4, 0.4, 0.12);
    fillStroke(ctx, lg(ctx, 0, -0.2, 0, 0.2, [[0, '#bbdefb'], [0.5, '#ffffff'], [1, '#e3f2fd']]), '#5c8fbf');
    ctx.save(); rr(ctx, -1.2, -0.2, 2.4, 0.4, 0.12); ctx.clip();
    ctx.fillStyle = 'rgba(100,160,220,.45)';
    for (let x = -1.15; x < 1.2; x += 0.24) ctx.fillRect(x, -0.2, 0.09, 0.4);
    ctx.restore();
    line(ctx, [[-1.15, 0.13], [1.15, 0.13]], 'rgba(60,110,170,.6)', 0.02);
    line(ctx, [[-1.15, -0.13], [1.15, -0.13]], 'rgba(60,110,170,.6)', 0.02);
    ctx.fillStyle = '#5c8fbf'; [-0.8, -0.3, 0.2, 0.7].forEach(x => { circle(ctx, x, 0, 0.03); ctx.fill(); });
    // stain and a boing-y spring
    ctx.fillStyle = 'rgba(190,160,80,.45)'; ctx.beginPath(); ctx.ellipse(0.45, 0.03, 0.2, 0.09, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); for (let i = 0; i <= 10; i++) { const a = i * 1.1; ctx.lineTo(-0.55 + Math.cos(a) * 0.05, 0.18 + i * 0.012); } stroke(ctx, '#78909c', 0.02);
  },

  suitcase(ctx) {
    ctx.beginPath(); ctx.moveTo(-0.16, 0.4); ctx.lineTo(-0.16, 0.52); ctx.quadraticCurveTo(0, 0.58, 0.16, 0.52); ctx.lineTo(0.16, 0.4); stroke(ctx, '#3e2723', 0.06);
    rr(ctx, -0.6, -0.4, 1.2, 0.8, 0.1);
    fillStroke(ctx, lg(ctx, 0, -0.4, 0, 0.4, [[0, '#8d4a24'], [0.5, '#c06a36'], [1, '#9c5229']]), '#3e2723');
    // straps, buckles, metal corners
    ctx.fillStyle = '#5d3a1a'; ctx.fillRect(-0.4, -0.4, 0.09, 0.8); ctx.fillRect(0.31, -0.4, 0.09, 0.8);
    ctx.fillStyle = '#ffd54f'; ctx.fillRect(-0.41, 0.12, 0.11, 0.08); ctx.fillRect(0.3, 0.12, 0.11, 0.08);
    ctx.fillStyle = '#b0bec5';
    [[-0.6, -0.4, 1, 1], [0.6, -0.4, -1, 1], [-0.6, 0.4, 1, -1], [0.6, 0.4, -1, -1]].forEach(([x, y, a, b]) => poly(ctx, [[x, y], [x + a * 0.14, y], [x, y + b * 0.14]]) || ctx.fill());
    // travel stickers
    ctx.save(); ctx.translate(-0.06, 0.08); ctx.rotate(0.2); rr(ctx, -0.14, -0.08, 0.28, 0.16, 0.02); fillStroke(ctx, '#fff59d', '#f57f17', 0.015); txt(ctx, 'PARIS', 0, 0, 0.07, '#e65100'); ctx.restore();
    circle(ctx, 0.12, -0.2, 0.1); fillStroke(ctx, '#4fc3f7', '#01579b', 0.015); txt(ctx, '★', 0.12, -0.2, 0.1, '#fff');
  },

  toilet(ctx) {
    const porc = lg(ctx, -0.5, 0, 0.5, 0, [[0, '#cfd8dc'], [0.45, '#ffffff'], [1, '#d6dee2']]);
    // cistern (tank) on the left with a flush handle
    rr(ctx, -0.49, -0.16, 0.34, 0.76, 0.06); fillStroke(ctx, porc, '#607d8b');
    rr(ctx, -0.52, 0.52, 0.4, 0.08, 0.03); fillStroke(ctx, '#fff', '#607d8b', 0.025);
    rr(ctx, -0.18, 0.36, 0.12, 0.05, 0.02); fillStroke(ctx, '#b0bec5', '#455a64', 0.015);
    // bowl
    ctx.beginPath(); ctx.moveTo(-0.24, -0.1); ctx.lineTo(0.48, -0.1);
    ctx.quadraticCurveTo(0.46, -0.42, 0.18, -0.48); ctx.lineTo(0.14, -0.6); ctx.lineTo(-0.1, -0.6); ctx.lineTo(-0.12, -0.46);
    ctx.quadraticCurveTo(-0.24, -0.38, -0.24, -0.1); ctx.closePath();
    fillStroke(ctx, porc, '#607d8b');
    // seat + lid up against the tank
    rr(ctx, -0.26, -0.13, 0.76, 0.07, 0.035); fillStroke(ctx, '#ffcc80', '#e65100', 0.02);
    ctx.save(); ctx.translate(-0.15, -0.06); ctx.rotate(1.35); rr(ctx, 0, -0.03, 0.55, 0.06, 0.03); fillStroke(ctx, '#ffcc80', '#e65100', 0.02); ctx.restore();
    shine(ctx, -0.42, -0.05, 0.05, 0.5, 0.6);
    shine(ctx, 0.1, -0.35, 0.18, 0.04, 0.5);
  },

  boot(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.4, 0.6); ctx.lineTo(0.04, 0.6); ctx.lineTo(0.03, -0.18);
    ctx.quadraticCurveTo(0.42, -0.2, 0.5, -0.42); ctx.lineTo(0.5, -0.52); ctx.lineTo(-0.4, -0.52); ctx.closePath();
    fillStroke(ctx, lg(ctx, -0.4, 0, 0.5, 0, [[0, '#f9a825'], [0.35, '#ffeb3b'], [1, '#f9a825']]), '#8d6e00');
    // sole with tread, heel
    rr(ctx, -0.42, -0.6, 0.94, 0.1, 0.03); fillStroke(ctx, '#4e342e', '#2e1b12', 0.02);
    ctx.fillStyle = '#2e1b12'; for (let x = -0.36; x < 0.48; x += 0.12) ctx.fillRect(x, -0.6, 0.05, 0.03);
    // top band, toe cap, side tab
    rr(ctx, -0.42, 0.5, 0.48, 0.1, 0.03); fillStroke(ctx, '#fbc02d', '#8d6e00', 0.02);
    ctx.beginPath(); ctx.moveTo(0.18, -0.52); ctx.quadraticCurveTo(0.5, -0.5, 0.5, -0.42); ctx.quadraticCurveTo(0.42, -0.24, 0.18, -0.2); ctx.closePath(); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fill();
    rr(ctx, -0.02, 0.2, 0.08, 0.2, 0.03); fillStroke(ctx, '#f57f17', '#8d6e00', 0.015);
    shine(ctx, -0.32, -0.3, 0.07, 0.7, 0.45);
  },
};
