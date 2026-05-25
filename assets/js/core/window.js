/* =============================================
   window.js — Win and App Base Classes
   ============================================= */

class Win {
  constructor(app, title, opts = {}) {
    this.app = app;
    this.id = 'w-' + Date.now() + Math.random().toString(36).slice(2, 7);
    this.title = title;
    this.min = false;
    this.max = false;
    this.opts = {
      w: opts.w || 640,
      h: opts.h || 480,
      x: opts.x || 50 + OS.windows.length * 20,
      y: opts.y || 50 + OS.windows.length * 20,
      ...opts
    };
    this.el = this.build();
    document.body.appendChild(this.el);
    this.attachEvents();
  }

  build() {
    const e = ce('div', {
      className: 'window',
      style: `left:${this.opts.x}px;top:${this.opts.y}px;width:${this.opts.w}px;height:${this.opts.h}px;z-index:${++OS.z}`
    });
    const t = ce('div', { className: 'win-title' }, [
      ce('span', { className: 'w-ic', textContent: this.app.icon }),
      ce('span', { className: 'w-ti', textContent: this.title }),
      ce('div', { className: 'w-btns' }, [
        ce('button', { className: 'w-btn w-min', textContent: '−', onclick: () => OS.minimizeWindow(this) }),
        ce('button', { className: 'w-btn w-max', textContent: '□', onclick: () => OS.maximizeWindow(this) }),
        ce('button', { className: 'w-btn w-clo', textContent: '×', onclick: () => OS.closeWindow(this) })
      ])
    ]);
    this.body = ce('div', { className: 'win-body' });
    e.append(t, this.body, ce('div', { className: 'rz se' }));
    return e;
  }

  attachEvents() {
    let dx, dy, dw, dh, ox, oy, ow, oh, mode;
    const t = this.el.querySelector('.win-title');
    t.onmousedown = e => {
      if (e.target.closest('.w-btns')) return;
      mode = 'move';
      ox = e.clientX; oy = e.clientY;
      dx = parseInt(this.el.style.left);
      dy = parseInt(this.el.style.top);
      document.body.style.userSelect = 'none';
    };
    const se = this.el.querySelector('.rz.se');
    se.onmousedown = e => {
      mode = 'resize';
      ox = e.clientX; oy = e.clientY;
      ow = this.el.offsetWidth;
      oh = this.el.offsetHeight;
      document.body.style.userSelect = 'none';
      e.stopPropagation();
    };
    document.onmousemove = e => {
      if (!mode) return;
      if (mode === 'move' && !this.max) {
        this.el.style.left = (dx + e.clientX - ox) + 'px';
        this.el.style.top = (dy + e.clientY - oy) + 'px';
      } else if (mode === 'resize') {
        this.el.style.width = Math.max(200, ow + e.clientX - ox) + 'px';
        this.el.style.height = Math.max(100, oh + e.clientY - oy) + 'px';
      }
    };
    document.onmouseup = () => { mode = null; document.body.style.userSelect = ''; };
    t.ondblclick = () => OS.maximizeWindow(this);
    this.el.onmousedown = () => OS.focusWindow(this);
  }
}

class App {
  constructor() {
    this.id = this.constructor.name;
    this.name = 'App';
    this.icon = '📦';
    this.cat = 'Accessories';
    this.single = false;
    this.windows = [];
  }

  open(opts) {
    const w = new Win(this, this.name, opts || {});
    this.windows.push(w);
    this.init(w, opts);
    return w;
  }

  close(w) {
    this.windows = this.windows.filter(x => x !== w);
  }

  init(w) {}
}
