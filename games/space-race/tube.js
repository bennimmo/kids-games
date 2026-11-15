// Star Dash, style A: Tube Race.
// Ships fly inside a glowing tube. Left/right slides round the wall, up = faster, down = brake.
// Rocks stick to the wall (bonk = slow down), green arrows = boost.
// The same seed always makes the same tube, rocks and arrows (needed for online).
import { THREE, V3, UP, clamp, wrapAng, rng, addSky, makeRockField, makeShip, setFlames, shipTrails, loopCurve, textures, textTex } from './art.js';

export const TUBE_LAPS = 3;
const R = 16;           // tube radius
const RIDE = R - 2.2;   // ships fly this far from the middle
const M = 3000;         // samples along the track

export function createTube({ scene, seed, dpr }) {
  const r = rng(seed);
  const T = textures();
  addSky(scene, dpr);
  const curve = loopCurve(r.range(660, 760), r.range(60, 90), 14, 0.8, r.range(0.2, 0.32), r() * 6.28);
  const L = curve.getLength();

  // frames along the track: p = middle, t = forward, n = "up-ish", b = sideways
  const P = [], TT = [], N = [], B = [];
  for (let i = 0; i <= M; i++) {
    const u = (i / M) % 1, t = curve.getTangentAt(u).normalize();
    const b = new V3().crossVectors(t, UP).normalize(), n = new V3().crossVectors(b, t);
    P.push(curve.getPointAt(u)); TT.push(t); N.push(n); B.push(b);
  }
  const mkF = () => ({ p: new V3(), t: new V3(), n: new V3(), b: new V3() });
  function frame(s, out) {
    const u = (((s % L) + L) % L) / L * M, i = Math.min(M - 1, Math.floor(u)), f = u - i;
    out.p.lerpVectors(P[i], P[i + 1], f); out.t.lerpVectors(TT[i], TT[i + 1], f).normalize();
    out.n.lerpVectors(N[i], N[i + 1], f).normalize(); out.b.lerpVectors(B[i], B[i + 1], f).normalize();
    return out;
  }
  const radial = (f, ang, out) => out.copy(f.n).multiplyScalar(Math.cos(ang)).addScaledVector(f.b, Math.sin(ang));
  const dsOf = (a, b) => { let d = (a - b) % L; if (d > L / 2) d -= L; if (d < -L / 2) d += L; return d; };
  const tmp = mkF();

  // ---- glowing see-through tube
  const tubeMat = new THREE.ShaderMaterial({
    uniforms: { uK: { value: L / 9 }, uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform float uK; uniform float uTime; varying vec2 vUv;
      void main(){
        float a = fract(vUv.x * uK); float la = smoothstep(0.07, 0.0, min(a, 1.-a));
        float b = fract(vUv.y * 16.); float lb = smoothstep(0.04, 0.0, min(b, 1.-b));
        vec3 c = mix(vec3(0.25,0.45,1.0), vec3(0.95,0.3,1.0), 0.5 + 0.5*sin(vUv.x*6.2831*5. + uTime*0.6));
        gl_FragColor = vec4(c * (0.045 + 0.55*la + 0.32*lb), 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 1400, R, 32, true), tubeMat));

  // ---- rainbow hoops
  const hoopCount = Math.floor(L / 32);
  const hoops = new THREE.InstancedMesh(new THREE.TorusGeometry(R + 0.3, 0.22, 6, 56), new THREE.MeshBasicMaterial({ color: 0xffffff }), hoopCount);
  const m4 = new THREE.Matrix4(), col = new THREE.Color();
  for (let i = 0; i < hoopCount; i++) {
    const f = frame(i * L / hoopCount, tmp); m4.makeBasis(f.b, f.n, f.t).setPosition(f.p); hoops.setMatrixAt(i, m4);
    hoops.setColorAt(i, col.setHSL(i / hoopCount, 0.9, 0.6));
  }
  scene.add(hoops);

  // ---- start / finish gate
  const f0 = frame(0, mkF());
  const gate = new THREE.Mesh(new THREE.TorusGeometry(R + 1.4, 1.1, 14, 72), new THREE.MeshBasicMaterial({ map: T.checker }));
  gate.matrixAutoUpdate = false; gate.matrix.makeBasis(f0.b, f0.n, f0.t).setPosition(f0.p); scene.add(gate);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(28, 7), new THREE.MeshBasicMaterial({ map: textTex('FINISH', '#ffd54f'), transparent: true, depthWrite: false }));
  banner.matrixAutoUpdate = false;
  banner.matrix.makeBasis(f0.b.clone().negate(), f0.n, f0.t.clone().negate()).setPosition(f0.p.clone().addScaledVector(f0.n, R + 7));
  scene.add(banner);

  // ---- boost arrows on the wall
  const pads = [];
  const padMat = new THREE.MeshBasicMaterial({ map: T.chevron, color: 0x39ffc4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const padGeo = new THREE.PlaneGeometry(5, 8), rad = new V3();
  for (let s = 260; s < L - 80; s += r.range(90, 150)) {
    const ang = Math.PI + r.range(-1.6, 1.6), f = frame(s, tmp);
    radial(f, ang, rad);
    const z = rad.clone().negate(), x = new V3().crossVectors(f.t, z);
    const m = new THREE.Mesh(padGeo, padMat); m.matrixAutoUpdate = false;
    m.matrix.makeBasis(x, f.t, z).setPosition(f.p.clone().addScaledVector(rad, R - 0.2)); scene.add(m);
    pads.push({ s, ang });
  }

  // ---- rocks: inside the tube (stuck to the wall) + lots outside for looks
  const rocks = [];
  for (let s = 180; s < L - 40; s += r.range(24, 44)) {
    if (pads.some(p => Math.abs(p.s - s) < 18)) continue;
    const ang = r() * Math.PI * 2, size = r.range(2.6, 3.8), f = frame(s, tmp);
    rocks.push({ s, ang, size, inside: true, danger: true, pos: f.p.clone().addScaledVector(radial(f, ang, rad), R - size * 0.55) });
    if (r() < 0.38) {
      const a2 = ang + r.range(1.2, 2.2) * (r() < 0.5 ? 1 : -1), s2 = r.range(2.6, 3.4);
      rocks.push({ s, ang: a2, size: s2, inside: true, danger: true, pos: f.p.clone().addScaledVector(radial(f, a2, rad), R - s2 * 0.55) });
    }
  }
  for (let i = 0; i < 220; i++) {
    const f = frame(r() * L, tmp);
    rocks.push({ pos: f.p.clone().add(r.dir().multiplyScalar(r.range(45, 260))), size: r.range(3, 22) });
  }
  const spinRocks = makeRockField(scene, rocks, r);
  const inside = rocks.filter(k => k.inside);

  // ---------------------------------------------------------------- ships
  function addShip({ color, slot = 0, of = 2 }) {
    const mesh = makeShip(color); mesh.scale.setScalar(0.62); scene.add(mesh);
    const spread = of <= 1 ? 0 : 0.76 / (of - 1);
    return {
      mesh, trail: shipTrails(scene, mesh, color, 0.32), color,
      s: -12, ang: Math.PI + (of <= 1 ? 0 : -0.38 + slot * spread), angV: 0, speed: 0, boost: 0, hit: 0, spin: 0,
      done: false, input: {}, events: [], ai: { t: 0, target: Math.PI }, camUp: new V3(0, 1, 0), net: null,
    };
  }

  // computer driver. skill ~0.85 (easy) .. 1.03 (hard)
  function aiInput(sh, skill, dt) {
    const a = sh.ai; a.t -= dt;
    if (a.t <= 0) {
      a.t = (0.32 - skill * 0.2) * (0.7 + Math.random() * 0.6);
      let threat = null, best = 1e9;
      for (const k of inside) {
        const ds = dsOf(k.s, sh.s);
        if (ds > 2 && ds < 85 && Math.abs(wrapAng(k.ang - sh.ang)) * RIDE < k.size + 4.5 && ds < best) { best = ds; threat = k; }
      }
      if (threat && Math.random() < 0.6 + skill * 0.38) {
        const dir = wrapAng(sh.ang - threat.ang) >= 0 ? 1 : -1;
        a.target = threat.ang + dir * (threat.size + 6.5) / R;
      } else if (!threat) {
        let pad = null, pb = 1e9;
        for (const p of pads) { const ds = dsOf(p.s, sh.s); if (ds > 5 && ds < 130 && ds < pb) { pb = ds; pad = p; } }
        if (pad && Math.random() < skill * 0.85) a.target = pad.ang;
      }
    }
    const diff = wrapAng(a.target - sh.ang);
    return { l: diff > 0.05, r: diff < -0.05, u: Math.random() < 0.55 + skill * 0.4, d: false };
  }

  const up = new V3(), fwd = new V3(), right = new V3(), mB = new THREE.Matrix4(), cf = mkF();

  function simulate(sh, dt, racing) {
    const inp = sh.input;
    if (racing && !sh.done) {
      const steer = ((inp.r ? 1 : 0) - (inp.l ? 1 : 0)) || inp.sx || 0; // buttons, or tilt
      sh.angV += (-steer * 2.7 - sh.angV) * Math.min(1, dt * 9);
      sh.ang = wrapAng(sh.ang + sh.angV * dt);
      let target = (58 + (inp.u ? 42 : 0) - (inp.d ? 30 : 0)) * (sh.topSpeed || 1);
      if (sh.boost > 0) target = 155 * (sh.topSpeed || 1);
      if (sh.hit > 0) target = Math.min(target, 30);
      sh.speed += (target - sh.speed) * Math.min(1, dt * (sh.boost > 0 ? 3 : 1.3));
    } else if (sh.done) {
      sh.speed += (40 - sh.speed) * Math.min(1, dt);
      sh.angV *= 1 - Math.min(1, dt * 4);
    }
    sh.s += sh.speed * dt;
    sh.boost = Math.max(0, sh.boost - dt); sh.hit = Math.max(0, sh.hit - dt);
    if (!racing || sh.done) return;
    for (const k of inside) {
      if (sh.hit > 0) break;
      if (Math.abs(dsOf(k.s, sh.s)) < k.size + 1.4 && Math.abs(wrapAng(k.ang - sh.ang)) * RIDE < k.size + 1.6) {
        sh.speed *= 0.3; sh.hit = 0.9; sh.boost = 0; sh.spin = 9;
        sh.angV += wrapAng(sh.ang - k.ang) > 0 ? 3 : -3;
        sh.events.push('bonk');
      }
    }
    for (const p of pads) {
      if (sh.boost < 1.2 && Math.abs(dsOf(p.s, sh.s)) < 4 && Math.abs(wrapAng(p.ang - sh.ang)) * R < 3.4) { sh.boost = 1.6; sh.events.push('boost'); }
    }
    const lapNow = Math.floor(sh.s / L);
    if (sh.lastLap === undefined) sh.lastLap = lapNow;
    if (lapNow > sh.lastLap) { sh.lastLap = lapNow; if (lapNow >= TUBE_LAPS) { sh.done = true; sh.events.push('finish'); } else sh.events.push('lap'); }
  }

  // a friend's ship online: glide towards where they said they are
  function follow(sh, dt) {
    const n = sh.net; if (!n) return;
    n.s += n.v * dt;
    sh.s += (n.s - sh.s) * Math.min(1, dt * 8);
    sh.ang = wrapAng(sh.ang + wrapAng(n.a - sh.ang) * Math.min(1, dt * 10));
    sh.angV = n.av; sh.speed = n.v; sh.boost = n.b; sh.hit = n.h; sh.done = n.d;
  }

  function place(sh, dt) {
    const f = frame(sh.s, cf);
    radial(f, sh.ang, rad);
    up.copy(rad).negate(); fwd.copy(f.t); right.crossVectors(up, fwd);
    mB.makeBasis(right, up, fwd);
    sh.mesh.position.copy(f.p).addScaledVector(rad, RIDE);
    sh.mesh.quaternion.setFromRotationMatrix(mB);
    sh.spin *= Math.exp(-dt * 4);
    sh.mesh.userData.inner.rotation.z = -sh.angV * 0.22 + (sh.spin > 0.3 ? Math.sin(sh.spin) * 0.8 : 0);
    const power = clamp((sh.speed - 30) / 120, 0, 1) + (sh.boost > 0 ? 0.5 : 0);
    setFlames(sh.mesh, power);
    sh.trail(right, power);
  }

  function step(dt, racing, t, ships) {
    tubeMat.uniforms.uTime.value = t;
    T.chevron.offset.y -= dt * 2.5;
    spinRocks(dt);
    for (const sh of ships) { if (sh.ctrl === 'remote') follow(sh, dt); else simulate(sh, dt, racing); }
    // local ships get nudged apart
    for (let i = 0; i < ships.length; i++) for (let j = i + 1; j < ships.length; j++) {
      const a = ships[i], b = ships[j], d = wrapAng(a.ang - b.ang);
      if (Math.abs(dsOf(a.s, b.s)) < 4 && Math.abs(d) * RIDE < 3.5) {
        const push = (d >= 0 ? 1 : -1) * 0.06;
        if (a.ctrl !== 'remote') a.ang += push;
        if (b.ctrl !== 'remote') b.ang -= push;
      }
    }
    for (const sh of ships) place(sh, dt);
  }

  const look = new V3(), uC = new V3();
  function camera(cam, sh, dt) {
    const f = frame(sh.s - 17, cf);
    radial(f, sh.ang, rad);
    uC.copy(rad).negate();
    sh.camUp.lerp(uC, Math.min(1, dt * 10)).normalize();
    cam.position.copy(f.p).addScaledVector(rad, RIDE - 6.5);
    frame(sh.s, cf);
    look.copy(sh.mesh.position).addScaledVector(cf.t, 22).addScaledVector(uC, 2.2);
    cam.up.copy(sh.camUp); cam.lookAt(look);
    const fov = 68 + (sh.speed - 55) * 0.13 + (sh.boost > 0 ? 6 : 0);
    cam.fov += (fov - cam.fov) * Math.min(1, dt * 4); cam.updateProjectionMatrix();
    if (sh.hit > 0) cam.position.addScaledVector(rad.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), sh.hit * 1.2);
  }

  return {
    kind: 'tube', LAPS: TUBE_LAPS,
    addShip, step, camera, aiInput,
    progress: sh => clamp(sh.s / (TUBE_LAPS * L), 0, 1),
    lap: sh => clamp(Math.floor(sh.s / L) + 1, 1, TUBE_LAPS),
    speed01: sh => clamp(sh.speed / 155, 0, 1),
    // online: what we send, and how we use what a friend sends
    state: sh => ({ s: +sh.s.toFixed(2), a: +sh.ang.toFixed(3), av: +sh.angV.toFixed(2), v: +sh.speed.toFixed(1), b: +sh.boost.toFixed(2), h: +sh.hit.toFixed(2), d: sh.done }),
    applyRemote(sh, d, age) {
      if (typeof d.s !== 'number') return;
      const first = !sh.net;
      sh.net = { s: d.s + (d.v || 0) * age, a: +d.a || 0, av: +d.av || 0, v: +d.v || 0, b: +d.b || 0, h: +d.h || 0, d: !!d.d };
      if (first) { sh.s = sh.net.s; sh.ang = sh.net.a; }
    },
  };
}
