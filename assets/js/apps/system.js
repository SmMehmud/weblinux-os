/* =============================================
   system.js — System Apps
   Terminal, FileManager, TextEditor, WebBrowser,
   Settings, TaskManager, SystemInfo, LogViewer,
   SearchApp, NetworkMonitor, DiskUsage,
   ProcessManager, BackupApp
   ============================================= */

class Terminal extends App {
  constructor() {
    super();
    this.name = 'Terminal';
    this.icon = '🖥️';
    this.cat = 'System';
  }
  init(w) {
    const out = ce('div', { className: 'term-out' });
    w.body.innerHTML = '';
    w.body.appendChild(out);
    const hist = [];
    const prompt = () => {
      const d = ce('div', { className: 'term-in' }, [
        ce('span', { textContent: `user@weblinux:${VFS.cwd}$` }),
        ce('input')
      ]);
      const i = d.querySelector('input');
      i.onkeydown = e => {
        if (e.key === 'Enter') {
          const cmd = i.value.trim();
          hist.push(cmd);
          out.appendChild(ce('div', { textContent: `user@weblinux:${VFS.cwd}$ ${cmd}` }));
          this.run(cmd, out);
          prompt();
          i.focus();
        } else if (e.key === 'ArrowUp') {
          i.value = hist[hist.length - 1] || '';
        }
      };
      out.appendChild(d);
      i.focus();
      out.scrollTop = out.scrollHeight;
    };

    /* FIX: neofetch used <<span> — corrected to <span> */
    this.run = (cmd, out) => {
      const [a, ...args] = cmd.split(' ');
      const p = args.join(' ');
      switch (a) {
        case '': break;
        case 'help':
          out.appendChild(ce('div', { textContent: 'Commands: help, ls, cd, pwd, cat, mkdir, rm, touch, echo, clear, date, whoami, calc, neofetch, ps, kill, open, edit, reboot, shutdown, fortune' }));
          break;
        case 'ls': {
          const d = VFS.ls(VFS.cwd) || [];
          out.appendChild(ce('div', { textContent: d.map(x => `${x.type === 'dir' ? 'd' : '-'} ${x.name}`).join('\n') || '(empty)' }));
          break;
        }
        case 'cd': {
          const np = p.startsWith('/') ? p : VFS.cwd + '/' + p;
          const n = VFS.get(np);
          if (n && n.type === 'dir') VFS.cwd = np.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
          else out.appendChild(ce('div', { textContent: 'Not a directory' }));
          break;
        }
        case 'pwd': out.appendChild(ce('div', { textContent: VFS.cwd })); break;
        case 'cat': {
          const c = VFS.read(VFS.cwd + '/' + p);
          out.appendChild(ce('div', { textContent: c !== null ? c : 'No such file' }));
          break;
        }
        case 'mkdir': VFS.mkd(VFS.cwd + '/' + p); out.appendChild(ce('div', { textContent: 'Created' })); break;
        case 'touch': VFS.write(VFS.cwd + '/' + p, ''); out.appendChild(ce('div', { textContent: 'Created' })); break;
        case 'rm': VFS.rm(VFS.cwd + '/' + p); out.appendChild(ce('div', { textContent: 'Removed' })); break;
        case 'echo': out.appendChild(ce('div', { textContent: p })); break;
        case 'clear': out.innerHTML = ''; break;
        case 'date': out.appendChild(ce('div', { textContent: new Date().toString() })); break;
        case 'whoami': out.appendChild(ce('div', { textContent: 'user' })); break;
        case 'calc': try { out.appendChild(ce('div', { textContent: eval(p) })); } catch (e) { out.appendChild(ce('div', { textContent: 'Error' })); } break;
        case 'neofetch':
          out.appendChild(ce('div', {
            className: 'neofetch',
            innerHTML:
              `<span class="logo">  .---.  </span>  <b>OS</b>: WebLinux 1.0\n` +
              `<span class="logo"> /     \\ </span>  <b>Host</b>: ${navigator.userAgent.slice(0, 30)}...\n` +
              `<span class="logo">|  🐧   |</span>  <b>Shell</b>: weblinux-term\n` +
              `<span class="logo"> \\     / </span>  <b>Resolution</b>: ${innerWidth}x${innerHeight}\n` +
              `<span class="logo">  '---'  </span>  <b>Theme</b>: ${OS.settings.theme}`
          }));
          break;
        case 'ps': OS.windows.forEach((x, i) => out.appendChild(ce('div', { textContent: `${i} ${x.app.name}` }))); break;
        case 'kill': { const n = parseInt(p); if (OS.windows[n]) OS.closeWindow(OS.windows[n]); break; }
        case 'open': OS.openApp(p); break;
        case 'edit': OS.openApp('TextEditor', { file: VFS.cwd + '/' + p }); break;
        case 'reboot': location.reload(); break;
        case 'shutdown': document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-size:24px">System halted</div>'; break;
        case 'fortune':
          out.appendChild(ce('div', { textContent: ['A journey of a thousand miles begins with a single click.', 'There is no place like 127.0.0.1', 'With great power comes great electricity bills.', 'Your focus determines your reality.'][Math.floor(Math.random() * 4)] }));
          break;
        default: out.appendChild(ce('div', { textContent: `${a}: command not found` }));
      }
    };
    prompt();
  }
}

class FileManager extends App {
  constructor() {
    super();
    this.name = 'Files';
    this.icon = '📁';
    this.cat = 'System';
    this.path = '/home/user';
  }
  init(w, opts) {
    this.path = opts?.path || '/home/user';
    const r = ce('div');
    const h = ce('div', { className: 'fm-head' }, [
      ce('button', { textContent: '⬆', onclick: () => { const a = this.path.split('/'); a.pop(); this.path = a.join('/') || '/'; this.refresh(w, r); } }),
      ce('button', { textContent: '🔄', onclick: () => this.refresh(w, r) }),
      ce('button', { textContent: '➕📁', onclick: () => { const n = prompt('Folder name'); if (n) { VFS.mkd(this.path + '/' + n); this.refresh(w, r); } } }),
      ce('button', { textContent: '➕📄', onclick: () => { const n = prompt('File name'); if (n) { VFS.write(this.path + '/' + n, ''); this.refresh(w, r); } } }),
      ce('div', { className: 'fm-path', textContent: this.path })
    ]);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [h, r]));
    this.refresh(w, r);
  }
  refresh(w, r) {
    r.innerHTML = '';
    const items = VFS.ls(this.path) || [];
    items.forEach(it => {
      const row = ce('div', { className: 'fm-row' }, [
        ce('span', { className: 'ic', textContent: it.type === 'dir' ? '📁' : '📄' }),
        ce('span', { textContent: it.name })
      ]);
      row.ondblclick = () => {
        if (it.type === 'dir') {
          this.path = (this.path + '/' + it.name).replace(/\/+/g, '/');
          w.el.querySelector('.fm-path').textContent = this.path;
          this.refresh(w, r);
        } else {
          OS.openApp('TextEditor', { file: this.path + '/' + it.name });
        }
      };
      row.oncontextmenu = e => {
        e.stopPropagation(); e.preventDefault();
        OS.ctxMenu(e.clientX, e.clientY, [
          ['✏️ Rename', () => {
            const nn = prompt('New name', it.name);
            if (nn) {
              const c = VFS.get(this.path + '/' + it.name);
              VFS.write(this.path + '/' + nn, c.content || '');
              if (c.type === 'dir') { VFS.mkd(this.path + '/' + nn); Object.assign(VFS.get(this.path + '/' + nn).children, c.children); }
              VFS.rm(this.path + '/' + it.name);
              this.refresh(w, r);
            }
          }],
          ['🗑️ Delete', () => { VFS.rm(this.path + '/' + it.name); this.refresh(w, r); }]
        ]);
      };
      r.appendChild(row);
    });
  }
}

class TextEditor extends App {
  constructor() {
    super();
    this.name = 'Text Editor';
    this.icon = '📝';
    this.cat = 'Office';
    this.single = false;
  }
  init(w, opts) {
    const p = opts?.file;
    let cur = p;
    const bar = ce('div', { className: 'txt-bar' }, [
      ce('button', { textContent: '📂 Open', onclick: () => { const f = prompt('Path:'); const c = VFS.read(f); if (c !== null) { ta.value = c; cur = f; OS.setTitle(w, 'Text Editor - ' + f); } } }),
      ce('button', { textContent: '💾 Save', onclick: () => { if (cur) VFS.write(cur, ta.value); else { const f = prompt('Save as:'); VFS.write(f, ta.value); cur = f; OS.setTitle(w, 'Text Editor - ' + f); } } }),
      ce('button', { textContent: '➕ New', onclick: () => { ta.value = ''; cur = null; OS.setTitle(w, 'Text Editor'); } }),
      ce('button', { textContent: '🔍 Find', onclick: () => { const q = prompt('Find:'); if (q) { const i = ta.value.indexOf(q); if (i >= 0) { ta.focus(); ta.setSelectionRange(i, i + q.length); } } } })
    ]);
    const ta = ce('textarea', { className: 'txt-ta' });
    if (p) { const c = VFS.read(p); if (c !== null) ta.value = c; OS.setTitle(w, 'Text Editor - ' + p); }
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%', className: 'txt-ed' }, [bar, ta]));
  }
}

class WebBrowser extends App {
  constructor() {
    super();
    this.name = 'Browser';
    this.icon = '🌐';
    this.cat = 'Internet';
  }
  init(w) {
    const frm = ce('div', { className: 'br-frm' }, [
      ce('input', { type: 'text', value: 'https://example.com', placeholder: 'Enter URL...' }),
      ce('button', { textContent: 'Go', onclick: () => { ifr.src = inp.value; } }),
      ce('button', { textContent: '←', onclick: () => ifr.contentWindow.history.back() }),
      ce('button', { textContent: '→', onclick: () => ifr.contentWindow.history.forward() }),
      ce('button', { textContent: '🔄', onclick: () => { ifr.src = inp.value; } })
    ]);
    const inp = frm.querySelector('input');
    const ifr = ce('iframe', { className: 'br-ifr', src: 'https://example.com', sandbox: 'allow-scripts allow-same-origin allow-forms' });
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [frm, ifr]));
  }
}

class Settings extends App {
  constructor() {
    super();
    this.name = 'Settings';
    this.icon = '⚙️';
    this.cat = 'System';
    this.single = true;
  }
  init(w) {
    const d = ce('div');
    const sect = (t, el) => d.appendChild(ce('div', { className: 'set-sect' }, [ce('h3', { textContent: t }), el]));
    const row = (l, el) => ce('div', { className: 'set-row' }, [ce('label', { textContent: l }), el]);
    const th = ce('select', {}, [ce('option', { textContent: 'Dark' }), ce('option', { textContent: 'Light' })]);
    th.onchange = e => { OS.settings.theme = e.target.value; OS.saveSettings(); };
    sect('Appearance', row('Theme', th));
    const wp = ce('input', { type: 'text', value: OS.settings.wallpaper, placeholder: '#hex or URL' });
    wp.onchange = e => { OS.settings.wallpaper = e.target.value; OS.saveSettings(); OS.buildDesktop(); };
    sect('Wallpaper', row('Background', wp));
    const rs = ce('button', { textContent: '🗑️ Reset System Data', onclick: () => { if (confirm('Erase all data?')) { localStorage.clear(); location.reload(); } } });
    sect('System', rs);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class TaskManager extends App {
  constructor() {
    super();
    this.name = 'Task Manager';
    this.icon = '📊';
    this.cat = 'System';
  }
  init(w) {
    const d = ce('div');
    const upd = () => {
      d.innerHTML = '';
      OS.windows.forEach(x => {
        const r = ce('div', { className: 'fm-row', style: 'justify-content:space-between' }, [
          ce('span', { textContent: `${x.app.icon} ${x.app.name} (${x.title})` }),
          ce('button', { textContent: 'End', onclick: () => OS.closeWindow(x) })
        ]);
        d.appendChild(r);
      });
      requestAnimationFrame(upd);
    };
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class SystemInfo extends App {
  constructor() {
    super();
    this.name = 'System Info';
    this.icon = '💻';
    this.cat = 'System';
  }
  init(w) {
    const d = ce('div');
    const tbl = ce('table', { className: 'sys-table' });
    const add = (k, v) => tbl.appendChild(ce('tr', {}, [ce('td', { textContent: k }), ce('td', { textContent: v })]));
    add('OS', 'WebLinux 1.0');
    add('Browser', navigator.userAgent);
    add('Platform', navigator.platform);
    add('Language', navigator.language);
    add('Screen', `${screen.width}x${screen.height}`);
    add('Viewport', `${innerWidth}x${innerHeight}`);
    add('Cores', navigator.hardwareConcurrency || '?');
    add('Memory', navigator.deviceMemory ? navigator.deviceMemory + ' GB' : '?');
    add('Touch', navigator.maxTouchPoints > 0 ? 'Yes' : 'No');
    add('Online', navigator.onLine ? 'Yes' : 'No');
    d.appendChild(tbl);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class LogViewer extends App {
  constructor() {
    super();
    this.name = 'Logs';
    this.icon = '📋';
    this.cat = 'System';
  }
  init(w) {
    const d = ce('div', { className: 'term-out', style: 'color:#aaa' });
    const logs = [
      `[${new Date().toISOString()}] System boot`,
      `[${new Date().toISOString()}] Kernel loaded`,
      `[${new Date().toISOString()}] Filesystem mounted`,
      `[${new Date().toISOString()}] Desktop initialized`,
      `[${new Date().toISOString()}] 70 apps registered`
    ];
    d.textContent = logs.join('\n');
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class SearchApp extends App {
  constructor() {
    super();
    this.name = 'Search';
    this.icon = '🔍';
    this.cat = 'System';
  }
  init(w) {
    const inp = ce('input', { type: 'text', placeholder: 'Search files and apps...', style: 'width:100%;padding:10px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:6px;font-size:14px' });
    const res = ce('div', { style: 'margin-top:12px' });
    const doSearch = () => {
      const q = inp.value.toLowerCase();
      res.innerHTML = '';
      if (!q) return;
      Object.values(OS.apps).filter(a => a.name.toLowerCase().includes(q)).forEach(a => {
        const r = ce('div', { className: 'fm-row', textContent: `📦 ${a.name}` });
        r.onclick = () => OS.openApp(a.id);
        res.appendChild(r);
      });
      const searchDir = (p, path) => {
        Object.entries(p.children || {}).forEach(([n, v]) => {
          const fp = path + '/' + n;
          if (n.toLowerCase().includes(q)) {
            const r = ce('div', { className: 'fm-row', textContent: `${v.type === 'dir' ? '📁' : '📄'} ${fp}` });
            r.onclick = () => { if (v.type === 'file') OS.openApp('TextEditor', { file: fp }); };
            res.appendChild(r);
          }
          if (v.type === 'dir') searchDir(v, fp);
        });
      };
      searchDir(VFS.root, '');
    };
    inp.oninput = doSearch;
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [inp, res]));
  }
}

class NetworkMonitor extends App {
  constructor() {
    super();
    this.name = 'Network';
    this.icon = '📡';
    this.cat = 'System';
  }
  init(w) {
    const cvs = ce('canvas', { width: 400, height: 100, style: 'width:100%;background:var(--bg);border-radius:4px' });
    const ctx = cvs.getContext('2d');
    const info = ce('div', { style: 'margin-top:12px;font-size:13px' });
    const hist = [];
    const upd = () => {
      const down = Math.floor(Math.random() * 100), up = Math.floor(Math.random() * 50);
      hist.push(down);
      if (hist.length > 50) hist.shift();
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, 400, 100);
      ctx.strokeStyle = '#2ecc71';
      ctx.beginPath();
      hist.forEach((v, i) => { const x = i * 8, y = 100 - v; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
      info.innerHTML = `Download: ${down} Mbps<br>Upload: ${up} Mbps<br>Latency: ${Math.floor(Math.random() * 20 + 5)} ms`;
    };
    setInterval(upd, 1000);
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [cvs, info]));
  }
}

class DiskUsage extends App {
  constructor() {
    super();
    this.name = 'Disk';
    this.icon = '💾';
    this.cat = 'System';
  }
  init(w) {
    const total = 500, used = Math.floor(Math.random() * 300 + 50);
    const free = total - used;
    const bar = ce('div', { className: 'pg-bar' }, [ce('div', { className: 'pg-fill', style: `width:${(used / total) * 100}%` })]);
    const d = ce('div', { style: 'padding:20px' }, [
      ce('div', { style: 'margin-bottom:8px', textContent: `Storage: ${used} GB used / ${total} GB total` }),
      bar,
      ce('div', { style: 'margin-top:12px;color:#aaa', textContent: `Free: ${free} GB` })
    ]);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class ProcessManager extends App {
  constructor() {
    super();
    this.name = 'Processes';
    this.icon = '⚙️';
    this.cat = 'System';
  }
  init(w) {
    const tbl = ce('table', { className: 'sys-table' });
    const upd = () => {
      tbl.innerHTML = '';
      const procs = [
        ...OS.windows.map(x => ({ n: x.app.name, p: Math.floor(Math.random() * 10 + 2), m: Math.floor(Math.random() * 50 + 10) })),
        { n: 'kernel_task', p: 5, m: 120 },
        { n: 'window_server', p: 8, m: 80 },
        { n: 'filesystem', p: 2, m: 40 }
      ];
      procs.forEach(p => {
        tbl.appendChild(ce('tr', {}, [
          ce('td', { textContent: p.n }),
          ce('td', { textContent: `${p.p}%` }),
          ce('td', { textContent: `${p.m} MB` })
        ]));
      });
    };
    setInterval(upd, 2000);
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [tbl]));
  }
}

class BackupApp extends App {
  constructor() {
    super();
    this.name = 'Backup';
    this.icon = '💾';
    this.cat = 'System';
  }
  init(w) {
    const bar = ce('div', { className: 'pg-bar' }, [ce('div', { className: 'pg-fill' })]);
    const lastBackup = ce('div', { style: 'margin-top:12px;color:#aaa', textContent: 'Last backup: Never' });
    const d = ce('div', { style: 'padding:20px' }, [
      ce('div', { textContent: 'Backup Status' }),
      bar,
      lastBackup,
      ce('button', {
        textContent: 'Create Backup',
        style: 'margin-top:12px;padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer',
        onclick: () => {
          bar.firstChild.style.width = '100%';
          lastBackup.textContent = 'Last backup: ' + new Date().toLocaleString();
        }
      })
    ]);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}
