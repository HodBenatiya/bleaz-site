/* BLEAZ · Direction E — interaction layer. Signature: "the team assembling" (canvas, scroll-driven). */
(function(){
  'use strict';
  var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp=function(v,a,b){return v<a?a:v>b?b:v};
  var lerp=function(a,b,t){return a+(b-a)*t};
  var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}; /* easeInOutCubic */
  var easeOut=function(t){return 1-Math.pow(1-t,3)};
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}

  /* ---------- tile renderer (duotone abstract portrait frame) ---------- */
  var C={paper:'#F6F7FA',stroke:'#E6E2E3',fig:'#C1C7CF',ink:'#26114A',v:'#B99AFF',o:'#9B6FFF',m:'#7D43FF',p:'#7D43FF'};
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
      if(k>0.5){ctx.globalAlpha=alpha*(k-.5)*0.5;ctx.shadowColor='rgba(125,67,255,.55)';ctx.shadowBlur=s*0.5;ctx.fill();ctx.shadowBlur=0;}
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
      ctx.beginPath();ctx.arc(cx,cy,cr+Math.max(1.5,s*0.03),0,Math.PI*2);ctx.fillStyle=dark?'#26114A':'#fff';ctx.fill();
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
        ctx.fillStyle='rgba(125,67,255,'+(0.22*a)+')';ctx.fillRect(bx-22,0,44,H);
        ctx.fillStyle='rgba(125,67,255,'+(0.95*a)+')';ctx.fillRect(bx-1,H*0.12,2,H*0.76);
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


  /* ---------- HERO v6: people pop around the pedestal ---------- */
  (function(){
    var box=document.querySelector('.hx .avs');if(!box)return;
    var P=[[12,34,56,1,.15],[22,68,46,3,.3],[30,24,40,4,.45],[6,70,34,2,.6],[36,54,34,5,.75],[18,10,30,2,.9],[41,12,28,1,1.05],
           [88,34,56,2,.2],[78,68,46,4,.35],[70,24,40,1,.5],[94,70,34,3,.65],[64,54,34,5,.8],[82,10,30,4,.95],[59,12,28,3,1.1]];
    var html='';
    P.forEach(function(p,i){html+='<span class="av v'+p[3]+'" style="--x:'+p[0]+'%;--y:'+p[1]+'%;--s:'+p[2]+'px;--d:'+p[4]+'s;--f:'+(3.6+(i%5)*.55)+'s"><i><svg><use href="#i-person"/></svg></i></span>';});
    html+='<span class="av av-main" style="--x:50%;--y:41%;--s:96px;--d:1.35s;--f:4.2s"><i><svg><use href="#i-person"/></svg></i><b class="av-chk"><svg viewBox="0 0 24 24"><path d="m6.5 12.5 3.6 3.6 7.4-7.6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></b></span>';
    box.innerHTML=html;
    requestAnimationFrame(function(){document.querySelector('.hx').classList.add('go');});
  })();

  /* ---------- CTA mini team (static, on dark) ---------- */
  (function(){
    var cv=document.querySelector('.cta-team');if(!cv)return;
    function paint(){
      var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;
      var ctx=cv.getContext('2d');ctx.setTransform(d,0,0,d,0,0);
      var n=Math.floor(r.width/56),s=Math.min(44,r.height*0.36),sel=[1,4,5,8,10];
      for(var i=0;i<n;i++){var row=i%2;tile(ctx,r.width-28-i*52,r.height/2+(row?s*0.55:-s*0.55),s,1,sel.indexOf(i)>=0?1:0,sel.indexOf(i)>=0?1:0,true);}
    }
    paint();window.addEventListener('resize',paint);
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
        var d=document.createElement('span');d.className='dot '+(kept.indexOf(i)>=0?'keep':'drop');
        if(kept.indexOf(i)>=0&&(col.classList.contains('fn-hi')||col.classList.contains('fn-team')||ci===3))d.classList.add('sel');
        d.style.transitionDelay=(ci*260+i*28)+'ms';box.appendChild(d);
      }
    });
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){fn.classList.add('in');o.disconnect();}},{threshold:.35}).observe(fn);
  }

  /* ---------- tiles in bento + sector panels ---------- */
  function mk(n,box,sel){box.innerHTML='';for(var i=0;i<n;i++){var t=document.createElement('span');t.className='mt'+(sel.indexOf(i)>=0?' sel':'');box.appendChild(t);}}
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
    function open(){if(shown)return;shown=true;try{sessionStorage.setItem('bleazExit','1')}catch(e){}ex.hidden=false;var i=ex.querySelector('input');i&&i.focus();}
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
