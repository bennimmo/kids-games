// Makes a canvas that fills its parent and stays sharp on any screen.
export function createCanvas(parent) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';
  parent.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const view = { canvas, ctx, width: 0, height: 0 };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    view.width = parent.clientWidth;
    view.height = parent.clientHeight;
    canvas.width = view.width * dpr;
    canvas.height = view.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(parent);
  view.destroy = () => { ro.disconnect(); canvas.remove(); };
  return view;
}
