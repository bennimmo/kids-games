// Game loop: calls update(dt) then draw() every frame. dt is in seconds.
export function startLoop(update, draw) {
  let last = performance.now();
  let running = true;
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return () => { running = false; };
}
