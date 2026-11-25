// Junk Stack – things to look at while you stack (looks only, they never touch the tower).
//   Sky:  puffy clouds, seagulls, a plane with a silly banner, a hot-air balloon,
//         now and then a flying pig, and a UFO that comes down to look at your tower.
//   Sea:  fish, jellyfish, a turtle, an octopus, a shark fin, a rubber duck, a whale…
//         and rare "what was that?" ones: a sea serpent, a giant tentacle, a periscope, a big eye.
//
// v = { ctx, w, playH, s, sx(x), sy(y), seaY (screen), topY (screen y of tower top), time }

const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const BANNERS = ['STACK IT HIGH!', 'HI MUM!', 'I ♥ JUNK', 'NO SPLASHING!', 'WOBBLE WOBBLE', 'BIGGEST TOWER EVER?'];
const FISH = ['#ff8a65', '#ffd54f', '#4dd0e1', '#ba68c8', '#81c784', '#f06292'];

export function createScenery() {
  let sky = [], sea = [];
  let nextSky = rand(2, 5), nextSea = rand(1.5, 3), nextUfo = rand(35, 60);
  let ufo = null;

  // ---------------------------------------------------------------- update
  function update(dt, v) {
    nextSky -= dt; nextSea -= dt; nextUfo -= dt;
    if (nextSky <= 0) { nextSky = rand(4, 9); spawnSky(v); }
    if (nextSea <= 0) { nextSea = rand(2.5, 6); spawnSea(); }
    if (nextUfo <= 0 && !ufo) { nextUfo = rand(50, 90); ufo = { x: v.w * rand(0.3, 0.7), y: -80, phase: 'down', t: 0 }; }

    sky.forEach(o => { o.x += o.vx * dt; o.t += dt; });
    sky = sky.filter(o => o.x > -300 && o.x < v.w + 300);
    sea.forEach(o => { o.x += o.vx * dt; o.t += dt; });
    sea = sea.filter(o => o.t < o.life && o.x > -14 && o.x < 14);

    if (ufo) {
      ufo.t += dt;
      const hover = Math.max(150, Math.min(v.playH * 0.45, v.topY - 90));
      if (ufo.phase === 'down') { ufo.y += (hover - ufo.y) * Math.min(1, dt * 1.5); if (ufo.t > 2.5) { ufo.phase = 'beam'; ufo.t = 0; } }
      else if (ufo.phase === 'beam') { ufo.y = hover + Math.sin(ufo.t * 3) * 6; ufo.x += Math.sin(ufo.t * 1.3) * 0.6; if (ufo.t > 4.5) { ufo.phase = 'away'; ufo.t = 0; } }
      else { ufo.y -= dt * (120 + ufo.t * 600); ufo.x += dt * 300; if (ufo.y < -150) ufo = null; }
    }
  }

  function spawnSky(v) {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const x = dir > 0 ? -150 : v.w + 150;
    const y = rand(140, Math.max(160, v.playH * 0.42));
    const r = Math.random();
    if (r < 0.07) sky.push({ kind: 'pig', x, y, vx: dir * 70, t: 0 });
    else if (r < 0.5) {
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) sky.push({ kind: 'gull', x: x - dir * i * 40, y: y + rand(-25, 25), vx: dir * rand(45, 70), t: rand(0, 3), size: rand(0.8, 1.2) });
    } else if (r < 0.75) sky.push({ kind: 'plane', x, y: Math.max(130, y - 30), vx: dir * 90, t: 0, text: pick(BANNERS) });
    else sky.push({ kind: 'balloon', x, y, vx: dir * 18, t: 0, col: pick(['#ef5350', '#ab47bc', '#29b6f6', '#ffa726']) });
  }

  function spawnSea() {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const x = -dir * 12;
    const r = Math.random();
    const base = { x, t: 0, life: 40, dir };
    if (r < 0.04) sea.push({ ...base, kind: 'serpent', vx: dir * 1.4, life: 20 });
    else if (r < 0.08) sea.push({ ...base, kind: 'tentacle', x: pick([-1, 1]) * rand(4.5, 6), vx: 0, life: 6 });
    else if (r < 0.11) sea.push({ ...base, kind: 'periscope', vx: dir * 1.1 });
    else if (r < 0.14) sea.push({ ...base, kind: 'eye', x: rand(-4, 4), vx: 0, life: 5 });
    else if (r < 0.45) {
      const n = 1 + Math.floor(Math.random() * 4), col = pick(FISH), d = rand(0.2, 0.8);
      for (let i = 0; i < n; i++) sea.push({ ...base, kind: 'fish', x: x - dir * i * 0.7, d: d + rand(-0.15, 0.15), vx: dir * rand(1.4, 2), col, size: rand(0.8, 1.1) });
    } else if (r < 0.55) sea.push({ ...base, kind: 'jelly', vx: dir * 0.4, d: rand(0.3, 0.7), col: pick(['#f8bbd0', '#e1bee7', '#b3e5fc']) });
    else if (r < 0.64) sea.push({ ...base, kind: 'turtle', vx: dir * 0.8, d: rand(0.3, 0.7) });
    else if (r < 0.72) sea.push({ ...base, kind: 'octopus', vx: dir * 0.7, d: rand(0.4, 0.8) });
    else if (r < 0.82) sea.push({ ...base, kind: 'fin', vx: dir * 2.2 });
    else if (r < 0.91) sea.push({ ...base, kind: 'duck', vx: dir * 0.6 });
    else sea.push({ ...base, kind: 'whale', vx: dir * 0.9 });
  }

  // ---------------------------------------------------------------- clouds
  function cloud(ctx, x, y, k) {
    const puffs = [[-1.1, 0, 0.55], [-0.45, -0.35, 0.7], [0.3, -0.45, 0.8], [0.95, -0.1, 0.6], [0.3, 0.05, 0.6]];
    ctx.fillStyle = 'rgba(205,222,240,.95)';
    ctx.beginPath();
    puffs.forEach(([px, py, r]) => { ctx.moveTo(x + px * k + r * k, y + py * k + 0.12 * k); ctx.arc(x + px * k, y + py * k + 0.12 * k, r * k, 0, Math.PI * 2); });
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    puffs.forEach(([px, py, r]) => { ctx.moveTo(x + px * k + r * k, y + py * k); ctx.arc(x + px * k, y + py * k, r * k, 0, Math.PI * 2); });
    ctx.fill();
    ctx.fillStyle = 'rgba(205,222,240,.95)';
    ctx.fillRect(x - 1.5 * k, y + 0.3 * k, 3 * k, 0.32 * k);
  }
  function drawClouds(v, camY) {
    const { ctx, s } = v;
    const r = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    for (let k = 0; k < 40; k++) {
      const cy = 2.5 + k * 3.4;
      const cx = ((r(k) * 40 + v.time * (0.12 + r(k + 7) * 0.18)) % 46) - 23;
      const px = v.sx(cx), py = v.sy(cy - camY * 0.3);
      if (py < -80 || py > v.playH + 60) continue;
      cloud(ctx, px, py, (0.55 + r(k + 3) * 0.6) * s);
    }
  }

  // ---------------------------------------------------------------- sky things
  function drawSky(v) {
    const { ctx } = v;
    sky.forEach(o => {
      ctx.save();
      ctx.translate(o.x, o.y);
      if (o.vx < 0) ctx.scale(-1, 1);
      if (o.kind === 'gull') {
        const f = Math.sin(o.t * 8) * 7 * o.size;
        ctx.strokeStyle = '#37474f'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-12 * o.size, -f); ctx.quadraticCurveTo(-5, -6, 0, 0); ctx.quadraticCurveTo(5, -6, 12 * o.size, -f); ctx.stroke();
      } else if (o.kind === 'plane') {
        ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-44, 4); ctx.stroke();
        ctx.font = '800 13px Nunito, system-ui, sans-serif';
        const tw = ctx.measureText(o.text).width + 18;
        const wav = Math.sin(o.t * 6) * 2;
        ctx.fillStyle = '#fff8e1';
        ctx.beginPath(); ctx.moveTo(-44, -6); ctx.lineTo(-44 - tw, -6 + wav); ctx.lineTo(-44 - tw, 14 + wav); ctx.lineTo(-44, 14); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#e57373'; ctx.stroke();
        ctx.save(); if (o.vx < 0) { ctx.scale(-1, 1); ctx.translate(44 + tw / 2, 0); } else ctx.translate(-44 - tw / 2, 0);
        ctx.fillStyle = '#d84315'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.text, 0, 4 + wav / 2); ctx.restore();
        ctx.fillStyle = '#ef5350';
        ctx.beginPath(); ctx.ellipse(0, 0, 26, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c62828'; ctx.fillRect(-6, -2, 12, 16); ctx.fillRect(-24, -12, 6, 10);
        ctx.fillStyle = '#b3e5fc'; ctx.beginPath(); ctx.ellipse(12, -3, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#455a64'; ctx.fillRect(25, -8 + (Math.floor(o.t * 30) % 2) * 6, 2, 10);
      } else if (o.kind === 'balloon') {
        const bob = Math.sin(o.t * 1.2) * 6;
        ctx.translate(0, bob);
        ctx.fillStyle = o.col;
        ctx.beginPath(); ctx.arc(0, -30, 24, Math.PI * 0.85, Math.PI * 2.15); ctx.lineTo(8, -4); ctx.lineTo(-8, -4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-4, -54, 8, 50);
        ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(-6, 6); ctx.moveTo(8, -4); ctx.lineTo(6, 6); ctx.stroke();
        ctx.fillStyle = '#8d6e63'; ctx.fillRect(-7, 6, 14, 9);
      } else if (o.kind === 'pig') {
        const f = Math.sin(o.t * 10) * 8;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-4, -10, 12, 6 + f * 0.3, -0.4 - f * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8bbd0';
        ctx.beginPath(); ctx.ellipse(0, 0, 20, 13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(18, -4, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f48fb1'; ctx.beginPath(); ctx.ellipse(26, -2, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#c2185b'; ctx.fillRect(25, -4, 1.5, 2); ctx.fillRect(27, -4, 1.5, 2);
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(19, -8, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8bbd0'; [-12, -4, 6, 12].forEach(x => ctx.fillRect(x, 9, 4, 7));
        ctx.strokeStyle = '#f48fb1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-22, -2, 4, 0, Math.PI * 1.5); ctx.stroke();
      }
      ctx.restore();
    });
  }

  function drawUfo(v) {
    if (!ufo) return;
    const { ctx } = v;
    const { x, y } = ufo;
    if (ufo.phase === 'beam') {
      const a = Math.min(1, ufo.t * 2, (4.5 - ufo.t) * 2);
      const g = ctx.createLinearGradient(0, y, 0, v.topY + 20);
      g.addColorStop(0, `rgba(255,255,140,${0.55 * a})`); g.addColorStop(1, `rgba(255,255,140,${0.08 * a})`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x - 14, y + 8); ctx.lineTo(x + 14, y + 8); ctx.lineTo(x + 70, v.topY + 20); ctx.lineTo(x - 70, v.topY + 20); ctx.closePath(); ctx.fill();
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(v.time * 2) * 0.08);
    ctx.fillStyle = 'rgba(178,235,242,.9)';
    ctx.beginPath(); ctx.arc(0, -6, 16, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#8bc34a'; ctx.beginPath(); ctx.arc(0, -8, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(-2, -9, 1.5, 0, Math.PI * 2); ctx.arc(2, -9, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#90a4ae'; ctx.beginPath(); ctx.ellipse(0, 0, 38, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#607d8b'; ctx.beginPath(); ctx.ellipse(0, 3, 38, 6, 0, 0, Math.PI); ctx.fill();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = Math.floor(v.time * 6 + i) % 2 ? '#ffeb3b' : '#ff5252';
      ctx.beginPath(); ctx.arc(-24 + i * 12, 2, 2.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- sea things
  // under: true = draw the ones under water, false = the ones poking out of the top
  function drawSea(v, under) {
    const { ctx, s, seaY, playH } = v;
    const band = playH - seaY;
    sea.forEach(o => {
      const surface = ['fin', 'duck', 'whale', 'serpent', 'tentacle', 'periscope'].includes(o.kind);
      if (surface === under) return;
      const px = v.sx(o.x);
      const py = surface ? seaY + 0.1 * s : seaY + 0.5 * s + (o.d ?? 0.5) * Math.max(0, band - 0.9 * s);
      if (!surface && band < 0.9 * s) return;
      ctx.save();
      ctx.translate(px, py);
      if (o.dir < 0 && o.kind !== 'tentacle' && o.kind !== 'eye') ctx.scale(-1, 1);
      const k = s;
      if (o.kind === 'fish') {
        const z = o.size * k, wag = Math.sin(o.t * 10) * 0.08;
        ctx.translate(0, Math.sin(o.t * 2 + o.x) * 0.06 * k);
        ctx.fillStyle = o.col;
        ctx.beginPath(); ctx.moveTo(-0.22 * z, 0); ctx.lineTo(-0.42 * z, (-0.14 + wag) * z); ctx.lineTo(-0.42 * z, (0.14 + wag) * z); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 0, 0.26 * z, 0.14 * z, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0.13 * z, -0.03 * z, 0.045 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0.14 * z, -0.03 * z, 0.022 * z, 0, Math.PI * 2); ctx.fill();
      } else if (o.kind === 'jelly') {
        const p = Math.sin(o.t * 2.5);
        ctx.translate(0, Math.sin(o.t * 1.2) * 0.2 * k);
        ctx.fillStyle = o.col; ctx.globalAlpha = 0.85;
        ctx.beginPath(); ctx.ellipse(0, 0, (0.3 + p * 0.03) * k, (0.22 - p * 0.03) * k, 0, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = o.col; ctx.lineWidth = 0.04 * k;
        for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 0.1 * k, 0); ctx.quadraticCurveTo((i * 0.1 + Math.sin(o.t * 3 + i) * 0.08) * k, 0.2 * k, i * 0.1 * k, 0.4 * k); ctx.stroke(); }
        ctx.fillStyle = '#4a148c'; ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(-0.08 * k, -0.08 * k, 0.025 * k, 0, Math.PI * 2); ctx.arc(0.08 * k, -0.08 * k, 0.025 * k, 0, Math.PI * 2); ctx.fill();
      } else if (o.kind === 'turtle') {
        const fl = Math.sin(o.t * 3) * 0.3;
        ctx.fillStyle = '#81c784';
        ctx.save(); ctx.rotate(fl); ctx.beginPath(); ctx.ellipse(0.15 * k, 0.12 * k, 0.2 * k, 0.07 * k, 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.save(); ctx.rotate(-fl); ctx.beginPath(); ctx.ellipse(-0.2 * k, 0.12 * k, 0.15 * k, 0.06 * k, -0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.beginPath(); ctx.arc(0.42 * k, -0.02 * k, 0.12 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.ellipse(0, 0, 0.36 * k, 0.2 * k, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#66bb6a'; [-0.15, 0.05].forEach(x => { ctx.beginPath(); ctx.arc(x * k, -0.08 * k, 0.06 * k, 0, Math.PI * 2); ctx.fill(); });
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0.47 * k, -0.05 * k, 0.025 * k, 0, Math.PI * 2); ctx.fill();
      } else if (o.kind === 'octopus') {
        ctx.translate(0, Math.sin(o.t * 2) * 0.12 * k);
        ctx.strokeStyle = '#ab47bc'; ctx.lineWidth = 0.07 * k; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) { const ox = (i - 2.5) * 0.08; ctx.beginPath(); ctx.moveTo(ox * k, 0.1 * k); ctx.quadraticCurveTo((ox - 0.2 + Math.sin(o.t * 4 + i) * 0.1) * k, 0.3 * k, (ox - 0.35) * k, (0.32 + Math.sin(o.t * 3 + i) * 0.06) * k); ctx.stroke(); }
        ctx.fillStyle = '#ba68c8'; ctx.beginPath(); ctx.ellipse(0, -0.05 * k, 0.25 * k, 0.22 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0.04 * k, -0.08 * k, 0.06 * k, 0, Math.PI * 2); ctx.arc(0.16 * k, -0.08 * k, 0.06 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0.06 * k, -0.08 * k, 0.03 * k, 0, Math.PI * 2); ctx.arc(0.18 * k, -0.08 * k, 0.03 * k, 0, Math.PI * 2); ctx.fill();
      } else if (o.kind === 'eye') {
        const open = Math.max(0, Math.min(1, o.t / 1.2, (o.life - o.t) / 1.2)) * (Math.abs(Math.sin(o.t * 2.2)) < 0.08 ? 0.1 : 1);
        ctx.translate(0, Math.max(0, band - 0.9 * k) * 0.35);
        ctx.fillStyle = 'rgba(10,30,60,.55)'; ctx.beginPath(); ctx.ellipse(0, 0, 0.9 * k, 0.5 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.scale(1, Math.max(0.02, open));
        ctx.fillStyle = '#fffde7'; ctx.beginPath(); ctx.ellipse(0, 0, 0.6 * k, 0.32 * k, 0, 0, Math.PI * 2); ctx.fill();
        const look = Math.sin(o.t * 0.8) * 0.2 * k;
        ctx.fillStyle = '#ff9800'; ctx.beginPath(); ctx.arc(look, 0, 0.24 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(look, 0, 0.06 * k, 0.2 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (o.kind === 'fin') {
        ctx.fillStyle = '#607d8b';
        ctx.beginPath(); ctx.moveTo(-0.3 * k, 0); ctx.quadraticCurveTo(0, -0.2 * k, 0.05 * k, -0.6 * k); ctx.quadraticCurveTo(0.15 * k, -0.2 * k, 0.3 * k, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-0.6 * k, 0.02 * k); ctx.lineTo(-0.35 * k, 0); ctx.stroke();
      } else if (o.kind === 'duck') {
        ctx.translate(0, Math.sin(o.t * 2.5) * 0.05 * k);
        ctx.rotate(Math.sin(o.t * 2) * 0.1);
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath(); ctx.ellipse(0, -0.1 * k, 0.3 * k, 0.16 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0.18 * k, -0.32 * k, 0.14 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff7043'; ctx.beginPath(); ctx.ellipse(0.34 * k, -0.3 * k, 0.08 * k, 0.04 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0.22 * k, -0.36 * k, 0.025 * k, 0, Math.PI * 2); ctx.fill();
      } else if (o.kind === 'whale') {
        ctx.fillStyle = '#5c6bc0';
        ctx.beginPath(); ctx.ellipse(0, 0.05 * k, 1.3 * k, 0.4 * k, 0, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-1.2 * k, 0); ctx.lineTo(-1.7 * k, -0.4 * k); ctx.lineTo(-1.5 * k, 0); ctx.lineTo(-1.75 * k, 0.05 * k); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(0.9 * k, -0.15 * k, 0.04 * k, 0, Math.PI * 2); ctx.fill();
        const sp = (o.t % 5) / 5;
        if (sp < 0.4) {
          ctx.strokeStyle = 'rgba(225,245,254,.9)'; ctx.lineWidth = 0.07 * k; ctx.lineCap = 'round';
          const hgt = Math.sin(sp / 0.4 * Math.PI) * 0.9 * k;
          ctx.beginPath(); ctx.moveTo(0.5 * k, -0.35 * k); ctx.lineTo(0.5 * k, -0.35 * k - hgt);
          ctx.moveTo(0.5 * k, -0.35 * k - hgt); ctx.quadraticCurveTo(0.3 * k, -0.4 * k - hgt, 0.25 * k, -0.3 * k - hgt * 0.6);
          ctx.moveTo(0.5 * k, -0.35 * k - hgt); ctx.quadraticCurveTo(0.7 * k, -0.4 * k - hgt, 0.75 * k, -0.3 * k - hgt * 0.6); ctx.stroke();
        }
      } else if (o.kind === 'serpent') {
        ctx.fillStyle = '#26a69a';
        for (let i = 0; i < 3; i++) {
          const up = Math.max(0, Math.sin(o.t * 2 - i * 0.9)) * 0.35 * k;
          ctx.beginPath(); ctx.ellipse(-i * 0.8 * k, 0.05 * k, 0.32 * k, 0.12 * k + up, 0, Math.PI, 0); ctx.fill();
        }
        const hb = Math.sin(o.t * 2 + 0.9) * 0.08 * k;
        ctx.beginPath(); ctx.moveTo(0.4 * k, 0.05 * k); ctx.quadraticCurveTo(0.5 * k, -0.6 * k + hb, 0.85 * k, -0.6 * k + hb); ctx.lineTo(0.85 * k, -0.35 * k + hb); ctx.quadraticCurveTo(0.7 * k, -0.3 * k, 0.65 * k, 0.05 * k); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0.9 * k, -0.52 * k + hb, 0.18 * k, 0.12 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0.92 * k, -0.58 * k + hb, 0.05 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(0.94 * k, -0.58 * k + hb, 0.025 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffab91'; ctx.beginPath(); ctx.moveTo(0.78 * k, -0.68 * k + hb); ctx.lineTo(0.72 * k, -0.82 * k + hb); ctx.lineTo(0.86 * k, -0.7 * k + hb); ctx.fill();
      } else if (o.kind === 'tentacle') {
        const up = Math.max(0, Math.min(1, o.t / 1.2, (o.life - o.t) / 1.2));
        const len = 2.4 * up * k, sw = Math.sin(o.t * 2.5) * 0.6 * k;
        ctx.strokeStyle = '#e57373'; ctx.lineCap = 'round';
        ctx.lineWidth = 0.32 * k;
        ctx.beginPath(); ctx.moveTo(0, 0.2 * k); ctx.quadraticCurveTo(sw, -len * 0.5, sw * 0.4 + 0.4 * k, -len); ctx.stroke();
        ctx.lineWidth = 0.18 * k;
        ctx.beginPath(); ctx.moveTo(sw * 0.4 + 0.4 * k, -len); ctx.quadraticCurveTo(sw * 0.4 + 0.7 * k, -len - 0.3 * k * up, sw * 0.4 + 0.6 * k, -len + 0.1 * k); ctx.stroke();
        ctx.fillStyle = '#ffcdd2';
        for (let i = 1; i < 5; i++) { const t = i / 5; const qx = 2 * (1 - t) * t * sw + t * t * (sw * 0.4 + 0.4 * k); const qy = (1 - t) * (1 - t) * 0.2 * k + 2 * (1 - t) * t * (-len * 0.5) + t * t * (-len); ctx.beginPath(); ctx.arc(qx + 0.1 * k, qy, 0.05 * k, 0, Math.PI * 2); ctx.fill(); }
      } else if (o.kind === 'periscope') {
        const look = Math.sin(o.t * 0.7) > 0.3 ? -1 : 1;
        ctx.fillStyle = '#546e7a'; ctx.fillRect(-0.04 * k, -0.9 * k, 0.08 * k, 0.95 * k);
        ctx.save(); ctx.scale(look, 1);
        ctx.fillRect(-0.04 * k, -0.95 * k, 0.24 * k, 0.12 * k);
        ctx.fillStyle = '#b3e5fc'; ctx.fillRect(0.17 * k, -0.93 * k, 0.04 * k, 0.08 * k);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-0.5 * k, 0.03 * k); ctx.lineTo(-0.1 * k, 0); ctx.stroke();
      }
      ctx.restore();
    });
  }

  return { update, drawClouds, drawSky, drawUfo, drawSea, _debug: { sky: () => sky, sea: () => sea, ufo: () => ufo, spawnSea, spawnSky, forceUfo: () => { nextUfo = 0; } } };
}
