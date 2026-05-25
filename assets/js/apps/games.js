/* =============================================
   games.js — All Game Apps
   Minesweeper, Snake, Tetris, Pong, TicTacToe,
   MemoryGame, Sudoku, Chess, WordGuess, Game2048,
   FlappyBird, DinoRun, SpaceShooter, Breakout,
   MazeGame, PingPong
   ============================================= */

class Minesweeper extends App {
  constructor() { super(); this.name='Minesweeper'; this.icon='💣'; this.cat='Games'; }
  init(w) {
    let size=10,mines=15,board=[],rev=[],fl=[],game=true;
    const hd=ce('div',{className:'ms-head'});
    const gr=ce('div',{className:'ms-grid',style:`grid-template-columns:repeat(${size},28px)`});
    const init=()=>{
      board=Array(size*size).fill(0);rev=[];fl=[];game=true;
      for(let i=0;i<mines;){const p=Math.floor(Math.random()*size*size);if(board[p]!=='M'){board[p]='M';i++;}}
      for(let i=0;i<size*size;i++){if(board[i]==='M')continue;let c=0;[-1,0,1].forEach(dx=>[-1,0,1].forEach(dy=>{if(dx===0&&dy===0)return;const x=(i%size)+dx,y=Math.floor(i/size)+dy;if(x>=0&&x<size&&y>=0&&y<size&&board[y*size+x]==='M')c++;}));board[i]=c;}
      r();
    };
    const r=()=>{
      gr.innerHTML='';hd.innerHTML='';let fc=0;
      for(let i=0;i<size*size;i++){
        const c=ce('div',{className:'ms-cell'});
        if(rev.includes(i)){c.classList.add('revealed');c.textContent=board[i]||'';if(board[i]==='M')c.textContent='💥';if(board[i]>0)c.style.color=['','blue','green','red','purple','maroon','turquoise','black','gray'][board[i]];}
        else{
          if(fl.includes(i)){c.classList.add('flagged');fc++;}
          c.onclick=()=>{if(!game||fl.includes(i))return;if(board[i]==='M'){game=false;rev=Array.from({length:size*size},(_,j)=>j);r();alert('Game Over!');}else{rev.push(i);if(board[i]===0){const q=[i];while(q.length){const c2=q.pop();[-1,0,1].forEach(dx=>[-1,0,1].forEach(dy=>{if(dx===0&&dy===0)return;const x=(c2%size)+dx,y=Math.floor(c2/size)+dy,ni=y*size+x;if(x>=0&&x<size&&y>=0&&y<size&&!rev.includes(ni)&&!fl.includes(ni)){rev.push(ni);if(board[ni]===0)q.push(ni);}}));}}if(rev.length===size*size-mines){game=false;alert('You Win!');}r();}};
          c.oncontextmenu=e=>{e.preventDefault();if(!game||rev.includes(i))return;if(fl.includes(i))fl=fl.filter(x=>x!==i);else fl.push(i);r();};
        }
        gr.appendChild(c);
      }
      hd.appendChild(ce('span',{textContent:`💣 ${mines-fc}`}));
      hd.appendChild(ce('span',{textContent:game?'Playing':'Done'}));
    };
    init();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[hd,gr,ce('div',{style:'margin-top:8px'},[
      ce('button',{textContent:'Easy',onclick:()=>{size=8;mines=10;init();}}),
      ce('button',{textContent:'Medium',onclick:()=>{size=10;mines=15;init();}}),
      ce('button',{textContent:'Hard',onclick:()=>{size=16;mines=40;init();}})
    ])]));
  }
}

class Snake extends App {
  constructor() { super(); this.name='Snake'; this.icon='🐍'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:400,height:400});
    const ctx=cvs.getContext('2d');
    let snake=[[10,10]],dir=[1,0],food=[15,15],score=0,game=true,speed=150;
    const draw=()=>{ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,400,400);ctx.fillStyle='#e94560';ctx.fillRect(food[0]*20,food[1]*20,18,18);ctx.fillStyle='#2ecc71';snake.forEach(([x,y])=>ctx.fillRect(x*20,y*20,18,18));};
    const loop=()=>{
      if(!game)return;
      const h=[snake[0][0]+dir[0],snake[0][1]+dir[1]];
      if(h[0]<0||h[0]>=20||h[1]<0||h[1]>=20||snake.some(([x,y])=>x===h[0]&&y===h[1])){game=false;alert('Game Over! Score: '+score);return;}
      snake.unshift(h);
      if(h[0]===food[0]&&h[1]===food[1]){score+=10;food=[Math.floor(Math.random()*20),Math.floor(Math.random()*20)];}else snake.pop();
      draw();setTimeout(loop,speed);
    };
    document.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&dir[1]!==1)dir=[0,-1];if(e.key==='ArrowDown'&&dir[1]!==-1)dir=[0,1];if(e.key==='ArrowLeft'&&dir[0]!==1)dir=[-1,0];if(e.key==='ArrowRight'&&dir[0]!==-1)dir=[1,0];});
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'sn-cnt'},[
      ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,
      ce('button',{textContent:'Start',onclick:()=>{snake=[[10,10]];dir=[1,0];food=[15,15];score=0;game=true;loop();}})
    ]));
  }
}

class Tetris extends App {
  constructor() { super(); this.name='Tetris'; this.icon='🧱'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:300,height:600});
    const ctx=cvs.getContext('2d');
    const W=10,H=20,S=30;
    let board=Array(H).fill().map(()=>Array(W).fill(0)),piece=null,score=0,game=false;
    const shapes=[[[1,1,1,1]],[[1,1],[1,1]],[[1,1,1],[0,1,0]],[[1,1,1],[1,0,0]],[[1,1,1],[0,0,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
    const colors=['#e94560','#f1c40f','#2ecc71','#9b59b6','#3498db','#e67e22','#1abc9c'];
    const newPiece=()=>{const t=Math.floor(Math.random()*shapes.length);return{shape:shapes[t],color:colors[t],x:3,y:0};};
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,300,600);
      board.forEach((r,y)=>r.forEach((c,x)=>{if(c){ctx.fillStyle=c;ctx.fillRect(x*S,y*S,S-1,S-1);}}));
      if(piece)piece.shape.forEach((r,dy)=>r.forEach((c,dx)=>{if(c){ctx.fillStyle=piece.color;ctx.fillRect((piece.x+dx)*S,(piece.y+dy)*S,S-1,S-1);}}));
    };
    /* FIX: `p.x+px+dx<<0` corrected to `p.x+px+dx<0` */
    const coll=(p,dx=0,dy=0)=>p.shape.some((r,py)=>r.some((c,px)=>c&&((p.y+py+dy>=H||p.x+px+dx<0||p.x+px+dx>=W)||board[p.y+py+dy]?.[p.x+px+dx])));
    const merge=()=>{piece.shape.forEach((r,py)=>r.forEach((c,px)=>{if(c)board[piece.y+py][piece.x+px]=piece.color;}));piece=null;};
    const clear=()=>{let l=0;board=board.filter(r=>{if(r.every(c=>c)){l++;return false;}return true;});while(board.length<H)board.unshift(Array(W).fill(0));score+=l*100;};
    const drop=()=>{
      if(!piece)piece=newPiece();
      if(coll(piece,0,1)){merge();clear();if(board[0].some(c=>c)){game=false;alert('Game Over! Score: '+score);return;}piece=newPiece();}
      else piece.y++;draw();
    };
    let iv;
    const start=()=>{board=Array(H).fill().map(()=>Array(W).fill(0));piece=null;score=0;game=true;clearInterval(iv);iv=setInterval(drop,500);draw();};
    document.addEventListener('keydown',e=>{
      if(!game||!piece)return;
      if(e.key==='ArrowLeft'&&!coll(piece,-1,0))piece.x--;
      if(e.key==='ArrowRight'&&!coll(piece,1,0))piece.x++;
      if(e.key==='ArrowDown'&&!coll(piece,0,1))piece.y++;
      if(e.key==='ArrowUp'){const rot=piece.shape[0].map((_,i)=>piece.shape.map(r=>r[i]).reverse());const op={...piece,shape:rot};if(!coll(op))piece.shape=rot;}
      draw();
    });
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'tt-cnt'},[ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,ce('button',{textContent:'Start',onclick:start})]));
  }
}

/* FIX: by<0, bx<20, by<py+80, by<py2+80, bx<0 all corrected from << */
class Pong extends App {
  constructor() { super(); this.name='Pong'; this.icon='🏓'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:600,height:400});
    const ctx=cvs.getContext('2d');
    let bx=300,by=200,bdx=4,bdy=4,py=150,py2=150,sc1=0,sc2=0,game=false;
    const draw=()=>{ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,600,400);ctx.fillStyle='#fff';ctx.fillRect(10,py,10,80);ctx.fillRect(580,py2,10,80);ctx.fillRect(bx-5,by-5,10,10);ctx.fillText(`${sc1} - ${sc2}`,280,30);};
    const loop=()=>{
      if(!game)return;
      bx+=bdx;by+=bdy;
      if(by<0||by>400)bdy=-bdy;
      if(bx<20&&by>py&&by<py+80)bdx=-bdx;
      if(bx>580&&by>py2&&by<py2+80)bdx=-bdx;
      if(bx<0){sc2++;bx=300;by=200;}
      if(bx>600){sc1++;bx=300;by=200;}
      py2+=by>py2+40?4:-4;py2=Math.max(0,Math.min(320,py2));
      draw();requestAnimationFrame(loop);
    };
    cvs.onmousemove=e=>{const r=cvs.getBoundingClientRect();py=e.clientY-r.top-40;py=Math.max(0,Math.min(320,py));};
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[
      ce('div',{className:'game-info',textContent:'0 - 0'}),cvs,
      ce('button',{textContent:'Start',onclick:()=>{game=true;bx=300;by=200;sc1=0;sc2=0;loop();}})
    ]));
  }
}

class TicTacToe extends App {
  constructor() { super(); this.name='TicTacToe'; this.icon='⭕'; this.cat='Games'; }
  init(w) {
    let b=Array(9).fill(''),p='X',game=true;
    const gr=ce('div',{className:'sg-board'});
    const msg=ce('div',{style:'text-align:center;margin-top:12px;font-size:18px'});
    const check=()=>{const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];for(const[a,b2,c]of wins)if(b[a]&&b[a]===b[b2]&&b[a]===b[c])return b[a];if(b.every(x=>x))return'D';return null;};
    const r=()=>{
      gr.innerHTML='';
      b.forEach((v,i)=>{
        const c=ce('div',{className:'sg-cell',textContent:v});
        c.onclick=()=>{
          if(!game||v)return;b[i]=p;c.textContent=p;
          const win=check();
          if(win){game=false;msg.textContent=win==='D'?'Draw!':win+' wins!';return;}
          p=p==='X'?'O':'X';
          if(p==='O'){const e=b.map((x,j)=>x?-1:j).filter(x=>x>=0);if(e.length){const m=e[Math.floor(Math.random()*e.length)];b[m]='O';p='X';r();}}
        };
        gr.appendChild(c);
      });
      msg.textContent=`Turn: ${p}`;
    };
    r();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[gr,msg,ce('button',{textContent:'Reset',onclick:()=>{b=Array(9).fill('');p='X';game=true;r();}})]));
  }
}

class MemoryGame extends App {
  constructor() { super(); this.name='Memory'; this.icon='🧠'; this.cat='Games'; }
  init(w) {
    let cards=[],flipped=[],matched=0,moves=0,lock=false;
    const info=ce('div',{className:'game-info',textContent:'Moves: 0'});
    const gr=ce('div',{className:'mm-grid'});
    const em=['🍎','🍌','🍇','🍉','🍒','🍓','🍍','🥝'];
    const init=()=>{cards=[...em,...em].sort(()=>Math.random()-.5);flipped=[];matched=0;moves=0;lock=false;r();};
    const r=()=>{
      gr.innerHTML='';info.textContent=`Moves: ${moves}`;
      cards.forEach((v,i)=>{
        const c=ce('div',{className:'mm-card'+(flipped.includes(i)?' flipped':'')});
        c.textContent=flipped.includes(i)?v:'❓';
        c.onclick=()=>{
          if(lock||flipped.includes(i)||c.textContent===v)return;
          flipped.push(i);c.textContent=v;moves++;
          if(flipped.length===2){
            lock=true;
            setTimeout(()=>{
              if(cards[flipped[0]]===cards[flipped[1]]){matched+=2;flipped=[];if(matched===cards.length)info.textContent='You Win!';}
              else{gr.children[flipped[0]].textContent='❓';gr.children[flipped[1]].textContent='❓';flipped=[];}
              lock=false;r();
            },800);
          }r();
        };
        gr.appendChild(c);
      });
    };
    init();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[info,gr,ce('button',{textContent:'New Game',onclick:init})]));
  }
}

/* FIX: `i<<30` corrected to `i<30` */
class Sudoku extends App {
  constructor() { super(); this.name='Sudoku'; this.icon='🔢'; this.cat='Games'; }
  init(w) {
    let b=Array(9).fill().map(()=>Array(9).fill(0));
    const d=ce('div');
    const r=()=>{
      d.innerHTML='';
      b.forEach((row,y)=>{
        const rr=ce('div',{className:'sk-row'});
        row.forEach((v,x)=>{
          const inp=ce('input',{className:'sk-cell',value:v||'',readOnly:v!==0});
          if(v!==0)inp.classList.add('fixed');
          inp.oninput=e=>{const n=parseInt(e.target.value);if(n>=1&&n<=9){b[y][x]=n;if(check())alert('Solved!');}};
          rr.appendChild(inp);
        });
        d.appendChild(rr);
      });
    };
    const check=()=>b.every(r=>r.filter(Boolean).length===9&&new Set(r.filter(Boolean)).size===9);
    const gen=()=>{
      b=Array(9).fill().map(()=>Array(9).fill(0));
      for(let i=0;i<30;){const x=Math.floor(Math.random()*9),y=Math.floor(Math.random()*9),n=Math.floor(Math.random()*9)+1;b[y][x]=n;i++;}
      r();
    };
    gen();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[d,ce('button',{textContent:'New Game',onclick:gen})]));
  }
}

/* FIX: `y<<8`, `x<<8` corrected to `y<8`, `x<8` */
class Chess extends App {
  constructor() { super(); this.name='Chess'; this.icon='♟️'; this.cat='Games'; }
  init(w) {
    const b0='rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR';
    let b=b0.split(''),sel=null,turn='w';
    const gr=ce('div',{className:'ch-board'});
    const r=()=>{
      gr.innerHTML='';
      for(let y=0;y<8;y++){
        const rr=ce('div',{className:'ch-row'});
        for(let x=0;x<8;x++){
          const i=y*8+x;
          const c=ce('div',{className:'ch-cell '+(y%2===x%2?'w':'b'),textContent:p(b[i])});
          if(sel===i)c.classList.add('sel');
          c.onclick=()=>{
            if(sel===null){if(b[i]&&((turn==='w'&&b[i]===b[i].toUpperCase())||(turn==='b'&&b[i]===b[i].toLowerCase())))sel=i;}
            else{if(i!==sel){b[i]=b[sel];b[sel]=' ';turn=turn==='w'?'b':'w';sel=null;}else sel=null;}
            r();
          };
          rr.appendChild(c);
        }
        gr.appendChild(rr);
      }
    };
    const p=c=>{const m={p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',P:'♙',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔'};return m[c]||'';};
    r();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[gr,ce('button',{textContent:'Reset',onclick:()=>{b=b0.split('');sel=null;turn='w';r();}})]));
  }
}

/* FIX: many `<<` in loops and comparisons corrected to `<` */
class WordGuess extends App {
  constructor() { super(); this.name='Wordle'; this.icon='🎯'; this.cat='Games'; }
  init(w) {
    const words=['apple','beach','chair','dance','eagle','flame','grape','house','image','juice','knife','lemon','music','night','ocean','peace','queen','radio','sugar','table','uncle','video','water','youth','zebra'];
    let word=words[Math.floor(Math.random()*words.length)],row=0,game=true,cur='';
    const gr=ce('div');
    const kb=ce('div',{style:'display:flex;flex-direction:column;gap:4px;margin-top:12px;align-items:center'});
    const r=()=>{
      gr.innerHTML='';
      for(let y=0;y<6;y++){
        const rr=ce('div',{className:'wg-row'});
        for(let x=0;x<5;x++){
          const c=ce('div',{className:'wg-cell',textContent:(y<row?word[y*5+x]||'':y===row?cur[x]||'':'')});
          if(y<row){const ch=word[y*5+x];if(!ch)continue;if(ch===word[x])c.classList.add('correct');else if(word.includes(ch))c.classList.add('present');else c.classList.add('absent');}
          rr.appendChild(c);
        }
        gr.appendChild(rr);
      }
    };
    const check=()=>{
      if(cur.length!==5)return;
      const rr=gr.children[row];let win=true;
      for(let i=0;i<5;i++){const c=rr.children[i],ch=cur[i];if(ch===word[i])c.classList.add('correct');else if(word.includes(ch)){c.classList.add('present');win=false;}else{c.classList.add('absent');win=false;}}
      if(win){game=false;alert('You win!');return;}
      row++;cur='';if(row>=6){game=false;alert('Word was: '+word);}
    };
    document.addEventListener('keydown',e=>{
      if(!game)return;
      if(e.key==='Enter')check();
      else if(e.key==='Backspace')cur=cur.slice(0,-1);
      else if(/^[a-zA-Z]$/.test(e.key)&&cur.length<5)cur+=e.key.toLowerCase();
      r();
    });
    ['qwertyuiop','asdfghjkl','zxcvbnm'].forEach(row2=>{
      const rr=ce('div',{style:'display:flex;gap:4px'});
      row2.split('').forEach(k=>{rr.appendChild(ce('button',{textContent:k,style:'padding:8px 10px;background:var(--surface);border:1px solid var(--border);color:var(--fg);border-radius:4px;cursor:pointer',onclick:()=>{if(game&&cur.length<5){cur+=k;r();}}}));});
      kb.appendChild(rr);
    });
    r();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[gr,kb]));
  }
}

/* FIX: `Math.random()<<.9` → `<.9`, `f.length<<4` → `<4` */
class Game2048 extends App {
  constructor() { super(); this.name='2048'; this.icon='🔢'; this.cat='Games'; }
  init(w) {
    let b=Array(4).fill().map(()=>Array(4).fill(0)),score=0;
    const gr=ce('div',{className:'g2048'});
    const add=()=>{const e=[];b.forEach((r,y)=>r.forEach((v,x)=>{if(!v)e.push([y,x]);}));if(e.length){const[y,x]=e[Math.floor(Math.random()*e.length)];b[y][x]=Math.random()<.9?2:4;}};
    const r=()=>{gr.innerHTML='';b.forEach(r=>r.forEach(v=>{const c=ce('div',{className:'g2048-cell v'+v,textContent:v||''});gr.appendChild(c);}));};
    const move=dy=>{
      let moved=false;
      const rot=dy===0||dy===2;
      let a=rot?b[0].map((_,i)=>b.map(r=>r[i])):[...b];
      if(dy>1)a=a.map(r=>[...r].reverse());
      a=a.map(r=>{
        const f=r.filter(x=>x);
        for(let i=0;i<f.length-1;i++)if(f[i]===f[i+1]){f[i]*=2;score+=f[i];f.splice(i+1,1);}
        while(f.length<4)f.push(0);
        if(f.join(',')!==r.join(','))moved=true;
        return f;
      });
      if(dy>1)a=a.map(r=>r.reverse());
      if(rot)b=a[0].map((_,i)=>a.map(r=>r[i]));else b=a;
      return moved;
    };
    const loop=e=>{
      if(!e)return;let m=false;
      if(e.key==='ArrowUp')m=move(0);if(e.key==='ArrowDown')m=move(2);
      if(e.key==='ArrowLeft')m=move(1);if(e.key==='ArrowRight')m=move(3);
      if(m){add();r();}
    };
    document.addEventListener('keydown',loop);
    const start=()=>{b=Array(4).fill().map(()=>Array(4).fill(0));score=0;add();add();r();};
    start();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[ce('div',{className:'game-info',textContent:'Score: 0'}),gr,ce('button',{textContent:'New Game',onclick:start})]));
  }
}

/* FIX: `pipes.length<<3` → `<3`, `Math.random()<<.02` → `<.02`, `y<<0` → `y<0` */
class FlappyBird extends App {
  constructor() { super(); this.name='Flappy'; this.icon='🐦'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:400,height:500});
    const ctx=cvs.getContext('2d');
    let y=200,vy=0,score=0,game=false,pipes=[];
    const draw=()=>{
      ctx.fillStyle='#70c5ce';ctx.fillRect(0,0,400,500);
      ctx.fillStyle='#2ecc71';pipes.forEach(p=>{ctx.fillRect(p.x,0,50,p.gap);ctx.fillRect(p.x,p.gap+120,50,500);});
      ctx.fillStyle='#f1c40f';ctx.beginPath();ctx.arc(50,y,15,0,Math.PI*2);ctx.fill();
    };
    const loop=()=>{
      if(!game)return;
      vy+=0.5;y+=vy;
      pipes.forEach(p=>{p.x-=2;if(p.x<-50)p.x=400;if(p.x===50)score++;});
      if(pipes.length<3&&Math.random()<0.02)pipes.push({x:400,gap:50+Math.random()*200});
      if(y>500||y<0||pipes.some(p=>50+15>p.x&&50-15<p.x+50&&(y-15<p.gap||y+15>p.gap+120))){game=false;alert('Score: '+score);return;}
      draw();requestAnimationFrame(loop);
    };
    const jump=()=>{if(!game){game=true;y=200;vy=0;score=0;pipes=[];loop();}vy=-8;};
    cvs.onclick=jump;
    document.addEventListener('keydown',e=>{if(e.code==='Space')jump();});
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'fb-cnt'},[ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,ce('div',{textContent:'Click or Space to flap'})]));
  }
}

/* FIX: `obs.length<<2` → `<2`, `Math.random()<<.02` → `<.02`, `o.x<<80` → `<80`, `dy<<40` → `<40` */
class DinoRun extends App {
  constructor() { super(); this.name='Dino'; this.icon='🦖'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:600,height:200});
    const ctx=cvs.getContext('2d');
    let dy=0,jump=false,obs=[],score=0,game=false,speed=5;
    const draw=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,600,200);ctx.fillStyle='#333';ctx.fillRect(50,150-dy,30,30);obs.forEach(o=>ctx.fillRect(o.x,150,20,40));};
    const loop=()=>{
      if(!game)return;
      obs.forEach(o=>{o.x-=speed;if(o.x<-20){o.x=600+Math.random()*300;score++;}});
      if(obs.length<2&&Math.random()<0.02)obs.push({x:600});
      if(jump){dy+=5;if(dy>60)jump=false;}else if(dy>0)dy-=5;
      if(obs.some(o=>o.x<80&&o.x>30&&dy<40)){game=false;alert('Score: '+score);return;}
      draw();requestAnimationFrame(loop);
    };
    const j=()=>{if(!game){game=true;dy=0;obs=[];score=0;loop();}if(dy===0)jump=true;};
    document.addEventListener('keydown',e=>{if(e.code==='Space')j();});
    cvs.onclick=j;
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'dr-cnt'},[ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,ce('div',{textContent:'Space or Click to jump'})]));
  }
}

/* FIX: `Math.random()<<.03` → `<.03` */
class SpaceShooter extends App {
  constructor() { super(); this.name='Shooter'; this.icon='🚀'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:600,height:400});
    const ctx=cvs.getContext('2d');
    let px=300,bs=[],es=[],score=0,game=false;
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,600,400);
      ctx.fillStyle='#2ecc71';ctx.fillRect(px,350,30,20);
      bs.forEach(b=>{ctx.fillStyle='#fff';ctx.fillRect(b.x,b.y,4,10);});
      es.forEach(e=>{ctx.fillStyle='#e94560';ctx.fillRect(e.x,e.y,30,20);});
    };
    const loop=()=>{
      if(!game)return;
      bs.forEach(b=>b.y-=5);bs=bs.filter(b=>b.y>0);
      es.forEach(e=>{e.y+=2;if(e.y>400){game=false;alert('Score: '+score);}});
      if(Math.random()<0.03)es.push({x:Math.random()*570,y:0});
      bs.forEach(b=>es=es.filter(e=>!(b.x>e.x&&b.x<e.x+30&&b.y>e.y&&b.y<e.y+20)));
      draw();requestAnimationFrame(loop);
    };
    const shoot=()=>{if(!game){game=true;bs=[];es=[];score=0;loop();}bs.push({x:px+13,y:350});};
    document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')px=Math.max(0,px-10);if(e.key==='ArrowRight')px=Math.min(570,px+10);if(e.code==='Space')shoot();});
    cvs.onclick=shoot;
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{className:'sh-cnt'},[ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,ce('div',{textContent:'Arrows to move, Space to shoot'})]));
  }
}

/* FIX: all `<<` in loop comparisons corrected to `<` */
class Breakout extends App {
  constructor() { super(); this.name='Breakout'; this.icon='🧱'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:600,height:400});
    const ctx=cvs.getContext('2d');
    let bx=300,by=350,bdx=3,bdy=-3,px=250,bricks=[],score=0,game=false;
    for(let r=0;r<5;r++)for(let c=0;c<10;c++)bricks.push({x:c*60+10,y:r*25+10,w:50,h:20,hit:false});
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,600,400);
      ctx.fillStyle='#e94560';bricks.forEach(b=>{if(!b.hit)ctx.fillRect(b.x,b.y,b.w,b.h);});
      ctx.fillStyle='#2ecc71';ctx.fillRect(px,380,100,10);
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(bx,by,8,0,Math.PI*2);ctx.fill();
    };
    const loop=()=>{
      if(!game)return;
      bx+=bdx;by+=bdy;
      if(bx<0||bx>600)bdx=-bdx;
      if(by<0)bdy=-bdy;
      if(by>400){game=false;alert('Game Over! Score: '+score);return;}
      if(by>370&&bx>px&&bx<px+100)bdy=-bdy;
      bricks.forEach(b=>{if(!b.hit&&bx>b.x&&bx<b.x+b.w&&by>b.y&&by<b.y+b.h){b.hit=true;bdy=-bdy;score+=10;}});
      if(bricks.every(b=>b.hit)){game=false;alert('You Win! Score: '+score);return;}
      draw();requestAnimationFrame(loop);
    };
    cvs.onmousemove=e=>{const r=cvs.getBoundingClientRect();px=e.clientX-r.left-50;};
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[
      ce('div',{className:'game-info',textContent:'Score: 0'}),cvs,
      ce('button',{textContent:'Start',onclick:()=>{game=true;bx=300;by=350;bricks.forEach(b=>b.hit=false);score=0;loop();}})
    ]));
  }
}

class MazeGame extends App {
  constructor() { super(); this.name='Maze'; this.icon='🌀'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:400,height:400});
    const ctx=cvs.getContext('2d');
    const S=20,W=20,H=20;
    let maze=[],px=1,py=1,ex=W-2,ey=H-2;
    const gen=()=>{
      maze=Array(H).fill().map(()=>Array(W).fill(1));
      const st=[[1,1]];maze[1][1]=0;
      while(st.length){
        const[x,y]=st.pop();
        const d=[[0,-2],[0,2],[-2,0],[2,0]].filter(([dx,dy])=>{const nx=x+dx,ny=y+dy;return nx>0&&nx<W-1&&ny>0&&ny<H-1&&maze[ny][nx];});
        if(d.length){st.push([x,y]);const[dx,dy]=d[Math.floor(Math.random()*d.length)];maze[y+dy/2][x+dx/2]=0;maze[y+dy][x+dx]=0;st.push([x+dx,y+dy]);}
      }
    };
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,400,400);
      ctx.fillStyle='#fff';for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(maze[y][x])ctx.fillRect(x*S,y*S,S,S);
      ctx.fillStyle='#2ecc71';ctx.fillRect(px*S,py*S,S,S);
      ctx.fillStyle='#e94560';ctx.fillRect(ex*S,ey*S,S,S);
    };
    const move=(dx,dy)=>{if(!maze[py+dy][px+dx]){px+=dx;py+=dy;if(px===ex&&py===ey){alert('You escaped!');gen();px=1;py=1;}draw();}};
    document.addEventListener('keydown',e=>{if(e.key==='ArrowUp')move(0,-1);if(e.key==='ArrowDown')move(0,1);if(e.key==='ArrowLeft')move(-1,0);if(e.key==='ArrowRight')move(1,0);});
    gen();draw();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[cvs,ce('div',{textContent:'Arrow keys to move'})]));
  }
}

/* FIX: `bx<<20` → `bx<20`, `by<<p1+80` → `by<p1+80`, `bx<<0` → `bx<0` */
class PingPong extends App {
  constructor() { super(); this.name='Ping Pong'; this.icon='🏓'; this.cat='Games'; }
  init(w) {
    const cvs=ce('canvas',{className:'game-cvs',width:600,height:400});
    const ctx=cvs.getContext('2d');
    let bx=300,by=200,bdx=5,bdy=5,p1=150,p2=150,s1=0,s2=0;
    const draw=()=>{
      ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,600,400);
      ctx.fillStyle='#fff';ctx.fillRect(10,p1,10,80);ctx.fillRect(580,p2,10,80);ctx.fillRect(bx-5,by-5,10,10);
      ctx.fillText(`${s1} - ${s2}`,280,30);
    };
    const loop=()=>{
      bx+=bdx;by+=bdy;
      if(by<0||by>400)bdy=-bdy;
      if(bx<20&&by>p1&&by<p1+80)bdx=-bdx;
      if(bx>580&&by>p2&&by<p2+80)bdx=-bdx;
      if(bx<0){s2++;bx=300;by=200;}
      if(bx>600){s1++;bx=300;by=200;}
      p2+=by>p2+40?5:-5;p2=Math.max(0,Math.min(320,p2));
      draw();requestAnimationFrame(loop);
    };
    cvs.onmousemove=e=>{const r=cvs.getBoundingClientRect();p1=e.clientY-r.top-40;};
    loop();
    w.body.innerHTML='';
    w.body.appendChild(ce('div',{style:'text-align:center'},[ce('div',{className:'game-info',textContent:'0 - 0'}),cvs]));
  }
}
