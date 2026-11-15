// Sky Pilot: inside the cockpit. Panel with working instruments (drawn on a canvas), yoke/stick,
// throttle, seats and window frames. Fighter gets a green HUD on the glass.
import * as THREE from '../../js/vendor/three.module.min.js';
import { PLANES } from './planes.js';
import { AIRPORTS, CARRIER } from './island.js';

const D = Math.PI / 180;
const DIMS = {
  cub: { hw: 0.56, dist: 0.72, panelH: 0.42, roof: 0.42, floor: -0.85, yoke: true },
  splash: { hw: 0.66, dist: 0.8, panelH: 0.46, roof: 0.45, floor: -0.9, yoke: true },
  jumbo: { hw: 1.75, dist: 0.95, panelH: 0.55, roof: 0.55, floor: -1.0, yoke: true, twin: true },
  zoom: { hw: 0.46, dist: 0.68, panelH: 0.38, roof: null, floor: -0.8, stick: true, hud: true },
  whirly: { hw: 0.8, dist: 0.85, panelH: 0.32, roof: 0.65, floor: -0.95, stick: true, low: true },
};

const kts = v => v * 1.944, ft = m => m * 3.281;

export function buildCockpit(type, color) {
  const P = PLANES[type], d = DIMS[type];
  const [ex, ey, ez] = P.eye;
  const g = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.8 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x3c4046, roughness: 0.6 });
  const seat = new THREE.MeshStandardMaterial({ color: type === 'zoom' ? 0x3b3f2a : 0x5d4037, roughness: 0.9 });
  const paint = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
  const cx = d.twin ? 0 : ex;          // cabin centre
  const pz = ez + d.dist;               // panel distance
  const ptop = ey - (d.low ? 0.42 : 0.27), pbot = ptop - d.panelH;
  const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); g.add(o); return o; };

  // instrument canvas
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const pw = d.hw * 2 - 0.08;
  const panel = add(new THREE.PlaneGeometry(pw, d.panelH), new THREE.MeshBasicMaterial({ map: tex }), cx, (ptop + pbot) / 2, pz);
  panel.rotation.y = Math.PI; panel.rotation.x = -0.12; // faces the pilot (who looks along +z)
  // panel body + glare shield
  add(new THREE.BoxGeometry(d.hw * 2, d.panelH + 0.1, 0.3), dark, cx, (ptop + pbot) / 2, pz + 0.17);
  const gs = add(new THREE.BoxGeometry(d.hw * 2, 0.06, 0.32), trim, cx, ptop + 0.04, pz + 0.05);
  // sides (window sills) and floor
  for (const s of [1, -1]) {
    add(new THREE.BoxGeometry(0.06, ey - 0.2 - (ey + d.floor), 2.4), trim, cx + s * d.hw, (ey - 0.2 + ey + d.floor) / 2, ez - 0.2);
    if (d.roof !== null) {
      // window pillars
      const pil = add(new THREE.BoxGeometry(0.03, d.roof + 0.4, 0.03), dark, cx + s * (d.hw - 0.02), ptop + (d.roof + 0.3) / 2, pz - 0.15);
      pil.rotation.x = 0.45;
      add(new THREE.BoxGeometry(0.05, d.roof + 0.15, 0.05), dark, cx + s * (d.hw - 0.02), ey + 0.05, ez - 0.1);
    }
  }
  add(new THREE.BoxGeometry(d.hw * 2, 0.04, 2.6), dark, cx, ey + d.floor, ez - 0.1);
  if (d.roof !== null) {
    add(new THREE.BoxGeometry(d.hw * 2 + 0.06, 0.05, 1.6), paint, cx, ey + d.roof, ez - 0.25);
    if (d.twin) add(new THREE.BoxGeometry(0.035, 0.5, 0.035), trim, cx, ey + 0.15, pz - 0.1); // centre pillar
    if (type === 'jumbo') { // overhead panel
      const ov = add(new THREE.BoxGeometry(0.9, 0.08, 0.9), trim, cx, ey + d.roof - 0.06, ez - 0.1);
      ov.rotation.x = -0.15;
    }
  } else {
    // canopy bow
    const bow = add(new THREE.TorusGeometry(0.52, 0.025, 6, 24, Math.PI), dark, cx, ey - 0.15, pz - 0.15);
    bow.rotation.x = -0.6;
  }
  // seats
  const seats = d.twin ? [ex, -ex] : [ex];
  for (const sx of seats) {
    add(new THREE.BoxGeometry(0.5, 0.12, 0.5), seat, sx, ey - 0.62, ez - 0.05);
    add(new THREE.BoxGeometry(0.5, 0.8, 0.1), seat, sx, ey - 0.22, ez - 0.35);
  }
  if (!d.twin && type !== 'zoom') { // passenger seat
    add(new THREE.BoxGeometry(0.5, 0.12, 0.5), seat, -ex, ey - 0.62, ez - 0.05);
    add(new THREE.BoxGeometry(0.5, 0.8, 0.1), seat, -ex, ey - 0.22, ez - 0.35);
  }
  // yoke or stick
  const ctl = new THREE.Group(); g.add(ctl);
  const yokes = [];
  for (const sx of seats) {
    const y = new THREE.Group();
    if (d.yoke) {
      y.position.set(sx, ey - 0.42, pz - 0.35);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8).rotateX(Math.PI / 2), trim); col.position.z = 0.15; y.add(col);
      const wheel = new THREE.Group(); y.add(wheel);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.035), dark); wheel.add(bar);
      for (const s of [1, -1]) { const h = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.04), dark); h.position.set(s * 0.17, 0.05, 0); wheel.add(h); }
      y.userData.wheel = wheel;
    } else {
      y.position.set(sx, ey + d.floor, ez + 0.35);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.55, 8), dark); st.position.y = 0.27; y.add(st);
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), trim); grip.position.y = 0.58; y.add(grip);
    }
    ctl.add(y); yokes.push(y);
  }
  // throttle lever
  const thr = new THREE.Group();
  thr.position.set(d.twin ? cx : cx - (ex > 0 ? -1 : 1) * 0.05 + (type === 'zoom' ? ex + 0.32 : 0), ptop - d.panelH * 0.85, pz - 0.15);
  if (type === 'zoom') thr.position.set(cx + 0.36, ey - 0.55, ez + 0.1);
  if (type === 'whirly') thr.position.set(cx + ex + 0.25, ey - 0.65, ez + 0.05);
  const lever = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.2), trim); lever.position.z = 0.1; thr.add(lever);
  const knob = new THREE.Mesh(new THREE.BoxGeometry(type === 'jumbo' ? 0.16 : 0.06, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0x111111 })); knob.position.z = 0.2; thr.add(knob);
  g.add(thr);

  // fighter HUD
  let hud = null, hudCv = null, hudTex = null;
  if (d.hud) {
    hudCv = document.createElement('canvas'); hudCv.width = hudCv.height = 512;
    hudTex = new THREE.CanvasTexture(hudCv);
    hud = add(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), ex, ey + 0.0, ez + 0.55);
    hud.rotation.y = Math.PI;
    add(new THREE.BoxGeometry(0.2, 0.1, 0.12), dark, ex, ptop + 0.05, ez + 0.6);
  }

  g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });

  // ---------------------------------------------------------------- drawing
  const ctx = cv.getContext('2d');
  let acc = 0;
  function update(s, dt, force) {
    // controls move
    for (const y of yokes) {
      if (d.yoke) { y.position.z = pz - 0.35 - s.input.pitch * 0.06; y.userData.wheel.rotation.z = -s.input.roll * 0.8; }
      else { y.rotation.x = s.input.pitch * -0.3 * (type === 'whirly' ? -1 : 1); y.rotation.z = -s.input.roll * 0.3; }
    }
    thr.rotation.x = -(s.throttle - 0.5) * 1.0;
    acc += dt;
    if (acc < 0.08 && !force) return;
    acc = 0;
    if (P.panel === 'glass') drawGlass(ctx, s);
    else if (P.panel === 'fighter') { drawFighter(ctx, s); drawHud(hudCv.getContext('2d'), s); hudTex.needsUpdate = true; }
    else drawAnalog(ctx, s, type === 'whirly');
    tex.needsUpdate = true;
  }
  return { group: g, update };
}

// ---------------------------------------------------------------- analog six-pack
function dial(g, x, y, r, label) {
  g.save(); g.translate(x, y);
  g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, r + 6, 0, 7); g.fill();
  g.fillStyle = '#1b1d20'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.strokeStyle = '#555'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, r + 3, 0, 7); g.stroke();
  if (label) { g.fillStyle = '#9aa'; g.font = '600 15px Arial'; g.textAlign = 'center'; g.fillText(label, 0, r * 0.5); }
  return () => g.restore();
}
function ticks(g, r, from, to, n, major, labels) {
  for (let i = 0; i <= n; i++) {
    const a = from + (to - from) * i / n, big = i % major === 0;
    g.strokeStyle = '#eee'; g.lineWidth = big ? 3 : 1.5;
    g.beginPath(); g.moveTo(Math.sin(a) * r * (big ? 0.78 : 0.86), -Math.cos(a) * r * (big ? 0.78 : 0.86)); g.lineTo(Math.sin(a) * r * 0.95, -Math.cos(a) * r * 0.95); g.stroke();
    if (big && labels) { g.fillStyle = '#eee'; g.font = '600 17px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(labels(i), Math.sin(a) * r * 0.6, -Math.cos(a) * r * 0.6); }
  }
}
function needle(g, a, len, w = 4, col = '#fff') {
  g.save(); g.rotate(a); g.fillStyle = col; g.beginPath(); g.moveTo(-w, 10); g.lineTo(0, -len); g.lineTo(w, 10); g.fill(); g.restore();
  g.fillStyle = '#333'; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill();
}
function attitude(g, x, y, r, s) {
  g.save(); g.translate(x, y);
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip();
  g.rotate(-s.bank);
  const off = s.pitchAng / D * r / 30;
  g.fillStyle = '#2f7fd8'; g.fillRect(-r * 2, -r * 2 + off, r * 4, r * 2);
  g.fillStyle = '#8a5a2b'; g.fillRect(-r * 2, off, r * 4, r * 2);
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-r * 2, off); g.lineTo(r * 2, off); g.stroke();
  for (let p = -20; p <= 20; p += 10) if (p) { const yy = off - p * r / 30; g.beginPath(); g.moveTo(-r * 0.25, yy); g.lineTo(r * 0.25, yy); g.stroke(); }
  g.restore();
  g.save(); g.translate(x, y);
  g.strokeStyle = '#ffb300'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(-r * 0.6, 0); g.lineTo(-r * 0.2, 0); g.lineTo(-r * 0.1, r * 0.1); g.moveTo(r * 0.6, 0); g.lineTo(r * 0.2, 0); g.lineTo(r * 0.1, r * 0.1); g.stroke();
  g.fillStyle = '#ffb300'; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill();
  g.restore();
  g.save(); g.translate(x, y); g.strokeStyle = '#111'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, r + 4, 0, 7); g.stroke();
  g.strokeStyle = '#555'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, r + 8, 0, 7); g.stroke(); g.restore();
}
function drawAnalog(g, s, heli) {
  const P = s.P;
  g.fillStyle = '#2a2d31'; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = '#24272b'; g.fillRect(14, 14, 700, 484);
  const r = 100, X = [130, 360, 590], Y = [135, 375];
  // airspeed
  let done = dial(g, X[0], Y[0], r, 'KNOTS');
  const vmax = Math.max(160, Math.ceil(kts(P.vno) * 1.3 / 20) * 20);
  g.strokeStyle = '#2e7d32'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, r * 0.9, -Math.PI / 2 + (kts(P.vr * 0.9) / vmax) * 5.5 - 2.75 + Math.PI / 2 - Math.PI / 2, -Math.PI / 2 + (kts(P.vno) / vmax) * 5.5 - 2.75); g.stroke();
  ticks(g, r, -2.75, 2.75, 16, 2, i => Math.round(vmax * i / 16));
  needle(g, -2.75 + clamp01(kts(s.ias) / vmax) * 5.5, r * 0.82); done();
  // attitude
  attitude(g, X[1], Y[0], r, s);
  // altimeter
  done = dial(g, X[2], Y[0], r, 'ALT');
  ticks(g, r, 0, Math.PI * 2 - 0.0001, 50, 5, i => (i % 10 === 0 ? i / 5 : i / 5));
  const a = ft(s.alt);
  needle(g, (a % 1000) / 1000 * Math.PI * 2, r * 0.85, 3);
  needle(g, (a % 10000) / 10000 * Math.PI * 2, r * 0.55, 6, '#ccc');
  g.fillStyle = '#fff'; g.font = '700 20px monospace'; g.textAlign = 'center'; g.fillText(Math.round(a), 0, -r * 0.3); done();
  // turn coordinator / bank
  done = dial(g, X[0], Y[1], r, heli ? 'YAW' : 'TURN');
  g.save(); g.rotate(-s.bank * 0.8);
  g.strokeStyle = '#fff'; g.lineWidth = 5; g.beginPath(); g.moveTo(-r * 0.6, 0); g.lineTo(r * 0.6, 0); g.moveTo(0, 0); g.lineTo(0, -r * 0.18); g.stroke();
  g.restore();
  g.fillStyle = '#111'; g.fillRect(-r * 0.4, r * 0.25, r * 0.8, 18);
  g.fillStyle = '#fff'; g.beginPath(); g.arc(clamp(-(s.slip || 0) * 200, -r * 0.35, r * 0.35), r * 0.25 + 9, 8, 0, 7); g.fill(); done();
  // heading
  done = dial(g, X[1], Y[1], r, '');
  g.save(); g.rotate(-s.heading);
  for (let i = 0; i < 36; i++) {
    const big = i % 3 === 0; g.save(); g.rotate(i * 10 * D);
    g.strokeStyle = '#eee'; g.lineWidth = big ? 3 : 1.5; g.beginPath(); g.moveTo(0, -r * 0.95); g.lineTo(0, -r * (big ? 0.78 : 0.86)); g.stroke();
    if (big) { g.fillStyle = i % 9 === 0 ? '#ffb300' : '#eee'; g.font = '700 18px Arial'; g.textAlign = 'center'; g.fillText(['N', '3', '6', 'E', '12', '15', 'S', '21', '24', 'W', '30', '33'][i / 3], 0, -r * 0.6); }
    g.restore();
  }
  g.restore();
  g.fillStyle = '#ffb300'; g.beginPath(); g.moveTo(0, -r * 0.4); g.lineTo(-14, r * 0.25); g.lineTo(0, r * 0.12); g.lineTo(14, r * 0.25); g.fill(); done();
  // vertical speed
  done = dial(g, X[2], Y[1], r, 'UP / DOWN');
  ticks(g, r, -Math.PI / 2 - 2.6, -Math.PI / 2 + 2.6, 20, 5, i => Math.abs((i - 10) / 5 * 10));
  needle(g, -Math.PI / 2 + clamp(ft(s.vs) * 60 / 2000, -1, 1) * 2.6, r * 0.82); done();
  // right side: engine, throttle, flaps, gear, warnings
  engineBlock(g, s, 740, heli);
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clamp01 = v => clamp(v, 0, 1);
function engineBlock(g, s, x0, heli) {
  const P = s.P;
  let done = dial(g, x0 + 80, 110, 70, heli ? 'ROTOR' : 'RPM');
  ticks(g, 70, -2.4, 2.4, 10, 2, i => (i * 3));
  needle(g, -2.4 + s.rpm * 4.8, 58); done();
  // throttle bar
  g.fillStyle = '#111'; g.fillRect(x0 + 190, 40, 50, 170);
  g.fillStyle = s.ab ? '#ff7043' : '#43a047'; g.fillRect(x0 + 195, 205 - s.throttle * 160, 40, s.throttle * 160);
  g.fillStyle = '#ccc'; g.font = '600 15px Arial'; g.textAlign = 'center'; g.fillText(heli ? 'LIFT' : 'POWER', x0 + 215, 230);
  // gear lights
  g.font = '700 18px Arial';
  const gearTxt = P.gear === 'retract' ? (s.gear > 0.99 ? 'DOWN' : s.gear < 0.01 ? 'UP' : '...') : P.gear === 'floats' ? 'FLOATS' : P.gear === 'skids' ? 'SKIDS' : 'FIXED';
  g.fillStyle = '#111'; g.fillRect(x0 + 10, 260, 250, 60);
  g.fillStyle = s.gear > 0.99 ? '#43a047' : s.gear > 0.01 ? '#e53935' : '#666';
  for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x0 + 40 + i * 36, 290, 13, 0, 7); g.fill(); }
  g.fillStyle = '#eee'; g.textAlign = 'left'; g.fillText('GEAR ' + gearTxt, x0 + 150, 296);
  // flaps
  g.fillStyle = '#111'; g.fillRect(x0 + 10, 330, 250, 50);
  g.fillStyle = '#eee'; g.fillText('FLAPS ' + Math.round(s.flapPos) + ' / ' + (P.flaps.length - 1), x0 + 24, 362);
  // warnings
  const warn = s.stall ? 'STALL' : s.pullUp ? 'PULL UP' : s.gearWarn ? 'GEAR!' : s.brakes ? 'BRAKES' : '';
  g.fillStyle = '#111'; g.fillRect(x0 + 10, 390, 250, 60);
  if (warn) { g.fillStyle = warn === 'BRAKES' ? '#ffb300' : '#e53935'; g.font = '800 28px Arial'; g.textAlign = 'center'; g.fillText(warn, x0 + 135, 430); }
}

// ---------------------------------------------------------------- airliner glass cockpit
function drawGlass(g, s) {
  const P = s.P;
  g.fillStyle = '#25282c'; g.fillRect(0, 0, 1024, 512);
  const scr = (x, y, w, h) => { g.fillStyle = '#050608'; g.fillRect(x - 6, y - 6, w + 12, h + 12); g.fillStyle = '#000'; g.fillRect(x, y, w, h); };
  // PFD
  scr(20, 30, 330, 330);
  g.save(); g.beginPath(); g.rect(70, 60, 230, 270); g.clip();
  g.translate(185, 195); g.rotate(-s.bank);
  const off = s.pitchAng / D * 6;
  g.fillStyle = '#1e7fe0'; g.fillRect(-400, -400 + off, 800, 400);
  g.fillStyle = '#7a4a1f'; g.fillRect(-400, off, 800, 400);
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.font = '600 13px Arial'; g.fillStyle = '#fff'; g.textAlign = 'left';
  g.beginPath(); g.moveTo(-400, off); g.lineTo(400, off); g.stroke();
  for (let p = -30; p <= 30; p += 5) if (p) { const y = off - p * 6, w = p % 10 ? 18 : 40; g.beginPath(); g.moveTo(-w, y); g.lineTo(w, y); g.stroke(); if (!(p % 10)) g.fillText(Math.abs(p), w + 4, y + 4); }
  g.restore();
  g.strokeStyle = '#ffd400'; g.lineWidth = 5; g.beginPath(); g.moveTo(125, 195); g.lineTo(165, 195); g.lineTo(165, 205); g.moveTo(245, 195); g.lineTo(205, 195); g.lineTo(205, 205); g.stroke();
  g.fillStyle = '#ffd400'; g.fillRect(181, 191, 8, 8);
  // speed tape
  tape(g, 22, 60, 46, 270, kts(s.ias), 10, 4, '#fff', P);
  tape(g, 302, 60, 46, 270, ft(s.alt), 100, 0.4, '#fff');
  g.fillStyle = '#0f0'; g.font = '700 16px Arial'; g.textAlign = 'center';
  g.fillText(String(Math.round(((s.heading / D) % 360 + 360) % 360)).padStart(3, '0') + '°', 185, 352);
  g.fillText('VS ' + Math.round(ft(s.vs) * 60 / 100) * 100, 185, 50);
  // ND: compass + nearby airports
  scr(380, 30, 330, 330);
  g.save(); g.translate(545, 230);
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.arc(0, 0, 150, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.save(); g.rotate(-s.heading);
  for (let i = 0; i < 36; i++) { g.save(); g.rotate(i * 10 * D); g.beginPath(); g.moveTo(0, -150); g.lineTo(0, i % 3 ? -142 : -134); g.stroke(); if (i % 3 === 0) { g.fillStyle = '#fff'; g.font = '600 14px Arial'; g.textAlign = 'center'; g.fillText(i, 0, -118); } g.restore(); }
  // airports within 20 km
  for (const ap of AIRPORTS.concat([{ x: CARRIER.x, z: CARRIER.z, icon: '⚓', name: 'CVN' }])) {
    const dx = ap.x - s.pos.x, dz = ap.z - s.pos.z, dist = Math.hypot(dx, dz);
    if (dist > 20000) continue;
    const k = 150 / 20000;
    g.fillStyle = '#e040fb'; g.beginPath(); g.arc(dx * k, dz * k, 5, 0, 7); g.fill();
    g.save(); g.translate(dx * k, dz * k); g.rotate(s.heading); g.fillStyle = '#e040fb'; g.font = '600 12px Arial'; g.fillText(ap.name.split(' ')[0].toUpperCase(), 8, 4); g.restore();
  }
  g.restore();
  g.fillStyle = '#ffd400'; g.beginPath(); g.moveTo(0, -12); g.lineTo(-9, 10); g.lineTo(9, 10); g.fill();
  g.restore();
  g.fillStyle = '#0ff'; g.font = '600 14px Arial'; g.textAlign = 'left'; g.fillText('GS ' + Math.round(kts(s.speed)), 392, 52);
  // EICAS
  scr(740, 30, 260, 330);
  for (const [i, x] of [[0, 810], [1, 930]]) {
    g.save(); g.translate(x, 110);
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 45, Math.PI * 0.75, Math.PI * 2.25); g.stroke();
    g.strokeStyle = s.ab ? '#ff9800' : '#0f0'; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 38, Math.PI * 0.75, Math.PI * 0.75 + s.rpm * Math.PI * 1.5); g.stroke();
    g.fillStyle = '#fff'; g.font = '700 18px Arial'; g.textAlign = 'center'; g.fillText((s.rpm * 100).toFixed(0), 0, 8);
    g.font = '600 12px Arial'; g.fillText('N1', 0, 62);
    g.restore();
  }
  g.font = '700 18px Arial'; g.textAlign = 'left';
  const gearCol = s.gear > 0.99 ? '#0f0' : s.gear > 0.01 ? '#f44' : '#888';
  g.fillStyle = gearCol;
  for (let i = 0; i < 3; i++) { g.strokeStyle = gearCol; g.lineWidth = 3; g.strokeRect(770 + i * 60, 210, 48, 30); g.fillText(s.gear > 0.99 ? 'DN' : s.gear > 0.01 ? '--' : 'UP', 778 + i * 60, 232); }
  g.fillStyle = '#fff'; g.fillText('FLAPS ' + Math.round(s.flapPos), 770, 280);
  g.fillStyle = '#0ff'; g.fillText((s.brakes ? 'BRAKES ' : '') + (s.reverse ? 'REV' : ''), 770, 310);
  const warn = s.stall ? 'STALL' : s.pullUp ? 'PULL UP' : s.gearWarn ? 'GEAR' : '';
  if (warn) { g.fillStyle = '#f44'; g.font = '800 26px Arial'; g.fillText(warn, 770, 345); }
  // lower panel: big throttle bars
  g.fillStyle = '#1c1f22'; g.fillRect(380, 380, 330, 120);
  g.fillStyle = '#ccc'; g.font = '600 14px Arial'; g.fillText('AGL ' + Math.round(ft(Math.max(0, s.agl))) + ' ft', 400, 410);
  g.fillText('AOA ' + (s.aoa / D).toFixed(1) + '°', 400, 440);
  g.fillText('G ' + s.gload.toFixed(1), 400, 470);
}
function tape(g, x, y, w, h, val, step, pxPer, col, P) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = 'rgba(60,60,70,.8)'; g.fillRect(x, y, w, h);
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2; g.font = '600 13px Arial'; g.textAlign = 'center';
  const mid = y + h / 2;
  const start = Math.floor((val - h / 2 / pxPer) / step) * step;
  for (let v = start; v < val + h / 2 / pxPer; v += step) {
    const yy = mid - (v - val) * pxPer;
    g.beginPath(); g.moveTo(x + w - 8, yy); g.lineTo(x + w, yy); g.stroke();
    if (Math.round(v / step) % 2 === 0 && v >= 0) g.fillText(Math.round(v), x + w / 2 - 3, yy + 4);
  }
  g.restore();
  g.fillStyle = '#000'; g.fillRect(x - 2, mid - 13, w + 4, 26); g.strokeStyle = '#ffd400'; g.lineWidth = 2; g.strokeRect(x - 2, mid - 13, w + 4, 26);
  g.fillStyle = '#fff'; g.font = '700 15px Arial'; g.textAlign = 'center'; g.fillText(Math.round(val), x + w / 2, mid + 5);
}

// ---------------------------------------------------------------- fighter
function drawFighter(g, s) {
  g.fillStyle = '#1d2024'; g.fillRect(0, 0, 1024, 512);
  const scr = (x, y, w, h) => { g.fillStyle = '#0a0b0c'; g.fillRect(x - 8, y - 8, w + 16, h + 16); g.fillStyle = '#000'; g.fillRect(x, y, w, h); };
  scr(40, 60, 300, 300); scr(684, 60, 300, 300); scr(380, 40, 264, 200);
  // left: attitude
  attitude(g, 190, 210, 130, s);
  // right: radar map
  g.save(); g.translate(834, 210); g.beginPath(); g.rect(-150, -150, 300, 300); g.clip();
  g.strokeStyle = '#0f0'; g.lineWidth = 1.5;
  for (const r of [40, 80, 120]) { g.beginPath(); g.arc(0, 60, r, Math.PI, 0); g.stroke(); }
  g.rotate(-s.heading);
  for (const ap of AIRPORTS.concat([{ x: CARRIER.x, z: CARRIER.z }])) {
    const k = 120 / 25000, dx = (ap.x - s.pos.x) * k, dz = (ap.z - s.pos.z) * k;
    g.fillStyle = '#0f0'; g.fillRect(dx - 4, dz + 60 - 4 + 0, 8, 8);
  }
  g.restore();
  // centre: up-front
  g.fillStyle = '#0f0'; g.font = '700 22px monospace'; g.textAlign = 'left';
  g.fillText('SPD ' + Math.round(kts(s.ias)), 400, 80);
  g.fillText('ALT ' + Math.round(ft(s.alt)), 400, 112);
  g.fillText('G   ' + s.gload.toFixed(1), 400, 144);
  g.fillText('THR ' + Math.round(s.throttle * 100) + (s.ab ? ' AB' : ''), 400, 176);
  g.fillText('GEAR ' + (s.gear > 0.99 ? 'DN' : s.gear > 0.01 ? '--' : 'UP') + '  HOOK', 400, 208);
  const warn = s.stall ? 'STALL' : s.pullUp ? 'PULL UP' : s.gearWarn ? 'GEAR' : '';
  if (warn) { g.fillStyle = '#f33'; g.font = '800 40px Arial'; g.textAlign = 'center'; g.fillText(warn, 512, 320); }
}
function drawHud(g, s) {
  g.clearRect(0, 0, 512, 512);
  g.strokeStyle = '#39ff7a'; g.fillStyle = '#39ff7a'; g.lineWidth = 3; g.font = '700 26px monospace'; g.textAlign = 'center';
  g.save(); g.translate(256, 256); g.rotate(-s.bank);
  const k = 9;
  for (let p = -40; p <= 40; p += 10) {
    const y = (s.pitchAng / D - p) * k;
    if (Math.abs(y) > 200) continue;
    g.setLineDash(p < 0 ? [10, 8] : []);
    g.beginPath(); g.moveTo(-110, y); g.lineTo(-40, y); g.moveTo(40, y); g.lineTo(110, y); g.stroke();
    if (p) { g.fillText(Math.abs(p), -140, y + 9); g.fillText(Math.abs(p), 140, y + 9); }
  }
  g.setLineDash([]);
  g.restore();
  // flight path marker
  const fpY = s.speed > 5 ? -(Math.asin(clamp(s.vel.y / s.speed, -1, 1)) - s.pitchAng) / D * k : 0;
  g.beginPath(); g.arc(256, 256 - fpY, 12, 0, 7); g.moveTo(244, 256 - fpY); g.lineTo(222, 256 - fpY); g.moveTo(268, 256 - fpY); g.lineTo(290, 256 - fpY); g.moveTo(256, 244 - fpY); g.lineTo(256, 230 - fpY); g.stroke();
  g.textAlign = 'left'; g.fillText(Math.round(kts(s.ias)), 20, 270);
  g.textAlign = 'right'; g.fillText(Math.round(ft(s.alt)), 492, 270);
  g.textAlign = 'center'; g.fillText(String(Math.round(((s.heading / D) % 360 + 360) % 360)).padStart(3, '0'), 256, 40);
  g.fillText(s.gload.toFixed(1) + 'G', 70, 480);
}
