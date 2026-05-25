/* =============================================
   vfs.js — Virtual File System
   ============================================= */

const VFS = {
  root: { type: 'dir', children: {} },
  cwd: '/home/user',

  init() {
    const s = localStorage.getItem('wl_vfs');
    if (s) this.root = JSON.parse(s);
    this.mkd('/home');
    this.mkd('/home/user');
    this.mkd('/home/user/Documents');
    this.mkd('/home/user/Pictures');
    this.mkd('/home/user/Music');
    this.mkd('/home/user/Videos');
    if (!this.exist('/home/user/Readme.txt')) {
      this.write('/home/user/Readme.txt',
        'Welcome to WebLinux OS!\nThis is a fully functional web-based operating system.\nExplore 70+ apps from the Start Menu.'
      );
    }
  },

  save() {
    localStorage.setItem('wl_vfs', JSON.stringify(this.root));
  },

  path(p) {
    p = p || this.cwd;
    if (p.startsWith('/')) return p.split('/').filter(Boolean);
    return this.cwd.split('/').filter(Boolean).concat(p.split('/').filter(Boolean));
  },

  get(p) {
    let c = this.root;
    for (const s of this.path(p)) {
      if (!c.children[s]) return null;
      c = c.children[s];
    }
    return c;
  },

  mkd(p) {
    const a = this.path(p);
    let c = this.root;
    for (let i = 0; i < a.length; i++) {
      const s = a[i];
      if (!c.children[s]) {
        c.children[s] = { type: 'dir', children: {} };
        if (i === a.length - 1) this.save();
      }
      c = c.children[s];
    }
    return true;
  },

  write(p, content) {
    const a = this.path(p);
    const f = a.pop();
    let c = this.root;
    for (const s of a) {
      if (!c.children[s]) return false;
      c = c.children[s];
    }
    c.children[f] = { type: 'file', content, date: new Date().toISOString() };
    this.save();
    return true;
  },

  read(p) {
    const n = this.get(p);
    return n && n.type === 'file' ? n.content : null;
  },

  ls(p) {
    const n = this.get(p);
    if (!n || n.type !== 'dir') return null;
    return Object.entries(n.children).map(([k, v]) => ({
      name: k, type: v.type, date: v.date
    }));
  },

  rm(p) {
    const a = this.path(p);
    const f = a.pop();
    let c = this.root;
    for (const s of a) {
      if (!c.children[s]) return false;
      c = c.children[s];
    }
    delete c.children[f];
    this.save();
    return true;
  },

  exist(p) {
    return !!this.get(p);
  }
};

VFS.init();
