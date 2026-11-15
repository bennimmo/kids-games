// Choo Choo Wilf: things that happen on the line. Each one blocks the
// track until it's over (the train stops itself in front of it).
// Some just need waiting for (ducks, cars, digger), some need a tap
// (barrier, animals on the line).
import { THREE, V3, bmesh, makeDuck, makeCar, makeDigger, makeBarrier, makeAnimal } from './models.js';
import { sfx } from './audio.js';

const HALF = Math.PI / 2;
const ANIMALS = {
  cow: { n: 2, scale: 1.25, sticker: '🐄', say: 'Cows on the track! Tap the cows!', sound: 'moo', speed: 2.2 },
  sheep: { n: 3, scale: 1.2, sticker: '🐑', say: 'Sheep on the track! Tap the sheep!', sound: 'baa', speed: 2.6 },
  penguin: { n: 3, scale: 1.3, sticker: '🐧', say: 'Penguins on the track! Tap the penguins!', sound: 'squawk', speed: 2.0 },
  crab: { n: 3, scale: 1.3, sticker: '🦀', say: 'Crabs on the track! Tap the crabs!', sound: 'click', speed: 2.8 },
};

export function createEvent(ev, biome, scene, r) {
  const g = new THREE.Group();
  const f = ev.frame;
  g.position.set(f.x, f.y, f.z);
  g.rotation.y = f.ry;
  scene.add(g);
  const E = {
    ev, group: g, blocked: true, needsTap: false, stopGap: 5, targets: [], spoke: false,
    hintObj: null, onWhistle: null,
    update() {},
    dispose() {
      scene.remove(g);
      g.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    },
  };
  const build = { ducks, crossing, barrier, digger, animals }[ev.type];
  build(E, r, biome);
  return E;
}

function speakOnce(E, c, dist, text) {
  if (!E.spoke && c.s > E.ev.s - dist) { E.spoke = true; c.say(text); }
}

// ---------------------------------------------------------------- ducks
function ducks(E, r) {
  const list = [];
  for (let i = 0; i < 4; i++) {
    const o = makeDuck(i === 0);
    o.scale.setScalar(i === 0 ? 1.8 : 1.1);
    o.position.set(-6.5 - i * 1.4, 0, (r() - 0.5) * 0.5);
    o.rotation.y = HALF;
    E.group.add(o);
    list.push({ o, hop: 0, ph: r() * 6 });
  }
  let walking = false;
  E.stopGap = 5.5;
  E.targets = list.map((d, i) => ({ obj: d.o, r: 70, tap() { d.hop = 1; i === 0 ? sfx.quack() : sfx.peep(); } }));
  E.onWhistle = () => list.forEach((d, i) => setTimeout(() => { d.hop = 1; }, i * 120));
  E.update = (dt, c) => {
    speakOnce(E, c, 42, 'Look! Ducks! Wait for the ducks.');
    if (!walking && c.s > E.ev.s - 26) { walking = true; sfx.quack(); }
    for (const d of list) {
      d.ph += dt * 11;
      if (walking && d.o.position.x < 12) {
        d.o.position.x += 1.8 * dt;
        d.o.rotation.z = Math.sin(d.ph) * 0.16;
      }
      d.hop = Math.max(0, d.hop - dt * 2.4);
      d.o.position.y = Math.sin(d.hop * Math.PI) * 0.9 + (walking ? Math.abs(Math.sin(d.ph)) * 0.06 : 0);
    }
    if (walking && E.blocked && Math.random() < dt * 0.7) (Math.random() < 0.5 ? sfx.quack : sfx.peep)();
    if (E.blocked && list[3].o.position.x > 2.5) { E.blocked = false; c.award('🦆', list[0].o); }
  };
}

// ---------------------------------------------------------------- level crossing with cars
function crossing(E, r, biome) {
  E.stopGap = 5.5;
  E.group.add(bmesh(b => {
    b.part('box', '#55595e', 0, 0.035, 0, 140, 0.04, 4.4);
    for (let x = -68; x < 68; x += 3) if (Math.abs(x) > 2.5) b.part('box', '#fafafa', x, 0.06, 0, 1.4, 0.01, 0.14);
    b.part('box', '#8d6e63', 0, 0.3, 0, 0.86, 0.12, 4.0);
    for (const s of [-1, 1]) b.part('box', '#8d6e63', s * 0.9, 0.3, 0, 0.6, 0.12, 4.0);
    for (const s of [-1, 1]) {
      const x = s * 2.9, z = -s * 2.9;
      b.part('box', '#eceff1', x, 1.4, z, 0.18, 2.8, 0.18);
      b.part('box', '#ffffff', x, 2.7, z, 1.4, 0.18, 0.06, 0, 0, 0.6);
      b.part('box', '#ffffff', x, 2.7, z, 1.4, 0.18, 0.06, 0, 0, -0.6);
      b.part('box', '#212121', x, 1.95, z, 1.1, 0.42, 0.3);
    }
  }));
  const on = '#ff1744', off = '#4a1010';
  const mA = new THREE.MeshBasicMaterial({ color: off }), mB = new THREE.MeshBasicMaterial({ color: off });
  const lg = new THREE.SphereGeometry(0.17, 10, 8);
  for (const s of [-1, 1]) for (const k of [-1, 1]) {
    const l = new THREE.Mesh(lg, k < 0 ? mA : mB);
    l.position.set(s * 2.9 + k * 0.3, 1.95, -s * 2.9 + s * -0.18);
    E.group.add(l);
  }
  const cars = [];
  const starts = [[-9, 1], [11, -1], [-15.5, 1]];
  if (biome.id === 'town') starts.push([18, -1]);
  starts.forEach(([x, dir], i) => {
    const kind = biome.id === 'town' && i === 1 ? 'bus' : r() < 0.25 ? 'van' : 'car';
    const c = makeCar(r, kind);
    c.group.position.set(x - dir * (kind === 'bus' ? 1.5 : 0), 0, dir > 0 ? -1.1 : 1.1);
    c.group.rotation.y = dir * HALF;
    E.group.add(c.group);
    cars.push({ c, dir });
  });
  let going = false, flash = 0, bell = 0;
  E.targets = cars.map(k => ({ obj: k.c.group, r: 80, tap: () => sfx.horn() }));
  E.onWhistle = () => setTimeout(() => sfx.horn(), 300);
  E.update = (dt, c) => {
    const near = c.s > E.ev.s - 60;
    speakOnce(E, c, 40, 'Cars crossing! Wait for the cars.');
    if (!going && (c.s > E.ev.s - 16 || (c.v < 0.2 && c.s > E.ev.s - 30))) { going = true; sfx.horn(); }
    if (going) for (const k of cars) {
      k.c.group.position.x += k.dir * 8.5 * dt;
      for (const w of k.c.wheels) w.rotation.x += 8.5 * dt / 0.32;
    }
    if (E.blocked && near) {
      flash += dt;
      const ph = Math.floor(flash * 2.4) % 2;
      mA.color.set(ph ? on : off); mB.color.set(ph ? off : on);
      if (c.s > E.ev.s - 40) { bell -= dt; if (bell <= 0) { bell = 0.55; sfx.bell(); } }
    }
    if (E.blocked && going && cars.every(k => k.dir * k.c.group.position.x > 1.8 + k.c.len / 2)) {
      E.blocked = false;
      mA.color.set(off); mB.color.set(off);
      c.award('🚗', cars[0].c.group);
    }
  };
  const d0 = E.dispose;
  E.dispose = () => { d0(); mA.dispose(); mB.dispose(); };
}

// ---------------------------------------------------------------- barrier: tap to lift
function barrier(E, r) {
  E.stopGap = 4.8;
  E.needsTap = true;
  const B = makeBarrier();
  E.group.add(B.group);
  const tapPoint = new THREE.Object3D();
  tapPoint.position.set(0, 1.2, 0.3);
  E.group.add(tapPoint);
  E.hintObj = tapPoint;
  let ang = 0, lifting = false, t = 0;
  const lift = c => { if (lifting) return; lifting = true; sfx.ding(); E.hintObj = null; };
  E.targets = [{ obj: tapPoint, r: 140, tap: () => lift() }];
  E.update = (dt, c) => {
    t += dt;
    speakOnce(E, c, 38, 'Oh no! The barrier is down. Tap the barrier!');
    if (!lifting && c.wait > 22) lift();
    B.light.material.color.set(!lifting && Math.floor(t * 2.5) % 2 ? '#ff1744' : '#5a1010');
    if (lifting) {
      ang = Math.min(1.45, ang + dt * 1.5);
      B.pivot.rotation.z = Math.sin(ang / 1.45 * HALF) * 1.45;
      if (E.blocked && ang > 1.0) { E.blocked = false; c.award('🚧', tapPoint); c.say('Hooray!'); }
    }
  };
  const d0 = E.dispose;
  E.dispose = () => { d0(); B.light.material.dispose(); };
}

// ---------------------------------------------------------------- digger drives across
function digger(E, r) {
  E.stopGap = 6;
  const D = makeDigger();
  D.group.scale.setScalar(1.2);
  D.group.position.set(-11, 0, 0);
  D.group.rotation.y = HALF;
  D.boom.rotation.x = -0.5;
  E.group.add(D.group);
  E.group.add(bmesh(b => {
    for (let i = 0; i < 6; i++) b.part('dodec', '#8d6e63', -13.5 + (i % 3) * 0.7, 0.3 + (i > 2 ? 0.45 : 0), 1.8 + (i % 2) * 0.6, 1.2, 0.8, 1.1, i, i);
  }));
  let state = 'park', t = 0, rum = 0, hop = 0;
  E.targets = [{ obj: D.group, r: 110, tap: () => { sfx.beep(); hop = 1; } }];
  E.onWhistle = () => setTimeout(() => sfx.beep(), 300);
  E.update = (dt, c) => {
    speakOnce(E, c, 40, 'A digger! Wait for the digger.');
    const p = D.group.position;
    if (state === 'park' && c.s > E.ev.s - 34) { state = 'in'; sfx.rumble(); }
    const moving = state === 'in' || state === 'out';
    if (moving) {
      p.x += 2.7 * dt;
      rum -= dt; if (rum <= 0) { rum = 1.1; sfx.rumble(); }
    }
    if (state === 'in' && p.x >= 0) { p.x = 0; state = 'dig'; t = 0; sfx.beep(); }
    if (state === 'dig') {
      t += dt;
      const ph = t / 1.6 * Math.PI * 2;
      D.boom.rotation.x = -0.15 + Math.sin(ph) * 0.45;
      D.stick.rotation.x = Math.sin(ph + 1) * 0.5;
      if (t > 3.2) { state = 'out'; D.boom.rotation.x = -0.5; D.stick.rotation.x = 0; }
    }
    hop = Math.max(0, hop - dt * 3);
    p.y = Math.sin(hop * Math.PI) * 0.4 + (moving ? Math.sin(c.time * 30) * 0.03 : 0);
    if (E.blocked && state === 'out' && p.x > 3.6) { E.blocked = false; c.award('🚜', D.group); }
    if (state === 'out' && p.x > 14) state = 'gone';
  };
}

// ---------------------------------------------------------------- animals on the line: tap them
function animals(E, r, biome) {
  const A = ANIMALS[biome.animal];
  E.stopGap = 5.5;
  E.needsTap = true;
  const list = [];
  for (let i = 0; i < A.n; i++) {
    const m = makeAnimal(biome.animal);
    m.group.scale.setScalar(A.scale);
    m.group.position.set((i - (A.n - 1) / 2) * 1.1 + (r() - 0.5) * 0.4, 0, (i - (A.n - 1) / 2) * 2.2);
    m.group.rotation.y = biome.animal === 'crab' ? 0 : (r() - 0.5) * 3;
    E.group.add(m.group);
    list.push({ m, state: 'stand', dir: 0, ph: r() * 6, hop: 0 });
  }
  const leave = a => {
    if (a.state !== 'stand') return;
    a.state = 'leave';
    a.dir = a.m.group.position.x > 0.2 ? 1 : a.m.group.position.x < -0.2 ? -1 : (r() < 0.5 ? -1 : 1);
    a.hop = 1;
    if (biome.animal !== 'crab') a.m.group.rotation.y = a.dir * HALF;
    sfx[A.sound]();
  };
  E.targets = list.map(a => ({ obj: a.m.group, r: 90, tap: () => (a.state === 'stand' ? leave(a) : (a.hop = 1, sfx[A.sound]())) }));
  E.onWhistle = () => list.forEach((a, i) => setTimeout(() => { a.hop = 1; }, i * 150));
  let moo = 2, gaveUp = false;
  E.update = (dt, c) => {
    speakOnce(E, c, 40, A.say);
    if (c.wait > 24 && !gaveUp) { gaveUp = true; list.forEach((a, i) => setTimeout(() => leave(a), i * 500)); }
    const stand = list.find(a => a.state === 'stand');
    E.hintObj = stand ? stand.m.group : null;
    if (stand && c.s > E.ev.s - 30) { moo -= dt; if (moo <= 0) { moo = 3 + Math.random() * 2; sfx[A.sound](); } }
    for (const a of list) {
      const g = a.m.group;
      a.ph += dt * (a.state === 'leave' ? 12 : 2);
      a.hop = Math.max(0, a.hop - dt * 2.5);
      if (a.state === 'leave') {
        g.position.x += a.dir * A.speed * dt;
        a.m.legs.forEach((l, i) => { if (biome.animal === 'crab') l.rotation.x = Math.sin(a.ph + i) * 0.5; else l.rotation.x = Math.sin(a.ph + (i % 2) * Math.PI) * 0.5; });
        if (Math.abs(g.position.x) > 10) a.state = 'gone';
      } else if (a.state === 'stand') {
        g.rotation.x = Math.sin(a.ph) * 0.04;
      }
      g.position.y = Math.sin(a.hop * Math.PI) * 0.7;
    }
    if (E.blocked && list.every(a => a.state !== 'stand' && Math.abs(a.m.group.position.x) > 3.2)) {
      E.blocked = false;
      c.award(A.sticker, list[0].m.group);
    }
  };
}
