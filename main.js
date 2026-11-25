/* BLEAZ · Direction E — interaction layer. Signature: "the team assembling" (canvas, scroll-driven). */
  /* generated photorealistic headshots (no real people), see NOTES v9 */
  function PH(n){n=((n%20)+20)%20+1;return 'img/p'+(n<10?'0':'')+n+'.webp';}
  function PIMG(n,s){return '<img src="'+PH(n)+'" alt="" width="'+(s||80)+'" height="'+(s||80)+'" loading="lazy" decoding="async">';}
(function(){
  'use strict';
  var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp=function(v,a,b){return v<a?a:v>b?b:v};
  var lerp=function(a,b,t){return a+(b-a)*t};
  var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}; /* easeInOutCubic */
  var easeOut=function(t){return 1-Math.pow(1-t,3)};
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}

  /* ---------- tile renderer (duotone abstract portrait frame) ---------- */
  var C={paper:'#F0F1F2',stroke:'#DCDFE4',fig:'#B7B9BE',ink:'#101214',v:'#1868DB',o:'#1868DB',m:'#1868DB',p:'#1868DB'};
  function mix(a,b,t){var pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);
    var r=Math.round(lerp(pa>>16,pb>>16,t)),g=Math.round(lerp(pa>>8&255,pb>>8&255,t)),bl=Math.round(lerp(pa&255,pb&255,t));
    return 'rgb('+r+','+g+','+bl+')';}
  function tile(ctx,x,y,s,alpha,k,chk,dark){
    if(alpha<=0.004||s<=0.5)return;
    var r=s/2;ctx.save();ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle=dark?'rgba(255,255,255,0.07)':C.paper;ctx.fill();
    if(k<1){ctx.lineWidth=Math.max(1,s*0.025);ctx.strokeStyle=dark?'rgba(255,255,255,0.14)':C.stroke;ctx.stroke();}
    if(k>0){
      var g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,C.v);g.addColorStop(1,C.m);
      ctx.globalAlpha=alpha*k;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      if(k>0.5){ctx.globalAlpha=alpha*(k-.5)*0.5;ctx.shadowColor='rgba(24,104,219,.55)';ctx.shadowBlur=s*0.5;ctx.fill();ctx.shadowBlur=0;}
      ctx.globalAlpha=alpha;
    }
    /* figure: head + shoulders, clipped to the frame */
    ctx.save();ctx.beginPath();ctx.arc(x,y,r-0.5,0,Math.PI*2);ctx.clip();
    ctx.fillStyle=dark?(k>0?'#fff':'rgba(255,255,255,.32)'):mix(C.fig,'#FFFFFF',k);
    ctx.beginPath();ctx.arc(x,y-s*0.1,s*0.155,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(x,y+s*0.36,s*0.3,s*0.22,0,Math.PI,0);ctx.closePath();ctx.fill();
    ctx.restore();
    if(chk>0){
      var cr=s*0.17*easeOut(chk),cx=x-r*0.72,cy=y+r*0.72;
      ctx.beginPath();ctx.arc(cx,cy,cr+Math.max(1.5,s*0.03),0,Math.PI*2);ctx.fillStyle=dark?'#101214':'#fff';ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fillStyle=C.ink;ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(1.2,cr*0.28);ctx.lineCap='round';ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(cx-cr*0.45,cy+cr*0.02);ctx.lineTo(cx-cr*0.1,cy+cr*0.38);ctx.lineTo(cx+cr*0.5,cy-cr*0.35);ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- HERO: team assembling ---------- */
  (function(){
    var cv=document.getElementById('team');if(!cv)return;
    var ctx=cv.getContext('2d'),hero=document.querySelector('.hero');
    var caps=document.querySelectorAll('.stage-cap .cap'),phs=document.querySelectorAll('.phases li'),legend=document.querySelector('.stage-legend'),hint=document.querySelector('.scroll-hint');
    var W=0,H=0,dpr=1,figs=[],links=[],mobile=false,cols,rows,cell,ts;
    var target=RM?1:0,cur=target,t0=performance.now(),visible=true;

    function build(){
      var r=cv.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);
      W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
      mobile=W<560;
      cols=mobile?7:10;rows=mobile?5:6;
      var padX=mobile?22:56,padTop=mobile?58:78,padBot=mobile?44:64;
      cell=Math.min((W-padX*2)/cols,(H-padTop-padBot)/rows);ts=cell*0.74;
      var gx0=W/2-cell*cols/2+cell/2,gy0=padTop+((H-padTop-padBot)-cell*rows)/2+cell/2;
      var rnd=rng(7),N=cols*rows;figs=[];
      /* scatter = jittered coarse grid over the whole stage, sizes vary */
      var sc=Math.ceil(Math.sqrt(N*W/H)),sr=Math.ceil(N/sc),order=[];
      for(var i=0;i<sc*sr;i++)order.push(i);
      for(i=order.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1));var t=order[i];order[i]=order[j];order[j]=t;}
      for(i=0;i<N;i++){
        var c=i%cols,rw=Math.floor(i/cols),o=order[i],scx=o%sc,scy=Math.floor(o/sc);
        figs.push({
          gx:gx0+c*cell,gy:gy0+rw*cell,
          sx:padX*0.5+(scx+0.5+(rnd()-.5)*0.8)/sc*(W-padX),sy:padTop*0.6+(scy+0.5+(rnd()-.5)*0.8)/sr*(H-padTop*0.6-20),
          ss:ts*(0.55+rnd()*0.55),sa:0.45+rnd()*0.55,
          d:rnd(),ph:rnd()*Math.PI*2,w:0.6+rnd()*0.6,sel:false,slot:null
        });
      }
      /* pick the team: spread picks across the grid */
      var K=mobile?10:13,picks=[],pool=figs.map(function(f,i){return i});
      for(i=pool.length-1;i>0;i--){j=Math.floor(rnd()*(i+1));t=pool[i];pool[i]=pool[j];pool[j]=t;}
      for(i=0;i<pool.length&&picks.length<K;i++){
        var f=figs[pool[i]],ok=picks.every(function(p){var q=figs[p];return Math.hypot(q.gx-f.gx,q.gy-f.gy)>cell*1.3;});
        if(ok)picks.push(pool[i]);
      }
      for(i=0;picks.length<K&&i<pool.length;i++)if(picks.indexOf(pool[i])<0)picks.push(pool[i]);
      /* org formation slots: 1 lead, 3 team leads, members */
      var per=mobile?2:3,slots=[],cx=W/2,
          y0=H*(mobile?0.25:0.24),y1=H*(mobile?0.5:0.49),y2=H*(mobile?0.75:0.75),
          spread=Math.min(W*(mobile?0.31:0.3),cell*3.7),sp=Math.min(cell*1.0,W*0.095);
      slots.push({x:cx,y:y0,s:ts*1.5,lvl:0});
      for(i=-1;i<=1;i++)slots.push({x:cx+i*spread,y:y1,s:ts*1.22,lvl:1,par:0});
      for(i=0;i<3;i++)for(j=0;j<per;j++)slots.push({x:cx+(i-1)*spread+(j-(per-1)/2)*sp,y:y2,s:ts*0.98,lvl:2,par:1+i});
      /* assign slots by proximity order (lead = pick closest to stage centre) */
      var rest=picks.slice();rest.sort(function(a,b){return Math.hypot(figs[a].gx-cx,figs[a].gy-H/2)-Math.hypot(figs[b].gx-cx,figs[b].gy-H/2)});
      var lead=rest.shift();var others=rest.sort(function(a,b){return figs[a].gy-figs[b].gy||figs[b].gx-figs[a].gx});
      var restSlots=slots.slice(1).sort(function(a,b){return a.y-b.y||b.x-a.x});
      figs[lead].sel=true;figs[lead].slot=slots[0];figs[lead].rank=0;
      others.forEach(function(ix,n){figs[ix].sel=true;figs[ix].slot=restSlots[n];figs[ix].rank=1+n;});
      links=slots.filter(function(s){return s.par!=null}).map(function(s){return{a:slots[s.par],b:s}});
      cv._slots=slots;
    }

    function draw(now){
      var p=cur,time=(now-t0)/1000;
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
      var scanP=clamp((p-0.40)/0.20,0,1),lineP=clamp((p-0.80)/0.13,0,1);
      var gxMin=W/2-cell*cols/2,gxMax=W/2+cell*cols/2;
      /* scan beam (RTL: sweeps right → left) */
      if(scanP>0&&scanP<1){
        var bx=lerp(gxMax+cell*0.3,gxMin-cell*0.3,scanP),a=Math.sin(Math.PI*scanP);
        ctx.fillStyle='rgba(24,104,219,'+(0.22*a)+')';ctx.fillRect(bx-22,0,44,H);
        ctx.fillStyle='rgba(24,104,219,'+(0.95*a)+')';ctx.fillRect(bx-1,H*0.12,2,H*0.76);
      }
      /* empty seats appear, then get filled */
      var seatP=clamp((p-0.55)/0.1,0,1);
      if(seatP>0&&cv._slots){
        ctx.save();ctx.setLineDash([3,4]);ctx.lineWidth=1.3;
        cv._slots.forEach(function(s,i){
          var fill=clamp((p-0.70-i*0.004)/0.12,0,1),a=seatP*(1-fill);if(a<=0.01)return;
          ctx.globalAlpha=a;ctx.strokeStyle='#F3A8C8';ctx.beginPath();ctx.arc(s.x,s.y,s.s/2+3,0,Math.PI*2);ctx.stroke();
        });
        ctx.restore();
      }
      /* org-chart connectors */
      if(lineP>0){
        ctx.save();ctx.lineWidth=1.6;ctx.lineCap='round';
        links.forEach(function(L,i){
          var t=clamp(lineP*1.25-(L.b.lvl-1)*0.25,0,1);if(t<=0)return;
          var midY=(L.a.y+L.a.s/2+L.b.y-L.b.s/2)/2;
          var pts=[[L.a.x,L.a.y+L.a.s/2+4],[L.a.x,midY],[L.b.x,midY],[L.b.x,L.b.y-L.b.s/2-4]];
          var len=0,seg=[];for(var k=1;k<4;k++){var d=Math.abs(pts[k][0]-pts[k-1][0])+Math.abs(pts[k][1]-pts[k-1][1]);seg.push(d);len+=d;}
          var rem=len*easeOut(t);
          var gr='#F3A8C8';
          ctx.strokeStyle=gr;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
          for(k=1;k<4&&rem>0;k++){var u=Math.min(1,rem/seg[k-1]);ctx.lineTo(lerp(pts[k-1][0],pts[k][0],u),lerp(pts[k-1][1],pts[k][1],u));rem-=seg[k-1];}
          ctx.stroke();
        });
        ctx.restore();
      }
      /* tiles: draw unselected first, selected on top */
      var order=[0,1];
      order.forEach(function(pass){
        figs.forEach(function(f){
          if((pass===1)!==f.sel)return;
          var tA=ease(clamp((p-0.05-f.d*0.12)/0.24,0,1));             /* converge into grid */
          var xn=(f.gx-gxMin)/(gxMax-gxMin);                            /* 0 left .. 1 right */
          var hit=clamp((scanP*1.2-(1-xn))*6,0,1);                          /* beam has passed this tile */
          var tT=f.sel?ease(clamp((p-0.62-(f.rank||0)*0.006)/0.22,0,1)):0; /* move into formation */
          var amp=RM?0:(7*(1-tA)+ (f.sel?1.2:0.8)*tA);
          var dx=Math.sin(time*f.w+f.ph)*amp,dy=Math.cos(time*f.w*0.8+f.ph)*amp;
          var x=lerp(f.sx,f.gx,tA),y=lerp(f.sy,f.gy,tA),s=lerp(f.ss,ts,tA),al=lerp(f.sa,1,tA),k=0,chk=0;
          if(f.sel){
            k=hit;s*=1+0.12*hit*(1-tT);
            if(f.slot){x=lerp(x,f.slot.x,tT);y=lerp(y,f.slot.y,tT);s=lerp(s,f.slot.s,tT);}
            chk=clamp((tT-0.6)/0.4,0,1)*(lineP>0?1:1);
          }else{
            al*=lerp(1,0.32,hit);
            var fade=clamp((p-0.62)/0.2,0,1);al*=lerp(1,0.32,fade);s*=lerp(1,0.8,fade);
          }
          tile(ctx,x+dx,y+dy,s,al,k,chk,false);
        });
      });
      /* UI states */
      var ph=p<0.40?0:p<0.64?1:2;
      caps.forEach(function(c,i){c.classList.toggle('on',i===ph)});
      phs.forEach(function(l,i){l.classList.toggle('on',i===ph)});
      if(legend)legend.classList.toggle('on',p>0.45);
      if(hint)hint.style.opacity=p>0.03?0:1;
    }
    function progress(){var r=hero.getBoundingClientRect();var span=r.height-window.innerHeight;return span>0?clamp(-r.top/span,0,1):1;}
    function loop(now){
      if(!RM){target=progress();cur+= (target-cur)*0.14;if(Math.abs(target-cur)<0.0005)cur=target;}
      if(visible)draw(now);
      requestAnimationFrame(loop);
    }
    build();
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(cv);
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,120);});
    if(RM){draw(performance.now());window.addEventListener('resize',function(){setTimeout(function(){draw(performance.now())},200)});}
    else requestAnimationFrame(loop);
    window.__heroSnap=function(){target=progress();cur=target;}; /* screenshot tooling only */
  })();


  /* ---------- MATCH GRAPH v8 (own section, scroll-triggered) (two sides flowing into one match) ---------- */
  (function(){
    var host=document.querySelector('.tg-graph');if(!host)return;
    var inner=host.querySelector('.tg-inner'),svg=host.querySelector('.tg-lines'),NS='http://www.w3.org/2000/svg';
    var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* design space 1160x610 (x from left). RTL story: candidates enter on the right, the organisation on the left. */
    var N=[
      {id:'hc',k:'hd',t:'ערוצי גיוס',x:1060,y:16},
      {id:'hs',k:'hd',t:'מצד המועמדים',x:745,y:16},
      {id:'hk',k:'hd',t:'מצד הארגון',x:415,y:16},
      {id:'c1',k:'ch',t:'שיתופי פעולה עם מכללות ואוניברסיטאות',ic:'cap',c:'p',r:1160,y:60},
      {id:'c2',k:'ch',t:'רשתות אורגניות',ic:'net',c:'g',r:1160,y:130},
      {id:'c3',k:'ch',t:'לוחות דרושים',ic:'board',c:'o',r:1160,y:200},
      {id:'c4',k:'ch',t:'פרסום ממומן במטא',ic:'mega',c:'b',r:1160,y:270},
      {id:'c5',k:'ch',t:'מאגרי המועמדים שלנו',ic:'db',c:'y',r:1160,y:340},
      {id:'c6',k:'ch',t:'גיוס יזום מבוסס טכנולוגיה',ic:'bolt',c:'p',r:1160,y:410},
      {id:'s1',k:'st',t:'קבלת ליד',ic:'inbox',c:'b',x:745,y:72},
      {id:'s2',k:'st',t:'סינון ראשוני',ic:'filter',c:'g',x:745,y:152},
      {id:'s3',k:'st',t:'שיחה טלפונית',ic:'phone',c:'o',x:745,y:232},
      {id:'s4',k:'st',t:'שיחת זום לעומק',ic:'video',c:'p',x:745,y:312},
      {id:'s5',k:'st',t:'התאמה למשרה',ic:'target',c:'b',x:745,y:392},
      {id:'o1',k:'org',t:'הארגון שלכם',ic:'building',c:'y',x:120,y:232},
      {id:'k1',k:'st',t:'לומדים את המשרה',ic:'brief',c:'y',x:415,y:72},
      {id:'k2',k:'st',t:'פגישה איתכם',ic:'chat',c:'g',x:415,y:152},
      {id:'k3',k:'st',t:'נכנסים לרצפת העבודה',ic:'headset',c:'o',x:415,y:232},
      {id:'k4',k:'st',t:'מכירים את האנשים וה-DNA',ic:'dna',c:'p',x:415,y:312},
      {id:'k5',k:'st',t:'מבינים את מי מחפשים',ic:'eye',c:'b',x:415,y:392},
      {id:'m',k:'match',t:'Match',x:580,y:392},
      {id:'out',k:'out',t:'רק המועמד המדויק נשלח אליכם',x:580,y:508}
    ];
    var AV=[ /* generic illustrated candidates, ring colours from the confetti palette */
      {x:880,y:168,s:46,ring:'#1868DB',skin:'#E8B48C',shirt:'#4C6B8A'},
      {x:905,y:308,s:40,ring:'#22A06B',skin:'#A86F4C',shirt:'#8A6BB0'},
      {x:872,y:462,s:44,ring:'#BF63F3',skin:'#F2C9A0',shirt:'#3F7F6A'},
      {x:1010,y:488,s:36,ring:'#FCA700',skin:'#7A4E33',shirt:'#B5654A'},
      {x:612,y:232,s:38,ring:'#FF8F3F',skin:'#D9A374',shirt:'#3D5A99'},
      {x:140,y:120,s:40,ring:'#22A06B',skin:'#C98E64',shirt:'#5A5F6B'},
      {x:176,y:350,s:36,ring:'#1868DB',skin:'#F0C29A',shirt:'#7A5C3E'}
    ];
    var E=[['c1','s1','h'],['c2','s1','h'],['c3','s1','h'],['c4','s1','h'],['c5','s1','h'],['c6','s1','h'],
           ['s1','s2','v'],['s2','s3','v'],['s3','s4','v'],['s4','s5','v'],['s5','m','h'],
           ['o1','k1','h'],['k1','k2','v'],['k2','k3','v'],['k3','k4','v'],['k4','k5','v'],['k5','m','h'],['m','out','v']];
    var el={},html='';
    N.forEach(function(n){
      if(n.k==='hd'){html+='<span class="tn-hd" data-id="'+n.id+'">'+n.t+'</span>';return;}
      if(n.k==='match'){html+='<span class="tn tn-match" data-id="m"><i><svg><use href="#i-target"/></svg></i><b>Match</b><small>התאמה מדויקת</small></span>';return;}
      if(n.k==='out'){html+='<span class="tn tn-out" data-id="out"><i class="tn-chk"><svg><use href="#i-check"/></svg></i>'+n.t+'</span>';return;}
      html+='<span class="tn tn-'+n.k+'" data-id="'+n.id+'"><i class="ic ic-'+n.c+'"><svg><use href="#i-'+n.ic+'"/></svg></i>'+n.t+'</span>';
    });
    AV.forEach(function(a,i){
      var PIX=[9,13,0,5,16,1,18];html+='<span class="tav" style="left:'+(a.x-a.s/2)+'px;top:'+(a.y-a.s/2)+'px;width:'+a.s+'px;height:'+a.s+'px;--ring:'+a.ring+';--d:'+(0.7+i*0.22).toFixed(2)+'s;--bob:'+(3.2+(i%3)*0.7)+'s;--bd:'+(-i*0.6)+'s"><b>'+PIMG(PIX[i],a.s)+'</b></span>';
    });
    inner.insertAdjacentHTML('beforeend',html);
    inner.querySelectorAll('[data-id]').forEach(function(x){el[x.dataset.id]=x;});
    /* choreography (seconds): channels + organisation appear, lines draw from both sides step by step, both arrive at Match together, then the output */
    var STEP=0.32,T0=1.1,TM=T0+4*STEP+0.07+0.55,DL={hc:0,hs:0.05,hk:0.05,o1:0.25,m:TM+0.05,out:TM+0.95};
    for(var q=1;q<=6;q++)DL['c'+q]=0.15+(q-1)*0.07;
    for(q=1;q<=5;q++){DL['s'+q]=T0+(q-1)*STEP;DL['k'+q]=T0+(q-1)*STEP;}
    Object.keys(DL).forEach(function(id){el[id]&&el[id].style.setProperty('--d',DL[id].toFixed(2)+'s');});
    function edgeT(e,i){var f=e[0],t=e[1];
      if(/^c/.test(f))return[0.55+(+f.slice(1)-1)*0.04,0.6];
      if(f==='o1')return[0.55,0.6];
      if(t==='m')return[T0+4*STEP+0.07,0.55];
      if(f==='m')return[TM+0.55,0.4];
      var n=+f.slice(1);return[T0+(n-1)*STEP+0.05,0.27];}
    function place(){
      N.forEach(function(n){var e=el[n.id];var w=e.offsetWidth,h=e.offsetHeight;
        var left=n.r!=null?n.r-w:n.x-w/2;e.style.left=left+'px';e.style.top=(n.y-h/2)+'px';
        n.L=left;n.R=left+w;n.T=n.y-h/2;n.B=n.y+h/2;n.cx=left+w/2;});
    }
    var byId={};N.forEach(function(n){byId[n.id]=n;});
    var paths=[];
    function build(){
      place();svg.innerHTML='';paths=[];
      /* faint target rings behind the match node */
      [70,120,175].forEach(function(r){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',580);c.setAttribute('cy',392);c.setAttribute('r',r);c.setAttribute('class','tg-ring');c.style.setProperty('--d',(TM+(r-70)/350).toFixed(2)+'s');svg.appendChild(c);});
      E.forEach(function(e,i){var a=byId[e[0]],b=byId[e[1]],d;
        if(e[2]==='v'){d='M'+a.cx+' '+a.B+' L'+b.cx+' '+b.T;}
        else{var x1,x2;if(b.cx<a.cx){x1=a.L;x2=b.R;}else{x1=a.R;x2=b.L;}var mx=(x1+x2)/2;d='M'+x1+' '+a.y+' C'+mx+' '+a.y+' '+mx+' '+b.y+' '+x2+' '+b.y;}
        var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('class','tg-ln'+(e[1]==='m'||e[1]==='out'?' tg-ln-hot':''));svg.appendChild(p);
        var L=p.getTotalLength(),tt=edgeT(e,i);p.style.cssText='--len:'+L.toFixed(1)+';--d:'+tt[0].toFixed(2)+'s;--dur:'+tt[1]+'s';
        paths.push({p:p,from:e[0],to:e[1],len:L});});
    }
    function fit(){var w=host.clientWidth;var k=Math.min(1,w/1160);inner.style.transform='scale('+k+')';host.style.height=(545*k)+'px';}
    function init(){if(getComputedStyle(host).display==='none')return;build();fit();}
    var vis=false,live=false,started=false;
    function start(){if(started)return;started=true;host.classList.add('in');
      if(RM){live=false;return;}
      setTimeout(function(){live=true;},(TM+1.2)*1000);}
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){init();
      if(RM||!('IntersectionObserver' in window)){start();return;}
      new IntersectionObserver(function(en,o){if(en[0].isIntersecting){start();o.disconnect();}},{threshold:0.3}).observe(host);});
    addEventListener('resize',function(){fit();});
    if(!RM&&'IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting;host.classList.toggle('off',!vis);}).observe(host);
    if(RM)return;
    /* pulses keep travelling edge to edge toward the match */
    function nextOf(id){for(var i=0;i<paths.length;i++)if(paths[i].from===id)return paths[i];return null;}
    var pulses=[],last=0,spawnT=0,side=0;
    window.__graphStart=function(){start();}; /* screenshot tooling only */
    function spawn(){if(!paths.length||pulses.length>9)return;var src;side=1-side;
      if(side){var cs=paths.filter(function(p){return /^c/.test(p.from);});src=cs[Math.random()*cs.length|0];}else src=paths.filter(function(p){return p.from==='o1';})[0];
      var dot=document.createElementNS(NS,'circle');dot.setAttribute('r',3.2);dot.setAttribute('class','tg-pulse '+(side?'pb':'py'));svg.appendChild(dot);
      pulses.push({e:src,t:0,dot:dot});}
    function tick(now){requestAnimationFrame(tick);if(!live||!vis||document.hidden||!paths.length){last=now;return;}
      var dt=Math.min(50,now-(last||now));last=now;spawnT+=dt;if(spawnT>700){spawnT=0;spawn();}
      for(var i=pulses.length-1;i>=0;i--){var q=pulses[i];q.t+=dt*0.16/Math.max(40,q.e.len)*1.0;
        if(q.t>=1){if(q.e.to==='m'){el.m.classList.remove('hit');void el.m.offsetWidth;el.m.classList.add('hit');}
          var n=nextOf(q.e.to);if(!n){q.dot.remove();pulses.splice(i,1);if(q.e.to==='out'){el.out.classList.remove('hit');void el.out.offsetWidth;el.out.classList.add('hit');}continue;}
          q.e=n;q.t=0;if(n.from==='m')q.dot.setAttribute('class','tg-pulse pw');}
        var pt=q.e.p.getPointAtLength(q.t*q.e.len);q.dot.setAttribute('cx',pt.x);q.dot.setAttribute('cy',pt.y);}
    }
    requestAnimationFrame(tick);
  })();

  /* ---------- mobile Match list: simple staggered reveal ---------- */
  (function(){var L=document.querySelector('.tg-list');if(!L||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
    var it=L.querySelectorAll('.tgl-col h4,.tgl-k,.tgl-chips li,.tgl-steps li,.tgl-match');
    it.forEach(function(x,i){x.classList.add('tgr');x.style.transitionDelay=Math.min(i*45,1400)+'ms';});
    var cols=L.querySelectorAll('.tgl-col,.tgl-match');
    var io2=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.querySelectorAll('.tgr').forEach(function(x){x.classList.add('on')});if(e.target.classList.contains('tgr'))e.target.classList.add('on');io2.unobserve(e.target);}});},{threshold:0.15});
    cols.forEach(function(c){io2.observe(c);});
  })();

  /* ---------- CTA mini team (photos, static, on dark) ---------- */
  (function(){
    var box=document.querySelector('.cta-team');if(!box)return;var sel=[1,4,5,8,10];
    function paint(){var w=box.clientWidth,n=Math.max(5,Math.min(14,Math.floor(w/52)));var h='';
      for(var i=0;i<n;i++)h+='<span class="ctp'+(i%2?' lo':'')+(sel.indexOf(i)>=0?' sel':'')+'">'+PIMG(i*3+1,44)+'</span>';box.innerHTML=h;}
    paint();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(paint,150);});
  })();

  /* ---------- open at the top (no scroll restoration / stray focus) unless a real #section was requested ---------- */
  (function(){
    try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch(e){}
    var touched=false;['wheel','touchstart','keydown','mousedown'].forEach(function(t){addEventListener(t,function(){touched=true;},{passive:true,once:true});});
    function want(){var h=location.hash.slice(1);return h&&document.getElementById(decodeURIComponent(h));}
    function top(){if(touched)return;var t=want();if(t)return;if(scrollY!==0)scrollTo(0,0);}
    top();addEventListener('DOMContentLoaded',top);addEventListener('load',function(){top();setTimeout(top,300);});
    addEventListener('pageshow',function(e){if(e.persisted)top();});
    document.fonts&&document.fonts.ready.then(top);
  })();

  /* ---------- header ---------- */
  var hdr=document.querySelector('.hdr');
  function hd(){hdr.classList.toggle('scrolled',scrollY>20)}
  addEventListener('scroll',hd,{passive:true});hd();

  /* ---------- reveal ---------- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(function(el,i){el.style.transitionDelay=((i%4)*80)+'ms';io.observe(el)});

  /* ---------- funnel dots ---------- */
  var fn=document.querySelector('.fn');
  if(fn){
    var cols=fn.querySelectorAll('.fn-col');
    cols.forEach(function(col,ci){
      var n=+col.dataset.n,keep=+col.dataset.keep,box=col.querySelector('.dots'),rnd=rng(11+ci),idx=[];
      for(var i=0;i<n;i++)idx.push(i);
      for(i=n-1;i>0;i--){var j=Math.floor(rnd()*(i+1));var t=idx[i];idx[i]=idx[j];idx[j]=t;}
      var kept=idx.slice(0,keep);
      for(i=0;i<n;i++){
        var d=document.createElement('span');d.className='dot '+(kept.indexOf(i)>=0?'keep':'drop');d.innerHTML=PIMG(ci*7+i*3,28);
        if(kept.indexOf(i)>=0&&(col.classList.contains('fn-hi')||col.classList.contains('fn-team')||ci===3))d.classList.add('sel');
        d.style.transitionDelay=(ci*260+i*28)+'ms';box.appendChild(d);
      }
    });
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){fn.classList.add('in');o.disconnect();}},{threshold:.35}).observe(fn);
  }

  /* ---------- tiles in bento + sector panels ---------- */
  var mkN=0;function mk(n,box,sel){box.innerHTML='';mkN+=5;for(var i=0;i<n;i++){var t=document.createElement('span');t.className='mt'+(sel.indexOf(i)>=0?' sel':'');t.innerHTML=PIMG(mkN+i*7,72);box.appendChild(t);}}
  var mini=document.querySelector('.mini-team');
  if(mini){
    var base=[2,5,9,12,19,22,27,30];mk(32,mini,base);
    if(!RM){var r2=rng(3);setInterval(function(){
      var on=mini.querySelectorAll('.mt.sel'),off=mini.querySelectorAll('.mt:not(.sel)');
      on[Math.floor(r2()*on.length)].classList.remove('sel');off[Math.floor(r2()*off.length)].classList.add('sel');
    },900);}
  }
  document.querySelectorAll('.pn-vis').forEach(function(b){mk(9,b,b.dataset.sel.split(',').map(Number))});

  /* ---------- tabs ---------- */
  var tabs=document.querySelectorAll('.tab'),panels=document.querySelectorAll('.panel'),ink=document.querySelector('.tab-ink');
  function setTab(i){
    tabs.forEach(function(t,j){t.classList.toggle('on',i===j);t.setAttribute('aria-selected',i===j)});
    panels.forEach(function(p,j){p.classList.toggle('on',i===j)});
    var t=tabs[i],pr=t.parentElement.getBoundingClientRect(),r=t.getBoundingClientRect();
    ink.style.width=r.width+'px';ink.style.left=(r.left-pr.left+t.parentElement.scrollLeft)+'px';
  }
  tabs.forEach(function(t,i){t.addEventListener('click',function(){setTab(i)})});
  addEventListener('resize',function(){setTab([].indexOf.call(tabs,document.querySelector('.tab.on')))});
  document.fonts&&document.fonts.ready.then(function(){setTab(0)});setTab(0);

  /* ---------- method timeline ---------- */
  var tl=document.querySelector('.tl'),line=document.querySelector('.tl-line i'),steps=document.querySelectorAll('.st');
  function tlu(){
    if(!tl)return;var r=tl.getBoundingClientRect(),vh=innerHeight;
    var p=clamp((vh*0.62-r.top)/r.height,0,1);line.style.height=(p*100)+'%';
    steps.forEach(function(s){var b=s.getBoundingClientRect();s.classList.toggle('on',b.top+b.height*0.4<vh*0.72);});
  }
  addEventListener('scroll',tlu,{passive:true});tlu();

  /* ---------- exit intent: desktop only, once per session ---------- */
  (function(){
    var ex=document.querySelector('.exit');if(!ex||matchMedia('(max-width:1023px)').matches)return;
    var shown=false;try{shown=sessionStorage.getItem('bleazExit')==='1'}catch(e){}
    function open(){if(shown)return;shown=true;try{sessionStorage.setItem('bleazExit','1')}catch(e){}ex.hidden=false;var i=ex.querySelector('input');i&&i.focus({preventScroll:true});}
    function close(){ex.hidden=true;}
    document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<=0&&scrollY>innerHeight)open();});
    ex.querySelector('.exit-x').addEventListener('click',close);
    ex.addEventListener('click',function(e){if(e.target===ex)close();});
    addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    window.__showExit=function(){shown=false;open();}; /* screenshot tooling only */
  })();

  /* ---------- FAQ ---------- */
  var qs=document.querySelectorAll('.acc .q');
  function setQ(q,open){q.classList.toggle('open',open);var a=q.querySelector('.qa');a.style.maxHeight=open?a.scrollHeight+'px':0;}
  qs.forEach(function(q){q.querySelector('.qt').addEventListener('click',function(){var o=!q.classList.contains('open');qs.forEach(function(x){setQ(x,false)});setQ(q,o);});});
  qs.forEach(function(q){if(q.classList.contains('open'))setQ(q,true)});

  /* ---------- preview mode: forms are mocks, nothing is sent anywhere ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      var n=f.querySelector('.demo-note');if(!n){n=document.createElement('p');n.className='demo-note';n.setAttribute('role','status');f.appendChild(n);}
      n.textContent='גרסת תצוגה: הטופס עוד לא מחובר, והפרטים לא נשלחו לשום מקום.';});
  });
  document.querySelectorAll('a.wa,a.cta-wa,a[href="#"]').forEach(function(a){
    if(/וואטסאפ|wa/.test(a.className+a.textContent)){a.addEventListener('click',function(e){e.preventDefault();});a.title='יחובר בהמשך (גרסת תצוגה)';}
  });
})();
