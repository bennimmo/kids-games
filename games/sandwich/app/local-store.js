// Saved Stullen on this device (IndexedDB "stullen", store "photos").
// Record: { id, created, stulle, camera, images: { 'photo.jpg', 'og.jpg', 'thumb.jpg' } }
const DB = 'stullen', STORE = 'photos';
let dbp = null;

function db() {
  return dbp ??= new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => { dbp = null; bad(r.error); };
  });
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((ok, bad) => {
    const t = d.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => ok(out?.result);
    t.onerror = () => bad(t.error);
    t.onabort = () => bad(t.error);
  });
}

export const get = id => tx('readonly', s => s.get(id));
export const all = async () => ((await tx('readonly', s => s.getAll())) || []).sort((a, b) => b.id - a.id);
export const save = rec => tx('readwrite', s => s.put(rec));
export const remove = id => tx('readwrite', s => s.delete(id));
export async function setImages(id, images) {
  const rec = await get(id);
  if (!rec) throw new Error('Not found');
  rec.images = images;
  await save(rec);
}
export async function nextId() {
  const keys = (await tx('readonly', s => s.getAllKeys())) || [];
  return keys.length ? Math.max(...keys) + 1 : 1;
}
