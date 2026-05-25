/* =============================================
   accessories.js — Accessories & Productivity
   Calculator, CalculatorSci, CalculatorProgrammer,
   Notes, UnitConverter, MarkdownPreview, JSONFormatter,
   Base64Tool, PasswordGen, ColorPicker, QRGenerator,
   Calendar, ClockApp, Stopwatch, Timer, WorldClock,
   ASCIIArt, RegexTester, HTMLPreview, CodeEditor,
   Spreadsheet, FortuneCookie, TextToSpeech
   ============================================= */

class Calculator extends App {
  constructor() {
    super();
    this.name = 'Calculator';
    this.icon = '🧮';
    this.cat = 'Accessories';
  }
  init(w) {
    const d = ce('div', { className: 'calc-app' });
    const disp = ce('input', { className: 'calc-disp', type: 'text', readOnly: true, value: '0' });
    let cur = '0', op = null, prev = null;
    const btns = ce('div', { className: 'calc-btns' });
    const add = (t, cls = '') => {
      const b = ce('button', {
        textContent: t, className: cls, onclick: () => {
          if (t === 'C') { cur = '0'; op = null; prev = null; }
          else if (t === '=') { try { cur = String(eval(prev + op + cur) || 0); op = null; prev = null; } catch (e) { cur = 'Error'; } }
          else if ('+-*/'.includes(t)) { op = t; prev = cur; cur = '0'; }
          else { if (cur === '0' && !t.includes('.')) cur = t; else cur += t; }
          disp.value = cur;
        }
      });
      btns.appendChild(b);
    };
    ['C', '±', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].forEach(x => add(x, x.match(/[+\-*/%=]/) ? 'op' : ''));
    d.append(disp, btns);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class CalculatorSci extends App {
  constructor() {
    super();
    this.name = 'Scientific';
    this.icon = '📐';
    this.cat = 'Accessories';
  }
  init(w) {
    const d = ce('div', { className: 'calc-app', style: 'max-width:360px' });
    const disp = ce('input', { className: 'calc-disp', type: 'text', readOnly: true, value: '0' });
    let cur = '0';
    const btns = ce('div', { className: 'calc-btns' });
    const add = (t, fn) => btns.appendChild(ce('button', {
      textContent: t, className: 'op', onclick: () => {
        if (t === 'C') cur = '0';
        else if (t === '=') try { cur = String(eval(cur)); } catch (e) { cur = 'Error'; }
        else if (fn) cur = String(fn(parseFloat(cur)));
        else cur = cur === '0' ? t : cur + t;
        disp.value = cur;
      }
    }));
    ['sin', 'cos', 'tan', 'log', '√', 'x²', 'π', 'C', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].forEach(x => {
      const f = { sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log, '√': Math.sqrt, 'x²': x => x * x, 'π': () => Math.PI }[x];
      add(x, f);
    });
    d.append(disp, btns);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class CalculatorProgrammer extends App {
  constructor() {
    super();
    this.name = 'Programmer';
    this.icon = '🔢';
    this.cat = 'Accessories';
  }
  init(w) {
    let val = 0;
    const out = ce('div', { style: 'margin-bottom:12px' });
    const upd = () => out.innerHTML = `<div>Dec: ${val}</div><div>Hex: ${val.toString(16).toUpperCase()}</div><div>Bin: ${val.toString(2)}</div><div>Oct: ${val.toString(8)}</div>`;
    const btns = ce('div', { className: 'calc-btns' });
    [
      ['AND', () => val = 0], ['OR', () => val = 0], ['XOR', () => val = 0], ['NOT', () => val = ~val],
      ['<<', () => val <<= 1], ['>>', () => val >>= 1], ['+', () => val++], ['-', () => val--],
      ['0', () => val = 0], ['1', () => val = 1], ['FF', () => val = 255], ['256', () => val = 256]
    ].forEach(([t, fn]) => btns.appendChild(ce('button', { textContent: t, onclick: () => { fn(); upd(); } })));
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'max-width:300px' }, [out, btns]));
  }
}

class Notes extends App {
  constructor() {
    super();
    this.name = 'Notes';
    this.icon = '📌';
    this.cat = 'Office';
    this.single = true;
  }
  init(w) {
    let active = 'note1';
    const notes = JSON.parse(localStorage.getItem('wl_notes') || '{"note1":"Welcome to Notes!\\n\\nThis is a sticky notes app."}');
    const save = () => localStorage.setItem('wl_notes', JSON.stringify(notes));
    const tabs = ce('div', { className: 'note-list' });
    const ta = ce('textarea', { className: 'note-ta' });
    const r = () => {
      tabs.innerHTML = '';
      Object.keys(notes).forEach(k => {
        const t = ce('div', { className: 'note-tab ' + (k === active ? 'active' : ''), textContent: k });
        t.onclick = () => { active = k; ta.value = notes[k]; r(); };
        tabs.appendChild(t);
      });
      ta.value = notes[active];
    };
    r();
    ta.oninput = () => { notes[active] = ta.value; save(); };
    const add = ce('button', { textContent: '➕ New', onclick: () => { const n = 'note' + (Object.keys(notes).length + 1); notes[n] = ''; active = n; save(); r(); } });
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [
      ce('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' }, [tabs, add]),
      ta
    ]));
  }
}

class UnitConverter extends App {
  constructor() {
    super();
    this.name = 'Converter';
    this.icon = '⚖️';
    this.cat = 'Utilities';
  }
  init(w) {
    const types = {
      Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 },
      Weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
      Temp: {}
    };
    const sel = ce('select', {}, Object.keys(types).map(t => ce('option', { textContent: t })));
    const fr = ce('input', { type: 'number', value: 1, style: 'width:100px' });
    const fu = ce('select');
    const tu = ce('select');
    const res = ce('div', { className: 'cv-res', textContent: 'Result' });
    const upd = () => {
      const t = types[sel.value];
      fu.innerHTML = ''; tu.innerHTML = '';
      Object.keys(t).forEach(u => { fu.appendChild(ce('option', { textContent: u })); tu.appendChild(ce('option', { textContent: u })); });
      if (sel.value === 'Temp') {
        const v = parseFloat(fr.value), f = fu.value, t2 = tu.value;
        let r = v;
        if (f === 'C' && t2 === 'F') r = v * 9 / 5 + 32;
        else if (f === 'F' && t2 === 'C') r = (v - 32) * 5 / 9;
        else if (f === 'C' && t2 === 'K') r = v + 273.15;
        else if (f === 'K' && t2 === 'C') r = v - 273.15;
        res.textContent = r;
      } else {
        res.textContent = parseFloat(fr.value) * t[fu.value] / t[tu.value];
      }
    };
    sel.onchange = upd; fr.oninput = upd; fu.onchange = upd; tu.onchange = upd;
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { className: 'cv-inp' }, [sel, fr, fu, ce('span', { textContent: '→' }), tu, res]));
  }
}

/* FIX: All <<h1>, <<h2>, <<b>, <<i>, <<code>, <<blockquote>, <<li>, <<ul>, <<br> corrected */
class MarkdownPreview extends App {
  constructor() {
    super();
    this.name = 'Markdown';
    this.icon = '📄';
    this.cat = 'Office';
  }
  init(w) {
    const inp = ce('textarea', { className: 'md-in', value: '# Hello\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2\n\n> Quote\n\n`code`' });
    const out = ce('div', { className: 'md-out' });
    const parse = md => md
      .replace(/^### (.*)/gm, '<h3>$1</h3>')
      .replace(/^## (.*)/gm, '<h2>$1</h2>')
      .replace(/^# (.*)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*)\*/g, '<i>$1</i>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^> (.*)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
    const r = () => out.innerHTML = parse(inp.value);
    inp.oninput = r; r();
    const d = ce('div', { className: 'md-split' }, [inp, out]);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [d]));
  }
}

class JSONFormatter extends App {
  constructor() {
    super();
    this.name = 'JSON Tool';
    this.icon = '📋';
    this.cat = 'Development';
  }
  init(w) {
    const inp = ce('textarea', { style: 'width:100%;height:120px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;font-family:monospace;font-size:12px;border-radius:4px', placeholder: 'Paste JSON...' });
    const out = ce('pre', { style: 'background:var(--bg);padding:8px;border-radius:4px;font-size:12px;overflow:auto;max-height:200px' });
    const btns = ce('div', { style: 'display:flex;gap:8px;margin:8px 0' }, [
      ce('button', { textContent: 'Format', onclick: () => { try { out.textContent = JSON.stringify(JSON.parse(inp.value), null, 2); } catch (e) { out.textContent = 'Invalid JSON'; } } }),
      ce('button', { textContent: 'Minify', onclick: () => { try { out.textContent = JSON.stringify(JSON.parse(inp.value)); } catch (e) { out.textContent = 'Invalid JSON'; } } }),
      ce('button', { textContent: 'Copy', onclick: () => navigator.clipboard.writeText(out.textContent) })
    ]);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [inp, btns, out]));
  }
}

class Base64Tool extends App {
  constructor() {
    super();
    this.name = 'Base64';
    this.icon = '🔤';
    this.cat = 'Development';
  }
  init(w) {
    const inp = ce('textarea', { style: 'width:100%;height:100px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;font-family:monospace;font-size:12px;border-radius:4px' });
    const out = ce('textarea', { style: 'width:100%;height:100px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;font-family:monospace;font-size:12px;border-radius:4px', readOnly: true });
    const btns = ce('div', { style: 'display:flex;gap:8px;margin:8px 0' }, [
      ce('button', { textContent: 'Encode', onclick: () => out.value = btoa(inp.value) }),
      ce('button', { textContent: 'Decode', onclick: () => { try { out.value = atob(inp.value); } catch (e) { out.value = 'Invalid base64'; } } }),
      ce('button', { textContent: 'Swap', onclick: () => { const t = inp.value; inp.value = out.value; out.value = t; } })
    ]);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [ce('div', { textContent: 'Input' }), inp, btns, ce('div', { textContent: 'Output' }), out]));
  }
}

/* FIX: `i<<len` corrected to `i<len` */
class PasswordGen extends App {
  constructor() {
    super();
    this.name = 'Password';
    this.icon = '🔐';
    this.cat = 'Utilities';
  }
  init(w) {
    let len = 16, uc = true, lc = true, num = true, sym = true;
    const out = ce('div', { className: 'pw-out' });
    const str = ce('div', { className: 'pw-str' }, [ce('div', { className: 'pw-fill' })]);
    const gen = () => {
      let ch = '';
      if (lc) ch += 'abcdefghijklmnopqrstuvwxyz';
      if (uc) ch += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (num) ch += '0123456789';
      if (sym) ch += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      let p = '';
      for (let i = 0; i < len; i++) p += ch[Math.floor(Math.random() * ch.length)];
      out.textContent = p;
      const s = Math.min(100, (p.length / 32) * 100 + (uc + lc + num + sym) * 15);
      str.firstChild.style.width = s + '%';
      str.firstChild.style.background = s > 80 ? '#2ecc71' : s > 50 ? '#f1c40f' : '#e74c3c';
    };
    const d = ce('div');
    d.appendChild(ce('div', { className: 'pw-box' }, [
      out,
      ce('button', { textContent: '🔄', onclick: gen }),
      ce('button', { textContent: '📋', onclick: () => navigator.clipboard.writeText(out.textContent) })
    ]));
    [
      ['Length', ce('input', { type: 'range', min: 4, max: 64, value: 16, onchange: e => { len = e.target.value; gen(); } })],
      ['Uppercase', ce('input', { type: 'checkbox', checked: true, onchange: e => { uc = e.target.checked; gen(); } })],
      ['Lowercase', ce('input', { type: 'checkbox', checked: true, onchange: e => { lc = e.target.checked; gen(); } })],
      ['Numbers', ce('input', { type: 'checkbox', checked: true, onchange: e => { num = e.target.checked; gen(); } })],
      ['Symbols', ce('input', { type: 'checkbox', checked: true, onchange: e => { sym = e.target.checked; gen(); } })]
    ].forEach(([l, el]) => {
      const r = ce('div', { className: 'pw-opt' });
      r.append(el, ce('label', { textContent: l }));
      d.appendChild(r);
    });
    d.appendChild(str);
    gen();
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class ColorPicker extends App {
  constructor() {
    super();
    this.name = 'Color';
    this.icon = '🎨';
    this.cat = 'Graphics';
  }
  init(w) {
    let r = 100, g = 150, b = 200;
    const box = ce('div', { className: 'clr-box' });
    const hex = ce('div', { className: 'clr-val' });
    const upd = () => {
      const c = `rgb(${r},${g},${b})`, h = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
      box.style.background = c;
      hex.textContent = `${c} | ${h}`;
    };
    const sl = (label, fn) => ce('div', { className: 'clr-sl' }, [
      ce('span', { textContent: label.toUpperCase() }),
      ce('input', { type: 'range', min: 0, max: 255, value: label === 'r' ? r : label === 'g' ? g : b, oninput: e => { fn(parseInt(e.target.value)); upd(); } }),
      ce('span', { textContent: label })
    ]);
    const d = ce('div');
    d.append(box, hex, sl('r', v => r = v), sl('g', v => g = v), sl('b', v => b = v),
      ce('button', { textContent: '📋 Copy HEX', onclick: () => navigator.clipboard.writeText('#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')) })
    );
    upd();
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class QRGenerator extends App {
  constructor() {
    super();
    this.name = 'QR Code';
    this.icon = '🔲';
    this.cat = 'Utilities';
  }
  init(w) {
    const inp = ce('input', { type: 'text', value: 'https://example.com', placeholder: 'Enter text...', style: 'width:100%;padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px' });
    const out = ce('div', { className: 'qr-out' });
    const gen = () => {
      out.innerHTML = '';
      const img = ce('img', { src: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inp.value)}`, style: 'border-radius:8px' });
      img.onerror = () => out.textContent = 'Offline: Cannot generate QR without internet';
      out.appendChild(img);
    };
    const btn = ce('button', { textContent: 'Generate', onclick: gen, style: 'margin-top:8px;padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer' });
    gen();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'text-align:center' }, [inp, btn, out]));
  }
}

/* FIX: `m<<0` corrected to `m<0`, `i<<fd` to `i<fd` */
class Calendar extends App {
  constructor() {
    super();
    this.name = 'Calendar';
    this.icon = '📅';
    this.cat = 'Accessories';
  }
  init(w) {
    let y = new Date().getFullYear(), m = new Date().getMonth();
    const hd = ce('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px' });
    const gr = ce('div', { className: 'tm-grid' });
    const ev = ce('div', { className: 'cal-his' });
    const r = () => {
      gr.innerHTML = ''; hd.innerHTML = '';
      const fd = new Date(y, m, 1).getDay();
      const ld = new Date(y, m + 1, 0).getDate();
      hd.append(
        ce('button', { textContent: '←', onclick: () => { m--; if (m < 0) { m = 11; y--; } r(); } }),
        ce('span', { textContent: new Date(y, m).toLocaleString('default', { month: 'long', year: 'numeric' }) }),
        ce('button', { textContent: '→', onclick: () => { m++; if (m > 11) { m = 0; y++; } r(); } })
      );
      for (let i = 0; i < fd; i++) gr.appendChild(ce('div'));
      const tdy = new Date();
      for (let i = 1; i <= ld; i++) {
        const c = ce('div', { className: 'tm-cell', textContent: i });
        if (i === tdy.getDate() && m === tdy.getMonth() && y === tdy.getFullYear()) c.classList.add('today');
        c.onclick = () => {
          ev.textContent = `Selected: ${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          $$('.tm-cell').forEach(x => x.classList.remove('sel'));
          c.classList.add('sel');
        };
        gr.appendChild(c);
      }
    };
    r();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [hd, gr, ev]));
  }
}

class ClockApp extends App {
  constructor() {
    super();
    this.name = 'Clock';
    this.icon = '🕐';
    this.cat = 'Accessories';
  }
  init(w) {
    const cl = ce('div', { className: 'wc-clock' });
    const upd = () => { cl.textContent = new Date().toLocaleTimeString(); };
    setInterval(upd, 1000); upd();
    const wl = ce('div', { className: 'wc-list' });
    ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].forEach(z => {
      const r = ce('div', { className: 'wc-item' });
      const u = () => r.innerHTML = `<span>${z}</span><span>${new Date().toLocaleTimeString('en-US', { timeZone: z })}</span>`;
      u(); setInterval(u, 1000);
      wl.appendChild(r);
    });
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [cl, wl]));
  }
}

class Stopwatch extends App {
  constructor() {
    super();
    this.name = 'Stopwatch';
    this.icon = '⏱️';
    this.cat = 'Accessories';
  }
  init(w) {
    let t = 0, running = false;
    const disp = ce('div', { style: 'font-size:48px;margin-bottom:20px', textContent: '00:00:00' });
    const fmt = s => {
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    };
    const lap = ce('div', { style: 'margin-top:20px;max-height:200px;overflow:auto;font-size:13px' });
    let iv;
    const d = ce('div', { style: 'text-align:center;padding:40px' });
    d.append(disp, ce('div', { style: 'display:flex;gap:8px;justify-content:center' }, [
      ce('button', { textContent: 'Start', onclick() { if (running) return; running = true; iv = setInterval(() => { t++; disp.textContent = fmt(t); }, 1000); } }),
      ce('button', { textContent: 'Stop', onclick() { running = false; clearInterval(iv); } }),
      ce('button', { textContent: 'Lap', onclick() { lap.appendChild(ce('div', { textContent: fmt(t) })); } }),
      ce('button', { textContent: 'Reset', onclick() { running = false; clearInterval(iv); t = 0; disp.textContent = '00:00:00'; lap.innerHTML = ''; } })
    ]), lap);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

/* FIX: `this.icon:'⏲️'` corrected to `this.icon='⏲️'` */
class Timer extends App {
  constructor() {
    super();
    this.name = 'Timer';
    this.icon = '⏲️';
    this.cat = 'Accessories';
  }
  init(w) {
    let t = 0, iv = null;
    const inp = ce('input', { type: 'number', value: '5', style: 'width:80px;padding:8px;font-size:18px;text-align:center' });
    const disp = ce('div', { style: 'font-size:48px;margin:20px 0', textContent: '00:00' });
    const al = ce('audio', { src: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZ' });
    const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const d = ce('div', { style: 'text-align:center;padding:40px' });
    d.append(ce('div', { textContent: 'Minutes' }), inp, disp, ce('div', { style: 'display:flex;gap:8px;justify-content:center' }, [
      ce('button', { textContent: 'Start', onclick() { if (iv) return; const v = parseInt(inp.value) * 60; if (!v) return; t = v; iv = setInterval(() => { t--; disp.textContent = fmt(t); if (t <= 0) { clearInterval(iv); iv = null; al.play(); disp.textContent = 'DONE!'; } }, 1000); } }),
      ce('button', { textContent: 'Stop', onclick() { clearInterval(iv); iv = null; } }),
      ce('button', { textContent: 'Reset', onclick() { clearInterval(iv); iv = null; t = 0; disp.textContent = '00:00'; } })
    ]));
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class WorldClock extends App {
  constructor() {
    super();
    this.name = 'World Clocks';
    this.icon = '🌍';
    this.cat = 'Utilities';
  }
  init(w) {
    const d = ce('div', { className: 'wc-list' });
    const zones = ['UTC', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'Pacific/Auckland'];
    const upd = () => {
      d.innerHTML = '';
      zones.forEach(z => {
        const r = ce('div', { className: 'wc-item' });
        r.innerHTML = `<span>${z}</span><span style="font-size:18px;font-weight:600">${new Date().toLocaleTimeString('en-US', { timeZone: z, hour12: false })}</span>`;
        d.appendChild(r);
      });
    };
    upd(); setInterval(upd, 1000);
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class ASCIIArt extends App {
  constructor() {
    super();
    this.name = 'ASCII Art';
    this.icon = '📝';
    this.cat = 'Accessories';
  }
  init(w) {
    const inp = ce('textarea', { style: 'width:100%;height:80px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;font-family:monospace;font-size:12px;border-radius:4px', placeholder: 'Enter text...' });
    const out = ce('pre', { style: 'background:var(--bg);padding:8px;border-radius:4px;font-size:10px;overflow:auto;max-height:200px' });
    const font = { A: ['  ##  ', ' #  # ', '######', '#    #', '#    #'], B: ['##### ', '#    #', '##### ', '#    #', '##### '], C: [' #####', '#     ', '#     ', '#     ', ' #####'], D: ['##### ', '#    #', '#    #', '#    #', '##### '], E: ['######', '#     ', '##### ', '#     ', '######'], F: ['######', '#     ', '##### ', '#     ', '#     '], G: [' #####', '#     ', '#  ###', '#    #', ' #####'], H: ['#    #', '#    #', '######', '#    #', '#    #'], I: ['######', '  ##  ', '  ##  ', '  ##  ', '######'], J: ['######', '    # ', '    # ', '#   # ', ' ###  '], K: ['#    #', '#   # ', '####  ', '#   # ', '#    #'], L: ['#     ', '#     ', '#     ', '#     ', '######'], M: ['#    #', '##  ##', '# ## #', '#    #', '#    #'], N: ['#    #', '##   #', '# #  #', '#  # #', '#   ##'], O: [' #### ', '#    #', '#    #', '#    #', ' #### '], P: ['##### ', '#    #', '##### ', '#     ', '#     '], Q: [' #### ', '#    #', '#    #', '#  # #', ' #### '], R: ['##### ', '#    #', '##### ', '#   # ', '#    #'], S: [' #####', '#     ', ' ###  ', '     #', '##### '], T: ['######', '  ##  ', '  ##  ', '  ##  ', '  ##  '], U: ['#    #', '#    #', '#    #', '#    #', ' #### '], V: ['#    #', '#    #', '#    #', ' #  # ', '  ##  '], W: ['#    #', '#    #', '# ## #', '##  ##', '#    #'], X: ['#    #', ' #  # ', '  ##  ', ' #  # ', '#    #'], Y: ['#    #', ' #  # ', '  ##  ', '  ##  ', '  ##  '], Z: ['######', '    # ', '   #  ', '  #   ', '######'], ' ': [], '-': ['      ', '      ', '######', '      ', '      '] };
    const conv = t => {
      const l = t.toUpperCase().split('');
      const r = Array(5).fill('');
      l.forEach(c => { const f = font[c] || font[' '] || Array(5).fill('      '); f.forEach((ln, i) => r[i] += ln + '  '); });
      return r.join('\n');
    };
    inp.oninput = () => out.textContent = conv(inp.value);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [inp, out]));
  }
}

/* FIX: `'<<span style'` corrected to `'<span style'` */
class RegexTester extends App {
  constructor() {
    super();
    this.name = 'Regex';
    this.icon = '🔍';
    this.cat = 'Development';
  }
  init(w) {
    const pat = ce('input', { style: 'width:100%;padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px;margin-bottom:8px', placeholder: 'Pattern (e.g. [a-z]+)' });
    const txt = ce('textarea', { style: 'width:100%;height:100px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;border-radius:4px', placeholder: 'Test string...' });
    const out = ce('div', { style: 'margin-top:8px;padding:8px;background:var(--bg);border-radius:4px;font-size:13px;min-height:60px' });
    const test = () => {
      try {
        const r = new RegExp(pat.value, 'g');
        const m = txt.value.match(r);
        out.innerHTML = m
          ? `<span style="color:#2ecc71">Matches: ${m.length}</span><br>${m.slice(0, 10).join(', ')}`
          : '<span style="color:#e74c3c">No matches</span>';
      } catch (e) {
        out.innerHTML = '<span style="color:#e74c3c">Invalid regex</span>';
      }
    };
    pat.oninput = test; txt.oninput = test;
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [ce('div', { textContent: 'Pattern' }), pat, ce('div', { textContent: 'Text' }), txt, out]));
  }
}

/* FIX: `value:'<<h1>Hello</h1>'` corrected to `value:'<h1>Hello</h1>'` */
class HTMLPreview extends App {
  constructor() {
    super();
    this.name = 'HTML Live';
    this.icon = '🌐';
    this.cat = 'Development';
  }
  init(w) {
    const inp = ce('textarea', { style: 'width:100%;height:120px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;font-family:monospace;font-size:12px;border-radius:4px', value: '<h1>Hello</h1>\n<p>Edit me!</p>' });
    const out = ce('div', { style: 'background:#fff;color:#333;padding:12px;border-radius:4px;min-height:100px' });
    const upd = () => out.innerHTML = inp.value;
    inp.oninput = upd; upd();
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [inp, out]));
  }
}

/* FIX: `value:'<<button>Click me</button>'` corrected to `'<button>Click me</button>'` */
class CodeEditor extends App {
  constructor() {
    super();
    this.name = 'Code Editor';
    this.icon = '💻';
    this.cat = 'Development';
  }
  init(w) {
    const bar = ce('div', { className: 'co-bar' }, [
      ce('button', { textContent: 'HTML', onclick: () => setMode('html') }),
      ce('button', { textContent: 'CSS', onclick: () => setMode('css') }),
      ce('button', { textContent: 'JS', onclick: () => setMode('js') }),
      ce('button', { textContent: 'Run', onclick: run })
    ]);
    const body = ce('div', { className: 'co-body' });
    const ln = ce('div', { className: 'co-ln' });
    const ta = ce('textarea', { className: 'co-ta', value: '<button>Click me</button>' });
    const pr = ce('div', { className: 'co-pr' });
    let mode = 'html';
    const setMode = m => {
      mode = m;
      ta.value = m === 'html' ? '<button>Click me</button>' : m === 'css' ? 'button { color: red; }' : 'alert("Hello");';
    };
    const run = () => {
      if (mode === 'html') pr.innerHTML = ta.value;
      else if (mode === 'css') pr.innerHTML = `<style>${ta.value}</style><button>Styled button</button>`;
      else { try { const r = eval(ta.value); pr.innerHTML = `<pre>${r}</pre>`; } catch (e) { pr.innerHTML = `<pre style="color:red">${e}</pre>`; } }
    };
    const updLn = () => { ln.innerHTML = Array.from({ length: ta.value.split('\n').length }, (_, i) => i + 1).join('<br>'); };
    ta.oninput = updLn;
    ta.onscroll = () => ln.scrollTop = ta.scrollTop;
    updLn();
    body.append(ln, ta, pr);
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { className: 'co-ed' }, [bar, body]));
  }
}

/* FIX: `r<<15` corrected to `r<15` */
class Spreadsheet extends App {
  constructor() {
    super();
    this.name = 'Spreadsheet';
    this.icon = '📊';
    this.cat = 'Office';
  }
  init(w) {
    const gr = ce('div', { className: 'ss-grid', style: 'grid-template-columns:60px repeat(10,1fr)' });
    const cells = {};
    const get = (r, c) => {
      const v = cells[`${r},${c}`]?.value || '';
      if (v.startsWith('=')) { try { return eval(v.slice(1)) || 0; } catch (e) { return '#ERR'; } }
      return v;
    };
    for (let r = 0; r < 15; r++) {
      gr.appendChild(ce('div', { className: 'ss-cell', textContent: r || '', style: r ? '' : 'background:var(--accent)' }));
      for (let c = 1; c <= 10; c++) {
        if (r === 0) {
          gr.appendChild(ce('div', { className: 'ss-cell', textContent: String.fromCharCode(64 + c), style: 'background:var(--accent)' }));
        } else {
          const inp = ce('input', { className: 'ss-cell' });
          inp.onchange = e => { cells[`${r},${c}`] = { value: e.target.value }; if (e.target.value.startsWith('=')) e.target.value = get(r, c); };
          gr.appendChild(inp);
        }
      }
    }
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [gr]));
  }
}

class FortuneCookie extends App {
  constructor() {
    super();
    this.name = 'Fortune';
    this.icon = '🥠';
    this.cat = 'Accessories';
  }
  init(w) {
    const fortunes = [
      'A journey of a thousand miles begins with a single click.',
      'There is no place like 127.0.0.1',
      'With great power comes great electricity bills.',
      'Your focus determines your reality.',
      'The code is strong with this one.',
      'Debugging is twice as hard as writing the code.',
      'It works on my machine.'
    ];
    const out = ce('div', { style: 'text-align:center;padding:40px;font-size:18px' });
    const d = ce('div', { style: 'text-align:center' });
    d.append(out, ce('button', {
      textContent: 'Open Cookie',
      style: 'padding:12px 24px;font-size:18px;background:var(--highlight);border:none;color:#fff;border-radius:8px;cursor:pointer',
      onclick: () => out.textContent = fortunes[Math.floor(Math.random() * fortunes.length)]
    }));
    w.body.innerHTML = '';
    w.body.appendChild(d);
  }
}

class TextToSpeech extends App {
  constructor() {
    super();
    this.name = 'TTS';
    this.icon = '🔊';
    this.cat = 'Accessories';
  }
  init(w) {
    const ta = ce('textarea', { style: 'width:100%;height:120px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;border-radius:4px', placeholder: 'Enter text to speak...' });
    const btn = ce('button', { textContent: '🔊 Speak', style: 'padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer;margin-top:8px' });
    btn.onclick = () => { const u = new SpeechSynthesisUtterance(ta.value); speechSynthesis.speak(u); };
    w.body.innerHTML = '';
    w.body.appendChild(ce('div', { style: 'height:100%' }, [ta, btn]));
  }
}
