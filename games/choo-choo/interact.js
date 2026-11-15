// Choo Choo Wilf: little surprises when you tap things in the world.
// Houses → someone waves, trees → squirrel / apple / coconut, bushes → bunny,
// flowers → butterflies, ponds → fish, field animals jump, clouds rain then
// make a rainbow.
import { THREE, V3, emojiSprite, puffTexture } from './models.js';
import { sfx } from './audio.js';

const PEOPLE = ['🙋‍♀️', '🙋‍♂️', '👵', '👴', '👧', '👦', '🧑', '👩', '👨', '👶'];
const ANIMAL_SOUND = { cow: 'moo', sheep: 'baa', duck: 'quack', penguin: 'squawk', crab: 'click' };
const RAINBOW = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de'];

export class Fun {
  constructor(scene, r, award) {
    this.scene = scene; this.r = r; this.award = award;
    this.fx = [];
    this.time = 0;
    // rain drops
    const N = 160;
    this.rainPos = new Float32Array(N * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.rainPos, 3));
    this.rain = new THREE.Points(g, new THREE.PointsMaterial({ color: '#2f8cff', size: 0.55, map: puffTexture(), transparent: true, depthWrite: false }));
    this.rain.visible = false; this.rain.frustumCulled = false;
    scene.add(this.rain);
    this.rainT = 0; this.rainCloud = null;
    this.rainbowGeo = RAINBOW.map((c, i) => new THREE.TorusGeometry(9 - i * 0.6, 0.34, 6, 48, Math.PI));
  }

  // where a tappable thing is (for hit testing)
  pos(t, out) {
    if (t.obj) { t.obj.getWorldPosition(out); out.y += t.kind === 'cloud' ? 0 : 1; }
    else out.set(t.x, t.h * 0.6, t.z);
    return out;
  }

  tap(t, ctx) {
    if (t.busy > this.time) return;
    const r = this.r, top = new V3(t.x, t.h, t.z);
    switch (t.kind) {
      case 'critter':
        t.hop = 1; sfx[ANIMAL_SOUND[t.animal]]();
        return;
      case 'house': case 'building': case 'hut': case 'igloo':
        t.busy = this.time + 3;
        this.pop(PEOPLE[(r() * PEOPLE.length) | 0], top, 3, 1.8);
        sfx.hello();
        return;
      case 'tree':
        t.busy = this.time + 2;
        if (ctx.night > 0.5) { this.pop('🦉', top, 2.5, 1.5); sfx.hoot(); }
        else if (r() < 0.5) { this.drop('🍎', top, 1.1); sfx.pop(); }
        else { this.pop('🐿️', top, 2, 1.6); sfx.squeak(); }
        return;
      case 'pine': case 'snowpine':
        t.busy = this.time + 2;
        if (t.kind === 'snowpine') this.burst(top, 6);
        if (ctx.night > 0.5) { this.pop('🦉', top, 2.5, 1.5); sfx.hoot(); }
        else { this.pop('🐿️', top, 2, 1.6); sfx.squeak(); }
        return;
      case 'palm':
        t.busy = this.time + 2;
        this.drop('🥥', top, 1.1); sfx.pop();
        return;
      case 'bush':
        t.busy = this.time + 2;
        this.hop('🐰', new V3(t.x, 0.6, t.z)); sfx.boing();
        return;
      case 'mushroom':
        t.busy = this.time + 2;
        this.hop('🐸', new V3(t.x, 0.6, t.z)); sfx.croak();
        return;
      case 'hay':
        t.busy = this.time + 2;
        this.pop('🐭', top, 1.8, 1.2); sfx.squeak();
        return;
      case 'flowers':
        t.busy = this.time + 3;
        for (let i = 0; i < 3; i++) this.flutter('🦋', new V3(t.x + (r() - 0.5), 0.6, t.z + (r() - 0.5)), i * 0.25);
        sfx.sticker();
        return;
      case 'pond':
        t.busy = this.time + 2;
        this.jumpFish(new V3(t.x, 0.2, t.z)); sfx.splash();
        return;
      case 'snowman':
        t.busy = this.time + 2;
        this.burst(top, 8); this.pop('❄️', top, 1.8, 1.2); sfx.boing();
        return;
      case 'cloud':
        if (this.rainCloud) return;
        t.busy = this.time + 9;
        this.startRain(t);
        return;
    }
  }

  // ------------------------------------------------------------ effects
  sprite(e, size, p) {
    const sp = emojiSprite(e, size);
    sp.position.copy(p);
    this.scene.add(sp);
    return sp;
  }
  pop(e, p, dur, size) {
    const sp = this.sprite(e, size, p), base = p.clone();
    this.fx.push({ sp, t: 0, dur, run: (f, k) => {
      const up = Math.min(1, f.t / 0.35);
      const over = Math.sin(up * Math.PI * 0.8) / Math.sin(Math.PI * 0.8);
      sp.position.set(base.x, base.y + 0.4 + over * 1.2 + Math.sin(f.t * 9) * 0.12, base.z);
      const sc = size * (k > 0.85 ? (1 - k) / 0.15 : Math.min(1, f.t / 0.25)) * (1 + Math.sin(f.t * 12) * 0.06);
      sp.scale.set(sc, sc, 1);
    } });
  }
  drop(e, p, size) {
    const sp = this.sprite(e, size, p);
    let y = p.y, vy = 0, bounces = 0;
    this.fx.push({ sp, t: 0, dur: 2.6, run: (f, k, dt) => {
      vy -= 22 * dt; y += vy * dt;
      if (y < 0.5) { y = 0.5; vy = -vy * 0.45; if (bounces++ < 2) sfx.tok(); }
      sp.position.y = y;
      const sc = size * (k > 0.85 ? (1 - k) / 0.15 : 1);
      sp.scale.set(sc, sc, 1);
    } });
  }
  hop(e, p) {
    const sp = this.sprite(e, 1.4, p), a = this.r() * Math.PI * 2, from = p.clone();
    const dir = new V3(Math.cos(a), 0, Math.sin(a));
    this.fx.push({ sp, t: 0, dur: 2.2, run: (f, k) => {
      const n = Math.min(3, f.t / 0.55), i = Math.floor(n), u = n - i;
      sp.position.copy(from).addScaledVector(dir, n * 1.6);
      sp.position.y = from.y + (i < 3 ? Math.sin(u * Math.PI) * 1.4 : 0);
      const sc = 1.4 * (k > 0.8 ? (1 - k) / 0.2 : Math.min(1, f.t / 0.2));
      sp.scale.set(sc, sc, 1);
    } });
  }
  flutter(e, p, delay) {
    const sp = this.sprite(e, 0.01, p), from = p.clone(), ph = this.r() * 6;
    this.fx.push({ sp, t: -delay, dur: 3.2, run: (f, k) => {
      if (f.t < 0) return;
      sp.position.set(from.x + Math.sin(f.t * 2 + ph) * 1.5, from.y + f.t * 1.4, from.z + Math.cos(f.t * 1.7 + ph) * 1.5);
      const sc = 1.0 * (k > 0.8 ? (1 - k) / 0.2 : Math.min(1, f.t / 0.2)) * (0.8 + Math.abs(Math.sin(f.t * 14)) * 0.3);
      sp.scale.set(sc, sc, 1);
    } });
  }
  jumpFish(p) {
    const sp = this.sprite('🐟', 1.3, p), from = p.clone();
    this.fx.push({ sp, t: 0, dur: 1.1, run: (f, k) => {
      sp.position.set(from.x + (k - 0.5) * 2, from.y + Math.sin(k * Math.PI) * 3, from.z);
      sp.scale.set(1.3, 1.3, 1);
      if (k > 0.95 && !f.splashed) { f.splashed = true; sfx.splash(); }
    } });
  }
  burst(p, n) {
    for (let i = 0; i < n; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTexture(), transparent: true, depthWrite: false }));
      sp.position.copy(p);
      this.scene.add(sp);
      const v = new V3((this.r() - 0.5) * 4, 1 + this.r() * 2, (this.r() - 0.5) * 4);
      this.fx.push({ sp, own: true, t: 0, dur: 1.2, run: (f, k, dt) => {
        sp.position.addScaledVector(v, dt); v.y -= dt * 3;
        const sc = 0.6 + k; sp.scale.set(sc, sc, 1);
        sp.material.opacity = 1 - k;
      } });
    }
  }

  startRain(t) {
    this.rainCloud = t; this.rainT = 0;
    t.obj.getWorldPosition(this.rainAt = new V3());
    for (let i = 0; i < this.rainPos.length / 3; i++) this._drop(i, true);
    this.rain.visible = true;
    sfx.rain();
  }
  _drop(i, fresh) {
    const a = this.r() * Math.PI * 2, d = Math.sqrt(this.r()) * 3.8;
    this.rainPos[i * 3] = this.rainAt.x + Math.cos(a) * d;
    this.rainPos[i * 3 + 1] = fresh ? this.r() * this.rainAt.y : this.rainAt.y - 1;
    this.rainPos[i * 3 + 2] = this.rainAt.z + Math.sin(a) * d;
  }
  rainbow(p, camera) {
    const g = new THREE.Group();
    const mats = RAINBOW.map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    this.rainbowGeo.forEach((geo, i) => g.add(new THREE.Mesh(geo, mats[i])));
    const yaw = Math.atan2(camera.position.x - p.x, camera.position.z - p.z);
    g.position.set(p.x - Math.sin(yaw) * 5, 0, p.z - Math.cos(yaw) * 5);   // just behind the cloud
    g.rotation.y = yaw;
    this.scene.add(g);
    this.fx.push({ sp: g, mats, t: 0, dur: 6, run: (f, k) => {
      const grow = Math.min(1, f.t / 0.9);
      g.scale.setScalar(0.2 + grow * 0.8);
      const op = k > 0.8 ? (1 - k) / 0.2 : 0.9;
      for (const m of mats) m.opacity = op;
    } });
    sfx.rainbow();
    this.award('🌈', g);
  }

  // ------------------------------------------------------------ every frame
  update(dt, taps, camera) {
    this.time += dt;
    for (const t of taps) {
      if (t.kind !== 'critter') continue;
      t.ph += dt;
      t.hop = Math.max(0, t.hop - dt * 1.8);
      const o = t.obj;
      o.position.y = Math.sin(t.hop * Math.PI) * 1.3;
      if (t.hop > 0) o.rotation.y += dt * 9;
      else o.rotation.x = Math.sin(t.ph * 1.5) * 0.04;
    }
    if (this.rainCloud) {
      this.rainT += dt;
      const c = this.rainCloud.obj;
      const grey = Math.min(1, this.rainT * 2) * (this.rainT > 3 ? Math.max(0, 1 - (this.rainT - 3) * 2) : 1);
      c.material.color.setRGB(1 - grey * 0.45, 1 - grey * 0.42, 1 - grey * 0.35);
      const raining = this.rainT < 3;
      for (let i = 0; i < this.rainPos.length / 3; i++) {
        this.rainPos[i * 3 + 1] -= dt * 14;
        if (this.rainPos[i * 3 + 1] < 0) { if (raining) this._drop(i, false); else this.rainPos[i * 3 + 1] = -100; }
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
      if (this.rainT > 3 && !this.rainbowDone) { this.rainbowDone = true; this.rainbow(this.rainAt, camera); }
      if (this.rainT > 4.5) { this.rain.visible = false; this.rainCloud = null; this.rainbowDone = false; c.material.color.set('#ffffff'); }
    }
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.t += dt;
      const k = Math.min(1, Math.max(0, f.t) / f.dur);
      f.run(f, k, dt);
      if (k >= 1) {
        this.scene.remove(f.sp);
        if (f.own) f.sp.material.dispose();
        if (f.mats) f.mats.forEach(m => m.dispose());
        this.fx.splice(i, 1);
      }
    }
  }

  dispose() {
    for (const f of this.fx) this.scene.remove(f.sp);
    this.fx = [];
    this.rain.geometry.dispose(); this.rain.material.dispose();
    this.rainbowGeo.forEach(g => g.dispose());
  }
}
