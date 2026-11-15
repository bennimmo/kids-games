// Sky Pilot: the 3D ground (chunks with 3 levels of detail) and the sea.
import * as THREE from '../../js/vendor/three.module.min.js';
import { GRID, HALF, CELL, heights, regionWeights, N, AIRPORTS, TOWNS, runwayLocal, apronSide, LAKE } from './island.js';
import { clamp, smooth, lerp, hash2, makeNoise } from './noise.js';

const CHUNKS = 12;                 // chunks across
const CN = GRID / CHUNKS;          // cells per chunk (64)
const LODS = [1, 2, 8];            // grid step for each level
const LOD_DIST = [3800, 10000];

const N3 = makeNoise(4242);

// ---------------------------------------------------------------- colour of the ground at one grid point
const SAND = [0.86, 0.79, 0.6], WET = [0.62, 0.58, 0.45], GRASS = [0.36, 0.55, 0.2], LUSH = [0.27, 0.48, 0.16];
const FOREST = [0.17, 0.33, 0.12], DESERT = [0.84, 0.62, 0.38], RED = [0.66, 0.38, 0.24], ROCK = [0.45, 0.42, 0.38];
const DARKROCK = [0.3, 0.29, 0.28], SNOW = [0.93, 0.95, 0.98], ALPINE = [0.4, 0.5, 0.25], FIELDS = [[0.8, 0.7, 0.3], [0.5, 0.36, 0.22], [0.42, 0.6, 0.2], [0.6, 0.66, 0.26], [0.72, 0.62, 0.25]];
const mix3 = (a, b, t, out) => { out[0] = a[0] + (b[0] - a[0]) * t; out[1] = a[1] + (b[1] - a[1]) * t; out[2] = a[2] + (b[2] - a[2]) * t; return out; };

function groundColor(x, z, h, ny, out) {
  const { wm, wd, ww, ws } = regionWeights(x, z);
  const v = N3.fbm(x / 900, z / 900, 3), v2 = N3.n2(x / 140, z / 140);
  const c = [0, 0, 0], t = [0, 0, 0];
  // south: grass
  mix3(GRASS, LUSH, v, t); c[0] += t[0] * ws; c[1] += t[1] * ws; c[2] += t[2] * ws;
  // west: forest + farm fields in the flat bits
  mix3(FOREST, GRASS, smooth(0.3, 0.8, v), t);
  const flat = smooth(0.96, 0.99, ny) * (1 - smooth(140, 260, h));
  if (flat > 0) {
    const a = 0.35, u = (x * Math.cos(a) - z * Math.sin(a)) / 190, w = (x * Math.sin(a) + z * Math.cos(a)) / 130;
    const f = FIELDS[Math.floor(hash2(Math.floor(u), Math.floor(w), 3) * FIELDS.length)];
    const edge = Math.min(Math.abs(u - Math.round(u)), Math.abs(w - Math.round(w))) < 0.04 ? 0.7 : 1;
    const ff = [f[0] * edge, f[1] * edge, f[2] * edge];
    mix3(t, ff, flat * smooth(0.45, 0.55, N3.fbm(x / 2500 + 5, z / 2500, 2)), t);
  }
  c[0] += t[0] * ww; c[1] += t[1] * ww; c[2] += t[2] * ww;
  // east: desert
  mix3(DESERT, RED, smooth(0.55, 0.85, v) * 0.6 + (1 - ny) * 2.5, t);
  c[0] += t[0] * wd; c[1] += t[1] * wd; c[2] += t[2] * wd;
  // north: mountains
  mix3(ALPINE, ROCK, smooth(300, 800, h + v2 * 80), t);
  c[0] += t[0] * wm; c[1] += t[1] * wm; c[2] += t[2] * wm;
  // steep = rock
  const steep = smooth(0.85, 0.65, ny) * (1 - wd * 0.6);
  mix3(c, h > 600 ? DARKROCK : ROCK, steep, c);
  // snow on top (not on cliffs)
  const snowLine = 1250 + v2 * 150 + (1 - ny) * 900;
  if (h > snowLine - 200) mix3(c, SNOW, smooth(snowLine - 200, snowLine + 60, h), c);
  // beaches
  const beach = (1 - smooth(2.5, 6 + v * 5, h)) * smooth(0.9, 0.97, ny);
  if (beach > 0) mix3(c, SAND, beach * (1 - wm), c);
  // under the sea: sand getting darker
  if (h < 0.6) mix3(SAND, WET, smooth(0, -30, h), c);
  // fine noise so it isn't flat
  const k = 0.92 + v2 * 0.08;
  out[0] = c[0] * k; out[1] = c[1] * k; out[2] = c[2] * k;
  return out;
}

// ---------------------------------------------------------------- textures
function detailTexture() {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), img = g.createImageData(S, S);
  const n = makeNoise(99);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    // tileable: sample on a torus
    const a = x / S * Math.PI * 2, b = y / S * Math.PI * 2;
    const v = n.fbm(Math.cos(a) * 3 + 10, Math.sin(a) * 3 + Math.cos(b) * 3, 4) * 0.6 + n.fbm(Math.sin(b) * 6, Math.cos(a) * 6 + 3, 3) * 0.4;
    const k = Math.round(clamp(165 + (v - 0.5) * 150 + (Math.random() - 0.5) * 26, 0, 255));
    const o = (y * S + x) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = k; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function waterNormals() {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), img = g.createImageData(S, S);
  const r = Math.random;
  const waves = [];
  let seed = 3;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 28; i++) waves.push([Math.round((rnd() - 0.5) * 16), Math.round((rnd() - 0.5) * 16), rnd() * 6.28, 0.3 + rnd()]);
  const hgt = (x, y) => { let s = 0; for (const [kx, ky, p, a] of waves) s += Math.sin((kx * x + ky * y) / S * Math.PI * 2 + p) * a / (1 + Math.hypot(kx, ky) * 0.25); return s; };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = hgt(x + 1, y) - hgt(x - 1, y), dy = hgt(x, y + 1) - hgt(x, y - 1);
    const l = Math.hypot(dx * 0.6, dy * 0.6, 1);
    const o = (y * S + x) * 4;
    img.data[o] = (-dx * 0.6 / l * 0.5 + 0.5) * 255; img.data[o + 1] = (-dy * 0.6 / l * 0.5 + 0.5) * 255; img.data[o + 2] = (1 / l * 0.5 + 0.5) * 255; img.data[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------- build
export async function createTerrain(scene, sky, progress) {
  const n = GRID + 1;
  // colours + normals for every grid point (once)
  const cols = new Float32Array(n * n * 3), nors = new Float32Array(n * n * 3);
  const out = [0, 0, 0];
  let t0 = performance.now();
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = j * n + i, h = heights[k];
      const hl = heights[j * n + Math.max(0, i - 1)], hr = heights[j * n + Math.min(n - 1, i + 1)];
      const hu = heights[Math.max(0, j - 1) * n + i], hd = heights[Math.min(n - 1, j + 1) * n + i];
      let nx = hl - hr, ny = 2 * CELL, nz = hu - hd;
      const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      nors.set([nx, ny, nz], k * 3);
      groundColor(-HALF + i * CELL, -HALF + j * CELL, h, ny, out);
      cols.set(out, k * 3);
    }
    if (performance.now() - t0 > 30) { progress && progress(j / n); await new Promise(r => setTimeout(r, 0)); t0 = performance.now(); }
  }

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, map: detailTexture(), roughness: 0.95, metalness: 0 });
  // two scales of detail so the pattern doesn't repeat
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `
      vec4 d1 = texture2D(map, vMapUv);
      vec4 d2 = texture2D(map, vMapUv * 0.083 + 0.37);
      diffuseColor.rgb *= (d1.rgb * 0.55 + d2.rgb * 0.65) * 1.35;
    `);
  };
  const group = new THREE.Group(); scene.add(group);
  const chunks = [];
  const skirt = 60;

  function chunkGeo(ci, cj, step) {
    const seg = CN / step, vn = seg + 1;
    const total = vn * vn + seg * 4 * 2;
    const pos = new Float32Array(total * 3), nor = new Float32Array(total * 3), col = new Float32Array(total * 3), uv = new Float32Array(total * 2);
    const idx = [];
    const put = (v, gi, gj, drop) => {
      const k = gj * n + gi, x = -HALF + gi * CELL, z = -HALF + gj * CELL;
      pos[v * 3] = x; pos[v * 3 + 1] = heights[k] - drop; pos[v * 3 + 2] = z;
      nor.set(nors.subarray(k * 3, k * 3 + 3), v * 3); col.set(cols.subarray(k * 3, k * 3 + 3), v * 3);
      uv[v * 2] = x / 40; uv[v * 2 + 1] = z / 40;
    };
    for (let j = 0; j < vn; j++) for (let i = 0; i < vn; i++) put(j * vn + i, ci * CN + i * step, cj * CN + j * step, 0);
    for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) {
      const a = j * vn + i, b = a + 1, c = a + vn, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    // skirts round the edge hide gaps between levels of detail
    let v = vn * vn;
    const edge = [];
    for (let i = 0; i < seg; i++) edge.push([i, 0, i + 1, 0]);
    for (let j = 0; j < seg; j++) edge.push([seg, j, seg, j + 1]);
    for (let i = seg; i > 0; i--) edge.push([i, seg, i - 1, seg]);
    for (let j = seg; j > 0; j--) edge.push([0, j, 0, j - 1]);
    for (const [i0, j0, i1, j1] of edge) {
      const a = j0 * vn + i0, b = j1 * vn + i1;
      put(v, ci * CN + i0 * step, cj * CN + j0 * step, skirt); put(v + 1, ci * CN + i1 * step, cj * CN + j1 * step, skirt);
      idx.push(a, v, b, b, v, v + 1);
      v += 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeBoundingSphere();
    return g;
  }

  for (let cj = 0; cj < CHUNKS; cj++) for (let ci = 0; ci < CHUNKS; ci++) {
    // skip chunks that are all deep sea
    let maxH = -1e9;
    for (let j = 0; j <= CN; j += 4) for (let i = 0; i <= CN; i += 4) maxH = Math.max(maxH, heights[(cj * CN + j) * n + ci * CN + i]);
    if (maxH < -12) continue;
    const meshes = LODS.map(step => {
      const m = new THREE.Mesh(chunkGeo(ci, cj, step), mat);
      m.receiveShadow = true; m.visible = false; m.matrixAutoUpdate = false;
      group.add(m); return m;
    });
    const cx = -HALF + (ci + 0.5) * CN * CELL, cz = -HALF + (cj + 0.5) * CN * CELL;
    chunks.push({ meshes, cx, cz });
    await new Promise(r => setTimeout(r, 0));
  }

  // the sea
  const wn = waterNormals();
  wn.repeat.set(1, 1);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0f4f78, roughness: 0.06, metalness: 0.0, normalMap: wn, normalScale: new THREE.Vector2(0.35, 0.35), transparent: true, opacity: 0.88, envMapIntensity: 1.2 });
  const wU = { wtime: { value: 0 } };
  waterMat.onBeforeCompile = sh => {
    sh.uniforms.wtime = wU.wtime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float wtime;\nvarying vec3 vWPos;')
      .replace('#include <normal_fragment_maps>', `
        vec2 wuv = vWPos.xz / 70.0;
        vec3 n1 = texture2D(normalMap, wuv + vec2(wtime * 0.013, wtime * 0.008)).xyz * 2.0 - 1.0;
        vec3 n2 = texture2D(normalMap, wuv * 0.37 - vec2(wtime * 0.006, -wtime * 0.011)).xyz * 2.0 - 1.0;
        vec3 n3 = texture2D(normalMap, wuv * 3.1 + vec2(-wtime * 0.03, wtime * 0.021)).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(n1 + n2 + n3 * 0.5);
        float wd = length(vWPos - cameraPosition);
        mapN.xy *= normalScale * (1.0 - smoothstep(800.0, 9000.0, wd) * 0.75);
        normal = normalize( tbn * mapN );
      `);
  };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000, 1, 1), waterMat);
  water.rotation.x = -Math.PI / 2; water.receiveShadow = true;
  water.renderOrder = 1;
  scene.add(water);
  // deep sea floor far out (so the sea doesn't look see-through at the edge of the land)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(160000, 160000), new THREE.MeshBasicMaterial({ color: 0x0a2c44 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -60;
  scene.add(floor);

  function update(cam, t) {
    wU.wtime.value = t;
    water.position.x = Math.round(cam.x / 1000) * 1000; water.position.z = Math.round(cam.z / 1000) * 1000;
    floor.position.x = water.position.x; floor.position.z = water.position.z;
  }
  // pick level of detail for a camera (split screen: the nearest of both)
  function lod(cams) {
    for (const c of chunks) {
      let d = 1e9;
      for (const p of cams) d = Math.min(d, Math.hypot(p.x - c.cx, p.z - c.cz) - CN * CELL * 0.5);
      const L = d < LOD_DIST[0] ? 0 : d < LOD_DIST[1] ? 1 : 2;
      c.meshes.forEach((m, i) => { m.visible = i === L; });
    }
  }
  return { update, lod, group, water, waterMat };
}
