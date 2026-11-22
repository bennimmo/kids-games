// Sandwich Maker – the Stullensimulator by Gregor Weichbrodt (stulle.app), used with his permission.
// The app lives in ./app as he built it; it runs in a frame so its own page and styles stay separate.
// Sandwiches are kept on this device (app/local-store.js), not on a server. "Meine Stullen" shows them.
export function mount(stage) {
  const frame = document.createElement('iframe');
  frame.src = new URL('./app/index.html', import.meta.url).href;
  frame.title = 'Sandwich Maker';
  frame.allow = 'fullscreen; autoplay; clipboard-write; web-share';
  frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#140d07';
  stage.appendChild(frame);
  return () => frame.remove();
}
