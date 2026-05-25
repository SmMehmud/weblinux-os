/* =============================================
   internet.js — Internet & Communication Apps
   Weather, WeatherForecast, ChatApp, EmailApp,
   TranslatorApp, RSSReader, WikiSearch, IPLookup
   ============================================= */

class Weather extends App {
  constructor() { super(); this.name='Weather'; this.icon='🌤️'; this.cat='Internet'; }
  init(w) {
    const inp=ce('input',{type:'text',value:'London',placeholder:'City name...',style:'padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px'});
    const btn=ce('button',{textContent:'Search',style:'padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer;margin-left:8px'});
    const res=ce('div');
    const mock=city=>{const h=city.split('').reduce((a,c)=>a+c.charCodeAt(0),0);const t=Math.floor(h%35)-5;const conds=['Sunny','Cloudy','Rainy','Stormy','Snowy','Partly Cloudy'];return{temp:t,condition:conds[h%conds.length],humidity:40+h%60,wind:5+h%25};};
    const show=()=>{const c=inp.value||'London';const m=mock(c);res.innerHTML=`<div class="we-tmp">${m.temp}°C</div><div class="we-det">${m.condition} • Humidity ${m.humidity}% • Wind ${m.wind} km/h</div><div class="we-fc">${[1,2,3,4,5].map(i=>`<div><div>Day ${i}</div><div>${Math.floor(m.temp+Math.random()*6-3)}°</div></div>`).join('')}</div>`;};
    btn.onclick=show;show();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[inp,btn,res]));
  }
}

class WeatherForecast extends App {
  constructor() { super(); this.name='Forecast'; this.icon='🌦️'; this.cat='Internet'; }
  init(w) {
    const inp=ce('input',{type:'text',value:'Tokyo',placeholder:'City',style:'padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px'});
    const btn=ce('button',{textContent:'Get',style:'padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer;margin-left:8px'});
    const res=ce('div',{style:'margin-top:16px'});
    btn.onclick=()=>{const c=inp.value;const h=c.split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);const base=Math.floor(h%30)-5;res.innerHTML=`<div class="we-tmp">${base}°C</div><div style="text-align:center;color:#aaa">${['Sunny','Cloudy','Rainy'][h%3]}</div><div class="we-fc">${Array.from({length:5},(_,i)=>`<div><div>Day ${i+1}</div><div>${base+Math.floor(Math.random()*6-3)}°</div></div>`).join('')}</div>`;};
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[inp,btn,res]));
  }
}

class ChatApp extends App {
  constructor() { super(); this.name='Chat'; this.icon='💬'; this.cat='Internet'; }
  init(w) {
    const msgs=ce('div',{className:'chat-msgs'});
    const add=(t,bot=false)=>msgs.appendChild(ce('div',{className:'chat-bub '+(bot?'b':'u'),textContent:t}));
    add('Hello! How can I help you?',true);
    const inp=ce('div',{className:'chat-inp'},[
      ce('input',{type:'text',placeholder:'Type a message...'}),
      ce('button',{textContent:'Send',onclick:send})
    ]);
    const i=inp.querySelector('input');
    i.onkeydown=e=>e.key==='Enter'&&send();
    function send(){
      const t=i.value.trim();if(!t)return;add(t);i.value='';
      setTimeout(()=>{const r=['Interesting!','Tell me more.','I agree.','That sounds great!','Could you elaborate?'][Math.floor(Math.random()*5)];add(r,true);msgs.scrollTop=msgs.scrollHeight;},800);
    }
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'height:100%;display:flex;flex-direction:column'},[msgs,inp]));
  }
}

class EmailApp extends App {
  constructor() { super(); this.name='Email'; this.icon='📧'; this.cat='Internet'; }
  init(w) {
    let view='inbox';
    const d=ce('div',{style:'height:100%;display:flex;flex-direction:column'});
    const emails=[
      {from:'admin@weblinux.local',sub:'Welcome',body:'Welcome to WebLinux Mail!',date:'Today'},
      {from:'news@weblinux.local',sub:'Updates',body:'Check out the new features.',date:'Yesterday'}
    ];
    const r=()=>{
      d.innerHTML='';
      if(view==='inbox'){
        const lst=ce('div',{className:'em-lst'});
        emails.forEach((e)=>{
          const r2=ce('div',{className:'em-row'});
          r2.innerHTML=`<div class="s1">${e.from}</div><div class="s2">${e.sub}</div>`;
          r2.onclick=()=>{view='read';d.innerHTML='';d.append(ce('div',{style:'margin-bottom:12px'},[ce('button',{textContent:'← Back',onclick:()=>{view='inbox';r();}})]),ce('h3',{textContent:e.sub}),ce('div',{style:'color:#aaa;font-size:12px;margin-bottom:8px',textContent:`From: ${e.from} • ${e.date}`}),ce('div',{textContent:e.body}));};
          lst.appendChild(r2);
        });
        d.appendChild(ce('div',{style:'display:flex;gap:8px;margin-bottom:8px'},[ce('button',{textContent:'✏️ Compose',onclick:()=>{view='compose';r();}})]));
        d.appendChild(lst);
      } else if(view==='compose'){
        const c=ce('div',{className:'em-compose'});
        ['To','Subject'].forEach(l=>c.appendChild(ce('input',{placeholder:l})));
        const b=ce('textarea',{placeholder:'Message...'});
        c.append(b,ce('button',{textContent:'Send',onclick:()=>{alert('Sent!');view='inbox';r();}}),ce('button',{textContent:'Cancel',onclick:()=>{view='inbox';r();}}));
        d.appendChild(c);
      }
    };
    r();
    w.body.innerHTML='';
    w.body.appendChild(d);
  }
}

/* FIX: `this.icon:'🌐'` corrected to `this.icon='🌐'` */
class TranslatorApp extends App {
  constructor() { super(); this.name='Translate'; this.icon='🌐'; this.cat='Internet'; }
  init(w) {
    const inp=ce('textarea',{style:'width:100%;height:100px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;border-radius:4px',placeholder:'Enter text...'});
    const out=ce('textarea',{style:'width:100%;height:100px;background:var(--bg);border:1px solid var(--border);color:var(--fg);padding:8px;border-radius:4px',readOnly:true});
    const btn=ce('button',{textContent:'Translate',style:'margin:8px 0;padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer'});
    btn.onclick=()=>{const t=inp.value.toLowerCase();const dict={hello:'bonjour/hola',world:'monde/mundo',computer:'ordinateur/computadora',love:'amour/amor'};out.value=dict[t]||`[Mock translation of "${t}"]`;};
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'height:100%'},[inp,btn,out]));
  }
}

class RSSReader extends App {
  constructor() { super(); this.name='RSS'; this.icon='📰'; this.cat='Internet'; }
  init(w) {
    const d=ce('div');
    const feeds=[
      {title:'WebLinux Blog',items:[{t:'Version 1.0 Released',d:'WebLinux is now available with 70+ apps.'},{t:'New Games Added',d:'Tetris, Snake, and more classic games.'}]},
      {title:'Tech News',items:[{t:'Web OS Trends',d:'Browser-based operating systems are growing.'},{t:'HTML5 Power',d:'Modern web apps rival desktop software.'}]}
    ];
    feeds.forEach(f=>{
      d.appendChild(ce('h3',{style:'margin:12px 0 8px;color:var(--highlight)',textContent:f.title}));
      f.items.forEach(it=>{const r=ce('div',{className:'rs-item'});r.innerHTML=`<h4>${it.t}</h4><p>${it.d}</p>`;d.appendChild(r);});
    });
    w.body.innerHTML='';
    w.body.appendChild(d);
  }
}

class WikiSearch extends App {
  constructor() { super(); this.name='Wikipedia'; this.icon='📚'; this.cat='Internet'; }
  init(w) {
    const inp=ce('input',{type:'text',value:'Linux',placeholder:'Search...',style:'padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px'});
    const btn=ce('button',{textContent:'Search',style:'padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer;margin-left:8px'});
    const res=ce('div',{className:'wk-res'});
    btn.onclick=()=>{
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(inp.value)}`)
        .then(r=>r.json())
        .then(d=>{res.innerHTML=`<h3>${d.title}</h3><p>${d.extract||'No summary available.'}</p>${d.thumbnail?`<img src="${d.thumbnail.source}">`:''}`; })
        .catch(()=>res.innerHTML='<p>Error loading article.</p>');
    };
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'height:100%'},[ce('div',{style:'display:flex;margin-bottom:12px'},[inp,btn]),res]));
  }
}

/* FIX: `this.name:'IP Lookup'` corrected to `this.name='IP Lookup'` */
class IPLookup extends App {
  constructor() { super(); this.name='IP Lookup'; this.icon='🌐'; this.cat='Internet'; }
  init(w) {
    const d=ce('div',{className:'ip-inf'});
    fetch('https://api.ipify.org?format=json')
      .then(r=>r.json())
      .then(j=>{d.innerHTML=`<div class="ip">${j.ip}</div><div style="color:#aaa;margin-top:8px">Your public IP address</div>`;})
      .catch(()=>{d.innerHTML=`<div class="ip">127.0.0.1</div><div style="color:#aaa;margin-top:8px">Local mode (offline)</div>`;});
    w.body.innerHTML='';
    w.body.appendChild(d);
  }
}
