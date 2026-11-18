// Mountain Rush: everything you see that isn't the bike.
// Sky + sun + fog, the ground (in 64 m chunks), pine trees, rocks, grass blades near you,
// the start gate, checkpoints and finish, and dust.
import * as THREE from '../../js/vendor/three.module.min.js';
import { rng } from '../sky-pilot/noise.js';

export let SUN_DIR = new THREE.Vector3(-0.45, 0.62, 0.64).normalize();
let FOG = new THREE.Color(0xb9c9cf);
const CH = 64;          // ground chunk size (m)
const TCH = 128;        // tree/rock chunk size (m)

export function createScene(world, T, Q) {
  const B = world.B;
  SUN_DIR = new THREE.Vector3(...B.sun).normalize();
  FOG = new THREE.Color(B.fog);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(FOG.getHex(), Q.fog);
  scene.background = FOG.clone();
  const uniforms = { uTime: { value: 0 } };

  // ---------------------------------------------------------------- sky dome
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: SUN_DIR }, uFog: { value: FOG }, uZen: { value: new THREE.Vector3(...B.zenith) } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`,
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun; uniform vec3 uFog; uniform vec3 uZen;
      void main(){
        vec3 d = normalize(vDir);
        float h = max(d.y, 0.);
        vec3 zen = uZen, hor = uFog;
        vec3 col = mix(hor, zen, pow(h, 0.42));
        float s = max(dot(d, uSun), 0.);
        col += vec3(1.0,0.86,0.62) * (pow(s, 6.) * 0.35 + pow(s, 64.) * 0.6) ;
        col += vec3(1.0,0.97,0.9) * smoothstep(0.9993, 0.9997, s) * 3.;
        col = mix(uFog, col, smoothstep(-0.05, 0.25, d.y));
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat);
  sky.frustumCulled = false; sky.renderOrder = -1;
  scene.add(sky);

  // ---------------------------------------------------------------- lights
  const hemi = new THREE.HemisphereLight(B.hemiSky, B.hemiGround, B.hemiI);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(B.sunColor, B.sunI);
  sun.castShadow = Q.shadows > 0;
  if (Q.shadows) {
    sun.shadow.mapSize.set(Q.shadows, Q.shadows);
    const s = Q.shadowBox;
    Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 400 });
    sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.035;
  }
  scene.add(sun); scene.add(sun.target);

  // ---------------------------------------------------------------- ground
  const terrainMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
  terrainMat.customProgramCacheKey = () => 'mr-terrain';
  terrainMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, { tGrass: { value: T.grass }, tFloor: { value: T.floor }, tDirt: { value: T.dirt }, tRock: { value: T.rock }, tBump: { value: T.dirtBump }, tPlank: { value: T.planks } });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aTrail; varying float vTrail; varying vec3 vWPos; varying vec3 vWNrm;\n#ifdef RIBBON\nattribute float aWood; attribute vec2 aTuv; varying float vWood; varying vec2 vTuv;\n#endif')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvTrail = aTrail; vWPos = (modelMatrix * vec4(transformed,1.)).xyz; vWNrm = normalize(mat3(modelMatrix) * objectNormal);\n#ifdef RIBBON\nvWood = aWood; vTuv = aTuv;\n#endif');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D tGrass, tFloor, tDirt, tRock, tBump, tPlank; varying float vTrail; varying vec3 vWPos; varying vec3 vWNrm;
        #ifdef RIBBON
        varying float vWood; varying vec2 vTuv;
        #endif
        float gRockW, gDirtW;
        vec3 perturbN(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float fd){
          vec3 sx = normalize(dFdx(surf_pos)), sy = normalize(dFdy(surf_pos)), n = surf_norm;
          vec3 r1 = cross(sy, n), r2 = cross(n, sx); float det = dot(sx, r1) * fd;
          if (abs(det) < 1e-12) return n;
          vec3 g = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
          vec3 o = abs(det) * n - g;
          float l = length(o);
          return l > 1e-12 ? o / l : n;
        }`)
      .replace('#include <map_fragment>', `
        vec2 wp = vWPos.xz;
        float macro = texture2D(tFloor, wp * 0.0075).r;
        float macro2 = texture2D(tGrass, wp * 0.021 + 0.3).g;
        vec3 grass = texture2D(tGrass, wp * 0.21).rgb * (0.75 + macro2 * 0.6);
        vec3 forest = texture2D(tFloor, wp * 0.17).rgb;
        float forestW = smoothstep(0.42, 0.62, macro);
        vec3 dirt = texture2D(tDirt, wp * 0.22).rgb * (0.9 + 0.2 * texture2D(tDirt, wp * 0.031).g);
        vec3 an = abs(vWNrm); an /= (an.x + an.y + an.z);
        vec3 rock = texture2D(tRock, vWPos.xz * 0.09).rgb * an.y + texture2D(tRock, vWPos.xy * 0.09).rgb * an.z + texture2D(tRock, vWPos.zy * 0.09).rgb * an.x;
        float slope = 1. - vWNrm.y;
        gRockW = smoothstep(0.33, 0.55, slope);
        gDirtW = smoothstep(0.12, 0.7, vTrail + (texture2D(tGrass, wp * 0.33).r - 0.5) * 0.5 * smoothstep(0.02, 0.3, vTrail) * (1.0 - smoothstep(0.75, 1.0, vTrail)));     // ragged edges: grass creeps in, dirt spills out
        // darker worn line in the middle of the trail
        dirt *= mix(1.0, 0.82, smoothstep(0.85, 1.0, vTrail));
        // the trail changes as you go: damp dark patches, pale dusty hardpack, leaf litter, gravel, stones set in the dirt
        {
          float v1 = texture2D(tFloor, wp * 0.0131 + 0.21).r, v2 = texture2D(tGrass, wp * 0.0093 + 0.6).g, v3 = texture2D(tRock, wp * 0.017).r;
          float fine = texture2D(tDirt, wp * 0.9).g;
          dirt *= 0.86 + 0.3 * fine;                                                          // fine grain close up
          dirt *= mix(1.0, 0.56, smoothstep(0.5, 0.66, v1));                                  // damp
          vec3 dusty = vec3(dot(dirt, vec3(0.34))) * vec3(1.14, 1.04, 0.9) * 1.3;
          dirt = mix(dirt, dusty, smoothstep(0.48, 0.66, v2) * 0.85);                         // dry hardpack
          dirt = mix(dirt, forest * 0.9, smoothstep(0.52, 0.66, v3) * smoothstep(0.4, 0.6, texture2D(tFloor, wp * 0.31).g) * 0.9);   // litter
          float peb = texture2D(tRock, wp * 0.83).r * texture2D(tRock, wp * 0.37 + 0.5).g;
          dirt = mix(dirt, vec3(0.62, 0.6, 0.57) * (0.7 + peb), smoothstep(0.3, 0.42, peb) * smoothstep(0.42, 0.6, 1.0 - v1) * 0.8);    // gravel
          // stones set in the trail: pebbles everywhere, a bigger one now and then
          for (int k = 0; k < 2; k++) {
            float sc2 = k == 0 ? 3.1 : 0.85; vec2 gp = wp * sc2 + float(k) * 17.3, id = floor(gp), fr = fract(gp);
            float h1 = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453), h2 = fract(sin(dot(id, vec2(269.5, 183.3))) * 43758.5453), h3 = fract(h1 * 91.7 + h2 * 37.3);
            float rad = (k == 0 ? 0.07 : 0.12) + 0.13 * h1, dd = length(fr - vec2(0.3 + 0.4 * h1, 0.3 + 0.4 * h2)) / rad;
            float patchy = smoothstep(0.3, 0.5, texture2D(tRock, wp * 0.047 + float(k) * 0.3).r);        // stones come in patches, not everywhere
            float has = step(k == 0 ? 0.5 : 0.84, h3) * patchy, on = has * (1.0 - smoothstep(0.7, 1.0, dd));
            vec3 stone = mix(dirt * 1.2, mix(vec3(0.42, 0.41, 0.39), vec3(0.6, 0.58, 0.54), h1), 0.6) * (1.1 - 0.4 * dd * dd) * (0.8 + 0.4 * fine);
            dirt = mix(dirt * (1.0 - 0.25 * has * (1.0 - smoothstep(1.0, 1.3, dd))), stone, on);
          }
        }
        #ifdef RIBBON
        {
          // tyre lines wandering down the trail, and a rain rut here and there
          float wob = sin(vTuv.x * 0.21) * 0.45 + sin(vTuv.x * 0.057 + 1.3) * 0.5;
          float line1 = exp(-pow((vTuv.y - wob) / 0.2, 2.0)), line2 = exp(-pow((vTuv.y - wob * 0.4 + 0.9) / 0.16, 2.0));
          dirt *= 1.0 - 0.3 * line1 - 0.2 * line2;
          // braking bumps and little cross ripples here and there
          dirt *= 1.0 - 0.14 * smoothstep(0.2, 1.0, sin(vTuv.x * 5.2 + sin(vTuv.y * 1.3))) * smoothstep(0.5, 0.9, sin(vTuv.x * 0.071 + 0.7));
          float rut = exp(-pow((vTuv.y + 1.1 - sin(vTuv.x * 0.13) * 0.5) / 0.07, 2.0)) * smoothstep(0.3, 0.8, sin(vTuv.x * 0.043 + 2.0));
          dirt *= 1.0 - 0.38 * rut;
        }
        #endif
        vec3 col = mix(grass, forest, forestW * 0.85);
        col = mix(col, dirt * 0.95, smoothstep(0.2, 0.4, slope) * 0.5);
        col = mix(col, dirt, gDirtW);
        gRockW *= 1. - gDirtW;
        col = mix(col, rock, gRockW);
        #ifdef RIBBON
        {
          // wooden planks laid across the trail (decks, ramps, plank berms)
          float wd = smoothstep(0.35, 0.6, vWood);
          // each board 0.32 m wide, its own shade, a dark gap either side
          float bx = vTuv.x * 3.125, bid = floor(bx), bf = fract(bx);
          float shade = 0.8 + 0.34 * fract(sin(bid * 12.9898 + 4.1) * 43758.5453);
          float gap = smoothstep(0.0, 0.07, bf) * smoothstep(1.0, 0.93, bf);
          vec3 plank = texture2D(tPlank, vec2(vTuv.y * 0.45, vTuv.x * 0.5)).rgb * shade * mix(0.3, 1.0, gap);
          col = mix(col, plank, wd); gRockW *= 1. - wd; gDirtW *= 1. - wd;
          // bare rock slabs (rock rolls): grey stone with cracks and lighter worn patches
          float rk = smoothstep(0.3, 0.7, -vWood);
          float crack = texture2D(tRock, wp * 0.031 + 0.4).g, patchy = texture2D(tRock, wp * 0.012).r;
          vec3 slab = texture2D(tRock, wp * 0.13).rgb * (0.78 + 0.5 * patchy) * mix(0.62, 1.0, smoothstep(0.28, 0.4, crack));
          col = mix(col, slab, rk); gDirtW *= 1. - rk; gRockW = max(gRockW, rk);
        }
        #endif
        diffuseColor.rgb *= col;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.97, 0.88, gDirtW); roughnessFactor = mix(roughnessFactor, 0.72, gRockW);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          float bs = 0.02 * gDirtW + 0.035 * gRockW;
          vec2 buv = (gRockW > 0.5 ? vWPos.xz * 0.09 : vWPos.xz * 0.22);
          float hb = texture2D(tBump, buv).r;
          vec2 dh = vec2(dFdx(hb), dFdy(hb)) * bs * 40.;
          if (bs > 0.0001) normal = perturbN(-vViewPosition, normal, dh, faceDirection);
        }`);
  };

  const { NX, NZ, HALF, H, mask } = world;
  const idx = [];
  for (let j = 0; j < CH; j++) for (let i = 0; i < CH; i++) {
    const a = j * (CH + 1) + i, b = a + 1, c = a + CH + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const indexAttr = new THREE.Uint32BufferAttribute(idx, 1);
  const chunks = [];
  const hAt = (gx, gz) => H[Math.min(NZ - 1, Math.max(0, gz)) * NX + Math.min(NX - 1, Math.max(0, gx))];
  for (let cz = 0; cz < NZ - 1; cz += CH) for (let cx = 0; cx < NX - 1; cx += CH) {
    const V = (CH + 1) * (CH + 1);
    const pos = new Float32Array(V * 3), nrm = new Float32Array(V * 3), tr = new Float32Array(V);
    let k = 0;
    for (let j = 0; j <= CH; j++) for (let i = 0; i <= CH; i++, k++) {
      const gx = cx + i, gz = cz + j;
      const h = hAt(gx, gz);
      pos[k * 3] = gx - HALF; pos[k * 3 + 1] = h; pos[k * 3 + 2] = gz;
      const hx = hAt(gx + 1, gz) - hAt(gx - 1, gz), hz = hAt(gx, gz + 1) - hAt(gx, gz - 1);
      const l = Math.hypot(hx, 2, hz);
      nrm[k * 3] = -hx / l; nrm[k * 3 + 1] = 2 / l; nrm[k * 3 + 2] = -hz / l;
      tr[k] = mask[Math.min(NZ - 1, gz) * NX + Math.min(NX - 1, gx)];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    g.setAttribute('aTrail', new THREE.BufferAttribute(tr, 1));
    g.setIndex(indexAttr);
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, terrainMat);
    m.receiveShadow = true;
    m.matrixAutoUpdate = false; m.updateMatrix();
    scene.add(m);
    chunks.push({ mesh: m, cx: cx - HALF + CH / 2, cz: cz + CH / 2 });
  }

  // ---------------------------------------------------------------- trail ribbon: fine mesh with the exact jump shapes
  for (const path of world.routes) {
    const ribMat = terrainMat.clone();
    ribMat.onBeforeCompile = terrainMat.onBeforeCompile;
    ribMat.polygonOffset = true; ribMat.polygonOffsetFactor = -1 - path.id; ribMat.polygonOffsetUnits = -2 - path.id * 2;
    ribMat.defines = { ...(ribMat.defines || {}), RIBBON: 1 };
    ribMat.customProgramCacheKey = () => 'mr-ribbon';
    const STEP_S = 0.5, COLS = 44, ex = {};
    const segLen = 80;     // metres per mesh (so far-away bits can be culled)
    for (let s0 = 0; s0 < path.n - 1; s0 += segLen) {
      const s1 = Math.min(path.n - 1, s0 + segLen);
      const rows = Math.round((s1 - s0) / STEP_S) + 1;
      const pos = new Float32Array(rows * (COLS + 1) * 3), tr = new Float32Array(rows * (COLS + 1)), wd = new Float32Array(rows * (COLS + 1)), tuv = new Float32Array(rows * (COLS + 1) * 2);
      let k = 0;
      for (let r = 0; r < rows; r++) {
        const sc = Math.min(s1, s0 + r * STEP_S), i0 = Math.floor(sc), i1 = Math.min(path.n - 1, i0 + 1), f = sc - i0;
        const cx = path.x[i0] + (path.x[i1] - path.x[i0]) * f, cz = path.z[i0] + (path.z[i1] - path.z[i0]) * f;
        let ttx = path.tx[i0] + (path.tx[i1] - path.tx[i0]) * f, ttz = path.tz[i0] + (path.tz[i1] - path.tz[i0]) * f;
        const tl = Math.hypot(ttx, ttz) || 1; ttx /= tl; ttz /= tl;
        const half = path.halfW(sc) + world.RIB;
        for (let c = 0; c <= COLS; c++, k++) {
          const u = (c / COLS) * 2 - 1, d = Math.sign(u) * Math.pow(Math.abs(u), 1.25) * half;   // more detail in the middle
          const x = cx + ttz * d, z = cz - ttx * d;
          world.exact(x, z, ex);
          pos[k * 3] = x; pos[k * 3 + 1] = ex.hv; pos[k * 3 + 2] = z;
          tr[k] = ex.m; wd[k] = ex.stone > 0.02 ? -ex.stone : ex.wood; tuv[k * 2] = sc - s0; tuv[k * 2 + 1] = d;      // (wood < 0 = bare rock slab; sc measured from the start of this piece: small numbers keep the board pattern sharp on phones)
        }
      }
      const idx = [];
      for (let r = 0; r < rows - 1; r++) for (let c = 0; c < COLS; c++) {
        const a = r * (COLS + 1) + c, b = a + 1, cc = a + COLS + 1, d = cc + 1;
        idx.push(a, b, cc, b, d, cc);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aTrail', new THREE.BufferAttribute(tr, 1));
      g.setAttribute('aWood', new THREE.BufferAttribute(wd, 1));
      g.setAttribute('aTuv', new THREE.BufferAttribute(tuv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      // make sure normals point up (row order may flip winding)
      const na = g.attributes.normal; let flip = 0; for (let i = 0; i < na.count; i += 7) flip += na.getY(i);
      if (flip < 0) { for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } g.setIndex(idx); g.computeVertexNormals(); }
      g.computeBoundingSphere();
      const m = new THREE.Mesh(g, ribMat);
      m.receiveShadow = true; m.matrixAutoUpdate = false;
      scene.add(m);
      chunks.push({ mesh: m, cx: g.boundingSphere.center.x, cz: g.boundingSphere.center.z, r: g.boundingSphere.radius });
    }
  }

  // ---------------------------------------------------------------- trees, plants, logs, rocks (instanced, in 128 m chunks)
  const kinds = makeTreeKinds(T, B);
  const rockGeo = makeRockGeo();
  const rockMat = new THREE.MeshStandardMaterial({ map: T.rock, roughness: 0.85, color: 0xd8d4cc });
  const groups = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color(), e = new THREE.Euler();
  const bucket = (list, keyOf) => { const m = new Map(); for (const it of list) { const k = keyOf(it) + '|' + Math.floor((it.x + HALF) / TCH) + ',' + Math.floor(it.z / TCH); if (!m.has(k)) m.set(k, []); m.get(k).push(it); } return m; };
  const centre = k => { const [bx, bz] = k.split('|')[1].split(',').map(Number); return { cx: bx * TCH - HALF + TCH / 2, cz: bz * TCH + TCH / 2 }; };
  // place a list of things with a list of parts; place(item) sets p, q, sc
  const instance = (parts, list, place, tintOf) => parts.map(part => {
    const im = new THREE.InstancedMesh(part.geo, part.mat, list.length);
    im.castShadow = part.shadow; im.receiveShadow = true;
    list.forEach((it, i) => {
      place(it); m4.compose(p, q, sc); im.setMatrixAt(i, m4);
      if (part.tint && tintOf) { tintOf(it, col); im.setColorAt(i, col); }
    });
    im.computeBoundingSphere();
    scene.add(im);
    return im;
  });
  const up = new THREE.Vector3(0, 1, 0);
  const treeKeep = world.trees.filter((t, i) => (i * 0.618 % 1) < Q.trees);
  for (const [k, list] of bucket(treeKeep, t => t.kind)) {
    const K = kinds[k.split('|')[0]];
    if (!K) continue;
    const meshes = instance(K, list, t => { q.setFromAxisAngle(up, t.rot); sc.setScalar(t.s); p.set(t.x, t.y - 0.3, t.z); },
      (t, c) => c.setHSL(0.27 + t.tint * 0.06, 0.35 + t.tint * 0.2, 0.75 + t.tint * 0.3));
    groups.push({ meshes, ...centre(k), far: 90 });
  }
  const plantKinds = makePlantKinds(T, B);
  const plantKeep = world.plants.filter((t, i) => (i * 0.618 % 1) < Q.plants);
  for (const [k, list] of bucket(plantKeep, t => t.kind)) {
    const K = plantKinds[k.split('|')[0]];
    if (!K) continue;
    const meshes = instance(K, list, t => { q.setFromAxisAngle(up, t.rot); sc.setScalar(t.s); p.set(t.x, t.y - 0.05, t.z); },
      (t, c) => c.setHSL(0.25 + t.tint * 0.08, 0.3, 0.8 + t.tint * 0.3));
    groups.push({ meshes, ...centre(k), far: 10 });
  }
  if (world.logs.length) {
    const logGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 1); logGeo.rotateZ(Math.PI / 2);
    const logMat = new THREE.MeshStandardMaterial({ map: T.bark, roughness: 0.95, color: B.snow ? 0xc8c8c8 : 0xb09070 });
    for (const [k, list] of bucket(world.logs, () => 'log')) {
      const meshes = instance([{ geo: logGeo, mat: logMat, shadow: true }], list, l => { e.set(0, l.rot, 0.04); q.setFromEuler(e); sc.set(l.len, l.rad, l.rad); p.set(l.x, l.y + l.rad * 0.6, l.z); });
      groups.push({ meshes, ...centre(k), far: 40 });
    }
  }
  for (const [k, list] of bucket(world.rocks, () => 'rock')) {
    const meshes = instance([{ geo: rockGeo, mat: rockMat, shadow: true }], list, r => { e.set(r.tilt * 0.5, r.rot, r.tilt * 0.3); q.setFromEuler(e); sc.set(r.s * 1.2, r.s * 0.75, r.s); p.set(r.x, r.y - r.s * 0.25, r.z); });
    groups.push({ meshes, ...centre(k), far: 90 });
  }

  // ---------------------------------------------------------------- far mountains (outlines in the haze)
  let farHills;
  {
    const r = rng(world.W + 3), segs = 96, pos = [], idx = [];
    for (let layer = 0; layer < 2; layer++) {
      const rad = 290 - layer * 14, base = pos.length / 3;
      for (let i = 0; i <= segs; i++) {
        const a = i / segs * Math.PI * 2, hgt = 30 - layer * 14 + (Math.sin(a * 3 + layer * 2) * 0.5 + 0.5) * (50 - layer * 20) + r() * (14 - layer * 6);
        pos.push(Math.cos(a) * rad, -120, Math.sin(a) * rad, Math.cos(a) * rad, hgt, Math.sin(a) * rad);
        if (i < segs) { const v = base + i * 2; idx.push(v, v + 2, v + 1, v + 1, v + 2, v + 3); }
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    const c = FOG.clone().lerp(new THREE.Color(B.snow ? 0x8fa3b8 : B.terrace ? 0xb07a5a : 0x6f8a8c), 0.35);
    const mat = new THREE.MeshBasicMaterial({ color: c, fog: false, side: THREE.DoubleSide, depthWrite: false });
    farHills = new THREE.Mesh(g, mat); farHills.renderOrder = -0.5; farHills.frustumCulled = false;
    scene.add(farHills);
  }

  // ---------------------------------------------------------------- grass blades near the camera
  const grass = Q.grass > 0 && !B.snow ? makeGrass(world, Q, uniforms) : null;
  if (grass) scene.add(grass.mesh);

  // ---------------------------------------------------------------- gates, flags, tape
  const props = makeProps(world, T);
  scene.add(props.group);

  // ---------------------------------------------------------------- dust
  const dust = makeDust(T, Q, world);
  const spray = makeDust(T, Q, world, 0xe8f4fa);       // water spray
  scene.add(spray.points);
  const skids = makeSkids(B);
  scene.add(skids.mesh);
  scene.add(dust.points);

  // ---------------------------------------------------------------- per frame
  const camXZ = new THREE.Vector2();
  function update(dt, cam, focus) {
    uniforms.uTime.value += dt;
    sky.position.copy(cam.position);
    camXZ.set(cam.position.x, cam.position.z);
    const far = Q.viewDist;
    for (const c of chunks) c.mesh.visible = Math.hypot(c.cx - camXZ.x, c.cz - camXZ.y) < far + (c.r || 46);
    for (const g of groups) { const v = Math.hypot(g.cx - camXZ.x, g.cz - camXZ.y) < Q.viewDist + g.far + 46; for (const m of g.meshes) m.visible = v; }
    farHills.position.set(cam.position.x, cam.position.y - 10, cam.position.z);
    // the sun's shadow box follows the rider, snapped to its pixels so edges don't shimmer
    if (Q.shadows) {
      const s = Q.shadowBox, texel = (2 * s) / Q.shadows;
      const fx = Math.round(focus.x / texel) * texel, fz = Math.round(focus.z / texel) * texel;
      sun.target.position.set(fx, focus.y, fz);
      sun.position.set(fx + SUN_DIR.x * 150, focus.y + SUN_DIR.y * 150, fz + SUN_DIR.z * 150);
    }
    if (grass) grass.update(cam);
    dust.update(dt);
    props.update(dt);
  }

  return { scene, sun, update, dust, spray, skids, props, uniforms };
}

// ------------------------------------------------------------------ pine tree: trunk, inner body, branch cards
function makePine(T, o = {}) {
  const r = rng(99);
  const H = 15;
  // trunk
  const trunk = new THREE.CylinderGeometry(0.1, 0.38, H, 9, 4, true);
  trunk.translate(0, H / 2, 0);
  { const uv = trunk.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2, uv.getY(i) * 6); }
  const barkMat = new THREE.MeshStandardMaterial({ map: T.bark, roughness: 0.95 });

  // inner dark body: stacked lumpy cones
  const bodyParts = [];
  const tiers = 6;
  for (let t = 0; t < tiers; t++) {
    const k = t / tiers;
    const y0 = 2.6 + k * (H - 3.4), h = (H - 2) / tiers * 1.9, rad = (1 - k) * 2.3 + 0.35;
    const cg = new THREE.ConeGeometry(rad, h, 11, 3, true);
    const pa = cg.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      const n = 0.82 + r() * 0.36;
      const droop = y < -h * 0.3 ? -0.25 * r() : 0;
      pa.setXYZ(i, x * n, y + droop, z * n);
    }
    cg.translate(0, y0 + h / 2, 0);
    bodyParts.push(cg);
  }
  const body = mergeGeos(bodyParts);
  body.computeVertexNormals();
  // tilt normals outwards/up so the body looks soft rather than faceted
  { const pa = body.attributes.position, na = body.attributes.normal; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i), l = Math.hypot(x, z) || 1; na.setXYZ(i, x / l * 0.7, 0.7, z / l * 0.7); } }
  const bodyMat = new THREE.MeshStandardMaterial({ color: o.body ?? 0x24402a, roughness: 1 });

  // branch cards: whorls going up, drooping. Each branch = a flat card + an upright card (looks full from any side)
  const cards = [];
  const whorls = 12;
  for (let w = 0; w < whorls; w++) {
    const k = w / whorls;
    const y = 2.2 + k * (H - 2.6);
    const len = (1 - k) * 3.8 + 1.0;
    const count = Math.max(4, Math.round(8 - k * 4));
    for (let c = 0; c < count; c++) {
      const ang = (c / count) * Math.PI * 2 + w * 0.9 + r() * 0.5;
      const droop = 0.25 + r() * 0.2 + k * 0.1;
      for (const upright of [false, true]) {
        const pg = new THREE.PlaneGeometry(len, len * (upright ? 0.5 : 0.62), 3, 1);
        pg.translate(len / 2, 0, 0);
        const pa = pg.attributes.position;
        for (let i = 0; i < pa.count; i++) { const x = pa.getX(i); pa.setY(i, pa.getY(i) - (x / len) ** 2 * len * 0.18 * (upright ? 0 : 1)); }
        if (!upright) pg.rotateX(-Math.PI / 2);
        pg.rotateZ(-droop);
        pg.rotateY(ang);
        pg.translate(0, y, 0);
        cards.push(pg);
      }
    }
  }
  // top tuft
  for (let c = 0; c < 3; c++) { const pg = new THREE.PlaneGeometry(1.1, 2.4); pg.rotateY(c * Math.PI / 3); pg.translate(0, H + 0.3, 0); cards.push(pg); }
  const cardGeo = mergeGeos(cards);
  // normals: point outwards + up (soft lighting like a real crown)
  { const pa = cardGeo.attributes.position, na = cardGeo.attributes.normal; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i), l = Math.hypot(x, z) || 1; na.setXYZ(i, x / l * 0.6, 0.8, z / l * 0.6); } }
  const cardMat = new THREE.MeshStandardMaterial({ map: o.tex || T.branch, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.9, color: 0xffffff });
  cardMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#undef DOUBLE_SIDED\n#include <normal_fragment_begin>');
  };
  return [
    { geo: trunk, mat: barkMat, shadow: true },
    { geo: body, mat: bodyMat, shadow: true, tint: !o.noTint },
    { geo: cardGeo, mat: cardMat, shadow: true, tint: !o.noTint },
  ];
}

function makeRockGeo() {
  const g = new THREE.IcosahedronGeometry(1, 2);
  const r = rng(5), pa = g.attributes.position;
  const seen = new Map();
  for (let i = 0; i < pa.count; i++) {
    const key = pa.getX(i).toFixed(3) + pa.getY(i).toFixed(3) + pa.getZ(i).toFixed(3);
    if (!seen.has(key)) seen.set(key, 0.75 + r() * 0.45);
    const n = seen.get(key);
    pa.setXYZ(i, pa.getX(i) * n, pa.getY(i) * n * (pa.getY(i) < 0 ? 0.6 : 1), pa.getZ(i) * n);
  }
  g.computeVertexNormals();
  return g;
}

// ------------------------------------------------------------------ other trees and plants
function cardMaterial(tex, color = 0xffffff) {
  const m = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.9, color });
  m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#undef DOUBLE_SIDED\n#include <normal_fragment_begin>'); };
  return m;
}
// soft "outwards and up" normals so card bunches light like a round crown
function puffNormals(g, cy = 0) {
  const pa = g.attributes.position, na = g.attributes.normal;
  for (let i = 0; i < pa.count; i++) { const v = new THREE.Vector3(pa.getX(i), (pa.getY(i) - cy) * 0.6 + 0.8, pa.getZ(i)).normalize(); na.setXYZ(i, v.x, v.y, v.z); }
  return g;
}
// a round bunch of crossed cards
function cardBall(r, n, cx, cy, cz, size, rand) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const pg = new THREE.PlaneGeometry(size, size);
    pg.rotateX((rand() - 0.5) * 1.6); pg.rotateY(rand() * Math.PI);
    const a = rand() * 6.28, el = (rand() - 0.3) * 1.2, d = r * Math.sqrt(rand());
    pg.translate(cx + Math.cos(a) * Math.cos(el) * d, cy + Math.sin(el) * d * 0.8, cz + Math.sin(a) * Math.cos(el) * d);
    out.push(pg);
  }
  return out;
}
function makeTreeKinds(T, B) {
  const r = rng(321), K = {};
  const need = new Set(B.trees.kinds.map(k => k[0]));
  if (need.has('pine')) K.pine = makePine(T);
  if (need.has('snowpine')) K.snowpine = makePine(T, { tex: T.branchSnow, body: 0x7f958c, noTint: true });
  if (need.has('birch')) {
    const trunk = new THREE.CylinderGeometry(0.09, 0.2, 13, 8, 3, true); trunk.translate(0, 6.5, 0);
    const bark = new THREE.MeshStandardMaterial({ map: T.bark, color: 0xf2eee6, roughness: 0.8 });
    const leaves = puffNormals(mergeGeos([...cardBall(2.6, 22, 0, 10, 0, 2.6, r), ...cardBall(1.8, 12, 0.6, 7.5, 0.3, 2.2, r), ...cardBall(1.4, 8, -0.5, 12.3, -0.2, 2, r)]), 10);
    K.birch = [{ geo: trunk, mat: bark, shadow: true }, { geo: leaves, mat: cardMaterial(T.leaves), shadow: true, tint: true }];
  }
  if (need.has('juniper')) {
    const trunk = new THREE.CylinderGeometry(0.12, 0.3, 3, 7, 2, true); trunk.translate(0, 1.5, 0);
    const pa = trunk.attributes.position; for (let i = 0; i < pa.count; i++) pa.setX(i, pa.getX(i) + Math.sin(pa.getY(i) * 1.7) * 0.15);
    const bark = new THREE.MeshStandardMaterial({ map: T.bark, color: 0xa08a78, roughness: 0.95 });
    const crown = puffNormals(mergeGeos([...cardBall(1.6, 20, 0, 3.2, 0, 2.2, r), ...cardBall(1.1, 10, 0.8, 2.4, 0.4, 1.6, r)]), 3);
    K.juniper = [{ geo: trunk, mat: bark, shadow: true }, { geo: crown, mat: cardMaterial(T.juniper), shadow: true, tint: true }];
  }
  if (need.has('cactus')) {
    const ribbed = (rad, h) => { const g = new THREE.CylinderGeometry(rad, rad, h, 16, 6); const pa = g.attributes.position; for (let i = 0; i < pa.count; i++) { const a = Math.atan2(pa.getZ(i), pa.getX(i)), k = 1 + 0.08 * Math.cos(a * 8); pa.setX(i, pa.getX(i) * k); pa.setZ(i, pa.getZ(i) * k); } return g; };
    const top = new THREE.SphereGeometry(0.34, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const main = ribbed(0.34, 5); main.translate(0, 2.5, 0); top.translate(0, 5, 0);
    const parts = [main, top];
    for (const [sd, y, l] of [[1, 2.2, 1.6], [-1, 2.9, 1.2]]) {
      const out = ribbed(0.22, 0.7); out.rotateZ(sd * Math.PI / 2); out.translate(sd * 0.55, y, 0);
      const upA = ribbed(0.22, l); upA.translate(sd * 0.9, y + l / 2, 0);
      const cap = new THREE.SphereGeometry(0.22, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); cap.translate(sd * 0.9, y + l, 0);
      parts.push(out, upA, cap);
    }
    const g = mergeGeos(parts); g.computeVertexNormals();
    K.cactus = [{ geo: g, mat: new THREE.MeshStandardMaterial({ color: 0x5b7f3e, roughness: 0.75 }), shadow: true }];
  }
  if (need.has('dead')) {
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.1, 0.28, 6, 7, 2); trunk.translate(0, 3, 0); parts.push(trunk);
    for (let i = 0; i < 5; i++) { const l = 1.2 + r() * 1.6; const b = new THREE.CylinderGeometry(0.03, 0.08, l, 5); b.translate(0, l / 2, 0); b.rotateZ(0.6 + r() * 0.5); b.rotateY(r() * 6.28); b.translate(0, 2.5 + i * 0.7, 0); parts.push(b); }
    const g = mergeGeos(parts); g.computeVertexNormals();
    K.dead = [{ geo: g, mat: new THREE.MeshStandardMaterial({ map: T.bark, color: 0xb8a898, roughness: 0.95 }), shadow: true }];
  }
  return K;
}
function makePlantKinds(T, B) {
  const r = rng(654), K = {};
  const need = new Set(B.plants.kinds.map(k => k[0]));
  if (need.has('fern')) {
    const cards = [];
    for (let i = 0; i < 6; i++) { const pg = new THREE.PlaneGeometry(0.5, 1.1); pg.translate(0, 0.55, 0); pg.rotateX(-0.75 - r() * 0.3); pg.rotateY(i / 6 * 6.28 + r() * 0.4); cards.push(pg); }
    K.fern = [{ geo: puffNormals(mergeGeos(cards), 0), mat: cardMaterial(T.fern), shadow: false, tint: true }];
  }
  if (need.has('bush')) K.bush = [{ geo: puffNormals(mergeGeos(cardBall(0.5, 9, 0, 0.45, 0, 0.9, r)), 0.4), mat: cardMaterial(T.leaves), shadow: false, tint: true }];
  if (need.has('snowbush')) K.snowbush = [{ geo: puffNormals(mergeGeos(cardBall(0.5, 9, 0, 0.4, 0, 0.9, r)), 0.4), mat: cardMaterial(T.branchSnow), shadow: false }];
  if (need.has('shrub')) {
    const cards = [];
    for (let i = 0; i < 3; i++) { const pg = new THREE.PlaneGeometry(1.1, 1.1); pg.translate(0, 0.5, 0); pg.rotateY(i * Math.PI / 3); cards.push(pg); }
    K.shrub = [{ geo: puffNormals(mergeGeos(cards), 0.3), mat: cardMaterial(T.shrub), shadow: false }];
  }
  return K;
}

export function mergeGeos(list) {
  let vCount = 0, iCount = 0;
  const geos = list.map(g => g.index ? g : (() => { const n = g.attributes.position.count, ix = []; for (let i = 0; i < n; i++) ix.push(i); g.setIndex(ix); return g; })());
  for (const g of geos) { vCount += g.attributes.position.count; iCount += g.index.count; }
  const pos = new Float32Array(vCount * 3), nrm = new Float32Array(vCount * 3), uv = new Float32Array(vCount * 2), idx = new Uint32Array(iCount);
  let vo = 0, io = 0;
  for (const g of geos) {
    const n = g.attributes.position.count;
    pos.set(g.attributes.position.array, vo * 3);
    if (g.attributes.normal) nrm.set(g.attributes.normal.array, vo * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
    const gi = g.index.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += n; io += gi.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

// ------------------------------------------------------------------ grass
function makeGrass(world, Q, uniforms) {
  const P = Q.grassPatch, step = Q.grass;
  const r = rng(3);
  // one clump = 4 curved blades
  const pos = [], nrm = [], colr = [], uv = [], ind = [];
  let v = 0;
  for (let b = 0; b < 6; b++) {
    const ang = r() * Math.PI, ox = (r() - 0.5) * 0.24, oz = (r() - 0.5) * 0.24, h = 0.2 + r() * 0.22, w = 0.02 + r() * 0.012, lean = 0.06 + r() * 0.1;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const segs = 4;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs, ww = w * (1 - t * 0.92), y = h * t, f = lean * t * t;
      for (const side of [-1, 1]) {
        const lx = side * ww, lz = f;
        pos.push(ox + lx * ca - lz * sa, y, oz + lx * sa + lz * ca);
        nrm.push(-sa * 0.3, 1, ca * 0.3);
        const c = 0.45 + t * 0.55;
        const BL = world.B.blades, BT = world.B.bladeTip;
        colr.push(BL[0] * c + BT[0] * t, BL[1] * c + BT[1] * t, BL[2] * c + BT[2] * t);
        uv.push(side * 0.5 + 0.5, t);
      }
      if (s < segs) { const a = v + s * 2; ind.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    v += (segs + 1) * 2;
  }
  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  const n = Math.floor(P / step), offs = new Float32Array(n * n * 3);
  let k = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    offs[k++] = (i + r()) * step; offs[k++] = (j + r()) * step; offs[k++] = r();
  }
  geo.setAttribute('aOff', new THREE.InstancedBufferAttribute(offs, 3));
  geo.instanceCount = n * n;

  // height + trail mask as a float texture the blades read from
  const { NX, NZ, H, mask, HALF } = world;
  const data = new Float32Array(NX * NZ * 2);
  for (let i = 0; i < NX * NZ; i++) { data[i * 2] = H[i]; data[i * 2 + 1] = mask[i]; }
  const hm = new THREE.DataTexture(data, NX, NZ, THREE.RGFormat, THREE.FloatType);
  hm.needsUpdate = true;
  const cam = { value: new THREE.Vector3() };
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide });
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, { tHM: { value: hm }, uCam: cam, uP: { value: P }, uHalf: { value: HALF }, uTime: uniforms.uTime });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec3 aOff; uniform sampler2D tHM; uniform vec3 uCam; uniform float uP, uHalf, uTime;
        vec2 hmAt(vec2 p){
          vec2 g = vec2(p.x + uHalf, p.y);
          ivec2 sz = textureSize(tHM, 0);
          vec2 c = clamp(g, vec2(0.), vec2(sz) - 1.001);
          ivec2 i0 = ivec2(floor(c)); vec2 f = c - vec2(i0);
          vec2 a = texelFetch(tHM, i0, 0).rg, b = texelFetch(tHM, i0 + ivec2(1,0), 0).rg;
          vec2 cc = texelFetch(tHM, i0 + ivec2(0,1), 0).rg, d = texelFetch(tHM, i0 + ivec2(1,1), 0).rg;
          return mix(mix(a, b, f.x), mix(cc, d, f.x), f.y);
        }`)
      .replace('#include <begin_vertex>', `
        vec2 wp = uCam.xz + mod(aOff.xy - uCam.xz + uP * 0.5, uP) - uP * 0.5;
        vec2 hm = hmAt(wp);
        float dist = length(wp - uCam.xz);
        float fade = 1. - smoothstep(uP * 0.3, uP * 0.48, dist);
        float sc = fade * (1. - smoothstep(0.08, 0.45, hm.y)) * (0.55 + aOff.z * 0.9);
        float ang = aOff.z * 6.2831;
        float ca = cos(ang), sa = sin(ang);
        vec3 transformed = vec3(position.x * ca - position.z * sa, position.y, position.x * sa + position.z * ca) * sc;
        float wind = sin(uTime * 1.6 + wp.x * 0.35 + wp.y * 0.21) * 0.6 + sin(uTime * 2.7 + wp.x * 0.9) * 0.25;
        float hy = clamp(position.y / 0.4, 0., 1.);
        transformed.xz += vec2(0.09, 0.05) * wind * hy * hy * sc;
        transformed += vec3(wp.x, hm.x - 0.02, wp.y);`)
      .replace('#include <color_vertex>', `#include <color_vertex>
        vColor.rgb *= 0.8 + aOff.z * 0.45;
        vColor.rg += vec2(0.06, 0.03) * step(0.85, fract(aOff.z * 7.3));`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#undef DOUBLE_SIDED\n#include <normal_fragment_begin>');
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.receiveShadow = true;
  return { mesh, update(c) { cam.value.copy(c.position); } };
}

// ------------------------------------------------------------------ gates, flags, course tape
function bannerTex(text, bg, fg) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 160;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 1024, 160);
  g.fillStyle = 'rgba(255,255,255,.12)'; for (let x = -160; x < 1024; x += 80) { g.beginPath(); g.moveTo(x, 160); g.lineTo(x + 60, 0); g.lineTo(x + 90, 0); g.lineTo(x + 30, 160); g.fill(); }
  g.fillStyle = fg; g.font = '900 104px Nunito, Arial Black, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 512, 86);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function makeProps(world, T) {
  const group = new THREE.Group();
  const pole = new THREE.MeshStandardMaterial({ color: 0x33363d, roughness: 0.5, metalness: 0.6 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a6440, roughness: 0.9, map: T.bark });
  const flags = [];
  function arch(p, text, bg, fg) {
    const g = new THREE.Group();
    const w = world.routes[p.r || 0].halfW(p.i) * 2 + 3;
    for (const s of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.4, 10), pole);
      m.position.set(s * w / 2, 2.7, 0); m.castShadow = true; g.add(m);
    }
    const bt = bannerTex(text, bg, fg);
    const bm = new THREE.MeshStandardMaterial({ map: bt, emissiveMap: bt, emissive: 0xffffff, emissiveIntensity: 0.45, roughness: 0.7, side: THREE.DoubleSide });
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 160 / 1024 * 1.4), bm);
    ban.position.y = 4.8; ban.castShadow = true; g.add(ban);
    g.position.set(p.x, world.height(p.x, p.z) - 0.1, p.z);
    g.rotation.y = p.yaw + Math.PI;
    group.add(g);
    return g;
  }
  // start ramp
  {
    const p = world.pathPoint(world.path.start);
    arch(p, 'MOUNTAIN RUSH', '#1f6feb', '#ffffff');
    const s = world.start;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 4), wood);
    deck.position.set(s.x, world.height(s.x, s.z) - 0.18, s.z); deck.rotation.y = s.yaw; deck.receiveShadow = true;
    group.add(deck);
  }
  world.checkpoints.slice(1).forEach(c => c.gates.forEach(p => arch(p, `CHECKPOINT ${c.k}`, '#f59e0b', '#1b1b1b')));
  // route signs where the lines split
  {
    const A = world.routes[0], Bk = world.routes[1];
    let split = 120;
    for (let i = 60; i < Bk.n; i += 2) { let d = 1e9; for (let j = Math.max(0, i - 40); j < Math.min(A.n, i + 40); j++) d = Math.min(d, Math.hypot(A.x[j] - Bk.x[i], A.z[j] - Bk.z[i])); if (d > 9) { split = i; break; } }
    const zs = Bk.z[split] + 8;
    world.routes.forEach((R, ri) => { let i = 0; while (i < R.n - 1 && R.z[i] < zs) i++; arch(world.pathPoint(i, ri), R.name.toUpperCase(), ri ? '#c62828' : '#2e7d32', '#ffffff'); });
  }
  arch(world.finish, 'FINISH', '#111111', '#ffffff');

  // trail marker posts with tape on the outside of berms and next to jumps
  // striped course tape (like race tape)
  const tc = document.createElement('canvas'); tc.width = 64; tc.height = 8;
  { const g = tc.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 8); g.fillStyle = world.B.snow ? '#d32f2f' : world.B.terrace ? '#1565c0' : '#d32f2f'; g.fillRect(0, 0, 32, 8); }
  const tapeTex = new THREE.CanvasTexture(tc); tapeTex.wrapS = THREE.RepeatWrapping; tapeTex.colorSpace = THREE.SRGBColorSpace;
  const tapeMat = new THREE.MeshStandardMaterial({ map: tapeTex, roughness: 0.6, side: THREE.DoubleSide });
  const postGeo = new THREE.CylinderGeometry(0.035, 0.04, 1.1, 6); postGeo.translate(0, 0.55, 0);
  const postMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d0, roughness: 0.8 });
  const posts = [], tapes = [];
  const tapeGeos = [];
  const offTrail = (x, z) => { const t = world.trailAt(x, z); return t.i < 0 || t.d > world.routes[t.r].halfW(t.i) + 2.6; };
  for (const path of world.routes) for (let i = path.start + 15; i < path.finish - 6; i += 4) {
    const a = Math.atan2(path.tx[i + 4] || 0, path.tz[i + 4] || 1) - Math.atan2(path.tx[i], path.tz[i]);
    if (Math.abs(a) < 0.05) continue;
    const side = a > 0 ? -1 : 1;           // outside of the turn, beyond the top of the berm
    const mk = j => { const w = path.halfW(j) + 3.9; const x = path.x[j] + path.tz[j] * w * side, z = path.z[j] - path.tx[j] * w * side; return new THREE.Vector3(x, world.height(x, z), z); };
    const p0 = mk(i), p1 = mk(i + 4), pm = p0.clone().add(p1).multiplyScalar(0.5);
    if (!offTrail(p0.x, p0.z) || !offTrail(p1.x, p1.z) || !offTrail(pm.x, pm.z)) continue;   // never across a trail (e.g. where the routes cross)
    posts.push(p0, p1);
    const dir = p1.clone().sub(p0), len = dir.length();
    const tg = new THREE.PlaneGeometry(len, 0.08);
    { const uva = tg.attributes.uv; for (let q = 0; q < uva.count; q++) uva.setX(q, uva.getX(q) * len / 0.8); }
    const xa = dir.clone().normalize(), za = new THREE.Vector3().crossVectors(xa, new THREE.Vector3(0, 1, 0)).normalize(), ya = new THREE.Vector3().crossVectors(za, xa);
    tg.applyMatrix4(new THREE.Matrix4().makeBasis(xa, ya, za).setPosition(pm.x, pm.y + 0.9, pm.z));
    tapeGeos.push(tg);
  }
  if (tapeGeos.length) { const tm = new THREE.Mesh(mergeGeos(tapeGeos), tapeMat); group.add(tm); tapes.push(tm); }
  // hoops to fly through
  const hoopMat = new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff5a00, emissiveIntensity: 0.9, roughness: 0.4 });
  for (const h of world.hoops) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(h.r, 0.09, 8, 36), hoopMat); ring.castShadow = true; g.add(ring);
    for (const sx of [-1, 1]) { const ph = h.y - h.ground + 0.3; const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, ph, 8), pole); pl.position.set(sx * (h.r + 0.05), -ph / 2, 0); pl.castShadow = true; g.add(pl); }
    g.position.set(h.x, h.y, h.z); g.rotation.y = h.yaw;
    group.add(g);
  }
  if (posts.length) {
    const im = new THREE.InstancedMesh(postGeo, postMat, posts.length);
    const m4 = new THREE.Matrix4();
    posts.forEach((p, i) => { m4.makeTranslation(p.x, p.y - 0.1, p.z); im.setMatrixAt(i, m4); });
    im.castShadow = true;
    group.add(im);
  }
  // ---------------------------------------------------------------- course detail
  // Everything below is merged by material (a handful of draw calls for hundreds of things).
  const Y = new THREE.Vector3(0, 1, 0), M4 = new THREE.Matrix4(), Q4 = new THREE.Quaternion(), E3 = new THREE.Euler(), S3 = new THREE.Vector3(), P3 = new THREE.Vector3();
  const bins = new Map();
  const put = (mat, geo, x, y, z, yaw = 0, sx = 1, sy = 1, sz = 1, pitch = 0) => {
    E3.set(pitch, yaw, 0, 'YXZ'); Q4.setFromEuler(E3); M4.compose(P3.set(x, y, z), Q4, S3.set(sx, sy, sz));
    const g = geo.clone(); g.applyMatrix4(M4);
    if (!bins.has(mat)) bins.set(mat, []); bins.get(mat).push(g);
  };
  const signTex = draw => { const c = document.createElement('canvas'); c.width = c.height = 128; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const postG = new THREE.CylinderGeometry(0.03, 0.035, 1, 6); postG.translate(0, 0.5, 0);
  const quad = new THREE.PlaneGeometry(1, 1);
  // crash pads round the trees you zig-zag past
  const padMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.7 });
  const padG = new THREE.CylinderGeometry(0.42, 0.42, 1.5, 14); padG.translate(0, 0.95, 0);
  const bandG = new THREE.CylinderGeometry(0.43, 0.43, 0.12, 14); bandG.translate(0, 1.2, 0);
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.7 });
  for (const p of world.pads) { put(padMat, padG, p.x, p.y - 0.25, p.z); put(whiteMat, bandG, p.x, p.y - 0.25, p.z); }
  // roots snaking from trees across the edge of the trail
  { const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(new THREE.Vector3(Math.sin(t * 5) * 0.07, 0.05 * Math.sin(t * Math.PI) + 0.01, t)); }
    const rootG = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.05, 5, false);
    const pa = rootG.attributes.position; for (let i = 0; i < pa.count; i++) { const k = 1 - pa.getZ(i) * 0.65; pa.setX(i, pa.getX(i) * k + (1 - k) * Math.sin(pa.getZ(i) * 5) * 0.07); pa.setY(i, pa.getY(i) * k); }
    const rootMat = new THREE.MeshStandardMaterial({ map: T.bark, color: world.B.snow ? 0x9a9088 : 0xa88868, roughness: 0.95 });
    for (const rt of world.roots) {
      const x1 = rt.x + Math.sin(rt.rot) * rt.len, z1 = rt.z + Math.cos(rt.rot) * rt.len, y1 = world.height(x1, z1);
      put(rootMat, rootG, rt.x, rt.y + 0.02, rt.z, rt.rot, 1.3, 1.3, rt.len, -Math.atan2(y1 - rt.y, rt.len)); } }
  // timber legs, rails and braces under decks and behind wall rides
  { const boxG = new THREE.BoxGeometry(1, 1, 1);
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x9a7448, roughness: 0.88 });
    for (const b of world.timbers || []) { const dx = b.x1 - b.x0, dy = b.y1 - b.y0, dz = b.z1 - b.z0, hz = Math.hypot(dx, dz), len = Math.hypot(hz, dy);
      put(timberMat, boxG, (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2, hz > 0.001 ? Math.atan2(dx, dz) : 0, b.t, b.t, len, -Math.atan2(dy, hz)); } }
  // suspended plank platforms: a timber deck on legs, clear of the ground
  { const deckMat = new THREE.MeshStandardMaterial({ map: T.planks, roughness: 0.86, color: 0xf2e6d4 });
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x7d5c38, roughness: 0.9 });
    for (const dk of world.decks || []) {
      const P = dk.pts, n = P.length, TH = 0.14, pos = [], uv = [], idx = [];
      // four verts per station: top-left, top-right, bottom-left, bottom-right
      for (let i = 0; i < n; i++) { const p = P[i]; pos.push(p.ax, p.y, p.az, p.bx, p.y, p.bz, p.ax, p.y - TH, p.az, p.bx, p.y - TH, p.bz); const v = (p.u - P[0].u) * 0.52; uv.push(0, v, 1.53, v, 0, v, 1.53, v); }
      for (let i = 0; i < n - 1; i++) { const a = i * 4, b = a + 4;
        idx.push(a, b, a + 1, a + 1, b, b + 1);                 // top
        idx.push(a + 2, a + 3, b + 2, a + 3, b + 3, b + 2);     // underside
        idx.push(a, a + 2, b, a + 2, b + 2, b);                 // left edge
        idx.push(a + 1, b + 1, a + 3, a + 3, b + 1, b + 3); }   // right edge
      const e = (n - 1) * 4; idx.push(0, 1, 2, 1, 3, 2, e, e + 2, e + 1, e + 1, e + 2, e + 3);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, deckMat); m.castShadow = true; m.receiveShadow = true; group.add(m);
      // joists across underneath
      for (let i = 4; i < n - 1; i += 5) { const p = P[i], dx = p.bx - p.ax, dz = p.bz - p.az; put(beamMat, new THREE.BoxGeometry(1, 1, 1), (p.ax + p.bx) / 2, p.y - TH - 0.07, (p.az + p.bz) / 2, Math.atan2(dx, dz), 0.12, 0.14, Math.hypot(dx, dz) + 0.3); }
    } }
  // water: streams across the trail and the puddle in the tunnel
  { const waterMat = new THREE.MeshStandardMaterial({ color: world.B.snow ? 0x7fb4c9 : 0x2f5d6b, roughness: 0.06, metalness: 0.35, transparent: true, opacity: 0.82 });
    for (const w of world.waters || []) { const g = new THREE.PlaneGeometry(w.wid, w.len, 1, 1); g.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(g, waterMat); m.position.set(w.x, w.y, w.z); m.rotation.y = w.yaw; m.receiveShadow = true; group.add(m); } }
  // things to jump over and funny bits beside the trail (lorry with logs, snowplough, snowmen, bus, wrecked car...)
  { const box = new THREE.BoxGeometry(1, 1, 1), cyl = new THREE.CylinderGeometry(1, 1, 1, 12), ball = new THREE.SphereGeometry(1, 12, 9), cone = new THREE.ConeGeometry(1, 1, 10);
    const M = (color, rough = 0.8, metal = 0.1) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    const glass = M(0x1c2428, 0.25, 0.4), tyre = M(0x17171a, 0.95, 0), steel = M(0x4a4e55, 0.6, 0.5), snowM = M(0xf4f8fb, 0.9, 0), coal = M(0x15151a, 0.9, 0), carrot = M(0xf07a1c, 0.7, 0);
    const bark = M(0x6b4a2c, 0.95, 0), cut = M(0xd2ad6e, 0.9, 0), red = M(0xb3261e, 0.6, 0.25), orange = M(0xf08a1a, 0.6, 0.2), yellow = M(0xf2c318, 0.65, 0.15), white = M(0xf2f2f2, 0.7, 0), green = M(0x4f8a3a, 0.85, 0), bone = M(0xe9e2cf, 0.8, 0), straw = M(0xd8b655, 0.95, 0);
    const paints = [0x8c3b24, 0x4f6a78, 0xb08a2e, 0x6d7a55].map(c => M(c, 0.8, 0.25));
    const HP = Math.PI / 2;
    for (const c of world.cars || []) {
      const s = Math.sin(c.yaw), co = Math.cos(c.yaw);
      // local frame: lx to the side, ly up, lz forward
      const sl = c.slope || 0, bp = -Math.atan(sl);        // long vehicles sit along the slope of the ground
      const at = (mat, geo, lx, ly, lz, sx, sy, sz, pitch = 0, yawOff = 0) => put(mat, geo, c.x + lx * co + lz * s, c.y + ly + sl * lz, c.z - lx * s + lz * co, c.yaw + yawOff, sx, sy, sz, pitch + (yawOff ? 0 : bp));
      const wheel = (lx, lz, rad = 0.4) => at(tyre, cyl, lx, rad, lz, rad, 0.26, rad, HP, HP);
      const logAlong = (lx, ly, lz, rad, len) => { at(bark, cyl, lx, ly, lz, rad, len, rad, HP); at(cut, cyl, lx, ly, lz + len / 2 + 0.01, rad * 0.9, 0.02, rad * 0.9, HP); at(cut, cyl, lx, ly, lz - len / 2 - 0.01, rad * 0.9, 0.02, rad * 0.9, HP); };
      const logAcross = (ly, lz, rad, len) => { at(bark, cyl, 0, ly, lz, rad, len, rad, HP, HP); at(cut, cyl, len / 2 + 0.01, ly, lz, rad * 0.9, 0.02, rad * 0.9, HP, HP); at(cut, cyl, -len / 2 - 0.01, ly, lz, rad * 0.9, 0.02, rad * 0.9, HP, HP); };
      const snowman = (lx, lz, k = 1, hat = false) => { at(snowM, ball, lx, 0.42 * k, lz, 0.5 * k, 0.46 * k, 0.5 * k); at(snowM, ball, lx, 1.0 * k, lz, 0.37 * k, 0.35 * k, 0.37 * k); at(snowM, ball, lx, 1.45 * k, lz, 0.26 * k, 0.26 * k, 0.26 * k);
        at(carrot, cone, lx, 1.45 * k, lz - 0.34 * k, 0.05 * k, 0.26 * k, 0.05 * k, -HP); for (const e of [-0.09, 0.09]) at(coal, ball, lx + e * k, 1.53 * k, lz - 0.23 * k, 0.03 * k, 0.03 * k, 0.03 * k);
        for (const b of [0.9, 1.05, 1.2]) at(coal, ball, lx, b * k, lz - 0.36 * k, 0.03 * k, 0.03 * k, 0.03 * k);
        for (const sd of [-1, 1]) at(bark, box, lx + sd * 0.55 * k, 1.12 * k, lz, 0.5 * k, 0.03, 0.03, 0, 0);
        if (hat) { at(coal, cyl, lx, 1.68 * k, lz, 0.3 * k, 0.03, 0.3 * k); at(coal, cyl, lx, 1.83 * k, lz, 0.19 * k, 0.28 * k, 0.19 * k); } };
      const k = c.kind;
      if (k === 'car') { const body = paints[Math.floor(c.tint * 4) % 4], q = HP;        // lies across the gap
        const a2 = (mat, geo, lx, ly, lz, sx, sy, sz) => put(mat, geo, c.x + lz * co + lx * -s, c.y + ly, c.z - lz * s - lx * co, c.yaw + q, sx, sy, sz);
        a2(body, box, 0, 0.5, 0, 1.72, 0.52, 4.1); a2(body, box, 0, 0.3, 2.0, 1.6, 0.2, 0.25); a2(body, box, 0, 0.3, -2.0, 1.6, 0.2, 0.25);
        a2(glass, box, 0, 0.98, -0.25, 1.5, 0.44, 1.95); a2(body, box, 0, 1.24, -0.25, 1.56, 0.08, 2.0);
        for (const px of [-0.8, 0.8]) for (const pz of [-1.3, 1.3]) put(tyre, cyl, c.x + pz * co - px * s, c.y + 0.3, c.z - pz * s - px * co, c.yaw + q + HP, 0.33, 0.24, 0.33, HP); }
      else if (k === 'lorry') {                                   // a logging lorry, loaded
        at(steel, box, 0, 0.62, 0, 2.0, 0.22, 6.9);
        at(red, box, 0, 1.25, 2.55, 2.2, 1.15, 1.7); at(glass, box, 0, 1.5, 3.3, 1.9, 0.5, 0.25); at(red, box, 0, 0.75, 3.35, 2.2, 0.35, 0.2); at(steel, box, 0, 1.4, 1.62, 2.1, 1.3, 0.12);
        for (const lz of [2.5, -1.5, -2.7]) for (const lx of [-0.95, 0.95]) wheel(lx, lz, 0.45);
        for (const lx of [-0.62, 0, 0.62]) logAlong(lx, 1.02, -0.95, 0.29, 4.6);
        for (const lx of [-0.31, 0.31]) logAlong(lx, 1.52, -0.9, 0.27, 4.5);
        for (const lz of [1.2, -3.1]) for (const lx of [-1.0, 1.0]) at(steel, box, lx, 1.3, lz, 0.08, 1.2, 0.08); }
      else if (k === 'plough') {                                  // a snowplough
        at(steel, box, 0, 0.55, -0.3, 2.0, 0.25, 4.6); at(orange, box, 0, 1.15, -1.2, 2.3, 0.95, 2.9); at(snowM, box, 0, 1.68, -1.2, 2.1, 0.14, 2.7);
        at(orange, box, 0, 1.25, 1.15, 2.2, 1.2, 1.5); at(glass, box, 0, 1.5, 1.92, 1.9, 0.5, 0.12); at(snowM, box, 0, 1.9, 1.15, 2.0, 0.1, 1.3); at(yellow, box, 0, 2.0, 1.15, 0.25, 0.14, 0.25);
        at(yellow, box, 0, 0.6, 2.75, 3.1, 0.95, 0.16, -0.25, 0.3); at(steel, box, 0, 0.55, 2.3, 0.3, 0.2, 0.9);
        for (const lz of [1.1, -1.7]) for (const lx of [-0.95, 0.95]) wheel(lx, lz, 0.48);
        at(snowM, ball, 1.9, 0.25, 3.0, 0.9, 0.45, 0.8); }
      else if (k === 'bus') {                                     // an old yellow bus
        at(yellow, box, 0, 1.2, 0, 2.3, 1.45, 6.7); at(glass, box, 0, 1.45, 0, 2.34, 0.5, 6.1); at(yellow, box, 0, 1.93, 0, 2.2, 0.08, 6.5); at(coal, box, 0, 0.75, 0, 2.34, 0.1, 6.7);
        for (const lz of [-2.6, -1.3, 0, 1.3, 2.6]) at(yellow, box, 0, 1.45, lz, 2.36, 0.5, 0.12);
        at(glass, box, 0, 1.4, 3.36, 2.0, 0.6, 0.06); for (const lz of [2.2, -2.2]) for (const lx of [-1.0, 1.0]) wheel(lx, lz, 0.45); }
      else if (k === 'snowmen') { snowman(-1.5, 0, 1); snowman(0, 0, 1.08, true); snowman(1.5, 0, 0.95); }
      else if (k === 'cacti') for (const lx of [-1.5, 0, 1.5]) { at(green, cyl, lx, 0.8, 0, 0.26, 1.6, 0.26); at(green, ball, lx, 1.6, 0, 0.26, 0.26, 0.26); at(green, cyl, lx + 0.4, 0.95, 0, 0.12, 0.5, 0.12); at(green, cyl, lx + 0.26, 0.75, 0, 0.12, 0.4, 0.12, 0, 0); }
      else if (k === 'logpile') { for (const lz of [-0.6, 0, 0.6]) logAcross(0.3, lz, 0.3, c.side ? 2.6 : 3.8); for (const lz of [-0.3, 0.3]) logAcross(0.82, lz, 0.29, c.side ? 2.6 : 3.8); if (!c.side) logAcross(1.0, 0, 0.2, 3.6); }
      else if (k === 'log') logAcross(0.02, 0, 0.3, c.len);
      else if (k === 'snowman') snowman(0, 0, 0.9 + c.tint * 0.3, c.tint > 0.5);
      else if (k === 'tyres') { for (let q = 0; q < 3; q++) at(tyre, cyl, 0, 0.13 + q * 0.26, 0, 0.42, 0.25, 0.42); at(tyre, cyl, 0.75, 0.4, 0.2, 0.42, 0.25, 0.42, HP, 0.4); }
      else if (k === 'cones') for (const [lx, lz] of [[0, 0], [0.7, 0.5], [-0.5, 0.8]]) { at(orange, cone, lx, 0.36, lz, 0.2, 0.7, 0.2); at(white, cyl, lx, 0.4, lz, 0.115, 0.1, 0.115); at(orange, box, lx, 0.02, lz, 0.5, 0.04, 0.5); }
      else if (k === 'haybale') { at(straw, cyl, 0, 0.6, 0, 0.6, 1.2, 0.6, HP, HP); at(straw, box, 1.0, 0.25, 0.6, 1.0, 0.5, 0.5, 0, 0.5); }
      else if (k === 'sled') { at(red, box, 0, 0.22, 0, 0.5, 0.05, 1.2); for (const lx of [-0.22, 0.22]) at(steel, box, lx, 0.07, 0, 0.04, 0.04, 1.35); at(snowM, ball, 0.9, 0.2, 0.3, 0.45, 0.3, 0.45); }
      else if (k === 'cactusbig') { at(green, cyl, 0, 1.3, 0, 0.3, 2.6, 0.3); at(green, ball, 0, 2.6, 0, 0.3, 0.3, 0.3); for (const sd of [-1, 1]) { at(green, cyl, sd * 0.45, 1.3 + sd * 0.2, 0, 0.14, 0.14, 0.5, 0, 0); at(green, cyl, sd * 0.68, 1.75 + sd * 0.2, 0, 0.14, 0.9, 0.14); at(green, ball, sd * 0.68, 2.2 + sd * 0.2, 0, 0.14, 0.14, 0.14); } }
      else if (k === 'skull') { at(bone, ball, 0, 0.2, 0, 0.26, 0.2, 0.34); for (const sd of [-1, 1]) { at(bone, cone, sd * 0.38, 0.32, -0.05, 0.05, 0.5, 0.05, 0, 0); at(coal, ball, sd * 0.1, 0.24, -0.26, 0.05, 0.05, 0.05); } }
    } }
  // stumps
  { const g1 = new THREE.CylinderGeometry(0.26, 0.34, 0.4, 10); g1.translate(0, 0.2, 0);
    const g2 = new THREE.CircleGeometry(0.255, 10); g2.rotateX(-Math.PI / 2); g2.translate(0, 0.402, 0);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xc9a66b, roughness: 0.85 });
    for (const st of world.stumps) { put(wood, g1, st.x, st.y - 0.05, st.z, st.x, st.s, st.s, st.s); put(topMat, g2, st.x, st.y - 0.05, st.z, st.x, st.s, st.s, st.s); } }
  // arrow boards on sharp turns, warning signs before the tricky bits
  { const arrow = dir => signTex(g => { g.fillStyle = '#ffd400'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#111'; g.lineWidth = 6; g.strokeStyle = '#111'; g.strokeRect(3, 3, 122, 122);
      g.translate(64, 64); g.scale(dir, 1); for (const o of [-26, 14]) { g.beginPath(); g.moveTo(o + 22, -40); g.lineTo(o - 14, 0); g.lineTo(o + 22, 40); g.lineTo(o + 4, 40); g.lineTo(o - 32, 0); g.lineTo(o + 4, -40); g.fill(); } });
    const aL = new THREE.MeshStandardMaterial({ map: arrow(1), roughness: 0.6, side: THREE.DoubleSide }), aR = new THREE.MeshStandardMaterial({ map: arrow(-1), roughness: 0.6, side: THREE.DoubleSide });
    for (const a of world.arrows) { put(postMat, postG, a.x, a.y - 0.1, a.z, 0, 1.4, 1.5, 1.4); put(a.dir > 0 ? aL : aR, quad, a.x, a.y + 1.2, a.z, a.yaw + Math.PI, 0.8, 0.8, 1); }
    const warnMat = new THREE.MeshStandardMaterial({ map: signTex(g => { g.clearRect(0, 0, 128, 128); g.fillStyle = '#e53935'; g.beginPath(); g.moveTo(64, 6); g.lineTo(124, 118); g.lineTo(4, 118); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(64, 28); g.lineTo(104, 106); g.lineTo(24, 106); g.fill(); g.fillStyle = '#111'; g.font = '900 64px Arial Black, sans-serif'; g.textAlign = 'center'; g.fillText('!', 64, 100); }), transparent: true, alphaTest: 0.5, roughness: 0.6, side: THREE.DoubleSide });
    for (const a of world.warns) { put(postMat, postG, a.x, a.y - 0.1, a.z, 0, 1.4, 1.3, 1.4); put(warnMat, quad, a.x, a.y + 1.35, a.z, a.yaw + Math.PI, 0.75, 0.75, 1); } }
  // feather flags at the jumps
  { const poleG = new THREE.CylinderGeometry(0.02, 0.025, 1, 6); poleG.translate(0, 0.5, 0);
    const fg = new THREE.PlaneGeometry(0.5, 1.9, 1, 6); { const pa = fg.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); pa.setX(i, pa.getX(i) * (1 - Math.max(0, y) * 0.35) + 0.25); pa.setZ(i, Math.sin(y * 3) * 0.05); } }
    const cols = [0x1f6feb, 0xf59e0b, 0xe11d48].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, side: THREE.DoubleSide }));
    for (const f of world.flags) { put(pole, poleG, f.x, f.y - 0.1, f.z, 0, 1, 3.1, 1); put(cols[f.tint || 0], fg, f.x, f.y + 1.95, f.z, f.yaw + Math.PI / 2); } }
  // banners along the straights
  { const bMat = new THREE.MeshStandardMaterial({ map: bannerTex('MOUNTAIN RUSH', '#111827', '#ffffff'), roughness: 0.7, side: THREE.DoubleSide });
    for (const b of world.banners) { const sx = Math.cos(b.yaw), sz = -Math.sin(b.yaw);
      for (const e of [-1, 1]) put(postMat, postG, b.x + Math.sin(b.yaw) * 1.9 * e, world.height(b.x + Math.sin(b.yaw) * 1.9 * e, b.z + Math.cos(b.yaw) * 1.9 * e) - 0.1, b.z + Math.cos(b.yaw) * 1.9 * e, 0, 1.6, 1.25, 1.6);
      put(bMat, quad, b.x, b.y + 0.72, b.z, b.yaw + Math.PI / 2, 3.8, 0.62, 1); } }
  for (const [mat, list] of bins) { const m = new THREE.Mesh(mergeGeos(list), mat); m.castShadow = true; m.receiveShadow = true; group.add(m); }
  return { group, update(dt) { /* flags could wave later */ } };
}

// ------------------------------------------------------------------ tyre marks: a ring of dark strips laid on the ground
function makeSkids(B) {
  const N = 600, pos = new Float32Array(N * 4 * 3), alpha = new Float32Array(N * 4), idx = [];
  for (let i = 0; i < N; i++) { const v = i * 4; idx.push(v, v + 1, v + 2, v + 2, v + 1, v + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aA', new THREE.BufferAttribute(alpha, 1));
  g.setIndex(idx);
  const col = new THREE.Color(B.snow ? 0x9aa6b2 : B.terrace ? 0x6e3e24 : 0x3a2a1c);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uC: { value: col } }]),
    vertexShader: `attribute float aA; varying float vA; #include <fog_pars_vertex>
      void main(){ vA = aA; vec4 mvPosition = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mvPosition; #include <fog_vertex> }`.replace(/#include <(\w+)>/g, m => '\n' + m + '\n'),
    fragmentShader: `uniform vec3 uC; varying float vA; #include <fog_pars_fragment>
      void main(){ gl_FragColor = vec4(uC, vA * 0.55); #include <fog_fragment> #include <colorspace_fragment> }`.replace(/#include <(\w+)>/g, m => '\n' + m + '\n'),
  });
  const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; mesh.renderOrder = 1;
  let next = 0;
  function add(x0, y0, z0, x1, y1, z1, w, a) {
    const dx = x1 - x0, dz = z1 - z0, l = Math.hypot(dx, dz) || 1, nx = -dz / l * w / 2, nz = dx / l * w / 2;
    const i = next; next = (next + 1) % N;
    const p = i * 12;
    pos.set([x0 + nx, y0 + 0.02, z0 + nz, x0 - nx, y0 + 0.02, z0 - nz, x1 + nx, y1 + 0.02, z1 + nz, x1 - nx, y1 + 0.02, z1 - nz], p);
    alpha.set([a, a, a, a], i * 4);
    g.attributes.position.needsUpdate = true; g.attributes.aA.needsUpdate = true;
  }
  return { mesh, add };
}

// ------------------------------------------------------------------ dust puffs (one draw call)
function makeDust(T, Q, world, color) {
  const N = Q.particles;
  const pos = new Float32Array(N * 3), size = new Float32Array(N), alpha = new Float32Array(N);
  const vel = new Float32Array(N * 3), life = new Float32Array(N), max = new Float32Array(N), grow = new Float32Array(N), base = new Float32Array(N), op = new Float32Array(N);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { tPuff: { value: T.puff }, uColor: { value: new THREE.Color(color || world.B.dust) }, uFog: { value: FOG }, uDensity: { value: Q.fog }, uScale: { value: 400 } },
    vertexShader: `attribute float aSize; attribute float aAlpha; varying float vA; varying float vFog; uniform float uScale, uDensity;
      void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * mv; gl_PointSize = aSize * uScale / -mv.z; vA = aAlpha;
        float d = length(mv.xyz); vFog = 1. - exp(-uDensity * uDensity * d * d); }`,
    fragmentShader: `uniform sampler2D tPuff; uniform vec3 uColor, uFog; varying float vA; varying float vFog;
      void main(){ vec4 t = texture2D(tPuff, gl_PointCoord); if (vA <= 0.001) discard; gl_FragColor = vec4(mix(uColor, uFog, vFog), t.a * vA);
      #include <colorspace_fragment>
      }`,
  });
  const points = new THREE.Points(g, mat);
  points.frustumCulled = false;
  let next = 0;
  function puff(x, y, z, vx, vy, vz, s, l, gr = 2, o = 0.5) {
    const i = next; next = (next + 1) % N;
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz;
    life[i] = l; max[i] = l; base[i] = s; grow[i] = gr; op[i] = o;
  }
  function update(dt) {
    for (let i = 0; i < N; i++) {
      if (life[i] <= 0) { alpha[i] = 0; continue; }
      life[i] -= dt;
      const k = 1 - life[i] / max[i];
      pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      const damp = 1 - dt * 1.8; vel[i * 3] *= damp; vel[i * 3 + 1] = vel[i * 3 + 1] * damp + 0.25 * dt; vel[i * 3 + 2] *= damp;
      size[i] = base[i] * (1 + k * grow[i]);
      alpha[i] = op[i] * (1 - k) * Math.min(1, k * 10);
    }
    g.attributes.position.needsUpdate = true; g.attributes.aSize.needsUpdate = true; g.attributes.aAlpha.needsUpdate = true;
  }
  return { points, puff, update, setScale(s) { mat.uniforms.uScale.value = s; } };
}
