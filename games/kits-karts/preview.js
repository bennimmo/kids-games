// Little 3D kart viewer: the spinning kart in the garage, and kart pictures for buttons.
import * as THREE from '../../js/vendor/three.module.min.js';
import { buildKart } from './karts.js';

export function createPreview() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch (e) { return null; }
  const W = 300, H = 200;
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  const canvas = renderer.domElement;
  canvas.className = 'kk-preview';

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#ffffff', '#667788', 1.4));
  const sun = new THREE.DirectionalLight('#fff4e0', 2.4);
  sun.position.set(40, 80, 50); sun.castShadow = true;
  sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40;
  scene.add(sun);
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 1.5, 40), new THREE.MeshStandardMaterial({ color: '#dfe7f0', roughness: 0.6 }));
  floor.position.y = -0.75; floor.receiveShadow = true;
  scene.add(floor);
  const cam = new THREE.PerspectiveCamera(32, W / H, 1, 1000);
  cam.position.set(40, 26, 48);
  cam.lookAt(0, 9, 0);

  let kart = null, key = '', angle = 0.6;
  const cache = new Map();

  function setKart(look) {
    const k = JSON.stringify(look);
    if (k === key && kart) return;
    if (kart) scene.remove(kart.root);
    kart = buildKart(look);
    kart.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
    kart.root.userData.shadow.visible = false;
    scene.add(kart.root);
    key = k;
  }

  return {
    canvas,
    show(look) { setKart(look); },
    frame(dt) {
      if (!kart) return;
      angle += dt * 0.7;
      kart.root.rotation.y = angle;
      kart.update(dt, { speed: 60, vF: 60, steer: Math.sin(angle * 2) * 0.6, boost: 0 });
      renderer.render(scene, cam);
    },
    // picture of a kart (data URL), cached
    snap(look) {
      const k = JSON.stringify(look);
      if (cache.has(k)) return cache.get(k);
      const old = kart, oldKey = key;
      if (old) scene.remove(old.root);
      const t = buildKart(look);
      t.root.userData.shadow.visible = false;
      t.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
      t.root.rotation.y = 0.5;
      t.update(0.016, { speed: 0, steer: 0.3 });
      scene.add(t.root);
      renderer.render(scene, cam);
      const url = canvas.toDataURL('image/png');
      scene.remove(t.root);
      if (old) scene.add(old.root);
      kart = old; key = oldKey;
      cache.set(k, url);
      return url;
    },
    dispose() { renderer.dispose(); },
  };
}
