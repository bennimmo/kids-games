// Paint Party – a simple paint program (like the old Paint on Windows).
// Tools down the left, colours and sizes along the bottom, actions on the right.
// Every drawing saves itself in this browser (🖼️ to see them). 📥 downloads a PNG.
// 👫 draw together: make a room or join one with 3 pictures; everyone draws on the same page.
import { CODE_LEN } from '../../js/engine/net.js';
import { sound } from '../../js/engine/sound.js';
import { W, H, COLORS, STAMPS, BRUSH, STAMP, SHAPES, MAX_NUMS, byOrder, drawOp, createPainter } from './ops.js';
import { loadGallery, loadPicture, saveToGallery, removeFromGallery, getCurrent, setCurrent } from './gallery.js';
import { makeRoom, findRoom, connect, CODE_PICS } from './online.js';

const svg = inner => `<svg viewBox="0 0 40 40" aria-hidden="true">${inner}</svg>`;
const TOOLS = [
  { id: 'pen', icon: '✏️', label: 'Pen' },
  { id: 'rainbow', icon: '🌈', label: 'Rainbow pen' },
  { id: 'spray', icon: '💨', label: 'Spray can' },
  { id: 'eraser', icon: '🧽', label: 'Rubber' },
  { id: 'fill', icon: '🪣', label: 'Fill' },
  { id: 'stamp', icon: '⭐', label: 'Stickers' },
  { id: 'line', icon: svg('<line x1="8" y1="32" x2="32" y2="8" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'), label: 'Line' },
  { id: 'rect', icon: svg('<rect x="6" y="10" width="28" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="5"/>'), label: 'Box' },
  { id: 'oval', icon: svg('<ellipse cx="20" cy="20" rx="14" ry="11" fill="none" stroke="currentColor" stroke-width="5"/>'), label: 'Circle' },
];
const SIZE_DOTS = [8, 14, 22, 32];

export function mount(stage) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('./style.css', import.meta.url).href;
  document.head.appendChild(css);

  const root = document.createElement('div');
  root.className = 'pt';
  root.innerHTML = `
    <div class="pt-tools">${TOOLS.map(t => `<button data-tool="${t.id}" aria-label="${t.label}">${t.icon}</button>`).join('')}</div>
    <div class="pt-top"></div>
    <div class="pt-wrap"><div class="pt-paper"><canvas class="pt-main"></canvas><canvas class="pt-over"></canvas></div></div>
    <div class="pt-actions">
      <button data-act="undo" aria-label="Undo">↩️</button>
      <button data-act="redo" aria-label="Redo">↪️</button>
      <button data-act="clear" aria-label="Clear">🗑️</button>
      <button data-act="download" aria-label="Download">📥</button>
      <button data-act="gallery" aria-label="My drawings">🖼️</button>
      <button data-act="friends" aria-label="Draw with friends">👫</button>
    </div>
    <div class="pt-palette"></div>`;
  stage.appendChild(root);

  const $ = s => root.querySelector(s);
  const main = $('.pt-main');
  const over = $('.pt-over');
  over.width = W; over.height = H;
  const octx = over.getContext('2d');
  const painter = createPainter(main);
  const wrap = $('.pt-wrap');
  const paper = $('.pt-paper');
  const palette = $('.pt-palette');
  const top = $('.pt-top');

  // ---------- state ----------
  let tool = 'pen';
  let color = COLORS[0];
  let size = 1;
  let stamp = STAMPS[0];
  let filled = false;
  let mine = [];      // my ops, oldest first
  let redo = [];
  let drawingId = newId();
  let net = null;
  let drag = null;    // { pointer, op, sprayTimer }
  let saveTimer = null, overlayQueued = false, closed = false, warnedFull = false;
  const prefix = Math.random().toString(36).slice(2, 8);
  let counter = 0;
  const now = () => (net ? net.now() : Date.now());

  // Carry on with the last drawing.
  const lastId = getCurrent();
  const lastPic = lastId && loadPicture(lastId);
  if (lastPic) {
    drawingId = lastId;
    loadImage(lastPic).then(img => { if (img && !closed && drawingId === lastId && !mine.length && !net) painter.reset(img); });
  }

  // ---------- fit the page to the screen ----------
  const fit = () => {
    const w = Math.min(wrap.clientWidth, wrap.clientHeight * W / H);
    paper.style.width = `${Math.floor(w)}px`;
    paper.style.height = `${Math.floor(w * H / W)}px`;
  };
  const ro = new ResizeObserver(fit);
  ro.observe(wrap);
  fit();

  // ---------- ops ----------
  function allOps() {
    const ops = net ? mine.concat(net.ops()) : mine.slice();
    return ops.sort(byOrder);
  }
  function refresh() {
    painter.sync(allOps());
    queueOverlay();
    updateButtons();
  }
  function newOp(k, p) {
    const op = { id: prefix + (counter++).toString(36), t: 0, k, c: k === 'eraser' ? '#ffffff' : color, s: size, p };
    if (k === 'stamp') op.e = stamp;
    if (filled && (k === 'rect' || k === 'oval')) op.f = true;
    return op;
  }
  function commit(op) {
    op.t = now();
    mine.push(op);
    redo = [];
    if (net) net.add(op);
    refresh();
    scheduleSave();
  }
  function undo() {
    const op = mine.pop();
    if (!op) return;
    redo.push(op);
    if (net) net.remove(op.id);
    sound.tone(420, 0.08, 'sine', 0.15, 300);
    refresh();
    scheduleSave();
  }
  function redoOne() {
    const op = redo.pop();
    if (!op) return;
    mine.push(op);
    if (net) net.add(op);
    sound.tone(420, 0.08, 'sine', 0.15, 600);
    refresh();
    scheduleSave();
  }
  const isBlank = () => !painter.hasBase() && !allOps().length;

  // ---------- saving ----------
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 1200);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (isBlank()) return;
    const ok = saveToGallery(drawingId, main.toDataURL('image/jpeg', 0.82));
    if (ok) setCurrent(drawingId);
    else if (!warnedFull) { warnedFull = true; banner('Storage full 😢 Delete some in 🖼️'); }
  }
  function download() {
    main.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      a.download = `my-drawing-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
    sound.win();
    flash();
  }
  // Start a fresh page (optionally from a saved picture).
  function startDrawing(id, img = null) {
    if (drag) endDrag();
    mine = [];
    redo = [];
    drawingId = id;
    painter.reset(img);
    refresh();
  }
  // Squash everything into the picture (when making or leaving a room).
  function bake() {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    c.getContext('2d').drawImage(main, 0, 0);
    const blank = isBlank();
    mine = [];
    redo = [];
    painter.reset(blank ? null : c);
  }

  // ---------- drawing with finger / mouse ----------
  const pos = e => {
    const r = over.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)];
  };
  over.addEventListener('pointerdown', e => {
    if (drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    const [x, y] = pos(e);
    if (tool === 'fill') {
      commit(newOp('fill', [x, y]));
      sound.splash();
      return;
    }
    try { over.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = SHAPES.has(tool) ? [x, y, x, y] : [x, y];
    drag = { pointer: e.pointerId, op: newOp(tool, p) };
    if (tool === 'stamp') sound.pop();
    if (tool === 'spray') {
      drag.sprayTimer = setInterval(() => {
        const q = drag.op.p;
        if (q.length < MAX_NUMS) { q.push(q[q.length - 2], q[q.length - 1]); sendCur(); queueOverlay(); }
      }, 50);
    }
    sendCur();
    queueOverlay();
  });
  over.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (events.length ? events : [e])) addPoint(...pos(ev));
    sendCur();
    queueOverlay();
  });
  const finish = e => { if (drag && e.pointerId === drag.pointer) endDrag(); };
  over.addEventListener('pointerup', finish);
  over.addEventListener('pointercancel', finish);

  function addPoint(x, y) {
    const op = drag.op;
    const p = op.p;
    if (SHAPES.has(op.k)) { p[2] = x; p[3] = y; return; }
    if (op.k === 'stamp') { p[0] = x; p[1] = y; return; }
    const dx = x - p[p.length - 2], dy = y - p[p.length - 1];
    if (dx * dx + dy * dy < 4) return;
    p.push(x, y);
    if (p.length >= MAX_NUMS) {           // very long line: save it and keep going
      clearInterval(drag.sprayTimer);
      const pointer = drag.pointer;
      commit(op);
      drag = { pointer, op: newOp(op.k, [x, y]) };
    }
  }
  function endDrag() {
    const op = drag.op;
    clearInterval(drag.sprayTimer);
    drag = null;
    if (net) net.setCur(null);
    commit(op);
  }
  function sendCur() { if (net && drag) net.setCur(drag.op); }

  // ---------- the see-through layer: what's being drawn right now ----------
  function queueOverlay() {
    if (overlayQueued) return;
    overlayQueued = true;
    requestAnimationFrame(() => {
      overlayQueued = false;
      if (closed) return;
      octx.clearRect(0, 0, W, H);
      if (net) {
        for (const { op, emoji } of net.cursors()) {
          if (op.k !== 'fill' && op.k !== 'clear') drawOp(octx, op);
          const p = op.p;
          if (p.length >= 2) {
            octx.font = '54px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
            octx.textAlign = 'center';
            octx.textBaseline = 'middle';
            octx.fillText(emoji, p[p.length - 2] + 34, p[p.length - 1] - 34);
          }
        }
      }
      if (drag) drawOp(octx, drag.op);
    });
  }

  // ---------- toolbar, palette, buttons ----------
  root.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => {
    tool = b.dataset.tool;
    sound.pop();
    renderPalette();
  }));
  root.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.act;
    if (a === 'undo') undo();
    else if (a === 'redo') redoOne();
    else if (a === 'clear') {
      if (isBlank()) return;
      commit(newOp('clear', []));
      sound.splash();
    } else if (a === 'download') download();
    else if (a === 'gallery') { sound.pop(); galleryModal(); } else if (a === 'friends') { sound.pop(); friendsModal(); }
  }));

  function renderPalette() {
    root.querySelectorAll('[data-tool]').forEach(b => {
      b.classList.toggle('on', b.dataset.tool === tool);
      b.style.color = color;
    });
    $('[data-tool="stamp"]').textContent = stamp;
    const shape = tool === 'rect' || tool === 'oval';
    let html = '';
    if (shape) {
      html += `<div class="pt-group">
        <button class="pt-fillmode ${filled ? '' : 'on'}" data-filled="0" aria-label="Outline">${svg(`<rect x="7" y="9" width="26" height="22" rx="3" fill="none" stroke="${color}" stroke-width="5"/>`)}</button>
        <button class="pt-fillmode ${filled ? 'on' : ''}" data-filled="1" aria-label="Filled">${svg(`<rect x="7" y="9" width="26" height="22" rx="3" fill="${color}" stroke="${color}" stroke-width="5"/>`)}</button>
      </div>`;
    }
    if (tool === 'stamp') {
      html += `<div class="pt-group pt-stamps">${STAMPS.map(s => `<button class="pt-stamp ${s === stamp ? 'on' : ''}" data-stamp="${s}">${s}</button>`).join('')}</div>`;
    } else if (tool !== 'eraser') {
      const custom = !COLORS.includes(color);
      html += `<div class="pt-group pt-colors">
        ${COLORS.map(c => `<button class="pt-color ${c === color ? 'on' : ''}" data-color="${c}" style="--c:${c}" aria-label="Colour"></button>`).join('')}
        <label class="pt-color pt-custom ${custom ? 'on' : ''}" aria-label="Any colour" style="--c:${custom ? color : 'transparent'}"><input type="color" value="${color}"></label>
      </div>`;
    }
    if (tool !== 'fill') {
      html += `<div class="pt-group pt-sizes">${SIZE_DOTS.map((d, i) => {
        const inner = tool === 'stamp'
          ? `<span style="font-size:${14 + i * 6}px">${stamp}</span>`
          : `<span class="dot" style="width:${d}px;height:${d}px;background:${tool === 'eraser' ? '#fff' : tool === 'rainbow' ? 'conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)' : color}"></span>`;
        return `<button class="pt-size ${i === size ? 'on' : ''}" data-size="${i}" aria-label="Size ${i + 1}">${inner}</button>`;
      }).join('')}</div>`;
    }
    palette.innerHTML = html;
    palette.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => {
      color = b.dataset.color;
      sound.tone(500 + COLORS.indexOf(color) * 30, 0.06, 'sine', 0.12);
      if (tool === 'eraser' || tool === 'stamp') tool = 'pen';
      renderPalette();
    }));
    const input = palette.querySelector('input[type=color]');
    if (input) input.addEventListener('input', () => { color = input.value.toLowerCase(); renderPalette(); });
    palette.querySelectorAll('[data-stamp]').forEach(b => b.addEventListener('click', () => { stamp = b.dataset.stamp; sound.pop(); renderPalette(); }));
    palette.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => { size = +b.dataset.size; sound.tone(700 - size * 100, 0.06); renderPalette(); }));
    palette.querySelectorAll('[data-filled]').forEach(b => b.addEventListener('click', () => { filled = b.dataset.filled === '1'; sound.pop(); renderPalette(); }));
  }

  function updateButtons() {
    $('[data-act="undo"]').disabled = !mine.length;
    $('[data-act="redo"]').disabled = !redo.length;
    $('[data-act="gallery"]').hidden = !!net;
    $('[data-act="friends"]').hidden = !!net;
  }

  let lastTop = '';
  function renderTop() {
    const html = net ? `
      <div class="pt-room">
        <span class="pt-code">${net.pics.map(p => `<span>${p}</span>`).join('')}</span>
        <span class="pt-people">${net.players().map(p => `<span class="${p.me ? 'me' : ''}">${p.emoji}</span>`).join('')}</span>
        <button class="pt-leave" aria-label="Leave">🚪</button>
      </div>` : '';
    if (html === lastTop) return;
    lastTop = html;
    top.innerHTML = html;
    const leave = top.querySelector('.pt-leave');
    if (leave) leave.addEventListener('click', () => { sound.pop(); leaveRoom(); });
    fit();
  }

  // ---------- friends ----------
  function joined(room) {
    net = connect(room, {
      onChange: () => { renderTop(); refresh(); },
      onBase: async url => {
        const img = url && await loadImage(url);
        if (img && net) { painter.setBase(img); refresh(); scheduleSave(); }
      },
      onClosed: () => {
        bake();
        net = null;
        renderTop();
        refresh();
        banner('The room has closed 👋');
      },
    });
    renderTop();
    refresh();
  }
  async function leaveRoom() {
    if (drag) endDrag();
    saveNow();
    const n = net;
    bake();
    net = null;
    renderTop();
    refresh();
    if (n) await n.leave();
  }

  function modal(html) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'pt-modal';
    m.innerHTML = `<div class="pt-card"><button class="pt-x" aria-label="Close">✖</button>${html}</div>`;
    m.addEventListener('pointerdown', e => { if (e.target === m) { sound.pop(); closeModal(); } });
    m.querySelector('.pt-x').addEventListener('click', () => { sound.pop(); closeModal(); });
    root.appendChild(m);
    return m;
  }
  function closeModal() { const m = root.querySelector('.pt-modal'); if (m) m.remove(); }

  function friendsModal() {
    const m = modal(`
      <h2>Draw with friends</h2>
      <div class="pt-choices">
        <button class="pt-big" data-mp="make"><span class="i">🏠</span><span>Make a room</span></button>
        <button class="pt-big" data-mp="join"><span class="i">🔑</span><span>Join a room</span></button>
      </div>
      <p class="pt-msg"></p>`);
    const msg = m.querySelector('.pt-msg');
    m.querySelector('[data-mp="join"]').addEventListener('click', () => { sound.pop(); joinModal(); });
    m.querySelector('[data-mp="make"]').addEventListener('click', async () => {
      sound.pop();
      msg.textContent = 'Making a room… ⏳';
      try {
        saveNow();
        const room = await makeRoom(isBlank() ? '' : main.toDataURL('image/jpeg', 0.8));
        if (closed) { room.leave(); return; }
        bake();
        joined(room);
        sound.win();
        closeModal();
        banner('Show friends these pictures 👆', 3500);
      } catch (e) {
        msg.textContent = "Couldn't connect 😢 Try again";
      }
    });
  }

  function joinModal() {
    let code = '';
    const m = modal(`
      <h2>Tap your friend's pictures</h2>
      <div class="pt-slots">${'<span></span>'.repeat(CODE_LEN)}</div>
      <div class="pt-keypad">${CODE_PICS.map((p, i) => `<button data-k="${i.toString(16)}">${p}</button>`).join('')}</div>
      <button class="pt-rub" aria-label="Rub out">⌫</button>
      <p class="pt-msg"></p>`);
    const slots = [...m.querySelectorAll('.pt-slots span')];
    const msg = m.querySelector('.pt-msg');
    const show = () => slots.forEach((el, i) => { el.textContent = code[i] ? CODE_PICS[parseInt(code[i], 16)] : ''; });
    m.querySelector('.pt-rub').addEventListener('click', () => { code = code.slice(0, -1); show(); sound.pop(); });
    m.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', async () => {
      if (code.length >= CODE_LEN) return;
      code += b.dataset.k;
      show();
      sound.tone(500 + code.length * 120, 0.08, 'sine', 0.15);
      if (code.length < CODE_LEN) return;
      msg.textContent = 'Looking… ⏳';
      try {
        const room = await findRoom(code);
        if (!room) {
          msg.textContent = 'No room with those pictures. Try again!';
          sound.bump();
          code = ''; show();
          return;
        }
        if (closed) { room.leave(); return; }
        saveNow();                  // keep my old drawing in 🖼️
        startDrawing(newId());
        joined(room);
        sound.win();
        closeModal();
      } catch (e) {
        msg.textContent = "Couldn't connect 😢 Try again";
        code = ''; show();
      }
    }));
  }

  function galleryModal() {
    if (drag) endDrag();
    saveNow();
    const pics = loadGallery();
    const m = modal(`
      <h2>My drawings</h2>
      <div class="pt-gallery">
        <button class="pt-pic pt-new" aria-label="New drawing"><span>➕</span></button>
        ${pics.map(p => `
          <div class="pt-pic-wrap">
            <button class="pt-pic ${p.id === drawingId ? 'cur' : ''}" data-open="${p.id}"><img alt="" src="${loadPicture(p.id)}"></button>
            <button class="pt-del" data-del="${p.id}" aria-label="Delete">✖</button>
          </div>`).join('')}
      </div>`);
    m.querySelector('.pt-new').addEventListener('click', () => {
      sound.pop();
      startDrawing(newId());
      closeModal();
    });
    m.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', async () => {
      const id = b.dataset.open;
      sound.pop();
      closeModal();
      if (id === drawingId) return;
      const img = await loadImage(loadPicture(id));
      if (img && !closed && !net) { startDrawing(id, img); setCurrent(id); }
    }));
    m.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (!b.classList.contains('sure')) {
        b.classList.add('sure');
        b.textContent = '🗑️';
        sound.bump();
        return;
      }
      const id = b.dataset.del;
      removeFromGallery(id);
      sound.splash();
      b.parentElement.remove();
      if (id === drawingId) startDrawing(newId());
    }));
  }

  // ---------- little extras ----------
  function banner(text, ms = 2500) {
    const b = document.createElement('div');
    b.className = 'pt-banner';
    b.textContent = text;
    root.appendChild(b);
    setTimeout(() => b.remove(), ms);
  }
  function flash() {
    paper.classList.remove('pt-flash');
    void paper.offsetWidth;
    paper.classList.add('pt-flash');
  }
  const onKey = e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); } else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redoOne(); }
  };
  window.addEventListener('keydown', onKey);
  window.addEventListener('pagehide', saveNow);

  renderPalette();
  refresh();

  return () => {
    closed = true;
    if (drag) { clearInterval(drag.sprayTimer); drag = null; }
    if (saveTimer) saveNow();
    ro.disconnect();
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pagehide', saveNow);
    if (net) { net.leave(); net = null; }
    css.remove();
  };
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadImage(src) {
  return new Promise(resolve => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
