/* Progressive enhancement. All pages and downloads work without JavaScript. */
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  const dropdown = document.querySelector('.nav-dropdown');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = 'Menu <span aria-hidden="true">+</span>';
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? 'Close <span aria-hidden="true">−</span>' : 'Menu <span aria-hidden="true">+</span>';
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.querySelectorAll('.network-button').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    if (dropdown) dropdown.open = false;
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (toggle?.getAttribute('aria-expanded') === 'true') {closeMenu(); toggle.focus();}
      if (dropdown?.open) {dropdown.open = false; dropdown.querySelector('summary').focus();}
    }
    if (e.key === 'Tab' && toggle?.getAttribute('aria-expanded') === 'true') {
      const last = nav.querySelector('a:last-child');
      if (e.shiftKey && document.activeElement === toggle) {e.preventDefault(); last.focus();}
      else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); toggle.focus();}
    }
  });
  document.addEventListener('click', e => {if (dropdown?.open && !dropdown.contains(e.target)) dropdown.open = false;});
  // Keep this breakpoint aligned with the compact tablet navigation in CSS.
  const mobileMedia = window.matchMedia('(max-width: 1024px)');
  mobileMedia.addEventListener('change', e => {if (!e.matches) closeMenu();});

  // Both brand marks return to this page's actual top,
  // including when the page is shown inside the self-contained preview.
  document.querySelectorAll('a[href="#top"]').forEach(link => {
    link.addEventListener('click', e => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      closeMenu();
      if (dropdown) dropdown.open = false;
      const top = document.getElementById('top');
      top?.focus({preventScroll:true});
      window.scrollTo({top:0,left:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
  });

  // A conceptual comparison, explicitly separate from the measured results.
  const pathButtons = [...document.querySelectorAll('[data-path-state]')];
  const stage = document.querySelector('.principle-stage');
  pathButtons.forEach(button => button.addEventListener('click', () => {
    const closed = button.dataset.pathState === 'closed';
    stage.classList.toggle('is-closed', closed);
    pathButtons.forEach(b => {b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button));});
    document.querySelector('#path-heading').textContent = closed ? 'No path back to correction.' : 'Leave room to be wrong.';
    document.querySelector('#path-description').textContent = closed
      ? 'If an action permanently removes a protected system or its capacity for recovery, later evidence cannot undo that loss.'
      : 'Preserve the possibility of correction when fundamental uncertainty remains and irreversible harm is at stake.';
  }));

  const tabs = [...document.querySelectorAll('.record-tabs [role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  if (tabs.length) selectTab(tabs[0]);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') target = tabs[0];
      if (e.key === 'End') target = tabs[tabs.length - 1];
      if (target) {e.preventDefault(); selectTab(target, true);}
    });
  });
  // Reading position uses normal page scrolling; no scroll capture or forced transitions.
  const chapters = [...document.querySelectorAll('.chapter-nav>div>a')];
  if (chapters.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) chapters.forEach(a => {
          const active = a.hash === '#' + entry.target.id;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-10% 0px -55% 0px', threshold:0});
    chapters.forEach(a => {const target = document.querySelector(a.hash); if (target) observer.observe(target);});
  }

  // Original geometric artwork: a field of open trajectories. Not a physics model.
  const canvas = document.querySelector('#possibility-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) return;
  const hero = document.querySelector('.hero');
  const motion = document.querySelector('.motion-toggle');
  const grab = document.querySelector('.ring-interaction');
  const ringTools = document.querySelector('.ring-tools');
  const resetView = document.querySelector('.ring-reset');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, visible = true, frame = 0, time = 0, last = 0;
  let width = 1, height = 1, scale = 1, renderFrame = 0, view = null, drag = null;
  let seed = 192005;
  const random = () => {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296;};
  const stars = Array.from({length:100}, () => ({x:random(),y:random(),r:random() * 1.1 + .2,a:random() * .35 + .04}));
  const points = Array.from({length:1700}, () => ({u:random()*Math.PI*2,v:random()*Math.PI*2,r:random(),a:random(),s:random()}));
  const TAU = Math.PI * 2;
  const MOTION_SPEED = .055 * 1.3;
  // Unit quaternions allow the object to turn freely without locking at its poles.
  function multiply(a,b) {
    return [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
      a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
      a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
      a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
  }
  function axisAngle(x,y,z,angle) {
    const s=Math.sin(angle/2);
    return [x*s,y*s,z*s,Math.cos(angle/2)];
  }
  function currentView() {
    const base=multiply(axisAngle(0,0,1,-.44),multiply(axisAngle(1,0,0,-.42),axisAngle(0,1,0,.40+Math.sin(time*MOTION_SPEED*.35)*.14)));
    // The drag is an offset over the live animation, not a frozen camera pose.
    return view ? multiply(view,base) : base;
  }
  function viewMatrix() {
    const [x,y,z,w]=currentView();
    return [1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w),
      2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w),
      2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)];
  }
  let matrix = viewMatrix();
  function project(u, v, thickness, rotation, cx, cy, radius) {
    const ripple = Math.sin(u * 3 + v * 2) * .025;
    const major = .84 + Math.cos(v) * thickness + ripple;
    let x = major * Math.cos(u), y = major * Math.sin(u), z = Math.sin(v) * thickness;
    const xx=matrix[0]*x+matrix[1]*y+matrix[2]*z;
    const yy=matrix[3]*x+matrix[4]*y+matrix[5]*z;
    z=matrix[6]*x+matrix[7]*y+matrix[8]*z;
    x=xx;y=yy;
    const perspective = 1 / (1 - z * .28);
    return {x:cx+x*radius*perspective,y:cy+y*radius*perspective,z,p:perspective};
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    matrix=viewMatrix();
    const mobile = width < 800;
    const cx = mobile ? width*.72 : width*.755;
    const cy = mobile ? height*.725 : height*.50;
    const radius = mobile ? Math.min(width*.63,330) : Math.min(height*.385,width*.32);
    const glow = ctx.createRadialGradient(cx,cy,radius*.30,cx,cy,radius*1.55);
    glow.addColorStop(0,'rgba(44,97,125,0)');glow.addColorStop(.43,'rgba(60,119,151,.095)');glow.addColorStop(.7,'rgba(44,94,125,.065)');glow.addColorStop(1,'rgba(25,65,85,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    for(const s of stars){ctx.beginPath();ctx.fillStyle=`rgba(180,218,240,${s.a})`;ctx.arc(s.x*width,s.y*height,s.r,0,TAU);ctx.fill();}
    const rotation = time*MOTION_SPEED;
    // Fine continuous filaments form the object rather than a solid sphere.
    const filamentCount = width <= 540 ? 26 : 42;
    const filamentSegments = width <= 540 ? 100 : 150;
    for(let j=0;j<filamentCount;j++){
      const v = j/filamentCount*TAU + rotation*.4;
      ctx.beginPath();
      for(let i=0;i<=filamentSegments;i++){
        const u=.20+i/filamentSegments*(TAU-.40)+rotation*.20;
        const p=project(u,v,.185,rotation,cx,cy,radius);
        if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
      }
      const brightness = .045 + (Math.sin(v)+1)*.035;
      ctx.strokeStyle=`rgba(159,211,243,${brightness})`;ctx.lineWidth=.55;ctx.stroke();
    }
    ctx.globalCompositeOperation='lighter';
    const pointCount = width <= 540 ? 1000 : points.length;
    for(let pointIndex=0;pointIndex<pointCount;pointIndex++){
      const dot = points[pointIndex];
      const u=.18+dot.u/TAU*(TAU-.36)+rotation*.20;
      const p=project(u,dot.v+rotation*.4,.17+dot.r*.07,rotation,cx,cy,radius);
      const front = (p.z+.5)/1.0;
      const lum = .18+dot.a*.65;
      const alpha = Math.max(.1,Math.min(.94,lum*(.65+front*.4)));
      const size = (.35+dot.s*.75)*p.p;
      const hot=dot.a>.977;
      ctx.fillStyle = hot ? `rgba(255,226,207,${alpha})` : `rgba(175,218,248,${alpha})`;
      ctx.beginPath();ctx.arc(p.x,p.y,hot?size*1.7:size,0,TAU);ctx.fill();
      if(hot){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,11);g.addColorStop(0,'rgba(214,238,255,.20)');g.addColorStop(1,'rgba(154,213,255,0)');ctx.fillStyle=g;ctx.fillRect(p.x-11,p.y-11,22,22);}
    }
    // A few longer trajectories escape the ring: the future stays open.
    for(let j=0;j<7;j++){
      ctx.beginPath();
      for(let i=0;i<=130;i++){
        const u=.2+i/130*(TAU-.6)+rotation*.2;
        const p=project(u,j*.85,.29+j*.018,rotation,cx,cy,radius);
        if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
      }
      ctx.strokeStyle=`rgba(144,207,247,${.06+j*.008})`;ctx.lineWidth=.65;ctx.stroke();
    }
    ctx.globalCompositeOperation='source-over';
  }
  function tick(timestamp){
    frame=0;
    if(paused||!visible||document.hidden)return;
    if(timestamp-last>=(drag?16:32)){time+=Math.min((timestamp-last)/1000,.05);last=timestamp;draw();}
    frame=requestAnimationFrame(tick);
  }
  function schedule(){if(!frame&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
  function queueDraw(){
    // Reuse the animation frame while running; redraw manually while paused.
    if(!paused&&visible&&!document.hidden){schedule();return;}
    if(!renderFrame)renderFrame=requestAnimationFrame(()=>{renderFrame=0;draw();});
  }
  function turn(dx,dy){
    const distance=Math.hypot(dx,dy);
    if(!distance)return;
    const sensitivity=Math.PI/Math.max(260,Math.min(width,height)*.7);
    const delta=axisAngle(-dy/distance,dx/distance,0,distance*sensitivity);
    const next=multiply(delta,view||[0,0,0,1]);
    const length=Math.hypot(...next);
    view=next.map(n=>n/length);queueDraw();
  }
  function endDrag(event){
    if(!drag||(event&&event.pointerId!==drag.id))return;
    const id=drag.id;drag=null;grab.classList.remove('is-dragging');
    if(grab.hasPointerCapture(id))grab.releasePointerCapture(id);
  }
  function resize(){
    const rect=hero.getBoundingClientRect();width=rect.width;height=rect.height;scale=Math.min(window.devicePixelRatio||1,width<=540?1.5:1.7);
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);ctx.setTransform(scale,0,0,scale,0,0);
    if(grab){
      const mobile=width<800;
      const radius=mobile?Math.min(width*.63,330):Math.min(height*.385,width*.32);
      // On narrow screens leave a strip beside the ring for normal page scrolling.
      const hitRadius=mobile?Math.min(radius*1.12,width*.43):radius*1.2;
      const cx=width*(mobile?.72:.755),cy=height*(mobile?.725:.5);
      Object.assign(grab.style,{left:`${cx-hitRadius}px`,top:`${cy-hitRadius}px`,width:`${hitRadius*2}px`,height:`${hitRadius*2}px`});
    }
    draw();schedule();
  }
  function updateMotion(){motion.hidden=false;motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Play animation':'Pause animation');motion.innerHTML=paused?'<span aria-hidden="true">▷</span> Play motion':'<span aria-hidden="true">Ⅱ</span> Pause motion';}
  motion.addEventListener('click',()=>{paused=!paused;updateMotion();if(paused&&frame){cancelAnimationFrame(frame);frame=0;}else schedule();});
  reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();if(paused&&frame){cancelAnimationFrame(frame);frame=0;draw();}else schedule();});
  if(grab){
    grab.hidden=false;
    if(ringTools)ringTools.hidden=false;
    grab.addEventListener('pointerdown',e=>{
      if(drag||e.isPrimary===false||e.button!==0)return;
      e.preventDefault();
      drag={id:e.pointerId,x:e.clientX,y:e.clientY};
      grab.setPointerCapture(e.pointerId);grab.classList.add('is-dragging');
      grab.focus({preventScroll:true});
    });
    grab.addEventListener('pointermove',e=>{
      if(!drag||e.pointerId!==drag.id)return;
      if(e.pointerType==='mouse'&&(e.buttons&1)===0){endDrag(e);return;}
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      drag.x=e.clientX;drag.y=e.clientY;turn(dx,dy);
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>grab.addEventListener(type,endDrag));
    grab.addEventListener('dragstart',e=>e.preventDefault());
    grab.addEventListener('keydown',e=>{
      const steps={ArrowLeft:[-18,0],ArrowRight:[18,0],ArrowUp:[0,-18],ArrowDown:[0,18]};
      if(steps[e.key]){e.preventDefault();turn(...steps[e.key]);}
      if(e.key==='Home'){e.preventDefault();reset();}
      if(e.key==='Escape')endDrag();
    });
    window.addEventListener('blur',()=>endDrag());
  }
  function reset(){endDrag();view=null;queueDraw();}
  resetView?.addEventListener('click',reset);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();else if(frame){cancelAnimationFrame(frame);frame=0;}});
  new ResizeObserver(resize).observe(hero);
  updateMotion();resize();
})();
