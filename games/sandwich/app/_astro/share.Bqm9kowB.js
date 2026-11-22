// Kids Games: saves every Stulle on this device (IndexedDB) instead of on a server.
// Same exports as the original module, so the rest of the app is unchanged.
import { E as FILES } from './kept.BZRJuc8_.js';
import { save, setImages, get, nextId } from '../local-store.js';

// keep: the photo's record, with a number
async function keep(body) {
  const id = await nextId();
  await save({ id, created: Date.now(), stulle: body.stulle, camera: body.camera });
  return { id, url: new URL('meine.html#' + id, location.href).href, upload: 'local' };
}
// the photo's pictures (photo.jpg, og.jpg, thumb.jpg)
async function upload(id, _token, files) {
  const images = {};
  for (const f of FILES) if (files[f]) images[f] = files[f];
  await setImages(id, images);
}
async function report() {}
async function fetchPhoto(id) { return get(id); }

function track() {}
function trackError() {}
function watchErrors() {}
function warm() {}
const T = (e, t, n) => t.find(([t]) => e < t)?.[1] ?? n;
const bucket = e => T(e, [[2e3, `unter 2 s`], [4e3, `2 bis 4 s`], [8e3, `4 bis 8 s`], [15e3, `8 bis 15 s`]], `über 15 s`);

// share: the picture itself, if the device can; else download it
async function share(url, title) {
  const id = Number(new URL(url).hash.slice(1));
  const rec = id ? await get(id).catch(() => null) : null;
  const blob = rec?.images?.['photo.jpg'];
  if (blob) {
    const file = new File([blob], `sandwich-${id}.jpg`, { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title }); return 'shared'; }
      catch (e) { if (e?.name === 'AbortError') return 'shared'; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'shared';
  }
  return 'failed';
}

export { watchErrors as a, warm as c, bucket as i, report as l, track as n, keep as o, trackError as r, fetchPhoto as s, share as t, upload as u };
