// Online rooms for any game. One Firebase database, each game in its own area:
//   games/<game>/rooms/<code>/{ host, created, meta, players/<pid>, live/<pid> }
//
// - meta:    written by the host only (track, race state ...)
// - players: one entry per player, written by that player's device
// - live:    fast-changing data (car positions), written by the owner
//
// Room codes are 4 pictures so small children can join without reading.
// Add ?net=local to the URL to test with 2 tabs on one computer, no internet.

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyALR1_snxk_xWBKM8Zt1rlVxLkpcmSY_CE',
  authDomain: 'kids-games-6c82c.firebaseapp.com',
  databaseURL: 'https://kids-games-6c82c-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'kids-games-6c82c',
  storageBucket: 'kids-games-6c82c.firebasestorage.app',
  messagingSenderId: '287891393505',
  appId: '1:287891393505:web:a4e66170007e7fb4ae60a0',
};

// 16 pictures = one hex digit each. Code "3a0f" -> 🐸🍌🐶⚽
export const CODE_PICS = ['🐶', '🐱', '🦁', '🐸', '🐵', '🐷', '🐮', '🐰', '🍎', '🍌', '🍓', '🍕', '🚀', '⭐', '🌈', '⚽'];
export const codeToPics = code => [...code].map(h => CODE_PICS[parseInt(h, 16)]);
const randomCode = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

const useLocal = new URLSearchParams(location.search).get('net') === 'local';

// ------------------------------------------------------------ Firebase

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
let fbPromise = null;

function firebase() {
  if (!fbPromise) {
    fbPromise = (async () => {
      const [{ initializeApp }, A, D] = await Promise.all([
        import(SDK + 'firebase-app.js'),
        import(SDK + 'firebase-auth.js'),
        import(SDK + 'firebase-database.js'),
      ]);
      const app = initializeApp(FIREBASE_CONFIG);
      const cred = await A.signInAnonymously(A.getAuth(app));
      const db = D.getDatabase(app);
      let offset = 0;
      D.onValue(D.ref(db, '.info/serverTimeOffset'), s => { offset = s.val() || 0; });
      return { D, db, uid: cred.user.uid, now: () => Date.now() + offset };
    })();
    fbPromise.catch(() => { fbPromise = null; });
  }
  return fbPromise;
}

function firebaseRoom(fb, game, code, isHost) {
  const { D, db, uid } = fb;
  const base = `games/${game}/rooms/${code}`;
  const r = p => D.ref(db, `${base}/${p}`);
  const unsubs = [];
  const mine = new Set();
  const watch = (p, cb) => { const u = D.onValue(r(p), s => cb(s.val())); unsubs.push(u); return u; };

  return {
    code, uid, isHost,
    now: fb.now,
    setMeta: data => D.update(r('meta'), data),
    setPlayer(pid, data) {
      if (!mine.has(pid)) {
        mine.add(pid);
        D.onDisconnect(r(`players/${pid}`)).remove();
        D.onDisconnect(r(`live/${pid}`)).remove();
      }
      return data ? D.set(r(`players/${pid}`), data) : Promise.all([D.remove(r(`players/${pid}`)), D.remove(r(`live/${pid}`))]);
    },
    setLive: (pid, data) => D.set(r(`live/${pid}`), data),
    onMeta: cb => watch('meta', cb),
    onPlayers: cb => watch('players', v => cb(v || {})),
    onLive: cb => watch('live', v => cb(v || {})),
    async leave() {
      unsubs.forEach(u => u());
      try {
        if (isHost) {
          await D.onDisconnect(D.ref(db, base)).cancel();
          await D.remove(D.ref(db, base));
        } else {
          await Promise.all([...mine].map(pid => Promise.all([D.remove(r(`players/${pid}`)), D.remove(r(`live/${pid}`))])));
        }
      } catch (e) { /* offline already */ }
    },
  };
}

async function fbCreate(game, meta) {
  const fb = await firebase();
  const { D, db, uid } = fb;
  for (let tries = 0; tries < 8; tries++) {
    const code = randomCode();
    const base = D.ref(db, `games/${game}/rooms/${code}`);
    const taken = await D.get(D.child(base, 'host'));
    if (taken.exists()) continue;
    await D.set(base, { host: uid, created: D.serverTimestamp(), meta });
    D.onDisconnect(base).remove();
    return firebaseRoom(fb, game, code, true);
  }
  throw new Error('no free room code');
}

async function fbJoin(game, code) {
  const fb = await firebase();
  const { D, db } = fb;
  const host = await D.get(D.ref(db, `games/${game}/rooms/${code}/host`));
  if (!host.exists()) return null;
  return firebaseRoom(fb, game, code, false);
}

// ------------------------------------------------------------ local test mode (2 tabs, same browser)

function localRoom(game, code, isHost) {
  const uid = 'u' + Math.random().toString(36).slice(2, 10);
  const P = `net:${game}:${code}:`;
  const subs = { meta: [], players: [], live: [] };
  const mine = new Set();
  const readGroup = g => {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(P + g + ':')) out[k.slice(P.length + g.length + 1)] = JSON.parse(localStorage.getItem(k));
    }
    return out;
  };
  const read = g => (g === 'meta' ? JSON.parse(localStorage.getItem(P + 'meta') || 'null') : readGroup(g));
  const fire = g => subs[g].forEach(cb => cb(read(g)));
  const onStorage = e => {
    if (!e.key || !e.key.startsWith(P)) return;
    const g = e.key.slice(P.length).split(':')[0];
    if (subs[g]) fire(g);
  };
  window.addEventListener('storage', onStorage);
  const cleanup = () => {
    if (isHost) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k.startsWith(P)) localStorage.removeItem(k);
      }
    } else {
      mine.forEach(pid => { localStorage.removeItem(P + 'players:' + pid); localStorage.removeItem(P + 'live:' + pid); });
    }
  };
  window.addEventListener('pagehide', cleanup);
  const sub = (g, cb) => { subs[g].push(cb); setTimeout(() => cb(read(g)), 0); return () => { subs[g] = subs[g].filter(x => x !== cb); }; };

  return {
    code, uid, isHost,
    now: () => Date.now(),
    async setMeta(data) {
      localStorage.setItem(P + 'meta', JSON.stringify({ ...(read('meta') || {}), ...data }));
      fire('meta');
    },
    async setPlayer(pid, data) {
      mine.add(pid);
      if (data) localStorage.setItem(P + 'players:' + pid, JSON.stringify(data));
      else { localStorage.removeItem(P + 'players:' + pid); localStorage.removeItem(P + 'live:' + pid); fire('live'); }
      fire('players');
    },
    async setLive(pid, data) {
      localStorage.setItem(P + 'live:' + pid, JSON.stringify(data));
      fire('live');
    },
    onMeta: cb => sub('meta', cb),
    onPlayers: cb => sub('players', cb),
    onLive: cb => sub('live', cb),
    async leave() {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('pagehide', cleanup);
      cleanup();
      Object.keys(subs).forEach(k => { subs[k] = []; });
    },
  };
}

// ------------------------------------------------------------ public

export async function createRoom(game, meta) {
  if (useLocal) {
    const code = randomCode();
    const room = localRoom(game, code, true);
    await room.setMeta(meta);
    localStorage.setItem(`net:${game}:${code}:host`, room.uid);
    return room;
  }
  return fbCreate(game, meta);
}

// Returns null if there is no room with that code.
export async function joinRoom(game, code) {
  if (useLocal) {
    if (!localStorage.getItem(`net:${game}:${code}:host`)) return null;
    return localRoom(game, code, false);
  }
  return fbJoin(game, code);
}
