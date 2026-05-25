/* =============================================
   utilities.js — Utility Apps
   RandomNumber, DiceRoller, CoinFlip,
   RockPaperScissors, BMICalc, AgeCalc,
   LoanCalc, TipCalc, PercentageCalc,
   MusicPlayer, VideoPlayer, Camera, VoiceRecorder
   ============================================= */

class RandomNumber extends App {
  constructor() { super(); this.name='Random'; this.icon='🎲'; this.cat='Utilities'; }
  init(w) {
    let min=1,max=100;
    const out=ce('div',{className:'rn-out',textContent:'?'});
    const d=ce('div',{style:'text-align:center'});
    d.append(out,
      ce('div',{style:'display:flex;gap:8px;justify-content:center;margin:16px 0'},[
        ce('input',{type:'number',value:1,style:'width:80px',onchange:e=>min=parseInt(e.target.value)}),
        ce('span',{textContent:'to'}),
        ce('input',{type:'number',value:100,style:'width:80px',onchange:e=>max=parseInt(e.target.value)})
      ]),
      ce('button',{textContent:'Generate',style:'padding:12px 24px;font-size:18px;background:var(--highlight);border:none;color:#fff;border-radius:8px;cursor:pointer',onclick:()=>out.textContent=Math.floor(Math.random()*(max-min+1))+min})
    );
    w.body.innerHTML='';w.body.appendChild(d);
  }
}

class DiceRoller extends App {
  constructor() { super(); this.name='Dice'; this.icon='🎲'; this.cat='Utilities'; }
  init(w) {
    const out=ce('div',{className:'dc-out',textContent:'🎲'});
    let n=1;
    const roll=()=>{const r=[];for(let i=0;i<n;i++)r.push(Math.floor(Math.random()*6)+1);out.textContent=r.map(x=>['⚀','⚁','⚂','⚃','⚄','⚅'][x-1]).join(' ');};
    const d=ce('div',{style:'text-align:center'});
    d.append(out,
      ce('div',{style:'margin:16px 0'},[ce('label',{textContent:'Dice: '}),ce('input',{type:'range',min:1,max:6,value:1,onchange:e=>{n=parseInt(e.target.value);roll();}})]),
      ce('button',{textContent:'Roll',style:'padding:12px 24px;font-size:18px;background:var(--highlight);border:none;color:#fff;border-radius:8px;cursor:pointer',onclick:roll})
    );
    w.body.innerHTML='';w.body.appendChild(d);
  }
}

/* FIX: `Math.random()<<.5` corrected to `Math.random()<.5` */
class CoinFlip extends App {
  constructor() { super(); this.name='Coin'; this.icon='🪙'; this.cat='Utilities'; }
  init(w) {
    const out=ce('div',{style:'font-size:64px;text-align:center;margin:20px 0',textContent:'🪙'});
    const stats=ce('div',{style:'text-align:center;color:#aaa'});
    let h=0,t=0;
    const d=ce('div',{style:'text-align:center'});
    d.append(out,stats,ce('button',{textContent:'Flip',style:'padding:12px 24px;font-size:18px;background:var(--highlight);border:none;color:#fff;border-radius:8px;cursor:pointer',onclick:()=>{
      const r=Math.random()<.5?'Heads':'Tails';
      out.textContent=r==='Heads'?'👑':'🦅';
      if(r==='Heads')h++;else t++;
      stats.textContent=`Heads: ${h} | Tails: ${t}`;
    }}));
    w.body.innerHTML='';w.body.appendChild(d);
  }
}

/* FIX: `this.icon:'✊'` → `this.icon='✊'`, `<<br>` → `<br>` */
class RockPaperScissors extends App {
  constructor() { super(); this.name='RPS'; this.icon='✊'; this.cat='Utilities'; }
  init(w) {
    const opts=[['✊','Rock'],['✋','Paper'],['✌️','Scissors']];
    let wins=0,l=0,d2=0;
    const res=ce('div',{className:'rp-res'});
    const d=ce('div');
    const btns=ce('div',{className:'rp-bt'});
    opts.forEach(([ic,nm])=>{
      btns.appendChild(ce('button',{textContent:ic,onclick:()=>{
        const c=opts[Math.floor(Math.random()*3)];const p=[ic,nm];let r;
        if(p[1]===c[1])r='Draw';
        else if((p[1]==='Rock'&&c[1]==='Scissors')||(p[1]==='Paper'&&c[1]==='Rock')||(p[1]==='Scissors'&&c[1]==='Paper')){r='You Win!';wins++;}
        else{r='You Lose!';l++;}
        res.innerHTML=`You: ${p[0]} vs CPU: ${c[0]}<br><b>${r}</b><br><small>W: ${wins} L: ${l} D: ${d2}</small>`;
      }}));
    });
    d.append(btns,res);
    w.body.innerHTML='';w.body.appendChild(d);
  }
}

/* FIX: `b<<18.5` → `b<18.5`, `b<<25` → `b<25`, `b<<30` → `b<30` */
class BMICalc extends App {
  constructor() { super(); this.name='BMI'; this.icon='⚕️'; this.cat='Utilities'; }
  init(w) {
    let h=170,wt=70;
    const out=ce('div',{className:'bmi-res',textContent:'22.5'});
    const cat=ce('div',{className:'bmi-cat',textContent:'Normal weight'});
    const d=ce('div',{style:'text-align:center'});
    const calc=()=>{
      const b=(wt/((h/100)**2)).toFixed(1);
      out.textContent=b;
      cat.textContent=b<18.5?'Underweight':b<25?'Normal weight':b<30?'Overweight':'Obese';
    };
    d.append(
      ce('div',{textContent:`Height: ${h} cm`}),
      ce('input',{type:'range',min:100,max:250,value:170,className:'bmi-sli',oninput:e=>{h=parseInt(e.target.value);e.target.previousSibling.textContent=`Height: ${h} cm`;calc();}}),
      ce('div',{textContent:`Weight: ${wt} kg`}),
      ce('input',{type:'range',min:30,max:200,value:70,className:'bmi-sli',oninput:e=>{wt=parseInt(e.target.value);e.target.previousSibling.textContent=`Weight: ${wt} kg`;calc();}}),
      out,cat
    );
    calc();
    w.body.innerHTML='';w.body.appendChild(d);
  }
}

/* FIX: `m<<0` → `m<0`, `n.getDate()<<b.getDate()` → `<` */
class AgeCalc extends App {
  constructor() { super(); this.name='Age'; this.icon='📅'; this.cat='Utilities'; }
  init(w) {
    const inp=ce('input',{type:'date',style:'padding:8px;background:var(--bg);border:1px solid var(--border);color:var(--fg);border-radius:4px'});
    const out=ce('div',{style:'text-align:center;margin-top:20px;font-size:18px'});
    const calc=()=>{
      if(!inp.value)return;
      const b=new Date(inp.value),n=new Date();
      let y=n.getFullYear()-b.getFullYear();
      let m=n.getMonth()-b.getMonth();
      if(m<0||(m===0&&n.getDate()<b.getDate()))y--;
      const d=Math.floor((n-b)/(1000*60*60*24));
      out.innerHTML=`Age: <b>${y}</b> years<br>Days lived: ${d}`;
    };
    inp.onchange=calc;
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center;padding:40px'},[ce('div',{textContent:'Enter birth date:'}),inp,out]));
  }
}

/* FIX: `<<br>Interest` → `<br>Interest` */
class LoanCalc extends App {
  constructor() { super(); this.name='Loan'; this.icon='💰'; this.cat='Utilities'; }
  init(w) {
    const p=ce('input',{type:'number',value:100000,placeholder:'Principal'});
    const r=ce('input',{type:'number',value:5,placeholder:'Rate %'});
    const t=ce('input',{type:'number',value:10,placeholder:'Years'});
    const out=ce('div',{style:'margin-top:16px;padding:16px;background:var(--bg);border-radius:8px'});
    const calc=()=>{
      const P=parseFloat(p.value),R=parseFloat(r.value)/100/12,N=parseFloat(t.value)*12;
      const emi=P*R*(1+R)**N/((1+R)**N-1);const tot=emi*N;
      out.innerHTML=`EMI: <b>$${emi.toFixed(2)}</b><br>Total: $${tot.toFixed(2)}<br>Interest: $${(tot-P).toFixed(2)}`;
    };
    [p,r,t].forEach(x=>x.oninput=calc);
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'padding:20px'},[ce('div',{textContent:'Principal'}),p,ce('div',{textContent:'Rate (%)'}),r,ce('div',{textContent:'Years'}),t,out]));
  }
}

/* FIX: all `<<br>` in innerHTML corrected to `<br>` */
class TipCalc extends App {
  constructor() { super(); this.name='Tip'; this.icon='💵'; this.cat='Utilities'; }
  init(w) {
    const amt=ce('input',{type:'number',value:100,placeholder:'Amount'});
    const tip=ce('input',{type:'range',min:0,max:50,value:15});
    const split=ce('input',{type:'number',value:1,min:1});
    const out=ce('div',{style:'margin-top:16px;padding:16px;background:var(--bg);border-radius:8px;font-size:18px'});
    const calc=()=>{
      const a=parseFloat(amt.value)||0,t=parseInt(tip.value),s=parseInt(split.value)||1;
      const tot=a*(1+t/100);
      out.innerHTML=`Tip (${t}%): $${(a*t/100).toFixed(2)}<br>Total: $${tot.toFixed(2)}<br>Per person: $${(tot/s).toFixed(2)}`;
    };
    [amt,tip,split].forEach(x=>x.oninput=calc);
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'padding:20px'},[ce('div',{textContent:'Bill Amount'}),amt,ce('div',{textContent:'Tip: 15%'}),tip,ce('div',{textContent:'Split by'}),split,out]));
  }
}

class PercentageCalc extends App {
  constructor() { super(); this.name='Percent'; this.icon='%'; this.cat='Utilities'; }
  init(w) {
    const a=ce('input',{type:'number',placeholder:'Value'});
    const b=ce('input',{type:'number',placeholder:'Total'});
    const out=ce('div',{style:'margin-top:16px;padding:16px;background:var(--bg);border-radius:8px;font-size:24px;text-align:center'});
    const calc=()=>{const v=parseFloat(a.value),t=parseFloat(b.value);if(t)out.textContent=((v/t)*100).toFixed(2)+'%';};
    [a,b].forEach(x=>x.oninput=calc);
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'padding:20px'},[ce('div',{textContent:'Part'}),a,ce('div',{textContent:'Whole'}),b,out]));
  }
}

/* FIX: `i<<30` corrected to `i<30` */
class MusicPlayer extends App {
  constructor() { super(); this.name='Music'; this.icon='🎵'; this.cat='Multimedia'; }
  init(w) {
    let cur=null,pl=[],idx=0;
    const aud=ce('audio',{controls:true,style:'width:100%'});
    const vis=ce('canvas',{className:'mu-vis'});
    const lst=ce('div',{className:'mu-lst'});
    const vctx=vis.getContext('2d');
    const inp=ce('input',{type:'file',accept:'audio/*',multiple:true,style:'display:none'});
    inp.onchange=e=>{[...e.target.files].forEach(f=>{const u=URL.createObjectURL(f);pl.push({name:f.name,url:u});render();});};
    const render=()=>{lst.innerHTML='';pl.forEach((t,i)=>{const r=ce('div',{textContent:t.name,className:i===idx?'pl':''});r.onclick=()=>play(i);lst.appendChild(r);});};
    const play=i=>{idx=i;cur=pl[i];aud.src=cur.url;aud.play();render();};
    const draw=()=>{
      vctx.fillStyle='#0a0a14';vctx.fillRect(0,0,vis.width,vis.height);
      vctx.fillStyle='#e94560';
      for(let i=0;i<30;i++){const h=Math.random()*vis.height;vctx.fillRect(i*10,vis.height-h,8,h);}
      requestAnimationFrame(draw);
    };
    draw();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'mu-pl'},[
      ce('div',{style:'display:flex;gap:8px'},[
        ce('button',{textContent:'📂 Open',onclick:()=>inp.click()}),
        ce('button',{textContent:'⏮',onclick:()=>play(Math.max(0,idx-1))}),
        ce('button',{textContent:'⏭',onclick:()=>play(Math.min(pl.length-1,idx+1))})
      ]),aud,vis,lst
    ]));
  }
}

/* FIX: `this.cat:'Multimedia'` corrected to `this.cat='Multimedia'` */
class VideoPlayer extends App {
  constructor() { super(); this.name='Video'; this.icon='🎬'; this.cat='Multimedia'; }
  init(w) {
    const vid=ce('video',{controls:true,style:'max-width:100%;max-height:70vh;border-radius:8px'});
    const inp=ce('input',{type:'file',accept:'video/*',style:'display:none'});
    inp.onchange=e=>{const f=e.target.files[0];if(f)vid.src=URL.createObjectURL(f);};
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[
      ce('button',{textContent:'📂 Open Video',style:'padding:8px 16px;background:var(--highlight);border:none;color:#fff;border-radius:4px;cursor:pointer;margin-bottom:12px',onclick:()=>inp.click()}),
      inp,vid
    ]));
  }
}

class Camera extends App {
  constructor() { super(); this.name='Camera'; this.icon='📷'; this.cat='Multimedia'; }
  init(w) {
    const v=ce('video',{className:'ca-vid',autoplay:true});
    const c=ce('canvas',{width:320,height:240,style:'display:none'});
    let st=null;
    navigator.mediaDevices?.getUserMedia({video:true}).then(s=>{st=s;v.srcObject=s;}).catch(()=>{v.style.background='#333';});
    const gal=ce('div',{style:'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap'});
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'ca-pl'},[v,
      ce('div',{style:'display:flex;gap:8px;justify-content:center'},[
        ce('button',{textContent:'📸 Snap',onclick:()=>{const x=c.getContext('2d');x.drawImage(v,0,0,320,240);const img=ce('img',{src:c.toDataURL(),style:'width:80px;height:60px;object-fit:cover;border-radius:4px'});gal.appendChild(img);}}),
        ce('button',{textContent:'🛑 Stop',onclick:()=>st?.getTracks().forEach(t=>t.stop())})
      ]),gal
    ]));
  }
}

/* FIX: `i<<20` corrected to `i<20`, `this.cat:'Multimedia'` → `=` */
class VoiceRecorder extends App {
  constructor() { super(); this.name='Recorder'; this.icon='🎙️'; this.cat='Multimedia'; }
  init(w) {
    let mr=null,chunks=[];
    const aud=ce('audio',{controls:true,style:'width:100%'});
    const vis=ce('canvas',{className:'vo-vis'});
    const ctx=vis.getContext('2d');
    let anim;
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,vis.width,vis.height);
      ctx.fillStyle='#2ecc71';
      for(let i=0;i<20;i++){ctx.fillRect(i*8,vis.height-Math.random()*vis.height,6,Math.random()*vis.height);}
      anim=requestAnimationFrame(draw);
    };
    draw();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'vo-rec'},[vis,
      ce('div',{style:'display:flex;gap:8px;justify-content:center'},[
        ce('button',{textContent:'⏺️ Record',onclick:async()=>{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});mr=new MediaRecorder(s);chunks=[];mr.ondataavailable=e=>chunks.push(e.data);mr.onstop=()=>{const b=new Blob(chunks,{type:'audio/ogg'});aud.src=URL.createObjectURL(b);};mr.start();}catch(e){alert('Mic access denied');}}}),
        ce('button',{textContent:'⏹️ Stop',onclick:()=>{mr?.stop();cancelAnimationFrame(anim);vis.getContext('2d').clearRect(0,0,vis.width,vis.height);}})
      ]),aud
    ]));
  }
}
