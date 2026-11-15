// Sky Pilot: sky, sun and moon, day and night, clouds, weather (rain, snow, storms, rainbows).
// Time and weather come from the world clock only, so online every device sees the same sky.
import * as THREE from '../../js/vendor/three.module.min.js';
import { rng, hash2, clamp, smooth, lerp } from './noise.js';
import { terrainHeight, biomeAt } from './island.js';

export const DAY = 900;          // seconds for a whole day + night
const DAYLIGHT = 0.68;            // part of the day the sun is up
const WEATHER_LEN = 210;          // seconds per weather spell
export const START_TIME = DAY * 0.1;

// ---------------------------------------------------------------- clock + weather maths
export function sunAt(T) {
  const f = ((T / DAY) % 1 + 1) % 1;
  let elev, az;
  if (f < DAYLIGHT) { const k = f / DAYLIGHT; elev = Math.sin(Math.PI * k) * 64 - 4; az = lerp(-Math.PI * 0.55, Math.PI * 0.55, k); }
  else { const k = (f - DAYLIGHT) / (1 - DAYLIGHT); elev = -4 - Math.sin(Math.PI * k) * 34; az = lerp(Math.PI * 0.55, Math.PI * 1.45, k); }
  const e = elev * Math.PI / 180;
  // az 0 = south (+z) at noon; sunrise in the east
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(e) * -1, Math.sin(e), Math.cos(az) * Math.cos(e));
  return { f, elev, dir };
}

const KINDS = {
  clear: { cover: 0.18, rain: 0, storm: 0, haze: 0 },
  sunny: { cover: 0.35, rain: 0, storm: 0, haze: 0.05 },
  cloudy: { cover: 0.7, rain: 0, storm: 0, haze: 0.25 },
  rain: { cover: 0.92, rain: 1, storm: 0, haze: 0.7 },
  storm: { cover: 1, rain: 1, storm: 1, haze: 0.9 },
};
function spell(k) {
  if (k < 2) return k === 0 ? 'clear' : 'sunny';
  const r = hash2(k, 7, 31);
  return r < 0.22 ? 'clear' : r < 0.5 ? 'sunny' : r < 0.72 ? 'cloudy' : r < 0.92 ? 'rain' : 'storm';
}
export function weatherAt(T) {
  const k = Math.floor(T / WEATHER_LEN), into = T - k * WEATHER_LEN;
  const a = KINDS[spell(k - 1)], b = KINDS[spell(k)];
  const t = smooth(0, 45, into);
  const w = {};
  for (const key of ['cover', 'rain', 'storm', 'haze']) w[key] = lerp(a[key], b[key], t);
  // rainbow: just after rain, when the sun comes back
  const wasRain = spell(k - 1) === 'rain' || spell(k - 1) === 'storm';
  w.rainbow = wasRain && !b.rain ? smooth(30, 60, into) * (1 - smooth(120, 170, into)) : 0;
  w.kind = spell(k);
  w.windDir = hash2(k, 3, 9) * Math.PI * 2;
  w.wind = 2 + hash2(k, 5, 2) * 6 + w.storm * 8;
  return w;
}

// ---------------------------------------------------------------- textures
function canvasTex(w, h, draw, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function glowTexture() {
  return canvasTex(64, 64, g => {
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,.8)');
    gr.addColorStop(0.5, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  });
}
function puffTexture() {
  const r = rng(42);
  return canvasTex(128, 128, (g, w, h) => {
    for (let i = 0; i < 26; i++) {
      const x = 64 + (r() - 0.5) * 60, y = 64 + (r() - 0.5) * 50, rad = 18 + r() * 30;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    }
    // soft edge
    const img = g.getImageData(0, 0, w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - 64, y - 64) / 64;
      img.data[(y * w + x) * 4 + 3] *= clamp(1.25 - d * 1.25, 0, 1);
    }
    g.putImageData(img, 0, 0);
  }, false);
}

// ---------------------------------------------------------------- sky dome
const skyVert = `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w * 0.99999;
}`;
const skyFrag = `
uniform vec3 zenith, horizon, ground, sunDir, sunCol, moonDir;
uniform float sunAmt, rainbow, night, haze;
varying vec3 vDir;
vec3 bow(float t) { // t 0..1 red..violet
  return clamp(vec3(abs(t * 6.0 - 3.0) - 1.0, 2.0 - abs(t * 6.0 - 2.0), 2.0 - abs(t * 6.0 - 4.0)), 0.0, 1.0);
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.55));
  col = mix(col, ground, smoothstep(0.0, -0.08, h));
  float s = max(dot(d, sunDir), 0.0);
  col += sunCol * (pow(s, 6.0) * 0.35 + pow(s, 60.0) * 0.6) * sunAmt * (1.0 - haze * 0.7);
  col += sunCol * smoothstep(0.9993, 0.9997, s) * 12.0 * sunAmt * (1.0 - haze);
  // moon
  float m = max(dot(d, moonDir), 0.0);
  col += vec3(0.9, 0.95, 1.0) * (smoothstep(0.9994, 0.9996, m) * 1.5 + pow(m, 200.0) * 0.15) * night * (1.0 - haze * 0.8);
  // rainbow: 40-42 degrees around the point opposite the sun
  if (rainbow > 0.0) {
    float a = degrees(acos(clamp(dot(d, -sunDir), -1.0, 1.0)));
    float t = (a - 40.0) / 2.6;
    if (t > 0.0 && t < 1.0 && h > -0.02) col += bow(1.0 - t) * rainbow * 0.22 * sin(t * 3.1416);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---------------------------------------------------------------- clouds (billboards, one draw call)
const cloudVert = `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 offset;
attribute vec3 info; // size, shade (0 bottom .. 1 top), threshold
uniform vec2 drift;
uniform float span;
uniform vec3 camPos;
varying vec2 vUv;
varying float vShade, vFade, vDist, vVis;
uniform float cover;
void main() {
  vec3 o = offset;
  o.xz = mod(o.xz + drift + span * 0.5, span) - span * 0.5;
  vUv = uv;
  vShade = info.y;
  vVis = 1.0 - smoothstep(cover - 0.06, cover, info.z);
  vec4 mv = viewMatrix * vec4(o, 1.0);
  float size = info.x * (0.85 + cover * 0.3);
  mv.xy += position.xy * size;
  vDist = length(mv.xyz);
  vFade = smoothstep(size * 0.25, size * 1.1, vDist);
  gl_Position = projectionMatrix * mv;
  #include <logdepthbuf_vertex>
}`;
const cloudFrag = `
#include <common>
#include <logdepthbuf_pars_fragment>
uniform sampler2D map;
uniform vec3 lit, dark, fogCol;
uniform float opacity, fogDensity;
varying vec2 vUv;
varying float vShade, vFade, vDist, vVis;
void main() {
  vec4 t = texture2D(map, vUv);
  #include <logdepthbuf_fragment>
  float a = t.a * opacity * vFade * vVis;
  if (a < 0.01) discard;
  float shade = clamp(vShade * 0.8 + (1.0 - vUv.y) * 0.35, 0.0, 1.0);
  vec3 col = mix(dark, lit, shade);
  float f = 1.0 - exp(-fogDensity * fogDensity * vDist * vDist * 0.35);
  col = mix(col, fogCol, f);
  gl_FragColor = vec4(col, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---------------------------------------------------------------- rain / snow (moves in the shader)
const precipVert = `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute vec3 seed;
attribute float tip;
uniform vec3 center, vel;
uniform float time, box, snow;
varying float vA;
void main() {
  vec3 base = center - box * 0.5;
  vec3 p = mod(seed * box + vel * time - base, box) + base;
  if (snow > 0.5) { p.x += sin(time * 1.3 + seed.y * 40.0) * 0.6; p.z += cos(time * 1.1 + seed.x * 40.0) * 0.6; }
  else p -= normalize(vel) * tip * 1.6;
  vA = 1.0 - smoothstep(box * 0.3, box * 0.5, length(p - center));
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = snow > 0.5 ? clamp(260.0 / -mv.z, 1.5, 9.0) : 1.0;
  #include <logdepthbuf_vertex>
}`;
const precipFrag = `
#include <common>
#include <logdepthbuf_pars_fragment>
uniform float amount, snow;
uniform vec3 col;
varying float vA;
void main() {
  #include <logdepthbuf_fragment>
  if (snow > 0.5) { vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; }
  gl_FragColor = vec4(col, amount * vA * (snow > 0.5 ? 0.9 : 0.45));
}`;

// ---------------------------------------------------------------- the sky
const C = (r, g, b) => new THREE.Color(r, g, b);
const tmpC = new THREE.Color(), tmpC2 = new THREE.Color();

export function createSky(scene, renderer, quality) {
  const r = rng(5150);
  const group = new THREE.Group(); scene.add(group);

  // dome
  const skyU = {
    zenith: { value: C(0.2, 0.45, 0.9) }, horizon: { value: C(0.7, 0.8, 0.95) }, ground: { value: C(0.3, 0.35, 0.4) },
    sunDir: { value: new THREE.Vector3(0, 1, 0) }, moonDir: { value: new THREE.Vector3(0, -1, 0) }, sunCol: { value: C(1, 0.95, 0.85) },
    sunAmt: { value: 1 }, rainbow: { value: 0 }, night: { value: 0 }, haze: { value: 0 },
  };
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.ShaderMaterial({ uniforms: skyU, vertexShader: skyVert, fragmentShader: skyFrag, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false }));
  dome.scale.setScalar(60000); dome.frustumCulled = false; dome.renderOrder = -10;
  group.add(dome);

  // stars
  const starN = 2200, sp = new Float32Array(starN * 3), ss = new Float32Array(starN);
  for (let i = 0; i < starN; i++) {
    const z = r() * 1.1 - 0.1, t = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    sp.set([s * Math.cos(t) * 50000, z * 50000, s * Math.sin(t) * 50000], i * 3);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, depthTest: false, fog: false });
  const stars = new THREE.Points(sg, starMat); stars.frustumCulled = false; stars.renderOrder = -9;
  group.add(stars);

  // lights
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x5a5040, 1.2);
  const flash = new THREE.AmbientLight(0xdfe8ff, 0);
  scene.add(sun, sun.target, hemi, flash);
  const shadows = quality.shadows > 0;
  if (shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(quality.shadows, quality.shadows);
    const sc = sun.shadow.camera; sc.left = -160; sc.right = 160; sc.top = 160; sc.bottom = -160; sc.near = 10; sc.far = 3000;
    sc.layers.enableAll();
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
  }

  scene.fog = new THREE.FogExp2(0xbfd8ff, 4e-5);

  // clouds
  const SPAN = 52000;
  const puffs = [];
  const clusters = [];
  const nClouds = Math.round(230 * quality.clouds);
  for (let c = 0; c < nClouds; c++) {
    const cx = (r() - 0.5) * SPAN, cz = (r() - 0.5) * SPAN;
    const thr = r();
    const big = thr > 0.75 ? 1.6 : 1;            // only shown when it's very cloudy: big grey ones
    const cy = 1100 + r() * 900 + (big > 1 ? -250 : 0);
    const w = (300 + r() * 500) * big, hgt = (120 + r() * 200) * big;
    const n = Math.round((8 + r() * 10) * big);
    clusters.push({ x: cx, y: cy + hgt * 0.4, z: cz, r: w * 0.7, thr });
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      const px = cx + Math.cos(a) * d * w, pz = cz + Math.sin(a) * d * w * 0.7;
      const top = 1 - d * 0.6;
      const py = cy + r() * hgt * top;
      puffs.push([px, py, pz, (180 + r() * 220) * big * (0.6 + top * 0.6), (py - cy) / hgt, thr]);
    }
  }
  const cg = new THREE.InstancedBufferGeometry();
  cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]), 3));
  cg.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
  cg.setIndex([0, 1, 2, 0, 2, 3]);
  const offA = new Float32Array(puffs.length * 3), infoA = new Float32Array(puffs.length * 3);
  const offAttr = new THREE.InstancedBufferAttribute(offA, 3), infoAttr = new THREE.InstancedBufferAttribute(infoA, 3);
  offAttr.setUsage(THREE.DynamicDrawUsage); infoAttr.setUsage(THREE.DynamicDrawUsage);
  cg.setAttribute('offset', offAttr); cg.setAttribute('info', infoAttr);
  cg.instanceCount = puffs.length;
  const cloudU = {
    map: { value: puffTexture() }, lit: { value: C(1, 1, 1) }, dark: { value: C(0.6, 0.65, 0.72) }, fogCol: { value: C(0.7, 0.8, 0.9) },
    opacity: { value: 0.9 }, fogDensity: { value: 4e-5 }, drift: { value: new THREE.Vector2() }, span: { value: SPAN }, cover: { value: 0.3 }, camPos: { value: new THREE.Vector3() },
  };
  const cloudMesh = new THREE.Mesh(cg, new THREE.ShaderMaterial({ uniforms: cloudU, vertexShader: cloudVert, fragmentShader: cloudFrag, transparent: true, depthWrite: false, fog: false }));
  cloudMesh.frustumCulled = false; cloudMesh.renderOrder = 5;
  group.add(cloudMesh);
  const order = puffs.map((_, i) => i);
  function sortClouds(cam) {
    const dx = cloudU.drift.value.x, dz = cloudU.drift.value.y, h = SPAN / 2;
    const wrap = v => ((v + h) % SPAN + SPAN) % SPAN - h;
    const dist = puffs.map(p => { const x = wrap(p[0] + dx) - cam.x, z = wrap(p[2] + dz) - cam.z, y = p[1] - cam.y; return x * x + y * y + z * z; });
    order.sort((a, b) => dist[b] - dist[a]);
    order.forEach((pi, i) => { const p = puffs[pi]; offA.set([p[0], p[1], p[2]], i * 3); infoA.set([p[3], p[4], p[5]], i * 3); });
    offAttr.needsUpdate = true; infoAttr.needsUpdate = true;
  }

  // rain + snow
  const PN = Math.round(5000 * quality.particles);
  function precip(snow) {
    const n = snow ? PN : PN * 2;
    const seed = new Float32Array(n * 3), tip = new Float32Array(n);
    for (let i = 0; i < n; i += snow ? 1 : 2) {
      const s = [r(), r(), r()];
      seed.set(s, i * 3);
      if (!snow) { seed.set(s, (i + 1) * 3); tip[i + 1] = 1; }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 3));
    g.setAttribute('tip', new THREE.BufferAttribute(tip, 1));
    const u = { center: { value: new THREE.Vector3() }, vel: { value: new THREE.Vector3(0, snow ? -2.2 : -16, 0) }, time: { value: 0 }, box: { value: snow ? 90 : 70 }, snow: { value: snow ? 1 : 0 }, amount: { value: 0 }, col: { value: snow ? C(1, 1, 1) : C(0.75, 0.8, 0.9) } };
    const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: precipVert, fragmentShader: precipFrag, transparent: true, depthWrite: false, fog: false });
    const o = snow ? new THREE.Points(g, m) : new THREE.LineSegments(g, m);
    o.frustumCulled = false; o.visible = false; o.renderOrder = 6;
    group.add(o);
    return { o, u };
  }
  const rain = precip(false), snow = precip(true);

  // lightning bolt
  const boltMat = new THREE.LineBasicMaterial({ color: 0xeef4ff, transparent: true, opacity: 1, fog: false });
  const bolt = new THREE.LineSegments(new THREE.BufferGeometry(), boltMat); bolt.visible = false; bolt.frustumCulled = false;
  group.add(bolt);
  let nextBolt = 6, boltT = 0, thunderAt = -1;

  // things that glow at night: { mat, max } and point lights groups { obj, max }
  const nightMats = [], nightObjs = [];

  // environment map (reflections) from the sky only
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envDome = new THREE.Mesh(dome.geometry, dome.material); envDome.scale.setScalar(100);
  envScene.add(envDome);
  let envRT = null, envAt = -99, envKey = '';

  const state = {
    T: 0, night: 0, dusk: 0, sunDir: new THREE.Vector3(), sunElev: 0, weather: weatherAt(0), daylight: 1,
    wind: new THREE.Vector3(), flash: 0, thunder: null, fogDensity: 4e-5, cloudFog: 0, lightsOn: 0,
  };

  const ZEN_DAY = C(0.16, 0.38, 0.86), HOR_DAY = C(0.62, 0.77, 0.95);
  const ZEN_SET = C(0.2, 0.25, 0.5), HOR_SET = C(1.0, 0.55, 0.3);
  const ZEN_NIGHT = C(0.005, 0.01, 0.03), HOR_NIGHT = C(0.03, 0.05, 0.1);
  const GREY_Z = C(0.42, 0.46, 0.52), GREY_H = C(0.62, 0.65, 0.7);

  function update(T, dt, cam) {
    state.T = T;
    const s = sunAt(T), w = weatherAt(T);
    state.weather = w;
    state.sunElev = s.elev;
    state.sunDir.copy(s.dir);
    const day = smooth(-6, 8, s.elev);             // 0 night .. 1 day
    const set = (1 - smooth(4, 18, s.elev)) * smooth(-8, 2, s.elev); // sunset glow
    state.night = 1 - day;
    state.dusk = set;
    state.daylight = day * (1 - w.cover * 0.45 - w.storm * 0.2);
    state.lightsOn = clamp(Math.max(state.night * 1.3, w.rain * 0.5, set * 0.6), 0, 1);

    // sky colours
    const zen = tmpC.copy(ZEN_DAY).lerp(ZEN_SET, set).lerp(ZEN_NIGHT, state.night);
    const hor = tmpC2.copy(HOR_DAY).lerp(HOR_SET, set).lerp(HOR_NIGHT, state.night);
    const g = w.haze;
    zen.lerp(GREY_Z.clone().multiplyScalar(lerp(1, 0.08, state.night) * (1 - w.storm * 0.4)), g);
    hor.lerp(GREY_H.clone().multiplyScalar(lerp(1, 0.08, state.night) * (1 - w.storm * 0.35)), g);
    skyU.zenith.value.copy(zen); skyU.horizon.value.copy(hor);
    skyU.ground.value.copy(hor).multiplyScalar(0.55);
    skyU.sunDir.value.copy(s.dir); skyU.moonDir.value.copy(s.dir).negate().add(new THREE.Vector3(0.2, 0.25, 0)).normalize();
    skyU.sunCol.value.setRGB(1, lerp(0.95, 0.6, set), lerp(0.85, 0.35, set));
    skyU.sunAmt.value = smooth(-4, 2, s.elev);
    skyU.night.value = state.night; skyU.haze.value = w.haze;
    skyU.rainbow.value = w.rainbow * smooth(3, 10, s.elev);
    starMat.opacity = smooth(0.5, 0.95, state.night) * (1 - w.haze) * 0.9;

    // lights
    const moon = s.elev < -3;
    const ld = moon ? skyU.moonDir.value : s.dir;
    sun.color.setRGB(moon ? 0.6 : 1, moon ? 0.7 : lerp(0.96, 0.62, set), moon ? 1 : lerp(0.9, 0.4, set));
    sun.intensity = moon ? 0.25 * (1 - w.haze) : 3.2 * smooth(-3, 6, s.elev) * (1 - w.haze * 0.75);
    hemi.color.copy(zen).lerp(C(1, 1, 1), 0.35); hemi.groundColor.setRGB(0.36, 0.32, 0.26);
    hemi.intensity = lerp(0.15, 1.3, day) * (1 - w.storm * 0.3) + w.haze * 0.4 * day;
    state.wind.set(Math.sin(w.windDir), 0, Math.cos(w.windDir)).multiplyScalar(w.wind);

    // clouds
    cloudU.cover.value = w.cover;
    cloudU.drift.value.set(Math.sin(w.windDir) * T * 4, Math.cos(w.windDir) * T * 4);
    const cl = lerp(0.04, 1, day);
    cloudU.lit.value.setRGB(cl, cl * lerp(1, 0.75, set), cl * lerp(1, 0.6, set)).multiplyScalar(1 - w.storm * 0.45 - w.rain * 0.2);
    cloudU.dark.value.copy(cloudU.lit.value).multiplyScalar(0.62 - w.storm * 0.15);
    cloudU.fogCol.value.copy(hor);

    // lightning
    state.flash = Math.max(0, state.flash - dt * 6);
    if (w.storm > 0.5) {
      nextBolt -= dt;
      if (nextBolt <= 0 && cam) {
        nextBolt = 4 + Math.random() * 9;
        const a = Math.random() * Math.PI * 2, d = 2500 + Math.random() * 6000;
        const bx = cam.x + Math.cos(a) * d, bz = cam.z + Math.sin(a) * d;
        const top = 1700, bottom = Math.max(0, terrainHeight(bx, bz));
        const pts = []; let x = bx, z = bz;
        for (let y = top; y > bottom; y -= 70 + Math.random() * 90) {
          const nx = x + (Math.random() - 0.5) * 140, nz = z + (Math.random() - 0.5) * 140, ny = Math.max(bottom, y - 120);
          pts.push(x, y, z, nx, ny, nz); x = nx; z = nz;
          if (Math.random() < 0.25) pts.push(x, ny, z, x + (Math.random() - 0.5) * 300, ny - 200, z + (Math.random() - 0.5) * 300);
        }
        bolt.geometry.dispose();
        bolt.geometry = new THREE.BufferGeometry(); bolt.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
        bolt.visible = true; boltT = 0.25; state.flash = 1;
        thunderAt = T + d / 340; state.thunderDist = d;
      }
    }
    if (boltT > 0) { boltT -= dt; boltMat.opacity = Math.random() > 0.3 ? 1 : 0.2; if (boltT <= 0) bolt.visible = false; }
    state.thunder = null;
    if (thunderAt > 0 && T >= thunderAt) { state.thunder = state.thunderDist; thunderAt = -1; }
    flash.intensity = state.flash * 2.5;

    // fog
    state.fogDensity = lerp(3.6e-5, 2.4e-4, w.haze * 0.6 + w.rain * 0.4) * (1 + w.storm * 0.4);

    // things that glow at night
    const L = state.lightsOn;
    for (const n of nightMats) n.mat.emissiveIntensity = n.max * L;
    for (const n of nightObjs) { n.obj.visible = L > 0.05; if (n.mat) n.mat.opacity = L * (n.max ?? 1); }

    // reflections: rebuild now and then
    const key = Math.round(s.elev * 2) + '_' + Math.round(w.haze * 8) + '_' + Math.round(set * 6);
    if (key !== envKey && T - envAt > 1.5) {
      envKey = key; envAt = T;
      const old = envRT;
      envRT = pmrem.fromScene(envScene, 0, 1, 1000);
      scene.environment = envRT.texture;
      if (old) old.dispose();
    }
  }

  // called before each view is drawn
  let sortT = 0;
  function beforeView(cam, viewIndex, dt) {
    const p = cam.position;
    dome.position.copy(p); stars.position.copy(p);
    // fly-through-cloud fog
    let inside = 0;
    const cv = cloudU.cover.value, dx = cloudU.drift.value.x, dz = cloudU.drift.value.y, h = SPAN / 2;
    for (const c of clusters) {
      if (c.thr > cv) continue;
      const x = ((c.x + dx + h) % SPAN + SPAN) % SPAN - h, z = ((c.z + dz + h) % SPAN + SPAN) % SPAN - h;
      const d = Math.hypot(x - p.x, (c.y - p.y) * 2.2, z - p.z) / c.r;
      if (d < 1.2) inside = Math.max(inside, smooth(1.2, 0.5, d));
    }
    state.cloudFog = inside;
    const fogD = lerp(state.fogDensity, 0.012, inside);
    scene.fog.density = fogD;
    scene.fog.color.copy(skyU.horizon.value).lerp(cloudU.lit.value, inside * 0.9);
    cloudU.fogDensity.value = state.fogDensity;
    cloudU.camPos.value.copy(p);
    if (viewIndex === 0) { sortT -= dt; if (sortT <= 0) { sortT = 0.4; sortClouds(p); } }
    // shadows follow this view
    if (shadows) {
      sun.target.position.copy(p);
      const ld = sun.intensity > 0.01 ? (state.sunElev < -3 ? skyU.moonDir.value : state.sunDir) : state.sunDir;
      sun.position.copy(p).addScaledVector(ld, 1500);
      sun.target.updateMatrixWorld();
    }
    // rain or snow?
    const w = state.weather;
    const cold = p.y > 1300 || biomeAt(p.x, p.z) === 'snow';
    const belowCloud = p.y < 2100;
    const amt = w.rain * (belowCloud ? 1 : 0);
    rain.o.visible = amt > 0.02 && !cold; snow.o.visible = amt > 0.02 && cold;
    for (const P of [rain, snow]) {
      P.u.center.value.copy(p); P.u.time.value = state.T; P.u.amount.value = amt;
      P.u.vel.value.set(state.wind.x * 0.6, P === snow ? -2.4 : -18, state.wind.z * 0.6);
      P.u.col.value.setScalar(P === snow ? lerp(0.25, 1, state.daylight) : lerp(0.2, 0.8, state.daylight));
    }
  }

  return {
    state, update, beforeView, sun, hemi,
    addNightMat(mat, max = 1) { nightMats.push({ mat, max }); },
    addNightObj(obj, mat, max = 1) { nightObjs.push({ obj, mat, max }); },
    dispose() { pmrem.dispose(); if (envRT) envRT.dispose(); },
  };
}
