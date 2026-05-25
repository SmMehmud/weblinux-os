/* =============================================
   os.js — Core OS Object
   ============================================= */

const OS = {
  apps: {},
  windows: [],
  settings: { wallpaper: '#1a1a2e', theme: 'dark' },
  focus: null,
  z: 100,

  init() {
    this.loadSettings();
    this.buildDesktop();
    this.buildStartMenu();
    this.startClock();
    this.setupEvents();
    setTimeout(() => this.boot(), 800);
  },

  boot() {
    const b = $('#boot'), f = $('#boot-fill'), t = $('#boot-txt');
    const steps = [
      ['Loading kernel...', 20],
      ['Mounting filesystem...', 45],
      ['Starting services...', 70],
      ['Loading desktop...', 90],
      ['Welcome', 100]
    ];
    let i = 0;
    const n = () => {
      if (i >= steps.length) {
        b.style.opacity = 0;
        setTimeout(() => b.remove(), 500);
        return;
      }
      t.textContent = steps[i][0];
      f.style.width = steps[i][1] + '%';
      i++;
      setTimeout(n, 400);
    };
    n();
  },

  registerApp(a) {
    const i = new a();
    this.apps[i.id] = i;
  },

  loadSettings() {
    const s = localStorage.getItem('wl_settings');
    if (s) Object.assign(this.settings, JSON.parse(s));
  },

  saveSettings() {
    localStorage.setItem('wl_settings', JSON.stringify(this.settings));
  },

  buildDesktop() {
    const d = $('#desktop-icons');
    d.innerHTML = '';
    const icons = [
      ['📁', 'Files', 'FileManager'],
      ['📝', 'Text', 'TextEditor'],
      ['🧮', 'Calc', 'Calculator'],
      ['🖥️', 'Term', 'Terminal'],
      ['🌐', 'Web', 'WebBrowser'],
      ['🎮', 'Games', null],
      ['⚙️', 'Settings', 'Settings'],
      ['🖼️', 'Paint', 'PaintApp']
    ];
    icons.forEach(([ic, nm, app]) => {
      const el = ce('div', { className: 'd-icon' }, [
        ce('div', { className: 'ic', textContent: ic }),
        ce('div', { className: 'nm', textContent: nm })
      ]);
      el.ondblclick = () => app && this.openApp(app);
      d.appendChild(el);
    });
    const bg = this.settings.wallpaper;
    $('#desktop').style.background = bg.startsWith('#')
      ? bg
      : `url(${bg})`;
    $('#desktop').style.backgroundSize = 'cover';
  },

  buildStartMenu() {
    const cats = {
      All: '⭐', Accessories: '🛠️', Games: '🎮',
      Graphics: '🎨', Internet: '🌐', Office: '📄',
      System: '🖥️', Utilities: '🔧', Development: '💻',
      Multimedia: '🎬'
    };
    const c = $('#sm-cats');
    Object.entries(cats).forEach(([n, i]) => {
      const el = ce('div', { className: 'sm-cat', textContent: `${i} ${n}` });
      el.onclick = () => this.filterStart(n, el);
      c.appendChild(el);
    });
    c.children[0].classList.add('active');
    this.filterStart('All', c.children[0]);
    $('#sm-inp').oninput = e => this.filterStart('Search', null, e.target.value);
    $('#start-btn').onclick = () => $('#start-menu').classList.toggle('open');
  },

  filterStart(cat, el, q) {
    if (el) $$('.sm-cat').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    const a = $('#sm-apps');
    a.innerHTML = '';
    const list = Object.values(this.apps).filter(x =>
      !q
        ? cat === 'All' || x.cat === cat
        : x.name.toLowerCase().includes(q.toLowerCase())
    );
    list.forEach(app => {
      const d = ce('div', { className: 'sm-app' }, [
        ce('span', { className: 'ic', textContent: app.icon }),
        ce('span', { textContent: app.name })
      ]);
      d.onclick = () => {
        this.openApp(app.id);
        $('#start-menu').classList.remove('open');
      };
      a.appendChild(d);
    });
  },

  openApp(id, opts) {
    const a = this.apps[id];
    if (!a) return;
    if (a.single && a.windows.length) { this.focusWindow(a.windows[0]); return; }
    const w = a.open(opts);
    this.windows.push(w);
    this.updateTaskbar();
    this.focusWindow(w);
    return w;
  },

  closeWindow(w) {
    const a = w.app;
    a.close(w);
    w.el.remove();
    this.windows = this.windows.filter(x => x !== w);
    this.updateTaskbar();
    if (this.focus === w) this.focus = null;
  },

  focusWindow(w) {
    if (!w || w.min) return;
    this.windows.forEach(x => { x.el.style.zIndex = --this.z; });
    w.el.style.zIndex = ++this.z;
    this.focus = w;
    $('.tb-app[data-id="' + w.id + '"]')?.classList.add('active');
    this.updateTaskbar();
  },

  minimizeWindow(w) {
    w.min = !w.min;
    w.el.style.display = w.min ? 'none' : 'flex';
    this.updateTaskbar();
    if (!w.min) this.focusWindow(w);
  },

  maximizeWindow(w) {
    w.max = !w.max;
    w.el.classList.toggle('max', w.max);
    if (!w.max) {
      w.el.style.left = w.prevX;
      w.el.style.top = w.prevY;
      w.el.style.width = w.prevW;
      w.el.style.height = w.prevH;
    } else {
      w.prevX = w.el.style.left;
      w.prevY = w.el.style.top;
      w.prevW = w.el.style.width;
      w.prevH = w.el.style.height;
    }
  },

  /* FIX: was `<<span>` — corrected to `<span>` */
  updateTaskbar() {
    const t = $('#taskbar-apps');
    t.innerHTML = '';
    this.windows.forEach(w => {
      const b = ce('button', {
        className: 'tb-app ' + (this.focus === w ? 'active' : ''),
        innerHTML: `<span>${w.app.icon}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${w.title}</span>`
      });
      b.dataset.id = w.id;
      b.onclick = () => {
        if (this.focus === w && !w.min) this.minimizeWindow(w);
        else {
          if (w.min) w.min = false;
          w.el.style.display = 'flex';
          this.focusWindow(w);
        }
      };
      t.appendChild(b);
    });
  },

  startClock() {
    const upd = () => {
      const n = new Date();
      $('#clock').innerHTML =
        `${n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>` +
        `<span style="font-size:11px">${n.toLocaleDateString()}</span>`;
    };
    upd();
    setInterval(upd, 1000);
  },

  setupEvents() {
    document.onkeydown = e => {
      if (e.key === 'Meta' || e.key === 'Super') {
        $('#start-menu').classList.toggle('open');
        e.preventDefault();
      }
    };
    $('#desktop').oncontextmenu = e => {
      e.preventDefault();
      this.ctxMenu(e.clientX, e.clientY, [
        ['🔄 Refresh', () => this.buildDesktop()],
        ['➕ New Folder', () => {}],
        ['🎨 Change Wallpaper', () => this.openApp('Settings')],
        ['📋 Paste', () => {}]
      ]);
    };
    document.onclick = e => {
      if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn'))
        $('#start-menu').classList.remove('open');
      $('#ctx-menu').style.display = 'none';
    };
  },

  ctxMenu(x, y, items) {
    const m = $('#ctx-menu');
    m.innerHTML = '';
    m.style.left = x + 'px';
    m.style.top = y + 'px';
    m.style.display = 'block';
    items.forEach(([txt, cb]) => {
      const it = ce('div', { className: 'ctx-item', textContent: txt });
      it.onclick = () => { cb(); m.style.display = 'none'; };
      m.appendChild(it);
    });
  },

  setTitle(w, t) {
    w.el.querySelector('.w-ti').textContent = t;
    w.title = t;
    this.updateTaskbar();
  }
};
