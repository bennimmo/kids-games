// Mountain Rush: everything you see that isn't the bike.
// Sky + sun + fog, the ground (in 64 m chunks), pine trees, rocks, grass blades near you,
// the start gate, checkpoints and finish, and dust.
import * as THREE from '../../js/vendor/three.module.min.js';
import { rng } from '../sky-pilot/noise.js';

export const SUN_DIR = new THREE.Vector3(-0.45, 0.62, 0.64).normalize();
const FOG = new THREE.Color(0xb9c9cf);
const CH = 64;          // ground chunk size (m)
const TCH = 128;        // tree/rock chunk size (m)

export function createScene(world, T, Q) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(FOG.getHex(), Q.fog);
  scene.background = FOG.clone();
  const uniforms = { uTime: { value: 0 } };

  // ---------------------------------------------------------------- sky dome
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: SUN_DIR }, uFog: { value: FOG } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position,1.); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`,
    fragmentShader: `varying vec3 vDir; uniform vec3 uSun; uniform vec3 uFog;
      void main(){
        vec3 d = normalize(vDir);
        float h = max(d.y, 0.);
        vec3 zen = vec3(0.24,0.45,0.78), hor = uFog;
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
  const hemi = new THREE.HemisphereLight(0xc4dcf2, 0x55603f, 0.75);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.7);
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
    Object.assign(sh.uniforms, { tGrass: { value: T.grass }, tFloor: { value: T.floor }, tDirt: { value: T.dirt }, tRock: { value: T.rock }, tBump: { value: T.dirtBump } });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aTrail; varying float vTrail; varying vec3 vWPos; varying vec3 vWNrm;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvTrail = aTrail; vWPos = (modelMatrix * vec4(transformed,1.)).xyz; vWNrm = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D tGrass, tFloor, tDirt, tRock, tBump; varying float vTrail; varying vec3 vWPos; varying vec3 vWNrm;
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
        gDirtW = smoothstep(0.12, 0.7, vTrail);
        // darker worn line in the middle of the trail
        dirt *= mix(1.0, 0.82, smoothstep(0.85, 1.0, vTrail));
        vec3 col = mix(grass, forest, forestW * 0.85);
        col = mix(col, dirt * 0.95, smoothstep(0.2, 0.4, slope) * 0.5);
        col = mix(col, dirt, gDirtW);
        gRockW *= 1. - gDirtW;
        col = mix(col, rock, gRockW);
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
  {
    const ribMat = terrainMat.clone();
    ribMat.onBeforeCompile = terrainMat.onBeforeCompile;
    ribMat.polygonOffset = true; ribMat.polygonOffsetFactor = -1; ribMat.polygonOffsetUnits = -2;
    ribMat.customProgramCacheKey = () => 'mr-terrain';
    const { path } = world;
    const STEP_S = 0.5, COLS = 30, ex = {};
    const segLen = 80;     // metres per mesh (so far-away bits can be culled)
    for (let s0 = 0; s0 < path.n - 1; s0 += segLen) {
      const s1 = Math.min(path.n - 1, s0 + segLen);
      const rows = Math.round((s1 - s0) / STEP_S) + 1;
      const pos = new Float32Array(rows * (COLS + 1) * 3), tr = new Float32Array(rows * (COLS + 1));
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
          pos[k * 3] = x; pos[k * 3 + 1] = ex.h; pos[k * 3 + 2] = z;
          tr[k] = ex.m;
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

  // ---------------------------------------------------------------- trees
  const treeParts = makePine(T);
  const rockGeo = makeRockGeo();
  const rockMat = new THREE.MeshStandardMaterial({ map: T.rock, roughness: 0.85, color: 0xd8d4cc });
  const tbuckets = new Map(), rbuckets = new Map();
  const bucketKey = (x, z) => Math.floor((x + HALF) / TCH) + ',' + Math.floor(z / TCH);
  for (const t of world.trees) { const k = bucketKey(t.x, t.z); if (!tbuckets.has(k)) tbuckets.set(k, []); tbuckets.get(k).push(t); }
  for (const r of world.rocks) { const k = bucketKey(r.x, r.z); if (!rbuckets.has(k)) rbuckets.set(k, []); rbuckets.get(k).push(r); }
  const groups = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), p = new THREE.Vector3(), col = new THREE.Color(), e = new THREE.Euler();
  const treeShare = Q.trees;
  for (const [k, list] of tbuckets) {
    const keep = list.filter((t, i) => (i * 0.618 % 1) < treeShare);
    const meshes = treeParts.map(part => {
      const im = new THREE.InstancedMesh(part.geo, part.mat, keep.length);
      im.castShadow = part.shadow; im.receiveShadow = true;
      keep.forEach((t, i) => {
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), t.rot);
        sc.setScalar(t.s); p.set(t.x, t.y - 0.3, t.z);
        m4.compose(p, q, sc); im.setMatrixAt(i, m4);
        if (part.tint) { col.setHSL(0.27 + t.tint * 0.06, 0.35 + t.tint * 0.2, 0.75 + t.tint * 0.3); im.setColorAt(i, col); }
      });
      im.computeBoundingSphere();
      scene.add(im);
      return im;
    });
    const [bx, bz] = k.split(',').map(Number);
    groups.push({ meshes, cx: bx * TCH - HALF + TCH / 2, cz: bz * TCH + TCH / 2 });
  }
  for (const [k, list] of rbuckets) {
    const im = new THREE.InstancedMesh(rockGeo, rockMat, list.length);
    im.castShadow = true; im.receiveShadow = true;
    list.forEach((r, i) => {
      e.set(r.tilt * 0.5, r.rot, r.tilt * 0.3); q.setFromEuler(e);
      sc.set(r.s * 1.2, r.s * 0.75, r.s); p.set(r.x, r.y - r.s * 0.25, r.z);
      m4.compose(p, q, sc); im.setMatrixAt(i, m4);
    });
    im.computeBoundingSphere();
    scene.add(im);
    const [bx, bz] = k.split(',').map(Number);
    groups.push({ meshes: [im], cx: bx * TCH - HALF + TCH / 2, cz: bz * TCH + TCH / 2 });
  }

  // ---------------------------------------------------------------- grass blades near the camera
  const grass = Q.grass > 0 ? makeGrass(world, Q, uniforms) : null;
  if (grass) scene.add(grass.mesh);

  // ---------------------------------------------------------------- gates, flags, tape
  const props = makeProps(world, T);
  scene.add(props.group);

  // ---------------------------------------------------------------- dust
  const dust = makeDust(T, Q);
  scene.add(dust.points);

  // ---------------------------------------------------------------- per frame
  const camXZ = new THREE.Vector2();
  function update(dt, cam, focus) {
    uniforms.uTime.value += dt;
    sky.position.copy(cam.position);
    camXZ.set(cam.position.x, cam.position.z);
    const far = Q.viewDist;
    for (const c of chunks) c.mesh.visible = Math.hypot(c.cx - camXZ.x, c.cz - camXZ.y) < far + (c.r || 46);
    for (const g of groups) { const v = Math.hypot(g.cx - camXZ.x, g.cz - camXZ.y) < far + 90; for (const m of g.meshes) m.visible = v; }
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

  return { scene, sun, update, dust, props, uniforms };
}

// ------------------------------------------------------------------ pine tree: trunk, inner body, branch cards
function makePine(T) {
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
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x24402a, roughness: 1 });

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
  const cardMat = new THREE.MeshStandardMaterial({ map: T.branch, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.9, color: 0xffffff });
  cardMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#undef DOUBLE_SIDED\n#include <normal_fragment_begin>');
  };
  return [
    { geo: trunk, mat: barkMat, shadow: true },
    { geo: body, mat: bodyMat, shadow: true, tint: true },
    { geo: cardGeo, mat: cardMat, shadow: true, tint: true },
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
        colr.push(0.2 * c + 0.05 * t, 0.36 * c + 0.04 * t, 0.1 * c);
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
    const w = world.path.halfW(p.i) * 2 + 3;
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
  world.checkpoints.slice(1).forEach((p, i) => arch(p, `CHECKPOINT ${i + 1}`, '#f59e0b', '#1b1b1b'));
  arch(world.finish, 'FINISH', '#111111', '#ffffff');

  // trail marker posts with tape on the outside of berms and next to jumps
  const tapeMat = new THREE.MeshStandardMaterial({ color: 0xff6a1a, roughness: 0.6, side: THREE.DoubleSide });
  const postGeo = new THREE.CylinderGeometry(0.035, 0.04, 1.1, 6); postGeo.translate(0, 0.55, 0);
  const postMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d0, roughness: 0.8 });
  const posts = [], tapes = [];
  const { path } = world;
  for (let i = path.start + 15; i < path.finish - 5; i += 6) {
    const a = Math.atan2(path.tx[i + 6] || 0, path.tz[i + 6] || 1) - Math.atan2(path.tx[i], path.tz[i]);
    const turn = Math.abs(a) > 0.08;
    if (!turn) continue;
    const side = a > 0 ? -1 : 1;           // outside of the turn
    const w = path.halfW(i) + 1.6;
    const mk = j => { const x = path.x[j] + path.tz[j] * w * side, z = path.z[j] - path.tx[j] * w * side; return new THREE.Vector3(x, world.height(x, z), z); };
    const p0 = mk(i), p1 = mk(i + 6);
    posts.push(p0, p1);
    // tape between them
    const dir = p1.clone().sub(p0), len = dir.length();
    const tg = new THREE.PlaneGeometry(len, 0.07);
    const tm = new THREE.Mesh(tg, tapeMat);
    tm.position.copy(p0).add(p1).multiplyScalar(0.5); tm.position.y += 0.9;
    tm.rotation.y = Math.atan2(-dir.z, dir.x);
    group.add(tm); tapes.push(tm);
  }
  if (posts.length) {
    const im = new THREE.InstancedMesh(postGeo, postMat, posts.length);
    const m4 = new THREE.Matrix4();
    posts.forEach((p, i) => { m4.makeTranslation(p.x, p.y - 0.1, p.z); im.setMatrixAt(i, m4); });
    im.castShadow = true;
    group.add(im);
  }
  return { group, update(dt) { /* flags could wave later */ } };
}

// ------------------------------------------------------------------ dust puffs (one draw call)
function makeDust(T, Q) {
  const N = Q.particles;
  const pos = new Float32Array(N * 3), size = new Float32Array(N), alpha = new Float32Array(N);
  const vel = new Float32Array(N * 3), life = new Float32Array(N), max = new Float32Array(N), grow = new Float32Array(N), base = new Float32Array(N), op = new Float32Array(N);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { tPuff: { value: T.puff }, uColor: { value: new THREE.Color(0xb59a7a) }, uFog: { value: FOG }, uDensity: { value: Q.fog }, uScale: { value: 400 } },
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
