/* =============================================
   graphics.js — Graphics Apps
   PaintApp, DrawingBoard, ImageViewer,
   FractalViewer, ColorPalette, AudioVisualizer
   ============================================= */

class PaintApp extends App {
  constructor() { super(); this.name='Paint'; this.icon='🖼️'; this.cat='Graphics'; }
  init(w) {
    let color='#000',size=3,tool='brush';
    const cvs=ce('canvas',{className:'paint-cvs',width:640,height:400});
    const ctx=cvs.getContext('2d');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,640,400);
    let draw=false;
    const tools=ce('div',{className:'paint-tools'},[
      ce('button',{textContent:'🖌️',onclick:()=>tool='brush'}),
      ce('button',{textContent:'⬛',onclick:()=>tool='rect'}),
      ce('button',{textContent:'⭕',onclick:()=>tool='circle'}),
      ce('button',{textContent:'✏️ Line',onclick:()=>tool='line'}),
      ce('button',{textContent:'🪣 Fill',onclick:()=>tool='fill'}),
      ce('button',{textContent:'🧽',onclick:()=>tool='eraser'}),
      ce('input',{type:'color',value:'#000000',onchange:e=>color=e.target.value}),
      ce('input',{type:'range',min:1,max:50,value:3,onchange:e=>size=e.target.value}),
      ce('button',{textContent:'💾 Save',onclick:()=>{const a=document.createElement('a');a.download='paint.png';a.href=cvs.toDataURL();a.click();}}),
      ce('button',{textContent:'🗑️ Clear',onclick:()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,640,400);}})
    ]);
    let sx,sy,img;
    const getPos=e=>{const r=cvs.getBoundingClientRect();return[(e.clientX||e.touches?.[0].clientX)-r.left,(e.clientY||e.touches?.[0].clientY)-r.top];};
    cvs.onmousedown=e=>{draw=true;const[x,y]=getPos(e);sx=x;sy=y;img=ctx.getImageData(0,0,640,400);if(tool==='fill'){ctx.fillStyle=color;ctx.fillRect(0,0,640,400);}};
    cvs.onmousemove=e=>{
      if(!draw)return;const[x,y]=getPos(e);
      if(tool==='brush'||tool==='eraser'){ctx.beginPath();ctx.strokeStyle=tool==='eraser'?'#fff':color;ctx.lineWidth=size;ctx.lineCap='round';ctx.moveTo(sx,sy);ctx.lineTo(x,y);ctx.stroke();sx=x;sy=y;}
      else{ctx.putImageData(img,0,0);ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=size;if(tool==='rect')ctx.strokeRect(sx,sy,x-sx,y-sy);else if(tool==='circle'){const r=Math.hypot(x-sx,y-sy);ctx.arc(sx,sy,r,0,Math.PI*2);ctx.stroke();}else if(tool==='line'){ctx.moveTo(sx,sy);ctx.lineTo(x,y);ctx.stroke();}}
    };
    cvs.onmouseup=()=>draw=false;cvs.onmouseleave=()=>draw=false;
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'height:100%'},[tools,cvs]));
  }
}

class DrawingBoard extends App {
  constructor() { super(); this.name='Whiteboard'; this.icon='✏️'; this.cat='Graphics'; }
  init(w) {
    const cvs=ce('canvas',{width:800,height:500,style:'background:#fff;border-radius:4px;cursor:crosshair'});
    const ctx=cvs.getContext('2d');
    let draw=false;
    const tools=ce('div',{className:'paint-tools'},[
      ce('input',{type:'color',value:'#000000',onchange:e=>ctx.strokeStyle=e.target.value}),
      ce('input',{type:'range',min:1,max:20,value:3,onchange:e=>ctx.lineWidth=e.target.value}),
      ce('button',{textContent:'💾 Save',onclick:()=>{const a=document.createElement('a');a.download='whiteboard.png';a.href=cvs.toDataURL();a.click();}}),
      ce('button',{textContent:'🗑️ Clear',onclick:()=>ctx.clearRect(0,0,800,500)})
    ]);
    let lx,ly;
    cvs.onmousedown=e=>{draw=true;const r=cvs.getBoundingClientRect();lx=e.clientX-r.left;ly=e.clientY-r.top;};
    cvs.onmousemove=e=>{
      if(!draw)return;const r=cvs.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;
      ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y;
    };
    cvs.onmouseup=()=>draw=false;cvs.onmouseleave=()=>draw=false;
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'height:100%'},[tools,cvs]));
  }
}

class ImageViewer extends App {
  constructor() { super(); this.name='Images'; this.icon='🖼️'; this.cat='Graphics'; }
  init(w) {
    const img=ce('img',{style:'max-width:100%;max-height:60vh;border-radius:8px'});
    const inp=ce('input',{type:'file',accept:'image/*',style:'display:none'});
    inp.onchange=e=>{const f=e.target.files[0];if(f)img.src=URL.createObjectURL(f);};
    const btns=ce('div',{style:'display:flex;gap:8px;justify-content:center;margin-top:12px'},[
      ce('button',{textContent:'📂 Open',onclick:()=>inp.click()}),
      ce('button',{textContent:'↩️ Rotate',onclick:()=>{img.style.transform=`rotate(${((parseInt(img.dataset.rot)||0)+90)}deg)`;img.dataset.rot=(parseInt(img.dataset.rot)||0)+90;}}),
      ce('button',{textContent:'🌑 B&W',onclick:()=>img.style.filter=img.style.filter?'':'grayscale(100%)'})
    ]);
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[inp,img,btns]));
  }
}

/* FIX: `px<<400` → `px<400`, `py<<400` → `py<400`, `i<<80` → `i<80` */
class FractalViewer extends App {
  constructor() { super(); this.name='Fractal'; this.icon='🔮'; this.cat='Graphics'; }
  init(w) {
    const cvs=ce('canvas',{width:400,height:400,style:'border-radius:4px'});
    const ctx=cvs.getContext('2d');
    const img=ctx.createImageData(400,400);
    const draw=()=>{
      for(let px=0;px<400;px++){
        for(let py=0;py<400;py++){
          const x0=(px-200)/100,y0=(py-200)/100;
          let x=0,y=0,i=0;
          while(x*x+y*y<=4&&i<80){const xt=x*x-y*y+x0;y=2*x*y+y0;x=xt;i++;}
          const p=(py*400+px)*4;
          const c=i<80?i*3:0;
          img.data[p]=c;img.data[p+1]=c/2;img.data[p+2]=i===80?0:255;img.data[p+3]=255;
        }
      }
      ctx.putImageData(img,0,0);
    };
    draw();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[cvs]));
  }
}

class ColorPalette extends App {
  constructor() { super(); this.name='Palette'; this.icon='🎨'; this.cat='Graphics'; }
  init(w) {
    const base=['#e94560','#0f3460','#16213e','#1a1a2e','#2ecc71','#f1c40f','#e67e22','#9b59b6'];
    const d=ce('div');
    d.appendChild(ce('div',{textContent:'Click to copy:',style:'margin-bottom:8px'}));
    const g=ce('div',{style:'display:grid;grid-template-columns:repeat(4,1fr);gap:8px'});
    base.forEach(c=>{
      const b=ce('div',{style:`background:${c};height:60px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px`,textContent:c});
      b.onclick=()=>navigator.clipboard.writeText(c);
      g.appendChild(b);
    });
    d.appendChild(g);
    w.body.innerHTML='';
    w.body.appendChild(d);
  }
}

/* FIX: `i<<50` corrected to `i<50` */
class AudioVisualizer extends App {
  constructor() { super(); this.name='Visualizer'; this.icon='📊'; this.cat='Multimedia'; }
  init(w) {
    const cvs=ce('canvas',{width:600,height:200,style:'width:100%;background:var(--bg);border-radius:4px'});
    const ctx=cvs.getContext('2d');
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,600,200);
      ctx.fillStyle='#e94560';
      for(let i=0;i<50;i++){const h=Math.random()*150+20;ctx.fillRect(i*12,200-h,10,h);}
      requestAnimationFrame(draw);
    };
    draw();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[cvs,ce('div',{textContent:'Simulated audio visualization'})]));
  }
}
