// Mountain Rush: scanned 3D models (Poly Haven, CC0), slimmed down to a few hundred triangles each.
// Used on mid/high. Each comes back as { geo, mat } with the shape centred and sized to "1 unit", so the scene
// can scale and scatter it like the built-in shapes. Anything that fails to load is simply left out.
import * as THREE from '../../js/vendor/three.module.min.js';
import { GLTFLoader } from '../../js/vendor/three-addons/GLTFLoader.js';

const DIR = new URL('./assets/models/', import.meta.url).href;
let cache = null;

// how each file is used:  fit = 'radius' (widest half-width becomes 1) or 'height' (height becomes 1);  lift = how far the base sits above 0
const FILES = {
  rock_07: { as: 'rocks', fit: 'radius', sink: 0.3 },
  rock_moss_set_01: { as: 'rocksMoss', fit: 'radius', sink: 0.25, split: true },
  namaqualand_boulder_02: { as: 'rocksRed', fit: 'radius', sink: 0.3 },
  tree_stump_01: { as: 'stump', fit: 'radius', sink: 0.04 },
  fern_02: { as: 'fern', fit: 'radius', sink: 0, alpha: true },
  old_tyre: { as: 'tyre', fit: 'radius', sink: 0, flat: true },
  covered_car: { as: 'car', fit: 'length', sink: 0.02 },
};

function bake(mesh) {
  const g = mesh.geometry.clone(); mesh.updateWorldMatrix(true, false); g.applyMatrix4(mesh.matrixWorld);
  if (!g.attributes.normal) g.computeVertexNormals();
  return g;
}
function mergeSimple(list) {
  let v = 0, n = 0; for (const g of list) { v += g.attributes.position.count; n += g.index ? g.index.count : g.attributes.position.count; }
  const pos = new Float32Array(v * 3), nrm = new Float32Array(v * 3), uv = new Float32Array(v * 2), idx = new Uint32Array(n);
  let vo = 0, io = 0;
  for (const g of list) { const c = g.attributes.position.count, P = g.attributes.position, Nn = g.attributes.normal, U = g.attributes.uv;
    // (read value by value: the file may pack several attributes into one buffer)
    for (let i = 0; i < c; i++) { const o = (vo + i) * 3; pos[o] = P.getX(i); pos[o + 1] = P.getY(i); pos[o + 2] = P.getZ(i); nrm[o] = Nn.getX(i); nrm[o + 1] = Nn.getY(i); nrm[o + 2] = Nn.getZ(i); if (U) { uv[(vo + i) * 2] = U.getX(i); uv[(vo + i) * 2 + 1] = U.getY(i); } }
    if (g.index) { const a = g.index.array; for (let i = 0; i < a.length; i++) idx[io + i] = a[i] + vo; io += a.length; } else { for (let i = 0; i < c; i++) idx[io + i] = vo + i; io += c; }
    vo += c; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); out.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}
function normalise(g, spec) {
  if (spec.flat) { g.computeBoundingBox(); const b0 = g.boundingBox, dx = b0.max.x - b0.min.x, dy = b0.max.y - b0.min.y, dz = b0.max.z - b0.min.z; if (dx < dy && dx < dz) g.rotateZ(Math.PI / 2); else if (dz < dy && dz < dx) g.rotateX(Math.PI / 2); }      // lay it down
  g.computeBoundingBox(); const b = g.boundingBox, sx = b.max.x - b.min.x, sy = b.max.y - b.min.y, sz = b.max.z - b.min.z;
  const k = spec.fit === 'height' ? 1 / sy : spec.fit === 'length' ? 1 / Math.max(sx, sz) : 2 / Math.max(sx, sz);
  g.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); g.scale(k, k, k); g.translate(0, -spec.sink * sy * k, 0);
  if (spec.fit === 'length' && sx > sz) g.rotateY(Math.PI / 2);        // long axis along z
  g.computeBoundingSphere();
  return g;
}

export async function loadModels() {
  if (cache) return cache;
  const loader = new GLTFLoader(), out = {};
  await Promise.all(Object.entries(FILES).map(([file, spec]) => new Promise(res => {
    const done = setTimeout(res, 20000);
    loader.load(DIR + file + '.glb', gltf => {
      try {
        const meshes = []; gltf.scene.traverse(o => { if (o.isMesh) meshes.push(o); });
        if (meshes.length) {
          const mat = meshes[0].material; mat.metalness = 0; if (mat.map) mat.map.anisotropy = 4;
          if (spec.alpha) { mat.alphaTest = 0.4; mat.transparent = false; mat.side = THREE.DoubleSide; }
          const geos = spec.split ? meshes.map(m => mergeSimple([bake(m)])) : [mergeSimple(meshes.map(m => bake(m)))];
          for (const g of geos) { const ng = normalise(g, spec); ng.computeBoundingBox(); (out[spec.as] ||= []).push({ geo: ng, mat, h: ng.boundingBox.max.y - ng.boundingBox.min.y }); }
        }
      } catch (e) { console.warn('model ' + file + ': ' + e.message); }
      clearTimeout(done); res();
    }, undefined, () => { clearTimeout(done); res(); });
  })));
  cache = out;
  return out;
}
