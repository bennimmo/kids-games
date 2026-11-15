// Service worker: lets the installed app open without internet.
// Network first (so every push is live straight away), cache as a fallback.
// Our own files skip the browser's short-term cache (GitHub Pages keeps files ~10 min),
// so with internet you always get the newest version.
const CACHE = 'kids-games-v2';
const CACHE_HOSTS = [location.origin, 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://www.gstatic.com'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './css/style.css', './js/main.js', './js/games.js'])).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!CACHE_HOSTS.some(h => req.url.startsWith(h))) return; // e.g. Firebase: always live
  if (url.hostname === 'www.gstatic.com' && !url.pathname.startsWith('/firebasejs/')) return;
  e.respondWith((async () => {
    try {
      const fresh = url.origin === location.origin ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : req;
      const res = await fetch(fresh);
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await caches.match(req, { ignoreSearch: url.origin === location.origin });
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./index.html');
      throw err;
    }
  })());
});
