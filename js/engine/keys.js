// Keyboard helper: keys.isDown('ArrowUp'), keys.isDown('KeyW') etc.
export function createKeys() {
  const down = new Set();
  const onDown = e => { down.add(e.code); if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault(); };
  const onUp = e => down.delete(e.code);
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  return {
    isDown: code => down.has(code),
    destroy() {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    },
  };
}
